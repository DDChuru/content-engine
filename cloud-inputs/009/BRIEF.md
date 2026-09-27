CLOUD RUN 009 — BUILD a LIST of Cambridge A Level Biology 9700 **Topic 5 (the mitotic cell cycle)** lessons end to end, one after another in this session. For each one: narration → Whisper → render → brand → Bunny upload for review.

LESSONS (in this order — the launch prompt gives the list; if it is missing, STOP and ask): <LIST, e.g. 5.1.1 5.1.3 5.1.4>

FIRST LINE OF YOUR FIRST REPLY: your exact model ID. Then report whether `CLAUDE_CODE_REMOTE` is set, and echo the LESSONS list back.

## Who and what
Stem 4 Life teaches Cambridge International A Level Biology 9700 to students aged 17–19 in Zimbabwe and South Africa. These are PRODUCTION lessons, to be published beside more than 40 finished lessons, so they must match those lessons. Every storyboard has been written, checked independently and CLEARED FOR NARRATION. 5.2.1 and 5.2.2 also carry the final image edits of 27 Sep. Other cloud sessions may be building other Topic 5 lessons at the same time as you.

## Hard rules
- Push ONLY your own branch **`cloud/009-<first code>-to-<last code>`** (one lesson: `cloud/009-<code>`), e.g. `cloud/009-5.1.1-to-5.1.4`. It may contain text, scripts, `src/`, JSON, per-beat MP3 audio and small PNG/JPG stills. NEVER push `dev`, `master`, `cloud/inputs-009` or any other branch. No tags, no PRs, no deploys. **NEVER put an MP4 or any other video in git.**
- Never print, log or write a secret. The ElevenLabs and Bunny keys are NOT in your environment. They are API credentials that the environment injects into requests to `api.elevenlabs.io` and `video.bunnycdn.com`, so call those APIs WITHOUT a key header. (The shipped scripts already do this.)
- In Bunny: upload ONLY each lesson's final branded video, with NO collection. Delete nothing and move nothing.
- **Never end your turn while work is pending.** A cloud session that ends its turn stops. Stay in the FOREGROUND until EVERY lesson in your list is at Bunny `status` 4 and its REPORT is pushed. A single tool call is capped at about 10 minutes. So run long jobs (renders, `bunny-poll.sh`) detached with `setsid nohup … &`, then wait for them in the foreground with repeated bounded loops, e.g. `timeout 540 bash -c 'until [ -f render-cache/beat-07/complete.json ]; do sleep 20; done'`. Check the logs between loops. Never answer with a summary while anything is still running.
- Only ONE Whisper process at a time. Render at most 4 beats at once (4 vCPU).

## Setup (once per session)
1. `git fetch origin dev cloud/inputs-009 && git checkout -B <your branch> origin/dev && git checkout origin/cloud/inputs-009 -- cloud-inputs/009`. Do NOT commit `cloud-inputs/009` to your branch (`git reset -q cloud-inputs` before each commit, or add only `work/`).
2. `apt-get update && apt-get install -y ffmpeg fonts-dejavu-core` (run `update` FIRST, because the image index is stale). `pip install faster-whisper fonttools pillow numpy`.
3. Node, pinned and with no lifecycle scripts, in `work/`: `mkdir -p work && cd work && npm init -y >/dev/null && npm install --ignore-scripts react@19.3.0 react-dom@19.3.0 sharp@0.33.5 esbuild@0.28.1 remotion@4.0.525 @remotion/bundler@4.0.525 @remotion/renderer@4.0.525`. Each lesson dir resolves modules from `work/node_modules`. Check with `node -e "require('sharp');require('esbuild')"`. Record the versions. Remotion fetches its own Chrome from remotion.media. Then `printf 'node_modules/\npackage.json\npackage-lock.json\n' > work/.gitignore` so they are never committed.

