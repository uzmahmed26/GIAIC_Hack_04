# Course Companion FTE — Task List

## Phase 1: Zero-Backend-LLM

### TASK-001: Create project folder structure
- [X] phase1/backend/app/routers/
- [X] phase1/backend/app/models/
- [X] phase1/backend/app/services/
- [X] phase1/backend/app/core/
- [X] phase1/backend/migrations/
- [X] phase1/chatgpt-app/
- [X] phase2/backend/app/routers/
- [X] phase2/backend/app/models/
- [X] phase2/backend/app/services/
- [X] phase2/backend/app/middleware/
- [X] phase3/backend/
- [X] phase3/frontend/
- [X] shared/
- [X] content/chapters/
- [X] content/quizzes/
- [X] scripts/

### TASK-002: Create phase1/backend/requirements.txt
- [X] fastapi==0.115.0
- [X] uvicorn[standard]==0.30.0
- [X] asyncpg==0.29.0
- [X] python-dotenv==1.0.0
- [X] pydantic==2.7.0
- [X] pydantic-settings==2.3.0
- [X] boto3==1.34.0
- [X] pgvector==0.3.2
- [X] sentence-transformers==3.0.0
- [X] pytest==8.2.0
- [X] httpx==0.27.0
- [X] python-jose[cryptography]==3.3.0

### TASK-003: Create phase2/backend/requirements.txt
- [X] All Phase 1 packages
- [X] anthropic==0.28.0
- [X] tiktoken==0.7.0

### TASK-004: Create SKILLS/ folder with 4 skill files
- [X] SKILLS/concept-explainer.md
- [X] SKILLS/quiz-master.md
- [X] SKILLS/socratic-tutor.md
- [X] SKILLS/progress-motivator.md

### TASK-005: Create mcp-config/ folder
- [X] mcp-config/servers.json
- [X] mcp-config/start-mcp.ps1
- [X] mcp-config/start-mcp.sh
- [X] mcp-config/README.md

### TASK-006: Create .env.example
- [X] DATABASE_URL, R2_*, ANTHROPIC_API_KEY, JWT_SECRET, CLERK_SECRET_KEY, APP_ENV, CORS_ORIGINS

### TASK-007: Create scripts/audit_phase1.ps1
- [X] PowerShell script scanning for anthropic|openai|langchain|litellm in phase1/backend/

### TASK-008: Create phase1/backend/app/core/config.py
- [X] pydantic-settings BaseSettings for all env vars

### TASK-009: Create phase1/backend/app/core/auth.py
- [X] JWT verification via python-jose
- [X] HTTPBearer dependency

### TASK-010: Create phase1/backend/app/db.py
- [X] asyncpg connection pool
- [X] get_db() FastAPI dependency
- [X] create_tables() reads and runs migration SQL files
- [X] close_pool() on shutdown

### TASK-011: Create migrations/001_create_chapters.sql
- [X] CREATE EXTENSION vector
- [X] chapters table with embedding vector(384) and ivfflat index

### TASK-012: Create migrations/002_create_user_progress.sql
- [X] user_progress table with UNIQUE(user_id, chapter_id)

### TASK-013: Create migrations/003_create_quizzes.sql
- [X] quizzes table with questions JSONB

### TASK-014: Create migrations/004_create_answer_keys.sql
- [X] quiz_answer_keys table (server-side only, never exposed)

### TASK-015: Create migrations/005_create_user_tiers.sql
- [X] user_tiers table with seed data for demo users

### TASK-016: Create content/chapters/ch-001.md
- [X] Introduction to AI Agents (free, 15min)

### TASK-017: Create content/chapters/ch-002.md
- [X] Claude Agent SDK Basics (free, 20min)

### TASK-018: Create content/chapters/ch-003.md
- [X] MCP Protocol Deep Dive (free, 20min)

### TASK-019: Create content/chapters/ch-004.md
- [X] Agent Skills Design (premium, 25min)

### TASK-020: Create content/chapters/ch-005.md
- [X] Tool Use and Function Calling (premium, 25min)

### TASK-021: Create content/chapters/ch-006.md
- [X] Multi-Agent Patterns (premium, 30min)

### TASK-022: Create content/chapters/ch-007.md
- [X] Agent Memory Systems (premium, 30min)

### TASK-023: Create content/chapters/ch-008.md
- [X] Production Agent Deployment (premium, 25min)

### TASK-024: Create content/chapters/ch-009.md
- [X] Cost Optimization for Agents (premium, 20min)

