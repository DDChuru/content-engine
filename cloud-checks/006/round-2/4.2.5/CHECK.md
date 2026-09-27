# 4.2.5 — Independent storyboard check, round 2

**CLEARED WITH MINOR EDITS.** All round-1 biological, handling and evidence must-fixes are implemented. The remaining edits make the preparation chronology explicit in speech and include the specified final hold in the runtime ledger. No dataset redesign or error-beat cut is required.

Reviewed 27 September 2026 against my local round-1 CHECK, the complete revised STORYBOARD.md and `work/006/FIXES-round-1.md`. Re-ran the supplied validator and checked the revised instructions against the shared models. This is storyboard clearance, not certification of rendered frames or recorded audio. Source SHA-256: `9358ca301f62994921361201a8db440e027a64026ac4e63e7545c9b5030b7d88`.

## Every round-1 item

| Round-1 item | Status | Evidence in the revised storyboard |
|---|---|---|
| M1: borer stops at the tile | **FIXED** | Model Handling/Boring, Beat 5 narration/action 3 and Assets all stop the edge at the tile surface, keep fingers clear, and lift the borer before expelling the core. No penetration of the tile is instructed. |
| M1: protect waiting tissue | **FIXED** | New covered humid container has labelled positions on a dry grid above damp lining. Order/storage contract, `cut`/`load` states, Beats 5 and 7, Dataset 2 and interpretation 2 require covered storage until blot/weigh/immediate immersion. Initial weighing is no longer claimed to prevent drying. Eighteen vessels and staggered first-contact starts remain. |
| M1: solutions before cutting; remap cues | **FIXED** | Run order is `bench → make-up → cut → load → wait → unload`. Beat 5 shows prepared racks; Beat 6 explicitly replays the earlier preparation. Changed cues pass. “Next” in the spoken explanation is a minor clarity issue, addressed below; it does not override the corrected handling contract. |
| M2: balance resolution, not unestablished accuracy | **FIXED** | Apparatus, Beat 7 and recap labels say **resolution 0.01 g**. Dataset 2 contains the requested one-display-step/uncertainty caveat. Remaining ±0.01 g refers to positive/negative illustrative mass changes, not balance accuracy. |
| M3: calculated mean vs fitted zero crossing | **FIXED** | Beat 11 and Dataset 3 call the +0.1% value a calculated mean. The zero crossing remains a construction at approximately 0.398, read as 0.40 on the grid, not a seventh observation. |
| M3: final wording contrast and estimate | **FIXED** | Beat 14 action 5 uses the requested authored ✗/✓ contrast, “fitted”, “about” and “estimates … under these conditions”. Graph and lookup stay visible; the corrected card remains on the final frame. No Cambridge reject line is invented. |
| M3: universal measurement claim | **FIXED** | Causal-spine opening now describes this investigation's estimate rather than claiming intracellular water potential cannot be measured directly. |
| Should-fix 1: table provenance | **FIXED** | Lookup model, Beat 12, Dataset 4 and citations identify Table 1.1 as covering both methods, with red-pepper context separate from the authored potato data. Original QP p7 rechecked this round. |
| Should-fix 2: starch location | **FIXED** | Each starch grain sits inside a small plastid outline; only “insoluble starch grains” is labelled. No extra organelle lesson. |
| Should-fix 3: production instruction in E48 speech | **FIXED** | “Now look at the second line: it uses the same word” replaces the spoken marker instruction. The visual marker still remains until the second repair; cues remapped. The fixer correctly notes this is 11 words replacing 11 under the supplied validator; my round-1 parenthetical 12-for-12 count was mistaken. |
| Should-fix 4: temperature | **FIXED** | Solutions equilibrate to room temperature; racks stay together away from local heat/sun; checks are recorded during the run. Beat 7 explicitly says a single air reading does not prove constant solution temperature. No new numerical temperature series is fabricated. |
| Should-fix 5: specificity, not impossibility of repetition | **FIXED** | E48 now says “the quantity to standardise is unclear”; retains the paper-local boundary on “amount”. Recounted to 142 words. |
| Runtime: take author cut 1, preserve E48 and useful lead-ins | **FIXED** | The 22-word March-paper sentence is removed from Beat 14. Its two reference rows remain subordinate and unspoken; obsolete cues removed. Other requested narration is preserved. |
| Runtime: revised ledger/windows | **PARTLY** | Narration and E48 read are correctly recounted and beat windows updated. The explicitly specified final two-second hold is absent from the total; minor correction below. |
| Citation audit: resolve UNVERIFIED 1–4; preserve boundaries of 5–7 | **FIXED** | Items 1–4 record the original-PDF findings while retaining paraphrase labels. Item 5 remains unassigned to a particular question; 6 is a qualitative illustration, 7 an unspoken density assumption. Neither is mislabelled as exam evidence. |
| Numerical audit, scope, real-world sample and shared-model findings | **FIXED / retained** | Validated dataset, dilution, fit, lookup and timing are retained. Sample composition/fit/interference explanation remains. Imported `plant-turgid` now agrees with 4.2.6's repaired no-net-flow endpoint. Plasmolysis is still not claimed for the potato cylinders. |