## Read fully, once, in this order
1. `cloud-inputs/009/tooling/TOOLING.md`: the pipeline, what was changed for the cloud, and the per-lesson edits the scripts need. It is not optional. Note the run-009 fix: `> *(correction)*` lines in error beats are markers and are never spoken.
2. `cloud-inputs/009/standards/VIDEO-STRUCTURE.md` (ALL of it: WHAT a lesson must be), `PIPELINE-STANDARD.md` (HOW to build one) and `CONTENT-ARCHITECTURE.md`.
3. `cloud-inputs/009/topic-05/SHARED-SPECS.md`, ALL of it, especially:
   - §4, the counting and wording conventions and the Round-1 contracts
   - §5, the shared models and colour tokens
   - §6, the squash and image interpretation
   - §7, frames and motion
   - §8, error beats and badges

   Then `cloud-inputs/009/topic-05/t5-palette.ts` (the colour tokens as exact hex), `TOPIC-PLAN-05-CELL-CYCLE.md` (the error entries and traps) and `topic-05/ASSETS-NEEDED.md` (its RESOLUTION section is final). The storyboards cite run-007 paths (`plan/topic-05/…`, `work/007/…`), and the same files are here. Every quotation you need is already verbatim in the storyboard. Copy it from there, character for character.
4. `cloud-inputs/009/images/CREDITS.md` and `COORDS.json`, if any lesson in your list uses an image (5.2.1 and 5.2.2 do).
5. For EACH lesson in your list: `cloud-inputs/009/topic-05/<code>/STORYBOARD.md`. The storyboard is the contract.
6. The house style: `cloud-inputs/009/tooling/shared/src/`, `src-skeleton/` and the stills in `tooling/house-style/`. Match the frame, palette, typography, header strip and caption bar. Design the cell visuals yourself inside that style.

## Shared Topic 5 models — built once per session, identical everywhere
- Before the FIRST lesson's beats, build the shared models that your lessons use. Build them exactly to SHARED-SPECS §5 and the "models, specified once" section of the publishing storyboard. Put them in **`work/t5-shared/`** as top-level `.tsx` files plus a copy of `t5-palette.ts`.
  - `ChromosomeModel` (published by 5.1.1)
  - `CellCycleWheel` and `DNAContentGraph` (published by 5.1.3, with the M sub-states and the `per-nucleus` variant)
  - `TelomereEndModel` (published by 5.1.4)
  - `MitosisCellModel`, animal and plant, the full "mitosis stage set" (published by 5.2.1)
  - `RootTipSquashRig` and `FieldOfViewSchematic` (5.2.2), where a lesson in your list uses them
- Keep the state ids, zoom levels, labels, 2n = 4 chromosome set (C1–C4 hues), count strip and compartment tags, and the motion contracts. Use ONLY the `T5` colours. Terracotta is reserved for the error marker, and rings use `T5.ring` with its ink halo. Tag every model's top `<g>` `data-role="drawing"`.
- `StemCellLineage` (5.1.5), `TissueGrowthModel` (5.1.6), `ContextStrip` / `IdenticalChain` (5.1.2) are owned by their lessons and live in that lesson's `src/`.
- Every lesson COPIES `work/t5-shared/*` byte for byte into its own `src/`. The copies are fingerprinted there, so they must sit at the top level of `src/`. Never edit a copy. To fix a model, change `work/t5-shared/`, re-copy it to every lesson of this session that uses it, re-approve and re-render the affected beats. Write `work/t5-shared/SHARED.md` with each model's states and the sha256 of each file. Each lesson's REPORT lists the sha256 values it used.
- If the launch prompt says `SHARED_FROM=<branch>`, copy `work/t5-shared/` from that branch (`git checkout origin/<branch> -- work/t5-shared`) instead of building it. Extend it only for states it lacks, and report every addition.

## Topic 5 specifics (binding)
- **Counts are law.** Chromosomes are counted by centromeres. Every count names its compartment (whole cell / one pole / one nucleus / one daughter cell). A counter changes ON THE EVENT FRAME: replication completing, centromeres dividing, cytokinesis. It never changes on a later narration cue. At separation the chromosome count and the *daughter chromosome* label change on the separation frame, and the DNA-molecule count does not change. Use SHARED-SPECS §4's table and nothing else. Anaphase: the centromere divides and sister chromatids separate; never "the chromosome splits in half". Say "poles", not unqualified "sides". Prophase: chromosomes condense and become visible, never "form" or "replicate". Use "nuclear envelope", not "nuclear membrane" (except as the word under discussion in E5-03).
- **Every stated event is MOTION:** condensation, the envelope fragmenting and re-forming, the nucleolus fading and reappearing, the spindle forming, alignment, the centromere dividing, poleward movement, the furrow, cell-plate fusion, replication progress across S, telomere shortening, division, differentiation, tumour growth and spread. There is never a cut between stills for a process. Division excerpts carry their omission caption and an explicit time cut (Round-1 contracts).
- **Image frames are STATIC.** A photomicrograph's or drawing's pixels never change: no pan, no animated zoom, no cross-fade between images, no retouching, no recolouring. **Only annotations animate:** rings, labels, count tags, arrows and scan boxes, drawn over the image. Where a storyboard says "ringed and zoomed", show the enlarged region as a separate static inset panel (a crop of the same unaltered pixels) that appears beside the ring. The image does not scale in place.
  - Ring boxes come from `COORDS.json` (final-file pixels, origin top-left). Map them through the image's display scale and offset.
  - Embed an image once, as a data URI cached in a module constant, pre-scaled once to its display size (for example with sharp, at the start of the build). Never re-encode an image per frame.
  - Tag the `<image>` element `data-role="drawing"`.
