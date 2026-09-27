# 5.1.2 Why mitosis makes identical cells: growth, replacement, repair and asexual reproduction — REPORT (cloud run 009b)

**Model:** claude-opus-5-5 · branch `cloud/009-5.1.2-to-5.1.6-rmr4ks` · 27 Sep 2026 (UTC)
**Bunny (review):** guid `bb8b4308-95c1-4d19-912f-40f4c7561710`, title "REVIEW 5.1.2 Why mitosis makes identical cells: growth, replacement, repair and asexual reproduction", no collection; uploaded 13:07:08Z; **status 4 at 13:09:17Z (≈2 min)**; 240p–1080p, length 405 s.

## Phases (wall clock, UTC; from log/file timestamps)
| Phase | Time |
|---|---|
| setup (branch, apt/pip/npm, t5-shared from 009a), reading | 12:00–12:11 |
| TTS + Whisper (10 beats), review, second opinion, Beat 7 retakes | 12:11–12:17 |
| cue plan (102 cues), holds, timeline | 12:17–12:19 |
| MitosisCellModel (new shared model), ContextStrip / IdenticalChain, beats 1–10 authored, looked at, fixed, approved | 12:19–12:44 |
| render (10 beats, 4-way) | 12:44–12:51 |
| finish, verify, text-only, encoded sheets, count audit | 12:51–12:58 |
| bookends · branding | 12:55–12:57 · 12:58–13:01 |
| Bunny upload → status 4 | 13:07–13:09 |

## ElevenLabs characters (ACCOUNT-WIDE counter; parallel sessions move it)
before 322,310 → after 324,495 → after the Beat 7 retakes 325,601. Script 4,743 chars (+2 × 605 for the retakes).

## Master / branded
- master `5.1.2-mitosis-identical-cells.mp4`: 394.600 s, 11,838 frames, sha256 `891cc477a4143e7ce1d5d7bad82ab323ab4bcb3ca8dc3722557755c1a505b38b`
- branded `5.1.2-branded.mp4`: 405.629 s (= master + 11.03 s), full decode 0 errors, sha256 `fac4a648fd7bd32107c34625ea232b1941eccc81978a576130bf38936cf93279`; `qa/branded-mid.jpg` (Beat 4 inside the cream frame, 5.1.2 bar).

## Verification — all PASS (`qa/verification.json`)
1 ffprobe 394.600 s · 2 video 394.600 ≥ audio 393.600 · 3 full decode 0 errors · 4 cues 102 = 102 = 102 planned (unique, in order) · 5 AAC packets identical (18,451) · 6 final word "chromosome" ends 390.31 s, headroom 3.29 s · 7 silent reads: B5 4 s, B4 END 2 s (memory hook), B10 END 2 s — digital silence, −91 dB; speech PCM unchanged · 8 boundary one-frame holds: 0 · **every-frame marker audit: EXAM CONTRAST on B5 frames 4430–6561 (clears on 6562, the completed correct frame); 2,132 marked / 9,706 unmarked, 0 mismatches; badge MAE vs EXAM ref ≤ 3.93, vs COMMON ≥ 20.4** · longest unchanged visual 7.1 s · `verify-text-only --controls` PASS; text-only runs 0; untagged shapes 0.

## Count audit (encoded master; `qa/count-audit.png`, `qa/count-b5tel.png`)
| Event (frame) | frame before | event frame |
|---|---|---|
| B3 replication complete (1941) | whole cell 4 · replication in progress | 4 (8 sister chromatids) · 8 |
| B3 centromeres divide (2394) | 4 (8 sister chromatids) · 8 | 8 daughter chromosomes · 8 (label *daughter chromosome* on the same frame) |
| B4 new envelopes closed (3187) | whole cell 8 · 8; one pole 4 · 4 | whole cell 8 · 8; each new nucleus 4 · 4 |
| B4 cytokinesis complete (3565) | whole cell 8 · 8; each new nucleus 4 · 4 | each daughter cell 4 · 4 |
| B5 Replay: centromeres divide (6296) | 4 (8 sister chromatids) · 8 | 8 daughter chromosomes · 8 |
| B5 Replay: envelopes closed (6504) | 8 daughter chromosomes · 8 | whole cell 8 · 8; each new nucleus 4 · 4 |

## Sheets: seen and fixed
Model: telophase chromosomes sat outside the new nuclei and the centrosomes inside them (MitosisCellModel geometry fixed before any approval); cells enlarged (size 0.8). Beat 2 pictograms now visible from frame 0. Beats 5, 6, 7, 10: overlapping tags/rows respaced; form titles wrap. A render started from stale approvals was stopped and re-queued (never more than 4 beats rendering thereafter). Encoded sheets (7): no defect found.

## Pronunciation
Beat 7: two takes voiced "where needed" as "when needed" (both recognisers) → request-only comma `where, needed`; take 3 heard correctly. "interphase" heard "interface" (z/s voicing): kept. `qa/audio-review.md`.

## Shared models used (sha256 of `src/` copies = `work/t5-shared`)
ChromosomeModel `d727c225…3319` · CellCycleWheel `577b4186…6d7c` · DNAContentGraph `4fcc7b5d…4591` · TelomereEndModel `8ba409de…b666` · T5Annot `ec225c18…6961` · t5-palette `1b4ce00b…34aa` · **MitosisCellModel `f063ac7b…5b9e` (ADDED in this session; see `work/t5-shared/SHARED.md`)**.

## Images / Video description
No image in 5.1.2; no credit paragraph needed.

## Design choices
1. One diagram carries the lesson: IdenticalChain (parent card → cell → daughter cards, chain strip copy · share · result) stays on screen, reduced, through Beats 6–10.
2. The four context panels share one 600 × 420 design box, so the strip can focus one panel without redrawing; set cards compare only within a panel.
3. MEMORY HOOK rule: at "replication makes identical sister chromatids" the *copy* tag, link 1 and the clause glow together; at "…one copy of every chromosome" *share one of each*, link 2 and clause 2; then a 2 s silent hold.

## Interpretations / for the conductor
- **Memory hook said as a phrase:** Beat 4 speaks the handle "copy, then share one of each" as one phrase before "Written properly…"; the links (copy → replication, share → separation) are only implied by the converted sentence. On screen they are made explicit (*memory aid: copy → replication · share one of each → separation (not the exam answer)*). Narration unchanged.
- Beat 1: the graze magnifier becomes the repair panel ("the knee reduces into … the panel frames"). Dividing-cell glyphs in the strip carry the Round-1 excerpt caption.
- Beat 8 regrows the runner under a visible *replay: the runner grows out* tag. Beat 5's error-beat title omits the badge word so the title never shows a badge after the marker clears.
