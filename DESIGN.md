# DESIGN.md — Exam-Paper Light (apps/student-learn)

The visual language of Cambridge maths itself: warm paper white, graph-paper structure, examiner's ink. Calm, precise, confident. Nothing glows.

## Scene sentence

A 16-year-old revising on her phone at a kitchen table on a Tuesday evening, maths exercise book open next to the phone — the app should feel like a beautifully typeset extension of that exercise book, not a game or a dashboard.

## Color (OKLCH; never #000/#fff; all neutrals tinted toward ink-blue)

Strategy: **Restrained** — paper neutrals + one committed ink accent, with mastery states as the only other color voice.

- `--paper`: oklch(0.97 0.005 250) — warm paper white, app background
- `--paper-raised`: oklch(0.99 0.003 250) — cards/panels sitting on paper
- `--grid-line`: oklch(0.92 0.008 250) — graph-paper rules, hairline borders
- `--ink`: oklch(0.25 0.03 260) — body text, the "pen"
- `--ink-muted`: oklch(0.48 0.02 260) — secondary text
- `--accent`: oklch(0.42 0.11 255) — ink-blue; links, primary actions, active states. ≤10% of any screen.
- `--accent-pressed`: oklch(0.36 0.11 255)
- Mastery semantics (the one place more color is allowed):
  - secure: oklch(0.55 0.10 155) — examiner's green tick
  - developing: oklch(0.65 0.12 75) — amber pencil
  - not-started: `--ink-muted` at 40% — graphite
  - Never use red for "wrong" alone; pair with the ✗ glyph and diagnostic copy (colorblind-safe).
- Dark mode: not themed at launch. Lesson videos are dark-navy (#070b16) by design — projector contrast, leave them.

## Typography

- Display/headings: **Fraunces** (via next/font, actually loaded) — bookish authority, exam-paper serif feel. Weight 600, tight leading.
- Body/UI: **Inter** (via next/font) — weight 400/500, line length ≤70ch.
- Math: KaTeX everywhere math appears, including quiz options and question stems — no plain-text math next to typeset math. Inline math detection on `\( \)` / `$ $` delimiters.
- Scale ratio ≥1.25 between steps; hierarchy via size + weight, never color alone.

## Texture & layout

- Graph-paper background: 8px grid of `--grid-line` at low opacity on `--paper`, sections aligned to it. This is the identity move — subtle, structural, unmistakably maths.
- Margin rule: a single vertical hairline at the content's left edge on wide screens (exam-script margin), used for step numbers and section markers. This replaces any side-stripe accent borders (banned).
- Cards only where an affordance needs a boundary (question cards). Theory reads as a continuous typeset page, not stacked cards.
- Mobile-first: single column below lg; lesson section nav is a horizontal stepper on phones, margin column on desktop.

## Motion

- Ease-out-quart, 150–250ms. No bounce, no elastic, no layout-property animation.
- Mastery tick draws in (SVG stroke, 300ms) — the one earned flourish, at the peak moment.
- Correct/incorrect feedback: background tint fade + glyph, no shaking, no red flashes.

## Bans (inherited from critique + impeccable)

Gradient text, glassmorphism/backdrop-blur, indigo/purple gradient palette, glow shadows, hero-metric stat rows, identical icon-card grids, side-stripe borders >1px, emoji-as-icons, modals as first resort, em dashes in UX copy.

## Components (build order)

1. `MasteryBadge` — the graphite→amber→green skill state, tick-draw animation.
2. `QuestionCard` — KaTeX-aware stem/options, canonical MC (options + correctOptionId), post-submit diagnosis state with "review this section" deep link.
3. `SyllabusMap` — units as typeset chapter list with per-skill mastery dots; the home surface.
4. `LessonPage` — continuous typeset theory with text/latex/diagram/video blocks, margin stepper.
5. `VennBoard` — tap-to-select → tap-region-to-place (touch + keyboard), replaces drag.
