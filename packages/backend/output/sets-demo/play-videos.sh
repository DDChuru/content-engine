#!/bin/bash

echo "🎬 EPISODE 1 - VIDEO PLAYBACK"
echo "=============================="
echo ""
echo "I'll play the videos. You record however you want:"
echo "  • Phone camera pointed at screen"
echo "  • Screen recorder software you already have"
echo "  • Whatever works for you!"
echo ""
echo "Press ENTER to start..."
read

echo ""
echo "▶️  1. COLLISION VIDEO (Agent BEFORE learning)"
echo "   Narrate: 'Look at this - arrows colliding, overlapping...'"
echo ""
echo "Press ENTER to play..."
read

vlc --fullscreen --loop BEFORE-LEARNING-COLLISION.mp4 &
VLC_PID=$!

echo ""
echo "Press ENTER when done with collision video..."
read
kill $VLC_PID 2>/dev/null

echo ""
echo "▶️  2. CLEAN VIDEO (Agent AFTER learning)"  
echo "   Narrate: 'Nine out of ten! The agent learned...'"
echo ""
echo "Press ENTER to play..."
read

vlc --fullscreen --loop sets-EDUCATIONAL-FINAL.mp4 &
VLC_PID=$!

echo ""
echo "Press ENTER to stop..."
read
kill $VLC_PID 2>/dev/null

echo ""
echo "✅ Done! Now edit your recording."
