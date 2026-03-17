from pydantic import BaseModel


class AccessCheckResponse(BaseModel):
    user_id: str
    chapter_id: str
    allowed: bool
    reason: str
    tier: str
    upgrade_url: str | None = None
