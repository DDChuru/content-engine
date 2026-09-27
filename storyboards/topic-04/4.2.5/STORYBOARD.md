# 4.2.5 — Estimating the water potential of potato tissue

**Storyboard, first draft. Cloud run 006, 27 September 2026.** No audio, no code, no render. Folder `storyboards/topic-04/4.2.5/`.
Cambridge 9700 syllabus 2025–2027, p.22. Command word **INVESTIGATE** (with "using the results to estimate"). Budget from `TOPIC-PLAN-04-MEMBRANES.md` §4.2.5 and the lesson list, and `TOPIC-04-WEIGHTS.md` (4.2.5 row and paragraph; supplementary S-A to S-D, S-F; register E48): **11:15 = teaching 10:00 (about 1,200 words) + one complete error beat 1:15 (E48); 13 teaching beats + 1 error beat**, delivered here as **14 beats (13 teaching + 1 error)**. 4.2.5 has no direct Paper 2 exposure in the cited blocks (0/5); both cited Paper 5s (W20/51, M24/52) bear on it as supplementary practical evidence outside the counts. Runtime estimated at **120 words per minute of final video** (words ÷ 120); the 4 s silent read in E48 sits inside that effective rate and is not added again.

> **4.2.5** investigate the effects of immersing plant tissues in solutions of different water potentials, using the results to estimate the water potential of the tissues

(syllabus p.22)

**Authorities read, in full:** `work/006/AGENT-BRIEF.md`; `work/006/SHARED-SPECS.md` (binding: hard rules, layout, shared models, shared numbers, the verbatim list); `plan/topic-04/TOPIC-PLAN-04-MEMBRANES.md` (§4.2.5 in full with the MF5 eighteen-vessel paragraph, the MF2 W20/51 paragraph and Table 1.1, the MF6 potato sentence and the E48 entry; §4.2.1 MF3 water-potential sentences; §4.2.6 equilibrium paragraph; the lesson list and build order; the shared-model table; the traps table; the UNVERIFIED register; the PLAN-CHECK RESPONSE); `plan/topic-04/TOPIC-04-WEIGHTS.md` (4.2.5 row and paragraph; supplementary S-A, S-B, S-C, S-D, S-F; register E48 and its five-move requirement; mathematical requirements); `cloud-inputs/003/standards/VIDEO-STRUCTURE.md` (all); `CONTENT-ARCHITECTURE.md`; `SYLLABUS-9700-DETAIL.md` (Topic 4 outcomes and introduction pp.21–22; apparatus pp.56–57; materials p.58; Paper 5 planning and data expectations pp.60–61; mathematical requirements p.63); the cleared examples `cloud-inputs/006/examples/3.1.3/STORYBOARD.md` and `3.2.1b/STORYBOARD.md`; `cloud-inputs/003/topic-03/3.1.1-2/CHECK.md` and `3.2.2-3/CHECK.md`; the plan check `cloud-checks/006/plan/CHECK.md` on `origin/cloud/006-checks` (MF2, MF5, MF6, should-fix 7, the quotation table); `cloud-inputs/006/evidence/GATE-CRITERIA-9700-04-CELL-MEMBRANES-AND-TRANSPORT.md` (G04) and `EXAMINER-INSIGHT-9700.md` (for context only; no prose from them is quoted). **No question paper, mark scheme or examiner report PDF was opened for this draft.** Every exam quotation is one of the strings SHARED-SPECS §2 lists as verified by the plan check; everything else is our wording, a labelled paraphrase with its citation, or listed as `UNVERIFIED`.

**Build position:** tenth of the ten Topic 4 lessons: 4.1.1-2 → 4.1.3 → 4.1.4 → 4.2.1a → 4.2.1b → 4.2.6 → 4.2.2a → 4.2.2b → 4.2.3-4 → **4.2.5**.

**Models used (recall, by state id):** `WaterPotentialModel` (4.2.1a; state `cell-vs-solution` added by 4.2.6, with the plant cell outline); `CellOsmosisSet` (4.2.6; states `plant-turgid`, `plant-equal`, `plant-flaccid` only); `SAVShapes` cylinder dimensions (4.2.3-4; numbers only, small type); plain-graph axis conventions from the Topic 3 `RateGraph` (quantity / unit; points as crosses).

**Models published here:** `PotatoCylinderRig` (eighteen vessels); plain graph configuration `percent-mass-change` with construction overlay `zero-crossing`; `LookupTable` panel (*supplied data from W20/51*); a display-only overlay `starch-grains` on the `CellOsmosisSet` plant cell (no new osmotic state). Everything drawn is a MODEL or labelled apparatus; every potato number is *our illustrative data*; the only supplied numbers are W20/51 Table 1.1's, labelled as such.

---

## The causal spine

One idea carries the lesson: **you cannot measure water potential inside a cell directly, so you let the tissue report it by its own change in mass across a range of solutions; the solution that produces no change in mass matches the tissue's initial water potential, and a supplied table turns that concentration into kilopascals.**

> **Plant tissue gains mass in a solution whose water potential is initially higher than its own and loses mass in one whose water potential is initially lower, because net osmosis is from higher to lower water potential through partially permeable membranes. Immerse identical potato cylinders, three independent vessels per concentration, for a stated time; calculate each cylinder's percentage change in mass, then the mean; draw a smooth trend through the means and read, by construction within the tested range, the concentration at zero change. At that concentration there is no net movement of water, so the solution's water potential, read with its sign and unit from supplied data, is an estimate of the tissue's initial water potential under these conditions.**

