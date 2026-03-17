# Seed chapters table with actual markdown content from content/chapters/
# Run from project root: python scripts/seed_chapters.py
import asyncio
import os
import re
from pathlib import Path
from dotenv import load_dotenv

# Load .env from phase1/backend
load_dotenv(Path(__file__).parent.parent / "phase1" / "backend" / ".env")

import asyncpg
import ssl

CHAPTERS = [
    {"id": "ch-001", "order_num": 1, "tier_required": "free",    "estimated_minutes": 15},
    {"id": "ch-002", "order_num": 2, "tier_required": "free",    "estimated_minutes": 20},
    {"id": "ch-003", "order_num": 3, "tier_required": "free",    "estimated_minutes": 20},
    {"id": "ch-004", "order_num": 4, "tier_required": "premium", "estimated_minutes": 25},
    {"id": "ch-005", "order_num": 5, "tier_required": "premium", "estimated_minutes": 25},
    {"id": "ch-006", "order_num": 6, "tier_required": "premium", "estimated_minutes": 30},
    {"id": "ch-007", "order_num": 7, "tier_required": "premium", "estimated_minutes": 30},
    {"id": "ch-008", "order_num": 8, "tier_required": "premium", "estimated_minutes": 25},
    {"id": "ch-009", "order_num": 9, "tier_required": "premium", "estimated_minutes": 20},
    {"id": "ch-010", "order_num": 10, "tier_required": "premium", "estimated_minutes": 30},
]

CONTENT_DIR = Path(__file__).parent.parent / "content" / "chapters"


def parse_markdown(filepath: Path) -> dict:
    """Extract title and body content from markdown frontmatter."""
    text = filepath.read_text(encoding="utf-8")
    # Remove frontmatter
    if text.startswith("---"):
        parts = text.split("---", 2)
        body = parts[2].strip() if len(parts) >= 3 else text
        # Extract title from frontmatter
        title_match = re.search(r"^title:\s*(.+)$", parts[1], re.MULTILINE)
        title = title_match.group(1).strip() if title_match else filepath.stem
    else:
        body = text
        title_match = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
        title = title_match.group(1).strip() if title_match else filepath.stem
    return {"title": title, "content": body}


async def seed():
    db_url = os.environ.get("DATABASE_URL", "")
    dsn = db_url.replace("postgresql+asyncpg://", "postgresql://")
    ssl_ctx = ssl.create_default_context()

    conn = await asyncpg.connect(dsn=dsn, ssl=ssl_ctx)
    print("Connected to database.")

    for ch in CHAPTERS:
        md_file = CONTENT_DIR / f"{ch['id']}.md"
        if not md_file.exists():
            print(f"  SKIP {ch['id']} — file not found")
            continue

        parsed = parse_markdown(md_file)
        await conn.execute(
            """
            INSERT INTO chapters (id, title, content, order_num, tier_required, estimated_minutes, prerequisites)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                content = EXCLUDED.content,
                tier_required = EXCLUDED.tier_required,
                estimated_minutes = EXCLUDED.estimated_minutes
            """,
            ch["id"],
            parsed["title"],
            parsed["content"],
            ch["order_num"],
            ch["tier_required"],
            ch["estimated_minutes"],
            "[]",
        )
        print(f"  OK  {ch['id']} — {parsed['title']}")

    await conn.close()
    print("\nDone! All chapters seeded.")


if __name__ == "__main__":
    asyncio.run(seed())
