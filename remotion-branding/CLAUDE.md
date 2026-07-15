# Content Studio — video editing context

You are running inside **e-wizer Content Studio**, launched from the Studio's
terminal pane (ttyd + tmux) in this directory (`remotion-branding`). Your job
here is **editing Remotion tutorial videos** — not the broader monorepo work.
Ignore the parent `content-engine/CLAUDE.md` mission/document-control framing
unless the user explicitly brings it up; in this pane, you edit video comps.

## What you're editing

The active tutorial is the **Daily Hygiene walkthrough**:
- **Comp**: `src/tapdemo/AnnotatedWalkthrough.tsx` (composition id `DailyHygieneWalkthrough`, registered in `src/Root.tsx`). It plays a screen recording in a phone bezel and draws annotation marks over it, with a side notes panel and Ecowize bookends.
- **Marks data**: `src/tapdemo/hygiene-walkthrough.json` — this is what you'll most often edit. Each mark:
  - `type`: `rect` | `tap` | `circle` | `arrow` | `label`
  - `color`: palette key (`sky`, `coral`, `emerald`, `amber`, …) — see `PALETTE` in the comp
  - `label` (short chip) + `note` (side-panel sentence)
  - `atSec`: when it appears · `durSec`: how long it holds
  - position is **normalized 0..1**: `nx,ny,nw,nh` (rect) so it scales to any render size — never hardcode pixels
- **Source assets** (in `public/tapdemo/`): `hygiene-full.mp4` (the recording, 240.47s @ 30fps), `hygiene-audio.m4a` (the operator's live voice). Referenced via `staticFile()`.
- **Timing knob**: `HOLD_MODE` in the comp — `'asDrawn'` (default; respect each mark's `durSec`) vs `'holdToNext'`.
- Shared building blocks: `src/kit/` (CaptionPanel etc.), brand bookends `src/brand/EcowizeBookends.tsx`.

`TapDemo` (id `TapDemo`) is a single-tap proof comp in the same folder.

## How to work here

- **You edit code/JSON — you don't watch pixels.** Retiming, restyling, repositioning, rewording marks is all done by editing the JSON or comp. If you genuinely need to *see* a frame, extract one: `ffmpeg -ss <sec> -i public/tapdemo/hygiene-full.mp4 -frames:v 1 /tmp/frame.png`.
- **The preview hot-reloads.** Remotion Studio runs at `localhost:3000/DailyHygieneWalkthrough` (the Studio's Live Preview pane). Save a file → it reloads. **Don't start renders** — the Studio's **Render** button handles that.
- **Keep edits surgical** (per the global working discipline): change only what's asked, no refactors of adjacent code.
- The Ecowize palette is law here: sky `#3CB6E0`, emerald `#1F9C5A`, amber `#E89A30`, coral `#D6432F`. Don't swap brand colors unless asked.

## Typical requests

"shorten step 3 to 1 second" → edit that mark's `durSec`. "move the ring lower" → nudge `ny`. "make the sky boxes a thicker stroke" → the stroke width in the comp's draw code. "reword the step-7 note" → the `note` field. Make the change, let the preview reload, report what you touched.
