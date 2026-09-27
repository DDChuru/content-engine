NOT CLEARED

Independent round-one check of **5.1.3 — The mitotic cell cycle**, 27 September 2026. The plan check’s biological corrections mostly reached the prose and shared specifications; the event cues still permit incorrect chromosome/DNA counts. Preserve both complete EXAM CONTRAST beats. Runtime alone does not block clearance.

Reviewed STORYBOARD.md SHA-256: `0c59d40ec1a1b8833424c892aa00dd0791c871e2e867c05fdc1c79fd3e127396`; workspace HEAD `60fae0e13b349d5f66ab85a4f275fc71bc1254b4`.

Read the complete storyboard, relevant amended plan and weights, shared specifications, SUMMARY, VERIFIED-EVIDENCE, full VIDEO-STRUCTURE including REAL-WORLD SAMPLES, syllabus wording, and the original plan CHECK from `origin/cloud/007-checks`. Independently extracted the actual examination PDFs with `pdftotext -layout`, including every question/mark-scheme claim cited here. No audio or rendered lesson exists to inspect. Only this CHECK is written; no storyboard edits, commit, push or deployment.

## Must-fixes

### M1 — Make biological events and their counters change on the same frame

The correct table does not cure the delayed beat instructions. Beat 5 completes replication before its inset and whole-cell DNA counters change. Beat 7 separates the sisters but leaves the whole-cell chromosome counter at four until the later telophase narration. Beat 8 separates the cells at “giving two daughter cells”, then independently commands the graph drop “on the frame the two cells separate” at the later “Only now” cue. A builder cannot obey both timings.

Replace the count-overlay update rule and the affected parts of Beats 5, 7 and 8 with this explicit contract:

> Counts follow biological state transitions, not the later words that explain them. Change digits atomically, then pulse the correct value at its explanatory cue; do not roll through intermediate numerical counts. During S phase, replace the completed-DNA-molecule counts with “replication in progress”; chromosome counts remain four in the model cell and forty-six in the typical diploid human somatic cell. At “By the end of the S phase”, complete replication, reach two DNA units on the graph, and simultaneously show inset: one chromosome/two DNA molecules; whole model cell: four chromosomes/eight DNA molecules; human whole cell: forty-six chromosomes/ninety-two DNA molecules. The later count cues highlight these existing values.
>
> At “the centromere divides”, separate the sister units, relabel them daughter chromosomes, and simultaneously change the whole-cell counts to eight chromosomes/eight DNA molecules (human: ninety-two/ninety-two). Keep those whole-cell values through telophase. As the new nuclei form, add each-new-nucleus counts of four/four (human: forty-six/forty-six). At “eight daughter chromosomes in the whole model cell” and “four in each new nucleus”, highlight the already correct rows.
>
> At “giving two daughter cells”, complete cytokinesis, draw the per-cell DNA drop from two to one, and replace the count strip with each daughter cell: four chromosomes/four DNA molecules (human: forty-six/forty-six), all on one rendered frame. At “Only now does this per-cell graph drop”, highlight the existing drop; do not divide again or reset the graph. Later numerical cues highlight the existing daughter-cell values.

Retain progressive S-phase copying, unchanged DNA quantity at sister separation, the compartment labels, and the distinction between the whole undivided cell and each new nucleus. Propagate this event contract to the model/reuse description inside this storyboard.

### M2 — Correct the closing claim that nothing halves

Beat 14 says “One cell becomes two with nothing halved”, then the qualifiers ledger endorses that as a claim about DNA. DNA mass **per cell** does halve at cytokinesis relative to the pre-division cell, as Beat 8 correctly teaches. The hook is about retaining a full genetic set, not retaining doubled DNA mass.

Replace the final two narration sentences with:

> And the hook? Each daughter cell receives a full set of genetic information: the DNA is copied first, then shared between the two cells.

Replace action 7 with:

> At “And the hook?”, return the Beat 1 scene beneath the wheel. At “a full set of genetic information”, highlight both daughter nuclei with the tag “full genetic set in each”. At “copied first”, highlight S; at “shared between the two cells”, highlight mitosis followed by cytokinesis. Keep the per-cell graph visible, including its two-to-one drop. Exit at the end of “the two cells”; retain the anchored final hold.

Replace the qualifiers-ledger sentence with:

> Each daughter retains a full genetic set; its DNA mass is half the doubled amount in the pre-division cell.

## Should-fixes

