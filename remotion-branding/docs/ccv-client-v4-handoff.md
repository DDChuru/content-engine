# CCV Client V4 Review Handoff

**Status:** the historical v4 is intact at `output/ccv-refresh/ccv-refresh-client-v4.mp4`, SHA-256 `3d8a3c9c8ba7b58697844e8b2a60e484fbaee83e1ca6b94fab862736fd211357`.

> **V5 current-source correction (2026-09-06):** the replacement Beat 04 capture comes from `origin/dev` at exact mobile commit `6999d8eca52fc4f4fff69066dce365f54a609663`, checked out in the isolated worktree `/home/durai/Documents/projects/react-native/e-wizer-mobile-capture-dev` and run through the current development client with Metro. This source contains the required batch / lot UI and sends `batchNumber`. The v4 MP4 and its historical review stills remain unchanged.
>
> **Rejected offline v5:** the prior 40,770,773-byte render is quarantined as `output/ccv-refresh/ccv-refresh-client-v5-rejected-offline.mp4`, SHA-256 `3ae3aa224019f84291ec15bbc236a47ca30f1e49f211545d8f18884325493d8f`. Its historical validation was 1920×1080 / 30 fps, 11,559 H.264 High frames, AAC-LC 48 kHz stereo, and 385.344 seconds, but its offline capture is rejected and it is not canonical.
> The rejected attempt came from the stale July checkout `/home/durai/Documents/projects/react-native/e-wizer-mobile` (`main` at `c1820fe`). Request ID `44c2641472fa1ded` failed with exactly `Batch / lot number is required.` This stale-client failure is not evidence about the current-source capture.
>
> **Canonical v5:** `output/ccv-refresh/ccv-refresh-client-v5.mp4`, 41,077,756 bytes, SHA-256 `000581dbc02bb57fb085ee9a0c1a599c8433e8bdf9fb76f8c096cbc76ab67347`. It is H.264 High / yuvj420p at 1920×1080, 30 fps, and 11,559 video frames, with AAC-LC 48 kHz stereo audio and a 385.344-second container duration. Full ffmpeg video-and-audio decode completed with exit 0.

> **Next capture environment (current as of 2026-09-06):** `e_wizer_api36` is currently down. The current-source capture worktree remains clean at exact commit `6999d8eca52fc4f4fff69066dce365f54a609663`. Cleaning Verification must cold-start `emulator-5554`, restore the adb reverse for `tcp:8081`, start Metro from `/home/durai/Documents/projects/react-native/e-wizer-mobile-capture-dev`, and re-authenticate and sync Bakery Demo. The successful CCV dialog state is not preserved on-device; its evidence is the hashed asset `public/ccv-refresh/hunt/bakery-demo/13-current-6999d8e-eco-san-sh12-normal-online-success-dialog.png` on disk (SHA-256 `4c0d22043801d677e1db1b2e6cad3b77452db6dab4c08e621f844f22b09da020`).

**Project:** `/home/durai/Documents/projects/content-engine/remotion-branding`

**Canonical copy:** `src/ccv2/narration.json`

**Measured timing:** `src/ccv2/timing.json` — 12 active beats, 374.291 seconds / 11,229 frames at 30 fps. The branded composition is 11,559 frames / 385.3 seconds with the existing intro and outro.

## Exact Revised Scripts

### 01-hook

Food safety starts with effective cleaning. Detergent at the right strength helps remove food residues and biofilm. On the cleaned surface, sanitiser is then used for the required kill step, at the approved concentration and contact time. Chemical concentration verification — CCV — checks that each solution is within its approved range.

### 04-issue

Issuing starts with the plus. Pick the station. Then complete the form: the batch or lot number, the scope, issue type and quantities. For manual dilution, enter both chemical and water; the app calculates the percentage against the approved range. Record the issue. For a manual dilution, normally choose Verify now. Verify later leaves the check pending. For satellites and dosing stations, you can return to verification later. On the Chemical hub, open Awaiting verification. It includes issues from earlier days. Find the issue and tap Verify to continue its check.

### 05-standard