**What the mark schemes credit, quoted:** [W20/51 Q1(d)(i), MS p.9] `–860kPa ;` (the density-drop method's answer at 0.30 mol dm⁻³ from the supplied table; **PDF-CHECKED (plan check)**). [M24/52 Q1(c)(iii), MS p.7] `ref. to hazard and risk and precaution ;` (1 mark; **PDF-CHECKED (plan check)**). [R24 p.54, June 2024 P52 key messages] “The term ‘amount’ is not accepted as it is not specific.” (**PDF-CHECKED (plan check)**). Described, not quoted (plan-check descriptions, used as our paraphrase with the citation): W20/51 Q1(c)(ii), QP p.5 / MS p.9, 3 marks for a labelled downward-trending sketch and identifying its zero-mass-change intercept as the estimate; W20/51 Q1(a)(ii) 3, Q1(b) 6, Q1(c)(i) 2, MS pp.7–9: range/dilution, controls and percentage-change interpretation across different parts; M24/52 Q1(c)(i), maximum 6 marks, any six of nine listed points, a plan varying the temperature of turnip blocks (related planning evidence, not this protocol); M24/52 Q1(b)(ii), MS p.5, limitations, any four of eight points, of which untested intermediate concentrations, variation among cells and missing uncertainty information are examples. W20/51 is red pepper fruit-wall tissue and two separate methods; **our potato mass-change dataset followed by a supplied lookup is an adaptation combining these skills, not the paper's original numerical solution** (plan check MF2). So the spine is what is credited: a downward trend with its zero-change intercept as the estimate; a supplied-table lookup with sign and unit; quantities named specifically; hazard, risk and precaution together.

**The handle:** *a see-saw sitting level* (Beat 3). Neither side wins: water still crosses both ways, but nothing net moves. Converted at once, in the same breath: *where the change in mass is zero, there is no net movement of water, so that solution's water potential equals the tissue's initial water potential.* The handle is never the exam answer.

**Typicality rules applied.** Zero measured mass change gives **an estimate of the tissue's initial water potential under these conditions**; it is not proof that every cell has identical water potential or that no solute exchange or damage occurred (MF5, said in Beat 12). Comparisons are labelled **initially** higher/lower. "Potato fits the method" is said of this method's needs (firm, cuts cleanly, mass changes enough to weigh), not as a claim that every potato behaves the same; different potatoes can give different estimates (beyond-the-mark-scheme panel, Beat 14). The trend is "smooth" and "curves gently" for **this dataset**; no general curve shape is claimed. The intercept is read **within the tested range**; nothing is extrapolated. The 0.4 mol dm⁻³ mean (+0.1 %) is shown as a mean, and the answer is read from the trend, not from that point. The R24 sentence is stated as a key message for June 2024 Paper 52 **as a whole**, applied to our constructed plan; R24/52 is not called an osmosis paper. −860 kPa is spoken only as W20/51's density-drop answer. Reasons students err are phrased as possibilities ("It can feel precise enough, since…"). The 4.2.6 exclusion holds: water potential only; the component potentials are never named.

**One error beat, five moves** (announce → written card → 4 s silent read → talk-through with cue-synced rings → correct in place): **E48 in Beat 9**, badge **COMMON MISTAKE** (basis: R24 p.54, a genuine paper-wide quantity-specificity warning in the June 2024 Paper 52 key messages, fairly applied to constructed potato/solution sentences; weights register E48). Two faults; the marker clears only on the completed correct frame. Caption on the card: *report key message for June 2024 Paper 52 as a whole; applied here to our constructed potato plan; not a candidate transcript and not an osmosis question*. No other beat carries a badge; Beat 14's reject card is captioned as our wording contrast.

---

## The models, specified once

### `PotatoCylinderRig` (published here)

Parts, each named with an SVG text label where it sits:
- **potato** (one raw potato, skin removed; label *one potato*), on a **white tile**.
- **cork borer**, 10 mm internal diameter (label **cork borer, 10 mm internal diameter**), with its **push rod** for expelling the core.
- **scalpel** (label **scalpel**) and a **ruler** in mm lying on the tile.
- **cylinders**: diameter 10 mm, length **30 mm** each (label on first appearance *30 mm, trimmed*); small type on first appearance *every cylinder: diameter 1.0 cm, length 3.0 cm → surface area 11.0 cm², volume 2.36 cm³ (recall 4.2.3-4)*.
- **paper towel**, folded flat on the bench (label **paper towel: blot the same way each time**).
- **top-pan balance** reading to **0.01 g** (display shows two decimal places; label **balance, ±0.01 g**), with a **tare** button.
- **sucrose stock, 1.0 mol dm⁻³** bottle and **distilled water** wash bottle; two **25 cm³ measuring cylinders**, labelled **stock** and **water** (never swapped); a **dropper** for making up to the mark.
- **eighteen boiling tubes** in three racks of six, each closed with a **bung** (the covered vessels), each labelled with its concentration and repeat letter: **0.0-A, 0.0-B, 0.0-C, 0.2-A … 1.0-C**; three per concentration (0.0, 0.2, 0.4, 0.6, 0.8, 1.0 mol dm⁻³), one cylinder in **20.0 cm³** in each.
- **blunt forceps** (label **forceps**); **stopwatch** (one running clock, never reset); a **thermometer** in the room air (reading **21 °C**); a **results sheet** listing the eighteen labels, the loading order, each tube's start time, initial and final masses.

Safety (should-fix 7; specified here, not lectured): the cutting frames carry the paired tag *hazard: sharp borer and blade · risk: a slip cuts the hand · precaution: cut down onto the tile, blade away from the body, fingers clear*. The solution frames carry an eye-protection pictogram and the tag *working solutions: sucrose, 0–1.0 mol dm⁻³; no hazard code for sucrose on the syllabus materials list (p.58); wipe up spills*.

Handling (specified here; rendered still-frame verification pending):
- **Skin removal:** strips of skin cut off with the scalpel, the potato held flat on the tile, blade drawn down onto the tile and away from the body.
- **Boring:** the potato stands on the tile; the borer is pushed **straight down** through the flesh **into the tile** with a slight twist, the free hand on top of the potato away from the borer's path; the borer is lifted and the core pushed out with the push rod onto the tile.
- **Trimming:** each core lies beside the ruler; the scalpel cuts straight down onto the tile at the 0 mm and 30 mm marks.
- **Solutions:** stock is poured from its bottle into the **stock** cylinder at about 120° from upright, mouth below base, the stream leaving the computed lip into the cylinder's mouth, and made up to the mark with the dropper squeezed **above** the cylinder, never touching; the same for distilled water into the **water** cylinder; each cylinder poured at about 120° into the boiling tube's mouth; the bung seated, then the tube inverted gently twice to mix; liquid surfaces level in every frame.
- **Blotting:** forceps roll the cylinder **once** across the folded paper towel, the same way each time (tag *one roll, same pressure*).
- **Weighing:** the balance is tared to 0.00 g, the cylinder placed on the pan with forceps, the reading recorded.
- **Immersion:** the bung is lifted, the cylinder lowered with forceps and released just above the liquid so it slides fully under; the bung is reseated.
- **Removal:** bung lifted, cylinder gripped with forceps and lifted out, blotted and weighed as before.

States:
- **`bench`**: potato on tile, borer, scalpel, ruler, balance, towel, stock, water, cylinders and racks, all at rest; eighteen labelled tubes empty.
- **`cut`**: skin removed; boring and trimming per the handling; eighteen cylinders lined on the tile; a random-number list slides in and assigns each cylinder to a tube label (tag *random allocation, one potato*).
- **`make-up`**: the dilution panel (Dataset 1) beside the racks; each tube receives its stock and water volumes, is bunged and inverted; label pulses as it fills.
- **`load`**: tube by tube in the stated loading order (Dataset 2), each cylinder blotted, weighed and lowered in. **On the rendered frame on which the first cylinder's lower end first touches its solution, the stopwatch starts; that frame is t = 0.** Every later tube's own first-contact frame writes its start time on its label (1:00, 2:00 … 17:00). Any later *t = 0* tag highlights the already-running clock; it is never reset.
- **`wait`**: time-lapse caption *waiting time compressed; the clock shows real elapsed time*; clock runs from 17:00 to 60:00.
- **`unload`**: each tube emptied of its cylinder exactly 60:00 after its own start (tube 1 at 60:00 … tube 18 at 77:00), cylinder blotted and reweighed; final mass recorded beside its initial mass.

### Plain graph configuration `percent-mass-change`, with overlay `zero-crossing` (published here)

Built on the Topic 3 `RateGraph` axis conventions: labels are SVG text nodes in the *quantity / unit* form; points are small crosses; caption **our illustrative data** throughout.
- **Axes:** y **mean percentage change in mass / %**, −10 to +10, major ticks every 2 %, small squares 0.5 %; x **concentration of sucrose solution / mol dm⁻³**, 0.0 to 1.0, major ticks every 0.2, small squares 0.02 mol dm⁻³. The **zero line** (y = 0) is drawn heavier across the full width, label **no change in mass**.
- **Points:** the six means (Dataset 3) as crosses, labelled *mean of three cylinders; calculated from measured masses*. Individual cylinder values are shown only in the table, never plotted. No set value is plotted, so no open circle appears on this graph.
- **Trend:** a smooth curve through the means, drawn as the least-squares quadratic *y = 8.171 − 22.929x + 6.071x²* over 0.0 ≤ x ≤ 1.0 only (Dataset 3); it passes within 0.13 percentage points of every mean; label **smooth trend through the means**. It is never extended beyond x = 0.0 or x = 1.0.
- **Overlay `zero-crossing`:** a marker slides along the trend to where it meets the zero line, locked at **x = 0.398** on the curve (reads **0.40** on the 0.02 mol dm⁻³ grid); a dashed **construction line** drops vertically from that crossing to the x-axis; label **concentration at zero change = 0.40 mol dm⁻³ (read from the trend; interpolated within the tested range)**. The crossing is never drawn as a cross or dot; tag *construction, not a data point*.
- **Regions:** above the zero line a pale tag *tissue gained water: solution's water potential initially higher*; below, *tissue lost water: solution's water potential initially lower*.

### `LookupTable` panel (published here)

A two-column table panel on its own card surface, header **supplied data from W20/51 (red pepper; density-drop method): Table 1.1**, columns **concentration of sucrose solution / mol dm⁻³** and **water potential / kPa**, seven rows exactly: 0.10 → −260; 0.20 → −540; 0.30 → −860; 0.40 → −1120; 0.50 → −1450; 0.60 → −1800; 0.70 → −2180. Caption in small type: *our potato dataset followed by this supplied lookup is an adaptation combining two skills from W20/51; not the paper's original numerical solution*. State `lookup:<row>`: a finger-line runs down the concentration column to the row, then across to the water potential, which brightens; the sign and the unit are ringed separately. No row is added, interpolated or edited.

### Display overlay `starch-grains` on the `CellOsmosisSet` plant cell (published here, used here only)

Five or six small grey-white ovals in the cytoplasm of the plant cell, label **insoluble starch grains**; no change to any osmotic state, wall, membrane, vacuole or label. Used only in Beat 4's magnifier.

### Models used by state id (not respecified)

- `WaterPotentialModel` `cell-vs-solution` (4.2.1a / 4.2.6): the membrane strip drawn vertically and relabelled *membrane*; left compartment the surrounding **solution**, right compartment a **plant cell** outline; the vertical water-potential scale with **0 kPa (pure water at atmospheric pressure)** at the top and "more negative" downward, no numbers; labels *initially: higher water potential (less negative)* / *initially: lower water potential (more negative)*; water tokens cross both ways, the crossing counter shows the net direction; the net arrow fades when the water potentials are equal while crossings continue. Captions *schematic; not to scale* and *particles drawn schematically; not to scale; far fewer than real*.
- `CellOsmosisSet` (4.2.6): `plant-turgid` (protoplast pressed on the wall), `plant-equal`, `plant-flaccid` (protoplast no longer pressing); each labelled with its initial comparison of water potentials. `plant-plasmolysed` is not used (plasmolysis is not claimed for these cylinders). Caption here *model cell states; not observed in this tissue*.

---

## Beat by beat

Beat windows in the headings follow the per-beat ledger (words ÷ 120; the 4 s silent read in Beat 9 sits inside the effective rate); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch over 30 words without a stated visual change.

### BEAT 1 · Hook and context · 0:00–0:47
**Narration:**
> Ever wondered how you could measure the water potential of a potato, when no probe is small enough to go inside one of its cells? Leave raw potato strips in plain water and they come out firm; leave them in a strong sugar solution and they go limp. The tissue is swapping water with the liquid around it, and which way it goes depends on a comparison you cannot see. So you let the tissue report it: weigh it before and after. By the end of this lesson, that report becomes a number in kilopascals.

**Visual action:**
1. **From the first frame**, `PotatoCylinderRig` in `bench` is on screen, reduced: a whole raw potato on a white tile, the top-pan balance at rest beside it, and two beakers of liquid (no labels yet). At *measure the water potential of a potato*, the hook question appears as a compact caption above the potato.
2. At *no probe is small enough*, a magnifier opens on the potato's surface showing one plant cell (`CellOsmosisSet` outline, *schematic; not to scale*), with a ghost probe tip far larger than the cell; small ✗ beside the probe.
3. At *Leave raw potato strips in plain water*, the magnifier closes; the left beaker is labelled **plain water** and three raw potato strips are lowered into it with forceps; at *come out firm*, after a time-lapse wipe (caption *time compressed*), forceps lift one strip by one end and it stays straight, tag **firm**.
4. At *a strong sugar solution*, the right beaker is labelled **strong sugar solution** and three strips go in the same way; at *go limp*, one is lifted after the same time-lapse and droops, tag **limp**. Small type under both: *our illustration of what this lesson measures; not a measured result*.
5. At *swapping water with the liquid around it*, small insets open over each strip: `CellOsmosisSet` `plant-turgid` over the firm strip (net-arrow in) and `plant-flaccid` over the limp strip (net-arrow out), caption *model cell states; not observed in this tissue*.
6. At *a comparison you cannot see*, a question-mark tag hangs between each beaker's liquid and its inset cell.
7. At *let the tissue report it*, a fresh strip is laid on the balance pan; at *weigh it before and after*, the display lights **before: _ . _ _ g** and **after: _ . _ _ g** (blank digits).
8. At *a number in kilopascals*, a blank readout **… kPa** appears under the potato; dissolve to the objectives surface.

**On-screen text:** the hook question; *plain water*; *strong sugar solution*; *firm*; *limp*; *our illustration of what this lesson measures; not a measured result*; *model cell states; not observed in this tissue*; *… kPa*.

---

### BEAT 2 · What you will be able to do · 0:47–1:12
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

### BEAT 3 · Why weighing works: water potential · 1:12–2:13
**Narration:**
> First, why weighing tells you anything. Water potential describes water's tendency to move. Pure water at atmospheric pressure is the reference, zero kilopascals. At the same temperature and pressure, adding solute lowers water potential, so these sucrose solutions have negative values, and a less negative value is higher. Net osmosis is from higher to lower water potential, through partially permeable membranes. If the solution's water potential starts higher than the cells', they take in water and the tissue gains mass; if it starts lower, the tissue loses mass. Picture a see-saw sitting level. Written properly: where the change in mass is zero, water still crosses both ways but there is no net movement, so that solution's water potential equals the tissue's initial water potential.

**Visual action:**
1. **From the first frame**, `WaterPotentialModel` in `cell-vs-solution` is on screen: the vertical membrane strip (label *membrane*), the **solution** compartment at left, a **plant cell** outline at right, the vertical water-potential scale beside it; captions *schematic; not to scale* and *particles drawn schematically; not to scale; far fewer than real*. At *why weighing tells you anything*, a small balance icon sits under the model.
2. At *water's tendency to move*, water tokens begin their random motion in both compartments and some cross the membrane both ways; recall tag *recall: 4.2.1a, 4.2.6*.
3. At *zero kilopascals*, the top of the scale is ringed and labelled **0 kPa: pure water at atmospheric pressure**.
4. At *adding solute lowers water potential*, orange double-hexagon **sucrose** tokens drop into the solution compartment and the solution's marker on the scale slides down below 0; at *a less negative value is higher*, an arrow up the scale is labelled **higher (less negative)** and one down **lower (more negative)**.
5. At *Net osmosis is from higher to lower water potential*, the net-movement arrow appears across the membrane from the higher marker's side toward the lower.
6. At *starts higher than the cells'*, the solution's marker sits above the cell's marker (tag *initially: solution's water potential higher*); more tokens cross into the cell on the counter and the net arrow points into the cell; at *the tissue gains mass*, a small cylinder icon beside the model gains a **+** tag.
7. At *if it starts lower*, the solution's marker slides below the cell's (tag *initially: solution's water potential lower*); the counter reverses, the net arrow points out of the cell, and the cylinder icon's tag becomes **−**.
8. At *Picture a see-saw sitting level*, a small see-saw icon settles level beside the model, strap-line *handle: a level see-saw*.
9. At *Written properly*, the markers slide to the same level (tag *equal water potentials*); the net arrow fades while tokens keep crossing both ways and the counter's two numbers run level; the cylinder icon's tag becomes **0**.
10. At *the change in mass is zero*, the sentence surface slides up beneath the model and builds clause by clause; at *equals the tissue's initial water potential*, it completes: **At zero change in mass there is no net movement of water, so the solution's water potential = the tissue's initial water potential.** The see-saw icon dims (the handle is not the answer).

**On-screen text:** *membrane*; *solution*; *plant cell*; *0 kPa: pure water at atmospheric pressure*; *higher (less negative)* / *lower (more negative)*; *initially: …* tags; *net movement of water by osmosis*; the sentence.

---

### BEAT 4 · The potato: what the method responds to · 2:13–3:05
**Narration:**
> Now the material, and what the method is really detecting. Potato contains water, dissolved cell-sap solutes and insoluble starch reserves. You measure the tissue's change in mass, as a proxy for net water exchange. This is not a starch test, and the insoluble starch does not make the tissue solute-free, or stop damaged cells leaking. Potato fits the method well: it is firm, it cuts into identical cylinders, and its mass changes enough to weigh. The catches are that potatoes, and regions within one, differ; liquid clings to the surface; and cut cells can leak. The method handles each.

**Visual action:**
1. **From the first frame**, `PotatoCylinderRig` in `bench` is on screen with the potato cut in half on the tile, cut face up. At *what the method is really detecting*, a magnifier opens on the cut face showing a few `CellOsmosisSet` plant cells with the `starch-grains` overlay, caption *schematic; not to scale*.
2. At *dissolved cell-sap solutes*, the vacuole of one cell is ringed, label **cell sap: water + dissolved solutes**; at *insoluble starch reserves*, the grains are ringed, label **insoluble starch grains**.
3. At *as a proxy for net water exchange*, the balance brightens beside the magnifier, tag **readout: change in mass → proxy for net water exchange**.
4. At *not a starch test*, a ghost iodine dropper appears over the grains and is struck through, tag *not a starch assay*; at *stop damaged cells leaking*, a cell at the magnifier's cut edge is drawn torn, with a few tokens drifting out, tag *damaged cells at cut surfaces can leak*.
5. At *Potato fits the method well*, an on-screen note card opens beside the potato, headed **fit**; at *cuts into identical cylinders*, a ghost cylinder outline is traced on the cut face; at *changes enough to weigh*, the balance display flickers through two decimal places, tag *changes within a 0.01 g balance's resolution*.
6. At *potatoes, and regions within one, differ*, a second, differently shaped potato appears ghosted beside the first with a ≠ sign, and the half potato's centre and edge are tagged *region*; the note card gains **one potato, one borer, random allocation**.
7. At *liquid clings to the surface*, a droplet film is drawn on a ghost cylinder; the note card gains **blot the same way each time**.
8. At *cut cells can leak*, the torn cell pulses again; the note card gains **same dimensions for every cylinder, so the same cut surface**; at *The method handles each*, the card's three lines tick in turn.

**On-screen text:** *cell sap: water + dissolved solutes*; *insoluble starch grains*; *readout: change in mass → proxy for net water exchange*; *not a starch assay*; the **fit** note card (firm · cuts into identical cylinders · mass changes enough to weigh; interferences and how the method handles them).

---

### BEAT 5 · Cutting identical cylinders, safely · 3:05–3:55
**Narration:**
> Use one potato, with the skin removed, so every cylinder is the same kind of tissue. Stand it on a white tile and push a ten-millimetre cork borer straight down through it into the tile, then push the core out. Lay each core beside a ruler and trim it to thirty millimetres with a scalpel, cutting down onto the tile. Pair the hazard, the risk and the precaution: the edges are sharp; if one slips, it can cut your hand; so cut down onto the tile, blade away from you, fingers clear. Then allocate the cylinders to tubes at random.

**Visual action:**
1. **From the first frame**, `PotatoCylinderRig` in `bench` fills the frame: one whole potato on the white tile, cork borer, push rod, scalpel and ruler beside it. At *Use one potato*, labels **one potato** and **white tile** appear.
2. At *the skin removed*, strips of skin come off under the scalpel per the handling spec (blade drawn down onto the tile, away from the body); the peeled potato is labelled *skin removed*.
3. At *push a ten-millimetre cork borer straight down*, the borer (label **cork borer, 10 mm internal diameter**) is pushed straight down through the flesh into the tile with a slight twist, the free hand on top of the potato away from its path; at *push the core out*, the borer is lifted and the push rod expels the core onto the tile.
4. At *trim it to thirty millimetres*, the core lies beside the **ruler**; the scalpel (label **scalpel**) cuts straight down at 0 mm and 30 mm; label *30 mm, trimmed*; small type *every cylinder: diameter 1.0 cm, length 3.0 cm → surface area 11.0 cm², volume 2.36 cm³ (recall 4.2.3-4)*.
5. At *cutting down onto the tile*, the scalpel's contact with the tile is ringed; time-lapse to eighteen cylinders lined on the tile.
6. At *Pair the hazard, the risk and the precaution*, a three-cell tag slides in beside the tile, cells empty; at *the edges are sharp*, cell 1 fills **hazard: sharp borer and blade**; at *it can cut your hand*, cell 2 fills **risk: a slip cuts the hand**; at *blade away from you*, cell 3 fills **precaution: cut down onto the tile, blade away from the body, fingers clear**, and the blade direction arrow on the scalpel is ringed. Citation tab, exact: **M24/52 Q1(c)(iii), MS p.7: `ref. to hazard and risk and precaution ;`**; small type *syllabus p.61: "prepare a simple risk assessment of their plans, taking into account the severity of any hazards and the probability that a problem could occur"*.
7. At *allocate the cylinders to tubes at random*, `cut` ends: a random-number list slides in and each cylinder is assigned a tube label (**0.0-A … 1.0-C**), tag *random allocation, one potato*.

**On-screen text:** part labels; *30 mm, trimmed*; the cylinder dimensions; the hazard–risk–precaution tag; the M24/52 tab; the syllabus p.61 line; *random allocation, one potato*.

---

### BEAT 6 · Six solutions, eighteen tubes · 3:55–4:44
**Narration:**
> Next, the solutions. You need six concentrations of sucrose, from distilled water up to 1.0 mole per cubic decimetre, made by proportional dilution of a 1.0 mole per cubic decimetre stock, each to a total of 20.0 cubic centimetres. For 0.4, measure 8.0 cubic centimetres of stock and 12.0 of distilled water. Then the vessels: eighteen boiling tubes, each labelled and closed with a bung to limit evaporation, three per concentration, one cylinder in each. Three cylinders sharing one tube share one solution, so they are not independent repeats; three separate tubes are.

**Visual action:**
1. **From the first frame**, `PotatoCylinderRig` is on screen with the eighteen cylinders on the tile at left and, at right, the **sucrose stock, 1.0 mol dm⁻³** bottle, the **distilled water** wash bottle and the two **25 cm³ measuring cylinders** labelled **stock** and **water**; the eye-protection pictogram and the tag *working solutions: sucrose, 0–1.0 mol dm⁻³; no hazard code for sucrose on the syllabus materials list (p.58); wipe up spills* in the frame corner. At *the solutions*, `make-up` begins.
2. At *six concentrations of sucrose*, the dilution panel (Dataset 1) slides in with its six rows' concentrations only: **0.0 · 0.2 · 0.4 · 0.6 · 0.8 · 1.0 mol dm⁻³**.
3. At *proportional dilution*, the panel's two volume columns fill (stock 0.0 / 4.0 / 8.0 / 12.0 / 16.0 / 20.0 cm³; water 20.0 / 16.0 / 12.0 / 8.0 / 4.0 / 0.0 cm³); small type *syllabus p.60: "describe how different concentrations would be prepared by serial dilution or proportional dilution"*.
4. At *each to a total of 20.0 cubic centimetres*, the total column fills **20.0** in every row and is ringed.
5. At *For 0.4*, the 0.4 row brightens; stock is poured into the **stock** cylinder at 120° from upright, stream from the lip into its mouth, and made up to 8.0 cm³ with the dropper squeezed above the cylinder (not touching), meniscus at the mark; at *12.0 of distilled water*, the **water** cylinder is filled to 12.0 cm³ the same way; the worked line lands: **0.40 mol dm⁻³: 8.0 cm³ stock + 12.0 cm³ water = 20.0 cm³ (8.0 ÷ 20.0 × 1.0 = 0.40)**.
6. At *eighteen boiling tubes*, three racks of six labelled tubes slide in (**0.0-A … 1.0-C**); both cylinders are poured into tube **0.4-A** at 120°, stream into the tube's mouth; time-lapse fills the other seventeen from the panel.
7. At *closed with a bung to limit evaporation*, a bung is seated in each tube and the tube inverted gently twice (bung seated first); tag *covered: limits evaporation*.
8. At *three per concentration, one cylinder in each*, the three 0.4 tubes are bracketed, tag *three independent vessels*; a cylinder icon hovers over each tube.
9. At *share one solution*, a ghost tube with three cylinders crowded in one solution appears and is struck through, tag *not three independent repeats*; at *three separate tubes are*, the three 0.4 tubes pulse, tag **independent repeats: one cylinder per vessel**.

**On-screen text:** bottle and cylinder labels; the safety tag; the dilution panel with the worked line; the syllabus p.60 line; tube labels; *covered: limits evaporation*; *independent repeats: one cylinder per vessel*.

---

### BEAT 7 · Blot, weigh, immerse, and start the clock · 4:44–5:36
**Narration:**
> Before each cylinder goes in, blot it the same way every time, one roll across a paper towel, and weigh it on a balance reading to 0.01 grams. Record that mass against the tube's label. The immersion time is written into the plan before any results exist: here, sixty minutes. Start the stopwatch on the frame the first cylinder touches its solution, and never reset it. The rest go in at one-minute intervals, each start time written down, so every cylinder can come out exactly sixty minutes after it went in. The room temperature, twenty-one degrees, is recorded.

**Visual action:**
1. **From the first frame**, `PotatoCylinderRig` in `load` is on screen: the eighteen allocated cylinders, the folded paper towel, the balance, the racks of bunged tubes and the stopwatch at 0:00:00, with the results sheet beside them. At *blot it the same way every time*, forceps pick up the cylinder for tube **0.0-A** (first in the loading order).
2. At *one roll across a paper towel*, the forceps roll it once across the towel (tag *one roll, same pressure*).
3. At *a balance reading to 0.01 grams*, the balance is tared to **0.00 g**, the cylinder placed on the pan, and the display reads **2.51 g**; label **balance, ±0.01 g**.
4. At *against the tube's label*, **0.0-A · initial mass 2.51 g** writes into the results sheet.
5. At *before any results exist*, a plan card beside the sheet shows **immersion time: 60 min (fixed in the plan before any data)**, the results columns below still empty; at *here, sixty minutes*, **60 min** is ringed.
6. At *the first cylinder touches its solution*, tube 0.0-A's bung is lifted and the cylinder lowered with forceps; **on the rendered frame on which its lower end first touches the liquid, the stopwatch starts**; the cylinder slides fully under and the bung is reseated; the first-contact point is ringed and tagged **t = 0: first contact, tube 0.0-A**.
7. At *never reset it*, the running stopwatch pulses; tag *one clock, never reset*.
8. At *at one-minute intervals*, time-lapse loading of the remaining seventeen tubes in the stated order, each cylinder blotted, weighed and lowered in; each tube's own first-contact frame writes its start time on its label (**1:00, 2:00 … 17:00**) and its initial mass into the sheet.
9. At *exactly sixty minutes after it went in*, a timeline strip under the racks shows each tube's in-time and out-time (0:00 → 60:00 … 17:00 → 77:00), tag *same immersion time for every cylinder*; `wait` begins, caption *waiting time compressed; the clock shows real elapsed time*.
10. At *twenty-one degrees*, the thermometer in the room air is labelled, reading **21 °C**; the sheet's header records *room temperature 21 °C*.

**On-screen text:** *one roll, same pressure*; *balance, ±0.01 g*; the results sheet; the plan card; *t = 0: first contact, tube 0.0-A*; *one clock, never reset*; the timeline strip; *waiting time compressed; the clock shows real elapsed time*; *21 °C*.

---

### BEAT 8 · Out, reweigh, and a percentage for every cylinder · 5:36–6:24
**Narration:**
> When each cylinder's sixty minutes are up, lift it out with forceps, blot it exactly as before, and weigh it again. Now calculate, for every cylinder on its own: percentage change in mass equals final mass minus initial mass, divided by initial mass, times a hundred. This cylinder from distilled water went from 2.51 to 2.71 grams: a gain of 0.20 grams, divided by 2.51, times a hundred, is plus 8.0 per cent. Dividing by the starting mass lets you compare cylinders that did not start at exactly the same mass.

**Visual action:**
1. **From the first frame**, `PotatoCylinderRig` in `unload` is on screen: racks, balance, towel, results sheet; the stopwatch (still running from Beat 7) reaches **60:00**. At *lift it out with forceps*, tube 0.0-A's bung is lifted and its cylinder gripped and lifted out.
2. At *blot it exactly as before*, one roll across a fresh area of the towel, tag *same blot*.
3. At *weigh it again*, the balance is tared and reads **2.71 g**; **final mass 2.71 g** writes beside 2.51 g in the sheet; a small `CellOsmosisSet` `plant-turgid` inset opens beside the cylinder, caption *model cell state; not observed in this tissue*.
4. At *for every cylinder on its own*, a working panel opens beside the sheet, headed **for each cylinder**.
5. At *divided by initial mass, times a hundred*, the formula builds: **percentage change in mass = (final mass − initial mass) ÷ initial mass × 100**; small type *syllabus p.63: "calculate percentages and percentage changes"*.
6. At *went from 2.51 to 2.71 grams*, the two masses in the sheet row are ringed; at *a gain of 0.20 grams*, the working fills **2.71 − 2.51 = +0.20 g**.
7. At *is plus 8.0 per cent*, **+0.20 ÷ 2.51 × 100 = +8.0 %** lands (sign ringed), tag *calculated from measured masses*.
8. At *Dividing by the starting mass*, the initial-mass column of the sheet brightens (2.51, 2.46, 2.55 … values differ slightly); at *did not start at exactly the same mass*, two cylinders of 2.46 g and 2.55 g are shown side by side, each with its own +0.21 g and +0.20 g gain turning into +8.5 % and +7.8 %. Time-lapse unloading of the other seventeen follows, each at its own 60:00, the stopwatch reaching **77:00**.

**On-screen text:** *same blot*; the sheet; the formula; the worked percentage; *calculated from measured masses*; the syllabus p.63 line.

---

### BEAT 9 · COMMON MISTAKE E48: the word amount in a plan · 6:24–7:36
**Narration:**
> Here is a mistake examiners flag in planning answers, on the card. These two lines are our own constructed plan for this investigation. Read them.
>
> *(silent read, 4 s)*
>
> Look at the word amount here, in the first line. It can feel precise enough, since in everyday speech amount covers any quantity. But amount of potato could mean its mass, its length or the number of pieces, so nobody could repeat it. The June 2024 report on Paper 52 says, for the paper as a whole: the term amount is not accepted as it is not specific. So name the quantity, its unit and how you get it: cylinders cut with the same cork borer, trimmed to thirty millimetres, each blotted and weighed to 0.01 grams. The marker stays on, because the second line uses the same word. Write twenty point zero cubic centimetres of each solution, measured with a measuring cylinder.

**Visual action:**
1. **Entry cue: *Here is a mistake examiners flag*.** From the first frame, `PotatoCylinderRig` (racks, cylinders, balance) is held at left, dimmed. The COMMON MISTAKE panel enters (header badge **COMMON MISTAKE**, terracotta border, desaturated surround) with its basis line in small type: *basis: June 2024 examiner report, Paper 52 key messages, R24 p.54*; it **stays on until the last fault is corrected**.
2. At *our own constructed plan*, the card's header lands: **Plan: standardised variables** with small type *our framing of a planning answer for this potato investigation; constructed plan lines, not a transcript* and, beneath it, the caption *report key message for June 2024 Paper 52 as a whole; applied here to our constructed potato plan; not a candidate transcript and not an osmosis question*.
3. At *Read them*, the two written lines appear in handwriting style:
   **✗ 1** *Use the same amount of potato each time.*
   **✗ 2** *Put it in the same amount of solution.*
4. **Silent read, 4 s.** Panel and card held.
5. At *Look at the word amount here*, the word *amount* in line 1 is underlined in terracotta.
6. At *It can feel precise enough*, side-note *everyday word*.
7. At *could mean its mass, its length or the number of pieces*, three ghost tags fan out from the underlined word, **mass? · length? · number of pieces?**; at *nobody could repeat it*, side-note *not repeatable*.
8. At *The June 2024 report on Paper 52*, citation tab, exact: **R24 p.54, June 2024 P52 key messages: “The term ‘amount’ is not accepted as it is not specific.”**; at *the term amount is not accepted as it is not specific*, the sentence is underlined; boundary tag beneath in the normal accent: *a key message for the whole paper; not a global ban on the word in every context*.
9. At *name the quantity, its unit and how you get it*, side-note **quantity · unit · operation**; the dimmed cork borer, ruler and balance at left brighten in turn.
10. At *weighed to 0.01 grams*, line 1 is struck and rewritten in place: **✓ 1** *Cylinders cut with the same cork borer and trimmed to 30 mm, each blotted and weighed to 0.01 g.* The marker stays on.
11. At *The marker stays on*, the panel border pulses once; at *the second line uses the same word*, the word *amount* in line 2 is underlined in terracotta.
12. At *twenty point zero cubic centimetres*, the dimmed tubes and the **water** measuring cylinder at left brighten; line 2 is struck and rewritten in place: **✓ 2** *20.0 cm³ of each solution, measured with a measuring cylinder.* This is the last fault; **the marker clears on this completed frame**. **Exit cue: end of *measured with a measuring cylinder*.** Treatment lifts; the corrected card and the boundary tag hold.

**On-screen text:** the panel and its basis line; the header, framing line and caption; the card; the R24 tab; the boundary tag; the corrected card.

---

### BEAT 10 · The results table, and what the signs mean · 7:36–8:22
**Narration:**
> Here are the results, our illustrative data: three percentage changes for each concentration, and their mean. The signs carry the biology. Positive means the tissue gained water: that solution's water potential was initially higher than the cells'. Negative means it lost water: the solution's was initially lower. From distilled water the mean is plus 8.1 per cent; by 1.0 mole per cubic decimetre it is minus 8.6. At 0.4, the three cylinders barely moved, a hundredth of a gram each way, a mean of plus 0.1.

**Visual action:**
1. **From the first frame**, `PotatoCylinderRig`'s racks stand reduced at left and the completed results sheet enlarges at right into the results table (Dataset 2 and 3): concentration, tube, initial mass / g, final mass / g, percentage change / %, mean percentage change / %. At *our illustrative data*, caption **our illustrative data** and column tags *measured* (masses), *calculated* (percentages and means).
2. At *their mean*, the six mean cells fill: **+8.1 · +3.9 · +0.1 · −3.5 · −6.4 · −8.6**, tag *mean of three independent cylinders*.
3. At *The signs carry the biology*, the sign of every mean is ringed.
4. At *Positive means the tissue gained water*, the positive rows tint pale and a small `WaterPotentialModel` `cell-vs-solution` inset beside them shows the net arrow into the cell; `CellOsmosisSet` `plant-turgid` sits by it; at *initially higher than the cells'*, tag *initially: solution's water potential higher than the tissue's*.
5. At *Negative means it lost water*, the negative rows tint and a second inset shows the net arrow out of the cell with `plant-flaccid`; at *the solution's was initially lower*, tag *initially: solution's water potential lower than the tissue's*. Caption on both insets *model cell states; not observed in this tissue*.
6. At *plus 8.1 per cent*, the 0.0 row's mean is ringed with its working in small type *(8.0 + 8.5 + 7.8) ÷ 3 = 8.1*.
7. At *it is minus 8.6*, the 1.0 row's mean is ringed, *(−8.6 − 8.4 − 8.8) ÷ 3 = −8.6*.
8. At *the three cylinders barely moved*, the 0.4 rows' masses are ringed (**2.53 → 2.54, 2.48 → 2.47, 2.56 → 2.57**); a third inset shows `plant-equal` with the net arrow faded and tokens still crossing; at *a mean of plus 0.1*, the mean cell **+0.1** is ringed with *(0.4 − 0.4 + 0.4) ÷ 3 = +0.1*, tag *close to zero, not exactly zero*.

**On-screen text:** the results table; *our illustrative data*; *measured* / *calculated*; the initial-condition tags; the mean workings; *model cell states; not observed in this tissue*.

---

### BEAT 11 · The graph and its zero crossing · 8:22–9:13
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
9. At *not a new data point*, the 0.4 cross (at +0.1 %) is ringed separately from the crossing, tag *measured mean*, and the crossing is tagged *construction, not a data point*.
10. At *nothing is extended beyond your results*, ghost extensions of the curve beyond 0.0 and 1.0 appear and are struck through.

**On-screen text:** axis labels; *our illustrative data*; *no change in mass*; *smooth trend through the means*; *concentration at zero change = 0.40 mol dm⁻³*; *interpolated within the tested range*; *construction, not a data point*; the syllabus p.63 line.

---

### BEAT 12 · From concentration to kilopascals · 9:13–10:06
**Narration:**
> The graph gives you a concentration, not a water potential. For that, you need supplied data: this table comes from a November 2020 practical paper, and pairs sucrose concentrations with their water potentials. Go down to 0.40, then across: minus 1120 kilopascals. Keep the sign and the unit. So zero measured mass change gives an estimate of the tissue's initial water potential under these conditions, about minus 1120 kilopascals. It is not proof that every cell has the same water potential, or that no solute moved and no cells were damaged. For a sharper estimate, test extra concentrations around the crossing.

**Visual action:**
1. **From the first frame**, the `percent-mass-change` graph with its `zero-crossing` overlay holds at left. At *a concentration, not a water potential*, the label **0.40 mol dm⁻³** at the foot of the construction line is ringed, tag *a concentration, mol dm⁻³*.
2. At *you need supplied data*, the `LookupTable` panel slides in at right with its header **supplied data from W20/51 (red pepper; density-drop method): Table 1.1** and its adaptation caption.
3. At *a November 2020 practical paper*, small type under the header: *W20/51 (November 2020, Paper 51), Table 1.1*.
4. At *Go down to 0.40*, `lookup:0.40`: the finger-line runs down the concentration column to **0.40**; at *then across*, it runs across and **−1120** brightens.
5. At *Keep the sign and the unit*, the **−** and the **kPa** are ringed separately; the Beat 1 readout returns under the graph and fills **−1120 kPa**.
6. At *an estimate of the tissue's initial water potential*, the statement card builds beneath: **estimate of the potato tissue's initial water potential ≈ −1120 kPa**; at *under these conditions*, the card gains **this tissue · 60 min immersion · 21 °C · this dataset**.
7. At *not proof that every cell*, a small caveat tag slides beneath the card: *not proof that every cell has the same water potential*; at *no cells were damaged*, it extends: *or that no solute exchange or damage occurred*. The Beat 4 torn-cell inset returns small beside it.
8. At *test extra concentrations around the crossing*, ghost tick marks at **0.30, 0.35, 0.45, 0.50 mol dm⁻³** appear on the graph's x-axis around the crossing, tag *more concentrations near the crossing → a more precise intercept*.

**On-screen text:** *a concentration, mol dm⁻³*; the `LookupTable` panel, header and caption; *W20/51 (November 2020, Paper 51), Table 1.1*; *−1120 kPa*; the statement card and caveat; the extra-concentration tag.

---

### BEAT 13 · What I told you, on the rig and the graph · 10:06–10:46
**Narration:**
> So here it is, on the rig and the graph. One potato, identical cylinders, eighteen covered tubes, three per concentration, one cylinder in each. Blot the same way, weigh to 0.01 grams, and immerse for a stated sixty minutes, timed from first contact. A percentage change for each cylinder, then the mean. A smooth trend crossing zero at 0.40, read by construction. The supplied table turns that into minus 1120 kilopascals: an estimate for this tissue, under these conditions.

**Visual action:** **No new slide.**
1. **From the first frame**, the screen returns to the layout built through the lesson: `PotatoCylinderRig` (tile with cylinders, balance, towel, racks of eighteen bunged tubes, stopwatch showing 77:00) at left, the `percent-mass-change` graph with its trend and `zero-crossing` construction at centre, the `LookupTable` panel small at right. Static. At *on the rig and the graph*, the whole layout settles; nothing moves.
2. At *One potato, identical cylinders*, the potato and the lined cylinders brighten with tags *one potato · 10 mm borer · 30 mm*.
3. At *eighteen covered tubes*, the racks brighten, tag *3 per concentration · 1 cylinder per tube · 20.0 cm³ · bunged*.
4. At *Blot the same way*, the towel and balance brighten, tags *same blot* and *±0.01 g*; at *timed from first contact*, the stopwatch brightens with its tag *t = 0: first contact · 60 min each*.
5. At *A percentage change for each cylinder*, the working panel **(final − initial) ÷ initial × 100** fades in small beside the balance, with **mean of three** under it.
6. At *A smooth trend crossing zero at 0.40*, the trend, the zero line and the construction line brighten, **0.40 mol dm⁻³** labelled.
7. At *The supplied table*, the 0.40 row of the `LookupTable` brightens; at *an estimate for this tissue*, **≈ −1120 kPa** brightens with its tag *this tissue, these conditions*.

---

### BEAT 14 · How it is asked, the reject card, and the potato again · 10:46–11:53
**Narration:**
> How this reaches you. A November 2020 Paper 5 question, on red pepper tissue, gave three marks for a labelled sketch trending downward and for identifying where it crosses zero change in mass as the estimate. Separately, it used a density-drop method: the drop that neither rose nor fell picked out 0.30, and its table gave minus 860 kilopascals. Keep the two methods apart. On the reject card: a concentration is not a water potential. A March 2024 planning question gave one mark for hazard, risk and precaution together, and credited limitations such as untested concentrations in between. The scheme doesn't need this, but a different potato can give a different estimate. And your potato? About minus 1120 kilopascals, estimated from its own change in mass.

**Visual action:**
1. **From the first frame**, the familiar lesson layout stays on screen at right, reduced (`PotatoCylinderRig`, the `percent-mass-change` graph with its construction, the `LookupTable`); a compact forms surface is ready at left. At *How this reaches you*, the forms surface enters.
2. At *on red pepper tissue*, row 1 lands: **W20/51 Q1(c)(ii), 3 marks · QP p.5 / MS p.9** · *red pepper fruit-wall tissue*; at *a labelled sketch trending downward*, a small blank sketch-axes icon beside the row draws a downward trend, tag *our paraphrase of the credited points*; at *where it crosses zero change in mass*, the sketch's crossing is ringed and the lesson graph's construction line brightens briefly.
3. At *a density-drop method*, row 2 lands beneath, visibly separate: **W20/51 Q1(d)(i), 1 mark · QP pp.6–7 / MS p.9 · a different method: density drops**; at *picked out 0.30*, the `LookupTable`'s 0.30 row brightens; at *minus 860 kilopascals*, citation tab, exact: **MS p.9: `–860kPa ;`**, tag *W20/51's density-drop answer; not our potato's value*.
4. At *Keep the two methods apart*, a divider line draws between rows 1 and 2, tags *method 1: mass change, sketch and intercept* / *method 2: density drop, table lookup*; small type *our potato dataset + supplied lookup = an adaptation combining the two skills*.
5. At *On the reject card*, the reject card lands beside the graph, struck through by hand: **✗ The water potential of the potato is 0.40 mol dm⁻³.** / **✓ The potato tissue's water potential is estimated as −1120 kPa, the water potential of the 0.40 mol dm⁻³ sucrose solution that gave no change in mass.** Caption in small type *our wording contrast; not a mark-scheme reject line*; at *a concentration is not a water potential*, the units **mol dm⁻³** and **kPa** on the two lines are ringed.
6. At *A March 2024 planning question*, row 3 lands: **M24/52 Q1(c)(i), maximum 6 marks, any six of nine listed points · MS p.6** · *a plan varying the temperature of turnip blocks; related planning evidence, not this protocol*; at *hazard, risk and precaution together*, row 3 extends, citation tab, exact: **M24/52 Q1(c)(iii), MS p.7: `ref. to hazard and risk and precaution ;`**, and the Beat 5 hazard–risk–precaution tag returns small beside it.
7. At *untested concentrations in between*, row 4 lands: **M24/52 Q1(b)(ii), limitations, any four of eight points · MS p.5** · *examples: untested intermediate concentrations · variation among cells · missing uncertainty information (our paraphrase; onions and sodium chloride context)*; the Beat 12 ghost ticks at 0.30–0.50 blink on the graph.
8. At *The scheme doesn't need this*, a separate panel slides in below the forms, **dashed border, no tick, no MS tab**, headed **beyond the mark scheme**; at *a different potato can give a different estimate*, it fills: *a different potato, or one stored for weeks, can give a different estimate; this estimate belongs to this tissue, this immersion time and this dataset*, with a ghost second potato beside it.
9. At *And your potato?*, the Beat 1 potato returns small at the bottom with its readout; at *estimated from its own change in mass*, the readout reads **≈ −1120 kPa (estimate; our illustrative data)** and the Beat 1 hook caption returns above it with a tick. Final frame held 2 s: forms at left, the lesson layout and reject card at right, the beyond-the-mark-scheme panel and the potato beneath. No slogan.

**On-screen text:** the four form rows with citations; the two MS tabs; the method divider; the adaptation note; the reject card and its caption; the **beyond the mark scheme** panel; *≈ −1120 kPa (estimate; our illustrative data)*.

---

## Datasets

All potato numbers are **our illustrative data** (constructed to be realistic and consistent with an intercept at 0.40 mol dm⁻³); Dataset 4 is **supplied data from W20/51**. Every derived number is worked.

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

Conditions: one potato, skin removed; cylinders cut with a 10 mm internal-diameter cork borer and trimmed to 30 mm; random allocation to eighteen labelled boiling tubes, each closed with a bung, one cylinder in 20.0 cm³; each cylinder blotted once across a paper towel and weighed to 0.01 g immediately before immersion; loading order 0.0-A, 0.0-B, 0.0-C, 0.2-A … 1.0-C at one-minute intervals; stopwatch started on the frame the first cylinder (0.0-A) first touched its solution, never reset; each cylinder removed exactly 60 min after its own first contact (0.0-A at 60:00 … 1.0-C at 77:00), blotted the same way and reweighed; room temperature 21 °C (recorded). Immersion time fixed in the plan before the data. Percentage change = (final − initial) ÷ initial × 100, to 1 d.p.

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

Plausibility (not narrated): each cylinder's volume is 0.75π = 2.36 cm³ (shared numbers); at an assumed tissue density of roughly 1.05–1.10 g cm⁻³ (our assumption, used only as a check), the expected mass is about 2.5–2.6 g; the initial masses 2.44–2.58 g fit. A 0.01 g change on a 2.5 g cylinder is 0.4 %, so the 0.4 mol dm⁻³ values (±0.4 %) sit at the balance's resolution.

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

**Zero crossing (construction).** Solve 6.071x² − 22.929x + 8.171 = 0: x = [22.929 − √(22.929² − 4 × 6.071 × 8.171)] ÷ (2 × 6.071) = [22.929 − √(525.74 − 198.43)] ÷ 12.142 = (22.929 − 18.092) ÷ 12.142 = 4.837 ÷ 12.142 = **0.398 mol dm⁻³**, read on a 0.02 mol dm⁻³ grid as **0.40 mol dm⁻³**. Linear check between the neighbouring means 0.2 (+3.9) and 0.6 (−3.5): 0.2 + 0.4 × 3.9 ÷ 7.4 = 0.2 + 0.211 = 0.41; consistent within one grid division. The 0.4 mean (+0.1 %) lies 0.13 percentage points above the curve, a quarter of a 0.5 % small square: visibly a separate measured mean, not the answer. The intercept lies inside the tested range 0.0–1.0 mol dm⁻³; nothing is extrapolated.

### Dataset 4 — supplied lookup (Beats 12–14)

**Supplied data from W20/51 (red pepper; density-drop method), Table 1.1** (plan check MF2; values exactly as given): 0.10 → −260; 0.20 → −540; 0.30 → −860; 0.40 → −1120; 0.50 → −1450; 0.60 → −1800; 0.70 → −2180 (mol dm⁻³ → kPa). **Lookup:** the potato intercept 0.40 mol dm⁻³ is a row of the table, so **water potential = −1120 kPa**, read directly; no interpolation and no invented pair. Statement: *an estimate of the potato tissue's initial water potential under these conditions (this tissue, 60 min, 21 °C, this dataset) ≈ −1120 kPa*. W20/51 Q1(d)(i)'s own answer, −860 kPa at 0.30 mol dm⁻³, is shown only as that question's density-drop result (Beat 14), never as our potato value.

---

## Real-world samples

| Material | What the method responds to | Fit (range, clarity) | Interferences and how the method handles them | Beats |
|---|---|---|---|---|
| **Potato tissue** (one raw potato, skin removed, 10 mm × 30 mm cylinders) | MF6: potato contains water, dissolved cell-sap solutes and insoluble starch reserves; the readout is **tissue mass change as a proxy for net water exchange**; not a starch assay; insoluble starch does not make the tissue solute-free or prevent leakage from damaged cells | Firm; cuts into identical cylinders with one borer; in our illustrative data mass changes of about −9 % to +8 % over 60 min across 0.0–1.0 mol dm⁻³, well above the 0.01 g (≈ 0.4 %) resolution except near the crossing, where the changes sit at the resolution (Dataset 2 note) | Cylinders from different potatoes or regions differ → one potato, one borer, random allocation; surface solution → blot every cylinder the same way; evaporation → bunged tubes; damaged cells at cut surfaces → same dimensions (same cut surface area), and the estimate is bounded by MF5's caveat (Beat 12); different potatoes or storage → beyond-the-mark-scheme panel (Beat 14) | 1, 4 (explain beat, on-screen **fit** note card), 5, 7, 8, 10, 12, 14 |
| Raw potato strips in plain water / strong sugar solution (hook) | net water entry (firm) or loss (limp), recall of 4.2.6 turgor | an illustration of this lesson's own measurement; labelled *our illustration … not a measured result* | not a measurement; no numbers attached | 1, 14 (callback) |
| Red pepper fruit-wall tissue (W20/51) | named only as the paper's context; not handled | — | kept separate from our potato method (MF2) | 12, 14 |

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
| W20/51 Table 1.1 (supplied data) | 0.40 mol dm⁻³ → −1120 kPa | 12, 13, 14 |
| W20/51 Q1(a)(ii), Q1(b), Q1(c)(i), MS pp.7–9 (plan-check description) | range/dilution, controls, percentage-change interpretation | 6, 8, 10 (taught; not shown as a form row) |
| M24/52 Q1(c)(i), MS p.6 (plan-check description) | planning, maximum 6 marks, any six of nine points; related evidence (turnip, temperature) | 14 |
| M24/52 Q1(c)(iii), MS p.7 | `ref. to hazard and risk and precaution ;` | 5, 14 |
| M24/52 Q1(b)(ii), MS p.5 (plan-check description) | limitations incl. untested intermediate concentrations, variation among cells, missing uncertainty information | 12 (extra concentrations), 14 |
| R24 p.54, June 2024 P52 key messages | “The term ‘amount’ is not accepted as it is not specific.” | 9 (E48) |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, never, only, no, nothing, cannot, because, must, needs* and causal *so/since* was reread with one question: true of all cases, or of the case on screen?
- Beat 1: "no probe is small enough to go inside one of its cells": our framing of why the lesson measures indirectly; bounded to measuring this way in a school lab by the next sentences (the tissue reports it). "which way it goes depends on a comparison you cannot see": the comparison is not visible by eye; true. "So you let the tissue report it": a method choice, not a causal claim about biology.
- Beat 2: "so that anyone could repeat it exactly": an aim, stated as what they will be able to do.
- Beat 3: "adding solute lowers water potential, so these sucrose solutions have negative values": MF3, bounded by "at the same temperature and pressure" and "these". "Net osmosis is from higher to lower water potential": the definition as taught (MF3). "If … starts higher … gains mass; if … starts lower … loses mass": initial-condition comparison, for this tissue in this method. "water still crosses both ways but there is no net movement, so that solution's water potential equals the tissue's initial water potential": the creditworthy sentence; "initial" kept; its bound (estimate, not proof) is said in Beat 12.
- Beat 4: "This is not a starch test, and the insoluble starch does not make the tissue solute-free, or stop damaged cells leaking": MF6 verbatim meaning. "Potato fits the method well": of this method's needs, with the three reasons given. "cut cells can leak": "can". "The method handles each": the three listed interferences, each with its handling on the card; not a claim of zero error (Beat 12's caveat).
- Beat 5: "so every cylinder is the same kind of tissue": the purpose of peeling; not a claim that every cell is identical (Beat 12). "if one slips, it can cut your hand": "can". 
- Beat 6: "Three cylinders sharing one tube share one solution, so they are not independent repeats": MF5 and the plan's trap row; a statement about the design, not about all experiments.
- Beat 7: "never reset it": a procedural instruction for this clock (SHARED-SPECS timer rule). "so every cylinder can come out exactly sixty minutes after it went in": the purpose of staggering.
- Beat 8: "Dividing by the starting mass lets you compare cylinders that did not start at exactly the same mass": the reason for percentage change here; no "must".
- Beat 9 (E48): "It can feel precise enough, since in everyday speech amount covers any quantity": a possibility, not examiner testimony. "so nobody could repeat it": about this written line (the quantity is undefined); fair. "for the paper as a whole": the report's scope, kept; on screen *not a global ban on the word in every context*. "because the second line uses the same word": about this card.
- Beat 10: "The signs carry the biology": interpretation for this dataset; "initially higher/lower" kept. "the three cylinders barely moved": this dataset.
- Beat 11: "because each mean still carries some scatter": the reason for a best-fit line here (the residuals are smaller than the within-set spread, Dataset 3). "here it curves gently": bounded to this dataset. "It is an interpolation, not a new data point, and nothing is extended beyond your results": the construction rule; true of this graph.
- Beat 12: "It is not proof that every cell has the same water potential, or that no solute moved and no cells were damaged": MF5's own limit, stated as a limit. "For a sharper estimate": plan wording ("when a more precise intercept is needed").
- Beat 13: "an estimate for this tissue, under these conditions": bounded.
- Beat 14: "gave three marks … and for identifying": past tense for the named paper; described, not quoted. "Keep the two methods apart": MF2. "a concentration is not a water potential": definitional (different quantities, different units); the reject card is captioned as our wording contrast. "The scheme doesn't need this, but a different potato can give a different estimate": "can"; on the beyond-the-mark-scheme panel. "About minus 1120 kilopascals, estimated": "about" and "estimated".
- No sentence says "concentration of water", names a component potential, calls −860 kPa our value, calls the crossing a data point, extrapolates beyond the tested range, claims every cell has the tissue's water potential, or calls R24/52 an osmosis paper.

