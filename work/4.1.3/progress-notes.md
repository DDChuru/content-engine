PHASE: audio + timeline done; authoring beats
## Session
Cloud run 008a, lessons in order: 4.1.1-2 → 4.1.3 → 4.1.4 → 4.2.1a. Branch `cloud/008-4.1.1-2-to-4.2.1a-dq9f0v`.
Shared Topic 4 models: `work/t4-shared/` (SHARED.md), copied byte for byte to the top level of `src/`.
## Resume procedure (fresh container)
Setup per cloud-inputs/008/BRIEF.md (+ `pip install brotli` for make_fonts.py). `python3 make_fonts.py`.
Audio is in git: `python3 generate_audio.py` re-derives WAVs from the MP3s without a request; then
`python3 insert_holds.py && python3 assemble_timeline.py`. Render approved beats with `./render-batch.sh …`.
## Decisions
- E43 (Beat 7) badge EXAM CONTRAST; clears on the completed correct frame at the END of "through channel or carrier proteins" (cue key `exit`).
- Opening cues added: B2 "By the end", B3 "Here is the membrane", B7 entry "Now an exam contrast", B12 "So here it is".
- Layout: membrane at left two-thirds (cx 560, u 44), RoleGrid at right (x 1060–1850); beat 7 swaps the grid for the error card.
