NOT CLEARED

Independent round-one check, 24 September 2026, of **3.2.1b — Availability and competition: enzyme, substrate and inhibitor concentration**. Re-author the inhibitor investigation and its population animation; repair the visual and wording issues below before narration. The arithmetic and external quotations pass. The length alone is not the reason for withholding clearance. **Recommend a split after Beat 6, subject to Durai's decision; preserve all three complete error beats.**

Reviewed STORYBOARD.md SHA-256: `ed83af1d86c66d8118033c9ae5900496acc5a86a955b0c23fa0cf6fa91a1992f`.

## Basis and limits

Read the full storyboard, cleared topic plan and weights, all of VIDEO-STRUCTURE, the Topic 3 syllabus outcomes and introduction, all three specified evidence documents, both cleared sibling storyboards and both rounds of their checks, SHARED-SPECS and SUMMARY. Also checked the relevant 3.1.4 assay/start-point/calibration passages for the claimed handoff. Exam PDFs are unavailable: this is **text-to-text verification against the supplied verified register**, not a fresh PDF or rendered-video audit. Only this CHECK.md has been written.

## Must-fix before narration

### M1 — Complete the inhibitor investigation: repeats, mean and a physically honest start point

**Locations:** Beat 11; Dataset C; `inhibitor-concentration` configuration; scope ledger.

The plan's paragraph immediately following the investigation map requires **repeat each condition and calculate its own mean**. Dataset C provides one run per concentration, and the factor plot uses those single-run gradients. The caption is honest, but does not fulfil the binding plan. Neither Beat 11 nor the dataset instructs the student to repeat and calculate means. SUMMARY's acknowledgement of the single runs does not resolve that omission.

Re-author this investigation to specify repeated independent mixtures at each of the five concentrations, including zero; calculate each run's initial absorbance gradient, then the mean gradient for each concentration. Keep the five demonstration progress curves if useful, explicitly identified as representative runs. Put the additional results and derived means in Dataset C, and make the factor plot's y-axis **mean initial rate of change of absorbance / s⁻¹**. Do not silently relabel the existing single runs as means. All new displayed numbers must follow from that same dataset.

The starting-point account also needs the correction already made in 3.1.4. Dataset C says the 0 s value is “recorded as 0.00”; the reaction cuvette is mixed and only then inserted into the instrument. Specify:

> The 0 s point is an assumed zero-product start point for these illustrative data, not an instrument reading. Start timing at mixing; take the first reading at 30 s, then every 30 s to 180 s.

Put **assumed start point; first reading at 30 s** beside the origin on the displayed graph. State that the drawn initial section is straight for these illustrative data; zeroing a blank alone does not measure the reaction cuvette at the instant of mixing. Preserve the matched blanks, fixed 2.5 cm³ volume, fixed enzyme/ONPG inputs, filter, path, temperature, solvent volume and mixing schedule.

Make the spoken rate unambiguous as well. Replace “The rate is the initial gradient over the first sixty seconds” with **“Here we measure the initial rate of change of absorbance, from the straight section over the first sixty seconds”**, remapping its cue. Keep the distinction between a single reading and a rate. The required changes affect the teaching sequence, dataset and graph contract and need a recheck.

### M2 — The generic inhibitor animation actually depicts a binding location

**Locations:** `pop-inhibitor` model specification, Beat 11 action 8, Beat 12 replay; check Beat 1's docking too.

The token “docks onto the outer rim”, after which a substrate tries the cleft and is rejected. That visibly locates binding away from the cleft, despite the caption “where X binds is not drawn”. It anticipates the other-site model taught in 3.2.2-3. A disclaimer cannot undo the spatial information in the drawing. The supplied concentration series does not establish X's binding location or class.

Replace surface docking with a **non-spatial occupancy/status representation**: a bracket around a whole enzyme miniature tagged **X bound; binding location unspecified**, with the X token in an external status key rather than touching any point on the protein. Animate the increase in the inhibited population and the decrease in productive cycles. Do not draw a second site, cleft distortion or an unexplained intact cleft physically rejecting substrate. Retain a clearly schematic indication of fewer available/working active sites and the handoff to 3.2.2-3. Carry the change through every replay and the model specification. This preserves explanation of concentration effects without inventing mechanism.

### M3 — Remove the explicitly text-only frames

