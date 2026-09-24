# Cloud run 005 — summary: the five remaining Topic 3 (Enzymes) storyboards

> **Status after round-one checks (24 Sep 2026).** This summary describes the first drafts. Round-one checks (3.1.4 CLEARED WITH MINOR EDITS; the other four NOT CLEARED) have been applied — see `work/005/FIXES-round-1.md`. Current lengths: 3.1.3 1,418 words 11:49; 3.1.4 425 words 3:32.5; 3.2.1 966 words 8:03; 3.2.1b 1,466 words 12:13 (kept as one lesson; split deferred to Durai); 3.2.4 825 words 6:52.5; all validators 0 failing beats. Where this file says handling was "checked on still frames", read "handling specified; rendered still-frame verification pending" (no render exists). The quote checker still lists each storyboard's self-quotations; every external quotation is found.


24 September 2026. Branch `cloud/005-storyboards`. Text only: no audio, no renders, no build.
Five authors wrote the storyboards in parallel from one shared brief (`work/005/SHARED-SPECS.md`, which
fixes the cross-lesson conditions, numbers and handoffs). The conductor then reviewed each one against
the two cleared storyboards (3.1.1-2, 3.2.2-3) and their CHECK / CHECK-R2 reports, made the edits listed
in each storyboard's final section *Conductor review (cloud run 005)*, and re-ran the validator.

Tools in `work/005/`:
- `validate_storyboard.py` checks four things: cues are exact (case-sensitive), unique within the beat
  (case-insensitive), and in spoken order, and no stretch runs over 30 words without a cue. It also
  counts words, and runtime = words ÷ 120. Run against the two cleared storyboards it reproduces the
  checker's own counts (3.1.1-2: 1,903 words / 190 cues; 3.2.2-3: 1,929 / 184 and its accepted 31-word
  gap).
- `check_quotes.py` lists every double-quoted string that is not found verbatim in the plan, the
  weights, EXAMINER-INSIGHT or the syllabus detail. For all five storyboards, every quotation of
  external evidence is found. What remains in its output is each storyboard quoting its own narration
  (the absolutes sweeps) plus one Learner Guide phrase in 3.1.3 whose inner quote marks differ from the
  source's (not fixed).

## Totals

| Code | Title | Beats (teaching + error) | Words | Runtime | Budget | Over | Error beats | Validator |
|---|---|---|---:|---:|---:|---:|---|---|
| 3.1.3 | Measuring how fast: catalase and amylase | 15 (14 + 1) | 1,428 | 11:54 | 10:15 | +1:39 | E42 (146 words, 73 s) | 160 cues, 0 failing |
| 3.1.4 | Following a colour change: the colorimeter | 5 (5 + 0) | 432 | 3:36 | 3:15 | +0:21 | none (per plan) | 64 cues, 0 failing |
| 3.2.1 | Working conditions: temperature and pH | 11 (11 + 0) | 963 | 8:01.5 | 7:00 | +1:01.5 | none (per plan) | 138 cues, 0 failing |
| 3.2.1b | Availability and competition: enzyme, substrate and inhibitor concentration | 13 (10 + 3) | 1,462 | 12:11 | 8:45 | +3:26 | E40 160 w (80 s), E38 156 w (78 s), E39 156 w (78 s) | 177 cues, 0 failing |
| 3.2.4 | Trapping the enzyme: immobilised in alginate | 12 (12 + 0) | 788 | 6:34 | 6:00 | +0:34 | none (per plan) | 115 cues, 0 failing |
| **Total** | | **56 (52 + 4)** | **5,073** | **42:16.5** | **35:15** | **+7:01.5** | 4 | 654 cues, 0 failing |

**Where the overrun sits (honest accounting).** Error beats: 618 words = 5:09 against four 45 s
allowances (3:00), so +2:09. None was thinned. Each runs 73–80 s, a little above the 65–75 s guide,
because E40 and E39 each correct two faults with the marker held. Teaching accounts for the other
+4:52.5:
- 3.1.3: +1:11 over its 9:30 base
- 3.1.4: +0:21
- 3.2.1: +1:01.5
- 3.2.1b: +1:45 over its 6:30 base
- 3.2.4: +0:34

