#!/bin/bash
# Simple TikTok Video Generator
# Creates 9:16 vertical videos by combining audio with animated text backgrounds

set -e

PROJECT_DIR="/home/dachu/Documents/projects/content-engine/output/ai-changes-everything"
AUDIO_DIR="$PROJECT_DIR/audio/tiktok"
OUTPUT_DIR="$PROJECT_DIR/tiktok"
SCRIPTS_FILE="$PROJECT_DIR/scripts/tiktok-scripts.json"

echo "============================================================"
echo "  TIKTOK VIDEO GENERATOR (Simple Mode)"
echo "============================================================"
echo ""

mkdir -p "$OUTPUT_DIR"

# TikTok video specs
WIDTH=1080
HEIGHT=1920
FPS=30

# Process each TikTok
for i in {0..5}; do
    ID=$(jq -r ".videos[$i].id" "$SCRIPTS_FILE")
    TITLE=$(jq -r ".videos[$i].title" "$SCRIPTS_FILE")
    HOOK=$(jq -r ".videos[$i].hook" "$SCRIPTS_FILE")
    SCRIPT=$(jq -r ".videos[$i].script" "$SCRIPTS_FILE")

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

    # Create video with dark gradient background and animated text
    # Using drawtext for the hook at the top
    ffmpeg -y \
        -f lavfi -i "color=c=#1a1a2e:s=${WIDTH}x${HEIGHT}:d=${DURATION}" \
        -i "$AUDIO_FILE" \
        -filter_complex "
            [0:v]drawtext=text='${HOOK//\'/\\\'}':
                fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:
                fontsize=48:
                fontcolor=gold:
                x=(w-text_w)/2:
                y=h/4:
                borderw=3:
                bordercolor=black,
            drawtext=text='Part $((i+1))/6':
                fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:
                fontsize=28:
                fontcolor=white@0.6:
                x=(w-text_w)/2:
                y=h-100:
                borderw=2:
                bordercolor=black[v]" \
        -map "[v]" \
        -map 1:a \
        -c:v libx264 \
        -preset fast \
        -crf 23 \
        -c:a aac \
        -b:a 128k \
        -shortest \
        "$OUTPUT_FILE" \
        2>/dev/null

    if [ -f "$OUTPUT_FILE" ]; then
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
echo "Preview:"
echo "  mpv --loop $OUTPUT_DIR/tiktok_01_hook.mp4"
echo ""
