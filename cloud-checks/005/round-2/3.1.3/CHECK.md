# 3.1.3 — Independent round-two check

**CLEARED WITH MINOR EDITS.** Apply N1 below to the gas-rig visual directions before building. No narration rewrite or further checker round is needed for those exact edits. The round-one teaching, timing, control, quotation and length repairs otherwise pass. Preserve E42 in full.

Reviewed 25 September 2026 against `CHECK.md`, the 3.1.3 section and shared notes in `work/005/FIXES-round-1.md`, the superseding errata in `work/005/SHARED-SPECS.md`, and the revised storyboard. Compared the actual gas-rig contracts and mixing beats in 3.2.1 and 3.2.1b, not just the fixes log. Workspace revision 417a9b9e is user-supplied; no git command was run.

Reviewed `STORYBOARD.md` SHA-256: `c5bd74d1322c083fe2928268ddb21f9c4e3a415e95b2a62f53d24861ee5ce284`.

## Round-one items, checked against the revised text

References below are to this storyboard's named models and beats; line numbers refer to the reviewed file.

| Round-one item | Status | Evidence and ruling |
|---|---|---|
| **M1a — gas timing and control timing** | **FIXED** | `GasSyringeRig` `tilt`, line 74, makes first liquid contact the atomic start of stopwatch and collection. Beat 6 action 4 repeats this; actions 5 and the later time-zero cue highlight the running watch without resetting it. Bung seating, vent, baseline zero and collect precede mixing. The control uses the same sequence and its own watch (line 76; Beat 6 action 8). |
| **M1b — inner-tube orientation, clearance, ring** | **PARTLY** | Lines 62–74 now specify a 250 cm³ flask, approximately 85 mm base, 45 × 18 mm tube, 15 mm offset, explicit downhill toppling, approximately 30° outer tilt and 120° inner-tube axis. The ring rests on the shoulders and the hand grips above it; flexible tubing permits the movement. These resolve the missing orientation and handling instructions. However, the added promise that the low-lying tube empties to a residual film conflicts with its mouth ending in the liquid pool. Apply N1. Exact wall clearance still needs the acknowledged rendered-frame check; this review does not certify a rendered vessel. |
| **M1c — amylase timer** | **FIXED** | Sampler timing paragraph, line 86, and Beat 10 action 7 start at first amylase–starch contact. The spoken line now says “starting the timer as they first meet, then mix.” Pour completion, consistent mixing and return to the bath do not reset the watch. Pair B has the corresponding buffer–starch start. |
| **M1d — initial amylase sample and sample-time convention** | **FIXED** | The sampler and Beat 11 action 1 explicitly show a running watch reading a few seconds, with the first sample labelled nominal 0 s. Times refer to withdrawal; transfer is prompt. Beat 10 action 6 fills the iodine wells before either pour. The 30 s schedule and illustrative 150 s endpoint remain. |
| **M2a — visible control preparation and separate sampling equipment** | **FIXED** | Beat 10 action 6 measures and labels both test and control pairs; action 7 mixes both with separate watches. The sampler and Beat 11 actions 1–2 specify dropper A/rinse A and dropper B/rinse B, a shared waste vessel, no cross-use, leftover sample to waste, and residual rinse water expelled before the next draw. Above-well delivery and no iodine contact remain explicit. |
| **M2b — match the enzyme-free buffer vehicle** | **FIXED** | Gas `control`, amylase sampler, both preparation beats and Datasets 1/3 use the same enzyme-free pH 7.0 buffer and replacement volume. Beat 12 action 5 preserves the cited water-replacement wording while separately labelling this lesson's operational buffer-matched control. The quotation has not been silently rewritten. |
| **M2c — visible quantities, named tools and disc mixing** | **FIXED** | Beat 10 action 6 shows 5.0 cm³ amylase plus 5.0 cm³ of 1.0% starch suspension where measured, with labelled graduated pipettes; the control quantities are equally explicit. Gas preparation names the cylinder, long forceps and pipette. `CatalaseDiscRig` `soak` now mixes the preparation before each disc; fixed disc size, soak, release position, peroxide depth and fresh peroxide remain. |
| **M2d — attached precautions and warm-tube holder** | **FIXED** | Gas preparation and disc fresh-peroxide preparation carry the peroxide contact tag and eye-protection pictogram. Beat 10 action 6 attaches the iodine precaution to its bottle. `BufferedTubeRig` and Beat 10 action 7 use the labelled holder for the bath-warmed tube. |
| **M3 — four text-only openings** | **FIXED** | Beat 1 starts with potato/dropper/watch; Beat 2 retains its separate objectives surface but pairs entering lines with gas/iodine/clock pictograms; Beat 3 starts with cylinder and clock beside the working; Beat 15 explicitly retains the familiar lesson layout from its first frame. E42 still retains rig and graph. |
| **M4 — potato wrongly inheriting the yeast rate** | **FIXED** | Beat 15 action 5 gives the potato the caption “same measurement method; potato rate not measured here”, with no number. The 0.40 cm³ s⁻¹ triangle and “illustrative yeast run” label are attached to the yeast graph. |
| **M5 — registered S23/34 graph reading** | **FIXED** | Beat 8 action 6 and Dataset 4 show one reconstructed point: lactase concentration 0.16 mmol dm⁻³ against mass 54 g, with guides, then 54/10 = 5.4 g min⁻¹, explicitly an average over ten minutes. The reconstruction is labelled and no other curve or substance identity is invented. QP p.8 / ER p.33 are identified as register provenance; the absent original and unavailable ER sentence remain disclosed. |
| **Assets — unsupported still-frame verification claim** | **FIXED** | Handling and Assets now say “handling specified; rendered still-frame verification pending” (lines 69, 577). No completed render is claimed. |
| **Audit — gas-volume assumption** | **FIXED** | Dataset 1 explicitly scopes 24 dm³ mol⁻¹ to the approximate room-condition oxygen-yield check for the syringe outside the bath, not a universal limit for any gas mixture. |
| **Audit — initial straight segment and single-run readings** | **FIXED** | Beat 7 action 3 requires a straight 0–30 s section and smooth continuation. `RateGraph` and Dataset 1 prohibit invented replicates. The set origin is an open circle, distinguished from timed readings. |
| **Length — cut 1 and ordered-cut rulings** | **FIXED** | Beat 15 loses the repeated 23-word amylase-method sentence but retains its cited exam-form row at “How this reaches you”. Cuts 2 and 5 are not counted twice; the disc comparison and revised hook remain. The current ledger and length paragraph are updated. The older conductor-review paragraph is historical; its statement that cut 1 was not taken is superseded by the actual beat and round-one response. |

