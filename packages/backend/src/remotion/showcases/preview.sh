#!/bin/bash
# Preview the Remotion Skill Showcase in browser

cd "$(dirname "$0")/../../../.." || exit 1

echo ""
echo "🎬 Starting Remotion Preview Server..."
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Composition: SkillShowcase"
echo "Duration: 24 seconds (720 frames @ 30fps)"
echo "Resolution: 1920x1080"
echo ""
echo "Scenes:"
echo "  1. Kinetic Title Reveal (0-4s)"
echo "  2. Spring Physics Comparison (4-8s)"
echo "  3. 3D Card Flip (8-12s)"
echo "  4. Staggered Grid Animation (12-16s)"
echo "  5. Color Interpolation Wave (16-20s)"
echo "  6. Finale (20-24s)"
echo ""
echo "Starting preview server..."
echo ""

npx remotion preview src/remotion/showcases/Root.tsx
