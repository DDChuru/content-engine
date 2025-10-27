#!/bin/bash

# Episode 1 Simple Recording Script
# No OBS needed - just ffmpeg screen recording

echo "🎬 EPISODE 1 RECORDING SETUP"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if ffmpeg is available
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg not found. Installing..."
    sudo apt install ffmpeg -y
fi

# Create output directory
mkdir -p recordings
OUTPUT_DIR="recordings"

echo -e "${BLUE}📹 Recording Method Options:${NC}"
echo ""
echo "1. SimpleScreenRecorder (easiest - GUI)"
echo "2. ffmpeg (command line - screen + audio)"
echo "3. Just play the videos (you record separately)"
echo ""
read -p "Choose option (1/2/3): " choice

case $choice in
    1)
        echo -e "${GREEN}Installing SimpleScreenRecorder...${NC}"
        sudo apt install simplescreenrecorder -y
        echo ""
        echo -e "${YELLOW}Starting SimpleScreenRecorder...${NC}"
        echo "1. Click 'Continue' → 'Continue'"
        echo "2. Select 'Record a fixed rectangle'"
        echo "3. Select your screen area"
        echo "4. Click 'Continue' → 'Continue' → 'Start recording'"
        echo ""
        simplescreenrecorder &
        sleep 2
        ;;
    2)
        echo -e "${GREEN}Recording with ffmpeg...${NC}"
        echo "Press CTRL+C to stop recording"
        echo ""
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        ffmpeg -video_size 1920x1080 -framerate 30 -f x11grab -i :0.0 \
               -f pulse -ac 2 -i default \
               -c:v libx264 -preset ultrafast -crf 18 \
               -c:a aac -b:a 192k \
               "$OUTPUT_DIR/episode-1-$TIMESTAMP.mp4"
        ;;
    3)
        echo -e "${YELLOW}Manual recording mode${NC}"
        ;;
esac

# Play the videos in sequence
echo ""
echo -e "${BLUE}🎥 READY TO PLAY VIDEOS${NC}"
echo ""
echo "Press ENTER to play COLLISION video (BEFORE learning)..."
read

# Play collision video
echo -e "${GREEN}▶️  Playing COLLISION video...${NC}"
mpv --fs --loop=inf BEFORE-LEARNING-COLLISION.mp4 &
MPV_PID=$!

echo ""
echo "Press ENTER when ready to switch to CLEAN video (AFTER learning)..."
read

# Kill first video and play clean video
kill $MPV_PID 2>/dev/null
echo -e "${GREEN}▶️  Playing CLEAN video...${NC}"
mpv --fs --loop=inf sets-EDUCATIONAL-FINAL.mp4 &
MPV_PID=$!

echo ""
echo "Press ENTER to stop playback..."
read

kill $MPV_PID 2>/dev/null

echo ""
echo -e "${GREEN}✅ Done!${NC}"
echo "Recordings saved in: $OUTPUT_DIR/"
