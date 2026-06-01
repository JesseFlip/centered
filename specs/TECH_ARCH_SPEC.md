# Technical Architecture Spec — Personal Brand Sync Platform (Persona)

**Companion to:** PRD_ProfileSync.md
**Status:** Draft v1.0
**Last updated:** 2026-06-01
**Audience:** Engineering team
**Build model:** Claude Code + Spec-Driven Development
**Target:** Installable PWA, optimized for desktop, mobile, and tablet

> Version numbers below were verified against current releases as of June 2026. Pin exact versions at repo-init time and let the spec-driven workflow (§9) keep them current.

---

## 1. Architectural Principles

1. **Spec is the primary artifact.** Code is generated from specs, not the other way around. Every feature flows spec → plan → tasks → implementation, with human review at each boundary (§9).
2. **Local-first, offline-capable.** The Core Profile lives on-device (IndexedDB) and syncs to the server. The app is fully usable offline; edits queue and reconcile on reconnect.
3. **Agents propose, the user disposes.** No agent mutates a channel or the Core Profile without an approved Proposal. This is enforced at the data layer, not just the UI.
4. **One codebase, all platforms.** A single responsive PWA covers desktop/mobile/tablet; no separate native apps in v1. Install, offline, and push are first-class.
5. **Type-safety end to end.** Schema → DB → server functions → client → agent I/O all share generated TypeScript types and runtime validation.
6. **Cost- and latency-aware AI.** Agent calls are debounced, batched, cached, and streamed. The cheap model handles classification/triage; the strong model handles generation.

---

## 2. Recommended Stack (mid-2026)

| Layer | Choice | Why / Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack stable by default) | RSC, server actions, streaming; Turbopack now default for dev+build. |
| UI runtime | **React 19.2** + **React Compiler 1.0** | Auto-memoization (no manual `useMemo`/`useCallback`); View Transitions, `useEffectEvent`, `Activity`. |
| Language | **TypeScript 5.x** (strict) | End-to-end types. |
| Styling | **Tailwind CSS v4** + a headless component layer (Radix-based, e.g., shadcn/ui) | Tokens for responsive/adaptive theming; accessible primitives. |
| Client data / reactivity | **TanStack Query** + **TanStack DB** | Reactive client store with live queries; lowest-risk local-first entry point. |
| Sync engine | **ElectricSQL** (Postgres → client sync) | Pairs natively with TanStack DB; partial replication of the user's data. |
| ORM / schema | **Drizzle ORM** | Type-safe SQL, schema is the source for generated types; migrations. |
| Database | **PostgreSQL** (serverless, e.g., Neon — scales to zero) | Relational fit for the Core Profile graph; pgvector for embeddings. |
| Local storage | **IndexedDB** (via the sync layer; never localStorage for app data) | Structured, large, async; backs offline mode. |
| Service worker / PWA | **Serwist** | Generates the SW at build; precache shell, runtime caching, offline fallback. |
| Auth | OIDC provider (Auth.js / managed auth) with passkeys (WebAuthn) | Passwordless-first; scoped tokens for channel integrations. |
| Agent execution | **Claude Agent SDK** (subagents, isolated context) | Per-agent worker with its own context window; parallel subagents. |
| Agent orchestration | **LangGraph** for the multi-agent graph; Agent SDK inside nodes | Durable workflow, human-in-the-loop checkpoints, retries. |
| Background jobs / queue | Durable queue (e.g., a workflow/queue service) | Debounced sync fan-out, long-running generation, scheduled digests. |
| Vector search | **pgvector** in Postgres | Semantic dedup, JD↔profile matching, skill evidence linking. |
| Observability | OpenTelemetry + an LLM-trace tool (token, latency, cost, eval scores) | Trace every agent invocation end to end. |
| Testing | Vitest (unit), Playwright (E2E + PWA/offline), agent eval harness | See §10. |

**Why this shape:** Next.js 16 + React Compiler removes most manual perf work and gives a strong PWA-capable base. The TanStack DB + ElectricSQL + Drizzle + Postgres quartet is the modern local-first path — it gives offline edits, live queries, and type-safe server access without inventing a custom sync protocol. Claude Agent SDK is the natural execution engine for a Claude-driven product; LangGraph wraps it when the workflow needs durable, multi-step, human-in-the-loop orchestration.

---

## 3. System Architecture (high level)

