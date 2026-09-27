# 5.1.3 — The mitotic cell cycle: copy first, then share

**Storyboard, first draft. Cloud run 007, 27 September 2026.** No audio, no code, no render. Folder `storyboards/topic-05/5.1.3/`.
Cambridge 9700 syllabus 2025–2027, p.23. Command word **OUTLINE**. Budget from `TOPIC-PLAN-05-CELL-CYCLE.md` §5.1.3 and `TOPIC-05-WEIGHTS.md` (5.1.3 row and paragraph): **8:30 (about 1,020 words), 14 beats: 12 teaching/framing/recap + 2 error beats (E5-01 EXAM CONTRAST; E5-02 EXAM CONTRAST, built on an ignore line)**, teaching allowance 6:10 plus 2 × 1:10 error beats; delivered here as **14 beats (12 teaching + 2 error)**. 5.1.3 is the widest Topic 5 outcome in the fixed sample: 8 papers (4 Paper 1 + 4 Paper 2), 14 overlapping marks, 1–3 marks per item. Runtime estimated at **120 words per minute of final video**.

> **5.1.3** outline the mitotic cell cycle, including:
>
> - interphase (growth in G1 and G2 phases and DNA replication in S phase)
> - mitosis
> - cytokinesis

(syllabus p.23)

**Authorities read, in full:** `work/007/SHARED-SPECS.md` (binding: format, beat syntax, evidence and tag rules, counting convention with compartments, wording rules, shared model specs, error-beat rules); `plan/topic-05/TOPIC-PLAN-05-CELL-CYCLE.md` (whole plan; §5.1.3; lesson table; shared-models table; traps table; CHECK RESPONSE table, whose corrected wording is used); `plan/topic-05/TOPIC-05-WEIGHTS.md` (5.1.3 row and paragraph; ledger rows w20_21 Q1(a)(iii), w22_23 Q4(b), s23_21 Q4(b)(ii), s24_23 Q5(c)(i–ii); Paper 1 rows s21_12 Q18, s22_12 Q19, s23_12 Q21, s24_12 Q19; supplementary S-A m24_22 Q4(b), S-B w22_13 Q19/Q21, S-D Learner Guide; error register E5-01, E5-02); `work/007/VERIFIED-EVIDENCE.md` (A01, A05, A06, A07); `cloud-inputs/007/standards-update/VIDEO-STRUCTURE.md` (all of it: five-move error beats, truthful badge, anchored silence, motion rule, recap on the same diagram, exam close with one reject card, say the typical thing as typical, REAL-WORLD SAMPLES); the cleared storyboards `cloud-inputs/006/examples/3.1.3/STORYBOARD.md` and `3.2.1b/STORYBOARD.md`, and `TOPIC-03-PLAN-CHECK.md` (what checkers punish: local rulings generalised, unlabelled framings, universal claims); `cloud-inputs/003/standards/SYLLABUS-9700-DETAIL.md` (Topic 5, p.23); `cloud-inputs/007/evidence/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md` (G05) and `EXAMINER-INSIGHT-9700.md` §4. **No question paper, mark scheme or examiner report PDF was opened for this draft; none is available in this run.** Every quotation is copied from the permitted files named in *Citations*; everything else is our wording, labelled *our framing*, or listed as `UNVERIFIED`.

**Build position:** second of the eight Topic 5 lessons (5.1.1 → **5.1.3** → 5.1.4 → 5.2.1 → 5.2.2 → 5.1.2 → 5.1.5 → 5.1.6). **Models used:** `ChromosomeModel` (published by 5.1.1; states `unreplicated-extended`, `replicating`, `replicated-extended`, `replicated-condensed`, `separated`; zoom `Z0` and `Z1`; count overlay with compartment tag). **Models published here:** `CellCycleWheel`; `DNAContentGraph` (per-cell teaching trace, and the named variant `per-nucleus`). Everything drawn is a **MODEL**, labelled *schematic*; no photograph, micrograph or generated image appears.

---

## The causal spine

One idea carries the lesson: **a dividing cell copies its DNA first and shares it second, and the order is the cycle.**

> **The mitotic cell cycle is interphase (G1, S and G2), then mitosis, then cytokinesis. In G1 the cell grows, making proteins and organelles. In the S (synthesis) phase of interphase the DNA is replicated, so each chromosome becomes two sister chromatids joined at the centromere: still one chromosome, now two DNA molecules. In G2 the cell grows further and prepares for division. Mitosis is nuclear division: the chromosomes condense, the centromeres divide, the sister chromatids separate to opposite poles as daughter chromosomes, and two nuclei form, each with the same chromosomes as the parent nucleus. Cytokinesis is division of the cytoplasm, which usually follows mitosis and commonly begins while mitosis is finishing. DNA mass per cell holds at one level in G1, rises to double across the S phase, stays doubled through G2 and mitosis, and halves when cytokinesis divides the cell. Interphase is typically the longest part of the cycle.**

**What the mark schemes credit, quoted:** we hold no mark-scheme sentence for this outcome other than one ignore line. [w20_21 Q1(a)(iii), QP p2 / MS p6] “I ref. to replication or cytokinesis” — PDF-VERIFIED (plan check A07), in a 2-mark question on ATP's role in mitosis, any two credited points. Verified by the plan check as tariffs and demands, cited by demand and never quoted as Cambridge wording: s23_21 Q4(b)(ii) (QP p13 / MS p14) asks which stage **of interphase**, 1 mark for S / synthesis phase, a bare 'S' ignored (A05); m24_22 Q4(b) (QP p15 / MS p11), 1 mark requires circling **both** interphase and S phase (A06). G05's summary of both: *G05: "Locate replication in S phase of interphase"*, and of w20_21: *G05: "Keep the scope of the process named in the question."* (G05's inferences, not Cambridge's words). Paper 1 keys (PDF-VERIFIED keys, demands from the weights): s21_12 Q18 (C, 92/46/92 chromatid counts), s22_12 Q19 (D, DNA mass through S/G2), s23_12 Q21 (B, one copy in G1 versus two at the start of cytokinesis), s24_12 Q19 (D, cell-cycle phases); w22_13 Q19 and Q21 (supplementary; C and A: interphase photograph for replication; DNA doubling and growth in interphase). The command word: the Learner Guide's verbatim guidance for **outline** is “Detail is not required.” (PDF p15, PDF-VERIFIED, A01) — guidance for the exam answer, not a cap on how fully we explain and not permission to omit essential steps. So the spine is what is credited: replication located in the S (synthesis) phase **of interphase**, named in full; the DNA-mass pattern through S and G2; chromatid and chromosome counts that keep one replicated chromosome as one; and mitosis kept to nuclear division.

**The handle:** *a copy-then-share routine*. Converted at once, in Beat 9, into the plan's sentence: **Written properly: DNA is replicated during the S phase of interphase; mitosis then separates the copies into two nuclei; cytokinesis divides the cytoplasm.** The handle is never the exam answer.

