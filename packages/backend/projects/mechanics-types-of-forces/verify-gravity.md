# Gravity correction verification — M4.1

- Cambridge 9709 Paper 4 uses **g = 10 m s⁻²**, equivalently **10 N kg⁻¹**. The baseline S03 narration was qualitative; it now explicitly states this convention. S09 carried the old gravity through its numerical results and now uses the corrected values.
- Horizontal example: weight/reaction **49 → 50 N**; friction **14.7 → 15 N**; resultant **7.3 → 7 N**; acceleration **1.46 → 1.4 m/s²**. Tension stays **22 N**, mass **5 kg**, coefficient **0.30**. Friction and resultant bar widths now use `480 × 15 / 22` and `480 × 7 / 22`.
- Slope example in both project and student notes: reaction **33.9 → 34.6 N** (`20√3` before rounding); downslope component and required static friction **19.6 → 20 N**; limiting friction **23.7 → 24.2 N** (`14√3` before rounding). The book still rests because 20 < 24.2. All dependent working and comparisons were recomputed.
- Re-voiced **S03 and S09 only**, through `narration_client.py`, voice `gYWKdgLtqjPO3D5uDrDP`, model `eleven_turbo_v2_5`, original speed **1.14**, confirmed against their original ElevenLabs request history. Local faster-whisper-small durations: **25.678367 s** and **34.272653 s**. All **20** changed-scene cues resolve from new word timestamps; raw “5 kg” and split “1 .4” have explicit resolver alternatives, not invented timestamps.
- `verify-gravity-audio.json`: **8/8 untouched MP3s byte-identical**, **8/8 untouched transcript scene objects identical**, changed durations match ffprobe, and all named cues match measured word starts.
- §10: the bench/block stays visible through S03; S09 retains the force diagram and balance bars throughout the explanation. Sentence captions are compact. §11: narration and working now lead with `R = W = mg`, `Fnet = T − F`, and `Fnet = ma` / `a = Fnet / m`, each before its numbers and retained alongside them.
- §14: S03 gravity ring **11.16 s**. S09 source rings **10.40 s** (5 kg), **10.84 s** (g), **11.80 s** (50 N), **18.70 s** (22 N), **20.92 s** (15 N), **23.98 s** (7 N), **29.46 s** (5 kg and 7 N reused in acceleration working), **31.76 s** (1.4 m/s² on the moving-car diagram). Rings trace for 0.4 s and fade at 1.5–1.75 s.
- Holds/readability: completed net force remains for **2.20 s** before the acceleration formula; the final acceleration remains for **2.513 s** to the measured audio end. Weight and horizontal working remain visible to scene end. Existing motion and voice speed are retained; no audio padding was added.
- Still-only audit: **89 frames** across S03/S09, including every figure cue, +0.4 s, +1.5 s, 2-second dwell samples and each scene end. `verify-gravity-stills.json` checks text/track collisions, overflow, diagram persistence, formula-before-substitution timing, and ring presence/enclosure. The moving-car track was shortened to keep it clear of the acceleration working. `verify-gravity-pixels.py` also checks actual PNG content and paper layers; key stills were inspected manually.
- Validation: local transcription/cue resolution, audio/transcript SHA preservation, arithmetic, TSX syntax, Remotion bundle and still captures, pixel checks, and `git diff --check`. Updated composition runtime: **205.433 s** including transitions.
- **No video render or deployment.** Existing MP4s predate the correction and remain a human rendering follow-up. No files deleted; no `review-*` files touched.

Re-run (with the configured nvm Node):

```bash
python3 packages/backend/src/scripts/verify-gravity-audio.py types-of-forces
node packages/backend/src/scripts/verify-gravity-stills.cjs types-of-forces
```
