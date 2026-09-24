# Audio review — 3.2.2-3

ElevenLabs Thandi `BcpjRWrYhDBHmOnetmBl`, `eleven_multilingual_v2`, speed 1.0, stability .5, similarity .75,
style 0, speaker boost; one MP3 per beat (`audio/beat-NN.mp3`), 44.1 kHz → 48 kHz mono WAV for the build.
No time-stretching. Timeline from the measured audio. Transcription: faster-whisper `small` (CPU int8);
suspicious words re-checked on clipped audio with `medium.en`.

**Characters (`GET /v1/user`, `subscription.character_count`):** before 231,267 · after 237,993 ·
**used 6,726** (the 17 beats, the B9 regeneration and two short pronunciation probes). The account
counter moved by less than the raw character total of the requests (10,843 for the 17 beats), so the
counter is the figure of record.

## Request-only normalisation (storyboard and cue phrases unchanged)

| Where | Storyboard text | Request text | Why |
|---|---|---|---|
| all beats | `Km` (42×) | `K M` | Probe (`audio/probe/probe.py`, same voice/settings): the bare token was voiced as a word — unprompted Whisper heard "Kamihamj", "Kynum". "K M" was heard as "Km" (the letters). |
| Beat 9 only | `Vmax` (all occurrences in B9) | `V max` | First take voiced "confused Km with Vmax" as "Weimags/Weimachs" (small and medium.en agree). Regenerated once; medium.en now hears "VMAX". Old take kept in `audio/superseded-b09-vmax/`. Every other beat's "Vmax" transcribes as "Vmax"/"V max" and was left as written. |

`Michaelis–Menten`, `competitive`, `non-competitive`, `substrate concentration` were transcribed correctly
in every occurrence; no normalisation was needed.

## Transcript differences checked (all accepted)

| Beat | Whisper small heard | Verdict |
|---|---|---|
| 3 | "axes read" → "excess rate" | medium.en: "axis read properly". Speech fine (recogniser). |
| 5, 6, 8, 9, 17 | numbers as digits (9, 4 5, 18, 100, 200, 400); "halve" → "half"; "decimetre" → "decimeter" | spelling/formatting only |
| 8 | "Y" → "Ui" | medium.en: "X, Y, and Z". Fine. |
| 10 | "difference is" → "differences" | elision; fine |
| 12 | "read" → "red" | homophone (past tense in "read from its own …") |
| 13 | "candidates" inserted (duplicate) | medium.en on the clip: single "candidates". Recogniser duplication, not speech. |
| 15 | "across" → "a cross" | fine |
| 16 | "row" → "role"; "where the" → "whether"; "rate" → "read" | medium.en: "where the credited ideas"; "Km is not a rate." "row/role" heard as "role" by both models — near-homophone; **worth a listen by ear**. |

Worth a listen by ear: B16 "a row for the effect" and every "K M" (the letters were requested).