---

## Citations

Every quotation in this storyboard, where it appears, and where it was copied from. No exam PDF was opened; exam strings are those SHARED-SPECS §2 lists as verified by the plan check.

| # | Quotation (verbatim) | Paper / session / question / page | Beat(s) | Copied from | Status |
|---|---|---|---|---|---|
| 1 | "investigate the effects of immersing plant tissues in solutions of different water potentials, using the results to estimate the water potential of the tissues" | Syllabus 2025–2027, 4.2.5, p.22 | header; 2 (small type) | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 2 | "calculate percentages and percentage changes" | Syllabus p.63 | 8 (small type) | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 3 | "recognise when it is appropriate to join the points on a graph with straight ruled lines and when it is appropriate to use a line (straight or curved) of best fit" | Syllabus p.63 | 11 (small type) | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 4 | "describe how different concentrations would be prepared by serial dilution or proportional dilution" | Syllabus p.60 | 6 (small type) | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 5 | "prepare a simple risk assessment of their plans, taking into account the severity of any hazards and the probability that a problem could occur" | Syllabus p.61 | 5 (small type) | `SYLLABUS-9700-DETAIL.md` | syllabus, verbatim |
| 6 | `ref. to hazard and risk and precaution ;` | M24/52 (March 2024, Paper 52) Q1(c)(iii), MS p.7 (m24_52) | spine; 5; 14 | SHARED-SPECS §2; plan §4.2.5; weights S-D | **PDF-CHECKED (plan check)** |
| 7 | `–860kPa ;` | W20/51 (November 2020, Paper 51) Q1(d)(i), MS p.9 (w20_51) | spine; 14 | SHARED-SPECS §2; plan §4.2.5; weights S-B | **PDF-CHECKED (plan check)** |
| 8 | “The term ‘amount’ is not accepted as it is not specific.” | R24 p.54, June 2024 ER, Paper 52 key messages | spine; 9 (E48) | SHARED-SPECS §2; plan E48; weights S-F and E48 | **PDF-CHECKED (plan check)** |
| 9 | (no quotation) Table 1.1: 0.10–0.70 mol dm⁻³ → −260, −540, −860, −1120, −1450, −1800, −2180 kPa, shown as *supplied data from W20/51* | W20/51 (w20_51) Q1(d), Table 1.1, QP pp.6–7 | 12, 13, 14; Dataset 4 | SHARED-SPECS §4 shared numbers; plan MF2 | **PDF-CHECKED (plan check)** (values) |
| 10 | (no quotation; our paraphrase) labelled downward-trending sketch; zero-mass-change intercept as the estimate; 3 marks | W20/51 (w20_51) Q1(c)(ii), QP p.5 / MS p.9 | spine; 14 | plan MF2 paragraph; weights S-B | **PDF-CHECKED (plan check)** (description, not wording) |
| 11 | (no quotation; our paraphrase) density-drop method; no-rise/no-fall drop identifies 0.30 mol dm⁻³ | W20/51 (w20_51) Q1(d)(i), QP pp.6–7 / MS p.9 | 14 | plan MF2 paragraph | **PDF-CHECKED (plan check)** (description, not wording) |
| 12 | (no quotation; our paraphrase) maximum 6 marks, any six of nine listed points; turnip blocks, temperature | M24/52 (m24_52) Q1(c)(i), MS p.6 | spine; 14 | plan §4.2.2 and §4.2.5; weights S-D | **PDF-CHECKED (plan check)** (description, not wording) |
| 13 | (no quotation; our paraphrase) limitations, any four of eight points; untested intermediate concentrations, variation among cells, missing uncertainty information | M24/52 (m24_52) Q1(b)(ii), MS p.5 | spine; 14 | plan §4.2.2; weights S-C | **PDF-CHECKED (plan check)** (description, not wording) |
| 14 | (no quotation; our paraphrase) range/dilution, controls and percentage-change interpretation across Q1(a)(ii) 3, Q1(b) 6, Q1(c)(i) 2 | W20/51 (w20_51) MS pp.7–9 | spine; scope ledger | weights S-A | **PDF-CHECKED (plan check)** (description, not wording) |

