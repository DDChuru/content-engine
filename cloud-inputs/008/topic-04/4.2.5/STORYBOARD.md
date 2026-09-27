# 4.2.5 — Estimating the water potential of potato tissue

**STATUS: CLEARED (re-checked 27 Sep)** — independent checks, cloud run 006 (cleared in round 3 (round-2 minor edits applied); `cloud-checks/006/round-3/README.md`: FINAL), 27 September 2026. Narration frozen for build.
**Reworded 27 Sep 2026 under EXAM QUESTIONS IN OUR OWN WORDS** (VIDEO-STRUCTURE.md). internal: paper, session and question references outside "Beat by beat", and any text after an internal: marker, are traceability for checkers only and never reach the screen or narration. Exam-style stems in the beats are our own.

**Storyboard, first draft. Cloud run 006, 27 September 2026.** No audio, no code, no render. Folder `storyboards/topic-04/4.2.5/`.
Cambridge 9700 syllabus 2025–2027, p.22. Command word **INVESTIGATE** (with "using the results to estimate"). Budget from `TOPIC-PLAN-04-MEMBRANES.md` §4.2.5 and the lesson list, and `TOPIC-04-WEIGHTS.md` (4.2.5 row and paragraph; supplementary S-A to S-D, S-F; register E48): **11:15 = teaching 10:00 (about 1,200 words) + one complete error beat 1:15 (E48); 13 teaching beats + 1 error beat**, delivered here as **14 beats (13 teaching + 1 error)**. 4.2.5 has no direct Paper 2 exposure in the cited blocks (0/5); both cited Paper 5s (W20/51, M24/52) bear on it as supplementary practical evidence outside the counts. Runtime estimated at **120 words per minute of final video** (words ÷ 120); E48 is counted as a complete beat, narration plus its 4 s silent read (SHARED-SPECS §2a).

> **4.2.5** investigate the effects of immersing plant tissues in solutions of different water potentials, using the results to estimate the water potential of the tissues

(syllabus p.22)

**Authorities read, in full:** `work/006/AGENT-BRIEF.md`; `work/006/SHARED-SPECS.md` (binding: hard rules, layout, shared models, shared numbers, the verbatim list); `plan/topic-04/TOPIC-PLAN-04-MEMBRANES.md` (§4.2.5 in full with the MF5 eighteen-vessel paragraph, the MF2 W20/51 paragraph and Table 1.1, the MF6 potato sentence and the E48 entry; §4.2.1 MF3 water-potential sentences; §4.2.6 equilibrium paragraph; the lesson list and build order; the shared-model table; the traps table; the UNVERIFIED register; the PLAN-CHECK RESPONSE); `plan/topic-04/TOPIC-04-WEIGHTS.md` (4.2.5 row and paragraph; supplementary S-A, S-B, S-C, S-D, S-F; register E48 and its five-move requirement; mathematical requirements); `cloud-inputs/003/standards/VIDEO-STRUCTURE.md` (all); `CONTENT-ARCHITECTURE.md`; `SYLLABUS-9700-DETAIL.md` (Topic 4 outcomes and introduction pp.21–22; apparatus pp.56–57; materials p.58; Paper 5 planning and data expectations pp.60–61; mathematical requirements p.63); the cleared examples `cloud-inputs/006/examples/3.1.3/STORYBOARD.md` and `3.2.1b/STORYBOARD.md`; `cloud-inputs/003/topic-03/3.1.1-2/CHECK.md` and `3.2.2-3/CHECK.md`; the plan check `cloud-checks/006/plan/CHECK.md` on `origin/cloud/006-checks` (MF2, MF5, MF6, should-fix 7, the quotation table); `cloud-inputs/006/evidence/GATE-CRITERIA-9700-04-CELL-MEMBRANES-AND-TRANSPORT.md` (G04) and `EXAMINER-INSIGHT-9700.md` (for context only; no prose from them is quoted). **No question paper, mark scheme or examiner report PDF was opened for this draft.** Every exam quotation is one of the strings SHARED-SPECS §2 lists as verified by the plan check; everything else is our wording, a labelled paraphrase with its citation, or listed as `UNVERIFIED`.

**Build position:** tenth of the ten Topic 4 lessons: 4.1.1-2 → 4.1.3 → 4.1.4 → 4.2.1a → 4.2.1b → 4.2.6 → 4.2.2a → 4.2.2b → 4.2.3-4 → **4.2.5**.

**Models used (recall, by state id):** `WaterPotentialModel` (4.2.1a; state `cell-vs-solution` added by 4.2.6, with the plant cell outline); `CellOsmosisSet` (4.2.6; states `plant-turgid`, `plant-equal`, `plant-flaccid` only); `SAVShapes` cylinder dimensions (4.2.3-4; numbers only, small type); plain-graph axis conventions from the Topic 3 `RateGraph` (quantity / unit; points as crosses).

**Models published here:** `PotatoCylinderRig` (eighteen vessels); plain graph configuration `percent-mass-change` with construction overlay `zero-crossing`; `LookupTable` panel (*our calculated ideal-solution values at 25 °C*); a display-only overlay `starch-grains` on the `CellOsmosisSet` plant cell (no new osmotic state). Everything drawn is a MODEL or labelled apparatus; every potato number is *our illustrative data*; the lookup numbers are calculated by us at 25 °C, labelled as ideal-solution estimates.

---

## The causal spine

One idea carries the lesson. **This investigation estimates the tissue's initial water potential from mass changes across a range of solutions; the fitted zero-change concentration and supplied table provide the estimate.**

> **Plant tissue gains mass in a solution whose water potential is initially higher than its own and loses mass in one whose water potential is initially lower, because net osmosis is from higher to lower water potential through partially permeable membranes. Immerse identical potato cylinders, three independent vessels per concentration, for a stated time; calculate each cylinder's percentage change in mass, then the mean; draw a smooth trend through the means and read, by construction within the tested range, the concentration at zero change. At that concentration there is no net movement of water, so the solution's water potential, read with its sign and unit from supplied data, is an estimate of the tissue's initial water potential under these conditions.**

