"""
Course Companion FTE — Phase 2 Backend
Hybrid Intelligence Architecture

Phase 2 endpoints: premium only at /api/v2/premium/
Constitutional guarantee: Every LLM call checks tier BEFORE calling API.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import adaptive, assessment
from app.core.config import settings

app = FastAPI(
    title="Course Companion FTE — Phase 2",
    description="Hybrid Intelligence. Premium LLM features gated behind Pro and Team tiers.",
    version="2.0.0",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    adaptive.router,
    prefix="/api/v2/premium/adaptive-path",
    tags=["Premium: Adaptive Learning Path"],
)

app.include_router(
    assessment.router,
    prefix="/api/v2/premium/assess",
    tags=["Premium: LLM Assessment"],
)


@app.get("/health")
async def health():
    """Health check — confirms Phase 2 is running with tier gating active."""
    return {
        "status": "healthy",
        "phase": 2,
        "llm_features": ["adaptive-path", "llm-assessment"],
        "tier_required": "pro or team",
        "constitutional_audit": "Phase 1 zero LLM — Phase 2 gated LLM",
    }
