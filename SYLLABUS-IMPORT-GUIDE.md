# Syllabus Import Guide

## You Have Everything You Need! 🎉

The Cambridge IGCSE Mathematics 0580 syllabus JSON you provided is **perfect** for our system. Here's how to get it into Firestore.

## Quick Start

### 1. Save Your Syllabus JSON

Save the Cambridge IGCSE JSON you provided to:
```
packages/backend/data/cambridge-igcse-0580.json
```

Create the `data` directory if it doesn't exist:
```bash
cd packages/backend
mkdir -p data
```

Then paste your JSON into `data/cambridge-igcse-0580.json`.

### 2. Set Up Education Firebase Project

Follow `EDUCATION-PROJECT-SETUP.md` to:
1. Create Firebase project
2. Set up Firestore and Storage
3. Download service account key
4. Add to `.env` as `EDUCATION_FIREBASE_KEY`

### 3. Run the Import

```bash
cd packages/backend
npm run import-syllabus ./data/cambridge-igcse-0580.json
```

You should see output like:
```
🔥 Starting Cambridge IGCSE import...

📖 Loading syllabus from: ./data/cambridge-igcse-0580.json
✓ Loaded: Cambridge IGCSE Mathematics 0580
  - Topics: 9
  - Core subtopics: 47
  - Extended subtopics: 52

📝 Creating syllabus document: cambridge-igcse-maths-0580
✓ Syllabus document created

📚 Importing Core topics...
  → Unit: Number (C1)
    • Topic: Types of number (C1.1)
    • Topic: Sets (C1.2)
    • Topic: Powers and roots (C1.3)
    ...

📚 Importing Extended topics...
  → Unit: Number (E1)
    • Topic: Types of number (E1.1)
    • Topic: Sets (E1.2)
    ...

✅ Import complete!
  - Units imported: 18 (9 Core + 9 Extended)
  - Topics imported: 99 (47 Core + 52 Extended)

🎉 Import successful!
```

## What Gets Created in Firestore

### Syllabi Collection

```
syllabi/
  cambridge-igcse-maths-0580/
    syllabusId: "cambridge-igcse-maths-0580"
    title: "Cambridge IGCSE Mathematics 0580"
    subject: "mathematics"
    curriculum: "Cambridge IGCSE"
    metadata: {
      examBoard: "Cambridge International"
      code: "0580"
      levels: ["Core", "Extended"]
      assessmentInfo: { ... }
    }
```

### Units (Topics)

```
syllabi/cambridge-igcse-maths-0580/units/
  c1-number/
    unitId: "c1-number"
    title: "Number"
    sequenceOrder: 1
    estimatedDuration: 720  // 16 subtopics × 45 mins
    difficulty: "beginner"
    metadata: {
      originalCode: "C1"
      icon: "Hash"
      color: "text-blue-600"
    }

  e1-number/
    unitId: "e1-number"
    title: "Number"
    sequenceOrder: 1
    estimatedDuration: 765  // 17 subtopics × 45 mins
    difficulty: "intermediate"
    metadata: {
      originalCode: "E1"
      icon: "Hash"
      color: "text-blue-600"
    }
```

### Topics (Subtopics)

```
syllabi/cambridge-igcse-maths-0580/units/c1-number/topics/
  c1-1/
    topicId: "c1-1"
    title: "Types of number"
    description: "Natural numbers. Integers..."
    sequenceOrder: 1
    estimatedDuration: 45
    learningObjectives: [
      "Natural numbers",
      "Integers (positive, zero and negative)",
      ...
    ]
    status: "draft"
    content: {
      conceptsGenerated: false
      videosGenerated: false
      ...
    }
    metadata: {
      originalCode: "C1.1"
      examples: [
        "Convert between numbers and words...",
        "Express 72 as a product of its prime factors",
        ...
      ]
      notes: [ ... ]
    }

  c1-2/
    topicId: "c1-2"
    title: "Sets"
    ...
```

## What You Get

After import, you'll have:

✅ **Complete Cambridge IGCSE Mathematics 0580 syllabus in Firestore**
✅ **99 topics ready for content generation**
✅ **Hierarchical structure: Syllabus → Units → Topics**
✅ **All metadata preserved** (examples, notes, formulas, etc.)
✅ **SCORM-ready structure** (topics = future SCOs)

## Next Steps After Import

### 1. Verify the Import

```bash
# Check Firestore in Firebase Console
# Navigate to: syllabi/cambridge-igcse-maths-0580
```

You should see:
- 1 syllabus document
- 18 units (9 Core + 9 Extended)
- 99 topics total

### 2. Generate Content for a Topic

Pick a topic (e.g., "Sets" - C1.2) and generate educational content:

