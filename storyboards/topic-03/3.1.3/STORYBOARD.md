# 3.1.3 — Measuring how fast: catalase and amylase

**Storyboard, first draft. Cloud run 005, 24 September 2026.** No audio, no code, no render. Folder `storyboards/topic-03/3.1.3/`.
Cambridge 9700 syllabus 2025–2027, p.20. Command word **INVESTIGATE**. Budget from `TOPIC-PLAN-03-ENZYMES.md` §3.1.3 and `TOPIC-03-WEIGHTS.md`: **10:15, 15 macro beats, 1 error (E42)**, teaching base 9:30 (about 1,140 words) plus one 45-second talk-through allowance; delivered here as **15 beats (14 teaching + 1 error)**, matching the plan's 15 macro beats (see *Word count and runtime*). 3.1.3 is 5 of 15 sampled papers, 22 overlapping marks, mostly Paper 3 skill marks (S22/33 grouped block of 11). Runtime estimated at **120 words per minute of final video**.

> **3.1.3** investigate the progress of enzyme-catalysed reactions by measuring rates of formation of products using catalase and rates of disappearance of substrate using amylase

(syllabus p.20)

Authorities read, in full: `work/005/SHARED-SPECS.md` (binding); `cloud-inputs/003/standards/VIDEO-STRUCTURE.md` (the full shape, the five-move error beat, the badge rule, "Say the typical thing as typical", handling, colour changes, "When covalent bonds change"); `CONTENT-ARCHITECTURE.md`; `SYLLABUS-9700-DETAIL.md` (Topic 3 outcomes and introduction p.20; practical introduction p.51; materials list p.58; types of data p.61; mathematical requirements p.63); `TOPIC-PLAN-03-ENZYMES.md` (§3.1.3, rate vocabulary, shared-model table, lesson list, trap table, PLAN-CHECK and R2 responses); `TOPIC-03-WEIGHTS.md` (3.1.3 row and paragraph; ledger rows s23_12 Q14, s21_33 Q1(b)(iii), s22_33 Q1(a), s23_34 Q1(c)(i–ii); supplementary S-A, S-B, S-D; register E42); the cleared storyboards `3.1.1-2/STORYBOARD.md` and `3.2.2-3/STORYBOARD.md` with their `CHECK.md` and `CHECK-R2.md`; `cloud-inputs/005/evidence/` (EXAMINER-INSIGHT-9700, GATE-CRITERIA-9700-03-ENZYMES, COMPLEXITY-CALIBRATION-9700-BIOLOGY §3, PASTPAPERS-INVENTORY). **No question paper, mark scheme or examiner report PDF was opened for this draft; they are not available in this run.** Every quotation below is copied from the verified files named in *Citations*; everything else is either our wording, labelled *our framing*, or listed as `UNVERIFIED`.

**Build position:** second of the seven Topic 3 lessons (3.1.1-2 → **3.1.3** → 3.1.4 → 3.2.1 → 3.2.1b → 3.2.2-3 → 3.2.4). **Models used:** `EnzymeActiveSiteModel` (published by 3.1.1-2; states `rest-lk`, `bound`, `products` only); `Hydrolyse` (2.2.6, by reference). **Models published here:** `RateGraph`; `GasSyringeRig`; `WaterBathRig` and `BufferedTubeRig` (basic states); `CatalaseDiscRig`; `AmylaseIodineSampler`; reaction spec `CatalaseNet`; the `Hydrolyse` amylase replay spec (by reference). Everything drawn is a MODEL or labelled apparatus; every number plotted is *our illustrative data* unless it is a cited paper's value.

---

## The causal spine

One idea carries the lesson: **you cannot watch enzyme molecules, so you measure something you can see changing against a clock, and a rate is that change divided by time.** Everything else is which quantity you can measure, when you start the clock, and which of three different rate quantities your readings give you.

> **To follow an enzyme-catalysed reaction you measure how a quantity changes with time: a product appearing (catalase: volume of gas collected in a closed system from the moment of mixing) or a substrate disappearing (amylase: samples tested with iodine at stated regular times). A rate is a change per unit time; a single reading is an amount. On a progress curve the initial rate is the gradient of the tangent at t = 0, rise ÷ run, with units; a change over a whole stated interval is an average rate. When a method gives only the time to a fixed endpoint (a disc rising; loss of the blue-black colour), 1/t is a relative rate proxy for comparing conditions, not an initial rate and not a concentration curve. Other conditions are standardised, and a control with the enzyme boiled or replaced by water shows what happens without active enzyme.**

**What the mark schemes credit, quoted:** [s22_33 Q1(a), MS p.6] "oxygen is released (causing the discs to rise) ;", "records three times for each pH ;", "records a mean time for each pH ;", "results recorded as whole seconds ;", control "use boiled enzyme ;", reusing peroxide "contaminated with enzyme" / "use fresh hydrogen peroxide for each test". [s21_33 Q1(b)(iii), MS p.5] "mix solution Z with starch ; leave for a (stated) time ; test for starch / described ;". [Specimen 2022 Paper 2 Q3(c), MS p.13] "controlled variables ; take samples at timed intervals ; A regular intervals ; determine substrate or product concentration ; plot against time ; rate of disappearance / appearance ; determine initial rate ;". [Syllabus p.63] "calculate the rate of change from the gradient of a straight line on a graph" and "calculate the rate of change from the gradient of a tangent to a curved line on a graph". [s23_12 Q14, key C] a rate–time graph for a fixed enzyme and substrate: rate highest at the start and falling (ledger description, not a quotation). [s23_34 Q1(c)(i–ii), QP p.8 graph, ER p.33] 54 g and an average rate over 10 minutes of 5.4 g min⁻¹ (numbers only; the printed MS values are never shown). [Specimen 2022 Paper 1 Q13, key A] control: the enzyme replaced by water (ledger description). So the spine is what is credited: a measured quantity with a stated time, timed or regular sampling, plotting against time, an initial rate from a gradient, repeats and means, a boiled-enzyme or no-enzyme control.

**The handle:** *a count against a clock*. You cannot see catalase work, so you count cubic centimetres of gas while a stopwatch runs. Converted at once, in Beat 3 and Beat 12: *a rate is a change in a measured quantity divided by the time taken, with units such as cm³ s⁻¹; the initial rate is the gradient of the tangent to the progress curve at t = 0.* The handle is never the exam answer.

**Typicality rules applied.** Oxygen is named as the product of the catalase reaction; the graph axis is "volume of gas collected", because collecting a gas does not show that the collected gas is pure oxygen (the plan's own wording; S23/51's scheme also raises it, per the weights' S-D row). The plateau is attributed to peroxide being used up **in this run** (it sits just under the run's stoichiometric ceiling), not stated as the cause of every plateau. The iodine result is blue-black or iodine's own yellow-brown; the syllabus's p.61 ordinal example says "colourless" and is not contradicted in narration, only not used. "Usually" for the initial rate; "can" for a used peroxide tube holding enzyme. The iodine method gives an endpoint time and 1/t; it is never said to give a concentration curve or an initial gradient. Reasons students err are phrased as possibilities ("It can feel right, since…"). Local marking rulings stay local: E42's words are rulings on naming a variable in two June 2023 Paper 5 questions, and "average rate" stays valid for a change divided by a time. The catalase enzyme source in S22/33 is not asserted ("the catalase preparation").

**One error beat, five moves** (announce → written card → 4 s silent read → talk-through with cue-synced highlights → correct in place): **E42 in Beat 13**, badge **COMMON MISTAKE** (basis: the June 2023 report's "Candidates often referred to gas being produced rather than collected…" for Paper 51 Q1(d)(i), an examiner report showing candidates make it; Paper 52 Q1(d)'s "'Average' is not acceptable…" is a report ruling on the same kind of naming). The card combines faults from the two questions and is labelled **composite of two questions**; it has three faults and the marker clears only on the completed correct frame. No other beat carries a COMMON MISTAKE or EXAM CONTRAST badge; Beat 15's reject card is captioned as our wording contrast.

---

## The models, specified once

### `RateGraph` (published here; extended by 3.1.4, 3.2.1, 3.2.1b, 3.2.2-3, 3.2.4)

