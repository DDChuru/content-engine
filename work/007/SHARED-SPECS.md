# Cloud run 007 — shared specifications for the eight Topic 5 storyboards

Fixed before the eight storyboards are written in parallel, so that 5.1.1, 5.1.2, 5.1.3, 5.1.4,
5.1.5, 5.1.6, 5.2.1 and 5.2.2 agree with each other, with the plan and with the cleared Topic 3
storyboards (`cloud-inputs/006/examples/3.1.3/STORYBOARD.md`, `cloud-inputs/006/examples/3.2.1b/STORYBOARD.md`).
Where this file and `plan/topic-05/TOPIC-PLAN-05-CELL-CYCLE.md` differ, **the plan wins**; report the conflict.
**Revised 27 Sep to apply the plan check (`cloud-checks/007/plan/CHECK.md`, MUST-FIX 1–6 and should-fixes);
the plan's `## CHECK RESPONSE (plan)` table lists every change.**

## 1. Naming and files

- Lessons are referred to ONLY by syllabus code — 5.1.1, 5.1.2, 5.1.3, 5.1.4, 5.1.5, 5.1.6, 5.2.1, 5.2.2 —
  in narration, on-screen text, tags and ledgers. Never "L1", "lesson 3", "last lesson". Narration
  normally needs no code at all ("when we looked at the cell cycle"); on-screen recall tags use the
  code, e.g. *recall: 5.1.3*.
- Output: `storyboards/topic-05/<code>/STORYBOARD.md`. Nothing else is written by a storyboard author.
- No AI model names or identifiers anywhere. Header line: **"Storyboard, first draft. Cloud run 007, 27 September 2026."**
- Validator: `python3 work/007/validate_storyboard.py storyboards/topic-05/<code>/STORYBOARD.md` must end
  with `failing beats 0`. Quote check: `python3 work/007/check_quotes.py storyboards/topic-05/<code>/STORYBOARD.md`
  (exit 0 = every double-quoted string of 4+ words is found in a permitted source, which now include
  `work/007/VERIFIED-EVIDENCE.md`). Paste both outputs into the storyboard's *Validator run* section.

## 2. Format (mirror the cleared Topic 3 storyboards exactly)

Header (title; draft line; syllabus page p.23; command word(s); budget with beats and error beats from
the plan; outcome **verbatim** in a blockquote; authorities read; build position; models used / published)
→ *The causal spine* (with "What the mark schemes credit, quoted", the handle and its converted sentence,
typicality rules, error-beat list with badges) → *The models, specified once* → *Beat by beat* →
*Datasets* (where any number is shown; every derived number worked) → *Scope ledger* (syllabus → beats;
mark-scheme/examiner points → beats; absolutes sweep) → *Citations* (every quotation with
paper/session/question/page, the file it was copied from, and its tag; every `UNVERIFIED — …` listed)
→ *Word count and runtime* (per-beat table: words, seconds = words ÷ 120 × 60;
teaching vs error subtotals; budget comparison; overrun honestly stated with a cut list) → *What I left
out, and who owns it* → *Reusable models established here* → *Assets* → *Validator run*.

Beat syntax the validator reads:

```
### BEAT 7 · Title · 4:12–4:58
**Narration:**
> spoken text …
>
> more spoken text …

**Visual action:**
1. At *exact narration substring*, what appears …; at *another substring*, …
2. **Entry cue: *substring*.** … **Exit cue: end of *substring*.**

**On-screen text:** …
```

Error beats: the heading contains the badge (`### BEAT 9 · EXAM CONTRAST: … · 6:10–7:20`), and the
narration contains, in order, the announce + show lines, then `> *(silent read, 4 s)*`, then the
talk-through, then `> *(correction)*`, then the correction narration. The validator counts the
talk-through (between the two markers) — **≥ 90 words** (≥ 45 s) — and the whole beat — **130–150 words**
(65–75 s at the effective 120 wpm).

