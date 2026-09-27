# 4.2.1b — Active transport and bulk transport

**Storyboard, first draft. Cloud run 006, 27 September 2026.** No audio, no code, no render. Folder `storyboards/topic-04/4.2.1b/`. The second of two linked lessons on outcome 4.2.1; it owns active transport, endocytosis and exocytosis, the facilitated-diffusion versus active-transport comparison and carrier saturation. It opens with a brief labelled recall of 4.2.1a's passive processes on the `FluidMosaicMembrane`, then stands alone (own hook, context, objectives, explanation, recap and exam close).
Cambridge 9700 syllabus 2025–2027, p.21. Command words **DESCRIBE and EXPLAIN**. Budget from `TOPIC-PLAN-04-MEMBRANES.md` (4.2.1 section, lesson list, words-and-runtime table) and `TOPIC-04-WEIGHTS.md` (4.2.1 row, 22:00 across 4.2.1a and 4.2.1b; register E46, E47): **4.2.1b 11:15 = teaching 8:45 (about 1,050 words) + 2 complete error beats × 1:15; 11 teaching beats + 2 error beats (E46, E47)**; delivered here as **13 beats** (11 teaching + 2 error). 4.2.1 as a whole: direct exposure in 4 of 5 cited Paper 2 blocks, 15 overlapping marks. Runtime estimated at **120 words per minute of final video** (words ÷ 120).

> **4.2.1** describe and explain the processes of simple diffusion, facilitated diffusion, osmosis, active transport, endocytosis and exocytosis

