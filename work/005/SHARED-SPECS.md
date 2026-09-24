# Cloud run 005 — shared specifications for the five Topic 3 storyboards

Fixed by the conductor-side author before the five storyboards were written in parallel, so that
3.1.3, 3.1.4, 3.2.1, 3.2.1b and 3.2.4 agree with each other and with the two cleared storyboards
(`cloud-inputs/003/topic-03/3.1.1-2/STORYBOARD.md`, `cloud-inputs/003/topic-03/3.2.2-3/STORYBOARD.md`).
Where this file and `TOPIC-PLAN-03-ENZYMES.md` differ, **the plan wins**; report the conflict.

## 1. Naming and files

- Lessons are referred to ONLY by these codes, in narration, on-screen text, tags and ledgers:
  **3.1.1-2** (mode of action), **3.1.3**, **3.1.4**, **3.2.1** (temperature and pH), **3.2.1b**
  (three concentrations), **3.2.2-3** (Vmax, Km, inhibitors), **3.2.4**. Never "L1…L6", "L4a", "L4b".
  (The plan and the cleared storyboards use L-names; translate them.) Narration normally needs no code
  at all ("in the lesson on measuring rates"); on-screen recall tags use the code, e.g. *recall: 3.1.3*.
- Output: `storyboards/topic-03/<code>/STORYBOARD.md`.
- No model names or model identifiers anywhere in a storyboard. Header line: **"Storyboard, first
  draft. Cloud run 005, 24 September 2026."**
- Validator: `python3 work/005/validate_storyboard.py storyboards/topic-03/<code>/STORYBOARD.md`
  must end with `failing beats 0`. Paste its output into the storyboard's *Validator run* section.

## 2. Format (mirror the cleared 3.1.1-2 storyboard)

Header (title, draft line, syllabus page, command word, budget with beats and errors, outcome verbatim
in a blockquote with p.20, authorities read, build position, models used/published) → *The causal
spine* (with "What the mark schemes credit, quoted", the handle, typicality rules, error-beat list) →
*The models, specified once* → *Beat by beat* → *Datasets* (one table per experiment, with every
derived number worked) → *Scope ledger* (syllabus → beats; mark-scheme/examiner points → beats;
absolutes sweep) → *Citations* (every quotation with paper/session/question/page and which verified
file it was copied from; every `UNVERIFIED — …`) → *Word count and runtime* (per-beat ledger: words,
seconds at words ÷ 120) → *What I left out, and who owns it* → *Reusable models* → *Assets* →
*Validator run*.

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
order. No stretch of more than 30 words (beat start → first cue, cue → cue, last cue → end) without a
cue. Do NOT italicise other text immediately after the word "at" in visual actions (write captions
as *…* only where no "at" precedes them), or the validator will read it as a cue.

## 3. Evidence rule (hard)

Quote ONLY from: `cloud-inputs/003/topic-03/TOPIC-PLAN-03-ENZYMES.md`,
`cloud-inputs/003/topic-03/TOPIC-03-WEIGHTS.md`, `cloud-inputs/005/evidence/EXAMINER-INSIGHT-9700.md`
(and syllabus text from `cloud-inputs/003/standards/SYLLABUS-9700-DETAIL.md`). Copy verbatim with the
paper / session / question / page given there. Anything else — e.g. a question-paper instruction whose
wording is not in those files — is written `UNVERIFIED — <what is needed>` and listed in the
storyboard's *Citations* section. An authored framing of a question is labelled *our framing of …*,
never shown in quotation marks as the paper's words. Never upgrade "some"/"many" to "most".
S23/34 Q1(c): quote the ER p.33 / QP graph reading (54 g; 5.4 g min⁻¹), never the printed MS.
S23/31: the question/MS interval is 60–140 mmol dm⁻³; the ER's "60–100" only as written.

## 4. Rate vocabulary (topic-wide, every sentence)

- **Initial rate**: gradient of the tangent at t = 0 on a progress curve, or of a genuinely straight
  initial section; rise ÷ run with units.
- **Average rate**: change ÷ a whole stated interval (S23/34: 54 g in 10 min = 5.4 g min⁻¹).
- **1/t**: reciprocal of the time to a fixed endpoint under comparable conditions; a *relative rate
  proxy*, units s⁻¹; not a concentration-per-time rate and not an initial rate.
- **Rate is not amount.** "More product" is an amount; "more product per unit time" is a rate. A
  single reading at a fixed time is an amount, not a rate.
