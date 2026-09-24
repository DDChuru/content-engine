# 3.2.4 — Trapping the enzyme: immobilised in alginate

**Storyboard, first draft. Cloud run 005, 24 September 2026.** No audio, no code, no render.
Cambridge 9700 syllabus 2025–2027, p.20. Command words **INVESTIGATE** and **STATE**. Budget from `TOPIC-PLAN-03-ENZYMES.md` §3.2.4 and `TOPIC-03-WEIGHTS.md`: **6:00, 12 beats, 0 error beats** (practical / statement; 0 of 15 sampled papers carry a marked demand; W20/21 Q2(b) uses alginate-immobilised lipase as context only; supplementary specimen Paper 2 Q3(b) sets the advantages). Runtime estimated at **120 words per minute of final video**: **788 words, 6:34, 0:34 over** (see *Word count and runtime*).

> **3.2.4** investigate the difference in activity between an enzyme immobilised in alginate and the same enzyme free in solution, and state the advantages of using immobilised enzymes

(Syllabus p.20. Practical materials list, p.58: "materials for preparing immobilised enzymes: calcium chloride, sodium alginate".)

Authorities read: `work/005/SHARED-SPECS.md` (in full; binding); `VIDEO-STRUCTURE.md` (in full: the full shape, handling physically possible, colour changes only through real colours, animate the mechanism, narration register, lists woven not enumerated, say the typical thing as typical); `CONTENT-ARCHITECTURE.md`; `SYLLABUS-9700-DETAIL.md` (3 Enzymes outcomes, p.20; materials list, p.58); `TOPIC-PLAN-03-ENZYMES.md` (§3.2.4 in full; §3.2.3's product-inhibition sentence; rate vocabulary; lesson list; shared-model table including `AlginateBeadRig`; trap table including the immobilisation row; R2-6); `TOPIC-03-WEIGHTS.md` (3.2.4 rationale; ledger row w20_21 Q2(b)(ii); supplementary row S-A); the cleared `3.1.1-2` and `3.2.2-3` storyboards with their `CHECK.md` and `CHECK-R2.md`; `cloud-inputs/005/evidence/` EXAMINER-INSIGHT-9700.md, GATE-CRITERIA-9700-03-ENZYMES.md, COMPLEXITY-CALIBRATION-9700-BIOLOGY.md §3 (DO-NOT-ADD: no industrial case-study catalogue), PASTPAPERS-INVENTORY.md. No question paper or mark scheme PDF was opened for this draft: every quotation below is copied from the verified files named in *Citations*.

**Build position:** last of the seven Topic 3 lessons. **Models used:** `EnzymeActiveSiteModel` (published by 3.1.1-2; states `rest-lk`, `bound`, `products` by id), `RateGraph` (published by 3.1.3; SHARED-SPECS configuration *amylase free vs bead → 1/endpoint time / s⁻¹*, bars), `AmylaseIodineSampler`, `WaterBathRig`, `BufferedTubeRig` (3.1.3). **Model published here:** `AlginateBeadRig` (none downstream in this topic). `Hydrolyse` is **not replayed** in this lesson (see the models section).

---

## The causal spine

Two things carry the lesson, in the syllabus's words: an **investigation** of the difference in activity between an enzyme **immobilised in alginate** and **the same enzyme free in solution**, and a **statement** of the advantages of using immobilised enzymes.

> **Amylase mixed with sodium alginate solution and dripped into calcium chloride solution forms calcium alginate beads with the enzyme trapped inside. Starch has to diffuse into a bead to reach the trapped enzyme. Compared with an equal measured volume of the same amylase stock kept free in solution, under comparable conditions and read by the same timed iodine sampling, the beads may give a different 1/t; in our run the rate proxy is lower. Diffusion into the bead can lower the measured rate, but equal starting input is not equal retained active enzyme, so enzyme lost during bead formation and rinsing could lower it too; this comparison alone does not separate the two, and a lower rate is not guaranteed. Trapped enzyme is easily separated from the product, so the product is not contaminated with enzyme and the enzyme can be re-used; a column of beads lets the process run continuously; immobilisation can improve operational stability over a range of temperature and pH; and in a flow-through arrangement that removes product from the enzyme, product inhibition can be reduced. Immobilisation alone does not continuously remove product from a closed batch.**

**What the mark schemes credit, quoted:** [Specimen 2022 Paper 2 Q3(b)(ii), MS p.12] "products and enzyme kept separated / AW ; product removed immediately ;". [Specimen 2022 Paper 2 Q3(b)(iii), MS p.12] "inert / unreactive / cannot be digested by lactase / AW ; non-toxic ; insoluble ; long shelf-life ;". [W20/21 Q2(b), QP p.6, context only, no separate mark] "Lipase was immobilised in alginate beads". Both specimen quotations are copied from `TOPIC-PLAN-03-ENZYMES.md` §3.2.4; the specimen **question** wording is not in the verified files and is not quoted (`UNVERIFIED`, see *Citations*). The plan records: "No fixed-sample marking point tests the comparison or the advantages directly; the specimen and Learner Guide (p18) set the content." So the spine states the advantages at "state" strength in the plan's words, and the investigation is taught as a demonstration plan with honest inference.

**The handle:** *a trap you can lift out.* The enzyme is caught in a bead the way something is caught in a net: the reaction still reaches it, and you can lift the whole net out afterwards. Converted at once, in Beat 10: *the enzyme is easily separated from the product, so the product is not contaminated with enzyme and the enzyme can be re-used.* The handle is never the exam answer; on screen it is a strap-line only, and the drawing is labelled with the biological names.

**Typicality rules applied:**
- "Can", never "will", for every effect of immobilisation: entrapment **can** reduce the measured rate; immobilisation **can** improve operational stability; a flow that removes product **can** reduce product inhibition. Neither a lower rate nor a wider operating range is promised (plan §3.2.4 and trap table).
- The comparison is stated as **equal nominal starting input**, not equal retained active enzyme (plan R2-6). The lower bead rate in our data is not attributed solely to diffusion.
- Product removal is attributed to the **flow** through a column, not to the beads: "Immobilisation alone does not continuously remove product from a closed batch" (plan §3.2.4) is carried into Beat 9.
- Product inhibition is introduced conditionally (*where an enzyme is slowed by its own product*); no enzyme is named as product-inhibited, and no feedback pathway is taught (plan §3.2.3).
- The iodine endpoint is the loss of blue-black; the remaining colour is the iodine's own yellow-brown; no "colourless" (SHARED-SPECS §5).
- 1/t is a relative rate proxy with units s⁻¹; no initial rate is inferred from by-eye swatches (SHARED-SPECS §4–5).
- No industrial case study, no other immobilisation method (plan scope ceiling; calibration §3 DO-NOT-ADD).

**Error-beat list:** **none** (plan: "no immobilisation-specific error beat has been selected; the absence of an allocated beat is not an absence of evidence"). No COMMON MISTAKE or EXAM CONTRAST beat. Beat 12 closes with **one reject card**, captioned *our wording contrast; not an examiner-reported error*.

---

## The models, specified once

**`AlginateBeadRig` (published here).** Labelled apparatus, labels as SVG text nodes, each part **named where it sits**. Caption on the rig: *our chosen quantities; illustrative*. States, each addressable by id:

- **`mix`**: on the bench, a 25 cm³ beaker holding **2.0 cm³ amylase solution** (measured by graduated pipette from the stock bottle, labelled **amylase solution (stock)**) and **2.0 cm³ sodium alginate solution, 2%** (labelled); a glass rod stirs until the mixture is even. The mixture is drawn as a pale, clear liquid (no invented colour).
- **`syringe-fill`**: a 5 cm³ plastic **syringe with no needle** (label **syringe (no needle)**); its tip dips into the mixture and the plunger is drawn back smoothly; the liquid level in the barrel rises as the beaker's level falls (surfaces level).
- **`drip`**: a 100 cm³ beaker of **calcium chloride solution, 1.5%** (label) on the bench. The syringe is held **upright**, tip **about 10 cm above the surface** (fixed height, small type *keep the height the same*), never touching the liquid. The plunger is pressed gently; a drop swells at the tip, detaches and **falls vertically**; drops fall one at a time at a steady interval. On entry each drop becomes a sphere and sinks; **bead formation is MOTION**: a thin gel shell forms at the drop's surface on contact and thickens inwards over ~1 s, the drop's outline changing from liquid to a translucent gel sphere (no colour change). Label on the first bead: **calcium alginate bead**; inset at the first contact: *calcium ions link the alginate chains → gel* (schematic chain lines cross-linked by small dots labelled *Ca²⁺*; not a molecular structure). Drip continues until the syringe is empty; a residue in the syringe tip is shown and tagged *not all of the mixture reaches the beads*.
- **`harden`**: the beaker with its settled beads beside a timer set to **10 min** (label *leave to harden: 10 min*).
- **`strain`**: the beaker is lifted and tilted so its **mouth is below its base (≈120° from upright)**; the stream leaves the lip and lands inside a **tea strainer** held over a waste beaker; the beads stay in the strainer mesh; the liquid level in the tilted beaker stays horizontal and falls as it pours.
- **`rinse`**: a **wash bottle of distilled water** (label) squirts over the beads in the strainer, the nozzle above the beads; rinse water collects in a separate beaker labelled **rinse water** (kept, for the optional check).
- **`count`**: beads tipped from the strainer onto a **white tile**; a counter beside them ticks as each is touched: **80 beads**; tag *a counted batch*.
- **`bead-xsec`**: a cut-away of one bead (caption *schematic; not to scale*): the alginate mesh as a loose net of lines with water between; three `EnzymeActiveSiteModel` miniatures in `rest-lk` held in the mesh (caption *schematic; not a real protein shape*); starch outlines (short beaded chains, the 3.1.1-2 starch beads) outside the bead. **Diffusion is MOTION**: starch outlines wander in through the mesh gaps, one reaches a miniature, which enters `bound` (label **enzyme–substrate complex**) and then `products` (two short outlines labelled **products**), which wander back out. Schematic states only; no atom-resolved reaction.
- **`tubes`**: three boiling tubes in a rack in the **water bath at 30 °C** (thermometer in the bath; `WaterBathRig`), labelled **A: free amylase**, **B: amylase beads**, **C: enzyme-free beads (control)**; beside them three tubes of **starch suspension, 1%, in pH 7.0 buffer solution** (`BufferedTubeRig` label *buffer solution, pH 7.0*), 10.0 cm³ each, equilibrating separately; a timer showing **10 min** of equilibration. Tube A holds **2.0 cm³ amylase stock + 2.0 cm³ buffer solution, pH 7.0**; tube B holds the **80 amylase beads**; tube C holds **80 beads made from 2.0 cm³ buffer solution + 2.0 cm³ sodium alginate solution**. Starch is poured in by tilting its tube mouth-down into the receiving tube (≈120°, stream from the lip into the mouth). Each tube is timed **from its own mixing**, started 10 s apart so each is sampled on its own 30 s schedule (small type). A glass rod stirs each tube gently before each sample; the dropper draws **liquid from above the beads**, never beads.
- **`reuse`**: the tube B beads poured into the strainer (mouth-down pour), rinsed with the wash bottle, returned to a clean tube; 10.0 cm³ fresh starch suspension (equilibrated 10 min at 30 °C) poured in; tube labelled **B2: same beads, second use**.
- **`column`**: a vertical glass **column** clamped to a **clamp stand**, a small mesh plug at its base holding a **bed of beads**; above it a **reservoir** (separating funnel, tap part-open) of **starch suspension**; below the column's outlet tap a **collecting beaker** labelled **product solution**. Flow is MOTION: drops fall from the reservoir onto the bed, liquid percolates down between the beads (the beads stay put), and drips from the outlet into the beaker. Small type: *schematic; how much starch is broken down depends on the flow rate*. Close-up variant: one bead in the flow, product outlines swept downstream away from the bead.

**`EnzymeActiveSiteModel` (published by 3.1.1-2; used here inside a bead).** States by id: `rest-lk`, `bound`, `products`; caption *schematic; not a real protein shape*. Substrate approach, seating and product release are MOTION per the 3.1.1-2 motion contract. **Product-inhibition sketch (Beat 9):** product outlines linger around the miniature and one briefly occupies the enzyme so an arriving substrate outline rocks and waits; tag *product inhibition; how the product binds is not specified here*; when the flow sweeps the products away, a substrate seats. Reversible, non-covalent; no inhibitor class is named and no new inhibitor state is created (the 3.2.2-3 inhibitor states are not used).

**`AmylaseIodineSampler` (published by 3.1.3; SHARED-SPECS §5, followed exactly).** White **spotting tile**, one equal drop of **iodine solution** in each well, one row of wells per tube. At t = 0 and then **every 30 s**, a dropper takes one drop of the tube's liquid and releases it **above** the next well (never touching the iodine); the dropper is rinsed between samples. Each well switches **in one frame** (no RGB tween) between **blue-black** (starch present; may be drawn less intense as starch falls) and **yellow-brown** (iodine's own colour; starch no longer detected). No purple, grey or "colourless". **Endpoint time t** = time of the first sample that no longer gives blue-black; resolution one sampling interval.

