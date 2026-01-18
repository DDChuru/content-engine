# 🎓 AI Course Creator - Complete Guide

## Overview

A voice-driven, interactive course creation system that combines all your existing capabilities into a streamlined workflow:
- **Voice Input** - Describe your course requirements
- **Claude AI** - Generates course structure
- **Interactive Review** - Approve and refine structure
- **Gemini Image Generation** - Create visuals with review/replace
- **Manim** - Professional math animations (no text in animations)
- **WebSlides** - Professional presentation themes
- **Remotion** - Final video composition
- **ElevenLabs** - Voice narration (optional - not yet implemented)

## Access

**Frontend URL:** http://localhost:3000/course-creator

**Backend API:** http://localhost:3001/api/course-creator/*

## Workflow

### Step 1: Course Input
```
User provides:
- Audience (IGCSE students, professionals, etc.)
- Topic (Circle Theorems, Python, etc.)
- Style (professional, casual, academic)

Options:
1. Type in the form
2. Record voice description (transcribed with Whisper)
```

### Step 2: Review Structure
```
Claude AI generates:
- Course title
- Description
- 4-6 chapters with:
  - Title & description
  - Duration (30-60s each)
  - Content type:
    • math → Manim animation
    • visual → Gemini image
    • text → Gradient background
    • mixed → Both Gemini + text

User can:
- Approve structure
- Request refinements (voice or text)
```

### Step 3: Review Images
```
System generates images for visual/mixed chapters using Gemini

For each image:
- View generated image
- See original prompt
- Replace if needed (new prompt → new image)

Math chapters skip this (Manim handles those)
```

### Step 4: Generate Video
```
System creates final course using:
1. Manim for math animations (pure visual, NO TEXT)
2. Gemini images for visual content
3. WebSlides templates for presentation
4. Remotion for final composition

Output: Professional course video (.mp4)
```

## API Endpoints

### POST /api/course-creator/start
**Create new course session**

**Body (multipart/form-data):**
```typescript
{
  audio?: File,        // Optional voice recording
  audience: string,
  topic: string,
  style: 'professional' | 'casual' | 'academic'
}
```

**Response:**
```typescript
{
  success: true,
  sessionId: string,
  structure: CourseStructure,
  message: string,
  transcription?: string
}
```

---

### POST /api/course-creator/refine
**Refine course structure with feedback**

**Body:**
```typescript
{
  sessionId: string,
  feedback?: string,
  audio?: File
}
```

**Response:**
```typescript
{
  success: true,
  structure: CourseStructure,
  message: string
}
```

---

### POST /api/course-creator/approve-structure
**Approve structure and proceed to image generation**

**Body:**
```typescript
{
  sessionId: string
}
```

---

### POST /api/course-creator/generate-images
**Generate images for visual chapters**

**Body:**
```typescript
{
  sessionId: string
}
```

**Response:**
```typescript
{
  success: true,
  images: GeneratedImage[],
  message: string
}
```

---

### POST /api/course-creator/replace-image
**Replace a generated image**

**Body:**
```typescript
{
  sessionId: string,
  chapterId: string,
  newPrompt: string
}
```

**Response:**
```typescript
{
  success: true,
  image: {
    chapterId: string,
    url: string,
    prompt: string
  }
}
```

---

### POST /api/course-creator/approve-images
**Approve all images**

**Body:**
```typescript
{
  sessionId: string
}
```

---

### POST /api/course-creator/generate-video
**Generate final course video**

**Body:**
```typescript
{
  sessionId: string
}
```

**Response:**
```typescript
{
  success: true,
  videoPath: string,
  duration: number,
  scenes: number,
  message: string
}
```

---

### GET /api/course-creator/session/:sessionId
**Get session details**

**Response:**
```typescript
{
  success: true,
  session: {
    id: string,
    audience: string,
    topic: string,
    style: string,
    structure: CourseStructure,
    images: GeneratedImage[],
    readyToGenerate: boolean
  }
}
```

## Key Features

