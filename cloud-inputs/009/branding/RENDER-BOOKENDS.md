# Re-rendering BOTH bookends per lesson

**BOTH the intro and the outro carry the lesson title**, so every lesson needs its own render of
each. The checked-in defaults in `output/stem4life-bookends/` all say "Force, mass & acceleration ·
Mechanics" — they are Mechanics artefacts, not neutral templates.

This was shipped wrong twice: the outro first, then the intro after the outro was fixed.
`apply-branding.sh` now REFUSES to run unless both `INTRO_MP4` and `OUTRO_MP4` are supplied.

## Where it can run

**NOT on machine A** — Remotion is not installed there.
**On B**, with these two traps:

1. B's default `node` is **v10.24.1** (too old). Use `~/.nvm/versions/node/v22.22.0/bin/node`.
2. The bundler entry must be a **`.tsx`** file. An `.mjs` entry fails to resolve extensionless
   imports: *"failed to resolve only because it was resolved as fully specified"*.

## Recipe

Copy to B: `packages/backend/src/remotion/compositions/stem4life/*.{tsx,ts}` into
`~/outro-render/compositions/stem4life/`, and `src/remotion/public/stem4life` into
`~/outro-render/public/`. Symlink node_modules from a checkout that has @remotion/bundler+renderer.

`~/outro-render/index.tsx`:
```tsx
import React from 'react';
import {registerRoot} from 'remotion';
import {Stem4LifeCompositions} from './compositions/stem4life/Stem4LifeCompositions';
registerRoot(Stem4LifeCompositions);
```

Then bundle + `renderMedia` once per bookend:

| Composition id | inputProps | Frames |
|---|---|---|
| `Stem4LifeIntroB` | `{title, subtitle, heroHeight: 518}` | 150 (5s) |
| `Stem4LifeOutro` | `{title, subtitle, aesthetic: 'C'}` | 180 (6s) |

Pass both results to `apply-branding.sh` via `INTRO_MP4=... OUTRO_MP4=...`.

## Machine A can render bookends too (22 Sep 2026)

B was switched off for three days and it was the only machine that had ever rendered these. A now
can: `/home/dachu/outro-render/render-bookends.mjs` on A takes the same arguments and writes to the
same paths as B's copy, so the publish chain is unchanged. A copy of the script is committed here as
`render-bookends-A.mjs`.

- A's system node is 18, which is too old; the script runs under `~/.nvm/versions/node/v22.22.0`.
- It renders the canonical `Stem4LifeIntroB` / `Stem4LifeOutro` compositions from the main checkout,
  with the same props (`heroHeight: 518`, `aesthetic: "C"`, subtitle `Cambridge A Level · Biology`)
  and the four local WOFF2 fonts — no substitute design.
- Verified against a pair rendered on B (`intro-2.2.8` / `outro-2.2.8`, "Cellulose"): identical
  1920x1080 @ 30 fps, 150 frames intro / 180 outro, same layout and typography. Binary parity was
  not testable while B was off.
- Renders serialised at concurrency 1 under `nice`, because A also serves the interactive session.

The title check still applies whatever machine renders them: pull a frame from late in EVERY intro
and outro and LOOK at it before branding.
