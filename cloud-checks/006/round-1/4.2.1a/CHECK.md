# 4.2.1a — Independent storyboard check, round 1

27 September 2026. **NOT CLEARED.** Definitions, water-potential signs and E45 are sound. The numerical particle animation is not yet internally consistent: net transfers leave populations unchanged, an unexplained reset removes particles, and the carrier's timing conflicts with its counter. Also repair the recap's protein-route inference and the steroid marking-point presentation.

Read the complete storyboard, relevant amended plan/weights and plan check, SHARED-SPECS and SUMMARY, the full current VIDEO-STRUCTURE including REAL-WORLD SAMPLES, and the verbatim syllabus reference. Compared membrane/protein states with 4.1.3/4.2.1b and the water model with 4.2.6. Ran the supplied validator and independently checked the arithmetic and source claims against actual QP/MS/ER PDFs using `pdftotext -layout`. No render or audio was available. Only this CHECK file is written; no storyboard edits, commits or deployment.

## Must-fixes

### M1 — Make the particle counts describe the animation actually shown

**DiffusionField, Datasets 1–2 and Beats 3–9.** “Illustrative” permits chosen model numbers; it does not permit particles to cross while their counted populations remain unchanged.

- Beat 4 finishes at **20/20**. Beat 5 action 5 says tokens arrive from above “until” the tags show **24/8**. Adding particles cannot reduce the lower population from 20 to 8 or the total from 40 to 32.
- Beat 5's **6 inward / 2 outward** from **24/8** must finish **20/12**. Beat 6 instead retains **24/8**, then adds outside tokens to get **32/8**.
- Beats 8–9 explicitly say their populations are “not depleted”, despite net transfers of **6** and **2**. No reservoirs or replacement mechanism is specified. Side tags are described as current token counts, not fixed initial-condition labels.
- Four sequential carrier cycles at **0.6 + 0.8 + 0.5 + 0.8 = 2.7 s** each need at least **10.8 s**, before extra empty reorientation for reversal. They cannot occupy the declared **5 s animation window** at those speeds. “Time-lapse” without a changed time label does not settle this conflict.

Replace the Dataset 2 continuity contract, and apply it to the corresponding actions, with:

> Each membrane example is a separately set finite-particle demonstration, not a continuation of the previous example's populations. Show “new illustrative setup” while the existing membrane or particle scaffold stays visible and the tokens are reset. At the start, label each side's number “set starting count”; during the counted sequence update live side totals on every actual crossing. Do not add or delete tokens during that sequence. At its end, retain the final populations and display the completed counter as “last completed demonstration”. Any replay starts with an explicit labelled reset. Counts are scripted illustrative events, not experimental readings or predicted exact outcomes of a random simulation.

Use these exact start → end rows:

| Demonstration | Set outside / inside | Inward / outward crossings | End outside / inside |
|---|---:|---:|---:|
| Beat 5 oxygen | 24 / 8 | 6 / 2 | **20 / 12** |
| Beat 6 oxygen, steeper initial gradient | 32 / 8 | 8 / 2 | **26 / 14** |
| Beat 8 ions | 20 / 5 | 8 / 2 | **14 / 11** |
| Beat 9 glucose | 15 / 5 | 3 / 1 | **13 / 7** |

Replace **Beat 5 action 5** with:

> At “from the air in the alveoli”, retain the lung-context inset and explicitly initialise a new illustrative membrane comparison with 24 oxygen tokens outside and 8 inside. Caption: new setup; set starting counts, not a continuation of the 20/20 field. The alveolar context animation does not create or remove uncounted particles within the finite counted demonstration.

Replace **Beat 6 actions 1–3** with:

> From the first frame, retain the completed Beat 5 demonstration at 20/12 with its last completed counter 6/2. At “A steeper concentration gradient”, show a labelled new comparison, reset to 32/8, with the same area, temperature, membrane and 5 s observation window as the 24/8 comparison. Animate eight inward and two outward crossings, ending 26/14. At “a bigger gap between the two counts”, highlight the completed net comparison 6 versus 4; if the window has not finished, allow it to finish before revealing that result.

Replace **Beat 9 actions 6–8 and the counter duration convention** with:

