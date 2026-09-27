# Cloud run 006 — fixes applied after check round 2

27 September 2026. Source: `origin/cloud/006-checks:cloud-checks/006/round-2/`, the README plus ten `<code>/CHECK.md` files.

**Verdicts:**
- **CLEARED:** 4.1.1-2, 4.1.3, 4.1.4, 4.2.2b.
- **CLEARED WITH MINOR EDITS:** 4.2.1b, 4.2.3-4, 4.2.5, 4.2.6.
- **NOT CLEARED:** 4.2.1a (counter windows and equilibrium-arrow timing); 4.2.2a (osmometer).

The README's conductor ruling on the 4.2.2a osmometer replaces the check's demand for a recorded run.

**Method.** One fixer per lesson, following `work/006/FIX-BRIEF.md` with N=2. Each applied every remaining item exactly, re-ran the validator and appended `## CHECK RESPONSE (round 2)` to the storyboard. The four cleared lessons were not touched.

## Results

| Lesson | Round-2 verdict | Applied | Words | Runtime | Validator |
|---|---|---|---:|---:|---|
| 4.1.1-2 | CLEARED | — (untouched) | 1,109 | 9:14.5 narration (+2 s hold) | 0 failing |
| 4.1.3 | CLEARED | — | 1,201 | 10:00.5 narration; 10:04.5 with the read | 0 failing |
| 4.1.4 | CLEARED | — | 805 | 6:42.5 narration; 6:46.5 with the read | 0 failing |
| 4.2.2b | CLEARED | — | 955 | 7:57.5 | 0 failing |
| 4.2.1b | CLEARED WITH MINOR EDITS | A: Beat 1 hook ion pauses outside; 3/10 start counts; Beat 5 ends 2/11. A: Beat 13 root-hair replay restarts at 3/10 and ends 2/11. B: Beat 6 action 7 highlights the persistent ATP-use caption; no token restored, no new cycle. All verbatim. | 1,360 (unchanged) | 11:20.0; 11:28 with the reads | 0 failing |
| 4.2.3-4 | CLEARED WITH MINOR EDITS | S2: Beat 7 narration now reads "…colourless once enough acid has diffused in to lower the pH below its transition range." (verbatim). Runtime ruling recorded. | 1,353 → 1,357 | 11:18.5 (accepted) | 0 failing |
| 4.2.5 | CLEARED WITH MINOR EDITS | Edit 1: "Next, the solutions." → "First, the solutions."; Beat 5 tag *solutions prepared before cutting · reaching room temperature*. Edit 2: final 2 s hold scheduled; stated total 11:39.5. | 1,387 (unchanged) | 11:33.5 narration; 11:39.5 total (accepted) | 0 failing |
| 4.2.6 | CLEARED WITH MINOR EDITS | 1: both holds scheduled (Beat 9 settle 1.5 s, Beat 11 final hold 2 s) → total 9:31.5. 2: state-table heading reads "Label (initial condition and current state, as applicable)". 3: interpretation 10 (micrograph) replaced verbatim. | 1,136 (unchanged) | 9:28.0 narration; 9:31.5 total (accepted) | 0 failing |
| 4.2.1a | NOT CLEARED | R2-M1: explicit 5 s counter windows, each with a stated start; a live window kept separate from the "last completed window" card; Beat 3–8 windows re-timed; the net arrow fades once, when the sides first become equal. R2-M2: Beat 12 unequal window completes before it is kept; no window spans the solute addition; at equality the old card is relabelled, a new window starts at 0/0 and the arrow fades. S-R2 1–2: heading timings and Datasets sentence applied. No narration changed. | 1,338 (unchanged) | 11:09.0; 11:15.0 with the read and final hold (accepted) | 0 failing |
| 4.2.2a | NOT CLEARED | Conductor ruling, below. Edits 1–4 applied verbatim: Beat 6 withdrawal rule; S21/21 answer thumbnail showing the paper's own column; production note on reagents and bag fit; Plan interpretation 9. | 1,329 → 1,326 | 11:03.0 | 0 failing |
| **Topic 4** | 4 cleared, 4 minor edits applied, 2 fixed | | **11,972** | **99:46 narration** | **all 0 failing** |

## Conductor ruling on the 4.2.2a osmometer — how it was applied

1. **Past-paper data (option 1) was not usable.** The round-1 and round-2 checks describe S21/21 Q3(a) as supplying six internal concentrations (0.0–2.0 mol dm⁻³), a 0.9 mol dm⁻³ external solution and heights compared after 20 minutes. Neither check quotes a height reading, and no other cited paper supplies osmometer readings, so no dataset exists to use verbatim. Nothing was invented.
2. **Schematic (option 2).** The osmometer and its control are labelled **"SCHEMATIC: model of what happens — not measured data"**. The level rises qualitatively, with no numbers, no timer, no axis values, no reading markers and no elapsed times. The Beat 8 narration now says "From here on, what you see is a model of what happens, not measured data." Beat 9 teaches the recording procedure as what to do "In a real run", never as something observed on the schematic.
3. **Timed-observation cues removed.** The osmometer and control stopwatches, the "t = 0: first contact" tag, the first-reading tag, the compressed-time caption, the observation-interval bracket and the "first reading after immersion … actual elapsed time" narration are all gone. The quantitative work stays on the illustrative Visking-bag and agar datasets.
4. **UNVERIFIED 4** is now **CLOSED BY CONDUCTOR RULING, not resolved by evidence**.
5. **Conductor edit after the fixer.** Beat 2 still promised to "read each one at recorded times", which implied a timed osmometer reading. The narration now reads "to read the bag and the agar at recorded times, starting every clock at first contact;". The cue, the on-screen objective line ("…(the osmometer is shown as a model)") and the causal-spine sentence were updated to match: Beat 2 +3 words, total 1,326, validator 0 failing. This is recorded at the end of the storyboard.

## Interpretations recorded by the fixers

- **4.2.1a, net arrow.** Because the check puts the arrow at zero from window 3, it fades exactly once, over 1 s, when window 2 completes at 20/20. That is about 1 s before the narration says "until the concentrations are equal". At "so the arrow fades" the beat highlights the arrow already at zero, following the check's own Beat 12 wording.
- **4.2.1a, fixer's additions.** The fixer added three rules: later unequal windows in Beat 12 are scripted at the same 15·9; a window still running at the end of a scene completes before its card is kept; and no crossings are drawn during the solute addition.
- **4.2.1b, cue format.** The check writes some new cues in curly quotes. In Beat 13 action 6 they were left in curly quotes, so the validator does not count them; converting them could trip the cue-order check. Their spoken order matches the narration ("energy from respiration", then "against their concentration gradient"). The builder should treat them as cues.
- **4.2.5.** "11:39.5 with the 2 s final hold" was also added to the word table's total row, for consistency with the check's statement.
- **4.2.2a.** Beat 9 has no stopwatch at all, not even the check's "procedural timing icon", because the ruling says no timer. The temperature label reads "illustrative condition: 20 °C; measure actual temperature in a real run". Beat 1's preview meniscus "creeps up a little" rather than rising "a few millimetres".

## Length

The topic's narration is 11,972 words = 99:46, against 94:30. Adding the six 4 s silent reads and the scheduled holds gives just over 100:15. Every check has accepted its lesson's overrun.