**Locations:** Beat 1 action 1; Beat 3; explicitly settle continuity at Beats 11 and 13.

Beat 1 initially writes a question on a plain surface; the first curve arrives only at “hardly speeds it up at all”. Beat 3 explicitly specifies “no diagram” and only text lines. These fail this check brief's **no text-only frame** requirement, even though the older lesson standard and cleared siblings permit separate typographic objective cards.

At the first hook cue, establish the cell/enzyme/substrate visual or the schematic curve alongside the question. Give the objectives their own styled surface, with small apparatus or factor icons supporting the three objectives; do not place the objectives on an unexplained lesson graph. Explicitly keep a relevant visual present behind/beside the Beat 11 adaptation card and from the beginning of Beat 13's forms surface, before its question graph enters. A border, badge or text card alone is not the missing visual.

### M4 — E39 must announce that the answer is mistaken before showing it

**Location:** Beat 10 opening and entry cue.

“Here is an explanation that an examiners' report describes in detail” does not say that this is an error. The same defect was repaired in E38 by the conductor, but remains here. Replace the opening sentence exactly:

> Here is a mistaken explanation, on the card, with two faults the examiners' report describes.

Change the entry cue to **Here is a mistaken explanation**. Preserve the entire written composite, four-second read, talk-through, both corrections and final-fault marker retention. This is a signposting repair, not a time cut.

### M5 — Distinguish prepared-solution concentrations from reaction-mixture concentrations

**Locations:** Dataset B header, Beat 7 labels/narration, `rate-substrate` axes and replays; clarify Dataset A too.

The peroxide concentrations 0.10–0.50 mol dm⁻³ are those in the **10.0 cm³ peroxide solution before adding 5.0 cm³ yeast suspension**. They are not the final concentrations in the 15.0 cm³ reaction mixture. A bare “hydrogen peroxide concentration” axis leaves the numerical definition ambiguous. The dilution arithmetic itself is correct.

Preserve the shared numerical convention and use **hydrogen peroxide solution concentration before mixing / mol dm⁻³** on the factor axis/table, with **10.0 cm³ peroxide solution + 5.0 cm³ yeast suspension; final volume 15.0 cm³** next to the rig. Qualify the spoken worked example as **“For a peroxide solution of zero point two moles per cubic decimetre before mixing…”**. The final peroxide values would be 0.0667, 0.133, 0.200, 0.267 and 0.333 mol dm⁻³; these need not be added to narration.

Likewise retain Dataset A's useful “amylase solution concentration” wording but append **before mixing with starch** to its definition/axis note. Its final amylase values are 0.10, 0.20, 0.30, 0.40 and 0.50%, with final starch 0.50%. Dataset C already correctly labels X **in the cuvette**. Use one convention consistently rather than changing the shared datasets silently.

### M6 — Correct the ONPG context tag's catalyst placement

**Location:** Beat 11 action 3.

The tag **β-galactosidase + ONPG → yellow product** puts the enzyme on the reactant side and omits it afterwards. Although labelled “names are context”, it is misleading as a reaction display. Use the explicit qualitative caption:

> β-galactosidase catalyses conversion of colourless ONPG to products, including yellow ONP.

This is a context sentence, not a balanced chemical equation; no structural chemistry or new atom mapping is required. Retain the single-yellow-hue intensity animation.

## Numerical audit

Independent calculations from the three tables agree with the printed numerical results. Measured inputs chosen for an illustrative dataset are inputs, not numbers requiring derivation from another source.

