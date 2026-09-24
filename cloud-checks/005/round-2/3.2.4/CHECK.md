# 3.2.4 — independent round-two check

25 September 2026. Reviewed the actual revised narration, visual instructions and tables against `CHECK.md`, the 3.2.4 and cross-cutting sections of `work/005/FIXES-round-1.md`, and the shared-specification errata. The round-one substantive repairs are present. The remaining edits below are local visual/method clarifications; no narration rewrite or further authoring round is required after applying them exactly.

Reviewed STORYBOARD.md SHA-256: `7c04f790f64cdfd9db3ef1884653411e49b66e3f88deec12e47ae468c41fe2ad`. Repository revision `417a9b9e` is user-supplied context; no git command was run. Only this report was written.

## Round-one findings, checked in the teaching itself

| Round-one item | Status | Evidence in the revised storyboard |
|---|---|---|
| M1.1 — measured free volume versus nominal bead input; draining | **FIXED** | Beat 5 says “mixed with an equal volume of buffer”, not “to the same volume”. The tags distinguish “A: 4.0 cm³ measured” from “80 beads from a nominal 4.0 cm³ mixture; liquid volume not measured”. The new `drain` state and Dataset 1 specify one minute; Dataset 2 records B/C total liquid volume as not measured. The approximately 14 cm³ bead-volume claim is gone. |
| M1.2 — concentration limitation must reach the student | **FIXED** | Beat 5 now narrates “That is not a perfect match”, explains immediate dilution in A and unmeasured carried water in B, and highlights the tubes with 0.71% calculated versus close to the added 1% outside the beads. The checklist says “same added starch suspension: 10.0 cm³ at 1%” and “not matched: liquid volume and starting starch concentration”. The limitation is no longer confined to author notes. The new preview needs the visual clarification below. |
| M1.3 — operational comparison and possible causes | **FIXED** | Beat 6 adds “for these two preparations”, with the tags “these two preparations, these conditions” and “not the activity of equal retained enzyme”. Beat 7 explicitly adds unmatched concentration/volume as a possible contribution; the bracket is the required “possible contributions; this comparison alone does not separate their effects”. Spine, Dataset 2 and recap tags agree. |
| M1.4 — preserve controls/caveats, show repeats, update cues/ledgers | **FIXED** | Equal nominal stock input, unproven retained active enzyme, enzyme-free beads and the separate reuse run remain. Beat 7 action 5 displays “repeat each preparation and comparison before drawing a general conclusion”. No repeat results are invented. Updated scope/absolutes ledgers reflect the actual explanation; revised cues pass. |
| M2 — reuse inference | **FIXED** | Beat 8 uses the requested replacement narration verbatim: the endpoint is one interval later, and repeated comparisons are needed to establish a consistent change. The visual says “recorded endpoint 30 s later”. Dataset 3 uses τ for the underlying threshold and explicitly states that the adjacent windows do not overlap. No unchanged-activity or proven-deterioration conclusion is substituted. |
| M3 — exam close anchored throughout; uncued material row; objectives | **FIXED** | Beat 12 now retains strainer, beads, collecting beaker, column and bars from its first frame to its last; highlights persist. The material-properties row is omitted from the learner-facing close. The authored-contrast caption remains while the wrong line is visible, with the correct line prominent at the end. Beat 2 uses its own branded surface with authored pictograms. A stale citation-ledger sentence still describes the removed row; correct it as housekeeping below. |
| Product-inhibition clarification | **FIXED** | Both model contract and Beat 9 label it “general example where product inhibition occurs; not a result of this amylase experiment”. Products accumulate without docking; an activity arrow slows and recovers with flow. No binding site or inhibitor class is invented. |
| Bead-making repeatability and syringe orientation | **FIXED** | Dataset 1/model specify 50 cm³ calcium chloride in the 100 cm³ beaker, 50 cm³ measured rinse water, one-minute drainage, and syringe “tip down, plunger above”. Beat 3's checklist carries the rinse/drain conditions. These are identified as authored choices. |
| Chemistry-description clarification | **FIXED** | “Schematic calcium-ion cross-links; no atom-resolved covalent bond graph” replaces the contradictory denial of atom labels. Ca²⁺ labels are now compatible with the description. |
| Callback absolute | **FIXED** | The spoken “could not get back” callback is removed. The final apparatus image still answers the recovery hook. Its appearance in the historical response/sweep is not current narration. |
| Sampling-resolution brackets | **FIXED** | `RateGraph` and Beat 6 explicitly label the brackets “sampling-resolution bounds”, not replicate variability or confidence intervals. |
| Length cuts 1–5 and recount | **FIXED** | Cuts 2 and 3 are taken; cut 1 is not taken; “iodine's own colour” and “with no needle” remain. Independent recount confirms 825 words. The sentence implying round one had already approved this final duration overstates the previous ruling; the present report explicitly accepts it below. |

