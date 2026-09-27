# 5.1.4 audio review (ElevenLabs Thandi, eleven_multilingual_v2, speed 1.0; one file per beat)

Request normalisation: **none** (`request_normalise.json` = `[]`); "T, T, A, G, G, G" is in the frozen text and was spoken as letters.

| Beat | Recogniser (small, prompted) | Second opinion (medium) | Ruling |
|---|---|---|---|
| 4 (take 1) | "short" → "shot" | "one -shot DNA sequence" | **rejected** (`audio/rejected/*.take1`): the telomere definition word must be unambiguous |
| 4 (take 2) | no differences | "one short DNA sequence … T-T-A-G-G-G" | **kept** |
| 8 | "cloze" → close; "too short" missing | "a telomere becoming too short to a cell" | homophone; the medium model hears "too short" (small model dropped two quick words); kept |

Characters for the retake: 349 (beat 4).
