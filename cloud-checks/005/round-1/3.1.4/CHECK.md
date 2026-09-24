**CLEARED WITH MINOR EDITS**

Independent round-one check, 24 September 2026. Apply the exact local edits below before narration/build. The explanation, syllabus coverage, quoted evidence and numerical results pass; the remaining defects concern the assay's starting assumptions, preparation and depicted instrument states. These repairs need no new teaching sequence or further authoring round. No error beat is missing or required.

Reviewed `STORYBOARD.md` SHA-256: `1801ab3106ccbde5c0ae4d39fdc0c4bf4e9487ec114835e122bdffadcb9dd033`.

Read the complete storyboard, binding plan and weights, complete VIDEO-STRUCTURE, syllabus Topic 3 outcomes/introduction and 2.1.2 recall, all three evidence documents, both cleared sibling storyboards and both rounds of their checks, SHARED-SPECS and SUMMARY. Also inspected the actual 3.2.1b ONPG method/Dataset C and 3.1.3 graph interface. Quotations were checked text-to-text against the supplied verified register. No exam PDF or rendered video was available or inspected.

**M1 — Make the start of the reaction, the timer and the assumed origin agree.**

The model sequence and Beat 3 action 1 finish the two inversions before starting the stopwatch. This contradicts “timer started at mixing”. Beat 3 action 2 still makes the instrument display a reading at 0 s, despite its small print and Dataset A saying that this is not a reading. SUMMARY's assertion that this has been corrected is therefore only partly true. Also, “the mixture matches the blank” is not literally true: one contains enzyme and the other does not. Absence of product alone does not establish identical optical backgrounds.

Replace the entire model-spec paragraph beginning “Sequence: filter set to blue” with:

> Sequence: select the blue filter → insert the reaction blank and close the holder lid → set absorbance to 0.00 → remove the blank → add enzyme last to the reaction cuvette and start the timer when enzyme first contacts the mixture → promptly fit the cuvette lid and invert twice → set upright and insert with clear faces in the light path → close the holder lid → record absorbance at 30, 60, 90, 120, 150 and 180 s. For these illustrative data, assume no yellow product initially, negligible optical contribution from the enzyme preparation at the selected wavelength, and a stable blank over the run. The point (0 s, 0.00) is an assumed starting point, not an instrument reading. These assumptions are specific to this example; zeroing a blank does not itself establish them.

Replace Beat 3 action 1 with:

> At *Add the enzyme last*, remove the blank and set it aside; the prepared reaction cuvette receives 0.5 cm³ enzyme solution from the graduated pipette, its tip inside the mouth above the liquid. Start the visible stopwatch at the first contact of enzyme with the mixture. At *mix, start*, promptly fit the lid and invert the cuvette twice while the stopwatch continues, then set it upright with a level liquid surface. At *start the timer at mixing*, highlight the running stopwatch and its tag **t = 0: enzyme first contacts the mixture**; do not restart it. At *put the cuvette in*, lower it into the holder with clear faces in the light path and close the holder lid. Handle the ridged faces throughout.

Replace Beat 3 action 2 with:

> At *Read the absorbance every thirty seconds*, show the stopwatch and reaction cuvette with the caption **time compressed; first reading at 30 s**. The read-out sequence is **0.12, 0.24, 0.35, 0.45, 0.53, 0.60**, paired respectively with **30, 60, 90, 120, 150, 180 s**; the liquid deepens in the same yellow hue. At *plot it against time*, introduce `RateGraph` `absorbance-time` and plot Dataset A. Draw (0 s, 0.00) as an open point labelled **assumed start; not measured**, and the six readings as filled points. Keep **our illustrative data** visible. No reaction read-out at 0 s is shown.

Replace Dataset A's first derived-number bullet with:

> **The 0 s value is an assumed starting point, not a reading.** The illustrative model assumes no initial yellow product, negligible enzyme-preparation optical background at the selected wavelength and a stable blank. The first measurement is at 30 s. The plotted initial section is straight in this model; the two measured values independently give (0.24 − 0.12) ÷ (60 − 30) = 0.0040 s⁻¹, consistent with its assumed origin.

In the Reusable models table, replace the Conditions value with:

> Buffer pH 7.0; all solutions at 25 °C; timer starts when enzyme first contacts the mixture; measured readings every 30 s from 30–180 s; (0 s, 0.00) is an explicitly assumed start under the stated optical-background assumptions.

No data or narrated result changes. The handoff to 3.2.1b must carry this distinction: its numbers already match, but its Dataset C still calls 0 s a recorded value and Beat 11 calls the entire series “readings”. This report changes no sibling file.

**M2 — Keep the calibration preparation consistent with the claimed matrix.**

