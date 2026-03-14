"""
Progress service — FEAT-05 (Progress Tracking).
ZERO LLM — pure DB reads and writes.
Streak logic anchored in UTC date.
"""
import logging
from datetime import date, datetime
from app.models.progress import ProgressUpdate

logger = logging.getLogger(__name__)

TOTAL_CHAPTERS = 10

MILESTONES = {
    7: "7-day streak achieved!",
    30: "30-day streak — incredible!",
    100: "100-day streak — legendary!",
}


def _milestone(streak: int) -> str | None:
    return MILESTONES.get(streak)


async def get_user_progress(db, user_id: str) -> dict:
    """Return full progress summary for a user across all chapters."""
    try:
        rows = await db.fetch(
            """
            SELECT chapter_id, completed, score, completed_at,
                   streak_days, last_active
            FROM user_progress
            WHERE user_id = $1
            ORDER BY chapter_id
            """,
            user_id,
        )
    except Exception as exc:
        logger.error("get_user_progress error: %s", exc)
        raise

    chapters_completed = sum(1 for r in rows if r["completed"])
    scores = [r["score"] for r in rows if r["score"] is not None]
    avg_score = round(sum(scores) / len(scores), 2) if scores else 0.0
    streak = rows[0]["streak_days"] if rows else 0
    last_active = rows[0]["last_active"].isoformat() if rows else date.today().isoformat()

    chapter_progress = [
        {
            "chapter_id": r["chapter_id"],
            "completed": r["completed"],
            "score": r["score"],
            "completed_at": r["completed_at"].isoformat() if r["completed_at"] else None,
        }
        for r in rows
    ]

    return {
        "user_id": user_id,
        "chapters_completed": chapters_completed,
        "total_chapters": TOTAL_CHAPTERS,
        "average_score": avg_score,
        "streak_days": streak,
        "last_active": last_active,
        "chapter_progress": chapter_progress,
    }


async def update_chapter_progress(
    db, user_id: str, chapter_id: str, update: ProgressUpdate
) -> dict:
    """
    Upsert progress record with streak update logic.
    Streak: same day → unchanged, yesterday → +1, older → reset to 1.
    """
    today = date.today()

    try:
        existing = await db.fetchrow(
            "SELECT streak_days, last_active FROM user_progress WHERE user_id=$1 AND chapter_id=$2",
            user_id, chapter_id,
        )

        if existing:
            last = existing["last_active"]
            if isinstance(last, datetime):
                last = last.date()
            gap = (today - last).days
            if gap == 0:
                new_streak = existing["streak_days"]
            elif gap == 1:
                new_streak = existing["streak_days"] + 1
            else:
                new_streak = 1
        else:
            new_streak = 1

        completed_at = datetime.utcnow() if update.completed else None

        await db.execute(
            """
            INSERT INTO user_progress
              (user_id, chapter_id, completed, score, completed_at, streak_days, last_active)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (user_id, chapter_id) DO UPDATE SET
              completed = EXCLUDED.completed,
              score = EXCLUDED.score,
              completed_at = EXCLUDED.completed_at,
              streak_days = EXCLUDED.streak_days,
              last_active = EXCLUDED.last_active
            """,
            user_id, chapter_id, update.completed, update.score,
            completed_at, new_streak, today,
        )
    except Exception as exc:
        logger.error("update_chapter_progress error: %s", exc)
        raise

    return {
        "chapter_id": chapter_id,
        "completed": update.completed,
        "score": update.score,
        "streak_days": new_streak,
        "last_active": today.isoformat(),
        "completed_at": completed_at.isoformat() if completed_at else None,
    }


async def get_streak(db, user_id: str) -> dict:
    """Return current streak and milestone message."""
    try:
        row = await db.fetchrow(
            """
            SELECT streak_days, last_active FROM user_progress
            WHERE user_id = $1
            ORDER BY last_active DESC LIMIT 1
            """,
            user_id,
        )
    except Exception as exc:
        logger.error("get_streak error: %s", exc)
        raise

    streak = row["streak_days"] if row else 0
    last_active = row["last_active"].isoformat() if row else date.today().isoformat()

    return {
        "user_id": user_id,
        "streak_days": streak,
        "last_active": last_active,
        "milestone_reached": _milestone(streak),
    }
