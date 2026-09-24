# 3.2.1 — Independent round-two check

**CLEARED WITH MINOR EDITS** — apply the two handling corrections below before building. The repairs can be applied verbatim without another authoring round; neither changes narration, data or teaching structure. M2 is partly fixed because the new tap definition isolates the syringe while the baseline instruction still tells the builder to set its plunger to zero.

Reviewed 25 September 2026. Storyboard SHA-256: `3378346db59263d9877e4885bb679ae7fba5dd7eedf0f96418a808a400b0c04e`. Line references below refer to this reviewed file. Read the complete revised storyboard, the original `CHECK.md`, the 3.2.1 response and cross-cutting/conductor sections of `work/005/FIXES-round-1.md`, and the superseding errata in `work/005/SHARED-SPECS.md`. Checked the actual 3.1.3 rig specification and the inherited energy-profile specification, rather than accepting the response ledger as evidence. This is a storyboard check; no rendered handling has been certified.

## Round-one findings, item by item

| Round-one item | Status | Evidence in the revised storyboard |
|---|---|---|
| **M1: categorical pH recap and plotted endpoints** | **FIXED** | Beat 10, lines 219–221, says “at extreme pH, denaturation can occur.” Its exact cue highlights the schematic denatured protein with “not inferred from these endpoint measurements”; the pH points expressly do not pulse. |
| **M1: heat trigger leaking into pH; invented exact optimum** | **FIXED** | Model, lines 67–68, separates the heat trigger from the core unfolding motion. Beat 9, lines 207–211, uses qualitative pH states, runs the core without thermometer/thermal jitter, and labels pH 8.0 “highest tested mean” on a separate measured-data panel. No numerical denaturation threshold is invented. |
| **M2: equilibration, baseline and reaction start** | **PARTLY** | Lines 47–49 and Beat 3, lines 114–115, keep the liquids separate for ten minutes, show five independent conditions including a cooled 10 °C bath, and start stopwatch/collection on first contact. The later “the timer starts” cue explicitly highlights an already-running clock without resetting it. Baseline work now occurs after equilibration, but the syringe is isolated in the specified vent position while its plunger is “set” to zero. Apply correction A. |
| **M3: matched gas control** | **FIXED** | Lines 50, 130 and 245 use 5.0 cm³ of the same enzyme-free pH 7.0 buffer, with the same thermal history and collection procedure. Lines 130 and 259 bound the zero results as illustrative observations. The shared erratum now supersedes the old water-control instruction. The control inherits correction A to the common baseline procedure. |
| **M3: mix each disc preparation; clean forceps** | **FIXED** | Lines 54–55, Beat 7 actions 3–4 (176–177), and dataset line 264 specify gentle mixing immediately before each disc, including the control, and rinsing/blotting forceps between treatments. Fresh peroxide, identical discs and fixed peroxide depth/concentration remain. |
| **M3: complete boiled control** | **FIXED** | Lines 53, 181 and 264 specify 2.0 cm³ boiled suspension + 8.0 cm³ pH 7.0 buffer, cooling to 30 °C before measurement, the same ten-minute stand, mixing, 60 s soak, 5 s drain, fresh peroxide and bottom release. The endpoint remains “did not rise within 120 s,” with no invented numerical reciprocal. |
| **M4: objectives and exam-close graphics** | **FIXED** | Beat 2, line 98, gives each objective contextual pictograms on its own styled surface. Beat 11, lines 230–233, retains the familiar models and factor plots throughout the forms/question/read/marking sequence. The catalase data are explicitly distinguished from the unavailable protease table and figure. |
| **M5: energy-profile recall** | **FIXED** | Model line 72 and Beat 5, lines 143–144, supply the labelled 3.1.1-2 recall with its two barriers, unchanged endpoints and three correctly named brackets. Warming never lowers a drawn barrier. The assets, scope and reuse ledgers now include it. |
| **M6: closing contrast cue and temperature scope** | **FIXED** | Beat 11 action 4, line 233: exact entry cue “below the temperatures”; both lines say “temperature optimum”; the wrong line is already struck through, and the correct line becomes dominant at “begin to denature.” The authored-contrast caption remains, without a COMMON MISTAKE badge. No extra allocated error beat is invented. |
| **Handling notes: pipette placement and contamination tint** | **FIXED** | Lines 53, 175 and 181 keep tips above receiving mouths; line 179 specifies an outline annotation, not a reagent colour change. The hot control uses a holder. |
| **Numerical notes: pH 5 reciprocal and tangent endpoint** | **FIXED** | Line 277 gives `1 ÷ 29 = 0.0344827586… → 0.034 (2 s.f.)`. Lines 61 and 128 distinguish the tangent construction mark from a reading; the origin is a pre-mixing baseline. Beat 8, line 193, tags the mean and reciprocal as calculated. |
| **Length/bookkeeping: retain cuts, correct arithmetic and windows** | **FIXED** | Lines 357–374 and the beat headings agree with an independent 966-word count: 8:03.0. All four proposed cuts are retained. The historical cut arithmetic is correctly identified as 963 − 83 = 880 = 7:20; explanations total 299 words. The author correctly repairs my round-one investigation subtotal: it is **396 words / 3:18**, not the 394 / 3:17 I wrote. |

