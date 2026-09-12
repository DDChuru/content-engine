# Direct Collisions — source study

Topic: `mechanics-direct-collisions` / `MechanicsDirectCollisions` / `M4.3b`.

Source recording: `/home/durai/Documents/9709/directCollisions.mp4`, duration **210.7966 s**, 1920×1200. Study completed on machine B, 12 September 2026. This is a study of the source, not a preview or final-render audit.

## Sampling evidence

Inspected **every integer-second sample from 0 s through 210 s inclusive: 211 frames**. `verify-source-study.py` extracts each timestamp independently with FFmpeg input seeking; it does not reuse the handoff's ten-second samples. The decoded frame at/after each requested timestamp is saved at half resolution as `verify-source-frames/0000.jpg` through `0210.jpg`. Variable source frame rate means the decoded timestamp can differ from the requested timestamp by less than the local source frame spacing.

All 15 `verify-source-sheet-01.jpg` through `verify-source-sheet-15.jpg` contact sheets were visually inspected. Each sheet shows 15 consecutive labelled one-second samples; the last shows only 210 s. These study assets and this log live in the ignored topic project directory. The source PDF pages 4–7 and official syllabus page 32 were also rasterized and inspected, including the handwritten answer diagram on PDF page 6, which its text extraction omits.

## Complete interval log

All intervals below are inclusive integer-second sample ranges. Together they cover every sample once.

| Samples | Observed source content | Lesson use |
|---|---|---|
| 0–2 | Direct Collisions title. | Topic identity only; keep a physical motif in our opening. |
| 3–7 | Definition: two objects travel along the same straight line when they collide; before and after cases introduced. | Meaning of direct collision. |
| 8–10 | Before diagram builds a moving particle approaching a stationary particle. | Possible approach states; no extra calculation. |
| 11–14 | A second before diagram builds same-direction speeds, with the faster particle behind. | Catching condition, if included in a compact visual contrast. |
| 15–16 | Third before diagram shows head-on approach. | Our shared numerical setup uses this case. |
| 17–21 | After diagrams begin: one particle stationary, other moving away. | Distinguish before and after outcomes. |
| 22–24 | Same-direction after motion has faster particle in front. | Prevent an impossible separation animation. |
| 25–28 | Opposite-direction after motion moves particles apart; text introduces coalescence at 28 s. | Our first trial's separation. |
| 29–33 | Coalescence shown as particles together with one common velocity arrow. | Our second trial; combined mass and common velocity. |
| 34–38 | Brief explosion/separation illustration introduced, before state initially stationary. | Source includes this as a qualitative extension; no explosion calculation is authored. |
| 39–45 | Separation after diagram and recoiling cannon illustration; no momentum calculation. | Not developed into another worked problem. |
| 46–53 | Conservation principle and general symbolic momentum equation introduced. | Formula-first explanation, without the source's text-only frames. |
| 54–57 | Words equation is visible with external-force condition; masses introduced. | State the condition and define the two-particle system before claiming conservation. |
| 58–63 | Before and after velocity labels; choose positive direction. | Use one explicit right-positive convention throughout. |
| 64–69 | Positive right arrow appears; handwritten equation begins. | Signed velocities and before/after snapshot. |
| 70–76 | Full handwritten general equation; tip about an assumed after direction and a negative answer. | Unknown after arrow must be tentative until sign is found. |
| 77–86 | Full rebound question highlighted: A 2 kg, B 4 kg; before speeds 3 right and 2 left; A reverses at speed 2; find B's after speed/direction. | Source type for our fresh trial 1; speak all givens before working. |
| 87–93 | Right-positive arrow and particle/mass diagram appear. | Our setup must place every given on the diagram before calculation. |
| 94–99 | Source before arrows +3 and −2; A's after arrow −2. | Explicit labels and sign convention. |
| 100–107 | Tentative right after arrow for unknown vB; diagram is held. | Keep unknown visible before solving. |
| 108–116 | General conservation equation and sign reminder; source highlights inputs while substitution begins. | Words and symbols first; ring every spoken source figure. |
| 117–123 | Substitution completed: 2×3 + 4×(−2) = 2×(−2) + 4vB. | Stepwise signed arithmetic. |
| 124–128 | Simplifies to −2 = −4 + 4vB, then vB = 0.5; states speed. | Derive result before returning it to the diagram. |
| 129–137 | B's reversal/direction explained; completed working held. | Speed versus signed velocity interpretation. |
| 138–150 | New coalescing question: P 0.6 kg and Q m kg; +10 and −15 before; stick; common speed 12; find m. | Source type for separate coalescing comparison trial. |
| 151–159 | Positive direction, before masses and velocities, then after region. | Reset explicitly between trials; preserve all before givens. |
| 160–164 | After object R has mass 0.6+m; common speed 12 is added. | Combine both masses for the shared after velocity. |
| 165–171 | Source infers common motion left, saying P's speed increased so its direction changed. | Avoid asserting this shortcut; our common direction follows the derived velocity sign. |
| 172–179 | General equation/sign reminder; substitution starts. | Formula-first coalescing equation, then values. |
| 180–185 | 0.6×10 + m×(−15) = (0.6+m)×(−12); expands and solves m=4.4. | Recording genuinely calculates coalescence, so preserve a numerical coalescing calculation. |
| 186–195 | Recap builds: possible before/after states, clear diagram with masses/speeds/directions, coalescence. | Return to learning outcomes over the two-particle motif. |
| 196–200 | Recording exits full screen; embedded recap adds separation and conservation condition. | No new quantitative scope. |
| 201–210 | Embedded recap adds equation and reminder to choose positive direction and use negative velocity for opposite arrows. | Closing method check. |

