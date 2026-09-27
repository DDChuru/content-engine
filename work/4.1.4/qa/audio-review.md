# 4.1.4 audio review

Voice Thandi `BcpjRWrYhDBHmOnetmBl`, `eleven_multilingual_v2`, speed 1.0, one file per beat, no time-stretch.
Cue pipeline: faster-whisper small (lesson PROMPT includes "LL-37"). Adjudication: faster-whisper medium.

## Request-only normalisations
| Beat | Script | Request | Why |
|---|---|---|---|
| all | `LL-37` | `L L thirty-seven` | the peptide's name read as letters and number (pre-emptive); heard back as "LL37" / "LL-37" |

No cue phrase contains "LL-37": Beat 7's exit is the END of "a binding site complementary to", and the marker's clear
frame adds the measured length of "LL-37" (69.36 → 70.70 s = 1.34 s → animFrames 44).

## No retakes
- Beat 1 "a message sent so widely": small wrote "sense" (p 0.34); medium hears "sent" — accepted.
- Beat 5: small missed one "site" token; medium hears every "binding site"; medium writes "do not feed" where small hears "fit" — accepted (small, the cue model, matches "fit").
- Recogniser spellings: "route" as "root" (British pronunciation), "too" as "to", years and "Paper 22" spelled out.

## 008f re-voice (memory hook, RULE-MEMORY-HOOKS)
Beat 5 only: hook sentences added (STORYBOARD.md § 008f REVISION). One take: small recogniser 130/130; it also emitted a
0.12 s duplicate "binding" (p 0.14) at 28.4 s — faster-whisper medium on 25.8–30.2 s hears "…to the binding site, so it
binds." with no duplicate: recogniser artefact, take kept. Old take in `audio/v-pre008f/`. 2 s digital-silence hold before
"Unlike the letter".
