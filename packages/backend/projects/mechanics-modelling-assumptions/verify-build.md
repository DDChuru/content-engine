# Modelling assumptions — build verification

Built on 6 September 2026. **No video render was run.** Composition export names, ID, Root registration, audio filenames and transcript filename are retained.

The exact storyboard narration uses ElevenLabs voice `gYWKdgLtqjPO3D5uDrDP`, through `narration_client.py`, at speed 1.0 for brisk scenes and 0.9 for slow scenes. Written pauses are inserted silence; the bracketed directions are not spoken. Audio hashes, provider, voice, speed, spoken segments and silence intervals are recorded in the transcript.

## Measured duration

The storyboard's 300-second estimate did not fit the specified narration and delivery. Audio totals **382.015 seconds**. The composition keeps all speech and holds, at **11,465 frames / 382.167 seconds / 30 fps**; each scene rounds its encoded audio duration up to a whole frame. The 15-frame graphite transitions overlap added outgoing visual tails, so they never subtract narration time.

| Scene | Tempo | Voice speed | Audio seconds | Scene seconds | Cues | Frames |
|---|---|---:|---:|---:|---:|---:|
| s01 | brisk | 1.0 | 20.036 | 20.067 | 8 | 602 |
| s02 | brisk | 1.0 | 22.361 | 22.367 | 12 | 671 |
| s03 | brisk | 1.0 | 28.238 | 28.267 | 12 | 848 |
| s04 | brisk | 1.0 | 27.376 | 27.400 | 12 | 822 |
| s05 | slow | 0.9 | 98.743 | 98.767 | 36 | 2963 |
| s06 | slow | 0.9 | 91.507 | 91.533 | 23 | 2746 |
| s07 | slow | 0.9 | 72.856 | 72.867 | 19 | 2186 |
| s08 | brisk | 1.0 | 20.898 | 20.900 | 6 | 627 |

## Completed checks

- All **128 cues resolve** to local Whisper words, constrained by the generated speech-segment boundaries. No cue falls inside an explicit pause/hold. This prevents an earlier repeated phrase or a word timestamp stretched across silence from driving a reveal.
- Eight audio hashes, voice IDs and speeds checked; decoded audio is silent throughout the interior of every written pause and hold.
- `npx remotion still` generated **142 required stills**: every cue, plus the first and last frame of every result/question hold. Visible-region and text counts were measured from the composition DOM and checked against the stills. Maximum: **3 regions**, including the header; **7 words per teaching card or working line**. Region and diagram-text bounds fit the frame.
- All **seven hold pairs are byte-identical PNGs**: six 60-frame numerical holds and one 90-frame question hold. The result rings are present during their holds.
- All stills were visually inspected in contact sheets; the corrected force labels, massive-pulley/slack-string contrasts and worked-result frames were also inspected directly. Affected scenes were rechecked after the final visual/timing fixes.
- Strict targeted TypeScript check passed. This checkout lacks React declaration packages, so the check used temporary `@types/react` / `@types/react-dom` under `/tmp/verify-modelling-types`; repository dependencies were unchanged.
- `npx remotion compositions` lists `MechanicsModellingAssumptions` at 1920×1080, 30 fps, **11,465 frames**, longer than all narration combined.

[Per-still measurements and hold hashes](verify-build.json) preserve the check results. Local stills are in `/tmp/verify-modelling-stills-v3`; they are verification artifacts, not a video export.

## Repeat the still audit

From `packages/backend`, with the requested Node version on `PATH`:

```bash
npx remotion bundle src/remotion/Root.tsx
python3 src/scripts/verify-mechanics-modelling-assumptions.py --workers 3
```

The verifier invokes `npx remotion still` for each cue and hold boundary, checks the generated DOM-measurement artifacts, and compares hold images. Its optional `audit` composition prop emits JSON artifacts only; it adds no on-screen material. It retries transient CLI failures up to three times. It never invokes a video-render command.

No files were deleted. The remaining production step is the video render on the other machine.
