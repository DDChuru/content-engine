NOT CLEARED

Independent round-one check of **5.1.4 — Telomeres**, 27 September 2026. The plan check’s revised shortening model reached this storyboard: no detached blocks, no fixed six-base loss, and an explicit telomere-maintenance exception. Its bounded wording did not fully reach the portable answer, recap and reject card. The cited S22 MCQ also has a correct-answer demand missing from the lesson.

Reviewed STORYBOARD.md SHA-256: `60dac6293eabd6b6f4f8198631ed7e83a9e600f7c7c3d58fde660c36d700fd13`; workspace HEAD `60fae0e13b349d5f66ab85a4f275fc71bc1254b4`.

Read the complete storyboard, relevant amended plan and weights, shared specifications, SUMMARY, VERIFIED-EVIDENCE, full VIDEO-STRUCTURE including REAL-WORLD SAMPLES, exact syllabus outcome, and original plan CHECK from `origin/cloud/007-checks`. Also checked the preceding 5.1.3 storyboard’s shared-model contract. Every exam source below was independently extracted from its actual QP/MS PDFs with `pdftotext -layout`; inherited verification labels were not treated as substitutes. No audio or rendered video exists to inspect. Only the requested CHECK files are written; no storyboard edits, commit, push or deployment.

## Must-fixes

### M1 — Carry the plan’s bounds into the answer, recap and final card

The opening explanation correctly says “can” shorten in typical dividing somatic cells, and Beat 5 says some cells maintain telomeres. But Beat 6’s boxed answer, Beat 7’s “with each round … is shorter”, and Beat 8’s positive card revert to unqualified shortening and gene protection. The prose above the beats cannot bound a sentence a learner is invited to copy independently. The plan check specifically required propagation into the recap/reject card; “over repeated replication” is a time interval, not the missing biological qualification.

Replace the converted sentence in Beat 6, including the handle specification, boxed text, scope/absolutes ledger and its Beat 8 reuse, with:

> Written properly: telomeres are repeated non-coding DNA at chromosome ends. In typical dividing somatic cells, shortening during repeated replication initially removes telomeric DNA, protecting nearby genes.

Replace the last two sentences of Beat 7 with:

> Replication happens in the S phase of interphase. In our model of a typical dividing somatic cell, the end shortens over successive rounds, initially losing telomeric DNA and keeping the nearby genes intact.

Replace Beat 8’s final sentence with:

> In our model, copying leaves a shorter telomere while the nearby genes remain intact.

Replace the positive reject-card line with:

> ✓ In typical dividing somatic cells, telomeres can shorten over repeated replication; initially, telomeric DNA is lost rather than nearby genes.

Keep the written negative line, the authored-contrast caption, and the maintenance exception. Remap all affected cues to exact new narration substrings; in Beat 6 replace the instruction to highlight “so” with an arrow linking telomeric shortening to the intact gene bands. In Beat 8, replace “keep the link”’s “so” highlight with that same causal arrow. Do not suggest protection from all DNA loss or all DNA damage. The real-state animation may keep both genes intact throughout its three illustrative rounds; this is not a demand to animate a real cell exhausting its telomeres.

### M2 — Teach the actual credited conclusion of the cited S22 question

**S22/12 Q18, QP p7 / MS p2, key A**, does not merely ask whether telomeres shorten. Its correct statement is **“If telomeres become too short, a cell may stop dividing.”** That conclusion is absent from the narration, model answer and exam-close row, while the scope ledger excludes what happens when a telomere runs out. This leaves a listed exam demand unsupported by the lesson. “Too short” is not “entirely gone”, and a bounded one-sentence conclusion does not require telomerase, ageing, a division limit or a checkpoint pathway.

Replace Beat 8’s MCQ sentence with:

> Multiple-choice questions link more divisions to shorter telomeres, and a telomere becoming too short to a cell possibly stopping division.

Replace row 3 and its cue instruction with:

> At “possibly stopping division”, reveal “If telomeres become too short, a cell may stop dividing.” Cite S22/12 Q18, QP p7 / MS p2, key A. Keep this answer visible beside the model. Beneath it, retain the note that maintained length in stem and cancer cells is supplied context. Do not draw a measured threshold, a fixed number of permitted divisions, or further replication after a stop symbol.

Update the causal spine/evidence and scope ledgers with:

> Teach the bounded examined conclusion that a cell may stop dividing if its telomeres become too short. Do not teach an ageing theory, a numerical division limit, telomerase biochemistry, or the detailed cellular response to an unprotected chromosome end.

