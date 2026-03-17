# Course Companion FTE
### GIAIC Agent Factory Hackathon IV
**Digital Full-Time Equivalent Educational Tutor**

> A 24/7 AI tutor for AI Agent Development — built with Zero-Backend-LLM architecture, Hybrid Intelligence, and a full Next.js web app.

---

## Live Demo
- **Frontend:** Deployed on Vercel
- **Backend:** Deployed on Fly.io

---

## What is This?
A freemium educational platform teaching Claude Agent SDK, MCP Protocol, Agent Skills, and Agent Factory Architecture across 10 chapters and 5 quizzes.

| Phase | Description |
|-------|-------------|
| Phase 1 | Zero-Backend-LLM FastAPI + ChatGPT App |
| Phase 2 | Hybrid Intelligence with Claude Sonnet (Pro/Team only) |
| Phase 3 | Full Next.js 14 web app with Clerk authentication |

---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | FastAPI 0.115 + Python 3.12 + asyncpg |
| Database | Neon PostgreSQL + pgvector |
| Storage | Cloudflare R2 |
| Frontend | Next.js 14 + TypeScript + TailwindCSS + shadcn/ui |
| Auth | Clerk |
| AI (Phase 2+) | Claude Sonnet — Pro/Team only |
| Deploy | Fly.io (backend) + Vercel (frontend) |

---

## Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL (Neon free tier)

### 1. Clone the repo
```bash
git clone https://github.com/uzmahmed26/GIAIC_Hack_04.git
cd GIAIC_Hack_04/fte
```

### 2. Setup Phase 1 Backend
```bash
cd phase1/backend
cp ../../.env.example .env
# Fill in DATABASE_URL and other values in .env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Docs: http://localhost:8000/docs

### 3. Seed Database
```bash
cd ../../
python scripts/seed_chapters.py
python scripts/seed_quizzes.py
```

### 4. Setup Frontend
```bash
cd phase3/frontend
cp .env.local.example .env.local
# Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY
npm install
npm run dev
```
Frontend: http://localhost:3000

---

## Environment Variables

### Backend (`phase1/backend/.env`)
```env
DATABASE_URL=postgresql+asyncpg://user:pass@host/dbname
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_key
R2_SECRET_ACCESS_KEY=your_secret
R2_BUCKET_NAME=course-companion-content
R2_PUBLIC_URL=https://your-bucket.r2.dev
JWT_SECRET=your_secret
APP_ENV=development
```

### Frontend (`phase3/frontend/.env.local`)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Deployment

### Frontend → Vercel
1. Go to https://vercel.com → New Project
2. Import: `https://github.com/uzmahmed26/GIAIC_Hack_04`
3. **Root Directory:** `fte/phase3/frontend`
4. Add Environment Variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_API_URL` → your backend URL
5. Click Deploy

### Backend → Fly.io
```bash
cd phase1/backend
fly launch --name course-companion-api
fly secrets set DATABASE_URL=... JWT_SECRET=...
fly deploy
```

---

## Course Curriculum
| # | Title | Tier |
|---|-------|------|
| 1 | Introduction to AI Agents | Free |
| 2 | Claude Agent SDK Basics | Free |
| 3 | MCP Protocol Deep Dive | Free |
| 4 | Agent Skills Design | Premium |
| 5 | Tool Use and Function Calling | Premium |
| 6 | Multi-Agent Patterns | Premium |
| 7 | Agent Memory Systems | Premium |
| 8 | Production Agent Deployment | Premium |
| 9 | Cost Optimization for Agents | Premium |
| 10 | Agent Factory Architecture | Premium |

---

## Freemium Tiers
| Tier | Price | Access |
|------|-------|--------|
| Free | $0 | Chapters 1–3, basic quizzes |
| Premium | $9.99/mo | All 10 chapters |
| Pro | $19.99/mo | + Adaptive Path + LLM Assessment |
| Team | $49.99/mo | + Analytics + Multiple seats |

---

## Constitutional Audit
```bash
powershell -ExecutionPolicy Bypass -File scripts/audit_phase1.ps1
# Expected: PASS — Phase 1 has zero LLM imports
```

---

**Built for GIAIC Agent Factory Hackathon IV using Spec-Driven Development with Claude Code**
