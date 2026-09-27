NOT CLEARED

Independent round-one check of **4.2.2a — Investigating diffusion and osmosis: Visking tubing and agar**, 27 September 2026. The three-investigation scope is appropriate, the materials are explained, and the cited agar answer is correct. The osmometer trace violates the amended plan's explicit evidence requirement; its volume interpretation, sampling sequence and closing reject need correction before narration/build. Length alone does not block clearance.

Reviewed STORYBOARD.md SHA-256: `0ff74b5780ae15f64a91cea6ed89fd2298d204572d9cf70faf9c5f76e7e38a84`.

Read the complete storyboard, relevant amended plan and weights, plan-check MF5–MF7 and practical guards, full current VIDEO-STRUCTURE including REAL-WORLD SAMPLES, syllabus outcome/apparatus/materials/mathematical passages, SHARED-SPECS and SUMMARY. Compared the relevant shared passive-transport/water-potential contracts and the neighbouring practical/agar lesson references. Ran the supplied validator. Original examination PDFs were extracted with `pdftotext -layout`; S21/22 QP p.9 and the supplementary S21/21 QP p.6 were also rendered and inspected. No lesson render or bench trial was available. Only this CHECK file was written for this code.

## Must-fixes

### M1 — Withdraw the invented osmometer readings and separate column volume from net entry

The amended plan says **“Select and state the observation interval from a workable setup, rather than inventing a meniscus trace.”** SHARED-SPECS explicitly gives the amended plan precedence. Plan interpretation 5 acknowledges that the 48–105 mm trace was invented, but treats an illustrative-data label as permission. It is not. The first value is also narrated and shown as a “first real reading” before the illustrative-data caption appears in Beat 9.

Replace Dataset 2's numeric trace and its claim of an established 1–21 min operating interval with this production requirement:

> **Osmometer evidence pending.** Obtain a recorded run for the specified tubing, sucrose concentration, capillary bore, bag geometry, external bath and temperature. Record first contact, the actual first post-immersion reading and each later elapsed time; select the usable observation interval from that run. Until those records are available, this rig is a qualitative schematic: no numerical meniscus readings, timed numerical trace or empirical control series is displayed. Do not substitute an invented trace labelled illustrative. Preserve the apparatus, first-contact clock and instruction to take actual readings.

Remove the invented 48/57/65/72/…/105 and control 51/52 readings from the models, graph, Beats 8–9/12 and corresponding scope/assets claims. A retained graph before those records arrive must be unnumbered, labelled **qualitative schematic; not measurements**, with no reading crosses or fabricated elapsed-time positions. The numerical demonstration remains an evidence dependency before clearance, not a claim that the present check obtained measurements.

Replace Beat 8's final sentence exactly with:

> The meniscus can shift as the bag settles, so take the first reading after immersion and record its actual elapsed time; do not call a mark made beforehand a zero-time reading.

Replace Beat 9's first three sentences exactly with:

> Record the meniscus at stated elapsed times, using the same fixed ruler. Choose the observation interval from a trial of the actual apparatus. Compare with a matched bag containing distilled water, while recognising that this control cannot reproduce the stretching caused by osmotic inflow.

Cue these to the actual reading procedure, fixed ruler and labelled control, not the withdrawn numeric trace. Retain a **possible** rise as motion in the qualitative schematic and all the correct water-potential explanation.

**The volume calculation is arithmetically right but measures the wrong quantity.** π × (0.050 cm)² × 5.7 cm = **0.0448 cm³** is the increase of liquid volume in the capillary. It is not necessarily total liquid entering an extensible bag. “After allowing for stretching” supplies no measured correction, and a water-filled control does not experience the same osmotic stretching as the sucrose bag.

Replace Beat 9's bore sentence exactly with:

> With a uniform bore, a rise in height means more liquid in the capillary. It does not measure all the water entering, because the bag can stretch and sucrose can leave.

