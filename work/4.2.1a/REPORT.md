# 4.2.1a — Passive transport: diffusion, facilitated diffusion, osmosis · REPORT

## v2 (cloud run 008f, 27 Sep 2026) — fixes for review `cloud-reviews/4.2.1a-REVIEW.md` (CHANGES)
Branch `cloud/008f-fix-4prnob`. 14 beats, 1 error beat (E45, Beat 10), 149 cues (+3 hook cues).
**Bunny guid `4221b6a9-03d9-4f5e-955d-0c09b6fe1514`** "REVIEW 4.2.1a v2 Passive transport: diffusion, facilitated diffusion, osmosis", no collection;
uploaded 16:36Z; **status 4 at 16:40:46Z** (≈4 min; 240p–1080p, 668 s).

| Finding | Fix |
|---|---|
| 1 HIGH water stops crossing 08:25–08:55 | Water now crosses the membrane for the WHOLE time the water model is shown (Beats 11–14; largest gap between two membrane crossings 1.6 s). Counted 15 · 9 windows run back to back from *in both directions all the time* until *the water potentials are equal* (7 windows; the live *current 5 s window* counter and the *completed 5 s window* card keep updating, net arrow left → right), then balanced 12 · 12 windows to the end; before counting starts, uncounted crossings (balanced while both sides are pure, 15 · 9 per 5 s once the potentials differ). Crossings continue during the solute addition. To keep a FIXED VOLUME without draining the left side, the model's far ends are open (dashed; caption *open ends: each side is part of a larger solution; its water stays the same*): for each net crossing one water token leaves the right-hand end and one enters the left-hand end (not counted). Shared `WaterPotentialModel` gained this optional mode (`openEnds`, `wpmEdgeEvents`, `WPMClip`; `../t4-shared/CHANGELOG.md`). |
| 2 text < 17 px (L/R, ATP, counters, scaled models) | Every text ≥ 20 px at 1:1 (≥ 17.59 px delivered), letters in drawings included (L/R 21 px, ATP ≥ 20.5 px, counters 20–21 px). No annotated model is scaled down any more: Beat 13 shows ONE model at a time (water → membrane scene at *Particles move randomly* → water at *water moves by osmosis*), Beat 14 uses label-free scaled drawings with full-size labels beside them; thumbnails in Beats 1, 4, 5, 11–13 carry no text (labels fade before a scene shrinks, or sit outside). All 14 beats relaid; per-frame `label-audit.cjs` in `render-beat.cjs`: **19,702/19,702 frames, min 17.59 px, 0 violations** (asserted per beat in `verify.py`). |
| 3 door-in-a-wall hook | Beat 8 re-voiced (hook only): *"Picture a doorway in a wall. The wall: the phospholipid bilayer, whose hydrophobic core turns ions back. The doorway: the channel protein's hydrophilic pore, an opening right through the wall."* A doorway (no door leaf: nothing swings or gates; tag *an opening: nothing swings shut*). Bricks ↔ bilayer (wash + label) and doorway ↔ ringed pore light together with link tags; **2 s silent hold** on the completed mapping; the creditworthy channel sentence (*Written properly: …*) follows at once. Hook 2.7–20.5 s of the beat. |
| 4 positions ≠ spec | Shared `FluidMosaicMembrane` literal SHARED-SPECS slots (channel 4–5, carrier 10–11, …); every label, lane and gate re-anchored. |
| 5 audio outlasts video | `work/brand_final.py` pads the picture after branding, audio untouched: raw branded audio ended 29 ms after picture; 0.229 s clone of the last frame: **video ends 0.205 s after audio** (667.967 vs 667.762 s). |
| hygiene: PROGRESS.md missing | `PROGRESS.md` restored with the 008f completion record. |

**Narration changes (the only ones):** Beat 8, *"Picture a door in a wall."* → the three hook sentences above (+ 2.0 s hold before
*"Written properly"*); title *A channel protein: a doorway in a wall*. **ElevenLabs** (account-wide): 348,470 before / 348,872 after
(731 chars requested, one take; counter lags). Transcript 118/118 (`qa/audio-review.md`).
**Wording changes on screen** (meaning kept; STORYBOARD.md *008f: visual revisions*): counter titles *current 5 s window*,
*completed 5 s window*, *before the change* (subtitle → header line *counts are illustrative*); *in this model water crosses; sucrose
does not*; the caption lines reworded at 20 px (fixed volume / generic model barrier / open ends); Beat 6 pill *new comparison; set
starting counts 32 / 8 (same area, temperature, membrane, 5 s window)*; *counter set aside:* + pill *qualitative; not counted*;
Beat 9 counter subtitle *illustrative counts*; Beat 10 paraphrase *ignored there: …*; side-tag captions *set starting count* folded
into the setup pills; the Beat 11–12 membrane thumbnail and the Beat 13 open-field thumbnail dropped.
**Master** `4.2.1a-passive-transport.mp4` 656.733 s, 19,702 frames, sha256 `1f9d0d9d922a65bb92b508329cd685abf45da0e129e97718a4bd0f8302b47900`.
**Branded** `4.2.1a-branded.mp4` 667.967 s, sha256 `4beff7df0a697384cfb0daa4c0e975d0863bfa6016a24e54f0b508ee10f6342f`, full decode 0
errors (`qa/branded-verification.json`); `qa/branded-mid.jpg` looked at.
**Verification** (`qa/verification.json`): ffprobe 656.733 · video ≥ audio (1.0 s) · decode 0 · cues 149/149 · AAC packets identical
(30,739) · final word "ATP." 3.13 s headroom · silent holds B8 hook 2 s, B10 read 4 s, B14 END 2 s all −91 dB · 13 boundaries,
0 candidates · marker audit every frame (E45 2,082 frames, 0 mismatches) · label audit 0 violations · longest still 7.23 s ·
text-only PASS (longest 0.5 s, 0 untagged). Encoded sheets (11) looked at (osmosis 8:28–9:12 master: crossings, counters and net
arrow live throughout; hook mapping held).
**Phases (UTC):** review/plan 15:30 · shared WPM open ends + Beats 8, 11–14 redesign 15:35–16:00 (Beats 1–7, 9–10 relaid in
parallel, each passing the every-frame audit) · re-voice 15:40 · render 15:59–16:22 (19,702 frames, audit live) · finish/verify/
sheets 16:22–16:30 · brand 16:30–16:36 · upload 16:36 · status 4 16:40:46.

---

## v1 (run 008a) — superseded (details below)
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
