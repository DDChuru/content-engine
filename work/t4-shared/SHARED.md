# Topic 4 shared models (cloud run 008a) — `work/t4-shared/`

Built to SHARED-SPECS §4 and the "The models, specified once" sections of 4.1.1-2 (publisher), 4.1.3 and 4.1.4, and
4.2.1a. Every lesson of this session copies these files **byte for byte** to the top level of its `src/`
(fingerprinted there). Never edit a copy: change the file here, re-copy to every lesson that uses it, re-approve and
re-render the affected beats. Fixed orientation everywhere: **outside the cell at the top, cytoplasm at the bottom**.
Colour roles only from `t4-palette.ts` (`T4`); error/contrast treatment stays BRAND.primary (terracotta). Every model's
top `<g>` is tagged `data-role="drawing"`; annotation overlays are `data-role="decor"`.

## Files, models and states

| File | Model(s) | States / API |
|---|---|---|
| `t4-palette.ts` | colour roles | copied byte for byte from `cloud-inputs/008/topic-04/t4-palette.ts` |
| `T4Tokens.tsx` | particle tokens | `WaterTok` (pale blue circle), `GlucoseTok` (orange hexagon), `SucroseTok` (double hexagon), `IonTok` (violet, + or −), `O2Tok` (two joined red circles; a token, not a bond diagram), `SoluteDot` (generic grey, no identity), `ATPTag` (yellow rounded tag; `text` = ATP / ADP / Pi, `struck`) |
| `PhospholipidToken.tsx` | `PhospholipidToken` | round amber head (hydrophilic, phosphate-containing) + two grey tails (one straight, one with a single kink); `angle` (180 = head down), `tint` (tracer, lighter amber of the same hue), `hl`; geometry in slot units u (head r 0.40u, tails 1.52u) |
| `TransportProteinSet.tsx` | `ChannelProtein`, `CarrierProtein`; timing helpers | `channel-open`: fixed walls around a water-filled pore lined by hydrophilic R groups (polar dots), `poreWater`; **the channel has no shape parameter** (never changes shape). Carrier `phase` 0 = binding-site notch open to the OUTSIDE (rest), 1 = open to the cytoplasm; outer slot closed by 0.45, inner opens after 0.55 (never a continuous pore); silhouettes interpolate. `carrierCycle(age)`: bind 0.6 s → flip 0.8 s → release 0.5 s → reset 0.8 s (2.7 s); `carrierReverse(age)`: reorient 0.8 → bind 0.6 → flip 0.8 → release 0.5; `channelPass(age)` 1.2 s along the pore axis |
| `ReceptorLigand.tsx` | `ReceptorProtein`, `LigandA` (magenta wedge, complementary), `LigandB` (magenta square, not complementary) | V-shaped cup = **binding site** on the outer face (never "active site"); `seatMotion(age)` = `seat` / `bind-basic` 0.8 s along the normal; `failMotion(age)` = `wrong-ligand-fail` 1.5 s (descend, touch the rim, rock once, drift away); the receptor never changes shape |
| `FluidMosaicMembrane.tsx` | `FluidMosaicMembrane`, `fmmLayout`, `compPos`, `plPos`, `BeadChain`, `Cholesterol`, `Glycolipid`, `scatterPose`, `SLOTS` | 12 phospholipids per leaflet in every state. **008f: positions are SHARED-SPECS' literal 1-based slots of `full`** (see CHANGELOG.md): glycolipid 2 (outer, 4-bead branched chain on a neutral node), channel 4–5, cholesterol 6 (outer) / 7 (inner), receptor-glycoprotein 8–9 (cup + 3-bead chain beside it), carrier 10–11 (notch to the outside at rest), glycoprotein 12 (5-bead chain), extrinsic under 3|4; slots 13–21 phospholipids; `full` = 20.65 u. States: `assemble` (`assemble`, `scatter`, `keep`), `full`, `highlight:<id>` (`highlight`, `hl`). Build-sequence props: `show` (per-component entry 0..1: **entry at the seat** — footprint widens from zero while the neighbours part by exactly that width; never a hole, never a crossing; `fmm-selftest.cjs`), `chains`, `carrierPhase`, `rBands`/`rBandsOn`, `poreWater`, `plShift`/`compShift` (compShift moves a protein's run of adjacent columns; the stretches either side make way), `tracer`/`tracerTint`. Motion contract unchanged (jitter + smooth lateral drift ≤ 0.16u/s; lipids beside a protein drift with it; nothing crosses between leaflets; chains only on the top face). |
| `WaterField.tsx` | `WaterField`, `waterTokens` | water tokens in continuous random motion inside region rects; `hbonds` (dashed Topic 2 hydrogen-bond lines forming and breaking between neighbours), `holes`, `push`, `speed` |

