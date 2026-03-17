"""
Quiz service — FEAT-04 (Rule-Based Quizzes).
ZERO LLM — exact string comparison grading only.
Answer keys fetched server-side and NEVER returned to client.
"""
import json
import logging
from app.models.quiz import QuizSubmission

logger = logging.getLogger(__name__)


async def get_quiz_questions(db, quiz_id: str) -> dict | None:
    """
    Return quiz data WITHOUT answer key.
    quiz_answer_keys table is never touched in this function.
    """
    try:
        row = await db.fetchrow(
            "SELECT id, chapter_id, title, questions FROM quizzes WHERE id = $1",
            quiz_id,
        )
        if not row:
            return None
        data = dict(row)
        questions = data["questions"]
        if isinstance(questions, str):
            questions = json.loads(questions)
        data["questions"] = questions
        data["total_questions"] = len(questions)
        return data
    except Exception as exc:
        logger.error("get_quiz_questions error: %s", exc)
        raise


async def grade_submission(db, quiz_id: str, submission: QuizSubmission) -> dict:
    """
    Grade quiz answers using exact string match (case-insensitive).
    Correct answers are NEVER included in the returned dict.
    """
    try:
        key_row = await db.fetchrow(
            "SELECT answers FROM quiz_answer_keys WHERE quiz_id = $1", quiz_id
        )
    except Exception as exc:
        logger.error("grade_submission fetch key error: %s", exc)
        raise

    if not key_row:
        raise ValueError("Quiz not found")

    answer_key: dict = key_row["answers"]
    if isinstance(answer_key, str):
        answer_key = json.loads(answer_key)

    results = []
    correct_count = 0

    for question_id, correct_answer in answer_key.items():
        student_answer = submission.answers.get(question_id, "")
        is_correct = student_answer.strip().lower() == correct_answer.strip().lower()
        if is_correct:
            correct_count += 1
        results.append({
            "question_id": question_id,
            "correct": is_correct,
            "student_answer": student_answer,
            "correct_answer": correct_answer if not is_correct else None,
        })

    total = len(answer_key)
    score = round((correct_count / total) * 100, 2) if total > 0 else 0.0

    return {
        "quiz_id": quiz_id,
        "score": score,
        "total": total,
        "correct_count": correct_count,
        "results": results,
    }
