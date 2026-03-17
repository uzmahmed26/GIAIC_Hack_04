# Architecture Document — Course Companion FTE
**GIAIC Agent Factory Hackathon IV**

---

## System Overview

Course Companion FTE implements the **Agent Factory Architecture** with three phases:

| Phase | Name | LLM Backend | Key Tech |
|-------|------|-------------|----------|
| 1 | Zero-Backend-LLM | None (ChatGPT only) | FastAPI + pgvector |
| 2 | Hybrid Intelligence | Claude Sonnet (gated) | anthropic SDK |
| 3 | Full Web App | Phase 1 + Phase 2 | Next.js 14 + Clerk |

---

## Phase 1 Architecture — Zero-Backend-LLM

### Components

```
┌─────────────────────────────────────────────────────────────┐
│  Student (ChatGPT Plus)                                     │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────────┐                                    │
│  │   ChatGPT App        │  ← manifest.yaml + openapi.yaml  │
│  │   + 4 SKILLS         │  ← concept-explainer, quiz-master│
│  └────────┬────────────┘     socratic-tutor, progress-moti │
│           │  HTTP                                           │
│           ▼                                                 │
│  ┌─────────────────────┐                                    │
│  │  FastAPI Backend     │  ← ZERO LLM IMPORTS              │
│  │  phase1/backend/     │                                   │
│  │  ├── /chapters       │                                   │
│  │  ├── /search         │  ← pgvector cosine similarity     │
│  │  ├── /quizzes        │  ← exact string grading           │
│  │  ├── /progress       │  ← streak logic (UTC dates)       │
│  │  └── /access         │  ← tier gate, no LLM              │
│  └──────┬──────┬────────┘                                   │
│         │      │                                            │
│         ▼      ▼                                            │
│  ┌──────────┐ ┌────────────────┐                           │
│  │  Neon DB  │ │ Cloudflare R2  │                          │
│  │  pgvector │ │ chapter .md    │                          │
│  └──────────┘ └────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow — Concept Explanation

1. Student asks: *"What is an MCP server?"*
2. ChatGPT App activates `concept-explainer` skill
3. Skill calls `GET /api/v1/search?q=MCP+server&limit=3`
4. Backend generates query embedding (local `all-MiniLM-L6-v2`)
5. pgvector returns top 3 chunks by cosine similarity
6. ChatGPT explains using **only** those chunks (grounded)
7. Cites chapter: *"As explained in Chapter 3..."*

### Constitutional Guarantee

```bash
grep -r "anthropic\|openai\|langchain" phase1/backend/
# Expected: empty output
```

---

## Phase 2 Architecture — Hybrid Intelligence

### Added Components

```
┌─────────────────────────────────────────────────────────────┐
│  Premium User (Pro or Team tier)                            │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  FastAPI — phase2/backend/                          │   │
│  │                                                     │   │
│  │  POST /api/v2/premium/adaptive-path                 │   │
│  │       │                                             │   │
│  │       ▼                                             │   │
│  │  require_tier(["pro","team"])  ← FIRES FIRST        │   │
│  │       │                                             │   │
│  │  Free/Premium user? → 403 (no API call made)        │   │
│  │       │                                             │   │
│  │  Pro/Team user? → continue                          │   │
│  │       │                                             │   │
│  │       ▼                                             │   │
│  │  client.messages.create(...)  ← Claude Sonnet       │   │
│  │       │                                             │   │
│  │       ▼                                             │   │
│  │  log_llm_cost(...)            ← ALWAYS LOGGED       │   │
│  │       │                                             │   │
│  │       ▼                                             │   │
│  │  Return JSON response                               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Constitutional Rules (Phase 2)

1. `require_tier()` is a FastAPI `Depends` — executes **before** router body
2. `log_llm_cost()` called immediately after **every** `client.messages.create()`
3. No path through Phase 2 code reaches Anthropic API without tier check
4. Phase 1 code untouched — zero LLM guarantee intact

### Cost Log Table

```sql
CREATE TABLE cost_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    feature VARCHAR(50) NOT NULL,        -- 'adaptive_path' | 'llm_assessment'
    model VARCHAR(100) NOT NULL,
    input_tokens INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    cost_usd FLOAT NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

---

## Phase 3 Architecture — Full Web App

### Full System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                    │
│      │                                                      │
│      ▼                                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js 14 — phase3/frontend/                       │  │
│  │  ├── /               Landing + pricing               │  │
│  │  ├── /dashboard      Progress overview               │  │
│  │  ├── /learn/[id]     Chapter reader                  │  │
│  │  ├── /quiz/[id]      Interactive quiz                │  │
│  │  ├── /progress       Streak + charts                 │  │
│  │  └── /premium        Upgrade page                    │  │
│  │                                                      │  │
│  │  middleware.ts → Clerk JWT verification              │  │
│  │  lib/api.ts    → typed backend client                │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │ Bearer JWT                        │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  FastAPI — phase3/backend/                           │  │
│  │  /api/v1/   ← Phase 1 routes (zero LLM)             │  │
│  │  /api/v2/   ← Phase 2 routes (gated LLM)            │  │
│  └──────────────────────────────────────────────────────┘  │
│                    │              │                         │
│                    ▼              ▼                         │
│             Neon PostgreSQL   Claude Sonnet API             │
│             + pgvector        (Pro/Team only)               │
└─────────────────────────────────────────────────────────────┘
```

---

## MCP Server Architecture

```
mcp-config/servers.json defines three MCP servers:

┌──────────────┬────────────────────────┬─────────────┐
│ Server       │ Capability             │ Phase       │
├──────────────┼────────────────────────┼─────────────┤
│ filesystem   │ read/write content/    │ Phase 2+    │
│ fetch        │ GET Cloudflare R2 URLs │ Phase 2+    │
│ postgres     │ raw SQL queries        │ Phase 3 only│
└──────────────┴────────────────────────┴─────────────┘

Start with: powershell -File mcp-config/start-mcp.ps1
```

---

## Agent Skills Architecture

```
SKILLS/ ─────────────────────────────────────────────────
├── concept-explainer.md   Trigger: "what is", "explain"
│       └── Always calls GET /api/v1/search first
│
├── quiz-master.md         Trigger: "quiz me", "test me"
│       └── One question at a time, grades via API
│
├── socratic-tutor.md      Trigger: student struggling
│       └── 3 guiding questions before revealing answer
│
└── progress-motivator.md  Trigger: milestone, progress check
        └── Calls GET /api/v1/progress/{user_id}/streak

Loaded by: phase1/chatgpt-app/manifest.yaml
Instructions: phase1/chatgpt-app/instructions.md
```

---

## Database Schema Summary

```
chapters          — content + embeddings (vector 384)
user_progress     — completion, score, streak, last_active
quizzes           — questions JSONB (no answer keys)
quiz_answer_keys  — answers JSONB (NEVER sent to client)
user_tiers        — free | premium | pro | team
cost_logs         — Phase 2 LLM call audit trail
```

---

## Security Architecture

| Rule | Implementation |
|------|---------------|
| Secrets never in code | pydantic-settings reads `.env` |
| JWT required on protected routes | HTTPBearer + python-jose |
| Answer keys never exposed | Separate table, never queried in GET |
| Phase 1 zero LLM | `grep` audit in CI, `audit_phase1.ps1` |
| Free users blocked before LLM | `require_tier()` Depends fires first |
| Every LLM call logged | `log_llm_cost()` immediately after call |
