# Course Companion FTE
### GIAIC Agent Factory Hackathon IV
**Digital Full-Time Equivalent Educational Tutor**

## What is This?
A 24/7 AI tutor for AI Agent Development built with:
- Zero-Backend-LLM architecture (Phase 1)
- Selective Hybrid Intelligence (Phase 2)
- Full Next.js Web App (Phase 3)

---

## Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL (Neon free tier)
- Cloudflare R2 bucket

### Phase 1 — ChatGPT App (Zero Backend LLM)
```powershell
cd phase1/backend
copy ..\..\env.example .env
# Fill in DATABASE_URL and R2 credentials
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### Phase 2 — Hybrid Intelligence
```powershell
cd phase2/backend
copy ..\..\env.example .env
# Add ANTHROPIC_API_KEY to .env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### Phase 3 — Full Web App

**Backend:**
```powershell
cd phase3/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8002
```

**Frontend:**
```powershell
cd phase3/frontend
npm install
npm run dev
```
- Frontend: http://localhost:3000

### MCP Servers (Phase 2 and Phase 3 only)
```powershell
cd mcp-config
powershell -File start-mcp.ps1
```

---

## Project Structure
```
course-companion-fte/
├── CLAUDE.md                        ← Claude Code rules
├── .specify/memory/constitution.md  ← Project constitution
├── specs/course-companion/          ← Spec, Plan, Tasks
├── SKILLS/                          ← 4 ChatGPT App skills
├── mcp-config/                      ← MCP server config
├── content/
│   ├── chapters/                    ← 10 chapter markdown files
│   └── quizzes/                     ← 5 quizzes + answer keys
├── phase1/
│   ├── backend/                     ← FastAPI zero LLM
│   └── chatgpt-app/                 ← Manifest + OpenAPI + Instructions
├── phase2/
│   └── backend/                     ← FastAPI + Claude Sonnet (premium)
├── phase3/
│   ├── backend/                     ← Consolidated FastAPI
│   └── frontend/                    ← Next.js 14 web app
└── scripts/
    ├── audit_phase1.ps1             ← Phase 1 constitutional audit
    └── audit_phase2.ps1             ← Phase 2 constitutional audit
```

---

## Architecture

**Zero-Backend-LLM (Phase 1):**
```
Student → ChatGPT App → FastAPI (zero LLM) → Neon DB + R2
```

**Hybrid Intelligence (Phase 2):**
```
Student → ChatGPT App → FastAPI → [tier check] → Claude Sonnet
```

**Full Web App (Phase 3):**
```
Student → Next.js → FastAPI (all features) → Neon DB + R2 + Claude
```

---

## Constitutional Audit
Run this to verify Phase 1 has zero LLM imports:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/audit_phase1.ps1
```
Expected output: `PASS — Phase 1 has zero LLM imports`

---

## Agent Skills
| Skill | Purpose |
|-------|---------|
| `SKILLS/concept-explainer.md` | Explains concepts from search results |
| `SKILLS/quiz-master.md` | Guides through quizzes step by step |
| `SKILLS/socratic-tutor.md` | Helps stuck students via questions |
| `SKILLS/progress-motivator.md` | Celebrates achievements and milestones |

---

## MCP Servers
| Server | Purpose | Phase |
|--------|---------|-------|
| `filesystem` | Read/write course content files | Phase 2+ |
| `fetch` | Retrieve content from Cloudflare R2 | Phase 2+ |
| `postgres` | Direct DB queries for admin | Phase 3 only |

---

## Freemium Tiers
| Tier | Price | Access |
|------|-------|--------|
| Free | $0 | Chapters 1–3, basic quizzes |
| Premium | $9.99/mo | All 10 chapters + progress tracking |
| Pro | $19.99/mo | Premium + Adaptive Path + LLM Assessment |
| Team | $49.99/mo | Pro + Analytics + Multiple seats |

---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | FastAPI 0.115 + asyncpg + Neon PostgreSQL + pgvector |
| Frontend | Next.js 14 + TypeScript + TailwindCSS + Clerk |
| Storage | Cloudflare R2 |
| AI (Phase 2+) | Claude Sonnet — gated, Pro/Team only |
| Deploy | Fly.io (backend) + Vercel (frontend) |

---

## Course Curriculum (10 Chapters)
| # | Title | Tier | Min |
|---|-------|------|-----|
| 1 | Introduction to AI Agents | Free | 15 |
| 2 | Claude Agent SDK Basics | Free | 20 |
| 3 | MCP Protocol Deep Dive | Free | 20 |
| 4 | Agent Skills Design | Premium | 25 |
| 5 | Tool Use and Function Calling | Premium | 25 |
| 6 | Multi-Agent Patterns | Premium | 30 |
| 7 | Agent Memory Systems | Premium | 30 |
| 8 | Production Agent Deployment | Premium | 25 |
| 9 | Cost Optimization for Agents | Premium | 20 |
| 10 | Agent Factory Architecture | Premium | 30 |

---

## Team
**Hackathon IV — GIAIC Agent Factory**
Built with Spec-Driven Development using Claude Code
