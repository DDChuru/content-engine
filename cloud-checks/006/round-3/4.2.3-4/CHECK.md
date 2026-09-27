# 4.2.3-4 — round-three check

Reviewed 27 September 2026 at `224cca1b`, against my complete round-two report, the current storyboard, `work/006/FIXES-round-2.md` and the actual diff from `e3e3ebd1`. Current storyboard SHA-256: `2db458bac83ae8b1e20222de6f9d8ee6ec60b2ce498690ba6091d1de7cb97dfd`; baseline SHA-256 matches the round-two report: `ac37f06bbd8db49aec401891d413b91aef954cfa51010193b2a1f0bc10505f9c`.

The sole remaining round-two content edit is implemented exactly. No outstanding replacement remains.

## Every round-two item

| Round-two item | Status | Current evidence |
|---|---|---|
| S2 — indicator sentence, formerly PARTLY | FIXED | Beat 7 now says exactly: **Thymolphthalein responds to pH: it is blue in this alkaline agar, and colourless once enough acid has diffused in to lower the pH below its transition range.** The previous complete-neutralisation wording is absent from narration. |
| S2 — cues and screen alignment | FIXED | Both original cues remain exact and ordered, and the corrected spoken sentence agrees with the existing transition-range label and real-world table. Beat 7 remains at 13 cues and maximum gap 15 words. |
| S2 — ledger, source note and CHECK RESPONSE | FIXED | Beat 7 is 118 words / 59 s; total 1357 / 678.5 s. Updated typicality, absolutes and citation 11 explain the transition rather than pH 7. New round-two response records completion; the earlier round-one response is retained as history. |
| Preserve ongoing-neutralisation wording | FIXED | Beats 10/12 retain **as alkali is neutralised**, as requested. This describes a process and does not assert complete neutralisation at colourlessness. |
| Runtime ruling / final hold | FIXED | Updated ledger states **11:18.5**, accepted against 9:45. Final two-second hold is within that allowance, or must be separately declared if added by the editor. Provisional headings remain subject to the authoritative ledger and measured audio, as permitted in round two. |
| M1 — graph order | FIXED | Beat 13 still highlights (12,70) → (6,260) → (3,1016), right to left, separately from paper A/B/C sizes 1/2/3 cm. |
| M1 — recap endpoint states | FIXED | Completed cubes stay colourless with stopped endpoint clocks; blue belongs only to the separately labelled earlier-exposure snapshot. |
| M1 — glucose route | FIXED | Beat 6 retains the labelled transport-protein route, without a new carrier cycle or energy claim. |
| M2 — temperature control | FIXED | Thermometer and per-run record field remain; the illustrative field is blank. Same-temperature preparation of fresh acid is retained. |
| M3 — working-solution evidence | FIXED | Protocol-specific working-concentration attribution, eye protection and splash-rinsing instructions are unchanged. |
| M3 — indicator stock | FIXED | Carl Roth 8152 reference formulation and its classification remain separate from finished agar and the syllabus materials-list codes. Actual bench stock/amount are still conditional production dependencies. |
| M4 — closing contrast | FIXED | Authored wrong/correct card and provenance caption remain, with no invented examiner reject or error-beat badge. |
| M4 — exam callback | FIXED | Credited answers precede and remain visible through the spoken beyond-scheme callback and its labelled panel. |
| S1 — different face-contact moments | FIXED | First lower-face contact starts the clock; sides/top meet acid during immersion. No simultaneous all-face start was reintroduced. |
| S3 — inventory versus concentration | FIXED | Dataset 4 retains 125-fold stoichiometric excess and 0.8% inventory consumption, explicitly not a measured external concentration. |
| S4 — whole-cube area per volume | FIXED | Whole outer surface and whole volume remain the compared quantities; no internal subcube is assigned exposed faces. |
| S5 — objective entry | FIXED | All three objective pictograms remain visible from the first frame. |
| S6 — cuboid coverage | FIXED | Generic formula and three face pairs remain; redundant numerical substitution stays cut. No extra numerical example is required. |
| Citation audit — apparatus pages | FIXED | Beakers p56 and other apparatus p57 remain distinguished. |
| Citation audit — exam sources | FIXED | S21/22 values, sizes, order and tariffs remain verified descriptions, with the authored practical's different sizes/baths disclosed. |
| Citation audit — residual dependencies | FIXED | Times remain illustrative, not bench-tested observations; actual stock/recipe remains separate from reference evidence. |
| Runtime — four required cuts | FIXED | The 40-word cuts remain; protected units teaching remains. No cut was undone to implement S2. |
| Runtime — honest remaining overrun | FIXED | 1378 − 40 + 15 + 4 = **1357**; geometry half 586 words plus practical half 771 words agrees with the total. |

## Fresh validation and regression audit

`python3 -B work/006/validate_storyboard.py storyboards/topic-04/4.2.3-4/STORYBOARD.md` passes: **1357 words, 154 cues, 13 beats, 0 failing beats**, maximum gap **23 words**, no missing-section/citation warnings. Per-beat words: **87, 56, 101, 113, 122, 107, 118, 91, 108, 135, 99, 96, 124**. The four-word correction costs two effective seconds, exactly as predicted in round two. Accept **11:18.5**, with the prior content-led overrun ruling unchanged; no further cut or acceleration is needed.

The actual diff contains only the required indicator sentence and its supporting documentation/count updates. No new Cambridge quotation was added: the newly quoted text in the CHECK RESPONSE is the checker's authored replacement. S21/22 QP p9 / MS p14 remain unchanged from the direct round-two PDF audit. The indicator-property explanation implements the already directly verified Thermo Fisher B23896 specification cited there; it introduces no new numerical transition claim, instrument reading or chemical mechanism.

The blue → paler blue → colourless model now agrees with both narration and labels. Its visible boundary remains an indicator transition, not the first-acid-molecule front; the earlier endpoint is not represented as faster molecular diffusion. Illustrative times, calculated means and SA:V values retain their labels. Geometry, right-to-left finishing order, first-contact clocks, immersion sequence, fresh baths, handling, objectives and exam-panel order have not regressed.

The reused `DiffusionField` owner has received counter-window corrections, but this lesson's expressly counter-free open-boundary inset does not import those counted demonstrations. Its random-motion/net-inward account and the explicit omission of neutralisation remain unchanged. `work/006/SHARED-SPECS.md` is unchanged from the baseline. No new incompatible equilibrium state, particle-count demand, measured-looking estimate, text-only frame or real-world-rule failure was found.

No replacement wording is required. Clearance is for the written storyboard; actual bench stock/times, measured audio and rendered handling/colour still require their stated production checks if used. Only this report was written; no storyboard was edited or committed.

CLEARED
