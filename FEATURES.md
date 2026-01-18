# Content Engine - Features & Capabilities

Complete AI-powered video production pipeline for professional training content.

---

## 🎯 Overview

The Content Engine is a comprehensive system for creating professional training videos, combining:
- **AI content generation** (Claude)
- **Programmatic video creation** (Remotion)
- **Live recording** (OBS Studio)
- **Professional diagrams** (Excalidraw)
- **Video editing** (FFmpeg)

---

## 🚀 Core Features

### 1. AI-Powered Content Generation

**Backend System** (`packages/backend/`)

Generate structured training content using Claude AI:

- ✅ **Standard Operating Procedures (SOPs)** - HACCP-compliant procedures
- ✅ **User Manuals** - From GitHub repository analysis
- ✅ **Lessons** - Educational content with exercises
- ✅ **Training Materials** - Complete training modules
- ✅ **Thumbnails** - AI-generated images (Gemini)

**Capabilities:**
- Analyze GitHub repositories and extract user journeys
- Generate HACCP-compliant documentation
- Create structured educational content
- Automatic thumbnail generation
- Firebase storage integration

**API Endpoints:**
```
POST /api/generate/user-manual
POST /api/generate/sop
POST /api/generate/lesson
POST /api/generate/training
POST /api/generate/thumbnail
POST /api/chat  (interactive)
```

---

### 2. Presentation Studio

**Location:** `presentation-studio/`

Interactive presentation system with annotation tools:

**Features:**
- ✅ **Live Annotations** - Draw, highlight, annotate during recording
- ✅ **Drawing Tools** - Pen, highlighter, arrow, circle, eraser
- ✅ **Keyboard Shortcuts** - Quick access to all tools
- ✅ **OBS Integration** - Record presentations with annotations
- ✅ **Fabric.js Canvas** - Smooth drawing overlay
- ✅ **Reveal.js Slides** - Professional slide framework

**Annotation Tools:**
- **Pen** (Key: 1) - Freehand drawing
- **Highlighter** (Key: 2) - Semi-transparent highlighting
- **Arrow** (Key: 3) - Point to important elements
- **Circle** (Key: 4) - Highlight areas
- **Eraser** (Key: 5) - Remove annotations

**Keyboard Shortcuts:**
- `A` - Toggle annotation mode
- `1-5` - Select tools
- `C` - Clear all
- `Z` - Undo
- `S` - Save annotations
- `H` - Hide/show toolbar
- `?` - Show help

---

### 3. Remotion Video Generation

**Location:** `remotion-branding/`

Programmatic video creation with React:

**Components:**
- ✅ **Branded Intro** - Professional 3-second intro with animations
- ✅ **Branded Outro** - 5-second outro with call-to-action
- ✅ **Custom Compositions** - Create any video programmatically
- ✅ **Image Support** - Logos, backgrounds, diagrams
- ✅ **Animation System** - Spring animations, interpolations

**Features:**
- Smooth spring-based animations
- Customizable colors and branding
- Logo/image integration
- Social media handles
- Background music support
- Export to MP4 (1920x1080, 30fps)

**Compositions:**
- `Intro` - Default branded intro
- `Outro` - Default branded outro
- `IntroWithImage` - Intro with custom logo/background
- `SOPIntro` - SOP-specific intro
- `TrainingOutro` - Training-specific outro

**Usage:**
```bash
cd remotion-branding
npm start              # Preview
npm run render:intro   # Render intro
npm run render:outro   # Render outro
```

---

### 4. Excalidraw Integration

**Location:** `presentation-studio/assets/diagrams/`

Professional hand-drawn style diagrams:

**Features:**
- ✅ **Perfect Hand-Drawn Style** - Professional but sketchy look
- ✅ **Export to SVG** - Use in presentations and videos
- ✅ **Reusable Components** - Build diagram library
- ✅ **Fragment Reveals** - Animate diagrams appearing
- ✅ **"Build Backwards"** - Pre-create, reveal during recording

**Workflow:**
1. Create diagram at https://excalidraw.com
2. Export as SVG
3. Save to `assets/diagrams/`
4. Add to presentation as `<img class="fragment" />`
5. Record - click to reveal smoothly

**Benefits:**
- No more rough mouse drawings
- Consistent professional style
- Editable and reusable
- Perfect for complex diagrams

**Integration:**
- Works with Remotion (programmatic videos)
- Works with Reveal.js (OBS recording)
- Can be AI-generated via backend

---

### 5. OBS Recording Workflow

**Setup:** `presentation-studio/prototype/OBS-SETUP-GUIDE.md`

Professional recording with OBS Studio:

