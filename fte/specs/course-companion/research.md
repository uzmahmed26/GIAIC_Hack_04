# Research: Course Companion FTE

**Date**: 2026-03-14
**Feature**: course-companion
**Phase**: 0 — Outline & Research

---

## Decision 1: Embedding Model for Phase 1 Search

**Decision**: `sentence-transformers/all-MiniLM-L6-v2` (384 dimensions)

**Rationale**:
- Runs fully offline — no API call, zero LLM in Phase 1 backend (Principle I)
- 384-dimension vectors are efficient with pgvector cosine similarity
- Pre-computed at load time; no per-request model inference
- Already listed in Phase 1 `requirements.txt` (sentence-transformers)

**Alternatives considered**:
- OpenAI `text-embedding-ada-002` — rejected (requires API call, violates Principle I)
- `all-mpnet-base-v2` (768 dims) — rejected (slower, larger storage, marginal quality gain
  for this domain size)

---

## Decision 2: pgvector Cosine Similarity Query Pattern

**Decision**: Use `<=>` operator (cosine distance) with an index on the embedding column.

**Rationale**:
- Cosine similarity is standard for sentence-transformer embeddings
- pgvector's `<=>` operator is natively supported by Neon PostgreSQL
- Query: `SELECT id, title, content FROM chapters ORDER BY embedding <=> $1 LIMIT $2`

**Index**: `CREATE INDEX ON chapters USING ivfflat (embedding vector_cosine_ops)`

---

## Decision 3: JWT Verification Strategy (Phase 1)

**Decision**: `python-jose` for Phase 1 (mock JWT); Clerk SDK for Phase 3

**Rationale**:
- Phase 1 has no Clerk dependency — mock JWT lets us test progress/quiz endpoints
  locally without external auth service
- Clerk is introduced in Phase 3 only, consistent with Principle II (phase isolation)
- JWT secret stored in `.env` via pydantic-settings (Principle VI)

---

## Decision 4: Quiz Grading — Exact String Match

**Decision**: `student_answer.strip().lower() == correct_answer.strip().lower()`

**Rationale**:
- Zero LLM in Phase 1 backend (Principle I) — no semantic grading possible
- Exact match is deterministic, auditable, and fast
- Fill-in-blank answers are normalised (strip + lowercase) to reduce false negatives
- MCQ answers are single letters (A/B/C/D) — exact match is correct approach

---

## Decision 5: Streak Calculation UTC Anchor

**Decision**: All streak dates use `datetime.utcnow().date()` — no timezone conversion

**Rationale**:
- Consistent across all users regardless of timezone
- `last_active` stored as `TIMESTAMPTZ` in UTC
- Streak logic: if `(today_utc - last_active_utc.date()).days == 1` → increment

**Edge case**: User active at 23:59 UTC and 00:01 UTC — counts as two consecutive days
(expected and desired behaviour for habit tracking)

---

## Decision 6: Answer Key Storage

**Decision**: Separate `quiz_answer_keys` table; never joined into client-facing queries

**Rationale**:
- Quiz router `GET /api/v1/quizzes/{id}` queries `quizzes` table only
- Grading router `POST .../submit` queries `quiz_answer_keys` server-side, never returns
  it
- No ORM — raw asyncpg queries make it impossible to accidentally include answer keys
  via lazy loading

---

## Decision 7: Phase 2 LLM Model

**Decision**: `claude-sonnet-4-20250514` (Claude Sonnet)

**Rationale**:
- Specified in constitution and spec (Principle II — no `openai` package permitted)
- `anthropic` SDK only added in `phase2/backend/requirements.txt`
- Cost estimates provided in spec: ~$0.018 (adaptive path), ~$0.014 (assessment)

---

## Decision 8: Content Storage Strategy

**Decision**: Markdown in Cloudflare R2 (source of truth) + text in PostgreSQL (search)

**Rationale**:
- R2 is cost-effective for static markdown files; `content_url` field in `chapters` table
  points to R2
- PostgreSQL `content` column stores the markdown body for search + embedding generation
- `scripts/upload_to_r2.py` syncs content to R2 before Phase 1 launch
- If R2 is unreachable, backend falls back to DB content (graceful degradation)
