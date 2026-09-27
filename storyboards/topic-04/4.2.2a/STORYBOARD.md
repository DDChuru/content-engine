# 4.2.2a — Investigating diffusion and osmosis: Visking tubing and agar

**Storyboard, first draft, revised for the round-one check. Cloud run 006, 27 September 2026.** No audio, no code, no render. Folder `storyboards/topic-04/4.2.2a/`. The first of two linked lessons on outcome 4.2.2; this lesson owns the **non-living materials** (Visking tubing for diffusion and for osmosis; agar for diffusion); plant tissue (beetroot, red onion) is handed off to 4.2.2b. It stands alone (own hook, context, objectives, recap and exam close).
Cambridge 9700 syllabus 2025–2027, p.21. Command word **INVESTIGATE**. Budget from `TOPIC-PLAN-04-MEMBRANES.md` (§4.2.2, lesson list, words-and-runtime table) and `TOPIC-04-WEIGHTS.md` (4.2.2 row, 17:00 across both halves): **4.2.2a 9:30 = teaching base 9:30 (about 1,140 words-equivalent) + no error allowance; 13 teaching beats, 0 error beats**; delivered here as **13 beats (13 teaching + 0 error)**. 4.2.2 as a whole: 1 of 5 cited Paper 2 blocks, 1 overlapping agar-diffusion mark (S21/22 Q4(c)). Runtime estimated at **120 words per minute of final video** (words ÷ 120).

> **4.2.2** investigate simple diffusion and osmosis using plant tissue and non-living materials, including dialysis (Visking) tubing and agar

