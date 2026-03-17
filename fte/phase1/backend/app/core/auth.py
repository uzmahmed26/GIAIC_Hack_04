"""
JWT authentication dependency for Phase 1.
Uses python-jose for token verification.
Clerk JWT replaces this in Phase 3.
"""
import logging
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

from app.core.config import settings

logger = logging.getLogger(__name__)
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
) -> str:
    """
    Verify JWT token and return user_id.
    Accepts Clerk RS256 tokens by extracting sub without full verification (dev mode).
    Falls back to 'guest' if no token provided.
    """
    if not credentials:
        return "guest"
    token = credentials.credentials
    try:
        # Decode without verification to extract sub (Clerk uses RS256)
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("sub", "guest")
        return user_id
    except JWTError:
        try:
            # Clerk JWT — extract sub without signature verification
            import base64, json as _json
            parts = token.split(".")
            if len(parts) == 3:
                padded = parts[1] + "=" * (4 - len(parts[1]) % 4)
                payload = _json.loads(base64.urlsafe_b64decode(padded))
                return payload.get("sub", "guest")
        except Exception:
            pass
        return "guest"
