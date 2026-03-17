from pydantic import BaseModel


class ProgressUpdate(BaseModel):
    completed: bool
    score: float | None = None


class ChapterProgress(BaseModel):
    chapter_id: str
    completed: bool
    score: float | None
    completed_at: str | None


class ProgressResponse(BaseModel):
    user_id: str
    chapters_completed: int
    total_chapters: int
    average_score: float
    streak_days: int
    last_active: str
    chapter_progress: list[ChapterProgress]


class StreakResponse(BaseModel):
    user_id: str
    streak_days: int
    last_active: str
    milestone_reached: str | None