(syllabus p.21; this lesson owns active transport, endocytosis and exocytosis, plus the comparison of facilitated diffusion with active transport and carrier saturation; simple diffusion, facilitated diffusion and osmosis are 4.2.1a's and are recalled by label only.)

**Authorities read:** `work/006/SHARED-SPECS.md` (in full; binding); `plan/topic-04/TOPIC-PLAN-04-MEMBRANES.md` (in full: scope and evidence rules, chemistry-and-motion paragraph with the MF4 model guard, visual integrity, REAL-WORLD SAMPLES rule, 4.2.1 section including "What we teach — 4.2.1b", E46 and E47, lesson list, shared-model table, traps table, UNVERIFIED register, PLAN-CHECK RESPONSE); `plan/topic-04/TOPIC-04-WEIGHTS.md` (in full: 4.2.1 row and paragraph, ledger rows W22/23 Q2(a)(i), S23/21 Q1(b)(i), S23/21 Q3(b)(i), S21/22 Q5(b)(ii), M24/22 Q1(b)(ii), supplementary S-E, register E46 and E47); `cloud-inputs/003/standards/VIDEO-STRUCTURE.md` (all); `CONTENT-ARCHITECTURE.md`; `SYLLABUS-9700-DETAIL.md` Topic 4 (pp.21–22), apparatus and materials (pp.57–58; none used here) and mathematical requirements (p.63; none used here); the cleared examples `cloud-inputs/006/examples/3.1.3/STORYBOARD.md` and `cloud-inputs/006/examples/3.2.1b/STORYBOARD.md`; `cloud-inputs/003/topic-03/3.1.1-2/CHECK.md` and `3.2.2-3/CHECK.md`; the plan check `cloud-checks/006/plan/CHECK.md` (branch `origin/cloud/006-checks`); `cloud-inputs/006/evidence/GATE-CRITERIA-9700-04-CELL-MEMBRANES-AND-TRANSPORT.md` (4.2.1 rows, for context only). No question paper, mark scheme or examiner report PDF was opened for this draft; every exam quotation is copied from the SHARED-SPECS §2 verbatim list; everything else is our wording, labelled *our framing* or *our paraphrase*, or listed as `UNVERIFIED`. **Round-one fix (27 September 2026):** the independent round-one check verified all exam items against the original QP/MS/ER PDFs; the eight UNVERIFIED items are recorded as resolved under *Citations*.

**Build position:** fifth of the ten Topic 4 lessons: 4.1.1-2 → 4.1.3 → 4.1.4 → 4.2.1a → **4.2.1b** → 4.2.6 → 4.2.2a → 4.2.2b → 4.2.3-4 → 4.2.5.

**Models used (by name and state id):** `FluidMosaicMembrane` (4.1.1-2; `full`, `highlight:intrinsic-carrier`, `highlight:intrinsic-channel`); `PhospholipidToken` (4.1.1-2, inside the membrane); `DiffusionField` (4.2.1a; recall only, across the membrane normal); `WaterPotentialModel` (4.2.1a; a recall thumbnail in Beat 2 only); `TransportProteinSet` (4.2.1a; `channel-open`, `carrier-bind`, `carrier-flip`, `carrier-release`, `carrier-reset`); `VesicleTransport` (4.1.4; `exocytosis`); `SignallingScene` (4.1.4; the secreting beta cell only, as a recall miniature); `EnzymeActiveSiteModel` (Topic 3, 3.1.1-2; `rest-lk` miniature, recall by label in E47 only). **Models published here:** `TransportProteinSet` state `pump-ATP`; `VesicleTransport` states `phagocytosis` and `pinocytosis`; `UptakeGraph` (with its four-carrier occupancy inset); the `RootHairScene` explain-beat model (a drawn root hair cell in soil; not reused downstream). Everything drawn is a **MODEL**, captioned *schematic; not to scale*; particle fields carry *particles drawn schematically; not to scale; far fewer than real*.

---

## The causal spine

One idea carries the lesson: **when a cell moves something the passive processes cannot move for it (against a concentration gradient, or too large for a transport protein) the cell spends energy from ATP.**

> **Active transport is the movement of molecules or ions across a membrane against their concentration gradient, from lower to higher concentration, through carrier proteins, using energy from ATP made in respiration: the substance binds the carrier's binding site, ATP is hydrolysed, and the carrier changes shape to release it on the other side. Bulk transport moves material in vesicles, also using energy from ATP: in endocytosis the cell surface membrane surrounds material and pinches off a vesicle inside the cell (phagocytosis for solids, pinocytosis for liquids); in exocytosis a vesicle fuses with the cell surface membrane and releases its contents outside. Because the number of carrier proteins in a membrane is limited, carrier-mediated uptake levels off to a plateau when the carriers are occupied.**

**What the mark schemes credit, quoted (PDF-CHECKED (plan check)):** [W22/23 Q2(a)(i), MS p.9] `R active transport` for the macrophage engulfing bacteria (the same point accepts active process/ATP/energy: plan-check description, not the scheme's wording). [S23/21 Q1(b)(i), MS p.8] `endocytosis / pinocytosis ; R phagocytosis` for inward budding at X from a plant cell surface membrane during vacuole development. [R23 p.12, June 2023 P21 Q3(b)(i)] “Some thought that the membrane protein was an enzyme with an active site, rather than a carrier protein with a binding site.” (the report also records stopping/peak-versus-plateau errors: description, not quoted). **Described, never quoted** (our descriptions; PDF-CHECKED (independent round-one check, 27 September 2026); displayed question/answer summaries remain our wording.): [M24/22 Q1(b)(ii), 3 marks, MS p.6] one similarity and two differences between facilitated diffusion and active transport; the conformational-change similarity is conditional on a carrier context, with an incorrect channel context rejected. [S23/21 Q3(b)(i), 2 marks, MS p.11] plateau/constant uptake and carriers at capacity (grape hexose transporters inserted into mutant yeast, QP pp.8–9); saturation alone is not a universal way to distinguish active from facilitated transport. [S21/22 Q5(b)(ii), 1 mark, MS p.16] release of pectin from plant cells by exocytosis. So the spine is what is credited: against the gradient, carrier proteins, ATP; vesicles, not carriers, for engulfing; pinocytosis for fluid uptake; a plateau explained by a limited number of occupied carriers with binding sites; direction and energy as the two differences.

**The handle:** *a revolving door* for a carrier protein (VIDEO-STRUCTURE's own example; the subject's own image). Someone steps into one compartment, the door turns, and they step out on the other side; the door never stands open straight through. **Converted at once, in the same beat (Beat 4):** *a carrier protein binds a specific molecule or ion and changes shape to move it across the membrane*; for active transport, *energy from ATP drives that change of shape against the gradient*. The handle is never the exam answer; it is not repeated in any exam-form or error beat.

**Typicality rules applied.** Root hair cells "can" take up mineral ions when "some" ions are already more concentrated inside; the animated carrier is a **simplified directly ATP-driven carrier model with a generic ion**, never labelled a nitrate or any named root transporter, and the root example illustrates only energy-dependent accumulation (MF4 guard); co-transport is not taught or mentioned. Channel and carrier are kept as two mechanisms; the change-of-shape similarity is said "if the facilitated diffusion uses a carrier protein". Simple diffusion's line "keeps rising across this range" (not for ever). At the plateau "nearly every carrier is occupied at any moment" in the teaching beat; "all their binding sites are occupied" appears only as the plan's E47 repair wording. "Carriers in facilitated diffusion and in active transport can both level off like this", so a plateau alone is not a test for active transport (plan check). The ATP source is "respiration"; the narration makes no organelle claim, and the drawn mitochondria in the root hair carry the label *respiration → ATP* as a schematic, not a statement that all of the cell's ATP comes from them. The examples of bulk transport are "such as these"; no claim that every protein leaves a cell by exocytosis or that every vesicle uptake is phagocytosis. Reasons students err are offered as possibilities ("It can feel right, since…", "so the words can merge"). "Some", never "most", for the R23 diagnosis. MS R lines are question-local (phagocytosis stays correct for the macrophage).

**Two error beats, each with the five moves** (announce → written card → 4 s silent read → cue-synced talk-through → correct in place), woven where each belongs: **E47 in Beat 8** (after the uptake graph is explained), **E46 in Beat 11** (after endocytosis and exocytosis are taught). Both badges **COMMON MISTAKE**: E47 on an examiner-report diagnosis (R23 p.12, "Some thought…"), card *our framing of S23/21 Q3(b)(i); constructed answer, not a transcript*, two faults; E46 on two explicit mark-scheme reject lines, card *composite of two questions*, two faults, with the plan check's exact S23/21 X caption. In both, the marker clears only on the completed correct frame. Wrong answers are written, never spoken as claims; a wrong word is named only as "the word … here".

---

## The models, specified once

Orientation fixed across the topic: **outside the cell at the top, cytoplasm at the bottom**; every gradient runs across the membrane, along its normal. Colour roles as SHARED-SPECS §4: phospholipid heads warm amber, tails mid grey, proteins teal, carbohydrate chains green bead chains, ion tokens small violet circles with +, glucose tokens orange hexagons, water tokens small pale blue circles, ligand shapes magenta, ATP token a yellow rounded tag; error/contrast treatment terracotta. Carbohydrate chains on the external face only; no phospholipid flip-flop; nothing crosses between leaflets.

### `FluidMosaicMembrane` (4.1.1-2; reused by state id)
Bilayer section, 12 phospholipids per leaflet, components at their fixed positions (`intrinsic-channel` 4–5, `intrinsic-carrier` 10–11 with its binding-site notch facing outside at rest, `glycoprotein` 12, `receptor-glycoprotein` 8–9, `cholesterol`, `glycolipid`, `extrinsic`). Region labels *outside the cell (watery)*, *cytoplasm (watery)*, *hydrophobic core*. States used: `full`, `highlight:intrinsic-carrier`, `highlight:intrinsic-channel`. Lateral drift only.

### `DiffusionField` (4.2.1a; recall only)
Tokens with random motion; gradient across the membrane (outside top); a net-movement arrow along the membrane normal; a crossing counter shown here **without numbers** (*outside → cytoplasm: more · cytoplasm → outside: fewer*); at equality the net arrow fades while crossings continue.

### `TransportProteinSet` (4.2.1a passive states reused; **`pump-ATP` published here**)
- `channel-open` (4.2.1a): ion tokens enter the water-filled pore and pass through, down the gradient; the channel never changes shape to move a solute.
- `carrier-bind` → `carrier-flip` → `carrier-release` → `carrier-reset` (4.2.1a): the solute seats in the notch (0.6 s); the protein changes shape over 0.8 s (motion; silhouettes interpolate; no cut) so the notch faces the other side; the solute leaves (0.5 s); the protein returns (0.8 s). In this lesson the passive carrier moves a glucose token (orange hexagon) **down** its gradient, outside (more) → cytoplasm (fewer), with no ATP token anywhere near it.
- **`pump-ATP` (published here).** The `intrinsic-carrier` of the membrane, labelled **carrier protein** and **binding site**. Generic ion tokens (small violet circles with +), **drawn counts 4 outside, 12 in the cytoplasm at the start** (schematic; see *Datasets*). Sequence, one cycle ≈ 3.5 s: (1) an ion from the outside face moves into the outward-facing binding-site notch and seats (0.6 s); (2) an ATP token (yellow rounded tag reading **ATP**) drifts up and docks on the carrier's **cytoplasmic** face (0.4 s); (3) **on the frame the shape change starts, the ATP token switches in one rendered frame to two tokens, *ADP* (yellow tag) + *Pi* (small yellow disc)**; no cross-fade; (4) the carrier changes shape over 0.8 s (motion) so the notch faces the cytoplasm; (5) the ion leaves into the cytoplasm (0.5 s), where the ion tokens are denser; ADP and Pi drift away into the cytoplasm; (6) the carrier returns to its original shape over 0.8 s, notch facing outside again. Captions on screen **throughout every cycle**: *ATP hydrolysed; energy used to change the carrier's shape; not a mechanism* and *simplified directly ATP-driven carrier model; generic ion*. The ion is never labelled with a name (no nitrate, sodium, potassium); no second solute ever binds (no co-transport). A small gradient bar beside the membrane reads *fewer ions outside · more ions in the cytoplasm (drawn counts, schematic)*, with a direction arrow **against the gradient** along the membrane normal. Replays run the same cycle; each replay performs the one-frame token switch again. A replay reset is an explicitly labelled restart of the schematic example, never an unexplained instantaneous movement of a solute through the bilayer. Count updates occur only on actual transport events.

### `VesicleTransport` (4.1.4 `exocytosis` reused; **`phagocytosis` and `pinocytosis` published here**)
- `exocytosis` (4.1.4): a vesicle (a small closed bilayer circle: outer-leaflet heads face cytoplasm; inner-leaflet heads face the aqueous vesicle lumen; tails face one another between the leaflets) travels to the cell surface membrane, its bilayer merges with the membrane (motion; the vesicle membrane becomes part of the cell surface membrane), contents released outside. Content variants used here: magenta insulin tokens (4.1.4's ligand), teal enzyme miniatures (Topic 3 `EnzymeActiveSiteModel` silhouette at 0.2 scale, labelled *digestive enzymes (recall: 3.1.1, extracellular enzymes)*), green bead-chain fragments labelled *pectin* moving to the cell wall of a plant cell.
- **`phagocytosis` (published here).** A macrophage (large irregular cell outline, nucleus drawn as a plain oval, labelled **macrophage**) and one rod-shaped bacterium (neutral grey-brown outline, labelled **bacterium**; no stain colour claimed). Motion, ≈ 3 s: the cell surface membrane extends as two arms around the bacterium (1.2 s), the arm tips meet and fuse (0.4 s), the enclosed bacterium pinches off into a vesicle inside the cell (0.8 s), labelled **vesicle**; the vesicle drifts inward (0.6 s). The bacterium never passes through the bilayer or any protein. Tag *energy from ATP* beside the extending membrane (a static yellow tag; no token reaction for bulk transport).
- **`pinocytosis` (published here; our adaptation of S23/21 X).** A short section of a **plant cell surface membrane** with the cell wall drawn as a plain band above it (outside at the top; *cell wall (freely permeable)*), and a thin film of external fluid with pale blue water tokens and a few violet dissolved tokens against the membrane. Motion, ≈ 2.5 s: the membrane dips **inward** (downward) around a small droplet of the fluid (1.0 s), the rim closes (0.5 s), a **small vesicle** buds off into the cytoplasm carrying the fluid and its dissolved tokens (1.0 s). Tag *energy from ATP*. Caption, whenever this state is on screen: *our simplified fluid-uptake drawing; an adaptation of S23/21 X, not a reproduction of the complete diagram*.

### `UptakeGraph` (published here)
Axes **rate of uptake** (y) against **external concentration** (x), no numbers, no units printed. Two traces, each labelled at its end: **simple diffusion** (a straight line from the origin, rising across the whole plotted range) and **uptake by carrier proteins** (from the origin, rising steeply, then levelling off to a horizontal **plateau**, never falling; small type under the label *facilitated diffusion or active transport*). Caption *schematic model; not measured data; the heights of the two traces are not comparable*. Region labels added in Beat 7: **carriers free: rate rises** (rising part) and **plateau: carriers occupied; rate constant at its maximum** (levelled part). **Inset:** four carrier proteins in a short membrane strip (the `pump-ATP` silhouette at 0.3 scale, **no ATP tokens in the inset**, since the inset is shared by both carrier processes), with solute tokens outside. As a cursor moves along the x-axis the inset fills: at low concentration one of four carriers is occupied at a time; at the plateau all four cycle continuously (each release followed almost at once by the next binding), tag *still transporting*. Occupancy counts are drawn, not data.

### `RootHairScene` (published here; explain beats 1, 5, 12, 13)
A root hair cell (elongated outgrowth of an epidermal cell, cell wall outline, cell surface membrane, large vacuole, cytoplasm with a few mitochondria drawn as small ovals) among soil particles (brown irregular shapes) with a film of soil water (pale blue). Violet ion tokens: **drawn counts 3 in the soil-water film beside the hair, 10 inside the cell**. Compare equal-volume sampling windows on each side, with token density proportional to the indicated concentration. Whole-cell totals do not define a concentration gradient. Along the root hair's cell surface membrane, four small teal carrier icons, each with a yellow *ATP* tag. Labels *soil water: lower concentration of these ions (drawn counts)* and *root hair cell: higher concentration (drawn counts)*. Tag, whenever the carriers are visible: **generic carrier icons; illustrates energy-dependent accumulation; not a drawing of any named root transporter**. Caption *schematic; not to scale*. Motion: an ion token near a carrier icon moves inward through it (icon only, no mechanism shown at this scale); the mitochondria pulse once when *respiration* is said, and yellow ATP tags travel from them to the carrier icons.

**Motion contract for the lesson.** Carrier shape changes, vesicle budding, pinching off, travel and fusion are motions, never cuts between stills. The **only** reaction drawn is the ATP token switch in `pump-ATP` (one rendered frame, captioned). No atom-resolved structure, no bond graph, so no valence audit applies. No flip-flop. The passive carrier (4.2.1a states) never shows an ATP token. The channel never changes shape to move a solute.

---

## Beat by beat

Beat windows in the headings are provisional (words ÷ 120 per beat, plus the 4 s silent read in each of Beats 8 and 11, per SHARED-SPECS §2a); the runtime table below is authoritative and final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch over 30 words without a stated visual change.

### BEAT 1 · Hook and context · 0:00–0:45
**Narration:**
> Ever wondered how a root hair cell keeps taking in mineral ions from the soil, when it can already hold more of some of them than the soil water around it? Many cells hold substances at concentrations very different from their surroundings, and some of what cells move is far too big for the channel and carrier proteins you have met: a whole bacterium engulfed by a macrophage, or enzymes sent out of a pancreatic cell. Both jobs cost the cell energy; this lesson is how it is spent.

**Visual action:**
1. From the first frame, the `RootHairScene` is on screen: a drawn root hair cell reaching into soil, soil particles and the soil-water film around it, caption *schematic; not to scale*; the hook question is a compact caption beside the cell, never alone on the frame. At *Ever wondered how a root hair cell*, a violet ion token in the soil water drifts to the root hair and moves inside (icon-level motion, no mechanism).
2. At *more of some of them*, the ion tokens are counted into place, **3** in the soil-water film and **10** inside the cell, with the two labels *soil water: lower concentration of these ions (drawn counts)* and *root hair cell: higher concentration (drawn counts)*.
3. At *Many cells hold substances*, the view pulls back to three small panels in a row: the root hair (left), a macrophage beside a rod-shaped bacterium (centre), a pancreatic cell with vesicles near its surface (right), each caption *schematic*.
4. At *far too big for the channel and carrier proteins*, a small `FluidMosaicMembrane` strip with a channel and a carrier appears beneath the centre panel, and the bacterium outline is drawn beside it at the same scale, dwarfing both proteins, tag *drawn to relative scale only as a sketch*.
5. At *a whole bacterium engulfed by a macrophage*, the centre panel brightens: the macrophage membrane starts to extend towards the bacterium and freezes mid-reach. At *enzymes sent out of a pancreatic cell*, the right panel brightens: a vesicle nears the membrane and holds.
6. At *Both jobs cost the cell energy*, a yellow **ATP** tag lands on each of the three panels. At *how it is spent*, the three panels shrink and dissolve to the recall surface.

**On-screen text:** the hook question (caption beside the root hair); the two drawn-count labels; three yellow *ATP* tags; *schematic; not to scale*.

---

### BEAT 2 · Recall: the passive processes from 4.2.1a · 0:45–1:41
**Narration:**
> First, a quick recall of the passive processes. Particles move randomly, and where there is a concentration gradient, more of them cross from the higher concentration to the lower than the other way, so there is a net movement down the gradient. Oxygen, small and non-polar, diffuses straight through the bilayer. Ions and polar molecules take facilitated diffusion, through channel proteins or carrier proteins. Osmosis is the net movement of water from higher to lower water potential through a partially permeable membrane. None of these uses energy from ATP. In these diffusion models, net movement ends when concentrations are equal; in osmosis, when water potentials are equal. Particles keep crossing both ways.

**Visual action:**
1. From the first frame, the `FluidMosaicMembrane` (`full`) fills a plain recall surface, *outside the cell (watery)* at the top and *cytoplasm (watery)* at the bottom, caption *schematic; not to scale*; the tag **recall: 4.2.1a** sits top left for the whole beat. At *a quick recall of the passive processes*, a `DiffusionField` overlays both faces, caption *particles drawn schematically; not to scale; far fewer than real*.
2. At *Particles move randomly*, the tokens jitter; at *more of them cross from the higher concentration*, more tokens cross top → bottom than bottom → top and the crossing counter lands without numbers (*outside → cytoplasm: more · cytoplasm → outside: fewer*); at *net movement down the gradient*, the net-movement arrow draws along the membrane normal, pointing down.
3. At *Oxygen, small and non-polar*, O₂ tokens (two joined red circles) pass straight through the phospholipids, tag **simple diffusion**.
4. At *Ions and polar molecules*, `highlight:intrinsic-channel`: ion tokens run `channel-open`, down the gradient, the channel unchanged in shape; at *channel proteins or carrier proteins*, `highlight:intrinsic-carrier`: a glucose token runs `carrier-bind` → `carrier-flip` → `carrier-release` → `carrier-reset`, down its gradient; tag **facilitated diffusion**.
5. At *Osmosis is the net movement of water*, a vertical `WaterPotentialModel` thumbnail slides in at the right edge (membrane rotated, relabelled *membrane*), water tokens crossing both ways with the net arrow towards the lower water potential; tag **osmosis** and small type *recall: 4.2.1a (water potential)*.
6. At *None of these uses energy from ATP*, a yellow **ATP** tag appears at the edge of the frame, is struck through with a thin line and fades, and the three tags **simple diffusion · facilitated diffusion · osmosis** gain a shared bracket **passive: no ATP**.
7. At *when concentrations are equal*, show equal concentrations of the relevant solute on the diffusion panels and fade their net arrows while crossings continue. At *when water potentials are equal*, show equal water-potential labels on the osmosis thumbnail and fade its net arrow while water continues crossing both ways. Do not label equal water potentials as equal solute concentrations. At *Particles keep crossing both ways*, highlight the continuing two-way motion in all panels.

**On-screen text:** *recall: 4.2.1a*; *simple diffusion*, *facilitated diffusion*, *osmosis*; *passive: no ATP*; the counter without numbers; equal-concentration labels (diffusion panels); equal-water-potential labels (osmosis thumbnail).

---

### BEAT 3 · What you will be able to do · 1:41–2:05
**Narration:**
> By the end you will be able to explain how active transport moves ions against their concentration gradient using energy from ATP; describe endocytosis, in its two forms, and exocytosis; and compare facilitated diffusion with active transport, including what a levelling uptake graph does and does not tell you.

**Visual action:**
1. From the first frame, show all three flat authored pictograms on the objectives' own styled surface: carrier and arrow, budding/fusing vesicles, and paired direction arrows. Keep the text slots empty initially. At each existing objective cue, reveal its text and brighten the already-visible matching pictogram. This is a separate objectives surface, not the detailed lesson diagram. At *explain how active transport moves ions*, line 1's text enters and its pictogram brightens: a simple rounded carrier shape with a small upward arrow through it and a small tag outline beside it.
2. At *describe endocytosis, in its two forms, and exocytosis*, line 2's text enters and its already-visible pictogram brightens: a curved membrane line pinching off a small circle, and a small circle merging into a line.
3. At *compare facilitated diffusion with active transport*, line 3's text enters and its already-visible pictogram brightens: two short arrows, one pointing down and one pointing up, side by side; at *a levelling uptake graph*, a second pictogram joins line 3: blank axes with one rising-then-level stroke, no labels and no values.

Objective lines, as they land:
- **EXPLAIN** active transport: against the gradient, carrier proteins, energy from ATP
- **DESCRIBE** endocytosis (phagocytosis, pinocytosis) and exocytosis
- **COMPARE** facilitated diffusion with active transport, and interpret an uptake graph that levels off

Small type: *syllabus 4.2.1, p.21: "describe and explain".*

**On-screen text:** the three objectives with pictograms; the syllabus line.

---

### BEAT 4 · Active transport: a revolving door, driven by ATP · 2:05–3:12
**Narration:**
> Now active transport: the movement of molecules or ions across a membrane against their concentration gradient, from lower to higher concentration, through carrier proteins, using energy from ATP. Picture a revolving door: someone steps into one compartment, the door turns, and they step out on the other side, without the door ever standing open straight through. Written properly: a carrier protein binds a specific molecule or ion and changes shape to move it across the membrane. For active transport, energy from ATP drives that change of shape against the gradient. An ion from outside, where there are fewer, fits the binding site. ATP is hydrolysed to ADP and phosphate, and the carrier changes shape; the ion is released into the cytoplasm, where there are already more. Then the carrier returns to its original shape.

**Visual action:**
1. From the first frame, the `FluidMosaicMembrane` is on screen in `highlight:intrinsic-carrier`, outside at the top, the carrier at rest with its binding-site notch facing outside, caption *schematic; not to scale*. At *Now active transport*, the view zooms to the carrier; violet ion tokens settle at the drawn counts, **4 outside** and **12 in the cytoplasm**, with the gradient bar *fewer ions outside · more ions in the cytoplasm (drawn counts, schematic)*.
2. At *against their concentration gradient*, an arrow draws along the membrane normal from outside to cytoplasm, labelled **against the gradient**; at *from lower to higher concentration*, the two drawn counts pulse in turn (4, then 12). At *through carrier proteins*, the label **carrier protein** lands on the carrier; at *using energy from ATP*, a yellow **ATP** tag waits in the cytoplasm below the carrier.
3. At *Picture a revolving door*, an analogy inset opens at upper right (tag *analogy only*): a revolving door seen from above, four compartments; at *the door turns*, a figure steps into one compartment and the door rotates a quarter turn; at *step out on the other side*, the figure steps out; at *without the door ever standing open straight through*, a dashed straight line through the door's centre is drawn and struck, side-note *no open passage*.
4. At *Written properly*, the inset dims and the creditworthy sentence writes beneath the membrane, clause by clause: at *binds a specific molecule or ion*, **a carrier protein binds a specific molecule or ion** and the label **binding site** lands on the notch; at *changes shape to move it across the membrane*, **and changes shape to move it across the membrane**.
5. At *energy from ATP drives that change of shape*, the second line writes: **Active transport: energy from ATP drives that change of shape against the gradient.** The inset fades.
6. At *An ion from outside*, `pump-ATP` begins; both captions appear and stay for every cycle: *ATP hydrolysed; energy used to change the carrier's shape; not a mechanism* and *simplified directly ATP-driven carrier model; generic ion*. At *fits the binding site*, an outside ion moves into the notch and seats (0.6 s), tag **binds**; the ATP token docks on the cytoplasmic face.
7. At *ATP is hydrolysed to ADP and phosphate*, switch ATP to ADP + Pi in one rendered frame and start the carrier's 0.8 s conformational change on that same frame. Keep the bound ion attached to its binding site during the movement. At *the carrier changes shape*, highlight the resulting inward-facing conformation and its **changes shape** label; do not restart the movement or hydrolysis. Retain both model captions throughout.
8. At *the ion is released into the cytoplasm*, the ion leaves the notch and joins the denser cytoplasm tokens (now **13**; outside **3**), tag **released**; ADP and Pi drift away; at *where there are already more*, the cytoplasm count pulses.
9. At *the carrier returns to its original shape*, return the empty carrier over 0.8 s, notch facing outside, tag **ready again**. Hold the completed single-cycle counts at **3 outside / 13 in the cytoplasm**. Do not perform a second transport cycle in this beat.

**On-screen text:** *carrier protein*, *binding site*; *against the gradient*; the drawn counts; *analogy only*, *no open passage*; the two-line creditworthy sentence; *binds · changes shape · released · ready again*; both captions throughout the cycle.

---

### BEAT 5 · Root hair cells: energy-dependent accumulation · 3:12–4:00
**Narration:**
> Here it is in a real plant. Root hair cells can take up mineral ions from the soil water even when those ions are already more concentrated inside the cell than outside. Net diffusion cannot do that; it would carry the ions out, down their gradient. So this uptake needs energy, and the ATP comes from respiration in the root hair cells. That is energy-dependent accumulation. One honest limit: the carrier you just watched is a simplified, general model with a generic ion. It shows the principle, not how any particular ion enters a root.

**Visual action:**
1. From the first frame, the `RootHairScene` is on screen at full size, soil at left and top, the root hair's cell surface membrane crossing the frame, drawn counts **3** (soil water) and **10** (cell) with their labels; the Beat 4 creditworthy sentence sits small in the lower corner. At *Here it is in a real plant*, the root hair brightens.
2. At *take up mineral ions from the soil water*, the four teal carrier icons appear along the root hair membrane, each with its yellow *ATP* tag, and the tag **generic carrier icons; illustrates energy-dependent accumulation; not a drawing of any named root transporter** lands beside them.
3. At *already more concentrated inside the cell*, one ion moves inward through a carrier icon and the counts update (**2** and **11**), tag *into the higher concentration*.
4. At *Net diffusion cannot do that*, a dashed ghost arrow appears, pointing outward from the cell across its membrane, labelled *net diffusion: down the gradient (outward here)*; at *carry the ions out, down their gradient*, the ghost arrow pulses and a side-note reads *uptake here is against the gradient*.
5. At *this uptake needs energy*, the carrier icons' ATP tags glow; at *the ATP comes from respiration*, the mitochondria in the cell pulse once, label **respiration → ATP**, and yellow ATP tags travel from them to the carrier icons.
6. At *energy-dependent accumulation*, a strap-line lands across the bottom: **uptake against the gradient, using energy from respiration**.
7. At *One honest limit*, a zoom circle opens on one carrier icon and shows the Beat 4 `pump-ATP` silhouette in miniature, with its caption *simplified directly ATP-driven carrier model; generic ion*; at *a simplified, general model with a generic ion*, the generic ion token is ringed. At *not how any particular ion enters a root*, the zoom circle gains small type *the molecular route of any particular ion into a root is not shown in this lesson*.

**On-screen text:** drawn-count labels; the generic-carrier tag; *into the higher concentration*; *net diffusion: down the gradient (outward here)*; *respiration → ATP*; the strap-line; the model caption and small type.

---

### BEAT 6 · Facilitated diffusion and active transport, side by side · 4:00–4:52
**Narration:**
> Put facilitated diffusion and active transport side by side, because examiners ask you to compare them. The similarity: both move particular substances across the membrane through transport proteins. If the facilitated diffusion uses a carrier protein, you can go further: in both, the carrier binds the substance and changes shape. A channel protein provides a pore and does not change shape to carry particles, so that similarity does not hold for a channel. Now two differences. Direction: facilitated diffusion is down the concentration gradient; active transport is against it. Energy: facilitated diffusion is passive and uses no ATP; active transport uses ATP from respiration.

**Visual action:**
1. From the first frame, two membrane panels stand side by side, both from the `FluidMosaicMembrane` (outside at the top), caption *schematic; not to scale*: left **facilitated diffusion** (a passive carrier with glucose tokens, drawn counts 9 outside and 3 in the cytoplasm, and a small `channel-open` channel beside it); right **active transport** (the `pump-ATP` carrier with its ion tokens, 3 outside and 13 in the cytoplasm). A comparison table frame sits empty beneath, headed **similarity · difference 1 · difference 2**, with the key *FD = facilitated diffusion · AT = active transport*. At *Put facilitated diffusion and active transport side by side*, both panels run one cycle together (left: `carrier-bind` → `carrier-reset`, no ATP token; right: `pump-ATP` with its one-frame token switch and caption).
2. At *examiners ask you to compare them*, small type under the table: *form: one similarity and two differences (M24/22 Q1(b)(ii), 3 marks; see Beat 13)*.
3. At *both move particular substances across the membrane through transport proteins*, both proteins glow teal and the similarity cell fills: **both move particular substances through transport proteins**.
4. At *If the facilitated diffusion uses a carrier protein*, the left carrier is ringed; at *the carrier binds the substance and changes shape*, both panels restart their schematic examples under the tag *replay: example restarted* (counts shown at their start values, 9 / 3 and 3 / 13) and both carriers replay their shape change side by side (motion), and the similarity cell gains a second line: **if FD is by a carrier: both bind the substance and change shape**.
5. At *A channel protein provides a pore*, the left panel's channel is ringed and passes ion tokens through its unchanged pore; at *that similarity does not hold for a channel*, a small note attaches to the second similarity line: *carrier only; not for a channel*.
6. At *Now two differences*, the two difference cells pulse. At *Direction*, arrows draw along each membrane normal: left **down the gradient** (higher → lower), right **against the gradient** (lower → higher); the difference 1 cell fills: **FD: down the concentration gradient · AT: against it**.
7. At *Energy*, the left panel is tagged **no ATP (passive)**; at *active transport uses ATP from respiration*, the right panel's ATP token pulses with the caption, and the difference 2 cell fills: **FD: no ATP · AT: ATP from respiration**.

**On-screen text:** the two panel titles; the comparison table (similarity with its carrier-only note; the two differences); *no ATP (passive)*; the form line; the ATP caption on the right panel.

---

### BEAT 7 · Why carrier uptake levels off · 4:52–5:51
**Narration:**
> Now a graph you may be given: the rate of uptake against the concentration outside the cell. For simple diffusion through the bilayer, the rate keeps rising across this range. For uptake by carrier proteins, the rate rises, then levels off. Why? At low concentration many carriers are free at any moment, so more substance means more binding and faster uptake. At high concentration nearly every carrier is occupied at any moment. The number of carrier proteins in the membrane is limited, so uptake stays at its maximum rate: a plateau. And careful: carriers in facilitated diffusion and in active transport can both level off like this, so a plateau alone does not tell you which one is happening.

**Visual action:**
1. From the first frame, the two Beat 6 membrane panels are on screen, small, at the left edge; the `UptakeGraph` axes stand empty at centre-right, caption *schematic model; not measured data; the heights of the two traces are not comparable*. At *Now a graph you may be given*, the axes draw: **rate of uptake** against **external concentration**, no numbers.
2. At *For simple diffusion through the bilayer*, the straight **simple diffusion** trace draws from the origin; an O₂-style token icon passes through a bilayer strip beside its label; at *keeps rising across this range*, the trace's far end pulses, tag *across the plotted range*.
3. At *For uptake by carrier proteins*, the second trace draws, rising steeply; at *then levels off*, it bends to a horizontal plateau and stops at the axis end, labelled **uptake by carrier proteins** with small type *facilitated diffusion or active transport*.
4. At *At low concentration many carriers are free*, the four-carrier inset opens beside the graph (no ATP tokens), a cursor sits on the low-concentration end of the curve, and one of the four carriers is occupied at a time; the rising part gains **carriers free: rate rises**. At *more binding and faster uptake*, the cursor moves up the rising part and the inset shows two, then three, carriers occupied at once.
5. At *nearly every carrier is occupied at any moment*, the cursor reaches the plateau and all four carriers cycle continuously, each release followed almost at once by a new binding, tag *still transporting*.
6. At *The number of carrier proteins in the membrane is limited*, the inset's four carriers are counted **1 · 2 · 3 · 4** and bracketed *limited number of carriers*; at *stays at its maximum rate*, the plateau gains **plateau: carriers occupied; rate constant at its maximum**, and a ghost line dipping below the plateau is drawn and struck, side-note *level, not falling*.
7. At *carriers in facilitated diffusion and in active transport*, the two Beat 6 panels brighten together at the left edge and each gains a small copy of the levelling curve; at *a plateau alone does not tell you which one is happening*, a note beneath the graph: **In this carrier-uptake model, the plateau reflects limited carrier capacity; the plateau alone does not establish ATP use.**

**On-screen text:** axis labels; trace labels and small type; region labels; *still transporting*; *limited number of carriers*; *level, not falling*; the closing note; the caption.

---

### BEAT 8 · COMMON MISTAKE E47: a plateau, carriers and binding sites · 5:51–7:05
**Narration:**
> Here is a mistake the June twenty twenty-three examiners reported, with two faults. Paper 21 asked about the level part of an uptake curve for yeast given a grape hexose transporter. Read this answer.
>
> *(silent read, 4 s)*
>
> Start with the word stops here. Levelling off can look like an ending, but this line is level, not falling to zero: uptake carries on, at a constant, maximum rate. The report records that slip too. The marker stays on for the words active sites of the enzyme. Carriers and enzymes both bind by complementary shape, so the words can merge. The report says some thought the membrane protein was an enzyme with an active site, rather than a carrier protein with a binding site. So: uptake reaches a plateau because the number of carrier proteins is limited and all their binding sites are occupied.

**Visual action:**
1. From the beat's first frame, the `UptakeGraph` with its four-carrier inset holds at left, dimmed, caption *schematic model; not measured data*. **Entry cue: *Here is a mistake the June twenty twenty-three examiners reported*.** The COMMON MISTAKE panel enters (header badge **COMMON MISTAKE**, terracotta border) with its basis line in small type: *basis: examiner report, June 2023 Paper 21 Q3(b)(i), R23 p.12*. It stays on until the completed correct frame.
2. At *Paper 21 asked about the level part*, the header lands: **Explain the shape of the uptake curve at high external hexose concentration.** Small type: *our framing of S23/21 Q3(b)(i) (grape hexose transporters in mutant yeast, QP pp.8–9; the paper's figure is not reproduced); constructed answer, not a transcript*. At *an uptake curve for yeast*, the plateau of the dimmed graph at left is ringed.
3. At *Read this answer*, the written wrong answer appears in handwriting style: **✗** *At high concentrations the uptake stops because all the active sites of the enzyme are full.*
4. **Silent read, 4 s.** Panel and card held.
5. At *Start with the word stops here*, the word *stops* on the card is underlined in terracotta; at *this line is level, not falling to zero*, the dimmed graph's plateau brightens and a ghost line falling to zero is drawn and struck, side-note *level ≠ stopped*.
6. At *uptake carries on, at a constant, maximum rate*, the inset's four carriers cycle, tag *still transporting*; at *The report records that slip too*, small type beneath the card: *R23 p.12 also records stopping and peak-versus-plateau errors (our description, not the report's wording)*.
7. At *The marker stays on*, the panel border pulses once; at *the words active sites of the enzyme*, *active sites of the enzyme* on the card is ringed in terracotta.
8. At *Carriers and enzymes both bind by complementary shape*, the two ideas are pulled apart beside the card: left, an `EnzymeActiveSiteModel` miniature (`rest-lk`, tag *recall: Topic 3*) labelled **enzyme: active site; substrate converted to products**; right, a carrier miniature labelled **carrier protein: binding site; substance moved across, unchanged**; side-note between them *similar fit, different jobs*.
9. At *The report says some thought*, citation tab, exact: **R23 p.12, June 2023 Paper 21 Q3(b)(i): “Some thought that the membrane protein was an enzyme with an active site, rather than a carrier protein with a binding site.”**; at *rather than a carrier protein with a binding site*, that clause is underlined and the carrier miniature brightens.
10. At *uptake reaches a plateau*, *stops* is struck and replaced in place by **reaches a plateau (a constant, maximum rate)**; the marker stays on. At *the number of carrier proteins is limited*, *all the active sites of the enzyme are full* is struck and replaced in place, and the card reads **✓** *At high concentrations the uptake reaches a plateau (a constant, maximum rate) because the number of carrier proteins is limited and all their binding sites are occupied.* Beneath it, a description tab (not a quotation): *S23/21 Q3(b)(i), 2 marks, MS p.11: plateau/constant uptake; carriers at capacity (plan-check description)*. This is the last fault; **the marker clears on this completed frame**. **Exit cue: end of *all their binding sites are occupied*.** Treatment lifts; the corrected card holds.

**On-screen text:** the panel and basis line; the header and its framing label; the card; *level ≠ stopped*; *still transporting*; the R23 description line; the two pulled-apart miniatures and *similar fit, different jobs*; the R23 tab; the corrected card and the MS description tab.

---

### BEAT 9 · Endocytosis: phagocytosis and pinocytosis · 7:05–7:57
**Narration:**
> Some cells also move material in bulk, wrapped in membrane. In endocytosis, the cell surface membrane surrounds material outside the cell, then pinches off to form a vesicle inside the cell, using energy from ATP. When the material is solid, it is phagocytosis: here a macrophage extends its membrane around a bacterium, encloses it, and pinches it off into a vesicle. When the material is a liquid with substances dissolved in it, it is pinocytosis: the membrane dips inward around a droplet of fluid and buds off a small vesicle. Either way, the material goes in wrapped, never through the bilayer or a transport protein.

**Visual action:**
1. From the first frame, the `FluidMosaicMembrane` strip from Beat 4 is on screen at top left, small, with the `pump-ATP` carrier moving one ion, caption *schematic; not to scale*; the macrophage and bacterium of `VesicleTransport` `phagocytosis` wait at centre in their start state.
2. At *move material in bulk*, the carrier's ion is ringed, side-note *one ion at a binding site*, and the view shifts to the macrophage (labelled **macrophage**) and the rod-shaped **bacterium** outside it, outside of the cell at the top of the frame.
3. At *the cell surface membrane surrounds material outside the cell*, a general endocytosis sketch runs beside it (a membrane segment folding around a grey particle), label **endocytosis**; at *pinches off to form a vesicle inside the cell*, the fold closes and a **vesicle** buds inward; at *using energy from ATP*, the static yellow tag *energy from ATP* lands beside the fold (no token reaction).
4. At *When the material is solid, it is phagocytosis*, the label **phagocytosis (solid material)** lands on the macrophage; at *extends its membrane around a bacterium*, the two membrane arms extend around the bacterium (motion, 1.2 s); at *encloses it*, the arm tips meet and fuse; at *pinches it off into a vesicle*, the bacterium sits in a vesicle inside the cell and drifts inward; the bacterium outline never crosses the bilayer. Small type *immunity: Topic 11*.
5. At *a liquid with substances dissolved in it*, `VesicleTransport` `pinocytosis` slides in at right: the plant cell surface membrane section with the cell wall band above, the fluid film with water and dissolved tokens; caption *our simplified fluid-uptake drawing; an adaptation of S23/21 X, not a reproduction of the complete diagram*. At *it is pinocytosis*, label **pinocytosis (liquid, with dissolved substances)**.
6. At *dips inward around a droplet of fluid*, the membrane dips downward around a droplet (motion, 1.0 s); at *buds off a small vesicle*, the rim closes and a **small vesicle** carrying the fluid and dissolved tokens buds into the cytoplasm; tag *energy from ATP*.
7. At *the material goes in wrapped*, both vesicles (bacterium; fluid) pulse together; at *never through the bilayer or a transport protein*, the Beat 4 carrier strip at top left gets a small side-note *carriers: ions and small molecules · vesicles: bulk material*.

**On-screen text:** *macrophage*, *bacterium*, *vesicle*; *endocytosis*; *phagocytosis (solid material)*; *pinocytosis (liquid, with dissolved substances)*; *energy from ATP* (both panels); the adaptation caption; the side-note.

---

### BEAT 10 · Exocytosis: out in vesicles · 7:57–8:41
**Narration:**
> Exocytosis runs the other way. A vesicle moves to the cell surface membrane, its membrane fuses with it, and the contents are released outside the cell, again using energy from ATP. You have met it already: pancreatic beta cells secrete insulin this way. Other pancreatic cells release digestive enzymes, the extracellular enzymes from the enzymes topic. And plant cells release pectin, a component of their cell walls, by exocytosis. Large molecules such as these proteins and polysaccharides leave the cell in vesicles, not through channels or carriers.

**Visual action:**
1. From the first frame, the `VesicleTransport` `exocytosis` scene is on screen: a cell surface membrane across the frame (outside at the top) with one vesicle in the cytoplasm below it, caption *schematic; not to scale*; the Beat 9 phagocytosis and pinocytosis panels sit small at the left edge. At *Exocytosis runs the other way*, the label **exocytosis** lands and a small arrow shows *out*, opposite in direction to the endocytosis panels' *in* arrows.
2. At *A vesicle moves to the cell surface membrane*, the vesicle travels up to the membrane (motion); at *its membrane fuses with it*, the vesicle bilayer merges into the cell surface membrane (motion; no gap, heads stay facing water), tag **fuses**; at *the contents are released outside the cell*, the contents spread outward above the membrane, tag **released**; at *using energy from ATP*, the static tag *energy from ATP*.
3. At *pancreatic beta cells secrete insulin this way*, a `SignallingScene` beta-cell miniature (tag *recall: 4.1.4*) runs one exocytosis with magenta insulin tokens.
4. At *Other pancreatic cells release digestive enzymes*, a second miniature, labelled *pancreatic cell*, releases teal enzyme miniatures by exocytosis; at *the extracellular enzymes from the enzymes topic*, tag *recall: 3.1.1, extracellular enzymes*.
5. At *plant cells release pectin*, a third miniature: a plant cell's surface membrane with its cell wall band above; a vesicle of green bead-chain fragments fuses with the membrane and the fragments move up into the wall, label **pectin**; at *a component of their cell walls*, the wall band brightens; small type *context: S21/22 Q5(b)(ii), 1 mark, MS p.16 (release of pectin by exocytosis; plan-check description)*.
6. At *Large molecules such as these proteins and polysaccharides*, the three released contents (insulin, enzymes, pectin) pulse together; at *not through channels or carriers*, the Beat 4 carrier strip returns small with the side-note from Beat 9, *carriers: ions and small molecules · vesicles: bulk material*.

**On-screen text:** *exocytosis*, *out*; *fuses*, *released*; *energy from ATP*; *recall: 4.1.4*; *pancreatic cell*; *recall: 3.1.1, extracellular enzymes*; *pectin*; the S21/22 context line; the side-note.

---

### BEAT 11 · COMMON MISTAKE E46: naming bulk transport · 8:41–9:54
**Narration:**
> Here is a mistake in two places, on a card built from two questions. The first asked how a macrophage takes in bacteria; the second showed inward budding at X in a plant cell. Read these answers.
>
> *(silent read, 4 s)*
>
> Start with the words active transport here. It can feel right, since engulfing does use energy, and that marking point accepts active process, ATP or energy. But active transport means carrier proteins moving ions or molecules; a bacterium goes in wrapped in a vesicle. The mark scheme rejects active transport. So: phagocytosis, a type of endocytosis. The marker stays on: the word phagocytosis here. In our adaptation of X, the membrane buds inward around fluid; there is no solid particle. The scheme accepts endocytosis or pinocytosis there, and rejects phagocytosis. So X is endocytosis, by pinocytosis. Phagocytosis stays right for the macrophage.

**Visual action:**
1. From the beat's first frame, the Beat 9 panels hold dimmed beside the card space: the macrophage and bacterium (`phagocytosis`) at upper left and the plant-membrane `pinocytosis` adaptation at lower left (with its adaptation caption), and the Beat 4 carrier strip small beneath them. **Entry cue: *Here is a mistake in two places*.** The COMMON MISTAKE panel enters (header badge **COMMON MISTAKE**, terracotta border) with its basis line in small type: *basis: two mark-scheme reject lines, W22/23 Q2(a)(i) MS p.9 and S23/21 Q1(b)(i) MS p.8*. It stays on until the completed correct frame.
2. At *on a card built from two questions*, the card header lands in two parts: **1. How does a macrophage take in bacteria?** · **2. Name the process at X.** Small type: *composite of two questions: our framing of W22/23 Q2(a)(i) and S23/21 Q1(b)(i); constructed answers, not transcripts.* At *inward budding at X in a plant cell*, the plan check's caption lands beneath the header, exact: **S23/21 QP p.3 shows inward budding at X from the plant cell surface membrane during vacuole development; MS p.8 accepts endocytosis/pinocytosis and rejects phagocytosis. Our simplified fluid-uptake drawing is an adaptation of X, not a reproduction of the complete diagram. W22/23 Q2(a)(i) is the separate macrophage/bacteria context.**
3. At *Read these answers*, the written wrong answers appear in handwriting style, two lines, each beside its thumbnail:
   **✗ 1** *The macrophage takes in the bacteria by active transport.*
   **✗ 2** *The process at X is phagocytosis.*
4. **Silent read, 4 s.** Panel and card held.
5. At *Start with the words active transport here*, *active transport* in line 1 is underlined in terracotta; at *engulfing does use energy*, the *energy from ATP* tag on the macrophage thumbnail brightens; at *that marking point accepts active process, ATP or energy*, a description tab (not a quotation): *W22/23 Q2(a)(i): the same marking point accepts active process/ATP/energy (plan-check description)*.
6. At *carrier proteins moving ions or molecules*, the carrier strip brightens and runs one `pump-ATP` cycle (with its one-frame token switch and caption); at *a bacterium goes in wrapped in a vesicle*, the macrophage thumbnail replays its enclosing and pinching off; side-note between them *carrier ≠ vesicle*.
7. At *The mark scheme rejects active transport*, citation tab, exact: **W22/23 Q2(a)(i), MS p.9: R active transport**, the R line underlined.
8. At *So: phagocytosis, a type of endocytosis*, *active transport* in line 1 is struck and replaced in place: **✓ 1** *The macrophage takes in the bacteria by phagocytosis (a type of endocytosis): its membrane surrounds them and pinches off a vesicle, using energy from ATP.* The marker stays on.
9. At *The marker stays on*, the panel border pulses once; at *the word phagocytosis here*, *phagocytosis* in line 2 is ringed in terracotta.
10. At *the membrane buds inward around fluid*, the pinocytosis thumbnail brightens and replays its inward budding around the droplet; at *there is no solid particle*, side-note *fluid, not a solid particle*.
11. At *The scheme accepts endocytosis or pinocytosis there*, citation tab, exact: **S23/21 Q1(b)(i), MS p.8: endocytosis / pinocytosis ; R phagocytosis**; at *rejects phagocytosis*, the R clause is underlined.
12. At *So X is endocytosis, by pinocytosis*, *phagocytosis* in line 2 is struck and replaced in place: **✓ 2** *The process at X is endocytosis (pinocytosis).* This is the last fault; **the marker clears on this completed frame**.
13. At *Phagocytosis stays right for the macrophage*, the word *phagocytosis* in the corrected line 1 gains a tick in the normal accent, boundary tab *R lines are local to each question*. **Exit cue: end of *Phagocytosis stays right for the macrophage*.** Treatment lifts; the corrected card holds.

**Production QA (legibility; check should-fix 4):** keep the exact adaptation text of the S23/21 X caption on the card and in this storyboard's source note, and place it where it stays legible alongside the two answers and three thumbnails; show only the currently discussed citation tab (W22/23 description tab, W22/23 R tab, or S23/21 tab) at full prominence, the others dimmed. This is a legibility requirement, not permission to remove the context qualification.

**On-screen text:** the panel and basis line; the two-part header and composite label; the exact S23/21 X caption; the card; the W22/23 description tab; *carrier ≠ vesicle*; the two MS citation tabs; *fluid, not a solid particle*; the corrected card; the boundary tab.

---

### BEAT 12 · What I told you, on the diagrams you built · 9:54–10:38
**Narration:**
> So here is the lesson, on the diagrams you built. Active transport: a carrier protein binds an ion, ATP is hydrolysed, and the carrier changes shape to move the ion against its concentration gradient, the kind of energy-dependent uptake that lets root hair cells accumulate mineral ions. Compared with facilitated diffusion, it goes against the gradient rather than down it, and it uses ATP. Carrier uptake levels off when the limited carriers are occupied. And bulk transport uses vesicles: phagocytosis for solids, pinocytosis for liquids, exocytosis to release.

**Visual action:**
1. From the first frame, **no new slide**: the screen returns to what was built, static: the Beat 6 two-panel membrane (facilitated diffusion left, `pump-ATP` right, held at the released state with *ADP* + *Pi* beside it and the ATP caption) across the top, with its filled comparison table beneath; the `UptakeGraph` with its inset at centre right; the three `VesicleTransport` panels (`phagocytosis`, `pinocytosis` with its adaptation caption, `exocytosis`) along the bottom; the `RootHairScene` small at lower left. Key points fade in in place. At *on the diagrams you built*, the layout settles; nothing moves.
2. At *a carrier protein binds an ion*, the right carrier's **binding site** label brightens; at *ATP is hydrolysed*, the *ADP* + *Pi* tokens and the caption brighten; at *against its concentration gradient*, the **against the gradient** arrow brightens.
3. At *root hair cells accumulate mineral ions*, the root hair's drawn counts and the strap-line **uptake against the gradient, using energy from respiration** brighten, with the generic-carrier tag.
4. At *Compared with facilitated diffusion*, the comparison table cells brighten in turn; at *it uses ATP*, the difference 2 cell brightens.
5. At *Carrier uptake levels off*, the plateau and **plateau: carriers occupied; rate constant at its maximum** brighten; at *the limited carriers are occupied*, the inset's four carriers brighten.
6. At *phagocytosis for solids*, the macrophage panel brightens; at *pinocytosis for liquids*, the pinocytosis panel; at *exocytosis to release*, the exocytosis panel, each with its *energy from ATP* tag.

**On-screen text:** the labels already on the diagrams, brightened in place; no new text surface.

---

### BEAT 13 · How it is asked, the reject card, and the root hair · 10:38–11:28
**Narration:**
> How does this reach you? One form, from March twenty twenty-four, Paper 22: compare facilitated diffusion with active transport, three marks, one similarity and two differences. Give a similarity through transport proteins, and use the change of shape only when the facilitated diffusion is by a carrier. Then direction and energy: down the gradient without ATP, against it with ATP. Other questions give you a levelling uptake graph, or ask you to name a bulk process. The scheme does not need this example, but remember the root hair: energy from respiration lets it take up ions against their concentration gradient.

**Visual action:**
1. From the beat's first frame, the familiar lesson layout stays on screen at right (reduced): the two-panel membrane with the comparison table, the `UptakeGraph`, the three `VesicleTransport` panels; the forms surface opens at left as compact captions beside it, one row per form, each with its visual. Rows 2 and 3 are already listed (not narrated in full): row 2 **explain a levelling uptake graph** · *S23/21 Q3(b)(i), 2 marks, MS p.11 (plateau/constant uptake; carriers at capacity: plan-check description)*, with the `UptakeGraph` plateau beside it; row 3 **Describe engulfment / name a process.** W22/23 Q2(a)(i), QP p.4 / MS p.9: describe macrophage engulfment, **3 marks, any three listed points**; naming phagocytosis/endocytosis alone supplies one point. S23/21 Q1(b)(i), QP p.3 / MS p.8: name X, **1 mark**, endocytosis/pinocytosis. S21/22 Q5(b)(ii), QP p.11 / MS p.16: name pectin export, **1 mark**, exocytosis. **Our summaries of the original forms.** The three vesicle panels sit beside it; the complete credited macrophage description stays the one given in E46 (Beat 11), and no frame implies the name alone earns three marks. Row 1's slot is empty. At *How does this reach you?*, the forms surface settles.
2. At *from March twenty twenty-four, Paper 22*, row 1: **compare facilitated diffusion with active transport** · *M24/22 Q1(b)(ii), 3 marks, MS p.6*; at *one similarity and two differences*, small type *one similarity and two differences; a change-of-shape similarity is credited only in a carrier context, and an incorrect channel context is rejected (our description; PDF-CHECKED (independent round-one check, 27 September 2026); displayed question/answer summaries remain our wording.)*. Label on row 1: *our framing of M24/22 Q1(b)(ii); PDF-CHECKED (independent round-one check, 27 September 2026); displayed question/answer summaries remain our wording.*.
3. At *Give a similarity through transport proteins*, the similarity cell of the comparison table at right brightens with a tick; at *only when the facilitated diffusion is by a carrier*, the *carrier only; not for a channel* note brightens.
4. At *Then direction and energy*, the difference 1 and difference 2 cells tick in turn; at *against it with ATP*, the right panel's ATP caption pulses.
5. At *Other questions give you a levelling uptake graph*, row 2 and the plateau brighten; at *ask you to name a bulk process*, row 3 and the vesicle panels brighten.
6. At *The scheme does not need this example*, place the RootHairScene on a distinct dashed panel labelled **beyond the mark scheme**, with no marking tick or MS tab, beneath the forms (drawn counts 3 and 10, generic-carrier tag visible). Keep the comparison answer visible separately. At *energy from respiration*, animate its existing ATP tags; at *against their concentration gradient*, show uptake and the **active transport** label. The reject card lands beside the comparison table (outside the dashed panel), struck through by hand: **✗ FD through a channel protein and AT are similar because both proteins change shape** / **✓ if FD is by a carrier protein, both carriers bind the substance and change shape; a channel protein does not**, caption in small type *our wording contrast; based on M24/22 Q1(b)(ii), MS p.6 (carrier-context similarity; plan-check description); not a mark-scheme reject line*. **Exit cue: end of *against their concentration gradient*** (the end of the beyond-the-mark-scheme callback; the credited comparison answer is complete before it). Final frame held 2 s: forms at left, lesson layout and reject card at right, the root hair beneath on its dashed **beyond the mark scheme** panel. No slogan.

**On-screen text:** the three forms with citations, each beside its visual; the framing and PDF-CHECKED labels; the reject card and its caption; the dashed **beyond the mark scheme** panel with *active transport* on the root hair.

---

## Datasets

No measured, supplied or calculated data are used in this lesson; nothing is plotted from numbers. Every count below is a **drawn count** (the number of tokens rendered), labelled *drawn counts, schematic* on screen; none is presented as a measurement or as *our illustrative data*.

### Drawn token counts (Beats 1, 4, 5, 6, 12, 13)

| Scene | Start: outside / cytoplasm | After the narrated event | Arithmetic (conservation of tokens) | Beats |
|---|---:|---:|---|---|
| `RootHairScene` (soil water / cell) | 3 / 10 | 2 / 11 after one inward ion (Beat 5) | 3 − 1 = 2; 10 + 1 = 11; total 13 = 13 | 1, 5, 12, 13 (13 shows the start state again) |
| `pump-ATP`, Beat 4 | 4 / 12 | 3 / 13 after one cycle | 4 − 1 = 3; 12 + 1 = 13; total 16 = 16 | 4 |
| `pump-ATP`, Beat 6 right panel | 3 / 13 | 2 / 14 after its one cycle; for the side-by-side replay the example is restarted at 3 / 13 under the tag *replay: example restarted* (never an unexplained movement through the bilayer) | 3 − 1 = 2; 13 + 1 = 14; total 16 = 16; the Beat 6 panel starts from Beat 4's end state (3 / 13, single cycle only) | 6, 12 |
| passive carrier, Beat 6 left panel (glucose) | 9 / 3 | 8 / 4 after one cycle; restarted at 9 / 3 for the replay under *replay: example restarted* | 9 − 1 = 8; 3 + 1 = 4; total 12 = 12 | 6, 12 |

In every active-transport scene the release side holds more tokens than the binding side (13 > 3; 11 > 2), so the drawn movement is against the drawn gradient; in the passive scene the release side holds fewer (4 < 8), so the drawn movement is down it. Compare equal-volume sampling windows on each side, with token density proportional to the indicated concentration. Whole-cell totals do not define a concentration gradient. This applies especially to the `RootHairScene`, where the large root cell and the thin soil-water film are compared by token density in equal windows, not by total token number.

### `UptakeGraph` shape constraints (Beats 7, 8, 12, 13) — builder specification, not data

- Both traces start at the origin. **Simple diffusion**: one straight line, positive gradient, reaching about 85 % of the y-axis height at the right end of the x-axis.
- **Uptake by carrier proteins**: rises monotonically; its initial slope is at least twice that of the diffusion line; it reaches about 90 % of its plateau height by 40 % of the x-axis and its plateau (about 60 % of the y-axis height) by about 65 %; it is exactly horizontal from there to the right end. It never falls and never overshoots the plateau. No equation is fitted or displayed.
- The two traces are of different substances or systems; the caption *the heights of the two traces are not comparable* stays on screen; the point where they cross is not labelled or discussed.
- Inset occupancy (drawn): cursor at 10 % of x → 1 of 4 carriers occupied at a time; 25 % → 2 of 4; 40 % → 3 of 4; at or beyond the plateau → all four cycling continuously.

---

## Real-world samples

None handled: no real material (potato, beetroot, red onion, blood cells, Visking tubing, agar, indicator or dye) is used in this lesson, so no method responds to any material and no fit or interference statement applies. Explain-beat real-world examples (drawn models, not handled samples; each bounded):

| Material | What the method responds to | Fit (range, clarity) | Interferences and how the method handles them | Beats |
|---|---|---|---|---|
| none handled | — | — | — | — |
| *explain-beat example:* root hair cells taking up mineral ions from soil water against their concentration gradient | no method; a drawn model | illustrates energy-dependent accumulation only; the animated carrier is a simplified, generic model (MF4 guard) | risk of implying a named transporter mechanism: tag *not a drawing of any named root transporter*; no co-transport; in Beat 13 (exam close) shown only on the dashed **beyond the mark scheme** panel | 1, 5, 12, 13 (13: beyond the mark scheme) |
| *explain-beat example:* a macrophage engulfing bacteria (phagocytosis) | no method; a drawn model | the W22/23 Q2(a)(i) context; immunity named as Topic 11's | — | 1, 9, 11, 12 |
| *explain-beat example:* inward budding of fluid at a plant cell surface membrane (pinocytosis) | no method; a drawn model | *our adaptation of S23/21 X*, not a reproduction | captioned as an adaptation every time it appears | 9, 11, 12 |
| *explain-beat examples:* insulin from pancreatic beta cells; digestive enzymes from pancreatic cells; pectin from plant cells (exocytosis) | no method; drawn models | recalls of 4.1.4 and 3.1.1 by label; pectin is the S21/22 Q5(b)(ii) context | — | 1, 10, 12 |

One exam-question beat carries a real-world extra: the Beat 13 root-hair callback. M24/22 Q1(b)(ii) does not ask about roots, so the callback is spoken after the mark-scheme answer as beyond the scheme (*The scheme does not need this example, but remember the root hair*) and shown on a dashed panel labelled **beyond the mark scheme**, with no tick and no MS tab, separate from the comparison answer (check M3).

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (4.2.1, p.21) | Beat(s) | How |
|---|---|---|
| describe and explain … active transport | 4, 5, 6, 12, 13 | definition (against the gradient, lower → higher, carrier proteins, energy from ATP); `pump-ATP` cycle as motion with the one-frame ATP token switch and caption; handle converted at once; ATP from respiration; root hair energy-dependent accumulation with the MF4 guard |
| describe and explain … endocytosis | 9, 11, 12 | membrane surrounds material and pinches off a vesicle, energy from ATP; phagocytosis (solid; macrophage and bacterium); pinocytosis (liquid with dissolved substances; our adaptation of S23/21 X); material enters wrapped, not through the bilayer or a transport protein |
| describe and explain … exocytosis | 10, 12 | vesicle moves, fuses, releases contents outside, energy from ATP; insulin (4.1.4 recall), pancreatic digestive enzymes (3.1.1 recall), pectin (S21/22 Q5(b)(ii) context) |
| comparison, facilitated diffusion versus active transport (plan) | 6, 12, 13 | similarity through transport proteins; change-of-shape similarity only with a carrier; differences: direction and energy |
| carrier saturation (plan) | 7, 8, 12, 13 | `UptakeGraph`: diffusion keeps rising across the range; carrier uptake levels off; limited number of carriers occupied; plateau not falling; saturation alone does not distinguish active from facilitated transport |
| simple diffusion, facilitated diffusion, osmosis | 2 (recall only) | taught in 4.2.1a; labelled recall on the `FluidMosaicMembrane`; handed off |

### Mark-scheme and examiner points → beats

| Source | Point | Beat |
|---|---|---|
| W22/23 Q2(a)(i), MS p.9 | `R active transport` (quoted); same point accepts active process/ATP/energy (described) | 11 (E46), 13 (row 3) |
| S23/21 Q1(b)(i), MS p.8 | `endocytosis / pinocytosis ; R phagocytosis` (quoted); inward budding at X (plan-check caption, exact) | 9 (adaptation caption), 11 (E46), 13 (row 3) |
| R23 p.12, June 2023 P21 Q3(b)(i) | “Some thought that the membrane protein was an enzyme with an active site, rather than a carrier protein with a binding site.” (quoted); stopping/peak-versus-plateau errors (described) | 8 (E47) |
| S23/21 Q3(b)(i), MS p.11 | plateau/constant uptake; carriers at capacity (described) | 7, 8 (E47 repair tab), 13 (row 2) |
| M24/22 Q1(b)(ii), MS p.6 | one similarity and two differences; carrier-context change of shape; channel context rejected (described) | 6, 13 (row 1, reject card) |
| S21/22 Q5(b)(ii), MS p.16 | release of pectin from plant cells by exocytosis (described) | 10, 13 (row 3) |
| G04 contextual caution | phagocytosis remains correct for the macrophage task (our paraphrase of G04 guidance; not an MS sentence) | 11 (closing line and boundary tab) |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, never, only, no, nothing, cannot, because, must, needs* and causal *so/since* was reread.
- *Many cells hold substances at concentrations very different from their surroundings* (1): "many", not all.
- *far too big for the channel and carrier proteins you have met* (1): bounded to the proteins taught; no claim about every membrane protein or protein translocation.
- *Both jobs cost the cell energy* (1): active transport and vesicle transport both use energy from ATP, as the plan teaches.
- *so there is a net movement down the gradient* (2): the causal *so* follows the stated imbalance of crossings; *None of these uses energy from ATP* (2): true of the three passive processes; *In these diffusion models, net movement ends when concentrations are equal; in osmosis, when water potentials are equal* (2): scoped to the drawn models, and keeps concentration equality and water-potential equality as separate quantities (check M2); *Particles keep crossing both ways* (2): prevents "movement stops".
- *without the door ever standing open straight through* (4): inside the analogy, converted at once.
- *a carrier protein binds a specific molecule or ion* (4): the plan's conversion wording; "specific" is the syllabus-level property, not a claim that each carrier binds one substance only.
- *Root hair cells can take up mineral ions … even when those ions are already more concentrated inside* (5): "can"; "those ions", not all ions. *Net diffusion cannot do that* (5): net diffusion cannot move a substance up its own gradient; bounded by "net". *So this uptake needs energy* (5): the causal step from against-gradient movement; "this uptake" only. *not how any particular ion enters a root* (5): the MF4 limit, stated.
- *so that similarity does not hold for a channel* (6): M24/22 Q1(b)(ii)'s carrier-context condition (described); *A channel protein provides a pore and does not change shape to carry each particle across* (6): the channel mechanism as taught in 4.1.3 and 4.2.1a; says nothing about gating. *facilitated diffusion is passive and uses no ATP* (6): true of facilitated diffusion as defined. *because examiners ask you to compare them* (6): supported by M24/22 Q1(b)(ii); no frequency claimed.
- *the rate keeps rising across this range* (7): bounded to the plotted range; *so adding more of the substance means more binding* (7) and *so uptake stays at its maximum rate* (7): causal steps of the saturation explanation; *nearly every carrier is occupied at any moment* (7): "nearly"; *so a plateau alone does not tell you which one is happening* (7): the plan check's bound, "alone".
- *not falling to zero* (8): the plateau of this curve; *all their binding sites are occupied* (8): the plan's E47 repair wording, used only in the correction; *so the words can merge* (8): the reason offered as a possibility; *some thought* (8): the report's "Some", preserved.
- *Either way, the material goes in wrapped, never through the bilayer or a transport protein* (9): true of endocytosis as defined here (vesicle formation); "never" is scoped to the material taken in by endocytosis.
- *Large molecules such as these proteins and polysaccharides leave the cell in vesicles, not through channels or carriers* (10): "such as these", scoped to the three examples.
- *It can feel right, since engulfing does use energy* (11): offered as a possibility; *The mark scheme rejects active transport* (11) and *rejects phagocytosis* (11): the R lines, local to W22/23 Q2(a)(i) and S23/21 Q1(b)(i); *there is no solid particle* (11): true of our adaptation drawing; *Phagocytosis stays right for the macrophage* (11): the question-local boundary.
- *Compared with facilitated diffusion, it goes against the gradient rather than down it* (12): the taught difference; *the limited carriers are occupied* (12): the saturation explanation.
- *use the change of shape only when the facilitated diffusion is by a carrier* (13): the carrier-context condition; *energy from respiration lets it take up ions against their concentration gradient* (13): "the root hair" (this example), spoken as beyond the scheme; *The scheme does not need this example* (13): marks the extra as not a marking point.
- No sentence names the animated ion, labels the carrier as a nitrate transporter, mentions co-transport, calls a plateau "uptake stops", gives a channel a shape-change mechanism, or says a plateau proves active transport.

---

## Citations

Every quotation in this storyboard, where it appears, and the file it was copied from. Nothing is quoted from an exam PDF directly; none was opened in this run. Exam quotations are the plan check's verified strings.

| # | Quotation (verbatim) | Paper / session / question / page | Beat(s) | Copied from | Status |
|---|---|---|---|---|---|
| 1 | "describe and explain the processes of simple diffusion, facilitated diffusion, osmosis, active transport, endocytosis and exocytosis" | Syllabus 2025–2027, 4.2.1, p.21 | header; 3 (small type "describe and explain") | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 2 | `R active transport` | W22/23 (9700/23, November 2022) Q2(a)(i), MS p.9 | spine; 11 (tab) | `work/006/SHARED-SPECS.md` §2; plan E46; weights ledger and E46 | **PDF-CHECKED (plan check)** |
| 3 | `endocytosis / pinocytosis ; R phagocytosis` | S23/21 (9700/21, June 2023) Q1(b)(i), MS p.8 | spine; 11 (tab) | `work/006/SHARED-SPECS.md` §2; plan E46; weights ledger and E46 | **PDF-CHECKED (plan check)** |
| 4 | “Some thought that the membrane protein was an enzyme with an active site, rather than a carrier protein with a binding site.” | R23 (June 2023 examiner report) p.12, Paper 21 Q3(b)(i) | spine; 8 (tab) | `work/006/SHARED-SPECS.md` §2; plan E47; weights S-E and E47 | **PDF-CHECKED (plan check)** |
| 5 | Caption (plan-check text, reproduced exactly on the card, not an exam quotation): "S23/21 QP p.3 shows inward budding at X from the plant cell surface membrane during vacuole development; MS p.8 accepts endocytosis/pinocytosis and rejects phagocytosis. Our simplified fluid-uptake drawing is an adaptation of X, not a reproduction of the complete diagram. W22/23 Q2(a)(i) is the separate macrophage/bacteria context." | describes S23/21 QP p.3 / MS p.8 and W22/23 Q2(a)(i) | 11 | plan E46 ("Plan-check caption, exact"); weights E46; plan check line 103 | **PDF-CHECKED (plan check)** |

Descriptions cited without quotation marks (never on an MS/ER quote card): W22/23 Q2(a)(i) same point accepts active process/ATP/energy (plan check; Beat 11 description tab) — **PDF-CHECKED (plan check)** as a description; R23 p.12 stopping/peak-versus-plateau errors (Beat 8 small type) — **PDF-CHECKED (plan check)** as a description; S23/21 Q3(b)(i), MS p.11, 2 marks: plateau/constant uptake and carriers at capacity (Beats 7, 8, 13) — description, **PDF-CHECKED (independent round-one check, 27 September 2026); displayed question/answer summaries remain our wording.**; M24/22 Q1(b)(ii), MS p.6, 3 marks: one similarity and two differences, carrier-context change of shape, channel context rejected (Beats 6, 13) — description, **PDF-CHECKED (independent round-one check, 27 September 2026); displayed question/answer summaries remain our wording.**; S21/22 Q5(b)(ii), MS p.16, 1 mark: release of pectin by exocytosis (Beats 10, 13) — description, **PDF-CHECKED (independent round-one check, 27 September 2026); displayed question/answer summaries remain our wording.**; G04 "Do not reject phagocytosis in the macrophage task above" used only as our paraphrase (Beat 11 boundary), not an MS sentence.

**Formerly UNVERIFIED items — all eight resolved** by the independent round-one check (27 September 2026, against the original QP/MS/ER PDFs). Each is now **PDF-CHECKED (independent round-one check, 27 September 2026); displayed question/answer summaries remain our wording.** Paraphrases stay paraphrases; none is turned into a quotation.
1. *Resolved* — MS wording of M24/22 Q1(b)(ii), MS p.6: form and tariff verified; MS accepts transport-protein similarity and direction/energy differences; exact guidance `R if incorrect context of channel protein` (check audit). The reject card remains labelled an authored contrast.
2. *Resolved* — QP of M24/22 Q1(b)(ii), QP p.4: one similarity / two differences, 3 marks, verified. Row 1 stays *our framing*.
3. *Resolved* — MS of S23/21 Q3(b)(i), MS p.11: credits constant/plateau uptake and saturated/highest-rate transporters; accepts carrier number limiting.
4. *Resolved* — QP of S23/21 Q3(b)(i), QP pp.8–9: VvHT1 from grape inserted into yeast with very few transporters; eight glucose concentrations. The original asks how results support facilitated diffusion; our Beat 8 header and graph are explicitly our framing, not reproductions.
5. *Resolved* — R23 p.12 explicitly reports the stopping and peak-versus-plateau errors; our description is accurate (not quoted).
6. *Resolved* — W22/23 Q2(a)(i), QP p.4 / MS p.9: "Describe how macrophages engulf bacteria", any three of six points, 3 marks; point 6 accepts active process/ATP/energy. Beat 13 row 3 corrected (check M3).
7. *Resolved* — S23/21 Q1(b)(i), QP p.3: exact QP "Name the process that is occurring at X."; X is inward budding at the plant cell surface during vacuole development; the adaptation disclaimer is accurate. Our drawing is never called the original artwork.
8. *Resolved* — S21/22 Q5(b)(ii), QP p.11 / MS p.16: Golgi vesicles, export mechanism; MS `exocytosis ;`, 1 mark.

No listed UNVERIFIED exam item remains unresolved.

---

## Word count and runtime

Counted by the validator over the blockquoted narration (silent-read lines excluded; hyphenated compounds count once; numbers written as spoken words). Seconds = words ÷ 120 × 60.

| Beat | Kind | Words | Seconds |
|---|---|---:|---:|
| 1 Hook and context | teaching | 89 | 44.5 |
| 2 Recall: the passive processes from 4.2.1a | teaching | 112 | 56.0 |
| 3 Objectives | teaching | 49 | 24.5 |
| 4 Active transport: a revolving door, driven by ATP | teaching | 134 | 67.0 |
| 5 Root hair cells: energy-dependent accumulation | teaching | 95 | 47.5 |
| 6 Facilitated diffusion and active transport, side by side | teaching | 104 | 52.0 |
| 7 Why carrier uptake levels off | teaching | 119 | 59.5 |
| **8 E47** | **error** | **139** | **69.5 + 4 s read = 73.5** |
| 9 Endocytosis: phagocytosis and pinocytosis | teaching | 105 | 52.5 |
| 10 Exocytosis: out in vesicles | teaching | 87 | 43.5 |
| **11 E46** | **error** | **139** | **69.5 + 4 s read = 73.5** |
| 12 Recap | teaching | 88 | 44.0 |
| 13 Exam close | teaching | 100 | 50.0 |
| **Teaching (11 beats)** | | **1,082** | **9:01** |
| **Error (2 beats)** | | **278** | **2:19 + 0:08 reads = 2:27** |
| **Total (13 beats)** | | **1,360** | **11:20 of narration (validator); 11:28 with the two silent reads** |
| Budget | | 1,350 | 11:15 (teaching 8:45 = 1,050 words + 2 × 1:15 error beats) |

**Length, honestly:** **1,360 words = 11:20** at 120 words per minute (the validator's figure; the plan's effective rate for final video). The shared validator's conservative convention also adds each prescribed 4 s silent read inside its error beat (SHARED-SPECS §2a), giving **11:28**. These are two different conventions and are not stacked twice: the amended plan says the effective rate is not a second silence allowance, and actual paced audio and scheduled holds decide final runtime. Against the 11:15 budget that is **5 s over** on the effective-rate count and **13 s over** on the conservative count. The round-one check accepted the earlier 7 s conservative overrun plus the modest wording added by its M2 (Beat 2, +7 words) and M3 (Beat 13, +5 words); no cut is required merely to hit 11:15, and M1 removed Beat 4's extra silent pump cycle (not separately budgeted). The two error beats are **139 words each, 73.5 s each including the read**, inside the 65–75 s requirement and inside their reserved 2 × 1:15 (2:27 of 2:30); each carries two faults with the marker held until the last one is corrected, and neither is shortened. The eleven teaching beats total **1,082 words = 9:01**, **16 s (32 words) over** the 8:45 teaching base; the overrun sits mainly in Beat 4 (134 words: the definition, the handle with its conversion and one narrated pump cycle), Beat 7 (119 words: the full saturation explanation plus the "a plateau alone" bound), Beat 2 (112 words, now separating concentration equality from water-potential equality) and Beat 13 (100 words, now with the beyond-the-scheme callback). Drafting cuts already taken: the Beat 1 diffusion sentence, the Beat 9 opening "Carrier proteins handle ions and small molecules" (kept as an on-screen side-note), "Watch one cycle" (Beat 4), small trims in Beats 2, 5, 6 and 7, and the E47/E46 trims to meet §2a. **Optional cuts, only if trimming proves necessary after cue scheduling** (the check rejects the former Beat 13 cut as a timing requirement: exam orientation has a job): (2) Beat 2 "First, a quick recall of the passive processes." (−8 words, −4 s; the *recall: 4.2.1a* tag carries the label; move the `DiffusionField` overlay cue to *Particles move randomly*); (3) Beat 10 "You have met it already:" (−5 words, −2.5 s). Never shorten an error beat. Never speed the narration.

---

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| Simple diffusion, facilitated diffusion and osmosis taught in full; the water-potential sentences; factors affecting the rate of diffusion | 4.2.1a (recalled by label in Beat 2) |
| Co-transport; the molecular route of any named ion (e.g. nitrate) into root cells; proton gradients | not taught here (plan MF4 guard; DO-NOT-ADD) |
| Sodium–potassium pump stoichiometry and membrane potentials | Topic 15 (plan scope ceiling) |
| Receptor-mediated endocytosis detail; lysosomal digestion of phagocytosed bacteria; immune roles of macrophages | not in this outcome's ceiling; immunity is Topic 11 |
| Golgi packaging and the secretory pathway beyond "a vesicle moves to the membrane" | Topic 1 cell structure (not recalled here) |
| Insulin's regulation and target responses | 4.1.4 (secretion by exocytosis recalled) and Topic 14 |
| Channel families, gating | not in scope (4.1.3 ceiling) |
| Any equation for uptake kinetics; Fick's law | DO-NOT-ADD |
| Plant and animal cell outcomes of osmosis | 4.2.6 |
| Investigations of diffusion and osmosis | 4.2.2a, 4.2.2b, 4.2.3-4, 4.2.5 |

## Reusable models

| Model | For |
|---|---|
| **`TransportProteinSet` `pump-ATP`** (generic ion; one-frame ATP → ADP + Pi switch on the frame the shape change starts; both captions throughout; never named as a nitrate or other specific transporter) | any later lesson recalling active transport (e.g. Topic 7 or Topic 15 by label, with their own specified transporters); 4.2.2a comparison thumbnail if wanted |
| **`VesicleTransport` `phagocytosis`, `pinocytosis`** (the latter always with its adaptation caption) | Topic 11 (phagocytosis recall by label); E46 card thumbnails |
| **`UptakeGraph`** with the four-carrier inset (*still transporting* at the plateau; no ATP tokens in the inset) | none downstream in Topic 4; available to the 4.2.1 notes |
| **`RootHairScene`** (drawn counts 3 / 10; generic-carrier tag) | Topic 7 (mineral uptake recall, with its own mechanism statement) |
| **The revolving-door handle** and its converted sentence | the 4.2.1 notes; not reused in any exam or error beat |

## Assets

| Asset | Status | Source |
|---|---|---|
| `FluidMosaicMembrane`, `PhospholipidToken` | reuse | 4.1.1-2 |
| `DiffusionField`, `WaterPotentialModel` thumbnail, `TransportProteinSet` passive states | reuse | 4.2.1a |
| `TransportProteinSet` `pump-ATP` (ATP, ADP, Pi tokens; two captions) | **new state** | authored |
| `VesicleTransport` `exocytosis` | reuse (three content variants added) | 4.1.4 |
| `VesicleTransport` `phagocytosis`, `pinocytosis` | **new states** | authored; pinocytosis captioned as our adaptation of S23/21 X |
| `SignallingScene` beta-cell miniature | reuse | 4.1.4 |
| `EnzymeActiveSiteModel` `rest-lk` miniature | reuse (recall) | Topic 3, 3.1.1-2 |
| `UptakeGraph` and inset | **new** | authored, schematic |
| `RootHairScene` | **new** | authored, schematic |
| Revolving-door analogy inset; objective pictograms | new, schematic | authored |
| E46 and E47 cards (constructed answers), headers (our framings), MS/ER tabs | new, captioned | authored |
| COMMON MISTAKE panel; reject card; forms surface | shared | existing |
| Photographs, micrographs, Cambridge artwork or figures | none | — |

No bench handling occurs in this lesson (no pours, droppers, tubing or timers; no first-contact timer applies). Motion contracts (carrier shape change, one-frame token switch, membrane extension, pinch-off, fusion) are specified for still-frame checking: **rendered still-frame verification pending**, in particular the frame of the ATP token switch (it must coincide with the first frame of the shape change and show no cross-fade) and the pinch-off frames (the bilayer stays continuous, heads to water, no gap).

## Plan interpretations

1. **Hook.** The plan names the revolving-door handle but leaves the hook to the author; the hook uses the plan's own real-world explain example (root hair cells accumulating mineral ions against a gradient) and is answered in Beat 13's callback ("active transport", energy from respiration), spoken as beyond the scheme on a dashed **beyond the mark scheme** panel, with the MF4 guard kept on screen whenever the root carriers are drawn.
2. **Direction of the animated pump.** The plan does not fix it; the pump moves the generic ion from outside (fewer) into the cytoplasm (more), matching the `intrinsic-carrier`'s rest state (notch facing outside), the SHARED-SPECS instruction that ATP docks on the cytoplasmic face, and the root-hair uptake example.
3. **Beat order.** E47 follows the saturation explanation (Beat 7) and E46 follows both bulk-transport beats (9, 10), so each card's corrections rest on content already taught. The comparison (Beat 6) precedes saturation because the saturation note ("carriers in both processes can level off") needs both processes side by side.
4. **Quotation status tag.** Following SHARED-SPECS §2 (as updated during this run) and the plan: the three quoted exam strings (and the plan-check caption) carry **PDF-CHECKED (plan check)**; descriptions whose exact wording was unverified were marked PDF-UNCHECKED and listed as UNVERIFIED; after the independent round-one check all are resolved and labelled **PDF-CHECKED (independent round-one check, 27 September 2026); displayed question/answer summaries remain our wording.** The brief's general phrase "tagged PDF-UNCHECKED" is read as applying to anything outside the verified list; nothing outside it is quoted here.
13. **Error-beat length.** SHARED-SPECS §2a (updated during this run) sets the whole error-beat narration at 122–142 words so that narration plus the 4 s silent read lands at 65–75 s; both beats were trimmed to 139 words to meet it, and the silent reads are counted in the beat windows and the stricter runtime.
5. **E47 card context.** R23 p.12 reports June 2023 Paper 21 Q3(b)(i), the same question as S23/21 Q3(b)(i); the card is therefore *our framing of S23/21 Q3(b)(i); constructed answer, not a transcript*, with the report quotation as its evidence. The wrong answer combines the two report-described faults (enzyme/active site; stopping) into one constructed sentence.
6. **E47 "pull apart" visual.** The plan lists `ReceptorLigand` as the E47 vocabulary recall; I used an `EnzymeActiveSiteModel` miniature (Topic 3 recall) beside the carrier instead, because the error being repaired is enzyme-versus-carrier, and VIDEO-STRUCTURE asks for merged ideas to be pulled apart on screen. A receptor would introduce a third protein role the card does not mention.
7. **Comparison.** The M24/22 form is one similarity and two differences; the lesson teaches direction and energy as the two differences and treats channel-versus-carrier as the condition on the change-of-shape similarity, not as a third difference. "Active transport uses carrier proteins" is stated without "only".
8. **Pinocytosis drawing.** The plan asks for our adaptation of S23/21 X; it is drawn on a plant cell surface membrane with a plain cell-wall band above (outside at the top), and the plan check's adaptation wording is carried as a caption in Beat 9 as well as on the E46 card, so no frame shows the adaptation uncaptioned.
9. **"Energy from ATP" for bulk transport.** Tagged statically, with no token reaction (SHARED-SPECS `VesicleTransport`); only `pump-ATP` performs the token switch.
10. **Exam close reject card.** No verbatim reject line exists for the M24/22 channel context in the permitted quotation list, so the card is captioned *our wording contrast … not a mark-scheme reject line* (should-fix 8: no invented reject).
11. **UptakeGraph traces.** The carrier trace is labelled generically (*facilitated diffusion or active transport*) because the plan check says saturation alone does not distinguish them; the two traces' heights are declared not comparable.
12. **Exocytosis examples.** "Other pancreatic cells release digestive enzymes" separates the beta cells (insulin) from the enzyme-secreting cells without naming acinar cells, which the plan does not require.

## Validator run

`python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.1b/STORYBOARD.md` (after the round-one fixes)

```
== storyboards/topic-04/4.2.1b/STORYBOARD.md
beat  words  cues maxgap  status
   1     89     8     20  ok
   2    112    12     19  ok
   3     49     4     14  ok
   4    134    20     12  ok
   5     95    11     13  ok
   6    104    11     15  ok
   7    119    12     17  ok
   8    139    16     15  ok
   9    105    14     11  ok
  10     87    12     13  ok
  11    139    20     19  ok
  12     88    12     14  ok
  13    100    13     14  ok
TOTAL words 1360  cues 165  runtime at 120 wpm 11:20.0  beats 13  failing beats 0
```

## CHECK RESPONSE (round 1)

Response to the independent round-one check of 4.2.1b (NOT CLEARED; reviewed SHA-256 `85bcb576…abf47f`). Every replacement below uses the check's wording verbatim.

| ID | Status | What changed |
|---|---|---|
| M1 | applied | Beat 4 action 7 replaced verbatim: "At *ATP is hydrolysed to ADP and phosphate*, switch ATP to ADP + Pi in one rendered frame and start the carrier's 0.8 s conformational change on that same frame … do not restart the movement or hydrolysis. Retain both model captions throughout." Action 9 replaced verbatim: "… return the empty carrier over 0.8 s … Hold the completed single-cycle counts at **3 outside / 13 in the cytoplasm**. Do not perform a second transport cycle in this beat." Added to the `pump-ATP` model/replay contract: "A replay reset is an explicitly labelled restart of the schematic example, never an unexplained instantaneous movement of a solute through the bilayer. Count updates occur only on actual transport events." |
| M1 (consequence) | applied with interpretation | To make Beat 6 obey the new replay contract, its side-by-side replay (action 4) now runs under the tag *replay: example restarted* with counts at their start values (9 / 3 and 3 / 13); the dataset rows now record 2 / 14 (active) and 8 / 4 (passive) after the actual cycle and the labelled restart. On-screen text in Beat 4 "throughout the cycles" → "throughout the cycle". |
| M2 | applied | Beat 2 final narration now: "None of these uses energy from ATP. In these diffusion models, net movement ends when concentrations are equal; in osmosis, when water potentials are equal. Particles keep crossing both ways." Action 7 replaced verbatim (cues *when concentrations are equal*, *when water potentials are equal*, *Particles keep crossing both ways*). On-screen text list and absolutes sweep updated. |
| M3 (row 3) | applied | Beat 13 row 3 replaced verbatim: "**Describe engulfment / name a process.** W22/23 Q2(a)(i), QP p.4 / MS p.9: describe macrophage engulfment, **3 marks, any three listed points**; naming phagocytosis/endocytosis alone supplies one point. … **Our summaries of the original forms.**" E46's complete credited macrophage description retained; a note says no frame implies the name alone earns three marks. The narrated cue *ask you to name a bulk process* is unchanged (the check gave no narration replacement; it remains true of S23/21 and S21/22). |
| M3 (callback) | applied | Callback narration now: "The scheme does not need this example, but remember the root hair: energy from respiration lets it take up ions against their concentration gradient." Action 6: RootHairScene on a distinct dashed panel labelled **beyond the mark scheme**, no tick or MS tab; comparison answer kept visible separately; ATP tags animate at *energy from respiration*; uptake and **active transport** label at *against their concentration gradient*. Exit cue annotated as the end of the beyond-the-scheme callback; final-frame and on-screen text updated. Real-world samples: the "No exam-question beat adds a real-world extra" line replaced by a record of this separation; root-hair row notes Beat 13 is beyond the mark scheme. Generic-transporter guard kept. Plan interpretation 1 updated. |
| M4 | applied | Beat 3 action 1 opening replaced verbatim: "From the first frame, show all three flat authored pictograms on the objectives' own styled surface: carrier and arrow, budding/fusing vesicles, and paired direction arrows. Keep the text slots empty initially. At each existing objective cue, reveal its text and brighten the already-visible matching pictogram. This is a separate objectives surface, not the detailed lesson diagram." Each objective cue now reads "text enters and its (already-visible) pictogram brightens". |
| S1 | applied | Added to *Datasets* and the `RootHairScene` spec: "Compare equal-volume sampling windows on each side, with token density proportional to the indicated concentration. Whole-cell totals do not define a concentration gradient." (root cell versus soil-water film named in *Datasets*). |
| S2 | applied | `VesicleTransport` `exocytosis` spec: "heads outward on both faces" → "outer-leaflet heads face cytoplasm; inner-leaflet heads face the aqueous vesicle lumen; tails face one another between the leaflets." |
| S3 | applied | Beat 7 action 7 note now: "In this carrier-uptake model, the plateau reflects limited carrier capacity; the plateau alone does not establish ATP use." Narration unchanged. |
| S4 | applied | Beat 11 gains a **Production QA (legibility)** note: exact adaptation text kept and placed legibly; only the currently discussed citation tab at full prominence, others dimmed; not permission to remove the context qualification. |
| S5 | applied | The eight UNVERIFIED items are recorded as resolved with the check's page/wording; the three PDF-UNCHECKED description labels, the spine's "UNVERIFIED for exact wording" and Beat 13 row 1's two UNVERIFIED labels now read "PDF-CHECKED (independent round-one check, 27 September 2026); displayed question/answer summaries remain our wording." Paraphrases remain paraphrases. Header and plan interpretation 4 note the resolution. |
| Runtime ruling | applied | Word-count table, beat windows and "Length, honestly" recounted: 1,360 words = 11:20 (effective rate); 11:28 on the conservative read-inclusive convention, the two conventions distinguished and not stacked. Former cut 1 withdrawn as a timing requirement; cuts 2 and 3 kept as optional; error beats untouched (139 words each). |

New validator TOTAL: `TOTAL words 1360  cues 165  runtime at 120 wpm 11:20.0  beats 13  failing beats 0`