| Dataset / operation | Independent result |
|---|---|
| A: 1.00% stock diluted to 5.0 cm³ | Stock volumes 1, 2, 3, 4, 5 cm³ give 0.20, 0.40, 0.60, 0.80, 1.00%; buffer complements 4, 3, 2, 1, 0 cm³. |
| A: three-run means | 910, 460, 310, 230, 180 s. |
| A: reciprocal means, 2 significant figures | 0.0011, 0.0022, 0.0032, 0.0043, 0.0056 s⁻¹. Correctly a relative endpoint-rate proxy, never an initial rate. |
| A: consecutive mean gaps | 450, 150, 80, 50 s, all greater than 30 s; recorded times are multiples of 30 s. The endpoint is bracketed by the preceding positive sample and the first negative one. |
| A: proportionality | Unrounded doubling ratios 910/460 = 1.978 and 460/230 = 2.000. Rates divided by prepared concentration are approximately 5.49, 5.43, 5.38, 5.43, 5.56 × 10⁻³ s⁻¹ per %. “Roughly” and “close to” are warranted. |
| A: wells | 0 through 930 s inclusive at 30 s intervals requires 32 wells for a run lasting 930 s. Shorter 900 s runs require 31; correct the blanket “32 wells per run” wording to “up to 32 wells per run”. |
| B: dilutions | 2/8, 4/6, 6/4, 8/2, 10/0 cm³ stock/water produce the five stated prepared concentrations. Final reaction volume is 15.0 cm³: M5. |
| B: mean initial gas-collection rates | 0.21, 0.40, 0.53, 0.59, 0.61 cm³ s⁻¹; control 0.00. Repeat-1 rates are 0.21, 0.40, 0.52, 0.58, 0.60: do not use the means as the five repeat-1 progress-curve tangents. |
| B: worked tangent | 12.0 cm³ / 30 s = 0.40 cm³ s⁻¹. These are tangent-line coordinates, not a requirement that every curved trace pass through (30,12). |
| B: oxygen-yield checks | 10c mmol peroxide / 2 × 24 cm³ mmol⁻¹ gives 12, 24, 36, 48, 60 cm³ using the stated approximate room-condition conversion. These are stoichiometric estimates under that convention, not exact pressure-independent volumes at 30 °C. Keep curves beneath the specified illustrative bounds. |
| B: trend | +0.32 from 0.10 to 0.30, then +0.06 and +0.02 cm³ s⁻¹. “Levels off” is reasonable; the highest point is not labelled Vmax. |
| C: volumes and final X | 1.0 + 0.5 + 0.5 + 0.5 = 2.5 cm³; added X solutions 0, 2.5, 5, 7.5, 10 diluted fivefold give 0, 0.5, 1, 1.5, 2 mmol dm⁻³. |
| C: current single-run initial gradients | 0.24/60, 0.18/60, 0.14/60, 0.12/60, 0.10/60 = 0.0040, 0.0030, 0.0023, 0.0020, 0.0017 s⁻¹ to 2 significant figures. All 30 s readings are half their 60 s readings. |
| C: later increments and calibration | All later increments are non-increasing. The last three series remain straight to 90 s, so do not force them to bend immediately after 60 s. All readings are within 0–0.80. For the zero-X series, 0.0040/0.0080 = 0.50 µmol dm⁻³ s⁻¹ if converted. |

The enzyme population counts and the tills are labelled schematics, not experimental quantities. No extra numerical occupancy fractions should be inferred from them. The single 0.45 absorbance reading at 120 s is correctly separated from a rate; more precisely, it indicates colour/product concentration under the assay conditions rather than directly measuring an amount of substance.

## Scope, science, chemistry and practical handling

The syllabus quotation matches the register's p.20 text. All three assigned factors receive investigation and explanation; temperature and pH have a labelled recall and are handed to 3.2.1. The active-site cycle makes the opening understandable independently. The narration generally addresses the student, and the busy-tills analogy is immediately translated into the biological explanation. No algebraic kinetics, extra inhibition classes, reciprocal plots, catalytic-residue chemistry or industrial catalogue is introduced.

The sentence/absolute sweep supports the qualified proportionality **while substrate is in excess**, **nearly every** active site, **can** denature, and **about** the same starch at a common endpoint. Experimental “every tube/run” statements describe the chosen design. E38 keeps concentration distinct from time; E39 correctly maintains turnover at saturation. The S21/22 higher-maximum-rate ruling is expressly local and is bounded by S23/34's shorter accepted wording. The Learner Guide annotation does not become a claim that the original answer lost all credit: its full score via other points is disclosed. M2 is the significant mismatch between claimed restraint and the actual visual specification.

**Chemistry:** 2H₂O₂ → 2H₂O + O₂ balances H4/O4 on both sides. No atom-resolved covalent transformation is specified, so no new edge list or net-reaction animation is needed. Imported schematic substrate/product states do not author an atom-level mechanism. Non-covalent seating/release and the denaturation recall retain motion, with the peptide backbone intact. M6 repairs the separate enzyme-consuming-looking context tag.

