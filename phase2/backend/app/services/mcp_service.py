"""
MCP Service — Phase 2
Provides helper functions to interact with MCP servers.
MCP servers must be running before calling these functions.
See mcp-config/README.md for startup instructions.

Available MCP servers (Phase 2):
- filesystem: read/write content files
- fetch: retrieve content from Cloudflare R2 URLs
"""
import httpx

# MCP server base URLs (started via mcp-config/start-mcp.ps1)
FILESYSTEM_MCP_URL = "http://localhost:3001"
FETCH_MCP_URL = "http://localhost:3002"


async def read_chapter_via_mcp(chapter_id: str) -> str:
    """
    Read a chapter markdown file using the filesystem MCP server.
    Falls back to direct file read if MCP server is unavailable.
    """
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(
                f"{FILESYSTEM_MCP_URL}/tools/read_file",
                json={"path": f"content/chapters/{chapter_id}.md"},
            )
            response.raise_for_status()
            return response.json().get("content", "")
    except Exception as e:
        # Fallback: direct file read
        try:
            with open(f"content/chapters/{chapter_id}.md", encoding="utf-8") as f:
                return f.read()
        except FileNotFoundError:
            raise ValueError(f"Chapter {chapter_id} not found via MCP or filesystem") from e


async def fetch_r2_content(r2_url: str) -> str:
    """
    Fetch content from a Cloudflare R2 URL using the fetch MCP server.
    Falls back to direct httpx GET if MCP server is unavailable.
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{FETCH_MCP_URL}/tools/fetch",
                json={"url": r2_url},
            )
            response.raise_for_status()
            return response.json().get("content", "")
    except Exception:
        # Fallback: direct HTTP GET
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(r2_url)
            response.raise_for_status()
            return response.text


async def list_content_files(directory: str = "content/chapters") -> list[str]:
    """
    List files in a content directory using the filesystem MCP server.
    """
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(
                f"{FILESYSTEM_MCP_URL}/tools/list_directory",
                json={"path": directory},
            )
            response.raise_for_status()
            return response.json().get("entries", [])
    except Exception:
        # Fallback: direct directory listing
        import os
        try:
            return os.listdir(directory)
        except FileNotFoundError:
            return []
