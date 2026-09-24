# 3.1.4 — Following a colour change: the colorimeter

**Storyboard, first draft. Cloud run 005, 24 September 2026.** No audio, no code, no render. Folder `storyboards/topic-03/3.1.4/`.
Cambridge 9700 syllabus 2025–2027, p.20. Command word **OUTLINE**. Budget from `TOPIC-PLAN-03-ENZYMES.md` §3.1.4 and `TOPIC-03-WEIGHTS.md`: **3:15, 5 macro beats, 0 errors**. **No error beat**: the plan records that colorimeter misconceptions are reported in June 2024 ER, Paper 22 Q4(b)(ii), p.15, and "are addressed in normal teaching; no separate error beat is allocated to them in this plan". This lesson therefore has no COMMON MISTAKE and no EXAM CONTRAST beat; it closes on one captioned reject card (Beat 5), which is not an error beat. 3.1.4 appears in **0 of 15** sampled papers (weights: "No sampled mark in the enzyme sense"); its content is set by the syllabus and by the supplementary rows S-C (Specimen 2022 P3 Q1(b)) and S-E (S21/51 Q1). Runtime estimated at **120 words per minute of final video**.

> **3.1.4** outline the use of a colorimeter for measuring the progress of enzyme-catalysed reactions that involve colour changes

Syllabus p.20 (from `SYLLABUS-9700-DETAIL.md`, outcome 3.1.4; no depth qualifier).

Authorities read in full: `work/005/SHARED-SPECS.md`; `VIDEO-STRUCTURE.md`; `CONTENT-ARCHITECTURE.md`; `SYLLABUS-9700-DETAIL.md` (Topic 3 outcomes; 2.1.2 for the recall); `TOPIC-PLAN-03-ENZYMES.md` (§3.1.4, rate vocabulary, investigation map inhibitor row, shared-models table, traps table, R2 RESPONSE); `TOPIC-03-WEIGHTS.md` (3.1.4 rationale, evidence-gaps paragraph, S-C and S-E rows); the cleared `3.1.1-2/STORYBOARD.md` and `3.2.2-3/STORYBOARD.md` with their `CHECK.md` and `CHECK-R2.md`; `EXAMINER-INSIGHT-9700.md`, `GATE-CRITERIA-9700-03-ENZYMES.md`, `COMPLEXITY-CALIBRATION-9700-BIOLOGY.md` (§3), `PASTPAPERS-INVENTORY.md`. **No question paper, mark scheme or examiner-report PDF was opened for this draft.** Every quotation below is copied from those verified planning files; anything they do not contain is marked `UNVERIFIED` and listed under *Citations*.

**Build position:** third of the seven enzyme lessons (after 3.1.1-2 and 3.1.3). Uses `RateGraph` (published by 3.1.3) and the rate vocabulary. **Publishes** `ColorimeterModel`, the **ONPG assay**, and the `RateGraph` configurations **`absorbance-time`** and **`calibration`**, all inherited by 3.2.1b (inhibitor concentration). Recall by label only: 2.1.2 (colour standards of known concentration). No chemistry is drawn: no bonds, no structures.

---

## The causal spine

The outcome asks for the **use** of a colorimeter to follow **progress** when the reaction involves a **colour change**. Everything in the lesson follows from one idea: a colorimeter turns *how strongly a coloured solution absorbs one band of light* into a number, and a number can be turned into a rate.

> **When a substrate or product is coloured, a colorimeter measures the absorbance of one wavelength band of light passing through the sample, so the progress of the reaction is recorded as a number rather than judged by eye. Choose a filter that passes the colour the coloured substance absorbs (blue for a yellow product; the filter is not the colour of the solution), zero the colorimeter on a blank that contains everything except the enzyme, keep the filter and the light path the same, read the absorbance at stated times and plot absorbance against time. The gradient of the straight initial section is the initial rate of change of absorbance. To turn absorbance into a concentration, use a calibration curve made from known concentrations under the same conditions; re-zero if the filter or the blank conditions change.**

