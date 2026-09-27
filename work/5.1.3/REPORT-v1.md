# 5.1.3 The mitotic cell cycle: copy first, then share — REPORT (cloud run 009a)

**Model:** claude-opus-5-5 · branch `cloud/009-5.1.1-to-5.1.4-qls6vy` · 27 Sep 2026 (UTC)
**Bunny (review):** guid `8d2edf6f-e5d3-4f2d-81df-177cb2f4ae00`, title "REVIEW 5.1.3 The mitotic cell cycle: copy first, then share", no collection; uploaded 11:34:54Z; **status 4 at 11:37:57Z (≈3 min)**; 240p–1080p, length 529 s.

## Phases (wall clock, UTC; from file/log timestamps, to the minute)
| Phase | Time |
|---|---|
| setup, TTS + Whisper (14 beats), review, beat 14 retake | 10:55–11:05 |
| cue plan (147 cues), holds, timeline | 11:05–11:06 |
| beats 1–14 authored, looked at, fixed, approved | 11:07–11:17 |
| render (14 beats, 4-way) | 11:17–11:24 |
| finish, verify, text-only, encoded sheets, count audit | 11:24–11:28 |
| bookends (concurrent) · branding | 11:18–11:24 · 11:28–11:33 |
| Bunny upload → status 4 | 11:34–11:38 |

## ElevenLabs characters (ACCOUNT-WIDE counter; parallel sessions move it)
before 309,506 → after 312,893 → after beat 14 retake 313,171. Script 6,159 chars + retake 506.

## Master / branded
- master `5.1.3-mitotic-cell-cycle.mp4`: 518.233 s, 15,547 frames, sha256 `af41bf0ec28044262889bc19a579d643fed638cfd68a0ec92b663bdc8af95dcc`
- branded: 529.262 s (= master + 11.03 s), full decode 0 errors, sha256 `134cfd8f0f05d2713557332efae276161bc49d34f12eae7fb3a189068791829e`; `qa/branded-mid.jpg` (Beat 7 inside the cream frame, 5.1.3 bar).

## Verification — all PASS
1 ffprobe 518.233 s · 2 video 518.233 ≥ audio 517.233 · 3 full decode 0 errors · 4 cues 147 = 147 = 147 planned · 5 AAC packets identical (24,247) · 6 final word "cells" ends 514.18 s, headroom 3.05 s (−28.5 dB in the next second = the take's breath tail before the END silence; nothing clipped) · 7 silent reads: B10 4 s and B12 4 s digital silence, −91 dB; B14 END −91 dB; speech PCM unchanged · 8 boundary one-frame holds: 0 · **every-frame marker audit: EXAM CONTRAST on B10 frames 8324–10464 (clears on 10465, the completed correct frame) and B12 frames 11275–13340 (clears 13341); 4,207 marked / 11,340 unmarked, 0 mismatches; badge-text MAE vs EXAM ref ≤ 3.93, vs COMMON ≥ 20.4** · longest unchanged visual 7.9 s · text-only controls PASS, 0 untagged, 0 text-only runs.

## Count audit (encoded master; `qa/count-*.png`)
| Event (frame) | before | event frame |
|---|---|---|
| end of S (3863) | whole cell 4 · replication in progress; inset "1 chromosome · replication in progress"; human 46 · in progress | 4 (8 sister chromatids) · 8; inset 1 · 2; human 46 (92 chromatids) · 92 |
| centromere divides (5708) | 4 (8 sister chromatids) · 8; inset 1 chromosome · 2 | 8 · 8; inset "tracked pair: 2 daughter chromosomes · 2 DNA molecules …"; human 92 · 92 |
| new nuclei formed (6073) | whole cell 8 · 8 | + each new nucleus 4 · 4 (human + 46 · 46) |
| cytokinesis complete (6905) | whole cell 8 · 8 / each new nucleus 4 · 4; trace at 2 | each daughter cell 4 · 4; per-cell trace drops 2 → 1 on this frame; inset "tracked chromosome in this daughter cell: 1 · 1" |

## Sheets: seen and fixed
Beat 5: a sign error ran the marker and pen backwards during S (fixed before render). Beat 7: decondensing daughter chromosomes swelled beyond the inset (CellCycleWheel fix, twice). Beat 10: talk-through boxes collided with the citation tabs (hidden when the tabs land). Beats 4, 6, 9, 13, 14: overlaps respaced. Encoded sheets (10): no defect found.

## Pronunciation
No request normalisation. Beat 14 take 1 rejected ("chromatid" heard as chromated/cremated); take 2 kept. "interphase" heard as "interface" by the unprompted model (z/s voicing only): kept. `qa/audio-review.md`.

## Shared models used (sha256 of `src/` copies = `work/t5-shared`)
ChromosomeModel `d727c225…3319` · CellCycleWheel `577b4186…6d7c` (published here; includes the two inset fixes) · DNAContentGraph `4fcc7b5d…4591` (published here) · TelomereEndModel `8ba409de…b666` · T5Annot `ec225c18…6961` · t5-palette `1b4ce00b…34aa`.

## Images / Video description
No image in 5.1.3; no credit paragraph needed.

## Design choices
1. One stage for Beats 4–8: wheel, per-cell graph and count strip, with the graph pen tied to the wheel marker so replication, the rise and the counters move as one.
2. Error beats keep small copies of the wheel and graph at left, dimmed, with the EXAM CONTRAST panel at right; terracotta only in the badge, frame, card rings and strikes.
3. Every count names its compartment; the inset counter follows the round-2 tracked-pair wording.

## Interpretations
- Long arc labels are callouts from one slot above the wheel, with a leader line to the arc (they replace one another; short labels stay on the arcs).
- Beat 9's miniature separation and Beat 11's inset replays are tagged "replay: mitosis" / "earlier in mitosis" (replays reset visibly).
- Beat 12's enlarged M inset is drawn as a separate panel beside the card (same C1 model, spindle poles, fibres, one-frame separation).
- Beat titles for the error beats omit the badge words ("E5-01: seen is not copied") so the title never shows a badge after the marker clears.