Dataset B replaces water with progressively more product stock **in buffer**. That adds progressively more buffer, contradicting the claim of the same matrix as the reaction blank. The dilution arithmetic is correct; the solvent specification is the defect.

In Dataset B replace “a stock of the yellow product at **250 µmol dm⁻³** in buffer” with:

> a stock of the yellow product at **250 µmol dm⁻³** in water

Replace “i.e. the same volumes and matrix as the reaction blank with product stock in the water slots” with:

> i.e. the same buffer and ONPG inputs and total volume as the reaction blank, with aqueous product stock replacing part of its water

Add immediately after that standards-preparation paragraph:

> Use the same buffer stock and ONPG stock for all standards and the reaction blank. The illustrative calibration assumes that the buffer maintains the final pH at 7.0 and that the enzyme preparation's optical contribution is negligible, as specified for Dataset A. The absorbances are illustrative values, not predictions from dilution arithmetic alone.

In both the calibration model caption and Beat 4 action 2 replace **same filter, same blank, same cuvette and volume as the reaction** with:

> same filter, same blank, same cuvette type, optical path and total volume as the reaction

Six separate cuvettes cannot simultaneously be “the same cuvette”. The replacement preserves the relevant measurement conditions without contradicting the visual. All standard concentrations and plotted points remain unchanged.

**M3 — Correct the two recap highlights.**

Beat 5 action 1 places the yellow reaction cuvette in the holder while highlighting a display of 0.00 as the blank. Beat 5 action 2 highlights **0.50 µmol dm⁻³ s⁻¹** at “a concentration”; that number is a rate, not a concentration. This repeats the type of wrong-target highlight caught in the 3.1.1-2 check.

In Beat 5 action 1 replace “with the reaction cuvette in the holder” with:

> with the colourless reaction blank in the holder and the caption **recap: zeroing on the blank**

In Beat 5 action 2 replace “the `read-across` and **0.50 µmol dm⁻³ s⁻¹** brighten” with:

> the `read-across` from absorbance **0.24** to concentration **30 µmol dm⁻³** brightens; the concentration-rate result remains unhighlighted

The narration is already correct and stays unchanged.

**M4 — Use one consistent light/filter state in the instrument overview.**

Beat 2 shows Dataset A readings before choosing the blue filter, with a neutral-grey light band, although those readings belong to the blue-filter assay. It also narrows the band to represent absorption; the handle icon makes it disappear completely. These are avoidable ambiguities in a lesson whose central distinction is intensity at a fixed wavelength.

Apply these exact visual edits:

- Append to Beat 2 action 1: **This is a schematic preview of an already set-up instrument, captioned “principle preview; setup follows”. The blue filter is already seated; the light band is blue throughout.** Delete its parenthesis “neutral grey until the filter is chosen in action 5”.
- In action 3 replace “the band beyond the cuvette is drawn thinner” with **the band beyond the cuvette retains its width and blue hue but becomes dimmer**. The 0.12 and 0.35 readings are illustrative preview states from Dataset A, not readings made before setup.
- In action 5 replace “the band entering the drop and not leaving it” with **the band entering the drop and emerging fainter, with the same blue hue**. Replace “`filter-blue` slides into the slot and the band becomes blue” with **the already seated `filter-blue` and its label are highlighted**.
- Append to action 7: **Remove the preview caption as the blank enters. Close the holder lid before pressing zero.**

This keeps the five part labels, handle and exact filter-choice evidence, without adding optics or changing narration.

**M5 — Bound the blank rule and specify the hook transition.**

The causal spine starts as a general procedure, then prescribes the enzyme-free blank without the assay qualification claimed in the typicality ledger. Replace “zero the colorimeter on a blank that contains everything except the enzyme” with:

> for this assay, zero the colorimeter on a reaction blank with water replacing the enzyme solution

Beat 1 action 5 calls for liquid transfer without specifying how. Replace the complete action with:

> At *A colorimeter gives you the number*, use a match dissolve from the yellow tube to a prepared cuvette containing the same yellow solution; this is a change of illustration, not a pouring animation. The cuvette slides into the unlabelled outline of `ColorimeterModel`, and the read-out fills with **0.24**, labelled **preview: our 60 s example**; dissolve to the objectives surface.

The actual pipetting is taught in Beat 3. This avoids an unspecified pour while retaining the hook's number, which is derived from Dataset A. The remaining handling contract is physically possible: clear faces toward the beam, fingers on ridges, pipette above liquid, capped inversion, upright insertion and closed holder before readings. There is no heated-tube handling or other pouring action in this lesson.

**Verification results**

