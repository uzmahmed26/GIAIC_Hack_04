"""
Search service — FEAT-03 (Grounded Q&A).
ZERO LLM — pgvector cosine similarity only.
Embedding model loaded once at module level (local, no API call).
"""
import logging
from app.models.search import SearchResult

logger = logging.getLogger(__name__)

_model = None


def _get_model():
    """Load sentence-transformers model once. No API call — local inference."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer("all-MiniLM-L6-v2")
        logger.info("Embedding model loaded: all-MiniLM-L6-v2")
    return _model


def _embed(text: str) -> list[float]:
    model = _get_model()
    return model.encode(text, normalize_embeddings=True).tolist()


async def search(db, query: str, chapter_filter: str | None, limit: int) -> list[SearchResult]:
    """
    Search course content using pgvector cosine similarity.
    Query text is embedded locally (no LLM API call).
    Pre-computed embeddings stored in chapters.embedding column.
    """
    try:
        embedding = _embed(query)

        if chapter_filter:
            rows = await db.fetch(
                """
                SELECT id AS chapter_id,
                       title AS chapter_title,
                       content AS chunk,
                       1 - (embedding <=> $1::vector) AS relevance_score
                FROM chapters
                WHERE id = $2 AND embedding IS NOT NULL
                ORDER BY embedding <=> $1::vector
                LIMIT $3
                """,
                embedding, chapter_filter, limit,
            )
        else:
            rows = await db.fetch(
                """
                SELECT id AS chapter_id,
                       title AS chapter_title,
                       content AS chunk,
                       1 - (embedding <=> $1::vector) AS relevance_score
                FROM chapters
                WHERE embedding IS NOT NULL
                ORDER BY embedding <=> $1::vector
                LIMIT $2
                """,
                embedding, limit,
            )
        return [SearchResult(**dict(r)) for r in rows]
    except Exception as exc:
        logger.error("search error: %s", exc)
        raise