Cues are the italic strings after `At`/`at`/`cue:`/`end of`. Each must be an exact (case-sensitive)
substring of that beat's narration, occur only once in it (case-insensitive), and be listed in spoken
order. **No stretch of more than 30 words** (beat start → first cue, cue → cue, last cue → end) without a
cue. Do NOT italicise other text immediately after the word "at" in visual actions, or the validator
reads it as a cue. Authored wording (labels, our framings, wrong/right card lines) goes in **bold** or
*italics* or single quotes — **never in double quotation marks**, which are reserved for verbatim
source quotations (the quote checker reads every double-quoted string of 4+ words).

## 3. Evidence rule (hard)

- Quote ONLY from: `work/007/VERIFIED-EVIDENCE.md` (what the plan check read in the PDFs),
  `cloud-inputs/007/evidence/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md` (G05),
  `cloud-inputs/007/evidence/EXAMINER-INSIGHT-9700.md`, `cloud-inputs/003/standards/SYLLABUS-9700-DETAIL.md`
  (syllabus wording), and the plan/weights where they reproduce those. Copy verbatim, with paper /
  session / question / QP and MS page as the weights ledger gives them.
- **Tags.** **PDF-VERIFIED (plan check)** for the exact wordings and the verified tariffs/keys/demands in
  `VERIFIED-EVIDENCE.md`; **PDF-UNCHECKED** for any other exam wording; `UNVERIFIED — <what is needed>`
  for anything the evidence does not hold (MCQ stems, most marking points verbatim, the Topic 1
  microscope component, the licensed photomicrograph set).
- The only Cambridge wordings you may put in quotation marks as mark-scheme text: “I ref. to replication
  or cytokinesis” (w20_21 MS p6); “R more than one stage given for either E or F” (s21_22 MS p7);
  R “nuclear membrane”, R “cell plate” (w22_23 MS p15); R “daughter chromatids”, I “kinetochore”
  (s23_21 MS p15); “kinetochore” accepted (s21_22 MS p7); A “nuclear membrane(s)” (s23_21 MS p8); and
  the Learner Guide's “Detail is not required.” (PDF p15). G05's other sentences are shown as
  **G05's summary** — e.g. *G05: "Locate replication in S phase of interphase"* — never presented as
  Cambridge's wording or as a candidate's answer; G05's checks ("Commit to a stage…") are authored
  inferences.
- Question framings are labelled *our framing of …*, never shown as the paper's words (we hold no stems).
  Never state a prevalence the evidence does not state ("many candidates…"): there is no Topic 5
  examiner-report sentence.
- SaveMyExams is a content ceiling only. Never cite it, never copy its structure.
- Source paths: QP/MS links use the machine-A archive (`/home/dachu/sme-9700-archive/pastpapers/…`), as in
  the weights ledger.

## 4. Topic-wide conventions (every sentence, every lesson)

**Counting.** Count chromosomes by counting centromeres. Before DNA replication, a chromosome contains one
long DNA molecule associated with histone proteins. After replication, it contains two sister chromatids,
each with its own DNA molecule associated with histones — still ONE chromosome. When the centromere
divides in anaphase, each separated chromatid has its own centromere and is a **daughter chromosome**.
Counts must state their compartment: whole cell, one pole, one nucleus or one daughter cell. In telophase
before cytokinesis is complete, the model has eight chromosomes in the whole cell but four in each new
nucleus. Use the DNA-molecule counter throughout; after sister separation, relabel the separated units
as daughter chromosomes rather than implying their DNA has disappeared. A typical diploid human somatic
cell is the human reference, not every human cell.

| Stage (compartment) | Model cell (2n = 4) chromosomes | DNA molecules | Typical diploid human somatic cell: chromosomes | DNA molecules |
|---|---:|---:|---:|---:|
| G1 (whole cell) | 4 | 4 | 46 | 46 |
| after S: G2, prophase, metaphase (whole cell) | 4 (8 sister chromatids) | 8 | 46 (92 chromatids) | 92 |
| anaphase after separation (whole cell) | 8 daughter chromosomes | 8 | 92 | 92 |
| anaphase (one pole) | 4 | 4 | 46 | 46 |
| telophase before cytokinesis completes (whole cell) | 8 | 8 | 92 | 92 |
| each new nucleus / each daughter cell | 4 | 4 | 46 | 46 |

