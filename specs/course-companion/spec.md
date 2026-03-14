# Feature Specification: Course Companion FTE

**Feature Branch**: `course-companion`
**Created**: 2026-03-14
**Status**: Draft
**Constitution**: `.specify/memory/constitution.md`

---

## Project Overview

Course Companion FTE is a Digital Full-Time Equivalent educational tutor for AI Agent
Development. It operates 24/7 and serves unlimited concurrent students. The course covers:
Claude Agent SDK, MCP Protocol, Agent Skills, and Agent Factory Architecture.

- **Total chapters**: 10
- **Total quizzes**: 5
- **Delivery model**: ChatGPT App (frontend AI) + FastAPI backend (data only)
- **Phase structure**: Phase 1 (rule-based) → Phase 2 (LLM-enhanced) → Phase 3 (web app)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Student reads a chapter (Priority: P1)

A student opens the ChatGPT App and asks about a topic or requests a chapter. The app
fetches the chapter content from the backend and explains it at the student's level using
the concept-explainer skill. The student can navigate to the next or previous chapter.

**Why this priority**: Content delivery is the core value proposition. Without it nothing
else works.

**Independent Test**: A student can request Chapter 1, receive its full content, and have
it explained — without any LLM call happening inside the backend.

**Acceptance Scenarios**:

1. **Given** a student asks "explain Chapter 1", **When** the ChatGPT App calls
   `GET /api/v1/chapters/ch-001`, **Then** the response includes `id`, `title`,
   `content`, `order`, `tier_required`, and `estimated_minutes` — no answer keys,
   no LLM imports in backend.

2. **Given** a free-tier student requests Chapter 4, **When** the access gate is
   checked, **Then** `allowed: false` is returned with an upgrade URL and the
   ChatGPT App explains the premium value gracefully.

3. **Given** a student asks "what comes next?", **When** the app calls
   `GET /api/v1/chapters/{id}/next`, **Then** the response respects prerequisite
   ordering and the student's tier.

---

### User Story 2 — Student asks a question (Grounded Q&A) (Priority: P2)

A student asks a question in the ChatGPT App. The app calls the search endpoint, receives
the top 3 most relevant content chunks, and answers using ONLY those chunks. If no
relevant content exists, it says so explicitly rather than hallucinating.

**Why this priority**: Grounded Q&A is what differentiates a trustworthy tutor from a
generic chatbot. It enforces content fidelity.

**Independent Test**: A student can ask "what is MCP?" and receive an answer grounded
in a specific chapter chunk — verifiable by the cited chapter number.

**Acceptance Scenarios**:

1. **Given** a student asks "what is an agent skill?", **When** the app calls
   `GET /api/v1/search?q=agent+skill&limit=3`, **Then** 3 ranked chunks are returned
   with chapter references and the answer is grounded in those chunks only.

2. **Given** a student asks about a topic not in the course, **When** the search returns
   zero results, **Then** the ChatGPT App responds with exactly:
   "This topic is not covered in the current chapter."

---

### User Story 3 — Student takes a quiz (Priority: P2)

A student requests a quiz. The ChatGPT App fetches questions (without answer keys),
presents them one at a time, and submits answers to the backend for server-side grading.
Wrong answers are explained using the search API.

**Why this priority**: Quizzes close the learning loop and are a core engagement mechanic.

**Independent Test**: A student completes a 5-question quiz. All grading happens
server-side. The answer key never appears in any API response.

**Acceptance Scenarios**:

1. **Given** a student requests a quiz, **When** the app calls
   `GET /api/v1/quizzes/{quiz_id}`, **Then** the response contains questions but
   NO answer keys — answer keys are server-side only.

2. **Given** a student submits answer "A" for question q-001, **When** the app calls
   `POST /api/v1/quizzes/{quiz_id}/submit`, **Then** the response includes
   `score`, `correct`, and `incorrect` per question — graded by exact string match,
   no LLM involved.

3. **Given** a student answers incorrectly, **When** the result is returned,
   **Then** the ChatGPT App calls the search API and explains the correct answer
   using course content only.

---

### User Story 4 — Student tracks progress and streak (Priority: P3)

A student asks "how am I doing?" The app fetches their real progress and streak data
from the backend, then uses the progress-motivator skill to celebrate milestones and
suggest next steps.

**Why this priority**: Progress tracking drives retention and daily habit formation.

**Independent Test**: A student's progress and streak persist across separate sessions.

**Acceptance Scenarios**:

1. **Given** a student completes Chapter 2, **When** the app calls
   `PUT /api/v1/progress/{user_id}/chapter/ch-002`, **Then** the progress record
   is updated with `completed: true` and `completed_at` timestamp.

