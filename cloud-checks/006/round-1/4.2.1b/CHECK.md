NOT CLEARED

Independent round-one check of **4.2.1b — Active transport and bulk transport**, 27 September 2026. The syllabus coverage and both evidenced error beats are sound. Correct the event timing, equilibrium wording and exam-close presentation before narration/build. Length is not a reason to withhold clearance; preserve E46 and E47 in full.

Reviewed STORYBOARD.md SHA-256: `85bcb57625df21cf9471a173283952fe5816d91c0604554e5415522afcabf47f`.

Read the complete storyboard, relevant amended plan/weights and plan-check requirements, full current VIDEO-STRUCTURE (including REAL-WORLD SAMPLES), syllabus outcome, SHARED-SPECS and SUMMARY; compared the passive carrier/water-potential and exocytosis contracts with 4.2.1a and 4.1.4. Exam verification below is against the **actual local QP/MS/ER PDFs**, extracted with `pdftotext -layout`; S23/21 QP p.3 was also rendered and visually inspected. No lesson render exists. Only this CHECK file was written for this code.

## Must-fixes

### M1 — Give ATP hydrolysis and conformational change one start event; conserve the replay's particles

Beat 4 action 7 starts the ATP switch at “ATP is hydrolysed to ADP and phosphate”, says it is the first frame of the shape change, then starts that shape change again at the later cue “the carrier changes shape”. Those are different audio positions. Replace action 7 exactly with:

> At *ATP is hydrolysed to ADP and phosphate*, switch ATP to ADP + Pi in one rendered frame and start the carrier's 0.8 s conformational change on that same frame. Keep the bound ion attached to its binding site during the movement. At *the carrier changes shape*, highlight the resulting inward-facing conformation and its **changes shape** label; do not restart the movement or hydrolysis. Retain both model captions throughout.

The extra full cycle at action 9 transfers another ion, so Beat 4 actually ends at **2 outside / 14 inside**, not the **3 / 13** inherited by Beat 6 and the dataset. The least disruptive exact replacement for action 9 is:

> At *the carrier returns to its original shape*, return the empty carrier over 0.8 s, notch facing outside, tag **ready again**. Hold the completed single-cycle counts at **3 outside / 13 in the cytoplasm**. Do not perform a second transport cycle in this beat.

At the model/dataset replay contract add:

> A replay reset is an explicitly labelled restart of the schematic example, never an unexplained instantaneous movement of a solute through the bilayer. Count updates occur only on actual transport events.

This preserves the shared `pump-ATP` contract and avoids inventing chemistry or adding scope.

### M2 — Say what becomes equal in each passive process

Beat 2's “net movement ends when the two sides become equal” merges concentration equality with water-potential equality. It follows the osmosis definition, while the visual only specifies a generic counter. The amended plan deliberately distinguishes these quantities.

Replace the final narration sentence exactly with:

> None of these uses energy from ATP. In these diffusion models, net movement ends when concentrations are equal; in osmosis, when water potentials are equal. Particles keep crossing both ways.

Replace action 7 exactly with:

> At *when concentrations are equal*, show equal concentrations of the relevant solute on the diffusion panels and fade their net arrows while crossings continue. At *when water potentials are equal*, show equal water-potential labels on the osmosis thumbnail and fade its net arrow while water continues crossing both ways. Do not label equal water potentials as equal solute concentrations. At *Particles keep crossing both ways*, highlight the continuing two-way motion in all panels.

### M3 — Repair the exam form and distinguish the root-hair callback from credited content

**Beat 13 row 3** currently places W22/23 Q2(a)(i), **3 marks**, under “name a bulk process”. The actual instruction is **“Describe how macrophages engulf bacteria.”** Naming phagocytosis/endocytosis is only one of six available marking points, any three credited. Replace that row exactly with:

> **Describe engulfment / name a process.** W22/23 Q2(a)(i), QP p.4 / MS p.9: describe macrophage engulfment, **3 marks, any three listed points**; naming phagocytosis/endocytosis alone supplies one point. S23/21 Q1(b)(i), QP p.3 / MS p.8: name X, **1 mark**, endocytosis/pinocytosis. S21/22 Q5(b)(ii), QP p.11 / MS p.16: name pectin export, **1 mark**, exocytosis. **Our summaries of the original forms.**

Retain the complete credited macrophage description already provided in E46. Do not imply its name alone earns three marks.

**The root-hair callback is a real-world addition inside the exam-close beat**, contrary to the Real-world samples section's claim that no exam beat adds one. M24/22 Q1(b)(ii) does not ask about roots. Replace the callback narration exactly with:

> The scheme does not need this example, but remember the root hair: energy from respiration lets it take up ions against their concentration gradient.

At *The scheme does not need this example*, place the RootHairScene on a distinct dashed panel labelled **beyond the mark scheme**, with no marking tick or MS tab. Keep the comparison answer visible separately. At *energy from respiration*, animate its existing ATP tags; at *against their concentration gradient*, show uptake and the **active transport** label. Update the exit cue and the Real-world samples section to record this separation. Keep the generic-transporter guard.