Replace its action 6 tag with **“uniform bore: height change tracks capillary-column volume change”**. Remove **“0.045 cm³ entered”** and the 0.9%-of-bag inference. If the arithmetic is retained in the author's audit, label it exactly **“hypothetical geometric example only: capillary volume increase, not measured net water entry”**; do not animate it as a reading. Replace the Real-world samples readout cell with **“meniscus displacement indicates a change in capillary liquid volume; net entry into the whole rig is not quantified without accounting for bag-volume changes, leakage and solute movement.”**

Also replace the unconditional spine/Beat 9/recap claim that the rise *is* transient with **“a transient rise is possible; the later behaviour depends on sucrose leakage, bag mechanics and the rising liquid column.”** The plan gives a limitation, not a guarantee of one particular rise-and-fall trajectory. Any longer-term dashed curve must say **one possible qualitative course**, remain separate from data and carry no invented times.

### M2 — Make the blank and sample volumes physically available, and prevent carry-over

The current method takes **2.0 cm³ for Benedict's plus an additional iodine drop**, yet states that 32 cm³ becomes exactly 30 cm³. It also empties two 1 cm³ pipette portions into Benedict's and then dispenses an unexplained remaining drop. A shared rinsed pipette can carry concentrated mixture into later blanks unless its use and emptying are explicit. Initial contents tests need additional stock beyond the three 5 cm³ bags.

Use this exact replacement sampling contract in `VKTubingRig`, Beats 4–6 and Dataset 1:

> Prepare **20 cm³ of mixture from 10 cm³ of 1% starch suspension and 10 cm³ of 10% glucose solution**. Mix before dispensing three 5.0 cm³ bag portions and retain a separate portion for the initial tests. Each bag therefore still starts with 0.5% starch and 5% glucose. Use separate clean equipment for the concentrated contents, starch control and outside-water samples.
>
> Put **33 cm³ distilled water** into each boiling tube. Before introducing its bag, remove a **3.0 cm³ blank aliquot** into a clean labelled sample vial, leaving a nominal **30 cm³** bath. Transfer **2.0 cm³ from that vial** to the Benedict's tube; use a separate clean dropper to place one drop from the remainder on the iodine tile; discard the rest. No tested liquid or pipette that has touched reagent returns to the vial or diffusion bath.
>
> At each selected elapsed time, withdraw **3.0 cm³** from that tube into a fresh labelled vial, using clean sampling equipment and sampling away from the bag. If using the 1 cm³ pipette, show three separate measured transfers. Record the withdrawal start time; the stopwatch continues through the brief collection interval. Mix the collected aliquot gently, then divide it exactly as for the blank: 2.0 cm³ for Benedict's, a separate drop for iodine, remainder discarded. Each diffusion tube is sampled only once, so this withdrawal does not alter a later measurement from the same tube.

Replace Beat 6's sampling sentences exactly with:

> At three minutes, collect a three-cubic-centimetre sample from tube one into a clean labelled vial, away from the bag. Use two cubic centimetres for the Benedict's test and a separate drop for iodine. Tubes two and three are sampled the same way at ten and twenty minutes.

Replace the sampling labels with **“withdrawal started at 3:00”**, **“withdrawal started at 10:00”**, **“withdrawal started at 20:00”**; do not freeze a clock at exactly one instant while three transfers occur. Apply the same sample division to the initial positive tests.

For the batch Benedict's heating, add exactly:

> Use a labelled rack or individual timed placements so that each tube receives five minutes in the boiling-water bath. Start its heating interval on immersion; remove it after that interval with the holder. Show colour development during heating. The later colour-name cues highlight the already-developed results on white card; they do not start a second colour reaction after removal.

The bag and osmometer immersion clocks already attach to first contact correctly; preserve that.

### M3 — Repair the agar drop event, liquid depth and two-direction measurement

Beat 10 action 6 squeezes/releases at *from a dropper held above*, then action 7 starts contact at a later phrase. Make contact, rather than the later narration, own the timer. Exact replacement for actions 6–7:

