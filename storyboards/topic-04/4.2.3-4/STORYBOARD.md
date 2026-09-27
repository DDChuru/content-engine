# 4.2.3-4 — Surface area to volume: calculating it and testing it with agar

**Storyboard, first draft. Cloud run 006, 27 September 2026.** No audio, no code, no render. Folder `storyboards/topic-04/4.2.3-4/`. Two outcomes delivered as one lesson: the calculation (4.2.3) and the investigation of the same principle (4.2.4); it stands alone (own hook, context, objectives, explanation, recap and exam close).
Cambridge 9700 syllabus 2025–2027, p.21 (mathematical requirements p.63; apparatus p.57; materials p.58). Command words **ILLUSTRATE (by calculating)** (4.2.3) and **INVESTIGATE** (4.2.4). Budget from `TOPIC-PLAN-04-MEMBRANES.md` (lesson list; §4.2.3, §4.2.4) and `TOPIC-04-WEIGHTS.md` (4.2.3 and 4.2.4 rows): **9:45 = 4.2.3 4:15 (6 teaching beats) + 4.2.4 5:30 (7 teaching beats); 0 error beats; teaching base 9:45 (about 1,170 words at 120 wpm)**; delivered here as **13 beats (13 teaching, 0 error)**, Beats 1–6 carrying 4.2.3 and Beats 7–13 carrying 4.2.4 (the recap and exam close cover both). Direct exposure in the cited Paper 2 blocks: 4.2.3 1/5 (S21/22 Q4(b), 2 marks); 4.2.4 1/5 (S21/22 Q4(c), 1 mark). Runtime estimated at **120 words per minute of final video**.

> **4.2.3** illustrate the principle that surface area to volume ratios decrease with increasing size by calculating surface areas and volumes of simple 3-D shapes (as shown in the Mathematical requirements)
>
> **4.2.4** investigate the effect of changing surface area to volume ratio on diffusion using agar blocks of different sizes

(syllabus p.21; the Mathematical requirements pointer resolves to p.63: "calculate surface areas and volumes of cuboids and cylinders".)