```
┌──────────────────────── Client (PWA) ────────────────────────┐
│  Next.js 16 / React 19.2 UI                                   │
│  ├─ Core Profile editor, Proposal review queue, diff viewer   │
│  ├─ TanStack DB (live queries)  ←→  IndexedDB (offline cache)  │
│  └─ Serwist service worker (shell precache, runtime caching)  │
└───────────────▲───────────────────────────────▲──────────────┘
                │ ElectricSQL sync (partial replication)
                │                                │ HTTPS / server actions
┌───────────────┴────────────────────────────────┴─────────────┐
│  Server (Next.js server fns + API)                            │
│  ├─ Drizzle ORM → PostgreSQL (Core Profile, Proposals, audit) │
│  ├─ pgvector (embeddings: dedup, JD matching, evidence)       │
│  └─ Auth / token vault (scoped channel credentials)           │
└───────────────▲───────────────────────────────────────────────┘
                │ enqueue
┌───────────────┴───────────────────────────────────────────────┐
│  Agent Orchestration (LangGraph graph)                        │
│  ├─ Organizer  ├─ Resume  ├─ LinkedIn  ├─ Site  ├─ Targeting  │
│  └─ Each node runs a Claude Agent SDK subagent (own context)  │
│        → emits Proposals back into Postgres → syncs to client │
└───────────────▲───────────────────────────────────────────────┘
                │ adapters
        Channel integrations: Resume export, LinkedIn, Site platform
```

The client never calls model APIs directly. A Core Profile change enqueues an orchestration run; agents write **Proposals** to Postgres; ElectricSQL syncs them down; the user reviews and accepts; accepted Proposals materialize channel outputs.

---

## 4. Data Layer (expands PRD §3)