- `RateGraph` never labels an endpoint-method plot "initial rate".

Canonical explanation grammar, used word for word where 3.2.1 and 3.2.1b state it:
> **The rate depends on how often substrate molecules meet a working active site and form
> enzyme–substrate complexes per unit time, and on whether the active sites stay functional.**

## 5. Shared apparatus and fixed conditions

### Catalase, gas syringe (`GasSyringeRig` + `WaterBathRig`; published by 3.1.3)
- Catalase source: **yeast suspension**, made up in **pH 7.0 buffer solution** (`BufferedTubeRig`
  label: *buffer solution, pH 7.0*), mixed (swirled) before every aliquot is measured.
- Standard run (3.1.3): **5.0 cm³ yeast suspension** + **10.0 cm³ hydrogen peroxide solution,
  0.20 mol dm⁻³**, both **equilibrated separately for 10 min** in a thermostatically controlled
  water bath at **30 °C** (thermometer in the bath).
- Vessel: a conical flask holding the peroxide, with a **small test tube standing upright inside it**
  holding the yeast suspension; a bung with a delivery tube, **seated before mixing**, connects to a
  **gas syringe** clamped horizontally, plunger checked at **0 cm³**. The system is closed before the
  reactants meet.
- **t = 0 is the moment of mixing**: the flask is tilted by its neck so the small tube spills into
  the peroxide, returned upright to the bath, timer started at the tilt. Collection starts at mixing.
- Readings: **volume of gas collected / cm³ every 15 s to 180 s**. Background control: 5.0 cm³ water
  in place of yeast suspension, same everything else.
- Name the gas: oxygen is the product of the catalase reaction; the axis says **volume of gas
  collected**, because collection alone does not prove the collected gas is pure oxygen.
- **3.1.3 standard dataset constraint**: a genuinely straight initial section; **initial rate =
  0.40 cm³ s⁻¹** (tangent at t = 0). Stoichiometric ceiling: 10.0 cm³ × 0.20 mol dm⁻³ = 2.0 mmol H₂O₂
  → 1.0 mmol O₂ ≈ 24 cm³ at room temperature and pressure, so **no reading may exceed 24 cm³**
  (the storyboard need not narrate this).
- **3.2.1 temperature series**: same rig and quantities; 10, 20, 30, 40, 50 °C; enzyme and substrate
  equilibrated **separately** for the same 10 min at each test temperature; three repeats; mean
  initial rate per temperature; **30 °C mean = 0.40 cm³ s⁻¹**; enzyme-free control at each temperature.
- **3.2.1b substrate series**: same rig, 30 °C, 5.0 cm³ yeast suspension; hydrogen peroxide
  **0.10, 0.20, 0.30, 0.40, 0.50 mol dm⁻³** by proportional dilution of a **0.50 mol dm⁻³ stock**
  to 10.0 cm³ (worked example shown, e.g. 0.20 = 4.0 cm³ stock + 6.0 cm³ water); initial slopes;
  **0.20 mol dm⁻³ mean initial rate = 0.40 cm³ s⁻¹**; the curve levels off at the higher concentrations.

### Catalase disc rise (`CatalaseDiscRig`; transfer example in 3.1.3; pH investigation in 3.2.1)
- The S22/33 design: identical filter-paper discs soaked for the same time in the enzyme preparation
  (for 3.2.1, the enzyme–buffer soaking mixture of stated pH), released at the bottom of a tube of
  hydrogen peroxide of fixed concentration, volume and depth; time for the disc to rise to the
  surface; **fresh hydrogen peroxide for each disc**; boiled-enzyme control; three times per condition,
  whole seconds, mean; plotted as **"1/mean rise time / s⁻¹"**, a relative rate proxy.
- 3.1.3's single transfer example uses the pH 7.0 soaking mixture with rise times **12, 13, 14 s →
  mean 13 s → 1/13 = 0.077 s⁻¹**. 3.2.1's pH 7.0 row uses the same three times.
- Say "catalase" for the enzyme; do not assert what S22/33's enzyme source was beyond the plan's words.
- The buffer pH is the pH of the soaking mixture, not a measured pH of the whole peroxide tube.

### Amylase, timed iodine sampling (`AmylaseIodineSampler`; 3.1.3, 3.2.1b, 3.2.4)
- Amylase solution and starch suspension, both in pH 7.0 buffer, equilibrated separately at 30 °C in
  the water bath, then mixed; timer at mixing.
