#!/bin/bash
# Standardized Lesson Rendering Pipeline
# This script renders Manim scenes and composes the final video

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"
MANIM_DIR="$BACKEND_DIR/src/manim"
REMOTION_PUBLIC="$BACKEND_DIR/src/remotion/public/videos"
OUTPUT_DIR="$MANIM_DIR/output"

# Activate conda environment
source ~/miniconda3/etc/profile.d/conda.sh
conda activate aitools

echo "=== Lesson Rendering Pipeline ==="
echo "Manim dir: $MANIM_DIR"
echo "Remotion public: $REMOTION_PUBLIC"
echo "Output dir: $OUTPUT_DIR"
echo ""

# Function to render a single Manim scene
render_scene() {
    local scene_name=$1
    local output_name=$2

    echo "Rendering $scene_name -> $output_name.mp4"
    cd "$MANIM_DIR"
    manim -qh sets_lesson.py "$scene_name" -o "${output_name}.mp4" --media_dir ./output 2>&1 | grep -E "(File ready|Rendered)"

    # Copy to Remotion public folder (source for composition)
    cp "$OUTPUT_DIR/videos/sets_lesson/1080p60/${output_name}.mp4" "$REMOTION_PUBLIC/${output_name}.mp4"
    echo "  -> Copied to $REMOTION_PUBLIC/${output_name}.mp4"
}

# Render all Manim scenes
echo "=== Step 1: Rendering Manim Scenes ==="
render_scene "WhatIsASet" "step1"
render_scene "SetNotation" "step2"
render_scene "VennIntro" "step3"
render_scene "SetAVisualized" "step4"
render_scene "TwoSetsOverlap" "step5"
render_scene "UnionConcept" "step7"
render_scene "UniversalSetIntro" "step9"
render_scene "UniversalSetExample" "step10"

echo ""
echo "=== Step 2: Composing Final Video with Remotion ==="
cd "$BACKEND_DIR"
# IMPORTANT: Must specify --public-dir to use src/remotion/public (not backend/public)
npx remotion render src/remotion/Root.tsx SetsLesson "$OUTPUT_DIR/sets-lesson-complete.mp4" --codec=h264 --overwrite --public-dir=src/remotion/public 2>&1 | tail -5

echo ""
echo "=== Complete ==="
echo "Final video: $OUTPUT_DIR/sets-lesson-complete.mp4"
ls -lh "$OUTPUT_DIR/sets-lesson-complete.mp4"
