# 4.2.6 — Independent storyboard check, round 2

**CLEARED WITH MINOR EDITS.** All round-1 must-fixes are implemented. The turgid endpoint now has equal water potentials and no net arrow; a ruptured red cell no longer carries intact-cell osmosis. Only hold accounting and two stale explanatory labels need tidying.

Reviewed 27 September 2026 against my local round-1 CHECK, the complete revised STORYBOARD.md, `work/006/FIXES-round-1.md`, shared state definitions and the relevant 4.2.2b/4.2.5 consumer references. Re-ran the supplied validator. This is a storyboard check; no render or recorded audio is certified. Source SHA-256: `2f1a8c6f993b4eed3f4857326f6ab8ee0c977892fa8f2e06fb37a02ea5081026`.

## Every round-1 item

| Round-1 item | Status | Evidence in the revised storyboard |
|---|---|---|
| M1: canonical turgid endpoint vs uptake transition | **FIXED** | State table separates lesson-local `plant-taking-up-water` from canonical `plant-turgid`. Beat 7 says “more turgid” and retains diminishing uptake; Beat 8 begins in that transition. The endpoint has equal potentials, balanced crossings and no net arrow. |
| M1: downstream compatibility | **FIXED** | `plant-turgid-equilibrium` is explicitly an alias with identical geometry, flux and labels. 4.2.5's `plant-turgid` import and 4.2.2b's equilibrium alias now mean the same endpoint; no consumer needs a new transition ID. |
| M1: counter sequence and equality timing | **FIXED** | Equalise contract and dataset both give window counts 15/5 → 13/7 → 11/9 → 10/10, net 10 → 6 → 2 → 0. Counts are per model-time window, not cumulative. Beat 8 action 4 makes markers meet, counts balance and arrow reach zero at the equality cue. Action 5 uses a labelled replay inset while the main endpoint stays at zero. |
| M2: no membrane-crossing osmosis after haemolysis | **FIXED** | Hook's post-burst magnifier and its 19-word sentence are removed. Global contract restricts osmosis to intact states and removes counter, arrow and closed-cell potential comparison at rupture. Beat 5 action 7 repeats the removal explicitly. |
| M2: hook, board and closing arrows | **FIXED** | “Water entered before haemolysis” belongs to the swelling thumbnail, not the burst ghost. Completed lettuce inset uses “water uptake restored turgor”, with no continuing net-in arrow. Board retains pure-water qualification. |
| M3: objectives visible at entry | **FIXED** | All three authored pictograms are present from the first frame; existing cues reveal text and brighten the corresponding icon. Objectives remain on their own surface. |
| M4: red-cell contents, readout and limits | **FIXED** | Beat 5 speaks water, dissolved salts and haemoglobin; compares outline without claiming to measure water potential. Contents remain labelled during dispersal. Optional sourced micrograph has a clearly labelled drawn fallback. |
| M4: saline composition and example | **FIXED** | Beat 6 speaks sodium chloride dissolved in water and limits the example to matched conditions/steady cell volume. Simple labelled vessel replaces the clinical bag; saline is in the real-world table. |
| M4: lettuce composition and fitness caveat | **FIXED** | Beat 7 speaks living cells, cell-sap solutes, restored turgor, intact-cell limitation and lack of a water-potential measurement. The fixer correctly preserved the wall-resistance sentence while replacing the two lettuce sentences. My round-1 “final three sentences” instruction was overbroad; this interpretation fulfils its intended repair. |
| M4: illustrative status | **FIXED** | Real-world section now says the lettuce handling is illustrated, not a recorded experiment. No measured duration or water potential is introduced. |
| M5: bounded exam-evidence claim | **FIXED** | Beat 11 says “None of the cited question parts in the five-paper Paper 2 sample…” and retains the matching on-screen cited-block qualifier. The close is syllabus-based, not an archive-wide absence claim. |
| SF1: plant-only plasmolysis wording | **FIXED** | Author cut 6 removes the overexclusive sentence. Local no-wall/crenation contrast remains beside the models. |
| SF2: state count and consumer list | **FIXED** | Eight shared states, local equality/compatibility states and the separate local transition are distinguished. 4.2.5 consumer list is exactly `plant-turgid`, `plant-equal`, `plant-flaccid`. |
| SF3: recap wall count | **FIXED** | Beat 10 action 6 highlights **all three plant-row walls**. |
| SF4: lower-potential outcome conditional | **FIXED** | Board, Beat 9 endpoint and Beat 10 recap say **with sufficient further water loss: plasmolysed**. “With further loss” narration is retained. |
| SF5: no invented lettuce timing | **FIXED** | Unnumbered time-passing graphic starts at first contact; “time compressed; our example; nothing measured” remains. No elapsed-minute claim. |
| Runtime: cuts 1, 3, 4 and 6; retain cuts 2 and 5 | **FIXED** | Specified 47-word cuts applied. Useful recap and starting-cell context remain. Required composition/fit/scope replacements produce the independently confirmed 1,136-word total. |
| Runtime: ledger and beat windows | **PARTLY** | Narration ledger is correct. The new 1.5-second post-narration settle in Beat 9 and two-second final hold are not counted; the general no-hold statement also conflicts. Exact correction below. |
| Citation audit and UNVERIFIED items | **FIXED** | Original-PDF findings resolve items 2–3; descriptions remain paraphrases. Item 1 is bounded to the cited set. Optional micrograph and qualitative lettuce source are not falsely claimed verified. |
| Numerical, biology and scope findings | **FIXED / retained** | Net-count arithmetic and the equalisation sequence agree. Marker positions and morphology percentages remain drawing instructions, not measured data. Six cases, equal ≠ necessarily flaccid, no component-potential teaching, and the external-solution-filled plasmolysis gap are preserved. |

