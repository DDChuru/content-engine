# 4.1.3 — What each part of the membrane does

**Storyboard, first draft. Cloud run 006, 27 September 2026.** No audio, no code, no render. Folder `storyboards/topic-04/4.1.3/`.
Cambridge 9700 syllabus 2025–2027, p.21. Command word **DESCRIBE**. Budget from `TOPIC-PLAN-04-MEMBRANES.md` §4.1.3 and the lesson list, and `TOPIC-04-WEIGHTS.md` (4.1.3 row): **10:15 = teaching 9:00 (about 1,080 words-equivalent) + one complete error beat 1:15 (E43); 12 teaching beats + 1 error beat**; delivered here as **13 beats (12 teaching + 1 error)**. 4.1.3 has direct exposure in 4 of 5 cited Paper 2 blocks, 10 overlapping marks (not additive topic marks, not archive-wide frequencies). Runtime estimated at **120 words per minute of final video** (words ÷ 120 = minutes; the 4 s silent read sits inside that effective rate and is not added again).

> **4.1.3** describe the roles of phospholipids, cholesterol, glycolipids, proteins and glycoproteins in cell surface membranes, with reference to stability, fluidity, permeability, transport (carrier proteins and channel proteins), cell signalling (cell surface receptors) and cell recognition (cell surface antigens – see 11.1.2)

(syllabus p.21)

**Authorities read, in full:** `work/006/SHARED-SPECS.md` (binding); `work/006/AGENT-BRIEF.md`; `plan/topic-04/TOPIC-PLAN-04-MEMBRANES.md` (§4.1.1, §4.1.2, §4.1.3 in full, §4.1.4, §4.2.1 for the hand-offs, lesson list and build order, shared-model table, words/runtime table, traps table, UNVERIFIED register, PLAN-CHECK RESPONSE); `plan/topic-04/TOPIC-04-WEIGHTS.md` (4.1.3 row and paragraph; ledger rows S21/22 Q3(b), Q3(c), W22/23 Q5(a)(i), Q6(a), S23/21 Q3(a), M24/22 Q1(a)(iii), Q1(b)(i), Q1(c)(iii); register E43; evidence gaps); `cloud-inputs/003/standards/VIDEO-STRUCTURE.md` (all); `CONTENT-ARCHITECTURE.md`; `SYLLABUS-9700-DETAIL.md` Topic 4 (pp.21–22; apparatus p.57, materials p.58 and mathematical requirements p.63 checked: none apply to this lesson); the cleared examples `cloud-inputs/006/examples/3.1.3/STORYBOARD.md` and `3.2.1b/STORYBOARD.md`; `cloud-inputs/003/topic-03/3.1.1-2/CHECK.md` and `3.2.2-3/CHECK.md`; the plan check `cloud-checks/006/plan/CHECK.md` (branch `origin/cloud/006-checks`), MF1, MF2, should-fixes 1, 3 and 6; `cloud-inputs/006/evidence/GATE-CRITERIA-9700-04-CELL-MEMBRANES-AND-TRANSPORT.md` (G04), `EXAMINER-INSIGHT-9700.md`, `COMPLEXITY-CALIBRATION-9700-BIOLOGY.md` §4. **No question paper, mark scheme or examiner report PDF was opened for this draft.** Every exam quotation is one of the plan-check-verified strings listed in SHARED-SPECS §2; everything else is our wording, labelled *our framing* or *our paraphrase*, or listed as `UNVERIFIED`.

**Build position:** second of the ten Topic 4 lessons: 4.1.1-2 → **4.1.3** → 4.1.4 → 4.2.1a → 4.2.1b → 4.2.6 → 4.2.2a → 4.2.2b → 4.2.3-4 → 4.2.5.

**Models used:** `FluidMosaicMembrane` (published by 4.1.1-2; states `full`, `highlight:<id>`; component ids `glycolipid`, `intrinsic-channel`, `cholesterol`, `receptor-glycoprotein`, `intrinsic-carrier`, `glycoprotein`, `extrinsic`); `PhospholipidToken` (4.1.1-2, by label only).

