# Round 2 — 4.2.2a — NOT CLEARED

Checked 27 September 2026 against the full round-one report, revised storyboard, `work/006/FIXES-round-1.md`, shared requirements and the round-one-to-current diff. Most requested practical corrections are present. **The recorded osmometer run remains missing**, exactly the evidence dependency round one said must be resolved before clearance. Withdrawing invented readings is necessary, but it does not supply that record.

Workspace HEAD: `e3e3ebd17221eb90b547bea728a755ff7700ef42`.
Reviewed STORYBOARD.md SHA-256: `5064647f85eddb7aa7967c95d7f3dc6e6a30022c846c96dd3a833eb8ec7b8f96`.
The version at `36594f9f` hashes to the exact round-one reviewed file, `0ff74b5780ae15f64a91cea6ed89fd2298d204572d9cf70faf9c5f76e7e38a84`.

## Every round-one item

| Item | Status | Evidence in revised storyboard |
|---|---|---|
| M1 — withdraw fabricated osmometer series and obtain workable-run evidence | **PARTLY** | Dataset 2, models and graph remove the invented 48–105 mm trace, 51/52 control readings and 1–21 minute interval. “Osmometer evidence pending” is explicit. UNVERIFIED 4, Assets and FIXES-round-1 still say no recorded run exists. Beat 8’s residual “first minute” and clock claims need the correction below. |
| M1 — first reading after immersion, volume interpretation and conditional rise | **FIXED in wording** | Beat 8’s final sentence records actual elapsed time after immersion. Beat 9 distinguishes capillary-column volume from whole-rig net entry, and explains the control’s stretching limitation. Spine/Beats 9/12 say a transient rise is **possible**. Hypothetical 0.045 cm³ arithmetic is confined to the author’s audit; no “0.045 cm³ entered” or 0.9% inference remains. |
| M2 — mixture, blank/sample volumes and carry-over | **FIXED**, with timing clarification below | Model, states, Beats 4–6 and Dataset 1 use 20 cm³ mixture, three 5 cm³ bags, retained test portion, 33 − 3 = 30 cm³ baths, clean labelled vials, 2 cm³ Benedict’s portions and separate iodine drops. Separate equipment/no returns are explicit. Three 1 cm³ transfers are shown; clocks continue through collection. |
| M2 — Benedict’s heating/colour timing | **FIXED** | Heating begins at each tube’s immersion and lasts five minutes. Colour develops during heating; later colour-name cues highlight results already developed. Test-tube holders and labelled rack are retained. |
| M3 — first dye drop, partly filled well, orthogonal readings | **FIXED** | First actual contact starts the clock; later narration only highlights it. Model/Beats 10–11/Dataset 3 draw approximately 3 mm liquid depth in a 5 mm well. Two fixed perpendicular scales and directly overhead reading replace the single-ruler ambiguity. Means remain calculations, not third readings. |
| M4 — truthful reject card | **FIXED** | Beat 13 rejects the false bilayer/transport-protein claim and affirms Visking as a limited partial-permeability model. Authored-contrast caption and absence of a fabricated error badge are correct. |
| M4 — cube dimensions and supplementary Visking source | **FIXED**, with answer-display refinement below | Table 4.1 sizes 1/2/3 cm and blue/red indicator caption are installed. S21/21 source/tariff and sucrose-impermeability stipulation are local to the paper, supplementary to the fixed sample, and separated from this lesson’s leaky-sucrose model. No endpoints are borrowed to create a time series. UNVERIFIED 1–3 are resolved. |
| M5 — mass balance and colour inference | **FIXED** | Dataset 1 states 0.714% as the hypothetical equal-distribution value, not evidence that a gradient persists at 20 minutes. Beat 7 bounds later stronger tests to illustrative results, disclaims concentration/total-mass quantification and calls for fresh independent repeats before generalisation. |
| M6 — first-frame objectives pictograms | **FIXED** | Beat 2 opens with tied-bag, rising-column and spreading-circle pictograms before text enters. |
| S1 — working-solution hazards and reagent identity | **PARTLY** | Methylene-blue wording and distinction between syllabus codes and supplier classification are installed. Actual iodine working concentration and Benedict’s product/formulation are expressly “to be identified”; a requirement to identify them is not identification. Retain as a production dependency. |
| S2 — actual bag geometry; remove “air-free headspace” | **PARTLY** | Spare tubing is collapsed; no trapped-bubble/headspace instruction remains. The ideal estimate is no longer claimed to prove fit, and actual filled/sealed dimensions must be checked. Those dimensions/full-submersion confirmation are not supplied. Wording repair passes; physical fit remains unverified. |
| S3 — beaker capacity versus bath volume | **PARTLY** | “250 cm³ beaker” is now correctly capacity. Actual water volume, depth and headroom are deferred to the missing workable setup rather than specified. This ties into M1. |
| S4 — control uncertainty | **FIXED by removal** | Numerical control series and unsupported uncertainty interpretation are withdrawn. No reason to insert the old one-division description of withdrawn data. |
| S5 — clock count | **FIXED** | Recap action identifies investigation clocks individually and excludes Benedict’s heating from a diffusion/osmosis start. No claim of four clocks remains. |
| S6 — dye versus indicator boundary | **FIXED by removal of the optional addition** | Runtime cut removes the beyond-scheme sentence/panel; the paper’s universal indicator remains separately labelled with start/result swatches. Beat 11 retains the dye-edge visibility limit. A stale interpretation sentence is corrected below. |
| S7 — preview and potato ownership | **FIXED** | Hook rigs carry “preview; schematic”; potato thumbnail points to quantitative potato investigation 4.2.5. |
| Runtime ruling | **FIXED** | Required cuts 1/2 taken; control/timing/material sentences preserved and rewrites recounted. Current overrun accepted below. |

