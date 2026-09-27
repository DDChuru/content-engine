# 5.1.2 audio review

Voice Thandi `BcpjRWrYhDBHmOnetmBl`, `eleven_multilingual_v2`, speed 1.0, one file per beat. Primary transcription: faster-whisper with the lesson prompt; second opinion: faster-whisper medium, no prompt (`qa/second-opinion-medium-*.json`).

| Beat | Flag | Ruling |
|---|---|---|
| 1 | "grazed" heard "graced" (prompted model) | second opinion hears "grazed": kept |
| 4 | "diploid" heard "deployed"; "four" heard "for" | second opinion hears "four chromosomes … diploid": kept |
| 5 | "interphase" heard "interface" by both models | z/s voicing only (the same ruling as 5.1.3 in run 009a); kept. The medium model's extra "points" (p = 0.02, 0.1 s) is a hallucination in a comma pause; the prompted model hears none |
| 7 | take 1 and take 2: "where needed" heard "When needed" by BOTH models | rejected (frozen line not built as written). Take 3 with a request-only comma (below): heard "Where needed"; kept. Trailing "next." (p = 0.07) after "Next." is a recogniser echo |
| 10 | "23" heard "twenty three" | spoken number, as written; kept |

## Request-only normalisation (`request_normalise.json`; the storyboard is unchanged)

| Beat | Storyboard text | Request text | Why |
|---|---|---|---|
| 7 | where needed | where, needed | two takes ran "where" into "needed" and were heard as "when needed"; the comma separates the words (no word change) |

Rejected takes are in `audio/rejected/` (not used).
