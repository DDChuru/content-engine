# 4.1.1-2 — Fluid mosaic membranes: how the bilayer forms and what sits in it

**STATUS: CLEARED** — independent checks, cloud run 006 (cleared in round 2 (confirmed final in round 3); `cloud-checks/006/round-3/README.md`: FINAL), 27 September 2026. Narration frozen for build.

**Storyboard, first draft. Cloud run 006, 27 September 2026.** No audio, no code, no render. Folder `storyboards/topic-04/4.1.1-2/`.
Cambridge 9700 syllabus 2025–2027, p.21. Command word **DESCRIBE** (both outcomes). Budget from `TOPIC-PLAN-04-MEMBRANES.md` (§4.1.1, §4.1.2, lesson list, words-and-runtime table) and `TOPIC-04-WEIGHTS.md` (4.1.1 and 4.1.2 rows): **9:00 = teaching 9:00 (4.1.1 5:00 + 4.1.2 4:00) + no error allowance; 13 teaching beats (4.1.1 7 + 4.1.2 6); 0 error beats**; about 1,080 words at the timing equivalent. Delivered here as **13 beats (13 teaching, 0 error)**. Exposure in the cited blocks: 4.1.1 0/5; 4.1.2 1/5 (M24/22 Q1(a)(ii), 1 mark). Runtime estimated at **120 words per minute of final video** (words ÷ 120 = minutes).

> **4.1.1** describe the fluid mosaic model of membrane structure with reference to the hydrophobic and hydrophilic interactions that account for the formation of the phospholipid bilayer and the arrangement of proteins
>
> **4.1.2** describe the arrangement of cholesterol, glycolipids and glycoproteins in cell surface membranes

(syllabus p.21, both outcomes)

**Authorities read, in full:** `work/006/SHARED-SPECS.md` (binding); `work/006/AGENT-BRIEF.md`; `plan/topic-04/TOPIC-PLAN-04-MEMBRANES.md` (scope and authoring rules, §4.1.1, §4.1.2, the lesson list and build order, the shared-model table, words-and-runtime table, the traps table, the UNVERIFIED register, PLAN-CHECK RESPONSE); `plan/topic-04/TOPIC-04-WEIGHTS.md` (4.1.1 and 4.1.2 rows and paragraphs, ledger row M24/22 Q1(a)(ii) and the excluded Q1(a)(i), error register and evidence gaps); `cloud-inputs/003/standards/VIDEO-STRUCTURE.md` (all); `CONTENT-ARCHITECTURE.md`; `SYLLABUS-9700-DETAIL.md` (Topic 4 outcomes and the Topic 4 introduction, p.21; 2.2.11 phospholipid recall, p.18; apparatus p.57 and materials p.58, none used here; mathematical requirements p.63, none used here); the cleared examples `cloud-inputs/006/examples/3.1.3/STORYBOARD.md` and `3.2.1b/STORYBOARD.md`; `cloud-inputs/003/topic-03/3.1.1-2/CHECK.md` and `3.2.2-3/CHECK.md`; the plan check `cloud-checks/006/plan/CHECK.md` on `origin/cloud/006-checks` (outcome rulings for 4.1.1 and 4.1.2, the M24/22 Q1(a) split, the exact exam-close sentence, should-fixes 1, 2, 3 and 6); `cloud-inputs/006/evidence/` G04 and `EXAMINER-INSIGHT-9700.md` (neither holds a 4.1.1 or 4.1.2 quotation) and `COMPLEXITY-CALIBRATION-9700-BIOLOGY.md` §4. **No question paper, mark scheme or examiner report PDF was opened for this draft.** No exam wording is quoted in this lesson; the only quotations are syllabus text. (Round 1 independent storyboard check then verified the M24/22 QP p.3 and MS p.5 PDFs; its findings are recorded in *Citations* and the UNVERIFIED list.)

**Build position:** first of the ten Topic 4 lessons: **4.1.1-2** → 4.1.3 → 4.1.4 → 4.2.1a → 4.2.1b → 4.2.6 → 4.2.2a → 4.2.2b → 4.2.3-4 → 4.2.5. Every later lesson reuses the membrane published here.

