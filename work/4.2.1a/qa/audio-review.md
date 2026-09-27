# 4.2.1a audio review

Voice Thandi `BcpjRWrYhDBHmOnetmBl`, `eleven_multilingual_v2`, speed 1.0, one file per beat, no time-stretch.
Cue pipeline: faster-whisper small (with the lesson PROMPT). Adjudication: faster-whisper medium (`second_opinion.py`, no prompt).

## Request-only normalisations
None (`request_normalise.json` is `[]`).

## Retakes
None. Every beat matches the frozen text word for word after the recogniser-spelling map below (14/14 beats; Beat 10
140/141, the one difference being a spelling, see below).

## Recogniser spellings judged not to be voice errors (mapped in `_spell`, heard side only)
"routes" heard as "roots" (Beats 4, 7: the British pronunciation of route); "haemoglobin" written "hemoglobin" (US
spelling, Beat 5); "the hook's problem" written "the Hooke's problem" (homophone, Beat 7); Beat 10's "June 2023" written
as "twenty twenty three" by the cue model (the voice reads the year correctly; no Beat 10 cue phrase contains the year).

## Second opinion (medium, no prompt)
Beats 8 and 10 (lowest-confidence words): Beat 8 reads word for word; Beat 10 reads word for word except "phospholipid
B layer" for "phospholipid bilayer" (the small cue model hears "bilayer"; treated as a recogniser split of the frozen word). Accepted.

## 008f — Beat 8 re-voiced (memory hook only)
One take (731 chars requested). Transcript 118/118 words matched, the hook sentences read exactly: "Picture a doorway in a
wall. The wall. The phospholipid bilayer, whose hydrophobic core turns ions back. The doorway. The channel protein's
hydrophilic pore. An opening right through the wall." Low-confidence recogniser token: "pore" (0.48, at 51.9 s) — the recognised
word and its position match the script ("the pore simply stays open"); a confidence-only flag. No request-only normalisation needed. The 2 s hold
before "Written properly" is digital silence (insert_holds.py H[8]).
