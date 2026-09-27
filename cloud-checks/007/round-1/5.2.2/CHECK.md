# CHECK — 5.2.2 — round 1

**NOT CLEARED.** The amended plan's E5-05 repair, counting rules and bounded duration inference are present. The real-image must-fix remains an unresolved dependency. In addition, the decision strip incorrectly routes anaphase through “one group”, the stain timer lacks first-contact synchronisation, and the universal dropper instruction contradicts liquid removal.

Independent check, 27 September 2026. Read the entire storyboard against the complete local VIDEO-STRUCTURE.md (including REAL-WORLD SAMPLES), SYLLABUS-9700-DETAIL.md, amended plan/weights, SHARED-SPECS and SUMMARY. Retrieved the original plan CHECK from `origin/cloud/007-checks` and traced its applicable must-fixes below. Ran the validator. Read original Cambridge PDFs with pdftotext and inspected the relevant question figures; independently retrieved the SAPS student and technical sheets. No storyboard was edited.

## Must-fixes — exact replacements

### M1. Remove the “one group” gate that wrongly includes anaphase

The causal spine, DecisionStrip step 3, Beat 10 heading and opening all put anaphase under a single chromosome group. Beat 10 then correctly teaches two separated groups. A learner following the decision strip could exclude anaphase before reaching its evidence.

Replace the causal-spine sentence beginning “Within one group…” with:

> Use chromosome arrangement as well as the number and positions of groups: condensed chromosomes dispersed through the nuclear region support prophase; chromosomes arranged at the equator support metaphase, allowing for viewing angle; two separated groups of condensed daughter chromosomes towards opposite poles support anaphase. Two reforming nuclei with decondensing chromosomes within one dividing cell support telophase.

Replace DecisionStrip step 3 with:

> **3 · chromosome arrangement:** dispersed condensed chromosomes → prophase; equatorial arrangement → metaphase; two separated condensed groups towards opposite poles → anaphase. Compare with step 2's two reforming nuclei for telophase.

Replace Beat 10's title with **Read the arrangement: prophase, metaphase and anaphase**. Replace its opening narration sentence with:

> Now read the chromosome arrangement within each cell.

Replace Beat 10 action 1 with:

> At *Now read the chromosome arrangement*, light DecisionStrip step 3 beside PM-HIGH. At *within each cell*, ring the three selected cells, including the anaphase cell with two separated groups. Do not place that example beneath a one-group heading.

The original S21/22 figure supports this distinction: E has an equatorial chromosome arrangement; F has two separated groups. This correction retains the plan's boundaries-and-groups-first approach and its uncertainty exit.

### M2. Supply the mandatory real specimens before clearance

Every PM frame is currently a grey placeholder. The syllabus expressly includes photomicrographs and slides. Eight required frame IDs plus the additional detail-poor cell in Beat 12 have not been matched to actual images. The declaration that audio must wait is appropriate, but it is not evidence that the plan's image must-fix is complete.

Replace the asset completion instruction with:

> Before production clearance, attach the actual image files for PM-LOW, PM-HIGH, PM-PRO, PM-MET, PM-MET-ANGLE, PM-ANA, PM-TEL and PM-UNCLEAR. Record each source URL or archive identifier, reuse licence, organism, stain/preparation, crop and the exact cells used by each beat. Also identify the detail-poor cell used in Beat 12. Confirm that every narrated feature is visible: cell boundaries, a resolved interphase nucleus, each stage's chromosome arrangement, the alternate metaphase view, and the two reforming telophase nuclei. Trace a cell plate only where one is actually resolved. PM-LOW must support any cap/meristem labels placed on it. Use an actual toluidine-blue preparation as the colour reference for the demonstrated protocol. If one field cannot supply all stages, use explicitly labelled separate fields from the documented set and update the cues. Do not create, recolour or substitute schematic microscopy to fill missing evidence. Keep image pixels static; animate only annotations.

The missing source/licence/organism/stain values must be established from real assets, not filled with invented wording. Resolving the Topic 1 microscope component identifier and checking its implementation are also outstanding production dependencies.

### M3. Start the stain timer at first contact, not the subsequent time cue

Beat 6 action 4 dispenses the stain at “Add one drop” but starts the two-minute timer at “leave it for two minutes”, after further narration. Unlike the acid treatment, the stain state does not explicitly bind timer start to contact. The plan and VIDEO-STRUCTURE require contact timing throughout.

Replace Beat 6 action 4 with:

