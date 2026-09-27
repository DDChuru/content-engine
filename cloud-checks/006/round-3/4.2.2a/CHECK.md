# Round 3 — 4.2.2a — CLEARED WITH MINOR EDITS

Checked 27 September 2026 against the complete local round-two CHECK, revised STORYBOARD, `work/006/FIXES-round-2.md` and the diff from the previously reviewed commit. Workspace HEAD: `224cca1b843264bbfceedfcd27b2fd4a79166c06`. Reviewed STORYBOARD SHA-256: `d13d5747415954a7fbfb5d370e2861dda70b2003cfa21b30590737301d35e1ca`.

The conductor ruling was read directly with `git -C /home/dachu/Documents/projects/content-engine show origin/cloud/006-checks:cloud-checks/006/round-2/README.md`. It replaces the recorded-run demand with sourced question data or a clearly labelled schematic without numerical readings, timer or axis values. The user's current instruction explicitly permits either route. **The schematic route closes the former clearance blocker. No recorded run is required.**

## Every outstanding round-two item

| Item | Status | Evidence |
|---|---|---|
| M1 — recorded osmometer evidence | **FIXED under the superseding ruling** | `osmometer`, `osmometer-control`, Dataset 2 and Beats 8–9 require `SCHEMATIC: model of what happens — not measured data`; no numerical ruler readings, timer, elapsed-time display, reading markers or numerical graph axes. The level rises only qualitatively. No source is invented. Correct the route-selection rationale below. |
| Residual — Beat 8 settling in the “first minute” | **FIXED** | Action 7 instead gives a possible displacement with `qualitative schematic; settling interval not established`, no numerical duration. The pre-immersion mark is explicitly not a reading or zero. |
| Residual — first-reading tag | **FIXED by removal** | No live first-reading/value-pending tag remains. The model, narration and recap identify the osmometer as schematic. Historical response text is expressly superseded. |
| Residual — Beat 9 clock/observation coupling | **FIXED** | No stopwatch, timer, time-lapse caption, reading value or observation-interval bracket. The real-run procedure is introduced as “In a real run”; its note sits beside the ruler, not as a measurement on the graph. |
| Residual — unsourced recorded temperature | **FIXED for the osmometer** | Model, Beat 8 and Dataset 2 say `illustrative condition: 20 °C; measure actual temperature in a real run`. This is a specified condition, not an observation. |
| Residual — generalised clock claims | **FIXED in the osmometer sequence; minor preview clarification below** | Beats 8–9 have no clock. Beat 12 explicitly marks only diffusion-tube and agar clocks. The conductor's final Beat 2 edit limits recorded-time reading to bag and agar. Beat 1's shared-preview stopwatch wording should be made equally explicit. |
| Other 1 — withdrawal starts before the later collection cue | **FIXED** | Beat 6 action 2 starts withdrawal on the frame 3:00 is reached; the later cue highlights the ongoing three transfers. Action 4 applies the same rule at 10:00 and 20:00. No second withdrawal/reset; collection clocks continue. |
| Other 2 — complete contextual S21/21 answer and correct apparatus | **FIXED** | Beat 13 action 2 now supplies the outward/inward concentration groups, net movement and higher-to-lower water potential. Thumbnail uses the paper's Visking column and its own meniscus, not the lesson's capillary. Its sucrose-impermeability stipulation is kept local. Fresh PDF verification below. |
| Other 3 / S1 — reagent identity and working concentration | **PARTLY, accepted production dependency** | The exact production note is installed after Safety. Actual iodine concentration and Benedict's product/supplier information remain pending; no identification has been fabricated. Not a recorded-run or storyboard-clearance requirement. |
| Other 3 / S2 — filled/sealed bag fit | **PARTLY, accepted production dependency** | Actual dimensions, submersion and overflow check remain to be recorded before practical build. The ideal cylindrical estimate is explicitly insufficient. |
| Other 3 / S3 — bath depth/volume/headroom | **PARTLY, accepted production dependency** | Model and Dataset 2 distinguish 250 cm³ vessel capacity from actual bath volume/depth/headroom, which the production note requires before build. |
| Other 4 — stale interpretation 9 | **FIXED** | It now says the optional beyond-scheme colour-boundary sentence/panel was removed, while Beat 11 retains the visibility-threshold explanation. |
| Runtime | **FIXED in the final conductor addendum; older ledger needs synchronising** | Fresh count matches the final addendum: 1,326 words / 11:03, not the superseded 1,323 / 11:01.5. Accepted overrun retained; exact ledger corrections below. |

## Earlier fixed items retained

The round-two table's remaining items stay **FIXED**: M1 first-contact/pre-immersion distinction and bounded column-volume/possible-rise explanation (adapted to schematic status); M2 mixture volumes, blank/sample division, no carry-over, timed heating and colours developing during heating; M3 actual first dye contact, partly filled well and perpendicular readings; M4 truthful model-limit reject and 1/2/3 cm paper cubes; M5 mass-balance caveat and non-quantitative colour inference; M6 objective pictograms from frame one; S4 withdrawn numerical control; S5 separate investigation/heating clocks; S6 dye/indicator boundary; S7 schematic preview and potato handoff. S1–S3 remain only the declared production dependencies above.

## Minor exact edits before build

### 1. Correct the false claim that the evidence contains no readings

The new rationale confuses “the checks did not transcribe the values” with “the question supplies no values”. S21/21 QP p6 **does supply Table 3.1**. The schematic is allowed by the user's current either/or instruction, so this is a source-accounting repair, not a demand to replace it with a recorded run or to transplant a different apparatus's readings.