> At *three drops of methylene blue*, show the bottle label, working concentration and eye protection. At *from a dropper held above*, release the first drop from the tip above the well. **On the actual frame that drop first contacts the well, start the stopwatch.** At *The stopwatch starts as the first drop reaches the well*, highlight the already-running clock and contact marker; do not reset it or release a replacement first drop. Add the other two drops from above, with the surface level and the lid then replaced.

Three nominal 0.05 cm³ drops total **0.15 cm³**, but the 8 mm × 5 mm well holds **0.251 cm³**. It does not become full, as the `dye` state and Beat 11 opening instruct. Replace every “fill the well”/“well full” direction with:

> Three nominal 0.05 cm³ drops give about 0.15 cm³, a liquid depth of about **3 mm** in the 5 mm-deep well. Draw a partly filled well, below the agar surface, without overflow; three drops are a nominal volume, not a calibrated measurement.

A single immobile ruler under the dish cannot directly supply two orthogonal readings without a rotation/repositioning procedure. Preserve the unmoved dish by replacing the measuring rig instruction with:

> Place the dish on white **millimetre-grid backing with two fixed perpendicular scales**. View from directly above to reduce parallax. At each time, read two full diameters through the well centre along those fixed axes; show their endpoints on the scales before calculating the mean. Do not rotate or move the dish. Keep lighting, observer and visible-edge definition consistent.

The mean remains calculated from two readings, never a third apparent ruler reading. Preserve the open-circle 8 mm **set well diameter**, distinguish it from the visible blue-zone readings, and retain the single blue hue with decreasing edge intensity.

### M4 — Correct the rejected claim and update the now-resolved exam evidence

Beat 13 rejects **“Visking tubing is a model of the cell membrane”**. That is a legitimate limited model statement, not a biological error. The actual supplementary Cambridge question S21/21 Q3 even introduces Visking as a way to investigate cell-membrane properties. The model's limitations do not make its use as a model false.

Replace the card exactly with:

> **✗ Visking tubing has a phospholipid bilayer and transport proteins.**
>
> **✓ Visking tubing models partial permeability through pores; it has no phospholipid bilayer or transport proteins.**
>
> *Our constructed wording contrast about the model's limits; not an examiner-reported error or a mark-scheme reject.*

Replace the corresponding narration with **“The reject card: Visking models partial permeability through pores, not a phospholipid bilayer with transport proteins.”** No full error beat or COMMON MISTAKE badge is warranted.

The agar dimensions are now verified, rather than inferred from the answer order. Replace Beat 13's cube caption exactly with:

> **Authored reconstruction from S21/22 QP p.9, Table 4.1: cube A, side 1 cm; B, side 2 cm; C, side 3 cm. Universal indicator in agar containing sodium hydroxide: initially blue, red in acid. Not our methylene-blue demonstration.**

Keep A → B → C and the correct tariff. Mark UNVERIFIED 2 and 3 resolved in the citations register.

A marked Visking question has also been found and independently checked: **S21/21 Q3(a), QP pp.6–7 / MS p.10, 3 marks**. It is **outside the original five-paper sample**. The claim that none was verified *in that sample* remains historically accurate, but it should not be presented as an unresolved archive-wide gap now. Replace UNVERIFIED 1 with:

> **RESOLVED — supplementary Visking evidence: S21/21 Q3(a), QP pp.6–7 / MS p.10, 3 marks. Explain meniscus-height changes after 20 minutes using net water movement and water-potential differences. This paper explicitly stipulates tubing impermeable to sucrose; its setup and permeability assumption differ from our capillary demonstration. It does not supply a time-series trace for our rig. Outside the fixed sample; incidence totals unchanged.**

For Beat 13's existing Visking opening, a precise replacement is:

> A separate June twenty twenty-one Paper 21 question asks you to explain Visking meniscus changes using net water movement down a water-potential gradient. That question specifies tubing impermeable to sucrose; keep its stated conditions separate from our demonstration.

