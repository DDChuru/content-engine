# Interactive Learning System - Quick Start

Get your interactive educational platform running in 5 minutes!

---

## Prerequisites

- Node.js 18+
- Claude API key (`ANTHROPIC_API_KEY`)
- Manim Community (optional, for math animations)

---

## 1. Start the Backend

```bash
cd packages/backend
npm run dev
```

You should see:
```
✅ Content Engine Cloud Backend running on port 3001

🎓 Interactive Learning System:
   • API Routes: /api/interactive/*
   • D3 Visualizations: ✓
   • Manim Animations: ✓
   • Step-by-Step Reveals: ✓
```

---

## 2. Generate Your First Problem

### Using cURL

```bash
curl -X POST http://localhost:3001/api/interactive/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Basic Derivatives",
    "difficulty": "beginner",
    "includeVisualizations": true,
    "includeVideos": true,
    "steps": 3
  }'
```

### Response Example

```json
{
  "problem": {
    "id": "1730000000000-abc123",
    "title": "Basic Derivatives - Interactive Problem",
    "question": {
      "text": "Find the derivative of f(x) = x²",
      "latex": "f(x) = x^2"
    },
    "steps": [
      {
        "id": "step-1",
        "title": "Step 1: Apply the power rule",
        "explanation": "For x^n, the derivative is n*x^(n-1)...",
        "manimVideo": {
          "videoUrl": "/api/interactive/videos/1730000000000-abc123/step-1.mp4"
        }
      }
    ]
  },
  "generatedAssets": {
    "visualizations": [],
    "videos": ["/api/interactive/videos/1730000000000-abc123/step-1.mp4"]
  }
}
```

Copy the `problem.id` - you'll need it for the frontend!

---

## 3. Use in Frontend

Create a new page in your Next.js app:

```tsx
// app/interactive/[problemId]/page.tsx

import { InteractiveProblemViewer } from '@/components/interactive-problem-viewer';

export default function InteractiveProblemPage({
  params
}: {
  params: { problemId: string }
}) {
  return (
    <div className="container mx-auto py-8">
      <InteractiveProblemViewer
        problemId={params.problemId}
        userId="student-demo"
        backendUrl="http://localhost:3001"
      />
    </div>
  );
}
```

Navigate to:
```
http://localhost:3000/interactive/1730000000000-abc123
```

---

## 4. Student Experience

### What Students See

**1. Question Displayed:**
```
┌─────────────────────────────────────┐
│ Basic Derivatives                    │ [Beginner]
│ Question:                            │
│ Find the derivative of f(x) = x²    │
│                                      │
│ f(x) = x^2                          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ① Step 1: Apply the power rule      │
│                          [Reveal →]  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ② Step 2: Simplify                  │
│                          [Reveal →]  │
└─────────────────────────────────────┘
```

**2. Click "Reveal Step 1":**
```
┌─────────────────────────────────────┐
│ ✓ Step 1: Apply the power rule      │
│                                      │
│ For x^n, the derivative is n*x^(n-1)│
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ [Video Playing]                  │ │
│ │ Manim Animation                  │ │
│ │ Power rule demonstration         │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ② Step 2: Simplify                  │
│                          [Reveal →]  │
└─────────────────────────────────────┘
```

**3. Continue clicking to reveal all steps**

**4. See completion:**
```
┌─────────────────────────────────────┐
│ Progress                             │
│ 3 / 3 steps completed    [✓ Done]  │
│ ████████████████████████████ 100%   │
└─────────────────────────────────────┘
```

---

## 5. API Reference

### Generate Problem

```bash
POST /api/interactive/generate
```

**Request:**
```json
{
  "topic": "string",        // e.g., "derivatives", "matrices"
  "difficulty": "beginner", // or "intermediate", "advanced"
  "includeVisualizations": true,
  "includeVideos": true,
  "steps": 3               // optional: number of steps
}
```

**Response:** Problem object with ID

---

### Get Problem

```bash
GET /api/interactive/problems/:problemId?userId=user-123
```

**Response:** Problem + user's progress

---

### Reveal Step

```bash
POST /api/interactive/problems/:problemId/reveal
```

**Request:**
```json
{
  "stepId": "step-1",
  "userId": "user-123"
}
```

**Response:** Step details + media URLs

---