## Remaining minor edits — exact wording

### 1. Schedule the explicit holds

Replace the beat-section sentence **“No beat has a silent hold except the recap's settle, which is anchored by the fade-ins.”** with:

> The narration ledger excludes two separately scheduled holds: 1.5 seconds after Beat 9's narration on the labelled plasmolysis gap, and 2 seconds on Beat 11's final frame. Recap highlights and settling otherwise occur within its allocated beat time. All holds remain anchored to the displayed cells and labels.

Replace the final runtime statement with:

> Narration: 1,136 words at 120 wpm = 9:28.0. Add Beat 9's 1.5-second settle and Beat 11's two-second final hold: total 9:31.5, 1:16.5 over the 8:15 budget. This overrun is accepted. No case or required sample explanation is cut, and narration is not accelerated.

For exact downstream windows, use **Beat 9 6:55.5–7:48.5**, **Beat 10 7:48.5–8:38.0**, **Beat 11 8:38.0–9:31.5**. The last window includes its final hold. Earlier rounded headings may remain provisional until measured audio; preserve the exact ledger.

### 2. Make the state-table heading fit current-state labels

Replace **“Label (always the initial comparison)”** with:

> Label (initial condition and current state, as applicable)

The canonical endpoint correctly says **water potentials now equal**. Do not change that label back to an initial higher-potential description merely to satisfy the stale table heading.

### 3. Remove the stale quotation in interpretation 10

Replace interpretation 10 with:

> **Micrograph.** The plan permits an optional sourced micrograph. Beat 5 compares cell outlines in a labelled inset: use a micrograph only with its source and preparation identified; otherwise use the explicitly labelled drawn model of a light-microscope view. Neither option is a measurement of water potential.

The current paragraph cites an older narration sentence that no longer appears in Beat 5. This is bookkeeping; the operative beat already has the correct fallback.

## Changed-text and evidence audit

No new QP/MS/ER quotation is introduced. The existing full syllabus outcome and shortened syllabus quotation are unchanged; the two adjacent exam descriptions remain the round-1-verified W20/21 Q4(b)(ii), QP p11/MS p10, and W20/51 Q1(c)(ii), QP p5/MS p9. Their new status notes accurately carry forward those findings. The new real-sample wording is teaching text, not attributed to Cambridge. The five-mark phloem answer is still not represented as five osmosis marks, and the red-pepper sketch is not given the separate density-drop numerical answer.

The revised turgid state, alias, counter table, equality cue and replay agree. The uptake transition remains distinct from equilibrium; the main endpoint cannot restart net influx when its final approach is replayed. Red-cell rupture removes the intact-cell comparison instead of continuing osmosis through a ghost. No new material measurement is fabricated; the lettuce example has no numbered clock and the saline example has no concentration or treatment claim.

The retained wall-resistance sentence is necessary to the plant/animal comparison and is correctly preserved. Narrated contents and limitations now satisfy the real-world rule without adding a new procedure. Prepared micrographs remain optional here, with an honest schematic alternative; this is not an unresolved mandatory specimen requirement. Objectives have real pictograms from entry, and the recap/close remain anchored to the six-cell board. No new substantive biological or visual blocker was found.

## Independent validator and runtime ruling

Command: `python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.6/STORYBOARD.md`.

**1,136 words; 123 cues; 11 beats; maximum cue gap 25 words; 0 failing beats.** No missing-section, forbidden-narration or citation-tag failures. Per-beat words: **70, 53, 107, 110, 110, 126, 149, 106, 103, 99, 103**. No error beat is required or added.

Accept **9:31.5 with both explicit holds**, under the round-1 allowance for the six comparisons, equilibrium explanation and sample/fit additions. This is 76.5 seconds above 8:15. All remaining edits are non-narrated, so the validator word count is unchanged. Final audio and rendered frames must honour the specified state changes and timing; a passing text validator alone does not certify them.

Only this round-2 CHECK was written for this code; storyboard source unchanged.

CLEARED WITH MINOR EDITS