Every storyboard lists its remaining teaching-only cuts in order. **3.2.1b is the one that needs a
ruling.** Its three complete investigations, the standalone recall and three evidenced error beats do
not fit 8:45. The plan's own budget (6:30 teaching + 3 × 45 s) predates the measured 65–80 s cost of a
five-move beat.

## Per lesson

### 3.1.3 — 15 beats, 1,428 words, 11:54 (budget 10:15)
- **E42 (Beat 13).** Badge COMMON MISTAKE, on the basis of "Candidates often referred to gas being
  produced…" (June 2023 ER P51 p.52). The card is a labelled composite of two questions (P51 Q1(d)(i),
  P52 Q1(d)) with three faults: produced, average, amount. The marker clears on the completed correct
  frame. The ruling is kept local, and "average rate" stays valid.
- **What it publishes.** `RateGraph` (configurations and overlays), `GasSyringeRig`, `WaterBathRig` and
  `BufferedTubeRig` basic states, `CatalaseDiscRig`, `AmylaseIodineSampler`, the `CatalaseNet` edge list
  and valence audit, and the `Hydrolyse` replay spec.
- **Standard catalase run.** Initial rate 0.40 cm³ s⁻¹ (tangent triangle 20.0 cm³ ÷ 50 s; straight
  section 12.0 ÷ 30). Average rate 0–60 s = 0.32 cm³ s⁻¹. Maximum reading 23.5 cm³, under the 24 cm³
  stoichiometric ceiling.
- **Disc and amylase examples.** Disc: 13 s mean → 0.077 s⁻¹. Amylase endpoint: 150 s → 0.0067 s⁻¹.
  S23/34 is shown only as the ER/QP 54 g and 5.4 g min⁻¹.
- **UNVERIFIED (6):**
  1. Specimen P2 Q3(c) instruction wording
  2. What substance the 54 g in S23/34 is, and the wording of the ER p.33 sentence
  3. P51 Q1(d)(i) wording
  4. P52 Q1(d) context and wording
  5. S21/33 Q1(b)(iii) wording
  6. The S23/12 Q14 stem and figure, and the S22/33 Q1(a) method text

  All are shown as labelled framings or not shown at all.
- **Interpretations.**
  - The flask is held in the bath by a weighted ring, not clamped at the neck, so it can be tilted.
  - The amylase run uses 5.0 cm³ amylase and 5.0 cm³ of 1.0% starch.
  - The rate–time graph is drawn as a labelled schematic.
  - SHARED-SPECS asked this lesson to equilibrate the two liquids separately, while the plan says
    3.2.1 adds that state. It is resolved by publishing `maintained` / `equilibrating` here, with the
    two liquids kept apart inside the flask; 3.2.1 adds the multi-temperature version.

### 3.1.4 — 5 beats, 432 words, 3:36 (budget 3:15)
- **No error beat** (the plan records why). The reject card is an honestly captioned composite on June
  2024 ER P22 Q4(b)(ii) p.15, with no badge.
- **What it publishes.** `ColorimeterModel` and the ONPG assay that 3.2.1b uses:
  - blue filter, zeroed on the reaction blank
  - a 2.5 cm³ cuvette (buffer 1.0 + ONPG 0.5 + 0.5 cm³ water or inhibitor slot + enzyme 0.5 added last)
  - readings every 30 s
  - series 0.00 … 0.60, initial rate 0.24 ÷ 60 s = 0.0040 s⁻¹
  - calibration line 0.0080 per µmol dm⁻³, converting to 0.50 µmol dm⁻³ s⁻¹
- **UNVERIFIED (5):**
  1. S21/51 Q1(b)(i) wording
  2. March 2023 P52 Q1(a)(i) wording and what was assayed
  3. June 2024 P22 Q4(b)(ii) wording, and the full report sentence around "changing"
  4. The June 2023 ER p.58 wording on when a colorimeter is not appropriate
  5. S21/51's own assay conditions
- **Interpretations.**
  - Buffer pH 7.0 and all volumes are the author's choices.
  - The 0 s point is the blank's 0.00 at mixing, not a reading (clarified on review).
  - Zeroing is on the reaction blank. The plan's paraphrase "zeroed with distilled water" (March 2023)
    is not quoted and not contradicted.

