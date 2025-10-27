# Educational Content Production Pipeline

**From Syllabus Import to SCORM Deployment**

---

## Overview

This document describes the **complete production pipeline** for generating Cambridge IGCSE educational content using the specialized agent system.

**Pipeline flow:**
```
Cambridge Syllabus (JSON/PDF)
    ↓
Firestore (structured topics)
    ↓
Agent Orchestrator (routes to specialists)
    ↓
Domain Agents (generate content)
    ↓
Manim + D3 + ElevenLabs (render)
    ↓
Remotion (compose video)
    ↓
SCORM Package (deploy to LMS)
```

---

## Phase 1: Syllabus Import ✅ COMPLETE

### Input
- Cambridge IGCSE syllabus JSON (e.g., `data/cambridge-igcse-0580-sample.json`)
- Or PDF syllabus (future: Gemini Vision extraction)

### Process

**Step 1: Validate structure**
```bash
cd packages/backend
npm run validate-syllabus ./data/cambridge-igcse-0580-sample.json
```

Output:
```
✓ Loaded: Cambridge IGCSE Mathematics 0580
  - Topics: 3
  - Core subtopics: 4
  - Extended subtopics: 5

💰 Cost Estimation:
  - Topics to generate: 6
  - Estimated cost per topic: $1.06
  - Total estimated cost: $6.36
```

**Step 2: Import to Firestore**
```bash
npm run import-syllabus ./data/cambridge-igcse-0580-sample.json
```

### Output (Firestore structure)
```
syllabi/
  cambridge-igcse-maths-0580/
    - syllabusId, title, subject, curriculum
    - metadata: { examBoard, code, levels, assessmentInfo }

    units/
      c1-number/
        - unitId, title, estimatedDuration, difficulty
        - learningOutcomes: [...]

        topics/
          c11-types-of-number/
            - topicId: "c11"
            - title: "Types of number"
            - learningObjectives: [...]
            - status: "draft"
            - content: { conceptsGenerated: false }

          c12-sets/
            - topicId: "c12"
            - title: "Sets"  ⭐ THIS IS WHERE SETS AGENT COMES IN
            - learningObjectives: ["Use language, notation and Venn diagrams"]
            - metadata: { notation: ["∈", "∉", "∪", "∩"], examples: [...] }
```

**Status:** ✅ Working and tested

---

## Phase 2: Content Generation (CURRENT FOCUS)

### Architecture: Specialized Agents

**Problem we solved:**
- 99 Cambridge topics → 49,500 lines in CLAUDE.md → Context window exceeded ✗

**Solution we built:**
- AgentOrchestrator routes tasks → Domain-specific agents
- Each agent has focused 500-line CONTEXT.md
- **99× reduction in context usage!** ✓

### Example: Sets Topic Generation

**Input:** Firestore topic document
```javascript
{
  topicId: "c12",
  title: "Sets",
  learningObjectives: [
    "Use language, notation and Venn diagrams to describe sets",
    "Use sets and Venn diagrams to solve problems"
  ],
  metadata: {
    notation: ["∈", "∉", "∪", "∩", "⊆", "⊇", "∅", "ξ"],
    examples: [
      "A = {1, 2, 3, 4, 5}",
      "B = {4, 5, 6, 7, 8}"
    ]
  }
}
```

**Process:**

**Step 1: Agent routing**
```typescript
// API call
POST /api/agents/invoke
{
  "description": "Generate educational content for set theory topic including Venn diagrams",
  "context": {
    "topic": {
      "topicId": "c12",
      "title": "Sets",
      "learningObjectives": [...],
      "examples": [
        { "setA": [1,2,3,4,5], "setB": [4,5,6,7,8] }
      ]
    }
  }
}
```

**Step 2: Orchestrator routes to Sets Agent**
```
AgentOrchestrator analyzing task...
  Keywords detected: "set theory", "Venn diagrams"
  ✓ Best match: Sets Agent (confidence: 0.40)
  Routing to: Sets Agent
```

**Step 3: Sets Agent generates content**
```typescript
// Sets Agent execution
1. Load CONTEXT.md (500 lines of focused knowledge)
2. Extract examples from topic metadata
3. For each example:
   - Call spatial_calculator.py (Venn layout)
   - Generate Manim code
   - Generate D3 code (for web)
   - Calculate positions for all elements
4. Create concept breakdown:
   - What are sets?
   - Set notation
   - Union and intersection
   - Venn diagram interpretation
5. Generate narration script
6. Return structured content
```