**Wording.**
- Anaphase: At anaphase, the centromeres divide and sister chromatids separate to opposite poles. Once
  separated, each is a daughter chromosome. Use "sister chromatids separate" when explaining the
  transition; "daughter chromosomes move to opposite poles" is also correct. The error is sending an
  intact two-chromatid chromosome to a pole, not using the word chromosome after separation. Do not
  introduce a meiosis comparison here. "Splits" only of the centromere; never "the chromosome splits in
  half". Say **poles**, not unqualified "sides".
- Prophase: chromosomes **condense** (shorten and thicken) and **become visible**; never "form",
  "appear from nowhere" or "replicate" in prophase. The nucleolus disappears during prophase.
- **Nuclear envelope** is the taught term (syllabus word); "nuclear membrane" appears only as the word
  under discussion in E5-03, and that reject is local to w22_23 (s23_21's organelle table accepted it).
- **Mitosis** = nuclear division; **cytokinesis** = division of the cytoplasm; the **mitotic cell cycle**
  = interphase (G1, S, G2) + mitosis + cytokinesis. Defined as distinct processes; cytokinesis commonly
  begins in late mitosis, so never state that they cannot overlap.
- Replication location: the **S (synthesis) phase of interphase** — full phase name, never a bare "S".
- Spindle fibres (microtubules) attach at the **centromere**; "kinetochore" may appear once as an
  alternative on-screen label for the attachment region, never required.
- Animal cytokinesis: the **cell surface membrane** pinches in (cleavage furrow). Plant: vesicles fuse at
  the equator into a **cell plate**, which becomes the new cell walls. Plant cells typically have no
  centrioles and still form a spindle.
- Typical, not universal: "interphase is typically the longest part of the cycle"; "a typical diploid
  human somatic cell"; "usually more than one mutation"; "one daughter can remain a stem cell" (*one
  possible pattern*); "in typical dividing somatic cells, telomeres shorten"; "in a healthy adult tissue
  that is maintaining its size".
- Not every cell keeps dividing: some cells specialise and stop dividing; mature human red blood cells
  lose their nuclei. Genetic identity does not itself specify a cell's specialised function.

**Mitosis purpose chain (5.1.2, and wherever "identical" is explained):** DNA replicated in the S phase of
interphase → two identical sister chromatids per chromosome → the sister chromatids of every chromosome
separate to opposite poles in anaphase → each daughter nucleus receives one copy of every chromosome →
same number of chromosomes, same genetic information as the parent nucleus. This is a sufficient route
through w22_23 Q4(b) (two events asked, any three points), not a claim that every link is required.

**No covalent chemistry in Topic 5.** Keep replication schematic, without bases or nucleotide chemistry.
Animate progress across S in synchrony with the rising DNA-content trace, then change to the completed
two-sister state. Caption this as a schematic account of replication during S; detailed replication is
taught in 6.1.4. The final state change marks completion, not instantaneous duplication of the entire
genome. No bond edits.

## 5. Shared models (identical in every lesson — same geometry, colours, labels, state ids)

Colour tokens (drawn models only; the squash and photomicrographs use real stain colours, §6):
- chromosome hues: **C1 long = deep blue**, **C2 long = teal**, **C3 short = amber**, **C4 short = green**.
  Colour means *which chromosome*; never parental origin; homologous pairs are never named.
- telomeres: **grey** schematic blocks; gene bands: **white bands with a thin dark outline**, labelled
  *gene*; the mutated gene band (5.1.6 only): white band with a **black star** marker (never terracotta).
- histone proteins: **pale yellow beads**; DNA: a dark line (Z1) or plain two-strand helix strip (Z2).
- centromere: a constriction with a small dark dot.
- nucleolus: a darker grey disc inside the interphase nucleus.
- **terracotta is reserved for the error marker** (COMMON MISTAKE / EXAM CONTRAST); nothing else uses it.
- normal accent for highlights and rings: the house accent (not terracotta).

