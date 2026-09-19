# Stem 4 Life — lesson branding sample

Open **[index.html](index.html)** for the persistent player frame, or watch
**[mechanics-si-units.mp4](mechanics-si-units.mp4)** directly. One complete lesson,
1920×1080, 30 fps, approximately 3:18. Chapter buttons jump to the intro, lesson
and end card. The MP4 has the new bookends; the persistent rail is part of the
HTML player and is not burned into the lesson.

## What exists today

The inspected original is
`/home/dachu/Documents/projects/content-engine/apps/student-learn/public/videos/mechanics-si-units.mp4`.
It contains the 186.9-second lesson body, without bookends. Its already-wrapped
counterpart is in that main tree's `output/stem4life-lessons/`, not the public
video directory. `output/stem4life-bookends/` contains the standalone brand variants.

The apply script selects **Intro B**, regardless of the composition README's
recommendation of C: five seconds of dark navy, a peach microscope drawing at
518px, then docking into the Stem 4 Life lockup. The lesson title appears late,
settling at frame 118 (3.93s), leaving approximately one second to read it.
The six-second **outro defaults to C**: cream graph paper, terracotta logo accent,
“Keep learning. Put it into practice.”, the URL and lesson title. Its final four
seconds hold still. See [the extracted current frames](stills/current-bookends.png).

The application script renders only the bookends, matches their H.264/AAC
configuration to the master and concatenates intro/body/outro with `-c copy`.
Its approved Blue Sea music is confined to the bookends, with fades and silence
before narration. It also accounts for masters with negative AAC priming packets.
The original bodies are not replaced by running that script: results go to
`output/stem4life-lessons/`.

The pre-existing, untracked `output/stem4life-inflight-branding/` experiments were
inspected and left untouched. They show a corner microscope, a cream framed
page, and a top brand strip. The latter overlaps the lesson's existing top labels;
the framed page gives content space at the cost of reducing its displayed size.

## Options and actual costs

| Treatment | Can the body stay bit-identical? | Cost / limitation |
| --- | --- | --- |
| Persistent corner mark burned into MP4 | No | Re-encode all affected video frames; another lossy generation at ordinary delivery settings, or much larger lossless files. Can obscure diagrams; no universally empty corner has been established. Audio could still be copied. |
| Persistent border / lower third burned into MP4 | No | Same full-duration video encode. An outside border requires scaling the body or changing output dimensions. Scaling also reduces text size. |
| Lower third on a **new** intro/title card | Yes | Render only that card, copy the body. Adding it to a title card already inside the body changes those frames and fails the guarantee. |
| Consistent end card and matching intro | Yes | Render 330 bookend frames, then remux. No persistent identity within a standalone body's picture. |
| Grade or crossfade into/out of body | No, if any body frames participate | Even a short seam edit alters pixels and may require encoding an adjoining GOP. A whole-body grade is a full encode. Either breaks the all-body hash guarantee. A fade confined to the bookend is safe but still meets the body at a hard cut. |
| Brand rail **outside the video element** | Yes | No media encode. Requires player integration. Uses some screen space, and is absent from downloads, picture-in-picture and native video-only fullscreen. The demo's separate fullscreen button requests fullscreen for the whole frame. |

For scale, this one lesson has **5,607 body frames** versus **330 bookend frames**:
burning a persistent mark would add about 17 times the bookend frame count to
the encoding work. Actual runtime depends on the encoder and machine; no batch
cost or runtime is claimed.

## Built option

**Matching paper-on-navy bookends, plus a separate player frame.** The design
borrows the navy / warm paper / peach hierarchy of the inspected
`output/stem4life-question/stem4life-question.mp4`
([reference frame](stills/question-reference.png)). The approved outlined logo
and local Manrope / Source Sans 3 fonts are retained. The lesson title settles
at 1.04s; all movement ends at 1.3s. The outro has the same structure, a practice
prompt and a stationary URL for its last 4.7 seconds. The approved music is
stream-copied from the prior bookend AAC assets.

The surrounding cream rail has a real boundary around the full 16:9 image.
It does not paint over a presumed lesson background, crop content or grade it.
Both the navy/cyan SI-units still (`#061522` in its source) and charcoal/green
direct-collisions still (`#171c20` / `#3f9e89` in `mechanics-m42/Presentation.tsx`)
were inspected; both are available in the demo's palette comparison. Browser
display scaling is separate from the guarantee about decoded media pixels.

The compositions have their own entry, `index-stem4life-branding.tsx`. Existing
bookend defaults and the 31-lesson batch selection are unchanged. The apply
script only gains importable existing helpers, a direct-execution guard and an
optional render-concurrency argument. This sample uses concurrency **1**.
No protected app/Convex files, registry, shared Remotion root, prior experiments
or main-tree media were edited. Nothing was deployed or pushed.

## Verification and reproduction

`verify-body.json` records SHA-256 checks for **all 5,607 decoded RGB24 body
frames**, the **complete decoded f32le / 48kHz stereo lesson audio**, input file
hashes before and after, codec compatibility, frame count, duration, full decode,
warning-free concat and music/seam checks. The report is written only after all
assertions pass. No music is added to the body. Only the bookends are encoded.

From `packages/backend`, with the repository's Remotion dependencies installed:

```sh
export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"
./node_modules/.bin/tsc -p src/remotion/compositions/stem4life/tsconfig.json
node src/scripts/verify-branding-sample.mjs \
  --source=/home/dachu/Documents/projects/content-engine/apps/student-learn/public/videos/mechanics-si-units.mp4 \
  --music-dir=/home/dachu/Documents/projects/content-engine/output/stem4life-lessons/.work/music \
  --verify-only
```

On a fresh sample workspace, omit `--verify-only` to render the two bookends
and one lesson sample. `--stills-only` checks design frames first. The script
refuses to overwrite an existing final MP4 and rejects a source whose hash is
not the approved SI-units master. The `.work/` render intermediates, local
dependency installation and seam WAVs are deliberately uncommitted; retain
them to rerun `--verify-only` locally. Reproduction used Remotion 4.0.525,
React 19.3.0, TypeScript 5.9.3, Sharp 0.33.5 and local Chrome.

The new stills were visually inspected before encoding. The final encoded
intro, body boundaries, middle and end-card frames were then extracted and
visually inspected at full size and in the [sample contact sheet](stills/sample-contact-sheet.png).
See [the visual check record](verify-visual.md).
The browser tool blocked the local-file URL, so **interactive HTML-player and
fullscreen behavior have not been browser-verified**. The MP4 verification does
not depend on the browser. The local HTML needs no server or external assets.

Follow-up: Durai can review this one sample; applying an accepted treatment to
other lessons and integrating the surrounding frame into the production player
are separate work. A persistent frame in a downloaded MP4 would require relaxing
the unchanged-body constraint.
