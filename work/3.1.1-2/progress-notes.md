PHASE: DELIVERED FOR REVIEW — master verified, branded, uploaded to Bunny (guid 08c56c4e-3505-412c-af04-4175524e4a1b, no collection). Only remaining step if this session died: re-poll Bunny to status 4 (`./bunny-poll.sh 08c56c4e-3505-412c-af04-4175524e4a1b`) and fill BUNNY_* in REPORT.md.

## Resume procedure (fresh container)
1. `apt-get update && apt-get install -y ffmpeg`; `pip install faster-whisper pillow numpy fonttools brotli`.
2. `cd work/3.1.1-2 && npm install` (package.json pins react/react-dom 19.2.0, sharp 0.33.5, esbuild 0.25.10,
   remotion + @remotion/bundler + @remotion/renderer 4.0.365, zod 3.22.4).
3. `python3 make_fonts.py` (instances the brand WOFF2 fonts to TTF in fonts/ and writes fonts/fonts.conf).
4. WAVs are not in git: `python3 generate_audio.py` rebuilds every `audio/beat-NN.wav` from the committed MP3s
   WITHOUT calling ElevenLabs (it only calls the API when an MP3 is missing). DO NOT regenerate audio.

## Done
- Audio: 18 beats, Thandi v2 speed 1.0, no stretch. Request-only normalisations in `request_normalise.json`
  (B4 Catalase→Catalaise, B5 catalyses→catalyzes); B11 retaken unchanged. Detail: `qa/audio-review.md`.
- ElevenLabs characters: before 222,543; after audio 231,267.

- Holds (digital silence, `insert_holds.py`): B5 3 s, B11 4 s, B14 3 s, B16 4 s silent reads; B18 5 s anchored read
  between "Read it," and "then watch…", plus a 2 s END hold. `audio/*.timed.wav` rebuilt by `python3 insert_holds.py`.
- Timeline: `cue_plan.py` (224 cues) → `assemble_timeline.py` → `timeline.json`: 900.133 s, 27,004 frames, max cue gap
  11.96 s. `public/narration.wav` (not in git) is rebuilt by `python3 assemble_timeline.py`.
  Cue syntax: '^' = trigger word; trailing '$' = trigger at the END of the last word (error-beat exit cues).

## Decisions
- House style: the reference's `topic-02/shared/src` was NOT in the inputs; rebuilt in `shared/src/` from the brand
  tokens (packages/backend/src/remotion/compositions/stem4life/palette.ts) with the reference chrome geometry
  (Lesson.tsx header y=44/111/170, caption bar at y=959–1038, error badge 1410,22 440×56).

## Per-beat procedure (exact next steps)
1. Author `src/beats/BeatNN.tsx` (then regenerate `src/beats/index.ts`: the python one-liner in PROGRESS history —
   it lists every existing BeatNN.tsx).
2. `node build.cjs && node qa-beat.cjs N && python3 sheet-beat.py N`; LOOK at `qa/beat-NN/sheet-*.jpg`; fix; repeat.
3. `./approve.sh N` then `./launch-render.sh N` (detached, max 4 live). Done when `render-cache/beat-NN/complete.json`
   exists. `python3 update_progress.py` refreshes this file.