No round-one item is wholly **NOT FIXED**. The outstanding part of M2 is narrowly specified below.

## Required minor edits and new-problem scan

### A — Zero the syringe with an open nozzle; verify it after equilibration

**New implementation problem within M2:** line 46 defines vent as “flask open to the air, syringe shut off.” Lines 48 and 114 then set the syringe plunger to zero in that position. The flask's vent does not vent an isolated syringe. If the plunger needs moving, this traps/compresses its gas rather than expelling it. If the intended syringe is already at zero, say that the later step checks it, rather than inviting a second zeroing motion. 3.1.3 has the same ambiguity at lines 65 and 73; agreement between the files does not cure it.

Use the following exact local edits. The syringe is prepared before connection and its baseline is verified after equilibration, while the reactants remain separate.

1. In the gas-rig model, line 46, immediately after “**gas syringe** clamped horizontally.” insert:

   > Before connecting the syringe to the tap, set its plunger to 0 cm³ with its nozzle open to the air. Connect it at 0 cm³ while the tap is at vent; the syringe stays isolated at room temperature during equilibration. This preparation is not a reaction reading.

2. Replace the entire **Baseline** bullet, line 48, with:

   > - **Baseline (end of equilibration, published here):** with the countdown at 0:00 and the tap still set to **vent**, confirm that the isolated syringe's plunger is still at **0 cm³**; do not move it against the closed syringe port. Turn the tap to **collect**, closing the vent; tag *baseline 0 cm³ verified after equilibration; collection path gas-tight*. The liquids are still apart. After mixing, the system is never opened and the plunger is never pushed back.

3. In Beat 3 action 2, line 113, replace “the bung is seated, the delivery tube draws through” with:

   > the syringe is shown at 0 cm³, prepared with its nozzle open to the air before connection; the bung is seated, and the delivery tube draws through

4. In Beat 3 action 3, line 114, replace “the plunger is set to **0 cm³** and ringed” with:

   > the plunger is checked to be still at **0 cm³** and ringed, without moving it

5. In the temperature dataset conditions, line 245, replace “then the syringe set to 0 cm³ and the tap turned to collect” with:

   > then the isolated syringe checked to be still at its prepared 0 cm³, without moving the plunger, and the tap turned to collect

6. In current model/beat/dataset/reuse descriptions, use **“baseline 0 cm³ verified after equilibration”** in place of **“baseline 0 cm³ set after equilibration”**, and **“baseline verified after equilibration”** in place of **“baseline set after equilibration”**. Historical quotations in the round-one response can remain as history. The graph's “baseline set before mixing” is still true and needs no change.

These edits require no narration or cue changes. The author/conductor should carry the same preparation/verification wording into the published shared rig when reconciling the lessons; no sibling file was edited by this check.

### B — Remove the remaining wall-contact instruction

**Alignment conflict:** the new 3.2.1 reference correctly adopts the 250 cm³ flask, offset tube and approximately 30° outer tilt. However, its next clause, line 49, still says the inner tube “topples against the flask wall.” The referenced 3.1.3 specification, line 74, says it pivots downhill, lies along the flask **base**, and ends with its mouth approximately **4 mm clear** of the low wall. The builder should not have to choose between those instructions.