Show the source/tariff, a labelled thumbnail of that distinct setup and the water-potential answer. Do not import its sucrose-impermeability assumption into `tubing-leak`, replace this lesson's rig with it, or borrow its end-point data to fabricate the missing time series. The syllabus already authorises the lesson's practical scope; no new investigation is required.

### M5 — Correct two unsupported quantitative inferences in Dataset 1 and the readout

Dataset 1 calls 0.25 g / 35 cm³ ≈ 0.71% a ceiling and then concludes “so a gradient remains through the 20 min”. This number is the **equal-concentration value** under the fixed-volume, no-loss simplification: if both sides reached it, no glucose concentration gradient would remain. It says nothing about when equilibrium is reached.

Replace that bullet exactly with:

> **Mass-balance illustration, not timing evidence:** the bag initially contains 0.25 g glucose. If that glucose were uniformly distributed through a total 35 cm³ with no losses or volume change, both compartments would be about 0.714% glucose. This calculation does not establish the concentration difference at 20 minutes or validate the illustrative colour sequence. No glucose concentrations are inferred from the colours.

Beat 7 “more of it the longer a bag sat” and its label should remain local to the illustrative observations; one independently prepared bag per time is not replication, and colour reports sample concentration rather than total glucose mass. Replace its first sentence exactly with:

> In these illustrative results, later outside samples give a stronger reducing-sugar test, while starch is not detected by iodine. The contents and blank tests support glucose crossing the tubing; these colours do not give an exact concentration or total mass transferred.

Replace **“more glucose outside with time”** with **“stronger outside reducing-sugar result at later sampled times: illustrative”**. Add the method note **“Repeat the complete series with fresh independent bags before generalising the time trend.”** Preserve the existing mechanistic concentration-gradient explanation and the real-material test identities.

### M6 — Put pictograms on the objectives' opening frame

Beat 2 calls for each pictogram to enter with its line, but the first entry cue follows “By the end you will be able to”. A first-frame assertion alone does not guarantee a visible model. Replace the opening visual direction exactly with:

> From the first frame, show the flat tied-bag, rising-column and spreading-circle pictograms on the distinct objectives surface. At *set up three investigations*, reveal the first objective beside these already-visible icons. The later stopwatch and interpretation pictograms enter with their lines. Keep at least one actual pictogram visible throughout; do not begin with empty slots or text alone.

## Should-fixes and production guards

1. **Working-solution hazards:** the syllabus codes are quoted correctly, but **HH means health hazard**, not specifically “harmful if swallowed”, and it does not establish the classification of every dilution. Separate syllabus-list codes from the chosen product's working-solution classification. Replace the methylene tag with **“Methylene blue, 0.1% aqueous: stains; avoid ingestion and skin/eye contact; wear eye protection. Working-solution classification follows the identified supplier's current safety information; syllabus [HH] is a materials-list code.”** Identify the actual iodine working concentration and Benedict's product/formulation in the builder's reagent list. Fisher's [0.1% LabChem product information](https://www.fishersci.com/shop/products/methylene-blue-0-1-aqueous-certified-labchem-2/LC169001) describes that particular solution as not hazardous; this illustrates why a stock/list code should not be transferred to a dilution as its classification. It does not certify the unnamed school product.
2. **Bag geometry:** the 8.0 cm cylindrical filled length uses the maximum circular area of 14 mm lay-flat tubing. A 10 cm cut leaves little allowance for a bottom knot, a gathered top and tapered ends. Replace the assurance “so the filled part is under water” with **“Check the actual filled and sealed bag dimensions, including knots/ties and tapered ends; confirm full submersion without overflow in the chosen boiling tube. The ideal cylindrical estimate alone does not verify that fit.”** Lengthening the stock piece if needed is a handling repair, not new syllabus content. Remove the contradictory phrase **air-free headspace**; collapse spare tubing before tying rather than drawing a trapped bubble.
3. **Bath volume:** models specify a **250 cm³ beaker**, while Dataset 2 says submerged in **250 cm³ water**. Those are not interchangeable: a nominally full beaker plus a bag risks overflow. Specify actual water volume, submersion depth and headroom from the workable setup; label vessel capacity separately.
4. **Control uncertainty:** reading to nearest 1 mm is a resolution, not automatically **±1 mm uncertainty**. Say **“The illustrative control changes by one 1 mm scale division; this alone does not quantify all apparatus drift or bag stretching.”** Under M1 the numerical control series is withdrawn until sourced anyway.
5. **Clock count:** the recap/absolutes sweep refers to four clocks; the model has three diffusion clocks, two osmometer clocks, an agar clock and a heating clock. Replace **“four”** with **“investigation”** and make each first-contact marker local to its actual experiment; do not call the reagent heating interval an osmosis/diffusion start.
6. **Do not conflate dye and indicator boundaries:** the beyond-scheme panel is correctly separated and the paper's universal indicator is correctly distinguished from methylene blue. If kept, clarify **“Our dye edge is a visibility threshold; the paper's indicator boundary is a pH-colour transition. Neither locates the first arriving molecules.”** No universal-indicator hue sequence should be invented; use labelled start/result swatches.
7. **Preview/context ownership:** label the potato thumbnail **plant tissue; quantitative potato investigation: 4.2.5**, or use beetroot/onion if retaining the 4.2.2b label. Give first-frame rig previews a **preview; schematic** tag so their stationary clock is not mistaken for the timed investigation.