**`RateGraph`, configuration *amylase free vs bead* (published by 3.1.3; SHARED-SPECS §5).** Bars, not a curve: y-axis **1/endpoint time / s⁻¹**, bars **free amylase** and **amylase beads**, values from the dataset; the control shown as a labelled gap *no endpoint within 600 s*. Each bar carries a thin bracket for the one-interval resolution (free 0.0067–0.0083 s⁻¹; beads 0.0030–0.0033 s⁻¹). Caption *our illustrative data*. Never labelled "initial rate".

**Chemistry on screen.** No covalent bond is drawn changing in this lesson. The amylase reaction inside the bead is shown only by the schematic `bound` → `products` states of `EnzymeActiveSiteModel`; **`Hydrolyse` is not replayed** (SHARED-SPECS §5: *replay only if shown*; plan §3.2.4: the `Hydrolyse` replay *if shown*). The calcium–alginate cross-link inset is a schematic of gel formation, with no bond lines or atom labels, captioned *schematic*.

---

## Beat by beat

Beat windows in the headings are provisional (words ÷ 120 wpm, cumulative); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch beyond 30 words without a cue.

### BEAT 1 · Hook and context · 0:00–0:30
**Narration:**
> Ever wondered how you would get an enzyme back once it is dissolved in a reaction? Industry uses enzymes to make products, but a dissolved enzyme ends up spread through the product: hard to recover for the next batch, and now part of what you made. So trap it in something you can lift out: a bead of alginate gel.

