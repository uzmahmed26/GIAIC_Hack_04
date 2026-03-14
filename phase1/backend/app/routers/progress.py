# ZERO LLM — Pure database reads and writes for progress tracking.

import logging
from fastapi import APIRouter, Depends, HTTPException
from asyncpg import Connection

from app.db import get_db
from app.models.progress import ProgressUpdate, ProgressResponse, StreakResponse
from app.services.progress_service import (
    get_user_progress, update_chapter_progress, get_streak
)
from app.core.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/{user_id}", response_model=ProgressResponse)
async def get_progress(
    user_id: str,
    db: Connection = Depends(get_db),
    current_user: str = Depends(get_current_user),
) -> ProgressResponse:
    """Get full progress summary for a user."""
    try:
        data = await get_user_progress(db, user_id)
        return ProgressResponse(**data)
    except Exception as exc:
        logger.error("get_progress error: %s", exc)
        raise HTTPException(status_code=500, detail="Database error")


@router.put("/{user_id}/chapter/{chapter_id}")
async def update_progress(
    user_id: str,
    chapter_id: str,
    update: ProgressUpdate,
    db: Connection = Depends(get_db),
    current_user: str = Depends(get_current_user),
) -> dict:
    """
    Mark chapter complete or in-progress. Updates streak automatically.
    Streak increments on consecutive days, resets after a gap of more than 1 day.
    """
    try:
        result = await update_chapter_progress(db, user_id, chapter_id, update)
        return result
    except Exception as exc:
        logger.error("update_progress error: %s", exc)
        raise HTTPException(status_code=500, detail="Database error")


@router.get("/{user_id}/streak", response_model=StreakResponse)
async def get_user_streak(
    user_id: str,
    db: Connection = Depends(get_db),
    current_user: str = Depends(get_current_user),
) -> StreakResponse:
    """
    Get current streak and milestone information.
    Milestones: 7 days, 30 days, 100 days.
    """
    try:
        data = await get_streak(db, user_id)
        return StreakResponse(**data)
    except Exception as exc:
        logger.error("get_streak error: %s", exc)
        raise HTTPException(status_code=500, detail="Database error")