## Citation audit — original PDFs and syllabus

Exam paths are relative to `/home/dachu/sme-9700-archive/pastpapers/`; pages are one-based PDF pages.

| Claim / quotation | Source checked | Finding |
|---|---|---|
| Outcome 4.2.2 and “including” excerpt | Current `SYLLABUS-9700-DETAIL.md`, p.21 outcome | Verbatim match. Both named non-living materials are investigated; plant-tissue work is explicitly handed to 4.2.2b. |
| Dialysis tubing 14 mm, approximately 2.5 nm pores; capillary tubing; cork borers; 9 cm Petri dishes | Same syllabus transcript, p.57 apparatus | All four quoted apparatus strings match exactly. A pore-size model is distinct from living bilayer transport. |
| Methylene blue [HH], technical agar, iodine [N], Benedict's [MH] [N] | Same transcript, p.58 materials, and hazard-code key | Quoted strings match; HH = health hazard. Does not validate an unstated reagent formulation/dilution's particular hazard classification. |
| Means and cylinder-volume calculation | Same transcript, p.63 mathematical requirements | Permitted mathematical operations. Correct arithmetic does not establish the physical interpretation of “volume entered” (M1). |
| Universal indicator blue initially, red in acid; differently sized cubes | `2021/June/9700_s21_qp_22.pdf`, p.9, Q4(b–c), text and rendered page | Verified. Agar contains universal indicator and sodium hydroxide. Dilute HCl covers the cubes. This is an indicator transition, not the dye-spreading method. |
| Cube sides A/B/C | Same QP, Table 4.1 | **1 / 2 / 3 cm explicitly supplied**. UNVERIFIED 3 resolved; no need to infer dimensions from the answer order. |
| Cube C SA 54 cm², V 27 cm³; Q4(b) 2 marks | `2021/June/9700_s21_ms_22.pdf`, p.14 | Verified. One point is volume units, one for both calculations. Here used only as supporting caption/context; the calculation belongs to 4.2.3-4. |
| Q4(c) instruction, complete-change order and 1 mark | S21/22 QP p.9 / MS p.14 | QP asks completion of Fig.4.1 from shortest to longest time for complete colour change. MS credits **A → B → C**, also ratio/side-length alternatives. UNVERIFIED 2 resolved; authored question summaries remain paraphrases. |
| No Visking question verified in the original cited sample | Amended plan/weights fixed five-paper ledger | Correctly limited historical statement, not proof that no such question exists. Supplementary check below resolves the broader request for one. |
| **New supplementary Visking question** | `2021/June/9700_s21_qp_21.pdf`, pp.6–7 (p.6 rendered); `9700_s21_ms_21.pdf`, p.10, Q3(a) | **Verified, 3 marks, any three listed points.** Different internal sucrose concentrations; external 0.9 mol dm⁻³; 20-minute height differences. QP explicitly stipulates sucrose-impermeable tubing. MS credits direction of water movement, net movement and higher-to-lower water potential. Outside the original denominator. UNVERIFIED 1 resolved as supplementary evidence. |
| Sourced measured trace for this capillary setup | No such record in supplied materials or checked PDFs | **UNRESOLVED**, UNVERIFIED 4. S21/21 supplies end-point differences from another apparatus, not a capillary time series. Keep the evidence dependency; do not relabel its data as this run. |
| Exact Benedict's colour–concentration correspondence for these conditions | No calibration supplied | **UNRESOLVED**, UNVERIFIED 5. No numeric conversion is licensed. Qualitative illustrative colours may remain honestly labelled; they do not demonstrate equilibrium time or mass transferred. |