No round-one substantive item is **NOT FIXED**. The residual shared-method issues are separated below rather than being hidden inside those statuses.

## Shared errata and new/residual issues

| Shared item | Status | Finding |
|---|---|---|
| Clock starts at first contact and is never reset | **FIXED** for the clock; sampling display **PARTLY** | Model, Beat 6, Beat 8 and Datasets 2/3 all start the clock when starch first contacts the solution/beads. However, the sampler still takes a literal “At t = 0” sample after that contact, and the rows still label it as an exact zero-time observation. The revised first-contact contract exposes this inconsistency; see edit 1. |
| No text-only frames | **PARTLY** | Objectives and exam close are repaired. The fix summary says hooks open on a picture, but Beat 1 still first introduces its beaker at “get an enzyme back”, rather than explicitly from frame one. This is a small opening-state omission, not a failure of the revised exam close; see edit 3. |
| Measured versus calculated/nominal | **PARTLY** | Reciprocals, ratio, 0.71% and nominal bead input are correctly distinguished. The nominal start sample still needs its own label, and Dataset 2 uses t both for the recorded sample time and an interval for the underlying threshold. Edit 1 resolves both. |
| Identical blue-black shade | **FIXED** | The sampler now explicitly gives every positive well the same shade. The withdrawn intensity-grading allowance is absent from the active specification. |

### 1. Align the start sample with the running stopwatch

A mixed-liquid sample cannot be withdrawn at the exact frame of first contact and also be a sample taken after mixing. The revised 3.1.3 sampler already distinguishes these events: its first sample is **nominal 0 s**, its stopwatch continues running, and times are recorded at withdrawal. Carry that contract into this reuse of the same sampler.

Replace the `AmylaseIodineSampler` sentence beginning “At t = 0 and then every 30 s” with:

> Prepare each row with one equal drop of iodine in every well before adding starch to that tube. Start its stopwatch at first contact and keep it running. Withdraw the start sample promptly after completing the pour and mixing; label that well ‘start sample: immediately after mixing (nominal 0 s)’, with the stopwatch visibly showing elapsed time rather than a frozen zero. Withdraw subsequent samples at 30 s, 60 s and every further 30 s on that same clock. Record sample times at withdrawal; transfer each drop promptly above its next well without touching the iodine.

Carry that instruction into Beat 6 action 1 and the B2 row in Beat 8 action 1: the prepared iodine rows exist before the pour, and the post-mixing start sample is nominal, not instantaneous. In Dataset 2 rename column **0** to **start (nominal 0 s)** and replace the conditions' “at 0 s and every 30 s” with **“immediately after mixing (nominal 0 s), then at 30 s and every subsequent 30 s, timed at withdrawal from first contact”**. In Dataset 3 rename **0 … 330 s** to **start sample, then 30–330 s** and add the same nominal-start note. Keep the later readings and endpoint calculations unchanged.

For Dataset 2's endpoint-window column use **120 < τ ≤ 150 s** and **300 < τ ≤ 330 s**, with **“τ = underlying loss-of-blue-black threshold time; t = recorded first-negative sample time”**. The reciprocal bounds refer to 1/τ; the plotted 1/t values remain the calculated proxies. This aligns Dataset 2 with the corrected notation already used in Dataset 3.

Also replace the general timer tag **“t = 0: starch meets enzyme”** everywhere it applies to A/B/C/B2 with **“t = 0: starch first contacts the tube contents”**. C contains enzyme-free beads; its timer should start identically without labelling them enzyme-containing. The timing event itself is already correct. No spoken cue needs to change.

### 2. Label the new concentration preview as a preview

Beat 5 action 4 draws starch distributed in the actual tube illustrations before Beat 6 performs the timed addition. Its author note “drawn as it will be once the starch is in” explains intent to the builder but is not a learner-facing distinction. Avoid showing an apparent reaction already in progress before its clock starts.

Replace the opening of Beat 5 action 4, up to its first semicolon, with:

> At *That is not a perfect match*, open a separate schematic inset of tubes A and B, captioned **preview: concentration after starch addition; the timed run has not started**. Keep the real preparation tubes and their separate starch tubes unchanged behind it. Put the concentration dots, liquid-film highlight and calculated/approximate tags in this inset only;

Replace its final sentence with:

> Close the preview inset after the carried-water highlight; retain its concentration tags as preview annotations. The actual tubes remain unmixed until Beat 6's first-contact pour and clock start.

The current cue strings and spoken explanation remain valid. This is a visual sequence clarification, not another investigation or new data.

