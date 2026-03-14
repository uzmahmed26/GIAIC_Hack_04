from pydantic import BaseModel


class Question(BaseModel):
    id: str
    text: str
    type: str  # mcq | truefalse | fill
    options: list[str] | None = None


class QuizResponse(BaseModel):
    id: str
    chapter_id: str
    title: str
    questions: list[Question]
    total_questions: int


class QuizSubmission(BaseModel):
    answers: dict[str, str]


class QuestionResult(BaseModel):
    question_id: str
    correct: bool
    student_answer: str


class QuizResult(BaseModel):
    quiz_id: str
    score: float
    total: int
    correct_count: int
    results: list[QuestionResult]
