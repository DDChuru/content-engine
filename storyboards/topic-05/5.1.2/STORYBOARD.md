# 5.1.2 — Why mitosis makes identical cells: growth, replacement, repair and asexual reproduction

**Storyboard, first draft; round-1 check fixes applied. Cloud run 007, 27 September 2026.** No audio, no code, no render. Folder `storyboards/topic-05/5.1.2/`.
Cambridge 9700 syllabus 2025–2027, p.23. Command word **EXPLAIN**. Budget from `TOPIC-PLAN-05-CELL-CYCLE.md` §5.1.2 and lesson table, and `TOPIC-05-WEIGHTS.md` (5.1.2 row): **6:30 (about 780 words at 120 wpm) = teaching allowance 5:20 + one 70 s error beat (E5-06, EXAM CONTRAST); 9 teaching/framing/recap beats + 1 error beat = 10 beats**; delivered here as **10 beats (9 + 1)**. 5.1.2 is 3 of 15 fixed-sample papers (2 Paper 1, 1 Paper 2, 0 Paper 3), 5 overlapping marks. Runtime estimated at **120 words per minute of final video**.

> **5.1.2** explain the importance of mitosis in the production of genetically identical daughter cells during:
>
> - growth of multicellular organisms
> - replacement of damaged or dead cells
> - repair of tissues by cell replacement
> - asexual reproduction

(syllabus p.23; PDF-VERIFIED (plan check): the check read all eight p.23 outcomes exactly.)

**Authorities read, in full:** `work/007/SHARED-SPECS.md` (binding: §1 naming, §2 format and beat syntax, §3 evidence and tags, §4 counting convention with compartments, wording, the mitosis purpose chain, schematic replication, §5 shared models, §7 frames and motion, §8 error beats); `plan/topic-05/TOPIC-PLAN-05-CELL-CYCLE.md` (whole plan; §5.1.2, lesson table, shared-models table, traps table, CHECK RESPONSE (plan), especially MF1 counting and anaphase wording, MF2 E5-06 wording, MF3 "every cell keeps dividing" and the healing-cut replacement, SF4 root growth); `plan/topic-05/TOPIC-05-WEIGHTS.md` (5.1.2 row and paragraph; ledger rows w22_23 Q4(b), s20_12 Q20, s22_12 Q17; E5-06 register row); `work/007/VERIFIED-EVIDENCE.md` (A04; Paper 1 keys; syllabus p.23); `cloud-inputs/007/standards-update/VIDEO-STRUCTURE.md` (all of it: full shape, hook and handle, five-move error beat, truthful badge, written-never-spoken, weave the list, say the typical thing as typical, silence anchored, animate the mechanism, recap on the familiar visual, exam close, REAL-WORLD SAMPLES); the cleared `cloud-inputs/006/examples/3.1.3/STORYBOARD.md` and `3.2.1b/STORYBOARD.md` (format, section order, rigour); `cloud-inputs/006/examples/TOPIC-03-PLAN-CHECK.md` (what gets punished: local rulings generalised, unlabelled schematic data, unspecified models); `cloud-inputs/003/standards/SYLLABUS-9700-DETAIL.md` (Topic 5 introduction and outcomes, p.23); `cloud-inputs/007/evidence/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md` (G05, the w22_23 Q4(b) row); `cloud-inputs/007/evidence/EXAMINER-INSIGHT-9700.md` (no Topic 5 report sentence); `COMPLEXITY-CALIBRATION-9700-BIOLOGY.md` §5 (DO-NOT-ADD). **No question paper, mark scheme or examiner report PDF was opened; none is available in this run.** (Round 1: the independent checker read the w22_23 Q4(b), s22_12 Q17 and s20_12 Q20 QPs and MSs and syllabus p.23; resolved items are tagged PDF-VERIFIED (round-1 check).) Every quotation is copied from the files named in *Citations*.

**Build position:** 6 of 8 (5.1.1 → 5.1.3 → 5.1.4 → 5.2.1 → 5.2.2 → **5.1.2** → 5.1.5 → 5.1.6). It explains *why identical*, which needs replication (5.1.3) and separation of sister chromatids (5.2.1); it opens with its own labelled recall of both and stands alone. **Models used:** `ChromosomeModel` (5.1.1; states `replicating`, `replicated-extended`, `replicated-condensed`, `separated`, `unreplicated-condensed`; Z0; gene bands; count overlay), `CellCycleWheel` and `DNAContentGraph` per-cell trace (5.1.3), `MitosisCellModel` animal (`metaphase`, `anaphase`, `telophase`, `cytokinesis`) and a plant miniature (5.2.1). **Published here:** the four-panel **`ContextStrip`** (growth · replacement · repair · asexual reproduction) and the lesson's own diagram, the **`IdenticalChain`** layout. Everything drawn is a **MODEL**, labelled *schematic*; no photograph, micrograph or generated image is used.

---

## The causal spine

One idea carries the lesson: **daughter cells made by mitosis are genetically identical because every chromosome is copied first and the copies are then shared out one of each.** The four contexts are consequences: each needs new cells that carry the same genetic information as the cells they join, replace or come from.

> **DNA is replicated in the S phase of interphase, so each chromosome consists of two identical sister chromatids. In anaphase the centromeres divide and the sister chromatids of every chromosome separate to opposite poles. So each daughter nucleus receives one copy of every chromosome: the same number of chromosomes as the parent nucleus, carrying the same genetic information (unless a copying error has occurred). Cytokinesis divides the cytoplasm, giving two genetically identical daughter cells. That is why mitosis serves growth (new cells with the same genes as the tissue they join), replacement of damaged or dead cells and repair of tissues by cell replacement (new cells with the same genetic information as those lost; where needed, daughter cells differentiate), and asexual reproduction (offspring genetically identical to the one parent: a clone).**

**What the syllabus and mark schemes credit, quoted.** The syllabus's own topic introduction (p.23, PDF-VERIFIED (plan check)): "The mitotic cell cycle of eukaryotes involves DNA replication followed by nuclear division. This ensures the genetic uniformity of all daughter cells." The examined form is w22_23 Q4(b) (QP p11 / MS p16): **two events asked; marked out of 3, any three listed points; identical sister chromatids, alignment and equal distribution supported; chromosomes/daughter chromosomes going to the poles accepted** — the plan check's VERIFIED SUMMARY (A04), cited by demand, **not** quoted; **PDF-VERIFIED (round-1 check)**: independently checked against the QP and MS in round-1/5.1.2/CHECK.md (QP p.11: identify and explain two events in the cell cycle, genetically identical cells in developing whitefish, 3 marks; MS p.16: ten listed points, any three; points 2, 3, 4 and 6 cover identical sisters, equatorial alignment, each cell receiving a chromatid from each chromosome, and opposite-pole movement). Question framings and summaries are our wording. (Historical record: the draft author did not open the PDFs and had tagged the marking points UNVERIFIED.) G05's summary of that credit: "Explain why daughter nuclei retain identical information through DNA replication followed by appropriate separation" and its check "Link replication to two copies and segregation to one equivalent set per nucleus. “Mitosis makes identical cells” alone states the result." (G05's words, an authored inference; not Cambridge's wording and not a candidate's answer). Paper 1: s20_12 Q20 (key C, growth/repair roles) and s22_12 Q17 (key A, purpose of mitosis), keys PDF-VERIFIED (plan check); stems **PDF-VERIFIED (round-1 check)** (s22_12 QP p.7: A is growth of organisms; *repair of cells* is a distractor, tissue repair by cell replacement is this lesson's claim; s20_12 QP p.8: Venn contexts clonal selection of T-lymphocytes, new root-tip cells, replacement of skin cells damaged by injury). So the spine is what is credited: identical sister chromatids from replication, their separation to opposite poles, and one equivalent set per daughter nucleus. **Our chain is a sufficient route through w22_23 Q4(b) (two events asked, any three points), not a claim that every link is required.**

**The handle:** *copy, then share one of each.* Converted in the same breath (Beat 4): *replication makes identical sister chromatids, and separating them gives each daughter nucleus one copy of every chromosome.* The handle is never the exam answer; the recap and E5-06's correction use the converted sentence.

**Typicality rules applied.** *Unless a copying error has occurred* is said once (Beat 4), as the plan's bound; no mutation or variation discussion (5.1.6's route in). Replacement is said as typical (*continually worn away, and typically replaced*), with no rate or figure. Root lengthening is not credited to mitosis alone (the new cells also elongate; plan SF4). Repair: *mitosis supplies replacement cells; where needed, the daughter cells then differentiate*; no claim that every tissue is restored perfectly. *some cells specialise and stop dividing*; *a mature human red blood cell has no nucleus and cannot divide* (human, not all vertebrates; shown already mature, with no nucleus from its first frame; its development belongs to 5.1.5). Set cards compare cells at the stage when the daughter cells form, never inside a shed outermost dead skin cell; the four-rod set is a simplified comparison, not any organism's chromosome number. The same genes do not by themselves decide what a cell becomes. Counts carry a compartment (§4): whole cell / one pole / each new nucleus / each daughter cell; the human figure is *a typical diploid human somatic cell*. Anaphase wording is SHARED-SPECS §4's; no meiosis comparison; "splits" never used of a chromosome. Replication is placed in **the S phase of interphase** (full name). The reason E5-06's line is tempting is our teaching hypothesis, not examiner testimony, and no prevalence is claimed.

