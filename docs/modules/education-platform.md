Two sections written at different times — the later 'Complete Video Pipeline' section supersedes where they conflict.

> Extracted verbatim from CLAUDE.md on 2026-07-08. Update THIS file (not root CLAUDE.md) when shipping changes in this area.

## Education Platform (NEW)

### Overview

The Education platform (`education` Firebase project) generates SCORM-compliant educational content from structured syllabi. It combines:
- **Syllabus import** (Cambridge IGCSE, etc.)
- **Content generation** (Claude AI)
- **Math animations** (Manim - FREE, local)
- **Interactive visualizations** (D3)
- **Voice narration** (ElevenLabs with voice cloning)
- **Video composition** (Remotion)
- **SCORM packaging** (LMS deployment)

### Key Documentation

- **`EDUCATION-FIREBASE-SCHEMA.md`** - Complete Firestore database schema
- **`EDUCATION-PROJECT-SETUP.md`** - Setup instructions and architecture
- **`SYLLABUS-IMPORT-GUIDE.md`** - How to import syllabi (Cambridge IGCSE example)

### Quick Start

1. **Create Education Firebase Project** (see `EDUCATION-PROJECT-SETUP.md`)
2. **Add service account key** to `.env`:
   ```bash
   EDUCATION_FIREBASE_KEY='{"type":"service_account",...}'
   ```
3. **Import Cambridge IGCSE syllabus**:
   ```bash
   cd packages/backend
   npm run import-syllabus ./data/cambridge-igcse-0580.json
   ```
4. **Verify in Firebase Console**: Check `syllabi/cambridge-igcse-maths-0580`

### Database Structure

```
syllabi/
  {syllabusId}/
    - Curriculum metadata (exam board, years, assessment info)

    units/
      {unitId}/
        - Learning outcomes, duration, difficulty

        topics/
          {topicId}/
            - Learning objectives, status, SCORM info

            concepts/
              {conceptId}/
                - Narration, timeline, assets (video, audio, interactive)

            exercises/
              {exerciseId}/
                - Questions, answers, feedback

            quiz/
              - Assessment questions, passing score
```

### Cost Estimation

**Per 10-minute educational module:**
- Manim animations: $0 (local, FREE)
- Gemini images: ~$0.16 (4 images × $0.039)
- ElevenLabs narration: ~$0.90 (3K chars × $0.30/1K)
- Remotion composition: $0 (local, FREE)
- **Total: ~$1.06 per module**

**Complete Cambridge IGCSE Mathematics (99 topics):**
- Total cost: ~$80-$100
- Output: 300-500 video lessons
- SCORM packages ready for any LMS

Compare to traditional production: $50,000+

### Implementation Status

✅ **Completed:**
- Firebase schema designed (`EDUCATION-FIREBASE-SCHEMA.md`)
- Syllabus import script built (`src/scripts/import-cambridge-igcse.ts`)
- Import validation script (`src/scripts/test-import-validation.ts`)
- Backend integration (Firebase project initialized in `firebase.ts`)
- Frontend integration (Education in project selector)
- Sample data created (`data/cambridge-igcse-0580-sample.json`)
- TypeScript compilation verified
- Import structure validated (6 topics, 3 units, ~$6.36 estimated cost)

⏳ **Pending:**
- Firebase project setup (user action required)
- Content generation pipeline (Claude → concepts)
- Manim integration (math animations)
- D3 visualization generator
- ElevenLabs voice cloning setup
- SCORM packager
- Student progress tracking
- API routes for education endpoints

### Testing the Education Platform

**Validate syllabus import structure (no Firebase required):**
```bash
cd packages/backend
npm run validate-syllabus ./data/cambridge-igcse-0580-sample.json
```

This will show:
- Syllabus structure (syllabi → units → topics)
- Unit and topic breakdown with metadata
- Firestore path preview
- Cost estimation (~$1.06 per module)
- Implementation checklist

**Import syllabus to Firebase (requires EDUCATION_FIREBASE_KEY):**
```bash
cd packages/backend
npm run import-syllabus ./data/cambridge-igcse-0580-sample.json
```

This will:
- Create syllabus document in Firestore
- Import all units (topics in Cambridge structure)
- Import all topics (subtopics in Cambridge structure)
- Preserve all metadata, examples, notes, notation, etc.

### Next Steps

See `SYLLABUS-IMPORT-GUIDE.md` for:
1. Setting up Education Firebase project
2. Importing Cambridge IGCSE syllabus
3. Generating content for topics
4. Exporting as SCORM packages

## 🎓 Education Platform - Complete Video Pipeline (NEW!)

**Status:** Production-Ready Educational Video System ✅

We've built a complete Cambridge IGCSE mathematics lesson generation system. When user mentions "education", "lessons", or "videos", see **EDUCATION-CONTEXT.md** for full capabilities.

### Quick Summary

**What's Working:**
- ✅ Complete Sets lesson rendered (3m 15s, 13MB)
- ✅ Manim animations (FREE, Python-based, 3Blue1Brown quality)
- ✅ Remotion intro slides (professional, animated)
- ✅ Full video composition pipeline
- ✅ Render scripts (`render-sets-complete.sh`)

**Example Lesson Structure:**
```
Introduction to Sets (3m 15s)
├─ Professional Intro (2m 10s)
│  ├─ Branding (10s)
│  ├─ Topic Title (15s)
│  ├─ Learning Objectives (45s) - 8 items
│  ├─ Prerequisites (30s) - 4 items
│  └─ Lesson Roadmap (30s) - 7 sections
└─ Manim Animations (1m 5s)
   ├─ What is a Set? (8s)
   ├─ Set Notation (7s)
   ├─ Venn Diagrams (4s)
   ├─ Visualizing Sets (8s)
   ├─ Intersection (12s)
   ├─ Union (8s)
   └─ Universal Sets (18s)
```

**Cost Model:**
- Current: $0.00 (all local)
- With narration: ~$0.90 per lesson (ElevenLabs)
- With AI backgrounds: ~$1.06 per lesson
- **vs. Traditional: $5,000-$10,000 per lesson** (99%+ savings!)

**Key Files:**
- `packages/backend/src/manim/` - Manim Python animations
- `packages/backend/src/remotion/` - Remotion React compositions
- `packages/backend/src/manim/output/sets-lesson-complete.mp4` - Final rendered video ✅
- `EDUCATION-CONTEXT.md` - Full system documentation

**Tech Stack:**
- Manim Community v0.19.0 (Python 3.11, conda env `aitools`)
- Remotion 4.0.364 (React + TypeScript)
- FFmpeg (video processing)

**When user asks about education, you can:**
1. Generate new lesson structures (objectives, prerequisites, narration)
2. Create Manim scene code for math concepts
3. Design interactive practice questions
4. Estimate costs for course creation
5. Explain rendering and composition process
6. Help with SCORM packaging for LMS

**Documentation:**
- `EDUCATION-STUDIO-ARCHITECTURE.md` - UI/system design
- `EDUCATION-STUDIO-QUICKSTART.md` - Implementation guide
- `EDUCATION-CONTEXT.md` - Complete system reference
- `packages/backend/src/manim/SETS-LESSON-README.md` - Sets lesson guide
