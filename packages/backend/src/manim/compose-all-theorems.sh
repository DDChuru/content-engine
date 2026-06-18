#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Compose ALL Circle Theorem TikToks (Manim + Narration)
# ═══════════════════════════════════════════════════════════
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ASSETS_BASE="../remotion/public/images"
OUTPUT_DIR="$HOME/Downloads"

echo "═══════════════════════════════════════════"
echo "  Circle Theorems — Compose Final Videos"
echo "═══════════════════════════════════════════"
echo ""

THEOREMS=(
    "theorem2-semicircle:theorem2_semicircle:Theorem2_Semicircle"
    "theorem3-same-segment:theorem3_same_segment:Theorem3_SameSegment"
    "theorem4-cyclic-quad:theorem4_cyclic_quad:Theorem4_CyclicQuad"
    "theorem5-tangent-radius:theorem5_tangent_radius:Theorem5_TangentRadius"
    "theorem6-two-tangents:theorem6_two_tangents:Theorem6_TwoTangents"
    "theorem7-alt-segment:theorem7_alt_segment:Theorem7_AltSegment"
)

for entry in "${THEOREMS[@]}"; do
    IFS=':' read -r ID PYBASE SCENE <<< "$entry"

    # Find Manim video
    MANIM_VIDEO=$(find "output/$ID/videos" -name "*.mp4" -type f 2>/dev/null | head -1)
    NARRATION="$ASSETS_BASE/$ID/narration.mp3"
    COVER="$ASSETS_BASE/$ID/cover.png"
    OUTFILE="$OUTPUT_DIR/${SCENE}-TikTok.mp4"

    if [ -z "$MANIM_VIDEO" ]; then
        echo "⚠  SKIP $ID: No Manim video found"
        continue
    fi

    if [ ! -f "$NARRATION" ]; then
        echo "⚠  SKIP $ID: No narration found"
        continue
    fi

    echo "▶ Composing: $ID..."
    ffmpeg -y -i "$MANIM_VIDEO" -i "$NARRATION" \
        -c:v libx264 -crf 23 -preset medium \
        -c:a aac -b:a 128k \
        -shortest "$OUTFILE" 2>/dev/null

    if [ -f "$OUTFILE" ]; then
        DURATION=$(ffprobe -v quiet -print_format json -show_format "$OUTFILE" | \
            python3 -c "import json,sys; d=json.load(sys.stdin); print(f'{float(d[\"format\"][\"duration\"]):.1f}s')")
        SIZE=$(du -h "$OUTFILE" | cut -f1)
        echo "  ✓ $OUTFILE: $DURATION, $SIZE"
    fi

    # Copy cover
    if [ -f "$COVER" ]; then
        cp "$COVER" "$OUTPUT_DIR/${SCENE}-Cover.png"
        echo "  ✓ Cover copied"
    fi

    echo ""
done

echo "═══════════════════════════════════════════"
echo "  DONE! All videos in $OUTPUT_DIR/"
echo "═══════════════════════════════════════════"
ls -lh "$OUTPUT_DIR"/Theorem*-TikTok.mp4 2>/dev/null