**What the mark schemes credit, quoted:** [W20/51 Q1(d)(i), MS p.9] `–860kPa ;` (the density-drop method's answer at 0.30 mol dm⁻³ from the supplied table; **PDF-CHECKED (plan check)**). [M24/52 Q1(c)(iii), MS p.7] `ref. to hazard and risk and precaution ;` (1 mark; **PDF-CHECKED (plan check)**). [R24 p.54, June 2024 P52 key messages] “The term ‘amount’ is not accepted as it is not specific.” (**PDF-CHECKED (plan check)**). Described, not quoted (plan-check descriptions, used as our paraphrase with the citation): W20/51 Q1(c)(ii), QP p.5 / MS p.9, 3 marks for a labelled downward-trending sketch and identifying its zero-mass-change intercept as the estimate; W20/51 Q1(a)(ii) 3, Q1(b) 6, Q1(c)(i) 2, MS pp.7–9: range/dilution, controls and percentage-change interpretation across different parts; M24/52 Q1(c)(i), maximum 6 marks, any six of nine listed points, a plan varying the temperature of turnip blocks (related planning evidence, not this protocol); M24/52 Q1(b)(ii), MS p.5, limitations, any four of eight points, of which untested intermediate concentrations, variation among cells and missing uncertainty information are examples. W20/51 is red pepper fruit-wall tissue and two separate methods; **our potato mass-change dataset followed by a supplied lookup is an adaptation combining these skills, not the paper's original numerical solution** (plan check MF2). So the spine is what is credited: a downward trend with its zero-change intercept as the estimate; a supplied-table lookup with sign and unit; quantities named specifically; hazard, risk and precaution together.

**The handle:** *a see-saw sitting level* (Beat 3). Neither side wins: water still crosses both ways, but nothing net moves. Converted at once, in the same breath: *where the change in mass is zero, there is no net movement of water, so that solution's water potential estimates the tissue's initial water potential.* The handle is never the exam answer.

**Typicality rules applied.** Zero measured mass change gives **an estimate of the tissue's initial water potential under these conditions**; it is not proof that every cell has identical water potential or that no solute exchange or damage occurred (MF5, said in Beat 12). Comparisons are labelled **initially** higher/lower. "Potato fits the method" is said of this method's needs (firm, cuts cleanly, mass changes enough to weigh), not as a claim that every potato behaves the same; different potatoes can give different estimates (beyond-the-mark-scheme panel, Beat 14). The trend is "smooth" and "curves gently" for **this dataset**; no general curve shape is claimed. The intercept is read **within the tested range**; nothing is extrapolated. The 0.4 mol dm⁻³ mean (+0.1 %) is shown as a mean, and the answer is read from the trend, not from that point. The R24 sentence is stated as a key message for June 2024 Paper 52 **as a whole**, applied to our constructed plan; R24/52 is not called an osmosis paper. The carrot density-drop answer is our own −595 kPa at 0.24 mol dm⁻³, kept separate from the potato estimate. Reasons students err are phrased as possibilities ("It can feel precise enough, since…"). The 4.2.6 exclusion holds: water potential only; the component potentials are never named.

**One error beat, five moves** (announce → written card → 4 s silent read → talk-through with cue-synced rings → correct in place): **E48 in Beat 9**, badge **COMMON MISTAKE** (basis: R24 p.54, a genuine paper-wide quantity-specificity warning in the June 2024 Paper 52 key messages, fairly applied to constructed potato/solution sentences; weights register E48). Two faults; the marker clears only on the completed correct frame. Caption on the card: *an examiners' key message for a whole practical paper; applied here to our constructed potato plan; not a candidate transcript and not an osmosis question*. No other beat carries a badge. The exam close ends on a short **closing wording contrast** (round-1 check M3): a written ✗ line struck through and replaced in place by the ✓ line, captioned *our wording contrast; not a quoted mark-scheme reject*, as VIDEO-STRUCTURE's closing reject card and SHARED-SPECS §2's honestly labelled authored contrast allow. It invents no Cambridge R/I instruction, carries no badge and is not a second COMMON MISTAKE beat.

---

## The models, specified once

### `PotatoCylinderRig` (published here)

Parts, each named with an SVG text label where it sits:
- **potato** (one raw potato, skin removed; label *one potato*), on a **white tile**.
- **cork borer**, 10 mm internal diameter (label **cork borer, 10 mm internal diameter**), with its **push rod** for expelling the core.
- **scalpel** (label **scalpel**) and a **ruler** in mm lying on the tile.
- **cylinders**: diameter 10 mm, length **30 mm** each (label on first appearance *30 mm, trimmed*); small type on first appearance *every cylinder: diameter 1.0 cm, length 3.0 cm → surface area 11.0 cm², volume 2.36 cm³ (recall 4.2.3-4)*.
- **paper towel**, folded flat on the bench (label **paper towel: blot the same way each time**).
- **top-pan balance** reading to **0.01 g** (display shows two decimal places; label **balance: resolution 0.01 g**), with a **tare** button.
- **sucrose stock, 1.0 mol dm⁻³** bottle and **distilled water** wash bottle; two **25 cm³ measuring cylinders**, labelled **stock** and **water** (never swapped); a **dropper** for making up to the mark.
- **eighteen boiling tubes** in three racks of six, each closed with a **bung** (the covered vessels), each labelled with its concentration and repeat letter: **0.0-A, 0.0-B, 0.0-C, 0.2-A … 1.0-C**; three per concentration (0.0, 0.2, 0.4, 0.6, 0.8, 1.0 mol dm⁻³), one cylinder in **20.0 cm³** in each.
- **covered humid container** (label **covered humid container**): a lidded box with eighteen labelled holding positions on a raised dry grid above a damp paper lining, so the cylinders are out of contact with liquid water.
- **blunt forceps** (label **forceps**); **stopwatch** (one running clock, never reset); a **thermometer** in the room air (reading **25 °C**); a **results sheet** listing the eighteen labels, the loading order, each tube's start time, initial and final masses, and a row of temperature checks during the run.

Safety (should-fix 7; specified here, not lectured): the cutting frames carry the paired tag *hazard: sharp borer and blade · risk: a slip cuts the hand · precaution: cut down onto the tile, blade away from the body, fingers clear*. The solution frames carry an eye-protection pictogram and the tag *working solutions: sucrose, 0–1.0 mol dm⁻³; no hazard code for sucrose on the syllabus materials list (p.58); wipe up spills*.

Handling (specified here; rendered still-frame verification pending):
- **Skin removal:** strips of skin cut off with the scalpel, the potato held flat on the tile, blade drawn down onto the tile and away from the body.
- **Boring:** the potato stands on the tile. Push the borer vertically through the flesh with a slight twist, stopping at the tile surface; do not animate the edge entering the tile. Keep the supporting fingers beside and clear of the cutting path. Lift the borer before using the push rod to expel the core onto the tile.
- **Trimming:** each core lies beside the ruler; the scalpel cuts straight down onto the tile at the 0 mm and 30 mm marks.
- **Solutions:** stock is poured from its bottle into the **stock** cylinder at about 120° from upright, mouth below base, the stream leaving the computed lip into the cylinder's mouth, and made up to the mark with the dropper squeezed **above** the cylinder, never touching; the same for distilled water into the **water** cylinder; each cylinder poured at about 120° into the boiling tube's mouth; the bung seated, then the tube inverted gently twice to mix; liquid surfaces level in every frame.
- **Order and storage:** Prepare the solutions before cutting the tissue. Keep the trimmed, allocated cylinders in labelled positions in a covered humid container, out of contact with liquid water, until each is blotted, weighed and immediately immersed. Open it only to take the next cylinder; keep the others covered. Record each cylinder's own start time at first contact.
- **Temperature:** Allow all solutions to reach the same room temperature before loading; keep all racks together away from direct sunlight or local heat and check temperature during the run.
- **Blotting:** forceps roll the cylinder **once** across the folded paper towel, the same way each time (tag *one roll, same pressure*).
- **Weighing:** the balance is tared to 0.00 g, the cylinder placed on the pan with forceps, the reading recorded.
- **Immersion:** the bung is lifted, the cylinder lowered with forceps and released just above the liquid so it slides fully under; the bung is reseated.
- **Removal:** bung lifted, cylinder gripped with forceps and lifted out, blotted and weighed as before.

States:
State order in the run: `bench` → `make-up` → `cut` → `load` → `wait` → `unload` (solutions prepared before the tissue is cut; Beat 6 explains the make-up as that earlier setup).
- **`bench`**: potato on tile, borer, scalpel, ruler, balance, towel, stock, water, covered humid container (empty) and racks, all at rest; eighteen labelled tubes empty.
- **`make-up`**: the dilution panel (Dataset 1) beside the racks; each tube receives its stock and water volumes, is bunged and inverted; label pulses as it fills. The filled, bunged racks then stand together away from direct sunlight or local heat while the solutions reach room temperature.
- **`cut`**: filled racks already standing; skin removed; boring and trimming per the handling; eighteen cylinders lined on the tile; a random-number list slides in and assigns each cylinder to a tube label (tag *random allocation, one potato*); each allocated cylinder is then placed in its labelled position in the covered humid container and the lid closed.
- **`load`**: tube by tube in the stated loading order (Dataset 2), the container opened only to take the next cylinder and closed again, each cylinder blotted, weighed and immediately lowered in. **On the rendered frame on which the first cylinder's lower end first touches its solution, the stopwatch starts; that frame is t = 0.** Every later tube's own first-contact frame writes its start time on its label (1:00, 2:00 … 17:00). Any later *t = 0* tag highlights the already-running clock; it is never reset.
- **`wait`**: time-lapse caption *waiting time compressed; the clock shows real elapsed time*; clock runs from 17:00 to 60:00; the thermometer is checked during the run and each check written in the sheet's temperature row.
- **`unload`**: each tube emptied of its cylinder exactly 60:00 after its own start (tube 1 at 60:00 … tube 18 at 77:00), cylinder blotted and reweighed; final mass recorded beside its initial mass; a last temperature check is written in the sheet's temperature row.

### Plain graph configuration `percent-mass-change`, with overlay `zero-crossing` (published here)

Built on the Topic 3 `RateGraph` axis conventions: labels are SVG text nodes in the *quantity / unit* form; points are small crosses; caption **our illustrative data** throughout.
- **Axes:** y **mean percentage change in mass / %**, −10 to +10, major ticks every 2 %, small squares 0.5 %; x **concentration of sucrose solution / mol dm⁻³**, 0.0 to 1.0, major ticks every 0.2, small squares 0.02 mol dm⁻³. The **zero line** (y = 0) is drawn heavier across the full width, label **no change in mass**.
- **Points:** the six means (Dataset 3) as crosses, labelled *mean of three cylinders; calculated from measured masses*. Individual cylinder values are shown only in the table, never plotted. No set value is plotted, so no open circle appears on this graph.
- **Trend:** a smooth curve through the means, drawn as the least-squares quadratic *y = 8.171 − 22.929x + 6.071x²* over 0.0 ≤ x ≤ 1.0 only (Dataset 3); it passes within 0.13 percentage points of every mean; label **smooth trend through the means**. It is never extended beyond x = 0.0 or x = 1.0.
- **Overlay `zero-crossing`:** a marker slides along the trend to where it meets the zero line, locked at **x = 0.398** on the curve (reads **0.40** on the 0.02 mol dm⁻³ grid); a dashed **construction line** drops vertically from that crossing to the x-axis; label **concentration at zero change = 0.40 mol dm⁻³ (read from the trend; interpolated within the tested range)**. The crossing is never drawn as a cross or dot; tag *construction, not a data point*.
- **Regions:** above the zero line a pale tag *tissue gained water: solution's water potential initially higher*; below, *tissue lost water: solution's water potential initially lower*.

### `LookupTable` panel (published here)

A two-column table panel on its own card surface, header **supplied data: water potentials of sucrose solutions**, small type **our ideal-solution estimates at 25 °C**, columns **concentration of sucrose solution / mol dm⁻³** and **water potential / kPa**. Our seven rows: **0.08 → −198; 0.16 → −397; 0.24 → −595; 0.32 → −793; 0.40 → −992; 0.48 → −1190; 0.56 → −1388**. Caption: *our illustrative potato data; our calculated lookup at 25 °C*. State `lookup:<row>`: a finger-line runs down to the concentration row, then across to the water potential; sign and unit are ringed separately. Derivation and assumptions are in Dataset 4; no Cambridge table is reproduced.

### Display overlay `starch-grains` on the `CellOsmosisSet` plant cell (published here, used here only)

Five or six small grey-white ovals, each drawn inside a small plastid outline in the cytoplasm of the plant cell (not as free cytoplasmic bodies), label **insoluble starch grains** (the sole label; the plastids are not named); no change to any osmotic state, wall, membrane, vacuole or label. Used only in Beat 4's magnifier.

### Models used by state id (not respecified)

- `WaterPotentialModel` `cell-vs-solution` (4.2.1a / 4.2.6): the membrane strip drawn vertically and relabelled *membrane*; left compartment the surrounding **solution**, right compartment a **plant cell** outline; the vertical water-potential scale with **0 kPa — pure water at atmospheric pressure (reference)** at the top and "more negative" downward for the solutions in the comparison, no other numbers; labels *higher water potential (less negative)* / *lower water potential (more negative)*; comparison label *initially: solution's water potential higher / equal / lower than the cell's*; water tokens cross both ways, the crossing counter shows the net direction; the net arrow fades when the water potentials are equal while crossings continue. Captions *schematic; not to scale* and *particles drawn schematically; not to scale; far fewer than real*.
- `CellOsmosisSet` (4.2.6): `plant-turgid` (protoplast pressed on the wall; reached by net uptake until the cell's water potential equals the solution's, net arrow faded), `plant-equal` (no net movement; may be turgid; never labelled necessarily flaccid), `plant-flaccid` (protoplast no longer pressing); each labelled with its initial comparison of water potentials. `plant-plasmolysed` is not used (plasmolysis is not claimed for these cylinders). Caption here *model cell states; not observed in this tissue*.

---

## Beat by beat

Beat windows in the headings follow the per-beat ledger (words ÷ 120, plus the 4 s silent read in Beat 9, since SHARED-SPECS §2a counts a complete error beat as narration + silent read); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch over 30 words without a stated visual change.

### BEAT 1 · Hook and context · 0:00–0:48
**Narration:**
> Ever wondered how you could put a number on the water potential of a potato, with nothing more than a balance and some sugar solutions? Leave raw potato strips in plain water and they come out firm; leave them in a strong sugar solution and they go limp. The tissue is swapping water with the liquid around it, and which way it goes depends on a comparison you cannot see. So you let the tissue report it: weigh it before and after. By the end of this lesson, that report becomes a number in kilopascals.

**Visual action:**
1. **From the first frame**, `PotatoCylinderRig` in `bench` is on screen, reduced: a whole raw potato on a white tile, the top-pan balance at rest beside it, and two beakers of liquid (no labels yet). At *put a number on the water potential of a potato*, the hook question appears as a compact caption above the potato.
2. At *nothing more than a balance*, the balance brightens and a short row of stoppered bottles labelled *sugar solutions* ghosts in beside it.
3. At *Leave raw potato strips in plain water*, the left beaker is labelled **plain water** and three raw potato strips are lowered into it with forceps; at *come out firm*, after a time-lapse wipe (caption *time compressed*), forceps lift one strip by one end and it stays straight, tag **firm**.
4. At *a strong sugar solution*, the right beaker is labelled **strong sugar solution** and three strips go in the same way; at *go limp*, one is lifted after the same time-lapse and droops, tag **limp**. Small type under both: *our illustration of what this lesson measures; not a measured result*.
5. At *swapping water with the liquid around it*, small insets open over each strip: over the firm strip a plant cell with a net arrow in, the arrow fading as the cell reaches `CellOsmosisSet` `plant-turgid` while tokens keep crossing both ways; over the limp strip a net arrow out, ending in `plant-flaccid`; caption *model cell states; not observed in this tissue*.
6. At *a comparison you cannot see*, a question-mark tag hangs between each beaker's liquid and its inset cell.
7. At *let the tissue report it*, a fresh strip is laid on the balance pan; at *weigh it before and after*, the display lights **before: _ . _ _ g** and **after: _ . _ _ g** (blank digits).
8. At *a number in kilopascals*, a blank readout **… kPa** appears under the potato; dissolve to the objectives surface.

**On-screen text:** the hook question; *plain water*; *strong sugar solution*; *firm*; *limp*; *our illustration of what this lesson measures; not a measured result*; *model cell states; not observed in this tissue*; *… kPa*.

---

### BEAT 2 · What you will be able to do · 0:48–1:14
**Narration:**
> By the end you will be able to set up this investigation so that anyone could repeat it exactly; to turn masses into percentage changes, means and a graph with a zero crossing; and to read off the tissue's water potential from supplied data, with its sign, its unit and its limits.

**Visual action:**
1. **From the first frame**, the objectives surface is on screen: its own styled card on a distinct background colour, **not the lesson diagram**, with three empty line slots, each beside a flat authored pictogram (a small cylinder beside a ruler; a mini graph with a heavy zero line; a two-column table with an arrow running down then across).
2. At *set up this investigation*, line 1 enters with motion beside the cylinder pictogram: **SET UP** identical cylinders, six solutions, eighteen covered tubes.
3. At *turn masses into percentage changes*, line 2 enters beside the graph pictogram: **PROCESS** percentage change for each cylinder → means → a graph and its zero crossing.
4. At *read off the tissue's water potential*, line 3 enters beside the table pictogram: **ESTIMATE** the tissue's water potential from supplied data.
5. At *its sign, its unit and its limits*, the words **sign · unit · limits** in line 3 brighten in turn.

**On-screen text:** the three lines. Small type: *syllabus 4.2.5, "investigate", p.22*.

---

### BEAT 3 · Why weighing works: water potential · 1:14–2:16
**Narration:**
> First, why weighing tells you anything. Water potential describes water's tendency to move. Pure water at atmospheric pressure is the reference, zero kilopascals. At the same temperature and pressure, adding solute lowers water potential, so these sucrose solutions have negative values, and a less negative value is higher. Net osmosis is from higher to lower water potential, through partially permeable membranes. If the solution's water potential starts higher than the cells', they take in water and the tissue gains mass; if it starts lower, the tissue loses mass. Picture a see-saw sitting level. Written properly: where the change in mass is zero, water still crosses both ways but there is no net movement, so that solution's water potential estimates the tissue's initial water potential.

**Visual action:**
1. **From the first frame**, `WaterPotentialModel` in `cell-vs-solution` is on screen: the vertical membrane strip (label *membrane*), the **solution** compartment at left, a **plant cell** outline at right, the vertical water-potential scale beside it; captions *schematic; not to scale* and *particles drawn schematically; not to scale; far fewer than real*. At *why weighing tells you anything*, a small balance icon sits under the model.
2. At *water's tendency to move*, water tokens begin their random motion in both compartments and some cross the membrane both ways; recall tag *recall: 4.2.1a, 4.2.6*.
3. At *zero kilopascals*, the top of the scale is ringed and labelled **0 kPa — pure water at atmospheric pressure (reference)**.
4. At *adding solute lowers water potential*, orange double-hexagon **sucrose** tokens drop into the solution compartment and the solution's marker on the scale slides down below 0; at *a less negative value is higher*, an arrow up the scale is labelled **higher (less negative)** and one down **lower (more negative)**.
5. At *Net osmosis is from higher to lower water potential*, the net-movement arrow appears across the membrane from the higher marker's side toward the lower.
6. At *starts higher than the cells'*, the solution's marker sits above the cell's marker (tag *initially: solution's water potential higher than the cell's*); more tokens cross into the cell on the counter and the net arrow points into the cell; at *the tissue gains mass*, a small cylinder icon beside the model gains a **+** tag.
7. At *if it starts lower*, the solution's marker slides below the cell's (tag *initially: solution's water potential lower than the cell's*); the counter reverses, the net arrow points out of the cell, and the cylinder icon's tag becomes **−**.
8. At *Picture a see-saw sitting level*, a small see-saw icon settles level beside the model, strap-line *handle: a level see-saw*.
9. At *Written properly*, the markers slide to the same level (tag *initially: solution's water potential equal to the cell's*); the net arrow fades while tokens keep crossing both ways and the counter's two numbers run level; the cylinder icon's tag becomes **0**.
10. At *the change in mass is zero*, the sentence surface slides up beneath the model and builds clause by clause; at *estimates the tissue's initial water potential*, it completes: **At zero change in mass there is no net movement of water, so the solution's water potential gives an estimate of the tissue's initial water potential, under these conditions.** The see-saw icon dims (the handle is not the answer).

**On-screen text:** *membrane*; *solution*; *plant cell*; *0 kPa — pure water at atmospheric pressure (reference)*; *higher (less negative)* / *lower (more negative)*; *initially: …* tags; *net movement of water by osmosis*; the sentence.

---

### BEAT 4 · The potato: what the method responds to · 2:16–3:05
**Narration:**
> Now the material, and what the method is really detecting. Potato contains water, dissolved cell-sap solutes and insoluble starch reserves. You measure the tissue's change in mass, as a proxy for net water exchange. This is not a starch test, and the insoluble starch does not make the tissue solute-free, or stop damaged cells leaking. Potato fits the method well: it is firm, it cuts into identical cylinders, and its mass changes enough to weigh. The catches are that potatoes, and regions within one, differ; liquid clings to the surface; and cut cells can leak. The method handles each.

**Visual action:**
1. **From the first frame**, `PotatoCylinderRig` in `bench` is on screen with the potato cut in half on the tile, cut face up. At *what the method is really detecting*, a magnifier opens on the cut face showing a few `CellOsmosisSet` plant cells with the `starch-grains` overlay, caption *schematic; not to scale*.
2. At *dissolved cell-sap solutes*, the vacuole of one cell is ringed, label **cell sap: water + dissolved solutes**; at *insoluble starch reserves*, the grains are ringed, label **insoluble starch grains**.
3. At *as a proxy for net water exchange*, the balance brightens beside the magnifier, tag **readout: change in mass → proxy for net water exchange**.
4. At *not a starch test*, a ghost iodine dropper appears over the grains and is struck through, tag *not a starch assay*; at *stop damaged cells leaking*, a cell at the magnifier's cut edge is drawn torn, with a few tokens drifting out, tag *damaged cells at cut surfaces can leak*.
5. At *Potato fits the method well*, an on-screen note card opens beside the potato, headed **fit**; at *cuts into identical cylinders*, a ghost cylinder outline is traced on the cut face; at *changes enough to weigh*, the balance display flickers through two decimal places, tag *changes large enough to register on a 0.01 g balance*.
6. At *potatoes, and regions within one, differ*, a second, differently shaped potato appears ghosted beside the first with a ≠ sign, and the half potato's centre and edge are tagged *region*; the note card gains **one potato, one borer, random allocation**.
7. At *liquid clings to the surface*, a droplet film is drawn on a ghost cylinder; the note card gains **blot the same way each time**.
8. At *cut cells can leak*, the torn cell pulses again; the note card gains **same dimensions for every cylinder, so the same cut surface**; at *The method handles each*, the card's three lines tick in turn.

**On-screen text:** *cell sap: water + dissolved solutes*; *insoluble starch grains*; *readout: change in mass → proxy for net water exchange*; *not a starch assay*; the **fit** note card (firm · cuts into identical cylinders · mass changes enough to weigh; interferences and how the method handles them).

---

### BEAT 5 · Cutting identical cylinders, safely · 3:05–4:08
**Narration:**
> Use one potato, and remove the skin, so no cylinder has a patch of skin that the others lack. Stand it on a white tile and push a ten-millimetre cork borer straight down through the flesh until it reaches the tile, then lift the borer and push the core out. Lay each core beside a ruler and trim it to thirty millimetres with a scalpel, cutting down onto the tile. Pair the hazard, the risk and the precaution: the edges are sharp; if one slips, it can cut your hand; so cut down onto the tile, blade away from you, fingers clear. Then allocate the cylinders to tubes at random. Keep the cut cylinders covered to limit drying until you weigh and immerse each one.

**Visual action:**
1. **From the first frame**, `PotatoCylinderRig` in `cut` fills the frame: one whole potato on the white tile, cork borer, push rod, scalpel and ruler beside it; behind, the three racks of eighteen filled, bunged tubes already stand together, reduced, tag *solutions prepared before cutting · reaching room temperature*, with the empty covered humid container beside them. Prepare the solutions before cutting the tissue. At *Use one potato*, labels **one potato** and **white tile** appear.
2. At *remove the skin*, strips of skin come off under the scalpel per the handling spec (blade drawn down onto the tile, away from the body); the peeled potato is labelled *skin removed*.
3. At *push a ten-millimetre cork borer straight down*, the borer (label **cork borer, 10 mm internal diameter**) is shown: Push the borer vertically through the flesh with a slight twist, stopping at the tile surface; do not animate the edge entering the tile. Keep the supporting fingers beside and clear of the cutting path. At *push the core out*: Lift the borer before using the push rod to expel the core onto the tile.
4. At *trim it to thirty millimetres*, the core lies beside the **ruler**; the scalpel (label **scalpel**) cuts straight down at 0 mm and 30 mm; label *30 mm, trimmed*; small type *every cylinder: diameter 1.0 cm, length 3.0 cm → surface area 11.0 cm², volume 2.36 cm³ (recall 4.2.3-4)*.
5. At *cutting down onto the tile*, the scalpel's contact with the tile is ringed; time-lapse to eighteen cylinders lined on the tile.
6. At *Pair the hazard, the risk and the precaution*, a three-cell tag slides in beside the tile, cells empty; at *the edges are sharp*, cell 1 fills **hazard: sharp borer and blade**; at *it can cut your hand*, cell 2 fills **risk: a slip cuts the hand**; at *blade away from you*, cell 3 fills **precaution: cut down onto the tile, blade away from the body, fingers clear**, and the blade direction arrow on the scalpel is ringed. Credited-idea tab: **credited: the hazard, the risk it brings and the precaution, named together**; small type *syllabus p.61: "prepare a simple risk assessment of their plans, taking into account the severity of any hazards and the probability that a problem could occur"*. internal: credited idea from M24/52 Q1(c)(iii), MS p.7.
7. At *allocate the cylinders to tubes at random*, a random-number list slides in and each cylinder is assigned a tube label (**0.0-A … 1.0-C**), tag *random allocation, one potato*.
8. At *Keep the cut cylinders covered*, the covered humid container comes forward (label **covered humid container**): forceps place each allocated cylinder in its labelled position on the dry grid, out of contact with liquid water, and the lid closes; tag *covered: limits drying until each is weighed and immersed*. Keep the trimmed, allocated cylinders in labelled positions in a covered humid container, out of contact with liquid water, until each is blotted, weighed and immediately immersed. `cut` ends.

**On-screen text:** part labels; *solutions prepared before cutting · reaching room temperature*; *30 mm, trimmed*; the cylinder dimensions; the hazard–risk–precaution tag; the credited-idea tab; the syllabus p.61 line; *random allocation, one potato*; *covered humid container*; *covered: limits drying until each is weighed and immersed*.

---

### BEAT 6 · Six solutions, eighteen tubes · 4:08–4:54
**Narration:**
> First, the solutions. You need six concentrations of sucrose, from distilled water up to 1.0 mole per cubic decimetre, made by proportional dilution of a 1.0 mole per cubic decimetre stock, each to a total of 20.0 cubic centimetres. For 0.4, measure 8.0 cubic centimetres of stock and 12.0 of distilled water. Then the vessels: eighteen boiling tubes, each labelled and closed with a bung to limit evaporation, three per concentration, one cylinder in each. Three cylinders sharing one tube share one solution, so they are not independent repeats; three separate tubes are.

**Visual action:**
1. **From the first frame**, `PotatoCylinderRig` is on screen with the covered humid container holding the eighteen allocated cylinders at left and, at right, under a caption *earlier: made up before the tissue was cut*, the **sucrose stock, 1.0 mol dm⁻³** bottle, the **distilled water** wash bottle and the two **25 cm³ measuring cylinders** labelled **stock** and **water**; the eye-protection pictogram and the tag *working solutions: sucrose, 0–1.0 mol dm⁻³; no hazard code for sucrose on the syllabus materials list (p.58); wipe up spills* in the frame corner. At *the solutions*, `make-up` replays as that earlier setup.
2. At *six concentrations of sucrose*, the dilution panel (Dataset 1) slides in with its six rows' concentrations only: **0.0 · 0.2 · 0.4 · 0.6 · 0.8 · 1.0 mol dm⁻³**.
3. At *proportional dilution*, the panel's two volume columns fill (stock 0.0 / 4.0 / 8.0 / 12.0 / 16.0 / 20.0 cm³; water 20.0 / 16.0 / 12.0 / 8.0 / 4.0 / 0.0 cm³); small type *syllabus p.60: "describe how different concentrations would be prepared by serial dilution or proportional dilution"*.
4. At *each to a total of 20.0 cubic centimetres*, the total column fills **20.0** in every row and is ringed.
5. At *For 0.4*, the 0.4 row brightens; stock is poured into the **stock** cylinder at 120° from upright, stream from the lip into its mouth, and made up to 8.0 cm³ with the dropper squeezed above the cylinder (not touching), meniscus at the mark; at *12.0 of distilled water*, the **water** cylinder is filled to 12.0 cm³ the same way; the worked line lands: **0.40 mol dm⁻³: 8.0 cm³ stock + 12.0 cm³ water = 20.0 cm³ (8.0 ÷ 20.0 × 1.0 = 0.40)**.
6. At *eighteen boiling tubes*, three racks of six labelled tubes slide in (**0.0-A … 1.0-C**); both cylinders are poured into tube **0.4-A** at 120°, stream into the tube's mouth; time-lapse fills the other seventeen from the panel.
7. At *closed with a bung to limit evaporation*, a bung is seated in each tube and the tube inverted gently twice (bung seated first); tag *covered: limits evaporation*. The filled racks are set together away from direct sunlight or local heat, tag *solutions reach the same room temperature before loading*.
8. At *three per concentration, one cylinder in each*, the three 0.4 tubes are bracketed, tag *three independent vessels*; a cylinder icon hovers over each tube.
9. At *share one solution*, a ghost tube with three cylinders crowded in one solution appears and is struck through, tag *not three independent repeats*; at *three separate tubes are*, the three 0.4 tubes pulse, tag **independent repeats: one cylinder per vessel**.

**On-screen text:** *earlier: made up before the tissue was cut*; bottle and cylinder labels; the safety tag; the dilution panel with the worked line; the syllabus p.60 line; tube labels; *covered: limits evaporation*; *solutions reach the same room temperature before loading*; *independent repeats: one cylinder per vessel*.

---

### BEAT 7 · Blot, weigh, immerse, and start the clock · 4:54–5:43
**Narration:**
> Before each cylinder goes in, blot it the same way every time, one roll across a paper towel, and weigh it on a balance reading to 0.01 grams. Record that mass against the tube's label. The immersion time is written into the plan before any results exist: here, sixty minutes. Start the stopwatch the moment the first cylinder touches its solution, and never reset it. The rest go in at one-minute intervals, each start time written down, so every cylinder can come out exactly sixty minutes after it went in. The room temperature, twenty-five degrees, is recorded.

**Visual action:**
1. **From the first frame**, `PotatoCylinderRig` in `load` is on screen: the covered humid container with the eighteen allocated cylinders in labelled positions, the folded paper towel, the balance, the racks of bunged tubes (solutions at room temperature, racks together away from direct sunlight or local heat) and the stopwatch at 0:00:00, with the results sheet beside them. At *blot it the same way every time*, the lid is opened, forceps take the cylinder for tube **0.0-A** (first in the loading order) and the lid closes. Open it only to take the next cylinder; keep the others covered.
2. At *one roll across a paper towel*, the forceps roll it once across the towel (tag *one roll, same pressure*).
3. At *a balance reading to 0.01 grams*, the balance is tared to **0.00 g**, the cylinder placed on the pan, and the display reads **2.51 g**; label **balance: resolution 0.01 g**.
4. At *against the tube's label*, **0.0-A · initial mass 2.51 g** writes into the results sheet.
5. At *before any results exist*, a plan card beside the sheet shows **immersion time: 60 min (fixed in the plan before any data)**, the results columns below still empty; at *here, sixty minutes*, **60 min** is ringed.
6. At *the first cylinder touches its solution*, tube 0.0-A's bung is lifted and the cylinder lowered with forceps; **on the rendered frame on which its lower end first touches the liquid, the stopwatch starts**; the cylinder slides fully under and the bung is reseated; the first-contact point is ringed and tagged **t = 0: first contact, tube 0.0-A**.
7. At *never reset it*, the running stopwatch pulses; tag *one clock, never reset*.
8. At *at one-minute intervals*, time-lapse loading of the remaining seventeen tubes in the stated order, the container opened only to take each next cylinder and closed again, each cylinder blotted, weighed and immediately lowered in. Record each cylinder's own start time at first contact: each tube's own first-contact frame writes its start time on its label (**1:00, 2:00 … 17:00**) and its initial mass into the sheet.
9. At *exactly sixty minutes after it went in*, a timeline strip under the racks shows each tube's in-time and out-time (0:00 → 60:00 … 17:00 → 77:00), tag *same immersion time for every cylinder*; `wait` begins, caption *waiting time compressed; the clock shows real elapsed time*.
10. At *twenty-five degrees*, the thermometer in the room air is labelled, reading **25 °C**; the sheet's header records *room temperature 25 °C*, and its temperature row is marked *checked during the run* (the checks are written in during `wait` and `unload`); tag *a single air reading does not prove constant solution temperature*.

**On-screen text:** *one roll, same pressure*; *balance: resolution 0.01 g*; the results sheet; the plan card; *t = 0: first contact, tube 0.0-A*; *one clock, never reset*; the timeline strip; *waiting time compressed; the clock shows real elapsed time*; *25 °C*.

---

### BEAT 8 · Out, reweigh, and a percentage for every cylinder · 5:43–6:28
**Narration:**
> When each cylinder's sixty minutes are up, lift it out with forceps, blot it exactly as before, and weigh it again. Now calculate, for every cylinder on its own: percentage change in mass equals final mass minus initial mass, divided by initial mass, times a hundred. This cylinder from distilled water went from 2.51 to 2.71 grams: a gain of 0.20 grams, divided by 2.51, times a hundred, is plus 8.0 per cent. Dividing by the starting mass lets you compare cylinders that did not start at exactly the same mass.

**Visual action:**
1. **From the first frame**, `PotatoCylinderRig` in `unload` is on screen: racks, balance, towel, results sheet; the stopwatch (still running from Beat 7) reaches **60:00**. At *lift it out with forceps*, tube 0.0-A's bung is lifted and its cylinder gripped and lifted out.
2. At *blot it exactly as before*, one roll across a fresh area of the towel, tag *same blot*.
3. At *weigh it again*, the balance is tared and reads **2.71 g**; **final mass 2.71 g** writes beside 2.51 g in the sheet; a small `CellOsmosisSet` inset opens beside the cylinder, net arrow in and fading as the cell reaches `plant-turgid`, caption *model cell state; not observed in this tissue*.
4. At *for every cylinder on its own*, a working panel opens beside the sheet, headed **for each cylinder**.
5. At *divided by initial mass, times a hundred*, the formula builds: **percentage change in mass = (final mass − initial mass) ÷ initial mass × 100**; small type *syllabus p.63: "calculate percentages and percentage changes"*.
6. At *went from 2.51 to 2.71 grams*, the two masses in the sheet row are ringed; at *a gain of 0.20 grams*, the working fills **2.71 − 2.51 = +0.20 g**.
7. At *is plus 8.0 per cent*, **+0.20 ÷ 2.51 × 100 = +8.0 %** lands (sign ringed), tag *calculated from measured masses*.
8. At *Dividing by the starting mass*, the initial-mass column of the sheet brightens (2.51, 2.46, 2.55 … values differ slightly); at *did not start at exactly the same mass*, two cylinders of 2.46 g and 2.55 g are shown side by side, each with its own +0.21 g and +0.20 g gain turning into +8.5 % and +7.8 %. Time-lapse unloading of the other seventeen follows, each at its own 60:00, the stopwatch reaching **77:00**.

**On-screen text:** *same blot*; the sheet; the formula; the worked percentage; *calculated from measured masses*; the syllabus p.63 line.

---

### BEAT 9 · COMMON MISTAKE E48: the word amount in a plan · 6:28–7:43
**Narration:**
> Here is a mistake examiners flag in planning answers, on the card. These two lines are our constructed plan for this investigation. Read them.
>
> *(silent read, 4 s)*
>
> Look at the word amount here. It can feel precise enough, since in everyday speech amount covers any quantity. But amount of potato could mean its mass, length or number of pieces, so the quantity to standardise is unclear. An examiners' report on a whole practical paper put it plainly: the term amount is not accepted as it is not specific. So name the quantity, its unit and how you get it: cylinders cut with the same cork borer, trimmed to thirty millimetres, each blotted and weighed to 0.01 grams. Now look at the second line: it uses the same word. Write twenty point zero cubic centimetres of each solution, measured with a measuring cylinder.

**Visual action:**
1. **Entry cue: *Here is a mistake examiners flag*.** From the first frame, `PotatoCylinderRig` (racks, cylinders, balance) is held at left, dimmed. The COMMON MISTAKE panel enters (header badge **COMMON MISTAKE**, terracotta border, desaturated surround) with its basis line in small type: *basis: an examiners' report key message on planning answers*; it **stays on until the last fault is corrected**.
2. At *our constructed plan*, the card's header lands: **Plan: standardised variables** with small type *our framing of a planning answer for this potato investigation; constructed plan lines, not a transcript* and, beneath it, the caption *an examiners' key message for a whole practical paper; applied here to our constructed potato plan; not a candidate transcript and not an osmosis question*. internal: basis R24 p.54, June 2024 ER, Paper 52 key messages.
3. At *Read them*, the two written lines appear in handwriting style:
   **✗ 1** *Use the same amount of potato each time.*
   **✗ 2** *Put it in the same amount of solution.*
4. **Silent read, 4 s.** Panel and card held.
5. At *Look at the word amount here*, the word *amount* in line 1 is underlined in terracotta.
6. At *It can feel precise enough*, side-note *everyday word*.
7. At *could mean its mass, length or number of pieces*, three ghost tags fan out from the underlined word, **mass? · length? · number of pieces?**; at *the quantity to standardise is unclear*, side-note *quantity unclear*.
8. At *An examiners' report on a whole practical paper*, key-message tab, exact: **examiners' key message: “The term ‘amount’ is not accepted as it is not specific.”**; at *the term amount is not accepted as it is not specific*, the sentence is underlined; boundary tag beneath in the normal accent: *a key message for the whole paper; not a global ban on the word in every context*. internal: tab source R24 p.54.
9. At *name the quantity, its unit and how you get it*, side-note **quantity · unit · operation**; the dimmed cork borer, ruler and balance at left brighten in turn.
10. At *weighed to 0.01 grams*, line 1 is struck and rewritten in place: **✓ 1** *Cylinders cut with the same cork borer and trimmed to 30 mm, each blotted and weighed to 0.01 g.* The marker stays on.
11. At *Now look at the second line*, the panel border pulses once; at *it uses the same word*, the word *amount* in line 2 is underlined in terracotta.
12. At *twenty point zero cubic centimetres*, the dimmed tubes and the **water** measuring cylinder at left brighten; line 2 is struck and rewritten in place: **✓ 2** *20.0 cm³ of each solution, measured with a measuring cylinder.* This is the last fault; **the marker clears on this completed frame**. **Exit cue: end of *measured with a measuring cylinder*.** Treatment lifts; the corrected card and the boundary tag hold.

**On-screen text:** the panel and its basis line; the header, framing line and caption; the card; the key-message tab; the boundary tag; the corrected card.

---

### BEAT 10 · The results table, and what the signs mean · 7:43–8:26
**Narration:**
> Here are the results, our illustrative data: three percentage changes for each concentration, and their mean. The signs carry the biology. Positive means the tissue gained water: that solution's water potential was initially higher than the cells'. Negative means it lost water: the solution's was initially lower. From distilled water the mean is plus 8.1 per cent; by 1.0 mole per cubic decimetre it is minus 8.6. At 0.4, the three cylinders barely moved, a hundredth of a gram each way, a mean of plus 0.1.

**Visual action:**
1. **From the first frame**, `PotatoCylinderRig`'s racks stand reduced at left and the completed results sheet enlarges at right into the results table (Dataset 2 and 3): concentration, tube, initial mass / g, final mass / g, percentage change / %, mean percentage change / %. At *our illustrative data*, caption **our illustrative data** and column tags *measured* (masses), *calculated* (percentages and means).
2. At *their mean*, the six mean cells fill: **+8.1 · +3.9 · +0.1 · −3.5 · −6.4 · −8.6**, tag *mean of three independent cylinders*.
3. At *The signs carry the biology*, the sign of every mean is ringed.
4. At *Positive means the tissue gained water*, the positive rows tint pale and a small `WaterPotentialModel` `cell-vs-solution` inset beside them shows the net arrow into the cell, fading as a `CellOsmosisSet` cell beside it reaches `plant-turgid`; at *initially higher than the cells'*, tag *initially: solution's water potential higher than the cell's*.
5. At *Negative means it lost water*, the negative rows tint and a second inset shows the net arrow out of the cell with `plant-flaccid`; at *the solution's was initially lower*, tag *initially: solution's water potential lower than the cell's*. Caption on both insets *model cell states; not observed in this tissue*.
6. At *plus 8.1 per cent*, the 0.0 row's mean is ringed with its working in small type *(8.0 + 8.5 + 7.8) ÷ 3 = 8.1*.
7. At *it is minus 8.6*, the 1.0 row's mean is ringed, *(−8.6 − 8.4 − 8.8) ÷ 3 = −8.6*.
8. At *the three cylinders barely moved*, the 0.4 rows' masses are ringed (**2.53 → 2.54, 2.48 → 2.47, 2.56 → 2.57**); a third inset shows `plant-equal` with the net arrow faded and tokens still crossing; at *a mean of plus 0.1*, the mean cell **+0.1** is ringed with *(0.4 − 0.4 + 0.4) ÷ 3 = +0.1*, tag *close to zero, not exactly zero*.

**On-screen text:** the results table; *our illustrative data*; *measured* / *calculated*; the initial-condition tags; the mean workings; *model cell states; not observed in this tissue*.

---

### BEAT 11 · The graph and its zero crossing · 8:26–9:14
**Narration:**
> Plot the mean percentage change in mass against sucrose concentration, and draw the zero line across. Then draw a smooth trend through the means, rather than joining dot to dot, because each mean still carries some scatter; here it curves gently as the losses level off. The trend falls through zero. Where it crosses, draw a construction line down to the concentration axis: 0.40 moles per cubic decimetre. That value is read from the trend, inside the range you tested. It is an interpolation, not a new data point, and nothing is extended beyond your results.

**Visual action:**
1. **From the first frame**, the results table holds at left and the racks shrink to a thumbnail; at right the empty axes of `percent-mass-change` are drawn. At *Plot the mean percentage change in mass*, the axis labels land (**mean percentage change in mass / %**; **concentration of sucrose solution / mol dm⁻³**) and the six means fly from the table's mean column onto the graph as crosses, labelled *mean of three cylinders; calculated from measured masses*; caption **our illustrative data**.
2. At *draw the zero line across*, the heavy zero line draws across, label **no change in mass**; the region tags *tissue gained water…* and *tissue lost water…* appear above and below.
3. At *draw a smooth trend through the means*, the trend curve draws from x = 0.0 to x = 1.0, label **smooth trend through the means**.
4. At *rather than joining dot to dot*, a ghost zig-zag through the crosses appears and is struck through; small type *syllabus p.63: "recognise when it is appropriate to join the points on a graph with straight ruled lines and when it is appropriate to use a line (straight or curved) of best fit"*.
5. At *curves gently as the losses level off*, the flatter right-hand part of the curve (0.6 to 1.0) is traced.
6. At *falls through zero*, the part of the curve crossing the zero line brightens.
7. At *draw a construction line down*, overlay `zero-crossing`: the marker slides along the curve to its crossing with the zero line and a dashed construction line drops to the x-axis; at *0.40 moles per cubic decimetre*, the label **concentration at zero change = 0.40 mol dm⁻³** lands at the foot of the line.
8. At *inside the range you tested*, a bracket spans the tested range 0.0 to 1.0 along the x-axis, tag *interpolated within the tested range*.
9. At *not a new data point*, the 0.4 cross (at +0.1 %) is ringed separately from the crossing, tag *calculated mean of three percentage changes*, and the crossing is tagged *construction, not a data point*.
10. At *nothing is extended beyond your results*, ghost extensions of the curve beyond 0.0 and 1.0 appear and are struck through.

**On-screen text:** axis labels; *our illustrative data*; *no change in mass*; *smooth trend through the means*; *concentration at zero change = 0.40 mol dm⁻³*; *interpolated within the tested range*; *calculated mean of three percentage changes*; *construction, not a data point*; the syllabus p.63 line.

---

### BEAT 12 · From concentration to kilopascals · 9:14–10:05
**Narration:**
> The graph gives you a concentration, not a water potential. For that, you need supplied data: in an exam, a table like this is given. Ours gives ideal-solution estimates at twenty-five degrees. Go down to 0.40, then across: minus 992 kilopascals. Keep the sign and the unit. So zero measured mass change gives an estimate of the tissue's initial water potential under these conditions, about minus 992 kilopascals. It is not proof that every cell has the same water potential, or that no solute moved and no cells were damaged. For a sharper estimate, test extra concentrations around the crossing.

**Visual action:**
1. **From the first frame**, the `percent-mass-change` graph with its `zero-crossing` overlay holds at left. At *a concentration, not a water potential*, the label **0.40 mol dm⁻³** at the foot of the construction line is ringed, tag *a concentration, mol dm⁻³*.
2. At *you need supplied data*, the `LookupTable` panel slides in at right with its header **supplied data: water potentials of sucrose solutions**, its small type *our ideal-solution estimates at 25 °C* and its caption *our illustrative potato data; our calculated lookup at 25 °C*.
3. At *in an exam, a table like this is given*, small type under the header: *supplied with the question; read it, do not calculate it*. internal: calculated from ψs = −iCRT; see Dataset 4.
4. At *Go down to 0.40*, `lookup:0.40`: the finger-line runs down the concentration column to **0.40**; at *then across*, it runs across and **−992** brightens.
5. At *Keep the sign and the unit*, the **−** and the **kPa** are ringed separately; the Beat 1 readout returns under the graph and fills **−992 kPa**.
6. At *an estimate of the tissue's initial water potential*, the statement card builds beneath: **estimate of the potato tissue's initial water potential ≈ −992 kPa**; at *under these conditions*, the card gains **this tissue · 60 min immersion · 25 °C · this dataset**.
7. At *not proof that every cell*, a small caveat tag slides beneath the card: *not proof that every cell has the same water potential*; at *no cells were damaged*, it extends: *or that no solute exchange or damage occurred*. The Beat 4 torn-cell inset returns small beside it.
8. At *test extra concentrations around the crossing*, ghost tick marks at **0.30, 0.35, 0.45, 0.50 mol dm⁻³** appear on the graph's x-axis around the crossing, tag *more concentrations near the crossing → a more precise intercept*.

**On-screen text:** *a concentration, mol dm⁻³*; the `LookupTable` panel, header and caption; *supplied with the question; read it, do not calculate it*; *−992 kPa*; the statement card and caveat; the extra-concentration tag.

---

### BEAT 13 · What I told you, on the rig and the graph · 10:05–10:44
**Narration:**
> So here it is, on the rig and the graph. One potato, identical cylinders, eighteen covered tubes, three per concentration, one cylinder in each. Blot the same way, weigh to 0.01 grams, and immerse for a stated sixty minutes, timed from first contact. A percentage change for each cylinder, then the mean. A smooth trend crossing zero at 0.40, read by construction. The supplied table turns that into minus 992 kilopascals: an estimate for this tissue, under these conditions.

**Visual action:** **No new slide.**
1. **From the first frame**, the screen returns to the layout built through the lesson: `PotatoCylinderRig` (tile with cylinders, balance, towel, racks of eighteen bunged tubes, stopwatch showing 77:00) at left, the `percent-mass-change` graph with its trend and `zero-crossing` construction at centre, the `LookupTable` panel small at right. Static. At *on the rig and the graph*, the whole layout settles; nothing moves.
2. At *One potato, identical cylinders*, the potato and the lined cylinders brighten with tags *one potato · 10 mm borer · 30 mm*.
3. At *eighteen covered tubes*, the racks brighten, tag *3 per concentration · 1 cylinder per tube · 20.0 cm³ · bunged*.
4. At *Blot the same way*, the towel and balance brighten, tags *same blot* and *resolution 0.01 g*; at *timed from first contact*, the stopwatch brightens with its tag *t = 0: first contact · 60 min each*.
5. At *A percentage change for each cylinder*, the working panel **(final − initial) ÷ initial × 100** fades in small beside the balance, with **mean of three** under it.
6. At *A smooth trend crossing zero at 0.40*, the trend, the zero line and the construction line brighten, **0.40 mol dm⁻³** labelled.
7. At *The supplied table*, the 0.40 row of the `LookupTable` brightens; at *an estimate for this tissue*, **≈ −992 kPa** brightens with its tag *this tissue, these conditions*.

---

### BEAT 14 · How it is asked, and the potato again · 10:44–11:53
**Narration:**
> How this reaches you. In a typical exam question you would be asked to sketch the expected graph for carrot tissue, and show where it crosses zero change in mass as the estimate; three marks. A second part might use a density-drop method: the drop that neither rose nor fell picks out 0.24, and the table gives minus 595 kilopascals. What you should know is: keep the two methods apart, and when you give a water potential, give kilopascals with the sign, not a concentration. The scheme doesn't need this, but carrot cells contain water and dissolved solutes too. Use intact tissue: leakage can distort either method. And a different potato can give a different estimate. And your potato? About minus 992 kilopascals, estimated from its own change in mass.

**Visual action:**
1. **From the first frame**, the familiar lesson layout stays on screen at right, reduced (`PotatoCylinderRig`, the `percent-mass-change` graph with its construction, the `LookupTable`); a compact forms surface is ready at left. At *How this reaches you*, the forms surface enters; rows 3 and 4 (below) are revealed with it, in smaller type and visually subordinate, as references that are not spoken.
2. At *sketch the expected graph for carrot tissue*, row 1 lands: **Exam-style, 3 marks** · *carrot cylinders in a range of sucrose solutions: sketch the expected graph and show how you would estimate the tissue's water potential*; a small blank sketch-axes icon beside the row draws a downward trend, tag **credited: x-axis labelled with concentration and unit · a line falling through zero once · the zero crossing marked as the estimate**; at *where it crosses zero change in mass*, the sketch's crossing is ringed and the lesson graph's construction line brightens briefly. internal: adapted from W20/51 Q1(c)(ii), QP p.5 / MS p.9.
3. At *a density-drop method*, row 2 lands beneath, visibly separate: **Exam-style, 1 mark · a different method: density drops** · *coloured drops of each carrot solution released into fresh solution of the same concentration*; at *picks out 0.24*, the `LookupTable`'s 0.24 row brightens; at *minus 595 kilopascals*, credited tab: **credited: −595 kPa, with sign and unit**, tag *our exam-style answer for carrot; not our potato's value*. internal: adapted from W20/51 Q1(d)(i), QP pp.6–7 / MS p.9; our own tissue and numbers.
4. At *keep the two methods apart*, a divider line draws between rows 1 and 2, tags *method 1: mass change, sketch and intercept* / *method 2: density drop, table lookup*; small type *our potato dataset + supplied lookup = an adaptation combining the two skills*.
5. At *not a concentration*, show the written contrast **✗ The potato tissue's water potential is 0.40 mol dm⁻³.** Strike it through and replace it in place with **✓ The fitted zero-change concentration is about 0.40 mol dm⁻³. Its supplied water potential, −992 kPa, estimates this tissue's initial water potential under these conditions.** Caption: **our wording contrast; not a quoted mark-scheme reject.** internal: method reference W20/51 Q1(c)(ii), QP p.5 / MS p.9; our calculated lookup, Dataset 4. Speak only the existing correct unit explanation. Hold the corrected version on the final frame. The graph and the `LookupTable` stay beside the card.
6. (Revealed with the forms surface at action 1; no spoken line, no cue of its own.) Row 3, small and subordinate: **Exam-style planning question, up to 6 marks from a longer list of credited points** · *a plan varying the temperature of apple-tissue cubes; related planning practice, not this protocol*; with its credited-idea tab: **credited: the hazard, the risk it brings and the precaution, named together**. internal: adapted from M24/52 Q1(c)(i), MS p.6 and Q1(c)(iii), MS p.7.
7. (Revealed with the forms surface at action 1; no spoken line, no cue of its own.) Row 4, small and subordinate: **Exam-style limitations question, up to 4 marks from a longer list** · *credited ideas include: untested intermediate concentrations · variation among cells · missing uncertainty information (our words)*. internal: adapted from M24/52 Q1(b)(ii), MS p.5.
8. At *The scheme doesn't need this*, a separate panel slides in below the forms, **dashed border, no tick, no MS tab**, headed **beyond the mark scheme**; at *carrot cells contain water and dissolved solutes too*, it fills: *carrot: water and dissolved cell-sap solutes; intact tissue needed; leakage can distort mass and density readouts*. At *a different potato can give a different estimate*, it adds: *a different potato, or one stored for weeks, can give a different estimate; this estimate belongs to this tissue, this immersion time and this dataset*, with a ghost second potato beside it.
9. At *And your potato?*, the Beat 1 potato returns small at the bottom with its readout; at *estimated from its own change in mass*, the readout reads **≈ −992 kPa (estimate; our illustrative data)** and the Beat 1 hook caption returns above it with a tick. Final frame held 2 s: forms at left, the lesson layout and the corrected (✓) wording-contrast card at right, the beyond-the-mark-scheme panel and the potato beneath. No slogan.

**On-screen text:** the four exam-style form rows; the credited tabs; the method divider; the adaptation note; the wording-contrast card (✗ struck, ✓ in place) and its caption; the **beyond the mark scheme** panel; *≈ −992 kPa (estimate; our illustrative data)*.

---

## Datasets

All potato numbers are **our illustrative data** (constructed to be realistic and consistent with an intercept at 0.40 mol dm⁻³); Dataset 4 is **our calculated ideal-solution lookup at 25 °C**. Every derived number is worked.

### Dataset 1 — proportional dilution to 20.0 cm³ (Beat 6)

Stock: sucrose solution, 1.0 mol dm⁻³; diluent: distilled water; each tube made up directly with the **stock** and **water** 25 cm³ measuring cylinders. Concentration = (volume of stock ÷ 20.0 cm³) × 1.0 mol dm⁻³.

| concentration / mol dm⁻³ | stock / cm³ | distilled water / cm³ | total / cm³ | check |
|---|---:|---:|---:|---|
| 0.0 | 0.0 | 20.0 | 20.0 | 0.0 ÷ 20.0 × 1.0 = 0.0 |
| 0.2 | 4.0 | 16.0 | 20.0 | 4.0 ÷ 20.0 × 1.0 = 0.20 |
| 0.4 | 8.0 | 12.0 | 20.0 | 8.0 ÷ 20.0 × 1.0 = 0.40 |
| 0.6 | 12.0 | 8.0 | 20.0 | 12.0 ÷ 20.0 × 1.0 = 0.60 |
| 0.8 | 16.0 | 4.0 | 20.0 | 16.0 ÷ 20.0 × 1.0 = 0.80 |
| 1.0 | 20.0 | 0.0 | 20.0 | 20.0 ÷ 20.0 × 1.0 = 1.0 |

Three tubes per concentration: 18 tubes; stock used = 3 × (0 + 4 + 8 + 12 + 16 + 20) = 3 × 60 = **180 cm³**; water = 3 × 60 = **180 cm³** (not narrated).

### Dataset 2 — cylinder masses and percentage changes (Beats 7, 8, 10)

Conditions: one potato, skin removed; cylinders cut with a 10 mm internal-diameter cork borer and trimmed to 30 mm; solutions made up before cutting and allowed to reach the same room temperature, racks kept together away from direct sunlight or local heat; random allocation to eighteen labelled boiling tubes, each closed with a bung, one cylinder in 20.0 cm³; allocated cylinders kept in labelled positions in a covered humid container, out of contact with liquid water, until each was taken out; each cylinder blotted once across a paper towel and weighed to 0.01 g immediately before immersion; loading order 0.0-A, 0.0-B, 0.0-C, 0.2-A … 1.0-C at one-minute intervals; stopwatch started on the frame the first cylinder (0.0-A) first touched its solution, never reset; each cylinder removed exactly 60 min after its own first contact (0.0-A at 60:00 … 1.0-C at 77:00), blotted the same way and reweighed; room temperature 25 °C (recorded; temperature checked during the run). Immersion time fixed in the plan before the data. Percentage change = (final − initial) ÷ initial × 100, to 1 d.p.

| conc. / mol dm⁻³ | tube | initial / g | final / g | change / g | % change (working) |
|---|---|---:|---:|---:|---|
| 0.0 | A | 2.51 | 2.71 | +0.20 | +0.20 ÷ 2.51 × 100 = +7.97 → **+8.0** |
| 0.0 | B | 2.46 | 2.67 | +0.21 | +0.21 ÷ 2.46 × 100 = +8.54 → **+8.5** |
| 0.0 | C | 2.55 | 2.75 | +0.20 | +0.20 ÷ 2.55 × 100 = +7.84 → **+7.8** |
| 0.2 | A | 2.49 | 2.58 | +0.09 | +0.09 ÷ 2.49 × 100 = +3.61 → **+3.6** |
| 0.2 | B | 2.57 | 2.68 | +0.11 | +0.11 ÷ 2.57 × 100 = +4.28 → **+4.3** |
| 0.2 | C | 2.44 | 2.53 | +0.09 | +0.09 ÷ 2.44 × 100 = +3.69 → **+3.7** |
| 0.4 | A | 2.53 | 2.54 | +0.01 | +0.01 ÷ 2.53 × 100 = +0.40 → **+0.4** |
| 0.4 | B | 2.48 | 2.47 | −0.01 | −0.01 ÷ 2.48 × 100 = −0.40 → **−0.4** |
| 0.4 | C | 2.56 | 2.57 | +0.01 | +0.01 ÷ 2.56 × 100 = +0.39 → **+0.4** |
| 0.6 | A | 2.50 | 2.42 | −0.08 | −0.08 ÷ 2.50 × 100 = −3.20 → **−3.2** |
| 0.6 | B | 2.45 | 2.36 | −0.09 | −0.09 ÷ 2.45 × 100 = −3.67 → **−3.7** |
| 0.6 | C | 2.58 | 2.49 | −0.09 | −0.09 ÷ 2.58 × 100 = −3.49 → **−3.5** |
| 0.8 | A | 2.47 | 2.31 | −0.16 | −0.16 ÷ 2.47 × 100 = −6.48 → **−6.5** |
| 0.8 | B | 2.54 | 2.38 | −0.16 | −0.16 ÷ 2.54 × 100 = −6.30 → **−6.3** |
| 0.8 | C | 2.52 | 2.36 | −0.16 | −0.16 ÷ 2.52 × 100 = −6.35 → **−6.3** |
| 1.0 | A | 2.55 | 2.33 | −0.22 | −0.22 ÷ 2.55 × 100 = −8.63 → **−8.6** |
| 1.0 | B | 2.49 | 2.28 | −0.21 | −0.21 ÷ 2.49 × 100 = −8.43 → **−8.4** |
| 1.0 | C | 2.51 | 2.29 | −0.22 | −0.22 ÷ 2.51 × 100 = −8.76 → **−8.8** |

Plausibility (not narrated): each cylinder's volume is 0.75π = 2.36 cm³ (shared numbers); at an assumed tissue density of roughly 1.05–1.10 g cm⁻³ (our assumption, used only as a check), the expected mass is about 2.5–2.6 g; the initial masses 2.44–2.58 g fit. A 0.01 g display step is about 0.4% of a 2.5 g initial mass. The ±0.01 g changes near the crossing are only one display step; resolution alone does not establish measurement uncertainty or prove a water gain or loss of that size.

### Dataset 3 — means, trend and intercept (Beats 10, 11)

| conc. / mol dm⁻³ | % changes | mean % change (working) |
|---|---|---|
| 0.0 | +8.0, +8.5, +7.8 | 24.3 ÷ 3 = **+8.1** |
| 0.2 | +3.6, +4.3, +3.7 | 11.6 ÷ 3 = 3.87 → **+3.9** |
| 0.4 | +0.4, −0.4, +0.4 | 0.4 ÷ 3 = 0.13 → **+0.1** |
| 0.6 | −3.2, −3.7, −3.5 | −10.4 ÷ 3 = −3.47 → **−3.5** |
| 0.8 | −6.5, −6.3, −6.3 | −19.1 ÷ 3 = −6.37 → **−6.4** |
| 1.0 | −8.6, −8.4, −8.8 | −25.8 ÷ 3 = **−8.6** |

Spread within each set of three (range, not narrated): 0.7, 0.7, 0.8, 0.5, 0.2, 0.4 percentage points.

**Trend (the drawn smooth curve).** Least-squares quadratic through the six means (x in mol dm⁻³, y in %): **y = 8.171 − 22.929x + 6.071x²**. Fitted values at 0.0, 0.2, 0.4, 0.6, 0.8, 1.0: +8.17, +3.83, −0.03, −3.40, −6.29, −8.69; residuals (mean − fit): −0.07, +0.07, +0.13, −0.10, −0.11, +0.09 percentage points, each smaller than the within-concentration spread, so the smooth curve is justified rather than joining the points. The curve's gradient becomes less steep with concentration (−22.9 + 12.1x per mol dm⁻³: −20.5 at 0.2, −15.6 at 0.6), which is what "curves gently as the losses level off" describes for this dataset. (A cubic fit, not drawn, crosses at 0.402; the reading does not depend on the choice.)

**Zero crossing (construction).** Solve 6.071x² − 22.929x + 8.171 = 0: x = [22.929 − √(22.929² − 4 × 6.071 × 8.171)] ÷ (2 × 6.071) = [22.929 − √(525.74 − 198.43)] ÷ 12.142 = (22.929 − 18.092) ÷ 12.142 = 4.837 ÷ 12.142 = **0.398 mol dm⁻³**, read on a 0.02 mol dm⁻³ grid as **0.40 mol dm⁻³**. Linear check between the neighbouring means 0.2 (+3.9) and 0.6 (−3.5): 0.2 + 0.4 × 3.9 ÷ 7.4 = 0.2 + 0.211 = 0.41; consistent within one grid division. The 0.4 mean (+0.1 %) lies 0.13 percentage points above the curve, a quarter of a 0.5 % small square: visibly a separate calculated mean, not the answer. The intercept lies inside the tested range 0.0–1.0 mol dm⁻³; nothing is extrapolated.

### Dataset 4 — supplied lookup (Beats 12–14)

On screen: **supplied data: water potentials of sucrose solutions**, with **our ideal-solution estimates at 25 °C**. These are our own computed data and concentration grid, not a past-paper table.

Internal derivation (not a new syllabus requirement): ψs = −iCRT, with sucrose i = 1, R = 8.314462618 kPa dm³ mol⁻¹ K⁻¹, T = 298.15 K. Thus ψs / kPa = −2478.95703 × C / (mol dm⁻³). For an open solution at atmospheric pressure, pressure potential is zero relative to that reference, so ψ = ψs. Values rounded to the nearest kPa:

| sucrose / mol dm⁻³ | our calculated water potential / kPa |
|---:|---:|
| 0.08 | −198 |
| 0.16 | −397 |
| 0.24 | −595 |
| 0.32 | −793 |
| 0.40 | −992 |
| 0.48 | −1190 |
| 0.56 | −1388 |

This is an ideal-solution approximation, not measured reference data for real sucrose solutions (non-ideality can matter). The constructed potato run is at **25 °C** throughout; its existing mass-change dataset and fitted intercept are illustrative, not observations being temperature-corrected. The graph still reads **about 0.40 mol dm⁻³**, giving **about −992 kPa** for this tissue under this model. The distinct carrot density-drop example is **0.24 mol dm⁻³ → −595 kPa**. Both are direct lookups. The concentration signs, net-water directions, zero-crossing inference, uncertainty caveats and distinction between methods are unchanged.

---

## Real-world samples

| Material | What the method responds to | Fit (range, clarity) | Interferences and how the method handles them | Beats |
|---|---|---|---|---|
| **Potato tissue** (one raw potato, skin removed, 10 mm × 30 mm cylinders) | MF6: potato contains water, dissolved cell-sap solutes and insoluble starch reserves; the readout is **tissue mass change as a proxy for net water exchange**; not a starch assay; insoluble starch does not make the tissue solute-free or prevent leakage from damaged cells | Firm; cuts into identical cylinders with one borer; in our illustrative data mass changes of about −9 % to +8 % over 60 min across 0.0–1.0 mol dm⁻³, well above the 0.01 g (≈ 0.4 %) resolution except near the crossing, where the changes sit at the resolution (Dataset 2 note) | Cylinders from different potatoes or regions differ → one potato, one borer, random allocation; surface solution → blot every cylinder the same way; drying while waiting → covered humid container until each is blotted, weighed and immediately immersed (round-1 M1); evaporation → bunged tubes; damaged cells at cut surfaces → same dimensions (same cut surface area), and the estimate is bounded by MF5's caveat (Beat 12); different potatoes or storage → beyond-the-mark-scheme panel (Beat 14) | 1, 4 (explain beat, on-screen **fit** note card), 5, 7, 8, 10, 12, 14 |
| Raw potato strips in plain water / strong sugar solution (hook) | net water entry (firm) or loss (limp), recall of 4.2.6 turgor | an illustration of this lesson's own measurement; labelled *our illustration … not a measured result* | not a measurement; no numbers attached | 1, 14 (callback) |
| Red pepper fruit-wall tissue (W20/51) (no longer shown; internal) | was named only as the paper's context; not handled | — | kept separate from our potato method (MF2) | — |
| Carrot tissue (Beat 14 exam-style stem, our own) | named only as the exam-style context; mass change and density drops, not handled on screen | — | beyond our potato method; its answer (−595 kPa) never presented as our potato value | 14 |

Explain-beat real-world example: the potato itself (Beat 4), with the on-screen **fit** note card.

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.22) | Beat(s) | How |
|---|---|---|
| investigate | 4–8 | one complete design with named apparatus and physically possible handling: material fit, cutting, dilutions, eighteen independent vessels, blotting, weighing, stated immersion time, staggered starts, timer at first contact |
| the effects of immersing plant tissues in solutions of different water potentials | 3, 10 | water-potential explanation (MF3 sentences, initial condition); positive/negative percentage change interpreted as net water entry/loss |
| using the results to estimate the water potential of the tissues | 11, 12 | smooth trend, zero crossing by construction within the tested range, supplied lookup with sign and unit; MF5 estimate caveat |
| Paper 5 expectations p.60 (proportional dilution; standardising variables; measuring to an appropriate precision) | 6, 7, 9 | worked dilution table; standardised quantities named with unit and operation (E48) |
| p.61 (risk assessment and precautions) | 5, 14 | hazard–risk–precaution paired |
| Mathematical requirements p.63 (percentages and percentage changes; means; line of best fit) | 8, 10, 11 | per-cylinder percentage change, means, smooth trend rather than dot-to-dot |
| 4.2.6 exclusion (component potentials) | all | water potential only; never named |

