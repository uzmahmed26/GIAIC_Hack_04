# ZERO LLM — Pre-computed embeddings only. No inference at query time.

import logging
from fastapi import APIRouter, Depends, HTTPException, Query
from asyncpg import Connection

from app.db import get_db
from app.models.search import SearchResponse
from app.services.search_service import search

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("", response_model=SearchResponse)
async def search_content(
    q: str = Query(..., min_length=2, description="Search query (min 2 chars)"),
    chapter: str | None = Query(None, description="Filter results to a specific chapter ID"),
    limit: int = Query(3, ge=1, le=10, description="Number of results (1–10)"),
    db: Connection = Depends(get_db),
) -> SearchResponse:
    """
    Search course content using pre-computed embeddings. No LLM at query time.
    Embeddings pre-computed by scripts/generate_embeddings.py at content load time.
    Uses pgvector cosine similarity on the chapters embedding column.
    """
    try:
        results = await search(db, query=q, chapter_filter=chapter, limit=limit)
        return SearchResponse(query=q, results=results, total=len(results))
    except Exception as exc:
        logger.error("search_content error: %s", exc)
        raise HTTPException(status_code=500, detail="Search failed")
