# 4.1.4 — Cell signalling: secretion, transport, binding

**Storyboard, first draft. Cloud run 006, 27 September 2026.** No audio, no code, no render. Folder `storyboards/topic-04/4.1.4/`.
Cambridge 9700 syllabus 2025–2027, p.21. Command word **OUTLINE**. Budget from `TOPIC-PLAN-04-MEMBRANES.md` §4.1.4 and the lesson list, and `TOPIC-04-WEIGHTS.md` (4.1.4 row): **7:00 = teaching 5:45 (about 690 words) + one complete five-move error beat reserved at 1:15 (E44); 8 teaching beats + 1 error beat**; delivered here as **9 beats (8 teaching + 1 error)**. 4.1.4 has direct exposure in 2 of the 5 cited Paper 2 blocks (W22/23, M24/22; 4 marks), three papers including the adjacent S21/22 Q3(c). Runtime estimated at **120 words per minute of final video**. **Narration: 805 words ÷ 120 = 6:42.5. Add the explicit E44 read of 4 s: 6:46.5, 13.5 s below the 7:00 budget. E44: 142 words ÷ 2 + 4 = 75 s. Ordinary settling holds are included in the effective pacing estimate unless explicitly scheduled outside it.**

> **4.1.4** outline the main stages in the process of cell signalling leading to specific responses:
>
> - secretion of specific chemicals (ligands) from cells
> - transport of ligands to target cells
> - binding of ligands to cell surface receptors on target cells

(syllabus p.21)