- **Credit lines on screen.** Whenever a licensed image is on screen, its panel carries the credit line from `CREDITS.md` in small type, exactly: *Berkshire CC Bioscience Image Library · CC0 · onion (Allium) root tip, longitudinal section · stain not stated*. Add *· separate field* for PM-MET and PM-PALE. Never call these images garlic, a squash or toluidine blue.
- **Drawings are captioned as drawings.** PM-MET-ANGLE, PM-TEL and PM-UNCLEAR are drawings. Their panel line reads *drawing — not a photomicrograph* (the text is also in the image). Everything else drawn is labelled MODEL / *schematic* as the storyboard says.
- **The squash practical uses toluidine blue** (dark-blue chromatin, paler background, darkening only in intensity). The licensed photos are a differently stained section. Never use one as the other's colour standard. Identify stages by structure, not hue, and say so where the storyboard does.
- Put the courtesy credit paragraph from `CREDITS.md` ("Root-tip photomicrographs: Berkshire Community College …") into the lesson's REPORT under **Video description**, for every lesson that shows an image.

## Per lesson (in list order)
Work in `work/<code>/`, set up as TOOLING.md describes. Make the per-lesson script edits first.

### Non-negotiables
- **Narration is FROZEN**, word for word. If a line cannot be built as written, stop that beat and report.
- **Audio:** ElevenLabs voice `BcpjRWrYhDBHmOnetmBl` (Thandi), `eleven_multilingual_v2`, speed 1.0, one file per beat, as shipped in `generate_audio.py`. No time-stretching: the timeline comes from MEASURED audio.
  - Before generating, run `python3 el_usage.py before-<code>`. If `character_limit − character_count` is less than 1.2 × the lesson's characters (the `extract_script.py` total), STOP and report instead of generating. The counter is ACCOUNT-WIDE, so parallel sessions move it too. All eight lessons together are about 42,600 characters.
  - Normalise pronunciation ONLY in the request text (`request_normalise.json`), never in the storyboard. Log every diff in `qa/audio-review.md`.
  - Check the transcripts for mangled terms. Likely traps: chromatid(s), centromere, centriole(s), centrosome, telomere(s), histone, nucleolus, cytokinesis, interphase, prophase/metaphase/anaphase/telophase, "S phase" / "G1" / "G2", meristem, toluidine, TTAGGG, "2n", mitotic index, tumour(s), metastasis, carcinogen.
- **VIDEO-STRUCTURE.md rules, all of them.** In particular:
  - Error beats use the five moves, with the badge EXACTLY as SHARED-SPECS §8 assigns: E5-01 and E5-02 (5.1.3), E5-04 (5.2.1), E5-06 (5.1.2) and E5-07 (5.1.6) are **EXAM CONTRAST**; E5-03 (5.2.1) and E5-05 (5.2.2) are **COMMON MISTAKE**. Set them in `ERROR_BEATS`; the renderer audits every frame. The silent reads are digital silence, via `insert_holds.py`. The `*(correction)*` line marks where move 5 starts: use it for the correction cue, never as speech.
  - Timers start at first contact (the acid in 5.2.2) and never reset.
  - Physically possible handling.
  - Colour changes only through real colours.
  - Calculated values are labelled calculated, and DNA content is in *arbitrary units*.
  - "Say the typical thing as typical."
  - At most 15 s between visual changes.
  - No text-only frames (verify-text-only: no run over 2 s).
  - Exam wording is quoted exactly.
  - No logo, progress bar, timer or beat counter in the lesson body.
- **Render per beat**, 4 at a time. A failure must cost one beat, not the lesson.

