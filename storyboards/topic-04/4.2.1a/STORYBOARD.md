# 4.2.1a — Passive transport: diffusion, facilitated diffusion, osmosis

**Storyboard, first draft, revised after the round-1 check (see *CHECK RESPONSE (round 1)* at the end). Cloud run 006, 27 September 2026.** No audio, no code, no render. Folder `storyboards/topic-04/4.2.1a/`. The first of two linked lessons on outcome 4.2.1; it owns simple diffusion, facilitated diffusion and osmosis, and hands active transport, endocytosis and exocytosis (and the facilitated-diffusion/active-transport comparison) to 4.2.1b. It stands alone: own hook, context, objectives, recap and exam close.
Cambridge 9700 syllabus 2025–2027, p.21. Command words **DESCRIBE AND EXPLAIN**. Budget from `TOPIC-PLAN-04-MEMBRANES.md` (§4.2.1, lesson list, words-and-runtime table) and `TOPIC-04-WEIGHTS.md` (4.2.1 row; lesson split in *Checks*): **4.2.1a 10:45 = teaching 9:30 + one complete error beat 1:15 (E45); 13 teaching beats + 1 error beat**; delivered here as **14 beats (13 teaching + 1 error)**. 4.2.1 as a whole: direct exposure in 4 of 5 cited Paper 2 blocks, 15 overlapping marks (weights; overlapping opportunities within the cited blocks, not additive topic marks). Runtime estimated at **120 words per minute of final video** (10:45 ≈ 1,290 words-equivalent; a timing estimate, not a quota).

> **4.2.1** describe and explain the processes of simple diffusion, facilitated diffusion, osmosis, active transport, endocytosis and exocytosis

(syllabus p.21; this lesson owns simple diffusion, facilitated diffusion and osmosis; active transport, endocytosis and exocytosis are 4.2.1b's and are named here only as handed off.)

**Authorities read, in full:** `work/006/SHARED-SPECS.md` (binding); `plan/topic-04/TOPIC-PLAN-04-MEMBRANES.md` (scope and evidence rules, motion and visual-integrity paragraphs, REAL-WORLD SAMPLES rule, §4.2.1 in full including MF2 and MF3 sentences, E45, the lesson list and build order, the shared-model table, the traps table, the UNVERIFIED register, the PLAN-CHECK RESPONSE); `plan/topic-04/TOPIC-04-WEIGHTS.md` (4.2.1 row and paragraph; ledger rows S21/22 Q3(b), S23/21 Q3(a), M24/22 Q1(b)(i), W22/23 Q6(a); supplementary S-E; register E45); `cloud-inputs/003/standards/VIDEO-STRUCTURE.md` (all); `CONTENT-ARCHITECTURE.md`; `SYLLABUS-9700-DETAIL.md` (Topic 4 outcomes pp.21–22; apparatus p.57; materials p.58; mathematical requirements p.63); the cleared examples `cloud-inputs/006/examples/3.1.3/STORYBOARD.md` and `cloud-inputs/006/examples/3.2.1b/STORYBOARD.md`; `cloud-inputs/003/topic-03/3.1.1-2/CHECK.md` and `3.2.2-3/CHECK.md`; the plan check `cloud-checks/006/plan/CHECK.md` (branch `origin/cloud/006-checks`); `cloud-inputs/006/evidence/GATE-CRITERIA-9700-04-CELL-MEMBRANES-AND-TRANSPORT.md` (G04), `EXAMINER-INSIGHT-9700.md`, `COMPLEXITY-CALIBRATION-9700-BIOLOGY.md` §4 (DO-NOT-ADD) and the SaveMyExams map AL 4.2.1–4.2.2 (content ceiling only). **No question paper, mark scheme or examiner report PDF was opened for this draft.** The one exam quotation used is copied from the SHARED-SPECS verbatim list (verified in the plan check); every other exam reference is the plan check's description, used as our paraphrase with its citation, or is listed as `UNVERIFIED`. **Round 1:** the independent check verified every cited QP/MS/ER page against the actual PDFs (`pdftotext -layout`); statuses below are updated from that audit, and no PDF was opened by this author.

**Build position:** fourth of the ten Topic 4 lessons: 4.1.1-2 → 4.1.3 → 4.1.4 → **4.2.1a** → 4.2.1b → 4.2.6 → 4.2.2a → 4.2.2b → 4.2.3-4 → 4.2.5.

**Models used (by state id):** `FluidMosaicMembrane` (4.1.1-2; states `full`, `highlight:intrinsic-channel`, `highlight:intrinsic-carrier`; region labels *outside the cell (watery)*, *cytoplasm (watery)*, *hydrophobic core*); `PhospholipidToken` (4.1.1-2; labels *hydrophilic head (phosphate-containing)*, *hydrophobic fatty-acid tails*); `WaterField` (4.1.1-2, as the base of `DiffusionField`).

**Models published here:** `DiffusionField` (open-boundary and membrane-crossing configurations, per-window crossing counter, fading net arrow); `TransportProteinSet` full passive states (`channel-open`, `carrier-bind`, `carrier-flip`, `carrier-release`, `carrier-reset`; 4.1.3 published the static previews, 4.2.1b adds `pump-ATP`); `WaterPotentialModel` (states `pure`, `initial`, `net-osmosis`, `equalise`; 4.2.6 adds `cell-vs-solution`). Everything drawn is a **MODEL**: molecular models carry *schematic; not to scale*; particle fields carry *particles drawn schematically; not to scale; far fewer than real*; every count on screen is *illustrative counts* (see *Datasets*).

---

## The causal spine

One idea carries the lesson: **particles move randomly because of their kinetic energy, so wherever there is a difference, more of them cross from where there are more (or, for water, from the higher water potential) than the reverse: a net movement that needs no ATP.** The membrane then decides the route: small non-polar molecules straight through the bilayer; ions and polar molecules through a channel or a carrier protein (in the passive routes taught here, net movement through these proteins is down the concentration gradient, without ATP: facilitated diffusion); water by osmosis.

> **Particles move randomly because of their kinetic energy; where there is a concentration gradient, more move from the higher to the lower concentration than the reverse, so there is a net movement down the gradient until the concentrations are equal, after which movement continues both ways with no net movement. This is passive: no energy from ATP is used. Small, non-polar molecules such as oxygen cross the phospholipid bilayer directly (simple diffusion). Ions and polar molecules such as glucose do not cross the hydrophobic core readily. In the passive routes taught here, their net movement through the hydrophilic pore of a channel protein, or by a carrier protein that binds them and changes shape, is down their gradient and without ATP (facilitated diffusion). Osmosis is the net movement of water molecules from a region of higher water potential to a region of lower water potential, through a partially permeable membrane.**

**What the mark schemes credit, quoted:** [R23 p.12, June 2023 P21 Q3(a)] “Most incorrect answers stated that glucose was too large.” (**PDF-CHECKED (plan check)**; the only verbatim exam string in this lesson). Everything else is the plan check's description, used as **our paraphrase** with its citation and never on a quote card: [S23/21 Q3(a), 1 mark, MS p.11] polar / water-soluble / hydrophilic substances and the bilayer core are credited; the scheme ignores size-only, active transport and facilitated diffusion at this point. [M24/22 Q1(b)(i), 1 mark, MS p.5] sodium ions' charge and the hydrophobic / non-polar bilayer (a sodium-ion question, not a second glucose question). [S21/22 Q3(b), 2 marks, QP p.6 / MS p.12] steroid hormone S: any two of three listed points: passage through the bilayer / its core; a non-polar / lipid-soluble property (alternatives within one point); small size (credited in this particular question). [W22/23 Q6(a), 1 mark, QP p.15 / MS p.19] ion transport through a membrane protein (hydrogencarbonate/chloride in lung-capillary red cells; E43, owned by 4.1.3; recalled here only as the protein route, not re-quoted). The S23/21, M24/22, S21/22 and W22/23 descriptions are **PDF-CHECKED (round-1 check, actual PDFs)**. The syllabus supplies the process names verbatim (p.21). So the spine is what is credited: the property of the substance (polar, charged, non-polar/lipid-soluble) linked to the hydrophobic core of the bilayer, and the protein route for what cannot cross the core readily.

**Plan wording applied (MF2, glucose):** *Glucose is polar and does not cross the hydrophobic bilayer core readily; it needs a transport protein. In our facilitated-diffusion example, a carrier moves glucose down its concentration gradient without ATP. The protein requirement alone does not establish the direction or energy requirement of every glucose-transport system. In S23/21 Q3(a), naming facilitated diffusion is not the credited reason; state polarity and the hydrophobic bilayer first.* Carried in substance by Beats 7, 9, 10 and 14.

**Plan wording applied (MF3, water potential):** *Water potential describes water's tendency to move. Pure water at atmospheric pressure is the reference, with water potential 0 kPa. At the same temperature and pressure, adding solute lowers water potential, so the solutions in this comparison have negative values; a less negative value is higher. Net osmosis is from higher to lower water potential through a partially permeable membrane. Water still crosses both ways when the water potentials are equal.* Carried in substance by Beats 11 and 12; higher/lower comparisons are labelled *initially:* (initial condition); the net arrow fades at equality while crossings continue.

**The handle:** *a door in a wall*, for a channel protein. Converted at once, in the same breath (Beat 8): *a channel protein provides a hydrophilic pore through which particular ions or polar molecules diffuse down their concentration gradient.* The handle is never the exam answer; on screen it carries the tag *handle, not an exam answer*. In our model the pore stays open (gating is not taught). The carrier's "revolving door" handle belongs to 4.2.1b and is not used here.

**The framing (why it exists):** cells exchange substances with their surroundings all the time, and passive routes let them do much of it without spending ATP; the membrane decides which substance can take which route (Beat 4, returning in Beats 13 and 14).

**Typicality rules applied.** "Particular" ions for a channel, never "any"; "different channels let through different, particular ions" (should-fix 6). Glucose's carrier is **our facilitated-diffusion example**, with the caution that needing a protein does not by itself fix direction or energy source for every glucose transporter (MF2). "Does not cross the core readily", never "cannot cross the membrane" (the E43 contrast owned by 4.1.3). Water crosses "the bilayer and, in many cells, channel proteins" (aquaporins named as "in many cells", not taught). The factors on the rate of diffusion are directions of effect only, no equation (DO-NOT-ADD: no Fick's law). The oxygen example is said as freely dissolved oxygen (not haemoglobin-bound) diffusing from the plasma into a red blood cell taking up oxygen in a lung capillary, a bounded example, not a universal gradient. A protein requirement is never on its own the reason a route is called facilitated diffusion: the passive condition (net movement down the gradient, without ATP) is stated at each classification (Beats 7, 13). Reasons students err are phrased as possibilities ("It can feel right, since…"). The phrase "concentration of water" is never used; osmosis is only in water-potential terms; solute potential and pressure potential are never named (4.2.6 exclusion). E45's evidence keeps the subgroup "incorrect answers"; never "most candidates".

**One error beat, five moves** (announce → written card → 4 s silent read → cue-synced talk-through → correct in place): **E45 in Beat 10**, badge **COMMON MISTAKE**, basis an examiner-report diagnosis ([R23 p.12, June 2023 P21 Q3(a)] “Most incorrect answers stated that glucose was too large.”, PDF-CHECKED (plan check)) with the S23/21 Q3(a) MS p.11 description (polarity and the bilayer core credited; size-only, active transport and facilitated diffusion ignored at that point). The card is labelled *our framing of S23/21 Q3(a); constructed answer, not a transcript*. One fault; the marker clears only on the completed correct frame. No other beat carries a badge; Beat 14's reject card is captioned as our wording contrast.

---

## The models, specified once

Orientation fixed across the topic: **outside the cell at the top, cytoplasm at the bottom**; in membrane-crossing scenes the gradient runs **across the membrane, along its normal**; the left-to-right `WaterPotentialModel` explicitly rotates and relabels its membrane. Colour roles (house palette mapping by the builder; same role, same colour): phospholipid head warm amber; tails mid grey; proteins teal; cholesterol ochre; carbohydrate chains green bead chains; water tokens small pale blue circles; glucose tokens orange hexagons; sucrose tokens larger orange double-hexagons; ion tokens small violet circles with + or −; O₂ tokens two joined red circles (a token, not a bond diagram); ligand shapes magenta; ATP token yellow rounded tag. Error treatment terracotta.

### `DiffusionField` (published here; reused by 4.2.1b recall, 4.2.2a, 4.2.3-4)

Built on 4.1.1-2's `WaterField`: water tokens with random motion (each token moves in short straight runs and changes direction on collision; speed set by a temperature parameter). `DiffusionField` adds solute tokens with a **left-high / right-low** distribution, a boundary as the lesson needs, a **net-movement arrow** and a **crossing counter** reading *left → right: n · right → left: m*. Caption *particles drawn schematically; not to scale; far fewer than real*. At equilibrium motion continues both ways, the counter's two numbers run level and the net arrow fades; **the motion never freezes**.