> Keep the first slow binding/change-of-shape/release/reset cycle as an uncounted mechanism demonstration. At “without ATP”, show “new counted demonstration”, reset the finite field to 15/5, and start a **16 s animation window**, captioned “crossings in this 16 s illustrative demonstration; not comparable rates between transport routes”. Show three inward cycles and one outward cycle, including the empty carrier's necessary reorientation before binding on the opposite side. Retain the published 0.6/0.8/0.5/0.8 s motion timings; no instantaneous flipping or unlabelled acceleration. Counters tick only on actual releases to the other compartment; live populations finish 13/7. At “It can carry either way”, point to the reverse cycle; at “more often from the side with more glucose”, highlight the developing net inward movement. Show the completed 3/1 counter only after all four events. At “every glucose transporter”, retain the completed result and the scope caution; if the 16 s demonstration is still running, finish it with an anchored “watch the carrier complete the return” hold before the beat ends.

The other finite count examples can retain their 5 s windows. State the carrier exception in Models, Dataset 2, Reusable models and Plan interpretations 4. This is animation time, not a biological transport rate. Any extra hold belongs in the final runtime; do not accelerate narration.

For **Beats 3–4**, retain the valid 30/10 → 22/18 → 20/20 arithmetic, but replace the instruction that windows refresh automatically forever with:

> The counted windows are staged at their stated teaching cues. Every displayed crossing increments its counter and updates the side counts. Between demonstrated windows, retain the last result with the label “last completed window”; any continuing cross-boundary movement must remain counted. At equal concentrations the deliberately balanced scripted counts illustrate equal average fluxes, not a rule that every real five-second sample has identical counts.

Update Dataset 1's probability claim to **“These are selected illustrative counts; p × population supplies an expected-count illustration, not a guarantee of the exact count in a random sample.”** The arithmetic is valid; the expectation-versus-observation distinction matters when a live counter is drawn.

### M2 — A protein requirement does not itself identify facilitated diffusion

The caution in Beat 9 is excellent, but **Beat 7** then classifies “needs a protein route” as facilitated diffusion, and **Beat 13** repeats the inference unqualified: “... so they take facilitated diffusion”. The recap is the student's take-home wording. Keep the passive condition at the point of classification, not only in an earlier caution.

Replace the last two sentences of **Beat 7** with:

> Ions need a protein route too. In the passive routes shown here, net movement through these proteins is down the concentration gradient, without ATP: facilitated diffusion.

Replace the corresponding sentence in **Beat 13** with:

> Ions and polar molecules like glucose do not cross the hydrophobic core readily. Here their net movement through channels or carriers is down the gradient without ATP: facilitated diffusion. A channel has a hydrophilic pore; a carrier binds its solute and changes shape.

Re-map the affected cues and carry the same local qualification into the causal spine's route summary. Leave the Topic 4.2.1b handoff and Beat 9 caution intact; no co-transport lesson is needed.

### M3 — Show distinct steroid marking points, not two synonyms as the answer

**Beat 14, S21/22 row, source ledger.** The actual MS p.12 has three marking points, any two: bilayer passage; a non-polar/lipid-soluble/etc. property; small size. **Non-polar and lipid-soluble are alternatives within one point.** The current spoken “credited as non-polar and lipid-soluble” beside a 2-mark row is easy to copy as a complete two-mark answer.

Take the author's first runtime cut: remove the 16-word steroid sentence from narration. Retain the source row at the opening forms cue and replace its answer text exactly with:

> S21/22 Q3(b), QP p.6 / MS p.12 — 2 marks, any two of three listed points. Example two-point answer: hormone S is non-polar (lipid-soluble), so it can cross the phospholipid bilayer's hydrophobic core. “Non-polar” and “lipid-soluble” are alternatives for one property point. Small size is a further accepted point in this particular question. Our paraphrase.

Remove its obsolete spoken cues. Keep the steroid token crossing its bilayer icon. Do not turn E45's rejection of a size-only glucose answer into a universal ban on size: this different paper explicitly credits it. No new wrong-answer beat is needed.

### M4 — Qualify the real oxygen example as dissolved, unbound oxygen

**Beat 5 narration and oxygen tags.** The plasma-versus-cytoplasm comparison needs to distinguish freely dissolved oxygen from oxygen bound to haemoglobin. Red cells can hold much more total oxygen than adjacent plasma while still taking up oxygen. Dataset 1 calls its tokens dissolved oxygen, but the real-cell narration and membrane scene no longer make that explicit.

Replace the example sentence with:

> Our example is a red blood cell taking up oxygen in a lung capillary. Here we track freely dissolved oxygen, not oxygen bound to haemoglobin: it diffuses from the surrounding plasma into the cell.

