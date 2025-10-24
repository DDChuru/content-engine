# Next Steps: Remotion Integration + Frontend Application

**Current Status:** ✅ Backend pipeline working (Manim + Voice + Gemini)
**Next Goal:** Complete video composition + User-friendly frontend

---

## Phase 1: Remotion Integration (Backend)

### What Remotion Does:
- Combines multiple scenes into one video
- Adds transitions between scenes
- Syncs audio with visuals
- Renders final MP4

### Architecture Update:

**OLD (Current):**
```
Backend generates:
├── scene_1.mp3 (audio only)
├── scene_2.mp4 (video only, no audio)
├── scene_3.mp4 (video only, no audio)
└── image_1.png (static image)
```

**NEW (With Remotion):**
```
Backend generates scenes → Remotion combines → final_video.mp4
├── Scene 1: image_1.png + scene_1.mp3 (10s)
├── Transition (fade, 1s)
├── Scene 2: scene_2.mp4 + scene_2.mp3 (25s)
├── Transition (fade, 1s)
└── Scene 3: scene_3.mp4 + scene_3.mp3 (20s)
= Final: complete_lesson.mp4 (57s total)
```

### Implementation Plan:

#### 1. Install Remotion in Backend
```bash
cd packages/backend
npm install remotion @remotion/cli @remotion/lambda
```

#### 2. Create Remotion Composition
**File:** `packages/backend/src/remotion/compositions/EducationalLesson.tsx`

```typescript
import { Composition } from 'remotion';
import { SceneSequence } from './SceneSequence';

export const RemotionRoot = () => {
  return (
    <Composition
      id="EducationalLesson"
      component={SceneSequence}
      durationInFrames={1650} // 55 seconds @ 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

#### 3. Scene Sequence Component
**File:** `packages/backend/src/remotion/compositions/SceneSequence.tsx`

```typescript
import { AbsoluteFill, Audio, Img, Video, Sequence } from 'remotion';

