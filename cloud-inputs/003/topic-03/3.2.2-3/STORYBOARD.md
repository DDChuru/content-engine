# L5 — Vmax, Km and inhibitors on the graph (3.2.2 + 3.2.3)

**Storyboard, rework 1. Claude Fable, 21 September 2026.** No audio, no code, no render. Folder `topic-03/3.2.2-3/` (Topic 2 outcome-code convention). Supersedes the first draft after `CHECK.md` (CLEARED WITH MINOR EDITS; M1–M3 and should-fix 1–3 and 5 applied verbatim; nothing else changed).
Cambridge 9700 syllabus 2025–2027, p.20. Command word **EXPLAIN** (both outcomes). Budget from `TOPIC-PLAN-03-ENZYMES.md` (cleared after ROUND TWO of `TOPIC-03-PLAN-CHECK.md`) and `TOPIC-03-WEIGHTS.md`: **3.2.2 7:00 (10 macro beats, E36–E37) + 3.2.3 6:45 (10 macro beats, E41) = 13:45, 3 errors**; delivered here as **17 beats** (14 teaching + 3 error); 3.2.2 4 of 15 sampled papers, 7 overlapping marks (three Paper 1s); 3.2.3 3 of 15 papers, 4 marks (two Paper 1s); supplementary S21/51 Q1(c). Runtime estimated at **120 words per minute of final video**.

> **3.2.2** explain that the maximum rate of reaction (Vmax) is used to derive the Michaelis–Menten constant (Km), which is used to compare the affinity of different enzymes for their substrates
>
> **3.2.3** explain the effects of reversible inhibitors, both competitive and non-competitive, on enzyme activity

Authorities read: `VIDEO-STRUCTURE.md` (in full); `TOPIC-PLAN-03-ENZYMES.md` §3.2.2, §3.2.3, rate vocabulary, lesson list, shared-model table (`RateGraph` after R2-8) and trap table (after R2-9); `TOPIC-03-PLAN-CHECK.md` ROUND TWO; `TOPIC-03-WEIGHTS.md` error register E36, E37, E41; `topic-03/3.1.1-2/STORYBOARD.md` (`EnzymeActiveSiteModel`, published in L1). Papers opened with mark schemes: s23_31 Q1(b)(i–ii) (QP pp.8–9, MS p.7) with June 2023 examiner report p.26; s21_51 Q1(c)(ii–iv) (QP p.5, MS p.7); s23_23 Q3(b)(ii) (QP p.7, MS p.13) with June 2023 examiner report p.22; s24_23 Q5(b) (MS p.9); s21_22 Q5(d)(i) (QP p.13, MS p.18); m23_12 Q16 (QP p.8, key B) with March 2023 examiner report p.2; s24_12 Q10 (key A) and Q11 (key B) with June 2024 examiner report p.4; s22_12 Q12 (key A); s24_13 Q12 (key B); s20_12 Q13 (key B) and Q14 (key D); ECR Paper 2 Q1 p.10 comment E.

Sixth of the seven enzyme lessons. Depends on L4b's initial-rate against substrate-concentration curve and L1's `EnzymeActiveSiteModel`. **Every graph is our own schematic with labelled axes; every enzyme drawing is a MODEL and labelled so.** No Michaelis–Menten derivation, no reciprocal plot, no inhibition classes beyond the two named, no allosteric-regulation lesson, no named-inhibitor catalogue.

---

## The causal spine

Two facts carry the lesson, in the syllabus's words: **Vmax is used to derive Km, which compares the affinity of different enzymes for their substrates**; and **reversible inhibitors, competitive and non-competitive, change enzyme activity**, which we read as changes to Vmax and Km on the same graph.

> **On the graph of initial rate against substrate concentration, Vmax is the maximum rate, read from the plateau or supplied. Km is the substrate concentration at which the initial rate is half Vmax: draw the line at Vmax, halve it, read across to the curve and drop to the concentration axis. A lower Km means the enzyme reaches half its maximum rate at a lower substrate concentration, so it has a higher affinity for its substrate; each enzyme's Km is read from its own half-Vmax. A competitive inhibitor has a shape similar to the substrate and binds reversibly in the active site; increasing substrate concentration can overcome it, so Vmax is unchanged and Km increases. A non-competitive inhibitor binds reversibly at a site other than the active site and changes the shape of the active site so it is no longer complementary; in the simplified model drawn here Vmax decreases, increasing substrate concentration does not restore it, and Km is unchanged. Both are reversible: activity returns when the inhibitor leaves.**

**What the mark schemes credit, quoted:** [s21_51 QP p.5] "Vmax is the maximum initial rate of reaction of the enzyme. The Michaelis-Menten constant, Km, is the substrate concentration at which the initial rate of reaction is half its maximum value, Vmax." [s23_31 Q1(b)(ii), MS p.7] "shows Vmax on graph ;", "shows ½ Vmax on graph ;", "18 ;". [s21_51 Q1(c)(ii), MS p.7] "curve, to the right of / below, original curve ;", "curve / line, must meet the plateau of original curve on the graph ;"; (c)(iv) "(reaction with competitive inhibitor / X) has higher / has increased / increases, Km value (compared to no inhibitor) ;". [s23_23 Q3(b)(ii), MS p.13] "curve below the original line ;", "curve, merging / will merge, with the original line after it begins to plateau ;". [s24_23 Q5(b), MS p.9] "(non-competitive inhibitor) binds to, allosteric site / site other than active site / AW ;", "(binding causes) change in shape of active site ;", "active site no longer complementary to the substrate / AW ;". [June 2024 ER p.4] "a lower Km corresponded to a higher affinity for the substrate". [s24_12 Q10, key A] competitive reversible inhibitor: Vmax no change, substrate concentration at Km increases. [s22_12 Q12, key A] low affinity: high Km, reaches Vmax at a high substrate concentration. [s24_13 Q12, key B] Km compares the affinity of different enzymes for their substrates. So the spine is exactly what is credited: the definition, the construction shown on the graph, lower Km = higher affinity, the competitive curve that merges, the non-competitive site and shape change.

**The handle:** *the eager enzyme*: an enzyme with a high affinity is already running at half speed when there is very little substrate about, so its Km is small. Converted at once: *a lower Km means a higher affinity of the enzyme for its substrate.* Never the exam answer; the construction and the sentence are.

**Typicality rules applied:** Vmax is read "from the plateau or a supplied value", and the highest plotted point is not called Vmax while the curve is still rising. Km is "a substrate concentration", said with its units. The non-competitive statements are bounded to "the simplified model drawn here" (Km unchanged is not generalised to every inhibitor binding away from the active site, and no other inhibition class is named). "Increasing substrate concentration **can** overcome" a competitive inhibitor, the March 2023 report's own wording. The credited vocabulary "allosteric site" appears on screen as the mark scheme's alternative name for the site; the narration says "a site other than the active site" and no regulation lesson follows. Named inhibitor contexts (sulfonamide, inhibitor X) are supplied question contexts, not a list. The reason inhibitors matter is framed in one sentence (control in cells; medicines) without a pathway lesson.

**Three error beats, each with the five moves:** E37 in Beat 6, E36 in Beat 9, E41 in Beat 13. Wrong answers are written, never spoken as claims. In Beat 9 the card has two faults and the marker clears only on the completed correct frame.

---

## The models, specified once