### `ChromosomeModel` (published by 5.1.1)
State ids: `unreplicated-extended`, `unreplicated-condensed` (a single rod with centromere and two
telomeres), `replicating` (schematic progress along the molecule, used only in S), `replicated-extended`,
`replicated-condensed` (X shape: two sister chromatids joined at one centromere; telomeres at all four
ends), `separated` (after the centromere divides: two **daughter chromosomes**, each one chromatid with its
own centromere). Zoom levels: `Z0` whole chromosome; `Z1` one chromatid with DNA wound round histone beads
(label *histone proteins*; no "nucleosome"); `Z2` a plain two-strand helix strip (label *DNA*; no bases).
Gene bands: two bands at fixed positions on every chromatid, identical on sister chromatids. Labels (SVG
text nodes): *DNA*, *histone proteins*, *sister chromatids*, *chromatid*, *centromere*, *telomere*, *gene*,
*chromosome*, *daughter chromosome*. Count overlay: *chromosomes (count centromeres)*, *DNA molecules*,
and a **compartment tag** (*whole cell* / *one pole* / *one nucleus* / *one daughter cell*). Transitions:
extended ↔ condensed is continuous coiling MOTION; replication per §4 (progress across S, then the
completed state; caption *schematic account of replication during S; detailed replication in 6.1.4*);
`replicated → separated` switches in ONE rendered frame at the narration's *centromere divides*, the
separated units are relabelled *daughter chromosome* on that frame (DNA-molecule count unchanged), and
they then MOVE apart, centromere leading (in this schematic, the arms trail behind the leading
centromere; real chromosomes may look U- or V-shaped).

### `CellCycleWheel` (published by 5.1.3)
Ring, clockwise from 12 o'clock: **G1** (widest arc), **S**, **G2**, **M** (mitosis), **C** (cytokinesis);
a bracket spanning G1–S–G2 labelled **interphase**; caption *schematic proportions — interphase is
typically the longest part*. A travelling marker; a `ChromosomeModel` inset (one C1 chromosome). G1 shows
an unreplicated extended chromosome; S shows replication progressing; G2 shows the replicated extended
state. Within M, the inset condenses, aligns, separates at anaphase and decondenses at telophase. C shows
division of the cytoplasm around the two already formed chromosome sets. Separation must not first occur
in the C arc. No G0 arc, no checkpoint marks, no proteins. **Added by the owner, 5.1.3 (phase-2 review):** named M sub-states `m-condense`, `m-align`, `m-separate`, `m-decondense`; from `m-align` the inset carries its own minimal spindle elements (two small pole marks, thin spindle-fibre lines to the centromere, a faint dashed equator) so the wheel can show spindle formation and poleward movement before `MitosisCellModel` exists. The full spindle belongs to `MitosisCellModel`.

### `DNAContentGraph` (published by 5.1.3)
The per-cell graph is the teaching trace. y: **DNA mass per cell / arbitrary units** (ticks 0, 1, 2
only); x: **time** (no values). G1 flat at 1; S a rise from 1 to 2, drawn straight, with the note *slope
schematic — not a constant replication rate*; G2 and M flat at 2; a vertical drop to 1 when cytokinesis
divides the cell; optionally a second cycle. Phase bands shaded beneath, aligned to the wheel's labels.
Caption *schematic; not measured data*. Named variant `per-nucleus` (y **DNA mass per nucleus / per
chromosome set**): the open-mitosis interval (no intact nucleus) is hatched and labelled *schematic —
no intact nucleus*, and the value drops when the two new nuclei form.

### `TelomereEndModel` (published by 5.1.4)
One chromatid end at Z2-like scale: two gene bands, then a telomere drawn as **grey schematic blocks**
(the run labelled *telomere: repeated, non-coding DNA*; optional label *repeat in humans: TTAGGG* on the
run, not on one block). The grey blocks are arbitrary schematic lengths, not individual TTAGGG repeats or
a measured loss per division. A replication-round counter. Each round the molecule is copied and the
**daughter molecule's endpoint is shorter** — the new copy is drawn growing along the template and
stopping short (MOTION); gene bands untouched. Do not depict a detached block being cut off an intact
chromosome. Caption *schematic shortening; amount not to scale*. Thought-experiment state `no-telomere`:
caption *thought experiment — not a real chromosome* on screen throughout; over successive rounds the
shortening endpoint reaches the end gene band; then the model returns to the real state.

