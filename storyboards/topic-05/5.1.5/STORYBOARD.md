# 5.1.5 — Stem cells: replacing cells and repairing tissue by mitosis

**Storyboard, first draft. Cloud run 007, 27 September 2026.** No audio, no code, no render. Folder `storyboards/topic-05/5.1.5/`. It stands alone: own hook and context, a labelled recall of 5.1.2 and 5.2.1, own objectives, explanation, recap in place and exam close.
Cambridge 9700 syllabus 2025–2027, p.23. Command word **OUTLINE**. Budget from `plan/topic-05/TOPIC-PLAN-05-CELL-CYCLE.md` §5.1.5 and lesson table, and `plan/topic-05/TOPIC-05-WEIGHTS.md` (5.1.5 row): **4:30 (about 540 words), 8 beats + 0 error beats = 8 beats**; no error beat and no badge. 5.1.5 has no fixed-sample demand (0 papers); one supplementary Paper 1 item, w22_13 Q20. Runtime estimated at **120 words per minute of final video**.

> **5.1.5** outline the role of stem cells in cell replacement and tissue repair by mitosis

(syllabus p.23)

**Authorities read, in full:** `work/007/SHARED-SPECS.md` (binding; §1–§8); `plan/topic-05/TOPIC-PLAN-05-CELL-CYCLE.md` (scope and authoring rules, §5.1.2 for the handoff, §5.1.5, lesson list and build order, shared-models table, words table, traps table, budget and evidence limits, CHECK RESPONSE (plan), including MF3 "one possible pattern", SF5 intermediates/human red cells/four-month context and SF7 s23_21 Q1(a)(i) attribution); `plan/topic-05/TOPIC-05-WEIGHTS.md` (5.1.5 row and paragraph; S-B w22_13 Q18–21; S-D Learner Guide; Paper 1 table); `work/007/VERIFIED-EVIDENCE.md` (A01, A09); `cloud-inputs/007/standards-update/VIDEO-STRUCTURE.md` (all of it: full shape, hook and handle with its guard, objectives off the lesson diagram, recap on the same diagram, exam close ending on one reject card, anchored silence, animate the mechanism, say the typical thing as typical, REAL-WORLD SAMPLES); the cleared `cloud-inputs/006/examples/3.1.3/STORYBOARD.md` and `cloud-inputs/006/examples/3.2.1b/STORYBOARD.md` (format, section order, rigour); `cloud-inputs/006/examples/TOPIC-03-PLAN-CHECK.md` (skimmed for what is punished: local rulings generalised, unreproducible numbers); `cloud-inputs/003/standards/SYLLABUS-9700-DETAIL.md` (5.1.5 verbatim, p.23; 1.2.1 Golgi body for the exam-close recall tag); `cloud-inputs/007/evidence/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md` (G05); `cloud-inputs/007/evidence/EXAMINER-INSIGHT-9700.md` (§4 outline; the s23_21 Q1(a)(i) plant-stem correction); `cloud-inputs/007/evidence/COMPLEXITY-CALIBRATION-9700-BIOLOGY.md` (§5 limit: stem cells kept to self-renewal and differentiation). **No question paper, mark scheme or examiner report PDF was opened for this draft;** every quotation is copied from the files named in *Citations*. SaveMyExams was not used for structure or wording.

**Build position:** seventh of the eight Topic 5 lessons (5.1.1 → 5.1.3 → 5.1.4 → 5.2.1 → 5.2.2 → 5.1.2 → **5.1.5** → 5.1.6). It follows 5.1.2, which hands over *which cells do the dividing* by label.

**Models used:** `MitosisCellModel` (5.2.1; **animal** variant, states `anaphase` → `telophase` → `cytokinesis`, full size in Beat 3 and as a miniature inside the lineage in Beats 4–5); `ChromosomeModel` (5.1.1; inside `MitosisCellModel` only, 2n = 4, hues C1–C4, gene bands); 5.1.2's **context strip** (panels *replacement* and *repair* only, by label). **Published here:** `StemCellLineage` (bone-marrow lineage and skin base-layer variant, with a `graze` state). Everything drawn is a **MODEL** labelled *schematic*; no photograph or micrograph is used; no numbers are plotted.

---

## The causal spine

One sentence carries the lesson:

> **A stem cell is an unspecialised cell that can divide by mitosis again and again (self-renewal), and whose daughter cells can differentiate into specialised cells; so when cells are lost or tissue is damaged, stem cells divide by mitosis and some daughters differentiate to replace the lost cells.**