**Models published here:** `TransportProteinSet` preview states **`channel-open`** and **`carrier-bind`** (with a one-time labelled preview of the carrier's shape change, see the model spec; 4.2.1a publishes the full passive states); `ReceptorLigand` **basic** states **`rest`** and **`bind-basic`** (4.1.4 extends with `wrong-ligand-fail`, `seat`, `response-pulse`/`response-uptake`); the optional `FluidMosaicMembrane` state **`cholesterol-qualitative`** (should-fix 3); the lesson panel **`RoleGrid`**; the schematic tokens used here (O₂, Na⁺, glucose, ligand A) in their SHARED-SPECS colour roles.

---

## The causal spine

One idea carries the lesson: **each kind of molecule in the cell surface membrane has a job that follows from what it is and where it sits.** The phospholipids' hydrophobic tails make a core that lets small non-polar molecules through and turns back ions and polar molecules; so the substances the core turns back cross through proteins; cholesterol sits among the tails and adjusts how they move; the carbohydrate chains face the watery outside, where they bind water, receive signals and are recognised.

> **The phospholipid bilayer's hydrophobic core lets small non-polar molecules such as oxygen cross, but it is a barrier to ions and polar molecules, which makes the membrane partially permeable; channel proteins (a hydrophilic pore) and carrier proteins (a binding site and a change of shape) let particular ions and polar molecules cross; phospholipids moving sideways make the membrane fluid, and cholesterol, in animal cell membranes, helps regulate that fluidity, helps stability and reduces permeability to small polar molecules and ions; the hydrophilic carbohydrate chains of glycolipids and glycoproteins hydrogen-bond with water, helping stability; some glycoproteins and proteins are cell surface receptors with a binding site complementary to a particular signalling molecule; glycoproteins and glycolipids act as cell surface antigens for cell recognition.**

**What the mark schemes credit, quoted:** only one verbatim marking line in this lesson's evidence is available: [W22/23 Q6(a), MS p.19] `I ‘ions cannot pass through the membrane’` (**PDF-CHECKED (plan check)**), on a part that credits ion transport through a membrane protein, any one point, 1 mark. Everything else is **our paraphrase of the plan check's descriptions**, never shown in quotation marks as scheme wording: [S23/21 Q3(a), 1 mark, MS p.11] polar/water-soluble/hydrophilic substances and the bilayer core are credited; size-only, active transport and facilitated diffusion are ignored at that point. [M24/22 Q1(b)(i), 1 mark, MS p.5] sodium ions' charge and the hydrophobic/non-polar bilayer. [M24/22 Q1(a)(iii), 1 mark, MS p.5] one role of cholesterol. [S21/22 Q3(b), 2 marks, QP p.6 / MS p.12] a steroid hormone crosses the bilayer: non-polar/lipid-soluble character and bilayer passage, any two points. [W22/23 Q5(a)(i), 2 marks, MS p.17] receptor identity/location/complementarity, any two (its reject line `R active site` is 4.1.4's E44 and is not shown here). [M24/22 Q1(c)(iii), 2 marks, MS p.7] outline cell signalling (4.1.4's close; receptor-role overlap here). **Adjacent only:** [S21/22 Q3(c), 1 mark, MS p.12] a hormone binding a *cytoplasmic* receptor by complementary shape, with the scheme line `Reject if hormone S or receptor R described as an antigen or enzyme` (**PDF-CHECKED (plan check)**) — not evidence of a cell-surface role. So the spine is what is credited: the property of the substance (polar, charged, non-polar) set against the hydrophobic core; a protein route for ions; one stated role of cholesterol; complementary receptor binding.

**The handle:** *oil and water don't mix.* It makes the core's selectivity retrievable: the tails are the oil; ions and polar molecules belong with the water. Converted at once, in Beat 4: *small non-polar molecules cross the phospholipid bilayer, but its hydrophobic core is a barrier to ions and polar molecules.* The handle is an everyday image, not an exam answer, and is never written on a marking surface.

**Typicality rules applied.** "Particular" ions or polar molecules for each channel (should-fix 6: not every channel has the same selectivity); "some" glycoproteins and proteins are receptors (not every glycoprotein); carbohydrate chains are antigens, not "every chain an ABO antigen" (ABO omitted, see UNVERIFIED 3); cholesterol "in animal cell membranes", "helps", "in the usual account", no temperature numbers; glucose tied to the plan-check sentence ("Glucose is polar and does not cross the hydrophobic bilayer core readily; it needs a transport protein") with its direction and energy explicitly handed to the transport lessons, and never "glucose crosses by facilitated diffusion"; "intrinsic" never used as a synonym for "transmembrane" (should-fix 1: the channel, carrier and receptor drawn here span the bilayer); ions "do not cross the core readily" / "cannot cross the hydrophobic core", never "cannot cross the membrane" (E43). Reasons students err are phrased as possibilities ("It can feel right, since…").

**One error beat, five moves** (announce → written card → 4 s silent read → cue-synced talk-through → correct in place): **E43 in Beat 7**, badge **EXAM CONTRAST** (basis: W22/23 Q6(a) MS p.19 ignore line `I ‘ions cannot pass through the membrane’`; an ignore line, not a reject line or an examiner diagnosis; it does not show prevalence — MF2). Card *our framing of W22/23 Q6(a); constructed answer, not a transcript*. Full timing retained. No other beat carries a badge; Beat 13's reject card is captioned as our wording contrast.

---

## The models, specified once

Orientation throughout (SHARED-SPECS §4): **outside the cell at the top, cytoplasm at the bottom**; every crossing in this lesson runs **across the membrane, along its normal** (vertical). Molecular models carry *schematic; not to scale*. Colour roles: phospholipid heads warm amber, tails mid grey, proteins teal, cholesterol ochre, carbohydrate chains green bead chains, water tokens small pale blue circles, glucose orange hexagons, ion tokens small violet circles with +, O₂ two joined red circles (a token, not a bond diagram), ligand magenta; error/contrast treatment terracotta.

### `FluidMosaicMembrane` (4.1.1-2; reused by state id)

Used exactly as 4.1.1-2 publishes it: 12 phospholipids per leaflet; `glycolipid` (outer leaflet, position 2, chain of 4 beads), `intrinsic-channel` (spanning, positions 4–5, pore lined by hydrophilic R groups, light core), `cholesterol` (positions 6 and 7, one per leaflet, OH end at head level, rings among the tails), `receptor-glycoprotein` (spanning, positions 8–9, binding-site cup on the outer face, chain of 3 beads), `intrinsic-carrier` (spanning, positions 10–11, notch facing outside at rest), `glycoprotein` (spanning, position 12, chain of 5 beads), `extrinsic` (cytoplasmic face under positions 3–4). Region labels *outside the cell (watery)*, *cytoplasm (watery)*, *hydrophobic core*. States used: `full`, `highlight:<id>` (component brightens, others dim to 50%). Motion contract unchanged: lateral drift only (≤ 1 token width per 2 s for phospholipids, proteins slower); nothing crosses between leaflets; carbohydrate chains only on the external face. Recall tag *recall: 4.1.1-2* on first appearance.

**`cholesterol-qualitative` (optional state; specified and published here, should-fix 3).** A split inset of a short bilayer strip (6 phospholipids per leaflet), each half captioned. **Top row, *higher temperature* (thermometer icon, high, no number):** left strip *no cholesterol* — phospholipids jitter and drift sideways with large amplitude; right strip *with cholesterol* (two ochre cholesterol molecules per leaflet among the tails) — the phospholipids next to each cholesterol jitter visibly less (amplitude about half). **Bottom row, *lower temperature* (thermometer icon, low, no number):** left strip *no cholesterol* — the tails slide together and pack closely, motion nearly stopped, the strip visibly narrower between heads; right strip *with cholesterol* — cholesterol rings sit between the tails, which stay spaced and keep moving slowly. Caption on screen throughout: ***qualitative schematic; not measured data***. No temperature values, no fluidity scale, no numbers of any kind. Heads face water in every frame; nothing flips between leaflets.

### `TransportProteinSet` — preview states (published here; 4.2.1a publishes the full passive states, 4.2.1b `pump-ATP`)

Both previews use the `FluidMosaicMembrane` proteins in place, labelled **channel protein** and **carrier protein**, with the tag ***process: 4.2.1*** on screen whenever a preview runs.
- **`channel-open`**: the `intrinsic-channel` spans the bilayer; its central pore is drawn as a light, water-filled core (three pale blue water tokens inside) lined by hydrophilic R groups (small polar ticks on the pore wall). An ion token (violet, +) approaches from the outside, enters the pore and passes through to the cytoplasm (about 1.2 s), never touching the tails. **The channel never changes shape.** Label **channel protein**; side-label *hydrophilic pore (water-filled)*.
- **`carrier-bind`**: the `intrinsic-carrier` at rest, notch facing outside, labelled **binding site**. A glucose token (orange hexagon) approaches and seats in the notch (0.6 s). Label **carrier protein**.
- **Shape-change preview (one run only, labelled *preview; process: 4.2.1*)**: after `carrier-bind`, the carrier's silhouette interpolates over **0.8 s** (motion; no cut) so the notch faces the cytoplasm, and the glucose leaves into the cytoplasm (0.5 s). The geometry and timings are exactly SHARED-SPECS §4's `carrier-flip` and `carrier-release`, so 4.2.1a's published states match this preview frame for frame. The return (`carrier-reset`) is not shown here; the carrier is held in its flipped outline, dimmed, for the rest of the beat. No direction-of-gradient arrow, no ATP token, no energy label.

### `ReceptorLigand` — basic states (published here; 4.1.4 adds `wrong-ligand-fail`, `seat`, `response-pulse`/`response-uptake`)

The `receptor-glycoprotein` of the membrane, spanning the bilayer, its cup-shaped **binding site** on the outer face labelled **binding site** (never "active site"), its 3-bead carbohydrate chain beside it. **Ligand A** (magenta wedge, complementary to the cup), labelled **signalling molecule**.
- **`rest`**: receptor with binding site labelled; ligand A drifting in the outside region.
- **`bind-basic`**: ligand A approaches along the membrane normal and seats flush in the binding site (0.8 s, the same geometry and timing SHARED-SPECS gives `seat`, so 4.1.4 can alias `seat` to it). A static arrow then appears beneath the receptor in the cytoplasm, labelled *leads to a response in the cell (stages: 4.1.4)*; no pulse, no pathway, no second molecule.
**Ligand B** (non-complementary, magenta square) is **defined here as part of the basic model** (SHARED-SPECS §4) so 4.1.4 inherits it, but it is **not shown** in this lesson: showing it failing to seat is 4.1.4's `wrong-ligand-fail`, and showing it merely sitting nearby would be a picture of a fact rather than the mechanism.

### `RoleGrid` (lesson panel; published here, reusable by the 4.1 notes)

A 5 × 6 grid, labels as SVG text nodes. **Rows** (each with a flat thumbnail of the component from the membrane): **phospholipids · cholesterol · glycolipids · proteins · glycoproteins**. **Columns:** **stability · fluidity · permeability · transport · cell signalling · cell recognition**. Cells start empty and fill with short phrases when the narration covers them; a filled cell links by a thin leader line to its component on the membrane while it is being filled, then the leader fades. Final state (Beat 12):

| | stability | fluidity | permeability | transport | cell signalling | cell recognition |
|---|---|---|---|---|---|---|
| phospholipids | — | move sideways: fluid | hydrophobic core: barrier to ions and polar molecules | — | — | — |
| cholesterol | helps stability | regulates fluidity | reduces permeability to small polar molecules and ions | — | — | — |
| glycolipids | chains H-bond with water | — | — | — | — | antigens |
| proteins | — | — | — | channel proteins · carrier proteins | some are receptors | — |
| glycoproteins | chains H-bond with water | — | — | — | some are receptors | antigens |

Empty cells show a faint dash, never a cross: an empty cell means *not taught as this component's role here*, not *never*. Caption beneath the grid: *roles named in syllabus 4.1.3 (p.21)*.

### Tokens

**O₂**: two joined red circles, labelled *oxygen* on first use. **Na⁺**: small violet circle with +, labelled *sodium ion, Na⁺*; in Beat 4 it carries a halo of five pale blue water tokens (*surrounded by water; schematic*). **Glucose**: orange hexagon, labelled *glucose (polar)*; in Beat 4 a halo of water tokens. **Ligand A**: magenta wedge. Particle scenes carry *particles drawn schematically; not to scale; far fewer than real*.

---

## Beat by beat

Beat windows in the headings are provisional and follow the per-beat ledger (words ÷ 120; the 4 s silent read in Beat 7 sits inside the effective rate and is not added again); final cue times come from the measured audio. Every cue is an exact narration substring, unique within its beat, in spoken order; no stretch over 30 words without a stated visual change.

### BEAT 1 · Hook and context · 0:00–0:47
**Narration:**
> Ever wondered why oxygen slips straight through the membrane around a cell, while a sodium ion, tiny as it is, gets turned back unless a protein lets it through? Think about everything that membrane has to manage. It has to keep the cell's contents in, yet let the right substances across. It has to stay in one piece, yet stay flexible. And it carries the molecules that let a cell receive signals and be recognised by other cells. One thin membrane does all of that, because different molecules in it do different jobs.

**Visual action:**
1. **From the first frame**, a schematic cell outline (no organelles) sits at left with a magnifier window on its edge showing `FluidMosaicMembrane` in `full`, unlabelled except the region labels *outside the cell (watery)* above and *cytoplasm (watery)* below, caption *schematic; not to scale*; at *Ever wondered why oxygen slips*, the hook question appears as a compact caption above the window (never alone on the frame), and an O₂ token drops from the outside region through the tails and out into the cytoplasm (motion, about 1 s).
2. At *a sodium ion, tiny as it is*, a violet Na⁺ token approaches the heads from above, meets the tail region and rebounds back into the outside (motion).
3. At *unless a protein lets it through*, the same token drifts sideways to the `intrinsic-channel` and passes down through its pore into the cytoplasm; the channel keeps its shape.
4. At *keep the cell's contents in*, the cell interior tints faintly; at *let the right substances across*, a second O₂ token crosses the window's bilayer.
5. At *stay in one piece, yet stay flexible*, the phospholipids in the window drift sideways (lateral drift only) while the bilayer stays continuous, and the cell outline flexes gently.
6. At *receive signals*, a magenta ligand wedge drifts in the outside region near the `receptor-glycoprotein` (it does not bind yet); at *be recognised by other cells*, the green carbohydrate chains on the outer face glow briefly.
7. At *different molecules in it do different jobs*, the five component types in the window pulse one after another (phospholipids, cholesterol, glycolipid, proteins, glycoproteins); dissolve to the objectives surface.

**On-screen text:** the hook question; *outside the cell (watery)*; *cytoplasm (watery)*; *schematic; not to scale*.

---

### BEAT 2 · What you will be able to do · 0:47–1:13
**Narration:**
> By the end you will be able to describe what each of the five kinds of molecule in the membrane does; to use the six role words the syllabus names, from stability to recognition; and to explain why ions and polar molecules need a protein to cross, the way mark schemes credit it.

**Visual action:**
1. **From the first frame**, the objectives surface is on screen: its own distinct background colour, **not the lesson diagram**, three rows each with a flat authored pictogram slot (flat icons, not models from the lesson); at *describe what each of the five kinds of molecule*, line 1 enters with motion beside five tiny flat icons (a circle with two strokes; a small ochre ring; a stroke with a bead chain; a teal blob; a teal blob with a bead chain).
2. At *use the six role words*, line 2 enters beside a six-tile icon; at *from stability to recognition*, its first and last tiles light.
3. At *explain why ions and polar molecules need a protein*, line 3 enters beside a pictogram of a small violet + circle next to a gap in a two-line band; at *the way mark schemes credit it*, a small tick-tab icon lands at the end of line 3.
   1. **DESCRIBE** what phospholipids, cholesterol, glycolipids, proteins and glycoproteins do
   2. **USE** stability · fluidity · permeability · transport · signalling · recognition
   3. **EXPLAIN** why ions and polar molecules need a transport protein

**On-screen text:** the three lines. Small type: *syllabus 4.1.3, "describe", p.21.*

---

### BEAT 3 · The membrane, and why its parts matter · 1:13–2:00
**Narration:**
> Here is the membrane from the lesson on its structure: a phospholipid bilayer, heads facing the watery outside and the watery cytoplasm, tails meeting in the middle, with cholesterol, glycolipids, proteins and glycoproteins sitting in it. Now the question is what each of them does. A membrane that let nothing across and carried no signals would cut a cell off from everything it needs. Each component gives the cell a way to control what crosses, to stay intact, or to communicate. Six role words carry it, and this grid fills in as we go.

**Visual action:**
1. **From the first frame**, `FluidMosaicMembrane` in `full` fills the centre, caption *schematic; not to scale*, tag *recall: 4.1.1-2*; at *a phospholipid bilayer*, the label **phospholipid bilayer** lands; at *heads facing the watery outside*, the heads on both faces brighten and the region labels *outside the cell (watery)* and *cytoplasm (watery)* land; at *tails meeting in the middle*, the tail region is bracketed **hydrophobic core**.
2. At *with cholesterol, glycolipids, proteins and glycoproteins*, `highlight:` runs through `cholesterol`, `glycolipid`, the spanning proteins (`intrinsic-channel`, `receptor-glycoprotein`, `intrinsic-carrier`) with `extrinsic`, then `glycoprotein`, each labelled as it brightens (**cholesterol**, **glycolipid**, **proteins**, **glycoprotein**); the full membrane returns.
3. At *what each of them does*, a small question tag *roles?* hovers over the membrane.
4. At *let nothing across and carried no signals*, a ghost solid grey band briefly overlays the membrane; an O₂ token and a ligand wedge bounce off it (motion), tag *not how a membrane works*; the band dissolves back to the bilayer.
5. At *control what crosses*, the channel and carrier pulse; at *to stay intact*, the bilayer's outline brightens along its length; at *or to communicate*, the receptor and the carbohydrate chains pulse.
6. At *Six role words carry it*, the membrane slides to the left two-thirds and the `RoleGrid` slides in at right, all cells empty; at *this grid fills in as we go*, the six column headers light one after another.

**On-screen text:** membrane labels; *not how a membrane works*; the empty `RoleGrid` with its row and column headers.

---

### BEAT 4 · Permeability: the hydrophobic core · 2:00–2:54
**Narration:**
> Start with the phospholipids and permeability. The middle of the bilayer is the tails: non-polar, hydrophobic, with very little water in it. Small non-polar molecules such as oxygen and carbon dioxide pass straight through; oxygen enters a red blood cell across its bilayer this way. Ions and polar molecules interact strongly with water, and the core offers them nothing to interact with, so they do not cross it readily. Keep the image of oil and water, which don't mix. Written properly: small non-polar molecules cross the phospholipid bilayer, but its hydrophobic core is a barrier to ions and polar molecules. That is why the membrane is partially permeable.

**Visual action:**
1. **From the first frame**, `FluidMosaicMembrane` in `highlight:` on the phospholipids (every protein, cholesterol and chain dimmed to 50%) at left, the `RoleGrid` at right; at *Start with the phospholipids and permeability*, the grid's **phospholipids** row and **permeability** column light.
2. At *The middle of the bilayer is the tails*, the tail region is bracketed, label **hydrophobic core: non-polar fatty-acid tails**, small type *very little water*.
3. At *Small non-polar molecules such as oxygen*, several O₂ tokens in the outside region cross down through the core, and one crosses upward (motion; crossings along the membrane normal), tag *which way, and why: 4.2.1*; at *carbon dioxide*, a text tag beside the tokens: *carbon dioxide crosses the same way*.
4. At *oxygen enters a red blood cell*, a small inset opens at upper left: a red blood cell outline with its membrane edge, labelled *red blood cell; outside: plasma*, O₂ tokens entering across the edge, caption *example*.
5. At *Ions and polar molecules interact strongly with water*, a Na⁺ token and a glucose hexagon appear in the outside region, each ringed by a halo of pale blue water tokens, label *surrounded by water (schematic)*.
6. At *offers them nothing to interact with*, each token approaches the heads, meets the tails and rebounds back into the outside (motion); at *do not cross it readily*, tag **barrier to ions and polar molecules**.
7. At *Keep the image of oil and water*, a small inset at lower left shows oil drops sitting apart on water in a beaker icon, tag *handle, not the exam answer*.
8. At *Written properly*, the sentence surface slides up beneath the membrane; at *small non-polar molecules cross the phospholipid bilayer*, the first clause builds with the O₂ tokens brightening; at *its hydrophobic core is a barrier*, the second clause builds with the rebounding tokens brightening: **Small non-polar molecules cross the phospholipid bilayer, but its hydrophobic core is a barrier to ions and polar molecules.**
9. At *partially permeable*, the label **partially permeable** lands on the membrane; the grid cell *phospholipids × permeability* fills: **hydrophobic core: barrier to ions and polar molecules**.

**On-screen text:** *hydrophobic core: non-polar fatty-acid tails*; *which way, and why: 4.2.1*; *carbon dioxide crosses the same way*; the red blood cell inset and caption; *surrounded by water (schematic)*; *barrier to ions and polar molecules*; the handle tag; the sentence; *partially permeable*; the filled grid cell.

---

### BEAT 5 · Transport: channel proteins · 2:54–3:43
**Narration:**
> So how does anything charged or polar get across? Through proteins, and this is the transport role. Watch a sodium ion reach the bilayer: the core turns it back. Now it meets a channel protein, one of the proteins that span the bilayer. Down its middle runs a pore, lined with hydrophilic parts of the protein and filled with water, so the ion passes through without touching the hydrophobic core. Each kind of channel lets particular ions or polar molecules through; different channels pass different ones. And notice that the channel keeps its shape the whole time.

**Visual action:**
1. **From the first frame**, `FluidMosaicMembrane` in `full` at left with the Beat 4 labels faded, the `RoleGrid` at right; at *how does anything charged or polar get across*, the rebounded Na⁺ token from Beat 4 hovers in the outside region, ringed.
2. At *this is the transport role*, the grid's **proteins** row and **transport** column light; `highlight:intrinsic-channel` begins (others dim to 50%).
3. At *Watch a sodium ion reach the bilayer*, a Na⁺ token descends onto the heads beside the channel; at *the core turns it back*, it meets the tails and rebounds (motion).
4. At *it meets a channel protein*, the token drifts sideways to the channel's mouth; label **channel protein** lands; at *span the bilayer*, a bracket spans the protein from the outer to the inner face, small type *intrinsic proteins are embedded in the bilayer; this channel spans it (a transmembrane protein)*.
5. At *Down its middle runs a pore*, the pore's light core brightens with its three water tokens, side-label *hydrophilic pore (water-filled)*; at *lined with hydrophilic parts of the protein*, the polar ticks on the pore wall pulse.
6. At *the ion passes through*, `channel-open`: the Na⁺ token enters the pore and passes down into the cytoplasm (about 1.2 s), tag *process: 4.2.1*; the tails beside the channel stay untouched, ringed briefly at *without touching the hydrophobic core*.
7. At *Each kind of channel lets particular ions*, a second Na⁺ token passes through the same channel; at *different channels pass different ones*, a small side inset shows a second, unlabelled channel outline with a different pore lining, tag *particular ions or polar molecules for each channel*.
8. At *keeps its shape the whole time*, the channel's outline is traced once and a ghost of its outline taken before the first ion passed is overlaid on it, matching exactly, tag *no change of shape*; the grid cell *proteins × transport* fills its first half: **channel proteins**.

**On-screen text:** *channel protein*; the intrinsic/transmembrane small type; *hydrophilic pore (water-filled)*; *process: 4.2.1*; *particular ions or polar molecules for each channel*; *no change of shape*; the grid cell.

---

### BEAT 6 · Transport: carrier proteins · 3:43–4:33
**Narration:**
> A carrier protein works another way. Glucose is polar and does not cross the hydrophobic bilayer core readily; it needs a transport protein, and in this example that protein is a carrier. The carrier has a binding site that fits a particular molecule or ion. The glucose binds; then the carrier changes shape, so its binding site opens to the other side, and the glucose is released there. When that happens, in which direction, and whether energy is used, belong to the transport lessons. For now, the role: channel proteins and carrier proteins let ions and polar molecules cross the membrane.

**Visual action:**
1. **From the first frame**, `FluidMosaicMembrane` in `full` at left, the channel dimmed with its *no change of shape* tag, the `RoleGrid` at right; at *A carrier protein works another way*, `highlight:intrinsic-carrier`, label **carrier protein**.
2. At *Glucose is polar*, a glucose hexagon in the outside region, label *glucose (polar)*; at *does not cross the hydrophobic bilayer core readily*, it touches the heads away from any protein and rebounds (motion); at *it needs a transport protein*, it drifts toward the carrier.
3. At *in this example that protein is a carrier*, small type beside the carrier: *our example; which carrier, which direction and whether energy is used: 4.2.1*.
4. At *The carrier has a binding site*, the notch on the outer face is ringed, label **binding site**.
5. At *The glucose binds*, `carrier-bind`: the glucose seats in the notch (0.6 s), tag *process: 4.2.1*.
6. At *the carrier changes shape*, the one-run shape-change preview: the carrier's silhouette interpolates over 0.8 s so the notch faces the cytoplasm (motion, no cut), tag *preview; process: 4.2.1*; at *the glucose is released there*, the glucose leaves into the cytoplasm (0.5 s); the carrier holds its flipped outline, dimmed.
7. At *When that happens, in which direction*, three small hand-off tags line up under the carrier: *when* · *which direction* · *energy?*, each tagged **4.2.1**; no arrow and no ATP token are drawn.
8. At *For now, the role*, the channel brightens again beside the carrier; at *channel proteins and carrier proteins let ions and polar molecules cross*, a Na⁺ token passes through the channel while a label joins the two proteins: **transport: channel proteins and carrier proteins**; the grid cell *proteins × transport* completes: **channel proteins · carrier proteins**.

**On-screen text:** *carrier protein*; *glucose (polar)*; *binding site*; the "our example" small type; *process: 4.2.1*; *preview; process: 4.2.1*; the hand-off tags; *transport: channel proteins and carrier proteins*; the grid cell.

---

### BEAT 7 · EXAM CONTRAST E43: the word "membrane" · 4:33–5:44
**Narration:**
> Now an exam contrast, on the card. It comes from a November 2022 mark scheme, on a part that credited ions moving through a membrane protein. Read this answer.
>
> *(silent read, 4 s)*
>
> Look at the word membrane here. It can feel right, since the bilayer really is a barrier to ions, and the bilayer is most of what you picture when you think of a membrane. But the membrane also holds the channel and carrier proteins you have just watched at work, so the answer rules out the very route the ions use. That scheme lists this exact wording as ignore: at that point it earns nothing. It is a ruling on one question, not a count of how many candidates wrote it. So, in place: the ions cannot cross the hydrophobic core of the bilayer; they cross the membrane through channel or carrier proteins.

**Visual action:**
1. **From the first frame**, the Beat 6 membrane (channel and carrier labelled) holds at left, **dimmed**, beside the space where the card will land. **Entry cue: *Now an exam contrast*.** The **EXAM CONTRAST** panel enters (header badge **EXAM CONTRAST**, terracotta border, desaturated surround) with its basis line in small type: *basis: mark-scheme ignore line, W22/23 Q6(a), MS p.19; an ignore line, not evidence of how often candidates write this*. It **stays on until the completed correct frame**.
2. At *a November 2022 mark scheme*, the header lands: **How do the ions cross the cell surface membrane?** with small type *our framing of W22/23 Q6(a) (the question's own wording and context are not reproduced: UNVERIFIED); constructed answer, not a transcript*.
3. At *Read this answer*, the written wrong answer appears in handwriting style: **✗ The ions are charged, so they cannot pass through the membrane.**
4. **Silent read, 4 s.** Panel and card held; nothing moves.
5. At *Look at the word membrane here*, the word *membrane* on the card is underlined in terracotta.
6. At *the bilayer really is a barrier to ions*, the dimmed membrane's tail region brightens alone, tag *bilayer core: yes, a barrier*; at *most of what you picture*, a side-note on the card: *membrane ≠ bilayer alone*.
7. At *also holds the channel and carrier proteins*, the dimmed channel and carrier brighten on the membrane and a Na⁺ token passes through the channel (motion); at *rules out the very route the ions use*, an arrow runs from the underlined word to the channel, side-note *the protein route*.
8. At *That scheme lists this exact wording as ignore*, citation tab, exact: **W22/23 Q6(a), MS p.19: I ‘ions cannot pass through the membrane’** (PDF-CHECKED (plan check)), small type *credited at that part: ion transport through a membrane protein, any one point (our paraphrase)*; at *at that point it earns nothing*, the I is ringed, small type *I = ignore: earns nothing at that point*.
9. At *It is a ruling on one question*, boundary tab beneath in the normal accent: **local ruling: W22/23 Q6(a); not a global word ban, not evidence of how common it is**.
10. At *So, in place*, the word *membrane* is struck and replaced in place; at *cannot cross the hydrophobic core of the bilayer*, the replacement lands: *hydrophobic core of the phospholipid bilayer*; at *they cross the membrane through channel or carrier proteins*, the clause lands after it: *; they cross the membrane through channel proteins or carrier proteins.* The card now reads **✓ The ions are charged, so they cannot pass through the hydrophobic core of the phospholipid bilayer; they cross the membrane through channel proteins or carrier proteins.** **The marker clears on this completed frame.** **Exit cue: end of *through channel or carrier proteins*.** Treatment lifts; the corrected card and the boundary tab hold; the membrane returns to full brightness.

**On-screen text:** the EXAM CONTRAST panel and basis line; the framed header and caption; the card; the MS tab; *I = ignore*; the boundary tab; the corrected card.

---

### BEAT 8 · Fluidity: moving phospholipids and cholesterol · 5:44–6:33
**Narration:**
> Next, fluidity. The phospholipids are not fixed in place: they jiggle and drift sideways within their own layer, and many proteins drift too, more slowly. That movement is what fluid means in fluid mosaic. Cholesterol, in animal cell membranes, helps regulate it. In the usual account, at higher temperatures cholesterol restrains the phospholipids' movement, so the membrane is less fluid than it would otherwise be; at lower temperatures it sits between the tails and stops them packing tightly together, so the membrane stays more fluid. Either way, it helps keep the membrane's fluidity steadier as temperature changes.

**Visual action:**
1. **From the first frame**, `FluidMosaicMembrane` in `full` at left, the `RoleGrid` at right; at *Next, fluidity*, the grid's **fluidity** column lights.
2. At *they jiggle and drift sideways within their own layer*, `highlight:` the phospholipids; two neighbouring phospholipids are tinted and drift sideways past each other (≤ 1 token width per 2 s), tag *sideways, within one layer; never flipping between layers*.
3. At *many proteins drift too, more slowly*, the glycoprotein drifts a shorter distance; at *what fluid means in fluid mosaic*, the word **fluid** lands above the membrane; the grid cell *phospholipids × fluidity* fills: **move sideways: fluid**.
4. At *Cholesterol, in animal cell membranes*, `highlight:cholesterol`, label **cholesterol (animal cell membranes)**; at *helps regulate it*, the grid's **cholesterol** row lights.
5. At *In the usual account*, the `cholesterol-qualitative` inset opens beside the membrane with its caption **qualitative schematic; not measured data** on screen throughout; at *at higher temperatures*, the top row runs: the *no cholesterol* strip jitters widely; at *restrains the phospholipids' movement*, the *with cholesterol* strip jitters visibly less beside its cholesterol.
6. At *at lower temperatures it sits between the tails*, the bottom row runs: in the *no cholesterol* strip the tails slide together and pack closely, motion nearly stopping; at *stops them packing tightly together*, in the *with cholesterol* strip the rings hold the tails apart and they keep moving slowly.
7. At *helps keep the membrane's fluidity steadier*, both *with cholesterol* strips brighten together; the grid cell *cholesterol × fluidity* fills: **regulates fluidity**.

**On-screen text:** *sideways, within one layer; never flipping between layers*; *fluid*; *cholesterol (animal cell membranes)*; the inset's row captions (*higher temperature*, *lower temperature*, *no cholesterol*, *with cholesterol*) and **qualitative schematic; not measured data**; two grid cells.

---

### BEAT 9 · Stability: cholesterol and the carbohydrate chains · 6:33–7:13
**Narration:**
> Cholesterol does more than that. Its rigid rings sit among the tails, which helps make the membrane more stable, and by filling spaces between the tails it helps make the bilayer even less permeable to small polar molecules and ions. So cholesterol appears three times on the grid. The carbohydrate chains of glycolipids and glycoproteins help stability too. They project from the outer surface into the watery surroundings, and because they are hydrophilic they form hydrogen bonds with the water there.

**Visual action:**
1. **From the first frame**, `FluidMosaicMembrane` in `highlight:cholesterol` at left (the qualitative inset closed), the `RoleGrid` at right; at *Cholesterol does more than that*, the cholesterol molecules in both leaflets pulse.
2. At *Its rigid rings sit among the tails*, the ring structure of each cholesterol is outlined among the tails; at *helps make the membrane more stable*, the grid's **stability** column lights and the cell *cholesterol × stability* fills: **helps stability**.
3. At *by filling spaces between the tails*, the gaps beside each cholesterol are shaded, then filled by its outline; at *even less permeable to small polar molecules and ions*, a small polar token and a Na⁺ token rebound from the cholesterol region (motion); the cell *cholesterol × permeability* fills: **reduces permeability to small polar molecules and ions**.
4. At *cholesterol appears three times on the grid*, the three filled cholesterol cells pulse in turn.
5. At *The carbohydrate chains of glycolipids and glycoproteins*, `highlight:` switches to `glycolipid`, `glycoprotein` and `receptor-glycoprotein`, their green chains brightening; labels **glycolipid**, **glycoprotein**.
6. At *project from the outer surface*, the outer face is traced, tag *chains on the outer face only*; at *form hydrogen bonds with the water there*, pale blue water tokens gather around the chains and short dashed lines (hydrogen bonds, schematic) flicker between chain beads and water tokens; the cells *glycolipids × stability* and *glycoproteins × stability* fill: **chains H-bond with water**.

**On-screen text:** three cholesterol grid cells; *chains on the outer face only*; dashed hydrogen bonds labelled *hydrogen bonds (schematic)*; two chain grid cells.

---

### BEAT 10 · Cell signalling: receptors · 7:13–8:01
**Narration:**
> Now cell signalling. Some glycoproteins, and some other proteins, act as cell surface receptors. This one has a binding site on its outer face, with a shape complementary to a particular signalling molecule. The signalling molecule arrives and binds to the binding site, and that binding leads to a response inside the cell. Not every glycoprotein is a receptor, and the stages of signalling, from the cell that releases the molecule to the response, have a lesson of their own. Written properly: a receptor has a binding site complementary in shape to its signalling molecule.

**Visual action:**
1. **From the first frame**, `FluidMosaicMembrane` in `full` at left, the `RoleGrid` at right; at *Now cell signalling*, the grid's **cell signalling** column lights.
2. At *act as cell surface receptors*, `highlight:receptor-glycoprotein`, label **cell surface receptor (a glycoprotein)**; `ReceptorLigand` `rest`.
3. At *a binding site on its outer face*, the cup is ringed, label **binding site**; at *complementary to a particular signalling molecule*, ligand A drifts into view in the outside region, label **signalling molecule**, and a dashed outline of the cup appears over the wedge's lower edge, matching it.
4. At *arrives and binds to the binding site*, `bind-basic`: ligand A approaches along the membrane normal and seats flush (0.8 s).
5. At *leads to a response inside the cell*, the static arrow appears beneath the receptor in the cytoplasm, label *leads to a response in the cell (stages: 4.1.4)*; no pulse and no pathway are drawn.
6. At *Not every glycoprotein is a receptor*, the plain `glycoprotein` at position 12 is ringed, tag *a glycoprotein; not a receptor in this model*; at *have a lesson of their own*, a hand-off tag **secretion → transport → binding: 4.1.4**.
7. At *Written properly*, the sentence surface slides up beneath; at *a receptor has a binding site complementary in shape*, it builds clause by clause beside the seated ligand: **A receptor has a binding site complementary in shape to its signalling molecule.**; the cells *proteins × cell signalling* and *glycoproteins × cell signalling* fill: **some are receptors**.

**On-screen text:** *cell surface receptor (a glycoprotein)*; *binding site*; *signalling molecule*; *leads to a response in the cell (stages: 4.1.4)*; *a glycoprotein; not a receptor in this model*; the hand-off tag; the sentence; two grid cells.

---

### BEAT 11 · Cell recognition: antigens · 8:01–8:35
**Narration:**
> Last, cell recognition. Glycoproteins and glycolipids, with their carbohydrate chains, act as cell surface antigens: markers on the outside of the cell that other cells can recognise. That is how cells can be identified, and it is part of how the body recognises its own cells, which you will meet with immunity. Notice again where the chains sit, on the outer face, where other cells can meet them.

**Visual action:**
1. **From the first frame**, `FluidMosaicMembrane` in `full` at left, the `RoleGrid` at right; at *Last, cell recognition*, the grid's **cell recognition** column lights.
2. At *Glycoproteins and glycolipids, with their carbohydrate chains*, `highlight:` the `glycolipid`, `glycoprotein` and `receptor-glycoprotein`, their chains brightening.
3. At *act as cell surface antigens*, the label **cell surface antigens** lands, a bracket joining the chain-bearing molecules; at *markers on the outside of the cell*, the chains pulse green on the outer face.
4. At *other cells can recognise*, a second cell outline (schematic, no detail) approaches from the upper right in the outside region and its surface edge comes close to the chains, tag *recognition*; it drifts away again (no binding event drawn).
5. At *how the body recognises its own cells*, a small hand-off tag: **self and non-self: 11.1.2**; small type *named here, taught with immunity*.
6. At *where the chains sit, on the outer face*, the outer face is traced, tag *chains on the outer face only*; the cells *glycolipids × cell recognition* and *glycoproteins × cell recognition* fill: **antigens**.

**On-screen text:** *cell surface antigens*; *recognition*; *self and non-self: 11.1.2*; *chains on the outer face only*; two grid cells.

---

### BEAT 12 · What I told you, on the membrane · 8:35–9:10
**Narration:**
> So here it is, on the membrane. Phospholipids: a hydrophobic core that lets small non-polar molecules through and is a barrier to ions and polar ones, and sideways movement that makes the membrane fluid. Cholesterol: regulates fluidity, helps stability and reduces permeability. Proteins: channels and carriers for transport, and some as receptors for signalling. Glycoproteins: receptors, recognition and stability. Glycolipids: recognition and stability. Six roles, five kinds of molecule, one membrane.

**Visual action:** **No new slide.** The screen returns to the layout built through the lesson: `FluidMosaicMembrane` in `full` at left with its channel, carrier and receptor labels, the seated ligand A, and the `RoleGrid` at right, now complete. Static. Key points fade in in place:
1. **From the first frame**, the membrane and the completed `RoleGrid` settle; at *on the membrane*, nothing moves.
2. At *Phospholipids: a hydrophobic core*, the tail region and **partially permeable** brighten with the grid's phospholipids row; at *is a barrier to ions and polar ones*, the tag **barrier to ions and polar molecules** brightens; at *sideways movement*, the word **fluid** brightens.
3. At *Cholesterol: regulates fluidity*, both cholesterol molecules and their three grid cells brighten.
4. At *Proteins: channels and carriers for transport*, the channel and carrier brighten with **channel proteins · carrier proteins**; at *some as receptors for signalling*, the receptor and seated ligand brighten with **binding site**.
5. At *Glycoproteins: receptors, recognition and stability*, the glycoprotein chains and their three grid cells brighten; at *Glycolipids: recognition and stability*, the glycolipid chain and its two grid cells brighten.
6. At *Six roles, five kinds of molecule*, the column headers and row headers brighten together; at *one membrane*, the whole layout holds.

---

### BEAT 13 · How it is asked, the reject card, and the sodium ion · 9:10–10:02
**Narration:**
> How does this reach you? One form asks why a particular substance needs a transport protein: a polar substance in a June 2023 paper, sodium ions in March 2024. The credited idea links the substance, polar or charged, to the hydrophobic core of the bilayer; in the June 2023 scheme, size alone, or just naming facilitated diffusion, earned nothing at that point. Another, in March 2024, asks for one role of cholesterol. The reject card: naming the process is not the reason. And the sodium ion? It is charged, so the hydrophobic core turns it back, and a channel protein lets it through.

**Visual action:**
1. **From the first frame**, the familiar lesson layout stays on screen at right (reduced): `FluidMosaicMembrane` with its labels and the completed `RoleGrid`; at *How does this reach you?*, a compact forms surface enters at left, one row per form, each beside its visual. Two rows are revealed with the surface at this cue (not narrated), in small type: **explain how a steroid hormone crosses the membrane** · *S21/22 Q3(b), 2 marks, QP p.6 / MS p.12: non-polar/lipid-soluble; passes through the bilayer (our paraphrase of the plan-check description)*, with an O₂-style crossing through the core beside it; and **adjacent only:** *S21/22 Q3(c), MS p.12, a cytoplasmic receptor, not a cell-surface role: "Reject if hormone S or receptor R described as an antigen or enzyme"* (PDF-CHECKED (plan check)).
2. At *why a particular substance needs a transport protein*, row 1: **explain why this substance needs a transport protein**; at *a polar substance in a June 2023 paper*, its citation: *S23/21 Q3(a), 1 mark, MS p.11*; at *sodium ions in March 2024*, the second citation: *M24/22 Q1(b)(i), 1 mark, MS p.5 (sodium ions)*; a Na⁺ token beside the row.
3. At *The credited idea links the substance*, small type under row 1: *credited: polar / water-soluble / hydrophilic, or charged, and the hydrophobic (non-polar) bilayer core (our paraphrase of the plan-check descriptions; exact MS wording UNVERIFIED)*; the membrane's **hydrophobic core** bracket brightens.
4. At *size alone, or just naming facilitated diffusion*, small type: *S23/21 Q3(a): size-only, active transport and facilitated diffusion ignored at that point (our paraphrase of the plan-check description)*.
5. At *asks for one role of cholesterol*, row 2: **state one role of cholesterol** · *M24/22 Q1(a)(iii), 1 mark, MS p.5*, with the three cholesterol grid cells brightening beside it; small type *accepted roles in that scheme: UNVERIFIED; the grid shows the roles taught here*.
6. At *The reject card*, the reject card lands beneath the forms, struck through by hand: **✗ Glucose needs a transport protein because it moves by facilitated diffusion.** / **✓ Glucose is polar, so it does not cross the hydrophobic core of the phospholipid bilayer readily; it needs a transport protein.** Caption in small type: *our wording contrast, based on the plan-check description of S23/21 Q3(a), MS p.11; not the scheme's wording*.
7. At *And the sodium ion?*, the Beat 1 hook caption returns small above the membrane; at *the hydrophobic core turns it back*, a Na⁺ token rebounds from the tails (motion); at *a channel protein lets it through*, it passes through the channel into the cytoplasm. Final frame held 2 s: forms at left, the membrane, grid and reject card at right. No slogan.

**On-screen text:** the forms with citations and small type; the adjacent S21/22 Q3(c) line; the reject card and caption; the hook caption.

---

## Datasets

No dataset. This lesson plots no measurement and states no numerical result. The only numbers on screen are exam marks and page references (see *Citations*) and schematic model timings (0.6 s, 0.8 s, 0.5 s, 1.2 s), which are animation durations, not measurements. Token counts in every particle scene are schematic (*particles drawn schematically; not to scale; far fewer than real*). The `cholesterol-qualitative` inset carries no values of any kind (*qualitative schematic; not measured data*); no temperature is named.

## Real-world samples

| Material | What the method responds to | Fit (range, clarity) | Interferences and how the method handles them | Beats |
|---|---|---|---|---|
| none handled | — | — | — | — |

No real material is handled: this lesson is taught entirely on drawn models. **Explain-beat real-world examples** (each an example on a model, not a handled sample): oxygen entering a red blood cell across its bilayer (Beat 4 inset; the red blood cell is 4.1.1-2's named example cell, outside = plasma); glucose needing a protein route (Beats 4 and 6, the plan-check sentence; its direction and energy handed to 4.2.1); sodium ions crossing through a channel protein (Beats 1, 5, 13; the M24/22 Q1(b)(i) substance). No example is added without a verified content source: the ABO blood-group example is omitted (UNVERIFIED 3).

---

## Scope ledger

### Syllabus requirement → beats

| Requirement (p.21) | Beat(s) | How |
|---|---|---|
| describe the roles of phospholipids | 4, 8, 12 | hydrophobic core: barrier to ions and polar molecules, small non-polar molecules cross (permeability); lateral movement (fluidity) |
| … cholesterol | 8, 9, 12, 13 | regulates fluidity (qualitative schematic, should-fix 3), helps stability, reduces permeability to small polar molecules and ions; "in animal cell membranes" |
| … glycolipids | 9, 11, 12 | chains hydrogen-bond with water (stability); cell surface antigens (recognition) |
| … proteins | 5, 6, 10, 12 | channel and carrier proteins (transport); some proteins as receptors (signalling) |
| … glycoproteins | 9, 10, 11, 12 | chains hydrogen-bond with water (stability); some are receptors (signalling); antigens (recognition) |
| stability | 9, 12 | cholesterol; carbohydrate chains |
| fluidity | 8, 12 | phospholipids drift sideways; cholesterol regulates |
| permeability | 4, 9, 12, 13 | hydrophobic core; partially permeable; cholesterol reduces permeability |
| transport (carrier proteins and channel proteins) | 5, 6, 7, 12 | `channel-open` (pore, no shape change); `carrier-bind` + labelled shape-change preview; E43 |
| cell signalling (cell surface receptors) | 10, 12 | `ReceptorLigand` `rest`, `bind-basic`; binding site; response named only; stages handed to 4.1.4 |
| cell recognition (cell surface antigens – see 11.1.2) | 11, 12 | antigens named and located; self/non-self handed to 11.1.2 |
| in cell surface membranes | 1, 3, 4 | the membrane of a cell; red blood cell example |

### Mark-scheme and examiner points → beats

| Source | Point | Beat |
|---|---|---|
| W22/23 Q6(a), MS p.19 | I ‘ions cannot pass through the membrane’; credit: ion transport through a membrane protein (paraphrase) | 7 (E43) |
| S23/21 Q3(a), MS p.11 | polar/water-soluble/hydrophilic and the bilayer core credited; size-only, active transport, facilitated diffusion ignored at that point (paraphrase) | 4, 6 (teaching), 13 (form, reject card) |
| M24/22 Q1(b)(i), MS p.5 | sodium ions' charge and the hydrophobic/non-polar bilayer (paraphrase) | 5 (teaching), 13 (form, callback) |
| M24/22 Q1(a)(iii), MS p.5 | one role of cholesterol (description; accepted roles UNVERIFIED) | 8, 9 (teaching), 13 (form) |
| S21/22 Q3(b), QP p.6 / MS p.12 | steroid hormone crosses the bilayer: non-polar/lipid-soluble, bilayer passage (paraphrase) | 4 (property taught with O₂), 13 (row shown, not narrated) |
| W22/23 Q5(a)(i), MS p.17 | receptor identity/location/complementarity (paraphrase); R active site belongs to 4.1.4's E44 | 10 (binding-site wording) |
| M24/22 Q1(c)(iii), MS p.7 | outline cell signalling (owned by 4.1.4; receptor-role overlap) | 10 (hand-off) |
| S21/22 Q3(c), MS p.12 | adjacent only: cytoplasmic receptor; "Reject if hormone S or receptor R described as an antigen or enzyme" | 13 (small type, labelled adjacent) |

### Absolutes sweep (own)

Every narrated sentence containing *all, every, always, never, only, no, nothing, cannot, because, must, needs* and the causal *so* / *since* was reread with one question: true of all cases, or of the case on screen?
- Beat 1: "gets turned back unless a protein lets it through" — the hook's description of the bilayer core versus the protein route, answered in Beats 4–5; "tiny as it is" contrasts size with charge without making a size claim against any other molecule. "It has to keep … It has to stay …" — what a cell surface membrane manages; no "must", no universal claim about every membrane type. "because different molecules in it do different jobs" — the lesson's spine, a description of division of roles, not a cause of every property.
- Beat 3: "A membrane that let nothing across and carried no signals would cut a cell off from everything it needs" — a counterfactual, framed as hypothetical ("would"), shown as a ghost labelled *not how a membrane works*.
- Beat 4: "with very little water in it" (not "no water"); "Small non-polar molecules such as oxygen and carbon dioxide pass straight through" — named examples, the plan's wording; "so they do not cross it readily" — "readily", not "cannot"; "Written properly: … its hydrophobic core is a barrier to ions and polar molecules" — the plan's permeability statement; "That is why the membrane is partially permeable" — the plan's own causal link.
- Beat 5: "so the ion passes through without touching the hydrophobic core" — the channel on screen; "Each kind of channel lets particular ions or polar molecules through; different channels pass different ones" — should-fix 6 ("particular"); "keeps its shape the whole time" — this channel in this model (SHARED-SPECS: "the channel never changes shape"), said of the drawing, not a claim about gating (out of scope).
- Beat 6: "Glucose is polar and does not cross the hydrophobic bilayer core readily; it needs a transport protein" — the plan check's MF2 sentence verbatim as teaching wording; "in this example that protein is a carrier" — bounded to our example; direction and energy explicitly not claimed ("belong to the transport lessons"). "so its binding site opens to the other side" — this carrier's preview. "channel proteins and carrier proteins let ions and polar molecules cross the membrane" — the role; no "all".
- Beat 7 (E43): "It can feel right, since the bilayer really is a barrier to ions" — a possibility, not examiner testimony. "so the answer rules out the very route the ions use" — about the written answer, pointing at its word. "That scheme lists this exact wording as ignore: at that point it earns nothing" — the I line, stated as that scheme's ruling at that point; "It is a ruling on one question, not a count of how many candidates wrote it" — keeps the badge truthful (MF2). "the ions cannot cross the hydrophobic core of the bilayer" — "cannot" bounded to the core, the plan's E43 repair.
- Beat 8: "many proteins drift too" — "many", not all; "Cholesterol, in animal cell membranes, helps regulate it. In the usual account …" — bounded; "so the membrane is less fluid than it would otherwise be" / "so the membrane stays more fluid" — comparative, inside the usual account; "helps keep … steadier" — no absolute.
- Beat 9: "which helps make the membrane more stable"; "it helps make the bilayer even less permeable" — "helps", the plan's wording; "even less" keeps Beat 4's "barrier" relative (the core is not claimed to stop every small polar molecule, e.g. water, completely). "because they are hydrophilic they form hydrogen bonds with the water there" — the chains on screen; hydrophilic chains hydrogen-bonding with water is the plan's stated mechanism ("can help stability by forming hydrogen bonds").
- Beat 10: "Some glycoproteins, and some other proteins" — "some"; "complementary to a particular signalling molecule" — "particular", not "one molecule only"; "Not every glycoprotein is a receptor" — the plan's guard, itself a correct negative.
- Beat 11: "markers on the outside of the cell that other cells can recognise" — "can"; "That is how cells can be identified" — "can"; "part of how the body recognises its own cells" — "part of", not "the basis", so no claim that chains alone decide self-recognition; "on the outer face, where other cells can meet them" — the model's fixed rule for cell surface membranes, stated for this membrane.
- Beat 12: "Proteins: channels and carriers for transport, and some as receptors" — "some"; no absolute added in the recap.
- Beat 13: "One form asks …", "Another … asks" — forms in the cited papers, no frequency; "in the June 2023 scheme, size alone, or just naming facilitated diffusion, earned nothing at that point" — the plan-check description of S23/21 Q3(a), past tense, "at that point"; "It is charged, so the hydrophobic core turns it back, and a channel protein lets it through" — the hook's sodium ion on screen; the M24/22 idea (charge + hydrophobic core).
- No sentence says ions cannot cross the membrane, that glucose crosses by facilitated diffusion, that glucose is "too big", that every glycoprotein is a receptor, that every carbohydrate chain is an ABO antigen, that cholesterol is in every membrane or "makes the membrane rigid" as its whole role, that "intrinsic" means "transmembrane", or that a channel changes shape to move a solute.

---

## Citations

Every quotation in this storyboard, where it appears, and the verified file it was copied from. Nothing is quoted from an exam PDF directly; none was opened.

| # | Quotation (verbatim) | Paper / session / question / page | Beat(s) | Copied from | Status |
|---|---|---|---|---|---|
| 1 | "describe the roles of phospholipids, cholesterol, glycolipids, proteins and glycoproteins in cell surface membranes, with reference to stability, fluidity, permeability, transport (carrier proteins and channel proteins), cell signalling (cell surface receptors) and cell recognition (cell surface antigens – see 11.1.2)" | Syllabus 2025–2027, 4.1.3, p.21 | header; `RoleGrid` caption | `SYLLABUS-9700-DETAIL.md` | syllabus (not an exam row) |
| 2 | I ‘ions cannot pass through the membrane’ | W22/23 Q6(a), MS p.19 (November 2022, 9700/23) | spine; 7 (MS tab) | `work/006/SHARED-SPECS.md` §2; `TOPIC-04-WEIGHTS.md` E43; plan §4.1.3 E43 | **PDF-CHECKED (plan check)** |
| 3 | "Reject if hormone S or receptor R described as an antigen or enzyme" | S21/22 Q3(c), MS p.12 (June 2021, 9700/22) — adjacent evidence only (cytoplasmic receptor) | spine; 13 (small type, labelled adjacent) | `work/006/SHARED-SPECS.md` §2; `TOPIC-04-WEIGHTS.md` ledger | **PDF-CHECKED (plan check)** |

Descriptions cited without quotation marks (our paraphrase of the plan check's descriptions, never on a quote card): S23/21 Q3(a), MS p.11 (June 2023, 9700/21; **PDF-UNCHECKED** as wording — description only); M24/22 Q1(b)(i), MS p.5 and Q1(a)(iii), MS p.5 (March 2024, 9700/22; **PDF-UNCHECKED** as wording — description only); S21/22 Q3(b), QP p.6 / MS p.12 (**PDF-UNCHECKED** as wording — description only); W22/23 Q5(a)(i), MS p.17 and M24/22 Q1(c)(iii), MS p.7 (hand-offs to 4.1.4; **PDF-UNCHECKED** as wording — description only).

**UNVERIFIED items** (not quoted; shown only as our framing or omitted):
1. `UNVERIFIED — the question wording and context of W22/23 Q6(a), and its MS wording beyond the I line.` Beat 7's header is labelled **our framing**; the narration says only that the part "credited ions moving through a membrane protein" (the plan check's description).
2. `UNVERIFIED — exact MS wording of S23/21 Q3(a), M24/22 Q1(b)(i) and M24/22 Q1(a)(iii), including which cholesterol roles M24/22 accepts.` Beat 13 shows the plan-check descriptions as paraphrase in small type; the cholesterol row says *accepted roles in that scheme: UNVERIFIED*.
3. `UNVERIFIED — a content source for the ABO-antigen example (4.1.3).` I cannot open external sources, so no verified content source exists at storyboard stage; per the plan and plan check ("Retain ABO only with a verified content source at storyboard stage"), **the ABO example is omitted**. Beat 11 teaches antigens without a named blood-group system.
4. `UNVERIFIED — the question wording of S23/21 Q3(a) and of M24/22 Q1(b)(i).` Beat 13 names them only as "why a particular substance needs a transport protein" (our framing); the substance in S23/21 Q3(a) is identified in the plan check as glucose, and the narration says "a polar substance".
5. `UNVERIFIED — S21/22 Q3(b) MS wording beyond the plan-check description.` Beat 13 row shown in small type as paraphrase.
6. `UNVERIFIED — a marked question on glycolipid/glycoprotein stability or on cell surface antigens in the cited blocks.` None is in the ledger; Beats 9 and 11 rest on the syllabus and the plan only, and no exam form is claimed for them.

---

## Word count and runtime

Counted by the validator over the blockquoted narration, silent-read line excluded; seconds = words ÷ 120 × 60.

| Beat | Title | Kind | Words | Seconds |
|---|---|---|---:|---:|
| 1 | Hook and context | teaching | 93 | 46.5 |
| 2 | What you will be able to do | teaching | 53 | 26.5 |
| 3 | The membrane, and why its parts matter | teaching | 94 | 47.0 |
| 4 | Permeability: the hydrophobic core | teaching | 108 | 54.0 |
| 5 | Transport: channel proteins | teaching | 97 | 48.5 |
| 6 | Transport: carrier proteins | teaching | 101 | 50.5 |
| **7** | **EXAM CONTRAST E43** | **error** | **142** | **71.0** |
| 8 | Fluidity | teaching | 97 | 48.5 |
| 9 | Stability | teaching | 81 | 40.5 |
| 10 | Cell signalling | teaching | 95 | 47.5 |
| 11 | Cell recognition | teaching | 68 | 34.0 |
| 12 | Recap | teaching | 71 | 35.5 |
| 13 | Exam close | teaching | 103 | 51.5 |
| **Teaching (12 beats)** | | | **1,061** | **530.5** (8:50.5) |
| **Error (1 beat)** | | | **142** | **71.0** (1:11) |
| **Total (13 beats)** | | | **1,203** | **601.5** (10:01.5) |
| Budget | | | 1,230 | 615 (10:15) |

**Length, honestly:** **1,203 words = 10:01.5** at 120 words per minute, **13.5 s under** the 10:15 budget. The twelve teaching beats total **1,061 words = 8:50.5**, 9.5 s under the 9:00 teaching allowance; E43 is **142 words = 71 s**, inside the five-move 65–75 s range and 4 s under its 75 s reservation (the 4 s silent read is inside the effective rate and is not added again). No cut list is needed. If the checker adds words (for example to a talk-through or a qualifier), the first teaching repetition to cut is Beat 12's closing "Six roles, five kinds of molecule, one membrane." (8 words), then Beat 3's "Now the question is what each of them does." (9 words); E43 is never thinned.

## What I left out, and who owns it

| Left out | Owner |
|---|---|
| How the bilayer forms; where each component sits (arrangement) | 4.1.1-2 (recalled by label in Beat 3) |
| The stages of signalling (secretion, transport, binding), specificity shown by a wrong ligand failing to seat, the named response, E44 (R active site) | 4.1.4 (hand-off tags in Beat 10) |
| Diffusion, facilitated diffusion and active transport as processes; direction relative to a gradient; ATP; the full carrier cycle including `carrier-reset`; E45 ("glucose was too large") | 4.2.1a, 4.2.1b (hand-off tags in Beats 4 and 6) |
| Self / non-self, immune responses, antigen presentation | 11.1.2 (named only, Beat 11) |
| ABO blood-group antigens | omitted: no verified content source (UNVERIFIED 3) |
| Named channel families, gating, membrane potentials, enzyme roles of membrane proteins, lipid rafts | not in the outcome (plan ceiling; calibration §4 DO-NOT-ADD) |
| Temperature values, fluidity measurements, cholesterol synthesis | not in the outcome; the inset is qualitative only |
| Ligand B and any cytoplasmic-receptor pathway | 4.1.4 (`wrong-ligand-fail`); S21/22 Q3(c) adjacent only |

## Reusable models

| Model | Specified | For |
|---|---|---|
| **`TransportProteinSet`** `channel-open` (pore, water-filled, no shape change) and `carrier-bind` (notch, 0.6 s seat), plus the one-run shape-change preview built on SHARED-SPECS `carrier-flip`/`carrier-release` timings | here | 4.2.1a (adds the full passive states `carrier-flip`, `carrier-release`, `carrier-reset` and gradients), 4.2.1b (`pump-ATP`), 4.2.2a (comparison) |
| **`ReceptorLigand`** `rest`, `bind-basic` (0.8 s flush seat; same geometry as `seat`) | here | 4.1.4 (adds `wrong-ligand-fail`, `seat` (aliasable to `bind-basic`), `response-pulse`/`response-uptake`), 4.2.1b (E47 vocabulary recall) |
| **`FluidMosaicMembrane`** `cholesterol-qualitative` | here | the 4.1 notes; any later recall of cholesterol's role |
| **`RoleGrid`** (5 × 6, final state above) | here | the 4.1 notes and questions; 4.1.4 may recall the signalling column |
| `FluidMosaicMembrane` (`full`, `highlight:<id>`), `PhospholipidToken` | 4.1.1-2 | used here by state id |

---

## Assets

| Asset | Status | Source |
|---|---|---|
| `FluidMosaicMembrane` (`full`, `highlight:<id>`) | reuse | 4.1.1-2 |
| `cholesterol-qualitative` split inset | **new build** | authored; qualitative only, caption on screen throughout |
| `TransportProteinSet` `channel-open`, `carrier-bind` and the shape-change preview | **new build** | authored; silhouette interpolation (no cut); matches SHARED-SPECS timings |
| `ReceptorLigand` `rest`, `bind-basic`; ligand A | **new build** | authored |
| `RoleGrid` panel with row thumbnails and leader lines | **new build** | authored; labels as SVG text nodes |
| Tokens: O₂, Na⁺ (with water halo), glucose (with water halo), ligand A; water tokens; dashed hydrogen-bond marks | new, schematic | authored in SHARED-SPECS colour roles |
| Hook cell outline with magnifier window; red blood cell inset; ghost "solid wall" band; second-cell outline (recognition); oil-and-water beaker icon | new, schematic vector | authored; no photograph, no generated image |
| Objectives pictograms (five component icons, six-tile icon, ion-and-gap icon, tick-tab); EXAM CONTRAST panel; E43 card; forms surface; reject card | new card content; shared panel and surfaces | authored; panel from Topics 1–3 (label prop EXAM CONTRAST) |
| Handling | none | no apparatus is handled in this lesson; no still-frame handling verification is needed. Rendered still-frame verification pending for model orientation (heads to water, chains on the outer face, no flip-flop) and for the channel keeping its shape |
| Micrographs, photographs, Cambridge artwork | none | — |

---

## Plan interpretations

1. **Carrier preview: "static" versus "binds and changes shape".** SHARED-SPECS §4 and the brief call 4.1.3's `TransportProteinSet` contributions "static previews (`channel-open`, `carrier-bind`)"; the plan's 4.1.3 *Motion* paragraph says "a carrier binds and changes shape (preview only, labelled *process: 4.2.1*)", and VIDEO-STRUCTURE requires a narrated state change to be performed as motion. The plan wins (SHARED-SPECS preamble). I publish only `channel-open` and `carrier-bind` as states and add a **one-run** shape-change preview that uses SHARED-SPECS's `carrier-flip`/`carrier-release` geometry and timings exactly, labelled *preview; process: 4.2.1*, without reset, gradient, direction or energy. 4.2.1a still publishes the full passive states. "Static" is read as "no process claims", not "no motion": the channel itself never moves, and the ion's passage is motion.
2. **`ReceptorLigand` basic states versus `seat`.** SHARED-SPECS lists `seat` among 4.1.4's additions, yet the plan's 4.1.3 motion requires "a ligand seats in a receptor". I publish `rest` and `bind-basic` (the same 0.8 s flush seat), so 4.1.4 can alias `seat` to `bind-basic` rather than draw a second version. Ligand B is not shown (its failure to seat is 4.1.4's `wrong-ligand-fail`; showing it idle would be a picture of a fact). The response is a static labelled arrow, not `response-pulse`, which stays 4.1.4's.
3. **Cholesterol (should-fix 3).** Taken as the optional qualitative schematic, specified here as `FluidMosaicMembrane` state `cholesterol-qualitative` (the plan's model table lists it as an optional state of the published membrane). No temperature numbers, no fluidity scale, caption *qualitative schematic; not measured data* throughout. The roles are said with "helps", "in the usual account" and "in animal cell membranes".
4. **ABO.** The brief and plan allow ABO only with a verified content source; I cannot open external sources, so it is omitted and recorded (UNVERIFIED 3). Recognition is taught as "cell surface antigens" with self/non-self handed to 11.1.2.
5. **Six roles across five components.** The syllabus names five components and six role headings but does not assign them; the assignment in `RoleGrid` follows the plan's "What we teach" bullets exactly (phospholipids: permeability, fluidity; cholesterol: fluidity, stability, permeability; glycolipids and glycoproteins: stability via hydrogen bonds with water, recognition; proteins and glycoproteins: signalling; proteins: transport). Empty grid cells are drawn as faint dashes, never crosses, so the grid does not claim a component has no other role.
6. **Glucose.** The plan requires the plan-check sentence in 4.1.3; I use it verbatim as teaching wording (Beat 6, repeated in Beat 4 as "polar molecules … do not cross it readily") and tie glucose to *our example* carrier, with direction and energy handed to 4.2.1. E45 ("glucose was too large", R23 p.12) is 4.2.1a's and is not used here, although the Beat 13 narration mentions, as the plan-check description of S23/21 Q3(a), that size alone earned nothing at that point.
7. **Exam close.** The brief names the "why does this substance need a transport protein" forms (S23/21 Q3(a); M24/22 Q1(b)(i)) and one role of cholesterol (M24/22 Q1(a)(iii)) as the narrated forms. S21/22 Q3(b) (steroid, permeability overlap) is shown as an unnarrated row; S21/22 Q3(c) appears only as a small-type line labelled *adjacent only: a cytoplasmic receptor, not a cell-surface role*. W22/23 Q5(a)(i) and M24/22 Q1(c)(iii) are left to 4.1.4's close (E44 and its reject line belong there). The reject card is our wording contrast (no verbatim reject line exists for this form in the verified list), built from the plan-check description that S23/21 Q3(a) ignores facilitated diffusion at that point; it uses glucose, the plan check's identification of that question's substance.
8. **E43 card wording.** The register gives only the ignore line and the credited idea; the written answer ("The ions are charged, so they cannot pass through the membrane.") is constructed to contain the ignored wording, and the correction strikes the word *membrane* and adds the protein route, per the plan's repair ("ions cannot cross the phospholipid bilayer's hydrophobic core; they cross the membrane through channel proteins or carrier proteins"). The narration never reads the wrong sentence aloud; it names "the word membrane here". The header is our framing because the question's own wording is UNVERIFIED.
9. **Placement of E43.** After the two transport beats (Beat 7), so the correction can point at the channel and carrier the student has just watched, before fluidity and stability. This keeps the plan's 12 teaching + 1 error beats.
10. **Handle.** The plan leaves the handle to the author with the guard "no invented metaphor that could be written in an exam". *Oil and water don't mix* is an everyday image of hydrophobic exclusion, converted in the same beat into the credited sentence and tagged *handle, not the exam answer*.

---

## Validator run

`python3 work/006/validate_storyboard.py storyboards/topic-04/4.1.3/STORYBOARD.md`

```
== storyboards/topic-04/4.1.3/STORYBOARD.md
beat  words  cues maxgap  status
   1     93     9     17  ok
   2     53     5     14  ok
   3     94    11     24  ok
   4    108    13     17  ok
   5     97    13     12  ok
   6    101    12     16  ok
   7    142    15     16  ok
   8     97    12     15  ok
   9     81     9     15  ok
  10     95    10     21  ok
  11     68     7     16  ok
  12     71    11     11  ok
  13    103    11     21  ok
TOTAL words 1203  cues 138  runtime at 120 wpm 10:01.5  beats 13  failing beats 0
```
