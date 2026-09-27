# 4.1.4 — Independent storyboard check, round 1

27 September 2026. **NOT CLEARED.** The three-stage explanation and E44 are sound, but the glucose-uptake drawing needs a protein route, and the exam close must put the actual prostaglandin answer before the insulin teaching example.

Checked the complete storyboard against the amended Topic 4 plan/weights, plan check, SHARED-SPECS, SUMMARY, the full current VIDEO-STRUCTURE (including REAL-WORLD SAMPLES), and the verbatim syllabus reference. Compared the shared receptor, membrane and exocytosis contracts with 4.1.3 and 4.2.1b. Ran the supplied validator. Independently extracted the actual question papers and mark schemes with `pdftotext -layout`; this is not merely a check against the author's evidence register. No audio or rendered sequence was available. Only this CHECK file is written; no storyboard edits, commits or deployment.

## Must-fixes

### M1 — Glucose must not enter through a bare membrane gap

**ReceptorLigand `response-uptake`, Beat 6 actions 1–2, the SignallingScene motion contract and Plan interpretations 6.** The explicit “plain gap ... not a drawn transport protein” is a drawable hole, whatever the small-print disclaimer says. It contradicts the protein requirement taught by 4.1.3 and 4.2.1a. Excluding an intracellular signalling pathway does not require excluding a transporter already established in the preceding lesson.

Replace the uptake drawing contract everywhere it occurs with:

> Keep the bilayer continuous around a separate teal glucose carrier, spatially distinct from the insulin receptor, labelled glucose transport protein. Reuse the carrier binding/change-of-shape/release motif; glucose never crosses an unlined gap, the receptor, or the hydrophobic core. A labelled before-binding miniature shows a lower illustrative uptake frequency; the after-binding view shows more carrier-mediated uptake events. Caption: increased glucose uptake; schematic, not measured; how insulin increases uptake is not shown. Do not animate carrier insertion or an intracellular signalling pathway. At whole-cell scale, preserve a small labelled protein route at the crossing position.

For **Beat 6 action 1**, replace the post-binding “slow background rate” start with:

> From the first frame, retain the bound receptor from Beat 5 and a small explicitly labelled before-binding comparison beside the muscle-cell membrane. At “leads to an increase in glucose uptake”, show the after-binding uptake increase through the separate carrier. The baseline belongs to the labelled comparison, not to an unexplained interval after insulin has already bound.

This retains the named response, the contrast and the syllabus ceiling without adding the Topic 14 mechanism. Propagate it to the recap/close thumbnails and Assets. No narration change is required for this repair.

### M2 — Restore the real exam context and distinguish the insulin illustration from credit

**Beat 9 and its source/UNVERIFIED ledger.** M24/22 Q1(c)(iii) is explicitly about **prostaglandins and cells involved in inflammation**, not an unqualified insulin outline. MS p.7 credits (1) release OR transport of prostaglandins and (2) their receptor binding. Release and transport are alternatives within one point. The current generic narration is substantially right, but the insulin scene and insulin ticked answer occupy the only worked-answer space. The REAL-WORLD SAMPLES rule requires the scheme answer first, with any real-world addition spoken and visually labelled as beyond the scheme. “Our wording contrast” alone does not satisfy it.

Replace **Beat 9 narration** with:

> How does this reach you? March 2024 Paper 22 used prostaglandins in inflammation. Prostaglandins are released by cells or transported to target cells, then bind to receptors on their surface membranes. Those are two marking points; release and transport share one. A full outline still names all three stages. The scheme does not need our insulin example; that is beyond the mark scheme. November 2022 asked why different cell types respond to LL-37: shared complementary receptors. For that question, use binding site for the receptor. And our hormone does not search: blood carries it widely, and complementary receptors determine which cells respond.

Replace **Beat 9 actions 2–4** with:

> At “March 2024 Paper 22”, display “Prostaglandins in inflammation — outline cell signalling; 2 marks”, cited M24/22 Q1(c)(iii), QP p.5 / MS p.7, labelled our paraphrase. Beside a simple secreting-cell → ligand → target-cell schematic, build and retain: “1. Prostaglandins are released by cells OR transported to target cells. 2. They bind to receptors on target-cell surface membranes.” At “release and transport share one”, bracket those alternatives together under point 1. At “A full outline still names all three stages”, highlight secretion → transport → binding as the syllabus outline, without claiming three marks. At “beyond the mark scheme”, reveal the familiar insulin scene in a dashed panel labelled “beyond the mark scheme — our insulin illustration”; the prostaglandin answer remains visible. At “November 2022”, reveal the LL-37 question row and its corrected E44 thumbnail. At “use binding site for the receptor”, close on the genuine local contrast “✗ receptor active site / ✓ receptor binding site”, citing W22/23 Q5(a)(i), MS p.17, R active site. Retain the existing hook callback animation at the corresponding new cues.

