# 3.1.1-2 audio review

ElevenLabs Thandi `BcpjRWrYhDBHmOnetmBl`, `eleven_multilingual_v2`, speed 1.0, stability .5, similarity .75,
style 0, speaker boost; one MP3 per beat (mp3_44100_128) → 48 kHz mono PCM. **No time-stretching.**
Transcription: faster-whisper `small` (CPU int8, word timestamps, topic prompt). Second opinions: `medium`, no prompt
(`qa/second-opinion-medium-NN.json`). Every transcript diff per beat: `qa/transcript-review.json`.

Characters (GET /v1/user `subscription.character_count`): before **222,543** → after audio **231,267** (Δ 8,724 as
reported by the account; final beat requests total 10,941 characters, pronunciation probes 2,233).

## Request-only normalisations (the storyboard and every cue phrase are untouched)
| Beat | Storyboard | Request text | Why |
|---|---|---|---|
| 4 | `Catalase` | `Catalaise` | Take 1 (storyboard spelling) was heard as "Catalyze is one" by both `small` and `medium`. Respelled so the ending reads -LAYZ; the isolated probe "Catalaise is one…" came back "Catalase". |
| 5 | `catalyses` | `catalyzes` | Take 1 said "catalysis" (both models); a fresh probe of the storyboard sentence also said "catalysis"; the respelling probe came back "catalyzes". |

## Retakes (old takes kept in `audio/superseded/`)
- **B4**: take 1 (storyboard spelling) → take 2 (`Catalaise`, lipase then heard as "Lepase") → **take 3** = the full-beat probe
  `qa/pron-tests/b4full-0.mp3`, generated with the identical `Catalaise` request body, "Lipase" clean.
- **B5**: take 2 with `catalyzes`: heard "catalyzes" ✓.
- **B11**: take 1 said "laccase" in a way both models heard as "LAKES" (one syllable). Respelling probes (laccaise, lack-aise,
  lackaise, lack-ayz, lakkase, lak-ase, lacc-ase) all came back worse or no better, so B11 was retaken with the **storyboard
  text unchanged**: take 2 is heard as "lackeys" (two syllables, LAK-). Kept. B18's two "laccase" were heard "lackas"/"laccase".

## Whisper can't settle catalase vs catalyse
Even isolated word clips from every B4 take come back "Catalyse/Catalyze is one" from both models. Its language prior
overrides the vowel, so the transcript can't prove the fix. The respelling is the orthographic fix. **Worth a listen by
ear: "Catalase is one" in B4 (≈7 s) and "laccase" in B11 (≈92.6 s).**

## Transcript anomalies checked and accepted (recogniser spelling, not speech faults)
- US spellings: catalyse→catalyze, learnt→learned; digits: one→1, four→4, "alpha one-six"→"alpha 1,6".
- B5 "ex"→"X" (same sound); "lipases"→"liposies" (small) but `medium` hears "lipases"; "write"→"ride" (small) but `medium` "write".
- B6 "R groups"→"our groups" (the letter R).
- B9 "O–H" transcribed "OH": the token lasts 0.54 s, consistent with the letters O-H rather than "oh". Worth a listen.
- B9 "water. water," and B14 "together. together." are duplicated recogniser tokens (`medium` hears each word once).
- B12 "lock and key"→"log and key" once (`medium`); `small` hears "lock". Worth a listen.
- B16 "E S C" is spoken as three letters (token 1.54 s); "swap"→"swab" (small, p .40).
- B14 "blend end of the two": recogniser artefact; `medium` hears "never a blend of the two".