> At *Add one drop*, dispense the toluidine blue from above the tips, without touching the specimen. On the rendered frame when the drop first contacts the root-tip material, start the two-minute timer at **2:00** and begin the gradual staining change. Show **1% aqueous toluidine blue**. At *leave it for two minutes*, highlight the already-running timer and introduce the labelled time compression; never initialise or reset the timer at this later cue. Finish the treatment before removing excess stain.

Replace Beat 6 action 5 with:

> At *darken in place to deep blue*, highlight the continuing colour change that began at contact. Do not start a second staining animation. Let the single timer and staining sequence finish before the rinse action.

Replace the rig's `stain` state with:

> `stain`: one drop contacts the tips; that same frame starts the **2:00 → 0:00** treatment timer and gradual staining. Time compression is labelled. Later narration cues highlight the existing timer/change rather than restarting either.

The acid timer already explicitly starts on the first-contact frame and is not reset; retain that contract.

### M4. Distinguish dispensing from aspiration

The rig's Handling paragraph says the dropper never touches liquid or specimen, while `rinse-stain` requires it to draw off liquid. A tip suspended above the liquid cannot aspirate it.

Replace that dropper instruction with:

> To dispense stain or water, hold the dispensing tip above the material without touching the specimen. To remove excess liquid, compress a separate pipette bulb before immersion, lower its tip just into the liquid at the edge of the watch glass away from the root tips, and release the bulb to aspirate. Lift and empty it into a labelled waste receptacle. Repeat after adding rinse water. Keep the root tips in the watch glass; do not aspirate them.

Apply this to Beat 6 action 6 and `rinse-stain`; add the waste receptacle to the rig parts. This is a physical execution correction, not an alternative stain or acid protocol.

## Should-fixes

1. **Microscopy after squashing:** a teased, pressed preparation should not be promised an intact tip outline before the actual image is selected. SAPS tells the observer to scan for small meristem cells. Replace Beat 8's second sentence with **“At low power, scan for small meristem cells; these come from just behind the root cap.”** Keep the anatomical location on the earlier intact-root diagram. Show cap labels on PM-LOW only if the selected squash genuinely retains a recognisable cap region. Update the matching objective/crop cues.
2. **Protocol provenance:** the concentrations and timings agree with the SAPS fresh-garlic recipe, but the storyboard substitutes a slotted collar for the source's cocktail-stick support, a blade/tile for scissors, and a supported bath container for the nested beaker/bijou arrangement. These are handling adaptations, not a different chemical recipe. Replace “the SAPS fresh-garlic method, no splicing” with **“Based on the SAPS fresh-garlic chemical sequence and timings; the clove support and cutting-tool arrangement are storyboard adaptations, to be checked for stable support and safe handling.”** Do not describe those particular props as the source's exact apparatus.
3. **Objectives entry:** add **“The magnifier-over-cell, slide-and-coverslip and tally pictograms are visible from the first frame of the objectives surface. The cue points introduce the text and secondary icons.”** This resolves the unspecified interval before the first visual cue without moving objectives onto the lesson diagram.
4. **Register the stain-colour variant with its owner.** Add **“Register `renderStyle: toluidine-blue-schematic` in 5.2.1's MitosisCellModel specification before reuse: shared geometry, stage states and counts unchanged; dark-blue chromatin/chromosomes on a pale background, exclusively for FieldOfViewSchematic. Retain the schematic and non-garlic-karyotype captions.”** The shared-model rule requires an owner-defined variant rather than a silent local redraw.
5. **Clear stale PDF flags.** Replace Citations UNVERIFIED items 3–5 and the matching exam-card/source tabs with **“PDF-VERIFIED in round-1 CHECK against the original papers listed below. Displayed question cards and diagram cells remain authored adaptations; Cambridge artwork is not reproduced.”** The original S21 microtubule statement is now verified. Keep image licence and Topic 1 component status open.
6. **Make E5-05's timing reproducible.** Effective 120 wpm already includes its four-second read. Specify actual speech and anchored holds rather than claiming that word count proves the 45-second talk-through. A feasible 73-second schedule at spoken 145 wpm is 60.41 s speech + 4 s reading + 8.59 s anchored holds, with at least 5.70 s of those holds inside the 95-word talk-through (on the E/F mark boxes and the single-stage evidence comparison). Check measured audio; preserve 65–75 s total and at least 45 s talk-through.
7. **Final hold accounting:** Beat 17 requires a two-second final hold, while the runtime section says no silent holds are added. State explicitly whether these two seconds are reserved within the effective 11:27 or added to it; the conservative acceptance below includes them.

## Did the plan CHECK's must-fixes reach this storyboard?