**Handling/colour specification:** the amylase pour explicitly gives approximately 120°, lip-to-mouth stream and level surfaces; the bath uses racks, the dropper stays above the iodine, and the gas system is closed before mixing. The global handling rule must also govern the internal-tube spill; verify its mouth-down geometry in the eventual build. Cuvettes use ridged faces, clear faces in the optical path, a fitted lid before inversion and a closed holder for reading. Iodine results switch directly between blue-black and yellow-brown, and ONPG colour develops only in yellow intensity. These are satisfactory storyboard contracts, not claims that a rendered still has been checked. M1 corrects the actual reading/start-time ambiguity.

For practical reproducibility, specify a small fixed sample volume and draining the rinsed dropper before resampling. Different endpoint times entail different numbers of withdrawn samples; do not strengthen E40's “about the same starch” into an exact equality of total turnovers. The fixed-endpoint rate comparison should remain explicitly approximate.

## Evidence and quotations

**No unmatched external quotation found in the submitted lesson.** Exact wording and cited locations match the supplied register, allowing its stated typographic normalisation and marked ellipses:

| External wording used | Verified register location / attribution |
|---|---|
| Outcome and “investigate and explain” | SYLLABUS-9700-DETAIL, Topic 3, syllabus 2025–2027 p.20. |
| E38 ignore line, including the gradient warning | Plan and weights E38: June 2021 9700/22 Q5(c), MS p.17. |
| E39 majority/Many candidates report extract | Weights E39: June 2023 ER, Paper 31 Q1(b)(i), p.26. The opening “However” is present there. |
| Lactose interval marking points | Weights S-I: June 2023 9700/31 Q1(b)(i), MS p.7. The displayed interval is correctly 60–140, not the report's separate 60–100 wording. |
| E40 ignore line and “per unit time” credit | Plan/weights E40 and weights s21_22 ledger: June 2021 9700/22 Q5(d)(i), MS p.18. |
| Full timed/regular-interval annotation | Plan/weights E40: Learner Guide p.19, annotating specimen Paper 2 Q3(c). EXAMINER-INSIGHT §5 supports the full-marks caveat. |
| Timed sampling marking point | Plan §3.1.3 and weights S-A: Specimen 2022 Paper 2 Q3(c), MS p.13. |
| More enzyme / active sites / successful collisions / complexes | Weights s23_34 ledger: June 2023 9700/34 Q1(c)(iii), MS p.7. |

All three COMMON MISTAKE badges are supported by an explicit ignore line, examiner report or examiner annotation. E40 and E38 have the five moves; E39 has the written composite, read, full explanation and final correction but needs M4's explicit spoken announcement. Markers remain through the last fault, and wrong propositions are discussed as written answers rather than asserted as biology.

**UNVERIFIED wording remains unavailable for six items already disclosed by the author:** S21/22 Q5(c) QP p.12 instruction; its MS p.17 points beyond the ignore line; S23/31 Q1(b)(i) QP instruction; Learner Guide p.28 wording about proportionality; S21/22 Q5(d)(i) context beyond the registered higher-Vmax summary; S21/51 method wording. None is currently passed off as a verbatim quotation. Keep authored framings and register-supported paraphrases labelled. These unavailable originals do not by themselves block narration of those labelled framings; they must be verified before any future use as exact Cambridge wording.

The supplied quote checker now reports **41 strings, 6 not found**, rather than the pasted **35 / 0**. I examined the six: all are the conductor section quoting the author's own sentences or edits, not external evidence. Refresh the validation record; do not call them fabricated examiner quotations. The checker also skips short terms and cannot verify attribution, which is why the table above was checked manually.

## Build readiness and consistency

The read-only validator returns **177 cues; zero failing beats; maximum gap 21 words**. Independent speech extraction gives the same word counts. Manual samples in Beats 4, 6, 8, 10 and 11 follow the spoken order and refer to the right operation/highlight; for example, Beat 6 corrects the time basis first and the sampling schedule last. Literal cue validation does not establish frame composition: M3 remains despite the clean validator result. Revalidate every changed cue after re-authoring.

The full shape is present: hook/context, labelled recall, own objectives, investigations/explanations, familiar-visual recap, and cited exam close answering the hook. The active-site base model and non-covalent movement match 3.1.1-2; the denaturation recall retains its backbone. `EnergyProfileGraph` is not used here and needs no added replay. `RateGraph` keeps endpoint and initial-rate axes separate. The 3.2.2-3 handoff is conceptually consistent, but its own schematic lactase values/axes must replace the catalase dataset when it starts numerical Vmax/Km work; do not treat 0.61 as its supplied Vmax. M2 is required to keep the inhibitor mechanism handoff honest.

