# TOOLING — the hardened lesson pipeline, and how to adapt it to a new lesson

(Copied from `cloud-inputs/008/tooling` for run 009. The only script change is the `extract_script.py` fix noted below.)

These scripts come from **3.2.1 "Working conditions: temperature and pH"** (Biology 9700, built and verified on
machine A, 27 Sep 2026: 11 beats, 146 cues, fail-closed gates). Four helpers come from **13.4.2-3** (the newest
build): `raster-svg.cjs`, `verify-text-only.cjs`, `beat-fingerprint.cjs`, `stale.cjs`, plus `render-queue.sh` and
`el_usage.py`. There are NO beats, NO audio and NO media here. You author the beats yourself.

**The renderer is not Remotion.** Each frame is a React component tree → `react-dom/server` SVG → Sharp/librsvg JPEG
→ FFmpeg H.264, beat-chunked, and identical frames are reused by hash. Remotion is used ONLY for the bookends.

## What was already changed for the cloud (compared with machine A)

| File | Change |
|---|---|
| `generate_audio.py`, `el_usage.py` | No `xi-api-key` header. The environment injects the ElevenLabs credential into requests to `api.elevenlabs.io`. |
| `bunny-upload.sh`, `bunny-poll.sh` | No `AccessKey` header. The environment injects the Bunny credential for `video.bunnycdn.com`. Library id = `$BUNNY_BIO_LIBRARY_ID`. |
| `transcribe_audio.py`, `second_opinion.py` | `whisper_slot` removed. It was machine A's process cap and does not exist here. **Run at most ONE Whisper process at a time** (4 vCPU; `cpu_threads=4`). Never run `second_opinion.py` while `transcribe_audio.py` is running. |
| `audio-pipeline.sh` | Uses `python3`, not the machine-A conda env and not `keys.sh`. It runs TTS and transcription in parallel (one Whisper process, which is allowed). |
| `render-batch.sh`, `launch-render.sh`, `render-queue.sh` | No `flock /tmp/topic3-render.lock`. `render-batch.sh` runs **4 beats in parallel** (not 6). Never start two batches at once. |
| `verify-text-only.cjs` | The machine-A `node_modules` path was removed; modules resolve from the work dir. |
| `src-skeleton/Lesson.tsx` | Chrome shapes are tagged `data-role="decor"` (as in 13.4.2-3), so the role-based text-only audit works. |
| `keys.sh`, `verify-bunny.sh`, `whisper_slot.py` | Not shipped (machine-A only). |

## Setting up a lesson work dir

Repo root = the checkout. For lesson `<code>` (e.g. `4.1.3`):

```bash
W=work/<code>; mkdir -p $W/src/beats
cp -r cloud-inputs/009/tooling/. $W/                     # scripts, qa/, shared/src (house style), .gitignore
cp $W/src-skeleton/Lesson.tsx $W/src-skeleton/util.ts $W/src-skeleton/Panels.tsx $W/src/
cp cloud-inputs/009/topic-05/<code>/STORYBOARD.md $W/
cp work/t5-shared/*.tsx work/t5-shared/*.ts $W/src/     # the session's shared Topic 5 models + t5-palette.ts (see the brief)
```

`node_modules`: install ONCE at the repo root's `work/` level, or in each work dir, with pinned versions and no
lifecycle scripts:
`npm install --no-save --ignore-scripts react@19.3.0 react-dom@19.3.0 sharp@0.33.5 esbuild@0.28.1`
(sharp 0.33 and esbuild ship prebuilt platform packages, so they need no install scripts. Check this with
`node -e "require('sharp');require('esbuild')"`). Python: `pip install faster-whisper fonttools pillow numpy`.
apt: `ffmpeg fonts-dejavu-core` (`sheet-beat.py` uses DejaVuSans).
Fonts: `python3 make_fonts.py` (reads the brand WOFF2s from `packages/backend/src/remotion/public/stem4life/fonts`,
which is in `origin/dev`, and writes `fonts/*.ttf` + `fonts/fonts.conf`). Every render script sets `FONTCONFIG_FILE`.

## The pipeline, in order (per lesson)

1. `python3 extract_script.py` → `script.json` (narration VERBATIM; `*(silent read, N s)*` lines become holds).
2. `python3 el_usage.py before` and then `./audio-pipeline.sh` (TTS one file per beat + faster-whisper word
   timestamps). Existing MP3s are REUSED and never re-requested. Then run `python3 el_usage.py after`.
