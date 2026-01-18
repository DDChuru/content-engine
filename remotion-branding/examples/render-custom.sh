#!/bin/bash
# Example: Render custom branded intro/outro

# Render SOP Training Intro
remotion render src/index.ts Intro out/sop-intro.mp4 \
  --props='{
    "title": "Temperature Monitoring",
    "subtitle": "Food Safety Standard Operating Procedure",
    "brandColor": "#0ea5e9"
  }'

# Render Training Outro
remotion render src/index.ts Outro out/training-outro.mp4 \
  --props='{
    "title": "Great Work!",
    "callToAction": "Complete the quiz to finish this module",
    "contactInfo": "Questions? Email training@company.com",
    "brandColor": "#0ea5e9"
  }'

echo "✅ Custom videos rendered:"
echo "   - out/sop-intro.mp4"
echo "   - out/training-outro.mp4"