**Visual action:**
1. At *get an enzyme back*, a beaker of reaction mixture with `EnzymeActiveSiteModel` miniatures (`rest-lk`) dispersed through it, caption *schematic; not a real protein shape*; a question mark hovers over an empty hand.
2. At *Industry uses enzymes*, a plain flask labelled **product** fills from the beaker (schematic; no plant, no brand); at *spread through the product*, the miniatures drift evenly through the flask's liquid.
3. At *hard to recover for the next batch*, a second empty flask labelled **next batch** appears; a tea strainer dips into the product flask and lifts out with nothing in it; at *part of what you made*, the miniatures in the product flask are ringed, tag *enzyme in the product*.
4. At *trap it in something you can lift out*, the miniatures gather into one translucent sphere; at *a bead of alginate gel*, label **alginate bead**; the strainer lifts the bead out cleanly. Dissolve to the objectives surface.

**On-screen text:** the hook question; *product*; *next batch*; *enzyme in the product*; *alginate bead*.

---

### BEAT 2 · What you will be able to do · 0:30–0:49
**Narration:**
> By the end you will be able to make enzyme beads in alginate; compare the trapped enzyme's activity with the same enzyme free in solution, and say honestly what that shows; and state the advantages of immobilised enzymes.

**Visual action:** Own styled surface, distinct background, no diagram. At *make enzyme beads in alginate*, line 1; at *compare the trapped enzyme's activity*, line 2; at *state the advantages*, line 3.
1. **MAKE** enzyme beads in calcium alginate
2. **INVESTIGATE** trapped versus free: the same enzyme, compared fairly, and what the result can and cannot show
3. **STATE** the advantages of using immobilised enzymes

Small type: *syllabus 3.2.4, p.20: "investigate", "state".*

---

### BEAT 3 · Making the beads · 0:49–1:31
**Narration:**
> Mix amylase solution with sodium alginate solution and draw it into a syringe, with no needle. Hold the syringe above a beaker of calcium chloride solution and press gently, so drops fall one at a time. As each drop lands, calcium ions link the alginate chains and it sets into a calcium alginate bead, with the enzyme trapped inside. Leave them ten minutes to harden, strain them, and rinse with distilled water. Keep drop size, height and rinsing the same, and count the beads.

**Visual action:**
1. At *Mix amylase solution*, `AlginateBeadRig` `mix`: the pipette delivers 2.0 cm³ from the **amylase solution (stock)** bottle into the small beaker; at *sodium alginate solution*, 2.0 cm³ **sodium alginate solution, 2%** is added and the glass rod stirs; at *draw it into a syringe*, `syringe-fill`; at *with no needle*, the label **syringe (no needle)** lands on the tip.
2. At *Hold the syringe above*, `drip`: the **calcium chloride solution, 1.5%** beaker is labelled and the syringe is held upright, tip about 10 cm above the surface, tag *fixed height*; at *press gently*, the plunger moves in slightly and the first drop swells and falls vertically; at *one at a time*, a steady train of separate drops.
3. At *As each drop lands*, the first drop enters and becomes a sphere (MOTION: the gel shell forms at its surface and thickens inwards); at *calcium ions link the alginate chains*, the schematic cross-link inset opens beside it; at *a calcium alginate bead*, label **calcium alginate bead**; at *with the enzyme trapped inside*, a cut-away window on the bead shows two enzyme miniatures inside, then closes.
4. At *ten minutes to harden*, `harden` with the timer at **10 min**; at *strain them*, `strain` (mouth-down pour into the tea strainer); at *rinse with distilled water*, `rinse`, the rinse water collecting in its labelled beaker.
5. At *Keep drop size*, a checklist lands beside the rig: *same syringe · same height · same pressing · same hardening time · same rinse*, and the syringe-tip residue is tagged *not all of the mixture reaches the beads*; at *count the beads*, `count`: the counter ticks to **80**, tag *a counted batch*.

**On-screen text:** part labels; *fixed height*; *calcium alginate bead*; the checklist; *80 beads*. Small type: *materials list, syllabus p.58: calcium chloride, sodium alginate.*

---

### BEAT 4 · Inside a bead · 1:31–1:56
**Narration:**
> Inside, a bead is a mesh of alginate chains with water in the spaces. The mesh holds the amylase, but starch can move through the water, so starch has to diffuse in before it reaches an active site; then the enzyme–substrate complex forms, and the products diffuse back out.

**Visual action:**
1. At *Inside, a bead is a mesh*, camera zooms into one bead to `bead-xsec`; at *alginate chains*, the mesh lines brighten, label **alginate gel**; at *water in the spaces*, the gaps tint faintly, label **water**.
2. At *The mesh holds the amylase*, the three `rest-lk` miniatures are ringed in the mesh, label **amylase (trapped)**; at *starch can move through the water*, starch outlines outside the bead begin to wander toward it.
3. At *has to diffuse in*, starch outlines move in through the mesh gaps (MOTION, random paths, net inward); at *reaches an active site*, one reaches a miniature's cleft; at *the enzyme–substrate complex forms*, `bound`, label **enzyme–substrate complex**; at *the products diffuse back out*, `products`, and the two product outlines wander out through the mesh; the inward and outward paths are then traced as one looping arrow labelled *in by diffusion · out by diffusion*.

**On-screen text:** *alginate gel*; *water*; *amylase (trapped)*; *enzyme–substrate complex*; *products*; captions *schematic; not to scale*, *schematic; not a real protein shape*.

---

### BEAT 5 · A fair comparison · 1:56–2:30
**Narration:**
> Now the comparison. Take two equal volumes of the same amylase stock: one goes into a counted batch of eighty beads, the other stays free, made up with buffer to the same volume. Each tube gets the same starch suspension at pH seven, in the water bath at thirty degrees, stirred and sampled the same way. A third tube holds beads made without amylase: the enzyme-free bead control.

**Visual action:**
1. At *Now the comparison*, the rig slides aside and `tubes` builds; at *two equal volumes of the same amylase stock*, two pipettes each draw 2.0 cm³ from the one stock bottle, side by side, tag *equal nominal input*.
2. At *a counted batch of eighty beads*, one pipette's volume follows the Beat 3 route in miniature into the 80 beads, which drop into tube **B: amylase beads**; at *the other stays free*, the second volume goes into tube **A: free amylase**; at *made up with buffer to the same volume*, 2.0 cm³ **buffer solution, pH 7.0** is added to A, tag *4.0 cm³ each side*.
3. At *the same starch suspension*, the three 10.0 cm³ starch tubes are labelled *starch suspension, 1%, pH 7.0 buffer; 10.0 cm³ each*; at *in the water bath at thirty degrees*, all six tubes sit in the rack in the bath, thermometer reading **30 °C**, timer showing **10 min** of separate equilibration; at *stirred and sampled the same way*, a glass rod and a dropper appear beside each tube.
4. At *A third tube holds beads made without amylase*, tube **C** fills with 80 beads made the Beat 3 way from buffer solution (in place of amylase) and sodium alginate solution; at *the enzyme-free bead control*, label **C: enzyme-free beads (control)**; a checklist lands: *same stock · equal measured volume · same starch volume and concentration · pH 7.0 buffer · 30 °C · same stirring and sampling · enzyme-free bead control*.

