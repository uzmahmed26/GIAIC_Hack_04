"""
Content service — FEAT-01, FEAT-02.
ZERO LLM — DB reads only.
"""
import json
import logging

logger = logging.getLogger(__name__)


async def get_all_chapters(db) -> list:
    """Return all chapters ordered by order_num (summary only, no content/embedding)."""
    try:
        rows = await db.fetch(
            """
            SELECT id, title, order_num, tier_required, estimated_minutes
            FROM chapters ORDER BY order_num ASC
            """
        )
        return [dict(r) for r in rows]
    except Exception as exc:
        logger.error("get_all_chapters error: %s", exc)
        raise


async def get_chapter(db, chapter_id: str) -> dict | None:
    """Return full chapter data by id, or None if not found."""
    try:
        row = await db.fetchrow(
            """
            SELECT id, title, content, content_url, order_num,
                   prerequisites, estimated_minutes, tier_required
            FROM chapters WHERE id = $1
            """,
            chapter_id,
        )
        if not row:
            return None
        data = dict(row)
        data["prerequisites"] = json.loads(data.get("prerequisites") or "[]")
        return data
    except Exception as exc:
        logger.error("get_chapter error: %s", exc)
        raise


async def get_adjacent_chapter(db, chapter_id: str, direction: str) -> dict | None:
    """
    Return the next or previous chapter in sequential order.
    direction must be 'next' or 'previous'.
    Returns None if no adjacent chapter exists.
    """
    try:
        current = await db.fetchrow(
            "SELECT order_num FROM chapters WHERE id = $1", chapter_id
        )
        if not current:
            return None

        if direction == "next":
            target_order = current["order_num"] + 1
        else:
            target_order = current["order_num"] - 1

        row = await db.fetchrow(
            """
            SELECT id, title, order_num, tier_required, estimated_minutes
            FROM chapters WHERE order_num = $1
            """,
            target_order,
        )
        return dict(row) if row else None
    except Exception as exc:
        logger.error("get_adjacent_chapter error: %s", exc)
        raise