### Mark-scheme and examiner points → beats

| Source | Point | Beat |
|---|---|---|
| W20/51 Q1(c)(ii), QP p.5 / MS p.9 (plan-check description) | labelled downward-trending sketch; zero-mass-change intercept identified as the estimate | 11, 14 |
| W20/51 Q1(d)(i), QP pp.6–7 / MS p.9 | separate density-drop method; 0.30 mol dm⁻³; `–860kPa ;` | 14 (kept apart from our potato value) |
| Our ideal-solution lookup, Dataset 4 | 0.40 mol dm⁻³ → −992 kPa at 25 °C | 12, 13, 14 |
| W20/51 Q1(a)(ii), Q1(b), Q1(c)(i), MS pp.7–9 (plan-check description) | range/dilution, controls, percentage-change interpretation | 6, 8, 10 (taught; not shown as a form row) |
| M24/52 Q1(c)(i), MS p.6 (plan-check description) | planning, maximum 6 marks, any six of nine points; related evidence (turnip, temperature) | 14 |
| M24/52 Q1(c)(iii), MS p.7 | `ref. to hazard and risk and precaution ;` | 5, 14 |
| M24/52 Q1(b)(ii), MS p.5 (plan-check description) | limitations incl. untested intermediate concentrations, variation among cells, missing uncertainty information | 12 (extra concentrations), 14 |
| R24 p.54, June 2024 P52 key messages | “The term ‘amount’ is not accepted as it is not specific.” | 9 (E48) |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, never, only, no, nothing, cannot, because, must, needs* and causal *so/since* was reread with one question: true of all cases, or of the case on screen?
- Beat 1: "with nothing more than a balance and some sugar solutions": the method's apparatus in outline (the full list follows in Beats 5–7); no claim that no other way exists. (An earlier draft's "no probe is small enough to go inside one of its cells" was removed in self-review: research instruments can measure inside single cells.) "which way it goes depends on a comparison you cannot see": the comparison is not visible by eye; true. "So you let the tissue report it": a method choice, not a causal claim about biology.
- Beat 2: "so that anyone could repeat it exactly": an aim, stated as what they will be able to do.
- Beat 3: "adding solute lowers water potential, so these sucrose solutions have negative values": MF3, bounded by "at the same temperature and pressure" and "these". "Net osmosis is from higher to lower water potential": the definition as taught (MF3). "If … starts higher … gains mass; if … starts lower … loses mass": initial-condition comparison, for this tissue in this method. "water still crosses both ways but there is no net movement, so that solution's water potential estimates the tissue's initial water potential": the creditworthy sentence; "initial" kept; its bound (estimate, not proof) is said in Beat 12.
- Beat 4: "This is not a starch test, and the insoluble starch does not make the tissue solute-free, or stop damaged cells leaking": MF6 verbatim meaning. "Potato fits the method well": of this method's needs, with the three reasons given. "cut cells can leak": "can". "The method handles each": the three listed interferences, each with its handling on the card; not a claim of zero error (Beat 12's caveat).
- Beat 5: "push a ten-millimetre cork borer straight down through the flesh until it reaches the tile, then lift the borer and push the core out" (round-1 M1): a procedural instruction; the borer stops at the tile, which is the support, not cut material. "Keep the cut cylinders covered to limit drying until you weigh and immerse each one": "limit", not "prevent"; no claim that covering stops all drying. "so no cylinder has a patch of skin that the others lack": the purpose of peeling, bounded to the skin; no claim that the flesh is uniform (regions within a potato differ, Beat 4; random allocation handles it). "if one slips, it can cut your hand": "can". 
- Beat 6: "Three cylinders sharing one tube share one solution, so they are not independent repeats": MF5 and the plan's trap row; a statement about the design, not about all experiments.
- Beat 7: "never reset it": a procedural instruction for this clock (SHARED-SPECS timer rule). "so every cylinder can come out exactly sixty minutes after it went in": the purpose of staggering.
- Beat 8: "Dividing by the starting mass lets you compare cylinders that did not start at exactly the same mass": the reason for percentage change here; no "must".
- Beat 9 (E48): "It can feel precise enough, since in everyday speech amount covers any quantity": a possibility, not examiner testimony. "so the quantity to standardise is unclear" (round-1 should-fix 5): about this written line only; weaker than the earlier "nobody could repeat it", which overstated a specificity problem. "on a whole practical paper": the report's scope, kept; on screen *not a global ban on the word in every context*. "Now look at the second line: it uses the same word" (round-1 should-fix 3): about this card; no production instruction spoken.
- Beat 10: "The signs carry the biology": interpretation for this dataset; "initially higher/lower" kept. "the three cylinders barely moved": this dataset.
- Beat 11: "because each mean still carries some scatter": the reason for a best-fit line here (the residuals are smaller than the within-set spread, Dataset 3). "here it curves gently": bounded to this dataset. "It is an interpolation, not a new data point, and nothing is extended beyond your results": the construction rule; true of this graph.
- Beat 12: "It is not proof that every cell has the same water potential, or that no solute moved and no cells were damaged": MF5's own limit, stated as a limit. "For a sharper estimate": plan wording ("when a more precise intercept is needed").
- Beat 13: "an estimate for this tissue, under these conditions": bounded.
- Beat 14: "In a typical exam question you would be asked to sketch … three marks": our own exam-style carrot stem; no paper named; credited points in our words. "Keep the two methods apart, and when you give a water potential, give kilopascals with the sign, not a concentration": MF2 plus a unit instruction for any stated water potential; it does not claim that W20/51 Q1(c)(ii) itself asked for kilopascals (that part credits the sketch and its intercept). The closing wording contrast (round-1 M3) is written, not spoken: ✗ line struck and replaced in place by the ✓ line, captioned *our wording contrast; not a quoted mark-scheme reject*; the ✓ line says "about 0.40", "fitted" and "estimates … under these conditions", so the zero crossing is never presented as an observed zero change. The cut March 2024 sentence (round-1 runtime ruling) removes the spoken M24/52 claims; rows 3 and 4 stay as unspoken, subordinate references. "The scheme doesn't need this, but a different potato can give a different estimate": "can"; on the beyond-the-mark-scheme panel. "About minus 992 kilopascals, estimated": "about" and "estimated".
- Causal spine opening (round-1 M3, not narrated): "This investigation estimates the tissue's initial water potential …; the fitted zero-change concentration and supplied table provide the estimate": bounded to this investigation; the earlier universal "you cannot measure water potential inside a cell directly" is gone.
- No sentence says "concentration of water", names a component potential, calls −860 kPa our value, calls the crossing a data point, extrapolates beyond the tested range, claims every cell has the tissue's water potential, or calls R24/52 an osmosis paper.

