# Education Project Setup Guide

## Summary

We've added support for a dedicated **`education` Firebase project** to handle educational content generation and SCORM delivery, keeping it separate from the existing business applications (iClean, HACCP, etc.) and the generic `math` platform.

## What We've Done

### 1. Backend Firebase Integration

**File Modified:** `packages/backend/src/services/firebase.ts`

Added initialization for the `education` project:

```typescript
// Initialize Education project (if configured)
if (process.env.EDUCATION_FIREBASE_KEY) {
  try {
    const serviceAccount = JSON.parse(process.env.EDUCATION_FIREBASE_KEY) as ServiceAccount;
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${serviceAccount.project_id}.appspot.com`
    }, 'education');

    firebaseProjects.set('education', {
      app,
      db: app.firestore(),
      storage: app.storage(),
      auth: app.auth()
    });

    console.log('   ✓ Education Firebase initialized');
  } catch (error) {
    console.error('   ✗ Failed to initialize Education Firebase:', error);
  }
}
```

### 2. Frontend Project Selector

**File Modified:** `packages/frontend/app/page.tsx`

Added "Education" to the project list:

```typescript
const PROJECTS = [
  { id: 'iclean', name: 'iClean', color: 'from-blue-500 to-cyan-500' },
  { id: 'haccp', name: 'HACCP Audits', color: 'from-green-500 to-emerald-500' },
  { id: 'math', name: 'Math Platform', color: 'from-purple-500 to-pink-500' },
  { id: 'peakflow', name: 'PeakFlow', color: 'from-orange-500 to-red-500' },
  { id: 'acs', name: 'ACS', color: 'from-slate-500 to-slate-700' },
  { id: 'education', name: 'Education', color: 'from-indigo-500 to-violet-500' }, // NEW
] as const;
```

### 3. Database Schema Documentation

**File Created:** `EDUCATION-FIREBASE-SCHEMA.md`

Complete Firestore schema for:
- Syllabi (curricula definitions)
- Units (modules)
- Topics (SCORM SCOs)
- Concepts (atomic learning units)
- Exercises & Quizzes
- Student Progress Tracking

## Next Steps to Complete Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or use existing project
3. Project name: `education` (or your preferred name)
4. Enable Google Analytics (optional)

### Step 2: Set Up Firestore

1. In Firebase Console → Build → Firestore Database
2. Click "Create database"
3. Choose location (e.g., `europe-west2` for UK)
4. Start in **production mode** (we'll add security rules)
5. Create initial collection: `syllabi`

### Step 3: Set Up Storage

1. In Firebase Console → Build → Storage
2. Click "Get started"
3. Use production mode
4. Create folder structure:
   ```
   /syllabi
   /scorm
   /videos
   /audio
   /thumbnails
   /interactives
   ```

### Step 4: Generate Service Account

1. In Firebase Console → Project Settings (gear icon) → Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. **IMPORTANT:** Keep this file secure (never commit to git)

### Step 5: Add Environment Variable

Add the service account JSON to your `.env` file in the **root directory**:

```bash
# Education Firebase Project
EDUCATION_FIREBASE_KEY='{"type":"service_account","project_id":"your-project-id",...}'
```

**Note:** The entire JSON should be on one line, wrapped in single quotes.

### Step 6: Restart Backend

```bash
cd packages/backend
npm run dev
```

You should see in the logs:
```
🔥 Initializing Firebase projects...
   ✓ iClean Firebase initialized
   ✓ HACCP Firebase initialized
   ✓ Math Platform Firebase initialized
   ✓ PeakFlow Firebase initialized
   ✓ ACS Firebase initialized
   ✓ Education Firebase initialized     ← NEW
   Total projects initialized: 6
```

## Using the Education Project

### In Backend Services

```typescript
import { getFirebaseProject } from '../services/firebase';

// Get education project
const educationProject = getFirebaseProject('education');

if (!educationProject) {
  throw new Error('Education project not configured');
}

// Access Firestore
const syllabusRef = educationProject.db
  .collection('syllabi')
  .doc('gcse-maths-y10');