```typescript
// Future API call:
POST /api/education/generate-topic

{
  "syllabusId": "cambridge-igcse-maths-0580",
  "unitId": "c1-number",
  "topicId": "c1-2"
}

// This will:
// 1. Use Claude to break topic into concepts
// 2. Generate Manim animations for each concept
// 3. Generate D3 interactives
// 4. Generate voice narration (ElevenLabs)
// 5. Compose videos (Remotion)
// 6. Create exercises and quiz
// 7. Package as SCORM
```

### 3. Build the Content Generator

The import script has done its job. Now you need to build:

1. **Content Generator Service** (`src/services/educational-content-generator.ts`)
   - Takes a topic from Firestore
   - Uses Claude to generate concepts
   - Orchestrates Manim, D3, ElevenLabs, Remotion

2. **SCORM Packager** (`src/services/scorm-packager.ts`)
   - Takes generated content
   - Creates SCORM 2004 ZIP package
   - Uploads to Storage

3. **API Routes** (`src/routes/education.ts`)
   - `/api/education/syllabi` - List syllabi
   - `/api/education/topics/:id` - Get topic
   - `/api/education/generate-topic` - Generate content
   - `/api/education/export-scorm` - Export as SCORM

## Mapping Your JSON to Content

Here's how we'll use your rich JSON structure:

### Example: C1.2 Sets

**From your JSON:**
```json
{
  "code": "C1.2",
  "title": "Sets",
  "content": [
    "Set language, notation and Venn diagrams",
    "Limited to two sets"
  ],
  "notation": [
    "n(A) - Number of elements in set A",
    "A' - Complement of set A",
    ...
  ],
  "examples": [
    "A = {x: x is a natural number}",
    "B = {a, b, c, ...}",
    ...
  ]
}
```

**Generated Content:**

```typescript
// Claude generates concepts from this rich data:
{
  concepts: [
    {
      id: "what-is-a-set",
      title: "What is a Set?",
      explanation: "...", // Generated from content
      visualType: "d3", // Interactive set builder
      narrationScript: "..." // Generated, mentions examples
    },
    {
      id: "set-notation",
      title: "Set Notation",
      explanation: "...", // Uses notation array
      visualType: "manim", // Animated notation
      narrationScript: "..." // Explains n(A), A', etc.
    },
    {
      id: "venn-diagrams",
      title: "Venn Diagrams",
      explanation: "...",
      visualType: "d3", // Interactive Venn diagram
      narrationScript: "..."
    }
  ],
  exercises: [
    // Generated from examples
    {
      question: "Write A = {x: x is a natural number} in words",
      correctAnswer: "...",
      feedback: "..."
    }
  ]
}
```

## Why This JSON is Perfect

Your JSON has **everything** we need:

✅ **Learning objectives** → Concept breakdown
✅ **Examples** → Practice exercises
✅ **Notes** → Assessment constraints (what NOT to include)
✅ **Notation** → Visual elements for Manim/D3
✅ **Formulas** → Which to include in formula sheet
✅ **Vocabulary** → Key terms to emphasize
✅ **Prerequisites** → Sequencing rules for SCORM

This is **gold standard** educational content structure!

## Cost Estimate

For all 99 topics:

| Item | Cost per Topic | Total (99 topics) |
|------|----------------|-------------------|
| Content generation (Claude) | ~$0.20 | ~$20 |
| Manim animations (local) | FREE | FREE |
| D3 specs (Claude) | ~$0.10 | ~$10 |
| Voice narration (ElevenLabs) | ~$0.50 | ~$50 |
| Video composition (Remotion local) | FREE | FREE |
| **Total** | **~$0.80** | **~$80** |

**Result:** Complete Cambridge IGCSE Mathematics 0580 curriculum with:
- 99 video lessons
- Interactive D3 visualizations
- Practice exercises
- Quizzes
- SCORM packages
- All for ~$80!

Compare to:
- Traditional video production: $50,000+
- Online course creation: $10,000+
- Textbook + workbook: $5,000+

## Questions?

**Q: Can I import other exam boards?**
A: Yes! Any syllabus with similar JSON structure will work. Just adjust the import script if needed.

**Q: What if I have multiple curricula?**
A: Import each as a separate syllabus. The system supports unlimited syllabi.

**Q: Can I update the syllabus later?**
A: Yes! Re-run the import script. It will overwrite existing data.

**Q: What about student progress tracking?**
A: That's stored separately in the `student_progress` collection. Syllabus changes won't affect existing student data.

## Ready to Import?

```bash
cd packages/backend
npm run import-syllabus ./data/cambridge-igcse-0580.json
```

Then check Firebase Console to verify! 🚀
