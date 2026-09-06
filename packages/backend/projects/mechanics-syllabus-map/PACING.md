# Pacing standard for explainers (from Durai's review, 2026-09-06)

The first six mechanics videos are correct but read as one brisk tempo: every scene 15–20 s, short even
sentences, a new element every few seconds. Durai: "ticky-ticky and not really explanatory". Fix it
upstream, in the storyboard and narration, not in the render.

## Two tempos in every video

| Tempo | Use for | Scene length | Narration style | Visual rhythm |
|---|---|---|---|---|
| **Brisk** | definitions, contrasts, recap | 12–20 s | short sentences, one idea each | cue every 3–5 s |
| **Slow** | worked examples, the "why" | 45–75 s | full sentences, explicit pauses, a question before the answer | one element at a time, a 2 s hold after each key number, emphasis ring on the result |

Six to eight scenes per video, not ten to eleven. At least ONE slow scene, ideally two: a worked example
and a "why it matters / what the examiner wants" beat.

## Writing the narration for pace

- Write pauses. Use full stops and an ellipsis for a breath: "So... what does the gradient tell us here?"
- Ask before you answer: pose the question, hold, then give the number.
- Say the number, then say what it means, then hold. "Twenty-four metres. That is the whole route, both legs.
  Not where she ended up."
- Slow scenes get a slower ElevenLabs delivery: pass `voice_settings.speed = 0.9` (turbo v2.5 supports it)
  for example scenes; keep 1.0 for brisk scenes.
- Cue keywords in slow scenes are sparse: 2–3 per scene, spaced by at least 8 s.

## Visual rules for slow scenes

- After a cue lands a key value, hold: nothing new for ~2 s (60 frames). Add an emphasis ring or underline
  on the value during the hold.
- Build working line by line. Prefer the ink tutor's hand-drawn strokes at pen pace for the worked example
  (see apps/student-learn/briefs/INK-WORKFLOW.md and InkTutorTikTok.tsx for the stroke player): a hand writing
  is naturally slow and explanatory. A 16:9 explainer can embed the paper as a panel beside the diagram.
- No new panel, card or diagram may appear during a hold.

## Checklist before building

- [ ] ≥1 slow scene of 45–75 s with a hold after each key number
- [ ] narration has written pauses and a posed question before the answer
- [ ] slow scenes flagged in the storyboard with `tempo: slow` so the builder applies speed 0.9 and holds
- [ ] total 3–4 min still; fewer, longer scenes