Now verification. The approved range is already waiting — nought point three to two percent — and the selected method is titration drops. The operator does not choose either. Tap How to test. The reagents are listed. The procedure is step by step. The calculation is drops times nought point nought nine five. Follow the work instruction. For this method, enter both the drop count and the percentage it gives.

### 08-inspec

Most days it is this simple. Follow the drop procedure and enter twenty drops. Enter the reading — one point nine percent. In spec. The verdict is the entered reading against the approved range, not the operator's opinion. Record it, and that dosing point is verified for the cadence.

### 09-outofspec

Forty drops. Three point eight percent. Out of spec. Two things appear, and both are required before recording: corrective action and a re-test reading. In What you did, record the action taken. Then repeat the method: enter twenty drops and one point nine percent. If the re-test passes, the record keeps both the miss and the recovery. That is the second pair of eyes doing its job.

The other active scripts — 02, 03, 07, and 10 through 13 — are preserved. `narration.json` and `timing.json` contain identical text for all 12 active beats.

## Narration Regeneration And Timing

Only the review-affected clips 04, 05, and 08 were regenerated in this correction pass. The existing voice and settings were preserved:

- Voice ID: `gYWKdgLtqjPO3D5uDrDP`
- Model: `eleven_multilingual_v2`
- Stability: `0.55`
- Similarity boost: `0.8`
- Style: `0.35`
- Speaker boost: enabled

Measured source durations:

| Clip | Duration | SHA-256 |
| --- | ---: | --- |
| `public/ccv2/audio/04-04-issue.mp3` | 46.837551 s | `2bdf7b0a0a6f03f3771d9c07da7b4dd99c5a0c5958fd423070732414955adf78` |
| `public/ccv2/audio/05-05-standard.mp3` | 32.731429 s | `b955e1c5dad4bd7050e4f4dcbd13c3ed5819641e776829707518ccd75c6ee554` |
| `public/ccv2/audio/08-08-inspec.mp3` | 22.569796 s | `5dd66bc5590bb5ded40408e51a4d0197540744cc839c11691f2fde5a967c37d5` |

Clips 01 and 09 had already been regenerated for the consolidated Daniel revision before this review-fix pass. All other active narration clips were retained. Timing was rebuilt from the measured MP3 durations with the established 0.6-second lead, 0.95-second inter-beat gap, and 2.15-second tail.

Narration remains the tutorial audio spine. The music bed remains under the intro and outro bookends only.

## Capture And Illustration Provenance

The original v4 form-state captures were made client-side in the existing safe Android emulator session (`emulator-5554`, SHEQ demo context). No Complete verification, Record, Record and Escalate, submission, or other production-writing action was pressed during that v4 capture pass.

The canonical-v5 replacement sequence was captured from Bakery Demo using `demo@sunbakebread.co.za` on the current development client/Metro session. It records station `ECO-SAN SH12` (`t570cnk57a27y28q0sgg82r25n89kjvy`), batch / lot `LOT-20250905`, Entire factory, manual dilution, `1 L` chemical plus `50 L` water, computed `2.0%`, and approved range `0.5–5.0%` in range. The normal-online write and master sync were validated. The untouched success dialog reads `Manual issue recorded` and `The dilution issue is logged. Verify now, or leave it pending for later.`, with `VERIFY LATER` and `VERIFY NOW`; neither action was pressed.