## New issue N1 — an immersed tube cannot be drawn dry

**Minor visual-direction correction; no spoken words change.** The new `tilt` contract places the tube along the flask base, mouth toward the low heel, where the peroxide explicitly pools. It nevertheless requires “visibly emptying to a residual film” and then an “emptied small tube”. The lower part of that opening is immersed: reaction mixture can occupy the tube through the opening. A builder following the dryness instruction would have to erase connected liquid.

A scale check supports the concern. Approximating the stated 85 mm base as a circular floor tilted 30°, the stated 10–15 cm³ liquid volumes give roughly 14–16 mm liquid depth normal to the floor near the prescribed downhill mouth position; the tube is only 18 mm across. This is an approximate geometry check, not a CFD calculation or a measurement of a finished flask. The conical wall and tube displacement do not justify drawing the immersed part empty. Also, a partly filled tube begins spilling when its liquid reaches the lip during the topple, before the mouth-down resting orientation; passing horizontal must not become an artificial trigger.

Apply these exact replacements:

1. In `GasSyringeRig` `tilt` (line 74), replace the two sentences beginning **“As it passes horizontal”** and ending **“residual film.”** with:

   > During toppling, the liquid surface stays horizontal and suspension begins leaving the rotated lip as soon as the liquid reaches it; do not delay spilling until the tube passes horizontal. Show the suspension entering and mixing with the peroxide. Where the tube mouth becomes submerged in the pool, show liquid continuity through the opening and reaction mixture inside the immersed part of the tube; do not draw that part empty.

2. In the last sentence of that state, replace **“the emptied small tube lying on its base”** with:

   > the small tube lying on the flask base, with reaction mixture visible inside wherever it is connected to the surrounding pool

3. In Beat 6 action 4 (line 215), replace **“a stream leaves its rotated lip and it visibly empties into the peroxide pool”** with:

   > suspension leaves its rotated lip during the topple and mixes into the peroxide pool; when the mouth becomes immersed, liquid continuity and reaction mixture inside the immersed part of the tube remain visible

Keep the existing first-contact start instruction immediately afterwards. These changes also govern the enzyme-free run and the later lessons' explicit reuse of this model. They do not require changing the flask capacity, tilt angle, reaction equation, dataset or narration.

## Changed-text scan and shared-rig comparison