3. `python3 audio_review.py` → check the transcripts for mangled terms. Add request-only substitutions to
   `request_normalise.json` (`[[beat or 0, "from", "to"], …]`), move the bad MP3 aside, and regenerate that beat only. Log every
   diff in `qa/audio-review.md`.
4. `cue_plan.py` → write `PLANS` from the storyboard's `At *exact words*` cues (format in its docstring).
   `python3 insert_holds.py` (silent reads + END holds, digital silence only) → `python3 assemble_timeline.py` →
   `timeline.json`.
5. Author the models (`src/*.tsx`) and beats (`src/beats/BeatNN.tsx`). Then `python3 gen-index.py`.
6. Per beat: `node build.cjs && node qa-beat.cjs N && python3 sheet-beat.py N` → LOOK at `qa/beat-NN/sheet-*.jpg`
   → fix → repeat. Then `./approve.sh N` (records the source fingerprint you looked at).
7. `./render-batch.sh N N N N` (4 at a time) → `render-cache/beat-NN/complete.json`. `node stale.cjs` lists any beat
   whose source changed after its render. Every frame is checked for error-marker presence and badge text as it
   renders.
8. `python3 finish.py` → master MP4 (beats joined with `-c copy` + the narration AAC encoded once).
9. `python3 verify.py` → `qa/verification.json` (the PIPELINE-STANDARD §4 order, the every-frame marker audit and
   the boundary one-frame-hold audit). `node verify-text-only.cjs --controls` and then `node verify-text-only.cjs`
   → no text-only run over 2 s and no untagged shape. `python3 encoded-sheets.py` → `qa/encoded-sheets/*.jpg`
   from the ENCODED master; LOOK at every sheet.
10. Bookends, branding, Bunny: see the brief. `./bunny-upload.sh <branded.mp4> "<title>"`, then
    `./bunny-poll.sh <guid>` (FOREGROUND; it returns at status 4).

## Per-lesson edits (these files are hard-wired to 3.2.1: change them before step 1)

