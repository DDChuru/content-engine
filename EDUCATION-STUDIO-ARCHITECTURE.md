# Educational Content Studio - Frontend Architecture

## Overview

A comprehensive web interface for managing educational content creation, from lesson planning to video rendering. Built with Next.js, React, and TypeScript, following the design patterns from video-studio.

## Design Principles

### Visual Design
- **Glass morphism dark theme** with frosted glass panels
- **Gradient accents** (primary: #6366f1, accent: #ec4899)
- **Smooth animations** using Framer Motion
- **Responsive grid layouts** with card-based components
- **Lucide React icons** for consistent iconography

### User Experience
- **No terminal jumping** - All operations accessible from UI
- **Real-time feedback** - Live status updates and progress bars
- **Integrated workflows** - Seamless transitions between build → studio → render → view
- **Smart defaults** - Pre-configured settings for common workflows

## Application Structure

```
packages/frontend/app/
├── education/
│   ├── page.tsx                          # Dashboard (home)
│   ├── layout.tsx                        # Education layout with sidebar
│   ├── lessons/
│   │   ├── page.tsx                      # All lessons list
│   │   ├── new/
│   │   │   └── page.tsx                  # Create new lesson
│   │   └── [lessonId]/
│   │       ├── page.tsx                  # Lesson overview
│   │       ├── edit/
│   │       │   └── page.tsx              # Edit lesson content
│   │       ├── studio/
│   │       │   └── page.tsx              # Remotion Studio integration
│   │       └── notes/
│   │           └── page.tsx              # View lesson notes & questions
│   ├── render/
│   │   └── page.tsx                      # Render queue manager
│   └── settings/
│       └── page.tsx                      # Configuration
│
└── components/
    └── education/
        ├── LessonCard.tsx                # Lesson preview card
        ├── SceneEditor.tsx               # Edit individual scenes
        ├── RenderQueue.tsx               # Render job list
        ├── StudioEmbed.tsx               # Remotion Studio iframe
        ├── LessonTimeline.tsx            # Visual timeline
        ├── ObjectivesEditor.tsx          # Edit learning objectives
        └── QuestionEditor.tsx            # Edit practice questions
```

## Pages & Features

### 1. Dashboard (`/education`)

**Purpose:** Central hub for all educational content operations

**Features:**
- Quick stats (total lessons, render queue, costs)
- Recent lessons grid with thumbnails
- Quick actions (New Lesson, Open Studio, View Renders)
- System status indicators (Manim, Remotion, ElevenLabs)

**UI Components:**
```tsx
<Dashboard>
  <StatsBar lessons={10} rendering={2} cost="$15.23" />
  <QuickActions />
  <RecentLessons limit={6} />
  <SystemStatus manim remotion elevenlabs />
</Dashboard>
```

### 2. Lesson Builder (`/education/lessons/new`)

**Purpose:** Create and configure new lessons

**Features:**
- Topic selection (dropdown with Cambridge IGCSE topics)
- Learning objectives editor (multi-line input with checkmarks)
- Prerequisites input
- Lesson roadmap builder
- Manim scene configuration
- Auto-save drafts

**UI Layout:**
```
┌─────────────────────────────────────────────────────┐
│ Create New Lesson                                   │
│                                                     │
│ ┌─────────────────┐  ┌────────────────────────────┐│
│ │ Topic & Metadata│  │ Live Preview               ││
│ │                 │  │                            ││
│ │ • Topic         │  │  [Branding Slide Preview]  ││
│ │ • Subtitle      │  │                            ││
│ │ • Duration      │  │  Topic: Introduction to... ││
│ │                 │  │  Duration: 3m 15s          ││
│ └─────────────────┘  └────────────────────────────┘│
│                                                     │
│ ┌──────────────────────────────────────────────────┐│
│ │ Learning Objectives (8)                          ││
│ │ ☑ Define what a set is                           ││
│ │ ☑ Write sets using correct notation              ││
│ │ [+ Add objective]                                ││
│ └──────────────────────────────────────────────────┘│
│                                                     │
│ ┌──────────────────────────────────────────────────┐│
│ │ Manim Scenes (8 configured)                      ││
│ │ Scene 1: What is a Set? (8s) [Edit] [Preview]   ││
│ │ Scene 2: Set Notation (7s)    [Edit] [Preview]   ││
│ │ [+ Add scene]                                    ││
│ └──────────────────────────────────────────────────┘│
│                                                     │
│ [Save Draft] [Generate Manim] [Open in Studio] →   │
└─────────────────────────────────────────────────────┘
```

### 3. Remotion Studio (`/education/lessons/[id]/studio`)

**Purpose:** Visual editor for Remotion compositions with live preview

**Features:**
- Embedded Remotion Studio (iframe or direct integration)
- Timeline scrubbing
- Scene duration editing
- Toggle intro/Manim scenes
- Export composition

**Implementation:**
```tsx
<StudioPage lessonId={lessonId}>
  {/* Top controls */}
  <StudioControls>
    <ToggleSwitch label="Show Intro" checked={showIntro} />
    <ToggleSwitch label="Show Manim" checked={showManim} />
    <ToggleSwitch label="Narration" checked={hasAudio} />
    <Button onClick={startRemotionServer}>Open Studio</Button>
  </StudioControls>

  {/* Remotion Studio embed */}
  <StudioEmbed
    port={3000}
    composition="SetsLesson"
    props={{ includeIntro, includeManimScenes }}
  />

  {/* Side panel */}
  <PropertiesPanel>
    <DurationEditor />
    <ColorPicker />
    <FontSelector />
  </PropertiesPanel>
</StudioPage>
```

### 4. Render Manager (`/education/render`)

**Purpose:** Manage render jobs and output files

**Features:**
- Active renders with progress bars
- Render queue
- Completed renders with download links
- Cost tracking per render
- Cancel/retry options

**UI:**
```
┌─────────────────────────────────────────────────────┐
│ Render Queue (2 active, 3 queued)                  │
│                                                     │
│ Active Renders                                     │
│ ┌──────────────────────────────────────────────────┐│
│ │ Sets Lesson (Complete)                           ││
│ │ ████████████████████████░░░░░░ 75% (Frame 4387) ││
│ │ Est. 45s remaining • 1920x1080 • 30fps           ││
│ │ [Cancel]                                         ││
│ └──────────────────────────────────────────────────┘│
│                                                     │
│ Queued                                             │
│ ┌──────────────────────────────────────────────────┐│
│ │ 1. Trigonometry Basics (intro only)              ││
│ │ 2. Algebra Intro (full lesson)                   ││
│ │ [Reorder] [Remove]                               ││
│ └──────────────────────────────────────────────────┘│
│                                                     │
│ Completed (Last 24h)                               │
│ ┌──────────────────────────────────────────────────┐│
│ │ sets-lesson-complete.mp4  13MB  3m 15s  $0.00   ││
│ │ [Play] [Download] [Re-render]                    ││
│ └──────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### 5. Lesson Viewer (`/education/lessons/[id]/notes`)

**Purpose:** View lesson notes, scripts, and interactive questions

**Features:**
- Lesson structure outline
- Narration scripts
- Practice questions
- Mermaid diagrams
- Excalidraw drawings
- Exportable as PDF/Markdown

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ Introduction to Sets - Lesson Notes                │
│                                                     │
│ ┌──────┐  ┌─────────────────────────────────────┐ │
│ │ TOC  │  │ Content                             │ │
│ │      │  │                                     │ │
│ │ 1. ◆ │  │ ## 1. What is a Set?                │ │
│ │ 2. ○ │  │                                     │ │
│ │ 3. ○ │  │ A set is a collection of distinct   │ │
│ │ ...  │  │ objects...                          │ │
│ │      │  │                                     │ │
│ │      │  │ **Narration Script:**               │ │
│ │      │  │ "So, what exactly IS a set?..."     │ │
│ │      │  │                                     │ │
│ │      │  │ **Practice Question:**              │ │
│ │      │  │ Q: Which of the following is a set? │ │
│ │      │  │ □ A. {1, 2, 2, 3}                   │ │
│ │      │  │ ☑ B. {1, 2, 3}                      │ │
│ └──────┘  └─────────────────────────────────────┘ │
│                                                     │
│ [Export as PDF] [Export as Markdown] [Print]       │
└─────────────────────────────────────────────────────┘
```

### 6. Settings (`/education/settings`)

**Purpose:** Configure system settings and API keys

**Features:**
- ElevenLabs API key
- Gemini API key
- Manim configuration (conda env path)
- Remotion settings (port, output path)
- Default lesson settings

## Backend API Routes

### Lesson Management
- `POST /api/education/lessons` - Create new lesson
- `GET /api/education/lessons` - List all lessons
- `GET /api/education/lessons/:id` - Get lesson details
- `PATCH /api/education/lessons/:id` - Update lesson
- `DELETE /api/education/lessons/:id` - Delete lesson

### Manim Operations
- `POST /api/education/manim/generate` - Generate Manim scenes
- `GET /api/education/manim/scenes/:sceneId` - Get scene status
- `GET /api/education/manim/preview/:sceneId` - Preview scene

### Remotion Operations
- `POST /api/education/remotion/start-studio` - Start Remotion Studio server
- `GET /api/education/remotion/status` - Check studio status
- `POST /api/education/remotion/stop-studio` - Stop Remotion Studio server

### Rendering
- `POST /api/education/render/queue` - Add to render queue
- `GET /api/education/render/queue` - Get queue status
- `GET /api/education/render/jobs/:jobId` - Get job status
- `DELETE /api/education/render/jobs/:jobId` - Cancel job

### Content Generation
- `POST /api/education/generate/objectives` - AI-generate learning objectives
- `POST /api/education/generate/questions` - AI-generate practice questions
- `POST /api/education/generate/narration` - Generate narration audio

## State Management

### React Context
```tsx
// EducationContext.tsx
interface EducationContextType {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  renderQueue: RenderJob[];
  studioStatus: 'stopped' | 'starting' | 'running';

  // Actions
  createLesson: (data: LessonData) => Promise<Lesson>;
  updateLesson: (id: string, data: Partial<LessonData>) => Promise<void>;
  generateManimScenes: (lessonId: string) => Promise<void>;
  startStudio: (lessonId: string) => Promise<void>;
  queueRender: (lessonId: string, options: RenderOptions) => Promise<void>;
}
```

### Local Storage
- Draft lessons (auto-save every 30s)
- User preferences (theme, sidebar state)
- Recent lessons (last 10)

## Component Library

### Shared Components

**LessonCard.tsx**
```tsx
interface LessonCardProps {
  lesson: Lesson;
  onEdit: () => void;
  onOpenStudio: () => void;
  onRender: () => void;
}
```

**Timeline.tsx**
```tsx
interface TimelineProps {
  scenes: Scene[];
  currentTime: number;
  onSeek: (time: number) => void;
  onSceneClick: (sceneId: string) => void;
}
```

**RenderProgress.tsx**
```tsx
interface RenderProgressProps {
  job: RenderJob;
  onCancel: () => void;
}
```

## System Integration

### Starting Everything from UI

**One-Click Workflow:**
1. User clicks "Open Studio" on lesson card
2. Frontend checks if Remotion Studio is running (`GET /api/education/remotion/status`)
3. If not running, starts it (`POST /api/education/remotion/start-studio`)
4. Shows loading spinner while studio starts
5. Once ready, opens studio in embedded iframe or new tab
6. User can edit, then click "Render" directly from studio view
7. Render job added to queue, user redirected to Render Manager

**Process Management:**
```typescript
// services/studio-manager.ts
export class StudioManager {
  async ensureRunning(): Promise<string> {
    const status = await this.getStatus();
    if (status === 'running') return this.getUrl();

    await this.start();
    await this.waitForReady();
    return this.getUrl();
  }

  async start(): Promise<void> {
    // POST /api/education/remotion/start-studio
    // Backend runs: npx remotion preview src/remotion/Root.tsx
  }

  async getUrl(): Promise<string> {
    return 'http://localhost:3000'; // Remotion default
  }
}
```

## Technology Stack

### Frontend
- **Next.js 14** - App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Query** - Server state management
- **Zustand** - Client state management

### Backend
- **Express.js** - API server
- **Node.js child_process** - Process management (Manim, Remotion, ffmpeg)
- **Socket.io** - Real-time updates (render progress)

## File Organization

```
packages/frontend/
├── app/
│   ├── education/
│   │   └── [pages as described above]
│   ├── globals.css
│   └── layout.tsx
├── components/
│   └── education/
│       └── [components as described above]
├── lib/
│   ├── api/
│   │   ├── lessons.ts
│   │   ├── manim.ts
│   │   ├── remotion.ts
│   │   └── render.ts
│   ├── hooks/
│   │   ├── useLesson.ts
│   │   ├── useRenderQueue.ts
│   │   └── useStudio.ts
│   └── utils/
│       ├── format.ts
│       └── constants.ts
└── public/
    └── education/
        └── placeholder.png

packages/backend/
├── src/
│   ├── routes/
│   │   └── education.ts          # All education API routes
│   ├── services/
│   │   ├── manim-runner.ts       # Run Manim Python scripts
│   │   ├── remotion-manager.ts   # Manage Remotion Studio process
│   │   └── render-queue.ts       # Render job queue
│   └── index.ts
```

## Development Workflow

1. **Start Development Servers:**
   ```bash
   # Terminal 1: Backend
   cd packages/backend && npm run dev

   # Terminal 2: Frontend
   cd packages/frontend && npm run dev
   ```

2. **Access UI:**
   - Open `http://localhost:3000/education`
   - All operations from there (no more terminal commands!)

3. **Create Lesson:**
   - Click "New Lesson" → Fill form → Click "Generate Manim"
   - Backend runs Manim scripts, returns status
   - Click "Open Studio" → Frontend starts Remotion Studio if needed
   - Edit in studio → Click "Render" → Redirected to Render Manager
   - Download finished video

## Future Enhancements

- **Collaborative Editing** - Multiple users editing same lesson (WebSocket sync)
- **Version Control** - Git-like version history for lessons
- **Template Library** - Pre-built lesson templates
- **Asset Management** - Centralized image/audio library
- **Analytics** - Track student engagement with exported SCORM packages
- **AI Suggestions** - Claude suggests improvements to lesson structure

---

**Status:** Architecture Complete
**Next:** Implement pages and components
**Cost:** $0 (all local development)
