# CLAUDE.md — Persona Development Context

**Project:** Personal Brand Sync Platform (Persona)
**Last updated:** 2026-06-01
**Purpose:** This file provides essential context for every Claude Code session. Read this first.

---

## Project Overview

Persona is a **local-first, AI-assisted personal brand management platform** that helps users maintain a single source of truth (the **Core Profile**) and automatically sync/adapt it across multiple channels (resume, LinkedIn, personal site, etc.).

**Core user promise:**
Update your profile once; intelligent agents propose channel-specific adaptations; you review and approve; changes publish everywhere.

**Critical invariant:**
**Agents propose, the user disposes.** No agent can mutate the Core Profile or any channel without an approved Proposal. This is enforced at the data layer, not just the UI.

---

## Stack & Dependencies (verified mid-2026)

### Framework & Runtime
- **Next.js 16** (App Router, Turbopack default)
- **React 19.2** with **React Compiler 1.0** (auto-memoization; no manual `useMemo`/`useCallback`)
- **TypeScript 5.x** (strict mode)

### UI & Styling
- **Tailwind CSS v4** (token-based theming)
- **Radix UI** primitives (via shadcn/ui or similar) for accessibility
- Responsive/adaptive design; mobile-first

### Data Layer
- **PostgreSQL** (serverless, e.g., Neon — scales to zero)
- **Drizzle ORM** — schema is the single source of truth; generates TypeScript types
- **pgvector** — for embeddings (semantic dedup, JD matching, skill evidence)
- **TanStack DB** + **ElectricSQL** — local-first sync; client-side reactive queries; IndexedDB backing
- **NEVER use localStorage for app data** — only IndexedDB via the sync layer (localStorage is sync, tiny, string-only)

### Agent Layer
- **Claude Agent SDK** — per-agent execution in isolated subagents
- **LangGraph** — orchestration graph with durable workflows, human-in-the-loop checkpoints
- **Model routing:**
  - Cheap/fast model: triage, classification, dedup, priority scoring
  - Strong model: generation, rewriting (resume bullets, LinkedIn about, etc.)
- Debounce edits; batch fan-out; cache by input hash

### PWA & Offline
- **Serwist** — service worker generation; precache app shell; runtime caching strategies
- **IndexedDB** (via sync layer) — structured, async, large; backs offline mode
- Offline editing with queued mutations that reconcile on reconnect
- Web App Manifest for installability (desktop, mobile, tablet)
- Background Sync API + Web Push (VAPID) for notifications

### Auth & Security
- **OIDC provider** (Auth.js or managed auth) with **passkeys (WebAuthn)** — passwordless-first
- Token vault for scoped channel credentials (least-privilege, per-channel revoke)
- Encrypt PII at rest and in transit; row-level security in Postgres; field-level access control

### Testing & Observability
- **Vitest** — unit tests
- **Playwright** — E2E, PWA/offline scenarios, install flow, responsive breakpoints
- **Agent eval harness** — acceptance rate, hallucination rate (must be ~0), dedup correctness, ranking quality
- **OpenTelemetry** + LLM-trace tooling — token/cost/latency per agent run

---

## Architectural Principles (Critical — Enforce Always)

1. **Spec is the primary artifact.**
   Code is generated from specs. Every feature flows: spec → plan → tasks → implementation, with human review at each boundary. See §Workflow below.

2. **Local-first, offline-capable.**
   The Core Profile lives on-device (IndexedDB via TanStack DB + ElectricSQL) and syncs to the server. The app is fully usable offline; edits queue and reconcile on reconnect.

3. **Agents propose, the user disposes.**
   No agent mutates the Core Profile or any channel without an approved Proposal. This is enforced at the data layer via a `Proposal` table and review queue. All agent outputs are Proposals, not direct writes.

4. **One codebase, all platforms.**
   A single responsive PWA covers desktop/mobile/tablet. No separate native apps in v1. Install, offline, and push notifications are first-class.

5. **Type-safety end to end.**
   Schema (Drizzle) → DB → server functions → client → agent I/O all share generated TypeScript types and runtime validation (zod/valibot).

6. **Cost- and latency-aware AI.**
   Agent calls are debounced, batched, cached, and streamed. Never call models per-keystroke. Cache by `(input hash, target)` to avoid re-spending tokens on identical inputs.

---

## Data Layer Invariants

### Schema
- **Drizzle schema is the single source.** It generates TS types for all layers.
- **Core Profile as a graph in Postgres:** entities (experiences, projects, skills, education, etc.) with explicit relations (e.g., `skill_evidence` links a skill to the experience/project that supports it).
- **Every row carries metadata:**
  - `source` (string) — where this data came from (import, user entry, agent-inferred)
  - `last_updated` (timestamp)
  - `visibility` (channel bitmask/array) — which channels see this field
  - `verified` (boolean) — user confirmed? (agent-inferred values default to false)
  - `confidence` (float 0–1) — for agent-inferred values

