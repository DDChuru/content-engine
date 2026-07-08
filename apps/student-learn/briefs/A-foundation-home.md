# Task A — Foundation + MasteryBadge + SyllabusMap home

Read `briefs/CONTEXT.md` first. Deliverables:

## 1. Foundation
- `app/globals.css` — tokens as CSS vars, graph-paper body texture, KaTeX css import in layout.
- `tailwind.config.ts` — map tokens (`paper`, `paper-raised`, `grid-line`, `ink`, `ink-muted`,
  `accent`, `accent-pressed`, `secure`, `developing`) so components use `text-ink`, `bg-paper`, etc.
- `app/layout.tsx` — Fraunces + Inter via next/font (CSS vars), lang="en", metadata
  (title: "Cambridge Maths — learn topic by topic"), `katex/dist/katex.min.css` import.
- `components/math-text.tsx` — `<MathText>` per CONTEXT (inline `\( \)` / `$ $` detection → KaTeX).
- `lib/types.ts` — lesson types (copy shape from CONTEXT §Data contract).
- `lib/progress.ts` — persistence interface + localStorage impl per CONTEXT §Persistence.
- Delete v1 slop: purge every gradient, `.glass-card`, indigo/purple hex, emoji icon from the app.

## 2. `components/mastery-badge.tsx`
The skill-state mark. Props: `state: 'not-started' | 'developing' | 'secure'`, `size?: 'sm' | 'md'`.
- not-started: hollow graphite dot (ink-muted @40%).
- developing: amber pencil dot, small "in progress" ring.
- secure: green tick that DRAWS IN (SVG stroke-dashoffset, 300ms ease-out-quart) when it first
  appears; static tick on later renders (track "seen" in memory, not localStorage).
- Accessible label ("Secure", "Needs one more pass", "Not started yet") via title/aria.

## 3. `app/page.tsx` — the home = SyllabusMap
Replace the hero + fake metrics ENTIRELY.
- Header: "Cambridge IGCSE Mathematics 0580" small-caps kicker; Fraunces H1 "Learn it topic by topic.";
  one calm sentence. NO stat row, NO hero metrics.
- The map: a typeset chapter list (an exam paper's contents page). Unit C1 "Number" as a section
  heading; under it, its topics as rows: topic code in the margin column (monospace-ish, ink-muted),
  title in ink, MasteryBadge on the right (state from `lib/progress.ts`).
- The 3 live topics (C1.2, C1.3, C1.5) are links (`next/link`) to `/lesson/[code]`, styled available.
  Other C1 topics render as typeset rows marked "coming soon" in ink-muted — visibly planned, honestly
  unavailable, NOT clickable, no dead cards.
- Honest framing: if user has no progress, a quiet line: "3 lessons are live. Start with any."
  Optional spot illustration slot: `public/illustrations/empty-progress.png` if the file exists
  (`next/image`, max-w ~200px, decorative alt="") — build the slot to degrade to nothing if missing.
- Units C2–C9: listed as future sections in ink-muted at the bottom under "Coming next", plain
  typeset lines. No cards, no icons.
- Mobile: single column; margin column collapses to inline code prefix.

## Acceptance
CONTEXT acceptance bar + specifically: zero fake numbers anywhere; home renders meaningfully with
localStorage empty AND with a recorded quiz attempt (hand-test by seeding localStorage);
`npm run build` clean.
