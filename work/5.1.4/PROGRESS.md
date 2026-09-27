# 5.1.4 Telomeres: why copying costs telomere, not genes · BUILD PROGRESS (handover)

**v2 (run 009f, 27 Sep, branch `cloud/009f-fix-4t1jp6`): DONE** — review fixes applied (B2 overlap, persistent schematic
captions on every model use, all text >= 17 px after branding, buffer memory hook re-voiced with paired highlights and a
2 s hold, delivered video >= audio), 8/8 beats re-rendered and approved, verified (`qa/verification.json`,
`qa/label-size-audit.json`, `qa/delivered-verification.json`), re-branded, Bunny guid `d6705b5e-1b23-44fa-a633-2f28a6e10e3c`
at status 4. See `REPORT.md` (v2) and `REPORT-v1.md`.

Next step for a successor: none for this lesson. render-cache/ and all MP4/WAV are NOT in git; a fresh container re-renders
approved beats with `./render-batch.sh 1 2 3 4 && ./render-batch.sh 5 6 7 8` (approvals in `qa/beat-NN/approved.json` stay
valid while the source fingerprint matches), then `python3 finish.py && python3 verify.py`.

Decisions: `REPORT.md` (Interpretations), `qa/audio-review.md`, `qa/cue-additions.md`.