Plan-check paragraphs used as our wording without quotation marks on screen: MF3 water-potential sentences (Beat 3), MF6 potato sentence (Beat 4), MF5 eighteen-vessel and estimate paragraph (Beats 6, 12), MF2 W20/51 paragraph (Beats 12, 14). They are plan text, not exam wording, and never appear on an MS/ER tab.

**UNVERIFIED items** (not quoted; shown only as our framing or paraphrase, or omitted):
1. `UNVERIFIED — the question wording of W20/51 Q1(c)(ii) and Q1(d)(i).` Beat 14 describes both from the plan check's paragraph; no stem is reproduced.
2. `UNVERIFIED — the exact mark-scheme wording of W20/51 Q1(c)(ii)'s three marking points.` Shown as our paraphrase (row 1), never on an MS tab.
3. `UNVERIFIED — the density-drop procedure of W20/51 Q1(d) beyond "the no-rise/no-fall drop identifies 0.30 mol dm⁻³".` Beat 14 says only that; the method is not taught.
4. `UNVERIFIED — the exact mark-scheme wording of M24/52 Q1(c)(i) and Q1(b)(ii).` Shown as paraphrase (rows 3 and 4).
5. `UNVERIFIED — which June 2024 Paper 52 question(s) the "amount" key message arose from.` Not claimed; the card is captioned as a paper-wide key message applied to our constructed plan.
6. `UNVERIFIED — a content source for the firm/limp raw-potato-strip observation used in the hook.` Shown as *our illustration of what this lesson measures; not a measured result*, with no numbers; the lesson's own method is the evidence it builds.
7. `UNVERIFIED — a sourced density for raw potato tissue.` Used only in the Dataset 2 plausibility note (not narrated, not on screen).