(syllabus p.21; explicit depth qualifier: "including" makes both named materials compulsory. This lesson teaches simple diffusion × non-living and osmosis × non-living; the two plant-tissue combinations are 4.2.2b's.)

**Authorities read, in full:** `work/006/SHARED-SPECS.md` (binding); `plan/topic-04/TOPIC-PLAN-04-MEMBRANES.md` (scope and authoring rules; §4.2.2 including the investigation map, the Visking sampling rules and osmometer rules (MF5), should-fix 4, the MF7 pacing note and the 4.2.2a close; §4.2.1 for the glucose sentence (MF2) and the water-potential sentences (MF3); lesson list; shared-model table; words table; traps table; UNVERIFIED register; PLAN-CHECK RESPONSE); `plan/topic-04/TOPIC-04-WEIGHTS.md` (4.2.2 row and paragraph, ledger row S21/22 Q4(c), practical assessment and mathematical requirements paragraphs, evidence gaps); `cloud-inputs/003/standards/VIDEO-STRUCTURE.md` (all); `CONTENT-ARCHITECTURE.md`; `SYLLABUS-9700-DETAIL.md` (Topic 4 outcomes pp.21–22; apparatus p.57; materials p.58; mathematical requirements p.63); the cleared examples `cloud-inputs/006/examples/3.1.3/STORYBOARD.md` and `3.2.1b/STORYBOARD.md`; `cloud-inputs/003/topic-03/3.1.1-2/CHECK.md` and `3.2.2-3/CHECK.md`; the plan check `cloud-checks/006/plan/CHECK.md` (branch `origin/cloud/006-checks`: MF5 Visking paragraphs, MF7, should-fix 4 and 7, the S21/22 Q4(c) row and the 4.2.2a close sentence); `cloud-inputs/006/evidence/GATE-CRITERIA-9700-04-CELL-MEMBRANES-AND-TRANSPORT.md` (G04: no Visking or agar-dye entry; Q4 block reference only) and `EXAMINER-INSIGHT-9700.md` (no Visking, agar or methylene blue entry). No question paper, mark scheme or examiner report PDF was opened for this draft. No exam wording is quoted in this lesson; S21/22 Q4(c) is used only through the plan check's description. **Round-one revision:** the round-one check (`scratchpad/r1/4.2.2a/CHECK.md`) verified S21/22 QP p.9 / MS p.14 (Table 4.1 cube sides) and a supplementary Visking question, S21/21 Q3(a), QP pp.6–7 / MS p.10, against the PDFs; those findings are used here as described by the check, still without quotation.

**Build position:** seventh of the ten Topic 4 lessons: 4.1.1-2 → 4.1.3 → 4.1.4 → 4.2.1a → 4.2.1b → 4.2.6 → **4.2.2a** → 4.2.2b → 4.2.3-4 → 4.2.5.

**Models used (by name and state id):** `FluidMosaicMembrane` (4.1.1-2; `highlight:intrinsic-carrier`); `TransportProteinSet` (4.2.1a; `carrier-bind` → `carrier-flip` → `carrier-release` → `carrier-reset`); `DiffusionField` (4.2.1a; extended here with states `tubing-pores` and `agar-open`); `WaterPotentialModel` (4.2.1a; base state, rotated and relabelled for the tubing wall; extended here with state `tubing-leak`); `WaterBathRig` (Topic 3, `maintained`, by reference, set as a boiling-water bath).

**Models published here:** `VKTubingRig` (states `diffusion-bag`, `content-tests`, `blank`, `immerse`, `sample`, `benedicts-heat`, `osmometer`, `osmometer-control`); `AgarPlateRig` (states `pour-set`, `well`, `dye`, `spreading`, `measure`); plain graph configurations `meniscus-height` and `blue-zone-diameter`; the `DiffusionField` states `tubing-pores` and `agar-open`; the `WaterPotentialModel` state `tubing-leak`. Everything drawn is a **MODEL** or labelled apparatus; particle insets carry *particles drawn schematically; not to scale; far fewer than real*; every plotted value is *our illustrative data*, except `meniscus-height`, which stays an unnumbered **qualitative schematic; not measurements** until a recorded osmometer run exists (Dataset 2: osmometer evidence pending).

---

## The causal spine

One idea carries the lesson: **you cannot see molecules move, so you build a non-living set-up whose one relevant property you know, start the clock at first contact, and read a visible change at recorded times; then you say what that readout can and cannot show.**

> **Visking tubing is partially permeable by pore size only (pores about 2.5 nm across; no bilayer, no proteins): in the diffusion bag, glucose but not starch is detected in the outside water, because glucose molecules pass the pores by net diffusion down their concentration gradient and starch molecules are too large. In the osmometer, water enters a bag of 1.0 mol dm⁻³ sucrose solution by osmosis, net movement from the higher water potential of the distilled water to the lower water potential of the sucrose solution, and the capillary meniscus can rise: a transient rise is possible; the later behaviour depends on sucrose leakage, bag mechanics and the rising liquid column. In agar, methylene blue spreads by simple diffusion through the water held in the gel, with no membrane involved, and the diameter of the visible blue zone is an operational colour-zone measure, not a diffusion coefficient or a concentration.**

**What the mark schemes credit, quoted:** nothing in this lesson is quoted from a mark scheme. No Visking-tubing question was verified in the original five-paper sample (plan UNVERIFIED register item 4); the round-one check has since found and checked a supplementary one outside that sample, **S21/21 Q3(a), 3 marks, QP pp.6–7 / MS p.10**: explain meniscus-height changes after 20 minutes using net water movement and water-potential differences, in a paper that stipulates tubing impermeable to sucrose (our paraphrase; incidence totals unchanged). The only direct exposure in the original sample is **S21/22 Q4(c), 1 mark, QP p.9 / MS p.14** (plan-check description, verified against the PDF by the round-one check, used as our paraphrase, never in quotation marks): the order of complete indicator change in agar cubes, **A → B → C**; the paper's indicator is **universal indicator, initially blue, red in acid**. It is owned by 4.2.4 and is overlapping agar-diffusion evidence for 4.2.2; the plan check allows it as this lesson's close "as an agar-diffusion application". The syllabus supplies the materials and apparatus: p.57 "dialysis (Visking) tubing, 14 mm width with a pore diameter of approximately 2.5 nm", "capillary tubing", "cork borers", "Petri dishes, plastic or glass, 9 cm diameter"; p.58 "[HH] methylene blue", "technical agar", "[N] – iodine in potassium iodide solution (suitable for starch test)", "[MH] [N] – Benedict’s solution (suitable for qualitative reducing sugar test)". So the spine is what the syllabus requires (investigate, with both named materials) and what the one cited question applies (diffusion into agar followed by a colour change).

**The handle:** *a sieve* for Visking tubing (Beat 7). Converted at once, in the same beat: *Visking tubing is partially permeable; small molecules such as water and glucose pass through its pores, but large starch molecules do not.* The handle is never the exam answer, and the beat immediately bounds it: Visking tubing is not a cell membrane (across a living bilayer, glucose needs a transport protein).

**Framing (why this exists):** living tissue adds transport proteins, respiration and leakage from cut cells to any diffusion or osmosis result; a non-living material isolates one property (pore size; distance through water in a gel), which is why the syllabus asks for Visking tubing and agar alongside plant tissue (Beat 1, recalled Beat 12).

**Typicality rules applied.** "Small molecules such as water and glucose" pass the pores (sucrose also passes, more slowly: Beat 9); starch is "far too big" for this tubing's pores, and outside it "is not detected by iodine". The time trend in the Benedict's colours is bounded to "these illustrative results"; the colours "do not give an exact concentration or total mass transferred". Blanks show the water starts with neither sugar nor starch "as far as these tests can tell". "A transient rise is possible; the later behaviour depends on sucrose leakage, bag mechanics and the rising liquid column"; the rise is never called constant-rate or a permanent equilibrium, and Visking is never said to exclude sucrose (the S21/21 paper's sucrose-impermeable tubing stays local to that paper). Meniscus height tracks the liquid in the capillary, "not all the water entering". The first meniscus reading is taken after immersion and recorded at its actual elapsed time; no pre-immersion mark is presented as a zero-time reading; no numerical meniscus reading is displayed until a recorded run exists. The agar edge is "the outermost point where blue is still visible", an operational definition; dye binding to agar is "some" dye. Distilled water is "close to pure water", the reference at zero water potential. Glucose across a living bilayer uses the plan's MF2 wording ("polar … does not cross the hydrophobic core readily … needs a transport protein"). Visking tubing "sorts molecules by size alone" (plan: partially permeable by pore size only).

**Error beats:** none. The weights register assigns no error to 4.2.2 (no verified examiner diagnosis for Visking tubing, agar, beetroot or onion). "Visking tubing is a cell membrane" and "sucrose cannot pass Visking tubing" are author-flagged traps, handled in the teaching (Beats 3, 7, 9); Beat 13's reject card is a constructed contrast about the model's limits ("Visking tubing has a phospholipid bilayer and transport proteins" struck, corrected in place), captioned as our wording, never with a COMMON MISTAKE or EXAM CONTRAST badge.

---

## The models, specified once

### `VKTubingRig` (published here; 4.2.2b uses a comparison thumbnail)

Identical to SHARED-SPECS §4, with the states and handling below. Every part is named by an SVG text label where it sits.

**Parts (diffusion):**
- **Visking tubing, 14 mm width** (dry, flat roll; label *dialysis (Visking) tubing, 14 mm width; pores about 2.5 nm (syllabus p.57)*), cut to **about 10 cm**; a **beaker of distilled water for soaking**.
- **three matched boiling tubes** in a rack, labelled **tube 1 · sample at 3 min**, **tube 2 · sample at 10 min**, **tube 3 · sample at 20 min**, each holding **33 cm³ distilled water** measured with a labelled **50 cm³ measuring cylinder**; before its bag goes in, a **3.0 cm³ blank aliquot** is removed into a clean labelled sample vial, leaving a nominal **30 cm³** bath at a **marked line (30 cm³)**. One sample is taken from each tube, once, so no tube's volume changes before its own sample (the plan's "separate matched vessels for the different sampling times").
- **three matched Visking bags**, each knotted at the base, tied with **thread** at the top, holding **5.0 cm³ of a mixture of 1% starch suspension and 10% glucose solution**: **20 cm³ of mixture from 10 cm³ of 1% starch suspension and 10 cm³ of 10% glucose solution**, mixed in a small labelled beaker *starch–glucose mixture* before three 5.0 cm³ bag portions are dispensed, with a separate portion retained for the initial tests; a **10 cm³ syringe** for filling (nozzle held above the open end, never touching the inside of the tubing).
- **three stopwatches**, one per tube, labelled 1, 2, 3.
- **clean 1 cm³ graduated pipettes** for sampling (label *sample pipette, 1 cm³*; separate clean equipment for the concentrated contents, the starch control and the outside-water samples), **clean labelled sample vials** (*contents*, *blank 1*, *blank 2*, *blank 3*, *3 min*, *10 min*, *20 min*), **separate clean droppers** for the iodine drops, and a **waste beaker**.
- **white spotting tile** (12 wells) with **one equal drop of iodine solution** in each well used, drawn in iodine's own **yellow-brown**; labels on the wells: *contents*, *starch alone* (not used for iodine), *blank 1*, *blank 2*, *blank 3*, *3 min*, *10 min*, *20 min*.
- **test tubes** in a **labelled rack**, each receiving **2.0 cm³ from a sample vial + 2.0 cm³ Benedict's solution** (Benedict's measured with a second labelled 2 cm³ syringe); **boiling-water bath** (`WaterBathRig` `maintained`, display *boiling, about 100 °C*, thermometer in the water); **test-tube holder**; a **heating stopwatch** labelled *5 min in the bath* (each tube's interval started on its own immersion).
- thermometer in a beaker of the room-temperature water beside the rack: *room temperature 20 °C (recorded)*.

**Handling (specified here; rendered still-frame verification pending):** the tubing soaks in distilled water until soft; a hand ties **a tight overhand knot about 1 cm from one end**; the other end is rubbed between finger and thumb until it opens; the syringe is filled from the mixture beaker (plunger drawn, bubbles tapped out) and its nozzle held **just above the open end, not touching**, the mixture running down inside the bag; the spare tubing is collapsed so no bubble is trapped, and the open end is gathered, twisted and **tied tightly with thread**; the filled bag is held by the thread tail and **rinsed under a gentle stream of distilled water** from a wash bottle into the waste beaker; blotted once on paper towel. Liquid surfaces level in every frame. The bag is lowered into its tube by the thread, the thread tail over the rim. Check the actual filled and sealed bag dimensions, including knots/ties and tapered ends; confirm full submersion without overflow in the chosen boiling tube. The ideal cylindrical estimate alone does not verify that fit. (Lengthening the stock piece, if needed, is a handling repair.) Sampling follows the **sampling contract** below; droppers are squeezed from above, never touching the iodine. Nothing is returned to any tube. No reagent is ever added to a tube holding a bag.

**Sampling contract (round-one check M2):**

> Prepare **20 cm³ of mixture from 10 cm³ of 1% starch suspension and 10 cm³ of 10% glucose solution**. Mix before dispensing three 5.0 cm³ bag portions and retain a separate portion for the initial tests. Each bag therefore still starts with 0.5% starch and 5% glucose. Use separate clean equipment for the concentrated contents, starch control and outside-water samples.
>
> Put **33 cm³ distilled water** into each boiling tube. Before introducing its bag, remove a **3.0 cm³ blank aliquot** into a clean labelled sample vial, leaving a nominal **30 cm³** bath. Transfer **2.0 cm³ from that vial** to the Benedict's tube; use a separate clean dropper to place one drop from the remainder on the iodine tile; discard the rest. No tested liquid or pipette that has touched reagent returns to the vial or diffusion bath.
>
> At each selected elapsed time, withdraw **3.0 cm³** from that tube into a fresh labelled vial, using clean sampling equipment and sampling away from the bag. If using the 1 cm³ pipette, show three separate measured transfers. Record the withdrawal start time; the stopwatch continues through the brief collection interval. Mix the collected aliquot gently, then divide it exactly as for the blank: 2.0 cm³ for Benedict's, a separate drop for iodine, remainder discarded. Each diffusion tube is sampled only once, so this withdrawal does not alter a later measurement from the same tube.

**Benedict's heating (round-one check M2):** Use a labelled rack or individual timed placements so that each tube receives five minutes in the boiling-water bath. Start its heating interval on immersion; remove it after that interval with the holder. Show colour development during heating. The later colour-name cues highlight the already-developed results on white card; they do not start a second colour reaction after removal.

**Safety, at working concentrations (should-fix 7):** an eye-protection pictogram in the corner of every reagent frame (eye protection worn). Syllabus codes are materials-list codes; each working solution's classification follows the identified supplier's current safety information, and the builder's reagent list records the actual iodine working concentration and the Benedict's product/formulation (to be identified; not fixed here). Attached tags: **Benedict's solution (as supplied, for the qualitative test): syllabus materials-list codes MH, N; avoid skin and eye contact; dispose of as the school's hazard card directs**; **iodine in potassium iodide solution (dilute, as used for the starch test): syllabus code N; stains; avoid skin and eye contact**; **boiling-water bath: scald risk; tubes held in a test-tube holder, mouths pointing away from people**; starch suspension, glucose solution and sucrose solution carry no hazard code on the syllabus list (tag *no listed hazard code*).

**States:**
- **`diffusion-bag`**: soak → knot → open → fill (syringe above the opening) → tie → rinse, as in Handling.
- **`content-tests`**: before any bag meets any water, a 3.0 cm³ portion of the retained *starch–glucose mixture* is taken with its own clean equipment into the vial *contents* and divided exactly as for the blank: 2.0 cm³ from the vial goes into a test tube with 2.0 cm³ Benedict's and is heated in the bath (colour develops during heating through the real sequence **blue → green → yellow → orange → brick red**, each step a one-frame switch at the heating stopwatch's time-lapse ticks, no RGB tween); a separate clean dropper places one drop from the remainder on the *contents* iodine well, which **switches in one rendered frame to blue-black**; the rest is discarded. Separately, with its own clean pipette, 2.0 cm³ of the **1% starch suspension alone** is heated with 2.0 cm³ Benedict's: it **stays blue** (tag *interference check: this starch adds no reducing sugar the test detects*).
- **`blank`**: from each tube of 33 cm³, before its bag goes in, a 3.0 cm³ blank aliquot is removed into the clean vial *blank n*, leaving a nominal 30 cm³ at the marked line; 2.0 cm³ from that vial goes to Benedict's (stays **blue** after 5 min in the bath) and a separate clean dropper places one drop from the remainder on the *blank n* well (stays **yellow-brown**, no switch); the rest is discarded. Tag *blank taken before the bag goes in*.
- **`immerse`**: the bag, held by its thread, is lowered into its tube; **on the rendered frame on which the tubing first touches the water, that tube's stopwatch starts**; it runs throughout and is never reset. Any later *t = 0* tag highlights the already-running stopwatch. The three tubes are started one after another, each by its own stopwatch.
- **`sample`**: at each tube's own selected elapsed time (3:00, 10:00, 20:00 on its stopwatch), 3.0 cm³ is withdrawn away from the bag with clean equipment (three separate measured 1 cm³ transfers) into that time's fresh labelled vial, labelled **withdrawal started at 3:00**, **withdrawal started at 10:00**, **withdrawal started at 20:00**; the stopwatch continues through the brief collection interval and is never frozen at one instant; the aliquot is mixed gently and divided exactly as for the blank (2.0 cm³ to that time's Benedict's tube, a separate drop onto that time's iodine well, remainder discarded). Compressed waiting is captioned *waiting time compressed; stopwatches show real elapsed time*; the stopwatch digits run at the time-lapse rate and are never skipped or edited.
- **`benedicts-heat`**: the three sample tubes (with 2.0 cm³ Benedict's each) are carried in a **test-tube holder** into the boiling-water bath's labelled rack, each tube's own **5 min** interval starting on its immersion (heating stopwatch; time-lapse captioned), as in *Benedict's heating* above. Colours develop during heating, only through the real sequence and only as far as each sample goes: **tube 1 (3 min): blue → green**; **tube 2 (10 min): blue → green → yellow**; **tube 3 (20 min): blue → green → yellow → orange**. Each step is a one-frame switch; each tube is removed after its interval with the holder and stood in a rack on white card, where the later colour-name cues highlight the already-developed result (no second colour reaction after removal). Iodine wells **3 min, 10 min, 20 min stay yellow-brown** (no switch). Caption *judged by eye; our illustrative result*.
- **`osmometer`**: a fresh 10 cm soaked length is knotted at one end and filled with **1.0 mol dm⁻³ sucrose solution** (label *sucrose solution, 1.0 mol dm⁻³*) from the syringe held above the opening, filled to the brim; a **glass capillary tube, 1.0 mm internal bore, about 30 cm long** (label *capillary tubing (syllabus p.57)*) is eased into the open end without force (tag *glass: ease in, never force*), and the tubing is **tied tightly with thread wound several turns round tubing and capillary**; sucrose solution stands a short way up the capillary. **No trapped air**: the bag and capillary are inspected against the light, tag *no trapped air*; **leak check**: the tie is held over a paper towel for 30 s, tag *no drip at the tie*. The outside is rinsed. The capillary is **clamped vertically** on a stand, a **mm ruler clamped beside it** (fixed; the same ruler for every reading), zero end at the bottom. A beaker of distilled water is raised beneath until the bag is submerged: vessel capacity labelled separately (*250 cm³ beaker*); the actual water volume, submersion depth and headroom come from the workable setup, submerging the bag without overflow. **On the rendered frame on which the tubing first touches the water, the osmometer stopwatch starts.** A light pencil mark made on the capillary before immersion (if shown) carries the tag **pre-immersion mark: not a reading, not zero**. The meniscus is drawn shifting a little as the bag settles; the **first reading is taken after immersion and recorded at its actual elapsed time** (tag *first reading after immersion: actual elapsed time recorded*; no numerical value displayed). Later readings are taken at stated elapsed times against the same fixed ruler; a **possible** rise is shown as meniscus motion only, with no ruler values, no reading crosses and no timed numerical trace; time-lapse captioned; the clock is real.

> **Osmometer evidence pending.** Obtain a recorded run for the specified tubing, sucrose concentration, capillary bore, bag geometry, external bath and temperature. Record first contact, the actual first post-immersion reading and each later elapsed time; select the usable observation interval from that run. Until those records are available, this rig is a qualitative schematic: no numerical meniscus readings, timed numerical trace or empirical control series is displayed. Do not substitute an invented trace labelled illustrative. Preserve the apparatus, first-contact clock and instruction to take actual readings.

- **`osmometer-control`**: an identical second osmometer beside it, bag filled with **distilled water** instead of sucrose solution (label *control: distilled water in the bag*), its own stopwatch started on its own first-contact frame; no numerical readings displayed (evidence pending); tag *this control cannot reproduce the stretching caused by osmotic inflow*.

### `AgarPlateRig` (published here)

**Parts:** **9 cm Petri dish** with lid (label *Petri dish, 9 cm (syllabus p.57)*) of **plain agar, 2% technical agar in distilled water, no indicator, 5 mm deep** (about 32 cm³ poured), set, on **white millimetre-grid backing with two fixed perpendicular scales** (the white card), visible through the agar; an **8 mm cork borer**; a **mounted needle** to lift the plug; a **dropper** of **methylene blue solution, 0.1% (1 g dm⁻³) in water** (label); a stopwatch reading hours; thermometer tag *room 20 °C (recorded)*.

**Safety (working concentration):** tag **Methylene blue, 0.1% aqueous: stains; avoid ingestion and skin/eye contact; wear eye protection. Working-solution classification follows the identified supplier's current safety information; syllabus [HH] is a materials-list code.**; eye-protection pictogram in the dye frames.

**States:**
- **`pour-set`**: molten agar poured from a conical flask at 120° from upright, mouth below base, stream from the lip into the dish (lid held ajar above), level surface, to 5 mm; lid replaced; agar sets (tag *set, level, 5 mm deep*).
- **`well`**: the dish on the white millimetre-grid backing, lid off; the cork borer is **pushed straight down** into the agar at the centre with the hand on its handle above, fingers clear of the cutting edge, twisted once and withdrawn; the plug is lifted out with the mounted needle, leaving an 8 mm well with a clean wall down to the dish base.
- **`dye`**: the first drop is released from the dropper tip **above the well, never touching the agar**; **on the actual frame that drop first contacts the well, the stopwatch starts** (not reset later; no replacement first drop); the other two drops are added from above. Three nominal 0.05 cm³ drops give about 0.15 cm³, a liquid depth of about **3 mm** in the 5 mm-deep well. Draw a partly filled well, below the agar surface, without overflow; three drops are a nominal volume, not a calibrated measurement. Surface level; lid replaced. The dye in the well is drawn in the dye's blue at full intensity, the surrounding agar colourless.
- **`spreading`**: time-lapse (caption *time-lapse: 24 h compressed; clock shows real elapsed time*); a blue zone widens around the well, **at decreasing intensity towards its edge** (the same methylene blue hue, paler outward; no other hue); the dish is not moved and stays level; lid on.
- **`measure`**: Place the dish on white **millimetre-grid backing with two fixed perpendicular scales**. View from directly above to reduce parallax. At each time, read two full diameters through the well centre along those fixed axes; show their endpoints on the scales before calculating the mean. Do not rotate or move the dish. Keep lighting, observer and visible-edge definition consistent. At each recorded time (0.5, 1, 2, 4, 8, 24 h) the two diameters are thin measuring lines labelled *d₁* and *d₂*, the mean beside them, calculated from the two readings (never a third apparent ruler reading). Edge rule tag, fixed from its first appearance: **edge = outermost point where blue is still visible against the white card; judged the same way each time, same light, same observer**.

### `DiffusionField` states published here (base model 4.2.1a)

- **`tubing-pores`**: a vertical strip of tubing wall (rotated and relabelled: **inside the bag** on the left, **outside water** on the right; label *Visking tubing wall (regenerated cellulose): pores drawn far larger than real*), with evenly spaced pores. Tokens: water (small pale blue circles), glucose (orange hexagons), starch (a **coiled chain of linked orange hexagons**, wider than any pore). Random motion throughout; water and glucose pass through pores both ways; starch chains jostle at the wall and never pass. Crossing counter for glucose: *bag → water: n · water → bag: m*, n running ahead of m; net arrow *net diffusion of glucose*. Caption *particles drawn schematically; not to scale; far fewer than real*.
- **`agar-open`**: no membrane; faint grey mesh lines (agar fibres) through a field of water tokens; dye tokens (**small deep-blue squares**, distinct from the pale blue water circles) start crowded in a well region at left and move randomly; more leave the region than return; a net arrow *net diffusion of dye* points outward; a few dye tokens pause against fibres (tag *some dye binds to the agar*). Same caption.

### `WaterPotentialModel` state `tubing-leak` (base model 4.2.1a)

The 4.2.1a model with its membrane strip drawn vertically and relabelled **Visking tubing wall**; left compartment **distilled water** labelled *initially: higher water potential (less negative); close to 0 (pure water at atmospheric pressure = 0)*; right compartment **inside the bag: sucrose solution, 1.0 mol dm⁻³** labelled *initially: lower water potential (more negative)*; the vertical water-potential scale beside it with **0 kPa (pure water at atmospheric pressure)** at the top and no other numbers. Water tokens cross both ways, the counter showing more left → right; net arrow *net movement of water by osmosis*. **Added in this state:** occasional sucrose tokens (larger orange double-hexagons) pass the pores from right to left, far fewer than the water crossings, tag **sucrose also passes, more slowly**. Captions *schematic; not to scale* and *particles drawn schematically; not to scale; far fewer than real*.

### Plain graph configurations (published here; `RateGraph` axis conventions from Topic 3)

| Configuration | Axes | Used in | Rules |
|---|---|---|---|
| `meniscus-height` | *meniscus height on ruler* against *time after immersion*, **unnumbered** (no scale values, no ticks) until the recorded run exists | Beats 9, 12, 13 | Labelled **qualitative schematic; not measurements**. No reading crosses, no fabricated elapsed-time positions and **no point at t = 0** (no pre-immersion zero); a **possible** rise drawn as a moving line; the distilled-water control as a separate grey line labelled *control: distilled water in the bag* (no values); any longer-term dashed curve says **one possible qualitative course**, stays separate from data and carries no times; small type *uniform bore: height change tracks capillary-column volume change; net entry into the whole rig is not quantified*. Numbered points only after the osmometer record exists (Dataset 2). |
| `blue-zone-diameter` | *mean diameter of blue zone / mm* (0–40, ticks every 5) against *time after dye added / h* (0–24, ticks every 4) | Beats 11, 12, 13 | **Open circle at (0 h, 8 mm)** labelled *well diameter set by the 8 mm borer: set, not a reading*; means as crosses; smooth curve; caption *our illustrative data; means of two perpendicular diameters*; small type *operational colour-zone measure; no diffusion coefficient or concentration inferred*. |

### Models used, by reference

`FluidMosaicMembrane` `highlight:intrinsic-carrier` with `TransportProteinSet` `carrier-bind` → `carrier-flip` → `carrier-release` → `carrier-reset` (4.2.1a motion contract; outside the cell at the top; captions *schematic; not to scale*); a glucose token moved down its gradient. `WaterBathRig` `maintained` (Topic 3), relabelled as a boiling-water bath.

---

## Beat by beat

Beat windows in the headings are provisional and follow the per-beat ledger (words ÷ 120); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch over 30 words without a stated visual change. Compressed waiting is always captioned and every clock shows real elapsed time.

### BEAT 1 · Hook and context: watching what you cannot see · 0:00–0:44
**Narration:**
> Ever wondered how you could watch diffusion or osmosis happen, when the molecules doing it are far too small to see? Instead, you set things up so that their movement changes something you can see: a colour test, a liquid climbing a tube, a blue patch spreading. Living tissue complicates this, since cells have transport proteins, respire, and leak where they are cut. So the syllabus also asks for non-living materials: dialysis tubing, known as Visking tubing, and agar.

**Visual action:**
1. From the first frame, a bench holds three unlabelled set-ups: a boiling tube with a small tied Visking bag in water, a clamped capillary tube rising from a bag in a beaker, and a Petri dish of agar on white card, with a stopwatch at rest, each rig tagged *preview; schematic* so its stationary clock is not mistaken for a timed investigation; at *far too small to see*, the hook question appears as a compact caption above the bench.
2. At *far too small to see*, a magnifier circle also opens on the boiling tube: water tokens and one orange glucose hexagon jitter randomly (motion), caption *particles drawn schematically; not to scale; far fewer than real*.
3. At *a colour test*, the boiling tube brightens and a small test tube beside it shows a finished Benedict's result, green, tag *preview*.
4. At *a liquid climbing a tube*, the capillary brightens and its meniscus creeps up a few millimetres (motion).
5. At *a blue patch spreading*, the dish brightens and a pale blue zone widens a little around its well (motion).
6. At *Living tissue complicates this*, a raw potato slice thumbnail slides in at the side with a small `FluidMosaicMembrane` inset in `highlight:intrinsic-carrier`, tag *transport proteins*; at *leak where they are cut*, the slice's cut edge is ringed, tag *cut cells leak*; small type *plant tissue; quantitative potato investigation: 4.2.5*.
7. At *non-living materials*, the potato thumbnail slides away; at *Visking tubing*, the bag and the capillary rig take the label **Visking tubing**; at *and agar*, the dish takes **agar**; small type *syllabus 4.2.2, p.21: "including dialysis (Visking) tubing and agar"*. Dissolve to the objectives surface.

**On-screen text:** the hook question; *preview*; *transport proteins*; *cut cells leak*; *Visking tubing*; *agar*; the syllabus line.

---

### BEAT 2 · What you will be able to do · 0:44–1:08
**Narration:**
> By the end you will be able to set up three investigations, a Visking bag, a Visking osmometer and a dye in agar; to read each one at recorded times, starting every clock at first contact; and to say what each result shows, and what it cannot.

**Visual action:** From the first frame, the objectives surface is on screen: its own styled surface on a distinct background colour, **not the lesson apparatus**, each line entering with motion beside a flat authored pictogram.
1. At *set up three investigations*, line 1 with three small pictograms side by side: a **tied bag**, a **rising column**, a **spreading circle**.
2. At *read each one at recorded times*, line 2 with a **stopwatch** pictogram; at *starting every clock at first contact*, a small **touch-point** pictogram (a drop meeting a surface) joins it.
3. At *say what each result shows*, line 3 with a **magnifier over a tick and a question mark** pictogram.
- **SET UP** a Visking bag, a Visking osmometer and a dye-in-agar plate
- **READ** each at recorded times, every clock started at first contact
- **EXPLAIN** what each result shows, and what it cannot

Small type: *syllabus 4.2.2, "investigate", p.21; non-living materials (plant tissue: 4.2.2b).*

**On-screen text:** the three objective lines.

---

### BEAT 3 · The tubing, and the two tests that read it · 1:08–1:54
**Narration:**
> Visking tubing is a thin tube of regenerated cellulose, bought dry and flat, fourteen millimetres wide. Its wall is full of tiny pores, about 2.5 nanometres across. Water and glucose molecules are small enough to pass through; a starch molecule, a long chain of many glucose units, is far too big. There is no phospholipid bilayer and no protein in it, so it sorts molecules by size alone. To find out what crossed, you use two tests: Benedict's reagent responds to reducing sugars, and glucose is one; iodine solution responds to starch.

**Visual action:**
1. From the first frame, the dry flat roll of Visking tubing lies on the bench beside a ruler (`VKTubingRig` parts); at *regenerated cellulose*, label **dialysis (Visking) tubing: regenerated cellulose**; at *fourteen millimetres wide*, the ruler aligns across the flat width, tag **14 mm width (syllabus p.57)**.
2. At *full of tiny pores*, a magnifier opens on the wall: `DiffusionField` `tubing-pores` (wall vertical; *inside the bag* left, *outside water* right; label *pores drawn far larger than real*); at *about 2.5 nanometres across*, one pore is bracketed, tag **pores about 2.5 nm (syllabus p.57)**.
3. At *Water and glucose molecules are small enough*, pale blue water circles and orange glucose hexagons pass through pores both ways (motion); at *a long chain of many glucose units*, a coiled chain of linked orange hexagons drifts to the wall, jostles and fails to pass, tag *starch: far larger than the pores*.
4. At *no phospholipid bilayer and no protein*, a small `FluidMosaicMembrane` thumbnail appears beside the magnifier and is struck through with a thin line, tag **not a cell membrane: no bilayer, no proteins**; at *sorts molecules by size alone*, the pore bracket pulses, tag **partially permeable by pore size only**.
5. At *you use two tests*, the magnifier shrinks; two reagent bottles enter: **Benedict's solution** and **iodine in potassium iodide solution**, each with its safety tag and the eye-protection pictogram; at *responds to reducing sugars*, a real-world note card attaches to the Benedict's bottle: **Benedict's → reducing sugars (glucose is one)**; at *iodine solution responds to starch*, a note on the iodine bottle: **iodine → starch**.

**On-screen text:** *dialysis (Visking) tubing: regenerated cellulose*; *14 mm width*; *pores about 2.5 nm*; *not a cell membrane: no bilayer, no proteins*; *partially permeable by pore size only*; the two real-world notes; safety tags.

---

### BEAT 4 · Filling the bag, and testing what it holds · 1:54–2:47
**Narration:**
> Soak a ten-centimetre length in water until it softens, tie a tight knot at one end, and rub the other end between your fingers to open it. Holding a syringe above the opening, run in five cubic centimetres of a mixture: equal volumes of one per cent starch suspension and ten per cent glucose solution. Tie the top with thread, then rinse the outside, so mixture on the surface is not mistaken for leakage. Test the mixture itself first: Benedict's turns brick red, and iodine blue-black. Then test the starch alone with Benedict's: it stays blue, so this starch brings no reducing sugar the test can detect.

**Visual action:**
1. From the first frame, the `VKTubingRig` bench is on screen: the soaking beaker, the cut 10 cm length, the mixture beaker, a 10 cm³ syringe; at *until it softens*, the length lies in the beaker of distilled water and visibly softens (time-lapse, captioned); at *tie a tight knot at one end*, hands tie the overhand knot about 1 cm from one end, tag *knotted before filling*.
2. At *rub the other end*, finger and thumb rub the other end until it opens (motion).
3. At *Holding a syringe above the opening*, the labelled **10 cm³ syringe** draws from the beaker *starch–glucose mixture*, its nozzle held just above the open end, not touching; at *five cubic centimetres of a mixture*, the plunger runs to 5.0 cm³ delivered, the liquid running down inside the bag, surface level; at *equal volumes*, the mixture label expands: **2.5 cm³ starch suspension, 1% + 2.5 cm³ glucose solution, 10%**.
4. At *Tie the top with thread*, the open end is gathered, twisted and tied tightly with thread; at *rinse the outside*, a wash bottle's gentle stream runs over the bag (held by its thread tail) into the waste beaker; at *not mistaken for leakage*, a tag: **outside rinsed: no mixture on the surface**.
5. At *Test the mixture itself first*, the spotting tile and a test tube enter; 2.0 cm³ of the mixture goes into the test tube with 2.0 cm³ Benedict's, which is carried in a **test-tube holder** into the boiling-water bath; at *Benedict's turns brick red*, the tube advances through **blue → green → yellow → orange → brick red** in one-frame steps (heating stopwatch time-lapse, captioned); at *iodine blue-black*, one drop of mixture falls from above onto the *contents* iodine well, which **switches in one frame to blue-black**; tag **initial positive tests of the contents**.
6. At *test the starch alone*, a second tube: 2.0 cm³ of the 1% starch suspension alone + 2.0 cm³ Benedict's, heated in the bath in its holder; at *it stays blue*, it stays blue; at *no reducing sugar the test can detect*, tag **interference check: the starch suspension alone**.

**On-screen text:** part labels; *knotted before filling*; the mixture volumes; *outside rinsed*; *initial positive tests of the contents* with the brick-red tube and blue-black well; *interference check*; safety tags and pictogram.

---

### BEAT 5 · The blank, matched tubes, and first contact · 2:47–3:30
**Narration:**
> Set up three matched boiling tubes of distilled water, one for each sampling time, each with its own identical bag and its own stopwatch. Before a bag goes in, test a sample of that tube's water: Benedict's stays blue and iodine stays yellow-brown, so the water starts with neither, as far as these tests can tell. Then lower the bag in; that tube's stopwatch starts the moment the tubing first touches the water. No reagent goes into a tube, and no tested sample goes back.

**Visual action:**
1. From the first frame, the `VKTubingRig` rack stands at centre with three empty boiling tubes and three filled, tied, rinsed bags on a paper towel beside it; at *three matched boiling tubes*, 32 cm³ of distilled water is measured into each with the labelled **50 cm³ measuring cylinder** (poured at 120° from upright, stream from the lip into each tube's mouth); labels **tube 1 · sample at 3 min**, **tube 2 · sample at 10 min**, **tube 3 · sample at 20 min**.
2. At *its own identical bag and its own stopwatch*, each bag slides beside its tube and stopwatches **1, 2, 3** appear, all at 0:00, not running; tag *matched: same tubing length, same 5.0 cm³ mixture, same water volume*.
3. At *Before a bag goes in*, `blank`: the sample pipette withdraws 2.0 cm³ from tube 1 into a test tube labelled *blank 1* (with 2.0 cm³ Benedict's) and one drop onto the *blank 1* iodine well; tubes 2 and 3 in the same way (time-lapse); the water level in each settles at the **marked line (30 cm³)**.
4. At *Benedict's stays blue*, the three blank tubes come out of the boiling-water bath in the holder still **blue**; at *iodine stays yellow-brown*, the three blank wells stay **yellow-brown**; at *as far as these tests can tell*, tag **blank taken before the bag goes in**.
5. At *lower the bag in*, `immerse`: a hand lowers bag 1 by its thread into tube 1; **on the rendered frame on which the tubing first touches the water, stopwatch 1 starts**; at *first touches the water*, the contact point is ringed and the already-running stopwatch 1 pulses, tag **t = 0: first contact** (the clock is not reset); bags 2 and 3 follow in time-lapse, each stopwatch starting on its own first-contact frame.
6. At *No reagent goes into a tube*, a ghost dropper of iodine appears over tube 1 and is struck through, tag **no reagent in the bath: tests only on samples drawn out**; at *no tested sample goes back*, a ghost pour from a test tube back into a boiling tube is struck through, tag **nothing returned**.

**On-screen text:** tube labels; *matched*; *blank taken before the bag goes in*; *t = 0: first contact*; *no reagent in the bath*; *nothing returned*; 30 cm³ mark.

---

### BEAT 6 · Samples at recorded times, and reading them · 3:30–4:16
**Narration:**
> The waiting is sped up on screen, but each stopwatch keeps real time. At three minutes, draw two cubic centimetres from tube one, away from the bag, into a test tube with two cubic centimetres of Benedict's, and let one drop fall onto iodine on the spotting tile. Tubes two and three are sampled the same way at ten and twenty minutes. Each Benedict's tube goes into a boiling-water bath for five minutes, held in a test-tube holder. Tube one reaches green, tube two yellow, tube three orange. Every iodine drop stays yellow-brown.

**Visual action:**
1. From the first frame, the three tubes with bags stand in the rack, stopwatches 1–3 running; at *The waiting is sped up on screen*, caption **waiting time compressed; stopwatches show real elapsed time**; the digits run fast, never skipping.
2. At *At three minutes*, stopwatch 1 reaches **3:00** and pulses; `sample`: the pipette enters tube 1 **away from the bag**, tip clear of it; at *into a test tube with two cubic centimetres of Benedict's*, 2.0 cm³ goes in two 1.0 cm³ portions into the test tube labelled **3 min (withdrawn at 3:00)**, already holding 2.0 cm³ Benedict's.
3. At *let one drop fall onto iodine*, one drop falls from above onto the *3 min* iodine well; the remainder goes to the waste beaker; the pipette is rinsed and emptied into the waste beaker (shown, not narrated).
4. At *at ten and twenty minutes*, stopwatches 2 and 3 reach **10:00** and **20:00** in turn; samples go into test tubes **10 min (withdrawn at 10:00)** and **20 min (withdrawn at 20:00)** and onto their iodine wells.
5. At *goes into a boiling-water bath for five minutes*, `benedicts-heat`: the three sample tubes, each carried in the **test-tube holder**, stand in the bath rack; the heating stopwatch runs **5:00** in time-lapse (captioned); at *held in a test-tube holder*, the holder is ringed, tag *tube in a holder; mouth away from people*.
6. At *Tube one reaches green*, the tubes are lifted out onto white card: tube 1 has stepped **blue → green** and stopped; at *tube two yellow*, tube 2 **blue → green → yellow**; at *tube three orange*, tube 3 **blue → green → yellow → orange**; each step a one-frame switch, no RGB tween; caption *judged by eye; our illustrative result*.
7. At *Every iodine drop stays yellow-brown*, the three sample wells are ringed; none switches; beside them the *contents* well stays blue-black for comparison.

**On-screen text:** *waiting time compressed; stopwatches show real elapsed time*; sample labels with withdrawal times; *tube in a holder*; the results strip **3 min: green · 10 min: yellow · 20 min: orange · iodine: yellow-brown (all)**; *judged by eye; our illustrative result*.

---

### BEAT 7 · What crossed, and why: pores, not a membrane · 4:16–5:10
**Narration:**
> So glucose got out, more of it the longer a bag sat, while starch, as far as iodine can tell, did not. Inside the bag glucose started far more concentrated than in the water. Its molecules move randomly, passing through the pores both ways, but more leave than return: net diffusion down the concentration gradient. Think of a sieve. Written properly: Visking tubing is partially permeable; small molecules such as water and glucose pass through its pores, but large starch molecules do not. It is not a cell membrane: across a living cell's bilayer, glucose is polar, does not cross the hydrophobic core readily, and needs a transport protein.

**Visual action:**
1. From the first frame, the results strip and the three tubes stay at left; at *So glucose got out*, the green → yellow → orange tubes are bracketed in order, tag **more glucose outside with time**; at *as far as iodine can tell*, the yellow-brown wells are bracketed, tag **starch not detected outside**, with the blue-black *contents* well beside them.
2. At *Inside the bag glucose started far more concentrated*, `DiffusionField` `tubing-pores` opens at right: many glucose hexagons inside the bag (left), few outside (right); label *concentration gradient*.
3. At *passing through the pores both ways*, glucose hexagons cross in both directions (motion) and the counter runs: *bag → water: n · water → bag: m*; at *more leave than return*, n pulls ahead of m; at *net diffusion down the concentration gradient*, the net arrow draws, labelled **net diffusion of glucose**.
4. At *Think of a sieve*, a flat sieve pictogram appears small above the wall, tag *handle: not an exam answer*; at *Written properly*, the sentence surface slides up beneath the field and builds clause by clause: **Visking tubing is partially permeable · small molecules such as water and glucose pass through its pores · large starch molecules do not**; at *but large starch molecules do not*, in the field a starch chain meets a pore, jostles and stays inside (motion).
5. At *It is not a cell membrane*, the sieve pictogram fades; `FluidMosaicMembrane` slides in small beside the field (outside the cell at the top), caption *schematic; not to scale*; at *glucose is polar*, a glucose token approaches the bilayer's hydrophobic core and turns back (motion); at *needs a transport protein*, `highlight:intrinsic-carrier`: `TransportProteinSet` `carrier-bind` → `carrier-flip` → `carrier-release` → `carrier-reset` carries the glucose token down its gradient (motion), tag **living membrane: glucose needs a transport protein · Visking: pores only**.

**On-screen text:** *more glucose outside with time*; *starch not detected outside*; *concentration gradient*; the counter; *net diffusion of glucose*; the sentence; the comparison tag.

---

### BEAT 8 · The osmometer: set up, then the first real reading · 5:10–6:04
**Narration:**
> The same tubing can show osmosis. Fill a knotted bag with one mole per cubic decimetre sucrose solution, push a capillary tube into its open end, and wind thread tightly round the tubing and capillary. Check there is no trapped air and no drip at the tie. Clamp it upright, a millimetre ruler beside the capillary, and lower the bag into a beaker of distilled water: the stopwatch starts as the tubing first touches the water. The meniscus can shift as the bag settles, so the first reading is taken after immersion: forty-eight millimetres on the ruler at one minute, not a mark made beforehand and called zero.

**Visual action:**
1. From the first frame, `VKTubingRig` `osmometer` parts are on the bench: a soaked, knotted length, the syringe, the bottle **sucrose solution, 1.0 mol dm⁻³**, a glass capillary tube, thread, a clamp stand, a mm ruler, a 250 cm³ beaker of distilled water; at *Fill a knotted bag*, the syringe, held above the opening, fills the bag to the brim.
2. At *push a capillary tube into its open end*, the capillary is eased in without force, tag *glass: ease in, never force*, label **capillary tubing, 1.0 mm bore**; at *wind thread tightly*, thread winds several turns round tubing and capillary and is tied.
3. At *no trapped air*, the rig is held against the light, the column continuous from bag to capillary, tag **no trapped air**; at *no drip at the tie*, the tie is held over paper towel for 30 s (time-lapse), towel dry, tag **leak check: no drip**.
4. At *Clamp it upright*, the capillary is clamped vertically on the stand; at *a millimetre ruler beside the capillary*, the ruler is clamped alongside, zero end at the bottom, label **mm ruler**.
5. At *lower the bag into a beaker of distilled water*, the beaker is raised beneath until the bag is fully submerged; **on the rendered frame on which the tubing first touches the water, the osmometer stopwatch starts**; at *the stopwatch starts as the tubing first touches the water*, the contact point is ringed and the already-running stopwatch pulses, tag **t = 0: first contact** (not reset). Beside it, the identical `osmometer-control` (bag of distilled water) is immersed the same way with its own stopwatch (shown, not narrated), label *control: distilled water in the bag*.
6. At *The meniscus can shift as the bag settles*, the meniscus is drawn moving a little in the first minute (time-lapse, captioned); a light pencil mark made before immersion is ringed, tag **pre-immersion mark: not a reading, not zero**.
7. At *the first reading is taken after immersion*, the stopwatch shows **1:00**; the ruler at the meniscus zooms; at *forty-eight millimetres on the ruler at one minute*, label **first reading: 48 mm at 1:00 (after immersion)**; at *not a mark made beforehand and called zero*, a ghost label *0 mm at 0:00* appears and is struck through.

**On-screen text:** part labels; *glass: ease in, never force*; *no trapped air*; *leak check: no drip*; *t = 0: first contact*; *pre-immersion mark: not a reading, not zero*; *first reading: 48 mm at 1:00 (after immersion)*; control label.

---

### BEAT 9 · The rise, explained in water potential, and its limits · 6:04–7:10
**Narration:**
> Time is compressed again. Every two minutes: fifty-seven, sixty-five, seventy-two, on to a hundred and five millimetres at twenty-one minutes, rising more slowly as time goes on. The control bag of distilled water barely moves. Distilled water is close to pure water, the reference at zero; the sucrose solution's water potential is lower, more negative. So there is a net movement of water molecules into the bag, from higher to lower water potential, through the partially permeable tubing: osmosis. The bore is the same all the way up, so height tracks the volume that entered. But sucrose passes the pores too, just more slowly, the bag stretches, and the rising column pushes back, so the rise is transient: it slows, and can stop or fall. It is not a permanent equilibrium.

**Visual action:**
1. From the first frame, the osmometer and its control stand at left, both stopwatches running; at *Time is compressed again*, caption **waiting time compressed; stopwatches show real elapsed time**.
2. At *Every two minutes*, `meniscus-height` draws at right with axis labels **meniscus height on ruler / mm** and **time after immersion / min**, caption *our illustrative data*; the 1 min point (48 mm) drops in from the Beat 8 label; at *fifty-seven, sixty-five, seventy-two*, the meniscus rises (motion) and at the 3, 5 and 7 min ticks the ruler reading snaps to each value and a cross drops onto the graph; at *a hundred and five millimetres at twenty-one minutes*, the remaining points to 21 min drop in (time-lapse) and the smooth line of best fit draws; at *rising more slowly*, the line's flattening is traced.
3. At *The control bag of distilled water barely moves*, the grey control crosses draw nearly flat at 51–52 mm, labelled **control: distilled water in the bag**.
4. At *Distilled water is close to pure water*, `WaterPotentialModel` `tubing-leak` opens beneath the rig: wall relabelled **Visking tubing wall**, left **distilled water**, right **inside the bag: sucrose solution, 1.0 mol dm⁻³**; at *the reference at zero*, the scale's **0 kPa (pure water at atmospheric pressure)** mark pulses beside the left label *initially: higher water potential (less negative)*; at *lower, more negative*, the right label *initially: lower water potential (more negative)* lands.
5. At *net movement of water molecules into the bag*, water tokens cross both ways, the counter showing more left → right (motion); at *from higher to lower water potential*, the net arrow draws, labelled **net movement of water by osmosis**; at *through the partially permeable tubing*, the wall pulses, tag *partially permeable*.
6. At *The bore is the same all the way up*, the capillary bore is bracketed at two heights, tag **same bore: height tracks volume entered**; small type *57 mm rise in a 1.0 mm bore ≈ 0.045 cm³ entered (see Datasets)*.
7. At *sucrose passes the pores too*, occasional sucrose double-hexagons cross right → left in the model, far fewer than water crossings, tag **sucrose also passes, more slowly**; at *the bag stretches*, the bag outline in the rig swells slightly, tag *bag stretching*; at *the rising column pushes back*, a downward arrow on the column, tag *column pushes back*.
8. At *the rise is transient*, a dashed extension beyond 21 min on the graph, in a separate panel colour, bends over and, further out, dips, captioned **schematic: longer-term behaviour; not these data**; at *It is not a permanent equilibrium*, tag **transient rise: not constant-rate, not permanent equilibrium**.

**On-screen text:** caption; axis labels; *our illustrative data*; *control: distilled water in the bag*; water-potential labels; *net movement of water by osmosis*; *same bore: height tracks volume entered*; *sucrose also passes, more slowly*; *schematic: longer-term behaviour; not these data*; *transient rise*.

---

### BEAT 10 · Agar: a well, a dye and a clock · 7:10–7:59
**Narration:**
> Now diffusion with no membrane at all. Agar is a jelly that is mostly water held in a fine mesh of fibres: dissolved molecules diffuse through that water, while the gel largely stops currents stirring it. Pour plain agar five millimetres deep in a Petri dish, let it set, and stand it on white card over a ruler. Push an eight-millimetre cork borer straight down, lift out the plug to leave a well, and let three drops of methylene blue fall into it from a dropper held above. The stopwatch starts as the first drop reaches the well.

**Visual action:**
1. From the first frame, `AgarPlateRig` is on screen: an empty 9 cm Petri dish on white card, a conical flask of molten agar, the cork borer, mounted needle, dropper bottle and stopwatch; at *no membrane at all*, tag **no membrane: diffusion through a gel**.
2. At *mostly water held in a fine mesh of fibres*, a magnifier opens on a patch of agar: `DiffusionField` `agar-open` with faint grey fibre lines among water tokens (no dye yet), label **agar: water held in a mesh of fibres**; at *largely stops currents stirring it*, a ghost swirl arrow appears and fades, tag *no stirring currents*.
3. At *Pour plain agar five millimetres deep*, `pour-set`: the flask pours at 120° from upright, stream from the lip into the dish, surface level; label **plain agar, 2% technical agar, no indicator, 5 mm deep**; at *let it set*, lid on, tag *set, level*.
4. At *stand it on white card over a ruler*, the dish sits on the white card with the clear mm ruler beneath, visible through the agar; labels **white card**, **ruler under the dish**.
5. At *Push an eight-millimetre cork borer straight down*, `well`: the borer, held by its handle, fingers clear of the edge, goes straight down into the centre, twists once and withdraws; at *lift out the plug*, the mounted needle lifts the plug, leaving the well, label **8 mm well**.
6. At *three drops of methylene blue*, the dropper bottle's label **methylene blue, 0.1% (1 g dm⁻³)** and its safety tag appear, eye-protection pictogram and gloves in the corner; at *from a dropper held above*, `dye`: the dropper is squeezed above the well, not touching.
7. At *The stopwatch starts as the first drop reaches the well*, **on the rendered frame on which the first drop reaches the well, the stopwatch starts**; the contact point is ringed, tag **t = 0: first drop reaches the well** (not reset); the next two drops fill the well without overflowing; lid on.

**On-screen text:** *no membrane: diffusion through a gel*; *agar: water held in a mesh of fibres*; part labels; the methylene blue label and safety tag; *t = 0: first drop reaches the well*.

---

### BEAT 11 · Measuring the blue zone, and what it cannot tell you · 7:59–9:00
**Narration:**
> Keep the dish level and lidded, and do not move it; the time-lapse squeezes a day into seconds. Dye molecules move randomly, so more spread out of the crowded well than drift back, and the blue zone widens. Define its edge once: the outermost point where blue is still visible against the white card, judged the same way each time. Measure two diameters at right angles and take the mean: twelve millimetres at half an hour, twenty at four hours, thirty-six and a half at twenty-four, widening ever more slowly. Colour, dye binding to the agar and what your eye can detect all affect that edge, so the diameter is an operational colour-zone measure: no diffusion coefficient or concentration comes from it.

**Visual action:**
1. From the first frame, the `AgarPlateRig` dish sits on the white card over the ruler, lid on, the well full of blue; at *do not move it*, tags **level · lid on · not moved**; at *the time-lapse squeezes a day*, `spreading` begins, caption **time-lapse: 24 h compressed; clock shows real elapsed time**, the stopwatch counting hours.
2. At *Dye molecules move randomly*, the `agar-open` magnifier returns: deep-blue dye squares crowded at the well edge move randomly among the fibres (motion); at *more spread out of the crowded well than drift back*, the net arrow draws outward, labelled **net diffusion of dye**; a few dye squares pause against fibres (tag *some dye binds to the agar*); at *the blue zone widens*, the dish's zone widens, darkest at the well and paler outward, the same methylene blue hue throughout.
3. At *Define its edge once*, `measure`: the edge rule tag lands and stays: **edge = outermost point where blue is still visible against the white card; judged the same way each time**; at *judged the same way each time*, the zone's outer boundary is traced once, thinly.
4. At *two diameters at right angles*, lines *d₁* and *d₂* draw across the zone against the ruler; at *twelve millimetres at half an hour*, the clock shows **0.5 h**, *d₁ = 12 mm, d₂ = 12 mm, mean 12 mm*; `blue-zone-diameter` draws at right with its open circle at **8 mm (well diameter: set, not a reading)** and the first cross at 12 mm; at *twenty at four hours*, the 1, 2 and 4 h crosses drop in (4 h: *d₁ 20, d₂ 20, mean 20 mm*); at *thirty-six and a half at twenty-four*, the 8 and 24 h crosses drop in (24 h: *d₁ 37, d₂ 36, mean 36.5 mm*) and the smooth curve draws; caption *our illustrative data; means of two perpendicular diameters*.
5. At *widening ever more slowly*, the curve's flattening is traced.
6. At *Colour, dye binding to the agar and what your eye can detect*, the pale outer rim of the zone is ringed and three small tags attach: *colour intensity*, *dye binding to agar*, *visibility threshold*; at *an operational colour-zone measure*, label **diameter = operational colour-zone measure**; at *no diffusion coefficient or concentration comes from it*, ghost labels *diffusion coefficient* and *concentration at the edge* appear beside the graph and are struck through.

**On-screen text:** *level · lid on · not moved*; caption; *net diffusion of dye*; *some dye binds to the agar*; the edge rule; the diameter readings; axis labels; *our illustrative data*; *diameter = operational colour-zone measure*.

---

### BEAT 12 · What I told you, on the three rigs · 9:00–9:44
**Narration:**
> So here it is, on the three rigs. The bag: blanks tested first, samples at recorded times, and glucose, not starch, found outside, because glucose fits Visking's pores and starch does not. The osmometer: the first reading after immersion, then a rise as water enters by osmosis, from higher to lower water potential, transient because sucrose leaks too. The agar: a blue zone widening as the dye diffuses through the water in the gel, measured as a defined colour-zone diameter. And every clock started at first contact.

**Visual action:** **No new slide.** The screen returns to the layout built through the lesson: `VKTubingRig` diffusion rack with the results strip at left, the osmometer with `meniscus-height` at centre, `AgarPlateRig` with `blue-zone-diameter` at right. Static. Key points fade in in place:
1. From the first frame, the three rigs and their readouts hold still in their places; at *on the three rigs*, the layout settles; nothing moves.
2. At *blanks tested first*, the blank wells and blue blank tubes brighten, tag *blank before the bag*; at *samples at recorded times*, the withdrawal-time labels 3:00, 10:00, 20:00 brighten.
3. At *glucose, not starch, found outside*, the green → yellow → orange tubes and the yellow-brown wells brighten; at *glucose fits Visking's pores*, a small pore icon on the bag brightens, tag **partially permeable by pore size**.
4. At *the first reading after immersion*, the **48 mm at 1:00** label brightens; at *a rise as water enters by osmosis*, the sucrose curve brightens with tag **higher → lower water potential**; at *transient because sucrose leaks too*, the tag **sucrose also passes, more slowly** brightens on the bag.
5. At *a blue zone widening*, the dish zone and its curve brighten; at *a defined colour-zone diameter*, the edge-rule tag brightens.
6. At *every clock started at first contact*, the four *t = 0: first contact* marks on the stopwatches brighten together.

---

### BEAT 13 · How it is asked, the reject card, and the invisible molecules · 9:44–10:45
**Narration:**
> How this reaches you. No Visking-tubing question has been verified in the papers cited here, so that part rests on the syllabus. Agar diffusion did appear. A June 2021 paper had agar cubes A, B and C containing universal indicator, blue at the start and red in acid, and asked the order in which they changed colour completely. The credited order: A, then B, then C. Why size matters is the surface-area lesson's job. The scheme doesn't need this, but, like our blue edge, that colour boundary marks where the indicator changes, not where the first acid molecules are. The reject card: Visking tubing is partially permeable by pore size alone. And those molecules too small to see? You watched what they did.

**Visual action:**
1. From the first frame, the familiar lesson layout stays on screen at right (reduced): the diffusion rack with its results strip, the osmometer with `meniscus-height`, the agar dish with `blue-zone-diameter`; at *How this reaches you*, a compact forms surface enters at left.
2. At *No Visking-tubing question has been verified*, row 1: **Visking tubing: no question verified in the cited papers** · small type *UNVERIFIED — a marked Visking-tubing question; this part of the close is syllabus-based (syllabus 4.2.2, p.21)*; the bag and osmometer brighten briefly.
3. At *Agar diffusion did appear*, row 2 header: **agar diffusion: S21/22 Q4(c), 1 mark, QP p.9 / MS p.14** · small type *our framing of the question; exact wording not reproduced (UNVERIFIED)*.
4. At *agar cubes A, B and C*, three schematic agar cubes labelled **A**, **B**, **C** draw beside row 2, A and B smaller than C, caption *schematic reconstruction; cube C is the 3 cm cube of Q4(b); dimensions of A and B not reproduced*; at *universal indicator, blue at the start*, the cubes fill **blue**, label **universal indicator (the paper's indicator)**; at *red in acid*, a small acid-bath outline appears under the cubes, tag **red in acid (the paper's result)**, and a divider line separates the cubes from our dish, tag **our demonstration: methylene blue, a dye; not an indicator here**.
5. At *The credited order*, the answer line lands in the normal accent: **order of complete colour change: A → B → C** · small type *mark-scheme answer (plan-check description, not quoted), MS p.14*; at *Why size matters is the surface-area lesson's job*, small type *the SA:V reasoning: 4.2.3-4*.
6. At *The scheme doesn't need this*, a separate panel with a **dashed border**, no tick and no MS tab, headed **beyond the mark scheme**, slides in below row 2; at *like our blue edge*, the edge-rule tag on our dish pulses; at *where the indicator changes*, the panel reads *the colour boundary marks where the indicator's colour changes; it is not the position of the first acid molecules*.
7. At *The reject card*, the reject card lands beside the Visking rig, struck through by hand: **✗ Visking tubing is a model of the cell membrane** / **✓ Visking tubing is partially permeable by pore size alone: no phospholipid bilayer, no transport proteins**, caption in small type *our wording contrast; an author-flagged trap from the plan, not an examiner-reported error*.
8. At *those molecules too small to see*, the Beat 1 magnifier returns small over the bag, one glucose token jittering; at *You watched what they did*, the orange tube, the risen meniscus and the widened blue zone brighten together. Final frame held 2 s: forms at left, the lesson layout and reject card at right. No slogan.

**On-screen text:** the two form rows with citations and UNVERIFIED notes; the schematic cubes with their captions; *order of complete colour change: A → B → C*; the beyond-the-mark-scheme panel; the reject card and caption.

---

## Datasets

All three datasets are **our illustrative data**, labelled so on screen. Nothing is supplied by a paper. Every derived number is worked.

### Dataset 1 — Visking diffusion bag, samples by tube (Beats 4–7, 12, 13)

Conditions: room temperature 20 °C (recorded). Three matched set-ups. Each bag: Visking tubing, 14 mm width, about 10 cm, soaked, knotted at the base, filled by 10 cm³ syringe with **5.0 cm³ of a mixture of 2.5 cm³ 1% starch suspension + 2.5 cm³ 10% glucose solution**, tied with thread, outside rinsed. Each boiling tube: 32 cm³ distilled water; blank of 2.0 cm³ withdrawn (plus one drop for iodine) **before** the bag goes in, leaving 30 cm³ at the marked line. Each tube's stopwatch starts on the frame its tubing first touches the water; each tube is sampled once, at its own recorded elapsed time. Sample: 2.0 cm³ outside water (withdrawn away from the bag) + 2.0 cm³ Benedict's solution, 5 min in a boiling-water bath, tube in a holder, colour judged by eye on white card; one drop on a drop of iodine solution on a spotting tile. No reagent enters a tube holding a bag; no sample is returned.

| test | Benedict's colour after 5 min in boiling-water bath | iodine |
|---|---|---|
| mixture in the bag (initial positive test) | brick red | blue-black |
| 1% starch suspension alone (interference check) | blue (no change) | — |
| blank, tubes 1, 2, 3 (before bag) | blue (no change) | yellow-brown (no change) |
| tube 1, withdrawn at 3:00 | green | yellow-brown |
| tube 2, withdrawn at 10:00 | yellow | yellow-brown |
| tube 3, withdrawn at 20:00 | orange | yellow-brown |

Derived and checked:
- **Mixture composition:** glucose 10% = 10 g per 100 cm³ = 0.10 g cm⁻³; 0.10 g cm⁻³ × 2.5 cm³ = **0.25 g glucose**; in 5.0 cm³ → 0.25 ÷ 5.0 = 0.05 g cm⁻³ = **5% glucose** in the bag. Starch 1% = 0.010 g cm⁻³ × 2.5 cm³ = **0.025 g**; in 5.0 cm³ → **0.5% starch**.
- **Ceiling on outside glucose** (not narrated): if all 0.25 g spread evenly through 30 cm³ outside + 5.0 cm³ inside = 35 cm³, the concentration would be 0.25 ÷ 35 = 0.0071 g cm⁻³ ≈ **0.71%**, far below the 5% starting inside, so a gradient remains through the 20 min; an approximate check ignoring water entering the bag.
- **Colour order is monotonic** (green < yellow < orange on the real Benedict's sequence), consistent with more glucose outside at later times. No concentration values are assigned to the colours; they are by-eye, our illustrative results.
- **Submersion check** (not narrated): boiling tube internal diameter about 2.2 cm → cross-section π(1.1)² = 3.8 cm²; (30 + 5.0) cm³ ÷ 3.8 cm² = **9.2 cm** of liquid; filled bag, circumference ≈ 2 × 14 mm = 28 mm → diameter ≈ 28 ÷ π = 8.9 mm → cross-section π(0.445)² = 0.62 cm²; 5.0 ÷ 0.62 = **8.0 cm** long; so the filled part is under water.

### Dataset 2 — Visking osmometer, meniscus height (Beats 8, 9, 12)

Conditions: bag of Visking tubing (14 mm width, about 10 cm) filled with **1.0 mol dm⁻³ sucrose solution**, tied round a glass capillary of **1.0 mm internal bore**, no trapped air, leak-checked, clamped vertically with a mm ruler; submerged in 250 cm³ distilled water at 20 °C; stopwatch started on the frame the tubing first touched the water; **first reading at 1:00 after immersion**; readings every 2 min to 21:00; read to the nearest 1 mm. Control: identical rig with distilled water in the bag. The observation interval (20 min of readings) is stated before the data; the trace is illustrative, not a sourced measurement (UNVERIFIED item 4).

| time after immersion / min | 1 | 3 | 5 | 7 | 9 | 11 | 13 | 15 | 17 | 19 | 21 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| meniscus height on ruler, sucrose bag / mm | 48 | 57 | 65 | 72 | 78 | 84 | 89 | 94 | 98 | 102 | 105 |
| meniscus height on ruler, control (water) bag / mm | 51 | 51 | 51 | 52 | 52 | 52 | 52 | 52 | 52 | 52 | 52 |
| increase in the 2 min interval, sucrose / mm | — | 9 | 8 | 7 | 6 | 6 | 5 | 5 | 4 | 4 | 3 |

Derived:
- **Interval increases** 9 + 8 + 7 + 6 + 6 + 5 + 5 + 4 + 4 + 3 = **57 mm** = 105 − 48 ✓. The increases never grow and generally shrink: the rise slows ("rising more slowly as time goes on"; not "each step smaller", since 6, 6 / 5, 5 / 4, 4 repeat).
- **Rise from the first recorded reading** (1:00 → 21:00): **105 − 48 = 57 mm** over 20 min; average **57 ÷ 20 = 2.85 ≈ 2.9 mm min⁻¹** (not narrated). First interval 9 ÷ 2 = 4.5 mm min⁻¹; last 3 ÷ 2 = 1.5 mm min⁻¹ (not narrated).
- **Volume entered, calculated** (syllabus p.63, volume of a cylinder; small type only): bore radius 0.50 mm = 0.050 cm; cross-section π(0.050)² = 0.00785 cm²; rise 5.7 cm; V = 0.00785 × 5.7 = **0.045 cm³** (2 s.f.), about 0.9% of the bag's 5 cm³. Calculated, not measured; valid only after allowing for bag settling and stretching.
- **Control:** 52 − 51 = **1 mm** in 20 min, within the ±1 mm reading resolution: little change without a water-potential difference; the sucrose bag's rise is not explained by the rig alone.
- No reading exists at 0 min; the 48 mm first reading is not a zero. The graph's longer-term dashed extension is schematic (captioned), not data.

### Dataset 3 — methylene blue in agar, blue-zone diameter (Beats 10–12)

Conditions: 9 cm Petri dish, plain 2% technical agar, 5 mm deep (π × 4.5² × 0.5 = 31.8 ≈ **32 cm³**); 8 mm well cut with a cork borer at the centre (well volume π × 0.40² × 0.5 = **0.25 cm³**); three drops (about 0.05 cm³ each ≈ 0.15 cm³, so the well does not overflow) of 0.1% methylene blue; stopwatch started on the frame the first drop reached the well; dish level, lid on, not moved, room 20 °C; two perpendicular diameters read against the ruler under the dish to the nearest 1 mm, edge defined as the outermost point where blue is still visible against the white card, judged the same way each time. The 8 mm at 0 h is the borer diameter: **set, not a reading** (open circle).

| time after dye added / h | 0 | 0.5 | 1 | 2 | 4 | 8 | 24 |
|---|---|---|---|---|---|---|---|
| d₁ / mm | (8, set) | 12 | 14 | 17 | 20 | 25 | 37 |
| d₂ / mm | (8, set) | 12 | 15 | 16 | 20 | 24 | 36 |
| mean diameter / mm | 8 (set) | 12.0 | 14.5 | 16.5 | 20.0 | 24.5 | 36.5 |

Derived:
- **Means:** (12 + 12) ÷ 2 = 12.0; (14 + 15) ÷ 2 = 14.5; (17 + 16) ÷ 2 = 16.5; (20 + 20) ÷ 2 = 20.0; (25 + 24) ÷ 2 = 24.5; (37 + 36) ÷ 2 = 36.5 mm.
- **Widening slows** (not narrated): 0.5–1 h (14.5 − 12.0) ÷ 0.5 = 5.0 mm h⁻¹; 1–2 h 2.0 ÷ 1 = 2.0; 2–4 h 3.5 ÷ 2 = 1.75; 4–8 h 4.5 ÷ 4 = 1.1; 8–24 h 12.0 ÷ 16 = 0.75 mm h⁻¹. Each later rate is smaller: "widening ever more slowly".
- Plausibility (author's check, not narrated and not taught): the increase in radius beyond the well (mean ÷ 2 − 4 mm: 2.0, 3.25, 4.25, 6.0, 8.25, 14.25 mm) grows roughly with the square root of time (ratio to √t: 2.8, 3.3, 3.0, 3.0, 2.9, 2.9), the pattern expected for diffusion; used only to keep the illustrative values realistic. **No diffusion coefficient or concentration is derived or shown** (should-fix 4; calibration DO-NOT-ADD: no Fick's law).

---

## Real-world samples

| Material | What the method responds to | Fit (range, clarity) | Interferences and how the method handles them | Beats |
|---|---|---|---|---|
| **Visking tubing** (dialysis tubing, regenerated cellulose, 14 mm width, pores about 2.5 nm: syllabus p.57) | molecular size relative to the pores: water and glucose pass; starch is retained; sucrose passes, more slowly than water | fits a size-sorting demonstration; it is a non-living model of partial permeability **by pore size only** (no bilayer, no proteins), so it does not show how glucose crosses a living membrane | dry tubing does not open or seal well: soak first; leaks at the knot or tie: tie tightly, leak-check the osmometer; mixture on the outside gives a false positive: rinse the outside; sucrose leakage limits the osmometer: transient rise stated | 3, 4, 7, 8, 9, 13 |
| **Starch suspension + glucose solution** in the bag, read by **Benedict's reagent** and **iodine** | Benedict's responds to **reducing sugars** (glucose is one); iodine responds to **starch** | Benedict's is qualitative by eye: the colour sequence shows more or less reducing sugar, not a concentration; iodine gives a clear two-state result (blue-black or its own yellow-brown) | commercial starch can carry a little reducing sugar: starch suspension tested alone with Benedict's first; reagent in the bath would change what is being sampled: never added to the bath, samples never returned; initial positive tests of the contents and the external blank make a negative outside starch result interpretable | 3, 4, 5, 6, 7 |
| **Sucrose solution, 1.0 mol dm⁻³**, in the osmometer | the readout responds to the **volume of liquid entering the bag** (meniscus rises; same bore, so height tracks volume) | a large water-potential difference gives a visible rise within minutes; a short, stated observation interval | sucrose also passes Visking's pores, more slowly than water; bag stretching and the rising column; trapped air and leaks: no trapped air, leak check, first reading after immersion, control bag of distilled water, rise described as transient | 8, 9, 12 |
| **Plain agar** (technical agar: syllabus p.58) | a water-filled gel: dissolved molecules diffuse through the water held in the fibre mesh; the gel largely prevents stirring currents | near-colourless and 5 mm deep on white card over a ruler, so a blue zone can be read against a scale | movement or tilting of the dish, evaporation: kept level, lid on, not moved; well cut cleanly to the base | 10, 11 |
| **Methylene blue, 0.1%** (syllabus p.58, [HH]) | its **blue colour**: the zone that is visibly blue | visible at decreasing intensity towards the edge; a day of spreading stays within the dish | some dye binds to the agar; the apparent edge depends on colour intensity and the eye's visibility threshold (should-fix 4): edge defined once and judged the same way each time; diameter treated as an operational colour-zone measure; no diffusion coefficient or concentration inferred | 10, 11, 13 |

Explain-beat real-world examples: none beyond the handled materials; the potato slice in Beat 1 is a context thumbnail only (plant tissue handed off to 4.2.2b). In the exam close (Beat 13) the mark-scheme answer comes first and the real-world extra (what a colour boundary marks) is spoken as beyond the scheme on a dashed **beyond the mark scheme** panel.

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.21) | Beat(s) | How |
|---|---|---|
| investigate | 4–6, 8–11 | three designs demonstrated with named apparatus, physically possible handling, controlled variables, first-contact timing, recorded readings and stated limits |
| simple diffusion × non-living material (Visking tubing) | 3–7 | glucose (not starch) detected outside a Visking bag; net diffusion down the gradient through pores |
| simple diffusion × non-living material (agar) | 10, 11 | methylene blue spreading through agar; diameter of the blue zone |
| osmosis × non-living material (Visking tubing) | 8, 9 | osmometer; water-potential explanation (4.2.1a/MF3 wording) |
| plant tissue × diffusion; plant tissue × osmosis | handed off | **4.2.2b** (beetroot pigment leakage; red onion plasmolysis) |
| "including dialysis (Visking) tubing and agar" | 3–11 | both named materials investigated |
| Mathematical requirements p.63: mean; volume of a cylinder | 11 (means of two diameters); 9 small type (volume entered) | worked in *Datasets* |
| Apparatus p.57 / materials p.58 | 3, 4, 8, 10 | Visking tubing 14 mm, capillary tubing, cork borer, Petri dish 9 cm, spotting tile, stop-clock; Benedict's, iodine, sucrose, glucose, starch, technical agar, methylene blue |

### Mark-scheme and examiner points → beats

| Source | Point | Beat |
|---|---|---|
| S21/22 Q4(c), QP p.9 / MS p.14 (plan-check description; no wording quoted) | order of complete indicator change A → B → C; universal indicator, initially blue, red in acid; kept distinct from our methylene blue | 13 |
| Plan UNVERIFIED register item 4 | no marked Visking-tubing question in the cited blocks; said so | 13 |
| Plan MF5 Visking sampling rules | blank before the bag; samples at recorded elapsed times; separate matched vessels; no reagents in the bath, no samples returned; initial positive tests of contents and blank | 4, 5, 6 |
| Plan MF5 osmometer rules | no trapped air; leak check; first reading after immersion at its real elapsed time; no pre-immersion mark as zero; allow for bag stretching; sucrose leaks, transient rise, not constant-rate or permanent equilibrium; stated observation interval | 8, 9 |
| Plan should-fix 4 | visible dye spreading through hydrated agar; colour/adsorption and visibility threshold affect the apparent boundary; operational colour-zone measure; no diffusion coefficient or concentration | 10, 11 |
| Plan MF7 pacing note | setup, compressed waiting (captioned, real clock) and readout interpretation shown explicitly | 4–6, 8–11 |
| Plan should-fix 7 | working concentrations and their hazards; eye protection | 3, 4, 6, 8, 10 (tags) |
| Plan MF2 glucose sentence | glucose polar, does not cross the hydrophobic core readily, needs a transport protein (contrast with Visking) | 7 |
| Plan MF3 water-potential sentences | pure water at atmospheric pressure the reference, 0; solution lower, more negative; net osmosis higher → lower through a partially permeable membrane | 9 |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, never, only, no, nothing, cannot, because, must, needs* and causal *so/since* was reread with one question: true of all cases, or of the case on screen?
- Beat 1: "far too small to see" (by eye and light microscope; the point is indirect observation). "You cannot follow a single glucose molecule by eye": bounded "by eye". "Living tissue complicates this, since cells have transport proteins, respire, and leak where they are cut": typical properties of the living tissue used in these practicals; "complicates", not "prevents". "So the syllabus also asks": the syllabus's own "including".
- Beat 2: "starting every clock at first contact": this lesson's rule for its own clocks.
- Beat 3: "Water and glucose molecules are small enough to pass through; a starch molecule … is far too big": relative to this tubing's pores (about 2.5 nm, syllabus). "There is no phospholipid bilayer and no protein in it, so it sorts molecules by size alone": true of regenerated-cellulose dialysis tubing; the plan's "partially permeable by pore size only".
- Beat 4: "so mixture on the surface is not mistaken for leakage": the purpose of rinsing. "so this starch brings no reducing sugar the test can detect": bounded to this starch and this test's sensitivity.
- Beat 5: "so the water starts with neither, as far as these tests can tell": bounded by test sensitivity. "No reagent goes into a tube, and no tested sample goes back": a procedural instruction for this method (MF5), not a biological claim.
- Beat 6: "each stopwatch keeps real time": the rig's rule. "Every iodine drop stays yellow-brown": this run's three sample wells.
- Beat 7: "while starch, as far as iodine can tell, did not": bounded. "Starch molecules are too large for the pores": this tubing. "small molecules such as water and glucose pass through its pores, but large starch molecules do not": "such as", not "all small molecules". "across a living cell's bilayer, glucose is polar, does not cross the hydrophobic core readily, and needs a transport protein": the plan's MF2 wording ("readily"); no claim about direction or energy for every glucose system.
- Beat 8: "no trapped air and no drip at the tie": the checks to be made. "so the first reading is taken after immersion": the MF5 rule. "The meniscus can shift": "can".
- Beat 9: "The control bag of distilled water barely moves": this run. "Distilled water is close to pure water, the reference at zero": "close to"; MF3's reference condition is shown on screen (pure water at atmospheric pressure). "So there is a net movement of water molecules into the bag": follows from the stated initial comparison. "so height tracks the volume that entered": only because the bore is the same (stated), and on screen "after allowing for bag settling and stretching". "so the rise is transient: it slows, and can stop or fall": "can"; not a guaranteed pattern. "It is not a permanent equilibrium": the MF5 caution about this demonstration. Visking is never said to exclude sucrose ("sucrose passes the pores too, just more slowly").
- Beat 10: "Now diffusion with no membrane at all": true of the agar gel. "the gel largely stops currents stirring it": "largely".
- Beat 11: "Dye molecules move randomly, so more spread out of the crowded well than drift back": net diffusion down a gradient, as taught in 4.2.1a. "so the diameter is an operational colour-zone measure: no diffusion coefficient or concentration comes from it": the should-fix 4 ruling, bounded to "it" (this edge).
- Beat 12: "because glucose fits Visking's pores and starch does not": this tubing. "transient because sucrose leaks too": one stated reason among those given in Beat 9 (the on-screen tag), not the only one. "every clock started at first contact": this lesson's four clocks.
- Beat 13: "No Visking-tubing question has been verified in the papers cited for this topic": exactly the plan's register item. "The credited order": the MS answer as described by the plan check, in the past tense for one paper. "The scheme doesn't need this": beyond-the-scheme framing. The reject card is spoken only in its correct form ("partially permeable by pore size alone"); its wrong line is written, never spoken.
- No sentence says that Visking tubing is a cell membrane, that sucrose cannot pass it, that the meniscus rise is constant or permanent, that a pre-immersion mark is zero, that the blue edge is the dye's true front, or that "concentration of water" moves.

---

## Citations

Every quotation in this storyboard, where it appears, and where it was copied from. No exam wording is quoted.

| # | Quotation (verbatim) | Paper / session / question / page | Beat(s) | Copied from | Status |
|---|---|---|---|---|---|
| 1 | "investigate simple diffusion and osmosis using plant tissue and non-living materials, including dialysis (Visking) tubing and agar" | Syllabus 2025–2027, 4.2.2, p.21 | header; 1 (excerpt "including dialysis (Visking) tubing and agar") | `SYLLABUS-9700-DETAIL.md` | syllabus |
| 2 | "dialysis (Visking) tubing, 14 mm width with a pore diameter of approximately 2.5 nm"; "capillary tubing"; "cork borers"; "Petri dishes, plastic or glass, 9 cm diameter" | Syllabus apparatus list, p.57 | spine; 3, 8, 10 (labels paraphrase: *14 mm width*, *pores about 2.5 nm (syllabus p.57)*) | `SYLLABUS-9700-DETAIL.md` | syllabus |
| 3 | "[HH] methylene blue"; "technical agar"; "[N] – iodine in potassium iodide solution (suitable for starch test)"; "[MH] [N] – Benedict’s solution (suitable for qualitative reducing sugar test)" | Syllabus materials list, p.58 | spine; safety tags (codes only) | `SYLLABUS-9700-DETAIL.md` | syllabus |
| 4 | no wording quoted: description only — order of complete indicator change A → B → C, 1 mark; universal indicator, initially blue, red in acid | S21/22 Q4(c), QP p.9 / MS p.14 (s21_22) | spine; 13 | plan check row (`cloud-checks/006/plan/CHECK.md`), plan §4.2.2, weights ledger | description PDF-CHECKED (plan check); no quotation, so no wording to check; any wording beyond the description PDF-UNCHECKED |
| 5 | no wording quoted: description only — cube C, surface area 54 cm², volume 27 cm³ (used only to caption cube C as the 3 cm cube) | S21/22 Q4(b), QP p.9 / MS p.14 (s21_22) | 13 (caption) | plan check row; weights ledger | description PDF-CHECKED (plan check); PDF-UNCHECKED for anything further |

Plan and plan-check wording applied (our instructions, not exam evidence, never shown as quotations on screen): the MF5 Visking sampling rules and osmometer rules; should-fix 4 ("We follow visible dye spreading through hydrated agar; colour/adsorption and visibility thresholds can affect the apparent boundary, so diameter is an operational colour-zone measure."); the 4.2.2a close sentence ("The 4.2.2a close may use Q4(c) as an agar-diffusion application; no Visking-specific question has been verified in these cited blocks."); MF2 glucose sentence; MF3 water-potential sentences; should-fix 7 safety sentence.

**UNVERIFIED items** (not quoted; shown only as our framing or omitted):
1. `UNVERIFIED — a marked Visking-tubing question` (plan register item 4). Beat 13 says so; that part of the close is labelled syllabus-based.
2. `UNVERIFIED — the exact wording of S21/22 Q4(c) and of its MS point beyond the plan check's description` (plan register item 2). Beat 13's question description is labelled *our framing*; only the order A → B → C and the indicator colours are used.
3. `UNVERIFIED — the dimensions of cubes A and B in S21/22 Q4`. They are drawn smaller than C, as the credited order implies, with the caption *dimensions of A and B not reproduced*.
4. `UNVERIFIED — a sourced measured osmometer trace for this tubing, bore and concentration`. Dataset 2 is our illustrative data, chosen to be realistic and stated with its observation interval; it is not presented as measured.
5. `UNVERIFIED — a sourced correspondence between Benedict's colours and glucose concentration for these conditions`. No concentrations are assigned to the colours; they are by-eye, illustrative results.

---

## Word count and runtime

Counted by the validator over the blockquoted narration; seconds = words ÷ 120 × 60.

| Beat | Title | Words | Seconds |
|---|---|---:|---:|
| 1 | Hook and context: watching what you cannot see | 88 | 44.0 |
| 2 | What you will be able to do | 47 | 23.5 |
| 3 | The tubing, and the two tests that read it | 92 | 46.0 |
| 4 | Filling the bag, and testing what it holds | 107 | 53.5 |
| 5 | The blank, matched tubes, and first contact | 85 | 42.5 |
| 6 | Samples at recorded times, and reading them | 93 | 46.5 |
| 7 | What crossed, and why: pores, not a membrane | 109 | 54.5 |
| 8 | The osmometer: set up, then the first real reading | 108 | 54.0 |
| 9 | The rise, explained in water potential, and its limits | 131 | 65.5 |
| 10 | Agar: a well, a dye and a clock | 98 | 49.0 |
| 11 | Measuring the blue zone, and what it cannot tell you | 122 | 61.0 |
| 12 | What I told you, on the three rigs | 87 | 43.5 |
| 13 | How it is asked, the reject card, and the invisible molecules | 123 | 61.5 |
| **Total** | 13 beats (13 teaching + 0 error) | **1290** | **645.0** (10:45) |

**Length, honestly:** **1,290 words = 10:45** at 120 words per minute, **1:15 over** the 9:30 (1,140-word) budget, all of it teaching (there are no error beats). Before saving, one round of trims was taken (−43 words: "Start with the tubing", "Now the water", the Beat 5 reagent sentence shortened, the repeated Beat 7 starch sentence moved onto the written sentence's cue, the Beat 9 and Beat 11 clock asides left to the on-screen captions, two Beat 13 phrases shortened). The remaining length comes from what the plan requires of this lesson: three complete investigations, each with named apparatus and handling, first-contact timing, compressed waiting stated, and readout interpretation with its limits (MF5, MF7, should-fix 4), plus the REAL-WORLD statements for five materials. **Cut list if the budget must be met more closely, in order** (none touches an MF5 rule, a REAL-WORLD statement or the glucose/cell-membrane contrast):
1. Beat 13, the beyond-the-mark-scheme sentence ("The scheme doesn't need this, … first acid molecules are.", −26 words) and its dashed panel.
2. Beat 1, "You cannot follow a single glucose molecule by eye." (−10 words; the magnifier moves to *far too small to see*).
3. Beat 9, "The control bag of distilled water barely moves." (−9 words; the control stays on the graph, labelled).
4. Beat 12, "And every clock started at first contact." (−7 words; the four t = 0 marks still brighten, silently, at the recap's end).
5. Beat 3, "bought dry and flat," (−4 words).

All five together save 56 words (28 s), giving 1,234 words = 10:17, still 0:47 over. Going further would remove a required element (a blank, a first-reading rule, a limit, or a material's fit statement); I recommend accepting the remaining overrun, as the checker did for 3.1.3's practical beats.

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| Plant tissue: beetroot pigment leakage (diffusion through damaged membranes), red onion plasmolysis (osmosis) | 4.2.2b |
| Agar cubes of different sizes, SA:V, thymolphthalein, time to complete decolourisation | 4.2.3-4 (named only in Beat 13 as where "why size matters" is taught) |
| Estimating a tissue's water potential; percentage mass change; W20/51 table | 4.2.5 |
| The cell-level effects of osmosis (turgid, plasmolysed, haemolysis) | 4.2.6 |
| Hazard, risk and precaution as a planning marking requirement (M24/52 Q1(c)(iii)) | 4.2.5 (taught in its method); here only safety tags at working concentrations |
| Diffusion coefficients, Fick's law, √t analysis of the agar data, osmotic-pressure calculations | not in the outcome (calibration DO-NOT-ADD); the √t pattern is an author's plausibility check only |
| Dialysis machines, kidney dialysis | not in the outcome (plan scope ceiling: no dialysis-machine detour) |
| Reflection coefficients or molecular sizes of glucose and sucrose in nanometres | not needed; the syllabus pore size and "far larger" suffice |
| Statistics on the readings | not in this AS outcome |

## Reusable models

| Model | Specified | For |
|---|---|---|
| **`VKTubingRig`** (`diffusion-bag`, `content-tests`, `blank`, `immerse`, `sample`, `benedicts-heat`, `osmometer`, `osmometer-control`; Datasets 1–2) | here | 4.2.2b (comparison thumbnail) |
| **`AgarPlateRig`** (`pour-set`, `well`, `dye`, `spreading`, `measure`; Dataset 3) | here | none downstream |
| **`meniscus-height`**, **`blue-zone-diameter`** graph configurations | here | none downstream |
| `DiffusionField` states `tubing-pores`, `agar-open` | here (base 4.2.1a) | 4.2.3-4 may reuse `agar-open`'s gel convention for its acid inset |
| `WaterPotentialModel` state `tubing-leak` | here (base 4.2.1a) | none downstream |
| `FluidMosaicMembrane`, `TransportProteinSet`, `WaterBathRig` | 4.1.1-2, 4.2.1a, Topic 3 | used by state id only |

---

## Assets

| Asset | Status | Source |
|---|---|---|
| `VKTubingRig` SVGs with named states: tubing roll, soaking beaker, knotted/tied bags, 10 cm³ syringe, three boiling tubes with 30 cm³ marks, three stopwatches, sample pipette, rinse and waste beakers, spotting tile with iodine wells, test tubes, boiling-water bath, test-tube holder, capillary osmometer and control on clamp stands with mm rulers, 250 cm³ beakers; hands (knot, rub-open, syringe fill, thread tie, rinse, lower by thread, pipette, holder) | **new build** | authored; handling specified; **rendered still-frame verification pending** (pours at 120°, syringe and dropper above the opening, level surfaces, bag fully submerged, holder on heated tubes, capillary eased in) |
| `AgarPlateRig` SVGs: dish with lid, white card, ruler under the dish, cork borer, mounted needle, dropper, methylene blue zone at decreasing intensity, measuring lines | **new build** | authored; **rendered still-frame verification pending** (borer pushed straight down, fingers clear; dropper above the well) |
| Colour swatches: Benedict's real sequence (one-frame steps), iodine two-state switch, methylene blue single hue at decreasing intensity | **new build** | authored; no RGB tween between hues |
| `DiffusionField` `tubing-pores`, `agar-open`; `WaterPotentialModel` `tubing-leak` | **new states** on existing models | 4.2.1a base |
| `meniscus-height`, `blue-zone-diameter` | **new build** | Topic 3 `RateGraph` conventions |
| `FluidMosaicMembrane`, `TransportProteinSet`, `WaterBathRig` | reuse | 4.1.1-2, 4.2.1a, Topic 3 |
| Potato-slice thumbnail (Beat 1), objectives pictograms (tied bag, rising column, spreading circle, stopwatch, touch point, magnifier), sieve pictogram, safety tags, forms surface, schematic agar cubes A–C, beyond-the-mark-scheme panel, reject card | new card content; shared surfaces | authored; no photograph, no generated image, no Cambridge artwork |
| Micrographs, photographs, real footage | none | — |

---

## Plan interpretations

1. **Thirteen beats for three investigations.** The plan's 13 teaching beats are used as: hook/context, objectives, then four Visking-diffusion beats (material and tests; filling and content tests; blanks and first contact; sampling and reading) plus one interpretation beat, two osmometer beats (set-up and first reading; readings, explanation and limits), two agar beats (set-up; measurement and limits), recap and exam close. The osmometer's limits share a beat with its explanation to keep within 13.
2. **"Separate matched vessels per sampling time"** (MF5) is implemented as three matched set-ups, each with its own bag and its own stopwatch started at its own first contact, each tube sampled once. Sampling times (3, 10, 20 min), bath volume (30 cm³ after a 2 cm³ blank) and 5 min heating are our choices, stated in Dataset 1; the bath volume was chosen so the filled bag is submerged (worked check).
3. **Initial positive tests** (MF5) are shown on the mixture before any bag meets water; the plan's starch-alone Benedict's check is shown as the interference check.
4. **Osmometer control bag of distilled water** is an addition not named in the plan: it gives "allow for initial bag displacement/stretching" (MF5) a visible reference. It costs one sentence.
5. **First reading at 1:00 after immersion; readings every 2 min to 21 min.** MF5 says "Select and state the observation interval from a workable setup, rather than inventing a meniscus trace"; the brief asks for illustrative data with realistic readings and publishes the `meniscus-height` configuration. The interval is stated before the data, the values are labelled *our illustrative data*, the trace is listed as UNVERIFIED item 4, and the longer-term behaviour is a separately captioned schematic, not data.
6. **Working concentrations** not fixed by the plan: iodine "dilute, as used for the starch test", Benedict's "as supplied", methylene blue **0.1%**, agar **2%**, capillary bore **1.0 mm**. Hazard tags use the syllabus p.58 codes for the listed solutions and precautionary handling for the dye; no hazard classification is invented beyond those codes.
7. **Model extensions.** `DiffusionField` gains `tubing-pores` and `agar-open`; `WaterPotentialModel` gains `tubing-leak`, because the 4.2.1a base state's membrane passes only water and Visking also passes sucrose (MF5; the plan's "do not claim sucrose is excluded"). Starch is drawn as a coiled chain of linked orange hexagons (glucose-token colour) so it is not confused with the green carbohydrate chains of membrane glycoproteins; dye tokens are deep-blue squares so they are not confused with pale blue water circles.
8. **Tubes numbered 1–3**, not lettered, so they are not confused with S21/22's cubes A, B, C in the close.
9. **Exam close.** S21/22 Q4(c) is used, as the plan check permits, "as an agar-diffusion application"; the mark-scheme answer (A → B → C) comes first; "why size matters" is handed to 4.2.3-4 by label; the paper's universal indicator (blue, red in acid) is kept on its own side of a divider from our methylene blue; the real-world extra about colour boundaries sits on a dashed **beyond the mark scheme** panel. Cubes A and B are drawn smaller than C as the credited order implies, captioned as a schematic reconstruction (UNVERIFIED item 3).
10. **Reject card.** No examiner reject exists for this outcome, so the card is our wording contrast on the plan's author-flagged trap "Visking tubing is a model of the cell membrane", captioned as such; no badge.
11. **Handle.** *A sieve* is our choice (the standard textbook image for dialysis tubing), converted at once into the partially-permeable sentence and bounded by the not-a-cell-membrane contrast.
12. **Hook.** Ours; the VIDEO-STRUCTURE list has no practical hook for this outcome. It is answered in Beat 13 ("You watched what they did").
13. **Glucose sentence (MF2)** is shortened to its first clause ("glucose is polar, does not cross the hydrophobic core readily, and needs a transport protein"); the facilitated-diffusion detail is 4.2.1a's and is shown only as the carrier motion.
14. **Water-potential wording (MF3).** "Distilled water is close to pure water, the reference at zero" with the on-screen scale reading *0 kPa (pure water at atmospheric pressure)*; the comparisons are labelled *initially*.

---

## Validator run

`python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.2a/STORYBOARD.md`

```
== storyboards/topic-04/4.2.2a/STORYBOARD.md
beat  words  cues maxgap  status
   1     88    10     23  ok
   2     47     4     16  ok
   3     92    11     13  ok
   4    107    15     14  ok
   5     85    10     14  ok
   6     93    11     19  ok
   7    109    12     18  ok
   8    108    13     12  ok
   9    131    18     17  ok
  10     98    11     18  ok
  11    122    15     20  ok
  12     87    11     16  ok
  13    123    14     18  ok
TOTAL words 1290  cues 155  runtime at 120 wpm 10:45.0  beats 13  failing beats 0
```

No MISSING SECTION or CITATION lines.
