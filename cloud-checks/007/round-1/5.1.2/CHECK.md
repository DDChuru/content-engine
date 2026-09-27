# Independent check — 5.1.2 Why mitosis makes identical cells

Checked 27 September 2026 against the amended Topic 5 plan and `cloud-checks/007/plan/CHECK.md`, weights, SHARED-SPECS, SUMMARY, the full VIDEO-STRUCTURE standard including REAL-WORLD SAMPLES, and SYLLABUS-9700-DETAIL. Original syllabus and exam PDFs were independently read using `pdftotext`. Storyboard reviewed: SHA-256 `e9850b7cd2899f06023d17b73ba0b1bd5496dd3faacaa6a7677910f3d3d12bbc`.

**Ruling: NOT CLEARED.** Most applicable plan fixes reached the narrated teaching, including the count compartments, S-phase progress, daughter-chromosome terminology, differentiation and the “two events / any three points” distinction. Two drawn states still contradict that work: E5-06 leaves an optional alignment tick empty on its supposedly complete answer, and the cell-fate inset gives a mature human red blood cell a nucleus to expel. Repair M1–M2 before production. The 6:40 draft runtime is accepted; shortening is not the reason for this verdict.

## Must-fixes — exact replacement wording and actions

### M1 — A mature human red blood cell is already without a nucleus

In the published `ContextStrip` repair panel and Beat 7 action 7, a **mature** red blood cell opens with a nucleus and expels it. The narration likewise says a mature cell “loses” its nucleus. The plan's replacement text used this shorthand too; repeating it is evidence of propagation, but does not make this literal animation correct. Nuclear extrusion occurs during differentiation, before the mature red-cell state. This matters especially in a lesson intended to distinguish newly formed daughter cells from their later specialised states.

Replace the final cell-fate clause in Beat 7 with:

> The same genes don't by themselves decide what a cell becomes, and some cells specialise and stop dividing; a mature human red blood cell has no nucleus and cannot divide.

Replace the red-cell specification in `ContextStrip`, Beat 7, the absolutes sweep and its reusable-asset record with:

> At *a mature human red blood cell*, open a separate inset of an already mature human red blood cell, with no nucleus from its first frame. Caption: “mature human red blood cell: no nucleus; cannot divide”. Keep this inset separate from the skin-repair lineage; no skin cell becomes a red blood cell. Do not animate nuclear extrusion in this mature-cell inset. Development into this state belongs to the differentiating lineage in 5.1.5.

