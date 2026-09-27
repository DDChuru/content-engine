NOT CLEARED

Independent round-one check of **4.2.2b — Investigating diffusion and osmosis: plant tissue**, 27 September 2026. The biological explanation, sample identities and numerical data are substantially sound. Repair the contradictory removal schedule, the membrane inset's compartment labels and the exam-close precision before narration/build. The length does not block clearance.

Reviewed STORYBOARD.md SHA-256: `e3ba0f8ddb1216a46fb66d93f8e3ee296f7561cb12cbfb2fa5418dd615b03236`.

Read the complete storyboard, relevant amended plan and weights, plan-check rulings, SHARED-SPECS, SUMMARY, complete current VIDEO-STRUCTURE (including the superseding duration rule and REAL-WORLD SAMPLES), and the syllabus outcomes/practical/mathematical passages. Checked the published 4.2.6 plant-state contract. Modelled this report on the requested Topic 3 check. Independently extracted actual examination PDFs with `pdftotext -layout`; no rendered lesson was available. Only this CHECK.md is written for this code.

## Must-fixes

### M1 — End the staggered beetroot runs in their actual chronological order

The rig and Dataset A correctly specify starts at 0, 1, 2, 3, 4 and 5 minutes and removals at 30, 31, 32, 33, 34 and 35 minutes. Beat 5 action 1 instead removes **70-A first**, then says the other tubes follow at their own 30-minute marks. On the one continuously running clock, 30-A/B/C must already have ended before 70-A. A literal build cannot satisfy both instructions.

Replace Beat 5 action 1 with:

> From the first frame, BeetrootRig remains in-baths with the same running clock. At “After thirty minutes”, the clock reads 30:00 and tube 30-A is lifted with a holder. At “lift out the discs”, remove its discs with forceps. In a captioned time-compressed sequence, end 30-B at 31:00, 30-C at 32:00, 70-A at 33:00, 70-B at 34:00 and 70-C at 35:00. Highlight each tube's logged start and end together: elapsed exposure 30 min. Never reset or run the clock backwards. All 70 °C tubes are lifted with a holder.

Add to the rig's timing contract:

> Add each ten-disc batch promptly, using the same loading procedure and approximately the same loading duration in every tube. First-disc contact defines that tube's nominal exposure start; remove each batch promptly at its scheduled endpoint. The individual discs do not all make contact simultaneously.

This preserves the authorised protocol and acknowledges its finite handling time rather than claiming perfect synchrony.

### M2 — Keep the two membrane compartments anatomically correct

The heat-damaged inset explicitly uses **outside the cell / cytoplasm** on a single membrane and then calls it a model of both the tonoplast and cell-surface membrane. Those labels describe only the latter. A tonoplast separates vacuolar sap from cytoplasm. Do not invite a copied diagram in which vacuolar pigment crosses directly from cytoplasm through a purported tonoplast into external water.

Replace the final bracket/model-of-both instruction in the heat-damaged model and Beat 5 action 8 with:

> The enlarged bilayer inset represents the cell surface membrane only: outside the cell above, cytoplasm below. Caption: “cell surface membrane enlarged; pigment has already crossed the tonoplast”. Keep the whole-cell thumbnail from Beat 3 beside it, with a vacuole bounded by the tonoplast inside the cytoplasm and a separate cell surface membrane. At the pigment-diffusion cue, animate pigment from vacuolar sap across the tonoplast into cytoplasm, then across the cell surface membrane into external water. Label the two crossings “tonoplast” and “cell surface membrane”. Both membranes can be damaged; the enlarged inset illustrates membrane disruption, not identical composition of the two membranes.

Retain the shared lateral-motion/no-flip-flop convention. The whole-cell thumbnail supplies the missing topology without another teaching beat or additional narration.

### M3 — Make the exam close specific to the actual questions and optional marking points

The safety quotation is exact. The two descriptive rows are broadly grounded, but “variation among cells” drops the credited biological variable, while “the credited plan uses” and “a plan needs a range” risk turning selected alternatives into a universal compulsory checklist.

Replace Beat 10 narration from “In March 2024” through “variation among cells” with:

> March twenty twenty-four Paper fifty-two asks how temperature, from ten to fifty degrees, affects osmosis in turnip blocks in distilled water. Six marks are available from nine listed points. Creditable choices include five stated temperatures and three different blocks per temperature with a mean. That question needs a temperature range. Its onion question challenges a water-potential conclusion: onion cells need not all have the same water potential.

Keep the following beyond-the-mark-scheme pigment sentence and hook callback. Replace row 1's selected-point text with:

> M24/52 Q1(c)(i), QP pp.6–7 / MS p.6: temperature and rate of osmosis, 10–50 °C; maximum 6 marks from nine alternatives. Selected creditable points: at least five stated temperatures; at least three different blocks at each temperature and a mean. Our paraphrase; related planning evidence, not this beetroot protocol.

Replace row 2's text with:

