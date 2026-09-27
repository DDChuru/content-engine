# Topic 4 shared models — CHANGELOG

Every later Topic 4 lesson copies these files byte for byte into its `src/` (see SHARED.md). Read this before building
on them. Newest first.

## 008f (27 Sep 2026) — fix pass after the independent video reviews of 4.1.1-2, 4.1.3, 4.1.4, 4.2.1a

### `FluidMosaicMembrane.tsx` — positions now match SHARED-SPECS literally; entry never opens a hole or crosses a glyph
- **Positions (review 4.1.1-2 #6, 4.1.3/4.1.4/4.2.1a #4).** SHARED-SPECS' positions are now implemented as 1-based
  slots counted left to right in `full` (1 slot = one phospholipid width u), and `SLOTS` exports them:
  glycolipid **2** (outer) · channel **4–5** · cholesterol **6** (outer) and **7** (inner) · receptor-glycoprotein
  **8–9** · carrier **10–11** · glycoprotein **12** · extrinsic under **3|4** (touching the heads at 3 and the channel's
  lower end). Slots 13–21 are phospholipids (outer 9 at unit spacing; the inner leaflet's remaining 8 spread over the
  same stretch). 12 phospholipids per leaflet in every state: outer at slots 1, 3, 7, 13–21; inner at 1, 2, 3, 6 and
  8 across 13–21. Consequences for layouts: receptor, carrier and glycoprotein are ADJACENT (8–12, no lipid between);
  the right third of the section is plain bilayer (useful label space above/below it); `full` is 20.65 u wide (the
  13–21 stretch is 8.65 u because its two leaflets hold 9 and 8 items). The old layout (21 slots, glycolipid at 3,
  channel 6–7, receptor 12–13, carrier 16–17, glycoprotein 19) is gone: **re-anchor every label from `compPos`/`plPos`
  / `fmmLayout`, never from remembered x values.** Phospholipid indices changed: outer 0 = slot 1, 1 = slot 3, 2 =
  slot 7, 3–11 = slots 13–21; inner 12–14 = slots 1–3, 15 = slot 6, 16–23 = the right stretch.
- **Entry (review 4.1.1-2 #1).** A component now enters AT ITS SEAT: its drawn footprint widens from zero (horizontal
  scale = `comps[k].sx`) while the neighbours on either side part by exactly that footprint. The first 20 % of `show`
  progress only lines the two leaflets up at the (zero-width) protein columns (lipids drift a fraction of a slot); the
  footprint grows over the remaining 80 %. The former sideways drift from the section's edge is removed: in a
  cross-section a spanning protein cannot travel sideways without passing over occupied lipid positions, and the
  lipids had to open a hole at the destination while it did. `entryFrom` is removed. `extrinsic` still rises from the
  cytoplasm (through water only). Lessons showing an entry must show the storyboard's construction caption (4.1.1-2 kit
  `BuildNote`).
- **Resting neighbours.** Lipids next to a protein column drift with the protein's (smaller) amplitude, so a resting
  lipid head never slides into a protein wall.
- **`compShift`** now moves the protein's whole run of adjacent columns (receptor + carrier + glycoprotein) and the
  stretches either side widen/narrow by the same amount (neighbours make way; nothing overlaps). `compPos`/`plPos`
  accept `compShift` too.
- **`fmm-selftest.cjs`** (new, run `node fmm-selftest.cjs` in this folder): asserts the `full` slots above, 12 lipids per
  leaflet, and sweeps every entry the lessons use (p = 0→1, step 0.005): no footprint overlap, no clear space > 0.62 u
  (a hole), no jump > 0.1 u per step. PASSED at this version.

### `VesicleTransport.tsx` + `SignallingScene.tsx` — whole-cell secretion opens the cell outline (review 4.1.4 #1)
- New `ExoOutline` (replaces `ExoCell`, which is removed) draws the elliptical cell outline ITSELF as one continuous
  line and fuses the vesicle into it at `phi`: approach 1.2 s (the vesicle touches the outline from inside) → fuse
  0.6 s → release 1.0 s (the neck is a real opening in the outline; the wedges leave through it) → flatten 1.0 s (the
  pocket flattens back into the outline). The pocket is unfilled, i.e. continuous with the fluid outside — the same
  topology as `ExocytosisInset`. `exoPoint` gives the fusion point, its outward normal and tangent. Wedges end at
  `to[i]` so the caller can keep them there without a jump.
