# Data Model: Course Companion FTE

**Date**: 2026-03-14
**Feature**: course-companion

---

## Entity Relationship Summary

```
chapters ──────────────────┐
  │ (chapter_id)           │
  ├── user_progress         │
  ├── quizzes               │
  │     └── quiz_answer_keys (server-side only)
  └── access_logs

user_tiers ──── (user_id) ─── user_progress
                             access_logs
                             cost_logs (Phase 2)
```

---

## Table: chapters

Primary source of truth for all course content.

| Column            | Type           | Constraints          | Notes |
|-------------------|----------------|----------------------|-------|
| id                | TEXT           | PRIMARY KEY          | e.g. `ch-001` |
| title             | TEXT           | NOT NULL             | |
| content           | TEXT           | NOT NULL             | Full markdown body |
| content_url       | TEXT           | NOT NULL             | Cloudflare R2 URL |
| chapter_order     | INTEGER        | NOT NULL, UNIQUE     | 1–10 sequential |
| prerequisites     | TEXT[]         | DEFAULT '{}'         | List of chapter ids |
| estimated_minutes | INTEGER        | NOT NULL             | |
| tier_required     | TEXT           | NOT NULL DEFAULT 'free' | free/premium/pro |
| embedding         | vector(384)    |                      | all-MiniLM-L6-v2 |

**Index**: `CREATE INDEX ON chapters USING ivfflat (embedding vector_cosine_ops)`

**State transitions**: None — chapters are immutable content records.

**Validation rules**:
- `tier_required` MUST be one of: `free`, `premium`, `pro`
- `chapter_order` MUST be 1–10, unique
- `prerequisites` elements MUST reference valid chapter `id` values

---

## Table: user_progress

Tracks per-user per-chapter completion and streak data.

| Column       | Type        | Constraints              | Notes |
|--------------|-------------|--------------------------|-------|
| user_id      | TEXT        | PK (composite)           | From JWT |
| chapter_id   | TEXT        | PK (composite), FK→chapters | |
| completed    | BOOLEAN     | DEFAULT FALSE            | |
| score        | FLOAT       |                          | Null if quiz not taken |
| completed_at | TIMESTAMPTZ |                          | Null until completed |
| streak_days  | INTEGER     | DEFAULT 0                | Consecutive active days |
| last_active  | TIMESTAMPTZ | NOT NULL, DEFAULT NOW()  | UTC |

**Streak state transitions**:
```
last_active → today (same day)  : streak unchanged
last_active → yesterday         : streak_days + 1
last_active → 2+ days ago       : streak_days = 1
```

**Validation rules**:
- `score` range: 0.0–100.0 or NULL
- `streak_days` MUST be ≥ 0
- `last_active` always stored in UTC

---

## Table: quizzes

Question sets linked to chapters. Answer keys are stored separately.

| Column     | Type   | Constraints       | Notes |
|------------|--------|-------------------|-------|
| id         | TEXT   | PRIMARY KEY       | e.g. `quiz-001` |
| chapter_id | TEXT   | FK→chapters       | |
| title      | TEXT   | NOT NULL          | |
| questions  | JSONB  | NOT NULL          | Question[] WITHOUT answers |

**Question JSONB schema** (per element):
```json
{
  "id": "q-001",
  "text": "What is an AI agent?",
  "type": "mcq",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."]
}
```

`type` values: `mcq`, `truefalse`, `fill`
`options` is `null` for `fill` type questions.

**Critical rule**: `questions` JSONB MUST NOT contain any answer field.

---

## Table: quiz_answer_keys

Server-side only. Never serialised into any client response.

| Column  | Type   | Constraints        | Notes |
|---------|--------|--------------------|-------|
| quiz_id | TEXT   | PRIMARY KEY, FK→quizzes | |
| answers | JSONB  | NOT NULL           | `{question_id: correct_answer}` |

**Answers JSONB example**:
```json
{
  "q-001": "B",
  "q-002": "true",
  "q-003": "Model Context Protocol"
}
```

**Security rule**: This table is NEVER queried in the quiz GET router. It is only
accessed in the POST submit handler, and `answers` is never included in any response.

---

## Table: user_tiers

Controls feature access and LLM eligibility.

| Column      | Type        | Constraints       | Notes |
|-------------|-------------|-------------------|-------|
| user_id     | TEXT        | PRIMARY KEY       | |
| tier        | TEXT        | NOT NULL DEFAULT 'free' | free/premium/pro/team |
| valid_until | TIMESTAMPTZ |                   | Null = no expiry |

**Tier access matrix**:

| Tier    | Chapters | Adaptive Path | LLM Assessment |
|---------|----------|---------------|----------------|
| free    | 1–3      | ❌ 403        | ❌ 403         |
| premium | 1–10     | ❌ 403        | ❌ 403         |
| pro     | 1–10     | ✅            | ✅             |
| team    | 1–10     | ✅            | ✅             |

**Validation**: `tier` MUST be one of `free`, `premium`, `pro`, `team`.

---

## Table: access_logs

Audit trail for all freemium gate checks.

| Column     | Type        | Constraints  | Notes |
|------------|-------------|--------------|-------|
| id         | SERIAL      | PRIMARY KEY  | |
| user_id    | TEXT        | NOT NULL     | |
| chapter_id | TEXT        | NOT NULL     | |
| allowed    | BOOLEAN     | NOT NULL     | |
| reason     | TEXT        |              | Human-readable reason |
| checked_at | TIMESTAMPTZ | DEFAULT NOW()| UTC |

---

## Table: cost_logs (Phase 2)

Immutable record of every LLM API call. Written BEFORE response is returned.

| Column        | Type        | Constraints   | Notes |
|---------------|-------------|---------------|-------|
| id            | SERIAL      | PRIMARY KEY   | |
| user_id       | TEXT        | NOT NULL      | |
| feature       | TEXT        | NOT NULL      | adaptive-path / assess |
| model         | TEXT        | NOT NULL      | claude-sonnet-4-20250514 |
| input_tokens  | INTEGER     | NOT NULL      | |
| output_tokens | INTEGER     | NOT NULL      | |
| cost_usd      | FLOAT       | NOT NULL      | |
| created_at    | TIMESTAMPTZ | DEFAULT NOW() | UTC |

**Constraint**: A row MUST exist in this table for every LLM call that returns a 200
response. 403 responses generate no row (tier check fires before any call).