| Asset | Provenance and state |
| --- | --- |
| `public/ccv2/shots/ccv-04.png` | Historical v4 blank issue-form base with composed batch/lot and quantities. Retained for the v4 proof composition only; canonical v5 Beat 04 does not use it. |
| `public/ccv-refresh/hunt/bakery-demo/10-current-6999d8e-eco-san-sh12-form-unfilled.png` | Current-source unfilled form for `ECO-SAN SH12`. SHA-256 `804ffc37294287c3d7eac1e85ae1b9c0ff5cecabb0b5c3e4cbd6f29b6e4d9b58`. |
| `public/ccv-refresh/hunt/bakery-demo/11-current-6999d8e-eco-san-sh12-filled-top.png` | Current-source form showing `LOT-20250905`, Entire factory, manual dilution, `1 L` chemical, and `50 L` water. SHA-256 `6ac5743b3a7f50361dbc66d4057cd1b1d0378e25cfee340ec989aa67b4b91e1b`. |
| `public/ccv-refresh/hunt/bakery-demo/12-current-6999d8e-eco-san-sh12-filled-computed.png` | Current-source computed state showing `2.0%` and approved `0.5–5.0% · in range`. SHA-256 `37ab6c496864019517c3bacf88e929eb63b4b8ad8e36cbee47275d630f559f72`. |
| `public/ccv-refresh/hunt/bakery-demo/13-current-6999d8e-eco-san-sh12-normal-online-success-dialog.png` | Current-source, normal-online success dialog with no error toast. `VERIFY LATER` and `VERIFY NOW` remain untouched. SHA-256 `4c0d22043801d677e1db1b2e6cad3b77452db6dab4c08e621f844f22b09da020`. |
| `public/ccv-refresh/hunt/bakery-demo/03-manual-dilution-post-issue-verify-now-later-real.png` | Historical rejected offline capture from the stale workflow. Quarantined; not canonical v5 source material. SHA-256 `a239e5df1b77d2251f8e419753036182bb09fcba226ec7a24f5846360bdf32f4`. |
| `public/ccv-refresh/hunt/bakery-demo/09-rejected-attempt-a-eco-san-sh12-saved-offline.png` | Historical rejected `Saved offline` attempt. Quarantined; not canonical v5 source material. SHA-256 `5402ed8fe78573b643675bdee2400f5ad430a7746d0469e1bc3cbeb84e70495a`. |
| `public/ccv2/shots/ccv-04c-awaiting.png` | Genuine current-build Brito's Chemical hub capture showing Awaiting verification, including earlier-day issues and a Verify action. This is a separate existing pending-check example. |
| `public/ccv2/shots/ccv-04d-pending-verify.png` | Genuine destination after opening that separate Brito's ECO-CLEAN FA15 pending check. It is a conductivity-method screen; Beat 04 deliberately shows only the destination header/issue/range crop and excludes the baseline card. It is not the destination of the composed Sandrox manual example. |
| `public/ccv2/shots/ccv-05.png` | Genuine unsaved intermediate client-side state: 20 drops entered, percentage empty, no verdict. SHA-256 `8f00edd62046e7a3e6c48b06cfb71bd88781b194a0817abde38e94671cea31ab`. |
| `public/ccv2/shots/ccv-05b-sheet.png` | Genuine How to test sheet showing reagents, procedure, and `Drops × 0.095` calculation. |
| `public/ccv2/shots/ccv-08.png` | Genuine unsaved live verdict: 20 drops, 1.9%, IN SPEC. `20 × 0.095 = 1.9`. |
| `public/ccv2/shots/ccv-09.png` | Genuine unsaved live verdict: 40 drops, 3.8%, OUT OF SPEC. `40 × 0.095 = 3.8`. |
| `public/ccv2/shots/ccv-09b-retest.png` | Genuine unsaved client-side state with corrective action `Re-mixed dilution`, then a passing re-test of 20 drops / 1.9%. |
| `public/ccv2/shots/ccv-10.png` | Genuine unsaved client-side failed re-test state: 60 drops / 5.7%, with escalation UI visible. No escalation was submitted. |

The removed no-spec anomaly beat has no active narration, timing, shot, ring, zoom, lock, or composed-state reference. Its original media remains intentionally retained and unused for Daniel's later site investigation:

- `public/ccv2/audio/06-06-lock.mp3`
- `public/ccv2/shots/ccv-06.png`

## Historical V4 Selected Review Stills

Historical v4 review directory: `/home/durai/Documents/projects/content-engine/remotion-branding/output/ccv-refresh/verify-v4-review-fixes`

Superseded directory, retained but not for review: `/home/durai/Documents/projects/content-engine/remotion-branding/output/ccv-refresh/verify-v4-stills`

