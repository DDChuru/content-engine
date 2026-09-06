# Storyboard: Modelling assumptions

Original 16:9 explainer: **5 minutes (300 seconds), eight scenes**. This task supplies the script and teaching directions; composition and audio production follow separately.

Read against `../mechanics-syllabus-map/TEACHING-STANDARD.md`, then `../mechanics-syllabus-map/PACING.md`. Concept source: `NOTES.md`. Cambridge source and exact opening excerpts: `../mechanics-syllabus-map/SYLLABUS-9709-MECHANICS.md`, printed pp. 31 and 33. That source map is explicitly a summary pending the full requested extraction; its two quoted opening excerpts have been checked against the official PDF.

## Syllabus and outcomes

Open with these exact excerpts, in this order:

- **Syllabus 4.1**, p. 31, smooth-contact bullet, opening excerpt: “use the model of a ‘smooth’ contact”. The remainder of that bullet concerns the model's limitations; do not imply the excerpt is the complete statement.
- **Syllabus 4.4**, p. 33, connected-particles bullet, complete statement: “solve simple problems which may be modelled as the motion of connected particles.”

The general Paper 4 introduction on p. 31 establishes particle modelling. The 4.4 notes give the light inextensible string and smooth pulley example. There is **no standalone general modelling-vocabulary list** in this edition. Do not attribute the full vocabulary table in `NOTES.md` to Cambridge. Extended-body moments and lamina centroids are retained as supplementary vocabulary in S05, explicitly distinguished from this paper's particle treatment.

**By the end you can...**

1. **Explain what modelling words let you ignore.**
2. **Find acceleration and tension.**
3. **Predict changes when assumptions fail.**

These are O1, O2 and O3 below. Show each bullet separately in the same card position; the recap uses these exact words and ticks each in turn.

## Presentation and timing contract

- One ordinary example throughout: a box on a horizontal table, pulled by a string over a fixed pulley at the table's right edge, with a second box hanging below it. All contrasts modify this example or examine one of its parts. Return each changed assumption to its original state before testing another.
- One plain background, neutral ink and **one accent colour** for the current object, force or result. One short header. No decorative framing, index, simultaneous glossary or captions/subtitles. On-screen text consists only of the specified teaching cards, diagram labels and working.
- **At most three visual regions including the header:** header + diagram + either one card or one paper panel. At the opening/recap: header + one card. A detail view replaces the diagram; it never opens another region. An equation panel has at most three visible lines; move to a fresh paper area between derivations, never during a hold.
- **At most twelve words on any card**, including its citation if present. Long quotation text continues across successive cards without changing its wording. Each outcome is a separate card. A term label and an arrow belong to separate spoken events; never reveal a bundle of terms, forces or panels together.
- Say each modelling term as its label appears; explain the reason, then change the same drawing to show the assumption failing. These are explanatory pictures, not transcription overlays. Motion arrows and force arrows are visually distinct and named before use.
- Times below are **local editorial budgets**, inclusive of transitions, speech and silence. At composition time, generate audio first and use word-level transcript timestamps and `useCue()` for reveals. Inspect the transcript JSON before building. Adjust delivery or gaps within these budgets; do not impose visual keyframes independently of speech or speed up narration to rescue an overfull scene.
- `tempo: brisk` uses `voiceSpeed: 1.0`; `tempo: slow` uses `voiceSpeed: 0.9`, passed to `voice_settings.speed` / `ELEVENLABS_SPEED`. Brisk teaching beats are about 3–5 seconds apart. Slow scenes have only **three main cue anchors**, at least eight seconds apart. Within an anchor, pen strokes and changes to the existing drawing follow the individual spoken words, one element at a time; they are not extra panel/card reveals.
- Bracketed directions are silent and excluded from TTS. Ellipses mark breaths; bracketed pauses must be real inserted silence. A **ringed hold** means the pen has finished, the number and its meaning have been spoken, and its emphasis ring is complete; then everything freezes for **2 seconds / 60 frames**. Nothing new appears or moves. The check question has **3 seconds / 90 frames** of silence before its answer.
- S05 has additional slow time to preserve the breadth of `NOTES.md`. S06 and S07 are the two required slow reasoning scenes. Do not compress S05 into a rapid vocabulary montage.

## S01 — What you will learn

**Duration:** 20 seconds (00:00–00:20)
tempo: brisk
voiceSpeed: 1.0
**Maps to:** O1, O2, O3.

**Viewer sees:** A plain syllabus card, then the three outcomes one at a time. No example diagram yet. Source references belong to their quotation cards and appear with those excerpts. For the second quote, replace the first text card with its continuation; do not accumulate text.

