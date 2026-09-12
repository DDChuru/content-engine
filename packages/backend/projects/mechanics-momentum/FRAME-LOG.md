# Momentum source study — M4.3a

Source: `/home/durai/Documents/9709/Momentum.mp4`.

- Duration reported by ffprobe: **67.347200 s**; 1920 × 1200 H.264, 1977 frames.
- The file contains a video stream and **no audio stream**. This log records visual evidence, not an unheard source narration.
- Sampling: **68 individually sought frames**, at every integer second from **0 through 67 inclusive**, extracted with `ffmpeg -ss <second> -i <source> -frames:v 1`. Every sample was inspected in six labelled contact sheets. Times below identify sampled evidence; they do not claim subsecond transition precision.
- Source SHA256: `740bd87e4028f4dae7e93240254665ca9af58139023ed787f946bc62c5f77811`.
- PDF: `/home/durai/Documents/9709/MomentumandCollisions.pdf`, SHA256 `fb10f6801a436429c7d350357a89237c2271d4c90a88326c350d7d4519d0b573`.
- Read the six requested production documents in their prescribed order. The latest user instruction supersedes their render and no-commit instructions: this machine authors only; the parent integrates and renders on machine A.

## Complete recording coverage

| Sampled seconds | Observed content | Lesson use / scope decision |
| --- | --- | --- |
| 0, 1 | Momentum title and source branding. | Topic opening; do not copy branding. |
| 2 | Calculating momentum heading; teaching area initially empty. | Opening transition only. |
| 3, 4 | Mass and velocity introduced in the left column. | Define what the two inputs mean on a moving physical diagram. |
| 5, 6, 7, 8, 9, 10, 11, 12 | The word formula, momentum equals mass times velocity, is displayed. The left column also gives the symbolic product. | Lead with words and `p = mv`, before numerical substitution. |
| 13 | Unit product begins appearing below the word formula. | Derive units from the factors. |
| 14, 15, 16 | The mass and velocity units are shown as kg multiplied by m/s. | Show how the compound unit follows from multiplication. |
| 17, 18 | The resulting momentum unit kg m/s is complete. | Use kg m/s consistently. |
| 19, 20 | Momentum is identified as a vector, with magnitude and direction. | Learning outcome and later comparison. |
| 21, 22 | The direction of momentum is stated to match velocity. | Link the momentum arrow to actual travel direction. |
| 23, 24, 25 | Negative velocity gives negative momentum. | Explain with positive mass and a declared positive direction. |
| 26 | First diagram: 5 kg block, 12 m/s arrow to the right. | Reference type for a fresh signed-momentum comparison. |
| 27 | Second diagram appears below: 8 kg block, 6 m/s arrow to the left. | Separate diagrams; the recording does not show these bodies colliding. |
| 28, 29, 30, 31, 32 | Both given diagrams remain; a tip asks the learner to label the positive direction. | Full givens and sign convention must precede working. |
| 33, 34 | An explicit right-positive arrow is added beside the diagrams. | Choose the axis before assigning signs. |
| 35 | First substitution begins: 5 × 12. | Formula-first numerical working. |
| 36, 37, 38 | First result is complete: +60 kg m/s. | Signed answer with units and direction. |
| 39 | Second substitution begins with the mass 8. | Keep the lower block's mass visible during substitution. |
| 40, 41 | Second product is complete as 8 × (−6); the result is not yet written. | Explicitly attach the negative sign to velocity. |
| 42, 43, 44, 45 | Second result is complete: −48 kg m/s. Both examples remain visible. | Explain that the negative sign communicates leftward direction, not negative mass. |
| 46 | Recap heading. | Return to the same learning outcomes. |
| 47 | Recap introduces the calculation method. | Formula recap. |
| 48 | Recap word formula appears. | Momentum = mass × velocity. |
| 49, 50, 51 | Recap adds the units. | Correct compound units. |
| 52, 53 | Recap adds vector nature, direction and magnitude. | Same vector outcome as the opening. |
| 54, 55 | Recap adds the connection between negative velocity and momentum. | Sign meaning. |
| 56, 57, 58, 59 | Recap adds the reminder to show which direction is positive; complete recap held. | Reversing the chosen positive direction is a direct check of this stated convention. |
| 60 | Promotional end card begins. | Exclude from teaching content. |
| 61, 62, 63, 64 | Promotional resource list / source logo. | Exclude from teaching content. |
| 65 | Browser view of the Momentum lesson, still showing the source end card. | Recording tail; no additional mechanics. |
| 66, 67 | Browser view with dark ended video. | Recording tail; no additional mechanics. The final 0.3472 s is after the last required integer-second sample. |

