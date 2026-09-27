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
| `FluidMosaicMembrane.tsx` | `FluidMosaicMembrane`, `fmmLayout`, `compPos`, `plPos`, `BeadChain`, `Cholesterol`, `Glycolipid`, `scatterPose` | 12 phospholipids per leaflet in every state. Components (left → right, ordinal positions of `full`): `glycolipid` (outer, pos 2, 4-bead branched chain on a neutral attachment node — not the amber head glyph), `intrinsic-channel` (4–5), `cholesterol` (outer pos 6, inner pos 7; OH knob at head level, four-ring plate among the tails), `receptor-glycoprotein` (8–9, cup + 3-bead chain beside it), `intrinsic-carrier` (10–11, notch to the outside at rest), `glycoprotein` (12, 5-bead chain), `extrinsic` (cytoplasmic face under 3–4, touching the heads and the channel's lower end). States: `assemble` (`assemble` 0..1, `scatter` 0..1, `keep`), `full` (default `show = FULL`), `highlight:<id>` (`highlight`, `hl`: the component brightens, others dim to 50 %). Build-sequence props: `show` (per-component insertion progress; components drift in sideways from the section edge while the lipids part), `chains` (chain reveal), `carrierPhase`, `rBands`/`rBandsOn` (R-group overlay), `poreWater`, `plShift`/`compShift` (lateral swap of a tracer), `tracer`/`tracerTint`. Motion contract: jitter + spatially smooth lateral drift (≤ 0.16u/s, well inside ≤ 1 token width per 2 s), proteins slower; nothing crosses between leaflets; chains only on the top (external) face. Columnar layout keeps both leaflets aligned to the spanning proteins; bilayer-only = 12 slots wide, `full` = 21 |
| `WaterField.tsx` | `WaterField`, `waterTokens` | water tokens in continuous random motion inside region rects; `hbonds` (dashed Topic 2 hydrogen-bond lines forming and breaking between neighbours), `holes`, `push`, `speed` |

Models added later in this session (new files, listed with the lesson that first uses them) are appended below.

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
