# Cloud run 007 — shared specifications for the eight Topic 5 storyboards

Fixed before the eight storyboards are written in parallel, so that 5.1.1, 5.1.2, 5.1.3, 5.1.4,
5.1.5, 5.1.6, 5.2.1 and 5.2.2 agree with each other, with the plan and with the cleared Topic 3
storyboards (`cloud-inputs/006/examples/3.1.3/STORYBOARD.md`, `cloud-inputs/006/examples/3.2.1b/STORYBOARD.md`).
Where this file and `plan/topic-05/TOPIC-PLAN-05-CELL-CYCLE.md` differ, **the plan wins**; report the conflict.

## 1. Naming and files

- Lessons are referred to ONLY by syllabus code — 5.1.1, 5.1.2, 5.1.3, 5.1.4, 5.1.5, 5.1.6, 5.2.1, 5.2.2 —
  in narration, on-screen text, tags and ledgers. Never "L1", "lesson 3", "last lesson". Narration
  normally needs no code at all ("when we looked at the cell cycle"); on-screen recall tags use the
  code, e.g. *recall: 5.1.3*.
- Output: `storyboards/topic-05/<code>/STORYBOARD.md`. Nothing else is written by a storyboard author.
- No AI model names or identifiers anywhere. Header line: **"Storyboard, first draft. Cloud run 007, 27 September 2026."**
- Validator: `python3 work/007/validate_storyboard.py storyboards/topic-05/<code>/STORYBOARD.md` must end
  with `failing beats 0`. Quote check: `python3 work/007/check_quotes.py storyboards/topic-05/<code>/STORYBOARD.md`
  (exit 0 = every double-quoted string of 4+ words is found in a permitted source). Paste both outputs
  into the storyboard's *Validator run* section.

## 2. Format (mirror the cleared Topic 3 storyboards exactly)

Header (title; draft line; syllabus page p.23; command word(s); budget with beats and error beats from
the plan; outcome **verbatim** in a blockquote; authorities read; build position; models used / published)
→ *The causal spine* (with "What the mark schemes credit, quoted", the handle and its converted sentence,
typicality rules, error-beat list with badges) → *The models, specified once* → *Beat by beat* →
*Datasets* (where any number is shown; every derived number worked) → *Scope ledger* (syllabus → beats;
mark-scheme/examiner points → beats; absolutes sweep) → *Citations* (every quotation with
paper/session/question/page, the file it was copied from, and the tag PDF-UNCHECKED; every
`UNVERIFIED — …` listed) → *Word count and runtime* (per-beat table: words, seconds = words ÷ 120 × 60;
teaching vs error subtotals; budget comparison; overrun honestly stated with a cut list) → *What I left
out, and who owns it* → *Reusable models established here* → *Assets* → *Validator run*.

Beat syntax the validator reads:

```
### BEAT 7 · Title · 4:12–4:58
**Narration:**
> spoken text …
>
> *(silent read, 4 s)*
>
> more spoken text …

**Visual action:**
1. At *exact narration substring*, what appears …; at *another substring*, …
2. **Entry cue: *substring*.** … **Exit cue: end of *substring*.**

**On-screen text:** …
```

Cues are the italic strings after `At`/`at`/`cue:`/`end of`. Each must be an exact (case-sensitive)
substring of that beat's narration, occur only once in it (case-insensitive), and be listed in spoken
order. **No stretch of more than 30 words** (beat start → first cue, cue → cue, last cue → end) without a
cue. Do NOT italicise other text immediately after the word "at" in visual actions, or the validator
reads it as a cue. Authored wording (labels, our framings, wrong/right card lines) goes in **bold** or
*italics* or single quotes — **never in double quotation marks**, which are reserved for verbatim
source quotations (the quote checker reads every double-quoted string of 4+ words).

## 3. Evidence rule (hard)

- Quote ONLY from: `cloud-inputs/007/evidence/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md` (G05),
  `cloud-inputs/007/evidence/EXAMINER-INSIGHT-9700.md`, `cloud-inputs/003/standards/SYLLABUS-9700-DETAIL.md`
  (syllabus wording), and the plan/weights where they reproduce those. Copy verbatim, with paper /
  session / question / page as the plan's weights ledger gives them, and tag every exam quotation
  **PDF-UNCHECKED**.
