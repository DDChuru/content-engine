#!/bin/bash

# Content Engine Studio - Start Script
# Usage: ./start.sh [project_path]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_PATH="${1:-$(pwd)}"

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║   🎬 CONTENT ENGINE STUDIO                                 ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if node_modules exist
if [ ! -d "$SCRIPT_DIR/server/node_modules" ] || [ ! -d "$SCRIPT_DIR/client/node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    cd "$SCRIPT_DIR"
    npm run install:all
fi

# Set environment
export PROJECT_PATH="$PROJECT_PATH"
export PORT="${PORT:-3300}"

echo -e "${GREEN}Starting studio for project: ${CYAN}$PROJECT_PATH${NC}"
echo ""

# Start the studio
cd "$SCRIPT_DIR"
npm run dev

# The URL will be printed by the servers
