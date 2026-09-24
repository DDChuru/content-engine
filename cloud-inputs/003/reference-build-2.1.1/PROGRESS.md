# 2.1.1 — The four food tests · BUILD PROGRESS (handover file)

Updated 2026-09-23 00:00 (machine A local). Builder: claude-opus-5-5.
**Phase: COMPLETE (handling repair included)** · **Beats complete: 20 / 20** · master: present
Live render processes for 2.1.1: none (any other render-beat.cjs on this machine belongs to another lesson).

| Beat | Heading | Frames | Cues | State |
|---|---|---|---|---|
| 1 | Hook · 0:00–0:44 | 1123 | 10 | COMPLETE |
| 2 | Why this one is on you · 0:44–1:20 | 918 | 10 | COMPLETE |
| 3 | What you will be able to do · 1:20–2:01 | 1051 | 9 | COMPLETE |
| 4 | THE ONE IDEA · conditions, observation, inference · 2:01–2 | 1470 | 12 | COMPLETE |
| 5 | The bench: name everything before you touch anything · 2:5 | 1406 | 11 | COMPLETE |
| 6 | Benedict's, part one: measured sample, reagent in excess · | 1809 | 14 | COMPLETE |
| 7 | Benedict's, part two: heat in a water bath · 4:53–5:43 | 1300 | 11 | COMPLETE |
| 8 | Benedict's, part three: reading the result · 5:43–6:42 | 1619 | 17 | COMPLETE |
| 9 | Controls, and what a positive Benedict's does not tell you | 1554 | 13 | COMPLETE |
| 10 | Iodine for starch · 7:38–8:29 | 1379 | 13 | COMPLETE |
| 11 | Emulsion test, part one: ethanol first · 8:29–9:27 | 1643 | 14 | COMPLETE |
| 12 | Emulsion test, part two: into water · 9:27–10:28 | 1641 | 14 | COMPLETE |
| 13 | Biuret test, part one: the reagents and their order · 10:2 | 1625 | 16 | COMPLETE |
| 14 | Biuret test, part two: reading violet, and what it detects | 1457 | 13 | COMPLETE |
| 15 | Recording: the table, observation before inference · 12:19 | 1857 | 14 | COMPLETE |
| 16 | A mixture: several tests on one sample, from fresh portion | 1424 | 12 | COMPLETE |
| 17 | COMMON MISTAKE E01 · claiming more certainty than a colour | 2377 | 16 | COMPLETE |
| 18 | Competence moment: checks before conclusions · 15:36–16:46 | 1891 | 14 | COMPLETE |
| 19 | What I told you, in place · 16:46–17:42 | 1530 | 10 | COMPLETE |
| 20 | How it is asked, with a real question · 17:42–18:21 | 1082 | 7 | COMPLETE |


## Rules (from Durai's brief)
Narration FROZEN (STORYBOARD.md). Write only in this folder and `topic-02/shared/`. No git, no deploy/publish.
Heavy steps `nice -n 10`; at most 4 render processes; never touch port 3210. Long steps detached (setsid nohup … </dev/null &).

## Done
- Phase 1 AUDIO complete. `script.json` (20 beats, 2,171 words). ElevenLabs Thandi v2 speed 1.0, one mp3/wav per beat in `audio/`.
  Request-only normalisations: copper(II)→"copper two"; biuret→"bye-yoo-ret" (beats 3, 13, 14, 17 regenerated once; old takes in
  `audio/superseded-biuret/`). Evidence and all request diffs: `qa/audio-review.md`. DO NOT regenerate audio.
- Holds (digital silence only, `insert_holds.py`): B17 3.5 s silent read before "Look at the word"; B20 5 s anchored read before
  "They credited the reagent" + 3 s END hold. `*.timed.wav` / `*.timed.words.json`.
- Phase 2 TIMELINE complete: `cue_plan.py` (250 cues; storyboard cues + visual-only additions, see `qa/cue-additions.md`) →
  `assemble_timeline.py` → `timeline.json` (1006.2 s, 30,186 frames; max cue gap 9.4 s) + `public/narration.wav`.
  Integer-frame scene lookup; a cue is active from frame ceil(localTime×30).

## Components (id scheme)
- `../shared/src/`: `theme.ts` (palette, easing), `Type.tsx` (Txt, Lines, Card, Tag, Cite, InkRing, Arrow),
  `Swatch.tsx` (colour convention: SW keys blue/green/yellow/orange/brickred/blueblack/orangebrown/lilac/lightpurple/purple/violet/
  darkpurple/cloudy/clear/colourless; pattern ids `sw-<key>`, precipitate `sw-ppt`; Swatch, NamePill, Fill),
  `ErrorMarker.tsx` (ErrorMarker{on,label} with data-error-marker/data-error-label; WrongInset for short handling contrasts).
- `src/Apparatus.tsx` (Tube{id…} — ids must be unique per frame because of clipPaths; Rack, Bottle, Dropper, Syringe, Cylinder,
  BeakerBath, ElectricBath, Thermometer, Bunsen, Holder, Tile, Goggles, MarkerPen, Waste, Timer, Hazard, Callout),
  `src/Bench.tsx` (fixed bench geography; `show`/`labels`/`glow` by key: rack label syringe dropper bath electric holder tile goggles
  reagents waste), `src/Panels.tsx` (PinnedCOI, COIRow, ResultsTable, Checklist, CorrectCard, QuoteTab), `src/util.ts` (fi/fe/move/wobble/shake).