- G05's table cells are a compressed transcription. Only words G05 itself puts inside quotation marks
  (R “nuclear membrane”, R “cell plate”, R “daughter chromatids”, I “kinetochore”, A “nuclear membrane(s)”)
  are shown as mark-scheme words. G05's other sentences are shown as **G05's summary** — e.g. *G05: "Locate
  replication in S phase of interphase"* — never presented as Cambridge's wording or as a candidate's answer.
- Anything else — a question stem, a full marking point, a tariff G05 does not give — is written
  `UNVERIFIED — <what is needed>` and listed in *Citations*. An authored framing of a question is
  labelled *our framing of …*, never shown as the paper's words. Never state a prevalence the evidence
  does not state ("many candidates…"): G05 gives none for Topic 5.
- SaveMyExams is a content ceiling only. Never cite it, never copy its structure.

## 4. Topic-wide conventions (every sentence, every lesson)

**Counting.** Count chromosomes by counting centromeres. Before S phase a chromosome is one chromatid
(one DNA molecule). After S phase it is two **sister chromatids** (two identical DNA molecules) joined at
one centromere — still ONE chromosome. When the centromere divides in anaphase, each chromatid has its
own centromere and is counted from then on as a chromosome.

| Stage | Model cell (2n = 4) chromosomes | chromatids | DNA molecules | Human cell chromosomes | chromatids / DNA molecules |
|---|---:|---:|---:|---:|---:|
| G1 | 4 | 4 (each unreplicated chromosome = one chromatid) | 4 | 46 | 46 |
| G2, prophase, metaphase | 4 | 8 | 8 | 46 | 92 |
| anaphase (whole cell) | 8 (4 moving to each pole) | — (each is now a chromosome) | 8 | 92 | 92 |
| each daughter nucleus after telophase | 4 | 4 | 4 | 46 | 46 |

Say "chromatid" of an unreplicated chromosome only where the counting needs it; the syllabus word
"sister chromatids" belongs to the replicated state.

**Wording.**
- Anaphase: *the centromere divides; the sister chromatids separate and are pulled to opposite poles*.
  "Splits" may be used only of the centromere. Never "the chromosome splits in half"; never "the
  chromosomes separate" for mitosis (homologue language, Topic 16).
- Prophase: chromosomes **condense** (shorten and thicken) and **become visible**; never "form",
  "appear from nowhere" or "replicate" in prophase.
- **Nuclear envelope** (syllabus word); "nuclear membrane" only as the word under discussion in E5-03.
- **Mitosis** = nuclear division; **cytokinesis** = division of the cytoplasm; the **mitotic cell cycle**
  = interphase (G1, S, G2) + mitosis + cytokinesis.
- Spindle fibres (microtubules) attach at the **centromere**; "kinetochore" may appear once as an
  alternative on-screen label for the attachment region, never required.
- Animal cytokinesis: the **cell surface membrane** is drawn inwards (cleavage furrow). Plant: vesicles
  fuse at the equator into a **cell plate**, which becomes the new cell walls. Plant cells typically have
  no centrioles and still form a spindle.
- Typical, not universal: "interphase is typically the longest part of the cycle"; "a typical human
  cell"; "usually more than one mutation"; "one daughter can remain a stem cell".

**Mitosis purpose chain (5.1.2, and wherever "identical" is explained):** DNA replicated in S phase →
two identical sister chromatids per chromosome → the sister chromatids of every chromosome separate to
opposite poles in anaphase → each daughter nucleus receives one copy of every chromosome → same number
of chromosomes, same genetic information as the parent nucleus.

**No covalent chemistry in Topic 5.** DNA replication is drawn as one double helix becoming two
identical double helices in ONE rendered frame (net state change of whole molecules), caption
*DNA replication — mechanism in 6.1.4*. No nucleotides assembling, no bases named, no bond edits.

## 5. Shared models (identical in every lesson — same geometry, colours, labels, state ids)

