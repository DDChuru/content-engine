# 5.1.4 Telomeres: why copying costs telomere, not genes — REPORT (cloud run 009a)

**Model:** claude-opus-5-5 · branch `cloud/009-5.1.1-to-5.1.4-qls6vy` · 27 Sep 2026 (UTC)
**Bunny (review):** guid `13c90983-4f7d-4693-8eaa-f315705b02be`, title "REVIEW 5.1.4 Telomeres: why copying costs telomere, not genes", no collection; uploaded 11:40:01Z–11:40:03Z; **status 4 at 11:42:05Z (≈2 min)**; 240p–1080p, length 256 s.

## Phases (wall clock, UTC; from file/log/commit timestamps, to the minute)
| Phase | Time |
|---|---|
| balance check, TTS (8 beats), Whisper, review, beat 4 retake | 11:18–11:27 |
| cue plan (77 cues), holds, timeline | 11:27 |
| beats 1–8 authored, looked at, fixed, approved | 11:28–11:34 |
| render (8 beats, 4-way, two batches) | 11:34–11:36 |
| finish, verify, text-only, encoded sheets, count audit | 11:36–11:37 |
| bookends (concurrent) · branding | 11:35–11:36 · 11:38–11:39 |
| Bunny upload → status 4 | 11:40–11:42 |

## ElevenLabs characters (ACCOUNT-WIDE counter; parallel sessions move it)
before 320,145 (limit 363,000; guard 1.2 × 2,965 = 3,558 → PASS) → after 321,776 → after beat 4 retake 321,776 (counter did not move on the 349-char retake). Script 2,965 chars + retake 349.

## Master / branded
- master `5.1.4-telomeres.mp4`: 245.967 s, 7,379 frames, sha256 `d42dadc6d66109a91e2cffc54c12a1284a49854fa828eaa662b26ac4140b79fd`
- branded: 256.996 s (= master + 11.03 s), full decode 0 errors, sha256 `752514b48f471466d17bdd16480a6a95db0aa62d5574f9056ad4000cbf73163a`; `qa/branded-mid.jpg` (lesson inside the cream frame, 5.1.4 bar).

## Verification — all PASS
1 ffprobe 245.967 s · 2 video 245.967 ≥ audio 244.966 (margin 1.00 s) · 3 full decode 0 errors · 4 cues 77 = 77 = 77 planned · 5 AAC packets identical (11,484) · 6 final word "intact." ends 241.81 s, headroom 3.16 s (−23.3 dB after the word = breath tail; nothing clipped) · 7 silent read: B8 END 2 s, PCM all zero, −91 dB; speech PCM unchanged · 8 boundary one-frame holds: 0 of 7 boundaries · every-frame marker audit: no error beat in this lesson; 0 marked / 7,379 unmarked, 0 mismatches · longest unchanged visual 7.0 s (B2, frame 884); none over 15 s · text-only controls PASS; 0 untagged; two 0.5 s sparse samples in B3 (58.5 s, 60.5 s), none over 2 s.

## Count audit (encoded master)
No chromosome or DNA-molecule counter in this lesson (no replication-complete, separation or cytokinesis event on screen). The only counter is the replication-round counter (B5), which counts rounds as each one starts. Read from the encoded master (pixel scan + stills): frame 3226 shows 0, and 3227 (the first frame at or after the "grow1" cue at 107.54 s) shows 1. Frame 3499 shows 1, and 3500 (the "grow2" cue at 116.66 s) shows 2. Frame 3688 (the round-3 start, 122.93 s) shows 3. The only other change in the 100–130 s scan is the counter fading in at 104.07–104.43 s (frames 3122–3133). No telomere block is ever detached; the end steps only on each round's completion (ENDS 1 → .935 → .868 → .8).

## Sheets: seen and fixed
Beat 4: the zoom first targeted the chromatid centre and the model overran the panel during the zoom — target moved to the ringed tip and a clipPath added (fixed before render). Other beats: small overlaps respaced before approval. Encoded sheets (5): no defect found.

## Pronunciation
No request normalisation (`request_normalise.json` = `[]`); "T, T, A, G, G, G" spoken as letters. Beat 4 take 1 rejected ("short" heard as "shot" in the telomere definition); take 2 kept. Beat 8: small model dropped "too short" and heard "cloze" as "close"; the medium model hears "too short"; homophone kept. `qa/audio-review.md`.

## Shared models used (sha256 of `src/` copies = `work/t5-shared`)
ChromosomeModel `d727c225…3319` · CellCycleWheel `577b4186…6d7c` · DNAContentGraph `4fcc7b5d…4591` · TelomereEndModel `8ba409de…b666` (published here) · T5Annot `ec225c18…6961` · t5-palette `1b4ce00b…34aa`.

## Images / Video description
No image in 5.1.4; no credit paragraph needed.

## Design choices
1. One TelomereEndModel stage for Beats 4–7: DNA strip, two genes and the grey run, with each round a daughter copy growing along the template and stopping short, so the cost is seen, never stated alone.
2. The thought experiment (no-telomere state) keeps a dashed accent frame and "thought experiment — not a real chromosome" on every frame, then visibly returns to the real state.
3. The grey run is labelled as a whole (TTAGGG on the run), never block by block; the round counter is the only counter on screen.

## Interpretations
- Hook magnifier (B1) is drawn as a miniature of the telomere model's motion contract on one grey tip (a copy grows and stops just short), tagged "round 1".
- B4's "zoom into the tip" is a continuous camera zoom from the ringed chromatid tip that resolves into the real-state model at the end of the zoom (clipped to the panel).
- B6: the narration gives about 2 s between "run the same rounds" and "reaches"; rounds 1–2 run inside that window (≈0.7 s each), and round 3 runs from "reaches", where the end meets gene 2 and the daughter's copy of that gene is cut short (ringed).