const syllabusDoc = await syllabusRef.get();

// Upload to Storage
const bucket = educationProject.storage.bucket();
const file = bucket.file('videos/set-notation/intro.mp4');
await file.save(videoBuffer);
```

### From Frontend

When selecting "Education" project, API calls will route to education-specific endpoints:

```typescript
// Frontend makes request
const response = await fetch(`${apiUrl}/api/education/syllabi/gcse-maths-y10`);

// Backend routes to education Firebase project
router.get('/syllabi/:syllabusId', async (req, res) => {
  const educationProject = getFirebaseProject('education');
  const doc = await educationProject.db
    .collection('syllabi')
    .doc(req.params.syllabusId)
    .get();

  res.json({ success: true, data: doc.data() });
});
```

## Architecture Decision: Why Separate `education` Project?

**Option 1: Use existing `math` project** ❌
- Pros: Already set up, no new project needed
- Cons: Limited to mathematics, not multi-subject

**Option 2: Create dedicated `education` project** ✅ (What we did)
- Pros:
  - Multi-subject support (math, physics, chemistry, etc.)
  - Clean separation from business apps (iClean, HACCP, etc.)
  - Independent scaling and billing
  - Clear data ownership
- Cons:
  - Need to create new Firebase project
  - Additional configuration

## Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│ 1. SYLLABUS DEFINITION (Manual/Import)                       │
│    Admin creates GCSE Maths Year 10 syllabus                 │
│    ↓ Firestore: syllabi/gcse-maths-y10                      │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. CONTENT GENERATION (Automated)                            │
│    System generates topics → concepts → videos               │
│    ↓ Firestore: syllabi/.../topics/{topicId}/concepts       │
│    ↓ Storage: /videos/, /audio/, /interactives/             │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. SCORM PACKAGING (On-demand)                               │
│    Package topic into SCORM ZIP                              │
│    ↓ Storage: /scorm/gcse-maths-y10/set-notation.zip        │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. DELIVERY (LMS Upload)                                     │
│    Download SCORM package → Upload to Moodle/Canvas         │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. TRACKING (Runtime)                                        │
│    Student progress tracked in LMS + our Firestore           │
│    ↓ Firestore: student_progress/{userId}                   │
└──────────────────────────────────────────────────────────────┘
```

## Security Considerations

1. **Service Account Key**: Never commit to git (add `.env` to `.gitignore`)
2. **Firestore Rules**: Implement before production (see schema doc)
3. **Storage Rules**: Ensure public read for SCORM assets, admin-only write
4. **CORS**: Configure Storage CORS for LMS access

## Cost Estimation

For a typical 10-module course (GCSE Maths Year 10):

| Resource | Usage | Cost (approx) |
|----------|-------|---------------|
| Firestore Reads | 1,000 reads/student | $0.06/million = ~$0.00006 |
| Firestore Writes | 100 writes/student | $0.18/million = ~$0.000018 |
| Storage | 500MB videos | $0.026/GB = ~$0.013 |
| Bandwidth | 500MB download | $0.12/GB = ~$0.06 |
| **Total per student** | | **~$0.07** |

**For 1,000 students:** ~$70/month

Most cost is generation (Claude, ElevenLabs, Gemini), not storage/delivery.

## Questions?

- **Can we use the existing `math` project instead?** Yes, but you'd be limited to mathematics content.
- **Do we need a separate project per subject?** No, one `education` project can handle all subjects using the syllabus collection.
- **How do we handle multiple exam boards?** Store as metadata in syllabus documents.
- **Can students access content directly from our app?** Yes, or via SCORM packages in LMS.

## Ready to Build?

Once the Firebase project is set up, we can start building:

1. **Syllabus seeder** - Populate initial GCSE Maths data
2. **Content generator** - Claude + Manim + ElevenLabs pipeline
3. **SCORM packager** - Export topics as SCORM 2004 packages
4. **Student portal** - Frontend for direct access (non-LMS)

See `EDUCATION-FIREBASE-SCHEMA.md` for detailed database structure.