Colour tokens (drawn models only; the squash and field of view use real stain colours, §6):
- chromosome hues: **C1 long = deep blue**, **C2 long = teal**, **C3 short = amber**, **C4 short = green**.
  Colour means *which chromosome*; never parental origin; homologous pairs are never named.
- telomere repeat blocks: **grey**; gene bands: **white bands with a thin dark outline**, labelled *gene*;
  the mutated gene band (5.1.6 only): white band with a **black star** marker (never terracotta).
- histone proteins: **pale yellow beads**; DNA: a dark line (Z1) or plain two-strand helix strip (Z2).
- centromere: a constriction with a small dark dot.
- **terracotta is reserved for the error marker** (COMMON MISTAKE / EXAM CONTRAST); nothing else uses it.
- normal accent for highlights and rings: the house accent (not terracotta).

### `ChromosomeModel` (published by 5.1.1)
State ids: `unreplicated-extended`, `unreplicated-condensed` (a single rod with centromere and two
telomeres), `replicated-extended`, `replicated-condensed` (X shape: two sister chromatids joined at one
centromere; telomeres at all four ends), `separated` (after the centromere divides: two single-chromatid
chromosomes, each with its own centromere). Zoom levels: `Z0` whole chromosome; `Z1` one chromatid with
DNA wound round histone beads (label *histone proteins*; no "nucleosome"); `Z2` a plain two-strand helix
strip (label *DNA*; no bases). Gene bands: two bands at fixed positions on every chromatid, identical on
sister chromatids. Labels (SVG text nodes): *DNA*, *histone proteins*, *sister chromatids*, *chromatid*,
*centromere*, *telomere*, *gene*, *chromosome*. Count overlay: *chromosomes (count centromeres)* and
*chromatids* as two separate counters. Transitions: extended ↔ condensed is continuous coiling MOTION;
`unreplicated → replicated` is the one-frame replication switch (§4); `replicated → separated` switches
in ONE rendered frame at the narration's *centromere divides*, and the label *chromatid* becomes
*chromosome* on that same frame; the separated chromosomes then MOVE apart.

### `CellCycleWheel` (published by 5.1.3)
Ring, clockwise from 12 o'clock: **G1** (widest arc), **S**, **G2**, **M** (mitosis), **C** (cytokinesis);
a bracket spanning G1–S–G2 labelled **interphase**; caption *schematic proportions — interphase is
typically the longest part*. A travelling marker; a `ChromosomeModel` inset (one C1 chromosome) shows the
state in each arc: G1 `unreplicated-extended`, S the replication switch, G2 `replicated-extended`, M
`replicated-condensed`, C `separated` into two daughter-cell icons. No G0 arc, no checkpoint marks, no
proteins.

### `DNAContentGraph` (published by 5.1.3)
y: **DNA mass per cell / arbitrary units** (ticks 0, 1, 2 only); x: **time** (no values). G1 flat at 1;
S a steady **slope** from 1 to 2; G2 and M flat at 2; a vertical drop to 1 at C; optionally a second
cycle. Phase bands shaded beneath, aligned to the wheel's labels. Caption *schematic; not measured data*.
Named variant `per-nucleus`: y **DNA mass per nucleus / arbitrary units**, drop at the end of telophase.

### `TelomereEndModel` (published by 5.1.4)
One chromatid end at Z2-like scale: two gene bands then a telomere of **8 grey repeat blocks** (one block
labelled *TTAGGG (human)*; the run labelled *telomere: repeated, non-coding sequence*). A replication-round
counter. Each round, the end of the new DNA molecule is **one block shorter** (the block slides off and
fades — MOTION); gene bands untouched. Thought-experiment state `no-telomere`: caption
*thought experiment — not a real chromosome* on screen throughout; the end gene band is trimmed; then
the model returns to the real state.