### 3. Establish opening pictures before their first spoken cue

Add this at the start of Beat 1's visual actions:

> From the first frame, show the reaction-mixture beaker with dispersed enzyme miniatures and its schematic caption. At *get an enzyme back*, highlight the existing beaker and add the question mark above the empty hand.

This replaces the current action 1's introduction of that beaker at the cue. On Beat 2's separate objectives surface, make the three existing pictograms visible from frame one; the text lines still enter on their current cues. These instructions implement the shared no-bare-frame requirement without adding an unfamiliar lesson diagram to the objectives.

### Non-narrated housekeeping

- In the first **UNVERIFIED items** bullet, replace the two-row description with: **“Beat 12 shows the verified Q3(b)(ii) mark-scheme points under our heading ‘why immobilise’, with ‘question wording not reproduced (UNVERIFIED)’. The Q3(b)(iii) material-properties quotation remains in the author-facing citation ledger only. Neither question is reproduced.”**
- Replace the length paragraph's sentence beginning “The checker ruled that this residual teaching overrun is accepted” with: **“Round one requested a recount after the scientific repairs and did not pre-clear the unknown final duration. Round two accepts the revised 825-word, 6:52.5 teaching duration.”**
- Label the retained **Conductor review (cloud run 005)** explicitly **“historical first-draft review; superseded by the round-one response and current runtime”** so its 34-second overrun and ledger-only limitation are not mistaken for current status.

## Changed-text science, handling and evidence scan

The repaired concentration account is appropriately qualified. The free tube calculation is **10 × 1% / 14 = 0.714…% → 0.71%**; B's near-added-strength surrounding liquid is a qualitative starting approximation, with carried water unmeasured, not a claimed measurement. The explanation expressly allows diffusion, preparation losses and concentration/volume differences to contribute. No renewed claim of equal retained activity, a universally lower rate, or guaranteed stability appears.

The unchanged numerical results remain internally consistent: **1/150 = 0.0067 s⁻¹**, **1/330 = 0.0030 s⁻¹**, **1/360 = 0.0028 s⁻¹**, rounded as shown; bead/free proxy ratio **150/330 = 0.4545… ≈ 0.45**. The reuse threshold windows **(300,330]** and **(330,360]** are correctly non-overlapping. One pair of runs still cannot establish a consistent activity change. No new dataset is invented by the repairs.

New calcium chloride and rinse volumes fit the apparatus and are clearly chosen conditions. Syringe orientation is now explicit. Mouth-down pours, lip-origin streams, level liquid, supported bath tubes and droppers above wells remain specified. The new drainage step does not claim the beads are dry; retained water is expressly unmeasured. No new impossible handling sequence was found beyond the start-sample issue addressed above. Rendered handling has not been inspected because this is a storyboard check.

The product-inhibition sketch is now genuinely generic and avoids specifying a binding mechanism. Flow, not immobilisation alone, removes product; the closed-batch distinction remains. No new covalent reaction, atom mapping, invented reagent colour or intermediate colour is introduced. Both iodine outcomes remain real colours with one-frame changes.

The source quotations still match the supplied verified register: syllabus 3.2.4 p.20 and materials p.58; Specimen 2022 Paper 2 Q3(b)(ii)/(iii), MS p.12; November 2020 Paper 21 Q2(b), QP p.6. The plan entries were rechecked for exact wording and attribution. The quote script reports **18 strings, zero not found**; this supports but does not replace that attribution check. Single-quoted new captions and response-table wording are authored instructions, not disguised Cambridge quotations.

**Unverified quotations used: none.** The unreproduced specimen question wording/arrangement, Learner Guide p.18 wording and wider November 2020 question wording remain explicitly unverified. No PDF re-verification is claimed.

## Cues and length ruling

The supplied read-only validator returns **118 cues, zero failing beats**, with a maximum cue gap of **19 words**. Independent narration extraction gives **56, 38, 84, 49, 107, 95, 92, 60, 80, 62, 49, 53** words: **825 words = 412.5 seconds = 6:52.5** at the agreed 120 words/minute of final video. The cue strings in the required edits above remain unchanged.

The accounting is correct: **788 − 21 + 58 = 825**. The extra 58 words are the requested scientific qualifications and reuse repair, not fresh teaching repetition. **Accept the 52.5-second teaching overrun.** Keep the practical instructions, honest interpretation, staged advantages, recap and shortened exam close. There are zero allocated error beats, so no protected error has been thinned. Do not accelerate narration or double-add ordinary holds to this planning rate.

Apply the local method/display edits above before narration/build. They leave the narration and its runtime unchanged; no further check round is required for these exact edits.

CLEARED WITH MINOR EDITS