### 1. **Manim Integration (NO TEXT)**
```typescript
// Math chapters automatically use Manim
// IMPORTANT: Text overlays added by WebSlides, NOT Manim
if (chapter.contentType === 'math') {
  const manimScene: ManimScene = {
    sceneType: 'theory',
    concept: chapter.description,
    parameters: {
      title: '', // EMPTY - text added by WebSlides
      customCode: `
# Pure visual animation - NO TEXT
from manim import *

class MathScene(Scene):
    def construct(self):
        # Mathematical visualization only
        equation = MathTex(r"${chapter.description}")
        self.play(Write(equation))
        self.wait(2)
`
    }
  };

  const result = await manimRenderer.render(manimScene);
  visualPath = result.videoPath;
}
```

### 2. **Image Review & Replacement**
```typescript
// User can replace any generated image
<button onClick={() => setReplacingImageId(img.chapterId)}>
  🔄 Replace Image
</button>

// New prompt generates new image
await fetch(`${API_URL}/api/course-creator/replace-image`, {
  method: 'POST',
  body: JSON.stringify({
    sessionId,
    chapterId,
    newPrompt: 'Better prompt for this concept'
  })
});
```

### 3. **WebSlides Themes**
```typescript
// Professional presentation themes
const result = await videoRenderer.quickRender(
  scenes,
  outputFilename,
  style === 'professional' ? 'education-dark' : 'education-light'
);

// Available themes:
// - education-dark (professional)
// - education-light (bright/friendly)
// - marketing (business)
// - documentation (technical)
```

### 4. **Voice Input (Optional)**
```typescript
// Record voice description
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const recorder = new MediaRecorder(stream);

// Auto-transcribe with Whisper
const result = await openai.audio.transcriptions.create({
  file: audioBlob,
  model: 'whisper-1',
});

transcription = result.text;
```

## Example Usage

### Full Workflow Example
```bash
# 1. Start course creation
curl -X POST http://localhost:3001/api/course-creator/start \
  -F "audience=IGCSE students" \
  -F "topic=Circle Theorems" \
  -F "style=professional"

# Response:
{
  "sessionId": "abc123",
  "structure": {
    "title": "Circle Theorems for IGCSE",
    "chapters": [
      {
        "id": "chapter-1",
        "title": "Angle at Centre",
        "contentType": "math",      // Will use Manim
        "duration": 45
      },
      {
        "id": "chapter-2",
        "title": "Real-world Applications",
        "contentType": "visual",    // Will use Gemini
        "duration": 40,
        "imagePrompt": "Engineering diagram showing circle theorems in architecture"
      }
    ]
  }
}

# 2. Approve structure and generate images
curl -X POST http://localhost:3001/api/course-creator/approve-structure \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "abc123"}'

curl -X POST http://localhost:3001/api/course-creator/generate-images \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "abc123"}'

# 3. Review images (frontend)
# User sees generated images and can replace any

# 4. Replace an image if needed
curl -X POST http://localhost:3001/api/course-creator/replace-image \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "abc123",
    "chapterId": "chapter-2",
    "newPrompt": "Modern skyscraper using circular geometry in design"
  }'

# 5. Generate final video
curl -X POST http://localhost:3001/api/course-creator/generate-video \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "abc123"}'

# Response:
{
  "success": true,
  "videoPath": "output/videos/abc123-course.mp4",
  "duration": 85,
  "scenes": 2,
  "message": "Course video generated successfully!"
}
```

## Technical Architecture

### Data Flow
```
User Input (Voice/Text)
    ↓
Claude AI (Structure Generation)
    ↓
User Approval/Refinement
    ↓
For each chapter:
├─ Math → Manim Animation (no text)
├─ Visual → Gemini Image Generation
│   ↓
│   User Review/Replace Loop
│   ↓
│   Approved
└─ Text → Gradient Background
    ↓
WebSlides Scene Assembly
    ↓
Remotion Video Composition
    ↓
Final Course Video (.mp4)
```

### Session Management
```typescript
// In-memory session storage
// For production: Use Redis or Firebase
const sessions = new Map<string, CourseSession>();

interface CourseSession {
  id: string;
  audience: string;
  topic: string;
  style: string;
  structure?: CourseStructure;
  images?: GeneratedImage[];
  scenes?: WebSlidesScene[];
  conversationHistory: Message[];
  readyToGenerate: boolean;
  createdAt: Date;
}
```

