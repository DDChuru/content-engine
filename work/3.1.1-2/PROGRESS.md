# 3.1.1-2 Enzymes: where and how they act · BUILD PROGRESS (handover)

Updated 2026-09-24 11:46Z. Builder: claude-opus-5-5 (cloud run 003). Branch `cloud/003-3.1.1-2` ONLY.
**Phase: BEATS — authoring + rendering (1–4 rendered; 5–8 rendering; 9 approved)** · **Beats complete: 4 / 18** · master: not yet built
Live render processes: 4916 /bin/bash -c source /root/.claude/shell-snapshots/snapshot-bash-1790248092933-kmkub2.sh 2>/dev/null || true && export BUN_OPTIONS="--smol${BUN_OPTIONS:+ $BUN_OPTIONS}" && shopt -u extglob 2>/dev/null || true && { \builtin unalias -- 'unsetenv'; \builtin unset -f -- 'unsetenv'; } >/dev/null 2>&1 || true && eval 'for b in 5 6 7 8; do ./launch-render.sh $b; done; printf '"'"'qa/beat-*/*.png\nqa/beat-*/*.svg\nqa/pron-tests/*.wav\n'"'"' >> .gitignore; cat > update_progress.py <<'"'"'EOF'"'"' """Regenerate PROGRESS.md from disk state + progress-notes.md (the hand-written decisions).""" from pathlib import Path import json,datetime,subprocess P=Path(__file__).resolve().parent;T=json.loads((P/'"'"'timeline.json'"'"').read_text()) rows=[];done=0 for sc in T['"'"'scenes'"'"']:     n=f"{sc['"'"'id'"'"']:02d}";d=P/'"'"'render-cache'"'"'/f'"'"'beat-{n}'"'"';src=(P/'"'"'src/beats'"'"'/f'"'"'Beat{n}.tsx'"'"').exists()     appr=(P/'"'"'qa'"'"'/f'"'"'beat-{n}'"'"'/'"'"'approved.json'"'"').exists();comp=(d/'"'"'complete.json'"'"').exists();lock=(d/'"'"'render.lock'"'"').exists()     if comp: done+=1     state='"'"'COMPLETE'"'"' if comp else '"'"'RENDERING (lock)'"'"' if lock else '"'"'approved, not rendered'"'"' if appr else '"'"'authored'"'"' if src else '"'"'not authored'"'"'     rows.append(f"| {sc['"'"'id'"'"']} | {sc['"'"'heading'"'"'][:58]} | {sc['"'"'frames'"'"']} | {len(sc['"'"'cues'"'"'])} | {state} |") master=P/'"'"'3.1.1-2-enzymes.mp4'"'"' live=subprocess.run(['"'"'pgrep'"'"','"'"'-fa'"'"','"'"'render-beat.cjs'"'"'],capture_output=True,text=True).stdout.strip() or '"'"'none'"'"' notes=(P/'"'"'progress-notes.md'"'"').read_text() phase=notes.split('"'"'\n'"'"',1)[0].replace('"'"'PHASE:'"'"','"'"''"'"').strip() out=f"""# 3.1.1-2 Enzymes: where and how they act · BUILD PROGRESS (handover)  Updated {datetime.datetime.utcnow().strftime('"'"'%Y-%m-%d %H:%M'"'"')}Z. Builder: claude-opus-5-5 (cloud run 003). Branch `cloud/003-3.1.1-2` ONLY. **Phase: {phase}** · **Beats complete: {done} / 18** · master: {'"'"'present'"'"' if master.exists() else '"'"'not yet built'"'"'} Live render processes: {live} NOTE: render-cache/ (chunks) and all MP4/WAV are NOT in git — a fresh container must re-render approved beats (`./launch-render.sh N`, 4 at a time); approvals (qa/beat-NN/approved.json) ARE in git and stay valid while the source fingerprint matches.  | Beat | Heading | Frames | Cues | State | |---|---|---|---|---| """ + '"'"'\n'"'"'.join(rows) + '"'"'\n\n'"'"' + notes.split('"'"'\n'"'"',1)[1] (P/'"'"'PROGRESS.md'"'"').write_text(out);print(f'"'"'PROGRESS: {done}/18 complete'"'"') EOF python3 - <<'"'"'EOF'"'"' p=open('"'"'PROGRESS.md'"'"').read() body=p.split('"'"'\n'"'"',3)[3] open('"'"'progress-notes.md'"'"','"'"'w'"'"').write('"'"'PHASE: BEATS — authoring + rendering (1–4 rendered; 5–8 rendering; 9 approved)\n'"'"'+body.replace('"'"'**Phase: TIMELINE COMPLETE → next: shared components + beats (author, qa-beat, look, approve, render).**\n'"'"','"'"''"'"')+'"'"''"'"''"'"' ## Per-beat procedure (exact next steps) 1. Author `src/beats/BeatNN.tsx` (then regenerate `src/beats/index.ts`: the python one-liner in PROGRESS history —    it lists every existing BeatNN.tsx). 2. `node build.cjs && node qa-beat.cjs N && python3 sheet-beat.py N`; LOOK at `qa/beat-NN/sheet-*.jpg`; fix; repeat. 3. `./approve.sh N` then `./launch-render.sh N` (detached, max 4 live). Done when `render-cache/beat-NN/complete.json`    exists. `python3 update_progress.py` refreshes this file. - Editing a shared file (shared/src/*, src/Model|Graph|Scenes|Panels|Chem|Lesson|util) changes EVERY beat'"'"'s fingerprint:   re-run qa-beat + approve for affected beats and re-render (finish.py refuses stale chunks).  ## Components (id scheme) - `shared/src/`: theme.ts (BRAND tokens), Type.tsx (Txt, Lines, Card, Tag, Cite, InkRing, Underline, Arrow, textW from   metrics.json), ErrorMarker.tsx (badge 1410,22 440×56 + terracotta frame; data-error-marker / data-error-label). - `src/Model.tsx`: EnzymeActiveSiteModel — CLEFT_LK (rest-lk) and CLEFT_IF (rest-if, separate asset), cleftAt(mode, close),   Enzyme{x,y,s,mode,close,trace,pulse,backbone,links,stubs}, Substrate{kind gen|wrong|round, dx,dy (seat-relative), rot, ghost},   Products (one-frame switch, then drift), Ticks (dashed temporary bonds), ComplexBracket, Label, ModelTag, pt(). SITE2 +   inhibitor/denatured states are published-not-drawn (L4a/L5). - `src/Graph.tsx`: EnergyGraph (fixed reactant/product levels; brackets ea1, ea2, red), humpPoint. - `src/Chem.tsx`: Beat 9 atom graph (A–D residues; Og, BC1 = "C1", CC4 = Cp, water Ow/Ht/Hr); hydrolyseGraph, auditGraph,   hydrolyseAudit (run on EVERY frame of beat 9 by render-beat.cjs → render-cache/beat-09/valence-audit.json). - `src/Scenes.tsx` (Mouth, Bread, Beads, TongueCells, Cell, RxArrow, RegionTag), `src/Panels.tsx` (QHeader, Written, span,   QuoteTab, quoteSpan, SideNote, Strike, CorrectCard), `src/Lesson.tsx` (router, chrome, ERROR_BEATS {5,11,14: exit cue;   16: fix3 + 18 frames}), `src/beats/Beat04.tsx` exports CellScene (reused by 5 and 17), Beat07 exports Lock.  ## Decisions / interpretations - Error badges: all four COMMON MISTAKE (each diagnosed by an examiner report: ECR Paper 2 p.10 comments D and B, p.54;   June 2024 ER pp.12/15). Marker from each error beat'"'"'s first frame; B5/B11/B14 clear at the storyboard'"'"'s exit cue (end of   the last talk-through word); B16 clears on the frame the LAST correction (ESC → enzyme-substrate complex) completes. - B18 anchored read: storyboard gives "At Read it, five-second anchored read" with no hold line in the narration block;   inserted as 5 s digital silence between "Read it," and "then watch…". Final frame held 2 s (END hold). - Cue normalisation: B10 uses "same finish, a lower hill" (CHECK-R2), B11 "Lowering activation energy is true" (the   storyboard cue occurs twice under case-folding). - Products are a ONE-FRAME outline switch (never a cross-fade), then motion; Beat 1 bead cut likewise. '"'"''"'"''"'"') EOF python3 update_progress.py && cd /home/user/content-engine && git add work/3.1.1-2 && git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -q -m "3.1.1-2: renderer, house-style layer, models, beats 1-9 authored and approved (1-4 rendered)  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com> Claude-Session: https://claude.ai/code/session_01DT9UMK1hgBhPo7UTLeHJga" && git push -q origin cloud/003-3.1.1-2 2>&1 | tail -1; git log --oneline -1; git show --stat HEAD | tail -3' && pwd -P >| /tmp/claude-66e1-cwd
4924 node render-beat.cjs 5
4936 node render-beat.cjs 6
4948 node render-beat.cjs 7
4962 node render-beat.cjs 8
NOTE: render-cache/ (chunks) and all MP4/WAV are NOT in git — a fresh container must re-render approved beats
(`./launch-render.sh N`, 4 at a time); approvals (qa/beat-NN/approved.json) ARE in git and stay valid while the
source fingerprint matches.

