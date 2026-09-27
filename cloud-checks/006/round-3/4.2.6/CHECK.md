# CHECK — 4.2.6 — round 3

**All three round-2 minor edits are fixed. No further replacement wording is required.**

Reviewed 27 September 2026 at `224cca1b`, following `/home/dachu/cloud-briefs/check-006-r3-template.md`. Read the complete current STORYBOARD.md, own round-2 CHECK and `work/006/FIXES-round-2.md`; inspected the source diff and independently re-ran the validator. Source SHA-256: `eb3fc9a3aa1846324ff0ed66ad64b93c8a0dfa939f1c08b7f9cd22ebc3b393d9`.

The baseline at `e3e3ebd1` hashes to `2f1a8c6f993b4eed3f4857326f6ab8ee0c977892fa8f2e06fb37a02ea5081026`, exactly my round-2 report's source. The diff therefore traces the repairs to the reviewed version.

## Every round-2 item

| Round-2 item | Status | Evidence in current storyboard |
|---|---|---|
| Minor edit 1 — explicit hold contract | FIXED | Beat-section introduction adopts the replacement verbatim: 1.5 s after Beat 9 narration on the labelled plasmolysis gap; 2 s on Beat 11's final frame; recap highlights/settling otherwise within allocated time; holds anchored to cells/labels. The conflicting no-hold claim is gone. |
| Minor edit 1 — total runtime | FIXED | Current Length, honestly statement explicitly adds 1.5 + 2 s to 9:28 narration, giving **9:31.5**, 1:16.5 over 8:15. It records the accepted overrun with no deleted case or sample explanation and no accelerated narration. |
| Minor edit 1 — downstream windows | FIXED | Beat 9 **6:55.5–7:48.5**, Beat 10 **7:48.5–8:38.0**, Beat 11 **8:38.0–9:31.5**. These include the two holds exactly where requested. Earlier rounded headings remain provisional as the round-2 ruling expressly allowed. The table remains clearly the narration ledger. |
| Minor edit 2 — state-table heading | FIXED | Heading now reads **Label (initial condition and current state, as applicable)**. Canonical `plant-turgid` and compatibility alias still say **water potentials now equal**, with balanced crossings and no net arrow. |
| Minor edit 3 — interpretation 10 | FIXED | Replaced verbatim with the current outline-comparison explanation: sourced micrograph only with source/preparation identified; otherwise explicitly labelled drawn light-microscope view; neither measures water potential. Obsolete quoted narration is removed. |
| Previously cleared equilibrium and shared-state findings | FIXED / retained | Local uptake transition remains distinct from canonical turgid endpoint. Counts converge 15/5 → 13/7 → 11/9 → 10/10 per window; net 10 → 6 → 2 → 0. Beat 8 equality cue synchronises markers, balanced counts and zero arrow. Replay is inset-only while main endpoint remains at equilibrium. Alias has identical geometry/flux/labels; 4.2.5's imported turgid endpoint remains compatible. |
| Previously cleared haemolysis and arrow findings | FIXED / retained | Global contract removes net arrow, crossing counter and closed-cell comparison at rupture; Beat 5 explicitly removes the arrow/counter. Hook/close attach past entry to the swelling thumbnail and restored turgor to the completed lettuce inset, without ongoing net entry at equilibrium. |
| Previously cleared objective and board findings | FIXED / retained | All three objectives pictograms visible on entry; six-cell board retained in recap/close; all three plant walls highlighted. Lower-column plasmolysis remains conditional on sufficient further water loss. |
| Previously cleared real-world sample findings | FIXED / retained | Red-cell water/salts/haemoglobin and outline-comparison limit remain spoken. Saline composition and matched conditions remain bounded to the example. Lettuce includes cell-sap composition, intact-cell limitation and firmness-not-water-potential limit; unnumbered first-contact time graphic, no recorded experiment or measured duration claimed. |
| Previously cleared scope/citations/runtime findings | FIXED / retained | Exam absence claim stays limited to cited question parts, not the archive. Five-mark phloem answer is not five osmosis marks; red-pepper intercept is not the density-drop numerical answer. Requested cuts 1/3/4/6 and retention of 2/5 remain; all six cases and wall-resistance sentence survive. No extra error beat or component-potential teaching introduced. |

## Changed-text regression and evidence audit

Narration, Datasets and Citations are unchanged from the independently identified round-2 baseline. Changes are the hold contract and downstream timings, the state-table heading, interpretation 10, validator-run status and response record. No new Cambridge quotation is introduced; no additional original-PDF quotation audit is triggered. Existing syllabus wording and adjacent W20/21 Q4(b)(ii) and W20/51 Q1(c)(ii) descriptions retain the earlier original-PDF audit; this report does not claim to have reopened those unchanged sources.

The current-state heading now agrees with the endpoint's biology. Adding post-narration holds does not move an equilibrium transition to a later spoken cue or restart uptake. The labelled plasmolysis gap remains external solution, not air. Counts and drawing proportions remain schematic instructions, not measured data; no water-potential estimate or number has been invented. Micrograph fallback wording matches Beat 5 and the real-world table. No new biology, animation-count/timing/state, handling, text-only-frame or real-world-rule problem was found in the changed text.

## Independent validation

`python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.6/STORYBOARD.md`

**11 beats; 1,136 words; 123 cues; maximum cue gap 25 words; 0 failing beats.** No missing-section, forbidden-narration or citation-tag failures. Per-beat words: **70, 53, 107, 110, 110, 126, 149, 106, 103, 99, 103**.

Runtime arithmetic: 1,136 ÷ 2 + 1.5 + 2 = **571.5 s = 9:31.5**, exactly the accepted round-2 total. First eight beats sum to 415.5 s; Beat 9 adds 51.5 + 1.5 = 53 s, Beat 10 adds 49.5 s, and Beat 11 adds 51.5 + 2 = 53.5 s, confirming all three exact windows.

No remaining edits. Only this CHECK was written for this code; storyboard unchanged. Final measured audio and rendered state transitions remain build checks.

CLEARED