### Proposals Table
- `id`, `type`, `channels` (array), `before` (jsonb), `after` (jsonb), `rationale` (text), `priority` (int), `status` (pending/accepted/rejected/dismissed), `created_by_agent`, `created_at`, `reviewed_at`, `reviewed_by_user`
- The review queue is a live query over `status = 'pending'`.
- Agents write Proposals; orchestrator de-duplicates; client syncs them down; user reviews.

### Audit Log
- Append-only log of every accepted/rejected/dismissed Proposal and every Core Profile mutation.
- Powers versioning/revert, eval datasets, and compliance.

### Embeddings (pgvector)
- Each bullet, skill, and the full profile gets an embedding.
- Used for: semantic dedup, JD-to-profile matching (Targeting Agent), evidence linking.

### Sync
- ElectricSQL replicates only the authenticated user's rows (partial replication).
- Even in single-user v1, tenant isolation is enforced at the sync boundary (row-level security).

---

## Agent Layer Rules

### Execution Model
- **LangGraph orchestration graph:** nodes = agents; edges = ordering/conditionals.
- **Durable, human-in-the-loop:** checkpoints at every Proposal boundary; survives restarts.
- Each node runs a **Claude Agent SDK subagent** with its **own isolated context window**.
- Parallel fan-out: a Core Profile change fans out to all relevant channel agents; orchestrator de-duplicates Proposals before assembling the queue.
- **Failure isolation:** a node failure marks only that channel "pending/failed"; never blocks others.

### Agent Contracts
- Each agent has a **typed I/O contract** (input = Core Profile slice + channel mapping + preferences; output = `Proposal[]`).
- Contracts are in specs and validated at runtime (zod/valibot).
- A malformed agent output must never corrupt the queue.

### Anti-Hallucination (Zero Tolerance)
- Agents operate **retrieval-grounded** on the Core Profile. Any value not present is emitted as a `needs-confirmation` Proposal, never asserted.
- A **verifier pass** checks that no new dates/titles/metrics appear that aren't traceable to a Core Profile field. Violations are blocked or downgraded to `needs-confirmation`.
- All agent-inferred fields land as `verified: false` until the user confirms.
- **Hallucination rate in evals must be ~0.** Gate releases on this metric.

### Organizer Initiative Model
- Maintains a **suggestion backlog** scored by `impact × goal-alignment ÷ effort`.
- **Surfacing policy:** caps per session; respects user's proactivity level; remembers dismissals (don't re-surface unless context changes — track via content hashes).
- **Return-visit digest:** scheduled job that diffs profile state since last visit, detects stale items and channel drift, produces a ranked, capped digest.

---

## PWA & Offline Requirements

### Installability
- Web App Manifest with maskable icons, `display: standalone`, theme/background colors, shortcuts, screenshots.
- Handle iOS Safari constraints (apple-touch-icon, splash, standalone meta).
- Custom in-app install prompt via `beforeinstallprompt` with graceful fallback.

### Offline & Caching (Serwist)
- **App shell precache** at build.
- **Runtime caching strategies:**
  - Network-first for profile data
  - Stale-while-revalidate for static assets
  - Cache-first for fonts/icons
- **Offline fallback** route for navigations.
- **`reloadOnOnline: false`** — don't force reload on reconnect; rely on real-time local persistence.
- **Disable SW in dev** except when explicitly debugging PWA behavior.

### Offline Editing
- Edits write locally to TanStack DB / IndexedDB immediately (optimistic).
- Queue as pending mutations; reconcile via ElectricSQL on reconnect.
- Online/offline state surfaced in UI; pending-sync badges per channel.
- **Conflict handling:** server-side change that conflicts with queued local edit becomes a "which wins" Proposal.

### Data Storage
- **NEVER use localStorage for app data.** It is synchronous, tiny (5MB), and string-only.
- **ALWAYS use IndexedDB** via the sync layer (TanStack DB + ElectricSQL) for structured, async, large storage.
- localStorage is only acceptable for ephemeral UI state (e.g., collapsed/expanded panels), never for Core Profile or Proposals.

---

## Spec-Driven Development Workflow

This project follows **Spec-Driven Development (SDD)** using Claude Code + GitHub Spec Kit.

### The Loop (per feature)
1. **`/specify`** — Write the feature spec: *what* to build, *why*, acceptance criteria. Human review.
2. **`/plan`** — Claude Code proposes the technical plan: *which* files, components, schema changes, *in what steps*. Human review.
3. **`/tasks`** — Decompose the plan into a checklist of discrete, reviewable tasks. Human review.
4. **`/implement`** — Implementation agent executes tasks against the approved plan.
5. **Verify** — Tests + agent evals run; diffs reviewed; spec updated if reality diverged.

