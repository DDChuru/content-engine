# Topic 5 shared models (cloud run 009a, branch cloud/009-5.1.1-to-5.1.4-qls6vy)

Built once in this session to SHARED-SPECS §5 and the publishing storyboards; every lesson copies these files byte for byte
into its own `src/` (top level, fingerprinted). Colours only from `t5-palette.ts` (T5). Terracotta is never used here;
rings/highlights use `T5.ring` over a `T5.ringHalo` ink halo (`T5Annot.tsx`). Every model's top `<g>` is `data-role="drawing"`.

| File | Model(s) | States / variants |
|---|---|---|
| `ChromosomeModel.tsx` | `Chromosome` (Z0), `HistoneFiber` (Z1), `HelixStrip` (Z2), `ModelCell` (2n = 4 outline), `CountStrip` + `CompTag` (count overlay: chromosomes (count centromeres) · DNA molecules · compartment) | `unreplicated-extended`, `unreplicated-condensed`, `replicating`, `replicated-extended`, `replicated-condensed`, `separated` (see `STATES`; continuous `cond`/`rep`, one-frame `sep` switch, `dist`/`trail` for centromere-leading movement); C1–C4 hues; two gene bands per chromatid; grey telomere blocks; centromere constriction + dot |
| `CellCycleWheel.tsx` | `CellCycleWheel` | arcs G1 (widest) · S · G2 · M · C; interphase bracket; proportions caption; travelling marker (`pos`, `POS` targets g1, s-start, s-end, g2, m, c, g1-next); C1 inset with `INSET_STATES` g1 · s · g2 · m-condense · m-align (pole marks, fibres, dashed equator) · m-separate · m-decondense · c; long labels (callouts) |
| `DNAContentGraph.tsx` | `DNAContentGraph` | `per-cell` (teaching trace; drop 2 → 1 at t = 1, cytokinesis) and `per-nucleus` (open-mitosis interval hatched "schematic — no intact nucleus", resumes at 1 when the new nuclei form); ticks 0, 1, 2; arbitrary units; bands aligned to the wheel |
| `TelomereEndModel.tsx` | `TelomereEndModel`, `RoundCounter` | real state (genes 0.30 / 0.52, grey run 0.62–1.00, endpoints `ENDS`); daughter grows along the template and stops short (`grow`, `stop`), then `swap`; `no-telomere` thought experiment (`telo` 0, `NT_ENDS`) |
| `T5Annot.tsx` | `Ring`, `Glow`, `Trace`, `Leader`, `Bracket`, `Tick`, `Note`, `Label` | annotation (decor) |
| `t5-palette.ts` | `T5` tokens | byte-identical copy of `cloud-inputs/009/topic-05/t5-palette.ts` |

Not built here (not used by 5.1.1, 5.1.3, 5.1.4): `MitosisCellModel`, `RootTipSquashRig`, `FieldOfViewSchematic`.

## sha256

| file | sha256 |
|---|---|
| `t5-palette.ts` | `1b4ce00b033cdacb14b8e033d854671fc4f7ad96afb71af59a5ac19e81af34aa` |
| `CellCycleWheel.tsx` | `577b4186cdddc2c36e5f9d00f7216d984bfd7ef60f9dfab357428d4481ef6d7c` |
| `ChromosomeModel.tsx` | `d727c225ac73c0f76717b13a70d18f58f333a7170d20f2e2b417a645e50c3319` |
| `DNAContentGraph.tsx` | `4fcc7b5d2631102b3a211e0b72d82f56442744862d033d46db2814502c1e4591` |
| `T5Annot.tsx` | `ec225c18663efd193fa2dbd0ac7c9a98b9d7825b325959223a459ea162686961` |
| `TelomereEndModel.tsx` | `8ba409dea0a4bbea04b01f7af1f6947ebe73063a454a39baa96d250d8353b666` |