Mitosis and differentiation are two separate steps and are kept apart in every sentence and every label: **mitosis** makes new cells, genetically identical to the stem cell; **differentiation** makes some of them specialised. Genetic identity does not itself specify a cell's specialised function (SHARED-SPECS §4).

**What the mark schemes credit, quoted.** There is no stem-cell marking point in the evidence. G05's summary: "Stem cells appear in a supplementary C1 item, not a detailed therapeutic explanation here." (G05's own words, not Cambridge's). The plan check identified that item (A09, PDF-VERIFIED key and demand): **w22_13 Q20, key B — basal skin stem cells plus Golgi (mixed Topic 1/5)**, cited by demand only; `UNVERIFIED — its stem and options verbatim`. The outline command carries the Learner Guide's guidance “Detail is not required.” (Learner Guide PDF p15; PDF-VERIFIED (plan check) A01), which governs exam answers, not how well we explain, and is not permission to omit essential steps. So the spine is the syllabus outcome's own relationships (stem cells → mitosis → replacement and repair) plus the two properties the calibration names (self-renewal, differentiation).

**The handle:** *the stem of a plant*. A picture, not an etymology: a stem is where the branches start. Converted at once, in the same beat: *Written properly: a stem cell divides by mitosis, and some of its daughter cells differentiate into specialised cells.* The handle is never the exam answer; it is not shown as a tree diagram, so no branching hierarchy of potency is implied.

**Typicality rules applied.** The one-stays / one-differentiates split is spoken and captioned as *one possible pattern* (*In one possible pattern*; *can differentiate*), never as what every division does. Daughters differentiate **through intermediate stages** (drawn, not named). *No nucleus* and *cannot divide* are said of the **mature human red blood cell** only, never of all vertebrate red cells. The red-cell lifespan is *typically … about four months*, stated as context, not a marking point. The optional plan sentence on adult stem cells producing a limited range of cell types is not used (cut for length; it adds no required relationship). *Many cells specialise and stop dividing* — many, not every. Skin cells are lost *every day* as a description of an ongoing process, not a measured rate; no rate or count is given. Tissue repair is said as *help replace the lost cells*, without claiming every tissue is restored perfectly. The skin question in the exam close is cited by demand; its stem is not quoted and its options are not described.

**Error beats:** none (plan §5.1.5; SHARED-SPECS §8). No badge beat. The exam close ends on one reject card captioned *our wording contrast; not an examiner-reported error*.

---

## The models, specified once

### `StemCellLineage` (published here; no downstream reuse in Topic 5)

Drawn vector model, labels as SVG text nodes. Caption **one possible pattern** on screen whenever the lineage is shown; second caption *schematic; not to scale; intermediate stages simplified*.

- **Niche panel (`marrow`):** a long-bone outline, cut open to show a pale marrow region (a soft cream fill, not terracotta), labelled **bone marrow**. Inside it the **stem cell**: round, unspecialised, a large grey nucleus with a darker grey nucleolus disc, outline in the house accent; label **stem cell**.
- **Division (`dividing`):** the stem cell becomes a miniature (≈0.35 scale) of `MitosisCellModel` animal and runs `anaphase` → `telophase` → `cytokinesis` as continuous MOTION: centromeres lead the separating daughter chromosomes to the poles, envelopes re-form, nucleoli reappear, the cell surface membrane draws in as a cleavage furrow, two cells part. Label **mitosis** on the arrow. Small type *model chromosome set (2n = 4); chromosome drawings simplified, not the human set of 46*. No count strip on the miniature (no count is spoken in this lesson).
- **Daughter A (`self-renew`):** same style as the stem cell, stays in the niche; label **stem cell (self-renewal)**. It can run `dividing` again.
- **Daughter B (`differentiating`):** moves right along an arrow labelled **differentiation** through three drawn **intermediate stages** (unnamed; tag *intermediate stages*): each successive cell a little smaller, its nucleus smaller and denser, its cytoplasm tint deepening from pale to red as it fills with haemoglobin (tint intensity only; one hue). Then **loss of the nucleus** as MOTION: the condensed nucleus moves to the edge and is pushed out of the cell, drifting away and fading with tag *nucleus lost*. The cell settles into a biconcave disc, drawn red (a clear red, distinct from terracotta), labels **mature human red blood cell · no nucleus** and **specialised cell**. It then leaves the marrow panel into a drawn blood vessel (`released`).
- **Skin variant (`skin`):** a cross-section strip of the outer layer of skin (schematic). Bottom row: small cuboidal cells with large nuclei, labelled **base layer: stem cells**, dividing (same miniature motion, sideways). Above: daughter cells moving upwards, progressively flattening; top rows flattened cells without drawn nuclei, labelled **specialised cells**, flaking away from the surface (MOTION). Arrow up the strip labelled **differentiation**; arrow in the base layer labelled **mitosis**. State **`graze`**: a notch removed from the upper layers; base-layer divisions run faster beneath it and new cells move up to fill the notch (MOTION), tag **tissue repair**.
- **Labels (SVG text nodes):** stem cell, mitosis, differentiation, specialised cell, self-renewal, intermediate stages, bone marrow, base layer: stem cells, mature human red blood cell, no nucleus, tissue repair.
- **Colours:** terracotta is not used anywhere in this lesson except the ✗ strike on the reject card (the reject card is a shared asset, SHARED-SPECS §7). Chromosome hues C1–C4 only inside the miniature.
- **No potency hierarchy, no gene-expression mechanism, no named intermediate cell types, no therapy.**