---

## Word count and runtime

Counted by the validator over the blockquoted narration, silent-read line excluded; seconds = words ÷ 120 × 60.

| Beat | Title | Words | Seconds |
|---|---|---:|---:|
| 1 | Hook and context | 94 | 47.0 |
| 2 | What you will be able to do | 50 | 25.0 |
| 3 | Why weighing works: water potential | 122 | 61.0 |
| 4 | The potato: what the method responds to | 103 | 51.5 |
| 5 | Cutting identical cylinders, safely | 101 | 50.5 |
| 6 | Six solutions, eighteen tubes | 97 | 48.5 |
| 7 | Blot, weigh, immerse, and start the clock | 104 | 52.0 |
| 8 | Out, reweigh, and a percentage for every cylinder | 96 | 48.0 |
| 9 | COMMON MISTAKE E48: the word amount in a plan | 144 | 72.0 |
| 10 | The results table, and what the signs mean | 90 | 45.0 |
| 11 | The graph and its zero crossing | 101 | 50.5 |
| 12 | From concentration to kilopascals | 106 | 53.0 |
| 13 | What I told you, on the rig and the graph | 80 | 40.0 |
| 14 | How it is asked, the reject card, and the potato again | 133 | 66.5 |
| **Total** | 14 beats (13 teaching + 1 error) | **1421** | **710.5** (11:50.5) |