> M24/52 Q1(b)(ii), QP pp.4–5 / MS p.5: assess the conclusion that onion-cell water potential equals that of 4.2% sodium chloride. Four marks from eight alternatives. Examples: intermediate concentrations between 1% and 5% untested; no statistical analysis/standard error/95% confidence interval; onion cells need not all have the same water potential. Our paraphrase.

Replace “a two-condition comparison ≠ a planned range” with **“this question asks for a range: 10–50 °C”**. The two-condition beetroot investigation remains valid for its stated comparison. Remap the affected cues; do not retain cues removed by the replacement. The PDF resolution below replaces the corresponding UNVERIFIED entries and applies to the causal spine, scope ledger, citations and interpretations as well.

## Should-fixes

1. **Concentration units in speech.** Beat 7's second “one mole” is an amount, not a concentration. Replace **“one mole is the stock you applied”** with **“that is the stock concentration you applied”**, and remap that cue. The earlier full concentration and screen label are correct.
2. **pH comparability.** Distilled water throughout does not itself demonstrate equal final pH after tissue leakage. Replace interpretation 3's implication of a demonstrated pH control with **“The same distilled-water stock is used; final pH is not measured here. pH and pigment stability remain limitations of interpreting colour solely as leakage.”** Keep the existing caveat in speech. Do not add an untested buffer or numerical correction.
3. **Standard preparation.** Dataset A defines the extract and dilutions, but the apparatus sequence never shows their preparation. A brief inset at the existing standards cue should show crushed tissue, filtration and measured dilution, with pestle/mortar/filter apparatus labelled. No new spoken protocol is necessary.
4. **Range terminology.** For the unequal-concentration ordinal standards, label the displayed endpoints **“observed category span 1–2”** and **“observed category span 4–5”**, rather than implying these are numerical concentration ranges. Medians 1 and 4 are valid. The standard dilutions are unequal steps; their labels must not become quantitative pigment measurements.
5. **Onion start event.** Preserve the model's atomic first-contact trigger. Beat 7's earlier liquid-front cue must not carry the front onto the tissue before the later timer cue: hold it short of the tissue until contact and clock start occur together. Likewise, a two-second final hold belongs inside the effective runtime allowance unless the eventual audio edit adds it separately.

## Scope, science, real samples and shared models

The outcome quotation matches 4.2.2 verbatim, ignoring editorial bolding of “including”. Plant-tissue diffusion and osmosis are both investigated; Visking/agar and quantitative water-potential estimation are explicitly handed to their owners. No facilitated-diffusion/active-transport confusion, component-potential equations, hormone cascade or extra osmotic calculation is introduced.

