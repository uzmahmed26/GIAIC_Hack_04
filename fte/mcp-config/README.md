# MCP Server Configuration
# Course Companion FTE

## What are MCP Servers?

MCP (Model Context Protocol) servers give the AI agent direct access
to tools and services. In this project MCP servers are used in
Phase 2 and Phase 3 only. Phase 1 uses zero MCP.

## Available Servers

### 1. filesystem
- Purpose: Read course content and skill files
- Allowed in: Phase 2 and Phase 3
- Folders it can access: ./content and ./SKILLS
- Used for: Reading chapter markdown, quiz JSON, skill files

### 2. fetch
- Purpose: Retrieve content from Cloudflare R2 URLs
- Allowed in: Phase 2 and Phase 3
- Used for: Fetching media assets, chapter updates from R2 bucket

### 3. postgres
- Purpose: Direct database queries for admin features
- Allowed in: Phase 3 ONLY
- Used for: Analytics, admin dashboard, cost tracking reports
- Requires: DATABASE_URL in .env file

## How to Start MCP Servers

### Linux / Mac
```bash
chmod +x mcp-config/start-mcp.sh
./mcp-config/start-mcp.sh
```

### Windows (PowerShell)
```powershell
powershell -ExecutionPolicy Bypass -File mcp-config/start-mcp.ps1
```

## Phase Rules

| Phase | MCP Servers Allowed |
|-------|---------------------|
| Phase 1 | NONE — zero MCP allowed |
| Phase 2 | filesystem + fetch only |
| Phase 3 | filesystem + fetch + postgres |

## Configuration

All server definitions are in `mcp-config/servers.json`.
The postgres server requires `DATABASE_URL` set in your `.env` file.
Never hardcode the database URL.
