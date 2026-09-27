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

| `MitosisCellModel.tsx` | `MitosisCellModel`, `mLayout`/`mGeom`, `stageAt`, `mixM`, `MCOUNT`, `mCentromeres` | **ADDED by run 009b** (branch cloud/009-5.1.2-to-5.1.6-rmr4ks), built to SHARED-SPECS §5 and the 5.2.1 storyboard's model section: animal + plant; stage ids `interphase`, `prophase-early`, `prophase-late`, `metaphase`, `anaphase`, `telophase`, `cytokinesis` (`MSTAGES`); continuous params cond · nucleolus · env · centro · spindle · align · sep (one-frame switch, set by the beat) · pole · newEnv · newNuc · decond · spOff · cyto; spindle axis horizontal; animal cleavage furrow, plant vesicles → cell plate → new walls; count rows `MCOUNT` per §4. Not added: the `toluidine-blue-schematic` render style (5.2.2 only). |

Not built here: `RootTipSquashRig`, `FieldOfViewSchematic` (5.2.2).

## sha256

| file | sha256 |
|---|---|
| `t5-palette.ts` | `1b4ce00b033cdacb14b8e033d854671fc4f7ad96afb71af59a5ac19e81af34aa` |
| `CellCycleWheel.tsx` | `577b4186cdddc2c36e5f9d00f7216d984bfd7ef60f9dfab357428d4481ef6d7c` |
| `ChromosomeModel.tsx` | `d727c225ac73c0f76717b13a70d18f58f333a7170d20f2e2b417a645e50c3319` |
| `DNAContentGraph.tsx` | `4fcc7b5d2631102b3a211e0b72d82f56442744862d033d46db2814502c1e4591` |
| `T5Annot.tsx` | `ec225c18663efd193fa2dbd0ac7c9a98b9d7825b325959223a459ea162686961` |
| `MitosisCellModel.tsx` | `f063ac7bd0f7d9b5d01d2d43464e2ffe8f1ffecdb78e828a46cc108c72265b9e` (added by 009b) |
| `TelomereEndModel.tsx` | `8ba409dea0a4bbea04b01f7af1f6947ebe73063a454a39baa96d250d8353b666` |