export const SceneSequence = ({ scenes }) => {
  return (
    <AbsoluteFill>
      {/* Scene 1: Static Image + Audio */}
      <Sequence from={0} durationInFrames={300}>
        <Img src={scenes[0].visual} />
        <Audio src={scenes[0].audio} />
      </Sequence>

      {/* Transition */}
      <Sequence from={300} durationInFrames={30}>
        <FadeTransition />
      </Sequence>

      {/* Scene 2: Manim Video + Audio */}
      <Sequence from={330} durationInFrames={750}>
        <Video src={scenes[1].visual} />
        <Audio src={scenes[1].audio} />
      </Sequence>

      {/* Continue for all scenes... */}
    </AbsoluteFill>
  );
};
```

#### 4. Remotion Service
**File:** `packages/backend/src/services/remotion-renderer.ts`

```typescript
export class RemotionRenderer {
  async renderVideo(scenes: Scene[]): Promise<string> {
    // 1. Write composition config
    const config = this.createConfig(scenes);

    // 2. Call Remotion CLI
    const outputPath = `output/education/videos/final_${Date.now()}.mp4`;
    await this.executeRemotion(config, outputPath);

    // 3. Return final video path
    return outputPath;
  }
}
```

#### 5. Update API Route
**Add to:** `packages/backend/src/routes/education.ts`

```typescript
router.post('/render-final-video', async (req, res) => {
  const { scenes } = req.body;

  const remotionRenderer = new RemotionRenderer();
  const finalVideoPath = await remotionRenderer.renderVideo(scenes);

  res.json({
    success: true,
    videoPath: finalVideoPath
  });
});
```

---

## Phase 2: Content Strategy Update

### Revised Content Generation Rules:

#### Use Manim For:
✅ **ALL mathematical content:**
- Formulas and equations
- Geometric diagrams
- Circle theorems
- Differentiation graphs
- Proofs and constructions
- Worked examples
- Step-by-step solutions

#### Use Remotion For:
✅ **Composition and presentation:**
- Title slides (text-only, no Gemini)
- Transitions between scenes
- Progress indicators
- Section headers
- Credits/outro

#### Use Gemini Images For:
✅ **Thumbnails ONLY:**
- Module thumbnails (no text)
- Course preview images (minimal text)
- Background patterns/textures

❌ **NEVER use Gemini for:**
- Mathematical formulas
- Diagrams with labels
- Explanatory text
- Anything requiring precise spelling

### Example Module Structure:

```typescript
{
  title: "Circle Theorem: Angle at Centre",
  scenes: [
    {
      type: 'title',        // Remotion text slide
      title: "Angle at Centre",
      subtitle: "Circle Theorem #4",
      duration: 5
    },
    {
      type: 'manim',        // Theorem proof
      concept: 'Angle at Centre Theorem',
      narration: "The angle at centre is twice...",
      duration: 25
    },
    {
      type: 'manim',        // Worked example
      concept: 'Worked Example',
      narration: "Let's apply this...",
      duration: 20
    },
    {
      type: 'title',        // Remotion outro
      title: "Well Done!",
      subtitle: "Next: Tangent Properties",
      duration: 5
    }
  ],
  thumbnail: 'gemini'     // Only for course listing
}
```

---

## Phase 3: Frontend Application

### Tech Stack:
- **Framework:** Next.js 14 (already in packages/frontend)
- **UI:** Tailwind CSS + shadcn/ui
- **State:** React Query for API calls
- **Video Player:** video.js or react-player

### Frontend Features:

#### 1. Module Generator Page
**Route:** `/generate`

```
┌────────────────────────────────────────┐
│  Create Educational Module             │
├────────────────────────────────────────┤
│                                        │
│  Module Title: [_________________]     │
│                                        │
│  Topic: [Cambridge IGCSE 0580 ▼]      │
│                                        │
│  ┌──────────────────────────────┐     │
│  │ Scene 1: Introduction        │     │
│  │ Type: [Manim Title ▼]        │     │
│  │ Duration: [5s]               │     │
│  │ Narration: [____________]    │     │
│  └──────────────────────────────┘     │
│                                        │
│  [+ Add Scene]                         │
│                                        │
│  Voice: [Dachu (Your Voice) ▼]        │
│                                        │
│  [Preview] [Generate Module]           │
│                                        │
└────────────────────────────────────────┘
```

#### 2. Module Library
**Route:** `/modules`

```
┌────────────────────────────────────────┐
│  Educational Modules                   │
├────────────────────────────────────────┤
│                                        │
│  ┌────────────────┐ ┌────────────────┐│
│  │ [Thumbnail]    │ │ [Thumbnail]    ││
│  │ Angle at       │ │ Tangent        ││
│  │ Centre         │ │ Properties     ││
│  │                │ │                ││
│  │ 55s | $0.24    │ │ 45s | $0.22    ││
│  │ [View] [Edit]  │ │ [View] [Edit]  ││
│  └────────────────┘ └────────────────┘│
│                                        │
└────────────────────────────────────────┘
```

#### 3. Video Preview
**Route:** `/modules/:id`

```
┌────────────────────────────────────────┐
│  Angle at Centre Theorem               │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  │      Video Player                │ │
│  │      (final_video.mp4)           │ │
│  │                                  │ │
│  │  ▶  ━━━━━━●━━━━  00:32 / 00:55  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Scenes:                               │
│  1. Introduction (0:00 - 0:05)         │
│  2. Theorem Proof (0:05 - 0:30)        │
│  3. Worked Example (0:30 - 0:50)       │
│  4. Summary (0:50 - 0:55)              │
│                                        │
│  [Download MP4] [Export SCORM]         │
│  [Regenerate] [Delete]                 │
│                                        │
└────────────────────────────────────────┘
```

#### 4. Voice Management
**Route:** `/voices`

```
┌────────────────────────────────────────┐
│  Voice Library                         │
├────────────────────────────────────────┤
│                                        │
│  Your Cloned Voices:                   │
│  ┌──────────────────────────────────┐ │
│  │ 🎙️ Dachu (Default)              │ │
│  │ Quality: Professional             │ │
│  │ Used in: 5 modules                │ │
│  │ [Test Voice] [Set as Default]     │ │
│  └──────────────────────────────────┘ │
│                                        │
│  [+ Clone New Voice]                   │
│                                        │
│  Available Premade Voices:             │
│  - Sarah (Professional Female)         │
│  - George (Professional Male)          │
│  - ...                                 │
│                                        │
└────────────────────────────────────────┘
```

#### 5. Analytics Dashboard
**Route:** `/dashboard`

```
┌────────────────────────────────────────┐
│  Content Analytics                     │
├────────────────────────────────────────┤
│                                        │
│  Total Modules: 12                     │
│  Total Duration: 8m 45s                │
│  Total Cost: $2.88                     │
│                                        │
│  ┌────────────────────────────────┐   │
│  │  Cost Breakdown (Last 30 days) │   │
│  │  ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐       │   │
│  │  │ │ │ │█│█│█│█│ │ │ │ │       │   │
│  │  └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘       │   │
│  │  Manim: $0.00 (FREE)            │   │
│  │  Voice: $2.35                   │   │
│  │  Images: $0.53                  │   │
│  └────────────────────────────────┘   │
│                                        │
└────────────────────────────────────────┘
```

---

## Phase 4: Implementation Order

### Week 1: Remotion Integration
- [x] Backend Manim + Voice working
- [ ] Install Remotion
- [ ] Create basic composition
- [ ] Add scene sequencing
- [ ] Add transitions
- [ ] Test final video output

### Week 2: Content Strategy
- [ ] Remove Gemini from explanatory scenes
- [ ] Use Manim for all math content
- [ ] Create Remotion title slides
- [ ] Generate thumbnail images with Gemini

### Week 3: Frontend - Module Generator
- [ ] Create module creation form
- [ ] Connect to backend API
- [ ] Real-time preview
- [ ] Scene editor
- [ ] Voice selector

### Week 4: Frontend - Module Library
- [ ] Module listing page
- [ ] Video preview player
- [ ] Download/export features
- [ ] Module editing
- [ ] Bulk operations

### Week 5: Frontend - Voice & Analytics
- [ ] Voice management page
- [ ] Voice cloning UI
- [ ] Analytics dashboard
- [ ] Cost tracking
- [ ] Usage reports

### Week 6: SCORM Export
- [ ] SCORM manifest generator
- [ ] LMS tracking integration
- [ ] Package bundler
- [ ] Test in Moodle/Canvas

---

## Updated Module Generation Flow:

**User Journey:**

1. **Frontend:** User clicks "Create Module"
2. **Frontend:** User fills in module details (title, scenes, narration)
3. **Frontend → Backend:** POST `/api/education/generate-module`
4. **Backend:** Generate scenes:
   - Manim animations (math content)
   - Title slides (Remotion text)
   - Voice narration (ElevenLabs)
5. **Backend:** Remotion combines all scenes
6. **Backend → Frontend:** Return final video URL
7. **Frontend:** Display video player + download options

---

## File Structure:

```
educational-content/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   │   ├── manim-renderer.ts      ✅ (Working)
│   │   │   │   ├── voice-cloning.ts       ✅ (Working)
│   │   │   │   └── remotion-renderer.ts   🔜 (Next)
│   │   │   ├── remotion/
│   │   │   │   ├── compositions/
│   │   │   │   │   ├── EducationalLesson.tsx
│   │   │   │   │   ├── SceneSequence.tsx
│   │   │   │   │   ├── TitleSlide.tsx
│   │   │   │   │   └── Transition.tsx
│   │   │   ├── routes/
│   │   │   │   └── education.ts           ✅ (Working)
│   │   │   └── agents/
│   │   │       └── education/
│   │   │           └── video-generator.ts ✅ (Working)
│   │   └── output/
│   │       └── education/
│   │           ├── audio/                 ✅
│   │           ├── images/                ✅
│   │           └── videos/                🔜 (Final videos)
│   │
│   └── frontend/
│       ├── app/
│       │   ├── generate/
│       │   │   └── page.tsx              🔜 (Module Generator)
│       │   ├── modules/
│       │   │   ├── page.tsx              🔜 (Module Library)
│       │   │   └── [id]/
│       │   │       └── page.tsx          🔜 (Video Preview)
│       │   ├── voices/
│       │   │   └── page.tsx              🔜 (Voice Management)
│       │   └── dashboard/
│       │       └── page.tsx              🔜 (Analytics)
│       └── components/
│           ├── ModuleForm.tsx
│           ├── VideoPlayer.tsx
│           ├── SceneEditor.tsx
│           └── VoiceSelector.tsx
```

---

## Key Decisions:

### ✅ Use Manim for ALL Math Content
- Precise, professional, no spelling errors
- Full control over formulas and diagrams
- 3Blue1Brown quality
- FREE (local rendering)

### ✅ Use Remotion for Composition
- Combine scenes seamlessly
- Professional transitions
- Title slides with precise text
- Full React component control

### ✅ Use Gemini ONLY for Thumbnails
- No text/formulas
- Just visual aesthetics
- Module preview images
- Course listings

### ✅ Build User-Friendly Frontend
- No code required for teachers
- Visual module builder
- Real-time preview
- Easy export to SCORM

---

## Success Metrics:

**By End of Implementation:**
- ✅ Teachers can create modules without coding
- ✅ Final videos are single MP4 files (not separate assets)
- ✅ All math content uses Manim (no text in Gemini images)
- ✅ Cost remains under $0.30 per module
- ✅ SCORM export works in Moodle/Canvas
- ✅ Generation time under 2 minutes per module

---

## Next Immediate Steps:

1. **Remotion Integration** (this week)
   - Install Remotion
   - Create basic composition
   - Test combining 3 scenes
   - Output final video

2. **Content Strategy** (next week)
   - Remove Gemini from explanatory content
   - Use Manim for everything mathematical
   - Create Remotion text slides

3. **Frontend** (following weeks)
   - Module generator UI
   - Video preview
   - Voice management
   - Analytics dashboard

**Ready to start with Remotion integration?**
