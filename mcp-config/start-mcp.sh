#!/bin/bash
# MCP Server Startup Script
# Course Companion FTE — Phase 2 and 3 only
# Run this before starting Phase 2 or Phase 3 backend

echo "Starting MCP servers for Course Companion FTE..."

# Check Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is required for MCP servers"
    echo "Install from: https://nodejs.org"
    exit 1
fi

# Start filesystem MCP server
echo "Starting filesystem MCP server..."
npx -y @modelcontextprotocol/server-filesystem ./content ./SKILLS &
FILESYSTEM_PID=$!
echo "filesystem MCP started (PID: $FILESYSTEM_PID)"

# Start fetch MCP server
echo "Starting fetch MCP server..."
npx -y @modelcontextprotocol/server-fetch &
FETCH_PID=$!
echo "fetch MCP started (PID: $FETCH_PID)"

echo ""
echo "MCP servers running:"
echo "  filesystem PID: $FILESYSTEM_PID"
echo "  fetch PID: $FETCH_PID"
echo ""
echo "NOTE: postgres MCP starts only in Phase 3"
echo "NOTE: Do NOT run MCP servers for Phase 1"