- A white **spotting tile**, one equal drop of **iodine solution** in each well. At t = 0 and then
  **every 30 s**, a dropper takes one drop of the reaction mixture and releases it **above** the next
  well (never touching the iodine); dropper rinsed between samples.
- Each well switches **in one frame** (no RGB tween) between the two real results: **blue-black**
  (starch present; may be drawn less intense as starch falls) and **yellow-brown** (iodine's own
  colour; starch no longer detected). No purple, no grey, no "colourless" (the syllabus p.61 ordinal
  example says "colourless" and is quoted as such only if quoted).
- **Endpoint time t** = time of the first sample that no longer gives blue-black; resolution is one
  sampling interval (say so where it matters). Rate proxy 1/t in s⁻¹. **No initial rate and no
  substrate-concentration curve is inferred from by-eye swatches.** A falling substrate–time curve may
  appear only as a separate, labelled *schematic*.
- 3.1.3's example: endpoint **150 s → 1/t = 1/150 = 0.0067 s⁻¹**.

### Colorimeter + ONPG assay (`ColorimeterModel`; published by 3.1.4, used by 3.2.1b)
- Enzyme **β-galactosidase** (lactase) acts on **ONPG** (colourless) to give a **yellow** product
  (ONP) — names are context, not a recall list. Buffer solution of stated pH; all solutions
  equilibrated at **25 °C**.
- Parts, named where they sit: light source → **filter** → **cuvette** (in its holder, clear faces in
  the light path, handled by the ridged faces) → **detector** → **absorbance read-out**.
- **Filter: blue.** The yellow product absorbs blue light; the filter is not the colour of the
  solution (March 2023 ER P52 Q1(a)(i), p.14 wording in the plan).
- **Zero on the reaction blank**: a cuvette of buffer + ONPG + water in place of enzyme; set absorbance
  to 0. Keep filter and optical path fixed; **re-zero if the filter or the blank conditions change**.
- Run: enzyme added last to the cuvette, mixed, timer started at mixing, cuvette into the colorimeter;
  **absorbance read at 0, 30, 60, 90, 120, 150, 180 s**.
- **3.1.4 demonstration series (= 3.2.1b zero-inhibitor series)**: absorbance **0.00, 0.12, 0.24,
  0.35, 0.45, 0.53, 0.60**. Straight initial section 0–60 s → **initial rate of change of absorbance =
  0.24 ÷ 60 s = 0.0040 s⁻¹** (absorbance has no unit). Colour of the cuvette deepens only in yellow
  intensity (a real sequence).
- Calibration curve: absorbance of known concentrations of the yellow product under the same filter,
  blank and path; used only when a concentration rate is needed. 3.1.4 chooses the values; if 3.2.1b
  converts, it uses 3.1.4's values.
- **3.2.1b inhibitor series**: inhibitor X at five concentrations **including zero**; final ONPG and
  enzyme concentrations, total volume and inhibitor-solvent volume fixed; **for each inhibitor
  concentration the colorimeter is re-zeroed on that concentration's own blank** (buffer + ONPG +
  inhibitor X at that concentration + water in place of enzyme), so readings are blank-corrected;
  initial rate = gradient 0–60 s. Explicitly labelled **adaptation of S21/51** (which varied substrate
  with and without X). X stays a supplied label; no inhibition class inferred.

### `RateGraph` configurations (published by 3.1.3; extended by 3.1.4, 3.2.1, 3.2.1b, 3.2.4)
- `progress-product`: *volume of gas collected / cm³* against *time / s*; overlay `tangent-t0` with a
  rise/run triangle and its units; overlay `chord` for an average rate over a stated interval.
- `progress-substrate-schematic`: falling curve, labelled *schematic; not measured*; y-axis
  *substrate concentration* (no numbers), x *time*. A falling gradient is reported as the positive
  magnitude of a negative gradient.
- `rate-time`: *rate of reaction* against *time*, highest at the start, falling (S23/12 Q14, key C).
- `absorbance-time` and `calibration` (3.1.4).
- Factor plots, y-axis labelled by the actual measure:
  temperature and peroxide concentration → *mean initial rate of gas collection / cm³ s⁻¹*;
  pH (disc) → *1/mean rise time / s⁻¹*; amylase concentration → *1/mean endpoint time / s⁻¹*;
  inhibitor concentration → *initial rate of change of absorbance / s⁻¹*;
  amylase free vs bead (3.2.4) → *1/endpoint time / s⁻¹* (bars or table, not a curve).