### Get Progress

```bash
GET /api/interactive/progress/:userId/:problemId
```

**Response:** User's progress object

---

## 6. Customization

### Generate Different Topics

**Calculus:**
```json
{
  "topic": "Chain Rule",
  "difficulty": "intermediate",
  "includeVisualizations": true,
  "includeVideos": true
}
```

**Linear Algebra:**
```json
{
  "topic": "Matrix Multiplication",
  "difficulty": "beginner",
  "includeVisualizations": true,
  "includeVideos": false
}
```

**Statistics:**
```json
{
  "topic": "Normal Distribution",
  "difficulty": "advanced",
  "includeVisualizations": true,
  "includeVideos": true
}
```

**Physics:**
```json
{
  "topic": "Newton's Second Law",
  "difficulty": "beginner",
  "includeVisualizations": true,
  "includeVideos": true
}
```

---

## 7. Testing

Run the test script to see examples:

```bash
cd packages/backend
npx tsx test-interactive-system.ts
```

This generates 3 example problems and shows the full workflow.

---

## Troubleshooting

### "Failed to generate problem"
- **Check:** Is `ANTHROPIC_API_KEY` set in `.env`?
- **Check:** Is backend running on port 3001?

### "Video not found"
- **Wait:** Videos render on first reveal (takes ~10 seconds)
- **Check:** Manim installed? `manim --version`

### "CORS error"
- **Check:** Frontend URL in CORS config (`src/index.ts`)
- **Fix:** Add your frontend URL to allowed origins

### "Progress not saving"
- **Note:** Currently in-memory (resets on restart)
- **Solution:** Integrate with Firebase (see documentation)

---

## Next Steps

### 1. Create Problem Library

Generate multiple problems and store them:

```bash
# Generate 10 calculus problems
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/interactive/generate \
    -H "Content-Type: application/json" \
    -d '{"topic": "Calculus Topic '${i}'", "difficulty": "beginner"}'
done
```

### 2. Add to Existing Course

Integrate with your educational content pipeline:

```typescript
const course = {
  modules: [
    { type: 'video', topic: 'Introduction' },
    { type: 'interactive', topic: 'Practice Problem 1' },  // NEW!
    { type: 'video', topic: 'Advanced Concepts' },
    { type: 'interactive', topic: 'Practice Problem 2' }   // NEW!
  ]
};
```

### 3. Student Dashboard

Create a dashboard showing all problems:

```tsx
function StudentDashboard({ userId }) {
  const [problems, setProblems] = useState([]);

  // Fetch all problems
  // Show completion status
  // Filter by subject/difficulty

  return (
    <div className="grid grid-cols-3 gap-4">
      {problems.map(problem => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  );
}
```

---

## Example Workflow

**1. Teacher creates assignment:**
```bash
curl -X POST /api/interactive/generate \
  -d '{"topic": "Derivatives Homework", "steps": 5}'
```

**2. Teacher shares link with students:**
```
https://app.example.com/interactive/problem-id-123
```

**3. Student works through problem:**
- Reads question
- Clicks to reveal steps
- Watches D3 visualizations
- Watches Manim explanations
- Completes all steps

**4. Teacher reviews progress:**
```bash
curl /api/interactive/progress/student-456/problem-id-123
```

**5. System shows analytics:**
```json
{
  "completionRate": 0.85,
  "averageTime": 12.5,
  "strugglingStudents": ["student-789"],
  "mostHintsUsed": 3
}
```

---

## Success Metrics

After students use the system, you should see:

✅ **Higher engagement** - Interactive reveals keep attention
✅ **Better retention** - Step-by-step reduces cognitive load
✅ **Self-paced learning** - Students control reveal speed
✅ **Visual understanding** - D3 + Manim clarify concepts
✅ **Progress tracking** - Know exactly where students are

---

## Resources

- **Full Documentation:** `INTERACTIVE-LEARNING-SYSTEM.md`
- **D3 Engine Docs:** `D3-VIZ-ENGINE-COMPLETE.md`
- **Unified Rendering:** `UNIFIED-D3-MANIM-RENDERING.md`
- **Test Script:** `test-interactive-system.ts`

---

**🎓 You're ready to revolutionize learning!**

Questions? Issues? Check the full documentation or test the API endpoints.
