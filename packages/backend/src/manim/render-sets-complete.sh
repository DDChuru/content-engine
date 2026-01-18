#!/bin/bash

# Sets Lesson - Complete Render Script
# This script helps preview and render the complete Sets lesson with intro slides + Manim content

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$(dirname "$BACKEND_DIR")")"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 Complete Sets Lesson - Remotion Renderer"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Change to backend directory
cd "$BACKEND_DIR"

# Function to show usage
usage() {
    echo "Usage: ./render-sets-complete.sh [command]"
    echo ""
    echo "Commands:"
    echo "  preview     - Open Remotion Studio to preview the lesson"
    echo "  render      - Render complete lesson to MP4 (1080p, 30fps)"
    echo "  render-intro - Render only intro slides (Part 1)"
    echo "  render-manim - Render only Manim content (Part 2)"
    echo "  info        - Show lesson information and structure"
    echo "  open        - Open preview HTML in browser"
    echo ""
    echo "Examples:"
    echo "  ./render-sets-complete.sh preview"
    echo "  ./render-sets-complete.sh render"
    echo ""
    exit 1
}

# Function to show lesson info
show_info() {
    echo "📊 Lesson Information:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Title: Introduction to Sets"
    echo "Level: Cambridge IGCSE Mathematics"
    echo "Duration: ~3 minutes 10 seconds"
    echo "Total Scenes: 13 (5 intro + 8 Manim)"
    echo "Cost: ~$1.44 (with narration)"
    echo ""
    echo "Structure:"
    echo "  Part 1: Introduction (2m 10s)"
    echo "    - Branding Intro (10s)"
    echo "    - Topic Title (15s)"
    echo "    - Learning Objectives (45s)"
    echo "    - Prerequisites (30s)"
    echo "    - Lesson Roadmap (30s)"
    echo ""
    echo "  Part 2: Core Content - Manim (1m 5s)"
    echo "    - 8 mathematical animation scenes"
    echo ""
    echo "Output:"
    echo "  Resolution: 1920x1080 (1080p)"
    echo "  Frame Rate: 30 fps"
    echo "  Codec: H.264"
    echo "  Format: MP4"
    echo ""
    echo "Files:"
    echo "  - Composition: src/remotion/compositions/SetsLesson.tsx"
    echo "  - Components: src/remotion/components/webslides/IntroSlides.tsx"
    echo "  - Manim scenes: src/manim/output/manim/step*.mp4"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Function to open preview HTML
open_preview() {
    echo "🌐 Opening preview in browser..."
    xdg-open "$SCRIPT_DIR/preview-complete-lesson.html" 2>/dev/null || \
    open "$SCRIPT_DIR/preview-complete-lesson.html" 2>/dev/null || \
    echo "Please open: $SCRIPT_DIR/preview-complete-lesson.html"
}

# Parse command
COMMAND="${1:-preview}"

case "$COMMAND" in
    preview)
        echo "🎬 Starting Remotion Studio..."
        echo ""
        echo "Once the studio opens:"
        echo "  1. Select 'SetsLesson' from the composition dropdown"
        echo "  2. Use the timeline to navigate through scenes"
        echo "  3. Press spacebar to play/pause"
        echo ""
        npx remotion preview src/remotion/Root.tsx
        ;;

    render)
        echo "🎥 Rendering complete Sets lesson..."
        echo ""
        OUTPUT_FILE="$SCRIPT_DIR/output/sets-lesson-complete.mp4"
        mkdir -p "$SCRIPT_DIR/output"

        npx remotion render \
            src/remotion/Root.tsx \
            SetsLesson \
            "$OUTPUT_FILE" \
            --codec=h264 \
            --overwrite

        echo ""
        echo "✅ Rendering complete!"
        echo "📁 Output: $OUTPUT_FILE"

        # Show file info
        if [ -f "$OUTPUT_FILE" ]; then
            SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
            echo "📊 File size: $SIZE"
        fi
        ;;

    render-intro)
        echo "🎥 Rendering intro slides only..."
        echo ""
        OUTPUT_FILE="$SCRIPT_DIR/output/sets-lesson-intro-only.mp4"
        mkdir -p "$SCRIPT_DIR/output"

        # Render with only intro enabled
        npx remotion render \
            src/remotion/Root.tsx \
            SetsLesson \
            "$OUTPUT_FILE" \
            --codec=h264 \
            --overwrite \
            --props='{"includeIntro": true, "includeManimScenes": false}'

        echo ""
        echo "✅ Intro rendering complete!"
        echo "📁 Output: $OUTPUT_FILE"
        ;;

    render-manim)
        echo "🎥 Rendering Manim scenes only..."
        echo ""
        OUTPUT_FILE="$SCRIPT_DIR/output/sets-lesson-manim-only.mp4"
        mkdir -p "$SCRIPT_DIR/output"

        # Render with only Manim enabled
        npx remotion render \
            src/remotion/Root.tsx \
            SetsLesson \
            "$OUTPUT_FILE" \
            --codec=h264 \
            --overwrite \
            --props='{"includeIntro": false, "includeManimScenes": true}'

        echo ""
        echo "✅ Manim rendering complete!"
        echo "📁 Output: $OUTPUT_FILE"
        ;;

    info)
        show_info
        ;;

    open)
        open_preview
        ;;

    *)
        echo "❌ Unknown command: $COMMAND"
        echo ""
        usage
        ;;
esac