**On-screen text:** tube labels; *equal nominal input*; the checklist. Small type: *equal volumes of stock going in; not a measurement of the active enzyme retained in the beads.*

---

### BEAT 6 · Reading it with iodine · 2:30–3:15
**Narration:**
> From the start and every thirty seconds, a drop from each tube goes onto iodine on a spotting tile. Blue-black means starch is still there; yellow-brown, iodine's own colour, means it is no longer detected. The free enzyme loses the blue-black at one hundred and fifty seconds, the beads at three hundred and thirty, and the control is still blue-black at ten minutes, so the gel alone did not clear it. One over each time is a relative rate, not an initial rate, and the beads' is a little under half.

**Visual action:**
1. At *From the start and every thirty seconds*, the three tubes pour-mix in turn (mouth-down pours) and three timers start; `AmylaseIodineSampler` builds: one spotting-tile row per tube, labelled **A**, **B**, **C**, recall tag *recall: 3.1.3*; at *a drop from each tube*, the dropper draws liquid from above the beads in B and releases a drop above the first well, never touching it; at *onto iodine on a spotting tile*, the sampling runs on at 30 s intervals across all three rows, one well per sample.
2. At *Blue-black means starch is still there*, the early wells switch in one frame to blue-black and one is ringed, label **blue-black: starch present**; at *yellow-brown, iodine's own colour*, a well of plain iodine beside the tile is ringed, label **yellow-brown: iodine's own colour**.
3. At *The free enzyme loses the blue-black*, row A's 150 s well switches in one frame to yellow-brown and is ringed, label **A: t = 150 s**; at *three hundred and thirty*, row B's 330 s well switches in one frame and is ringed, label **B: t = 330 s**.
4. At *the control is still blue-black at ten minutes*, row C runs to 600 s with every well blue-black, label **C: no endpoint within 600 s**; at *the gel alone did not clear it*, row C is bracketed, tag *bead material alone: no loss of blue-black in 600 s*.
5. At *One over each time*, the results table (see *Datasets*) lands beside the tile with the 1/t column filling: **1/150 = 0.0067 s⁻¹**, **1/330 = 0.0030 s⁻¹**; at *not an initial rate*, a small tag *relative rate proxy; not an initial rate*; at *a little under half*, `RateGraph` *amylase free vs bead* draws its two bars with resolution brackets and the ratio **0.0030 ÷ 0.0067 ≈ 0.45**, caption *our illustrative data*.

**On-screen text:** row labels; the two colour labels; *t = 150 s*, *t = 330 s*, *no endpoint within 600 s*; the table; axis **1/endpoint time / s⁻¹**; small type *resolution: one sampling interval (30 s)*.

---

### BEAT 7 · What this comparison can and cannot show · 3:15–3:55
**Narration:**
> Why was it slower here? The rate depends on how often substrate molecules meet a working active site and form enzyme–substrate complexes per unit time, and on whether the active sites stay functional. Diffusion into the bead can make those meetings less frequent. But equal amylase in is not equal working amylase in the beads: some can be lost into the calcium chloride or the rinse water. This comparison cannot separate the two. And a lower rate is not guaranteed.

**Visual action:**
1. At *Why was it slower here?*, the two bars from Beat 6 hold at left, the bead bar ringed with a question mark beside it.
2. At *The rate depends on how often*, the canonical sentence builds on a recall card at top right, tagged *recall: 3.2.1*; at *a working active site*, the phrase is underlined; at *whether the active sites stay functional*, that clause is underlined.
3. At *Diffusion into the bead*, the Beat 4 cut-away returns small: starch outlines wander in slowly and only some reach a cleft in the time shown; tag *fewer meetings per unit time*; the phrase *how often … meet* on the card pulses.
4. At *equal amylase in is not equal working amylase*, the two 2.0 cm³ pipettes from Beat 5 reappear above a balance-style comparison: **in: 2.0 cm³ = 2.0 cm³**, **working in the end: ?**; at *lost into the calcium chloride or the rinse water*, a few enzyme miniatures drift out of freshly formed beads into the calcium chloride beaker and into the rinse-water beaker, tag *possible loss during bead making and rinsing*; the syringe-tip residue from Beat 3 pulses; the phrase *working active site* on the card pulses.
5. At *This comparison cannot separate the two*, the diffusion inset and the loss inset sit side by side joined by a bracket labelled *both lower the measured rate; this comparison alone does not tell them apart*.
6. As the bracket holds, a small optional panel: a drop of the rinse water and a drop of the used calcium chloride solution each added to a tube of starch suspension and sampled onto iodine (wells left blank, labelled *result not shown*), tag *a sensible extra check*.
7. At *a lower rate is not guaranteed*, a tag lands on the bead bar: *this run; not a rule*.

**On-screen text:** the canonical sentence (verbatim from SHARED-SPECS §4); *equal nominal input ≠ equal retained active enzyme*; *a sensible extra check*; *this run; not a rule*.

---

### BEAT 8 · Getting it back: a separate run · 3:55–4:24
**Narration:**
> In a separate run, strain the beads out, rinse them and add fresh starch, something you cannot easily do with free enzyme. The starch is broken down again, with the endpoint at three hundred and sixty seconds: one sampling interval from the first run, too close to show a change. It shows re-use, separately from the comparison.

**Visual action:**
1. At *In a separate run*, a divider slides in labelled **separate run: re-use**; the Beat 6 table dims behind it; at *strain the beads out*, `reuse`: tube B's contents pour mouth-down into the strainer and the 80 beads stay in the mesh; at *rinse them*, the wash bottle rinses them; at *add fresh starch*, the beads go into clean tube **B2** and 10.0 cm³ fresh, equilibrated starch suspension is poured in; a new tile row labelled **B2** begins at 0 s.
2. At *cannot easily do with free enzyme*, a small inset: tube A's liquid is tipped toward a strainer and passes straight through, tag *free enzyme passes through*.
3. At *The starch is broken down again*, row B2's wells stay blue-black to 330 s; at *three hundred and sixty seconds*, the 360 s well switches in one frame to yellow-brown and is ringed, label **B2: t = 360 s**, **1/360 = 0.0028 s⁻¹**.
4. At *one sampling interval from the first run*, rows B and B2 are aligned with a 30 s bracket between their endpoints; at *too close to show a change*, tag *within one sampling interval*.
5. At *It shows re-use*, the divider label brightens; at *separately from the comparison*, a line separates the B2 table from the comparison table.

**On-screen text:** *separate run: re-use*; *free enzyme passes through*; *B2: t = 360 s*; *within one sampling interval*.