There are **no direct exam quotations in the submitted storyboard** to correct. All examination descriptions have nonetheless been checked. The 1/5 figure is the original selected-paper ledger's one overlapping Q4(c) mark, not archive-wide incidence; finding S21/21 does not retrospectively change that fixed denominator.

## Scope, science and REAL-WORLD SAMPLES

The lesson covers three distinct investigations with its own hook, objectives, explanation, converted sieve handle, familiar-rig recap and sourced exam close. No mandatory error beat is allocated or missing. There is no reason to invent a diagnosed error for Visking or methylene blue. M4 keeps the closing contrast truthful.

Water-potential **sign and direction pass**: the pure-water atmospheric-pressure reference is 0 kPa; sucrose solution initially lower/more negative; net water movement into the bag while water crosses both ways. No pressure-potential/solute-potential terms, Fick equation, diffusion coefficient or hormone machinery are introduced. The optional author-only square-root plausibility check is not taught as data or a diffusion law. The sucrose-leak model is distinguished from the base water-only membrane and must remain bounded to the chosen tubing/setup; the supplementary question's impermeability stipulation is local to that paper.

The REAL-WORLD descriptions name the analytes/readouts: reducing sugar/glucose with Benedict's; starch with iodine; meniscus displacement; blue dye spreading through hydrated agar. Initial mixture positives, starch-alone interference test and pre-contact outside-water blanks are good controls. The limits are largely present, but the meniscus fit/interpretation requires M1 and the colour-trend inference requires M5. No quantitative colour calibration is fabricated. The beyond-scheme agar comment is spoken and visually separated after the credited answer, as required.

`DiffusionField` and the carrier recall preserve random motion, membrane orientation and passive transport; `tubing-pores` is cellulose rather than a bilayer. Methylene blue remains distinct from water tokens. The neighbouring agar-block lesson's thymolphthalein is not substituted for this dye or for the exam's universal indicator. The bag's initial **0.5% starch / 5% glucose** mixture agrees with the shared 1%/10% equal-volume stocks.

## Numerical and handling audit