- `verify-opening-clean.png`
- `verify-opening-complete.png`
- `verify-issuing-manual-dialog-composed.png`
- `verify-awaiting-route-real.png`
- `verify-pending-destination-crop-real.png`
- `verify-method-intermediate.png`
- `verify-method-sheet.png`
- `verify-in-spec-live.png`
- `verify-out-of-spec-live.png`
- `verify-corrective-action.png`
- `verify-retest-pass.png`
- `verify-illustration-provenance.png`

Every selected still is 1920×1080. The issuing still labels the manual dialog as composed; the route still labels the Brito's example as separate and real; the pending-destination crop excludes premature conductivity-baseline teaching; and the method/pass/fail/re-test stills show the required fields and actual entered values.

Formal-review correction: Beat 04 now uses an 18px information-band top margin, 176px reserved panel height, and 4px pre-zoom gap. This moves both route zoom cards approximately 60px upward so they end around y=945, clear of the footer at y=984, without changing any other beat.

## Verification And Limits

- Standalone `src/index-ccv2.ts` composition discovery passes for `CcvRefresh`, `CcvRefreshBranded`, and `Ccv2ComposeProof`.
- Narration and timing text are identical for all 12 active beats.
- Cue anchors used by the revised shot, ring, zoom, and panel plans resolve exactly, including `Enter the reading`, `In spec.`, `What you did`, and `Then repeat the method`.
- The stale issue-event implementation narration, optional drop-entry coaching, `Captured.`, and removed Beat 06 active references are absent.
- The earlier client V3 is preserved at `/home/durai/Documents/projects/content-engine/remotion-branding/output/ccv-refresh/ccv-refresh-client-v3.mp4`, SHA-256 `fd796ef5dbc0808a453c0e691c55bbb8818b14c8128a9f5fa034c98f2accec06`.
- The historical `output/ccv-refresh/ccv-refresh-client-v4.mp4` remains intact and was not re-rendered in this pass; SHA-256 `3d8a3c9c8ba7b58697844e8b2a60e484fbaee83e1ca6b94fab862736fd211357`.
- The canonical `output/ccv-refresh/ccv-refresh-client-v5.mp4` is 41,077,756 bytes, SHA-256 `000581dbc02bb57fb085ee9a0c1a599c8433e8bdf9fb76f8c096cbc76ab67347`; its full ffmpeg video-and-audio decode exited 0.
- Encoded v5 checkpoints at frames 3,050, 3,141, 3,470, 3,595, 3,747, 4,026, and 4,090 prove the matching ECO-SAN SH12 record and values, exact normal-online wording, both untouched verification buttons, absence of an error toast, and a legible transition to the explicitly labelled separate Brito's pending-check example.
- Repository-wide TypeScript checking has known unrelated IINM/Root errors outside this standalone CCV entrypoint; those were not changed or suppressed.
- The current-source capture created only the authorized Bakery Demo issue used to validate normal-online/master sync. No app or backend logic was changed, and nothing was committed, pushed, published, deployed, mailed, or sent to shared docs.

## Files Changed For The Consolidated Revision

- `src/ccv2/narration.json`
- `src/ccv2/timing.json`
- `src/ccv2/boxes.json`
- `src/ccv2/CcvRefresh.tsx`
- `public/ccv2/audio/01-01-hook.mp3`
- `public/ccv2/audio/04-04-issue.mp3`
- `public/ccv2/audio/05-05-standard.mp3`
- `public/ccv2/audio/08-08-inspec.mp3`
- `public/ccv2/audio/09-09-outofspec.mp3`
- `public/ccv2/shots/ccv-04c-awaiting.png`
- `public/ccv2/shots/ccv-04d-pending-verify.png`
- `public/ccv2/shots/ccv-05.png`
- `public/ccv2/shots/ccv-08.png`
- `public/ccv2/shots/ccv-09.png`
- `public/ccv2/shots/ccv-09b-retest.png`
- `public/ccv2/shots/ccv-10.png`
- `docs/ccv-client-v4-handoff.md`
- Selected stills under `output/ccv-refresh/verify-v4-review-fixes/`

No paths were deleted.