| Plan must-fix | Evidence in 5.2.2 | Status |
|---|---|---|
| MF1: shared chromosome conventions, correct separation and compartments | No count strip is displayed. Recall uses centromere division and daughter-chromosome relabelling on the separation frame. Field is explicitly simplified 2n = 4, not garlic 2n = 16. | **Reached for applicable scope**; use the repaired owner model from the 5.2.1 CHECK. |
| MF2: E5-05 penalises the guessed cell only, with correct E/F answers | Beat 13 explicitly keeps F's mark when E hedges; correction is E metaphase/F anaphase. Visible evidence is labelled beyond the mark scheme. All five moves and sustained marker present. E5-03/04 belong to 5.2.1. | **Reached** |
| MF3: nucleolar behaviour and bounded biology | Recall restores nucleoli at telophase and fades them during prophase. No stem-cell, tumour or telomere content added here. | **Reached for applicable scope** |
| MF4: complete SAPS sequence, colours, real microscopy, evidence-first interpretation | Correct chemical sequence/timings, gentle vertical press, root-cap/meristem distinction, interphase staining, static specimen, no visible-spindle requirement and uncertainty exit. Real image set remains missing; stain contact timing and dropper geometry incomplete. New one-group routing conflicts with the intended identification method. | **Partial — M1–M4** |
| MF5: cells not nuclei; arithmetic; conditional duration inference | 51/4/2/1/2, total 60, mitotic 9, index 0.15/15%, interphase 85%. Undivided telophase counted once. Values labelled schematic/calculated. Representative comparable actively cycling unsynchronised population under steady conditions; approximate inference; no invented duration calculation. | **Reached** |
| MF6: corrected incidence/marks, fixed-sample limit, syllabus practical basis | 4/15 = 1 P1 + 3 P2; 6 marks + 1 disclosed mixed mark; 0 fixed-sample P3. Counting rests directly on p54; p61 is additional support. No separate justification tariff invented. | **Reached** |

The plan check's fixes were substantially incorporated, but the real-image requirement and executable practical instructions are not complete.

## Citation audit — original sources

Cambridge archive root: `/home/dachu/sme-9700-archive/pastpapers/`; one-based PDF pages. The actual 2025–2027 syllabus PDF was also checked at pp15, 23, 51, 54 and 61, in addition to the required local Markdown.