**Step 4: Content saved to Firestore**
```javascript
// Updated topic document
syllabi/cambridge-igcse-0580/units/c1-number/topics/c12-sets/
  - status: "content_generated" ✓
  - content:
      conceptsGenerated: true
      concepts:
        - concept_1:
            title: "What are sets?"
            narration: "A set is a collection of distinct objects..."
            visual: { type: "manim", code: "..." }
        - concept_2:
            title: "Venn diagrams"
            narration: "Venn diagrams help us visualize..."
            visual: { type: "manim", code: "...", layout: {...} }
```

### Pipeline for All Topics

**Goal:** Generate content for all 99 Cambridge IGCSE topics

**Current state:**
- ✅ Sets Agent ready (tested with real data)
- ⏳ Algebra Agent (pending)
- ⏳ Geometry Agent (pending)
- ⏳ 96 more agents...

**Execution plan:**

**Week 1-2: Build remaining agents**
```bash
# Priority order (most used topics first)
1. Sets ✅ DONE
2. Algebra (equations, factoring)
3. Geometry (shapes, angles)
4. Graphs (linear, quadratic)
5. Statistics (mean, median, probability)
6. Calculus (differentiation)
7. Trigonometry (sine, cosine)
8. ... 92 more
```

**Effort:** ~1 hour per agent × 99 = 99 hours (2.5 weeks)

**Week 3-4: Generate content**
```bash
# For each topic in Firestore:
for topic in $(firebase_get_all_topics); do
  # Route to appropriate agent
  result=$(curl -X POST /api/agents/invoke \
    -d "{\"description\": \"Generate content for ${topic.title}\", \"context\": ${topic}}")

  # Save to Firestore
  firebase_update_topic($topic.id, $result)
done
```

**Automation:**
- Run overnight batch job
- Process 10-20 topics per night
- Human review in morning
- 99 topics ÷ 15 per night = ~7 nights

---

## Phase 3: Video Rendering (READY TO USE)

### Infrastructure ✅ Already Built

**Location:** Main `content-engine` repo
- Remotion compositions (`packages/backend/src/remotion/`)
- Video renderer service (`packages/backend/src/services/video-renderer.ts`)
- ElevenLabs integration (voice cloning + TTS)
- Gemini 2.5 Flash (image generation)

### Process Per Topic

**Input:** Generated content from Phase 2

**Step 1: Generate assets**

**A. Manim animations (FREE, local)**
```bash
# For each concept with Manim code:
cd /tmp/manim-render
echo "${concept.visual.code}" > scene.py

# Render
conda run -n aitools manim -pql scene.py VennDiagram

# Output: /tmp/manim-render/media/videos/scene/VennDiagram.mp4
```

**B. Background images (Gemini - $0.039 each)**
```typescript
// For intro/outro slides
const image = await geminiFlash.generateImage({
  prompt: "Professional educational slide: 'Introduction to Sets', Cambridge IGCSE style",
  width: 1920,
  height: 1080
});
// Cost: $0.039 per image × 2 (intro + outro) = $0.078
```

**C. Narration (ElevenLabs - $0.30/1K chars)**
```typescript
// Use YOUR voice (cloned from 60s+ sample)
const voiceId = await elevenLabs.cloneVoice("your-60s-sample.mp3");

// Generate narration for each concept
const audio = await elevenLabs.textToSpeech({
  text: concept.narration,  // ~500 chars per concept
  voiceId: voiceId
});
// Cost: 500 chars × 6 concepts = 3K chars × $0.30/1K = $0.90
```

**Step 2: Compose video (Remotion)**

```typescript
import { renderVideo } from './services/video-renderer';

const scenes = topic.concepts.map((concept, i) => ({
  id: i + 1,
  title: concept.title,
  explanation: concept.narration,

  // Manim video OR static image
  visual: concept.visual.type === 'manim'
    ? `/tmp/manim-render/media/videos/concept-${i}.mp4`
    : concept.visual.imageUrl,

  // Narration audio
  audio: `/tmp/narration/concept-${i}.mp3`,

  // Duration (auto-calculated from audio)
  duration: concept.audioDuration
}));

const videoPath = await renderVideo({
  composition: 'EducationalLesson',
  scenes,
  outputPath: `output/topics/${topic.topicId}.mp4`,
  codec: 'h264',
  width: 1920,
  height: 1080,
  fps: 30
});
```