| Quantity | Independent result / ruling |
|---|---|
| Mixture | 2.5 cm³ × 0.10 g cm⁻³ = **0.25 g glucose**; ÷ 5.0 cm³ = **5%**. Starch **0.025 g / 5.0 cm³ = 0.5%**. Correct; M2 makes enough mixture for all bags plus controls. |
| Original blank | **32 − 2 − iodine-drop volume <30 cm³**. Cannot label precisely 30 without accounting for that extra drop. M2 gives a complete split aliquot. |
| Equal-distribution glucose value | **0.25/35 ×100 =0.714%**. Correct arithmetic, invalid proof that a gradient persists for 20 min (M5). |
| Ideal boiling-tube/bag geometry | **35/[π(1.1)²]=9.21 cm** liquid height; **5/[π(1.4/π)²]=8.01 cm** ideal circular bag length. Dimensions of actual knots, taper and tube base are omitted; not a completed physical-fit validation. |
| Withdrawn osmometer example | 105−48=**57 mm**; increments **9,8,7,6,6,5,5,4,4,3**, sum 57. 57/20=**2.85 mm min⁻¹**. Arithmetic passes; provenance does not. |
| Column volume | π(0.050)²×5.7=**0.0447677 cm³ →0.045 cm³**. Column-volume increase only, not total net entry (M1). |
| Agar volume | π(4.5)²×0.5=**31.81 cm³**, approximately 32. Correct. |
| Well and drops | π(0.4)²×0.5=**0.2513 cm³** well; three 0.05 cm³ drops=**0.15 cm³**, depth **2.98 mm**. Underfilled, not brim-full (M3). |
| Agar means | **12.0,14.5,16.5,20.0,24.5,36.5 mm** all recompute correctly from the two supplied diameters. Means are calculated, not extra readings. |
| Agar successive widening rates | **5.0,2.0,1.75,1.125,0.75 mm h⁻¹** over the listed post-0.5 h intervals. Decreasing in this illustrative dataset. No coefficient or concentration follows. |
| Exam cube C | **6×3²=54 cm²**, **3³=27 cm³**, SA:V **2:1**; matches actual MS. |

Pours specify 120° from upright, lip-origin streams, level surfaces, and receiving mouths. The filled Visking bag is tied and rinsed; the osmometer connection is clamped, inspected for air and leak-checked. Bath tubes have holders. Dye is delivered from above. These are good storyboard contracts, not verified rendered handling. M2/M3 address remaining executable gaps. Preserve one-frame reagent-colour switches and the real Benedict's sequence; label compressed waiting and keep clocks continuous.

The source has 155 cues and no long narration gap; most explanations have meaningful evolving apparatus/mechanisms. The objectives opening remains an exception (M6). The familiar static recap is legitimate and has in-place highlights; it is not an unrelated summary slide.

## Runtime ruling

Reran `python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.2a/STORYBOARD.md`: **13 beats; 1,290 words; 155 cues; maximum gap 23 words; zero failing beats**, no missing-section/citation failures. Per-beat narration counts: **88,47,92,107,85,93,109,108,131,98,122,87,123**. The validator does not verify measured-data provenance, sampling arithmetic or first-drop event semantics.

At 120 words per final minute: **10:45**, versus **9:30**, **+1:15**, entirely teaching. No error reserve is involved. Accept the need for additional practical time; do not accelerate narration or remove the blank, first-contact rule, real-material explanation or interpretation limits.

The proposed cut counts are inaccurate under the supplied validator's token rule:

| Proposed cut | Actual words | Ruling |
|---|---:|---|
| Beat 13 beyond-scheme sentence | **25**, not 26 | **TAKE** if tightening: useful but repeats the colour-boundary limitation already taught in Beat 11. Remove its panel and associated cues together. |
| Beat 1 single-glucose-molecule sentence | **9**, not 10 | **TAKE**: the hook already makes the visibility point; move the magnifier cue as proposed. |
| Beat 9 control sentence | **8**, not 9 | **DO NOT simply cut**: replace with M1's honest account of the control and its limitation. |
| Beat 12 final timing sentence | **7** | **KEEP**: useful practical synthesis. Correct clock labels/count. |
| Beat 3 “bought dry and flat” | **4** | **KEEP**: describes the real material before handling. |

All five original cuts would save **53 words/26.5 s**, giving **1,237 words=10:18.5**, not 1,234/10:17. Taking only cuts 1–2 would give **1,256 words=10:28** before the required rewrites. **Accept that remaining 58 s overrun** for three complete investigations and their limits. Recount the repaired script and reschedule cues against the sourced osmometer record; the present timing estimate cannot justify invented numerical behaviour. No split is required solely by length.

**NOT CLEARED**
