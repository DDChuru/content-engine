#!/bin/bash
# Content Generation Helper Script
# Usage: ./generate-content.sh <type> <project>

set -e

# Configuration
API_URL="${API_URL:-http://localhost:3001}"
OUTPUT_DIR="$HOME/Documents/projects/content-engine/presentation-studio/generated"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to generate User Manual
generate_user_manual() {
  local project=$1
  echo -e "${BLUE}🔍 Generating User Manual for: $project${NC}"

  response=$(curl -s -X POST "$API_URL/api/generate/user-manual" \
    -H "Content-Type: application/json" \
    -d "{
      \"project\": \"$project\"
    }")

  echo "$response" | jq .

  # Extract HTML URL and download
  html_url=$(echo "$response" | jq -r '.htmlUrl // empty')
  if [ -n "$html_url" ]; then
    filename="user-manual-$project-$(date +%Y%m%d-%H%M%S).html"
    echo -e "${GREEN}📥 Downloading to: $OUTPUT_DIR/$filename${NC}"
    curl -s "$html_url" -o "$OUTPUT_DIR/$filename"
    echo -e "${GREEN}✅ Done! Open with: xdg-open $OUTPUT_DIR/$filename${NC}"
  fi
}

# Function to generate SOP
generate_sop() {
  local task=$1
  echo -e "${BLUE}📋 Generating SOP for: $task${NC}"

  response=$(curl -s -X POST "$API_URL/api/generate/sop" \
    -H "Content-Type: application/json" \
    -d "{
      \"task\": \"$task\",
      \"category\": \"Operations\",
      \"features\": [\"Safety checks\", \"Quality control\", \"Documentation\"]
    }")

  echo "$response" | jq .

  html_url=$(echo "$response" | jq -r '.htmlUrl // empty')
  if [ -n "$html_url" ]; then
    filename="sop-$(echo $task | tr ' ' '-' | tr '[:upper:]' '[:lower:]')-$(date +%Y%m%d-%H%M%S).html"
    echo -e "${GREEN}📥 Downloading to: $OUTPUT_DIR/$filename${NC}"
    curl -s "$html_url" -o "$OUTPUT_DIR/$filename"
    echo -e "${GREEN}✅ Done! Open with: xdg-open $OUTPUT_DIR/$filename${NC}"
  fi
}

# Function to generate Lesson
generate_lesson() {
  local topic=$1
  echo -e "${BLUE}🎓 Generating Lesson for: $topic${NC}"

  response=$(curl -s -X POST "$API_URL/api/generate/lesson" \
    -H "Content-Type: application/json" \
    -d "{
      \"topic\": \"$topic\",
      \"level\": \"intermediate\",
      \"duration\": \"45 minutes\"
    }")

  echo "$response" | jq .

  html_url=$(echo "$response" | jq -r '.htmlUrl // empty')
  if [ -n "$html_url" ]; then
    filename="lesson-$(echo $topic | tr ' ' '-' | tr '[:upper:]' '[:lower:]')-$(date +%Y%m%d-%H%M%S).html"
    echo -e "${GREEN}📥 Downloading to: $OUTPUT_DIR/$filename${NC}"
    curl -s "$html_url" -o "$OUTPUT_DIR/$filename"
    echo -e "${GREEN}✅ Done! Open with: xdg-open $OUTPUT_DIR/$filename${NC}"
  fi
}

# Main
TYPE=$1
TARGET=$2

if [ -z "$TYPE" ] || [ -z "$TARGET" ]; then
  echo -e "${RED}Usage: $0 <type> <target>${NC}"
  echo ""
  echo "Types:"
  echo "  user-manual <project>   - Generate user manual from GitHub repo"
  echo "  sop <task>              - Generate Standard Operating Procedure"
  echo "  lesson <topic>          - Generate educational lesson"
  echo ""
  echo "Examples:"
  echo "  $0 user-manual iClean"
  echo "  $0 sop 'Temperature Monitoring'"
  echo "  $0 lesson 'Python Functions'"
  echo ""
  echo "Environment Variables:"
  echo "  API_URL - Backend API URL (default: http://localhost:3001)"
  exit 1
fi

case $TYPE in
  user-manual)
    generate_user_manual "$TARGET"
    ;;
  sop)
    generate_sop "$TARGET"
    ;;
  lesson)
    generate_lesson "$TARGET"
    ;;
  *)
    echo -e "${RED}Unknown type: $TYPE${NC}"
    exit 1
    ;;
esac