**Features:**
- ✅ **Window Capture** - Record browser presentations
- ✅ **Annotation Overlay** - Live drawing during recording
- ✅ **Microphone Audio** - Add voiceover
- ✅ **1920x1080 Output** - Full HD quality
- ✅ **MP4 Format** - Ready for YouTube

**Recording Setup:**
- Resolution: 1920x1080
- Frame Rate: 30 FPS
- Format: MP4 (x264)
- Audio: Microphone + optional background music

**Workflow:**
1. Open presentation in browser
2. OBS: Window Capture
3. Press `A` to enable annotations
4. Navigate slides and annotate
5. Record with voiceover
6. Export to `recordings/`

---

### 6. Complete Video Pipeline

**Full Production Stack:**

```
1. CONTENT GENERATION (AI Backend)
   └─ Claude generates: slides, scripts, structure

2. VISUAL CREATION (Multiple sources)
   ├─ Remotion: Intro/outro/diagrams (programmatic)
   ├─ Excalidraw: Professional diagrams (hand-drawn style)
   ├─ OBS: Live presentations (your voice + annotations)
   └─ Screen recordings: Software demos

3. VIDEO EDITING (FFmpeg)
   ├─ Cut unwanted parts
   ├─ Join all segments
   ├─ Add transitions
   ├─ Normalize audio
   └─ Color correction

4. FINAL OUTPUT
   └─ Professional training video ready for YouTube
```

**Example Video Structure:**
```
00:00-00:03  Remotion intro (branded)
00:03-02:00  OBS presentation (you teaching)
02:00-03:00  Remotion diagram (animated)
03:00-06:00  OBS demo (live walkthrough)
06:00-07:00  Screen recording (software)
07:00-09:00  OBS Q&A (your expertise)
09:00-09:30  Remotion summary (key points)
09:30-10:00  Remotion outro (CTA)
```

---

### 7. Video Editing Tools

**FFmpeg Integration:**

**Capabilities:**
- ✅ **Cut/Trim** - Remove unwanted sections
- ✅ **Join/Concatenate** - Combine multiple segments
- ✅ **Add Transitions** - Fade, wipe, crossfade
- ✅ **Audio Mixing** - Background music, normalize levels
- ✅ **Color Correction** - Adjust brightness, contrast
- ✅ **Add Subtitles** - Accessibility
- ✅ **Watermarks** - Brand logo overlay
- ✅ **Multiple Formats** - Export for different platforms

**Common Operations:**
```bash
# Trim video
ffmpeg -i video.mp4 -ss 00:00:10 -to 00:02:30 trimmed.mp4

# Join segments
ffmpeg -f concat -i segments.txt -c copy final.mp4

# Add background music
ffmpeg -i video.mp4 -i music.mp3 -filter_complex "[1:a]volume=0.1[music];[0:a][music]amix" output.mp4

# Normalize audio
ffmpeg -i video.mp4 -af "loudnorm=I=-16" normalized.mp4
```

---

## 🎨 Image & Visual Assets

### Remotion Image Support

**Location:** `remotion-branding/public/images/`

**Folder Structure:**
```
public/images/
├── logos/         Company logos (PNG/SVG)
├── backgrounds/   Background images (JPG/PNG)
├── diagrams/      Process diagrams (SVG/PNG)
└── icons/         Icons and small graphics (SVG)
```

**Features:**
- ✅ Support for PNG, JPG, SVG, WebP, GIF
- ✅ Local files or URLs
- ✅ Animated entrance (fade, zoom, slide)
- ✅ Programmatic animations
- ✅ Layer multiple images

**Usage in Remotion:**
```tsx
import { Img, staticFile } from 'remotion';

<Img src={staticFile('images/logos/logo.png')} />
```

---

### Excalidraw Diagrams

**Location:** `presentation-studio/assets/diagrams/`

**Folder Structure:**
```
assets/diagrams/
├── process-flows/   Flowcharts, process diagrams
├── annotations/     Arrows, circles, highlights
└── icons/          Icons and small graphics
```

**Features:**
- ✅ Hand-drawn professional style
- ✅ Export as SVG (scalable, small file size)
- ✅ Reusable across presentations
- ✅ Editable source files
- ✅ Consistent branding

---

## 🎯 Professional Workflows

### Workflow 1: OBS Live Recording (Fastest)

**Use Case:** Regular tutorial content, personal teaching

**Process:**
1. Generate slides with AI backend
2. Open in browser
3. Record yourself presenting with OBS
4. Add annotations in real-time
5. Export video

**Time:** 1-2 hours per video
**Quality:** Good, authentic
**Scalability:** Low (one at a time)

---

### Workflow 2: Hybrid (Professional)

**Use Case:** Professional training series, YouTube content

**Process:**
1. AI generates content structure
2. Create diagrams in Excalidraw
3. Remotion renders intro/outro
4. Record main content with OBS
5. FFmpeg combines everything