This is a newly resolved assessment gap, also understated by the amended plan’s broad “function/shortening” summary; it is not a claim that the storyboard failed to copy a plan sentence that was already present.

## Should-fixes

1. **Handoff ledger:** the small caption in Beat 5 is sound, but “What I left out” groups the end-replication problem with the general mechanism under 6.1.4. Split that row. Exact text: **“General semi-conservative replication and replication enzymes — 6.1.4.”** Separate row: **“Detailed problem of copying chromosome ends — outside this lesson’s required mechanism; no claim that 6.1.4 requires it.”** This finishes the plan’s handoff correction.
2. **Model entry frames:** add **“From Beat 3’s first frame, show the rod-with-shaded-tips pictogram; its objective text enters at ‘say what a telomere is’.”** At Beat 4’s entry explicitly restore the familiar labelled chromosome before the zoom cue. The detailed objectives model is correctly kept separate; these instructions remove entry/persistence ambiguity.
3. **Schematic copying:** add to the model and its magnifier **“This comparison shows endpoint lengths across successive replication rounds, not strand inheritance or a molecular replication mechanism.”** Keep copying progressive and the endpoints shorter; do not interpret the intact parent/second-strip graphic as a diagram of conservative DNA replication. A strand-level mechanism is unnecessary.
4. **Sequence versus block size:** the TTAGGG label correctly spans the whole run and the block disclaimer is explicit. Preserve both on every relevant zoom/replay. The sequential highlights in Beat 4 must not imply that each grey block is one six-base repeat.
5. **Evidence status:** replace the resolved cloze/MCQ UNVERIFIED labels with **“PDF-VERIFIED in round-one check; displayed wording is our paraphrase”** where paraphrases remain. Add the precise page references below. The excerpt from G05 remains an attribution to G05, not Cambridge.

## Did the plan-check must-fixes reach this storyboard?

| Plan requirement | Storyboard evidence and ruling |
|---|---|
| MF1: progressive S and correct replicated chromosome | Beat 2 shows S-phase progress, then two sister chromatids joined at the centromere, still one chromosome, four telomere ends. Uses the same C1 identity and extended state as 5.1.3; condensed enlargement is explicitly for clarity. **Reached.** No whole-cell count is displayed, so the count-timing defects in 5.1.3 are not replayed here. |
| MF2: seven error-beat repairs | **Not applicable:** this lesson has no full error beat. Its closing authored contrast is not falsely labelled COMMON MISTAKE or an examiner-reported error. |
| MF3: bounded somatic shortening; some cells maintain telomeres | Present in the causal spine and Beats 1/5. **Partial:** portable answer, recap and reject card drop those bounds. M1 above completes propagation. |
| MF3: no chopped block or exact six-base loss | Shorter daughter endpoints, arbitrary grey lengths, whole-run TTAGGG label, schematic caption, retained starting-end guide and conditional thought experiment are specified. **Reached.** Gene-loss thought experiment is explicitly labelled and returns to the real model. |
| MF3: distinguish general replication handoff from end-replication mechanism | Beat 5 caption makes the distinction. **Partial:** the later ownership table contradicts it; should-fix 1 provides the exact repair. |
| MF4–5: real micrographs, practical procedure, mitotic-index arithmetic | **Not applicable.** No practical experiment or photomicrograph lesson here. This review does not clear those requirements in other storyboards. |
| MF6: correct telomere tariff and full-sample additions | Header/close correctly give three one-mark exposures, not all four cloze marks: S21/22 D plus S21/12 Q19 and S22/12 Q18. **Reached for source inclusion/tariff.** M2 corrects the lesson’s incomplete treatment of the last item’s actual answer. |

Therefore the plan corrections reached the model geometry and much of the prose, but have not fully reached the final teaching output. Shared-spec compliance alone is insufficient.

## Citation audit — actual PDFs

Archive root: `/home/dachu/sme-9700-archive/pastpapers/`. QP/MS filenames use `9700_<session>_qp_<component>.pdf` and `_ms_`. Pages are one-based PDF pages.