- `src/Lesson.tsx`: router + chrome; `ERROR_BEATS` {17: EXAM CONTRAST, clears 18 frames after the "correct" cue frame, i.e. on the
  first frame the in-place replacement is complete}. Beat components get {sc, local, k, at, a(key)=seconds since cue}.

## Resume here (phase 4b, handling repair)
Durai: pours were physically impossible (B12 62° tube, stream from its side; B16 70° bottle, no stream). New rule:
VIDEO-STRUCTURE "Handling must be physically possible". Fixed in Apparatus.tsx: world-horizontal liquid (area bisection),
tubeLip/bottleLip/…ByLip, Stream, Bottle rot/vol, Dropper fall, animated bung. Beats changed: 1,6,7,9,10,11,12,13,15,16 +
Bench droppers (2,5,19,20). Mid-pour/handling stills in qa/pour-b12.jpg, qa/pour-b16.jpg, qa/handling-*.jpg.
`chain-finish.sh` (log logs/chain-finish-2.log) re-renders every stale beat, then finish/verify/sheets; ends "CHAIN DONE".
Then LOOK at encoded sheets (esp. B12 ~8:30, B16 ~12:20), update README + PROGRESS (BUILD COMPLETE + new sha256).
Previous master kept as 2.1.1-food-tests-SUPERSEDED-pour-handling.mp4. Never touch 2.1.1-food-tests-TEST-AS-BUILT.mp4.

0. CURRENT (turn 2): `chain-finish.sh` runs detached (log `logs/chain-finish.log`): waits for beats 1,4,7, re-renders
   stale 9/11/15/18 (post-review fixes), then finish.py → verify.py (`logs/verify.log`) → encoded-sheets.py.
   It ends "CHAIN DONE". If it died, rerun it: every step is idempotent. Review fixes applied after the first
   master (now `2.1.1-food-tests-SUPERSEDED-prereview.mp4`, which verified clean): false cross-fade colours in
   Benedict's changes (B1, B4, B7, B9, B18 → endpoint switches), empty openers (B4, B18), B11 dropper overlap,
   B15 row emphasis. See qa/decisions.md.
1. If `logs/rerender-stale.log` does not end with "RERENDER DONE", check `ps -eo pid,args | grep "[n]ode render-beat"`.
   If no render process is alive and some `render-cache/beat-NN/complete.json` are missing, relaunch
   `setsid nohup ./rerender-stale.sh > logs/rerender-stale.log 2>&1 < /dev/null &` only after removing
   locks whose PID is dead (`cat render-cache/beat-NN/render.lock`, `ps -p PID`). Beats already moved to
   superseded but not re-rendered: `./launch-render.sh N` (approval already refreshed).
2. `nice -n 10 python3 finish.py` → `2.1.1-food-tests.mp4` (refuses if any beat is stale or incomplete).
3. `setsid nohup /home/dachu/miniconda3/envs/aitools/bin/python verify.py > logs/verify.log 2>&1 < /dev/null &`
   → `qa/verification.json`, `qa/marker-audit.json`, `qa/boundary-audit.json`.
4. `/home/dachu/miniconda3/envs/aitools/bin/python encoded-sheets.py` → `qa/encoded-sheets/`; LOOK at every sheet;
   a fix costs one beat (edit, qa-beat, approve, render, finish, verify again).
5. README.md, final PROGRESS ending BUILD COMPLETE + sha256.

## Per-beat procedure
1. Author `src/beats/BeatNN.tsx`, add it to `src/beats/index.ts`.
2. `node build.cjs && node qa-beat.cjs N && /home/dachu/miniconda3/envs/aitools/bin/python sheet-beat.py N`; LOOK at
   `qa/beat-NN/*.png` / sheets; fix; repeat.
3. `./approve.sh N` then `./launch-render.sh N` (detached, refuses if 4 live or a lock exists). Log `logs/render-beat-NN.log`;
   done when `render-cache/beat-NN/complete.json` exists. Then `python3 update_progress.py`.
- Editing a shared/lesson component changes every beat's fingerprint: already-rendered beats stay valid only if the change
  cannot affect them; `finish.py` lists stale hashes so they can be re-approved and re-rendered.

## Decisions / interpretations
- E01 (Beat 17) badge = **EXAM CONTRAST**, not COMMON MISTAKE: the June 2023 ER p.32 records candidates *correctly* naming colour
  subjectivity, and the MS accepts an estimate according to the candidate's results; the wrong answer is labelled illustrative
  (CHECK.md M2). Neither diagnoses "exactly 2.1%" as a candidate error, so the conductor's 22 Sep badge ruling applies.
- Short handling contrasts (B7 flame, B10 shared pipette, B12 water first, B13 no alkali) are framed WRONG METHOD insets, not error
  beats (CHECK-R2 D), each introduced by the narration before it plays and ending on the correct operation.
- No beat counter / progress bar / logo in the lesson (brief). Pinned CONDITIONS → OBSERVATION → INFERENCE strip from Beat 5 on.

## BUILD COMPLETE

Master `2.1.1-food-tests.mp4` (after the pour and handling repair): 16:46.200, 30,186 frames, 20/20 beats. All eight ordered checks pass; 250/250 cues; every-frame marker audit shows 0 mismatches (1,901 frames, EXAM CONTRAST); the Beat 12 and Beat 16 sheets were inspected.
Known and accepted: the B12 stream crosses the E label; the B16 bottle briefly covers the "reducing sugar test" heading.
SHA-256: `a44147f2a2d7a79f392245b6eec3456d722cdfcd2ed6c75ded856b7df3debaa3`

BUILD COMPLETE
