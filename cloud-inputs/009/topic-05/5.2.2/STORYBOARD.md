# 5.2.2 — Identifying the stages: photomicrographs, diagrams and the root-tip squash

**STATUS: CLEARED WITH MINOR EDITS (edits applied) — round-2 independent check (`cloud-checks/007/round-2/5.2.2/CHECK.md`, final round), 27 September 2026.** Open production dependencies (licensed photomicrographs, Topic 1 component names) are tracked in `work/007/ASSETS-NEEDED.md`, not as storyboard defects.

**Storyboard, first draft. Cloud run 007, 27 September 2026.** No audio, no code, no render. Folder `storyboards/topic-05/5.2.2/`.
Cambridge 9700 syllabus 2025–2027, p.23. Command words **INTERPRET** and **IDENTIFY**. Budget from `TOPIC-PLAN-05-CELL-CYCLE.md` §5.2.2 and `TOPIC-05-WEIGHTS.md` (5.2.2 row): **11:00, 17 beats = 16 teaching/framing/recap beats + 1 error beat (E5-05, COMMON MISTAKE)**; teaching allowance 9:50, error beat 1:10; about 1,320 words at **120 words per minute of final video** (the effective rate; the 4 s silent read is not added again). Time plan (SHARED-SPECS §6, a feasible allocation to test): real-image and diagram interpretation ≈ 3:00; edited demonstration ≈ 3:30; counting ≈ 1:15; E5-05 1:10; framing, objectives, recap and exam close ≈ 2:05. 5.2.2 is 4 of 15 fixed-sample papers (1 P1 + 3 P2, 0 P3), 6 overlapping marks (+1 mixed Topic 1/5).

> **5.2.2** interpret photomicrographs, diagrams and microscope slides of cells in different stages of the mitotic cell cycle and identify the main stages of mitosis

(syllabus p.23)

**Authorities read, in full:** `work/007/SHARED-SPECS.md` (binding; §2 format, §3 evidence and tags, §4 counting and wording, §5 shared models, §6 the root-tip squash and image interpretation, §7 frames and motion, §8 error beats); `plan/topic-05/TOPIC-PLAN-05-CELL-CYCLE.md` (whole plan; §5.2.2 parts (a)–(c), time plan, keys, E5-05; lesson list; shared-models table; traps table; `## CHECK RESPONSE (plan)`, especially MF2, MF4, MF5, SF2); `plan/topic-05/TOPIC-05-WEIGHTS.md` (5.2.2 row and paragraph; ledger rows s21_22 Q1(a)(i) and (a)(iii), w22_23 Q4(a)(i), w20_21 Q1(a)(ii), s20_12 Q21; Paper 3 screening; E5-05 register row); `work/007/VERIFIED-EVIDENCE.md`; `cloud-inputs/007/standards-update/VIDEO-STRUCTURE.md` (all of it, including the five-move error beat, the truthful badge, anchored silence, handling physically possible, colour changes, recap on the same visual, the exam close and REAL-WORLD SAMPLES); the cleared `cloud-inputs/006/examples/3.1.3/STORYBOARD.md` and `3.2.1b/STORYBOARD.md`; `cloud-inputs/006/examples/TOPIC-03-PLAN-CHECK.md`; `cloud-inputs/003/standards/SYLLABUS-9700-DETAIL.md` (5.2.2 p.23; 1.1.1 p.15; practical skills p.51 and p.54; p.61); `cloud-inputs/007/evidence/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md` (G05); `EXAMINER-INSIGHT-9700.md` (no Topic 5 sentence); `COMPLEXITY-CALIBRATION-9700-BIOLOGY.md` §5. **No question paper, mark scheme or examiner report PDF was opened for this draft.** (Round-1 check, 27 September 2026: the checker read the original papers and mark schemes; the exam claims are now tagged PDF-VERIFIED (round-1 check), see *Citations*.) Every quotation is copied from the permitted files named in *Citations*; everything else is our wording, labelled *our framing* or *our composite*, or listed as `UNVERIFIED`.

**Build position:** fifth of the eight Topic 5 lessons (5.1.1 → 5.1.3 → 5.1.4 → 5.2.1 → **5.2.2** → 5.1.2 → 5.1.5 → 5.1.6). **Models used:** `MitosisCellModel` (5.2.1; **plant** variant, stage ids `interphase`, `prophase-early`, `prophase-late`, `metaphase`, `anaphase`, `telophase`, `cytokinesis`; count strip not shown); `ChromosomeModel` (5.1.1; only inside the plant cell model); `CellCycleWheel` (5.1.3; thumbnail in Beat 15 only); **the Topic 1 light-microscope model** by labelled recall (`UNVERIFIED — the Topic 1 microscope component's registered name and handling spec; not in this run's inputs`). **Models published here:** `RootTipSquashRig` (based on the SAPS fresh-garlic chemical sequence and timings); `FieldOfViewSchematic` (exactly 60 cells: 51 / 4 / 2 / 1 / 2) with its results table; the lesson-local `DecisionStrip` and `PhotomicrographPanel` (a frame for the image set). **Real photomicrographs are mandatory and sourced, never generated:** every beat that needs one is storyboarded against a placeholder carrying `UNVERIFIED — licensed root-tip squash photomicrograph set: source, licence, organism, stain`; each needed image is an **open asset** (`work/007/ASSETS-NEEDED.md`, merged into `work/007/ASSETS-NEEDED.md`). No specific real photograph is described as held: narration and visual text refer to *the image*, so they stay valid whether the conductor attaches a licensed photomicrograph or an approved labelled drawing (captioned as a drawing).

---

## The causal spine

One idea carries the lesson: **a prepared slide is a still population of cells, each showing the stage it had reached; you identify a stage from what its nuclei and chromosomes visibly show, and you commit to one stage per cell.**

> **Examine cell boundaries and the number and positions of nuclei or chromosome groups first. A clearly resolved single nucleus with diffuse chromatin supports interphase; two reforming nuclei within one dividing cell support telophase (with cytokinesis under way). Use chromosome arrangement as well as the number and positions of groups: condensed chromosomes dispersed through the nuclear region support prophase; chromosomes arranged at the equator support metaphase, allowing for viewing angle; two separated groups of condensed daughter chromosomes towards opposite poles support anaphase. Two reforming nuclei with decondensing chromosomes within one dividing cell support telophase. Name one stage for each labelled cell and the visible feature that supports it; where resolution or overlap prevents a justified identification, say so. A root-tip squash (acid to soften the material between cells, a chromatin stain, a gentle vertical press) spreads meristem cells into a thin layer so that this reading is possible; counting every cell in a field gives a mitotic index = cells in mitosis ÷ all cells counted.**

**What the mark schemes credit, quoted:** [s21_22 Q1(a)(i), QP p2 / MS p7] 2 marks, E metaphase, F anaphase, with the reject line **"R more than one stage given for either E or F"** (PDF-VERIFIED (plan check), A15). [w22_23 Q4(a)(i), QP p10 / MS p14] 2 marks, A metaphase, B anaphase (verified summary, A16; not quoted). [w20_21 Q1(a)(ii), QP p2 / MS p6] 1 mark, the stage of a pictured duplicated chromosome, prophase/metaphase alternatives accepted (verified demand; not quoted). [s21_22 Q1(a)(iii), QP p2 / MS p7] 1 mark, plant tissue with a reason, mixed Topic 1/5 (verified demand). [s20_12 Q21, key A] spindle-block effect with stage photographs (verified key; shared with 5.2.1). G05's summary of the demand: *G05: "Identify a mitotic stage from chromosome evidence"*; G05's authored check: *"Commit to a stage supported by chromosome arrangement; two incompatible guesses do not establish identification."*; G05's proposed checkpoint 1: *"identify a stage from a new diagram, then identify the visible evidence supporting it"* (G05's words; the papers ask identification only, so naming the evidence is our diagnostic teaching addition and is shown as **beyond the mark scheme** wherever an exam form is on screen). Syllabus practical basis: 1.1.1 "make temporary preparations of cellular material suitable for viewing with a light microscope" (p15); "make accurate observations from specimens including counting numbers of cells or cell organelles" (p54, the direct basis of the counting segment); additional Paper 5 support "carry out appropriate calculations to simplify or explain data, including means, percentages and rates of change" (p61). So the spine is what is credited: one stage name per labelled cell, read from chromosome arrangement; the practical and counting segments rest on the syllabus's practical skills, not on an examined root-tip procedure (the five fixed-sample Paper 3 pairs contain none).

**The handle:** *count the groups, then read the arrangement.* Converted at once, in Beat 9: *Written properly: first examine the cell boundaries and the number and positions of nuclei or chromosome groups; then use the arrangement of the chromosomes to distinguish prophase, metaphase and anaphase.* The handle is never the exam answer; the exam answer is the stage name.

