"""
LLM Graded Assessment Router — Phase 2 Premium Feature
Uses Claude Sonnet to evaluate free-form written answers.

Constitutional Rules:
- Tier check MUST happen before any Anthropic API call
- Cost MUST be logged after every API call
- Only Pro and Team tier users allowed
"""
import anthropic
import json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.middleware.tier_check import require_tier
from app.services.cost_tracker import log_llm_cost
from app.core.config import settings

router = APIRouter()
client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

SYSTEM_PROMPT = """You are an expert AI instructor evaluating student answers about AI Agent Development.
Evaluate on: conceptual accuracy (0-40), completeness (0-30), practical understanding (0-30).
Respond ONLY in this exact JSON format with no other text:
{
  "score": 85,
  "grade": "B+",
  "conceptual_accuracy": 35,
  "completeness": 25,
  "practical_understanding": 25,
  "strengths": ["What they got right"],
  "improvements": ["What to work on"],
  "model_answer_hint": "Key points they should know"
}"""


class AssessmentRequest(BaseModel):
    question: str
    student_answer: str
    reference_content: str = ""
    chapter_id: str = ""


class AssessmentResponse(BaseModel):
    score: float
    grade: str
    conceptual_accuracy: int
    completeness: int
    practical_understanding: int
    strengths: list[str]
    improvements: list[str]
    model_answer_hint: str
    cost_info: dict


@router.post("/", response_model=AssessmentResponse)
async def assess_answer(
    request: AssessmentRequest,
    user_id: str = Depends(require_tier(["pro", "team"]))
):
    """
    Grade a free-form written answer using Claude Sonnet.
    REQUIRES: Pro or Team tier subscription.
    COST: approximately $0.014 per request.
    Tier check happens BEFORE any API call — constitutional requirement.
    """
    user_prompt = f"""Question: {request.question}

Student Answer: {request.student_answer}

Reference Material: {request.reference_content}

Evaluate and grade this student answer."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=800,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )

    cost_info = await log_llm_cost(
        user_id=user_id,
        feature="llm_assessment",
        input_tokens=message.usage.input_tokens,
        output_tokens=message.usage.output_tokens,
        model="claude-sonnet-4-20250514",
    )

    try:
        result = json.loads(message.content[0].text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")

    return AssessmentResponse(**result, cost_info=cost_info)
