# Topic 4 independent plan check — run 006

**NOT CLEARED**

Reviewed 27 September 2026. All ten numbered syllabus quotations match the actual 2025–2027 syllabus, and the ten-lesson grouping is defensible. The plan nevertheless needs corrections before storyboarding: its evidence ledger leaves directly relevant questions uncoded; it merges two different water-potential experiments; its cell-signalling evidence includes an intracellular receptor; its plant-cell equilibrium account is incomplete; and several practical and timing claims need bounding. These are substantive planning corrections, not reasons to remove required outcomes or the six selected error beats.

**Revalidated:** both planning files still match the reviewed hashes below. Fresh `pdftotext` extraction reconfirmed all ten outcome quotations and every unique direct exam quotation in the citation table, including the two wording mismatches. The verdict and required corrections stand. The explicit requirement is **65–75 seconds for each complete five-move error beat, never thinned**; MF7 reserves the upper end, 75 seconds, rather than treating a 45-second talk-through as the whole beat.

Only this CHECK.md was written in the review destination. Neither planning document was edited. No commit, push, deployment, publication or release was performed.

## Basis, method and source availability

Read both complete planning documents, `SYLLABUS-9700-DETAIL.md` Topic 4, the complete `VIDEO-STRUCTURE.md` including its final REAL-WORLD SAMPLES rule, G04, and the Topic 3 check, including its cleared second-round ruling. This check follows that model: scope/grouping rulings, exact required edits, evidence verification and bounded practical conclusions. It does not reinstate the superseded four-minute cap.

Extracted the actual syllabus and all seven cited QP/MS pairs with `pdftotext -layout`. Page references below are **one-based PDF pages**. The June 2023 examiner report was also extracted locally. Rendered and visually inspected S23/21 QP p.3 to resolve what the endocytosis diagram actually depicts. Repeated quotations in the two documents are audited once per unique source/wording below; the rulings apply to every occurrence, including the error register and weights prose.