**Length, honestly:** **1,421 words = 11:50.5** at 120 words per minute, **35.5 s over** the 11:15 budget. The thirteen teaching beats total **1,277 words = 10:38.5**, **38.5 s over** the 10:00 (1,200-word) teaching base; E48 is **144 words = 72 s**, inside the five-move 130–150-word range and inside its 75 s reservation (3 s under), protected in full. The 4 s silent read is not added again. The teaching overrun sits mainly in Beat 3 (the MF3 sentences are carried nearly verbatim so this lesson stands alone) and Beat 14 (two W20/51 methods kept separate, M24/52 and a beyond-the-mark-scheme line).

**Cut list if the budget must be met (never touches Beat 9):**
1. Beat 14: "A March 2024 planning question gave one mark for hazard, risk and precaution together, and credited limitations such as untested concentrations in between." (−23 words, 11.5 s). Rows 3 and 4 and their MS tab stay on screen, revealed with the forms surface; hazard–risk–precaution is already spoken in Beat 5.
2. Beat 3: "First, why weighing tells you anything." (−6 words, 3 s); move that cue's balance icon to *Water potential describes*.
3. Beat 4: "and what the method is really detecting" (−7 words, 3.5 s); move its cue to *Now the material*.
4. Beat 7: "The room temperature, twenty-one degrees, is recorded." (−7 words, 3.5 s); the thermometer and sheet header stay on screen.
5. Beat 1: "By the end of this lesson, that report becomes a number in kilopascals." → "That report becomes a number in kilopascals." (−6 words, 3 s).
6. Beat 12: "Keep the sign and the unit." (−6 words, 3 s); the ringing stays visual (the reject card in Beat 14 carries the unit point).

