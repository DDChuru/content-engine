# 4.1.4 — Independent storyboard check, round 2

**CLEARED.** Both round-1 must-fixes and all four should-fixes are implemented in the actual teaching/visual instructions, not just the appended response table. The separate glucose carrier resolves the cross-lesson route error. The exam close now gives the prostaglandin answer first, distinguishes marking alternatives and labels the insulin illustration beyond the mark scheme.

Reviewed the complete revised storyboard at workspace commit `e3e3ebd1`, `work/006/FIXES-round-1.md`, and this reviewer's round-1 CHECK. Independently reran the validator and reopened the PDFs supporting the changed exam close. Storyboard SHA-256: `383e1bebdd0a0c890e0795f2942289ab04778ea9a82589f921caaf2146417280`. This is storyboard clearance; no rendered animation or measured audio was supplied.

## Every round-1 item

| Round-1 item | Status | Evidence in the revised storyboard |
|---|---|---|
| M1 — no glucose crossing a bare membrane gap | **FIXED** | `ReceptorLigand.response-uptake` explicitly keeps the bilayer continuous around a separate teal glucose carrier, distinct from the insulin receptor. Binding/change-of-shape/release is specified. `SignallingScene`'s glucose line, respond state and motion contract preserve that route at whole-cell scale. Beat 6 actions 1–2 implement it; Beats 8–9, Assets, Reusable models and Plan interpretations 6 preserve it. No unlined gap remains in the active drawing contract. |
| M1 — baseline must precede binding or be an explicit comparison | **FIXED** | Beat 6 begins with the already bound receptor retained from Beat 5 and a separately labelled before-binding miniature. The main view's uptake increase is cued to “leads to an increase in glucose uptake”. The baseline is expressly not an unexplained post-binding interval. |
| M2 — prostaglandin context and scheme answer before insulin | **FIXED** | Beat 9 narration identifies prostaglandins/inflammation. Actions 2–3 build the actual two-point answer beside its own neutral ligand schematic: release OR transport under point 1, receptor binding under point 2. Action 4 distinguishes the three syllabus stages from the two-mark tariff. Action 5 and the narration both label the insulin illustration beyond the mark scheme while retaining the prostaglandin answer. |
| M2 — remove the struck-through valid insulin answer; use a genuine local reject | **FIXED** | Beat 9 action 7 closes on receptor active site versus receptor binding site, citing W22/23 Q5(a)(i), MS p.17. The former crossed-out insulin binding/response sentence is removed. The reject remains local to this marking point and question. |
| M2 — do not make muscle/liver insulin cells the LL-37 answer | **FIXED** | E44 action 10 now uses two unnamed cell silhouettes with the same abstract receptor symbol, captioned as a schematic explanation of the credited point; receptor identity is not specified. The insulin scene stays dimmed. The close reuses that corrected LL-37 thumbnail. This abstract symbol is not a claim to identify or reproduce a real LL-37 receptor. |
| SF1 — timing convention, headings and holds | **FIXED** | Header, beat-window preamble and runtime ledger explicitly add the four-second read. Beat 7 ends around 5:19, followed by Beat 8 at 5:19–5:56 and Beat 9 at 5:56–6:47. The final two-second hold is expressly an ordinary settling hold within effective pacing; if production schedules it separately, it must be added once. New arithmetic is correct for 805 words, rather than copying the old 801-word total. |
| SF2 — stale response-pulse history | **FIXED** | Plan interpretations 1 names `response-uptake`, matches current SHARED-SPECS and identifies the residual plan-table pulse label as historical. The liver's unnamed response glow remains distinct from the muscle uptake mechanism. |
| SF3 — continuous bilayer leaflets during fusion | **FIXED** | `VesicleTransport.exocytosis` and Beat 3 action 6 explicitly retain two leaflets through an extracellularly open fusion pore, with lumen continuous with tissue fluid and cytoplasm still separated. Reusable models and Assets agree; frame verification remains a production task. |
| SF4 — citation statuses and resolved gaps | **FIXED** | Authority note and citation rows distinguish the author's register-only checking from the independent round-1 PDF check. Source gaps 1, 2, 4 and 5 are marked resolved; student-facing QP warnings are removed. The unknown LL-37 receptor identity stays unnamed and is not a necessary dependency. R24 remains a paraphrase, and the cytoplasmic S21 receptor remains adjacent evidence rather than a cell-surface-stage claim. |
| Runtime ruling — accept duration; preserve E44 | **FIXED / FOLLOWED** | E44 is unchanged at 142 narration words plus a four-second read, 75 seconds. The revised close adds four words overall. The lesson remains below seven minutes without cuts, accelerated narration or an added error beat. |

