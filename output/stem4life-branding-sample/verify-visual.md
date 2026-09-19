# Visual and technical checks

- Inspected `output/stem4life-inflight-branding/comparison.png` without edits.
- Extracted and viewed the current wrapped SI-units lesson at 0.7s, 2.4s, 4.2s,
  the first/last body seconds, and three positions in the six-second outro.
- Viewed the worked-question render at 15s: navy surround, warm paper, peach
  brand accent, strong title hierarchy. Viewed direct collisions at 40s to
  check the different charcoal/green palette against the navy/cyan SI-units body.
- Inspected the new intro/outro design stills before encoding. One complete
  sample was then rendered, with one browser render worker, using copied body
  streams. There was no full-lesson render or second sample.
- Extracted the final encoded MP4's intro at 0.7s, 2.5s and frame 149; the first,
  middle and last body frames; and the outro at 0.7s, 2.4s and frame 179.
  Viewed the contact sheet and the full-size settled intro and final outro.
  Title, wordmark, subtitle and URL are legible and unclipped. The intro and
  end card share their palette and layout. The hard cuts to/from the differently
  coloured body are intentional; no colour blend covers lesson pixels.
- TypeScript passed for the focused Stem 4 Life project. Importing the apply
  script's helpers was checked to perform no batch execution. `git diff --check`
  passed. Embedded player JavaScript syntax and local asset references checked.
- `verify-body.json`: all 5,607 decoded RGB24 body frames match; complete
  186.922667-second decoded stereo PCM matches; output contains 5,937 frames;
  duration 197.922656 seconds; expected-duration delta −0.000011 seconds;
  full decode passed; stream parameters/codec configuration match; concat
  warning-free; bookend music and silent seam tails passed; input hashes
  unchanged before/after.
- Browser access to the local file URL was blocked by the browser tool's URL
  policy. No workaround was attempted. The HTML player's responsive layout,
  interactive chapter jumps and framed fullscreen remain **unverified in a
  live browser**. The MP4 itself and its extracted frames were verified directly.