---

### BEAT 9 · The advantages, and the column · 4:24–5:04
**Narration:**
> That is the first advantage: the enzyme is easily separated from the product, so the product is not contaminated with enzyme and the enzyme can be re-used. Packed into a column, the beads let starch suspension run through continuously, with product coming out at the bottom. Where an enzyme is slowed by its own product, called product inhibition, that flow carries product away, so the inhibition can be reduced; beads sitting in a closed tube do not keep removing product.

**Visual action:**
1. At *That is the first advantage*, the strainer with its beads above a beaker of product liquid, tag **advantage**; at *easily separated from the product*, the beaker (product) and the strainer (beads) pull apart; at *not contaminated with enzyme*, the beaker is tagged *product, enzyme kept out*; at *the enzyme can be re-used*, the B2 row from Beat 8 flashes small.
2. At *Packed into a column*, `column` builds part by part with labels: **clamp stand**, **column**, **bed of beads**, **reservoir**, **collecting beaker**; at *run through continuously*, flow runs (MOTION: drops from the reservoir, percolation through the bed, drips from the outlet), the beads staying put, and the reservoir is topped up and the collecting beaker swapped for an empty one while the flow continues, tag **continuous**; at *product coming out at the bottom*, the collecting beaker's label **product solution** brightens.
3. At *slowed by its own product*, the close-up of one bead in a closed tube: product outlines linger around a miniature and one briefly occupies it while an arriving substrate outline waits; tag *product inhibition; how the product binds is not specified here*, recall tag *recall: 3.2.2-3 (reversible inhibitors)*; at *that flow carries product away*, a second close-up, of a bead in the column, appears beside it: product outlines are swept downstream and a substrate seats (`bound`); at *the inhibition can be reduced*, tag *can be reduced*.
4. At *beads sitting in a closed tube*, the closed-tube close-up is ringed with tag *product stays in the same liquid*; the column close-up carries *the flow removes product*.

**On-screen text:** part labels; *advantage*; *continuous*; *product inhibition*; *can be reduced*; *product stays in the same liquid*; small type on the column *schematic; how much starch is broken down depends on the flow rate*.

---

### BEAT 10 · The statements you write · 5:04–5:35
**Narration:**
> One more advantage needs care: immobilisation can improve operational stability over a range of temperature and pH. Can, not will. Written as statements: the enzyme is easily separated from the product, so the product is not contaminated and the enzyme can be re-used; a column lets the process run continuously, and its flow can reduce product inhibition; and immobilisation can improve stability.

**Visual action:**
1. At *One more advantage needs care*, a small panel with a thermometer and a pH strip beside a bead; at *can improve operational stability*, label **can improve operational stability over a range of temperature and pH**; at *Can, not will*, the word *can* is underlined, tag *not guaranteed; compare measured activities*.
2. At *Written as statements*, the sentence surface opens beneath the column and the strainer; the handle strap-line *a trap you can lift out* shows once above it, small; at *easily separated from the product*, clause 1 lands and the strainer pulses; at *the enzyme can be re-used*, the B2 row pulses.
3. At *a column lets the process run continuously*, clause 2 lands and the column flow pulses; at *its flow can reduce product inhibition*, clause 3 lands and the column close-up pulses; at *immobilisation can improve stability*, clause 4 lands and the thermometer/pH panel pulses.

**On-screen text:** the statements, building into one: **The enzyme is easily separated from the product, so the product is not contaminated with enzyme and the enzyme can be re-used; a column of beads lets the process run continuously; in a flow-through arrangement that removes product from the enzyme, product inhibition can be reduced; and immobilisation can improve operational stability over a range of temperature and pH.** Small type: *specimen Paper 2 Q3(b)(ii), MS p.12: "products and enzyme kept separated / AW ; product removed immediately ;"*.

---

### BEAT 11 · What I told you, back on the apparatus · 5:35–5:59
**Narration:**
> Back on the apparatus. The syringe drips amylase and alginate into calcium chloride, and starch reaches the trapped enzyme by diffusion. Here the beads gave the lower rate, but equal input is not equal working enzyme. The strained beads worked again, and the column runs continuously, carrying product away.

**Visual action:** **No new slide.** The screen returns to the layout built through the lesson: the bead rig at left (`drip`), the three tubes and their tile rows at centre with the two bars, the strainer and the column at right. Static. Key points fade in in place: at *The syringe drips amylase and alginate*, the syringe and falling drops brighten; at *the trapped enzyme*, the bead cut-away window opens on one bead with label *enzyme trapped*; at *by diffusion*, the in/out arrow from Beat 4 brightens on it; at *the beads gave the lower rate*, the bead bar brightens with *this run*; at *equal input is not equal working enzyme*, the tag *equal nominal input ≠ equal retained active enzyme* brightens between tubes A and B; at *The strained beads worked again*, row B2 brightens; at *the column runs continuously*, the column flow brightens with *continuous*; at *carrying product away*, the column close-up brightens with *can reduce product inhibition*.

---

### BEAT 12 · How it is asked, and the bead you can lift out · 5:59–6:34
**Narration:**
> In the papers we sampled, immobilisation appeared as context, not as a marked question: a November 2020 question used lipase immobilised in alginate beads. The specimen paper's mark scheme credits products and enzyme kept separated, and product removed immediately. On the card: entrapment can reduce the measured rate, so compare the measured activities. And the enzyme you could not get back? Trap it in a bead, and lift it out.

**Visual action:**
1. At *In the papers we sampled*, a forms surface, plain; at *appeared as context, not as a marked question*, row 1: **context** · small type *0 of 15 sampled papers with a marked demand (Topic 3 weights)*; at *lipase immobilised in alginate beads*, the quoted context sentence lands: *W20/21 Q2(b), QP p.6: "Lipase was immobilised in alginate beads" (context; no separate mark)*.
2. At *The specimen paper's mark scheme credits*, row 2: **why immobilise** · citation tab, exact: **Specimen 2022 Paper 2 Q3(b)(ii), MS p.12: "products and enzyme kept separated / AW ; product removed immediately ;"**; small type *question wording not reproduced (UNVERIFIED)*; at *product removed immediately*, the Beat 9 column close-up flashes small beside the tab, small type *our link to the flow-through column; the question's own arrangement is UNVERIFIED*.
3. Directly after the row-2 tab (no separate cue; held on screen, not narrated), row 3: **the immobilising material** · citation tab, exact: **Specimen 2022 Paper 2 Q3(b)(iii), MS p.12: "inert / unreactive / cannot be digested by lactase / AW ; non-toxic ; insoluble ; long shelf-life ;"**; small type *question wording not reproduced (UNVERIFIED)*.
4. At *On the card*, the reject card lands, struck through by hand: **✗ Immobilised enzymes always work more slowly than free enzymes.** / **✓ Entrapment can reduce the measured rate, for example when substrate has to diffuse into the bead; compare the measured activities.** Caption in small type: *our wording contrast; not an examiner-reported error (plan trap list)*. At *compare the measured activities*, the ✓ line brightens and the Beat 6 bars flash small beside it.
5. At *the enzyme you could not get back*, the Beat 1 product flask returns small; at *Trap it in a bead*, the strainer lifts the beads out of the product; at *lift it out*, the product flask is tagged *enzyme kept out*. Final frame held 2 s: the forms surface and card at left, the strainer of beads above the product at right. No slogan.