---

## Citations

Every quotation in this storyboard, where it appears, and where it was copied from. No exam PDF was opened by the author; exam strings are those SHARED-SPECS §2 lists as verified by the plan check. **The round-1 independent check (27 September 2026) re-verified every row below against the actual W20/51 and M24/52 QP/MS PDFs and R24 pp.54–55 (one-based PDF pages); its findings are added in the Status column.**

| # | Quotation (verbatim) | Paper / session / question / page | Beat(s) | Copied from | Status |
|---|---|---|---|---|---|
| 1 | "investigate the effects of immersing plant tissues in solutions of different water potentials, using the results to estimate the water potential of the tissues" | Syllabus 2025–2027, 4.2.5, p.22 | header; 2 (small type) | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 2 | "calculate percentages and percentage changes" | Syllabus p.63 | 8 (small type) | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 3 | "recognise when it is appropriate to join the points on a graph with straight ruled lines and when it is appropriate to use a line (straight or curved) of best fit" | Syllabus p.63 | 11 (small type) | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 4 | "describe how different concentrations would be prepared by serial dilution or proportional dilution" | Syllabus p.60 | 6 (small type) | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 5 | "prepare a simple risk assessment of their plans, taking into account the severity of any hazards and the probability that a problem could occur" | Syllabus p.61 | 5 (small type) | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 6 | `ref. to hazard and risk and precaution ;` | M24/52 (March 2024, Paper 52) Q1(c)(iii), MS p.7 (m24_52) | spine; 5; 14 (unspoken row 3 tab) (no longer shown; internal: shown as credited idea in our words) | SHARED-SPECS §2; plan §4.2.5; weights S-D | **PDF-CHECKED (plan check; round-1 check: exact wording and one mark, MS p.7)** |
| 7 | `–860kPa ;` | W20/51 (November 2020, Paper 51) Q1(d)(i), MS p.9 (w20_51) | spine; 14 (no longer shown; internal) | SHARED-SPECS §2; plan §4.2.5; weights S-B | **PDF-CHECKED (plan check; round-1 check: exact answer, MS p.9)** |
| 8 | “The term ‘amount’ is not accepted as it is not specific.” | R24 p.54, June 2024 ER, Paper 52 key messages | spine; 9 (E48) | SHARED-SPECS §2; plan E48; weights S-F and E48 | **PDF-CHECKED (plan check; round-1 check: exact 12-word quotation, R24 pp.54–55, Paper 52 key messages)** |
| 9 | Historical only, superseded 27 Sep; no longer shown. (no quotation) Table 1.1: 0.10–0.70 mol dm⁻³ → −260, −540, −860, −1120, −1450, −1800, −2180 kPa, shown as *supplied data: W20/51 Table 1.1, QP p.7 — sucrose solutions used in both methods* | W20/51 (w20_51) Table 1.1, QP p.7 | 12, 13, 14; Dataset 4 | SHARED-SPECS §4 shared numbers; plan MF2 | **PDF-CHECKED (plan check; round-1 check: all seven pairs match; QP p.7 says the table covers solutions used in method 1 and method 2)** (values) |
| 10 | (no quotation; our paraphrase) labelled downward-trending sketch; zero-mass-change intercept as the estimate; 3 marks | W20/51 (w20_51) Q1(c)(ii), QP p.5 / MS p.9 | spine; 14 (form row 1; closing contrast caption) | plan MF2 paragraph; weights S-B | **PDF-CHECKED (plan check; round-1 check: x-axis label/unit, downward line crossing once, x-intercept indicated as estimate)** (description, not wording) |
| 11 | (no quotation; our paraphrase) density-drop method; no-rise/no-fall drop identifies 0.30 mol dm⁻³ | W20/51 (w20_51) Q1(d)(i), QP pp.6–7 / MS p.9 | 14 | plan MF2 paragraph | **PDF-CHECKED (plan check; round-1 check: QP pp.6–7 Figs 1.3–1.4, 0.30 drop level unchanged)** (description, not wording) |
| 12 | (no quotation; our paraphrase) maximum 6 marks, any six of nine listed points; turnip blocks, temperature | M24/52 (m24_52) Q1(c)(i), MS p.6 | spine; 14 (unspoken row 3) | plan §4.2.2 and §4.2.5; weights S-D | **PDF-CHECKED (plan check; round-1 check: M24/52 QP pp.6–7, MS p.6, nine listed marking points)** (description, not wording) |
| 13 | (no quotation; our paraphrase) limitations, any four of eight points; untested intermediate concentrations, variation among cells, missing uncertainty information | M24/52 (m24_52) Q1(b)(ii), MS p.5 | spine; 14 (unspoken row 4) | plan §4.2.2; weights S-C | **PDF-CHECKED (plan check; round-1 check: M24/52 QP pp.4–5, MS p.5, onion/NaCl context; not a universal list for potato)** (description, not wording) |
| 14 | (no quotation; our paraphrase) range/dilution, controls and percentage-change interpretation across Q1(a)(ii) 3, Q1(b) 6, Q1(c)(i) 2 | W20/51 (w20_51) MS pp.7–9 | spine; scope ledger | weights S-A | **PDF-CHECKED (plan check; round-1 check: MS pp.7–8; original asks for 50 cm³, so our 20 cm³ is an adaptation)** (description, not wording) |