## Remaining clearance requirement — recorded osmometer evidence

The revision’s own Dataset 2 and Plan interpretation 5 correctly retain this dependency. `FIXES-round-1.md` explicitly lists it as still open. No recorded run is cited in the revised storyboard or accompanying work files. The review does not invent measurements or perform a physical experiment.

Keep the existing evidence-pending paragraph. Add this exact status sentence to the CHECK RESPONSE M1 row, replacing its unqualified “applied” status with **PARTLY**:

> Invented readings have been withdrawn and the qualitative explanation repaired. Clearance remains pending a recorded run of the specified apparatus, including actual filled/sealed bag dimensions, bath volume and headroom, first contact, the first post-immersion reading and later elapsed-time readings. Observation interval and all numerical animation cues must be derived from that record.

A record must match the specified tubing, sucrose concentration, capillary bore, geometry, bath and temperature, or the storyboard must explicitly reconcile any apparatus changes. Supply the raw observation record and its source, then select the workable interval. A plotted curve alone, a geometric estimate, or S21/21’s different apparatus does not meet this requirement. No exact numerical replacement can honestly be prescribed before those observations exist.

### Remove residual claims of observed timing while the record is pending

Beat 8 action 6 still specifies meniscus settling “in the first minute”, although no trial establishes that interval. Beat 9 opens with “stopwatches show real elapsed time” and couples the moving meniscus/graph to a running clock. Removing graph numbers alone does not make the coupled numerical clock evidence-free. Its wording also calls a marker “from the recorded run” before that run exists.

Replace Beat 8 action 6 with:

> At “The meniscus can shift as the bag settles”, show a small possible displacement under the caption “qualitative schematic; settling interval not established”. Do not attach a minute value or a numerical elapsed time to this displacement. Highlight the pre-immersion mark as “not a reading, not zero”.

Replace the Beat 8 first-reading tag everywhere with:

> first post-immersion reading: value and elapsed time pending a recorded run

Replace Beat 9’s opening clock/time-lapse direction with:

> From the first frame, retain the osmometer and control under “qualitative schematic; not measurements”. Until the record exists, show the stopwatch as a procedural timing icon with no numerical elapsed-time display linked to meniscus movement. At “Record the meniscus at stated elapsed times”, point to the meniscus and fixed ruler to explain the reading procedure; do not simulate a timed observation. Retain the first-contact start instruction. Once a run is sourced, replace this placeholder with its actual elapsed times and observed meniscus positions.

The dimensioned apparatus is allowed; these changes concern invented observations, not labels such as the 1.0 mm bore. Label the unsourced temperature condition **“illustrative condition: 20 °C; measure actual temperature in the recorded run”**, not “20 °C (recorded)”. Do not generalise “clock shows real elapsed time” from the permitted illustrative diffusion/agar sequences to the pending osmometer record.

## Other exact edits and production dependencies

1. **Withdrawal start versus narration cue, Beat 6 action 2:** the clock currently reaches 3:00 at “At three minutes”, but the first transfer is triggered at the later “collect…” cue. Replace the first two sentences of that action with:

   > On the frame stopwatch 1 reaches 3:00, begin the first withdrawal into the 3 min vial and record that actual start time. At “collect a three-cubic-centimetre sample from tube one”, highlight the ongoing three measured 1.0 cm³ transfers; do not initiate a second withdrawal or reset the clock. Keep the stopwatch running throughout collection.

   Apply the same event rule to 10:00 and 20:00. The corrected aliquot arithmetic and clean-equipment contract remain unchanged.

