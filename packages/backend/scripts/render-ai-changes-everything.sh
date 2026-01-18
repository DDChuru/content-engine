#!/bin/bash
# AI Changes Everything Video - Render Script
# Renders TikTok (6 x 60s vertical) and YouTube (10min horizontal) versions

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="/home/dachu/Documents/projects/content-engine"
OUTPUT_DIR="$PROJECT_DIR/output/ai-changes-everything"
AUDIO_DIR="$OUTPUT_DIR/audio"
PUBLIC_DIR="$BACKEND_DIR/src/remotion/public"

echo "============================================================"
echo "  AI CHANGES EVERYTHING - VIDEO RENDERING"
echo "============================================================"
echo ""
echo "Backend: $BACKEND_DIR"
echo "Output:  $OUTPUT_DIR"
echo ""

# Ensure directories exist
mkdir -p "$OUTPUT_DIR/tiktok"
mkdir -p "$OUTPUT_DIR/youtube"
mkdir -p "$PUBLIC_DIR/audio/ai-changes"

# Copy audio files to public directory for Remotion access
echo "=== Copying audio files to public directory ==="
cp -r "$AUDIO_DIR/tiktok"/* "$PUBLIC_DIR/audio/ai-changes/" 2>/dev/null || echo "No TikTok audio to copy"
cp -r "$AUDIO_DIR/youtube"/* "$PUBLIC_DIR/audio/ai-changes/" 2>/dev/null || echo "No YouTube audio to copy"
echo "Done."
echo ""

cd "$BACKEND_DIR"

# Parse arguments
RENDER_TIKTOK=true
RENDER_YOUTUBE=true
TIKTOK_INDEX=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --tiktok-only)
            RENDER_YOUTUBE=false
            shift
            ;;
        --youtube-only)
            RENDER_TIKTOK=false
            shift
            ;;
        --tiktok)
            TIKTOK_INDEX="$2"
            shift 2
            ;;
        *)
            shift
            ;;
    esac
done

# TikTok video data
declare -a TIKTOK_IDS=("tiktok_01_hook" "tiktok_02_old_world" "tiktok_03_new_world" "tiktok_04_timeline" "tiktok_05_proof" "tiktok_06_twist")
declare -a TIKTOK_TITLES=("The Framework Trap" "How We Used to Learn Code" "What AI Changed About Coding" "4 Years vs 4 Weeks" "I Built This Without Knowing Svelte" "The Plot Twist")
declare -a TIKTOK_HOOKS=("What if your framework knowledge is optional?" "Let me show you how developers USED to learn" "Here is what AI actually changed" "What took me 4 years now takes 4 weeks" "I built a production app in a framework I never used" "Here is the plot twist I promised")

# Render TikTok videos
if [ "$RENDER_TIKTOK" = true ]; then
    echo "============================================================"
    echo "  RENDERING TIKTOK VIDEOS (6 x 60s @ 1080x1920)"
    echo "============================================================"
    echo ""

    for i in "${!TIKTOK_IDS[@]}"; do
        # Skip if specific index requested and this isn't it
        if [ -n "$TIKTOK_INDEX" ] && [ "$TIKTOK_INDEX" != "$((i+1))" ]; then
            continue
        fi

        ID="${TIKTOK_IDS[$i]}"
        TITLE="${TIKTOK_TITLES[$i]}"
        HOOK="${TIKTOK_HOOKS[$i]}"
        OUTPUT_FILE="$OUTPUT_DIR/tiktok/${ID}.mp4"
        AUDIO_FILE="audio/ai-changes/${ID}.mp3"

        echo "[$((i+1))/6] Rendering: $TITLE"
        echo "    Output: $OUTPUT_FILE"
        echo "    Audio: $AUDIO_FILE"

        # Read the script from JSON file
        SCRIPT=$(jq -r ".videos[$i].script" "$OUTPUT_DIR/scripts/tiktok-scripts.json")

        npx remotion render src/remotion/Root.tsx AIChanges-TikTok "$OUTPUT_FILE" \
            --codec=h264 \
            --overwrite \
            --public-dir=src/remotion/public \
            --props="{\"id\":\"$ID\",\"title\":\"$TITLE\",\"script\":$(echo "$SCRIPT" | jq -Rs .),\"hook\":\"$HOOK\",\"audioSrc\":\"$AUDIO_FILE\",\"durationFrames\":1800}" \
            2>&1 | grep -E "(Rendered|Error|Progress)" || true

        if [ -f "$OUTPUT_FILE" ]; then
            SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
            echo "    ✅ Complete: $SIZE"
        else
            echo "    ❌ Failed to render"
        fi
        echo ""
    done

    echo "TikTok videos saved to: $OUTPUT_DIR/tiktok/"
    ls -lh "$OUTPUT_DIR/tiktok/"*.mp4 2>/dev/null || echo "No TikTok videos found"
    echo ""
fi

# Render YouTube video
if [ "$RENDER_YOUTUBE" = true ]; then
    echo "============================================================"
    echo "  RENDERING YOUTUBE VIDEO (~10min @ 1920x1080)"
    echo "============================================================"
    echo ""

    OUTPUT_FILE="$OUTPUT_DIR/youtube/ai-changes-everything-full.mp4"
    echo "Output: $OUTPUT_FILE"

    # Build scenes JSON from the script file
    SCENES_JSON=$(jq '[.scenes[] | {
        id: .id,
        title: .title,
        script: .script,
        audioSrc: ("audio/ai-changes/" + (.id | split("_")[0:3] | join("_")) + "_" + .id + ".mp3"),
        durationSeconds: .duration_seconds
    }]' "$OUTPUT_DIR/scripts/youtube-script.json")

    # Calculate total duration
    TOTAL_SECONDS=$(echo "$SCENES_JSON" | jq '[.[].durationSeconds] | add')
    TOTAL_FRAMES=$((TOTAL_SECONDS * 30))

    echo "Total duration: ${TOTAL_SECONDS}s (${TOTAL_FRAMES} frames)"
    echo ""

    # Due to complexity, we'll render a simpler version
    # that concatenates the YouTube audio files
    echo "Note: Full YouTube render requires scene-by-scene composition"
    echo "For now, generating a simple narration video..."

    # Concatenate all YouTube audio files
    CONCAT_LIST="$OUTPUT_DIR/audio/youtube_concat.txt"
    > "$CONCAT_LIST"
    for f in "$AUDIO_DIR/youtube"/*.mp3; do
        echo "file '$f'" >> "$CONCAT_LIST"
    done

    # Merge audio files
    MERGED_AUDIO="$OUTPUT_DIR/audio/youtube_merged.mp3"
    ffmpeg -y -f concat -safe 0 -i "$CONCAT_LIST" -c copy "$MERGED_AUDIO" 2>/dev/null

    echo "Merged audio: $MERGED_AUDIO"

    # Get duration of merged audio
    AUDIO_DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$MERGED_AUDIO" 2>/dev/null)
    AUDIO_FRAMES=$(echo "$AUDIO_DURATION * 30" | bc | cut -d. -f1)

    echo "Audio duration: ${AUDIO_DURATION}s (${AUDIO_FRAMES} frames)"

    # Copy merged audio to public dir
    cp "$MERGED_AUDIO" "$PUBLIC_DIR/audio/ai-changes/youtube_full.mp3"

    # For now, render a single-scene version
    # A full production would need dynamic scene rendering
    echo ""
    echo "Rendering with merged audio..."

    npx remotion render src/remotion/Root.tsx AIChanges-YouTube "$OUTPUT_FILE" \
        --codec=h264 \
        --overwrite \
        --public-dir=src/remotion/public \
        --frames=0-$((AUDIO_FRAMES - 1)) \
        2>&1 | grep -E "(Rendered|Error|Progress|frames)" || true

    if [ -f "$OUTPUT_FILE" ]; then
        SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
        DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTPUT_FILE" 2>/dev/null)
        echo ""
        echo "✅ YouTube video complete!"
        echo "   File: $OUTPUT_FILE"
        echo "   Size: $SIZE"
        echo "   Duration: ${DURATION}s"
    else
        echo "❌ Failed to render YouTube video"
    fi
    echo ""
fi

echo "============================================================"
echo "  RENDERING COMPLETE"
echo "============================================================"
echo ""
echo "Output directory: $OUTPUT_DIR"
echo ""
echo "TikTok videos:"
ls -lh "$OUTPUT_DIR/tiktok/"*.mp4 2>/dev/null || echo "  None"
echo ""
echo "YouTube video:"
ls -lh "$OUTPUT_DIR/youtube/"*.mp4 2>/dev/null || echo "  None"
echo ""
echo "============================================================"
echo "  NEXT STEPS"
echo "============================================================"
echo ""
echo "1. Review TikTok videos:"
echo "   mpv --loop $OUTPUT_DIR/tiktok/tiktok_01_hook.mp4"
echo ""
echo "2. Review YouTube video:"
echo "   mpv $OUTPUT_DIR/youtube/ai-changes-everything-full.mp4"
echo ""
echo "3. Upload to platforms:"
echo "   - TikTok: Upload 6 vertical videos"
echo "   - YouTube: Upload full horizontal video"
echo ""
echo "4. Suggested hashtags:"
echo "   #AIcoding #WebDev #Angular #React #SvelteKit #TechTok #DevTok"
echo ""
