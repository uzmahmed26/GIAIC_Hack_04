"""
Embedding service — Phase 1.
Uses sentence-transformers (local model, zero API calls).
Model is loaded once at startup, not per request.
CONSTITUTIONAL NOTE: This is NOT an LLM call. sentence-transformers
runs locally and requires no API key or external service.
"""
import logging
from functools import lru_cache

logger = logging.getLogger(__name__)

_model = None


def load_model():
    """Load the embedding model once at startup."""
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer("all-MiniLM-L6-v2")
            logger.info("Embedding model loaded: all-MiniLM-L6-v2")
        except Exception as exc:
            logger.error("Failed to load embedding model: %s", exc)
            raise
    return _model


def get_query_embedding(text: str) -> list[float]:
    """
    Convert query text to a 384-dimension embedding vector.
    Runs locally — no external API call.
    """
    model = load_model()
    try:
        embedding = model.encode(text, normalize_embeddings=True)
        return embedding.tolist()
    except Exception as exc:
        logger.error("Embedding generation failed: %s", exc)
        raise