### `MitosisCellModel` (published by 5.2.1)
Two variants, same chromosome set (2n = 4: C1–C4 hues) and same stage ids: `interphase`, `prophase-early`
(condensing inside an intact envelope; nucleolus fading), `prophase-late` (envelope fragmenting, nucleolus
gone, spindle forming), `metaphase`, `anaphase`, `telophase` (envelopes re-forming, nucleolus reappearing
in each new nucleus, chromosomes decondensing), `cytokinesis`.
- **animal**: round cell; cell surface membrane; nuclear envelope as a double line (fragments as MOTION,
  re-forms as MOTION); nucleolus; two centrosomes each with a pair of centrioles, moving to the poles in
  prophase; spindle microtubules pole → centromere; cleavage furrow drawn in by the cell surface membrane.
- **plant**: rectangular cell wall with the cell surface membrane just inside; nucleolus; no centrioles;
  spindle from the poles; vesicles gathering at the equator and fusing into a cell plate, which becomes
  the new cell walls with membrane on each side.
- Count strip beside the cell: *chromosomes · DNA molecules · compartment* updating at each stage per §4
  (telophase before cytokinesis: *whole cell 8 · each new nucleus 4*).
- Nucleolus: Topic 1 recall only; no ribosome re-teaching, no sub-stages of mitosis.

### `RootTipSquashRig` and `FieldOfViewSchematic` (published by 5.2.2) — see §6.
### `StemCellLineage` (5.1.5) and `TissueGrowthModel` (5.1.6) — as the plan specifies; owned by those lessons.
`StemCellLineage` is captioned *one possible pattern*; the differentiating daughter passes through drawn
intermediate stages to a **human** red blood cell that loses its nucleus. `TissueGrowthModel` opens on a
healthy adult tissue maintaining its size.

### From Topic 1 (by labelled recall only)
The light-microscope model and handling standard (low power first; coarse focus only at low power; fine
focus at high power). Its registered component name is `UNVERIFIED — not in this run's inputs`;
storyboards call it *the Topic 1 light-microscope model*.

## 6. The root-tip squash and image interpretation (5.2.2; recalled by label anywhere else)

- **Photomicrographs are mandatory.** Teach with diagrams and at least one sourced, licensed real
  photomicrograph set showing the relevant stage features, plus the slide-preparation/viewing
  demonstration. A schematic supports interpretation but cannot replace photomicrograph coverage. Record
  source, licence, organism and stain before the storyboard is cleared for production
  (`UNVERIFIED — licensed root-tip squash photomicrograph set: source, licence, organism, stain`). Never
  generate or fake one; storyboard the beats against a placeholder labelled with that UNVERIFIED line.
- **Decision sequence:** Examine cell boundaries and the number and positions of nuclei/chromosome groups
  first. A clearly resolved single nucleus with diffuse chromatin supports interphase; two reforming
  nuclei within one dividing cell support telophase/cytokinesis. Use chromosome arrangement to distinguish
  prophase, metaphase and anaphase, allowing for viewing angle. If resolution or overlap prevents a
  justified identification, say so; lack of visible detail alone does not prove interphase. Do not demand
  a spindle or a resolved nuclear-envelope double line in every light micrograph (s21_22 says its
  microtubules are not visible); a metaphase plate seen from another orientation may not look like the
  model's straight line.
- **Sample and REAL-WORLD SAMPLES answers (must be spoken):** garlic (*Allium sativum*) cloves stood in
  water until roots grow. What the stain responds to: toluidine blue stains chromatin deep blue. Toluidine
  blue reveals chromatin in interphase nuclei as well as condensed mitotic chromosomes; staining alone
  does not identify a dividing cell. We identify stages from the arrangement of visible chromosomes and
  nuclei. Fit: the meristem just behind the root cap is a region of active mitosis; garlic has relatively
  few, large chromosomes; no chlorophyll competes with the stain. Limits: The small sampled tip includes a
  root cap: select the meristem behind it, rather than assuming every cell in the terminal piece is
  dividing; an unspread squash hides chromosomes.
