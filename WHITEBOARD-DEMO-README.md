# Whiteboard Animation Demo

This demo showcases different animation approaches for creating educational content with step-by-step narration using ElevenLabs voice synthesis.

## Features

### 🎨 Three Animation Modes

1. **Anime.js (Smooth)** - Clean, smooth transitions perfect for professional presentations
2. **Rough.js (Sketchy)** - Hand-drawn, whiteboard-style animations with a personal touch
3. **Combined** - Best of both worlds: smooth animations with sketchy highlights

### 🎙️ Voice Narration

- Uses ElevenLabs API with your custom voice ID: `gYWKdgLtqjPO3D5uDrDP`
- Automatic fallback to Web Speech API if backend is unavailable
- Synchronized with visual animations
- Visual audio indicator when narrating

### 📊 Content

Demo uses the **Introduction to Sets** topic from Cambridge IGCSE Mathematics:
- Title introduction
- 7 step-by-step explanations
- Mathematical notation and examples
- Set theory operations (Union and Intersection)

## Quick Start

### 1. Start the Backend

```bash
cd /home/dachu/Documents/projects/content-engine/packages/backend
npm run dev
```

The backend should start on `http://localhost:3001`

### 2. Open the Demo

Simply open the HTML file in your browser:

```bash
# Option 1: Direct file open
xdg-open /home/dachu/Documents/projects/content-engine/whiteboard-demo.html

# Option 2: Serve with a simple HTTP server (recommended)
cd /home/dachu/Documents/projects/content-engine
python3 -m http.server 8000
# Then open http://localhost:8000/whiteboard-demo.html
```

### 3. Use the Demo

1. **Select Animation Style** - Choose from the three modes in the top-left panel
2. **Click "Play Animation"** - Start the step-by-step presentation
3. **Watch & Listen** - The animation will progress automatically with voiceover
4. **Reset** - Click reset to start over with a different animation style

## How It Works

### Frontend (whiteboard-demo.html)

- Pure JavaScript with Anime.js and Rough.js libraries
- SVG and Canvas rendering for different visual effects
- Responsive whiteboard design with grid background
- Progress indicator and audio visualization

### Backend (packages/backend/src/routes/voice.ts)

- ElevenLabs integration for professional voice synthesis
- Caching for better performance
- Batch generation support for multiple audio clips
- Error handling with fallback options

### Animation Techniques

#### Anime.js Mode
- Smooth CSS transforms
- Opacity transitions
- Sequential timeline animations
- Professional, polished look

#### Rough.js Mode
- Hand-drawn SVG rectangles and circles
- Sketchy, organic feel
- Hachure fill patterns
- Whiteboard aesthetic

#### Combined Mode
- Anime.js for text/element animations
- Rough.js for decorative highlights
- Underlines, circles, and annotations
- Best of both techniques

## Customization

### Change Content

Edit the `lessonSteps` array in `whiteboard-demo.html`:

```javascript
const lessonSteps = [
  {
    step: 'title',
    narration: "Your title narration"
  },
  {
    step: 1,
    narration: "Step 1 narration"
  },
  // ... more steps
];
```

### Adjust Voice Settings

In the backend route (`packages/backend/src/routes/voice.ts`), you can modify:

```javascript
{
  stability: 0.5,        // 0-1: Lower = more expressive
  similarityBoost: 0.75, // 0-1: Higher = closer to original voice
  style: 0,              // 0-1: Style exaggeration
  speakerBoost: true     // Enhance clarity
}
```

### Change Voice

To use a different ElevenLabs voice, update the `voiceId` in the HTML:

```javascript
const voiceId = 'YOUR_VOICE_ID_HERE';
```

To list available voices:
```bash
curl http://localhost:3001/api/voice/list
```

## Production Use

### For Your 11 Labs

1. **Extract Content** - Pull content from your Cambridge IGCSE data
2. **Generate Steps** - Create step-by-step lesson data
3. **Batch Audio Generation** - Use the batch endpoint:

```javascript
const response = await fetch('http://localhost:3001/api/voice/generate-batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    steps: [
      { text: "Step 1 narration" },
      { text: "Step 2 narration" },
      // ... all steps
    ],
    voiceId: 'gYWKdgLtqjPO3D5uDrDP'
  })
});
```

4. **Video Export** - Integrate with your existing Manim/Remotion pipeline

### Performance Tips

- Audio files are cached by the browser
- Use batch generation for multiple steps
- Pre-generate audio for entire courses
- Consider CDN for production audio delivery

## Troubleshooting

### No Voice (Using Fallback)

1. Check backend is running: `http://localhost:3001/api/health`
2. Verify ElevenLabs API key in `.env`
3. Check browser console for errors
4. Test voice endpoint directly:
   ```bash
   curl -X POST http://localhost:3001/api/voice/generate \
     -H "Content-Type: application/json" \
     -d '{"text":"Test","voiceId":"gYWKdgLtqjPO3D5uDrDP"}'
   ```

### CORS Errors

The backend is configured to allow localhost origins. If you see CORS errors:
1. Make sure you're accessing via `http://localhost:` not `file://`
2. Use a local HTTP server (Python's http.server or similar)

### Animation Not Playing

1. Check browser console for JavaScript errors
2. Ensure Anime.js and Rough.js libraries loaded (CDN)
3. Try different animation mode
4. Clear browser cache and reload

## Next Steps

- [ ] Create demos for all 11 labs
- [ ] Add more animation styles
- [ ] Integrate with video recording
- [ ] Add interactive elements (pause, seek, speed control)
- [ ] Export as standalone video files
- [ ] Build course authoring interface

## API Documentation

### POST /api/voice/generate
Generate single audio clip

**Request:**
```json
{
  "text": "Hello world",
  "voiceId": "gYWKdgLtqjPO3D5uDrDP",
  "stability": 0.5,
  "similarityBoost": 0.75
}
```

**Response:** MP3 audio file (binary)

### POST /api/voice/generate-batch
Generate multiple audio clips

**Request:**
```json
{
  "steps": [
    { "text": "First step" },
    { "text": "Second step" }
  ],
  "voiceId": "gYWKdgLtqjPO3D5uDrDP"
}
```

**Response:**
```json
{
  "success": true,
  "audioFiles": [
    { "index": 0, "audio": "data:audio/mpeg;base64,..." },
    { "index": 1, "audio": "data:audio/mpeg;base64,..." }
  ],
  "count": 2
}
```

### GET /api/voice/list
List available voices

**Response:**
```json
{
  "success": true,
  "voices": [
    {
      "voiceId": "abc123",
      "name": "John",
      "category": "premade"
    }
  ],
  "count": 1
}
```

---

**Built with:**
- Anime.js - https://animejs.com/
- Rough.js - https://roughjs.com/
- ElevenLabs - https://elevenlabs.io/
- Express.js - https://expressjs.com/
