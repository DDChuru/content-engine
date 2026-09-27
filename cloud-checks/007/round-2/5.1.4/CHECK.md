# Round 2 — 5.1.4 — CLEARED WITH MINOR EDITS

Checked 27 September 2026 against the round-one CHECK, revised storyboard/response, FIXES-round-1, updated evidence register and the diff against `60fae0e`. All substantive teaching repairs pass. Only stale evidence-status wording needs cleanup.

HEAD: `ac5d63c3e8af44cfefce2584edd88a926925a4da`.
Storyboard SHA-256: `f8038fcd2441bc5135a5d2b50b13e140d36a738959f905bab82dd1d8f133b547`.

## Every round-one item

| Item | Status | Evidence |
|---|---|---|
| M1 — bounded answer, recap and card | FIXED | Beat 6 boxed answer now includes typical dividing somatic cells and “initially”; Beat 7 explicitly scopes shortening to that model; Beat 8 callback and positive card retain the bounds. The maintenance exception stays. Revised causal arrows replace the removed “so” cues. |
| M2 — actual S22/12 answer | FIXED | Beat 8 narrates possible stopping of division and displays the exact key-A statement at “possibly stopping division”, alongside the source and maintained-length context. No threshold, numerical division limit, ageing or telomerase mechanism is added. Scope ledger now permits this bounded examined conclusion. |
| SF1 — handoff split | FIXED | General replication/enzymes belong to 6.1.4; the separate end-replication problem is outside this lesson’s required mechanism, without claiming 6.1.4 requires it. |
| SF2 — entry frames | FIXED | Beat 3 opens with the rod pictogram. Beat 4 restores the familiar labelled chromosome before zooming. |
| SF3 — schematic copying | FIXED | Model, magnifier and relevant copying frames carry the endpoint-comparison caption, expressly excluding strand inheritance or a molecular mechanism. |
| SF4 — repeat versus block | FIXED | Whole-run TTAGGG label and arbitrary-length disclaimer persist on zoom/replay. A continuous sweep replaces block-by-block highlighting. No fixed six-base loss is implied. |
| SF5 — evidence status | FIXED in substance; minor stale text remains | All three previously unresolved exam items have source/page resolutions. Exact S22 statement is independently verified below. “Not yet in VERIFIED-EVIDENCE” is now obsolete. |
| Runtime/cut arithmetic | FIXED | Recount is 512 words/4:16; optional cuts are correctly rebuilt as 15 words → 497/4:08.5. Earlier incorrect cut arithmetic is corrected. No qualifiers removed to fit. |
| Quote-check reproducibility | FIXED | Updated checker runs against available sources: two checked, zero not found. The italic S22 statement is separately checked against the original PDF below. |

The plan’s no-chopped-block, arbitrary-length and conditional-thought-experiment repairs remain intact. The thought experiment stays captioned and returns to the real model; neither real gene band is lost during its three illustrative protected rounds.

## Minor editorial replacement — remove obsolete evidence status

The causal spine, Citations, Validator run and response table still say the S22/12 Q18 statement is not yet in VERIFIED-EVIDENCE or awaits conductor addition. It is already present in `work/007/VERIFIED-EVIDENCE.md` under the round-one additions. Being set in italics does not make exact Cambridge text a paraphrase.

Replace those present-tense pending-status statements with:

> Exact Cambridge option-A wording, S22/12 Q18, QP p7 / MS p2, key A; verified against the original PDFs and recorded in work/007/VERIFIED-EVIDENCE.md. Italic styling is a presentation choice.

Replace Beat 8’s general source note beneath rows 2–3 with:

> Question-demand summaries are our paraphrases; the row-3 answer sentence is Cambridge’s exact option-A wording.

Use the durable local round-one report path `cloud-checks/007/round-1/5.1.4/CHECK.md` wherever the source note currently relies on `/tmp/claude-0/sp/r1/5.1.4/CHECK.md`. No narration or biological content needs changing.

## Original-PDF audit and regression scan

Fresh `pdftotext -layout` extraction of `/home/dachu/sme-9700-archive/pastpapers/2022/June/9700_s22_qp_12.pdf`, p7, confirms **“If telomeres become too short, a cell may stop dividing.”** The paired `9700_s22_ms_12.pdf`, p2, keys Q18 **A**, one mark. Maintained telomeres in cancer/stem cells are supplied in the question. This verifies the new displayed sentence regardless of its italics. Unchanged cloze, other MCQ and Learner Guide sources retain the independent round-one audit.

The revised narration and visible answer now agree about typical somatic shortening, initial protection and possible stopping of division. No universal protection from DNA loss/damage, fixed loss per round or new mechanism appears. Chromosome/telomere counts in the recall remain correct. Images are expressly schematic; no new measured dataset, timer, handling claim or real-sample assay was added. The explanatory recap retains its familiar model and the exam answer stays visible beside the model. No new substantive defect found.

Fresh validator: **8 beats, 512 words, 77 cues, maximum gap 18 words, zero failing beats; 4:16.0**. Quote checker: **2 checked, 0 not found**; required input refs were present, so no fetch was needed. Matching the source corpus does not itself certify the italic exam sentence; the direct PDF check above does.

Accept **4:16**, sixteen seconds over 4:00. The ten additional words preserve the requested qualifications and actual exam demand. Final two-second anchored hold is included in the effective timing estimate; confirm actual recording at build. No error beat is required, and no compulsory cut is warranted.

Only this CHECK written for this code; storyboard unchanged. No commit, push or deployment.

CLEARED WITH MINOR EDITS