| Check | Finding |
|---|---|
| Scope and command | Outcome 3.1.4 is verbatim, syllabus p.20. OUTLINE is satisfied by filter choice, appropriate blank/zero, fixed path/filter, timed absorbance readings and calibration when concentration is required. The worked gradients fulfil the binding plan's absorbance-rate/concentration-rate distinction. No Beer–Lambert law, instrumental theory, inhibitor mechanism or new recall list is introduced. |
| Science and typicality | All narrated sentences reviewed, including every/all/only/no/because/so clauses. “Not every” is bounded; subjective judgements “may” differ; blue is justified for this yellow product; the straight initial section and calibration apply to these illustrative data. No local marking rule becomes a universal full-mark requirement. M1 and M5 repair stronger non-narrated blank claims. |
| Chemistry | No formula equation, molecular structure or covalent edge animation. ONPG → yellow product is a schematic word conversion, not a complete balanced reaction. No atom-mapped exchange or net-reaction caption is required; do not add a molecular mechanism during build. |
| Colour | Colourless → pale yellow → deeper yellow in one hue is an appropriate sequence. No RGB interpolation through unrelated reagent colours. Five nonzero standard intensities plus the colourless standard give six cuvettes; “five opacities” should be read as five positive opacities, with zero opacity for the blank. |
| Error treatment | Correctly zero assigned error beats. The final reject is labelled as an authored composite based on reported faults, not a candidate transcript. Its wrong proposition is written only; the correct counterpart appears with it. No extra badge, silent read or five-move error beat should be invented. |
| Full shape | Substantial hook/context, two objectives, explanation, in-place recap, cited exam orientation and answered hook are present. The objectives' own styled surface follows VIDEO-STRUCTURE's express requirement; it is not a bare teaching card. The instrument/graphs remain alongside the forms, and the final tube anchors the close. |
| Build readiness | Actual colorimeter and cuvette are shown, with parts named where they sit. Literal cues pass; M1–M4 repair semantic state/timing defects that a string validator cannot catch. Final rendering and label legibility remain untested at this text-only gate. |
| Shared models | `RateGraph` configurations and overlays extend 3.1.3's declared interface without changing its rate vocabulary. `EnzymeActiveSiteModel` and `EnergyProfileGraph` are not used or redefined here. No conflict with either cleared sibling's model contract. |
| ONPG handoff | 3.2.1b matches enzyme/substrate, pH 7.0, 25 °C, blue filter, 1.0 + 0.5 + 0.5 + 0.5 = 2.5 cm³, enzyme-last mixing, own-concentration blanks, every 30 s, 0–60 s slope and all seven zero-inhibitor values. It also cites the same 0.0080 calibration factor, but does not perform a conversion. Carry M1's assumed-origin qualification into reuse. |

SHARED-SPECS' demand for a literal reading at 0 s conflicts with its own insertion-after-mixing method; M1 resolves that conflict without changing the data. Its blanket “no model names or model identifiers” line also conflicts with its required model sections and the binding plan's named interfaces. Retaining component identifiers in build instructions is appropriate; none is spoken to students. SUMMARY's blanket assertion that none occurs is not literally true.

**Independent number audit**

| Quantity | Re-derived result |
|---|---|
| Reaction/blank volumes | Reaction: 1.0 + 0.5 + 0.5 + 0.5 = **2.5 cm³**. Blank: 1.0 + 0.5 + 1.0 water = **2.5 cm³**. |
| Dataset A successive changes | **0.12, 0.12, 0.11, 0.10, 0.08, 0.07** per 30 s. First three model points collinear; later increments decline. |
| Initial absorbance rate | (0.24 − 0.00)/60 = **0.0040 s⁻¹**; measured 30–60 s segment gives the same result. Absorbance dimensionless, hence rate per second. |
| Average, ledger only | 0.60/180 = **0.0033 s⁻¹** to two significant figures; not relabelled initial rate. |
| Six standard concentrations | 250 × stock volume/2.5 = **0, 20, 40, 60, 80, 100 µmol dm⁻³**; stock + water = 1.00 cm³ in each row. |
| Calibration slope | 0.80/100 = **0.0080 dm³ µmol⁻¹**, also 0.16/20, 0.32/40, 0.48/60 and 0.64/80. |
| All Dataset A conversions | A/0.0080 = **0, 15, 30, 43.75, 56.25, 66.25, 75 µmol dm⁻³**. Displayed one-decimal rounding **43.8, 56.3, 66.3** is correct. |
| Concentration rate | (30 − 0)/60 = **0.50 µmol dm⁻³ s⁻¹**. This follows the illustrative straight initial section, not a universal fixed-time definition of rate. |
| Range and other displays | A ≤ 0.60 lies within calibration A = 0–0.80. The 0.24 hook/read-across and 0.12/0.35 preview values all occur in Dataset A. Axis limits contain all points. pH, temperature, stock strength and volumes are declared illustrative inputs, not derived exam measurements. |