**Time:** 2-3 hours per video
**Quality:** Excellent, polished
**Scalability:** Medium (templates reusable)

---

### Workflow 3: Fully Automated (Scale)

**Use Case:** Batch creating 50+ training videos

**Process:**
1. AI generates all content
2. Remotion renders everything programmatically
3. TTS adds voiceover
4. FFmpeg auto-combines
5. Batch export overnight

**Time:** 30 minutes per video (mostly automated)
**Quality:** Consistent, professional
**Scalability:** Very high (100+ videos)

---

## 🔧 Technical Stack

### Backend
- **Node.js** + Express
- **TypeScript**
- **Claude AI API** (content generation)
- **Google Gemini API** (image generation)
- **Firebase Admin** (storage)
- **Simple Git** (repository cloning)

### Frontend/Presentation
- **Reveal.js** (slide framework)
- **Fabric.js** (annotation canvas)
- **React** (Remotion components)
- **HTML5 Canvas** (drawing)

### Video Production
- **Remotion** (programmatic video)
- **OBS Studio** (screen recording)
- **FFmpeg** (video editing)
- **Excalidraw** (diagrams)

### Storage
- **Firebase Storage** (generated content)
- **Firestore** (metadata)
- **Local filesystem** (recordings)

---

## 📊 Content Types Supported

### 1. Standard Operating Procedures (SOPs)
- HACCP-compliant format
- Step-by-step procedures
- Safety warnings
- Quality checkpoints
- Structured HTML output

### 2. User Manuals
- GitHub repository analysis
- Component documentation
- Feature walkthroughs
- API documentation
- Screenshot integration

### 3. Educational Lessons
- Learning objectives
- Exercises and activities
- Visual aids
- Assessments
- Progress tracking

### 4. Training Materials
- Onboarding content
- Skill development
- Compliance training
- Safety procedures
- Best practices

---

## 🎨 Customization Options

### Remotion Branding
- **Brand Colors** - Customize gradient colors
- **Logos** - Add company logo
- **Fonts** - Custom typography
- **Animations** - Adjust timing and effects
- **Social Links** - YouTube, Twitter, Website

### Presentation Themes
- **Color Schemes** - Multiple theme options
- **Layouts** - Various slide templates
- **Fonts** - Typography customization
- **Backgrounds** - Custom images or gradients

### Export Formats
- **YouTube** - High quality (CRF 18)
- **Social Media** - Compressed (720p)
- **Internal** - Balanced quality
- **Custom** - Any resolution/bitrate

---

## 📁 Project Structure

```
content-engine/
├── packages/
│   ├── backend/              Backend API server
│   │   ├── src/
│   │   │   ├── agents/       AI agents (user journey)
│   │   │   ├── routes/       API endpoints
│   │   │   ├── services/     Core services
│   │   │   └── config/       Configuration
│   │   └── package.json
│   └── shared/               Shared types
│
├── remotion-branding/        Remotion video templates
│   ├── src/
│   │   ├── Intro.tsx         Intro component
│   │   ├── Outro.tsx         Outro component
│   │   ├── IntroWithImage.tsx  Custom intro
│   │   └── Root.tsx          Compositions
│   ├── public/images/        Image assets
│   └── package.json
│
├── presentation-studio/      Presentation & recording
│   ├── prototype/            HTML presentations
│   │   ├── final.html        Complete annotation system
│   │   ├── excalidraw-example.html  Diagram integration
│   │   └── OBS-SETUP-GUIDE.md
│   ├── assets/diagrams/      Excalidraw exports
│   └── recordings/           OBS output videos
│
├── scripts/                  Helper scripts
│   └── generate-content.sh   Content generation CLI
│
├── FEATURES.md              This file
├── DEPLOYMENT-GUIDE.md       Backend deployment
├── COMPLETE-VIDEO-PIPELINE.md  Full workflow
├── REMOTION-INTEGRATION.md   Remotion details
└── README.md                 Project overview
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd packages/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add: ANTHROPIC_API_KEY, GEMINI_API_KEY, FIREBASE_*

# Start server
npm run dev
# Running on http://localhost:3001
```

### 2. Remotion Setup

```bash
cd remotion-branding

# Install dependencies
npm install

# Preview templates
npm start
# Opens Remotion Studio

# Render intro/outro
npm run render:all
```

### 3. OBS Setup

1. Install OBS Studio
2. Add Browser Source or Window Capture
3. Configure microphone
4. Set output folder to `presentation-studio/recordings/`

### 4. Create First Video

```bash
# 1. Generate content
./scripts/generate-content.sh sop "Temperature Monitoring"

# 2. Open presentation
xdg-open presentation-studio/generated/sop-*.html

# 3. Record with OBS
# 4. Done!
```

---

## 📊 Performance & Scalability

