# Direct Collisions — machine B authoring verification

Status: **authored and checked; awaiting preview rendering/review on A**. No Remotion render, npm install, deployment, or final video was performed on B.

## Passed

- All 211 integer-second source samples and source PDF pages 4–7 were inspected; the official syllabus p32 excerpt and coalescence scope were checked. See `SOURCE-STUDY.md` and `verify-source-report.json`.
- Exact independent arithmetic: initial total momentum 5 kg m/s; trial1 B velocity +3 m/s; independent sticking trial common velocity +1 m/s.
- Existing TypeScript tooling typechecked the composition, standalone entry, shared helpers and transcript import without emitting code or changing dependency trees.
- Actual motion helper: 1,602 position samples and 481 hold-clock samples; no overlap, correct signed velocities, constant sticking contact, continuous positions at impact and correct conserved momentum.
- All 11 handwritten lines use existing shared glyphs and nonempty stroke geometry. Both worked scenes retain a words line and general symbol line before substitution.
- Transcript: 567 genuine Whisper words, 49 exact word cues, 26 figure events. Forty-two local raw Whisper beat records match their excerpt hashes and exact timestamp offsets. No estimated or fabricated word timings.
- The actual `useCue` function passed 147 boundary checks. The unknown-to-result gates first activate at s05 scene frame1683 and s06 frame1546. The exported duration function returns9075 frames at30fps.
- All seven MP3s match recorded SHA256s and durations, decode fully at their native 44.1kHz mono rate, and contain no clipped samples. All seven inserted holds total15s and have zero peak/RMS in their interiors after an80ms MP3 edge exclusion.
- Static source review fixed partial covering of B's short before arrowhead, force arrows crossing particle letters, snapshot-to-motion position jumps, a contradictory external-push condition label, the closing question wording, and four repeated-source-value rings.

Machine-readable evidence: `verify-authoring.json` and `verify-narration.json`. Reports state their methods and limitations; no browser or Remotion frame was generated.

## Pending on machine A

- Register the parent-owned Root/registry/syllabus/notes mappings.
- Inspect actual full-resolution setup, ink, value rings and before/after result frames; validate region/text/shape extents in the browser.
- Render and review the preview with Durai. The MP4 preview path does not exist on B by design.
- Run the NotesMarkdown/KaTeX runtime check and the parent integration checks.
- After preview approval only, perform any final-render and encoded media verification required by the parent workflow.

The tracked delivery includes the composition/entry/helper, narration source and generator, seven audio files, word transcript/cue map, learner notes, source study, storyboard and verification scripts/reports. The seeded briefs and unrelated project-map modifications were not committed by this builder. No paths were deleted.