### `MitosisCellModel` (published by 5.2.1)
Two variants, same chromosome set (2n = 4: C1–C4 hues) and same stage ids: `interphase`, `prophase-early`
(condensing inside an intact envelope), `prophase-late` (envelope fragmenting, spindle forming),
`metaphase`, `anaphase`, `telophase`, `cytokinesis`.
- **animal**: round cell; cell surface membrane; nuclear envelope as a double line (fragments as MOTION,
  re-forms as MOTION); two centrosomes each with a pair of centrioles, moving to the poles in prophase;
  spindle microtubules pole → centromere; cleavage furrow drawn in by the cell surface membrane.
- **plant**: rectangular cell wall with the cell surface membrane just inside; no centrioles; spindle from
  the poles; vesicles gathering at the equator and fusing into a cell plate, which becomes the new cell
  walls with membrane on each side.
- Count strip beside the cell: *chromosomes · chromatids* updating at each stage per §4.
- The nucleolus is not drawn.

### `RootTipSquashRig` and `FieldOfViewSchematic` (published by 5.2.2) — see §6.
### `StemCellLineage` (5.1.5) and `TissueGrowthModel` (5.1.6) — as the plan specifies; owned by those lessons.

### From Topic 1 (by labelled recall only)
The light-microscope model and handling standard (low power first; coarse focus only at low power; fine
focus at high power; coverslip lowered at an angle with a mounted needle). Its registered component name
is `UNVERIFIED — not in this run's inputs`; storyboards call it *the Topic 1 light-microscope model*.

## 6. The root-tip squash (5.2.2; recalled by label anywhere else)

- **Sample:** garlic (*Allium sativum*) cloves stood with their base in water for a few days until roots
  are about 1–2 cm long. REAL-WORLD SAMPLES answers (must be spoken in 5.2.2): what the stain responds
  to — the DNA-rich chromosomes, which take up the stain far more densely when condensed in mitosis;
  fit — the meristem just behind the root cap (the last 1–2 mm) is a region of active mitosis; garlic has
  few (2n = 16), large chromosomes; root tips have no chlorophyll to compete with the stain;
  limits — root cap and older regions have few dividing cells; an unflattened squash hides chromosomes.
- **Method (fixed):** cut about 5 mm from the root tips on a white tile with a scalpel (cutting away from
  the fingers) → place in **1 mol dm⁻³ hydrochloric acid** in a boiling tube in a rack in a water bath at
  **60 °C** (thermometer in the bath), **5 min** — **the timer starts on the frame the tips enter the acid** →
  rinse in cold water in a beaker → on a slide keep only the terminal **1–2 mm**, discard the rest →
  one drop of **toluidine blue** from a dropper held above the slide (never touching), **2 min** → lower a
  coverslip at an angle with a mounted needle → fold filter paper over the coverslip and press **straight
  down** with the thumb, no sideways movement → Topic 1 microscope: low power (×100 total) to find the
  region of small, closely packed, square cells; then high power (×400 total) for chromosomes.
- **Why the acid:** it breaks down the middle lamella that holds neighbouring cell walls together, so
  the cells separate and spread into one layer when squashed; it also kills the cells, fixing each at the
  stage it had reached.
- **Real colours:** tips creamy white before staining; after toluidine blue, chromosomes and nuclei
  **dark blue to purple**, cytoplasm **pale blue** (typical). The stain darkens in place in one hue
  (intensity only); nothing passes through another colour; no RGB tween between unrelated colours.
- **Hazards (specific):** warm hydrochloric acid — eye protection, no skin contact, tube stays in the
  rack, never held over a face; toluidine blue stains skin and clothing — gloves; scalpel on a tile.
- **`FieldOfViewSchematic`:** a circular field of **60** closely packed square plant cells built from the
  `MitosisCellModel` plant states, drawn in the real stain colours; a marked counting boundary containing
  all 60; caption *schematic drawing — not a photomicrograph*. Fixed composition (used by 5.2.2 only):
  **interphase 51, prophase 4, metaphase 2, anaphase 1, telophase 2** → cells in mitosis 9 → mitotic
  index **9 ÷ 60 = 0.15 → 15 %**. Tallies go into a results table (headings with no units in the body),
  tag *count from the schematic field; teaching data*. A real licensed micrograph is a production
  dependency: `UNVERIFIED — licensed Allium root-tip squash micrograph, source and licence`.