**One error beat, five moves** (announce → written card → 4 s silent read → cue-synced talk-through → correct in place): **E5-06 in Beat 5**, badge **EXAM CONTRAST** (basis: a real question, w22_23 Q4(b), with no examiner report on how often candidates stop at the result). One fault; the marker clears only on the completed correct frame. The closing reject card (Beat 10) is a separate **authored** card, captioned *our wording contrast; not an examiner-reported error*.

---

## The models, specified once

Shared models are used exactly as SHARED-SPECS §5 specifies (same geometry, colours, labels, state ids). Colour tokens: chromosome hues **C1 long = deep blue**, **C2 long = teal**, **C3 short = amber**, **C4 short = green** (colour means *which chromosome*, never parental origin; homologous pairs never named); telomeres grey blocks; gene bands white with a thin dark outline, labelled *gene*; centromere a constriction with a small dark dot; nucleolus a darker grey disc; **terracotta only for the E5-06 marker**; highlights and rings in the house accent.

### `ChromosomeModel` (5.1.1; reused by state id)
`replicating` (schematic progress along the molecule, S only) → `replicated-extended` → `replicated-condensed` (X: two sister chromatids joined at one centromere, telomeres at all four ends, **gene bands at the same two positions on both sister chromatids** — the visual proof of *identical*) → `separated` (switch in ONE rendered frame at the narration's *centromeres divide*; each unit relabelled *daughter chromosome* on that frame; DNA-molecule count unchanged; then MOVES apart, centromere leading; in this schematic the arms trail behind the leading centromere; real chromosomes may look U- or V-shaped). `unreplicated-condensed` is used only in the **set cards** below, with the tag *drawn condensed for comparison*. Count overlay: *chromosomes (count centromeres)* · *DNA molecules* · compartment tag. Replication caption, whenever `replicating` runs: *schematic account of replication during S; detailed replication in 6.1.4*.

### `CellCycleWheel` and `DNAContentGraph` (5.1.3; recalled by label)
The wheel (G1, S, G2 bracketed **interphase**; M; C; caption *schematic proportions — interphase is typically the longest part*), travelling marker and C1 inset; the per-cell `DNAContentGraph` (y **DNA mass per cell / arbitrary units**, ticks 0, 1, 2; x **time**; S drawn as a straight rise with *slope schematic — not a constant replication rate*; caption *schematic; not measured data*). Used in Beat 3 only, and in Beat 5 as a small replay; separation never first occurs in the C arc.

### `MitosisCellModel` (5.2.1; reused by state id)
**Animal** variant, 2n = 4 (C1–C4): `metaphase` → `anaphase` → `telophase` (nuclear envelopes re-forming as motion, nucleolus reappearing in each new nucleus, chromosomes decondensing) → `cytokinesis` (cleavage furrow: the cell surface membrane drawn in). Count strip beside the cell per §4: metaphase *whole cell: 4 chromosomes · 8 DNA molecules (8 sister chromatids)*; anaphase after separation *whole cell: 8 daughter chromosomes · 8 DNA molecules* and *one pole: 4 · 4*; telophase before cytokinesis completes *whole cell 8 · each new nucleus 4*; after cytokinesis *each daughter cell: 4 chromosomes · 4 DNA molecules*. Human reference tag where shown: *typical diploid human somatic cell: 46 per daughter nucleus*. A **plant** miniature (cell wall, no centrioles, cell plate) appears only inside the growth panel.

### `IdenticalChain` (published here — the lesson's own diagram)
Centre: the animal `MitosisCellModel` running from `anaphase` to `cytokinesis`, with its count strip. Left of it, a small parent **set card**: the four chromosomes (C1–C4) as `replicated-condensed` Xs, gene bands identical on each pair of sister chromatids, tag *parent cell after S*. Right of it, two daughter **set cards**, one under each daughter cell: four `unreplicated-condensed` rods (C1–C4), tag *drawn condensed for comparison*; each rod's gene bands sit at the same positions as on its parent X. Above, a three-link chain strip in the house accent: **copy: DNA replicated in the S (synthesis) phase of interphase → two identical sister chromatids** · **share: sister chromatids separate to opposite poles in anaphase** · **result: each daughter nucleus receives one copy of every chromosome → same number, same genetic information**. The handle tags *copy* and *share one of each* sit on the first two links. Caption *schematic*.

### `ContextStrip` (published here; 5.1.5 and 5.1.6 may recall panels by label)
Four drawn panels in a row, each captioned *schematic*, each with a dividing-cell miniature and, beside its new cells, a miniature **set card** (the same four C1–C4 rods with the same gene bands as `IdenticalChain`'s daughter cards), tag *same set*. Beside the set cards in every panel, small type: *Simplified chromosome-set comparison; not this organism's chromosome number*. *Same set* is local: parent and new cells **within** one example; no frame suggests that humans and plants (or any two species) share a four-chromosome genome.
1. **growth** — a root tip in longitudinal view: root cap, a band of small cells just behind it (a plant `MitosisCellModel` miniature dividing, motion), and above it cells lengthening (motion), tag *new cells also elongate*; beside it a simple human outline that grows taller (motion), tag *growing tissues*.
2. **replacement** — a cross-section strip of the outer skin layer and, below it, the small-intestine lining: surface cells detach and drift off (motion) while new cells from dividing cells below move up to take their place (motion), tag *typical: continually replaced*. The set cards sit beside the newly formed daughter cells in the lower, dividing layer, caption *same information when the daughter cells form*; no set card, nucleus or retained chromosome set is drawn inside a shed outermost dead skin cell.
3. **repair** — a skin cut: a gap in the cell layers; dividing cells at the edges (motion) supply cells that move in and close the gap (motion); some daughter cells change shape into the specialised surface type (motion), tag *daughter cells differentiate where needed*. **Red-blood-cell inset (round-1 M1):** At *a mature human red blood cell*, open a separate inset of an already mature human red blood cell, with no nucleus from its first frame. Caption: *mature human red blood cell: no nucleus; cannot divide*. Keep this inset separate from the skin-repair lineage; no skin cell becomes a red blood cell. Do not animate nuclear extrusion in this mature-cell inset. Development into this state belongs to the differentiating lineage in 5.1.5.
4. **asexual reproduction** — a strawberry plant; a runner grows out along the soil line (motion), touches the soil, roots grow down and a plantlet's leaves unfold (motion), tag *runner → plantlet*; the plantlet's set card matches the parent plant's, tag *clone*.

Photographs, micrographs and generated images: none. No rate, lifespan or measured figure is attached to any panel.

---

## Beat by beat

Beat windows in the headings follow the per-beat ledger (words ÷ 120 × 60; E5-06's 4 s silent read sits inside the effective rate and is not added again); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch over 30 words without a stated visual change. A model, apparatus or image is on screen in every frame.

### BEAT 1 · Hook and context · 0:00–0:41
**Narration:**
> Ever wondered how a grazed knee heals over with new skin that is still, gene for gene, yours? You grew by adding cells; the surface of your skin and the lining of your gut are worn away and replaced; a strawberry plant even makes whole new plants from its runners. Each time, new cells come from a cell dividing, and they carry the same genetic information as the cell they came from. That sameness comes from how the division is done.

**Visual action:**
1. **From the first frame**, a drawn knee outline with a graze (a shallow gap in the skin layers, cells drawn) is on screen, caption *schematic*; at *a grazed knee heals over*, cells at the edges of the gap divide (motion) and new cells slide in and close it (motion); at *gene for gene, yours*, a small set card (C1–C4 rods, gene bands) appears beside the healed patch, matching a second set card beside the surrounding skin, tag *same set?*. The hook question sits as a compact caption above the knee, never alone on the frame.
2. At *You grew by adding cells*, the knee reduces into the first of four panel frames (the `ContextStrip` outline, panels untitled) and panel 1 fills: the human outline grows taller (motion). At *the surface of your skin*, panel 2 fills: surface cells detach and drift off while cells from below move up (motion); at *lining of your gut*, the intestine-lining strip beneath does the same (motion).
3. At *a strawberry plant even makes whole new plants*, panel 4 fills: a runner grows out along the soil line and a plantlet roots (motion).
4. At *new cells come from a cell dividing*, a dividing-cell miniature pulses in each panel (motion: one cell becomes two); at *the same genetic information*, the set cards beside the new cells in each panel flash in turn, each matching its own parent card within that panel; small type *Simplified chromosome-set comparison; not this organism's chromosome number*.
5. At *how the division is done*, the dividing-cell miniature in panel 1 enlarges, then the frame dissolves to the objectives surface.

**On-screen text:** the hook question; *schematic*; *same set?*.

---

### BEAT 2 · What you will be able to do · 0:41–1:01
**Narration:**
> By the end you will be able to explain why mitosis gives daughter cells that are genetically identical, from two events in the cell cycle; and explain why that matters for growth, for replacing and repairing tissues, and for asexual reproduction.

**Visual action:** Own styled surface, distinct background colour and brand typography, **not the lesson diagram**; each line enters with motion beside simple authored pictograms (flat line icons, not the lesson's models), so no frame is text alone. At *explain why mitosis gives daughter cells*, line 1 enters with a **one-circle-to-two-circles** pictogram; at *from two events in the cell cycle*, a **copy** pictogram (two stacked sheets) and a **split-arrow** pictogram join line 1. At *why that matters for growth*, line 2 enters with four small pictograms in a row: a **sprouting root**, a **layered tile**, a **plaster**, a **strawberry**.
1. **EXPLAIN** why mitosis gives genetically identical daughter cells, from two events
2. **EXPLAIN** why that matters for growth, replacement, repair and asexual reproduction

Small type: *syllabus 5.1.2, "explain", p.23.*

---

### BEAT 3 · Recall: copy in S, share in anaphase · 1:01–1:44
**Narration:**
> Two things you have met already do the work. First, from the cell cycle: in the S phase of interphase, the DNA of each chromosome is replicated. When that is complete, each chromosome is two sister chromatids joined at the centromere, and because one is a copy of the other, they carry the same genes. Second, from mitosis: in anaphase the centromeres divide and the sister chromatids separate to opposite poles. Once separated, each is a daughter chromosome, and each pole receives one from every chromosome.

**Visual action:**
1. The tag **recall: 5.1.3** sits top left. At *Two things you have met already*, `CellCycleWheel` at left with the travelling marker in G1 and its C1 inset in `unreplicated-extended`; the per-cell `DNAContentGraph` at right, flat at 1 through G1; count overlay *whole cell: 4 chromosomes · 4 DNA molecules*.
2. At *the S phase of interphase*, the marker enters the S arc and the arc label expands to **S (synthesis) phase of interphase**; at *is replicated*, the inset runs `replicating` (schematic progress along the molecule) **in step with** the graph's rise from 1 towards 2 (both motion), caption *schematic account of replication during S; detailed replication in 6.1.4*.
3. At *When that is complete*, the trace reaches 2 and the inset changes to the completed `replicated-extended` state; overlay *whole cell: 4 chromosomes · 8 DNA molecules*. The marker moves on through G2 into the M arc and the inset condenses (continuous coiling motion) to `replicated-condensed`; at *two sister chromatids joined at the centromere*, labels **sister chromatids** and **centromere**.
4. At *one is a copy of the other*, the two gene bands on one chromatid and the matching bands on its sister pulse together, label **gene**; at *they carry the same genes*, a thin accent bracket joins each matching pair.
5. At *Second, from mitosis*, the tag changes to **recall: 5.2.1** and the wheel slides aside; the animal `MitosisCellModel` enters in `metaphase` (C1–C4 at the equator, spindle attached at each centromere), count strip *whole cell: 4 chromosomes · 8 DNA molecules (8 sister chromatids)*.
6. At *the centromeres divide*, in ONE rendered frame every X switches to `separated` and each unit is relabelled **daughter chromosome**; count strip *whole cell: 8 daughter chromosomes · 8 DNA molecules*. At *separate to opposite poles*, the daughter chromosomes move to the poles, centromere leading, as the spindle fibres shorten (motion); small type *in this schematic, arms trail the leading centromere*.
7. At *each pole receives one from every chromosome*, the four daughter chromosomes at each pole are ringed, one per hue; count strip adds *one pole: 4 chromosomes · 4 DNA molecules*.

**On-screen text:** *recall: 5.1.3*, then *recall: 5.2.1*; wheel and graph labels and captions; *sister chromatids*, *centromere*, *gene*, *daughter chromosome*; the count strips with compartments.

---

### BEAT 4 · Why the daughter nuclei are identical · 1:44–2:34
**Narration:**
> Replication made two identical copies of every chromosome; separation sent one copy of each to each pole. So each new nucleus holds one copy of every chromosome: the same number as the parent nucleus, with the same genetic information, unless a copying error has occurred. Cytokinesis then divides the cytoplasm, giving two genetically identical daughter cells: four chromosomes each in our model, forty-six in a typical diploid human somatic cell. Think of it as copy, then share one of each. Written properly: replication makes identical sister chromatids, and separating them gives each daughter nucleus one copy of every chromosome.

**Visual action:**
1. **From the beat's first frame**, the `IdenticalChain` layout builds around the anaphase cell from Beat 3: the parent set card (four Xs, *parent cell after S*) slides in at left; the empty chain strip draws above.
2. At *Replication made two identical copies*, link 1 (**copy**) writes, and on the parent card the matching gene bands on each pair of sister chromatids pulse; at *separation sent one copy of each*, link 2 (**share**) writes and the anaphase movement from Beat 3 replays once (motion).
3. At *each new nucleus holds one copy*, the cell runs to `telophase`: nuclear envelopes re-form around each group (motion), the nucleolus reappears in each new nucleus, the chromosomes decondense (motion); count strip *whole cell: 8 · each new nucleus: 4*. At *the same number as the parent nucleus*, the two new nuclei and the parent card are ringed together, tag **4 = 4**; at *the same genetic information*, link 3 (**result**) writes.
4. At *unless a copying error has occurred*, small type beneath link 3: *identical unless a copying error occurs; mutation: 5.1.6*.
5. At *Cytokinesis then divides the cytoplasm*, the cell surface membrane draws in as a cleavage furrow until the cell is pinched into two (motion); count strip *each daughter cell: 4 chromosomes · 4 DNA molecules*. At *two genetically identical daughter cells*, the two daughter set cards slide in under the cells and each rod's gene bands light at the same positions as on its parent X (a thin accent line joins each matching band across the cards).
6. At *four chromosomes each in our model*, the tag **model cell: 4 per daughter cell** lands; at *forty-six in a typical diploid human somatic cell*, the tag **typical diploid human somatic cell: 46 per daughter nucleus** lands beside it.
7. At *copy, then share one of each*, the handle tags *copy* and *share one of each* stamp onto links 1 and 2.
8. At *Written properly*, the converted sentence writes beneath the chain clause by clause: at *replication makes identical sister chromatids*, **replication makes identical sister chromatids,**; at *gives each daughter nucleus one copy*, **and separating them gives each daughter nucleus one copy of every chromosome.** The complete sentence holds.

**On-screen text:** the chain strip; *4 = 4*; the count strips; *identical unless a copying error occurs; mutation: 5.1.6*; the model and human tags; the handle tags; the converted sentence.

---

### BEAT 5 · EXAM CONTRAST E5-06: the result, not the reason · 2:34–3:48
**Narration:**
> Here is an answer that would lose the marks. Our framing of a November 2022 question: which two events make identical daughter cells? Read this answer.
>
> *(silent read, 4 s)*
>
> Look at the whole line. Nothing in it is false, and that is why it is tempting: it echoes the syllabus wording, and it sounds like an answer. But it restates the result the question hands you. That paper asked for two events, and marked out of three, crediting points such as identical sister chromatids, their alignment, and equal distribution to the poles. None of those points is in this line; it names no event. The fix is to say how the identical copies are made, and how they are shared out.
>
> *(correction)*
>
> DNA is replicated in the S phase of interphase, giving two identical sister chromatids; in anaphase they separate to opposite poles; so each daughter nucleus receives one copy of every chromosome.

**Visual action:**
1. **Entry cue: *Here is an answer that would lose the marks*.** The EXAM CONTRAST panel enters (header badge **EXAM CONTRAST**, terracotta border, desaturated surround) with its basis line in small type: *basis: a real question; no examiner report on how often — w22_23 Q4(b), QP p11 / MS p16; 3 marks, any three listed points*. It stays on until the completed correct frame. At EXAM CONTRAST entry, reset the dimmed model to a labelled *Replay* metaphase starting state, with four replicated chromosomes: the `IdenticalChain` diagram holds at left, dimmed, its chain strip hidden, its central `MitosisCellModel` reset to `metaphase` (C1–C4 as `replicated-condensed` Xs at the equator), tag **Replay**. Completed daughter cells are never animated reversing into one parent.
2. At *Our framing of a November 2022 question*, the header lands: **Identify and explain two cell-cycle events that produce genetically identical daughter cells.** Small type *our framing of w22_23 Q4(b) (whitefish context omitted); independently checked against the QP and MS in round-1/5.1.2/CHECK.md; question framings and summaries are our wording*.
3. At *Read this answer*, the written answer appears in handwriting style: **✗** *Mitosis produces genetically identical cells.* Small type *our composite; not a transcript*.
4. **Silent read, 4 s.** Panel and card held.
5. At *Look at the whole line*, the whole line is underlined in terracotta; at *Nothing in it is false*, a small side-note *true, but…*; at *it echoes the syllabus wording*, a small syllabus tab slides in beside the card, *syllabus 5.1.2: "production of genetically identical daughter cells"*, and the matching words on the card and tab are ringed together.
6. At *it restates the result*, an arrow from the ringed words points back to the header's *genetically identical*, side-note *result given in the question*.
7. At *That paper asked for two events*, a demand tab: **w22_23 Q4(b): two events asked · 3 marks · any three listed points** (small type *independently checked against the QP and MS in round-1/5.1.2/CHECK.md; our summary, not the scheme's wording*). At *crediting points such as identical sister chromatids*, show three example labels: *identical sister chromatids*, *alignment at the equator*, *distribution to opposite poles*, under *Examples of credit — alternatives, not a compulsory checklist*. These are examples, not empty ticks.
8. At *None of those points is in this line*, ring the missing explanation in the authored answer; retain the two empty event slots at *it names no event*: two empty event slots draw on the card, *event 1 ?* and *event 2 ?*.
9. At *how the identical copies are made*, the dimmed `IdenticalChain` at left brightens its parent card (matching gene bands pulse); at *how they are shared out*, its **Replay** metaphase cell brightens. The marker stays on.
10. When correction begins at *DNA is replicated in the S phase of interphase*, replace the examples strip with three rows captioned *Three credited points in this answer*. Write the corrected answer in the same place as the crossed-out answer (the line is struck through by hand; the corrected answer writes in its place, clause by clause). The S-phase replay is a separately labelled inset, tag **S-phase replay**: the `replicating` inset runs beside a small `DNAContentGraph` S rise (motion, caption *schematic account of replication during S; detailed replication in 6.1.4*), and **event 1** fills: *DNA replicated in the S (synthesis) phase of interphase → two identical sister chromatids*. Fill row 1, *identical sister chromatids — MS point 2*, when that clause is complete.
11. The central **Replay** metaphase model then runs forwards through separation and daughter-nucleus formation. At *in anaphase they separate to opposite poles*, the centromeres divide in one frame and, on that same frame, each unit is relabelled *daughter chromosome* and the replay's count strip changes from *whole cell: 4 chromosomes · 8 DNA molecules* to *whole cell: 8 daughter chromosomes · 8 DNA molecules*; the daughter chromosomes move to the poles (motion); **event 2** fills: *sister chromatids separate to opposite poles in anaphase*. Fill row 2, *sister chromatids move to opposite poles — MS point 6*, at the completion of *in anaphase they separate to opposite poles*.
12. At *each daughter nucleus receives one copy of every chromosome*, the model runs to `telophase` (nuclear envelopes re-form, one group per new nucleus; count strip *whole cell: 8 · each new nucleus: 4* on the frame the envelopes close) and the last clause writes: *→ each daughter nucleus receives one copy of every chromosome: same number, same genetic information*. Fill row 3, *one chromatid of each chromosome reaches each daughter cell — MS point 4*, at the completion of *each daughter nucleus receives one copy of every chromosome*. Keep the daughter-cell/set-card connection visible to show the same allocation in the resulting cells (the daughter set cards light). Only then clear the marker. **The marker clears on this completed frame.** Caption: *One sufficient answer: two events, three credited points. Other routes are accepted.* No unfilled alignment tick remains. The MS point numbers are small source notes (build/check annotations); bare *DNA is replicated* is not assigned MS point 1 (which specifies semi-conservative replication). **Exit cue: end of *one copy of every chromosome*.** The corrected card holds.

**On-screen text:** the panel and basis line; the *Replay* tag; the header and framing label; the card and composite caption; the syllabus tab; the demand tab; the examples strip and its heading; the event slots; the *S-phase replay* inset; the corrected answer; the three credited-point rows; the sufficiency caption.

---

### BEAT 6 · Growth: new cells with the same genes · 3:48–4:21
**Narration:**
> So why does identical matter? Start with growth. Just behind the tip of a root, cells divide by mitosis, supplying new cells; the root lengthens as those cells also elongate, not by division alone. Your own tissues grew the same way. Each new cell carries the same genes as the tissue it joins, so a growing tissue is built of cells with the same genetic information.

**Visual action:**
1. At *why does identical matter*, the `IdenticalChain` diagram reduces to the upper half of the frame (still visible) and the `ContextStrip` opens beneath it; panel 1 is titled **growth** and enlarges.
2. At *Just behind the tip of a root*, the root-tip drawing: **root cap** at the tip, the band of small cells behind it labelled **region of cell division**; at *cells divide by mitosis, supplying new cells*, the plant `MitosisCellModel` miniature divides there, then again (motion; cell plate forming between each pair).
3. At *the root lengthens*, cells above the division band stretch lengthways (motion) and the tip moves down the frame; at *also elongate*, tag **new cells also elongate**; at *not by division alone*, the elongation zone and division band are bracketed separately.
4. At *Your own tissues grew*, the human outline beside the root grows taller (motion), tag **growing tissues**.
5. At *Each new cell carries the same genes*, a set card appears beside a new root cell and beside the growing outline, each matching its own parent cell's card within that example (drawn in the same simplified four-rod style as the `IdenticalChain` cards; no accent line joins the plant and human cards); at *a growing tissue is built of cells*, the panel's new cells light together, tag *same set* (root cells with the root's parent card; the human outline with its own parent card), small type *Simplified chromosome-set comparison; not this organism's chromosome number*.

**On-screen text:** *growth*; *root cap*; *region of cell division*; *new cells also elongate*; *growing tissues*; *same set*; *schematic*.

---

### BEAT 7 · Replacement and repair · 4:21–5:12
**Narration:**
> Replacement goes on all the time. The outer layer of your skin and the lining of your small intestine are continually worn away, and typically replaced by cells made by mitosis, with the same genetic information as the cells they replace. Repair is replacement after damage. In a skin cut, mitosis supplies replacement cells; where needed, the daughter cells then differentiate into specialised types. The same genes don't by themselves decide what a cell becomes, and some cells specialise and stop dividing; a mature human red blood cell has no nucleus and cannot divide. Which cells do the dividing? Stem cells, next.

**Visual action:**
1. At *Replacement goes on all the time*, panel 2 (**replacement**) enlarges; panel 1 stays small beside it.
2. At *The outer layer of your skin*, the skin strip labelled **outer layer of skin**; at *lining of your small intestine*, the intestine strip labelled **small-intestine lining**. At *continually worn away*, surface cells detach and drift off both strips (motion); at *typically replaced by cells made by mitosis*, cells in the lower layers divide (motion) and new cells move up into the gaps (motion), tag *typical: continually replaced*.
3. At *the same genetic information as the cells they replace*, set cards beside the newly formed daughter cells in the lower layer and beside the parent dividing cell match, tag *same set*, caption *same information when the daughter cells form*; beside the set cards, small type *Simplified chromosome-set comparison; not this organism's chromosome number*. No set card, nucleus or chromosome set is drawn inside a shed outermost dead skin cell.
4. At *Repair is replacement after damage*, panel 3 (**repair**) enlarges: the skin strip with a cut through its layers. At *mitosis supplies replacement cells*, cells at both edges divide (motion) and daughter cells move into the gap and close it (motion).
5. At *the daughter cells then differentiate*, some of the new cells change shape into flattened surface cells (motion), tag **daughter cells differentiate where needed**.
6. At *The same genes don't by themselves decide*, two new cells of different shapes are ringed, each with the same set card, tag *same genes, different specialised type*.
7. At *some cells specialise and stop dividing*, one flattened surface cell dims its dividing-cell glyph, tag *specialised: no longer dividing*; at *a mature human red blood cell*, open a separate inset of an already mature human red blood cell, with no nucleus from its first frame. Caption: *mature human red blood cell: no nucleus; cannot divide*. Keep this inset separate from the skin-repair lineage; no skin cell becomes a red blood cell. Do not animate nuclear extrusion in this mature-cell inset. Development into this state belongs to the differentiating lineage in 5.1.5.
8. At *Which cells do the dividing?*, the dividing cells at the base of the skin strip are ringed with a question tag; at *Stem cells, next*, tag **next: 5.1.5 stem cells**.

**On-screen text:** *replacement*; *repair*; the strip labels; *typical: continually replaced*; *same set*; *daughter cells differentiate where needed*; *same genes, different specialised type*; *specialised: no longer dividing*; *mature human red blood cell: no nucleus; cannot divide*; *Simplified chromosome-set comparison; not this organism's chromosome number*; *same information when the daughter cells form*; *next: 5.1.5 stem cells*; *schematic*.

---

### BEAT 8 · Asexual reproduction: a clone from one parent · 5:12–5:39
**Narration:**
> Last, asexual reproduction. A strawberry plant sends out runners, stems that grow along the ground; where a runner touches the soil, a new plantlet roots and grows. Its cells are all produced by mitosis from the parent's cells, so the plantlet is genetically identical to its parent: a clone, from one parent alone.

**Visual action:**
1. At *Last, asexual reproduction*, panel 4 (**asexual reproduction**) enlarges; panels 1–3 stay small beside it.
2. At *sends out runners*, a runner grows out from the parent plant along the soil line (motion), labelled **runner**; at *touches the soil*, roots grow down from its tip (motion); at *a new plantlet roots and grows*, the plantlet's leaves unfold (motion), labelled **plantlet**.
3. At *produced by mitosis from the parent's cells*, a dividing-cell miniature pulses along the runner into the plantlet (motion: one cell becomes two, repeated).
4. At *genetically identical to its parent*, set cards beside the parent plant and the plantlet match band for band (a thin accent line joins them); at *a clone, from one parent alone*, tag **clone**; beside the cards, small type *Simplified chromosome-set comparison; not this organism's chromosome number*.

**On-screen text:** *asexual reproduction*; *runner*; *plantlet*; *clone*; *schematic*.

---

### BEAT 9 · What I told you, on the chain and the strip · 5:39–6:11
**Narration:**
> So here it is, on the diagram you built. Replication in the S phase of interphase makes identical sister chromatids; separation in anaphase gives each daughter nucleus one copy of every chromosome; so the daughter cells are genetically identical. Growth, replacement, repair and asexual reproduction all rely on that. And the grazed knee? Its new cells came by mitosis, so they carry your genes.

**Visual action:** **No new slide.** The screen returns to the built layout: `IdenticalChain` above (parent card, the dividing cell at `cytokinesis` with its count strip, the two daughter cards, the chain strip), `ContextStrip` beneath with all four panels at equal size. Static. Key points fade in in place:
1. At *on the diagram you built*, the whole layout settles; nothing moves.
2. At *makes identical sister chromatids*, link 1 and the matching gene bands on the parent card brighten; at *one copy of every chromosome*, link 2, link 3 and the two daughter cards brighten, with the count strip *each daughter cell: 4 chromosomes · 4 DNA molecules*.
3. At *the daughter cells are genetically identical*, the converted sentence beneath the chain brightens.
4. At *Growth, replacement, repair*, the four panel titles brighten in turn, each panel's set card lighting with it.
5. At *And the grazed knee?*, panel 3's closed cut brightens and the Beat 1 hook caption returns small beside it; at *they carry your genes*, its set card brightens beside the daughter cards above.

---

### BEAT 10 · How it is asked, and the reject card · 6:11–6:41
**Narration:**
> How does this reach you? One structured question asked for two events that make daughter cells genetically identical: three marks, any three credited points, in November 2022, Paper 23. Multiple-choice items ask about the purpose of mitosis, and its roles in growth and repair. The reject card: the same number is not enough; each nucleus needs one copy of every chromosome.

**Visual action:**
1. At *How does this reach you?*, the `IdenticalChain` diagram stays on screen at right, reduced, from the first frame of the beat; a compact forms surface opens at left, one row per form, each beside its visual.
2. At *two events that make daughter cells genetically identical*, row 1: **identify and explain two cell-cycle events that produce genetically identical daughter cells** (small type *our framing*) · *w22_23 Q4(b), QP p11 / MS p16*; beneath it, first and kept visible, examples of accepted points: *identical sister chromatids · alignment at the equator · distribution to opposite poles*, headed *Examples of credit — alternatives, not a compulsory checklist* (small type *independently checked against the QP and MS in round-1/5.1.2/CHECK.md; question framings and summaries are our wording*); the chain strip at right brightens. At *three marks, any three credited points*, small type *3 marks, any three listed points*.
3. At *Multiple-choice items ask about the purpose of mitosis*, row 2: **purpose of mitosis** · *s22_12 Q17, key A*; at *its roles in growth and repair*, row 3: **roles of mitosis in growth and repair** · *s20_12 Q20, key C*; small type *independently checked against the QP and MS in round-1/5.1.2/CHECK.md; question framings and summaries are our wording*; the growth and repair panels of the `ContextStrip` appear small beside rows 2 and 3.
4. At *The reject card*, the reject card lands beneath the chain, struck through by hand: **✗** *the daughter cells are identical because each gets the same number of chromosomes* / **✓** *each daughter nucleus receives one copy of every chromosome, made by replication in the S phase of interphase: the same number and the same genetic information*; caption in small type *our wording contrast; not an examiner-reported error*. At *each nucleus needs one copy of every chromosome*, the ✓ line's *one copy of every chromosome* is ringed and the two daughter cards pulse. **Exit cue: end of *one copy of every chromosome*.** Final frame held 2 s: forms at left, the chain and reject card at right. No slogan.

**On-screen text:** the three forms with citations and labels; the examples-of-credit strip; the reject card and its caption.

---

## Datasets

No experimental dataset is used. The only numbers shown are the counting-convention counts (SHARED-SPECS §4), each with its compartment, and the tariff of the cited question.

| Beat | Stage (compartment) | Model cell (2n = 4): chromosomes · DNA molecules | Typical diploid human somatic cell |
|---|---|---|---|
| 3 | G1 (whole cell) | 4 · 4 | not shown |
| 3 | after S, G2 to metaphase (whole cell) | 4 (8 sister chromatids) · 8 | not shown |
| 3 | anaphase after separation (whole cell) | 8 daughter chromosomes · 8 | not shown |
| 3 | anaphase (one pole) | 4 · 4 | not shown |
| 4 | telophase before cytokinesis completes | whole cell 8 · 8; each new nucleus 4 · 4 | not shown |
| 4, 9 | each daughter cell | 4 · 4 | 46 per daughter nucleus |

Worked: 4 chromosomes × 2 sister chromatids = 8 DNA molecules after S; separation relabels 8 sister chromatids as 8 daughter chromosomes (8 DNA molecules, unchanged); 8 ÷ 2 poles = 4 per pole = 4 per new nucleus = parent's 4 (**4 = 4**, Beat 4). Human: 46 in the parent nucleus; 92 DNA molecules after S; 92 ÷ 2 = 46 per daughter nucleus (only the 46 is shown). w22_23 Q4(b): 3 marks, any three listed points, two events asked (A04).

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.23) | Beat(s) | How |
|---|---|---|
| explain the importance of mitosis | 1, 4, 6–9 | the problem (new cells must carry the same genetic information) posed in Beat 1; the importance stated in each context and in the recap |
| in the production of genetically identical daughter cells | 3, 4, 5, 9 | recall of replication in the S phase of interphase (5.1.3) and separation in anaphase (5.2.1); the chain to one copy of every chromosome per daughter nucleus; E5-06 |
| growth of multicellular organisms | 1, 6, 9 | root tip (division behind the root cap; elongation also contributes); growing human tissues |
| replacement of damaged or dead cells | 1, 7, 9 | outer skin layer and small-intestine lining, typically and continually replaced |
| repair of tissues by cell replacement | 1, 7, 9 | skin cut: mitosis supplies replacement cells; daughter cells differentiate where needed; which cells divide handed to 5.1.5 |
| asexual reproduction | 1, 8, 9 | strawberry runner → plantlet: a clone of one parent |
| topic introduction ("This ensures the genetic uniformity of all daughter cells.") | spine; 4 | the chain explains the syllabus's own statement |

### Mark-scheme and examiner points → beats

| Source | Point | Beat |
|---|---|---|
| w22_23 Q4(b), QP p11 / MS p16 (A04, PDF-VERIFIED summary; PDF-VERIFIED (round-1 check)) | identify and explain two events; 3 marks, any three of ten listed points; identical sisters (point 2), equatorial alignment (3), a chromatid from each chromosome to each cell (4), opposite-pole movement (6) among them; chromosomes/daughter chromosomes to the poles accepted; E5-06's corrected answer earns points 2, 6, 4 | 4, 5 (E5-06), 10 |
| G05 w22_23 Q4(b) row (G05's summary and check; authored inference) | replication → two copies; segregation → one equivalent set per nucleus; the result alone states the result | spine; 5 (the fault's framing, not quoted on screen) |
| s22_12 Q17, key A (PDF-VERIFIED key; stem PDF-VERIFIED (round-1 check)) | purpose of mitosis: growth of organisms; *repair of cells* is a distractor (the lesson says repair of tissues by cell replacement) | 7, 10 |
| s20_12 Q20, key C (PDF-VERIFIED key; stem PDF-VERIFIED (round-1 check)) | growth/repair roles: new root-tip cells, replacement of skin cells damaged by injury (its clonal-*selection* context is not changed or used) | 10 |
| Examiner reports | none for Topic 5 (EXAMINER-INSIGHT holds no Topic 5 sentence) | badge EXAM CONTRAST, Beat 5 |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, only, never, cannot, no, none, because, so, needs* was reread: true of all cases, or of the typical case?
- *they carry the same genetic information as the cell they came from* (1): the typical outcome of mitosis; the copying-error bound is spoken in Beat 4.
- *the DNA of each chromosome is replicated* (3): in the S phase of a cycling cell, the lesson's context. *because one is a copy of the other, they carry the same genes* (3): the plan's wording for identical sisters.
- *each pole receives one from every chromosome* (3), *two identical copies of every chromosome*, *one copy of every chromosome* (4, 5, 9, 10): the SHARED-SPECS §4 purpose chain for mitosis; the §4 "every" is the specification's own.
- *the same number as the parent nucleus, with the same genetic information, unless a copying error has occurred* (4): bounded, said once.
- *forty-six in a typical diploid human somatic cell* (4): §4's human reference, not every human cell.
- E5-06 (5): *would lose the marks* is the badge announce for this question (two events asked, three marks), not a claim about every question; *Nothing in it is false, and that is why it is tempting*: our teaching hypothesis about why the line is tempting, not examiner testimony; *it echoes the syllabus wording*: true (syllabus 5.1.2, quoted on the tab); *None of those points is in this line; it names no event at all*: a description of the card line; *crediting points such as*: "such as", from A04's summary, not the full list; the drawn examples are headed *Examples of credit — alternatives, not a compulsory checklist*, and the completed frame fills three credited rows (MS points 2, 6, 4) with no unfilled alignment tick; no prevalence.
- *Replacement goes on all the time* (7): typical, continuous replacement; not a rate claim.
- *the root lengthens as those cells also elongate, not by division alone* (6): bounds the root claim (SF4). *so a growing tissue is built of cells with the same genetic information* (6): the typical case.
- *continually worn away, and typically replaced* (7): typical, no figure. *where needed, the daughter cells then differentiate into specialised types* (7): the plan's replacement wording; no claim that every tissue is restored perfectly. *The same genes don't by themselves decide what a cell becomes* (7): the plan's sentence. *some cells specialise and stop dividing* (7): "some". *a mature human red blood cell has no nucleus and cannot divide* (7): human, mature; the inset shows an already mature cell with no nucleus from its first frame, separate from the skin-repair lineage, with no nuclear extrusion animated (its development: 5.1.5). (Round 1 M1 replaced the draft's *even loses its nucleus*.)
- *Its cells are all produced by mitosis from the parent's cells* (8): the plan's wording for a runner plantlet ("whose cells are all produced by mitosis"); *from one parent alone*: asexual reproduction by definition.
- *all rely on that* (9): the four syllabus contexts of this outcome.
- *the same number is not enough; each nucleus needs one copy of every chromosome* (10): the requirement for genetic identity, stated on the reject card; not a marking-point necessity claim.
- No sentence says a chromosome splits, sends an intact two-chromatid chromosome to a pole, places replication anywhere but the S phase of interphase, claims every cell keeps dividing, gives a replacement rate, says mitosis alone lengthens a root, or introduces meiosis.

---

## Citations

Every quotation, copied verbatim from the file named. Nothing is quoted from an exam PDF directly; none was opened by the author. Round-1 PDF checks are recorded below, paraphrased, never quoted.

| # | Quotation (verbatim) | Paper / session / question / page | Tag | Beat(s) | Copied from |
|---|---|---|---|---|---|
| 1 | 5.1.2 outcome text (header blockquote) | Syllabus 2025–2027, 5.1.2, p.23 | PDF-VERIFIED (plan check) | header | `SYLLABUS-9700-DETAIL.md` §5.1.2; `VERIFIED-EVIDENCE.md` (syllabus p23, exact) |
| 2 | "The mitotic cell cycle of eukaryotes involves DNA replication followed by nuclear division. This ensures the genetic uniformity of all daughter cells." | Syllabus 2025–2027, Topic 5 introduction, p.23 | PDF-VERIFIED (plan check) | spine; ledger | `SYLLABUS-9700-DETAIL.md` Topic 5 introduction |
| 3 | "production of genetically identical daughter cells" (on-screen syllabus tab) | Syllabus 5.1.2, p.23 | PDF-VERIFIED (plan check) | 5 | `SYLLABUS-9700-DETAIL.md` §5.1.2 |
| 4 | "Explain why daughter nuclei retain identical information through DNA replication followed by appropriate separation" | G05's summary of w22_23 Q4(b), MS p16 | G05's summary (not Cambridge wording) | spine | `GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md`; plan §5.1.2 |
| 5 | "Link replication to two copies and segregation to one equivalent set per nucleus. “Mitosis makes identical cells” alone states the result." | G05's check on w22_23 Q4(b) | G05's check (an authored inference; not Cambridge wording, not a candidate quotation) | spine | `GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md`; plan §5.1.2 |
| 6 | "explain" (command word, small type) | Syllabus 5.1.2, p.23 | PDF-VERIFIED (plan check) | 2 | `SYLLABUS-9700-DETAIL.md` |

Cited by demand, **not quoted**: w22_23 Q4(b), QP p11 / MS p16 ([machine-A archive](/home/dachu/sme-9700-archive/pastpapers/2022/November/9700_w22_ms_23.pdf#page=16)) — two events asked, 3 marks, any three listed points, identical sisters / alignment / equal distribution supported (**PDF-VERIFIED (plan check)**, A04, VERIFIED SUMMARY); s22_12 Q17, key A, purpose of mitosis, and s20_12 Q20, key C, growth/repair roles (MS p2; **PDF-VERIFIED (plan check)** keys). No mark-scheme wording is quoted anywhere in this lesson: none of the permitted exact MS lines concerns 5.1.2. The E5-06 card and the reject card are our composites / our wording, in italics, never in quotation marks.

**Formerly UNVERIFIED — resolved by the round-1 check (historical record kept):**
1. ~~`UNVERIFIED — verbatim stem of w22_23 Q4(b) (QP p11)`~~ → **PDF-VERIFIED (round-1 check)**: QP p.11 (`2022/November/9700_w22_qp_23.pdf`): genetically identical cells in developing whitefish; identify and explain two events in the cell cycle; 3 marks. Beats 5 and 10 show *our framing* (*Identify and explain two cell-cycle events that produce genetically identical daughter cells*), labelled so; not a verbatim quotation.
2. ~~`UNVERIFIED — the w22_23 Q4(b) marking points verbatim (MS p16)`~~ → **PDF-VERIFIED (round-1 check)**: MS p.16 (`9700_w22_ms_23.pdf`): ten listed points, any three; point 1 semi-conservative replication; 2 identical sister chromatids/DNA molecules; 3 equatorial alignment; 4 each cell receives a chromatid from each chromosome; 6 movement to opposite poles (chromosomes/daughter chromosomes allowed); 5 and 7–10 centromere/spindle/checkpoint/error-prevention routes. Paraphrased by the checker; not quoted here.
3. ~~`UNVERIFIED — stems of s22_12 Q17 and s20_12 Q20`~~ → **PDF-VERIFIED (round-1 check)**: s22_12 QP p.7 / MS p.2: purpose of mitosis, key A growth of organisms (alternatives include genetic difference, repair of individual cells, replacement of cancerous tissue); s20_12 QP p.8 / MS p.2: Venn of clonal selection of T-lymphocytes, new root-tip cells, replacement of skin cells damaged by injury, key C.

On-screen status line wherever a source warning stood: *Independently checked against the QP and MS in round-1/5.1.2/CHECK.md. Question framings and summaries are our wording.* No UNVERIFIED text remains on student-facing cards.

**Round-1 verification sources for M1 (checker's, not student content):** [Dynamics of human erythroblast enucleation](https://pubmed.ncbi.nlm.nih.gov/19043811/); [Protein Distribution during Human Erythroblast Enucleation In Vitro](https://pmc.ncbi.nlm.nih.gov/articles/PMC3614867/). Nuclear extrusion occurs during differentiation, before the mature red-cell state.

---

## Word count and runtime

Counted by the validator over the blockquoted narration (silent-read and correction marker lines excluded; hyphen and en-dash compounds count once). Seconds = words ÷ 120 × 60.

| Beat | Title | Kind | Words | Seconds |
|---|---|---|---:|---:|
| 1 | Hook and context | teaching | 81 | 40.5 |
| 2 | What you will be able to do | teaching | 41 | 20.5 |
| 3 | Recall: copy in S, share in anaphase | teaching | 86 | 43.0 |
| 4 | Why the daughter nuclei are identical | teaching | 99 | 49.5 |
| **5** | **EXAM CONTRAST E5-06** (talk-through 92 words, 46 s) | **error** | **149** | **74.5** |
| 6 | Growth | teaching | 66 | 33.0 |
| 7 | Replacement and repair | teaching | 102 | 51.0 |
| 8 | Asexual reproduction | teaching | 53 | 26.5 |
| 9 | Recap | teaching | 64 | 32.0 |
| 10 | How it is asked, and the reject card | teaching | 61 | 30.5 |
| **Teaching (9 beats)** | | | **653** | **326.5 (5:26.5)** |
| **Error (1 beat)** | | | **149** | **74.5 (1:14.5)** |
| **Total (10 beats)** | | | **802** | **401.0 (6:41)** |
| Budget | | | 780 | 390 (6:30) |

**Length, honestly:** **802 words = 6:41**, **11 s (22 words, +2.8 %) over** the 6:30 budget, inside the ±5 % window (741–819 words). Round 1: M1 added two words in Beat 7 (*even loses its nucleus* → *has no nucleus and cannot divide*); the SF4 reframings in Beats 5 and 10 are word-neutral; the round-1 check accepted the draft 6:40 and this 6:41. Teaching is 653 words = 5:26.5 against the 5:20 allowance (+6.5 s); E5-06 is 149 words = 74.5 s against its planned 70 s, inside the 130–150-word (65–75 s) window, with a 92-word (46 s) talk-through; it is not thinned. The prescribed 4 s silent read is not added again. **Cut list, optional (the check does not require it); if the conductor wants the nearest to 6:30** (−20 words, −10 s, giving 782 words = 6:31, no error-beat change): (1) Beat 1, the clause *a strawberry plant even makes whole new plants from its runners* (−11; panel 4 then fills silently at *new cells come from a cell dividing*); (2) Beat 3, the opening sentence *Two things you have met already do the work.* (−9; the recall surface enters on the first frame). Never faster narration.

---

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| Which cells do the dividing in replacement and repair; stem cells, self-renewal, differentiation pathways, bone marrow | 5.1.5 (handed off by label in Beat 7) |
| Mutation, copying errors beyond one bounded clause, variation, tumours | 5.1.6 (Beat 4 small type) |
| Stage-by-stage chromosome, envelope, membrane and spindle behaviour; the plant cell plate in detail; the nucleolus | 5.2.1 (recalled by label in Beat 3; shown, not narrated, in Beat 4) |
| The cycle's phases in full, the DNA-content graph's reading, the per-nucleus variant | 5.1.3 (recalled by label in Beat 3) |
| Replication mechanism, bases, enzymes | 6.1.4 (caption only) |
| Chromosome structure and the counting convention's teaching | 5.1.1 |
| Meiosis contrast, cloning technology, potency terms, cell-cycle control proteins | not in the outcome (plan scope ceiling; calibration DO-NOT-ADD) |
| Replacement rates, cell lifespans, wound-healing stages | not needed; no uncited figure is stated |
| s20_12 Q20's clonal-*selection* context | not used (the item is cited by key and demand only) |

## Reusable models established here

| Model | For |
|---|---|
| **`ContextStrip`** (four panels: growth — root tip with division band and elongation, growing human outline; replacement — outer skin layer and small-intestine lining; repair — skin cut closing, differentiation, separate inset of an already mature human red blood cell with no nucleus from its first frame (caption *mature human red blood cell: no nucleus; cannot divide*; no extrusion animated; not part of the skin lineage; its development belongs to 5.1.5); asexual reproduction — strawberry runner and plantlet; a matching set card beside new cells in every panel, compared within each example only, labelled *Simplified chromosome-set comparison; not this organism's chromosome number*; skin cards at the stage when daughter cells form, never in a shed dead cell) | 5.1.5 (replacement and repair panels recalled by label as its starting point); 5.1.6 (the balanced replacement panel as a healthy tissue maintaining its size) |
| **`IdenticalChain`** (parent set card → `MitosisCellModel` anaphase-to-cytokinesis → two daughter set cards; three-link chain strip *copy · share · result*) | the 5.1.2 notes; any later lesson explaining *identical* (SHARED-SPECS §4 purpose chain) |
| **Set cards** (four C1–C4 rods or Xs with gene bands at fixed positions; *drawn condensed for comparison*) | 5.1.5, 5.1.6 (the mutated-gene star is 5.1.6's, not used here) |
| The handle *copy, then share one of each* and its converted sentence | the 5.1.2 notes |

## Assets

| Asset | Status | Source |
|---|---|---|
| `ChromosomeModel` states, zoom Z0, gene bands, count overlay | reuse | 5.1.1 |
| `CellCycleWheel`, `DNAContentGraph` per-cell | reuse | 5.1.3 |
| `MitosisCellModel` animal (`metaphase` → `cytokinesis`) and plant miniature | reuse | 5.2.1 |
| `IdenticalChain` layout, set cards, chain strip | **new build** | authored, schematic |
| `ContextStrip` four panels (knee graze, root tip, human outline, skin and gut lining strips, skin cut, separate mature human red-blood-cell inset (no nucleus from its first frame; no extrusion animated), strawberry plant with runner) | **new build** | authored vector, schematic; no photograph, no generated image |
| Objectives surface pictograms (one-to-two circles, stacked sheets, split arrow, sprouting root, layered tile, plaster, strawberry) | new | authored flat line icons |
| EXAM CONTRAST panel; E5-06 card (our composite) and header (our framing); forms surface; reject card | shared panel and surfaces; new card content | existing panel; authored |
| Photographs, micrographs, Cambridge artwork | none | — |

---

## Validator run

`python3 work/007/validate_storyboard.py storyboards/topic-05/5.1.2/STORYBOARD.md` (after round-1 fixes)

```
beat  words  cues maxgap  status
   1     81     9     14  ok  
   2     41     3     14  ok  
   3     86    11     15  ok  
   4     99    14     12  ok  
   5    149    17     15  ok  talk-through 92 w
   6     66     9     13  ok  
   7    102    14     12  ok  
   8     53     7     12  ok  
   9     64     7     12  ok  
  10     61     8     11  ok  
TOTAL words 802  cues 99  runtime at 120 wpm 6:41.0  beats 10  failing beats 0
```

`python3 work/007/check_quotes.py storyboards/topic-05/5.1.2/STORYBOARD.md`

```
quotes checked 12  not found 0
```

---

## CHECK RESPONSE (round 1)

Response to `round-1/5.1.2/CHECK.md` (verdict NOT CLEARED) and the round README's cross-cutting rules. Narration changed only in Beat 5 (announce, word-neutral), Beat 7 (+2 words) and Beat 10 (word-neutral); E5-06's 92-word talk-through and 31-word correction are unchanged. Italic strings below are this storyboard's own wording or the checker's replacement text; the checker's double-quoted captions are set in italics here because only permitted-source text may carry double quotation marks.

| Item | Ruling | Where applied | Exact action taken |
|---|---|---|---|
| **M1** Mature human red blood cell already lacks a nucleus | applied verbatim | Beat 7 narration and action 7; `ContextStrip` panel 3; typicality rules; absolutes sweep; Reusable models; Assets; Citations (verification sources) | Narration *a mature human red blood cell even loses its nucleus* → the checker's clause: *…some cells specialise and stop dividing; a mature human red blood cell has no nucleus and cannot divide.* (+2 words; Beat 7 100 → 102). The checker's inset specification pasted verbatim into `ContextStrip` and Beat 7 action 7 (already mature, no nucleus from its first frame; caption *mature human red blood cell: no nucleus; cannot divide*; separate from the skin-repair lineage; no nuclear extrusion animated; development belongs to 5.1.5). The two PubMed/PMC sources recorded as checker verification sources, not student content. |
| **M2** E5-06 final display must match its sufficient answer | applied verbatim | Beat 5 actions 7, 8, 10, 11, 12 and on-screen list; Beat 10 action 2; absolutes sweep; MS ledger | Empty three-tick checklist removed. Action 7: three example labels *identical sister chromatids*, *alignment at the equator*, *distribution to opposite poles* under *Examples of credit — alternatives, not a compulsory checklist*. Action 8: missing explanation ringed; two empty event slots kept at *it names no event*. Actions 10–12: examples strip replaced by *Three credited points in this answer*; rows filled at clause completion: *identical sister chromatids — MS point 2*, *sister chromatids move to opposite poles — MS point 6*, *one chromatid of each chromosome reaches each daughter cell — MS point 4*; set-card link kept; marker clears only then; caption *One sufficient answer: two events, three credited points. Other routes are accepted.*; no unfilled alignment tick. Bare *DNA is replicated* not assigned MS point 1. Beat 10 shows the same three as examples of accepted points. Talk-through (92) and correction (31) narration unchanged. |
| SF1 Label the comparison abstraction | applied | `ContextStrip` spec; Beats 1, 6, 7, 8 | Small type *Simplified chromosome-set comparison; not this organism's chromosome number* beside set cards; *same set* kept local to parent/new cells within one example; Beat 6's accent line joining plant/human cards to the `IdenticalChain` card removed. Beat 4's model/human distinction retained. |
| SF2 Explicit replay resets | applied | Beat 5 actions 1, 9, 10, 11, 12 | At EXAM CONTRAST entry the dimmed model resets to a labelled **Replay** metaphase state (four replicated chromosomes); correction's S-phase replay is a separately labelled **S-phase replay** inset; the central metaphase model then runs forwards through separation and daughter-nucleus formation. Counts in the replay change on the centromere-division frame and the envelope-closing frame (cross-cutting rule). No reversal of daughter cells; no chromosome divided twice. |
| SF3 Nuclear comparisons at the right stage | applied | `ContextStrip` panel 2; Beat 7 action 3 and on-screen list; typicality rules | Set cards beside newly formed daughter cells in the lower layer, caption *same information when the daughter cells form*; no set card, nucleus or chromosome set in a shed outermost dead skin cell. |
| SF4 Use the actual exam demand | applied | Beat 5 narration and action 2; Beat 10 narration, action 2 cue and row 1 | Header now *Identify and explain two cell-cycle events that produce genetically identical daughter cells.*, labelled *our framing*. Beat 5 announce *why are the daughter nuclei genetically identical?* → *which two events make identical daughter cells?* (7 → 7 words; Beat 5 stays 149). Beat 10 *daughter nuclei genetically identical* → *daughter cells genetically identical* (word-neutral; cue remapped). |
| SF5 Remove resolved source warnings | applied | Beat 5 actions 1, 2, 7; Beat 10 actions 2, 3; spine paragraph; authorities line; MS ledger; Citations | Student-facing UNVERIFIED strings replaced by *Independently checked against the QP and MS in round-1/5.1.2/CHECK.md. Question framings and summaries are our wording.* Citations' UNVERIFIED list kept struck through as history, each item tagged **PDF-VERIFIED (round-1 check)** with the checker's page references (paraphrased, not quoted). Author's statement that no PDF was opened retained. |
| SF6 Preserve s22_12 Q17's distinction | applied (no narration change needed) | MS ledger; spine paragraph | Narration already says *Repair is replacement after damage* and never *mitosis repairs cells*; ledger notes *repair of cells* is a distractor. |
| Runtime | accepted by checker | Word table; beat headings 7–10; length statement; cut list | 800 → **802 words = 6:41** (teaching 653 = 5:26.5; E5-06 149 = 74.5 s, talk-through 92). Beats 7–10 re-timed. Cut list marked optional (−20 words → 6:31). |
| check_quotes.py | note | — | The checker could not run it (GATE-CRITERIA file missing in its checkout); it runs here: `quotes checked 12  not found 0`. |