Beetroot pigment is correctly identified as vacuolar betalain; the red-onion pigment as vacuolar anthocyanin. The leakage readout is distinguished from water movement and numerical permeability. The temperature/diffusion and pigment-stability limitations are spoken, and the exam extra is both spoken and visually separated from marking points. [SAPS](https://www.saps.org.uk/teaching-resources/resources/754/using-beetroot-in-the-lab/) independently supports betalain identity, two-membrane passage and heat/pH-dependent pigment stability. Its reference does not validate the invented colour scores. The [primary red-onion study](https://pmc.ncbi.nlm.nih.gov/articles/PMC6963288/) supports vacuolar anthocyanin and variable pigmentation, including outer-epidermis pigmentation. Practical Biology's direct page fetch returned HTTP 403, but its [indexed primary protocol](https://practicalbiology.org/cells-to-systems/cell-structures/investigating-the-effect-of-temperature-on-plant-cell-membranes.html) was subsequently retrieved in search: it supports a 30-minute exposure, white-card comparison and a blue/green filter or 530 nm colorimeter setting. It does not validate this storyboard's illustrative colour scores.

Water potential is correctly compared **initially**, lower outside → net water loss through partially permeable membranes. The wall stays fixed, the protoplast withdraws, and external solution fills the gap. The coloured vacuolar boundary is distinguished from the cell surface membrane. Plant-turgid-equilibrium, plant-flaccid and plant-plasmolysed exist in the actual 4.2.6 storyboard; the short SHARED-SPECS state list is incomplete, not grounds to invent a new name. The initial water-mount equilibrium has continuing crossings and no net arrow. In the shrinking-cell demonstration the net outward arrow denotes ongoing loss, not a proven final equilibrium.

The 70 °C mechanism is a qualitative model of this tissue treatment, not a universal membrane failure threshold. Pigment motion is animated; proteins unfold without invented covalent chemistry. Same-hue beetroot and onion colour rules pass. Borer, scalpel, coverslip, irrigation, holder and pour geometry are specified plausibly; M1 fixes the sequencing contradiction. No rendering or bench validation is claimed.

All ten beats establish apparatus/models from the first frame. Objectives use their own pictograms; recap uses the familiar rigs; close retains both rigs. Cue-driven changes and motion prevent an extended static slide. No evidenced error beat is allocated: five-move/65–75 s requirements are therefore not applicable. The brief final wording contrast is correctly identified as the author's own, never an examiner diagnosis. Retain it: current VIDEO-STRUCTURE and SHARED-SPECS require the close's reject card, and the user explicitly makes those standards binding.

## Numerical audit

| Item | Independent check |
|---|---|
| Beetroot exposures | Starts 0–5 min; corresponding endpoints 30–35 min. Correct in Dataset A; inconsistent in Beat 5 until M1. |
| Dilutions | 0.5/8, 1/8, 2/8, 4/8, 8/8 = 1/16, 1/8, 1/4, 1/2, 1. Each standard contributes 5.0 cm³ to the matched-depth readout. |
| Ordinal results | Sorted 1,1,2 and 4,4,5 give medians 1 and 4; no averaging of ordinal categories. |
| Onion percentages | 6/28 = 21.4%; 19/28 = 67.9%; 27/28 = 96.4%; 25/26 = 96.2%; 30/31 = 96.8%, at the displayed precision. Zero of 28 is genuinely the pre-sucrose baseline. |
| Evidence status | All observed-looking demonstration values are explicitly illustrative; percentages and medians are labelled calculated. The colorimeter's 0.00 is explicitly a blank-zero setting, not an invented sample reading. |

## Citation audit against actual PDFs

Local PDF root: `/home/dachu/sme-9700-archive/pastpapers/`. Page numbers below are printed/PDF page numbers, which agree for these passages. Repeated claims are audited once and the ruling applies everywhere.

| Storyboard evidence | Primary source checked | Finding / replacement status |
|---|---|---|
| Outcome 4.2.2; apparatus and mathematical quotations; Paper 5 skills | User-specified SYLLABUS-9700-DETAIL.md, pp.21, 57, 59, 63 | All match, including the four named Paper 5 skills and the two mathematical requirements. |
| “ref. to hazard and risk and precaution ;” | `2024/March/9700_m24_ms_52.pdf`, p.7 Q1(c)(iii) | Exact match; 1 mark. Its table includes cutting and hot-water precautions. **PDF-CHECKED (independent round 1)**. |
| Maximum 6; nine planning alternatives; five temperatures; different blocks | Same MS p.6 Q1(c)(i); `9700_m24_qp_52.pdf`, pp.6–7 | Verified. QP specifies rate of osmosis and 10–50 °C. MS point 8 specifies at least three different blocks at each temperature **and a mean**. These are optional points in “any six from”, not nine compulsory conditions. M3 provides exact replacement. **PDF-CHECKED**; resolves UNVERIFIED 1 and turnip portion of 3. |
| Onion limitations; four of eight | Same MS p.5 Q1(b)(ii); same QP pp.2–5 | Verified but sharpen as M3. QP uses whole small onions, 2 h and 48 h, and challenges the 4.2% conclusion. MS specifically names variation in **water potential**; its 48 h intercept is 3.1%. Intermediate 1–5% concentrations and missing uncertainty/statistics are supported. **PDF-CHECKED**; resolves UNVERIFIED 2 and onion portion of 3. |
| Agar diffusion, S21/22 Q4(c), mentioned only as sibling-owned evidence | `2021/June/9700_s21_ms_22.pdf`, p.14 | One mark; A → B → C accepted. No beetroot claim follows from this. |
| No direct beetroot/red-onion-epidermis question in the cited blocks | Above question contexts | Correct for these blocks. The whole-onion mass experiment is not red-onion plasmolysis. Retain this bounded evidence limitation; do not claim archive-wide absence. |
| Real onion micrograph | No sourced asset supplied | Remains an asset dependency. Drawn model is honestly labelled; never generate a micrograph. |

The nine planning points are: at least five stated temperatures; maintain each temperature; same/stated turnip variety/age; same/stated block dimensions; apparatus to obtain them; blocks in distilled water at each temperature; initial and final mass after stated time; at least three different blocks per temperature and a mean; remove excess surface water before final weighing. This is a paraphrase for provenance, not a required new nine-point lesson.

The eight onion points concern duration-limited support, the 48 h intercept, qualified experimental error, anomalies, alternative best-fit values, missing intermediate concentrations, absent uncertainty/statistical analysis, and unequal cell water potentials. All original PDF-UNCHECKED exam rows can now be resolved; retain paraphrase labels and cite this independent audit rather than incorrectly calling the new verification “plan check”.

## Runtime and validation ruling

Fresh validator run: **957 words, 118 cues, 10 beats, zero failing beats**, no missing-section or citation warnings. Beat word counts **88, 53, 93, 108, 137, 95, 120, 85, 74, 104**; maximum uncued stretch **25 words**. Manual timing/visual review found M1 despite syntactically valid cues.

**7:58.5 at 120 effective words/minute**, versus **7:30**, is an honest **28.5 s** overrun. **Accept the overrun**: two distinct methods, meaningful handling and honest readouts justify it. Do not cut “without lifting the coverslip” to save two seconds. Keep the optional colorimeter sentence if that inset remains; silent technical labels alone are a poorer explanation. If a small trim is wanted, the ten-word recap sentence “Three tubes per temperature, rinsed discs, equal depth, against standards” is expendable, provided its existing tags brighten at a surviving cue. No acceleration or split is required. Recount after M3 and cue repairs; current timing is a draft estimate, not a rendered duration.

**Final verdict: NOT CLEARED.**