- **Science and numbers:** no new error in the rate distinctions, control composition, iodine endpoint or chemistry. Independent recalculation gives 20/50 = 12/30 = **0.40 cm³ s⁻¹**; 19/60 = **0.32 cm³ s⁻¹** rounded; (23.5−19)/60 = **0.075 cm³ s⁻¹**; 0.010 × 0.20 / 2 × 24 × 1000 = **24 cm³** approximate oxygen yield; 1/13 = **0.077 s⁻¹**; 1/150 = **0.0067 s⁻¹**; and 54/10 = **5.4 g min⁻¹**. The endpoint interval remains 120 < t ≤ 150 s. The chemistry edge lists and one-frame net-reaction captions are retained. No new mechanism claim is introduced.
- **Handling:** N1 is the remaining correction to the changed directions. External pours retain mouth-down orientation, lip-origin streams and horizontal liquid surfaces. Sampling equipment and control preparation are now explicit. Blue-black/yellow-brown states remain discrete, with no shade-based concentration inference.
- **Timing:** no remaining delayed start in either measured gas or amylase run. The disc method deliberately times release-to-surface after the same brief descent, as the conductor's erratum permits. The qualitative potato hook is not a timed dataset and does not supply a rate.
- **Visuals:** no newly specified text-only teaching frame found in the revised passages. Objectives keep meaningful pictograms; the new S23/34 panel has axes, a point and guides; the exam close retains the apparatus and graphs.
- **3.2.1 geometry:** its model's Mixing contract now explicitly imports the 250 cm³ flask, offset tube, approximately 30° tilt and toppling path from 3.1.3. The old approximately 50° instruction is gone from the operative contract. Its Beat 3 uses the same vent → baseline → collect → first-contact sequence.
- **3.2.1b geometry:** its peroxide-series model (line 66) explicitly imports the same dimensions and path. Beat 7 uses that model and the same first-contact start. Both later gas controls now replace yeast with the same enzyme-free buffer. No new geometric contradiction between the three operative specifications was found; N1 is inherited through their reuse references.
- **Bung timing difference:** 3.1.3 seats the bung after equilibration with the tap venting; 3.2.1/3.2.1b seat it beforehand and equilibrate with the tap venting. Both set the syringe baseline after equilibration and close the collection path before mixing. This is a compatible preparation-state difference, not conflicting rig geometry. Later references to the tap as “added here” are stale ownership prose, not a second apparatus design.

## Quotations, E42 and validation

Quotation verification remains text-to-text against the supplied register. No examination PDF or rendered video was inspected. Rerunning `check_quotes.py --all` gives **158 strings checked, 93 not found**. Those unmatched strings are authored narration, paraphrases, old/new replacement wording and checker text; this raw count is not 93 unsupported Cambridge quotations. No newly introduced external quotation is presented without register support. The relocated amylase MS extract retains its wording and attribution.

**Unverified external quotations presented as verbatim: none found.** The six declared source gaps remain unverified: specimen P2 Q3(c) exact instruction; S23/34 mass identity and ER sentence; S23/51 Q1(d)(i) question wording; S23/52 Q1(d) question context/wording; S21/33 Q1(b)(iii) question wording; and S23/12 Q14 stem/figure plus S22/33 method text. They remain omitted or explicitly framed. The reconstruction does not verify the missing original graph or ER wording.

**E42 passes unchanged:** 146 spoken words, the labelled two-question composite, supported COMMON MISTAKE badge, four-second silent read, all five moves, and marker held through all three repairs. Its final boundary still keeps the vocabulary rulings local.

`validate_storyboard.py` rerun: **15 beats, 162 cues, zero failing beats, maximum gap 21 words**. Manual checks of Beats 6, 10, 11 and 15 confirm that the revised physical events and retained exam-form row occur at their stated cues. The validator establishes text matching, not fluid behaviour; N1 is not detectable by that script.

## Length ruling

Spoken counts by beat, excluding the silent-read direction: **87, 48, 70, 85, 88, 107, 138, 89, 102, 91, 110, 84, 146, 85, 88**. Total **1,418 words = 11:49** at effective 120 words/minute. Teaching is **1,272 words = 10:36**, **66 s above** the 9:30 base. E42 is **146 words = 73 s**, protected, **28 s above** its allowance. Total overrun is **94 s**; do not add the silent read again.

**Accept the length.** The required repeated-method cut is taken; the practical repairs account for the small increase over the round-one post-cut estimate. No further teaching cut, split, accelerated delivery or reduction of E42 is warranted. N1 changes only visual directions and leaves these totals intact.

CLEARED WITH MINOR EDITS
