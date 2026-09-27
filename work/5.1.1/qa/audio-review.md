# 5.1.1 audio review (ElevenLabs Thandi, eleven_multilingual_v2, speed 1.0; one file per beat)

Request normalisation: **none** (`request_normalise.json` = `[]`). Every request text equals the frozen storyboard text.

Transcript check (`audio_review.py`, faster-whisper small with the lesson prompt) and a second opinion
(`second_opinion.py medium`, no prompt) on beats 2, 3, 4, 7, 10:

| Beat | Recogniser difference | Second opinion | Ruling |
|---|---|---|---|
| 1, 3, 10 | metres → meters | same | US spelling of the same word; fine |
| 2 | "tell a chromosome" → "telochromosome" | "telachromosome" | the two words run together at speaking pace; no wrong word; kept |
| 3 | extra "proteins" (0.20 s token) | not present | recogniser artefact (prompt word); kept |
| 4 | "it sit" → "its set" | same | vowel reduction of "it sit"; no term affected; kept |
| 7 | "trap" → "trip" (p 0.28) | "trap" | medium model hears the frozen word; kept |
| 8 | two → too; colour → color; extra "and" (0-length token) | — | homophones / artefact; kept |
| 10 (take 1) | "histones" → "heath stones" | "he stones" | **both models heard the first syllable dropped: rejected** (moved to `audio/rejected/*.take1`) |
| 10 (take 2) | "histones" → "his stones" | — | his-tones, the correct syllables; **kept** (same request text; a new take, no normalisation) |
| 11 | cloze → close | — | homophone; kept |

ElevenLabs characters for the retake: 431 (beat 10 request).