- Editing a shared file (shared/src/*, src/Model|Graph|Scenes|Panels|Chem|Lesson|util) changes EVERY beat's fingerprint:
  re-run qa-beat + approve for affected beats and re-render (finish.py refuses stale chunks).

## Components (id scheme)
- `shared/src/`: theme.ts (BRAND tokens), Type.tsx (Txt, Lines, Card, Tag, Cite, InkRing, Underline, Arrow, textW from
  metrics.json), ErrorMarker.tsx (badge 1410,22 440×56 + terracotta frame; data-error-marker / data-error-label).
- `src/Model.tsx`: EnzymeActiveSiteModel — CLEFT_LK (rest-lk) and CLEFT_IF (rest-if, separate asset), cleftAt(mode, close),
  Enzyme{x,y,s,mode,close,trace,pulse,backbone,links,stubs}, Substrate{kind gen|wrong|round, dx,dy (seat-relative), rot, ghost},
  Products (one-frame switch, then drift), Ticks (dashed temporary bonds), ComplexBracket, Label, ModelTag, pt(). SITE2 +
  inhibitor/denatured states are published-not-drawn (L4a/L5).
- `src/Graph.tsx`: EnergyGraph (fixed reactant/product levels; brackets ea1, ea2, red), humpPoint.
- `src/Chem.tsx`: Beat 9 atom graph (A–D residues; Og, BC1 = "C1", CC4 = Cp, water Ow/Ht/Hr); hydrolyseGraph, auditGraph,
  hydrolyseAudit (run on EVERY frame of beat 9 by render-beat.cjs → render-cache/beat-09/valence-audit.json).
- `src/Scenes.tsx` (Mouth, Bread, Beads, TongueCells, Cell, RxArrow, RegionTag), `src/Panels.tsx` (QHeader, Written, span,
  QuoteTab, quoteSpan, SideNote, Strike, CorrectCard), `src/Lesson.tsx` (router, chrome, ERROR_BEATS {5,11,14: exit cue;
  16: fix3 + 18 frames}), `src/beats/Beat04.tsx` exports CellScene (reused by 5 and 17), Beat07 exports Lock.

## Decisions / interpretations
- Error badges: all four COMMON MISTAKE (each diagnosed by an examiner report: ECR Paper 2 p.10 comments D and B, p.54;
  June 2024 ER pp.12/15). Marker from each error beat's first frame; B5/B11/B14 clear at the storyboard's exit cue (end of
  the last talk-through word); B16 clears on the frame the LAST correction (ESC → enzyme-substrate complex) completes.
- B18 anchored read: storyboard gives "At Read it, five-second anchored read" with no hold line in the narration block;
  inserted as 5 s digital silence between "Read it," and "then watch…". Final frame held 2 s (END hold).
- Cue normalisation: B10 uses "same finish, a lower hill" (CHECK-R2), B11 "Lowering activation energy is true" (the
  storyboard cue occurs twice under case-folding).
- Products are a ONE-FRAME outline switch (never a cross-fade), then motion; Beat 1 bead cut likewise.

## Bookends (DONE, not in git: re-render in ~1 min if the container is fresh)
`cd bookend-src && node render-bookends.mjs "3.1.1-2=Enzymes: where and how they act"` → `bookends/intro-3.1.1-2.mp4`
(Stem4LifeIntroB, heroHeight 518, 150 f) and `bookends/outro-3.1.1-2.mp4` (Stem4LifeOutro, aesthetic C, 180 f). Sources are
copies of packages/backend/src/remotion/compositions/stem4life + public fonts; Remotion 4.0.365 downloads its own
chrome-headless-shell. Late frames LOOKED at (qa/bookend-*-late.jpg): title reads exactly "Enzymes: where and how they act".

## Resume after the chain
1. If logs/chain-finish.log lacks "CHAIN DONE": check `pgrep -fa render-beat`; if none alive, remove render.lock files whose
   PID is dead and rerun `setsid nohup ./chain-finish.sh > logs/chain-finish.log 2>&1 < /dev/null &` (idempotent).
2. LOOK at qa/encoded-sheets/*.jpg; fix → qa-beat/approve that beat → rerun chain (re-renders only stale beats).
3. Brand: `BAR_PNG=../../cloud-inputs/003/branding/bar-3.1.1-2.png MUSIC_MP3=../../cloud-inputs/003/branding/tutorial.mp3
   INTRO_MP4=bookends/intro-3.1.1-2.mp4 OUTRO_MP4=bookends/outro-3.1.1-2.mp4 ../../cloud-inputs/003/branding/apply-branding-cloud.sh
   3.1.1-2-enzymes.mp4 3.1.1-2-enzymes-branded.mp4` (the inputs come from `git checkout origin/cloud/inputs-003 -- cloud-inputs/003`).
4. Bunny: POST create {"title":"REVIEW 3.1.1-2 Enzymes: where and how they act"} (no collection) → PUT curl -T → poll to status 4.
5. REPORT.md (<70 lines).

## Final state
- Master `3.1.1-2-enzymes.mp4` 900.133 s, sha256 ea72f948bcf7597b71bd2d95c92846012d9cb3c3793b304ad4bbf58cf1d43d32 (all §4 checks pass,
  qa/verification.json). Superseded pre-review master kept as `3.1.1-2-enzymes-SUPERSEDED-prereview.mp4` (not in git).
- Branded `3.1.1-2-enzymes-branded.mp4` 911.162 s, sha256 eba19eb8c9ed10e417187198704ce842c5b6c0ce1891849cb9a2c8b8e52455d1.
- MP4s are NOT in git (rule). To reproduce: npm install, make_fonts.py, generate_audio.py (reuses MP3s), insert_holds.py,
  assemble_timeline.py, ./chain-finish.sh, bookends, branding — approvals in qa/beat-NN/approved.json stay valid.
