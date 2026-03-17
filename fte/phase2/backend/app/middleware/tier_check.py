"""
Tier Check Middleware — Phase 2
Enforces premium gating before any LLM call.
Constitutional Rule: Free users get 403 BEFORE any LLM call is made.
"""
from fastapi import HTTPException, Header
from jose import jwt

TIER_HIERARCHY = {"free": 1, "premium": 2, "pro": 3, "team": 4}


def require_tier(allowed_tiers: list[str]):
    """
    FastAPI dependency that enforces tier gating.
    MUST be called before any LLM API call.
    Usage: user_id = Depends(require_tier(["pro", "team"]))
    Returns user_id if tier check passes.
    Raises 403 if user tier not in allowed_tiers.
    """
    async def check(authorization: str = Header(...)) -> str:
        try:
            token = authorization.replace("Bearer ", "")
            payload = jwt.decode(token, options={"verify_signature": False})
            user_id = payload.get("sub", "demo_user")
            tier = payload.get("tier", "free")
        except Exception:
            user_id = "demo_user"
            tier = "free"

        if TIER_HIERARCHY.get(tier, 0) < min(
            TIER_HIERARCHY.get(t, 0) for t in allowed_tiers
        ):
            raise HTTPException(
                status_code=403,
                detail={
                    "error": "premium_required",
                    "message": "This feature requires Pro or Team subscription.",
                    "current_tier": tier,
                    "required_tiers": allowed_tiers,
                    "upgrade_url": "https://coursecompanion.app/premium",
                    "pricing": {
                        "pro": "$19.99/month — Adaptive Path + LLM Assessment",
                        "team": "$49.99/month — Pro + Analytics + Multiple seats"
                    }
                }
            )
        return user_id
    return check