Remove the strike-through of the biologically correct insulin binding/response sentence. It is incomplete as a full three-stage outline, not false biology or a universal zero-mark answer. The genuine local reject above satisfies the closing-card requirement without making that implication. Re-map every affected cue; do not retain cues from deleted narration.

**E44 action 10 also imports insulin into an exam-answer frame.** Keep E44's 142-word narration intact and replace its insulin-thumbnail highlight with:

> At “share the same complementary receptor”, show two unnamed cell silhouettes beside the corrected answer, each carrying the same abstract receptor symbol. Caption: shared receptor, schematic explanation of the credited point; LL-37 receptor identity not specified. Keep the earlier insulin scene dimmed as background recall; do not highlight muscle/liver cells as part of the LL-37 marking explanation.

## Should-fixes

1. **Correct the timing convention throughout.** Header, beat-window preamble and runtime prose currently say the 4 s read is included, while binding SHARED-SPECS §2a and the actual validator add it. Replace with: **“Narration: 801 words ÷ 120 = 6:40.5. Add the explicit E44 read of 4 s: 6:44.5, 15.5 s below the 7:00 budget. E44: 142 words ÷ 2 + 4 = 75 s. Ordinary settling holds are included in the effective pacing estimate unless explicitly scheduled outside it.”** Shift the end of Beat 7 and later provisional headings by 4 s. If the final 2 s hold is an additional scheduled hold, declare 6:46.5. Recount after M2.
2. **Clean stale model history.** Current SHARED-SPECS already calls the state `response-uptake`; Plan interpretations 1 incorrectly says it currently requires `response-pulse`. The plan's shared table retains a historical pulse name, but its behaviour and the current spec both require uptake. Replace with: **“Use response-uptake, matching current SHARED-SPECS and the amended plan's named uptake response; treat the plan table's residual response-pulse label as stale.”**
3. The vesicle inset should explicitly retain two bilayer leaflets at cell-surface scale through fusion. Use **“Both apposed bilayers join into continuous leaflets around an extracellularly open fusion pore; the vesicle lumen becomes continuous with tissue fluid, while cytoplasm remains separated.”** This makes “one continuous outline” unambiguous for the builder; the stated fusion mechanism itself is correct.
4. Update citation statuses and remove the source gaps settled below. Preserve the difference between direct PDF checking in this CHECK and the original author's earlier register-only checking.

## Scope, science, visuals and shared models

Outcome **4.1.4**, including its three bullets, matches SYLLABUS-9700-DETAIL p.21 verbatim. The **14.1.10** excerpt is exact. Secretion, transport and binding are each explained; insulin is correctly bounded as a peptide-hormone example released by beta cells through exocytosis. Blood then tissue fluid is an appropriate route. Short-range signalling is explicitly another route, not an insulin-specific claim. No cascade, second messenger or steroid pathway is added.

The specific-response teaching correctly allows several target cell types to share a receptor. The unnamed non-target cell avoids asserting that a particular real tissue lacks insulin receptors. The liver response remains unnamed. The analogy is immediately converted into complementary receptor binding and its one-address limitation is addressed. The broad statements about receptors are understandable within the explicitly taught receptor-mediated mechanism, rather than claims about all possible ligand chemistry.

All nine beats specify a model or pictogram from entry. Objectives have their own visual surface; the recap reuses the established scene. There is no identified text-only frame. The mechanism has approach/failure/seating, secretion/fusion and transport motions. The recap's static state has cue-linked highlights and is permissible. E44's anchored 4 s reading pause is legitimate. The close is crowded (three evidence rows plus multiple visuals); M2 prioritises the answer and allows the adjacent S21 row to remain small or be removed from the visible close without losing scope.

Membrane orientation, external carbohydrate chains, magenta ligand shapes, glucose orange, teal proteins and binding-site vocabulary agree with the Topic 4 library. The exocytosis state matches 4.2.1b's reuse. M1 is the substantive cross-lesson contradiction. No practical material is handled: assay range, reagent colours, physical pours and first-contact timers are not applicable. No numerical readings or calculated measurements are fabricated. The insulin example is valid in explain beats; M2 handles its distinct status in the exam close.

## E44 and citation audit

**E44: PASS as an error beat**, subject to M2's visual-context adjustment. COMMON MISTAKE is justified by the explicit reject line. Announcement precedes the constructed written error, the silent read is explicit, the talk-through names the problem and a plausible reason, and repair happens in place. The badge remains until the complete corrected frame. The wrong proposition is never spoken as biology. The report does not invent a frequency or claim that all marks are lost: the local R explanation is confined to the relevant point.

