# CLOUD RUN 003 · 3.1.1-2 Enzymes: where and how they act · REPORT

**Model:** claude-opus-5-5 (from `get_session`: configured and last-served). `CLAUDE_CODE_REMOTE=true`. 4 vCPU, 15 GB. Branch `cloud/003-3.1.1-2` only.

## Phases (UTC, 24 Sep 2026)
| Phase | Wall clock |
|---|---|
| Setup (fetch, branch, apt ffmpeg 6.1.1, faster-whisper 1.2.1, npm pinned deps 17 s) + reading | 11:07 → 11:13 (6 min) |
| Audio: 18 ElevenLabs takes, Whisper small, pronunciation checks, 3 retakes | 11:13 → 11:30 (17 min) |
| Holds + cue plan (224 cues) + timeline | 11:30 → 11:32 (2 min) |
| House-style layer, models, 18 beats authored, stills LOOKED at, approved | 11:32 → 11:56 (24 min) |
| Render (4 lanes) + finish + verify + encoded sheets, pass 1 | 11:56 → 12:03:34 (7 min; 6,798 unique frames of 27,004) |
| Sheet review → 2 fixes → pass 2 (3 beats re-rendered) | 12:03 → 12:07:41 (4 min) |
| Bookends (Remotion 4.0.365, own Chrome headless shell) | 52 s |
| Branding (`apply-branding-cloud.sh`) | 12:08:02 → 12:16:05 (8 min) |
| Bunny create + `curl -T` upload + encode to status 4 | 12:16:47 → BUNNY_DONE |

Pinned Node deps (no lockfile in repo, `work/3.1.1-2/package.json`): react/react-dom 19.2.0, sharp 0.33.5 (librsvg 2.58.93), esbuild 0.25.10, remotion + @remotion/bundler + @remotion/renderer 4.0.365, zod 3.22.4. Node 22.22.2.

## ElevenLabs
Thandi `BcpjRWrYhDBHmOnetmBl`, `eleven_multilingual_v2`, speed 1.0, one file per beat, no stretch. `GET /v1/user`: **222,543 → 237,993 = 15,450 characters** (10,941 for the 18 beats + retakes of B4/B5/B11 + 2,233 of short pronunciation probes).
**Pronunciation fixes (request text only, logged in `qa/audio-review.md`):** B4 `Catalase`→`Catalaise` (take 1 said "catalyze"); B5 `catalyses`→`catalyzes` (the voice says "catalysis"). B11 retaken with unchanged text ("laccase" came back as "LAKES"). **Worth a listen:** "Catalase is one" (B4 ≈1:47), "laccase" (B11 ≈8:45), "O–H" (B9 ≈5:59). Whisper's language prior hears every catalase take as "catalyse", so the transcript can't settle it.

## Master and branded
| | Duration | SHA-256 |
|---|---|---|
| `3.1.1-2-enzymes.mp4` (master, 27,004 frames, 1920×1080@30) | 900.133 s (15:00.13) | `ea72f948bcf7597b71bd2d95c92846012d9cb3c3793b304ad4bbf58cf1d43d32` |
| `3.1.1-2-enzymes-branded.mp4` | 911.162 s (= master + 11.029 s) | `eba19eb8c9ed10e417187198704ce842c5b6c0ce1891849cb9a2c8b8e52455d1` |