**On-screen text:** the three rows with citations; the reject card and its caption.

---

## Datasets

All values are **our illustrative data** (labelled so on screen); quantities are our chosen conditions. Rate vocabulary per SHARED-SPECS §4: every rate in this lesson is **1/t**, a relative rate proxy in s⁻¹, where t is the time to the loss-of-blue-black endpoint. No initial rate and no substrate-concentration curve is derived.

### Dataset 1 — bead preparation (Beat 3; `AlginateBeadRig`)

| Item | Amylase beads (tube B) | Enzyme-free beads (tube C) | Derived |
|---|---|---|---|
| Amylase solution (stock) | 2.0 cm³ | 0 | — |
| Buffer solution, pH 7.0 (in place of enzyme) | 0 | 2.0 cm³ | — |
| Sodium alginate solution, 2% | 2.0 cm³ | 2.0 cm³ | mixture 2.0 + 2.0 = **4.0 cm³** each |
| Dripped into calcium chloride solution, 1.5% | from 5 cm³ syringe, no needle, tip ≈10 cm above surface | same | — |
| Hardening time | 10 min | 10 min | — |
| Rinse | wash bottle, distilled water, same volume for both batches | same | rinse water kept for the optional check |
| Beads counted | **80** | **80** | nominal mixture per bead 4.0 ÷ 80 = **0.050 cm³**; nominal amylase stock per bead 2.0 ÷ 80 = **0.025 cm³** (nominal: a residue stays in the syringe tip, and enzyme may be lost to the calcium chloride and rinse) |

### Dataset 2 — the comparison: free versus beads, with the enzyme-free bead control (Beats 5–7; ONE results table)

Conditions: each tube's enzyme side equilibrated separately from its starch for 10 min in the water bath at 30 °C; 10.0 cm³ starch suspension, 1%, in pH 7.0 buffer solution poured in at t = 0 (each tube timed from its own mixing, starts staggered by 10 s); gentle stirring with a glass rod before each sample; one drop of liquid (from above the beads in B and C) onto one equal drop of iodine solution per well at 0 s and every 30 s. **B** = blue-black; **Y** = yellow-brown.

| Tube | Enzyme side | Total volume | 0 | 30 | 60 | 90 | 120 | 150 | 180 | 210 | 240 | 270 | 300 | 330 | 360–600 s | Endpoint t / s | 1/t / s⁻¹ | Endpoint window (resolution) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---:|---:|---|
| A free amylase | 2.0 cm³ stock + 2.0 cm³ buffer | 4.0 + 10.0 = **14.0 cm³** | B | B | B | B | B | **Y** | Y | Y | Y | Y | Y | Y | (stopped after endpoint) | **150** | 1 ÷ 150 = 0.00667 → **0.0067** | 120 < t ≤ 150 s → 1/t from 1 ÷ 150 = 0.0067 to 1 ÷ 120 = 0.0083 |
| B amylase beads | 80 beads (from 2.0 cm³ stock + 2.0 cm³ alginate) | ≈4.0 + 10.0 = **≈14.0 cm³** (bead volume nominal) | B | B | B | B | B | B | B | B | B | B | B | **Y** | (stopped after endpoint) | **330** | 1 ÷ 330 = 0.00303 → **0.0030** | 300 < t ≤ 330 s → 1/t from 1 ÷ 330 = 0.0030 to 1 ÷ 300 = 0.0033 |
| C enzyme-free beads (control) | 80 beads (from 2.0 cm³ buffer + 2.0 cm³ alginate) | ≈14.0 cm³ | B | B | B | B | B | B | B | B | B | B | B | B | B at every sample to 600 s | **none within 600 s** | not calculated (no endpoint; any rate proxy would be below 1 ÷ 600 = 0.0017) | — |

Derived comparisons: bead ÷ free = 0.00303 ÷ 0.00667 = 150 ÷ 330 = **0.4545 ≈ 0.45** (*a little under half*, Beat 6). The two resolution windows (0.0067–0.0083 and 0.0030–0.0033 s⁻¹) do not overlap, so the difference is larger than the sampling resolution in this run. Starting starch concentration: 10.0 cm³ × 1% in 14.0 cm³ total = **0.71%** overall in A; in B the surrounding liquid starts at the 1% of the added suspension until starch diffuses into the bead water, so the starting concentrations are **comparable, not identical** (stated as a limitation; not narrated). One run per preparation is shown; a full investigation repeats each preparation and compares means (the axis would then read *1/mean endpoint time / s⁻¹*). The free-tube endpoint matches 3.1.3's example value (150 s → 0.0067 s⁻¹) by our choice; the conditions of that example are 3.1.3's own.

### Dataset 3 — re-use, a separate run (Beat 8)

| Tube | Beads | Starch | 0 … 330 s | 360 s | Endpoint t / s | 1/t / s⁻¹ | Comparison with first use |
|---|---|---|---|---|---:|---:|---|
| B2 same beads, second use | the 80 tube-B beads, strained and rinsed with distilled water | fresh 10.0 cm³ starch suspension, 1%, pH 7.0 buffer, equilibrated 10 min at 30 °C | B at every sample | **Y** | **360** | 1 ÷ 360 = 0.00278 → **0.0028** | first use 300 < t ≤ 330 s; second use 330 < t ≤ 360 s: adjacent windows, endpoints one interval (30 s) apart, so this run alone does not show a change in activity |

Not part of Dataset 2's comparison and not plotted on its `RateGraph`.

### Optional check (Beat 7; no data shown)

A drop of the kept rinse water, and a drop of the used calcium chloride solution, each added to 10.0 cm³ starch suspension at 30 °C and sampled onto iodine every 30 s. Loss of blue-black would indicate amylase activity lost from the beads during formation or rinsing. The wells are drawn blank and labelled *result not shown*; no result is invented.

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.20) | Beat(s) | How |
|---|---|---|
| investigate … an enzyme immobilised in alginate | 3, 4, 11 | `AlginateBeadRig`: sodium alginate + amylase dripped into calcium chloride (materials, p.58); bead formation and diffusion as motion |
| … and the same enzyme free in solution | 5, 11 | equal measured volumes of the same stock; free tube made up with buffer to the same volume |
| the difference in activity | 5, 6, 7, 11 | timed iodine sampling; endpoint t and 1/t side by side in one table; enzyme-free bead control; honest inference |
| state the advantages of using immobilised enzymes | 8, 9, 10, 12 | easy separation → product not contaminated, enzyme re-used (with a re-use run); continuous column; can improve operational stability; flow-through product removal can reduce product inhibition |
| "investigate" | 3–8 | one complete investigation shown as a demonstration plan with its controls and limits |
| "state" | 10 | statements at the plan's strength, built clause by clause |

### Plan (§3.2.4) binding points → beats