**Authorities read, in full:** `work/006/SHARED-SPECS.md` (binding: hard rules, file layout, shared models, shared numbers, verbatim list); `plan/topic-04/TOPIC-PLAN-04-MEMBRANES.md` (scope and authoring rules; §4.2.3 and §4.2.4 including the investigation table, the MF5 design additions and the safety line; §4.2.2's agar-plate entry for the boundary between the two agar demonstrations; lesson list and build order; shared-model table; traps table; UNVERIFIED register; PLAN-CHECK RESPONSE); `plan/topic-04/TOPIC-04-WEIGHTS.md` (4.2.3 and 4.2.4 rows and paragraphs; ledger rows S21/22 Q4(b), Q4(c); mathematical requirements paragraph; error register and its evidence-gaps paragraph: no error beat for 4.2.3 or 4.2.4); `cloud-inputs/003/standards/VIDEO-STRUCTURE.md` (all); `CONTENT-ARCHITECTURE.md`; `SYLLABUS-9700-DETAIL.md` (Topic 4 outcomes and introduction pp.21–22; apparatus pp.56–57; materials p.58; mathematical requirements p.63); the cleared examples `cloud-inputs/006/examples/3.1.3/STORYBOARD.md` and `3.2.1b/STORYBOARD.md`; `cloud-inputs/003/topic-03/3.1.1-2/CHECK.md` and `3.2.2-3/CHECK.md`; the plan check `cloud-checks/006/plan/CHECK.md` (branch `origin/cloud/006-checks`), especially MF1 (the S21/22 Q4 ledger rows and the 4.2.3-4 close) and MF5 (agar cubes); `cloud-inputs/006/evidence/GATE-CRITERIA-9700-04-CELL-MEMBRANES-AND-TRANSPORT.md` (G04: the Q4(b–c) location) and `COMPLEXITY-CALIBRATION-9700-BIOLOGY.md` (§4 DO-NOT-ADD). **No question paper, mark scheme or examiner report PDF was opened for this draft.** No verbatim S21/22 Q4 wording is in the SHARED-SPECS list, so every exam statement below is the plan check's description, used as our paraphrase with its citation and never in quotation marks.

**Build position:** ninth of the ten Topic 4 lessons: 4.1.1-2 → 4.1.3 → 4.1.4 → 4.2.1a → 4.2.1b → 4.2.6 → 4.2.2a → 4.2.2b → **4.2.3-4** → 4.2.5.

**Models used:** `DiffusionField` (4.2.1a; reused as a small inset of acid particles entering a cube, with no membrane: the open-boundary variant). **Models published here:** `SAVShapes` (cubes 1, 2, 3 cm with unfolding nets and a working panel; the cuboid check; the potato cylinder, r = 0.50 cm, h = 3.0 cm, with its net, dimensions reused by 4.2.5); `AgarCubeRig` (states `tray`, `cut`, `measure`, `baths`, `first-contact`, `decolourising`, `endpoint`, `limit-rule`); plain graph configuration `endpoint-vs-SAV`. Everything drawn is a MODEL or labelled apparatus; every invented number carries *our illustrative data*; the paper's numbers are labelled as the paper's.

---

## The causal spine

One idea carries the lesson: **for shapes of the same kind, volume grows faster than surface area as size increases, so the surface area to volume ratio falls, and the distance from the surface to the centre rises; in agar blocks that are otherwise alike, the smaller blocks (higher SA:V) change colour throughout sooner.**

> **Surface area is found by adding the areas of the faces (cube 6*l*², cuboid 2(*lw* + *lh* + *wh*), cylinder 2π*r*² + 2π*rh*) and volume by the product of the dimensions (cube *l*³, cuboid *lwh*, cylinder π*r*²*h*); dividing the first by the second gives SA:V, written *x* : 1 or in cm⁻¹. For cubes of side 1, 2 and 3 cm it falls 6, 3, 2 cm⁻¹. In the investigation, alkaline agar containing thymolphthalein is cut into cubes of side 2.0, 1.0 and 0.5 cm (SA:V calculated from measured edges: 3.0, 6.0, 12.0 cm⁻¹), each placed on an open mesh in its own equal-volume bath of acid from one stock, in excess, with its own stopwatch started at first contact; the mean time to complete decolourisation is plotted against calculated SA:V. Smaller cubes have shorter paths to their centres and less volume per unit exposed area; their earlier endpoint does not establish that acid molecules diffuse intrinsically faster through their agar.**

**What the mark schemes credit (plan-check descriptions, verified against the QP/MS by the plan check and tagged PDF-CHECKED (plan check) in the plan; used here as our paraphrase, never as quotations):** [S21/22 Q4(b), 2 marks, QP p.9 / MS p.14] cube C: surface area 54 cm², volume 27 cm³; correct volume unit plus calculation. [S21/22 Q4(c), 1 mark, QP p.9 / MS p.14] order of complete indicator change, A → B → C; universal indicator, initially blue, red in acid. [Syllabus p.63, verbatim] "calculate surface areas and volumes of cuboids and cylinders"; "recognise and use ratios". So the spine is what is credited: a calculation with the right area and volume units, and the order in which differently sized agar cubes finish changing colour. **No verbatim mark-scheme or examiner-report line for these parts is in the SHARED-SPECS verified list**, so none is shown on a quote card. The values, cube sizes, order and marks were independently PDF-checked against QP p.9 / MS p.14 in round 1 (UNVERIFIED 1 and 2 resolved). Beat 13's closing contrast card is captioned as our wording, not a mark-scheme reject line.

**The handle:** *wrapping paper and the present inside.* A bigger box needs more paper, but less paper for each cubic centimetre it holds. Converted at once, in Beat 4: *for the same shape, as size increases, volume increases faster than surface area, so the surface area to volume ratio decreases.* The handle is never the exam answer and is not a metaphor a mark scheme could credit; it is said once and immediately replaced by the sentence.

**Typicality rules applied.** "Volume increases faster than surface area" is bounded to **the same shape** (a flattened or folded shape can keep a high ratio; not taught, just not contradicted). Organisms: "many single-celled organisms" get oxygen by diffusion across their surface; larger size is "one reason" **many** larger organisms have specialised exchange surfaces and transport systems (named as framing only; later topics). The agar colour change is described only in real colours (blue → paler blue at the boundary → colourless). The colour boundary is described in the plan check's exact wording: it marks the indicator's pH transition as alkali is neutralised, not the position of the first acid molecules; no fixed separation between two fronts is claimed. The earlier endpoint in small cubes is explained by shorter paths and less volume per unit exposed area, never by faster diffusion; 1/t, where it appears, is labelled *reciprocal time to complete decolourisation / s⁻¹*, not a flux, diffusion coefficient or diffusion speed. No time ∝ distance² law is narrated, labelled or implied by a caption. The paper's universal indicator (blue at the start, red in acid) is kept distinct from our thymolphthalein. Hazard statements are for the working concentrations used: 0.1 mol dm⁻³ hydrochloric acid and 0.01 mol dm⁻³ sodium hydroxide are below the irritant-labelling threshold in the cited Practical Biology protocol (eye protection still worn, skin splashes rinsed); the thymolphthalein stock bottle's classification comes from an identified reference formulation (Carl Roth 8152 SDS, section 2) and is kept separate from the syllabus p.58 materials-list codes.

**Error beats:** none. The weights register assigns no error beat to 4.2.3 or 4.2.4 (no examiner diagnosis in the checked sources; evidence-gaps paragraph). No beat carries a COMMON MISTAKE or EXAM CONTRAST badge. **Beat 13 closes with a compact wording-contrast card** for the plan's trap row "Bigger organisms have less surface area", captioned *our wording contrast illustrating syllabus 4.2.3; not a mark-scheme reject line* (no verified R/I line exists for S21/22 Q4; SHARED-SPECS §2 allows a reject card captioned as ours). It carries no COMMON MISTAKE or EXAM CONTRAST badge and is not an error beat.

---

## The models, specified once

### `SAVShapes` (published here; dimensions reused by 4.2.5)

A plain working surface (light, gridded faintly at 1 cm = 1 unit) with three solid cubes drawn in consistent oblique projection, side by side at a common scale: **1 cm**, **2 cm**, **3 cm** (edge labels as SVG text nodes, each edge tagged with its length and unit). Faces in one neutral fill with a slightly darker top face; no organism imagery on the cubes. Caption *drawn to a common scale on screen; not life size*.

- **`net-unfold`** (per cube): the cube's faces hinge open (motion, ~1.5 s) into a cross-shaped net of six squares lying flat; as each square lands, a counter beside it ticks **1 … 6**, tag *6 faces*. Each square of the 1 cm net is labelled **1 cm × 1 cm = 1 cm²**; the 2 cm net is ruled into 2 × 2 unit squares so the four 1 cm² squares per face are countable, labelled **2 cm × 2 cm = 4 cm²**; the 3 cm net is ruled 3 × 3, labelled **3 cm × 3 cm = 9 cm²**. The net can fold back into the cube (reverse motion).
- **`fill-volume`** (per cube): unit cubes of 1 cm³ stack into the solid cube in layers (motion, ~1 s per cube; the 3 cm cube fills in three layers of nine), counter **1 cm³ … l³ cm³**.
- **Working panel** (right of the shapes), built line by line with units: **SA = 6*l*²** · **V = *l*³** · **SA:V = SA ÷ V = 6*l*² ÷ *l*³ = 6 ÷ *l***; per-cube rows (see Dataset 1). Ratio shown in both forms, e.g. **6 : 1** and **6 cm⁻¹**, with the unit derivation **cm² ÷ cm³ = cm⁻¹**.
- **`ratio-bars`**: beside each cube, a bar of height proportional to its SA:V (6, 3, 2 on a common scale), labelled **SA:V / cm⁻¹**; the bars shrink left to right as the cubes grow.
- **`centre-distance`**: a dashed line from the centre of the 1 cm cube to the middle of the nearest face, labelled **0.5 cm**; the same on the 3 cm cube, labelled **1.5 cm**.
- **`per-cm3`**: on each of the 1 cm and 3 cm cubes, the whole outer surface is highlighted together with the whole volume (no internal subcube is singled out as though it owned exposed faces), with a tag reading **surface per cm³ of volume: 6 cm²** (1 cm cube) and **2 cm²** (3 cm cube), labelled *whole cube's total outer area divided by its total volume*.
- **`cuboid-check`**: the 3 cm cube relabelled **cuboid: *l* = 3 cm, *w* = 3 cm, *h* = 3 cm**; the general cuboid lines typeset on the panel: **SA = 2(*lw* + *lh* + *wh*)** (three matching pairs of rectangular faces, each pair highlighted in turn as the three terms light) and **V = *lwh***; worked **2(9 + 9 + 9) = 54 cm²** and **3 × 3 × 3 = 27 cm³** (this 3, 3, 3 substitution is no longer shown in the beats after the round-1 cut; the generic cuboid and its three face pairs remain).
- **`cylinder-net`**: a solid cylinder, **diameter 1.0 cm (r = 0.50 cm)**, **length 3.0 cm**, labelled *potato cylinder dimensions (the 4.2.5 cylinder); calculation only, no tissue here*; it unrolls (motion, ~1.5 s) into **two circles** (each labelled **π*r*²**) and **one rectangle** whose one side is labelled **circumference = 2π*r* = π cm ≈ 3.14 cm** (the edge that wrapped round the circle is traced as it flattens) and whose other side is labelled **length *h* = 3.0 cm**. Panel lines: **SA = 2π*r*² + 2π*rh*** · **V = π*r*²*h*** and the worked rows of Dataset 2.

Motion contract: nets unfold and fold as rigid hinged faces (no stretching); unit cubes stack; bars change height smoothly; nothing else moves. No sphere is drawn (not in p.63's list).

### `AgarCubeRig` (published here)

Parts, each named with an SVG text label where it sits:
- **agar tray**: a shallow rectangular plastic tray of agar set about **2.5 cm deep**, uniformly **blue**, label **agar made with sodium hydroxide, 0.01 mol dm⁻³, and thymolphthalein indicator (blue)**; small type *one batch, prepared on the day and kept covered until cut; every cube cut from this tray* and *technical agar (syllabus p.58)*. Preparation card beside it (static, stated before any result): *agar made up in 0.01 mol dm⁻³ sodium hydroxide; thymolphthalein indicator added until a clear blue; poured and set in the tray*.
- **white tile** under the cutting; **scalpel** (label); **ruler in mm** (clear plastic, label); **blunt forceps** (label).
- **cubes**: three each of side **2.0 cm**, **1.0 cm**, **0.5 cm**, set out on the tile in three labelled rows; each cube carries a small tag with its **measured edge / mm** (20, 10, 5) and its **calculated SA:V / cm⁻¹** (3.0, 6.0, 12.0), tag *calculated from measured edge lengths*.
- **acid stock**: a bottle **hydrochloric acid, 0.1 mol dm⁻³ (one stock for every bath)**; a **100 cm³ measuring cylinder** (label).
- **acid baths**: identical **250 cm³ beakers**, each holding **100 cm³ of the same acid** (liquid surface level; the 100 cm³ mark noted on the measuring cylinder, not the beaker); in each, a **plastic mesh platform** (label *open mesh: all six faces exposed*) standing on short legs about 1 cm above the beaker floor, fully submerged. A white card stands behind the beakers (label *white background for judging colour*).
- **thermometer** (label): checks the three acid baths before each run; a **temperature-record field** beside each run label, caption *same room temperature; measure and record for each run*; the entry is left blank in this illustrative setup (no measured temperature invented). The three baths stay together away from direct heat, every cube comes from the same agar batch, and the fresh acid for runs 2 and 3 is allowed to reach the same temperature before use.
- **stopwatches**: one per beaker, each labelled with its cube (e.g. **2.0 cm · run 1**).
- **safety**: an eye-protection pictogram in the corner of every frame where acid, alkaline agar or indicator is handled; tags attached to the items: the working-solution tag *Hydrochloric acid, 0.1 mol dm⁻³; sodium hydroxide used to prepare the agar, 0.01 mol dm⁻³: these working concentrations are below the IRRITANT-labelling threshold in the cited Practical Biology protocol. Wear eye protection and rinse skin splashes with water. Working-solution information; do not copy the concentrated-stock hazard label onto the agar.* (on the acid bottle and on the tray); *Thymolphthalein indicator stock: 0.1% in denatured ethanol, Carl Roth 8152 reference formulation. Highly flammable liquid and vapour; causes serious eye irritation. Keep away from flames and other ignition sources; wear eye protection. These classifications describe the stock bottle, not the finished agar.* (on the indicator bottle, shown beside the preparation card), with a separate small line *syllabus p.58 materials-list codes: [F] [MH] [HH]*; *scalpel: cut on the tile, blade away from the body* (on the scalpel).

Handling (specified here; rendered still-frame verification pending): the scalpel cuts **straight down onto the white tile**, blade edge facing away from the body, the other hand's fingers behind the blade and clear of the cut line; strips are cut first, then cubes, then each face trimmed; the ruler is laid against each edge in turn and read at eye level. The acid is poured from the stock bottle into the measuring cylinder, then from the measuring cylinder into each beaker, each vessel tilted to about **120° from upright**, mouth below base, the stream leaving the computed lip and landing inside the receiving mouth; liquid surfaces level in every frame. Cubes are always moved with **blunt forceps**, gripped lightly by two opposite edges, never by hand.

States:
- **`tray`**: the covered tray, lid lifted off; preparation card and safety tags.
- **`cut`**: scalpel cutting a strip, then a cube, on the tile (motion; the cut faces show the same uniform blue as the surface, tag *blue all through*).
- **`measure`**: ruler against each edge; the tag's measured value appears; an uneven cube is trimmed until its faces are square, tag *faces square, edges equal*.
- **`baths`**: three beakers in a row (one per size), acid poured in, meshes in, stopwatches at rest; label *run 1*; later runs 2 and 3 use fresh cubes and fresh acid from the same stock in the same three beakers, rinsed between runs (time-lapse).
- **`first-contact`** (one atomic start event per cube): forceps lower the cube vertically towards the centre of its mesh; **on the rendered frame on which the cube's lower face first touches the acid surface, that cube's stopwatch starts**; the cube continues down and is released on the mesh, fully submerged within about 1 s; the forceps withdraw. The three cubes of a run are lowered one after another, each with its own start frame. Any later "t = 0" tag highlights the already-running stopwatch; it is never reset.
- **`decolourising`**: once the cube is submerged, **colourless** outer layers develop from its exposed faces (the lower face's change begins at its own contact, then the sides and top as they are immersed; compressed time can make later inward progress comparable) and thicken inward; beneath it a **narrow paler blue band** marks the boundary; inside it the core stays the original **blue** and shrinks. Colours are three real states only (blue, paler blue at the moving boundary, colourless); **no RGB tween between hues, no green, grey, purple or red**. The inward progress of the boundary is an illustrative animation profile timed so that the last blue disappears at the dataset time; no position–time law is drawn or labelled. The acid in the beaker stays colourless. **Time-lapse** caption *waiting compressed; each stopwatch shows the real elapsed time* on screen whenever the clocks run fast.
- **`endpoint`**: the frame on which the last trace of blue disappears (checked from the side through the beaker against the white card); that cube's stopwatch stops; tag **endpoint: complete decolourisation, judged by eye** with the time.
- **`limit-rule`** (shown as a rule card beside the rig, not as a result): *observation period: 30 min (1800 s)*; *if a cube has not fully decolourised by then: record "not complete at 1800 s"; do not invent an endpoint*; alternative *declared in advance: a fixed-time penetration measurement: remove the cube at a stated time, cut it in half on the tile and measure the colourless depth with the ruler, or estimate the percentage of the cube still coloured*. In this lesson's dataset all nine cubes finish inside the period (Dataset 5).
- **`results-table`**: beside the rig: columns *cube side (measured) / cm* · *calculated SA:V / cm⁻¹* · *time to complete decolourisation / s* (run 1, run 2, run 3) · *mean / s*; caption *our illustrative data*.

### `DiffusionField` (4.2.1a; reused as an inset)

Open-boundary variant, no membrane: a magnified corner of a cube in cross-section, the surrounding acid at left and the agar at right; small violet particle tokens (labelled **particles from the acid**) in random motion, with more entering the agar than leaving (net inward arrow labelled **net movement into the agar**); the agar region behind the boundary is drawn colourless and the rest blue with the paler blue band between. The neutralisation reaction itself is **not drawn** (no token reacts, merges or vanishes on screen), caption *particles drawn schematically; not to scale; far fewer than real; neutralisation not drawn*. Counter omitted in this reuse.

### Graph configuration `endpoint-vs-SAV` (published here)

Built on the Topic 3 `RateGraph` axis conventions (quantity / unit; solidus). y-axis **mean time to complete decolourisation / s** (0–1200, ticks every 200); x-axis **SA:V / cm⁻¹, calculated from measured edge lengths** (0–13, ticks at 3, 6, 9, 12). Points as crosses at the three means (Dataset 5); each point tagged with its cube size (**2.0 cm**, **1.0 cm**, **0.5 cm**). A smooth dashed trend line drawn through the three means only, labelled *trend through three means; not a fitted law*; no extrapolation beyond 3.0–12.0 cm⁻¹. Caption *our illustrative data; means of three cubes*. An optional side table (not plotted) gives *reciprocal time to complete decolourisation / s⁻¹* with that exact heading; no axis is ever labelled "rate of diffusion", "flux" or "diffusion speed".

---

## Beat by beat

Beat windows in the headings are provisional and follow the per-beat ledger (words ÷ 120); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch over 30 words without a stated visual change. There are no error beats.

### BEAT 1 · Hook and context · 0:00–0:47
**Narration:**
> Ever wondered why many single-celled organisms can get the oxygen they need by diffusion across their surface, while you need lungs, a heart and blood vessels? What a cell uses comes in across its surface, but it is used throughout its volume, and its waste leaves across that same surface. As a shape gets bigger, its surface and its volume do not grow at the same pace. In this lesson you will calculate exactly how they change, and then watch the consequence happen in blocks of agar.

**Visual action:**
1. **From the first frame**, a small single-celled organism outline (a rounded cell, schematic, no organelle detail) sits at left on a pale field, and a human outline stands at right with lungs, heart and a few vessels drawn schematically; `SAVShapes`' three cubes rest small along the bottom edge, unlabelled. At *Ever wondered why many single-celled organisms*, the hook question appears as a compact caption above the two outlines, never alone on the frame.
2. At *by diffusion across their surface*, small red paired-circle O₂ tokens drift in random motion around the cell and cross its outline with a net inward drift (motion), tag *diffusion across the surface*.
3. At *you need lungs, a heart and blood vessels*, the lungs, heart and vessels in the human outline brighten in turn, tag *specialised exchange surface and transport system (later topics)*.
4. At *comes in across its surface*, the cell's outline is traced once in the accent, tag **surface**; at *used throughout its volume*, its interior fills with a soft tint, tag **volume**.
5. At *its waste leaves across that same surface*, a few small grey tokens drift outward across the outline (motion), tag *waste out*.
6. At *do not grow at the same pace*, the two outlines are bracketed with a size tag *tiny* / *large*, and the three cubes along the bottom rise into view and grow slightly in emphasis, left to right; two small counters beside them, **surface** and **volume**, climb at visibly different speeds (no numbers yet).
7. At *calculate exactly how they change*, a blank working panel slides in beside the cubes; at *in blocks of agar*, a small blue agar cube appears beside the panel (label **agar**), then the frame dissolves to the objectives surface.

**On-screen text:** the hook question; *diffusion across the surface*; *surface*; *volume*; *waste out*; *agar*. Small type: *schematic outlines; not to scale*.

---

### BEAT 2 · What you will be able to do · 0:47–1:15
**Narration:**
> By the end you will be able to calculate the surface area and volume of cubes, cuboids and cylinders, and turn them into a surface area to volume ratio; to show that this ratio decreases as size increases; and to investigate the effect on diffusion with agar blocks, plotting the result against the ratio you calculated.

**Visual action:** Own styled surface, distinct background colour, **not the lesson diagram**: each line enters with motion beside a flat authored pictogram (simple line icons, not the lesson's models).
1. **From the first frame**, the objectives surface is on screen with three visible authored pictograms beside empty text slots down its left edge (a flat cube-net icon, a descending three-bar icon, and an agar-cube-and-stopwatch icon, all drawn in the surface's own style); at *calculate the surface area and volume*, line 1 enters beside the cube-net icon.
2. At *turn them into a surface area to volume ratio*, line 1's second half lands, the ratio **SA:V** highlighted.
3. At *this ratio decreases as size increases*, line 2 enters beside the descending-bars icon; the three bars shrink once.
4. At *investigate the effect on diffusion with agar blocks*, line 3 enters beside the agar-cube-and-stopwatch icon; at *plotting the result against the ratio you calculated*, a tiny axes glyph joins the icon.
   1. **CALCULATE** surface area, volume and SA:V for cubes, cuboids and cylinders
   2. **SHOW** that SA:V decreases as size increases
   3. **INVESTIGATE** SA:V and diffusion with agar blocks, plotted against the calculated ratio

Small type: *syllabus 4.2.3, "illustrate", and 4.2.4, "investigate", p.21.*

**On-screen text:** the three objective lines; the small-type syllabus note.

---

### BEAT 3 · Surface area and volume of a cube · 1:15–2:05
**Narration:**
> Start with a cube one centimetre along each edge. Its surface is six square faces; unfold it into a net and you can count them. Each face is one centimetre by one centimetre, one square centimetre, so six faces make six square centimetres. The volume is edge times edge times edge: one cubic centimetre. Now double the edge to two centimetres. Each face is two by two, four square centimetres, so the surface area is twenty-four square centimetres, and the volume is two cubed, eight cubic centimetres. Keep an eye on the units: area in square centimetres, volume in cubic centimetres.

**Visual action:**
1. **From the first frame**, `SAVShapes` fills the frame: the three cubes at left at a common scale, the working panel empty at right. At *a cube one centimetre along each edge*, the 1 cm cube moves forward, its edges labelled **1 cm**.
2. At *six square faces*, the six faces flash in turn; at *unfold it into a net*, `net-unfold` on the 1 cm cube; at *you can count them*, the counter ticks **1 … 6**, tag *6 faces*.
3. At *one square centimetre*, one net square is labelled **1 cm × 1 cm = 1 cm²**; at *six faces make six square centimetres*, the panel writes **SA = 6 × 1 cm² = 6 cm²** and the general line **SA = 6*l*²** beside it.
4. At *edge times edge times edge*, the net folds back and `fill-volume` places one unit cube, counter **1 cm³**; the panel writes **V = *l*³ = 1 × 1 × 1 = 1 cm³**.
5. At *double the edge to two centimetres*, the 2 cm cube moves forward, edges labelled **2 cm**; `net-unfold` opens it into a net ruled 2 × 2 on each face.
6. At *Each face is two by two*, one face's four unit squares are counted **1–4**, label **2 cm × 2 cm = 4 cm²**; at *twenty-four square centimetres*, the panel writes **SA = 6 × 4 cm² = 24 cm²**.
7. At *two cubed, eight cubic centimetres*, the net folds back and `fill-volume` stacks two layers of four unit cubes, counter to **8 cm³**; panel **V = 2³ = 8 cm³**.
8. At *Keep an eye on the units*, the units **cm²** and **cm³** on the panel are ringed, tags *area: square units* and *volume: cubic units*.

**On-screen text:** *SA = 6l²*; *V = l³*; the 1 cm and 2 cm rows; *6 faces*; *cm²*, *cm³*.

---

### BEAT 4 · The ratio falls as the size rises · 2:05–3:02
**Narration:**
> Now the three-centimetre cube: nine square centimetres a face, fifty-four in all, and twenty-seven cubic centimetres of volume. Divide surface area by volume for each cube. Six over one is six; twenty-four over eight is three; fifty-four over twenty-seven is two. Write them as six to one, three to one and two to one, or with units, per centimetre. The cubes got bigger and the ratio got smaller. Picture wrapping paper and the present inside: a bigger box needs more paper, but less paper for each cubic centimetre it holds. Written properly: for the same shape, as size increases, volume increases faster than surface area, so the surface area to volume ratio decreases.

**Visual action:**
1. **From the first frame**, `SAVShapes` holds with the 1 cm and 2 cm rows on the panel; at *the three-centimetre cube*, the 3 cm cube moves forward, edges labelled **3 cm**; at *nine square centimetres a face*, a quick `net-unfold` shows one face ruled 3 × 3, label **3 cm × 3 cm = 9 cm²**; at *fifty-four in all*, the panel row **SA = 6 × 9 cm² = 54 cm²**; at *twenty-seven cubic centimetres of volume*, `fill-volume` stacks three layers of nine, panel **V = 3³ = 27 cm³**.
2. At *Divide surface area by volume*, a new panel column **SA:V = SA ÷ V** opens; at *Six over one is six*, **6 ÷ 1 = 6**; at *twenty-four over eight is three*, **24 ÷ 8 = 3**; at *fifty-four over twenty-seven is two*, **54 ÷ 27 = 2**.
3. At *six to one, three to one and two to one*, each result gains its ratio form **6 : 1**, **3 : 1**, **2 : 1**; at *with units, per centimetre*, each gains **cm⁻¹**, with the working **cm² ÷ cm³ = cm⁻¹** in small type.
4. At *The cubes got bigger and the ratio got smaller*, `ratio-bars` rise beside the cubes and settle at 6, 3, 2; an arrow along the cubes reads **size increases**, an arrow along the bars reads **SA:V decreases**.
5. At *Picture wrapping paper*, a flat outline of a wrapped box appears small beside the 1 cm cube and a larger one beside the 3 cm cube (sheet outlines only, no text on them); at *less paper for each cubic centimetre it holds*, `per-cm3` highlights each whole cube's outer surface with its whole volume, tags **6 cm² per cm³** and **2 cm² per cm³**, labelled *whole cube's total outer area divided by its total volume*; the handle tag *handle, not an exam answer* sits in small type.
6. At *Written properly*, the sentence surface slides up beneath the shapes and builds clause by clause: at *for the same shape*, **For the same shape,**; at *volume increases faster than surface area*, **as size increases, volume increases faster than surface area,**; at *so the surface area to volume ratio decreases*, **so the surface area to volume ratio decreases.** The wrapped-box outlines fade; the sentence holds.

**On-screen text:** the 3 cm row; the SA:V column with ratio and cm⁻¹ forms; *size increases* / *SA:V decreases*; *6 cm² per cm³*, *2 cm² per cm³*; the sentence.

---

### BEAT 5 · Cuboids, and a potato cylinder · 3:02–4:09
**Narration:**
> The same method works for any cuboid: add the areas of its six rectangular faces, which come in three matching pairs, and multiply length, width and height for the volume. For a cylinder, unfold it into two circles and one rectangle. Take a potato cylinder of radius nought point five centimetres and length three centimetres. Each circle is pi r squared. One side of the rectangle is the circumference, two pi r, and the other side is the length. Altogether that is three point five pi, or eleven point nought square centimetres. The volume is pi r squared times the length, nought point seven five pi, two point three six cubic centimetres, so the ratio is four point six seven per centimetre.

**Visual action:**
1. **From the first frame**, `SAVShapes` holds with the three cubes and the completed SA:V column; at *any cuboid*, `cuboid-check` begins: a generic cuboid outline with edges **l**, **w**, **h** appears beside the cubes.
2. At *three matching pairs*, the three pairs of opposite faces light in turn and the panel typesets **SA = 2(*lw* + *lh* + *wh*)**, each term lighting with its pair; at *length, width and height*, **V = *lwh***.
3. At *For a cylinder*, the cubes slide left and shrink; the cylinder enters (`cylinder-net`), labelled *potato cylinder dimensions (the 4.2.5 cylinder); calculation only, no tissue here*; at *two circles and one rectangle*, it unrolls into its net.
4. At *radius nought point five centimetres*, the circle's radius is drawn and labelled **r = 0.50 cm** (diameter **1.0 cm** in small type); at *length three centimetres*, the rectangle's side is labelled **h = 3.0 cm**.
5. At *Each circle is pi r squared*, both circles are labelled **π*r*² = π(0.50)² = 0.25π cm²**; panel **2π*r*² = 0.50π cm²**.
6. At *the circumference, two pi r*, the edge of the rectangle that wrapped the circle is traced back round the circle and labelled **2π*r* = 2π(0.50) = π cm ≈ 3.14 cm**; at *the other side is the length*, the other edge pulses, **3.0 cm**; panel **2π*rh* = π × 3.0 = 3.0π cm²**.
7. At *three point five pi*, panel **SA = 0.50π + 3.0π = 3.5π cm²**; at *eleven point nought square centimetres*, **= 11.0 cm² (3 s.f.)**.
8. At *pi r squared times the length*, panel **V = π*r*²*h* = π(0.50)²(3.0) = 0.75π cm³**; at *two point three six cubic centimetres*, **= 2.36 cm³ (3 s.f.)**.
9. At *four point six seven per centimetre*, **SA:V = 3.5π ÷ 0.75π = 4.67 cm⁻¹ (4.7 : 1)**, with small type *π cancels; the rounded values give 11.0 ÷ 2.36 = 4.66, so divide before rounding*.

**On-screen text:** the cuboid formulae; the cylinder labels and working; *potato cylinder dimensions (the 4.2.5 cylinder); calculation only, no tissue here*.

---

### BEAT 6 · Why size matters to a living thing · 4:09–5:03
**Narration:**
> Why does this matter to a living thing? An animal cell like yours takes in oxygen and glucose and gets rid of waste across its surface, yet the whole of its volume uses supplies. The one-centimetre cube has six square centimetres of surface for each cubic centimetre inside, and its centre is only half a centimetre from a face. The three-centimetre cube has two square centimetres per cubic centimetre, and its centre is one and a half centimetres in. That is one reason many larger organisms have specialised exchange surfaces and transport systems, which later topics teach. Diffusion has to cover those distances, so now test it.

**Visual action:**
1. **From the first frame**, `SAVShapes` holds the 1 cm and 3 cm cubes large at centre (the 2 cm cube small between them) with their `ratio-bars`; at *An animal cell like yours*, a small cell outline appears above the cubes, schematic. Oxygen tokens cross the cell boundary; glucose tokens enter through a small labelled carrier-protein symbol on that boundary, tagged “glucose: transport protein; recall 4.2.1”. This is a route reminder only, with no new carrier cycle or energy claim. Waste arrows remain generic. Do not depict glucose passing through an unmarked lipid region. Tag *exchange across the surface*.
2. At *the whole of its volume uses supplies*, the cell's interior tints evenly, tag *used throughout the volume*.
3. At *six square centimetres of surface for each cubic centimetre*, `per-cm3` highlights the 1 cm cube's whole outer surface with its whole volume, **6 cm² per cm³** (*whole cube's total outer area divided by its total volume*); at *only half a centimetre from a face*, `centre-distance` draws **0.5 cm**.
4. At *two square centimetres per cubic centimetre*, `per-cm3` on the whole 3 cm cube (whole outer surface with whole volume), **2 cm² per cm³**; at *one and a half centimetres in*, `centre-distance` draws **1.5 cm**.
5. At *specialised exchange surfaces and transport systems*, the Beat 1 human outline returns small at right with lungs and vessels lit, tag *later topics; named here only*.
6. At *Diffusion has to cover those distances*, the two dashed centre lines pulse; at *so now test it*, the small blue agar cube from Beat 1 slides in beside the 3 cm cube and the frame transitions to the bench.

**On-screen text:** *6 cm² per cm³*, *0.5 cm*; *2 cm² per cm³*, *1.5 cm*; *whole cube's total outer area divided by its total volume*; *exchange across the surface*; *glucose: transport protein; recall 4.2.1*; *later topics; named here only*.

---

### BEAT 7 · The agar and what its colour responds to · 5:03–6:00
**Narration:**
> Here is the material. Agar is a jelly that is mostly water, so dissolved particles can diffuse through it. This agar was made up with dilute sodium hydroxide, nought point nought one moles per cubic decimetre, plus thymolphthalein indicator. Thymolphthalein responds to pH: it is blue in this alkaline agar, and colourless once enough acid has diffused in to neutralise the alkali. That suits the method, because the alkali gives a clear starting blue, and blue to colourless is easy to see against a white background. The change is not a sharp line, though; a paler blue band sits at the boundary, so you judge the endpoint by eye, the same way every time.

**Visual action:**
1. **From the first frame**, `AgarCubeRig` in `tray`: the covered agar tray on the bench with the white tile, scalpel, mm ruler and blunt forceps beside it, the eye-protection pictogram in the corner. At *Here is the material*, the lid lifts off; the uniform blue agar is labelled **agar made with sodium hydroxide, 0.01 mol dm⁻³, and thymolphthalein indicator (blue)**.
2. At *a jelly that is mostly water*, a magnifier circle on the agar shows a loose schematic mesh with water tokens between its strands, caption *schematic; not to scale*; at *dissolved particles can diffuse through it*, a few violet particle tokens wander through the gaps (motion).
3. At *dilute sodium hydroxide*, the preparation card enters beside the tray: *agar made up in 0.01 mol dm⁻³ sodium hydroxide; thymolphthalein indicator added until a clear blue; poured and set in the tray*; the working-solution tag *Hydrochloric acid, 0.1 mol dm⁻³; sodium hydroxide used to prepare the agar, 0.01 mol dm⁻³: these working concentrations are below the IRRITANT-labelling threshold in the cited Practical Biology protocol. Wear eye protection and rinse skin splashes with water. Working-solution information; do not copy the concentrated-stock hazard label onto the agar.* attaches to the tray; at *plus thymolphthalein indicator*, the indicator bottle appears beside the card with its tag *Thymolphthalein indicator stock: 0.1% in denatured ethanol, Carl Roth 8152 reference formulation. Highly flammable liquid and vapour; causes serious eye irritation. Keep away from flames and other ignition sources; wear eye protection. These classifications describe the stock bottle, not the finished agar.* and, separately, the small line *syllabus p.58 materials-list codes: [F] [MH] [HH]*.
4. At *Thymolphthalein responds to pH*, a real-world note panel opens at right, headed **what the colour responds to**: line 1 *pH: blue while the agar is alkaline*; at *colourless once enough acid has diffused in*, line 2 *colourless once acid has lowered the pH below the indicator's transition range*, beside two real swatches, **blue** and **colourless** (switching, no tween).
5. At *That suits the method*, the note gains **fit**: at *a clear starting blue*, *the alkali keeps the agar well on the blue side at the start*; at *easy to see against a white background*, *blue → colourless: high contrast against white card*; a white card slides in behind a test cube.
6. At *not a sharp line*, a small cut cube face (from a separate practice cube, labelled *illustration*) shows a colourless rim, a narrow **paler blue band** and a blue core; at *a paler blue band sits at the boundary*, the band is ringed, tag *boundary: paler blue*; at *the same way every time*, the note's last line lands: *endpoint judged by eye: last trace of blue gone, viewed from the side against white card, the same way for every cube*.

**On-screen text:** tray label; preparation card; the working-solution tag and the indicator-stock tag; the syllabus p.58 materials-list codes line; the **what the colour responds to** note (responds to · fit · endpoint judgement); swatches **blue**, **colourless**; *boundary: paler blue*.

---

### BEAT 8 · Cutting and measuring the cubes · 6:00–6:45
**Narration:**
> Cut the cubes on a white tile with a scalpel, pressing straight down with the blade angled away from you: sides of two centimetres, one centimetre and half a centimetre, three of each size. Measure every edge with a millimetre ruler and trim until the faces are square, because an uneven cube has a different surface area and a different path to its centre. From the measured edges you calculate each ratio: six l squared over l cubed simplifies to six over l, which gives three, six and twelve per centimetre.

**Visual action:**
1. **From the first frame**, `AgarCubeRig` in `cut`: the open tray, white tile, scalpel, mm ruler and forceps, eye-protection pictogram in the corner; at *Cut the cubes on a white tile*, a strip of agar is lifted onto the tile with the forceps.
2. At *pressing straight down*, the scalpel cuts straight down onto the tile (motion), the other hand's fingers behind the blade; at *the blade angled away from you*, the tag *scalpel: cut on the tile, blade away from the body* attaches; the new cut face shows the same blue, tag *blue all through*.
3. At *two centimetres, one centimetre and half a centimetre*, three cubes of each size appear in three labelled rows on the tile: **2.0 cm**, **1.0 cm**, **0.5 cm**; at *three of each size*, a **×3** tag lands on each row.
4. At *Measure every edge with a millimetre ruler*, `measure`: the ruler lies against one edge of a 2.0 cm cube, read at eye level, tag **20 mm**; the 1.0 cm and 0.5 cm cubes follow in time-lapse, **10 mm**, **5 mm**.
5. At *trim until the faces are square*, one slightly lopsided 1.0 cm cube has a sliver trimmed from one face (scalpel straight down on the tile), tag *faces square, edges equal*; at *a different path to its centre*, a ghost of the lopsided cube shows its centre offset, with two unequal dashed lines from centre to faces, then dissolves.
6. At *you calculate each ratio*, each row gains its tag; at *simplifies to six over l*, the working lands above the rows: **SA:V = 6*l*² ÷ *l*³ = 6 ÷ *l***; at *three, six and twelve per centimetre*, **6 ÷ 2.0 = 3.0 cm⁻¹**, **6 ÷ 1.0 = 6.0 cm⁻¹**, **6 ÷ 0.5 = 12.0 cm⁻¹**, each on its row, tag *calculated from measured edge lengths*.

**On-screen text:** row labels and ×3; measured edges 20, 10, 5 mm; the scalpel tag; *faces square, edges equal*; the 6 ÷ *l* working and the three SA:V values; *calculated from measured edge lengths*.

---

### BEAT 9 · One bath per cube, and a clock from first contact · 6:45–7:35
**Narration:**
> Each cube gets its own beaker of acid: one hundred cubic centimetres of hydrochloric acid, nought point one moles per cubic decimetre, all from the same stock, at the same recorded room temperature, far more than it takes to neutralise even the largest cube's alkali. A plastic mesh inside each beaker holds the cube off the bottom, so acid reaches all six faces. These working concentrations are below the irritant-labelling threshold in this protocol; still wear eye protection and rinse skin splashes with water. Lower each cube onto its mesh with forceps. Each cube has its own stopwatch, started at the moment the cube first touches the acid.

**Visual action:**
1. **From the first frame**, `AgarCubeRig` in `baths`: three empty 250 cm³ beakers in a row in front of a white card, a stopwatch at rest beside each, the cubes on the tile at left; at *its own beaker of acid*, each beaker is labelled with one cube size (**2.0 cm**, **1.0 cm**, **0.5 cm**) and *run 1*.
2. At *one hundred cubic centimetres of hydrochloric acid*, the acid stock bottle appears, label **hydrochloric acid, 0.1 mol dm⁻³ (one stock for every bath)**, with the working-solution tag *Hydrochloric acid, 0.1 mol dm⁻³; sodium hydroxide used to prepare the agar, 0.01 mol dm⁻³: these working concentrations are below the IRRITANT-labelling threshold in the cited Practical Biology protocol. Wear eye protection and rinse skin splashes with water. Working-solution information; do not copy the concentrated-stock hazard label onto the agar.*; it pours into the 100 cm³ measuring cylinder at about 120° from upright, stream from the lip into the cylinder's mouth, filled to the 100 cm³ mark (meniscus level); the cylinder then pours into the first beaker at about 120°, stream from its lip into the beaker mouth; the other two beakers fill the same way in time-lapse. At *all from the same stock*, a bracket joins the three beakers to the one bottle. A labelled thermometer checks the three acid baths before each run. Show the same room-temperature condition for every bath and a temperature-record field beside the run label. Caption “same room temperature; measure and record for each run”. Do not invent a measured temperature: retain a blank entry in this illustrative setup. Keep the three baths together away from direct heat, use the same agar batch, and allow the fresh acid to reach the same temperature before runs 2 and 3.
3. At *far more than it takes to neutralise even the largest cube's alkali*, a small tag beside the 2.0 cm beaker: **acid 0.010 mol H⁺ · alkali in a 2.0 cm cube 0.00008 mol OH⁻ · acid in excess (about 125 times)** (Dataset 4).
4. At *A plastic mesh inside each beaker*, a mesh platform on short legs is lowered into each beaker with forceps and sits submerged, label *open mesh: all six faces exposed*; at *acid reaches all six faces*, the six faces of a ghost cube on the mesh light in turn.
5. At *below the irritant-labelling threshold*, the eye-protection pictogram enlarges briefly and a pair of safety glasses is shown worn by the working hands' owner (upper edge of frame); the tray tag and the acid tag pulse.
6. At *Lower each cube onto its mesh with forceps*, `first-contact` for the 2.0 cm cube: blunt forceps grip it lightly by two opposite edges and lower it vertically towards the mesh.
7. At *Each cube has its own stopwatch*, the three stopwatches are labelled **2.0 cm · run 1**, **1.0 cm · run 1**, **0.5 cm · run 1**; **on the rendered frame on which the 2.0 cm cube's lower face first touches the acid, its stopwatch starts**; the cube is released on the mesh, fully submerged within about 1 s. At *first touches the acid*, the contact point is ringed and the already-running stopwatch pulses, tag **t = 0: first contact** (it is not reset). The 1.0 cm and 0.5 cm cubes follow the same sequence, each stopwatch starting on its own cube's first-contact frame.

**On-screen text:** beaker and bottle labels; the thermometer label, temperature-record field and *same room temperature; measure and record for each run*; the excess tag; *open mesh: all six faces exposed*; the safety tags; stopwatch labels; *t = 0: first contact*.

---

### BEAT 10 · Watching the colour boundary move in · 7:35–8:41
**Narration:**
> Now watch. Once the cube is submerged, colourless layers develop from its exposed faces and thicken inward, while the blue core shrinks, with that paler band at the boundary. The colour boundary marks the indicator's pH transition as the alkali is neutralised. It is not the position of the first acid molecules. The waiting is compressed here, but each stopwatch keeps the real elapsed time. The smallest cube loses its last blue first, after about seventy seconds, the middle one after about four and a half minutes, the largest after about seventeen. If a big cube has not finished by the end of your observation period, record that limit rather than inventing an endpoint, or declare beforehand a fixed time at which you cut the cubes open and measure how far the colour has gone.

**Visual action:**
1. **From the first frame**, `AgarCubeRig` with the three run-1 beakers in front of the white card, cubes on their meshes, stopwatches running; at *Once the cube is submerged*, `decolourising` shows on all three cubes, each having begun at its own first contact: the lower face's change began at that face's contact, then the sides and top as they were immersed (compressed time makes the later inward progress comparable); at *colourless layers develop from its exposed faces*, a colourless rim shows on all six exposed faces; at *thicken inward*, the rim thickens and the blue cores shrink (motion; real colours only).
2. At *with that paler band at the boundary*, the narrow **paler blue** band between colourless rim and blue core is ringed on the 2.0 cm cube, tag *boundary*.
3. At *The colour boundary marks the indicator's pH transition*, the `DiffusionField` inset opens at upper right: particles from the acid in random motion with a net inward drift into the agar, colourless zone behind the band, blue ahead, caption *particles drawn schematically; not to scale; far fewer than real; neutralisation not drawn*; at *as the alkali is neutralised*, the band in the inset is labelled **indicator's pH transition: alkali being neutralised here**.
4. At *It is not the position of the first acid molecules*, a tag beneath the inset reads, as our caption: *The colour boundary marks the indicator's pH transition as alkali is neutralised. It is not the position of the first acid molecules, and this demonstration does not measure a fixed separation between two fronts.* (small type: *wording from our plan check, MF5*); the inset closes.
5. At *The waiting is compressed here*, the caption **waiting compressed; each stopwatch shows the real elapsed time** appears and the stopwatches run fast; at *the real elapsed time*, one stopwatch face zooms briefly to show seconds ticking through minutes.
6. At *The smallest cube loses its last blue first*, `endpoint` on the 0.5 cm cube: the last trace of blue vanishes (one-frame switch from paler blue to colourless at the centre), its stopwatch stops at **70 s**, tag **endpoint: complete decolourisation, judged by eye**; at *about four and a half minutes*, the 1.0 cm cube reaches its endpoint, stopwatch **262 s (4 min 22 s)**; at *the largest after about seventeen*, the 2.0 cm cube, stopwatch **1010 s (16 min 50 s)**. The results table fills row by row, *run 1*; runs 2 and 3 then play in rapid time-lapse with fresh cubes and fresh acid from the same stock, filling their columns (Dataset 5); caption *our illustrative data*.
7. At *the end of your observation period*, `limit-rule` card enters beside the rig: *observation period: 30 min (1800 s)*; at *record that limit rather than inventing an endpoint*, the line *if not complete: record "not complete at 1800 s"; no invented endpoint*; small type *in this dataset all nine cubes finished within 1800 s*.
8. At *declare beforehand a fixed time*, the card's alternative line lands: *declared in advance: fixed-time penetration measurement (colourless depth, or percentage of the cube still coloured)*; at *cut the cubes open*, a thumbnail shows a cube removed with forceps and cut in half on the white tile (blade straight down, away from the body); at *how far the colour has gone*, the ruler measures the colourless depth on the cut face, tag *colourless depth / mm at the stated time*.

**On-screen text:** *boundary*; the inset labels and caption; the plan-check boundary caption; *waiting compressed; each stopwatch shows the real elapsed time*; endpoint tags with times; the results table; the limit-rule card.

---

### BEAT 11 · The results against SA:V, and what they mean · 8:41–9:36
**Narration:**
> Three cubes of each size give three times; take the mean. Plot mean time to complete decolourisation against surface area to volume ratio, the ratio you calculated from the measured edges, as the independent variable on the x-axis. As the ratio goes up, the time falls steeply. Why? Smaller cubes have shorter paths to their centres and less volume per unit exposed area. Their earlier endpoint does not establish that acid diffuses faster through their agar. If you work out one over the time, call it the reciprocal time to complete decolourisation, not a flux or a diffusion speed.

**Visual action:**
1. **From the first frame**, `AgarCubeRig` shrinks to the left edge with its completed `results-table` beside it; at *take the mean*, the mean column fills: **1016 s**, **260 s**, **70 s**, each with its working in small type (Dataset 5).
2. At *Plot mean time to complete decolourisation*, `endpoint-vs-SAV` draws at right; the y-axis label writes **mean time to complete decolourisation / s**; at *calculated from the measured edges*, the x-axis label writes **SA:V / cm⁻¹, calculated from measured edge lengths**; at *as the independent variable on the x-axis*, the x-axis is ringed, tag **independent variable (calculated)**.
3. At *As the ratio goes up*, the three mean crosses drop from the table onto the graph at (3.0, 1016), (6.0, 260), (12.0, 70), each tagged with its cube size; at *the time falls steeply*, the dashed trend line draws through them, label *trend through three means; not a fitted law*; caption *our illustrative data; means of three cubes*; the 2.0 cm point is ringed with **1016 s ≈ 17 min** and the 0.5 cm point with **70 s** (shown, not spoken).
4. At *Smaller cubes have shorter paths to their centres*, `SAVShapes`-style ghosts of the 2.0 cm and 0.5 cm cubes appear above the graph with `centre-distance` lines **1.0 cm** and **0.25 cm**; at *less volume per unit exposed area*, their tags read **2.0 cm cube: 0.33 cm³ per cm²** and **0.5 cm cube: 0.083 cm³ per cm²** (Dataset 3).
5. At *does not establish that acid diffuses faster*, a caption lands beneath the ghosts, as our wording: *earlier endpoint ≠ faster diffusion: shorter path, less volume per unit exposed area*.
6. At *one over the time*, an optional side table slides in (not plotted), headed exactly **reciprocal time to complete decolourisation / s⁻¹**, rows **0.00098**, **0.0038**, **0.014**; at *not a flux or a diffusion speed*, ghost headings *rate of diffusion* and *flux* appear beside it, each struck through, small type *the cubes hold different amounts of alkali*.

**On-screen text:** the means; the axis labels; *independent variable (calculated)*; *trend through three means; not a fitted law*; *our illustrative data; means of three cubes*; the path and volume-per-area tags; the reciprocal-time table and its exact heading.

---

### BEAT 12 · What I told you, on the shapes, the rig and the graph · 9:36–10:29
**Narration:**
> So here it is, on the shapes, the rig and the graph. Surface area in square centimetres, volume in cubic, and their ratio per centimetre: six, three and two for the one, two and three centimetre cubes, falling as size rises. In the agar, one acid bath per cube and a stopwatch from first contact; the colourless layer moves in from every face, and the boundary marks the indicator's change as alkali is neutralised. Against the calculated ratio, the higher the ratio, the shorter the time to decolourise completely: shorter paths, less volume per unit area.

**Visual action:** **No new slide.** The screen returns to the layout built through the lesson: `SAVShapes` at upper left (three cubes with `ratio-bars` and the cylinder net, working panel reduced), `AgarCubeRig` at lower left (keep the completed run's colourless cubes, endpoint clocks and result table; beside them retain the familiar mid-run cutaway from Beat 10, labelled “earlier during exposure: explanatory snapshot”), `endpoint-vs-SAV` at right with its three means. Static. Key points fade in in place.
1. **From the first frame**, the whole layout is on screen and settles; at *on the shapes, the rig and the graph*, nothing moves.
2. At *Surface area in square centimetres*, the **cm²** and **cm³** units on the panel brighten; at *their ratio per centimetre*, **cm⁻¹** brightens.
3. At *six, three and two*, the three bars brighten in turn with **6 : 1 · 3 : 1 · 2 : 1**; at *falling as size rises*, the arrow **SA:V decreases** brightens.
4. At *one acid bath per cube*, the three beakers and the tag *same stock, acid in excess, open mesh* brighten; at *a stopwatch from first contact*, the stopwatches and **t = 0: first contact** brighten.
5. At *the colourless layer moves in from every face*, highlight that snapshot's colourless rim; at *the indicator's change as alkali is neutralised*, ring its paler-blue band (tag *pH transition, not the first acid*). Never restore blue to a completed cube or place a blue core beside its completed-endpoint clock.
6. At *the higher the ratio*, the x-axis label brightens; at *the shorter the time to decolourise completely*, the three crosses and the trend brighten; at *less volume per unit area*, the path and volume-per-area tags return small beside the graph.

**On-screen text:** the in-place tags only (as listed); *earlier during exposure: explanatory snapshot*; the cylinder net keeps its **4.67 cm⁻¹** label in the layout (not spoken).

---

### BEAT 13 · How it is asked, one point to keep, and the single-celled organism · 10:29–11:29
**Narration:**
> How this reaches you. A June 2021 paper showed agar cubes labelled A, B and C. A calculation on cube C, the three-centimetre cube, was credited for its surface area, fifty-four square centimetres, and its volume, twenty-seven cubic centimetres, with the correct volume unit: two marks. A further mark was for the order in which the cubes finished changing colour: A, then B, then C. That paper used universal indicator, blue at the start and red in acid, not our thymolphthalein. And keep one point straight: a bigger cube has more surface area, but less surface for each unit of volume. Beyond the mark scheme, that answers our opening question: a single-celled organism's high ratio and short distances can let diffusion meet its needs.

**Visual action:**
1. **From the first frame**, the familiar lesson layout stays on screen at right, reduced (`SAVShapes` with the three cubes and SA:V column, `AgarCubeRig` beakers, `endpoint-vs-SAV`); at *How this reaches you*, a compact forms surface opens at left beside it, one row per form.
2. At *A June 2021 paper showed agar cubes labelled A, B and C*, the header **June 2021 Paper 22 Q4 (S21/22), QP p.9 / MS p.14** lands with small type *Source checked against S21/22 QP p.9 and MS p.14 in independent round 1. Paper cubes: A 1 cm, B 2 cm, C 3 cm. Our description, not a reproduction of the question figure. Our practical uses different cube sizes and separate baths.*
3. At *A calculation on cube C, the three-centimetre cube*, row 1: **calculate for cube C** · *S21/22 Q4(b), 2 marks*; the 3 cm cube in the layout brightens with its row **54 cm² · 27 cm³**; at *with the correct volume unit*, the **cm³** is ringed; small type *credited: surface area 54 cm², volume 27 cm³, correct volume unit plus calculation (plan-check description, not the scheme's wording)*.
4. At *the order in which the cubes finished changing colour*, row 2: **order of complete indicator change** · *S21/22 Q4(c), 1 mark*; at *A, then B, then C*, illuminate the paper's icons A → B → C, small type *credited order A → B → C (plan-check description)*. Separately illuminate our graph points in this order: (12.0, 70), labelled 0.5 cm; (6.0, 260), labelled 1.0 cm; (3.0, 1016), labelled 2.0 cm. This is right to left on the increasing-SA:V axis. Keep the tag “our illustrative data: smaller cubes finished first”. The paper's cubes are A = 1 cm, B = 2 cm, C = 3 cm; do not assign them our practical's 0.5, 1.0 and 2.0 cm dimensions.
5. At *That paper used universal indicator*, a two-column panel distinguishes them: left *the paper: universal indicator*, two static swatches **blue** (start) and **red** (in acid), captioned *the paper's indicator; not our demonstration; no colour sequence shown*; right *our demonstration: thymolphthalein*, swatches **blue** → **colourless**.
6. At *keep one point straight*, show a compact card beside the familiar cubes: “✗ A bigger cube has less surface area.” / “✓ A bigger cube has more surface area, but less surface area per unit volume.” Strike the wrong line; speak only the existing correct sentence. Caption “our wording contrast illustrating syllabus 4.2.3; not a mark-scheme reject line”. No COMMON MISTAKE or EXAM CONTRAST badge. Retain the cubes and their worked values throughout.
7. At *Beyond the mark scheme*, a small panel labelled **beyond the mark scheme** (dashed border, no marking tick, no MS tab) opens beneath the layout while the forms and the paper's answers stay visible; the Beat 1 cell outline returns small inside it, O₂ tokens crossing its surface; at *our opening question*, the Beat 1 hook caption returns small at the panel's top edge; at *high ratio and short distances*, the 0.5 cm agar cube's short `centre-distance` line appears beside the cell, tag *high SA:V · short distance*; at *meet its needs*, the cell's interior tints evenly. **Exit cue: end of *meet its needs*.** Final frame held 2 s: forms and the paper's answers at left, the lesson layout at right, the contrast card and the beyond-the-mark-scheme panel beneath. No slogan.

**On-screen text:** the header, its source caption and two form rows with citations; the indicator comparison panel; the wording-contrast card and its caption; the **beyond the mark scheme** panel; *high SA:V · short distance*.

---

## Datasets

Datasets 1–3 are calculations (the shared numbers of SHARED-SPECS §4, identical across lessons); Dataset 4 is a stoichiometric check; Dataset 5 is **our illustrative data**; Dataset 6 is the paper's values as described by the plan check. Every derived number is worked.

### Dataset 1 — cubes 1, 2, 3 cm (Beats 3, 4, 6, 12, 13)

SA = 6*l*²; V = *l*³; SA:V = 6*l*² ÷ *l*³ = 6 ÷ *l*; units cm² ÷ cm³ = cm⁻¹.

| side *l* / cm | face area / cm² | SA / cm² | V / cm³ | SA:V / cm⁻¹ | ratio |
|---|---|---|---|---|---|
| 1 | 1 × 1 = 1 | 6 × 1 = **6** | 1³ = **1** | 6 ÷ 1 = **6.0** | 6 : 1 |
| 2 | 2 × 2 = 4 | 6 × 4 = **24** | 2³ = **8** | 24 ÷ 8 = **3.0** | 3 : 1 |
| 3 | 3 × 3 = 9 | 6 × 9 = **54** | 3³ = **27** | 54 ÷ 27 = **2.0** | 2 : 1 |

Check by 6 ÷ *l*: 6 ÷ 1 = 6; 6 ÷ 2 = 3; 6 ÷ 3 = 2. Cuboid check (Beat 5), *l* = *w* = *h* = 3 cm: SA = 2(3×3 + 3×3 + 3×3) = 2 × 27 = 54 cm²; V = 3 × 3 × 3 = 27 cm³. Surface per cm³ (Beats 4, 6): 6 cm² per cm³ (1 cm cube) and 2 cm² per cm³ (3 cm cube), i.e. the SA:V values. Centre-to-face distance (Beat 6) = *l* ÷ 2: 0.5 cm and 1.5 cm. Doubling the side (1 → 2 cm) multiplies SA by 4 (6 → 24) and V by 8 (1 → 8); not narrated as a law, only visible in the table. The 3 cm cube's 54 cm² and 27 cm³ are the S21/22 Q4(b) cube C values (plan §4.2.3).

### Dataset 2 — potato cylinder, r = 0.50 cm, h = 3.0 cm (Beats 5, 12)

Net: two circles, each π*r*² = π(0.50)² = 0.25π cm² (0.785 cm²); one rectangle 2π*r* × *h* = π × 3.0 = 3.0π cm² (sides 3.14 cm × 3.0 cm; 9.42 cm²).
- **SA** = 2π*r*² + 2π*rh* = 2π(0.50)² + 2π(0.50)(3.0) = 0.50π + 3.0π = 3.5π = 10.996 cm² = **11.0 cm²** (3 s.f.). Check from the net: 0.785 + 0.785 + 9.425 = 10.995 cm².
- **V** = π*r*²*h* = π(0.50)²(3.0) = 0.75π = 2.356 cm³ = **2.36 cm³** (3 s.f.).
- **SA:V** = 3.5π ÷ 0.75π = 4.667 = **4.67 cm⁻¹** (4.7 : 1). (Dividing the rounded values, 11.0 ÷ 2.36 = 4.66, shows why the division is done before rounding; stated in small type in Beat 5.)
Significant figures: r and h given to 2 s.f.; results to 3 s.f. (syllabus p.63: the same as, or one more than, the smallest number of significant figures in the data).

### Dataset 3 — agar cubes, SA:V from measured edges (Beats 8, 11, 12)

Measured edges (mm ruler; illustrative measurements equal to the intended sizes): 20 mm, 10 mm, 5 mm → 2.0, 1.0, 0.5 cm.

| side / cm | SA = 6*l*² / cm² | V = *l*³ / cm³ | SA:V = 6 ÷ *l* / cm⁻¹ | volume per unit exposed area = V ÷ SA / cm³ per cm² | centre-to-face = *l* ÷ 2 / cm |
|---|---|---|---|---|---|
| 2.0 | 24 | 8.0 | **3.0** | 8.0 ÷ 24 = 0.33 | 1.0 |
| 1.0 | 6.0 | 1.0 | **6.0** | 1.0 ÷ 6.0 = 0.17 | 0.50 |
| 0.5 | 1.5 | 0.125 | **12.0** | 0.125 ÷ 1.5 = 0.083 | 0.25 |

(0.5 cm edge: SA = 6 × 0.25 = 1.5 cm²; V = 0.125 cm³.) A 5 mm edge read on a mm ruler is uncertain by about ±0.5 mm (±10%), so the 0.5 cm cube's calculated SA:V is the least certain; noted here, not narrated (percentage error is a p.63 skill not needed for this outcome's teaching).

### Dataset 4 — acid in excess (Beat 9)

Alkali in the largest cube: V = 8.0 cm³ = 8.0 × 10⁻³ dm³; × 0.01 mol dm⁻³ = **8.0 × 10⁻⁵ mol OH⁻** (treating the agar's volume as the solution volume). Acid in one bath: 100 cm³ = 0.100 dm³; × 0.1 mol dm⁻³ = **1.0 × 10⁻² mol H⁺**. Ratio 1.0 × 10⁻² ÷ 8.0 × 10⁻⁵ = **125**. After the largest cube is fully neutralised the bath still holds 1.0 × 10⁻² − 8.0 × 10⁻⁵ = 9.92 × 10⁻³ mol H⁺ (99.2% of the original), so the external acid concentration is effectively unchanged, and all three baths are equivalent. The smaller cubes hold 1.0 × 10⁻⁵ and 1.25 × 10⁻⁶ mol OH⁻.

### Dataset 5 — time to complete decolourisation (Beats 10, 11, 12, 13) — *our illustrative data*

Conditions: one batch of agar made up in 0.01 mol dm⁻³ sodium hydroxide with thymolphthalein (blue), set about 2.5 cm deep, prepared on the day, every cube cut from it; cubes cut on a white tile, edges measured (Dataset 3); each cube on an open mesh in its own 250 cm³ beaker holding 100 cm³ of 0.1 mol dm⁻³ hydrochloric acid, all baths from one stock; room temperature, recorded (not narrated); each cube's stopwatch started on the frame the cube first touched the acid; endpoint = last trace of blue gone, viewed from the side against white card; observation period 30 min (1800 s); three runs, each with fresh cubes (one of each size) and fresh acid; times to the nearest second.

| cube side / cm | calculated SA:V / cm⁻¹ | run 1 / s | run 2 / s | run 3 / s | mean / s | reciprocal time to complete decolourisation / s⁻¹ |
|---|---|---|---|---|---|---|
| 2.0 | 3.0 | 1010 | 985 | 1052 | (1010 + 985 + 1052) ÷ 3 = 3047 ÷ 3 = 1015.7 → **1016** | 1 ÷ 1016 = 0.000984 → **0.00098** |
| 1.0 | 6.0 | 262 | 248 | 271 | (262 + 248 + 271) ÷ 3 = 781 ÷ 3 = 260.3 → **260** | 1 ÷ 260 = 0.00385 → **0.0038** |
| 0.5 | 12.0 | 70 | 66 | 75 | (70 + 66 + 75) ÷ 3 = 211 ÷ 3 = 70.3 → **70** | 1 ÷ 70 = 0.0143 → **0.014** |

All nine times are below 1800 s, so no limit entry is needed; the `limit-rule` card shows what would be recorded otherwise. Narrated run-1 times: 70 s ("about seventy seconds"), 262 s = 4 min 22 s ("about four and a half minutes"), 1010 s = 16 min 50 s ("about seventeen"). Narrated means: 1016 s ≈ 16.9 min ("about seventeen minutes"), 70 s. The means are recorded to the nearest second, matching the readings. The reciprocal column is the optional quantity, headed exactly as the plan check requires, and is not plotted. These times are invented to be in a plausible order and size for this preparation; they are **not** fitted to a diffusion law, and the lesson draws no quantitative conclusion from their ratios.

### Dataset 6 — S21/22 Q4(b–c), the paper's values (Beat 13)

Q4(b), 2 marks, QP p.9 / MS p.14: cube C, surface area 54 cm², volume 27 cm³, correct volume unit plus calculation (plan-check description). 54 = 6 × 3² and 27 = 3³, so cube C has side 3 cm. Q4(c), 1 mark: order of complete indicator change A → B → C; universal indicator, initially blue, red in acid (plan-check description). The sizes of cubes A and B and the question's wording are not in the verified sources and are not shown (UNVERIFIED 1).

---

## Real-world samples

| Material | What the method responds to | Fit (range, clarity) | Interferences and how the method handles them | Beats |
|---|---|---|---|---|
| Agar made up with 0.01 mol dm⁻³ sodium hydroxide and thymolphthalein indicator (technical agar, sodium hydroxide, dilute hydrochloric acid and thymolphthalein are on the syllabus p.58 materials list) | **pH**: thymolphthalein is blue while the agar is alkaline and colourless once enough acid has diffused in to neutralise the alkali there. The colour boundary marks the indicator's pH transition as alkali is neutralised; it is not the position of the first acid molecules, and no fixed separation between two fronts is measured (plan check). | The alkali gives a clear starting blue; blue → colourless is a high-contrast change against white card; the acid is in 125-fold excess for the largest cube (Dataset 4), so every cube can be fully neutralised. Limit: the change is a paler blue band, not a sharp line, so the endpoint is judged by eye with one stated criterion. | Uneven cubes (trimmed until square, edges measured, SA:V calculated from measured edges); cubes resting flat on a face (open mesh: all faces exposed); unequal or exhausted acid (separate equal-volume baths from one stock, in excess); a large cube not finishing (record the limit, or a declared fixed-time penetration cut); endpoint judgement (same viewing criterion for every cube, from the side against white card); agar preparation stated before results. | 7 (spoken and on-screen note), 8, 9, 10, 11 |
| Potato cylinder (dimensions only) | Nothing: no potato is handled here; the cylinder's dimensions are used for a calculation and reused by 4.2.5, which owns the potato's real-world statement. | — | — | 5 |

**Explain-beat real-world examples:** a single-celled organism exchanging oxygen by diffusion across its surface, and an animal cell exchanging oxygen, glucose and waste across its surface (Beats 1, 6, 13, framing); larger organisms' specialised exchange surfaces and transport systems named only (Beat 6). No real-world extra is spoken in the exam beat as if it were a marking point; the Beat 13 callback is a callback to the hook, not a credited point, and carries no tick or MS tab.

---

## Scope ledger

### Syllabus requirement → beats

| Requirement | Beat(s) | How |
|---|---|---|
| 4.2.3 illustrate the principle that SA:V decreases with increasing size | 4, 6, 12 | worked series 6, 3, 2 cm⁻¹; bars; the creditworthy sentence bounded to the same shape |
| by calculating surface areas and volumes of simple 3-D shapes (p.63: cuboids and cylinders) | 3, 4, 5 | cube nets and unit cubes; cuboid formula with the 3 cm check; potato cylinder net, 11.0 cm², 2.36 cm³, 4.67 cm⁻¹ |
| p.63 recognise and use ratios | 4, 5, 8 | *x* : 1 and cm⁻¹ forms; 6 ÷ *l* |
| p.63 significant figures | 5 | 3 s.f. for the cylinder; divide before rounding |
| 4.2.4 investigate the effect of changing SA:V on diffusion | 7–11 | one complete design: material and indicator, cutting and measuring, separate baths, first-contact timing, endpoint, repeats and means, calculated SA:V plotted as the independent variable, interpretation |
| using agar blocks of different sizes | 8–11 | cubes 2.0, 1.0, 0.5 cm, three of each |
| p.63 calculate the mean; reciprocals (1/x) | 11 | means of three; optional reciprocal time with the exact label |
| Materials p.58 (technical agar, sodium hydroxide, dilute hydrochloric acid, thymolphthalein); apparatus p.57 (white tiles, scalpel, rulers in mm, blunt forceps, beakers, eye protection, timer showing seconds) | 7–10 | all named where they sit |
| Plan scope ceiling: cuboids and cylinders only; no spheres; no allometry; no heat-loss physiology; one design; no diffusion equation; no time ∝ distance² law | all | none of these appears; the trend line is labelled *not a fitted law* |

**Handed off:** agar diffusion from a well (methylene blue) → 4.2.2a; the potato tissue itself and its water potential → 4.2.5; exchange surfaces and transport systems → later topics (named only).

### Mark-scheme and examiner points → beats

| Source | Point (plan-check description; not quoted) | Beat |
|---|---|---|
| S21/22 Q4(b), 2 marks, QP p.9 / MS p.14 | cube C: surface area 54 cm², volume 27 cm³; correct volume unit plus calculation | 4 (the same values taught), 13 |
| S21/22 Q4(c), 1 mark, QP p.9 / MS p.14 | order of complete indicator change A → B → C; universal indicator, initially blue, red in acid | 10–11 (smaller cubes finish first), 13 (paper's indicator kept distinct) |
| Plan MF5 (agar cubes) | separate equal-volume baths, one stock, excess; open mesh; limit or fixed-time cut; compressed time captioned, real clock; boundary sentence; 1/t label; SA:V calculated from measured edges as the independent variable | 8–12 |
| Plan should-fix 7 (safety) | working concentrations and their hazards; eye protection; handling precaution | 7, 8, 9 |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, never, only, no, nothing, cannot, because, must, needs* (and causal *so*/*since*) was reread: true of all cases, or of the case on screen?
- "many single-celled organisms can get the oxygen they need by diffusion across their surface" (Beat 1): "many", not all. "you need lungs, a heart and blood vessels": true of a human.
- "What a cell uses comes in across its surface … its waste leaves across that same surface" (Beat 1): every exchange of a cell with its surroundings crosses its cell surface membrane (including vesicle routes); no claim about mechanism. "do not grow at the same pace": true of any change of size at constant shape.
- "Each face is one centimetre by one centimetre, one square centimetre, so six faces make six square centimetres" (Beat 3): arithmetic.
- "for the same shape, as size increases, volume increases faster than surface area, so the surface area to volume ratio decreases" (Beat 4): bounded by "for the same shape"; true for geometric scaling. "The cubes got bigger and the ratio got smaller": these cubes.
- "The same method works for any cuboid" (Beat 5): true (six rectangular faces in three pairs). "so the ratio is four point six seven": arithmetic.
- "An animal cell like yours takes in oxygen and glucose and gets rid of waste across its surface, yet the whole of its volume uses supplies" (Beat 6): typical respiring animal cell; "like yours". "That is one reason many larger organisms have specialised exchange surfaces and transport systems": "one reason", "many". "so now test it": transition, not a causal claim.
- "Agar is a jelly that is mostly water, so dissolved particles can diffuse through it" (Beat 7): "can"; agar gels are largely water. "That suits the method, because the alkali gives a clear starting blue": the fit claim, for this preparation. "blue to colourless is easy to see against a white background": contrast of these two real states. "so you judge the endpoint by eye, the same way every time": an instruction for this method.
- "because an uneven cube has a different surface area and a different path to its centre" (Beat 8): true of a cube cut unevenly (relative to the intended cube).
- "far more than it takes to neutralise even the largest cube's alkali" (Beat 9): Dataset 4 (125-fold). "so acid reaches all six faces": the mesh's purpose; no claim of identical access at every point. "Even at these dilute concentrations, the acid and the alkali can irritate eyes and skin, so wear eye protection": "can"; no classification asserted (UNVERIFIED 4).
- "A colourless layer appears on every face at once" (Beat 10): for cubes on an open mesh in excess acid; this demonstration. "It is not the position of the first acid molecules": the plan check's exact wording. "each stopwatch keeps the real elapsed time": the production rule. "The smallest cube loses its last blue first …": this run (Dataset 5). "record that limit rather than inventing an endpoint": MF5 instruction.
- "As the ratio goes up, the time falls steeply" (Beat 11): these data. "Smaller cubes have shorter paths to their centres and less volume per unit exposed area. Their earlier endpoint does not establish that acid diffuses faster through their agar": the plan check's wording, lightly shortened ("acid molecules diffuse intrinsically faster" → "acid diffuses faster"; see *Plan interpretations* 4). "not a flux or a diffusion speed": the plan's label rule.
- "the higher the ratio, the shorter the time to decolourise completely" (Beat 12): the trend in these data across 3.0–12.0 cm⁻¹; the recap says "Against the calculated ratio", tying it to this graph.
- Beat 13: "was credited for", "A further mark was for": past tense, one named paper; no "always". "a bigger cube has more surface area, but less surface for each unit of volume": true for cubes (same shape). "can let diffusion across its surface meet its needs": "can"; no claim that every small organism relies on diffusion alone.
- No sentence says acid diffuses faster in small cubes, that the colour boundary is the acid front, that 1/t is a rate of diffusion, that time is proportional to distance squared, that bigger organisms have less surface area, or that the paper used thymolphthalein.

---

## Citations

Every quotation in this storyboard, where it appears, and the file it was copied from. No exam PDF was opened. No S21/22 Q4 wording is quoted anywhere; those rows are descriptions.

| # | Quotation (verbatim) or description | Paper / session / question / page | Beat(s) | Copied from | Status |
|---|---|---|---|---|---|
| 1 | "illustrate the principle that surface area to volume ratios decrease with increasing size by calculating surface areas and volumes of simple 3-D shapes (as shown in the Mathematical requirements)" | Syllabus 2025–2027, 4.2.3, p.21 | header | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 2 | "investigate the effect of changing surface area to volume ratio on diffusion using agar blocks of different sizes" | Syllabus 4.2.4, p.21 | header | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 3 | "calculate surface areas and volumes of cuboids and cylinders"; "recognise and use ratios" | Syllabus p.63 | header; spine; ledger | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 4 | Hazard codes "[F] [MH] [HH]" for thymolphthalein indicator; "technical agar" (shown as small type) | Syllabus p.58 | 7 | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 5 | Description (not a quotation): cube C, surface area 54 cm², volume 27 cm³; correct volume unit plus calculation, 2 marks | S21/22 Q4(b), QP p.9 / MS p.14 | spine; 13; Dataset 6 | plan-check MF1 ledger row, via `TOPIC-04-WEIGHTS.md` ledger and plan §4.2.3 | description only (no quotation marks anywhere); PDF-CHECKED (plan check) |
| 6 | Description (not a quotation): order of complete indicator change A → B → C, 1 mark; universal indicator, initially blue, red in acid | S21/22 Q4(c), QP p.9 / MS p.14 | spine; 13; Dataset 6 | plan-check MF1 ledger row, via `TOPIC-04-WEIGHTS.md` ledger and plan §4.2.4 | description only (no quotation marks anywhere); PDF-CHECKED (plan check) |
| 7 | Our plan's wording, shown as our caption (not exam evidence): "The colour boundary marks the indicator's pH transition as alkali is neutralised. It is not the position of the first acid molecules, and this demonstration does not measure a fixed separation between two fronts." | Plan check MF5; `TOPIC-PLAN-04-MEMBRANES.md` §4.2.4 | 10 (caption; narration uses the first two sentences) | `TOPIC-PLAN-04-MEMBRANES.md` | plan wording; not exam evidence |
| 8 | Our plan's label, shown as a table heading: "reciprocal time to complete decolourisation / s⁻¹" | Plan check MF5; plan §4.2.4 | 11; Dataset 5 | `TOPIC-PLAN-04-MEMBRANES.md` | plan wording; not exam evidence |

No verbatim string from the SHARED-SPECS §2 list is used: none of them belongs to this lesson's questions (the list's M24/52 Q1(c)(iii) hazard–risk–precaution line is 4.2.5's).

**UNVERIFIED items** (not quoted; shown only as our description or omitted):
1. `UNVERIFIED — the wording, figure and cube sizes (A and B) of S21/22 Q4(b–c), QP p.9.` Beat 13 describes the question as "agar cubes labelled A, B and C" and "a calculation on cube C", in our words; no figure is reproduced; cube C's side (3 cm) follows from 54 = 6 × 3² and 27 = 3³.
2. `UNVERIFIED — exact MS wording of S21/22 Q4(b) and Q4(c), MS p.14, as a verbatim string.` The plan check verified the values, order and marks (now resolved in the plan's register), but no verbatim MS string for these parts is in the SHARED-SPECS list, so only the descriptions are used, labelled *plan-check description, not the scheme's wording*, and no reject card is built.
3. `UNVERIFIED — a bench-tested time set for this exact preparation` (0.01 mol dm⁻³ sodium hydroxide agar with thymolphthalein, 0.1 mol dm⁻³ hydrochloric acid, cubes 0.5–2.0 cm). Dataset 5 is our illustrative data, chosen for a plausible order and size; if the build uses real footage, its own times replace these.
4. `UNVERIFIED — the hazard classification of 0.1 mol dm⁻³ hydrochloric acid and 0.01 mol dm⁻³ sodium hydroxide and the amount of thymolphthalein stock used.` The narration and tags say only that the dilute solutions *can irritate eyes and skin* (eye protection, wash off splashes) and that the indicator stock, usually made up in ethanol, is flammable with the syllabus p.58 codes; the centre's hazard data (e.g. a hazard card) should confirm the wording before build.

---

## Word count and runtime

Counted by the validator over the blockquoted narration; seconds = words ÷ 120 × 60.

| Beat | Title | Words | Seconds |
|---|---|---:|---:|
| 1 | Hook and context | 93 | 46.5 |
| 2 | What you will be able to do | 56 | 28.0 |
| 3 | Surface area and volume of a cube | 101 | 50.5 |
| 4 | The ratio falls as the size rises | 113 | 56.5 |
| 5 | Cuboids, and a potato cylinder | 135 | 67.5 |
| 6 | Why size matters to a living thing | 107 | 53.5 |
| 7 | The agar and what its colour responds to | 114 | 57.0 |
| 8 | Cutting and measuring the cubes | 91 | 45.5 |
| 9 | One bath per cube, and a clock from first contact | 100 | 50.0 |
| 10 | Watching the colour boundary move in | 132 | 66.0 |
| 11 | The results against SA:V, and what they mean | 111 | 55.5 |
| 12 | What I told you, on the shapes, the rig and the graph | 105 | 52.5 |
| 13 | How it is asked, one point to keep, and the single-celled organism | 120 | 60.0 |
| **Total** | 13 beats (13 teaching, 0 error) | **1378** | **689.0** (11:29) |

**Length, honestly:** **1,378 words = 11:29** at 120 words per minute, **1:44 over** the 9:45 (1,170-word) budget. There are no error beats, so the whole overrun is teaching. By outcome: the 4.2.3 half (Beats 1–6) is **605 words = 5:02.5** against 4:15 (**+47.5 s**), and the 4.2.4 half (Beats 7–13, including the joint recap and close) is **773 words = 6:26.5** against 5:30 (**+56.5 s**). Where the time goes: the cylinder working with its net (Beat 5, 67.5 s) and the investigation's required design content (the REAL-WORLD statement for the agar and indicator, the working-concentration safety line, separate baths from one stock in excess, the open mesh, first-contact timing, the plan's boundary sentence, compressed time with the real clock, and the observation-period limit rule with the fixed-time alternative; Beats 7–10), each of which the plan or SHARED-SPECS makes compulsory. Nothing is sped up. **Cut list, in the order I would take it** (no error beat exists to protect; none of these removes a required element, and each keeps its visual on screen):
1. Beat 11: "about seventeen minutes at three per centimetre, about seventy seconds at twelve" plus the joining colon (−12 words, −6 s); the ringed points keep their labels (the values were spoken in Beat 10).
2. Beat 5: "Put in three, three and three, and you get fifty-four and twenty-seven again." (−14 words, −7 s); the `cuboid-check` working still lands on screen at *length, width and height*.
3. Beat 12: "and four point six seven for the potato cylinder" (−9 words, −4.5 s); the cylinder net stays in the recap layout with its value.
4. Beat 1: "Size is part of the answer." (−6 words, −3 s); the size bracket moves to *do not grow at the same pace*.
5. Beat 3: "Keep an eye on the units: area in square centimetres, volume in cubic centimetres." (−15 words, −7.5 s); the unit rings move to *eight cubic centimetres*; Beat 4 and the recap still say the units.
All five: **−56 words = −28 s → 1,322 words = 11:01**, still **1:16 over**. I would not cut further: the remaining words are the calculation working a student must see done (4.2.3), the plan's compulsory practical design and wording (4.2.4), the recap on the same diagrams and the cited close. The Topic 3 precedent (3.1.3 cleared at 1:34 over) suggests the checker rules on the remainder.

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| Agar diffusion from a well with methylene blue; diameter of a colour zone | 4.2.2a |
| Potato tissue, its water potential and its real-world statement (only the cylinder's dimensions are used here) | 4.2.5 |
| Exchange surfaces (lungs, gills, leaves) and transport systems as mechanisms | later topics (named only in Beats 1, 6) |
| Spheres, surface area of irregular shapes, allometry, heat-loss physiology | outside p.63's list and the plan's ceiling |
| Any diffusion equation, Fick's law, time ∝ distance² | calibration §4 DO-NOT-ADD; plan §4.2.4 |
| Percentage error in the measured edges | p.63 skill, noted in Dataset 3 only; not needed for this outcome |
| Standard deviation, error bars, statistical tests | A Level mathematical requirements; not in this outcome |
| The paper's universal-indicator colour sequence | not shown as a sequence; only its start and acid colours as static swatches, labelled as the paper's |

## Reusable models

| Model | Specified | For |
|---|---|---|
| **`SAVShapes`** (cubes 1, 2, 3 cm with `net-unfold`, `fill-volume`, working panel, `ratio-bars`, `centre-distance`, `per-cm3`, `cuboid-check`; `cylinder-net` r = 0.50 cm, h = 3.0 cm → 11.0 cm², 2.36 cm³, 4.67 cm⁻¹) | here | 4.2.5 (cylinder dimensions); any later exchange-surface lesson by reference |
| **`AgarCubeRig`** (`tray`, `cut`, `measure`, `baths`, `first-contact`, `decolourising`, `endpoint`, `limit-rule`, `results-table`; Dataset 5) | here | none downstream in Topic 4 |
| **`endpoint-vs-SAV`** graph configuration | here | none downstream |
| `DiffusionField` open-boundary inset | 4.2.1a (reused) | — |

---

## Assets

| Asset | Status | Source |
|---|---|---|
| `SAVShapes` SVGs (three cubes, nets, unit cubes, cuboid outline, cylinder and net, working panel, bars) | **new build** | authored |
| `AgarCubeRig` SVGs (tray, preparation card, tile, scalpel, mm ruler, blunt forceps, cubes in three sizes with measured-edge tags, acid stock bottle, 100 cm³ measuring cylinder, three 250 cm³ beakers with open mesh platforms, white card, stopwatches, results table, limit-rule card, safety tags, eye-protection pictogram, hands) | **new build** | authored; handling specified; rendered still-frame verification pending (scalpel straight down on the tile, blade away from the body; pours at about 120° with the stream from the computed lip into the receiving mouth; level surfaces; forceps grip; first-contact frame per cube) |
| Decolourising cube states (blue, paler blue band, colourless; three real states, no tween) | **new build** | authored; colour check on rendered frames pending |
| `endpoint-vs-SAV` graph | **new build** on the Topic 3 `RateGraph` conventions | authored |
| `DiffusionField` inset (open boundary) | reuse | 4.2.1a |
| Hook outlines (single-celled organism, human with lungs/heart/vessels, animal cell), wrapped-box outlines | new, schematic vector | authored; no photograph, no generated image |
| Objectives pictograms (cube net, descending bars, agar cube with stopwatch); forms surface; indicator comparison panel; key-point strip (no reject card) | new card content; shared surfaces | authored; surfaces from earlier topics |
| Real agar footage | optional production dependency | if used, sourced footage of this preparation only; never fabricated |

---

## Plan interpretations

1. **Beat split.** The weights give 4.2.3 six beats and 4.2.4 seven. Beats 1–6 carry the calculation (hook, objectives, cube, series and sentence, cuboid and cylinder, framing); Beats 7–13 carry the investigation. The recap (Beat 12) and the exam close (Beat 13) necessarily cover both outcomes; they are counted in 4.2.4's seven because the plan's close (S21/22 Q4(b–c)) is one question block.
2. **Cuboids.** The plan says "cubes (and cuboids)" and p.63 says cuboids. Rather than invent a new cuboid dataset, the general cuboid formula is shown and checked on the 3 cm cube (54 cm², 27 cm³), which keeps the shared numbers intact.
3. **Framing claims.** The plan names consequences for large organisms "as framing only". The narration says "one reason many larger organisms have specialised exchange surfaces and transport systems, which later topics teach", and the hook uses many single-celled organisms relying on diffusion across their surface; no mechanism of any exchange surface is taught.
4. **Plan-check sentence, lightly shortened in narration.** The exact MF5 sentences are "Smaller cubes have shorter paths to their centres and less volume per unit exposed area. Their earlier endpoint does not establish that acid molecules diffuse intrinsically faster through their agar." Beat 11 speaks the first exactly and the second as "Their earlier endpoint does not establish that acid diffuses faster through their agar" (dropping "molecules" and "intrinsically" for the ear); the meaning is unchanged. The boundary sentence is spoken as the plan's first two sentences exactly (with "the alkali" for "alkali"), and the full three-sentence wording is on screen in Beat 10. The 1/t label is spoken as "the reciprocal time to complete decolourisation" and shown exactly with "/ s⁻¹".
5. **Three runs rather than nine simultaneous baths.** SHARED-SPECS asks for a separate equal-volume bath for each cube and a stopwatch per cube. I show three baths and three stopwatches per run (one cube of each size) and three runs with fresh cubes and fresh acid from the same stock, which meets "separate bath per cube" (no cube shares acid) and keeps the frame legible. A builder could equally show nine beakers.
6. **Observation period and the limit rule.** The plan requires recording the limit if the largest cube does not finish. I set a 30-minute observation period, let all nine illustrative cubes finish inside it, and show the rule (and the declared fixed-time penetration alternative) on a card and in narration, so the rule is taught without inventing a failed run.
7. **The DiffusionField inset.** The plan lists `DiffusionField` for "acid entering a cube, inset". I draw particles from the acid moving randomly with net inward movement, but do not draw the neutralisation (no token reacts or vanishes), to keep "no atom-resolved reactions" and to avoid showing the boundary as the acid front.
8. **Safety wording.** Should-fix 7 and the revised plan ask for the working concentrations "with their own hazard classification". No hazard classification for 0.1 mol dm⁻³ hydrochloric acid or 0.01 mol dm⁻³ sodium hydroxide is in the supplied sources, so I state the concentrations, say the dilute solutions "can irritate eyes and skin", require eye protection and forceps, and give the syllabus p.58 codes for the thymolphthalein stock (UNVERIFIED 4). This is the one place the storyboard falls short of the plan's wording; the builder or checker should add the classification from the centre's hazard data rather than have me invent one.
9. **Exam close wording.** The plan's close is S21/22 Q4(b–c) with the paper's indicator kept distinct. Because no QP or MS wording is in the verified list, Beat 13 describes the question in our words ("agar cubes labelled A, B and C"; "a calculation on cube C") and shows the credited values and order as plan-check descriptions. **No reject card:** the revised author brief allows a reject card only where a verified R/I line exists, and there is none for S21/22 Q4; the plan's trap row ("Bigger organisms have less surface area") is kept as a plain, labelled teaching point with no ✗ or MS tab. (The earlier draft of this storyboard had an our-wording reject card here; it was removed when the brief and SHARED-SPECS §2a were revised during drafting.)
10. **Q4(c)'s order and our data.** The narration gives the credited order (A, then B, then C) without claiming the sizes of A and B; on screen our own graph shows smaller cubes finishing first, labelled *our data*, so the paper's cubes are not given our sizes.
11. **Graph and readout wording.** The plan's visual-needs line labels the graph's y-axis *mean time to become colourless / s*, while its investigation table and the plan check say *time to complete decolourisation*. I use the plan check's term throughout (axis, table, narration) so the optional 1/t heading, *reciprocal time to complete decolourisation / s⁻¹*, matches it exactly; the two phrases mean the same endpoint. The plan names two alternative readouts for a cube that does not finish (a fixed-time penetration measurement; the percentage of the cube still coloured after a fixed time); both appear on the limit-rule card, the first also in narration.
12. **Controlled variables.** The revised plan adds temperature (room, recorded) and agar batch; both are in Dataset 5's conditions and on the tray label (*one batch … every cube cut from this tray*), not narrated, to keep Beat 8 within length.

---

## Validator run

`python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.3-4/STORYBOARD.md`

```
== storyboards/topic-04/4.2.3-4/STORYBOARD.md
beat  words  cues maxgap  status
   1     93    10     17  ok
   2     56     5     12  ok
   3    101    12     14  ok
   4    113    17     14  ok
   5    135    17     13  ok
   6    107     9     19  ok
   7    114    13     15  ok
   8     91    11     16  ok
   9    100    10     15  ok
  10    132    16     16  ok
  11    111    13     15  ok
  12    105    13     12  ok
  13    120    14     23  ok
TOTAL words 1378  cues 160  runtime at 120 wpm 11:29.0  beats 13  failing beats 0
```

No MISSING SECTION or CITATION lines; failing beats 0.
