NOT CLEARED

Independent round-one check of **5.1.5 — Stem cells: replacing cells and repairing tissue by mitosis**, 27 September 2026. The outcome coverage, bounded stem-cell explanation, skin-question attribution and word/cue checks pass. Correct the repeated-division animation contract and the exam-close presentation before narration/build. The length is acceptable.

Reviewed STORYBOARD.md SHA-256: `97151370ea899f8902392dfc68bad9f5b07b57f5b1ebce987831808c0624a380`.

Read the complete storyboard, relevant amended Topic 5 plan and weights, SHARED-SPECS, VERIFIED-EVIDENCE, SUMMARY, validator, full local VIDEO-STRUCTURE including REAL-WORLD SAMPLES, and local syllabus detail. Compared the applicable requirements directly with `origin/cloud/007-checks:cloud-checks/007/plan/CHECK.md`. Exam checks below use actual local PDFs, freshly extracted with `pdftotext -layout`; they are not merely checks against the cloud evidence ledger. Page numbers are one-based PDF pages. No rendered lesson exists to certify. Only this CHECK.md is written for this code.

## Must-fixes

### M1 — Mark the omitted cell-cycle interval before replaying division

The lineage starts with an intact unspecialised cell, then runs only `anaphase → telophase → cytokinesis`. Daughter A immediately runs that sequence again, including in Beat 5's background and the skin variant. An anaphase excerpt is legitimate, but the present contract provides neither the preceding replication nor an explicit omitted interval. A builder following it literally must conjure eight daughter chromosomes from a newly formed four-chromosome cell. Continuous motion within the three selected states does not solve that discontinuity.

**Replace the start/repeat contract for `StemCellLineage.dividing`, and apply it to every replay in Beats 4–6, with:**

> Each division is a labelled excerpt, not a complete cell cycle. Before entering anaphase, retain the cell and show the caption “later in the cell cycle; DNA replication in S phase and earlier mitotic stages omitted”. Use an explicit time cut into the existing anaphase state; do not morph an unreplicated daughter directly into eight chromosomes. The anaphase excerpt starts with eight daughter chromosomes/eight DNA molecules in the whole 2n = 4 teaching cell, four moving towards each pole. Then animate telophase and cytokinesis continuously. Before any daughter repeats the excerpt, show the same omitted-interval caption and time cut. The shortened display time does not mean a real cell bypasses interphase.

This requires no new molecular lesson or spoken replication explanation. Keep the simplified-human-model disclaimer. The full-size Beat 3 excerpt is already identified as a recall; add the same “earlier stages omitted” caption at its entry.

**Replace every abbreviated telophase count strip, including the model contract, Beat 3 action 2 and Datasets, with:**

> Whole cell: 8 chromosomes · 8 DNA molecules. Each new nucleus: 4 chromosomes · 4 DNA molecules.

The existing values are not numerically wrong. This makes the DNA counter and compartment explicit, as plan MUST-FIX 1 and SHARED-SPECS require. Preserve the G1 parent inset at 4/4 and each separated daughter cell at 4/4.

### M2 — Separate the exam answer from the red-cell extension

Beat 8 correctly identifies W22/13 Q20's skin/Golgi demand, but its marrow callback is an additional real-world explanation within an exam beat. It has neither the spoken boundary nor the labelled panel required by VIDEO-STRUCTURE's final rule. The plan check expressly retained that requirement while exempting these examples from irrelevant assay explanations.

**Replace the Beat 8 narration from “And the hook?” through “new red blood cells.” with:**

> Beyond the mark scheme, our hook: marrow stem cells divide by mitosis; daughters differentiate into red blood cells.

**Replace Beat 8 action 4 with:**

> At *Beyond the mark scheme*, open a panel labelled **beyond the mark scheme** containing the familiar marrow lineage and small flowing blood-vessel model. Keep the exam-answer row **B: basal cells only; Golgi body** visible beside the skin diagram. At *marrow stem cells divide by mitosis*, highlight its mitosis arrow; at *daughters differentiate into red blood cells*, highlight the differentiation arrow and move a new red cell into the vessel. The panel label remains through the final frame.

Retain the final authored wording-contrast card and its explicit “not an examiner-reported error” caption. No COMMON MISTAKE badge or extra error beat is justified.

### M3 — Specify the visual at the objectives' entry

Beat 1 dissolves to the objectives surface, but Beat 2's first pictogram only enters at “say what makes a cell a stem cell”, after eight opening words. Its general no-text-only assertion is stronger than its cue instructions. Beat 3 similarly delays its cell entrance until after “First,”.