1. **Objectives entry:** explicitly establish a pictogram before the first delayed cue. Add: “From the first frame of Beat 2, show the circular-arrow pictogram on the independent objectives surface; its text enters at ‘outline the cycle’.” Subsequent lines already enter beside pictograms. This removes a blank/title-only entry ambiguity without putting objectives on an unfamiliar lesson model.
2. **Inset versus whole-cell count:** add the persistent inset caption **“one chromosome followed; whole model cell 2n = 4”**. The model specification knows that only C1 is drawn, but a learner should not have to infer why one drawn chromosome accompanies a count of four.
3. **Per-nucleus variant:** replace its y-axis label with **“DNA mass per nucleus / arbitrary units”** and retain the hatched interval **“no intact nucleus”**, with no trace. “Per chromosome set” is a different denominator and should not be an alternative axis label. Beat 11 replays nuclear formation and then envelope disappearance: mark the latter replay **“earlier in mitosis”** so it cannot be read as the next event. Condensation should begin before the envelope has completely disappeared; the overview can show the outline fading during condensation rather than removing it before condensation begins.
4. **Evidence labels:** remove resolved UNVERIFIED/PDF-UNCHECKED labels using the audit below. Keep authored framings and composite answers labelled as authored. Their verification does not make their wording a Cambridge quotation. Change Beat 12’s end-card note to **“Lesson model answer; all its points are supported by W20/21 Q1(a)(iii), MS p6; maximum two marks.”**

## Did the plan-check must-fixes reach this storyboard?

| Plan requirement | Storyboard evidence and ruling |
|---|---|
| MF1: chromosome definition, compartments, post-separation daughter chromosomes | Model definition, Beat 7 and Dataset 2 use the corrected terminology and correct endpoint counts. **Partial:** late counter updates remain; M1 above is required. No blanket ban on saying chromosomes move to poles remains. |
| MF1: progressive S; M condense/align/separate/decondense; C cytoplasm only | Present in model contract and Beats 5–8. Separation is in M. General replication handed to 6.1.4. **Reached**, subject to event synchronization above. |
| MF2: E5-02 badge, local IGNORE, full ATP repair, possible mitosis/cytokinesis overlap | Beat 12 uses EXAM CONTRAST, the exact ignore line, the complete energy/spindle/poleward-movement answer, and explicitly says ATP is used outside mitosis. Beat 8 permits overlap. **Reached.** E5-01 also uses a truthful badge and local paper rulings. |
| MF3: bounded statements; nucleolus ownership | Typical diploid human cell, “can” divide again and typical interphase duration are qualified. Detailed nucleolus/stage behaviour is handed to 5.2.1, not banned. Other MF3 repairs concern other outcomes. |
| MF4–5: real micrographs, practical procedure and mitotic-index dataset | **Not applicable to this lesson.** Their appearance in shared specifications does not establish compliance in the unreviewed 5.2.2 storyboard. |
| MF6: corrected tariffs and fixed-sample ledger | Header/close match the amended ledger: eight distinct papers, four P1 plus four P2, fourteen overlapping marks. W20 ATP is two; S24 application is two plus two. **Reached for these cited rows.** Supplementary M24/W22/13 remain outside that total. |
| Should-fix: DNA denominator; resolved local evidence references | Per-cell graph is primary; open-mitosis interval is hatched in the per-nucleus variant. **Reached in substance**, with the axis refinement above. VERIFIED-EVIDENCE is named; fresh PDF verification below replaces inherited uncertainty. |

This is confirmation of the applicable fixes, not clearance of all eight Topic 5 storyboards or of the entire fifteen-paper screen.

## Citation audit — actual PDFs

Paths below are relative to `/home/dachu/sme-9700-archive/pastpapers/`; each pair is `9700_<session>_qp_<component>.pdf` and its `_ms_` counterpart. Pages are one-based PDF pages. These checks resolve the storyboard’s exam-wording/marking-point uncertainty; authored paraphrases stay paraphrases.