The June 2024 examiner report **was not present as a PDF in the supplied archive** or the other searched local project locations. The archive contains a failed-download HTTP header record for `9700_s24_er.pdf`, not the report. To finish the requested quotation check, I obtained the [official Cambridge June 2024 report](https://www.cambridgeinternational.org/Images/566822-june-2024-examiner-report.pdf), extracted it with `pdftotext -layout`, and checked pp.21, 54–55. Its 59-page length agrees with the local examiner-insight inventory. This was a source retrieval, not a deployment. Extraction scratch files are in `/tmp/topic4-pdf-audit/`.

Local PDF root: `/home/dachu/sme-9700-archive/pastpapers/`. Source key:

| Key | Actual QP/MS files beneath that root |
|---|---|
| W20/21 | `2020/November/9700_w20_qp_21.pdf`, `9700_w20_ms_21.pdf` |
| W20/51 | `2020/November/9700_w20_qp_51.pdf`, `9700_w20_ms_51.pdf` |
| S21/22 | `2021/June/9700_s21_qp_22.pdf`, `9700_s21_ms_22.pdf` |
| W22/23 | `2022/November/9700_w22_qp_23.pdf`, `9700_w22_ms_23.pdf` |
| S23/21 | `2023/June/9700_s23_qp_21.pdf`, `9700_s23_ms_21.pdf` |
| M24/22 | `2024/March/9700_m24_qp_22.pdf`, `9700_m24_ms_22.pdf` |
| M24/52 | `2024/March/9700_m24_qp_52.pdf`, `9700_m24_ms_52.pdf` |
| R23 | `2023/June/9700_s23_er.pdf` |
| R24 | Official download above; scratch copy `9700-examiner-report-june2024.pdf` |

## Outcome coverage and grouping rulings

All ten quotations agree with both the detailed reference and syllabus PDF pp.21–22 after normalising whitespace, bullet formatting and mathematical typography. The introductory paragraph also matches. The quoted tubing specification on p.57 and the mathematical requirements on p.63 are supported; the shortened calculator/tangent quotations are excerpts, not full sentences.

| Outcome | Syllabus quotation | Planned teaching ruling |
|---|---|---|
| 4.1.1, describe | **Verbatim match**, p.21 | Bilayer formation, hydrophilic/hydrophobic interactions and protein arrangement present. Avoid making “intrinsic” exactly synonymous with “transmembrane”; see should-fixes. |
| 4.1.2, describe | **Verbatim match**, p.21 | Cholesterol and external carbohydrate-chain arrangement present. The claimed lack of sampled evidence is false: M24/22 Q1(a)(ii) directly tests cholesterol orientation. |
| 4.1.3, describe | **Verbatim match**, p.21 | All five component categories and six role headings present. Cholesterol's temperature-dependent role is appropriately qualified. Correct the E43 quotation/badge and the glucose-route overgeneralisation. |
| 4.1.4, outline | **Verbatim match**, p.21, including all three bullets | All three stages present, but specify a real response at outline depth and bound the secretion example. The steroid question is adjacent specificity evidence, not a cell-surface-receptor demonstration. |
| 4.2.1, describe and explain | **Verbatim match**, p.21 | All six processes present. Passive/energy-requiring split is coherent; channel and carrier mechanisms are correctly distinguished. Bound water-potential and named-transport examples. |
| 4.2.2, investigate | **Verbatim match**, p.21 | Plant and non-living materials, Visking and agar are included. Five demonstrations are an editorial teaching choice, not an explicit Cambridge requirement for exactly five protocols. Complete the material/readout controls below. |
| 4.2.3, illustrate by calculating | **Verbatim match**, p.21 | Cuboid/cylinder calculations and decreasing SA:V present. S21/22 Q4(b) supplies a real calculation close. Q4(c) assesses the diffusion consequence, not another calculation. |
| 4.2.4, investigate | **Verbatim match**, p.21 | Agar size investigation present. Reciprocal endpoint time must not imply a greater intrinsic diffusion speed in small cubes. The cited sample actually contains an agar question. |
| 4.2.5, investigate and estimate | **Verbatim match**, p.22 | Dilution, mass change, repeats, graph and lookup present. Correct the W20/51 method attribution and make the three repeats independent vessels. |
| 4.2.6, explain | **Verbatim match**, p.22, including exclusion | Both cell types and major outcomes present. Add the missing explicit plant equal-potential case and show the gradient disappearing as a plant cell becomes turgid. Do not equate equal water potentials with one compulsory cell shape. |

Retain the pairings 4.1.1+4.1.2 and 4.2.3+4.2.4, both 4.2.1 halves, both 4.2.2 halves and the build order putting 4.2.6 before the practicals. No new lesson split is required. “Including” is correctly treated as required inclusion. “Knowledge ... is not expected” justifies omitting component-potential terminology and equations; it does not justify omitting equilibrium or the wall's effect on water entry.

## MUST-FIX 1 — repair the evidence ledger and dependent exam closes

The written ledger's arithmetic reproduces its headline incidence counts. The problem is **incomplete/misclassified source evidence**, not addition. The cloud run fairly disclosed its limited inputs, but those limitations cannot remain the active claims now that the PDFs have been checked.

Apply these row corrections to WEIGHTS and propagate them to the plan's evidence paragraphs, tariffs and UNVERIFIED register:

| Part; verified pages | Exact replacement ledger description / coding |
|---|---|
| M24/22 Q1(a)(i–iii); QP pp.2–3, MS p.5 | **Split Q1(a): (i) glycerol, 1 mark, Topic 2 prerequisite; (ii) cholesterol orientation through polar/non-polar interactions, 1 mark, 4.1.2; (iii) one role of cholesterol, 1 mark, 4.1.3. Do not leave the whole part uncoded.** |
| M24/22 Q1(c)(i–iii); QP pp.4–5, MS pp.6–7 | **Split Q1(c): (i) SER context and (ii) enzyme action are outside this Topic 4 ledger; (iii) outline cell signalling, any two marking points, 2 marks, 4.1.4 and receptor-role overlap with 4.1.3.** |
| S21/22 Q3(b); QP p.6, MS p.12 | **Steroid hormone S crosses the bilayer; non-polar/lipid-soluble character and bilayer passage, any two points, 2 marks. Code 4.2.1 and permeability-role overlap 4.1.3.** |
| S21/22 Q3(c); QP p.6, MS p.12 | **Hormone S binds cytoplasmic receptor R by complementary shape, 1 mark. Adjacent receptor-specificity evidence only; not direct evidence of the cell-surface-receptor stages in 4.1.4 or a cell-surface role in 4.1.3.** |
| S21/22 Q5(b)(ii); QP p.11, MS p.16 | **Release of pectin from plant cells by exocytosis, 1 mark, 4.2.1.** |
| S21/22 Q4(b); QP p.9, MS p.14 | **Cube C: surface area 54 cm², volume 27 cm³; correct volume unit plus calculation, 2 marks, 4.2.3.** |
| S21/22 Q4(c); QP p.9, MS p.14 | **Order of complete indicator change, A → B → C, 1 mark, 4.2.4; overlapping agar-diffusion evidence for 4.2.2. Universal indicator: initially blue, red in acid.** |
| W22/23 Q2(a)(i); QP p.4, MS p.9 | **Macrophage engulfment of bacteria, any three points, 3 marks, 4.2.1.** |
| W22/23 Q6(a); MS p.19 | **Ion transport through a membrane protein, any one point, 1 mark, 4.1.3 and 4.2.1.** |
| S23/21 Q1(b)(i); QP p.3, MS p.8 | **Endocytosis/pinocytosis at X in a plant-cell vacuole-development diagram, 1 mark, 4.2.1.** |
| W20/21 Q4(b)(ii); MS p.10 | **Five-mark phloem mass-flow explanation containing water-potential/osmosis points. Adjacent 4.2.1 and 4.2.6 evidence; do not describe all five available marks as five marks solely for osmosis.** |

Use this replacement summary, which separates direct teaching-scope exposure from adjacent contexts:

> Within the cited question blocks of the same five Paper 2s, directly relevant exposure is: 4.1.1 0/5; 4.1.2 1/5 (1 mark); 4.1.3 4/5 (10 overlapping marks); 4.1.4 2/5 (4 marks); 4.2.1 4/5 (15 marks); 4.2.2 1/5 (1 overlapping agar-diffusion mark); 4.2.3 1/5 (2 marks); 4.2.4 1/5 (1 mark); 4.2.5 0/5; 4.2.6 0/5 direct. Keep S21/22 Q3(c), 1 mark, as adjacent specificity evidence and W20/21 Q4(b)(ii), a 5-mark mixed phloem block, as adjacent osmosis evidence. Including adjacent contexts gives 4.1.4 exposure in three papers, transport/osmosis exposure in all five, and 4.2.6 exposure in one. These are overlapping opportunities within the cited blocks, not additive topic marks, a full re-audit of every question in those papers, or archive-wide frequencies.

The direct 4.1.3 subtotal is S21/22 Q3(b) 2 + W22/23 Q5(a)(i) 2 + Q6(a) 1 + S23/21 Q3(a) 1 + M24/22 Q1(a)(iii) 1 + Q1(b)(i) 1 + Q1(c)(iii) 2 = **10**. The direct 4.2.1 subtotal is S21/22 3 + W22/23 4 + S23/21 4 + M24/22 4 = **15**. No Paper 5 marks enter these totals.

Exact exam-close replacements:

> 4.1.1-2 closes with M24/22 Q1(a)(ii), QP p.3 / MS p.5, on cholesterol orientation. This validates the 4.1.2 portion; it is not a full fluid-mosaic-model question. 4.1.4 closes with M24/22 Q1(c)(iii), QP p.5 / MS p.7, on secretion/transport and receptor binding. Its two marks can be earned without teaching the optional intracellular examples in the scheme. 4.2.3-4 closes with S21/22 Q4(b–c), QP p.9 / MS p.14, keeping the paper's universal indicator and blue-to-red result distinct from our thymolphthalein demonstration. The 4.2.2a close may use Q4(c) as an agar-diffusion application; no Visking-specific question has been verified in these cited blocks.

Do not invent a full matched-sample manifest or claim that this check exhaustively rescanned the archive. Keep the disclosed distinction from Topic 3's component-balanced sample.

## MUST-FIX 2 — preserve question context, exact quotations and truthful badges

### W20/51: two methods, not one worked sequence

The plan and G04 combine Q1(c)(ii)'s **method 1 mass-change sketch** with Q1(d)(i)'s **method 2 density-drop result**. Q1(c)(ii) supplies no measured dataset or numerical zero crossing. Q1(d)(i) uses Fig.1.4, in which a dyed drop remains at its release level for 0.30 mol dm⁻³, and Table 1.1, which gives −860 kPa. The number is correct; its implied derivation is not.

Replace the W20/51 description in both documents and supplementary row S-B with:

> W20/51 investigates red pepper fruit-wall tissue. Q1(c)(ii), QP p.5 / MS p.9, awards 3 marks for a labelled downward-trending sketch and identifying its zero-mass-change intercept as the estimate. Separately, Q1(d)(i), QP pp.6–7 / MS p.9, uses the density-drop method: the no-rise/no-fall drop identifies 0.30 mol dm⁻³ and the supplied table gives −860 kPa. Our potato mass-change dataset followed by a supplied lookup is an adaptation combining these skills, not the paper's original numerical solution. Label the potato observations illustrative; use the actual Table 1.1 values when illustrating its lookup, and identify them as supplied data from W20/51.

The actual table is: 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70 mol dm⁻³ → −260, −540, −860, −1120, −1450, −1800, −2180 kPa. Do not fabricate arbitrary concentration–potential pairs merely by labelling them illustrative. A chosen illustrative intercept of 0.40 mol dm⁻³ can use the supplied −1120 kPa directly. Keep the paper's red pepper context separate from our potato method.

### Error-register replacements

| Beat | Exact required change |
|---|---|
| E43 | Replace every purported verbatim `I “ions cannot pass through membrane”` with **`I ‘ions cannot pass through the membrane’`**. Change badge to **EXAM CONTRAST**: the current VIDEO-STRUCTURE badge rule names an examiner diagnosis or MS reject line; this is an **ignore** line. Retain the valid bilayer/protein-route repair and its full timing. Do not claim that I is R or that the source proves prevalence. |
| E44 | Keep **COMMON MISTAKE** and the verified R line. Add: **The source asks why many different cell types can respond to the same LL-37 ligand. Explain that these cell types can share its complementary receptor; do not turn specificity into “one ligand, one cell type”.** |
| E45 | Change to **COMMON MISTAKE**. R23 p.12, Q3(a), actually states: **“Most incorrect answers stated that glucose was too large.”** Preserve the subgroup “incorrect answers”; do not rewrite it as most candidates. M24/22 Q1(b)(i) is a sodium-ion question, not a second glucose question. |
| E46 | Keep **COMMON MISTAKE**. Replace the UNVERIFIED-diagram caveat with: **S23/21 QP p.3 shows inward budding at X from the plant cell surface membrane during vacuole development; MS p.8 accepts endocytosis/pinocytosis and rejects phagocytosis. Our simplified fluid-uptake drawing is an adaptation of X, not a reproduction of the complete diagram. W22/23 Q2(a)(i) is the separate macrophage/bacteria context.** |
| E47 | Change to **COMMON MISTAKE**. R23 p.12, Q3(b)(i), actually states: **“Some thought that the membrane protein was an enzyme with an active site, rather than a carrier protein with a binding site.”** It also reports stopping/peak-versus-plateau errors. Keep our composite wording identified as constructed. |
| E48 | Keep **COMMON MISTAKE**. R24 p.54 is a genuine paper-wide quantity-specificity warning, fairly applied to the constructed potato/solution sentences. Keep that application label; do not claim R24/52 was an osmosis paper or that these two potato sentences are candidate transcripts. |

For E45 and the trap-table glucose correction, replace the unqualified claim that glucose “crosses by facilitated diffusion” with:

> Glucose is polar and does not cross the hydrophobic bilayer core readily; it needs a transport protein. In our facilitated-diffusion example, a carrier moves glucose down its concentration gradient without ATP. The protein requirement alone does not establish the direction or energy requirement of every glucose-transport system. In S23/21 Q3(a), naming facilitated diffusion is not the credited reason; state polarity and the hydrophobic bilayer first.

All six beats remain; badge changes do not reduce time or the five-move requirement. The resulting badge count is **five COMMON MISTAKE, one EXAM CONTRAST**.

## MUST-FIX 3 — complete water-potential and cell-equilibrium teaching

The osmosis definition itself is correct. The unqualified “pure water has the highest water potential” and “solutions have negative water potentials” need a reference condition; the diagram must not leave a permanent influx arrow beside a fully turgid cell. The promised three cases are explicitly written for animal cells but only two for plant cells. `plant-equal` is named without an explanation, and `rbc-normal` is implicitly tied to equality even though equality alone does not establish morphology.

Replace the introductory water-potential sentences with:

> Water potential describes water's tendency to move. Pure water at atmospheric pressure is the reference, with water potential 0 kPa. At the same temperature and pressure, adding solute lowers water potential, so the solutions in this comparison have negative values; a less negative value is higher. Net osmosis is from higher to lower water potential through a partially permeable membrane. Water still crosses both ways when the water potentials are equal.

Add to 4.2.6 and propagate to `WaterPotentialModel` / `CellOsmosisSet`:

> Label higher/lower comparisons as the initial condition. As a plant cell takes up water, its expanding contents press against the resisting wall; its water potential rises until it equals that of the surrounding solution and there is no net water entry. Show the net arrow fading at equilibrium while individual water molecules continue crossing both ways. A turgid plant cell can therefore have the same water potential as its surroundings. Equal water potentials mean no net movement, not necessarily a flaccid cell or equal solute concentrations. Similarly, show a normal red blood cell remaining unchanged in the particular equal-potential comparison; do not teach that equality by itself determines a cell's shape. No component-potential names or equations are introduced.

The wall mechanism and changing total water potential suffice at syllabus depth. No solute-potential/pressure-potential calculation is requested.

## MUST-FIX 4 — keep signalling at outline depth without making it empty or universal

In 4.1.4 replace “a cell releases a specific chemical ... by exocytosis” and the response-only glyph specification with:

> In our peptide-hormone example, insulin is secreted by pancreatic beta cells by exocytosis. It travels in the blood and reaches target cells through their surroundings. Binding to complementary cell-surface receptors initiates a specific response; for example, muscle cells increase glucose uptake. Name that response and show a labelled increase in uptake without drawing the intracellular pathway. Different cell types can share the receptor. Exocytosis is the secretion mechanism for this example, not a definition of how every ligand is released.

Replace “the blood reaches every cell” with **“blood carries the signal widely around the body; it can then reach cells through tissue fluid”**. This keeps the biological purpose without implying direct contact of blood with every cell.

Replace the S21/22 Q3(c) teaching attribution with:

> This older question illustrates complementary binding to a cytoplasmic receptor, supplied in its diagram. Use it only as adjacent evidence for specificity. Our taught 4.1.4 mechanism and primary exam close concern cell-surface receptors; no steroid entry/gene-regulation pathway is added.

R24 p.21 supports excluding detailed intracellular events, not omitting a recognisable response altogether. M24/22 Q1(c)(iii) permits secretion/transport plus receptor binding for its two marks; its optional intracellular marking examples do not mandate a cascade lesson.

In 4.2.1b add this model guard:

> The ATP-hydrolysis animation is a simplified directly ATP-driven carrier model. Keep its transported ion generic. Root mineral uptake illustrates energy-dependent accumulation, but do not label the animated ATP-hydrolysing carrier as a nitrate transporter; the example does not specify that molecular mechanism. Co-transport is not taught here.

This avoids attaching an incorrect direct ATP-hydrolysis mechanism to nitrate uptake while retaining the AS-level example. The distinction is supported by experimental plant-uptake research describing proton-coupled nitrate uptake: [Molecular and physiological interactions of urea and nitrate uptake in plants](https://pmc.ncbi.nlm.nih.gov/articles/PMC4871653/).

## MUST-FIX 5 — make practical readouts and repetitions support the claims

None of the selected practical types is inherently impossible. The reagent choices are broadly workable; thymolphthalein's blue-to-colourless treatment is correct. The following instructions prevent misleading measurements and incomplete procedures.

### Agar cubes: endpoint completion is not intrinsic diffusion speed

Replace both occurrences of “1/t ... relative rate ... comparing cube sizes” with:

> Record mean time to complete decolourisation against calculated SA:V. Smaller cubes have shorter paths to their centres and less volume per unit exposed area. Their earlier endpoint does not establish that acid molecules diffuse intrinsically faster through their agar. If 1/t is retained, label it “reciprocal time to complete decolourisation / s⁻¹”, not acid flux, diffusion coefficient or amount transported per second; the cube volumes and amounts of alkali differ. SA:V is calculated from measured edge lengths and may legitimately be plotted as the independent variable.

Replace “the acid front leads slightly” with:

> The colour boundary marks the indicator's pH transition as alkali is neutralised. It is not the position of the first acid molecules, and this demonstration does not measure a fixed separation between two fronts.

Add to the design:

> Use separate equal-volume acid baths for each cube, all from the same acid stock, with sufficient acid in excess even for the largest cube. State the acid concentration, volume and agar alkali preparation before producing results. Support each cube on an open mesh so all faces are exposed. If complete decolourisation is not reached within the observation period, record that limit rather than inventing an endpoint; a separately declared fixed-time penetration measurement may be used instead. Caption compressed waiting time and preserve the real elapsed time on the clock.

The Practical Biology [size/diffusion protocol](https://practicalbiology.org/exchange-of-materials/diffusion/effect-of-size-on-uptake-by-diffusion.html) likewise distinguishes time to centre from penetration distance and allows a cut-section observation when a large cube does not finish. The current global ban on calculated values outside working panels contradicts the plan's SA:V graph; replace it with **“Distinguish measured, calculated, supplied and illustrative quantities by labels; calculated variables may be plotted when appropriate.”**

### Potato: define independent repeats and a warranted estimate

Add after the potato investigation table:

> Use eighteen separately labelled vessels: three independent cylinders per concentration, one cylinder in 20.0 cm³ of solution in each vessel. Record each cylinder's initial and final mass, calculate each percentage change, then calculate the mean for that concentration. Use matched dimensions, random allocation from the same potato and matched immersion times; cover the vessels. Specify the immersion duration before producing the dataset. Include additional concentrations around the sign change when a more precise intercept is needed. Fit a justified smooth trend through the means and interpolate within the tested range. Zero measured mass change provides an estimate of the tissue's initial water potential under these conditions; it is not proof that every cell has identical water potential or that no solute exchange/damage occurred.

Update `PotatoCylinderRig` from six vessels to eighteen, or explicitly show three sequential independent runs with fresh solutions. Three cylinders sharing one tube are not three independently prepared solution replicates.

### Visking: control the sampling intervention and osmometer baseline

Add to the diffusion-bag design:

> Take the outside-water blank before the bag is introduced. Take subsequent samples at their recorded elapsed times; an immediate post-immersion sample is not a pre-contact zero. Use separate matched vessels for the different sampling times, or specify withdrawals small enough that the changing bath volume is negligible. Do not add test reagents to the diffusion bath or return tested samples. Show initial positive tests of the bag contents and the external blank so a negative external starch result is interpretable.

Add to the osmometer design:

> Fill and seal the capillary connection without trapped air; check for leaks. Measure the actual meniscus height after immersion and record that reading at its actual elapsed time. Do not present a pre-immersion mark as an observed post-immersion zero. Interpret later height changes as net volume change only after allowing for initial bag displacement/stretching. Keep the sucrose-permeability limitation: a transient rise is possible, but long-term behaviour also depends on sucrose leakage, bag mechanics and the rising liquid column; it is not a guaranteed constant-rate or permanent osmotic equilibrium demonstration. Select and state the observation interval from a workable setup, rather than inventing a meniscus trace.

The plan is right not to claim that sucrose is absolutely excluded by this Visking tubing. Do not “repair” that correct caution into a false impermeability claim.

## MUST-FIX 6 — finish the REAL-WORLD SAMPLES explanations

The plan is substantially better than a list of specimen names: glucose/starch tests, methylene blue itself, the agar indicator, potato water movement and several interferences are explained. Two pigment descriptions still stop at “coloured sap/pigment”, and the onion drawing risks confusing the vacuolar boundary with the cell-surface membrane.

Insert in the respective real-material entries:

> **Beetroot:** raw beetroot contains vacuolar betalain pigments responsible for its red-violet colour. This readout detects pigment leakage across the vacuolar and cell-surface membranes; it is not a direct measurement of water movement. Rinse cut-surface leakage away, use equal tissue and liquid quantities and mix the liquid before comparing equal optical depths. Keep pH and readout conditions comparable; the colour signal is a proxy for leakage, not a universal numerical permeability value. If using a colorimeter, specify a suitable fixed wavelength/filter, a water blank and readings within the instrument's useful range.

The pigment identity and method are supported by [SAPS: Using Beetroot in the Lab](https://www.saps.org.uk/teaching-resources/resources/754/using-beetroot-in-the-lab/) and the [Practical Biology membrane investigation](https://practicalbiology.org/cells-to-systems/cell-structures/investigating-the-effect-of-temperature-on-plant-cell-membranes.html). Retain 30 °C/70 °C as a two-condition comparison, with three independent tissue preparations per condition and a specified exposure time. Do not attribute the entire difference uniquely to permeability: temperature also changes diffusion, and pigment stability/readout must remain comparable.

> **Red onion:** select a visibly pigmented, living epidermal peel; not every peel is red. Anthocyanin in the vacuolar sap makes shrinkage easier to follow. The coloured vacuole's edge is not itself the cell-surface membrane: plasmolysis is diagnosed by the protoplast withdrawing from the fixed cell wall. Irrigate sufficiently to replace the water mount; 1.0 mol dm⁻³ is the applied stock concentration, not a measured instantaneous concentration at every cell. Record observation times and avoid claiming identical exposure onset across the whole field. The count describes this field and strip; repeat on independent strips before generalising a proportion.

The vacuolar location and uneven pigmentation are established by the primary study [Anthocyanin in the Vacuole of Red Onion Epidermal Cells](https://pmc.ncbi.nlm.nih.gov/articles/PMC6963288/). No pigment structures or new examinable biochemistry are added.

Replace the potato fit sentence with **“Potato contains water, dissolved cell-sap solutes and insoluble starch reserves. We measure tissue mass change as a proxy for net water exchange; this is not a starch assay, and insoluble starch does not make the tissue solute-free or prevent leakage from damaged cells.”**

An `our example` label separates teaching from exam credit; it does not verify a biological claim. Retain ABO only with a verified content source at storyboard stage. Replace the unsourced blanket drip claim with the bounded cell example **“An isotonic saline example shows why matching the effective osmotic conditions around red blood cells can prevent large net changes in their volume.”** No prescription, universal IV-fluid claim or clinical digression is needed.

## MUST-FIX 7 — account for the complete five-move beats

The published sums are arithmetically correct: **87:00 + 4:30 = 91:30; 117 + 6 = 123 macro beats**. But 4:30 buys six **45-second talk-throughs**, while the same documents require each whole error beat to last **65–75 seconds**. Announcing, showing, the silent read and correction have no separately identified allocation. An effective words-per-final-minute rate does not show where that missing time sits within the 87-minute allowance for 117 other beats.

Use this concrete conservative replacement in both timing sections:

> Retain 87:00 for teaching, framing, recaps and exam closes. Reserve 75 seconds for each complete error beat: 45 seconds for the spoken talk-through and 30 seconds for announcement, presentation, the 3–4-second silent read and in-place correction/settling. Six complete error beats use 7:30, giving a provisional topic envelope of 94:30. All six beats and all five moves remain. Actual scripts and visual holds determine final runtime; do not speed narration or trim an evidenced repair to fit. The effective 120 words per final minute remains an estimate, not a script quota or a second allowance for silence.

| Lesson | Replacement budget | 120-wpm timing equivalent, not quota |
|---|---:|---:|
| 4.1.1-2 | 9:00 | 1,080 |
| 4.1.3 | 10:15 | 1,230 |
| 4.1.4 | 7:00 | 840 |
| 4.2.1a | 10:45 | 1,290 |
| 4.2.1b | 11:15 | 1,350 |
| 4.2.6 | 8:15 | 990 |
| 4.2.2a | 9:30 | 1,140 |
| 4.2.2b | 7:30 | 900 |
| 4.2.3-4 | 9:45 | 1,170 |
| 4.2.5 | 11:15 | 1,350 |
| **Total** | **94:30** | **11,340** |

Outcome 4.2.1 becomes 22:00; all other affected outcome totals follow the lesson table. Section 4.1 becomes 26:15 and section 4.2 becomes 68:15. Use 5,670 seconds for revised percentage shares: 4.1.1 5.3%, 4.1.2 4.2%, 4.1.3 10.8%, 4.1.4 7.4%, 4.2.1 23.3%, 4.2.2 18.0%, 4.2.3 4.5%, 4.2.4 5.8%, 4.2.5 11.9%, 4.2.6 8.7%. Beat counts remain 117 + 6.

This is a defensible reservation, not a claim that 94:30 guarantees a complete script. E46/E48 each repair two faults; check their complete narration before approving their final lengths. The three-practical 4.2.2a lesson is the other pacing risk: publish apparatus setup, actual waiting-time compression and readout interpretation explicitly instead of silently omitting them.

## Citation audit

### Literal quotations tagged PDF-UNCHECKED, including repeats

“Verbatim match” below permits whitespace and typographic quotation-mark differences, not missing words. R/I labels are included as marking instructions rather than narrated biology. The plan has 13 literal PDF-UNCHECKED tags and WEIGHTS has four; several tags govern whole sections, so tag count is not quotation count.

| Quotation as supplied | Locations / actual source page | Verdict | Actual source and consequence |
|---|---|---|---|
| `ions cannot pass through membrane` | Plan 4.1.3 keys/E43; WEIGHTS ledger/E43 and repetitions; W22/23 MS p.19 Q6(a) | **MISMATCH** | Actual: `I ‘ions cannot pass through the membrane’`. Missing **the**. Biological distinction supported; restore the article and preserve I. |
| `active site` | Plan 4.1.4/E44; WEIGHTS ledger/E44; W22/23 MS p.17 Q5(a)(i) | **VERBATIM MATCH** | Actual: `R active site`. The question is about different cell types responding to LL-37. |
| `active transport` | Plan 4.2.1/E46; WEIGHTS ledger/E46; W22/23 MS p.9 Q2(a)(i) | **VERBATIM MATCH** | Actual: `R active transport`. The same point accepts active process/ATP/energy; phagocytosis/endocytosis is credited elsewhere in the answer. |
| `phagocytosis` | Plan 4.2.1/E46; WEIGHTS ledger/E46; S23/21 MS p.8 Q1(b)(i) | **VERBATIM MATCH** | Actual: `endocytosis / pinocytosis ; R phagocytosis`. Rendered QP p.3 confirms the particular inward-budding context. |
| `not specific` | Plan 4.2.5/E48; WEIGHTS S-F/E48 and tariff; R24 p.54, P52 key messages | **VERBATIM MATCH** | Full relevant sentence: **“The term ‘amount’ is not accepted as it is not specific.”** A paper-wide warning, not an osmosis-specific candidate quotation. |
| `any 6` | Plan's M24/52 planning citation; WEIGHTS S-D and tariff; M24/52 MS p.6 Q1(c)(i) | **MISMATCH if presented as a literal quote** | Actual: `any six from:`; mark tariff 6. Meaning preserved, typography is a shorthand. Write “maximum 6 marks; any six listed points” as a paraphrase, or quote exactly. |
| `−860 kPa` / G04's `the cited result is −860 kPa` | Plan 4.2.5; WEIGHTS S-B/tariff; W20/51 MS p.9 Q1(d)(i) | **VERBATIM MATCH for the numerical answer**; enclosing sentence is G04 prose | Actual answer `–860kPa ;`. It belongs to method 2, not Q1(c)(ii)'s mass-change sketch. |

No unique direct exam quotation remains unchecked. No literal exam quotation was **not found** after obtaining R24. The two mismatches above are a missing article and a number-word shorthand; neither is evidence of a fabricated marking rule.

### Quoted secondary summaries: not verbatim Cambridge quotations

These are explicitly labelled G04/EXAMINER-INSIGHT language in the drafts. They must not migrate onto an MS/ER quote card. **NOT FOUND (as verbatim)** here does not mean the underlying claim is absent; the final column records its actual support or correction.

| Secondary wording, grouped across duplicate occurrences | PDF check | Status and substantive ruling |
|---|---|---|
| “the property of the substance to the hydrophobic membrane interior”; “Cannot cross the membrane ... too absolute”; “Require discrimination between the bilayer and the protein-mediated route” | M24/22 MS p.5; S23/21 MS p.11; W22/23 MS p.19 | **NOT FOUND as verbatim**; valid G04 teaching paraphrases. M24 concerns sodium; S23 concerns glucose. |
| “rejects calling the hormone/receptor an antigen or enzyme” | S21/22 MS p.12 | **NOT FOUND as verbatim**; actual: `Reject if hormone S or receptor R described as an antigen or enzyme`. Supported, but receptor R is cytoplasmic. |
| “Interpret uptake saturation as a limited number of transport proteins”; “Connect the plateau to transport capacity, not simply 'no more diffusion'” | S23/21 MS p.11 Q3(b)(i), R23 p.12 | **NOT FOUND as verbatim**; supported interpretation. MS requires plateau/constant uptake and saturated/limiting carriers, 2 marks. |
| “distinguishes glucose polarity and the hydrophobic bilayer from a size-only answer” | R23 p.12 Q3(a) | **NOT FOUND as verbatim**; supported. The actual size-only diagnosis is quoted in MF2. |
| “Do not reject phagocytosis in the macrophage task above” | W22/23 MS p.9 versus S23/21 MS p.8 | **NOT FOUND as verbatim**; sound G04 contextual instruction, not an MS sentence. |
| “osmosis within phloem transport”; “membrane transport or receptor specificity: 5/5” | W20/21 MS p.10 and the five cited C2 pairs | **NOT FOUND as verbatim**; first is a valid description, second is G04's sample count. Preserve mixed/adjacent coding. |
| “credits range/dilution, controls and percentage-change interpretation” | W20/51 MS pp.7–9 | **NOT FOUND as verbatim**; supported across different parts: Q1(a)(ii) 3, Q1(b) 6, Q1(c)(i) 2, Q1(c)(ii) 3. |
| “Find the zero crossing ... supplied lookup ... −860 kPa” | W20/51 QP pp.5–7 / MS p.9 | **NOT FOUND as verbatim**; **contextual mismatch** if taught as one original solution. Two separate methods; MF2. |
| “including untested intermediate concentrations, variation among cells and missing uncertainty information” / “credits limitations including ...” | M24/52 MS p.5 Q1(b)(ii) | **NOT FOUND as verbatim**; supported as selected examples from any four of eight points. Context: onions, sodium chloride, including the 48-hour result; not all points are compulsory. |
| “requires hazard, risk and linked precaution for its single mark” | M24/52 MS p.7 Q1(c)(iii) | **NOT FOUND as verbatim**; actual requirement is `ref. to hazard and risk and precaution ;`, 1 mark. Supported. |
| “An unspecified amount does not establish whether mass or volume is controlled. A practical gate should request the quantity, unit and operation.” | R24 p.54 | **NOT FOUND as verbatim**; the first is a fair inference from the key message; the second is our learning-design instruction. |
| “Detailed intracellular events were not required at AS level in this signalling question.” | R24 p.21, P23 Q5(a) | **NOT FOUND as verbatim**; supported paraphrase. The report also notes omitted secretion/transport stages. |
| Seeds from one packet/flower are not genetically identical controls (S-H) | R24 p.55 Q1(e) | **Paraphrase supported**, not an osmosis context. Correct to leave it outside Topic 4 teaching. |
| G04 scope/gate prose about missing full rubrics, thermodynamic constants and conclusions belonging to the dataset | Syllabus pp.21–22; relevant QP/MS contexts | **NOT FOUND as verbatim examiner text**; correctly identified as G04 editorial guidance. Retain the attribution; no invented examiner quote is needed. |

### Exact credit/context checks beyond the short quotations

| Citation | Checked result |
|---|---|
| M24/22 Q1(b)(i), MS p.5 | **1 mark confirmed**: sodium ions' charge and the hydrophobic/non-polar bilayer. |
| M24/22 Q1(b)(ii), MS p.6 | **3 marks confirmed**: one similarity and two differences. Conformational-change similarity is conditional on carrier context, with incorrect channel context rejected. |
| S23/21 Q3(a), MS p.11 | **1 mark confirmed**: polar/water-soluble/hydrophilic substances and the bilayer core. Scheme explicitly ignores size-only, active transport and facilitated diffusion at this point. |
| S23/21 Q3(b)(i), MS p.11 | **2 marks confirmed**: constant/plateau uptake and carriers at capacity. The QP uses grape hexose transporters inserted into mutant yeast, QP pp.8–9. Saturation alone is not a universal way to distinguish active from facilitated transport. |
| S21/22 Q3(c), MS p.12 | **1 mark confirmed**, but intracellular context; MF1/MF4. |
| W22/23 Q5(a)(i), MS p.17 | **2 marks confirmed**, any two of receptor identity/location/complementarity, not all three compulsory. |
| M24/52 Q1(c)(i), MS p.6 | **6 marks confirmed**, any six of nine. Actual plan varies temperature of turnip blocks in distilled water, with at least five stated temperatures and independent blocks for repeats. This is related planning evidence, not the exact beetroot or potato-concentration protocol. |
| M24/52 Q1(c)(iii), MS p.7 | **1 mark confirmed**, linked hazard/risk/precaution. |
| S21/22 Q4(b–c), MS p.14 | **2 + 1 marks confirmed**; calculation and agar endpoint ordering must be distinguished. |
| W20/51 Q1(c)(ii), Q1(d)(i), MS p.9 | **3 + 1 marks confirmed**, but distinct methods. |

## Should-fixes and authoring guards

1. **Protein terminology:** replace “intrinsic (transmembrane) proteins” with **“intrinsic proteins are embedded in the bilayer; the channel, carrier and receptor examples drawn here span it and are transmembrane proteins.”** Intrinsic is not a universal synonym for spanning the whole membrane.
2. **Membrane/gradient geometry:** the shared contract says outside/top, inside/bottom, but gradients run left-to-right. Add **“In membrane-crossing scenes put the gradient across the membrane, along its normal. Left-to-right compartment layouts explicitly rotate and relabel the membrane; carbohydrate chains still face the outside.”** Otherwise the generic arrow can run along the membrane rather than across it.
3. **Cholesterol animation:** the ban on changing drift speed is overcautious. A clearly labelled qualitative schematic can show restrained motion at higher temperatures and prevention of close packing at lower temperatures without pretending to be measured data. Current labelled-only teaching is permissible, but animation would better support the role explanation.
4. **Dye-in-agar wording:** replace “the dye does not react with the agar” with **“We follow visible dye spreading through hydrated agar; colour/adsorption and visibility thresholds can affect the apparent boundary, so diameter is an operational colour-zone measure.”** Do not infer a diffusion coefficient or concentration from the faint boundary.
5. **RBC/lettuce examples:** the lettuce example is already suitably bounded as a turgor demonstration, not a water-potential measurement. Keep haemolysis specific to red blood cells; other animal cells may lyse without that name.
6. **Universal rules:** keep glucose tied to its named carrier example, avoid saying every channel has the same pore selectivity, and do not label every glycoprotein a receptor or every carbohydrate chain an ABO antigen. The current “some” receptor wording is good.
7. **Safety wording:** the plan calls dilute acid/alkali irritant/corrosive without specifying concentration. Replace with **“Specify the actual working concentration and its corresponding hazard information; show eye protection and the relevant handling precaution.”** Hazard labels must match the solutions used, not the stock chemicals by default.
8. **Full lesson shape:** the global statement claims compliance, but several lesson entries do not yet name a hook/handle or exam close. Add one global authoring instruction: **“Every release lesson, including both practical halves, has a developed context, objectives surface, mechanism/investigation explanation, recap on its diagrams and an honestly sourced exam close. A syllabus-based close is labelled as such.”** Do not invent examiner rejects just to fill a closing card.

## Final ruling and return required

**NOT CLEARED for storyboard authoring in its present form.** Apply MF1–MF7 to the plan and weights together, then recheck the propagated evidence counts, local-question contexts, model labels and timing table. Retain all ten outcomes, ten release lessons, 117 teaching beats and six complete error beats. The source-backed material is usable; there is no need to discard the plan or add advanced membrane/signalling machinery.

This is a plan check, not clearance of nonexistent scripts, bench results or rendered frames. No physically impossible practical type or wrong thymolphthalein hue was established; the required practical changes concern what the readouts can support, actual specimen contents, independent repeats and honest source adaptation.

Reviewed SHA-256:

- `TOPIC-PLAN-04-MEMBRANES.md`: `7e9912ce322a84bfa9912875a5ac3303502311885d4a55cafa50d937bb552fee`
- `TOPIC-04-WEIGHTS.md`: `f4fde6ee6be1515066daacd4c174ab03be20aec5790183e85a1ffbf22eda451e`
- Retrieved official R24 PDF: `ff0680bed120861fdf6fde40ae403e94ee40c6a626413e25bebf1d747471a41e`