### `MitosisCellModel` (5.2.1; reused by state id)

Animal variant, states `interphase`, `anaphase`, `telophase`, `cytokinesis` as specified in SHARED-SPECS §5 (cell surface membrane, nuclear envelope double line re-forming as MOTION, nucleolus reappearing in each new nucleus, centrosomes with centriole pairs, spindle microtubules pole → centromere, cleavage furrow). Count strip beside the full-size cell in Beat 3, per SHARED-SPECS §4: parent nucleus inset **one nucleus: 4 chromosomes · 4 DNA molecules** (G1, labelled *parent nucleus, before replication*); at telophase **whole cell 8 · each new nucleus 4**; after cytokinesis **each daughter cell 4 chromosomes · 4 DNA molecules**. Tag *recall: 5.2.1*.

### 5.1.2 context strip (by label)

Owned by 5.1.2 (four drawn panels: root tip, skin/gut lining, healing cut, strawberry runner). Here only the **replacement** (skin/gut lining) and **repair** (healing cut) panels are lit; the other two are dimmed. Tag *recall: 5.1.2*.

---

## Beat by beat

Beat windows in the headings follow the per-beat word ledger (words ÷ 120); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch over 30 words without a stated visual change. A model is on screen in every frame.

### BEAT 1 · Hook and context · 0:00–0:34
**Narration:**
> Ever wondered where your new red blood cells come from, when a mature human red blood cell has no nucleus and cannot divide? Your blood carries vast numbers of them, and worn-out ones are removed and replaced continually. Your skin tells the same story: cells are lost from its surface every day, and a graze leaves a gap to fill. Something has to keep making the replacements.

**Visual action:**
1. **From the first frame**, a drawn blood vessel segment (cut open lengthways, caption *schematic*) with red blood cells, biconcave discs in a clear red, flowing left to right (MOTION); the hook question sits as a compact caption above the vessel, never alone on the frame. At *Ever wondered where your new red blood cells*, the flow is on screen and the caption lands.
2. At *has no nucleus and cannot divide*, one cell is lifted into a magnifier circle: no nucleus drawn, tag **mature human red blood cell: no nucleus**; beside it a small division icon (one circle becoming two) is struck through, tag *cannot divide*.
3. At *worn-out ones are removed*, one paler, older cell drifts out of the vessel and fades (tag *worn out*), and a new cell drifts in from the left edge (tag *replacement*).
4. At *Your skin tells the same story*, a second panel slides in beside the vessel: a drawn cross-section of the outer layer of skin (the `StemCellLineage` `skin` strip, labels hidden). At *lost from its surface every day*, flattened surface cells flake away (MOTION). At *a graze leaves a gap*, a notch is removed from the upper layers (the `graze` state, before any repair).
5. At *keep making the replacements*, a question tag **where do the new cells come from?** spans both panels; both panels dim and the frame dissolves to the objectives surface.

**On-screen text:** the hook question; *mature human red blood cell: no nucleus*; *cannot divide*; *worn out*; *replacement*; *where do the new cells come from?*; *schematic*.

---

### BEAT 2 · What you will be able to do · 0:34–0:55
**Narration:**
> By the end you will be able to say what makes a cell a stem cell; outline how stem cells replace lost cells and repair tissue by mitosis, using bone marrow and skin as examples; and keep two words apart, mitosis and differentiation.

