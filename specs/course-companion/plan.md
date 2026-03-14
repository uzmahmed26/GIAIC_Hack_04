# Implementation Plan: Course Companion FTE

**Branch**: `course-companion` | **Date**: 2026-03-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/course-companion/spec.md`

---

## Summary

Course Companion FTE is a 3-phase educational platform for AI Agent Development. The
backend is a zero-LLM FastAPI service in Phase 1, extended with Claude Sonnet premium
features in Phase 2, and delivered via a Next.js web app in Phase 3. The ChatGPT App
connects to the Phase 1 backend directly and loads 4 agent skills from the SKILLS/ folder.

---

## Technical Context

**Language/Version**: Python 3.12 (Phase 1 + 2 backend), Node.js 20 (Phase 3 frontend)
**Primary Dependencies**: FastAPI, uvicorn, asyncpg, pydantic-settings, boto3, pgvector,
sentence-transformers (Phase 1); anthropic, tiktoken (Phase 2 adds only);
Next.js 14, TailwindCSS, shadcn/ui, Clerk (Phase 3)
**Storage**: Neon PostgreSQL (asyncpg + pgvector), Cloudflare R2 (markdown + quiz JSON)
**Testing**: pytest + httpx for backend; Playwright for Phase 3 E2E
**Target Platform**: Fly.io (backend), Vercel (frontend)
**Project Type**: Web application — multi-phase monorepo
**Performance Goals**: Chapter response < 3s, search < 1s, LLM endpoints < 10s
**Constraints**: Phase 1 zero LLM imports (constitutional audit), cost gate before every
Phase 2 LLM call, answer keys never serialised to client
**Scale/Scope**: Unlimited concurrent students (stateless backend), 10 chapters, 5 quizzes

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. Zero-Backend-LLM | `phase1/backend/` has zero `openai`/`anthropic`/`langchain`/`litellm` imports | ✅ ENFORCED — embeddings pre-computed offline |
| II. Phase Isolation | `phase1/`, `phase2/`, `phase3/` are separate trees; no cross-phase imports | ✅ ENFORCED — shared utilities in `shared/` only |
| III. Spec-Driven | All 9 features exist in `specs/course-companion/spec.md` before any code | ✅ ENFORCED — spec complete |
| IV. Cost Protection | Tier check runs BEFORE LLM call; free/premium get 403; every call logged | ✅ ENFORCED — tier_check middleware is first in Phase 2 |
| V. MCP-First | MCP servers (filesystem, fetch) used in Phase 2+; none in Phase 1 | ✅ ENFORCED — mcp-config/servers.json defined |
| VI. Security First | Secrets via `.env` + pydantic-settings; JWT on all protected endpoints; answer keys server-side only | ✅ ENFORCED |

**Gate result: PASS — proceed to Phase 0**

---

## Project Structure

### Documentation (this feature)

```text
specs/course-companion/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 research decisions
├── data-model.md        # Database schema and entity design
├── quickstart.md        # Developer setup guide
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── contracts/
    ├── openapi-v1.yaml  # Phase 1 API contract
    └── openapi-v2.yaml  # Phase 2 API contract
```

### Source Code (repository root)

```text
phase1/
├── backend/
│   ├── main.py
│   ├── requirements.txt          # NO openai/anthropic/langchain
│   ├── .env.example
│   ├── config.py                 # pydantic-settings
│   ├── database.py               # asyncpg connection pool
│   ├── models/
│   │   ├── chapter.py
│   │   ├── progress.py
│   │   ├── quiz.py
│   │   └── access.py
│   ├── routers/
│   │   ├── chapters.py           # FEAT-01, FEAT-02
│   │   ├── search.py             # FEAT-03
│   │   ├── quizzes.py            # FEAT-04
│   │   ├── progress.py           # FEAT-05
│   │   └── access.py             # FEAT-06
│   ├── services/
│   │   ├── embedding_search.py   # pgvector cosine similarity
│   │   ├── quiz_grader.py        # exact string comparison
│   │   └── streak_calculator.py  # UTC date logic
│   ├── middleware/
│   │   └── jwt_auth.py
│   └── migrations/
│       ├── 001_create_tables.sql
│       └── 002_seed_tiers.sql
└── chatgpt-app/
    ├── manifest.yaml
    ├── openapi.yaml
    └── instructions.md