### TASK-025: Create content/chapters/ch-010.md
- [X] Agent Factory Architecture (premium, 30min)

### TASK-026: Create content/quizzes/quiz-001.json + quiz-001-answers.json
- [X] 5 questions for ch-001 (Introduction to AI Agents)

### TASK-027: Create content/quizzes/quiz-002.json + quiz-002-answers.json
- [X] 5 questions for ch-002 (Claude Agent SDK Basics)

### TASK-028: Create content/quizzes/quiz-003.json + quiz-003-answers.json
- [X] 5 questions for ch-003 (MCP Protocol Deep Dive)

### TASK-029: Create content/quizzes/quiz-004.json + quiz-004-answers.json
- [X] 5 questions for ch-005 (Tool Use and Function Calling)

### TASK-030: Create content/quizzes/quiz-005.json + quiz-005-answers.json
- [X] 5 questions for ch-010 (Agent Factory Architecture)

### TASK-031: Create phase1/backend/app/models/chapter.py
- [X] Chapter, ChapterListItem, ChapterListResponse Pydantic models

### TASK-032: Create phase1/backend/app/models/quiz.py
- [X] Question, QuizResponse, QuizSubmission, QuestionResult, QuizResult models

### TASK-033: Create phase1/backend/app/models/progress.py
- [X] ProgressUpdate, ChapterProgress, ProgressResponse, StreakResponse models

### TASK-034: Create phase1/backend/app/models/access.py
- [X] AccessCheckResponse model

### TASK-035: Create phase1/backend/app/models/search.py
- [X] SearchResult, SearchResponse models

### TASK-036: Create phase1/backend/app/services/content_service.py
- [X] get_all_chapters(), get_chapter(), get_adjacent_chapter()

### TASK-037: Create phase1/backend/app/services/search_service.py
- [X] Loads all-MiniLM-L6-v2 at module level
- [X] search() using pgvector cosine similarity

### TASK-038: Create phase1/backend/app/services/quiz_service.py
- [X] get_quiz_questions() never touches answer_keys table
- [X] grade_submission() server-side key fetch, never returns correct_answer

### TASK-039: Create phase1/backend/app/services/progress_service.py
- [X] Streak logic: gap==0→unchanged, gap==1→+1, gap>1→reset
- [X] Milestone messages at 7, 30, 100 days

### TASK-040: Create phase1/backend/app/services/access_service.py
- [X] TIER_HIERARCHY and TIER_CHAPTER_MAP
- [X] get_user_tier(), check_chapter_access()

### TASK-041: Create phase1/backend/app/services/embedding_service.py
- [X] Singleton model loader
- [X] get_query_embedding() returns list[float]

### TASK-042: Create phase1/backend/app/routers/chapters.py
- [X] GET /, GET /{id}, GET /{id}/next, GET /{id}/previous

### TASK-043: Create phase1/backend/app/routers/search.py
- [X] GET / with q, chapter, limit parameters

### TASK-044: Create phase1/backend/app/routers/quizzes.py
- [X] GET /{quiz_id}, POST /{quiz_id}/submit

### TASK-045: Create phase1/backend/app/routers/progress.py
- [X] GET /{user_id}, PUT /{user_id}/chapter/{id}, GET /{user_id}/streak

### TASK-046: Create phase1/backend/app/routers/access.py
- [X] GET /{user_id}/chapter/{id}

### TASK-047: Create phase1/backend/app/main.py
- [X] FastAPI app with lifespan, CORS, 5 routers, /health endpoint
- [X] ZERO LLM imports verified

### TASK-048: Create phase1/chatgpt-app/manifest.yaml
- [X] App metadata, skills references, API connection

### TASK-049: Create phase1/chatgpt-app/openapi.yaml
- [X] Full OpenAPI 3.1.0 spec for all 11 Phase 1 endpoints

### TASK-050: Create phase1/chatgpt-app/instructions.md
- [X] Full behavioral instructions with all 4 skills embedded

---

## Phase 1 Acceptance Checklist

- [X] Phase 1 backend has ZERO LLM imports (run: scripts/audit_phase1.ps1)
- [X] All 10 chapter files created in content/chapters/
- [X] All 10 quiz files (5 questions + 5 answer keys) created in content/quizzes/
- [X] ChatGPT App files created: manifest.yaml, openapi.yaml, instructions.md
- [X] All 6 Phase 1 features implemented (FEAT-01 through FEAT-06)
- [ ] Database migrations run successfully against Neon PostgreSQL
- [ ] All endpoints tested end-to-end with httpx
- [ ] Free user cannot access chapter 4 or above (verified via API)
- [ ] Answer key never appears in any API response (verified via test)
- [ ] ChatGPT App loads and connects to backend API