Specified here in detail:
- **Counter convention.** The counter shows crossings **in a 5 s window of the animation** (subtitle *crossings in each 5 s window; illustrative counts*); it is not cumulative, so its two numbers can run level at equilibrium. A small count tag on each side shows the current number of solute tokens on that side. The counted windows are staged at their stated teaching cues. Every displayed crossing increments its counter and updates the side counts. Between demonstrated windows, retain the last result with the label “last completed window”; any continuing cross-boundary movement must remain counted. At equal concentrations the deliberately balanced scripted counts illustrate equal average fluxes, not a rule that every real five-second sample has identical counts.
- **Membrane demonstrations (continuity contract, Dataset 2).** Each membrane example is a separately set finite-particle demonstration, not a continuation of the previous example's populations. Show “new illustrative setup” while the existing membrane or particle scaffold stays visible and the tokens are reset. At the start, label each side's number “set starting count”; during the counted sequence update live side totals on every actual crossing. Do not add or delete tokens during that sequence. At its end, retain the final populations and display the completed counter as “last completed demonstration”. Any replay starts with an explicit labelled reset. Counts are scripted illustrative events, not experimental readings or predicted exact outcomes of a random simulation. The O₂ and ion demonstrations use a 5 s animation window; **the carrier (glucose) demonstration is the exception: a 16 s animation window** (four cycles at 2.7 s each plus the empty carrier's reorientation), captioned *crossings in this 16 s illustrative demonstration; not comparable rates between transport routes*. This is animation time, not a biological transport rate.
- **Configuration `open`**: rectangular field, a dashed vertical line down the middle labelled *middle line (no membrane)*; solute tokens are O₂ tokens labelled *oxygen (dissolved)*; starting counts 30 left / 10 right (Dataset 1).
- **Configuration `membrane`**: the field **rotates 90°** so the high side is at the **top**, relabelled *outside the cell (watery)*; the low side at the bottom, *cytoplasm (watery)*; the counter relabels *outside → cytoplasm: n · cytoplasm → outside: m*; a `FluidMosaicMembrane` `full` section slides in horizontally across the middle; the gradient wedge redraws vertically, along the membrane normal. Solute sets used: O₂ (simple diffusion, through the bilayer between phospholipids), ions (+, through `intrinsic-channel`), glucose (through `intrinsic-carrier`). Counts per Dataset 2.
- **Net arrow**: grows from zero along the direction of net movement when a window's two counts differ; length proportional to the net count in the last window; fades over 1 s when the counts run level. Label per scene (*net movement*, *net movement: simple diffusion*, *net movement: facilitated diffusion*).
- **Turn-back motion** (used for ions and glucose at the core): the token drifts down through the head region, stalls where the tails begin, and drifts back up (1.5 s); caption *does not cross the core readily (schematic)*. Never shown bouncing off the head region as if the whole membrane were a wall.
- **Temperature parameter**: raising it lengthens token runs per second (faster motion); used only qualitatively in Beat 6 with a thermometer icon and no number.

### `TransportProteinSet` — full passive states (published here; 4.1.3 published static previews; 4.2.1b adds `pump-ATP`)

Mounted in `FluidMosaicMembrane` at `intrinsic-channel` (positions 4–5) and `intrinsic-carrier` (positions 10–11), both drawn spanning the bilayer (transmembrane examples of intrinsic proteins, should-fix 1), teal. Labels **channel protein**, **carrier protein**, **binding site**. Caption *schematic; not to scale*.
- **`channel-open`**: a central pore lined by hydrophilic R groups (drawn as a light core with small polar dots along its lining, label *hydrophilic pore*). Ion tokens (or polar tokens) near the pore mouth enter it and pass through, down the gradient, never touching the hydrophobic core; occasional passages the other way are shown so the counter reads both directions. **The channel never changes shape**; its outline is fixed through every frame (tag *shape unchanged* available). In our model the pore stays open; no gate is drawn (tag *our model: pore open; gating not taught*).
- **`carrier-bind` → `carrier-flip` → `carrier-release` → `carrier-reset`**: rest shape has the **binding-site notch facing outside**. `carrier-bind`: a glucose token seats in the notch (0.6 s). `carrier-flip`: the protein changes shape over 0.8 s, silhouettes interpolating continuously (**motion; no cut**), so the notch faces the cytoplasm. `carrier-release`: the token leaves into the cytoplasm (0.5 s). `carrier-reset`: the empty protein returns to its rest shape (0.8 s). A **reverse cycle** is also specified (the empty carrier first reorients over 0.8 s so the notch faces the cytoplasm; a cytoplasm-side token seats, 0.6 s; the protein changes shape back, 0.8 s; the token is released outside, 0.5 s), used so the counter can show both directions; no instantaneous flipping. At no frame is the binding site an open pore through both faces; outer access closes before inner access opens, and conversely in the reverse cycle. No ATP token appears in any passive state; the tag *no ATP used* (a greyed ATP token struck through) is available.
- Handling: none (molecular model).

### `WaterPotentialModel` (published here; 4.2.6 adds `cell-vs-solution`; reused by 4.2.2a, 4.2.2b, 4.2.5)

Two equal compartments **left and right**, separated by a partially permeable membrane strip drawn **vertically**, its normal horizontal (should-fix 2), labelled *partially permeable membrane (rotated: compartments left and right; not a cell)*. The strip is a short bilayer segment (amber heads, grey tails, no carbohydrate chains, since no cell outside/inside is defined in this model) with narrow gaps that, **in this model**, only water tokens pass; caption *schematic; not to scale; in real membranes water crosses the bilayer and, in many cells, channel proteins*. Water tokens (pale blue) in random motion in both compartments; solute tokens are **sucrose** (larger orange double-hexagons), which approach the gaps and turn back. Beside the model, a vertical **water-potential scale**: top tick **0 kPa — pure water at atmospheric pressure (reference)**; downward arrow *more negative ↓*; **no other numbers**. Two markers, **L** and **R**, show each compartment's water potential on the scale. Tag *same temperature and pressure both sides* throughout. Counter *left → right: n · right → left: m* (per 5 s window, *illustrative counts*). Compartment volumes are held fixed in this schematic: volume change is not modelled (4.2.2a's osmometer and 4.2.6's cells show volume effects). Caption, on screen whenever the model is: **conceptual comparison at fixed volume, temperature and pressure; not an osmometer; volume changes not modelled**. The water-only gaps are a generic model barrier, captioned conspicuously as such; any real-cell inset draws a continuous bilayer plus an actual teal water-channel protein, never a naked permanent hole through exposed tails, and water passing directly through the bilayer never requires a macroscopic tear (guard carried to 4.2.6's reuse).

States:
- **`pure`**: both compartments pure water; L and R both at the 0 kPa tick; label *pure water* on each side.
- **`initial`**: a dropper icon held **above** each compartment (never touching) releases sucrose tokens: 4 into the left, 12 into the right; as each lands, that compartment's marker slides down the scale (left a little, right further). Labels *initially: higher water potential (less negative)* on the left, *initially: lower water potential (more negative)* on the right.
- **`net-osmosis`**: water tokens cross the gaps both ways; the counter shows more left → right (window 15 · 9); net arrow left → right, labelled **net movement of water by osmosis**; a sucrose token approaches a gap and turns back (tag *in this model the membrane lets water through, not sucrose*).
- **`equalise`**: caption *we change the left solution*; the dropper adds 8 more sucrose tokens to the left (4 → 12) (equality reached by intervention, not by water flow equalising two unchanged solutions); the unequal and equal solutions are labelled comparison states; marker L slides down to meet R; tag *equal water potentials*; the *initially:* labels dim to small history text; over the next window the counts run level (12 · 12) and **the net arrow fades over 1 s while crossings continue both ways**; tag *no net movement; crossings continue*.

### `FluidMosaicMembrane`, `PhospholipidToken`, `WaterField` (4.1.1-2; used by state id)

Used exactly as SHARED-SPECS §4 specifies: 12 phospholipids per leaflet, components at their fixed positions, heads always to water, tails never in water, carbohydrate chains only on the external (top) face, lateral drift only, no flip-flop. States used: `full`; `highlight:intrinsic-channel`; `highlight:intrinsic-carrier` (the component brightens, others dim to 50%). No new state is added.

---

## Beat by beat