**Step 3: Save to Firestore + Storage**

```typescript
// Upload video to Firebase Storage
const videoUrl = await storage.upload(videoPath, {
  path: `topics/${topic.topicId}/lesson.mp4`,
  metadata: { topicId: topic.topicId }
});

// Update Firestore
await firestore.collection('syllabi/cambridge-igcse-0580/units/c1-number/topics').doc(topic.topicId).update({
  'content.videoGenerated': true,
  'content.videoUrl': videoUrl,
  'content.videoDuration': totalDuration,
  'status': 'video_rendered'
});
```

### Cost Per Topic (10 minutes)

| Component | Count | Cost Each | Total |
|-----------|-------|-----------|-------|
| Manim animations | 6 scenes | $0.00 (FREE) | $0.00 |
| Gemini images | 2 slides | $0.039 | $0.08 |
| ElevenLabs narration | ~3K chars | $0.30/1K | $0.90 |
| Remotion rendering | 1 video | $0.00 (FREE) | $0.00 |
| **Total** | | | **$0.98** |

**Full Cambridge IGCSE (99 topics):**
- Total cost: 99 × $0.98 = **$97.02**
- Total video: ~990 minutes (16.5 hours)
- Compare to hiring: $50,000+ for traditional production!

---

## Phase 4: SCORM Packaging (TO BUILD)

### Goal
Generate LMS-compatible SCORM 1.2 packages

### Structure
```
topic-c12-sets.zip
├── imsmanifest.xml          # SCORM manifest
├── index.html               # Main launcher
├── video/
│   └── lesson.mp4           # Video from Phase 3
├── interactive/
│   └── practice.html        # D3 interactive exercises
├── quiz/
│   └── quiz.html            # Assessment
└── api/
    └── scorm-wrapper.js     # LMS communication
```

### Implementation Plan

**Create SCORM packager service:**

```typescript
// packages/backend/src/services/scorm-packager.ts

export class SCORMPackager {
  async packageTopic(topic: Topic): Promise<Buffer> {
    const zip = new JSZip();

    // 1. Add manifest
    const manifest = this.generateManifest(topic);
    zip.file('imsmanifest.xml', manifest);

    // 2. Add video
    const videoBuffer = await storage.download(topic.content.videoUrl);
    zip.file('video/lesson.mp4', videoBuffer);

    // 3. Add interactive exercises (D3)
    const interactive = this.generateInteractive(topic);
    zip.file('interactive/practice.html', interactive);

    // 4. Add quiz
    const quiz = this.generateQuiz(topic);
    zip.file('quiz/quiz.html', quiz);

    // 5. Add launcher
    const launcher = this.generateLauncher(topic);
    zip.file('index.html', launcher);

    // 6. Add SCORM API wrapper
    zip.file('api/scorm-wrapper.js', SCORM_API_WRAPPER);

    return zip.generateAsync({ type: 'nodebuffer' });
  }

  private generateManifest(topic: Topic): string {
    return `<?xml version="1.0"?>
<manifest identifier="topic-${topic.topicId}">
  <organizations default="org-1">
    <organization identifier="org-1">
      <title>${topic.title}</title>
      <item identifier="item-1" identifierref="resource-1">
        <title>${topic.title}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource-1" type="webcontent" href="index.html">
      <file href="index.html"/>
      <file href="video/lesson.mp4"/>
      <file href="interactive/practice.html"/>
      <file href="quiz/quiz.html"/>
    </resource>
  </resources>
</manifest>`;
  }
}
```

**API endpoint:**

```typescript
// POST /api/education/topics/:topicId/export-scorm
router.post('/topics/:topicId/export-scorm', async (req, res) => {
  const { topicId } = req.params;

  // Get topic from Firestore
  const topic = await getTopicById(topicId);

  // Package as SCORM
  const packager = new SCORMPackager();
  const scormZip = await packager.packageTopic(topic);

  // Send as download
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="topic-${topicId}.zip"`);
  res.send(scormZip);
});
```

**Effort:** 2-3 days to build SCORM packager

---

## Phase 5: Deployment & Distribution (TO BUILD)

### Options

**1. Direct LMS Upload**
- User downloads SCORM package
- Manually uploads to Moodle/Canvas/Blackboard
- **Effort:** 0 (already works with SCORM)

**2. LMS Integration API**
```typescript
// Auto-upload to customer's LMS
const lmsClient = new MoodleClient({
  url: customer.lmsUrl,
  token: customer.lmsToken
});