| Local budget | Spoken words / cue | Card (exact display text) |
|---|---|---|
| 00–04 s | “Syllabus: use the model of a smooth contact.” | Header `Syllabus 4.1 · p.31`; card `use the model of a ‘smooth’ contact` |
| 04–07 s | “solve simple problems which may be modelled...” | Header `Syllabus 4.4 · p.33` replaces the previous reference; card `solve simple problems which may be modelled` |
| 07–10 s | “...as the motion of connected particles.” | Replace card: `as the motion of connected particles.` |
| 10–15 s | “By the end you can... explain what modelling words let you ignore.” | Header `By the end you can...`; O1 card |
| 15–17 s | “Find acceleration and tension.” | Replace with O2 card |
| 17–20 s | “Predict changes when assumptions fail.” | Replace with O3 card |

**Delivery:** The opening is a reading task. Allow the quote continuation its full beat. The source headers are not an extra text region. A source reference is part of its quotation, not an independent teaching reveal.

## S02 — What a particle model ignores

**Duration:** 20 seconds (00:20–00:40)
tempo: brisk
voiceSpeed: 1.0
**Maps to:** O1, O3.

**Narration:** “A hanging box pulls this box on the table through string over a pulley. A particle keeps mass but ignores size: we track translation. If it tips, size matters. Air resistance neglected means no drag. Include air resistance, and drag changes the resultant.”

**Say → show → failure:**

- “box”, “table”, “string”, “pulley”: introduce those parts consecutively as spoken, as one developing diagram. Introduce the hanging box first, on “hanging box”, and connect the developing drawing as each part is named.
- About 06 s, “particle”: show the card `Particle`; replace the table box's outline with a mass point. On “mass”, retain its mass dot; no massless symbol. On “size”, omit the outline. “Track translation” explains the approximation's purpose.
- About 10 s, “tips”: restore the box outline and tilt it about an edge. This shows why a point cannot represent rotation. Restore the ordinary sliding box before continuing.
- About 14 s, “air resistance neglected”: show this three-word card; leave the diagram without a drag arrow. On “include air resistance”, replace it with `Air resistance included`; on “drag”, draw one opposing arrow. Its addition changes the force sum even though the box may still be treated as a particle. Return to omitted drag at the end.

## S03 — Why light and smooth give one tension

**Duration:** 20 seconds (00:40–01:00)
tempo: brisk
voiceSpeed: 1.0
**Maps to:** O1, O2, O3.

**Narration:** “Light means negligible mass. A light string needs no force to accelerate itself; a heavy string does. A light pulley has negligible rotational inertia; a massive pulley resists spin changes. A smooth pulley has no friction. Together, these give equal tensions. A rough pulley can make them unequal.”

**Say → show → failure:**

- About 00 s, “light string”: accent the existing string; its own weight and inertia are omitted. On “heavy string”, thicken that same string and draw its weight on the spoken “heavy”, then a net-force difference along it on “does”. Restore the light string before changing the pulley. A massive accelerating string needs a resultant force, so its end tensions cannot simply be assumed equal.
- About 05 s, “light pulley”: accent the existing pulley. On “massive pulley”, give that wheel a heavier rim; on “resists spin changes”, show unequal pulls turning it. Restore negligible inertia before introducing friction.
- About 10 s, “smooth”: clear the pulley-contact friction mark as a continuous erasure. On “no friction”, settle without tangential resistance. Light alone has not supplied this condition.
- About 15 s, “equal tensions”: write `T` beside one string segment on “equal”, then the second `T` on “tensions”. No inertia needs accelerating and no contact friction changes the pull. On “rough pulley”, add a friction mark; on “unequal”, change one label to `T₂` and then the other to `T₁` through consecutive pen strokes. Restore the smooth, light pulley for S04.

**Card:** `Light string`, then `Light pulley`, then `Smooth pulley`, replacing in place as each term is spoken. “Light” concerns mass; “smooth” concerns friction. Force symbols are diagram labels, not a second card.

## S04 — Why a taut string links the motion

**Duration:** 20 seconds (01:00–01:20)
tempo: brisk
voiceSpeed: 1.0
**Maps to:** O1, O2, O3.

**Narration:** “Inextensible means fixed length. While taut, any length gained here is lost there, so the boxes have equal speed and acceleration magnitudes, in different directions. An extensible string stretches, breaking that link. A slack string cannot pull or push, so it gives neither tension nor linked motion.”

**Say → show → failure:**

