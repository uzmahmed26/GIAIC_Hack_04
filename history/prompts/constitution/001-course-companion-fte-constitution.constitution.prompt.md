---
id: 001
title: Course Companion FTE Constitution
stage: constitution
date: 2026-03-14
surface: agent
model: claude-sonnet-4-6
feature: none
branch: master
user: Uzma Ahmed
command: /sp.constitution
labels: ["constitution","hackathon","course-companion","governance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - history/prompts/constitution/001-course-companion-fte-constitution.constitution.prompt.md
tests:
  - none
---

## Prompt

Course Companion FTE — GIAIC Hackathon IV

PROJECT_NAME: Course Companion FTE

Fill the constitution with these exact principles:

PRINCIPLE 1 — Zero-Backend-LLM (NON-NEGOTIABLE)
Phase 1 backend must contain ZERO LLM API calls.
No imports of openai, anthropic, langchain, litellm in phase1/backend/.
All AI reasoning happens inside ChatGPT App layer only.
Audit command: grep -r "anthropic\|openai\|langchain" phase1/backend/ must return empty.
Violation = immediate disqualification from Hackathon IV.

PRINCIPLE 2 — Phase Isolation (NON-NEGOTIABLE)
Three separate codebases: phase1/, phase2/, phase3/
Each phase has its own requirements.txt and package.json.
Phase 2 logic must NEVER appear in phase1/.
Shared utilities live ONLY in shared/ folder.
Never import across phases directly.

PRINCIPLE 3 — Spec-Driven Development
Every feature must exist in specs/course-companion/spec.md before building.
Never add a feature not in the spec.
After every completed task, mark it done in specs/course-companion/tasks.md.
No code without a spec entry.

PRINCIPLE 4 — Cost Protection (NON-NEGOTIABLE)
Every LLM call in phase2/ must check user tier BEFORE calling API.
Free tier users must receive 403 error before any LLM call is made.
Every LLM call must log: user_id, tokens_used, cost_estimate, feature_name.
Never make an LLM call without cost logging.
Premium features: Pro tier ($19.99/mo) and Team tier ($49.99/mo) only.

PRINCIPLE 5 — MCP-First Tool Usage
MCP servers are the primary way to interact with external services.
Never call external APIs directly if an MCP server exists for that service.
MCP config lives in mcp-config/servers.json.
Available MCP servers:
  - filesystem: read/write course content files
  - fetch: retrieve content from Cloudflare R2 URLs
  - postgres: direct DB queries (Phase 3 admin only)
MCP servers used in Phase 2 and Phase 3 only.

PRINCIPLE 6 — Security First
All secrets in .env file only — never hardcoded.
.env is always in .gitignore.
Use pydantic-settings for all config loading.
JWT verification required on all progress and quiz endpoints.
Answer keys never sent to client — server-side only.

SECTION 2 — Technology Stack

Backend: FastAPI (Python 3.12) + asyncpg + Neon PostgreSQL
Phase 1 packages: fastapi, uvicorn, asyncpg, pydantic, boto3, pgvector, sentence-transformers
Phase 2 adds: anthropic, tiktoken (NO openai package)
Frontend (Phase 3): Next.js 14 + TypeScript + TailwindCSS + shadcn/ui
Auth: Clerk (Phase 3)
Storage: Cloudflare R2 (course content + media + quiz banks)
Database: Neon PostgreSQL with pgvector extension
Deployment: Fly.io (backend) + Vercel (frontend)
ChatGPT App: OpenAI Apps SDK + manifest.yaml + openapi.yaml

Course Topic: Option A — AI Agent Development
(Claude Agent SDK, MCP Protocol, Agent Skills, Agent Factory Architecture)

Freemium Tiers:
- Free: Chapters 1-3 only, basic quizzes
- Premium ($9.99/mo): All 10 chapters
- Pro ($19.99/mo): Premium + Adaptive Path + LLM Assessment
- Team ($49.99/mo): Pro + Analytics + Multiple seats

SECTION 3 — Development Workflow

Phase order is strictly enforced: Phase 1 → Phase 2 → Phase 3
Phase 1 must pass constitutional audit before Phase 2 begins.
Each phase has its own checklist in specs/course-companion/tasks.md.
Required Agent Skills (in SKILLS/ folder):
  - concept-explainer.md
  - quiz-master.md
  - socratic-tutor.md
  - progress-motivator.md
MCP servers must be running before Phase 2 development begins.
All FastAPI endpoints must have docstrings and response_model defined.
All DB calls inside try/except blocks.

GOVERNANCE:
This constitution supersedes all other practices for Course Companion FTE.
Amendments require updating .specify/memory/constitution.md via /sp.constitution command.
Phase 1 LLM violation = code must be deleted and rewritten.
ADR required for: database schema changes, new MCP server additions, tier pricing changes.
Constitution version: 1.0.0
Ratification date: 2026-03-14
Last amended: 2026-03-14

## Response snapshot

Constitution v1.0.0 written to `.specify/memory/constitution.md` with all 6 principles
filled, Technology Stack section, Development Workflow section, and Governance section.
Sync Impact Report prepended as HTML comment. All template placeholders resolved.

## Outcome

- ✅ Impact: Project constitution established for Course Companion FTE — GIAIC Hackathon IV. All 6 non-negotiable and spec-driven principles encoded.
- 🧪 Tests: No automated tests — constitutional audit command documented in Principle I.
- 📁 Files: .specify/memory/constitution.md (created/overwritten), history/prompts/constitution/001-course-companion-fte-constitution.constitution.prompt.md (created)
- 🔁 Next prompts: /sp.specify to create specs/course-companion/spec.md, then /sp.plan
- 🧠 Reflection: Constitution is the first artifact in an SDD workflow — all subsequent features derive governance constraints from this file.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): constitutional audit grep command defined in Principle I — not yet run (no phase1/backend/ code exists)
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): run /sp.specify to begin feature spec
