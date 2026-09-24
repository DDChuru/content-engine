# 3.2.1b — Availability and competition: enzyme, substrate and inhibitor concentration

**Storyboard, first draft. Cloud run 005, 24 September 2026.** No audio, no code, no render. Folder `storyboards/topic-03/3.2.1b/`. The second of two linked lessons on outcome 3.2.1; it stands alone (own hook, a labelled recall of 3.2.1, own objectives, recap and exam close).
Cambridge 9700 syllabus 2025–2027, p.20. Command words **INVESTIGATE and EXPLAIN**. Budget from `TOPIC-PLAN-03-ENZYMES.md` (lesson list and standalone-halves paragraph) and `TOPIC-03-WEIGHTS.md` (3.2.1 row, 15:45 combined): **3.2.1b 8:45 = teaching base 6:30 (~780 words) + 3 × 0:45 error allowance; 10 teaching beats + 3 error beats (E38, E39, E40)**; delivered here as **13 beats** (10 teaching + 3 error). 3.2.1 as a whole: 7 of 15 sampled papers, 25 overlapping marks. Runtime estimated at **120 words per minute of final video**.

> **3.2.1** investigate and explain the effects of the following factors on the rate of enzyme-catalysed reactions:
>
> - temperature
> - pH (using buffer solutions)
> - enzyme concentration
> - substrate concentration
> - inhibitor concentration