Plan-check paragraphs used as our wording without quotation marks on screen: MF3 water-potential sentences (Beat 3), MF6 potato sentence (Beat 4), MF5 eighteen-vessel and estimate paragraph (Beats 6, 12), MF2 W20/51 paragraph (Beats 12, 14). They are plan text, not exam wording, and never appear on an MS/ER tab.

**UNVERIFIED items** (not quoted; shown only as our framing or paraphrase, or omitted). Items 1–4 are **resolved** by the round-1 check against the actual PDFs; paraphrase labels are retained for paraphrases.
1. **RESOLVED (round-1 check)** — the question wording of W20/51 Q1(c)(ii) and Q1(d)(i): checked, QP p.5 (Q1(c)(ii) asks for the sucrose concentration equivalent to the tissue water potential) and QP pp.6–7 (density drops). Beat 14 still describes, not quotes, them.
2. **RESOLVED (round-1 check)** — W20/51 Q1(c)(ii)'s three marking points, MS p.9: x-axis label/unit; downward line crossing once; indication of x-intercept as estimate. Still shown as our paraphrase (row 1), never on an MS tab.
3. **RESOLVED (round-1 check)** — the W20/51 Q1(d) density-drop procedure, QP pp.6–7, Figs 1.3–1.4: methylene blue added to the post-soak solution, drop released into the matched unused solution; the 0.30 drop level unchanged. Beat 14 still says only that the drop picked out 0.30; the method is not taught.
4. **RESOLVED (round-1 check)** — M24/52 Q1(c)(i) (MS p.6, nine listed marking points; QP pp.6–7, turnip blocks, 10–50 °C) and Q1(b)(ii) (MS p.5, any four of eight; onion/NaCl). Still shown as paraphrase (rows 3 and 4).
5. `UNVERIFIED — which June 2024 Paper 52 question(s) the "amount" key message arose from.` Remains unresolved (round-1 check: the PDF places the statement in key messages and does not settle a narrower origin). Not claimed; the card is captioned as a paper-wide key message applied to our constructed plan.
6. `UNVERIFIED — a content source for the firm/limp raw-potato-strip observation used in the hook.` (Round-1 check: not exam evidence; consistent with the mechanism but not a measured observation.) Shown as *our illustration of what this lesson measures; not a measured result*, with no numbers; the lesson's own method is the evidence it builds.
7. `UNVERIFIED — a sourced density for raw potato tissue.` Used only in the Dataset 2 plausibility note (not narrated, not on screen). (Round-1 check: a plausibility assumption, not a sourced datum.)

