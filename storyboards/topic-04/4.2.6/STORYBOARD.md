# 4.2.6 — Water, plant cells and animal cells

**Storyboard, first draft with round-1 check fixes applied. Cloud run 006, 27 September 2026.** No audio, no code, no render. Folder `storyboards/topic-04/4.2.6/`.
Cambridge 9700 syllabus 2025–2027, p.22. Command word **EXPLAIN** (twice: the movement of water in water-potential terms; the different effects on plant and animal cells). Budget from `TOPIC-PLAN-04-MEMBRANES.md` §4.2.6 and lesson list and `TOPIC-04-WEIGHTS.md` (4.2.6 row): **8:15 = teaching 8:15 + no error allowance; 11 teaching beats, 0 error beats** (120-wpm timing equivalent about 990 words, not a quota); delivered here as **11 beats (11 teaching + 0 error)**. Direct exposure 0/5 in the cited Paper 2 blocks; adjacent W20/21 Q4(b)(ii) and W20/51 Q1(c)(ii). Runtime estimated at **120 words per minute of final video** (words ÷ 120).

> **4.2.6** explain the movement of water between cells and solutions in terms of water potential and explain the different effects of the movement of water on plant cells and animal cells (knowledge of solute potential and pressure potential is not expected)

(syllabus p.22; the bracketed exclusion is Cambridge's own. The component potentials are never named, symbolised or calculated in this lesson; "the wall resists expansion" and "the cell's water potential rises" carry the plant-cell account.)

**Authorities read, in full:** `work/006/SHARED-SPECS.md` (binding; §2 hard rules, §3 layout, §4 `WaterPotentialModel` and `CellOsmosisSet`); `plan/topic-04/TOPIC-PLAN-04-MEMBRANES.md` (scope and evidence rules, timing MF7, motion and visual-integrity paragraphs, REAL-WORLD SAMPLES rule, §4.2.1 osmosis with the MF3 sentences, §4.2.6 in full with the MF3 equilibrium paragraph and the MF6 saline sentence, lesson list and build order, shared-model table, traps table, UNVERIFIED register, PLAN-CHECK RESPONSE); `plan/topic-04/TOPIC-04-WEIGHTS.md` (4.2.6 row and paragraph, ledger row W20/21 Q4(b)(ii), supplementary S-B, error register and evidence-gaps paragraph); `cloud-inputs/003/standards/VIDEO-STRUCTURE.md` (all); `CONTENT-ARCHITECTURE.md`; `SYLLABUS-9700-DETAIL.md` Topic 4 (outcomes and introduction pp.21–22; apparatus p.57; materials p.58; mathematical requirements p.63); the cleared examples `cloud-inputs/006/examples/3.1.3/STORYBOARD.md` and `3.2.1b/STORYBOARD.md`; `cloud-inputs/003/topic-03/3.1.1-2/CHECK.md` and `3.2.2-3/CHECK.md`; the plan check `cloud-checks/006/plan/CHECK.md` on `origin/cloud/006-checks` (MF3, MF6, should-fix 5, 4.2.6 ruling row); `cloud-inputs/006/evidence/GATE-CRITERIA-9700-04-CELL-MEMBRANES-AND-TRANSPORT.md` (G04: the W20/21 phloem row and the "no complete rubric for every cell state" limit) and `EXAMINER-INSIGHT-9700.md` (nothing on 4.2.6 found). **No question paper, mark scheme or examiner report PDF was opened; none is available in this run.** No exam wording is quoted in this lesson (see *Citations*).

**Build position:** sixth of the ten Topic 4 lessons: 4.1.1-2 → 4.1.3 → 4.1.4 → 4.2.1a → 4.2.1b → **4.2.6** → 4.2.2a → 4.2.2b → 4.2.3-4 → 4.2.5. Built before the practicals that observe its cell states (4.2.2b red onion; 4.2.5 potato inset).

**Models used:** `WaterPotentialModel` (published by 4.2.1a; base two-compartment state recalled by label, `recall: 4.2.1a`); `FluidMosaicMembrane` (4.1.1-2; state `full`, one small zoom inset only, Beat 4). **Models published or extended here:** `WaterPotentialModel` state **`cell-vs-solution`** (added here, with its equilibrium sub-state `cell-vs-solution:equalise`); **`CellOsmosisSet`** with the eight shared states, plus local equality/compatibility states specified here (shared: `plant-turgid`, `plant-equal`, `plant-flaccid`, `plant-plasmolysed`, `rbc-normal`, `rbc-swelling`, `rbc-haemolysed`, `rbc-crenated`; local equality/compatibility: `rbc-equal`, `plant-turgid-equilibrium` (compatibility alias of `plant-turgid`); lesson-local transition, listed separately: `plant-taking-up-water`); layout **`comparison-board`** (the two-row, three-column board that the recap returns to). Everything drawn is a MODEL: cells carry *schematic; not to scale*; particle fields carry *particles drawn schematically; not to scale; far fewer than real*.

---

## The causal spine

One idea carries the lesson: **water moves by osmosis down the water-potential scale, and the outcome for a cell is set by how the solution's water potential compares with the cell's at the start, and by whether a cell wall resists the swelling.**

> **Net movement of water between a cell and a solution is from the higher to the lower water potential, through the partially permeable cell surface membrane, while water still crosses both ways. When the solution's water potential is initially higher, water enters: a red blood cell, with no wall, swells and may burst (haemolysis); a plant cell swells until the protoplast presses on the wall, becomes turgid, and does not burst, because the wall resists expansion and the cell's water potential rises until it equals the solution's. When the water potentials are equal there is no net movement: that fixes no particular shape. When the solution's water potential is initially lower, water leaves: the red blood cell becomes crenated; the plant cell becomes flaccid and then plasmolysed, the gap between wall and membrane filling with external solution through the freely permeable wall.**

**What the mark schemes credit, quoted:** nothing is quoted, because nothing in the verified list is about 4.2.6. The weights record **0/5 direct** exposure in the cited Paper 2 blocks. Adjacent evidence, used only as our paraphrase with its citation: **W20/21 Q4(b)(ii), MS p.10**, a five-mark phloem mass-flow explanation containing water-potential/osmosis points (not five marks solely for osmosis); **W20/51 Q1(c)(ii), QP p.5 / MS p.9**, 3 marks for a labelled downward-trending sketch and identifying its zero-mass-change intercept as the estimate (the no-net-change interpretation, in a red pepper practical context). G04's limit stands: *the citations do not supply a complete rubric for every named cell state*. The spine is therefore built from the syllabus wording (p.22) and the plan's MF3 sentences, and the exam close is labelled **syllabus-based**.

**The handle:** *water runs downhill on the water-potential scale* (the scale is on screen from Beat 3; "down a water-potential gradient" is itself the subject's language, so the image is safe). Converted at once, in Beat 3: *osmosis is the net movement of water molecules from a region of higher water potential to a region of lower water potential, through a partially permeable membrane*. The handle is never the exam answer; it returns in Beat 8 only as the cell's marker climbing the scale to meet the solution's.

**Framing (why it exists):** every cell is wrapped in a partially permeable membrane and cannot simply stop water crossing it, yet it works properly only within a range of water content; plants use turgor to hold soft tissues firm (the lettuce), and animals keep the water potential of the fluid around their cells controlled (the isotonic saline example). Said in Beats 1, 4, 6 and 7.

**Typicality rules applied.** Every higher/lower comparison is the **solution's** water potential against the **cell's**, labelled *initially*. "Pure water at atmospheric pressure is the reference" and "the solutions in this comparison have negative values" (MF3), never an unconditioned "pure water has the highest water potential" or "all solutions are negative". A red blood cell "swells and may burst"; it bursts **in pure water** in our shown case (a solution only slightly higher may leave it swollen but intact: small type). **Haemolysis** is the red-blood-cell term; other animal cells may lyse without that name (small type). Equal water potentials mean **no net movement only**: not a flaccid cell, not equal solute concentrations, and not a particular red-blood-cell shape (the red blood cell stays unchanged "because it started normal"). Plasmolysis "often" starts at the corners. The lettuce shows turgor returning, "not a water-potential measurement". Reasons for any slip are not narrated (no error beat). "Concentration of water" is never used; osmosis is always in water-potential terms; ψs, ψp, solute potential and pressure potential are never named; "the wall resists expansion" and "the cell's water potential rises" are said.

**Error beats:** **none** (weights register: no evidenced error for 4.2.6; "concentration of water" and "plant cells burst" are author traps, handled by correct modelling, not by an error beat). Beat 11's reject card is captioned as **our wording contrast**, not a scheme reject line.

---

## The models, specified once

Orientation and colour roles follow SHARED-SPECS §4. In this lesson the membrane in `WaterPotentialModel` is drawn **vertically, its normal horizontal** (plan should-fix 2), the solution on the **left**, the cell on the **right**; it is labelled **cell surface membrane** and carries a small rotated-orientation tag *membrane rotated: solution (outside the cell) to the left, cell contents to the right*. Cell drawings in `CellOsmosisSet` sit inside a surrounding solution with the membrane all round, so "outside" is simply the bath; no carbohydrate chains are drawn at this scale.

### `WaterPotentialModel` (published by 4.2.1a; state `cell-vs-solution` added here)

**Base (recall, identical to 4.2.1a):** two compartments separated by a partially permeable membrane strip (a short bilayer segment with gaps that only water passes **in this model**; small type *model simplification: only water tokens cross here*); left compartment fewer solute tokens, right more. Beside it a vertical **water-potential scale**: **0 kPa (pure water at atmospheric pressure)** at the top, *more negative* downward, **no other numbers**. Labels *initially: higher water potential (less negative)* on the left and *initially: lower water potential (more negative)* on the right. Water tokens (small pale blue circles) move randomly and cross both ways; a **crossing counter** reads *left → right: n · right → left: m*; a **net arrow** points towards the lower water potential, labelled *net movement of water by osmosis*. **When the water potentials become equal, the net arrow fades while crossings continue** (the counter's two numbers run level). Captions *schematic; not to scale* and *particles drawn schematically; not to scale; far fewer than real*.

**State `cell-vs-solution` (added here):** the right compartment becomes a **cell outline** (a red blood cell's or a plant cell's, per beat, drawn as the matching `CellOsmosisSet` state at small scale); the left compartment is the **surrounding solution**. The counter relabels to *solution → cell: n · cell → solution: m*. The comparison label reads *initially: solution's water potential higher than / equal to / lower than the cell's*. Two markers ride on the scale: **solution** (open ring) and **cell** (filled dot), placed by position only (no values). A small type line *solution volume large; its water potential treated as unchanged (model assumption)* sits under the left compartment. In the plant case only, a **cell wall** is drawn on the solution side of the membrane as an open-mesh outline; every token (water and solute) passes through the mesh freely; tag *cell wall: freely permeable*.

**Sub-state `cell-vs-solution:equalise`:** During `cell-vs-solution:equalise`, water crosses both ways with an imbalance that decreases as the cell's water potential approaches the solution's. The counters are explicitly **crossings per model-time window**, not cumulative totals. For the higher-external-water-potential example, use 15/5 → 13/7 → 11/9 → 10/10, with net inward values 10 → 6 → 2 → 0. Only at equality do average inward and outward rates balance. The net arrow shortens with the imbalance and disappears as the markers meet; balanced molecular crossings continue afterwards. Model time is schematic and compressed, not experimental timing.

**Motion contract:** In all intact-cell states, water tokens cross the cell surface membrane in both directions; the difference between the two fluxes determines net movement. In `rbc-haemolysed`, the membrane is ruptured: remove the osmosis net arrow and crossing counter, disperse the contents through the opening, and do not retain a closed-cell water-potential comparison for that ghost. Retained initial-condition labels describe the cause of the event, not the ghost's current osmotic state. (Unchanged from the draft: water tokens jitter and drift; the net arrow's length follows the counter difference; solute tokens do not cross the membrane in this model; nothing is cut between stills.)

### `CellOsmosisSet` (published here; reused by 4.2.2b and 4.2.5)

Captions on every frame that shows the set: *schematic; not to scale; cells drawn at similar sizes for comparison*, *particles drawn schematically; not to scale; far fewer than real*, and on every state change *time compressed; schematic*. Colour roles: cell surface membrane and tonoplast warm amber thin lines (the phospholipid-head role); water tokens pale blue circles; dissolved substances inside cells violet ion tokens with + or − (tag on first use *cell contents: many dissolved substances, drawn schematically*); the **plant cases' external solution** sucrose tokens (orange double-hexagons, tag *sucrose solution*); the **red-blood-cell cases' external solution** violet ion tokens (tag *sodium chloride solution*), pure water drawn with water tokens only. Red blood cell drawn in its own red; plant cytoplasm very pale grey-green, vacuole sap colourless-pale, nucleus grey; cell wall a thick pale grey-green outline with a fine mesh texture (tag *cellulose cell wall*). No chloroplasts are drawn (small type *generalised plant cell*).

**Plant cell parts (labelled on first appearance, Beat 7):** **cellulose cell wall** (thick outline), **cell surface membrane**, **cytoplasm**, **nucleus**, **large vacuole**, **tonoplast**; bracket **protoplast = the cell surface membrane and everything inside it**. Rest geometry: wall a rounded rectangle, width 1.00 × height 0.70 (model units).

| State | Geometry and motion | Label (initial condition and current state, as applicable) |
|---|---|---|
| `plant-equal` (**also the starting geometry for all three plant cases**) | protoplast pressing gently on the wall along its whole length; vacuole about 70% of the cell's area; wall at rest outline; crossings balanced, no net arrow | before immersion: *starting cell (from a watered plant)*; in the equal case: *initially: solution's water potential equal to the cell's · no net movement · unchanged* |
| `plant-taking-up-water` (**lesson-local transition**) | vacuole enlarges, protoplast presses increasingly against the resisting wall, cell water-potential marker rises, inward and outward crossings progressively approach balance. Net inflow is present only while the water potentials differ. (Geometry: over 3 s the vacuole grows towards about 80% of the area; the wall bulges outward very slightly, at most 2% of its width, at mid-side; the net arrow into the cell shortens with the imbalance, per `cell-vs-solution:equalise`) | *initially: solution's water potential higher than the cell's* · **becoming more turgid; water uptake in progress** |
| `plant-turgid` (**canonical shared endpoint**) | protoplast pressed firmly against the wall; water potentials equal; no net arrow; water molecules continue crossing both ways at equal average rates. (Geometry: the end of `plant-taking-up-water`, vacuole about 80%, wall bulge at most 2%; the cell's content tokens stay denser than the solution's, small type *equal water potentials; the solutions inside and outside need not match*) | **turgid · water potentials now equal · no net movement** |
| `plant-turgid-equilibrium` | compatibility alias of `plant-turgid`, with exactly the same geometry, flux and labels | *turgid · water potentials now equal · no net movement* |
| `plant-flaccid` | net water-token exit; over 2.5 s the vacuole shrinks to about 55%; protoplast still touching the wall but no longer pressing (the wall returns to its rest outline); net arrow out | *initially: solution's water potential lower than the cell's · net water loss · flaccid* |
| `plant-plasmolysed` | continues from `plant-flaccid`: over 3 s the cell surface membrane pulls away from the wall, first at the corners, then along the sides; the protoplast rounds, occupying about 45% of the wall's area; the tonoplast follows the shrinking vacuole inside it; **external solution tokens (sucrose double-hexagons and water) pass through the wall mesh and fill the gap** (motion); the wall keeps its shape | *plasmolysed · cell surface membrane pulled away from the wall · gap: external solution (entered through the freely permeable wall)* |
| `rbc-normal` (**starting geometry for all three red-blood-cell cases**) | biconcave disc: face view (circle with a paler centre) and side view (dumbbell profile), side by side; no nucleus drawn | *red blood cell (starting cell)* |
| `rbc-equal` | `rbc-normal` geometry held; crossings balanced both ways; counter level; no net arrow | *initially: solution's water potential equal to the cell's · no net movement · unchanged in this comparison* |
| `rbc-swelling` | net water-token entry; over 3 s the side-view profile loses its concavity and the face view's pale centre fills; the cell approaches a sphere | *initially: solution's water potential higher than the cell's (pure water) · net water entry · swelling* |
| `rbc-haemolysed` | continues from `rbc-swelling`: a gap opens in the stretched outline (1.0 s); red contents disperse outward into the water as a thinning red cloud of tokens (1.5 s); a faint empty membrane outline remains; small type *schematic; in a solution only slightly higher, a red blood cell may swell without bursting* | *haemolysis (the red-blood-cell term; other animal cells may lyse without that name)* |
| `rbc-crenated` | net water-token exit; over 3 s the cell shrinks to about 75% of its face area and its outline develops 10–12 blunt points | *initially: solution's water potential lower than the cell's · net water loss · crenated* |

**Layout `comparison-board` (published here):** a two-row, three-column board, rows **red blood cell** and **plant cell**, columns **initially higher**, **initially equal**, **initially lower** (column headers carry the full wording *initially: solution's water potential higher than / equal to / lower than the cell's*). Each cell state, once shown at centre, shrinks into its slot and holds there. Plant/higher slot holds the canonical `plant-turgid` endpoint (no net arrow); plant/lower slot holds `plant-plasmolysed`, labelled **with sufficient further water loss: plasmolysed**, with a small `plant-flaccid` thumbnail before it; red-blood-cell/higher slot holds `rbc-haemolysed` with a small `rbc-swelling` thumbnail before it (tagged **water entered before haemolysis**) and the tag *in pure water*; the ghost carries no net arrow or counter. The `WaterPotentialModel` scale stays at the board's left edge.

**Handling:** no apparatus is handled in this lesson. The one handled object is the hook's lettuce leaf: a hand lowers a limp leaf flat into a bowl of cold water (leaf held by its base, fingers above the water line, the leaf entering below the surface; no pour). A small unnumbered time-passing graphic (no elapsed-minute figures) starts on the rendered frame on which the leaf first touches the water and is never reset; caption *time compressed; our example; nothing measured*. Rendered still-frame verification pending.

---

## Beat by beat

Beat windows in the headings are provisional and follow the per-beat ledger (words ÷ 120); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch over 30 words without a stated visual change. The narration ledger excludes two separately scheduled holds: 1.5 seconds after Beat 9's narration on the labelled plasmolysis gap, and 2 seconds on Beat 11's final frame. Recap highlights and settling otherwise occur within its allocated beat time. All holds remain anchored to the displayed cells and labels.

### BEAT 1 · Hook and context · 0:00–0:35

**Narration:**
> Ever wondered why a limp lettuce leaf goes crisp again after a while in cold water, while a red blood cell dropped into pure water swells and bursts? Both start the same way: water moving into cells. Whether a cell swells, stays the same or shrinks depends on the solution around it, and on one structure that the lettuce's cells have and a red blood cell lacks: a cell wall.

**Visual action:**
1. **From the first frame**, a limp lettuce leaf (drawn, drooping, pale green) held above a bowl of cold water sits at left, and at right a single red blood cell (`rbc-normal`, face and side views) sits in a small beaker of pure water; the hook question is a compact caption between them, never alone on the frame. At *a limp lettuce leaf goes crisp*, the hand lowers the leaf flat into the bowl; the small unnumbered time-passing graphic beside the bowl (no elapsed-minute figures) starts on the rendered frame the leaf first touches the water (caption *time compressed; our example; nothing measured*); the leaf gradually stiffens and lifts at its edges.
2. At *a red blood cell dropped into pure water*, the right-hand cell plays `rbc-swelling` into `rbc-haemolysed` (motion; caption *schematic*).
3. At *Both start the same way*, a pale blue arrow tagged **water in** points into the still-stiffening leaf, and a small swelling-stage thumbnail of the red blood cell appears beside its ghost. Attach **water entered before haemolysis** to the swelling-stage thumbnail, not an inward osmosis arrow to the burst ghost. The leaf's completed turgid inset likewise carries a past-event label **water uptake restored turgor**, with no continuing net-in arrow at equilibrium.
4. At *stays the same or shrinks*, three small cell silhouettes (swollen, normal, shrunken) appear under the red blood cell as a row, no labels yet.
5. At *one structure that the lettuce's cells have*, a magnifier opens on the crisp leaf, showing one plant cell with its thick outline ringed; at *a cell wall*, the ring gains the label **cell wall**, and the red blood cell's outline is ringed with the tag **no wall**. Dissolve to the objectives surface.

**On-screen text:** the hook question; *water in*; *water entered before haemolysis*; *water uptake restored turgor*; *cell wall*; *no wall*; the time-graphic caption.

---

### BEAT 2 · What you will be able to do · 0:35–1:02

**Narration:**
> By the end you will be able to explain which way water moves between a cell and a solution, in terms of water potential; to predict what happens to a red blood cell and to a plant cell in three kinds of solution; and to explain why the two end up so differently.

**Visual action:**
1. **From the first frame**, the objectives' styled surface contains all three flat authored pictograms: droplet with opposed arrows, red disc beside green rectangle, and thick wall beside thin membrane outline. Their text slots are empty. Reveal each objective's text at its existing narration cue and brighten the already-visible matching pictogram. Keep this surface separate from the detailed lesson diagram. At *explain which way water moves*, line 1's text enters with motion and the droplet pictogram (two-headed arrow, one thicker head) brightens.
2. At *predict what happens to a red blood cell*, line 2's text enters and the red-disc-and-green-rectangle pictogram (each beside three dots: three cases) brightens.
3. At *why the two end up so differently*, line 3's text enters and the thick-wall-and-thin-membrane pictogram brightens.
   1. **EXPLAIN** which way water moves between a cell and a solution, in water-potential terms
   2. **PREDICT** what happens to a red blood cell and a plant cell in three kinds of solution
   3. **EXPLAIN** why the two cell types end up differently

**On-screen text:** the three objectives. Small type: *syllabus 4.2.6, "explain", p.22.*

---

### BEAT 3 · Water potential, restated · 1:02–1:55

**Narration:**
> Water potential describes water's tendency to move. Pure water at atmospheric pressure is the reference, with water potential zero kilopascals. At the same temperature and pressure, adding solute lowers water potential, so the solutions in this comparison have negative values; a less negative value is higher. Net osmosis is from higher to lower water potential through a partially permeable membrane. Water still crosses both ways when the water potentials are equal. Picture water running downhill on this scale. Written properly: osmosis is the net movement of water molecules from a region of higher water potential to a region of lower water potential, through a partially permeable membrane.

**Visual action:**
1. **From the first frame**, `WaterPotentialModel` base state (tag *recall: 4.2.1a*) fills the frame: two compartments either side of a vertical membrane strip labelled **partially permeable membrane**, water tokens drifting in both, the vertical water-potential scale beside it (empty of markers).
2. At *describes water's tendency to move*, the words **water potential** appear as a compact caption above the model; water tokens near the membrane jitter and a few cross each way; caption *water potential: water's tendency to move*.
3. At *Pure water at atmospheric pressure*, the left compartment briefly holds water tokens only, tagged *pure water*; at *zero kilopascals*, the top of the scale lights and reads **0 kPa (pure water at atmospheric pressure)**.
4. At *adding solute lowers water potential*, solute tokens drop into the right compartment (orange double-hexagons, tag *solute*) and a marker for that compartment slides down the scale; small type *same temperature and pressure*; at *have negative values*, the lower part of the scale gains the label *more negative*.
5. At *a less negative value is higher*, a few solute tokens are added to the left compartment too; its marker sits below 0 but above the right one; labels *initially: higher water potential (less negative)* (left) and *initially: lower water potential (more negative)* (right).
6. At *Net osmosis is from higher to lower*, the crossing counter appears (*left → right* running faster than *right → left*) and the net arrow draws left to right, labelled *net movement of water by osmosis*.
7. At *Water still crosses both ways*, a ghost pair of equal markers flashes on the scale and a small inset shows the counter's numbers level with the net arrow faded while tokens keep crossing; the inset clears.
8. At *running downhill on this scale*, the two markers are joined by a short downhill arrow along the scale; the handle strap-line *downhill on the water-potential scale* appears in small type, tag *analogy only*.
9. At *Written properly*, a sentence surface slides up beneath the model; at *the net movement of water molecules*, the definition builds clause by clause: **Osmosis is the net movement of water molecules · from a region of higher water potential · to a region of lower water potential · through a partially permeable membrane.** The net arrow pulses with the second and third clauses.

**On-screen text:** *0 kPa (pure water at atmospheric pressure)*; *more negative*; the two initial-condition labels; the counter; the net arrow label; the definition. Small type: *no numbers on the scale except the reference*.

---

### BEAT 4 · Make one side a cell · 1:55–2:50

**Narration:**
> Now make the right-hand side a cell. Its contents are solutions too, so a cell has a water potential of its own. What decides things is how the solution's water potential compares with the cell's at the start, so each case today is labelled as the initial condition. There are three possibilities: the solution's water potential is higher than the cell's, equal to it, or lower. In all three, water molecules cross the membrane both ways; the comparison decides only the net direction: in, neither, or out. That matters, because a cell works properly only within a range of water content, and it cannot simply stop water crossing its membrane.

**Visual action:**
1. **From the first frame**, the Beat 3 `WaterPotentialModel` holds, its definition surface lowered to a thin strip. At *make the right-hand side a cell*, the model changes to `cell-vs-solution`: the right compartment's boundary curves into a generic cell outline and the membrane strip is relabelled **cell surface membrane**, with the tag *membrane rotated: solution (outside the cell) to the left, cell contents to the right*; the left compartment is labelled **surrounding solution**, small type *solution volume large; its water potential treated as unchanged (model assumption)*.
2. At *Its contents are solutions too*, violet ion tokens inside the cell pulse, tag *cell contents: many dissolved substances, drawn schematically*; at *a water potential of its own*, the scale's two markers appear: **cell** (filled dot) and **solution** (open ring).
3. At *compares with the cell's at the start*, the comparison label appears above the model: *initially: solution's water potential … than the cell's*; the word **initially** is ringed.
4. At *There are three possibilities*, three column headers slide in along the top of an empty `comparison-board` at right: **initially higher**, **initially equal**, **initially lower**; at *higher than the cell's*, the solution marker moves above the cell marker; at *equal to it*, level with it; at *or lower*, below it (each position held 1 s, then the solution marker returns to above).
5. At *cross the membrane both ways*, a small zoom inset opens on the membrane: `FluidMosaicMembrane` `full`, rotated to match (outside to the left, tag *recall: 4.1.1-2*), with water tokens crossing both ways; small type *water crosses the bilayer and, in many cells, channel proteins*; the inset closes.
6. At *the net direction: in, neither, or out*, three short arrows appear under the three board columns: into a cell outline, a pair of equal opposing arrows, out of a cell outline.
7. At *a cell works properly only within a range of water content*, a horizontal band labelled *working range of water content* appears beside the cell outline; at *cannot simply stop water crossing*, the membrane strip's crossings brighten, tag *partially permeable: water crosses*.

**On-screen text:** *cell surface membrane*; *surrounding solution*; *cell* and *solution* markers; the comparison label; the three column headers; *working range of water content*.

---

### BEAT 5 · Red blood cell: the solution's water potential higher · 2:50–3:45

**Narration:**
> Take a red blood cell, drawn here as a model. It contains water, dissolved salts and haemoglobin; we compare its outline as water moves in or out, without measuring its water potential. Put it in a liquid with a higher water potential than its contents, such as pure water. More water molecules enter than leave, so there is a net movement of water into the cell, and it swells from a flattened disc towards a sphere. A red blood cell has no cell wall to resist the expansion. In pure water the membrane stretches until it bursts and the contents spill out. For red blood cells, this is called haemolysis.

**Visual action:**
1. **From the first frame**, the `cell-vs-solution` model sits at left with its scale, and the empty `comparison-board` at right. At *Take a red blood cell*, the model's cell outline becomes `rbc-normal`, and a large `rbc-normal` (face and side views) appears at centre, label **red blood cell (starting cell)**; caption *schematic; not to scale*.
2. At *dissolved salts and haemoglobin*, the cell's red contents are labelled **haemoglobin-containing cell contents** (a composition label, not molecular detail). At *compare its outline*, the centre cell's outline is highlighted and a small circular inset beside it shows a **light-microscope view**: if the sourced micrograph (see *Assets*) is available, it is shown with its source line; otherwise a drawn view of several outlines captioned **drawn model of a light-microscope view; not a micrograph**; tag *what you see: each cell's outline*. At *without measuring its water potential*, a limitation tag lands: *outline compared; water potential not measured*.
3. At *such as pure water*, the solution compartment empties of solute tokens, tag *pure water*; the solution marker rises to **0 kPa** at the top of the scale, small type *pure water: the limiting case of the surrounding liquid, at the reference 0 kPa*; the comparison label reads *initially: solution's water potential higher than the cell's*.
4. At *More water molecules enter than leave*, the counter reads *solution → cell* faster than *cell → solution*; at *a net movement of water into the cell*, the net arrow draws into the cell.
5. At *swells from a flattened disc towards a sphere*, the centre cell plays `rbc-swelling` (3 s; side-view concavity lost, face-view pale centre fills); caption *time compressed; schematic*.
6. At *no cell wall to resist the expansion*, the stretched outline is ringed in the accent, tag **no wall**.
7. At *the membrane stretches until it bursts*, `rbc-haemolysed`: a gap opens in the outline and the red contents, still labelled **haemoglobin-containing cell contents**, disperse through the opening into the water; the counter and net arrow are removed (the membrane is ruptured); a faint empty outline remains.
8. At *this is called haemolysis*, the label **haemolysis (the red-blood-cell term)** lands, small type *other animal cells may lyse without that name; in a solution only slightly higher, a red blood cell may swell without bursting*; the burst cell, with a small `rbc-swelling` thumbnail before it (tagged **water entered before haemolysis**) and the tag *in pure water*, shrinks into the board's **red blood cell / initially higher** slot.

**On-screen text:** *red blood cell (starting cell)*; *haemoglobin-containing cell contents*; the microscope-view caption; *outline compared; water potential not measured*; *pure water*; the counter; *no wall*; *haemolysis*; *water entered before haemolysis*.

---

### BEAT 6 · Red blood cell: equal, then lower · 3:45–4:48

**Narration:**
> Now a solution with the same water potential as the cell. Water still crosses both ways, at equal rates, so there is no net movement, and this red blood cell stays unchanged. Careful: equal water potentials mean no net movement; they do not by themselves decide a cell's shape. This cell stays normal because it started normal. An isotonic saline example shows why matching the effective osmotic conditions around red blood cells can prevent large net changes in their volume. Saline is sodium chloride dissolved in water; here its concentration is chosen to keep the cells' volume steady. Last, a solution with a lower water potential than the cell. More water leaves than enters, the cell shrinks, and its outline puckers into points: it is crenated.

**Visual action:**
1. **From the first frame**, the `cell-vs-solution` model at left, the board at right with its first slot filled, and a fresh `rbc-normal` at centre (label *starting cell*). At *the same water potential as the cell*, the solution compartment fills with violet ion tokens (tag *sodium chloride solution*); the solution marker settles level with the cell marker; the comparison label reads *initially: solution's water potential equal to the cell's*.
2. At *at equal rates*, the counter's two numbers run level; no net arrow appears; at *this red blood cell stays unchanged*, `rbc-equal`: tokens cross both ways at the centre cell's outline, which does not change; label *no net movement · unchanged in this comparison*.
3. At *they do not by themselves decide a cell's shape*, a small side-note appears: *equal water potentials → no net movement (shape not decided by this alone)*.
4. At *because it started normal*, the **starting cell** label from the start of the beat flashes beside the unchanged cell; the cell then shrinks into the **red blood cell / initially equal** slot.
5. At *An isotonic saline example*, a small panel labelled **our example** slides in beside the board: a small group of `rbc-equal` cells with balanced crossings; at *prevent large net changes in their volume*, the cells' outlines hold steady, tag *volume steady*; small type *an example of matched conditions; no clinical use is described here*. At *Saline is sodium chloride dissolved in water*, a simple solution vessel (not a clinical infusion-bag silhouette) appears beside the cells, labelled **sodium chloride solution; matched conditions in this example**; at *keep the cells' volume steady*, the *volume steady* tag brightens. The panel clears.
6. At *a lower water potential than the cell*, a fresh `rbc-normal` appears at centre; more ion tokens enter the solution compartment; the solution marker slides below the cell marker; the comparison label reads *initially: solution's water potential lower than the cell's*.
7. At *More water leaves than enters*, the counter reverses its lead; the net arrow draws out of the cell.
8. At *the cell shrinks*, `rbc-crenated` begins (3 s; caption *time compressed; schematic*); at *puckers into points*, the blunt points form around the outline and are ringed; at *it is crenated*, the label **crenated** lands and the cell shrinks into the **red blood cell / initially lower** slot. Small type (not narrated): *net loss stops when the cell's water potential has fallen to equal the solution's*.

**On-screen text:** *sodium chloride solution*; *no net movement · unchanged in this comparison*; the side-note; the saline panel and its labels (*sodium chloride solution; matched conditions in this example*); *crenated*.

---

### BEAT 7 · Plant cell: the solution's water potential higher · 4:48–6:03

**Narration:**
> Now a plant cell, from a watered plant, already pressing gently on its wall. Outside the cell surface membrane is a cellulose cell wall; inside are cytoplasm, a nucleus and a large vacuole bounded by the tonoplast. The membrane and everything inside it is the protoplast. In a liquid with a higher water potential, such as pure water, there is a net movement of water into the cell. The vacuole and cytoplasm swell and the protoplast pushes harder against the wall: the cell becomes more turgid. The wall resists expansion, so it stretches only slightly and the cell does not burst. That explains the lettuce: its living cells contain water and dissolved cell-sap solutes. Water entry restores turgor and the leaf firms up. This works as a qualitative demonstration when the cells are intact; a dead or badly damaged leaf may not recover. Firmness does not measure water potential.

**Visual action:**
1. **From the first frame**, the `cell-vs-solution` model at left (its cell outline now a plant cell, with the open-mesh wall drawn on the solution side of the membrane, tag *cell wall: freely permeable*), the board at right with its red-blood-cell row filled, and at centre a large plant cell in the `plant-equal` geometry. At *already pressing gently on its wall*, the label **starting cell (from a watered plant)** lands and the contact between protoplast and wall is traced once.
2. At *a cellulose cell wall*, the thick outline is labelled **cellulose cell wall**; at *cytoplasm, a nucleus*, labels **cytoplasm** and **nucleus**; at *bounded by the tonoplast*, labels **large vacuole** and **tonoplast**; the **cell surface membrane** label lands with the first of these.
3. At *everything inside it is the protoplast*, a bracket spans membrane and contents, labelled **protoplast = the cell surface membrane and everything inside it**.
4. At *such as pure water*, the solution compartment holds water tokens only (tag *pure water*); the solution marker rises to **0 kPa**; the comparison label reads *initially: solution's water potential higher than the cell's*.
5. At *a net movement of water into the cell*, water tokens pass through the wall mesh and cross the membrane more often inwards; the counter leads *solution → cell*; the net arrow draws into the cell.
6. At *The vacuole and cytoplasm swell*, `plant-taking-up-water` begins (caption *time compressed; schematic*): the vacuole grows; at *pushes harder against the wall*, the protoplast–wall contact brightens along its length; at *becomes more turgid*, the label **becoming more turgid; water uptake in progress** lands. The net-in arrow is positive but diminishing (per `cell-vs-solution:equalise`); it is never frozen beside a completed turgid state. This is not yet the `plant-turgid` endpoint.
7. At *The wall resists expansion*, short inward-pointing arrows appear along the wall, tag **wall resists expansion**; at *stretches only slightly*, the wall's very slight outward bulge at mid-side is bracketed, tag *very slight*; at *the cell does not burst*, the intact wall outline is traced once.
8. At *That explains the lettuce*, the Beat 1 bowl returns small at the lower left, the leaf now crisp, its unnumbered time graphic still running (not reset); at *dissolved cell-sap solutes*, a magnifier on the leaf shows one cell with its vacuole inset, the sap labelled **cell sap: water and dissolved solutes**; at *Water entry restores turgor*, the magnified cell is shown at the canonical `plant-turgid` endpoint, with no net arrow and the past-event label **water uptake restored turgor**; an on-screen note lands beside it: **what it shows: net water entry restores turgidity (firmness, judged by eye)**.
9. At *when the cells are intact*, the note gains its fit/limitation line: **fit: a qualitative demonstration with intact cells; a dead or badly damaged leaf may not recover** (tag *our example*); at *Firmness does not measure water potential*, a final line lands: **where it stops: no water potential is measured**; the bowl shrinks away.

**On-screen text:** the part labels and the protoplast bracket; *pure water*; the counter; *becoming more turgid; water uptake in progress*; *wall resists expansion*; *very slight*; *cell sap: water and dissolved solutes*; *water uptake restored turgor*; the three-line lettuce note.

---

### BEAT 8 · The turgid cell reaches equilibrium · 6:03–6:56

**Narration:**
> But water does not flood in for ever. As the cell takes up water, its expanding contents press against the resisting wall, and the cell's water potential rises. It rises until it equals the water potential of the surrounding solution, and then there is no net water entry. Watch the net arrow fade, while individual water molecules keep crossing both ways, in equal numbers. So a turgid plant cell can have the same water potential as its surroundings. Equal water potentials mean no net movement; they do not mean the cell is flaccid, and they do not mean the solutions inside and outside have equal concentrations.

**Visual action:**
1. From the first frame, retain the plant cell undergoing water uptake from Beat 7, labelled **becoming more turgid**, with a positive but diminishing inward flux. At *does not flood in for ever*, ring that diminishing imbalance. This is `plant-taking-up-water`, not the completed `plant-turgid` state. (The `cell-vs-solution` model stays at left with the solution marker at **0 kPa** and the cell marker below it.)
2. At *its expanding contents press against the resisting wall*, the protoplast's pressure on the wall and the wall's inward arrows pulse together.
3. At *the cell's water potential rises*, `cell-vs-solution:equalise` begins: the cell marker climbs the scale towards the solution marker (the handle's downhill arrow shortens as it climbs).
4. At *until it equals the water potential of the surrounding solution*, the markers meet, the current-window counts become equal, and the net arrow has faded to zero. At *no net water entry*, highlight **net = 0**. (State change on this equality cue: `plant-taking-up-water` → the canonical `plant-turgid` endpoint, which the board retains.)
5. At *Watch the net arrow fade*, replay that immediately preceding final approach in a small inset labelled **replay: approaching equilibrium**; the main endpoint stays at net zero. At *keep crossing both ways, in equal numbers*, highlight the continuing balanced crossings in the main cell (tag **crossings continue**).
6. At *a turgid plant cell can have the same water potential*, the label **turgid · water potentials now equal · no net movement** lands on the centre cell.
7. At *they do not mean the cell is flaccid*, a side-note appears: *equal ≠ flaccid*, pointing at the firmly pressed protoplast.
8. At *equal concentrations*, the cell's denser violet content tokens and the sparser solution beside it are ringed together, small type *equal water potentials; the solutions inside and outside need not match*. The cell shrinks into the board's **plant cell / initially higher** slot.

**On-screen text:** *becoming more turgid*; *net = 0*; *replay: approaching equilibrium*; *crossings continue*; the equilibrium label; *equal ≠ flaccid*; the small-type note.

---

### BEAT 9 · Plant cell: equal, then lower · 6:55.5–7:48.5

**Narration:**
> Back to the starting cell, now in a solution whose water potential equals the cell's. No net movement, so it stays as it was, still pressing gently on its wall. Now a solution with a lower water potential. There is a net movement of water out of the cell; the vacuole shrinks and the protoplast stops pushing on the wall: the cell is flaccid. With further loss, the cell surface membrane pulls away from the wall, often first at the corners: this is plasmolysis. The wall is freely permeable, so the gap between wall and membrane fills with the external solution, not air.

**Visual action:**
1. **From the first frame**, a fresh plant cell in the `plant-equal` geometry at centre (label *starting cell*), the model at left, the board at right with one plant slot filled. At *a solution whose water potential equals the cell's*, sucrose tokens (orange double-hexagons, tag *sucrose solution*) fill the solution compartment; the solution marker settles level with the cell marker; label *initially: solution's water potential equal to the cell's*.
2. At *stays as it was*, `plant-equal`: balanced crossings at the membrane, counter level, no net arrow; at *still pressing gently on its wall*, the protoplast–wall contact is traced, label *no net movement · unchanged*; the cell shrinks into the **plant cell / initially equal** slot.
3. At *a solution with a lower water potential*, a fresh starting cell at centre; more sucrose tokens enter the solution compartment; the solution marker slides below the cell marker; label *initially: solution's water potential lower than the cell's*.
4. At *a net movement of water out of the cell*, the counter leads *cell → solution* and the net arrow draws out.
5. At *the vacuole shrinks*, `plant-flaccid` (2.5 s; caption *time compressed; schematic*); at *stops pushing on the wall*, the contact line dims, the wall relaxes to its rest outline; at *the cell is flaccid*, the label **flaccid** lands and a thumbnail of this state is kept.
6. At *With further loss*, `plant-plasmolysed` begins; at *often first at the corners*, the membrane separates at the four corners first, then along the sides; at *this is plasmolysis*, the label **plasmolysed** lands with *cell surface membrane pulled away from the wall*; the **tonoplast** label stays on the shrunken vacuole inside.
7. At *The wall is freely permeable*, sucrose and water tokens are highlighted passing through the wall mesh; at *fills with the external solution, not air*, the gap fills with those tokens and is labelled **gap: external solution (entered through the freely permeable wall)**. Small type (not narrated): *net loss stops when the cell's water potential has fallen to equal the solution's*.
8. After the narration ends (a 1.5 s settle on the labelled gap, following *not air*), the plasmolysed cell, labelled **with sufficient further water loss: plasmolysed**, with the flaccid thumbnail before it, shrinks into the **plant cell / initially lower** slot; the wall outline of that slot is traced once and the red-blood-cell/lower slot's crenated cell pulses beside it, tag *no wall: crenation, not plasmolysis* (unnarrated; the spoken plasmolysis sentence was cut per the check's runtime ruling).

