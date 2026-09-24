# REPORT — cloud run 004-3.2.2-3 · Vmax, Km and inhibitors on the graph

**Model:** claude-opus-5-5 (`get_session`: configured = last served). `CLAUDE_CODE_REMOTE=true`. 4 vCPU. Branch `cloud/004-3.2.2-3` only; no MP4/WAV in git; no key header sent.

## Phases (UTC, 24 Sep 2026)
| Phase | Clock | Time |
|---|---|---|
| Setup, installs, reading (storyboard, checks, standards, plan, L1 spec, reference) | 11:31–11:35 | 4 min |
| Audio: 17 takes + B9 regen, Whisper transcripts, review | 11:35–11:44 | 9 min |
| Holds + cue plan + timeline (checkpoint pushed 11:48) | 11:44–11:48 | 4 min |
| Shared components, RateGraph, EnzymeActiveSiteModel, 17 beats authored/LOOKED/approved/rendered | 11:48–12:10 | 22 min |
| Bookends (Remotion 4.0.365) | 12:10–12:12 | 2 min |
| Re-render of beats 1–11 made stale by shared-code edits | 12:13–12:21 | 8 min |
| finish + verify + 16 contact sheets; B11 fix; re-finish, re-verify, re-sheets | 12:21–12:31 | 10 min |
| Branding (apply-branding-cloud.sh) + branded checks | 12:31–12:45 | 14 min |
| Bunny create + upload (3.4 s) → status 4 | 12:45–BUNNY_DONE | BUNNY_WAIT |

## Audio
ElevenLabs Thandi `BcpjRWrYhDBHmOnetmBl`, `eleven_multilingual_v2`, speed 1.0, one MP3 per beat, no time-stretch.
**Characters (`GET /v1/user`): 231,267 → 237,993 = 6,726 used** (17 beats, one B9 regeneration, two short probes).
Pronunciation fixes, request text only (every diff in `qa/audio-review.md`): `Km` → "K M" in all beats. A probe showed the bare
token voiced as a word ("Kamihamj", "Kynum"). `Vmax` → "V max" in **B9 only**, regenerated once, because the first take's "Km with
Vmax" came out as "Weimags" (Whisper small and medium.en agree). Michaelis–Menten, competitive, non-competitive and substrate
concentration all transcribed correctly. **Worth a listen by ear:** B16 "a row for the effect" (heard "role" by both models), and the "K M" letters.

## Deliverables
- **Master** `3.2.2-3-vmax-km-inhibitors.mp4`: **903.967 s** (15:03.97), 27,119 frames, 1080p30.
  sha256 `fe29ad5cb287c80b5e3aa1d153b5b6195e43aeda0ac789fe8f51171c8de877c7`
- **Branded** `…-BRANDED.mp4`: **914.996 s** (= master + 11.029 s).
  sha256 `52da90bee9e994b055975d003b56d9f7a3bd53265f5e3bf7c93753ea565a6cb3`
- **Bunny** lib 758254, **guid `d2571913-2ef8-4046-b7e4-4ddac6062802`**, "REVIEW 3.2.2-3 …", no collection; HTTP 200; **status 4 at BUNNY_T4**.

## Verification (standard order; `qa/verification.json`, re-run on the final master)
1 ffprobe duration 903.967 s · 2 video 903.967 ≥ encoded audio 902.966 (1.0 s tail) · 3 full decode, 0 errors ·
4 cues matched **201/201** (unique within each beat, in narration order) · 5 AAC packets identical (42,328) · 6 final word "graph."
ends 899.84 s, 3.13 s headroom · 7 silent reads (B6, B9, B13 4 s; B17 5 s anchored + 2 s end hold) are all-zero PCM, −91 dB encoded;
speech PCM byte-identical to the takes · 8 boundary audit: 16 boundaries, **0** one-frame-hold candidates.
**Marker audit, every frame:** 7,605 marked frames (B6, B9, B13), 19,514 unmarked, **0 mismatches**. Every marked badge matches
COMMON MISTAKE (MAE ≤ 3.68) and not EXAM CONTRAST (MAE ≥ 18.85). Longest unchanged visual 11.87 s (B9 opening); none over 15 s.
Valence audit: not applicable. No covalent change is drawn; the B11 products state is symbolic and switches in one frame.
Branded: duration as expected, full decode 0 errors, mid-lesson frame shows the lesson in the cream frame with the title bar
(`qa/branded-mid.jpg`). Bookend late frames read exactly "Vmax, Km and inhibitors on the graph" (`qa/bookend-*-late.jpg`).

## What the sheets showed, and fixes
Every beat was LOOKED at before approval (`qa/beat-NN/sheet-*.jpg`). Fixed there:
- B9: the strike stayed on the corrected lines.
- B14: librsvg dropped spaces at `tspan` joins ("soVmax"); fixed with measured text runs.
- B11/B12: graph labels crowded and the second-site label collided with the model caption.
- B17: the flashed competitive curve did not visibly merge.
- B3: an invented "supplied" value was removed.
- B13: the recall miniature spilled out of its card.
- B4: underlines were misplaced; fixed by measuring glyph widths from the font.

All 16 encoded sheets (`qa/encoded-sheets/`) were then inspected. They showed one defect: in B11 the blocked substrate covered the "active site" label.
Fixed by moving the label (one beat re-rendered), then re-finished, re-verified and re-sheeted. Previous master kept as `…-SUPERSEDED-b11-label.mp4`.

## Design choices
1. House chrome copied from 2.1.1. Its missing shared files were rebuilt from the Stem 4 Life tokens; the terracotta primary is exactly the badge colour verify.py probes.
2. Correct construction is teal, error is terracotta. Every half-Vmax point is locked on the curve (v = Vmax·tanh(atanh½·S/Km)). Each curve gets its own construction.
3. The enzyme model follows the L1 spec. Substrate and inhibitors are generated from the notches they fit; the non-competitive change is a 0.6 s reversible cleft reshape.

## Interpretation needed
- Beats 1 and 10: the inhibitor's site is deliberately unspecified, so it is drawn as a generic blob on the enzyme's surface.
- All three error beats badge COMMON MISTAKE: an examiner report diagnoses each.
- Beat 16 row tags (P1/P2/P3/P5) are the papers' components.
- The Topic 2 `shared/src` files were absent from the inputs. Rebuilt, recorded in `qa/decisions.md`.
- Narration runs 15:04 against the 13:45 budget: the checks accepted this error-driven overrun, and nothing was cut or sped up.
- Environment: brand fonts instanced to static Source Sans 3. Node deps pinned: react/react-dom 19.2.0, esbuild 0.25.10, sharp 0.33.5,
  remotion/@remotion/bundler/@remotion/renderer 4.0.365, zod 3.22.3.