| Plan point | Beat |
|---|---|
| Equal measured aliquots of the same stock; counted batch; standardised bead size, preparation and rinsing | 3, 5 |
| Comparable final aqueous volume, starting starch concentration, buffered pH, maintained temperature, mixing and sampling | 5; Dataset 2 (starting-concentration limitation stated) |
| Enzyme-free bead control | 5, 6 |
| Same stated regular sampling times into iodine; time to the same loss-of-blue-black endpoint; compare 1/t; no initial rate from by-eye colour | 6; Dataset 2 |
| Report the measured activities side by side | 6; Dataset 2 (one table) |
| Equal nominal input is not equal retained active enzyme; not every difference attributed to diffusion; no claim of equal retained activity | 5 (small type), 7, 11 |
| Entrapment can reduce the measured rate by limiting substrate diffusion; the result is not promised | 4, 7, 12 |
| Re-use as a separate run, kept distinct from the comparison | 8; Dataset 3 |
| Four advantages at "state" strength, including the column and flow-through product removal; immobilisation alone does not continuously remove product from a closed batch | 9, 10 |
| No other methods, no industrial case studies | throughout; Beat 1 context is generic |

### Mark-scheme and examiner points → beats

| Source | Point | Beat |
|---|---|---|
| Specimen 2022 P2 Q3(b)(ii), MS p.12 | "products and enzyme kept separated / AW ; product removed immediately ;" | 9, 10 (small type), 12 |
| Specimen 2022 P2 Q3(b)(iii), MS p.12 | "inert / unreactive / cannot be digested by lactase / AW ; non-toxic ; insoluble ; long shelf-life ;" | 12 |
| W20/21 Q2(b), QP p.6 | "Lipase was immobilised in alginate beads" (context; no separate mark) | 12 |
| Specimen 2022 P2 Q3(b), product inhibition (weights S-A, paraphrase only) | product inhibition as the reason product removal matters | 9 (conditional; no enzyme named) |
| Topic 3 weights, 3.2.4 row | 0 of 15 sampled papers; context only in W20/21 Q2(b) | 12 |
| Syllabus p.58 materials list | calcium chloride, sodium alginate | 3 |

### Absolutes sweep (own)

Every narrated sentence containing *every, all, always, never, only, no, not, nothing, cannot, because, needs, must, has to* was reread, with the plan's three immobilisation traps (always slower; always more stable; beads remove product) checked first. Narration is quoted below in italics (our words, not sources).
- *a dissolved enzyme ends up spread through the product: hard to recover for the next batch* (Beat 1): about a dissolved enzyme in a batch; *hard*, not impossible. *Industry uses enzymes to make products*: generic context, no case study.
- *with no needle* (Beat 3): an instruction for this rig. *Keep drop size, height and rinsing the same*: procedure.
- *The mesh holds the amylase, but starch can move through the water, so starch has to diffuse in before it reaches an active site* (Beat 4): true of enzyme inside the bead, which is all the drawing shows; Beat 7 then says enzyme can be lost, so *holds* is not a claim of perfect retention.
- *the gel alone did not clear it* (Beat 6): about the control, in this run, within 600 s.
- *not an initial rate* (Beat 6): SHARED-SPECS §4 definition of 1/t.
- *Why was it slower here?* (Beat 7): *here* bounds it to this run. *equal amylase in is not equal working amylase in the beads*: the plan's R2-6 statement; *some can be lost* is a possibility, not a measured loss. *This comparison cannot separate the two*: true of this design (the plan says equal input "does not by itself prove equal retained active enzyme after bead formation and rinsing"). *A lower rate is not guaranteed*: the plan's wording.
- *something you cannot easily do with free enzyme* (Beat 8): *easily*; other recovery methods are not taught and not denied. *too close to show a change*: about this run's resolution.
- *the enzyme is easily separated from the product, so the product is not contaminated with enzyme* (Beats 9, 10): the plan's advantage wording at state strength; Beat 7's possible loss happens during making and rinsing, before use, and is not contradicted.
- *Where an enzyme is slowed by its own product* (Beat 9): conditional; no claim that amylase, or every enzyme, is product-inhibited. *beads sitting in a closed tube do not keep removing product*: the plan's "Immobilisation alone does not continuously remove product from a closed batch".
- *can improve operational stability … Can, not will* (Beat 10): the plan's *can*; no "always more stable", no wider operating range promised.
- *starch reaches the trapped enzyme by diffusion* (Beat 11): no *must*; the model draws enzyme inside the bead.
- *immobilisation appeared as context, not as a marked question* (Beat 12): the weights' 0 of 15 sampled papers, with W20/21 Q2(b) as context; *In the papers we sampled* bounds it. The specimen credit is quoted, not upgraded; no claim that full marks need either point.
- The reject card's wrong line (with *always*) is written only; the narration speaks only the correct version.
- No sentence says immobilised enzymes are always slower or always more stable, that beads remove product, that immobilisation widens the operating range, or that the rate difference is caused by diffusion alone.

---

## Citations

Every quotation, with its source location and the verified file it was copied from.

| Quotation | Source location | Copied from |
|---|---|---|
| "investigate the difference in activity between an enzyme immobilised in alginate and the same enzyme free in solution, and state the advantages of using immobilised enzymes" | Syllabus 2025–2027, 3.2.4, p.20 | `SYLLABUS-9700-DETAIL.md` (3.2.4); also `TOPIC-PLAN-03-ENZYMES.md` §3.2.4 |
| "materials for preparing immobilised enzymes: calcium chloride, sodium alginate" | Syllabus, List of materials, p.58 | `SYLLABUS-9700-DETAIL.md` (Materials list, p.58) |
| "investigate", "state" (command words, objectives small type) | Syllabus 3.2.4, p.20 | `SYLLABUS-9700-DETAIL.md` |
| "products and enzyme kept separated / AW ; product removed immediately ;" | Specimen 2022 Paper 2 Q3(b)(ii), MS p.12 | `TOPIC-PLAN-03-ENZYMES.md` §3.2.4 (Exact mark-scheme keys) |
| "inert / unreactive / cannot be digested by lactase / AW ; non-toxic ; insoluble ; long shelf-life ;" | Specimen 2022 Paper 2 Q3(b)(iii), MS p.12 | `TOPIC-PLAN-03-ENZYMES.md` §3.2.4 |
| "Lipase was immobilised in alginate beads" | W20/21 Q2(b), QP p.6 (context; no separate mark) | `TOPIC-PLAN-03-ENZYMES.md` §3.2.4 |
| "No fixed-sample marking point tests the comparison or the advantages directly; the specimen and Learner Guide (p18) set the content." (spine only, not on screen) | Plan §3.2.4 (our planning document, not a Cambridge source) | `TOPIC-PLAN-03-ENZYMES.md` |
| "no immobilisation-specific error beat has been selected; the absence of an allocated beat is not an absence of evidence" (spine only) | Plan §3.2.4 | `TOPIC-PLAN-03-ENZYMES.md` |
| "Immobilisation alone does not continuously remove product from a closed batch" (spine / typicality only) | Plan §3.2.4 | `TOPIC-PLAN-03-ENZYMES.md` |
| The canonical explanation sentence (Beat 7, on screen and spoken) | Topic-wide grammar | `work/005/SHARED-SPECS.md` §4 (our wording, not a Cambridge quotation; shown without quotation marks) |