Cuts 1–6 remove 55 words (27.5 s) → 1,366 words = 11:23; cuts 1–4 alone give 1,378 words = 11:29. I recommend cuts 1 and 2 only if the conductor wants to reduce; the rest carry hand-holding the standards ask for.

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
| `PotatoCylinderRig` SVGs with named states (potato, tile, borer and push rod, scalpel, ruler, towel, balance with two-decimal display, stock bottle, wash bottle, two labelled 25 cm³ measuring cylinders, dropper, eighteen labelled boiling tubes with bungs in three racks, forceps, stopwatch, thermometer, results sheet); hands (borer push, scalpel cut, pours, forceps roll and lift) | **new build** | authored; handling specified; **rendered still-frame verification pending** (borer pushed down onto the tile away from the hand; scalpel blade down onto the tile, away from the body; pours at about 120° with the stream from the computed lip into the receiving mouth; dropper above the cylinder, not touching; bung seated before inverting; level liquid surfaces; first-contact frame of tube 0.0-A) |
| `percent-mass-change` graph with `zero-crossing` overlay | **new build** | authored on the Topic 3 `RateGraph` conventions; crossing locked at x = 0.398 on the drawn quadratic |
| `LookupTable` panel | **new build** | authored; values exactly W20/51 Table 1.1 (plan check); no Cambridge artwork |
| `starch-grains` overlay | **new build** | authored |
| `WaterPotentialModel` (`cell-vs-solution`), `CellOsmosisSet` (`plant-turgid`, `plant-equal`, `plant-flaccid`) | reuse | 4.2.1a, 4.2.6 |
| Hook beakers and potato strips | new, schematic vector | authored; no photograph, no generated image |
| E48 card and COMMON MISTAKE panel; objectives surface and pictograms (cylinder-and-ruler, mini graph with zero line, table-with-arrow); hazard–risk–precaution tag; safety tag and eye-protection pictogram; forms surface; reject card; **beyond the mark scheme** panel (dashed border, no tick, no MS tab) | new card content; shared panels | authored; COMMON MISTAKE panel from Topics 1–3 |
| Micrographs, photographs, Cambridge artwork | none | — |

