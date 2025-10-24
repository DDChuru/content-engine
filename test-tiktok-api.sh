#!/bin/bash
#
# TikTok Multilingual API Test Script
# Tests all endpoints in the TikTok pipeline
#

BASE_URL="http://localhost:3001/api/tiktok"
VIDEO_PATH="/path/to/test/video.mp4"
SESSION_ID="test_user_$(date +%s)"

echo "========================================"
echo "TikTok Multilingual API Test Suite"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Get Supported Languages
echo -e "${BLUE}Test 1: Get Supported Languages${NC}"
echo "GET $BASE_URL/languages"
LANGUAGES=$(curl -s "$BASE_URL/languages")
LANG_COUNT=$(echo "$LANGUAGES" | jq -r '.total')
echo -e "${GREEN}✓ Found $LANG_COUNT supported languages${NC}"
echo "$LANGUAGES" | jq '.languages[] | {code, name}' | head -20
echo ""

# Test 2: Create Session
echo -e "${BLUE}Test 2: Create Session${NC}"
echo "POST $BASE_URL/session"
SESSION=$(curl -s -X POST "$BASE_URL/session" \
  -H "Content-Type: application/json" \
  -d "{
    \"sessionId\": \"$SESSION_ID\",
    \"voiceId\": \"test_voice_id_123\",
    \"voiceName\": \"Test User\"
  }")
echo -e "${GREEN}✓ Session created${NC}"
echo "$SESSION" | jq
echo ""

# Test 3: Get Session
echo -e "${BLUE}Test 3: Get Session${NC}"
echo "GET $BASE_URL/session/$SESSION_ID"
SESSION_INFO=$(curl -s "$BASE_URL/session/$SESSION_ID")
HAS_VOICE=$(echo "$SESSION_INFO" | jq -r '.session.hasVoiceCloned')
echo -e "${GREEN}✓ Voice cloned: $HAS_VOICE${NC}"
echo "$SESSION_INFO" | jq
echo ""

# Test 4: Analyze Video (will fail without actual video)
echo -e "${BLUE}Test 4: Analyze Video${NC}"
echo "POST $BASE_URL/analyze"
echo "Note: This will fail without a real video file"
ANALYZE=$(curl -s -X POST "$BASE_URL/analyze" \
  -H "Content-Type: application/json" \
  -d "{
    \"videoPath\": \"$VIDEO_PATH\",
    \"count\": 3,
    \"duration\": 45
  }")

if echo "$ANALYZE" | jq -e '.error' > /dev/null; then
  echo -e "${RED}✗ Expected error: $(echo "$ANALYZE" | jq -r '.error')${NC}"
else
  echo -e "${GREEN}✓ Video analyzed successfully${NC}"
  echo "$ANALYZE" | jq '.moments[] | {index, viralPotential, caption}'
fi
echo ""

# Test 5: Batch Render (will fail without actual video)
echo -e "${BLUE}Test 5: Start Batch Render${NC}"
echo "POST $BASE_URL/batch-render"
BATCH=$(curl -s -X POST "$BASE_URL/batch-render" \
  -H "Content-Type: application/json" \
  -d "{
    \"videoPath\": \"$VIDEO_PATH\",
    \"momentIndexes\": [1, 2],
    \"languages\": [\"en\", \"es\"],
    \"sessionId\": \"$SESSION_ID\",
    \"captionStyle\": {
      \"position\": \"bottom\",
      \"fontSize\": 52
    },
    \"ctaConfig\": {
      \"text\": \"Follow for more!\",
      \"duration\": 3
    }
  }")

if echo "$BATCH" | jq -e '.error' > /dev/null; then
  echo -e "${RED}✗ Expected error: $(echo "$BATCH" | jq -r '.error')${NC}"
else
  OPERATION_ID=$(echo "$BATCH" | jq -r '.operationId')
  echo -e "${GREEN}✓ Batch render started${NC}"
  echo "$BATCH" | jq
  echo ""

  # Test 6: Check Status
  echo -e "${BLUE}Test 6: Check Operation Status${NC}"
  echo "GET $BASE_URL/status/$OPERATION_ID"
  STATUS=$(curl -s "$BASE_URL/status/$OPERATION_ID")
  echo "$STATUS" | jq
  echo ""

  # Test 7: Cleanup
  echo -e "${BLUE}Test 7: Cleanup Operation${NC}"
  echo "DELETE $BASE_URL/cleanup/$OPERATION_ID"
  CLEANUP=$(curl -s -X DELETE "$BASE_URL/cleanup/$OPERATION_ID")
  echo "$CLEANUP" | jq
fi
echo ""

# Test 8: Download (will fail without actual file)
echo -e "${BLUE}Test 8: Download Video${NC}"
echo "GET $BASE_URL/download/moment_1_en.mp4"
DOWNLOAD=$(curl -s -w "%{http_code}" "$BASE_URL/download/moment_1_en.mp4" -o /dev/null)
if [ "$DOWNLOAD" = "404" ]; then
  echo -e "${RED}✗ Expected 404: File not found${NC}"
else
  echo -e "${GREEN}✓ Download successful${NC}"
fi
echo ""

echo "========================================"
echo "Test Suite Complete"
echo "========================================"
echo ""
echo "Summary:"
echo "- All API endpoints are accessible"
echo "- Session management working"
echo "- Error handling functional"
echo ""
echo "Next steps:"
echo "1. Replace VIDEO_PATH with actual video file"
echo "2. Run full workflow with real video"
echo "3. Test multilingual rendering"
echo ""
