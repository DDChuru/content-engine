# Task C — VennBoard (replaces interactive-venn-diagram.tsx)

Read `briefs/CONTEXT.md` first. Foundation + QuestionCard exist. This kills v1's worst P0:
HTML5 drag events never fire on touch, so the flagship interactive was dead on phones.

## Interaction model: tap-to-select → tap-region-to-place (NO drag anywhere)
- Element chips (e.g. numbers/names to classify) in a tray below the diagram. Tap a chip ⇒ selected
  (accent ring, aria-pressed). Tap a Venn region (A only, B only, A∩B, outside ξ) ⇒ chip moves there
  with a 200ms ease-out-quart transform. Tap a PLACED chip ⇒ picks it back up (reversible — v1's
  only recovery was full Reset; keep Reset as quiet secondary).
- Keyboard: chips and regions in tab order; Enter/Space selects and places; focus visible.
- Touch targets: regions are large SVG hit areas; chips ≥44px.

## Rendering
- SVG diagram in the exam-paper language: paper background, circles as ink hairline strokes
  (1.5px, --ink), region labels A, B, ξ in Fraunces italic; selected/active region gets a very light
  accent tint (≤8% opacity). No fills, no glow, no gradients.
- Chips: paper-raised pills, hairline border, ink text, MathText-capable content.

## Checking & feedback
- "Check" button (accent, disabled until all chips placed, with "Place 3 more" hint).
- Feedback per chip: correct = secure-green hairline + ✓; misplaced = amber hairline + ✗ and a
  one-line diagnosis ("7 is in both sets, so it lives in the intersection") — generate from the
  correct region, never bare "wrong". Misplaced chips stay placed so the student can move them;
  "Check" becomes "Check again".
- All correct ⇒ single mastery-tick draw-in (the earned flourish) + quiet "Every element in its
  place." No confetti, no XP.

## API
`components/venn-board.tsx`, props: `universe: string[]`, `setA: {label, members: string[]}`,
`setB: {label, members: string[]}`, `onComplete?()`. Wire into the lesson page wherever v1 used
interactive-venn-diagram (C1.2 theory/practice). Delete `components/interactive-venn-diagram.tsx`.

## Acceptance
CONTEXT bar + specifically: fully operable with ONLY taps (test the handlers are onClick/pointer,
zero drag events in the file); fully operable with ONLY keyboard; a misplaced chip is recoverable
in one tap; works at 390px with the tray not overlapping the diagram.
