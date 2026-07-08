# CONTEXT — shared brief for all student-learn v2 build tasks

Read THIS file + your task brief. Do NOT explore the wider repo; everything you need is here.
App root: `apps/student-learn` (Next.js 14 app router, Tailwind, port 3002). You are REPLACING
a rejected v1 — rewrite files freely, keep the routes (`/` and `/lesson/[code]`).

## Identity: "Exam-Paper Light"
The app is a beautifully typeset extension of a student's maths exercise book. Calm, precise,
confident. Nothing glows. A 16-year-old revising on her phone at a kitchen table.

## Tokens (put in globals.css as CSS vars; wire into tailwind.config.ts)
```css
--paper:          oklch(0.97 0.005 250);  /* app background */
--paper-raised:   oklch(0.99 0.003 250);  /* cards/panels */
--grid-line:      oklch(0.92 0.008 250);  /* hairlines, graph rules */
--ink:            oklch(0.25 0.03 260);   /* body text */
--ink-muted:      oklch(0.48 0.02 260);   /* secondary text */
--accent:         oklch(0.42 0.11 255);   /* ink-blue: links, primary actions. ≤10% of screen */
--accent-pressed: oklch(0.36 0.11 255);
--secure:         oklch(0.55 0.10 155);   /* examiner's green tick */
--developing:     oklch(0.65 0.12 75);    /* amber pencil */
/* not-started = --ink-muted at 40% opacity (graphite) */
```
- Never #000/#fff. Never red alone for "wrong" — pair with ✗ glyph + diagnostic copy.
- Graph-paper texture: 8px grid of --grid-line at low opacity over --paper (CSS gradients, on body).
- Margin rule (lg+): single vertical hairline at content's left edge; step numbers/section markers sit in it.

## Type
- Headings: **Fraunces** via `next/font/google`, weight 600, tight leading.
- Body/UI: **Inter** via `next/font/google`, 400/500, ≤70ch lines.
- Math: KaTeX (`katex` + `react-katex` installed; import `katex/dist/katex.min.css` once in layout).
  EVERY math string anywhere (stems, options, feedback) goes through one shared `<MathText>` that
  detects `\( \)` / `$ $` inline delimiters and renders KaTeX; plain segments pass through.
- Scale ratio ≥1.25; hierarchy via size+weight, never color alone.

## Motion
Ease-out-quart, 150–250ms, opacity/transform only. Mastery tick draws in (SVG stroke, 300ms) —
the ONE flourish. Correct/incorrect = background tint fade + glyph. No bounce, no shake, no layout animation.

## HARD BANS (v1 died for these)
Gradient text · glassmorphism/backdrop-blur · indigo/purple palette · glow shadows · hero-metric
stat rows / fake numbers · identical icon-card grids · side-stripe borders >1px · emoji-as-icons ·
modals as first resort · em dashes in UX copy · captions-style UI · `{arr?.length && ...}` JSX
(renders literal 0 — use `{arr && arr.length > 0 && ...}`).

## Data contract
- `GET http://localhost:3001/api/education/topics/:code/lesson` → `{ success, lesson, source, schemaWarnings?: string[] }`
- Canonical lesson type: COPY the shape you need from `packages/shared/src/types/lesson-schema.ts`
  into `apps/student-learn/lib/types.ts` (app must stand alone; do not import across the monorepo).
- Canonical (C1.2): `opening{hook,realWorldConnection}`, `objectives[]`, `theorySections[].content` blocks,
  `misconceptions[]{wrongIdea,whyWrong,exampleOfMistake,correctUnderstanding,correctExample}`,
  `workedExamples[]{question,steps[],answer}`, `practiceQuestions[]`, `quiz{questions[],passingScore}`,
  `summary{keyTakeaways[],examTips[]}`.
- Legacy (C1.5): no `opening`, `learningObjectives` instead of `objectives`, misconceptions are plain
  strings. Render what exists, omit sections cleanly when absent. `schemaWarnings` present ⇒ legacy.
- Live lessons: C1.2 (Introduction to Sets), C1.3 (Powers and Roots), C1.5 (Ordering). Exactly 3.
  NEVER invent counts or placeholder topics.

## Persistence (this phase: localStorage only)
All progress goes through `lib/progress.ts` — a small interface (`getSkillState`, `setSkillState`,
`recordQuizAttempt`, `getQuizAttempts`) with a localStorage impl. UI imports the interface only
(Convex swaps in behind it later). Skill states: `'not-started' | 'developing' | 'secure'`.
Thresholds (exported consts, human will tune): quiz ≥ passingScore ⇒ secure; attempted below ⇒ developing.

## Emotional contract
Mastery, not pass/fail. Every wrong answer diagnoses and links to the theory section that teaches it.
Failure copy = "intersection needs one more pass", never "You failed (58%)". Passing ends with a
next step, not a dead "Try Again".

## Acceptance bar (every task)
- Renders correctly at 390px width FIRST; desktop is the enhancement.
- Keyboard operable; visible focus (accent outline); touch targets ≥44px.
- Loading, error (with Retry button — check `res.ok`), and empty states all designed, none default.
- `npm run build` passes clean in apps/student-learn.