Models added later in this session (new files, listed with the lesson that first uses them) are appended below.
**Every change after the first build is in `CHANGELOG.md` (008f: positions, entry, whole-cell exocytosis, typography).**

## sha256 (frozen for 4.1.1-2, 27 Sep 2026 10:38Z)

```
d45dca56c40296721f66faf2faec263165ec57f1fd496caf29ff4764feed8525  FluidMosaicMembrane.tsx
9940f7391c94fd1541d894925b8f374f4024cd82d46e0b1a81ddd69b93aebf49  PhospholipidToken.tsx
1cc07252bbe002ca4a99d838d93a88b812a9ba77a4121446235f1988ed3f0d69  ReceptorLigand.tsx
82c10a8afcc0e7e2d21bcba258ad529c5cd20cb163905ac5bf305be4233c45fe  T4Tokens.tsx
3bc4ab34ff0e39781ed7acce7192278d0d80bba0d6e593407e89f6f576625d28  TransportProteinSet.tsx
2e4f353050895a9473e21612a64396238828409cd479098202c85942d1fb4de1  WaterField.tsx
6c1088fc47558a3354c0b4049e404df0d05a85f35f6c8f65bfa66a4c26b0ec5a  t4-palette.ts
```

## Models added later in this session

| File | First lesson | Model(s) | States / API |
|---|---|---|---|
| `CholesterolQualitative.tsx` | 4.1.3 | 2 × 2 qualitative panel | higher / lower temperature × without / with cholesterol; qualitative schematic, no data |
| `VesicleTransport.tsx` | 4.1.4 | `ExocytosisInset`, `ExoOutline`, `exoPoint` (008f; `ExoCell` removed) | `exocytosis`: approach 1.2 s → fuse 0.6 s (one continuous midline offset to two leaflets: never a cut) → release 1.0 s → flatten 1.0 s; `ExoOutline` = the same event at whole-cell scale: the vesicle fuses INTO the cell outline, which opens at the neck (008f). 4.2.1b adds phagocytosis / pinocytosis |
| `SignallingScene.tsx` | 4.1.4 | `SignallingScene`, `CellReceptor`, `receptorSites`, `seatAt`, `SS` | beta cell with insulin vesicles, capillary, tissue fluid, muscle cell (target, with a separate glucose transport protein), liver cell (target), a cell without a complementary receptor (rounded receptors); wedge motion props `secrete`/`enter`/`carry`/`out`/`bind`/`bindMuscle`/`fail`/`respond`; `stage` labels (secretion, transport, binding, specific response) |
| `DiffusionField.tsx` | 4.2.1a | `fieldState`, `FieldTokens`, `windowEvents`, `countIn`, `sides`, `walk`, `CounterCard`, `SideTag`, `NetArrow` | finite solute tokens in random motion (short straight runs); `open` (h, dashed middle line) and `membrane` (v, outside top) geometries; crossings are SCRIPTED events (illustrative counts) that are always drawn as actual crossings (straight through a lane / pore gate, or along a carrier's cycle via `via`); side populations change only at crossings; counters count only completed crossings inside a window |
| `WaterPotentialModel.tsx` | 4.2.1a | `WPMFrame`, `wpmGeo`, `sucrosePts`, `Dropper`, `WPScale`, `WPM` | two fixed-volume compartments left / right, vertical partially permeable strip with water-only gaps (generic model barrier); sucrose dropped from above, never crossing (turn-back available); scale: 0 kPa reference tick, "more negative ↓", unnumbered L / R markers by order only. 4.2.6 adds `cell-vs-solution` |

## sha256 at the end of this session (27 Sep 2026)

```
4f37d3634b11d331f81cc7e7131ef0c23fca2c42d8929e2d7874d9183fa055d3  CholesterolQualitative.tsx   (4.1.3, 4.1.4, 4.2.1a)
3d23691ad45dde7e9ebf8cf634e535999884a3472c85836cc42c4891b0a73023  DiffusionField.tsx           (4.2.1a)
8072191f8975e9c5813b8d670cabbbc0c979a2325c163ea200ab2688ec772357  SignallingScene.tsx          (4.1.4)
f85e458b886dec2e757c11ecebfef6b081501dc86f0fc44ed7980d3946a9e5b7  VesicleTransport.tsx         (4.1.4, 4.2.1a)
2e91d00a3c86f39412d97c419f4d40268275165633e8152cc2af2471a65498d1  WaterPotentialModel.tsx      (4.2.1a)
```
The seven 4.1.1-2 files above are unchanged and identical in all four lessons. 4.2.1a's `src/SignallingScene.tsx` is an
earlier copy (6cb4aca8…, before `bindMuscle`), unused by any 4.2.1a beat; it was left as rendered rather than re-render
the lesson for an unused file.

## sha256 after cloud run 008f (27 Sep 2026) — CURRENT; supersedes the two lists above
Every lesson copy is byte-identical to these (lessons that use the file in brackets). Changes: `CHANGELOG.md` (008f).
```
ee03b7658ab66211d95b05f2b46ed13286ea0967601e6cb89891d6035d5f96c9  CholesterolQualitative.tsx   (4.1.3, 4.1.4, 4.2.1a)
17b0041360cd5fa6586a759fa47abf4b1499e4134fb175125645ea243397119b  DiffusionField.tsx           (4.2.1a)
cd18164e2155a3d2e5d74ec8457bfaff80436fa7ac8e60ec5a6325bbd6adaaf0  FluidMosaicMembrane.tsx      (4.1.1-2, 4.1.3, 4.1.4, 4.2.1a)
9940f7391c94fd1541d894925b8f374f4024cd82d46e0b1a81ddd69b93aebf49  PhospholipidToken.tsx        (4.1.1-2, 4.1.3, 4.1.4, 4.2.1a)
1cc07252bbe002ca4a99d838d93a88b812a9ba77a4121446235f1988ed3f0d69  ReceptorLigand.tsx           (4.1.1-2, 4.1.3, 4.1.4, 4.2.1a)
ddb918e7c338dc008e2d3cfaaef457b9b34abb434dc9ff5db5384caa693ea0f1  SignallingScene.tsx          (4.1.4, 4.2.1a)
6f8ad2db316ae2d9f9e28a8fa4371bf490cb1c0104ec154796a1c26d780f2676  T4Tokens.tsx                 (4.1.1-2, 4.1.3, 4.1.4, 4.2.1a)
3bc4ab34ff0e39781ed7acce7192278d0d80bba0d6e593407e89f6f576625d28  TransportProteinSet.tsx      (4.1.1-2, 4.1.3, 4.1.4, 4.2.1a)
7154187b789e57ca076ac0f99711db51c5c7def8997caa7eed21e4261eff2245  VesicleTransport.tsx         (4.1.4, 4.2.1a)
ebae9295e25e40ce85fde95e72cab2169914ef36863b462f702ffec254da0d8c  WaterField.tsx               (4.1.1-2, 4.1.3, 4.1.4, 4.2.1a)
4b60170c97223e4c213d2687ed08714eed88832ad286e5564c1870b8329e2434  WaterPotentialModel.tsx      (4.2.1a)
6c1088fc47558a3354c0b4049e404df0d05a85f35f6c8f65bfa66a4c26b0ec5a  t4-palette.ts                (4.1.1-2, 4.1.3, 4.1.4, 4.2.1a)
```
Label-audit tooling for all Topic 4 lessons: `work/t4-tools/label-audit.cjs` (+ `label-audit-beat.cjs`); copy it into a
new lesson and call it from `render-beat.cjs` on every frame (see 4.2.1a).