- About 00 s, “inextensible”: accent the existing string with the card `Inextensible: fixed length`. On “taut”, straighten it fully. No motion yet.
- About 05 s, “gained here” then “lost there”: draw matching travel strokes consecutively: the hanging vertical segment gains length as its box moves down; the table segment loses length as its box moves right. Move the connected drawing only after both strokes are explained. On “acceleration”, label the existing path arrows `a` in sequence. Equal magnitudes follow from the fixed total length; these are not equal vectors.
- About 10 s, “extensible”: replace the card with `Extensible: length can change`; stretch the same string while one box initially stays still. The unequal movements show why one common acceleration is no longer justified.
- About 15 s, “slack”: let the same string sag. On “neither tension”, erase its pull arrow; on “nor linked motion”, move one box slightly without the other. Restore taut, inextensible string before the next scene. A string cannot transmit thrust.

## S05 — What the other modelling words mean

**Duration:** 70 seconds (01:20–02:30)
tempo: slow
voiceSpeed: 0.9
**Maps to:** O1, O3.

**Scope:** Preserve the remaining vocabulary from `NOTES.md` without turning the calculation into an extended-body problem. All views are details or temporary alternatives within the same table-and-box example. Use header + one close-up drawing + one term card. Restore each detail before replacing it. No numerical examples or extra systems.

**Main cue anchors:** “other words” at about 00 s; “uniform” at about 25 s; “bead” at about 47 s. Continuous drawing within each beat follows the spoken terms; never display a collection of cards.

| Local budget | Narration, with written pauses | One developing detail: definition, reason, then failure |
|---|---|---|
| 00–07 s | “These other words describe parts of our example. Paper Four treats bodies as particles; turning effects here are extra context.” | Keep the box-and-table outline. Card `Extra vocabulary`; no equation. Point to each detail only when it is named below. |
| 07–17 s | “A rigid rod, like this brace, keeps its shape, so it can push or pull. A flexible brace bends.” | Replace the overview with a table-brace detail. Card `Rigid rod`. Show compression, then tension as consecutive arrow strokes; change the brace's shape on “bends”, showing its endpoints no longer stay a fixed distance apart. |
| 17–25 s | “A light rod ignores its own mass; a heavy one adds weight. A beam keeps force positions because they affect turning.” | Same brace: card `Light rod`; add its weight only on “heavy”. Then replace the detail with the table's long supporting beam on “beam”. Show separated force application points one at a time on “positions”. On “turning”, collapse to a point briefly: the lever arms disappear, demonstrating what a particle approximation cannot represent. Restore the length. |
| 25–35 s | “Uniform means evenly spread mass. A uniform rod balances at its midpoint. Uneven mass shifts that point.” | Card `Uniform rod`; spread neutral mass marks along the same support with continuous pen motion. Add its midpoint weight arrow on “midpoint”, then move the balance/weight point towards a visibly heavier end on “shifts”. Assume uniform gravity for this and the next detail. |
| 35–47 s | “A lamina is a thin sheet, like this label: ignore thickness. A thick plate needs depth. A uniform lamina balances at its area centroid; uneven mass shifts it.” | Replace detail with the box's thin label. Card `Lamina`; rotate its edge slightly on “thickness”. Thicken it on “thick plate”, then restore the sheet. Card changes to `Uniform lamina` on that phrase. Show centroid weight on “centroid”; darken one side on “uneven”, then move the weight point on “shifts”. |
| 47–59 s | “A bead follows a wire's path; detached, it can leave. The wire ignores thickness. A thick guide needs clearance. Smooth contact gives a perpendicular reaction; rough contact adds friction.” | Temporarily show the string attachment as a bead sliding on a fixed guide wire beside the table box. Card `Bead`, then `Wire`, on their words. Detach the bead to show loss of constraint; restore it. Thicken the wire on “thick guide” to show the fit matters, then restore. Draw only the normal reaction on “perpendicular”; add a tangential friction arrow on “friction”. |
| 59–70 s | “A fixed peg can replace the pulley; moving it changes the path constraint. A smooth peg preserves tension with light string; a rough peg may not.” | Replace the guide detail with the original pulley location. Card `Peg`; replace wheel with a fixed peg on “peg”. Move the peg on “moving”, showing a changing string path; restore fixed support. Card `Smooth peg` on that phrase; matching tension labels are written consecutively on “preserves tension”. On “rough peg”, add contact friction, then alter one tension label on “may not”. Restore the original pulley. |

**Delivery:** A brief breath at each full stop; no numerical holds in this vocabulary scene. The plane/smooth-surface/rough-surface contrasts receive their slower causal explanation in S07. The non-rigid, non-light, non-uniform, finite-thickness, unconstrained and non-smooth alternatives above are actual changes to the drawing, not merely spoken caveats.