This is the smallest repair: no erythroblast/reticulocyte terminology or new pathway is required for 5.1.2. Primary human-cell research confirms the sequence: [Dynamics of human erythroblast enucleation](https://pubmed.ncbi.nlm.nih.gov/19043811/) and [Protein Distribution during Human Erythroblast Enucleation In Vitro](https://pmc.ncbi.nlm.nih.gov/articles/PMC3614867/). These are verification sources for this check, not extra required student content.

### M2 — Make E5-06's final marking display agree with its sufficient answer

The narration and footnote correctly say any three listed points, not every link. But action 7 creates three empty ticks labelled identical sisters / alignment / equal distribution. Actions 10–12 fill only the first and third and then clear the error marker, leaving alignment visibly missing. That reinstates a compulsory-checklist impression through the drawing. The final answer can in fact earn three distinct points without alignment: MS points **2, 6 and 4**. Its unqualified “DNA is replicated” should not itself be assigned MS point 1, which specifies semi-conservative replication.

Keep the 92-word talk-through and existing correction narration. Replace the affected visual instructions with:

> At *crediting points such as identical sister chromatids*, show three example labels: “identical sister chromatids”, “alignment at the equator”, “distribution to opposite poles”, under “Examples of credit — alternatives, not a compulsory checklist”. These are examples, not empty ticks. At *None of those points is in this line*, ring the missing explanation in the authored answer; retain the two empty event slots at *it names no event*.
>
> When correction begins at *DNA is replicated in the S phase of interphase*, replace the examples strip with three rows captioned “Three credited points in this answer”. Write the corrected answer in the same place as the crossed-out answer. Fill row 1, “identical sister chromatids — MS point 2”, when that clause is complete. Fill row 2, “sister chromatids move to opposite poles — MS point 6”, at the completion of *in anaphase they separate to opposite poles*. Fill row 3, “one chromatid of each chromosome reaches each daughter cell — MS point 4”, at the completion of *each daughter nucleus receives one copy of every chromosome*. Keep the daughter-cell/set-card connection visible to show the same allocation in the resulting cells. Only then clear the marker. Caption: “One sufficient answer: two events, three credited points. Other routes are accepted.” No unfilled alignment tick remains.

The point numbers are build/check annotations and may be small source notes; the student needs the biological phrases and sufficiency caption. In Beat 10, similarly present identical sisters / alignment / distribution as examples of accepted points, not as the only mandatory three. This completes the **visual** propagation of plan MF2/E5-06; the narrated correction already supplies the required route.

## Should-fixes and source housekeeping

1. **Label the comparison abstraction in each real context.** `ContextStrip` places the same four-colour set beside human skin, gut, root and strawberry cells. Add beside these cards: “Simplified chromosome-set comparison; not this organism's chromosome number”. Keep “same set” local to parent/new cells within each example; do not suggest that different species share a four-chromosome genome. Beat 4's explicit model/human distinction is good and should remain.
2. **Make replay resets explicit.** Beat 4 ends at cytokinesis, but Beat 5 later calls the retained central diagram its “anaphase cell” before dividing centromeres again. Add: “At EXAM CONTRAST entry, reset the dimmed model to a labelled ‘Replay’ metaphase starting state, with four replicated chromosomes. At correction, the S-phase replay is a separately labelled inset; the central metaphase model then runs forwards through separation and daughter-nucleus formation.” Never animate completed daughter cells reversing into one parent, or divide an already separated chromosome again.
3. **Keep nuclear comparisons at the appropriate stage.** For outer skin, the set cards compare the newly formed daughter cells before later terminal differentiation. Do not put a nucleus or a literal retained chromosome set inside a shed outermost dead skin cell. The caption can say “same information when the daughter cells form”. This reinforces the plan's newly formed-nuclei qualification.
4. **Use the actual exam demand once verified.** The original w22_23 question concerns daughter **cells**, asks candidates to **identify and explain two events**, and supplies developing whitefish as the context. A faithful authored header is: “Identify and explain two cell-cycle events that produce genetically identical daughter cells.” Keep the label “our framing”; the nuclear explanation is the mechanism, not a verbatim quotation of the question. The current nuclear paraphrase is not a scientific error, but needlessly obscures the actual demand.
5. **Remove resolved source warnings.** Replace the w22_23 stem/marking-point warnings and both MCQ-stem warnings with: “Independently checked against the QP and MS in round-1/5.1.2/CHECK.md. Question framings and summaries are our wording.” Keep the historical record that the author did not open the PDFs. Do not leave “UNVERIFIED” text on the student-facing cards after this audit has resolved it.
6. **Preserve the distinction tested by s22_12 Q17.** Its credited role is organismal growth. “Repair of cells” is a distractor; repair of tissues by replacing cells is the lesson's correct claim. Retain that precision and do not shorten the narration to “mitosis repairs cells”. No extra error beat is needed.

## Plan-check propagation audit

| Plan must-fix | What reached this storyboard, and what remains |
|---|---|
| MF1 — definitions, chromosome terminology, compartment counts, replication progress | **Reached.** Beat 3 runs schematic replication along S with the rising per-cell DNA trace, then shows completed sisters. Sister separation is in anaphase/M, not cytokinesis/C. Daughter chromosomes are named immediately when centromeres divide. Beat 4 and the dataset distinguish whole cell, pole, nucleus and daughter cell. Telophase retains eight whole-cell chromosomes, four per nucleus. |
| MF2 — seven preserved error treatments, especially E5-06 | **Reached in wording; incomplete in the drawing.** One EXAM CONTRAST is retained, with the actual two-event demand, three-mark tariff, any-three rule and explicit sufficiency note. No examiner-reported prevalence is invented. M2 fixes the lingering compulsory-checklist appearance. The other six error treatments are owned by other lessons and are not cleared here. |
| MF3 — newly formed nuclei, specialisation, repair, bounded extra content | **Substantially reached; M1 remains.** Beat 7 says some cells stop dividing, the same genes do not determine specialised function on their own, and replacement daughters differentiate where needed. It does not promise perfect restoration of every tissue. The mature-red-cell shorthand was propagated too literally into an incorrect animated state. The nucleolus reappears in the recalled telophase model, as required. Stem-cell patterns, tumour scope and telomere shortening belong elsewhere. |
| MF4 — root-tip practical, real colours, actual photomicrographs | **Not applicable to this explanatory context strip.** No assay, squash procedure, stain observation or real-image stage diagnosis is claimed. Root-tip drawings illustrate growth, and the region behind the cap is correctly identified. This check does not clear 5.2.2's practical or image assets. |
| MF5 — mitotic-index arithmetic and sampling limits | **Not applicable.** No mitotic-index dataset or stage-frequency duration claim appears. The recalled DNA graph is explicitly schematic, not measured data. |
| MF6 — source ledger and tariffs | **Reached.** Two Paper 1 items plus the three-mark Paper 2 item give three of the defined 15 papers and five overlapping marks. The EXPLAIN outcome matches the syllabus. The outstanding original-source checks are settled below. No claim is made to have independently re-surveyed all 15 papers in this two-lesson check. |

Plan should-fix SF4 also reached Beat 6: root growth includes elongation as well as mitotic cell production. The chromosome colours, model state ids, gene-band positions, per-cell graph and animal/plant division variants agree with SHARED-SPECS and the shared models they recall.

## Citation audit — original PDFs

All exam paths below are relative to `/home/dachu/sme-9700-archive/pastpapers/`. Both question papers and their matching schemes were checked; inherited PDF-VERIFIED tags were not treated as a substitute.

| Storyboard claim / quoted source | Actual source, context and finding | Ruling |
|---|---|---|
| 5.1.2 outcome, EXPLAIN and all four contexts | `/home/dachu/sme-9700-archive/syllabus/664560-2025-2027-syllabus.pdf` p.23. Header outcome and four listed contexts match exactly. | Verified, verbatim. |
| Topic 5 introduction and the short syllabus tab | Same p.23. The replication/nuclear-division/genetic-uniformity passage and “production of genetically identical daughter cells” occur as attributed. | Verified, verbatim. |
| w22_23 Q4(b) asks two events, 3 marks | `2022/November/9700_w22_qp_23.pdf` p.11: genetically identical cells in developing whitefish; identify and explain two events in the cell cycle. Three marks are printed. | Verified; stem gap resolved. Nuclear identity is the authored mechanism/paraphrase. |
| Any three points; identical sisters, alignment and allocation supported | `2022/November/9700_w22_ms_23.pdf` p.16. Ten listed points; any three. Points 2, 3, 4 and 6 respectively cover identical sisters/DNA molecules, equatorial alignment, each cell receiving a chromatid from each chromosome, and opposite-pole movement. | Verified; summary supported, not a mandatory list. Marking-point gap resolved. |
| Corrected E5-06 answer is sufficient | Same MS points 2, 6 and 4: identical sisters; their movement to opposite poles; receipt of one copy of every chromosome by the daughter nuclei/cells. Point 1 separately names semi-conservative replication. Points 5 and 7–10 offer additional centromere/spindle/checkpoint/error-prevention routes. | Sufficient route supported. Do not demand all ten points, add a checkpoint lesson, or award point 1 for bare “replication”. M2 fixes the visual tally. |
| Chromosomes/daughter chromosomes going to poles accepted | Same MS p.16, point 6 includes that allowance. | Verified; no prohibited-word rule. |
| The composite answer merely states the result | QP already supplies genetic identity; the composite names no credited event or causal explanation. G05's check makes that same inference. | Supported assessment inference; EXAM CONTRAST is truthful. No exact R line or ER frequency is claimed. |
| s22_12 Q17, purpose of mitosis, A | `2022/June/9700_s22_qp_12.pdf` p.7 and `9700_s22_ms_12.pdf` p.2. A is growth of organisms; the alternatives include genetic difference, repair of individual cells and replacement of cancerous tissue. | Stem/key verified; 1 mark. Tissue repair must remain distinguished from repairing a cell. |
| s20_12 Q20, growth/repair roles, C | `2020/June/9700_s20_qp_12.pdf` p.8 and `9700_s20_ms_12.pdf` p.2. The Venn contexts are clonal selection of T-lymphocytes, new root-tip cells and replacement of skin cells damaged by injury. Key C is confirmed. | Stem/key verified; 1 mark. The item says clonal selection, not clonal expansion. This lesson correctly does not teach or silently rename that unused context. |
| G05 credit summary and check sentence | Current local `GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md`, w22_23 Q4(b) row. Both quoted passages match the authored summary/check. | Verified as local commentary; not Cambridge wording or a candidate transcript. |

There is no unresolved Cambridge quotation or PDF-UNCHECKED exam demand in this lesson after this audit. “Our framing”, “our composite” and the authored closing reject card remain authorship labels, not source gaps. There is no need to import the other lessons' examiner-report or reject evidence to manufacture a COMMON MISTAKE badge.

## Biology and drawing checks

Independent arithmetic agrees with the storyboard:

| Stage | Whole model cell: chromosomes / DNA molecules | Each pole, nucleus or daughter cell |
|---|---|---|
| G1 | 4 / 4 | One parent nucleus: 4 / 4 |
| After S, G2 and metaphase | 4 / 8 | Two sister chromatids per chromosome |
| Anaphase, after centromeres divide | 8 / 8 | One pole: 4 / 4 |
| Telophase before completed cytokinesis | 8 / 8 | One new nucleus: 4 / 4 |
| Completed cytokinesis | Two separate cells | One daughter cell: 4 / 4 |

The typical human reference is 46 chromosomes per daughter nucleus; after S the whole parent has 92 DNA molecules, and each daughter receives 46. The drawings conserve C1–C4 identities and the two copies of each. They do not send intact X-shaped replicated chromosomes to each pole. Condensed daughter set cards are explicitly comparison drawings, not a claim that telophase chromosomes remain condensed. Nuclear envelopes reform and chromosomes decondense; the membrane furrow divides the cytoplasm separately. A plant miniature uses a cell plate, not an animal furrow. Spindle movement is recalled at syllabus depth, without adding kinetochore machinery.

The DNA trace rises during S and is labelled arbitrary units, per cell, schematic and not constant-rate evidence. It is not a calculated value presented as an instrument reading. The caveat about copying errors is said once; no mutation, meiosis, checkpoint mechanism or cloning-technology lecture is introduced. Tissue growth, routine replacement, injury repair and asexual reproduction each get a connected drawn example rather than just a list. M1 and the comparison-card qualifiers keep that genetic-identity teaching tied to the stage where it is valid.

There are no real assay specimens, physical transfers, stain colour changes or contact timers in these explanatory demonstrations. The named tissues/plants are explanatory examples, so REAL-WORLD SAMPLES does not require an invented laboratory method. Drawn roots, skin, gut and runners are labelled schematic; no generated image pretends to be a real specimen. Real photomicrographs remain mandatory for their separate 5.2.2 outcome.

## Five-move, cue and build audit

E5-06 has all five moves: announce; written composite answer; four-second silent read; full cue-synchronised explanation of where the failure lies, why it is tempting and why no event is credited; correction in place. The composite is never spoken as a false biological assertion. The badge is EXAM CONTRAST throughout. The marker remains until the final corrected clause; M2 must make that completed frame consistent with the claimed result.

Literal validator rerun: **800 words, 99 cues, ten beats, zero failing beats**. Beat word counts: **81, 41, 86, 99, 149, 66, 100, 53, 64, 61**. Maximum gap **15 words**. Independent extraction confirms E5-06's narration segments: **26 announce/show + 92 talk-through + 31 correction = 149 words**. Manually inspected cue lists for Beats 3, 4, 5, 7 and 10 have **11, 14, 17, 14 and 8** ordered, exact cues. These checks verify text matching, not the correctness of the mature-cell state or completed checklist.

The separate `check_quotes.py` run fails before checking quotes because its expected `cloud-inputs/007/evidence/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md` is missing in this checkout. SUMMARY's claimed 12 checked/0 missing is therefore not independently reproducible here. Equivalent current local source text and original PDFs were checked directly, resolving the substantive source questions without creating input files.

Objective pictograms prevent a text-only frame. Mechanisms have actual motion; the recap deliberately reuses the completed diagram with highlights, as the standard requires. Error and exam cards retain the biological model beside them. Long source-status strings can now be shortened to readable citations after the PDF gaps are resolved. No audio or rendered frames exist yet, so actual legibility, colour consistency and cue timings remain production checks.

## Independent runtime ruling

**Accept the draft's 6:40**, ten seconds over the amended 6:30 budget. Teaching is **651 words = 5:25.5**, 5.5 seconds above allowance. E5-06 is **149 words = 74.5 seconds** at the agreed effective 120 words/minute, with a **92-word talk-through allocated about 46 seconds**. The silence is included in effective runtime; do not add four seconds to the same estimate twice.

A word count is not measured timing. A feasible 74.5-second envelope is approximately **10.8 seconds announce/show + 4 seconds silent read + 46 seconds talk-through + 13.7 seconds correction**. This keeps the explanation intact and needs no unusually fast speech relative to the standard's nominal spoken pace. Verify the whole recorded/rendered beat remains 65–75 seconds with the full read and approximately 45-second talk-through; never accelerate the recording merely to force the estimate. If recording needs more room, remove duplicated introductory framing rather than thinning the causal explanation.

M1 adds two spoken words: the revised teaching total would be **653**, total **802 words**, approximately **6:41** before any other narrated edits. M2 is visual and leaves the protected error narration unchanged. Accept that remaining overrun. The optional cuts are not required: the strawberry hook gives the fourth context early, and the recall introduction connects the two prerequisites. If either is taken, remap its cues and revise the per-beat ledger; do not claim extra time saved from an already removed sentence. Preserve the final two-second hold within the effective-time allocation or record its actual contribution once audio exists.

Return check should focus on the repaired mature-cell inset, the completed E5-06 display and any affected cues, not a new arbitrary runtime cap. No storyboard was edited during this check.

**NOT CLEARED**