---

## Word count and runtime

Counted by the validator over the blockquoted narration, silent-read line excluded; seconds = words ÷ 120 × 60.

| Beat | Title | Words | Seconds |
|---|---|---:|---:|
| 1 | Hook and context | 95 | 47.5 |
| 2 | What you will be able to do | 52 | 26.0 |
| 3 | Why weighing works: water potential | 124 | 62.0 |
| 4 | The potato: what the method responds to | 99 | 49.5 |
| 5 | Cutting identical cylinders, safely | 125 | 62.5 |
| 6 | Six solutions, eighteen tubes | 93 | 46.5 |
| 7 | Blot, weigh, immerse, and start the clock | 97 | 48.5 |
| 8 | Out, reweigh, and a percentage for every cylinder | 91 | 45.5 |
| 9 | COMMON MISTAKE E48: the word amount in a plan | 139 | 69.5 (+ 4 s silent read = 73.5) |
| 10 | The results table, and what the signs mean | 86 | 43.0 |
| 11 | The graph and its zero crossing | 96 | 48.0 |
| 12 | From concentration to kilopascals | 101 | 50.5 |
| 13 | What I told you, on the rig and the graph | 79 | 39.5 |
| 14 | How it is asked, and the potato again | 113 | 56.5 (+ 2.0 = 58.5, including the separately scheduled 2 s final hold) |
| **Total** | 14 beats (13 teaching + 1 error) | **1390** | **695.0** (11:35.0; 11:39.0 with the silent read; 11:41.0 with the 2 s final hold) |

