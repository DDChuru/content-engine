# Remedial Action candidate v3 — closing existing remedials

Daniel explicitly approved the conductor's closing-only edit proposal. This revision resumes the reviewed v2 candidate (MP4 SHA-256 `212664f0c8ebf6587cf292f2df372c5348a2dbb670a8edbbe293a0f7eb034bdc`, source checkpoint `2b934d5`) without new captures, application changes, emulator actions or data mutations. V3 is pending Claude-4 review; the proposal approval is not final approval of this encoded artifact. Original final guards and inventory approval fields remain unchanged.

## Sequence changes

Before: Home banner → Bill of Health → Daily Cleaning backlog (`two-outcomes`) → creation form/acknowledgement (`finding-origin`) → Cleaning filter → existing finding → recheck/confirm → queue removal → Daily summary/closed record → audit → Critical creation acknowledgement → carryover distinction → Inspection creation/local save/complete → Inspection queue → review/accept/reject/NCR/history.

After: Home banner → Bill of Health → Cleaning filter → existing Blue Covers finding and short bridge → recheck/confirm → queue removal → closed record → audit → carryover distinction → existing Inspection queue → age/review/accept/reject/NCR/history.

The bridge is spoken over the authentic existing open finding: “The failed check is already recorded. The remedial remains open until the correction is verified.” The remaining narration identifies the existing Blue Covers finding before checking its correction. The Inspection entry now directly opens existing findings through Bill of Health, Follow-ups and Open verify flow. Acceptance, rejection, deliberate NCR escalation, age/carryover and decision history remain.

The `two-outcomes`, `finding-origin`, `inspection-capture` and separate `critical-handoff` creation-example beats are omitted from this candidate. The later Daily resolved-summary cue is also omitted. Both closed-record beats show only the genuine registered Resolved today / Blue Covers record crop; the Daily Verification backlog surrounding it is never displayed. The original screenshots and proofs are retained and still hash-checked internally. The ending says Review the finding, Verify the correction, Preserve the trail.

## Narration, presentation and evidence

Only `open-card` and `resolved` narration were regenerated with the established voice/settings. Fifteen selected clips are byte-identical to v2. The master, measured transcript and cue-alignment files use the `-v3` suffix. The timeline contains 19 scenes, 17 spoken clips and 9,701 frames at 30 fps: 323.366667 seconds (5:23.37), 73.066667 seconds shorter than v2. Ten operational screenshot switches use retained measured word timestamps.

Home remains the primary entry, Bill of Health the second. The amber 300 × 56 SIMULATION badge stays outside the app/content with 28-pixel top/right margins on every instructional scene. Series branding and music are retained. The video does not narrate setup, source/runtime auditing, production explanations or invented ageing. Same-day evidence retains the real `today` badge; carryover is an operating instruction, not a claim that elapsed days were filmed. Each finding has its own decision; rejection remains open and linked NCRs continue separately.

The candidate coverage contract drops creation-only requirements while the original wave-1 contract, source/site/evidence hashes and state proofs remain unchanged. Regression fixtures reject the removed scenes, creation/backlog screenshots, missing existing-finding bridge and creation instructions. The resolved-record crop must remain registered, and browser checks prohibit a full Daily phone screen in the resolved/audit scenes.

## Verification and local reproduction

`out/remedial-action-candidate-v3/` holds the baseline preservation hashes, v2 source snapshot, narration receipts/change list, preflight, representative stills, browser layout checks, encoded checks and final handoff. TypeScript and the original 15 validation groups pass. Candidate preflight passes 29 negative fixtures and validates all timeline frames, 17 selected recordings and ten measured cue anchors. Representative existing-finding, resolved-record and Inspection queue stills were inspected before the long render.

The completed output is `out/remedial-action-candidate-v3/remedial-action-review-candidate-v3-audio-aligned.mp4`: 23,889,329 bytes, SHA-256 `de7879f8cd5e2bf9c7e39e3676956d276d20827b6401ffea365a0d06560b28cf`. The raw encode is retained separately. The existing AAC pipeline applies the established 2048-sample advance by lossless remux to the separate aligned file. All 17 encoded/master zero-lag correlations pass (minimum 0.99997105), verifying the correction. The H.264/AAC file has exactly 9,701 video frames at 1920 × 1080/30. Full audio/video decoding reports no errors. All 44 representative encoded frame comparisons pass (maximum mean pixel difference 2.038/255), as do 20 boundary frames around ten measured cues and all 42 instructional badge samples. Both music bookends are present. The full encoded-video black-gap scan finds no black intervals. Integrated loudness is −19.1 LUFS; true peak is −1.6 dBFS. Encoded existing-finding, resolved-record and Inspection-entry frames were visually inspected. These results are technical QA, not final editorial approval.

Reproduction requires retained local ignored audio/music/font assets and the established environment. This is not a standalone render checkout. No commits, publication, playback switches, inventory approval changes, deletion of old proofs, or edits to Cleaning V4/CCV/BoH are authorized or performed in this wave.

## Subsequent review and authorized dev checkpoint — 2026-09-07

**Claude APPROVE: no blocking defects; non-blocking findings recorded.** The conductor reported Claude-4's final v3 review for the exact MP4 SHA-256 `de7879f8cd5e2bf9c7e39e3676956d276d20827b6401ffea365a0d06560b28cf`. This supersedes the pending Claude-4 review status recorded above. Human approval of the final artifact remains pending. The non-blocking findings remain with the independent review; no source changes are inferred from them. Manifest approval fields, original final guards and inventory sign-off remain unchanged.

The conductor subsequently authorized a dev-only source/evidence checkpoint. It contains 13 paths from the 19-path v3 allowlist: six source/verifier files, six selected new narration provenance/transcript/cue JSON files, and this document. Three MP3/WAV files and three session scratch helpers are excluded, as are all output media and local symlinks. The 12 source/evidence files remain byte-identical to the reviewed candidate; this section is the only additive documentation change. Validation uses retained local asset/dependency links, so this checkpoint is not a standalone render clone. No main/master promotion, playback switch, application/data change or inventory approval is included.