All required samples are accounted for above: `0–11`, `12–23`, `24–35`, `36–47`, `48–59`, `60–67`. The transient extraction script is `/tmp/verify-momentum-source.py`; its images and six contact sheets are under `/tmp/verify-momentum-source/`. These are local inspection aids, not runtime assets or a Remotion render.

## PDF page evidence

The complete PDF text was extracted with `pdftotext -layout`. **Printed/PDF pages 2 and 3 were also rasterised and visually inspected** so that image-only content was not missed.

| PDF page | Relevant evidence | Scope decision |
| --- | --- | --- |
| 1 | Contents separates Momentum, Direct Collisions and Multiple Collisions. | Confirms these are separate topics. |
| 2, upper section | Defines momentum as mass times velocity; gives kg m/s; states vector nature and that momentum follows velocity direction. | Corroborates recording 3–25 s; no bridge needed. |
| 2, upper section | Also mentions equivalent N s units and a falling-body direction example. | Omit: neither is needed for the recording's focused horizontal comparison. In particular, do not use N s to introduce impulse. |
| 2, lower section | Contact forces, momentum transfer and a racket/ball before-and-after calculation. | **Outside this recording's ceiling.** Do not import into Momentum; the sibling Direct Collisions lesson owns collision reasoning. |
| 3, upper illustration | Racket and tennis ball, including arrows labelled I; this image is absent from text extraction. | Omit contact/impulse illustration entirely. |
| 3, worked example | 15 kg dog running at 6 m/s; image-only answer draws a block/velocity arrow, uses the product, obtains 90 kg m/s and reminds the student to include units. | Confirms a simple product calculation is appropriate. Do not add this as a second numerical example; use one fresh paired comparison faithful to recording 26–45 s. |
| 4–7 | Direct collisions and conservation, including coalescence and signed before/after working. | Boundary check from extracted text only; no content imported into this lesson. |
| 8–10 | Multiple collisions. | Boundary check from extracted text only; excluded. |

The official cached syllabus page 32 (`mechanics-syllabus-map/batch-13-source/syllabus-page-32.txt`) explicitly separates the definition/vector-nature bullet from conservation/direct-impact. The opening should label this exact short fragment as an **excerpt**: “use the definition of linear momentum”. The outcomes must then state vector nature in ordinary language. Do not use the conservation excerpt for M4.3a.

## Original example and source scope judgement

Use one comparison: **trolley A, 2 kg at 6 m/s right; trolley B, 3 kg at 4 m/s left**, on **separate parallel tracks**, with **right declared positive**. Ask for each signed momentum and what the signs/magnitudes mean. All of this must appear and be narrated before the working. This preserves the recording's two separately drawn bodies and mass-times-signed-velocity calculation while using original numbers and meaningful motion.

Independent arithmetic:

- `p_A = m_A v_A = 2 × (+6) = +12 kg m/s`, to the right.
- `p_B = m_B v_B = 3 × (−4) = −12 kg m/s`, to the left.
- The magnitudes are equal; the momentum vectors differ because their directions differ. This is a direct illustration of the recorded vector definition, not a new conservation claim.
- If left is chosen positive while the physical motion stays the same, `p_A = 2 × (−6) = −12 kg m/s` and `p_B = 3 × (+4) = +12 kg m/s`. This is the same comparison under a changed sign convention, grounded in recording 23–25, 33–45 and 54–59 s; it is not a second collision/trial.

No PDF-only conceptual bridge is necessary. Do not calculate total momentum, collision outcomes, impulse, restitution, kinetic energy or forces. Do not imply that equal/opposite momenta cause the trolleys to stop, meet or interact.

## Teaching and motion risks for implementation/review

- Make the separate tracks unambiguous before showing opposing arrows. Keep them separate throughout.
- In any simultaneous physical demonstration the speed ratio must be `6:4 = 1.5:1`. Camera-follow scenery can show this without a looping teleport. Label a frozen analysis view as a snapshot; do not show a clamped trajectory as a physical stop.
- Momentum follows velocity because the mass is positive. Say the sign convention before assigning signs; preserve positive mass labels throughout.
- At the changed-axis check, reverse the axis arrow and the signed labels, **not** the actual direction of the trolley/velocity arrows.
- Introduce the full problem and unknowns before formulas; keep masses, speeds, direction and the axis visible through both substitutions.
- Keep general word/symbol formulas on the paper when writing numbers. Derive the numerical answers, including changed-axis answers.
- Drive every spoken number ring and every replacement of an unknown by its result from the actual generated narration's word-level Whisper timestamp. A source slide transition is not a narration cue.
- Equal magnitudes do not mean equal vectors. This contrast supplies the required “when it is not true” beat without expanding the subject.
- Retain two slow explanations, real two-second result holds and the three-second check hold. Longer teaching time than this concise source clip is pacing, not permission to add later-topic mechanics.

This is a source inspection record only. It does not claim composition rendering, preview review, audio generation or a runtime visual audit.
