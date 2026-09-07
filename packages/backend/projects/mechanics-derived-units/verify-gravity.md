# Gravity correction verification — M0.3

- Cambridge 9709 Paper 4: `g = 10 m s⁻²` (equivalently `10 N kg⁻¹`). Notes and student notes: 2.4 kg weight **23.52 → 24 N**; 5 kg weight **49 → 50 N**. The 24 N result is now exact under this convention, not a rounded 23.52 N.
- The baseline storyboard/transcript did not literally say 9.8. S08 now explicitly states the exam convention and demonstrates the existing 1 kg diagram with `W = mg`, then `W = 1 × 10 = 10 N`. The numerical working is labelled **Earth** throughout the Moon comparison.
- Re-voiced **S08 only** using `narration_client.py`, voice `gYWKdgLtqjPO3D5uDrDP`, model `eleven_turbo_v2_5`, original speed **1.14**, confirmed from the original ElevenLabs request history. Local faster-whisper-small measured **29.335510 s**. Its nine named cues were resolved from the new word timestamps; the raw recognition “10 new Newtons” has an explicit cue alternative, with no invented timing.
- `verify-gravity-audio.json` records before/after SHA-256 hashes: **9/9 untouched MP3s byte-identical**, and **9/9 untouched transcript scene objects identical**. Changed MP3 duration matches ffprobe. All named cues land on measured word starts.
- §10: the Earth/object diagram remains behind the compact formula/captions; the Moon comparison preserves the Earth context. §11: the general weight formula precedes all substitution, stays visible, and S06 now also leads each conversion lane with the general relation. S06 audio is untouched.
- §14: source rings at **12.86 s** (gravity), **16.30 s** (mass), **19.06 s** (mass substitution), **19.52 s** (gravity substitution), **20.78 s** (weight result). Rings trace over 0.4 s, then fade from 1.5–1.75 s. The completed result remains for **2.76 s** before the Moon cue; no new audio silence or retiming was introduced.
- Still-only audit: **46 frames**, including exact figure cues, +0.4 s, +1.5 s, 2-second dwell samples, scene end and S06 conversion checks. See `verify-gravity-stills.json` and the five representative `verify-gravity-*.png` stills. Checked text collisions, viewport overflow, diagram persistence, formula presence and ring enclosure, plus actual nonblank pixels and manual inspection of the key stills.
- Validation: selective local transcription, audio/transcript preservation assertions, arithmetic check, Remotion bundle and still captures, TSX syntax checks, and `git diff --check`. Composition duration is **176.067 s** including transitions.
- **No video render or deployment.** Existing MP4s predate the correction; rendering remains a human follow-up. No files deleted; no `review-*` files touched.

Re-run (with the configured nvm Node):

```bash
python3 packages/backend/src/scripts/verify-gravity-audio.py derived-units
node packages/backend/src/scripts/verify-gravity-stills.cjs derived-units
```