phase2/
└── backend/
    ├── main.py
    ├── requirements.txt          # adds anthropic, tiktoken ONLY
    ├── middleware/
    │   └── tier_check.py         # 403 gate — runs BEFORE any LLM call
    ├── routers/
    │   ├── adaptive.py           # FEAT-07
    │   └── assessment.py         # FEAT-08
    └── services/
        ├── cost_tracker.py       # log user_id, tokens, cost, feature
        └── claude_client.py      # anthropic SDK wrapper

phase3/
├── backend/
│   └── main.py                   # merged Phase 1 + 2 APIs
└── frontend/
    ├── package.json
    ├── tailwind.config.ts
    └── src/
        ├── app/
        │   ├── page.tsx               # /
        │   ├── dashboard/page.tsx     # /dashboard
        │   ├── learn/[chapterId]/page.tsx
        │   ├── quiz/[quizId]/page.tsx
        │   ├── progress/page.tsx
        │   └── premium/page.tsx
        ├── components/
        └── lib/
            └── api.ts

shared/
├── types.py          # Shared Pydantic models
└── constants.py      # Tier names, chapter IDs

content/
├── chapters/
│   ├── ch-001-intro-to-ai-agents.md
│   ├── ch-002-claude-agent-sdk.md
│   ├── ch-003-mcp-protocol.md
│   ├── ch-004-agent-skills.md
│   ├── ch-005-agent-factory.md
│   ├── ch-006-tool-use-patterns.md
│   ├── ch-007-multi-agent-systems.md
│   ├── ch-008-agent-memory.md
│   ├── ch-009-agent-evaluation.md
│   └── ch-010-production-agents.md
└── quizzes/
    ├── quiz-001-basics.json
    ├── quiz-002-sdk.json
    ├── quiz-003-mcp.json
    ├── quiz-004-skills.json
    └── quiz-005-advanced.json

scripts/
├── generate_embeddings.py   # offline — sentence-transformers
└── upload_to_r2.py          # boto3 to Cloudflare R2

SKILLS/
├── concept-explainer.md
├── quiz-master.md
├── socratic-tutor.md
└── progress-motivator.md

mcp-config/
├── servers.json
├── start-mcp.ps1
└── start-mcp.sh
```

**Structure Decision**: Web application (multi-phase monorepo). Each phase is an isolated
codebase under its own directory. Shared utilities are in `shared/`. No cross-phase
imports are permitted.

---

## PHASE 1 PLAN — Zero Backend LLM

### Step 1.1 — Project Scaffold

**Goal**: Create the complete folder structure with isolated requirements files.

Files to create:

```
phase1/backend/requirements.txt      # fastapi, uvicorn, asyncpg, pydantic,
                                     # pydantic-settings, boto3, pgvector,
                                     # sentence-transformers, python-jose, httpx
