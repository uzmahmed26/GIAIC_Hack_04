# Quickstart: Course Companion FTE — Phase 1

**Goal**: Get Phase 1 backend running locally and pass the constitutional audit.

---

## Prerequisites

- Python 3.12
- Node.js 20
- Neon PostgreSQL account (free tier works)
- Cloudflare R2 bucket created
- Git

---

## Step 1 — Clone and create `.env`

```bash
git clone <repo>
cd <repo>
cp .env.example phase1/backend/.env
# Fill in DATABASE_URL, R2_* values, JWT_SECRET
```

---

## Step 2 — Install Phase 1 dependencies

```bash
cd phase1/backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Constitutional audit** (run now, must return empty):
```bash
grep -r "anthropic\|openai\|langchain\|litellm" phase1/backend/
# Expected output: (nothing)
```

---

## Step 3 — Run database migrations

```bash
# From phase1/backend/
psql $DATABASE_URL -f migrations/001_create_tables.sql
psql $DATABASE_URL -f migrations/002_seed_tiers.sql
```

---

## Step 4 — Generate embeddings and upload content

```bash
# From repo root
python scripts/generate_embeddings.py    # writes embeddings to DB
python scripts/upload_to_r2.py           # uploads markdown to R2
```

---

## Step 5 — Start Phase 1 backend

```bash
cd phase1/backend
uvicorn main:app --reload --port 8000
```

Verify: `http://localhost:8000/docs` → all 11 endpoints visible with docstrings.

---

## Step 6 — Validate key endpoints

```bash
# Chapters list (no auth needed)
curl http://localhost:8000/api/v1/chapters

# Search (no auth needed)
curl "http://localhost:8000/api/v1/search?q=mcp+protocol&limit=3"

# Quiz questions (needs JWT)
curl -H "Authorization: Bearer <test_token>" \
     http://localhost:8000/api/v1/quizzes/quiz-001

# Access gate — free user, chapter 4 (should return allowed: false)
curl -H "Authorization: Bearer <free_user_token>" \
     http://localhost:8000/api/v1/access/user-001/chapter/ch-004
```

---

## Step 7 — Connect ChatGPT App

1. Go to ChatGPT App builder
2. Upload `phase1/chatgpt-app/manifest.yaml`
3. Set backend URL to your local tunnel or deployed URL
4. Upload `phase1/chatgpt-app/openapi.yaml`
5. Test: ask "explain Chapter 1" — should cite chapter number

---

## Phase 2 Quickstart (after Phase 1 audit passes)

```bash
# Start MCP servers first
powershell -ExecutionPolicy Bypass -File mcp-config/start-mcp.ps1
# or on Linux/Mac:
chmod +x mcp-config/start-mcp.sh && ./mcp-config/start-mcp.sh

# Install Phase 2 deps
cd phase2/backend
pip install -r requirements.txt   # adds anthropic, tiktoken

# Run Phase 2 backend
uvicorn main:app --reload --port 8001
```

Test 403 gate:
```bash
# Free user → must get 403
curl -X POST -H "Authorization: Bearer <free_token>" \
     -H "Content-Type: application/json" \
     -d '{"completed_chapters":[],"quiz_scores":{},"struggling_topics":[],"learning_goal":""}' \
     http://localhost:8001/api/v2/premium/adaptive-path
# Expected: {"detail": "Pro or Team tier required"}
```

---

## Phase 3 Quickstart

```bash
cd phase3/frontend
npm install
cp .env.example .env.local   # add Clerk keys
npm run dev                  # http://localhost:3000
```
