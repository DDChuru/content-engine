# VidStud — video annotation studio context (Codex)

You're in **VidStud**, launched from its terminal pane in `remotion-branding`.
Your job here is **editing annotated tutorial videos** — helping with whatever
video project is currently loaded, not the broader monorepo work. See `CLAUDE.md`
in this directory for the full brief; the essentials:

- VidStud annotates **any** screen recording. Drop a recording in `tools/annotate.html`, mark it, export a marks JSON; the generic Remotion comp burns the marks on. e-wizer's Daily Hygiene is just one project built with it — nothing here is e-wizer-specific.
- **Generic stitcher**: `src/tapdemo/AnnotatedVideo.tsx` (comp id `AnnotatedVideo`), takes a `VideoProject` prop: `{ video, audio?, fps, clipSeconds, srcW, srcH, marks, layout:'phone'|'wide', holdMode, bookend }`.
- **Mark schema**: `type` (tap|rect|circle|arrow|label), `color` (palette key), `label`, `note`, `atSec`, `durSec`, normalized position `nx,ny,nw,nh` (or `nx2,ny2` for arrows). 0..1 coords — never hardcode pixels.
- A **project** is a wrapper like `src/tapdemo/AnnotatedWalkthrough.tsx` that defines a `VideoProject` and renders `<AnnotatedVideo {...project}/>`.
- **You edit code/JSON, not pixels.** To see a frame: `ffmpeg -ss <sec> -i public/<video> -frames:v 1 /tmp/frame.png`.
- Preview hot-reloads at `localhost:3000/<CompositionId>`. **Don't render** — VidStud's Render button does that.
- Keep edits **surgical**. Accent palette: sky `#3CB6E0`, emerald `#1F9C5A`, amber `#E89A30`, coral `#D6432F`.