**UNVERIFIED items:**
- `UNVERIFIED — the question wording of Specimen 2022 Paper 2 Q3(b)(ii) and (iii) (QP pp.8–9)`: not in the verified files. The storyboard shows only the mark-scheme points and labels the rows by our own headings (*why immobilise*; *the immobilising material*), each with small type *question wording not reproduced (UNVERIFIED)*. No question text is quoted or implied.
- `UNVERIFIED — the Learner Guide p.18 treatment of immobilised enzymes`: referenced by the plan as setting content; no wording is quoted and none is used.
- `UNVERIFIED — the wider wording of W20/21 Q2(b) beyond the single context sentence`: not needed; only the plan's quoted sentence is shown.

No examiner-report quotation is used: none in the verified files concerns immobilisation.

---

## Word count and runtime

Counted by the validator over the blockquoted narration (this lesson has no silent reads); seconds = words ÷ 120 × 60. Final cue times come from the measured audio.

| Beat | Title | Words | Seconds | Window |
|---|---|---:|---:|---|
| 1 | Hook and context | 60 | 30.0 | 0:00–0:30 |
| 2 | What you will be able to do | 38 | 19.0 | 0:30–0:49 |
| 3 | Making the beads | 84 | 42.0 | 0:49–1:31 |
| 4 | Inside a bead | 49 | 24.5 | 1:31–1:56 |
| 5 | A fair comparison | 68 | 34.0 | 1:56–2:30 |
| 6 | Reading it with iodine | 91 | 45.5 | 2:30–3:15 |
| 7 | What this comparison can and cannot show | 80 | 40.0 | 3:15–3:55 |
| 8 | Getting it back: a separate run | 57 | 28.5 | 3:55–4:24 |
| 9 | The advantages, and the column | 80 | 40.0 | 4:24–5:04 |
| 10 | The statements you write | 62 | 31.0 | 5:04–5:35 |
| 11 | What I told you, back on the apparatus | 49 | 24.5 | 5:35–5:59 |
| 12 | How it is asked, and the bead you can lift out | 70 | 35.0 | 5:59–6:34 |
| | **Total** | **788** | **394** | **6:34** |

| | |
|---|---|
| Narration words | **788** |
| Runtime at 120 words per minute of final video | **6:34** |
| Budget (plan §3.2.4; no error allowance) | 6:00 (~720 words) |
| Beats | 12 (12 teaching, 0 error) |

**Length, honestly:** **788 words, 6:34, which is 0:34 (68 words) over** the 6:00 budget. The first draft of this storyboard ran to 938 words (7:49); it was cut by 150 words before this count, without removing any binding element (standardised bead making; equal nominal input; enzyme-free bead control; the one-table comparison; the honest-inference beat; the separate re-use run; the column; the four advantages; the in-place recap; the evidence-based close). Where the extra sits: Beats 6 and 7 (the reading and the honest inference, 171 words together) carry the plan's binding caveats, and Beat 3 names apparatus and handling for a student with no bench experience. **Cut list if the checker wants the envelope met, in order (teaching beats only; ~70 words ≈ 0:35):**
1. Beat 10: shorten the spoken statements to the stability sentence plus *Written as statements, on screen* and let the four clauses land silently in a 6 s anchored read (~40 words; the statements stay on screen in full).
2. Beat 12: the hook callback *And the enzyme you could not get back? Trap it in a bead, and lift it out.* (16 words; the final frame still shows the strainer lifting the beads out of the product).
3. Beat 1: *hard to recover for the next batch, and now part of what you made* → *hard to recover, and now part of what you made* (4 words).
4. Beat 6: *yellow-brown, iodine's own colour, means it is no longer detected* → *yellow-brown means it is no longer detected*, the colour name kept as an on-screen label (3 words).
5. Beat 3: *Keep drop size, height and rinsing the same* kept; *with no needle* → on-screen label only (3 words).
Never speed the narration.

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| Other immobilisation methods (adsorption, covalent bonding, cross-linking), industrial case studies (lactose-free milk, HFCS) | not in the outcome (plan scope ceiling; calibration §3 DO-NOT-ADD) |
| Atom-resolved amylase hydrolysis (`Hydrolyse`) | 3.1.3 specifies it; not replayed here |
| The measurement method itself: why 1/t, endpoint resolution, initial versus average rate | 3.1.3 (recalled by tag) |
| Effects of temperature and pH on activity; denaturation | 3.2.1 (the stability advantage is stated, not demonstrated) |
| Inhibitor mechanisms, inhibition classes, feedback pathways | 3.2.2-3; product inhibition here is conditional and mechanism-free |
| Results of the optional rinse-water check | not invented; the check is described only |
| Repeats and means for the comparison | noted in Dataset 2 small print; a single run per preparation is shown to keep the SHARED-SPECS axis label |

---

## Reusable models

| Model | For |
|---|---|
| **`AlginateBeadRig`** (`mix`, `syringe-fill`, `drip` with gel-shell motion, `harden`, `strain`, `rinse`, `count`, `bead-xsec` with diffusion motion, `tubes`, `reuse`, `column` with flow motion) | none downstream in Topic 3; the 3.2.4 notes |
| **`RateGraph` *amylase free vs bead*** bars with resolution brackets | the 3.2.4 notes |
| **The statements** (Beat 10) | the notes' model answer for "state the advantages" |

---

## Assets

| Asset | Status | Source |
|---|---|---|
| `AlginateBeadRig` SVG with named parts and states; gel-shell, diffusion and column-flow motions | **new build** | authored |
| `EnzymeActiveSiteModel` miniatures (`rest-lk`, `bound`, `products`) | reuse | 3.1.1-2 |
| `AmylaseIodineSampler` (tile rows A, B, C, B2) | reuse | 3.1.3 |
| `WaterBathRig`, `BufferedTubeRig` | reuse | 3.1.3 |
| `RateGraph` *amylase free vs bead* | reuse / configure | 3.1.3 |
| Recall card with the canonical sentence | reuse | 3.2.1 |
| Forms surface; reject card | shared with Topics 1–2 | existing |
| Reproduced mark-scheme points; W20/21 context sentence | typographic, verbatim, cited; no Cambridge artwork | plan quotations |
| Micrographs, photographs, generated images | none | — |

---

## Validator run

`python3 work/005/validate_storyboard.py storyboards/topic-03/3.2.4/STORYBOARD.md` — exact, unique, in-order cues; 30-word gap check; words ÷ 120. Quotation check `python3 work/005/check_quotes.py storyboards/topic-03/3.2.4/STORYBOARD.md`: quotes checked 17, not found 0.

```
beat  words  cues maxgap  status
   1     60     7     12  ok
   2     38     3     19  ok
   3     84    16     11  ok
   4     49     9      8  ok
   5     68    10     11  ok
   6     91    12     15  ok
   7     80     9     14  ok
   8     57    11     10  ok
   9     80    11     11  ok
  10     62     9     12  ok
  11     49     8     12  ok
  12     70    10     13  ok
TOTAL words 788  cues 115  runtime at 120 wpm 6:34.0  beats 12  failing beats 0
```