phase2/backend/requirements.txt      # inherits phase1 deps + anthropic, tiktoken ONLY
phase3/frontend/package.json         # next, react, typescript, tailwindcss, @clerk/nextjs
.env.example                         # all required variables (no real values)
```

`.env.example` variables:
```
DATABASE_URL=postgresql+asyncpg://user:pass@host/dbname
R2_BUCKET_NAME=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT_URL=
JWT_SECRET=
ANTHROPIC_API_KEY=          # Phase 2 only
CLERK_SECRET_KEY=           # Phase 3 only
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=  # Phase 3 only
```

**Audit gate**: `grep -r "anthropic\|openai\|langchain" phase1/backend/` → MUST return
empty before any phase1 code is committed.

---

### Step 1.2 — Database Setup

**Goal**: Neon PostgreSQL schema with pgvector for embeddings.

Migration order:
1. `001_create_tables.sql` — all core tables
2. `002_seed_tiers.sql` — seed tier definitions for testing

Schema:

```sql
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chapters (
  id               TEXT PRIMARY KEY,          -- e.g. ch-001
  title            TEXT NOT NULL,
  content          TEXT NOT NULL,             -- markdown body
  content_url      TEXT NOT NULL,             -- Cloudflare R2 URL
  chapter_order    INTEGER NOT NULL,
  prerequisites    TEXT[] DEFAULT '{}',
  estimated_minutes INTEGER NOT NULL,
  tier_required    TEXT NOT NULL DEFAULT 'free',
  embedding        vector(384)                -- sentence-transformers/all-MiniLM-L6-v2
);

CREATE TABLE user_progress (
  user_id          TEXT NOT NULL,
  chapter_id       TEXT NOT NULL REFERENCES chapters(id),
  completed        BOOLEAN DEFAULT FALSE,
  score            FLOAT,
  completed_at     TIMESTAMPTZ,
  streak_days      INTEGER DEFAULT 0,
  last_active      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, chapter_id)
);

CREATE TABLE quizzes (
  id               TEXT PRIMARY KEY,
  chapter_id       TEXT NOT NULL REFERENCES chapters(id),
  title            TEXT NOT NULL,
  questions        JSONB NOT NULL   -- Question[] WITHOUT answer
);

CREATE TABLE quiz_answer_keys (
  quiz_id          TEXT PRIMARY KEY REFERENCES quizzes(id),
  answers          JSONB NOT NULL   -- {question_id: correct_answer}
  -- NEVER returned to client
);

CREATE TABLE user_tiers (
  user_id          TEXT PRIMARY KEY,
  tier             TEXT NOT NULL DEFAULT 'free',  -- free|premium|pro|team
  valid_until      TIMESTAMPTZ
);

