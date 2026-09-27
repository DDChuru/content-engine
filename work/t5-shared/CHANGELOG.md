# t5-shared CHANGELOG

## 27 Sep 2026 — run 009f (branch `cloud/009f-fix-4t1jp6`, fix pass on 5.1.1 / 5.1.3 / 5.1.4 after the independent video review)

**Why.** New binding rule from the review: NO text under 17 px in the delivered 1920×1080 frame. The lesson is branded into a
1690-px slot (×0.8802), so every label must be at least **19.3 source px** at its drawn scale; these models now use **20 px**
as their floor. Checked mechanically by `verify-label-size.cjs` (in each lesson dir; run by `verify.py`), which also fails on
any two overlapping text boxes.

**What changed (behaviour and geometry; states, ids, colours and motion contracts are unchanged).**
- `ChromosomeModel.tsx` — `CountStrip` rebuilt so its layout GROWS to fit its labels instead of shrinking them: headings
  "chromosomes (count centromeres)" / "DNA molecules" ≥ 20 px, values ≥ 20 px, compartment tag ≥ 20 px; the row height, the
  DNA column position and the box width are computed from the text (never text pushed into the neighbouring column).
  New: `anchor="end"` (the box grows leftwards from a fixed right edge), `countStripW(rows, w, size, title)`, exported
  `MIN_T5_TEXT = 20`; `countStripH()` returns the new (taller) height — **callers that positioned things below a strip, or
  drew their own row highlight at the old 2.05 × size row pitch, must use `countStripH` / the strip's own `hiRow/hiA`**.
  `CompTag` default size 20 (floored at 20).
- `CellCycleWheel.tsx` — small-variant long labels and "interphase" 17 → 20 px; proportions caption 14/18 → 20 px.
- `DNAContentGraph.tsx` — axis numbers/band letters/"time" 15/19 → 20/21 px; y-axis title, caption, unit key, slope note and
  hatch label → 20 px; in the `small` variant the "schematic; not measured data" caption sits one line higher so it does not
  run into the unit key.
- `T5Annot.tsx` — `Note` default 20 and `Label` floored at 20 px.
- `TelomereEndModel.tsx` — `RoundCounter` label 17 → 20 px (box unchanged at 250 px; a longer label needs a wider,
  lesson-local counter — 5.1.4 draws "thought-experiment rounds" in its own `WideCounter`).
- `CellCycleWheel.tsx` in **5.1.1** was a stale copy (`lerp(1, 0.42, ease(dec))`); it is now byte-identical again.

**For 009b and later builders.** Re-copy all six files byte for byte into every lesson that uses them and re-approve/re-render
(every beat is stale by fingerprint). The models do not need anything new from the lesson's `shared/src/Type.tsx`, but the
run-009f lessons also floor house-style text there (`MIN_TEXT = 20`, `fit()`, `TextScale` context for groups drawn at a reduced
scale; `Cite` default 20) — copy `work/5.1.1/shared/src/Type.tsx`, `src/Panels.tsx` and `verify-label-size.cjs` if you want the
same guarantee.

**sha256 (after this change):** see `SHARED.md`.