- **Method (fixed; SAPS fresh-garlic method, no splicing):** Use the SAPS fresh-garlic method:
  pre-equilibrate 1 mol dm⁻³ HCl at 40 °C for 15 minutes. Support the clove so its roots enter the acid;
  start the five-minute treatment timer at contact. Remove and rinse the roots. Cut the terminal 3 mm onto
  a watch glass; stain for two minutes with one drop of 1% aqueous toluidine blue. Remove excess stain and
  rinse. Transfer gently with a paintbrush to a clean slide, add water and tease apart with a mounted
  needle. Lower the coverslip; wrap the slide in paper towel and press gently vertically on a flat
  supported surface, without sliding or twisting. Locate the meristem at low power, then inspect
  chromosomes at high power. Eye protection, careful handling of acid and sharp tools, and gentle pressure
  to avoid broken glass remain visible precautions.
- **Timers and compression:** the treatment timer starts on the frame the roots contact the acid, never
  reset; the 15 min pre-warm, 5 min treatment and 2 min stain are shown time-compressed with a visible
  *time compressed* tag, never in real time.
- **Why the acid:** Acid treatment softens the material between neighbouring cells, helping stain
  penetration and allowing the cells to spread into a thin layer. These are prepared specimens; do not
  animate living mitosis continuing under the coverslip or describe acid contact as instantaneous
  fixation.
- **Real colours:** Show dark-blue chromatin with a paler background, checked against the selected
  toluidine-blue preparation. Colours and contrast vary with preparation; identify stages by structure,
  not hue. Do not use a differently stained reference as the colour standard for this preparation. Roots
  start creamy white; stain darkens in place (intensity only); nothing passes through an unrelated colour.
- **Hazards:** warm 1 mol dm⁻³ HCl (eye protection, no skin contact, container supported in the bath,
  never held over a face); toluidine blue stains skin and clothing (gloves); blade and mounted needle
  away from fingers; gentle vertical pressure to avoid broken glass.
- **Time plan (11:00, a feasible allocation to test):** real-image and diagram interpretation ≈ 3:00;
  edited demonstration ≈ 3:30; counting ≈ 1:15; E5-05 1:10; framing, objectives, recap, exam close ≈ 2:05.
- **`FieldOfViewSchematic`:** a circular field of exactly **60** closely packed square plant cells built
  from simplified `MitosisCellModel` plant states, in the real stain colours; a marked counting boundary
  containing all 60; captions *schematic drawing — not a photomicrograph* and *chromosome drawings
  simplified; not the garlic karyotype (2n = 16)*. The 2n = 4 teaching cell is a simplified model, not a
  literal garlic karyotype. Fixed composition: **interphase 51, prophase 4, metaphase 2, anaphase 1,
  telophase 2** → 51 + 4 + 2 + 1 + 2 = 60; cells in mitosis 4 + 2 + 1 + 2 = 9 → mitotic index
  **9 ÷ 60 = 0.15 → 15 %** (labelled *calculated*); interphase 51 ÷ 60 = 85 %. Count **cells**, not
  chromosome groups or nuclei (a still-undivided telophase cell counts once); the denominator is all 60
  cells, never the 9. Tallies go into a results table (headings, no units in the body), tag *count from
  the schematic field; teaching data*.
- **Interpretation (verbatim):** These are counts from our schematic field. Fifteen per cent of its cells
  are shown in mitosis. In a representative population of comparable, actively cycling, unsynchronised
  cells under steady conditions, a more frequent stage can suggest a longer duration; this is an
  approximate inference, not an exact timing law. Real tissue may contain non-dividing cells and unevenly
  sampled regions. We do not calculate stage duration from this invented field.

## 7. Frames, timers, values, handling, colour, motion

