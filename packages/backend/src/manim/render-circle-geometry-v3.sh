#!/bin/bash

# Circle Geometry Theorems V3 - Fixed Angle Positioning
#
# Features:
#   - Properly positioned angle wedges
#   - Angles overlay correctly to demonstrate equality
#   - Smooth Transform animations
#
# Usage:
#   ./render-circle-geometry-v3.sh              # All scenes, medium quality
#   ./render-circle-geometry-v3.sh -qh          # All scenes, high quality (1080p)
#   ./render-circle-geometry-v3.sh -ql CentralAngleTheoremV3  # Quick preview

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

QUALITY="${1:--qm}"
SCENE="${2:-all}"

OUTPUT_DIR="output/circle-geometry-v3"
mkdir -p "$OUTPUT_DIR"

echo "========================================"
echo "  Circle Geometry V3 - Fixed Angles    "
echo "========================================"
echo "Quality: $QUALITY"
echo ""

# V3 Scenes with properly positioned angle animations
SCENES=(
    "CircleGeometryIntroV3"
    "CentralAngleTheoremV3"
    "InscribedAngleTheoremV3"
    "AngleInSemicircleV3"
    "CyclicQuadrilateralV3"
    "TangentRadiusTheoremV3"
    "TwoTangentsTheoremV3"
    "AlternateSegmentTheoremV3"
    "IntersectingChordsTheoremV3"
    "TangentSecantTheoremV3"
    "CircleTheoremsSummaryV3"
)

render_scene() {
    local scene=$1
    echo ""
    echo "Rendering: $scene"
    echo "   (with fixed angle positioning)"
    echo "----------------------------------------"
    manim $QUALITY circle_geometry_chalk_v3.py $scene -o "${scene}.mp4" --media_dir "$OUTPUT_DIR"
    echo "Completed: $scene"
}

if [ "$SCENE" = "all" ]; then
    echo "Rendering ${#SCENES[@]} V3 scenes..."

    for scene in "${SCENES[@]}"; do
        render_scene "$scene"
    done

    echo ""
    echo "========================================"
    echo "  All V3 scenes rendered!              "
    echo "========================================"
    echo ""
    echo "Output: $OUTPUT_DIR/videos/"
    echo ""
    echo "Key improvements in V3:"
    echo "  - Angle wedges now position correctly when overlaying"
    echo "  - Smooth Transform animations between positions"
    echo "  - Proper angle calculation at target vertices"
    echo ""
    echo "Scenes with angle overlay animations:"
    echo "  - CentralAngleTheoremV3: inscribed fits TWICE into central"
    echo "  - InscribedAngleTheoremV3: angles overlay to show equality"
    echo "  - CyclicQuadrilateralV3: opposite angles form 180 line"
    echo "  - AlternateSegmentTheoremV3: tangent angle = inscribed angle"

else
    render_scene "$SCENE"
fi

echo ""
echo "Done!"
