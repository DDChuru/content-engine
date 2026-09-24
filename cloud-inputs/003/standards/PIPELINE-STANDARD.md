# Pipeline standard — how a lesson gets built without losing work

VIDEO-STRUCTURE.md says what a lesson must BE. This says how to BUILD one so that a dead agent,
a full machine or a late correction costs minutes instead of the lesson. Every rule here was paid
for on 20–21 Sep 2026, building the five 1.1 lessons.

## 1. The renderer is beat-chunked. No exceptions.

Reference implementation: **`topic-01/1.2.1/`** (it supersedes `1.1.1/`, which it grew from) —
`render-beat.cjs`, `finish.py`, `verify.py`, `generate_audio.py`, `transcribe_audio.py`,
`cue_plan.py`, `assemble_timeline.py`, plus a `PROGRESS.md` handover and shared components (model
cells with addressable structure ids, the COMMON MISTAKE wrapper, the exam card). Copy and adapt
it; do not invent a new pipeline.

**Scene lookup uses INTEGER FRAMES, never floating-point seconds.** The 1.1.1 template selected the
scene with `t>=s.start && t<s.start+s.duration` where `t = frame/30`; rounding puts the first frame
of some beats in the PREVIOUS scene, so the old scene is held one frame (33 ms) into the new beat.
1.2.1 fixed it (`frame>=s.startFrame && frame<s.startFrame+s.frames`). Six sibling lessons built
from the old template were tested afterwards: 1.2.2 (beats 3, 12), 1.2.3 (5, 7), 1.2.5 (8) and
1.2.6 (4) carry it; 1.2.4 and 1.2.7 do not. It is a one-frame-late cut, not a flash, and no
error-beat marker is affected, so they were not re-rendered — but fix it whenever one of those
beats is re-rendered for any other reason. `tools/detect_boundary_flash.py` tests a finished master
against its `timeline.json`; run it as part of verification.

- Each beat renders to its own `render-cache/beat-NN/video.mp4` and writes `complete.json` LAST.
- `finish.py` asserts every beat's frame count against `timeline.json`, then joins with `-c copy`.
- Renderer is React → `react-dom/server` → Sharp/librsvg → ffmpeg. **No browser.** It is CPU-bound
  and light on memory, and identical frames are content-hashed and reused.

Why: Durai caught a pipette drawn upside down in a 20-minute lesson. The fix re-rendered six beats
in under two minutes. The streaming renderer used on 1.1.4/1.1.5 (frames piped straight into
ffmpeg, nothing persisted) would have re-rendered all 23,309 frames, and when its agent died at
frame 6,300 of 12,450 it lost all 6,300.

**Never copy `render.lock` or `progress.json` between machines** — a lock holding another
machine's PID makes the renderer wait forever for a `complete.json` that will never arrive.

## 2. Anything longer than a few minutes is DETACHED

Agent turns die at 60 minutes. Every one of them did. A render started with
`setsid nohup … > log 2>&1 < /dev/null &` outlives its agent and finishes unattended; one started
in the foreground dies with the turn and leaves a truncated file.

- Write to disk continuously: storyboard, per-beat audio, cues, timeline, then frames.
- If your turn is ending, report where the render is and confirm it is detached. Never kill it.

## 3. Truncated files look healthy

An MP4 writes its `moov` atom last. A killed encode leaves a file that exists, has bytes and was
growing — and cannot be opened. `ls` cannot tell. **`ffprobe` returning no duration is the test.**
Log timestamps ending in `Z` are UTC; machine B is UTC+2.

## 4. Verification, in this order

1. `ffprobe` returns a duration.
2. **video duration ≥ encoded audio duration.** AAC pads its tail; if video is a few ms short,
   measure the tail (`volumedetect` on the last 1.5 s). −91 dB in source and output means only
   silence was lost — say so explicitly rather than reporting a bare pass.
3. Full decode, zero errors.
4. Cue matches = cue total. **Cues are unique within their beat and in narration order**, not merely present.
5. `audioPacketsUnchanged` — narration was never re-encoded or shifted.
6. The last spoken word ends before the audio does.
7. Wrong numbers and wrong statements are written, never spoken: their intervals measure silent.

## 5. Machines

| | A (local) | B |
|---|---|---|
| Cores / RAM | 12 / 15 GB | 4 / 39 GB |
| Good at | beat-chunked renders, encodes, branding | storyboarding, exam PDFs, Remotion bookends |

- **One build lane per machine.** Five lanes on B reached load 27 on 4 cores and the kernel killed
  a render. A measured 2,447 frames in 158 s on the beat-chunked renderer.
- Read `available`, not `free`, and not while your own render is running — A showed 1 GB
  available mid-render and 10 GB at rest.
- Bookends need Remotion, which is only on B (`~/outro-render/`, node v22).
- Dependencies resolve from the content-engine backend `node_modules`; the path differs per
  machine (`/home/durai/…` on B, `/home/dachu/…` on A).

## 6. Narration

ElevenLabs **Thandi** `BcpjRWrYhDBHmOnetmBl`, `eleven_multilingual_v2`, `speed 1.0`. Key via
`source ~/.secrets/elevenlabs.env` — never print it. One file per beat, so one beat can be redone
alone. **Reuse existing audio**: regenerating costs money and moves every downstream cue. No
time-stretching; recompute the timeline from measured audio. Local faster-whisper for word cues.

## 7. Branding and publishing

1. Render BOTH bookends for THIS lesson on B (`~/outro-render/render-111.mjs` is the pattern) —
   both carry the lesson title, and a Mechanics title shipped on a Biology lesson twice.
   **Look at both title frames before compositing.**
2. `branding/apply-branding.sh` on A — refuses to run without `INTRO_MP4` and `OUTRO_MP4`.
3. Upload with `curl -T` (streaming). `--data-binary` sends a form body and Bunny answers 400.
4. One Bunny LIBRARY per syllabus, one COLLECTION per topic, outcome code leads the title.
   Record the GUID in `VIDEO-REGISTRY.json` — that file, not the dashboard, is the truth.
5. After upload, `availableResolutions: null` means NOT YET. Wait for status 4, then fetch
   `playlist.m3u8` before calling it live.

## 8. Masters live in the archive, never in a scratchpad

Session scratch space is cleaned without warning — a delivered lesson vanished from it overnight.
Masters go to `~/sme-9700-archive/topic-NN/<code>/` on B the moment they verify. A superseded
master is RENAMED (`…-SUPERSEDED-<reason>.mp4`), so the canonical filename is always the good one,
and a source fix is synced to BOTH machines or the next render reintroduces the bug.

## 9. Long lessons are built to be handed over

A builder that has already built one lesson and then 23 beats of the next WILL die of context
exhaustion, and model-server connections drop. Neither may cost work. For anything over ~10 beats:
audio first and detached; shared components once; beats IN ORDER, each rendered as it is finished;
and a `PROGRESS.md` kept true after every beat, written for a successor with no memory — phase,
beats complete, component names and id scheme, decisions, resume procedure. 1.2.1 (31 beats) was
finished by a second agent from exactly that file, with no audio regenerated. Give a fresh builder
per long lesson rather than reusing a tired one.

Storyboard time windows are ESTIMATES. Measured audio always wins (§6); a brief that says
"honour the windows exactly" is wrong, and a builder who meets one should stop and say so — one did.