**`RateGraph`, configuration *initial rate against substrate concentration* (published by L2; L4b's substrate-concentration curve; this lesson adds the construction overlays).** Axes: **initial rate of reaction** up, **substrate concentration** along, units from the cited question when a question form is on screen (S23/31: *initial rate of reaction / au* against *concentration of lactose / mmol dm⁻³*; otherwise *arbitrary units* and *mmol dm⁻³*). Every curve rises steeply, bends and flattens to a plateau. Caption whenever values are ours: *our schematic; not a reproduction of the paper's figure*. The **x-axis is concentration, not time** (L4b's E38 recall, by label only).

Overlays, each addressable and drawn as a **construction in the ink layer** (pre-drawn, cue-revealed):
- **`vmax-line`**: a horizontal dashed line at the plateau, labelled **Vmax**; where the curve has not clearly flattened, the label reads **Vmax (supplied)** and the value is stated.
- **`half-line`**: a horizontal dashed line at half that height, labelled **½Vmax**.
- **`km-drop`**: from where `half-line` meets the curve, a vertical dashed line down to the concentration axis; the reading is labelled **Km** with its value and units.
- **Rule for every curve on the graph: its own `vmax-line`, its own `half-line`, its own `km-drop`.** A common horizontal across curves with different plateaux is never drawn.
- **Curves:** `no-inhibitor` (base ink); `competitive` (to the right, merging into the same plateau); `non-competitive` (lower plateau, same Km); `enzyme-X`, `enzyme-Y`, `enzyme-Z` for the three-enzyme comparison. Our values: **three enzymes** X (Vmax 1500, Km 100), Z (Vmax 600, Km 200), Y (Vmax 2500, Km 400), rate in *product per second*, concentration in *µmol dm⁻³*, modelled on the form of S24/12 Q11 and chosen so that the order of affinity is **X, Z, Y** (key B) while Y has the highest Vmax and X the steepest start. **Worked example** for Beats 5–6 and 17: our own lactase-style curve with plateau 9.0 au, so ½Vmax = 4.5 au and Km reads **18 mmol dm⁻³**, consistent with the S23/31 MS reading; caption *our schematic; values chosen to match the MS reading*.
- Schematic teaching curves are labelled *schematic*; nothing on this graph is presented as measured data.
- **Graph build note (CHECK should-fix 5):** Every numeric half-Vmax intersection is a locked point on the actual curve, not a label placed near it. Use one common linear scale within each comparison. All curves start at (0,0), rise monotonically and meet their specified schematic plateaux without overshoot. In the three-enzyme example the initial steepness order is X, Y, Z. Own-value labels remain visible on all replays. Units reset between configurations (mmol dm⁻³ for the lactase example; µmol dm⁻³ for the three enzymes).

**`EnzymeActiveSiteModel`, inhibitor states (published by L1; first shown here).** The L1 silhouette in `rest-lk` with its cleft, plus the **second binding site**, a shallow notch on the lower left, unlabelled until Beat 12, then labelled **a site other than the active site** (small type: *MS p.9 also credits "allosteric site" as the name*). Two inhibitor shapes: **competitive inhibitor**, a wedge visibly similar to the substrate outline but not identical (one corner clipped), tinted terracotta; **non-competitive inhibitor**, a small round shape complementary to the second site, tinted terracotta. States: **`inhibitor-competitive`** (the wedge seated in the cleft; a substrate arriving rocks and slides away); **`inhibitor-noncompetitive`** (the round shape seated at the second site; the cleft **distorts** over ~0.6 s so the substrate outline no longer matches; a substrate arriving rocks and slides away; when the inhibitor leaves, the cleft **returns** over ~0.6 s). Labels as text nodes. Caption *schematic; not a real protein shape*.

**Motion contract:** inhibitor arrival, seating, the substrate's failure to seat, the active-site shape change and the inhibitor's departure are **motions** (non-covalent, reversible). The cleft distortion is a shape change of the model, not the `denatured` state (silhouette stays tight; backbone intact). No covalent bond is made or broken anywhere in this lesson; no net-transformation animation is used.

---

## Beat by beat

Beat windows in the headings are provisional; the runtime table below is authoritative and final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in order; no stretch beyond ~30 words without a stated visual change.

### BEAT 1 · Hook and context · 0:00–0:40
**Narration:**
> Ever wondered how a tablet can switch off one enzyme in your body and leave thousands of others running? Something in it binds to that enzyme and slows it down, and the way biologists describe what it does uses the same two numbers they use to compare enzymes with each other. You have already drawn the graph those numbers live on: initial rate against substrate concentration, rising, then flattening off. Today that graph does two jobs. First it lets you compare how readily these enzymes bind their substrates. Then it shows you what an inhibitor does.

**Visual action:**
1. At *a tablet*, a small tablet icon and a cell outline with faint reaction arrows and enzyme silhouettes on them; at *leave thousands of others running*, one silhouette dims and stops while the rest keep running.
2. At *Something in it binds*, a small terracotta shape drifts from the tablet to the stopped silhouette and seats (motion, schematic); at *the same two numbers*, two blank number boxes appear beside it, labelled **?** and **?**.
3. At *You have already drawn the graph*, `RateGraph` in its substrate-concentration configuration slides in with the `no-inhibitor` curve, tagged *from L4b*; at *rising, then flattening off*, the curve redraws itself once.
4. At *compare how readily these enzymes bind their substrates*, the first box fills with **Km**; at *what an inhibitor does*, the second box fills with **Vmax** and the terracotta shape from the cell inset is ringed; dissolve to the objectives surface.

**On-screen text:** the hook question; *from L4b*; the two number boxes.

---

### BEAT 2 · What you will be able to do · 0:40–1:05
**Narration:**
> By the end you will be able to read Vmax from a rate–concentration graph and use it to find Km by construction; use Km to compare the affinity of different enzymes for their substrates; and explain what a competitive and a non-competitive reversible inhibitor each do to the enzyme and to that graph.

**Visual action:** Own styled surface, distinct background, no diagram. At *read Vmax*, line 1; at *use Km to compare*, line 2; at *explain what a competitive*, line 3.
1. **READ** Vmax and **DERIVE** Km by construction on the graph
2. **COMPARE** the affinity of different enzymes using Km
3. **EXPLAIN** the effects of competitive and non-competitive reversible inhibitors, on the enzyme and on the graph

Small type: *syllabus 3.2.2 and 3.2.3, p.20: "explain".*

---

### BEAT 3 · The curve, and Vmax from the plateau · 1:05–1:50
**Narration:**
> Here is the graph again, with its axes read properly. Along the bottom, substrate concentration. Up the side, initial rate: the rate at the very start of each run. At low substrate the rate climbs steeply; then the active sites fill and the curve levels off. That flat top is the maximum rate, Vmax. Read it from the plateau, or use the value the question gives you. If the curve is still rising at the last point, that point is not Vmax; the enzyme has not reached its maximum yet.

**Visual action:**
1. At *Here is the graph again*, `RateGraph` fills the frame with the `no-inhibitor` curve, caption *our schematic*; at *substrate concentration*, the x-axis label brightens; at *initial rate*, the y-axis label brightens; at *the very start of each run*, a tiny inset of a progress curve with its t = 0 tangent (the L2 overlay, by recall) flashes beside the y-axis and fades.
2. At *the rate climbs steeply*, the steep section is traced; at *the active sites fill*, three `EnzymeActiveSiteModel` miniatures beside the curve fill with substrate; at *the curve levels off*, the plateau is traced.
3. At *the maximum rate, Vmax*, `vmax-line` draws with its label; at *Read it from the plateau*, the plateau and the line pulse together; at *the value the question gives you*, the label briefly reads **Vmax (supplied)** with a small-type note *or a supplied value*, then returns.
4. At *still rising at the last point*, a second small curve appears in an inset, cut off while rising, with its last point ringed in terracotta and the tag *not Vmax; still rising*; small type *S23/51 Q1(d)(iii)*.

**On-screen text:** axis labels; **Vmax**; *from the plateau, or a supplied value*; the *still rising* inset tag.

---

### BEAT 4 · One number for affinity: Km · 1:50–2:25
**Narration:**
> Now the number that lets you compare enzymes. Different enzymes have different curves, and you need something you can read off each one. That number is the Michaelis–Menten constant, Km, and here is its definition, in the words a paper used: Km is the substrate concentration at which the initial rate of reaction is half its maximum value, Vmax. Notice what kind of quantity that is. It is a concentration, on the bottom axis, with concentration units. Vmax is used to get to it, but Km is not a rate.

**Visual action:**
1. At *Different enzymes have different curves*, two more schematic curves appear faintly behind the first, with different plateaux, then fade.
2. At *the Michaelis–Menten constant, Km*, the label **Michaelis–Menten constant (Km)** lands above the graph; at *in the words a paper used*, citation tab, verbatim: **s21_51 QP p.5: "The Michaelis-Menten constant, Km, is the substrate concentration at which the initial rate of reaction is half its maximum value, Vmax."**
3. At *It is a concentration*, the x-axis is traced in the accent and a bracket **Km is read here** points at it; at *with concentration units*, the axis units pulse; at *Km is not a rate*, the y-axis dims briefly with a small ✗ beside a ghost *Km* on it, which dissolves.

**On-screen text:** the definition, verbatim and cited; *Km is read here* on the concentration axis.

---

### BEAT 5 · The construction: Vmax, half it, across, down · 2:25–3:15
**Narration:**
> Here is how you get Km from Vmax, and this is the working the examiners want to see drawn on the graph. Take this enzyme: the plateau is at nine, so Vmax is nine. Draw the horizontal line at Vmax. Halve it: four point five. Draw the horizontal line at half Vmax. Follow that line across until it meets the curve. From that point, drop a vertical line to the concentration axis and read the value: eighteen. Km is eighteen millimoles per decimetre cubed. Show the construction on the graph: Vmax, half Vmax, across, down.

**Visual action:**
1. At *drawn on the graph*, the graph resets to the worked-example curve with S23/31's axis labels (*initial rate of reaction / au*; *concentration of lactose / mmol dm⁻³*), caption *our schematic; values chosen to match the MS reading*.
2. At *the plateau is at nine*, the plateau is traced and **9.0 au** appears on the y-axis; at *Draw the horizontal line at Vmax*, `vmax-line` draws.
3. At *Halve it*, the label **½ × 9.0 = 4.5 au** appears beside the y-axis; at *Draw the horizontal line at half Vmax*, `half-line` draws.
4. At *Follow that line across*, a small marker travels along `half-line` to the curve and stops; at *drop a vertical line*, `km-drop` draws down to the axis; at *read the value: eighteen*, the reading **18** is ringed on the axis.
5. At *Km is eighteen millimoles per decimetre cubed*, the label **Km = 18 mmol dm⁻³** lands beside the drop.
6. At *Show the construction on the graph*, a four-item strip beneath the graph lights item by item: at *Vmax, half Vmax, across, down*, **Vmax** · **½Vmax** · **across** · **down**.

**On-screen text:** the three construction lines with labels; **Km = 18 mmol dm⁻³**; the four-step strip.

---
### BEAT 6 · COMMON MISTAKE E37: the right number, and a bare graph · 3:15–4:25
**Narration:**
> Here is the most common error on exactly that question, on the card. June 2023, Paper 31, gave the lactase graph and asked you to estimate Km and show your working on the graph. Read this answer.
>
> *(silent read, 4 s)*
>
> Look at the number first: eighteen, and it is right. Now look at the graph: nothing on it. The calculation is written out neatly beside it, and the graph is bare. The arithmetic can feel like the working, and half of nine really is four point five. But the question said show your working on the graph, and the mark scheme has three marks: shows Vmax on graph, shows half Vmax on graph, eighteen. Two of the three marks are for showing those values on the graph. The examiners' report says the most common error was to calculate Km correctly, showing the calculation instead of showing how Vmax and half Vmax were obtained on the graph. And one more thing, from an older report: half Vmax is a stage on the way, not the answer; the answer is the concentration. So draw the lines in place: Vmax across, half Vmax across, down to eighteen. Now all three marks are on the page.

**Visual action:**
1. **Entry cue: *Here is the most common error*.** COMMON MISTAKE panel enters (header, terracotta border) and stays until the exit cue. At *gave the lactase graph*, the header line lands, verbatim (QP p.9): *"Use the graph in Fig. 1.2 to estimate the Michaelis-Menten constant (Km) of lactase. Show your working on the graph in Fig. 1.2."* Citation *9700/31 June 2023 Q1(b)(ii), 3 marks*. The worked-example graph from Beat 5 is redrawn **with its construction lines removed**, caption *our schematic; the paper's Fig. 1.2 is not reproduced*.
2. At *Read this answer*, the written wrong answer appears beside the bare graph, handwriting style: **Vmax = 9 au · ½ × 9 = 4.5 au · Km = 18 mmol dm⁻³**, and on the answer line **Km = 18 mmol dm⁻³**; a terracotta tag **✗ no working on the graph** sits on the empty graph.
3. **Silent read, 4 s.**
4. At *Look at the number first*, the **18** on the answer line is ringed in the accent with a small tick; at *Now look at the graph*, the empty graph area is ringed in terracotta.
5. At *The calculation is written out neatly*, the three handwritten lines are bracketed; at *The arithmetic can feel like the working*, side-note *arithmetic ≠ working on the graph*.
6. At *the question said show your working*, those words in the header are underlined; at *the mark scheme has three marks*, citation tab, exact: **MS p.7: "1 shows Vmax on graph ; 2 shows ½ Vmax on graph ; 3 18 ;"**; at *showing those values on the graph*, marks 1 and 2 in the tab are underlined.
7. At *The examiners' report says*, second tab, exact: **June 2023 ER p.26: "The most common error was to calculate Km correctly showing the calculation instead of showing how the figures for Vmax and ½ Vmax were obtained on the graph."**; at *instead of showing how Vmax and half Vmax were obtained*, the phrase *showing how the figures … were obtained on the graph* in the tab is underlined and the bare graph is ringed again.
8. At *half Vmax is a stage on the way*, third tab, exact: **ECR Paper 2 Q1, p.10: "Some candidates gave ½ Vmax, but this is a stage in deriving Km."**; the handwritten *4.5 au* is tagged *a stage, not the answer*.
9. At *draw the lines in place*, `vmax-line`, `half-line` and `km-drop` draw on the graph in turn, in the accent; the terracotta **no working on the graph** tag is struck. **Exit cue: end of *on the page*.** Treatment lifts; the graph with its three lines and the ringed 18 holds.

**On-screen text:** the panel; the reproduced instruction and citation; the card; the three citation tabs.

---

### BEAT 7 · What Km tells you: the eager enzyme · 4:25–5:10
**Narration:**
> So what does Km tell you? Compare two enzymes. This one reaches half its maximum rate when the substrate concentration is still low; its Km is small. This one needs far more substrate around before it gets to half speed; its Km is large. The first enzyme grabs its substrate more readily: picture the eager enzyme, running at half speed on very little. Written properly: a lower Km means a higher affinity of the enzyme for its substrate, and a higher Km means a lower affinity. That is what Km is for: comparing the affinity of different enzymes for their substrates.

**Visual action:**
1. At *Compare two enzymes*, the graph shows two schematic curves, **enzyme A** (steep early rise, plateau reached quickly) and **enzyme B** (slow rise), both with their own `vmax-line` and `half-line`.
2. At *This one reaches half its maximum rate*, A's `km-drop` draws to a small reading, label **Km small**; at *its Km is small*, the reading pulses.
3. At *This one needs far more substrate*, B's `km-drop` draws to a large reading, label **Km large**; at *its Km is large*, the reading pulses.
4. At *picture the eager enzyme*, the handle appears as a strap-line **the eager enzyme: half speed on very little substrate**; at *Written properly*, the creditworthy sentence lands beneath: **a lower Km means a higher affinity of the enzyme for its substrate**.
5. At *comparing the affinity of different enzymes*, the syllabus phrase is quoted in small type beneath: *"used to compare the affinity of different enzymes for their substrates" (p.20)*; citation *June 2024 ER p.4: "a lower Km corresponded to a higher affinity for the substrate"*.

**On-screen text:** *Km small* / *Km large*; the handle; the sentence; the syllabus phrase.

---

### BEAT 8 · Three enzymes, each from its own half-Vmax · 5:10–6:05
**Narration:**
> Now three enzymes on one graph, X, Y and Z, and the question is which has the highest affinity. Do the construction for each curve separately, from its own plateau. Y has the highest Vmax, so its half line is highest, and its Km reads four hundred. X: its own plateau, its own half line, Km one hundred. Z: a low plateau, but read from its own half line, Km two hundred. Lowest Km first: X, then Z, then Y. Notice that Y, the fastest at the top, has the lowest affinity. And never draw one horizontal across all three: each enzyme's half Vmax is half of its own maximum.

**Visual action:**
1. At *three enzymes on one graph*, the graph resets to the three-enzyme configuration (`enzyme-X`, `enzyme-Y`, `enzyme-Z`, our values; axes *rate of reaction / product per second* against *substrate concentration / µmol dm⁻³*), caption *our schematic, modelled on the form of S24/12 Q11; our values*.
2. At *each curve separately*, the three curves are traced in turn.
3. At *Y has the highest Vmax*, Y's `vmax-line` draws at 2500; at *its half line is highest*, Y's `half-line` at 1250; at *its Km reads four hundred*, Y's `km-drop` to **400**.
4. At *X: its own plateau*, X's `vmax-line` at 1500; at *its own plateau, its own half line*, X's `half-line` at 750; at *Km one hundred*, X's `km-drop` to **100**.
5. At *Z: a low plateau*, Z's `vmax-line` at 600; at *read from its own half line*, Z's `half-line` at 300; at *Km two hundred*, Z's `km-drop` to **200**.
6. At *Lowest Km first*, an order strip beneath: **X (100) → Z (200) → Y (400)**, labelled *highest affinity first*; at *Y, the fastest at the top, has the lowest affinity*, Y's plateau and Y's Km reading are ringed together.
7. At *never draw one horizontal across all three*, a ghost single horizontal across all three curves flashes in terracotta with a ✗ and dissolves; at *half of its own maximum*, the three separate `half-line`s pulse together.

**On-screen text:** the three constructions with values; the order strip; the caption.

---

### BEAT 9 · COMMON MISTAKE E36: Vmax called affinity; the gradient called affinity · 6:05–7:15
**Narration:**
> That question is a real one, from June 2024 Paper 1, and the report tells us exactly how it went wrong, on the card. Three enzymes, one graph: put them in order of affinity, highest first. Read these two answers.
>
> *(silent read, 4 s)*
>
> Look at the first line. It has picked out the highest plateau and called that affinity. Vmax is how fast the enzyme can go when it is saturated; it does not tell you the substrate concentration at half that rate. That concentration is Km, a different quantity in different units. The report says some candidates confused Km with Vmax and chose that order. Now the second line: the steepest start. It looks like eagerness, and X does happen to start steepest here, but a gradient is a rate per concentration, not a concentration, and the report says a similar proportion thought the gradient of the initial curve showed affinity. Affinity is read from Km, and Km comes from the construction: each curve, its own half Vmax, down to the axis. Km for X one hundred, Z two hundred, Y four hundred. Lowest Km, highest affinity: X, Z, Y.

**Visual action:**
1. **Entry cue: *That question is a real one*.** COMMON MISTAKE panel enters and stays until the completed correct frame. At *put them in order of affinity*, the header line lands, verbatim (QP p.6): *"What is the correct order of affinity of these enzymes for their substrates, starting with the enzyme with the highest affinity?"* Citation *9700/12 June 2024 Q11, key B (X, Z, Y)*. The Beat 8 three-enzyme graph holds at left **with its construction lines removed**, caption *our schematic; the paper's graph is not reproduced*.
2. At *Read these two answers*, two written wrong lines appear, handwriting style: **✗ highest Vmax = highest affinity → Y, X, Z** and **✗ steepest start = highest affinity → X, Y, Z**. Small type: *the two wrong reasonings the June 2024 report describes (options C and A); composite, not a transcript.*
3. **Silent read, 4 s.**
4. At *Look at the first line*, line 1 is underlined in terracotta; at *picked out the highest plateau*, Y's plateau is ringed in terracotta on the graph; at *how fast the enzyme can go when it is saturated*, the y-axis label pulses with side-note *Vmax: a rate*; at *That concentration is Km, a different quantity in different units*, the x-axis label pulses with side-note *Km: a concentration*.
5. At *The report says some candidates confused Km with Vmax*, citation tab, exact: **June 2024 ER p.4: "Some candidates confused Km with Vmax and selected option C. A similar proportion thought that the gradient of the initial curve showed enzyme affinity, and so selected option A."**
6. At *Now the second line*, line 2 is underlined in terracotta; at *X does happen to start steepest here*, the steep start of X is traced in terracotta; at *a rate per concentration, not a concentration*, a small rise/run triangle on X's start is tagged *gradient: rate ÷ concentration* and then struck; at *a similar proportion thought the gradient*, the second sentence of the citation is underlined.
7. At *Affinity is read from Km*, line 1 is struck and replaced in place: **✓ lowest Km = highest affinity**; the marker stays on. At *each curve, its own half Vmax*, the three constructions redraw on the graph, each from its own plateau; at *Lowest Km, highest affinity*, line 2 is struck and replaced in place: **✓ Km: X 100, Z 200, Y 400 → X, Z, Y**; this is the last fault, and **the marker clears on this completed frame**. **Exit cue: end of *X, Z, Y*.** Treatment lifts; the graph with three constructions and the two corrected lines hold.

**On-screen text:** the panel; the reproduced question stem and key; the two cards; the citation; *Vmax: a rate* / *Km: a concentration*.

---

### BEAT 10 · Same enzyme, with and without an inhibitor · 7:15–8:05
**Narration:**
> Now the second half, and the comparison changes. Until now it was different enzymes side by side. From here it is the same enzyme, under the same conditions, with and without an inhibitor. An inhibitor is a molecule that binds to the enzyme and lowers its activity. The two kinds in this lesson are reversible: the inhibitor binds and leaves again, and when it leaves the activity returns. This is one way cells control their reactions, and it is how a number of medicines work: bind the enzyme, slow the reaction. Here we compare two classes, and the difference is where the inhibitor binds.

**Visual action:**
1. At *the comparison changes*, the three-enzyme graph slides off; a switch card: **different enzymes → the same enzyme, with and without inhibitor**; at *Until now it was different enzymes*, the left half brightens; at *the same enzyme, under the same conditions*, the right half brightens.
2. At *An inhibitor is a molecule*, `EnzymeActiveSiteModel` in `rest-lk` at centre with a terracotta shape approaching (schematic; which shape is deliberately not yet specified); at *lowers its activity*, the reaction arrow beside it thins.
3. At *the inhibitor binds and leaves again*, the shape seats and then leaves (motion); at *the activity returns*, the arrow thickens again; label **reversible**.
4. At *one way cells control their reactions*, the Beat 1 cell inset returns small with one arrow dimmed; at *how a number of medicines work*, the tablet icon beside it; small type *framing only; no pathway or drug list is taught here*.
5. At *Here we compare two classes*, two empty panels appear, titled **competitive** and **non-competitive**; at *where the inhibitor binds*, the model's cleft and its second binding site are each ringed once.

**On-screen text:** the switch card; *reversible*; the two panel titles.

---

### BEAT 11 · Competitive: in the active site, overcome by substrate · 8:05–9:05
**Narration:**
> A competitive inhibitor has a shape similar to the substrate, so it can bind reversibly in the active site itself. Watch: the inhibitor seats, a substrate arrives, and there is nowhere for it to go; it slides away. Then the inhibitor leaves, and a substrate seats and reacts. Substrate and inhibitor are competing for the same site, so the more substrate there is, the more often substrate wins. At high substrate concentration the inhibition can be overcome and the maximum rate is reached: Vmax is unchanged. But it takes more substrate to get to half of it, so Km increases. On the graph, the curve sits to the right of the original and merges with it at the plateau.

**Visual action:**
1. At *a shape similar to the substrate*, the competitive inhibitor wedge appears beside the substrate outline, the two overlaid briefly to show *similar, not identical*; label **competitive inhibitor**.
2. At *the inhibitor seats*, `inhibitor-competitive` (motion); at *a substrate arrives*, a substrate travels to the occupied cleft; at *it slides away*, it rocks and leaves.
3. At *the inhibitor leaves*, the wedge leaves the cleft; at *a substrate seats and reacts*, a substrate seats (`bound`) and `products` follow.
4. At *competing for the same site*, the cleft is ringed with the two shapes either side of it; at *the more often substrate wins*, a small counter of arrivals shows substrate seatings outnumbering inhibitor seatings as substrate outlines crowd the frame.
5. At *the inhibition can be overcome*, the competitive panel's graph appears with the `no-inhibitor` curve and the `competitive` curve drawing to the right of it; at *Vmax is unchanged*, the two curves' shared `vmax-line` is drawn once, labelled **Vmax unchanged**, small type *one line because the plateaux coincide*.
6. At *so Km increases*, each curve's own `half-line` and `km-drop` draw: the original's Km and the inhibited curve's larger Km, labelled **Km increased** with small type *Km measured with the inhibitor present: apparent Km*; at *merges with it at the plateau*, the merge point is ringed; citation *s21_51 Q1(c)(ii), (iv), MS p.7; s24_12 Q10, key A*.

**On-screen text:** *competitive inhibitor*; *Vmax unchanged*; *Km increased*; the citation.

---
### BEAT 12 · Non-competitive: another site, and the active site changes shape · 9:05–10:10
**Narration:**
> A non-competitive inhibitor binds at a different site from the substrate. It binds reversibly at a site other than the active site, and that binding changes the shape of the active site, so the active site is no longer complementary to the substrate. Watch: the inhibitor seats at the other site, the cleft distorts, a substrate arrives and cannot seat. Adding more substrate cannot restore the uninhibited maximum rate, because it does not compete for the inhibitor's binding site. In the simplified model drawn here, Vmax decreases, increasing substrate concentration does not restore it, and Km is unchanged: read from its own, lower, half Vmax, it comes out at the same concentration. When the inhibitor leaves, the active site returns to its shape and activity comes back.

**Visual action:**
1. At *binds at a different site from the substrate*, the non-competitive inhibitor (round shape) appears beside the model, away from the cleft; label **non-competitive inhibitor**. The caption **simplified non-competitive model** is on screen from here, over the molecular model, and stays through the graph.
2. At *a site other than the active site*, the second binding site is ringed and labelled **a site other than the active site**, small type *MS p.9 also credits "allosteric site" as the name*; at *changes the shape of the active site*, the label **active site** on the cleft brightens.
3. At *the inhibitor seats at the other site*, `inhibitor-noncompetitive` (motion): the round shape seats; at *the cleft distorts*, the cleft changes shape over ~0.6 s; at *a substrate arrives and cannot seat*, a substrate travels in, rocks and slides away.
4. At *cannot restore the uninhibited maximum rate*, several substrate outlines crowd the frame and each rocks off in turn; at *does not compete for the inhibitor's binding site*, the second site is ringed with the substrate outline ghosted beside it and a small ✗.
5. At *In the simplified model drawn here*, the non-competitive panel's graph appears with the `no-inhibitor` curve and the `non-competitive` curve drawing beneath it to a lower plateau, the *simplified non-competitive model* caption continuing over the graph; at *Vmax decreases*, the lower curve's own `vmax-line`, labelled **Vmax decreased**; at *does not restore it*, the two plateaux are bracketed apart at the far right.
6. At *Km is unchanged*, each curve's own `half-line` and `km-drop` draw, the two drops landing on the same concentration, labelled **Km unchanged**; at *at the same concentration*, the shared reading is ringed; citation *s24_23 Q5(b), MS p.9; s24_12 Q10, key A (contrast)*.
7. At *When the inhibitor leaves*, the round shape leaves and the cleft returns over ~0.6 s; at *activity comes back*, a substrate seats and the reaction arrow thickens; label **reversible**.

**On-screen text:** *non-competitive inhibitor*; *a site other than the active site*; *Vmax decreased*; *Km unchanged*; *simplified non-competitive model*; *reversible*.

---

### BEAT 13 · COMMON MISTAKE E41: the two curves swapped · 10:10–11:20
**Narration:**
> Here is where the two curves get swapped, on the card. June 2023, Paper 23: sulfonamide is a competitive inhibitor of carbonic anhydrase; sketch a curve to show its effect. Read this sketch.
>
> *(silent read, 4 s)*
>
> Look at where the sketched curve ends: still below the original at high substrate concentration, with its own lower plateau. That is the non-competitive shape, and the question said competitive. Both inhibited curves lie below the original at low positive substrate concentrations, so it is easy to overlook what happens at high substrate. Ask it: a competitive inhibitor can be overcome by more substrate, so the curve has to climb back and meet the original plateau. The June 2023 report says a number of candidates drew the curve for a non-competitive inhibitor, or went above the maximum, which an inhibitor does not do; it lowers the rate. The March 2023 Paper 1 report found the same swap in about a quarter of candidates. Redraw it: below the original at first, then merging with it at the plateau. Vmax unchanged, Km increased; that is competitive.

**Visual action:**
1. **Entry cue: *Here is where the two curves get swapped*.** COMMON MISTAKE panel enters and stays until the completed correct frame. At *sulfonamide is a competitive inhibitor*, the header line lands, verbatim (QP p.7): *"Sulfonamide is a competitive inhibitor of carbonic anhydrase. Fig. 3.2 shows the effect of increasing substrate concentration on the rate of the reaction catalysed by carbonic anhydrase. Sketch a curve on Fig. 3.2 to show the effect of sulfonamide on the rate of reaction catalysed by carbonic anhydrase."* Citation *9700/23 June 2023 Q3(b)(ii), 2 marks*. Our own graph (*rate of reaction* against *substrate concentration*, no values) with the original curve, caption *our schematic; the paper's Fig. 3.2 is not reproduced*.
2. At *Read this sketch*, the written wrong sketch appears in handwriting style: a terracotta curve below the original with its **own lower plateau**, never meeting the original; a second, fainter terracotta ghost curve **above** the original plateau, tagged *also seen*. Small type: *the two faults the June 2023 report describes; composite, not a transcript.*
3. **Silent read, 4 s.**
4. At *Look at where the sketched curve ends*, the far right of the sketched curve is ringed in terracotta; at *its own lower plateau*, the gap between the two plateaux is bracketed; at *That is the non-competitive shape*, the Beat 12 panel's **non-competitive** title flashes beside it; at *the question said competitive*, the word *competitive* in the header is underlined.
5. At *Both inhibited curves lie below the original*, the low-concentration section of the sketch is traced with side-note *looks right at low concentrations*; at *what happens at high substrate*, the far right of the graph is ringed with a question mark.
6. At *can be overcome by more substrate*, the Beat 11 model replays in miniature: substrate outlines crowd, inhibitor loses; at *meet the original plateau*, an accent arrow from the sketched curve's end up to the original plateau.
7. At *The June 2023 report says*, citation tab, exact: **June 2023 ER p.22: "There were a number who went above the maximum or who drew the curve for a non-competitive inhibitor."**; at *which an inhibitor does not do*, the ghost above-maximum curve is struck; the marker stays on.
8. At *The March 2023 Paper 1 report*, second tab, exact: **March 2023 ER p.2: "About a quarter of candidates selected option D instead of the correct answer. … they had confused the relationship between substrate concentration and rate of reaction in the presence of a competitive inhibitor with that in the presence of a non-competitive inhibitor. With competitive inhibitors, an increase in substrate concentration can overcome inhibition so that the maximum possible rate of breakdown is unchanged."**
9. At *Redraw it*, the lower-plateau sketch is struck and the correct `competitive` curve draws in the accent: below the original at low concentration, then merging into the original plateau; this is the last fault, and **the marker clears on this completed frame**. At *Vmax unchanged, Km increased*, the two labels land beside it with the MS quote in small type: *MS p.13: "curve below the original line ; curve, merging / will merge, with the original line after it begins to plateau ;"*. **Exit cue: end of *that is competitive*.** Treatment lifts; the corrected sketch holds.

**On-screen text:** the panel; the reproduced instruction and citation; the sketch card; the two report quotes; the MS quote.

---

### BEAT 14 · The sentences you write, clause by clause · 11:20–12:10
**Narration:**
> Now the sentences you write, clause by clause, one for each outcome. For Km: Vmax is the maximum initial rate; Km is the substrate concentration at half Vmax, read by construction from each enzyme's own curve; a lower Km means a higher affinity for the substrate. For inhibitors: a competitive inhibitor binds reversibly in the active site, so Vmax is unchanged and Km increases, because more substrate can overcome it; a non-competitive inhibitor binds at a site other than the active site and changes the active site's shape, so in the simplified model Vmax decreases and Km is unchanged.

**Visual action:** The two graphs (Beat 11 and Beat 12 panels) shrink to the top; a sentence surface beneath, two blocks.
1. At *For Km*, block 1 opens; at *Vmax is the maximum initial rate*, clause 1 lands and the `vmax-line` on the left graph pulses; at *read by construction from each enzyme's own curve*, clause 2 lands and the `half-line`/`km-drop` pulse; at *a lower Km means a higher affinity*, clause 3 lands.
2. At *For inhibitors*, block 2 opens; at *binds reversibly in the active site*, clause 4 lands and the competitive panel's model pulses; at *Vmax is unchanged and Km increases*, clause 5 lands and the competitive graph's labels pulse; at *because more substrate can overcome it*, the causal connective is highlighted; at *binds at a site other than the active site*, clause 6 lands and the non-competitive model pulses; at *Vmax decreases and Km is unchanged*, clause 7 lands and the non-competitive graph's labels pulse.

**On-screen text:** the two sentences, building: **Vmax is the maximum initial rate; Km is the substrate concentration at ½Vmax, read by construction from each enzyme's own curve; a lower Km means a higher affinity for the substrate.** / **A competitive inhibitor binds reversibly in the active site, so Vmax is unchanged and Km increases, because more substrate can overcome it; a non-competitive inhibitor binds at a site other than the active site and changes the shape of the active site, so (simplified model) Vmax decreases and Km is unchanged.**

---

### BEAT 15 · What I told you, read off the graph and the model · 12:10–12:55
**Narration:**
> So here is the whole lesson on the graph and the model you have been using. Vmax from the plateau. Half it, across, down: Km, a concentration. Lower Km, higher affinity, and each enzyme's Km from its own half Vmax. Same enzyme with an inhibitor: competitive, in the active site, overcome by substrate, Vmax unchanged, Km increased, the curve merges at the plateau. Non-competitive, at another site, the active site changes shape, Vmax decreased, Km unchanged in this model. Both reversible: activity returns when the inhibitor leaves.

**Visual action:** **No new slide.** The screen returns to the layout built through the lesson: one `RateGraph` at centre carrying the `no-inhibitor`, `competitive` and `non-competitive` curves, each with its own construction; the `EnzymeActiveSiteModel` at right with both inhibitor shapes beside their sites; the three-enzyme order strip small at the bottom. Static. Key points fade in in place: at *Vmax from the plateau*, the `vmax-line`s brighten; at *Half it, across, down*, the `half-line`s and `km-drop`s brighten; at *Km, a concentration*, the x-axis label brightens; at *each enzyme's Km from its own half Vmax*, the order strip brightens; at *competitive, in the active site*, the wedge and the cleft brighten; at *the curve merges at the plateau*, the merge point brightens; at *Non-competitive, at another site*, the round shape and the second site brighten; at *Vmax decreased, Km unchanged in this model*, the lower curve's labels brighten; at *Both reversible*, the **reversible** label brightens.

---

### BEAT 16 · How it is asked, and the reject card · 12:55–13:40
**Narration:**
> How this reaches you. They give you a graph and say estimate Km, show your working on the graph: three marks, including two for showing the values on the graph. They give you a curve and say sketch the effect of a competitive inhibitor, and the merge at the plateau is a mark. In Paper 1 they ask for the order of affinity of three enzymes, or a row for the effect of a competitive inhibitor on Vmax and Km, or which lines on a graph belong to which mixture. And one in words: suggest why an enzyme's Km is lower, where the credited ideas are the active site being more complementary or more accessible. The reject: Km is not a rate.

**Visual action:**
1. At *How this reaches you*, a forms surface, plain, one row per form.
2. At *estimate Km, show your working on the graph*, row 1: **estimate Km; show working on the graph** · *s23_31 Q1(b)(ii), 3 marks*; at *two for showing the values on the graph*, small type *MS p.7: shows Vmax; shows ½Vmax; 18*.
3. At *sketch the effect of a competitive inhibitor*, row 2: **sketch the competitive curve** · *s23_23 Q3(b)(ii); s21_51 Q1(c)(ii)*; at *the merge at the plateau is a mark*, small type *"must meet the plateau of original curve"*.
4. At *the order of affinity of three enzymes*, row 3: **order of affinity from three curves** · *s24_12 Q11, key B*; at *a row for the effect of a competitive inhibitor*, row 4: **effect on Vmax and Km, table row** · *s24_12 Q10, key A*; at *which lines on a graph belong to which mixture*, row 5: **which lines: substrate only / + enzyme / + inhibitor** · *m23_12 Q16, key B*.
5. At *suggest why an enzyme's Km is lower*, row 6: **suggest why Km is lower** · *s21_22 Q5(d)(i), MS p.18: "increases affinity of enzyme for substrate ;", "makes shape of active site more complementary ;", "makes (position of) active site more accessible (to substrate) ;"*.
6. At *The reject*, the reject card lands, struck through by hand: **✗ Km is the maximum rate of reaction** / **✓ Km is the substrate concentration at which the initial rate is half Vmax**, citation *ECR Paper 2 Q1 p.10: "'Vmax', which is a different term, was also given"; June 2024 ER p.4* in small type.

**On-screen text:** the six forms with citations; the reject card.

---

### BEAT 17 · The real question on screen, and the tablet · 13:40–14:20
**Narration:**
> Here is the question itself, from June 2023. Read it. Then watch the three marks land on our graph: Vmax shown, half Vmax shown, eighteen. And the tablet? Its molecule binds one enzyme, reversibly, in the active site or beside it, and other enzymes have different active sites, so a molecule that fits one need not fit the rest. Which kind of inhibitor it is, you can now read off a graph.

**Visual action:**
1. At *Here is the question itself*, the s23_31 Q1(b)(ii) instruction reproduced verbatim (QP p.9) at left: **"Use the graph in Fig. 1.2 to estimate the Michaelis-Menten constant (Km) of lactase. Show your working on the graph in Fig. 1.2."** with the answer line **Km = …… mmol dm⁻³ [3]**. Citation *9700/31 June 2023 Q1(b)(ii), 3 marks*. **The paper's Fig. 1.2 is not reproduced**; our worked-example graph sits at right in its bare state, tagged *our graph, not the paper's figure*. At *Read it*, five-second anchored read with the instruction **estimate Km; show working on the graph**.
2. At *the three marks land on our graph*, `vmax-line`, `half-line` and `km-drop` draw in turn and the MS points land beside them, each ticked: *shows Vmax on graph* · *shows ½ Vmax on graph* · *18*; the answer line fills **Km = 18 mmol dm⁻³**.
3. At *And the tablet*, the Beat 1 tablet and cell inset return small; at *in the active site or beside it*, the model's cleft and second site are each ringed once; at *need not fit the rest*, the other silhouettes in the inset keep running; at *read off a graph*, the two inhibitor curves flash once on the main graph. Final frame held 2 s: the question and citation at left, our graph with three ticks at right, the inset beneath. No slogan.

**On-screen text:** the reproduced instruction; citation; the three credited points; *Km = 18 mmol dm⁻³*.

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.20) | Beat(s) | How |
|---|---|---|
| 3.2.2 the maximum rate of reaction (Vmax) | 3, 5, 15 | plateau or supplied value; not a still-rising point |
| 3.2.2 is used to derive the Michaelis–Menten constant (Km) | 4, 5, 6, 17 | the definition verbatim; the four-step construction drawn on the graph |
| 3.2.2 which is used to compare the affinity of different enzymes for their substrates | 7, 8, 9, 14, 16 | lower Km = higher affinity; three enzymes, each from its own ½Vmax |
| 3.2.3 reversible inhibitors | 10, 12, 15 | bind and leave; activity returns |
| 3.2.3 competitive | 11, 13, 14, 16 | similar shape; in the active site; overcome by substrate; Vmax unchanged, Km increased; merging curve |
| 3.2.3 non-competitive | 12, 14, 15 | site other than the active site; active-site shape change; simplified model: Vmax decreased, Km unchanged |
| 3.2.3 on enzyme activity | 11, 12, 14 | read as changes to the rate–concentration curve and to seating on the model |
| "explain" | 14 | two creditworthy sentences built clause by clause |

### Mark-scheme and examiner points → beats

| Source | Point | Beat |
|---|---|---|
| s21_51 QP p.5 | the Vmax and Km definitions, verbatim | 4 |
| s23_31 Q1(b)(ii), MS p.7; June 2023 ER p.26 | "shows Vmax on graph ;", "shows ½ Vmax on graph ;", "18 ;"; "calculate Km correctly showing the calculation instead of showing how the figures … were obtained on the graph" | 5, 6 (E37), 16, 17 |
| ECR Paper 2 Q1 p.10, comment E | "'Vmax', which is a different term"; "½ Vmax … a stage in deriving Km" | 6 (E37), 16 (reject card) |
| June 2024 ER p.4 (Q11) | "lower Km corresponded to a higher affinity"; Km confused with Vmax (option C); gradient taken as affinity (option A) | 7, 9 (E36) |
| s24_12 Q11, key B | order of affinity X, Z, Y | 8, 9, 16 |
| s24_13 Q12, key B; s22_12 Q12, key A | Km compares affinity of different enzymes; low affinity = high Km, Vmax at high substrate concentration | 7 (ledger form), 14 |
| s21_51 Q1(c)(ii), (iv), MS p.7 | competitive curve to the right/below, "must meet the plateau"; Km increased | 11, 16 |
| s24_12 Q10, key A | competitive reversible inhibitor: Vmax no change, Km increases | 11, 12 (contrast), 16 |
| s23_23 Q3(b)(ii), MS p.13; June 2023 ER p.22 | "curve below the original line ;", "merging / will merge"; "went above the maximum or … drew the curve for a non-competitive inhibitor" | 13 (E41), 16 |
| March 2023 ER p.2 (m23_12 Q16, key B) | "confused the relationship … competitive … with … non-competitive"; "can overcome inhibition so that the maximum possible rate … is unchanged" | 11, 13 (E41), 16 |
| s24_23 Q5(b), MS p.9 | "allosteric site / site other than active site"; "change in shape of active site"; "no longer complementary" | 12 |
| s21_22 Q5(d)(i), MS p.18 | lower Km: "increases affinity", "more complementary", "more accessible"; higher Vmax: "more enzyme-substrate complexes per unit time" (E40's I-note is L4b's) | 16 |
| s20_12 Q13, key B | non-competitive inhibitor of enzyme 2 in a pathway: substance X accumulates | ledger only (pathway form; not retold, no pathway lesson) |
| s20_12 Q14, key D | two enzymes at low substrate concentration | ledger only (the plan lists the key; the stem's premise is not restated in narration) |

### Absolutes sweep (own)

Every sentence containing *every, all, always, never, only, no, nothing, cannot, because* was reread.
- "leave thousands of others running" (Beat 1): hook framing; "a molecule that fits one need not fit the rest" (Beat 17) replaces any claim that it fits nothing else.
- "If the curve is still rising at the last point, that point is not Vmax" (Beat 3): the S23/51 local ruling, stated as a reading rule for a rising curve.
- "Km is not a rate" (Beat 4, 16): definitional; the reject card cites the ECR.
- "never draw one horizontal across all three" (Beat 8): about that displayed example, where all three plateaux differ; not a rule against a shared line where values coincide (Beat 11's shared Vmax line is valid).
- "a gradient is a rate per concentration, not a concentration" (Beat 9): about units. "it does not tell you the substrate concentration at half that rate" (Beat 9): the half-Vmax definition, not a threshold.
- "the inhibition can be overcome" (Beat 11): "can", the March 2023 report's wording. "Km increased" carries the small-type *apparent Km* note.
- "binds at a different site from the substrate", "cannot restore the uninhibited maximum rate", "does not compete for the inhibitor's binding site", "does not restore it", "Km is unchanged" (Beat 12): bounded by the *simplified non-competitive model* caption from the start of the beat; more substrate still raises the rate along the rising part of the curve; no generalisation to other inhibitors binding away from the active site; no other class named.
- "still below the original at high substrate concentration" and "lie below the original at low positive substrate concentrations" (Beat 13): about the plateaux; both schematic curves start at the origin. "which an inhibitor does not do; it lowers the rate": about the inhibitors taught (reversible, lowering activity); no "never" and no universal law.
- "compare how readily these enzymes bind their substrates" (Beat 1): about the enzymes compared, not every enzyme.
- "about a quarter of candidates" (Beat 13): the report's own fraction, not upgraded.
- No sentence derives Km algebraically, mentions a reciprocal plot, names a third inhibition class, teaches allosteric regulation, calls the highest plotted point Vmax, or draws a common half-Vmax line.

### Word count and runtime

| | |
|---|---|
| Narration words (Beats 1–17, including the three talk-throughs) | **1,929** (counted by the validator over the blockquoted narration, silent-read lines excluded; 1,921 before the check edits) |
| Runtime at 120 words per minute of final video | **16:04** (effective rate; prescribed reads and holds are not added again) |
| Budget (7:00 + 6:45, error allowances included) | 13:45 |
| Beats | 17 (14 teaching + 3 error) |

**Length, honestly:** **1,929 words, 16:04** after the check edits (+8 words of replacement wording), **2:19 over** the 13:45 budget. Where it sits: the three error beats total **561 words, 4:40** (E37 197, E36 190, E41 182, each including its announcement; the checker's speech-equivalent durations are 98, 93.5 and 89 s), against the plan's added allowance of 3 × 0:45 = 2:15; the fourteen teaching beats total **1,360 words, 11:20** against the 11:30 base, so the teaching is inside its envelope and the whole overrun is the measured cost of error beats written to the five moves (E36 and E41 each correct two faults). None is cut. **CHECK ruling: the error-driven overrun is accepted; cuts 2–4 below are KEEP; cut 1 is held pending Durai's "cut nothing" instruction.** **Cut list if the checker wants the envelope met, in order (teaching beats only):** (1) Beat 16, row 5 "or which lines on a graph belong to which mixture", ~10 words; (2) Beat 10, "This is one way cells control their reactions, and it is how a number of medicines work: bind the enzyme, slow the reaction", ~25 words (framing; last resort); (3) Beat 8, "Notice that Y, the fastest at the top, has the lowest affinity", ~12 words; (4) Beat 3, the still-rising sentence, ~20 words (S23/51 ruling would then live in small type only). Together ~0:35; the remainder is the error-beat allowance, a planning figure for the weights, not a script fault. Never speed the narration.

### What I left out, and who owns it

| Left out | Owner |
|---|---|
| The factor effects themselves (substrate concentration curve's explanation; E38–E40) | L4b (3.2.1); recalled by label only |
| Initial-rate measurement, tangents, progress curves | L2 (3.1.3); the t = 0 tangent flashes as a recall in Beat 3 |
| Algebraic Michaelis–Menten derivation; Lineweaver–Burk / reciprocal plot; catalytic efficiency (Vmax/Km, s21_22 Q5(d)) | not in the outcome (DO-NOT-ADD) |
| Irreversible inhibitors; uncompetitive or mixed inhibition; allosteric regulation and end-product inhibition pathways | not in the outcome; s20_12 Q13's pathway form is ledger-only |
| Named inhibitors as a list (sulfonamide, inhibitor X, PPIs, tenofovir, CDK inhibitors) | supplied question contexts only |
| Product inhibition and immobilised-enzyme product removal | L6 (3.2.4) |
| Denaturation as a "loss of activity" | L4a; the non-competitive shape change is explicitly not the `denatured` state |

### Reusable models established here

| Model | For |
|---|---|
| **`RateGraph` construction overlays** (`vmax-line`, `half-line`, `km-drop`; per-curve rule; `competitive`, `non-competitive`, three-enzyme curves with our values) | L6 (reuses `RateGraph`); notes and questions for 3.2.2–3.2.3 |
| **`EnzymeActiveSiteModel` inhibitor states** (`inhibitor-competitive`, `inhibitor-noncompetitive`, second site, two inhibitor shapes, distort/return motion) | L6 (recall only); the 3.2.3 notes |
| **The switch card** (different enzymes → same enzyme with and without inhibitor) | the 3.2.3 notes |
| **Two creditworthy sentences** (Beat 14) | the notes' model answers for 3.2.2 and 3.2.3 |

---

## Assets

| Asset | Status | Source |
|---|---|---|
| `RateGraph` substrate-concentration configuration with addressable construction overlays and curve ids | **extend** L2's component | authored |
| Worked-example curve (plateau 9.0 au, Km 18 mmol dm⁻³); three-enzyme curves (our values); enzyme A/B pair | new, our schematics, captioned | authored |
| `EnzymeActiveSiteModel` inhibitor states and two inhibitor shapes | **extend** L1's model | authored |
| E37 card (bare graph + handwritten calculation); E36 card (two reasonings); E41 card (lower-plateau sketch + above-maximum ghost) | new, captioned as composites | authored |
| Reproduced instructions: s23_31 Q1(b)(ii); s24_12 Q11 stem; s23_23 Q3(b)(ii); s21_51 definitions | typographic, verbatim, cited; no Cambridge artwork or figures | Cambridge papers |
| Tablet and cell inset; switch card | new, schematic | authored |
| COMMON MISTAKE panel; reject card; forms surface | shared with Topics 1–2 | existing |
| Micrographs, photographs | none | — |

---

## Validator run

`qa/validate-storyboard.py STORYBOARD.md` — exact, unique, in-order cues; ~30-word gap check; words ÷ 120.

```
beat words cues maxgap  status
   1    96    8     20  ok
   2    53    3     18  ok
   3    90   11     19  ok
   4    90    6     31  ok
   5    95   11     18  ok
   6   199   15     23  ok
   7   101    8     29  ok
   8   110   15     22  ok
   9   188   16     28  ok
  10   104   11     13  ok
  11   119   12     17  ok
  12   127   15     19  ok
  13   177   17     21  ok
  14    99   10     20  ok
  15    87    9     16  ok
  16   122   10     21  ok
  17    72    7     20  ok
TOTAL words 1929  cues 184  runtime at 120 wpm 16:04  beats 17  failing beats 0
```

---

## CHECK RESPONSE (rework 1)

| Finding | Response |
|---|---|
| M1 Beat 12 "does not go near the active site"; "Adding more substrate does not help" | **Applied verbatim.** "A non-competitive inhibitor binds at a different site from the substrate."; "Adding more substrate cannot restore the uninhibited maximum rate, because it does not compete for the inhibitor's binding site." Cues remapped to *binds at a different site from the substrate*, *cannot restore the uninhibited maximum rate*, *does not compete for the inhibitor's binding site*; the *simplified non-competitive model* caption now runs from action 1 over the molecular model and continues over the graph. Lower plateau, unchanged Km and restoration after departure unchanged. |
| M2 Beat 9 threshold definition of Km | **Applied verbatim.** "…it does not tell you the substrate concentration at half that rate. That concentration is Km, a different quantity in different units." First cue kept; second cue now *That concentration is Km, a different quantity in different units*. Both wrong lines, the three constructions and the marker-until-last-fault are unchanged. |
| M3 Beat 1 "every enzyme … how eagerly" | **Applied verbatim.** "First it lets you compare how readily these enzymes bind their substrates."; cue *compare how readily these enzymes bind their substrates*. |
| M3 Beat 5 "Four steps, all of them lines" | **Applied verbatim.** "Show the construction on the graph: Vmax, half Vmax, across, down."; cue *Show the construction on the graph*; the four-part cue stays. |
| M3 Beat 6 "Two of the three marks are lines" | **Applied verbatim.** "Two of the three marks are for showing those values on the graph."; cue *showing those values on the graph*. MS quotation and construction lines preserved. |
| M3 Beat 16 "three marks, two of them lines" | **Applied verbatim.** "three marks, including two for showing the values on the graph"; cue *two for showing the values on the graph*. |
| M3 Beat 13 "below the original all the way along" | **Applied verbatim.** "still below the original at high substrate concentration". |
| M3 ledger carry-through; Beat 8 horizontal | Absolutes sweep rewritten for Beats 1, 8, 9, 11, 12, 13; Beat 8's "never draw one horizontal" is recorded as bounded to that displayed example. |
| S1 invented explanations (Beats 6, 13) | **Applied verbatim.** "The arithmetic can feel like the working, and half of nine really is four point five." (cue *The arithmetic can feel like the working*); "Both inhibited curves lie below the original at low positive substrate concentrations, so it is easy to overlook what happens at high substrate." (cues *Both inhibited curves lie below the original*, *what happens at high substrate*). |
| S2 Beat 10 "There are two classes" | **Applied verbatim.** "Here we compare two classes, and the difference is where the inhibitor binds."; cue *Here we compare two classes*. |
| S3 apparent Km caption | **Applied.** Small type *Km measured with the inhibitor present: apparent Km* beside **Km increased** in Beat 11. |
| S4 Beat 16 row 5 cut | **Held, not applied.** Durai's rework instruction for L5 is "cut nothing"; the checker rules TAKE for register. Ten words and one row/cue; either ruling can be applied in one edit. Flagged for Durai. |
| S5 graph build note | **Applied verbatim** as a bullet in the `RateGraph` specification, with the units-reset sentence from the value audit. |
| Length | Recounted after edits: see the table above. Teaching remains inside its 11:30 base; error-beat overrun accepted per the check. Validator re-run: all cues exact, unique, in order; no gap over 30 words. |