| File | Change |
|---|---|
| `extract_script.py` | `range(1,12)` → `range(1, <beats>+1)`. The regex tolerates blank lines. **Run 009 fix:** `> *(correction)*` marker lines (Topic 5 error beats) are skipped, so they are never spoken, and any other `*(…)*` directive line stops the script. Checked against all eight Topic 5 storyboards: word totals match each storyboard's table, and there are 7 silent reads, one per error beat. |
| `transcribe_audio.py` | `PROMPT` = this lesson's hard terms (e.g. chromatid, centromere, telomere, histone, cytokinesis, interphase, prophase, metaphase, anaphase, telophase, nucleolus, centriole, centrosome, meristem, toluidine, mitotic index, tumour, metastasis, carcinogen, TTAGGG). |
| `audio_review.py` | `WATCH` = the same kind of term list. `_spell()` maps recogniser spellings (numerals, US→UK) to the script's spellings, on the HEARD side only. Copy the same edits into `insert_holds.py` and `assemble_timeline.py` (the three `_spell`s must match). |
| `insert_holds.py` | DELETE the line `H[11]=[…]`. Holds come from the storyboard's silent reads. Add `('END',2.0)` for held closing frames that the storyboard asks for, e.g. `H[<last>]=H.get(<last>,[])+[('END',2.0)]`. |
| `cue_plan.py` | Replace `PLANS` completely (the shipped one is 3.2.1's, as a format example). Every cue phrase must be unique in its beat and in narration order. Never use a request-normalised word as a cue phrase. |
| `src/Lesson.tsx` | `TITLES` (beat headings), the header string (`BIOLOGY 9700 · <code> · <TITLE IN CAPS>`), the MODEL strip wording, `dark` (the objectives beat id, if it is dark), and **`ERROR_BEATS`**: e.g. `{7: {label: 'COMMON MISTAKE', clearKey: 'correct', animFrames: 6}}`. `clearKey` is the cue key on which the correct frame completes. The badge text must be exactly the one the storyboard assigns (COMMON MISTAKE or EXAM CONTRAST). `audits` stays `{}` (no covalent change in Topic 5). |
| `finish.py` | `== 11` and `id==11` → the beat count. Change the output file name `3.2.1-temperature-ph.mp4` (twice). |
| `verify.py` | The master file name, `beat-11.timed.words.json` → the last beat, the expected last word (`'denature'`), the marker-audit print message and the `valenceAudit` sentence. Recommended: copy 13.4.2-3's stricter cue check (matched == total == planned from `cue_plan.PLANS`). Its code is in this file's history note below. |
| `encoded-sheets.py`, `update_progress.py` | The master file name, the lesson title, the beat count, and the builder line. |
| `verify-text-only.cjs` | `bgOf`: the dark-background beat id (`=== 2`) and the colours. **Every shape** (rect/path/circle/…) needs a role on itself or an ancestor: `data-role="drawing"` for models, apparatus, particles and pictograms, and `data-role="decor"` for cards, pills, rings, underlines, connectors and chrome. An untagged shape is a hard error. Tag at the top `<g>` of each model. |

13.4.2-3's cue check (for `verify.py`, after the loop that counts `matched`):
```python
import sys as _sys; _sys.path.insert(0, str(P)); from cue_plan import PLANS
planned = sum(len(v) for v in PLANS.values())
assert matched == total == planned, ('cue count mismatch', matched, total, planned)
assert all(len(sc['cues']) == len(PLANS[sc['id']]) for sc in T['scenes']), 'per-beat cue count mismatch'
```

## House style (match it; do not redesign)

- `shared/src/theme.ts` (the BRAND palette: warm cream page, ink, terracotta `primary` for rings and errors, teal, green,
  muted), `shared/src/Type.tsx` (`Txt, Lines, Tag, Cite, Card, InkRing, Underline, Arrow, textW`, measured with
  `metrics.json`), `shared/src/ErrorMarker.tsx` (the persistent badge at x 1410–1850, y 22–78).
- `src-skeleton/Lesson.tsx` is the frame chrome: header y≈44, title y≈111, MODEL strip y≈170, caption bar at y≥959
  with the current cue's caption. **Content lives in x 70–1850, y 200–940.**
- `src-skeleton/Panels.tsx` holds the Biology exam-close pieces (`QHeader`, `Written` ✗/✓ answers, `QuoteTab`,
  `SideNote`, `Strike`, `CorrectCard`). `src-skeleton/util.ts` holds the easing helpers (`fi`, `fe`, `between`,
  `pulse`, `ramp`, `lerp`, `move`).
- `house-style/*.jpg`: what a finished 3.2.1 looks like (contact sheets and a branded mid-lesson frame).
- The beat function: `export default function BeatNN(s: any)` returns SVG. `s.a(key)` = seconds since cue `key`
  (−1e9 before it), `s.local` = beat seconds, `s.sc.duration`. Animate with `pathLength="1"` + dashoffset for ink.
  `raster-svg.cjs` expands those lengths for librsvg, which supports only M/L/H/V/C/Z. Any other path command throws
  on purpose. Greek π/σ are split into a fallback-font tspan.
- `prove-component.cjs tmp/x.tsx out.png` gives a quick still of a single component while you design it.

## Fingerprints and approvals

`beat-fingerprint.cjs` hashes `shared/src/{theme.ts,Type.tsx,ErrorMarker.tsx,metrics.json}`, every **top-level**
`src/*.tsx|ts|json`, `src/beats/index.ts`, `raster-svg.cjs`, `render-beat.cjs`, `build.cjs`, the beat file and any
`./lowercase-helper` it imports, and the beat's timeline scene. `render-beat.cjs` refuses to render a beat whose
source changed after `approve.sh`, and `finish.py` refuses stale beats. So put shared Topic 5 models at the TOP level
of `src/` (subfolders are not fingerprinted). Changing a shared model makes every beat stale, and that is correct.

## Checkpoint hygiene

The shipped `.gitignore` keeps `render-cache/`, `tmp/`, `*.mp4`, `*.wav`, `*.m4a`, `public/`, `fonts/*.ttf`,
`node_modules`, `logs/*.log` and the per-beat still PNG/SVGs out of git. Commit `audio/*.mp3` + JSON, `src/`,
`script.json`, `timeline.json`, `qa/*.json|md`, `qa/beat-NN/approved.json` and the sheet JPGs.