| Source; QP / MS pages | Independent finding and resolution |
|---|---|
| 2021/June, s21/22 Q1(b); 3 / 8 | Four-mark cloze; A hydrogen, B DNA ligase, C DNA polymerase, D telomeres. D describes repeated nucleotide sequences at chromosome ends permitting continued replication without gene loss. **Exactly one mark is the telomere demand.** Storyboard paraphrase and tariff are correct; wording/answer-line UNVERIFIED status resolved. The scheme has a general reject instruction for answers offering a choice, but no telomere-specific misconception/reject line establishing a full error beat. |
| 2021/June, s21/12 Q19; 7 / 2 | Key A, **5548 bases**, the smallest of 5548/5580/5645/5700, for the cell with most divisions. Skin cells were cultured for sixteen days and sampled on days 4/8/12/16. TTAGGG is explicitly supplied in the stem. Shortening inference is supported; these numbers do not give a fixed amount lost per division. Stem/options UNVERIFIED resolved. No need to introduce those experimental values into the schematic. |
| 2022/June, s22/12 Q18; **7** / 2 | Key A, exact correct statement quoted in M2. Stem supplies shortening and maintained telomeres in cancer/stem cells. Distractors include protection from all DNA damage. The storyboard’s context summary is accurate but omits the credited conclusion. Stem/options/context UNVERIFIED resolved. |
| Cambridge Learner Guide, PDF p15 | Actual cached PDF `/tmp/topic5-plan-check/9700-learner-guide-2022.pdf` re-extracted: **“Detail is not required.”** is exact outline guidance. It does not turn an outline answer into a prohibition on explaining the causal link. |
| Syllabus 2025–2027, p23, outcome 5.1.4 | Actual syllabus PDF re-extracted. Header quotation is verbatim: “outline the role of telomeres in preventing the loss of genes from the ends of chromosomes during DNA replication”. |
| G05’s mechanistic-rubric caveat | Correctly presented as G05’s assessment, not Cambridge wording. The cloze itself provides a name/role demand, not a detailed end-replication mechanism. Local quote-check script cannot resolve its missing G05 corpus file; no claim of fresh verbatim G05 verification is made. |

Three distinct fixed-sample papers and three marks are correct. Two are P1 and one is a separable P2 cloze mark. No examiner-report prevalence claim or invented telomere-specific reject line is justified.

## Scope, science and visual audit

The outcome’s structure → repeated non-coding sequence → shortening initially outside genes → gene protection chain is present. S-phase timing is correct. The model’s four telomeres belong to two sister chromatids of one replicated linear chromosome; its round counter is not a chromosome count. The thought experiment is explicitly hypothetical, conditional in narration, visually bounded by a dashed frame, and returns to the protected real-state model. No grey block is physically excised, no measured shortening rate is fabricated, and no enzyme, primer or bond-making mechanism is drawn.

Beat 7 deliberately revisits the same diagram with highlights; the required recap is allowed to be comparatively static. Other explanatory events specify motion. Objectives have their own pictograms; the exam close retains the model. The hook’s gut/skin drawings are identified tissues used as schematic context, not measured samples or tests. There are no reagents, stains, collection timers, calculated instrument readings or practical handling to verify. TTAGGG appears in an explanation beat and is supported by the original paper; it is not misrepresented as an additional cloze marking point.

Do not widen M2 into an ageing lecture or an inevitable end state. Its “may stop” qualifier is exactly the useful boundary supplied by the examined answer. Maintain the distinction between some cells maintaining telomeres and every round universally shortening them.

## Validator and runtime ruling

Fresh `python3 work/007/validate_storyboard.py storyboards/topic-05/5.1.4/STORYBOARD.md` result: **502 words; 72 cues; eight beats; zero failing beats; 4:11.0 at 120 effective wpm.** Maximum cue gap: 18 words. This does not validate the biological scope of the final sentences.

`check_quotes.py` fails in this checkout with FileNotFoundError for `cloud-inputs/007/evidence/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md`; its pasted success result was not reproduced. Direct original-PDF checking resolves the exam evidence independently. No files were added to make that script pass.

**Accept 4:11**, eleven seconds over the four-minute editorial budget. Do not accelerate narration. No error beat exists to preserve or add. Keep the conditional example and maintenance exception. M1/M2 require recounting and cue validation; accept a modest content-led adjustment after those essential repairs rather than cutting qualifiers to fit. The final two-second anchored hold belongs inside the effective runtime; confirm with measured audio.

The existing optional cut list also has an arithmetic error: its first replacement saves **eight**, not nine, whitespace-counted words. All four listed cuts would save 23 words, yielding **479 words / 3:59.5**, not 478 / 3:59. This is a minor ledger correction, not a clearance blocker or a reason to apply the cuts.

## Final verdict

**NOT CLEARED** — preserve the plan’s bounded telomere explanation in the copied answer/recap/card and teach the cited MCQ’s “may stop dividing” conclusion. The revised shortening animation and corrected one-mark cloze attribution did reach this storyboard.
