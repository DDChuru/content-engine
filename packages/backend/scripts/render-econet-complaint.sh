#!/bin/bash
# Econet Consumer Complaint Video - Render Script
# Renders a powerful social media advocacy video

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$BACKEND_DIR/output/videos"

echo "=== Econet Consumer Complaint Video ==="
echo "Backend dir: $BACKEND_DIR"
echo "Output dir: $OUTPUT_DIR"
echo ""

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Render the video with Remotion
echo "=== Rendering Video with Remotion ==="
cd "$BACKEND_DIR"

npx remotion render src/remotion/Root.tsx EconetComplaint "$OUTPUT_DIR/econet-complaint.mp4" \
    --codec=h264 \
    --overwrite \
    --public-dir=src/remotion/public \
    2>&1 | tail -10

echo ""
echo "=== Complete ==="
echo "Video rendered: $OUTPUT_DIR/econet-complaint.mp4"
ls -lh "$OUTPUT_DIR/econet-complaint.mp4"

echo ""
echo "=== Next Steps ==="
echo "1. Review the video: mpv '$OUTPUT_DIR/econet-complaint.mp4'"
echo "2. Upload to social media (Twitter, Facebook, LinkedIn)"
echo "3. Use hashtags: #EconetScam #ConsumerRights #Zimbabwe #DataRights"
echo "4. Tag @EconetWireless and @POTRAZ"