**What the mark schemes and reports credit, quoted** (all copied from the plan or weights; see *Citations*):
- [S21/51 Q1(b)(i), MS p.7] "idea that (result / it, is) quantitative / AW".
- [March 2023 ER, Paper 52 Q1(a)(i), p.14] "the filter used should not be the same as the colour of the solution being tested". (The plan also records, as its own paraphrase, that this report mentions the colorimeter being calibrated, zeroed with distilled water and fitted with a coloured filter; those words are not quoted here.)
- [June 2024 ER, Paper 22 Q4(b)(ii), p.15] "different wavelengths of light rather than different absorbance or transmission values using the same light wavelength"; the report also objects to "changing" colours where the intensity was wanted (the weights' paraphrase around the one quoted word). The plan's paraphrase of the same page adds: accuracy versus subjective judgement; quantitative results; calibration curves.
- [Learner Guide p.15, via `EXAMINER-INSIGHT-9700.md`] for **outline**: "Detail is not required." — guidance for that illustrated task; used here only to justify stopping at the procedure (no optics).

So the spine is what is credited: quantitative rather than judged; a filter chosen by what the solution absorbs; absorbance at one wavelength, with intensity as the variable; calibration where a concentration is wanted.

**The handle:** *yellow soaks up blue.* Converted at once: *the yellow product absorbs blue light, so a blue filter is used and the absorbance rises as the yellow deepens.* The handle is never the exam answer.

**Typicality rules applied:** "Not every enzyme reaction changes colour, but some do" (the syllabus limits the outcome to reactions "that involve colour changes"; catalase's gas is the counter-case from 3.1.3, named on screen only). The blank is **this assay's** reaction blank; distilled water is not called wrong (the March 2023 report, per the plan's paraphrase, mentions it). "Two people may judge it differently" is a possibility, not a claim that eyes always disagree. The blue filter is justified for **this** yellow product, not stated as a rule for every assay. The straight section is "for the first sixty seconds" of **these** data; no claim that every progress curve is straight for 60 s. The calibration line is straight over **our** standards; no Beer–Lambert law is stated or implied as universal. β-galactosidase and ONPG are named as the demonstration's context, not a recall list.

**Error beats: none.** The single reject card in Beat 5 is captioned as our composite of the answers the June 2024 report describes; it carries no COMMON MISTAKE or EXAM CONTRAST badge and no five-move treatment. The wrong wording is written on the card and never spoken.

---

## The models, specified once

**`ColorimeterModel` (new; published here, used by 3.2.1b).** A schematic benchtop colorimeter drawn as a side-on cutaway so the light path is visible, tagged *schematic; not a particular instrument*. Parts, each a text-node label placed where the part sits, left to right along one horizontal light path:
1. **light source** (a lamp at the left end);
2. **filter** (a slot between lamp and sample; the filter slides in vertically; state `filter-blue` is the only filter used in this lesson; a faint blue band of light is drawn from the filter to the detector);
3. **cuvette** in its **holder** (a square-section cuvette standing upright in a well with a hinged lid; two opposite **clear faces** turned into the light path; two **ridged faces** at the sides, drawn with fine vertical ribs);
4. **detector** (at the right of the holder, facing the light);
5. **absorbance read-out** (a digital display on the front panel, two decimal places; a **zero** button beside it).
No lenses, gratings, photocell circuitry or equations are drawn. The light band is drawn as one flat blue band; it does not change colour after the sample, and no ray diagram is shown.

**Handling contract (checked on a still frame).** The cuvette is held between finger and thumb **on the ridged faces only**; fingers never touch the clear faces. Liquids are dispensed from a graduated pipette whose tip is inside the cuvette mouth, above the liquid surface, not touching the clear faces. Mixing: a cuvette lid is fitted and the cuvette is inverted twice, held by the ridged faces, liquid surface level after it is set upright. The cuvette is lowered into the holder clear faces to the light path, and the holder lid is closed before any reading. Between readings the cuvette stays in the holder (fixed light path).

**ONPG assay (published here, used by 3.2.1b; SHARED-SPECS §5).** Enzyme **β-galactosidase** (tag *also called lactase*); substrate **ONPG** (tag *colourless*); product shown as **yellow product (ONP)**, words only, tag *names are context, not a list to learn*. Buffer solution, **pH 7.0**; all solutions equilibrated at **25 °C** in a water bath before use. Volumes, fixed for every run and every blank (small type on screen, not narrated):

| Tube | Buffer solution, pH 7.0 | ONPG solution | Water (the slot 3.2.1b uses for inhibitor X solution) | Enzyme solution | Total |
|---|---:|---:|---:|---:|---:|
| **Reaction cuvette** | 1.0 cm³ | 0.5 cm³ | 0.5 cm³ | 0.5 cm³, added **last** | 2.5 cm³ |
| **Reaction blank** | 1.0 cm³ | 0.5 cm³ | 0.5 cm³ | — (0.5 cm³ water in place of enzyme) | 2.5 cm³ |

Sequence: filter set to blue → blank cuvette in the holder → read-out set to **0.00** with the zero button → blank removed → reaction cuvette made up with the enzyme added last, lid fitted, inverted twice → **timer started at mixing** → cuvette into the holder → absorbance recorded at **0, 30, 60, 90, 120, 150, 180 s**. The 0 s entry is the value at mixing, before product has formed (the mixture matches the blank), recorded as 0.00.

**Colour rule (VIDEO-STRUCTURE, "A colour change passes only through colours the reaction really shows").** The cuvette's contents are drawn in **one yellow hue only**, from colourless at mixing to pale yellow and then deeper yellow, by raising that hue's opacity. No other hue appears at any frame: no green, no orange, no blue tint in the liquid. The blank stays colourless throughout. The standards in Beat 4 are drawn with the same hue at five opacities.

**`RateGraph`, configuration `absorbance-time` (new here; extends 3.1.3's component).** y-axis **absorbance** (small type *no unit*), 0.00–0.70; x-axis **time / s**, 0–180. Points from Dataset A, labelled *our illustrative data*. A smooth curve through them. Overlay **`straight-initial`**: a ruled line over 0–60 s with a rise/run triangle labelled **rise 0.24**, **run 60 s**, and the result **initial rate of change of absorbance = 0.24 ÷ 60 s = 0.0040 s⁻¹**. The graph is never labelled "initial rate of reaction" without the words "of change of absorbance".

**`RateGraph`, configuration `calibration` (new here).** y-axis **absorbance**, 0.00–0.90; x-axis **concentration of yellow product / µmol dm⁻³**, 0–100. Six points from Dataset B, labelled *our illustrative standards*, with a straight ruled line through them. Overlay **`read-across`**: a horizontal dashed line from 0.24 on the absorbance axis to the line, then a vertical dashed drop to **30 µmol dm⁻³**. Caption *same filter, same blank, same cuvette and volume as the reaction*.

---

## Beat by beat

Beat windows in the headings follow the word ledger below (words ÷ 120); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch of more than 30 words without a stated visual change.

### BEAT 1 · Hook, context, and what you will be able to do · 0:00–0:43
**Narration:**
> Ever wondered how to turn a tube getting a bit more yellow into a number? Not every enzyme reaction changes colour, but some do. The enzyme beta-galactosidase releases a yellow product from a colourless compound, ONPG. You can watch the tube deepen, but by eye you are left with a judgement, and two people may judge it differently. A colorimeter gives you the number.
>
> By the end you will be able to outline how a colorimeter follows this reaction, and say what a calibration curve adds.

**Visual action:**
1. At *a bit more yellow*, a single test tube at centre, its liquid pale yellow, then one step deeper yellow (same hue, opacity up); at *into a number*, an empty read-out box beside it showing **?.??**.
2. At *Not every enzyme reaction changes colour*, two small insets slide in at left: the 3.1.3 gas syringe with bubbles (tag *recall: 3.1.3, no colour change*) and a colourless tube; at *but some do*, the gas-syringe inset dims and the colourless tube stays.
3. At *beta-galactosidase*, the word label **β-galactosidase (enzyme)** appears above the tube; at *releases a yellow product*, the liquid turns from colourless to pale yellow through the one yellow hue only, and the label **yellow product** lands; at *a colourless compound, ONPG*, the label **ONPG (colourless)** lands on the left of an arrow pointing to **yellow product**. Small type *names are context, not a list to learn*. No structures, no equation.
4. At *by eye you are left with a judgement*, two cartoon eyes beside the tube with speech tags reading *a bit more?* and *about the same?* (our illustration, not quotations); at *two people may judge it differently*, the two tags pulse in turn.
5. At *A colorimeter gives you the number*, the tube's liquid is shown transferred to a cuvette, which slides into the outline of the `ColorimeterModel` (unlabelled silhouette) and the read-out box fills with **0.24**; dissolve to the objectives surface.
6. At *By the end you will be able to outline*, the objectives surface (own styled background, no diagram, no colorimeter) builds line 1; at *say what a calibration curve adds*, line 2.
   1. **OUTLINE** how a colorimeter follows a colour-change reaction: filter, zero, readings, rate of change of absorbance
   2. **SAY** what a calibration curve adds: from absorbance to concentration

   Small type: *syllabus 3.1.4 "outline", p.20.*

**On-screen text:** the hook question; *β-galactosidase*, *ONPG (colourless)*, *yellow product*; the objectives.

---

### BEAT 2 · The colorimeter, the filter and the zero · 0:43–1:42
**Narration:**
> Light from a lamp passes through a filter, which lets through one band of colour, then through the cuvette of sample in its holder, and on to a detector. The read-out shows absorbance: the more of that light the sample absorbs, the higher the number. Hold the cuvette by its ridged sides, clear faces to the light. Picture yellow soaking up blue. Written properly: the yellow product absorbs blue light, so you choose a blue filter, not the colour of the solution. Then zero on the blank: buffer, ONPG and water in place of the enzyme, set to zero. Keep the filter and the cuvette position fixed, and if the filter or the blank conditions change, zero again.

**Visual action:**
1. At *Light from a lamp*, `ColorimeterModel` in cutaway fills the frame, caption *schematic; not a particular instrument*; label **light source** and the lamp glows; at *passes through a filter*, label **filter** at its slot; at *one band of colour*, a single flat band of light leaves the filter (neutral grey until the filter is chosen in action 5).
2. At *through the cuvette of sample in its holder*, labels **cuvette** and **holder**, the band crossing the cuvette; at *on to a detector*, label **detector** as the band reaches it.
3. At *The read-out shows absorbance*, label **absorbance read-out** on the display; at *the more of that light the sample absorbs*, a pale yellow cuvette is swapped for a deeper yellow one (same hue) and the band beyond the cuvette is drawn thinner while the display rises from **0.12** to **0.35** (illustrative readings; the zeroing comes in action 7).
4. At *Hold the cuvette by its ridged sides*, a hand lifts the cuvette by the **ridged faces** (labelled), fingers clear of the clear faces; at *clear faces to the light*, the cuvette is lowered into the holder, clear faces (labelled) turned to the lamp and detector, and the lid closes.
5. At *Picture yellow soaking up blue*, the filter slot is ringed and the handle strap-line **yellow soaks up blue** appears beside a small colour pair (a yellow drop and a blue band, the band entering the drop and not leaving it); at *Written properly*, the creditworthy sentence lands: **the yellow product absorbs blue light, so a blue filter is used**; at *you choose a blue filter*, `filter-blue` slides into the slot and the band becomes blue.
6. At *not the colour of the solution*, a ghost yellow filter hovers above the slot with a small ✗ and dissolves; citation tab: **March 2023 ER, Paper 52 Q1(a)(i), p.14: "the filter used should not be the same as the colour of the solution being tested"**.
7. At *Then zero on the blank*, a second cuvette labelled **reaction blank** (colourless) is lowered into the holder by its ridged faces; at *buffer, ONPG and water in place of the enzyme*, its contents list appears beside it: **buffer solution, pH 7.0 · ONPG solution · water (in place of enzyme)**, with the volume table from the model spec in small type; at *set to zero*, the **zero** button is pressed and the display reads **0.00**.
8. At *Keep the filter and the cuvette position fixed*, the blue filter and the holder are outlined together with tag *fixed*; at *zero again*, a small loop arrow returns to the zero button with tag *re-zero if the filter or blank conditions change*.

**On-screen text:** the five part labels; *ridged faces*, *clear faces*; the handle and the sentence; the March 2023 citation; *reaction blank* and its contents; *fixed*; *re-zero if the filter or blank conditions change*.

---

### BEAT 3 · Reading the reaction: absorbance against time · 1:42–2:20
**Narration:**
> Add the enzyme last, mix, start the timer at mixing, and put the cuvette in. Read the absorbance every thirty seconds and plot it against time. For the first sixty seconds the line is straight, rising by zero point two four. So the initial rate of change of absorbance is zero point zero zero four per second. That is why a number beats your eye: you can calculate a rate, and compare one run with another.

**Visual action:**
1. At *Add the enzyme last*, the blank is lifted out by its ridged faces and set aside; a new cuvette holding buffer, ONPG and water (colourless) receives **0.5 cm³ enzyme solution** from a pipette whose tip is inside the cuvette mouth above the liquid, then a lid is fitted and the cuvette is inverted twice, held by the ridged faces, and set upright with a level surface; at *start the timer at mixing*, a stopwatch starts at **0 s**; at *put the cuvette in*, it is lowered into the holder, clear faces to the light path, lid closed.
2. At *Read the absorbance every thirty seconds*, the stopwatch runs and the display steps through **0.00, 0.12, 0.24, 0.35, 0.45, 0.53, 0.60** at 0, 30 … 180 s while a cutaway view of the cuvette deepens in yellow opacity only; small type under the display: *0 s: the mixture at mixing, before product forms, taken as the blank's 0.00; readings from 30 s*; at *plot it against time*, `RateGraph` `absorbance-time` slides in at right and each reading lands as a point as it appears, points labelled *our illustrative data*.
3. At *For the first sixty seconds the line is straight*, the first three points are joined by a ruled line (`straight-initial`), and the later points are joined by a curve that bends away below the extended ruled line; at *rising by zero point two four*, the rise/run triangle draws: **rise 0.24**, **run 60 s**.
4. At *the initial rate of change of absorbance*, the result label lands: **initial rate of change of absorbance = 0.24 ÷ 60 s = 0.0040 s⁻¹**, small type *absorbance has no unit, so the rate is per second*; at *zero point zero zero four per second*, **0.0040 s⁻¹** is ringed.
5. At *That is why a number beats your eye*, the Beat 1 eyes-and-tags inset returns small beside the graph and dims; at *compare one run with another*, a faint second ruled line of a different slope flashes on the graph beside the first with tag *another run, compared by gradient* (no values; illustrative), then fades.

**On-screen text:** *our illustrative data*; the triangle; **initial rate of change of absorbance = 0.24 ÷ 60 s = 0.0040 s⁻¹**; *absorbance has no unit*.

---

### BEAT 4 · From absorbance to concentration: the calibration curve · 2:20–2:51
**Narration:**
> But absorbance is not a concentration. For that you make a calibration curve: known concentrations of the yellow product, read with the same filter and blank, the colour-standards idea from the Benedict's lesson. Read zero point two four across: thirty micromoles per decimetre cubed. Thirty in sixty seconds is zero point five micromoles per decimetre cubed per second, a concentration rate.

**Visual action:**
1. At *absorbance is not a concentration*, the y-axis label **absorbance** on the `absorbance-time` graph is ringed with side-note *a reading, not an amount of product*; the graph shrinks to the left.
2. At *you make a calibration curve*, a row of six cuvettes appears, colourless to deepest yellow in the one hue, labelled **0, 20, 40, 60, 80, 100 µmol dm⁻³**; at *known concentrations of the yellow product*, the label *standards of known concentration* brackets the row; at *read with the same filter and blank*, each standard passes through the holder in turn by its ridged faces and its reading (**0.00, 0.16, 0.32, 0.48, 0.64, 0.80**) lands as a point on `RateGraph` `calibration` at right, caption *same filter, same blank, same cuvette and volume as the reaction*; the ruled line draws through the six points; at *the colour-standards idea from the Benedict's lesson*, recall tag *recall: 2.1.2, colour standards of known concentration*.
3. At *Read zero point two four across*, `read-across` draws from **0.24** on the absorbance axis to the line; at *thirty micromoles per decimetre cubed*, the vertical drop lands at **30 µmol dm⁻³**.
4. At *Thirty in sixty seconds*, the 60 s point on the left graph and the 30 µmol dm⁻³ reading pulse together; at *a concentration rate*, the result label lands: **30 µmol dm⁻³ ÷ 60 s = 0.50 µmol dm⁻³ s⁻¹**, beside the Beat 3 label **0.0040 s⁻¹ (absorbance)**, the two tagged *rate of change of absorbance* and *concentration rate*.

**On-screen text:** the six standards and readings; *our illustrative standards*; the caption; the read-across; the two rate labels with their tags; the 2.1.2 recall tag.

---

### BEAT 5 · What I told you, how it is asked, and the reject card · 2:51–3:36
**Narration:**
> So, on the colorimeter: blue filter, zeroed on the blank, cuvette fixed in the light path. On the graphs: the straight start, a rate of change of absorbance; the calibration curve, a concentration. Asked why a colorimeter is used, one mark scheme credited the idea that the result is quantitative; asked how, a report stresses the filter choice. And on the card, from a June 2024 report: the intensity of one colour, absorbance at one wavelength. A bit more yellow? Thirty micromoles per decimetre cubed of product in the first minute.

**Visual action:**
1. **No new slide.** At *on the colorimeter*, the screen returns to the layout built through the lesson: `ColorimeterModel` at left with the reaction cuvette in the holder, the `absorbance-time` graph top right, the `calibration` graph bottom right. Static. At *blue filter*, `filter-blue` and the handle tag brighten; at *zeroed on the blank*, the **0.00** on the read-out and the *reaction blank* label brighten; at *cuvette fixed in the light path*, the clear faces and the *fixed* tag brighten.
2. At *the straight start*, the ruled 0–60 s line and its triangle brighten with **0.0040 s⁻¹**; at *the calibration curve, a concentration*, the `read-across` and **0.50 µmol dm⁻³ s⁻¹** brighten.
3. At *Asked why a colorimeter is used*, the layout slides left and a forms surface builds at right, plain, one row per form; row 1: **why use a colorimeter rather than judging by eye** · *our framing; S21/51 Q1(b)(i)*; at *the idea that the result is quantitative*, small type **MS p.7: "idea that (result / it, is) quantitative / AW"**.
4. At *asked how*, row 2: **how the colorimeter is set up** · *our framing; March 2023 Paper 52 Q1(a)(i)*; at *the filter choice*, small type **ER p.14: "the filter used should not be the same as the colour of the solution being tested"**.
5. At *on the card*, the reject card lands, struck through by hand: **✗ The colorimeter measures the solution changing colour, using different wavelengths.** / **✓ The colorimeter measures the absorbance of light of one wavelength band; as the yellow intensifies, the absorbance increases.** Small type: *our composite, built on June 2024 ER, Paper 22 Q4(b)(ii), p.15: "different wavelengths of light rather than different absorbance or transmission values using the same light wavelength"; the report also objects to "changing" colours where the intensity was wanted.* No COMMON MISTAKE badge. At *the intensity of one colour*, the words *one wavelength band* on the ✓ line are underlined in the accent.
6. At *A bit more yellow*, the Beat 1 tube returns small beneath the card; at *Thirty micromoles per decimetre cubed of product*, its empty read-out box fills **0.24 → 30 µmol dm⁻³ after 60 s**. Final frame held 2 s: the forms, the reject card, the small tube with its number. No slogan.

**On-screen text:** the recap highlights in place; the two forms with citations; the reject card with its source line; the answered hook.

---

## Datasets

All values are **our illustrative data**, fixed by `SHARED-SPECS.md` §5 (Dataset A) or chosen here (Dataset B). No value is claimed to come from S21/51 or any other paper.

### Dataset A — demonstration run (= 3.2.1b zero-inhibitor series)

Conditions: reaction cuvette as in the model spec (buffer pH 7.0 1.0 cm³ + ONPG solution 0.5 cm³ + water 0.5 cm³ + enzyme solution 0.5 cm³, total 2.5 cm³), 25 °C, blue filter, zeroed on the reaction blank; timer at mixing.

| t / s | Absorbance | Change over previous 30 s | Concentration of yellow product from Dataset B, A ÷ 0.0080 / µmol dm⁻³ |
|---:|---:|---:|---:|
| 0 (start) | 0.00 | — | 0.00 ÷ 0.0080 = 0.0 |
| 30 | 0.12 | 0.12 − 0.00 = 0.12 | 0.12 ÷ 0.0080 = 15.0 |
| 60 | 0.24 | 0.24 − 0.12 = 0.12 | 0.24 ÷ 0.0080 = 30.0 |
| 90 | 0.35 | 0.35 − 0.24 = 0.11 | 0.35 ÷ 0.0080 = 43.75 ≈ 43.8 |
| 120 | 0.45 | 0.45 − 0.35 = 0.10 | 0.45 ÷ 0.0080 = 56.25 ≈ 56.3 |
| 150 | 0.53 | 0.53 − 0.45 = 0.08 | 0.53 ÷ 0.0080 = 66.25 ≈ 66.3 |
| 180 | 0.60 | 0.60 − 0.53 = 0.07 | 0.60 ÷ 0.0080 = 75.0 |

Derived numbers:
- **The 0 s value is not a reading.** The cuvette goes into the colorimeter just after mixing, so no reading can be taken at exactly 0 s; at mixing no product has formed, so the start point is the blank's zero, 0.00 (shown so in small type in Beat 3). The first reading is at 30 s.
- **Straight initial section:** the 0–30 s and 30–60 s increments are equal (0.12 and 0.12), so the points at 0, 30 and 60 s lie on one straight line; the 60–90 s increment falls to 0.11 and later increments keep falling (0.10, 0.08, 0.07), so the curve bends after 60 s. This is why 0–60 s is used and not a longer interval.
- **Initial rate of change of absorbance** = (0.24 − 0.00) ÷ (60 s − 0 s) = 0.24 ÷ 60 s = **0.0040 s⁻¹** (absorbance has no unit).
- For contrast only (not narrated, not on screen): the **average** rate of change of absorbance over 0–180 s would be 0.60 ÷ 180 s = 0.0033 s⁻¹, lower than the initial rate because the curve bends. It is not used as the initial rate anywhere.
- **Initial concentration rate** (reading converted through Dataset B first, then the gradient taken, as the plan's inhibitor row requires) = (30.0 − 0.0) µmol dm⁻³ ÷ 60 s = **0.50 µmol dm⁻³ s⁻¹**. Cross-check: 0.0040 s⁻¹ ÷ 0.0080 dm³ µmol⁻¹ = 0.50 µmol dm⁻³ s⁻¹. ✓
- Every reading (maximum 0.60 = 75.0 µmol dm⁻³) lies inside the calibrated range 0–100 µmol dm⁻³; no reading is extrapolated beyond the standards.

### Dataset B — calibration standards (chosen here; 3.2.1b uses these values if it converts)

Standards: a stock of the yellow product at **250 µmol dm⁻³** in buffer; each standard is buffer pH 7.0 1.0 cm³ + ONPG solution 0.5 cm³ + (stock + water) 1.0 cm³, total 2.5 cm³, i.e. the same volumes and matrix as the reaction blank with product stock in the water slots. Final concentration = 250 µmol dm⁻³ × (stock volume ÷ 2.5 cm³) = 100 × stock volume (cm³) µmol dm⁻³. Same blue filter, zeroed on the same reaction blank, same cuvette type, 25 °C.

| Stock / cm³ | Water / cm³ | Concentration of yellow product / µmol dm⁻³ | Absorbance |
|---:|---:|---:|---:|
| 0.00 | 1.00 | 250 × 0.00 ÷ 2.5 = 0 | 0.00 |
| 0.20 | 0.80 | 250 × 0.20 ÷ 2.5 = 20 | 0.16 |
| 0.40 | 0.60 | 250 × 0.40 ÷ 2.5 = 40 | 0.32 |
| 0.60 | 0.40 | 250 × 0.60 ÷ 2.5 = 60 | 0.48 |
| 0.80 | 0.20 | 250 × 0.80 ÷ 2.5 = 80 | 0.64 |
| 1.00 | 0.00 | 250 × 1.00 ÷ 2.5 = 100 | 0.80 |

Derived numbers:
- The six points lie on one straight line through the origin: gradient = 0.80 ÷ 100 µmol dm⁻³ = **0.0080 dm³ µmol⁻¹** (absorbance per µmol dm⁻³); check 0.16 ÷ 20 = 0.32 ÷ 40 = 0.48 ÷ 60 = 0.64 ÷ 80 = 0.0080.
- The 0 µmol dm⁻³ standard has exactly the reaction blank's composition, so it reads 0.00 by construction.
- **Read-across used in Beat 4:** absorbance 0.24 → 0.24 ÷ 0.0080 = **30 µmol dm⁻³**.
- The straight line is a property of **these** illustrative standards over 0–100 µmol dm⁻³; the lesson does not state that absorbance is proportional to concentration in general and names no law.

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.20) | Beat(s) | How |
|---|---|---|
| outline the use of a colorimeter | 2, 3, 5 | parts named where they sit; filter choice; zero on the blank; fixed filter and path; readings at stated times; re-zero rule |
| for measuring the progress of enzyme-catalysed reactions | 3, 4 | absorbance against time; initial rate of change of absorbance from the straight 0–60 s section; conversion to a concentration rate by calibration |
| that involve colour changes | 1, 2 | ONPG (colourless) → yellow product; "not every enzyme reaction changes colour, but some do"; blue filter because the yellow product absorbs blue |
| "outline" | 2–4 | procedure only: no optics, no Beer–Lambert law, no instrument electronics (Learner Guide p.15 "Detail is not required.", via EXAMINER-INSIGHT) |
| plan: distinguish an absorbance rate from a concentration rate | 3, 4, 5 | two labelled results, **0.0040 s⁻¹ (absorbance)** and **0.50 µmol dm⁻³ s⁻¹ (concentration)** |
| plan: reuse 2.1.2's standard idea by label | 4 | recall tag *2.1.2, colour standards of known concentration* (the 2.1.2 wording is "comparison to colour standards") |

### Mark-scheme and examiner points → beats

| Source | Point | Beat |
|---|---|---|
| S21/51 Q1(b)(i), MS p.7 (plan; weights S-E) | "idea that (result / it, is) quantitative / AW" | 1 (by eye, a judgement), 3 (why a number beats the eye), 5 (row 1) |
| March 2023 ER, Paper 52 Q1(a)(i), p.14 (plan) | "the filter used should not be the same as the colour of the solution being tested"; plan's paraphrase: calibrated, zeroed with distilled water, coloured filter | 2 (filter, zero), 4 (calibration), 5 (row 2) |
| June 2024 ER, Paper 22 Q4(b)(ii), p.15 (plan; weights evidence-gaps paragraph) | "different wavelengths of light rather than different absorbance or transmission values using the same light wavelength"; "changing" colours instead of intensity; plan's paraphrase: accuracy versus subjective judgement, quantitative results, calibration curves | 1, 2 (one band of colour), 4 (calibration), 5 (reject card) |
| Specimen 2022 P3 Q1(b)(i–ii) (weights S-C) | absorbance from a colorimeter plotted against temperature | ledger only (3.2.1 owns the temperature explanation) |
| S21/51 Q1 (weights S-E) | β-galactosidase/ONPG with colorimeter; DV absorbance | 1–3 (the chosen demonstration assay; our values, not the paper's) |
| June 2023 ER p.58 (plan's pointer: "a colorimeter is not appropriate for every colour observation") | wording not in the verified files | 1 (own teaching: "Not every enzyme reaction changes colour, but some do"); `UNVERIFIED` below |

### Absolutes sweep (own)

Every narrated sentence containing *every, all, always, never, only, no, nothing, cannot, because, needs, must* was reread; so were *is not*, *why* and *so* clauses.
- "Not every enzyme reaction changes colour, but some do" (Beat 1): a bounded statement matching the outcome's own "reactions that involve colour changes".
- "by eye you are left with a judgement, and two people may judge it differently" (Beat 1): "may"; no claim that eyes always disagree or are always wrong.
- "a filter, which lets through one band of colour" (Beat 2): describes the filter's job, not the instrument's optics.
- "the more of that light the sample absorbs, the higher the number" (Beat 2): the definition of the read-out's direction; no proportionality stated.
- "the yellow product absorbs blue light, so you choose a blue filter, not the colour of the solution" (Beat 2): for this yellow product; the March 2023 report's wording is shown, not extended into a universal filter table.
- "if the filter or the blank conditions change, zero again" (Beat 2): the plan's re-zero rule; no claim about how often re-zeroing is needed otherwise.
- "For the first sixty seconds the line is straight" (Beat 3): about these data (Dataset A increments 0.12, 0.12).
- "That is why a number beats your eye: you can calculate a rate, and compare one run with another" (Beat 3): the stated reason is what the number permits; no claim that eye judgements are useless (2.1.2's colour standards are recalled with respect in Beat 4).
- "absorbance is not a concentration" (Beat 4): definitional.
- "one mark scheme credited", "a report stresses the filter choice" (Beat 5): each bounded to its question; no "always", no "full marks needed", no "examiners want".
- "the intensity of one colour, absorbance at one wavelength" (Beat 5): the June 2024 report's point for that question.
- No sentence says the colorimeter "measures colour", "measures concentration", or works for every assay; no sentence names Beer–Lambert or proportionality; no sentence calls distilled water a wrong blank.

---

## Citations

Every quotation, with its location and the verified file it was copied from.

| Quotation (verbatim) | Paper / session / question / page | Copied from |
|---|---|---|
| "outline the use of a colorimeter for measuring the progress of enzyme-catalysed reactions that involve colour changes" | Syllabus 2025–2027, 3.1.4, p.20 | `SYLLABUS-9700-DETAIL.md` |
| "comparison to colour standards" (within 2.1.2) | Syllabus 2025–2027, 2.1.2, p.17 | `SYLLABUS-9700-DETAIL.md` (header/ledger only) |
| "idea that (result / it, is) quantitative / AW" | S21/51 Q1(b)(i), MS p.7 | `TOPIC-PLAN-03-ENZYMES.md` §3.1.4 |
| "the filter used should not be the same as the colour of the solution being tested" | March 2023 ER, Paper 52 Q1(a)(i), p.14 | `TOPIC-PLAN-03-ENZYMES.md` §3.1.4 |
| "different wavelengths of light rather than different absorbance or transmission values using the same light wavelength" | June 2024 ER, Paper 22 Q4(b)(ii), p.15 | `TOPIC-03-WEIGHTS.md`, evidence-gaps paragraph |
| "changing" (the single quoted word inside the weights' paraphrase "'changing' colours instead of intensity") | June 2024 ER, Paper 22 Q4(b)(ii), p.15 | `TOPIC-03-WEIGHTS.md`, evidence-gaps paragraph |
| "are addressed in normal teaching; no separate error beat is allocated to them in this plan" | plan's record for 3.1.4 | `TOPIC-PLAN-03-ENZYMES.md` §3.1.4 (header only) |
| "No sampled mark in the enzyme sense" | weights, 3.1.4 rationale | `TOPIC-03-WEIGHTS.md` (header only) |
| "Detail is not required." | Learner Guide 2022, p.15 (outline guidance) | `EXAMINER-INSIGHT-9700.md` §4 (header/ledger only) |

Framings (never shown in quotation marks as a paper's words): Beat 5 row 1 *why use a colorimeter rather than judging by eye* is **our framing of S21/51 Q1(b)(i)**; row 2 *how the colorimeter is set up* is **our framing of March 2023 Paper 52 Q1(a)(i)**. The reject card's ✗ line is **our composite** built on the June 2024 ER p.15 words above, not a transcript.

**UNVERIFIED items:**
- `UNVERIFIED — S21/51 Q1(b)(i) question wording` (needed only if a verbatim header is wanted in Beat 5; a labelled framing is used instead).
- `UNVERIFIED — March 2023 Paper 52 Q1(a)(i) question wording and the substance being assayed` (the plan quotes only the report's filter sentence; its "calibrated, zeroed with distilled water, coloured filter" is the plan's paraphrase and is not quoted).
- `UNVERIFIED — June 2024 Paper 22 Q4(b)(ii) question wording and context, and the full report sentence around "changing"` (the card is captioned as our composite for this reason).
- `UNVERIFIED — the June 2023 ER p.58 wording on when a colorimeter is not appropriate` (the plan gives the location only; the brief for this lesson named it "June 2024 ER p.58", the plan says June 2023; the plan's location is used here). The idea appears only as our own teaching in Beat 1, without quotation marks.
- `UNVERIFIED — S21/51's own assay conditions (ONPG concentration, volumes, temperature, filter, reading times)`. None is claimed; every number in this storyboard is ours or SHARED-SPECS'.

---

## Word count and runtime

Counted by `work/005/validate_storyboard.py` over the blockquoted narration (hyphen/en-dash compounds count as one word; no silent reads in this lesson), at 120 words per minute of final video.

| Beat | Words | Seconds (words ÷ 120 × 60) | Window |
|---|---:|---:|---|
| 1 Hook, context, objectives | 86 | 43.0 | 0:00–0:43 |
| 2 The colorimeter, the filter and the zero | 118 | 59.0 | 0:43–1:42 |
| 3 Absorbance against time | 76 | 38.0 | 1:42–2:20 |
| 4 The calibration curve | 61 | 30.5 | 2:20–2:50.5 |
| 5 Recap, forms, reject card | 91 | 45.5 | 2:50.5–3:36 |
| **Total** | **432** | **216.0 = 3:36** | budget **3:15** (390 words) |

Error-beat time: **0** (no error beat; the reject card is 17 words inside Beat 5's close, "And on the card … at one wavelength").

**Length, honestly:** **432 words, 3:36, which is 0:21 (42 words) over the 3:15 budget.** The first draft was 486 words (4:03); 54 words of repetition and signposting were cut ("Here is the colorimeter", "Now run it", "Now the filter", the spoken 0.24 ÷ 60 working now carried on screen, a second statement of the filter rule in the recap, and wordier hook and recap phrasing). Where the remaining time sits: Beat 2 (59 s) carries every procedural element the plan names for an outline — the five parts where they sit, the handling, the filter chosen by what the product absorbs with its handle and precise sentence, zeroing on the blank, the fixed filter and path, and the re-zero rule — and Beat 5 (45.5 s) carries the in-place recap, three evidence-based exam forms and the answered hook. There is no error beat to trim and no remaining repetition beyond the required recap. **Recommendation: accept the 21 s.** **Optional cut list, in order, if the conductor wants ~3:26:** (1) Beat 4 "the colour-standards idea from the Benedict's lesson" (7 words; the 2.1.2 recall tag stays on screen; remap that cue to *read with the same filter and blank*); (2) Beat 5 ", cuvette fixed in the light path" (6 words; remap that highlight to *zeroed on the blank*); (3) Beat 1 ", and two people may judge it differently" (7 words; the two eye-tags stay on screen and carry the objectivity point). Together 20 words, 10 s. Never speed the narration.

---

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| Instrument optics (lenses, gratings, photocells), transmission–absorbance conversion, Beer–Lambert law | not in the outcome ("outline"; plan: "no instrument optics, no Beer–Lambert law") |
| Transmission as the displayed quantity | mentioned only in the June 2024 quotation on the card; the lesson reads absorbance throughout (the plan allows "absorbance (or transmission)") |
| ONPG/ONP structures; the hydrolysis reaction; galactose as the second product | not drawn (plan: "3.1.4 … no new chemistry"; names are context) |
| Effect of inhibitor concentration using this assay; re-zeroing on each inhibitor concentration's own blank | 3.2.1b |
| Temperature investigated with colorimeter readings (Specimen P3 Q1(b)) | 3.2.1 |
| Km and Vmax from S21/51 Q1(c) | 3.2.2-3 |
| Non-enzymic colour change and time-matched blank readings | not taught; the blank is used to set zero only (flagged as an interpretation) |
| The by-eye iodine endpoint (a colour switch read on a tile, not a solution in a cuvette) | 3.1.3 (not recalled here) |

---

## Reusable models

What **3.2.1b inherits** from this lesson, to be copied exactly:

| Item | Value 3.2.1b copies |
|---|---|
| `ColorimeterModel` | light source → filter → cuvette in its holder (clear faces in the light path, handled by the ridged faces) → detector → absorbance read-out with zero button; cutaway, schematic caption; handling contract |
| Filter | **blue** (`filter-blue`); the yellow product absorbs blue; filter not the colour of the solution |
| Zeroing | on the reaction blank = buffer + ONPG + water in place of enzyme; **3.2.1b zeroes on each inhibitor concentration's own blank** (buffer + ONPG + inhibitor X at that concentration + water in place of enzyme); re-zero if filter or blank conditions change |
| Volumes | buffer pH 7.0 1.0 cm³ + ONPG solution 0.5 cm³ + **0.5 cm³ slot** (water here; inhibitor X solution at the stated concentration, or its solvent for zero, in 3.2.1b) + enzyme solution 0.5 cm³ added last; total 2.5 cm³ |
| Conditions | buffer pH 7.0; all solutions at 25 °C; timer at mixing; readings every **30 s**, 0–180 s |
| Rate | initial rate of change of absorbance = gradient over **0–60 s**; unit s⁻¹ |
| Demonstration series | **0.00, 0.12, 0.24, 0.35, 0.45, 0.53, 0.60** = 3.2.1b's zero-inhibitor series → **0.0040 s⁻¹** |
| Calibration (only if 3.2.1b converts) | standards 0, 20, 40, 60, 80, 100 µmol dm⁻³ → absorbance 0.00, 0.16, 0.32, 0.48, 0.64, 0.80; gradient **0.0080 dm³ µmol⁻¹**; conversion = absorbance ÷ 0.0080; convert readings first, then take the 0–60 s gradient (zero-inhibitor: **0.50 µmol dm⁻³ s⁻¹**); keep readings inside 0–0.80 |
| `RateGraph` `absorbance-time` | y *absorbance* (no unit), x *time / s*; `straight-initial` overlay with rise/run triangle; label always "rate of change of absorbance" |
| `RateGraph` `calibration` | y *absorbance*, x *concentration of yellow product / µmol dm⁻³*; `read-across` overlay |
| Colour rule | one yellow hue, opacity only; blank colourless |

Also reusable: the handle and sentence (*yellow soaks up blue* → *the yellow product absorbs blue light, so a blue filter is used*); the reject card.

---

## Assets

| Asset | Status | Source |
|---|---|---|
| `ColorimeterModel` cutaway SVG with five labelled parts, holder lid, zero button, `filter-blue` state, light band | **new build** | authored |
| Cuvette with ridged and clear faces; lid; hand pose holding ridged faces; pipette | new | authored |
| Yellow-hue opacity ramp for cuvette contents (one hue) | new | authored |
| `RateGraph` `absorbance-time` and `calibration` configurations with `straight-initial` and `read-across` overlays | **extend** 3.1.3's component | authored |
| Gas-syringe inset (Beat 1 recall) | reuse | 3.1.3 `GasSyringeRig` |
| Objectives surface; forms surface; reject card | shared | existing |
| Micrographs, photographs, Cambridge artwork | none | — |

---

## Validator run

`python3 work/005/validate_storyboard.py storyboards/topic-03/3.1.4/STORYBOARD.md`

```
beat  words  cues maxgap  status
   1     86    12     16  ok
   2    118    18     17  ok
   3     76    11     14  ok
   4     61     9     14  ok
   5     91    14     11  ok
TOTAL words 432  cues 64  runtime at 120 wpm 3:36.0  beats 5  failing beats 0
```

---

## Conductor review (cloud run 005)

Review against the cleared 3.1.1-2 and 3.2.2-3 storyboards and their CHECK reports, and for consistency across the five lessons. Changes made after the author's draft:

- **The 0 s point is not a reading.** The cuvette goes in just after mixing, so a reading at exactly 0 s is impossible. The start point is now labelled on screen and in Dataset A as the blank's zero at mixing (0.00); the first reading is at 30 s. No number changed.
- The brief's "June 2024 ER p.58" was the conductor's slip; the plan's citation (June 2023 ER p.58) is used, and its wording stays UNVERIFIED.