Replace the no-dataset rationale in both `Osmometer: schematic only` blocks, UNVERIFIED 4, Plan interpretation 5 and CHECK RESPONSE (round 2) with:

> S21/21 QP p6, Table 3.1 supplies meniscus-height differences after 20 minutes: −12, −4, −2, +1, +6 and +11 mm for internal sucrose concentrations 0.0, 0.4, 0.8, 1.2, 1.6 and 2.0 mol dm⁻³ respectively. These are the question's endpoint data for its Visking-column apparatus, not a time series for our glass-capillary rig. This lesson retains the permitted schematic route for its own osmometer: SCHEMATIC: model of what happens — not measured data; no numerical readings, timer or axis values. The question's different setup and sucrose-impermeability stipulation stay with its separate exam example. No recorded run is required.

These numbers belong in the source audit; this replacement does not instruct the builder to put them on the schematic. The same incorrect claim appears in `work/006/FIXES-round-2.md`; correct its summary consistently when applying the edits (not edited by this review).

### 2. Make the preview clock's ownership explicit

Beat 1 action 1 still says the three-rig bench has “a stopwatch at rest” and refers to “each rig” and “its stationary clock”. The later model rules prohibit an osmometer clock, but the hook wording leaves its placement ambiguous. Replace that opening sentence with:

> From the first frame, the bench shows a diffusion bag, a capillary osmometer and an agar dish, each tagged “preview; schematic”. Place any stationary preview stopwatch beside the diffusion bag or agar dish only. The osmometer has no clock, numerical reading or ruler values and carries “SCHEMATIC: model of what happens — not measured data”, including while its level rises qualitatively.

Keep the existing hook-question cue and subsequent preview actions. No narration change is needed.

### 3. Remove stale production wording and synchronise runtime

Replace the Reusable models entry `meniscus-height (unnumbered qualitative schematic until the osmometer record exists)` with:

> meniscus-height (unnumbered qualitative schematic; no recorded-run dependency)

Replace the Scope ledger's `investigate` description with:

> Three investigation designs with named apparatus, controlled variables and readout limits. The bag and agar use explicitly illustrative timed results; the osmometer is a labelled qualitative schematic, with real-run reading procedure explained but no timed observations shown.

Update the current word table: Beat 2 **50 words / 25.0 s**; total **1,326 words / 663.0 s (11:03.0)**. Replace the opening of “Length, honestly” with:

> 1,326 words = 11:03.0 at 120 effective words per minute, 1:33 over the 9:30 budget; 11:05.0 if the final two-second hold is scheduled outside that estimate. This includes the conductor's final three-word Beat 2 correction. The overrun is accepted; do not accelerate narration.

The final addendum already supplies the correct count; these edits remove conflicting current totals rather than reopening pacing. Reflow provisional headings from the corrected ledger during audio scheduling.

Retain the exact existing S1–S3 production note: actual reagent identity, bag fit and bath geometry remain pending before practical build. No fictional supplier details or physical checks should be inserted to mark them complete.

## Fresh original-PDF verification

Re-extracted with `pdftotext -layout` from `/home/dachu/sme-9700-archive/pastpapers/2021/June/`:

| Source | Verified result |
|---|---|
| `9700_s21_qp_21.pdf`, pp6–7 | Table 3.1 contains the six endpoint differences transcribed above. Each tube contains 10 cm³ internal solution, external solution is 15 cm³ at 0.9 mol dm⁻³, and pieces are removed after 20 minutes before remeasurement. Q3(a) expressly stipulates tubing not permeable to sucrose. This is the paper's Visking-column meniscus, not a glass-capillary trace. |
| `9700_s21_ms_21.pdf`, p10 | Q3(a) awards any three listed points for 3 marks: correct outward/inward movement groups, net movement, and higher-to-lower water potential/down-gradient movement. The newly expanded answer is a correct contextual paraphrase. |

No new verbatim examination quotation was introduced. Previously checked unchanged S21/22 cube/indicator evidence retains its earlier verification. The new no-data claim was independently checked and is the source defect above.

## Validator and regression scan

Fresh command: `python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.2a/STORYBOARD.md`.

**13 beats; 1,326 words; 161 recognised cues; maximum gap 20 words; zero failing beats; 11:03 at 120 effective wpm.** No missing-section/citation failure. Accept the 1:33 overrun (11:05 including an additional final hold); no error beat is assigned or needed.

Changed text introduces no new biological mechanism, invented osmometer measurements or claim that a geometric estimate is an observation. Apparatus dimensions, stated concentration and the pure-water reference are specifications/reference quantities, not prohibited meniscus readings. The 30-second pre-immersion leak-check instruction is a procedural duration, not a measured meniscus trace or a demand for a run. The osmometer ruler is expressly unnumbered in its model contract, and the qualitative graph has no ticks/values. Possible settling and later behaviour stay qualified; capillary volume is not equated to net water entry.

Bag/agar results remain explicitly authored illustrative datasets as in the prior review; this report does not certify them as sourced measurements. Sample arithmetic, fresh equipment, test portion division, five-minute heating and agar mean calculations remain intact. No new text-only objective frame or unsupported assay interpretation appears. Physical handling and rendered visual continuity remain build checks.

Only this CHECK was written for this code; storyboard unchanged, no commit, push or deployment.

CLEARED WITH MINOR EDITS