**Add to Beat 2's visual opening:**

> From the first frame of the objectives surface, all three unlabelled objective pictograms are already visible. The existing cues reveal the text and emphasise the relevant pictogram; they do not first introduce the frame's only illustration.

**Replace Beat 3's entrance instruction with:**

> The familiar animal-cell anaphase model and recall tags are visible from the beat's first frame. At *a quick recall*, begin the specified poleward motion.

## Plan-check propagation

**The relevant plan fixes substantially reached this storyboard, but propagation is not complete.** This is not a clearance of unrelated Topic 5 lessons.

| Original plan finding | Evidence in this storyboard / ruling |
|---|---|
| MUST-FIX 1: chromosome compartments, DNA conservation, S before mitosis, correct daughter-chromosome language | Beat 3 has correct 8 whole-cell / 4 per nucleus counts; daughter chromosomes and leading centromeres are correct. Whole-cell telophase is not falsely reduced to four. DNA fields are abbreviated and repeated lineage divisions lack an omitted-S interval: finish M1 above. |
| MUST-FIX 2: question-local error repairs | No registered error beat belongs here. No unsupported badge was imported. W22/13 Q20 is correctly kept distinct from an authored reject card. |
| MUST-FIX 3 and should-fix 5: stem-cell pattern, intermediates, human red-cell qualification | **Reached.** “One possible pattern” is spoken and persistently captioned; three intermediate stages are drawn; nuclear loss is tied to mature human red cells; lifespan is typical context. “Many” cells specialise and stop dividing; genetic identity is distinguished from differentiation. |
| MUST-FIX 4: real examples versus assay specimens; beyond-scheme panels | No invented test procedure is demanded for skin/marrow. Exam-close boundary remains missing: M2 above. Root-tip preparation and real photomicrographs belong to 5.2.2, not this lesson. |
| MUST-FIX 5: mitotic-index denominator and inference | Not applicable: no field counts, mitotic-index calculation or duration inference. |
| MUST-FIX 6: evidence ownership and supplementary item | **Reached for this lesson.** Zero fixed-sample demand is kept separate from supplementary W22/13 Q20, whose B answer is basal cells plus Golgi. No frequency or therapy claim is inferred. |
| Should-fix 7: plant stem versus stem cell | **Reached.** The unused S23/21 Q1(a)(i) attribution is explicitly corrected. |
| Should-fix 8: operational paths / verified evidence | **Partial.** A01/A09 verification was handed over and the real archive link exists, but stale UNVERIFIED wording remains and `check_quotes.py` still cannot run in this checkout. See audit and verification below. |

## Biology, scope and visual audit

The 5.1.5 outcome matches the local syllabus detail and actual syllabus p23: **outline the role of stem cells in cell replacement and tissue repair by mitosis**. Self-renewal, differentiation, replacement and repair are all taught, without potency hierarchies, therapy, gene-expression machinery or cancer digressions. The plant-stem handle is explicitly a picture, not an etymology or a substitute exam answer.

Mitosis produces genetically identical nuclei; cytokinesis makes the two cells in the explicit recall. Later “mitosis makes new cells” is acceptable shorthand in that established context. Nuclear-envelope reformation, nucleolar reappearance and cleavage furrowing agree with the shared animal model. No intact X is sent to a pole. The miniature's 2n = 4 disclaimer avoids teaching a human chromosome count of four.

Differentiation, upward skin-cell movement, flaking and repair have actual motion. Haemoglobin colour deepens within one red hue; this is not a fabricated reagent result. The recap deliberately reuses the established diagram and highlights it in place, which the standard permits. The final exam surface retains a model. No practical handling, reaction clock, assay concentration or measured graph is present; those checks are not applicable. Rendered readability, especially miniature chromosomes and dense final citations, remains a production check.

## Citation audit

