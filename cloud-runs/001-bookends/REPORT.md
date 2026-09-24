# Cloud Run 001 — Stem 4 Life bookends feasibility

**Result: all four bookends rendered, pass the script's own ffprobe gates, and decode with 0 errors. Total ≈ 3 min of work.**
Base: `origin/dev` @ `5784299b7d8965c9abd82ae78e5272a43d8f46a5` ("docs(jev): correct three errors the education research caught", 2026-09-20).

## Machine
4 vCPU · 15 GiB RAM, no swap · 27 GB free disk · Ubuntu 24.04.4 LTS (kernel 6.18.44) · running as root, `sudo -n` and apt work ·
Node v22.22.2 / npm 10.9.7 · `CLAUDE_CODE_REMOTE=true`. Pre-installed Playwright Chromium 141.0.7390.37 (full + headless_shell) in `/opt/pw-browsers`; no `/usr/bin/google-chrome`.

## Phase durations
| Phase | Time | Notes |
|---|---|---|
| apt ffmpeg (update + install) | 43 s | ffmpeg 6.1.1-3ubuntu5 |
| `npm ci` | fail, 1 s | no `package-lock.json` in repo → `EUSAGE`. No `.npmrc` at root or in `packages/backend` (only `apps/student-learn/.npmrc`); used `--ignore-scripts` anyway |
| Minimal install | 16 s | 179 pkgs, 226 MB: `remotion`, `@remotion/bundler`, `@remotion/renderer` all pinned **4.0.527** (latest within `^4.0.365`), `react`/`react-dom@^19.2.0` (→19.3.0), `zod@^3.22.4` (the compositions import it). Installed in a scratch dir, symlinked as `packages/backend/node_modules` |
| Remotion browser download | fail, 1 s | blocked by network policy (below) → used `CHROME_BIN=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell` |
| `render.mjs --stills-only` | 31 s | 22 preview PNGs, font-load evidence captured |
| `render.mjs` (full) | 73 s | 4 MP4s + stills + `verification.json`, bundle included |

## MP4s (all: H.264 High, yuv420p, bt709, 1920×1080, 30/1 fps; AAC-LC 48 kHz stereo silent; decode errors = 0)
| File | Frames | Duration | Bytes | sha256 |
|---|---|---|---|---|
| intro-a.mp4 | 150 | 5.000 s | 157091 | a303441e4b79ad4301ebac539db995ed1c40ccfe90ce298db0d04c0a6706172c |
| intro-b.mp4 | 150 | 5.000 s | 160187 | f9629ad78978818c8a638c2fd4d2051fd0dee096bc95b7f7f0dacc3a0213df89 |
| intro-c.mp4 | 150 | 5.000 s | 208226 | 1ba093d07830cece4060fc4852ac3588ea00435f15b5f96a85f4385a543cb9b1 |
| outro.mp4 | 180 | 6.000 s | 224261 | 7685a1264c9a786ba967cab50a5386ff90fa1ff6efbd05b8e68584e60f1f8b4d |

Not byte-identical to the MP4s committed on dev (different Chromium/ffmpeg builds); `intro-b.mp4` is not committed on dev at all.

## What the frames show (`intro-b-frame145.png`, `outro-frame175.png`, 960×540)
- **intro-b, frame 145:** dark navy background. Top-left small caps "LOOK CLOSELY. UNDERSTAND MORE." Centre: salmon/coral microscope icon + wordmark "Stem 4 Life" (cream "Stem"/"Life", coral "4"), a short coral rule, title "Force, mass & acceleration", subtitle "Cambridge A Level · Mechanics", and "stem4life.com" near the bottom. Clean, fully settled, no glyph fallback.
- **outro, frame 175:** cream background with faint graph-paper grid and a thin red margin line at left. Rust microscope icon + navy "Stem 4 Life" wordmark (rust "4"), "Keep learning. Put it into practice.", large "stem4life.com" with rust underline, then "YOU JUST STUDIED" / "Force, mass & acceleration" / "Cambridge A Level · Mechanics".
- Fonts: every tab logged `[Stem4Life fonts] Loaded Manrope 500–700 and Source Sans 3 400–700; all four local WOFF2 subsets ready.`

## Egress probe (unauthenticated GET, 20 s timeout)
| URL | Result |
|---|---|
| https://video.bunnycdn.com | **blocked** — `curl: (56) CONNECT tunnel failed, response 403` (0.26 s) |
| https://storage.bunnycdn.com | **blocked** — same (0.24 s) |
| https://storage.googleapis.com | reachable — HTTP 400 `MissingSecurityHeader` (0.37 s) |
| https://api.github.com | HTTP 200 body `{}` (0.32 s) — answered by the session's GitHub proxy, not GitHub |
| https://uploads.github.com | HTTP 400, body links docs.anthropic.com (0.19 s) — proxy, not GitHub |
| https://www.googleapis.com/upload/drive/v3/files | reachable — HTTP 405 (0.12 s) |
| https://api.elevenlabs.io | **blocked** — CONNECT 403 (0.26 s) |
| https://huggingface.co | **blocked** — CONNECT 403 (0.03 s) |
| https://remotion.media (extra) | **blocked** — CONNECT 403 |
npm registry and Ubuntu archive worked; `ppa.launchpadcontent.net` was also denied (seen in proxy log).

## Errors verbatim
- `npm error The \`npm ci\` command can only install with an existing package-lock.json or npm-shrinkwrap.json with lockfileVersion >= 1.`
- `Error: Received a status code of 403 while downloading file https://remotion.media/chromium-headless-shell-linux-x64-149.0.7790.0.zip?clear. … Host not in allowlist: remotion.media.`
- Render: no font, browser or ffmpeg errors. Only noise: Remotion printed "Detected differing memory amounts … CGroup: 8796093015308.86 MB" 102 times (cgroup unlimited); stripped from the logs.

## Judgement on full lesson builds
- **Rendering: feasible.** 20 s of 1080p30 took ~60 s of wall-clock with concurrency 2 on 4 vCPU → roughly 3 s per rendered second for these simple scenes. A 10–18 min lesson ≈ 30–55+ min per render (heavier scenes will be slower); fits in a session but is slow. Disk and RAM are ample.
- **Blockers, all network policy:** `api.elevenlabs.io` (TTS) and `huggingface.co` (faster-whisper model download) are denied, as is `remotion.media` (worked around with the pre-installed Chromium 141; Remotion 4.0.527 expects 149 — worked here, untested on heavier scenes). Bunny upload endpoints are denied, so delivery would need GCS/Drive (reachable, needs credentials) or the host allowlist.
- **To make it work:** add `api.elevenlabs.io`, `huggingface.co` (+ its CDN hosts), `remotion.media`, and Bunny hosts to the environment's allowed domains, provide the ElevenLabs key as an environment secret, and commit a lockfile so `npm ci` is reproducible. Alternatively pre-generate TTS audio + Whisper JSON elsewhere and use the cloud only for rendering.
