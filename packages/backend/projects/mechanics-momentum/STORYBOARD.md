# Momentum storyboard — M4.3a

Author-only handoff: machine A performs TypeScript/preview/visual/media review. No render or dependency install on B.

## Teaching sequence

| Scene | Tempo | Physical visual and teaching purpose | Source |
| --- | --- | --- | --- |
| s01 · Syllabus 4.3: momentum | brisk | A trolley with mass and velocity arrows sits beside the exact labelled syllabus excerpt, then the three outcomes. | Recording 2–25s; official syllabus p.32 |
| s02 · Mass times velocity | brisk | The same physical trolley remains while words, symbols and unit multiplication are handwritten in order. A momentum arrow follows velocity. | Recording 2–25s; PDF p.2, definition only |
| s03 · Two trolleys on separate tracks | brisk | Two trolleys travel continuously on separate parallel tracks: A right, B left; screen speed ratio 1.5. Pause the demonstration at the spoken snapshot cue, not a physical stop. | Recording 26–45s; original comparison |
| s04 · The whole question | brisk | Labelled frozen snapshot. Every given, both unknown momenta, directions, separate-track condition and right-positive arrow are present. Narrate the complete three-line question; ring each mass and speed, then hold before working. | Recording 26–45s; original givens |
| s05 · Trolley A: choose the sign first | slow | Keep both sets of givens visible. Explain right-positive velocity, words then p=mv, signed velocity, substitution, answer. Replace only A's unknown momentum at the spoken twelve cue; complete ink and hold two seconds. | Recording 33–38s; same signed-product method |
| s06 · Trolley B: a negative momentum | slow | Keep A's result and both givens visible. Explain left-negative velocity and positive mass before multiplication. Words/symbols/substitution/result; B's unknown changes at spoken twelve. Equal-length momentum arrows show the equal-magnitude, opposite-direction contrast. | Recording 39–45s; signed result and comparison |
| s07 · What if left becomes positive? | slow | Same physical snapshot and givens, left now positive, both answers unknown again. State the whole question, hold three seconds, then derive both signs using words and symbols first. Physical motion arrows keep their original directions; hold two seconds after each result. | Recording 19–25s and 33–45s; sign-convention application |
| s08 · Momentum: what you can now do | brisk | Keep both trolley diagrams and their direction arrows. Tick exactly the same three outcome phrases used in the opening. | Recording 46–59s |

## Composition contract

- Composition `MechanicsMomentum`; export `MechanicsMomentumProps` and `getMechanicsMomentumDuration(fps)`. Standalone `.entry.tsx` registers only this lesson at 1920×1080, 30 fps.
- Reuse `mechanics-m42/Presentation.tsx` (`Lesson`, `Scene`, `Paper`, `Figure`, `Caption`, palette) and its existing `Ink.tsx`; follow the recent shared-presentation sibling `MechanicsUsingCalculusIn1D.tsx`. The newer Power/lifts references named in the brief are not present in this clone.
- Header + physical diagram + question/ink/outcome panel: at most three regions. Never remove the physical visual for a caption.
- Full question: separate parallel tracks; A 2 kg at 6 m/s right, B 3 kg at 4 m/s left; right positive; find each signed momentum and compare magnitude/direction.
- Use `useCue` with the generated word timestamps. Fixed pen/ring durations are local drawing durations after a real speech cue; they do not schedule narration. Audio remains the timeline source.
- Number events refer to exact source figures, including every repeated substituted value. Canonical event values `2`, `3`, `4`, `6`, `12` let the shared Figure ring select numeric substrings.
- Final numeric labels appear at the exact Whisper word for each answer, independently of substitution beat/ink completion. Unknowns persist until then.
- Constant story velocities use one shared scale, continuous positions, no modulo loop or clamped travel. Frozen holds remove elapsed time from the motion clock. Wheels physically contact their own track. All calculation diagrams explicitly say snapshot.
- The check changes the coordinate convention only. Do not animate a physical reversal or import a collision law.

## Review on A

Render previews only before Durai approves final rendering. Check every setup, general formula, complete handwritten result, number ring, before/after result cue, story motion extreme, equal-magnitude contrast and closing question. Inspect actual PNGs, text/annotation extents, rail/wheel contact, motion ratio, frozen holds and final line completion. B can verify source, arithmetic, speech timing and syntax; B cannot claim rendered visual validation.

## Scope judgement

Source ceiling is the silent 67.3472-second recording, sampled each second. Omit its promotional/browser tail, the PDF-only contact/impulse illustrations, collision conservation, total-system momentum, restitution and energy. The changed-axis check uses the same original comparison; no additional physical trial or numerical scenario is introduced. See FRAME-LOG.md for exact source evidence.
