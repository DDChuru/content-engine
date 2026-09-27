# Topic 5 plan check — NOT CLEARED

Checked independently on 27 September 2026. **All eight syllabus outcome quotations match the actual syllabus PDF. All seven proposed error beats have genuine assessment sources. The 58:30 / 96-beat arithmetic passes.** Clearance nevertheless requires corrections to chromosome wording and model states, the telomere explanation, practical/photomicrograph teaching, question-specific corrections and the incomplete evidence weights. These are teaching defects, not reasons to shorten the error beats.

This check follows the evidence-and-exact-replacement method of the cleared round-two Topic 3 check. Only this CHECK.md was added to the requested project. The plan, weights and shared specifications were not edited; no git, deployment or publishing action was performed.

## Sources and audit method

Reviewed:

- `plan/topic-05/TOPIC-PLAN-05-CELL-CYCLE.md` (**P** below), `TOPIC-05-WEIGHTS.md` (**W**) and `work/007/SHARED-SPECS.md` (**S**).
- The local project’s `SYLLABUS-9700-DETAIL.md`, `VIDEO-STRUCTURE.md` including its final REAL-WORLD SAMPLES rule, Topic 5 gate criteria (**G05**), complexity calibration §5, EXAMINER-INSIGHT and `TOPIC-03-PLAN-CHECK.md`.
- Actual local QP/MS PDFs under `/home/dachu/sme-9700-archive/pastpapers/`, extracted afresh using `pdftotext -layout`. Every cited exam source was checked with its paired question. Additional checks covered the five uncoded Paper 1 pairs, s24_23 and the five fixed-sample Paper 3 pairs. Relevant question diagrams/photomicrographs were also rendered and inspected, including s23_21 p14, s21_22 p2, w22_23 p10, w22_13 p9 and the diagram-dependent additional MCQs.
- The actual [2025–2027 syllabus PDF](/home/dachu/sme-9700-archive/syllabus/664560-2025-2027-syllabus.pdf), particularly pp13, 15, 23–24, 50–51, 54 and 61.
- The Cambridge Learner Guide was absent from the local archive paths. Its actual PDF was downloaded from the [public mirror already recorded in EXAMINER-INSIGHT](https://5steps.academy/wp-content/uploads/2021/08/9700_Learner_Guide_for_examination_from_2022.pdf); `pdftotext` confirms the quotation on PDF p15. This is a Cambridge publication hosted by a third party, not a search-snippet verification.
- For the otherwise uncited practical recipe, the [SAPS tested root-tip resource](https://www.saps.org.uk/teaching-resources/resources/1358/a-level-set-practicals-microscopy-of-root-tip-mitosis/) and its downloadable student/technical documents were read directly; the [Practical Biology protocol](https://practicalbiology.org/cells-to-systems/cell-division/investigating-mitosis-in-a-root-tip-squash.html) was checked as a separate recipe. These validate practical choices, not Cambridge marking points.

All page numbers in this check are **one-based PDF pages**. P/W line numbers refer to the versions whose hashes appear at the end. “Verified summary” below means G05’s paraphrase is supported by the PDF; it does **not** turn G05’s prose into a Cambridge quotation. No examiner-report prevalence was inferred from a positive marking point.

## Scope, coverage and grouping

| Outcome | Ruling |
|---|---|
| 5.1.1 | All five named structures present. Correct the opening definition so that it describes both unreplicated and replicated chromosomes. The numerical convention itself is sound. |
| 5.1.2 | All four contexts present, with useful examples. Remove the claim that every cell needs its genome in order to keep dividing; it contradicts the planned mature-red-cell example. |
| 5.1.3 | G1, S, G2, mitosis and cytokinesis present; replication correctly assigned to S. Align the wheel’s chromosome state with anaphase and label DNA-content denominators precisely. |
| 5.1.4 | Protective repeated non-coding DNA is present. Bound shortening to the intended somatic-cell model and avoid portraying one exact six-base repeat being physically chopped off every division. |
| 5.1.5 | Self-renewal, mitosis and differentiation are appropriately bounded. Bone marrow and skin are suitable examples. The supplementary skin question provides a usable exam close once correctly identified. |
| 5.1.6 | Mutation → loss of control → repeated division → tumour is correct at the required depth. Benign/malignant distinction is acceptable bounded context. No need for a regulatory-protein or treatment catalogue. |
| 5.2.1 | Four stages, spindle, envelope, membrane and both cell types are present. Correct the chromosome language, add the bounded nucleolus change evidenced in the fixed sample, and keep the exact anaphase drawing task distinct from a whole-cell model. |
| 5.2.2 | Stage recognition, microscope handling and a preparation are planned. Real photomicrograph interpretation must be mandatory, not an alternative to a schematic. Repair the decision sequence and practical specification. The short counting example may remain. |

The syllabus’s “limited to” list is correctly restricted to 5.1.1; “including” in 5.1.3 is correctly treated as required coverage. There is no need to add meiosis, cyclin/CDK pathways, telomerase biochemistry, stem-cell potency hierarchies or therapeutic ethics. A supplied inhibitor context in s24_23 tests existing cell-cycle knowledge; it does not make inhibitor names required recall.

**Eight standalone lessons and the proposed build order are defensible.** The 12-minute stage lesson need not be split mid-sequence. The practical lesson can run 11 minutes if laboratory waits are explicitly compressed and the real-image interpretation receives enough time. Do not replace these judgments with the superseded four-minute cap.

## MUST-FIX 1 — remove false chromosome rules and reconcile the shared model

**Locations:** P23–25, P41, P181, P195, P249–253, P284–291; S§4 and the `ChromosomeModel`/`CellCycleWheel` specifications.

The numerical core is correct: 2n = 4 gives 4 chromosomes/4 DNA molecules in G1; 4/8 after S through metaphase; 8/8 in the whole cell after sister separation; 4/4 in each daughter nucleus. Human equivalents are 46/46, 46/92, 92/92 and 46/46. **The whole undivided cell still contains 8 chromosomes in telophase** (92 in the human example); the return to four is per daughter nucleus, not an immediate whole-cell count reversal after anaphase.

However, “never ‘the chromosomes separate’ … that phrase describes homologous chromosomes in meiosis” is false. W20 MS p6 accepts daughter chromosomes; W22 MS p16 explicitly accepts chromosomes/daughter chromosomes going to the poles; S21 MS p7 does too. Do not make a local terminology exercise a biological or marking ban.

**Replace the blanket ban and its trap-table/shared-spec repeats with:**

> At anaphase, the centromeres divide and sister chromatids separate to opposite poles. Once separated, each is a daughter chromosome. Use “sister chromatids separate” when explaining the transition; “daughter chromosomes move to opposite poles” is also correct. The error is sending an intact two-chromatid chromosome to a pole, not using the word chromosome after separation. Do not introduce a meiosis comparison here.

**Replace P41’s opening sentence with:**

> Before DNA replication, a chromosome contains one long DNA molecule associated with histone proteins. After replication, it contains two sister chromatids, each with its own DNA molecule associated with histones.

**Add to the count convention and shared table:**

> Counts must state their compartment: whole cell, one pole, one nucleus or one daughter cell. In telophase before cytokinesis is complete, the model has eight chromosomes in the whole cell but four in each new nucleus. Use the DNA-molecule counter throughout; after sister separation, relabel the separated units as daughter chromosomes rather than implying their DNA has disappeared. A typical diploid human somatic cell is the human reference, not every human cell.

**Replace the wheel-state sentence in S§5 with:**

> G1 shows an unreplicated extended chromosome; S shows replication progressing; G2 shows the replicated extended state. Within M, the inset condenses, aligns, separates at anaphase and decondenses at telophase. C shows division of the cytoplasm around the two already formed chromosome sets. Separation must not first occur in the C arc.

A one-frame endpoint replacement is acceptable as schematic bookkeeping, but it is not a reason to depict the entire S phase as an instantaneous event. **Replace the replication animation instruction in P19/P249 and S§4–5 with:**

> Keep replication schematic, without bases or nucleotide chemistry. Animate progress across S in synchrony with the rising DNA-content trace, then change to the completed two-sister state. Caption this as a schematic account of replication during S; detailed replication is taught in 6.1.4. The final state change marks completion, not instantaneous duplication of the entire genome.

This preserves the content boundary and avoids inventing a molecular mechanism. No atom-level bond animation is requested.

## MUST-FIX 2 — correct error repairs to the actual question and rubric

**Keep all seven beats and their 70-second allowances.** Corrections are to badge/evidence wording and the completed answer, not to the pedagogical format.

### E5-02: an IGNORE line is not the supplied standard’s reject-line criterion

W20 Q1(a)(iii), QP p2/MS p6, genuinely says **“I ref. to replication or cytokinesis”**, and is worth **2 marks**. The supplied VIDEO-STRUCTURE badge rule names an examiner report or a **reject** line. G05 expressly distinguishes IGNORE from false statements/rejection. The plan silently expands that to reject/**ignore**.

**Replace E5-02’s badge everywhere with `EXAM CONTRAST`. Replace its repair specification with:**

> The question asks for ATP’s role in mitosis. The scheme ignores references to replication and cytokinesis in this answer; it does not claim ATP is unused in those processes. Correct the response to: “ATP supplies energy for spindle formation and for movement of daughter chromosomes to opposite poles.” Show the named mitotic events on the model. Basis: W20/21 Q1(a)(iii), QP p2, MS p6; 2 marks, any two credited points. This is an EXAM CONTRAST based on a local ignore instruction, not a claim about how often candidates make the error.

Remove the fallback that merely strikes the out-of-scope items and states a scope rule: it does not answer the ATP question. Also avoid making “cytokinesis follows mitosis” an absolute claim that the processes can never overlap; their definitions are distinct even when cytokinesis begins during late mitosis.

### E5-03: the two-wording repair is sound, but is not a complete three-mark answer

W22 Q4(a)(iii) is **3 marks, any three**; the question asks what happens in whitefish cell C until two cells form. The repaired envelope-plus-furrow sentence alone is not a complete three-point response.

**Use this completed answer after both faults are corrected:**

> Nuclear envelopes form around the two groups of chromosomes; the chromosomes decondense; the cell surface membrane pinches in as the cytoplasm divides to form two cells.

Preserve the marker until both original faults are fixed. Say that the envelope terminology ruling is local to this scheme; the S23 organelle-table counter-ruling is real. Do not suggest that every listed MS alternative is required.

### E5-04: conserve the chromosomes and show the specified chromosome

P195 claims that whole X-shaped chromosomes at a pole necessarily leave the other pole short. If whole Xs are drawn at **both** poles, the drawing instead invents extra replicated DNA. Explain the actual drawn error rather than choosing an unsupported consequence.

**Replace E5-04’s repair paragraph with:**

> Count the original replicated chromosomes and conserve that set. Each original X contributes one sister chromatid to each pole; no intact X is delivered to a pole and no additional X is created. Track one chromosome through separation, with the centromere leading each daughter chromosome. For S23/21 Q4(c)(ii), the specified object is chromosome 11: the answer shows its two separated chromatids, one toward each pole, with centromeres and spindle attachments. Our 2n = 4 whole-cell model is a labelled teaching extension, not the paper’s requested drawing.

QP p14 and MS p15 confirm **3 marks from four listed drawing features**. The MS permits U- or V-shaped units; do not make every real chromosome obligatorily V-shaped. P181 should say **“in this schematic, the arms trail behind the leading centromere”**.

### E5-05 / E5-06 / E5-07: preserve question-local demands

For E5-05, replace “earns nothing” with:

> Giving more than one stage for a labelled cell loses that cell’s identification mark; it does not automatically cancel a correct identification of the other cell. In S21/22, E is metaphase and F is anaphase.

For E5-06, add:

> W22/23 Q4(b) asks for two events and is marked out of three, using any three listed points. Our replication-and-segregation explanation is a sufficient route through this question, not a claim that Cambridge requires every link in our teaching chain. Keep the identical-sister and equal-distribution explanations explicit.

For E5-07, replace “the mark needs the loss of control and its cause” with:

> In this question the mutation context is supplied. Explain its consequences: loss of cell-cycle control allows repeated uncontrolled division, producing a mass of abnormal cells. The rubric awards any two credited points; it does not require an extra named gene, checkpoint protein or mutation mechanism.

## MUST-FIX 3 — repair the remaining biological overclaims and scope omissions

### 5.1.2: not every cell keeps dividing or retains a nucleus

**P68, replace “every cell of a multicellular organism needs the complete set of genetic information to function and to keep dividing” with:**

> Mitosis supplies newly formed daughter nuclei with the same genetic information, so new cells can support growth, replacement and repair. Some cells later specialise and stop dividing; mature human red blood cells even lose their nuclei. Genetic identity does not itself specify a cell’s specialised function.

**Replace the healing-cut clause with:**

> Mitosis supplies replacement cells during tissue repair; where needed, daughter cells differentiate into the appropriate specialised types.

This agrees with 5.1.5 rather than implying that mitosis alone produces the required differentiated identity or restores every tissue perfectly.

### 5.1.4: shorten a bounded model, not every DNA molecule universally

P115 begins with “Each time … the very end of each DNA molecule …”, despite P119’s later typicality qualification. S’s eight blocks, one labelled TTAGGG, each losing exactly one block per round can teach a fixed six-base loss and literal excision. The familiar lagging-strand topic does not establish that 6.1.4 requires the entire end-replication mechanism.

**Replace the opening mechanism and propagate it to the recap/reject card:**

> In typical dividing somatic cells, chromosome ends can shorten over successive rounds of DNA replication. Telomeres contain repeated non-coding DNA, so shortening initially removes telomeric sequence rather than genes near the ends. This protects genes during repeated replication; it does not mean telomeres prevent all DNA loss or all DNA damage. Some cells maintain their telomeres. No telomerase mechanism is required here.

**Replace the handoff with:**

> The general replication process is taught in 6.1.4; the detailed problem of copying chromosome ends is outside this lesson’s required mechanism.

**Replace the block-loss specification with:**

> The grey blocks are arbitrary schematic lengths, not individual TTAGGG repeats or a measured loss per division. Show a shorter daughter-molecule endpoint over successive rounds; do not depict a detached block being cut off an intact chromosome. Caption “schematic shortening; amount not to scale”. The optional human sequence label identifies the repeat without quantifying the amount lost.

S22/12 Q18 explicitly supplies maintained telomere length in stem/cancer cells; S21/12 Q19 tests shorter telomeres after more divisions. Neither requires a telomerase pathway. The existing no-ageing/no-Hayflick/no-telomerase-biochemistry boundary can remain; do not call supplied-context exceptions forbidden syllabus content.

### 5.2.1: the nucleolus must not be deliberately excluded

P188 says it is not taught; S says it is not drawn. S22/12 Q20, QP p8/MS p2, key B, explicitly tests disappearance in prophase. W22/23 MS p15 also credits reappearance during completion of division. This is a small established organelle change, not an invitation to add a new molecular pathway.

**Replace those exclusions with:**

> Recall the nucleolus from Topic 1: it disappears during prophase and reappears in each new nucleus during telophase. Show this on the existing nuclear model, without re-teaching ribosome production or adding sub-stages of mitosis.

Stem-cell self-renewal and possible daughter differentiation otherwise pass. Prefer **“one possible pattern”** to “a typical division” for the one-stays/one-differentiates cartoon; preserve “can”. Cancer wording also broadly passes. In 5.1.6, qualify the opening as **“In a healthy adult tissue that is maintaining its size…”**; developing tissues need net growth. A clear malignant/benign distinction need not become a metastasis lesson.

## MUST-FIX 4 — make root-tip preparation and image interpretation credible

### Select one complete recipe; do not equate killing with fixation

P209/P254 and S§6 omit stain concentration and tissue teasing, and assert that hot HCl “fix[es] each at the stage it had reached”. HCl’s useful teaching role here is tissue softening/separation and stain access. Killing tissue is not a sufficient account of cytological fixation or instant preservation at first acid contact. The 60 °C / five-minute conditions themselves are not physically impossible: Practical Biology uses them, but within a separately specified preparation that includes fixation. SAPS supplies a simpler fresh-root method. Do not splice the two while implying the resulting recipe has been validated.

**Use this exact replacement practical specification in both P and S:**

> Use the SAPS fresh-garlic method: pre-equilibrate 1 mol dm⁻³ HCl at 40 °C for 15 minutes. Support the clove so its roots enter the acid; start the five-minute treatment timer at contact. Remove and rinse the roots. Cut the terminal 3 mm onto a watch glass; stain for two minutes with one drop of 1% aqueous toluidine blue. Remove excess stain and rinse. Transfer gently with a paintbrush to a clean slide, add water and tease apart with a mounted needle. Lower the coverslip; wrap the slide in paper towel and press gently vertically on a flat supported surface, without sliding or twisting. Locate the meristem at low power, then inspect chromosomes at high power. Eye protection, careful handling of acid and sharp tools, and gentle pressure to avoid broken glass remain visible precautions.

**Replace the acid explanation with:**

> Acid treatment softens the material between neighbouring cells, helping stain penetration and allowing the cells to spread into a thin layer. These are prepared specimens; do not animate living mitosis continuing under the coverslip or describe acid contact as instantaneous fixation.

The replacement follows the [SAPS resource and its student/technical sheets](https://www.saps.org.uk/teaching-resources/resources/1358/a-level-set-practicals-microscopy-of-root-tip-mitosis/). No new laboratory procedure is being invented by this check. Update the rig geometry, temperature label, stain bottle, transfer tool and timing cues together. The original vertical squash, low-power-first sequence and first-contact treatment timer are good and should remain.

### REAL-WORLD SAMPLES: mostly present; correct the missing limitations

Garlic meristem, condensed nuclear material, active division and the need for a thin preparation are already explained. **Retain those explanations.** Add:

> Toluidine blue reveals chromatin in interphase nuclei as well as condensed mitotic chromosomes; staining alone does not identify a dividing cell. We identify stages from the arrangement of visible chromosomes and nuclei. The small sampled tip includes a root cap: select the meristem behind it, rather than assuming every cell in the terminal piece is dividing.

SAPS supports deep-blue stained chromatin. Blue/purple variation is plausible, but “pale-blue cytoplasm” and one hue for every structure should not be presented as guaranteed reagent outcomes. **Use:**

> Show dark-blue chromatin with a paler background, checked against the selected toluidine-blue preparation. Colours and contrast vary with preparation; identify stages by structure, not hue. Do not use a differently stained reference as the colour standard for this preparation.

No extra real-sample test explanation is needed for skin, marrow, strawberry runners or the UV example: they are explanatory contexts, not assay specimens. In exam beats, preserve S§7’s rule that any beyond-scheme explanation is both spoken and visibly labelled as such.

### Photomicrographs are required; absence of resolved chromosomes is not a universal diagnostic

P21’s “either … schematic … or … licensed real micrograph” is not enough for an outcome that explicitly includes photomicrographs. P207’s first branch also labels any image without distinct chromosomes interphase, including poor images and potentially late telophase.

**Replace the asset/interpretation instruction with:**

> Teach with diagrams and at least one sourced, licensed real photomicrograph set showing the relevant stage features, plus the slide-preparation/viewing demonstration. A schematic supports interpretation but cannot replace photomicrograph coverage. Record source, licence, organism and stain before the storyboard is cleared for production. Examine cell boundaries and the number and positions of nuclei/chromosome groups first. A clearly resolved single nucleus with diffuse chromatin supports interphase; two reforming nuclei within one dividing cell support telophase/cytokinesis. Use chromosome arrangement to distinguish prophase, metaphase and anaphase, allowing for viewing angle. If resolution or overlap prevents a justified identification, say so; lack of visible detail alone does not prove interphase.

Do not demand a spindle or a resolved nuclear-envelope double line in every light micrograph. S21’s question explicitly says its microtubules are not visible. A metaphase plate seen from another orientation may not look like the model’s straight line.

**Add to the field specification:**

> The 2n = 4 teaching cell is a simplified model, not a literal garlic karyotype. Keep the 60-cell counting field explicitly schematic and label its chromosome drawings as simplified. Do not call four drawn chromosomes the actual 2n = 16 garlic complement.

## MUST-FIX 5 — preserve the valid mitotic-index calculation but bound its inference

The shared dataset sums correctly: **51 + 4 + 2 + 1 + 2 = 60**; mitotic cells **4 + 2 + 1 + 2 = 9**; **9/60 = 0.15 = 15%**. Interphase is **51/60 = 85%**. Do not use only the nine mitotic cells as the denominator for mitotic index. Count cells, not the number of daughter chromosome groups or nuclei; a still-undivided telophase cell counts once.

Asynchrony alone does not establish exact equality of stage fraction and stage duration; the population may contain non-cycling cells, differing cycle lengths, sampling bias or division/death effects. The invented field also cannot measure a real root’s mitotic index or cycle timings.

**Replace the interpretation in P211/P297 and S§6 with:**

> These are counts from our schematic field. Fifteen per cent of its cells are shown in mitosis. In a representative population of comparable, actively cycling, unsynchronised cells under steady conditions, a more frequent stage can suggest a longer duration; this is an approximate inference, not an exact timing law. Real tissue may contain non-dividing cells and unevenly sampled regions. We do not calculate stage duration from this invented field.

The roughly 1:15 counting segment is a reasonable application of the practical counting/percentage requirements. It is not explicitly named as a separate Topic 5 outcome or established here as a compulsory standalone calculation lesson. Keep it bounded; no extra gate or statistical-test lesson is justified. Syllabus p61’s quoted sentence is in Paper 5 data handling, so cite p54 as the direct microscope/counting basis and p61 as additional support, not as a Topic 5-specific mandate.

## MUST-FIX 6 — update the evidence ledger before treating the weights as settled

The existing arithmetic faithfully reproduces its partial rows, but “verified tariffs” actually means **tariffs transcribed from G05**, not verified against PDFs. The four-paper denominator is honestly disclosed; it is still an incomplete evidence basis. Even the four supposedly coded papers omit obvious Topic 5 demands.

**For the rows already printed in W70–82, apply these exact replacements:**

| Row | Replacement / allocation |
|---|---|
| W20 Q1(a)(iii) | **2 marks**, ATP roles in mitosis; QP p2/MS p6. Preserve 5.1.3 ownership of the scope contrast; it also provides spindle/movement evidence for 5.2.1. |
| S21 Q1(a)(ii) | **1 mark**, state a function of microtubules in mitosis; QP p2/MS p7. |
| S21 Q1(b) | The whole cloze is **4 marks**, but **only D, 1 mark**, is telomeres. A–C belong to nucleic-acid replication chemistry/enzymes. Count one, not four, to 5.1.4; QP p3/MS p8. |
| W22 Q4(a)(iii) | **3 marks**, any three credited completion events, animal cell; QP p11/MS p15. |
| S23 Q4(c)(i) | **2 marks total**, name **and function** of A centromere and B spindle fibres. Allocate A’s one mark to 5.1.1 and B’s one to 5.2.1; disclose the MS partial-credit fallback rather than describing a pure one-label task. QP p14/MS p15. |

Keeping all other original-row ownership unchanged, and applying only the A/B split above, the reconciliation becomes:

| Outcome | Papers among the original four | Marks in the originally printed rows after repair | Block range |
|---|---:|---:|---|
| 5.1.1 | 1 | 1 | 1 |
| 5.1.2 | 1 | 3 | 3 |
| 5.1.3 | 3 | 6 | 1–3 |
| 5.1.4 | 1 | 1 | 1 |
| 5.1.5 | 0 | 0 | — |
| 5.1.6 | 1 | 2 | 2 |
| 5.2.1 | 3 | 11 | 1–3 |
| 5.2.2 | 2 | 4 | 2 |

**This is a reconciliation of the existing ledger, not the final full-sample total.** The following directly checked additions must be incorporated, with explicit overlapping ownership, before recomputing a full 15-pair summary. MCQs remain indivisible one-mark exposures; a distractor alone does not create extra marks.

| Additional fixed-sample evidence | Actual source / demand | Consequence |
|---|---|---|
| W20/21 Q1(a)(i–ii) | QP p2/MS p6: chromosome cloze **3**; stage of pictured duplicated chromosome **1** (prophase/metaphase alternatives). | Adds 5.1.1 evidence and 5.2.2 stage-recognition evidence in a paper already called coded. |
| S21/22 Q1(a)(iii) | QP p2/MS p7: plant tissue with a reason, **1**; alternatives include cell walls/regular shape or cell plate/no cleavage furrow. | Record as mixed Topic 1/5 image evidence; do not assert that all credit routes require mitotic-stage knowledge. |
| S20/12 Q19, Q20, Q21 | QP pp8–9/MS p2, keys **D, C, A**. Structure; growth/repair roles; spindle-block effect with stage photographs. | Relevant respectively to 5.1.1, 5.1.2, and 5.2.1/5.2.2. Q20’s clonal-*selection* wording must not be silently changed to clonal expansion. |
| S21/12 Q17, Q18, Q19 | QP p7/MS p2, keys **C, C, A**. Relative abundance of chromosome parts; 92/46/92 chromatid counts; telomere shortening. | 5.1.1, 5.1.3 and 5.1.4 have direct MCQ evidence. |
| S22/12 Q17–20 | QP pp7–8/MS p2, keys **A, A, D, B**. Mitosis purpose; telomere function/shortening; DNA mass through S/G2; prophase events. | Relevant to 5.1.2, 5.1.4, 5.1.3 and 5.2.1. Q20 exposes the nucleolus omission. Q18’s stem/cancer contexts do not themselves assess the replacement/repair role of stem cells. |
| S23/12 Q20–21 | QP p12/MS p2, keys **D, B**. Histone/DNA organisation; one copy in G1 versus two at the start of cytokinesis. | 5.1.1 and 5.1.3 evidence; the latter supports distinguishing nuclear division from completed cytoplasmic division. |
| S24/12 Q19–20 | QP pp11–12/MS p2, keys **D, D**. Cell-cycle phases; spindle-length graph. | 5.1.3 and 5.2.1 evidence. A graph can test spindle behaviour without becoming a new graph-theory lesson. |
| S24/23 Q5(c)(i–ii), Q5(d) | QP p13; MS pp9–10: **2 + 2 + 2**. Apply supplied inhibitor information to S/G2/chromatid state, then explain stopping uncontrolled division. | At least 5.1.3 and 5.1.6 need this fifth Paper 2 included. Q5(a–b) remain signalling/inhibition, not automatic Topic 5 marks. Do not teach the inhibitor names as a list. |

The five fixed-sample Paper 3 QP/MS pairs were screened: their microscopy tasks use transverse root/leaf/stem anatomy and related observations, **not a root-tip squash or mitotic-stage count task**. “Root” is not evidence for root-tip mitosis. No fixed-sample Paper 3 mitotic-index mark was established. This supports an explicitly syllabus/practical-skills justification for the demonstration, not a claim that the method is never examined.

**Exact replacement for the evidence-status paragraph:**

> The initial weights were a partial G05 transcription. The independent PDF check resolves the cited tariffs and identifies additional fixed-sample questions listed in CHECK.md. Update the ledger and recompute distinct-paper incidence, separable marks and mixed-demand ownership before presenting full-sample attention weights. Outcome totals overlap and are not additive topic marks. The 58:30 allocation remains an editorial teaching budget, provisionally retained; frequency does not mechanically set runtime.

Do not retain “5.1.1 … short outline”: its command is **describe**. Do not retain “telomeres only named, rubric uncharacterised” after identifying S21 D and the two fixed-sample telomere MCQs. W’s `S-C` cannot claim any C4 coverage result without the missing sample manifest; remove that row from the active evidence basis or identify and check its papers separately. No C4 evidence is needed to justify the present eight outcomes.

## Citation audit — every PDF-UNCHECKED source quotation

Repeated occurrences are grouped by source below; the P/W locations include the outcome text, error register and ledger repeats. S§3 repeats the same short reject/accept quotations and is covered by the corresponding rows. G05’s quoted checks, such as “Keep the scope…” and “Commit to a stage…”, are **authored pedagogical inferences**, not Cambridge sentences; their validity is checked in context rather than falsely reported as verbatim matches.

| Source cluster and occurrences | Direct PDF check | Result / required action |
|---|---|---|
| **A01 — Learner Guide “Detail is not required.”** P15/P301; W106 | Actual downloaded Cambridge Guide, PDF p15: exact sentence in the outline annotation. | **VERIFIED EXACT.** Do not broaden it into permission to omit essential steps. |
| **A02 — S23/21 Q4(c)(i), R “daughter chromatids”; I “kinetochore”; G05’s structure-check summary.** P45/P53/P184/P186; W40/W80/W122; S§3 | [QP p14](/home/dachu/sme-9700-archive/pastpapers/2023/June/9700_s23_qp_21.pdf#page=14), [MS p15](/home/dachu/sme-9700-archive/pastpapers/2023/June/9700_s23_ms_21.pdf#page=15). A is centromere; B spindle fibres; names and functions required, 2 marks total. | **SHORT QUOTATIONS VERIFIED.** Reject applies to the sister-chromatid holding function; kinetochore ignored for naming A. Correct “labelling task” shorthand and split the exposure. |
| **A03 — S21/22 Q1(a)(ii), kinetochore accepted.** P45/P184/P186; W52/W73; S§4 | [QP p2](/home/dachu/sme-9700-archive/pastpapers/2021/June/9700_s21_qp_22.pdf#page=2), [MS p7](/home/dachu/sme-9700-archive/pastpapers/2021/June/9700_s21_ms_22.pdf#page=7). Function of microtubules, 1 mark; kinetochore accepted for centromere. | **VERIFIED.** A local function answer, not a requirement to add kinetochore machinery. |
| **A04 — W22/23 Q4(b), identical-nuclei summary and “Mitosis makes identical cells” teaching contrast.** P68/P70/P80; W42/W78/W119 | [QP p11](/home/dachu/sme-9700-archive/pastpapers/2022/November/9700_w22_qp_23.pdf#page=11), [MS p16](/home/dachu/sme-9700-archive/pastpapers/2022/November/9700_w22_ms_23.pdf#page=16). Two events requested; any three listed points, 3 marks. Identical sisters, alignment and equal distribution supported. | **VERIFIED SUMMARY / NOT A VERBATIM MS OR CANDIDATE QUOTE.** E5-06 remains EXAM CONTRAST. Do not turn a sufficient chain into an all-points requirement. |
| **A05 — S23/21 Q4(b)(ii), replication-location summary.** P96/P104; W44/W79/W114 | [QP p13](/home/dachu/sme-9700-archive/pastpapers/2023/June/9700_s23_qp_21.pdf#page=13), [MS p14](/home/dachu/sme-9700-archive/pastpapers/2023/June/9700_s23_ms_21.pdf#page=14). Asks which stage **of interphase**; 1 mark for S/synthesis phase. Bare S is ignored. | **VERIFIED SUMMARY.** Use the full phase name, not just “interphase” or an isolated letter. |
| **A06 — M24/22 Q4(b), replication-location summary.** P96/P104; W44/W103/W114 | [QP p15](/home/dachu/sme-9700-archive/pastpapers/2024/March/9700_m24_qp_22.pdf#page=15), [MS p11](/home/dachu/sme-9700-archive/pastpapers/2024/March/9700_m24_ms_22.pdf#page=11). 1 mark requires circling **both** interphase and S phase. Q4(c), MS p12, is replication mechanism, 4 marks, Topic 6. | **VERIFIED SUMMARY, FORMAT MUST BE PRESERVED.** Do not show only one circle as the paper’s complete answer. Q4(c) does not add a Topic 5 mechanism requirement. |
| **A07 — W20/21 Q1(a)(iii), ignores replication/cytokinesis; scope check.** P96/P105; W70/W115 | [QP p2](/home/dachu/sme-9700-archive/pastpapers/2020/November/9700_w20_qp_21.pdf#page=2), [MS p6](/home/dachu/sme-9700-archive/pastpapers/2020/November/9700_w20_ms_21.pdf#page=6). Exact ignore line present; ATP uses in mitosis, 2 marks, any two. | **VERIFIED IGNORE; BADGE/REPAIR FIX REQUIRED.** Use E5-02 wording above. |
| **A08 — S21/22 Q1(b), telomeres named but no complete mechanistic rubric.** P117; W46/W74 | [QP p3](/home/dachu/sme-9700-archive/pastpapers/2021/June/9700_s21_qp_22.pdf#page=3), [MS p8](/home/dachu/sme-9700-archive/pastpapers/2021/June/9700_s21_ms_22.pdf#page=8). D supplies repeated end sequences permitting replication without gene loss; answer telomeres. | **VERIFIED LIMITED DEMAND.** One separable Topic 5 mark from a four-mark cloze. G05’s caveat is its own assessment, not a PDF quotation. |
| **A09 — stem cells in supplementary C1; recognition Q18–21.** P137/P213; W48/W54/W104 | [W22/13 QP pp9–11](/home/dachu/sme-9700-archive/pastpapers/2022/November/9700_w22_qp_13.pdf#page=9), [MS p2](/home/dachu/sme-9700-archive/pastpapers/2022/November/9700_w22_ms_13.pdf#page=2). Keys **18 A, 19 C, 20 B, 21 A**. | **VERIFIED, DISAGGREGATE.** Q18: one chromosome at telophase, 1 centromere/2 polynucleotide strands/2 telomeres. Q19: interphase photograph for replication. Q20: basal skin stem cells plus Golgi (mixed Topic 1/5). Q21: DNA doubling and growth in interphase. Not four stage-identification items. |
| **A10 — W20/21 Q6(a)(i), tumour/control summary and check.** P157/P167; W50/W71/W120 | [QP p15](/home/dachu/sme-9700-archive/pastpapers/2020/November/9700_w20_qp_21.pdf#page=15), [MS p12](/home/dachu/sme-9700-archive/pastpapers/2020/November/9700_w20_ms_21.pdf#page=12). Mutation context supplied; 2 marks, any two credited consequences. | **VERIFIED SUMMARY.** No frequency claim. Optional oncogene/checkpoint alternatives do not become required teaching. |
| **A11 — W22/23 Q4(a)(ii), spindle-role summary and precision check.** P186; W52/W76 | [QP p10](/home/dachu/sme-9700-archive/pastpapers/2022/November/9700_w22_qp_23.pdf#page=10), [MS p14](/home/dachu/sme-9700-archive/pastpapers/2022/November/9700_w22_ms_23.pdf#page=14). **Describe** microtubule role; 3 marks, any three. Attachment, alignment, shortening, centromere division/poleward movement and equivalent sets supported. | **VERIFIED SUMMARY.** G05 says “explain”, but the actual command is “describe”. Preserve the actual question if displaying it. “Poles”, not unqualified “sides”; no universal chromosome-word ban. |
| **A12 — W22/23 Q4(a)(iii), R “nuclear membrane”; R “cell plate”.** P186/P194; W77/W116; S§3 | [QP pp10–11](/home/dachu/sme-9700-archive/pastpapers/2022/November/9700_w22_qp_23.pdf#page=10), [MS p15](/home/dachu/sme-9700-archive/pastpapers/2022/November/9700_w22_ms_23.pdf#page=15). Both reject instructions present, whitefish animal-cell completion, 3 marks. | **VERIFIED EXACT; COMMON MISTAKE SUPPORTED UNDER HOUSE RULE.** Correct both faults; add sufficient completion content when presenting a full answer. |
| **A13 — S23/21 Q1(a)(ii), A “nuclear membrane(s)”.** P186/P194; W82/W116; S§3 | [QP p2](/home/dachu/sme-9700-archive/pastpapers/2023/June/9700_s23_qp_21.pdf#page=2), [MS p8](/home/dachu/sme-9700-archive/pastpapers/2023/June/9700_s23_ms_21.pdf#page=8). Accepted in the organelle-function table. | **VERIFIED EXACT.** Valid counterexample to a universal lexical rejection. |
| **A14 — S23/21 Q4(c)(ii), anaphase drawing summary/check.** P186/P195; W52/W81/W117 | [QP p14](/home/dachu/sme-9700-archive/pastpapers/2023/June/9700_s23_qp_21.pdf#page=14), [MS p15](/home/dachu/sme-9700-archive/pastpapers/2023/June/9700_s23_ms_21.pdf#page=15). Chromosome **11**, not an unspecified 2n = 4 cell; 3 marks from four listed drawing features. | **VERIFIED SUMMARY; TASK ADAPTATION MUST BE LABELLED.** Separate units, spindle attachments, U/V orientation and centromeres are the relevant drawing features. |
| **A15 — S21/22 Q1(a)(i), stage evidence and reject of multiple guesses.** P207/P213/P221; W54/W72/W118 | [QP p2](/home/dachu/sme-9700-archive/pastpapers/2021/June/9700_s21_qp_22.pdf#page=2), [MS p7](/home/dachu/sme-9700-archive/pastpapers/2021/June/9700_s21_ms_22.pdf#page=7). E metaphase, F anaphase; 2 marks. Exact line: **“R more than one stage given for either E or F”**. | **VERIFIED REJECT / G05 PARAPHRASE.** COMMON MISTAKE badge supported. The paper asks identification, not a separate written justification; justification is our diagnostic teaching addition. |
| **A16 — W22/23 Q4(a)(i), stage-identification summary.** P213; W54/W75 | [QP p10](/home/dachu/sme-9700-archive/pastpapers/2022/November/9700_w22_qp_23.pdf#page=10), [MS p14](/home/dachu/sme-9700-archive/pastpapers/2022/November/9700_w22_ms_23.pdf#page=14). A metaphase, B anaphase; 2 marks. | **VERIFIED SUMMARY.** No frequency claim or separate justification tariff. |
| **A17 — “The selected C3 papers do not establish a credited root-tip preparation/mitotic-index procedure.”** P211; W15 | This is G05’s audit conclusion, not text in an exam PDF. Its linked original sample manifest is absent. The five declared fixed-sample C3 QP/MS pairs were independently screened and no such demand was established. | **SOURCE TYPE CORRECTION.** Retain as G05’s historical conclusion, or replace with the bounded fixed-sample result above. Do not label it a verified Cambridge quotation or claim the unidentified original C3 set was reconstructed. |
| **A18 — G05 sample composition / “5/5” incidence, W11; no cell-cycle molecular-control pathway, P13** | These are G05’s metadata/editorial rulings, not PDF quotations. All five named C2 pairs do contain the stated broad family. The full original 15-pair manifest is absent. | **C2 INCIDENCE SUPPORTED; ORIGINAL FULL MANIFEST NOT REVALIDATED.** Preserve G05 attribution and denominator; never substitute /15 or future probability. |

**Every literal Cambridge quotation tagged PDF-UNCHECKED is accounted for above.** The short quoted A/R/I terms and Learner Guide sentence are genuine. The principal audit problem is contextual overreach and incomplete demand/tariff characterisation, not fabricated source text. G05’s summaries and negative audit conclusions remain explicitly non-verbatim source types.

### Syllabus citation audit, including untagged quotations

| Claim | PDF verification |
|---|---|
| Topic introduction and all eight outcomes | **Exact match**, p23, allowing line wrapping, bullets and subscript typography; also matches the detailed local syllabus reference. |
| Temporary cellular preparations, 1.1.1 | **Exact**, p15. Supports applying microscopy skills; does not prescribe garlic, stain, acid concentration or timing. |
| Papers 3 and 5 assess AO3 | **Confirmed**, p13. |
| Microscope activities, preparing slides, observations, analysis/calculations | **Exact quoted extracts**, p51. Demonstrations/simulations are explicitly excluded from the suggested learner hands-on practical allocation. |
| Counting cells/organelles | **Exact**, p54. |
| Means, percentages and rates of change | **Exact**, p61; this occurrence is in Paper 5 analysis/data handling. |
| Describe/explain/outline command interpretation | **Supported**, p50. Do not label the plan’s shortened paraphrases verbatim. |
| 6.1.4 leading/lagging replication handoff | **Confirmed general replication scope**, p24; it does not explicitly require an end-replication/telomerase mechanism. |

## Timing, five-move realism and should-fixes

| Allocation | Check |
|---|---|
| Lesson seconds | 360 + 390 + 510 + 240 + 270 + 360 + 720 + 660 = **3510 s = 58:30**. |
| Error time | 7 × 70 = **490 s = 8:10**; leaves **3020 s = 50:20** for teaching/framing/recap. |
| Beat count | **89 + 7 = 96**. Individual lesson beat totals agree with the table. |
| Words-equivalent | 58.5 × 120 = **7020**. This is an effective runtime envelope, not 7020 guaranteed spoken words plus extra silences. |
| Five moves in 70 s | Feasible, for example: 5 s announcement + 3 s display/orientation + 4 s silent read + 45 s talk-through + 13 s correction. E5-03 needs both faults within the full allowance and the marker held through the last correction. |

The 70-second error design is realistic at planning stage. S’s word-count formula alone cannot prove that the talk-through occupies at least 45 seconds: assess the actual subsections and later the audio. If spoken delivery is 120 wpm, a 70-second beat containing a four-second silent read can hold at most **132 spoken words** before any other silent time. If 120 is instead the effective rate including holds, state the separate spoken rate; do not add the holds twice.

**Should-fixes before scripts are finalised:**

1. **Correct P239’s arithmetic:** 5.1.3 + 5.1.4 is **12:30**, not 13:00. Separate lessons are still defensible.
2. **Make the 11-minute practical schedule explicit.** Use labelled time compression for acid prewarming/treatment and staining; do not run seven or more minutes of laboratory waits in real time. Reserve roughly 3:00 for real-image interpretation, 3:30 for the edited demonstration, 1:15 for counting, 1:10 for E5-05 and 2:05 for framing/recap/exam close. This is a feasible allocation to test, not a script quota. In particular, do not spend the entire budget on the apparatus and leave the actual interpret/identify outcome to a short recap.
3. **Per-nucleus graph:** during open mitosis there is temporarily no intact nucleus to weigh. Prefer the per-cell graph as the teaching trace; if retaining the other variant, define it as DNA per nuclear chromosome set/new nucleus and mark the open-mitosis interval schematically. A slope through S is schematic, not a claim of an exactly constant replication rate.
4. **Nucleolar and plant examples:** the selected bounded additions should reuse existing assets and time, not create extra lessons. Root growth includes elongation as well as cell production; say mitosis supplies new cells for growth rather than claiming it alone produces all length increase.
5. **Stem-cell diagram:** show intermediate differentiation and qualify the asymmetric pattern as one possibility. Human mature red-cell nuclear loss is an appropriate concrete explanation; do not generalise it to all vertebrate red cells. About four months is a typical human red-cell lifespan, not an exam marking point required by the sampled item.
6. **Separate an authored reject card from source evidence.** A 5.1.1 card about chromosome counting is not the S23 reject about the words “daughter chromatids” in the centromere-function answer. Caption its teaching status and use a genuinely matching counted-state question for any assessment citation.
7. **Correct the unused stem-cell attribution in P139.** S23/21 Q1(a)(i) concerns a cell from a plant **stem** versus leaf mesophyll; it is not a question about an undifferentiated **stem cell**. The plan does not use it, but its description should still be corrected.
8. **Fix operational source paths and quote-check inputs.** The plan’s relative `pastpapers/`, `syllabus/` and `cloud-inputs/` links do not resolve in this checkout. S§3 currently permits only cloud summaries and requires everything to remain PDF-UNCHECKED. Add the verified local QP/MS sources to the authoring handoff/quote-check inputs, and replace tags only for the verified source clusters. Do not make an author reintroduce stale UNVERIFIED placeholders because the validator cannot read the checked evidence. This check does not execute or modify the validators.

## Final ruling and handoff

**NOT CLEARED.** Resolve MUST-FIX 1–6 in the plan, weights and shared specifications together, then re-check the changed text before clearing storyboard authoring. Keep the eight-outcome coverage, coherent lesson allocation, useful real-world examples and all seven full-length error beats. The duration need not change merely because the evidence ledger improves; re-budget only if the corrected practical/image inventory cannot fit at teaching pace.

Remaining non-text production dependencies are explicitly bounded: licensed real micrograph set with stain/organism metadata, and the actual Topic 1 microscope model/handling component. Their absence does not justify fabricating an image or quietly dropping image interpretation. The unidentified G05 C4 manifest is not a required production dependency and should not support an active frequency claim.

Reviewed SHA-256:

- P `5f58f2baa4ea72ef0685d8431be2ab2bb48966492e75b2e87774e102a1ea40eb`
- W `fe5137edc8593478dc601d2cbee383b9594a49320576185ae528fc45f5101cda`
- S `4c5d3c1fd689ef07a4b8f1380dd841ed1c2718d08e0174fd496710711d46e4b2`
