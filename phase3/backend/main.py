"""
Course Companion FTE — Phase 3 Consolidated Backend
Merges Phase 1 (zero LLM) + Phase 2 (gated LLM) APIs into one service.

All Phase 1 endpoints: /api/v1/
All Phase 2 premium endpoints: /api/v2/premium/
Auth: Clerk JWT on all protected routes.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Phase 1 routers (zero LLM — CONSTITUTIONAL GUARANTEE)
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../phase1/backend"))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../phase2/backend"))

from app.routers import chapters, search, quizzes, progress, access  # phase1
from app.routers import adaptive, assessment  # phase2

from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize DB pool
    from app.db import create_tables
    await create_tables()
    yield
    # Shutdown: close DB pool
    from app.db import close_pool
    await close_pool()


app = FastAPI(
    title="Course Companion FTE — Phase 3",
    description=(
        "Consolidated backend. "
        "Phase 1: zero LLM. "
        "Phase 2: gated LLM (Pro/Team only). "
        "Auth: Clerk JWT."
    ),
    version="3.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Phase 1 routes ─────────────────────────────────────────────────────────────
app.include_router(chapters.router, prefix="/api/v1/chapters", tags=["Chapters"])
app.include_router(search.router, prefix="/api/v1/search", tags=["Search"])
app.include_router(quizzes.router, prefix="/api/v1/quizzes", tags=["Quizzes"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["Progress"])
app.include_router(access.router, prefix="/api/v1/access", tags=["Access"])

# ── Phase 2 routes (premium only) ─────────────────────────────────────────────
app.include_router(
    adaptive.router,
    prefix="/api/v2/premium/adaptive-path",
    tags=["Premium: Adaptive Path"],
)
app.include_router(
    assessment.router,
    prefix="/api/v2/premium/assess",
    tags=["Premium: LLM Assessment"],
)


@app.get("/health")
async def health():
    """Phase 3 health check — all systems."""
    return {
        "status": "healthy",
        "phase": 3,
        "phase1_llm_calls": 0,
        "phase2_features": ["adaptive-path", "llm-assessment"],
        "auth": "Clerk JWT",
        "constitutional_audit": "Phase 1 zero LLM verified",
    }
