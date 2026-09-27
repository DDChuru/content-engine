# 4.1.1-2 — Fluid mosaic membranes: how the bilayer forms and what sits in it · REPORT

Model: claude-opus-5-5 (cloud run 008a). Branch `cloud/008-4.1.1-2-to-4.2.1a-dq9f0v`. 13 beats, 0 error beats, 136 cues.

## Phases (UTC, 27 Sep 2026)
| Phase | Wall clock |
|---|---|
| Setup (apt, pip, pinned npm in `work/`, fonts) | 10:06–10:08 |
| Audio (TTS + faster-whisper) / review + 3 retakes / holds + timeline | 10:08–10:16 / 10:16–10:26 / 10:26 |
| Shared Topic 4 models (`work/t4-shared`) + 13 beats authored, stills LOOKED at, approved | 10:10–10:38 |
| Render, 4 beats in parallel (16,114 frames) | 10:38:57–10:49:45 |
| finish + verify / text-only audits + encoded sheets / bookends | 10:50 / 10:50–10:52 / 10:51–10:52 |
| Branding | 10:54–11:00 |
| Bunny upload / status 4 | 11:00:51–11:00:55 / 11:04:02 (≈3 min) |

## ElevenLabs (counter is ACCOUNT-WIDE: parallel sessions move it)
before 293,084 / after 296,791 of 363,000 (retakes 10:23–10:24 read 296,791 before and after; the counter lagged).
Characters requested by this lesson, retakes included: 8,727 (script 6,737).

## Master and branded
- Master `4.1.1-2-fluid-mosaic.mp4`: 537.133 s, 16,114 frames, sha256 `29f77af37632d1bbf408648ed6347e6a5a92434005c85003e72f6752d86e91de`.
- Branded `4.1.1-2-branded.mp4`: 548.162 s (= master + 11.029 s), full decode 0 errors, sha256
  `09695a744299cf9258121cf0ac16101bc8874871201af90861cc219979bb5234`. Mid frame `qa/branded-mid.jpg`: lesson inside the cream
  frame, title bar "Fluid mosaic membranes: how the bilayer forms and what sits in it · Cambridge A Level Biology".
- Bookends: late frames of intro and outro read exactly the title (`qa/bookend-intro-late.png`, `qa/bookend-outro-late.png`).

## Verification (`qa/verification.json`, standard order)
1 ffprobe 537.133 s · 2 video 537.133 ≥ encoded audio 536.133 (margin 1.0 s) · 3 full decode 0 errors · 4 cues matched 136 =
total 136 = planned 136 (unique, in order) · 5 AAC packets identical (25,133) · 6 final word "core." ends 533.18 s, 2.95 s
headroom, −61.4 dB after it · 7 silent hold (Beat 13 END, 2 s) PCM all zero, encoded −91 dB; speech PCM unchanged · 8 boundary
audit 12 boundaries, 0 candidates · marker audit every frame (16,114): 0 marked, 0 mismatches (no error beats) · longest
unchanged visual 7.27 s (Beat 12, still recap) · `verify-text-only --controls` all PASS, 0 untagged shapes ·
`verify-text-only`: longest text-only run 0 s.

## Sheets
Beat sheets (`qa/beat-NN/sheet-*.jpg`) LOOKED at before approval; fixed: stray tokens in `assemble` (component slots drawn as
lipids — shared-model fix), lipid bunching (drift field too fine — shared-model fix), overlapping labels in Beats 6, 8, 10,
label halos over drifting water, Beat 3 hydrogen-bond length. Encoded sheets (9, `qa/encoded-sheets/`) LOOKED at: every beat
reads as intended; no fix needed.

## Bunny
guid `05dc76d4-d562-4644-b6c6-39ddc62c0e07`, title "REVIEW 4.1.1-2 Fluid mosaic membranes: how the bilayer forms and what
sits in it", no collection; uploaded 11:00:55Z; status 4 at 11:04:02Z (length 548 s; 240p–1080p).

## Pronunciation (`qa/audio-review.md`)
Request-only: `OH` → `O H` (all beats); Beat 1 `Between the two sits the` → `Between the two, sits the` (takes 1–2 heard "sides",
"sites" by both recognisers). Retakes: B1 ×2, B9 ("theirs"), B10 ("bilayer"). Old takes kept in `audio/v1`, `audio/v2`.

## Shared-model sha256 used (copied byte for byte into `src/`)
FluidMosaicMembrane d45dca56…8525 · PhospholipidToken 9940f739…bf49 · ReceptorLigand 1cc07252…0d69 · T4Tokens
82c10a8a…45fe · TransportProteinSet 3bc4ab34…6d28 · WaterField 2e4f3530…4de1 · t4-palette 6c1088fc…5ec5a (full values in
`work/t4-shared/SHARED.md`).

## Design choices
1. Columnar membrane layout: spanning proteins are shared columns, so the section widens from 12 to 21 slots as components drift in from the cut edge and the lipids part; both leaflets keep 12 phospholipids.
2. Motion is continuous and spatially smooth (jitter + correlated lateral drift); the recap freezes the clock at its first frame so nothing jumps; "fluid" is shown by a tinted tracer swapping places with a neighbour (1 token width in 2.2 s).
3. The red blood cell is a flat authored outline with a magnifier onto the bilayer, reused as the hook, the "why it matters" link and the callback.

## Interpretation
Beat 4's "twenty-four tokens" assemble into exactly the 24 phospholipids of the section; Beat 5 adds an opening cue (as B1–4, 6–8, 10–12); the objectives surface is the dark house-style surface; the Beat 13 "hook question with a tick" shows the question only (the answer is spoken), per its on-screen list.
