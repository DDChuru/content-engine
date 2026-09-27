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

(run 009f, 27 Sep: label-size fix; see `CHANGELOG.md`. Every lesson copy in 5.1.1, 5.1.3 and 5.1.4 is byte-identical to these.)

| file | sha256 |
|---|---|
| `t5-palette.ts` | `1b4ce00b033cdacb14b8e033d854671fc4f7ad96afb71af59a5ac19e81af34aa` |
| `CellCycleWheel.tsx` | `456fef65c9f4c4cc947bbb75f57712ba250a9960348443a25d7677737e17cfba` |
| `ChromosomeModel.tsx` | `124e4195a20bd74f17ecd8c968d56d0430cc16f7bce412786222a389c1f6aa5d` |
| `DNAContentGraph.tsx` | `99b69034ef1bfc551d26e59026b4d29d3d5989d4b60fa97195f66cb39902fe18` |
| `T5Annot.tsx` | `c8081bb10eba2f70ebc2fff1e15bc12099fa6825eca445722c7368decfbb7ee4` |
| `TelomereEndModel.tsx` | `0ad089f52f4c76e9538dbfd0626a7867c9e98d1a513d27b2740572fd03ce1dfc` |
