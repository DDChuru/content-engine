# 4.1.1-2 — independent storyboard check, round 1

**CLEARED WITH MINOR EDITS**

The two outcomes are covered accurately, the amended plan's relevant corrections have been carried through, and the 11-second estimated overrun is acceptable. Apply the local model/cue corrections below before build. They do not require another lesson split, an added error beat or a new explanatory approach.

Reviewed STORYBOARD.md SHA-256: `526c184f631f52d6409f2cb9864a6b1f52a924b2b9d2e17cbb7b5b6c4d0fdbfe`.

Read the whole storyboard, the relevant active amended plan and weights, SHARED-SPECS, SUMMARY, the earlier Topic 4 plan check, and VIDEO-STRUCTURE including REAL-WORLD SAMPLES. Ran the supplied validator. Used the requested Topic 3 report from `origin/cloud/005-checks:cloud-checks/005/round-1/3.1.3/CHECK.md` as the report-format precedent; that particular file actually opens NOT CLEARED, so its verdict has not been treated as an authority for this lesson. This check verifies actual source PDFs, not merely the cloud register. Only this CHECK.md was written for this code; the storyboard and shared specifications were not edited.

## Plan must-fixes carried through

| Earlier ruling | Storyboard evidence | Ruling |
|---|---|---|
| MF1: recognise M24/22 Q1(a)(ii) as direct cholesterol-arrangement evidence; distinguish it from a full 4.1.1 question | Header, causal spine, Beat 13, scope/citation tables; 1 mark, QP p.3 / MS p.5 | **Carried through.** The remaining UNVERIFIED wording can now be resolved below. |
| MF1: keep Q1(a)(i) glycerol as Topic 2 recall and Q1(a)(iii) cholesterol roles in 4.1.3 | Beat 3 recall label and Beat 8 handoff | **Carried through.** |
| MF2/MF7: correct badges, retain complete allocated error beats and budgets | No selected error belongs to these two outcomes; 13 teaching beats and 9:00 remain | **Carried through / no error beat applicable.** The brief closing wording contrast is not falsely labelled examiner testimony or a common mistake. |
| MF6: real-world examples must be correct and bounded | Red blood cell, plasma and cytoplasm in Beats 1/5/13; schematic model; none handled | **Carried through.** No assay is performed, so detection range/interference requirements have no method to attach to here. |
| Should-fix 1: intrinsic does not mean transmembrane in every case | Beat 6 explicitly distinguishes embedded from spanning | **Carried through.** Correct the later visual census under M3. |
| Should-fixes 2/6: orientation and typicality | Outside/top, cytoplasm/bottom; chains external; “many” proteins drift; cholesterol in animal membranes | **Carried through.** The author correctly avoids claiming that hydrophilicity determines external rather than cytoplasmic sidedness. |
| Full lesson shape | Developed context, separate objectives/pictograms, explanation, same-model recap, cited exam close and callback | **Carried through.** |

MF3 plant equilibrium, MF4 signalling response and MF5 practical measurements belong to other lessons. This report does not certify their implementation elsewhere.

## Must-fixes — exact local edits

### M1 — make the assembly contract physically and temporally consistent

The token spec says “tails never in water” and Assets requires tails inward in every assembly frame, yet Beats 3–4 deliberately begin with isolated, randomly oriented phospholipids in water. Those instructions cannot all hold at once. The isolated schematic is a valid way to introduce amphipathic structure; bound the orientation invariant to the assembled membrane.

Replace the token/model/Assets invariant wherever it applies to the pre-assembly state with:

> In the assembled membrane, heads face the aqueous surroundings and tails face the hydrophobic interior. Before assembly, isolated tokens may have tails exposed to water; show this as the initial dispersed schematic, not a stable membrane arrangement. During assembly, tail exposure decreases as the tokens cluster and form the bilayer. No phospholipid crosses from one established leaflet to the other.

Beat 4 action 4 starts a three-second assembly, but action 8 says assembly completes at “two layers”, **35 narration words later**: approximately 17.5 seconds at the planning rate. Both cues match the script, so the validator does not detect this conflict. Keep the short assembly and make the later cue a reading of the completed state.

Replace Beat 4 action 4 with:

> At *excluded from the water and come together*, run `assemble` over about 3 seconds: tokens move and rotate into the two leaflets, ending with twelve phospholipids per leaflet, heads outward and tails inward. Continue the normal molecular jitter after completion; do not restart assembly at later cues.

Replace action 8 with:

> At *two layers*, bracket the two already-formed rows and reveal the tag *12 per layer (drawn section)*. This cue identifies the completed bilayer; it does not complete or replay assembly.

For later staged component placement, add this caption to the model contract:

> Components enter progressively to build the explanatory drawing; this is not a depiction of cellular membrane synthesis or protein insertion machinery.

This preserves all narration and motion while removing conflicting build instructions.

### M2 — keep the glycolipid drawing distinct from the phosphate-head token