**Models used:** none from earlier Topic 4 lessons (this is the first). Recalled by label only: Topic 2 phospholipid structure (2.2.11) and the Topic 2 hydrogen-bond drawing convention (dashed line between water and a polar group). A schematic red-blood-cell outline appears as a context drawing in Beats 1, 5 and 13 (our authored outline; 4.2.6's `CellOsmosisSet` `rbc-normal` is not yet built and is not claimed here).

**Models published here:** `PhospholipidToken`; `FluidMosaicMembrane` with **all** component layers (`glycolipid`, `intrinsic-channel`, `cholesterol`, `receptor-glycoprotein`, `intrinsic-carrier`, `glycoprotein`, `extrinsic`), states `assemble`, `full`, `highlight:<id>`; `WaterField`. All exactly as SHARED-SPECS §4. Everything drawn is a **MODEL** captioned *schematic; not to scale*; particle fields carry *particles drawn schematically; not to scale; far fewer than real*.

---

## The causal spine

One idea carries the lesson: **each part of each membrane molecule ends up where it interacts best with its surroundings.** The phospholipid bilayer, the placing of proteins, and the placing of cholesterol, glycolipids and glycoproteins are all read from that one rule.

> **A phospholipid has a hydrophilic, phosphate-containing head and two hydrophobic fatty-acid tails. In water, the heads interact with water (including hydrogen bonds), while the non-polar tails are excluded from water and held together by hydrophobic interactions; with water on both sides of a cell's boundary, the arrangement in which each part interacts best is a bilayer, heads facing the water on both sides and tails facing each other in a hydrophobic core. Intrinsic proteins are embedded in the bilayer, hydrophobic regions against the tails and hydrophilic regions in the water; the channel, carrier and receptor examples drawn here span it and are transmembrane proteins. Extrinsic proteins sit on a surface. Phospholipids and many proteins drift sideways (fluid); proteins are scattered through the bilayer (mosaic). In animal cell surface membranes, cholesterol sits among the phospholipids in both layers, its polar OH group level with the heads and its non-polar rings among the tails; glycolipids have their lipid part in the outer layer and glycolipids and glycoproteins carry hydrophilic carbohydrate chains that project from the external surface.**

**What the mark schemes credit, quoted:** nothing is quoted. **No directly relevant full 4.1.1 question has been verified in the cited blocks** (plan check: 4.1.1 0/5; `UNVERIFIED — a marked 4.1.1 question`). For 4.1.2 the one cited part is [M24/22 Q1(a)(ii), 1 mark, QP p.3 / MS p.5]: **cholesterol orientation through polar/non-polar interactions** (the plan check's description, used as our paraphrase; the scheme's wording is not shown in quotation marks or on an MS card; it was checked against MS p.5 by the round 1 independent storyboard check, which found "any one from" polar/non-polar alternatives, so one valid link earns the mark). **Plan check, exact:** "4.1.1-2 closes with M24/22 Q1(a)(ii), QP p.3 / MS p.5, on cholesterol orientation. This validates the 4.1.2 portion; it is not a full fluid-mosaic-model question." (This is the plan check's instruction to authors, not exam wording.) The syllabus supplies the rest of the spine: [p.21] "hydrophobic and hydrophilic interactions that account for the formation of the phospholipid bilayer and the arrangement of proteins"; [p.18, 2.2.11, recall] "hydrophilic (polar) phosphate heads and hydrophobic (non-polar) fatty acid tails". So the spine is what the syllabus asks to be described and what the one cited mark credits: the interactions that form the bilayer, where proteins sit and why, and cholesterol's polar end with the heads and non-polar part among the tails.

**The handle:** *heads to the water, tails to each other.* A retrieval phrase, not a picture that could be written as biology. Converted at once, in Beat 5: *phospholipids form a bilayer because their hydrophilic heads interact with water on both sides, while their hydrophobic tails are excluded from water and held together by hydrophobic interactions.* The handle is spoken as "a memory aid, not an exam answer".

**Typicality rules applied.** Cholesterol is placed "in animal cell surface membranes", never "in all membranes". Intrinsic proteins are "embedded in the bilayer"; only "the ones drawn here" are said to span it (should-fix 1); "intrinsic" is never used as a synonym for "transmembrane". "Many of the proteins drift", not all. Carbohydrate chains are said to face outwards "in a cell surface membrane" and, in Beat 11, "every carbohydrate chain in it" refers to our drawn membrane. Hydrophilicity is given as the reason a chain stays out of the core, **not** as the reason chains face the outside rather than the cytoplasm (both are watery; no cause for that sidedness is asserted). "Not every membrane protein carries a chain", and the receptor is called "this receptor", not "glycoproteins are receptors". The bilayer is "the arrangement in which each part interacts best" (the plan's framing), and the tails are "excluded" and "held together by hydrophobic interactions", never "hating" or "afraid of" water. "Here, each molecule stays in its own layer" bounds the no-flip-flop drawing to our model. No membrane thickness figure is given ("two layers of molecules" is the bilayer's structure, not a measurement).

**Error beats:** none. The plan and weights allocate **no error beat** to 4.1.1 or 4.1.2 ("none selected; the absence of an allocated beat is not an absence of evidence"). No COMMON MISTAKE or EXAM CONTRAST badge appears anywhere in this lesson. Beat 13's reject card is captioned as **our wording contrast; not a mark-scheme reject line**.

---

## The models, specified once

Orientation fixed across the topic: **outside the cell at the top, cytoplasm at the bottom**. Colour roles (the builder maps them to the house palette; the same role is always the same colour): phospholipid head **warm amber**; tails **mid grey**; proteins **teal**; cholesterol **ochre**; carbohydrate chains **green bead chains**; water tokens **small pale blue circles**. Labels are SVG text nodes. No terracotta error treatment is used in this lesson.

### `PhospholipidToken` (published here; every membrane frame in Topic 4)

Round head + two tails (one straight, one with a single kink). First-use labels *hydrophilic head (phosphate-containing)*, *hydrophobic fatty-acid tails*; tag `recall: Topic 2 lipids`. **In the assembled membrane, heads face the aqueous surroundings and tails face the hydrophobic interior. Before assembly, isolated tokens may have tails exposed to water; show this as the initial dispersed schematic, not a stable membrane arrangement. During assembly, tail exposure decreases as the tokens cluster and form the bilayer. No phospholipid crosses from one established leaflet to the other.** In Beat 3 only, the single token is shown large with recall labels *phosphate group* on the head and *glycerol* at the head–tail junction (small type, recall of 2.2.11; the glycerol label is recall only and is not narrated; M24/22 Q1(a)(i), glycerol, is a Topic 2 prerequisite, not taught here). Hydrogen bonds between water tokens and the head are drawn in the Topic 2 convention: short dashed lines, labelled once *hydrogen bond*. Caption *schematic; not to scale*.

### `FluidMosaicMembrane` (published here with all component layers; reused by 4.1.3, 4.1.4, 4.2.1a, 4.2.1b, 4.2.2a, 4.2.2b, 4.2.6)

Bilayer section, **12 phospholipids per leaflet visible**. Component ids and positions (left → right):
- `glycolipid`: outer leaflet, position 2. Draw a schematic lipid anchor with two hydrophobic tails and a small neutral-coloured attachment node carrying the four-bead green carbohydrate chain. Do not reuse the amber phosphate-head glyph or add a phosphate/glycerol label. Label the anchor *lipid part (schematic)* and the green chain *carbohydrate chain*. No molecular backbone or additional lipid chemistry is taught. The **carbohydrate chain of 4 beads** sits **above the surface**. This geometry is published for downstream reuse, including 4.1.3.
- `intrinsic-channel`: spanning, positions 4–5; central pore **lined by hydrophilic R groups, drawn as a light core**.
- `cholesterol`: **one in each leaflet at positions 6 and 7**, OH end at head level, ring among tails (read here as: outer leaflet at position 6, inner leaflet at position 7; see *Plan interpretations*). Drawn as a small ochre OH knob (label *OH (hydroxyl) group, polar*) on a flat four-ring plate with a short tail (label *ring structure, non-polar*).
- `receptor-glycoprotein`: spanning, positions 8–9; **binding site cup on the outer face** (label **binding site**, never "active site"), **carbohydrate chain of 3 beads beside it**.
- `intrinsic-carrier`: spanning, positions 10–11; a **binding-site notch facing outside** in its rest state (unlabelled in this lesson; its role and states are 4.1.3's and 4.2.1a's).
- `glycoprotein`: spanning, position 12; **chain of 5 beads**.
- `extrinsic`: on the **cytoplasmic face under positions 3–4**, in contact with the heads at position 3 and the lower end of `intrinsic-channel`.

Region labels *outside the cell (watery)*, *cytoplasm (watery)*, *hydrophobic core*. Caption *schematic; not to scale*.

Positions are ordinal slots counted left to right along the section in the `full` state; phospholipids pack between the components so that 12 phospholipids per leaflet remain visible in every state (the section is drawn wide enough for this; its side edges are cut edges of a larger membrane).

**States:**
- `assemble`: scattered `PhospholipidToken`s in a `WaterField` **drift into the bilayer over ~3 s (motion)**: each token rotates as it moves so its head stays towards water and its tails turn away from water; tails come together; the final frame is a bilayer of 12 per leaflet, heads to the water above and below, tails meeting in the middle. No micelle is formed or labelled. No token ever passes with its tails leading into open water after joining. Orientation invariant (as for `PhospholipidToken`): In the assembled membrane, heads face the aqueous surroundings and tails face the hydrophobic interior. Before assembly, isolated tokens may have tails exposed to water; show this as the initial dispersed schematic, not a stable membrane arrangement. During assembly, tail exposure decreases as the tokens cluster and form the bilayer. No phospholipid crosses from one established leaflet to the other.
- `full`: every component in place (with all chains).
- `highlight:<id>`: the component brightens; others dim to 50%.

**Layer reveals (this lesson's build sequence, not new states):** Beat 4 ends on the bilayer only; Beat 6 inserts `intrinsic-channel`, `receptor-glycoprotein` (protein part, chain hidden), `intrinsic-carrier` and `extrinsic`, each drifting in sideways from the section edge and seating (motion; phospholipids part to make room and close up round it); Beat 8 inserts `cholesterol` (both leaflets); Beat 9 inserts `glycolipid`; Beat 10 inserts `glycoprotein` (position 12) and reveals the receptor's 3-bead chain. After Beat 10 the model is in `full`. Model-contract caption, shown in small type while components are entering (Beats 6, 8, 9, 10): *Components enter progressively to build the explanatory drawing; this is not a depiction of cellular membrane synthesis or protein insertion machinery.* Nothing is ever inserted by crossing from one leaflet to the other; the inner cholesterol drifts in along the inner leaflet from the section's edge.

**Motion contract:** phospholipids jitter and drift sideways (**≤ 1 token width per 2 s**; schematic motion, not a measured rate); proteins drift more slowly; **nothing crosses between leaflets** (no flip-flop); **chains stay on the external face**. Water tokens above and below keep random motion (`WaterField`). Every frame of the assembled membrane (from the end of `assemble` onward): heads to water, tails inward, carbohydrate chains above the outer surface; before and during assembly the orientation invariant under `PhospholipidToken` applies.

**Annotation overlays used in this lesson (drawn on the model; not model states):** `R-group bands` (Beat 6): on each spanning protein, a band across the middle third level with the tails, labelled *hydrophobic R groups*, and top and bottom bands in the water, labelled *hydrophilic R groups*; on `intrinsic-channel`, the light core is additionally labelled *pore lined by hydrophilic R groups*. `polarity tags` (Beats 8, 13): *polar* on cholesterol's OH knob and on the phospholipid heads; *non-polar* on its ring plate and on the tails. Both overlays fade when their beat ends, except where a recap brings them back.

### `WaterField` (published here; `DiffusionField` is 4.2.1a's)

Water tokens (small pale blue circles) with random motion, including in this lesson short dashed hydrogen-bond lines flickering between neighbouring water tokens (Beats 3–4) to show water molecules bonding with each other. Caption *particles drawn schematically; not to scale; far fewer than real*. The field fills the space above and below the membrane in every membrane frame (the regions labelled *outside the cell (watery)* and *cytoplasm (watery)*); no water token is drawn inside the hydrophobic core.

---

## Beat by beat

Beat windows in the headings are provisional and follow the per-beat word ledger (words ÷ 120); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch over 30 words without a stated visual change. No timers, apparatus or handled material appear in this lesson.

### BEAT 1 · Hook and context · 0:00–0:44
**Narration:**
> Ever wondered why a cell doesn't simply mix into the water around it, when there's water inside it and water all around it? Take a red blood cell. Around it is plasma, a watery solution; inside it is cytoplasm, another watery solution, with different substances dissolved in each. Between the two sits the cell surface membrane, built on just two layers of molecules. It keeps the inside and the outside separate, and yet the cell still controls what crosses it. So why does it hold together in water?

**Visual action:**
1. **From the first frame**, a schematic red-blood-cell outline (face view, biconcave disc drawn in red, caption *schematic; not to scale*) sits in a field of drifting water tokens (`WaterField`); no labels yet. At *why a cell doesn't simply mix*, the hook question appears as a compact caption above the cell, never alone on the frame.
2. At *Take a red blood cell*, the cell is labelled **red blood cell** and drifts to centre.
3. At *Around it is plasma*, the surrounding field is tinted very pale and labelled **plasma (watery)**; water tokens keep moving.
4. At *inside it is cytoplasm*, a cut-away window opens in the cell showing water tokens inside, labelled **cytoplasm (watery)**.
5. At *different substances dissolved in each*, a few generic grey solute dots appear on each side, different in number and shape inside and out (no identities, tag *different dissolved substances*).
6. At *the cell surface membrane*, the cell's outline brightens and a magnifier circle opens on its edge, showing only a thin boundary band labelled **cell surface membrane** (structure not yet drawn).
7. At *two layers of molecules*, the band inside the magnifier splits faintly into two thin rows (no molecules drawn yet), tag *two layers*.
8. At *keeps the inside and the outside separate*, the water tokens inside and outside the magnified band are ringed on each side, tag *inside · outside*.
9. At *controls what crosses it*, one grey dot pauses at the band and a small question mark appears (no crossing is shown).
10. At *why does it hold together in water*, the question mark moves to the magnified band and the frame dissolves to the objectives surface, the cell shrinking to a corner thumbnail.

**On-screen text:** the hook question; *red blood cell*; *plasma (watery)*; *cytoplasm (watery)*; *cell surface membrane*; *two layers*; *schematic; not to scale*.

---

### BEAT 2 · What you will be able to do · 0:44–1:06
**Narration:**
> By the end you'll be able to describe how phospholipids arrange themselves into a bilayer, and which interactions make them do it; describe where proteins sit in that bilayer and why; and describe where cholesterol, glycolipids and glycoproteins sit in a cell surface membrane.

**Visual action:**
1. **From the first frame**, the objectives surface is on screen: its own styled background in a distinct colour, **not the lesson diagram**, with three flat authored pictograms waiting at the left edge (a mirrored pair of head-and-two-lines glyphs; a rounded block through a double band; a small ring glyph beside a short bead chain). The red-blood-cell thumbnail stays in the corner. Each line enters with motion beside its pictogram.
2. At *how phospholipids arrange themselves*, line 1 slides in beside the mirrored glyph pair; at *which interactions make them do it*, the word **interactions** in line 1 brightens.
3. At *where proteins sit in that bilayer*, line 2 slides in beside the block-through-band glyph.
4. At *where cholesterol, glycolipids and glycoproteins sit*, line 3 slides in beside the ring-and-bead-chain glyph.
   1. **DESCRIBE** how phospholipids form a bilayer, and the interactions responsible
   2. **DESCRIBE** where proteins sit in the bilayer, and why
   3. **DESCRIBE** where cholesterol, glycolipids and glycoproteins sit in a cell surface membrane

**On-screen text:** the three lines. Small type: *syllabus 4.1.1 and 4.1.2, "describe", p.21.*

---

### BEAT 3 · The phospholipid, recalled · 1:06–1:45
**Narration:**
> Start with the molecule the membrane is built from, which you met in the lipids lessons: the phospholipid. It has a head containing a phosphate group, which is polar and carries charge, and two fatty-acid tails, which are non-polar. Water molecules are polar too, so they're attracted to the head and form hydrogen bonds with it: the head is hydrophilic. The tails can't form those interactions with water, so they're hydrophobic. One molecule, two very different ends.

**Visual action:**
1. **From the first frame**, a small `WaterField` fills the frame with drifting water tokens and faint dashed hydrogen-bond lines flickering between neighbours; the corner thumbnail of the red blood cell stays. At *the phospholipid*, one `PhospholipidToken` drifts in large at centre, tag `recall: Topic 2 lipids`, caption *schematic; not to scale*.
2. At *a head containing a phosphate group*, the round amber head brightens, labelled **head** with small type *phosphate group*; the small recall label *glycerol* sits at the head–tail junction (not narrated).
3. At *polar and carries charge*, a small *polar* tag and a charge mark appear on the head.
4. At *two fatty-acid tails*, the two grey tails (one straight, one with a single kink) brighten, labelled **fatty-acid tails**; at the same moment a small *non-polar* tag attaches to them.
5. At *Water molecules are polar too*, three water tokens near the head are ringed, each with a tiny *polar* tag.
6. At *form hydrogen bonds with it*, the water tokens move in close to the head and dashed lines form between them and the head (motion), labelled once **hydrogen bond**; they keep jiggling while bonded, lines forming and breaking.
7. At *the head is hydrophilic*, the head label completes: **hydrophilic head (phosphate-containing)**.
8. At *The tails can't form those interactions*, water tokens near the tails jostle past them with no dashed lines to the tails; the dashed lines they do form are only with each other.
9. At *they're hydrophobic*, the tail label completes: **hydrophobic fatty-acid tails**.
10. At *two very different ends*, a bracket spans the token, **hydrophilic** at the head end and **hydrophobic** at the tail end.

**On-screen text:** *hydrophilic head (phosphate-containing)*; *hydrophobic fatty-acid tails*; *polar*; *non-polar*; *hydrogen bond*; `recall: Topic 2 lipids`. Small type: *syllabus 2.2.11, p.18: "hydrophilic (polar) phosphate heads and hydrophobic (non-polar) fatty acid tails"*; *particles drawn schematically; not to scale; far fewer than real*.

---

### BEAT 4 · Why a bilayer forms · 1:45–2:30
**Narration:**
> Now scatter lots of phospholipids through water and watch what happens. Water molecules keep forming hydrogen bonds with each other. The non-polar tails can't join in, so they're excluded from the water and come together, held there by hydrophobic interactions, while the heads stay in contact with the water. With water on both sides, the arrangement in which each part interacts best is two layers: heads facing the water outside and inside, tails facing each other in the middle. That's the phospholipid bilayer, and its middle is the hydrophobic core.

**Visual action:**
1. **From the first frame**, the `WaterField` fills the screen and the single `PhospholipidToken` from Beat 3 shrinks to normal size among the water tokens. At *scatter lots of phospholipids through water*, twenty-four tokens scatter through the field at random orientations (start of `assemble`), each jiggling.
2. At *hydrogen bonds with each other*, dashed lines flicker between neighbouring water tokens across the whole field (motion), tag *water–water hydrogen bonds*.
3. At *The non-polar tails can't join in*, three tails are ringed briefly, with no dashed lines to them.
4. At *excluded from the water and come together*, run `assemble` over about 3 seconds: tokens move and rotate into the two leaflets, ending with twelve phospholipids per leaflet, heads outward and tails inward. Continue the normal molecular jitter after completion; do not restart assembly at later cues.
5. At *held there by hydrophobic interactions*, the meeting region of the tails is bracketed, label **hydrophobic interactions**.
6. At *the heads stay in contact with the water*, dashed hydrogen-bond lines flicker between water tokens and the heads along both faces.
7. At *With water on both sides*, the field above is labelled **outside the cell (watery)** and the field below **cytoplasm (watery)**; the orientation lock is now set: outside at the top, cytoplasm at the bottom.
8. At *two layers*, bracket the two already-formed rows and reveal the tag *12 per layer (drawn section)*. This cue identifies the completed bilayer; it does not complete or replay assembly.
9. At *heads facing the water outside and inside*, both rows of heads brighten together.
10. At *tails facing each other in the middle*, the two sets of tails brighten where they meet.
11. At *the phospholipid bilayer*, the label **phospholipid bilayer** lands beside the section; caption *schematic; not to scale*.
12. At *the hydrophobic core*, the tail region is shaded faintly and labelled **hydrophobic core**; the phospholipids add their slow sideways drift (motion contract) to the ongoing jitter and keep it from here on.

**On-screen text:** *water–water hydrogen bonds*; *hydrophobic interactions*; *outside the cell (watery)*; *cytoplasm (watery)*; *phospholipid bilayer*; *hydrophobic core*; *12 per layer (drawn section)*; the two captions.

---

### BEAT 5 · Heads to the water, tails to each other · 2:30–3:19
**Narration:**
> Here's a way to hold on to it: heads to the water, tails to each other. That's a memory aid, not an exam answer. Written properly: phospholipids form a bilayer because their hydrophilic heads interact with water on both sides, while their hydrophobic tails are excluded from water and held together by hydrophobic interactions. And here's why that matters. A cell is a watery compartment in watery surroundings, like our red blood cell in plasma, and the bilayer keeps a water-based inside separate from a water-based outside. The proteins set into it let the cell control what crosses.

**Visual action:**
1. **From the first frame**, the bilayer from Beat 4 holds at centre, jittering sideways, with its region labels. At *heads to the water, tails to each other*, the phrase appears in small italics above the section, tag *handle*.
2. At *a memory aid, not an exam answer*, the handle phrase is boxed with the small tag *memory aid only*.
3. At *Written properly*, the sentence surface slides up beneath the bilayer.
4. At *their hydrophilic heads interact with water on both sides*, clause 1 builds: **Phospholipids form a bilayer because the hydrophilic heads interact with water on both sides**; both rows of heads pulse.
5. At *held together by hydrophobic interactions*, clause 2 builds: **while the hydrophobic tails are excluded from water and held together by hydrophobic interactions**; the core pulses. The connectives **because** and **while** are highlighted.
6. At *why that matters*, the red-blood-cell thumbnail returns and enlarges at left.
7. At *a watery compartment in watery surroundings*, the plasma and cytoplasm labels on the cell brighten.
8. At *our red blood cell in plasma*, a magnifier line links the cell's edge to the bilayer section: the bilayer's top label reads **outside the cell (watery): plasma** and its bottom label **cytoplasm (watery)**.
9. At *keeps a water-based inside separate*, the water tokens above and below the bilayer are ringed on each side; small type *framing: why a bilayer suits a cell*.
10. At *The proteins set into it*, three empty teal outlines appear as dashed placeholders across the bilayer, tag *next: proteins*.

**On-screen text:** the handle and *memory aid only*; the two-clause sentence; *outside the cell (watery): plasma*; *cytoplasm (watery)*; *framing: why a bilayer suits a cell*.

---

### BEAT 6 · Proteins, placed by the same logic · 3:19–4:06
**Narration:**
> Proteins sit in the bilayer by the same logic. Intrinsic proteins are embedded in the bilayer. The ones drawn here, a channel, a carrier and a receptor, span it: they're transmembrane proteins. Where a protein touches the tails, its surface has hydrophobic R groups; where it meets the water, above and below, it has hydrophilic R groups. This channel also has hydrophilic R groups lining a central pore; what that pore is for comes next lesson. Extrinsic proteins sit on one surface, here the cytoplasmic side, attached to phospholipid heads or to an intrinsic protein.

**Visual action:**
1. **From the first frame**, `FluidMosaicMembrane` (bilayer only) holds at centre with its region labels and the three dashed placeholders from Beat 5; the red-blood-cell thumbnail sits small at the corner. At *by the same logic*, the placeholders fade.
2. At *Intrinsic proteins are embedded*, the three spanning proteins drift in sideways from the section's edge and seat (motion; phospholipids part and close up around them): `intrinsic-channel` at positions 4–5, `receptor-glycoprotein` (protein part only; chain hidden) at 8–9, `intrinsic-carrier` at 10–11; label **intrinsic proteins: embedded in the bilayer**.
3. At *a channel, a carrier and a receptor*, each gets its name: **channel protein**, **carrier protein**, **receptor**; the receptor's outer cup is labelled **binding site** in small type.
4. At *they're transmembrane proteins*, a vertical bracket spans each of the three from outer to inner face, label **transmembrane (span the bilayer)**; small type *these examples span it; intrinsic does not always mean spanning*.
5. At *Where a protein touches the tails*, the `R-group bands` overlay draws the middle band on each spanning protein level with the core.
6. At *hydrophobic R groups*, the middle bands are labelled **hydrophobic R groups**; the adjacent tails pulse with them.
7. At *where it meets the water*, the top and bottom bands draw.
8. At *it has hydrophilic R groups*, those bands are labelled **hydrophilic R groups**; nearby water tokens flicker dashed lines to them.
9. At *lining a central pore*, the channel's light core brightens, label **pore lined by hydrophilic R groups**.
10. At *what that pore is for*, a small tag *role: 4.1.3* attaches to the channel.
11. At *Extrinsic proteins sit on one surface*, `extrinsic` drifts up from the cytoplasm and settles on the cytoplasmic face under positions 3–4, label **extrinsic protein: on a surface**.
12. At *the cytoplasmic side*, the **cytoplasm (watery)** label pulses.
13. At *attached to phospholipid heads or to an intrinsic protein*, two contact points are ringed: the heads at position 3 and the lower end of the channel. Proteins now drift sideways more slowly than the phospholipids (motion contract).

**On-screen text:** *intrinsic proteins: embedded in the bilayer*; *channel protein*, *carrier protein*, *receptor*, *binding site*; *transmembrane (span the bilayer)*; *these examples span it; intrinsic does not always mean spanning*; *hydrophobic R groups*; *hydrophilic R groups*; *pore lined by hydrophilic R groups*; *extrinsic protein: on a surface*; *role: 4.1.3*.

---

### BEAT 7 · Fluid, and mosaic · 4:06–4:49
**Narration:**
> Now the name: fluid mosaic. Fluid, because the phospholipids aren't fixed in place. They jiggle and drift sideways within their own layer, and many of the proteins drift too, more slowly. Here, each molecule stays in its own layer as it drifts. Mosaic, because proteins of different sizes and shapes are scattered through the bilayer, like tiles set in a mosaic. This model was introduced in nineteen seventy-two, and it's still being modified as understanding improves. It's a model of how the molecules are arranged.

**Visual action:**
1. **From the first frame**, `FluidMosaicMembrane` holds with the bilayer, the three spanning proteins and the extrinsic protein, all jittering. At *fluid mosaic*, the title words **fluid** and **mosaic** appear above the section, spaced apart.
2. At *aren't fixed in place*, the word **fluid** brightens; one phospholipid in the outer leaflet is tinted a slightly lighter amber as a tracer.
3. At *drift sideways within their own layer*, the tracer phospholipid drifts sideways along the outer leaflet (≤ 1 token width per 2 s, captioned *schematic lateral motion; not measured*), a faint trail behind it.
4. At *many of the proteins drift too, more slowly*, the receptor drifts a shorter distance, a shorter trail behind it.
5. At *each molecule stays in its own layer*, a thin dashed line runs along the middle of the core, tag *each stays in its own layer (in this model)*; the tracer stays in the outer leaflet.
6. At *Mosaic, because*, the trails fade and the word **mosaic** brightens.
7. At *different sizes and shapes*, the four proteins are outlined one after another.
8. At *like tiles set in a mosaic*, a small inset at the corner shows a scattered-tile pattern for one second, then the proteins pulse together in place, tag *proteins scattered through the bilayer*.
9. At *introduced in nineteen seventy-two*, a small syllabus tab slides in beneath the section: *syllabus p.21: "The fluid mosaic model, introduced in 1972, describes the way in which biological molecules are arranged to form cell membranes."*
10. At *still being modified*, the tab adds its next sentence: *"The model continues to be modified as understanding improves …"*.
11. At *a model of how the molecules are arranged*, the caption *schematic; not to scale* brightens under the section; the tracer's drift trail is gone and normal jitter continues.

**On-screen text:** *fluid*; *mosaic*; *each stays in its own layer (in this model)*; *proteins scattered through the bilayer*; the syllabus tab; *schematic lateral motion; not measured*.

---

### BEAT 8 · Cholesterol, among the phospholipids · 4:49–5:34
**Narration:**
> Now three more components, one at a time, starting with cholesterol. In animal cell surface membranes, cholesterol molecules sit among the phospholipids in both layers. Each has a small polar OH group, a hydroxyl group, at one end, and a rigid ring structure that is non-polar. The OH group sits level with the phospholipid heads, towards the water, while the rings lie among the tails in the hydrophobic core. It's the same logic again: the polar part with the polar heads and the water, the non-polar part with the non-polar tails.

**Visual action:**
1. **From the first frame**, `FluidMosaicMembrane` holds with the bilayer and the four proteins; a small component tray at the right edge shows three greyed icons (cholesterol, glycolipid, glycoprotein). At *starting with cholesterol*, the cholesterol icon lifts out of the tray.
2. At *In animal cell surface membranes*, the tag **animal cell surface membranes** appears beside the section.
3. At *in both layers*, two cholesterol molecules drift in sideways from the section's edge, one along the outer leaflet to position 6 and one along the inner leaflet to position 7 (motion; neither crosses the core), and seat among the phospholipids; label **cholesterol (in both layers)**.
4. At *a small polar OH group*, `highlight:cholesterol` (others dim to 50%); the ochre OH knob on each is labelled **OH (hydroxyl) group, polar**.
5. At *a rigid ring structure that is non-polar*, the ring plates are labelled **ring structure, non-polar**.
6. At *The OH group sits level with the phospholipid heads*, a thin horizontal guide runs along each row of heads, passing through each cholesterol's OH knob; tag *OH at head level, towards the water*.
7. At *the rings lie among the tails*, the ring plates and neighbouring tails brighten together inside the **hydrophobic core** label.
8. At *the same logic again*, the `polarity tags` overlay appears: *polar* on the heads and the OH knobs, *non-polar* on the tails and the ring plates.
9. At *the polar part with the polar heads*, the *polar* tags pulse together with the water tokens beside them.
10. At *the non-polar part with the non-polar tails*, the *non-polar* tags pulse together; `highlight` ends, all components back to full; small tag *role: 4.1.3*.

**On-screen text:** *animal cell surface membranes*; *cholesterol (in both layers)*; *OH (hydroxyl) group, polar*; *ring structure, non-polar*; *OH at head level, towards the water*; *polar* / *non-polar*; *role: 4.1.3*.

---

### BEAT 9 · Glycolipids · 5:34–6:12
**Narration:**
> Next, glycolipids. A glycolipid is a lipid with a carbohydrate chain attached. Its lipid part sits in the outer layer of the bilayer, among the phospholipids, with its tails in the core like theirs. Its carbohydrate chain projects from the outer surface into the watery surroundings outside the cell. Carbohydrate chains are hydrophilic, so this one stays out of the hydrophobic core, and in a cell surface membrane it faces outwards, not into the cytoplasm.

**Visual action:**
1. **From the first frame**, `FluidMosaicMembrane` holds with the bilayer, the four proteins and both cholesterols; the tray at the right shows two remaining greyed icons. At *Next, glycolipids*, the glycolipid icon lifts out of the tray.
2. At *a lipid with a carbohydrate chain attached*, a large single glycolipid appears beside the section. Draw a schematic lipid anchor with two hydrophobic tails and a small neutral-coloured attachment node carrying the four-bead green carbohydrate chain. Do not reuse the amber phosphate-head glyph or add a phosphate/glycerol label. Label the anchor *lipid part (schematic)* and the green chain *carbohydrate chain*. No molecular backbone or additional lipid chemistry is taught.
3. At *sits in the outer layer*, it shrinks to membrane scale and drifts in sideways along the outer leaflet to position 2 (motion), label **glycolipid (outer layer)**.
4. At *its tails in the core*, its tails brighten alongside the neighbouring phospholipid tails.
5. At *projects from the outer surface*, the 4-bead chain above the surface brightens and sways slightly in the water (motion), label **chain projects from the outer surface**.
6. At *Carbohydrate chains are hydrophilic*, small dashed hydrogen-bond lines flicker between the chain beads and nearby water tokens; tag *hydrophilic*.
7. At *stays out of the hydrophobic core*, the core is outlined and the chain's distance from it is bracketed.
8. At *not into the cytoplasm*, the **cytoplasm (watery)** label pulses and the empty inner face below the glycolipid is ringed; tag *cell surface membrane: chains on the outer face*.

**On-screen text:** *lipid part (schematic)*; *carbohydrate chain*; *glycolipid (outer layer)*; *chain projects from the outer surface*; *hydrophilic*; *cell surface membrane: chains on the outer face*.

---

### BEAT 10 · Glycoproteins · 6:12–6:52
**Narration:**
> Then glycoproteins: proteins with carbohydrate chains attached. Some of the proteins you've already placed are glycoproteins. This receptor carries a short chain beside its binding site, and this protein at the end carries a longer one. Their protein parts sit in the bilayer like the other membrane proteins, but their carbohydrate chains project from the outer surface into the watery surroundings, just like the glycolipid's. Not every membrane protein carries a chain: in our membrane, the channel and the carrier don't.

**Visual action:**
1. **From the first frame**, `FluidMosaicMembrane` holds with everything placed so far; the tray shows one remaining greyed icon. At *proteins with carbohydrate chains attached*, the glycoprotein icon lifts out of the tray.
2. At *Some of the proteins you've already placed*, the four existing proteins pulse once.
3. At *This receptor carries a short chain*, the receptor's **3-bead green chain** grows up from its outer face beside the **binding site** cup (reveal, motion); label **receptor-glycoprotein**.
4. At *this protein at the end carries a longer one*, `glycoprotein` drifts in sideways from the section's edge and seats spanning the bilayer at position 12, its **5-bead chain** above the surface; label **glycoprotein**. The model is now in `full`.
5. At *Their protein parts sit in the bilayer*, the protein bodies of both glycoproteins brighten, with the `R-group bands` overlay briefly returning on them.
6. At *project from the outer surface*, both chains brighten above the surface and sway slightly (motion), label **chains project from the outer surface**.
7. At *just like the glycolipid's*, the glycolipid's 4-bead chain brightens with them: three chains, all above the outer face.
8. At *Not every membrane protein carries a chain*, `highlight:intrinsic-channel` then `highlight:intrinsic-carrier` in turn, each shown with no chain; tag *no chain on these two (in our membrane)*.
9. At *the channel and the carrier don't*, highlight ends; small tags *roles: 4.1.3* on the receptor and the glycoprotein.

**On-screen text:** *receptor-glycoprotein*; *binding site*; *glycoprotein*; *chains project from the outer surface*; *no chain on these two (in our membrane)*; *roles: 4.1.3*.

---

### BEAT 11 · The whole membrane, and a description to write · 6:52–7:32
**Narration:**
> Step back and look at the whole membrane. Every carbohydrate chain in it, on the glycolipid and on both glycoproteins, is on the top face, outside the cell; none faces the cytoplasm. Cholesterol is in both layers, but the glycolipid is in the outer layer. As a description you could write: cholesterol sits between the phospholipids in both layers, its OH group towards the heads; glycolipids and glycoproteins have carbohydrate chains that project from the outer surface of the membrane.

**Visual action:**
1. **From the first frame**, `FluidMosaicMembrane` in `full`, drifting gently, with all region labels. At *look at the whole membrane*, the view widens slightly so the whole section, water above and below, fills the frame.
2. At *Every carbohydrate chain in it*, the three chains (4, 3 and 5 beads) brighten in turn, left to right.
3. At *on the top face, outside the cell*, the **outside the cell (watery)** label brightens with them.
4. At *none faces the cytoplasm*, the cytoplasmic face is traced once along its length, tag *no chains on this face*.
5. At *Cholesterol is in both layers*, the two cholesterols are ringed, one per leaflet.
6. At *the glycolipid is in the outer layer*, the glycolipid is ringed; the outer leaflet brightens; then the outer and cytoplasmic faces are tinted differently for two seconds, tags **outer face** and **cytoplasmic face** (the two faces carry different components).
7. At *As a description you could write*, the sentence surface slides up beneath the section.
8. At *its OH group towards the heads*, clause 1 builds: **Cholesterol sits between the phospholipids in both layers, OH group towards the phospholipid heads**; the cholesterols pulse.
9. At *project from the outer surface of the membrane*, clause 2 builds: **glycolipids and glycoproteins have carbohydrate chains that project from the outer surface of the membrane**; the three chains pulse.

**On-screen text:** *no chains on this face*; *outer face*; *cytoplasmic face*; the two-clause description.

---

### BEAT 12 · What I told you, on the membrane · 7:32–8:21
**Narration:**
> So here's what I told you, on the membrane you watched being built. Phospholipids form a bilayer: hydrophilic heads interact with the water on both sides, and hydrophobic tails are held together in the core. Intrinsic proteins are embedded in it, with hydrophobic R groups against the tails; the four spanning proteins drawn here are transmembrane proteins. An extrinsic protein sits on a surface. Phospholipids and many membrane proteins can move sideways: fluid. Proteins scattered through it: mosaic. Cholesterol sits in both layers, OH towards the heads, and glycolipids and glycoproteins carry their chains on the outer face.

**Visual action:** **No new slide.** The screen returns to the membrane the student watched being built: `FluidMosaicMembrane` in `full`, water above and below, region labels in place. Static (the jitter pauses for the recap). Key points fade in in place:
1. **From the first frame**, `FluidMosaicMembrane` in `full` holds, still. At *on the membrane you watched being built*, the whole section settles; nothing moves.
2. At *Phospholipids form a bilayer*, both rows of heads brighten with tag **hydrophilic heads: interact with water on both sides**.
3. At *hydrophobic tails are held together in the core*, the core brightens with tag **hydrophobic tails: held together by hydrophobic interactions**.
4. At *Intrinsic proteins are embedded in it*, highlight all four spanning proteins and their hydrophobic middle regions.
5. At *the four spanning proteins drawn here*, bracket the channel, carrier, receptor-glycoprotein and separate glycoprotein.
6. At *An extrinsic protein sits on a surface*, highlight the cytoplasmic extrinsic protein.
7. At *can move sideways: fluid*, show the static lateral arrows.
8. At *scattered through it: mosaic*, outline all five proteins. Keep the recap still, with annotations fading in on the familiar model.
9. At *Cholesterol sits in both layers*, the two cholesterols brighten, the head-level guide returns through their OH knobs.
10. At *carry their chains on the outer face*, the three chains brighten above the outer face, tag **carbohydrate chains: outer face only (cell surface membrane)**.

---

### BEAT 13 · How it is asked, the reject card, and the red blood cell · 8:21–9:15
**Narration:**
> How does this reach you? In March twenty twenty-four, Paper twenty-two gave one mark for how cholesterol is orientated in the membrane, linked to its polar and non-polar parts. That question checks the cholesterol part of this lesson, not the whole model. For the rest, the syllabus asks you to describe the bilayer, the interactions that form it and where the proteins sit. The reject card: the OH group sits level with the heads, towards the water. And the red blood cell in its plasma? Its membrane holds together because its phospholipids sit where each part interacts best: heads with the water, tails together in the core.

**Visual action:**
1. **From the first frame**, the familiar lesson layout stays on screen at right (reduced): `FluidMosaicMembrane` in `full` with its region labels and the Beat 12 tags dimmed; a compact forms surface opens at left beside it. At *How does this reach you?*, the forms surface header appears: **How it is asked**.
2. At *In March twenty twenty-four, Paper twenty-two*, row 1 lands: **cholesterol's orientation in the membrane** · *M24/22 Q1(a)(ii), 1 mark, QP p.3 / MS p.5*; `highlight:cholesterol` on the membrane.
3. At *linked to its polar and non-polar parts*, small type under row 1: *Our paraphrase of M24/22 Q1(a)(ii): one valid link between a cholesterol region's polarity and its position earns the available mark. Scheme wording checked against MS p.5.*; the `polarity tags` overlay returns on the cholesterols and heads.
4. At *checks the cholesterol part of this lesson*, row 1 gains the tag *validates the 4.1.2 portion only; not a full fluid-mosaic-model question*.
5. At *the syllabus asks you to describe*, row 2 lands: **describe the fluid mosaic model: bilayer, interactions, proteins** · *syllabus-based (4.1.1, "describe", p.21); no marked 4.1.1 question in the papers cited for this topic*; highlight ends and the heads, core and proteins brighten in turn.
6. At *The reject card*, the reject card lands beside the membrane, struck through by hand: **✗ the OH group of cholesterol points into the hydrophobic core** / **✓ the OH group of cholesterol sits level with the phospholipid heads, towards the water; its rings lie among the tails**, caption in small type *our wording contrast; not a mark-scheme reject line*.
7. At *the red blood cell in its plasma*, the Beat 1 red-blood-cell outline returns small at the bottom, its magnifier now showing the bilayer section from this lesson, labelled **plasma** above and **cytoplasm** below.
8. At *sit where each part interacts best*, the heads inside the magnifier brighten on both faces, then the core.
9. At *tails together in the core*, the hook question caption returns beside the cell with a tick. Final frame held 2 s (scheduled after the narration ends, 9:14.5–9:16.5; not included in the words ÷ 120 runtime): forms at left, the membrane and reject card at right, the red blood cell beneath. No slogan.

**On-screen text:** the header; the two form rows with citations and tags; the reject card and its caption; *plasma*; *cytoplasm*; the hook question with its tick.

---

## Datasets

**None.** This lesson has no measured, calculated, supplied or illustrative data. The only numbers on screen are model-geometry specifications, stated as such, not data:

| Item | Value | Status | Beat(s) |
|---|---|---|---|
| Phospholipids per leaflet in the drawn section | 12 (24 in `assemble`) | drawing specification (SHARED-SPECS §4); tag *12 per layer (drawn section)* | 4, 6–13 |
| Carbohydrate chain lengths | glycolipid 4 beads; receptor-glycoprotein 3 beads; glycoprotein 5 beads | drawing specification; no biological chain length implied | 9, 10, 11 |
| Sideways drift | ≤ 1 token width per 2 s | schematic motion, not a measured rate; captioned *schematic lateral motion; not measured* (Beat 7); no time compression applied | 4–11 |
| `assemble` duration | ~3 s | animation timing, not a measured self-assembly time | 4 |
| "1972" | syllabus p.21 introduction | quoted syllabus fact | 7 |

Arithmetic check on the section occupancy (for the builder, not narrated): outer leaflet slots used by components = glycolipid 1 (position 2) + channel 2 (4–5) + cholesterol 1 (6) + receptor 2 (8–9) + carrier 2 (10–11) + glycoprotein 1 (12) = 9 component slots; inner leaflet = channel 2 + cholesterol 1 (7) + receptor 2 + carrier 2 + glycoprotein 1 = 8 component slots. With 12 phospholipids per leaflet also visible, the outer leaflet of the `full` section holds 12 + 9 = 21 slot-widths and the inner leaflet 12 + 8 = 20; the inner leaflet's phospholipids are spaced very slightly wider so both leaflets span the same width (the one-slot difference is the glycolipid, which is outer-leaflet only). No timers, no apparatus, no measured quantities.

---

## Real-world samples

| Material | What the method responds to | Fit (range, clarity) | Interferences and how the method handles them | Beats |
|---|---|---|---|---|
| **none handled** | — (no method or readout in this lesson) | — | — | — |

No real material is handled in this lesson: there is no investigation, apparatus, reagent or sample. **Explain-beat real-world example:** the membrane drawn is identified as the **cell surface membrane of a red blood cell**, so "outside" is **plasma** and "inside" is **cytoplasm**, both labelled (Beats 1, 5, 13; the plan's named example). It is shown as a schematic drawing, not a handled sample or a micrograph, so the REAL-WORLD statement (what the method responds to, and fit) has no method to apply to. No exam-question beat in this lesson adds a real-world extra, so no *beyond the mark scheme* panel is needed.

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.21) | Beat(s) | How |
|---|---|---|
| 4.1.1 describe the fluid mosaic model of membrane structure | 6, 7, 12 | "fluid" (lateral drift, motion) and "mosaic" (scattered proteins); the model's 1972 origin and continued modification (syllabus introduction) said once |
| … hydrophobic and hydrophilic interactions … | 3, 4, 5 | head–water hydrogen bonds; water–water hydrogen bonds excluding the tails; hydrophobic interactions holding the tails together |
| … that account for the formation of the phospholipid bilayer | 4, 5, 12 | `assemble` motion in a `WaterField`; handle converted at once into the creditworthy sentence |
| … and the arrangement of proteins | 6, 12 | intrinsic (embedded; the three Beat 6 examples transmembrane at that build stage; in the completed model, recapped in Beat 12, all four spanning proteins are transmembrane, plus one extrinsic protein) with hydrophobic and hydrophilic R-group regions; channel pore lined by hydrophilic R groups; extrinsic on a surface |
| 4.1.2 describe the arrangement of cholesterol | 8, 11, 12, 13 | both leaflets; OH at head level; rings among tails; "in animal cell surface membranes" |
| … glycolipids | 9, 11, 12 | lipid part in the outer leaflet; carbohydrate chain projecting from the external surface |
| … and glycoproteins in cell surface membranes | 10, 11, 12 | chains projecting from the external surface; not every protein carries a chain |
| Topic 4 introduction (p.21), 1972 and "continues to be modified" | 7 | syllabus tab, said once |
| 2.2.11 (p.18), phospholipid structure | 3 | recall by label only |
| Framing: why the mechanism exists | 1, 5, 13 | a watery compartment in watery surroundings; the bilayer keeps a water-based inside separate from a water-based outside; callback |

### Mark-scheme and examiner points → beats

| Source | Point | Beat |
|---|---|---|
| M24/22 Q1(a)(ii), 1 mark, QP p.3 / MS p.5 | cholesterol orientation through polar/non-polar interactions (plan-check description, our paraphrase; MS wording not quoted) | 8 (taught), 11 (description), 13 (exam close) |
| M24/22 Q1(a)(i), glycerol | Topic 2 prerequisite; not taught (a recall label on the Beat 3 token, not narrated) | 3 (label only) |
| M24/22 Q1(a)(iii), one role of cholesterol | 4.1.3's; not taught here (tag *role: 4.1.3*) | 8 (hand-off tag) |
| No 4.1.1 question in the cited blocks | stated in the exam close; row 2 labelled syllabus-based | 13 |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, never, only, no, nothing, cannot/can't, because, must, needs* and causal *so/since* was reread with one question: true of all cases, or only of the case on screen?
- "Ever wondered why a cell doesn't simply mix into the water around it" (1): a question, no claim. "with different substances dissolved in each" (1): the red blood cell's plasma and cytoplasm; not a claim about composition. "built on just two layers of molecules" (1): "just" is the bilayer's structure (the framework of two layers); proteins that span it are added in Beat 6; no thickness figure. "and yet the cell still controls what crosses it" (1): stated for the cell in view.
- "so they're attracted to the head" (3): polar water and a polar head; the plan's hydrophilic interaction. "The tails can't form those interactions with water, so they're hydrophobic" (3): the non-polar fatty-acid chains do not hydrogen-bond with water; definitional for hydrophobic.
- "The non-polar tails can't join in, so they're excluded from the water and come together" (4): the plan's own account (water–water hydrogen bonding excludes the non-polar tails). "the arrangement in which each part interacts best is two layers" (4): the plan's framing sentence, bounded "with water on both sides"; no micelle is taught and none is denied.
- "phospholipids form a bilayer because their hydrophilic heads interact with water on both sides, while…" (5): the creditworthy sentence, the syllabus's "interactions that account for the formation" of the bilayer. "A cell is a watery compartment in watery surroundings, like our red blood cell in plasma" (5): the typical cell named by example. "The proteins set into it let the cell control what crosses" (5): framing; roles are 4.1.3's.
- "Where a protein touches the tails, its surface has hydrophobic R groups; where it meets the water… hydrophilic R groups" (6): the plan's description of intrinsic proteins' regions, said of the proteins drawn. "The ones drawn here… span it" (6): should-fix 1; intrinsic proteins as a class are only "embedded". "Extrinsic proteins sit on one surface… attached to phospholipid heads or to an intrinsic protein" (6): the plan's two attachments, with "or"; "here the cytoplasmic side" bounds the drawn example.
- "Fluid, because the phospholipids aren't fixed in place" (7): name origin. "many of the proteins drift too" (7): "many", not all. "Here, each molecule stays in its own layer as it drifts" (7): bounded to our model ("Here"); no claim that flip-flop never occurs in real membranes. "Mosaic, because proteins… are scattered" (7): name origin.
- "In animal cell surface membranes, cholesterol molecules sit among the phospholipids in both layers" (8): the plan's bound; no "all membranes". "It's the same logic again" (8): the spine rule, applied.
- "Carbohydrate chains are hydrophilic, so this one stays out of the hydrophobic core, and in a cell surface membrane it faces outwards, not into the cytoplasm" (9): the *so* covers only staying out of the core; the outward face is stated as the arrangement in a cell surface membrane, with no cause asserted.
- "Not every membrane protein carries a chain: in our membrane, the channel and the carrier don't" (10): bounded to the drawing; "Some of the proteins you've already placed" (10).
- "Every carbohydrate chain in it… is on the top face…; none faces the cytoplasm" (11): "in it" = our drawn membrane, consistent with the plan's external-face rule for cell surface membranes.
- Recap (12): repeats taught statements with their bounds, counted on the completed model ("the four spanning proteins drawn here are transmembrane proteins": channel, carrier, receptor-glycoprotein and the separate glycoprotein; "An extrinsic protein sits on a surface": the one extrinsic protein drawn; "Phospholipids and many membrane proteins can move sideways": "many", not all). Beat 6's three examples and Beat 7's four proteins are correct at those earlier build stages.
- "gave one mark for how cholesterol is orientated… linked to its polar and non-polar parts" (13): the plan check's description of the one cited mark, past tense, one paper; no wording quoted. "That question checks the cholesterol part of this lesson, not the whole model" (13): the plan check's exact ruling. "Its membrane holds together because its phospholipids sit where each part interacts best" (13): the lesson's framing applied to the hook's cell.
- No sentence calls phospholipids hydrophobic, uses "intrinsic" as a synonym for "transmembrane", puts cholesterol in all membranes, puts a carbohydrate chain on the cytoplasmic face or in the core, calls every glycoprotein a receptor, describes the tails as hating or fearing water, or gives a membrane thickness.

---

## Citations

Every quotation in this storyboard, where it appears, and the file it was copied from. No exam quotation is used in this lesson.

| # | Quotation (verbatim) | Paper / session / question / page | Beat(s) | Copied from | Status |
|---|---|---|---|---|---|
| 1 | "describe the fluid mosaic model of membrane structure with reference to the hydrophobic and hydrophilic interactions that account for the formation of the phospholipid bilayer and the arrangement of proteins" | Syllabus 2025–2027, 4.1.1, p.21 | header; spine | `SYLLABUS-9700-DETAIL.md` | syllabus (verbatim match confirmed by plan check) |
| 2 | "describe the arrangement of cholesterol, glycolipids and glycoproteins in cell surface membranes" | Syllabus 2025–2027, 4.1.2, p.21 | header | `SYLLABUS-9700-DETAIL.md` | syllabus (verbatim match confirmed by plan check) |
| 3 | "The fluid mosaic model, introduced in 1972, describes the way in which biological molecules are arranged to form cell membranes." and "The model continues to be modified as understanding improves …" (excerpt; the sentence continues "of the ways in which substances cross membranes, how cells interact and how cells respond to signals.") | Syllabus, Topic 4 introduction, p.21 | 7 | `SYLLABUS-9700-DETAIL.md` | syllabus (introduction match confirmed by plan check) |
| 4 | "hydrophilic (polar) phosphate heads and hydrophobic (non-polar) fatty acid tails" (excerpt of 2.2.11) | Syllabus 2.2.11, p.18 | spine; 3 (small type) | `SYLLABUS-9700-DETAIL.md` | syllabus |
| 5 | (no quotation) cholesterol orientation through polar/non-polar interactions, 1 mark — the plan check's description, used as our paraphrase | M24/22 Q1(a)(ii), QP p.3 / MS p.5 | 8, 11, 13 | `TOPIC-PLAN-04-MEMBRANES.md` §4.1.2; `TOPIC-04-WEIGHTS.md` ledger; plan check; round 1 independent storyboard check (QP p.3, MS p.5) | PDF-CHECKED (independent storyboard check): QP asks "Using the information in Fig. 1.2, explain the orientation (positioning) of cholesterol molecules in the phospholipid bilayer, as shown in Fig. 1.1." (1 mark); MS p.5 gives "any one from" alternatives including `hydroxyl / polar, group, interacts with, phosphate heads ;` and `non-polar part, in region of / AW, fatty acid tails / AW, as both are, non-polar / hydrophobic ;`. Still shown on screen only as our paraphrase |
| 6 | (no quotation) exam-close ruling: "validates the 4.1.2 portion; it is not a full fluid-mosaic-model question" — the plan check's authoring instruction, shown on screen as our tag, not as exam wording | plan check on M24/22 Q1(a)(ii) | spine; 13 | `TOPIC-PLAN-04-MEMBRANES.md` §4.1.2; plan check | PDF-CHECKED (independent storyboard check) for the source/context claim (Q1(a)(ii) is a 1-mark cholesterol-orientation part, QP p.3 / MS p.5); the ruling itself remains an editorial scope ruling, not an exam quotation |

**UNVERIFIED items** (not quoted; shown only as our framing or omitted):
1. `UNVERIFIED — a marked 4.1.1 question`: **No directly relevant full 4.1.1 question has been verified in the cited blocks.** (Bounded review finding, plan register item 1; not an archive-wide absence claim.) Beat 13 row 2 is labelled **syllabus-based** and says there is no marked 4.1.1 question in the papers cited for this topic.

**Resolved by the round 1 independent storyboard check (removed from the list above):**
- ~~`UNVERIFIED — exact MS wording of M24/22 Q1(a)(ii)`~~ RESOLVED, MS p.5: "any one from" alternatives including `hydroxyl / polar, group, interacts with, phosphate heads ;` and `non-polar part, in region of / AW, fatty acid tails / AW, as both are, non-polar / hydrophobic ;` (the aqueous-facing polar hydroxyl explanation is also accepted). Beat 13 row 1 now carries *Our paraphrase of M24/22 Q1(a)(ii): one valid link between a cholesterol region's polarity and its position earns the available mark. Scheme wording checked against MS p.5.*; still no MS card and no quotation marks on screen.
- ~~`UNVERIFIED — exact QP wording of M24/22 Q1(a)(ii)`~~ RESOLVED, QP p.3: "Using the information in Fig. 1.2, explain the orientation (positioning) of cholesterol molecules in the phospholipid bilayer, as shown in Fig. 1.1." (1 mark). Beat 13 still names the question's topic only; no framed question card is added.

---

## Word count and runtime

Counted by the validator over the blockquoted narration; seconds = words ÷ 120 × 60.

| Beat | Title | Outcome | Words | Seconds |
|---|---|---|---:|---:|
| 1 | Hook and context | 4.1.1 | 88 | 44.0 |
| 2 | What you will be able to do | 4.1.1 (both) | 44 | 22.0 |
| 3 | The phospholipid, recalled | 4.1.1 | 77 | 38.5 |
| 4 | Why a bilayer forms | 4.1.1 | 90 | 45.0 |
| 5 | Heads to the water, tails to each other | 4.1.1 | 98 | 49.0 |
| 6 | Proteins, placed by the same logic | 4.1.1 | 95 | 47.5 |
| 7 | Fluid, and mosaic | 4.1.1 | 85 | 42.5 |
| 8 | Cholesterol, among the phospholipids | 4.1.2 | 91 | 45.5 |
| 9 | Glycolipids | 4.1.2 | 75 | 37.5 |
| 10 | Glycoproteins | 4.1.2 | 81 | 40.5 |
| 11 | The whole membrane, and a description to write | 4.1.2 | 80 | 40.0 |
| 12 | What I told you, on the membrane | 4.1.2 (both) | 98 | 49.0 |
| 13 | How it is asked, the reject card, and the red blood cell | 4.1.2 (both) | 107 | 53.5 |
| **Total** | 13 beats (13 teaching, 0 error) | | **1,109** | **554.5** (9:14.5) |
| + final-frame hold | Beat 13, scheduled after narration | | — | **2.0** (on-screen 9:16.5) |

**Length, honestly:** **1,109 words = 9:14.5** of narration at 120 words per minute, **14.5 s over** the 9:00 budget (1,080 words-equivalent), plus an explicitly scheduled **2 s final-frame hold** in Beat 13 (on-screen 9:16.5). The round 1 check accepted 9:11; its mandated Beat 12 recap wording (M3) added 7 words (91 → 98), which accounts for the extra 3.5 s. By outcome share: Beats 1–7 (4.1.1, with the joint objectives) 577 words = 4:48.5 against 5:00; Beats 8–13 (4.1.2, with the joint recap and close) 532 words = 4:26 against 4:00. There are no error beats to protect. The first draft counted 1,133 words (9:26.5); the author has already taken five trims (Beat 1 "what is this film made of, and"; Beat 6 "from one side to the other"; Beat 7's closing sentence shortened; Beat 8 "placed … on the same membrane"; Beat 11 "So the two faces aren't the same.", its tinted-faces visual moved to the preceding cue). The remaining overrun sits in the exam close (Beat 13, 53.5 s), which carries the plan check's limitation and the callback. **Cut list, in order, if the 9:00 is held:** (1) Beat 7, "It's a model of how the molecules are arranged." (−9 words; its caption brightening moves to the cue *still being modified*); (2) Beat 10, "Some of the proteins you've already placed are glycoproteins." (−9; the four-protein pulse moves to *This receptor carries a short chain*); (3) Beat 3, "One molecule, two very different ends." (−6; the bracket moves to *they're hydrophobic*). Cuts (1)–(3) save 24 words = 12 s, giving 1,085 words = 9:02.5 (plus the 2 s hold); the check does not require them and names cut (1) as the least costly. Narration is not to be sped up. None touches a creditworthy sentence, the exam-close limitation, the red-blood-cell example or the callback.

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| Roles of every component (stability, fluidity, permeability, transport, signalling, recognition); what the channel pore and carrier notch do; what cholesterol does | 4.1.3 (hand-off tags *role: 4.1.3* in Beats 6, 8, 10) |
| Receptor–ligand binding; the binding site in use | 4.1.3 (basic), 4.1.4 (stages) |
| Transport processes across the membrane | 4.2.1a, 4.2.1b |
| Glycerol as a structure (M24/22 Q1(a)(i)) | Topic 2 prerequisite (recall label only) |
| Membrane thickness figures, freeze-fracture evidence, lipid rafts, flip-flop, membrane potentials | not taught (plan §4.1.1 ceiling) |
| Sphingolipid chemistry, glycocalyx physiology (and the word), cholesterol synthesis | not taught (plan §4.1.2 ceiling) |
| Micelles | not taught (plan §4.1.1 motion note); neither drawn nor denied |
| Cell surface antigens, self/non-self | 4.1.3 (named), 11.1.2 |
| A red-blood-cell micrograph | not used (the cell is a schematic outline; micrographs are sourced, never generated) |

## Reusable models

| Model | Specified | For |
|---|---|---|
| **`PhospholipidToken`** (head + two tails, one kinked; first-use labels; `recall: Topic 2 lipids`; heads to water and tails inward in the assembled membrane, dispersed tokens only before assembly) | here | every membrane frame in Topic 4 |
| **`FluidMosaicMembrane`** (12 per leaflet; `glycolipid` 2 (schematic lipid anchor with neutral attachment node, not the amber phosphate-head glyph; same geometry in 4.1.3), `intrinsic-channel` 4–5, `cholesterol` 6 outer / 7 inner, `receptor-glycoprotein` 8–9 with **binding site**, `intrinsic-carrier` 10–11 notch facing outside, `glycoprotein` 12, `extrinsic` under 3–4 on the cytoplasmic face; chains 4 / 3 / 5 beads on the external face; states `assemble`, `full`, `highlight:<id>`; motion contract) | here, all component layers | 4.1.3 (adds optional `cholesterol-qualitative`), 4.1.4, 4.2.1a, 4.2.1b, 4.2.2a, 4.2.2b, 4.2.6 |
| **`WaterField`** (pale blue tokens, random motion, water–water hydrogen-bond flicker, particle caption) | here | 4.2.1a builds `DiffusionField` on it |
| Annotation overlays `R-group bands`, `polarity tags` | here (overlays, not states) | 4.1.3 may reuse them for permeability |
| The handle *heads to the water, tails to each other* and its converted sentence | here | 4.1.3 and 4.2.1a recall by label |
| Red-blood-cell context outline | here (context drawing) | to be replaced by 4.2.6's `CellOsmosisSet` `rbc-normal` when built, if the builder chooses |

---

## Assets

| Asset | Status | Source |
|---|---|---|
| `PhospholipidToken`, `FluidMosaicMembrane` (all components, three states, layer-reveal sequence), `WaterField` | **new build** | authored vector; labels as SVG text nodes; rendered still-frame verification pending (the orientation invariant under `PhospholipidToken`: heads to water and tails inward in every assembled-membrane frame, with tail exposure decreasing during `assemble` from the dispersed start; components displace phospholipid glyphs rather than overlapping them; the channel pore's hydrophilic lining stays visually distinct from the protein's hydrophobic exterior against the tails; no leaflet crossing in any insertion; chains on the external face in every frame) |
| `R-group bands` and `polarity tags` overlays | new build | authored |
| Red-blood-cell context outline, plasma tint, magnifier | new, schematic vector | authored; no photograph, no micrograph, no generated image |
| Objectives pictograms (mirrored head-and-lines glyphs; block through a double band; ring glyph with bead chain); component tray icons | new | authored flat icons |
| Syllabus tab (Beat 7), forms surface (Beat 13), reject card | new card content; shared surfaces | authored; surfaces from Topics 1–3 |
| Apparatus, practical handling, timers | none | no practical in this lesson |
| Micrographs, photographs, Cambridge artwork | none | — |

---

## Plan interpretations

1. **Component positions and "12 phospholipids per leaflet visible".** SHARED-SPECS §4 gives both the 12-per-leaflet count and component positions 2–12. If positions were phospholipid slots, the components would displace most of the outer leaflet's phospholipids (9 of 12 slots). I read positions as ordinal component slots along the `full` section, with 12 phospholipids per leaflet still visible and the section drawn wide enough to hold them (occupancy arithmetic in *Datasets*). The builder should confirm the width against the house layout.
2. **Cholesterol "one in each leaflet at positions 6 and 7".** Read as the outer-leaflet molecule at position 6 and the inner-leaflet molecule at position 7 (adjacent, not stacked), so both leaflets are visibly occupied and neither sits directly under a spanning protein.
3. **Layer reveals.** The plan publishes the 4.1.2 layers here and SHARED-SPECS defines only `assemble`, `full` and `highlight`. I build `full` in this lesson by staged reveals (proteins in Beat 6 with the receptor's chain hidden; cholesterol Beat 8; glycolipid Beat 9; glycoprotein and the receptor's chain Beat 10), each inserted by sideways drift along its own leaflet (never across the core). These are a build sequence, not new model states; later lessons use `full`.
4. **Receptor named, role deferred.** The receptor is named and its **binding site** labelled (the model spec requires the label; never "active site"), but what binding does is left to 4.1.3/4.1.4. The carrier's notch is drawn but not labelled or explained.
5. **Beat split 7 + 6.** Beats 1–7 carry 4.1.1 and Beats 8–13 carry 4.1.2; the joint recap (Beat 12) and exam close (Beat 13) are counted in 4.1.2's six because the close is the 4.1.2 question and the recap covers both outcomes. The objectives (Beat 2) cover both and are counted in 4.1.1's seven.
6. **Handle.** The plan leaves the handle to the author and bars invented metaphors that could be written in an exam. I chose a retrieval phrase, *heads to the water, tails to each other*, rather than a picture, and speak it as "a memory aid, not an exam answer" before the converted sentence. The mosaic-tiles comparison in Beat 7 is the origin of the model's name, used once, not the lesson's handle.
7. **Hydrogen bonds with the head.** The plan's "hydrophilic interactions, including hydrogen bonds between water and the charged/polar head" is taught as water molecules forming hydrogen bonds with the head (Beat 3), drawn in the Topic 2 dashed convention. Water–water hydrogen bonding is shown in `WaterField` as the reason the tails are excluded (Beat 4), as the plan words it.
8. **Hook and real-world example.** The plan asks for a hook about why a cell does not dissolve into or mix with the water around it, "worded by the author", and names the red-blood-cell membrane as the explain-beat example. The red blood cell is drawn as an authored schematic outline because 4.2.6's `CellOsmosisSet` is not yet built (build position 1).
9. **Exam close without a framed question card.** Only the plan-check description of M24/22 Q1(a)(ii) is available; its QP stem and MS wording are unverified. The close therefore names the question's topic and the credited idea as our description, adds the plan check's limitation ("validates the 4.1.2 portion only; not a full fluid-mosaic-model question"), and labels the 4.1.1 row as syllabus-based. The reject card is our wording contrast, not a mark-scheme reject line, since no reject line is verified for this part. (Round 1 check: QP p.3 and MS p.5 are now PDF-checked; the close keeps its paraphrase form, with the MS-checked note in Beat 13 action 3, and the reject card stays our contrast with no MS reject citation or COMMON MISTAKE badge.)
10. **Carbohydrate-chain sidedness.** The plan says chains face outwards "(they are hydrophilic), not into the bilayer and not into the cytoplasm". Hydrophilicity explains why a chain is not in the core but not why it is on the outer rather than the cytoplasmic face (both are watery), so the narration uses hydrophilicity only for the first and states the outer face as the arrangement in cell surface membranes (Beat 9; typicality rules).
11. **R-group regions and the pore.** The channel's pore lining by hydrophilic R groups is part of the published model; it is described here as arrangement only ("what that pore is for comes next lesson"), keeping the role in 4.1.3.
12. **Timers, handling, colour changes, measured/illustrative labels.** None apply: this lesson has no practical, no colour change and no dataset. Motion rates and bead counts are labelled as drawing specifications (*Datasets*).

---

## Validator run

`python3 work/006/validate_storyboard.py storyboards/topic-04/4.1.1-2/STORYBOARD.md` (after round 1 fixes)

```
== storyboards/topic-04/4.1.1-2/STORYBOARD.md
beat  words  cues maxgap  status
   1     88    10     21  ok
   2     44     4     11  ok
   3     77    10     16  ok
   4     90    12     14  ok
   5     98    10     18  ok
   6     95    13     12  ok
   7     85    11     10  ok
   8     91    10     13  ok
   9     75     8     15  ok
  10     81     9     16  ok
  11     80     9     14  ok
  12     98    10     14  ok
  13    107     9     18  ok
TOTAL words 1109  cues 125  runtime at 120 wpm 9:14.5  beats 13  failing beats 0
```

---

## CHECK RESPONSE (round 1)

Check: `r1/4.1.1-2/CHECK.md`, verdict CLEARED WITH MINOR EDITS (reviewed SHA-256 `526c184f…fdbfe`, which matched this file before editing).

| ID | Status | What changed |
|---|---|---|
| M1 (orientation invariant) | applied | `PhospholipidToken` spec: "Heads always face water; tails never in water" replaced by the check's invariant verbatim ("In the assembled membrane, heads face the aqueous surroundings and tails face the hydrophobic interior. Before assembly, isolated tokens may have tails exposed to water; …No phospholipid crosses from one established leaflet to the other."). Also repeated in the `assemble` state; motion contract now reads "Every frame of the assembled membrane (from the end of `assemble` onward)…"; Assets verification and Reusable-models row reworded to the same bound. |
| M1 (Beat 4 actions 4 and 8) | applied | Action 4 now "run `assemble` over about 3 seconds: tokens move and rotate into the two leaflets, ending with twelve phospholipids per leaflet, heads outward and tails inward. Continue the normal molecular jitter after completion; do not restart assembly at later cues." Action 8 now "bracket the two already-formed rows and reveal the tag *12 per layer (drawn section)*. This cue identifies the completed bilayer; it does not complete or replay assembly." |
| M1 (Beat 4 action 12, consequential) | applied with interpretation | To avoid jitter "beginning" after action 4 says it continues: "the phospholipids add their slow sideways drift (motion contract) to the ongoing jitter". No narration change. |
| M1 (staged-entry caption) | applied | Model contract (layer reveals) carries, in small type while components enter in Beats 6, 8, 9, 10: *Components enter progressively to build the explanatory drawing; this is not a depiction of cellular membrane synthesis or protein insertion machinery.* |
| M2 (glycolipid geometry) | applied | `glycolipid` spec and Beat 9 action 2 now use the check's wording verbatim: "Draw a schematic lipid anchor with two hydrophobic tails and a small neutral-coloured attachment node carrying the four-bead green carbohydrate chain. Do not reuse the amber phosphate-head glyph or add a phosphate/glycerol label. Label the anchor *lipid part (schematic)* …". Beat 9 on-screen list updated to *lipid part (schematic)*; spec and Reusable-models row state the geometry is published for reuse including 4.1.3. |
| M3 (Beat 12 narration) | applied | Now "Intrinsic proteins are embedded in it, with hydrophobic R groups against the tails; the four spanning proteins drawn here are transmembrane proteins. An extrinsic protein sits on a surface. Phospholipids and many membrane proteins can move sideways: fluid. Proteins scattered through it: mosaic." (+7 words, 91 → 98). |
| M3 (Beat 12 actions 4–8) | applied | Replaced verbatim, split over the five cues (*Intrinsic proteins are embedded in it*; *the four spanning proteins drawn here*; *An extrinsic protein sits on a surface*; *can move sideways: fluid*; *scattered through it: mosaic*), ending "Keep the recap still, with annotations fading in on the familiar model." Cues remapped: exact, unique, ordered; max gap 14 words. |
| M3 (propagation) | applied | Scope ledger protein row and absolutes sweep recap line now count the completed model (four spanning, one extrinsic; "many", not all). Beat 6 (three examples) and Beat 7 (four proteins) left as written, per the check. |
| M4 (citation rows 5–6) | applied | Row 5: PDF-CHECKED (independent storyboard check), with the QP p.3 stem and MS p.5 alternatives recorded; still shown on screen only as our paraphrase. Row 6: PDF-CHECKED for the source/context claim; "remains an editorial scope ruling, not an exam quotation". |
| M4 (UNVERIFIED list) | applied | Items 2–3 removed and recorded as RESOLVED with the check's QP p.3 / MS p.5 wording. Item 1 kept as "No directly relevant full 4.1.1 question has been verified in the cited blocks." The same bounded wording replaces "No marked 4.1.1 question exists" in the spine note; header and Plan interpretation 9 note the round 1 PDF check. |
| M4 (Beat 13 action 3) | applied | Small type now *Our paraphrase of M24/22 Q1(a)(ii): one valid link between a cholesterol region's polarity and its position earns the available mark. Scheme wording checked against MS p.5.* Narration unchanged; it does not say both relationships are individually required. |
| Should-fix 1 (time-lapse ×4) | applied | Beat 7 action 3 caption now *schematic lateral motion; not measured*; action 11 "the tracer's drift trail is gone and normal jitter continues"; on-screen list and Datasets row updated ("no time compression applied"). |
| Should-fix 2 (slot arithmetic, overlap) | applied | Positions unchanged. Assets verification now requires that "components displace phospholipid glyphs rather than overlapping them", and that "the channel pore's hydrophilic lining stays visually distinct from the protein's hydrophobic exterior against the tails" (from the check's science note). |
| Should-fix 3 (opening/close length) | applied (no change needed) | No meta-commentary added to Beats 1 or 13. |
| Runtime ruling (2 s hold, no speed-up) | applied | Beat 13 action 9: "Final frame held 2 s (scheduled after the narration ends, 9:14.5–9:16.5; not included in the words ÷ 120 runtime)". Word table has a separate hold row; "Length, honestly" gives 1,109 words = 9:14.5 narration + 2 s = 9:16.5 on screen. The +3.5 s over the accepted 9:11 comes only from M3's mandated wording. Beat 12/13 windows now 7:32–8:21 and 8:21–9:15. Cut list kept as optional (now 1,085 words = 9:02.5). |

New validator TOTAL: `TOTAL words 1109  cues 125  runtime at 120 wpm 9:14.5  beats 13  failing beats 0`
