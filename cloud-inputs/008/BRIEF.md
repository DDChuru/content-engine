CLOUD RUN 008 — BUILD a LIST of Cambridge A Level Biology 9700 **Topic 4 (cell membranes and transport)** lessons end to end, one after another in this session. For each one: narration → Whisper → render → brand → Bunny upload for review.

LESSONS (in this order — the launch prompt gives the list; if it is missing, STOP and ask): <LIST, e.g. 4.1.1-2 4.1.3 4.1.4>

FIRST LINE OF YOUR FIRST REPLY: your exact model ID. Then report whether `CLAUDE_CODE_REMOTE` is set, and echo the LESSONS list back.

## Who and what
Stem 4 Life teaches Cambridge International A Level Biology 9700 to students aged 17–19 in Zimbabwe and South Africa. These are PRODUCTION lessons. They will be published beside more than 40 finished lessons, so they must match those lessons. Every storyboard has been written, checked independently in three rounds and CLEARED FOR NARRATION. Other cloud sessions may be building other Topic 4 lessons at the same time as you.

## Hard rules
- Push ONLY your own branch **`cloud/008-<first code>-to-<last code>`** (one lesson: `cloud/008-<code>`), e.g. `cloud/008-4.1.1-2-to-4.1.4`. It may contain text, scripts, `src/`, JSON, per-beat MP3 audio and small PNG/JPG stills. NEVER push `dev`, `master`, `cloud/inputs-008` or any other branch. No tags, no PRs, no deploys. **NEVER put an MP4 or any other video in git.**
- Never print, log or write a secret. The ElevenLabs and Bunny keys are NOT in your environment. They are API credentials that the environment injects into requests to `api.elevenlabs.io` and `video.bunnycdn.com`, so call those APIs WITHOUT a key header. (The shipped scripts already do this.)
- In Bunny: upload ONLY each lesson's final branded video, with NO collection. Delete nothing and move nothing.
- **Never end your turn while work is pending.** A cloud session that ends its turn stops. Stay in the FOREGROUND until EVERY lesson in your list is at Bunny `status` 4 and its REPORT is pushed. A single tool call is capped at about 10 minutes. So run long jobs (renders, `bunny-poll.sh`) detached with `setsid nohup … &`, then wait for them in the foreground with repeated bounded loops, e.g. `timeout 540 bash -c 'until [ -f render-cache/beat-07/complete.json ]; do sleep 20; done'`. Check the logs between loops. Never answer with a summary while anything is still running.
- Only ONE Whisper process at a time. Render at most 4 beats at once (4 vCPU).

## Setup (once per session)
1. `git fetch origin dev cloud/inputs-008 && git checkout -B <your branch> origin/dev && git checkout origin/cloud/inputs-008 -- cloud-inputs/008`. Do NOT commit `cloud-inputs/008` to your branch (`git reset -q cloud-inputs` before each commit, or add only `work/`).
2. `apt-get update && apt-get install -y ffmpeg fonts-dejavu-core` (run `update` FIRST, because the image index is stale). `pip install faster-whisper fonttools pillow numpy`.
3. Node, pinned and with no lifecycle scripts, in `work/`: `mkdir -p work && cd work && npm init -y >/dev/null && npm install --ignore-scripts react@19.3.0 react-dom@19.3.0 sharp@0.33.5 esbuild@0.28.1 remotion@4.0.525 @remotion/bundler@4.0.525 @remotion/renderer@4.0.525`. Each lesson dir resolves modules from `work/node_modules`. Check with `node -e "require('sharp');require('esbuild')"`. Record the versions. Remotion fetches its own Chrome from remotion.media. Then `printf 'node_modules/\npackage.json\npackage-lock.json\n' > work/.gitignore` so they are never committed.

## Read fully, once, in this order
1. `cloud-inputs/008/tooling/TOOLING.md`: the pipeline, what was changed for the cloud, and the per-lesson edits the scripts need. It is not optional.
2. `cloud-inputs/008/standards/VIDEO-STRUCTURE.md` (ALL of it: WHAT a lesson must be), `PIPELINE-STANDARD.md` (HOW to build one) and `CONTENT-ARCHITECTURE.md`.
3. `cloud-inputs/008/topic-04/SHARED-SPECS.md` (§4 Shared models, practical rigs, shared numbers, colour roles; §2 rules), `cloud-inputs/008/topic-04/t4-palette.ts` (the colour roles as exact hex values), and `cloud-inputs/008/topic-04/TOPIC-PLAN-04-MEMBRANES.md` (its shared-model table and traps). The storyboards cite run-006 paths: `plan/topic-04/…` is this plan; `cloud-inputs/006/evidence/…` is not shipped. Every quotation you need is already verbatim in the storyboard. Copy it from there, character for character.
4. For EACH lesson in your list: `cloud-inputs/008/topic-04/<code>/STORYBOARD.md`. The storyboard is the contract.
5. The house style: `cloud-inputs/008/tooling/shared/src/`, `src-skeleton/` and the stills in `tooling/house-style/`. Match the frame, palette, typography, header strip and caption bar. Design the membrane visuals yourself inside that style.