**Visual action:** Own styled surface: distinct background colour, brand typography, lines entering with motion; **not the lesson diagram**. Each line sits beside a simple authored pictogram (flat line icons, not the lesson's models), so no frame is text alone.
1. At *say what makes a cell a stem cell*, line 1 enters with a **circle with a looping arrow** pictogram.
2. At *outline how stem cells replace lost cells*, line 2 enters with a **dividing-circle** pictogram; at *using bone marrow and skin*, two small pictograms join it: a **bone** outline and a **layered strip**.
3. At *keep two words apart*, line 3 enters with a **fork** pictogram: one prong a circle splitting in two, the other a circle changing shape.

1. **SAY** what makes a cell a stem cell
2. **OUTLINE** how stem cells replace cells and repair tissue by mitosis (bone marrow; skin)
3. **KEEP APART** mitosis and differentiation

Small type: *syllabus 5.1.5, p.23; command word: outline.*

---

### BEAT 3 · Recall: what mitosis gives · 0:55–1:24
**Narration:**
> First, a quick recall. Mitosis gives two nuclei with the same number of chromosomes and the same genetic information as the parent nucleus; after cytokinesis, there are two genetically identical cells. That is how tissues get new cells for growth, and for replacement and repair. But many cells specialise and stop dividing. So which cells do the dividing?

**Visual action:**
1. Tags **recall: 5.2.1** and **recall: 5.1.2** sit top left for the whole beat. At *a quick recall*, `MitosisCellModel` animal enters full size in `anaphase`, the 2n = 4 set already separated, daughter chromosomes moving to opposite poles, centromeres leading (MOTION); count strip **whole cell 8 chromosomes · 8 DNA molecules**.
2. At *Mitosis gives two nuclei*, the cell runs to `telophase`: nuclear envelopes re-form around each set (MOTION), nucleoli reappear, chromosomes decondense; count strip **whole cell 8 · each new nucleus 4**. At *the same number of chromosomes*, the parent-nucleus inset appears beside the cell (**one nucleus: 4 chromosomes · 4 DNA molecules**, *parent nucleus, before replication*) and the two new nuclei each pulse with **4**. At *the same genetic information*, the white gene bands on matching chromosomes in the two nuclei pulse together.
3. At *after cytokinesis*, the cleavage furrow draws the cell surface membrane in (MOTION) and two cells part; count strip **each daughter cell 4 chromosomes · 4 DNA molecules**; tag **genetically identical**.
4. At *for growth*, 5.1.2's context strip slides in beneath, its **growth** panel briefly lit; at *replacement and repair*, the **replacement** and **repair** panels light and the others dim.
5. At *many cells specialise and stop dividing*, the mature red blood cell from Beat 1 appears small beside the strip, tag *specialised; not dividing*.
6. At *which cells do the dividing*, a question tag **which cells divide to replace them?** lands over the two lit panels.

**On-screen text:** recall tags; the count strip with compartments; *genetically identical*; panel labels; *specialised; not dividing*; the question tag.

---

### BEAT 4 · What makes a cell a stem cell · 1:24–2:10
**Narration:**
> In the tissues we follow here, the answer is stem cells. A stem cell is unspecialised: it has not taken on one particular job. It can divide by mitosis again and again, keeping a supply of stem cells; that is self-renewal. Its daughter cells can also differentiate, becoming specialised, with a structure suited to one function. Picture it like the stem of a plant, where the branches start. Written properly: a stem cell divides by mitosis, and some of its daughter cells differentiate into specialised cells.

**Visual action:**
1. At *the answer is stem cells*, the context strip slides away and `StemCellLineage` `marrow` builds at left: the bone outline, the marrow region, and one **stem cell** at centre with its label; caption **one possible pattern** and *schematic; not to scale; intermediate stages simplified*.
2. At *A stem cell is unspecialised*, the stem cell's outline pulses; tag **unspecialised: no particular job yet**.
3. At *divide by mitosis again and again*, the stem cell runs `dividing` (the `MitosisCellModel` miniature: anaphase → telophase → cytokinesis, MOTION), label **mitosis**; one daughter stays and, at *keeping a supply of stem cells*, runs `dividing` once more, leaving a stem cell each time; at *that is self-renewal*, label **self-renewal** under the staying cell.
4. At *can also differentiate*, a second daughter moves right along the arrow labelled **differentiation**; at *with a structure suited to one function*, it reaches the right-hand slot as an outline only, tag **specialised cell** (its shape arrives in Beat 5).
5. At *like the stem of a plant*, a small plant-stem line icon appears in the corner with two side branches drawing out of it; tag *handle: the stem is where the branches start*.
6. At *Written properly*, the icon shrinks and a boxed sentence writes beneath the lineage: **a stem cell divides by mitosis, and some of its daughter cells differentiate into specialised cells**; at *some of its daughter cells differentiate*, the words **mitosis** and **differentiate** in the box take the colours of their two arrows.

**On-screen text:** *stem cell*; *unspecialised: no particular job yet*; *mitosis*; *self-renewal*; *differentiation*; *specialised cell*; the boxed sentence; *one possible pattern*.

---

### BEAT 5 · Bone marrow to red blood cell · 2:10–2:44
**Narration:**
> Here is one in the bone marrow, the soft tissue inside bones. Watch it divide by mitosis. In one possible pattern, one daughter remains a stem cell and the other goes on to differentiate. It passes through several intermediate stages, filling with haemoglobin, and then it loses its nucleus. Now it is a mature red blood cell, released into the blood, where it typically lasts about four months.

**Visual action:**
1. At *Here is one in the bone marrow*, the camera closes on the marrow panel; label **bone marrow** brightens; the boxed sentence from Beat 4 stays small beneath.
2. At *Watch it divide by mitosis*, the stem cell runs `dividing` (MOTION), arrow label **mitosis**.
3. At *In one possible pattern*, the caption **one possible pattern** pulses; at *one daughter remains a stem cell*, daughter A settles in the niche, label **stem cell (self-renewal)**; at *the other goes on to differentiate*, daughter B moves onto the **differentiation** arrow.
4. At *several intermediate stages*, daughter B passes through the three drawn intermediate stages in turn (MOTION along the arrow, each a little smaller), tag *intermediate stages*; at *filling with haemoglobin*, its cytoplasm tint deepens from pale to red in one hue, tag *haemoglobin*.
5. At *loses its nucleus*, the condensed nucleus moves to the cell edge and is pushed out (MOTION), drifting away and fading, tag *nucleus lost*; the cell settles into a biconcave disc.
6. At *a mature red blood cell*, labels **mature human red blood cell · no nucleus** and **specialised cell** land on it; at *released into the blood*, it leaves the marrow panel into a drawn blood vessel and joins the flow from Beat 1.
7. At *about four months*, small type beside the vessel: *typical lifespan of a human red blood cell: about four months (context, not a marking point)*. Meanwhile daughter A in the niche begins another `dividing` run, so the supply is visibly kept.

**On-screen text:** *bone marrow*; *mitosis*; *one possible pattern*; *stem cell (self-renewal)*; *differentiation*; *intermediate stages*; *haemoglobin*; *nucleus lost*; *mature human red blood cell · no nucleus*; *specialised cell*; the lifespan note.

---

### BEAT 6 · Skin, a graze, and two separate steps · 2:44–3:22
**Narration:**
> The same idea runs in your skin. Stem cells in the base layer of the outer skin keep dividing by mitosis. Daughter cells that move upwards differentiate: they flatten, specialise, and are eventually lost from the surface, while the base layer carries on. After a graze, extra divisions there help replace the lost cells: that is tissue repair. Notice the two separate steps. Mitosis makes new cells, genetically identical to the stem cell. Differentiation makes them specialised.

**Visual action:**
1. At *The same idea runs in your skin*, the `StemCellLineage` `skin` strip slides in at right beside the marrow lineage (which stays on screen at left), now with its labels.
2. At *Stem cells in the base layer*, the base row brightens, label **base layer: stem cells**; at *keep dividing by mitosis*, two base cells run the sideways `dividing` miniature (MOTION), arrow **mitosis**.
3. At *Daughter cells that move upwards differentiate*, daughters rise through the rows, progressively flattening (MOTION), arrow **differentiation**; at *lost from the surface*, the top flattened cells flake away (MOTION), label **specialised cells**; at *the base layer carries on*, the base row runs another division.
4. At *After a graze*, the strip switches to the `graze` state: a notch is removed from the upper layers; at *extra divisions there*, base-layer divisions beneath the notch run faster (MOTION); at *help replace the lost cells*, new cells move up and fill the notch; at *that is tissue repair*, tag **tissue repair**.
5. At *Notice the two separate steps*, the two arrows in both lineages brighten, **mitosis** in one colour and **differentiation** in another; at *Mitosis makes new cells*, the mitosis arrows pulse and a tag lands beside them, **mitosis: new cells, genetically identical to the stem cell**; at *Differentiation makes them specialised*, the differentiation arrows pulse and a second tag lands, **differentiation: specialised cells**. The two tags stay on separate lines, never merged.

**On-screen text:** *base layer: stem cells*; *mitosis*; *differentiation*; *specialised cells*; *tissue repair*; the two step tags.

---

### BEAT 7 · What I told you, on the lineage · 3:22–3:51
**Narration:**
> So here it is, on the diagram you watched. A stem cell is unspecialised, and divides by mitosis. Self-renewal keeps the supply of stem cells. Some daughters differentiate, through intermediate stages, into specialised cells: a red blood cell that loses its nucleus, or a flattened skin cell. That is how stem cells replace lost cells and repair tissue.

**Visual action:** **No new slide.** The screen returns to the lineage built through the lesson: `StemCellLineage` `marrow` at left (stem cell, daughter A, the three intermediate stages, the extruded nucleus tag, the red blood cell in the vessel) and the `skin` strip at right (repaired notch), caption **one possible pattern**. Static. Key points fade in in place:
1. At *on the diagram you watched*, the whole layout settles; nothing moves.
2. At *A stem cell is unspecialised*, the stem cell in the marrow and the base row in the skin brighten; at *divides by mitosis*, both **mitosis** arrows brighten.
3. At *Self-renewal keeps the supply*, **stem cell (self-renewal)** brightens under daughter A.
4. At *Some daughters differentiate*, both **differentiation** arrows brighten; at *through intermediate stages*, the three intermediate stages brighten; at *a red blood cell that loses its nucleus*, **mature human red blood cell · no nucleus** and *nucleus lost* brighten; at *a flattened skin cell*, the top flattened cells brighten.
5. At *replace lost cells and repair tissue*, the red cell in the vessel and **tissue repair** on the skin strip brighten together.

---

### BEAT 8 · How it is asked, and the reject card · 3:51–4:28
**Narration:**
> How does this reach you? The command word is outline, so give the main points, clearly linked. One multiple-choice question paired stem cells in the base layer of the skin with the Golgi body, from cell structure, so expect this idea mixed with other topics. And the hook? Stem cells in the bone marrow divide by mitosis, and daughters differentiate into new red blood cells. The card keeps the order: mitosis first, then differentiation.

**Visual action:**
1. At *How does this reach you?*, the Beat 7 lineage stays on screen at right, reduced, from the beat's first frame, so the frame is never a card alone; a compact forms surface opens at left.
2. At *The command word is outline*, row 1: **outline the role of stem cells** · *syllabus 5.1.5, p.23*; at *clearly linked*, small type, exact: *Learner Guide PDF p15, outline command: “Detail is not required.” (PDF-VERIFIED (plan check) A01); this governs exam answers, not the teaching*; the boxed sentence from Beat 4 brightens beneath the lineage.
3. At *One multiple-choice question*, row 2: **stem cells in the base layer of the skin, paired with the Golgi body** · *w22_13 Q20 (Paper 1), key B; PDF-VERIFIED key and demand (plan check A09); our framing of the demand; UNVERIFIED — its stem and options verbatim*; the skin strip's base row brightens; at *with the Golgi body*, a small flat Golgi-body line icon (stacked curved sacs, no labels beyond its name) appears beside row 2, tag *recall: 1.2.1*.
4. At *And the hook?*, the Beat 1 vessel returns small at the bottom with red cells flowing; at *daughters differentiate into new red blood cells*, the marrow lineage's differentiation arrow and the red cell brighten and a new red cell enters the small vessel.
5. At *The card keeps the order*, the reject card lands beside the lineage, struck through by hand: **✗ stem cells divide by differentiation** / **✓ stem cells divide by mitosis; some of the daughter cells then differentiate**; caption in small type *our wording contrast; not an examiner-reported error*. At *mitosis first*, the ✓ line's **mitosis** pulses; at *then differentiation*, its **differentiate** pulses. **Exit cue: end of *then differentiation*.** Final frame held 2 s: forms at left, lineage and reject card at right, the small vessel beneath. No slogan.

**On-screen text:** the two forms with citations; the Learner Guide line; the Golgi-body icon and recall tag; the reject card and its caption.

---

## Datasets

No dataset: nothing is plotted, tallied or calculated, and no count is spoken. Numbers on screen are the model counts in Beat 3 (per SHARED-SPECS §4: parent nucleus 4 / 4; telophase whole cell 8 / 8, each new nucleus 4; each daughter cell 4 / 4, all in the 2n = 4 model) and one typical value:

- **Typical human red-cell lifespan, about four months** (Beat 5): stated as typical context, not a marking point, as the plan specifies (§5.1.5, SF5). It is not drawn as a measurement. `UNVERIFIED — a citable source for the typical figure, if the checker requires one beyond the plan`.

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.23) | Beat(s) | How |
|---|---|---|
| 5.1.5 … the role of stem cells | 4, 5, 6, 7 | unspecialised; divides by mitosis again and again (self-renewal); daughters can differentiate into specialised cells |
| … in cell replacement | 1, 3, 5, 7, 8 | red blood cells (no nucleus, cannot divide) replaced from bone-marrow stem cells; skin surface cells replaced from the base layer |
| … and tissue repair | 1, 3, 6, 7 | the graze: base-layer divisions help replace lost cells |
| … by mitosis | 3 (recall), 4, 5, 6, 8 | division drawn as the `MitosisCellModel` miniature every time; mitosis and differentiation kept as two steps |
| *outline* | 2, 8 | objectives; exam close with the Learner Guide's outline guidance |