| Claim / quotation | Original evidence | Ruling |
|---|---|---|
| Outcome 5.2.2 verbatim | Syllabus PDF p23 and local SYLLABUS-9700-DETAIL.md | Exact match. Photomicrographs, diagrams and slides are all required. |
| Temporary preparations; accurate observations including cell counts; calculations including percentages | Syllabus pp15, 54, 61 respectively | All three quotations match. The p54 skill is the direct counting basis; p61 is Paper 5 support, not a Topic 5 practical mandate. |
| Demonstrations excluded from the suggested hands-on allocation | Syllabus p51 | Confirmed; this video does not itself satisfy hands-on time. |
| E metaphase, F anaphase; R more than one stage given for either E or F | `2021/June/9700_s21_qp_22.pdf` p2; MS p7, Q1(a)(i) | Exact reject line and two marks verified. The original photomicrograph was rendered and inspected. Separate E/F marking supports the repaired local penalty. No extra justification mark. |
| Microtubules present but not visible in the image | Same QP p2, Q1(a)(ii) | Explicitly stated. Resolve the storyboard's UNVERIFIED flag. It does not imply microtubules never exist in plant cells. |
| Plant tissue with supporting evidence, 1 mixed mark | Same QP p2; MS p7, Q1(a)(iii) | Must state plant; accepted reasons include cell walls, regular shape, no cytokinetic furrow or a cell plate. Vague shape/vacuole references are ignored. Correctly kept outside the six core marks. |
| A metaphase, B anaphase, 2 marks | `2022/November/9700_w22_qp_23.pdf` p10; MS p14, Q4(a)(i) | Confirmed; original whitefish figure inspected. Identification only. |
| One pictured duplicated chromosome: stage, 1 mark | `2020/November/9700_w20_qp_21.pdf` p2; MS p6, Q1(a)(ii) | Confirmed; original diagram inspected. Prophase or metaphase accepted; the MS also accepts prometaphase, which need not be added to the syllabus-stage teaching. Do not misread the alternatives as asking for multiple guesses. |
| Stage photographs / spindle-block MCQ, key A | `2020/June/9700_s20_qp_12.pdf` p9; MS p2, Q21 | Confirmed; drug prevents sister-chromatid separation/poleward movement. One shared P1 exposure, not extra P2 credit. |
| G05 demand summary, commit-to-stage check and proposed checkpoint | Local `gate-criteria/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md`, demand row and checkpoint 1 | All three excerpts match; correctly identified as authored teaching/checking wording, not Cambridge quotations. |
| Fixed-sample Paper 3 does not establish this practical/counting demand | QP/MS pairs s20_33, s21_33, s22_33, s23_34, w24_34, original text screened for microscopy tasks and corresponding credit | Confirmed bounded conclusion: root/leaf/leaf/stem/root transverse-section tasks and associated observation/calculation; no root-tip squash or mitotic-stage count credit established. This does not support “never examined”. |
| Four papers, six marks plus one mixed | P1 S20 Q21 = 1; P2 S21 identification = 2, W22 identification = 2, W20 stage = 1; S21 plant-with-reason = 1 mixed | 1 + 2 + 2 + 1 = 6, plus the separately disclosed mixed mark. Matches amended weights. |
| SAPS preparation and staining basis | [SAPS resource 1358](https://www.saps.org.uk/teaching-resources/resources/1358/a-level-set-practicals-microscopy-of-root-tip-mitosis/), linked student and technical sheets, version 1.1 revised 2019 | Downloaded originals and extracted with catdoc. Student sheet confirms 1 M acid, 40°C, 15-minute equilibration, five-minute treatment, terminal 3 mm, one drop of 1% stain for two minutes, rinse/transfer/press and low-to-high power. Technical sheet confirms aqueous preparation, acid's intercellular softening role and deep-blue chromatin. Handling prop adaptations noted above. |

SAPS original files checked: [Student Sheet](https://s3.eu-west-1.amazonaws.com/assets.saps.org.uk/content/uploads/2022/03/SAPS-Root-Tip-Mitosis-for-A-level-set-practicals-Student-Sheet.doc) and [Technical & Teaching Notes](https://s3.eu-west-1.amazonaws.com/assets.saps.org.uk/content/uploads/2022/03/SAPS-Root-Tip-Mitosis-for-A-level-set-practicals-Technical-Teaching-Notes.doc). These establish protocol provenance; they do not automatically license the unspecified production image set.

## Handling, datasets, scope and visual ruling

The acid container stays supported, the clove is supported, and the five-minute timer is explicitly tied to contact. No acid-induced colour change, bubbling or instantaneous fixation is invented. Stain darkens towards blue without unrelated intermediate hues; actual image matching remains open. The slide is covered edge-first and pressed vertically through paper towel on a supported surface, without twisting. Microscope handling specifies low power before high power and fine focus at high power. The aspiration correction is necessary to make the rinse sequence executable.

The eight schematic row lengths sum to 60; all nine listed mitotic addresses are distinct and valid, leaving 51 interphase cells. Telophase addresses each represent one undivided cell. Arithmetic is correct and is presented as a calculation from authored teaching data, not an instrument reading. The field is not passed off as microscopy. No stage durations, statistics, additional stains or meiosis are taught. Real-image interpretation remains central, with the demonstration and counting as bounded support.

Recap uses the existing visual layout and cue-linked highlights; its deliberate stillness is appropriate. The error card is visibly marked until corrected. Authored exam examples are clearly distinguished from the originals. Lack of visible chromosomes alone is correctly rejected as evidence for interphase.

## Validation and runtime ruling

Independent command: `python3 work/007/validate_storyboard.py storyboards/topic-05/5.2.2/STORYBOARD.md` — **17 beats; 1,374 words; 178 cues; maximum gap 27 words; 0 failing beats; 11:27.0 at effective 120 wpm**. E5-05 is **146 words**, including **95 talk-through words**. The validator does not detect the one-group contradiction or impossible aspiration rule.

The literal `check_quotes.py` command fails before auditing with **FileNotFoundError** for `cloud-inputs/007/evidence/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md`. Consequently the pasted “quotes checked 15, not found 0” is not independently reproducible in this checkout. The manual source audit above verifies the substantive quotations and exam claims.

**Accept up to 11:29 for this draft**, including the explicit two-second final hold conservatively in addition to the 11:27 word ledger. Teaching is 10:14 (+24 s against 9:50); E5-05 is 1:13 (+3 s). Interpretation receives 2:55 and the demonstration 3:25, both close to the plan's intended balance. Preserve the error beat and counting caveat; no forced cuts are required. The six optional cuts total the stated 54 words, but do not produce exactly 11:00 if the final hold is additive. Recount after the required narration/cue repairs and record measured error timing. Acceptance is an explicit editorial ruling, not reliance on an assumed universal ±5% tolerance.

**Final verdict: NOT CLEARED**
