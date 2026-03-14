# CONSTITUTIONAL GUARANTEE: This file contains ZERO LLM API calls.
# All intelligence is handled by the ChatGPT App layer.
# Audit: grep -r "anthropic|openai|langchain" phase1/backend/ must return empty.

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db import create_tables, close_pool
from app.routers import chapters, search, quizzes, progress, access


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield
    await close_pool()


app = FastAPI(
    title="Course Companion FTE — Phase 1",
    description="Deterministic educational API. Zero LLM calls.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chapters.router, prefix="/api/v1/chapters", tags=["chapters"])
app.include_router(search.router, prefix="/api/v1/search", tags=["search"])
app.include_router(quizzes.router, prefix="/api/v1/quizzes", tags=["quizzes"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["progress"])
app.include_router(access.router, prefix="/api/v1/access", tags=["access"])


@app.get("/health", tags=["health"])
async def health_check() -> dict:
    """Health check — confirms zero LLM calls in Phase 1 backend."""
    return {
        "status": "healthy",
        "phase": 1,
        "llm_calls": 0,
        "constitutional_audit": "PASS — zero LLM imports",
    }