## Verification (PIPELINE-STANDARD §4 order, `qa/verification.json`)
1. ffprobe duration 900.133 s. 2. Video 900.133 ≥ encoded audio 899.133 (1 s deliberate video tail). 3. Full decode: **0 errors**. 4. Cues **224/224**, exact narration substrings, unique within their beats and in order. 5. AAC packets identical to the once-encoded narration (42,148). 6. The final word "substrate." ends at 895.947 s, leaving 3.19 s of headroom. 7. The silent reads are all-zero PCM and measure −91 dB encoded: B5 3 s, B11 4 s, B14 3 s, B16 4 s, B18 5 s anchored read + 2 s END hold. Speech PCM is byte-identical to the takes. 8. Beat boundaries: 17 tested, **0** one-frame-hold candidates.
**Marker audit, every frame:** marker on 9,344 frames and off on 17,660, with **0 mismatches**. Badge pixels match COMMON MISTAKE (MAE ≤ 3.90) and not EXAM CONTRAST (MAE ≥ 20.3) on every marked frame. **Valence audit (B9):** 1,131 frames audited, all OK. The states are pre (C24H42O21), pre+water (C24H42O21 + H2O) and post (2 × C12H22O11), and the bond graph switches in one frame. Longest unchanged visual is 11.5 s, with none over 15 s.
**Branded:** 911.162 s = master + 11.029; full decode 0 errors; mid-lesson frame (`qa/branded-mid.jpg`) shows the lesson in the cream frame under the "Enzymes: where and how they act · Cambridge A Level Biology" bar. **Bookends:** late frames LOOKED at (`qa/bookend-*-late.jpg`): both read exactly "Enzymes: where and how they act".

## Sheets: what I saw and fixed
Per-beat stills were checked before each approval. That caught the Haworth inset being too cramped (widened: ring pitch 245→290), label collisions in B4/B7/B9/B11/B12/B13/B15/B18, text-width drift (switched to real font metrics), B16 struck labels left faded beside their replacements (now replaced in place), and B18's NAM/NAG labels sitting off their pieces. The **encoded** master was then reviewed on 16 sheets (139 samples). It had **B15's opening panels drawn 200 px high and covering the title** (a transform error at the first frames), and **B10's "substrate particle" note crossing the Ea bracket**. Both were fixed and re-finished; B11 was re-approved because it imports B10's graph geometry. Sheets before and after: `qa/encoded-sheets-prereview/`, `qa/encoded-sheets/`.

## Bunny
guid **`08c56c4e-3505-412c-af04-4175524e4a1b`**, title "REVIEW 3.1.1-2 Enzymes: where and how they act", **no collection**. Create 200, PUT `curl -T` 200 (39,691,168 B). Status 4 after BUNNY_TIME (`logs/bunny-poll.txt`). Nothing deleted or moved.

## Design choices
- House style rebuilt from the Stem 4 Life brand tokens (`palette.ts`: ink #253247, terracotta #B64A30, peach #FFAC8F, warm #F6F3EB) plus the reference chrome geometry, because the reference's `topic-02/shared/src` was not in the inputs. The chrome is the header strip, title, MODEL line, caption bar and top-right badge. Fonts are the brand Source Sans 3 / Manrope, instanced to TTF for librsvg.
- One enzyme model all lesson: CLEFT_LK and CLEFT_IF are separate assets. The substrate carries the notch and the cleft the matching bump, so "complementary, not the same shape" is visible. Every binding is motion, and products switch in one frame, never by cross-fade.
- Chemistry is a single atom/bond graph that both draws the Haworth inset and feeds the per-frame valence audit. The energy graph's endpoints are fixed constants shared by both curves.

## Storyboard interpretation
- B18 "five-second anchored read" had no hold line in the narration block. It is inserted as 5 s of silence between "Read it," and "then watch…"; the 2 s final hold is an END hold.
- Exit cues: the marker holds from the first frame to the end of the storyboard's exit phrase (B5/B11/B14). B16 clears on the frame the LAST correction completes. All four badges read COMMON MISTAKE, because each error is diagnosed by an examiner report (ECR pp.10, 54; June 2024 ER pp.12, 15).
- Cues made unique under case-folding: B10 "same finish, a lower hill" (CHECK-R2) and B11 "Lowering activation energy is true".
- B16's wrong drawing is drawn as two stages (apart → together), so "active site on the small piece" and "ESC" are both legible. It is captioned as a composite.
