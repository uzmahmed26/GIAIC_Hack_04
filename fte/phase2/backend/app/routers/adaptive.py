"""
Adaptive Learning Path Router — Phase 2 Premium Feature
Uses Claude Sonnet to generate personalized learning path.

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

SYSTEM_PROMPT = """You are an AI learning path optimizer for an AI Agent Development course with 10 chapters.
Given student progress data, generate a personalized recommended learning sequence.
Respond ONLY in this exact JSON format with no other text:
{
  "recommended_sequence": ["ch-001", "ch-002"],
  "reasoning": "Brief explanation of why this sequence suits the student",
  "focus_areas": ["concept1", "concept2"],
  "estimated_completion_days": 14,
  "skip_suggestions": []
}"""


class AdaptivePathRequest(BaseModel):
    completed_chapters: list[str] = []
    quiz_scores: dict[str, float] = {}
    struggling_topics: list[str] = []
    learning_goal: str = "Complete the full curriculum"
    study_days_count: int = 0


class AdaptivePathResponse(BaseModel):
    recommended_sequence: list[str]
    reasoning: str
    focus_areas: list[str]
    estimated_completion_days: int
    skip_suggestions: list[str]
    cost_info: dict


@router.post("/", response_model=AdaptivePathResponse)
async def get_adaptive_path(
    request: AdaptivePathRequest,
    user_id: str = Depends(require_tier(["pro", "team"]))
):
    """
    Generate personalized learning path using Claude Sonnet.
    REQUIRES: Pro or Team tier subscription.
    COST: approximately $0.018 per request.
    Tier check happens BEFORE any API call — constitutional requirement.
    """
    user_prompt = f"""Student Progress:
- Completed chapters: {request.completed_chapters}
- Quiz scores: {request.quiz_scores}
- Struggling topics: {request.struggling_topics}
- Study days: {request.study_days_count}
- Learning goal: {request.learning_goal}

Generate a personalized learning path for this student."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )

    cost_info = await log_llm_cost(
        user_id=user_id,
        feature="adaptive_path",
        input_tokens=message.usage.input_tokens,
        output_tokens=message.usage.output_tokens,
        model="claude-sonnet-4-20250514",
    )

    try:
        result = json.loads(message.content[0].text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")

    return AdaptivePathResponse(**result, cost_info=cost_info)