## Remaining minor edits — exact wording

### 1. Remove chronological ambiguity in Beat 6

The visual replay already establishes the correct order. Make the opening narration equally explicit by replacing **“Next, the solutions.”** with:

> First, the solutions.

This is word-neutral and keeps the exact cue *the solutions*. Replace the Beat 5 on-screen tag **“solutions prepared before cutting (made up: Beat 6) · reaching room temperature”**, including its on-screen-text listing, with:

> solutions prepared before cutting · reaching room temperature

The beat-number reference is production bookkeeping and need not appear in the teaching frame. Keep the Beat 6 caption identifying the earlier setup.

### 2. Account for the final hold

Replace the final-runtime statement with:

> Narration: 1,387 words at 120 wpm = 11:33.5. E48's four-second silent read gives 11:37.5. The separately scheduled two-second final hold gives 11:39.5 total, 24.5 seconds over the 11:15 budget. E48 remains 75 seconds complete. This overrun is accepted; no additional cut or faster delivery is required.

Update Beat 14's displayed end time to **11:40** (rounded) and append **“including the separately scheduled 2 s final hold”** to that beat's runtime entry. Do not add a second blanket silence allowance.

## Changed-text and evidence audit

No new Cambridge quotation has been introduced. The new final contrast is explicitly authored, while the R24 and M24 quotation strings remain those verified in round 1. The revised source claim about Table 1.1 was independently confirmed using `pdftotext -f 7 -l 7 -layout` on `/home/dachu/sme-9700-archive/pastpapers/2020/November/9700_w20_qp_51.pdf`: the table applies to both methods and retains all seven signed values. The separate −860 kPa density-drop answer is never substituted for the illustrative potato estimate of approximately −1120 kPa.

No new biology or numerical defect was found. The preparation replay is labelled, the covering instruction is physically possible, pours and removal order retain their existing contracts, and first-contact timing remains explicit. Resolution is not presented as uncertainty. The final card no longer presents the fitted result as an observed zero. Calculations remain off the balance display; the potato dataset remains labelled illustrative. Objectives and recap retain non-text visual anchors. The real-world potato explanation still includes contents, response, suitability and limitations.

E48 retains all five moves, two written faults, an anchored four-second read, causal discussion and in-place corrections. Both fixes remain visible and the marker stays through the final correction. No new error beat is warranted.

## Independent validator and runtime ruling

Command: `python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.5/STORYBOARD.md`.

**1,387 words; 155 cues; 14 beats; maximum cue gap 24 words; 0 failing beats.** No missing-section, forbidden-narration or citation-tag failures. Per-beat words: **95, 52, 124, 99, 125, 93, 97, 91, 142, 86, 96, 101, 79, 107**.

Teaching remains **1,245 words = 10:22.5**. E48 is **142 words = 71 s speech + 4 s read = 75 s**, at the allowed upper bound. Accept **11:39.5 including the final hold**, consistent with the round-1 ruling to preserve the complete investigation and its modest handling additions. The two minor edits above do not change narration word count.

Only this round-2 CHECK was written for this code; storyboard source unchanged. Rendered handling, final cue times and measured audio remain build checks.

CLEARED WITH MINOR EDITS
