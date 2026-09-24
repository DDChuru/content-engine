# Cloud run 005 — fixes for round-one checks

Response to `cloud-checks/005/round-1/` on `origin/cloud/005-checks` (README + five CHECK.md), 24 September 2026. Each storyboard's full item-by-item table is in its own `## CHECK RESPONSE (round 1)` section; the compact tables below list, per code, each CHECK item and what changed.

## Cross-cutting (README), applied in all five

| README item | Where applied |
|---|---|
| 1. Timing starts AT MIXING | 3.1.3 (gas tilt, amylase pour, both controls), 3.1.4 (enzyme's first contact), 3.2.1 (gas tilt), 3.2.1b (amylase pour, gas tilt, ONPG enzyme contact), 3.2.4 (starch reaching enzyme/beads, tubes A, B, C, B2): the stopwatch starts on the frame the reactants first meet and is never reset; later cues only highlight the running clock. **Disc-rise exception (conductor ruling):** in the disc method the timed quantity is defined as time from release, so the timer starts at release, with an identical brief descent for every disc (3.1.3, 3.2.1). |
| 2. No text-only frames | Objectives surfaces keep their own styled world (VIDEO-STRUCTURE) but every line carries authored pictograms; hooks open on a picture; forms/exam closes keep the familiar apparatus, model or graphs on screen throughout (all five). |
| 3. Measured vs calculated | Assumed start points drawn as open points (*assumed start; not measured* / *set before mixing, not a timed reading*); tangent-triangle corners tagged *on the tangent, not a reading*; means, reciprocals and conversions tagged *calculated*; nominal quantities tagged *nominal* / *not measured* (all five). |
| 3.2.1b length | Kept as ONE lesson; the checker's split after Beat 6 is deferred to Durai. |

## Conductor alignment across lessons (not CHECK items)

- One gas-syringe rig in 3.1.3, 3.2.1, 3.2.1b: 250 cm³ flask, offset small tube, ~30° tilt and toppling path as 3.1.3 specifies (3.2.1's "about 50°" replaced by a reference to that spec; 3.2.1b's flask given the same reference); three-way tap (vent during equilibration, then plunger to 0 cm³ and tap to collect: *baseline 0 cm³ set after equilibration; collection path gas-tight*); gas control = 5.0 cm³ of the same enzyme-free buffer solution, pH 7.0. Remaining difference noted for the checker: in 3.1.3 the bung is seated after the 10 min equilibration, in 3.2.1 and 3.2.1b it is seated before with the tap venting; both keep the collection path closed before mixing.
- One iodine sampler: every blue-black well drawn the same shade (3.2.1b, 3.2.4 aligned to 3.1.3).
- ONPG assay (3.1.4 → 3.2.1b): 3.1.4's M1 assumed-origin ruling carried into 3.2.1b Dataset C and Beat 11.
- `work/005/SHARED-SPECS.md` corrected to match (errata section at its end).

## 3.1.3

Check: NOT CLEARED → all MUST-FIX and SHOULD-FIX items applied; E42 untouched. Narration changed in Beats 6, 7, 10, 11, 15 only. Full table: `## CHECK RESPONSE (round 1)` in the storyboard.

| Item | Status | Change |
|---|---|---|
| M1a gas start | applied | `tilt` = one atomic event: stopwatch and collection start on the frame the first yeast suspension touches the peroxide; later cues highlight it; never reset. Beat 6: "Tilt the flask by its neck so the small tube tips and the yeast spills into the peroxide, starting the timer as they first meet. That is time zero: stand the flask back in the bath…" |
| M1b inner-tube geometry | applied with interpretation | Flask 250 cm³ (was 100) and tilt about 30° (was 60°); tube about 45 × 18 mm, offset toward the rising side; toppling path ends at about 120° from upright, mouth below base, stream from the rotated lip; weighted ring over the neck, resting on the shoulders, hand above it. Capacity changed for clearance. |
| M1c amylase start | applied | Checker's text pasted verbatim into Beat 10 action 7. Narration: "Pour the amylase into the starch, starting the timer as they first meet, then mix." |
| M1d first sample | applied | "Immediately after mixing, then every thirty seconds"; clock not frozen at 0; *start sample: taken immediately after mixing (nominal 0 s)*; times recorded at withdrawal; tile filled before the pour. |
| M2a control tube, sampling | applied | Tubes A and B, each with its own stopwatch, dropper and rinse beaker; rinse water expelled into waste before each draw; no liquid returned to either reaction. |
| M2b buffer-matched controls | applied | "5.0 cm³ of the same enzyme-free buffer solution, pH 7.0" for gas and amylase; Beat 6 "Then repeat with an enzyme-free control: the same buffer, no yeast."; Beat 7 "the enzyme-free control stays at zero"; cited "replaced by water" kept and marked separately as our operational version. |
| M2c volumes, tools, disc mixing | applied | 5.0 cm³ + 5.0 cm³ of 1.0% starch shown where measured; pipettes, cylinder and forceps labelled; disc preparation mixed before each soak. |
| M2d handling | applied | Peroxide and iodine contact tags, eye-protection pictogram; test-tube holder for the amylase tube. |
| M3 text-only frames | applied | Beat 1 potato, dropper and stopwatch from frame 1; Beat 2 pictograms (gas bubbles, iodine drop, clock, clock-and-tag) on the objectives surface; Beat 3 cylinder and clock from frame 1; Beat 15 lesson layout from entry. |
| M4 potato 0.40 | applied | Potato inset: **same measurement method; potato rate not measured here**; triangle label **illustrative yeast run: initial rate = 0.40 cm³ s⁻¹** on the yeast graph. |
| M5 S23/34 reading | applied | **schematic reconstruction of the registered reading; original figure unavailable**: 0.16 mmol dm⁻³ against 54 g, one point; **54 ÷ 10 = 5.4 g min⁻¹, average over 10 min**; provenance QP p.8, ER p.33; ER-sentence limitation flagged. |
| Assets / handling claim | applied | "handling specified; rendered still-frame verification pending". |
| Audit notes | applied | Ceiling: room-condition assumption stated and scoped; 0–30 s drawn straight; single-run readings, no invented replicates. |
| Cuts | done | Cut 1 taken (−23 words; the row stays on screen). Cuts 2 and 5 not recounted. Cuts 3 and 4 kept. |
| Cross-cutting 1–3 | applied | Timer at first contact (gas, amylase, both controls); no text-only frames; gas 0 s point marked *set before mixing, not a timed reading*; amylase start sample marked *nominal 0 s*. |
| 3.2.1 alignment | applied | Three-way tap (vent, then baseline 0 cm³ and collect); wording "enzyme-free control"; disc timed from release after the same brief descent (conductor's ruling, a deliberate exception to cross-cutting 1). |

Validator: `TOTAL words 1418  cues 162  runtime at 120 wpm 11:49.0  beats 15  failing beats 0` (was 1,428 = 11:54). Quote check: every external quotation found.

## 3.1.4

Check: `work/005/checks-round-1/3.1.4-CHECK.md` (CLEARED WITH MINOR EDITS). Storyboard matched the reviewed SHA-256 before editing. Full table in the storyboard's `## CHECK RESPONSE (round 1)`.

| Item | Change |
|---|---|
| M1 | Model-spec Sequence, Beat 3 actions 1–2, Dataset A first derived bullet, Reusable-models Conditions replaced verbatim. Timer starts at enzyme's first contact, never restarted; no 0 s read-out; (0 s, 0.00) drawn as open point *assumed start; not measured*. New cue *mix, start*. |
| M2 | Product stock *in water*; matrix sentence replaced; same-stocks/assumptions paragraph added; caption *same filter, same blank, same cuvette type, optical path and total volume as the reaction* in model spec and Beat 4. |
| M3 | Beat 5 recap: blank (not reaction cuvette) in holder, caption *recap: zeroing on the blank*; read-across 0.24 → 30 µmol dm⁻³ highlighted, rate unhighlighted. |
| M4 | Beat 2: preview caption, filter pre-seated, band blue throughout and dims (not narrows/vanishes); seated filter highlighted; caption removed and lid closed before zero. |
| M5 | Spine blank rule bounded to this assay; Beat 1 action 5 replaced (match dissolve, *preview: our 60 s example*). |
| Cut 1 | Taken (−7 words); 2.1.2 recall tag moved to existing cue *read with the same filter and blank*. |
| Cuts 2, 3 | Kept. |
| Cross-cutting 1–3 | Dataset A conditions: timer at first contact. Objectives get pictograms (cuvette + stopwatch; standards + ruled line); reject card and final frame keep colorimeter and graphs on screen. Dataset A 0 s row and Reusable demonstration series mark 0.00 as assumed; *30 µmol dm⁻³ reading* → *read-across value*; hook box shows 0.24 with 30 µmol dm⁻³ as a calculated tag outside it. |
| Bookkeeping | Header, Beat 4/5 windows, on-screen-text lines, ledger, totals, Length paragraph, Validator block updated. Conductor review kept (superseded on 0 s by M1). |

Validator: `TOTAL words 425  cues 64  runtime at 120 wpm 3:32.5  beats 5  failing beats 0`

## 3.2.1

| Item | Change |
|---|---|
| M1 | Beat 10 "at extremes, denatured." → "at extreme pH, denaturation can occur."; cue remapped; `denatured` copy highlighted with *extreme pH can denature; not inferred from these endpoint measurements*; pH 5/9 points no longer pulse. `denatured` split into heat trigger (temperature only) + core motion (temperature and pH); extreme pH runs core motion without thermometer or thermal jitter. Beat 9 read-out 8.0 → qualitative tags *near this enzyme's optimum* / *away from the optimum* / *extreme pH*; measured pH plot kept separate, pH 8.0 labelled *highest tested mean*. |
| M2 | Three-way tap added: vent open during the full 10 min equilibration; baseline "plunger set to 0 cm³, then tap turned to collect" after equilibration; stopwatch and collection start on the first-contact frame, already running when the flask returns upright, "not reset" at *the timer starts*. "warm separately" → "equilibrate separately". Five temperatures shown as five separate runs, 10 °C bath cooled. |
| M3 gas | Control = "5.0 cm³ of the same enzyme-free buffer solution, pH 7.0"; narration "the water control" → "the enzyme-free control"; 0.00 tagged *our illustrative observation*. SHARED-SPECS water-control conflict reported (plan wins). |
| M3 discs | Each soaking mixture "swirled gently just before its disc goes in" (new cue *soak in each mixture*); forceps rinsed in distilled water between treatments; boiled control "2.0 cm³ boiled yeast suspension + 8.0 cm³ buffer solution, pH 7.0", same 10 min at 30 °C, 60 s soak, 5 s drain, release, 120 s limit. Pipette tips above mouths; *contains enzyme* is an outline highlight, not a liquid colour. |
| M4 | Beat 2 objectives on own surface with authored pictograms (thermometer + *pH* tag; stopwatch + rising pictogram line; folded/loosened silhouettes). Beat 11 keeps the Beat 10 models and labelled plots on screen for the whole beat, tagged *our catalase data; not the paper's Table 1.3 or Fig. 1.2*. |
| M5 | `EnergyProfileGraph` recall inset, tag *recall: 3.1.1-2*, at *more effective collisions* in Beat 5; unchanged and static; ledgers updated. |
| M6 | Card enters at *below the temperatures*, ✗ line already struck: "✗ above the temperature optimum the molecules slow down" / "✓ above the temperature optimum the enzyme is increasingly denatured, so fewer active sites are functional"; ✓ dominant at *begin to denature* and in the final frame; no COMMON MISTAKE badge. |
| Numerical | pH 5 line "`1 ÷ 29 = 0.0344827586… → 0.034 (2 s.f.)`"; tangent corner tagged *on the tangent, not a reading*; Beat 8 mean/reciprocal tagged *calculated*. |
| Length | All four cuts KEPT (checker ruling). 966 words, 8:03.0, 1:03.0 over, all teaching; cut arithmetic corrected (880 = 7:20; explanations 299 = 2:29.5; investigations 396 = 3:18). Beat windows recomputed. |
| README | Timer at first contact (gas); no text-only frames (Beats 2, 11); calculated values tagged. Disc timer kept at release (plan's release position), descent brief and identical; flagged. |

Unresolved: 3.1.3 must carry the same three-way tap/baseline; SHARED-SPECS water control vs plan; disc timing from release.

Validator: `TOTAL words 966  cues 141  runtime at 120 wpm 8:03.0  beats 11  failing beats 0`

## 3.2.1b

Check: `work/005/checks-round-1/3.2.1b-CHECK.md` (NOT CLEARED). Storyboard matched the reviewed SHA-256 before editing. Kept as ONE lesson. Full table in the storyboard's `## CHECK RESPONSE (round 1)`.

| Item | Change |
|---|---|
| M1 repeats | Dataset C: three independent mixtures per concentration (incl. zero); run gradients plus means 0.0040 / 0.0030 / 0.0023 / 0.0020 / 0.0017 s⁻¹, worked. Old runs kept as *run 1 (representative)*. Factor y-axis *mean initial rate of change of absorbance / s⁻¹*. Beat 11 adds *Make three separate mixtures at each concentration, take each one's initial rate, then the mean.* and *the mean initial rate falls*. |
| M1 start point | Checker's sentence pasted into Dataset C; 0 s column = *Assumed start* (bracketed); open point *assumed start point; first reading at 30 s*; straight-section and blank-zeroing small type; stopwatch at enzyme's first contact, never reset; no 0 s read-out; series not called *readings*. |
| M1 spoken rate | → *Here we measure the initial rate of change of absorbance, from the straight section over the first sixty seconds*; cues remapped. |
| M2 | Docking replaced by whole-miniature bracket *X bound; binding location unspecified*, token only in an external status key, bracketed miniature dims, no rejection/second site/distortion; Beats 1, 11, 12 and model spec. |
| M3 | Hook opens on cell + curve with question as caption; objectives on own surface with pictograms; colorimeter on screen behind Beat 11 card; `rate-substrate` graph on screen from start of Beat 13. |
| M4 | E39 opening verbatim: *Here is a mistaken explanation, on the card, with two faults the examiners' report describes.* Entry cue *Here is a mistaken explanation*. |
| M5 | *hydrogen peroxide solution concentration before mixing / mol dm⁻³*; rig label *10.0 cm³ peroxide solution + 5.0 cm³ yeast suspension; final volume 15.0 cm³*; spoken *For a peroxide solution of zero point two moles per cubic decimetre before mixing*; amylase *before mixing with starch*. |
| M6 | Caption *β-galactosidase catalyses conversion of colourless ONPG to products, including yellow ONP.* |
| Audit items | *up to 32 wells per run*; C runs 1.0–2.0 straight to 90 s; fixed drop volume and drained dropper. |
| Cuts | (1) kept; (2) taken (−11, rows 2–3 moved to first cue beside visuals); (3) already taken; Beat 2 denaturation sentence + replay taken (−18). |
| Split after Beat 6 | **Deferred to Durai.** Split-only bookends not applied. |
| Cross-cutting 1–3 | Timer starts on the frame reactants meet in Beats 4, 7, 11 (visual only; narration unchanged in 4 and 7). No text-only frames (M3). Assumed/calculated tags: Dataset C origin, tangent *coordinates on the tangent line, not a syringe reading*, 1/mean *calculated from the means*, means *calculated: mean of three runs*. |
| Bookkeeping | Windows, ledger (teaching 992 = 8:16; error 473 = 3:56.5), Length paragraph, sweep, Validator and quote-check record (40 / 6, all six in Conductor review) updated; Conductor review kept. |

Validator: `TOTAL words 1465  cues 177  runtime at 120 wpm 12:12.5  beats 13  failing beats 0`

Coordinator alignment with 3.2.1's gas rig (not a CHECK item; no conflict with this check): the peroxide rig now has a three-way tap, set to vent during equilibration, then plunger 0 cm³ and tap to collect (*baseline 0 cm³ set after equilibration; collection path gas-tight*); stopwatch and collection start on the frame the liquids first touch, never reset. The gas control is now *enzyme-free control: 5.0 cm³ of the same enzyme-free buffer solution, pH 7.0*. Iodine blue-black wells are one shade, not graded. The amylase water control is kept. No narration or word change; validator line unchanged.

Conductor edit (not a CHECK item): Beat 2 "Today those conditions stay fixed" → "Today temperature and pH stay fixed" (after round-1 cut of the denaturation sentence the referent was indirect); cue remapped; +1 word.

## 3.2.4

Response to `work/005/checks-round-1/3.2.4-CHECK.md` (NOT CLEARED) plus the README cross-cutting fixes. Full table: `storyboards/topic-03/3.2.4/STORYBOARD.md`, *CHECK RESPONSE (round 1)*.

| Item | Change |
|---|---|
| M1.1 | Free volume measured (A 4.0 cm³ → 14.0 cm³ with starch); bead side recorded as nominal 4.0 cm³ input, 1 min drain, carried water not measured, total not measured. ‘made up with buffer to the same volume’ and *4.0 cm³ each side* removed. New `drain` state and Dataset 1 row. |
| M1.2 | Checklist ‘same added starch suspension: 10.0 cm³ at 1%’ + ‘not matched: liquid volume and starting starch concentration’. Narrated (Beat 5): ‘That is not a perfect match: in the free tube the starch is diluted at once, but around the beads it starts close to the added strength, and the water the beads carry is not measured.’ Cued tube highlight (0.71% calculated / close to 1% outside beads). |
| M1.3 | Beat 6 ‘for these two preparations’; Beat 7 ‘The unmatched starch concentrations and liquid volumes may play a part too. This comparison cannot separate these effects.’ Bracket verbatim: *possible contributions; this comparison alone does not separate their effects*. |
| M1.4 | Caveats, control, sampling, re-use run kept; repeat instruction shown on screen (Beat 7); spine/ledgers remapped. Beat 5 title and objective 2 no longer say ‘fair(ly)’ (my choice). |
| M2 | Beat 8 narration and Dataset 3 inference replaced verbatim; cue/tag ‘one sampling interval later than the first run’ / *recorded endpoint 30 s later*; *This shows re-use* highlight; *repeat before concluding a consistent activity change*. Old claims removed. |
| M3 | Beat 12 build instruction pasted verbatim (cue phrases set in single quotes); apparatus + bars retained at right throughout, persistent highlights; reject caption visible with ✗ line; ✓ line ends prominent. Material-properties row omitted (quotation kept in *Citations*). Objectives: branded surface with authored pictograms. |
| Clarifications | Beat 9 inset labelled *general example where product inhibition occurs; not a result of this amylase experiment*, no docking, activity arrow slows/recovers. 50 cm³ calcium chloride; 50 cm³ measured rinse; syringe tip down, plunger above. ‘schematic calcium-ion cross-links; no atom-resolved covalent bond graph’. Brackets *sampling-resolution bounds*. |
| Length | Cuts 2 (−17) and 3 (−4; cue *hard to recover*) taken; cut 1 not taken; cuts 4, 5 kept. |
| README | Timers start on the frame the starch first reaches enzyme/beads (A, B, C, B2), never after the pour, never reset. No bare frames. Calculated values tagged *calculated*; nominal ones *nominal*/*not measured*. |

Validator: `TOTAL words 825  cues 118  runtime at 120 wpm 6:52.5  beats 12  failing beats 0` (was 788, 6:34). Quotes: `quotes checked 18  not found 0`.

Conductor consistency edit (not a CHECK item): the `AmylaseIodineSampler` line "may be drawn less intense as starch falls" → "every blue-black well drawn the same shade, as 3.1.3 publishes the sampler, so no reading is implied from shade" (aligns with 3.1.3's published spec).