2. **S21/21 answer display, Beat 13 action 2:** “direction of water movement · net movement · from higher to lower water potential” is a list of answer ingredients, not itself a complete three-mark answer. Replace the line called “credited answer lines” with this actual contextual paraphrase:

   > At internal sucrose concentrations 0.0, 0.4 and 0.8 mol dm⁻³, net water movement is out of the tubing and the meniscus falls. At 1.2, 1.6 and 2.0 mol dm⁻³, net water movement is into the tubing and the meniscus rises. Water moves from higher to lower water potential. Our model answer to S21/21 Q3(a); the question stipulates tubing impermeable to sucrose.

   Keep the three-mark/any-three note and distinct-paper divider. The thumbnail should show the paper’s Visking column and its own meniscus, **not a glass capillary borrowed from this lesson’s rig**. This improves the newly added close without expanding practical scope or adding a new investigation.

3. **Reagent/fit dependencies (S1–S3):** use the exact production note:

   > Before practical build, record the iodine working concentration and Benedict’s product/formulation, with the chosen working solutions’ supplier safety information. Record actual filled/sealed bag dimensions and confirm fit/submersion without overflow. For the osmometer, record actual bath volume, submersion depth and headroom separately from vessel capacity. These details remain pending; they are not verified by the ideal cylinder calculation.

   Do not invent supplier details to close the table. These outstanding should-fix details are additional production work; M1’s required recorded run is the clearance blocker.

4. **Stale Plan interpretation 9:** replace “the real-world extra about colour boundaries sits on a dashed beyond the mark scheme panel” with:

   > The optional beyond-the-mark-scheme colour-boundary sentence and panel were removed; Beat 11 retains the visibility-threshold explanation.

   Keep the existing blue/red paper swatches and methylene-blue distinction.

## Original-PDF check of changed examination material

Fresh `pdftotext -layout` extracts, archive root `/home/dachu/sme-9700-archive/pastpapers/`:

| Source | Result |
|---|---|
| `2021/June/9700_s21_qp_21.pdf`, pp6–7, Q3(a) | Six 10 cm³ internal solutions: 0.0/0.4/0.8/1.2/1.6/2.0 mol dm⁻³. External solution: 15 cm³ at 0.9 mol dm⁻³. Heights compared after 20 minutes; pieces removed before remeasurement. Sucrose-impermeability is explicit in the question. This is not the lesson’s glass-capillary time series. |
| `2021/June/9700_s21_ms_21.pdf`, p10 | Three marks, any three listed points: correct outward/inward movement for the relevant concentrations, net water movement, higher-to-lower water potential/down the gradient. Supports the replacement answer above. |
| `2021/June/9700_s21_qp_22.pdf`, p9, Table 4.1 and Q4(c) | Cube sides A/B/C are 1/2/3 cm. Universal indicator plus sodium hydroxide makes blue agar; indicator is red in acid. Dilute hydrochloric acid covers the cubes at time zero. Revised cube caption is accurate. |
| `2021/June/9700_s21_ms_22.pdf`, p14 | Q4(c): A → B → C, one mark; alternative ratio/side-length order accepted. Supporting cube-C surface area 54 cm² and volume 27 cm³ are correct. |

No new exam quotation is presented as verbatim; the changed paragraphs are explicitly summaries. The original sample denominator remains unchanged by supplementary S21/21. The valid Visking-model statement is no longer falsely rejected.

## Arithmetic, handling and runtime

Fresh validator: `python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.2a/STORYBOARD.md` — **13 beats, 1,329 words, 164 cues, maximum gap 20 words, zero failing beats; 11:04.5 at 120 effective wpm**. No missing-section/citation failures. It does not test observation provenance or physical timings between narration cues.

**Accept the 1:34.5 overrun** against 9:30 for the repaired three-investigation explanation. The two agreed cuts remove 34 words; required rewrites add 73 net words to the trimmed draft. No error beat is present or needed. Retain the blanks, contact timing, controls and interpretation limits. If the two-second final hold is scheduled outside the effective estimate, declare 11:06.5. Recount/reschedule after the recorded run is incorporated; do not accelerate narration to recover the editorial budget.

Arithmetic rechecked: 20 cm³ mixture − 15 cm³ in bags leaves 5 cm³, enough for the 3 cm³ contents aliquot; 33 − 3 = 30 cm³ nominal bath; each 3 cm³ aliquot supports 2 cm³ Benedict’s plus an iodine drop and discarded remainder. Bag mixture stays 5% glucose/0.5% starch. The 0.714% mass balance makes no timing claim. Three nominal 0.05 cm³ drops occupy approximately 3 mm of the 8 mm-diameter well; the mean of 37 and 36 is 36.5 mm, shown as a calculation rather than a ruler observation.

Pours, rinse, clean sample division, first-contact dye clock, heating, real colour sequence, grid measurements and no-return rule are now executable as written, subject to the declared physical fit/reagent details. No new text-only objective frame, synthetic colour interpolation or calculated instrument reading was introduced. The real-world analytes and readout limits remain explicit. The unresolved osmometer timings prevent clearance despite these improvements.

Only this round-two CHECK was written for this code. Storyboard unchanged; no commit, push or deployment.

NOT CLEARED
