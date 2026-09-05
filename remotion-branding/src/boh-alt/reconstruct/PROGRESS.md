# Beat 2 reconstruction progress

## Scope and inputs
- Work is confined to `src/boh-alt/reconstruct/` and `public/boh-alt/`; requested render and proof artifacts will go to `output/boh-tutorial/` and `/tmp/`.
- Confirmed both 720×1600 stills, narration, timing, mp3 and six app TTFs exist. No previous reconstruction files were present.
- Beat `02-ledger`: 27.847 seconds, 30 fps, standalone audio starts at frame 0 (original tutorial VO start 20.959 seconds).
- Repository instructions were read. The task's explicit render gates override the local general instruction to leave rendering to VidStud.
- Existing unrelated modifications and `review-*` files are being left alone. No commits, deployment, or deletion.

## Implementation / verification underway
- Measuring exact row bounds, 443px content scroll, fixed screen chrome and text styles.
- Cue plan will use script word indices against the beat duration, with derivation recorded rather than implying forced audio alignment.
- Required checks: scoped typecheck, requested 1080p mp4 render, native-resolution endpoint pixel diffs, original-text row diff, 25/50/75% stills, 2× composition proof.

## Measurements / baseline checks
- Source canvas is `#F1F4F8`; white row cards; fixed header y=0..332, footer y=1400..1600.
- Same-content daily rows differ in rasterization between the captures (e.g. y=930..1319 shifted by 443: 4.8201% exact differing pixels). Paired *row* crops are needed for exact endpoints; translation remains continuous.
- The fixed bottom-navigation crops include the original translucent backing. This is documented in `slices.json`; it is not a newly drawn navigation bar.
- Root `npx tsc --noEmit` already fails in unrelated Iinm compositions and `src/Root.tsx`. Those files are outside the authorized scope. A dedicated reconstruction tsconfig will check this complete standalone entry without changing or suppressing those errors.
- `verify-slices.py` generates source crops and their provenance/bounds in `slices.json`.

## First render evidence
- Native rendered phone at frame 500 vs `boh-02.png`: **0 / 1,152,000 differing pixels (0.0000%)**.
- Native rendered phone at frame 835 vs `boh-07.png`: **0 / 1,152,000 differing pixels (0.0000%)**.
- Empty frame and 25/50/75% renders generated. The actual React phone component is used for native verification and the scaled 1080p demo.
- Original-text reset initially differs at 6.72195% of the tight 660×148 row. Font rendering calibration is still underway; this is not being reported as a passing gate.
- Confirmed supplied DM Sans TTF is byte-identical to the mobile app's installed font.
- Word cues: daily rows frames 197, 213, 246, 278, 295, 311, 328; divider 426; scroll 508..602; carry rows 541, 573, 590. Each row arrival is a 12-frame cubic ease-out.

## Resumed on the local machine
- Read this log first and retained the existing composition/crop plan. Regenerated the 21 missing PNG assets with `verify-slices.py` (only source files had transferred).
- Re-rendered the actual components: both 720×1600 endpoint diffs remain **0.0000%**. The original-text compose baseline here is **6.7260%**, so the text gate is still open.
- `verify-reconstruct.py` contains an obsolete manifest schema/output path; updating that verifier is necessary before the final gates.
- Continuing font rasterization calibration. Requested renders explicitly authorize the output MP4 and `/tmp/` proof images despite the general VidStud no-render default.