Beat windows in the headings are provisional and follow the per-beat ledger (words ÷ 120, plus the 4 s silent read added to Beat 10's window, per the MF7 convention in SHARED-SPECS §2a); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch over 30 words without a stated visual change.

### BEAT 1 · Hook and context · 0:00–0:48
**Narration:**
> Ever wondered how sugar gets into a cell, when the membrane is built to keep water-loving things out? Your cells trade with their surroundings all the time. In your lungs, oxygen moves into red blood cells. Glucose dissolved in your blood plasma reaches cells that use it in respiration. Water moves into and out of cells constantly. Yet a cell surface membrane has a hydrophobic core, and glucose, a polar molecule, does not cross that core readily. So how does it get in? And how much of this traffic costs the cell any energy at all?

**Visual action:**
1. **From the first frame**, a `FluidMosaicMembrane` `full` section fills the lower two-thirds of the frame (outside at the top, cytoplasm below; region labels not yet shown), caption *schematic; not to scale*; a few glucose tokens (orange hexagons) drift in the watery space above it. At *how sugar gets into a cell*, the hook question appears as a compact caption above the membrane.
2. At *built to keep water-loving things out*, the band of tails glows faintly grey (no label yet).
3. At *trade with their surroundings*, the membrane section slides down to a strip along the bottom and three small schematic vignettes open above it, left to right, each drawn in vector with the colour roles.
4. At *oxygen moves into red blood cells*, vignette 1: an alveolus outline beside a capillary segment holding a red blood cell; O₂ tokens drift from the alveolus side into the red blood cell (motion); tag *Topic 9 context: named, not taught*.
5. At *reaches cells that use it in respiration*, vignette 2: a cell outline beside a short blood-vessel segment; glucose tokens drift from the plasma to the cell and pass in (motion) at a small teal transport-protein symbol on the cell boundary; tag *used in respiration*.
6. At *Water moves into and out of cells*, vignette 3: a cell outline with water tokens crossing its edge in both directions (motion).
7. At *has a hydrophobic core*, the vignettes shrink to thumbnails along the top and the membrane returns full size; region label **hydrophobic core** appears on the tail band.
8. At *a polar molecule*, one glucose token above the membrane is labelled **glucose (polar)**.
9. At *So how does it get in?*, a question tag hovers over that glucose token.
10. At *costs the cell any energy at all*, a small ATP token (yellow rounded tag) appears beside the membrane with a question tag; dissolve to the objectives surface.

**On-screen text:** the hook question; *Topic 9 context: named, not taught*; *used in respiration*; *hydrophobic core*; *glucose (polar)*; *schematic; not to scale*.

---

### BEAT 2 · What you will be able to do · 0:48–1:13
**Narration:**
> By the end you will be able to explain diffusion as a net movement down a concentration gradient, and why it is passive; to say which substances cross the bilayer directly and which need a channel protein or a carrier protein; and to explain osmosis in terms of water potential.

**Visual action:**
1. **From the first frame**, the objectives surface is on screen: its own styled surface on a distinct background colour, **not the lesson diagram**, with three flat authored pictograms already placed in a column at left (a cluster of dots with one arrow; a door set in a wall; a water drop beside a short vertical scale). Each line enters with motion beside its pictogram.
2. At *explain diffusion as a net movement*, line 1 enters beside the dots-and-arrow pictogram.
3. At *which substances cross the bilayer directly*, line 2 enters beside the door-in-wall pictogram.
4. At *explain osmosis in terms of water potential*, line 3 enters beside the water-drop-and-scale pictogram.
   1. **EXPLAIN** diffusion as net movement down a concentration gradient, and why it is passive
   2. **SORT** what crosses the bilayer directly and what needs a channel or carrier protein
   3. **EXPLAIN** osmosis in water-potential terms

**On-screen text:** the three lines. Small type: *syllabus 4.2.1, "describe and explain", p.21; this lesson: simple diffusion, facilitated diffusion, osmosis.*

---

### BEAT 3 · Random movement, net movement · 1:13–2:04
**Narration:**
> Start with the particles themselves. Molecules in a liquid or a gas are constantly moving at random, because of their kinetic energy, colliding and changing direction. Put more of them on the left than on the right, and watch the counter in the middle. Particles cross both ways, but more cross from left to right, simply because more are there to make the trip. That difference is a net movement, down the concentration gradient. So diffusion is the net movement of particles from a region of higher concentration to a region of lower concentration, as a result of their random movement.

**Visual action:**
1. **From the first frame**, `DiffusionField` in configuration `open` fills the frame: water tokens in random motion, a dashed vertical line down the middle labelled *middle line (no membrane)*, caption *particles drawn schematically; not to scale; far fewer than real*.
2. At *constantly moving at random*, one water token is highlighted and a fading trail shows its zigzag path.
3. At *colliding and changing direction*, two highlighted tokens meet and rebound in new directions.
4. At *Put more of them on the left*, 40 O₂ tokens drift in from the edges and settle **30 on the left, 10 on the right**, labelled *oxygen (dissolved)*; side count tags **30** and **10**; tags *left: higher concentration* and *right: lower concentration*.
5. At *watch the counter in the middle*, the crossing counter appears on the dashed line: *left → right: 0 · right → left: 0*, subtitle *crossings in each 5 s window; illustrative counts*.
6. At *Particles cross both ways*, individual O₂ tokens cross the line in both directions (motion), each crossing ticking its side of the counter and updating the side counts live.
7. At *more cross from left to right*, the first window closes at **12 · 4**; the live side tags have reached **22** and **18**; the counter holds, labelled *last completed window*.
8. At *a net movement, down the concentration gradient*, the net-movement arrow grows left → right, labelled **net movement**; a gradient wedge beneath the field is labelled *concentration gradient: higher → lower*.
9. At *So diffusion is the net movement*, the definition builds beneath the field clause by clause: **Diffusion: net movement of particles · from higher to lower concentration · as a result of their random movement.**

**On-screen text:** *middle line (no membrane)*; the counter; *oxygen (dissolved)*; side counts; *net movement*; *concentration gradient: higher → lower*; the definition; the particle-field caption.

---

### BEAT 4 · Equal, but still moving; and why passive matters · 2:04–2:55
**Narration:**
> Keep watching. As the two sides even out, the counts come closer, until the concentrations are equal and the two numbers run level. The particles have not stopped: they still move and still cross both ways, but there is no net movement now, so the arrow fades. And notice what drove all of this: the particles' own kinetic energy, and no ATP from a cell. That is what passive means. It matters because cells exchange substances with their surroundings all the time, and passive routes let them do a lot of it without spending ATP. The membrane decides which substance takes which route.

**Visual action:**
1. **From the first frame**, the same `DiffusionField` `open` holds, counter reading 12 · 4, side tags 22 and 18, net arrow at full length; the motion continues.
2. At *the counts come closer*, the second window closes at **9 · 7**; the side tags, updated on every crossing, have reached **20** and **20**; the net arrow shortens.
3. At *the two numbers run level*, the third window closes at **8 · 8** (deliberately balanced scripted counts: equal average fluxes, not identical counts in every real sample); tag *concentrations equal*; the counter holds, labelled *last completed window*.
4. At *still cross both ways*, O₂ tokens keep crossing in both directions (motion never freezes); a highlight follows one token across and another back; each continuing crossing still ticks a live counter and the side counts (paired crossings return them to 20 · 20).
5. At *so the arrow fades*, the net arrow fades over 1 s; tag *no net movement; movement continues*.
6. At *what drove all of this*, motion trails on several tokens pulse, tag *kinetic energy of the particles*.
7. At *no ATP from a cell*, a greyed ATP token appears beside the field and is struck through, tag *no ATP used*.
8. At *That is what passive means*, the label **passive** lands above the field.
9. At *cells exchange substances*, the field shrinks to the upper left; the Beat 1 membrane section returns at centre with O₂, ion (violet +), glucose and water tokens above it (no crossing yet).
10. At *which substance takes which route*, four empty route slots appear at right: *through the bilayer · channel protein · carrier protein · water: osmosis*.

**On-screen text:** counter and side counts; *concentrations equal*; *no net movement; movement continues*; *kinetic energy of the particles*; *no ATP used*; **passive**; the four route slots.

---

### BEAT 5 · Simple diffusion: straight through the bilayer · 2:55–3:45
**Narration:**
> Now put a membrane in the way. Turn the field so the outside of the cell is at the top and the cytoplasm below, then slide in a phospholipid bilayer, with the gradient running across it. Our example is a red blood cell taking up oxygen in a lung capillary. Here we track freely dissolved oxygen, not oxygen bound to haemoglobin: it diffuses from the surrounding plasma into the cell. Oxygen molecules are small and non-polar, so they pass straight through the bilayer, hydrophobic core included, down their concentration gradient. That is simple diffusion: no transport protein needed.

**Visual action:**
1. **From the first frame**, the Beat 4 layout holds: `DiffusionField` `open` (equal, 20 · 20) small at upper left, the membrane section at centre, the route slots at right. At *put a membrane in the way*, the field enlarges to centre and the loose membrane section slides aside.
2. At *Turn the field so the outside*, the field **rotates 90°** (configuration `membrane`): its labels change to *outside the cell (watery)* at the top and *cytoplasm (watery)* at the bottom; the counter relabels *outside → cytoplasm · cytoplasm → outside*.
3. At *slide in a phospholipid bilayer*, `FluidMosaicMembrane` `full` slides in horizontally across the middle, carbohydrate chains on the top face, region label **hydrophobic core**, caption *schematic; not to scale*; the gradient wedge redraws **vertically, along the membrane normal**.
4. At *a red blood cell taking up oxygen*, an inset opens at upper right: alveolus, capillary and red blood cell, with a small ring on the red blood cell's membrane marking where this section sits; labels *outside: blood plasma* and *inside: red blood cell cytoplasm*; tag *Topic 9 context: named, not taught*.
5. At *Here we track freely dissolved oxygen* (the check's cue *from the air in the alveoli* no longer exists after M4; same action, remapped), retain the lung-context inset and explicitly initialise a new illustrative membrane comparison with 24 oxygen tokens outside and 8 inside. Caption: new setup; set starting counts, not a continuation of the 20/20 field. The alveolar context animation does not create or remove uncounted particles within the finite counted demonstration.
6. At *not oxygen bound to haemoglobin*, the caption **freely dissolved O₂; haemoglobin-bound oxygen not counted; illustrative gradient during uptake** lands beside the O₂ populations; at *from the surrounding plasma into the cell*, tags *higher* (top) and *lower* (bottom) land beside the side counts.
7. At *small and non-polar*, one O₂ token enlarges in a callout, tagged *small · non-polar*.
8. At *pass straight through the bilayer*, the 5 s counted sequence runs: O₂ tokens pass down between phospholipids, through the core (motion), and a few pass up, each crossing updating the live side totals; after six inward and two outward crossings the counter shows **6 · 2** and the populations **20** outside / **12** inside; the counter holds, labelled *last completed demonstration*; the net arrow grows downward, labelled *net movement: simple diffusion*.
9. At *That is simple diffusion*, small type beside the callout: *CO₂ crosses the bilayer the same way (not animated here)*; route slot 1 fills: **simple diffusion: through the bilayer**; tag *no transport protein*.

**On-screen text:** region and side labels; *new setup; set starting counts*; *freely dissolved O₂; haemoglobin-bound oxygen not counted; illustrative gradient during uptake*; *last completed demonstration*; the inset labels; *small · non-polar*; *net movement: simple diffusion*; the CO₂ note; route slot 1.

---

### BEAT 6 · What makes net diffusion faster · 3:45–4:24
**Narration:**
> What makes net diffusion faster? A steeper concentration gradient: a bigger difference between the sides gives a bigger gap between the two counts. A higher temperature: the particles have more kinetic energy and move faster. A larger surface area to cross, and a shorter distance to travel: you will calculate and test those in the surface-area lesson. For bilayer passage, molecular size and lipid solubility also matter; small, non-polar molecules cross readily. No equation needed here, just the direction of each effect.

**Visual action:**
1. **From the first frame**, retain the completed Beat 5 demonstration at 20/12 with its last completed counter 6/2 (net arrow down). At *What makes net diffusion faster*, a factor panel opens at right, headed *faster net diffusion · qualitative; no equation*.
2. At *A steeper concentration gradient*, show a labelled new comparison, reset to 32/8, with the same area, temperature, membrane and 5 s observation window as the 24/8 comparison. Animate eight inward and two outward crossings, ending 26/14. Panel row 1 *steeper gradient*.
3. At *a bigger gap between the two counts*, highlight the completed net comparison 6 versus 4; if the window has not finished, allow it to finish before revealing that result. The counter holds at **8 · 2**, labelled *last completed demonstration*; the net arrow lengthens; small type *net 6 in this 5 s window, was 4*.
4. At *A higher temperature*, the baseline conditions are explicitly restored first (labelled reset to the 24/8 setup, original temperature and width; side tags and counter set aside with the tag *qualitative; not counted*); then only the thermometer icon beside the scene rises (no number); token runs lengthen and motion speeds up; panel row 2 *higher temperature*.
5. At *more kinetic energy*, the motion trails pulse, tag *more kinetic energy*.
6. At *A larger surface area*, the baseline is restored first (the thermometer returns to its original level; tag *same gradient and temperature*); then only the membrane section widens by half as much again (the same components repeated), more tokens crossing (qualitative; not counted); panel row 3 *larger surface area*.
7. At *a shorter distance to travel*, the width returns to baseline; a small inset compares a thick and a thin barrier under the same conditions (tag *only thickness differs*) with a path arrow across each, the shorter path tagged *shorter distance*; panel row 4.
8. At *the surface-area lesson*, rows 3 and 4 gain the tag *calculated and tested in 4.2.3-4*.
9. At *For bilayer passage*, panel row 5 *for bilayer passage: size and lipid solubility matter; small, non-polar molecules cross readily*; an O₂ token passes the core while a glucose token held above the membrane stays outside (no crossing shown).
10. At *No equation needed*, the panel header brightens *direction of each effect only*; the scene shows, after a labelled reset, the retained steeper-gradient result (26 outside / 14 inside, counter 8 · 2, *last completed demonstration*).

**On-screen text:** the factor panel (five rows); *new comparison; set starting counts*; *net 6 in this 5 s window, was 4*; *last completed demonstration*; *qualitative; not counted*; *same gradient and temperature*; *only thickness differs*; *more kinetic energy*; *shorter distance*; *calculated and tested in 4.2.3-4*.

---

### BEAT 7 · Turned back at the core: why some need a protein · 4:24–5:07
**Narration:**
> Now the hook's problem. The core of the bilayer is made of fatty-acid tails, and it is hydrophobic. Ions are charged, and glucose is polar: both interact well with water, and poorly with that core. Watch an ion and a glucose molecule approach it and turn back. Glucose is polar and does not cross the hydrophobic bilayer core readily; it needs a transport protein. Ions need a protein route too. In the passive routes shown here, net movement through these proteins is down the concentration gradient, without ATP: facilitated diffusion.

**Visual action:**
1. **From the first frame**, the membrane scene holds with the O₂ tokens dimmed; ion tokens (violet +) and glucose tokens (orange hexagons) sit in the outside and cytoplasm regions, more of each outside (ions 20 / 5; glucose 15 / 5). At *Now the hook's problem*, the Beat 1 hook caption returns small at the top.
2. At *made of fatty-acid tails*, the tail band is highlighted and labelled *hydrophobic fatty-acid tails* (`PhospholipidToken` label, recall 4.1.1-2).
3. At *Ions are charged*, one ion token is labelled *ion (charged)*; at *and glucose is polar*, one glucose token is labelled *glucose (polar)*.
4. At *interact well with water*, water tokens cluster loosely around the labelled ion and glucose tokens as they move (motion).
5. At *approach it and turn back*, the ion and then the glucose token drift down through the head region, stall where the tails begin, and drift back up (turn-back motion, 1.5 s each); caption *does not cross the core readily (schematic)*.
6. At *does not cross the hydrophobic bilayer core readily*, the sentence builds beneath the membrane: **Glucose is polar and does not cross the hydrophobic bilayer core readily; it needs a transport protein.**
7. At *Ions need a protein route too*, `highlight:intrinsic-channel` and then `highlight:intrinsic-carrier` (each brightens, others dim to 50%).
8. At *In the passive routes shown here*, a bracket spans route slots 2 and 3; at *through these proteins*, the two highlighted proteins are labelled **channel protein** and **carrier protein**; at *without ATP: facilitated diffusion*, the bracket is labelled **facilitated diffusion**, with tags *net movement down the gradient · no ATP · through a protein*.

**On-screen text:** *hydrophobic fatty-acid tails*; *ion (charged)*; *glucose (polar)*; *does not cross the core readily (schematic)*; the MF2 sentence; *facilitated diffusion*; *net movement down the gradient · no ATP · through a protein*; *channel protein*; *carrier protein*.

---

### BEAT 8 · A channel protein: a door in a wall · 5:07–5:54
**Narration:**
> The first is a channel protein. Picture a door in a wall. Written properly: a channel protein provides a hydrophilic pore through which particular ions or polar molecules diffuse down their concentration gradient. Watch the ions: each drifts into the pore, lined by hydrophilic parts of the protein, and out the other side, without meeting the hydrophobic core. A few go the other way, but more go down the gradient. The channel does not change shape to move them; in our model the pore simply stays open. Different channels let through different, particular ions.

**Visual action:**
1. **From the first frame**, the membrane scene zooms to the `intrinsic-channel` (highlighted), the carrier dimmed at right; caption *new illustrative setup*: ion tokens reset to **20** outside / **5** inside, each tagged *set starting count*. At *The first is a channel protein*, the label **channel protein** brightens.
2. At *Picture a door in a wall*, a small flat door-in-wall pictogram appears in the corner, tag *handle, not an exam answer*.
3. At *Written properly*, a sentence surface slides up under the membrane; at *provides a hydrophilic pore*, the first clause lands and the pore's light core is ringed, label **hydrophilic pore**; at *diffuse down their concentration gradient*, the sentence completes: **A channel protein provides a hydrophilic pore through which particular ions or polar molecules diffuse down their concentration gradient.**
4. At *Watch the ions*, `channel-open` in a magnified pore callout beside the field (mechanism view, tag *mechanism view; not counted*; its token is not one of the counted field's tokens): an ion enters the pore mouth and passes through (motion).
5. At *lined by hydrophilic parts*, the polar dots along the pore lining pulse, label *lined by hydrophilic R groups*; at *without meeting the hydrophobic core*, the 5 s counted sequence starts in the field: ion tokens near the outer mouth enter the pore and pass through to the cytoplasm (motion), each crossing ticking the counter and updating the live side totals.
6. At *A few go the other way*, ions pass upward through the pore and tick the counter; the 5 s counted sequence completes at eight inward and two outward crossings, **8 · 2**, the live side totals ending **14** outside / **11** inside; the counter holds, labelled *last completed demonstration*; the net arrow grows downward, labelled *net movement: facilitated diffusion*.
7. At *does not change shape*, the channel outline is traced once and holds fixed, tag *shape unchanged*.
8. At *the pore simply stays open*, tag *our model: pore open; gating not taught*.
9. At *Different channels let through*, a second channel ghost appears beside the first with a violet − token passing through it, tag *each channel: particular ions*; route slot 2 fills: **channel protein: hydrophilic pore**.

**On-screen text:** *new illustrative setup*; *set starting count*; *last completed demonstration*; the handle tag; the channel sentence; *hydrophilic pore*; *lined by hydrophilic R groups*; *net movement: facilitated diffusion*; *shape unchanged*; *our model: pore open; gating not taught*; *each channel: particular ions*; route slot 2.

---

### BEAT 9 · A carrier protein: glucose, down its gradient, no ATP · 5:54–6:41
**Narration:**
> The second is a carrier protein, and glucose is our example. A glucose molecule outside fits into a binding site on the carrier. The carrier changes shape, so the binding site now faces the cytoplasm; the glucose is released, and the carrier returns to its first shape. In our facilitated-diffusion example, the carrier moves glucose down its concentration gradient without ATP. It can carry either way, just more often from the side with more glucose. One caution: needing a protein does not, by itself, fix the direction or the energy source of every glucose transporter.

**Visual action:**
1. **From the first frame**, the membrane scene zooms to the `intrinsic-carrier` (highlighted) in its rest shape, notch facing outside; glucose tokens 15 outside / 5 inside; the channel dimmed at left; the side count tags are set aside during the uncounted mechanism demonstration (actions 2–5, tag *mechanism demonstration; not counted*). At *The second is a carrier protein*, the label **carrier protein** brightens.
2. At *fits into a binding site*, `carrier-bind`: a glucose token seats in the notch (0.6 s); label **binding site**.
3. At *The carrier changes shape*, `carrier-flip`: the protein changes shape over 0.8 s, silhouettes interpolating (motion, no cut), the notch now facing the cytoplasm.
4. At *the glucose is released*, `carrier-release`: the token leaves into the cytoplasm (0.5 s).
5. At *returns to its first shape*, `carrier-reset`: the empty protein returns to its rest shape (0.8 s).
6. Keep the first slow binding/change-of-shape/release/reset cycle (actions 2–5) as an uncounted mechanism demonstration. At *without ATP*, show “new counted demonstration”, reset the finite field to 15/5, and start a **16 s animation window**, captioned “crossings in this 16 s illustrative demonstration; not comparable rates between transport routes”; tags *down its concentration gradient* and *no ATP used* (the greyed, struck ATP token from Beat 4, small); caption *our facilitated-diffusion example*. Show three inward cycles and one outward cycle, including the empty carrier's necessary reorientation before binding on the opposite side. Retain the published 0.6/0.8/0.5/0.8 s motion timings; no instantaneous flipping or unlabelled acceleration. Counters tick only on actual releases to the other compartment; live populations finish 13/7. Schedule (animation seconds from the cue): reverse cycle 0.0–2.7 (empty reorientation 0.8, bind 0.6, change shape 0.8, release outside 0.5 → 16/4); inward cycles 3.2–5.9, 6.7–9.4 and 10.2–12.9 (each 0.6 + 0.8 + 0.5 + 0.8 → 15/5, 14/6, 13/7); 12.9–16.0 the carrier rests while tokens keep moving within their compartments.
7. At *It can carry either way*, point to the reverse cycle.
8. At *more often from the side with more glucose*, highlight the developing net inward movement; the net arrow grows downward as inward releases outnumber outward ones, labelled *net movement: facilitated diffusion*; route slot 3 fills: **carrier protein: binds, changes shape**. Show the completed 3/1 counter only after all four events (at 12.9 s), labelled *last completed demonstration*.
9. At *One caution*, a boundary tab in the normal accent: *needing a protein does not by itself establish the direction or energy requirement of every glucose-transport system*.
10. At *every glucose transporter*, retain the completed result and the scope caution; if the 16 s demonstration is still running, finish it with an anchored “watch the carrier complete the return” hold before the beat ends (at 120 wpm this cue falls about 16 s after *without ATP* and the beat's narration ends about 17 s after it, so the last event (12.9 s) and the window's close (16.0 s) fall inside the narration and no extra hold is expected; the measured audio decides, and any hold is added to the runtime, never recovered by faster narration). Small type under the tab: *energy-requiring transport: 4.2.1b*.

**On-screen text:** *carrier protein*; *binding site*; *mechanism demonstration; not counted*; *new counted demonstration*; *crossings in this 16 s illustrative demonstration; not comparable rates between transport routes*; *down its concentration gradient*; *no ATP used*; *our facilitated-diffusion example*; *net movement: facilitated diffusion*; *last completed demonstration*; route slot 3; the boundary tab.

---

### BEAT 10 · COMMON MISTAKE E45: glucose "too large" · 6:41–7:56
**Narration:**
> Here is a mistake the June 2023 examiners reported. Our framing: explain why glucose needs a transport protein to cross a cell surface membrane. Read this answer.
>
> *(silent read, 4 s)*
>
> Look at the words too large here. It can feel right, since a glucose molecule is bigger than an oxygen molecule, and bigger sounds harder to get through. The June 2023 report on this question says that most incorrect answers gave that reason. The mark scheme credited a different property: glucose is polar, and the core of the bilayer is hydrophobic. At that point it gave nothing for size alone, and nothing for naming facilitated diffusion or active transport. So state the property and the barrier first. In place: glucose is polar, so it does not cross the hydrophobic core of the phospholipid bilayer readily; it needs a transport protein, such as a carrier.

**Visual action:**
1. **From the first frame**, the membrane scene holds dimmed at left: a glucose token paused at the top of the tail band (turn-back position) and the carrier in its rest shape. **Entry cue: *Here is a mistake the June 2023 examiners reported*.** The COMMON MISTAKE panel enters (header badge **COMMON MISTAKE**, terracotta border, desaturated surround), basis line in small type: *basis: examiner-report diagnosis, June 2023 report p.12, Paper 21 Q3(a)*. It **stays on until the completed correct frame**.
2. At *Our framing*, the header lands: **Explain why glucose needs a transport protein to cross a cell surface membrane.** Small type: *our framing of S23/21 Q3(a), QP p.8; constructed answer, not a transcript.*
3. At *Read this answer*, the written wrong answer appears in handwriting style: **✗ Glucose molecules are too large to pass through the phospholipid bilayer.**
4. **Silent read, 4 s.** Panel and card held.
5. At *Look at the words too large here*, the words *too large* on the card are underlined in terracotta.
6. At *bigger than an oxygen molecule*, side-note: an O₂ token and a glucose token side by side at their schematic sizes, tag *sizes differ; size alone is not the credited reason here*.
7. At *The June 2023 report on this question*, citation tab, exact: **R23 p.12, June 2023 P21 Q3(a): “Most incorrect answers stated that glucose was too large.”**; at *most incorrect answers*, the words *incorrect answers* in the tab are underlined, tag *of the incorrect answers; not of all candidates*.
8. At *a different property*, a second tab in the normal accent, no quotation marks: *S23/21 Q3(a), 1 mark, MS p.11: credited polar / water-soluble / hydrophilic and the hydrophobic bilayer core (our paraphrase)*; at *the core of the bilayer is hydrophobic*, in the dimmed scene the glucose token brightens with tag *polar* and the tail band brightens with tag *hydrophobic core*.
9. At *nothing for size alone*, a line joins the second tab: *ignored at that point: size-only; active transport; facilitated diffusion (paraphrase)*; the terracotta underline on *too large* pulses.
10. At *So state the property and the barrier first*, side-note beside the card: *property → barrier → protein*.
11. At *In place*, the words *molecules are too large to pass through the phospholipid bilayer* are struck and rewritten in place; at *it needs a transport protein, such as a carrier*, the last words land and the card reads **✓ Glucose is polar (hydrophilic), so it does not cross the hydrophobic core of the phospholipid bilayer readily; it needs a transport protein, such as a carrier protein.**; **the marker clears on this completed frame**. **Exit cue: end of *such as a carrier*.** The treatment lifts; the corrected card holds; the dimmed scene brightens and the carrier runs one `carrier-bind` → `carrier-reset` cycle in a small carrier callout, separate from the counted field (tag *mechanism replay; not counted*); the field keeps its last completed demonstration (glucose 13 / 7, counter 3 · 1).

**On-screen text:** the panel and basis line; the framed header and its caption; the card; the ER tab; the MS paraphrase tab and its ignored line; *property → barrier → protein*; the corrected card.

---

### BEAT 11 · Water potential: a measure for water · 7:56–8:40
**Narration:**
> Now water, which has its own measure. Water potential describes water's tendency to move. Pure water at atmospheric pressure is the reference, with a water potential of zero kilopascals. At the same temperature and pressure, adding solute lowers the water potential, so the solutions here have negative values, and a less negative value is higher. Watch: a little solute on the left, more on the right. So, at the start, the left side has the higher water potential, less negative, and the right side the lower, more negative.

**Visual action:**
1. **From the first frame**, `WaterPotentialModel` in state `pure` fills the centre: two compartments of pure water separated by the vertical membrane strip labelled *partially permeable membrane (rotated: compartments left and right; not a cell)*, caption *schematic; not to scale*, the vertical scale at right with markers L and R, tag *same temperature and pressure both sides*, caption **conceptual comparison at fixed volume, temperature and pressure; not an osmometer; volume changes not modelled** and the conspicuous model caption *in this model the gaps let only water through; a generic model barrier*; the Beat 9 membrane scene small and dimmed at upper left. At *which has its own measure*, the scale title **water potential** lands.
2. At *water's tendency to move*, caption under the title: *water potential: water's tendency to move*.
3. At *Pure water at atmospheric pressure*, both compartments are labelled *pure water*; markers L and R sit together at the top of the scale.
4. At *zero kilopascals*, the top tick is labelled **0 kPa — pure water at atmospheric pressure (reference)**.
5. At *adding solute lowers the water potential*, the arrow *more negative ↓* draws down the scale.
6. At *negative values*, the region of the scale below 0 kPa is shaded, tag *negative*.
7. At *a less negative value is higher*, a bracket between two unnumbered positions on the scale reads *less negative = higher*.
8. At *a little solute on the left*, a dropper icon held above the left compartment (not touching) releases 4 sucrose tokens (state `initial`); marker L slides down a short way.
9. At *more on the right*, the dropper above the right compartment releases 12 sucrose tokens; marker R slides further down.
10. At *at the start, the left side*, the left label lands: *initially: higher water potential (less negative)*; at *the right side the lower*, the right label lands: *initially: lower water potential (more negative)*.

**On-screen text:** *water potential: water's tendency to move*; *0 kPa — pure water at atmospheric pressure (reference)*; *more negative ↓*; *less negative = higher*; the two *initially:* labels; *conceptual comparison at fixed volume, temperature and pressure; not an osmometer; volume changes not modelled*; *in this model the gaps let only water through; a generic model barrier*; model labels and captions.

---

### BEAT 12 · Osmosis: net movement of water, and equality · 8:40–9:30
**Narration:**
> Water molecules cross this membrane in both directions all the time; in real cells they cross the bilayer and, in many cells, channel proteins too. The sucrose here does not pass. More water molecules cross from the higher water potential, so there is a net movement to the lower side. That is osmosis: the net movement of water molecules from a region of higher water potential to a region of lower water potential, through a partially permeable membrane. Now add solute to the left until the water potentials are equal. The net arrow fades, but water still crosses both ways.

**Visual action:**
1. **From the first frame**, `WaterPotentialModel` in state `initial` holds (left 4 sucrose, right 12; markers apart; *initially:* labels). At *in both directions all the time*, `net-osmosis`: water tokens cross the membrane gaps both ways (motion); the counter appears, *left → right · right → left*, subtitle *crossings in each 5 s window; illustrative counts*.
2. At *in many cells, channel proteins too*, a small inset opens: a continuous bilayer section with one water token passing between phospholipids (no tear or gap drawn) and one through an actual teal water-channel protein spanning the bilayer (never a naked permanent hole through exposed tails), tag *water channels (aquaporins) in many cells: named, not taught*; the main model's caption *in this model the gaps let only water through; a generic model barrier* stays conspicuous.
3. At *The sucrose here does not pass*, a sucrose token approaches a gap and turns back, tag *in this model the membrane lets water through, not sucrose*.
4. At *More water molecules cross from the higher*, the window closes at **15 · 9**.
5. At *a net movement to the lower side*, the net arrow grows left → right, labelled **net movement of water by osmosis**.
6. At *That is osmosis*, the definition builds under the model clause by clause: **Osmosis: net movement of water molecules · from a region of higher water potential · to a region of lower water potential · through a partially permeable membrane.**
7. At *through a partially permeable membrane*, the membrane strip is ringed as the last clause lands.
8. At *add solute to the left*, `equalise`: caption **we change the left solution**; the dropper above the left compartment releases 8 more sucrose tokens (left now 12); marker L slides down (equality by intervention; the two solutions are labelled comparison states).
9. At *the water potentials are equal*, marker L meets marker R, tag *equal water potentials*; the *initially:* labels dim to small history text.
10. At *The net arrow fades*, the next window closes at **12 · 12** and the net arrow fades over 1 s.
11. At *water still crosses both ways*, water tokens keep crossing in both directions (motion never freezes); tag *no net movement; crossings continue*.

**On-screen text:** counter; the fixed-volume caption (as Beat 11); the generic-model-barrier caption; aquaporin inset tag; *in this model the membrane lets water through, not sucrose*; *we change the left solution*; *net movement of water by osmosis*; the osmosis definition; *equal water potentials*; *no net movement; crossings continue*.

---

### BEAT 13 · What I told you, on the membrane and the water model · 9:30–10:19
**Narration:**
> So here is what I told you, on the membrane and the water model. Particles move randomly, and net movement runs down a concentration gradient until concentrations are equal; then crossings continue, with no net movement. Oxygen, small and non-polar, crosses the bilayer by simple diffusion. Ions and polar molecules like glucose do not cross the hydrophobic core readily. Here their net movement through channels or carriers is down the gradient without ATP: facilitated diffusion. A channel has a hydrophilic pore; a carrier binds its solute and changes shape. And water moves by osmosis, net from higher to lower water potential, through a partially permeable membrane. All three are passive: no ATP.

**Visual action:** **No new slide.** The screen returns to the layout built through the lesson: the membrane scene (`DiffusionField` `membrane` with `FluidMosaicMembrane` `full`) at left with its O₂ tokens, the `channel-open` channel with ions and the carrier with glucose, each holding its last completed demonstration (O₂ 26 / 14, counter 8 · 2; ions 14 / 11, counter 8 · 2; glucose 13 / 7, counter 3 · 1, labelled *last completed demonstration*) and net arrow, and the four route slots beside it; the `WaterPotentialModel` in its `equalise` end state at right, scale and markers visible; the `DiffusionField` `open` thumbnail (20 · 20) small at the top. Static. Key points fade in in place:
1. **From the first frame**, the full layout is on screen and settles; nothing moves except the continuing random token motion. At *on the membrane and the water model*, the two main models brighten in turn.
2. At *Particles move randomly*, the `open` thumbnail brightens with tag *random movement → net movement down a gradient*; at *until concentrations are equal*, its *no net movement; movement continues* tag brightens.
3. At *Oxygen, small and non-polar*, the O₂ net arrow and route slot 1 **simple diffusion: through the bilayer** brighten.
4. At *Ions and polar molecules like glucose*, the *hydrophobic core* label brightens with the tag *does not cross the core readily*.
5. At *Here their net movement*, the net arrows on the channel and carrier brighten with the bracket **facilitated diffusion** and its tags *net movement down the gradient · no ATP*; at *A channel has a hydrophilic pore*, the channel and route slot 2 brighten.
6. At *a carrier binds its solute and changes shape*, the carrier, its **binding site** label and route slot 3 brighten.
7. At *water moves by osmosis*, the water model's definition line and route slot 4 **water: osmosis** brighten; the history labels *initially: higher / lower* briefly brighten and then dim, and only after that is the *equal water potentials* tag highlighted as the active condition (sequential, so no still frame shows unequal and equal potentials as current together).
8. At *All three are passive*, the label **passive · no ATP** lands across the top of the layout.

---

### BEAT 14 · How it is asked, the reject card, and the sugar · 10:19–11:11
**Narration:**
> How does this reach you? A June 2023 question on glucose and the membrane credited one idea: glucose is polar, and the core of the bilayer is hydrophobic. Write that first, before naming any process. A March 2024 question credited the same reasoning for sodium ions, a separate example, where the charge is the property. The reject card: equal water potentials mean no net movement, not no movement. And the sugar? It gets in through a transport protein: in our example, a carrier, down its gradient, without ATP.

**Visual action:**
1. **From the first frame**, the familiar lesson layout from Beat 13 stays on screen at right (reduced): the membrane scene with its three routes and the `WaterPotentialModel`. At *How does this reach you*, a compact forms surface enters at left, one row per form, each with a small visual beside it; row 3 is on screen from this cue (unnarrated): **a steroid hormone crossing the bilayer** · S21/22 Q3(b), QP p.6 / MS p.12 — 2 marks, any two of three listed points. Example two-point answer: hormone S is non-polar (lipid-soluble), so it can cross the phospholipid bilayer's hydrophobic core. “Non-polar” and “lipid-soluble” are alternatives for one property point. Small size is a further accepted point in this particular question. Our paraphrase. Beside it a magenta token labelled *steroid hormone S (exam context)* passes through a small bilayer icon (motion).
2. At *A June 2023 question*, row 1: **why glucose needs a transport protein** · *S23/21 Q3(a), 1 mark, MS p.11*; small type, no quotation marks: *credited: polar / water-soluble / hydrophilic and the hydrophobic bilayer core; size-only, active transport and facilitated diffusion ignored at that point (our paraphrase)*; at *glucose is polar, and the core*, the glucose token and the core in the layout brighten.
3. At *Write that first*, the row gains the tag *state polarity and the hydrophobic bilayer first*.
4. At *A March 2024 question*, row 2: **why sodium ions need a protein route** · *M24/22 Q1(b)(i), 1 mark, MS p.5*; small type *sodium ions' charge and the hydrophobic / non-polar bilayer (paraphrase); a sodium-ion question, not a glucose question*; at *for sodium ions*, a violet + token labelled *Na⁺* sits beside the row and the channel in the layout brightens.
5. At *The reject card*, the reject card lands beside the water model, struck through by hand: **✗ At equal water potentials, water stops moving.** / **✓ At equal water potentials there is no net movement of water; water molecules still cross both ways.**, caption in small type *our wording contrast; not a mark-scheme reject line*.
6. At *not no movement*, the water model's continuing crossings and its *no net movement; crossings continue* tag pulse once.
7. At *And the sugar?*, the Beat 1 hook caption and its glucose token return small at the top.
8. At *a carrier, down its gradient*, the carrier runs one full cycle carrying a glucose token into the cytoplasm in a small carrier callout beside the layout (tag *mechanism replay; not counted*; the layout's counted field keeps glucose 13 / 7 and its last completed counter), with the tags *down its gradient* and *no ATP used*. **Exit cue: end of *without ATP*.** Final frame held 2 s: forms at left, the layout and reject card at right, the hook caption above. No slogan.

**On-screen text:** the three forms with citations and paraphrases (row 3 with its example two-point answer); *state polarity and the hydrophobic bilayer first*; *Na⁺*; *steroid hormone S (exam context)*; the reject card and its caption; *mechanism replay; not counted*.

---

## Datasets

Every number in this lesson is **our illustrative counts** in a schematic model: no measured, supplied or calculated experimental quantity appears. Counts are crossings in one 5 s animation window (the carrier demonstration: one 16 s window, Dataset 2); each dataset is built from a single crossing probability per token per window so that counts follow the numbers present. The only value on a scale is the **0 kPa** reference (MF3 wording), which is a defined reference value, not a measurement.

### Dataset 1 — `DiffusionField` `open`, oxygen (dissolved), 40 tokens (Beats 3, 4)

Crossing probability per token per window p = 0.40. These are selected illustrative counts; p × population supplies an expected-count illustration, not a guarantee of the exact count in a random sample.

| window | left count at start | right count at start | left → right (p × left) | right → left (p × right) | net (left → right) | left after | right after |
|---|---:|---:|---:|---:|---:|---:|---:|
| 1 | 30 | 10 | 0.40 × 30 = 12 | 0.40 × 10 = 4 | 12 − 4 = 8 | 30 − 8 = 22 | 10 + 8 = 18 |
| 2 | 22 | 18 | 0.40 × 22 = 8.8 → **9** | 0.40 × 18 = 7.2 → **7** | 9 − 7 = 2 | 22 − 2 = 20 | 18 + 2 = 20 |
| 3 | 20 | 20 | 0.40 × 20 = 8 | 0.40 × 20 = 8 | 0 | 20 | 20 |

Window 2's counts are rounded to whole tokens (9 and 7), keeping the total at 40 (20 + 20). Window 3's counts run level (8 · 8) and the net arrow fades; motion continues. The windows are staged at their teaching cues; between them the counter holds as *last completed window*, and any continuing crossing is still counted (Counter convention).

### Dataset 2 — `DiffusionField` `membrane` scenes (Beats 5–9)

**Continuity contract.** Each membrane example is a separately set finite-particle demonstration, not a continuation of the previous example's populations. Show “new illustrative setup” while the existing membrane or particle scaffold stays visible and the tokens are reset. At the start, label each side's number “set starting count”; during the counted sequence update live side totals on every actual crossing. Do not add or delete tokens during that sequence. At its end, retain the final populations and display the completed counter as “last completed demonstration”. Any replay starts with an explicit labelled reset. Counts are scripted illustrative events, not experimental readings or predicted exact outcomes of a random simulation.

| Demonstration | Set outside / inside | p | Inward (p × outside) / outward (p × inside) crossings | Net inward | End outside / inside | Animation window |
|---|---:|---:|---:|---:|---:|---|
| Beat 5 oxygen | 24 / 8 | 0.25 | 0.25 × 24 = 6 / 0.25 × 8 = 2 | 6 − 2 = 4 | 24 − 4 = **20** / 8 + 4 = **12** | 5 s |
| Beat 6 oxygen, steeper initial gradient | 32 / 8 | 0.25 | 0.25 × 32 = 8 / 0.25 × 8 = 2 | 8 − 2 = 6 | 32 − 6 = **26** / 8 + 6 = **14** | 5 s |
| Beat 8 ions | 20 / 5 | 0.40 | 0.40 × 20 = 8 / 0.40 × 5 = 2 | 8 − 2 = 6 | 20 − 6 = **14** / 5 + 6 = **11** | 5 s |
| Beat 9 glucose | 15 / 5 | 0.20 | 0.20 × 15 = 3 / 0.20 × 5 = 1 | 3 − 1 = 2 | 15 − 2 = **13** / 5 + 2 = **7** | **16 s** (carrier exception) |

Totals are conserved in every row (32, 40, 25, 20 tokens). The Beat 6 comparison: a steeper initial gradient (32 : 8 against 24 : 8), set up separately with the same area, temperature, membrane and 5 s window, gives a larger net count (6 against 4), the direction of effect only. The higher-temperature, larger-area and shorter-distance demonstrations of Beat 6 carry no numbers (baseline restored before each; *qualitative; not counted*). **Carrier exception:** four sequential carrier cycles at 0.6 + 0.8 + 0.5 + 0.8 = 2.7 s each need at least 4 × 2.7 = 10.8 s, so the glucose demonstration runs in a 16 s animation window (schedule in Beat 9 action 6: reverse cycle 0.0–2.7 s → 16 / 4; inward cycles ending 5.9, 9.4 and 12.9 s → 15 / 5, 14 / 6, 13 / 7), captioned *crossings in this 16 s illustrative demonstration; not comparable rates between transport routes*. This is animation time, not a biological transport rate. The first, slow carrier cycle in Beat 9 and the carrier cycles in Beats 10 and 14 are uncounted mechanism demonstrations (the latter two in a separate callout), so they do not change the counted populations.

### Dataset 3 — `WaterPotentialModel` (Beats 11, 12)

| state | sucrose tokens left | sucrose tokens right | water left → right | water right → left | net | scale markers |
|---|---:|---:|---:|---:|---:|---|
| `pure` | 0 | 0 | — | — | — | L and R at 0 kPa |
| `initial` / `net-osmosis` | 4 | 12 | 15 | 9 | 15 − 9 = 6, left → right | L above R (L less negative) |
| `equalise` | 4 + 8 = 12 | 12 | 12 | 12 | 12 − 12 = 0 | L meets R |

The water crossing counts are illustrative only; they are **not derived from water potentials** and no water-potential value other than the 0 kPa reference is shown. The markers' positions are unnumbered and show order only (L above R = left less negative = higher). Equal sucrose tokens in equal compartments, at the same temperature and pressure, is the equal-water-potential case within this same-solute, equal-volume comparison only (not a universal cell rule; 4.2.6 shows equal water potentials without equal solute concentrations). Equality is reached by intervention (*we change the left solution*), not by water flow equalising two unchanged solutions. Compartment volumes are held fixed in the schematic (volume change is not modelled).

---

## Real-world samples

None handled. No real material (potato, beetroot, red onion, blood cells, Visking tubing, agar, dyes or indicators) is used or shown as a sample in this lesson, so no method-response or fit statement is required; there are no practical frames, no timers and no colour changes.

| Material | What the method responds to | Fit (range, clarity) | Interferences and how the method handles them | Beats |
|---|---|---|---|---|
| none handled | — | — | — | — |

**Explain-beat real-world examples** (drawn as schematic models, not handled): freely dissolved (not haemoglobin-bound) oxygen diffusing from the plasma into a red blood cell taking up oxygen in a lung capillary (Beats 1, 5; Topic 9 context named, not taught; supported by W22/23 QP p.15, Fig. 6.1, and OpenStax *Anatomy and Physiology* 22.4 Gas Exchange and 22.5 Transport of Gases, which distinguish dissolved and haemoglobin-bound oxygen; a bounded example, not a claim that every lung-capillary cell keeps an inward gradient indefinitely); glucose entering a cell through a carrier protein (Beats 1, 9, 14; *our facilitated-diffusion example*). **Exam contexts** (not handled): the S21/22 Q3(b) steroid hormone crossing the bilayer (Beat 14, on-screen row only); sodium ions in M24/22 Q1(b)(i) (Beat 14). No exam-question beat adds a real-world extra, so no *beyond the mark scheme* panel is needed.

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (4.2.1, p.21) | Beat(s) | How |
|---|---|---|
| describe and explain … simple diffusion | 3, 4, 5, 6, 13 | random movement → net movement down a concentration gradient; equilibrium with continued crossing; passive (kinetic energy, no ATP); O₂ through the bilayer; factors (direction of effect) |
| describe and explain … facilitated diffusion | 7, 8, 9, 10, 13, 14 | ions and polar molecules turned back at the hydrophobic core; channel (hydrophilic pore, no shape change) and carrier (binding site, shape change) as two mechanisms; down the gradient, no ATP; glucose as our example with the MF2 caution |
| describe and explain … osmosis | 11, 12, 13, 14 | MF3 water-potential sentences; 0 kPa reference; initial-condition labels; definition in water-potential terms; equality with continued crossing |
| … active transport, endocytosis and exocytosis | handed off | 4.2.1b (named in Beat 9 small type only) |
| Topic introduction (p.21): passive movement of molecules and ions; properties of phospholipids and proteins | 4, 5, 7, 8, 9 | passive routes and the bilayer/protein properties that decide them |
| Mathematical requirements (p.63) | none | no calculation in this lesson; SA:V is 4.2.3-4's (Beat 6 hands it off by label) |

### Mark-scheme and examiner points → beats

| Source | Point (paraphrase unless quoted) | Beat |
|---|---|---|
| R23 p.12, June 2023 P21 Q3(a) | “Most incorrect answers stated that glucose was too large.” (verbatim; PDF-CHECKED (plan check)) | 10 |
| S23/21 Q3(a), MS p.11 | polarity / hydrophilic and the bilayer core credited; size-only, active transport and facilitated diffusion ignored at that point | 7, 10, 14 |
| M24/22 Q1(b)(i), MS p.5 | sodium ions' charge and the hydrophobic / non-polar bilayer (separate example) | 7 (ions need a protein route), 14 |
| S21/22 Q3(b), QP p.6 / MS p.12 | any two of three points: bilayer / core passage; non-polar / lipid-soluble property (alternatives within one point); small size (credited in this question) | 5 (same property, O₂), 14 (on-screen row only) |
| W22/23 Q6(a), QP p.15 / MS p.19 (E43, owned by 4.1.3) | ion transport through a membrane protein (hydrogencarbonate/chloride in lung-capillary red cells; hydrophilic pathway, bilayer exclusion or facilitated diffusion as alternative credits) | 7, 8 (protein route taught; the I line is not re-quoted or re-performed); QP p.15 Fig. 6.1 also supports Beat 5's oxygen example |
| W20/21 Q4(b)(ii), MS p.10 (adjacent) | a mixed five-mark phloem mass-flow account (assimilate entry, lowered water potential, water entry, hydrostatic-pressure change, mass flow); not five pure osmosis marks | ledger only |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, never, only, no, nothing, cannot, because, must, needs* and causal *so/since* was reread with one question: true of all cases, or only of the case on screen?
- Beat 1: "the membrane is built to keep water-loving things out" is the hook's question (VIDEO-STRUCTURE's own wording), answered in Beats 7–9 by the protein routes; the narration then bounds it: "glucose, a polar molecule, does not cross that core readily" ("readily", not "cannot"). "Your cells trade with their surroundings all the time" and "Water moves into and out of cells constantly": typical of living cells; no claim about every molecule. "cells that use it in respiration": the cells in that vignette.
- Beat 3: "constantly moving at random, because of their kinetic energy": the particle model used at this level. "simply because more are there to make the trip": the model's reason for the count difference (Dataset 1 uses one probability per token). The definition says "net movement", never "all particles move".
- Beat 4: "The particles have not stopped: they still move and still cross both ways, but there is no net movement now, so the arrow fades": this field at equal concentrations. "the particles' own kinetic energy, and no ATP from a cell": this model has no cell; the passive definition. "It matters because cells exchange substances … all the time, and passive routes let them do a lot of it without spending ATP": "a lot of it", not "all of it". "The membrane decides which substance takes which route": framing, bounded by the routes taught.
- Beat 5: "a red blood cell taking up oxygen in a lung capillary. Here we track freely dissolved oxygen, not oxygen bound to haemoglobin: it diffuses from the surrounding plasma into the cell": this bounded example during uptake, dissolved oxygen only (caption *illustrative gradient during uptake*); no claim that all lung-capillary cells keep an inward gradient indefinitely. "Oxygen molecules are small and non-polar, so they pass straight through the bilayer": the credited property for this route. "no transport protein needed": the definition of simple diffusion as taught.
- Beat 6: each factor is a direction of effect ("faster"); "For bilayer passage, molecular size and lipid solubility also matter; small, non-polar molecules cross readily": a property statement bounded to bilayer passage, "readily" not "only"; each factor is demonstrated from the restored baseline, one at a time, qualitatively. "No equation needed here": this lesson's scope.
- Beat 7: "Ions are charged, and glucose is polar: both interact well with water, and poorly with that core": properties, not an absolute ban. "Glucose is polar and does not cross the hydrophobic bilayer core readily; it needs a transport protein": the MF2 sentence verbatim in substance. "Ions need a protein route too": to cross the membrane at a useful rate; bounded by "readily" in the preceding sentence and the E43 wording owned by 4.1.3. "In the passive routes shown here, net movement through these proteins is down the concentration gradient, without ATP: facilitated diffusion": the classification is bounded to the routes shown and carries the passive condition; the protein requirement alone is not presented as identifying facilitated diffusion.
- Beat 8: "particular ions or polar molecules" (should-fix 6); "without meeting the hydrophobic core": the pore in this model. "A few go the other way, but more go down the gradient": this channel's counts. "The channel does not change shape to move them": the plan's channel/carrier distinction. "in our model the pore simply stays open": bounded to the model. "Different channels let through different, particular ions": no claim of identical selectivity.
- Beat 9: "glucose is our example"; "In our facilitated-diffusion example, the carrier moves glucose down its concentration gradient without ATP": MF2, bounded. "It can carry either way": this carrier model. "needing a protein does not, by itself, fix the direction or the energy source of every glucose transporter": the MF2 caution, keeping this example from becoming a universal glucose rule.
- Beat 10 (E45): "It can feel right, since a glucose molecule is bigger than an oxygen molecule": a possibility, not examiner testimony; the size comparison is true of the two molecules shown. "most incorrect answers gave that reason": the report's own subgroup, not upgraded to "most candidates". "The mark scheme credited a different property … At that point it gave nothing for size alone, and nothing for naming facilitated diffusion or active transport": the S23/21 Q3(a) description, bounded "at that point"; the wrong answer is written, never spoken as a claim ("the words too large here"). "glucose is polar, so it does not cross the hydrophobic core … readily; it needs a transport protein": MF2.
- Beat 11: "adding solute lowers the water potential, so the solutions here have negative values": "at the same temperature and pressure" and "here" carry the MF3 bounds. "a less negative value is higher": definitional.
- Beat 12: "Water molecules cross this membrane in both directions all the time": this model. "in many cells, channel proteins too": aquaporins bounded as "in many cells". "The sucrose here does not pass": this model's membrane only (Visking's behaviour is 4.2.2a's). "More water molecules cross from the higher water potential, so there is a net movement to the lower side": the counts on screen. "water still crosses both ways": MF3.
- Beat 13: "until concentrations are equal; then crossings continue, with no net movement": the model. "Ions and polar molecules like glucose do not cross the hydrophobic core readily. Here their net movement through channels or carriers is down the gradient without ATP: facilitated diffusion": "readily"; "Here" bounds the classification to the lesson's routes and states the passive condition at the point of classification. "A channel has a hydrophilic pore; a carrier binds its solute and changes shape": the two mechanisms as modelled. "All three are passive: no ATP": the three processes of this lesson as defined.
- Beat 14: "credited one idea" (S23/21 Q3(a) is 1 mark); "credited the same reasoning for sodium ions": the M24/22 MS p.5 point (charge and the non-polar bilayer). The steroid sentence is cut (round 1); its on-screen row gives the any-two-of-three points without implying that two synonyms make two marks. "Write that first, before naming any process": the plan check's "state polarity and the hydrophobic bilayer first". "equal water potentials mean no net movement, not no movement": MF3. "in our example, a carrier, down its gradient, without ATP": bounded to our example.
- No sentence uses "concentration of water", defines osmosis by "dilute" or "concentrated", names solute potential or pressure potential, says ions "cannot pass through the membrane", gives a channel a shape change, calls glucose's carrier the only glucose route, or says water stops moving at equilibrium.

---

## Citations

Every quotation, where it appears, and the file it was copied from. No exam PDF was opened by this author; the round-1 check verified every exam row below against the actual QP/MS/ER PDFs (`pdftotext -layout`), and those statuses are recorded as the check reports them.

| # | Quotation (verbatim) | Paper / session / question / page | Beat(s) | Copied from | Status |
|---|---|---|---|---|---|
| 1 | "describe and explain the processes of simple diffusion, facilitated diffusion, osmosis, active transport, endocytosis and exocytosis" | Syllabus 2025–2027, 4.2.1, p.21 | header; 2 (small type) | `SYLLABUS-9700-DETAIL.md` | syllabus (verbatim match, plan check and round-1 check) |
| 2 | “Most incorrect answers stated that glucose was too large.” | June 2023 examiner report (R23), p.12, Paper 21 Q3(a) | spine; 10 | `work/006/SHARED-SPECS.md` §2 verbatim list; `TOPIC-PLAN-04-MEMBRANES.md` E45; `TOPIC-04-WEIGHTS.md` S-E and E45 | **PDF-CHECKED (plan check)**; exact match re-confirmed in round-1 check (`9700_s23_er.pdf` p.12) |
| 3 | (no quotation) credited polar / water-soluble / hydrophilic and the bilayer core; size-only, active transport and facilitated diffusion ignored at that point | S23/21 (s23_21) Q3(a), 1 mark, QP p.8 / MS p.11 | spine; 10; 14 | plan check description via `TOPIC-04-WEIGHTS.md` ledger and E45 | description, our paraphrase; **PDF-CHECKED (round-1 check, actual PDF)** (UNVERIFIED 1–2 resolved) |
| 4 | (no quotation) sodium ions' charge and the hydrophobic / non-polar bilayer | M24/22 (m24_22) Q1(b)(i), 1 mark, QP p.3 / MS p.5 | 14 | `TOPIC-04-WEIGHTS.md` ledger | description, our paraphrase; **PDF-CHECKED (round-1 check, actual PDF)** (UNVERIFIED 2–3 resolved) |
| 5 | (no quotation) steroid hormone S: any two of three points: bilayer / core passage; non-polar / lipid-soluble property (alternatives within one point); small size | S21/22 (s21_22) Q3(b), 2 marks, QP p.6 / MS p.12 | 14 (on-screen row only) | `TOPIC-04-WEIGHTS.md` ledger; plan §4.2.1; round-1 check | description, our paraphrase; **PDF-CHECKED (round-1 check, actual PDF)** (UNVERIFIED 2–3 resolved) |
| 6 | (plan wording, not exam wording) the MF2 glucose sentences and MF3 water-potential sentences | plan check MF2, MF3 | spine; 7, 9, 10, 11, 12 | `TOPIC-PLAN-04-MEMBRANES.md` §4.2.1 | plan wording; no *plan wording* label on screen (round 1) |
| 7 | (no quotation) ion transport through a membrane protein; hydrogencarbonate/chloride movement in lung-capillary red cells; QP Fig. 6.1 shows oxygen entering a lung-capillary red cell | W22/23 (w22_23) Q6(a), 1 mark, QP p.15 / MS p.19 | spine; 5 (oxygen example support); 7, 8 | round-1 check | description, our paraphrase; **PDF-CHECKED (round-1 check, actual PDF)** |
| 8 | (no quotation) mixed five-mark phloem account with water-potential/osmosis points | W20/21 (w20_21) Q4(b)(ii), MS p.10 | scope ledger only | round-1 check | description; **PDF-CHECKED (round-1 check, actual PDF)** |
| 9 | (no quotation; non-exam content source) dissolved versus haemoglobin-bound oxygen in gas exchange | OpenStax *Anatomy and Physiology 2e* 22.4 Gas Exchange (https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange); *Anatomy and Physiology* 22.5 Transport of Gases (https://openstax.org/books/anatomy-and-physiology/pages/22-5-transport-of-gases) | 5 | round-1 check | publisher-authored content source for the biological example; not an endorsed-coursebook page |

**UNVERIFIED items** (not quoted; shown only as our framing or paraphrase):
1. ~~`UNVERIFIED — the verbatim QP wording of S23/21 Q3(a).`~~ **Resolved (round-1 check):** QP p.8; the stem concerns hexoses entering grape fruit cells and part (a) asks the general protein-requirement reason; our framing ("why glucose needs a transport protein …") is a valid paraphrase and stays labelled *our framing*.
2. ~~`UNVERIFIED — the exact MS wording of S23/21 Q3(a), M24/22 Q1(b)(i) and S21/22 Q3(b)`~~ **Resolved (round-1 check):** S23/21 MS p.11 (1 mark; size-only, active transport and facilitated diffusion ignored; unqualified "(hydrophobic) fatty acid 'tails'" also ignored); M24/22 MS p.5 (1 mark; charged ion and hydrophobic/non-polar core); S21/22 MS p.12 (2 marks, any two of three: bilayer passage; non-polar/lipid-soluble property, alternatives within one point; small size). Still shown only as paraphrase, never in quotation marks.
3. ~~`UNVERIFIED — the verbatim QP wording of M24/22 Q1(b)(i) and S21/22 Q3(b).`~~ **Resolved (round-1 check):** M24/22 QP p.3 asks why sodium ions cannot cross phospholipid bilayers by simple diffusion; S21/22 QP p.6 verified. Beat 14's row titles remain our descriptions.
4. `UNVERIFIED — an endorsed-textbook page for the explain-beat oxygen example.` **Partly resolved (round-1 check):** the example is supported by W22/23 QP p.15, Fig. 6.1 and by OpenStax 22.4 and 22.5 (citation 9), which distinguish dissolved and haemoglobin-bound oxygen; a page in the Cambridge-endorsed coursebook remains unavailable (listed in `CONTENT-ARCHITECTURE.md` as "to purchase") and is not invented.

---

## Word count and runtime

Counted by the validator over the blockquoted narration, silent-read line excluded; seconds = words ÷ 120 × 60, plus 4 s for Beat 10's silent read (SHARED-SPECS §2a, MF7). The validator's TOTAL line is words ÷ 120 only (11:09.0); with the silent read 11:13.0; with Beat 14's final 2 s hold, declared separately as additional to effective pacing (round 1), **11:15.0**.

| Beat | Title | Words | Seconds |
|---|---|---:|---:|
| 1 | Hook and context | 96 | 48.0 |
| 2 | What you will be able to do | 50 | 25.0 |
| 3 | Random movement, net movement | 101 | 50.5 |
| 4 | Equal, but still moving; and why passive matters | 103 | 51.5 |
| 5 | Simple diffusion: straight through the bilayer | 98 | 49.0 |
| 6 | What makes net diffusion faster | 82 | 41.0 |
| 7 | Turned back at the core: why some need a protein | 90 | 45.0 |
| 8 | A channel protein: a door in a wall | 94 | 47.0 |
| 9 | A carrier protein: glucose, down its gradient, no ATP | 95 | 47.5 (16 s carrier window fits inside; no hold expected) |
| 10 | COMMON MISTAKE E45: glucose "too large" | 141 | 74.5 (70.5 + 4 s silent read) |
| 11 | Water potential: a measure for water | 88 | 44.0 |
| 12 | Osmosis: net movement of water, and equality | 100 | 50.0 |
| 13 | What I told you, on the membrane and the water model | 112 | 56.0 |
| 14 | How it is asked, the reject card, and the sugar | 88 | 44.0 (+ 2 s final hold) |
| **Total** | 14 beats (13 teaching + 1 error) | **1338** | **673.0** (11:13.0); **675.0** (11:15.0) with the final hold |

**Length, honestly:** **1,338 words**; words ÷ 120 = **11:09.0** (the validator's TOTAL); with Beat 10's 4 s silent read (MF7 convention) **11:13.0**; with Beat 14's final 2 s hold, now declared separately, **11:15.0**, **30 s over** the 10:45 budget. Round-1 changes: cut 1 taken (Beat 14 steroid sentence, −16 words); M2 adds +5 (Beat 7) and +13 (Beat 13); M4 changes Beat 5 by −1; should-fix 4 adds +3 (Beat 6); net **+4 words** on the 1,334-word draft. The carrier's 16 s demonstration window sits inside Beat 9's narration at 120 wpm (last event 12.9 s, window close 16.0 s, beat narration ending about 17 s after *without ATP*); any hold the measured audio requires is added to this runtime, never recovered by faster narration. E45 is unchanged: **141 words = 70.5 s + 4 s silent read = 74.5 s**, inside the 122–142-word range and the reserved 1:15. The thirteen teaching beats total **1,197 words = 9:58.5** (+2 s hold), **28.5 s over** the 9:30 teaching base. The check accepts a modest remaining overrun (three mechanisms and a new water-potential model) and rules cuts 2–5 **KEEP**; they are not taken. Drafting cuts already taken earlier: Beat 5 "Carbon dioxide can cross the same way." (kept as on-screen small type), Beat 6 "You can see each factor on the model.", Beat 7 "There are two kinds of protein route." (−22 words). **Remaining cut list, only if 10:45 must be met** (the check rules each KEEP; together −34 words = −17 s → 1,304 words = 10:52.0 + 4 s read + 2 s hold = 10:58.0, still 13 s over, so 10:45 is not reachable without cutting required repairs):
1. ~~Beat 14 steroid sentence (−16 words)~~ **taken** (round 1, M3).
2. Beat 12 "; in real cells they cross the bilayer and, in many cells, channel proteins too" (−14 words) — check: KEEP.
3. Beat 1 "Water moves into and out of cells constantly." (−8 words) — check: KEEP.
4. Beat 8 "Different channels let through different, particular ions." (−7 words) — check: KEEP.
5. Beat 3 "Start with the particles themselves." (−5 words) — check: KEEP.

Never speed the narration; never thin E45.

---

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| Active transport, the ATP-driven carrier (`pump-ATP`), endocytosis (phagocytosis, pinocytosis), exocytosis; the facilitated-diffusion/active-transport comparison (M24/22 Q1(b)(ii)); carrier saturation and the `UptakeGraph` (S23/21 Q3(b)(i), E47) | 4.2.1b |
| Effects of osmosis on plant and animal cells (turgid, flaccid, plasmolysis, haemolysis, crenation); a cell reaching equilibrium against its wall | 4.2.6 |
| Investigating diffusion and osmosis with Visking tubing, agar, beetroot, red onion; the osmometer | 4.2.2a, 4.2.2b |
| Calculating surface area to volume ratio; the agar-cube investigation (Beat 6 hands surface area and distance forward by label) | 4.2.3-4 |
| Estimating tissue water potential; any water-potential value other than the 0 kPa reference | 4.2.5 |
| Solute potential, pressure potential, ψ equations | not expected (4.2.6); never named |
| Fick's law or any diffusion equation; membrane potentials; channel gating; named channel families; aquaporin structure; co-transport; the sodium–potassium pump | DO-NOT-ADD / later topics (Topic 15 for the pump) |
| E43's ignore line ("ions … membrane") as a performed error | 4.1.3 (owner); the protein route is taught here without re-performing it |
| Gas exchange in the lungs beyond the one-line oxygen example | Topic 9 |

## Reusable models

| Model | Specified | For |
|---|---|---|
| **`DiffusionField`** (`open`; `membrane` with the 90° rotation and relabelling; per-5 s-window counter staged at cues, holding as *last completed window*; live side count tags updated on every crossing; membrane continuity contract: separately set finite demonstrations, labelled resets, no tokens added or deleted mid-sequence, *last completed demonstration*; **carrier exception: 16 s animation window**, animation time, not a biological rate; fading net arrow; turn-back motion; temperature parameter; Datasets 1–2) | here | 4.2.1b (labelled recall), 4.2.2a (Visking and agar insets), 4.2.3-4 (acid entering a cube, inset) |
| **`TransportProteinSet`** full passive states (`channel-open` with fixed outline and open pore; `carrier-bind` 0.6 s → `carrier-flip` 0.8 s → `carrier-release` 0.5 s → `carrier-reset` 0.8 s; reverse cycle with empty reorientation; occluded middle: at no frame is the binding site an open pore through both faces; four counted cycles need a 16 s window) | here (4.1.3's static previews extended) | 4.2.1b (adds `pump-ATP`; comparison), 4.2.2a (comparison with Visking pores) |
| **`WaterPotentialModel`** (`pure`, `initial`, `net-osmosis`, `equalise`; 0 kPa reference tick; unnumbered L/R markers; *initially:* labels; net arrow fading at equality while crossings continue; fixed-volume caption *conceptual comparison at fixed volume, temperature and pressure; not an osmometer; volume changes not modelled*; *we change the left solution* at equalisation; generic water-only gaps captioned as a model barrier, and real-cell insets drawn as a continuous bilayer plus a teal water-channel protein, never a naked hole through exposed tails (guard carried to 4.2.6); the equal-sucrose-count shortcut is not exported as a cell rule) | here | 4.2.6 (adds `cell-vs-solution`), 4.2.2a, 4.2.2b, 4.2.5 |
| `FluidMosaicMembrane`, `PhospholipidToken`, `WaterField` | 4.1.1-2 | used here by state id only |

---

## Assets

| Asset | Status | Source |
|---|---|---|
| `DiffusionField` (both configurations, counter, net arrow, rotation transition) | **new build** | authored vector; tokens per the colour roles |
| `TransportProteinSet` passive states (channel with polar lining; carrier silhouettes for the four states with continuous interpolation) | **new build** (extends 4.1.3's static previews) | authored vector |
| `WaterPotentialModel` (compartments, rotated bilayer strip with gaps, scale with 0 kPa tick, L/R markers, dropper icon) | **new build** | authored vector; the dropper is a schematic icon held above the compartments, never touching (rendered still-frame verification pending) |
| `FluidMosaicMembrane`, `PhospholipidToken`, `WaterField` | reuse | 4.1.1-2 |
| Context vignettes (alveolus–capillary–red blood cell; cell and vessel; water crossing a cell edge); red blood cell inset (Beat 5) | new, schematic vector | authored; no photograph, no micrograph, no generated image |
| Objectives pictograms (dots-and-arrow, door-in-wall, water drop with scale); handle pictogram (door-in-wall); factor panel; route slots; E45 card; COMMON MISTAKE panel; forms surface; reject card | new card content; shared panel and surfaces | authored; panel from earlier topics |
| Micrographs, photographs, Cambridge artwork | none | — |

No apparatus is handled in this lesson; the only handled-object rule that applies is the schematic dropper (above, never touching).

---

## Plan interpretations

1. **`WaterPotentialModel` labels.** The top tick reads exactly as SHARED-SPECS §4 now gives it, **0 kPa — pure water at atmospheric pressure (reference)**. SHARED-SPECS writes the comparison labels as *higher / lower water potential (less / more negative)*; the plan's shared-model table (after MF3) prefixes them *initially:* and MF3 says "Label higher/lower comparisons as the initial condition". The plan wins (SHARED-SPECS §1), so the labels read *initially: higher water potential (less negative)* and *initially: lower water potential (more negative)*, dimming to history text once the potentials are equalised. Everything else matches SHARED-SPECS.
2. **How equality is reached in the water model.** MF3 requires the net arrow to fade at equality while crossings continue. A two-compartment model approaching equality by net water flow alone would need volume or pressure changes that belong to 4.2.2a's osmometer and 4.2.6's cells (and would edge towards pressure potential, excluded). So equality is reached by **adding solute to the left compartment** (state `equalise`), which also demonstrates MF3's "adding solute lowers water potential" a second time. Compartment volumes are held fixed and captioned as such (*conceptual comparison at fixed volume, temperature and pressure; not an osmometer; volume changes not modelled*, Beats 11–12), and the intervention is captioned *we change the left solution*, so equality never looks like water flow spontaneously equalising two unchanged solutions.
3. **Timers.** "Timers start at first contact" applies to practical frames; this lesson handles no real material and has no timed event, so no timer is drawn. The crossing counters are per-window illustrative counts, labelled as such, not timed measurements.
4. **Counter convention.** SHARED-SPECS names a crossing counter that "runs level" at equilibrium; a cumulative counter cannot do that after an unequal start, so the counter shows crossings **per 5 s window**, subtitled accordingly, staged at teaching cues and held as *last completed window* / *last completed demonstration* between them (round 1). **Carrier exception:** four carrier cycles at the published 0.6/0.8/0.5/0.8 s timings need at least 10.8 s plus reorientation, so Beat 9's counted glucose demonstration uses a **16 s animation window**, captioned *crossings in this 16 s illustrative demonstration; not comparable rates between transport routes*; this is animation time, not a biological transport rate.
5. **Membrane strip without carbohydrate chains.** Should-fix 2 says carbohydrate chains still face the outside in left-to-right layouts; the `WaterPotentialModel` separates two solutions, not a cell's outside and inside, so no chains are drawn and the strip is labelled *not a cell*. In every membrane-crossing scene (Beats 5–10, 13–14) the chains are on the top (outside) face.
6. **Factors on the rate of diffusion.** The plan's §4.2.1a lists them; they are taught qualitatively in Beat 6 (no numbers except the illustrative count comparison), with surface area and distance handed to 4.2.3-4.
7. **E45 placement and card.** E45 sits after the carrier (Beat 10) so that the talk-through can say, at the right moment, that naming facilitated diffusion is not the credited reason in S23/21 Q3(a) (MF2's last sentence). The card holds one constructed size-only answer (the register's "a size-only reason"); the header is our framing of the question (the QP wording, p.8, was verified in the round-1 check; the framing remains a paraphrase).
8. **Steroid hormone.** S21/22 Q3(b) is used only as an exam context (Beat 14 row 3, on screen only since round 1, giving its any-two-of-three points with non-polar/lipid-soluble as alternatives within one point and small size as credited in this particular question; E45's question-local rejection of size-only for glucose is not turned into a universal ban on size); Beat 5's taught example is oxygen, as the plan specifies. No steroid entry pathway or receptor is drawn (4.1.4's MF4 guard).
9. **Sodium ions.** M24/22 Q1(b)(i) is presented only as a separate sodium-ion example (charge as the property), never as a second glucose question (register note to E45).
10. **Reject card.** No verbatim reject line in the verified list fits a passive-transport close without repeating E45, so the card is our wording contrast on equality (MF3), captioned *our wording contrast; not a mark-scheme reject line* (based on the plan's MF3 wording; the internal source label removed from screen in round 1, should-fix 5; should-fix 8: no invented examiner reject).
11. **Handle scope.** The "door in a wall" handle is kept to the channel; the plan gives the carrier's "revolving door" to 4.2.1b. Because a door suggests opening and closing, the model tags *our model: pore open; gating not taught*.
12. **Oxygen token in the open field.** The open `DiffusionField` uses O₂ tokens (labelled *oxygen (dissolved)*) so the same tokens carry straight into the simple-diffusion scene.
13. **Carbon dioxide.** Named in one sentence and a small-type note (the plan lists O₂ and CO₂), not animated, because the colour-role list has no CO₂ token.

---

## Validator run

`python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.1a/STORYBOARD.md` (after the round-1 fixes)

```
== storyboards/topic-04/4.2.1a/STORYBOARD.md
beat  words  cues maxgap  status
   1     96    10     13  ok
   2     50     3     18  ok
   3    101     8     27  ok
   4    103     9     25  ok
   5     98    10     18  ok
   6     82    10     15  ok
   7     90    11     16  ok
   8     94    12     14  ok
   9     95    10     17  ok
  10    141    14     18  ok
  11     88    11     14  ok
  12    100    11     23  ok
  13    112    10     16  ok
  14     88    11     13  ok
TOTAL words 1338  cues 140  runtime at 120 wpm 11:09.0  beats 14  failing beats 0
```

No MISSING SECTION or CITATION lines; `failing beats 0`. Complete runtime with the 4 s silent read 11:13.0; with Beat 14's declared 2 s final hold 11:15.0.

---

## CHECK RESPONSE (round 1)

Check: `scratchpad/r1/4.2.1a/CHECK.md` (NOT CLEARED; reviewed SHA-256 `f6ae1aaa…877a`). Every item below.

| ID | Status | What changed |
|---|---|---|
| M1 — Dataset 2 continuity contract | applied | The check's paragraph inserted verbatim in the `DiffusionField` spec and Dataset 2 (“Each membrane example is a separately set finite-particle demonstration, not a continuation of the previous example's populations. …”). Dataset 2 table replaced with the exact start → end rows: 24/8 → 6/2 → **20/12**; 32/8 → 8/2 → **26/14**; 20/5 → 8/2 → **14/11**; 15/5 → 3/1 → **13/7**, with worked arithmetic and conserved totals. The “not depleted” sentence removed. |
| M1 — Beat 5 action 5 | applied with interpretation | Replacement text used verbatim (“retain the lung-context inset and explicitly initialise a new illustrative membrane comparison with 24 oxygen tokens outside and 8 inside. Caption: new setup; set starting counts, not a continuation of the 20/20 field. …”). Its cue *from the air in the alveoli* is removed from narration by M4, so the action is remapped to *Here we track freely dissolved oxygen* (noted in the action). Action 8 now ends the 5 s sequence at 6 · 2 with live totals **20 / 12**, held as *last completed demonstration*. |
| M1 — Beat 6 actions 1–3 | applied with interpretation | Replacement text used verbatim (“retain the completed Beat 5 demonstration at 20/12 with its last completed counter 6/2 … reset to 32/8 … ending 26/14 … highlight the completed net comparison 6 versus 4; if the window has not finished, allow it to finish before revealing that result”), split across the three existing actions so the factor-panel opening (*What makes net diffusion faster*) and panel row 1 are kept; small type now *net 6 in this 5 s window, was 4*. |
| M1 — Beat 9 actions 6–8, counter convention | applied with interpretation | Replacement text used verbatim (“new counted demonstration … **16 s animation window** … ‘crossings in this 16 s illustrative demonstration; not comparable rates between transport routes’ … three inward cycles and one outward cycle … live populations finish 13/7 … Show the completed 3/1 counter only after all four events”), with a stated schedule (reverse 0.0–2.7 s; inward cycles ending 5.9, 9.4, 12.9 s). The *every glucose transporter* clause is placed in action 10, after *One caution*, to keep cues in spoken order. “Time-lapse” removed. Carrier exception stated in Models (`DiffusionField` and `TransportProteinSet`), Dataset 2, Reusable models and Plan interpretations 4. At 120 wpm the window closes (16.0 s) as that cue lands (~16 s) and before the beat ends (~17 s): **no added hold**; any hold the audio needs goes into runtime. |
| M1 — Beats 3–4 counted windows | applied | “Refreshing at the end of each window” replaced with the check's paragraph verbatim (“The counted windows are staged at their stated teaching cues. … not a rule that every real five-second sample has identical counts.”). Beats 3–4 actions: side tags update live on every crossing; counter holds as *last completed window*; continuing crossings in Beat 4 still tick the counter. 30/10 → 22/18 → 20/20 arithmetic retained. |
| M1 — Dataset 1 probability claim | applied | Added verbatim: “These are selected illustrative counts; p × population supplies an expected-count illustration, not a guarantee of the exact count in a random sample.” |
| M1 — consequential (not named by check) | applied with interpretation | Beat 8: *new illustrative setup* / *set starting count* at 20/5; the first ion passage moved to a magnified *mechanism view; not counted* callout and the 5 s counted sequence starts at new cue *without meeting the hydrophobic core*, so it can finish within 5 s at 8 · 2 → **14 / 11**. Beat 9's first slow cycle tagged *mechanism demonstration; not counted*. Beats 10 and 14 carrier replays run in a separate callout tagged *mechanism replay; not counted*. Beat 13 layout shows the final populations and counters (26/14 · 8/2; 14/11 · 8/2; 13/7 · 3/1). |
| M2 — Beat 7 | applied | Last two sentences now: “Ions need a protein route too. In the passive routes shown here, net movement through these proteins is down the concentration gradient, without ATP: facilitated diffusion.” Cues remapped to *In the passive routes shown here*, *through these proteins*, *without ATP: facilitated diffusion*. |
| M2 — Beat 13 | applied | Sentence now: “Ions and polar molecules like glucose do not cross the hydrophobic core readily. Here their net movement through channels or carriers is down the gradient without ATP: facilitated diffusion. A channel has a hydrophilic pore; a carrier binds its solute and changes shape.” Cues remapped (*Here their net movement*, *A channel has a hydrophilic pore*, *a carrier binds its solute and changes shape*). Causal spine route summary and its blockquote carry the same qualification (“in the passive routes taught here, net movement through these proteins is down the concentration gradient, without ATP”). Beat 9 caution and the 4.2.1b handoff untouched. |
| M3 — steroid marking points | applied | Cut 1 taken: the 16-word steroid sentence removed from Beat 14. Row 3 on screen from *How does this reach you* with the check's answer text verbatim (“S21/22 Q3(b), QP p.6 / MS p.12 — 2 marks, any two of three listed points. Example two-point answer: hormone S is non-polar (lipid-soluble) … Our paraphrase.”). Cues *A June 2021 question* and *non-polar and lipid-soluble* removed; steroid token still crosses its bilayer icon. Source ledger, spine, citation 5 and Plan interpretations 8 updated; size is not banned universally. |
| M4 — dissolved oxygen | applied | Beat 5 example sentence now verbatim: “Our example is a red blood cell taking up oxygen in a lung capillary. Here we track freely dissolved oxygen, not oxygen bound to haemoglobin: it diffuses from the surrounding plasma into the cell.” Caption **freely dissolved O₂; haemoglobin-bound oxygen not counted; illustrative gradient during uptake** added beside the populations (cue *not oxygen bound to haemoglobin*). Sources (W22/23 QP p.15 Fig. 6.1; OpenStax 22.4, 22.5) added to Real-world samples, citations 7 and 9, and UNVERIFIED 4. |
| S1 — water model assumptions | applied | Caption **conceptual comparison at fixed volume, temperature and pressure; not an osmometer; volume changes not modelled** in the model spec and Beats 11–12; **we change the left solution** at the solute addition (Beat 12 action 8, `equalise`); comparison states labelled; Dataset 3 limits the equal-count shortcut to this comparison. |
| S2 — model barrier vs membrane | applied | Generic-barrier caption kept conspicuous (*in this model the gaps let only water through; a generic model barrier*); Beat 12 aquaporin inset: continuous bilayer plus an actual teal water-channel protein, never a naked hole through exposed tails, no tear; guard noted for 4.2.6 in the model spec and Reusable models. |
| S3 — carrier occluded middle | applied | Added verbatim to `TransportProteinSet`: “At no frame is the binding site an open pore through both faces; outer access closes before inner access opens, and conversely in the reverse cycle.” |
| S4 — one factor at a time | applied | Beat 6: baseline explicitly restored before temperature, area and distance (tags *qualitative; not counted*, *same gradient and temperature*, *only thickness differs*); final sentence now “For bilayer passage, molecular size and lipid solubility also matter; small, non-polar molecules cross readily.” (cue *For bilayer passage*; panel row 5 matched). |
| S5 — student-facing provenance | applied | Removed from screen: *(plan wording)* (Beat 9 tab), *UNVERIFIED — verbatim QP wording* (Beat 10; now *our framing of S23/21 Q3(a), QP p.8*), *PDF-CHECKED (plan check)* small type (Beat 10), *(our paraphrase of the plan check's description)* → *(our paraphrase)* (Beats 10, 14), reject-card caption now *our wording contrast; not a mark-scheme reject line*. Citations table and UNVERIFIED items 1–3 marked resolved with the check's pages; W22/23 and W20/21 added. |
| S6 — Beat 1 protein symbol; Beat 13 sequencing | applied | Beat 1 vignette 2: glucose passes in at a small teal transport-protein symbol. Beat 13 action 7: history labels brighten briefly then dim, and only then is *equal water potentials* highlighted. |
| Runtime ruling | applied | Cut 1 taken; cuts 2–5 kept per the check. Final 2 s hold now declared separately. 1,338 words = 11:09.0; + 4 s read = 11:13.0; + 2 s hold = **11:15.0** (30 s over 10:45; the check accepts a modest overrun). E45 unchanged at 141 words / 74.5 s. No carrier hold added. |

New validator TOTAL: `TOTAL words 1338  cues 140  runtime at 120 wpm 11:09.0  beats 14  failing beats 0`
