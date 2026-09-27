# Round 2 — 5.1.3 — CLEARED WITH MINOR EDITS

Checked 27 September 2026. Read the round-one CHECK, revised storyboard and response table, FIXES-round-1, and the diff against `60fae0e` (the round-one version). Main corrections pass. One newly introduced inset-counter detail needs an explicit state rule.

HEAD: `ac5d63c3e8af44cfefce2584edd88a926925a4da`.
Storyboard SHA-256: `90b9dc8a5d42a982b84ff96c8e02e0bfb4825678e3bb5d17d33474ea6f6b335a`.

## Round-one disposition

| Item | Status | Evidence |
|---|---|---|
| M1 — S completion and counters | FIXED | Beat 5 replaces DNA counts by “replication in progress”, then completes the inset, trace and inset/model/human values together at “By the end of the S phase”. Later cues only pulse values. No rolling intermediate counts. |
| M1 — separation and nucleus counts | FIXED for the original whole-cell strip | Beat 7 action 3 changes whole-cell counts to 8/8 (human 92/92) on centromere division. New-nucleus rows 4/4 (46/46) appear as nuclei form. Whole-cell counts stay doubled through telophase. New inset counter needs the minor completion below. |
| M1 — cytokinesis and graph | FIXED | Beat 8 action 3 completes division, drops DNA per cell 2 → 1 and changes to daughter-cell counts on one frame. “Only now…” highlights that completed event. Contract propagated into model and reuse descriptions. |
| M2 — “nothing halved” closing claim | FIXED | Beat 14 now says each daughter receives a full genetic set; its actions retain the graph drop. Absolutes ledger explicitly distinguishes full genetic information from half the pre-division DNA mass. |
| S1 — objectives entry | FIXED | Beat 2 places the circular-arrow pictogram on the first frame before its text cue. |
| S2 — one chromosome versus whole cell | FIXED | Persistent “one chromosome followed; whole model cell 2n = 4” caption and separately named inset counter are present. See minor state rule below. |
| S3 — nuclear denominator and replay | FIXED | Axis is DNA mass per nucleus / arbitrary units; open mitosis has hatching and no trace. Reverse-order envelope replay is labelled “earlier in mitosis”. Envelope fades during condensation and is gone before spindle attachment. |
| S4 — evidence labels | FIXED | Resolved items are recorded with round-one provenance; authored framings stay authored. Beat 12 model-answer note correctly states supported points and maximum two marks; the original “suggest” command is noted. |
| Runtime/recount | FIXED | 1,071 words and revised closing cues/windows; both errors unchanged. Accept the extra four seconds caused by the required repair. |
| Quote-check reproducibility | FIXED | Updated checker reads locally available input-branch sources and now reproduces successfully. All required refs were checked before running; no fetch was needed. |

Applicable plan-check corrections reviewed in round one remain present: progressive S replication, chromosome separation within M, compartment counts, local ATP ignore ruling, full ATP answer and overlap qualification. Practical/image requirements for other lessons are outside this review.

## Minor edit — finish the newly added inset counter

The new counter is explicitly “this chromosome: chromosomes · DNA molecules”, and Beat 5 sets it to 1 chromosome/2 DNA molecules. Beat 7 updates the whole-cell strip and mentions holding the inset’s DNA count at two, but does not explicitly update its chromosome count or its scope after the two daughter chromosomes form. Avoid a stale 1/2 inset beside two separated chromosomes.

Add this exact rule to the inset-counter specification and Beats 7–8:

> At centromere division, change the inset counter on the same frame to “tracked pair: 2 daughter chromosomes · 2 DNA molecules in total; 1 DNA molecule per daughter chromosome”. Keep that scope while both descendants are shown. When the view follows one daughter cell at the end of cytokinesis, change it to “tracked chromosome in this daughter cell: 1 chromosome · 1 DNA molecule”. Use the persistent caption “one original chromosome and its descendants followed; whole model cell 2n = 4”. These inset counts are separate from the whole-cell and each-new-nucleus rows.

This completes the new local display; it does not reopen the repaired whole-cell event timings or require new narration.

## Evidence and regression audit

Re-extracted `/home/dachu/sme-9700-archive/pastpapers/2020/November/9700_w20_qp_21.pdf`, p2: **“Suggest the role of ATP in the process of mitosis.”** is exact. The newly recorded original command is accurate; the retained Describe header remains clearly authored. Unchanged exam sources retain the independent round-one PDF audit; no new tariff or reject claim was introduced.

The revised 4/4 → 4/8 → whole-cell 8/8 → each nucleus 4/4 → each daughter cell 4/4 sequence is sound. DNA is unchanged by sister separation. Slope, units and cycle proportions remain schematic. No fabricated measurement, practical handling, text-only objective frame or unlabelled real-world exam addition was introduced. No lesson render/audio was available; semantic cue review is of the storyboard contract.

Fresh validator: **14 beats, 1,071 words, 142 cues, maximum gap 21 words, zero failing beats; 8:55.5**. `check_quotes.py`: **6 checked, 0 not found**. Source matching is supplementary to direct PDF verification, not a replacement for it.

Accept **8:55.5**, 25.5 seconds over 8:30. E5-01 remains 146 words/106-word talk-through (73 seconds effective); E5-02 149/108 (74.5 seconds). Both preserve announcement, written error, four-second read, explanation and in-place correction with EXAM CONTRAST badges through completion. Reads belong inside the effective runtime; verify actual audio and final hold at build without counting silence twice. No compulsory cuts.

Only this CHECK written for this code; storyboard unchanged. No commit, push or deployment.

CLEARED WITH MINOR EDITS
