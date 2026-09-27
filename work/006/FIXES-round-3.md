# Cloud run 006 — fixes applied after check round 3 (final)

27 September 2026. Source: `origin/cloud/006-checks:cloud-checks/006/round-3/`. The README marks this round FINAL.

**Round-3 verdicts:**
- **CLEARED:** 4.1.4, 4.2.1b, 4.2.2b, 4.2.3-4, 4.2.5 and 4.2.6.
- **CLEARED WITH MINOR EDITS:** 4.2.1a and 4.2.2a. Both CHECK files give the edits' exact wording.
- **Already CLEARED in round 2:** 4.1.1-2 and 4.1.3.

The conductor applied the remaining minor edits directly, word for word. Each is recorded in a `## CHECK RESPONSE (round 3)` section at the end of its storyboard.

## 4.2.1a (CLEARED WITH MINOR EDITS → edits applied)

- **R3-S1: the water window continues into the recap.**
  - Beat 12 action 11 was replaced with the check's text. The next five-second window runs 47.5–52.5 s across the transition into Beat 13 without a reset. It finishes 2.5 s into the recap, and it adds no hold.
  - Beat 13's opening visual instruction gained the check's sentences on the live counter and carrying the window.
  - Dataset 3's round-2 schedule gained the check's continuation sentence.
  - In the round-2 CHECK RESPONSE runtime row, the "No new hold is required…" sentence was replaced with the check's text.
- **R3-S2: one cue offset.** In Beat 4 action 2, "at 7.0 s" became "at 6.0 s".
- **Result:** no narration changed. The lesson is 1,338 words (11:09.0); 11:15 with the silent read and the final hold, which the check accepts. The validator reports 0 failing beats.

## 4.2.2a (CLEARED WITH MINOR EDITS → edits applied)

- **Edit 1: source accounting.**
  - The round-2 rationale wrongly said no past paper supplies readings. The check's paragraph now replaces it. It records that S21/21 QP p.6, Table 3.1 supplies meniscus-height differences after 20 minutes: −12, −4, −2, +1, +6 and +11 mm for internal sucrose concentrations 0.0, 0.4, 0.8, 1.2, 1.6 and 2.0 mol dm⁻³. These are the question's endpoint data for its Visking-column apparatus, not a time series for our glass-capillary rig.
  - The lesson keeps the permitted schematic route for its own osmometer, and no recorded run is required.
  - The paragraph was placed in five places: both *Osmometer: schematic only* blocks, UNVERIFIED 4, Plan interpretation 5, and the round-2 ruling record. The S21/21 values stay in the source audit and are not drawn on the schematic.
  - The same false claim in `work/006/FIXES-round-2.md` has been corrected and marked "(Corrected in round 3…)".
- **Edit 2: which rig owns the preview clock.** The opening sentence of Beat 1 action 1 was replaced with the check's text. Any preview stopwatch now sits beside the diffusion bag or the agar dish only. The osmometer has no clock and carries the SCHEMATIC label. The narration is unchanged.
- **Edit 3: stale wording and runtime.**
  - The Reusable models entry now reads "unnumbered qualitative schematic; no recorded-run dependency".
  - The Scope-ledger `investigate` row was replaced.
  - The word table now shows Beat 2 at 50 words / 25.0 s and a total of 1,326 words / 663.0 s (11:03.0).
  - The opening of "Length, honestly" was replaced with the check's text. The S1–S3 production note is retained unchanged: reagent identity, bag fit and bath geometry are still to be confirmed before the practical is built.
- **Result:** 1,326 words (11:03.0; 11:05.0 with the final hold), an overrun the check accepts. The validator reports 0 failing beats.

## All ten marked CLEARED

Each storyboard now carries a `**STATUS: CLEARED**` line under its title. The line names the round in which it cleared and notes that the narration is frozen for build.

## Final state

| Lesson | Status | Words | Narration at 120 wpm | Budget | Error beats |
|---|---|---:|---:|---:|---|
| 4.1.1-2 | CLEARED | 1,109 | 9:14.5 | 9:00 | — |
| 4.1.3 | CLEARED | 1,201 | 10:00.5 | 10:15 | E43 EXAM CONTRAST |
| 4.1.4 | CLEARED | 805 | 6:42.5 | 7:00 | E44 COMMON MISTAKE |
| 4.2.1a | CLEARED | 1,338 | 11:09.0 | 10:45 | E45 COMMON MISTAKE |
| 4.2.1b | CLEARED | 1,360 | 11:20.0 | 11:15 | E46, E47 COMMON MISTAKE |
| 4.2.6 | CLEARED | 1,136 | 9:28.0 | 8:15 | — |
| 4.2.2a | CLEARED | 1,326 | 11:03.0 | 9:30 | — |
| 4.2.2b | CLEARED | 955 | 7:57.5 | 7:30 | — |
| 4.2.3-4 | CLEARED | 1,357 | 11:18.5 | 9:45 | — |
| 4.2.5 | CLEARED | 1,387 | 11:33.5 | 11:15 | E48 COMMON MISTAKE |
| **Topic 4** | **10/10 CLEARED** | **11,974** | **99:47** (+24 s of silent reads; scheduled holds as stated per lesson) | **94:30** | 5 COMMON MISTAKE, 1 EXAM CONTRAST |

Every storyboard passes the validator with 0 failing beats.

## Carried forward to build

These are open dependencies, not clearance blockers:

- Sourced micrographs of red blood cells (4.2.6) and of plasmolysed red onion (4.2.2b).
- For 4.2.2a: the iodine working concentration, the Benedict's product, the bag fit and the bath geometry.
- For 4.2.3-4: the centre's hazard data for its stated solutions (the check-cited protocol and the reference formulation are already in place).
- Measured audio will replace all the provisional timings.

**Branch hygiene:** the second session's commit `cef5d0c` added `cloud-inputs/` to `cloud/006-topic4`. It is not removed here; that is the conductor's decision.
