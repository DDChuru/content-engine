# cloud-inputs/009 — Topic 5 lesson builds (Biology 9700, the mitotic cell cycle)

Inputs for cloud sessions that build the eight Topic 5 lessons end to end. Pushed by the conductor from machine A on
27 Sep 2026 (off origin/dev; text and small binaries only, no video). Brief: `BRIEF.md` (the same text as `~/cloud-briefs/009-build-topic5.md`).

| Path | What |
|---|---|
| `tooling/` | A copy of `cloud-inputs/008/tooling`. The one change is in `extract_script.py`: `*(correction)*` marker lines are skipped (never spoken), and any other directive line stops the script. **Start with `tooling/TOOLING.md`.** |
| `standards/` | VIDEO-STRUCTURE.md, PIPELINE-STANDARD.md, CONTENT-ARCHITECTURE.md (current; unchanged since 008). |
| `branding/` | The kit from 008 (`apply-branding-cloud.sh`, `slot-mask.png`, `tutorial.mp3`, `bookend-src/`, `RENDER-BOOKENDS.md`), plus a pre-rendered `bar-<code>.png` (with its `frame-bar-<code>.html` source) for all eight Topic 5 lessons. They use the machine-A Biology recipe, which reproduces 3.2.2-3's bar with 0 differing pixels. `titles-topic-05.tsv` lists code → title. |
| `topic-05/` | The eight cleared storyboards: the project copies, including the 27 Sep image edits in 5.2.1/5.2.2. Also `SHARED-SPECS.md` (from origin/cloud/007-topic5 `work/007/`, since the project folder has none), `ASSETS-NEEDED.md` (with the RESOLUTION section), `TOPIC-PLAN-05-CELL-CYCLE.md`, and `t5-palette.ts` (the §5 colour tokens as exact hex, so parallel sessions match). |
| `images/` | The final Topic 5 image set (7 CC0 Berkshire root-tip photomicrographs and crops, 3 own drawings), with `CREDITS.md` and `COORDS.json`. Every file is ≤ 1.03 MB, so none was resized; COORDS stay in final-file pixels. |

Build order in the plan: 5.1.1 → 5.1.3 → 5.1.4 → 5.2.1 → 5.2.2 → 5.1.2 → 5.1.5 → 5.1.6.
