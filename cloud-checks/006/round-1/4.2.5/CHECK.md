# 4.2.5 — Independent storyboard check, round 1

Reviewed 27 September 2026. **NOT CLEARED.** The investigation, osmosis direction, percentage calculations and supplied lookup are sound. Correct the literal handling instructions, instrument claim and final measured-versus-estimated wording before narration/build. The error beat passes; its wording and time are protected.

## Basis and method

Read the complete storyboard, the amended plan's 4.2.5 requirements and shared-model/coverage rules, weights and E48 evidence, SHARED-SPECS, SUMMARY, the complete governing VIDEO-STRUCTURE (including REAL-WORLD SAMPLES), and relevant verbatim syllabus material. Followed the supplied Topic 3 check's format. Ran the supplied validator and independently recalculated the dataset/fit. Extracted actual W20/51 and M24/52 QP/MS PDFs with `pdftotext -layout`; rendered and inspected W20/51 QP p.6 to verify the density-drop figure. Page numbers below are one-based PDF pages.

R24 is absent from the archive (its HTTP-header record is a failed download). Independently extracted pp.54–55 from the existing `/tmp/topic4-pdf-audit/9700-examiner-report-june2024.pdf`, whose official source is the [Cambridge June 2024 report](https://www.cambridgeinternational.org/Images/566822-june-2024-examiner-report.pdf). Its quoted quantity-specificity warning matches. No storyboard, plan or shared specification was edited; no lesson render or audio was inspected. Source storyboard SHA-256: `711aa619617987225c19944e3185d24899732893859ea00448fd4bd977781afb`.

## Must-fixes — exact replacements

### M1 — Stop the borer at the tile, and protect the waiting tissue

The model's Boring paragraph and Beat 5 explicitly drive the borer **into the tile**. The tile is the support, not material that the cutting edge penetrates. Replace Beat 5's second sentence with:

> Stand it on a white tile and push a ten-millimetre cork borer straight down through the flesh until it reaches the tile, then lift the borer and push the core out.

Replace the corresponding model and Beat 5 action 3 instruction with:

> Push the borer vertically through the flesh with a slight twist, stopping at the tile surface; do not animate the edge entering the tile. Keep the supporting fingers beside and clear of the cutting path. Lift the borer before using the push rod to expel the core onto the tile.

The existing `cut` state leaves all eighteen cylinders on the tile through solution preparation and seventeen minutes of loading. Plan interpretation 2's claim that immediate pre-immersion weighing means none dries while waiting is false. Weighing after exposure does not undo a changed initial tissue state. Add to the handling/state contract and Beats 5–7:

> Prepare the solutions before cutting the tissue. Keep the trimmed, allocated cylinders in labelled positions in a covered humid container, out of contact with liquid water, until each is blotted, weighed and immediately immersed. Open it only to take the next cylinder; keep the others covered. Record each cylinder's own start time at first contact.

Add the brief spoken line at the end of Beat 5, with the container appearing on its cue:

> Keep the cut cylinders covered to limit drying until you weigh and immerse each one.

Change interpretation 2 to: **“Covered storage limits pre-immersion drying; each cylinder is then blotted, weighed and immediately immersed. Initial weighing alone does not prevent drying.”** Retain the one-minute stagger and all eighteen vessels. Remap the changed boring cue and show the prepared racks as the earlier setup whose dilution is explained in Beat 6.

### M2 — Resolution is not an established ± accuracy

The specified balance reads to 0.01 g. Nothing supplies a manufacturer's accuracy/uncertainty specification, yet the apparatus, Beat 7 and recap label it `±0.01 g`. Replace **every** `balance, ±0.01 g` with **`balance: resolution 0.01 g`**, and the recap's `±0.01 g` tag with **`resolution 0.01 g`**.

Replace the Dataset 2 precision note with:

> A 0.01 g display step is about 0.4% of a 2.5 g initial mass. The ±0.01 g changes near the crossing are only one display step; resolution alone does not establish measurement uncertainty or prove a water gain or loss of that size.

Do not add error bars or statistics outside the planned scope. The two-decimal mass displays themselves are appropriate.

### M3 — Preserve the graph estimate on the final frame; restore the required wording contrast

Beat 11 correctly separates the +0.1% calculated mean at the tested 0.40 concentration from the fitted zero crossing near 0.398. Beat 14 then calls 0.40 the solution **“that gave no change in mass”**, undoing that distinction in the sentence a student is invited to copy. Beat 11 also labels the calculated mean `measured mean`.

Replace Beat 11's tag **`measured mean`** with **`calculated mean of three percentage changes`**.

Replace Beat 14 action 5's model-answer card with this exact close treatment, retaining the graph and lookup beside it:

> At “not a concentration”, show the written contrast **✗ The potato tissue's water potential is 0.40 mol dm⁻³.** Strike it through and replace it in place with **✓ The fitted zero-change concentration is about 0.40 mol dm⁻³. Its supplied water potential, −1120 kPa, estimates this tissue's initial water potential under these conditions.** Caption: **our wording contrast; not a quoted mark-scheme reject. Method reference: W20/51 Q1(c)(ii), QP p.5 / MS p.9; supplied Table 1.1, QP p.7.** Speak only the existing correct unit explanation. Hold the corrected version on the final frame.

The author's brief limits reject cards to verified R/I lines, whereas the user-designated VIDEO-STRUCTURE explicitly requires a closing reject card and SHARED-SPECS §2 allows an honestly labelled authored contrast. This check applies the governing standard without inventing a Cambridge R/I instruction. This is a short closing wording contrast, not a new COMMON MISTAKE beat; E48 remains the sole complete evidenced error beat.

Also replace the causal-spine opening sentence (currently “you cannot measure water potential inside a cell directly”) with:

> This investigation estimates the tissue's initial water potential from mass changes across a range of solutions; the fitted zero-change concentration and supplied table provide the estimate.

The original is an unnecessary universal claim about measurement technology and conflicts with the author's own self-review note that intracellular measurements exist.

## Should-fixes

1. **Table provenance:** QP p.7 explicitly says Table 1.1 covers solutions used in **method 1 and method 2**. Replace the recurring header with **“supplied data: W20/51 Table 1.1, QP p.7 — sucrose solutions used in both methods”**. Keep the red-pepper context and the separate density-drop result. The potato observations remain an authored adaptation, but the table is not exclusive to density drops.
2. **Boring overlay:** draw the starch reserves inside small plastid outlines rather than as apparently free cytoplasmic bodies. Keep the sole required label **insoluble starch grains**; no extra organelle lesson is needed.
3. **E48 register:** replace the spoken production instruction **“The marker stays on: the second line uses the same word.”** with **“Now look at the second line: it uses the same word.”** Keep the actual marker until the final repair. Under the validator this replaces 12 words with 12, leaving E48 at 140 words/74 s. Replace that visual cue accordingly.
4. **Temperature:** recorded room temperature is permitted by the amended plan, so the absence of a water bath is not itself a rejection. State in the visual protocol: **“Allow all solutions to reach the same room temperature before loading; keep all racks together away from direct sunlight or local heat and check temperature during the run.”** A single initial air reading must not be advertised as proof of constant solution temperature.
5. Replace “nobody could repeat it” with **“the quantity to standardise is unclear”** if rewording E48, and recount it. The first phrasing is stronger than the specificity problem warrants. Retain the paper-local boundary on the word *amount*.

## Scope, biology, samples and visual review

The outcome quotation matches **4.2.5, p.22**, verbatim. The script addresses a complete investigation: material, dimensions, proportional dilution, independent vessels, timing, masses, per-cylinder percentage change, means, a fitted zero crossing and a signed supplied lookup. No component-potential equations, extra statistical test or density-drop practical is smuggled in.

Higher initial external water potential leads to net water entry; lower leads to net loss. Pure water is 0 kPa at atmospheric pressure; more-negative solution values are lower. The no-change interpretation is qualified as a tissue estimate in Beat 12, with solute exchange, cell damage and heterogeneity acknowledged. Keep that qualification on the final answer under M3. Equality does not imply stopped molecular motion. Plant insets are explicitly schematic, not observations of this tissue; the turgid state's net arrow fades. No erroneous plasmolysis claim is attached to the mass dataset.

Potato is explained as water, dissolved cell-sap solutes and insoluble starch reserves; the measured response is mass change as a proxy for water exchange. Firmness, workable dimensions, small changes near instrument resolution, clinging liquid, cell leakage and tissue variation are addressed. The real-world rule passes for the taught sample. Pepper, turnip and onions are identified as original paper contexts, not additional demonstrated assays. The final different-potato addition is spoken as beyond the scheme on a distinct labelled panel while the answer stays visible. The qualitative hook has no fabricated measured value; its two states agree with the taught mechanism.

All beats establish apparatus/model/pictograms at entry; objectives live on their own surface. Recap highlights the familiar rig/graph rather than replacing them with a text slide. The silent E48 read has the card as its anchor. There is no reagent colour transformation to audit; molecular/plant-state changes are motion. Pours specify lip origin, 120° orientation and horizontal liquid surfaces, with bungs seated before mixing. First-contact timer starts are atomic and correct; every tube gets 60 minutes. M1 corrects the remaining preparation/handling defect. Rendered still-frame verification is honestly pending.

Shared geometry and states agree with SHARED-SPECS: 10 mm borer, 30 mm cylinders, eighteen tubes, 20.0 cm³ per vessel, six concentrations; `WaterPotentialModel` and plant states keep the initial-comparison labels and equilibrium behavior. The starch overlay must not change those state definitions.

## Numerical audit

| Quantity | Independent result |
|---|---|
| Cylinder geometry | r = 0.50 cm, h = 3.0 cm; SA = 3.5π = 10.9956 → 11.0 cm²; V = 0.75π = 2.35619 → 2.36 cm³; SA:V = 4.6667 → 4.67 cm⁻¹. |
| Dilutions | Stock/water volumes 0/20, 4/16, 8/12, 12/8, 16/4, 20/0 cm³ give the six concentrations from 1.0 mol dm⁻³ stock. Three of each require 180 cm³ stock and 180 cm³ water. |
| Mass data | All eighteen changes and percentages agree with (final−initial)/initial ×100 to 1 d.p. Calculated values stay on working panels/tables, not balance displays. |
| Means | Displayed means from displayed percentages: +8.1, +3.9, +0.1, −3.5, −6.4, −8.6%. Computing from unrounded individual percentages gives the same rounded means. Ranges 0.7, 0.7, 0.8, 0.5, 0.2, 0.4 percentage points are correct for displayed values. |
| Fit | Independent least squares: y = 8.17142857 − 22.92857143x + 6.07142857x². Root in range = 0.39841981; using printed coefficients gives 0.39838292. Both read as 0.40 on the grid. Six fitted values and residuals match. |
| Graph inference | +0.1% at x = 0.40 is a calculated mean, not measured zero change. The crossing is a construction, not a seventh point. The alternate linear check is 0.41081; there is no extrapolation. |
| Lookup | Table 1.1 has 0.40 → −1120 kPa; 0.30 → −860 kPa is the original density-drop answer. All seven table pairs match. |
| Timing | Load at 0–17 min; remove at 60–77 min, each after 60 min. Preserve immersion endpoints in the rendered handling rather than merely ending the timer on removal narration. |

## E48 and citation audit

**E48 passes: COMMON MISTAKE, 140 words + 4 s = 74 s.** The report genuinely flags imprecise *amount*. The constructed potato lines and paper-wide application are clearly labelled, not misrepresented as candidate transcripts. All five moves are present: announcement, two written faults, anchored four-second read, cue-synced where/why/mark explanation, both repairs in place. The badge remains until the second repair. Wrong propositions are not spoken as biological facts.

| Claim/quotation | Actual source checked | Finding |
|---|---|---|
| Outcome, percentage change, graph choice, dilution and risk-assessment quotations | SYLLABUS-9700-DETAIL pp.22, 63, 60, 61 | All five citation-table strings match verbatim. |
| Range/dilution, 3 marks | W20/51 MS p.7 Q1(a)(ii); QP p.3 | Five stated, spaced concentrations and two intermediate dilution methods. Original asks for 50 cm³, so this lesson's 20 cm³ must remain an adaptation, as labelled. |
| Method/control points, 6 marks | W20/51 MS p.8 Q1(b); QP p.4 | Any six of eleven points: dimensions/source, solutions/volume, covering, time, temperature, masses, drying, repeats/mean and risk. Summary supported, not a claim all are mandatory. |
| Percentage formula/reason, 2 marks | W20/51 MS p.8 Q1(c)(i); QP p.5 | Correct formula and comparison with variable initial masses. |
| Sketch/intercept, 3 marks | W20/51 MS p.9 Q1(c)(ii); QP p.5 | x-axis label/unit; downward line crossing once; indication of x-intercept as estimate. Original stem asks for sucrose concentration equivalent to tissue water potential. The lesson correctly separates that concentration from the lookup. |
| Density drop and `–860kPa ;` | W20/51 QP pp.6–7, Figs.1.3–1.4; MS p.9 Q1(d)(i) | Figure visually checked: 0.30 drop level unchanged; exact answer verified. Original method adds methylene blue to the post-soak solution and releases it into the matched unused solution. |
| Seven concentration/potential pairs | W20/51 QP p.7 Table 1.1 | All match; applies to both methods (should-fix 1). |
| Turnip planning, maximum 6/any six of nine | M24/52 QP pp.6–7; MS p.6 Q1(c)(i) | Verified: temperature 10–50°C, turnip blocks in distilled water, nine listed marking points. |
| `ref. to hazard and risk and precaution ;` | M24/52 MS p.7 Q1(c)(iii) | Exact wording and one mark verified; knife/blade injury and cutting down onto a tile are among examples. |
| Limitations, any four of eight | M24/52 QP pp.4–5; MS p.5 Q1(b)(ii) | Verified onion/NaCl context; untested intermediates, varying cell water potentials and absent statistical uncertainty supported. Not a universal list for potato. |
| Quantity-specificity quotation | R24 PDF pp.54–55, Paper 52 | Exact 12-word quotation verified. Paper-wide key message; report does not attach it to one specific question. Application limits and badge are valid. |

**Resolved UNVERIFIED 1–4:** W20/51 question wording, sketch marking points and density-drop procedure, and both M24/52 marking-point lists are now checked against actual PDFs. Retain paraphrase labels for paraphrases. Item 5 remains unassigned to a specific question: the PDF places the statement in key messages and does not settle that narrower origin. Items 6–7 are not exam evidence: the qualitative potato illustration is consistent with the mechanism but not a measured observation; the assumed density is merely a plausibility assumption, not a sourced datum. No direct exam quotation remains PDF-unchecked.

The 0/5 direct-Paper-2 figure is a description of the amended plan's selected question coding, not an independently established archive-wide frequency; the storyboard correctly limits it to cited blocks.

## Validator and runtime ruling

Literal rerun: **1,385 narration words; 157 cues; 14 beats; zero failing beats; maximum gap 24 words.** No missing-section or citation-tag failures. Manual reading confirms the cues' explanatory intent, but the validator cannot certify borer geometry, balance accuracy or an inferred result's label.

Per-beat words: **95, 52, 124, 99, 103, 93, 97, 91, 140, 86, 96, 101, 79, 129**. Spoken estimate 692.5 s; plus the specifically reserved E48 read = **696.5 s = 11:36.5**, against **11:15**. Teaching 1,245 words = **10:22.5**, 22.5 s over its 10:00 share; E48 uses 74 of its 75 seconds. Do not add another blanket silence allowance.

**Take author cut 1**, the 22-word March-paper sentence in Beat 14: hazard/risk is already spoken in Beat 5 and the finer-concentration improvement in Beat 12. Retain its two source rows as visually subordinate references revealed with the forms surface; remove obsolete cues. This gives **1,363 words, 11:25.5 including E48**, before the handling repair. **Accept the remaining overrun and the short M1 addition:** the complete investigation and estimate deserve their explanation. Keep the sign/unit line, recorded temperature and explanatory lead-ins (cuts 2–5 are not required). Update the actual ledger and headings after revision; do not accelerate speech or cut E48. The author's five-cut arithmetic is otherwise correct, but fitting a budget is not the clearance criterion.

Return check: M1–M3, affected cues, final labels and revised count. No requirement to redesign the valid dataset or thin the error beat.

NOT CLEARED