### Mark-scheme and examiner points → beats

| Source | Point | Beat |
|---|---|---|
| w22_13 Q20, QP pp9–11 / MS p2, key B (A09) | basal skin stem cells plus Golgi (mixed Topic 1/5); cited by demand | 6 (skin base layer taught), 8 (form row 2) |
| Learner Guide PDF p15 (A01) | “Detail is not required.” for outline | 8 (small type) |
| G05 | "Stem cells appear in a supplementary C1 item, not a detailed therapeutic explanation here." (G05's summary) | spine; no therapy content anywhere |
| Plan traps table | stem cells divide by mitosis, not by differentiation; one possible pattern; human red cells only | 4, 5, 8 (reject card) |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, only, never, cannot, no, because* (and *again and again*, *keep*) was reread with the typicality question.
- *a mature human red blood cell has no nucleus and cannot divide* (1): said of the mature human red blood cell only (plan §5.1.5 and traps table); not generalised to all vertebrates.
- *cells are lost from its surface every day* (1): a description of an ongoing process in skin; no rate or count.
- *worn-out ones are removed and replaced continually* (1): an ongoing process; no mechanism or site claimed.
- *it has not taken on one particular job* (4): definition of unspecialised.
- *again and again* (4): *can divide*, the capacity; not a claim of unlimited division.
- *keep dividing* (6): *keep* describes the base layer's continuing activity; paired with *carries on*.
- *many cells specialise and stop dividing* (3): *many*, not every (SHARED-SPECS §4: some cells specialise and stop dividing).
- *one daughter remains a stem cell and the other goes on to differentiate* (5): opened by *In one possible pattern*; the caption is on screen throughout.
- *some of its daughter cells differentiate* (4, 8 card): *some*, not all.
- *typically lasts about four months* (5): typical and approximate.
- *help replace the lost cells* (6): no claim that repair is always complete.
- *the answer is stem cells* (4): scoped to *the tissues we follow here* (marrow and skin).
- *so expect this idea mixed with other topics* (8): an inference from one cited item, phrased as advice, not a frequency claim.
- No sentence uses *all, always, only, never* or *because*. No sentence claims how often candidates make any error.

---

## Citations

Every quotation copied verbatim from the file named.

| Quotation | Source (paper / session / question / page) | Copied from | Tag |
|---|---|---|---|
| 5.1.5 outcome text | Syllabus 2025–2027, p.23 | `cloud-inputs/003/standards/SYLLABUS-9700-DETAIL.md` | syllabus wording |
| “Detail is not required.” | Cambridge Learner Guide, PDF p15 (outline annotation) | `work/007/VERIFIED-EVIDENCE.md` A01 | PDF-VERIFIED (plan check) |
| "Stem cells appear in a supplementary C1 item, not a detailed therapeutic explanation here." | G05 gate criteria, *Revision-note coverage* paragraph | `cloud-inputs/007/evidence/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md` | G05's summary (not Cambridge wording) |
| (no quotation) w22_13 Q20, key B; demand: basal skin stem cells plus Golgi | [9700/13 November 2022 Q20, QP pp9–11 / MS p2](/home/dachu/sme-9700-archive/pastpapers/2022/November/9700_w22_ms_13.pdf#page=2) | `work/007/VERIFIED-EVIDENCE.md` A09; `plan/topic-05/TOPIC-05-WEIGHTS.md` S-B | PDF-VERIFIED (plan check), key and demand only |
| (no quotation) 1.2.1 Golgi body, for the recall tag | Syllabus p.15 | `cloud-inputs/003/standards/SYLLABUS-9700-DETAIL.md` | syllabus wording, not quoted |

Not used: s22_12 Q18 (stem cells only as telomere context; it does not assess replacement or repair, plan §5.1.5); s23_21 Q1(a)(i) (a plant **stem** cell versus leaf mesophyll, not an undifferentiated stem cell; plan SF7, EXAMINER-INSIGHT).

**UNVERIFIED — needed before narration or on-screen use:**
1. `UNVERIFIED — w22_13 Q20 stem and options verbatim` (Beat 8 shows only *our framing of the demand*; no option is described).
2. `UNVERIFIED — a citable source for the typical human red-cell lifespan (about four months), if the checker requires one beyond the plan` (Beat 5 small type says *context, not a marking point*).

---

## Word count and runtime

Counted by the validator over the blockquoted narration. Seconds = words ÷ 120 × 60.

| Beat | Kind | Words | Seconds |
|---|---|---:|---:|
| 1 Hook and context | teaching | 67 | 33.5 |
| 2 Objectives | teaching | 43 | 21.5 |
| 3 Recall: what mitosis gives | teaching | 58 | 29 |
| 4 What makes a cell a stem cell | teaching | 86 | 43 |
| 5 Bone marrow to red blood cell | teaching | 68 | 34 |
| 6 Skin, a graze, two separate steps | teaching | 77 | 38.5 |
| 7 Recap | teaching | 58 | 29 |
| 8 Exam close | teaching | 74 | 37 |
| **Teaching (8 beats)** | | **531** | **4:25.5** |
| **Error (0 beats)** | | **0** | **0:00** |
| **Total (8 beats)** | | **531** | **4:25.5** |
| Budget | | 540 | 4:30 |

**Length, honestly:** **531 words, 4:25.5** (after the conductor's review edit to Beat 4's handle sentence), which is **9 words (4.5 s) under** the 4:30 budget (540 words), inside ±5 % (513–567 words). No overrun, so no cut list is needed. The plan's optional sentence on adult stem cells producing a limited range of cell types was left out to hold the budget; if a checker wants it back, it costs about 14 words (7 s) and could be paid for by cutting Beat 1's *Your blood carries vast numbers of them,* (6 words) and Beat 8's *from cell structure,* (3 words), leaving about 536 words.

---

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| Why mitosis gives identical cells (replication in S, sister separation); the four contexts in full; asexual reproduction | 5.1.2 (recalled by label in Beat 3), 5.1.3, 5.2.1 |
| Stage-by-stage chromosome behaviour | 5.2.1 (miniature replay only) |
| Uncontrolled division, mutation, tumours | 5.1.6 |
| Telomere maintenance in stem cells (s22_12 Q18 context) | 5.1.4 (not raised here) |
| Potency terms (totipotent, pluripotent, multipotent), embryonic stem cells, therapy and ethics, gene-expression mechanism of differentiation, named intermediate cell types, red-cell breakdown site | not in the outcome (plan scope ceiling; calibration §5) |
| Golgi body structure and function | Topic 1 (1.2.1), recalled as an icon in Beat 8 only |

## Reusable models established here

| Model | For |
|---|---|
| **`StemCellLineage`** (`marrow`, `dividing`, `self-renew`, `differentiating`, `released`, `skin`, `graze`; captioned *one possible pattern*) | the 5.1.5 notes; available to 5.1.6 if it wants a normal-renewal reference before its `TissueGrowthModel` (not required by the plan) |
| **The boxed sentence** *a stem cell divides by mitosis, and some of its daughter cells differentiate into specialised cells* | the 5.1.5 notes and checkpoints |

## Assets

| Asset | Status | Source |
|---|---|---|
| `MitosisCellModel` animal (`anaphase`, `telophase`, `cytokinesis`) and its count strip; `ChromosomeModel` 2n = 4 set | reuse | 5.2.1; 5.1.1 |
| 5.1.2 context strip (replacement, repair panels) | reuse by label | 5.1.2 |
| `StemCellLineage` (marrow niche, stem cell, intermediates, nucleus loss, red cell, skin strip, graze) | **new**, schematic | authored |
| Blood-vessel segment with flowing red cells (hook, exam close) | new, schematic | authored |
| Objective pictograms; plant-stem handle icon; Golgi-body line icon | new, flat icons | authored |
| Forms surface; reject card | shared | existing |
| Photographs, micrographs, Cambridge artwork, generated images | none | — |

---

## Validator run

`python3 work/007/validate_storyboard.py storyboards/topic-05/5.1.5/STORYBOARD.md`

```
beat  words  cues maxgap  status
   1     67     7     17  ok  
   2     43     4     12  ok  
   3     58     9     15  ok  
   4     86    10     15  ok  
   5     68    11     12  ok  
   6     77    13     12  ok  
   7     58     9      9  ok  
   8     74    11     15  ok  
TOTAL words 531  cues 74  runtime at 120 wpm 4:25.5  beats 8  failing beats 0
```

`python3 work/007/check_quotes.py storyboards/topic-05/5.1.5/STORYBOARD.md`

```
quotes checked 3  not found 0
```

Both re-run after pasting; outputs unchanged. No error beats, so no talk-through rows.