**Why SDD?** Reviews happen at three upfront gates (spec, plan, tasks) rather than dozens of times mid-build. This keeps long sessions from drifting and ensures the "agents propose / user disposes" invariant is preserved in the codebase structure.

### Repo Conventions
- **`/specs`** directory: holds spec → plan → tasks per feature, version-controlled alongside code.
- **Root specs:** `PRD_ProfileSync.md` (product) and `TECH_ARCH_SPEC.md` (architecture) are the top-level documents.
- **This file (`CLAUDE.md`)** provides context for every session; update it when stack decisions change.
- **Subagents** for parallelizable work (e.g., one agent per channel adapter), mirroring the runtime agent topology.
- **Keep specs small and feature-scoped.** Prefer many short spec→implement cycles over one long session.

---

## Security & Privacy

- **PII-grade handling:** encrypt at rest and in transit; field-level access control.
- **Tenant isolation by design** (row-level security in Postgres; sync shapes scoped to user).
- **Secrets:** channel credentials in scoped, encrypted token vault; least-privilege scopes; per-channel revoke.
- **Full export and hard delete** required (GDPR/CCPA).
- **Audit log** for compliance and revert.

---

## Performance Budgets

- **Core Web Vitals:** define and CI-enforce LCP/INP/CLS targets.
- **Bundle budget:** route-level code splitting; RSC for server-heavy parts.
- **Latency SLO:** single-change Proposal fan-out p95 target (e.g., < 5s).
- **Inline suggestions feel instant** via optimistic local writes + streamed generation.
- **React Compiler** handles most render-perf; avoid manual memoization unless profiling proves it necessary.

---

## File Structure Conventions

```
/
├── CLAUDE.md                   ← this file
├── PRD_ProfileSync.md          ← product requirements
├── TECH_ARCH_SPEC.md           ← technical architecture
├── /specs                      ← per-feature specs, plans, tasks
│   ├── /feature-name
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── tasks.md
├── /app                        ← Next.js 16 App Router
│   ├── /api                    ← server actions, API routes
│   ├── /(routes)               ← page routes
│   └── layout.tsx
├── /components
│   ├── /ui                     ← Radix primitives (shadcn/ui)
│   └── /features               ← feature-specific components
├── /lib
│   ├── /db                     ← Drizzle schema, migrations, client
│   ├── /agents                 ← agent contracts, LangGraph graph, subagents
│   ├── /sync                   ← ElectricSQL config, TanStack DB setup
│   └── /utils
├── /public                     ← manifest.json, icons, splash screens
├── /tests
│   ├── /unit                   ← Vitest
│   ├── /e2e                    ← Playwright
│   └── /agent-evals            ← agent eval harness + datasets
└── package.json
```

---

## Open Technical Decisions (as of 2026-06-01)

- **Sync engine final call:** ElectricSQL (recommended) vs. Zero vs. LiveStore.
- **Hosting/runtime:** edge vs. node runtime for server functions (given agent latency and queue needs).
- **First personal-site platform** to adapt.
- **LinkedIn write path** pending current API terms (may require guided copy-paste in v1).
- **Auth provider** and passkey rollout scope.
- **Exact version pins** — set at repo init; SDD plan step keeps them tracked.

---

## Quick Reference

### Never Do
- ❌ Use localStorage for Core Profile, Proposals, or any app data (only IndexedDB via sync layer)
- ❌ Let agents directly mutate the Core Profile or channels (always via Proposals)
- ❌ Call model APIs per-keystroke (debounce, batch, cache)
- ❌ Assert fabricated facts (retrieval-grounded only; unverified → `needs-confirmation`)
- ❌ Skip the spec → plan → tasks review gates
- ❌ Manual `useMemo` / `useCallback` unless profiling proves React Compiler missed it

### Always Do
- ✅ Schema in Drizzle as the single source; generate types
- ✅ Offline-first: edits land locally, queue, reconcile on reconnect
- ✅ Proposals for all agent-suggested changes; user reviews and approves
- ✅ Isolated subagents with typed contracts; LangGraph orchestration
- ✅ Test offline scenarios, PWA install, agent evals
- ✅ Update this file when stack decisions change

---

## References

- [PRD_ProfileSync.md](./PRD_ProfileSync.md) — product requirements
- [TECH_ARCH_SPEC.md](./TECH_ARCH_SPEC.md) — full technical architecture
- [Spec-Driven Development with Claude Code — DataCamp](https://www.datacamp.com/tutorial/spec-driven-development-with-claude-code)
- [Next.js 16 docs](https://nextjs.org/docs)
- [ElectricSQL + TanStack DB](https://electric-sql.com/blog/2025/07/29/local-first-sync-with-tanstack-db)
- [LangGraph + Claude Agent SDK guide](https://www.mager.co/blog/2026-03-07-langgraph-claude-agent-sdk-ultimate-guide/)

---

**For questions or context clarification, reference the specs first, then this file. When in doubt about an invariant, stop and ask rather than guess.**
