# 4.2.2b — Investigating diffusion and osmosis: plant tissue

**STATUS: CLEARED (re-checked 27 Sep)** — independent checks, cloud run 006 (cleared in round 2 and round 3; `cloud-checks/006/round-3/README.md`: FINAL), 27 September 2026. Narration frozen for build.
**Reworded 27 Sep 2026 under EXAM QUESTIONS IN OUR OWN WORDS** (VIDEO-STRUCTURE.md). internal: paper, session and question references outside "Beat by beat", and any text after an internal: marker, are traceability for checkers only and never reach the screen or narration. Exam-style stems in the beats are our own.

**Storyboard, first draft. Cloud run 006, 27 September 2026.** No audio, no code, no render. Folder `storyboards/topic-04/4.2.2b/`. The second of two linked lessons on outcome 4.2.2, split by material; it stands alone (own hook, context, objectives, explanation, recap on its own rigs and exam close). This lesson owns **plant tissue** (beetroot for diffusion of pigment through membranes; red onion epidermis for osmosis). Visking tubing and agar are 4.2.2a's; the quantitative plant-tissue osmosis investigation (estimating a tissue's water potential) is 4.2.5's.
Cambridge 9700 syllabus 2025–2027, p.21. Command word **INVESTIGATE**. Budget from `TOPIC-PLAN-04-MEMBRANES.md` (4.2.2 entry and lesson list) and `TOPIC-04-WEIGHTS.md` (4.2.2 row, 17:00 combined, 23 teaching beats, 0 errors): **4.2.2b 7:30 = teaching base 7:30 (about 900 words-equivalent) + 0 error allowance; 10 teaching beats, no error beats**; delivered here as **10 beats (10 teaching + 0 error)**. 4.2.2 as a whole: 1 of 5 cited Paper 2 blocks (S21/22 Q4(c), 1 overlapping agar-diffusion mark, owned by 4.2.2a's close), with M24/52 as supplementary Paper 5 planning evidence. Runtime estimated at **120 words per minute of final video** (runtime = words ÷ 120).

> **4.2.2** investigate simple diffusion and osmosis using plant tissue and non-living materials, including dialysis (Visking) tubing and agar

(syllabus p.21; this lesson owns "plant tissue" for both simple diffusion and osmosis; "non-living materials, including dialysis (Visking) tubing and agar" is 4.2.2a's and is handed off by label.)

**Authorities read:** `work/006/AGENT-BRIEF.md`; `work/006/SHARED-SPECS.md` (in full: hard rules, layout, shared models, shared numbers, verbatim list); `plan/topic-04/TOPIC-PLAN-04-MEMBRANES.md` (in full: scope and authoring rules, visual integrity, REAL-WORLD rule, 4.2.2 entry with the investigation map rows 4.2.2b-1 and 4.2.2b-2 and the MF6 beetroot and red onion texts, 4.2.6 entry, lesson list, build order, shared-model table, traps table, UNVERIFIED register, PLAN-CHECK RESPONSE); `plan/topic-04/TOPIC-04-WEIGHTS.md` (4.2.2 row and paragraph, supplementary rows S-C and S-D, error register and evidence gaps); `cloud-inputs/003/standards/VIDEO-STRUCTURE.md` (all); `CONTENT-ARCHITECTURE.md`; `SYLLABUS-9700-DETAIL.md` (Topic 4 outcomes pp.21–22; apparatus p.57; materials p.58; Paper 5 p.59; mathematical requirements p.63); the cleared examples `cloud-inputs/006/examples/3.1.3/STORYBOARD.md` and `3.2.1b/STORYBOARD.md`; `cloud-inputs/003/topic-03/3.1.1-2/CHECK.md` and `3.2.2-3/CHECK.md`; the plan check `cloud-checks/006/plan/CHECK.md` on `origin/cloud/006-checks` (MF6 and its content sources; the M24/52 rows; the "any 6" typography note); `cloud-inputs/006/evidence/GATE-CRITERIA-9700-04-CELL-MEMBRANES-AND-TRANSPORT.md` and `COMPLEXITY-CALIBRATION-9700-BIOLOGY.md` (for the M24/52 context only); the committed `storyboards/topic-04/4.2.6/STORYBOARD.md` (for the `CellOsmosisSet` state ids, the tonoplast label and the `cell-vs-solution` comparison wording recalled here). No question paper, mark scheme or examiner report PDF was opened for this draft. No verbatim M24/52 Q1(c)(i) or Q1(b)(ii) scheme wording is available; both are used only as the plan check's descriptions, as our paraphrase, with citations. **Round-1 revision (27 Sep 2026):** the independent round-1 check extracted the M24/52 QP and MS PDFs; its audit (QP pp.2–7, MS pp.5–7) now supplies the Beat 10 descriptions, still shown as our paraphrase.

**Build position:** eighth of the ten Topic 4 lessons: 4.1.1-2 → 4.1.3 → 4.1.4 → 4.2.1a → 4.2.1b → 4.2.6 → 4.2.2a → **4.2.2b** → 4.2.3-4 → 4.2.5. 4.2.6 (built before this lesson) supplies the `CellOsmosisSet` plant states recalled by label for the red onion explanation.

**Models used (by name and state id):** `CellOsmosisSet` (4.2.6; `plant-turgid-equilibrium`, `plant-flaccid`, `plant-plasmolysed`); `WaterPotentialModel` (4.2.1a, state `cell-vs-solution` added by 4.2.6; comparison label only); `FluidMosaicMembrane` (4.1.1-2; `full`, plus the lesson-local inset state `heat-damaged` specified below); `WaterBathRig` (Topic 3, `maintained`, by reference); `ColorimeterModel` (Topic 3, 3.1.4, optional-readout recall only); `MicroscopeModel` (Topic 1, labelled recall, with field-of-view inset). **Models published here:** `BeetrootRig`, `OnionMount`, the `PigmentToken` (betalain, red-violet) and the `ColourStandardStrip` (five depths) that belong to `BeetrootRig`. Everything drawn is a MODEL or labelled apparatus; molecular insets carry *schematic; not to scale*; particle insets carry *particles drawn schematically; not to scale; far fewer than real*; invented numbers carry *our illustrative data*.

---

## The causal spine

One idea carries the lesson: **you cannot see a membrane with a light microscope, but plant tissue lets you see what membranes do.** A living cell's membranes keep its pigment in; damage them and the pigment diffuses out. The same membranes are partially permeable to water, so when the solution outside has a lower water potential, water leaves by osmosis and the living contents shrink away from the cell wall.

> **Plant tissue shows membranes at work. In beetroot, betalain pigment in the vacuolar sap can reach the water outside only by crossing the tonoplast and the cell surface membrane; the depth of red-violet in the liquid after a specified time is a proxy for that leakage, not a measure of water movement. At 70 °C membrane proteins denature and the bilayer is disrupted, so more pigment diffuses out down its concentration gradient than at 30 °C; temperature also speeds diffusion itself, so the whole difference is not attributed to permeability. In red onion epidermis, a sucrose solution whose water potential is initially lower than the cells' causes net movement of water out of the cells by osmosis; the protoplast withdraws from the fixed cell wall (plasmolysis), and the gap fills with the external solution through the freely permeable wall.**

**What the mark schemes credit, quoted:** no mark-scheme line in the cited blocks addresses beetroot or red onion (weights: evidence gaps). The close uses **M24/52 Q1(c)(i)** (QP pp.6–7 / MS p.6) as related planning evidence, described, not quoted: temperature and rate of osmosis in turnip blocks in distilled water, 10–50 °C; maximum 6 marks from nine alternatives; selected creditable points: at least five stated temperatures; at least three different blocks at each temperature and a mean (our paraphrase; optional points, not a compulsory checklist; **not this beetroot protocol**). It also uses **M24/52 Q1(b)(ii)** (QP pp.4–5 / MS p.5), described: assess the conclusion that onion-cell water potential equals that of 4.2% sodium chloride; four marks from eight alternatives; examples: intermediate concentrations between 1% and 5% untested; no statistical analysis/standard error/95% confidence interval; onion cells need not all have the same water potential (our paraphrase). Both PDF-CHECKED (independent round 1). The only verbatim scheme line shown is small type in Beat 4: [M24/52 Q1(c)(iii), MS p.7] `ref. to hazard and risk and precaution ;` (PDF-CHECKED (plan check); exact match confirmed by the independent round-1 check), which supports pairing each hazard with its risk and precaution on screen.

**The handle:** *a built-in leak detector* (the beetroot's own pigment). Converted at once, in the same breath (Beat 3): *the depth of red-violet in the liquid is a proxy for pigment that has leaked across the tonoplast and the cell surface membrane.* The handle is never the exam answer and is not an analogy for the mechanism; it names what the readout is for.

**Typicality rules applied.** "Pigments called betalains, dissolved in the sap inside each cell's vacuole" is said of raw beetroot (MF6), not of every red plant tissue. "Not every peel is red" is spoken (MF6). The colour is "a proxy" and "does not measure water movement"; the result is stated for **these** tubes ("all three tubes"), not as a general law. The temperature caveat is spoken ("temperature also speeds diffusion itself, so not all the difference is permeability"), and pigment stability is spoken as a condition for a fair comparison. "That is the stock concentration you applied, not a measured concentration at every cell" (MF6; round-1 should-fix 1: a concentration, not an amount). The count is "twenty-seven of twenty-eight whole cells at ten minutes" and "describes this field on this strip". The coloured edge is named as the tonoplast and plasmolysis is diagnosed by the protoplast leaving the wall (MF6). "Membranes are far too thin to resolve with a light microscope" is a true statement of resolution (Topic 1). The hook's cold-water beetroot "barely tints" the water (not "does not"). Round-1 sentences re-swept: Beat 10's planning points are "creditable choices" in one named question, "that question needs a temperature range" is bounded to that question, and "onion cells need not all have the same water potential" is the scheme's point for that onion question (need not, not do not); Beat 7's "stock concentration you applied" is bounded to this applied stock.

**Error beats:** none. The weights allocate no error beat to 4.2.2 (no verified examiner diagnosis for Visking tubing, agar, beetroot or onion). The traps "heat forces the pigment out" and "the coloured vacuole's edge is the cell surface membrane" (plan traps table) are handled as correct teaching in Beats 5 and 8 and as one reject card in Beat 10 captioned as **our wording contrast**; no COMMON MISTAKE or EXAM CONTRAST badge appears anywhere in this lesson.

---

## The models, specified once

### `BeetrootRig` (published here)

Identical to SHARED-SPECS §4, with this lesson's detail. All parts are labelled SVG text nodes as they first appear; eye protection is worn (pictogram at frame corner) in every frame with hot water or a blade.

- **Beetroot:** one raw beetroot, skin on, on a **white tile** (label). Cut face drawn uniformly red-violet (the pigment's real colour).
- **Cork borer:** 8 mm internal diameter (label *cork borer, 8 mm*), with its push-rod. **Handling:** held vertically by its handle, pushed **down** through the beetroot **onto the tile**; the free hand steadies the beetroot from the side, clear of the borer's path; the borer is withdrawn and the cylinder pushed out onto the tile with the rod.
- **Scalpel and ruler:** the cylinder lies on the tile against a **mm ruler**; the scalpel cuts straight down through it every 2 mm, blade drawn **away from the body**; discs **8 mm × 2 mm** (label). Discs are counted into batches of **10** with **forceps**.
- **Rinse:** each batch in a small **rinse beaker** under a running tap; the rinse water is first tinted pale red-violet (cut-surface leakage), then runs clear (the same hue only fades; no other colour). Tag *rinse until the rinse runs clear: removes pigment from cells cut open by the blade*.
- **Water baths:** two thermostatically controlled baths (`WaterBathRig` `maintained`, by reference), each with a **thermometer standing in the water**: **30 °C** and **70 °C**. Each bath holds three **boiling tubes** in a rack, labelled **30-A, 30-B, 30-C** and **70-A, 70-B, 70-C**, each holding **10.0 cm³ distilled water** (measured beforehand with a 10 cm³ measuring cylinder), pre-heated to the bath temperature (tag *pre-heated: water at bath temperature before the discs go in*). **Three independent tissue preparations per condition:** each tube receives its own separately cut and rinsed batch of 10 discs, batches allocated to tubes at random (tag *three independent preparations per temperature*).
- **First contact and timing:** discs lowered into the water with forceps, never dropped from height; **one stopwatch starts on the frame the first disc of batch 30-A first touches its water** and is never reset; each later tube's first-contact time is logged against the same running clock (staggered by 1 min: 30-A 0:00, 30-B 1:00, 30-C 2:00, 70-A 3:00, 70-B 4:00, 70-C 5:00), and each tube is ended exactly **30 min** after its own first contact (tag *exposure time: 30 min per tube, measured from its own first contact*). Compressed waiting is captioned *time compressed; real elapsed time on the clock*. Add each ten-disc batch promptly, using the same loading procedure and approximately the same loading duration in every tube. First-disc contact defines that tube's nominal exposure start; remove each batch promptly at its scheduled endpoint. The individual discs do not all make contact simultaneously.
- **Hot-tube handling:** 70 °C tubes are lifted only in a **test-tube holder** (label); hazard tag *hazard: water at 70 °C · risk: scalding the hand · precaution: lift tubes with a test-tube holder*; blade tag *hazard: scalpel and cork borer · risk: cutting the hand · precaution: cut on the tile, borer pushed down onto the tile, blade away from the body*.
- **Readout preparation:** at 30 min each tube is lifted (holder), the discs are removed with forceps into a waste beaker, the liquid stands in a rack at room temperature until cooled (tag *cooled to room temperature before comparing: readout conditions comparable*), is **swirled** to mix, and is poured into a matched flat-bottomed tube to a marked **equal depth** (5.0 cm³ each; pour ~120° from upright, mouth below base, stream from the computed lip into the receiving mouth; surfaces level).
- **`ColourStandardStrip`:** five matched flat-bottomed tubes of the same depth in a rack in front of **white card**, labelled **1 · 2 · 3 · 4 · 5**, red-violet at increasing depth (one hue; opacity only), caption *standards: dilutions of one beetroot extract, made the same session; relative depth, ordinal, not a concentration* (Dataset A gives the dilutions). Each sample tube is held beside the strip against the white card and matched to the nearest standard by eye.
- **Optional colorimeter** (`ColorimeterModel`, 3.1.4, recalled by label): **light source → green filter → cuvette (in holder) → detector → absorbance read-out**; tags *fixed filter for every tube: green, the colour the red-violet pigment absorbs most (our choice)*, *zeroed on a distilled-water blank*, *readings kept within the instrument's useful range (dilute every sample by the same factor if one reads off-scale)*. No absorbance values are shown in this lesson.
- **`PigmentToken`:** a small **red-violet rounded square**, labelled on first use *betalain pigment (token)*; caption *particles drawn schematically; not to scale; far fewer than real*. Distinct from the violet ion circles of the shared palette (shape and hue).
- **States:** `cut`, `rinse`, `in-baths` (six tubes, clock running), `readout` (cooled, swirled, equal depth, beside standards), `colorimeter` (optional inset).

### `FluidMosaicMembrane` inset state `heat-damaged` (lesson-local; built from 4.1.1-2's model)

Two small membrane insets side by side, orientation fixed (**outside the cell at the top, cytoplasm at the bottom**), each captioned *schematic; not to scale*: **30 °C** in `full` (phospholipids drifting laterally, proteins intact; pigment tokens below the membrane, almost none crossing), and **70 °C** `heat-damaged`: the `intrinsic-channel` and `intrinsic-carrier` proteins **unfold as motion** over ~1 s (a non-covalent change of shape: their outlines loosen into irregular chains; tag *membrane proteins denatured*), and the phospholipids jitter faster with gaps opening between them (tag *bilayer disrupted*); no phospholipid crosses between leaflets; carbohydrate chains stay on the external face. Pigment tokens then pass up through the gaps and the disrupted proteins and drift away above (motion), with a net-movement arrow *pigment: net movement down its concentration gradient*. The enlarged bilayer inset represents the cell surface membrane only: outside the cell above, cytoplasm below. Caption: “cell surface membrane enlarged; pigment has already crossed the tonoplast”. Keep the whole-cell thumbnail from Beat 3 beside it, with a vacuole bounded by the tonoplast inside the cytoplasm and a separate cell surface membrane. At the pigment-diffusion cue, animate pigment from vacuolar sap across the tonoplast into cytoplasm, then across the cell surface membrane into external water. Label the two crossings “tonoplast” and “cell surface membrane”. Both membranes can be damaged; the enlarged inset illustrates membrane disruption, not identical composition of the two membranes. No covalent bond changes are drawn.

### `OnionMount` (published here)

Identical to SHARED-SPECS §4, with this lesson's detail.

- **Red onion scale leaf:** a red onion cut in half on a white tile; one fleshy scale leaf lifted out; its outer epidermis visibly **pink-red** (a visibly pigmented, living peel; tag *not every peel is red: choose a visibly pigmented one*).
- **Peel:** a thin strip of epidermis lifted with **blunt forceps** from a nick made with the scalpel on the tile (blade away from the body); laid **flat** in **one drop of distilled water** on a **microscope slide** (labels).
- **Coverslip:** one edge placed on the slide at the drop's edge, supported by a **mounted needle** (label) and lowered at an angle so the liquid front pushes air out ahead of it; no bubbles over the strip.
- **Microscope:** `MicroscopeModel` (tag *recall: Topic 1*), slide on the stage, ×10 objective in place (small type *×10 eyepiece, ×10 objective*); field-of-view inset beside it.
- **Field-of-view inset (in water):** a single layer of elongated epidermal cells; each has a **cell wall** (thick outline), a thin **cytoplasm** layer, a large **vacuole** of **pink-red** sap filling most of the cell (anthocyanin; tag *anthocyanin in the vacuolar sap*), the protoplast pressed against the wall. The torn edge of the strip (broken cells), one fold (a doubled wall line) and one air bubble (a dark-rimmed circle) are drawn and tagged ✗ *do not count*. Caption *drawn model of the field; a real micrograph is sourced, never generated*.
- **Irrigation:** a **dropper** of **sucrose solution, 1.0 mol dm⁻³** (label; small type *sucrose: no hazard code on the syllabus materials list; eye protection worn*) squeezed **above** the slide so drops fall onto the slide at one edge of the coverslip, the dropper never touching slide or coverslip; a folded **paper towel** (label) touched to the **opposite** edge; the liquid is drawn under the coverslip (motion of the front across the field); four drops in all, one at a time, so the water mount is replaced (tag *irrigate enough to replace the water*). **The stopwatch starts on the frame the sucrose front first reaches the edge of the tissue**, never reset; tag *1.0 mol dm⁻³: the applied stock, not a measured concentration at every cell*.
- **Plasmolysis in the inset (motion):** cells nearest the entry edge change first (tag *cells meet the solution at different times*). The pink-red vacuole shrinks (the **same pink-red hue throughout**; no hue change), the protoplast (cell surface membrane with its thin cytoplasm, outline drawn slightly outside the coloured vacuole) pulls away from the wall at the **corners first**, then along the sides; the **cell wall does not move** (tag *wall fixed*); the gap between wall and protoplast fills with colourless external solution (tag *gap: external solution*). Labels on one enlarged cell: **tonoplast (edge of the colour)** and **cell surface membrane (edge of the protoplast)**, with small type *the edge of the colour is the tonoplast, not the cell surface membrane*.
- **Counting:** a tally beside the inset counts **whole, undamaged cells** in the field and how many show the protoplast withdrawn from the wall, each count stamped with its **observation time** on the running clock (Dataset B).
- **States:** `peel`, `mount-water`, `irrigate`, `plasmolysing`, `count`.

### Models used by state id (not re-specified)

`CellOsmosisSet` (4.2.6) plant cell: `plant-turgid-equilibrium` (the cell in the water mount: turgid, net arrow faded, water crossing both ways), `plant-flaccid`, `plant-plasmolysed` (gap filled with external solution tokens entering through the wall), each labelled with the **initial** comparison of water potentials. `WaterPotentialModel` `cell-vs-solution` (4.2.6) supplies only its comparison label: *initially: solution's water potential lower than the cell's*. `WaterBathRig` `maintained` and `ColorimeterModel` (Topic 3) and `MicroscopeModel` (Topic 1) are recalled by label.

---

## Beat by beat

Beat windows in the headings are provisional (words ÷ 120 per beat); the runtime table below is authoritative, and final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch beyond 30 words without a stated visual change.

### BEAT 1 · Hook and context · 0:00–0:44
**Narration:**
> Ever wondered why beetroot turns its cooking water deep red, when a washed raw beetroot sitting in cold water barely tints it? The colour was inside the cells all along; what changed is whatever holds it in. That is a membrane, and membranes are far too thin to resolve with a light microscope. But plant tissue lets you see what membranes do. A beetroot cell keeps its red-violet pigment inside. A red onion cell holds coloured sap, and water crosses its membranes. In this lesson you investigate both.

**Visual action:**
1. From the first frame, two beakers stand side by side (schematic, not photographs): left, a beaker of simmering water on a hot plate with a cooked beetroot, the water deep red-violet; right, a beaker of cold water with a whole washed raw beetroot, the water only faintly tinted in the same hue. At *Ever wondered why beetroot turns*, the hook question appears as a compact caption above the beakers, never alone on the frame.
2. At *barely tints it*, the right beaker's faint tint is ringed, tag *same pigment, far less of it outside*.
3. At *inside the cells all along*, a magnifier circle opens on the raw beetroot: a few plant cells (cell wall, thin cytoplasm, large vacuole of red-violet sap), caption *schematic; not to scale*; `PigmentToken`s jiggle inside the vacuoles.
4. At *whatever holds it in*, the tonoplast and cell surface membrane of one cell are traced once and labelled **membranes**.
5. At *far too thin to resolve*, a small light-microscope icon appears beside the cell with the tag *membrane: too thin to resolve with a light microscope (recall: Topic 1)*.
6. At *what membranes do*, the magnifier shrinks to a thumbnail at the left edge.
7. At *A beetroot cell keeps its red-violet pigment inside*, the beetroot thumbnail brightens, its tokens held inside the vacuole.
8. At *A red onion cell holds coloured sap*, a red onion half appears at right with a pink-red epidermal cell thumbnail; at *water crosses its membranes*, small pale-blue water tokens cross its membrane both ways.
9. At *you investigate both*, the two thumbnails become two tabs, **beetroot: diffusion of pigment through membranes** · **red onion: osmosis**, and dissolve to the objectives surface.

**On-screen text:** the hook question; *same pigment, far less of it outside*; *membranes*; *too thin to resolve with a light microscope*; the two tabs.

---

### BEAT 2 · What you will be able to do · 0:44–1:11
**Narration:**
> By the end you will be able to investigate how temperature affects pigment leakage from beetroot, and say what that colour does and does not measure; to watch red onion cells lose water by osmosis under the microscope and record what you see honestly; and to explain both results in terms of membranes.

**Visual action:**
1. From the first frame, the objectives' own styled surface is on screen (distinct background colour, not the lesson diagram): three empty line slots, each with a flat authored pictogram already in place at its left (a boiling tube of red-violet liquid beside a small thermometer; a microscope outline; a short double-line membrane with an arrow through it), so no frame is text alone. At *investigate how temperature affects pigment leakage*, line 1 enters with motion beside its pictogram.
2. At *what that colour does and does not measure*, line 1's second half lands with a small tick-and-cross icon.
3. At *watch red onion cells lose water by osmosis*, line 2 enters beside the microscope pictogram; at *record what you see honestly*, its second half lands.
4. At *explain both results in terms of membranes*, line 3 enters beside the membrane pictogram.
   1. **INVESTIGATE** temperature and pigment leakage in beetroot, and say what the colour measures
   2. **OBSERVE AND RECORD** osmosis in red onion cells under the microscope
   3. **EXPLAIN** both results in terms of membranes

**On-screen text:** the three objectives. Small type: *syllabus 4.2.2, p.21: "investigate"; plant tissue here; Visking tubing and agar: 4.2.2a*.

---

### BEAT 3 · Beetroot: what the colour responds to · 1:11–1:57
**Narration:**
> Start with the beetroot. Its red-violet colour comes from pigments called betalains, dissolved in the sap inside each cell's vacuole. To reach the water outside, a pigment molecule has to cross two membranes: the tonoplast around the vacuole, then the cell surface membrane. So think of the pigment as a built-in leak detector. Written properly: the depth of red-violet in the liquid is a proxy for pigment that has leaked across the tonoplast and the cell surface membrane. It fits because you can judge it by eye. It does not measure water movement.

**Visual action:**
1. From the first frame, `BeetrootRig` in state `cut` is on screen: one raw beetroot on a white tile, its cut face red-violet, labels **beetroot** and **white tile**. At *Start with the beetroot*, the cut face brightens.
2. At *pigments called betalains*, a magnifier circle opens on the cut face: three plant cells (labels **cell wall**, **cell surface membrane**, **cytoplasm**, **vacuole**), caption *schematic; not to scale*; `PigmentToken`s jiggle in the vacuolar sap, label *betalain pigment (token)*; at *in the sap inside each cell's vacuole*, the vacuole of one cell brightens, tag *vacuolar sap*.
3. At *cross two membranes*, a dotted path draws from one token outwards; at *the tonoplast around the vacuole*, the vacuole's boundary brightens, label **tonoplast (vacuole membrane)**; at *then the cell surface membrane*, the cell surface membrane brightens; the path continues through the **cell wall** (tag *freely permeable*) into the water outside.
4. At *a built-in leak detector*, a small tag *handle* appears beside the magnifier.
5. At *Written properly*, a boxed sentence surface opens beneath the magnifier and writes clause by clause: **the depth of red-violet in the liquid · is a proxy for · pigment that has leaked across the tonoplast and the cell surface membrane**; at *is a proxy for pigment*, the word **proxy** is underlined in the accent.
6. At *judge it by eye*, a boiling tube of red-violet liquid appears in front of white card; the REAL-WORLD note slides in beside it (normal surface, not an exam panel): **what it responds to:** *betalain pigment that has left the cells* · **fit:** *visible red-violet; judged by eye at equal depth against standards* · **interferences:** *cut-surface leakage (rinse it away); pH and readout conditions (keep them comparable)*.
7. At *does not measure water movement*, a ghost label *water movement* appears beside the tube with a small ✗ and dissolves; tag *a proxy for leakage, not a numerical permeability value*.

**On-screen text:** cell labels; *betalain pigment (token)*; *tonoplast (vacuole membrane)*; *freely permeable*; the boxed sentence; the REAL-WORLD note; *a proxy for leakage, not a numerical permeability value*.

---

### BEAT 4 · Beetroot: cutting, rinsing and first contact · 1:57–2:51
**Narration:**
> Now the method. Push a cork borer down through the beetroot onto a white tile, with your hand clear of its path, and slice the cylinder into discs two millimetres thick with a scalpel against a ruler. Cells sliced open at the cut surfaces leak pigment at once, so rinse the discs under running water until the rinse runs clear. Put ten discs into each boiling tube of ten cubic centimetres of distilled water, already heated in a water bath, at thirty or seventy degrees: three separately cut batches for each temperature. The clock starts when the first disc touches the water, and each tube gets thirty minutes.

**Visual action:**
1. From the first frame, `BeetrootRig` in state `cut` is on screen (beetroot on the white tile, **cork borer, 8 mm**, **scalpel**, **mm ruler**, **forceps** laid beside it, labelled); eye-protection pictogram at the frame corner. At *Push a cork borer down through the beetroot*, the borer, held vertically by its handle, is pushed down through the beetroot onto the tile.
2. At *with your hand clear of its path*, the steadying hand at the beetroot's side is ringed, tag *hand beside, never under or in front of the borer*; the blade tag lands: *hazard: scalpel and cork borer · risk: cutting the hand · precaution: cut on the tile, borer pushed down onto the tile, blade away from the body*; small type: *credited idea: name the hazard, the risk and the precaution together*. internal: adapted from M24/52 Q1(c)(iii), MS p.7.
3. At *slice the cylinder into discs*, the cylinder (pushed out with the rod) lies against the ruler; the scalpel cuts straight down every 2 mm, blade away from the body; label **discs 8 mm × 2 mm**; forceps count them into a batch of **10**.
4. At *leak pigment at once*, a magnifier on one disc edge shows cut-open cells at the surface releasing tokens directly, tag *cells cut open by the blade*.
5. At *rinse the discs under running water*, the batch sits in the **rinse beaker** under a running tap; the rinse water is pale red-violet, then fades to clear (same hue fading only); at *until the rinse runs clear*, tag *rinse until clear: removes cut-surface pigment*.
6. At *Put ten discs into each boiling tube*, the two baths appear (`WaterBathRig` `maintained`), each with a **thermometer** in the water, reading **30 °C** and **70 °C**; three boiling tubes in each, labelled **30-A · 30-B · 30-C** and **70-A · 70-B · 70-C**, tag **10.0 cm³ distilled water in each, pre-heated to bath temperature**; the hot-water tag lands: *hazard: water at 70 °C · risk: scalding the hand · precaution: lift tubes with a test-tube holder*.
7. At *three separately cut batches for each temperature*, six batches of 10 discs line up on the tile, each with its own tube label, tag **three independent preparations per temperature; batches allocated at random**.
8. At *The clock starts when the first disc touches the water*, forceps lower batch 30-A's first disc into its tube; a stopwatch starts from **0:00** on the same frame it first touches the water, tag **t = 0: first contact, tube 30-A**, never reset; the remaining tubes receive their batches at logged times on the same running clock (small type *30-B 1:00 · 30-C 2:00 · 70-A 3:00 · 70-B 4:00 · 70-C 5:00*); at *each tube gets thirty minutes*, tag **exposure time: 30 min per tube, from its own first contact**; caption *time compressed; real elapsed time on the clock*; in the 70 °C tubes the water begins to tint red-violet faster than in the 30 °C tubes (one hue, rising depth).

**On-screen text:** apparatus labels; the two hazard tags and the credited-idea small type; *discs 8 mm × 2 mm*; *rinse until clear*; bath and tube labels; *three independent preparations per temperature*; *t = 0: first contact, tube 30-A*; *exposure time: 30 min per tube*; *time compressed*.

---

### BEAT 5 · Beetroot: reading the colour, and why it differs · 2:51–4:00
**Narration:**
> After thirty minutes, lift out the discs, cool the liquids to room temperature and swirl each to mix it. Pour the same depth into matched tubes and hold them against white card beside a strip of colour standards. At thirty degrees, all three tubes are pale, matching standard one or two; at seventy, all three reach four or five. A colorimeter can replace your eye, with a fixed filter, a water blank and readings inside its useful range. Why the difference? A living cell relies on intact membranes to keep its contents in. At seventy degrees, membrane proteins denature and the bilayer is disrupted, so pigment diffuses out, down its concentration gradient. Temperature also speeds diffusion itself, so not all the difference is permeability, and the pigment must stay stable enough to compare. Damage first, then diffusion.

**Visual action:**
1. From the first frame, BeetrootRig remains in-baths with the same running clock. At *After thirty minutes*, the clock reads 30:00 and tube 30-A is lifted with a holder. At *lift out the discs*, remove its discs with forceps. In a captioned time-compressed sequence, end 30-B at 31:00, 30-C at 32:00, 70-A at 33:00, 70-B at 34:00 and 70-C at 35:00. Highlight each tube's logged start and end together: elapsed exposure 30 min. Never reset or run the clock backwards. All 70 °C tubes are lifted with a holder.
2. At *cool the liquids to room temperature*, the six tubes stand in a rack off the baths, tag *cooled before comparing: readout conditions comparable*; at *swirl each to mix it*, each tube is swirled in a small horizontal circle, the colour becoming even.
3. At *Pour the same depth into matched tubes*, each liquid is poured at ~120° from upright (mouth below base; stream from the lip into the receiving mouth; surfaces level) into a matched flat-bottomed tube to a marked line, tag **equal depth: 5.0 cm³ in matched tubes**.
4. At *beside a strip of colour standards*, the `ColourStandardStrip` stands against **white card**: tubes **1 · 2 · 3 · 4 · 5**, red-violet at increasing depth, caption *standards: dilutions of one beetroot extract; relative depth, ordinal, not a concentration*; a brief preparation inset beside the strip shows discs of the same beetroot crushed in distilled water in a **pestle and mortar**, the extract poured through **filter paper** in a **filter funnel** into a flask, then measured volumes of extract and distilled water (Dataset A) made up to 8.0 cm³ in a **measuring cylinder** (labels), tag *standards made the same session*. No spoken protocol is added.
5. At *At thirty degrees, all three tubes are pale*, 30-A, 30-B, 30-C are held beside the strip in turn and matched: **1 · 1 · 2**; at *at seventy, all three reach four or five*, 70-A, 70-B, 70-C: **4 · 5 · 4**; Dataset A's table builds beside the strip, caption *our illustrative data; matched by eye; ordinal*, with **median 1, observed category span 1–2** and **median 4, observed category span 4–5** tagged *calculated from the three matches*.
6. At *A colorimeter can replace your eye*, a small `ColorimeterModel` inset (tag *recall: 3.1.4*) slides in: **light source → green filter → cuvette → detector → read-out**; at *a fixed filter*, the filter label brightens, tag *same filter for every tube*; at *a water blank*, a distilled-water cuvette sits in the holder and the read-out shows **0.00**, tag *zeroed on a water blank*; at *inside its useful range*, tag *dilute every sample by the same factor if one reads off-scale*. No sample readings are shown.
7. At *Why the difference?*, the rig reduces to the left; the `FluidMosaicMembrane` insets open at right: **30 °C** (`full`) and **70 °C**, both *schematic; not to scale*, outside at the top, cytoplasm below with `PigmentToken`s. At *relies on intact membranes*, the 30 °C inset brightens: the bilayer drifts laterally and almost no tokens cross.
8. At *membrane proteins denature*, in the 70 °C inset the channel and carrier proteins unfold as motion over ~1 s, tag **membrane proteins denatured**; at *the bilayer is disrupted*, the phospholipids jitter faster with gaps opening, tag **bilayer disrupted**; at *pigment diffuses out, down its concentration gradient*, tokens pass up through the gaps and drift away above (motion), net arrow **pigment: net movement down its concentration gradient**. The enlarged bilayer inset represents the cell surface membrane only: outside the cell above, cytoplasm below. Caption: “cell surface membrane enlarged; pigment has already crossed the tonoplast”. Keep the whole-cell thumbnail from Beat 3 beside it, with a vacuole bounded by the tonoplast inside the cytoplasm and a separate cell surface membrane. At the pigment-diffusion cue, animate pigment from vacuolar sap across the tonoplast into cytoplasm, then across the cell surface membrane into external water. Label the two crossings “tonoplast” and “cell surface membrane”. Both membranes can be damaged; the enlarged inset illustrates membrane disruption, not identical composition of the two membranes. The shared lateral-motion, no-flip-flop convention is retained.
9. At *Temperature also speeds diffusion itself*, the pigment tokens in the 70 °C inset move visibly faster than those in the 30 °C inset, tag *faster random movement at the higher temperature*; caveat card beside the insets (normal accent): **not all the difference is permeability: temperature also changes diffusion**; at *the pigment must stay stable enough to compare*, a second line: **pigment stability and readout must stay comparable**.
10. At *Damage first, then diffusion*, the two tags **membrane proteins denatured · bilayer disrupted** and the net arrow pulse in order.

**On-screen text:** *cooled before comparing*; *equal depth: 5.0 cm³ in matched tubes*; the standards and caption; Dataset A with medians and observed category spans; the colorimeter labels and tags; the inset labels; the caveat card.

---

### BEAT 6 · Red onion: the peel and the mount · 4:00–4:47
**Narration:**
> The second investigation is osmosis, in red onion. Choose a scale leaf with a visibly pink-red, living epidermis; not every peel is red. The colour is anthocyanin, dissolved in the sap of each vacuole, and it makes the vacuole easy to follow. Peel a thin strip with forceps and lay it flat in a drop of distilled water on a slide. Lower the coverslip at an angle with a mounted needle, so air is pushed out rather than trapped. Under the microscope, count only whole, undamaged cells, away from the torn edge, folds and bubbles.

**Visual action:**
1. From the first frame, `OnionMount` in state `peel` is on screen: a red onion cut in half on a white tile, forceps, slide, coverslip, mounted needle and dropper bottle of distilled water laid out and labelled; eye-protection pictogram at the corner. At *The second investigation is osmosis*, the tab **red onion: osmosis** from Beat 1 brightens above the tile.
2. At *Choose a scale leaf*, one fleshy scale leaf is lifted out; at *visibly pink-red, living epidermis*, its outer epidermis is ringed; at *not every peel is red*, a second, paler scale leaf beside it is tagged *not every peel is red: choose a visibly pigmented one*.
3. At *The colour is anthocyanin*, a magnifier opens on the pink-red epidermis: cells with large pink-red vacuoles, label **anthocyanin in the vacuolar sap**, caption *schematic; not to scale*; at *easy to follow*, one vacuole's outline pulses.
4. At *Peel a thin strip with forceps*, a nick is made with the scalpel on the tile (blade away from the body) and blunt forceps lift a thin strip of epidermis; at *lay it flat in a drop of distilled water*, the strip goes flat into one drop on the slide, label **distilled water**.
5. At *Lower the coverslip at an angle with a mounted needle*, one coverslip edge touches the slide at the drop's edge, the mounted needle supports the other edge and lowers it; at *air is pushed out rather than trapped*, the liquid front runs ahead of the coverslip, tag *no bubbles over the strip*.
6. At *Under the microscope*, the slide goes onto the stage of `MicroscopeModel` (tag *recall: Topic 1*; small type *×10 eyepiece, ×10 objective*), and the field-of-view inset opens: a single layer of cells, pink-red vacuoles filling them, protoplasts against the walls, caption *drawn model of the field; a real micrograph is sourced, never generated*.
7. At *count only whole, undamaged cells*, the whole cells in the centre of the field brighten; at *away from the torn edge, folds and bubbles*, the torn edge, one fold and one bubble are each tagged ✗ *do not count*. The REAL-WORLD note slides in beside the inset: **what it responds to:** *pink-red anthocyanin in the vacuolar sap, which shows the vacuole's size* · **fit:** *visible at low power in living, pigmented cells* · **interferences:** *unpigmented peel; damaged cells at the torn edge; folds; air bubbles (count only whole, undamaged cells)*.

**On-screen text:** apparatus labels; *not every peel is red*; *anthocyanin in the vacuolar sap*; *distilled water*; *no bubbles over the strip*; *recall: Topic 1*; the field caption; *do not count* tags; the REAL-WORLD note.

---

### BEAT 7 · Red onion: sucrose drawn under, and the count · 4:47–5:47
**Narration:**
> Now swap the water for sucrose solution without lifting the coverslip. Put drops of one mole per cubic decimetre sucrose at one edge, and touch paper towel to the opposite edge; the towel draws the solution under. The clock starts when it first reaches the tissue. Draw enough through to replace the water; that is the stock concentration you applied, not a measured concentration at every cell. Watch the coloured vacuole shrink and the protoplast pull away from the cell wall, first at the corners. The wall stays put. That is plasmolysis. Record the time of each count: here, twenty-seven of twenty-eight whole cells at ten minutes. That count describes this field on this strip, so repeat on independent strips.

**Visual action:**
1. From the first frame, `OnionMount` in state `mount-water` is on screen: the slide on the microscope stage with the field-of-view inset beside it (cells in water, protoplasts against the walls), and a small `CellOsmosisSet` `plant-turgid-equilibrium` thumbnail tagged *in the water mount (recall: 4.2.6)*. At *swap the water for sucrose solution*, a dropper bottle labelled **sucrose solution, 1.0 mol dm⁻³** enters, small type *sucrose: no hazard code on the syllabus materials list; eye protection worn*.
2. At *Put drops of one mole per cubic decimetre sucrose at one edge*, the dropper is squeezed above the slide and one drop falls onto the slide against the left edge of the coverslip, the dropper touching nothing; at *touch paper towel to the opposite edge*, a folded **paper towel** touches the right edge; at *the towel draws the solution under*, the liquid front moves left to right under the coverslip (motion) and is held short of the tissue edge; it does not reach the tissue until the next cue, when contact and clock start occur together.
3. At *The clock starts when it first reaches the tissue*, a stopwatch starts from **0:00** on the same frame the front first reaches the strip's edge, tag **t = 0: sucrose solution first reaches the tissue**, never reset.
4. At *Draw enough through to replace the water*, three more drops are added one at a time, each drawn through by the towel, tag *four drops in all: irrigate enough to replace the water*; at *that is the stock concentration you applied*, tag **1.0 mol dm⁻³: the applied stock, not a measured concentration at every cell**; caption *time compressed; real elapsed time on the clock*.
5. At *Watch the coloured vacuole shrink*, in the inset the cells nearest the entry edge change first (tag *cells meet the solution at different times*): each pink-red vacuole shrinks, the same pink-red hue throughout; at *pull away from the cell wall, first at the corners*, the protoplast of one enlarged cell withdraws at its corners, then along its sides (motion).
6. At *The wall stays put*, the cell wall outline is ringed, tag **wall fixed**; the gap between wall and protoplast is tagged *gap: external solution*.
7. At *That is plasmolysis*, the label **plasmolysis: protoplast withdrawn from the cell wall** lands on the enlarged cell.
8. At *Record the time of each count*, the tally opens beside the inset, each row stamped with its observation time on the running clock: **0 of 28** (in water, before the sucrose) · **6 of 28 at 2 min** · **19 of 28 at 5 min**; at *twenty-seven of twenty-eight whole cells at ten minutes*, **27 of 28 at 10 min** lands and is ringed, with **96.4 %** tagged *calculated: 27 ÷ 28 × 100*; caption *our illustrative data; whole, undamaged cells in one field*.
9. At *describes this field on this strip*, the field's outline is traced, tag *this field, this strip*; at *repeat on independent strips*, two further slide icons appear, **strip 2: 25 of 26 at 10 min (96.2 %)** · **strip 3: 30 of 31 at 10 min (96.8 %)**, tag *independent strips; each proportion its own*.

**On-screen text:** *sucrose solution, 1.0 mol dm⁻³* and its safety small type; *paper towel*; *t = 0: sucrose solution first reaches the tissue*; *irrigate enough to replace the water*; *the applied stock*; *cells meet the solution at different times*; *wall fixed*; *gap: external solution*; the plasmolysis label; Dataset B tally and percentages; *this field, this strip*.

---

### BEAT 8 · Red onion: why the protoplast leaves the wall · 5:47–6:30
**Narration:**
> One thing to get right: the edge of the colour is the tonoplast, not the cell surface membrane. Plasmolysis is diagnosed by the protoplast leaving the wall. The explanation comes from the lesson on water potential. The sucrose solution's water potential is initially lower than the cells', so more water leaves the cells than enters them, by osmosis, across their partially permeable membranes. The protoplast shrinks and pulls away. The wall is freely permeable, so the gap fills with the external solution.

**Visual action:**
1. From the first frame, the enlarged plasmolysed onion cell from the field inset is on screen at left, with the field inset reduced beside it. At *the edge of the colour is the tonoplast*, the boundary of the pink-red vacuole is traced, label **tonoplast (edge of the colour)**; at *not the cell surface membrane*, the protoplast's outer outline just outside it is traced in a second accent, label **cell surface membrane (edge of the protoplast)**.
2. At *diagnosed by the protoplast leaving the wall*, the gap between protoplast and wall at one corner is ringed, tag *diagnose by the gap at the wall*.
3. At *the lesson on water potential*, `CellOsmosisSet` opens at right (tag *recall: 4.2.6*) in `plant-turgid-equilibrium`, labelled *in distilled water*.
4. At *initially lower than the cells'*, the `WaterPotentialModel` `cell-vs-solution` label lands above it: **initially: solution's water potential lower than the cell's**; the surrounding solution gains sucrose tokens (larger orange double-hexagons).
5. At *more water leaves the cells than enters them, by osmosis*, water tokens (small pale-blue circles) cross the cell surface membrane both ways, more outward, with a net arrow **net movement of water by osmosis** pointing out; caption *particles drawn schematically; not to scale; far fewer than real*; at *across their partially permeable membranes*, the cell surface membrane and tonoplast are labelled **partially permeable**.
6. At *The protoplast shrinks and pulls away*, the model moves through `plant-flaccid` to `plant-plasmolysed` (motion; 4.2.6's generalised cell, drawn as published; the pink-red sap belongs to the onion cell at left).
7. At *The wall is freely permeable*, the wall is labelled **cell wall: freely permeable**; at *the gap fills with the external solution*, sucrose and water tokens pass through the wall into the gap, tag **gap: external solution**.

**On-screen text:** *tonoplast (edge of the colour)*; *cell surface membrane (edge of the protoplast)*; *diagnose by the gap at the wall*; *recall: 4.2.6*; the comparison label; *net movement of water by osmosis*; *partially permeable*; *cell wall: freely permeable*; *gap: external solution*.

---

### BEAT 9 · What I told you, on the two rigs · 6:30–7:07
**Narration:**
> So here is what you investigated, on the rigs you built. Beetroot: the depth of red-violet is a proxy for pigment leakage. At seventy degrees, damaged membranes let pigment diffuse out; temperature also speeds diffusion, so keep that caveat. Three tubes per temperature, rinsed discs, equal depth, against standards. Red onion: in sucrose solution, water leaves by osmosis, and the protoplast withdraws from the fixed wall, counted at a recorded time, strip by strip.

**Visual action:**
1. From the first frame, the lesson layout returns, **no new slide**: `BeetrootRig` in state `readout` at left (the six equal-depth tubes beside the `ColourStandardStrip`, with the two membrane insets above), `OnionMount` at right (the field inset in `plasmolysing` with the tally, the enlarged plasmolysed cell and the `CellOsmosisSet` `plant-plasmolysed` model). Static. At *on the rigs you built*, the whole layout settles; nothing moves.
2. At *the depth of red-violet is a proxy*, the boxed sentence from Beat 3 fades in beneath the tubes, **proxy** underlined.
3. At *damaged membranes let pigment diffuse out*, the 70 °C inset's tags **membrane proteins denatured · bilayer disrupted** and its net arrow brighten; at *keep that caveat*, the caveat card **not all the difference is permeability** brightens.
4. At *Three tubes per temperature*, the tube labels 30-A to 70-C and the standards brighten with the tags **three independent preparations per temperature · rinsed · equal depth**.
5. At *water leaves by osmosis*, the net arrow on the `CellOsmosisSet` model brightens; at *withdraws from the fixed wall*, **wall fixed** and **plasmolysis: protoplast withdrawn from the cell wall** brighten.
6. At *counted at a recorded time, strip by strip*, the tally row **27 of 28 at 10 min** and the two strip icons brighten, tag *this field, this strip*.

---

### BEAT 10 · How it is asked, the reject card, and the beetroot · 7:07–7:59
**Narration:**
> How does this reach you? In a typical exam question you would be asked to plan. Say the task is how temperature, from fifteen to fifty-five degrees, affects osmosis in carrot cylinders in distilled water, for six marks. What you should know is: state at least five temperatures, and use three different cylinders at each temperature, with a mean. That task needs a temperature range. Another asks you to judge a water-potential conclusion from rhubarb cells: cells need not all have the same water potential. The scheme doesn't need this, but check your pigment survives the heat. And the beetroot? Boiling damages its membranes, so its pigment diffuses out.

**Visual action:**
1. From the first frame, the familiar lesson layout stays on screen at right, reduced (`BeetrootRig` tubes and standards with the membrane insets; `OnionMount` field inset with its tally), and at *How does this reach you?* a compact forms surface enters at left, one row per form, each beside its visual.
2. At *you would be asked to plan*, small type *syllabus: planning, analysis, conclusions and evaluation are assessed skills*. internal: syllabus p.59, Paper 5.
3. At *Say the task is how temperature*, row 1, card header **Exam-style**: **plan a temperature investigation with plant tissue**, with the row text in small type: *Our stem: how temperature, 15–55 °C, affects the rate of osmosis in carrot cylinders in distilled water; 6 marks. Credited ideas: at least five stated temperatures; at least three different cylinders at each temperature, and a mean. Related planning practice, not this beetroot protocol.* At *from fifteen to fifty-five degrees*, a thermometer scale marked 15 °C and 55 °C appears beside the row; at *affects osmosis in carrot cylinders*, a carrot-cylinder icon beside the row; at *for six marks*, the words *6 marks* brighten; at *state at least five temperatures*, five marks light on the thermometer scale; at *three different cylinders at each temperature, with a mean*, three separate cylinder icons with a tag *three different cylinders at each temperature, and a mean*. internal: adapted from M24/52 Q1(c)(i), QP pp.6–7 / MS p.6.
4. At *That task needs a temperature range*, a ghost strip of five temperatures between 15 °C and 55 °C appears beside row 1, tag **this task asks for a range: 15–55 °C**; the 30 °C and 70 °C beetroot tubes in the layout stay as they are (the two-condition beetroot investigation remains valid for its stated comparison).
5. At *Another asks you to judge a water-potential conclusion*, row 2, card header **Exam-style**: **evaluate a conclusion**, with the row text in small type: *Our stem: a student concludes that red rhubarb epidermis cells have the same water potential as a 0.30 mol dm⁻³ sucrose solution; 4 marks. Credited ideas: concentrations between those tested were not used; no statistics (no standard error or confidence interval); the cells need not all have the same water potential.* At *need not all have the same water potential*, that idea brightens and the onion tally's **this field, this strip** tag pulses. internal: adapted from M24/52 Q1(b)(ii), QP pp.4–5 / MS p.5.
6. At *The scheme doesn't need this*, a separate panel labelled **beyond the mark scheme** (dashed border, no tick, no MS tab, different surface) opens beside the beetroot tubes: *betalain pigment itself must stay stable at the higher temperature for colours to compare fairly*; at *check your pigment survives the heat*, the 70 °C tubes pulse.
7. At *And the beetroot?*, the Beat 1 beakers return small beneath the layout; at *Boiling damages its membranes*, the 70 °C membrane inset's tags brighten beside the simmering beaker, and the reject card lands, struck through by hand: **✗ The heat forces the pigment out of the cells.** / **✓ At 70 °C membrane proteins denature and the bilayer is disrupted, so pigment diffuses out across the damaged membranes.**, caption in small type *our wording contrast, from the plan's traps table; not a mark-scheme line*. At *so its pigment diffuses out*, the simmering beaker's red-violet water pulses. Final frame held 2 s (inside the effective runtime allowance unless the audio edit adds it separately): forms at left, the layout, the beyond-the-mark-scheme panel and the reject card at right, the hook beakers beneath. No slogan.

**On-screen text:** the two Exam-style forms with the row 1 and row 2 texts (our stems, credited ideas); *this task asks for a range: 15–55 °C*; the thermometer scale and block icons; the beyond-the-mark-scheme panel; the reject card and its caption.

---

## Datasets

All values are *our illustrative data* unless stated as set values. No value is taken from a Cambridge paper.

### Dataset A — beetroot pigment leakage, 30 °C vs 70 °C, by eye against standards (Beats 4, 5, 9, 10)

Conditions (set, not readings): one raw beetroot; 8 mm cork borer; discs 8 mm × 2 mm; **10 discs per tube**; each batch rinsed under running water until the rinse runs clear; **10.0 cm³ distilled water** per boiling tube, pre-heated in maintained water baths at **30 °C** and **70 °C** (thermometer in each bath); **three independent tissue preparations per temperature** (separately cut and rinsed batches, allocated at random); **exposure time 30 min** per tube from its own first contact (staggered starts logged on one running clock: 30-A 0:00, 30-B 1:00, 30-C 2:00, 70-A 3:00, 70-B 4:00, 70-C 5:00; each ended at its start + 30:00, i.e. 30:00, 31:00, 32:00, 33:00, 34:00, 35:00); discs removed with forceps; liquids cooled to room temperature and swirled; **5.0 cm³** of each poured into matched flat-bottomed tubes (equal optical depth); matched by eye against white card to the `ColourStandardStrip`.

Standards (set values, made the same session and held at room temperature beside the samples): a stock extract from discs of the same beetroot crushed in distilled water with a pestle and mortar and filtered; each standard made up to 8.0 cm³ with distilled water:

| Standard | Stock extract / cm³ | Distilled water / cm³ | Fraction of stock (stock ÷ 8.0) |
|---:|---:|---:|---:|
| 1 | 0.5 | 7.5 | 0.5 ÷ 8.0 = 1/16 |
| 2 | 1.0 | 7.0 | 1.0 ÷ 8.0 = 1/8 |
| 3 | 2.0 | 6.0 | 2.0 ÷ 8.0 = 1/4 |
| 4 | 4.0 | 4.0 | 4.0 ÷ 8.0 = 1/2 |
| 5 | 8.0 | 0.0 | 8.0 ÷ 8.0 = 1 |

Each standard is 5.0 cm³ in a matched tube (same depth as the samples). The numbers 1–5 are **ordinal labels of relative depth**, not concentrations or amounts of pigment.

| Temperature / °C | Tube | Nearest standard (by eye) |
|---:|:---:|---:|
| 30 | 30-A | 1 |
| 30 | 30-B | 1 |
| 30 | 30-C | 2 |
| 70 | 70-A | 4 |
| 70 | 70-B | 5 |
| 70 | 70-C | 4 |

Worked (ordinal data, so median and range, syllabus p.63 "calculate the mean, median, mode and range of a set of values"): 30 °C matches in order 1, 1, 2 → **median 1**, **observed category span 1–2**; 70 °C matches 4, 4, 5 → **median 4**, **observed category span 4–5** (spans of ordinal labels from unequal dilution steps, not numerical concentration ranges). The two observed category spans do not overlap, so the difference is larger than the spread between independent preparations in this illustrative set. Narrated as "all three tubes are pale, matching standard one or two; at seventy, all three reach four or five". No mean of ordinal labels is calculated; no permeability value is derived. If any sample were deeper than standard 5 it would be off the strip: all samples would then be diluted by the same factor (or a deeper standard added) before matching (not needed here).

Optional colorimeter (Beat 5): green filter, fixed for all tubes; zeroed on a distilled-water blank; samples diluted by a common factor if any reads outside the instrument's useful range. **No absorbance values are presented.**

### Dataset B — red onion epidermis, plasmolysis counts (Beats 7, 9, 10)

Conditions: visibly pink-red, living epidermal strip from one scale leaf per strip; mounted flat in one drop of distilled water; coverslip lowered at an angle with a mounted needle; ×10 eyepiece, ×10 objective; one field chosen away from the torn edge, folds and bubbles; **whole, undamaged cells only**; sucrose solution **1.0 mol dm⁻³ (the applied stock)**, four drops drawn through one at a time with paper towel at the opposite edge; stopwatch started on the frame the sucrose front first reaches the tissue edge; "plasmolysed" = protoplast visibly withdrawn from the cell wall at one or more corners or sides; each count stamped with its observation time (cells meet the solution at different times, so a count time is the time of the count, not a common exposure onset for every cell).

| Strip | Observation time / min (from first reaching the tissue) | Whole cells counted | Plasmolysed | Percentage plasmolysed / % |
|---:|---:|---:|---:|---:|
| 1 | before sucrose (in water) | 28 | 0 | 0 ÷ 28 × 100 = **0.0** |
| 1 | 2 | 28 | 6 | 6 ÷ 28 × 100 = 21.43 → **21.4** |
| 1 | 5 | 28 | 19 | 19 ÷ 28 × 100 = 67.86 → **67.9** |
| 1 | 10 | 28 | 27 | 27 ÷ 28 × 100 = 96.43 → **96.4** |
| 2 | 10 | 26 | 25 | 25 ÷ 26 × 100 = 96.15 → **96.2** |
| 3 | 10 | 31 | 30 | 30 ÷ 31 × 100 = 96.77 → **96.8** |

Worked: percentages as shown (syllabus p.63 "calculate percentages and percentage changes"), to 3 s.f. Each proportion describes its own field and strip; the three strips at 10 min are reported separately (96.4, 96.2, 96.8 %), not pooled into a claim about all onion cells. The one unplasmolysed whole cell in each field at 10 min is left as observed (not explained away).

---

## Real-world samples

| Material | What the method responds to | Fit (range, clarity) | Interferences and how the method handles them | Beats |
|---|---|---|---|---|
| **Raw beetroot** (discs, 8 mm × 2 mm) | Betalain pigments (vacuolar; responsible for the red-violet colour) that have **leaked across the tonoplast and the cell surface membrane** into the water (MF6); a proxy for leakage, **not** a direct measurement of water movement and not a universal numerical permeability value | Clearly visible red-violet; depth judged by eye at equal optical depth against a five-depth standard strip made from the same beetroot (range: standards 1–5; off-strip samples diluted by a common factor); optional colorimeter with a fixed green filter, water blank, readings within its useful range | Cut-surface leakage from cells opened by the blade → rinse until the rinse runs clear; unequal tissue or liquid → 10 discs of one size, 10.0 cm³ per tube; uneven colour in the tube → swirl to mix; unequal depth → 5.0 cm³ in matched tubes; readout conditions → all cooled to room temperature, same card and light; pH → the same distilled-water stock is used; final pH is not measured (a limitation of reading colour solely as leakage); **temperature also changes diffusion**, and **pigment stability** at 70 °C must stay comparable → both stated as caveats (whole difference not attributed to permeability); variation between discs → three independent preparations per condition | 3 (explain-beat statement and on-screen note), 4, 5, 9, 10 (beyond-the-mark-scheme panel) |
| **Red onion epidermis** (a visibly pigmented, living peel) | **Anthocyanin in the vacuolar sap**, which shows the vacuole's size; plasmolysis is read from the **protoplast withdrawing from the fixed cell wall**, not from the coloured edge (the tonoplast) (MF6) | Visible at ×100 in living pigmented cells; count of whole undamaged cells in one field at recorded times (a proportion for this field and strip) | Unpigmented peel (not every peel is red) → choose a pigmented one; damaged cells at the torn edge, folds, air bubbles → count only whole, undamaged cells, coverslip lowered at an angle; incomplete replacement of the water mount → four drops drawn through; 1.0 mol dm⁻³ is the applied stock, not the concentration every cell meets; cells meet the solution at different times → each count stamped with its observation time; one field is not all cells → repeat on independent strips | 6 (explain-beat statement and on-screen note), 7, 8, 9, 10 |
| Sucrose solution, 1.0 mol dm⁻³; distilled water | Reagents, not real materials: they set the external water potential | — | No hazard code on the syllabus p.58 list for sucrose; eye protection still shown | 6, 7 |

**Explain-beat real-world examples:** the hook's cooked beetroot in simmering water versus a washed raw beetroot in cold water (Beat 1, answered in Beat 10: heat damages the membranes, so pigment diffuses out); no other real-world example is added.

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.21) | Beat(s) | How |
|---|---|---|
| 4.2.2 investigate **simple diffusion** using **plant tissue** | 3, 4, 5, 9 | beetroot pigment leakage: what the readout responds to (MF6), cork borer and scalpel on a tile, rinse, 10 discs in 10.0 cm³, 30 °C vs 70 °C maintained baths, three independent preparations, 30 min exposure from first contact, mix, equal depth, standards; pigment diffuses out down its concentration gradient once membranes are damaged; temperature/diffusion and pigment-stability caveats |
| 4.2.2 investigate **osmosis** using **plant tissue** | 6, 7, 8, 9 | red onion epidermis: pigmented living peel, flat mount, coverslip at an angle with a mounted needle, irrigation with sucrose by paper towel, clock at first reaching the tissue, plasmolysis as protoplast withdrawal from the fixed wall, counts at recorded times, independent strips; explanation recalled from 4.2.6 in water-potential terms (qualitative; quantitative plant-tissue osmosis is 4.2.5's) |
| 4.2.2 "non-living materials, including dialysis (Visking) tubing and agar" | — (handed off) | **4.2.2a** (Visking diffusion bag, osmometer, agar plate); named only in Beat 2's small type |
| "investigate" (command) | 4–8 | each design shown with apparatus, handling, readout, controls, repeats and an honest statement of what the readout measures |

### Mark-scheme and examiner points → beats

| Source | Point (description, not quotation, unless marked) | Beat |
|---|---|---|
| M24/52 Q1(c)(i), QP pp.6–7 / MS p.6 | temperature and rate of osmosis, turnip blocks in distilled water, 10–50 °C; maximum 6 marks from nine alternatives; selected creditable points: at least five stated temperatures; at least three different blocks at each temperature and a mean; related planning evidence, not this beetroot protocol (PDF-CHECKED, independent round 1; our paraphrase) | 10 (row 1, reworded as our own carrot-cylinder stem, 15–55 °C); *this task asks for a range: 15–55 °C* |
| M24/52 Q1(b)(ii), QP pp.4–5 / MS p.5 | assess the conclusion that onion-cell water potential equals that of 4.2% sodium chloride; four marks from eight alternatives; examples: intermediate concentrations between 1% and 5% untested; no statistical analysis/standard error/95% confidence interval; onion cells need not all have the same water potential (PDF-CHECKED, independent round 1; our paraphrase) | 10 (row 2, reworded as our own rhubarb-epidermis stem); 7 (this field, this strip) |
| M24/52 Q1(c)(iii), MS p.7 | `ref. to hazard and risk and precaution ;` (verbatim, PDF-CHECKED (plan check); exact match, independent round 1) | 4 (small type beside the hazard–risk–precaution tags, now our wording: *credited idea: name the hazard, the risk and the precaution together*; quotation no longer shown; internal) |
| S21/22 Q4(c), MS p.14 | agar-diffusion application | not used (4.2.2a's close) |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, never, only, no, nothing, cannot, because, must, needs* and causal *so/since* was reread.
- *all along* (1): the pigment was already inside the cells; true of the pictured beetroot.
- *membranes are far too thin to resolve with a light microscope* (1): a resolution statement, true of cell membranes at light-microscope resolution (Topic 1).
- *has to cross two membranes* (3): true for a vacuolar pigment reaching the outside water; the wall is freely permeable and is shown so.
- *It fits because you can judge it by eye* (3): the fit claim is bounded to this readout; interferences are listed on screen.
- *It does not measure water movement* (3): MF6's own limit.
- *so rinse the discs* (4): causal link from cut-surface leakage, which is shown happening.
- *with your hand clear of its path* (4): a handling instruction.
- *each tube gets thirty minutes* (4): our design.
- *all three tubes are pale* / *all three reach four or five* (5): the three tubes of Dataset A, not all beetroot.
- *so pigment diffuses out, down its concentration gradient* (5): the plan's mechanism (damage → diffusion); followed at once by the caveat.
- *so not all the difference is permeability* (5): the plan check's own caveat, spoken.
- *the pigment must stay stable enough to compare* (5): a condition for a fair comparison, not a claim about betalains in general.
- *not every peel is red* (6): MF6.
- *count only whole, undamaged cells* (6): our counting rule.
- *so air is pushed out rather than trapped* (6): the purpose of the technique; bubbles are still shown as something to exclude.
- *that is the stock concentration you applied, not a measured concentration at every cell* (7): MF6; a concentration, not an amount (round-1 should-fix 1).
- *so repeat on independent strips* (7): MF6's generalisation limit.
- *not the cell surface membrane* (8): MF6's diagnostic distinction.
- *so more water leaves the cells than enters them* (8): the water-potential comparison is labelled *initially*; net, not all, water.
- *so the gap fills with the external solution* (8): because the wall is freely permeable (plan 4.2.6).
- *so keep that caveat* (9): recap of Beat 5.
- *you would be asked to plan* (10): syllabus p.59 lists planning among Paper 5's skills.
- *for six marks* (10): our own stem's tariff, matching M24/52 MS p.6 (a maximum of 6 from alternatives; round-1 PDF audit).
- *Creditable choices include five stated temperatures and three different blocks per temperature with a mean* (10): "include" marks these as selected optional points, not a compulsory checklist (MS p.6 points).
- *That question needs a temperature range* (10): bounded to that question (QP pp.6–7: 10–50 °C); the two-condition beetroot comparison remains valid for its stated comparison.
- *onion cells need not all have the same water potential* (10): MS p.5's point, said of onion cells in that question; "need not", not "do not".
- *The scheme doesn't need this* (10): the REAL-WORLD rule's required framing; the panel is labelled beyond the mark scheme.
- *so its pigment diffuses out* (10): callback to the Beat 5 mechanism.
- No sentence says the colour measures water movement or permeability as a number, says heat pushes or forces the pigment out, calls the coloured edge the cell surface membrane, says plant cells burst, uses "concentration of water", or names solute or pressure potential.

---

## Citations

| # | Quotation (verbatim) | Paper / session / question / page | Beat(s) | Copied from | Status |
|---|---|---|---|---|---|
| 1 | "investigate simple diffusion and osmosis using plant tissue and non-living materials, including dialysis (Visking) tubing and agar" | Syllabus 2025–2027, outcome 4.2.2, p.21 | header; 2 (small type) | `SYLLABUS-9700-DETAIL.md` (bold emphasis on "including" in that file is editorial and not reproduced) | syllabus, verbatim |
| 2 | "investigate" | Syllabus p.21 (command word of 4.2.2) | 2 | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 3 | "cork borers"; "mounted needles"; "paper towels"; "white tiles or other suitable surfaces on which to cut" | Syllabus apparatus list, p.57 | 4, 6, 7 (apparatus as drawn; not narrated as quotations) | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 4 | "calculate the mean, median, mode and range of a set of values"; "calculate percentages and percentage changes" | Syllabus mathematical requirements, p.63 | Datasets A, B | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 5 | Paper 5 skills "planning", "analysis", "conclusions", "evaluation" | Syllabus p.59 | 10 (small type, now reworded without the paper number) | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim (matches; independent round 1) |
| 6 | `ref. to hazard and risk and precaution ;` | 9700/52 March 2024 Q1(c)(iii), MS p.7 | 4 (small type) | `work/006/SHARED-SPECS.md` §2 verbatim list; plan 4.2.5 | **PDF-CHECKED (plan check); PDF-CHECKED (independent round 1)**: exact match, `2024/March/9700_m24_ms_52.pdf` p.7, 1 mark (no longer shown; internal) |
| 7 | (no quotation) temperature and rate of osmosis, 10–50 °C; maximum 6 marks from nine alternatives; selected creditable points: at least five stated temperatures; at least three different blocks at each temperature and a mean; related planning evidence, not this beetroot protocol | 9700/52 March 2024 Q1(c)(i), QP pp.6–7 / MS p.6 | 10 | independent round-1 check PDF audit (`9700_m24_qp_52.pdf`, `9700_m24_ms_52.pdf`) | **PDF-CHECKED (independent round 1)** (description only, no quotation; optional points in "any six from"; no longer shown; internal: Beat 10 row 1 is now our own carrot-cylinder stem) |
| 8 | (no quotation) assess the conclusion that onion-cell water potential equals that of 4.2% sodium chloride; four marks from eight alternatives; examples: intermediate concentrations between 1% and 5% untested; no statistical analysis/standard error/95% confidence interval; onion cells need not all have the same water potential | 9700/52 March 2024 Q1(b)(ii), QP pp.4–5 / MS p.5 | 10 | independent round-1 check PDF audit | **PDF-CHECKED (independent round 1)** (description only, no quotation; no longer shown; internal: Beat 10 row 2 is now our own rhubarb-epidermis stem) |
| 9 | (content source, no quotation) beetroot betalain pigments in the vacuole; beetroot membrane-temperature method | SAPS "Using Beetroot in the Lab"; Practical Biology membrane investigation | 3–5 | plan check MF6 (sources named there) | content source verified by the plan check and independently by the round-1 check (SAPS: betalain identity, two-membrane passage, heat/pH-dependent stability; Practical Biology indexed protocol: 30-minute exposure, white-card comparison); neither validates our illustrative colour scores; not exam evidence |
| 10 | (content source, no quotation) anthocyanin in the vacuole of red onion epidermal cells; uneven pigmentation | PMC6963288 (primary study) | 6–8 | plan check MF6 | content source verified by the plan check; not exam evidence |

No examiner-report or other mark-scheme line is quoted. No MS/ER quote card appears in this lesson.

**UNVERIFIED items:**
1. **RESOLVED (independent round 1)** — M24/52 Q1(c)(i) nine listed points: MS p.6, maximum 6, "any six from" nine optional points (point 8: at least three different blocks at each temperature and a mean); QP pp.6–7 specifies rate of osmosis, 10–50 °C. Beat 10 shows our paraphrase (M3 row 1 text).
2. **RESOLVED (independent round 1)** — M24/52 Q1(b)(ii) eight limitation points: MS p.5, four marks; points include missing intermediate concentrations, absent uncertainty/statistical analysis and unequal cell water potentials. Beat 10 shows our paraphrase (M3 row 2 text).
3. **RESOLVED (independent round 1)** — M24/52 Q1 stems: QP pp.6–7 (turnip blocks, rate of osmosis, 10–50 °C); QP pp.2–5 (whole small onions, 2 h and 48 h, challenges the 4.2% conclusion). No stem is quoted.
4. `UNVERIFIED — a marked beetroot or red onion question in the cited blocks` (none found in these blocks, confirmed for these blocks by the round-1 check; the whole-onion mass experiment is not red-onion plasmolysis; no archive-wide absence is claimed; the close is labelled related planning evidence, not this beetroot protocol).
5. `UNVERIFIED — a sourced real micrograph of plasmolysed red onion epidermis` (asset dependency; the field is drawn as a labelled model until one is sourced; never generated).

---

## Word count and runtime

Counted by the validator over the blockquoted narration (hyphenated and en-dash compounds count once; numbers are written as spoken words). Seconds = words ÷ 120 × 60.

| Beat | Kind | Words | Seconds |
|---|---|---:|---:|
| 1 Hook and context | teaching | 88 | 44 |
| 2 Objectives | teaching | 53 | 26.5 |
| 3 Beetroot: what the colour responds to | teaching | 93 | 46.5 |
| 4 Beetroot: cutting, rinsing and first contact | teaching | 108 | 54 |
| 5 Beetroot: reading the colour, and why | teaching | 137 | 68.5 |
| 6 Red onion: the peel and the mount | teaching | 95 | 47.5 |
| 7 Red onion: sucrose drawn under, and the count | teaching | 120 | 60 |
| 8 Red onion: why the protoplast leaves the wall | teaching | 82 | 41 |
| 9 Recap | teaching | 74 | 37 |
| 10 Exam close | teaching | 109 | 54.5 |
| **Total (10 teaching beats; 0 error)** | | **959** | **479.5 (7:59.5)** |
| Budget | | 900 | 7:30 |

**Length, honestly:** **959 words = 7:59.5** at 120 words per minute, **29.5 s over** the 7:30 budget (900 words-equivalent); all ten beats are teaching beats and no error-beat allowance applies. The independent round-1 check **accepts the overrun** (two distinct methods, meaningful handling and honest readouts justify it; no acceleration or split required). Round-1 changes: Beat 10 104 → 102 words (M3 replacement); 27 Sep reword (own exam-style stems): Beat 10 102 → 109, Beat 8 85 → 82; Beat 7 unchanged at 120 (should-fix 1 swaps seven words for seven). Where the overrun sits: the two investigations take **635 words = 5:17.5** (Beats 3–8), because each must show the material's REAL-WORLD statement, apparatus named where it sits, physically possible handling, first-contact timing, repeats and an honest readout; Beat 5 alone (137 words) carries the readout, the optional colorimeter conditions, the mechanism and the plan check's caveat. The bookends (hook/context, objectives, recap, close) take **324 words = 2:42**. The 2 s final hold in Beat 10 sits inside this effective runtime allowance unless the eventual audio edit adds it separately. **Cut list:** per the round-1 ruling, *without lifting the coverslip* is **not** cut, and the colorimeter sentence stays while its inset remains. The only expendable trim is Beat 9 *Three tubes per temperature, rinsed discs, equal depth, against standards.* (−10 → 949 words, 7:54.5), provided its tags brighten at a surviving cue; it is not taken here. This timing is a draft estimate, not a rendered duration. Never speed the narration.

---

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| Visking tubing (diffusion bag, osmometer) and agar (methylene blue plate); S21/22 Q4(c) as a close | 4.2.2a |
| Estimating a tissue's water potential; mass change of potato cylinders; percentage change in mass; the W20/51 lookup; E48 ("amount") | 4.2.5 |
| The full cell-level explanation of osmosis (turgid, equilibrium, flaccid, plasmolysed; red blood cells) | 4.2.6 (recalled by label in Beats 7–8) |
| Agar blocks and SA:V | 4.2.3-4 |
| A multi-temperature beetroot series, ethanol or detergent treatments, pH series | not added (the plan fixes a two-condition 30 °C/70 °C comparison; the five-temperature point is taught as a planning requirement in Beat 10 only) |
| Deplasmolysis (irrigating back with water); incipient plasmolysis; any calculation of water potential from the onion count | not in the plan for this lesson (DO-NOT-ADD: no unsupported osmotic calculations); 4.2.5 owns quantitative estimation |
| Betalain and anthocyanin chemical structures; pigment biochemistry | not added (plan check MF6: no pigment structures or new examinable biochemistry) |
| Solute and pressure potential | excluded by 4.2.6 ("not expected") |
| Statistical tests, standard deviation, error bars | A Level only (p.64); not in this outcome |

## Reusable models

| Model | Specified | For |
|---|---|---|
| **`BeetrootRig`** (`cut`, `rinse`, `in-baths`, `readout`, `colorimeter`; two maintained baths 30/70 °C; three independent preparations; one running clock with logged staggered starts; equal-depth readout) with **`ColourStandardStrip`** (five dilutions of one extract, ordinal) and **`PigmentToken`** | here | none downstream in Topic 4 (plan); available to notes and questions |
| **`OnionMount`** (`peel`, `mount-water`, `irrigate`, `plasmolysing`, `count`; coverslip at an angle with a mounted needle; paper-towel irrigation; clock at first reaching the tissue; tonoplast vs cell surface membrane labels) | here | none downstream in Topic 4 (plan); notes; Topic 1 microscope recall |
| `FluidMosaicMembrane` inset state `heat-damaged` (proteins unfold as motion; bilayer disrupted; pigment tokens pass) | here, lesson-local | none planned |
| Datasets A and B | here | 4.2.2 notes and questions |

## Assets

| Asset | Status | Source |
|---|---|---|
| `BeetrootRig` SVGs (beetroot, tile, cork borer with rod, scalpel, ruler, forceps, rinse beaker and tap, six labelled boiling tubes, test-tube holder, waste beaker, matched flat tubes, white card; standards-preparation inset: pestle and mortar, filter funnel with filter paper, flask, measuring cylinder), `ColourStandardStrip`, `PigmentToken`, whole-cell thumbnail beside the enlarged membrane inset (tonoplast and cell surface membrane crossings); hands (borer push with steadying hand at the side, scalpel stroke away from the body, forceps lowering discs, holder lift, swirl, ~120° pour) | **new build** | authored; handling specified; **rendered still-frame verification pending** (borer vertical onto the tile, hand clear of the path, blade away from the body, pour mouth below base with stream from the lip, level surfaces, holder on hot tubes) |
| `WaterBathRig` `maintained` (two baths, 30 °C and 70 °C) | reuse | Topic 3 (3.1.3) |
| `ColorimeterModel` inset with green filter and water blank | reuse | Topic 3 (3.1.4) |
| `FluidMosaicMembrane` insets `full` and `heat-damaged` | reuse + new lesson-local state | 4.1.1-2; motion authored here |
| `OnionMount` SVGs (onion half, scale leaves, forceps, slide, coverslip, mounted needle, dropper bottles, paper towel), field-of-view inset states, enlarged cell with tonoplast/membrane labels, tally | **new build** | authored; **rendered still-frame verification pending** (coverslip edge on the slide at the drop, needle lowering it at an angle; dropper squeezed above, touching nothing; towel at the opposite edge; pink-red hue constant while the vacuole shrinks) |
| `MicroscopeModel` | reuse | Topic 1 |
| `CellOsmosisSet` (`plant-turgid-equilibrium`, `plant-flaccid`, `plant-plasmolysed`), `WaterPotentialModel` `cell-vs-solution` label | reuse | 4.2.6 |
| Hook beakers (simmering beetroot; cold washed beetroot) | new, schematic vector | authored; no photograph, no generated image |
| Objectives pictograms (tube and thermometer; microscope; membrane with arrow) | new | authored |
| Forms surface, beyond-the-mark-scheme panel, reject card | shared surfaces | existing house style |
| Real micrograph of plasmolysed red onion epidermis | **dependency, not yet sourced** | to be sourced; never generated (UNVERIFIED 5) |

---

## Plan interpretations

1. **Exposure time.** The plan requires "a specified exposure time" without a value. I chose **30 min per tube**, measured from each tube's own first contact, and logged staggered starts (1 min apart) on **one running clock** so the first-contact timer rule (never reset) and equal exposure are both honoured.
2. **Colour standards.** The plan specifies "colour-standard strip (red-violet, five depths)". I made them from dilutions of one extract of the same beetroot (1/16 to 1), made the same session, and labelled them **ordinal 1–5, not concentrations**; the results are summarised by median and range (not a mean of ordinal labels).
3. **Readout comparability.** MF6's "keep pH and readout conditions comparable" is implemented as cooling every liquid to room temperature before comparison, the same white card and light, 5.0 cm³ equal depth in matched tubes, and swirling to mix. The same distilled-water stock is used; final pH is not measured here. pH and pigment stability remain limitations of interpreting colour solely as leakage. Pigment stability is spoken in Beat 5 as a condition and repeated on the Beat 10 beyond-the-mark-scheme panel; I did not add a stability-control tube to the design (not in the plan).
4. **Colorimeter.** The plan makes it optional (recall of 3.1.4). I specified a **green filter** (the colour a red-violet pigment absorbs most; our choice, fixed for all tubes), a water blank and the useful-range rule, and showed **no absorbance numbers**, so no measured-looking values are invented.
5. **Explanation wording.** The plan's "proteins denatured, bilayer disrupted" is spoken as "membrane proteins denature and the bilayer is disrupted", followed at once by the plan check's caveat (temperature also changes diffusion; pigment stability/readout comparable). "Damage first, then diffusion" replaces the trap "heat forces the pigment out", which appears only written, on the reject card, captioned as ours.
6. **Two membranes.** The plan says leakage across "the vacuolar and cell-surface membranes"; the narration names the vacuolar membrane as the **tonoplast** (a term 4.2.6's `CellOsmosisSet` already labels). The enlarged membrane inset represents the cell surface membrane only (captioned that pigment has already crossed the tonoplast); a whole-cell thumbnail beside it shows both crossings, labelled *tonoplast* and *cell surface membrane* (round-1 check M2).
7. **Handle.** The plan leaves the handle to the author. *A built-in leak detector* names the readout's purpose, not the mechanism, and is converted in the same breath into the proxy sentence; it cannot be mistaken for an exam explanation of why pigment leaks.
8. **Onion irrigation and counting.** "Irrigate sufficiently" is implemented as four drops drawn through one at a time; the count is at ×100 on whole, undamaged cells; observation times are shown for each count, with the tag *cells meet the solution at different times* (MF6: no identical exposure onset claimed). Illustrative counts are high (96 % at 10 min) because 1.0 mol dm⁻³ sucrose is a strongly plasmolysing solution; a before-sucrose count of 0 of 28 is included as the water-mount baseline. Two further independent strips are reported separately.
9. **Tonoplast point placement.** MF6's "the coloured vacuole's edge is not itself the cell-surface membrane" is spoken at the start of Beat 8, after the plasmolysis has been seen, so the student is looking at the enlarged cell when the two edges are traced.
10. **Exam close.** Revised in round 1 (check M3): M24/52 Q1(c)(i) and Q1(b)(ii) are now described from the independent round-1 PDF audit (QP pp.2–7, MS pp.5–6), using the check's replacement narration and row texts verbatim. The planning points are presented as selected creditable choices among nine optional alternatives ("Creditable choices include"), not a compulsory checklist; the credited biological variable in the onion question (cells need not all have the same water potential) replaces "variation among cells". The one bounded teaching point is now "That question needs a temperature range" (10–50 °C); the two-condition beetroot investigation remains valid for its stated comparison. The M24/52 Q1(c)(iii) verbatim line is used as small type in Beat 4 to support the hazard–risk–precaution tags (the plan assigns its teaching to 4.2.5; here it is supporting small type only, not taught).
11. **Beyond the mark scheme.** The REAL-WORLD rule requires real-world extras in exam beats to follow the scheme answer and sit on a labelled panel; the pigment-stability reminder is the one such extra in Beat 10.
12. **Hook.** The cold-water comparison uses "barely tints" (not "does not"), matching the 30 °C tubes' faint colour; it is an everyday observation used as a question, answered by the lesson's mechanism.
13. **Safety.** Working materials: water at 70 °C (scald: lift with a holder), scalpel and cork borer (cuts: tile, push down, blade away), sucrose 1.0 mol dm⁻³ (no hazard code on p.58); eye protection shown in every frame with hot water, blades or reagents (should-fix 7).
14. **Budget.** The plan's 7:30 is for 10 teaching beats with no error beats. See *Length, honestly*.
15. **Two copies of the shared files.** During drafting, the working-tree copies of `SHARED-SPECS.md`, the plan and the weights differed from the committed ones (the committed plan lists `CellOsmosisSet` without `plant-turgid-equilibrium`; the working-tree plan and the committed 4.2.6 storyboard include it). I read both; their 4.2.2b requirements (MF6 texts, 30 °C/70 °C with three independent preparations and a specified exposure time, the M24/52 close) are the same in substance. I recall `plant-turgid-equilibrium` because 4.2.6 publishes it. Description-only exam rows were tagged PDF-UNCHECKED (no quotation) in the draft and are now PDF-CHECKED (independent round 1), still shown as our paraphrase; the one verbatim line (M24/52 Q1(c)(iii)) is PDF-CHECKED (plan check). The storyboard passes both versions of the validator (identical output). I edited neither copy.

---

## Validator run

`python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.2b/STORYBOARD.md`

```
== storyboards/topic-04/4.2.2b/STORYBOARD.md
beat  words  cues maxgap  status
   1     88    10     19  ok
   2     53     5     12  ok
   3     93    11     21  ok
   4    108    10     25  ok
   5    137    20     13  ok
   6     95    13     16  ok
   7    120    15     14  ok
   8     85    10     11  ok
   9     74     8     15  ok
  10    102    16     11  ok
TOTAL words 955  cues 118  runtime at 120 wpm 7:57.5  beats 10  failing beats 0
```

No MISSING SECTION or CITATION lines; failing beats 0. (Re-run after the round-1 check response.)

---

## CHECK RESPONSE (round 1)

Independent round-one check of 4.2.2b (27 September 2026; verdict NOT CLEARED; reviewed SHA-256 `e3ba0f8d…3b236`). Every must-fix applied with the check's replacement wording verbatim. The only change is to cue markup: in M1, the two cue phrases the check gives in curly quotes are written in the storyboard's italic cue syntax so the validator can see them. The words are unchanged.

| ID | Status | What changed |
|---|---|---|
| M1 — removal schedule in chronological order | applied | Beat 5 action 1 replaced verbatim: "At *After thirty minutes*, the clock reads 30:00 and tube 30-A is lifted with a holder … end 30-B at 31:00, 30-C at 32:00, 70-A at 33:00, 70-B at 34:00 and 70-C at 35:00 … Never reset or run the clock backwards. All 70 °C tubes are lifted with a holder." `BeetrootRig` timing contract gains: "Add each ten-disc batch promptly, using the same loading procedure and approximately the same loading duration in every tube. First-disc contact defines that tube's nominal exposure start; remove each batch promptly at its scheduled endpoint. The individual discs do not all make contact simultaneously." |
| M2 — membrane compartments | applied | The one-membrane-as-model-of-both bracket is removed from the `heat-damaged` spec and from Beat 5 action 8. In both places the text now reads: "The enlarged bilayer inset represents the cell surface membrane only: outside the cell above, cytoplasm below. Caption: “cell surface membrane enlarged; pigment has already crossed the tonoplast”. Keep the whole-cell thumbnail from Beat 3 beside it … Label the two crossings “tonoplast” and “cell surface membrane”. Both membranes can be damaged; …". The lateral-motion/no-flip-flop convention is retained. Plan interpretation 6 and the assets table were updated to match. |
| M3 — exam close | applied | Beat 10 narration from "In March 2024" through "variation among cells" replaced verbatim: "March twenty twenty-four Paper fifty-two asks how temperature, from ten to fifty degrees, affects osmosis in turnip blocks in distilled water. Six marks are available from nine listed points. Creditable choices include five stated temperatures and three different blocks per temperature with a mean. That question needs a temperature range. Its onion question challenges a water-potential conclusion: onion cells need not all have the same water potential." The pigment sentence and hook callback are kept. Row 1 and row 2 texts are replaced verbatim. The tag is now **"this question asks for a range: 10–50 °C"**. Cues are remapped (*March twenty twenty-four Paper fifty-two*, *from ten to fifty degrees*, *affects osmosis in turnip blocks*, *Six marks are available from nine listed points*, *five stated temperatures*, *three different blocks per temperature with a mean*, *That question needs a temperature range*, *Its onion question challenges a water-potential conclusion*, *need not all have the same water potential*); the removed cues are dropped. The old "Label beneath row 1" is removed because the new row 1 text carries "related planning evidence, not this beetroot protocol". The PDF resolution is propagated to the causal-spine paragraph, scope ledger, absolutes sweep, citations 6–9, the UNVERIFIED list (items 1–3 RESOLVED; item 4 kept, bounded) and interpretations 10 and 15. |
| SF1 — concentration units | applied | Beat 7: "that is the stock concentration you applied, not a measured concentration at every cell"; cue remapped; typicality paragraph and absolutes sweep updated. |
| SF2 — pH comparability | applied | Interpretation 3 no longer says "distilled water throughout" as a pH control. It now reads: "The same distilled-water stock is used; final pH is not measured here. pH and pigment stability remain limitations of interpreting colour solely as leakage." The Real-world samples row is aligned. The spoken caveat is unchanged. No buffer and no correction added. |
| SF3 — standard preparation | applied | Beat 5 action 4 adds a brief inset at the existing standards cue: tissue crushed in a **pestle and mortar**, filtered through **filter paper** in a **filter funnel**, measured dilution made up to 8.0 cm³ in a **measuring cylinder** (labelled). No spoken protocol added. Assets row updated. |
| SF4 — range terminology | applied | Beat 5 now shows "median 1, observed category span 1–2" and "median 4, observed category span 4–5". Dataset A's worked text uses the same terms and notes the unequal dilution steps. |
| SF5 — onion start event and final hold | applied | Beat 7 action 2: the liquid front "is held short of the tissue edge; it does not reach the tissue until the next cue, when contact and clock start occur together". Beat 10's 2 s hold is marked "inside the effective runtime allowance unless the audio edit adds it separately", and *Length, honestly* says the same. |
| Runtime ruling | applied | Overrun accepted, as the check rules. *Length, honestly* and the word-count table are recounted (Beat 10 102; total 955 = 7:57.5, 27.5 s over). The cut list no longer offers *without lifting the coverslip* or the colorimeter sentence; the Beat 9 recap sentence stays listed as optional and is not taken. |

TOTAL words 955  cues 118  runtime at 120 wpm 7:57.5  beats 10  failing beats 0


**27 Sep recheck scope:** changed beats from b56dbe41 and their required numerical/cue/timing dependencies only. Current narration recount: **959 words** at the stated effective 120 wpm; per-beat timings and holds are documented in STORYBOARD-RECHECK-27SEP.md. Earlier pasted validation and runtime snapshots are historical.
