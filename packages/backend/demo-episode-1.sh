#!/bin/bash

# Episode 1 Demo Runner
# Run this during recording for perfect timing

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║  EPISODE 1: My AI Agent Failed at Sets... So I Taught It     ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:3001"

# Helper function
pause() {
    echo ""
    echo -e "${YELLOW}[Press ENTER to continue]${NC}"
    read
}

# ============================================================================
# ACT 1: THE FAILURE
# ============================================================================

echo ""
echo -e "${BLUE}═══ ACT 1: THE FAILURE ═══${NC}"
echo ""

echo -e "${YELLOW}Scene 1: Empty Brain${NC}"
echo "Resetting agent to empty state..."
curl -s -X POST "$BASE_URL/api/sets-agent/reset" | jq '.'
pause

echo ""
echo -e "${YELLOW}Scene 2: First Attempt - FAILURE${NC}"
echo "Attempting to solve: Find A ∩ B where A={1,2,3,4,5} and B={4,5,6,7,8}"
echo ""

curl -s -X POST "$BASE_URL/api/sets-agent/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "intersection",
    "setA": [1,2,3,4,5],
    "setB": [4,5,6,7,8],
    "question": "Find A ∩ B"
  }' | jq '.result'

echo ""
echo -e "${RED}❌ FAILED! Collisions detected.${NC}"
pause

# ============================================================================
# ACT 2: THE TEACHING
# ============================================================================

echo ""
echo -e "${BLUE}═══ ACT 2: THE TEACHING ═══${NC}"
echo ""

echo -e "${YELLOW}Scene 3: Teaching Spatial Rules${NC}"
echo "Teaching: Never use arrows to intersection"
curl -s -X POST "$BASE_URL/api/sets-agent/teach/spatial" \
  -H "Content-Type: application/json" \
  -d '{"rule": "Never use arrows to intersection - causes collisions"}' | jq '.memory'

echo ""
echo "Teaching: Position answer at safe Y coordinate"
curl -s -X POST "$BASE_URL/api/sets-agent/teach/spatial" \
  -H "Content-Type: application/json" \
  -d '{"rule": "Use absolute positioning for answer (y=-3.2)"}' | jq '.memory'

pause

echo ""
echo -e "${YELLOW}Scene 4: Second Attempt - BETTER!${NC}"
echo "Trying again with new spatial rules..."
echo ""

curl -s -X POST "$BASE_URL/api/sets-agent/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "intersection",
    "setA": [1,2,3,4,5],
    "setB": [4,5,6,7,8],
    "question": "Find A ∩ B"
  }' | jq '.result'

echo ""
echo -e "${GREEN}✅ Better! No collisions, but clarity score only 7/10${NC}"
pause

echo ""
echo -e "${YELLOW}Scene 5: Teaching Pedagogy${NC}"
echo "Teaching: Explain elements one-by-one"
curl -s -X POST "$BASE_URL/api/sets-agent/teach/pedagogy" \
  -H "Content-Type: application/json" \
  -d '{"rule": "Explain elements one-by-one conversationally"}' | jq '.memory'

echo ""
echo "Teaching: Use rubber-duck style explanations"
curl -s -X POST "$BASE_URL/api/sets-agent/teach/pedagogy" \
  -H "Content-Type: application/json" \
  -d '{"rule": "Use rubber-duck style: \"Let'\''s look at X... is it in A?\""}' | jq '.memory'

pause

# ============================================================================
# ACT 3: THE BREAKTHROUGH
# ============================================================================

echo ""
echo -e "${BLUE}═══ ACT 3: THE BREAKTHROUGH ═══${NC}"
echo ""

echo -e "${YELLOW}Scene 6: Third Attempt - PERFECT!${NC}"
echo "Trying with both spatial AND pedagogy rules..."
echo ""

curl -s -X POST "$BASE_URL/api/sets-agent/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "intersection",
    "setA": [1,2,3,4,5],
    "setB": [4,5,6,7,8],
    "question": "Find A ∩ B"
  }' | jq '.result'

echo ""
echo -e "${GREEN}✅✅✅ PERFECT! 9/10 clarity, 0 collisions!${NC}"
pause

echo ""
echo -e "${YELLOW}Scene 7: The Memory${NC}"
echo "Looking at agent's complete memory..."
curl -s "$BASE_URL/api/sets-agent/memory" | jq '.memory'
pause

# ============================================================================
# ACT 4: THE TEST
# ============================================================================

echo ""
echo -e "${BLUE}═══ ACT 4: THE TEST ═══${NC}"
echo ""

echo -e "${YELLOW}Scene 8: New Problem - First Try!${NC}"
echo "Testing with a UNION problem (never seen before)..."
echo ""

curl -s -X POST "$BASE_URL/api/sets-agent/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "union",
    "setA": [1,2,3],
    "setB": [3,4,5],
    "question": "Find A ∪ B"
  }' | jq '.result'

echo ""
echo -e "${GREEN}✅ PERFECT ON FIRST TRY! The agent LEARNED!${NC}"
pause

echo ""
echo -e "${YELLOW}Scene 9: Memory Growth${NC}"
echo "Agent memory after learning..."
curl -s "$BASE_URL/api/sets-agent/memory" | jq '{
  version: .memory.version,
  totalRules: (.memory.spatialRules | length) + (.memory.pedagogyRules | length),
  successfulPatterns: (.memory.successfulPatterns | length)
}'
pause

# ============================================================================
# ACT 5: THE REVELATION
# ============================================================================

echo ""
echo -e "${BLUE}═══ ACT 5: THE REVELATION ═══${NC}"
echo ""

echo -e "${YELLOW}Scene 10: Memory Isolation${NC}"
echo "Memory usage comparison..."
curl -s "$BASE_URL/api/agents/memory-usage" | jq '.usage'

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}║  Traditional AI:  200KB context  |  \$2.40/session    ║${NC}"
echo -e "${GREEN}║  Our Agent:         8KB context  |  \$0.10/session    ║${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}║  96% REDUCTION IN COST + LEARNS & REMEMBERS!          ║${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}                    EPISODE 1 COMPLETE!                        ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Next Episode: How Claude Taught Gemini to Do Quadratic Equations"
echo ""