| Claim / quotation | Direct source and result |
|---|---|
| Outcome 5.1.5; Golgi recall 1.2.1 | Actual [syllabus](/home/dachu/sme-9700-archive/syllabus/664560-2025-2027-syllabus.pdf), pp23 and 15; matches the local detailed syllabus. **Verified.** |
| “Detail is not required.” | Actual Cambridge Learner Guide PDF at `/tmp/topic5-plan-check/9700-learner-guide-2022.pdf`, p15, outline annotation. **Exact.** This is answer-command guidance, not permission to skip the causal teaching. |
| G05 stem-cell supplementary-item sentence | Exact in local G05, Revision-note coverage. Correctly attributed as the gate author's summary, not Cambridge wording. |
| W22/13 Q20, B; basal skin stem cells + Golgi | [QP p10](/home/dachu/sme-9700-archive/pastpapers/2022/November/9700_w22_qp_13.pdf#page=10) and [MS p2](/home/dachu/sme-9700-archive/pastpapers/2022/November/9700_w22_ms_13.pdf#page=2). The question concerns epidermal cell replacement and keratinocyte activity. B pairs **basal cells only** with **Golgi body**; A uses basal/centrioles, C basal plus keratinocytes/centrioles, D basal plus keratinocytes/Golgi. Key B, 1 mark. **Stem, options, demand and key now PDF-verified.** Replace pp9–11 with p10 for this item and retire its UNVERIFIED tag; no need to reproduce the whole question. |
| S22/12 Q18 not used as replacement/repair evidence | [QP p7](/home/dachu/sme-9700-archive/pastpapers/2022/June/9700_s22_qp_12.pdf#page=7). Stem/cancer cells occur in supplied telomere-maintenance context. **Negative attribution supported.** No answer key is claimed here. |
| S23/21 Q1(a)(i) not an undifferentiated stem-cell question | [QP p2](/home/dachu/sme-9700-archive/pastpapers/2023/June/9700_s23_qp_21.pdf#page=2). It asks for evidence distinguishing a cell from the plant's stem from leaf mesophyll. **Correction verified.** |
| Typical human red-cell lifespan about four months | Supported as approximate healthy-adult context by the primary research abstract [Kuruvilla et al., 2017](https://pubmed.ncbi.nlm.nih.gov/28099421/), which explicitly contrasts shorter neonatal-recipient survival with approximately 120 days in healthy adults. **Resolve the source placeholder; retain “typically/about” and “context, not a marking point”.** Do not apply a neonatal transfusion estimate to this example. |
| Final differentiation/mitosis reject card | Authored teaching contrast, correctly disclosed. It is neither a Cambridge reject line nor an examiner prevalence finding. |

All exam quotations and marking claims in this storyboard are accounted for above. No examiner-report diagnosis is asserted.

## Should-fixes

1. Replace the spine heading's misleading “There is no stem-cell marking point in the evidence.” with **“The sampled stem-cell evidence is a keyed multiple-choice item, not a detailed written-response rubric.”** The following paragraph already acknowledges that item.
2. For more precise maturation timing without naming a new intermediate cell type, replace Beat 5's final sentence with **“It enters the blood and completes its maturation into a red blood cell, which typically lasts about four months.”** Move the final mature-cell label/biconcave endpoint to the vessel. This avoids equating nuclear extrusion with immediate completion of maturation; human peripheral-blood reticulocyte maturation is directly studied by [Skadberg et al., 2003](https://pubmed.ncbi.nlm.nih.gov/14649462/). No reticulocyte terminology or extra pathway lesson is required.
3. Regenerate beat headings from the final ledger: Beat 4 currently spans 46 seconds although its 86 words imply 43 seconds, and the last heading ends at 4:28 although the declared total is 4:25.5. Use a single timing convention, including the final two-second hold.
4. Replace production-facing stale UNVERIFIED wording for Q20 and lifespan with the resolved sources above. Report the quote-check failure honestly; do not repeat the historical “3 checked / 0 not found” as a reproduced result.

## Runtime and fresh verification

Fresh `python3 work/007/validate_storyboard.py storyboards/topic-05/5.1.5/STORYBOARD.md` passes: **531 words, 74 cues, 8 beats, 0 failing beats; largest cue gap 17 words; 4:25.5 at 120 effective words/minute.** The cue test does not check biological continuity or first-frame persistence, hence M1/M3.

**Accept the 4:30 budget.** The estimate is explicitly words per minute of final video, so its two-second final hold must fit inside that effective envelope, not silently be added twice. Even if added as a separate conservative allowance, 4:27.5 remains within budget. M1/M3 add visual instructions rather than a new spoken lesson; M2's replacement is shorter than the original callback. Preserve viewing time and recalculate after edits; no error beat exists to cut. The superseded four-minute ceiling is not a reason to split this lesson.

Fresh `check_quotes.py` **fails before checking any quote** with `FileNotFoundError` for `cloud-inputs/007/evidence/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md`. Its printed storyboard success is not reproducible here. Direct PDF and local-authority checks above provide the substantive citation audit; the missing path was not patched in this read-only review.

**Final verdict: NOT CLEARED.**