## Future Enhancements

### 1. **ElevenLabs Narration** (TODO)
```typescript
// Add voice narration to each scene
for (const chapter of structure.chapters) {
  const narration = await elevenLabs.textToSpeech({
    text: chapter.description,
    voice_id: user.voiceId,  // User's cloned voice
    model_id: "eleven_multilingual_v2"
  });

  scenes.push({
    ...scene,
    audio: narration.audioPath
  });
}
```

### 2. **Quiz Generation** (TODO)
```typescript
// Add quiz questions after each chapter
const quiz = await claude.generateQuiz({
  chapterContent: chapter.description,
  difficulty: 'medium',
  questionCount: 3
});

// Render quiz as interactive slide
```

### 3. **SCORM Export** (TODO)
```typescript
// Package as SCORM for LMS upload
const scormPackage = await createSCORM({
  videoPath: result.videoPath,
  metadata: {
    title: structure.title,
    description: structure.description,
    duration: result.duration
  }
});
```

### 4. **Collaborative Editing** (TODO)
```typescript
// Multi-user course creation with Firebase Realtime Database
const sessionRef = db.ref(`course-sessions/${sessionId}`);

sessionRef.on('value', (snapshot) => {
  const session = snapshot.val();
  updateUI(session);
});
```

## Troubleshooting

### Issue: Images not generating
**Solution:** Check Gemini API key is configured:
```bash
grep GEMINI_API_KEY .env
```

### Issue: Manim animations failing
**Solution:** Verify Manim installation:
```bash
/home/dachu/miniconda3/envs/aitools/bin/manim --version
```

### Issue: Video rendering fails
**Solution:** Check Remotion bundle:
```bash
# Remotion auto-bundles on first render
# If failed, restart backend to clear cache
```

### Issue: Voice recording not working
**Solution:** Browser must be HTTPS or localhost for microphone access

## Best Practices

### 1. **Image Prompts**
```
✅ GOOD: "Professional diagram showing circle theorem with labeled angles and arcs"
❌ BAD: "Circle thing"

✅ GOOD: "Modern classroom setting with students learning about geometry"
❌ BAD: "School"
```

### 2. **Manim Scenes**
```python
# DO: Focus on pure mathematical visualization
equation = MathTex(r"\angle AOB = 2 \angle ACB")
self.play(Write(equation))

# DON'T: Add text explanations (WebSlides handles that)
title = Text("Angle at Centre Theorem")  # ❌ Don't do this
```

### 3. **Chapter Duration**
```
✅ 30-60 seconds per chapter (optimal for learning)
❌ 2-3 minutes per chapter (too long, students lose focus)
```

### 4. **Content Types**
```
Math content     → Use 'math' (Manim animation)
Explanatory      → Use 'visual' (Gemini image)
Definitions      → Use 'text' (gradient background)
Complex concepts → Use 'mixed' (Gemini + overlay text)
```

## Cost Estimation

**Per 5-chapter course (5 minutes total):**

| Component | Usage | Cost |
|-----------|-------|------|
| Claude (structure) | 1 request (~1K tokens) | $0.003 |
| Whisper (transcription) | 1 minute audio | $0.006 |
| Gemini Images | 3 images | $0.12 |
| Manim | 2 animations | FREE |
| Remotion | 1 video | FREE |
| **TOTAL** | | **~$0.13** |

Compare to traditional production: $500-$5,000 per course

## Summary

You now have a **complete voice-driven course creation system** that:

✅ Accepts voice or text input
✅ Generates course structure with Claude
✅ Creates professional Manim math animations
✅ Generates and allows review/replacement of images
✅ Composes final video with WebSlides + Remotion
✅ Costs ~$0.13 per 5-minute course
✅ Produces professional, engaging educational content

**Frontend:** http://localhost:3000/course-creator
**Backend:** http://localhost:3001/api/course-creator/*

All existing pipework is utilized - no duplication!