**Quotation audit — text-to-text, not a fresh PDF verification**

| Quotation | Verified register and source attribution |
|---|---|
| Full “outline the use of a colorimeter…” outcome | SYLLABUS-9700-DETAIL, 3.1.4, syllabus 2025–2027 p.20; exact. |
| “comparison to colour standards” | Same register, 2.1.2, p.17; exact. |
| “idea that (result / it, is) quantitative / AW” | Plan §3.1.4: June 2021, 9700/51 Q1(b)(i), MS p.7; exact. |
| “the filter used should not be the same as the colour of the solution being tested” | Plan §3.1.4: March 2023 ER, Paper 52 Q1(a)(i), p.14; exact. |
| “different wavelengths of light rather than different absorbance or transmission values using the same light wavelength” | Weights, evidence-gaps paragraph: June 2024 ER, Paper 22 Q4(b)(ii), p.15; exact. |
| “changing” | Same weights paragraph/source; the single word is verified. The surrounding “colours instead of intensity” account is the register's paraphrase, not a full ER quotation. |
| “Detail is not required.” | EXAMINER-INSIGHT §4: Learner Guide for examinations from 2022, p.15; exact and correctly restricted to its illustrated outline task. |
| “are addressed in normal teaching; no separate error beat is allocated to them in this plan”; “No sampled mark in the enzyme sense” | Exact editorial wording in plan §3.1.4 and weights' 3.1.4 rationale respectively, not Cambridge quotations. The 0/15 frequency agrees with the weights. |

No additional unsupported quotation of Cambridge evidence was found. The quotation script's unmatched strings are principally the author's own narration/cut proposals and a VIDEO-STRUCTURE heading, not fabricated examiner excerpts. Its normalisation and omission of very short strings are not substitutes for the manual attribution check above.

The following remain **UNVERIFIED** as the storyboard declares, and must not be promoted to verbatim paper/report text:

1. S21/51 Q1(b)(i) question wording.
2. March 2023 Paper 52 Q1(a)(i) question wording and substance assayed.
3. June 2024 Paper 22 Q4(b)(ii) question wording/context and the full ER sentence containing “changing”.
4. June 2023 ER p.58 wording about unsuitable uses of a colorimeter. The plan supplies a paraphrase/location, not the report's words. The superseded June 2024 p.58 attribution is not evidence.
5. S21/51's actual assay concentrations, volumes, temperature, filter and reading schedule.

The authored question framings and declared illustrative assay avoid reliance on those unavailable quotations. “Not every enzyme reaction changes colour” does not by itself establish the stronger proposition that some colour observations are unsuitable for colorimetry; it is acceptable here as the syllabus-bound opening, not as verification of the missing p.58 passage.

**Cues and length ruling**

Independent speech extraction agrees with the read-only validator: **86 / 118 / 76 / 61 / 91 = 432 words**; **64 cues**, all exact, unique under case-insensitive counting and in order. Maximum cue-start gaps by beat: **16 / 17 / 14 / 14 / 11 words**. Sampled cue/action pairs in Beats 2–5 confirm why literal success alone misses M1 and M3.

At the binding effective rate, **432/120 = 3:36**, **21 seconds over 3:15**, all teaching; zero error allowance is involved. Do not add the final two-second hold again or speed up narration.

- **Author's cut 1: TAKE.** The spoken Benedict's recall is expendable signposting; retain the on-screen 2.1.2 recall as the plan requests. In Beat 4 replace **“read with the same filter and blank, the colour-standards idea from the Benedict's lesson.”** with **“read with the same filter and blank.”** Delete the old recall cue and reveal its tag at the existing cue *read with the same filter and blank*, alongside the standard readings. Do not create a duplicate cue entry.
- **Cut 2: KEEP.** The fixed optical path belongs in the procedural recap and reinforces the comparison condition.
- **Cut 3: KEEP.** The possible disagreement between observers makes the reason for a quantitative reading concrete; it is brief and appropriately qualified.

Cut 1 removes **7 words**, leaving **425 words = 3:32.5**, **17.5 seconds over budget**. Beat 4 becomes **54 words / 27 s**; Beat 5 begins at **2:47**. Accept that remaining teaching overrun. The rest supplies apparatus location, handling, two distinct rate quantities, the required recap and a short evidenced close. The required visual/scoping edits above add no narration words. Update the timing ledger and cue count after applying them; none of these corrections authorises thinning an error beat elsewhere.