Retain the following small/non-polar → bilayer → gradient sentence. Add the on-screen caption **“freely dissolved O₂; haemoglobin-bound oxygen not counted; illustrative gradient during uptake”** beside the O₂ populations. This is a bounded example of diffusion, not a claim that all lung-capillary cells retain an inward gradient indefinitely. No dissociation curve, partial-pressure calculation or detailed gas-exchange pathway is required.

The example itself is supported by W22/23 QP p.15, Fig.6.1 (oxygen entering a lung-capillary red cell and combining with haemoglobin), and publisher-authored [OpenStax Gas Exchange](https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange) and [Transport of Gases](https://openstax.org/books/anatomy-and-physiology/pages/22-5-transport-of-gases), which distinguish dissolved and haemoglobin-bound oxygen. These sources support the biological example; they are not a verified page in the unavailable Cambridge-endorsed coursebook.

## Should-fixes and builder guards

1. **Water model assumptions must be visible.** Plan interpretations 2 says fixed compartment volumes are captioned, but Beat 11/12's on-screen lists omit that caption. Add **“conceptual comparison at fixed volume, temperature and pressure; not an osmometer; volume changes not modelled”**. At the solute addition show **“we change the left solution”**. Equality reached by intervention is permissible, but must not look like water flow has spontaneously equalised two unchanged solutions. The unequal and equal solutions can be labelled comparison states; no pressure-component terminology is required.
2. **Preserve the distinction between a selective model barrier and cell-membrane structure.** The water-only gaps are explicitly a generic model and are inherited from SHARED-SPECS. Keep that caption conspicuous. In the real-cell aquaporin inset draw a continuous bilayer plus an actual teal water-channel protein; never a naked permanent hole through exposed tails. Water passing directly through the bilayer must not require a macroscopic tear. Carry this guard to 4.2.6's reused model.
3. **Carrier interpolation needs an occluded middle.** Add **“At no frame is the binding site an open pore through both faces; outer access closes before inner access opens, and conversely in the reverse cycle.”** Continuous silhouette interpolation alone does not guarantee the channel/carrier distinction. Coordinate with 4.2.1b, whose revolving-door description already says there is no open straight-through passage.
4. **One factor at a time.** Before temperature, area and distance demonstrations in Beat 6, explicitly restore the same baseline conditions. Replace its broad final property sentence with **“For bilayer passage, molecular size and lipid solubility also matter; small, non-polar molecules cross readily.”** Do not imply temperature, area and gradient were separately tested when several were changed together. These remain qualitative demonstrations, not a measured experiment or Fick's-law derivation.
5. **Student-facing provenance.** Keep source details in the storyboard, but replace visible “plan wording”, “UNVERIFIED — verbatim QP wording” and internal PDF status labels with concise biological labels and paper citations. The exact QP/MS gaps are resolved below. “Our framing” is still correct for paraphrased questions.
6. Beat 1's generic glucose vignette should show a small transport-protein symbol at its cell-boundary crossing. Beat 13's osmosis recap currently brightens historical high/low labels and the current equal label together: dim history and highlight the active equality condition sequentially, so a still frame cannot imply that unequal and equal potentials coexist.

## Biology, scope and visual ruling

The full **4.2.1** outcome matches the supplied syllabus p.21 verbatim. The split is explicit: this lesson describes/explains simple diffusion, facilitated diffusion and osmosis; 4.2.1b owns active and bulk transport. Random motion, net flux, equilibrium with continued movement, channel hydrophilicity, carrier binding/conformation and no ATP for the taught passive routes are explained in substantive beats. The channel remains open and fixed in this model; the text does not impose the carrier mechanism on it. No Fick's equation, membrane-potential teaching, named pump or forbidden water-potential components are introduced.

**Water-potential signs/direction pass.** Pure water at atmospheric pressure is the 0 kPa reference. At the same stated temperature/pressure, adding sucrose lowers the potential; less negative is higher. Initial net water flow is left → right, toward lower potential; only water passes this particular membrane model. Equality retains two-way movement and removes net movement. The definition includes water molecules, net movement, higher → lower water potential and a partially permeable membrane. Equal solute counts imply equal potentials only within this same-solute, equal-volume, same-temperature/pressure comparison; 4.2.6 correctly allows equal water potentials in plant cells without equal solute concentrations. Do not export the sucrose-count shortcut as a universal cell rule.

All fourteen beats name a visual scaffold from entry, with pictograms on the independent objectives surface. No text-only frame is specified. The familiar recap and anchored error read are legitimate holds. Molecular mechanisms move rather than simply switching between labelled states. Numerical timing/conservation remains a build blocker under M1, despite plentiful cues. Five-second windows must not silently loop under 40–50 seconds of narration while pretending the population has not changed.

Real-world examples are schematic, not assayed samples; range, reagent clarity, first-contact clocks, pours and chemical colour paths are therefore not applicable. The schematic solute dropper stays above the field. Glucose, sodium and steroid examples in the exam close correspond to the cited question subjects; no new named real sample is presented as an extra mark. The oxygen example is in explain beats and is repaired under M4. The final osmosis contrast is explicitly authored, not a Cambridge reject or a diagnosed common error; retaining that honest label is acceptable.

## Citation audit — actual PDFs

PDF root: `/home/dachu/sme-9700-archive/pastpapers/`. Whitespace and line wraps are normalised, not substantive words. Repeated claims in the spine, scope ledger, E45, close and citation list share the rulings below.

| Claim / quotation | Actual PDF and page inspected | Result |
|---|---|---|
| “Most incorrect answers stated that glucose was too large.” | `2023/June/9700_s23_er.pdf` p.12, P21 Q3(a) | **Exact match.** Subgroup is incorrect answers, not all candidates. The report also requires a clear bilayer/core reference rather than loose fatty-acid-tail wording. |
| Glucose protein requirement; polarity/core credit; size-only, active transport and facilitated diffusion ignored | `2023/June/9700_s23_qp_21.pdf` p.8; `9700_s23_ms_21.pdf` p.11, Q3(a) | **Verified, 1 mark.** Stem concerns hexoses entering grape fruit cells; part (a) asks the general protein-requirement reason. The author's question is a valid paraphrase. MS also ignores unqualified “(hydrophobic) fatty acid ‘tails’”; E45's hydrophobic-core/bilayer answer is suitable. This part does not establish passive transport for every hexose transporter. |
| Sodium charge and hydrophobic/non-polar bilayer | `2024/March/9700_m24_qp_22.pdf` p.3; `9700_m24_ms_22.pdf` p.5, Q1(b)(i) | **Verified, 1 mark.** QP asks why sodium ions cannot cross phospholipid bilayers by simple diffusion. Charged ion/core relationship supported; no second glucose question is implied. |
| Steroid non-polar/lipid-soluble property and bilayer passage, any two | `2021/June/9700_s21_qp_22.pdf` p.6; `9700_s21_ms_22.pdf` p.12, Q3(b) | **Verified with M3 clarification.** Any two of THREE points: passage through bilayer/core; property; small size. Non-polar and lipid-soluble do not earn separate points. Intracellular receptor/pathway material in the supplied figure need not be taught here. |
| Ion transport through a membrane protein (spine/scope ledger; E43 owned elsewhere) | `2022/November/9700_w22_qp_23.pdf` p.15; `9700_w22_ms_23.pdf` p.19, Q6(a) | **Verified, 1 mark.** Hydrogencarbonate/chloride movement in lung-capillary red cells. Hydrophilic pathway, bilayer exclusion or facilitated diffusion are alternative credits. Supports the general protein-route reminder; does not identify the illustrated exchanger as the open channel drawn in this lesson. |
| Adjacent mixed phloem block with osmosis/water-potential points | `2020/November/9700_w20_ms_21.pdf` p.10, Q4(b)(ii) | **Verified.** Five marks for a mixed account: assimilate entry, lowered water potential, water entry, hydrostatic-pressure change and mass flow. Correctly ledger-only, not five pure osmosis marks. |
| Outcome 4.2.1, p.21 | SYLLABUS-9700-DETAIL | **Verbatim match.** |
| 4/5 cited Paper 2 blocks; 15 overlapping marks across all 4.2.1 | Above MS pages, plus S21/22 MS p.16 Q5(b)(ii), W22/23 MS p.9 Q2(a)(i), S23/21 MS p.8 Q1(b)(i) and p.11 Q3(b)(i), M24/22 MS p.6 Q1(b)(ii) | **Tariffs independently verified:** S21 = 2 + 1 = 3; W22 = 3 + 1 = 4; S23 = 1 + 1 + 2 = 4; M24 = 1 + 3 = 4; total **15**. Four directly represented papers within the declared five-paper sample. This verifies the cited-block sum, not an exhaustive archive-wide incidence count. |

**UNVERIFIED disposition:** items 1–3 (QP/MS wording) are resolved. Item 4's biological example now has the sources in M4; an endorsed-coursebook page remains unavailable and must not be invented. W22/23 and W20/21 are genuine additional cited claims outside the author's six-row citation table; add them to that table with the verified pages. All direct exam quotations actually used by this lesson have been checked against the actual PDFs.

## E45, numeric and cue audit

**E45 passes.** COMMON MISTAKE has direct ER evidence. All five moves are present: announcement, explicitly constructed written answer, 4 s anchored read, a cue-synchronised explanation of where/why/credit, then in-place correction. The badge remains to the last repaired word. “Too large” is discussed as wording, not asserted as biology. The zero-credit claims are question-local. Keep its **141 words / 74.5 s including the read** intact.

Arithmetic independent check:

| Quantity | Ruling |
|---|---|
| Open field | 30 + 10 = 40; 12 − 4 = 8 → 22/18; rounded 8.8/7.2 → 9/7 → 20/20; 8/8 → unchanged. Correct arithmetic; scripted illustration, not exact stochastic prediction. |
| Membrane field | Net inward counts 4, 6, 6, 2 are correct. Required final populations are 20/12, 26/14, 14/11, 13/7; missing in the existing animation. |
| Water model | 15 − 9 = 6 toward the lower potential; 4 + 8 = 12 sucrose tokens left; 12 − 12 = 0. Counts are illustrative, not calculated from water-potential values. |
| Reference | 0 kPa is a reference, not a reading. No other potential, numerical concentration or measured rate is invented. |
| Carrier | 2.7 s/cycle; four cycles ≥10.8 s, incompatible with a five-second animation window at the specified pace. M1 gives time for reversal as well. |

Validator rerun:

```text
beat  words  cues maxgap  status
1       96    10     13  ok
2       50     3     18  ok
3      101     8     27  ok
4      103     9     25  ok
5       99     9     18  ok
6       79    10     12  ok
7       85    10     16  ok
8       94    11     17  ok
9       95    10     17  ok
10     141    14     18  ok
11      88    11     14  ok
12     100    11     23  ok
13      99     9     18  ok
14     104    13     13  ok
TOTAL words 1334  cues 138  runtime at 120 wpm 11:07.0  beats 14  failing beats 0
```

No missing-section/citation-tag messages. Cue matching/order pass; maximum gap 27 words. Manual inspection of Beats 3–6, 8–10 and 11–14 finds the semantic timing issues in M1, not an exact-substring defect. At effective 120 wpm a 27-word gap is about 13.5 s, consistent with the 10–15 s visual-state guidance while particles continue to move. Revalidate after all narration and counter changes.

## Independent runtime ruling

Original **1,334 words = 11:07**, plus explicit error read **4 s = 11:11**, **26 s above 10:45**. Teaching **1,193 words = 9:56.5**, 26.5 s over its 9:30 base; E45 **74.5 s**, 0.5 s under its 75 s reservation. These figures and SUMMARY agree. Declare the final 2 s hold separately if it is additional to effective pacing, rather than silently forgetting it.

The proposed five cuts are accurately counted: **16 + 14 + 8 + 7 + 5 = 50 words**, yielding **10:46** including the read. They need not all be taken.

| Ordered author cut | Ruling |
|---|---|
| 1. Steroid sentence, 16 words | **TAKE**, with M3's correct on-screen answer. This also removes the spoken two-synonym ambiguity. |
| 2. Real-cell water routes, 14 words | **KEEP.** Helps distinguish the abstract selective barrier from real membranes; appropriate scope and concise. |
| 3. Hook's water sentence, 8 words | **KEEP.** Introduces the third process before the objectives; not empty repetition. |
| 4. Channel selectivity sentence, 7 words | **KEEP.** Protects against treating every channel as equally selective. |
| 5. “Start with the particles themselves”, 5 words | **KEEP.** A short conversational bridge; no need to strip it to satisfy a clock. |

Cut 1 alone gives **1,318 words = 10:59 including the read**, **14 s over**. **Accept that remaining overrun**, before recounting M2/M4 replacements and any genuinely additional carrier hold. Three mechanisms and a new water-potential model justify this modest excess. The required fixes must be timed honestly; do not thin E45, accelerate narration, or claim an impossible five-second carrier window to recover time.

Reviewed storyboard SHA-256: `f6ae1aaaa56447ac2b515884cb6f55ca42611b571bde7cf6daecc03e5490877a`.

Return required: M1–M4, updated model/data contracts and affected cues, final runtime with any added holds, and corrected source statuses. This is storyboard review, not clearance of rendered frames.

**NOT CLEARED**
