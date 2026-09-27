# 4.1.1-2 audio review

Voice Thandi `BcpjRWrYhDBHmOnetmBl`, `eleven_multilingual_v2`, speed 1.0, one file per beat, no time-stretch.
Transcribed with faster-whisper small (cue pipeline) and adjudicated with faster-whisper medium (`second_opinion.py`).

## Request-only normalisations (never in the storyboard, never in a cue phrase)
| Beat | Script | Request | Why |
|---|---|---|---|
| all | `OH` | `O H` | spoken as the letters of the hydroxyl group, not the word "oh" (pre-emptive; beats 8, 11, 12, 13) |
| 1 | `Between the two sits the` | `Between the two, sits the` | take 1 heard as "two sides", take 2 as "two sites" by BOTH recognisers; the comma makes the voice read "sits" as the verb. Take 3: both recognisers hear "sits". |

## Retakes (old takes kept in audio/v1, audio/v2; not used)
| Beat | Take | Finding (small + medium agree) | Action |
|---|---|---|---|
| 1 | 1 | "sits" → "sides" | retake |
| 1 | 2 | "sits" → "sites" | request-only comma, retake |
| 9 | 1 | "like theirs" → "like this" | retake; take 2 heard "like theirs" by medium |
| 10 | 1 | "bilayer" → "B layer" | retake; take 2 clean |

## Remaining recogniser differences, judged recogniser spellings (not voice errors)
- "1972", "2024" (numerals for "nineteen seventy-two", "twenty twenty-four"); "onto" for "on to" (mapped in `_spell`).
- Beat 9 "cytoplasm" → "satoplasm"/"setoplasm": the same word is recognised as "cytoplasm" in Beats 1, 5, 6, 11 and 12 from the same voice; recogniser spelling.
- Beat 4 small model inserted "water" (probability 0.18); medium hears the line exactly: recogniser artefact.
