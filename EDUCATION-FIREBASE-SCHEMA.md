# Education Firebase Schema

This document defines the Firestore database structure for the `education` Firebase project, designed to support SCORM-compliant educational content generation and delivery.

## Overview

The schema follows a hierarchical structure aligned with educational standards and SCORM requirements:

```
Syllabi → Units → Topics → Concepts → Assets
```

## Collections

### 1. `syllabi` Collection

Top-level collection storing curriculum definitions.

**Document Structure:**

```typescript
{
  syllabusId: string;           // e.g., "gcse-maths-y10"
  title: string;                // "GCSE Mathematics Year 10"
  subject: string;              // "mathematics" | "physics" | "chemistry" | ...
  curriculum: string;           // "GCSE" | "A-Level" | "IB" | "AP"
  year: number;                 // 10, 11, 12, etc.
  country: string;              // "UK" | "US" | "IB" (international)

  metadata: {
    examBoard?: string;         // "AQA" | "Edexcel" | "OCR" | etc.
    academicYear: string;       // "2024-2025"
    version: string;            // "1.0"
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy: string;          // User ID
  };

  // Nested subcollection: `units`
}
```

**Example:**
```json
{
  "syllabusId": "gcse-maths-y10",
  "title": "GCSE Mathematics Year 10",
  "subject": "mathematics",
  "curriculum": "GCSE",
  "year": 10,
  "country": "UK",
  "metadata": {
    "examBoard": "AQA",
    "academicYear": "2024-2025",
    "version": "1.0",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z",
    "createdBy": "system"
  }
}
```

---

### 2. `syllabi/{syllabusId}/units` Subcollection

Units (modules) within a syllabus.

**Document Structure:**

```typescript
{
  unitId: string;               // "sets-and-venn"
  title: string;                // "Sets and Venn Diagrams"
  description: string;          // Overview of unit
  sequenceOrder: number;        // 1, 2, 3... (order in syllabus)

  estimatedDuration: number;    // Total minutes
  difficulty: string;           // "beginner" | "intermediate" | "advanced"

  learningOutcomes: string[];   // What students will learn
  assessmentCriteria: string[]; // How mastery is assessed

  prerequisites: string[];      // Other unit IDs required first

  metadata: {
    tags: string[];             // ["algebra", "geometry", etc.]
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };

  // Nested subcollection: `topics`
}
```

**Example:**
```json
{
  "unitId": "sets-and-venn",
  "title": "Sets and Venn Diagrams",
  "description": "Introduction to set theory, notation, operations, and visual representation using Venn diagrams",
  "sequenceOrder": 1,
  "estimatedDuration": 135,
  "difficulty": "beginner",
  "learningOutcomes": [
    "Understand and use set notation",
    "Perform set operations (union, intersection, complement)",
    "Draw and interpret Venn diagrams",
    "Solve problems using sets and Venn diagrams"
  ],
  "assessmentCriteria": [
    "Correctly identify and write set notation",
    "Accurately perform set operations",
    "Draw Venn diagrams for 2-3 sets",
    "Solve real-world problems using sets"
  ],
  "prerequisites": [],
  "metadata": {
    "tags": ["sets", "venn-diagrams", "logic"],
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
}
```

---

### 3. `syllabi/{syllabusId}/units/{unitId}/topics` Subcollection

Individual topics (SCOs in SCORM) within a unit.

**Document Structure:**

```typescript
{
  topicId: string;              // "set-notation"
  title: string;                // "Set Notation and Terminology"
  description: string;
  sequenceOrder: number;        // Order within unit

  estimatedDuration: number;    // Minutes for this topic
  difficulty: string;           // "beginner" | "intermediate" | "advanced"

  learningObjectives: string[]; // Specific to this topic
  prerequisites: string[];      // Other topic IDs

  // Content generation status
  status: string;               // "draft" | "generated" | "published"

  // Generated content references
  content: {
    conceptsGenerated: boolean;
    videosGenerated: boolean;
    interactivesGenerated: boolean;
    exercisesGenerated: boolean;
    quizGenerated: boolean;
  };

  // SCORM packaging
  scorm: {
    packageGenerated: boolean;
    packageUrl?: string;        // Storage URL for ZIP
    packageVersion?: string;
    generatedAt?: Timestamp;
  };

  metadata: {
    tags: string[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
    generatedAt?: Timestamp;
  };

  // Nested subcollection: `concepts`
}
```