## PDF and official syllabus checks

- `/home/durai/Documents/9709/MomentumandCollisions.pdf`, **page 4**: direct-collision definition, possible before/after states, coalescence, brief separation illustration, conservation condition, and direction/sign warning.
- **Page 5**: general conservation equation; before-and-after diagram; four-step method; tentative unknown direction; either sum both same-velocity momenta or combine masses after coalescence.
- **Page 6**: a different numerical rebound example, P 3 kg at +4 and Q 5 kg at −2, with P after −1. Its handwritten answer uses 3(4)+5(−2)=3(−1)+5v and derives v=+1 for Q. The recording, rather than these different values, is the example-type source.
- **Page 7**: continuation of the physical direction tip. No additional worked example was imported from later pages.
- Cached `mechanics-syllabus-map/batch-13-source/syllabus-2026-2027.pdf`, **page 32**, visually checked against `syllabus-page-32.txt`. The direct-impact bullet includes coalescing bodies in the adjacent notes and does not require impulse or coefficient of restitution.
- Exact opening excerpt available from the source map: “use conservation of linear momentum to solve problems that may be modelled as the direct impact of two bodies.” Label it as a syllabus excerpt; learning outcomes are our own words.

## Authored example and scope judgement

Use one coherent question with **two independently stated trials**, as explicitly proposed in `BATCH-13-SOURCE-HANDOFF.md`. Both begin with A of mass 2 kg moving right at 4 m/s and B of mass 3 kg moving left at 1 m/s. Smooth horizontal surface; negligible external horizontal force during the impact; right positive.

1. Trial 1 supplies A's after velocity −2 m/s and asks for B's velocity. General equation first: mA uA + mB uB = mA vA + mB vB. Then 2(4)+3(−1)=2(−2)+3vB, so 5=−4+3vB, 9=3vB, vB=+3 m/s. A moves left and B right afterwards; the bodies separate without a later collision.
2. Trial 2 **resets to the original initial conditions**, then the bodies stick. Start from mA uA + mB uB = (mA+mB)v. Then 2(4)+3(−1)=(2+3)v, 5=5v, v=+1 m/s. Both bodies move together to the right with constant contact separation.

The recording's coalescing example solves an **unknown mass**, while this authored trial solves an **unknown common velocity**. This is an explicit handoff-authorized adaptation within the same one-dimensional coalescing conservation calculation. It keeps one set of givens and one worked comparison question, preserves quantitative coalescence, and avoids adding a second unrelated numerical scenario. We do not reproduce the source's unsupported direction shortcut; the calculated sign determines the after direction.

No impulse, restitution, kinetic-energy calculation, multiple-collision sequence, or explosion calculation is introduced. The recording's short separation illustration is treated as optional qualitative context rather than another worked question. The smooth-horizontal/external-force clarification makes the source condition physically precise; no additional topic law is used to calculate a new result.

## Teaching and mathematical checks for machine A

- Show the complete approach/contact/separation or sticking story before equations; declare both trials in the full question before the first solve.
- The external-force condition and two-particle system must precede the conservation claim; an individual's changed momentum is consistent with conserved total momentum.
- Preserve mass and initial velocity labels during all substitutions. Unknown after arrows are dashed/tentative. Change an unknown to a result only at the word that speaks the derived value.
- A and B cannot overlap or pass through each other at impact. Trial 1 after arrows point outwards; trial 2 bodies share velocity and retain contact.
- Do not silently reuse trial 1 outputs in trial 2. A visible reset is essential.
- Speeds are nonnegative magnitudes. Positive/negative signs belong to velocity, not mass.
- Render/encoded-frame, audio timing, label-ring, physical-motion and notes-renderer verification remain machine A tasks; this source study is not evidence that they passed.