| Beat | Heading | Frames | Cues | State |
|---|---|---|---|---|
| 1 | Hook and context · 0:00–0:38 | 1166 | 12 | COMPLETE |
| 2 | What you will be able to do · 0:38–1:05 | 885 | 11 | COMPLETE |
| 3 | A globular protein, and a catalyst · 1:05–1:50 | 963 | 9 | COMPLETE |
| 4 | Inside the cell, or secreted to work outside · 1:50–2:38 | 1265 | 12 | COMPLETE |
| 5 | COMMON MISTAKE E32: the wrong prefix · 2:38–3:35 | 2198 | 13 | approved, not rendered |
| 6 | The fold, and the active site · 3:35–4:12 | 953 | 10 | approved, not rendered |
| 7 | Specificity: complementary, not the same shape · 4:12–4:58 | 1347 | 13 | approved, not rendered |
| 8 | Held in place: the enzyme–substrate complex · 4:58–5:32 | 917 | 10 | approved, not rendered |
| 9 | Inside the complex: the reaction, and the enzyme goes agai | 1608 | 15 | approved, not rendered |
| 10 | Why it is faster: activation energy · 6:40–7:40 | 1554 | 16 | not authored |
| 11 | COMMON MISTAKE E35: the sentence that answers every questi | 3096 | 17 | not authored |
| 12 | The lock-and-key hypothesis · 8:45–9:25 | 1349 | 12 | not authored |
| 13 | The induced-fit hypothesis · 9:25–10:10 | 1353 | 13 | not authored |
| 14 | COMMON MISTAKE E33: two names glued together · 10:10–11:05 | 1747 | 12 | not authored |
| 15 | The sentence you write · 11:05–11:35 | 793 | 8 | not authored |
| 16 | COMMON MISTAKE E34: the labels on the drawing · 11:50–13:0 | 2535 | 17 | not authored |
| 17 | What I told you, read off the model · 13:05–13:50 | 1569 | 12 | not authored |
| 18 | How it is asked, with the real question on screen · 13:50– | 1676 | 12 | not authored |


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
