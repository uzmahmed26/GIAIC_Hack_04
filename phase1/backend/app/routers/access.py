# ZERO LLM — Pure rule-based tier checking. No inference needed.

import logging
from fastapi import APIRouter, Depends, HTTPException
from asyncpg import Connection

from app.db import get_db
from app.models.access import AccessCheckResponse
from app.services.access_service import check_chapter_access
from app.core.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()

FREE_CHAPTERS = ["ch-001", "ch-002", "ch-003"]
TIER_HIERARCHY = {"free": 1, "premium": 2, "pro": 3, "team": 4}


@router.get("/{user_id}/chapter/{chapter_id}", response_model=AccessCheckResponse)
async def check_access(
    user_id: str,
    chapter_id: str,
    db: Connection = Depends(get_db),
    current_user: str = Depends(get_current_user),
) -> AccessCheckResponse:
    """Check if user has access to a chapter based on subscription tier."""
    try:
        result = await check_chapter_access(db, user_id, chapter_id)
        return AccessCheckResponse(**result)
    except Exception as exc:
        logger.error("check_access error: %s", exc)
        raise HTTPException(status_code=500, detail="Access check failed")