- A schematic teaching curve (e.g. the idealised rate–temperature shape) is labelled
  *schematic model; not these data* and kept visually separate from plotted data.
- Plotted points are the dataset means; points are labelled *our illustrative data* when invented.

### `EnzymeActiveSiteModel` (published by 3.1.1-2) — use its states by id
`rest-lk` (default), `rest-if`, `bound`, `products`, `denatured`, inhibitor states (3.2.2-3). Caption
*schematic; not a real protein shape*. Binding, failure to seat, unfolding are MOTION.
- **`denatured` motion (first specified by 3.2.1):** the 2.3.3-style dashed (hydrogen) and dotted
  (ionic) links between R groups vanish one by one; the silhouette loosens; the cleft distorts; the
  backbone line stays continuous — **never cut** — tag *peptide bonds intact*. A substrate then
  arrives, rocks, and fails to seat. Caption word: **denatured** (never "killed"/"dead").
- pH: `+`/`−` charge tags on R groups lining the cleft change; an ionic link at the cleft breaks and
  the cleft shape shifts (moderate change); at extreme pH, the full `denatured` motion.

### Chemistry
- Catalase: **2H₂O₂ → 2H₂O + O₂** every time it is written. `CatalaseNet` (3.1.3 specifies; others
  replay by reference only): atoms O1–O2 (H1 on O1, H2 on O2), O3–O4 (H3 on O3, H4 on O4). Delete
  O1–O2, O3–O4, O2–H2, O3–H3; create O1–H2, O4–H3, O2=O3; retain O1–H1, O4–H4. One rendered frame, no
  crossfade, caption **net reaction; not a stepwise mechanism** throughout, valence audit.
- Amylase: `Hydrolyse` from 2.2.6 by reference (delete Og–Cp, Ow–Ht; create Og–Ht, Cp–Ow; retain
  C1–Og, Ow–Hr). 3.1.4, 3.2.1, 3.2.1b: no new chemistry. 3.2.4: replay only if shown.

### Handling (checked on a still frame)
Pours mouth below base (110–130° from upright), stream from the lip into the receiving mouth; droppers
squeezed above the tube/well, never touching; bungs seated before mixing; tubes in a rack in the
bath; a hot tube held in a holder; the gas-syringe plunger moves out smoothly as gas collects; liquid
surfaces level.

## 6. Error beats and budgets

| Code | Budget | ≈ words at 120 wpm | Error beats | Teaching base |
|---|---:|---:|---|---:|
| 3.1.3 | 10:15 | 1,230 | E42 | 9:30 (1,140 words) |
| 3.1.4 | 3:15 | 390 | none (plan: colorimeter misconceptions taught normally) | 3:15 |
| 3.2.1 | 7:00 | 840 | none | 7:00 |
| 3.2.1b | 8:45 | 1,050 | E38, E39, E40 | 6:30 (780 words) |
| 3.2.4 | 6:00 | 720 | none | 6:00 |

Five moves every time (announce → written card → 3–4 s silent read → talk-through with cue-synced
highlights → correct in place; marker held until the last fault is corrected). ~130–150 words
(65–75 s) each, never thinned. Badge **COMMON MISTAKE** only where an ER or an MS reject/ignore line
shows candidates make it; otherwise **EXAM CONTRAST**; state the basis. A lesson without an assigned
error beat has NO COMMON MISTAKE beat (it may have a captioned reject card).

## Errata after round-one checks (24 September 2026)

These supersede the lines above where they differ; the storyboards already follow them.
- **Timer:** t = 0 is the frame the reactants first meet (never after a pour, tilt or mixing ends; never reset). Disc rise: timed from release, identical brief descent.
- **ONPG assay:** there is no reading at 0 s. The cuvette goes in after mixing; (0 s, 0.00) is an assumed start under stated assumptions (no initial product, negligible enzyme-preparation optical background, stable blank); measured readings at 30–180 s (3.1.4 CHECK M1). Calibration stock of the yellow product is made up in water (3.1.4 CHECK M2).
- **Gas rig:** 250 cm³ flask, offset small tube, ~30° tilt, toppling path and weighted ring as specified in 3.1.3; three-way tap venting during equilibration, baseline 0 cm³ set after equilibration; gas control = 5.0 cm³ of the same enzyme-free buffer solution, pH 7.0 (not water).
- **Iodine sampler:** every blue-black well is drawn the same shade (the "may be drawn less intense" allowance is withdrawn).
- **Frames:** no text-only frames; objectives surfaces carry authored pictograms.