- **No text-only frames.** Every frame keeps a relevant MODEL, apparatus or image on screen. Cards
  (objectives, forms, reject card, error card) sit beside a model, never alone on a bare page. The
  objectives surface is its own branded style (distinct background, brand typography, motion entry)
  carrying simple authored pictograms (flat line icons, not the lesson's models), not the lesson diagram.
- **Timers start at first contact** (acid in 5.2.2; anything else timed), never after, never reset.
- **Calculated or assumed values are never drawn like readings.** Counts are tallies in a table; the
  mitotic index is labelled *calculated*; DNA units are *arbitrary units*; nothing is drawn as an
  instrument read-out that the method did not read.
- **Handling physically possible:** dropper above, never touching; clove supported, roots dipping;
  coverslip lowered; slide wrapped in paper towel and pressed vertically on a flat supported surface;
  containers supported in the bath; blade on a tile; microscope objectives never lowered onto a slide
  while looking down the eyepiece (Topic 1 standard).
- **Colour** changes only through real colours (§6).
- **Motion:** every event the narration says happens is performed on screen (condensation, envelope
  fragmenting and re-forming, nucleolus fading and reappearing, spindle forming, alignment, centromere
  dividing, daughter chromosomes pulled to the poles, furrowing, cell-plate fusion, replication progress
  across S, telomere endpoint shortening, stem-cell division, differentiation, tumour growth, invasion,
  spread). Never a cut between stills for a process. Prepared specimens do not move.
- **Recap** returns to the SAME diagram the lesson built; static; key points fade in in place.
- **Exam close:** "how it is asked" forms with citations beside a familiar model; ends on ONE reject card
  (✗ written, struck by hand / ✓), citation in small type; where no examiner error is evidenced the card
  is captioned *our wording contrast; not an examiner-reported error* and is never presented as a
  Cambridge reject.
- **REAL-WORLD SAMPLES rule:** real examples are preferred in explain beats. In exam-question beats the
  mark-scheme answer comes first and stays visible; any real-world extra is spoken as beyond the scheme
  ("the scheme doesn't need this, but…") and shown on a panel labelled **beyond the mark scheme**.

## 8. Error beats and budgets

| Code | Budget | ≈ words at 120 wpm | Teaching beats (plan outcome headers give teaching + error totals) | Error beats (badge) |
|---|---:|---:|---:|---|
| 5.1.1 | 6:00 | 720 | 11 | none |
| 5.1.3 | 8:30 | 1,020 | 12 | E5-01 (EXAM CONTRAST), E5-02 (EXAM CONTRAST — an ignore line) |
| 5.1.4 | 4:00 | 480 | 8 | none |
| 5.2.1 | 12:00 | 1,440 | 17 | E5-03 (COMMON MISTAKE, two faults), E5-04 (EXAM CONTRAST) |
| 5.2.2 | 11:00 | 1,320 | 16 | E5-05 (COMMON MISTAKE) |
| 5.1.2 | 6:30 | 780 | 9 | E5-06 (EXAM CONTRAST) |
| 5.1.5 | 4:30 | 540 | 8 | none |
| 5.1.6 | 6:00 | 720 | 8 | E5-07 (EXAM CONTRAST) |

Error-beat content is fixed by the plan's error entries (as revised by the check) — use their completed
answers exactly: E5-02 “ATP supplies energy for spindle formation and for movement of daughter
chromosomes to opposite poles.”; E5-03's completed three-point answer; E5-04's conservation repair with
chromosome 11 named as the paper's object; E5-05's per-cell cost sentence; E5-06's sufficiency note;
E5-07's supplied-mutation consequences.

Five moves every time: (1) **announce** (for COMMON MISTAKE: 'Here is a mistake the mark scheme
refuses…'; for EXAM CONTRAST: 'Here is an answer that would lose the mark…') with the marker on;
(2) **show** the written wrong answer (our composite, captioned *our composite; not a transcript*);
(3) **silent read 3–4 s** (`> *(silent read, 4 s)*`); (4) **talk it through** (≥ 90 words / 45 s: where,
why tempting, why it loses the mark — cite the basis line; cue-synced rings/underlines on the offending
words), then the `> *(correction)*` marker line; (5) **correct in place**, marker clears only on the
completed correct frame. Whole beat **65–75 s ≈ 130–150 words**, never thinned. The badge's basis is
stated on the panel in small type, naming that beat's own source (COMMON MISTAKE, e.g. E5-03: *basis: mark-scheme
reject line, w22_23 Q4(a)(iii), MS p15, PDF-VERIFIED*; E5-05: *… s21_22 Q1(a)(i), MS p7 …*); EXAM CONTRAST: *basis: a real question; no examiner report on how often* — for
E5-02 add *the scheme's ignore line*). A lesson with no assigned error beat has NO badge beat (it may have
a captioned reject card). Wrong propositions are written, never spoken as claims; a wrong word is named
only as the word under discussion. Never claim how often candidates make an error.
