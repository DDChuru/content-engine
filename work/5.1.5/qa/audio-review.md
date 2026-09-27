# 5.1.5 audio review

Voice Thandi `BcpjRWrYhDBHmOnetmBl`, `eleven_multilingual_v2`, speed 1.0, one file per beat. Primary: faster-whisper with the lesson prompt; second opinion: faster-whisper medium, no prompt (`qa/second-opinion-medium-*.json`).

| Beat | Flag | Ruling |
|---|---|---|
| 1 | low-confidence "something" (p 0.45) | second opinion hears the line exactly: kept |
| 3 | "thank you for watching" ×2 appended by the prompted model | hallucination in the trailing silence (second opinion: clean line): kept |
| 6 | take 1: "extra divisions there help" heard "extra divisions, they help" by BOTH models | rejected (frozen line not built as written). Take 2 with a request-only comma (below): heard "extra divisions there help": kept |
| 8 | low-confidence "outline." (p 0.41), "daughters" (p 0.13) | second opinion hears the line exactly: kept |

## Request-only normalisation (`request_normalise.json`; the storyboard is unchanged)

| Beat | Storyboard text | Request text | Why |
|---|---|---|---|
| 6 | extra divisions there help | extra divisions there, help | the non-rhotic "there" ran into "help" and was heard as "they"; the comma separates the words (no word change) |

Rejected take in `audio/rejected/` (not used).
