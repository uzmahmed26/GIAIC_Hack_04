---
id: 003
title: Course Companion Technical Plan
stage: plan
date: 2026-03-14
surface: agent
model: claude-sonnet-4-6
feature: course-companion
branch: master
user: Uzma Ahmed
command: /sp.plan
labels: ["plan","course-companion","phase1","phase2","phase3","fastapi","nextjs","pgvector"]
links:
  spec: specs/course-companion/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/course-companion/plan.md
  - specs/course-companion/research.md
  - specs/course-companion/data-model.md
  - specs/course-companion/quickstart.md
  - specs/course-companion/contracts/openapi-v1.yaml
  - specs/course-companion/contracts/openapi-v2.yaml
  - history/prompts/course-companion/003-course-companion-technical-plan.plan.prompt.md
tests:
  - none
---

## Prompt

course-companion

Create plan at specs/course-companion/plan.md
Use spec at specs/course-companion/spec.md
Use constitution at .specify/memory/constitution.md

Create a detailed technical plan with:
PHASE 1 PLAN — Zero Backend LLM (Steps 1.1–1.6)
PHASE 2 PLAN — Hybrid Intelligence (Steps 2.1–2.5)
PHASE 3 PLAN — Full Web App (Steps 3.1–3.4)

Key steps: project scaffold, DB setup, content pipeline, core APIs (chapters, search,
quizzes, progress, access), ChatGPT App, Phase 1 audit, premium infrastructure, LLM
routers (adaptive-path + assess), MCP integration, Next.js setup, 6 pages, consolidated
backend, deployment.

## Response snapshot

Created 6 artifacts:
- plan.md: Full 3-phase technical plan with constitution check gate, structure decision,
  all steps 1.1–3.4, complexity tracking, risk analysis
- research.md: 8 technical decisions (embedding model, pgvector, JWT, quiz grading, streak
  UTC, answer key isolation, LLM model, content storage)
- data-model.md: All 7 tables with column types, constraints, validation rules,
  state transitions, and security rules for quiz_answer_keys
- quickstart.md: Step-by-step dev setup for all 3 phases including constitutional audit
  command and 403 test for Phase 2
- contracts/openapi-v1.yaml: Full OpenAPI 3.0 spec for all 11 Phase 1 endpoints
- contracts/openapi-v2.yaml: OpenAPI 3.0 spec for Phase 2 premium endpoints with 403
  documented

Constitution Check gate: ALL 6 principles verified — PASS.

## Outcome

- ✅ Impact: Complete 3-phase implementation plan ready for /sp.tasks
- 🧪 Tests: Constitutional audit commands documented; Phase 1 + Phase 2 audit checklists in plan.md
- 📁 Files: plan.md, research.md, data-model.md, quickstart.md, contracts/openapi-v1.yaml, contracts/openapi-v2.yaml
- 🔁 Next prompts: /sp.tasks course-companion
- 🧠 Reflection: Most critical design decision was pre-computed embeddings — the only way to have semantic search in Phase 1 without violating Principle I (zero LLM imports).

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Constitution Check gate — all 6 principles PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): run /sp.tasks to generate tasks.md