## Shared Topic 4 models — built once per session, identical everywhere
- Before the FIRST lesson's beats, build the shared models that your lessons use (`PhospholipidToken`, `FluidMosaicMembrane`, `WaterField`/`DiffusionField`, `TransportProteinSet`, `ReceptorLigand`, `SignallingScene`, `VesicleTransport`, `WaterPotentialModel`, `UptakeGraph`, `CellOsmosisSet` and the practical rigs as needed). Put them in **`work/t4-shared/`** as top-level `.tsx` files plus a copy of `t4-palette.ts`. Build them exactly to SHARED-SPECS §4 and the "The models, specified once" section of the storyboard that publishes each one. Keep the fixed orientation (outside at the top, cytoplasm at the bottom). Keep the component ids, state ids, labels, motion contracts and timings. Use ONLY the `T4` colour roles. Tag every model's top `<g>` `data-role="drawing"`.
- Every lesson COPIES `work/t4-shared/*` byte for byte into its own `src/`. The copies are fingerprinted there, so they must sit at the top level of `src/`. Never edit a copy. To fix a model, change `work/t4-shared/`, re-copy it to every lesson of this session that uses it, re-approve and re-render the affected beats. Write `work/t4-shared/SHARED.md` with each model's states and the sha256 of each file. Each lesson's REPORT lists the sha256 values it used.
- If the launch prompt says `SHARED_FROM=<branch>`, copy `work/t4-shared/` from that branch (`git checkout origin/<branch> -- work/t4-shared`) instead of building it. Extend it only for states it lacks, and report every addition.

## Per lesson (in list order)
Work in `work/<code>/`, set up as TOOLING.md describes. Make the per-lesson script edits first.

### Non-negotiables
- **Narration is FROZEN**, word for word. If a line cannot be built as written, stop that beat and report.
- **Audio:** ElevenLabs voice `BcpjRWrYhDBHmOnetmBl` (Thandi), `eleven_multilingual_v2`, speed 1.0, one file per beat, as shipped in `generate_audio.py`. No time-stretching: the timeline comes from MEASURED audio. Before generating, `python3 el_usage.py before-<code>`. If `character_limit − character_count` is less than 1.2 × the lesson's characters (the `extract_script.py` total), STOP and report instead of generating. The counter is ACCOUNT-WIDE: parallel sessions move it too. Normalise pronunciation ONLY in the request text (`request_normalise.json`), never in the storyboard, and log every diff in `qa/audio-review.md`. Check the transcripts for mangled terms. Likely traps: phospholipid, hydrophilic/hydrophobic, glycoprotein, glycolipid, cholesterol, Visking, pinocytosis, phagocytosis, exocytosis, plasmolysed, crenated, haemolysis, kilopascals, "mol dm⁻³" (spoken form as written), and numbers such as "minus eight hundred and sixty".
- **VIDEO-STRUCTURE.md rules, all of them.** In particular:
  - Error beats use the five moves, with the badge EXACTLY as the storyboard assigns: E43 (4.1.3) **EXAM CONTRAST**; E44 (4.1.4), E45 (4.2.1a), E46 and E47 (4.2.1b), E48 (4.2.5) **COMMON MISTAKE**. Set them in `ERROR_BEATS`; the renderer audits every frame. The silent reads are digital silence, via `insert_holds.py`.
  - Timers start at first contact and never reset.
  - Physically possible handling.
  - Colour changes only through real colours (no RGB tween between hues).
  - Molecular movement as MOTION.
  - The ATP → ADP + Pi token switch happens in one frame, with its caption.
  - Measured, calculated, supplied and illustrative values are labelled.
  - "Say the typical thing as typical."
  - At most 15 s between visual changes.
  - No text-only frames (verify-text-only: no run over 2 s).
  - Everything drawn is labelled MODEL/schematic.
  - Exam wording is quoted exactly.
  - No logo, progress bar, timer or beat counter in the lesson body.