Local PDF root: `/home/dachu/sme-9700-archive/pastpapers/`. QP/MS files below use their actual `9700_<session>_<qp|ms>_<component>.pdf` names. Repeated citations in narration, source tables, spine and scope ledger are covered by the corresponding audit row.

| Claim / quotation | Actual source inspected | Independent ruling |
|---|---|---|
| `R active site`; LL-37 context, any two of receptor identity/location/complementarity | `2022/November/9700_w22_qp_23.pdf` p.12; `9700_w22_ms_23.pdf` p.17, Q5(a)(i) | **Verified.** QP asks how many different cell types respond to the same signalling compound. MS says any two; location accepts cell surface membrane **or inside cell**. The taught surface option is valid, but not the scheme's only permitted location. Exact reject matches. |
| Outline cell signalling, 2 marks; secretion/transport plus binding can earn both | `2024/March/9700_m24_qp_22.pdf` p.5; `9700_m24_ms_22.pdf` p.7, Q1(c)(iii) | **Verified with context restored in M2.** Prostaglandins/inflammation. Release OR transport is point 1; binding is point 2. Intracellular examples are optional point 3, any two. Complementarity is sound teaching, not an extra compulsory word in this particular point 2. |
| `Reject if hormone S or receptor R described as an antigen or enzyme`; cytoplasmic receptor specificity, 1 mark | `2021/June/9700_s21_qp_22.pdf` p.6; `9700_s21_ms_22.pdf` p.12, Q3(c) | **Exact match and context verified.** QP explicitly locates R in cytoplasm and contrasts receptors elsewhere. Adjacent specificity evidence only, as the storyboard correctly says. No need to reproduce or teach the whole diagram. |
| R24 p.21: intracellular details not required at AS; fewer mentions of release/transport | Actual June 2024 ER, p.21, P23 Q5(a) | **Paraphrase supported.** The archive has only failed-download headers. Independently extracted the existing official PDF at `/tmp/topic4-pdf-audit/9700-examiner-report-june2024.pdf` (hash below), from the [official Cambridge report](https://www.cambridgeinternational.org/Images/566822-june-2024-examiner-report.pdf). The report also accepts appropriate events leading to a specific response. |
| Direct exposure 2/5 cited blocks, 4 marks; three papers with adjacent S21 item | Question tariffs above; amended weights' fixed five-paper denominator | **Correct as the declared sample summary:** 2 + 2 = 4; the additional adjacent item is 1 mark. This check does not certify an exhaustive archive-wide incidence count. |
| Syllabus quotations | SYLLABUS-9700-DETAIL, 4.1.4 p.21 and 14.1.10 p.38 | **Verbatim matches.** |

**UNVERIFIED disposition:** items 1, 2, 4 and 5 are now resolved by the actual PDFs. Item 3 (LL-37 receptor identity) is neither established by these papers nor needed; leave it unnamed. Do not keep “question wording UNVERIFIED” on student-facing cards now that the sources have been checked. Author-written questions can still be labelled paraphrases.

## Validator and runtime ruling

Literal rerun:

```text
beat  words  cues maxgap  status
1       83     8     14  ok
2       55     4     16  ok
3       88     9     16  ok
4       77     9     12  ok
5       96    15     14  ok
6       89    12     10  ok
7      142    17     14  ok
8       73    10     14  ok
9       98    12     14  ok
TOTAL words 801  cues 96  runtime at 120 wpm 6:40.5  beats 9  failing beats 0
```

No missing-section or citation-tag warnings. Manually reviewed the binding, response, error-repair and exam-close cue mappings: exact strings and ordering pass, but matching text cannot detect M1's incorrect route or M2's source presentation. The passive baseline shown after insulin is already bound is a semantic timing issue despite valid cues.

**Accept the duration; no cuts required.** Teaching is 659 words = **5:29.5** against 5:45; E44 is **75 s including its read**, against 1:15; total **6:44.5** against 7:00. M2's replacement is similar in length; recount and rerun cues after applying it. Protect E44 in full. No speed-up or arbitrary split is justified.

Reviewed storyboard SHA-256: `562f8603c56352b060e4c2f6ecb9314a21d3db588475b3586491e12d9bd3513f`.
Official R24 PDF SHA-256: `ff0680bed120861fdf6fde40ae403e94ee40c6a626413e25bebf1d747471a41e`.

Return required: M1–M2, associated cue changes, and corrected timing/source records. This is a storyboard ruling, not rendered-frame clearance.

**NOT CLEARED**