await lmsClient.uploadCourse({
  name: `Cambridge IGCSE Mathematics - ${topic.title}`,
  scormPackage: scormZip
});
```
**Effort:** 1 week per LMS integration

**3. YouTube Upload**
```typescript
// Auto-publish to YouTube channel
const youtube = new YouTubeClient({
  apiKey: process.env.YOUTUBE_API_KEY
});

await youtube.upload({
  title: `Cambridge IGCSE Mathematics - ${topic.title}`,
  description: topic.learningObjectives.join('\n'),
  video: videoPath,
  tags: ['IGCSE', 'Mathematics', 'Education'],
  category: 'Education'
});
```
**Effort:** 2 days

**4. Standalone Platform**
- Host content on our own platform
- Students access via web
- **Effort:** 2-4 weeks for MVP

---

## Complete Pipeline Execution

### End-to-End Example: Topic C12 (Sets)

**Day 1: Syllabus Import** ✅ DONE
```bash
npm run import-syllabus ./data/cambridge-igcse-0580-sample.json
# Result: Topic c12 created in Firestore with status="draft"
```

**Day 2: Content Generation** ✅ TESTED
```bash
curl -X POST http://localhost:3001/api/agents/invoke \
  -d '{
    "description": "Generate educational content for set theory with Venn diagrams",
    "context": {
      "topic": { /* topic from Firestore */ }
    }
  }'

# Result:
# - Sets Agent invoked (confidence: 0.40)
# - Spatial layout calculated (34 elements, 2.6s execution)
# - Manim code generated
# - D3 code generated
# - Content saved to Firestore with status="content_generated"
```

**Day 3: Video Rendering** ⏳ READY TO USE
```bash
# 1. Render Manim scenes (6 concepts)
for i in 1 2 3 4 5 6; do
  conda run -n aitools manim -pql concept-${i}.py
done

# 2. Generate narration (ElevenLabs)
curl -X POST /api/education/generate-narration \
  -d '{ "script": "..." }'

# 3. Compose video (Remotion)
curl -X POST /api/education/render-video \
  -d '{ "topicId": "c12", "scenes": [...] }'

# Result: video saved to Firebase Storage
# Cost: $0.98
```

**Day 4: SCORM Packaging** ⏳ TO BUILD (2-3 days)
```bash
curl -X POST /api/education/topics/c12/export-scorm

# Result: topic-c12-sets.zip downloaded
# Ready to upload to any LMS
```

**Day 5: Deployment** ⏳ TO BUILD
```bash
# Option A: Manual upload to LMS
# - User uploads SCORM package

# Option B: Auto-upload
curl -X POST /api/education/topics/c12/deploy \
  -d '{ "lms": "moodle", "courseId": "123" }'

# Option C: YouTube
curl -X POST /api/education/topics/c12/publish-youtube

# Result: Content live for students!
```

---

## Scaling to Full Cambridge IGCSE

### Timeline

**Weeks 1-2:** Build remaining agents (98 agents × 1 hour = 98 hours)
- Sets ✅ DONE
- Algebra, Geometry, Graphs, etc. ⏳

**Week 3:** Generate content (99 topics)
- Run automated batch job
- ~15 topics per night × 7 nights = 105 topics ✓
- Human review each morning

**Week 4:** Render videos (99 topics)
- Parallel rendering (10 topics at a time)
- 99 topics ÷ 10 parallel = 10 batches
- ~1 hour per batch = 10 hours total
- Cost: 99 × $0.98 = $97.02

**Week 5:** Package SCORM & Deploy
- Auto-generate 99 SCORM packages
- Bulk upload to LMS or publish to YouTube
- Student testing begins

**Total:** 5 weeks from start to deployed curriculum

**Compare to traditional:**
- Content creation: 6-12 months
- Video production: $50,000-$100,000
- SCORM packaging: $5,000-$10,000
- **Total: 12+ months, $60,000+**

**Our approach:**
- **5 weeks, $97.02** 🎉

---

## Monitoring & Quality Control

### Automated Checks

**1. Content validation**
```typescript
// Before video rendering
if (!topic.content.conceptsGenerated) {
  throw new Error('Content not generated yet');
}