CREATE TABLE access_logs (
  id               SERIAL PRIMARY KEY,
  user_id          TEXT NOT NULL,
  chapter_id       TEXT NOT NULL,
  allowed          BOOLEAN NOT NULL,
  reason           TEXT,
  checked_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cost_logs (                       -- Phase 2, created in phase2 migration
  id               SERIAL PRIMARY KEY,
  user_id          TEXT NOT NULL,
  feature          TEXT NOT NULL,
  model            TEXT NOT NULL,
  input_tokens     INTEGER NOT NULL,
  output_tokens    INTEGER NOT NULL,
  cost_usd         FLOAT NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
```

**Connection pattern** (all DB calls in try/except):
```python
async with pool.acquire() as conn:
    try:
        result = await conn.fetch(query, *args)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database error")
```

---

### Step 1.3 — Content Pipeline

**Goal**: Populate content files and pre-compute embeddings offline.

Order:
1. Write 10 chapter markdown files to `content/chapters/`
2. Write 5 quiz JSON files to `content/quizzes/`
3. Run `scripts/generate_embeddings.py` → writes embeddings to DB
4. Run `scripts/upload_to_r2.py` → uploads markdown to R2 bucket

Embedding model: `sentence-transformers/all-MiniLM-L6-v2` (384 dimensions)
No live embedding calls during API requests — all pre-computed.

Quiz JSON format (answer key separate):
```json
{
  "id": "quiz-001",
  "chapter_id": "ch-001",
  "title": "AI Agents Basics",
  "questions": [
    {"id": "q-001", "text": "...", "type": "mcq", "options": ["A","B","C","D"]},
    {"id": "q-002", "text": "...", "type": "truefalse", "options": null}
  ]
}
```

Answer key (stored separately, never in quiz JSON):
```json
{"quiz_id": "quiz-001", "answers": {"q-001": "B", "q-002": "true"}}
```

---

### Step 1.4 — Core APIs (build in this exact order)

#### Router 1: chapters.py — FEAT-01 + FEAT-02

```
GET  /api/v1/chapters              → list (no content field, no answer keys)
GET  /api/v1/chapters/{id}         → full chapter with content
GET  /api/v1/chapters/{id}/next    → next chapter respecting prerequisites
GET  /api/v1/chapters/{id}/previous → previous chapter
```

Rules:
- List endpoint excludes `content` and `embedding` fields
- Next/previous enforces prerequisite ordering
- Auth: optional (unauthenticated users see tier_required but not locked content)

#### Router 2: search.py — FEAT-03

```
GET  /api/v1/search?q={query}&chapter={optional}&limit={1-10}
```

Rules:
- Compute query embedding at request time using pre-loaded model
- Run pgvector cosine similarity: `embedding <=> $1`
- Return top-N chunks with chapter_id and relevance score
- NO live LLM call — vector math only

#### Router 3: quizzes.py — FEAT-04

```
GET  /api/v1/quizzes/{id}          → questions WITHOUT answer key
POST /api/v1/quizzes/{id}/submit   → grade via exact string match
```

Rules:
- GET response MUST never include `quiz_answer_keys` table data
- POST grading: `student_answer.strip().lower() == correct_answer.strip().lower()`
- Return per-question correct/incorrect + total score
- Auth: required (JWT)

#### Router 4: progress.py — FEAT-05

```
GET  /api/v1/progress/{user_id}                    → full progress record
PUT  /api/v1/progress/{user_id}/chapter/{id}       → mark chapter complete
GET  /api/v1/progress/{user_id}/streak             → current streak
```

Streak logic:
```python
today = date.today()  # UTC
last = record.last_active.date()
if (today - last).days == 1:
    streak += 1
elif (today - last).days > 1:
    streak = 1
# else: same day, no change
```

Auth: required (JWT, user_id from token)

#### Router 5: access.py — FEAT-06

```
GET  /api/v1/access/{user_id}/chapter/{id}
→ {allowed: bool, reason: str, upgrade_url: str, tier: str}
```

Tier gate:
| Tier    | Allowed Chapters |
|---------|-----------------|
| free    | 1–3 only        |
| premium | 1–10            |
| pro     | 1–10            |
| team    | 1–10            |

Auth: required (JWT)

---

### Step 1.5 — ChatGPT App

Files:
- `phase1/chatgpt-app/manifest.yaml` — App name, description, auth mode
- `phase1/chatgpt-app/openapi.yaml` — All Phase 1 endpoints as OpenAPI spec
- `phase1/chatgpt-app/instructions.md` — System prompt loading all 4 SKILLS/

`instructions.md` structure:
```markdown
You are Course Companion, an AI tutor for AI Agent Development.

## Active Skills
[SKILL: SKILLS/concept-explainer.md]
[SKILL: SKILLS/quiz-master.md]
[SKILL: SKILLS/socratic-tutor.md]
[SKILL: SKILLS/progress-motivator.md]

## Grounding Rules
- NEVER explain from general knowledge when search API returns results
- ALWAYS cite chapter number when explaining content
- NEVER reveal quiz answer keys
- NEVER call backend LLM endpoints — they do not exist in Phase 1
```

---

### Step 1.6 — Phase 1 Audit

**Constitutional audit command** (must return empty):
```bash
grep -r "anthropic\|openai\|langchain\|litellm" phase1/backend/
```

**End-to-end test checklist**:
- [ ] `GET /api/v1/chapters` returns 10 chapters without content/embedding fields
- [ ] `GET /api/v1/chapters/ch-004` returns 403-equivalent for free user via access check
- [ ] `GET /api/v1/search?q=mcp` returns 3 chunks with chapter references
- [ ] `GET /api/v1/quizzes/quiz-001` returns questions, NO answer key in response
- [ ] `POST /api/v1/quizzes/quiz-001/submit` grades correctly via exact string match
- [ ] `PUT /api/v1/progress/{id}/chapter/ch-001` persists to DB
- [ ] Streak increments on consecutive days, resets after 2+ day gap
- [ ] ChatGPT App loads, connects to backend, explains Chapter 1 using concept-explainer

---

## PHASE 2 PLAN — Hybrid Intelligence

### Step 2.1 — Premium Infrastructure

**Goal**: Tier middleware and cost tracker must be in place before any LLM router is built.

`phase2/backend/middleware/tier_check.py`:
```python
async def require_pro_tier(user_id: str, db) -> None:
    tier = await db.fetchval("SELECT tier FROM user_tiers WHERE user_id=$1", user_id)
    if tier not in ("pro", "team"):
        raise HTTPException(status_code=403, detail="Pro or Team tier required")
    # LLM call only happens AFTER this passes
```

`phase2/backend/services/cost_tracker.py`:
```python
async def log_cost(db, user_id, feature, model, input_tokens, output_tokens, cost_usd):
    await db.execute(
        "INSERT INTO cost_logs (...) VALUES ($1,$2,$3,$4,$5,$6,$7)",
        user_id, feature, model, input_tokens, output_tokens, cost_usd, datetime.utcnow()
    )
    # Called BEFORE returning response — never skipped
```

---

### Step 2.2 — Adaptive Learning Path (FEAT-07)

`phase2/backend/routers/adaptive.py`

Order of operations (STRICT):
1. Extract `user_id` from JWT
2. Call `require_pro_tier(user_id)` → 403 if not Pro/Team
3. Build prompt from input payload
4. Call Claude Sonnet (`claude-sonnet-4-20250514`)
5. Call `log_cost(...)` with actual token counts
6. Return response

Input payload:
```json
{
  "completed_chapters": ["ch-001", "ch-002"],
  "quiz_scores": {"ch-001": 85, "ch-002": 70},
  "struggling_topics": ["MCP protocol"],
  "learning_goal": "Become proficient in agent factory patterns"
}
```

Output:
```json
{
  "recommended_sequence": ["ch-003", "ch-005", "ch-004"],
  "reasoning": "...",
  "focus_areas": ["MCP deep dive", "agent composition"],
  "estimated_days": 14
}
```

Cost estimate: ~2000 tokens → ~$0.018 per call (logged to cost_logs)

---

### Step 2.3 — LLM Assessment (FEAT-08)

`phase2/backend/routers/assessment.py`

Order of operations (STRICT):
1. Extract `user_id` from JWT
2. Call `require_pro_tier(user_id)` → 403 if not Pro/Team
3. Build rubric-based evaluation prompt with `reference_content`
4. Call Claude Sonnet
5. Call `log_cost(...)`
6. Return assessment

Input:
```json
{
  "question": "Explain how MCP enables tool use in agents.",
  "student_answer": "MCP lets agents call tools...",
  "reference_content": "Chapter 3 content chunk..."
}
```

Output:
```json
{
  "score": 78,
  "grade": "B",
  "strengths": ["Correct understanding of tool calling"],
  "improvements": ["Did not mention protocol handshake"],
  "model_answer_hint": "Consider discussing the request-response cycle..."
}
```

Cost estimate: ~1500 tokens → ~$0.014 per call

---

### Step 2.4 — MCP Integration

**Prerequisite**: Run `mcp-config/start-mcp.ps1` (Windows) or `mcp-config/start-mcp.sh`
(Linux/Mac) before starting Phase 2 backend.

MCP usage in Phase 2:
- `filesystem` MCP → read skill files from `SKILLS/` and chapter markdown from
  `content/chapters/` without direct file I/O in the router
- `fetch` MCP → retrieve updated chapter content from Cloudflare R2 URLs

Phase 3 adds:
- `postgres` MCP → admin dashboard and analytics queries (Phase 3 only)

---

### Step 2.5 — Phase 2 Audit

- [ ] `grep -r "anthropic\|openai\|langchain" phase1/backend/` still returns empty
- [ ] Free user → `POST /api/v2/premium/adaptive-path` → `403 Forbidden`
- [ ] Premium ($9.99) user → `POST /api/v2/premium/adaptive-path` → `403 Forbidden`
- [ ] Pro user → `POST /api/v2/premium/adaptive-path` → successful response
- [ ] Every successful Phase 2 LLM call → row exists in `cost_logs`
- [ ] No LLM call logged for 403 responses (tier check fires first)

---

## PHASE 3 PLAN — Full Web App

### Step 3.1 — Next.js Setup

```bash
cd phase3/frontend
npx create-next-app@14 . --typescript --tailwind --app --src-dir
npx shadcn-ui@latest init
npm install @clerk/nextjs
```

Clerk environment variables:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
```

---

### Step 3.2 — Pages

| Route | Component | Auth required |
|-------|-----------|---------------|
| `/` | Landing — pricing tiers, CTA | No |
| `/dashboard` | Progress overview, next chapter CTA | Yes |
| `/learn/[chapterId]` | Chapter reader + AI chat panel | Yes |
| `/quiz/[quizId]` | Interactive quiz — one question at a time | Yes |
| `/progress` | Visual streak tracker + chapter completion | Yes |
| `/premium` | Upgrade page with tier comparison | No |

Tier-gating rule in `middleware.ts`:
- Free user accessing `/learn/ch-004` through `/learn/ch-010` → redirect to `/premium`

---

### Step 3.3 — Consolidated Backend

`phase3/backend/main.py` merges all routers:
- All Phase 1 routers (`chapters`, `search`, `quizzes`, `progress`, `access`)
- All Phase 2 routers (`adaptive`, `assessment`)
- Clerk JWT verification middleware (replaces Phase 1 mock JWT)
- Single `requirements.txt` = Phase 1 deps + Phase 2 deps + Clerk SDK

---

### Step 3.4 — Deployment

**Backend** → Fly.io:
```bash
fly launch --name course-companion-api
fly secrets set DATABASE_URL=... ANTHROPIC_API_KEY=... CLERK_SECRET_KEY=...
fly deploy
```

**Frontend** → Vercel:
```bash
vercel --prod
# Set env vars in Vercel dashboard
```

**Phase 3 Audit**:
- [ ] All 6 pages load for authenticated users
- [ ] Free-tier user redirect to `/premium` on locked chapters
- [ ] Clerk JWT works end-to-end with backend
- [ ] All Phase 1 + Phase 2 features functional in consolidated backend
- [ ] No hardcoded secrets — all from environment variables

---

## Complexity Tracking

| Decision | Why Needed | Simpler Alternative Rejected Because |
|----------|------------|--------------------------------------|
| Pre-computed embeddings (not live) | Constitutional audit — zero LLM in Phase 1 backend | Live embedding calls would violate Principle I |
| Separate phase1/phase2/phase3 directories | Constitutional Principle II — phase isolation | Shared codebase would risk LLM imports leaking into Phase 1 |
| Tier check middleware before LLM call | Constitutional Principle IV — cost protection | Inline tier checks could be bypassed or forgotten |
| Answer key in separate DB table | Security — FR-005, SC-003 | Storing in quiz table risks accidental serialisation |

---

## Risk Analysis

1. **R2 bucket unavailable during Phase 1 test** → backend returns `503`; chapter content
   is also stored in DB as fallback — test with DB content first.
2. **Embedding model cold-start latency** → load `sentence-transformers` model at startup
   (not per-request); use `@app.on_event("startup")` to pre-load.
3. **LLM cost overrun in Phase 2** → `cost_logs` table provides real-time visibility;
   add a daily spend alert query as a cron job before Phase 2 goes live.
