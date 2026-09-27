# CHECK — 4.2.5 — round 3

**All round-2 items are fixed. No further replacement wording is required.**

Reviewed 27 September 2026 at `224cca1b`, following `/home/dachu/cloud-briefs/check-006-r3-template.md`. Read the complete current STORYBOARD.md, own round-2 CHECK and `work/006/FIXES-round-2.md`; inspected the source diff and independently re-ran the validator. Source SHA-256: `11d9114b0a4c3109757c1f35bff1cde5f4e0c30d861a446b751a259709672b39`.

The baseline at `e3e3ebd1` hashes to `9358ca301f62994921361201a8db440e027a64026ac4e63e7545c9b5030b7d88`, exactly the source recorded in my round-2 report. This establishes that the compared changes are the repairs to that reviewed version.

## Every round-2 item

| Round-2 item | Status | Evidence in current storyboard |
|---|---|---|
| Minor edit 1 — spoken chronology | FIXED | Beat 6 opens **First, the solutions.** The cue *the solutions* is unchanged and still exact. Beat 6 retains *earlier: made up before the tissue was cut*, so the narrated preparation is explicitly a replay of the earlier setup. |
| Minor edit 1 — remove production bookkeeping from the tag | FIXED | Beat 5 action 1 and its on-screen-text listing both say **solutions prepared before cutting · reaching room temperature**. The Beat 6 cross-reference is gone from the teaching frame. |
| Minor edit 2 — final runtime statement | FIXED | Current Length, honestly text adopts the requested wording: 1,387 words = 11:33.5; E48's four-second read gives 11:37.5; separate two-second final hold gives **11:39.5**, 24.5 seconds over 11:15. It explicitly accepts the overrun and preserves E48. |
| Minor edit 2 — Beat 14 window and ledger | FIXED | Heading ends **11:40** rounded. Beat 14 table entry is 53.5 s narration + 2.0 s hold = 55.5 s, explicitly including the separately scheduled final hold. Total row also includes 11:39.5. No blanket silence allowance is added. |
| Runtime acceptance and no further cuts | FIXED | E48 remains 142 words, 71 s speech + 4 s reading = 75 s; teaching remains 1,245 words = 10:22.5. Useful sign/unit, temperature and explanatory lines remain. Total exactly matches the accepted round-2 11:39.5. |
| Previously cleared handling findings | FIXED / retained | Borer stops at tile; supporting fingers stay clear; borer lifts before core expulsion. Solutions precede cutting. Covered humid storage is out of contact with liquid water; each cylinder is blotted, weighed and immediately immersed. Eighteen individual vessels and own first-contact times remain. |
| Previously cleared measurement/estimate findings | FIXED / retained | Balance is labelled resolution 0.01 g with uncertainty caveat. +0.1% is a calculated mean; fitted crossing at approximately 0.398 is read as 0.40, labelled construction, not observation. Supplied lookup gives an estimate of approximately −1120 kPa under stated conditions. |
| Previously cleared biology, sample and scope findings | FIXED / retained | Starch grains remain inside plastid outlines; potato contents, fit and interferences remain explained. Turgid inset reaches no-net-flow equilibrium; plasmolysis is not claimed for the potato cylinders. |
| Previously cleared E48 and citation findings | FIXED / retained | Both written faults, anchored read, causal explanation and in-place repairs remain; marker persists through the second repair. The warning is paper-wide and applied to an authored plan. Lookup provenance covers both W20/51 methods; the −860 kPa density-drop answer remains separate. Resolved and open evidence items retain their proper boundaries. |

## Changed-text regression and evidence audit

The only narration change from the reviewed round-2 source is **Next → First** in Beat 6. Other edits adjust the two preparation tags, final heading/runtime bookkeeping and append the response record. Dataset and Citations sections are byte-for-byte unchanged. No new Cambridge quotation, question demand, numerical reading or biological claim has been introduced, so no new original-PDF quotation verification is triggered. The round-1 original-source audit and round-2 recheck of W20/51 Table 1.1 remain applicable; no fresh PDF audit is claimed here.

The updated chronology agrees with the handling/state order. All eighteen cylinders retain sixty minutes from their own first contact, on one continuously running clock. The final hold remains on the completed estimate/contrast frame. Revised timing does not alter any osmotic state, count or result. Illustrative masses, calculations and supplied values remain distinguished; the fitted estimate is not presented as a new observation. Objectives and recap/close retain visible apparatus/models, and the real-world sample explanation is preserved. No new biology, animation-state, handling, text-only-frame or real-world-rule problem was found.

## Independent validation

`python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.5/STORYBOARD.md`

**14 beats; 1,387 words; 155 cues; maximum cue gap 24 words; 0 failing beats.** No missing-section, forbidden-narration or citation-tag failures. Per-beat words: **95, 52, 124, 99, 125, 93, 97, 91, 142, 86, 96, 101, 79, 107**.

Independent runtime arithmetic: 1,387 ÷ 2 + 4 + 2 = **699.5 s = 11:39.5**. The two requested repairs are complete. Only this CHECK was written for this code; storyboard unchanged. Measured audio and rendered handling remain build checks.

CLEARED