**Example:**
```json
{
  "topicId": "set-notation",
  "title": "Set Notation and Terminology",
  "description": "Learn the fundamental notation and terminology used in set theory",
  "sequenceOrder": 1,
  "estimatedDuration": 30,
  "difficulty": "beginner",
  "learningObjectives": [
    "Understand set notation (∈, ∉, ⊂, ∪, ∩)",
    "Identify elements and subsets",
    "Use set-builder notation"
  ],
  "prerequisites": [],
  "status": "generated",
  "content": {
    "conceptsGenerated": true,
    "videosGenerated": true,
    "interactivesGenerated": true,
    "exercisesGenerated": true,
    "quizGenerated": true
  },
  "scorm": {
    "packageGenerated": true,
    "packageUrl": "gs://education.appspot.com/scorm/gcse-maths-y10/set-notation.zip",
    "packageVersion": "1.0",
    "generatedAt": "2025-01-15T12:00:00Z"
  },
  "metadata": {
    "tags": ["sets", "notation", "fundamentals"],
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T12:00:00Z",
    "generatedAt": "2025-01-15T11:00:00Z"
  }
}
```

---

### 4. `syllabi/{syllabusId}/units/{unitId}/topics/{topicId}/concepts` Subcollection

Atomic learning concepts within a topic (the smallest unit of instruction).

**Document Structure:**

```typescript
{
  conceptId: string;            // "what-is-a-set"
  title: string;                // "What is a Set?"
  explanation: string;          // Full text explanation
  sequenceOrder: number;        // Order within topic

  // Visualization
  visualType: string;           // "manim" | "d3" | "static" | "hybrid"
  visualizationSpec: object;    // Manim or D3 config (JSON)

  // Assets
  assets: {
    videoUrl?: string;          // Composed video (Manim + narration)
    audioUrl?: string;          // Narration audio only
    thumbnailUrl?: string;      // Preview image
    interactiveUrl?: string;    // D3 interactive URL
    subtitlesUrl?: string;      // VTT/SRT file
  };

  // Narration
  narration: {
    script: string;             // Full text script
    duration: number;           // Milliseconds
    words?: {                   // Word-level timestamps
      word: string;
      start: number;            // ms from start
      end: number;              // ms from start
    }[];
  };

  // Timing & synchronization
  timeline: {
    visualEvents: {
      time: number;             // ms from start
      action: string;           // "create_circle_a", etc.
      duration: number;         // ms
      type: string;             // "manim" | "d3"
    }[];

    syncPoints: {
      time: number;             // ms
      visualEvent: string;
      narrationWord: number;    // Word index
      description: string;
    }[];
  };

  duration: number;             // Total milliseconds

  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
}
```

**Example:**
```json
{
  "conceptId": "what-is-a-set",
  "title": "What is a Set?",
  "explanation": "A set is a collection of distinct objects, considered as an object in its own right. Sets are one of the most fundamental concepts in mathematics.",
  "sequenceOrder": 1,
  "visualType": "manim",
  "visualizationSpec": {
    "sceneClass": "SetIntroduction",
    "elements": ["circle", "numbers", "labels"]
  },
  "assets": {
    "videoUrl": "gs://education.appspot.com/videos/set-notation/what-is-a-set.mp4",
    "audioUrl": "gs://education.appspot.com/audio/set-notation/what-is-a-set.mp3",
    "thumbnailUrl": "gs://education.appspot.com/thumbnails/set-notation/what-is-a-set.jpg"
  },
  "narration": {
    "script": "A set is simply a collection of things. These things are called elements. For example, here's a set containing the numbers 1, 2, and 3.",
    "duration": 8500,
    "words": [
      { "word": "A", "start": 0, "end": 150 },
      { "word": "set", "start": 150, "end": 400 }
      // ... more words
    ]
  },
  "timeline": {
    "visualEvents": [
      { "time": 0, "action": "show_set_container", "duration": 1000, "type": "manim" },
      { "time": 1000, "action": "add_element_1", "duration": 800, "type": "manim" }
    ],
    "syncPoints": [
      { "time": 0, "visualEvent": "show_set_container", "narrationWord": 0, "description": "Start narration as set appears" }
    ]
  },
  "duration": 8500,
  "metadata": {
    "createdAt": "2025-01-15T11:00:00Z",
    "updatedAt": "2025-01-15T11:00:00Z"
  }
}
```

---

### 5. `syllabi/{syllabusId}/units/{unitId}/topics/{topicId}/exercises` Subcollection

Practice exercises for the topic.

**Document Structure:**

```typescript
{
  exerciseId: string;
  type: string;                 // "multiple-choice" | "interactive" | "worked-example"
  sequenceOrder: number;

  question: string;             // Question text
  questionHtml?: string;        // HTML formatted question

  // For multiple choice
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];

  // For interactive/worked examples
  interactiveSpec?: object;     // D3 or custom spec

  correctAnswer: any;           // Depends on type

  feedback: {
    correct: string;            // Message for correct answer
    incorrect: string;          // Message for wrong answer
    hint?: string;              // Optional hint
  };

  difficulty: string;           // "easy" | "medium" | "hard"

  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
}
```

---

### 6. `syllabi/{syllabusId}/units/{unitId}/topics/{topicId}/quiz` Document

Assessment quiz for the topic (SCORM completion requirement).

**Document Structure:**

