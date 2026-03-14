from pydantic import BaseModel


class Chapter(BaseModel):
    id: str
    title: str
    content: str
    content_url: str
    order_num: int
    prerequisites: list[str] = []
    estimated_minutes: int = 15
    tier_required: str = "free"


class ChapterListItem(BaseModel):
    id: str
    title: str
    order_num: int
    tier_required: str
    estimated_minutes: int


class ChapterListResponse(BaseModel):
    chapters: list[ChapterListItem]
    total: int