- **Schema in Drizzle** is the single source. It generates TS types consumed by server functions, client queries, and agent I/O contracts. Migrations are versioned and reviewed.
- **Core Profile as a graph in Postgres.** Entities from PRD §3.1 become tables with explicit relations (e.g., `skill_evidence` links a `skill` to the `experience`/`project` that supports it — this powers the organizer's "unsupported skill" detection).
- **Every row carries metadata columns:** `source`, `last_updated`, `visibility` (channel bitmask/array), `verified` (bool), `confidence` (float for agent-inferred values).
- **Proposals are a first-class table** (PRD §3.3): `type`, `channels`, `before` (jsonb), `after` (jsonb), `rationale`, `priority`, `status`, `created_by_agent`, timestamps. The review queue is just a live query over pending Proposals.
- **Append-only audit log** for every accepted/rejected/dismissed Proposal and every Core Profile mutation — supports versioning/revert (PRD FR-2, FR-14) and powers eval datasets.
- **Embeddings (pgvector):** each bullet, skill, and the full profile gets an embedding for semantic dedup, JD-to-profile matching (Targeting Agent), and evidence linking.
- **Sync scope:** ElectricSQL replicates only the authenticated user's rows (shape/partial replication). Even though v1 is single-user, isolation is enforced at the sync boundary.

---

## 5. PWA & Cross-Platform (expands PRD: "optimized for all platforms")

### 5.1 Installability & manifest
- Web App Manifest with maskable icons, `display: standalone`, theme/background colors, shortcuts, and screenshots for richer install prompts on desktop and Android.
- iOS: handle Safari's install constraints (apple-touch-icon, splash, standalone meta); document the "Add to Home Screen" path.
- A custom in-app install prompt driven by `beforeinstallprompt` (where supported) with a graceful fallback.

### 5.2 Offline & caching (Serwist)
- **App shell precache** at build; **runtime caching** strategies per resource: network-first for profile data, stale-while-revalidate for static assets, cache-first for fonts/icons.
- **Offline fallback** route for navigations.
- **`reloadOnOnline: false`** to avoid forced reloads that would wipe an in-progress edit; rely on real-time local persistence instead.
- **Disable the SW in dev** except when explicitly debugging PWA behavior, to avoid stale-cache confusion.
- All app data in **IndexedDB via the sync layer** — never localStorage (localStorage is synchronous, tiny, and string-only; banned for profile data).

### 5.3 Offline editing & sync
- Edits write locally to TanStack DB / IndexedDB immediately (optimistic), queue as pending mutations, and reconcile via ElectricSQL on reconnect.
- Online/offline state is surfaced in the UI; pending-sync badges per channel (PRD FR-15).
- Conflict handling reuses the Proposal mechanism: a server-side change that conflicts with a queued local edit becomes a "which wins" Proposal (PRD FR-7).

### 5.4 Responsive & adaptive
- Mobile-first layout; fluid type and spacing tokens; the Proposal diff viewer adapts from side-by-side (desktop) to stacked (mobile).
- Respect `prefers-reduced-motion` (React 19 View Transitions are progressive, not required); dark/light via tokens; full keyboard nav and ARIA on Radix primitives.
- Touch targets, safe-area insets, and virtual-keyboard-aware editing on mobile.

### 5.5 Notifications
- Web Push (VAPID) for the return-visit digest and "channels drifted" nudges, gated behind explicit opt-in and the proactivity level (PRD FR-11). Background Sync API to flush queued mutations when the network returns.

---

## 6. Agent Layer (expands PRD §4)

### 6.1 Orchestration with LangGraph + Claude Agent SDK
- The **orchestrator is a LangGraph graph**: nodes are agents, edges encode ordering and conditional routing, and the graph is **durable** (survives restarts) with **human-in-the-loop checkpoints** at every Proposal boundary.
- Each node runs a **Claude Agent SDK subagent** with its **own isolated context window**, returning only Proposals (not raw context) to the orchestrator — this keeps token usage bounded and agents independent.
- A single Core Profile change fans out to the relevant channel agents **in parallel**; the orchestrator de-duplicates overlapping Proposals before assembling the review queue (PRD §4.6).
- **Failure isolation:** a node failure marks only that channel "pending/failed" and never blocks the others (PRD NFR reliability).

### 6.2 Agent contracts
Each agent has a typed I/O contract (input = relevant Core Profile slice + channel mapping + preferences; output = `Proposal[]`). Contracts are part of the spec and validated at runtime (e.g., zod/valibot) so a malformed agent output can't corrupt the queue.

### 6.3 Model routing & cost control
- **Triage/classification** (which suggestions are worth surfacing, dedup, priority scoring): cheap/fast model.
- **Generation/rewrite** (resume bullets, LinkedIn about, site narrative): strong model, streamed to the UI.
- **Debounce on edit** (no per-keystroke calls), batch fan-out, and cache by `(input hash, target)` so identical inputs don't re-spend tokens (supports PRD reproducibility NFR).

### 6.4 Organizer initiative model (expands PRD §4.1 / FR-10)
- Maintains a **suggestion backlog** scored by `impact × goal-alignment ÷ effort`.
- A **surfacing policy** decides what to show now vs. hold: caps per session, respects proactivity level, and remembers dismissals (don't re-surface unless the underlying context changes — tracked via content hashes).
- **Return-visit digest** is a scheduled/background job (queue + Web Push) that diffs profile state since last visit, detects stale items (e.g., a 5-year "present" role) and channel drift, and produces a ranked, capped digest.

### 6.5 Anti-hallucination (enforces PRD §7)
- Agents operate **retrieval-grounded** on the Core Profile; any value not present is emitted as a `needs-confirmation` Proposal, never asserted.
- A post-generation **verifier pass** checks that no new dates/titles/metrics appear that aren't traceable to a Core Profile field; violations are blocked or downgraded to `needs-confirmation`.
- All agent-inferred fields land as `verified: false` until the user confirms.

---

## 7. Integrations (expands PRD §5)

- **Adapter interface per channel** (`import()`, `renderProposal()`, `publish()`), so site platforms and export targets are pluggable.
- **Resume:** import via PDF/DOCX parsing (LLM-assisted, with an import-review step because parsing is lossy); export via a templating + render service to PDF/DOCX, ATS-clean.
- **LinkedIn:** v1 uses the official data export for import and a guided copy-paste flow for writes (direct API writes are constrained — see PRD §10 risk). Token vault ready for API write as a fast-follow.
- **Personal site:** one adapter first (recommend a headless/markdown or API-driven builder), publishing through the platform API; others follow.
- **Secrets:** channel credentials in a scoped, encrypted token vault; least-privilege scopes; per-channel revoke.

---

## 8. Security, Privacy, Performance (expands PRD §7–8)

- **PII-grade handling:** encrypt at rest and in transit; field-level access control; full export and hard delete (PRD §7).
- **Tenant isolation by design** even in single-user v1 (row-level security in Postgres; sync shapes scoped to the user).
- **Performance budgets:** define and CI-enforce Core Web Vitals (LCP/INP/CLS) and a bundle budget; React Compiler handles most render-perf; route-level code splitting and RSC keep the shell small.
- **Latency SLO:** single-change Proposal fan-out p95 target (e.g., < 5s); inline suggestions feel instant via optimistic local writes + streamed generation.
- **Determinism:** cache + explicit "regenerate" control instead of silent re-runs (PRD NFR).

---

## 9. Spec-Driven Development Workflow (how it's built with Claude Code)

The repo is structured so that **specs are the maintained artifact and code is generated from them**, using GitHub **Spec Kit** inside **Claude Code**.

### 9.1 The loop (per feature)
1. **`/specify`** — write the feature spec: *what* to build and *why*, acceptance criteria (reuse PRD §12 style). Human review.
2. **`/plan`** — Claude Code proposes the technical plan: *which* files, components, schema changes, and *in what steps*, constrained by this stack. Human review.
3. **`/tasks`** — decompose the plan into a checklist of discrete, individually reviewable tasks. Human review.
4. **`/implement`** — the implementation agent executes tasks against the plan. Because decisions are pre-approved, mid-implementation interruptions drop sharply.
5. **Verify** — tests + agent evals (§10) run; diffs reviewed; spec updated if reality diverged.

Review happens at three upfront gates (spec, plan, tasks) rather than dozens of times mid-build — this is the core productivity win of SDD and keeps long Claude Code sessions from drifting.

### 9.2 Repo conventions for Claude Code
- A root **`CLAUDE.md`** capturing stack decisions, conventions, the "agents propose / user disposes" invariant, and "never use localStorage for app data" guardrails — so every Claude Code session inherits context.
- **`/specs`** directory holding spec → plan → tasks per feature, version-controlled alongside code; the PRD and this doc are the top-level specs.
- **Subagents** for parallelizable work (e.g., one agent per channel adapter), mirroring the runtime agent topology.
- Keep specs small and feature-scoped; long single sessions degrade — prefer many short spec→implement cycles.

### 9.3 Why SDD fits this product specifically
The app *is* an agent product with strict invariants (no fabrication, no silent writes, channel isolation). Encoding those invariants in specs — and regenerating code from them — keeps the invariants enforced as the codebase grows, rather than relying on tribal memory.

---

## 10. Testing & Evaluation

- **Unit:** Vitest for data-layer logic, mapping/transform rules, the surfacing policy.
- **E2E + PWA:** Playwright, including **offline scenarios** (simulate offline, verify edits queue and reconcile), install flow, and the diff-review UX across breakpoints.
- **Agent evals (critical):** a harness over a labeled dataset of Core Profile states → expected Proposal behavior. Track acceptance rate, hallucination rate (must be ~0 for fabricated facts), dedup correctness, and digest ranking quality. Gate releases on eval thresholds.
- **Observability in prod:** OpenTelemetry traces + LLM-trace tooling for token/cost/latency per agent run; alert on cost spikes and latency-SLO breaches.

---

## 11. Section-by-Section Expansion Map (PRD → this spec)

- PRD §1 Overview → Principles (§1), Architecture (§3)
- PRD §3 Data Model → Data Layer (§4), Drizzle/Postgres/pgvector
- PRD §4 Agents → Agent Layer (§6): LangGraph + Claude Agent SDK, routing, initiative model, anti-hallucination
- PRD §5 Integrations → Integrations (§7): adapter interface, token vault
- PRD §6 Functional Reqs → enforced in Data Layer + Agent contracts (§4, §6.2)
- PRD §7 Trust/Safety → Security (§8) + Anti-hallucination (§6.5)
- PRD §8 NFRs → Security/Privacy/Performance (§8)
- PRD §9 Metrics → Observability + evals (§10)
- PRD "all platforms / PWA" → PWA & Cross-Platform (§5)
- PRD §11 Phases → mapped to SDD feature loops (§9)

---

## 12. Open Technical Decisions

- **Sync engine final call:** ElectricSQL vs. Zero vs. LiveStore — ElectricSQL recommended for the TanStack DB pairing and Postgres backend; revisit if event-sourcing (LiveStore) becomes desirable for the audit log.
- **Hosting/runtime:** edge vs. node runtime for server functions given agent latency and queue needs.
- **First personal-site platform** to adapt (carried from PRD §10).
- **LinkedIn write path** pending current API terms (carried from PRD §10).
- **Auth provider** and passkey rollout scope.
- **Exact version pins** — set at repo init; SDD plan step keeps them tracked.

---

## Sources

- [Upgrading to Next.js 16](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js blog](https://nextjs.org/blog) · [Next.js releases](https://github.com/vercel/next.js/releases)
- [React latest version — VersionLog](https://versionlog.com/react/)
- [Spec-Driven Development with Claude Code — DataCamp](https://www.datacamp.com/tutorial/spec-driven-development-with-claude-code)
- [Spec Kit + Claude Code case study — OrangeLoops](https://orangeloops.com/2026/05/spec-driven-development-with-ai-a-spec-kit-claude-code-case-study/)
- [Build a Next.js 16 PWA with true offline support — LogRocket](https://blog.logrocket.com/nextjs-16-pwa-offline-support/)
- [Building Offline Apps with Next.js and Serwist — DEV](https://dev.to/sukechris/building-offline-apps-with-nextjs-and-serwist-2cbj)
- [LangGraph + Claude Agent SDK guide — mager.co](https://www.mager.co/blog/2026-03-07-langgraph-claude-agent-sdk-ultimate-guide/)
- [Building agents with the Claude Agent SDK — Anthropic](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Choosing a Sync Engine for Local-First in 2026 — johnny.sh](https://johnny.sh/blog/choosing-a-sync-engine-in-2026/)
- [Super-fast apps on sync with Electric and TanStack DB — ElectricSQL](https://electric-sql.com/blog/2025/07/29/local-first-sync-with-tanstack-db)
- [TanStack DB vs Zero vs LiveStore — PkgPulse](https://www.pkgpulse.com/guides/tanstack-db-vs-zero-vs-livestore-sync-engines-2026)