## 7. Frames, timers, values, handling, colour, motion

- **No text-only frames.** Every frame keeps a relevant MODEL or apparatus on screen. Cards (objectives,
  forms, reject card, error card) sit beside a model, never alone on a bare page. The objectives surface
  is its own branded style (distinct background, brand typography, motion entry) carrying simple
  authored pictograms (flat line icons, not the lesson's models), not the lesson diagram.
- **Timers start at first contact** (acid in 5.2.2; anything else timed), never after, never reset.
- **Calculated or assumed values are never drawn like readings.** Counts are tallies in a table; the
  mitotic index is labelled *calculated*; DNA units are *arbitrary units*; nothing is drawn as an
  instrument read-out that the method did not read.
- **Handling physically possible:** dropper above, never touching; coverslip lowered at an angle; thumb
  presses vertically; tubes in racks; scalpel on a tile; microscope objectives never lowered onto a slide
  while looking down the eyepiece (Topic 1 standard).
- **Colour** changes only through real colours (§6).
- **Motion:** every event the narration says happens is performed on screen (condensation, envelope
  fragmenting and re-forming, spindle forming, alignment, centromere dividing, chromatids pulled,
  furrowing, cell-plate fusion, telomere trimming, stem-cell division, differentiation, tumour growth,
  invasion, spread). Never a cut between stills for a process.
- **Recap** returns to the SAME diagram the lesson built; static; key points fade in in place.
- **Exam close:** "how it is asked" forms with citations beside a familiar model; ends on ONE reject card
  (✗ written, struck by hand / ✓), citation in small type; where no examiner error is evidenced the card
  is captioned *our wording contrast; not an examiner-reported error*.
- **REAL-WORLD SAMPLES rule:** real examples are preferred in explain beats. In exam-question beats the
  mark-scheme answer comes first and stays visible; any real-world extra is spoken as beyond the scheme
  ("the scheme doesn't need this, but…") and shown on a panel labelled **beyond the mark scheme**.

## 8. Error beats and budgets

| Code | Budget | ≈ words at 120 wpm | Teaching beats | Error beats (badge) |
|---|---:|---:|---:|---|
| 5.1.1 | 6:00 | 720 | 11 | none |
| 5.1.3 | 8:30 | 1,020 | 12 | E5-01 (EXAM CONTRAST), E5-02 (COMMON MISTAKE, provisional) |
| 5.1.4 | 4:00 | 480 | 8 | none |
| 5.2.1 | 12:00 | 1,440 | 17 | E5-03 (COMMON MISTAKE, two faults), E5-04 (EXAM CONTRAST) |
| 5.2.2 | 11:00 | 1,320 | 16 | E5-05 (COMMON MISTAKE) |
| 5.1.2 | 6:30 | 780 | 9 | E5-06 (EXAM CONTRAST) |
| 5.1.5 | 4:30 | 540 | 8 | none |
| 5.1.6 | 6:00 | 720 | 8 | E5-07 (EXAM CONTRAST) |

Five moves every time: (1) **announce** ("Here is a mistake examiners see…" for COMMON MISTAKE; "Here is
an answer that would lose the mark…" for EXAM CONTRAST) with the marker on; (2) **show** the written
wrong answer (our composite, captioned *our composite; not a transcript*); (3) **silent read 3–4 s**
(`> *(silent read, 4 s)*`); (4) **talk it through** (≥45 s: where, why tempting, why it loses the mark —
cite the basis line; cue-synced rings/underlines on the offending words); (5) **correct in place**, marker
clears only on the completed correct frame. Whole beat **65–75 s ≈ 130–150 words**, never thinned. The
badge's basis is stated on the panel in small type (e.g. *basis: mark-scheme reject line, w22_23 Q4(a)(iii),
MS PDF p15, PDF-UNCHECKED*; for EXAM CONTRAST: *basis: a real question; no examiner report on how often*).
A lesson with no assigned error beat has NO badge beat (it may have a captioned reject card). Wrong
propositions are written, never spoken as claims; a wrong word is named only as the word under discussion.
