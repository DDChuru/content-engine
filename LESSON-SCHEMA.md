# Canonical Lesson Schema (FROZEN)

The single, authoritative shape for a student-app IGCSE lesson.

- **Types:** `packages/shared/src/types/lesson-schema.ts` (`CanonicalLesson`)
- **Validator:** `packages/backend/src/services/lesson-validator.ts` (`validateLesson`)
- **Served by:** `GET /api/education/topics/:topicCode/lesson` (local file first, Firestore fallback)

> **Rule: no new lesson ships unless `validateLesson(lesson)` returns `{ valid: true }`.**
> The GET route still returns non-conforming lessons (so legacy content keeps
> loading) but attaches a `schemaWarnings: string[]` array listing every failure.

The canonical shape is the rich **C1.2 "Introduction to Sets"** lesson, plus the
additions the student app needs for progress tracking, spaced repetition, and
per-question analytics.

## The canonical shape (essentials)

```ts
CanonicalLesson {
  id: string
  topicCode: string          // canonical id, e.g. "C1.2" (was `syllabusCode` in C1.2)
  syllabusCode?: string      // exam-board code, e.g. "0580"
  title: string
  level: 'Core' | 'Extended'
  difficulty: 'foundation' | 'core' | 'extended'   // single enum, everywhere

  opening: { hook, realWorldConnection }
  priorKnowledge?: [{ topicCode, topicTitle, specificConcepts[], checkQuestion? }]  // topicCode = linkable
  objectives: [{ id, verb, description, assessable, examWeight }]
  theorySections: [{ id, title, order, introduction, content: ContentBlock[], ... }]
  misconceptions?: [...]
  workedExamples: [{ id, difficulty, question, steps[], answer, ... }]
  practiceQuestions: Question[]
  quiz: { id, title, passingScore, questions: Question[] }
  summaryVideo?: { title, videoPath, ... }
  summary: { keyTakeaways[], examTips[], nextTopics? }
  scorm?: {...}              // optional
  generation?: {...}
}
```

`ContentBlock` is a typed union on `type`: `gemini-diagram | svg-animation |
manim-animation | latex-formula | interactive | text`. Every block has a
required `id`; `text` blocks additionally require `body` (the display prose, for
text-first lessons). Media path fields (`imagePath`, `videoPath`) must be
**non-empty strings when present**.

Embedded worked-example / practice-question / quiz block types are **NOT**
canonical — the top-level `workedExamples`, `practiceQuestions`, and `quiz`
arrays are the single source of truth; renderers order them within a section via
`section.relatedExamples`.

## Question shape — a discriminated union on `questionType`

`Question = MultipleChoiceQuestion | FreeResponseQuestion`. Both share a
`QuestionBase`; the answer encoding differs by branch and the branches do not
overlap (MC has no answer field; free-response has no options).

```ts
// Shared by BOTH branches (QuestionBase):
{
  id: string            // stable, lesson-unique. Convention: `<topicCode>-p<N>` / `<topicCode>-q<N>`
  skillTag: string      // mastery / spaced-repetition key, e.g. "sets.union", "sets.venn-regions"
  difficulty: 'foundation' | 'core' | 'extended'
  question: string      // REQUIRED (non-empty)
  hint?: string
  solutionSteps?: string[]
  feedbackCorrect: string         // REQUIRED on every question
  feedbackIncorrect: string       // REQUIRED on every question
  addressesMisconception?: string
}

// Branch A — MultipleChoiceQuestion:
{
  ...QuestionBase
  questionType: 'multiple-choice'
  options: { id: string; text: string }[]   // REQUIRED, non-empty
  correctOptionId: string                    // REQUIRED, must match one options[].id
  // NO correctAnswer / answer field — structurally excluded
}

// Branch B — FreeResponseQuestion:
{
  ...QuestionBase
  questionType: 'numeric' | 'short-answer' | 'true-false'
  correctAnswer: string           // REQUIRED
  acceptableAnswers?: string[]
  // NO options / correctOptionId
}
```

**Killed formats** (rejected by `validateLesson` for new lessons): on a
multiple-choice question — `options[].isCorrect` boolean flags, a bare `answer`
field, and `correctAnswer` in any form (legacy string **or** numeric index).
Multiple-choice is **only** `options: {id,text}[]` + `correctOptionId`;
free-response is **only** `correctAnswer`.

## What `validateLesson` checks

- Required top-level fields present and non-empty: `id`, `topicCode`, `title`, `level`.
- Lesson `difficulty` is one of `foundation | core | extended`.
- `objectives` and `theorySections` are non-empty arrays.
- Content-block `imagePath` / `videoPath` and `summaryVideo.videoPath` are non-empty strings when present.
- Every practice and quiz question:
  - has a stable `id`, and all ids are **unique across the whole lesson**;
  - has a non-empty `skillTag`;
  - has a valid `difficulty` enum value;
  - has `feedbackCorrect` and `feedbackIncorrect`;
  - if `multiple-choice`: non-empty `options[]` with unique ids and text, no
    `isCorrect` flags, and a `correctOptionId` that matches an option id;
  - otherwise: a non-empty `correctAnswer`.

## Two schemas exist — canonical vs legacy generator (known follow-up)

There are currently **two** lesson schemas in the codebase:

| | File | Role |
|---|---|---|
| **Canonical (this doc)** | `packages/shared/src/types/lesson-schema.ts` | The frozen student-app contract. Validated by `validateLesson`. Source of truth. |
| **Legacy generator-internal** | `packages/backend/src/education/lesson-schema.ts` | The older shape the content generator emits. Imported by `lesson-generator.ts`, `generate-lesson.ts`, `batch-generate.ts`, `visual-generator.ts`. |

The generator (`src/education/lesson-generator.ts`) is what will **produce** new
lessons, and it still emits the legacy shape. Until it is aligned, **generator
output must be migrated/validated against the canonical schema (run
`validateLesson`) before shipping** — a raw generator lesson is not
publishable as-is.

**Aligning the generator to emit the canonical schema is a known follow-up
task** and is intentionally out of scope here (no generator refactor was done).
The only edit made to the legacy file is a one-line pointer comment at its top.

## Migration deltas

### C1.3 "Powers and Roots" — POLISH (migrate in place)
Already the rich schema. To conform:
1. Add `topicCode: "C1.3"` (currently only `syllabusCode: "C1.3"`).
2. Give every practice + quiz question a stable `id` (`c1.3-p1…`, `c1.3-q1…`) and a `skillTag`.
3. Convert quiz questions from `options[].isCorrect` → `options: {id,text}[]` + `correctOptionId`.
4. Add `feedbackCorrect` / `feedbackIncorrect` to all quiz questions (they currently have none).
5. Fill or remove the missing media refs (2 images + 1 video that don't exist on disk).

### C1.5 "Ordering" — REGENERATE (legacy schema)
Uses a divergent flat schema; migrating ≈ regenerating. Regenerate against the C1.2 template:
- `learningObjectives: string[]` → `objectives: [{...}]`; `prerequisites: string[]` → `priorKnowledge` with linkable `topicCode`.
- `theorySections[].content` string → typed `ContentBlock[]`; add `opening`, `summary`, `scorm`.
- Quiz numeric-index answers → `options: {id,text}[]` + `correctOptionId`; add per-question `id`, `skillTag`, feedback.
- Normalise difficulty `easy|medium|hard` → `foundation|core|extended`.
- Fix the known wrong answer in practice **q5** (ascending order of `3/8, 0.4, 35%, 2/5` is `35%, 3/8, 2/5, 0.4`).
