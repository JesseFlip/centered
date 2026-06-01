# /lib

Core libraries and utilities.

## Structure

- **/db** - Drizzle ORM schema, migrations, and database client
- **/agents** - Agent contracts, LangGraph orchestration, Claude Agent SDK subagents
- **/sync** - ElectricSQL configuration and TanStack DB setup
- **/utils** - Shared utility functions

## Principles

- All database schema lives in `/db` and is the single source of truth for types
- Agent contracts are defined and validated here
- No direct database writes from agents - only Proposals
