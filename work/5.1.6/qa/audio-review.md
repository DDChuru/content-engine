# 5.1.6 audio review

Voice Thandi `BcpjRWrYhDBHmOnetmBl`, `eleven_multilingual_v2`, speed 1.0, one file per beat. Primary: faster-whisper with the lesson prompt; second opinion: faster-whisper medium, no prompt (`qa/second-opinion-medium-*.json`).

| Beat | Flag | Ruling |
|---|---|---|
| 3 | takes 1–2: "goes round the cell cycle" heard "goes around" by BOTH models | rejected. Take 3 with a request-only 0.1 s break before "round" (below): heard "round": kept |
| 3 | "child's" heard "childs"/"child" | apostrophe normalisation only: kept |
| 6 | "its" heard "it" (prompted model) | second opinion hears "its cells": kept |
| 8 | "building a mass" heard "building a mess" (p 0.34) and "inherit it" heard "inherited", in ALL FOUR takes (plain; break before "mass"; comma after "inherit it"; capitalised "MASS") | kept take 1 (the plain request). The same voice's "mass" in Beats 5 and 7 is recognised at p 0.98–1.00; in Beat 8 the phrase-final /æ/ before the colon is the South African raised vowel, and "inherit it" is ordinary linking. **Flag for the conductor: listen to Beat 8 at 0:20 ("building a mass").** |

## Request-only normalisation (`request_normalise.json`; the storyboard is unchanged)

| Beat | Storyboard text | Request text | Why |
|---|---|---|---|
| 3 | goes round the cell cycle | goes `<break time="0.1s" />` round the cell cycle | two takes were heard as "goes around"; a 0.1 s break separates the words (no word change) |

Rejected takes (Beat 3 takes 1–2; Beat 8 takes 2–4) are in `audio/rejected/` (not used).