2. **Given** a student was active yesterday and is active today, **When** streak data
   is fetched, **Then** `streak_days` increments by 1.

3. **Given** a student was inactive for 2+ days, **When** streak data is fetched,
   **Then** `streak_days` resets to 1 (not 0, today counts).

---

### User Story 5 — Pro student gets adaptive path (Priority: P4, Phase 2)

A Pro-tier student requests a personalised learning path. The backend checks their tier
first — if Pro or Team, an LLM call is made with their history and goals. Free and
Premium users receive a 403 before any LLM call is made.

**Why this priority**: Adaptive path is the key Pro upsell feature. Cost protection is
non-negotiable before any LLM call.

**Independent Test**: A free user hitting `POST /api/v2/premium/adaptive-path` receives
403. A Pro user receives a recommended sequence with reasoning.

**Acceptance Scenarios**:

1. **Given** a free-tier user calls `POST /api/v2/premium/adaptive-path`, **When**
   the tier check runs, **Then** `403 Forbidden` is returned — no LLM call is made.

2. **Given** a Pro-tier user submits their learning data, **When** the LLM generates
   a path, **Then** `user_id`, `tokens_used`, `cost_estimate`, and `feature_name`
   are logged before the response is returned.

---

### User Story 6 — Pro student gets LLM-graded assessment (Priority: P4, Phase 2)

A Pro-tier student submits a free-text answer. The backend checks tier, then calls the
LLM to grade it against reference content, returning a score, grade, strengths, and
improvement suggestions.

**Why this priority**: LLM grading unlocks open-ended assessment — the primary reason
to upgrade to Pro.

**Acceptance Scenarios**:

1. **Given** a free-tier user calls `POST /api/v2/premium/assess`, **When** the tier
   check runs, **Then** `403 Forbidden` is returned — no LLM call is made.

2. **Given** a Pro-tier user submits a student answer, **When** the LLM assesses it,
   **Then** the response includes `score (0-100)`, `grade`, `strengths`,
   `improvements`, and `model_answer_hint`.

---

### User Story 7 — Student uses the web app (Priority: P5, Phase 3)

A student signs in via Clerk, lands on their dashboard, reads chapters, takes quizzes,
and views their progress — all through a responsive Next.js web application.

**Acceptance Scenarios**:

1. **Given** a student visits `/`, **Then** they see pricing tiers and a clear CTA.
2. **Given** a signed-in student visits `/dashboard`, **Then** they see their progress
   overview and next recommended chapter.
3. **Given** a free-tier student visits `/learn/ch-004`, **Then** they are redirected
   to `/premium` with an upgrade prompt.

---

### Edge Cases

- What happens when a student's JWT is expired on a required-auth endpoint?
  → Return `401 Unauthorized` with a re-login prompt.
- What happens if the R2 bucket is unreachable?
  → Return `503 Service Unavailable` with a user-friendly message; do not expose
  internal error details.
- What happens if a student submits an answer to a quiz that has already been submitted?
  → Return `409 Conflict` — do not double-count the submission.
- What happens if `streak_days` calculation spans a timezone boundary?
  → Streak logic uses UTC dates for consistency across all users.
- What happens if the LLM call in Phase 2 exceeds token budget?
  → Return `429 Too Many Requests` with a retry-after hint; always log the attempt.

---

## Requirements *(mandatory)*

### Functional Requirements — Phase 1 (Zero LLM Backend)

- **FR-001**: System MUST return chapter list with `id`, `title`, `order`,
  `tier_required`, and `estimated_minutes` — content field excluded from list endpoint.
- **FR-002**: System MUST return full chapter content (markdown) on single-chapter
  endpoint, including `content_url` pointing to Cloudflare R2.
- **FR-003**: System MUST enforce sequential navigation with prerequisite checking on
  next/previous endpoints.
- **FR-004**: System MUST return top-N relevant content chunks (default 3, max 10) from
  the search endpoint using pre-computed vector similarity — zero live LLM calls.
- **FR-005**: System MUST return quiz questions WITHOUT answer keys. Answer keys MUST
  NEVER appear in any API response to the client.
- **FR-006**: System MUST grade quiz submissions server-side using exact string
  comparison and return `score`, `correct`, and `incorrect` per question.
- **FR-007**: System MUST persist `completed`, `score`, `completed_at`, `streak_days`,
  and `last_active` per user per chapter in the database.
- **FR-008**: Streak MUST increment on consecutive calendar days (UTC) and reset to 1
  after a gap of more than 1 day.
- **FR-009**: System MUST return `allowed`, `reason`, `upgrade_url`, and `tier` for
  every access check. Free users are blocked from chapters 4–10.