**Own-words rework (27 Sep 2026):** Beat 9 142 → 139 words, Beat 14 107 → 113 words, Beat 12 unchanged at 101; total 1,387 → 1,390 (+1.5 s). The figures below are the round-2 figures and stand within those few seconds.

**Length, honestly (after round-2 check):** Narration: 1,387 words at 120 wpm = 11:33.5. E48's four-second silent read gives 11:37.5. The separately scheduled two-second final hold gives 11:39.5 total, 24.5 seconds over the 11:15 budget. E48 remains 75 seconds complete. This overrun is accepted; no additional cut or faster delivery is required. The thirteen teaching beats total **1,245 words = 10:22.5**, **22.5 s over** the 10:00 (1,200-word) teaching base. E48 is **142 words = 71 s + 4 s silent read = 75 s**, at the top of the 122–142-word range and exactly the 75 s reservation (round-1 should-fix 5 added 2 words; should-fix 3 is word-neutral).

Round-1 changes to length: author cut 1 taken (Beat 14's 22-word March 2024 sentence; rows 3 and 4 stay as unspoken subordinate references revealed with the forms surface), −22 words; M1's borer sentence (+7) and covered-storage line (+15) add 22 words to Beat 5; should-fix 5 adds 2 to E48. Net +2 words against the first draft. The check ruled: **accept the remaining overrun and the short M1 addition**; the complete investigation and estimate deserve their explanation. Speech is not accelerated, E48 is not cut and no blanket silence allowance is added.

**Remaining optional cuts (not required by the check; never touch Beat 9):**
1. ~~Beat 14 March 2024 sentence~~ — **taken in round 1.**
2. Beat 3: "First, why weighing tells you anything." (−6 words, 3 s); the balance icon joins the *water's tendency to move* action.
3. Beat 4: ", and what the method is really detecting" (−7 words, 3.5 s); move its cue to *Now the material*.
4. Beat 7: "The room temperature, twenty-five degrees, is recorded." (−7 words, 3.5 s); the thermometer and the sheet header stay on screen.
5. Beat 12: "Keep the sign and the unit." (−6 words, 3 s); the ringing stays visual and the Beat 14 wording-contrast card carries the unit point.

The check states cuts 2–5 are not required and asks that the sign/unit line, recorded temperature and explanatory lead-ins be kept.

---

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| Solute potential, pressure potential, ψ = ψs + ψp, incipient plasmolysis | excluded by 4.2.6 ("not expected"); never named |
| Plasmolysis in the potato cylinders (`plant-plasmolysed`) | not claimed for this tissue; the phenomenon is 4.2.6's and 4.2.2b's (red onion) |
| Standard deviation, standard error, error bars, t-test | A Level mathematical requirements (p.64); not in this outcome (plan ceiling) |
| Calculating water potential from constants or from osmotic equations | plan ceiling; the table is supplied |
| The density-drop method as a taught procedure | W20/51 context only; not in the plan's design (one complete design) |
| The turnip temperature investigation of M24/52 | 4.2.2b uses it as its planning close; here only as a form row |
| Diffusion, Visking tubing, beetroot, red onion | 4.2.2a, 4.2.2b |
| SA:V calculation and the agar cubes | 4.2.3-4 (the cylinder numbers are recalled in small type only) |
| Why different cultivars or stored potatoes differ | not explained; one line on the beyond-the-mark-scheme panel |

## Reusable models

| Model | Specified | For |
|---|---|---|
| **`PotatoCylinderRig`** (`bench`, `cut`, `make-up`, `load` with first-contact start, `wait`, `unload`; eighteen bunged boiling tubes; Dataset 2 as the reference run) | here | no Topic 4 lesson downstream; available to later plant-water topics by reference |
| **`percent-mass-change`** + **`zero-crossing`** (locked crossing on the drawn trend; construction, never a point; no extrapolation) | here | any later percentage-change-versus-concentration plot |
| **`LookupTable`** (supplied-data panel, `lookup:<row>`, no interpolation, provenance header and adaptation caption) | here | any later supplied-table lookup |
| `starch-grains` overlay on the `CellOsmosisSet` plant cell | here | display only; no osmotic state |
| `WaterPotentialModel` `cell-vs-solution`; `CellOsmosisSet` `plant-turgid`, `plant-equal`, `plant-flaccid` | 4.2.1a / 4.2.6 | used here by state id |

---

## Assets

| Asset | Status | Source |
|---|---|---|
| `PotatoCylinderRig` SVGs with named states (potato, tile, borer and push rod, scalpel, ruler, towel, balance with two-decimal display (label *resolution 0.01 g*), covered humid container with eighteen labelled positions, stock bottle, wash bottle, two labelled 25 cm³ measuring cylinders, dropper, eighteen labelled boiling tubes with bungs in three racks, forceps, stopwatch, thermometer, results sheet); hands (borer push, scalpel cut, pours, forceps roll and lift) | **new build** | authored; handling specified; **rendered still-frame verification pending** (borer pushed vertically through the flesh, stopping at the tile surface, its edge never entering the tile; supporting fingers beside and clear of the cutting path; borer lifted before the push rod expels the core; container opened only to take the next cylinder; scalpel blade down onto the tile, away from the body; pours at about 120° with the stream from the computed lip into the receiving mouth; dropper above the cylinder, not touching; bung seated before inverting; level liquid surfaces; first-contact frame of tube 0.0-A) |
| `percent-mass-change` graph with `zero-crossing` overlay | **new build** | authored on the Topic 3 `RateGraph` conventions; crossing locked at x = 0.398 on the drawn quadratic |
| `LookupTable` panel | **new build** | authored; our ideal-solution values at 25 °C, Dataset 4; no Cambridge data or artwork |
| `starch-grains` overlay | **new build** | authored |
| `WaterPotentialModel` (`cell-vs-solution`), `CellOsmosisSet` (`plant-turgid`, `plant-equal`, `plant-flaccid`) | reuse | 4.2.1a, 4.2.6 |
| Hook beakers and potato strips | new, schematic vector | authored; no photograph, no generated image |
| E48 card and COMMON MISTAKE panel; objectives surface and pictograms (cylinder-and-ruler, mini graph with zero line, table-with-arrow); hazard–risk–precaution tag; safety tag and eye-protection pictogram; forms surface; closing wording-contrast card (✗ struck and replaced in place by ✓; caption *our wording contrast; not a quoted mark-scheme reject*); **beyond the mark scheme** panel (dashed border, no tick, no MS tab) | new card content; shared panels | authored; COMMON MISTAKE panel from Topics 1–3 |
| Micrographs, photographs, Cambridge artwork | none | — |

---

## Plan interpretations

1. **Intercept at a tested concentration.** The plan fixes the tested concentrations (0.0–1.0 in steps of 0.2) and the illustrative intercept (0.40 mol dm⁻³, so our lookup uses −992 kPa directly). The crossing therefore falls at a tested concentration. I made the 0.4 mean **+0.1 %** (not zero), drew the trend as a least-squares quadratic that crosses at 0.398 (0.40 on the grid), and made Beat 11 ring the 0.4 mean separately from the crossing, so the answer is read from the trend by construction and the crossing is never a plotted point. Beat 12 names extra concentrations around the crossing (MF5) for a more precise intercept.
2. **Immersion time 60 min, loading at one-minute intervals, room temperature 25 °C.** The plan requires the immersion time to be specified before the dataset and staggered starts, without fixing values; I chose these and state them before any result (Beat 7). Covered storage limits pre-immersion drying; each cylinder is then blotted, weighed and immediately immersed. Initial weighing alone does not prevent drying. (Round-1 check M1; the solutions are prepared before cutting, the one-minute stagger and all eighteen vessels retained.)
3. **"Covered vessels" = boiling tubes closed with bungs**, each made up directly with two labelled 25 cm³ measuring cylinders (stock, water). The apparatus list (p.56) includes boiling tubes and bungs; 20.0 cm³ covers a 30 mm cylinder in a boiling tube.
4. **E48 placement:** after the method (Beat 9) and before the results, where the standardised quantities have just been shown; the card is labelled *our framing of a planning answer … constructed plan lines, not a transcript* and carries the exact E48 caption from the plan. The repairs are the plan's wording ("cylinders cut with the same cork borer and trimmed to 30 mm, each blotted and weighed to 0.01 g"; "20.0 cm³ of each solution, measured with a measuring cylinder").
5. **Status tags.** SHARED-SPECS §2 tags the listed strings **PDF-CHECKED (plan check)**; §3's spine instruction mentions PDF-UNCHECKED. I followed §2 and the citations-column rule (every exam row carries one of the two tags; all exam rows here rest on the plan check, including the descriptions, which are marked "description, not wording").
6. **Handle.** The plan names none for 4.2.5; I chose *a see-saw sitting level* and converted it at once (Beat 3). It avoids "balance", which would collide with the top-pan balance.
7. **Hazard labels (should-fix 7).** The only hazard with a meaningful risk here is cutting, paired hazard–risk–precaution in narration (Beat 5). For the solutions I stated the working concentrations and that sucrose carries no hazard code on the syllabus materials list, with eye protection shown; no hazard is invented.
8. **`starch-grains` overlay.** The MF6 sentence names insoluble starch reserves; showing them needed a display overlay on the 4.2.6 plant cell. It adds no state or term beyond "insoluble starch grains".
9. **Plasmolysis not claimed.** The negative rows use `plant-flaccid`, not `plant-plasmolysed`, because the dataset does not show plasmolysis and the potato cells are not observed; all insets are captioned *model cell states; not observed in this tissue*.
10. **Controls.** The plan's design has no separate control group; distilled water (0.0) is part of the range. W20/51's control points are listed only in the scope ledger as a described credit, not claimed as a form row here.
11. **Hook example.** Raw potato strips firm in plain water and limp in strong sugar solution are used as an illustration of what the lesson measures, labelled as such and listed UNVERIFIED 6, since the plan asks for examples only with a verified source.
12. **Exam close.** W20/51's two methods are separate rows with a divider, each named (method 1 mass change, sketch and intercept; method 2 density drop, table lookup), as SHARED-SPECS §2a lists the 4.2.5 close; M24/52 planning and limitations follow, as the task brief asks. The MS answer `–860kPa ;` is shown as the scheme's, and the real-world extra (different potatoes) is spoken as beyond the scheme on its own dashed panel, per the REAL-WORLD SAMPLES rule. **Closing wording contrast (round-1 check M3, replacing the first draft's no-reject-card close):** the user-designated VIDEO-STRUCTURE requires a closing reject card and SHARED-SPECS §2 allows an honestly labelled authored contrast, so the close shows ✗ *The potato tissue's water potential is 0.40 mol dm⁻³.* struck and replaced in place by the ✓ fitted-concentration/supplied-water-potential sentence, captioned *our wording contrast; not a quoted mark-scheme reject*. No Cambridge R/I instruction is invented; it is not a new COMMON MISTAKE beat. The March 2024 spoken sentence is cut (round-1 runtime ruling, author cut 1); its two rows remain as unspoken subordinate references.

13. **Specs updated during drafting.** `SHARED-SPECS.md`, `AGENT-BRIEF.md` and the validator were revised while this draft was in progress (new §2a lesson table and exam closes; complete error beat = narration at 120 wpm + silent read, 122–142 words; reject cards only on verified R/I lines; exact `WaterPotentialModel` and `CellOsmosisSet` label wording). I re-read both files in full and applied the changes: E48 trimmed from 148 to 140 words (content unchanged: both faults, the R24 quotation, where/why/why-it-loses, in-place repairs); the reject card removed (restored in round 1 as an authored wording contrast, interpretation 12); the scale label, the *initially: solution's water potential higher / equal / lower than the cell's* labels and the `plant-turgid` equilibrium arrow brought into line.
14. **Self-review changes to narration.** The hook no longer says that no probe can enter a cell (research instruments can); "measure" became "put a number on" (the lesson estimates); "on the frame" (production language) became "the moment" in Beat 7; the peeling rationale is bounded to the skin; M24/52's limitation point is attributed to "the March 2024 paper", not to its planning question.

---

## Validator run

`python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.5/STORYBOARD.md`

```
== storyboards/topic-04/4.2.5/STORYBOARD.md
beat  words  cues maxgap  status
   1     95    11     14  ok
   2     52     4     15  ok
   3    124    13     22  ok
   4     99    13     15  ok
   5    125    12     22  ok
   6     93    11     16  ok
   7     97    11     14  ok
   8     91    10     16  ok
   9    142    15     24  ok
  10     86    11     12  ok
  11     96    11     15  ok
  12    101    11     16  ok
  13     79     9     15  ok
  14    107    13     17  ok
TOTAL words 1387  cues 155  runtime at 120 wpm 11:33.5  beats 14  failing beats 0
```

---

## CHECK RESPONSE (round 1)

Check: `r1/4.2.5/CHECK.md` (27 September 2026, NOT CLEARED). Applied to this storyboard only; no plan, shared specification or other file edited.

| ID | Status | What changed |
|---|---|---|
| M1 (borer stops at the tile) | applied | Beat 5 sentence 2 now reads verbatim: “Stand it on a white tile and push a ten-millimetre cork borer straight down through the flesh until it reaches the tile, then lift the borer and push the core out.” Model **Boring** paragraph and Beat 5 action 3 now carry verbatim: “Push the borer vertically through the flesh with a slight twist, stopping at the tile surface; do not animate the edge entering the tile. Keep the supporting fingers beside and clear of the cutting path. Lift the borer before using the push rod to expel the core onto the tile.” Cues *push a ten-millimetre cork borer straight down* and *push the core out* unchanged and still exact, unique and ordered. Assets row updated. |
| M1 (protect the waiting tissue) | applied | Verbatim contract (“Prepare the solutions before cutting the tissue. Keep the trimmed, allocated cylinders in labelled positions in a covered humid container, out of contact with liquid water, until each is blotted, weighed and immediately immersed. Open it only to take the next cylinder; keep the others covered. Record each cylinder's own start time at first contact.”) added as the model's **Order and storage** handling bullet, with its sentences placed in Beats 5 (actions 1, 8), 6 (action 1) and 7 (actions 1, 8). New part **covered humid container**; states reordered `bench` → `make-up` → `cut` → `load` → `wait` → `unload`; `cut` ends with the cylinders stored; `load` opens the container only for the next cylinder. Spoken line added at the end of Beat 5: “Keep the cut cylinders covered to limit drying until you weigh and immerse each one.” (15 words), container appearing on cue *Keep the cut cylinders covered* (new action 8). Interpretation 2 now reads verbatim: “Covered storage limits pre-immersion drying; each cylinder is then blotted, weighed and immediately immersed. Initial weighing alone does not prevent drying.” One-minute stagger and eighteen vessels retained. |
| M1 (prepared racks as earlier setup) | applied with interpretation | Beat 5 shows the filled, bunged racks already standing (tag *solutions prepared before cutting (made up: Beat 6) · reaching room temperature*); Beat 6 shows the stored cylinders at left and its make-up sequence under the caption *earlier: made up before the tissue was cut*, cue *the solutions* now “`make-up` replays as that earlier setup”. Beat 6 narration (“Next, the solutions.”) left untouched, since the check did not change it; “next” reads as the next step of the explanation, and the caption carries the chronology. |
| M2 (resolution, not ± accuracy) | applied | Every `balance, ±0.01 g` → **balance: resolution 0.01 g** (model parts, Beat 7 action 3 and on-screen text); recap tag `±0.01 g` → **resolution 0.01 g** (Beat 13 action 4). Dataset 2 note now reads verbatim: “A 0.01 g display step is about 0.4% of a 2.5 g initial mass. The ±0.01 g changes near the crossing are only one display step; resolution alone does not establish measurement uncertainty or prove a water gain or loss of that size.” No error bars or statistics added. |
| M3 (Beat 11 label) | applied | Beat 11 action 9 tag *measured mean* → *calculated mean of three percentage changes* (also listed in on-screen text). Consistency edit: Dataset 3's “visibly a separate measured mean” → “visibly a separate calculated mean”. |
| M3 (Beat 14 close) | applied with interpretation | Action 5 replaced by the check's exact treatment: ✗ **The potato tissue's water potential is 0.40 mol dm⁻³.** struck through and replaced in place with ✓ **The fitted zero-change concentration is about 0.40 mol dm⁻³. Its supplied water potential, −1120 kPa, estimates this tissue's initial water potential under these conditions.**; caption **our wording contrast; not a quoted mark-scheme reject. Method reference: W20/51 Q1(c)(ii), QP p.5 / MS p.9; supplied Table 1.1, QP p.7.**; graph and lookup retained beside it; corrected version held on the final frame (action 9). Only interpretation: the cue is written in this file's convention (*not a concentration*) rather than curly quotes, so the validator reads it as a cue. No new narration. Error-beat paragraph, interpretation 12, absolutes sweep, assets and on-screen text updated; no badge; not a new COMMON MISTAKE beat. |
| M3 (causal spine) | applied | Opening sentence now: “This investigation estimates the tissue's initial water potential from mass changes across a range of solutions; the fitted zero-change concentration and supplied table provide the estimate.” |
| Should-fix 1 (table provenance) | applied | Recurring header → **supplied data: W20/51 Table 1.1, QP p.7 — sucrose solutions used in both methods** (LookupTable model, Beat 12 action 2, Dataset 4, citations row 9 with page corrected to QP p.7); red-pepper context kept as small type *paper context: red pepper tissue*; density-drop result kept separate. |
| Should-fix 2 (starch in plastids) | applied | `starch-grains` overlay: each grain drawn inside a small plastid outline, not as a free cytoplasmic body; sole label **insoluble starch grains**; plastids not named. |
| Should-fix 3 (E48 register) | applied | “The marker stays on: the second line uses the same word.” → “Now look at the second line: it uses the same word.” (11 words for 11 by the validator); cues remapped to *Now look at the second line* and *it uses the same word*. The actual marker stays until the final repair. |
| Should-fix 4 (temperature) | applied | Model handling now carries verbatim: “Allow all solutions to reach the same room temperature before loading; keep all racks together away from direct sunlight or local heat and check temperature during the run.” Shown in Beats 5–7 (racks together, solutions reaching room temperature); `wait`/`unload` write temperature checks into the sheet (no invented values); Beat 7 action 10 tag *a single air reading does not prove constant solution temperature*. |
| Should-fix 5 (“nobody could repeat it”) | applied | E48 was reworded (should-fix 3), so “nobody could repeat it” → “the quantity to standardise is unclear”; cue remapped, side-note *quantity unclear*. Recount: E48 **142 words = 71 s + 4 s = 75 s**, inside 122–142 and the 75 s reservation; all five moves unchanged. |
| Runtime ruling (author cut 1) | applied | Beat 14's 22-word March 2024 sentence removed; rows 3 and 4 (with the M24/52 MS p.7 tab) revealed with the forms surface as unspoken, subordinate references; obsolete cues removed. Cuts 2–5 not taken, per the check. |
| UNVERIFIED 1–4 | applied (resolved) | Recorded as RESOLVED with the check's pages and findings; item 5 kept unresolved; items 6–7 annotated as not exam evidence. Citations Status column gains each round-1 verification. |
| Numerical audit | no change needed | Geometry, dilutions, masses, means, fit (root 0.398), lookup and timing confirmed by the check; unchanged. |

Word counts: Beat 5 103 → 125; Beat 9 140 → 142; Beat 14 129 → 107; total **1,387 words = 11:33.5, 11:37.5 with the E48 silent read** (22.5 s over 11:15, accepted by the check's runtime ruling). Beat windows re-derived from the ledger.

New validator TOTAL: `TOTAL words 1387  cues 155  runtime at 120 wpm 11:33.5  beats 14  failing beats 0`

---

## CHECK RESPONSE (round 2)

Check: `r2/4.2.5/CHECK.md` (27 September 2026, CLEARED WITH MINOR EDITS). Only the two minor edits applied; no other text changed.

| ID | Status | What changed |
|---|---|---|
| 1 (Beat 6 chronology) | applied | Beat 6 narration “Next, the solutions.” → “First, the solutions.” (word-neutral; cue *the solutions* unchanged, still exact, unique and ordered). Beat 5 action 1 tag and its on-screen-text listing → *solutions prepared before cutting · reaching room temperature*. Beat 6 caption *earlier: made up before the tissue was cut* kept. Typicality sweep: the changed sentence makes no claim. |
| 2 (final hold) | applied with interpretation | “Length, honestly” opening replaced verbatim: “Narration: 1,387 words at 120 wpm = 11:33.5. E48's four-second silent read gives 11:37.5. The separately scheduled two-second final hold gives 11:39.5 total, 24.5 seconds over the 11:15 budget. E48 remains 75 seconds complete. This overrun is accepted; no additional cut or faster delivery is required.” (heading tag updated to “after round-2 check”; the teaching-base and E48 detail sentences retained). Beat 14 header window 10:44–11:38 → **10:44–11:40**. Beat 14 runtime-table entry → “53.5 (+ 2.0 = 55.5, including the separately scheduled 2 s final hold)”; interpretation: the Total row also gains “11:39.5 with the 2 s final hold” so the ledger agrees. No second blanket silence allowance added. |

Word counts unchanged: **1,387 words = 11:33.5 narration; 11:39.5 with E48's 4 s read and the 2 s final hold** (24.5 s over 11:15, accepted by the check). Validator output unchanged, so `## Validator run` stands as pasted.

New validator TOTAL: `TOTAL words 1387  cues 155  runtime at 120 wpm 11:33.5  beats 14  failing beats 0`


## Recheck 27 Sep — current build authority

Dataset 4 and Beats 12–14 now use our own ideal-solution table at 25 °C. Older citation/check-response records of W20/51 table values, headers or 21 °C are historical and superseded; do not build from them. Current potato lookup: 0.40 → −992 kPa; carrot lookup: 0.24 → −595 kPa. See STORYBOARD-RECHECK-27SEP.md for the calculation and current timing.


**27 Sep recheck scope:** changed beats from b56dbe41 and their required numerical/cue/timing dependencies only. Current narration recount: **1406 words** at the stated effective 120 wpm; per-beat timings and holds are documented in STORYBOARD-RECHECK-27SEP.md. Earlier pasted validation and runtime snapshots are historical.
