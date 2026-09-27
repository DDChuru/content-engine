# 5.1.1 Inside a chromosome — REPORT (cloud run 009a)

**Model:** claude-opus-5-5 · branch `cloud/009-5.1.1-to-5.1.4-qls6vy` · built 27 Sep 2026 (UTC)
**Bunny (review):** guid `e45b3801-e495-49ef-b0a3-b6b36865e708`, title "REVIEW 5.1.1 Inside a chromosome", no collection; uploaded 11:06:16Z; **status 4 at 11:08:21Z (≈2 min)**; resolutions 240p–1080p, length 386 s.

## Phases (wall clock, UTC; from file and log timestamps, approximate to the minute)
| Phase | Time |
|---|---|
| setup + reading (brief, tooling, standards, specs, storyboard) | 10:20–10:30 |
| audio (TTS + Whisper), review, beat 10 retake | 10:30–10:41 |
| timeline (cue plan, holds, assemble) | 10:41–10:42 |
| shared models (t5-shared) + beats 1–11 authored, looked at, approved | 10:32–10:54 |
| render (11 beats, 4-way) | 10:54–10:58 |
| finish + verify + text-only + encoded sheets + count audit | 10:58–11:01 |
| bookends | 10:55–10:57 |
| branding | 11:01–11:05 |
| Bunny upload → status 4 | 11:06–11:08 |

## ElevenLabs characters (counter is ACCOUNT-WIDE; other sessions move it)
before 301,548 → after first pass 304,573 → before retake 306,124 → after retake 306,124 (the counter had not yet caught up). Lesson script 4,488 chars + beat 10 retake 431.

## Master / branded
- master `5.1.1-inside-a-chromosome.mp4`: 375.533 s, 11,266 frames, sha256 `defc8f4301e372a5292027a7e413d5ebdc3ac3ea58b511bfda958af92e3c3c83`
- branded: 386.562 s (= master + 11.03 s), full decode 0 errors, sha256 `8b52f301dc35d340ce8cc02f15e7eccec65370bb84f87aa428464d95e4ff0d47`; mid frame `qa/branded-mid.jpg` shows the lesson inside the cream frame with the 5.1.1 bar.

## Verification (verify.py, PIPELINE-STANDARD §4 order) — all PASS
1 ffprobe 375.533 s · 2 video 375.533 ≥ encoded audio 374.533 (margin 1.0 s) · 3 full decode 0 errors · 4 cues 108 = 108 = 108 planned, unique and in order · 5 AAC packets identical (17,558) · 6 final word "centromere" ends 371.64 s, headroom 2.89 s, −84 dB after · 7 silent intervals: Beat 11 END hold −91 dB, speech PCM unchanged · 8 beat-boundary one-frame holds: 0 candidates · marker audit every frame: 0 marked / 11,266 unmarked (no error beat) · longest unchanged visual 8.6 s (no >15 s) · `verify-text-only --controls` all PASS, 0 untagged shapes · `verify-text-only`: 0 text-only runs.

## Count audit (encoded master; crops in `qa/count-*.png`)
| Event | frame before | event frame |
|---|---|---|
| B5 replication complete (f3992) | 1 centromere · 1 DNA molecule (per chromosome) | 1 centromere · 2 DNA molecules |
| B8 replication complete, whole cell (f7374) | 4 · replication in progress | 4 · 8 (model X's complete on the same frame) |
| B9 centromeres divide, whole cell (f8123) | 4 · 8 | 8 · 8 (daughter-chromosome labels on the same frame) |
One pole 4 · 4 appears only after arrival (Beat 9 "each pole receives four").

## Sheets: what I saw and fixed
Per-beat stills: B1 camera lost the nucleus off-frame during the pay-out (fixed: nucleus tracked to the left edge); B2 text overlapped pictograms (fixed); B4 thread too thin / off-centre, labels crowded (enlarged, recentred); B6 a timing sign error left the chromosome half-condensed (fixed); B8/B9/B10 overlaps (respaced). Encoded sheets (7): no defects found; hook threads briefly cross the hook caption during the pull-back (transient, left).

## Pronunciation
No request normalisation. Beat 10 take 1 rejected ("histones" heard as "heath/he stones" by both models); take 2 kept. Details: `qa/audio-review.md`.

## Shared models used (sha256 of the copies in `src/`)
ChromosomeModel `d727c225…3319` · T5Annot `ec225c18…6961` · t5-palette `1b4ce00b…34aa` (byte-identical to cloud-inputs) · DNAContentGraph `4fcc7b5d…4591` · TelomereEndModel `8ba409de…b666` · CellCycleWheel `ddad7792…c22c` (copied before 5.1.3's two inset-scaling fixes; **not used by any 5.1.1 beat**, so 5.1.1 was not re-rendered). Full values: `work/t5-shared/SHARED.md` and this lesson's `src/`.

## Images / credits
None (no photomicrograph in 5.1.1). Video description: no image credit needed.

## Design choices
1. One `Chromosome` component draws every state from continuous condensation/replication parameters, so coiling and replication are always motion; separation is a one-frame `sep` switch.
2. Rings/highlights in the T5 accent over an ink halo; terracotta appears only in the house caption-bar chrome (the reject card is struck in ink).
3. Every count carries its compartment tag on a white count strip; values change only on event frames.

## Interpretations
- Beat 1 "threads pay out … view pulls back": 10 schematic threads (not 46) as separately ended threads, gaps kept; the human scale is never drawn as a 46-chromosome figure.
- Beat 9: poles drawn top and bottom (chromosomes aligned along a horizontal line) so eight daughter chromosomes fit the model cell; "daughter chromosome" labelled on one pair plus a tag for all separated units.
- Beat 2: the five-structure dots tick on added sub-cues (qa/cue-additions.md).