## Changed-source verification

Actual archive root: `/home/dachu/sme-9700-archive/pastpapers/`. The revision introduces source-faithful paraphrases, not new purported verbatim Cambridge quotations. The two previously verified reject quotations remain unchanged.

| Changed or reused assessment claim | Round-2 verification |
|---|---|
| M24/22 Q1(c)(iii), prostaglandins/inflammation, 2 marks | Reopened `2024/March/9700_m24_qp_22.pdf` p.5 and `9700_m24_ms_22.pdf` p.7. The supplied context and tariff match. The scheme offers any two of three points: release OR transport within the first, receptor binding in the second, and an example of triggered response events in the third. The storyboard's selected first two are a sufficient answer; its bracket correctly prevents release and transport being counted separately. |
| W22/23 Q5(a)(i), shared receptors and local active-site rejection | Reopened `2022/November/9700_w22_ms_23.pdf` p.17. Same/specific receptor, location and complementary shape are the three alternative points, any two. Location permits surface or inside the cell. `R active site` is exact. The taught surface option is valid, without being represented as the only accepted location. |
| S21/22 Q3(c) adjacent specificity/reject and R24 p.21 | No new wording claim beyond the round-1 verified reject and supported paraphrases. The revision preserves their source contexts and status; the earlier direct-PDF audit continues to apply. No newly invented examiner quote, prevalence or receptor identity was found. |

The real-world rule is now met in the changed exam treatment: actual credited answer first; the extra insulin example explicitly spoken and visibly labelled as beyond the scheme. Keeping the established model as background recall does not make it the answer.

## New-problem scan and validation

No new substantive biology, count, handling or scope defect was found in the changed text. The glucose transport route stays separate from ligand binding. Its uptake-frequency difference is labelled a qualitative schematic; it supplies no measured rate and does not claim to explain transporter insertion or intracellular insulin signalling. Fusion explicitly preserves membrane separation of cytoplasm from extracellular fluid. No apparatus, assay sample, contact timer or numerical reading is introduced.

The revised close is information-dense but has a staged reveal and retains diagrams; there is no text-only frame. The optional adjacent S21 row is already small, un-narrated and labelled adjacent. Production must preserve legibility, but a new content cut is not required. Mechanism motion, objective pictograms and familiar-model recap remain intact.

Literal validator rerun: **805 words, 98 cues, nine beats, zero failing beats**; maximum gap **18 words**. Beat totals are **83, 55, 88, 77, 96, 89, 142, 73, 102**. The changed uptake, E44 illustration and close cues were also read for semantic order; no stale deleted narration cue was found. Cue validity alone is not a guarantee of final motion quality.

**Runtime accepted:** 805 / 2 = 402.5 seconds of effective narrated pacing, plus four seconds of explicit reading = **6:46.5**, 13.5 seconds below 7:00. Teaching is **663 words = 5:31.5**; E44 is **142 / 2 + 4 = 75 seconds**. Its five moves remain present. The final two-second settling hold is included by the revised declared convention; if made additional in the edit, the total is **6:48.5**, also acceptable. Verify actual audio and holds once produced.

No remaining mandatory replacement wording. No storyboard, source input or shared model was edited by this review.

CLEARED