At line 49 replace:

> the inner tube topples against the flask wall so that **its mouth is below its base** and the suspension runs out of its lip into the peroxide

with:

> the inner tube pivots downhill and comes to lie along the flask base, with its mouth toward the low heel, about 4 mm clear of the low wall, its axis about 120° from upright and **its mouth below its base**; the suspension runs from the rotated lip into the peroxide

The rest of the inherited geometry is consistent: 3.1.3 supplies the approximately 85 mm internal flask base, 45 mm × 18 mm tube, approximately 15 mm offset, weighted ring, hand above the ring, flexible tubing and flask body remaining in the bath during the tilt. The 30° angle belongs to the outer flask; the approximately 120° angle belongs to the pouring inner tube. No new flask or pouring angle is needed. This textual consistency finding does not certify the unrendered toppling path.

### Remaining changed-text checks

- **Science:** no new biological or chemical error found. The pH qualifiers and heat/core separation repair the substantive round-one overclaim. The energy-profile recall does not imply that heating lowers activation energy. The static `2H₂O₂ → 2H₂O + O₂` remains balanced (H4/O4 each side); no new atom-resolved covalent change is introduced.
- **Timing:** gas first contact, collection and stopwatch start are explicitly one frame, including the inherited control sequence. The later spoken timer cue cannot reset it. Disc timing at release is the explicit conductor exception in both the fixes summary and shared errata: it measures rise time after the same brief descent. It is not an unresolved violation of the gas-mixing rule.
- **Frames and colours:** the revised objectives and complete exam close retain graphics. The changed pH/model, calculation and contrast actions operate on visible models, rigs or plots. No new text-only frame or false reagent colour change is specified.
- **Numbers:** re-derived all five temperature means (0.15, 0.26, 0.40, 0.53, 0.21), all five pH mean times (29, 17, 13, 12, 21) and their two-significant-figure reciprocals (0.034, 0.059, 0.077, 0.083, 0.048). The tangent remains 12.0/30 = 0.40 cm³ s⁻¹. No new measurements are fabricated by the corrections.
- **Response-ledger housekeeping:** the final “Unresolved / for the conductor” paragraph is stale on the buffer control, disc timing and existence of the shared tap. The actual shared errata settle those choices. It may be replaced with: “Shared alignment checked in round two: 3.1.3 carries the three-way tap; the shared errata adopt the enzyme-free pH 7.0 buffer control and release-based disc-rise timing. Apply the round-two syringe preparation/verification correction consistently to the shared rig.” This is documentation cleanup, not an additional scientific blocker.

## Quotations and validation

**Unverified external quotations: none.** Rechecked the syllabus outcome against `SYLLABUS-9700-DETAIL.md`, the complete temperature marking chain against plan line 156, the disc-method fragments against plan line 83, and the protease question/complete marking passage against weights row S-J, line 106. Wording matches text-to-text, preserving the registered attribution: 9700/33 June 2022 Q1(b)(v), MS p.6; Q1(a), MS p.6; 9700/32 June 2024 Q1(b)(ii), QP p.6 and MS p.7. The displayed shorter fragments occur within those verified passages. The design summary remains explicitly the plan's framing, not invented question-paper wording.

The new quoted labels and the response ledger's quotations of authored narration are not Cambridge quotations. The exam PDFs and the protease table/figure remain unavailable and were not claimed to have been inspected or reproduced.

Read-only validator rerun: **966 words, 141 cues, 11 beats, zero failing beats**, maximum cue gap **15 words**. An independent narration extraction agrees: **81, 39, 110, 100, 87, 117, 108, 78, 95, 61, 90** words. Literal cue validation does not resolve the handling semantics in A or the geometry conflict in B.

## Length ruling

**Accept 966 words / 8:03.0 at 120 wpm**, 1:03.0 above the 7:00 budget, entirely teaching. Keep all four proposed cuts untaken: the spoken design contrast, pH hook, press-stud handle and exam-forms sentence. The added three words restore a necessary scientific qualification. There are zero allocated error beats to shorten. The minor corrections above change visual instructions only, so the narration count and ruling stand.

Only `CHECK-round-2.md` was written. The storyboard was not edited; no git or deployment commands were run.

CLEARED WITH MINOR EDITS