**Typicality rules applied.** 'Interphase is typically the longest part of the cycle'; the wheel's arc lengths are labelled *schematic proportions*. 'Each new cell **can** go round again' (not every cell keeps dividing; that point is 5.1.2's). Cytokinesis 'usually follows mitosis, and commonly starts while mitosis is finishing' — never 'cannot overlap'. Replication is shown as schematic progress across S with the note *slope schematic — not a constant replication rate*; the final change marks completion. The human figures are 'a typical diploid human body cell' (on screen *typical diploid human somatic cell*). Copies are 'copies of each other' and daughter cells are 'normally' genetically identical (copying errors are 5.1.6's route in). 'During part of mitosis there is no intact nucleus' (open mitosis; typical of the cells taught here). The skin in the hook is an example of dividing cells, not a claim that every skin cell divides. The two ignore/verified rulings stay local to their questions: the bare 'S' ruling is s23_21's, the two-circle requirement is m24_22's, and the ignore line is w20_21 Q1(a)(iii)'s ('for this two-mark question'). No sentence claims how often candidates make either error.

**Two error beats, five moves each** (announce with the marker on → written card, *our composite; not a transcript* → 4 s silent read → talk-through with cue-synced rings → correct in place, marker clearing only on the completed correct frame):
- **E5-01 in Beat 10**, badge **EXAM CONTRAST** (basis: s23_21 Q4(b)(ii) and m24_22 Q4(b), 1 mark each, PDF-VERIFIED summaries A05/A06; a real question; no examiner report on how often). One proposition, two offending words ringed (*prophase*, *appear*).
- **E5-02 in Beat 12**, badge **EXAM CONTRAST** (basis: w20_21 Q1(a)(iii), the scheme's ignore line “I ref. to replication or cytokinesis”, PDF-VERIFIED A07; a real question; no examiner report on how often). Two faults (two ignored points); the marker clears only when both are replaced and the card reads the plan's completed answer, **ATP supplies energy for spindle formation and for movement of daughter chromosomes to opposite poles.**

The closing reject card (Beat 14) is a separate, authored card captioned *our wording contrast; not an examiner-reported error*.

---

## The models, specified once

Colour tokens are SHARED-SPECS §5's: chromosome **C1 long = deep blue** (the only chromosome drawn in the wheel inset; the count strip's model cell is the 2n = 4 set C1 deep blue, C2 teal, C3 amber, C4 green); telomeres **grey** blocks; gene bands **white with a thin dark outline**; histone proteins **pale yellow beads**; centromere a constriction with a small dark dot; nucleolus a darker grey disc (drawn only in the hook's schematic nucleus); **terracotta reserved for the error marker**; highlights and rings in the house accent.

### `ChromosomeModel` (published by 5.1.1; reused by state id)

Used exactly as 5.1.1 publishes it. States: `unreplicated-extended` (G1), `replicating` (S only: schematic progress along the molecule, a second copy growing alongside the first, gene bands appearing on the copy as it passes them; no bases, no enzymes, no bond edits), `replicated-extended` (end of S and G2), `replicated-condensed` (early M), `separated` (after the centromere divides: two **daughter chromosomes**, each one chromatid with its own centromere; relabelled *daughter chromosome* on the same rendered frame; DNA-molecule count unchanged; they then MOVE apart, centromere leading, arms trailing), then each daughter chromosome decondenses (continuous coiling MOTION, reversed) as the new nucleus forms. Zoom `Z0` throughout; `Z1` once in Beat 4 (DNA wound round **histone proteins**, label *histone proteins*; no 'nucleosome'). Labels (SVG text nodes): *DNA*, *histone proteins*, *sister chromatids*, *centromere*, *telomere*, *gene*, *chromosome*, *daughter chromosome*. Replication caption on screen whenever `replicating` is shown: *schematic account of replication during S; detailed replication in 6.1.4*.

**Count overlay** (5.1.1's three counters) sits as a **count strip** beside the wheel for the topic's model cell (2n = 4): *chromosomes (count centromeres)* · *DNA molecules* · compartment tag (*whole cell* / *one pole* / *one nucleus* / *one daughter cell*). A second, smaller line beneath reads *typical diploid human somatic cell* with the same compartment. Values per SHARED-SPECS §4 (see *Datasets*, Dataset 2). The strip updates by rolling the digits (motion) at the frame the narration names the change.

### `CellCycleWheel` (published here)

A ring, clockwise from 12 o'clock: **G1** (widest arc), **S**, **G2**, **M** (mitosis), **C** (cytokinesis). A bracket outside the ring spans G1–S–G2, labelled **interphase**. Caption, always on when the wheel is: *schematic proportions — interphase is typically the longest part*. Arc labels (SVG text nodes): **G1 — growth**, **S — DNA replication (synthesis)**, **G2 — growth, preparation for division**, **M — mitosis: nuclear division**, **C — cytokinesis: division of the cytoplasm**; each arc's long label is revealed at its narration cue and afterwards stays as the short label. No G0 arc, no checkpoint marks, no proteins.

A **travelling marker** (a small accent dot on the ring) moves clockwise at constant screen speed within each arc; its position drives the `DNAContentGraph` pen (below), so the trace is drawn as the marker travels. Marker positions used as cue targets: `g1`, `s-start`, `s-end`, `g2`, `m`, `c`, and `g1-next`.

A **`ChromosomeModel` inset** (one C1 chromosome, in a round inset window inside the ring, framed by a pale outline of a schematic nucleus during interphase):
- **G1:** `unreplicated-extended`, a long thin thread inside the nucleus outline.
- **S:** `replicating`, progress synchronised to the marker's position across the S arc and to the rising trace; at `s-end` the state completes to `replicated-extended` (the completion frame, not an instantaneous duplication).
- **G2:** `replicated-extended`.
- **M** (the inset's nucleus outline fades as the marker enters M; four sub-states, no sub-stage names shown except where Beat 10 names prophase): `m-condense` (continuous coiling motion to `replicated-condensed`); `m-align` (**inset spindle elements**, added by this lesson as part of the wheel's inset: two small pole marks, left and right, with thin straight spindle-fibre lines growing from each pole mark (motion) to the centromere, which settles on a faint dashed vertical *equator* line; no centrioles drawn, no cell outline other than the inset window); `m-separate` (the centromere divides in one rendered frame, relabel *daughter chromosome* ×2 on that frame, then the fibres shorten and each daughter chromosome moves to its pole, centromere leading); `m-decondense` (a nucleus outline draws round each pole group (motion) as each daughter chromosome decondenses).
- **C:** a schematic cell outline, already enclosing both new nuclei, pinches in at the equator (motion) until two cells separate; caption *schematic; how plant and animal cells divide the cytoplasm: 5.2.1*. **Separation never first occurs in the C arc**: both nuclei exist before the marker enters C.
- **g1-next:** each daughter cell's inset shows one `unreplicated-extended` C1 thread; one daughter cell's inset carries on round the ring (the other fades aside, tag *each daughter cell can go round again*).

### `DNAContentGraph` (published here)

The **per-cell graph is the teaching trace.** y-axis: **DNA mass per cell / arbitrary units**, ticks **0, 1, 2** only; x-axis: **time** (no values). Phase bands shaded beneath the trace, labelled **G1 · S · G2 · M · C**, aligned to the wheel's labels and colours. The trace (house accent) is drawn by a pen linked to the wheel marker: **G1 flat at 1**; **S a straight rise from 1 to 2**, with the note *slope schematic — not a constant replication rate*; **G2 and M flat at 2**; **a vertical drop to 1** when cytokinesis divides the cell (at the frame the C-arc inset's two cells separate); after the drop the trace continues at 1 into a second G1 band (one daughter cell followed). Caption, always on: *schematic; not measured data*. A small key: *1 unit = the G1 amount of DNA in one cell (schematic)*.

Named variant **`per-nucleus`** (Beat 11): drawn on the same time axis as a second panel beneath; y-axis **DNA mass per nucleus / per chromosome set**, ticks 0, 1, 2; G1 at 1, S rising to 2, G2 at 2; the open-mitosis interval (from the inset's nucleus outline fading to the two new outlines forming) **hatched**, labelled *schematic — no intact nucleus*, no trace drawn through it; the trace resumes at **1** from the frame the two new nuclei form (inside the M band, before the C band). Caption *schematic; not measured data*.

### Other surfaces

- **Hook scene** (Beat 1, new, schematic): a strip of skin's deepest layer (a row of cuboidal cells on a wavy base line, flatter cells above, the surface at the top); one cell in the bottom row has a schematic nucleus (outline, grey nucleolus disc; no chromosomes drawn). Caption *schematic; not to scale*. No photograph and no generated image.
- **Objectives surface** (Beat 2): own branded background colour and brand typography, lines entering with motion, each beside a flat line pictogram (not the lesson's models): a **circular-arrow loop** icon; a **copy** icon (two overlapping rectangles); a **scissors-and-circle** icon (a circle with a dividing line).
- **EXAM CONTRAST panel** (Beats 10, 12): the shared error panel (Topics 1–3) with the label prop **EXAM CONTRAST**, terracotta border and desaturated surround, basis line in small type, card in handwriting style, persistent until the completed correct frame.
- **Forms surface and reject card** (Beat 14): shared.

---

## Beat by beat

Beat windows in the headings follow the per-beat ledger (words ÷ 120; each error beat's 4 s silent read sits inside the effective rate and is not added again); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch over 30 words without a stated visual change.

### BEAT 1 · Hook and context · 0:00–0:36
**Narration:**
> Ever wondered how one of your cells can split into two, without either new cell ending up with half the instructions? Cells in the deepest layer of your skin divide again and again, replacing cells lost from the surface, and each new cell needs a full copy of the genetic information. So a dividing cell works in order: copy everything, share it out, then split. That repeated routine is the mitotic cell cycle.

**Visual action:**
1. **From the first frame**, the hook scene is on screen (skin's deepest layer, one bottom-row cell with its schematic nucleus; caption *schematic; not to scale*); at *can split into two*, that cell grows slightly and pinches in at its middle (motion) into two cells, each with a nucleus; the hook question sits as a compact caption above the strip, never alone on the frame.
2. At *half the instructions*, a small tag hovers over the two new cells: **full copy in each?**
3. At *deepest layer of your skin*, the label **deepest layer of the skin** appears on the bottom row; at *replacing cells lost from the surface*, the cells above shuffle upward one place (motion) and the flattest cell at the top detaches and drifts off (motion).
4. At *a full copy of the genetic information*, both new nuclei glow in the house accent, tag **same genetic information**.
5. At *copy everything*, a small three-step strip builds beside the scene, one icon per step: two overlapping rectangles (**copy**); at *share it out*, an arrow splitting into two (**share**); at *then split*, a circle dividing into two circles (**split**).
6. At *the mitotic cell cycle*, the three icons bend into a closed loop (motion) and the title **the mitotic cell cycle** lands inside it; dissolve to the objectives surface.

**On-screen text:** the hook question; *deepest layer of the skin*; *same genetic information*; *copy · share · split*; *the mitotic cell cycle*. Small type: *syllabus p.23: body cells divide; nuclear division first, then division of the cytoplasm (our paraphrase of the topic introduction)*.

---

### BEAT 2 · What you will be able to do · 0:36–1:02
**Narration:**
> By the end you will be able to outline the cycle: interphase with its G one, S and G two phases, then mitosis and cytokinesis; to place DNA replication in the S phase of interphase and read it on a graph; and to keep mitosis and cytokinesis apart in an answer.

**Visual action:** Own styled surface, distinct background colour and brand typography, **not the lesson diagram**; each line enters with motion beside its pictogram (flat line icons, not the lesson's models), so no frame is text alone.
1. At *outline the cycle*, line 1 enters with the **circular-arrow loop** pictogram; at *then mitosis and cytokinesis*, the loop icon turns once (motion).
2. At *place DNA replication*, line 2 enters with the **copy** pictogram; at *read it on a graph*, a tiny generic step-line icon (no labels, no values) joins the copy icon.
3. At *keep mitosis and cytokinesis apart*, line 3 enters with the **scissors-and-circle** pictogram.

Lines:
1. **OUTLINE** the cycle: interphase (G1, S, G2), mitosis, cytokinesis
2. **PLACE** DNA replication in the S (synthesis) phase of interphase, on the loop and on a graph
3. **KEEP APART** mitosis (nuclear division) and cytokinesis (division of the cytoplasm)

Small type: *syllabus 5.1.3, "outline", p.23.*

---

### BEAT 3 · The loop · 1:02–1:31
**Narration:**
> Here is the routine as a loop, read clockwise from the top. Interphase comes first, in three phases: G one, S and G two. Then mitosis, division of the nucleus, and cytokinesis, division of the cytoplasm; each new cell can then go round again. The arcs are schematic, but interphase is typically the longest part of the cycle.

**Visual action:**
1. At *Here is the routine as a loop*, the `CellCycleWheel` ring draws clockwise from 12 o'clock (one sweep, about 1 s), empty of labels, the travelling marker resting at the top.
2. At *Interphase comes first*, the bracket **interphase** draws round the first three arcs; at *G one, S and G two*, the three arc labels land in turn, **G1**, **S**, **G2**.
3. At *division of the nucleus*, the **M** arc brightens with its long label **M — mitosis: nuclear division**; at *division of the cytoplasm*, the **C** arc brightens with **C — cytokinesis: division of the cytoplasm**.
4. At *go round again*, the marker makes one quick lap of the ring (motion) and returns to the top.
5. At *The arcs are schematic*, the caption *schematic proportions — interphase is typically the longest part* appears; at *typically the longest part*, the interphase bracket pulses once.

**On-screen text:** arc labels; *interphase*; the proportions caption.

---

### BEAT 4 · G1: growth, one DNA molecule · 1:31–2:02
**Narration:**
> Follow one chromosome, the blue one. In G one the cell grows, making proteins and organelles. The chromosome is there throughout interphase, but long, thin and spread out, too fine to pick out under a light microscope. Right now it is one DNA molecule wound around histone proteins, and on the graph the DNA mass per cell holds steady at one unit.

**Visual action:**
1. At *Follow one chromosome*, the inset window opens inside the ring showing the pale nucleus outline and the C1 chromosome in `unreplicated-extended`, labelled **chromosome**, tag *recall: 5.1.1*.
2. At *the cell grows*, the marker moves into the **G1** arc and its long label **G1 — growth** lands; at *making proteins and organelles*, the inset's nucleus outline widens slightly within a faint cell outline that grows (motion), side tag **proteins · organelles**.
3. At *long, thin and spread out*, the thread in the inset ripples along its length (the thread is already there; nothing forms); at *too fine to pick out*, a small light-microscope silhouette icon beside the inset shows its field of view blurred, tag *not individually visible*.
4. At *one DNA molecule wound around histone proteins*, a `Z1` magnifier opens on the thread: DNA wound round pale-yellow beads, labels **DNA** and **histone proteins**, then closes.
5. At *on the graph*, the `DNAContentGraph` panel slides in to the right of the wheel with its axes, phase bands and caption *schematic; not measured data*; at *holds steady at one unit*, the pen, linked to the marker, draws the flat G1 trace at **1**. The count strip appears: **whole cell: 4 chromosomes · 4 DNA molecules** (small line: *typical diploid human somatic cell: 46 · 46*).

**On-screen text:** *G1 — growth*; *chromosome*; *DNA*; *histone proteins*; *not individually visible*; axis labels; the count strip.

---

### BEAT 5 · S phase: replication, drawn as it happens · 2:02–2:42
**Narration:**
> Next, S, the synthesis phase, where the DNA is replicated. As copying proceeds, the DNA mass per cell rises. It is drawn as a slope because replication takes time; the straight line is schematic. By the end of the S phase the chromosome is two sister chromatids, copies of each other, joined at the centromere: still one chromosome, two DNA molecules. Our model cell now has four chromosomes and eight DNA molecules; a typical diploid human body cell, forty-six and ninety-two.

**Visual action:**
1. At *the synthesis phase*, the marker enters the **S** arc, its long label **S — DNA replication (synthesis)** lands, and the caption *schematic account of replication during S; detailed replication in 6.1.4* appears under the inset.
2. At *As copying proceeds*, the inset enters `replicating`: a second copy grows alongside the thread, its progress keyed to the marker's position in the S arc (motion); at *the DNA mass per cell rises*, the graph pen draws the rise from 1 in step with the same progress, one continuous motion.
3. At *drawn as a slope because replication takes time*, the rising segment is highlighted; at *the straight line is schematic*, the note *slope schematic — not a constant replication rate* attaches to it.
4. At *By the end of the S phase*, the marker reaches `s-end`, the trace reaches **2**, and the inset completes to `replicated-extended` on that frame; at *two sister chromatids*, labels **sister chromatids** land on both threads, with the two gene bands on each ringed briefly (same positions on both); at *joined at the centromere*, the constriction pulses, label **centromere**.
5. At *still one chromosome, two DNA molecules*, a single bracket labelled **one chromosome** encloses both chromatids, and a small counter under the inset rolls **DNA molecules: 1 → 2**.
6. At *Our model cell now has*, the count strip rolls to **whole cell: 4 chromosomes (8 sister chromatids) · 8 DNA molecules**; at *a typical diploid human body cell*, its small line rolls to **46 chromosomes (92 chromatids) · 92 DNA molecules**.

**On-screen text:** *S — DNA replication (synthesis)*; the replication caption; the slope note; *sister chromatids*; *centromere*; *one chromosome*; counters.

---

### BEAT 6 · G2: replicated, still long and thin · 2:42–3:08
**Narration:**
> G two brings more growth and preparation for division; the graph stays at two units. Notice what has not happened yet. The chromosomes are replicated but still long and thin. They become visible as separate chromosomes later, when they condense at the start of mitosis. Keep that order in mind.

**Visual action:**
1. At *G two brings more growth*, the marker moves through the **G2** arc and its long label **G2 — growth, preparation for division** lands; the faint cell outline grows a little more (motion); at *the graph stays at two units*, the pen draws the flat G2 trace at **2**.
2. At *what has not happened yet*, the inset holds `replicated-extended`; at *still long and thin*, the two threads ripple along their length, and the microscope icon's field stays blurred, tag *replicated, not yet visible*.
3. At *They become visible as separate chromosomes later*, a small preview arrow runs from the G2 arc to the start of the M arc, tag **condense here (5.2.1 names the stages)**; at *Keep that order in mind*, the S arc and the G2 arc glow in sequence, then the M arc, reading left to right as a three-step order tag **copied (S) → still thin (G2) → condenses (M)**.

**On-screen text:** *G2 — growth, preparation for division*; *replicated, not yet visible*; the order tag.

---

### BEAT 7 · Mitosis: one nucleus becomes two · 3:08–3:46
**Narration:**
> Now mitosis, the division of the nucleus. The chromosome condenses, getting shorter and thicker. Spindle fibres attach at its centromere, and it lines up at the equator. Then the centromere divides and the sister chromatids separate to opposite poles; from here each is a daughter chromosome. At each pole they decondense as a new nucleus forms: eight daughter chromosomes in the whole model cell, four in each new nucleus. The DNA per cell stays at two units.

**Visual action:**
1. At *Now mitosis*, the marker enters the **M** arc; the inset's nucleus outline fades (motion); at *The chromosome condenses*, the inset coils continuously from `replicated-extended` to `replicated-condensed` (motion), the X shape shortening and thickening.
2. At *Spindle fibres attach*, the two pole marks appear and thin spindle-fibre lines grow from each (motion) to the centromere, label **spindle fibres**; at *lines up at the equator*, the chromosome slides onto the faint dashed line, label **equator**.
3. At *the centromere divides*, on one rendered frame the inset switches to `separated`; both units are relabelled **daughter chromosome** on that frame; at *separate to opposite poles*, the fibres shorten and the two daughter chromosomes move apart, centromere leading, arms trailing, to the pole marks, labels **pole** ×2. The small DNA-molecule counter under the inset holds at **2** (now *1 per daughter chromosome*).
4. At *At each pole they decondense*, each daughter chromosome uncoils (motion) and a nucleus outline draws round each pole group (motion), labels **new nucleus** ×2; spindle lines fade.
5. At *eight daughter chromosomes in the whole model cell*, the count strip rolls to **whole cell: 8 chromosomes · 8 DNA molecules**; at *four in each new nucleus*, a second row lands, **each new nucleus: 4 chromosomes · 4 DNA molecules** (small line: *typical diploid human somatic cell: whole cell 92 · 92; each new nucleus 46 · 46*).
6. At *stays at two units*, the pen draws the flat M trace at **2**, tag **nothing has left the cell yet**.

**On-screen text:** *M — mitosis: nuclear division*; *spindle fibres*; *equator*; *daughter chromosome*; *pole*; *new nucleus*; the count strip rows.

---

### BEAT 8 · Cytokinesis: the cytoplasm divides, the graph drops · 3:46–4:20
**Narration:**
> Then cytokinesis, the division of the cytoplasm. It usually follows mitosis, and commonly starts while mitosis is finishing. The cytoplasm divides around the two nuclei already formed, giving two daughter cells. Only now does this per-cell graph drop, from two units to one: each daughter cell holds half the doubled DNA, four chromosomes and four DNA molecules in the model, forty-six and forty-six in the human case.

**Visual action:**
1. At *Then cytokinesis*, the marker enters the **C** arc and its long label lands; the inset's schematic cell outline, already enclosing both new nuclei, is shown with the caption *schematic; how plant and animal cells divide the cytoplasm: 5.2.1*.
2. At *usually follows mitosis*, the M and C arcs glow in order; at *commonly starts while mitosis is finishing*, a short overlap band appears across the M/C boundary on the graph's phase bands, tag *typical order; they can overlap*.
3. At *The cytoplasm divides around the two nuclei*, the outline pinches in at the equator (motion); at *giving two daughter cells*, the two cells separate, labels **daughter cell** ×2.
4. At *Only now does this per-cell graph drop*, on the frame the two cells separate, the pen draws the vertical drop **2 → 1**; at *half the doubled DNA*, a small bracket beside the drop reads **2 units ÷ 2 cells = 1 unit each**.
5. At *four chromosomes and four DNA molecules in the model*, the count strip clears its rows and rolls to **each daughter cell: 4 chromosomes · 4 DNA molecules**; at *forty-six and forty-six*, its small line rolls to **46 · 46**.
6. **Exit cue: end of *in the human case*.** The marker passes 12 o'clock into `g1-next`; one daughter cell's inset (one `unreplicated-extended` C1 thread) carries on round the ring while the other fades aside, tag *each daughter cell can go round again*; the pen continues at **1** into a second G1 band.

**On-screen text:** *C — cytokinesis: division of the cytoplasm*; *typical order; they can overlap*; *daughter cell*; the drop bracket; the count strip.

---

### BEAT 9 · The handle, and the sentence you write · 4:20–4:46
**Narration:**
> Think of it as a copy-then-share routine. Written properly: DNA is replicated during the S phase of interphase; mitosis then separates the copies into two nuclei; cytokinesis divides the cytoplasm. Copying before sharing normally keeps daughter cells genetically identical to the parent; that is why the loop exists, for growth and replacement.

**Visual action:**
1. At *a copy-then-share routine*, the Beat 1 **copy · share · split** icons return small above the wheel, sitting over the S, M and C arcs respectively, tag *the handle: not an exam answer*.
2. At *Written properly*, a sentence surface opens beneath the wheel and graph (both stay on screen); at *DNA is replicated during the S phase of interphase*, clause 1 writes, and the S arc and the graph's rise glow; at *mitosis then separates the copies into two nuclei*, clause 2 writes and the M arc glows, the inset replaying the separation in miniature (motion); at *cytokinesis divides the cytoplasm*, clause 3 writes, the C arc glows and the graph's drop pulses.
3. At *genetically identical to the parent*, the two gene bands on each sister chromatid (miniature replay) are ringed in pairs, tag *same bands on both copies*.
4. At *why the loop exists*, the hook scene returns small at the corner, its dividing cell pinching (motion), tag **growth · replacement**.

**On-screen text:** the handle icons and tag; the three-clause sentence; *same bands on both copies*; *growth · replacement*.

---

### BEAT 10 · EXAM CONTRAST E5-01: seen is not copied · 4:46–5:58
**Narration:**
> Here is an answer that would lose the mark, on the card. Our framing: in which stage of the cycle is DNA replicated? Read this answer.
>
> *(silent read, 4 s)*
>
> Look at the word prophase here, and the word appear. It is a tempting answer, because prophase, the first stage of mitosis, is when you first see a replicated chromosome as two sister chromatids. But seeing is not copying. On the graph, the DNA mass per cell had already doubled across the S phase, before mitosis began. In prophase the chromosomes condense, becoming short and thick enough to see; they were copied earlier, while long and thin. The question asks where replication happens. And name that phase in full: in one paper a bare letter S was ignored, and another needed both interphase and S phase.
>
> *(correction)*
>
> So, in place: DNA is replicated during the S, or synthesis, phase of interphase.

**Visual action:**
1. **Entry cue: *Here is an answer that would lose the mark*.** The EXAM CONTRAST panel enters (badge **EXAM CONTRAST**, terracotta border, desaturated surround), basis line in small type: *basis: a real question; no examiner report on how often. s23_21 Q4(b)(ii), QP p13 / MS p14, and m24_22 Q4(b), QP p15 / MS p11; PDF-VERIFIED summaries (plan check A05, A06)*. It **stays on until the completed correct frame**. The wheel and graph hold at left, dimmed.
2. At *Our framing*, the header lands: **In which stage of the cell cycle is DNA replicated?** with small type *our framing of the demand in s23_21 Q4(b)(ii) and m24_22 Q4(b); UNVERIFIED — the questions' wording*.
3. At *Read this answer*, the written wrong answer appears in handwriting style: **✗ DNA is replicated in prophase, when the chromosomes appear.** Small type *our composite; not a transcript*.
4. **Silent read, 4 s.** Panel and card held; nothing else moves.
5. At *Look at the word prophase here*, the word *prophase* on the card is ringed in terracotta; at *the word appear*, the word *appear* is ringed.
6. At *when you first see a replicated chromosome*, the dimmed wheel's M inset replays `m-condense` small beside the card (the X shape coiling into view, motion), side-note *first SEEN here*.
7. At *seeing is not copying*, a side-note splits the two ideas apart on screen: **seen (condenses): mitosis** | **copied (replicated): S phase**.
8. At *On the graph*, the dimmed graph brightens; at *already doubled across the S phase*, the S rise is traced by a moving accent dot from 1 to 2, and the M band is shown already flat at 2.
9. At *In prophase the chromosomes condense*, the side-note's *seen* half pulses; at *copied earlier, while long and thin*, the G2 inset (`replicated-extended`, two long thin threads) appears small under the *copied* half.
10. At *The question asks where replication happens*, the header's word *replicated* is underlined in the house accent.
11. At *name that phase in full*, two citation tabs land: **s23_21 Q4(b)(ii): which stage of interphase; 1 mark for S / synthesis phase; a bare 'S' ignored** and **m24_22 Q4(b): 1 mark requires circling both interphase and S phase**, each tagged *PDF-VERIFIED summary; not the scheme's wording*; at *a bare letter S was ignored*, the first tab's last clause is underlined; at *both interphase and S phase*, the second tab's clause is underlined. Small type: *G05: "Locate replication in S phase of interphase"* (G05's summary).
12. At *So, in place*, the ringed words are struck by hand and the card rewrites in place; at *during the S, or synthesis, phase of interphase*, the last words land and the card reads **✓ DNA is replicated during the S (synthesis) phase of interphase.**; on the wheel the S arc lights and on the graph the S rise lights; **the marker clears on this completed frame**. **Exit cue: end of *phase of interphase*.** Treatment lifts; the corrected card holds beside the wheel.

**On-screen text:** the panel and basis line; the header and its label; the card; *first SEEN here*; the seen/copied split; the two tabs; the G05 small type; the corrected card.

---

### BEAT 11 · Read the axis label first · 5:58–6:28
**Narration:**
> One more thing: read the axis label first. Ours plots DNA mass per cell. Some graphs plot DNA per nucleus instead, and then the drop comes earlier, when the two new nuclei form, not when the cell divides. During part of mitosis there is no intact nucleus to measure, so on that version the stretch is hatched as schematic.

**Visual action:**
1. At *read the axis label first*, the per-cell graph's y-axis label **DNA mass per cell / arbitrary units** is ringed in the house accent; at *Ours plots DNA mass per cell*, the word *cell* in the label pulses.
2. At *Some graphs plot DNA per nucleus instead*, the `per-nucleus` panel slides in beneath on the same time axis, y-axis **DNA mass per nucleus / per chromosome set**; its trace draws G1 at 1, the S rise, G2 at 2 (motion), in step with a quick marker replay on the wheel.
3. At *the drop comes earlier*, the wheel's M inset replays `m-decondense` (two new nucleus outlines drawing, motion); at *when the two new nuclei form*, on that frame the `per-nucleus` trace resumes at **1** inside the M band, and a vertical guide runs up to the per-cell graph; at *not when the cell divides*, the per-cell drop in the C band is ringed, and both drops are joined by a double-headed arrow, tag **same cell, different axis**.
4. At *no intact nucleus to measure*, the wheel's M inset replays its nucleus outline fading (motion); the `per-nucleus` panel's open-mitosis interval hatches in, label *schematic — no intact nucleus*; at *hatched as schematic*, the hatch pulses once; no trace is drawn through it.

**On-screen text:** both axis labels; *same cell, different axis*; *schematic — no intact nucleus*; both captions *schematic; not measured data*.

---

### BEAT 12 · EXAM CONTRAST E5-02: an ignore line, and what to write instead · 6:28–7:42
**Narration:**
> Here is an answer that would lose the marks, on the card. Our framing: describe the role of ATP in mitosis. Read this answer.
>
> *(silent read, 4 s)*
>
> Look at the words DNA replication here, and cytokinesis here. It is easy to see why they get written: both processes use energy, and both belong to the cycle you have just followed round the wheel. But the question asks about mitosis, the division of the nucleus, and on the wheel those two sit outside the M arc: replication in the S phase, cytokinesis in the C arc. For this two-mark question the mark scheme says to ignore references to replication or cytokinesis. That is not a claim that ATP goes unused there; it means neither point on this card gains credit. So answer inside the M arc.
>
> *(correction)*
>
> In place: ATP supplies energy for spindle formation and for movement of daughter chromosomes to opposite poles.

**Visual action:**
1. **Entry cue: *Here is an answer that would lose the marks*.** The EXAM CONTRAST panel enters (badge **EXAM CONTRAST**, terracotta border, desaturated surround), basis line in small type: *basis: a real question; no examiner report on how often; the scheme's ignore line. w20_21 Q1(a)(iii), QP p2 / MS p6; 2 marks, any two credited points*. It **stays on until the completed correct frame**. The wheel holds at left, dimmed, its M inset visible.
2. At *Our framing*, the header lands: **Describe the role of ATP in mitosis.** with small type *our framing of w20_21 Q1(a)(iii); UNVERIFIED — the question's wording*.
3. At *Read this answer*, the written wrong answer appears in handwriting style: **✗ ATP supplies energy for DNA replication and for cytokinesis.** Small type *our composite; not a transcript*.
4. **Silent read, 4 s.** Panel and card held; nothing else moves.
5. At *Look at the words DNA replication here*, the words *DNA replication* on the card are ringed in terracotta; at *and cytokinesis here*, the word *cytokinesis* is ringed.
6. At *both processes use energy*, side-note *both use energy; both are in the cycle*; at *the cycle you have just followed*, the dimmed wheel brightens.
7. At *the question asks about mitosis*, the header's word *mitosis* is underlined and the wheel's M arc is outlined in the house accent, tag **the question's scope: M**; at *replication in the S phase*, the S arc is tinted grey with tag *outside M*; at *cytokinesis in the C arc*, the C arc is tinted grey with tag *outside M*.
8. At *For this two-mark question*, citation tab, exact: **w20_21 Q1(a)(iii), MS p6: “I ref. to replication or cytokinesis”** · *PDF-VERIFIED (plan check A07)*; at *ignore references to replication or cytokinesis*, the tab's line is underlined.
9. At *That is not a claim that ATP goes unused there*, a boundary tab beneath the citation in the normal accent: **ignore line: local to this question; it does not say ATP is unused in replication or cytokinesis**; at *neither point on this card gains credit*, both ringed phrases on the card pulse, side-note *0 credited points here*. The marker stays on.
10. At *So answer inside the M arc*, the M arc's outline pulses and the M inset enlarges beside the card, showing `m-align` without fibres yet.
11. At *In place*, the first ringed phrase is struck and rewritten in place, **spindle formation**; at *spindle formation*, the inset's spindle-fibre lines grow from the pole marks to the centromere (motion). The marker stays on: one fault is left.
12. At *movement of daughter chromosomes to opposite poles*, the second ringed phrase is struck and rewritten in place; the inset's centromere divides on one frame (relabel **daughter chromosome** ×2) and the two daughter chromosomes move to the poles, centromere leading (motion). The card reads **✓ ATP supplies energy for spindle formation and for movement of daughter chromosomes to opposite poles.**; **the marker clears on this completed frame**. Small type under the card: *the completed answer used by this lesson (plan check); UNVERIFIED — the full MS list of credited points verbatim*. **Exit cue: end of *to opposite poles*.** Treatment lifts; the corrected card and the boundary tab hold beside the wheel.

**On-screen text:** the panel and basis line; the header and its label; the card; the side-notes; the scope tags; the citation and boundary tabs; the corrected card and its small type.

---

### BEAT 13 · What I told you, on the wheel and the graph · 7:42–8:12
**Narration:**
> Here it is, on the wheel and graph you built. G one: growth, one unit of DNA per cell. The S phase of interphase: replication, the trace rising to two, each chromosome now two sister chromatids. G two: more growth, still two. Mitosis: one nucleus becomes two. Cytokinesis: the cytoplasm divides, and each daughter cell is back to one unit.

**Visual action:** **No new slide.** The screen returns to the layout built through the lesson: `CellCycleWheel` at left with the interphase bracket, all five labels and the proportions caption; the per-cell `DNAContentGraph` at right with its full trace (flat, rise, flat, drop, second flat) and phase bands; the count strip beneath the wheel. Static. Key points fade in in place:
1. At *on the wheel and graph you built*, the whole layout settles; nothing moves.
2. At *G one: growth*, the G1 arc and the G1 band brighten, tag *growth* on the arc; at *one unit of DNA per cell*, the flat trace at 1 brightens.
3. At *The S phase of interphase*, the S arc brightens with **DNA replication, S (synthesis) phase of interphase**; at *the trace rising to two*, the rise brightens; at *each chromosome now two sister chromatids*, a still of the `replicated-extended` inset appears on the S arc, tag *one chromosome, two DNA molecules*.
4. At *G two: more growth*, the G2 arc and flat trace at 2 brighten.
5. At *one nucleus becomes two*, the M arc brightens with a still of the two new nuclei, tag **nuclear division**.
6. At *the cytoplasm divides*, the C arc brightens with a still of two daughter cells, tag **division of the cytoplasm**; at *back to one unit*, the drop to 1 brightens and the count strip's **each daughter cell: 4 · 4** brightens.

---

### BEAT 14 · How it is asked, and the reject card · 8:12–8:51
**Narration:**
> How this reaches you. Short written questions have asked which stage of interphase replication happens in, crediting the S phase or synthesis phase; one asked you to circle both interphase and S phase. Multiple-choice items track DNA mass or chromatid numbers round the cycle, and one question asked for the role of ATP in mitosis. The reject card keeps mitosis in its place. And the hook? One cell becomes two with nothing halved: it copies first, then shares.

**Visual action:**
1. At *How this reaches you*, a compact forms surface enters at left, one row per form, **beside the familiar wheel and per-cell graph, which stay on screen from the beat's first frame** at right (reduced). Row 5 is revealed with the surface at this cue (not narrated): **apply supplied information to the S phase, G2 and chromatid state** · *s24_23 Q5(c)(i–ii), 2 + 2 marks (QP p13 / MS pp9–10); UNVERIFIED — MS points verbatim*, with the G2 arc glowing briefly beside it. Small type at the foot of the surface: *outline answers — Learner Guide PDF p15: “Detail is not required.” (PDF-VERIFIED, plan check A01): guidance for the exam answer, not for how fully we explain.*
2. At *which stage of interphase replication happens in*, row 1: **which stage of interphase is DNA replicated in?** · *our framing of s23_21 Q4(b)(ii), 1 mark (QP p13 / MS p14)*, and the S arc glows; at *crediting the S phase or synthesis phase*, small type *S / synthesis phase credited; a bare 'S' ignored (PDF-VERIFIED summary, A05)*.
3. At *circle both interphase and S phase*, row 2: **circle the phase(s) of the cycle** · *our framing of m24_22 Q4(b), 1 mark (QP p15 / MS p11); both interphase and S phase circled for the mark (PDF-VERIFIED summary, A06)*, and the interphase bracket and S arc are both ringed.
4. At *Multiple-choice items track DNA mass*, row 3: **DNA mass or chromatid numbers through the cycle** · *s22_12 Q19 (key D); s21_12 Q18 (key C, 92/46/92 chromatids); s23_12 Q21 (key B); s24_12 Q19 (key D); keys PDF-VERIFIED; UNVERIFIED — stems*, and the graph's S rise and drop pulse.
5. At *the role of ATP in mitosis*, row 4: **the role of ATP in mitosis** · *w20_21 Q1(a)(iii), 2 marks (QP p2 / MS p6); MS “I ref. to replication or cytokinesis” (PDF-VERIFIED, A07)*, and the M arc glows.
6. At *The reject card*, the reject card lands beside the wheel, struck through by hand: **✗ mitosis: the cell grows, replicates its DNA and divides in two** / **✓ mitosis is nuclear division; the mitotic cell cycle is interphase (G1, S, G2), mitosis and cytokinesis**; caption in small type *our wording contrast; not an examiner-reported error*; the ✓ line's three parts glow on the interphase bracket, M arc and C arc in turn.
7. At *And the hook?*, the Beat 1 hook scene returns small beneath the wheel; at *nothing halved*, its two new cells glow, tag **full copy in each**; at *it copies first, then shares*, the S arc then the M arc flash once. **Exit cue: end of *then shares*.** Final frame held 2 s: forms at left, wheel, graph and reject card at right, the hook inset beneath. No slogan.

**On-screen text:** the five forms with citations; the Learner Guide small type; the reject card and caption; *full copy in each*.

---

## Datasets

All values are **schematic teaching values**: DNA content in arbitrary units (*schematic; not measured data*) and the counting convention's fixed counts (SHARED-SPECS §4). No measured data appear.

### Dataset 1 — `DNAContentGraph`, per-cell teaching trace and `per-nucleus` variant (Beats 4–8, 10, 11, 13, 14)

| Phase band | per cell / arbitrary units | per nucleus / arbitrary units |
|---|---|---|
| G1 | 1 (flat) | 1 (flat) |
| S | 1 → 2 (straight rise; *slope schematic — not a constant replication rate*) | 1 → 2 |
| G2 | 2 (flat) | 2 |
| M, before the nuclear outline fades | 2 | 2 |
| M, open mitosis (no intact nucleus) | 2 | hatched, *schematic — no intact nucleus*; no value drawn |
| M, from the frame two new nuclei form | 2 | 1 (each new nucleus) |
| C, until the two cells separate | 2 | 1 |
| after the cells separate (second G1) | 1 (each daughter cell) | 1 |

Derived: **doubling across S: 1 × 2 = 2 units**; **drop at cytokinesis: 2 units ÷ 2 daughter cells = 1 unit each**; the per-nucleus drop: 2 units of replicated DNA shared between 2 new nuclei = 1 unit each. The unit is defined as the G1 amount of DNA in one cell; no absolute mass is stated.

### Dataset 2 — counts (count strip; Beats 4, 5, 7, 8, 13)

| Stage (compartment) | Model cell (2n = 4): chromosomes | DNA molecules | Typical diploid human somatic cell: chromosomes | DNA molecules |
|---|---:|---:|---:|---:|
| G1 (whole cell) | 4 | 4 | 46 | 46 |
| after S: G2 and early M (whole cell) | 4 (8 sister chromatids) | 8 | 46 (92 chromatids) | 92 |
| after sister separation, before cytokinesis (whole cell) | 8 daughter chromosomes | 8 | 92 | 92 |
| each new nucleus (before cytokinesis) | 4 | 4 | 46 | 46 |
| each daughter cell | 4 | 4 | 46 | 46 |

Derived: **replication doubles DNA molecules, not chromosomes**: 4 chromosomes × 2 chromatids = 8 DNA molecules; 46 × 2 = 92. **Separation**: each centromere divides, so 4 centromeres become 8 → 8 daughter chromosomes, still 8 DNA molecules (whole cell). **Shared between two nuclei**: 8 ÷ 2 = 4; 92 ÷ 2 = 46. The wheel inset's single C1 chromosome: 1 DNA molecule (G1) → 2 (end of S) → 1 per daughter chromosome after separation. The 'one pole' compartment of SHARED-SPECS §4 (4 · 4; 46 · 46) is not shown separately here; the new-nucleus row carries it.

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.23) | Beat(s) | How |
|---|---|---|
| outline the mitotic cell cycle | 1, 3, 9, 13 | the loop; the copy-then-share order; the reason it exists (growth, replacement) |
| interphase: growth in G1 | 4, 13 | cell grows, making proteins and organelles; chromosome present, long and thin; 1 unit |
| interphase: DNA replication in S phase | 5, 10, 13, 14 | schematic replication progress synced with the rising trace; two sister chromatids, one chromosome, two DNA molecules; full phase name |
| interphase: growth in G2 | 6, 13 | further growth, preparation for division; replicated but not yet condensed; 2 units |
| mitosis | 7, 12, 13 | nuclear division: condense, spindle attachment at the centromere, centromere divides, daughter chromosomes to opposite poles, two new nuclei; stage names left to 5.2.1 (prophase named once in Beat 10) |
| cytokinesis | 8, 12, 13 | division of the cytoplasm around the two nuclei already formed; usually follows, commonly overlaps late mitosis; the per-cell drop |
| topic introduction p.23 (nuclear division first, then the cytoplasm; genetic uniformity) | 1, 8, 9 | our paraphrase; 'normally identical' |
| "outline" (Learner Guide p15) | 14 (small type) | “Detail is not required.” for the exam answer only |

### Mark-scheme and examiner points → beats

| Source | Point | Beat |
|---|---|---|
| s23_21 Q4(b)(ii), QP p13 / MS p14 (A05) | which stage of interphase; S / synthesis phase; bare 'S' ignored | 10 (E5-01), 14 |
| m24_22 Q4(b), QP p15 / MS p11 (A06) | both interphase and S phase circled | 10 (E5-01), 14 |
| w20_21 Q1(a)(iii), QP p2 / MS p6 (A07) | ATP's role in mitosis, 2 marks, any two; “I ref. to replication or cytokinesis” | 12 (E5-02), 14 |
| G05 | *"Locate replication in S phase of interphase"*; *"Keep the scope of the process named in the question."* (G05's summaries) | spine; 10 (small type) |
| s22_12 Q19 (key D) | DNA mass through S/G2 | 5, 6, 14 |
| s21_12 Q18 (key C) | 92/46/92 chromatid counts | 5, 7, 8, 14 |
| s23_12 Q21 (key B) | one copy in G1 versus two at the start of cytokinesis; nuclear division complete before the cytoplasm divides | 7, 8, 14 |
| s24_12 Q19 (key D) | cell-cycle phases | 3, 14 |
| w22_13 Q19 (C), Q21 (A) (supplementary) | interphase photograph for replication; DNA doubling and growth in interphase | 4, 5 (taught; not cited on screen) |
| s24_23 Q5(c)(i–ii) | supplied inhibitor information applied to S/G2/chromatid state | 14 (row 5, not narrated) |
| w22_23 Q4(b) (shared with 5.1.2) | identical sisters, equal distribution | 9 (the 'normally identical' sentence; the full chain is 5.1.2's E5-06) |
| Learner Guide PDF p15 (A01) | “Detail is not required.” | spine; 14 (small type) |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, only, never, no, nothing, cannot, because, needs* (and causal *so*) was reread: true of all cases, or of the typical case on screen?
- 'without either new cell ending up with half the instructions' (1): a question; answered in Beats 8 and 14 with the counts.
- 'Cells in the deepest layer of your skin divide again and again' (1): a typical example of dividing cells; not every skin cell. 'each new cell needs a full copy of the genetic information' (1): the purpose for the typical body cells of this lesson; mature human red blood cells (no nucleus) are 5.1.2's exception and are not contradicted.
- 'each new cell can then go round again' (3): 'can'; some cells specialise and stop dividing (5.1.2).
- 'interphase is typically the longest part of the cycle' (3): typical, and the arcs are labelled schematic.
- 'The chromosome is there throughout interphase … too fine to pick out under a light microscope' (4): the plan's own point (present throughout interphase, long and thin, not individually visible).
- 'drawn as a slope because replication takes time' (5): the reason for a slope rather than a step; the straight line is labelled schematic.
- 'copies of each other' (5): no 'identical' absolute here; Beat 9 says 'normally … genetically identical'.
- 'They become visible as separate chromosomes later, when they condense' (6): the plan's wording; no 'only'.
- 'The DNA per cell stays at two units' (7) and 'Only now does this per-cell graph drop' (8): true of the per-cell trace by definition; Beat 11 shows the per-nucleus variant dropping earlier.
- 'It usually follows mitosis, and commonly starts while mitosis is finishing' (8): the plan's typical order; never 'cannot overlap'.
- 'each daughter cell holds half the doubled DNA' (8): the model's arithmetic (Dataset 1, 2).
- 'Copying before sharing normally keeps daughter cells genetically identical to the parent' (9): 'normally'; copying errors are 5.1.6's. 'that is why the loop exists, for growth and replacement' (9): the reason for these purposes; repair and asexual reproduction are 5.1.2's.
- E5-01 (10): 'because prophase … is when you first see a replicated chromosome' is offered as why the answer tempts, not as a claim about candidates; 'in one paper a bare letter S was ignored, and another needed both' keeps each ruling in its own paper.
- 'During part of mitosis there is no intact nucleus to measure' (11): 'part of', open mitosis as taught; not every organism.
- E5-02 (12): 'both processes use energy' (true of both); 'For this two-mark question the mark scheme says to ignore references…' (local); 'That is not a claim that ATP goes unused there' (the plan's boundary); 'neither point on this card gains credit' (this card only). No 'earns nothing', no prevalence.
- Beat 14: past tense for named papers ('have asked', 'asked'); 'crediting' not 'requires'; the reject card is our wording contrast. 'nothing halved' answers the hook for the DNA of a typical dividing cell.
- No sentence says chromosomes form or replicate in prophase, says 'the chromosome splits in half', locates replication with a bare letter S (every replication location says 'the S phase' or 'the S, or synthesis, phase of interphase'; 'Next, S, the synthesis phase' names the arc as it is introduced), claims mitosis and cytokinesis never overlap, or claims how often candidates make either error.

---

## Citations

Every quotation in this storyboard, where it appears, and the permitted file it was copied from. Nothing is quoted from an exam PDF directly; none was opened.

| # | Quotation (verbatim) | Paper / session / question / page | Tag | Beat(s) | Copied from |
|---|---|---|---|---|---|
| 1 | 5.1.3 outcome text (header blockquote) | Syllabus 2025–2027, 5.1.3, p.23 | syllabus, exact | header | `SYLLABUS-9700-DETAIL.md`; plan §5.1.3 |
| 2 | “I ref. to replication or cytokinesis” | w20_21 Q1(a)(iii), QP p2 / MS p6 | **PDF-VERIFIED (plan check A07)** | spine; 12; 14 | `work/007/VERIFIED-EVIDENCE.md` A07; plan §5.1.3; weights ledger |
| 3 | “Detail is not required.” | Cambridge Learner Guide, PDF p15 (outline annotation) | **PDF-VERIFIED (plan check A01)** | spine; 14 | `work/007/VERIFIED-EVIDENCE.md` A01; `EXAMINER-INSIGHT-9700.md` §4 |
| 4 | *G05: "Locate replication in S phase of interphase"* | G05 summary of s23_21 Q4(b)(ii) and m24_22 Q4(b) | G05's summary (not Cambridge wording) | spine; 10 | `GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md`; plan §5.1.3 |
| 5 | *G05: "Keep the scope of the process named in the question."* | G05's gate consequence for w20_21 Q1(a)(iii) | G05's authored inference | spine; ledger | `GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md` |

Cited by demand, **not quoted** (PDF-VERIFIED tariffs, keys and demands from `VERIFIED-EVIDENCE.md` and the weights): s23_21 Q4(b)(ii), QP p13 / MS p14 — which stage of interphase; 1 mark, S / synthesis phase; a bare 'S' ignored (A05). m24_22 Q4(b), QP p15 / MS p11 — 1 mark requires circling both interphase and S phase (A06). w20_21 Q1(a)(iii) — 2 marks, any two credited points (A07). Paper 1 keys (MS p2): s21_12 Q18 C; s22_12 Q19 D; s23_12 Q21 B; s24_12 Q19 D; w22_13 Q19 C, Q21 A (S-B). s24_23 Q5(c)(i–ii), 2 + 2, QP p13 / MS pp9–10. Source paths: machine-A archive, as the weights ledger gives them (`/home/dachu/sme-9700-archive/pastpapers/2023/June/9700_s23_ms_21.pdf#page=14`; `…/2024/March/9700_m24_ms_22.pdf#page=11`; `…/2020/November/9700_w20_ms_21.pdf#page=6`).

The E5-02 completed answer, **ATP supplies energy for spindle formation and for movement of daughter chromosomes to opposite poles.**, is the plan check's completed answer (plan §5.1.3 E5-02; weights register E5-02), shown in bold as our lesson's answer, not in quotation marks and not as Cambridge wording.

**UNVERIFIED items** (not quoted; shown only as our framing or omitted):
1. `UNVERIFIED — the wording of s23_21 Q4(b)(ii) and m24_22 Q4(b).` Beat 10's header and Beat 14's rows 1–2 are labelled *our framing*.
2. `UNVERIFIED — the wording of w20_21 Q1(a)(iii).` Beat 12's header and Beat 14's row 4 are labelled *our framing* (row 4 names the demand only).
3. `UNVERIFIED — the full MS list of credited points verbatim for w20_21 Q1(a)(iii).` Beat 12's completed answer is the plan check's answer, labelled so in small type.
4. `UNVERIFIED — stems of s21_12 Q18, s22_12 Q19, s23_12 Q21, s24_12 Q19` (Beat 14 row 3 cites keys and demands only).
5. `UNVERIFIED — MS points verbatim for s24_23 Q5(c)(i–ii)` (Beat 14 row 5, demand only).

---

## Word count and runtime

Counted by the validator over the blockquoted narration (silent-read and correction marker lines excluded; hyphen and en-dash compounds count once). Seconds = words ÷ 120 × 60.

| Beat | Title | Kind | Words | Seconds |
|---|---|---|---:|---:|
| 1 | Hook and context | teaching | 73 | 36.5 |
| 2 | What you will be able to do | teaching | 51 | 25.5 |
| 3 | The loop | teaching | 58 | 29.0 |
| 4 | G1: growth, one DNA molecule | teaching | 62 | 31.0 |
| 5 | S phase: replication, drawn as it happens | teaching | 81 | 40.5 |
| 6 | G2: replicated, still long and thin | teaching | 50 | 25.0 |
| 7 | Mitosis: one nucleus becomes two | teaching | 77 | 38.5 |
| 8 | Cytokinesis: the cytoplasm divides, the graph drops | teaching | 67 | 33.5 |
| 9 | The handle, and the sentence you write | teaching | 52 | 26.0 |
| **10** | **EXAM CONTRAST E5-01** (talk-through 106 words, 53 s) | **error** | **146** | **73.0** |
| 11 | Read the axis label first | teaching | 59 | 29.5 |
| **12** | **EXAM CONTRAST E5-02** (talk-through 108 words, 54 s) | **error** | **149** | **74.5** |
| 13 | What I told you, on the wheel and the graph | teaching | 60 | 30.0 |
| 14 | How it is asked, and the reject card | teaching | 78 | 39.0 |
| **Teaching (12 beats)** | | | **768** | **6:24.0** |
| **Error (2 beats)** | | | **295** | **2:27.5** |
| **Total (14 beats)** | | | **1,063** | **8:51.5** |
| Budget | | | 1,020 | 8:30 |

**Length, honestly:** **1,063 words = 8:51.5** at 120 words per minute, **21.5 s (43 words, +4.2 %) over** the 8:30 budget, inside the ±5 % window (969–1,071 words). Where it sits: the twelve teaching beats are **768 words = 6:24**, 14 s over the plan's 6:10 teaching allowance (740 words); the two error beats are **295 words = 2:27.5** against 2 × 1:10, each inside the 130–150-word (65–75 s) window with a talk-through of at least 90 words (E5-01 146 / 106; E5-02 149 / 108). Neither error beat is thinned. The 4 s silent reads sit inside the effective rate and are not added again. **Cut list, if the conductor wants 8:31 or less (−41 words), in order of least teaching loss:** (1) Beat 14: cut *and one question asked for the role of ATP in mitosis* (−11; row 4 stays on screen, unnarrated); (2) Beat 5: cut *; a typical diploid human body cell, forty-six and ninety-two* (−9; the count strip's human line stays on screen); (3) Beat 8: cut *, forty-six and forty-six in the human case* (−7; human line stays on screen); (4) Beat 2: cut *and read it on a graph* (−6); (5) Beat 11: *so on that version the stretch is hatched as schematic* → *so that stretch is hatched* (−5); (6) Beat 1: *divide again and again, replacing* → *divide, replacing* (−3). Total 11 + 9 + 7 + 6 + 5 + 3 = −41 words → 1,022 words = 8:31.0 (a further two-word trim, *Short written questions* → *Questions* in Beat 14, reaches 1,020 = 8:30.0). Each cut removes a spoken repeat of something that stays visible; the cue lists would be re-checked after any cut.

---

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| The four stage names as a sequence, envelope and nucleolus behaviour, centrioles, animal vs plant cytokinesis (cleavage furrow, cell plate), the full `MitosisCellModel` | 5.2.1 (the wheel's M inset shows condense → align → separate → decondense only; C caption hands off) |
| Why identical daughter cells matter in growth, replacement, repair and asexual reproduction; the full replication-and-segregation chain (E5-06) | 5.1.2 (Beat 9 gives the one-sentence reason only) |
| Telomere shortening during replication | 5.1.4 |
| Stem cells; which cells do the dividing in skin | 5.1.5 (the hook's skin layer is context only) |
| Mutation, loss of control, tumours; copying errors | 5.1.6 |
| Semi-conservative replication, enzymes, nucleotides, bases | 6.1.4 (named once in the replication caption) |
| G0, checkpoints, cyclins/CDKs, restriction point | not taught (calibration §5 DO-NOT-ADD; G05 "do not invent a cell-cycle molecular-control pathway") |
| Photomicrographs of interphase and dividing cells; mitotic index | 5.2.2 |
| Meiosis | not in Topic 5 |

## Reusable models established here

| Model | For |
|---|---|
| **`CellCycleWheel`** (ring G1 widest, S, G2, M, C; interphase bracket; *schematic proportions — interphase is typically the longest part*; travelling marker with positions `g1`, `s-start`, `s-end`, `g2`, `m`, `c`, `g1-next`; C1 `ChromosomeModel` inset: G1 unreplicated-extended, S replicating in sync with the trace, G2 replicated-extended, M sub-states `m-condense`, `m-align` (inset spindle elements: pole marks, spindle-fibre lines to the centromere, dashed equator), `m-separate`, `m-decondense`; C pinching outline around two already formed nuclei; count strip for the 2n = 4 model cell with compartment tags and the typical human line) | 5.1.4 (S arc lit), 5.2.1 (M arc expands into the stage sequence), 5.2.2 (interphase majority), 5.1.2, 5.1.5 |
| **`DNAContentGraph`** (per-cell teaching trace, y *DNA mass per cell / arbitrary units*, ticks 0, 1, 2; straight S rise with *slope schematic — not a constant replication rate*; drop at cytokinesis; phase bands; *schematic; not measured data*; pen linked to the wheel marker) and variant **`per-nucleus`** (open mitosis hatched *schematic — no intact nucleus*; drop when the two new nuclei form) | 5.1.2 (recall), 5.2.1 (M band) |
| The **copy · share · split** icons and the handle's converted sentence | 5.1.2, 5.1.4 (labelled recall of S) |

## Assets

| Asset | Status | Source |
|---|---|---|
| `CellCycleWheel` (ring, bracket, marker, inset window, inset spindle elements, C-arc outline, count strip) | **new build** | authored |
| `DNAContentGraph` (per-cell and `per-nucleus` panels, pen linked to the marker, phase bands, overlap band, hatch) | **new build** | authored |
| `ChromosomeModel` C1 (`unreplicated-extended`, `replicating`, `replicated-extended`, `replicated-condensed`, `separated`; `Z1` magnifier; counters) | reuse | 5.1.1 |
| Hook scene (skin's deepest layer, dividing cell, surface cell detaching); light-microscope silhouette icon (blurred field) | new, schematic vector | authored; no photograph, no generated image |
| Objectives surface and pictograms (loop, copy, scissors-and-circle; tiny step-line icon); copy · share · split icons | new | authored |
| E5-01 and E5-02 cards (our composites), headers (our framings), citation and boundary tabs; EXAM CONTRAST panel | new card content; shared panel | authored; panel from Topics 1–3 with label prop **EXAM CONTRAST** |
| Forms surface; reject card | shared surfaces, new content | authored |
| Micrographs, photographs, Cambridge artwork | none | — |

---

## Validator run

`python3 work/007/validate_storyboard.py storyboards/topic-05/5.1.3/STORYBOARD.md`

```
beat  words  cues maxgap  status
   1     73     9     14  ok  
   2     51     5     13  ok  
   3     58     8     12  ok  
   4     62     8     13  ok  
   5     81    11     11  ok  
   6     50     6     15  ok  
   7     77    10     11  ok  
   8     67    10     16  ok  
   9     52     7     11  ok  
  10    146    18     16  ok  talk-through 106 w
  11     59     8     12  ok  
  12    149    19     21  ok  talk-through 108 w
  13     60    10      8  ok  
  14     78    11     16  ok  
TOTAL words 1063  cues 140  runtime at 120 wpm 8:51.5  beats 14  failing beats 0
```

`python3 work/007/check_quotes.py storyboards/topic-05/5.1.3/STORYBOARD.md`

```
quotes checked 6  not found 0
```

Both were re-run after pasting; the output is unchanged (the pasted blocks contain no double-quoted strings and sit outside the beats).