### 3.2.1 — 11 beats, 963 words, 8:01.5 (budget 7:00)
- **No error beat.** It closes on S24/32 Q1(b)(ii), with the verbatim QP instruction and MS points from
  the weights.
- **Standalone.** It speaks the shared grammar sentence verbatim. It publishes the `denatured` motion
  (R-group hydrogen and ionic links vanish, the backbone is never cut, the caption says "denatured") and
  a reversible `ph-shifted` sub-state.
- **Temperature.** 10–50 °C, enzyme and substrate equilibrated separately for 10 min. Means 0.15, 0.26,
  0.40, 0.53, 0.21 cm³ s⁻¹, so the optimum lies between 30 and 50 °C "for this catalase, in this
  set-up". The S22/33 Q1(b) preheat-and-disc design is shown as a different experiment, with no claim
  about room temperature.
- **pH (disc method).** pH 5–9, fresh peroxide for each disc. Means 29, 17, 13, 12, 21 s, so 1/mean =
  0.034, 0.059, 0.077, 0.083, 0.048 s⁻¹ and the optimum lies between pH 7 and 9. The overlap of the
  pH 7 and pH 8 ranges is noted on screen.
- **UNVERIFIED: none.** The S22/33 Q1(b) QP text and the S24/32 table and figure are deliberately not
  shown.
- **Interpretations.**
  - Yeast for the disc series is suspended in water, so the only buffer is the one being varied.
  - The pH series runs in the 30 °C bath, with a 60 s soak.
  - The handle is "press studs, not stitches", converted at once into the credited sentence. This is
    an invented metaphor, so a checker may rule on it; cut (3) removes it.
  - `EnergyProfileGraph` is not recalled.

### 3.2.1b — 13 beats, 1,462 words, 12:11 (budget 8:45)
- **Error beats (all COMMON MISTAKE, basis stated on each panel).**
  - E40 (Beat 6): the MS p.18 ignore line plus Learner Guide p.19. Two faults, each corrected
    separately, with the marker held until both are done.
  - E38 (Beat 8): the MS p.17 ignore line.
  - E39 (Beat 10): June 2023 ER p.26, using the report's own "the majority" / "Many" wording. Two
    faults. The S23/31 interval is 60–140.
- **Standalone.** Own hook, then a labelled recall of 3.2.1 (tag *recall: 3.2.1*, grammar sentence
  verbatim), own objectives, recap and close. The exam close is a labelled framing of S21/22 Q5(c).
- **Datasets (one table each).**
  - A, amylase dilutions 0.20–1.00 %: mean endpoints 910, 460, 310, 230, 180 s → 1/t 0.0011–0.0056 s⁻¹.
    That is proportional to concentration within rounding; consecutive means differ by more than the
    30 s resolution.
  - B, peroxide 0.10–0.50 mol dm⁻³: mean initial rates 0.21, 0.40, 0.53, 0.59, 0.61 cm³ s⁻¹. The 0.20
    row is 3.2.1's 30 °C repeats.
  - C, inhibitor X 0–2.0 mmol dm⁻³ in the 3.1.4 cuvette, each concentration zeroed on its own blank:
    initial rates 0.0040, 0.0030, 0.0023, 0.0020, 0.0017 s⁻¹. The zero row is the 3.1.4 series.
- **UNVERIFIED (6):**
  1. S21/22 Q5(c) QP p.12 instruction
  2. S21/22 Q5(c) MS points other than the ignore line
  3. S23/31 Q1(b)(i) QP instruction
  4. Learner Guide p.28 wording
  5. S21/22 Q5(d)(i) context beyond "higher Vmax"
  6. S21/51 QP wording for the inhibitor method
- **Interpretations.**
  - E40's "per unit time" reason is our own design argument: every tube breaks down about the same
    starch by its endpoint.
  - The S21/22 ignore line is kept local ("explaining a higher maximum rate"), with S23/34's positive
    wording shown as a boundary.
  - The inhibitor series is one run per concentration, labelled so.
  - The inhibitor token docks at no specified site; mechanisms are handed to 3.2.2-3.
  - The handle is "busy tills", paired with the credited plateau sentence.

### 3.2.4 — 12 beats, 788 words, 6:34 (budget 6:00)
- **No error beat and no badge.** The reject card is captioned *our wording contrast; not an
  examiner-reported error*.
