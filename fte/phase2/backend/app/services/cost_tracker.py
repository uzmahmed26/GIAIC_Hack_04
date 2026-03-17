"""
Cost Tracker Service — Phase 2
Logs every LLM call with token usage and cost estimate.
Constitutional Rule: Every LLM call MUST be logged here.
"""
import asyncpg
from datetime import datetime
from app.core.config import settings

COST_PER_INPUT_TOKEN = 0.000003
COST_PER_OUTPUT_TOKEN = 0.000015


async def log_llm_cost(
    user_id: str,
    feature: str,
    input_tokens: int,
    output_tokens: int,
    model: str = "claude-sonnet-4-20250514"
) -> dict:
    """
    Log LLM API call cost to database.
    Called after EVERY LLM API call in Phase 2.
    Never skip this — constitutional requirement.
    """
    cost_usd = (
        input_tokens * COST_PER_INPUT_TOKEN +
        output_tokens * COST_PER_OUTPUT_TOKEN
    )
    try:
        conn = await asyncpg.connect(settings.DATABASE_URL)
        await conn.execute(
            """
            INSERT INTO cost_logs
              (user_id, feature, model, input_tokens, output_tokens, cost_usd, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            """,
            user_id, feature, model, input_tokens, output_tokens,
            cost_usd, datetime.utcnow()
        )
        await conn.close()
    except Exception as e:
        print(f"Cost log warning: {e}")

    return {
        "user_id": user_id,
        "feature": feature,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "cost_usd": round(cost_usd, 6),
        "model": model,
    }
