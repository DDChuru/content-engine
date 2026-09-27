# 4.1.3 audio review

Voice Thandi `BcpjRWrYhDBHmOnetmBl`, `eleven_multilingual_v2`, speed 1.0, one file per beat, no time-stretch.
Cue pipeline: faster-whisper small (with the lesson PROMPT). Adjudication: faster-whisper medium (`second_opinion.py`, no prompt).

## Request-only normalisations
None (`request_normalise.json` is `[]`). Years (2022, 2023, 2024) are read by the voice as "twenty twenty-two" etc.

## Retakes (old take kept in audio/v1; not used)
| Beat | Take | Finding | Action |
|---|---|---|---|
| 6 | 1 | "and whether energy is used" heard as "and where the energy is used" by small AND medium | retake |
| 6 | 2 | small (cue model): 101/101 exact; medium still writes "where the energy" and drops "other" | accepted: the cue model hears the frozen line word for word; the no-prompt medium model diverges on a fast "whether energy" |

## Recogniser spellings judged not to be voice errors (mapped in `_spell`, heard side only)
US spellings (recognized, recognize(s), unfavorable, signaling); homophones role/roll, roles/rolls, too/to; "route" heard
as "root" (the British pronunciation of route); "2022" heard spelled out as "twenty twenty two".
