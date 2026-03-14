from pydantic import BaseModel


class SearchResult(BaseModel):
    chapter_id: str
    chapter_title: str
    chunk: str
    relevance_score: float


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult]
    total: int