---

## Phase 2: Hybrid Intelligence

### TASK-051: Create phase2/backend/app/middleware/tier_check.py
- [X] require_tier() FastAPI dependency
- [X] TIER_HIERARCHY dict
- [X] 403 raised BEFORE any LLM call for ineligible tiers

### TASK-052: Create phase2/backend/app/services/cost_tracker.py
- [X] log_llm_cost() async function
- [X] Writes to cost_logs table after every LLM call

### TASK-053: Create phase2/backend/app/routers/adaptive.py (FEAT-07)
- [X] POST / endpoint — Pro/Team only
- [X] Tier check via require_tier(["pro", "team"]) BEFORE API call
- [X] Cost logged via log_llm_cost() AFTER API call
- [X] Claude Sonnet, JSON response format

### TASK-054: Create phase2/backend/app/routers/assessment.py (FEAT-08)
- [X] POST / endpoint — Pro/Team only
- [X] Tier check via require_tier(["pro", "team"]) BEFORE API call
- [X] Cost logged via log_llm_cost() AFTER API call
- [X] Rubric-based grading: conceptual_accuracy, completeness, practical_understanding

### TASK-055: Create phase2/backend/app/main.py
- [X] FastAPI app with 2 premium routers
- [X] /api/v2/premium/adaptive-path and /api/v2/premium/assess prefixes
- [X] /health endpoint

### TASK-056: Create phase2/backend/migrations/006_create_cost_logs.sql
- [X] cost_logs table with indexes on user_id, feature, created_at

### TASK-057: Create phase2/backend/app/core/config.py
- [X] Settings with ANTHROPIC_API_KEY added

### TASK-058: Create phase2/backend/app/services/mcp_service.py
- [X] read_chapter_via_mcp() with filesystem MCP + fallback
- [X] fetch_r2_content() with fetch MCP + fallback
- [X] list_content_files() with filesystem MCP + fallback

### TASK-059: Create scripts/audit_phase2.ps1
- [X] 4-check audit: Phase 1 zero LLM, Phase 2 LLM present, require_tier in all routers, log_llm_cost in all routers

---

## Phase 3: Full Web App

### TASK-060: Frontend project setup
- [X] package.json (Next.js 14, Clerk, Tailwind, TypeScript)
- [X] next.config.ts, tailwind.config.ts, tsconfig.json
- [X] .env.local.example

### TASK-061: Clerk auth middleware
- [X] middleware.ts — public routes: /, /sign-in, /sign-up, /premium
- [X] lib/api.ts — typed API client with Clerk JWT

### TASK-062: App layout + global CSS
- [X] app/layout.tsx — ClerkProvider root
- [X] app/globals.css — Tailwind base + component utilities

### TASK-063: Landing page (/)
- [X] Hero section with sign-up CTA
- [X] Features section (3 cards)
- [X] Pricing section (4 tiers: free, premium, pro, team)

### TASK-064: Dashboard page (/dashboard)
- [X] Stats row (chapters done, avg score, streak, last active)
- [X] Progress bar
- [X] Chapter list with start/review links

### TASK-065: Chapter reader (/learn/[chapterId])
- [X] Access gate (redirects to /premium if denied)
- [X] Full chapter content display
- [X] Mark complete button (calls PUT /api/v1/progress)
- [X] Previous/Next navigation

### TASK-066: Quiz page (/quiz/[quizId])
- [X] One question at a time with progress bar
- [X] MCQ, True/False, Fill-in-blank support
- [X] Submit + results view with per-question feedback

### TASK-067: Progress page (/progress)
- [X] Streak card with flame and milestone badge
- [X] Course completion progress bar
- [X] Chapter-by-chapter score breakdown

### TASK-068: Premium upgrade page (/premium)
- [X] 3 plan cards (Premium, Pro, Team) with feature comparison
- [X] Clerk SignUpButton on each plan

### TASK-069: Phase 3 consolidated backend
- [X] phase3/backend/main.py — merges Phase 1 + Phase 2 routers
- [X] phase3/backend/requirements.txt

### TASK-070: Deployment config
- [X] phase1/backend/Dockerfile
- [X] phase1/backend/fly.toml
- [X] phase3/frontend/vercel.json