- **Render per beat**, 4 at a time. A failure must cost one beat, not the lesson.

### Checkpoint (the session can end before the build does)
After the audio, after the timeline, and after every 3 beats: commit `work/<code>/` and `work/t4-shared/` (source, scripts, JSON, `PROGRESS.md`, `audio/*.mp3`, approvals, sheets; NO MP4/WAV), then `git push origin <your branch>`. The repo's root `.gitignore` ignores `*.mp3` and `render-*.sh`, so add those with `git add -f` (for example `git add -f work/<code>/audio/*.mp3 work/<code>/render-*.sh`). `PROGRESS.md` is written for a successor with no memory: the lesson list and which lessons are done, the exact next step, and every decision. A relaunch resumes from your branch.

### Finish (per lesson)
1. `finish.py` → the master MP4. `verify.py`, in the standard's order: ffprobe · **video ≥ encoded audio** · full decode with 0 errors · cues matched = cue total = planned · audio packets unchanged · final word not clipped · silent reads measure silent · no one-frame holds at beat boundaries · every-frame marker audit on each error beat (presence AND badge text). Then `verify-text-only.cjs --controls` and `verify-text-only.cjs`.
2. `encoded-sheets.py`: contact sheets from the ENCODED master. LOOK at every sheet and fix what you find (a fix costs one beat), then finish again. Push the sheets (small JPGs).
3. **Bookends:** copy `cloud-inputs/008/branding/bookend-src` to `work/<code>/bookend-src` and copy `packages/backend/src/remotion/public/stem4life/fonts` into its `public/stem4life/`. Then run `node render-bookends.mjs "<code>=<title>"` (renders `Stem4LifeIntroB` `{title, subtitle:"Cambridge A Level · Biology", heroHeight:518}` and `Stem4LifeOutro` `{title, subtitle, aesthetic:"C"}`, 1920x1080 @ 30; see `branding/RENDER-BOOKENDS.md`). `<title>` is the storyboard H1 after "<code> — ", also listed in `branding/titles-topic-04.tsv`. LOOK at a SETTLED late frame of each (never frame 0). The title must read exactly `<title>`.
4. **Brand:** `BAR_PNG=cloud-inputs/008/branding/bar-<code>.png MUSIC_MP3=cloud-inputs/008/branding/tutorial.mp3 INTRO_MP4=<intro> OUTRO_MP4=<outro> cloud-inputs/008/branding/apply-branding-cloud.sh <master.mp4> <branded.mp4>`. The bars were pre-rendered on machine A, so do not redraw them. Verify: duration ≈ master + 11.03 s, full decode with 0 errors, and a mid-lesson frame showing the lesson inside the cream frame with this lesson's title bar (save it as a small JPG).
5. **Upload to Bunny for REVIEW:** `./bunny-upload.sh <branded.mp4> "REVIEW <code> <title>"`. It POSTs `https://video.bunnycdn.com/library/$BUNNY_BIO_LIBRARY_ID/videos` with only the title (NO collection), then PUTs the file with `curl -T`. Then start `setsid nohup ./bunny-poll.sh <guid> > logs/bunny-poll.out 2>&1 &`. It polls every 60 s until `status` is 4 (`availableResolutions: null` means NOT YET, not failed). **While Bunny encodes, start the next lesson** (audio first). Come back to check the poll between steps, and before the end of the session, in the foreground.
6. **Report** → `work/<code>/REPORT.md`, under 70 lines, written ONLY after status 4 is confirmed (no placeholders). Include:
   - model ID
   - every phase with its wall-clock time
   - ElevenLabs characters (before/after, and note that the counter is account-wide)
   - master and branded duration and sha256
   - every verification result
   - what you saw on the sheets and what you fixed
   - the Bunny guid, the upload time and the time to status 4
   - pronunciation fixes
   - the shared-model sha256 values used
   - design choices, in three lines
   - anything in the storyboard that needed interpretation

   Commit and push your branch.

## End of session
Stop only when every lesson in the list has a pushed REPORT with a confirmed status 4, or when a hard stop happened (the ElevenLabs budget ran out, or a frozen line could not be built). In the hard-stop case, push a `work/SESSION-<first code>.md` saying what stopped it and exactly where to resume. Your final message: the branch name, and one line per lesson: code, Bunny guid, status, branded duration.