(syllabus p.20; this lesson owns the last three bullets; temperature and pH are 3.2.1's and are recalled by label only.)

**Authorities read:** `work/005/SHARED-SPECS.md` (in full); `VIDEO-STRUCTURE.md` (in full: full shape, five-move error beat, "written, never spoken", badge-truth rule, weave the errors, say the typical thing as typical, animate the mechanism, handling physically possible, colour-change rule, narration register); `CONTENT-ARCHITECTURE.md`; `SYLLABUS-9700-DETAIL.md` §3 (3.2.1 verbatim, p.20); `TOPIC-PLAN-03-ENZYMES.md` §3.2.1 in full (what we teach for the three concentrations, investigation map, exact mark-scheme keys, E38–E40, lesson list, standalone-halves paragraph, shared models, traps, R2 response incl. R2-1 and R2-3); `TOPIC-03-WEIGHTS.md` (E38–E40 register; ledger rows s21_22 Q5(c) and Q5(d)(i), s23_34 Q1(c)(iii); supplementary S-A, S-B, S-E, S-I; mathematical requirements); `EXAMINER-INSIGHT-9700.md` (§5 LG p.19 row); `GATE-CRITERIA-9700-03-ENZYMES.md`; `COMPLEXITY-CALIBRATION-9700-BIOLOGY.md` §3 (DO-NOT-ADD); `PASTPAPERS-INVENTORY.md`; the cleared `3.1.1-2/STORYBOARD.md` and `3.2.2-3/STORYBOARD.md` with their `CHECK.md` and `CHECK-R2.md`; the sibling storyboards `3.1.3`, `3.1.4` and `3.2.1` (for the shared rigs, the ONPG volumes, the 30 °C worked tangent and what 3.2.1 lets this lesson recall). No question paper or mark scheme PDF was opened for this draft; every quotation is copied from the three verified files named in SHARED-SPECS §3.

**Build position:** fifth of the seven enzyme lessons (3.1.1-2 → 3.1.3 → 3.1.4 → 3.2.1 → **3.2.1b** → 3.2.2-3 → 3.2.4). 3.2.2-3's Vmax/Km construction sits on this lesson's substrate-concentration curve.

**Models used:** `EnzymeActiveSiteModel` (3.1.1-2; states `rest-lk`, `bound`, `products`; the `denatured` motion as specified by 3.2.1, recall only); `RateGraph` (3.1.3; configurations `progress-product` + `tangent-t0`, and 3.1.4's `absorbance-time` + `straight-initial`); `GasSyringeRig`, `WaterBathRig`, `BufferedTubeRig`, `AmylaseIodineSampler` (3.1.3; 3.2.1's `equilibrate-separate` state); `ColorimeterModel` + ONPG assay (3.1.4). **Published here:** three `RateGraph` factor configurations (`amylase-concentration`, `rate-substrate`, `inhibitor-concentration`); three population views of `EnzymeActiveSiteModel` (`pop-enzyme`, `pop-substrate`, `pop-inhibitor`) built only from existing states; the generic terracotta inhibitor token (no binding site claimed); the three datasets. Everything drawn is a **MODEL**; enzyme drawings carry *schematic; not a real protein shape*; invented numbers carry *our illustrative data*.

---

## The causal spine

One sentence, recalled from 3.2.1 and applied three times:

> **The rate depends on how often substrate molecules meet a working active site and form enzyme–substrate complexes per unit time, and on whether the active sites stay functional.**

Temperature and pH are held fixed, so the second clause holds steady; the three amounts change the first clause. **More enzyme:** more active sites available, more successful collisions, more enzyme–substrate complexes per unit time; while substrate is in excess the rate rises in proportion to enzyme concentration (measured here by 1/mean endpoint time, a relative rate proxy, not an initial rate). **More substrate:** substrate molecules meet free active sites more often, so more complexes per unit time; as the active sites become saturated the initial rate levels off; substrate concentration is limiting at first, enzyme concentration at the plateau; **at the plateau complexes still form and break at the maximum rate**. The x-axis of that graph is concentration, not time. **More inhibitor:** at any moment more enzyme molecules have the inhibitor bound, so fewer active sites are available or working, fewer complexes form per unit time, and the initial rate of change of absorbance falls. How an inhibitor binds is 3.2.2-3's.

**What the mark schemes credit, quoted:** [S23/34 Q1(c)(iii), MS p.7] "more enzyme molecules so more active sites available ; more successful collisions ; more enzyme-substrate complexes form ;". [S23/31 Q1(b)(i), MS p.7] "20 mmol dm–3 and 40 mmol dm–3: lactose concentration increases so more enzyme substrate complexes ; 60 mmol dm-3 and 140 mmol dm–3: all active sites are saturated, so maximum rate of reaction is reached ;". [S21/22 Q5(c), MS p.17] "I 'rate of reaction is fast and then slows down' needs ref. to rate of reaction, describing 'gradient of curve' is not enough"; the remaining points of that scheme are recorded in the weights only as a summary (a description mark plus two from collisions/ES complexes, active sites available at low concentration, saturated at high concentration, a named limiting factor qualified) and are shown as our paraphrase, never in quotation marks. [S21/22 Q5(d)(i), MS p.18] "more enzyme-substrate complexes per unit time" with "I more ESC form needs idea of increased rate". [Specimen P2 Q3(c), MS p.13] "take samples at timed intervals ; A regular intervals". [Specimen P1 Q13, key A] the control for an enzyme-concentration experiment: enzyme replaced by water (weights S-B; no stem wording quoted). So the spine is what is credited: active sites available, successful collisions, complexes (with a time basis), saturation reaching the maximum rate, a described trend that refers to rate, timed sampling, and the water control.

**The handle:** *busy tills.* When every till in a shop is busy, a longer queue gets nobody through faster, yet every till is still serving. Converted at once, in the same beat: *at the plateau the active sites are saturated; enzyme–substrate complexes still form and break at the maximum rate, and enzyme concentration is the limiting factor.* The handle is never the exam answer; it returns in E39 to repair "full" being read as "finished".

**Typicality rules applied:** "while substrate is in excess" bounds the proportionality (the plan's wording); our amylase points are said to lie "close to" a line through the origin, and 1/t "roughly" doubles. The plateau is described as "levels off"; the highest plotted point is not called Vmax (3.2.2-3 owns Vmax and its S23/51 still-rising rule). *Nearly every active site is occupied at any moment* (not every one, every instant); the MS's own "all active sites are saturated" is used only inside the S23/31 correction. *About the same starch* by each endpoint (same starting starch, same endpoint criterion). The S21/22 Q5(d)(i) ruling is stated as a ruling in that question (explaining a higher maximum rate), with S23/34's shorter credited wording shown beside it. The Learner Guide annotation is stated as one marking point in one annotated example, which still scored full marks through other points. X is the paper's label; no identity or inhibition class is inferred; where X binds is not drawn. Reasons students err are phrased as possibilities ("can feel like", "can sound like", *it is easy to*).

**Three error beats, each with the five moves** (announce → written card → 3–4 s silent read → cue-synced talk-through → correct in place), woven where each belongs: **E40 in Beat 6** (after the amylase method and explanation), **E38 in Beat 8** (after the substrate-concentration curve is described), **E39 in Beat 10** (after it is explained). E40 and E39 each carry two faults; the marker clears only on the completed correct frame. Wrong answers are written, never spoken as claims; a wrong word is named only as the word under discussion. Badges: all three **COMMON MISTAKE**, basis stated on each panel (E38: MS ignore line; E39: examiner report; E40: MS ignore line and an examiner-annotated response).

---

## The models, specified once

**`EnzymeActiveSiteModel` (3.1.1-2; reused by state id).** `rest-lk`, `bound`, `products` with 3.1.1-2's motion contract (substrate travels into the cleft ~0.8 s; products drift out). Caption *schematic; not a real protein shape* whenever the model is the main subject. **`denatured`** replays 3.2.1's motion by reference in Beat 2 only (dashed and dotted R-group links vanish one by one; silhouette loosens; cleft distorts; backbone continuous, tag **peptide bonds intact**; a substrate rocks and fails to seat; caption **denatured**). `ph-shifted` is not used.

**Population views (published here; existing states only, miniatures at ~0.3 scale):**
- **`pop-enzyme`**: two boxes of equal size, each labelled *same volume (schematic)*, each crowded with substrate outlines (tag *substrate in excess*); left box 2 enzyme miniatures, right box 4. Seating events (substrate → `bound` → `products`) run as motion. Each box has a tally *complexes per second (illustrative)*; the right tally climbs about twice as fast. No numbers are printed on the tallies.
- **`pop-substrate`**: one box, *six enzyme molecules, fixed volume (schematic)*; substrate outlines are added in three steps (few → more → crowded). In the crowded state nearly every cleft is occupied at any moment; as each product pair leaves, a new substrate seats almost at once (motion loop), tag *still reacting*; the tally holds steady at its highest rate.
- **`pop-inhibitor`**: one box, six enzyme miniatures, substrate plentiful; **inhibitor X token**: a small terracotta disc (the tint 3.2.2-3 uses for inhibitors, but neither of 3.2.2-3's two inhibitor shapes) docks onto the outer rim of a miniature beside a small bracket labelled **X bound**; the docking point is deliberately generic and caption *where X binds is not drawn; mechanisms: 3.2.2-3* is on screen whenever tokens are. The cleft of an X-bound miniature is drawn grey, tag *not available*; a substrate arriving there rocks once and slides away (motion). More tokens are added in steps matching the five concentrations; grey clefts increase; tally slows.

**Motion contract:** seating, failure to seat, product release and token docking are non-covalent motions. **No covalent bond is drawn making or breaking in this lesson** (no new chemistry; no `Hydrolyse` or `CatalaseNet` replay; the catalase equation appears only as the formula tag **2H₂O₂ → 2H₂O + O₂**).

**`RateGraph` configurations used or published here:**

| Configuration | y-axis | x-axis | Beats | Rules |
|---|---|---|---|---|
| `amylase-concentration` (published) | **1/mean endpoint time / s⁻¹** | **amylase solution concentration / %** | 5, 6, 12 | Dataset A means; points *our illustrative data*; dashed line through the origin labelled *close to a straight line through the origin*; tag **relative rate proxy; not an initial rate**. Never labelled "initial rate". |
| `progress-product` + `tangent-t0` (3.1.3) | *volume of gas collected / cm³* | *time / s*, 0–180 | 7, 8 | Five curves, repeat 1 of each concentration, each from the origin with the tabulated repeat-1 initial gradient, levelling off, each below its own stoichiometric ceiling (12, 24, 36, 48, 60 cm³); no numbered readings on the curves; caption *our illustrative curves, drawn to each run's tangent*. Worked triangle on the 0.20 mol dm⁻³ curve only, along the tangent line from (0 s, 0 cm³) to (30 s, 12.0 cm³): **rise 12.0 cm³**, **run 30 s**, **12.0 ÷ 30 = 0.40 cm³ s⁻¹** (the same worked tangent as 3.1.3's standard run and 3.2.1's 30 °C repeat 1). |
| `rate-substrate` (published; 3.2.2-3 builds its construction on it) | generic name **initial rate of reaction**; with our catalase data the unit line reads **mean initial rate of gas collection / cm³ s⁻¹** | **hydrogen peroxide concentration / mol dm⁻³** (generic: *substrate concentration*) | 7, 8, 9, 12, 13 | Dataset B means; points *our illustrative data*; smooth curve rising steeply then levelling off; tag *x-axis: concentration, not time*; region labels **substrate concentration limiting** (rising part) and **active sites saturated · enzyme concentration limiting** (levelled part). No Vmax line in this lesson. |
| `lactose-schematic` (inset, Beat 10 only) | *rate of reaction* (no values) | *concentration of lactose / mmol dm⁻³*, ticks 20, 40, 60, 140 | 10 | Qualitative; flat from 60 to 140; caption *our schematic; the paper's Fig. 1.2 is not reproduced*. |
| `absorbance-time` + `straight-initial` (3.1.4) | **absorbance** (small type *no unit*), 0.00–0.70 | *time / s*, 0–180 | 11 | Dataset C, five series; triangles 0–60 s; the 0.0 row is 3.1.4's demonstration series. |
| `inhibitor-concentration` (published) | **initial rate of change of absorbance / s⁻¹** | **concentration of inhibitor X / mmol dm⁻³** | 11, 12 | Dataset C gradients; *our illustrative data; one run per concentration shown*; never labelled "initial rate of reaction" without *of change of absorbance*. |

**Apparatus (named where it sits; handling checked on a still frame, SHARED-SPECS §5):**
- **Amylase series** (`BufferedTubeRig` + `WaterBathRig` + `AmylaseIodineSampler`): bottles **amylase stock, 1.00 %** and **buffer solution, pH 7.0**; graduated pipette with a pipette filler; five **boiling tubes** in a rack for the amylase dilutions; five **test tubes** of **starch suspension, 1.0 %** (in pH 7.0 buffer); thermostatically controlled **water bath, 30 °C**, thermometer in the bath, both racks in it (*equilibrated separately, 10 min*). Pour: the starch tube tilted to ~120° from upright (mouth below base), stream leaving the lip and landing inside the boiling-tube mouth, liquid surfaces level. **White spotting tile** (3.1.3's layout: row A test, row B control; one equal drop of **iodine solution** per well; further tiles laid out for the longer runs), **dropper** squeezed above each well, never touching the iodine, rinsed in a **rinse beaker** between samples. Each well switches **in one rendered frame** between **blue-black** and **yellow-brown** (iodine's own colour); all blue-black wells drawn alike; no purple, grey or "colourless" state; caption *schematic swatches; judged by eye; our illustrative result*.
- **Peroxide series** (`GasSyringeRig` + `WaterBathRig`, 3.2.1's `equilibrate-separate` state): **conical flask** holding the peroxide; **small test tube** standing upright inside it holding **5.0 cm³ yeast suspension** (in pH 7.0 buffer, swirled before each aliquot); **bung and delivery tube**, seated before mixing; **gas syringe** clamped horizontally, plunger at **0 cm³**; bath at **30 °C**, 10 min separate equilibration; t = 0 at the tilt by the flask's neck; plunger moves out smoothly. Bottles **hydrogen peroxide, 0.50 mol dm⁻³** and **water**; safety tag *hydrogen peroxide: irritant; eye protection*.
- **Inhibitor series** (`ColorimeterModel`, 3.1.4): **light source → blue filter → cuvette (in holder) → detector → absorbance read-out**; cuvette held by its **ridged faces**, **clear faces** in the light path; liquids from a graduated pipette whose tip is inside the cuvette mouth above the liquid; enzyme added **last**; a lid fitted and the cuvette **inverted twice**; timer at mixing; holder lid closed before reading. All solutions at **25 °C**. Cuvette contents change in **one yellow hue only**, rising opacity; blanks stay colourless.

---

## Beat by beat

Beat windows in the headings are provisional (words ÷ 120 per beat, plus the prescribed silent reads, which the effective rate already absorbs); the runtime table below is authoritative and final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch beyond 30 words without a stated visual change.

### BEAT 1 · Hook and context · 0:00–0:39
**Narration:**
> Ever wondered why adding more of something to a reaction speeds it up, and then, past a certain point, hardly speeds it up at all? Inside a cell the amounts keep changing: a cell can make more of an enzyme or less, the supply of substrate rises and falls, and other molecules can bind to an enzyme and slow it. Here you measure each of those amounts, and explain what you see.

**Visual action:**
1. At *Ever wondered why adding more*, the hook question writes on a plain surface; at *hardly speeds it up at all*, a small curve beside it rises steeply and flattens, caption *schematic*, no axis values.
2. At *Inside a cell*, the surface opens onto one cell outline (no organelle detail) holding enzyme silhouettes, substrate dots and faint reaction arrows.
3. At *make more of an enzyme or less*, silhouettes multiply, then thin; a dial labelled **enzyme** appears at the edge. At *the supply of substrate rises and falls*, substrate dots stream in and ebb; dial **substrate**. At *bind to an enzyme and slow it*, a small terracotta token docks on one silhouette and its arrow slows; dial **inhibitor**.
4. At *Here you measure each of those amounts*, the three dials pulse together and become three tabs, **enzyme concentration · substrate concentration · inhibitor concentration**, and dissolve to the recall surface.

**On-screen text:** the hook question; the three dials, then tabs; *schematic*.

---

### BEAT 2 · Recall: the sentence from 3.2.1 · 0:39–1:32
**Narration:**
> First, the one idea you need from the lesson on temperature and pH. Here is an enzyme, drawn as a model. A substrate molecule collides with the active site, binds and forms an enzyme–substrate complex; the reaction happens, the products leave, and the site is free again. That lesson built one sentence. The rate depends on how often substrate molecules meet a working active site and form enzyme–substrate complexes per unit time, and on whether the active sites stay functional. High temperature or extreme pH can denature an enzyme, so the substrate no longer fits the active site. Today those conditions stay fixed, and the amounts change.

**Visual action:**
1. The tag **recall: 3.2.1** sits top left for the whole beat. At *the one idea you need*, a plain recall surface; at *drawn as a model*, `EnzymeActiveSiteModel` in `rest-lk` at centre with labels **enzyme**, **active site**, caption *schematic; not a real protein shape*.
2. At *collides with the active site*, a substrate outline travels in and seats (motion); at *forms an enzyme–substrate complex*, `bound` with the bracket **enzyme–substrate complex**; at *the products leave*, `products`, two outlines drift out; at *the site is free again*, the empty cleft is traced.
3. At *built one sentence*, a boxed sentence surface opens beneath the model, labelled *the sentence for 3.2.1 and 3.2.1b*. At *how often substrate molecules meet a working active site*, the first clause writes and a second substrate seats; at *per unit time*, a small tally beside the model, *complexes per unit time (illustrative)*, ticks; at *whether the active sites stay functional*, the last clause writes and the cleft is ringed. The complete sentence holds, boxed.
4. At *can denature an enzyme*, a second model beside the first runs 3.2.1's `denatured` motion by reference (links vanish one by one, fold loosens, cleft distorts, backbone traced continuous with **peptide bonds intact**); at *no longer fits the active site*, a substrate reaches its cleft, rocks and drifts away; caption **denatured**.
5. At *those conditions stay fixed*, the denatured model slides off; a strip beneath the working model reads **held fixed today: temperature (water bath) · pH (buffer solution)**; at *the amounts change*, the three tabs from Beat 1 return as a row.

**On-screen text:** *recall: 3.2.1*; the boxed sentence; **denatured**; *peptide bonds intact*; the fixed-conditions strip.

---

### BEAT 3 · What you will be able to do · 1:32–1:56
**Narration:**
> By the end you will be able to investigate how enzyme, substrate and inhibitor concentration affect the rate, and say which rate each method actually measures; explain each effect with that one sentence; and describe and explain a graph of rate against substrate concentration in the way mark schemes credit.

**Visual action:** Own styled surface, distinct background, no diagram. At *investigate how enzyme, substrate and inhibitor concentration*, line 1; at *say which rate each method actually measures*, line 1's second half lands; at *explain each effect with that one sentence*, line 2; at *describe and explain a graph*, line 3.
1. **INVESTIGATE** enzyme, substrate and inhibitor concentration, and name the rate each method measures
2. **EXPLAIN** each effect with one sentence
3. **DESCRIBE AND EXPLAIN** a graph of rate against substrate concentration

Small type: *syllabus 3.2.1, p.20: "investigate and explain".*

---

### BEAT 4 · More enzyme: the amylase dilution series · 1:56–2:52
**Narration:**
> Start with enzyme concentration: amylase acting on starch. You dilute a one per cent amylase stock with pH seven buffer to make five concentrations; one worked dilution is on screen. Every tube gets the same five cubic centimetres of starch suspension. Amylase and starch warm separately in the water bath at thirty degrees, then you pour the starch into the amylase and start the timer. Every thirty seconds, one drop of the mixture goes onto iodine on the spotting tile. The endpoint is the first sample that no longer turns blue-black; the well stays yellow-brown, iodine's own colour. Three repeats at each concentration, and a control with water in place of amylase.

**Visual action:**
1. At *amylase acting on starch*, bottles **amylase stock, 1.00 %** and **buffer solution, pH 7.0**, tag *recall: 3.1.3 (iodine sampling)*. At *dilute a one per cent amylase stock*, five boiling tubes in a rack, labelled **0.20 · 0.40 · 0.60 · 0.80 · 1.00 %**; a graduated pipette with a filler draws stock and dispenses into each tube, tip inside the tube mouth.
2. At *one worked dilution is on screen*, the worked row lands: **0.40 %: 2.0 cm³ stock + 3.0 cm³ buffer = 5.0 cm³ (2.0 ÷ 5.0 × 1.00 % = 0.40 %)**; the full dilution strip in small type beneath (stock 1.0 / 2.0 / 3.0 / 4.0 / 5.0 cm³; buffer 4.0 / 3.0 / 2.0 / 1.0 / 0.0 cm³).
3. At *the same five cubic centimetres of starch suspension*, a second rack of five test tubes, each labelled **5.0 cm³ starch suspension, 1.0 %**; small type *final volume 10.0 cm³ in every tube; same starting starch*.
4. At *warm separately in the water bath*, both racks sit in the **water bath**, thermometer reading **30 °C**, tag *equilibrated separately, 10 min*.
5. At *pour the starch into the amylase*, one starch tube is lifted and tilted to ~120° from upright; the stream leaves its lip and lands inside the boiling tube's mouth; surfaces level. At *start the timer*, a stopwatch starts at **0 s**, tag **t = 0 at mixing**; the boiling tube goes back into the bath.
6. At *Every thirty seconds*, the **spotting tile** slides in beside the bath (labelled; row A **test**, row B **control**), one drop of **iodine solution** in each well, columns labelled 0, 30, 60 … s. At *goes onto iodine on the spotting tile*, the **dropper** draws mixture, moves above the next well and releases one drop without touching; it is rinsed in the **rinse beaker**; the first wells switch in one frame to **blue-black**, tag *starch present*.
7. At *no longer turns blue-black*, for the 1.00 % tube the 150 s well switches blue-black and the 180 s well **stays yellow-brown**, ringed, tag **endpoint: first sample no longer blue-black**; at *iodine's own colour*, tag *yellow-brown: iodine's own colour; starch no longer detected*.
8. At *Three repeats*, a **×3** tag lands on every tube and small type *longer runs use further tiles*. At *water in place of amylase*, the control tube, **5.0 cm³ water in place of amylase solution + 5.0 cm³ starch suspension**, samples into row B, every well blue-black; small type *specimen Paper 1 Q13, key A: the control replaces the enzyme with water*.

**On-screen text:** bottle and tube labels; the worked dilution; *equilibrated separately, 10 min*; *t = 0 at mixing*; *blue-black* / *yellow-brown*; *endpoint*; *×3*; the control label; *schematic swatches; judged by eye; our illustrative result*.

---

### BEAT 5 · More enzyme: what the times show, and why · 2:52–3:47
**Narration:**
> The mean endpoint times fall from nine hundred and ten seconds at the lowest concentration to one hundred and eighty at the highest. Each time is known only to within one sampling interval, thirty seconds, so the concentrations are spread far enough apart that each mean differs from the next by more than that. Plot one over the mean endpoint time: a relative rate, larger when faster, and not an initial rate. Double the amylase, and one over t roughly doubles. Why? More amylase, more active sites available, so more successful collisions and more enzyme–substrate complexes formed per unit time. While substrate is in excess, the rate rises in proportion to enzyme concentration.

**Visual action:**
1. At *The mean endpoint times fall*, Dataset A builds beside the tile (concentration, three endpoint times, mean), with the control row **blue-black at every sample to 930 s**. At *nine hundred and ten seconds*, the 0.20 % mean **910 s** is highlighted; at *one hundred and eighty at the highest*, the 1.00 % mean **180 s**.
2. At *known only to within one sampling interval*, zoom on the 1.00 % row of the tile: the 150 s well blue-black and the 180 s well yellow-brown, bracketed, **the blue-black was lost somewhere in these 30 s**; tag *resolution: one sampling interval, 30 s*. At *each mean differs from the next*, the gaps between consecutive means appear beside the table, **450 · 150 · 80 · 50 s**, each tagged *> 30 s*.
3. At *Plot one over the mean endpoint time*, the table's last column fills (**0.0011 · 0.0022 · 0.0032 · 0.0043 · 0.0056 s⁻¹**) and `RateGraph` `amylase-concentration` draws: y **1/mean endpoint time / s⁻¹**, x **amylase solution concentration / %**, five points, *our illustrative data*. At *a relative rate, larger when faster*, the y-axis tag **relative rate proxy** lands; at *not an initial rate*, a ghost label *initial rate* appears on the axis with a small ✗ and dissolves; tag *endpoint method: 1/t, not an initial rate*.
4. At *Double the amylase*, the 0.20 and 0.40 % points are ringed with **0.0011** and **0.0022**, then the 0.40 and 0.80 % points with **0.0022** and **0.0043**; at *roughly doubles*, a **×2** arrow between each ringed pair; a dashed line through the origin draws, labelled *close to a straight line through the origin*.
5. At *More amylase, more active sites available*, the `pop-enzyme` inset slides in (2-enzyme box and 4-enzyme box, both crowded with substrate); at *more successful collisions*, seating events flash in both, visibly more often on the right; at *more enzyme–substrate complexes formed per unit time*, the two tallies run, the right climbing about twice as fast.
6. At *While substrate is in excess*, the substrate crowd in both boxes pulses, tag **substrate in excess**; at *in proportion to enzyme concentration*, the dashed line on the graph pulses; citation tab: **S23/34 Q1(c)(iii), MS p.7: "more enzyme molecules so more active sites available ; more successful collisions ; more enzyme-substrate complexes form ;"**.

**On-screen text:** Dataset A with means and 1/mean t; *resolution: one sampling interval, 30 s*; the graph and its tags; *substrate in excess*; the citation.

---

### BEAT 6 · COMMON MISTAKE E40: a count with no time, and intervals with no times · 3:47–5:05
**Narration:**
> Now a mistake in two places, on the card. Our framing: describe how you would compare the rates, and explain why more amylase is faster. Read this answer.
>
> *(silent read, 4 s)*
>
> Start with the second line. It counts complexes but gives no time. Yet every tube breaks down about the same starch by its endpoint, so the totals are about the same; what differs is how fast they form. A count can feel like a rate, because more sounds like faster. In June 2021, Paper 22, explaining a higher maximum rate, the mark scheme ignored more E S C form without the idea of increased rate. So add the time basis: per unit time. The marker stays on: the first line says samples at intervals. Which intervals? In the Learner Guide's marked example, that point was not awarded because the intervals were not described as timed or regular; every minute would have earned it. So write the times: every thirty seconds, from mixing.

**Visual action:**
1. **Entry cue: *Now a mistake in two places*.** COMMON MISTAKE panel enters (header badge **COMMON MISTAKE**, terracotta border) with its basis line in small type: *basis: mark-scheme ignore line, S21/22 Q5(d)(i), MS p.18; examiner annotation of an example response, Learner Guide p.19*. It stays on until the completed correct frame. The Beat 5 graph and tile hold at left, dimmed.
2. At *Our framing*, the header lands: **Describe how you would compare the rate of reaction at the five amylase concentrations, and explain why the rate is higher at a higher amylase concentration.** Small type *our framing; not a Cambridge question*.
3. At *Read this answer*, the written wrong answer appears in handwriting style, two lines:
   **✗ 1** *Take samples of each mixture at intervals and test them with iodine, and time how long the blue-black colour takes to disappear.*
   **✗ 2** *With more amylase, more enzyme–substrate complexes form.*
   Small type *our composite of the two faults the cited rulings describe; not a transcript*.
4. **Silent read, 4 s.** Panel and card held.
5. At *Start with the second line*, line 2 is underlined in terracotta; at *It counts complexes*, the words *more enzyme–substrate complexes form* are ringed, side-note *a count: no time*.
6. At *every tube breaks down about the same starch*, the 0.20 % and 1.00 % tile rows return small beside the card, both ending on a yellow-brown well, tag *same starch, same endpoint*; at *what differs is how fast they form*, their means **910 s** and **180 s** pulse.
7. At *A count can feel like a rate*, side-note *more ≠ faster*.
8. At *In June 2021, Paper 22*, citation tab, exact: **S21/22 Q5(d)(i), MS p.18: "I more ESC form needs idea of increased rate" · credited: "more enzyme-substrate complexes per unit time"**; at *ignored more E S C form*, the I line is underlined; boundary tab beneath in the normal accent: **local ruling: that question explains a higher Vmax. S23/34 Q1(c)(iii), MS p.7 lists "more enzyme-substrate complexes form ;" for an enzyme-concentration explanation. Per unit time says the rate.**
9. At *add the time basis: per unit time*, line 2 is struck and rewritten in place: **✓ 2** *With more amylase there are more active sites, so more enzyme–substrate complexes form per unit time.* The marker stays on.
10. At *The marker stays on*, the panel border pulses once; at *the first line says samples at intervals*, the words *at intervals* in line 1 are underlined in terracotta; at *Which intervals?*, side-note *which times?*.
11. At *In the Learner Guide's marked example*, citation tab, exact: **Learner Guide p.19 (annotating specimen Paper 2 Q3(c)): "Mark point two is not awarded here as the intervals are not described as 'timed' or 'regular' intervals. If the candidate had said that the samples are taken every minute, then the mark would have been awarded."**; at *not described as timed or regular*, that clause is underlined; at *every minute would have earned it*, the second sentence is underlined. Small type: *specimen P2 Q3(c), MS p.13: "take samples at timed intervals ; A regular intervals". That example still scored full marks through other points (our paraphrase of EXAMINER-INSIGHT §5).*
12. At *So write the times*, line 1 is struck and rewritten in place: **✓ 1** *Take a sample every 30 s from mixing (timed, regular intervals) and test it with iodine; record the first sample that no longer gives blue-black.* This is the last fault; **the marker clears on this completed frame**. **Exit cue: end of *from mixing*.** Treatment lifts; the corrected card and the boundary tab hold.

**On-screen text:** the panel and its basis line; the header; the card; the two citation tabs; the boundary tab; the specimen MS line.

---

### BEAT 7 · More substrate: peroxide dilutions and initial slopes · 5:05–6:02
**Narration:**
> Now substrate concentration: catalase in yeast breaking down hydrogen peroxide, on the gas-syringe rig. Every run has the same five cubic centimetres of yeast suspension; the peroxide changes, five concentrations diluted from one stock. Tip to mix at time zero, and the syringe collects the gas. Each flask starts with a different amount of peroxide, so comparing times to finish would compare different amounts. Take the initial rate instead, from the tangent at time zero. For zero point two moles per cubic decimetre, the tangent rises twelve cubic centimetres in thirty seconds: zero point four cubic centimetres per second. Three runs each, and the means, plotted against concentration, rise steeply, then level off.

**Visual action:**
1. At *catalase in yeast breaking down hydrogen peroxide*, the formula tag **2H₂O₂ → 2H₂O + O₂** (small type *formula equation only; the net reaction is drawn in 3.1.3*); at *on the gas-syringe rig*, `GasSyringeRig` builds, each part labelled as it appears: **conical flask**, **small test tube** upright inside it, **bung and delivery tube** (seated), **gas syringe** clamped horizontally with the plunger at **0 cm³**, flask in the **water bath, 30 °C**; tag *recall: 3.1.3 and 3.2.1 (same rig, same 30 °C)*.
2. At *the same five cubic centimetres of yeast suspension*, the stock beaker **yeast suspension in buffer solution, pH 7.0** is swirled and a syringe delivers **5.0 cm³** into the small tube. At *five concentrations diluted from one stock*, bottles **hydrogen peroxide, 0.50 mol dm⁻³** and **water**, five flasks labelled **0.10 · 0.20 · 0.30 · 0.40 · 0.50 mol dm⁻³**, and the worked row: **0.20 mol dm⁻³: 4.0 cm³ stock + 6.0 cm³ water = 10.0 cm³ (4.0 ÷ 10.0 × 0.50 = 0.20)**, the full strip in small type; tags *equilibrated separately, 10 min* and *hydrogen peroxide: irritant; eye protection*.
3. At *Tip to mix at time zero*, the flask is tilted by its neck so the small tube spills into the peroxide and is set upright in the bath; stopwatch **t = 0**. At *the syringe collects the gas*, the plunger moves smoothly outward.
4. At *starts with a different amount of peroxide*, `RateGraph` `progress-product` draws the five repeat-1 curves (*volume of gas collected / cm³* against *time / s*), each levelling at a different height, caption *our illustrative curves, drawn to each run's tangent*; at *compare different amounts*, the five levelled ends are bracketed, tag ✗ *time to finish: different starting amounts*.
5. At *Take the initial rate instead*, `tangent-t0` lines draw from the origin on all five; at *the tangent at time zero*, the 0.20 tangent brightens and the others dim.
6. At *the tangent rises twelve cubic centimetres*, the triangle draws along the tangent line from (0 s, 0 cm³) to (30 s, 12.0 cm³): **rise 12.0 cm³**, **run 30 s**; at *zero point four cubic centimetres per second*, the working lands: **12.0 cm³ ÷ 30 s = 0.40 cm³ s⁻¹**.
7. At *Three runs each*, Dataset B builds (three initial rates and a mean per concentration; enzyme-free control row **0.00**). At *plotted against concentration*, `RateGraph` `rate-substrate` draws: y **initial rate of reaction** with the unit line **mean initial rate of gas collection / cm³ s⁻¹**, x **hydrogen peroxide concentration / mol dm⁻³**, five points **0.21 · 0.40 · 0.53 · 0.59 · 0.61**, *our illustrative data*; tag *x-axis: concentration, not time*. At *rise steeply, then level off*, a smooth curve is traced through the points.

**On-screen text:** part labels; the formula tag; the worked dilution; the triangle and working; Dataset B; axis labels; *x-axis: concentration, not time*.

---

### BEAT 8 · COMMON MISTAKE E38: a concentration graph read as time · 6:02–7:18
**Narration:**
> Here is a description of that graph, in wording that one mark scheme has a line for. Read it.
>
> *(silent read, 3 s)*
>
> Look at the words fast and slows down. They describe a change over time, and that is what happens during a single run, on a progress curve, with time along the bottom. The two curves have a similar shape, so it is easy to read one as if it were the other. But this graph has no time axis: each point comes from separate runs, and along the bottom is substrate concentration. In June 2021, Paper 22, the mark scheme ignores this wording: it needs reference to rate of reaction, and describing the gradient of the curve is not enough. So describe rate against concentration. As substrate concentration increases, rate increases, then levels off: from zero point two one to zero point five three cubic centimetres per second, then only to zero point six one.

**Visual action:**
1. **Entry cue: *Here is a description of that graph*.** COMMON MISTAKE panel enters with its basis line: *basis: mark-scheme ignore line, S21/22 Q5(c), MS p.17*. It stays on until the completed correct frame. The Beat 7 `rate-substrate` graph holds at left.
2. At *one mark scheme has a line for*, the header lands: **Describe the effect of hydrogen peroxide concentration on the rate of reaction shown in the graph.** Small type *our framing, on our graph; the card's wording is the wording S21/22 Q5(c), MS p.17 ignores*.
3. At *Read it*, the written wrong answer appears in handwriting style: **✗** *The rate of reaction is fast and then slows down.*
4. **Silent read, 3 s.**
5. At *Look at the words fast and slows down*, *fast* and *slows down* on the card are underlined in terracotta; at *a change over time*, side-note *time words*.
6. At *during a single run, on a progress curve*, the Beat 7 `progress-product` graph slides in small beside the card, its 0.20 curve traced from steep to flat and its **time / s** axis ringed.
7. At *The two curves have a similar shape*, the progress curve and the rate–concentration curve pulse side by side; side-note *similar shape, different x-axes*.
8. At *this graph has no time axis*, the rate–concentration graph's x-axis is ringed in the accent; at *each point comes from separate runs*, each plotted point opens briefly into a three-run icon and closes; at *along the bottom is substrate concentration*, the x-axis label **hydrogen peroxide concentration / mol dm⁻³** brightens.
9. At *In June 2021, Paper 22*, citation tab, exact: **S21/22 Q5(c), MS p.17: "I 'rate of reaction is fast and then slows down' needs ref. to rate of reaction, describing 'gradient of curve' is not enough"**; at *ignores this wording*, the quoted phrase is underlined and an arrow joins it to the card; at *describing the gradient of the curve is not enough*, that clause is underlined.
10. At *So describe rate against concentration*, the card's sentence is struck; at *As substrate concentration increases*, it is rewritten in place: **✓** *As hydrogen peroxide concentration increases, the rate of reaction increases, then levels off*; at *from zero point two one*, the values line lands beneath: *from 0.21 cm³ s⁻¹ at 0.10 mol dm⁻³ to 0.53 cm³ s⁻¹ at 0.30 mol dm⁻³, then only to 0.59 and 0.61 cm³ s⁻¹ at 0.40 and 0.50 mol dm⁻³*, the matching points ringing in turn. **The marker clears on this completed frame.** **Exit cue: end of *zero point six one*.** Treatment lifts; the corrected card holds.

**On-screen text:** the panel and basis; the header; the card; the citation; *similar shape, different x-axes*; the corrected description with values.

---

### BEAT 9 · Why it levels off: saturated active sites · 7:18–8:14
**Narration:**
> Why that shape? At low substrate concentration many active sites are empty at any moment. Add substrate, and substrate molecules meet free active sites more often, so more enzyme–substrate complexes form per unit time and the rate rises: substrate concentration is the limiting factor. Keep adding, and nearly every active site is occupied at any moment: the active sites are saturated. Picture a shop where every till is busy: a longer queue gets nobody through faster, yet every till is still serving. Written properly: at the plateau, complexes still form and break at the maximum rate, and enzyme concentration, the number of active sites, is now the limiting factor.

**Visual action:**
1. At *Why that shape?*, the `rate-substrate` graph moves to the left half; the `pop-substrate` box opens at right with six enzyme miniatures, caption *schematic; not a real protein shape*.
2. At *many active sites are empty*, three substrate outlines drift in the box and four of six clefts are ringed as empty; the low-concentration end of the curve is ringed.
3. At *Add substrate*, more outlines enter; at *meet free active sites more often*, seating events (motion: in, `bound`, `products` out) become more frequent; at *more enzyme–substrate complexes form per unit time*, the tally *complexes per second (illustrative)* climbs faster; at *the rate rises*, the rising section of the curve is traced; at *substrate concentration is the limiting factor*, the label **substrate concentration limiting** lands on that section.
4. At *Keep adding*, the box crowds with substrate; at *nearly every active site is occupied*, all six clefts show `bound` with at most one briefly empty as products leave; at *the active sites are saturated*, the label **active sites saturated** lands on the levelled section.
5. At *Picture a shop*, the analogy inset (tag *analogy only*): six tills, each with someone being served, a queue lengthening; at *every till is still serving*, the tills keep cycling, one customer out and the next in.
6. At *Written properly*, the inset fades and the creditworthy sentence writes beneath the graph: **At the plateau the active sites are saturated: enzyme–substrate complexes still form and break at the maximum rate, and enzyme concentration (the number of active sites) is the limiting factor.** At *complexes still form and break at the maximum rate*, the box runs its saturated loop (each product pair leaves, a new substrate seats almost at once), tag *still reacting*, tally steady at its highest; at *the number of active sites*, the six clefts pulse; at *is now the limiting factor*, the levelled section gains **enzyme concentration limiting**. Small type: *the maximum rate has a name and a use: 3.2.2-3*.

**On-screen text:** region labels; the handle strap-line *busy tills*; the creditworthy sentence; *still reacting*.

---

### BEAT 10 · COMMON MISTAKE E39: describing, and "full" read as "finished" · 8:14–9:34
**Narration:**
> Here is an explanation that an examiners' report describes in detail, on the card. June 2023, Paper 31, asked for an explanation of a lactase graph over two ranges of lactose concentration. Read this answer.
>
> *(silent read, 4 s)*
>
> Look at the first line. It is true, and it is a description: it says what the rate does, not why. The report says the majority of candidates described the increase, which gained no credit. Explaining means giving the cause: as lactose increases, more enzyme–substrate complexes form per unit time. The marker stays on for the second line. It starts well: active sites fully occupied. Then look at the words no more and stopped. Full can sound like finished. The report says many candidates went on this way and gained no credit. Remember the tills: all busy, still serving. So, all active sites are saturated, complexes form and break at the maximum rate, and the maximum rate of reaction is reached.

**Visual action:**
1. **Entry cue: *Here is an explanation that an examiners' report*.** COMMON MISTAKE panel enters with its basis line: *basis: examiner report, June 2023 Paper 31 Q1(b)(i), p.26*. It stays on until the completed correct frame. The Beat 9 graph and box hold at left, dimmed.
2. At *June 2023, Paper 31*, the header lands: **Explain the rate of reaction between 20 and 40 mmol dm⁻³ and between 60 and 140 mmol dm⁻³ of lactose.** Small type *our framing of June 2023 Paper 31 Q1(b)(i); UNVERIFIED — verbatim QP instruction; the two intervals are the mark scheme's (MS p.7)*. At *two ranges of lactose concentration*, the `lactose-schematic` inset draws with the 20–40 and 60–140 ranges shaded, caption *our schematic; the paper's Fig. 1.2 is not reproduced*.
3. At *Read this answer*, the written wrong answer appears in handwriting style, two lines:
   **✗ 1** *Between 20 and 40 mmol dm⁻³, the rate of reaction increases as the lactose concentration increases.*
   **✗ 2** *Between 60 and 140 mmol dm⁻³, the active sites are fully occupied, so no more enzyme–substrate complexes can be formed and the reaction has stopped.*
   Small type *the two faults the June 2023 report describes; composite, not a transcript*.
4. **Silent read, 4 s.**
5. At *Look at the first line*, line 1 is underlined in terracotta; at *it says what the rate does, not why*, side-note *what, not why*.
6. At *the majority of candidates described the increase*, citation tab, exact: **June 2023 ER, Paper 31 Q1(b)(i), p.26: "However, the majority of candidates described the increase in the rate of reaction as the concentration of lactose increased between 20 mmol dm–3 and 40 mmol dm–3, which gained no credit. … Many candidates correctly explained that the active sites of the enzymes were fully occupied but then stated that no more enzyme-substrate complexes could be formed or that the reaction had stopped so did not gain any credit."**, its first sentence underlined.
7. At *Explaining means giving the cause*, line 1 is struck and rewritten in place: **✓ 1** *Between 20 and 40 mmol dm⁻³, as lactose concentration increases, more enzyme–substrate complexes form per unit time, so the rate of reaction increases.* At *more enzyme–substrate complexes form per unit time*, the MS tab lands beneath the ER tab, exact: **S23/31 Q1(b)(i), MS p.7: "20 mmol dm–3 and 40 mmol dm–3: lactose concentration increases so more enzyme substrate complexes ; 60 mmol dm-3 and 140 mmol dm–3: all active sites are saturated, so maximum rate of reaction is reached ;"**, its first clause underlined. The marker stays on.
8. At *The marker stays on for the second line*, line 2 is underlined in terracotta; at *active sites fully occupied*, those words are ticked in the accent; at *the words no more and stopped*, *no more enzyme–substrate complexes can be formed* and *the reaction has stopped* are ringed in terracotta.
9. At *Full can sound like finished*, side-note *full ≠ finished*. At *many candidates went on this way*, the ER tab's second sentence is underlined.
10. At *Remember the tills*, the Beat 9 till inset returns small, every till cycling, and the saturated box loop replays beside it, tag *still reacting*.
11. At *all active sites are saturated*, line 2 is struck and rewritten in place: **✓ 2** *Between 60 and 140 mmol dm⁻³, all active sites are saturated: enzyme–substrate complexes form and break at the maximum rate, so the maximum rate of reaction is reached.*; the MS tab's second clause is underlined. This is the last fault; **the marker clears on this completed frame**. **Exit cue: end of *the maximum rate of reaction is reached*.** Treatment lifts; the corrected card holds.

**On-screen text:** the panel and basis; the header with its UNVERIFIED label; the inset; the card; the ER and MS tabs; *what, not why*; *full ≠ finished*.

---

### BEAT 11 · More inhibitor: fewer working active sites · 9:34–10:47
**Narration:**
> The third amount is inhibitor, in an adaptation of a Paper 5 question. That paper changed the substrate with and without an inhibitor called X; here the substrate is fixed and X changes, five concentrations including zero. The assay is the colorimeter one from earlier: colourless ONPG becomes a yellow product, read through a blue filter. Each concentration of X has its own blank, with water in place of enzyme, and you zero on it. The rate is the initial gradient over the first sixty seconds: with no X, zero point two four in sixty seconds, zero point zero zero four per second. A single reading at one time is an amount of colour, not a rate. As X increases, the rate falls. More X means more enzyme molecules with X bound at any moment, so fewer active sites available or working, and fewer complexes per unit time. How X binds is for the lesson on inhibitors.

**Visual action:**
1. At *The third amount is inhibitor*, the **inhibitor concentration** tab brightens. At *an adaptation of a Paper 5 question*, a two-panel label card: **adaptation of S21/51** · left *S21/51: substrate concentration varied, with and without inhibitor X* · right *here: substrate fixed; concentration of X varied*. At *with and without an inhibitor called X*, the left panel brightens; at *here the substrate is fixed and X changes*, the right panel brightens; small type *X is the paper's label; no identity or inhibition class is inferred from these data*.
2. At *five concentrations including zero*, five cuvettes in a rack labelled **X: 0.0 · 0.5 · 1.0 · 1.5 · 2.0 mmol dm⁻³** (in the cuvette); volume strip in small type: *1.0 cm³ buffer solution, pH 7.0 + 0.5 cm³ ONPG solution + 0.5 cm³ X solution (water for 0.0) + 0.5 cm³ enzyme solution, added last = 2.5 cm³*.
3. At *The assay is the colorimeter one from earlier*, `ColorimeterModel` builds, parts labelled where they sit: **light source → filter → cuvette (in holder) → detector → absorbance read-out**, tags *recall: 3.1.4* and *all solutions at 25 °C*. At *colourless ONPG becomes a yellow product*, a cuvette's contents go from colourless to pale then deeper yellow in one hue (opacity only), tag *β-galactosidase + ONPG → yellow product (names are context)*; at *read through a blue filter*, the filter is labelled **blue filter**.
4. At *its own blank*, the blank for 1.0 mmol dm⁻³ is lifted by its **ridged faces**, contents listed beside it: *buffer + ONPG + X at 1.0 mmol dm⁻³ + water in place of enzyme*, and lowered into the holder, **clear faces** to the light, lid closed; at *you zero on it*, the zero button is pressed and the read-out shows **0.00**; tag **re-zero on each concentration's own blank**. Then the reaction cuvette: enzyme added last from the pipette, lid fitted, inverted twice by the ridged faces, set upright; stopwatch **t = 0 at mixing**; into the holder.
5. At *the initial gradient over the first sixty seconds*, `RateGraph` `absorbance-time` draws the 0.0 series (**0.00, 0.12, 0.24, 0.35, 0.45, 0.53, 0.60** at 0–180 s), axes *absorbance (blank-corrected; no unit)* and *time / s*, with `straight-initial` ruled over 0–60 s; tag *same readings as 3.1.4's demonstration*. At *zero point two four in sixty seconds*, the triangle: **rise 0.24**, **run 60 s**; at *zero point zero zero four per second*, the working: **initial rate of change of absorbance = 0.24 ÷ 60 s = 0.0040 s⁻¹**.
6. At *A single reading at one time*, the 120 s point (**0.45**) is ringed with the tag *one reading: how much colour by then, an amount*; at *not a rate*, a ghost label *rate* beside it gets a ✗ and dissolves.
7. At *As X increases, the rate falls*, the other four series draw on the same axes, each with its 0–60 s triangle (**0.18 · 0.14 · 0.12 · 0.10**); the `inhibitor-concentration` factor plot slides in: y **initial rate of change of absorbance / s⁻¹**, x **concentration of inhibitor X / mmol dm⁻³**, points **0.0040 · 0.0030 · 0.0023 · 0.0020 · 0.0017**, *our illustrative data; one run per concentration shown*. Small type: *an absorbance rate; for a concentration rate, convert each reading through the 3.1.4 calibration curve first, then take the gradient*.
8. At *more enzyme molecules with X bound*, the `pop-inhibitor` box opens: six miniatures, substrate plentiful; terracotta X tokens dock on some, caption *where X binds is not drawn; mechanisms: 3.2.2-3*. At *fewer active sites available or working*, the X-bound clefts grey, tag *not available*, and a substrate arriving at one rocks and slides away (motion); at *fewer complexes per unit time*, the tally slows as more tokens dock; at *How X binds*, the tokens pulse and the tag **mechanisms: 3.2.2-3** brightens.

**On-screen text:** the adaptation card; the volume strip; part labels; *re-zero on each concentration's own blank*; the triangle and working; *an amount*; the factor plot; the calibration note; the caption on X.

---

### BEAT 12 · What I told you, on the three graphs · 10:47–11:28
**Narration:**
> So here is the lesson, on the graphs you built. More enzyme: more active sites, more complexes per unit time, and one over the mean endpoint time rises roughly in proportion. More substrate: the initial rate rises while active sites are free, then levels off once they are saturated, with complexes still forming and breaking at the maximum rate. More inhibitor: fewer active sites available or working, and a lower initial rate of change of absorbance. Under all three sits the sentence you started with.

**Visual action:** **No new slide.** The screen returns to what was built: the three factor plots in a row (`amylase-concentration`, `rate-substrate`, `inhibitor-concentration`), each with its own y-axis label, and beneath them the three population boxes; the boxed sentence from Beat 2 along the bottom. Static. Key points fade in in place:
1. At *on the graphs you built*, the three plots settle and their axis labels brighten in turn.
2. At *More enzyme: more active sites*, the 4-enzyme box brightens; at *rises roughly in proportion*, the dashed line on the amylase plot and its tag *relative rate proxy* brighten.
3. At *More substrate: the initial rate rises*, the rising section and **substrate concentration limiting** brighten; at *levels off once they are saturated*, **active sites saturated** brightens; at *still forming and breaking*, the saturated box loop runs once and *still reacting* brightens.
4. At *More inhibitor*, the X-bound grey clefts brighten; at *a lower initial rate of change of absorbance*, the falling points on the inhibitor plot brighten.
5. At *Under all three*, the boxed sentence brightens clause by clause, *per unit time* last.

---

### BEAT 13 · How it is asked, with our version of the June 2021 question · 11:28–12:28
**Narration:**
> How does this reach you? One form is a graph of rate against substrate concentration with describe and explain, as in June 2021, Paper 22: three marks, one for the description and two for the cause. Others ask what more enzyme does, or which control to use. Read our version of that June 2021 question, then watch the credited ideas land on our graph. And the hook? More substrate speeds the reaction up until the active sites are saturated; then the number of active sites sets the limit.

**Visual action:**
1. At *How does this reach you?*, a forms surface at left, plain, one row per form.
2. At *describe and explain, as in June 2021, Paper 22*, row 1: **describe and explain a rate against substrate concentration graph** · *S21/22 Q5(c), 3 marks (QP p.12; MS p.17)*; at *three marks, one for the description*, small type *one description mark*; at *two for the cause*, small type *two from: collisions / enzyme–substrate complexes; active sites available at low concentration; saturated at high concentration; a named limiting factor, qualified (our paraphrase of the scheme as summarised in the weights)*.
3. At *Others ask what more enzyme does*, row 2: **explain the effect of more enzyme** · *S23/34 Q1(c)(iii), 3 marks, MS p.7*; at *which control to use*, row 3: **choose the control** · *specimen Paper 1 Q13, key A: enzyme replaced by water*.
4. At *Read our version*, the forms slide left and our framing appears at right: **Describe and explain the effect of hydrogen peroxide concentration on the rate of reaction.** Label *our framing of S21/22 Q5(c), which used cellulose concentration; UNVERIFIED — verbatim QP p.12 instruction*. The paper's graph is not reproduced; our `rate-substrate` graph sits beneath. Five-second anchored read with the instruction **describe, then explain**.
5. At *the credited ideas land on our graph*, the ideas land one by one on the graph, each ticked as its region pulses: *description: rate increases, then levels off, as concentration increases* (whole curve) · *more collisions, more enzyme–substrate complexes per unit time* (rising part) · *active sites available at low concentration* (rising part) · *active sites saturated at high concentration* (levelled part) · *enzyme concentration limiting at the plateau* (levelled part). Small type *credited ideas as summarised in TOPIC-03-WEIGHTS for MS p.17; paraphrase, not the scheme's wording*.
6. At *And the hook?*, the Beat 1 hook curve returns small beside the graph; at *until the active sites are saturated*, its flat part gains the label **active sites saturated**. At the end of *sets the limit*, the reject card lands, struck through by hand: **✗ "rate of reaction is fast and then slows down"** / **✓ as substrate concentration increases, rate increases, then levels off**, citation *S21/22 Q5(c), MS p.17, ignore line* in small type. **Exit cue: end of *sets the limit*.** Final frame held 2 s: the forms at left, our framing and graph with ticks at right, the reject card beneath. No slogan.

**On-screen text:** the three forms with citations; our framing and its labels; the five credited ideas; the reject card.

---

## Datasets

One table per experiment; every derived number is worked. All values are *our illustrative data*.

### Dataset A — amylase concentration, timed iodine sampling (Beats 4, 5, 6, 12)

Conditions: amylase stock 1.00 % in buffer solution, pH 7.0; each amylase solution made up to 5.0 cm³ with the same buffer; 5.0 cm³ starch suspension, 1.0 %, in pH 7.0 buffer, added to each; final volume 10.0 cm³; amylase and starch equilibrated separately for 10 min at 30 °C, then the starch poured into the amylase; t = 0 at mixing; one drop of mixture onto one drop of iodine solution at t = 0 and every 30 s; endpoint = time of the first sample that no longer gives blue-black. Control: 5.0 cm³ water in place of the amylase solution.

| Amylase solution / % | Stock / cm³ | Buffer / cm³ | Endpoint, run 1 / s | Run 2 / s | Run 3 / s | Mean endpoint time / s | 1/mean endpoint time / s⁻¹ |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 0.20 | 1.0 | 4.0 | 900 | 930 | 900 | **910** | **0.0011** |
| 0.40 | 2.0 | 3.0 | 450 | 480 | 450 | **460** | **0.0022** |
| 0.60 | 3.0 | 2.0 | 300 | 300 | 330 | **310** | **0.0032** |
| 0.80 | 4.0 | 1.0 | 210 | 240 | 240 | **230** | **0.0043** |
| 1.00 | 5.0 | 0.0 | 180 | 180 | 180 | **180** | **0.0056** |
| control (water) | 0.0 | — | blue-black at every sample to 930 s | same | same | — | — |

Worked:
- Dilution: concentration = 1.00 % × stock ÷ 5.0 cm³; 0.40 % = 1.00 × 2.0 ÷ 5.0 (the worked example shown); the others 1.0, 3.0, 4.0, 5.0 cm³ ÷ 5.0 = 0.20, 0.60, 0.80, 1.00 %.
- Means: (900 + 930 + 900) ÷ 3 = 2730 ÷ 3 = **910**; 1380 ÷ 3 = **460**; 930 ÷ 3 = **310**; 690 ÷ 3 = **230**; 540 ÷ 3 = **180** s.
- 1/mean (2 s.f.): 1/910 = 0.001099 → **0.0011**; 1/460 = 0.002174 → **0.0022**; 1/310 = 0.003226 → **0.0032**; 1/230 = 0.004348 → **0.0043**; 1/180 = 0.005556 → **0.0056** s⁻¹.
- Resolution: every time is a multiple of the 30 s interval; the true loss of blue-black lies in the 30 s before the recorded sample. Consecutive means differ by 910 − 460 = **450**, 460 − 310 = **150**, 310 − 230 = **80**, 230 − 180 = **50** s, each more than one interval; the repeat ranges do not overlap (180–180, 210–240, 300–330, 450–480, 900–930 s).
- *Double the amylase, and one over t roughly doubles*: 0.20 → 0.40 %: 0.0022 ÷ 0.0011 = 2.0 (unrounded 910 ÷ 460 = 1.98); 0.40 → 0.80 %: 0.0043 ÷ 0.0022 (unrounded 460 ÷ 230 = 2.00).
- *Close to a straight line through the origin*: (1/mean) ÷ concentration = 5.49, 5.43, 5.38, 5.43, 5.56 × 10⁻³ s⁻¹ per %, within about ±2 % of 5.46 × 10⁻³.
- Same starting starch in every tube (5.0 cm³ of 1.0 %) and the same endpoint criterion, so about the same starch is broken down by each endpoint (Beat 6).
- Samples: the 0.20 % runs need samples from 0 to 930 s, 32 wells per run; the tile layout extends over further tiles (Beat 4 small type).

### Dataset B — hydrogen peroxide concentration, gas syringe, initial slopes (Beats 7, 8, 9, 12, 13)

Conditions (SHARED-SPECS §5): 5.0 cm³ yeast suspension in pH 7.0 buffer (swirled before each aliquot) in the small tube; 10.0 cm³ hydrogen peroxide solution in the conical flask, made by proportional dilution of a 0.50 mol dm⁻³ stock with water; both equilibrated separately 10 min at 30 °C; bung seated; t = 0 at the tilt; volume of gas collected every 15 s to 180 s; initial rate = gradient of the tangent at t = 0 for each run. Control: 5.0 cm³ water in place of the yeast suspension, 0.50 mol dm⁻³ peroxide.

| Hydrogen peroxide / mol dm⁻³ | Stock / cm³ | Water / cm³ | Initial rate, run 1 / cm³ s⁻¹ | Run 2 / cm³ s⁻¹ | Run 3 / cm³ s⁻¹ | Mean initial rate / cm³ s⁻¹ | Stoichiometric ceiling / cm³ |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 0.10 | 2.0 | 8.0 | 0.21 | 0.22 | 0.20 | **0.21** | 12 |
| 0.20 | 4.0 | 6.0 | 0.40 | 0.41 | 0.39 | **0.40** | 24 |
| 0.30 | 6.0 | 4.0 | 0.52 | 0.55 | 0.52 | **0.53** | 36 |
| 0.40 | 8.0 | 2.0 | 0.58 | 0.60 | 0.59 | **0.59** | 48 |
| 0.50 | 10.0 | 0.0 | 0.60 | 0.62 | 0.61 | **0.61** | 60 |
| control (water for yeast), 0.50 | 10.0 | 0.0 | 0.00 | 0.00 | 0.00 | **0.00** | — |

Worked:
- Dilution: stock volume = c × 10.0 ÷ 0.50; 0.20 → 4.0 cm³ stock + 6.0 cm³ water (the worked example); 0.10 → 2.0 + 8.0; 0.30 → 6.0 + 4.0; 0.40 → 8.0 + 2.0; 0.50 → 10.0 + 0.0.
- Means: (0.21 + 0.22 + 0.20) ÷ 3 = 0.63 ÷ 3 = **0.21**; (0.40 + 0.41 + 0.39) = 1.20 ÷ 3 = **0.40** (= SHARED-SPECS fixed value; the 0.20 row is identical in conditions and repeats to 3.2.1's 30 °C row); 1.59 ÷ 3 = **0.53**; 1.77 ÷ 3 = **0.59**; 1.83 ÷ 3 = **0.61**.
- Worked tangent (Beat 7), 0.20 mol dm⁻³ run 1 (3.1.3's standard curve): triangle along the tangent line from (0 s, 0 cm³) to (30 s, 12.0 cm³): **12.0 ÷ 30 = 0.40 cm³ s⁻¹** (= run 1).
- Ceiling: 10.0 cm³ × c mol dm⁻³ = mmol H₂O₂; ÷ 2 = mmol O₂; × 24 cm³ per mmol at room temperature and pressure: 0.10 → 1.0 mmol → 0.5 mmol O₂ → **12 cm³**; 0.20 → **24**; 0.30 → **36**; 0.40 → **48**; 0.50 → **60 cm³**. The progress curves in Beat 7 each level off below their own ceiling.
- Description used in Beats 8 and 13: from 0.10 to 0.30 the mean rises 0.21 → 0.53 (+0.32); from 0.30 to 0.40 +0.06; from 0.40 to 0.50 +0.02, inside the repeat spread (0.40 row 0.58–0.60; 0.50 row 0.60–0.62). "Levels off", not "has reached Vmax".

### Dataset C — inhibitor X concentration, ONPG colorimeter assay (Beats 11, 12)

Conditions (3.1.4's assay; SHARED-SPECS §5): per cuvette 1.0 cm³ buffer solution, pH 7.0 + 0.5 cm³ ONPG solution + 0.5 cm³ inhibitor X solution (water for the zero row; the inhibitor-solvent volume is fixed) + 0.5 cm³ β-galactosidase solution, added last = **2.5 cm³**; all at 25 °C; blue filter; for each concentration of X, the colorimeter zeroed on that concentration's own blank (the same mixture with 0.5 cm³ water in place of enzyme), so readings are blank-corrected; lid fitted, inverted twice; t = 0 at mixing; absorbance at 0, 30 … 180 s, the 0 s value recorded as 0.00 (mixture at mixing). X solutions 0.0, 2.5, 5.0, 7.5, 10.0 mmol dm⁻³, made by proportional dilution of a 10.0 mmol dm⁻³ stock with water (e.g. 5.0 = 5.0 cm³ stock + 5.0 cm³ water); final concentration in the cuvette = X solution × 0.5 ÷ 2.5. One run per concentration is shown.

| X in cuvette / mmol dm⁻³ | X solution added / mmol dm⁻³ | A at 0 s | 30 s | 60 s | 90 s | 120 s | 150 s | 180 s | Initial rate of change of absorbance, 0–60 s / s⁻¹ |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0.0 | 0.0 | 0.00 | 0.12 | 0.24 | 0.35 | 0.45 | 0.53 | 0.60 | **0.0040** |
| 0.5 | 2.5 | 0.00 | 0.09 | 0.18 | 0.26 | 0.34 | 0.41 | 0.47 | **0.0030** |
| 1.0 | 5.0 | 0.00 | 0.07 | 0.14 | 0.21 | 0.27 | 0.33 | 0.38 | **0.0023** |
| 1.5 | 7.5 | 0.00 | 0.06 | 0.12 | 0.18 | 0.23 | 0.28 | 0.33 | **0.0020** |
| 2.0 | 10.0 | 0.00 | 0.05 | 0.10 | 0.15 | 0.19 | 0.23 | 0.27 | **0.0017** |

Worked:
- Final X: 2.5 × 0.5 ÷ 2.5 = **0.5**; 5.0 → **1.0**; 7.5 → **1.5**; 10.0 → **2.0 mmol dm⁻³**.
- Straight initial section: in every row A(30) = A(60) ÷ 2, so 0–30 and 30–60 s have equal gradients.
- Initial rates (2 s.f.): 0.24 ÷ 60 = **0.0040**; 0.18 ÷ 60 = **0.0030**; 0.14 ÷ 60 = 0.00233 → **0.0023**; 0.12 ÷ 60 = **0.0020**; 0.10 ÷ 60 = 0.00167 → **0.0017** s⁻¹.
- The zero row is 3.1.4's demonstration series exactly (0.00, 0.12, 0.24, 0.35, 0.45, 0.53, 0.60 → 0.0040 s⁻¹). Every reading lies within the 3.1.4 calibration range (0–0.80). No conversion is made in this lesson; if one were needed, 3.1.4's calibration (concentration = absorbance ÷ 0.0080 per µmol dm⁻³) is applied to each reading before the gradient is taken (the zero row would give 0.50 µmol dm⁻³ s⁻¹, as in 3.1.4; not shown here).
- Later increments never exceed earlier ones in any row (each curve bends downward after its straight start).
- The 120 s reading of the zero row, **0.45**, is the single reading ringed as an amount (Beat 11).
- Description: the initial rate falls as X increases; each further 0.5 mmol dm⁻³ lowers it by less (0.0010, 0.0007, 0.0003, 0.0003 s⁻¹, from the rounded values). Not narrated; no inhibition class is read from this shape.

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.20) | Beat(s) | How |
|---|---|---|
| 3.2.1 investigate … enzyme concentration | 4, 5, 6 | amylase proportional dilution (worked), fixed starch and final volume, pH 7.0 buffer, 30 °C, timed iodine sampling every 30 s, common endpoint, three repeats, mean, 1/mean endpoint time (relative rate proxy), resolution one interval, water control |
| 3.2.1 explain … enzyme concentration | 5, 6, 12 | more active sites available → more successful collisions → more complexes per unit time; proportional while substrate is in excess |
| 3.2.1 investigate … substrate concentration | 7, 8 | peroxide proportional dilution (worked), gas syringe, 30 °C, tangent at t = 0, three repeats, means; why not times to finish |
| 3.2.1 explain … substrate concentration | 9, 10, 12, 13 | free active sites → more complexes per unit time; saturation; substrate limiting then enzyme limiting; complexes still form and break at the maximum rate; x-axis concentration, not time |
| 3.2.1 investigate … inhibitor concentration | 11 | labelled adaptation of S21/51; ONPG colorimeter assay; five concentrations including zero; own blank per concentration; initial gradient 0–60 s; a single reading is an amount |
| 3.2.1 explain … inhibitor concentration | 11, 12 | more X bound → fewer active sites available or working → fewer complexes per unit time → lower rate; mechanism handed to 3.2.2-3 |
| 3.2.1 temperature; pH (using buffer solutions) | 2 (recall only) | taught in 3.2.1; recalled by label (the sentence and the `denatured` state); handed off |
| "investigate and explain" | 5, 9, 11, 13 | each factor measured, then explained with the one sentence |

### Mark-scheme and examiner points → beats

| Source | Point | Beat |
|---|---|---|
| S21/22 Q5(c), MS p.17 | "I 'rate of reaction is fast and then slows down' needs ref. to rate of reaction, describing 'gradient of curve' is not enough"; description + two explanation points (weights summary, paraphrased) | 8 (E38), 13 (exam close, reject card) |
| June 2023 ER, Paper 31 Q1(b)(i), p.26 | "the majority of candidates described…"; "Many candidates … stated that no more enzyme-substrate complexes could be formed or that the reaction had stopped…" | 10 (E39) |
| S23/31 Q1(b)(i), MS p.7 | the two interval points (20–40; 60–140) | 10 (E39) |
| S21/22 Q5(d)(i), MS p.18 | "I more ESC form needs idea of increased rate"; "more enzyme-substrate complexes per unit time" | 6 (E40) |
| Learner Guide p.19 (specimen P2 Q3(c)) | "Mark point two is not awarded here…" | 6 (E40) |
| Specimen P2 Q3(c), MS p.13 | "take samples at timed intervals ; A regular intervals" | 6 (E40, small type) |
| S23/34 Q1(c)(iii), MS p.7 | "more enzyme molecules so more active sites available ; more successful collisions ; more enzyme-substrate complexes form ;" | 5, 6 (boundary tab), 13 |
| Specimen P1 Q13, key A | control: enzyme replaced by water | 4, 13 |
| S21/51 (weights S-E) | varied substrate with and without X; our inhibitor series is its labelled adaptation | 11 |
| EXAMINER-INSIGHT §5 (LG p.19 row) | the annotated example still reached full marks through other points (paraphrase, no quotation) | 6 (small type) |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, never, only, no, nothing, cannot, because, needs, must* was reread, including necessity wording.
- *Every tube gets the same five cubic centimetres of starch suspension*, *Every thirty seconds* (4); *Every run has the same five cubic centimetres of yeast suspension* (7): statements of our design.
- *Each time is known only to within one sampling interval* (5): true of the method as specified.
- *every tube breaks down about the same starch by its endpoint* (6): same starting starch and same endpoint criterion; "about" is spoken.
- *the one idea you need* (2): the scope of the recall, not a claim about the topic.
- *a longer queue gets nobody through faster, yet every till is still serving* (9): inside the analogy, converted at once into the credited sentence.
- *nearly every active site is occupied at any moment* (9): "nearly"; no claim that every site is occupied at every instant.
- *all busy, still serving* (10): the analogy; *all active sites are saturated* (10): the S23/31 mark scheme's own words, used in its correction.
- *no longer turns blue-black* (4), *no longer fits the active site* (2), *with no X* (11), *no time axis* and *gives no time* (6, 8): descriptions of the particular result, model, row, graph or card.
- *then only to zero point six one* (8): the data.
- *Under all three* (12): the three factors of this lesson.
- *because more sounds like faster* (6): the reason is offered as a possibility (*can feel like a rate*); *because the intervals were not described as timed or regular* (6): the Learner Guide's own stated reason, attributed.
- *it needs reference to rate of reaction* (8): the S21/22 Q5(c) ignore line, stated as that scheme's ruling on that question.
- *explaining a higher maximum rate* (6): scopes the S21/22 Q5(d)(i) ruling to its question; the boundary tab shows S23/34's shorter credited wording.
- *High temperature or extreme pH can denature an enzyme* (2): "can".
- No sentence calls a plotted point Vmax, says the reaction stops, says where an inhibitor binds, claims every enzyme's rate is proportional to its concentration, or treats 1/t as an initial rate.

---

## Citations

Every quotation, copied verbatim from the verified file named (whitespace and subscript/superscript typography normalised as in those files).

| Quotation | Source (paper / session / question / page) | Copied from |
|---|---|---|
| 3.2.1 outcome text | Syllabus 2025–2027, p.20 | `SYLLABUS-9700-DETAIL.md` §3.2.1 |
| "investigate and explain" | Syllabus p.20 (outcome 3.2.1) | `SYLLABUS-9700-DETAIL.md` |
| "I 'rate of reaction is fast and then slows down' needs ref. to rate of reaction, describing 'gradient of curve' is not enough" | 9700/22 June 2021 Q5(c), MS p.17 | `TOPIC-PLAN-03-ENZYMES.md` E38; `TOPIC-03-WEIGHTS.md` E38 |
| "However, the majority of candidates described the increase in the rate of reaction as the concentration of lactose increased between 20 mmol dm–3 and 40 mmol dm–3, which gained no credit. … Many candidates correctly explained that the active sites of the enzymes were fully occupied but then stated that no more enzyme-substrate complexes could be formed or that the reaction had stopped so did not gain any credit." | June 2023 examiner report, Paper 31 Q1(b)(i), p.26 | `TOPIC-03-WEIGHTS.md` E39 (the plan's copy omits the opening "However,") |
| "20 mmol dm–3 and 40 mmol dm–3: lactose concentration increases so more enzyme substrate complexes ; 60 mmol dm-3 and 140 mmol dm–3: all active sites are saturated, so maximum rate of reaction is reached ;" | 9700/31 June 2023 Q1(b)(i), MS p.7 | `TOPIC-03-WEIGHTS.md` S-I |
| "I more ESC form needs idea of increased rate" | 9700/22 June 2021 Q5(d)(i), MS p.18 | `TOPIC-PLAN-03-ENZYMES.md` E40; `TOPIC-03-WEIGHTS.md` ledger and E40 |
| "more enzyme-substrate complexes per unit time" | 9700/22 June 2021 Q5(d)(i), MS p.18 | `TOPIC-03-WEIGHTS.md` ledger row s21_22 Q5(d)(i) |
| "Mark point two is not awarded here as the intervals are not described as 'timed' or 'regular' intervals. If the candidate had said that the samples are taken every minute, then the mark would have been awarded." | Learner Guide (2022), p.19, annotating specimen Paper 2 Q3(c) | `TOPIC-PLAN-03-ENZYMES.md` E40; `TOPIC-03-WEIGHTS.md` E40 |
| "take samples at timed intervals ; A regular intervals" | Specimen 2022 Paper 2 Q3(c), MS p.13 | `TOPIC-PLAN-03-ENZYMES.md` §3.1.3 |
| "more enzyme molecules so more active sites available ; more successful collisions ; more enzyme-substrate complexes form ;" | 9700/34 June 2023 Q1(c)(iii), MS p.7 | `TOPIC-03-WEIGHTS.md` ledger row s23_34 Q1(c)(iii) |
| (no quotation) specimen P1 Q13, key A: control = enzyme replaced by water | Specimen 2022 Paper 1 Q13, MS p.2 | `TOPIC-03-WEIGHTS.md` S-B and no-hit paragraph |
| (no quotation) S21/51 varied substrate with and without inhibitor X | 9700/51 June 2021 Q1 (weights S-E) | `TOPIC-03-WEIGHTS.md` S-E; plan investigation map |
| (paraphrase) the LG example still reached full marks through other points | Learner Guide p.19 | `EXAMINER-INSIGHT-9700.md` §5 |

Not used: the ER's "60–100" interval wording (the ER passage quoted above names only 20–40; the question and MS interval 60–140 is used on the card); S23/34 Q1(c)(i–ii) (not needed here).

**UNVERIFIED — needed before narration or on-screen use:**
1. `UNVERIFIED — verbatim QP p.12 instruction for S21/22 Q5(c)` (Beat 13 shows only *our framing*, on our catalase graph, and labels it so; the paper's context, cellulose concentration, is from the weights).
2. `UNVERIFIED — the S21/22 Q5(c) MS p.17 marking points other than the ignore line` (Beat 13 shows the weights' summary as paraphrase, not in quotation marks).
3. `UNVERIFIED — verbatim QP instruction for S23/31 Q1(b)(i)` (Beat 10 header is our framing; the intervals come from the MS).
4. `UNVERIFIED — Learner Guide p.28 wording on rate proportional to enzyme concentration / straight line through the origin` (the plan cites it; Beat 5 teaches the idea in our words and quotes nothing).
5. `UNVERIFIED — S21/22 Q5(d)(i) question context beyond "higher Vmax"` (Beat 6 says only "explaining a higher maximum rate", from the weights' ledger row).
6. `UNVERIFIED — S21/51 QP wording for the inhibitor X method` (Beat 11 describes the paper only as the weights and plan do; no wording quoted; its two-minute reading convention is not mentioned).

---

## Word count and runtime

Counted by the validator over the blockquoted narration (silent-read lines excluded; hyphen and en-dash compounds count once; numbers are written as spoken words, so the count reflects speaking time). Seconds = words ÷ 120 × 60.

| Beat | Kind | Words | Seconds |
|---|---|---:|---:|
| 1 Hook and context | teaching | 79 | 39.5 |
| 2 Recall: the sentence from 3.2.1 | teaching | 106 | 53.0 |
| 3 Objectives | teaching | 49 | 24.5 |
| 4 More enzyme: the amylase series | teaching | 112 | 56.0 |
| 5 More enzyme: what the times show | teaching | 110 | 55.0 |
| **6 E40** | **error** | **156** | **78.0** |
| 7 More substrate: initial slopes | teaching | 114 | 57.0 |
| **8 E38** | **error** | **152** | **76.0** |
| 9 Why it levels off | teaching | 111 | 55.5 |
| **10 E39** | **error** | **160** | **80.0** |
| 11 More inhibitor | teaching | 146 | 73.0 |
| 12 Recap | teaching | 81 | 40.5 |
| 13 Exam close | teaching | 91 | 45.5 |
| **Teaching (10 beats)** | | **999** | **8:19.5** |
| **Error (3 beats)** | | **468** | **3:54** |
| **Total (13 beats)** | | **1,467** | **12:13.5** |
| Budget | | 1,050 | 8:45 |

@@LENGTH@@

---

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| Temperature and pH investigations and explanations; the `ph-shifted` state; the press-stud handle | 3.2.1 (the sentence and `denatured` recalled by label in Beat 2) |
| Vmax as a named quantity, Km, the half-Vmax construction, affinity | 3.2.2-3 (small type hand-off in Beat 9) |
| Where an inhibitor binds; competitive and non-competitive classes; their curves | 3.2.2-3 (hand-off in Beat 11; X never classified) |
| Reading progress curves, tangent method and average rate in full; `CatalaseNet`; `Hydrolyse` replay | 3.1.3 (recalled by label; formula tag only) |
| Colorimeter parts, filter choice and calibration in full | 3.1.4 (recalled by label; calibration mentioned in small type only) |
| Algebraic Michaelis–Menten, reciprocal plots, inhibition constants, the shape of the inhibitor-concentration curve | not in the outcome (DO-NOT-ADD) |
| S23/34 Q1(c)(i–ii) average rate (54 g; 5.4 g min⁻¹) | 3.1.3 |
| S21/51's original two-minute reading convention | not presented (plan: not a universal definition of initial rate) |

## Reusable models established here

| Model | For |
|---|---|
| **`RateGraph` `rate-substrate`** (generic *initial rate of reaction* against *substrate concentration*; with our catalase data the unit line *mean initial rate of gas collection / cm³ s⁻¹*; Dataset B means 0.21, 0.40, 0.53, 0.59, 0.61 at 0.10–0.50 mol dm⁻³; region labels; *x-axis: concentration, not time*; no Vmax line) | 3.2.2-3 (its construction overlays; its E38 recall by label) |
| **`RateGraph` `amylase-concentration`** and **`inhibitor-concentration`** | the 3.2.1 notes; 3.2.4 may reuse the 1/t tag |
| **Population views** `pop-enzyme`, `pop-substrate` (saturated loop, *still reacting*), `pop-inhibitor` (generic X token) | 3.2.2-3 may start its inhibitor classes from `pop-inhibitor` by replacing the generic token with its two shapes |
| **The busy-tills handle** and its converted sentence | 3.2.2-3 (the plateau as maximum rate) |
| **Datasets A–C** | the 3.2.1 notes and questions |

## Assets

| Asset | Status | Source |
|---|---|---|
| `EnzymeActiveSiteModel` states; `denatured` motion | reuse | 3.1.1-2; 3.2.1 |
| Population boxes, tallies, generic X token | new, schematic | authored |
| `GasSyringeRig`, `WaterBathRig` (`equilibrate-separate`), `BufferedTubeRig`, `AmylaseIodineSampler` | reuse; add five-concentration racks and extra tiles | 3.1.3; 3.2.1 |
| `ColorimeterModel`, ONPG assay, `absorbance-time` + `straight-initial` | reuse | 3.1.4 |
| `RateGraph` `amylase-concentration`, `rate-substrate`, `inhibitor-concentration`, `lactose-schematic` inset | **new configurations** | authored, our illustrative data |
| Till analogy inset; hook curve and cell with dials | new, schematic | authored |
| E40, E38, E39 cards (composites) and headers (our framings) | new, captioned | authored |
| COMMON MISTAKE panel; reject card; forms surface | shared | existing |
| Photographs, micrographs, Cambridge artwork or figures | none | — |

---

## Validator run

`python3 work/005/validate_storyboard.py storyboards/topic-03/3.2.1b/STORYBOARD.md`

```
(pasted after the run)
```