### Backend API
- **Response Time:** 10-60 seconds (AI generation)
- **Concurrent Requests:** Supports multiple
- **Rate Limits:** Based on Claude/Gemini API limits
- **Caching:** Repository clones cached locally

### Video Rendering
- **Remotion:** ~10-30 seconds per composition
- **OBS Recording:** Real-time (1x speed)
- **FFmpeg Processing:** 2-5x speed (depends on CPU)

### Storage
- **Generated HTML:** ~50-200KB per file
- **Videos:** ~370MB per 10 minutes (5000 Kbps)
- **Diagrams (SVG):** ~10-50KB each
- **Thumbnails:** ~100-500KB (PNG)

---

## 🔐 Security & Privacy

### API Keys
- Stored in `.env` (not in git)
- Backend only (never exposed to client)
- Firebase service account (secure)

### Generated Content
- Stored in Firebase (private by default)
- Can be made public via URLs
- Access control configurable

### Local Files
- Recordings stored locally only
- Can upload to cloud after review
- Full control over data

---

## 🎯 Use Cases

### Educational Institutions
- Course content creation
- Student tutorials
- Lab demonstrations
- Online learning materials

### Corporate Training
- Employee onboarding
- Compliance training
- Software tutorials
- Best practice guides

### YouTube Creators
- Tutorial series
- Tech explanations
- How-to videos
- Educational content

### SaaS Companies
- Product demos
- Feature walkthroughs
- User onboarding
- Support documentation

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Text-to-Speech integration (ElevenLabs)
- [ ] Automatic subtitle generation (Whisper AI)
- [ ] AI avatar narration (Synthesia)
- [ ] Multi-language support
- [ ] Batch video generation
- [ ] Analytics integration
- [ ] Cloud rendering (Remotion Lambda)
- [ ] Collaborative editing

### Potential Integrations
- [ ] Notion (content source)
- [ ] Google Docs (script writing)
- [ ] Slack (notifications)
- [ ] GitHub Actions (CI/CD)
- [ ] YouTube API (auto-upload)

---

## 📚 Documentation

### Quick Starts
- `GETTING-STARTED.md` - Initial setup
- `EXCALIDRAW-QUICKSTART.md` - Diagram creation
- `remotion-branding/GETTING-STARTED.md` - Remotion basics

### Comprehensive Guides
- `COMPLETE-VIDEO-PIPELINE.md` - Full workflow
- `DEPLOYMENT-GUIDE.md` - Backend deployment
- `REMOTION-INTEGRATION.md` - Advanced Remotion
- `EXCALIDRAW-INTEGRATION.md` - Diagram workflows
- `SMOOTH-HANDWRITING-SOLUTIONS.md` - Annotation tips

### API Documentation
- `packages/backend/README.md` - API endpoints
- OpenAPI spec (coming soon)

---

## 💡 Key Innovations

### 1. "Build Backwards" Workflow
Pre-create perfect annotations, reveal during recording - looks live but polished!

### 2. Hybrid Pipeline
Mix AI-generated, programmatic, and live content for best results.

### 3. Excalidraw Integration
Professional hand-drawn style without the rough edges.

### 4. Modular Architecture
Use just what you need - full automation or manual control.

### 5. Multi-Format Output
One source → YouTube, social media, internal training.

---

## 🎓 Learning Resources

### Official Docs
- Remotion: https://remotion.dev/docs
- Reveal.js: https://revealjs.com
- Excalidraw: https://excalidraw.com
- OBS Studio: https://obsproject.com/wiki
- FFmpeg: https://ffmpeg.org/documentation.html

### Tutorials
- See `/examples` folder for working scripts
- Live demos in `presentation-studio/prototype/`

---

## 🤝 Contributing

### Areas for Contribution
- Additional Remotion templates
- Presentation themes
- Excalidraw component libraries
- Video transition effects
- Documentation improvements

---

## 📞 Support

### Documentation
- Read guides in project root
- Check examples in each module
- Review inline code comments

### Community
- GitHub Issues for bugs
- Discussions for questions
- PRs welcome!

---

## 🎉 Summary

**Content Engine provides:**

✅ **AI-powered content generation** - No more manual writing
✅ **Professional video branding** - Remotion intro/outro
✅ **Smooth annotation tools** - OBS + Excalidraw
✅ **Complete editing pipeline** - FFmpeg automation
✅ **Scalable workflows** - From 1 video to 1000+
✅ **Full customization** - Your brand, your style
✅ **Open source stack** - No vendor lock-in

**Perfect for:**
- Educational content creators
- Corporate trainers
- YouTube educators
- SaaS companies
- Anyone creating training videos at scale

---

**Ready to create professional training videos?**

Start with: `GETTING-STARTED.md`

🚀 Happy Creating!
