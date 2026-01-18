#!/bin/bash

# Circle Geometry Theorems - Chalkboard Style
# Render script for Manim animations
#
# Prerequisites:
#   conda activate aitools
#
# Usage:
#   ./render-circle-geometry.sh [quality] [scene]
#
# Quality options:
#   -ql  = Low quality (480p, 15fps) - fast preview
#   -qm  = Medium quality (720p, 30fps)
#   -qh  = High quality (1080p, 60fps)
#   -qk  = 4K quality (2160p, 60fps)
#
# Examples:
#   ./render-circle-geometry.sh              # Render all at medium quality
#   ./render-circle-geometry.sh -qh          # Render all at high quality
#   ./render-circle-geometry.sh -ql CentralAngleTheorem  # Quick preview of one scene

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Default quality
QUALITY="${1:--qm}"
SCENE="${2:-all}"

# Output directory
OUTPUT_DIR="output/circle-geometry"
mkdir -p "$OUTPUT_DIR"

echo "========================================"
echo "  Circle Geometry - Chalkboard Style   "
echo "========================================"
echo "Quality: $QUALITY"
echo "Output: $OUTPUT_DIR"
echo ""

# All scenes in order
SCENES=(
    "CircleGeometryIntro"
    "CentralAngleTheorem"
    "InscribedAngleTheorem"
    "AngleInSemicircle"
    "CyclicQuadrilateral"
    "TangentRadiusTheorem"
    "TwoTangentsTheorem"
    "AlternateSegmentTheorem"
    "IntersectingChordsTheorem"
    "TangentSecantTheorem"
    "CircleTheoremsSummary"
)

render_scene() {
    local scene=$1
    echo ""
    echo "🎬 Rendering: $scene"
    echo "----------------------------------------"
    manim $QUALITY circle_geometry_chalk.py $scene -o "${scene}.mp4" --media_dir "$OUTPUT_DIR"
    echo "✅ Completed: $scene"
}

if [ "$SCENE" = "all" ]; then
    echo "Rendering all ${#SCENES[@]} scenes..."
    echo ""

    for scene in "${SCENES[@]}"; do
        render_scene "$scene"
    done

    echo ""
    echo "========================================"
    echo "  All scenes rendered successfully!    "
    echo "========================================"
    echo ""
    echo "Output files in: $OUTPUT_DIR/videos/"
    echo ""
    echo "To concatenate into one video, run:"
    echo "  cd $OUTPUT_DIR/videos/*/"
    echo "  ffmpeg -f concat -i <(for f in *.mp4; do echo \"file '\$f'\"; done) -c copy ../circle-geometry-complete.mp4"

else
    render_scene "$SCENE"
fi

echo ""
echo "🎉 Done!"
