#!/bin/bash
# TikTok Video Renderer - WebSlides Edition
# Renders 6 TikTok videos with Gemini-generated images and WebSlides animations

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="/home/dachu/Documents/projects/content-engine/output/ai-changes-everything/tiktok-v2"

echo "============================================================"
echo "  TIKTOK VIDEO RENDERER - WebSlides Edition"
echo "============================================================"
echo ""
echo "Backend: $BACKEND_DIR"
echo "Output:  $OUTPUT_DIR"
echo ""

mkdir -p "$OUTPUT_DIR"

cd "$BACKEND_DIR"

# TikTok composition IDs
declare -a TIKTOK_IDS=("AIChanges-TikTok-01" "AIChanges-TikTok-02" "AIChanges-TikTok-03" "AIChanges-TikTok-04" "AIChanges-TikTok-05" "AIChanges-TikTok-06")
declare -a TIKTOK_NAMES=("tiktok_01_hook" "tiktok_02_old_world" "tiktok_03_new_world" "tiktok_04_timeline" "tiktok_05_proof" "tiktok_06_twist")
declare -a TIKTOK_TITLES=("The Framework Trap" "How We Used to Learn" "What AI Changed" "4 Years vs 4 Weeks" "The SvelteKit Project" "The Plot Twist")

for i in "${!TIKTOK_IDS[@]}"; do
    COMP_ID="${TIKTOK_IDS[$i]}"
    FILE_NAME="${TIKTOK_NAMES[$i]}"
    TITLE="${TIKTOK_TITLES[$i]}"
    OUTPUT_FILE="$OUTPUT_DIR/${FILE_NAME}.mp4"

    echo "[$((i+1))/6] Rendering: $TITLE"
    echo "    Composition: $COMP_ID"
    echo "    Output: $OUTPUT_FILE"

    npx remotion render src/remotion/Root.tsx "$COMP_ID" "$OUTPUT_FILE" \
        --codec=h264 \
        --overwrite \
        --public-dir=src/remotion/public \
        2>&1 | grep -E "(Rendered|Error|frames|Bundling)" || true

    if [ -f "$OUTPUT_FILE" ]; then
        SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
        DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTPUT_FILE" 2>/dev/null | cut -d. -f1)
        echo "    ✅ Complete: $SIZE (${DURATION}s)"
    else
        echo "    ❌ Failed to render"
    fi
    echo ""
done

echo "============================================================"
echo "  RENDERING COMPLETE"
echo "============================================================"
echo ""
echo "Output files:"
ls -lh "$OUTPUT_DIR"/*.mp4 2>/dev/null || echo "No files generated"
echo ""
echo "Preview:"
echo "  mpv --loop $OUTPUT_DIR/tiktok_01_hook.mp4"
echo ""