```typescript
{
  quizId: string;
  title: string;
  description: string;

  questions: {
    questionId: string;
    type: string;               // "multiple-choice" | "true-false" | "fill-blank"
    question: string;
    options?: string[];
    correctAnswer: any;
    points: number;
    feedback: {
      correct: string;
      incorrect: string;
    };
  }[];

  passingScore: number;         // Percentage (e.g., 70)
  timeLimit?: number;           // Minutes (optional)
  attemptsAllowed: number;      // -1 for unlimited

  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
}
```

---

### 7. `student_progress` Collection

Track student progress through content (SCORM tracking data).

**Document Structure:**

```typescript
{
  userId: string;
  syllabusId: string;
  unitId: string;
  topicId: string;

  status: string;               // "not-started" | "in-progress" | "completed" | "passed" | "failed"

  progress: {
    conceptsViewed: string[];   // Concept IDs
    conceptsCompleted: string[]; // Concept IDs
    exercisesCompleted: string[]; // Exercise IDs

    quizAttempts: {
      attemptId: string;
      score: number;
      passed: boolean;
      completedAt: Timestamp;
    }[];

    bestQuizScore: number;

    timeSpent: number;          // Total milliseconds
    lastPosition?: {            // Resume point
      conceptId: string;
      timestamp: number;        // ms in video
    };
  };

  completion: {
    completedAt?: Timestamp;
    completionStatus: string;   // SCORM status
    successStatus: string;      // "passed" | "failed" | "unknown"
    score?: number;
  };

  metadata: {
    startedAt: Timestamp;
    lastAccessedAt: Timestamp;
  };
}
```

---

## Firebase Storage Structure

```
/education
  /syllabi
    /{syllabusId}
      /{unitId}
        /{topicId}
          /videos
            /{conceptId}.mp4
          /audio
            /{conceptId}.mp3
          /thumbnails
            /{conceptId}.jpg
          /interactives
            /{conceptId}.json
          /subtitles
            /{conceptId}.vtt
      /scorm
        /{topicId}.zip              # SCORM package
```

---

## Security Rules (Example)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Syllabi are public (read-only for non-admins)
    match /syllabi/{syllabusId} {
      allow read: if true;
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

      match /units/{unitId} {
        allow read: if true;
        allow write: if request.auth != null &&
                        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

        match /topics/{topicId} {
          allow read: if true;
          allow write: if request.auth != null &&
                          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';

          match /{document=**} {
            allow read: if true;
            allow write: if request.auth != null &&
                            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
          }
        }
      }
    }

    // Student progress - users can only access their own
    match /student_progress/{progressId} {
      allow read: if request.auth != null &&
                     resource.data.userId == request.auth.uid;
      allow write: if request.auth != null &&
                      request.resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## Usage Examples

### 1. Create a New Syllabus

```typescript
import { getFirebaseProject, saveToFirestore } from '../services/firebase';

const educationProject = getFirebaseProject('education');

const syllabusData = {
  syllabusId: 'gcse-maths-y10',
  title: 'GCSE Mathematics Year 10',
  subject: 'mathematics',
  curriculum: 'GCSE',
  year: 10,
  country: 'UK',
  metadata: {
    examBoard: 'AQA',
    academicYear: '2024-2025',
    version: '1.0',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    createdBy: 'system'
  }
};

await educationProject.db
  .collection('syllabi')
  .doc('gcse-maths-y10')
  .set(syllabusData);
```

### 2. Add a Topic to a Unit

```typescript
const topicData = {
  topicId: 'set-notation',
  title: 'Set Notation and Terminology',
  description: 'Learn the fundamental notation and terminology used in set theory',
  sequenceOrder: 1,
  estimatedDuration: 30,
  difficulty: 'beginner',
  learningObjectives: [
    'Understand set notation (∈, ∉, ⊂, ∪, ∩)',
    'Identify elements and subsets',
    'Use set-builder notation'
  ],
  prerequisites: [],
  status: 'draft',
  content: {
    conceptsGenerated: false,
    videosGenerated: false,
    interactivesGenerated: false,
    exercisesGenerated: false,
    quizGenerated: false
  },
  metadata: {
    tags: ['sets', 'notation', 'fundamentals'],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }
};

await educationProject.db
  .collection('syllabi/gcse-maths-y10/units/sets-and-venn/topics')
  .doc('set-notation')
  .set(topicData);
```

### 3. Query Topics by Status

```typescript
const draftTopics = await educationProject.db
  .collectionGroup('topics')
  .where('status', '==', 'draft')
  .limit(10)
  .get();

draftTopics.forEach(doc => {
  console.log('Draft topic:', doc.id, doc.data());
});
```

---

## Next Steps

1. **Create Firebase Project**: Set up new `education` project in Firebase Console
2. **Generate Service Account**: Download JSON key and add to `.env` as `EDUCATION_FIREBASE_KEY`
3. **Seed Initial Data**: Create GCSE Maths Year 10 syllabus as proof of concept
4. **Build Content Generator**: Service to populate concepts, videos, etc.
5. **Build SCORM Packager**: Service to export topics as SCORM packages