### M4 — Make the objectives' first frame contain an actual pictogram

Beat 3 action 1 specifies “three empty pictogram slots”; the first actual icon enters only at “explain how active transport moves ions”, after “By the end you will be able to”. The validator accepts the first-frame phrase without checking what is visible. Replace that opening instruction exactly with:

> From the first frame, show all three flat authored pictograms on the objectives' own styled surface: carrier and arrow, budding/fusing vesicles, and paired direction arrows. Keep the text slots empty initially. At each existing objective cue, reveal its text and brighten the already-visible matching pictogram. This is a separate objectives surface, not the detailed lesson diagram.

## Should-fixes

1. **Density, not total number:** the dataset's “more tokens … so … against the drawn gradient” only follows for equal comparison volumes. Add: **“Compare equal-volume sampling windows on each side, with token density proportional to the indicated concentration. Whole-cell totals do not define a concentration gradient.”** Apply especially to the large root cell versus the thin soil-water film.
2. **Vesicle orientation:** replace “heads outward on both faces” with **“outer-leaflet heads face cytoplasm; inner-leaflet heads face the aqueous vesicle lumen; tails face one another between the leaflets.”** This makes the intended heads-to-water rule unambiguous and agrees with the sibling's explicit outward/inward description.
3. **Bound the graph caption:** replace **“a plateau shows carriers; it does not show whether ATP is used”** with **“In this carrier-uptake model, the plateau reflects limited carrier capacity; the plateau alone does not establish ATP use.”** Keep the existing bounded narration and do not suggest that every plateau in any experiment proves carriers.
4. **Readability:** E46 combines a long adaptation caption, two answers, two citation tabs and three model thumbnails. Keep the exact adaptation text in the storyboard/source note and ensure its displayed placement remains legible; show only the currently discussed citation tab at full prominence. This is a production QA requirement, not permission to remove the context qualification.
5. Replace the eight resolved UNVERIFIED items and related PDF-UNCHECKED description labels with **“PDF-CHECKED (independent round-one check, 27 September 2026); displayed question/answer summaries remain our wording.”** Do not turn paraphrases into quotations merely because their factual content now passes.

## Citation audit — original PDFs

All paths below are relative to `/home/dachu/sme-9700-archive/pastpapers/`. Pages are one-based PDF pages.

| Storyboard claim / quotation | Original checked | Finding |
|---|---|---|
| Outcome 4.2.1, p.21 | Current `SYLLABUS-9700-DETAIL.md`, outcome 4.2.1 | Verbatim match; all three owned processes and the comparison/saturation teaching are covered. |
| `R active transport`; same point accepts active process/ATP/energy | `2022/November/9700_w22_ms_23.pdf`, p.9, Q2(a)(i) | Exact reject string. Point 6 accepts those alternatives. Any three of six points, 3 marks. Resolved UNVERIFIED 6. |
| Macrophage/bacteria question context | `2022/November/9700_w22_qp_23.pdf`, p.4 | Scanning electron micrograph; asks to **describe** engulfment, not merely name it. E46 framing and correction pass; Beat 13 requires M3. |
| `endocytosis / pinocytosis ; R phagocytosis` | `2023/June/9700_s23_ms_21.pdf`, p.8, Q1(b)(i) | Exact match, 1 mark; reject is local to X. |
| S23/21 X and the plan-check caption | `2023/June/9700_s23_qp_21.pdf`, p.3, Fig.1.2/Q1(b)(i), text and rendered image | X is inward budding at the plant cell surface during vacuole development. Exact QP: “Name the process that is occurring at X.” The adaptation disclaimer is accurate. Resolved UNVERIFIED 7; do not call the author's fluid drawing the original artwork. |
| “Some thought that the membrane protein was an enzyme with an active site, rather than a carrier protein with a binding site.” | `2023/June/9700_s23_er.pdf`, p.12, Paper 21 Q3(b)(i) | Verbatim match after joining printed line breaks. “Some” retained. COMMON MISTAKE badge supported. |
| Report describes stopping and peak-versus-plateau errors | Same ER page/part | Explicitly reported; description is accurate. Resolved UNVERIFIED 5. |
| Plateau and carriers at capacity, 2 marks | `2023/June/9700_s23_ms_21.pdf`, p.11, Q3(b)(i) | Credits constant/plateau uptake and saturated/highest-rate transporters; accepts carrier number limiting. Resolved UNVERIFIED 3. |
| Grape hexose transporter inserted into mutant yeast; graph context | `2023/June/9700_s23_qp_21.pdf`, pp.8–9 | VvHT1 from grape, inserted into yeast with very few transporters; eight glucose concentrations, same temperature/pH. Original question asks how results support facilitated diffusion. Storyboard's generic high-concentration question and graph are explicitly **our framing**, not reproductions. Resolved UNVERIFIED 4; plateau-alone guard remains correct. |
| One similarity/two differences; carrier-only shape change; 3 marks | `2024/March/9700_m24_qp_22.pdf`, p.4; `9700_m24_ms_22.pdf`, p.6, Q1(b)(ii) | Both form and tariff verified. MS accepts transport-protein similarity and direction/energy differences; exact guidance: `R if incorrect context of channel protein`. Resolved UNVERIFIED 1–2. Existing reject card is honestly labelled an authored contrast. |
| Pectin export by exocytosis, 1 mark | `2021/June/9700_s21_qp_22.pdf`, p.11; `9700_s21_ms_22.pdf`, p.16, Q5(b)(ii) | QP specifies Golgi vesicles and asks the export mechanism; MS answer `exocytosis ;`. Resolved UNVERIFIED 8. |
| 4.2.1 ledger's 15 overlapping marks in four cited Paper 2 blocks | Above MS pages plus S21/22 MS p.12 Q3(b), W22/23 MS p.19 Q6(a), M24/22 MS p.5 Q1(b)(i) | Recomputed **(2+1)+(3+1)+(1+1+2)+(1+3)=15** across those four blocks. This is the plan's selected five-block sample, not an exhaustive frequency claim about Cambridge papers. |

