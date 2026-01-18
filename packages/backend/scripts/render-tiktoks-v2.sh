#!/bin/bash
# TikTok Video Generator v2
# Creates 9:16 vertical videos with gradient background + audio

set -e

PROJECT_DIR="/home/dachu/Documents/projects/content-engine/output/ai-changes-everything"
AUDIO_DIR="$PROJECT_DIR/audio/tiktok"
OUTPUT_DIR="$PROJECT_DIR/tiktok"

echo "============================================================"
echo "  TIKTOK VIDEO GENERATOR v2"
echo "============================================================"
echo ""

mkdir -p "$OUTPUT_DIR"

# TikTok IDs
declare -a TIKTOK_IDS=("tiktok_01_hook" "tiktok_02_old_world" "tiktok_03_new_world" "tiktok_04_timeline" "tiktok_05_proof" "tiktok_06_twist")
declare -a TIKTOK_TITLES=("The Framework Trap" "How We Used to Learn Code" "What AI Changed About Coding" "4 Years vs 4 Weeks" "I Built This Without Knowing Svelte" "The Plot Twist")

# TikTok video specs
WIDTH=1080
HEIGHT=1920

for i in "${!TIKTOK_IDS[@]}"; do
    ID="${TIKTOK_IDS[$i]}"
    TITLE="${TIKTOK_TITLES[$i]}"

    AUDIO_FILE="$AUDIO_DIR/${ID}.mp3"
    OUTPUT_FILE="$OUTPUT_DIR/${ID}.mp4"

    echo "[$((i+1))/6] $TITLE"
    echo "    Audio: $AUDIO_FILE"
    echo "    Output: $OUTPUT_FILE"

    if [ ! -f "$AUDIO_FILE" ]; then
        echo "    ❌ Audio file not found, skipping"
        continue
    fi

    # Get audio duration
    DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$AUDIO_FILE" 2>/dev/null)
    echo "    Duration: ${DURATION}s"

    # Create video with animated gradient background
    # Using lavfi for a dark purple gradient that shifts over time
    ffmpeg -y \
        -f lavfi -i "gradients=s=${WIDTH}x${HEIGHT}:c0=#1a1a2e:c1=#4a148c:x0=0:y0=0:x1=${WIDTH}:y1=${HEIGHT}:d=${DURATION}:speed=0.5" \
        -i "$AUDIO_FILE" \
        -map 0:v \
        -map 1:a \
        -c:v libx264 \
        -preset fast \
        -crf 23 \
        -c:a aac \
        -b:a 128k \
        -shortest \
        "$OUTPUT_FILE" \
        2>/dev/null

    # Fallback to simple color if gradients filter not available
    if [ ! -f "$OUTPUT_FILE" ] || [ ! -s "$OUTPUT_FILE" ]; then
        echo "    Trying simple color background..."
        ffmpeg -y \
            -f lavfi -i "color=c=#1a1a2e:s=${WIDTH}x${HEIGHT}:d=${DURATION}" \
            -i "$AUDIO_FILE" \
            -map 0:v \
            -map 1:a \
            -c:v libx264 \
            -preset fast \
            -crf 23 \
            -c:a aac \
            -b:a 128k \
            -shortest \
            "$OUTPUT_FILE" \
            2>/dev/null
    fi

    if [ -f "$OUTPUT_FILE" ] && [ -s "$OUTPUT_FILE" ]; then
        SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
        echo "    ✅ Complete: $SIZE"
    else
        echo "    ❌ Failed"
    fi
    echo ""
done

echo "============================================================"
echo "  TIKTOK GENERATION COMPLETE"
echo "============================================================"
echo ""
echo "Output:"
ls -lh "$OUTPUT_DIR"/*.mp4 2>/dev/null || echo "No files generated"
echo ""
echo "Total files: $(ls -1 "$OUTPUT_DIR"/*.mp4 2>/dev/null | wc -l)"
echo ""
