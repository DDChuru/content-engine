# CHECK — 5.2.1 — round 2

Checked 27 September 2026 at `ac5d63c3`, against the complete current storyboard, own round-1 CHECK, `work/007/FIXES-round-1.md`, shared model contract, open-asset register and conductor's round-1 README (read from `origin/cloud/007-checks`). Source SHA-256: `0dae5800aa55dda909773d2942b3ef0cd859c3c1693fec8b2f93403c1ba4e77e`.

All round-1 must-fixes are resolved under the conductor's image ruling. One minor model-style instruction needs alignment with 5.2.2. No storyboard edited.

## Every round-1 item

| Item | Status | Evidence in revised storyboard |
|---|---|---|
| M1 — separation, count and labels on the same frame | FIXED | Model/count-strip contract and Beat 8 actions 2–5 update to eight daughter chromosomes/eight DNA molecules on separation; later speech highlights the existing state. One-pole row waits for arrival. Beat 9 replay and plant Beat 14 retain the atomic change; telophase distinguishes whole cell from each nucleus. |
| M2 — spindle outside intact envelope | FIXED | Model transition and Beat 6 action 2 keep microtubules outside the envelope until fragmentation; attachment follows in Beat 7. Plant Beat 13 applies the same constraint without centrioles. |
| M3 — visibility absolute and image dependency | FIXED under conductor ruling | Beat 1 says staining *can* reveal chromatin and describes condensed chromosomes in *some* cells. Rings target selected visible examples. `IMG-5.2.1-01` is fully specified as an OPEN ASSET in `work/007/ASSETS-NEEDED.md`; narration says *the image* and remains valid for a licensed photograph or the explicitly labelled drawing fallback. Actual image delivery is not a condition of this storyboard check. |
| SF1 — stale PDF flags | FIXED | Citations items 2–4 now resolve the historical flags through the round-1 original-PDF audit. Nucleolus credit is verified. E5-03 acknowledges original *State* versus authored *describe*. Cards remain adaptations; image metadata and Topic 1 component names remain honestly open. |
| SF2 — error timing | FIXED | E5-04: 60.83 s speech + 4 s read + 8.67 s anchored holds = 73.50 s; at least 6.11 s inside the 94-word talk-through. E5-03: 62.07 + 4 + 8.93 = 75.00 s; at least 7.35 s inside the 91-word talk-through. Local tally/reject comparisons anchor the holds. Measured audio must preserve the stated minima; this is a feasible schedule, not a claim that audio exists. |
| SF3 — objective entry | FIXED | Beat 2's three pictogram groups are visible on entry; subsequent cues introduce text/highlights. |
| SF4 — E5-03 marking precision | FIXED | Completed answer is described as sufficient for three available marks, not all compulsory alternatives. Local rejects and the separate acceptance example remain intact. |
| SF5 — handle bookkeeping | FIXED | Typicality text uses *line up, part the pair, walk apart* and explicitly distinguishes the scientific centromere/separation description. |
| SF6 — final hold | FIXED | Beat 19 and runtime table add two seconds to 12:27, giving 12:29. |
| SF7 — optional-cut arithmetic | FIXED | Original list is correctly identified as 57 words; cuts remain optional and human-count teaching has not been silently removed. |
| Runtime ruling | FIXED | 12:29 including the hold is within the round-1 explicit 12:29.5 acceptance. Both full error scripts are preserved. |
| Quote-check reproducibility | FIXED | Revised script can read missing input files from their existing input-branch refs. Independent literal run completes: 9 checked, 0 not found. No fetch was needed. |

## Plan must-fix propagation and changed-text scan

MF1 now reaches executable animation cues as well as the table: post-S/metaphase 4/8, separated whole cell 8/8, arrived pole/new nucleus 4/4, daughter cell 4/4; human counts remain qualified. MF2 remains correct: E5-03 local envelope/cell-plate repairs persist through completion; E5-04 conserves chromosome 11's two DNA molecules and distinguishes three marks from four features. MF3 nucleolar disappearance/reappearance remains in both variants. MF4 is satisfied for storyboard review by the OPEN ASSET specification, neutral image wording and conductor-approved labelled-drawing route. MF5 belongs to 5.2.2. MF6 remains 6/15 sampled papers, 14 overlapping marks, with local A/R distinctions intact. All applicable plan must-fixes have reached this storyboard under that ruling.

No new biological/counting error, invented reading, estimate represented as an observation, unsafe handling instruction or text-only entry was found in the changed text. Counts remain schematic tallies; recap and exam surfaces retain their models. Replays preserve the separation contract. The remaining issue below is a rendering-contract inconsistency, not a biological failure.

## Minor edit — align the owner and consumer style contract

The new owner paragraph at storyboard line 40 says the blue variant is used for 5.2.2's diagram references beside real images. But 5.2.2's model section explicitly restricts that variant to `FieldOfViewSchematic`, retaining shared hues elsewhere. `SHARED-SPECS.md` lines 189–190 also say diagram references. Keep the narrower, already specified consumer behaviour.

Replace the entire **Render styles** paragraph in 5.2.1 with:

> **Render styles (registered by the conductor after round 1, at 5.2.2's request):** `default` uses the chromosome hues above. `toluidine-blue-schematic` is a plant-only style with dark-blue chromatin and chromosomes on a paler background, with no per-chromosome hues; in 5.2.2 it is used exclusively inside `FieldOfViewSchematic`. Diagram references beside the image panels retain `default`. Geometry, stage states and counts are identical in both styles. Retain the schematic and non-garlic-karyotype captions.

Replace the corresponding shared-spec bullet with:

> `MitosisCellModel` registers `renderStyle: toluidine-blue-schematic` (plant variant only, dark-blue chromatin and chromosomes on a paler background) exclusively for 5.2.2's `FieldOfViewSchematic`. Its diagram references beside image panels retain the default chromosome hues. Geometry, stage states and counts are unchanged; retain the schematic and non-garlic-karyotype captions.

This is the same shared minor edit recorded in 5.2.2's report; it changes no narration or runtime.

## Validation and evidence

Independent command: `python3 work/007/validate_storyboard.py storyboards/topic-05/5.2.1/STORYBOARD.md` — **19 beats, 1,494 words, 172 cues, maximum gap 24 words, 0 failing beats**. E5-04 147 words/94 talk-through; E5-03 150/91. `python3 work/007/check_quotes.py storyboards/topic-05/5.2.1/STORYBOARD.md` — **9 checked, 0 not found**. The checker matches permitted text sources; original-PDF authority comes from the round-1 audit, not this script alone.

No new substantive Cambridge quotation was introduced. Rechecked the newly clarified command-word context directly with pdftotext against `/home/dachu/sme-9700-archive/pastpapers/2022/November/9700_w22_qp_23.pdf`, pp10–11: Q4(a)(ii) uses Describe; Q4(a)(iii) uses State and ends with two new cells. The existing quotation and figure audit remains recorded in round 1.

Runtime: 1,197 teaching words = 598.5 s; errors 147 + 150 = 148.5 s effective; total 747 s + 2 s final hold = **749 s (12:29)**. Asset files and final audio are future production work, not additional demands for this review.

CLEARED WITH MINOR EDITS
