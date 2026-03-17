# MCP Server Startup Script for Windows PowerShell
# Course Companion FTE — Phase 2 and 3 only
# Run: powershell -ExecutionPolicy Bypass -File mcp-config/start-mcp.ps1

Write-Host "Starting MCP servers for Course Companion FTE..." -ForegroundColor Cyan

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is required. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Start filesystem MCP server
Write-Host "Starting filesystem MCP server..." -ForegroundColor Yellow
$filesystemJob = Start-Job -ScriptBlock {
    npx -y @modelcontextprotocol/server-filesystem ./content ./SKILLS
}
Write-Host "filesystem MCP started (Job ID: $($filesystemJob.Id))" -ForegroundColor Green

# Start fetch MCP server
Write-Host "Starting fetch MCP server..." -ForegroundColor Yellow
$fetchJob = Start-Job -ScriptBlock {
    npx -y @modelcontextprotocol/server-fetch
}
Write-Host "fetch MCP started (Job ID: $($fetchJob.Id))" -ForegroundColor Green

Write-Host ""
Write-Host "MCP servers running!" -ForegroundColor Cyan
Write-Host "  filesystem Job: $($filesystemJob.Id)"
Write-Host "  fetch Job: $($fetchJob.Id)"
Write-Host ""
Write-Host "NOTE: postgres MCP starts only in Phase 3" -ForegroundColor Yellow
Write-Host "NOTE: Do NOT run MCP servers for Phase 1" -ForegroundColor Red