**Authorities read, in full:** `work/006/SHARED-SPECS.md` (binding); `plan/topic-04/TOPIC-PLAN-04-MEMBRANES.md` (scope and authoring rules, §4.1.3 and §4.1.4 in full, the MF4 insulin paragraph, lesson list and build order, shared-model table, words table, traps table, UNVERIFIED register, PLAN-CHECK RESPONSE); `plan/topic-04/TOPIC-04-WEIGHTS.md` (4.1.4 row and paragraph; ledger rows W22/23 Q5(a)(i), M24/22 Q1(c)(iii), S21/22 Q3(c); supplementary S-G; register E44); `cloud-inputs/003/standards/VIDEO-STRUCTURE.md` (all, including the signalling framing, hook and handle rules, the five-move error beat, the badge-truth rule, "animate the mechanism", "say the typical thing as typical"); `CONTENT-ARCHITECTURE.md` (including §5's ruling on the section 04 pilot: all three stages, specificity one idea inside them); `SYLLABUS-9700-DETAIL.md` Topic 4 (outcomes and introduction pp.21–22; apparatus p.57, materials p.58 and mathematical requirements p.63 read, none used here) and 14.1.10 (p.38, for the insulin example's scope); the cleared examples `cloud-inputs/006/examples/3.1.3/STORYBOARD.md` and `3.2.1b/STORYBOARD.md`; `cloud-inputs/003/topic-03/3.1.1-2/CHECK.md` and `3.2.2-3/CHECK.md`; the plan check `cloud-checks/006/plan/CHECK.md` on `origin/cloud/006-checks` (MF1, MF2's E44 row, MF4, the citation audit rows for `active site`, S21/22 Q3(c), W22/23 Q5(a)(i) and R24 p.21); `cloud-inputs/006/evidence/GATE-CRITERIA-9700-04-CELL-MEMBRANES-AND-TRANSPORT.md` and `EXAMINER-INSIGHT-9700.md` (§5, R24 p.21 row). **No question paper, mark scheme or examiner report PDF was opened for this draft** by its author (register-only checking). The independent round-1 check (27 September 2026) then extracted the actual QP/MS PDFs and the official R24 report directly with `pdftotext -layout`; its rulings are recorded below as *PDF-CHECKED (round-1 check)*, kept distinct from the author's register-only status. Every exam quotation is one of SHARED-SPECS §2's verified strings; everything else is our wording, labelled *our framing*, a cited paraphrase, or listed as `UNVERIFIED`.

**Build position:** third of the ten Topic 4 lessons (4.1.1-2 → 4.1.3 → **4.1.4** → 4.2.1a → 4.2.1b → 4.2.6 → 4.2.2a → 4.2.2b → 4.2.3-4 → 4.2.5).

**Models used:** `FluidMosaicMembrane` (4.1.1-2; states `full`, `highlight:receptor-glycoprotein`); `ReceptorLigand` basic states (4.1.3: the `receptor-glycoprotein` with its **binding site** labelled, ligand A magenta wedge, ligand B magenta square); `EnzymeActiveSiteModel` (3.1.1-2; state `rest-lk` only, as a small labelled recall thumbnail in E44).
**Models published here:** `SignallingScene` (new); `ReceptorLigand` extended with `wrong-ligand-fail`, `seat`, `response-uptake`; `VesicleTransport` state `exocytosis` (extended by 4.2.1b with `phagocytosis`, `pinocytosis`). Everything drawn is a MODEL, captioned *schematic; not to scale*; no number is plotted or displayed in this lesson.

---

## The causal spine

One idea carries the lesson: **a signalling chemical is released and carried widely, but only a cell with a receptor whose binding site is complementary in shape can bind it, and binding starts that cell's specific response.** The three syllabus stages are the route the message takes; specificity is where the route ends.

> **Cell signalling, in outline: a cell secretes a specific chemical, a ligand (insulin is secreted by pancreatic beta cells by exocytosis); the ligand is transported to target cells (blood carries the signal widely around the body; it can then reach cells through tissue fluid); on target cells the ligand binds to cell surface receptors whose binding site is complementary in shape to it, and binding initiates a specific response (muscle cells increase glucose uptake). Cells without a complementary receptor do not respond to that ligand; different cell types that share the receptor can all respond.**

**What the mark schemes credit, quoted:** [W22/23 Q5(a)(i), MS p.17] `R active site` (**PDF-CHECKED (plan check)**); the part (QP p.12) asks why many different cell types can respond to the same LL-37 ligand and credits receptor identity/location/complementarity, any two, not all three compulsory; location accepts cell surface membrane or inside cell (our paraphrase; PDF-CHECKED (round-1 check)). [M24/22 Q1(c)(iii), QP p.5 / MS p.7] prostaglandins in inflammation: outline cell signalling, 2 marks; point 1 is release OR transport of prostaglandins (alternatives within one point), point 2 is their receptor binding; intracellular examples are an optional point 3, any two (our paraphrase; PDF-CHECKED (round-1 check)). [S21/22 Q3(c), MS p.12] `Reject if hormone S or receptor R described as an antigen or enzyme` (**PDF-CHECKED (plan check)**), **adjacent evidence only**: hormone S binds a *cytoplasmic* receptor R by complementary shape, supplied in the question's diagram; it is not evidence for the cell-surface stages taught here. [R24 p.21, June 2024 P23 Q5(a)] supported paraphrase: detailed intracellular events were not required at AS level in that signalling question; the report also notes omitted secretion/transport stages (EXAMINER-INSIGHT §5; plan check citation audit). So the spine is what is credited: the stages named in order, a receptor identified with its location and complementary binding site, and the partners never called an enzyme.

**The handle:** *an address on an envelope* (VIDEO-STRUCTURE's own handle for specificity). The letter passes many doors, but it is opened where the address matches. Converted in the same breath, Beat 5: **Written properly: the ligand binds to a specific receptor because their shapes are complementary.** The handle is never the exam answer, and its limit is said on screen in Beat 6: unlike a street address, one receptor can be carried by several cell types (tag *one receptor, several cell types*).

**Typicality rules applied.** Exocytosis is this example's secretion mechanism, "not a definition of how every ligand is released" (MF4): spoken as "It is how a beta cell secretes insulin; other ligands can be released in other ways." Transport uses MF4's exact bound: "blood carries the signal widely around the body; it can then reach cells through tissue fluid"; nothing says blood reaches or touches every cell, and short-range diffusion through tissue fluid is named as another route for some ligands. "Specific" never means "one ligand, one cell type": liver cells share the insulin receptor (their response is not named; syllabus 14.1.10 lists insulin's effects on muscle and liver cells), and E44 repairs the same point for LL-37. The non-target cell is left unnamed (no real cell type is claimed to lack insulin receptors); it is drawn as *a cell without a complementary receptor for insulin (schematic)*. Receptors are "proteins in its membrane, this one a glycoprotein", not "glycoproteins" as a class. The named response is shown as labelled uptake through a separate labelled glucose transport protein, with no pathway, no carrier insertion, no second messenger. Reasons students err are phrased as possibilities ("It can feel right, since…"). The wrong word in E44 is named only as "the words active site here".

**One error beat, five moves** (announce → written card → 4 s silent read → talk-through with cue-synced rings → correct in place): **E44 in Beat 7**, badge **COMMON MISTAKE** (basis: an explicit mark-scheme reject line, W22/23 Q5(a)(i), MS p.17, `R active site`, **PDF-CHECKED (plan check)**; weights register). One fault on the card (the words *active site*); the in-place correction also supplies receptor identity and location, and the marker clears only on the completed correct frame. Card caption: *our framing of W22/23 Q5(a)(i) (the LL-37 context); constructed answer, not a transcript*. No other beat carries a COMMON MISTAKE or EXAM CONTRAST badge; Beat 9 closes on the genuine local contrast *✗ receptor active site / ✓ receptor binding site* (W22/23 Q5(a)(i), MS p.17), with no badge.

---

## The models, specified once

Shared orientation and colour roles as SHARED-SPECS §4: in membrane close-ups **outside the cell at the top, cytoplasm at the bottom**, carbohydrate chains on the external face only; proteins teal; carbohydrate chains green bead chains; **ligand shapes magenta**; glucose tokens orange hexagons; phospholipid heads warm amber, tails mid grey; error treatment terracotta. Whole-cell views (`SignallingScene`) are captioned *schematic; not to scale*; every whole cell's membrane is a single outline with receptors drawn on its outer surface.

### `SignallingScene` (published here; recalled by 4.2.1b for exocytosis)

A single wide panel, left to right, caption *schematic; not to scale*:
- **Left: pancreatic beta cell** (label **beta cell (pancreas)**), rounded outline, nucleus, and about eight **vesicles** (small membrane circles) each holding three to four magenta wedge tokens (label on first use **vesicles containing insulin**). The cell sits in a pale straw band of **tissue fluid** (label *tissue fluid*) beside the vessel.
- **Centre: capillary segment** running top to bottom, wall drawn as a thin outline, lumen dark red with a few red blood cell discs; flow arrows down the lumen (label **blood flow**). Wedge tokens drift into the lumen near the beta cell (route through the wall not detailed; small type *entry into the capillary not detailed*) and travel with the flow, spreading along it (motion).
- **Right column, all bathed in the same pale straw tissue-fluid band:** **muscle cell** (top; elongated outline, label **muscle cell (target)**), **liver cell** (middle; polygonal outline, label **liver cell (target)**), and a **cell without a complementary receptor for insulin** (bottom; plain rounded outline, label **cell without a complementary receptor for insulin (schematic)**). Muscle and liver cells carry four identical teal receptors each on their outer surface, each with a **notch-shaped binding site complementary to the wedge**; the bottom cell carries four teal receptors with a **rounded-square binding site** (a different shape).
- **Stage labels** along the top, lit in turn: **secretion** (over the beta cell), **transport** (over the vessel and tissue fluid), **binding** (over the right column), **specific response: increased glucose uptake** (beside the muscle cell).
- **Glucose tokens** (orange hexagons) sit in the tissue fluid beside the muscle cell throughout. The muscle cell carries a small teal **glucose transport protein** (label at whole-cell scale), separate from its insulin receptors, at the position where glucose crosses.
States:
- **`idle`**: all parts present; vesicles in the beta cell; a few wedge tokens already in the blood (baseline) are not drawn; flow arrows moving.
- **`secrete`**: one vesicle performs `VesicleTransport` `exocytosis` at the side of the beta cell facing the vessel; released wedges drift into the tissue fluid, then into the lumen.
- **`carry`**: wedges travel down the lumen with the flow (motion), then drift out into the tissue-fluid band beside each of the three right-hand cells (route through the wall not detailed).
- **`bind-target`**: at the muscle cell and the liver cell, wedges approach receptors and seat (`ReceptorLigand` `seat` at cell scale, 0.8 s).
- **`fail-nontarget`**: at the bottom cell, a wedge approaches a receptor, touches the rim of the rounded-square site, rocks, fails to seat and drifts away (`ReceptorLigand` `wrong-ligand-fail` at cell scale, 1.5 s); the bottom cell stays unchanged.
- **`respond`**: the muscle cell runs `ReceptorLigand` `response-uptake` at cell scale (glucose crossing only through the small labelled glucose transport protein); the liver cell's outline gives one soft glow, tag *responds (Topic 14)*, with no process drawn; the bottom cell stays unchanged, tag *no response to insulin*.
Motion contract: tokens move only with the flow, by drifting through tissue fluid, or by approach-and-seat/fail; no token passes through a cell outline except glucose in `response-uptake`, and then only through the labelled glucose transport protein (never an unlined gap, the receptor or the hydrophobic core); no intracellular pathway, cascade, second messenger or gene event is ever drawn.

### `ReceptorLigand` (4.1.3 basic states; `wrong-ligand-fail`, `seat`, `response-uptake` added here)

The `receptor-glycoprotein` of `FluidMosaicMembrane` (positions 8–9, spanning the bilayer, carbohydrate chain of 3 beads beside it on the outer face) enlarged, outside at the top, with its **binding site** labelled (never "active site"). Ligand A: magenta **wedge**, complementary to the notch (in this lesson labelled **insulin (ligand)**). Ligand B: magenta **square**, not complementary (labelled **a different signalling molecule**). Caption *schematic; not to scale; not a real protein shape*.
- **`wrong-ligand-fail`** (1.5 s): a mismatched ligand–receptor pair: the ligand descends onto the binding site, touches its rim, rocks once, fails to seat, drifts away. Used for ligand B at the insulin receptor (Beat 5) and, at cell scale, for insulin at the rounded-square receptor of the cell without a complementary receptor (Beats 6, 8).
- **`seat`** (0.8 s): ligand A descends and seats flush in the notch; a thin outline traces the fitted edge once, tag **complementary shape**. The ligand stays unchanged (no product is released).
- **`response-uptake`**: the enlarged membrane is recast as the muscle cell's surface (label **muscle cell**), with orange glucose tokens in the tissue fluid above. Keep the bilayer continuous around a separate teal glucose carrier, spatially distinct from the insulin receptor, labelled glucose transport protein. Reuse the carrier binding/change-of-shape/release motif; glucose never crosses an unlined gap, the receptor, or the hydrophobic core. A labelled before-binding miniature shows a lower illustrative uptake frequency; the after-binding view shows more carrier-mediated uptake events. Caption: increased glucose uptake; schematic, not measured; how insulin increases uptake is not shown. Do not animate carrier insertion or an intracellular signalling pathway. At whole-cell scale, preserve a small labelled protein route at the crossing position. The response label is **response: muscle cell increases glucose uptake**. No number, meter or counter value is shown.
Motion contract: non-covalent approach, fit and failure only; no covalent change; the receptor never changes shape in this lesson (only the separate glucose transport protein runs its binding/change-of-shape/release motif).

### `VesicleTransport` (`exocytosis` published here; 4.2.1b adds `phagocytosis`, `pinocytosis`)

**`exocytosis`**: a vesicle (a phospholipid-bilayer circle, heads amber outward and inward, drawn at the same scale as the cell's membrane outline) containing wedge tokens travels through the cytoplasm to the cell surface membrane (1.2 s, motion); the vesicle membrane touches and **fuses** with the cell surface membrane (0.6 s; both apposed bilayers join into continuous leaflets around an extracellularly open fusion pore; the vesicle lumen becomes continuous with tissue fluid, while cytoplasm remains separated; two leaflets are retained at cell-surface scale throughout fusion; never a cut); the opening widens and the wedges drift out into the tissue fluid (1.0 s); the vesicle's membrane flattens into the cell surface membrane. A small yellow tag **energy from ATP** sits beside the event (no token reaction for bulk transport). Label **exocytosis** at the fusion frame; small type *this example's secretion mechanism; not how every ligand is released*.

---

## Beat by beat

Beat windows in the headings are provisional and follow the per-beat ledger (words ÷ 120, plus the explicit 4 s silent read in Beat 7, so Beat 7 and later windows are shifted by 4 s; ordinary settling holds are included in the effective pacing estimate unless explicitly scheduled outside it); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch over 30 words without a stated visual change.

### BEAT 1 · Hook and context · 0:00–0:42
**Narration:**
> Ever wondered how a hormone finds exactly the right cells, when your blood carries it widely around your body? Your cells are separate compartments, each wrapped in its own membrane, and one way they coordinate is by releasing chemicals. After a meal, the glucose in your blood rises, and cells in your pancreas release a hormone called insulin. Your blood carries it past cells of many different kinds. So how does a message sent so widely get acted on in the right places?

**Visual action:**
1. **From the first frame**, a simple body outline (schematic, no organ detail) with a branching network of red blood vessels is on screen, and beside it a small magnified window showing a short vessel segment with blood flowing past three different cell outlines (no labels yet); at *Ever wondered how a hormone*, the hook question appears as a compact caption above the body outline, never alone on the frame.
2. At *your blood carries it widely*, flow arrows run along the vessel network from the trunk towards the limbs and head (motion).
3. At *separate compartments*, the window's three cells each gain a traced outline, tag *each cell inside its own membrane*; at *one way they coordinate*, a small magenta token leaves one cell and drifts towards another (motion), tag *chemical signal*.
4. At *After a meal*, a plate icon appears beside the body outline and small orange hexagons stream into the vessel network, tag *blood glucose rises*.
5. At *cells in your pancreas release*, a pancreas silhouette is highlighted in the body outline and a puff of magenta wedge tokens enters the nearest vessel, label **insulin**.
6. At *past cells of many different kinds*, the wedges spread along the network (motion); in the magnified window they pass the three different cell outlines, one after another.
7. At *get acted on in the right places*, one of the three cells gives a soft glow while the other two stay unchanged, tag **why here?**; dissolve to the objectives surface.

**On-screen text:** the hook question; *each cell inside its own membrane*; *chemical signal*; *blood glucose rises*; *insulin*; *why here?*. Small type: *schematic; not to scale*.

---

### BEAT 2 · What you will be able to do · 0:42–1:09
**Narration:**
> By the end you will be able to outline the three stages of cell signalling: secretion, transport and binding. You will explain why a cell responds to a signal only if it has a complementary receptor, and why several cell types can share one. And you will write it in the words mark schemes credit.

**Visual action:** **From the first frame**, the objectives' own styled surface (distinct background colour, **not the lesson diagram**) is on screen with a row of three flat authored pictograms waiting at its left edge (a vesicle circle opening, a single red droplet with a flow arrow, a notch-and-wedge pair); each line enters with motion beside its pictogram.
1. At *outline the three stages of cell signalling*, line 1 enters beside the three pictograms in a row: **OUTLINE** secretion → transport → binding.
2. At *why a cell responds to a signal only if it has a complementary receptor*, line 2 enters beside the notch-and-wedge pictogram: **EXPLAIN** why only cells with a complementary receptor respond; at *several cell types can share one*, its second half lands beside a pictogram of two different cell outlines carrying the same small notch: *and why several cell types can*.
3. At *the words mark schemes credit*, line 3 enters beside a pen-and-tick pictogram: **WRITE** it as mark schemes credit (receptor · binding site · complementary).

**On-screen text:** the three lines. Small type: *syllabus 4.1.4, "outline", p.21.*

---

### BEAT 3 · Stage one: secretion, by exocytosis · 1:09–1:53
**Narration:**
> Stage one is secretion. A specific chemical that a cell releases as a signal is called a ligand. In our example the ligand is insulin, a peptide hormone made by the beta cells of the pancreas and stored in vesicles, small sacs wrapped in membrane. When blood glucose rises, a vesicle moves to the cell surface membrane, the two membranes fuse, and the insulin is released outside the cell. That is exocytosis. It is how a beta cell secretes insulin; other ligands can be released in other ways.

**Visual action:**
1. **From the first frame**, `SignallingScene` in `idle` is on screen, full width, stage labels dim; at *Stage one is secretion*, the **secretion** label lights over the beta cell and the view eases in on the left third.
2. At *is called a ligand*, one magenta wedge inside a vesicle is ringed, label **ligand: a specific chemical released as a signal**.
3. At *the beta cells of the pancreas*, the cell label **beta cell (pancreas)** appears; small type *our example: insulin, a peptide hormone*.
4. At *stored in vesicles*, the vesicles are ringed in turn, label **vesicles containing insulin**; one vesicle enlarges into a close-up inset showing its bilayer (amber heads, grey tails), caption *schematic; not to scale*.
5. At *a vesicle moves to the cell surface membrane*, `secrete` begins: `VesicleTransport` `exocytosis` runs in the inset and at cell scale together; the vesicle travels to the side of the cell facing the vessel (motion).
6. At *the two membranes fuse*, in the inset both apposed bilayers join into continuous leaflets around an extracellularly open fusion pore; the vesicle lumen becomes continuous with tissue fluid, while cytoplasm remains separated (motion, no cut; two leaflets retained at cell-surface scale), tag *membranes fuse*.
7. At *released outside the cell*, the opening widens and the wedges drift out into the tissue-fluid band (motion); the **tissue fluid** label appears.
8. At *That is exocytosis*, label **exocytosis** lands at the fusion point; the tag **energy from ATP** sits small beside it (recall of the process: 4.2.1b).
9. At *other ligands can be released in other ways*, small type beneath the label: *this example's secretion mechanism; not how every ligand is released*.

**On-screen text:** *secretion*; *ligand: a specific chemical released as a signal*; *beta cell (pancreas)*; *vesicles containing insulin*; *membranes fuse*; *exocytosis*; *energy from ATP*; the mechanism bound.

---

### BEAT 4 · Stage two: transport, by blood and tissue fluid · 1:53–2:32
**Narration:**
> Stage two is transport of the ligand to its target cells. Insulin passes into a nearby capillary, and from there blood carries the signal widely around the body; it can then reach cells through tissue fluid, the liquid that bathes them. That means insulin meets cells of many different kinds on its way. Not every signal travels this far: some ligands simply diffuse through tissue fluid to cells close by. For insulin, the route is the blood.

**Visual action:**
1. **From the first frame**, `SignallingScene` holds with the released wedges in the tissue fluid beside the beta cell; at *Stage two is transport*, the **transport** label lights over the vessel and the view eases out to the full width.
2. At *passes into a nearby capillary*, the wedges drift into the lumen (motion); small type *entry into the capillary not detailed*; label **capillary** and **blood flow**.
3. At *blood carries the signal widely around the body*, `carry`: the wedges travel down the lumen with the flow and spread along it (motion); the Beat 1 body outline returns as a small corner inset with flow arrows running through its network.
4. At *reach cells through tissue fluid*, wedges drift out of the lumen into the tissue-fluid band on the right (motion); at *the liquid that bathes them*, the band is outlined once around all three right-hand cells.
5. At *cells of many different kinds*, the three right-hand cells are ringed in turn, still unlabelled; wedges drift near each of them.
6. At *Not every signal travels this far*, a small separate inset opens at lower left, labelled *short-range signal (schematic); not insulin*: two neighbouring cell outlines in tissue fluid, magenta square tokens leaving one and spreading to the other (motion); at *diffuse through tissue fluid to cells close by*, a short bracket spans the gap, tag *diffusion through tissue fluid*.
7. At *the route is the blood*, the inset closes and the vessel's flow arrows brighten once, tag **insulin: carried by blood**.

**On-screen text:** *transport*; *capillary*; *blood flow*; *tissue fluid*; *short-range signal (schematic); not insulin*; *insulin: carried by blood*. Small type: *blood carries the signal widely around the body; it can then reach cells through tissue fluid* (plan MF4 wording, as a caption, no quotation marks).

---

### BEAT 5 · Stage three: binding, and the address on the envelope · 2:32–3:20
**Narration:**
> Stage three is binding. A target cell has cell surface receptors: proteins in its membrane, this one a glycoprotein. Each receptor has a binding site with a particular shape. Watch a different signalling molecule arrive. It touches the binding site, but the shapes do not fit, and it drifts away. Now insulin. Its shape is complementary to the binding site, so it binds. Picture an address on an envelope: the letter passes many doors, but it is opened where the address matches. Written properly: the ligand binds to a specific receptor because their shapes are complementary.

**Visual action:**
1. **From the first frame**, `SignallingScene` holds with wedges in the tissue fluid beside the muscle cell; at *Stage three is binding*, the **binding** label lights and the view zooms onto one receptor on the muscle cell's surface, cross-fading into `FluidMosaicMembrane` `highlight:receptor-glycoprotein`, outside at the top, cytoplasm at the bottom; region labels *outside the cell (watery)*, *cytoplasm (watery)*; caption *schematic; not to scale*.
2. At *cell surface receptors*, `ReceptorLigand` basic state: the receptor brightens, label **cell surface receptor**; at *this one a glycoprotein*, its green carbohydrate chain on the outer face is ringed, tag *glycoprotein* (recall: 4.1.3).
3. At *a binding site with a particular shape*, the notch is traced once, label **binding site**.
4. At *a different signalling molecule arrive*, ligand B (magenta square, label **a different signalling molecule**) descends from the top; at *It touches the binding site*, `wrong-ligand-fail`: it touches the rim and rocks once; at *the shapes do not fit*, side-note *not complementary*; at *it drifts away*, it drifts off upward (motion) and out of frame.
5. At *Now insulin*, ligand A (magenta wedge, label **insulin (ligand)**) descends; at *Its shape is complementary to the binding site*, `seat`: it seats flush in the notch (0.8 s) and the fitted edge is traced, tag **complementary shape**; at *so it binds*, the tag **bound** lands.
6. At *Picture an address on an envelope*, a small handle inset slides in at right, beside the receptor: an envelope passing a row of three doors (motion); at *opened where the address matches*, it stops at the door whose number matches the envelope's address and opens; small type *handle: an aid to memory, not an exam answer*.
7. At *Written properly*, a sentence surface slides up beneath the receptor; at *the ligand binds to a specific receptor*, the sentence builds clause by clause beside the seated wedge: **The ligand binds to a specific receptor · because their shapes are complementary.** The handle inset dims.

**On-screen text:** *binding*; *cell surface receptor*; *glycoprotein*; *binding site*; *a different signalling molecule*; *not complementary*; *insulin (ligand)*; *complementary shape*; *bound*; the handle inset and its small type; the sentence.

---

### BEAT 6 · A specific response, and which cells respond · 3:20–4:04
**Narration:**
> Binding starts a specific response. In muscle cells, insulin binding leads to an increase in glucose uptake: watch more glucose enter once insulin has bound. How the cell does that inside is a later topic; here you name the response. Liver cells carry the same insulin receptor, so they respond too, in their own way. A cell without a complementary receptor for insulin does not respond to it. So the blood broadcasts the message, and the receptors decide where it is acted on. That is why complementary shape matters.

**Visual action:**
1. **From the first frame**, retain the bound receptor from Beat 5 and a small explicitly labelled before-binding comparison beside the muscle-cell membrane (miniature labelled *before binding*: the same continuous bilayer and separate teal **glucose transport protein**, with a lower illustrative frequency of carrier-mediated uptake events, motion). At *Binding starts a specific response*, the close-up is recast as the muscle cell's surface (label **muscle cell**), with a separate teal carrier, spatially distinct from the insulin receptor, labelled **glucose transport protein**, and orange glucose tokens in the tissue fluid above; the baseline belongs to the labelled comparison, not to an interval after insulin has already bound.
2. At *leads to an increase in glucose uptake*, `response-uptake`: show the after-binding uptake increase through the separate carrier, which runs its binding/change-of-shape/release motif more often (more carrier-mediated uptake events, motion); glucose never crosses an unlined gap, the receptor or the hydrophobic core; label **response: muscle cell increases glucose uptake**; caption *increased glucose uptake; schematic, not measured; how insulin increases uptake is not shown*; at *watch more glucose enter*, the crossing tokens are traced by a thin accent arrow, tag *more glucose enters after binding*.
3. At *How the cell does that inside*, the cytoplasm below the receptor is bracketed, tag *events inside the cell: not drawn (Topic 14)*; at *here you name the response*, the response label brightens.
4. At *Liver cells carry the same insulin receptor*, the view eases back out to `SignallingScene`; the liver cell's label **liver cell (target)** appears and its receptors are ringed alongside the muscle cell's (identical notches), tag **one receptor, several cell types**; at *so they respond too*, `bind-target` at the liver cell: a wedge seats, and the cell gives one soft glow, tag *responds (Topic 14)*; small type *syllabus 14.1.10, p.38: "with reference to the effects of insulin on muscle cells and liver cells"*.
5. At *A cell without a complementary receptor*, the bottom cell's label appears, **cell without a complementary receptor for insulin (schematic)**; `fail-nontarget`: a wedge approaches a rounded-square receptor, touches the rim, rocks, fails to seat and drifts on (motion); at *does not respond to it*, tag *no response to insulin*; the cell stays unchanged.
6. At *the blood broadcasts the message*, the vessel's flow arrows pulse once along its length; at *the receptors decide where it is acted on*, the receptors on the muscle and liver cells brighten together, the bottom cell's receptors stay dim.
7. At *That is why complementary shape matters*, the stage label **specific response: increased glucose uptake** lights beside the muscle cell; all four stage labels are now lit.

**On-screen text:** *muscle cell*; *before binding*; *glucose transport protein*; *response: muscle cell increases glucose uptake*; *increased glucose uptake; schematic, not measured; how insulin increases uptake is not shown*; *more glucose enters after binding*; *events inside the cell: not drawn (Topic 14)*; *liver cell (target)*; *one receptor, several cell types*; *responds (Topic 14)*; the 14.1.10 small type; *cell without a complementary receptor for insulin (schematic)*; *no response to insulin*; all four stage labels. Small type on the uptake: *schematic; not measured*.

---

### BEAT 7 · COMMON MISTAKE E44: "active site" for a receptor · 4:04–5:19
**Narration:**
> Here is a mistake the mark scheme names, on the card. A November 2022 question asked why many different types of cell can respond to the same signalling molecule, LL-37. Read this answer.
>
> *(silent read, 4 s)*
>
> Look at the words active site here. It can feel right, since you met complementary shapes with enzymes, where active site is the correct term. But LL-37 is not turned into products here: it binds to a receptor, and the cell responds. The mark scheme for this question rejects active site, so that wording earns nothing. The receptor's term is binding site. Now look at what the question says: many cell types respond. Specific does not mean one cell type; these cell types can share the same complementary receptor. So, in place: they have the same receptor in their cell surface membranes, with a binding site complementary to LL-37.

**Visual action:**
1. **From the first frame**, the `ReceptorLigand` close-up (receptor with a seated wedge, binding site labelled) and the `SignallingScene` thumbnail hold at left, dimmed. **Entry cue: *Here is a mistake the mark scheme names*.** The COMMON MISTAKE panel enters (header badge **COMMON MISTAKE**, terracotta border, desaturated surround) with its basis line in small type: *basis: mark-scheme reject line, W22/23 Q5(a)(i), MS p.17*. It **stays on until the completed correct frame**.
2. At *A November 2022 question asked*, the header lands: **Suggest why many different types of cell can respond to LL-37.** with small type *our framing of W22/23 Q5(a)(i) (the LL-37 context), our paraphrase. Constructed answer, not a transcript.* At *the same signalling molecule, LL-37*, a neutral magenta token labelled **LL-37 (a signalling molecule)** appears beside the header; its receptor is not drawn or named.
3. At *Read this answer*, the written wrong answer appears in handwriting style: **✗ All of these cell types have an active site that is complementary to LL-37, so LL-37 binds to it.**
4. **Silent read, 4 s.** Panel and card held.
5. At *Look at the words active site here*, the words *active site* on the card are ringed in terracotta.
6. At *you met complementary shapes with enzymes*, a small `EnzymeActiveSiteModel` `rest-lk` thumbnail appears beside the card, labelled **enzyme · active site**, tag *recall: 3.1.1-2*; a side-note arrow runs from it to the ringed words: *the enzyme word*.
7. At *LL-37 is not turned into products here*, the thumbnail's product outlines are shown struck through, tag *no products*; at *it binds to a receptor*, the dimmed receptor at left brightens, its **binding site** label pulses.
8. At *The mark scheme for this question rejects active site*, citation tab, exact: **W22/23 Q5(a)(i), MS p.17: `R active site`**; its R is underlined; at *that wording earns nothing*, small type beneath the tab: *R = rejected for that marking point in that question*. The ring on *active site* stays; the marker stays on.
9. At *The receptor's term is binding site*, side-note beside the ringed words: *receptor → binding site*.
10. At *many cell types respond*, the header's words *many different types of cell* are underlined in the normal accent; at *Specific does not mean one cell type*, side-note *specific ≠ one cell type*; at *share the same complementary receptor*, show two unnamed cell silhouettes beside the corrected answer, each carrying the same abstract receptor symbol. Caption: *shared receptor, schematic explanation of the credited point; LL-37 receptor identity not specified.* Keep the earlier insulin scene dimmed as background recall; do not highlight muscle/liver cells as part of the LL-37 marking explanation.
11. At *So, in place*, the correction happens on the card with the marker still on: *an active site* is struck and replaced by **the same receptor in their cell surface membranes, with a binding site**; at *with a binding site complementary to LL-37*, the card reads **✓ All of these cell types have the same receptor in their cell surface membranes, with a binding site that is complementary to LL-37, so LL-37 binds to it.** and **the marker clears on this completed frame**. Small type under the card: *credited ideas: receptor identity, location, complementary shape; any two (W22/23 MS p.17, our paraphrase)*. **Exit cue: end of *complementary to LL-37*.** Treatment lifts; the corrected card holds.

**On-screen text:** the panel and its basis line; the framed header and caption; the card; the recall thumbnail; the MS tab; *receptor → binding site*; *specific ≠ one cell type*; *one receptor, several cell types*; the two unnamed cell silhouettes with their caption; the corrected card; the credited-ideas small type.

---

### BEAT 8 · What I told you, on the scene · 5:19–5:56
**Narration:**
> So here it is, on the scene you watched. Secretion: beta cells release insulin, a ligand, by exocytosis. Transport: the blood carries it widely, and it reaches cells through tissue fluid. Binding: on target cells, it binds to cell surface receptors whose binding sites are complementary in shape. That binding starts a specific response: muscle cells take up more glucose. Cells that share the receptor can all respond; cells without it do not.

**Visual action:** **No new slide.** **From the first frame**, the screen returns to the layout built through the lesson: `SignallingScene` full width with all four stage labels, the fused exocytosis point on the beta cell, wedges in the vessel and tissue fluid, wedges seated on the muscle and liver cells' receptors, the muscle cell's small labelled **glucose transport protein** at the crossing position, the failed wedge beside the bottom cell; the `ReceptorLigand` close-up of the seated insulin small at upper right with the Beat 5 sentence beneath it. Static. Key points fade in in place:
1. At *on the scene you watched*, the whole layout settles; nothing moves.
2. At *Secretion: beta cells release insulin*, the **secretion** label and the fusion point brighten; at *by exocytosis*, the **exocytosis** label brightens.
3. At *Transport: the blood carries it widely*, the **transport** label and the vessel brighten; at *it reaches cells through tissue fluid*, the tissue-fluid band brightens.
4. At *Binding: on target cells*, the **binding** label and the seated wedges on muscle and liver receptors brighten; at *complementary in shape*, the close-up's traced edge and **binding site** label brighten.
5. At *muscle cells take up more glucose*, **specific response: increased glucose uptake**, the labelled glucose transport protein and the glucose tokens inside the muscle cell brighten.
6. At *Cells that share the receptor can all respond*, the muscle and liver receptors brighten together with the tag *one receptor, several cell types*; at *cells without it do not*, the bottom cell's tag *no response to insulin* brightens.

**On-screen text:** as built; the key points brighten in place.

---

### BEAT 9 · How it is asked, the local reject, and the hook · 5:56–6:47
**Narration:**
> How does this reach you? March 2024 Paper 22 used prostaglandins in inflammation. Prostaglandins are released by cells or transported to target cells, then bind to receptors on their surface membranes. Those are two marking points; release and transport share one. A full outline still names all three stages. The scheme does not need our insulin example; that is beyond the mark scheme. November 2022 asked why different cell types respond to LL-37: shared complementary receptors. For that question, use binding site for the receptor. And our hormone does not search: blood carries it widely, and complementary receptors determine which cells respond.

**Visual action:**
1. **From the first frame**, the familiar `SignallingScene` stays on screen at right (reduced; the muscle cell's small labelled glucose transport protein kept at the crossing position), with the `ReceptorLigand` close-up beneath it; at *How does this reach you?*, a compact forms surface enters at left, one row per form. Row 3 is revealed with the surface at this cue (not narrated): **adjacent: a receptor inside the cell** · *S21/22 Q3(c), QP p.6 / MS p.12, 1 mark: hormone S binds cytoplasmic receptor R by complementary shape, supplied in the question's diagram (our paraphrase); adjacent specificity evidence only; not this lesson's cell-surface stages*, small type, exact: *MS p.12: `Reject if hormone S or receptor R described as an antigen or enzyme`*; beside it a small plain cell outline with an unshaded receptor inside it (no pathway drawn).
2. At *March 2024 Paper 22*, display row 1: **Prostaglandins in inflammation — outline cell signalling; 2 marks**, cited *M24/22 Q1(c)(iii), QP p.5 / MS p.7*, labelled *our paraphrase*. Beside it a simple secreting-cell → ligand → target-cell schematic appears (plain outlines, unnamed cells, a neutral round magenta ligand token, not the insulin wedge). At *Prostaglandins are released by cells*, build and retain line **1. Prostaglandins are released by cells OR transported to target cells.**; at *then bind to receptors*, build and retain line **2. They bind to receptors on target-cell surface membranes.**
3. At *release and transport share one*, a bracket groups *released by cells OR transported to target cells* together under point 1.
4. At *A full outline still names all three stages*, secretion → transport → binding is highlighted on the schematic and the scene's three stage labels brighten, tag *syllabus outline*; no mark count is attached to the three stages; small type *R24 p.21 (June 2024 P23 Q5(a)): intracellular details not required at AS; fewer answers mentioned release/transport (supported paraphrase)*.
5. At *beyond the mark scheme*, the familiar insulin scene (the reduced `SignallingScene` at right) is framed in a dashed panel labelled **beyond the mark scheme — our insulin illustration**; the prostaglandin answer (lines 1–2) remains visible at left.
6. At *November 2022*, row 2 is revealed: **why different cell types respond to LL-37 (2 marks)** · *W22/23 Q5(a)(i), QP p.12 / MS p.17, our paraphrase*, with the corrected E44 card as a thumbnail beside it (unnamed cell silhouettes sharing one abstract receptor symbol, as in E44's corrected frame); at *shared complementary receptors*, small type *credited: receptor identity · location · complementary shape; any two (our paraphrase)*.
7. At *use binding site for the receptor*, the close lands on the genuine local contrast: **✗ receptor active site / ✓ receptor binding site**, citing *W22/23 Q5(a)(i), MS p.17, `R active site`*; small type *R = rejected for that marking point in that question*.
8. At *And our hormone does not search*, the Beat 1 body outline returns small beneath the scene with its hook caption, and wedges flow through its network without steering (motion); at *blood carries it widely*, the network's flow arrows brighten once; at *complementary receptors determine which cells respond*, the scene's muscle and liver receptors brighten with their seated wedges, and the hook caption gains the line **carried widely · complementary receptors determine which cells respond**. **Exit cue: end of *determine which cells respond*.** Final frame held 2 s (an ordinary settling hold, inside the effective pacing estimate): forms and the prostaglandin answer at left, the dashed insulin panel and the local contrast at right, the body outline beneath. No slogan.

**On-screen text:** row 1 *Prostaglandins in inflammation — outline cell signalling; 2 marks* with its citation and *our paraphrase*; answer lines 1–2 and the point-1 bracket; *syllabus outline*; the R24 small type; *beyond the mark scheme — our insulin illustration*; row 2 with citation and credited-ideas small type; row 3 (S21/22) with its exact reject line in small type; *✗ receptor active site / ✓ receptor binding site* with its citation; the hook caption and its answer line.

---

## Datasets

**No numerical dataset is used in this lesson.** Nothing is measured, calculated, supplied or plotted, and no number appears on screen except citation references and the syllabus page. The glucose-uptake increase in `response-uptake` (Beats 6, 8) is a **schematic motion** (more carrier-mediated uptake events through the labelled glucose transport protein after binding than in the labelled before-binding miniature, an illustrative frequency only), captioned *increased glucose uptake; schematic, not measured*, with no counter value, rate or axis; no fabricated value is labelled illustrative. Timers do not apply: no practical, material or liquid contact is shown.

## Real-world samples

| Material | What the method responds to | Fit (range, clarity) | Interferences and how the method handles them | Beats |
|---|---|---|---|---|
| none handled | — | — | — | — |

Explain-beat real-world example (not a handled material): **insulin**, secreted by pancreatic beta cells, carried in the blood, acting on muscle cells (named response: increased glucose uptake) and liver cells (response not named); scope bounded by syllabus 14.1.10 (p.38), whose regulation is Topic 14's (Beats 1, 3–6, 8, 9). In the exam close (Beat 9) the mark-scheme answer (prostaglandins, M24/22) comes first; the insulin scene is then spoken and visually labelled as beyond the scheme (*beyond the mark scheme — our insulin illustration*). LL-37 appears only as the exam question's context (Beat 7, 9), its receptor unnamed; E44's shared-receptor explanation uses unnamed cell silhouettes, not the insulin cells.

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.21) | Beat(s) | How |
|---|---|---|
| outline the main stages in the process of cell signalling | 2, 3–6, 8, 9 | three stages in order on one scene, each explained; outline sentence in the recap and exam close |
| leading to specific responses | 6, 8 | named response (muscle cells increase glucose uptake) shown as labelled uptake, no pathway; liver cells respond (not named); cell without a complementary receptor does not respond |
| secretion of specific chemicals (ligands) from cells | 3, 8 | ligand defined; insulin from beta cells, stored in vesicles, released by exocytosis (motion); mechanism bounded to this example |
| transport of ligands to target cells | 4, 8 | blood carries the signal widely; reaches cells through tissue fluid; short-range diffusion through tissue fluid named for some ligands |
| binding of ligands to cell surface receptors on target cells | 5, 6, 7, 8 | receptor glycoprotein with binding site; wrong ligand attempts and fails to seat; insulin seats; handle converted at once; shared receptor across cell types |
| cell signalling (cell surface receptors), 4.1.3 overlap | 5 (recall) | receptor role recalled from 4.1.3 by label; not retaught |
| 14.1.10 (insulin on muscle and liver cells) | 6 (small type) | example scope only; regulation and intracellular events handed to Topic 14 |

### Mark-scheme and examiner points → beats

| Source | Point | Beat |
|---|---|---|
| W22/23 Q5(a)(i), MS p.17 | `R active site`; receptor identity/location/complementarity, any two (paraphrase); LL-37 context: many cell types respond (shared receptor) | 7 (E44), 9 |
| M24/22 Q1(c)(iii), QP p.5 / MS p.7 | prostaglandins in inflammation: outline cell signalling, 2 marks; point 1 release OR transport (one point), point 2 receptor binding; optional intracellular point 3, any two (paraphrase) | 9 (primary close; answer shown first) |
| S21/22 Q3(c), QP p.6 / MS p.12 | cytoplasmic receptor R, complementary binding, 1 mark; `Reject if hormone S or receptor R described as an antigen or enzyme`; adjacent only | 9 (row 3, not narrated) |
| R24 p.21, June 2024 P23 Q5(a) | detailed intracellular events not required at AS in that question; the report notes omitted secretion/transport stages (supported paraphrase) | 6 (design: no pathway), 9 (small type at *A full outline still names all three stages*) |
| G04 receptor-specificity row | identify the signal and its matching receptor without confusing a receptor with an enzyme or antigen (G04 description, not quoted) | 5, 7 |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, never, only, no, nothing, cannot, because, must, needs* and causal *so/since* was reread: true of all cases, or of the case on screen?
- "Ever wondered how a hormone finds exactly the right cells" (1): the student's own framing, answered and reframed in Beat 9 ("our hormone does not search"). "when your blood carries it widely around your body" (1): MF4's bound; no "everywhere" or "every cell".
- "one way they coordinate is by releasing chemicals" (1): "one way", leaving nerves and other routes open; no claim that cells can never share contents.
- "past cells of many different kinds" (1), "meets cells of many different kinds" (4): no claim about which of them respond.
- "a cell responds to a signal only if it has a complementary receptor" (2): *only* is bounded to the receptor-mediated signalling this outcome describes; the receptor may be anywhere the signal reaches (S21/22 Q3(c)'s cytoplasmic receptor is consistent with it). "several cell types can share one" (2): "can".
- "A specific chemical that a cell releases as a signal is called a ligand" (3): the syllabus's "specific chemicals (ligands)". "a peptide hormone made by the beta cells of the pancreas" (3): our example (MF4 "peptide-hormone example").
- "When blood glucose rises, a vesicle moves…" (3): the trigger in our example only; regulation is Topic 14's.
- "It is how a beta cell secretes insulin; other ligands can be released in other ways" (3): MF4's bound on exocytosis.
- "from there blood carries the signal widely around the body; it can then reach cells through tissue fluid" (4): MF4 exact wording. "Not every signal travels this far: some ligands simply diffuse…" (4): "some". "For insulin, the route is the blood" (4): our example, as taught (plan: insulin carried in a blood-flow stream).
- "proteins in its membrane, this one a glycoprotein" (5): the drawn receptor only; not "all receptors are glycoproteins".
- "Each receptor has a binding site with a particular shape" (5): definitional for the receptors taught here.
- "the shapes do not fit" (5): this ligand–receptor pair on screen. "Its shape is complementary to the binding site, so it binds" (5): the pair on screen. "it is opened where the address matches" (5): inside the analogy, with no "only"; converted at once; its limit (one receptor, several cell types) is on screen in Beat 6.
- "the ligand binds to a specific receptor because their shapes are complementary" (5): VIDEO-STRUCTURE's creditworthy sentence; *because* is the credited causal link for binding.
- "In muscle cells, insulin binding leads to an increase in glucose uptake" (6): MF4's named response.
- "Liver cells carry the same insulin receptor, so they respond too, in their own way" (6): syllabus 14.1.10 lists insulin's effects on liver cells; their response is not named.
- "A cell without a complementary receptor for insulin does not respond to it" (6): the unnamed schematic cell; no real cell type is claimed to lack insulin receptors.
- "So the blood broadcasts the message, and the receptors decide where it is acted on. That is why complementary shape matters." (6): the framing sentence (VIDEO-STRUCTURE), bounded to receptor-mediated signalling; no "every cell" claim.
- E44 (7): "It can feel right, since you met complementary shapes with enzymes": a possibility, not a report of candidates' reasoning. "LL-37 is not turned into products here": bounded by "here" (binding at a receptor in this question); no claim that no receptor has catalytic activity. "The mark scheme for this question rejects active site, so that wording earns nothing": the R line, local to that marking point and question (small type *R = rejected for that marking point in that question*). "Specific does not mean one cell type; these cell types can share the same complementary receptor": the plan check's exact repair, "can".
- "Cells that share the receptor can all respond; cells without it do not" (8): "can"; "cells without it" is the complementary-receptor condition for that ligand.
- "Prostaglandins are released by cells or transported to target cells, then bind to receptors on their surface membranes" (9): the M24/22 scheme's two points in that question's context (MS p.7), not a general claim about all prostaglandin action. "Those are two marking points; release and transport share one" (9): that scheme only. "A full outline still names all three stages" (9): our advice for a syllabus outline; no claim that three marks exist or that a shorter answer scores zero. "The scheme does not need our insulin example; that is beyond the mark scheme" (9): bounded to that scheme. "November 2022 asked why different cell types respond to LL-37: shared complementary receptors" and "For that question, use binding site for the receptor" (9): bounded to that question (MS p.17, `R active site`). "our hormone does not search: blood carries it widely, and complementary receptors determine which cells respond" (9): the hook's answer for our insulin example, bounded to receptor-mediated signalling as in Beat 6; "widely", not "everywhere".
- No sentence says blood reaches or touches every cell, that exocytosis is how every ligand is released, that one ligand acts on one cell type, that a receptor has an active site, or that any real cell type lacks insulin receptors; no cascade, second messenger or intracellular receptor pathway is narrated or drawn.

---

## Citations

Every quotation in this storyboard, where it appears, and the file it was copied from. Nothing is quoted from an exam PDF directly by this author, who opened none; the round-1 check then verified each row against the actual PDFs (status column).

| # | Quotation (verbatim) | Paper / session / question / page | Beat(s) | Copied from | Status |
|---|---|---|---|---|---|
| 1 | "outline the main stages in the process of cell signalling leading to specific responses: · secretion of specific chemicals (ligands) from cells · transport of ligands to target cells · binding of ligands to cell surface receptors on target cells" | Syllabus 2025–2027, 4.1.4, p.21 | header; spine | `SYLLABUS-9700-DETAIL.md` | syllabus (verbatim) |
| 2 | "with reference to the effects of insulin on muscle cells and liver cells" (excerpt of 14.1.10) | Syllabus 2025–2027, 14.1.10, p.38 | 6 (small type) | `SYLLABUS-9700-DETAIL.md` | syllabus (verbatim excerpt) |
| 3 | `R active site` | W22/23 Q5(a)(i), MS p.17 (9700/23 November 2022) | spine; 7; ledger | `work/006/SHARED-SPECS.md` §2; `TOPIC-04-WEIGHTS.md` E44 | **PDF-CHECKED (plan check)**; not reopened by this author (register-only); **PDF-CHECKED (round-1 check)**: exact reject matches, `9700_w22_ms_23.pdf` p.17 |
| 4 | `Reject if hormone S or receptor R described as an antigen or enzyme` | S21/22 Q3(c), MS p.12 (9700/22 June 2021) | spine; 9 (small type, row 3) | `work/006/SHARED-SPECS.md` §2; `TOPIC-04-WEIGHTS.md` ledger | **PDF-CHECKED (plan check)**; not reopened by this author (register-only); **PDF-CHECKED (round-1 check)**: exact match, context verified, `9700_s21_ms_22.pdf` p.12 |
| 5 | (no quotation) M24/22 Q1(c)(iii): prostaglandins in inflammation; outline cell signalling, 2 marks; point 1 release OR transport, point 2 receptor binding; optional point 3 intracellular examples, any two | M24/22 Q1(c)(iii), QP p.5 / MS p.7 (9700/22 March 2024) | spine; 9 | `TOPIC-PLAN-04-MEMBRANES.md` §4.1.4; plan check MF1; round-1 check audit | paraphrase; PDF-CHECKED (plan check) description; **PDF-CHECKED (round-1 check)**: `9700_m24_qp_22.pdf` p.5, `9700_m24_ms_22.pdf` p.7, context restored (M2) |
| 6 | (no quotation) W22/23 Q5(a)(i) context and credited ideas: why many cell types respond to LL-37; receptor identity/location/complementarity, any two | W22/23 Q5(a)(i), MS p.17 | 7; 9 | `TOPIC-04-WEIGHTS.md` ledger; plan check E44 row | paraphrase; PDF-CHECKED (plan check) description; **PDF-CHECKED (round-1 check)**: `9700_w22_qp_23.pdf` p.12 and MS p.17, any two; location accepts cell surface membrane or inside cell |
| 7 | (no quotation) R24 p.21, June 2024 P23 Q5(a): detailed intracellular events not required at AS in that signalling question; omitted secretion/transport stages noted | R24 p.21 (June 2024 ER) | spine; 9 (small type) | `EXAMINER-INSIGHT-9700.md` §5; `TOPIC-04-WEIGHTS.md` S-G; plan check citation audit; round-1 check audit | supported paraphrase (PDF-CHECKED (plan check)); **PDF-CHECKED (round-1 check)** against the official June 2024 ER PDF, p.21 (SHA-256 `ff0680be…a41e`); never in quotation marks |
| 8 | (no quotation) S21/22 Q3(c) context: hormone S binds cytoplasmic receptor R by complementary shape, 1 mark | S21/22 Q3(c), QP p.6 / MS p.12 | spine; 9 | `TOPIC-04-WEIGHTS.md` ledger; plan MF4 paragraph; round-1 check audit | paraphrase; PDF-CHECKED (plan check) description; **PDF-CHECKED (round-1 check)**: `9700_s21_qp_22.pdf` p.6 locates R in the cytoplasm |

Plan wording used as captions without quotation marks (our sources, not exam wording): MF4's "blood carries the signal widely around the body; it can then reach cells through tissue fluid" (Beat 4 small type, narration) and "this example's secretion mechanism" bound (Beat 3).

**UNVERIFIED items** (not quoted; shown only as our framing or omitted):
1. **RESOLVED (round-1 check)** — M24/22 Q1(c)(iii): QP p.5 / MS p.7 is about prostaglandins and cells involved in inflammation; MS credits (1) release OR transport of prostaglandins and (2) their receptor binding; intracellular examples an optional point 3, any two. Beat 9 row 1 now shows this, labelled *our paraphrase*.
2. **RESOLVED (round-1 check)** — W22/23 Q5(a)(i): QP p.12 asks how many different cell types respond to the same signalling compound; MS p.17 any two of identity/location/complementarity, location accepting cell surface membrane **or inside cell**; `R active site` exact. Beat 7's header remains *our framing* (paraphrase); no student-facing UNVERIFIED label remains.
3. `UNVERIFIED — the identity of LL-37's receptor(s)`. Not named or drawn anywhere; LL-37 appears only as a neutral magenta token.
   Still UNVERIFIED after the round-1 check: neither established by these papers nor needed; left unnamed.
4. **RESOLVED (round-1 check)** — R24 p.21 (June 2024 P23 Q5(a)): paraphrase supported by the official PDF (intracellular details not required at AS; fewer mentions of release/transport; appropriate events leading to a specific response accepted). Still shown only as paraphrase, never in quotation marks.
5. **RESOLVED (round-1 check)** — S21/22 Q3(c): QP p.6 explicitly locates R in the cytoplasm; MS p.12 reject line exact. Row 3 remains our paraphrase with the verified reject line only.

---

## Word count and runtime

Counted by the validator over the blockquoted narration, silent-read line excluded; seconds = words ÷ 120 × 60, plus the explicit 4 s E44 read (SHARED-SPECS §2a).

| Beat | Title | Kind | Words | Seconds |
|---|---|---|---:|---:|
| 1 | Hook and context | teaching | 83 | 41.5 |
| 2 | What you will be able to do | teaching | 55 | 27.5 |
| 3 | Stage one: secretion, by exocytosis | teaching | 88 | 44.0 |
| 4 | Stage two: transport, by blood and tissue fluid | teaching | 77 | 38.5 |
| 5 | Stage three: binding, and the address on the envelope | teaching | 96 | 48.0 |
| 6 | A specific response, and which cells respond | teaching | 89 | 44.5 |
| **7** | **COMMON MISTAKE E44** | **error** | **142** | **75.0** (71.0 + 4 s read) |
| 8 | What I told you, on the scene | teaching | 73 | 36.5 |
| 9 | How it is asked, the local reject, and the hook | teaching | 102 | 51.0 |
| **Teaching (8 beats)** | | | **663** | **5:31.5** |
| **Error (1 beat)** | | | **142** | **1:15.0** (1:11.0 + 4 s read) |
| **Total** | 9 beats | | **805** | **6:46.5** (6:42.5 narration + 4 s read) |
| Budget | | | 840 | 7:00 |

**Length, honestly:** Narration: 805 words ÷ 120 = 6:42.5. Add the explicit E44 read of 4 s: **6:46.5, 13.5 s below the 7:00 budget**. E44: 142 words ÷ 2 + 4 = **75 s**, inside the five-move 65–75 s range and its 1:15 reservation, all five moves present. The eight teaching beats total **663 words = 5:31.5**, 13.5 s under the 5:45 teaching base (690 words). Ordinary settling holds, including Beat 9's final 2 s hold, are included in the effective pacing estimate unless explicitly scheduled outside it. No cut list is needed; nothing was thinned to reach this length, and the error beat is complete.

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| Intracellular events: second messengers, cAMP, kinase cascades, G proteins, how muscle cells increase glucose uptake, glucose transporter translocation | Topic 14 (14.1.9–14.1.10); excluded here by the plan's ceiling and R24 p.21 |
| Control of blood glucose, negative feedback, glucagon, the liver's response to insulin | Topic 14 (14.1.10, p.38); liver response not named |
| Intracellular (cytoplasmic) receptors; steroid entry and gene regulation | not in the outcome (S21/22 Q3(c) shown only as adjacent evidence, no pathway) |
| How insulin enters and leaves capillaries; structure of capillary walls; tissue-fluid formation | Topic 8 (captioned *entry into the capillary not detailed*) |
| Exocytosis and endocytosis as transport processes (energy, vesicle mechanics in full) | 4.2.1b (the `exocytosis` state is published here for it; *energy from ATP* tag only) |
| Roles of membrane components in general; receptor role in the list of six | 4.1.3 (recalled by label) |
| Nerve signalling; named paracrine signals; an inventory of signalling pathways | not in the outcome (calibration DO-NOT-ADD); short-range diffusion named once, unnamed |
| LL-37's biology and receptors | not in the outcome; the exam context only |
| Immune recognition, antigens | 4.1.3 / 11.1.2 |

## Reusable models

| Model | Specified | For |
|---|---|---|
| **`SignallingScene`** (`idle`, `secrete`, `carry`, `bind-target`, `fail-nontarget`, `respond`; beta cell, capillary with flow, tissue fluid, muscle and liver target cells sharing one receptor, a cell without a complementary receptor; four stage labels) | here | 4.2.1b (exocytosis recall); Topic 14 may extend it with the intracellular events this lesson excludes |
| **`ReceptorLigand`** `wrong-ligand-fail` (a mismatched pair, either direction), `seat`, `response-uptake` (labelled uptake through a separate labelled glucose transport protein, before-binding comparison miniature; no pathway, no carrier insertion) | here, on 4.1.3's basic states | 4.2.1b (E47 vocabulary recall: binding site) |
| **`VesicleTransport`** `exocytosis` (vesicle travels, both bilayers join into continuous leaflets around an extracellularly open fusion pore, contents released; *energy from ATP* tag) | here | 4.2.1b adds `phagocytosis`, `pinocytosis`; E46 card thumbnails |
| The envelope handle and its converted sentence, with its limit *one receptor, several cell types* | here | 4.1.3 recall; Topic 14 |
| `FluidMosaicMembrane`, `ReceptorLigand` basic states, `EnzymeActiveSiteModel` `rest-lk` | 4.1.1-2; 4.1.3; 3.1.1-2 | used here by state id |

---

## Assets

| Asset | Status | Source |
|---|---|---|
| `SignallingScene` (beta cell with vesicles, capillary with flow and red blood cell discs, tissue-fluid band, muscle cell with a small labelled glucose transport protein at the crossing position, liver cell, unnamed cell with rounded-square receptors, four stage labels; used also as the recap and close thumbnails) | **new build** | authored vector; schematic |
| `ReceptorLigand` states `wrong-ligand-fail`, `seat`, `response-uptake` (with the separate teal glucose transport protein reusing 4.1.3's carrier binding/change-of-shape/release motif, and the labelled before-binding miniature) | **new states** on 4.1.3's receptor; carrier motif reused | authored; motion contract above |
| `VesicleTransport` `exocytosis` (bilayer vesicle; both apposed bilayers join into continuous leaflets around an extracellularly open fusion pore) | **new build** | authored; rendered still-frame verification pending (continuous leaflets at the fusion frame; heads outward on both faces; no gap or crossed leaflets; cytoplasm stays separated) |
| `FluidMosaicMembrane` `highlight:receptor-glycoprotein` | reuse | 4.1.1-2 |
| `EnzymeActiveSiteModel` `rest-lk` thumbnail | reuse | 3.1.1-2 |
| Body outline with vessel network; pancreas silhouette; plate icon; handle inset (envelope and doors); short-range-signal inset; objectives pictograms (vesicle, droplet with flow arrow, notch-and-wedge, two cells sharing a notch, pen-and-tick) | new, schematic vector | authored; no photograph, no generated image |
| E44 card and header (our framing); E44 two unnamed cell silhouettes with an abstract receptor symbol; COMMON MISTAKE panel; forms surface; prostaglandin secreting-cell → ligand → target-cell schematic; dashed *beyond the mark scheme* panel; local contrast card; S21/22 row cell outline | new card content; shared panel and surfaces | authored; panel from Topics 1–3 |
| Handling | not applicable | no apparatus or material is handled in this lesson |
| Micrographs, photographs, Cambridge artwork or figures | none | — |

---

## Plan interpretations

1. **`response-uptake`.** Use response-uptake, matching current SHARED-SPECS and the amended plan's named uptake response; treat the plan table's residual response-pulse label as stale. The liver cell's one soft glow in `SignallingScene` `respond` is the only pulse-like treatment, and it is labelled *responds (Topic 14)*.
2. **`wrong-ligand-fail` covers both mismatches.** SHARED-SPECS defines it as ligand B failing at the receptor; the plan's motion paragraph asks for insulin failing at a non-target cell's different receptor. I specified the state as "a mismatched ligand–receptor pair" with one motion contract and used it both ways (Beat 5: ligand B at the insulin receptor; Beats 6 and 8: insulin at the rounded-square receptor). Both show the attempt and the failure (VIDEO-STRUCTURE "animate the mechanism").
3. **`SignallingScene` layout.** SHARED-SPECS gives secreting cell, vessel, one target cell and a non-target cell; the plan adds tissue fluid and a second target cell type sharing the receptor. I combined them (plan wins): beta cell, capillary, tissue-fluid band, muscle cell, liver cell, unnamed non-target cell.
4. **The second target cell type is the liver cell**, chosen because syllabus 14.1.10 (p.38) names insulin's effects on muscle and liver cells; its response is not named, to stay inside the plan's "one named response" ceiling.
5. **The non-target cell is unnamed** (*a cell without a complementary receptor for insulin (schematic)*), because naming a real cell type as lacking insulin receptors would be an unsourced claim.
6. **Uptake through a separate glucose transport protein (round-1 check M1).** The plan says "show a labelled increase in uptake without drawing the intracellular pathway"; excluding the pathway does not require excluding the transporter taught in 4.1.3 and 4.2.1a. Keep the bilayer continuous around a separate teal glucose carrier, spatially distinct from the insulin receptor, labelled glucose transport protein. Reuse the carrier binding/change-of-shape/release motif; glucose never crosses an unlined gap, the receptor, or the hydrophobic core. A labelled before-binding miniature shows a lower illustrative uptake frequency; the after-binding view shows more carrier-mediated uptake events. Caption: increased glucose uptake; schematic, not measured; how insulin increases uptake is not shown. Do not animate carrier insertion or an intracellular signalling pathway. At whole-cell scale, preserve a small labelled protein route at the crossing position. The before-binding comparison is a labelled miniature, not an interval after insulin has bound.
7. **Handle limit.** The envelope handle implies one address; E44 and the plan check forbid "one ligand, one cell type". I kept the handle (the plan names it) and put its limit on screen in Beat 6 (*one receptor, several cell types*) so the analogy never contradicts the shared-receptor point.
8. **Beat structure.** Eight teaching beats: hook, objectives, three stage beats, response/specificity, recap, exam close; the creditworthy sentence is built in Beat 5 when the handle is converted, and the full three-stage outline is stated in the recap and highlighted in the exam close, rather than a separate "express" beat (which would make nine teaching beats against the plan's eight).
9. **Closing contrast (round-1 check M2).** The exam close puts the M24/22 prostaglandin answer first (release OR transport as one point; receptor binding as the second), shows the insulin scene only in a dashed panel labelled *beyond the mark scheme — our insulin illustration*, and closes on the genuine local reject *✗ receptor active site / ✓ receptor binding site* (W22/23 Q5(a)(i), MS p.17, `R active site`). The earlier struck-through insulin binding/response sentence is removed: it is incomplete as a three-stage outline, not false biology or a zero-mark answer.
10. **S21/22 Q3(c)** appears only as an on-screen, un-narrated adjacent row in the exam close (MF4: "Use it only as adjacent evidence for specificity"), with its verified reject line in small type and no steroid pathway.
11. **Short-range diffusion** (plan: "nearby cells may be reached by diffusion through tissue fluid") is included as one sentence and an unnamed inset labelled *not insulin*, so transport is not taught as blood-only.
12. **Citation status.** SHARED-SPECS §2 says to tag exam quotations PDF-UNCHECKED in general and to tag the plan-check strings **PDF-CHECKED (plan check)**. Both quoted exam lines here are plan-check strings, so they carry PDF-CHECKED (plan check), with a note that this author did not reopen the PDFs; paraphrased descriptions are marked as paraphrase. After the round-1 check's direct PDF extraction, the rows also carry *PDF-CHECKED (round-1 check)*, kept distinct from this author's register-only checking.
13. **Hook wording.** VIDEO-STRUCTURE's example hook ("when your blood carries it absolutely everywhere") and its framing ("a molecule released into the blood reaches every cell") are replaced by MF4's bounded wording ("carries it widely around your body"; "blood carries the signal widely around the body; it can then reach cells through tissue fluid").
14. **"Peptide hormone" and the trigger.** MF4 says "peptide-hormone example"; the narration uses "peptide hormone". The trigger ("After a meal, the glucose in your blood rises"; "When blood glucose rises") is one clause of context; feedback control is left to Topic 14.

---

## Validator run

`python3 work/006/validate_storyboard.py storyboards/topic-04/4.1.4/STORYBOARD.md`

```
== storyboards/topic-04/4.1.4/STORYBOARD.md
beat  words  cues maxgap  status
   1     83     8     14  ok
   2     55     4     16  ok
   3     88     9     16  ok
   4     77     9     12  ok
   5     96    15     14  ok
   6     89    12     10  ok
   7    142    17     14  ok
   8     73    10     14  ok
   9     98    12     14  ok
TOTAL words 801  cues 96  runtime at 120 wpm 6:40.5  beats 9  failing beats 0
```
