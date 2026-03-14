"""
Access service — FEAT-06 (Freemium Gate).
ZERO LLM — pure rule-based tier checking.
"""
import logging

logger = logging.getLogger(__name__)

TIER_HIERARCHY = {"free": 1, "premium": 2, "pro": 3, "team": 4}

TIER_CHAPTER_MAP = {
    "free": list(range(1, 4)),       # chapters 1-3
    "premium": list(range(1, 11)),   # chapters 1-10
    "pro": list(range(1, 11)),       # chapters 1-10
    "team": list(range(1, 11)),      # chapters 1-10
}

UPGRADE_URL = "https://coursecompanion.app/premium"


def _chapter_order(chapter_id: str) -> int:
    """Extract numeric order from chapter id like 'ch-004' → 4."""
    try:
        return int(chapter_id.split("-")[-1])
    except (ValueError, IndexError):
        return 999


async def get_user_tier(db, user_id: str) -> str:
    """Return the user's subscription tier. Defaults to 'free' if not found."""
    try:
        row = await db.fetchrow(
            "SELECT tier FROM user_tiers WHERE user_id = $1", user_id
        )
        return row["tier"] if row else "free"
    except Exception as exc:
        logger.error("get_user_tier error: %s", exc)
        raise


async def check_chapter_access(db, user_id: str, chapter_id: str) -> dict:
    """
    Check if user tier allows access to the requested chapter.
    Returns allowed, reason, tier, and upgrade_url.
    """
    try:
        tier = await get_user_tier(db, user_id)

        chapter_row = await db.fetchrow(
            "SELECT id, tier_required FROM chapters WHERE id = $1", chapter_id
        )
        if not chapter_row:
            return {
                "user_id": user_id,
                "chapter_id": chapter_id,
                "allowed": False,
                "reason": "Chapter not found",
                "tier": tier,
                "upgrade_url": None,
            }

        order = _chapter_order(chapter_id)
        allowed_orders = TIER_CHAPTER_MAP.get(tier, [])

        if order in allowed_orders:
            return {
                "user_id": user_id,
                "chapter_id": chapter_id,
                "allowed": True,
                "reason": f"Access granted for {tier} tier.",
                "tier": tier,
                "upgrade_url": None,
            }

        required_tier = chapter_row["tier_required"]
        return {
            "user_id": user_id,
            "chapter_id": chapter_id,
            "allowed": False,
            "reason": f"This chapter requires a {required_tier} subscription.",
            "tier": tier,
            "upgrade_url": UPGRADE_URL,
        }
    except Exception as exc:
        logger.error("check_chapter_access error: %s", exc)
        raise