The glycolipid is explicitly drawn using the same warm-amber round head and two tails as `PhospholipidToken`. In Beat 3 that identical head is taught as phosphate-containing. Reusing it unqualified for the glycolipid can teach that the carbohydrate chain is attached to the same phosphate head. A generic glycolipid does not need extra lipid chemistry, but it needs a distinct representation.

Replace the `glycolipid` geometry and Beat 9 action 2 with:

> Draw a schematic lipid anchor with two hydrophobic tails and a small neutral-coloured attachment node carrying the four-bead green carbohydrate chain. Do not reuse the amber phosphate-head glyph or add a phosphate/glycerol label. Label the anchor *lipid part (schematic)* and the green chain *carbohydrate chain*. No molecular backbone or additional lipid chemistry is taught.

Publish this same geometry for downstream reuse, including 4.1.3. The familiar green chain, position 2 and external orientation remain unchanged.

### M3 — align the recap with the completed protein model

After Beat 10 the model has **four spanning proteins**: channel, carrier, receptor-glycoprotein and the separate glycoprotein at position 12, plus **one extrinsic protein**. Beat 12 still says “the three drawn here” and action 8 outlines “the four proteins”. Those counts describe the earlier, incomplete model.

Replace the relevant Beat 12 narration with:

> Intrinsic proteins are embedded in it, with hydrophobic R groups against the tails; the four spanning proteins drawn here are transmembrane proteins. An extrinsic protein sits on a surface. Phospholipids and many membrane proteins can move sideways: fluid. Proteins scattered through it: mosaic.

Replace Beat 12 actions 4–8 with:

> At *Intrinsic proteins are embedded in it*, highlight all four spanning proteins and their hydrophobic middle regions. At *the four spanning proteins drawn here*, bracket the channel, carrier, receptor-glycoprotein and separate glycoprotein. At *An extrinsic protein sits on a surface*, highlight the cytoplasmic extrinsic protein. At *can move sideways: fluid*, show the static lateral arrows. At *scattered through it: mosaic*, outline all five proteins. Keep the recap still, with annotations fading in on the familiar model.

Propagate the completed-model count to the scope ledger and absolutes sweep. Beat 6's three examples and Beat 7's four proteins are correct **at those earlier build stages** and should remain as written.

### M4 — close the source gaps that the PDFs settle

Change citation rows 5–6 to **PDF-CHECKED (independent storyboard check)** for the source/context claim; row 6 remains an editorial scope ruling, not an exam quotation. Remove UNVERIFIED items 2–3 after recording the verified wording below. Keep the genuine boundary in item 1 as **“No directly relevant full 4.1.1 question has been verified in the cited blocks.”** Do not turn it into SUMMARY's unbounded “none exists”.

Replace Beat 13 action 3's student-facing UNVERIFIED note with:

> *Our paraphrase of M24/22 Q1(a)(ii): one valid link between a cholesterol region's polarity and its position earns the available mark. Scheme wording checked against MS p.5.*

Both polar and non-polar relationships may still be taught; do not imply that both are individually mandatory for this one mark.

## Citation audit — actual PDFs

All page numbers are one-based PDF pages. Syllabus: `/home/dachu/sme-9700-archive/syllabus/664560-2025-2027-syllabus.pdf`. M24 sources: `/home/dachu/sme-9700-archive/pastpapers/2024/March/9700_m24_qp_22.pdf` and `9700_m24_ms_22.pdf`. Extracted with `pdftotext -layout`, including selected-page extraction for QP p.3 and MS p.5.

| Storyboard quotation / claim | Source | Finding |
|---|---|---|
| Full outcome 4.1.1 | Syllabus p.21; detailed reference 4.1.1 | **VERBATIM MATCH.** |
| Full outcome 4.1.2 | Syllabus p.21; detailed reference 4.1.2 | **VERBATIM MATCH.** |
| “hydrophobic and hydrophilic interactions that account for the formation of the phospholipid bilayer and the arrangement of proteins” | Syllabus p.21 | **VERBATIM MATCH**, excerpt. |
| Full introductory sentence beginning “The fluid mosaic model, introduced in 1972…” | Syllabus p.21 | **VERBATIM MATCH.** |
| “The model continues to be modified as understanding improves …” and the stated continuation | Syllabus p.21 | **VERBATIM MATCH**, explicitly shortened excerpt. |
| “hydrophilic (polar) phosphate heads and hydrophobic (non-polar) fatty acid tails” | Syllabus p.18, 2.2.11 | **VERBATIM MATCH**, excerpt. |
| M24/22 Q1(a)(ii) asks about cholesterol orientation, 1 mark | QP p.3 / MS p.5 | **CLAIM VERIFIED.** The QP asks: “Using the information in Fig. 1.2, explain the orientation (positioning) of cholesterol molecules in the phospholipid bilayer, as shown in Fig. 1.1.” |
| Orientation credited through polar/non-polar interactions | MS p.5, Q1(a)(ii) | **CLAIM VERIFIED; not originally quoted.** Actual alternatives include `hydroxyl / polar, group, interacts with, phosphate heads ;` and `non-polar part, in region of / AW, fatty acid tails / AW, as both are, non-polar / hydrophobic ;`. “Any one from” governs the point. The aqueous-facing polar hydroxyl explanation is also accepted. |
| M24/22 Q1(a)(i) glycerol, prerequisite | MS p.5 | **CLAIM VERIFIED:** `glycerol ;`, 1 mark. Topic allocation is our editorial judgement. |
| M24/22 Q1(a)(iii) one cholesterol role, handed off | QP p.3 / MS p.5 | **CLAIM VERIFIED:** one role, 1 mark; belongs to 4.1.3 teaching. |
| Beat 13 wrong/right OH sentences | No claimed Cambridge quotation | **AUTHOR-CONSTRUCTED CONTRAST.** Scientifically sound, clearly captioned as ours. It must not acquire an MS reject citation or COMMON MISTAKE badge. |
| “No marked 4.1.1 question” | Limited source set | **BOUNDED REVIEW FINDING**, not an examiner statement or archive-wide absence claim. |

