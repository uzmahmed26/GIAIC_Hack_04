---
id: 002
title: Course Companion Full Spec
stage: spec
date: 2026-03-14
surface: agent
model: claude-sonnet-4-6
feature: course-companion
branch: master
user: Uzma Ahmed
command: /sp.specify
labels: ["spec","course-companion","phase1","phase2","phase3","freemium","quizzes","progress"]
links:
  spec: specs/course-companion/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/course-companion/spec.md
  - specs/course-companion/checklists/requirements.md
  - history/prompts/course-companion/002-course-companion-full-spec.spec.prompt.md
tests:
  - none
---

## Prompt

Course Companion FTE

Feature Name: course-companion
Create the spec file at specs/course-companion/spec.md

Use the constitution at .specify/memory/constitution.md as the source of truth.

Define these exact specifications:

PROJECT OVERVIEW:
A Digital Full-Time Equivalent educational tutor for AI Agent Development.
Operates 24/7, serves unlimited students concurrently.
Course topic: AI Agent Development (Claude SDK, MCP, Agent Skills, Agent Factory).
Total chapters: 10
Total quizzes: 5

FEATURE 1 — Content Delivery (FEAT-01) | Phase: 1 | LLM in backend: NONE
FEATURE 2 — Navigation (FEAT-02) | Phase: 1 | LLM in backend: NONE
FEATURE 3 — Grounded Q&A (FEAT-03) | Phase: 1 | LLM in backend: NONE (vector math only)
FEATURE 4 — Rule-Based Quizzes (FEAT-04) | Phase: 1 | LLM in backend: NONE
FEATURE 5 — Progress Tracking (FEAT-05) | Phase: 1 | LLM in backend: NONE
FEATURE 6 — Freemium Gate (FEAT-06) | Phase: 1 | LLM in backend: NONE
FEATURE 7 — Adaptive Learning Path (FEAT-07) | Phase: 2 | Pro+ only | LLM: Claude Sonnet
FEATURE 8 — LLM-Graded Assessment (FEAT-08) | Phase: 2 | Pro+ only | LLM: Claude Sonnet
FEATURE 9 — Web App Frontend (FEAT-09) | Phase: 3 | Next.js 14 + Clerk + Vercel

Data models: Chapter, UserProgress, Quiz, Question, QuizAnswerKey, UserTier, CostLog
13 API endpoints across Phase 1 and Phase 2.
Acceptance criteria: 9 items including zero LLM audit, answer key security, 403 on premium endpoints for free users.

## Response snapshot

Created `specs/course-companion/spec.md` with:
- 7 user stories (P1–P5) covering all 9 features across 3 phases
- 19 functional requirements (FR-001 to FR-019)
- 10 measurable success criteria (SC-001 to SC-010)
- Full data model tables for all 7 entities
- API summary table (13 endpoints)
- Freemium tier table (4 tiers)
- Skills table (4 ChatGPT App skills)
- Edge cases, constraints, and assumptions sections
- Checklist at specs/course-companion/checklists/requirements.md — all items pass

## Outcome

- ✅ Impact: Complete feature specification for Course Companion FTE written. All 9 features across 3 phases fully specified with constitutional constraints encoded.
- 🧪 Tests: Acceptance criteria defined — 9 checklist items. Constitutional audit command referenced in SC-008.
- 📁 Files: specs/course-companion/spec.md, specs/course-companion/checklists/requirements.md
- 🔁 Next prompts: /sp.plan course-companion
- 🧠 Reflection: Spec strictly encodes all 6 constitutional principles — especially zero-LLM in Phase 1 (FR-010, SC-008) and cost-protection in Phase 2 (FR-013, FR-016).

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): spec quality checklist — all items PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): run /sp.plan to generate architectural plan