## S06 — Find acceleration and tension

**Duration:** 75 seconds (02:30–03:45)
tempo: slow
voiceSpeed: 0.9
**Maps to:** O2, supported by O1.

**Goal:** Calculate the common acceleration magnitude and string tension. Restore the original example before starting: particles, smooth horizontal table, light taut inextensible string, smooth light fixed pulley, no air resistance. These are the assumptions just demonstrated; do not introduce a stack of assumption cards. Keep the header, one diagram and one paper panel for this entire scene.

**Numerical choice:** Use `g = 10 m s⁻²`, matching the expectation in the official 4.4 notes. This deliberately changes the `g = 9.8` variant in `NOTES.md`; the masses and method are retained. The corresponding answers are `a = 4 m s⁻²` and `T = 12 N`.

**Main cue anchors:** “find” near 00 s; “forces” near 21 s; “acceleration” near 53 s. Within them, a visible pen writes the diagram labels and every working line in spoken order. Use original handwritten strokes with pen lifts, following the ink-tutor workflow; never reveal a typeset equation or a finished line. All force arrows are in place before writing the force equations. The existing `a` arrows give the positive directions: right for the table box, down for the hanging box.

| Local budget | Narration, including silence | Writing / enforced hold |
|---|---|---|
| 00–07 s | “Let's find the acceleration and tension. The table box is three kilograms. [hold 2 s]” | Write `3 kg` as it is spoken. Ring it; freeze 05–07 s. |
| 07–13 s | “Two kilograms hangs; its weight drives the motion. [hold 2 s]” | Write `2 kg`; ring it; freeze 11–13 s. |
| 13–21 s | “Use g equals ten metres per second squared: gravitational acceleration. [hold 2 s]” | Write `g = 10 m s⁻²`; ring `10`; freeze 19–21 s. |
| 21–30 s | “The forces: box weight down, reaction up, tension right. Hanging weight down, tension up. Vertical forces on the table box balance.” | Draw five arrows consecutively on their named force/direction, with labels `3g`, `R`, `T`, `2g`, `T`. They sit within the one system diagram. The balanced vertical pair explains why the table box's weight does not drive its horizontal acceleration. |
| 30–38 s | “Why these equations? [pause 1 s] Resultant force equals mass times acceleration. For the smooth table box, tension alone gives three a.” | Handwrite `T = 3a`. No friction because the table is smooth. Explain the line before beginning the next one. |
| 38–45 s | “For the hanging box, weight minus tension gives two a: downward is positive.” | Next handwritten line: `2g − T = 2a`. Trace the existing down/up arrows individually on “weight” and “tension”. |
| 45–53 s | “Add: equal tensions cancel. Five kilograms is the total moving mass. [hold 2 s]” | Third line: `2g = (3 + 2)a = 5a`. Ring `5`; freeze 51–53 s. One tension follows from the light string and smooth light pulley; one acceleration magnitude follows from the taut fixed-length string. These were explained in S03–S04. |
| 53–64 s | “What acceleration follows? [pause 1 s] Four metres per second squared. Each box gains four metres per second every second. [hold 2 s]” | After the question, move to a fresh part of the same paper. Retain only the copied system equation above the next handwritten line: `a = 2(10)/5 = 4 m s⁻²`. Finish the result as “four” is spoken; ring it after the explanation; freeze 62–64 s. |
| 64–75 s | “And tension? [pause 1 s] Substitute into T equals three a. Twelve newtons: the pull on either box. [hold 2 s]” | Third visible line: `T = 3(4) = 12 N`. Finish `12` as it is spoken; ring it after “either box”; freeze 73–75 s. No motion of either box during reading or holds. |

## S07 — What changes when the table is rough

**Duration:** 55 seconds (03:45–04:40)
tempo: slow
voiceSpeed: 0.9
**Maps to:** O3, supported by O1 and O2.

**Main cue anchors:** “plane” near 00 s; “rough” near 18 s; “question” near 36 s. Keep header + same system diagram + same paper panel. Clear completed numerical working between scenes, retaining `a = 4 m s⁻²` with the small label `Smooth table only` until the comparison has been made. Write the new working by hand, one line at a time. The question replaces the paper content temporarily, so there is never a fourth region.

