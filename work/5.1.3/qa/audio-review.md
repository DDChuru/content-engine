# 5.1.3 audio review (ElevenLabs Thandi, eleven_multilingual_v2, speed 1.0; one file per beat)

Request normalisation: **none** (`request_normalise.json` = `[]`).

| Beat | Recogniser difference (small, prompted) | Second opinion (medium, no prompt) | Ruling |
|---|---|---|---|
| 2, 10, 14 | "interphase" → "interface" (some occurrences) | "interface" for every occurrence | /ˈɪntəfeɪz/ vs /ˈɪntəfeɪs/ differ only in the final voicing; the prompted model hears "interphase" in most places (e.g. beats 3, 4, 13). Language-model prior, not a mispronunciation; kept |
| 4 | histone → "his stone" | — | his-tone syllables; kept |
| 5 | diploid → "deployed" | "diploid" | kept |
| 11 | "axis" run into "ours" | "excess label" | the vowel of "axis" reduced; kept (not a Topic 5 term) |
| 12 | card → cart; processes → processors | — | final-consonant/ending confusions at speaking pace; kept |
| 13 | two → to | — | homophone; kept |
| 14 (take 1) | chromatid → "chromated" | "cremated" | **rejected** (moved to `audio/rejected/*.take1`) |
| 14 (take 2) | — ("round" heard "around", both models) | "chromatid numbers around the cycle" | chromatid correct; "numbers round" runs together; **kept** |

Characters for the retake: 506 (beat 14).
