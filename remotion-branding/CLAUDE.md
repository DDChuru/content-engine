# VidStud — video annotation studio context

You are running inside **VidStud**, launched from its terminal pane (ttyd + tmux)
in this directory (`remotion-branding`). Your job here is **editing annotated
tutorial videos** — helping with whatever video project is currently loaded, not
the broader monorepo work. Ignore the parent `content-engine/CLAUDE.md`
mission/document-control framing unless the user explicitly brings it up.

VidStud is **video-agnostic**: it annotates *any* screen recording. The user
drops a recording into `tools/annotate.html`, marks it (tap / rect / circle /
arrow / label), exports a marks JSON, and the generic Remotion comp burns those
marks onto the recording. e-wizer's Daily Hygiene tutorial is just one project
built with it — nothing here is e-wizer-specific.

## The engine

- **Generic stitcher**: `src/tapdemo/AnnotatedVideo.tsx` — composition id `AnnotatedVideo`. It takes a `VideoProject` as props and renders any recording:
  ```ts
  type VideoProject = {
    video: string;        // staticFile path under public/, e.g. 'projects/x/clip.mp4'
    audio?: string;       // optional voiceover
    fps: number; clipSeconds: number; srcW: number; srcH: number;
    marks: Mark[];        // the annotate.html export
    layout?: 'phone' | 'wide';        // portrait bezel  vs  landscape + lower-third
    holdMode?: 'asDrawn' | 'holdToNext';
    bookend?: { intro?, outro?, accentA?, accentB? } | null;  // null → no bookends
  }
  ```
- **Mark schema** (each entry in the JSON): `type` (tap|rect|circle|arrow|label), `color` (palette key: sky, emerald, amber, coral…), `label` (short chip), `note` (caption sentence), `atSec`, `durSec`, and **normalized 0..1** position `nx,ny,nw,nh` (or `nx2,ny2` for arrows). Never hardcode pixels — coords are normalized so they scale to any render size.
- **A project = a wrapper** like `src/tapdemo/AnnotatedWalkthrough.tsx` (the hygiene one): it defines a `VideoProject` and renders `<AnnotatedVideo {...project}/>`. New videos follow the same pattern, or pass props to the `AnnotatedVideo` composition directly.
- Shared building blocks: `src/kit/` (CaptionPanel, palette), brand bookends `src/brand/EcowizeBookends.tsx`.

## How to work here

- **You edit code/JSON — you don't watch pixels.** Retiming, restyling, repositioning, rewording marks is done by editing the marks JSON or the project. To *see* a frame: `ffmpeg -ss <sec> -i public/<video> -frames:v 1 /tmp/frame.png`.
- **The preview hot-reloads.** Remotion Studio runs at `localhost:3000/<CompositionId>` (VidStud's Live Preview pane). Save a file → it reloads. **Don't start renders** — VidStud's **Render** button handles that.
- **Keep edits surgical**: change only what's asked, no refactors of adjacent code.
- Default accent palette: sky `#3CB6E0`, emerald `#1F9C5A`, amber `#E89A30`, coral `#D6432F`. A project can override its own bookend accents.

## Typical requests

"shorten step 3 to 1 second" → edit that mark's `durSec`. "move the ring lower" → nudge `ny`. "thicker box strokes" → the stroke width in AnnotatedVideo's draw code. "reword the step-7 note" → the `note` field. "make this a landscape video" → set the project's `layout: 'wide'`. Make the change, let the preview reload, report what you touched.
