# 4.2.1a — Passive transport: diffusion, facilitated diffusion, osmosis · REPORT

Model: claude-opus-5-5 (cloud run 008a). Branch `cloud/008-4.1.1-2-to-4.2.1a-dq9f0v`. 14 beats, 1 error beat (E45, Beat 10,
COMMON MISTAKE), 146 cues.

## Phases (UTC, 27 Sep 2026)
| Phase | Wall clock |
|---|---|
| Audio (TTS + faster-whisper) / review (no retakes) + second opinion / holds + cue plan + timeline | 11:15–11:20 / 11:20–11:26 / 11:27 |
| Shared models `DiffusionField`, `WaterPotentialModel`; 14 beats authored, stills LOOKED at, approved | 11:27–12:00 |
| Render, 4 beats in parallel (19,246 frames): Beat 14 / Beats 1–13 / re-render of Beats 10, 13, 14 | 11:48–12:01 / 12:10–12:35 / 12:41–12:57 |
| finish / verify / text-only audits + encoded sheets (final master) | 12:57 / 12:59 / 12:59–13:02 |
| Bookends / branding | 12:14–12:15 / 13:02–13:12 |
| Bunny upload / status 4 | 13:12:51–13:12:55 / 13:17:04 (≈4 min) |

## ElevenLabs (counter is ACCOUNT-WIDE: parallel sessions move it)
before 315,792 / after 321,330 of 363,000 (balance before 47,208 ≥ 1.2 × 7,917); requested by this lesson 7,917 (no retakes).

## Master and branded
- Master `4.2.1a-passive-transport.mp4`: 641.533 s, 19,246 frames, sha256
  `102e29e14e8d191bf9e9ef3156b65a4d32a08aed872db33686e64ea122a4a2b1`.
- Branded `4.2.1a-branded.mp4`: 652.562 s (= master + 11.029 s), full decode 0 errors, sha256
  `e56c528e0ac47b388f504e56adea5363991051b5fd683bd5a4033c2e5e07a7fa`. Mid frame `qa/branded-mid.jpg` (5:30, Beat 8) inside the
  cream frame, title bar "Passive transport: diffusion, facilitated diffusion, osmosis · Cambridge A Level Biology". Bookends'
  settled late frames read exactly the title (`qa/bookend-*-late.png`).

## Verification (`qa/verification.json`, standard order)
1 ffprobe 641.533 s · 2 video ≥ encoded audio 640.533 s (margin 1.0 s) · 3 full decode 0 errors · 4 cues 146 = 146 = planned
146 · 5 AAC packets identical (30,026) · 6 final word "ATP." ends 637.40 s, 3.13 s headroom · 7 silent read (Beat 10, 4 s)
and END hold (Beat 14, 2 s) PCM all zero, encoded −91 dB; speech PCM unchanged · 8 boundary audit 13 boundaries, 0
candidates · marker audit every frame (19,246): Beat 10 frames 11403–13484 carry COMMON MISTAKE (badge MAE ≤ 3.9 vs COMMON,
≥ 20.3 vs EXAM), clears on frame 13485 = END of "such as a carrier" + 6 frames; all other frames unmarked, 0 mismatches ·
longest unchanged visual 7.23 s (Beat 2 objectives) · text-only `--controls` all PASS, 0 untagged shapes; text-only runs:
none (0 s). Counter/window schedule (animation clock, from the measured cues): open field W1 81.3–86.3 s (12 · 4), W2 from
Beat 4's first frame (9 · 7 → 20 / 20, arrow fades over the next 1 s); O₂ 6 · 2, steeper 8 · 2, ions 8 · 2 each in a 5 s
window started at its cue; carrier 3 · 1 shown only after the fourth event (12.9 s into its 16 s window); water 15 · 9 then
12 · 12 windows from "the water potentials are equal".

## Sheets
Beat sheets LOOKED at before approval; fixed: brand fonts missing at first (DejaVu fallback misplaced the italic
underline/strike spans; fonts built, every beat re-checked), label and panel collisions in Beats 3–8, factor panel
overlapping the route slots (Beat 6), sucrose tokens clumping at the landing line and the 0 kPa label under the markers
(shared `WaterPotentialModel` fix), recap layout rebalanced (Beat 13). Encoded sheets (11) LOOKED at: two fixes, both
re-rendered — Beat 10's in-progress correction line touched the report tab (tabs moved down 22 px), Beat 13's osmosis
line touched the footer citation (raised 22 px).

## Bunny
guid `53b658e0-4f76-4079-a4c6-8f00be2a1db3`, title "REVIEW 4.2.1a Passive transport: diffusion, facilitated diffusion, osmosis", no collection;
uploaded 13:12:55Z; status 4 at 13:17:04Z (4 min 9 s after upload; length 652 s; 240p–1080p).

## Pronunciation (`qa/audio-review.md`)
No request-only normalisation, no retakes. Recogniser spellings mapped on the heard side only: routes/roots,
haemoglobin/hemoglobin, hook's/Hooke's; Beat 10's "2023" written as words (no Beat 10 cue contains the year).

## Shared-model sha256 used (byte-for-byte copies in `src/`)
The seven 4.1.1-2 files unchanged · CholesterolQualitative 4f37d363…55d3 · VesicleTransport f85e458b…a9e5b7 · new:
DiffusionField 3d23691a…3023 · WaterPotentialModel 2e91d00a…98d1 (full values in `work/t4-shared/SHARED.md`;
`src/SignallingScene.tsx` is an earlier, unused copy).

## Design choices
1. Every count is a scripted crossing that is actually drawn: `DiffusionField` picks the token nearest the boundary for each event and moves it through the middle line, a lane between phospholipids, the channel's pore or the carrier's full cycle; populations change only at crossings and counters show only completed windows.
2. One membrane scene is built up through the lesson (O₂, ions, glucose; channel, carrier; route slots filling) and returns as the recap and, reduced, in the close; the open field and the water model stay live (motion never freezes).
3. The water model shows order, not numbers: an unnumbered scale under a 0 kPa reference, L and R markers moved by each landed sucrose token; equality reached by adding solute to the left, with the net arrow fading at once.

## Interpretation
Water crossings in the unequal state are drawn only in the first counted window (15 · 9): drawing all unequal windows would
visibly deplete the fixed-volume left compartment, which the model must not suggest; equal-state windows (12 · 12) run to
the end. Beat 6's larger-area and shorter-distance factors use a labelled side comparison (one factor differs) instead of
widening the scene's membrane; the higher-temperature demonstration speeds the tokens with no crossings counted.