No exam quotation is fabricated or mismatched in this storyboard. The two PDF-UNCHECKED rows are descriptions/editorial interpretation, not unchecked verbatim extracts; both source contexts are now resolved.

## Scope, science and visuals

Formation/arrangement and component placement stay within DESCRIBE. The initial explanation of heads, tails and protein R-group regions supports the syllabus's explicit interactions requirement. Cholesterol's hydroxyl group faces water/heads, rings occupy the tail region, and cholesterol is not assigned to all membrane types. Carbohydrate chains remain external in the cell-surface-membrane model. Hydrophilicity explains avoiding the core; it is correctly not offered as the explanation for choosing between two watery faces. No signalling cascade, transport mechanism lesson, membrane potential or new lipid-class catalogue is added.

All 13 beats specify a non-text visual from entry. Objectives have their own pictograms; the recap appropriately freezes the familiar model with targeted annotations. Explanation beats include molecular motion and cue-linked spatial changes; no unanchored long slide hold was found. No bench procedure, reagent colour transition, timer, measured data or osmosis inference occurs here. Molecular counts, bead lengths and drift timing are explicitly drawing specifications, not measurements. In the mature model, ensure the pore's hydrophilic lining remains distinct from the protein's hydrophobic exterior touching the tails.

The brief closing contrast is permissible under the supplied SHARED-SPECS, which explicitly allows an author-captioned wording contrast. It is immediately accompanied by the correct statement and a strike, not an unsupported claim about examiner prevalence. Do not add an unplanned 75-second error beat merely to repeat it. The separately labelled RBC hook callback is contextual explanation, not an extra marking point in the cholesterol answer.

## Validator and independent runtime ruling

Executed exactly:

`python3 work/006/validate_storyboard.py storyboards/topic-04/4.1.1-2/STORYBOARD.md`

Result: **1,102 words; 125 cues; 13 beats; zero failing beats; maximum cue gap 21 words.** Narration words by beat: **88, 44, 77, 90, 98, 95, 85, 91, 75, 81, 80, 91, 107**. This validates literal cue matching, not the assembly completion conflict under M1.

**Accept 9:11 against 9:00**, plus any genuinely additional final visual hold not already included in the effective timing convention. The 2-second final-frame hold should be explicitly scheduled; do not conceal it inside a precise 9:11 claim. The modest overrun buys the source-scope qualification and hook callback. Do not speed narration. The author's optional 24-word cut list is arithmetically correct and is not required for clearance. If shortening, Beat 7's final nine-word sentence is the least costly cut; retain the useful two-ended-molecule summary in Beat 3.

Recount and remap the altered Beat 12 cues after M3. No error beat exists to shorten; adding one is unnecessary. Final measured audio controls render timestamps.

## Should-fixes

- Remove the artificial “time-lapse ×4” label unless the timeline actually applies a fourfold change to the existing schematic motion. No observed molecular timescale is being reproduced; **“schematic lateral motion; not measured”** is sufficient.
- The slot arithmetic is a layout convention, not a biological calculation. Keep ordinal component positions consistent across lessons and visually verify that proteins/cholesterol displace space rather than overlap phospholipid glyphs. Twelve visible phospholipids per leaflet is acceptable if the canvas accommodates them.
- The 44-second opening and 53.5-second close exceed older phase suggestions but do useful work. Avoid extending their meta-commentary further; preserve the biology and the explicit distinction between the cited cholesterol question and syllabus-based model coverage.

The relevant plan must-fixes are implemented. M1–M4 are bounded corrections to the local drawing, cues and resolved source metadata; no further conceptual planning round is needed. Rendered geometry and timings remain untested.

CLEARED WITH MINOR EDITS
