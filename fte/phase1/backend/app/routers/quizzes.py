# ZERO LLM — Rule-based grading only. Answer key never sent to client.

import logging
from fastapi import APIRouter, Depends, HTTPException
from asyncpg import Connection

from app.db import get_db
from app.models.quiz import QuizResponse, QuizSubmission, QuizResult
from app.services.quiz_service import get_quiz_questions, grade_submission
from app.core.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz(
    quiz_id: str,
    db: Connection = Depends(get_db),
    user_id: str = Depends(get_current_user),
) -> QuizResponse:
    """Get quiz questions without answer key. Answer key is server-side only."""
    try:
        quiz = await get_quiz_questions(db, quiz_id)
    except Exception as exc:
        logger.error("get_quiz error: %s", exc)
        raise HTTPException(status_code=500, detail="Database error")

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    return QuizResponse(**quiz)


@router.post("/{quiz_id}/submit", response_model=QuizResult)
async def submit_quiz(
    quiz_id: str,
    submission: QuizSubmission,
    db: Connection = Depends(get_db),
    user_id: str = Depends(get_current_user),
) -> QuizResult:
    """
    Grade quiz submission against server-side answer key. No LLM grading.
    Exact string comparison (case-insensitive). Correct answers never returned.
    """
    try:
        result = await grade_submission(db, quiz_id, submission)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        logger.error("submit_quiz error: %s", exc)
        raise HTTPException(status_code=500, detail="Grading failed")

    return QuizResult(**result)