- `SignallingScene` draws the beta cell with `ExoOutline` (fusion point `SS.exoPhi`, facing the capillary); the plain
  `<ellipse>` that stayed closed while insulin passed is gone. After release the scene's own wedges start exactly at
  the positions and size where `ExoOutline` left them.

### Typography — every text node ≥ 20 px at 1:1 (≥ 17 px delivered after branding × 950/1080)
- `CholesterolQualitative`: column heads 21, row labels 20, caption 20 (were 16–17).
- `DiffusionField`: `CounterCard` title and subtitle 20 (were 15/13; card 90 / 122 px tall), counts 21; `SideTag`
  caption 20 (was 14). `FieldTokens` group tagged `data-field="particles"`.
- `WaterPotentialModel`: reference caption 20 (was 15, now two 24-px-spaced lines), "more negative" 21, "negative" 20,
  bracket words 20 (were 16). `SucroseTokens` tagged `data-field="particles"`.
- `SignallingScene`: all labels 21–22 (were 16–20), incl. *glucose transport protein*, *capillary*, the non-target
  cell's two lines and *schematic; not to scale*.
- `T4Tokens.ATPTag`: the letters (ATP / ADP / Pi) are ≥ 20.5 px; the tag grows to fit (`h ≥ fs/0.62`).
- A lesson that SCALES a shared model down must keep every text node ≥ 17 px after branding — use the model without
  its labels, an enlarged inset, or fewer labels; never shrink the labelled model. The per-frame `label-audit.cjs`
  (in every lesson's tooling) fails the render otherwise, letters inside drawings included.
- Ion charges in `IonTok` are drawn strokes (a + or − of ≈ r wide), not text.

### Later 008f additions (made while fixing 4.1.3, 4.1.4 and 4.2.1a)
- `CholesterolQualitative`: the curve origin moved right (L0 164) and the curve labels sit beside the curves at
  x + 46 (20–21 px), so no label crosses a curve or the axis.
- `SignallingScene`: new props `bare` (draw with NO text, for reduced thumbnails — label them outside at full size),
  `labelO` (multiplies every label's opacity: fade labels out BEFORE zooming the scene so no scaled text is ever
  shown) and `labelOf` {id: 0..1} (fade single labels, e.g. one that a zoom would push off-frame). The *capillary*
  label moved beside the vessel (it overlapped the vessel wall).
- `WaterPotentialModel` (4.2.1a review #1, water must never appear to stop crossing): new optional OPEN ENDS.
  `WPMFrame openEnds` draws the two far ends dashed (each compartment a window on a larger solution);
  `wpmEdgeEvents(windows)` returns, for every net membrane crossing in each [t0, forward, reverse, dur] window, one
  water passage OUT through the far end of the receiving side and one IN through the far end of the source side
  (DiffusionField `via` events). Each side's water count therefore stays constant while net osmosis runs for as long as
  the potentials differ. Pass these events to `fieldState` only — NEVER to a counter (`countIn`) — and draw the water
  tokens inside `WPMClip` so the passages vanish at the open ends. Default (closed box) unchanged for other lessons.
  Consumers (4.2.2a, 4.2.2b, 4.2.5, 4.2.6): keep water crossing through the whole time a potential difference is
  taught; use open ends (or an explicit, captioned alternative) rather than stopping crossings.
- `WPScale`: *negative* moved to x + 80 and the bracket words to x − 70 (a sliding marker letter and the model's
  right edge crossed them). Place the scale ≥ ~230 px right of the model's right edge (4.2.1a: model ends 1200,
  scale x 1440).

### Tagging for the overlap audit
- `WaterField` top group `data-field="water"`, `DiffusionField.FieldTokens` / `WaterPotentialModel.SucroseTokens`
  `data-field="particles"`: moving particle fields are background for the label-vs-geometry check (labels still
  need a halo or clear space); every other `data-role="drawing"` shape is geometry a label may not sit on.

## 008a (27 Sep 2026) — first build (see SHARED.md for the original contracts and hashes)