### Checkpoint (the session can end before the build does)
After the audio, after the timeline, and after every 3 beats: commit `work/<code>/` and `work/t5-shared/` (source, scripts, JSON, `PROGRESS.md`, `audio/*.mp3`, approvals, sheets; NO MP4/WAV), then `git push origin <your branch>`. The repo's root `.gitignore` ignores `*.mp3` and `render-*.sh`, so add those with `git add -f` (for example `git add -f work/<code>/audio/*.mp3 work/<code>/render-*.sh`). `PROGRESS.md` is written for a successor with no memory: the lesson list and which lessons are done, the exact next step, and every decision. A relaunch resumes from your branch. Do not commit the pre-scaled images (they are derived; regenerate them from `cloud-inputs/009/images`).

### Finish (per lesson)
1. `finish.py` → the master MP4. `verify.py`, in the standard's order: ffprobe · **video ≥ encoded audio** · full decode with 0 errors · cues matched = cue total = planned · audio packets unchanged · final word not clipped · silent reads measure silent · no one-frame holds at beat boundaries · every-frame marker audit on each error beat (presence AND badge text). Then `verify-text-only.cjs --controls` and `verify-text-only.cjs`. Add a **count audit** to the REPORT: for each event frame (replication complete, separation, cytokinesis), the counter values on the frame before and on the event frame, read from the rendered stills.
2. `encoded-sheets.py`: contact sheets from the ENCODED master. LOOK at every sheet, fix what you find (a fix costs one beat), then finish again. On image beats, check that the rings sit on the COORDS regions and that the credit or drawing line is present. Push the sheets (small JPGs).
3. **Bookends:** copy `cloud-inputs/009/branding/bookend-src` to `work/<code>/bookend-src` and copy `packages/backend/src/remotion/public/stem4life/fonts` into its `public/stem4life/`. Then run `node render-bookends.mjs "<code>=<title>"` (renders `Stem4LifeIntroB` `{title, subtitle:"Cambridge A Level · Biology", heroHeight:518}` and `Stem4LifeOutro` `{title, subtitle, aesthetic:"C"}`, 1920x1080 @ 30; see `branding/RENDER-BOOKENDS.md`). `<title>` is the storyboard H1 after "<code> — ", also listed in `branding/titles-topic-05.tsv`. LOOK at a SETTLED late frame of each (never frame 0). The title must read exactly `<title>`.
4. **Brand:** `BAR_PNG=cloud-inputs/009/branding/bar-<code>.png MUSIC_MP3=cloud-inputs/009/branding/tutorial.mp3 INTRO_MP4=<intro> OUTRO_MP4=<outro> cloud-inputs/009/branding/apply-branding-cloud.sh <master.mp4> <branded.mp4>`. The bars were pre-rendered on machine A, so do not redraw them. Verify: duration ≈ master + 11.03 s, full decode with 0 errors, and a mid-lesson frame showing the lesson inside the cream frame with this lesson's title bar (save it as a small JPG).
5. **Upload to Bunny for REVIEW:** `./bunny-upload.sh <branded.mp4> "REVIEW <code> <title>"`. It POSTs `https://video.bunnycdn.com/library/$BUNNY_BIO_LIBRARY_ID/videos` with only the title (NO collection), then PUTs the file with `curl -T`. Then start `setsid nohup ./bunny-poll.sh <guid> > logs/bunny-poll.out 2>&1 &`. It polls every 60 s until `status` is 4 (`availableResolutions: null` means NOT YET, not failed). **While Bunny encodes, start the next lesson** (audio first). Come back to check the poll between steps, and before the end of the session, in the foreground.
6. **Report** → `work/<code>/REPORT.md`, under 80 lines, written ONLY after status 4 is confirmed (no placeholders). Include:
   - model ID
   - every phase with its wall-clock time
   - ElevenLabs characters (before/after, and note that the counter is account-wide)
   - master and branded duration and sha256
   - every verification result, plus the count audit
   - what you saw on the sheets and what you fixed
   - the Bunny guid, the upload time and the time to status 4
   - pronunciation fixes
   - the shared-model sha256 values used
   - the images used, with their credit lines, and the Video description
   - design choices, in three lines
   - anything in the storyboard that needed interpretation

   Commit and push your branch.

## End of session
Stop only when every lesson in the list has a pushed REPORT with a confirmed status 4, or when a hard stop happened (the ElevenLabs budget ran out, or a frozen line could not be built). In the hard-stop case, push a `work/SESSION-<first code>.md` saying what stopped it and exactly where to resume. Your final message: the branch name, and one line per lesson: code, Bunny guid, status, branded duration.
