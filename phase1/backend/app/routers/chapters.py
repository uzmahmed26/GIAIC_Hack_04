# ZERO LLM — Content served from R2/DB only. No AI inference here.

import json
import logging
from fastapi import APIRouter, Depends, HTTPException
from asyncpg import Connection

from app.db import get_db
from app.models.chapter import Chapter, ChapterListItem, ChapterListResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("", response_model=ChapterListResponse)
async def list_chapters(db: Connection = Depends(get_db)) -> ChapterListResponse:
    """List all chapters with metadata. Free chapters marked accessible."""
    try:
        rows = await db.fetch(
            """
            SELECT id, title, order_num, tier_required, estimated_minutes
            FROM chapters
            ORDER BY order_num ASC
            """
        )
        items = [ChapterListItem(**dict(r)) for r in rows]
        return ChapterListResponse(chapters=items, total=len(items))
    except Exception as exc:
        logger.error("list_chapters error: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch chapters")


@router.get("/{chapter_id}", response_model=Chapter)
async def get_chapter(chapter_id: str, db: Connection = Depends(get_db)) -> Chapter:
    """Get full chapter content by ID. Served from R2 or DB."""
    try:
        row = await db.fetchrow(
            """
            SELECT id, title, content, content_url, order_num,
                   prerequisites, estimated_minutes, tier_required
            FROM chapters WHERE id = $1
            """,
            chapter_id,
        )
    except Exception as exc:
        logger.error("get_chapter error: %s", exc)
        raise HTTPException(status_code=500, detail="Database error")

    if not row:
        raise HTTPException(status_code=404, detail="Chapter not found")

    data = dict(row)
    data["prerequisites"] = json.loads(data.get("prerequisites") or "[]")
    return Chapter(**data)


@router.get("/{chapter_id}/next")
async def get_next_chapter(chapter_id: str, db: Connection = Depends(get_db)) -> dict:
    """Get next chapter in sequence."""
    try:
        current = await db.fetchrow(
            "SELECT order_num FROM chapters WHERE id = $1", chapter_id
        )
        if not current:
            raise HTTPException(status_code=404, detail="Chapter not found")

        row = await db.fetchrow(
            """
            SELECT id, title, order_num, tier_required, estimated_minutes
            FROM chapters WHERE order_num = $1
            """,
            current["order_num"] + 1,
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("get_next_chapter error: %s", exc)
        raise HTTPException(status_code=500, detail="Database error")

    if not row:
        return {"message": "This is the last chapter", "chapter": None}
    return {"message": "Next chapter found", "chapter": dict(row)}


@router.get("/{chapter_id}/previous")
async def get_previous_chapter(chapter_id: str, db: Connection = Depends(get_db)) -> dict:
    """Get previous chapter in sequence."""
    try:
        current = await db.fetchrow(
            "SELECT order_num FROM chapters WHERE id = $1", chapter_id
        )
        if not current:
            raise HTTPException(status_code=404, detail="Chapter not found")

        row = await db.fetchrow(
            """
            SELECT id, title, order_num, tier_required, estimated_minutes
            FROM chapters WHERE order_num = $1
            """,
            current["order_num"] - 1,
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("get_previous_chapter error: %s", exc)
        raise HTTPException(status_code=500, detail="Database error")

    if not row:
        return {"message": "This is the first chapter", "chapter": None}
    return {"message": "Previous chapter found", "chapter": dict(row)}