| Local budget | Narration, including silence | Definition, contrast and working |
|---|---|---|
| 00–10 s | “A plane models our table as flat and rigid. On a curved or bending surface, the contact direction changes. [pause 1 s]” | On “plane”, trace the flat surface; curve it on “curved”, then flex it on “bending”, carrying the existing reaction direction with the local surface normal. Restore the flat table. No new worked example. |
| 10–18 s | “Smooth means no friction, so contact gives only the perpendicular reaction. What changes if our table is rough? [pause 1 s]” | Accent the existing `R` on “perpendicular”. Leave the no-friction case visible while posing the change. |
| 18–27 s | “Rough allows friction. Our box slides right, so friction opposes that slide. Tension minus friction now accelerates the box.” | On “rough”, alter the contact texture. On “friction”, add just the leftward `F` arrow. Handwrite `T − F = 3a` with the spoken explanation. Keep `2g − T = 2a` as the next line, traced on the hanging box explanation below. |
| 27–36 s | “Add the unchanged hanging equation: two g minus F equals five a. Less driving force means less acceleration.” | Trace `2g − T = 2a`, then write `2g − F = 5a` as the third line. Compare with the smooth result; this concerns the same rightward sliding motion, with sufficient driving force to keep accelerating right. No invented friction value. If resistance is greater, positive acceleration is not guaranteed. |
| 36–51 s | “Question: does rough always mean F equals mu R? [hold 3 s] No. Below the limit, static friction adjusts. Equality needs limiting friction, or the stated sliding model.” | Replace paper with the sole question card `Does rough always mean F = μR?`; finish the question by 40 s. Freeze 40–43 s, with no answer cue. Say “No” only at 43 s. On “below the limit”, replace the question with handwritten `0 ≤ F ≤ μR`. On “equality”, write `F = μR`; on “limiting”, add the short condition `Limiting or stated sliding model`. Rough permits friction; it does not prescribe the maximum in every situation. At rest its direction opposes impending relative sliding. |
| 51–55 s | “Choose, solve, interpret; check size, sign, units and plausibility; refine.” | Leave the settled diagram visible. Trace the changed friction term as the reason to refine the original prediction. No final card or new diagram during this closing sentence. |

## S08 — Check the three outcomes

**Duration:** 20 seconds (04:40–05:00)
tempo: brisk
voiceSpeed: 1.0
**Maps to:** O1, O2, O3, using exactly the opening wording.

**Viewer sees:** Header `By the end you can...` and one outcome card at a time. Each tick is drawn on the final word of its spoken outcome, after the card has appeared. No glossary or accumulated grid. The box-and-table diagram has cleared before the first card appears.

| Local budget | Narration | Card and tick |
|---|---|---|
| 00–06 s | “Explain what modelling words let you ignore. You can now give a reason.” | O1 verbatim; tick on “ignore”. |
| 06–13 s | “Find acceleration and tension. Each assumption justified part of our equations.” | O2 verbatim; tick on “tension”. |
| 13–20 s | “Predict changes when assumptions fail. Rough contact added friction. Keep checking your model.” | O3 verbatim; tick on “fails”. Hold the ticked card through the final breath. |

## Handoff checks

- Duration budgets: `20, 20, 20, 20, 70, 75, 55, 20` seconds, totalling **300 seconds / 9000 frames at 30 fps**. Transitions are included. Voice fit and transcript alignment must be measured in the composition task; these are script budgets, not a claim of rendered timing.
- Definitions and failure contrasts: particle/air resistance S02; light string/light pulley/smooth or rough pulley S03; taut/inextensible/extensible/slack string S04; rigid rod/light rod/beam/uniform rod/lamina/uniform lamina/bead/wire/smooth or rough peg S05; plane/smooth or rough surface S07. Each has a spoken term, a drawing and a changed drawing when its assumption is removed.
- `NOTES.md` coverage is conceptual, not four separate worked examples: the connected-box calculation carries the force laws; S02 carries the no-drag caveat; S05 carries the rod/beam/lamina and bead/wire/peg vocabulary; S07 carries friction limits and the modelling cycle. Under constant gravity, restoring drag to the falling box makes its acceleration depend on the motion; particle alone never removes drag.
- Six numerical holds in S06: input masses, g, total mass, acceleration and tension; the three question pauses are separate one-second gaps. No other numerical result is introduced during a hold.
- One check-understanding question, S07, with its explicit three-second silent interval. Worked-example prompting questions are teacher-led reasoning pauses, not additional quiz cards.
- Rendering follows root `CLAUDE.md`: visuals appear on the spoken word; narration is never captions. Reuse the existing ink stroke approach described by `apps/student-learn/briefs/INK-WORKFLOW.md` and `packages/backend/src/remotion/compositions/InkTutorTikTok.tsx` in the composition task. No composition files change in this task.
