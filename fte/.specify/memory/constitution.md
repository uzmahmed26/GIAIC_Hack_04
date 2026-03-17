<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 (template) → 1.0.0
Modified principles:
  - [PRINCIPLE_1_NAME] → I. Zero-Backend-LLM (NON-NEGOTIABLE)
  - [PRINCIPLE_2_NAME] → II. Phase Isolation (NON-NEGOTIABLE)
  - [PRINCIPLE_3_NAME] → III. Spec-Driven Development
  - [PRINCIPLE_4_NAME] → IV. Cost Protection (NON-NEGOTIABLE)
  - [PRINCIPLE_5_NAME] → V. MCP-First Tool Usage
  - [PRINCIPLE_6_NAME] → VI. Security First
Added sections:
  - Technology Stack (Section 2)
  - Development Workflow (Section 3)
Templates checked:
  - .specify/templates/plan-template.md ✅ aligned (Constitution Check gate already present)
  - .specify/templates/spec-template.md ✅ aligned (no constitution-specific constraints required)
  - .specify/templates/tasks-template.md ✅ aligned (phase-based structure matches project phases)
  - .specify/templates/phr-template.prompt.md ✅ aligned
Follow-up TODOs: none — all placeholders resolved.
-->

# Course Companion FTE Constitution

## Core Principles

### I. Zero-Backend-LLM (NON-NEGOTIABLE)

Phase 1 backend MUST contain ZERO LLM API calls.

- No imports of `openai`, `anthropic`, `langchain`, or `litellm` are permitted anywhere
  inside `phase1/backend/`.
- All AI reasoning MUST happen exclusively inside the ChatGPT App layer.
- Audit command: `grep -r "anthropic\|openai\|langchain" phase1/backend/` MUST return
  empty output.
- **Violation = immediate disqualification from GIAIC Hackathon IV. Code must be deleted
  and rewritten from scratch.**

### II. Phase Isolation (NON-NEGOTIABLE)

Three completely separate codebases MUST be maintained: `phase1/`, `phase2/`, `phase3/`.

- Each phase MUST have its own `requirements.txt` and `package.json`.
- Phase 2 logic MUST NEVER appear inside `phase1/`.
- Shared utilities MUST live ONLY in the `shared/` folder.
- Cross-phase imports are strictly forbidden — never import directly from another phase
  directory.

### III. Spec-Driven Development

Every feature MUST exist in `specs/course-companion/spec.md` before any code is written.

- Never add a feature that is not already defined in the spec.
- After every completed task, mark it done in `specs/course-companion/tasks.md`.
- No code without a spec entry — no exceptions.

### IV. Cost Protection (NON-NEGOTIABLE)

Every LLM call in `phase2/` MUST check the user's subscription tier BEFORE calling the
API.

- Free tier users MUST receive a `403` error response before any LLM call is made.
- Every LLM call MUST log: `user_id`, `tokens_used`, `cost_estimate`, `feature_name`.
- Never make an LLM call without cost logging in place.
- Premium LLM features are restricted to: Pro tier ($19.99/mo) and Team tier
  ($49.99/mo) only.

### V. MCP-First Tool Usage

MCP servers are the primary mechanism for interacting with all external services.

- Never call external APIs directly if an MCP server exists for that service.
- MCP configuration MUST live in `mcp-config/servers.json`.
- Available MCP servers:
  - `filesystem` — read/write course content files
  - `fetch` — retrieve content from Cloudflare R2 URLs
  - `postgres` — direct DB queries (Phase 3 admin only)
- MCP servers are used in Phase 2 and Phase 3 only; MCP MUST NOT be used in Phase 1.
- MCP servers MUST be running and verified before Phase 2 development begins.

### VI. Security First

All secrets MUST be stored in a `.env` file — never hardcoded in source code.

- `.env` MUST always be listed in `.gitignore`.
- All configuration loading MUST use `pydantic-settings`.
- JWT verification is REQUIRED on all progress and quiz endpoints.
- Answer keys MUST NEVER be sent to the client — server-side evaluation only.

## Technology Stack

- **Backend**: FastAPI (Python 3.12) + asyncpg + Neon PostgreSQL
- **Phase 1 packages**: `fastapi`, `uvicorn`, `asyncpg`, `pydantic`, `boto3`,
  `pgvector`, `sentence-transformers`
- **Phase 2 adds**: `anthropic`, `tiktoken` — NO `openai` package permitted
- **Frontend (Phase 3)**: Next.js 14 + TypeScript + TailwindCSS + shadcn/ui
- **Auth**: Clerk (Phase 3)
- **Storage**: Cloudflare R2 (course content + media + quiz banks)
- **Database**: Neon PostgreSQL with pgvector extension
- **Deployment**: Fly.io (backend) + Vercel (frontend)
- **ChatGPT App**: OpenAI Apps SDK + `manifest.yaml` + `openapi.yaml`
- **Course Topic**: Option A — AI Agent Development
  (Claude Agent SDK, MCP Protocol, Agent Skills, Agent Factory Architecture)
- **Freemium Tiers**:
  - Free: Chapters 1–3 only, basic quizzes
  - Premium ($9.99/mo): All 10 chapters
  - Pro ($19.99/mo): Premium + Adaptive Path + LLM Assessment
  - Team ($49.99/mo): Pro + Analytics + Multiple seats

## Development Workflow

- Phase order is strictly enforced: **Phase 1 → Phase 2 → Phase 3**
- Phase 1 MUST pass the constitutional audit (`grep` returns empty) before Phase 2
  begins.
- Each phase has its own checklist in `specs/course-companion/tasks.md`.
- Required Agent Skills (in `SKILLS/` folder):
  - `concept-explainer.md`
  - `quiz-master.md`
  - `socratic-tutor.md`
  - `progress-motivator.md`
- All FastAPI endpoints MUST have docstrings and a `response_model` defined.
- All database calls MUST be wrapped inside `try/except` blocks.

## Governance

This constitution supersedes all other practices for Course Companion FTE.

- Amendments MUST be made by updating `.specify/memory/constitution.md` via the
  `/sp.constitution` command.
- Phase 1 LLM violation: offending code MUST be deleted and rewritten — no patches.
- ADR required for: database schema changes, new MCP server additions, tier pricing
  changes.
- All PRs and code reviews MUST verify compliance with Principles I–VI before merge.

**Version**: 1.0.0 | **Ratified**: 2026-03-14 | **Last Amended**: 2026-03-14
