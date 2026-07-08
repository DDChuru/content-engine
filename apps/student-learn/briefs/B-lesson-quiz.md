# Task B — QuestionCard + LessonPage + quiz-with-review

Read `briefs/CONTEXT.md` first. Foundation from Task A exists (tokens, MathText, MasteryBadge,
lib/progress, lib/types). Deliverables:

## 1. `components/question-card.tsx` — ONE component for practice AND quiz
Props: `question`, `mode: 'practice' | 'quiz'`, `onAnswered(correct: boolean)`, plus quiz-review props below.
- Stem + options through `<MathText>` (v1 rendered quiz math as plain text — fix).
- MC options: full-width tap targets ≥44px, radio semantics (roving tabindex, arrow keys), selected =
  accent hairline ring, NOT filled.
- Submit per-question (practice) → immediate feedback IN the card: correct = secure-green tint fade +
  ✓ + one-line reinforcement; wrong = amber tint (never red-alone) + ✗ + `explanation` +
  **"Review: {theory section title}"** deep link (`#section-id` anchor) when the question has a
  linked section; else link to the lesson's theory top.
- Quiz mode: selection only while answering; after quiz submit, the SAME card renders in review
  state (props: `revealed`, `chosenId`) showing chosen vs correct + explanation + review link.

## 2. Quiz flow (inside lesson page or `components/quiz.tsx`)
- Progress line: "Question 4 of 8 · 3 answered" — always visible, quiet.
- Submit DISABLED until every question answered ("Answer 2 more to submit" on the button).
- Results = mastery framing: per-objective/skill grouping where derivable, else per-question list
  with ✓/✗ + review states. Headline copy: score as "6 of 8 secure", plus e.g. "Set notation is
  secure. Intersection needs one more pass." NEVER "You failed".
- Record attempt via `lib/progress.ts` (updates MasteryBadge state on home).
- Next steps after results: pass ⇒ "Back to the map" primary + "Retake" quiet secondary;
  below passingScore ⇒ "Review the sections you missed" primary (anchors) + "Retake" secondary.
  Retake confirms inline (not a modal) since it clears answers.

## 3. `app/lesson/[code]/page.tsx` — rebuild as a typeset page
- MOBILE-FIRST: single column. Section nav = horizontal stepper (sticky top, scrollspy) on phones;
  ≥lg it becomes the margin column (hairline rule, step numbers). v1's fixed w-64 sidebar is dead.
- Reading order: opening hook (styled as a quiet lede; hero illustration slot
  `public/illustrations/{code}-hook.png` if file exists, `next/image`, full-bleed-ish, degrade to
  nothing) → objectives ("By the end you can…" checklist) → theorySections (continuous typeset
  prose, content blocks: text/latex/example via MathText; NO cards around theory) → misconceptions →
  workedExamples → practice (QuestionCards) → quiz → summary (keyTakeaways + examTips as a revision
  box, exam-paper styled).
- Misconceptions = "The trap / The truth" typeset panels: wrongIdea struck through ink-muted with ✗,
  correctUnderstanding in ink with secure-green ✓, examples via MathText. Legacy string-only
  misconceptions render as a simple trap-list. Omit section entirely when absent.
- workedExamples: numbered steps down the margin rule; each step's math via MathText; answer row
  emphasized with hairline top border.
- Legacy tolerance per CONTEXT: `learningObjectives` fallback, missing opening ⇒ start at objectives.
- Error handling: check `res.ok`; failure state ≠ 404 state; both designed, failure has Retry.

## Acceptance
CONTEXT bar + specifically: C1.2 renders EVERY canonical section (nothing in the data invisible);
C1.5 (legacy) renders cleanly with no empty shells; quiz cannot submit empty; after a failed quiz
every wrong answer has a working deep link into theory; 390px width has zero horizontal scroll.