**On-screen text:** *sucrose solution*; the comparison labels; *no net movement · unchanged*; *flaccid*; *plasmolysed*; *with sufficient further water loss: plasmolysed*; the gap label; *no wall: crenation, not plasmolysis*.

---

### BEAT 10 · What I told you, on the six cells · 7:48.5–8:38.0

**Narration:**
> So here it is, on the six cells. Each case compares the solution's water potential with the cell's, at the start, and net water movement runs from higher to lower. Higher outside: the red blood cell swells and, in pure water, bursts, haemolysis; the plant cell becomes turgid, and its wall holds it while its water potential rises to equal the solution's. Equal: no net movement, though water still crosses both ways. Lower outside: the red blood cell is crenated; the plant cell becomes flaccid, then plasmolysed, the gap full of external solution. The difference is the cell wall.

**Visual action:** **No new slide.** The screen returns to the layout built through the lesson: the `comparison-board` at centre-right with all six slots filled (each slot's state label visible), the `cell-vs-solution` model with its scale at left. Static. Key points fade in in place.
1. **From the first frame**, the full board and the model are on screen, nothing moving; at *on the six cells*, the six slots settle and their column headers brighten.
2. At *Each case compares the solution's water potential*, the **initially** in each column header brightens; at *runs from higher to lower*, the downhill arrow on the scale brightens.
3. At *Higher outside*, the higher column brightens; at *in pure water, bursts, haemolysis*, the **haemolysis** label and *in pure water* tag brighten; at *its wall holds it*, the plant slot's wall and **turgid** label brighten; at *rises to equal the solution's*, the two markers meeting on the scale brighten with *water potentials now equal*.
4. At *Equal: no net movement*, the equal column brightens; at *water still crosses both ways*, the paired opposing arrows under that column and the **crossings continue** tag brighten.
5. At *Lower outside*, the lower column brightens; at *the red blood cell is crenated*, **crenated** brightens; at *then plasmolysed*, the flaccid thumbnail and the label **with sufficient further water loss: plasmolysed** brighten; at *the gap full of external solution*, the gap label brightens.
6. At *The difference is the cell wall*, all three plant-row walls and the **no wall** tags in the red-blood-cell row brighten together.

---

### BEAT 11 · How it is asked, the reject card, and the lettuce · 8:38.0–9:31.5

**Narration:**
> How this reaches you. None of the cited question parts in the five-paper Paper 2 sample directly tests this outcome. So this close follows the syllabus: explain water movement in water-potential terms and compare its effects on plant and animal cells. A November 2020 phloem explanation carried water-potential points among its five marks, and a practical paper credited the point of zero mass change, where there is no net change, as its estimate. The reject card is ours: equal water potentials mean no net movement. And the lettuce and the red cell? Water entered both; the lettuce's cells had walls to push against.

**Visual action:**
1. **From the first frame**, the familiar lesson layout stays on screen at right, reduced (the `comparison-board` with all six cells and the scale); a compact forms surface opens at left beside it. At *How this reaches you*, the surface's header lands: **How this is asked**.
2. At *None of the cited question parts*, a line lands under the header: **direct exposure in the cited Paper 2 blocks: 0/5** (small type *TOPIC-04-WEIGHTS; cited blocks only, not every question in those papers or the archive*).
3. At *this close follows the syllabus*, row 1: **syllabus-based form** · small type, exact: *syllabus 4.2.6, p.22: "explain the movement of water between cells and solutions in terms of water potential and explain the different effects of the movement of water on plant cells and animal cells"*; label **syllabus-based; not a Cambridge question**; at *compare its effects on plant and animal cells*, the two rows of the board brighten in turn.
4. At *A November 2020 phloem explanation*, row 2: **adjacent: W20/21 Q4(b)(ii), MS p.10** · *our paraphrase: a five-mark phloem mass-flow explanation containing water-potential/osmosis points; not five marks solely for osmosis; phloem is Topic 7*, beside it the board's scale and downhill arrow brighten.
5. At *a practical paper credited the point of zero mass change*, row 3: **adjacent: W20/51 Q1(c)(ii), QP p.5 / MS p.9** · *our paraphrase: 3 marks for a labelled downward-trending sketch and identifying its zero-mass-change intercept as the estimate (red pepper fruit wall); estimating tissue water potential is 4.2.5*, beside it the equal column brightens.
6. At *The reject card is ours*, the reject card lands beneath the forms, struck through by hand: **✗ The water potentials are equal, so the plant cell must be flaccid.** / **✓ Equal water potentials mean no net movement of water; a turgid plant cell can have the same water potential as the solution.** Caption in small type: *our wording contrast, based on the plan check's equilibrium ruling (MF3); not a mark-scheme reject line*; at *equal water potentials mean no net movement*, the ✓ line brightens beside the board's turgid (`plant-turgid`) slot.
7. At *And the lettuce and the red cell?*, the Beat 1 pair returns small beneath the board: the crisp leaf in its bowl (unnumbered time graphic still running) and the burst red blood cell with its swelling-stage thumbnail; at *Water entered both*, attach **water entered before haemolysis** to the swelling-stage thumbnail, not an inward osmosis arrow to the burst ghost. The leaf's completed turgid inset likewise carries a past-event label **water uptake restored turgor**, with no continuing net-in arrow at equilibrium; at *had walls to push against*, the leaf's magnified cell wall is ringed beside the red cell's **no wall** tag. Final frame held 2 s: forms and reject card at left, the board at right, the hook pair beneath. No slogan.

**On-screen text:** the header; the 0/5 line and its scope note; the three forms with citations and labels; the reject card and caption; the hook pair with *water entered before haemolysis* and *water uptake restored turgor*.

---

## Datasets

**No measured data and no numerical water potentials are used in this lesson.** The scale shows only its reference, **0 kPa (pure water at atmospheric pressure)**; every other marker position is qualitative (above/level/below), so no concentration–water-potential pair is fabricated (plan MF2 spirit). No W20/51 Table 1.1 value is shown (those belong to 4.2.5).

### Schematic crossing counts (Beats 3–9; *schematic counts; not measurements; far fewer than real*)

The counter shows **crossings per model-time window** (5 s of schematic, compressed model time; not experimental timing), not cumulative totals. These numbers are drawing instructions for the builder, labelled on screen as schematic, not data.

| Case | solution → cell | cell → solution | net per window | net arrow |
|---|---:|---:|---:|---|
| initially higher (all cells, start of case) | 15 | 5 | 15 − 5 = **10 in** | into the cell |
| equal (`rbc-equal`, `plant-equal`) | 10 | 10 | 10 − 10 = **0** | none |
| initially lower (all cells, start of case) | 5 | 15 | 5 − 15 = **−10 (10 out)** | out of the cell |
| `plant-taking-up-water` → `plant-turgid` (`equalise`), successive windows | 15 → 13 → 11 → 10 | 5 → 7 → 9 → 10 | 10 → 6 → 2 → **0** | shortens with the imbalance; disappears as the markers meet (net = 0) |

Worked: the net value is the difference of the two counts in each window; the arrow's drawn length is proportional to it (10 units at net 10, 6 at 6, 2 at 2, faded at 0). In every row the total crossings per window stay at 20 (15 + 5, 13 + 7, 11 + 9, 10 + 10), so equilibrium is drawn as **the same amount of crossing, balanced**, never as crossing stopping.

### Marker positions on the scale (qualitative)

Positions as a fraction of the scale height below 0 kPa, drawing instructions only (no values printed): red blood cell contents 0.40; plant starting cell 0.35; pure water 0 (top); equal cases: solution marker placed on the cell marker; lower cases: solution marker 0.65. Equalise: the plant cell marker moves 0.35 → 0 as the counts converge (reaching 0 on the net-0 window: a fully turgid cell in pure water reaches the pure water's value). Lower cases (small type only): the cell marker falls towards 0.65.

### Morphology proportions (drawing instructions)

Plant vacuole share of cell area: starting 70%, turgid 80%, flaccid 55%, plasmolysed protoplast 45% of the wall's area; wall bulge at most 2% of width. Red blood cell crenated face area about 75% of normal; 10–12 blunt points. These are geometry for a schematic, not measurements.

---

## Real-world samples

All examples are schematic; the lettuce handling is illustrated, not a recorded experiment. Three real-world examples appear in explain beats (red blood cells, isotonic saline, lettuce).

| Material | What the method responds to | Fit (range, clarity) | Interferences and how the lesson handles them | Beats |
|---|---|---|---|---|
| **Red blood cells** (shown as a drawn model; an optional **sourced** micrograph inset, never generated). Narrated composition: *water, dissolved salts and haemoglobin* (Beat 5) | We compare **each cell's outline** as water moves in or out, without measuring its water potential: swelling, the normal biconcave shape and crenation show as changes of shape; a burst cell leaves a faint empty outline | Good for comparing shapes between solutions; the model does not show water potentials, only their consequences; no measurement is taken | A micrograph may be unavailable (fallback: *drawn model of a light-microscope view; not a micrograph*); shapes on a prepared slide can be affected by preparation, so a micrograph is used only with its source line and preparation stated; in a solution only slightly higher, a cell may swell without bursting (small type, Beat 5) | 1, 5 (narrated statement and on-screen note), 6, 10, 11 |
| **Isotonic saline** (Beat 6; drawn solution vessel, not a clinical infusion-bag silhouette). Narrated composition: *sodium chloride dissolved in water* | Red blood cells' **volume** stays steady when the solution's conditions are matched | An example of matched conditions only; no concentration, dose or treatment guidance | Label *sodium chloride solution; matched conditions in this example*; small type *no clinical use is described here* | 6 (MF6 sentence plus narrated composition sentence) |
| **Lettuce leaf** (hook and Beat 7; drawn, schematic). Narrated composition: *living cells containing water and dissolved cell-sap solutes* | **Firmness** (turgidity) of the leaf, judged by eye, as its living cells take up water | Works as a **qualitative demonstration when the cells are intact** (narrated); **firmness does not measure water potential** and gives no numbers | A dead or badly damaged leaf may not recover (now narrated, and on-screen note); how fast it firms depends on the leaf; the unnumbered time graphic is *time compressed; our example; nothing measured* | 1, 7 (narrated statements and three-line on-screen note), 11 |

Explain-beat real-world examples: the lettuce (Beat 7, *our example*); the isotonic saline example (Beat 6, the plan-check sentence spoken verbatim, followed by the narrated composition sentence; panel *our example; no clinical use is described here*).

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.22) | Beat(s) | How |
|---|---|---|
| explain the movement of water between cells and solutions in terms of water potential | 3, 4, 5, 6, 7, 8, 9, 10 | MF3 sentences restated verbatim; osmosis defined in water-potential terms; `cell-vs-solution`: the solution's water potential compared with the cell's, labelled *initially*; crossings both ways, net direction from higher to lower; equilibrium (net arrow fades, crossings continue) |
| explain the different effects of the movement of water on plant cells | 7, 8, 9, 10 | three cases: higher → turgid (wall resists expansion; does not burst) → equilibrium (cell's water potential rises to equal the solution's); equal → no net movement, unchanged; lower → flaccid → plasmolysed, gap filled with external solution through the freely permeable wall |
| … and animal cells | 5, 6, 10 | red blood cell: higher → swells and, in pure water, bursts (haemolysis, red-blood-cell term); equal → unchanged in this comparison (equality alone does not set shape); lower → crenated |
| the different effects (the comparison) | 1, 9, 10, 11 | the cell wall as the difference: the plasmolysed protoplast withdraws from its wall; crenation without one (Beat 9 on-screen tag *no wall: crenation, not plasmolysis*) |
| (knowledge of solute potential and pressure potential is not expected) | all | never named, symbolised or calculated; "the wall resists expansion" and "the cell's water potential rises" only |
| Mathematical requirements p.63 | none | no calculation in this outcome; the scale carries only 0 kPa |

### Plan requirements → beats

| Plan item (§4.2.6 and shared rules) | Beat(s) |
|---|---|
| Restate the MF3 water-potential sentences and the definition (lesson stands alone) | 3 |
| Three cases for each cell type, labelled as the initial condition | 4 (headers), 5–6 (red blood cell), 7–9 (plant) |
| MF3 equilibrium paragraph: expanding contents press on the resisting wall; cell's water potential rises until equal; net arrow fades while crossings continue; turgid cell can equal its surroundings; equal ≠ flaccid, ≠ equal solute concentrations; red blood cell unchanged in the equal comparison; equality alone does not set shape; no component potentials | 6, 8, 10, 11 (reject card) |
| Haemolysis specific to red blood cells; crenated as the appearance | 5, 6 |
| Plasmolysis: gap fills with external solution through the freely permeable wall | 9 |
| Lettuce: turgor demonstration, not a water-potential measurement | 1, 7, 11 |
| MF6 isotonic saline sentence; no drip/IV claim | 6 |
| `WaterPotentialModel` `cell-vs-solution` added; `CellOsmosisSet` published with the eight shared states, plus local equality/compatibility states specified here (and the lesson-local transition `plant-taking-up-water`) | models section; 4–9 |
| Exam close syllabus-based and labelled so, with W20/21 Q4(b)(ii) and W20/51 Q1(c)(ii) as adjacent | 11 |

### Mark-scheme and examiner points → beats

| Source | Point (description, no quotation) | Beat |
|---|---|---|
| W20/21 Q4(b)(ii), MS p.10 (adjacent) | five-mark phloem mass-flow explanation containing water-potential/osmosis points; not five marks solely for osmosis | 11 (row 2) |
| W20/51 Q1(c)(ii), QP p.5 / MS p.9 (adjacent) | 3 marks: labelled downward-trending sketch; zero-mass-change intercept as the estimate (no-net-change interpretation; red pepper) | 11 (row 3) |
| G04 limit | the citations do not supply a complete rubric for every named cell state | spine; 11 (0/5 line) |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, never, only, no, nothing, cannot, because, must, needs* and causal *so/since* was reread: true of all cases, or of the case on screen?
- Beat 1: (round 1: the "Cells are bathed in watery solutions … both directions" sentence is cut.) "one structure that the lettuce's cells have and a red blood cell lacks": about these two cell types only.
- Beat 3: (round 1: opening sentence cut; no new wording.) "so the solutions in this comparison have negative values": MF3's own bounded wording ("in this comparison"). "Water still crosses both ways when the water potentials are equal": MF3 verbatim.
- Beat 4: "so a cell has a water potential of its own": follows from its contents being solutions. "so each case today is labelled as the initial condition": our labelling rule, bounded by "today". "In all three, water molecules cross the membrane both ways; the comparison decides only the net direction": "all three" = the three cases on screen; "only" limits what the comparison decides (direction, not whether crossing happens), which is the MF3 point. "a cell works properly only within a range of water content": the typical physiological statement, framing only; "it cannot simply stop water crossing its membrane": bounded by "simply"; water crosses the bilayer, and the lesson makes no claim about regulation.
- Beat 5 (round 1, new opening): "It contains water, dissolved salts and haemoglobin": a composition statement true of red blood cells, not exhaustive ("contains", not "consists only of"). "we compare its outline … without measuring its water potential": bounded to what this lesson does. "so there is a net movement of water into the cell": follows from more entering than leaving. "A red blood cell has no cell wall to resist the expansion": true of red blood cells. "In pure water the membrane stretches until it bursts": bounded to pure water; the small type says a solution only slightly higher may leave it swollen but intact; the plan's "may burst" is kept in the spine.
- Beat 6: "so there is no net movement, and this red blood cell stays unchanged": "this" red blood cell, in this comparison (MF3). "they do not by themselves decide a cell's shape": MF3's limit. "This cell stays normal because it started normal": the causal claim is about this cell in this comparison. "can prevent large net changes": the plan-check sentence verbatim, with its "can". (Round 1) "Saline is sodium chloride dissolved in water; here its concentration is chosen to keep the cells' volume steady": the composition is definitional; "here" bounds the matched concentration to this example; no dose or clinical claim.
- Beat 7: "so it stretches only slightly and the cell does not burst": about a plant cell with an intact wall in this case; "only slightly" matches the model's ≤2% bulge. "the cell becomes more turgid" (round 1, was "fully turgid"): describes the transition, not a completed endpoint. (Round 1 lettuce sentences) "its living cells contain water and dissolved cell-sap solutes": bounded to living cells. "Water entry restores turgor and the leaf firms up": this leaf, in this example. "This works as a qualitative demonstration when the cells are intact; a dead or badly damaged leaf may not recover": conditional, with "may". "Firmness does not measure water potential": true of the method in general.
- Beat 8: "But water does not flood in for ever": the equilibrium point. "then there is no net water entry": MF3. "a turgid plant cell can have the same water potential": MF3's "can". "they do not mean the cell is flaccid … equal concentrations": MF3's "not necessarily", said as "do not mean".
- Beat 9: "No net movement, so it stays as it was": this cell in the equal case. "often first at the corners": "often". "The wall is freely permeable, so the gap … fills with the external solution, not air": the plan's own statement. (Round 1: "Plasmolysis is a plant-cell term; it needs a wall to pull away from" is cut, removing the over-exclusive plant-only claim.)
- Beat 10: "Each case compares …": our labelling rule. "in pure water, bursts": bounded as in Beat 5. "The difference is the cell wall": the plan's "The difference in outcome between the two cell types comes from the cell wall", scoped to these two cell types.
- Beat 11 (round 1): "None of the cited question parts in the five-paper Paper 2 sample directly tests this outcome": the weights' 0/5 coding of the cited Paper 2 blocks, bounded to those cited parts; not a claim about every question in those papers or the archive. "So this close follows the syllabus": the plan's labelled syllabus-based close. "carried water-potential points among its five marks": not "five marks for osmosis". "credited the point of zero mass change … as its estimate": the plan-check description of Q1(c)(ii). "Water entered both": true of the two hook cases.
- No sentence says pure water has the highest water potential without its reference condition, says all solutions are negative, uses "concentration of water", says plant cells burst, uses plasmolysis for an animal cell, says plasmolysis belongs to plants alone, calls the plasmolysed gap empty or air-filled, treats equal water potentials as flaccid or as equal concentrations, ties a normal red-cell shape to equality alone, or names a component potential.

---

## Citations

Every quotation in this storyboard, where it appears, and where it was copied from. **No exam wording (QP, MS or ER) is quoted anywhere in this lesson**; the exam rows below are descriptions (our paraphrase with citation), tagged as the rules require.

| # | Quotation (verbatim) | Paper / session / question / page | Beat(s) | Copied from | Status |
|---|---|---|---|---|---|
| 1 | "explain the movement of water between cells and solutions in terms of water potential and explain the different effects of the movement of water on plant cells and animal cells (knowledge of solute potential and pressure potential is not expected)" | Syllabus 2025–2027, 4.2.6, p.22 | header; 11 (without the bracket) | `SYLLABUS-9700-DETAIL.md` | syllabus (verbatim) |
| 2 | (no quotation; description) five-mark phloem mass-flow explanation containing water-potential/osmosis points; not five marks solely for osmosis | W20/21 Q4(b)(ii), MS p.10 | spine; 11 | `TOPIC-04-WEIGHTS.md` ledger (plan check's exact description) | description only; PDF-CHECKED (round-1 storyboard check: `9700_w20_qp_21.pdf` p.11, `9700_w20_ms_21.pdf` p.10; question asks how assimilates and viruses travel through phloem sieve tubes; any five relevant points, including assimilate entry lowering water potential and consequent water entry by osmosis; other points concern hydrostatic-pressure gradients and mass flow) |
| 3 | (no quotation; description) 3 marks for a labelled downward-trending sketch and identifying its zero-mass-change intercept as the estimate; red pepper fruit-wall tissue | W20/51 Q1(c)(ii), QP p.5 / MS p.9 | spine; 11 | `TOPIC-PLAN-04-MEMBRANES.md` §4.2.5 MF2 paragraph; `TOPIC-04-WEIGHTS.md` S-B | description only; PDF-CHECKED (round-1 storyboard check: `9700_w20_qp_51.pdf` p.5, `9700_w20_ms_51.pdf` p.9; stem asks for expected-result sketch, axes labels/units and how to estimate the equivalent sucrose concentration; three points cover x-axis label/unit, single downward crossing and identifying the intercept; no numerical −860 kPa answer belongs to this part) |

Plan-check sentences spoken verbatim (our teaching wording adopted by the plan, **not** exam quotations; never shown in quotation marks as Cambridge text): the MF3 water-potential sentences (Beat 3); the MF3 equilibrium ideas (Beats 6 and 8, close to verbatim); the MF6 sentence "An isotonic saline example shows why matching the effective osmotic conditions around red blood cells can prevent large net changes in their volume." (Beat 6). Source: `plan/topic-04/TOPIC-PLAN-04-MEMBRANES.md` §4.2.1 and §4.2.6, copied from `cloud-checks/006/plan/CHECK.md` MF3 and MF6.

**UNVERIFIED items** (not quoted; shown only as our paraphrase or omitted):
1. `UNVERIFIED — a marked question testing 4.2.6 directly`: no direct example identified in this cited set (0/5 direct in the cited Paper 2 blocks); the adjacent PDFs do not establish that no direct question exists elsewhere. The close is labelled **syllabus-based; not a Cambridge question**.
2. **RESOLVED (round-1 check, PDF-CHECKED):** W20/21 Q4(b)(ii), QP p.11 / MS p.10. The question asks how assimilates and viruses travel through phloem sieve tubes; the scheme awards any five relevant points, including assimilate entry lowering water potential and consequent water entry by osmosis; other points concern hydrostatic-pressure gradients and mass flow. Five marks are not all for osmosis. Still shown only as our paraphrase.
3. **RESOLVED (round-1 check, PDF-CHECKED):** W20/51 Q1(c)(ii), QP p.5 / MS p.9. The stem asks for an expected-result sketch, axes labels/units and how to estimate the equivalent sucrose concentration; three points cover x-axis label/unit, single downward crossing and identifying the intercept. No numerical −860 kPa answer belongs to this part (that line is Q1(d)(i), not used here). Still shown only as our paraphrase.
4. `UNVERIFIED — a sourced micrograph of red blood cells in solutions of different water potentials` (asset dependency; fallback is a drawn view captioned *drawn model of a light-microscope view; not a micrograph*).
5. `UNVERIFIED — a content source for the lettuce example beyond the plan check's ruling` (not resolved by the exam PDFs; the plan check calls it "suitably bounded as a turgor demonstration, not a water-potential measurement"; the lesson claims nothing more than firmness returning as living cells take up water, now with the narrated intact-cells caveat and no numeric potential or duration).

---

## Word count and runtime

Counted by the validator over the blockquoted narration; seconds = words ÷ 120 × 60.

| Beat | Title | Words | Seconds |
|---|---|---:|---:|
| 1 | Hook and context | 70 | 35.0 |
| 2 | What you will be able to do | 53 | 26.5 |
| 3 | Water potential, restated | 107 | 53.5 |
| 4 | Make one side a cell | 110 | 55.0 |
| 5 | Red blood cell: higher | 110 | 55.0 |
| 6 | Red blood cell: equal, then lower | 126 | 63.0 |
| 7 | Plant cell: higher | 149 | 74.5 |
| 8 | The turgid cell reaches equilibrium | 106 | 53.0 |
| 9 | Plant cell: equal, then lower | 103 | 51.5 |
| 10 | Recap on the six cells | 99 | 49.5 |
| 11 | How it is asked, reject card, lettuce | 103 | 51.5 |
| **Total** | 11 beats (11 teaching + 0 error) | **1,136** | **568.0** (9:28.0) |

**Length, honestly (after round-2 check):** Narration: 1,136 words at 120 wpm = 9:28.0. Add Beat 9's 1.5-second settle and Beat 11's two-second final hold: total 9:31.5, 1:16.5 over the 8:15 budget. This overrun is accepted. No case or required sample explanation is cut, and narration is not accelerated. The check's runtime ruling was applied: author cuts **1, 3, 4 and 6** taken (19 + 8 + 7 + 13 = **−47 words**; 1,147 → 1,100 = 9:10 before replacements), then the required M4–M5 material/fit and scope wording added (Beat 5 +2, Beat 6 +18, Beat 7 +21 including "more turgid", Beat 11 −5 net from the M5 rewording; 1,100 + 2 + 18 + 21 − 5): **1,136 words**. Per the check, this remaining overrun is **accepted**: the six comparisons, standalone definition, plant equilibrium, real examples and recap each do distinct work; no case is deleted, no error beat is invented and no narration is sped up. Cuts 2 (Beat 10 recap sentence, 22 words) and 5 ("from a watered plant", 4 words) are **kept by the check's ruling**. Beat windows in the headings are provisional; per-beat seconds above are the ledger.

**Cut list status:** 1 (Beat 1, both-directions sentence) **taken** (also removes the post-haemolysis magnifier); 2 (Beat 10 recap sentence) **kept by ruling**; 3 (Beat 11 "The same language turns up inside other answers:") **taken**; 4 (Beat 3 "First, the idea that does the explaining.") **taken**; 5 (Beat 7 "from a watered plant,") **kept by ruling**; 6 (Beat 9 "Plasmolysis is a plant-cell term; …") **taken** (the board tag *no wall: crenation, not plasmolysis* keeps the contrast on screen).

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| Solute potential, pressure potential, ψ = ψs + ψp, any water-potential calculation, incipient plasmolysis as a calculation | not expected (4.2.6 exclusion) |
| Estimating a tissue's water potential; the potato method; W20/51 Table 1.1 values and the −860 kPa density-drop answer | 4.2.5 |
| Observing plasmolysis in red onion epidermis; the Visking osmometer | 4.2.2b; 4.2.2a |
| Osmosis introduced from scratch with the particle field and aquaporins beyond a mention | 4.2.1a (recalled by label; MF3 sentences restated) |
| Stomata and guard cells; kidney osmoregulation; control of blood water potential | Topic 14 |
| Phloem mass flow (the W20/21 context) | Topic 7 |
| Clinical detail of saline use (drips, prescriptions, IV fluids) | not in scope (MF6) |
| Tonicity vocabulary (hypotonic, hypertonic) | not needed; the lesson uses water-potential comparisons only ("isotonic" appears only inside the MF6 sentence) |
| Contractile vacuoles, cell regulation of volume, cytoskeleton mechanics of the red blood cell | not in the outcome |

## Reusable models

| Model | Specified | For |
|---|---|---|
| **`WaterPotentialModel` `cell-vs-solution`** (solution left, cell right, membrane rotated and relabelled; *solution* and *cell* markers on the scale; initial-condition label; counter relabelled; plant case with open-mesh freely permeable wall; `equalise` sub-state: markers meet, counts level, net arrow fades, crossings continue) | here (base state 4.2.1a) | 4.2.2a (osmometer explanation), 4.2.2b (red onion), 4.2.5 (tissue-vs-solution comparison) |
| **`CellOsmosisSet`** (the eight shared states, plus local equality/compatibility states specified here: `rbc-equal`, `plant-turgid-equilibrium` = compatibility alias of the canonical `plant-turgid` endpoint; lesson-local transition `plant-taking-up-water`, not exported; `plant-equal` and `rbc-normal` also the starting geometries; token colour roles for cell contents and for sucrose / sodium chloride solutions; gap filled with external solution through the wall) | here | 4.2.2b (red onion explanation recall: `plant-plasmolysed`, with the vacuole-edge-is-the-tonoplast point), 4.2.5 (potato cell inset: `plant-turgid`, `plant-equal`, `plant-flaccid`); 4.2.2b may also import `plant-turgid-equilibrium` (alias of `plant-turgid`) |
| **`comparison-board`** layout (2 × 3, initial-condition headers) | here | 4.2.2b and 4.2.5 may reuse one row as a recall thumbnail |
| Schematic crossing counts (15/5, 10/10, 5/15; convergence 15→10, 5→10) | here | any later lesson that shows the counter, so counts look the same topic-wide |

## Assets

| Asset | Status | Source |
|---|---|---|
| `WaterPotentialModel` base state | reuse | 4.2.1a |
| `cell-vs-solution` state, `equalise` sub-state, scale markers, open-mesh wall | **new build** | authored |
| `CellOsmosisSet` (eight shared states, local `rbc-equal` and alias `plant-turgid-equilibrium`, local transition `plant-taking-up-water`; plant and red-blood-cell geometry, token roles, motion) | **new build** | authored |
| `comparison-board` layout | **new build** | authored |
| `FluidMosaicMembrane` `full` (rotated zoom inset, Beat 4) | reuse | 4.1.1-2 |
| Lettuce leaf, bowl, hand, small unnumbered time-passing graphic (hook, Beat 7, Beat 11) | new, schematic vector | authored; handling specified (leaf lowered by hand into water, time graphic starting on first contact, never reset, no elapsed-minute figures); rendered still-frame verification pending |
| Light-microscope view of red blood cells (Beat 5) | **dependency: sourced micrograph** with source line and preparation stated; otherwise a drawn view captioned *drawn model of a light-microscope view; not a micrograph* | never generated |
| Isotonic saline panel (simple solution vessel labelled *sodium chloride solution; matched conditions in this example*, not a clinical infusion-bag silhouette; `rbc-equal` group) | new, schematic | authored; *our example; no clinical use is described here* |
| Objectives pictograms (droplet with opposed arrows; red disc beside green rectangle with three dots; thick wall beside thin membrane outline; all three visible from the first frame of Beat 2); forms surface; reject card | new card content; shared surfaces | authored |
| Photographs, generated images, Cambridge artwork | none | — |

## Plan interpretations

1. **Starting geometry for the plant cases.** The plan lists `plant-equal` without a geometry. I made it the **starting geometry for all three plant cases**: a cell from a watered plant, already pressing gently on its wall. So the equal case shows a cell that stays **somewhat turgid** with equal water potentials, reinforcing MF3 ("not necessarily a flaccid cell") rather than drawing an equal-potential cell as flaccid. Likewise `rbc-normal` is the starting geometry for all three red-blood-cell cases, and `rbc-equal` is that geometry with balanced crossings, which is MF3's "normal red blood cell remaining unchanged in the particular equal-potential comparison".
2. **Pure water as the "higher" example for both cell types.** It makes the higher case unambiguous (the solution marker at 0 kPa, the reference) and lets the turgid plant cell's `equalise` end exactly at 0 kPa, which is correct for a fully turgid cell in pure water. Haemolysis is therefore narrated as "in pure water" and the plan's "may burst" is kept in the spine, with small type for a solution only slightly higher.
3. **Solution volume treated as large.** Equilibrium is drawn by the cell's marker moving to the solution's, with *solution volume large; its water potential treated as unchanged (model assumption)*. This keeps the MF3 wording ("its water potential rises until it equals that of the surrounding solution") without a second moving marker.
4. **Equilibrium for the lower cases.** MF3 requires the fading arrow for the turgid plant cell. For crenation and plasmolysis the end of net loss is on screen only in small type (*net loss stops when the cell's water potential has fallen to equal the solution's*), not narrated, to hold the budget and avoid an unrequired motion sequence.
5. **"Not equal solute concentrations."** MF3's clause is spoken ("they do not mean the solutions inside and outside have equal concentrations") and drawn as denser content tokens beside a sparser solution at equilibrium. I did not explain *why* (that route leads to the component potentials); the only mechanism said is the wall resisting expansion and the cell's water potential rising.
6. **Solute token colours.** SHARED-SPECS gives no role for "dissolved substances in cell contents"; I used violet ion tokens (with a tag saying they are schematic), sucrose double-hexagons for the plant cases' external solution and violet ion tokens for the sodium chloride solutions around red blood cells, so the plasmolysed gap visibly fills with the **external** solution.
7. **Handle.** The plan leaves the handle to the author and warns against invented metaphors. "Water runs downhill on the water-potential scale" uses the subject's own gradient language and is converted at once into the definition (Beat 3).
8. **Exam close.** The brief names W20/21 Q4(b)(ii) and W20/51 Q1(c)(ii) as adjacent evidence. Both are shown as described by the plan check, as our paraphrase, with the close labelled **syllabus-based; not a Cambridge question**. The reject card uses the MF3 trap (equal ≠ flaccid) and is captioned as our wording contrast; no examiner reject was invented.
9. **The isotonic saline sentence** is spoken verbatim as the plan requires; the word "isotonic" appears only there. The panel shows matched conditions and steady volumes, with no drip, prescription or IV claim.
10. **Micrograph.** The plan permits an optional sourced micrograph. Beat 5 compares cell outlines in a labelled inset: use a micrograph only with its source and preparation identified; otherwise use the explicitly labelled drawn model of a light-microscope view. Neither option is a measurement of water potential.

## Validator run

`python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.6/STORYBOARD.md` (exit code 0; re-run after the round-2 check edits, output unchanged because no narration changed)

```
== storyboards/topic-04/4.2.6/STORYBOARD.md
beat  words  cues maxgap  status
   1     70     6     14  ok
   2     53     3     21  ok
   3    107    11     25  ok
   4    110    12     17  ok
   5    110    11     18  ok
   6    126    14     16  ok
   7    149    18     15  ok
   8    106    10     20  ok
   9    103    13     13  ok
  10     99    14     17  ok
  11    103    11     19  ok
TOTAL words 1136  cues 123  runtime at 120 wpm 9:28.0  beats 11  failing beats 0
```

No MISSING SECTION or CITATION lines. Forbidden-phrase scan of narration clean (no "concentration of water", no component-potential names, no ψs/ψp, no "L1"-style lesson names).

## CHECK RESPONSE (round 1)

Check: `r1/4.2.6/CHECK.md` (27 September 2026, NOT CLEARED). Only this storyboard was edited; nothing committed or pushed.

| ID | Status | What changed |
|---|---|---|
| M1 — one shared turgid endpoint | applied | State table now defines `plant-taking-up-water` (lesson-local transition; label **becoming more turgid; water uptake in progress**), `plant-turgid` (canonical shared endpoint: "protoplast pressed firmly against the wall; water potentials equal; no net arrow; water molecules continue crossing both ways at equal average rates"; label **turgid · water potentials now equal · no net movement**) and `plant-turgid-equilibrium` ("compatibility alias of `plant-turgid`, with exactly the same geometry, flux and labels"), using the check's wording verbatim. Beat 7 narration "fully turgid" → "**the cell becomes more turgid**"; its cue *becomes more turgid* launches/labels `plant-taking-up-water`; the lettuce inset shows the canonical endpoint with no net arrow. Beat 8 action 1 replaced verbatim; actions 4–5 replaced verbatim (split at the replay cue), with the state change to canonical `plant-turgid` on the equality cue, retained by the board. `cell-vs-solution:equalise` paragraph replaced verbatim ("crossings per model-time window … 15/5 → 13/7 → 11/9 → 10/10 … net inward values 10 → 6 → 2 → 0 …"). Datasets row, board slot, Beat 11 reject-card slot reference updated to `plant-turgid`. |
| M2 — no osmosis across a ruptured membrane | applied | Cut 1 taken: "Cells are bathed in watery solutions, wrapped in a membrane that water crosses all the time, in both directions." deleted and Beat 1 action 4 (magnifier) removed. Global motion contract replaced verbatim ("In all intact-cell states, water tokens cross … In `rbc-haemolysed`, the membrane is ruptured: remove the osmosis net arrow and crossing counter …"). Beat 1 action 3 and Beat 11's final arrow instruction replaced verbatim ("Attach **water entered before haemolysis** to the swelling-stage thumbnail, not an inward osmosis arrow to the burst ghost. The leaf's completed turgid inset likewise carries a past-event label **water uptake restored turgor** …"); Beat 1 keeps an inward arrow only on the still-stiffening leaf. Beat 5 action 7 removes counter and net arrow at rupture. |
| M3 — objectives pictograms at entry | applied | Beat 2 action 1 opening replaced verbatim ("From the first frame, the objectives' styled surface contains all three flat authored pictograms … Their text slots are empty …"); actions 1–3 now reveal text and brighten the already-visible pictogram. No narration change. |
| M4 — real-sample composition and limits | applied with interpretation | Beat 5 opening replaced verbatim: "**Take a red blood cell, drawn here as a model. It contains water, dissolved salts and haemoglobin; we compare its outline as water moves in or out, without measuring its water potential.**" Cues *compare its outline* (outline highlight + micrograph/drawn-fallback inset) and *without measuring its water potential* (limitation tag); **haemoglobin-containing cell contents** label kept through dispersal. Beat 6 adds "**Saline is sodium chloride dissolved in water; here its concentration is chosen to keep the cells' volume steady.**" with a simple vessel labelled **sodium chloride solution; matched conditions in this example** (bag silhouette removed); saline row added to Real-world samples. Beat 7: the check says "final three sentences"; taken literally that would also delete "The wall resists expansion, so it stretches only slightly and the cell does not burst", which the check's biology ruling relies on, so only the two lettuce sentences (three clauses: "That is the lettuce … It shows turgor returning; it does not measure a water potential.") were replaced, verbatim, by "**That explains the lettuce: its living cells contain water and dissolved cell-sap solutes. Water entry restores turgor and the leaf firms up. This works as a qualitative demonstration when the cells are intact; a dead or badly damaged leaf may not recover. Firmness does not measure water potential.**" Cues *dissolved cell-sap solutes* (vacuole inset) and *when the cells are intact* (fit/limitation note). "No real material is handled in this lesson" → "**All examples are schematic; the lettuce handling is illustrated, not a recorded experiment.**" |
| M5 — exam-evidence claim scope | applied | Beat 11 first two sentences replaced verbatim: "**How this reaches you. None of the cited question parts in the five-paper Paper 2 sample directly tests this outcome. So this close follows the syllabus: explain water movement in water-potential terms and compare its effects on plant and animal cells.**" Exposure cue now *None of the cited question parts*; on-screen **direct exposure in the cited Paper 2 blocks: 0/5** retained, with small type limiting it to the cited blocks. Absolutes sweep updated. |
| SF1 — plasmolysis wording | applied (cut 6 taken) | "Plasmolysis is a plant-cell term; it needs a wall to pull away from." deleted; the local label **no wall: crenation, not plasmolysis** kept (Beat 9 action 8, now unnarrated after *not air*). |
| SF2 — model-state bookkeeping | applied | "all ten states the plan lists" → "**the eight shared states, plus local equality/compatibility states specified here**", with `plant-taking-up-water` listed separately (Models used, scope ledger, reusable models, assets). 4.2.5 consumer list → **`plant-turgid`, `plant-equal`, `plant-flaccid`**. |
| SF3 — recap wall count | applied | Beat 10 action 6: "the two plant-row walls" → "**all three plant-row walls**". |
| SF4 — lower-column plant label | applied | Board slot, Beat 9 action 8 and Beat 10 recap label: **with sufficient further water loss: plasmolysed**. Narration "With further loss" unchanged. |
| SF5 — clock | applied | Clock replaced by a **small unnumbered time-passing graphic** (no elapsed-minute figures) in Handling, Beats 1, 7, 11 and Assets; caption *time compressed; our example; nothing measured* retained; first-contact start kept. |
| Runtime ruling (cuts 1, 3, 4, 6) | applied | Cut 1 (M2); cut 3 "The same language turns up inside other answers:" deleted (next sentence capitalised, cue *A November 2020 phloem explanation*); cut 4 "First, the idea that does the explaining." deleted (the **water potential** caption moved to *describes water's tendency to move*); cut 6 (SF1). Cuts 2 and 5 kept. Remaining overrun accepted per the ruling; word-count table, beat windows and "Length, honestly" recounted. |
| Citation audit / UNVERIFIED | applied | UNVERIFIED 2 and 3 recorded as **RESOLVED (round-1 check, PDF-CHECKED)** with the check's page references and wording; citation rows 2–3 status upgraded, "our paraphrase" retained. UNVERIFIED 1 reworded to "no direct example identified in this cited set"; 4 and 5 remain open (5 annotated as not resolved by the exam PDFs). |

New narration: **1,136 words = 9:28.0** at 120 wpm (was 1,147 = 9:33.5; 73 s over the 8:15 budget, accepted by the check's runtime ruling). Rendered still-frame verification remains pending.

TOTAL words 1136  cues 123  runtime at 120 wpm 9:28.0  beats 11  failing beats 0

## CHECK RESPONSE (round 2)

Check: `r2/4.2.6/CHECK.md` (27 September 2026, CLEARED WITH MINOR EDITS; source SHA-256 matched before editing). Only this storyboard was edited; nothing committed or pushed. No narration changed, so cues, word counts, typicality sweep, absolutes sweep, citations, UNVERIFIED list and datasets are unchanged.

| ID | Status | What changed |
|---|---|---|
| 1 — Schedule the explicit holds | applied | Beat-section sentence replaced verbatim: "**The narration ledger excludes two separately scheduled holds: 1.5 seconds after Beat 9's narration on the labelled plasmolysis gap, and 2 seconds on Beat 11's final frame. Recap highlights and settling otherwise occur within its allocated beat time. All holds remain anchored to the displayed cells and labels.**" Final runtime statement (opening of "Length, honestly", now "after round-2 check") replaced verbatim: "**Narration: 1,136 words at 120 wpm = 9:28.0. Add Beat 9's 1.5-second settle and Beat 11's two-second final hold: total 9:31.5, 1:16.5 over the 8:15 budget. This overrun is accepted. No case or required sample explanation is cut, and narration is not accelerated.**" (the round-1 cut bookkeeping after it retained). Headings set to the exact windows **Beat 9 6:55.5–7:48.5**, **Beat 10 7:48.5–8:38.0**, **Beat 11 8:38.0–9:31.5**; earlier headings left provisional; narration ledger table unchanged. |
| 2 — State-table heading | applied | "Label (always the initial comparison)" → "**Label (initial condition and current state, as applicable)**". Canonical endpoint label *water potentials now equal* unchanged. |
| 3 — Interpretation 10 | applied | Replaced verbatim: "**Micrograph.** The plan permits an optional sourced micrograph. Beat 5 compares cell outlines in a labelled inset: use a micrograph only with its source and preparation identified; otherwise use the explicitly labelled drawn model of a light-microscope view. Neither option is a measurement of water potential." |

Narration: **1,136 words = 9:28.0**; with both scheduled holds, total **9:31.5** (1:16.5 over the 8:15 budget, accepted by the check).

TOTAL words 1136  cues 123  runtime at 120 wpm 9:28.0  beats 11  failing beats 0