**No listed UNVERIFIED exam item remains unresolved.** The construction captions and source labels are authored text, not purported Cambridge quotations. All three direct exam strings pass independently; no invented reject rule was found.

## Scope, science, models and visual audit

The ATP-driven carrier is explicitly generic and the root example is energy-dependent accumulation, with no named nitrate pump or co-transport taught. Active transport is distinguished from energy-requiring vesicle transport. The carrier's binding site, channel pore and enzyme active site remain distinct. Carrier saturation is allowed for facilitated diffusion and active transport; the inset continues transporting at the plateau. The two traces are schematic, without numeric readings, and their heights are not compared. No Fick equation, pump stoichiometry, signalling cascade or pressure/solute-potential decomposition is added.

The shared outside/top, cytoplasm/bottom and membrane-normal gradient convention is used; passive carrier states have no ATP; exocytosis remains fusion with the cell surface. Phagocytosis/pinocytosis are continuous membrane movements. No practical sample is tested: the material-analysis portions of REAL-WORLD SAMPLES are therefore inapplicable, but its exam-close separation rule still applies under M3. No bench pours, colour reactions or first-contact clocks occur. ATP is a labelled token transformation, so an atom-level valence audit is not applicable.

Conservation in the specified single cycles is correct: **4+12 = 3+13 =16**, **3+10 =2+11 =13**, **9+3 =8+4 =12**. M1 fixes the extra cycle missed by the ledger. M2 fixes ambiguous equilibrium wording rather than introducing new osmosis depth. Familiar diagrams support recaps, explanations and error cards; the objectives exception is M4. The hook is answered and the revolving-door handle is immediately converted into biological wording.

## E47 and E46

Both are **COMMON MISTAKE**, supported by the original ER diagnosis/reject lines. Both contain announcement, written constructed answer, anchored **4 s** read, cue-mapped talk-through, and in-place repair. Wrong claims are discussed as words on the card, never asserted as biology. E47 separately repairs stopped uptake and enzyme vocabulary; E46 separately repairs the macrophage and X labels. Both badges remain until the last fault is corrected. The explanations of why the errors feel plausible are the author's possibilities, not invented examiner testimony. Keep both complete.

## Validator and runtime ruling

Reran `python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.1b/STORYBOARD.md`: **13 beats, 1,348 words, 164 cues, zero failing beats; maximum gap 20 words**. Per-beat counts: **89, 105, 49, 134, 95, 104, 119, 139, 105, 87, 139, 88, 95**. Manually checked cue/event semantics in Beats 2–4, 6–8, 11 and 13; substring validity does not resolve M1 or M4.

At the plan's effective 120 words per final minute, **1,348 words = 11:14**, versus **11:15**. Teaching is **1,070 words = 8:55**, **10 s above 8:45**; each error is **139 words = 69.5 s**. The shared validator's conservative convention adds each 4 s read, making **73.5 s per error** and **11:22 total**, **7 s above budget**. The amended plan says the effective rate is not a second silence allowance: keep these two conventions explicitly distinguished, rather than treating every hold as additional time twice. Actual paced audio and scheduled holds decide final runtime.

**Accept the 7 s conservative overrun**, and modest additional wording needed by M2/M3. No cut is necessary merely to hit 11:15. Reject optional cut 1 as a timing requirement: exam orientation has a job, and its macrophage form needs correction, not removal. If further trimming proves necessary after cue scheduling, optional cuts 2 and 3 remove genuine framing repetition (8 and 5 words); do not shorten either error beat. Remove the extra replay under M1; do not add its duration to an estimate after also budgeting it as visual space. Recount and update the windows after edits.

**NOT CLEARED**