| Source; QP / MS pages | Independent finding |
|---|---|
| 2020/November, w20/21 Q1(a)(iii); 2 / 6 | Exact question: **“Suggest the role of ATP in the process of mitosis.”** Storyboard’s “Describe…” remains an explicitly authored framing, not the original command. Exact MS **“I ref. to replication or cytokinesis”** verified. Two marks, any two: energy, centriole movement, spindle formation, equatorial chromosome movement, poleward separation; condensation is an additional valid example. Completed lesson answer is supported and sufficient; it need not include every option. |
| 2023/June, s23/21 Q4(b)(ii); 13 / 14 | Asks for the named stage **of interphase** when replication occurs. One mark for S phase/synthesis phase; unqualified S ignored. E5-01’s summary is accurate. |
| 2024/March, m24/22 Q4(b); 15 / 11 | One mark requires both interphase and S phase circled. Six event labels are supplied in the paper. Lesson wheel is an authored representation, not the paper’s original arrangement. |
| 2022/November, w22/23 Q4(b); 11 / 16 | Identify and explain two events; three marks, any three listed points. Replication/identical sisters and equal segregation are valid. Optional checkpoints do not become mandatory teaching. |
| 2024/June, s24/23 Q5(c)(i–ii); 13 / 9–10 | Two plus two marks confirmed. (i) accepts palbociclib or p21Cip1 with replication/S-phase explanation. (ii) qualified RO-3306 with G2/mitochondrial increase or prior replication and blocked mitosis. Lesson’s supplied-information summary is accurate; inhibitor names need not become recall content. |
| 2021/June, s21/12 Q18; 7 / 2 | Key C: 92/46/92 chromatids in the paper’s M/G1/G2 table. Accurate as this paper’s key; it does not override the daughter-chromosome terminology after separation. |
| 2022/June, s22/12 Q19; **7** / 2 | Key D: 1.2 × 10⁻¹² g in G1 becomes 2.4 × 10⁻¹² g at both end-S and end-G2. Nuclear DNA mass; does not establish a measured per-cell mitotic trace. Lesson’s arbitrary-unit graph is correctly schematic. |
| 2023/June, s23/12 Q21; 12 / 2 | Key B: one copy of each DNA molecule at start-G1 and two at start-cytokinesis. **Start** of cytokinesis is distinct from completed division. |
| 2024/June, s24/12 Q19; 11 / 2 | Key D: W and X; after DNA replication but before maximum size, then late preparation before chromosomes condense. Broad “cell-cycle phases” description supported. |
| 2022/November, w22/13 Q19 and Q21; 9 and 11 / 2 | Supplementary keys C and A confirmed. Q19 asks for the stage of replication using photographs; Q21 selects DNA doubling and cell growth in interphase. No image from these questions is reproduced in this lesson. |
| Learner Guide, PDF p15 | Actual cached Cambridge PDF `/tmp/topic5-plan-check/9700-learner-guide-2022.pdf` re-extracted. **“Detail is not required.”** is exact outline guidance; it does not prohibit teaching a causal explanation. |
| Syllabus 2025–2027, p23; outcome 5.1.3 | Outcome quotation matches the supplied syllabus text: interphase with G1/G2 growth and S replication, mitosis, cytokinesis. |
| G05’s two quoted summaries | Explicitly attributed as G05’s authored inference, not Cambridge. Their substance is supported by the independently read PDFs. No examiner-report prevalence claim is made. |

The fourteen-mark exposure arithmetic is four MCQs plus W20 two, W22 three, S23 one and S24 four. Outcome exposures overlap; they are not fourteen exclusive Topic 5 marks. The S24 subparts are separate two-mark items, consistent with the stated one-to-three-mark item range.

## Scope, science, drawing and physical audit

All required phases are covered. The DNA trace correctly rises across S, remains doubled in G2/M, and returns to the G1 amount per daughter cell at completed cytokinesis. The correct endpoint table is 4/4 → 4/8 → whole-cell 8/8 → each new nucleus 4/4 → each daughter cell 4/4; human equivalents are 46/46 → 46/92 → 92/92 → 46/46. M1 repairs the intervening frames, where students could otherwise copy wrong counts.

No requirement to teach cyclin/CDK mechanisms, checkpoints, telomerase or meiosis is introduced. The arbitrary-unit straight S slope is explicitly schematic, not a constant measured replication rate. Cell-cycle arcs do not claim measured durations. Chromosome colours preserve identity, not parental origin. Spindle motion follows the centromere; both sister-derived units are conserved. The skin strip is an identified schematic context, with no assay, timer, reagent, stain or fabricated physical reading. Real-sample procedure requirements therefore do not trigger an invented experiment here.

## Validator and runtime ruling

Fresh `python3 work/007/validate_storyboard.py storyboards/topic-05/5.1.3/STORYBOARD.md` result: **1,063 words; 140 cues; 14 beats; zero failing beats; 8:51.5 at 120 effective wpm.** Maximum cue gap: 21 words. This checks cue substrings/gaps and word limits, not semantic event synchronization.

`check_quotes.py` cannot reproduce its pasted success result in this checkout: it raises FileNotFoundError for `cloud-inputs/007/evidence/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md`. No source files were added or changed to force it to pass. Direct PDF verification above supplies the relevant independent exam check.

**Accept the 21.5-second overrun** against 8:30; retain both error beats. E5-01: 146 words, 106-word talk-through, 73 seconds effective. E5-02: 149 words, 108-word talk-through, 74.5 seconds effective. Both include announcement, written composite, four-second silent read, explanation and in-place repair; badges persist through completed corrections. A feasible delivery at 140 spoken wpm gives talk-throughs of about 45.4 and 46.3 seconds; whole narration plus silent read occupies about 66.6 and 67.9 seconds, leaving approximately 6.4 and 6.6 seconds for anchored visual holds within their stated totals. Do not add the silent reads twice or shorten the talk-throughs. Confirm actual audio timing at build.

M2 changes narration and cues; recount after revision. No compulsory teaching cuts are needed merely to meet the original editorial budget.

## Final verdict

**NOT CLEARED** — synchronize counters and the cytokinesis graph with their biological events, and replace the false closing “nothing halved” claim. The plan’s ATP correction reached this storyboard; its count correction reached the table but not every cue.