- **FR-010**: All Phase 1 backend endpoints MUST have zero imports of `openai`,
  `anthropic`, `langchain`, or `litellm`. Constitutional audit command MUST pass.
- **FR-011**: All endpoints MUST have OpenAPI docstrings and a defined `response_model`.
- **FR-012**: All database calls MUST be wrapped in `try/except` blocks.

### Functional Requirements — Phase 2 (LLM-Enhanced, Pro+ Only)

- **FR-013**: System MUST check user tier BEFORE making any LLM call. Free and Premium
  users MUST receive `403 Forbidden` — no LLM call made.
- **FR-014**: Adaptive path endpoint MUST accept `completed_chapters`, `quiz_scores`,
  `struggling_topics`, and `learning_goal`; return `recommended_sequence`, `reasoning`,
  `focus_areas`, and `estimated_days`.
- **FR-015**: Assessment endpoint MUST accept `question`, `student_answer`, and
  `reference_content`; return `score`, `grade`, `strengths`, `improvements`, and
  `model_answer_hint`.
- **FR-016**: Every LLM call MUST log `user_id`, `tokens_used`, `cost_estimate`,
  `feature_name`, and `timestamp` to the `cost_log` table before returning a response.

### Functional Requirements — Phase 3 (Web Frontend)

- **FR-017**: Web app MUST implement all 6 required pages: `/`, `/dashboard`,
  `/learn/[chapterId]`, `/quiz/[quizId]`, `/progress`, `/premium`.
- **FR-018**: Authentication MUST be handled by Clerk — no custom auth logic.
- **FR-019**: Free-tier students accessing locked chapters via direct URL MUST be
  redirected to `/premium`.

### Key Entities

- **Chapter**: Course content unit with tier gating and prerequisite links.
- **UserProgress**: Per-user per-chapter completion record with streak tracking.
- **Quiz**: Question set linked to a chapter; answer keys stored server-side only.
- **Question**: Individual quiz item — MCQ, True/False, or Fill-in-blank.
- **QuizAnswerKey**: Server-side only. Never serialised into any client response.
- **UserTier**: Subscription level controlling feature access and LLM eligibility.
- **CostLog**: Immutable record of every LLM call with cost and token data (Phase 2).

---

## Data Models

### Chapter
| Field               | Type              | Notes                          |
|---------------------|-------------------|--------------------------------|
| id                  | string            | e.g. `ch-001`                  |
| title               | string            |                                |
| content             | string (markdown) | Full markdown body             |
| content_url         | string            | Cloudflare R2 URL              |
| order               | integer           | 1-based sequential order       |
| prerequisites       | list[string]      | chapter ids that must complete |
| estimated_minutes   | integer           |                                |
| tier_required       | string            | `free`, `premium`, or `pro`    |

### UserProgress
| Field         | Type             | Notes                         |
|---------------|------------------|-------------------------------|
| user_id       | string           | From JWT token                |
| chapter_id    | string           |                               |
| completed     | boolean          |                               |
| score         | float or null    | Quiz score if taken           |
| completed_at  | datetime or null |                               |
| streak_days   | integer          | Consecutive active days       |
| last_active   | datetime         | UTC                           |

### Quiz
| Field      | Type           |
|------------|----------------|
| id         | string         |
| chapter_id | string         |
| title      | string         |
| questions  | list[Question] |

### Question
| Field   | Type                | Notes                           |
|---------|---------------------|---------------------------------|
| id      | string              |                                 |
| text    | string              |                                 |
| type    | string              | `mcq`, `truefalse`, or `fill`   |
| options | list[string] or null| null for fill-in-blank          |

### QuizAnswerKey *(server-side only — NEVER sent to client)*
| Field    | Type                  |
|----------|-----------------------|
| quiz_id  | string                |
| answers  | map[question_id → str]|

### UserTier
| Field       | Type             | Notes                              |
|-------------|------------------|------------------------------------|
| user_id     | string           |                                    |
| tier        | string           | `free`, `premium`, `pro`, `team`   |
| valid_until | datetime or null | null = lifetime or not subscribed  |

### CostLog *(Phase 2)*
| Field         | Type     |
|---------------|----------|
| id            | integer  |
| user_id       | string   |
| feature       | string   |
| model         | string   |
| input_tokens  | integer  |
| output_tokens | integer  |
| cost_usd      | float    |
| created_at    | datetime |

---

## API Summary