SUMMARY's assertion that the inhibitor token docks at no specified site is contradicted by the outer-rim instruction. Its assertion that the start-point erratum is already corrected is also stronger than 3.2.1b's actual wording. The claimed absence of all model names is literally contradicted by asset identifiers; those identifiers are necessary build references and not a reason to delete shared-model contracts. The plan takes precedence over that ambiguous SHARED-SPECS sentence.

## Length ruling for Durai

Independent counts by beat: **72, 99, 50, 112, 105, 160, 113, 156, 109, 156, 157, 85, 88**. Total **1,462 words = 12:11** at the agreed effective 120 words/minute. Do not add the prescribed reads and holds again.

- Teaching: **990 words = 8:15**, against **6:30**: **+1:45**.
- E40/E38/E39: **160/156/156 words = 80/78/78 seconds**, total **472 words = 3:56**, against **2:15**: **+1:41**.
- Total overrun: **3:26**. The author's current headline/table and SUMMARY agree. The older 470/1,006-word bullets are stale, explicitly labelled historical, and should be replaced by the current figures for production.

With the complete current error beats, an 8:45 total leaves only **4:49 / 578 words** for teaching. Meeting that total would require removing **412 teaching words**, before necessary fixes. Removing only the 210-word teaching overrun would still produce **10:26**. The budget and the demonstrated error-beat cost cannot both fit unchanged; this is not permission to thin errors or accelerate delivery.

**Author's ordered cuts:**

| Cut | Ruling |
|---|---|
| (1) Beat 11, 19-word assay/filter recall | **KEEP.** It supplies the standalone identity and observable readout of the third investigation. Part labels alone are not equivalent teaching. |
| (2) Beat 13, 11-word enzyme/control forms sentence | **TAKE.** These forms have already been illustrated/cited in Beats 4–6. Retain their written references beside relevant visuals; remove/remap the two cues tied to the deleted sentence. |
| (3) Beat 2, 8-word model-introduction sentence | **Already taken.** It is absent from current narration. Count no further saving. |

**Further teaching repetition worth removing:** Beat 2's 18-word denaturation sentence and its complete unfolding/failure-to-seat replay repeat 3.2.1's explanation. Keep the labelled recall, the working active-site cycle, the causal sentence and the fixed-temperature/buffer strip. This saves nine seconds without removing standalone understanding. The tangent in Beat 7 earns its place: it makes the different-substrate-amount comparison intelligible. Beat 9's saturation explanation, the busy-tills conversion and the whole-factor recap are also necessary; their later use inside protected errors is deliberate correction, not expendable teaching repetition.

Taking cut (2) and that denaturation sentence saves **29 words / 14.5 seconds**, giving **11:56.5 before repairs**. The remaining three investigations, explanatory links and protected errors still do not fit 8:45. Beat 11 also needs M1's additional method, so this is not a credible route to the original envelope.

**Recommendation: split after Beat 6 / E40, before Beat 7 (“Now substrate concentration”).** This is a completed causal and practical boundary: enzyme concentration measured by a common endpoint has been investigated, explained and corrected. The next part changes to initial slopes for substrate and inhibitor concentration. Do not split after Beat 10 merely to leave the short inhibitor investigation isolated, and do not separate E38/E39 from the graph they correct.

If Durai adopts the split, retain the first part's hook/recall and enzyme investigation plus full E40, give it its own enzyme-focused objectives, in-place recap and cited enzyme/control exam close. Give the second part a short standalone hook/recall and objectives, retain Beats 7–11 with complete E38/E39, then adapt the recap to its two factors and retain the S21/22 Q5(c) close. The current blocks are approximately **4:59 through Beat 6** and **7:12 thereafter**, before redistribution of framing, fixes and new bookends; these are not promised finished runtimes. Keep both parts under outcome 3.2.1b in the planning discussion until Durai assigns release codes.

The split is a recommendation for coherence and attention across different measurement methods, not a claim that twelve minutes violates a duration cap. If Durai keeps one lesson, re-budget it honestly around the corrected script rather than forcing 8:45. In either case M1–M6 still require repair, and no error beat is to be shortened.
