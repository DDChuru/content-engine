#!/bin/bash

# Circle Geometry Theorems V2 - Enhanced with Angle Shading Animations
#
# Features:
#   - Shaded angle wedges that animate and move
#   - Angles overlay on equal angles to prove equality
#   - Visual demonstrations of angle relationships
#
# Usage:
#   ./render-circle-geometry-v2.sh              # All scenes, medium quality
#   ./render-circle-geometry-v2.sh -qh          # All scenes, high quality (1080p)
#   ./render-circle-geometry-v2.sh -ql CentralAngleTheoremV2  # Quick preview

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

QUALITY="${1:--qm}"
SCENE="${2:-all}"

OUTPUT_DIR="output/circle-geometry-v2"
mkdir -p "$OUTPUT_DIR"

echo "========================================"
echo "  Circle Geometry V2 - Shaded Angles   "
echo "========================================"
echo "Quality: $QUALITY"
echo ""

# V2 Scenes with enhanced animations
SCENES=(
    "CentralAngleTheoremV2"
    "InscribedAngleTheoremV2"
    "AngleInSemicircleV2"
    "CyclicQuadrilateralV2"
    "AlternateSegmentTheoremV2"
    "CircleTheoremsSummaryV2"
)

render_scene() {
    local scene=$1
    echo ""
    echo "🎬 Rendering: $scene"
    echo "   (with shaded angle animations)"
    echo "----------------------------------------"
    manim $QUALITY circle_geometry_chalk_v2.py $scene -o "${scene}.mp4" --media_dir "$OUTPUT_DIR"
    echo "✅ Completed: $scene"
}

if [ "$SCENE" = "all" ]; then
    echo "Rendering ${#SCENES[@]} enhanced scenes..."

    for scene in "${SCENES[@]}"; do
        render_scene "$scene"
    done

    echo ""
    echo "========================================"
    echo "  All V2 scenes rendered!              "
    echo "========================================"
    echo ""
    echo "Output: $OUTPUT_DIR/videos/"
    echo ""
    echo "Key animations included:"
    echo "  • Central Angle: inscribed angle fits TWICE"
    echo "  • Inscribed Angles: angles overlay to show equality"
    echo "  • Cyclic Quad: opposite angles form 180° line"
    echo "  • Alternate Segment: tangent angle = inscribed angle"

else
    render_scene "$SCENE"
fi

echo ""
echo "🎉 Done!"