| Method | Route                                        | Phase | Auth     | LLM |
|--------|----------------------------------------------|-------|----------|-----|
| GET    | /api/v1/chapters                             | 1     | optional | NO  |
| GET    | /api/v1/chapters/{id}                        | 1     | optional | NO  |
| GET    | /api/v1/chapters/{id}/next                   | 1     | optional | NO  |
| GET    | /api/v1/chapters/{id}/previous               | 1     | optional | NO  |
| GET    | /api/v1/search                               | 1     | optional | NO  |
| GET    | /api/v1/quizzes/{id}                         | 1     | required | NO  |
| POST   | /api/v1/quizzes/{id}/submit                  | 1     | required | NO  |
| GET    | /api/v1/progress/{user_id}                   | 1     | required | NO  |
| PUT    | /api/v1/progress/{user_id}/chapter/{id}      | 1     | required | NO  |
| GET    | /api/v1/progress/{user_id}/streak            | 1     | required | NO  |
| GET    | /api/v1/access/{user_id}/chapter/{id}        | 1     | required | NO  |
| POST   | /api/v2/premium/adaptive-path                | 2     | pro+     | YES |
| POST   | /api/v2/premium/assess                       | 2     | pro+     | YES |

---

## Freemium Tiers

| Tier         | Price     | Chapters | Features                              |
|--------------|-----------|----------|---------------------------------------|
| Free         | $0        | 1–3      | Basic quizzes, grounded Q&A           |
| Premium      | $9.99/mo  | 1–10     | All chapters + navigation             |
| Pro          | $19.99/mo | 1–10     | Premium + Adaptive Path + LLM Assess  |
| Team         | $49.99/mo | 1–10     | Pro + Analytics + Multiple seats      |

---

## ChatGPT App Skills

| Skill                | Trigger                                    | Phase |
|----------------------|--------------------------------------------|-------|
| concept-explainer    | explain, what is, how does, describe       | 1+    |
| quiz-master          | quiz, test me, practice, assess            | 1+    |
| socratic-tutor       | help me think, I am stuck, guide me        | 1+    |
| progress-motivator   | my progress, streak, how am I doing        | 1+    |

Skill files location: `SKILLS/`

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A student can receive an explained chapter response in under 3 seconds, grounded in course content, with the chapter number cited.
- **SC-002**: The system handles unlimited concurrent student sessions without degradation (stateless backend design).
- **SC-003**: 100% of quiz submissions are graded server-side — zero answer keys ever appear in client-facing responses (verifiable by API response audit).
- **SC-004**: Free-tier students are blocked from chapter 4 and above on 100% of access attempts.
- **SC-005**: Pro-tier students calling the adaptive-path endpoint receive a personalised learning sequence in under 10 seconds.
- **SC-006**: Free-tier students receive a `403` response on all Phase 2 premium endpoints — verified before any LLM call is logged.
- **SC-007**: Student progress and streak persist correctly across independent sessions, with zero data loss.
- **SC-008**: The Phase 1 constitutional audit (`grep -r "anthropic\|openai\|langchain" phase1/backend/`) returns empty — 0 violations.
- **SC-009**: Every LLM call in Phase 2 has a corresponding `cost_log` entry with `user_id`, `tokens_used`, `cost_estimate`, and `feature_name`.
- **SC-010**: All 6 web app pages are accessible and functional for authenticated users in Phase 3.

---

## Acceptance Criteria

- [ ] Phase 1 backend has zero LLM imports — `grep` constitutional audit passes
- [ ] All 6 Phase 1 features work end-to-end
- [ ] ChatGPT App loads and connects to the backend
- [ ] Progress persists across sessions
- [ ] Free user cannot access chapter 4 or above
- [ ] Pro user can access the adaptive-path endpoint
- [ ] Free user gets `403` on the adaptive-path endpoint
- [ ] All endpoints have OpenAPI docstrings and `response_model`
- [ ] Answer key never appears in any API response

---

## Constraints

- Phase 1 backend: zero LLM imports — non-negotiable (GIAIC Hackathon IV rule).
- Phase ordering: Phase 1 MUST pass constitutional audit before Phase 2 code is written.
- Answer keys: server-side only, no exceptions.
- Cost logging: every Phase 2 LLM call MUST log before returning — no silent calls.
- Secrets: all in `.env` via `pydantic-settings` — never hardcoded.
- JWT: required on all progress, quiz, and access endpoints.

## Assumptions

- User identity (JWT `user_id`) is issued externally (Clerk in Phase 3, mock tokens in
  Phase 1 testing). The backend trusts the token but does not issue it.
- Embeddings for the search endpoint are pre-computed offline and loaded at startup.
  No live embedding API calls occur during request handling.
- Cloudflare R2 bucket is pre-populated with chapter markdown files before Phase 1 runs.
- Tier information is stored in the `user_tier` table and updated by a billing webhook
  (out of scope for Phase 1 — seeded via migration for testing).