---

## Plan interpretations

1. **Intercept at a tested concentration.** The plan fixes the tested concentrations (0.0–1.0 in steps of 0.2) and the illustrative intercept (0.40 mol dm⁻³, so the lookup uses Table 1.1's −1120 kPa directly). The crossing therefore falls at a tested concentration. I made the 0.4 mean **+0.1 %** (not zero), drew the trend as a least-squares quadratic that crosses at 0.398 (0.40 on the grid), and made Beat 11 ring the 0.4 mean separately from the crossing, so the answer is read from the trend by construction and the crossing is never a plotted point. Beat 12 names extra concentrations around the crossing (MF5) for a more precise intercept.
2. **Immersion time 60 min, loading at one-minute intervals, room temperature 21 °C.** The plan requires the immersion time to be specified before the dataset and staggered starts, without fixing values; I chose these and state them before any result (Beat 7). Each cylinder is weighed immediately before its own immersion, so no cylinder dries on the bench while waiting.
3. **"Covered vessels" = boiling tubes closed with bungs**, each made up directly with two labelled 25 cm³ measuring cylinders (stock, water). The apparatus list (p.56) includes boiling tubes and bungs; 20.0 cm³ covers a 30 mm cylinder in a boiling tube.
4. **E48 placement:** after the method (Beat 9) and before the results, where the standardised quantities have just been shown; the card is labelled *our framing of a planning answer … constructed plan lines, not a transcript* and carries the exact E48 caption from the plan. The repairs are the plan's wording ("cylinders cut with the same cork borer and trimmed to 30 mm, each blotted and weighed to 0.01 g"; "20.0 cm³ of each solution, measured with a measuring cylinder").
5. **Status tags.** SHARED-SPECS §2 tags the listed strings **PDF-CHECKED (plan check)**; §3's spine instruction mentions PDF-UNCHECKED. I followed §2 and the citations-column rule (every exam row carries one of the two tags; all exam rows here rest on the plan check, including the descriptions, which are marked "description, not wording").
6. **Handle.** The plan names none for 4.2.5; I chose *a see-saw sitting level* and converted it at once (Beat 3). It avoids "balance", which would collide with the top-pan balance.
7. **Hazard labels (should-fix 7).** The only hazard with a meaningful risk here is cutting, paired hazard–risk–precaution in narration (Beat 5). For the solutions I stated the working concentrations and that sucrose carries no hazard code on the syllabus materials list, with eye protection shown; no hazard is invented.
8. **`starch-grains` overlay.** The MF6 sentence names insoluble starch reserves; showing them needed a display overlay on the 4.2.6 plant cell. It adds no state or term beyond "insoluble starch grains".
9. **Plasmolysis not claimed.** The negative rows use `plant-flaccid`, not `plant-plasmolysed`, because the dataset does not show plasmolysis and the potato cells are not observed; all insets are captioned *model cell states; not observed in this tissue*.
10. **Controls.** The plan's design has no separate control group; distilled water (0.0) is part of the range. W20/51's control points are listed only in the scope ledger as a described credit, not claimed as a form row here.
11. **Hook example.** Raw potato strips firm in plain water and limp in strong sugar solution are used as an illustration of what the lesson measures, labelled as such and listed UNVERIFIED 6, since the plan asks for examples only with a verified source.
12. **Exam close.** W20/51's two methods are separate rows with a divider; the MS answer `–860kPa ;` is shown first as the scheme's, and the real-world extra (different potatoes) is spoken as beyond the scheme on its own dashed panel, per the REAL-WORLD SAMPLES rule.

---

## Validator run

`python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.5/STORYBOARD.md`

```
(pending)
```