if (topic.content.concepts.length < 3) {
  console.warn('Too few concepts - might be too short');
}
```

**2. Video rendering validation**
```typescript
// After rendering
const videoDuration = await getVideoDuration(videoPath);

if (videoDuration < 300) {  // 5 minutes
  console.warn('Video too short - add more content');
}

if (videoDuration > 900) {  // 15 minutes
  console.warn('Video too long - split into parts');
}
```

**3. Cost tracking**
```typescript
// Track costs per topic
await firestore.collection('costs').add({
  topicId: topic.topicId,
  timestamp: new Date(),
  breakdown: {
    manim: 0,
    gemini: 0.08,
    elevenLabs: 0.90,
    remotion: 0
  },
  total: 0.98
});

// Alert if costs exceed budget
const totalCost = await getTotalCost();
if (totalCost > BUDGET_LIMIT) {
  await sendAlert('Budget limit exceeded');
}
```

### Human Review Points

**1. After content generation (Sets Agent)**
- ✅ Learning objectives covered?
- ✅ Examples appropriate for level?
- ✅ Venn diagrams mathematically correct?

**2. After video rendering**
- ✅ Audio quality good?
- ✅ Visuals clear?
- ✅ Pacing appropriate?

**3. Before deployment**
- ✅ SCORM package works in LMS?
- ✅ Quiz questions correct?
- ✅ Interactive exercises functional?

---

## Current Status

### ✅ COMPLETE
1. Syllabus import (Firestore)
2. Agent architecture (orchestrator + registry)
3. Sets Agent (production-ready, tested)
4. Spatial calculator library (500+ lines of math)
5. Video infrastructure (Remotion + ElevenLabs + Gemini)

### ⏳ IN PROGRESS
6. Content generation API endpoint integration
7. Batch processing system

### 📋 TO BUILD (Estimated effort)
8. Remaining 98 agents (98 hours = 2.5 weeks)
9. SCORM packager (2-3 days)
10. LMS integration (1 week per LMS)
11. YouTube uploader (2 days)
12. Monitoring dashboard (1 week)

### 🎯 READY TO START
- **Next step:** Build Algebra Agent (1 hour)
- **After that:** Build Geometry Agent (1 hour)
- **Pattern established:** Each new agent takes ~1 hour

---

## Cost Summary

### Per Topic
| Component | Cost |
|-----------|------|
| Content generation (agent) | $0.00 (local) |
| Manim rendering | $0.00 (local) |
| Gemini images | $0.08 |
| ElevenLabs narration | $0.90 |
| Remotion composition | $0.00 (local) |
| **Total per topic** | **$0.98** |

### Full Cambridge IGCSE (99 topics)
| Item | Cost |
|------|------|
| Content generation | $0.00 |
| Video production | $97.02 |
| SCORM packaging | $0.00 (local) |
| **Total** | **$97.02** |

### Infrastructure (One-time)
| Item | Cost |
|------|------|
| ElevenLabs voice cloning | $0 (included in plan) |
| Firebase Firestore | ~$5/month |
| Firebase Storage (videos) | ~$10/month for 100GB |
| **Monthly recurring** | **~$15** |

### Compare to Traditional
| Our Approach | Traditional |
|--------------|-------------|
| 5 weeks | 12+ months |
| $97.02 | $60,000+ |
| 99 topics | 99 topics |
| **622× cheaper!** | - |

---

## Next Actions

### Immediate (This week)
1. ✅ Document production pipeline (this file)
2. ⏳ Create API endpoint: `POST /api/education/generate-content/:topicId`
3. ⏳ Build Algebra Agent (1 hour)
4. ⏳ Test end-to-end: Sets topic → Video → SCORM

### Short-term (Next 2 weeks)
1. Build 10 core agents (Algebra, Geometry, Graphs, Statistics, etc.)
2. Generate content for 10 sample topics
3. Render 10 videos
4. Build SCORM packager
5. Deploy to test LMS

### Medium-term (Month 2)
1. Build remaining 88 agents
2. Generate all 99 topics
3. Render all videos
4. Package all SCORM
5. Deploy to production LMS

### Long-term (Month 3+)
1. Add more syllabi (AQA, Edexcel, OCR)
2. Build advanced agents (see `AGENTIC-EDUCATION-PLATFORM.md`)
3. Launch student-facing platform
4. Marketing & growth

---

**Status:** 🚀 Ready to execute
**Next step:** Build content generation API endpoint
**Blockers:** None - all infrastructure ready!
