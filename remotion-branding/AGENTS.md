# Content Studio — video editing context (Codex)

You're in **e-wizer Content Studio**, launched from the Studio terminal pane in
`remotion-branding`. Your job here is **editing Remotion tutorial videos**, not
the broader monorepo work. See `CLAUDE.md` in this directory for the full brief;
the essentials:

- **Active tutorial**: `src/tapdemo/AnnotatedWalkthrough.tsx` (comp id `DailyHygieneWalkthrough`). Marks live in `src/tapdemo/hygiene-walkthrough.json` — this is what you'll usually edit.
- **Mark schema**: `type` (rect|tap|circle|arrow|label), `color` (palette key), `label`, `note`, `atSec`, `durSec`, normalized position `nx,ny,nw,nh` (0..1 — never hardcode pixels).
- **Assets** in `public/tapdemo/`: `hygiene-full.mp4` (240.47s @ 30fps), `hygiene-audio.m4a` (live voice), via `staticFile()`.
- **You edit code/JSON, you don't watch pixels.** To see a frame: `ffmpeg -ss <sec> -i public/tapdemo/hygiene-full.mp4 -frames:v 1 /tmp/frame.png`.
- Preview hot-reloads at `localhost:3000/DailyHygieneWalkthrough`. **Don't render** — the Studio's Render button does that.
- Keep edits **surgical**. Ecowize palette is law: sky `#3CB6E0`, emerald `#1F9C5A`, amber `#E89A30`, coral `#D6432F`.
