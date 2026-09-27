# 4.1.1-2 — Fluid mosaic membranes: how the bilayer forms and what sits in it · REPORT

## v2 (cloud run 008f, 27 Sep 2026) — fixes for review `cloud-reviews/4.1.1-2-REVIEW.md` (CHANGES)
Branch `cloud/008f-fix-4prnob`. 13 beats, 0 error beats, 139 cues (136 + 3 hook cues).
**Bunny guid `1ab01c37-b2c5-410f-8388-b40a572a0c75`** "REVIEW 4.1.1-2 v2 Fluid mosaic membranes: how the bilayer forms and
what sits in it", no collection; uploaded 14:52:27–14:52:30Z; **status 4 at 14:55:36Z** (≈3 min; 240p–1080p, 558 s).

| Finding | Fix |
|---|---|
| 1 HIGH entry opens holes / crosses glyphs | Shared `FluidMosaicMembrane`: every component now enters AT ITS SEAT — footprint widens from zero while the neighbours part by exactly that width (never a hole, never a crossing); the first 20 % only lines the leaflets up. `t4-shared/fmm-selftest.cjs` sweeps every entry (0 overlaps, max clear space 0.53 u, no jumps). Intermediate frames of Beats 6/8/9/10 looked at. |
| 2 construction disclaimer absent | Kit `BuildNote` shows the storyboard caption verbatim while components enter (Beats 6, 8, 9, 10). Beat 9's enlarged glycolipid now stays outside the membrane (right column, tray faded) with a dashed arrow through the water to slot 2 — no sweep across the drawing. |
| 3 exam-close polarity labels | Beat 13: an enlarged inset (two phospholipids + one outer cholesterol, head-level guide) with leaders: *polar heads*, *non-polar tails*, *polar OH*, *non-polar rings*. |
| 4 labels < 17 px; leaders over labels | Every text ≥ 20 px at 1:1 (≥ 17.59 px delivered); tray 20 px; Beat 12 recap relaid (left column + staircase ordered by target x), all leaders painted under all labels (`Lbl part=`). **New per-frame `label-audit.cjs`** in `render-beat.cjs`: fails the beat on any text < 17 px after branding (transforms, letters in drawings: no exemptions), text/text or leader/text overlap, text on drawn geometry, or text off the content area. Result: 16,405/16,405 frames, min 17.59 px, 0 violations (`qa/beat-NN/label-audit.json`, asserted in `verify.py`). The later border rule (card/pill edges) run on every frame too: 0 (`qa/label-audit-v2-design-check.txt`). |
| 5 memory hook | Beat 5 re-voiced (only the hook): *"Heads to the water: the heads face the water on both sides. Tails to each other: the tails face each other in the core."* Each hook word lights with its target (heads ↔ head rows, water ↔ water above/below, tails/each other ↔ core), connectors, then a 2 s silent hold on the completed mapping; hook 2.5–17.1 s of the beat. |
| 6 positions ≠ spec | Shared layout now literal SHARED-SPECS slots (glycolipid 2, channel 4–5, cholesterol 6/7, receptor 8–9, carrier 10–11, glycoprotein 12, extrinsic under 3–4); all labels re-anchored. `t4-shared/CHANGELOG.md`. |
| 7 audio outlasts video | `work/brand_final.py`: after `apply-branding-cloud.sh` the raw branded audio ended 29 ms after picture; picture padded (last outro frame cloned 0.229 s), audio untouched: **video ends 0.205 s after audio**. |

**Narration changes (the only ones):** Beat 5, added after the handle phrase: "Heads to the water: the heads face the water on
both sides. Tails to each other: the tails face each other in the core." (+ 2.0 s hold before "That's a memory aid").
**ElevenLabs** (account-wide counter; other sessions move it): 332,143 before / 332,143 after (counter lagged; 706 chars
requested, one take). Pronunciation: none needed (qa/audio-review.md).
**Phases (UTC):** setup 13:58–14:05 · shared models + audit tool 14:05–14:15 · re-voice 14:09 · beats redesigned + looked at
14:10–14:25 · render 14:25:35–14:37:09 (16,405 frames, audit live) · finish + verify 14:37–14:43 · sheets/bookends 14:43–14:47 ·
brand 14:45–14:52 · upload 14:52 · status 4 14:55:36.
**Master** `4.1.1-2-fluid-mosaic.mp4` 546.833 s, 16,405 frames, sha256 `7291d5ebee948c09b369900dbfc61ea203ef09d4920cbee8d538e6fe108ab2b4`.
**Branded** `4.1.1-2-branded.mp4` 558.067 s (= master + 11.03 + 0.20 pad), sha256 `80b83e8f143adfc8608a9e88789c0f005913e154f0267fc75b50cfc4381e63b7`,
full decode 0 errors, video 558.067 ≥ audio 557.862 (`qa/branded-verification.json`); mid frame `qa/branded-mid.jpg` (cream frame,
this lesson's bar). Bookends re-rendered; settled late frames read the exact title (`qa/bookend-*-late.jpg`).
**Verification** (`qa/verification.json`): ffprobe 546.833 · video ≥ audio (1.0 s) · decode 0 errors · cues 139 = 139 = 139 ·
AAC packets identical (25,587) · final word "core." 2.95 s headroom · silent holds (B5 hook, B13 END) −91 dB · 12 boundaries,
0 candidates · marker audit 16,405 frames, 0 marked · label audit 16,405 frames, 0 violations · longest still 7.27 s ·
text-only controls PASS, longest text-only run 0 s, 0 untagged shapes.
**Sheets:** encoded sheets (10) looked at: hook mapping visible and held; entries clean; labels clear. Fixes before render are
the rows above.
**Shared sha256 used:** FluidMosaicMembrane cd18164e…, PhospholipidToken 9940f739…, ReceptorLigand 1cc07252…, T4Tokens 6f8ad2db…,
TransportProteinSet 3bc4ab34…, WaterField ebae9295…, t4-palette 6c1088fc… (full values: `../t4-shared/SHARED.md`).
**Interpretation:** the storyboard's "drift in sideways from the section's edge" is replaced by entry at the seat (a sideways
path cannot avoid crossing occupied lipids in a cross-section; review #1). "This protein at the end" (Beat 10) now names the
last protein of the row (slot 12), as the spec positions place it.

---
## v1 (run 008a) — superseded
Bunny `05dc76d4-d562-4644-b6c6-39ddc62c0e07` (status 4 at 11:04:02Z, 548.162 s), reviewed CHANGES. Full v1 report: git history of
this file (commit a5b5941).
