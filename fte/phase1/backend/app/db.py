import asyncpg
import logging
import os
import ssl
from typing import AsyncGenerator

logger = logging.getLogger(__name__)

_pool: asyncpg.Pool | None = None


async def get_pool() -> asyncpg.Pool:
    """Return the shared connection pool, creating it if needed."""
    global _pool
    if _pool is None:
        from app.core.config import settings
        database_url = settings.DATABASE_URL
        # asyncpg uses postgresql:// not postgresql+asyncpg://
        dsn = database_url.replace("postgresql+asyncpg://", "postgresql://")
        # Neon requires SSL
        ssl_ctx = ssl.create_default_context()
        try:
            _pool = await asyncpg.create_pool(dsn=dsn, min_size=2, max_size=10, ssl=ssl_ctx)
            logger.info("Database connection pool created.")
        except Exception as exc:
            logger.error("Failed to create database pool: %s", exc)
            raise
    return _pool


async def get_db() -> AsyncGenerator[asyncpg.Connection, None]:
    """FastAPI dependency: yields a single connection from the pool."""
    pool = await get_pool()
    try:
        async with pool.acquire() as conn:
            yield conn
    except Exception as exc:
        logger.error("Database connection error: %s", exc)
        raise


async def create_tables() -> None:
    """
    Run all migration SQL files in order on startup.
    Called from FastAPI lifespan/startup event.
    """
    import glob

    migrations_dir = os.path.join(os.path.dirname(__file__), "..", "migrations")
    sql_files = sorted(glob.glob(f"{migrations_dir}/*.sql"))

    pool = await get_pool()
    async with pool.acquire() as conn:
        for path in sql_files:
            try:
                with open(path, "r", encoding="utf-8") as f:
                    sql = f.read()
                await conn.execute(sql)
                logger.info("Migration applied: %s", path)
            except Exception as exc:
                logger.error("Migration failed (%s): %s", path, exc)
                raise


async def close_pool() -> None:
    """Close the connection pool on shutdown."""
    global _pool
    if _pool:
        try:
            await _pool.close()
            logger.info("Database pool closed.")
        except Exception as exc:
            logger.error("Error closing database pool: %s", exc)
        finally:
            _pool = None
