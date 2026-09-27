# cloud-inputs/008 — Topic 4 lesson builds (Biology 9700)

Inputs for cloud sessions that build Topic 4 lessons end to end. Pushed by the conductor from machine A on 27 Sep 2026
(off origin/dev; text and small binaries only, no video). Brief: `BRIEF.md` (the same text as `~/cloud-briefs/008-build-topic4.md`).

| Path | What |
|---|---|
| `tooling/` | The hardened pipeline from 3.2.1, plus the role-based raster/text-only/fingerprint helpers from 13.4.2-3, already adapted for the cloud (injected credentials, no whisper_slot, no machine-A lock). Also the house-style `shared/src`, `src-skeleton/` and `house-style/` stills. **Start with `tooling/TOOLING.md`.** |
| `standards/` | The current VIDEO-STRUCTURE.md, PIPELINE-STANDARD.md and CONTENT-ARCHITECTURE.md (biology-syllabus-map). |
| `branding/` | `apply-branding-cloud.sh`, `slot-mask.png`, `tutorial.mp3` (sha256 f1928a7b…), bookend renderer (`bookend-src/`, `RENDER-BOOKENDS.md`), and a pre-rendered title bar `bar-<code>.png` for each Topic 4 lesson (and its `frame-bar-<code>.html` source). The bars were rendered on A with the Biology recipe; the same recipe reproduces `cloud-inputs/003/branding/bar-3.2.2-3.png` with 0 differing pixels. `titles-topic-04.tsv` lists code → title. |
| `topic-04/` | The ten cleared storyboards (`<code>/STORYBOARD.md`, from origin/cloud/006-topic4 after check rounds 1–3), `SHARED-SPECS.md` (run 006, §4 shared models), `TOPIC-PLAN-04-MEMBRANES.md` and `t4-palette.ts` (fixed colour roles, so parallel sessions draw the shared models identically). |

Build order in the plan: 4.1.1-2 → 4.1.3 → 4.1.4 → 4.2.1a → 4.2.1b → 4.2.6 → 4.2.2a → 4.2.2b → 4.2.3-4 → 4.2.5.