A plain two-axis graph component, labels as SVG text nodes, axis labels in the *quantity / unit* form (syllabus p.63's solidus convention). Points are dataset values drawn as small crosses; a smooth line of best fit is drawn through them. Every plotted dataset carries the caption *our illustrative data* unless it is a cited paper's value; schematic curves carry their own caption and are drawn in a visually separate panel. In this lesson the plotted points are single-run readings, not means; no replicate runs are invented to fit a "dataset means" convention. A value that was set or assumed rather than read is drawn differently from a reading: the (0 s, 0.0 cm³) start point of each gas series is an **open circle** labelled *0 s: plunger set at 0 cm³ before mixing (set, not a timed reading)*; calculated values appear only as labelled working (e.g. *initial rate = …*), never as plotted points.

| Configuration | Axes | Used here | Rules |
|---|---|---|---|
| `progress-product` | *volume of gas collected / cm³* (0–25, ticks every 5) against *time / s* (0–180, ticks every 30) | Beats 7, 8, 14 | Series `test` (accent) and `control` (grey). Overlays below. Never labelled "oxygen". |
| overlay `tangent-t0` | on `progress-product` | Beats 7, 12, 14 | A straight line through (0, 0) with gradient equal to the dataset's initial rate, drawn to t = 60 s; a right-angled **rise/run triangle** from (0 s, 0 cm³) to (50 s, 0 cm³) to (50 s, 20.0 cm³), sides labelled **run = 50 s** and **rise = 20.0 cm³**, result label **initial rate = 20.0 cm³ ÷ 50 s = 0.40 cm³ s⁻¹**. The tangent lies on the straight 0–30 s section and above the curve after it. |
| overlay `chord` | on `progress-product` | Beats 8, 13, 14 | A straight line between two plotted points at the ends of a stated interval, labelled **average rate over [interval]** with its working. Drawn dashed, in a different accent from the tangent. |
| overlay `reading` | on `progress-product` | Beats 8, 12, 14 | A vertical from one time to the curve and a horizontal to the y-axis, labelled **amount: [value] at [time]**. No rate label is ever attached to a single reading. |
| `rate-time` | *rate of reaction* against *time* (no numbers) | Beat 8 | Highest at t = 0, falling towards zero; caption *schematic model; not these data*; small type *the shape keyed C in s23_12 Q14*. Separate panel. |
| `progress-substrate-schematic` | *substrate concentration* (no numbers) against *time* | Beat 11 | Falling curve; caption **schematic; not measured**; the gradient label reads *gradient negative; rate of disappearance = its size*. Never overlaid on swatches or on measured data. |
| factor configurations (published, not used here) | temperature and peroxide concentration → *mean initial rate of gas collection / cm³ s⁻¹*; pH (disc) → *1/mean rise time / s⁻¹*; amylase concentration → *1/mean endpoint time / s⁻¹*; inhibitor concentration → *initial rate of change of absorbance / s⁻¹*; free vs bead (3.2.4) → *1/endpoint time / s⁻¹*, bars or table | none | y-axis always labelled by the actual measure. **An endpoint-method plot is never labelled "initial rate".** A schematic teaching curve is captioned *schematic model; not these data*. |
| `absorbance-time`, `calibration` | specified by 3.1.4 | none | — |

In this lesson the disc and iodine results are **single conditions**, so they are shown as small results tables, not graphs.

### `WaterBathRig` (basic state published here; 3.2.1 extends)

A thermostatically controlled water bath, front cut-away so the water level is visible, a **thermometer standing in the water** (reading **30 °C**), a test-tube rack in the water, a set-temperature display reading **30 °C**. States: **`maintained`** (display steady, thermometer reading 30 °C, faint ripples); **`equilibrating`** (as `maintained`, plus a small countdown tag **10:00 → 0:00** beside the vessels, running in time-lapse). Vessels stand in the rack or in the water, never floating. 3.2.1 adds the five-temperature and separate-equilibration-per-temperature states.

### `BufferedTubeRig` (basic state published here; 3.2.1 extends)

A labelled vessel whose label always carries **buffer solution, pH 7.0** under its contents name. States: **`stock-swirl`** (the yeast-suspension bottle, label *yeast suspension · buffer solution, pH 7.0*, swirled in a small horizontal circle by a hand at its shoulder; suspension drawn evenly cloudy after the swirl); **`tube-in-rack`** (a boiling tube in the bath rack, label *[contents] · buffer solution, pH 7.0*); **`pour`** (a bath-warmed tube lifted from the rack in a **test-tube holder** (labelled), held by the holder and tilted to **120° from upright**, mouth below base, stream from the lip computed from the rotated mouth, landing inside the receiving tube's mouth; the source liquid surface level and gathering toward the lip; the receiving level rising). 3.2.1 adds the five-pH set with fixed volumes.

### `GasSyringeRig` (published here; reused by 3.2.1 and 3.2.1b)

Parts, each named with an SVG text label where it sits:
- **conical flask** (250 cm³; base internal diameter about 85 mm, narrow neck about 30 mm across), holding **10.0 cm³ hydrogen peroxide solution, 0.20 mol dm⁻³** (a layer about 2 mm deep); the flask stands upright on the `WaterBathRig` shelf, bath water above its liquid level. A **weighted ring** (lead collar) is slipped **over the neck before the bung goes in** and rests on the flask's sloping shoulders: the cone widens below it, so it cannot slide down, and at the tilt used here (about 30°) its weight keeps it seated on the shoulders, so it stays in place when the flask is lifted and tilted; it keeps the flask from floating when stood in the bath. No clamp on the neck; the hand takes the neck **above the ring**.
- **small test tube** (about 45 mm long, 18 mm outside diameter; 5.0 cm³ fills it to about 25 mm, leaving about 20 mm clear to the rim), standing **upright inside the flask** on the flask base, **offset about 15 mm from the centre toward the side that will rise** in the tilt, so its rim clears the sloping wall by at least 1 mm; holding **5.0 cm³ yeast suspension (catalase source) in buffer solution, pH 7.0**; its rim sits well above the peroxide surface. Label on first appearance: *two liquids, one flask, not yet touching*.
- **bung with delivery tube**, the delivery tube leaving through the bung, joined by a length of **flexible tubing** so the flask can be tilted without pulling on the syringe.
- **three-way tap** in the line between the flexible tubing and the syringe (labelled), with two settings: **vent** (the flask side open to the air, the syringe isolated) and **collect** (flask to syringe only, vent closed).
- **gas syringe** (0–50 cm³ scale, 1 cm³ graduations, read to the nearest 0.5 cm³), **clamped horizontally** on a stand beside the bath, **plunger at 0 cm³**.
- **stopwatch** beside the syringe.

Handling (specified here; rendered still-frame verification pending): eye protection is worn throughout (an eye-protection pictogram sits in the corner of every hydrogen peroxide preparation frame), and the peroxide's measuring cylinder carries an attached tag *hydrogen peroxide: irritant; avoid skin and eye contact*. The peroxide is measured in a labelled **10 cm³ measuring cylinder** and poured into the flask at 120° from upright, stream from the lip into the flask mouth, before the small tube goes in. The empty small tube is lowered upright into the flask with labelled **long forceps**; the yeast suspension, swirled first (`BufferedTubeRig` `stock-swirl`), is measured with a labelled **5 cm³ graduated pipette** and run into the small tube with the **pipette tip held just above the small tube's mouth, not touching**, no drop reaching the peroxide. Liquid surfaces are drawn level in every frame.

States:
- **`open`**: flask (weighted ring on its shoulders) and small tube in the bath, bung off, lying beside the flask; tap at vent.
- **`sealed`**: after the 10 min equilibration, with the tap set to **vent**, the bung is **seated firmly before mixing**, delivery tube and flexible tubing connected through the tap to the syringe; the plunger is set to 0 cm³ and the tap turned to **collect**; tag *baseline 0 cm³ set after equilibration; collection path gas-tight*, then *system closed*. The bung stays seated and the tap stays at collect through every later state.
- **`tilt`** (one atomic start event): a hand holds the flask **by its neck, above the weighted ring**, lifts it just clear of the rack (its body still in the bath water) and tilts it smoothly toward the low side to about **30° from upright**; the peroxide surface stays horizontal and pools at the low heel. **Toppling path of the small tube:** as the flask passes about 20°, the small tube pivots on its downhill base edge, swings downhill and comes to lie along the flask base with its mouth toward the low heel (about 4 mm clear of the low wall), its axis at about **120° from upright (within 110–130°), mouth below base**. As it passes horizontal its liquid surface stays horizontal and gathers at the lip; a stream leaves the **rotated lip** and runs into the peroxide pool; the tube is drawn visibly emptying to a residual film. **On the rendered frame on which the first yeast suspension touches the peroxide, the stopwatch starts and collection begins; that frame is t = 0.** Any later time-zero tag or cue highlights the already-running stopwatch; it is never reset. The flask is then returned upright to the bath over ~0.5 s, the emptied small tube lying on its base.
- **`collecting`**: fine bubbles rise through the mixture (motion); the **plunger moves out smoothly**; at each 15 s tick the syringe reading snaps to the dataset value and a point drops onto the linked `RateGraph`.
- **`control`**: identical apparatus and exactly the same sequence (tap at vent, bung seated, baseline 0 cm³ set, tap to collect; tilt; stopwatch starting on the frame the liquids first meet; readings every 15 s), with **5.0 cm³ of the same enzyme-free buffer solution, pH 7.0** (the buffer vehicle made up with water in place of the yeast) in the small tube in place of the yeast suspension (label *enzyme-free control: 5.0 cm³ of the same buffer solution, pH 7.0, no yeast*), so the buffer contribution and the volume match the test (the plan's matched enzyme-free background control); its own stopwatch; no bubbles; plunger stays at 0 cm³.

### `CatalaseDiscRig` (transfer example here; 3.2.1 pH investigation)

A **boiling tube** in a rack, hydrogen peroxide solution to a **marked depth** (fixed concentration and volume; label *hydrogen peroxide, same concentration, volume and depth each time*); a small beaker labelled **catalase preparation (buffer solution, pH 7.0)**; a stack of **identical hole-punched filter-paper discs** (tag *same disc size*); labelled **long forceps**; a stopwatch. States: **`soak`** (the catalase preparation is first swirled to mix it, tag *mixed before each disc is soaked*; then forceps hold one disc fully immersed in it; tag *same soaking time for every disc*); **`release`** (forceps carry the disc straight down through the peroxide in the same brief ~1 s descent every time and open at the same release position on the tube's base; **the stopwatch starts at release, by the method's definition of the rise time**; forceps withdrawn; tags *same release position* and *same brief descent for every disc*); **`rising`** (small bubbles form on the disc; the disc lifts and rises steadily, motion); **`surface`** (disc at the surface, stopwatch stops, time label); **`fresh`** (the used tube emptied into a waste beaker at 120° from upright, a new tube filled from the stock to the mark; tag *fresh hydrogen peroxide for each disc*; the eye-protection pictogram and the tag *hydrogen peroxide: irritant; avoid skin and eye contact* attached to the stock bottle in this preparation frame); **`boiled-control`** (disc soaked in *boiled catalase preparation* released at the bottom; no bubbles; it stays at the bottom to the end of the observation, 120 s). Results table beside the rig: *time for disc to rise / s* (three rows, whole seconds) and *mean / s*. Caption *our illustrative times*.

### `AmylaseIodineSampler` (published here; reused by 3.2.1b and 3.2.4)

A **white spotting tile** (two rows of seven wells; row A labelled **test**, row B labelled **enzyme-free control: same buffer solution, no amylase**; columns headed *sample time (at withdrawal) / s* and labelled **0, 30, 60, 90, 120, 150, 180**, the 0 column carrying the small tag *start sample: taken immediately after mixing (nominal 0 s)*). Each well holds **one equal drop of iodine solution**, drawn in iodine's own **yellow-brown**; the iodine bottle carries an attached tag *iodine solution: avoid skin and eye contact*, with the eye-protection pictogram in its preparation frame. Two reaction tubes stand in the bath rack at 30 °C (`BufferedTubeRig` `tube-in-rack`), each with **its own stopwatch** and **its own sampling equipment**: tube **A, test** (5.0 cm³ amylase solution + 5.0 cm³ starch suspension, 1.0%) with **dropper A** and **rinse beaker A**; tube **B, control** (5.0 cm³ of the same enzyme-free buffer solution, pH 7.0, made up with water in place of amylase, + 5.0 cm³ starch suspension, 1.0%) with **dropper B** and **rinse beaker B**; one shared **waste beaker**. Each dropper and beaker is labelled with its letter; a dropper is never used on the other row.

Timing: each tube's stopwatch starts on the frame its first poured liquid reaches the starch, runs throughout and is never reset. A sample's column records the stopwatch time **at withdrawal**; the start sample is withdrawn immediately after mixing (the running stopwatch shows a few seconds, not a frozen 0) and is labelled *nominal 0 s*.

Motion: a dropper draws a little mixture from its own reaction tube, moves promptly to a position **above** the next well of its own row, is squeezed, and **one drop falls** into the iodine; the dropper **never touches** the iodine. Whatever mixture remains in the dropper after the drop is squeezed into the waste beaker, never back into either reaction tube. Between samples the dropper is rinsed in its own rinse beaker, then **squeezed fully empty into the waste beaker to expel the residual rinse water** before its next draw. Colour rule: each well switches **in one rendered frame**, at the moment its drop lands, between exactly two real colours: **blue-black** (starch present) or it **stays yellow-brown** (starch no longer detected). No RGB tween, no purple, no grey, no "colourless" state. All blue-black wells are drawn the same blue-black (no intensity grading, so no reading can be implied from shade). Result tag under the first yellow-brown well: **endpoint**. Caption *schematic swatches; judged by eye; our illustrative result*.

### `EnzymeActiveSiteModel` (published by 3.1.1-2; reused by state id)

Only **`rest-lk`**, **`bound`** and **`products`** are used, with 3.1.1-2's motion contract (substrate travels into the cleft ~0.8 s; products drift out) and caption *schematic; not a real protein shape*. Beat 1 and Beat 4: labelled **catalase**, substrate outline labelled **hydrogen peroxide**, with small type *schematic; the model does not show how many peroxide molecules bind at a time*. Beat 10: labelled **amylase**, substrate outline labelled **starch**, products labelled **maltose**. No new state is added.

### Reaction spec `CatalaseNet` (specified here; replayed elsewhere by reference only)

Net reaction **2H₂O₂ → 2H₂O + O₂**, the only way it is written in this lesson (H 4 → 4, O 4 → 4). Atom names: peroxide 1 is **H1–O1–O2–H2**; peroxide 2 is **H3–O3–O4–H4**; the two are drawn side by side with O2 and O3 facing each other.

| Operation | Edges |
|---|---|
| Delete | O1–O2 (single); O3–O4 (single); O2–H2; O3–H3 |
| Create | O1–H2; O4–H3; O2=O3 (double) |
| Retain | O1–H1; O4–H4 |

**Valence audit, both keyframes.** Before: O1 = O2 + H1 = 2; O2 = O1 + H2 = 2; O3 = O4 + H3 = 2; O4 = O3 + H4 = 2; H1, H2, H3, H4 each 1. After: O1 = H1 + H2 = 2; O4 = H3 + H4 = 2; O2 = O3 (double) = 2; O3 = O2 (double) = 2; H1, H2 on O1 and H3, H4 on O4, each 1. Products: water (O1, H1, H2), water (O4, H3, H4), oxygen (O2=O3). Bond-order change per atom: every O 2 → 2, every H 1 → 1.

**Net-transformation contract.** Both peroxide molecules are drawn complete and fully bonded until the switch; the **complete bond graph switches in one rendered frame** (all four deletions and three creations together); no crossfade, no overlapping old and new bond sets, no free H, OH or O species, no radical or intermediate drawn or narrated. Whole molecules may drift smoothly before and after the switch; bonds do not. The caption **net reaction; not a stepwise mechanism** is on screen from the inset's first frame to its last. The schematic `EnzymeActiveSiteModel` switches from `bound` to `products` in the same rendered frame. The builder runs a valence audit (O 2, H 1) on every rendered state.

### Reaction spec `Hydrolyse`, amylase replay (from 2.2.6, by reference)

The checked 2.2.6 internal α-1,4 hydrolysis on the four-glucose segment (C₂₄H₄₂O₂₁ + H₂O → 2 C₁₂H₂₂O₁₁; C24/H44/O22 both sides), exactly as 3.1.1-2 Beat 9 replays it. **Og** bridge oxygen; **Cp** partner glucose C4; **Ow** water oxygen; **Ht** transferred water hydrogen; **Hr** retained water hydrogen.

| Operation | Edges |
|---|---|
| Delete | Og–Cp; Ow–Ht |
| Create | Og–Ht; Cp–Ow |
| Retain | C1–Og; Ow–Hr; every spectator bond |

Bond-order sums before → after: glucose C1 4→4; Cp 4→4; Og 2→2; Ow 2→2; Ht 1→1; Hr 1→1. Only one new O–H edge is created; both product hydroxyls are complete. One-frame switch, no crossfade, fully bonded water approaches, caption **net reaction; not a stepwise mechanism** throughout, valence audit on every rendered state. The schematic model switches `bound` → `products` in the same frame.

---

## Beat by beat

Beat windows in the headings are provisional and follow the per-beat ledger (words ÷ 120; the 4 s silent read in Beat 13 sits inside the effective rate and is not added again); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch over 30 words without a stated visual change.

### BEAT 1 · Hook and context · 0:00–0:44
**Narration:**
> Ever wondered how you would put a number on how fast an enzyme works, when you cannot see a single molecule of it? Drop hydrogen peroxide onto raw potato and it fizzes: the enzyme catalase in the potato is breaking the peroxide down, and one product is a gas. The fizz shows it is happening, not how fast. Yet how fast is what this topic keeps asking: does warming it, or adding more enzyme, change the speed? For that you need a number, measured against a clock.

**Visual action:**
1. **From the first frame**, a raw potato slice on a white tile, a dropper held above it and a stopwatch at rest beside it are on screen (no labels yet); at *put a number on*, the hook question appears as a compact caption above the slice.
2. At *onto raw potato*, the slice is labelled **raw potato**; the dropper is squeezed **above** it (not touching) and drops land on the cut face; small bubbles form and rise from the wetted area (motion).
3. At *the enzyme catalase in the potato*, a magnifier circle opens on the cut face showing `EnzymeActiveSiteModel` in `rest-lk`, labelled **catalase**, caption *schematic; not a real protein shape*; a substrate outline labelled **hydrogen peroxide** travels in and seats (`bound`), then two smaller outlines drift out (`products`).
4. At *one product is a gas*, the rising bubbles are tagged **gas**.
5. At *The fizz shows*, a question tag **how fast?** hovers over the bubbles.
6. At *does warming it*, a thermometer icon appears beside the slice; at *adding more enzyme*, a second enzyme silhouette joins it; both tagged *later: 3.2.1, 3.2.1b*.
7. At *measured against a clock*, the stopwatch beside the slice starts and a blank pair of axes draws beneath it (no labels yet); dissolve to the objectives surface.

**On-screen text:** the hook question; *catalase*; *gas*; *how fast?*. Small type: *potatoes are among the plant sources of catalase listed on syllabus p.58*.

---

### BEAT 2 · What you will be able to do · 0:44–1:08
**Narration:**
> By the end you will be able to follow a reaction two ways, a product forming with catalase and a substrate disappearing with amylase; to tell apart three rate quantities and which method gives which; and to name the dependent variable and the control as examiners credit them.

**Visual action:** Own styled surface, distinct background colour, **not the lesson diagram**: each line enters with motion beside a simple authored pictogram (flat icons, not apparatus from the lesson). At *follow a reaction two ways*, line 1 with a **gas-bubbles** pictogram and an **iodine-drop** pictogram; at *tell apart three rate quantities*, line 2 with a **clock** pictogram; at *name the dependent variable*, line 3 with a **clock-and-tag** pictogram (a clock face with a small label tag).
1. **MEASURE** a product forming (catalase) and a substrate disappearing (amylase)
2. **READ** initial rate · average rate · 1/t, and know which method gives which
3. **NAME** the dependent variable, the standardised variables and the control

Small type: *syllabus 3.1.3, "investigate", p.20.*

---

### BEAT 3 · A rate, not an amount · 1:08–1:43
**Narration:**
> First, what a rate is: a change divided by the time it took, so its units carry a per time, like cubic centimetres per second. The gas collected by some moment is an amount; how much more arrives each second is a rate. Two runs can end with the same volume, one after a minute and one after ten. An enzyme changes how fast, so rate is what you measure.

**Visual action:**
1. **From the beat's first frame**, a small gas-collecting cylinder icon and a clock face stand at left of a plain working surface (not yet the lesson graph); at *what a rate is*, the word **rate** appears beside them as a compact caption.
2. At *a change divided by the time it took*, the fraction **rate = change ÷ time taken** builds beside the cylinder and clock; at *cubic centimetres per second*, the unit **cm³ s⁻¹** lands and its **s⁻¹** is ringed, tag *per time*.
3. At *is an amount*, the cylinder's gas level is frozen at one moment, labelled **amount: cm³**; at *how much more arrives each second*, a second icon gains a small step at each tick of a clock hand, labelled **rate: cm³ s⁻¹**.
4. At *Two runs can end with the same volume*, two cylinders fill to the same final mark, one quickly (clock reads 1 min); at *one after ten*, the other slowly (clock reads 10 min); their fill speeds are drawn as arrows of different lengths.
5. At *rate is what you measure*, the word **rate** brightens; the handle strap-line *a count against a clock* appears in small type.

**On-screen text:** *rate = change ÷ time taken*; *amount: cm³*; *rate: cm³ s⁻¹*.

---

### BEAT 4 · The catalase reaction, atom by atom · 1:43–2:25
**Narration:**
> Here is the first reaction. Catalase breaks hydrogen peroxide into water and oxygen: two H two O two gives two H two O plus O two. The inset shows the net change, as bookkeeping, not as the way the enzyme does it. Two peroxide molecules go in; in one step on screen their atoms are regrouped as two molecules of water and one molecule of oxygen, its two atoms held by a double bond. Four hydrogens, four oxygens, before and after, and the enzyme unchanged.

**Visual action:**
1. At *Here is the first reaction*, `EnzymeActiveSiteModel` in `rest-lk` at left, labelled **catalase**, caption *schematic; not a real protein shape*, small type *the model does not show how many peroxide molecules bind at a time*; at *into water and oxygen*, the substrate outline labelled **hydrogen peroxide** travels in and seats (`bound`).
2. At *two H two O two gives*, the equation **2H₂O₂ → 2H₂O + O₂** typesets above the model.
3. At *The inset shows the net change*, the `CatalaseNet` inset opens at right showing the two complete peroxide molecules, atoms labelled **O1–O4, H1–H4**; the caption **net reaction; not a stepwise mechanism** appears and stays to the end of the beat.
4. At *as bookkeeping, not as the way the enzyme does it*, small type under the caption: *atom labels are bookkeeping for the net change; no pathway is shown or implied*; both peroxide molecules stay complete and fully bonded.
5. At *their atoms are regrouped*, **the complete bond graph switches in one rendered frame** to the product keyframe (delete O1–O2, O3–O4, O2–H2, O3–H3; create O1–H2, O4–H3, O2=O3; retain O1–H1, O4–H4); in the same frame the main model switches to `products`; at *two molecules of water*, the two water molecules (O1 with H1, H2; O4 with H3, H4) are ringed and labelled **water**.
6. At *held by a double bond*, O2=O3 is ringed and labelled **oxygen**.
7. At *Four hydrogens, four oxygens*, an atom tally slides in beside the inset: **before H 4, O 4 · after H 4, O 4**.
8. At *the enzyme unchanged*, the product outlines drift out of the model's cleft (motion), the silhouette is traced once and a tick lands, tag *unchanged*; recall tag *recall: 3.1.1-2*.

**On-screen text:** **2H₂O₂ → 2H₂O + O₂**; atom labels; *net reaction; not a stepwise mechanism*; the tally; *catalase*, *water*, *oxygen*.

---

### BEAT 5 · The rig, named where it sits · 2:25–3:09
**Narration:**
> Now the apparatus, and where each part sits. The catalase comes from yeast, suspended in pH 7.0 buffer solution; swirl it before measuring each portion so the yeast stays evenly spread. Ten cubic centimetres of hydrogen peroxide, 0.20 moles per cubic decimetre, go into a conical flask. Upright inside it, a small test tube holds five cubic centimetres of yeast suspension: two liquids, not yet touching. The flask stands in a water bath at thirty degrees, thermometer in the water, for ten minutes, so both reach that temperature.

**Visual action:**
1. At *where each part sits*, a clean bench view; `WaterBathRig` at right in `maintained`, empty rack.
2. At *The catalase comes from yeast*, the yeast-suspension bottle appears; at *pH 7.0 buffer solution*, its label resolves to **yeast suspension · buffer solution, pH 7.0** (`BufferedTubeRig`).
3. At *swirl it before measuring each portion*, `stock-swirl`: a hand at the bottle's shoulder swirls it in a small circle; the settled cloud at the bottom lifts and spreads evenly.
4. At *Ten cubic centimetres of hydrogen peroxide*, a measuring cylinder labelled **10 cm³ measuring cylinder** and **hydrogen peroxide solution, 0.20 mol dm⁻³**, filled to the 10.0 mark (meniscus level), with the attached tag *hydrogen peroxide: irritant; avoid skin and eye contact* and an eye-protection pictogram in the frame corner (eye protection worn); at *into a conical flask*, it pours at 120° from upright, stream from the lip into the flask mouth; label **conical flask**.
5. At *a small test tube holds*, an empty small test tube is lowered upright into the flask with forceps labelled **long forceps**, standing offset toward one side as in the model spec, label **small test tube**; a pipette labelled **5 cm³ graduated pipette** runs 5.0 cm³ of the swirled suspension into it, **tip held just above the small tube's mouth, not touching**.
6. At *not yet touching*, the gap between the small tube's rim and the peroxide surface is bracketed, tag *two liquids, one flask, not yet touching*.
7. At *a water bath at thirty degrees*, the flask is stood upright in the bath with a weighted ring slipped over its neck and resting on its sloping shoulders (label **weighted ring**), water above its liquid level; the display reads **30 °C**; at *thermometer in the water*, the thermometer standing in the water is labelled, reading **30 °C**.
8. At *for ten minutes*, `equilibrating`: the countdown tag runs **10:00 → 0:00** in time-lapse; at *so both reach that temperature*, both liquids are outlined once in the accent, tag *both at 30 °C*.

**On-screen text:** part labels: *yeast suspension · buffer solution, pH 7.0*; *hydrogen peroxide solution, 0.20 mol dm⁻³, 10.0 cm³*; *10 cm³ measuring cylinder*; *conical flask*; *long forceps*; *5 cm³ graduated pipette*; *small test tube, 5.0 cm³ yeast suspension*; *weighted ring*; *water bath, 30 °C*; *thermometer*; the peroxide safety tag.

---

### BEAT 6 · Closed first, then mix: time zero · 3:09–4:03
**Narration:**
> This step makes the numbers trustworthy. While the reactants are still apart, seat a bung and delivery tube in the flask's neck; the tube runs to a gas syringe, clamped level, plunger at zero. The system is now closed. Tilt the flask by its neck so the small tube tips and the yeast spills into the peroxide, starting the timer as they first meet. That is time zero: stand the flask back in the bath, and read the syringe every fifteen seconds for three minutes. Collection starts at mixing, so the first gas is not lost. Then repeat with an enzyme-free control: the same buffer, no yeast.

**Visual action:**
1. At *makes the numbers trustworthy*, `GasSyringeRig` in `open` fills the frame, the equilibrated flask in the bath.
2. At *seat a bung and delivery tube*, with the three-way tap set to **vent** (label **three-way tap: vent**), the bung is pressed down into the neck and seated (`sealed`); label **bung with delivery tube**; at *a gas syringe, clamped level*, the flexible tubing runs through the tap to the gas syringe clamped horizontally on its stand; labels **flexible tubing**, **gas syringe**.
3. At *plunger at zero*, the syringe scale zooms briefly: the plunger is set to **0 cm³** and the tap turned to **collect**, tag *baseline 0 cm³ set after equilibration; collection path gas-tight*; at *The system is now closed*, a thin outline traces flask → bung → tubing → tap → syringe, tag **system closed before mixing**.
4. At *Tilt the flask by its neck*, `tilt`: a hand takes the neck above the weighted ring, lifts the flask just clear of the rack (body still in the bath water) and tilts it to about 30° from upright; the bung stays seated; the peroxide surface stays horizontal and pools at the low heel. At *the yeast spills into the peroxide*, the small tube follows its specified toppling path to lie along the flask base at about 120° from upright, mouth below base; a stream leaves its rotated lip and it visibly empties into the peroxide pool. **On the rendered frame on which the first yeast suspension touches the peroxide, the stopwatch starts and collection begins** (one atomic event; it is not held for a later cue).
5. At *as they first meet*, the point where the stream meets the peroxide is ringed and the already-running stopwatch pulses; at *That is time zero*, the tag **t = 0: mixing** lands on the stopwatch's start mark (the clock keeps running; it is not reset); at *stand the flask back in the bath*, the flask returns upright into the bath over ~0.5 s; `collecting`: fine bubbles rise, the plunger moves out smoothly.
6. At *every fifteen seconds*, a tick flashes on the stopwatch each 15 s (time-lapse to 180 s), the syringe reading snapping to each dataset value (6.0, 12.0 … 23.5 cm³) and a results table filling beside the rig: *time / s* and *volume of gas collected / cm³*; the 0 s row reads **0.0 (set before mixing)**, marked as set, not a timed reading.
7. At *Collection starts at mixing*, the tag **t = 0: mixing** and the plunger's 0 cm³ start pulse together; small type *a time-series adaptation of S23/51 Q1(d), whose original reading was the gas collected after one minute*.
8. At *an enzyme-free control*, a second rig slides in beside the first in `control` (small tube label **enzyme-free control: 5.0 cm³ of the same buffer solution, pH 7.0, no yeast**), with its own stopwatch, tap vented, bung seated, baseline set and tap turned to collect first, then tilted in exactly the same sequence, its stopwatch starting on the frame its liquids first meet; no bubbles; its plunger stays at 0 cm³; a table column *control / cm³* fills with 0.0 (its 0 s entry also marked *set before mixing*).

**On-screen text:** part labels; *system closed before mixing*; *t = 0: mixing*; the results table; the adaptation note; the control label.

---

### BEAT 7 · The progress curve, and the initial rate · 4:03–5:12
**Narration:**
> Plot volume of gas collected against time. The label says gas collected, not oxygen: oxygen is the gas the reaction makes, but collecting a gas does not prove it is pure oxygen. This progress curve rises steeply, then levels off just under twenty-four as the peroxide is used up; the enzyme-free control stays at zero. The rate at any moment is the gradient of this curve, and the one you usually want is the initial rate, at time zero, when conditions are exactly as you set them. Lay a ruler along the straight start, touching the curve at the origin: that is the tangent. Build a big triangle on it: a rise of twenty cubic centimetres over fifty seconds, so 0.40 cubic centimetres per second. The first thirty seconds really are straight, twelve over thirty, the same 0.40.

**Visual action:**
1. At *Plot volume of gas collected*, the two rigs shrink to the left edge and `RateGraph` `progress-product` draws at right with axis labels **volume of gas collected / cm³** and **time / s**, caption *our illustrative data*.
2. At *The label says gas collected, not oxygen*, the y-axis label is ringed; a ghost label *oxygen / cm³* appears beside it with a small ✗ and dissolves; at *does not prove it is pure oxygen*, small type beside the axis: *oxygen is the product of the catalase reaction; collection alone does not show the gas is pure oxygen*.
3. At *This progress curve rises steeply*, the 13 test points drop onto the graph from the results table in order (the 0 s point as an open circle, tag *0 s: set before mixing, not a timed reading*) and the line of best fit draws through them, straight from 0 to 30 s and smooth after; label **progress curve: product formation**; at *levels off just under twenty-four*, the flattening end is traced and **23.5 cm³** labelled; the rig inset's peroxide label dims, tag *peroxide used up*.
4. At *the enzyme-free control stays at zero*, the grey `control` series draws along the time axis, labelled **enzyme-free control: same buffer solution, no yeast**.
5. At *the gradient of this curve*, a short gradient marker slides along the curve from 0 to 150 s, visibly flattening as it goes.
6. At *the initial rate, at time zero*, the marker returns to the origin and stops; label **initial rate** at t = 0, tag *t = 0: conditions as set*.
7. At *Lay a ruler along the straight start*, a drawn ruler lies along the first section of the curve; at *that is the tangent*, overlay `tangent-t0` draws from the origin to t = 60 s, labelled **tangent at t = 0**.
8. At *Build a big triangle*, the rise/run triangle draws on the tangent; at *a rise of twenty cubic centimetres*, the vertical side is labelled **rise = 20.0 cm³**; at *over fifty seconds*, the horizontal side **run = 50 s**.
9. At *so 0.40 cubic centimetres per second*, the working lands beside the triangle: **initial rate = 20.0 cm³ ÷ 50 s = 0.40 cm³ s⁻¹**, units ringed.
10. At *twelve over thirty*, the points at 0, 15 and 30 s are ringed and joined by a thin straight line lying on the tangent; small working **12.0 cm³ ÷ 30 s = 0.40 cm³ s⁻¹** beneath.

**On-screen text:** axis labels; *our illustrative data*; *23.5 cm³*; *control*; *progress curve: product formation*; *tangent at t = 0*; *rise = 20.0 cm³*; *run = 50 s*; **initial rate = 0.40 cm³ s⁻¹**. Small type: *syllabus p.63: "calculate the rate of change from the gradient of a tangent to a curved line on a graph"*.

---

### BEAT 8 · An amount, an average rate, and a rate that falls · 5:12–5:56
**Narration:**
> Three things are easy to blur here. The reading at sixty seconds, nineteen cubic centimetres, is an amount: the volume of gas collected after one minute. Divided by sixty seconds, it gives an average rate over that minute, about 0.32 cubic centimetres per second, lower than the initial rate because the curve was already bending. A June 2023 practical question did the same with a mass: fifty-four grams in ten minutes, 5.4 grams per minute. And the rate itself, plotted against time, is highest at the start, then falls.

**Visual action:**
1. At *Three things are easy to blur*, three labelled slots appear above the graph: **amount** · **average rate** · **initial rate** (the last already filled: *0.40 cm³ s⁻¹*).
2. At *The reading at sixty seconds*, overlay `reading` draws at t = 60 s; at *is an amount*, its label **amount: 19.0 cm³ at 60 s** lands and the **amount** slot fills.
3. At *the volume of gas collected after one minute*, small type: *the reading used in S23/51 Q1(d) (June 2023, Paper 5)*.
4. At *Divided by sixty seconds*, overlay `chord` draws dashed from (0, 0) to (60 s, 19.0 cm³); at *an average rate over that minute*, its label **average rate over 0–60 s = 19.0 cm³ ÷ 60 s = 0.32 cm³ s⁻¹** lands and the **average rate** slot fills.
5. At *lower than the initial rate*, the tangent and the chord are ringed together; the chord visibly lies below the tangent.
6. At *did the same with a mass*, a small separate panel slides in at right, beside the lesson graph, headed *s23_34 Q1(c)(i–ii)* and captioned **schematic reconstruction of the registered reading; original figure unavailable**, with provenance in small type: *June 2023 9700/34 Q1(c)(i–ii), QP p.8; ER p.33 (verified-register provenance; the original graph was not inspected)*. It draws two bare axes: horizontal **lactase concentration / mmol dm⁻³** with only the value **0.16** marked; vertical **mass / g** with only the value **54** marked (no substance named). At *fifty-four grams in ten minutes*, a dashed guide rises from 0.16 and a dashed guide runs across from 54, meeting at **one point**, tag *registered reading: 54 g (in 10 min)*; no curve, no other points. At *5.4 grams per minute*, the working lands under the panel: **54 ÷ 10 = 5.4 g min⁻¹, average over 10 min**. The panel never shows the printed MS values.
7. At *plotted against time*, the reconstruction panel clears and a separate panel draws `rate-time`, caption *schematic model; not these data*; at *highest at the start, then falls*, the curve is traced from its maximum at t = 0 downward; small type *the shape keyed C in s23_12 Q14 (Paper 1)*.

**On-screen text:** the three slots; *amount: 19.0 cm³ at 60 s*; the chord working; the S23/34 schematic reconstruction panel, its caption, provenance and working; the rate–time panel and its caption.

---

### BEAT 9 · Transfer: the rising disc · 5:56–6:47
**Narration:**
> The same enzyme can be timed another way, as a June 2022 practical paper did. A filter-paper disc soaked in catalase preparation is released at the bottom of a tube of hydrogen peroxide; oxygen is released at the disc, and it rises. Time it to the surface: twelve, thirteen, fourteen seconds, mean thirteen. Use fresh peroxide for each disc, since a used tube can hold enzyme, and a boiled-enzyme disc as the control. One fixed endpoint gives one time, not a curve, so take one over the mean time: 0.077 per second, a relative rate for comparing conditions, not an initial rate.

**Visual action:**
1. At *timed another way*, the graph slides left and dims; `CatalaseDiscRig` enters at right; small type *transfer example; the S22/33 design (Paper 3)*.
2. At *A filter-paper disc soaked*, `soak`: the beaker labelled **catalase preparation (buffer solution, pH 7.0)** is swirled to mix it, tag *mixed before each disc is soaked*; forceps labelled **long forceps** then hold a disc (tag *same disc size*) immersed in it; tag *same soaking time for every disc*.
3. At *released at the bottom*, `release`: the long forceps carry the disc straight down through the peroxide in the same brief descent (about 1 s) for every disc (tag *same depth of peroxide each time*) and open at the same release position on the tube's base; the stopwatch starts as they open, tag *timed from release, by the method's definition; same brief descent for every disc*; the forceps withdraw.
4. At *oxygen is released at the disc*, `rising`: small bubbles form on the disc and it rises; citation tab, exact: **s22_33 Q1(a), MS p.6: "oxygen is released (causing the discs to rise) ;"**.
5. At *Time it to the surface*, `surface`: the disc reaches the surface and the stopwatch stops at **12 s**; the run repeats in time-lapse, **13 s**, **14 s**, filling the table *time for disc to rise / s* (whole seconds); at *mean thirteen*, the mean row fills **13 s** with small type *(12 + 13 + 14) ÷ 3 = 13 s*.
6. At *Use fresh peroxide for each disc*, `fresh`: the used tube is emptied into a waste beaker (poured at 120° from upright) and a new tube filled to the mark, with the eye-protection pictogram and the tag *hydrogen peroxide: irritant; avoid skin and eye contact* on the stock bottle; at *a used tube can hold enzyme*, citation tab, exact: **MS p.6: "contaminated with enzyme" / "use fresh hydrogen peroxide for each test"**.
7. At *a boiled-enzyme disc*, `boiled-control`: a disc from the beaker labelled **boiled catalase preparation** is released; no bubbles; it stays at the bottom while the stopwatch runs to 120 s; tag *control: "use boiled enzyme ;"*.
8. At *One fixed endpoint gives one time*, the surface line on the tube is ringed, tag **fixed endpoint: disc at surface**; a ghost of a progress curve appears and is struck through, tag *no curve from this method*.
9. At *one over the mean time*, the working lands: **1 / mean rise time = 1 ÷ 13 s = 0.077 s⁻¹**.
10. At *a relative rate for comparing conditions*, the label **relative rate (proxy)** appears under the working; a ghost label *initial rate* beside it is struck through.

**On-screen text:** part labels; the results table (12, 13, 14; mean 13 s); the MS tabs; **1/mean rise time = 0.077 s⁻¹, a relative rate**; *our illustrative times*.

---

### BEAT 10 · Amylase: following starch as it disappears · 6:47–7:33
**Narration:**
> Now a substrate disappearing. Amylase hydrolyses starch to maltose; the inset replays it from the carbohydrate lessons, one water used, one glycosidic bond broken. Iodine solution tests for starch: blue-black while starch is present, and iodine's own yellow-brown once it is no longer detected. Amylase solution and starch suspension, both in pH 7.0 buffer, wait in separate tubes in the bath at thirty degrees. Pour the amylase into the starch, starting the timer as they first meet, then mix. On a white spotting tile, each well holds one drop of iodine.

**Visual action:**
1. At *a substrate disappearing*, the disc rig slides away; `EnzymeActiveSiteModel` in `rest-lk` at left, labelled **amylase**, caption *schematic; not a real protein shape*.
2. At *Amylase hydrolyses starch to maltose*, a substrate outline labelled **starch** seats in the cleft (`bound`); the `Hydrolyse` inset opens at right with the four-glucose segment and a fully bonded water model beside its middle bridge, labelled *atom-resolved substrate (MODEL)*; caption **net reaction; not a stepwise mechanism** from here to the inset's close; recall tag *recall: 2.2.6*.
3. At *the inset replays it*, the water model approaches the bridge (motion, fully bonded); at *one glycosidic bond broken*, **the complete bond graph switches in one rendered frame** per the `Hydrolyse` spec (delete Og–Cp, Ow–Ht; create Og–Ht, Cp–Ow; retain C1–Og, Ow–Hr), and in the same frame the main model switches to `products`, outlines labelled **maltose**; the inset closes after a 1 s product hold.
4. At *Iodine solution tests for starch*, a single well of iodine solution (yellow-brown) appears at centre, label **iodine solution**.
5. At *blue-black while starch is present*, a drop of starch suspension falls into it from above and the well switches in one frame to **blue-black**, tag *starch present*; at *iodine's own yellow-brown*, a second well beside it receives a drop of water (label *no starch*) and stays **yellow-brown**, tag *starch not detected*.
6. At *wait in separate tubes*, `BufferedTubeRig` `tube-in-rack`: each volume is measured where it is shown, with a labelled **5 cm³ graduated pipette** for each liquid: **5.0 cm³ amylase solution · buffer solution, pH 7.0** and **5.0 cm³ starch suspension, 1.0% · buffer solution, pH 7.0** in the test pair; beside them, the labelled control pair **5.0 cm³ of the same enzyme-free buffer solution, pH 7.0 (water in place of amylase)** and **5.0 cm³ starch suspension, 1.0% · buffer solution, pH 7.0**; all four boiling tubes in the bath rack at 30 °C, the pairs tagged **A: test** and **B: control**, each pair with its own stopwatch; the `WaterBathRig` `equilibrating` countdown runs. While it runs, the white spotting tile is set out beside the bath and every well is filled with one equal drop of iodine solution, so the tile is ready before any pour; the iodine bottle carries the tag *iodine solution: avoid skin and eye contact* and the eye-protection pictogram sits in the frame corner (the tile stays unlabelled until its cue).
7. At *Pour the amylase into the starch*, `pour`: the amylase tube is lifted from the bath in a labelled **test-tube holder** and poured at 120° from upright into the starch tube (stream from the lip into the mouth). The stopwatch starts when the first amylase reaches the starch. Complete the pour promptly, mix consistently, and return the reaction tube to the bath. The clock continues throughout; it is never reset after pouring. At *as they first meet*, the first-contact point is ringed and the already-running stopwatch A pulses, tag **t = 0: mixing**; at *then mix*, the reaction tube, in its holder, is swirled gently for the same few seconds and returned to the rack in the bath (stopwatch A still running). Pair B is poured and mixed in exactly the same way in time-lapse, stopwatch B starting when its first buffer reaches its starch.
8. At *a white spotting tile*, `AmylaseIodineSampler`: the tile, already set out and filled before the pour, is brought forward beside the bath and labelled: columns **0 … 180** under the heading *sample time (at withdrawal) / s*, row A **test**, row B **enzyme-free control: same buffer solution, no amylase**; beside it, **dropper A** with **rinse beaker A**, **dropper B** with **rinse beaker B**, and a **waste beaker**; at *one drop of iodine*, the equal yellow-brown drop in every well is ringed row by row, tag *filled before mixing*.

**On-screen text:** *amylase*, *starch*, *maltose*; *net reaction; not a stepwise mechanism*; *starch present: blue-black*; *starch not detected: yellow-brown*; tube labels with volumes and the 1.0% starch concentration; *5 cm³ graduated pipette*; *test-tube holder*; *t = 0: mixing*; tile, dropper and beaker labels; the iodine safety tag.

---

### BEAT 11 · Sampling by eye: an endpoint and 1/t · 7:33–8:28
**Narration:**
> Immediately after mixing, then every thirty seconds, let one drop of the mixture fall into the next well from just above, without touching the iodine. Blue-black up to a hundred and twenty seconds; at a hundred and fifty, yellow-brown. That first sample without blue-black is the endpoint, a hundred and fifty seconds, good to one sampling interval. One over a hundred and fifty is 0.0067 per second, a relative rate like the disc's. Colours judged by eye give no concentration values, so no starch curve here and no initial gradient. A falling starch curve is only a schematic: its gradient is negative, and the rate of disappearance is its size.

**Visual action:**
1. At *Immediately after mixing*, dropper A draws from tube A while stopwatch A keeps running (it reads a few seconds; it is not frozen at 0), moves promptly above well A-0 and releases one drop (the well switches in one frame to blue-black); tag on column 0: *start sample: taken immediately after mixing (nominal 0 s)*; small type *each sample is recorded at its time of withdrawal*; dropper B does the same for tube B into B-0 by stopwatch B; at *every thirty seconds*, the stopwatches' 30 s marks pulse; at *from just above*, the gap between dropper tip and iodine is ringed, tag *above, not touching*; after each drop, what is left in the dropper is squeezed into the waste beaker, never back into a reaction tube; between samples each dropper is rinsed in its own rinse beaker and squeezed fully empty into the waste beaker before its next draw (shown, not narrated).
2. At *up to a hundred and twenty seconds*, wells A-30, A-60, A-90 and A-120 are sampled in time-lapse with dropper A, each switching in one frame to **blue-black** as its drop lands; row B is sampled alongside with dropper B and every control well switches to **blue-black**.
3. At *at a hundred and fifty, yellow-brown*, the drop lands in A-150 and the well **stays yellow-brown**; A-180 is sampled and stays yellow-brown; B-150 and B-180 switch to blue-black.
4. At *is the endpoint*, A-150 is ringed, tag **endpoint: first sample without blue-black**; at *good to one sampling interval*, a bracket spans A-120 to A-150, tag *the change happened after the 120 s sample, by 150 s*.
5. At *One over a hundred and fifty*, the working lands: **1/t = 1 ÷ 150 s = 0.0067 s⁻¹**, label **relative rate (proxy)**; the Beat 9 result **0.077 s⁻¹** reappears small beside it with the same label.
6. At *Colours judged by eye*, the tile is bracketed, tag *judged by eye: no concentration values*; at *no initial gradient*, ghosts of a substrate curve and a tangent appear over the tile and are struck through.
7. At *only a schematic*, a separate panel draws `progress-substrate-schematic`, caption **schematic; not measured**; at *its gradient is negative*, a short downward gradient marker on the curve, tag *gradient negative*; at *the rate of disappearance is its size*, the tag extends: *rate of disappearance = size of the gradient*.

**On-screen text:** tile column labels; *start sample: taken immediately after mixing (nominal 0 s)*; *each sample is recorded at its time of withdrawal*; *endpoint*; *1/t = 0.0067 s⁻¹, relative rate*; *judged by eye*; the schematic panel and its caption. Small type: *our illustrative result; row B, the enzyme-free buffer control, stays blue-black to 180 s*.

---

### BEAT 12 · Variables, the control, and the sentence you write · 8:28–9:10
**Narration:**
> When these methods test a factor in the next lessons, name the variables properly. The independent variable is the factor you change, temperature, say. The dependent variable is what you measure, with its time stated: the volume of gas collected after one minute. Volumes, concentrations, pH and equilibration time are standardised. The control has the enzyme boiled, or replaced by water. Written properly: the initial rate is the gradient of the tangent to the progress curve at time zero, in cubic centimetres per second.

**Visual action:**
1. At *test a factor*, the gas-syringe rig returns at centre with a variables panel beside it; small type *factors: 3.2.1, 3.2.1b*.
2. At *The independent variable*, panel row 1: **independent variable: the factor you change (e.g. temperature)**; the bath display is ringed.
3. At *The dependent variable*, row 2: **dependent variable: the measured quantity, time stated**; at *with its time stated*, the syringe scale and the stopwatch are ringed together, and the `reading` thumbnail *19.0 cm³ at 60 s* appears beside row 2.
4. At *are standardised*, row 3: **standardised: volumes · concentrations · pH · equilibration time**; the 10.0 cm³, 5.0 cm³, 0.20 mol dm⁻³, pH 7.0 and 10:00 labels on the rig pulse in turn.
5. At *The control has the enzyme boiled*, row 4: **control: enzyme boiled, or replaced by water**; the Beat 6 control rig and the tile's row B appear as thumbnails; at *replaced by water*, small type *specimen 2022 Paper 1 Q13, key A: enzyme replaced by water*, and beneath it, separately, *our operational control: the same buffer solution made up with water in place of the enzyme*.
6. At *Written properly*, the sentence surface slides up beneath the panel; at *the gradient of the tangent to the progress curve*, the sentence builds clause by clause with the `tangent-t0` thumbnail beside it: **The initial rate is the gradient of the tangent to the progress curve at t = 0 · rise ÷ run · in cm³ s⁻¹.**

**On-screen text:** the four panel rows; the sentence.

---

### BEAT 13 · COMMON MISTAKE E42: produced, average, amount · 9:10–10:23
**Narration:**
> Here is a mistake the June 2023 examiners reported, on the card. A planning question asked for the dependent variable in a gas-collection experiment. Read this answer.
>
> *(silent read, 4 s)*
>
> Start with the word produced here. It can feel right, since the reaction does produce the gas, but the syringe measures the gas that reaches it: gas collected. The report says candidates often wrote produced rather than collected, and did not gain credit for the dependent variable. Next, the word average here. For repeated readings, the report on a second paper asks for mean. And the word amount here: that report wants the quantity you actually read, a volume. So, in place: the mean volume of gas collected after one minute. One boundary: this is about naming a variable in those questions. Average rate, a change divided by a time, is still right for what you worked out earlier.

**Visual action:**
1. **Entry cue: *Here is a mistake the June 2023 examiners reported*.** COMMON MISTAKE panel enters (header, terracotta border, desaturated surround) and **stays on until the last fault is corrected**. The gas-syringe rig and the progress graph hold at left, dimmed.
2. At *A planning question asked for the dependent variable*, the header line lands: **Name the dependent variable in this investigation.** with small type *Our framing of June 2023 Paper 51 Q1(d)(i) (the question's own wording is not reproduced: UNVERIFIED). Card: composite of two questions, June 2023 Paper 51 Q1(d)(i) and Paper 52 Q1(d); not a transcript.*
3. At *Read this answer*, the written wrong answer appears in handwriting style: **✗ Dependent variable: the average amount of gas produced after one minute**.
4. **Silent read, 4 s.** Panel and card held.
5. At *Start with the word produced*, the word *produced* on the card is underlined in terracotta; at *the syringe measures the gas that reaches it*, the dimmed syringe at left brightens and its scale is ringed, side-note *what is measured: gas collected*.
6. At *The report says candidates often wrote*, citation tab, exact: **June 2023 ER, Paper 51 Q1(d)(i), p.52: "(d) (i) Candidates often referred to gas being produced rather than collected and therefore did not gain credit for the dependent variable."** The word *produced* stays underlined; the marker stays on.
7. At *Next, the word average here*, the word *average* on the card is underlined in terracotta; at *the report on a second paper*, second tab, exact: **June 2023 ER, Paper 52 Q1(d), p.55: "'Average' is not acceptable for 'mean' and 'amount' is not acceptable for 'volume.'"**; its first clause is underlined.
8. At *And the word amount here*, the word *amount* on the card is underlined in terracotta and the tab's second clause is underlined; at *the quantity you actually read*, the syringe scale at left pulses, side-note *read in cm³: a volume*.
9. At *So, in place*, the three faults are corrected in place, in order, each strike landing on its own word with the marker still on: *produced* → **collected**, then *average* → **mean**, then *amount* → **volume**; at *the mean volume of gas collected after one minute*, the last replacement lands, the card reads **✓ Dependent variable: the mean volume of gas collected after one minute / cm³**, and **the marker clears on this completed frame**.
10. At *One boundary*, a boundary tab beneath in the normal accent: **local rulings: S23/51 Q1(d)(i) and S23/52 Q1(d); not a global word ban**; at *Average rate, a change divided by a time*, the Beat 8 chord label *average rate over 0–60 s = 0.32 cm³ s⁻¹* returns small beside the tab with a tick. **Exit cue: end of *what you worked out earlier*.** Treatment lifts; the corrected card and the boundary tab hold.

**On-screen text:** the panel; the framed header and composite caption; the card; the two report tabs; the corrected card; the boundary tab.

---

### BEAT 14 · What I told you, on the rig and the graph · 10:23–11:05
**Narration:**
> So here it is, on the rig and graph. Catalase, a product forming: gas collected in a closed system from mixing. The tangent at time zero gives the initial rate, 0.40 cubic centimetres per second; a change over an interval, an average rate; a single reading, an amount. The disc gives one time to a fixed endpoint; one over it, a relative rate. Amylase, a substrate disappearing: iodine samples by eye, an endpoint, and one over its time. Without active enzyme, the controls stay unchanged.

**Visual action:** **No new slide.** The screen returns to the layout built through the lesson: `GasSyringeRig` (`collecting`, bath at 30 °C) at left, `RateGraph` `progress-product` at centre with its `tangent-t0` triangle, `chord` and `reading` overlays, the `CatalaseDiscRig` small at upper right with its results table, the `AmylaseIodineSampler` tile small at lower right. Static. Key points fade in in place:
1. At *on the rig and graph*, the whole layout settles; nothing moves.
2. At *Catalase, a product forming*, the flask and syringe brighten with tag *product: gas collected*; at *in a closed system from mixing*, the tags **system closed before mixing** and **t = 0: mixing** brighten on the rig.
3. At *The tangent at time zero*, the tangent triangle and **initial rate = 0.40 cm³ s⁻¹** brighten.
4. At *a change over an interval*, the chord and its **average rate** label brighten; at *a single reading, an amount*, the **amount: 19.0 cm³ at 60 s** label brightens.
5. At *The disc gives one time*, the disc rig's table and **1/mean rise time = 0.077 s⁻¹, relative rate** brighten.
6. At *Amylase, a substrate disappearing*, the tile brightens; at *an endpoint, and one over its time*, the **endpoint** tag on A-150 and **1/t = 0.0067 s⁻¹** brighten.
7. At *the controls stay unchanged*, the grey control line on the graph and the tile's blue-black row B brighten together.

---

### BEAT 15 · How it is asked, the reject card, and the potato · 11:05–11:49
**Narration:**
> How this reaches you. A practical paper gave you the disc method and credited the table: three times for each pH, whole seconds, a mean, and boiled enzyme as control. A specimen written paper asks you to outline how progress is investigated, crediting timed samples, plotting against time and determining the initial rate. The reject card: a volume is an amount; a rate has a per time. And the potato? Collect its gas against a clock, and the tangent at time zero puts a number on how fast.

**Visual action:**
1. At *How this reaches you*, a compact forms surface enters at left, one row per form, **beside the familiar lesson layout, which stays on screen from the beat's first frame** at right (reduced): `GasSyringeRig` with the `RateGraph` `progress-product` and its tangent triangle, the `CatalaseDiscRig` with its results table, and the `AmylaseIodineSampler` tile. Row 2 is revealed with the surface at this cue (not narrated): **test whether a protein is amylase** · *s21_33 Q1(b)(iii) (Paper 3); our framing of the question*, small type, exact: *MS p.5: "mix solution Z with starch ; leave for a (stated) time ; test for starch / described ;"*; the iodine tile brightens briefly beside it.
2. At *gave you the disc method*, row 1: **disc method: results table, repeats, mean, control** · *s22_33 Q1(a) (Paper 3)*, and the disc rig's table brightens; at *three times for each pH*, small type, exact: *MS p.6: "records three times for each pH ;" "results recorded as whole seconds ;" "records a mean time for each pH ;" "use boiled enzyme ;"*.
3. At *outline how progress is investigated*, row 3: **outline how progress is investigated** · *specimen 2022 Paper 2 Q3(c); our framing of the instruction (exact wording UNVERIFIED)*, and the progress graph brightens; at *determining the initial rate*, small type, exact: *MS p.13: "take samples at timed intervals ; A regular intervals" · "plot against time ;" · "determine initial rate ;"*.
4. At *The reject card*, the reject card lands beside the graph, struck through by hand: **✗ rate of reaction = 19.0 cm³** / **✓ 19.0 cm³ is the volume of gas collected after 60 s (an amount); initial rate = 0.40 cm³ s⁻¹**, caption in small type *our wording contrast; based on the Topic 3 rate vocabulary and syllabus p.63*.
5. At *And the potato*, the Beat 1 potato slice returns small at the bottom, fizzing, captioned **same measurement method; potato rate not measured here**; at *Collect its gas against a clock*, the fizz bubbles slide into a small gas-syringe icon beside a running stopwatch (no number on the potato inset); at *puts a number on how fast*, the tangent triangle flashes once on the yeast run's progress graph, its label attached to that graph: **illustrative yeast run: initial rate = 0.40 cm³ s⁻¹**. Final frame held 2 s: forms at left, the lesson layout and reject card at right, the potato inset beneath with its caption and no number. No slogan.

**On-screen text:** the three forms with citations; the reject card; *same measurement method; potato rate not measured here*; *illustrative yeast run: initial rate = 0.40 cm³ s⁻¹*.

---

## Datasets

All four are our illustrative data except Dataset 4, which is the paper's own values. Every derived number is worked.

### Dataset 1 — catalase, gas syringe, standard run (Beats 5–8, 12–15)

Conditions: 5.0 cm³ yeast suspension in buffer solution, pH 7.0 (swirled before measuring) + 10.0 cm³ hydrogen peroxide solution, 0.20 mol dm⁻³; each equilibrated separately (small tube inside the flask) for 10 min in a water bath at 30 °C; tap at vent while the bung is seated after equilibration, then plunger set to 0 cm³ and tap turned to collect (baseline 0 cm³ set after equilibration; collection path gas-tight); bung seated before mixing; t = 0 on the frame the first yeast suspension touches the peroxide during the tilt (the stopwatch starts then and is not reset); syringe read to the nearest 0.5 cm³; the 0 s entry (0.0 cm³) is the plunger position set before mixing, not a timed reading. Readings are from a single run (no replicates). Control (enzyme-free): 5.0 cm³ of the same enzyme-free buffer solution, pH 7.0 (the buffer made up with water in place of the yeast) in place of the yeast suspension; same buffer, same volume, no enzyme; everything else the same, including the start sequence. (The cited control, the enzyme replaced by water, is specimen 2022 Paper 1 Q13 key A as the ledger describes it; this buffer-matched preparation is our operational version of it.)

| time / s | 0 | 15 | 30 | 45 | 60 | 75 | 90 | 105 | 120 | 135 | 150 | 165 | 180 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| volume of gas collected, test / cm³ | 0.0 | 6.0 | 12.0 | 16.5 | 19.0 | 21.0 | 22.5 | 23.0 | 23.5 | 23.5 | 23.5 | 23.5 | 23.5 |
| volume of gas collected, control / cm³ | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| increase in the 15 s interval / cm³ | — | 6.0 | 6.0 | 4.5 | 2.5 | 2.0 | 1.5 | 0.5 | 0.5 | 0.0 | 0.0 | 0.0 | 0.0 |
| average rate over that 15 s interval / cm³ s⁻¹ | — | 0.40 | 0.40 | 0.30 | 0.17 | 0.13 | 0.10 | 0.033 | 0.033 | 0 | 0 | 0 | 0 |

Derived:
- **Genuinely straight initial section, 0–30 s:** 6.0 ÷ 15 = 0.40; 12.0 ÷ 30 = 0.40; the three points (0, 0), (15, 6.0), (30, 12.0) are collinear through the origin. At 45 s, 16.5 ÷ 45 = 0.367 < 0.40, so the curve has begun to bend after 30 s.
- **Initial rate (tangent at t = 0):** tangent V = 0.40 t. Triangle (0 s, 0) → (50 s, 0) → (50 s, 20.0 cm³): **20.0 cm³ ÷ 50 s = 0.40 cm³ s⁻¹**. Check against the straight section: **12.0 cm³ ÷ 30 s = 0.40 cm³ s⁻¹**. The tangent lies above the curve after 30 s (at 45 s: 18.0 vs 16.5; at 60 s: 24.0 vs 19.0), as it must for a curve that is bending downward.
- **Amount at 60 s:** 19.0 cm³ (a reading; no rate).
- **Average rate 0–60 s (chord):** **19.0 cm³ ÷ 60 s = 0.317 cm³ s⁻¹ = 0.32 cm³ s⁻¹ (2 s.f.)**, below 0.40.
- (Not narrated) average rate 60–120 s: (23.5 − 19.0) ÷ 60 = 4.5 ÷ 60 = 0.075 cm³ s⁻¹.
- **Rate falls with time:** the interval rates 0.40, 0.40, 0.30, 0.17, 0.13, 0.10, 0.033, 0.033, 0, 0, 0, 0 never rise, consistent with the schematic `rate-time` shape (highest at the start, falling).
- **Stoichiometric ceiling:** 10.0 cm³ × 0.20 mol dm⁻³ = 0.0100 dm³ × 0.20 mol dm⁻³ = 2.0 × 10⁻³ mol = 2.0 mmol H₂O₂ → 1.0 mmol O₂ (2H₂O₂ → 2H₂O + O₂) → 1.0 × 10⁻³ mol × 24 dm³ mol⁻¹ = 0.024 dm³ = **24 cm³**, assuming the gas in the syringe, which sits outside the 30 °C bath, is at room temperature and pressure (the supplied approximation 24 dm³ mol⁻¹). Highest reading **23.5 cm³ ≤ 24 cm³**. This is an approximate oxygen-yield check for this run, not a universal bound for any gas mixture at any temperature or pressure. (Not narrated.)
- **Control:** 0.0 cm³ at every reading (to the 0.5 cm³ reading resolution): without the yeast suspension, no gas collected in 180 s.

### Dataset 2 — catalase disc rise, transfer example (Beats 9, 14, 15)

Conditions: identical hole-punched filter-paper discs, each soaked for the same time in the catalase preparation (buffer solution, pH 7.0); released at the bottom of a tube of hydrogen peroxide of fixed concentration, volume and depth; fresh hydrogen peroxide for each disc; times in whole seconds. Control: disc soaked in boiled catalase preparation.

| disc | 1 | 2 | 3 | mean |
|---|---|---|---|---|
| time for disc to rise / s | 12 | 13 | 14 | 13 |
| boiled-enzyme control | did not rise within 120 s | | | |

Derived: mean = (12 + 13 + 14) ÷ 3 = 39 ÷ 3 = **13 s**. **1 / mean rise time = 1 ÷ 13 s = 0.0769 s⁻¹ = 0.077 s⁻¹ (2 s.f.)**, a relative rate proxy; not an initial rate; no progress curve exists for this method.

### Dataset 3 — amylase, timed iodine sampling by eye (Beats 10–12, 14)

Conditions: 5.0 cm³ amylase solution (one fixed concentration) and 5.0 cm³ starch suspension (1.0%), each in buffer solution, pH 7.0, equilibrated in separate tubes for 10 min at 30 °C, then the amylase poured into the starch (tube lifted in a test-tube holder); t = 0 when the first amylase reaches the starch, the stopwatch then running throughout, never reset; pour completed promptly, mixed consistently, tube returned to the bath; one drop of mixture into one equal drop of iodine solution per well, the start sample taken immediately after mixing (nominal 0 s), then every 30 s; each sample time is the stopwatch time at withdrawal. Test and control each have their own labelled dropper and rinse beaker; residual rinse water is expelled into a waste beaker before each draw, and no sampled liquid is returned to either reaction. Control (enzyme-free): 5.0 cm³ of the same enzyme-free buffer solution, pH 7.0, made up with water in place of amylase (same buffer, same volume, no enzyme) + 5.0 cm³ starch suspension (1.0%), poured, mixed, timed by its own stopwatch and sampled in the same way. Nominal starch concentration after mixing: 0.50% (not narrated).

| sample time / s | 0 | 30 | 60 | 90 | 120 | 150 | 180 |
|---|---|---|---|---|---|---|---|
| test well | blue-black | blue-black | blue-black | blue-black | blue-black | yellow-brown | yellow-brown |
| control well | blue-black | blue-black | blue-black | blue-black | blue-black | blue-black | blue-black |

Derived: **endpoint t = 150 s** (first sample no longer blue-black). Resolution one sampling interval: the change happened after the 120 s sample and by the 150 s sample, 120 s < t ≤ 150 s. **1/t = 1 ÷ 150 s = 0.00667 s⁻¹ = 0.0067 s⁻¹ (2 s.f.)**, a relative rate proxy. (Not narrated: the resolution alone puts 1/t between 1/150 = 0.0067 s⁻¹ and 1/120 = 0.0083 s⁻¹.) No substrate concentration, no substrate–time curve and no initial rate is derived from these swatches; the Beat 11 falling curve is a separate schematic.

### Dataset 4 — S23/34 Q1(c)(i–ii), the paper's values (Beat 8)

54 g read from the question paper's graph (QP p.8) at 0.16 mmol dm⁻³ lactase, over 10 minutes; ER p.33 gives 54 and 5.4 g min⁻¹. **Average rate = 54 g ÷ 10 min = 5.4 g min⁻¹.** The printed MS (p.7) figures are recorded in the plan and weights as erroneous and are never shown. What substance the 54 g is a mass of is not stated in the verified files and is not narrated (see *Citations*, UNVERIFIED 2). Beat 8 shows this single reading only as a **schematic reconstruction of the registered reading; original figure unavailable** (0.16 mmol dm⁻³ on the horizontal axis, 54 g on the vertical, guides to one point); the rest of the curve is not drawn.

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.20) | Beat(s) | How |
|---|---|---|
| investigate | 5, 6, 9, 10, 11, 12 | two designs demonstrated with named apparatus and physically possible handling; a transfer design; variables and control named. Demonstration does not count toward the learner's own practical time (syllabus p.51). |
| the progress of enzyme-catalysed reactions | 3, 7, 8, 11, 14 | rate vs amount; progress curve for a product; rate–time shape; schematic substrate curve |
| by measuring rates of formation of products using catalase | 4–9, 12, 14 | `CatalaseNet`; gas syringe from t = 0; volume of gas collected; initial rate by tangent; average rate; disc-rise transfer with 1/t |
| and rates of disappearance of substrate using amylase | 10, 11, 14 | `Hydrolyse` replay; iodine test; timed sampling by eye; endpoint and 1/t; schematic negative gradient |
| Mathematical requirements p.63 (gradient of a straight line; of a tangent to a curve) | 7, 12 | rise/run triangle on the tangent and on the straight section |
| Types of data p.61 (ordinal example with amylase and iodine) | not used | the iodine endpoint here is timed; "colourless" is neither used nor contradicted |
| Materials p.58 (plant sources of catalase; yeast, dried; amylase; hydrogen peroxide) | 1, 5, 10 | potato in the hook; yeast suspension as catalase source |

### Mark-scheme and examiner points → beats

| Source | Point | Beat |
|---|---|---|
| s22_33 Q1(a), MS p.6 | "oxygen is released (causing the discs to rise) ;"; three times, whole seconds, mean; "use boiled enzyme ;"; "contaminated with enzyme" / "use fresh hydrogen peroxide for each test" | 9, 15 |
| s21_33 Q1(b)(iii), MS p.5 | "mix solution Z with starch ; leave for a (stated) time ; test for starch / described ;" | 15 |
| Specimen 2022 P2 Q3(c), MS p.13 | "controlled variables ; take samples at timed intervals ; A regular intervals ; determine substrate or product concentration ; plot against time ; rate of disappearance / appearance ; determine initial rate ;" | 6, 7, 11, 12, 15 (the "determine substrate … concentration" point is not claimed for the by-eye iodine method; Beat 11 says so) |
| s23_12 Q14, key C | rate–time: highest at the start, falling | 8 (small type) |
| s23_34 Q1(c)(i–ii), QP p.8, ER p.33 | 54 g; average rate over 10 min 5.4 g min⁻¹ (printed MS not shown) | 8 |
| S23/51 Q1(d) (supplementary, Paper 5) | original reading: gas collected after one minute; our time series is an adaptation | 6, 8, 13 |
| June 2023 ER P51 Q1(d)(i) p.52; P52 Q1(d) p.55 | E42 | 13 |
| Specimen 2022 P1 Q13, key A | control: enzyme replaced by water | 12 (small type) |
| w20_21 Q2(b)(ii) | reading a progress curve (pH–time trace) | ledger only (a lipase/pH context; the reading skill is taught in Beats 7–8) |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, never, only, no, nothing, cannot, because, needs, must* (and the causal "since" and "so") was reread with one question: true of all cases, or of the case on screen?
- "when you cannot see a single molecule of it" (Beat 1): true of observation by eye; the point is that measurement is indirect.
- "one product is a gas" (Beat 1): "one product", not "the product". "how fast is what this topic keeps asking" (Beat 1): about the factor lessons that follow, not a claim about every Topic 3 outcome.
- "so its units carry a per time" (Beat 3): definitional for a rate of reaction as used here; "always" deliberately not used. "An enzyme changes how fast, so rate is what you measure": the syllabus's prior-knowledge statement (a catalyst increases the rate).
- "so the yeast stays evenly spread" (Beat 5): the reason for swirling a suspension; no claim of identical enzyme content. "so both reach that temperature": the purpose of the 10 min.
- "so the first gas is not lost" (Beat 6): about the start of collection only; no "no gas escapes". Round 1: "Tilt the flask by its neck so the small tube tips and the yeast spills into the peroxide, starting the timer as they first meet. That is time zero": the word *so* describes what the tilt does in this rig, not a claim about every nested-vessel design; the timer instruction names one event, first contact. "Then repeat with an enzyme-free control: the same buffer, no yeast": the operational control of this run (the same buffer solution, pH 7.0, in place of the yeast suspension); "no yeast" describes that tube only.
- "oxygen is the gas the reaction makes, but collecting a gas does not prove it is pure oxygen" (Beat 7): the plan's own point. "levels off just under twenty-four as the peroxide is used up": this run, which plateaus just under its 24 cm³ ceiling, not a general cause of every plateau. "the enzyme-free control stays at zero": this control's data. "the one you usually want is the initial rate": "usually". "The first thirty seconds really are straight": this dataset.
- "lower than the initial rate because the curve was already bending" (Beat 8): arithmetic of this dataset (chord below tangent).
- "since a used tube can hold enzyme" (Beat 9): "can"; the MS's "contaminated with enzyme". "One fixed endpoint gives one time, not a curve": about this method.
- "Pour the amylase into the starch, starting the timer as they first meet, then mix." (Beat 10, round 1): the checker's suggested wording; an instruction for this method, no absolute. On screen, the checker's verbatim instruction *it is never reset after pouring* is a procedural instruction for this run's clock.
- "Immediately after mixing, then every thirty seconds" (Beat 11, round 1): the start sample of this run, labelled *nominal 0 s* on screen, not an exact-zero reading. "Blue-black up to a hundred and twenty seconds" (Beat 11): this run. "Colours judged by eye give no concentration values, so no starch curve here and no initial gradient": the plan's R2-1 ruling, bounded to this method ("here"). "only a schematic": that curve's status in this lesson.
- "The control has the enzyme boiled, or replaced by water" (Beat 12): the two control forms the plan names; not a claim that no other control exists.
- E42 (Beat 13): "It can feel right, since the reaction does produce the gas": a possibility, not examiner testimony. "the syringe measures the gas that reaches it": what a syringe measures. "candidates often wrote": the report's own "often", not upgraded. "that report wants the quantity you actually read, a volume": the P52 ruling, bounded by "that report". "this is about naming a variable in those questions": the locality statement; "average rate … is still right" keeps the ruling from becoming a word ban.
- "Without active enzyme, the controls stay unchanged" (Beat 14): this lesson's two control runs.
- Beat 15: "credited"/"crediting" (not "needs" or "must") for every scheme point, in the past tense for the named practical paper ("A practical paper gave you…") so no paper is described as always doing so; "a specimen written paper"; the reject card is our wording contrast. (Round 1: the spoken amylase-test sentence is cut; its row stays on screen with the exact MS p.5 excerpt.) "the tangent at time zero puts a number on how fast": the method, not a potato value; the potato inset carries *same measurement method; potato rate not measured here* and the 0.40 label is attached to the illustrative yeast run.
- No sentence says the collected gas is pure oxygen, that every plateau means substrate is used up, that iodine turns "colourless", that 1/t is an initial rate, that a single reading is a rate, or that "average" and "amount" are banned words.

---

## Citations

Every quotation in this storyboard, where it appears, and the verified file it was copied from. Nothing is quoted from an exam PDF directly; none was opened.

| # | Quotation (verbatim) | Paper / session / question / page | Beat(s) | Copied from |
|---|---|---|---|---|
| 1 | "investigate the progress of enzyme-catalysed reactions by measuring rates of formation of products using catalase and rates of disappearance of substrate using amylase" | Syllabus 2025–2027, 3.1.3, p.20 | header | `SYLLABUS-9700-DETAIL.md` |
| 2 | "calculate the rate of change from the gradient of a straight line on a graph"; "calculate the rate of change from the gradient of a tangent to a curved line on a graph" | Syllabus p.63 | spine; 7 (small type) | `SYLLABUS-9700-DETAIL.md` (also in `TOPIC-03-WEIGHTS.md`) |
| 3 | "plant sources of catalase, e.g. sweet potatoes, mung beans, potatoes" (paraphrased in small type as "potatoes are among the plant sources of catalase listed on syllabus p.58") | Syllabus p.58 | 1 (paraphrase, no quotation marks on screen) | `SYLLABUS-9700-DETAIL.md` |
| 4 | "oxygen is released (causing the discs to rise) ;" | s22_33 Q1(a), MS p.6 | spine; 9 | `TOPIC-PLAN-03-ENZYMES.md` §3.1.3; `TOPIC-03-WEIGHTS.md` ledger |
| 5 | "records three times for each pH ;", "records a mean time for each pH ;", "results recorded as whole seconds ;", "use boiled enzyme ;", "contaminated with enzyme" / "use fresh hydrogen peroxide for each test" | s22_33 Q1(a), MS p.6 | spine; 9; 15 | `TOPIC-PLAN-03-ENZYMES.md` §3.1.3 |
| 6 | "mix solution Z with starch ; leave for a (stated) time ; test for starch / described ;" | s21_33 Q1(b)(iii), MS p.5 | spine; 15 | `TOPIC-03-WEIGHTS.md` ledger |
| 7 | "controlled variables ; take samples at timed intervals ; A regular intervals ; determine substrate or product concentration ; plot against time ; rate of disappearance / appearance ; determine initial rate ;" | Specimen 2022 Paper 2 Q3(c), MS p.13 | spine; ledger; 15 (excerpts) | `TOPIC-03-WEIGHTS.md` supplementary S-A (plan §3.1.3 quotes the "take samples at timed intervals ; A regular intervals" … "determine initial rate ;" excerpt) |
| 8 | "(d) (i) Candidates often referred to gas being produced rather than collected and therefore did not gain credit for the dependent variable." | June 2023 ER, Paper 51 Q1(d)(i), p.52 | 13 | `TOPIC-PLAN-03-ENZYMES.md` E42; `TOPIC-03-WEIGHTS.md` E42 |
| 9 | "'Average' is not acceptable for 'mean' and 'amount' is not acceptable for 'volume.'" | June 2023 ER, Paper 52 Q1(d), p.55 | 13 | `TOPIC-PLAN-03-ENZYMES.md` E42; `TOPIC-03-WEIGHTS.md` E42 |

Values and keys cited without quotation marks: s23_34 Q1(c)(i–ii) 54 g and 5.4 g min⁻¹ (QP p.8 graph; ER p.33; plan and weights; printed MS p.7 values recorded as erroneous and not shown); s23_12 Q14 key C (MS p.2; ledger description); specimen 2022 Paper 1 Q13 key A (MS p.2; weights S-B); S23/51 Q1(d) original reading "gas collected after one minute" (plan §3.1.3, described, not quoted as paper wording).

**UNVERIFIED items** (not quoted; shown only as our framing or omitted):
1. `UNVERIFIED — the exact wording of specimen 2022 Paper 2 Q3(c)'s instruction.` Beat 15 row 3 shows *outline how progress is investigated* labelled **our framing**; the weights' phrase "outline how the progress is investigated" is the weights' description, not confirmed as the paper's words.
2. `UNVERIFIED — what the 54 g in s23_34 Q1(c)(i) is a mass of, and the ER p.33 sentence wording.` Only the numbers 54 g, 10 min, 5.4 g min⁻¹ and the 0.16 mmol dm⁻³ lactase concentration are shown, the reading as a *schematic reconstruction of the registered reading; original figure unavailable* (Beat 8); the narration says "a mass". The plan asks for the ER to be quoted; the verified register holds its numbers but not its sentence, so no ER sentence is quoted, and the printed MS figures are never shown.
3. `UNVERIFIED — the wording of June 2023 Paper 51 Q1(d)(i).` Beat 13's header is labelled **our framing**; "a planning question asked for the dependent variable in a gas-collection experiment" is our description, supported by the ER sentence (which names the dependent variable and gas collection) and the plan's "gas collected after one minute".
4. `UNVERIFIED — the question context and wording of June 2023 Paper 52 Q1(d).` Not shown; only the ER ruling is quoted, and the card is labelled a composite of two questions.
5. `UNVERIFIED — the wording of s21_33 Q1(b)(iii).` Beat 15 row 2 is labelled **our framing**; "protein Z" and "whether … is amylase" come from the weights' ledger description.
6. `UNVERIFIED — the stem and figures of s23_12 Q14 and the S22/33 Q1(a) method text.` Neither is reproduced; both are described from the ledger, and the S22/33 enzyme source is not asserted.

---

## Word count and runtime

Counted by the validator over the blockquoted narration, silent-read line excluded; seconds = words ÷ 120 × 60.

| Beat | Title | Words | Seconds |
|---|---|---:|---:|
| 1 | Hook and context | 87 | 43.5 |
| 2 | What you will be able to do | 48 | 24.0 |
| 3 | A rate, not an amount | 70 | 35.0 |
| 4 | The catalase reaction, atom by atom | 85 | 42.5 |
| 5 | The rig, named where it sits | 88 | 44.0 |
| 6 | Closed first, then mix: time zero | 107 | 53.5 |
| 7 | The progress curve, and the initial rate | 138 | 69.0 |
| 8 | An amount, an average rate, and a rate that falls | 89 | 44.5 |
| 9 | Transfer: the rising disc | 102 | 51.0 |
| 10 | Amylase: following starch as it disappears | 91 | 45.5 |
| 11 | Sampling by eye: an endpoint and 1/t | 110 | 55.0 |
| 12 | Variables, the control, and the sentence you write | 84 | 42.0 |
| 13 | COMMON MISTAKE E42: produced, average, amount | 146 | 73.0 |
| 14 | What I told you, on the rig and the graph | 85 | 42.5 |
| 15 | How it is asked, the reject card, and the potato | 88 | 44.0 |
| **Total** | 15 beats (14 teaching + 1 error) | **1418** | **709.0** (11:49) |


**Length, honestly (after check round 1):** **1,418 words = 11:49** at 120 words per minute, **1:34 over** the 10:15 budget. The fourteen teaching beats total **1,272 words = 10:36**, **1:06 over** the 9:30 (1,140-word) teaching base; E42 is unchanged at **146 words = 73 s**, inside the five-move 130–150-word range and **28 s over** its 45 s talk-through allowance, protected in full. The prescribed 4 s silent read is not added again. Round-1 changes: the checker's cut 1 taken (Beat 15's spoken amylase-test sentence, −23 words; its exam-form row stays on screen); the practical repairs added words in three places: the start of each reaction is now spoken as the moment the reactants first meet (Beat 6 +4, Beat 10 +6); the gas control is now spoken as an enzyme-free control of the same buffer (Beat 6 +2; Beat 7 unchanged in length); and the first amylase sample is named as taken immediately after mixing (Beat 11 +1). Net −10 words. The checker accepted the remaining teaching overrun (59.5 s after cut 1, before these repairs; 66 s after them): apparatus, two measurement methods, the tangent/interval/proxy distinctions and the recap each have a distinct job, and no split, faster narration or thinner E42 is warranted. The checker kept "like the disc's" (Beat 11) and the Beat 1 question; the author's earlier cuts (2), (3) and (5) were already taken in the conductor's review and are not counted again. No further cut list is offered.

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| Colorimeter; absorbance; turning a colour change into concentration values | 3.1.4 (Beat 11 points to it only by "no concentration values") |
| Effects of temperature and pH; separate equilibration at several temperatures; five-pH disc series | 3.2.1 |
| Enzyme, substrate and inhibitor concentration; peroxide dilution series; amylase dilution series; E38–E40 (including the Learner Guide annotation on "'timed' or 'regular' intervals", E40) | 3.2.1b |
| Vmax, Km; the still-rising last point | 3.2.2-3 |
| Free vs immobilised amylase | 3.2.4 |
| Catalase's catalytic mechanism, compound intermediates, radicals | not in the outcome (the `CatalaseNet` caption says net reaction) |
| Why a yeast suspension's collected gas may include other gases (e.g. from the yeast's own metabolism) | not narrated; the axis label and small type carry the point without adding content |
| Standard deviation, error bars, statistical tests | A Level mathematical requirements; not in this outcome |
| The syllabus p.61 ordinal example ("colourless") | not used; iodine's own yellow-brown is shown |

## Reusable models

| Model | Specified | For |
|---|---|---|
| **`RateGraph`** (`progress-product` with `tangent-t0`, `chord`, `reading`; `rate-time`; `progress-substrate-schematic`; factor configurations' axis labels) | here | 3.1.4 (adds `absorbance-time`, `calibration`), 3.2.1, 3.2.1b, 3.2.2-3, 3.2.4 |
| **`GasSyringeRig`** (`open`, `sealed`, three-way tap (vent during bung seating; baseline 0 cm³ then collect), `tilt` with the stopwatch starting on the first-contact frame and the inner tube draining at about 120°, `collecting`, `control` with buffer-matched enzyme-free vehicle; Dataset 1 as the 30 °C / 0.20 mol dm⁻³ reference run, initial rate 0.40 cm³ s⁻¹) | here | 3.2.1 (temperature), 3.2.1b (peroxide concentration) |
| **`WaterBathRig`** (`maintained`, `equilibrating`) and **`BufferedTubeRig`** (`stock-swirl`, `tube-in-rack`, `pour`) | here (basic states) | 3.2.1 extends; 3.2.1b, 3.2.4 |
| **`CatalaseDiscRig`** (`soak` with the preparation mixed first, `release` timed from release after the same brief descent for every disc, `rising`, `surface`, `fresh`, `boiled-control`; 12, 13, 14 s → 13 s → 0.077 s⁻¹ at pH 7.0) | here | 3.2.1 (pH) |
| **`AmylaseIodineSampler`** (tile, two rows, one-frame two-colour switch; test and control tubes each with their own stopwatch, dropper and rinse beaker; sample time recorded at withdrawal; endpoint 150 s → 0.0067 s⁻¹) | here | 3.2.1b (amylase concentration), 3.2.4 |
| **`CatalaseNet`** (edge list, valence audit, caption) | here | 3.2.1, 3.2.1b by reference only |
| **`Hydrolyse`** amylase replay | 2.2.6, by reference (specified here for Topic 3) | 3.2.1b, 3.2.4 by reference only |
| `EnzymeActiveSiteModel` | 3.1.1-2 | used here: `rest-lk`, `bound`, `products` only |

---

## Assets

| Asset | Status | Source |
|---|---|---|
| `RateGraph` component with configurations and overlays | **new build** | authored |
| `GasSyringeRig`, `WaterBathRig`, `BufferedTubeRig`, `CatalaseDiscRig`, `AmylaseIodineSampler` SVGs with named states; hands (neck grip, bottle swirl, tube pour in a test-tube holder, dropper squeeze); weighted ring; droppers A and B, rinse beakers A and B, waste beaker; second stopwatch | **new build** | authored; handling specified; rendered still-frame verification pending (pours 120°, inner-tube drain at about 120°, droppers above wells, bung seated before tilt, level surfaces) |
| `CatalaseNet` inset (two H₂O₂ → two H₂O + O₂, atom labels) | **new build** | authored; valence audit per rendered state |
| Four-glucose segment + `WaterModel` + `Hydrolyse` exchange | reuse | `topic-02/2.2.5`, `2.2.6` via 3.1.1-2 |
| `EnzymeActiveSiteModel` (`rest-lk`, `bound`, `products`) | reuse | 3.1.1-2 |
| Potato slice, dropper, bubbles (hook) | new, schematic vector | authored; no photograph, no generated image |
| E42 composite card; S23/34 schematic reconstruction panel; objectives pictograms (gas bubbles, iodine drop, clock, clock-and-tag); safety tags and eye-protection pictogram; forms surface; reject card; COMMON MISTAKE panel | new card content; shared panel and surfaces | authored; panel from Topics 1–2 |
| Micrographs, photographs, Cambridge artwork | none | — |

---

## Validator run

`python3 work/005/validate_storyboard.py storyboards/topic-03/3.1.3/STORYBOARD.md`

```
beat  words  cues maxgap  status
   1     87     8     21  ok
   2     48     3     17  ok
   3     70     8     16  ok
   4     85    10     20  ok
   5     88    12     13  ok
   6    107    13     14  ok
   7    138    15     18  ok
   8     89    12     16  ok
   9    102    12     11  ok
  10     91    13     19  ok
  11    110    13     16  ok
  12     84     9     18  ok
  13    146    15     19  ok
  14     85    10     15  ok
  15     88     9     21  ok
TOTAL words 1418  cues 162  runtime at 120 wpm 11:49.0  beats 15  failing beats 0
```

---

## Conductor review (cloud run 005)

Review against the cleared 3.1.1-2 and 3.2.2-3 storyboards and their CHECK reports, and for consistency across the five lessons. Changes made after the author's draft:

- **Beat 4 (chemistry):** the narration no longer states which atoms end up where ("In each peroxide molecule, the oxygen–oxygen bond breaks … The other two oxygens end up joined …"). The `CatalaseNet` edge list is kept exactly as the plan specifies, but it is net-reaction bookkeeping, and narrating it as the enzyme's pathway would assert a mechanism (for real catalase, isotope-labelling work shows the O₂ comes from a single peroxide molecule). New words: "The inset shows the net change, as bookkeeping, not as the way the enzyme does it. Two peroxide molecules go in; in one step on screen their atoms are regrouped as two molecules of water and one molecule of oxygen, its two atoms held by a double bond." Cues remapped; a small-type line *atom labels are bookkeeping for the net change; no pathway is shown or implied* added. The one-frame switch, caption and valence audit are unchanged.
- **Beat 1:** "faster when warmer, with more enzyme?" → "does warming it, or adding more enzyme, change the speed?" (above an optimum, warming slows the rate). Cues remapped.
- **Cuts taken:** the author's cuts (2) Beat 14, (3) Beat 11 "rinsing the dropper between samples" (the rinse stays on screen), and (5) Beat 8 "the reading a June 2023 planning question used" (its small type moves to the cue *the volume of gas collected after one minute*). Cut (1), the only amylase exam form, and cut (4), the hook, are not taken.
- The absolutes-sweep lines above quote the author's draft wording where these edits changed it; the narration is authoritative.

## CHECK RESPONSE (round 1)

Response to `work/005/checks-round-1/3.1.3-CHECK.md` (verdict NOT CLEARED) and the cross-cutting fixes in `work/005/checks-round-1/README.md`, plus the conductor's alignment note after the 3.2.1 round-1 fixes. Text only; E42 (Beat 13) untouched. The narration changed only in Beats 6, 7, 10, 11 and 15. Strings in double quotation marks in this table are this storyboard's own old or new wording, or the checker's replacement text; none is external evidence.

| Item | Status | What changed (new words quoted) |
|---|---|---|
| **M1a** Gas rig: one atomic start event | applied | `GasSyringeRig` `tilt` rewritten as "one atomic start event": "On the rendered frame on which the first yeast suspension touches the peroxide, the stopwatch starts and collection begins; that frame is t = 0. Any later time-zero tag or cue highlights the already-running stopwatch; it is never reset." Beat 6 narration: "Tilt the flask by its neck: the small tube tips and the yeast spills into the peroxide. That tilt is time zero: start the timer, stand the flask back…" → "Tilt the flask by its neck so the small tube tips and the yeast spills into the peroxide, starting the timer as they first meet. That is time zero: stand the flask back…". Cues remapped: new *as they first meet* (rings the contact point; stopwatch already running) and *That is time zero* (tag on the start mark; "it is not reset"). Bung seated beforehand, unchanged. The control uses "exactly the same sequence" (model `control` state; Beat 6 action 8). |
| **M1b** Inner-tube geometry, toppling path, weighted ring | applied with interpretation | Model spec: flask now 250 cm³ (base about 85 mm) so a 5.0 cm³ tube has clearance; small tube "about 45 mm long, 18 mm outside diameter", "offset about 15 mm from the centre toward the side that will rise"; flask tilted to "about 30° from upright" (was 60°); "Toppling path of the small tube: as the flask passes about 20°, the small tube pivots on its downhill base edge, swings downhill and comes to lie along the flask base with its mouth toward the low heel (about 4 mm clear of the low wall), its axis at about 120° from upright (within 110–130°), mouth below base"; "a stream leaves the rotated lip… visibly emptying". Ring: "slipped over the neck before the bung goes in and rests on the flask's sloping shoulders… at the tilt used here (about 30°) its weight keeps it seated"; hand "above the ring". Beats 5 and 6 visuals updated to match. *Interpretation:* the flask capacity and tilt angle were changed because a 5.0 cm³ tube cannot lie mouth-down inside a 100 cm³ flask's base; dimensions are authored geometry for the builder. |
| **M1c** Amylase start | applied | Beat 10 action 7: "the stopwatch starts as the pour ends" replaced by the checker's text verbatim: "The stopwatch starts when the first amylase reaches the starch. Complete the pour promptly, mix consistently, and return the reaction tube to the bath. The clock continues throughout; it is never reset after pouring." Narration: "…at thirty degrees; pour one into the other and start the timer." → "…at thirty degrees. Pour the amylase into the starch, starting the timer as they first meet, then mix." Cues remapped: *Pour the amylase into the starch*, *as they first meet*, *then mix*. |
| **M1d** First sample and sample-time label | applied | Beat 11 narration "At once, then every thirty seconds" → "Immediately after mixing, then every thirty seconds" (new cue *Immediately after mixing*). Visual: "the stopwatch reads 0 s" removed; now "stopwatch A keeps running (it reads a few seconds; it is not frozen at 0)", column 0 tag *start sample: taken immediately after mixing (nominal 0 s)*, small type *each sample is recorded at its time of withdrawal*; dropper "moves promptly" to the well. Tile heading *sample time (at withdrawal) / s*. 30 s schedule and illustrative 150 s endpoint unchanged. Consequence: the tile is now set out and filled with iodine during equilibration, before any pour (Beat 10 action 6; action 8 rings the drops, tag *filled before mixing*). |
| **M2a** Control tube shown; separate sampling | applied | `AmylaseIodineSampler` rewritten: tube A test and tube B control, "each with its own stopwatch and its own sampling equipment", **dropper A / rinse beaker A**, **dropper B / rinse beaker B**, shared **waste beaker**; "a dropper is never used on the other row"; residual rinse water "squeezed fully empty into the waste beaker… before its next draw"; leftover mixture "squeezed into the waste beaker, never back into either reaction tube". Above-well delivery, no iodine contact kept. Beat 10 action 6 shows and labels the control pair; action 7 pours pair B the same way with stopwatch B; Beat 11 actions 1–2 use droppers A and B. Dataset 3 conditions updated. |
| **M2b** Buffer-matched enzyme-free controls | applied (aligned with 3.2.1) | Gas: "5.0 cm³ of the same enzyme-free buffer solution, pH 7.0 (the buffer vehicle made up with water in place of the yeast)", label *enzyme-free control: 5.0 cm³ of the same buffer solution, pH 7.0, no yeast* (model, Beat 6 action 8, Beat 7 action 4, Dataset 1). Beat 6 narration "Then repeat with water in place of the yeast." → "Then repeat with an enzyme-free control: the same buffer, no yeast." Beat 7 "the water run stays at zero" → "the enzyme-free control stays at zero". Amylase: "5.0 cm³ of the same enzyme-free buffer solution, pH 7.0, made up with water in place of amylase", row B *enzyme-free control: same buffer solution, no amylase*. Cited wording kept unchanged (Beat 12 "The control has the enzyme boiled, or replaced by water"; small type *specimen 2022 Paper 1 Q13, key A: enzyme replaced by water*), with a separate line *our operational control: the same buffer solution made up with water in place of the enzyme*. |
| **M2c** Amylase volumes, pipettes, forceps, disc mixing | applied | Beat 10 action 6: "**5.0 cm³ amylase solution** … and **5.0 cm³ starch suspension, 1.0%**", each measured with a labelled **5 cm³ graduated pipette**. Beat 5: labels **10 cm³ measuring cylinder**, **long forceps**, **5 cm³ graduated pipette**. Disc: `soak` now "the catalase preparation is first swirled to mix it, tag *mixed before each disc is soaked*" (Beat 9 action 2); forceps labelled; tags *same disc size*, *same release position*, *same depth of peroxide each time*; fresh peroxide unchanged. |
| **M2d** Reagent handling | applied | Attached tags *hydrogen peroxide: irritant; avoid skin and eye contact* and an eye-protection pictogram in the peroxide preparation frames (Beat 5 action 4; disc `fresh`, Beat 9 action 6); *iodine solution: avoid skin and eye contact* plus the pictogram when the tile is filled (Beat 10 action 6). The amylase tube is lifted "in a labelled **test-tube holder**" (`BufferedTubeRig` `pour`; Beat 10 action 7). No safety lecture; no narration added. |
| **M3** Text-only frames | applied | Beat 1 action 1: "From the first frame, a raw potato slice on a white tile, a dropper held above it and a stopwatch at rest beside it are on screen (no labels yet)"; the hook question is "a compact caption above the slice". Beat 2: "not the lesson diagram: each line enters with motion beside a simple authored pictogram", gas-bubbles + iodine-drop, clock, clock-and-tag. Beat 3 action 1: "From the beat's first frame, a small gas-collecting cylinder icon and a clock face stand at left"; the working builds beside them. Beat 15 action 1: forms surface "beside the familiar lesson layout, which stays on screen from the beat's first frame". E42 unchanged. |
| **M4** Keep 0.40 on the yeast run | applied | Beat 15 action 5: potato inset captioned **same measurement method; potato rate not measured here**, "no number on the potato inset"; the triangle flashes "on the yeast run's progress graph, its label attached to that graph: **illustrative yeast run: initial rate = 0.40 cm³ s⁻¹**". Narration stays qualitative. |
| **M5** S23/34 graph reading | applied | Beat 8 action 6: the "54 g in 10 min" card becomes a panel captioned **schematic reconstruction of the registered reading; original figure unavailable**; horizontal **lactase concentration / mmol dm⁻³** (only **0.16** marked), vertical **mass / g** (only **54**; no substance named), guides to one point, no curve; working **54 ÷ 10 = 5.4 g min⁻¹, average over 10 min**; provenance *June 2023 9700/34 Q1(c)(i–ii), QP p.8; ER p.33 (verified-register provenance; the original graph was not inspected)*. UNVERIFIED 2 now also records that the plan's request to quote the ER cannot be met from the register. Dataset 4 note added. |
| **Assets claim** | applied | "handling checked on still frames" → "handling specified; rendered still-frame verification pending". The model spec's "Handling (checked on a still frame)" → "Handling (specified here; rendered still-frame verification pending)". |
| **Ceiling assumption** (audit) | applied | Dataset 1: "assuming the gas in the syringe, which sits outside the 30 °C bath, is at room temperature and pressure (the supplied approximation 24 dm³ mol⁻¹)… This is an approximate oxygen-yield check for this run, not a universal bound for any gas mixture at any temperature or pressure." |
| **Straight 0–30 s segment** (audit) | applied | Beat 7 action 3: line of best fit "straight from 0 to 30 s and smooth after". |
| **No invented replicates** (audit) | applied | `RateGraph`: "the plotted points are single-run readings, not means; no replicate runs are invented"; Dataset 1 "Readings are from a single run (no replicates)". |
| **Cut 1** Beat 15 amylase-test sentence | taken | Removed (23 words): "Another asked how to find out whether a protein is amylase: mix it with starch, leave it a stated time, test for starch." Row 2 and its exact MS p.5 excerpt now revealed with the forms surface at *How this reaches you*; its cues *whether a protein is amylase* and *leave it a stated time* removed. |
| **Cut 2, Cut 5** | not counted again | Already taken in the conductor's review. |
| **Cut 3** "like the disc's" | kept | As ruled. The rinse stays visual, repaired under M2a. |
| **Cut 4** Beat 1 question | kept | As ruled. |
| **Length** | applied | Ledger, totals, beat windows, "Length, honestly" paragraph rewritten: **1,418 words = 11:49**; teaching **1,272 = 10:36**; E42 146 words. The old cut list is removed. |
| **Cross-cutting 1** (timer at first contact) | applied | Gas rig and amylase as above; gas and amylase controls follow the same sequence. Disc: see alignment (3). |
| **Cross-cutting 2** (no text-only frames) | applied | M3; other beats already keep a model or apparatus on screen. |
| **Cross-cutting 3** (set or assumed values) | applied | Gas 0 s point: open circle, *0 s: set before mixing, not a timed reading* (Beat 7 action 3; `RateGraph`); results table 0 s row "**0.0 (set before mixing)**" (Beat 6 actions 6 and 8); Dataset 1 note. Amylase start sample: *nominal 0 s*. S23/34: *schematic reconstruction*. |
| **Alignment (1)** 3.2.1 three-way tap | applied | New part **three-way tap** (vent / collect); `sealed`: tap at vent while the bung is seated, then "the plunger is set to 0 cm³ and the tap turned to collect; tag *baseline 0 cm³ set after equilibration; collection path gas-tight*". Beat 6 actions 2–3. The bung is seated **after** the 10 min equilibration here, as the Beat 6 narration already says ("While the reactants are still apart, seat a bung…"). |
| **Alignment (2)** gas control wording | applied | See M2b ("enzyme-free control" in narration). |
| **Alignment (3)** disc timing | applied with interpretation | `release`: "the stopwatch starts at release, by the method's definition of the rise time", after "the same brief ~1 s descent every time"; Beat 9 action 3 tag *timed from release, by the method's definition; same brief descent for every disc*. This keeps the original release start rather than the first-contact start the cross-cutting rule would otherwise give. |
| **Absolutes sweep** | done | Every touched sentence reread. New sweep lines for Beats 6, 10, 11 and 15; the Beat 7 control line and the stale Beat 15 "Another asked…" line updated. |
| **Quotations** | checked | `check_quotes.py`: every quotation of external evidence found (quotes checked 158, not found 93). Of the unmatched strings, 41 are in the body (our narration quoted in the sweep, the conductor review's cut and replaced wording, the p.58 paraphrase) and 52 are this table's own old/new wording and the checker's text. No new external quotation added. |
| **Validator** | done | `TOTAL words 1418  cues 162  runtime at 120 wpm 11:49.0  beats 15  failing beats 0` |