- **The comparison.** Equal nominal input (2.0 cm³ of the same stock, in 80 counted beads or free), with
  an enzyme-free bead control. Endpoints: free 150 s (0.0067 s⁻¹), beads 330 s (0.0030 s⁻¹), control
  none within 600 s. The resolution windows do not overlap.
- **Honest inference (Beat 7).** Diffusion and enzyme lost during bead-making and rinsing are both
  possible causes, and this comparison cannot separate them. "A lower rate is not guaranteed".
- **Re-use and advantages.** Re-use is a separate run: 360 s, one interval from the first run, so no
  change is claimed. Advantages are stated with "can". Product removal is worded as the plan words it
  (a flow-through column; a closed tube does not keep removing product).
- **UNVERIFIED (3):**
  1. Specimen P2 Q3(b)(ii)/(iii) question wording
  2. Learner Guide p.18
  3. W20/21 Q2(b) wording beyond the plan's context sentence
- **Interpretations.**
  - The starting starch concentration is comparable, not identical. The free tube starts at 0.71%; the
    liquid around the beads starts at 1% until starch diffuses in. This is disclosed as a limitation.
  - The rinse-water check is shown on screen as a method only, with no result invented.

## Cross-lesson consistency (checked)
- **Lesson names.** Lessons are named only by code. No L-names and no model names appear in any
  storyboard; "killed" appears nowhere.
- **One catalase standard across three lessons.** 30 °C, 5.0 cm³ yeast, 10.0 cm³ of 0.20 mol dm⁻³
  peroxide gives 0.40 cm³ s⁻¹ in 3.1.3, as the 30 °C mean in 3.2.1, and as the 0.20 row in 3.2.1b.
- **Disc pH 7.0 row.** 12, 13, 14 s, mean 13 s, 0.077 s⁻¹ in both 3.1.3 and 3.2.1.
- **Amylase endpoint.** 150 s, 0.0067 s⁻¹ in 3.1.3 and for the free tube in 3.2.4, both by the same
  30 s spotting-tile sampler with the one-frame blue-black / yellow-brown switch.
- **ONPG handoff, 3.1.4 → 3.2.1b.** Same cuvette volumes, filter, own-blank zeroing, 30 s readings,
  0–60 s gradient; the zero-inhibitor row equals the 3.1.4 series.
- **Recall, 3.2.1 → 3.2.1b.** The same grammar sentence verbatim, and the `denatured` state; 3.2.1b's
  recall is labelled.
- **`RateGraph`.** Endpoint methods are never labelled "initial rate". The substrate-concentration axis
  is published as "initial rate of reaction", with the x-axis concentration, as 3.2.2-3 expects.

## Interpretations and issues for the conductor
1. **The `CatalaseNet` atom mapping (plan §3.1.3).** The plan's edge list makes O₂ from one oxygen of
   each peroxide molecule. As net-reaction bookkeeping it balances and passes the valence audit, and
   3.1.3 uses it exactly. For real catalase, though, isotope-labelling work shows the O₂ comes from a
   single peroxide molecule. 3.1.3's narration was therefore changed so it no longer states atom fates:
   the inset is called bookkeeping, and small type says no pathway is implied. **Consider revising the
   plan's edge list** so both O₂ atoms come from one molecule. One valid version: delete O1–H1, O2–H2
   and O3–O4; raise O1–O2 to a double bond; create O3–H1 and O4–H2. It passes the same audit.
2. **The 3.2.1b length (+3:26)** needs a ruling: accept, cut further teaching, or re-plan the budget.
3. **SHARED-SPECS errata, already corrected in the storyboards.** The reading "at 0 s" in the ONPG
   assay is a start point, not a reading. The June 2023 / June 2024 ER p.58 citation is resolved to the
   plan's June 2023.
4. **Two invented handles** (3.2.1 "press studs, not stitches"; 3.2.1b "busy tills") are each paired
   with the credited sentence. VIDEO-STRUCTURE calls invented metaphors riskier, so a checker may rule
   on them.
5. **The grammar sentence.** The SHARED-SPECS wording ("on whether the active sites stay functional")
   paraphrases the plan's ("whether the active site remains functional"). It is used verbatim in
   3.2.1, 3.2.1b and 3.2.4.