**Typicality rules applied.** The meristem just behind the root cap is *a region of active mitosis*, not a tissue where every cell divides; the sampled tip includes the root cap and cells further back divide less often. Garlic has *relatively* few, large chromosomes; the 2n = 4 teaching cell is a simplified model, not the garlic karyotype (2n = 16). Toluidine blue stains chromatin in interphase nuclei as well as condensed chromosomes, so staining alone does not identify a dividing cell. Colours and contrast vary with preparation: stages are identified by structure, not hue. A spindle or a crisp envelope line is *often* not resolved in a light micrograph (s21_22's question itself says its microtubules are not visible); a metaphase plate seen from another angle *may* not look like the model's straight line. Lack of visible detail alone does not prove interphase. The mitotic-index inference is approximate and is stated only for a representative population of comparable, actively cycling, unsynchronised cells under steady conditions; no stage duration is calculated. Prepared specimens are static: no living mitosis under the coverslip, and acid contact is never called instantaneous fixation. Exam forms are described as *in the papers we checked*; no prevalence is claimed. Reasons students err are phrased as possibilities.

**One error beat, five moves** (announce → written card → 4 s silent read → cue-synced talk-through → correct in place): **E5-05 in Beat 13**, badge **COMMON MISTAKE**, basis *mark-scheme reject line, s21_22 Q1(a)(i), MS p7, PDF-VERIFIED* — "R more than one stage given for either E or F". The written answer (our composite) gives two stages for cell E; the marker clears only on the completed correct frame. No other beat carries a badge; Beat 17's reject card is captioned *our wording contrast; not an examiner-reported error*.

---

## The models, specified once

### `RootTipSquashRig` (published here)

Based on the SAPS fresh-garlic chemical sequence and timings; the clove support and cutting-tool arrangement are storyboard adaptations, to be checked for stable support and safe handling. (The SAPS sheets use a cocktail-stick support, scissors and a nested beaker/bijou arrangement; the slotted collar, blade-and-tile and supported bath container below are our handling adaptations, not the source's exact apparatus. Round-1 check SF2.)

Method (fixed, from SHARED-SPECS §6 / plan §5.2.2(b), SAPS resource 1358): pre-equilibrate 1 mol dm⁻³ HCl at 40 °C for 15 minutes; support the clove so its roots enter the acid; start the five-minute treatment timer at contact; remove and rinse the roots; cut the terminal 3 mm onto a watch glass; stain for two minutes with one drop of 1% aqueous toluidine blue; remove excess stain and rinse; transfer gently with a paintbrush to a clean slide, add water and tease apart with a mounted needle; lower the coverslip; wrap the slide in paper towel and press gently vertically on a flat supported surface, without sliding or twisting; locate the meristem at low power, then inspect chromosomes at high power.

Parts, each named with an SVG text label where it sits:
- **garlic clove** (*Allium sativum*) with a cluster of **creamy white roots** about 1–2 cm long, grown from the clove's base while it stood on a small **jar of water** (label *roots grown in water*).
- **water bath, 40 °C** (display and a **thermometer** standing in the water), holding a small **container of 1 mol dm⁻³ HCl** that stands supported in the bath (label *1 mol dm⁻³ hydrochloric acid, 40 °C*; hazard tag *warm acid: eye protection; no skin contact; container stays supported in the bath*). A **clove holder** (a slotted plastic collar resting across the container's rim) supports the clove so only the roots dip into the acid.
- **treatment timer** (5:00 countdown) beside the bath; a separate **pre-warm timer** (15:00).
- **rinse beaker** of water; **white tile**; **scalpel blade** (rests flat on the tile when not in use; tag *blade away from fingers*); a **3 mm scale bar** that appears on the tile at the cut; **watch glass**.
- **dropper bottle, 1% aqueous toluidine blue** (tag *stains skin and clothing: gloves*); a separate **pipette with a bulb** for removing excess liquid; a labelled **waste receptacle** (label *waste*); **wash bottle of water**.
- **paintbrush** (fine); **clean microscope slide**; **mounted needle** (tag *needle away from fingers*); **coverslip**; **paper towel**; the **flat supported bench surface**; a gloved **thumb**.
- **eye protection** pictogram in the corner of every acid and stain frame; **gloves** on both hands from the stain step onward.

Handling (specified here; rendered still-frame verification pending): the acid container never leaves the bath; the clove is lowered in its holder, never held over a face; to dispense stain or water, hold the dispensing tip above the material without touching the specimen. To remove excess liquid, compress a separate pipette bulb before immersion, lower its tip just into the liquid at the edge of the watch glass away from the root tips, and release the bulb to aspirate. Lift and empty it into a labelled waste receptacle. Repeat after adding rinse water. Keep the root tips in the watch glass; do not aspirate them; the blade cuts on the tile, fingers holding the root well back from the cut; the coverslip is lowered, one edge touching the water first; the press is a thumb pressing **straight down** through folded paper towel onto a slide lying flat on the bench, with no sliding or twisting; the slide is then unwrapped and placed on the microscope stage.

States:
- **`grow`**: clove on the water jar; the roots lengthen from the base (time-lapse, tag *time compressed*).
- **`prewarm`**: the acid container in the 40 °C bath; the pre-warm timer runs **15:00 → 0:00** in time-lapse with tag *time compressed*; thermometer reads **40 °C** throughout.
- **`dip`**: the clove holder is lowered onto the container rim; **on the rendered frame on which the root tips first touch the acid, the treatment timer starts at 5:00 and runs down**; it runs in time-lapse (tag *time compressed*) to 0:00 and is never reset. No bubbling, no colour change, no drawn "fixing" effect.
- **`rinse`**: the holder is lifted, the roots are dipped into the rinse beaker and withdrawn (motion).
- **`cut`**: one root laid on the white tile; the blade cuts it 3 mm from the tip; the scale bar shows **3 mm**; the terminal pieces are lifted with the paintbrush into the watch glass (label *terminal 3 mm*). Label on the piece: *root cap at the very end; meristem just behind it*.
- **`stain`**: one drop contacts the tips; that same frame starts the **2:00 → 0:00** treatment timer and gradual staining. Time compression is labelled. Later narration cues highlight the existing timer/change rather than restarting either. (Gloved hand; the drop is dispensed from above, the dropper not touching; the tips **darken in place** from creamy white to deep blue, intensity only, no intermediate hue.)
- **`rinse-stain`**: the separate pipette's bulb is compressed before immersion; its tip is lowered just into the liquid at the edge of the watch glass, away from the root tips, and the bulb is released to aspirate the excess stain; the pipette is lifted and emptied into the labelled **waste receptacle**. Rinse water from the wash bottle is dispensed from above, then aspirated the same way and emptied into the waste receptacle. The root tips stay in the watch glass and are never aspirated (motion).
- **`transfer`**: the paintbrush lifts one tip onto the centre of the clean slide; one drop of water is added from above.
- **`tease`**: the mounted needle teases the tip apart; the fragments spread a little (motion).
- **`coverslip`**: the coverslip is lowered, one edge first, onto the water.
- **`press`**: the slide is wrapped in paper towel, laid flat on the supported bench; the gloved thumb presses gently straight down (a short vertical arrow; no lateral motion); a cut-away inset shows clumped cells spreading into a thin layer beneath the coverslip (motion). Tag *gentle, vertical: avoids broken glass*.
- **`view`**: the slide on the Topic 1 light-microscope model's stage (see below).

Real colours: roots creamy white before staining; after staining, dark-blue chromatin on a paler background, **checked against the selected toluidine-blue preparation**; the stain darkens in place and never passes through an unrelated colour. Caption on stained frames: *colours vary with preparation; identify stages by structure, not hue*.

### The Topic 1 light-microscope model (by labelled recall)

Recall tag *recall: 1.1.1 · the Topic 1 light-microscope model*. Handling standard: low power first; coarse focus only at low power; fine focus only at high power; objectives never lowered onto the slide while looking down the eyepiece. `UNVERIFIED — the Topic 1 microscope component's registered name and handling spec; not in this run's inputs` (a production dependency). No re-teaching of parts beyond the labels **low-power objective**, **high-power objective**, **fine focus**, **stage**.

### `PhotomicrographPanel` (lesson-local frame; content is a production dependency)

A framed panel that holds **real, sourced, licensed photomicrographs**. Until each image is attached, every frame carries the placeholder line `UNVERIFIED — licensed root-tip squash photomicrograph set: source, licence, organism, stain` and a grey hatched field with the frame id; **never a generated stand-in**. Each frame id below is an **open asset** (`work/007/ASSETS-NEEDED.md`); no real photograph is described here as held. When an image is recorded, the panel's small-type credit line reads *source · licence · organism · stain*. If the conductor instead approves a labelled drawing for a frame (the round-1 README fallback), that frame is captioned *labelled drawing — not a photomicrograph*, never presented as microscopy, and the round-1 check's M2 condition below is re-ruled for that frame before clearance. The panel only rings, highlights, zooms and labels; the image itself never moves or changes (prepared specimens are static). Required frames:

| Frame id | Content required | Beats |
|---|---|---|
| `PM-LOW` | low-power view of a stained root-tip squash showing a region of small, densely packed meristem cells; cap labels only if the selected squash genuinely retains a recognisable cap region | 8, 16 |
| `PM-HIGH` | high-power field of meristem cells, **toluidine-blue stained**, containing clearly resolved interphase nuclei and at least one cell each of prophase, metaphase, anaphase and telophase | 1, 8, 9, 10, 12, 16, 17 |
| `PM-PRO`, `PM-MET`, `PM-ANA`, `PM-TEL` | a crop of one cell at each stage (from `PM-HIGH` or the same set) | 10, 11, 16 |
| `PM-MET-ANGLE` | a metaphase cell seen from another orientation, not a straight line | 10 |
| `PM-UNCLEAR` | a cell that cannot be identified with justification (overlap, or out of focus) | 12 |
| `PM-HIGH` cell *detail-poor* (or crop `PM-PALE`) | one pale, detail-poor cell with no chromosomes visible, identified by its position in `PM-HIGH`; if `PM-HIGH` has none, a separate crop from the documented set | 12 |

Organism: garlic (*Allium sativum*) root tip preferred; if the licensed set uses another root tip, the credit line names it and the narration's "garlic" is not attached to that image. Stain: the `PM-HIGH` and `PM-LOW` frames shown in Beat 8 must be toluidine-blue preparations (SHARED-SPECS §6: no differently stained reference is used as the colour standard for this preparation); if only another stain is licensed, Beat 8's colour clause is re-checked before audio.

**Asset completion (round-1 check M2, verbatim):** Before production clearance, attach the actual image files for PM-LOW, PM-HIGH, PM-PRO, PM-MET, PM-MET-ANGLE, PM-ANA, PM-TEL and PM-UNCLEAR. Record each source URL or archive identifier, reuse licence, organism, stain/preparation, crop and the exact cells used by each beat. Also identify the detail-poor cell used in Beat 12. Confirm that every narrated feature is visible: cell boundaries, a resolved interphase nucleus, each stage's chromosome arrangement, the alternate metaphase view, and the two reforming telophase nuclei. Trace a cell plate only where one is actually resolved. PM-LOW must support any cap/meristem labels placed on it. Use an actual toluidine-blue preparation as the colour reference for the demonstrated protocol. If one field cannot supply all stages, use explicitly labelled separate fields from the documented set and update the cues. Do not create, recolour or substitute schematic microscopy to fill missing evidence. Keep image pixels static; animate only annotations.

**RESOLVED 27 Sep 2026 (conductor accepted `compare/COMPARE.md`; files and credits in `sme-9700-archive/assets/topic-05/final/`, `CREDITS.md`, ring boxes `COORDS.json`).** Licensed, CC0, Berkshire Community College Bioscience Image Library: `PM-HIGH` (file 23581048618, full field), `PM-PRO` and `PM-ANA` (crops of that same field), `PM-LOW` (23581053848), `PM-MET` (23581050748, **separate field**), `PM-PALE` (37385549016, **separate field**, the Beat 12 detail-poor cell). All are onion (*Allium*) root tip, longitudinal section, stain not stated; credit line *Berkshire CC Bioscience Image Library · CC0 · onion (Allium) root tip, longitudinal section · stain not stated*. Drawings, unlabelled, captioned *drawing — not a photomicrograph*: `PM-MET-ANGLE`, `PM-TEL`, `PM-UNCLEAR` (M2 re-ruled per frame). `PM-HIGH` has no clear metaphase, telophase or pale cell, so those come from the labelled separate frames above and the cues in Beats 9–12 name them. **No licensed image is toluidine blue**, so Beat 8's colour clause no longer points at an image (re-check before audio); the toluidine-blue colour reference for the rig remains open.

The missing source/licence/organism/stain values are established from the real assets when attached, never filled with invented wording. The Topic 1 microscope component identifier and its implementation check remain open production dependencies.

### `MitosisCellModel`, plant variant (published by 5.2.1; reused by stage id)

Rectangular cell wall with the cell surface membrane just inside; nucleolus; no centrioles; spindle from the poles; the 2n = 4 `ChromosomeModel` set in C1–C4 hues (deep blue, teal, amber, green). Beat 3 replays `interphase → prophase-early → prophase-late → metaphase → anaphase → telophase → cytokinesis` as continuous motion (condensing; envelope fragmenting; nucleolus fading; spindle forming; alignment; the centromeres dividing in one rendered frame with the units relabelled *daughter chromosome*; poleward movement, centromere leading; envelopes re-forming; nucleoli reappearing; vesicles fusing into a cell plate). Beats 11 and 16 show paused stage states side by side. In this lesson the drawn cells take the render style `renderStyle: toluidine-blue-schematic` only inside `FieldOfViewSchematic`; elsewhere they keep the shared hues. Register `renderStyle: toluidine-blue-schematic` in 5.2.1's MitosisCellModel specification before reuse: shared geometry, stage states and counts unchanged; dark-blue chromatin/chromosomes on a pale background, exclusively for FieldOfViewSchematic. Retain the schematic and non-garlic-karyotype captions. (Round-1 check SF4; the registration is made in 5.2.1 by its owner, flagged to the conductor.) Caption *schematic; 2n = 4 teaching model, not the garlic karyotype*.

### `FieldOfViewSchematic` (published here)

A circular field of view containing **exactly 60** whole, closely packed **square plant cells** in eight rows of **5, 7, 8, 10, 10, 8, 7, 5** (= 60), a stepped block centred in the circle, pale background outside the block; no partial cells. A dashed **counting boundary** runs round all 60. Cells are simplified `MitosisCellModel` plant states in `renderStyle: toluidine-blue-schematic` (dark-blue chromatin or chromosomes on a pale cell; cell walls as thin grey lines). Captions throughout: *schematic drawing — not a photomicrograph* and *chromosome drawings simplified; not the garlic karyotype (2n = 16)*. Fixed composition and addresses (row r, column c from the left of that row):

| Stage | Number | Cell addresses |
|---|---:|---|
| interphase | 51 | every other cell |
| prophase | 4 | P1 r2c3 · P2 r4c7 · P3 r6c2 · P4 r7c6 |
| metaphase | 2 | M1 r3c5 · M2 r5c9 |
| anaphase | 1 | A1 r4c3 |
| telophase | 2 | T1 r5c5 · T2 r8c3 (each one undivided cell with two reforming nuclei and a forming cell plate) |
| **total** | **60** | |

Each cell is addressable for ring, highlight and a count mark (a small tick that appears as it is counted). Tallies go to a **results table** beside the field, never onto the image as readings: headings *stage* · *tally* · *number of cells*; rows interphase, prophase, metaphase, anaphase, telophase, **total**; no units in the body; tag *count from the schematic field; teaching data*. A calculated line beneath, labelled *calculated*: **mitotic index = 9 ÷ 60 = 0.15 → 15 %**; a second calculated line, small: *interphase: 51 ÷ 60 = 0.85 → 85 %*.

### `DecisionStrip` (lesson-local)

A vertical strip of four steps with line icons, beside the `PhotomicrographPanel`: **1 · boundaries and groups** (how many nuclei or chromosome groups, where) → **2 · one resolved nucleus, diffuse chromatin → interphase** · **two reforming nuclei in one cell → telophase** → **3 · chromosome arrangement:** dispersed condensed chromosomes → prophase; equatorial arrangement → metaphase; two separated condensed groups towards opposite poles → anaphase. Compare with step 2's two reforming nuclei for telophase. → **4 · commit to one stage; name the feature — or say it cannot be justified**. Each step lights as it is used. Not a flowchart of certainties: step 4 always carries *or say so*.

### `CellCycleWheel` (published by 5.1.3; thumbnail only)

Used once, small, in Beat 15: the ring with G1, S, G2 bracketed as **interphase**, M and C, caption *schematic proportions — interphase is typically the longest part*; recall tag *recall: 5.1.3*. No marker motion, no inset.

---

## Beat by beat

Beat windows in the headings follow the per-beat ledger (words ÷ 120; the 4 s silent read in Beat 13 sits inside the effective rate and is not added again); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch over 30 words without a stated visual change. Lab waits are time-compressed and tagged; no silent demonstration holds are used. The only holds are E5-05's anchored holds (inside its 73 s at the effective rate; see Beat 13) and Beat 17's 2 s final hold (added to the ledger).

### BEAT 1 · Hook and context · 0:00–0:43.5
**Narration:**
> Ever wondered how anyone can tell which stage of mitosis a cell is in, when all they have is a still picture? When we looked at chromosome behaviour, you watched the stages move. A prepared slide does not move. It shows many cells, each at whatever point it had reached when the slide was made. An exam can hand you a photomicrograph or a diagram and ask you to name the stage. This lesson teaches you to read still images, and shows you how one is made.

**Visual action:**
1. **From the first frame**, the `MitosisCellModel` plant cell is on screen at left, running from `metaphase` into `anaphase` (motion), no labels yet; at *which stage of mitosis a cell is in*, the hook question appears as a compact caption above it, never alone on the frame.
2. At *you watched the stages move*, the plant cell completes `telophase` and `cytokinesis` (motion); recall tag *recall: 5.2.1* top left.
3. At *A prepared slide does not move*, the `PhotomicrographPanel` opens at right on `PM-HIGH` (credit line visible); the image stays completely still; the moving model pauses beside it for contrast.
4. At *It shows many cells*, a soft highlight sweeps once across the field of cells in the panel (the image itself unchanged); at *whatever point it had reached*, four cells in the panel are ringed in the house accent, one after another, each with a small **?** tag.
5. At *a photomicrograph or a diagram*, a small drawn diagram cell (the paused plant model) slides in beneath the panel; at *name the stage*, a blank answer line *stage: ______* appears beside one ringed cell.
6. At *read still images*, the panel brightens; at *how one is made*, a garlic clove with white roots on a water jar (`RootTipSquashRig` `grow`) slides in small at the bottom edge; dissolve to the objectives surface.

**On-screen text:** the hook question; *recall: 5.2.1*; the `PM-HIGH` credit line; *stage: ______*.

---

### BEAT 2 · What you will be able to do · 0:43.5–1:07
**Narration:**
> By the end you will be able to identify the main stages of mitosis in photomicrographs, diagrams and slides, and name the evidence you used; to follow how a root-tip squash slide is made; and to count the cells in a field and calculate a mitotic index.

**Visual action:** Own branded surface, distinct background colour and brand typography, **not the lesson diagram**; each line enters with motion beside a simple authored pictogram (flat line icons, not the lesson's models or images). The magnifier-over-cell, slide-and-coverslip and tally pictograms are visible from the first frame of the objectives surface. The cue points introduce the text and secondary icons.
1. At *identify the main stages of mitosis*, line 1 enters beside the **magnifier-over-cell** pictogram; at *name the evidence you used*, a small **pointer** pictogram joins it.
2. At *follow how a root-tip squash slide is made*, line 2 enters beside the **slide-and-coverslip** pictogram.
3. At *count the cells in a field*, line 3 enters beside the **tally-marks** pictogram; at *calculate a mitotic index*, a small **percent** pictogram joins it.

1. **IDENTIFY** the stage of each cell, and **NAME** the evidence
2. **FOLLOW** the root-tip squash, step by step
3. **COUNT** cells in a field and **CALCULATE** a mitotic index

Small type: *syllabus 5.2.2, "interpret … and identify", p.23.*

---

### BEAT 3 · Recall: what each stage looks like · 1:07–1:40
**Narration:**
> First, what you are looking for. Here is the plant cell model again. In interphase there is one nucleus, its chromatin spread out. In prophase the chromosomes condense and become visible. In metaphase they line up across the equator. In anaphase the centromeres divide and the sister chromatids separate to opposite poles, as daughter chromosomes. In telophase two new nuclei form. Those arrangements are your evidence.

**Visual action:**
1. At *what you are looking for*, recall tag *recall: 5.2.1* top left; the `MitosisCellModel` plant cell at centre in `interphase`, caption *schematic; 2n = 4 teaching model, not the garlic karyotype*; at *the plant cell model*, labels **cell wall**, **nucleus**, **nucleolus**.
2. At *one nucleus, its chromatin spread out*, the nucleus is ringed, label **interphase**.
3. At *the chromosomes condense and become visible*, `prophase-early → prophase-late`: the chromosomes coil and thicken (motion), the nucleolus fades, the envelope fragments; label **prophase**.
4. At *line up across the equator*, `metaphase`: the chromosomes are moved to the equator (motion); label **metaphase**.
5. At *the centromeres divide*, the centromeres divide in one rendered frame and the units are relabelled **daughter chromosome**; at *separate to opposite poles*, `anaphase`: they move apart, centromere leading (motion); label **anaphase**.
6. At *two new nuclei form*, `telophase`: envelopes re-form round each group and nucleoli reappear (motion); label **telophase**.
7. At *Those arrangements are your evidence*, the model pauses and four small stills of the stages it passed through line up beneath it, each labelled.

**On-screen text:** *recall: 5.2.1*; stage labels; the model caption.

---

### BEAT 4 · The sample: why garlic root tips · 1:40–2:24.5
**Narration:**
> The sample for the slide is garlic: cloves stood in water until roots grow. Why root tips? Just behind the root cap is the meristem, a region of active mitosis. Garlic has relatively few, large chromosomes, and root tips contain no chlorophyll, so no green pigment competes with the stain. The stain is toluidine blue, which stains chromatin deep blue. It shows interphase nuclei as well as condensed chromosomes, so staining alone does not identify a dividing cell: you identify stages from the arrangement of the chromosomes and nuclei.

**Visual action:**
1. At *The sample for the slide*, `RootTipSquashRig` `grow` fills the frame: the clove on its water jar; at *cloves stood in water*, the roots lengthen from the clove's base (time-lapse), tag *time compressed*; labels **garlic clove (*Allium sativum*)**, **roots grown in water**.
2. At *Why root tips?*, the view zooms along one creamy white root to its tip; a longitudinal schematic of the tip draws, caption *schematic*; at *Just behind the root cap*, the cap at the very end is labelled **root cap**; at *is the meristem*, the zone behind it is shaded in the house accent, label **meristem: a region of active mitosis**.
3. At *relatively few, large chromosomes*, a small inset shows the plant cell model's four chromosomes, tag *teaching model: 2n = 4; garlic: 2n = 16, relatively large*.
4. At *no green pigment competes*, the root beside a green leaf icon; the leaf icon fades, tag *no chlorophyll in root tips*.
5. At *The stain is toluidine blue*, the **1% aqueous toluidine blue** dropper bottle appears beside the root; at *stains chromatin deep blue*, a small schematic nucleus darkens in place to deep blue.
6. At *It shows interphase nuclei*, two schematic cells side by side darken: one with a diffuse interphase nucleus, one with condensed chromosomes; at *staining alone does not identify a dividing cell*, both are ringed together, tag *both stained*.
7. At *from the arrangement of the chromosomes and nuclei*, the condensed chromosomes in the second cell are traced, tag *arrangement = evidence*.

**On-screen text:** part labels; *root cap*; *meristem: a region of active mitosis*; *teaching model: 2n = 4; garlic: 2n = 16*; *no chlorophyll in root tips*; *both stained*; *time compressed*.

---

### BEAT 5 · Warm acid, timed from first contact · 2:24.5–3:07
**Narration:**
> First, the acid. Hydrochloric acid, one mole per cubic decimetre, is warmed in a water bath at forty degrees for fifteen minutes. Wear eye protection, and leave the container supported in the bath. Support the clove so its roots dip into the acid, and start a five-minute timer the moment they touch. Why acid? It softens the material between neighbouring cells, which helps the stain get in and lets the cells spread into a thin layer later. Then lift the roots out and rinse them.

**Visual action:**
1. At *First, the acid*, `prewarm`: the water bath with the acid container supported in it, labels **water bath, 40 °C**, **thermometer**, **1 mol dm⁻³ hydrochloric acid**; the eye-protection pictogram appears in the corner.
2. At *warmed in a water bath at forty degrees*, the thermometer reads **40 °C**; at *for fifteen minutes*, the pre-warm timer runs **15:00 → 0:00** in time-lapse, tag *time compressed*.
3. At *Wear eye protection*, the pictogram pulses; at *leave the container supported*, the container's base on the bath shelf is ringed, hazard tag *warm acid: eye protection; no skin contact; container stays supported in the bath*.
4. At *Support the clove so its roots dip*, `dip`: the clove in its holder is lowered onto the container rim (label **clove holder**); the roots descend into the acid.
5. At *start a five-minute timer the moment they touch*, **on the rendered frame on which the root tips first touch the acid, the treatment timer starts at 5:00**; the contact point is ringed and the already-running timer pulses; it runs down in time-lapse to 0:00, tag *time compressed*, never reset. No bubbling, no colour change.
6. At *It softens the material between neighbouring cells*, an inset shows a schematic block of root cells: the thin layers between neighbouring cells are highlighted and soften (their outlines loosen; motion), caption *schematic*; at *helps the stain get in*, small arrows enter the loosened block; at *spread into a thin layer later*, a ghost preview of the cells separating is tagged *later: the squash*.
7. At *lift the roots out and rinse them*, `rinse`: the holder lifts the clove clear; the roots dip into the rinse beaker and withdraw.

**On-screen text:** part labels; *40 °C*; timers with *time compressed*; the acid hazard tag; *acid softens the material between cells* (small type beside the inset).

---

### BEAT 6 · Cut the tip, stain it · 3:07–3:42
**Narration:**
> Next, cut off the last three millimetres of each root on a tile, fingers well back from the blade, and put the tips on a watch glass. Wear gloves: toluidine blue stains skin and clothing. Add one drop of one per cent toluidine blue and leave it for two minutes. Watch the creamy white tips darken in place to deep blue. Then remove the excess stain and rinse with water.

**Visual action:**
1. At *cut off the last three millimetres*, `cut`: one rinsed root lies on the **white tile**; the **scalpel blade** cuts it; the **3 mm** scale bar appears at the cut; at *fingers well back from the blade*, the holding fingers are ringed at a safe distance, tag *blade away from fingers*; the blade is laid flat on the tile.
2. At *put the tips on a watch glass*, the terminal pieces are lifted with the paintbrush into the **watch glass**, label *terminal 3 mm: root cap at the very end; meristem just behind it*.
3. At *Wear gloves*, gloved hands; at *stains skin and clothing*, the tag *stains skin and clothing: gloves* attaches to the dropper bottle.
4. At *Add one drop*, dispense the toluidine blue from above the tips, without touching the specimen. On the rendered frame when the drop first contacts the root-tip material, start the two-minute timer at **2:00** and begin the gradual staining change. Show **1% aqueous toluidine blue**. At *leave it for two minutes*, highlight the already-running timer and introduce the labelled time compression; never initialise or reset the timer at this later cue. Finish the treatment before removing excess stain.
5. At *darken in place to deep blue*, highlight the continuing colour change that began at contact. Do not start a second staining animation. Let the single timer and staining sequence finish before the rinse action. (The change is intensity only, creamy white to deep blue, no other hue.)
6. At *remove the excess stain*, `rinse-stain`: the separate pipette's bulb is compressed before immersion, its tip lowered just into the liquid at the edge of the watch glass away from the root tips, and the bulb released to aspirate; the pipette is lifted and emptied into the labelled **waste receptacle**; at *rinse with water*, water from the wash bottle is dispensed from above, then aspirated at the edge the same way and emptied into the waste receptacle. The root tips stay in the watch glass; they are never aspirated.

**On-screen text:** part labels; *3 mm*; the safety tags; timer and *time compressed*.

---

### BEAT 7 · The squash: a thin layer, pressed straight down · 3:42–4:22
**Narration:**
> Now make the thin layer. Lift a tip with a paintbrush onto a clean slide, add a drop of water, and tease it apart with a mounted needle. Lower a coverslip over it. Wrap the slide in paper towel, lay it on a flat, supported surface, and press gently, straight down, without sliding or twisting. Gently, so the glass does not break; straight down, so the cells spread into a thin layer. An unspread squash hides chromosomes behind other cells.

**Visual action:**
1. At *Now make the thin layer*, the watch glass with the stained tips at left, a **clean microscope slide** at centre; at *Lift a tip with a paintbrush*, `transfer`: the paintbrush lifts one tip onto the slide's centre; at *add a drop of water*, one drop falls from above.
2. At *tease it apart with a mounted needle*, `tease`: the **mounted needle** teases the tip; the fragments spread a little (motion); tag *needle away from fingers*.
3. At *Lower a coverslip*, `coverslip`: the **coverslip** is lowered, one edge touching the water first.
4. At *Wrap the slide in paper towel*, the slide is folded into **paper towel**; at *a flat, supported surface*, it lies flat on the bench, the surface labelled **flat, supported surface**.
5. At *press gently, straight down*, `press`: the gloved thumb presses vertically; a short vertical arrow; no lateral movement; at *without sliding or twisting*, ghost arrows for sliding and twisting appear and are struck through.
6. At *so the glass does not break*, tag *gentle: avoids broken glass*; at *so the cells spread into a thin layer*, the cut-away inset beneath the coverslip shows clumped cells spreading into one thin layer (motion), caption *schematic*.
7. At *An unspread squash hides chromosomes*, a second small inset shows an unpressed clump with cells stacked over one another; one dark group is half hidden behind a neighbouring cell and is ringed, tag *not spread: chromosomes hidden*.

**On-screen text:** part labels; *flat, supported surface*; *gentle: avoids broken glass*; *not spread: chromosomes hidden*.

---

### BEAT 8 · Low power to find the meristem, then high power · 4:22–5:04
**Narration:**
> Then to the microscope, handled as you learned for cell structure: low power first. At low power, scan for small meristem cells; these come from just behind the root cap. The tip you cut includes the cap, and cells further back divide less often, so do not assume every cell is dividing. Then switch to high power and use the fine focus. Here is a high-power image of a stained onion root tip. Colours vary between preparations, so identify stages by structure, not shade.

**Visual action:**
1. At *Then to the microscope*, `view`: the unwrapped slide is placed on the stage of **the Topic 1 light-microscope model**; recall tag *recall: 1.1.1 · the Topic 1 light-microscope model*; at *low power first*, the **low-power objective** clicks into place (label).
2. At *scan for small meristem cells*, the `PhotomicrographPanel` opens on `PM-LOW`; a scan box moves across the image (annotation only; the image is static) and settles on a region of small, densely packed cells, label **meristem: small cells, select here**; at *just behind the root cap*, the Beat 4 intact-root schematic (caption *schematic*) returns small beside the panel with its **root cap** and **meristem** labels; the anatomical location is shown on that diagram. `PM-LOW` (a longitudinal section) genuinely retains its cap, so a **root cap** label may also sit on it.
3. At *The tip you cut includes the cap*, the cap on the intact-root schematic is ringed, tag *in the sample, not dividing tissue*; at *cells further back divide less often*, the region further back on the same schematic is shaded lightly, tag *fewer dividing cells*.
4. At *switch to high power*, the nosepiece turns and the **high-power objective** clicks into place while the operator watches from the side (no objective lowered onto the slide); at *use the fine focus*, the **fine focus** knob turns a little, label.
5. At *Here is a high-power image*, the panel cuts to `PM-HIGH`, credit line *Berkshire CC Bioscience Image Library · CC0 · onion (Allium) root tip, longitudinal section · stain not stated*; at *a stained onion root tip*, one interphase nucleus and one condensed group are ringed in turn. (This section's colours are not toluidine blue; the next sentence carries the colour point.)
6. At *Colours vary between preparations*, small type *colours vary with preparation; identify stages by structure, not hue*; at *by structure, not shade*, the ringed group's outline is traced.

**On-screen text:** *recall: 1.1.1 · the Topic 1 light-microscope model*; objective and focus labels; *root cap* and *meristem* (on the schematic); *meristem: small cells, select here*; the credit line; the colour caption.

---

### BEAT 9 · Count the groups, then read the arrangement · 5:04–5:39.5
**Narration:**
> So how do you read an image like this? Here is the handle: count the groups, then read the arrangement. Written properly: first examine the cell boundaries and the number and positions of nuclei or chromosome groups; then use the arrangement of the chromosomes. A clearly resolved single nucleus with diffuse chromatin supports interphase. Two reforming nuclei within one dividing cell support telophase, often with a new cell plate between them.

**Visual action:**
1. At *how do you read an image like this*, `PM-HIGH` holds at centre-right; the `DecisionStrip` slides in at left, steps dim.
2. At *count the groups, then read the arrangement*, the handle appears as a strap-line above the strip; at *Written properly*, step 1 lights: **boundaries and groups**.
3. At *examine the cell boundaries*, the walls of three neighbouring cells in the panel (interphase, anaphase, interphase) are traced in the house accent; at *the number and positions of nuclei*, a small count tag lands in each: **1**, **2**, **1**.
4. At *then use the arrangement of the chromosomes*, step 3 is previewed (lights briefly, then dims).
5. At *A clearly resolved single nucleus*, step 2's first line lights; an interphase cell in the panel is ringed and zoomed; at *diffuse chromatin supports interphase*, its evenly spread chromatin is outlined, label **interphase**.
6. At *Two reforming nuclei within one dividing cell*, step 2's second line lights; `PM-TEL` (drawing, captioned *drawing — not a photomicrograph*) slides in beside `PM-HIGH`, and its cell is ringed (both nuclei inside one boundary); at *support telophase*, label **telophase**; at *a new cell plate between them*, the paused plant-model `telophase` state appears small beside it with its cell plate labelled **cell plate forming (diagram)**; no plate is traced on the drawing.

**On-screen text:** the handle strap-line; the `DecisionStrip`; count tags; *interphase*; *drawing — not a photomicrograph*; *telophase*; *cell plate forming (diagram)*.

---

### BEAT 10 · Read the arrangement: prophase, metaphase and anaphase · 5:39.5–6:20
**Narration:**
> Now read the chromosome arrangement within each cell. Condensed chromosomes spread through the nuclear region, not lined up: prophase. Chromosomes arranged across the equator: metaphase, though a plate seen from another angle may not look like the model's straight line. Two separate groups of daughter chromosomes, towards opposite poles: anaphase. And do not wait to see a spindle or a crisp nuclear envelope; a light micrograph often does not resolve them, and one exam question said its microtubules were not visible.

**Visual action:**
1. At *Now read the chromosome arrangement*, light DecisionStrip step 3 beside PM-HIGH. At *within each cell*, ring the two selected dividing cells in `PM-HIGH` (prophase and the anaphase cell with two separated groups; this field has no clear metaphase). Do not place that example beneath a one-group heading.
2. At *Condensed chromosomes spread through the nuclear region*, the panel zooms to `PM-PRO`; the condensed threads are outlined, not a line; label **prophase**; the matching paused plant-model state appears small beside it.
3. At *arranged across the equator*, `PM-MET` (tag *separate field*): a dashed equator line is drawn across the cell over the chromosome row; label **metaphase**; paused model state beside it.
4. At *a plate seen from another angle*, `PM-MET-ANGLE` (drawing, captioned *drawing — not a photomicrograph*) slides in beside `PM-MET`; its chromosome cluster is ringed, tag *metaphase seen from another angle: not a straight line*.
5. At *Two separate groups of daughter chromosomes*, `PM-ANA`: the two groups are ringed, short arrows point towards the two poles (drawn arrows only; the image does not move); at *towards opposite poles*, label **anaphase**; paused model state beside it.
6. At *do not wait to see a spindle*, the model's spindle is highlighted in the small state beside the image while the image shows none, tag *spindle often not resolved in a light micrograph*; at *a crisp nuclear envelope*, the same for the envelope line.
7. At *one exam question said its microtubules were not visible*, small type *s21_22 Q1 (Paper 2): its question states the microtubules are not visible (PDF-VERIFIED (round-1 check); stated in our words)*.

**On-screen text:** stage labels; *separate field*; *drawing — not a photomicrograph*; *metaphase seen from another angle: not a straight line*; *spindle often not resolved in a light micrograph*; the s21_22 note.

---

### BEAT 11 · Diagrams, and committing to one stage · 6:20–6:55
**Narration:**
> A diagram works the same way, and it is usually cleaner than a real cell. Here are the model's stages beside the matching cells in the image. Whatever the image, commit to one stage for each cell, and name the feature that justifies it. For this cell: chromosomes lined up across the equator, so metaphase. Naming the evidence is how you check yourself; it turns a guess into an identification.

**Visual action:**
1. At *A diagram works the same way*, the paused plant-model states (prophase, metaphase, anaphase, telophase) line up in a top row, caption *schematic diagrams*; at *usually cleaner than a real cell*, one diagram cell and one image crop are ringed together.
2. At *beside the matching cells in the image*, `PM-PRO`, `PM-MET`, `PM-ANA`, `PM-TEL` line up beneath their diagrams in a bottom row, each with its credit line (`PM-TEL`: *drawing — not a photomicrograph*); the `DecisionStrip` holds at left.
3. At *commit to one stage for each cell*, step 4 lights: **commit to one stage; name the feature**; at *name the feature that justifies it*, a pointer icon appears beside step 4.
4. At *For this cell*, `PM-MET` is ringed; at *chromosomes lined up across the equator*, the chromosome row is underlined; at *so metaphase*, the answer line fills: **metaphase — chromosomes across the equator**.
5. At *Naming the evidence is how you check yourself*, the feature half of the answer line brightens; at *turns a guess into an identification*, a tick lands beside the full line.

**On-screen text:** the two rows with labels and credit lines; step 4; the answer line.

---

### BEAT 12 · When the image will not tell you · 6:55–7:26.5
**Narration:**
> Real images have limits. Cells overlap, some lie at an angle, and some are slightly out of focus. If resolution or overlap prevents a justified identification, say so. And be careful with a cell where you can see no chromosomes at all: lack of visible detail alone does not prove interphase. Interphase needs positive evidence, a clearly resolved single nucleus with diffuse chromatin.

**Visual action:**
1. At *Real images have limits*, `PM-HIGH` holds with the `DecisionStrip`; at *Cells overlap*, the panel cuts to `PM-UNCLEAR` (drawing, captioned *drawing — not a photomicrograph*) and the overlapping region is ringed; at *slightly out of focus*, its blurred contents are bracketed.
2. At *say so*, step 4's clause *or say it cannot be justified* lights; an answer line fills **cannot be identified with justification: overlapping cells**.
3. At *a cell where you can see no chromosomes at all*, the panel cuts to `PM-PALE` (tag *separate field*) and its pale, detail-poor cell is ringed with a **?** tag; at *lack of visible detail alone*, a ghost label *interphase* hovers over it and is struck through, tag *not enough evidence*.
4. At *Interphase needs positive evidence*, the interphase cell ringed in Beat 9 returns beside it; at *a clearly resolved single nucleus*, its nucleus is outlined; label **interphase: resolved nucleus, diffuse chromatin**.

**On-screen text:** *drawing — not a photomicrograph*; *separate field*; the answer line; *not enough evidence*; *interphase: resolved nucleus, diffuse chromatin*.

---

### BEAT 13 · COMMON MISTAKE E5-05: two stages for one cell · 7:26.5–8:39.5
**Narration:**
> Here is a mistake the mark scheme refuses, on the card. Our framing of a June 2021 question: identify the stage shown by cell E and by cell F. Read this answer.
>
> *(silent read, 4 s)*
>
> Look at the line for cell E: two stage names with a slash between them. It is tempting: this cell can sit between two pictures in your memory, chromosomes across the equator and the next stage close behind, so offering both can feel safe. The mark scheme for that question closes that door. Its reject line: more than one stage given for either E or F. So hedging on E loses the mark for E. It does not automatically cancel a correct answer for F. The fix is to decide, from what the cell shows.
>
> *(correction)*
>
> Run the sequence on E: one group, lined up across the equator, not yet separated. So E is metaphase.

**Visual action:**
1. **Entry cue: *Here is a mistake the mark scheme refuses*.** COMMON MISTAKE panel enters (header badge **COMMON MISTAKE**, terracotta border, desaturated surround) with its basis line in small type: *basis: mark-scheme reject line, s21_22 Q1(a)(i), MS p7, PDF-VERIFIED*; it **stays on until the completed correct frame**. The `DecisionStrip` holds at left, dimmed.
2. At *Our framing of a June 2021 question*, the header lands: **Identify the stage of mitosis shown by cell E and by cell F.** Small type *our framing of s21_22 Q1(a)(i), 2 marks (PDF-VERIFIED (round-1 check)); the displayed question card and diagram cells are authored adaptations; Cambridge artwork is not reproduced. Cells E and F here are our schematic diagram cells from the plant model, lettered to match.* Beneath it, two paused plant-model cells: **E** (`metaphase`) and **F** (`anaphase`).
3. At *Read this answer*, the written answer appears in handwriting style: **✗ E: metaphase / anaphase** · **F: anaphase**. Small type *our composite; not a transcript*.
4. **Silent read, 4 s.** Panel, cells and card held.
5. At *Look at the line for cell E*, line E is underlined in terracotta; at *with a slash between them*, the slash is ringed in terracotta.
6. At *this cell can sit between two pictures*, two small ghost diagrams (paused metaphase and paused anaphase) float either side of cell E, joined to it by thin dashed lines; at *the next stage close behind*, the anaphase ghost pulses once.
7. At *The mark scheme for that question*, citation tab, exact: **s21_22 Q1(a)(i), MS p7: "R more than one stage given for either E or F"** (PDF-VERIFIED (plan check)); at *more than one stage given*, the tab's words are underlined.
8. At *hedging on E loses the mark for E*, a mark box beside line E shows **0** (anchored hold 2.0 s on the E mark box after *loses the mark for E*); at *does not automatically cancel*, the mark box beside line F shows **1**, ticked, and line F is outlined in the normal accent; a boundary tab beneath the card, in the normal accent, carries the plan's repair wording: **Giving more than one stage for a labelled cell loses that cell's identification mark; it does not automatically cancel a correct identification of the other cell.** (Anchored hold 2.0 s on the E/F mark boxes after *a correct answer for F*.)
9. At *The fix is to decide*, the `DecisionStrip` brightens beside the card (marker still on); line E's two names and the single-stage evidence the strip asks for are shown side by side (anchored hold 1.7 s on this single-stage evidence comparison after *from what the cell shows*, before the correction marker).
10. At *Run the sequence on E*, steps 1 and 3 light in turn over cell E; at *one group, lined up across the equator*, cell E's chromosome row is underlined; at *not yet separated*, its centromeres are ringed.
11. At *So E is metaphase*, the slash and *anaphase* on line E are struck through by hand and the line reads **✓ E: metaphase** · **F: anaphase** (the mark-scheme answers, first and staying visible); beside it, a small panel labelled **beyond the mark scheme** reads *evidence: chromosomes across the equator, not yet separated*; small type under the card: **In S21/22, E is metaphase and F is anaphase.** **The marker clears on this completed frame**. **Exit cue: end of *E is metaphase*.** Anchored hold on the completed correct frame: 2.89 s.

**On-screen text:** the panel and basis line; the framed header and captions; the card; the MS tab; mark boxes; the corrected card; the beyond-the-mark-scheme panel.

**E5-05 timing schedule (round-1 check SF6).** The effective 120 wpm (146 words = 73.0 s) already includes the 4 s read. Reproducible schedule at a spoken rate of 145 wpm: speech 146 ÷ 145 × 60 = **60.41 s** + silent read **4.00 s** + anchored holds **8.59 s** = **73.00 s**. Holds: 2.0 s (E mark box) + 2.0 s (E/F mark boxes) + 1.7 s (single-stage evidence comparison) = **5.70 s inside the 95-word talk-through** (95 ÷ 145 × 60 = 39.31 s spoken + 5.70 s = **45.01 s** talk-through); 2.89 s on the completed correct frame. Word count does not by itself prove the 45 s talk-through: measured audio is checked, preserving 65–75 s total and at least 45 s talk-through, and holds are adjusted within those anchors if the measured speech rate differs.

---

### BEAT 14 · Counting a field · 8:39.5–9:15.5
**Narration:**
> Slides are also for counting, a practical skill the syllabus names. This is a drawn field, a schematic, not a photomicrograph, with sixty cells inside a marked boundary. Count every cell once and decide its stage: fifty-one in interphase, four in prophase, two in metaphase, one in anaphase and two in telophase. A telophase cell that has not yet divided counts once, because you are counting cells, not nuclei. That makes sixty.

**Visual action:**
1. At *Slides are also for counting*, the `PhotomicrographPanel` slides left and shrinks; `FieldOfViewSchematic` fills the right; small type *syllabus p54: "make accurate observations from specimens including counting numbers of cells or cell organelles"*.
2. At *a schematic, not a photomicrograph*, the captions *schematic drawing — not a photomicrograph* and *chromosome drawings simplified; not the garlic karyotype (2n = 16)* appear and stay; at *inside a marked boundary*, the dashed counting boundary is traced once.
3. At *Count every cell once*, a scan line moves row by row and each cell receives a small count tick as it passes; the empty results table (*stage* · *tally* · *number of cells*) appears beside the field.
4. At *fifty-one in interphase*, the interphase cells brighten together and the interphase row fills **51**; at *four in prophase*, P1–P4 are ringed and the row fills **4**; at *two in metaphase*, M1–M2, **2**; at *one in anaphase*, A1, **1**; at *two in telophase*, T1–T2, **2**. Tag on the table: *count from the schematic field; teaching data*.
5. At *A telophase cell that has not yet divided*, T1 is zoomed: its two reforming nuclei are each ringed, then one ring encloses the whole cell, tag **one cell, counted once**; at *counting cells, not nuclei*, a ghost count *2* over T1 is struck through.
6. At *That makes sixty*, the total row fills **60**, working beside it: **51 + 4 + 2 + 1 + 2 = 60**.

**On-screen text:** captions; the results table; *one cell, counted once*; the sum.

---

### BEAT 15 · The mitotic index, and what it can suggest · 9:15.5–10:07
**Narration:**
> Nine cells are in mitosis: four, two, one and two. The mitotic index is the number of cells in mitosis divided by the total number of cells counted: nine over sixty, 0.15, or fifteen per cent. The denominator is all sixty, not the nine. These are counts from our schematic field. In a representative population of comparable, actively cycling, unsynchronised cells under steady conditions, a more frequent stage can suggest a longer duration; this is an approximate inference, not an exact timing law. Real tissue may contain non-dividing cells and unevenly sampled regions. We do not calculate stage duration from this invented field.

**Visual action:**
1. At *Nine cells are in mitosis*, the nine mitotic cells in the field brighten together; at *four, two, one and two*, the four mitotic rows of the table are bracketed, working **4 + 2 + 1 + 2 = 9**.
2. At *The mitotic index is*, the formula builds beneath the table: **mitotic index = cells in mitosis ÷ total cells counted**; at *nine over sixty*, it fills **9 ÷ 60**; at *0.15, or fifteen per cent*, **= 0.15 → 15 %**, label *calculated*.
3. At *The denominator is all sixty*, the dashed counting boundary pulses round all 60 cells and the **60** in the formula is ringed; at *not the nine*, a ghost **9 ÷ 9** is struck through.
4. At *These are counts from our schematic field*, the tag *count from the schematic field; teaching data* brightens.
5. At *a more frequent stage can suggest a longer duration*, the `CellCycleWheel` thumbnail appears small beside the table (recall tag *recall: 5.1.3*), its interphase bracket ringed, caption *schematic proportions — interphase is typically the longest part*; beside it the calculated line *interphase: 51 ÷ 60 = 0.85 → 85 %*.
6. At *an approximate inference*, a label **approximate, not an exact timing law** attaches to the wheel thumbnail; at *Real tissue may contain non-dividing cells*, the small intact-root schematic from Beats 4 and 8 shows its region further back tagged *fewer dividing cells* (caption *schematic*).
7. At *We do not calculate stage duration*, a ghost **time per stage = ?** line appears under the table and is struck through, tag *not from an invented field*.

**On-screen text:** the working; *calculated*; the interpretation tags; the wheel caption.

---

### BEAT 16 · What I told you, on the images you read · 10:07–10:44.5
**Narration:**
> So here is the lesson, on the images you worked with. The squash: acid softens the material between cells, the stain darkens the chromatin, and a gentle press straight down spreads the cells into a thin layer. Low power to find the meristem, high power to read it. Then count the groups, read the arrangement, commit to one stage and name its evidence. And the mitotic index is cells in mitosis over all cells counted.

**Visual action:** **No new slide.** The screen returns to the layout built through the lesson: `PM-HIGH` in the `PhotomicrographPanel` at centre with the `DecisionStrip` at left, the four stage crops (`PM-PRO`, `PM-MET`, `PM-ANA`, `PM-TEL`) beneath with their paused diagram states, the `RootTipSquashRig` slide-and-thumb (`press`), the `PM-LOW` thumbnail and the intact-root schematic small at upper right, `FieldOfViewSchematic` with its results table small at lower right. Static. Key points fade in in place:
1. At *on the images you worked with*, the layout settles; nothing moves.
2. At *acid softens the material between cells*, the rig thumbnail brightens with tag *acid: softens the material between cells*; at *the stain darkens the chromatin*, tag *toluidine blue: chromatin*; at *spreads the cells into a thin layer*, tag *gentle, vertical press: thin layer*.
3. At *Low power to find the meristem*, the `PM-LOW` thumbnail and its **meristem: small cells, select here** box brighten; at *high power to read it*, `PM-HIGH` brightens.
4. At *count the groups, read the arrangement*, steps 1–3 of the strip brighten in turn with the stage labels on the four crops; at *commit to one stage and name its evidence*, step 4 and the answer line **metaphase — chromosomes across the equator** brighten.
5. At *the mitotic index is cells in mitosis over all cells counted*, the field's formula **9 ÷ 60 = 0.15 → 15 %** (*calculated*) brightens.

---

### BEAT 17 · How it is asked, and the reject card · 10:44.5–11:26.5 (+ 2 s final hold → 11:28.5)
**Narration:**
> How does this reach you? In the papers we checked, as a picture with lettered cells: a June 2021 and a November 2022 paper each asked for the stages of two cells, for two marks; another asked for the stage of one pictured chromosome. The scheme credits the stage name. It doesn't need your evidence, but naming it is how you check. The reject card: an empty-looking cell is not proof of interphase. And the hook? You read a still picture by its chromosomes.

**Visual action:**
1. At *How does this reach you?*, a compact forms surface enters at left, one row per form, **beside the familiar lesson layout, which stays on screen from the beat's first frame** at right (reduced): `PM-HIGH` with the `DecisionStrip` and the four stage crops.
2. At *a picture with lettered cells*, row 1: **identify the stage of two lettered cells** · *s21_22 Q1(a)(i), 2 marks, QP p2 / MS p7: E metaphase, F anaphase* and *w22_23 Q4(a)(i), 2 marks, QP p10 / MS p14: A metaphase, B anaphase*; small type *our framing; PDF-VERIFIED (round-1 check); displayed question cards and diagram cells are authored adaptations; Cambridge artwork is not reproduced*; the crops `PM-MET` and `PM-ANA` brighten.
3. At *the stage of one pictured chromosome*, row 2: **stage of a pictured duplicated chromosome** · *w20_21 Q1(a)(ii), 1 mark, QP p2 / MS p6; prophase or metaphase accepted*; the paused model's replicated chromosome brightens. Row 3 is revealed with it (not narrated): **stage photographs, multiple choice** · *s20_12 Q21 (Paper 1), key A*.
4. At *The scheme credits the stage name*, the answer line **metaphase** is outlined as the mark-scheme answer; at *It doesn't need your evidence*, a small panel labelled **beyond the mark scheme** opens beneath it: *evidence: chromosomes across the equator*.
5. At *The reject card*, the reject card lands beside the image, struck through by hand: **✗ no chromosomes are visible, so this cell is in interphase** / **✓ a clearly resolved single nucleus with diffuse chromatin supports interphase; if the image does not allow it, say so**, caption in small type *our wording contrast; not an examiner-reported error*.
6. At *And the hook?*, the Beat 1 plant model returns small, paused, beside `PM-HIGH`; at *by its chromosomes*, one ringed cell in `PM-HIGH` is labelled **anaphase — two groups towards opposite poles**. **Exit cue: end of *by its chromosomes*.** Final frame held 2 s: forms at left, image and reject card at right. No slogan. This 2 s hold is **added to** the 11:26.5 word ledger (round-1 check SF7), not reserved within it.

**On-screen text:** the three forms with citations; *beyond the mark scheme*; the reject card and its caption.

---

## Datasets

### Dataset 1 — `FieldOfViewSchematic`, counts from the schematic field (Beats 14–16)

Counts of **our drawn schematic field**, teaching data; not a photomicrograph and not measured data. Count **cells**, not nuclei or chromosome groups; a still-undivided telophase cell counts once.

| stage | number of cells |
|---|---:|
| interphase | 51 |
| prophase | 4 |
| metaphase | 2 |
| anaphase | 1 |
| telophase | 2 |
| **total** | **60** |

Derived (every number worked):
- Total: 51 + 4 + 2 + 1 + 2 = **60**. Row check: 5 + 7 + 8 + 10 + 10 + 8 + 7 + 5 = 60 cells in the field.
- Cells in mitosis: 4 + 2 + 1 + 2 = **9**.
- **Mitotic index = 9 ÷ 60 = 0.15 → 0.15 × 100 = 15 %** (labelled *calculated*). Denominator: all 60 cells counted, never the 9.
- Interphase: 51 ÷ 60 = 0.85 → **85 %** (on screen only, small).
- Check: 9 + 51 = 60; 15 % + 85 % = 100 %.
- No stage duration is calculated (not evidenced; an invented field cannot give one).

No other number is shown as data. The 2:00, 5:00 and 15:00 timers are method timings from the SAPS recipe, not results. The 3 mm scale bar is the recipe's cut length.

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.23 and practical skills) | Beat(s) | How |
|---|---|---|
| interpret **photomicrographs** … of cells in different stages | 1, 8, 9, 10, 11, 12, 16, 17 | open-asset image set (`PM-*` frames; placeholder until attached); decision sequence run on cells in the image |
| interpret **diagrams** | 3, 11, 13 | `MitosisCellModel` plant states paused as diagram references; E5-05 on diagram cells |
| interpret **microscope slides** | 4–8 | the SAPS root-tip squash demonstrated; low power then high power |
| **identify the main stages of mitosis** | 3, 9–13, 17 | prophase, metaphase, anaphase, telophase from arrangement; interphase and "cannot be justified" as outcomes too |
| 1.1.1 temporary preparations (p15), applied | 5–7 | acid, cut, stain, tease, coverslip, vertical press; demonstration only (p51: demonstrations are outside the suggested hands-on allocation) |
| p54 counting numbers of cells (direct basis); p61 percentages (additional Paper 5 support) | 14, 15 | 60-cell schematic field; mitotic index 15 % |

### Mark-scheme and examiner points → beats

| Source | Point | Beat |
|---|---|---|
| s21_22 Q1(a)(i), QP p2 / MS p7 (PDF-VERIFIED, A15; re-verified in round-1 check) | E metaphase, F anaphase; "R more than one stage given for either E or F" | 13, 17 |
| w22_23 Q4(a)(i), QP p10 / MS p14 (verified summary, A16; PDF-VERIFIED (round-1 check)) | A metaphase, B anaphase, 2 marks | 17 |
| w20_21 Q1(a)(ii), QP p2 / MS p6 (verified demand; PDF-VERIFIED (round-1 check)) | stage of a pictured duplicated chromosome; prophase/metaphase accepted | 17 |
| s21_22 Q1(a)(iii), QP p2 / MS p7 (verified demand, mixed Topic 1/5; PDF-VERIFIED (round-1 check)) | plant tissue with a reason (cell walls/regular shape or cell plate/no cleavage furrow) | not narrated; the plant cell wall and cell plate are labelled in Beats 3 and 9 |
| s21_22 Q1 (verified demand, A03 context; PDF-VERIFIED (round-1 check), QP p2 Q1(a)(ii)) | its question says the microtubules are not visible | 10 (small type) |
| s20_12 Q21, key A (verified key; PDF-VERIFIED (round-1 check), QP p9 / MS p2) | stage photographs (spindle-block effect; shared with 5.2.1) | 17 (row 3, not narrated) |
| G05 summary and check | "Identify a mitotic stage from chromosome evidence"; "Commit to a stage supported by chromosome arrangement; two incompatible guesses do not establish identification." | spine; 11; 13 |
| G05 checkpoint 1 | "identify a stage from a new diagram, then identify the visible evidence supporting it" | 11, 13, 17 (the evidence is shown **beyond the mark scheme**) |
| Paper 3 (five fixed-sample pairs) | no root-tip squash or mitotic-stage count task | the demonstration and count rest on the syllabus skills; no exam claim is narrated |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, only, never, cannot, no, not, because, so, often, usually* was reread: true of all cases, or of the typical case?
- Beat 1: *A prepared slide does not move* — a prepared specimen; living-cell imaging is not the subject. *It shows many cells* — not 'hundreds' or 'every'. *An exam can hand you* — possibility, not prevalence.
- Beat 3: stage descriptions are the shared wording (SHARED-SPECS §4): *condense and become visible*; *the centromeres divide and the sister chromatids separate to opposite poles, as daughter chromosomes*.
- Beat 4: *a region of active mitosis* — not every cell; *relatively few, large chromosomes*; *root tips contain no chlorophyll, so no green pigment competes with the stain* — the plan's wording, typical of root tips; *staining alone does not identify a dividing cell* — the plan's limit sentence.
- Beat 5: *start a five-minute timer the moment they touch* — the first-contact rule; *It softens the material between neighbouring cells, which helps the stain get in and lets the cells spread* — the plan's acid sentence; no fixation claim.
- Beat 6: *toluidine blue stains skin and clothing* — the hazard sentence.
- Beat 7: *so the glass does not break* / *so the cells spread into a thin layer* — purposes of this press; *An unspread squash hides chromosomes behind other cells* — about an unspread squash.
- Beat 8: *scan for small meristem cells; these come from just behind the root cap* — the round-1 check's SAPS-based wording; no intact tip outline is promised in a squash; *cells further back divide less often, so do not assume every cell is dividing* — the plan's limit; *Here is the high-power image* — no specific real photograph is claimed; *Colours vary between preparations* — plan wording.
- Beat 9: *supports interphase* / *support telophase* — "supports", not "proves"; *often with a new cell plate* — "often", plant cells, cytokinesis commonly begins in late mitosis.
- Beat 10: *Now read the chromosome arrangement within each cell* — no one-group gate; anaphase is read as two separated groups; *may not look like the model's straight line*; *a light micrograph often does not resolve them*; *one exam question said its microtubules were not visible* — s21_22's own statement about its image, not generalised.
- Beat 11: *it is usually cleaner than a real cell* — typical; *it turns a guess into an identification* — the purpose of naming evidence (our teaching addition, shown beyond the scheme in Beats 13 and 17).
- Beat 12: *lack of visible detail alone does not prove interphase* — the plan's sentence; *Interphase needs positive evidence* — bounded by the next clause.
- Beat 13 (E5-05): *It is tempting, because this cell can sit between two pictures in your memory … can feel safe* — our teaching hypothesis, phrased as a possibility, not examiner testimony; *The mark scheme for that question* — local to s21_22; *It does not automatically cancel a correct answer for F* — the plan's corrected wording; no prevalence claim; the wrong answer is written, never spoken (the words *metaphase / anaphase* are not read as a claim; the talk-through names 'two stage names with a slash').
- Beat 14: *because you are counting cells, not nuclei* — the counting rule of this method.
- Beat 15: the interpretation paragraph is spoken verbatim from SHARED-SPECS §6 / plan §5.2.2(c) (*may contain*; *can suggest*; *approximate inference, not an exact timing law*; *this invented field*), preceded by the arithmetic.
- Beat 17: *In the papers we checked* — bounds the forms to the fixed sample; *The scheme credits the stage name* — the verified keys; *The scheme doesn't need your evidence* — the papers award no justification mark (plan).
- No sentence says every root-tip cell divides, that staining identifies dividing cells, that a spindle is always visible, that an empty-looking cell is in interphase, that the mitotic index gives stage durations, or that candidates often hedge.

---

## Citations

Every quotation in this storyboard, where it appears, the file it was copied from and its tag. Nothing is quoted from an exam PDF directly; none was opened for the first draft. The round-1 check (27 September 2026) read the original papers, mark schemes and the 2025–2027 syllabus PDF (pp15, 23, 51, 54, 61) and confirmed every quotation and exam claim below; those items are now tagged PDF-VERIFIED (round-1 check). Cambridge archive root: `/home/dachu/sme-9700-archive/pastpapers/`; one-based PDF pages.

| # | Quotation (verbatim) | Paper / session / question / page | Beat(s) | Copied from | Tag |
|---|---|---|---|---|---|
| 1 | "interpret photomicrographs, diagrams and microscope slides of cells in different stages of the mitotic cell cycle and identify the main stages of mitosis" | Syllabus 2025–2027, 5.2.2, p23 | header | `SYLLABUS-9700-DETAIL.md`; plan §5.2.2 | syllabus wording (exact per `VERIFIED-EVIDENCE.md`) |
| 2 | "R more than one stage given for either E or F" | s21_22 Q1(a)(i), QP p2 / MS p7 (`/home/dachu/sme-9700-archive/pastpapers/2021/June/9700_s21_ms_22.pdf#page=7`) | spine; 13; ledger | `work/007/VERIFIED-EVIDENCE.md` A15 | **PDF-VERIFIED (plan check)** |
| 3 | "make temporary preparations of cellular material suitable for viewing with a light microscope" | Syllabus 1.1.1, p15 | spine | `SYLLABUS-9700-DETAIL.md`; `VERIFIED-EVIDENCE.md` | syllabus wording |
| 4 | "make accurate observations from specimens including counting numbers of cells or cell organelles" | Syllabus practical skills, p54 | spine; 14 (small type) | `SYLLABUS-9700-DETAIL.md`; `VERIFIED-EVIDENCE.md` | syllabus wording |
| 5 | "carry out appropriate calculations to simplify or explain data, including means, percentages and rates of change" | Syllabus p61 (Paper 5 data handling) | spine | `SYLLABUS-9700-DETAIL.md`; `VERIFIED-EVIDENCE.md` | syllabus wording |
| 6 | "Identify a mitotic stage from chromosome evidence" | G05 summary of s21_22 Q1(a)(i) and w22_23 Q4(a)(i) | spine; ledger | `GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md` | **G05's summary**, not Cambridge wording |
| 7 | "Commit to a stage supported by chromosome arrangement; two incompatible guesses do not establish identification." | G05 proposed check | spine; ledger | G05 | **G05's authored inference** |
| 8 | "identify a stage from a new diagram, then identify the visible evidence supporting it" | G05 proposed checkpoint 1 | spine; ledger | G05 | **G05's words**; our teaching addition, not a marking point |

Values, keys and demands cited without quotation marks (PDF-VERIFIED (plan check) as keys/tariffs/demands, never quoted as wording): s21_22 Q1(a)(i) E metaphase, F anaphase, 2 marks (A15); w22_23 Q4(a)(i) A metaphase, B anaphase, 2 marks, QP p10 / MS p14 (A16); w20_21 Q1(a)(ii) 1 mark, prophase/metaphase alternatives, QP p2 / MS p6; s21_22 Q1(a)(iii) 1 mark, plant tissue with a reason, mixed; s21_22 Q1's statement that its microtubules are not visible (plan §5.2.2(a)); s20_12 Q21 key A; the Paper 3 screening result. **Round-1 check, PDF-VERIFIED (round-1 check):** s21_22 QP p2 / MS p7 Q1(a)(i) (reject line and two marks; the original photomicrograph inspected; separate E/F marking; no justification mark); s21_22 QP p2 Q1(a)(ii) (the question explicitly states its microtubules are present but not visible in the image; this does not imply microtubules are absent in plant cells); s21_22 MS p7 Q1(a)(iii) (must state plant; accepted reasons include cell walls, regular shape, no cytokinetic furrow or a cell plate; kept outside the six core marks); w22_23 QP p10 / MS p14 Q4(a)(i) (A metaphase, B anaphase, identification only; whitefish figure); w20_21 QP p2 / MS p6 Q1(a)(ii) (prophase or metaphase accepted; the MS also accepts prometaphase, which is not taught here); s20_12 QP p9 / MS p2 Q21 (key A; the drug prevents sister-chromatid separation/poleward movement); Paper 3 screening of s20_33, s21_33, s22_33, s23_34, w24_34 (transverse-section tasks only; no root-tip squash or mitotic-stage count credit; this does not support *never examined*). Tariff: 1 + 2 + 2 + 1 = 6, plus the disclosed mixed mark. **SAPS provenance (round-1 check):** [SAPS resource 1358](https://www.saps.org.uk/teaching-resources/resources/1358/a-level-set-practicals-microscopy-of-root-tip-mitosis/), student and technical sheets, version 1.1 revised 2019, downloaded by the checker: 1 M acid, 40 °C, 15-minute equilibration, five-minute treatment, terminal 3 mm, one drop of 1% stain for two minutes, rinse/transfer/press, low-to-high power; aqueous stain; acid's intercellular softening role; deep-blue chromatin. These establish protocol provenance only; they do not license any production image. The SAPS fresh-garlic method (resource 1358, student and technical sheets) is a practical source read by the plan check and held in `VERIFIED-EVIDENCE.md`; it is paraphrased into narration and rig spec, not quoted, and is not Cambridge wording.

**UNVERIFIED items** (not quoted; shown only as our framing, a placeholder, or omitted):
1. **RESOLVED 27 Sep 2026** — see the `PhotomicrographPanel` resolution paragraph and `final/CREDITS.md`. *Earlier record:* `UNVERIFIED — licensed root-tip squash photomicrograph set: source, licence, organism, stain` — every `PM-*` frame (Beats 1, 8–12, 16–17). **Open** (round-1 check M2): a production dependency listed as open assets in `work/007/ASSETS-NEEDED.md`; the asset-completion instruction in `PhotomicrographPanel` governs clearance. Its absence does not justify generating an image or dropping image interpretation; audio is not bought for Beats 8–12 until the frames exist and each beat's described features are confirmed on them.
2. `UNVERIFIED — the Topic 1 microscope component's registered name and handling spec; not in this run's inputs` — Beat 8; called *the Topic 1 light-microscope model* throughout.
3. *(first draft: UNVERIFIED — stem wording and photomicrograph of s21_22 Q1(a)(i))* — now PDF-VERIFIED in round-1 CHECK against the original papers listed below. Displayed question cards and diagram cells remain authored adaptations; Cambridge artwork is not reproduced. (Beat 13's header stays **our framing**; our diagram cells E and F are lettered to match.)
4. *(first draft: UNVERIFIED — stems, images and options of w22_23 Q4(a)(i), w20_21 Q1(a)(ii) and s20_12 Q21)* — now PDF-VERIFIED in round-1 CHECK against the original papers listed below. Displayed question cards and diagram cells remain authored adaptations; Cambridge artwork is not reproduced. (Beat 17 rows are still described by demand only.)
5. *(first draft: UNVERIFIED — the exact wording of s21_22 Q1's statement that its microtubules are not visible)* — now PDF-VERIFIED in round-1 CHECK against the original papers listed below (s21_22 QP p2, Q1(a)(ii)). Displayed question cards and diagram cells remain authored adaptations; Cambridge artwork is not reproduced. (Beat 10 still says it in our words; the exact stem wording is not quoted.)

Original papers verified by the round-1 check: `2021/June/9700_s21_qp_22.pdf` p2 and MS p7; `2022/November/9700_w22_qp_23.pdf` p10 and MS p14; `2020/November/9700_w20_qp_21.pdf` p2 and MS p6; `2020/June/9700_s20_qp_12.pdf` p9 and MS p2. Items 1 (image set licence) and 2 (Topic 1 microscope component) remain open.

---

## Word count and runtime

Counted by the validator over the blockquoted narration (silent-read and correction marker lines excluded; hyphen and en-dash compounds count once; numbers written as spoken words where they are spoken). Seconds = words ÷ 120 × 60. No silent demonstration holds are used: every lab wait is time-compressed and runs under narration, so words set the ledger. E5-05's anchored holds sit inside its 73 s at the effective rate (Beat 13 schedule). Beat 17's 2 s final hold is **added to** the ledger (round-1 check SF7).

| Beat | Title | Kind (time-plan segment) | Words | Seconds |
|---|---|---|---:|---:|
| 1 | Hook and context | teaching (framing) | 87 | 43.5 |
| 2 | What you will be able to do | teaching (framing) | 47 | 23.5 |
| 3 | Recall: what each stage looks like | teaching (interpretation) | 66 | 33.0 |
| 4 | The sample: why garlic root tips | teaching (demonstration) | 89 | 44.5 |
| 5 | Warm acid, timed from first contact | teaching (demonstration) | 85 | 42.5 |
| 6 | Cut the tip, stain it | teaching (demonstration) | 70 | 35.0 |
| 7 | The squash: a thin layer, pressed straight down | teaching (demonstration) | 80 | 40.0 |
| 8 | Low power to find the meristem, then high power | teaching (demonstration) | 84 | 42.0 |
| 9 | Count the groups, then read the arrangement | teaching (interpretation) | 71 | 35.5 |
| 10 | Read the arrangement: prophase, metaphase and anaphase | teaching (interpretation) | 81 | 40.5 |
| 11 | Diagrams, and committing to one stage | teaching (interpretation) | 70 | 35.0 |
| 12 | When the image will not tell you | teaching (interpretation) | 63 | 31.5 |
| **13** | **COMMON MISTAKE E5-05** (talk-through 95 words) | **error** | **146** | **73.0** |
| 14 | Counting a field | teaching (counting) | 72 | 36.0 |
| 15 | The mitotic index, and what it can suggest | teaching (counting) | 103 | 51.5 |
| 16 | What I told you, on the images you read | teaching (recap) | 75 | 37.5 |
| 17 | How it is asked, and the reject card | teaching (exam close) | 84 | 42.0 |
| **Teaching (16 beats)** | | | **1,227** | **613.5 (10:13.5)** |
| **Error (1 beat)** | | | **146** | **73.0 (1:13)** |
| **Total (17 beats)** | | | **1,373** | **686.5 (11:26.5)** |
| Beat 17 final hold (added) | | | — | 2.0 |
| **Total with final hold** | | | | **688.5 (11:28.5)** |
| Budget | | | ≈ 1,320 | 660 (11:00) |

Against the SHARED-SPECS §6 time plan (a feasible allocation to test):

| Segment | Beats | Planned | Delivered | Difference |
|---|---|---:|---:|---:|
| Real-image and diagram interpretation | 3, 9, 10, 11, 12 | 3:00 | 2:55.5 | −0:04.5 |
| Edited demonstration | 4–8 | 3:30 | 3:24 | −0:06 |
| Counting | 14, 15 | 1:15 | 1:27.5 | +0:12.5 |
| E5-05 | 13 | 1:10 | 1:13 | +0:03 |
| Framing, objectives, recap, exam close (with 2 s final hold) | 1, 2, 16, 17 | 2:05 | 2:28.5 | +0:23.5 |
| **Total** | 17 | **11:00** | **11:28.5** | **+0:28.5** |

**Length, honestly:** **1,373 words = 11:26.5** at 120 words per minute, plus Beat 17's 2 s final hold (added, not reserved) = **11:28.5**, **28.5 s (4.3 %) over** the 11:00 budget. The round-1 check's explicit editorial ruling accepts up to **11:29** for this draft (including the 2 s final hold); acceptance rests on that ruling, not on an assumed universal ±5 % tolerance. Teaching is 1,227 words = 10:13.5 (+23.5 s against 9:50); E5-05 is 146 words (73 s), inside 130–150, talk-through 95 words; it is not thinned; measured E5-05 timing is recorded from audio (Beat 13 schedule). The overrun sits in framing (+23.5 s including the final hold; the hook carries the standalone context and the exam close carries three forms, the beyond-the-scheme line and the callback) and counting (+12.5 s; Beat 15 speaks the SHARED-SPECS interpretation verbatim). No forced cuts are required. **Optional cut list to reach 11:00 with the additive final hold (57 words = 28.5 s needed; 58 words = 29 s listed), in order of least loss:** (1) Beat 16 *Low power to find the meristem, high power to read it.* (11 words; the thumbnails still brighten silently); (2) Beat 15 *Nine cells are in mitosis: four, two, one and two.* (10; the working stays on screen); (3) Beat 17 *another asked for the stage of one pictured chromosome* with its joining semicolon (9; row 2 stays on screen unnarrated); (4) Beat 1 *When we looked at chromosome behaviour, you watched the stages move.* (11; the recall tag stays); (5) Beat 10 *and one exam question said its microtubules were not visible* (10; its small-type note stays); (6) Beat 4 *Why root tips?* (3; the zoom moves to the next cue); (7) Beat 12 *Real images have limits.* (4; its hold of `PM-HIGH` moves to *Cells overlap*). All seven: 1,315 words = 10:57.5 + 2 s hold = **10:59.5**. Each cut removes its cue and moves the visual to the neighbouring cue; none touches E5-05, the method, the REAL-WORLD SAMPLES answers or the counting rule.

---

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| The full stage-by-stage behaviour of chromosomes, envelope, membrane and spindle, animal and plant; the count strip; E5-03, E5-04 | 5.2.1 (recalled by label in Beat 3) |
| Replication in the S phase of interphase; the DNA-content graph; the wheel's motion | 5.1.3 (wheel thumbnail only, Beat 15) |
| Why mitosis gives identical cells; root growth as a context | 5.1.2 |
| Microscope parts, magnification, calibration, drawing conventions | Topic 1 (1.1.1–1.1.4), by labelled recall only |
| Stage durations from counts; statistical tests on stage counts; a numerical mitotic-index lesson | not taught (calibration DO-NOT-ADD; the invented field cannot support durations) |
| Other stains (orcein, Feulgen) and other acid recipes | not used (SAPS method only; no alternative stain as a colour standard) |
| Meiosis stage identification | 16.1 (no meiosis comparison here) |
| s21_22 Q1(a)(iii)'s plant-tissue reason as a spoken item | mixed Topic 1/5; cell wall and cell plate are labelled on screen only |

## Reusable models established here

| Model | Specified | For |
|---|---|---|
| **`RootTipSquashRig`** (`grow`, `prewarm`, `dip` with the treatment timer starting on the first-contact frame, `rinse`, `cut`, `stain` with the 2:00 timer and staining starting on the first-contact frame, `rinse-stain` aspirating at the watch-glass edge into a waste receptacle, `transfer`, `tease`, `coverslip`, `press` straight down through paper towel, `view`) | here | none downstream in this topic; recalled by label only (e.g. 5.1.2's root-tip context) |
| **`FieldOfViewSchematic`** (60 cells, rows 5/7/8/10/10/8/7/5; 51/4/2/1/2 with fixed addresses; counting boundary; results table; mitotic index 15 %, *calculated*) | here | none downstream |
| **`PhotomicrographPanel`** frame spec and the `PM-*` frame list | here | any later lesson that shows the licensed set, by the same frame ids |
| **`DecisionStrip`** (four steps; step 4 always carries *or say so*) | here | 5.2.2 notes and questions |
| `MitosisCellModel` plant states, paused as diagram references; `renderStyle: toluidine-blue-schematic` inside the field (to be registered in 5.2.1) | 5.2.1 (published there) | used here |

---

## Assets

| Asset | Status | Source |
|---|---|---|
| **Root-tip squash image set** (`PM-LOW`, `PM-HIGH`, `PM-PRO`, `PM-MET`, `PM-MET-ANGLE`, `PM-ANA`, `PM-TEL`, `PM-UNCLEAR`, plus the Beat 12 detail-poor cell) | **RESOLVED 27 Sep 2026**: 7 licensed CC0 frames + 3 unlabelled drawings (`PM-MET-ANGLE`, `PM-TEL`, `PM-UNCLEAR`), `sme-9700-archive/assets/topic-05/final/` (was: open assets; not held) | `UNVERIFIED — licensed root-tip squash photomicrograph set: source, licence, organism, stain`; specified in `work/007/ASSETS-NEEDED.md` (for merge into `work/007/ASSETS-NEEDED.md`); sourced and licensed, **never generated**; fallback only by conductor approval: a labelled drawing captioned as such; placeholder frames until recorded; completion per the `PhotomicrographPanel` asset-completion instruction (round-1 check M2) |
| `RootTipSquashRig` SVGs with named states; hands (gloved), clove holder, timers, scale bar, press inset | **new build** | authored; handling specified; rendered still-frame verification pending (clove supported, acid container in the bath, dispensing tip above, separate aspirating pipette at the watch-glass edge emptied into the labelled waste receptacle, blade on the tile, coverslip lowered edge-first, thumb vertical); prop adaptations to be checked for stable support and safe handling |
| `FieldOfViewSchematic` and results table | **new build** | authored, teaching data; captions fixed |
| `PhotomicrographPanel`, `DecisionStrip` | **new build** | authored |
| `MitosisCellModel` plant variant (stage states, motion, paused states) | reuse | 5.2.1 |
| `CellCycleWheel` thumbnail | reuse | 5.1.3 |
| The Topic 1 light-microscope model | reuse by labelled recall | Topic 1 (`UNVERIFIED` component name) |
| Objectives pictograms (magnifier-over-cell, pointer, slide-and-coverslip, tally marks, percent); safety pictograms and tags; E5-05 card and header; forms surface; reject card; COMMON MISTAKE panel | new card content; shared panel and surfaces | authored; panel shared |
| Generated images; Cambridge artwork or photomicrographs | **none** | — |

---

## Validator run

`python3 work/007/validate_storyboard.py storyboards/topic-05/5.2.2/STORYBOARD.md`

```
beat  words  cues maxgap  status
   1     87     9     22  ok  
   2     47     5     12  ok  
   3     66     9      9  ok  
   4     89    12     11  ok  
   5     85    11     11  ok  
   6     70    10     12  ok  
   7     80    12     10  ok  
   8     84    12     15  ok  
   9     71    11     12  ok  
  10     81    10     14  ok  
  11     70    10     11  ok  
  12     63     8     12  ok  
  13    146    17     18  ok  talk-through 95 w
  14     72    12     16  ok  
  15    103    12     20  ok  
  16     75     9     11  ok  
  17     84     9     27  ok  
TOTAL words 1373  cues 178  runtime at 120 wpm 11:26.5  beats 17  failing beats 0
```

`python3 work/007/check_quotes.py storyboards/topic-05/5.2.2/STORYBOARD.md`

```
quotes checked 15  not found 0
```

Both re-run after the round-1 fixes and after pasting this section; outputs unchanged. (The round-1 checker's checkout lacked `cloud-inputs/007/evidence/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md`, so its `check_quotes.py` run failed with FileNotFoundError; in this checkout the file is present and the script runs to completion.) The validator does not detect logic errors such as the round-1 one-group gate or the aspiration rule; those were repaired by reading.

---

## CHECK RESPONSE (round 1)

Response to `cloud-checks/007/round-1/5.2.2/CHECK.md` (verdict NOT CLEARED) and the round-1 README's cross-cutting rules. Narration changed only in Beats 8, 10 and 11 (1,374 → 1,373 words). Replacement texts marked *verbatim* are the checker's own wording, copied without quotation marks.

| Item | Ruling | Where applied | Exact action taken |
|---|---|---|---|
| **M1** Remove the one-group gate | applied verbatim | causal spine; `DecisionStrip`; Beat 10 title, narration, action 1; absolutes sweep; word table | Spine sentence beginning *Within one group…* replaced verbatim (*Use chromosome arrangement as well as the number and positions of groups: … support telophase.*). DecisionStrip step 3 replaced verbatim (*3 · chromosome arrangement: dispersed condensed chromosomes → prophase; …*). Beat 10 title → **Read the arrangement: prophase, metaphase and anaphase**. Opening sentence *Within a cell with one group, read the arrangement.* → *Now read the chromosome arrangement within each cell.* (9 → 8 words). Action 1 replaced verbatim; cues *Now read the chromosome arrangement* and *within each cell*. |
| **M2** Real specimens before clearance | applied (instruction verbatim); dependency remains open | `PhotomicrographPanel` (new *Asset completion* paragraph, frame table, detail-poor cell row); Build position; Beats 8, 11, 15, 16; Citations UNVERIFIED 1; Assets; `work/007/ASSETS-NEEDED.md` | Asset completion instruction inserted verbatim. `PM-LOW` spec now requires small meristem cells, cap labels only if retained. Beat 12's detail-poor cell added as an identified cell in `PM-HIGH` (or crop `PM-PALE`). Open-asset list written to `work/007/ASSETS-NEEDED.md`. Per the README, no real photograph is described as held: Beat 8 *Here is a real photomicrograph* → *Here is the high-power image*; Beat 11 *the matching real cells* → *the matching cells in the image*; visual *real crop* → *image crop*. Source/licence/organism/stain left open, not invented. Topic 1 component remains open. |
| **M3** Stain timer at first contact | applied verbatim | rig `stain` state; Beat 6 actions 4–5 | `stain` state, action 4 and action 5 replaced verbatim; the gloved hand, above-tip dispensing and intensity-only colour change are kept as parenthetical rig detail. Acid first-contact contract unchanged. |
| **M4** Dispensing vs aspiration | applied verbatim | rig Handling; rig parts; `rinse-stain`; Beat 6 action 6; Assets; Reusable models | Handling dropper sentence replaced verbatim (*To dispense stain or water, hold the dispensing tip above … do not aspirate them.*). Parts: separate **pipette with a bulb** and labelled **waste receptacle** added. `rinse-stain` and Beat 6 action 6 rewritten to compress-before-immersion, aspirate at the watch-glass edge away from the tips, empty into the waste receptacle, repeat after rinse water. |
| **SF1** Microscopy after squashing | applied | Beat 8 narration and actions 2–3, on-screen text; Beat 15 action 6; Beat 16 action 3; absolutes sweep | Second sentence → *At low power, scan for small meristem cells; these come from just behind the root cap.* (17 → 16 words). Cues *scan for small meristem cells*, *just behind the root cap*. Cap/meristem anatomy shown on the Beat 4 intact-root schematic; cap labels on `PM-LOW` only if genuinely retained. Beat 15's *fewer dividing cells* tag moved from `PM-LOW` to the intact-root schematic. |
| **SF2** Protocol provenance | applied | rig heading and new provenance paragraph; Build position; Assets | *the SAPS fresh-garlic method, no splicing* replaced with the checker's sentence (italic-free, no quotation marks), plus a note naming the SAPS apparatus (cocktail stick, scissors, nested beaker/bijou) versus our adaptations. |
| **SF3** Objectives entry | applied verbatim | Beat 2 visual action | Sentence added; actions 1–3 now say each line *enters beside* its already-visible pictogram. |
| **SF4** Register the stain-colour variant | applied here; registration in 5.2.1 flagged | `MitosisCellModel` section; `FieldOfViewSchematic`; Reusable models | Sentence added verbatim; *real-stain rendering option* renamed `renderStyle: toluidine-blue-schematic`. 5.2.1 not edited (outside this task); conductor to register it there. |
| **SF5** Clear stale PDF flags | applied | Citations UNVERIFIED 3–5 (historical wording kept in italics), intro and values paragraph; mark-scheme ledger; Beat 10 action 7; Beat 13 action 2; Beat 17 action 2; Authorities note | Each item now reads *PDF-VERIFIED in round-1 CHECK against the original papers listed below. Displayed question cards and diagram cells remain authored adaptations; Cambridge artwork is not reproduced.* Original papers/pages and SAPS provenance listed, tagged PDF-VERIFIED (round-1 check). Items 1–2 kept open. |
| **SF6** E5-05 timing reproducible | applied | Beat 13 actions 8, 9, 11; new *E5-05 timing schedule* paragraph | 60.41 s speech at 145 wpm + 4 s read + 8.59 s anchored holds = 73.00 s; holds 2.0 s (E box) + 2.0 s (E/F boxes) + 1.7 s (single-stage evidence comparison) = 5.70 s in the talk-through (39.31 + 5.70 = 45.01 s); 2.89 s on the completed frame. Measured audio to be checked. No narration change. |
| **SF7** Final-hold accounting | applied | Beat 17 action 6 and heading; beat-by-beat intro; runtime section | Stated that the 2 s final hold is **added**: 11:26.5 + 2 s = 11:28.5, within the checker's 11:29 acceptance. |
| **Length** | applied | word table, segment table, beat windows, *Length, honestly*, cut list | 1,373 words = 11:26.5 (+2 s hold = 11:28.5). Teaching 1,227 = 10:13.5; E5-05 146 (95 talk-through). Beat windows recomputed from Beat 8 on. Optional cut list extended with (7) Beat 12 *Real images have limits.* so the seven cuts (58 words) reach 10:59.5 including the additive hold. No forced cuts. |

## CHECK RESPONSE (round 2)

Round-2 verdict: **CLEARED WITH MINOR EDITS (edits applied)**.

| Item | Ruling | Where applied | Action taken |
|---|---|---|---|
| Remaining minor edit — SF4 owner/consumer agreement | applied in the owner (5.2.1) and SHARED-SPECS, verbatim; 5.2.2's field-only rule kept unchanged | 5.2.1 *Render styles* paragraph; SHARED-SPECS bullet | As the check directs; the historical round-1 response is not rewritten. No narration change. |

Validator and quote check re-run after the edits: see *Validator run* (refreshed).
