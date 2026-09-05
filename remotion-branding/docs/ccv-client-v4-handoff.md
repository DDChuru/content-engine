# CCV Client V4 Review Handoff

**Status:** the Beat 04 footer-clearance correction is applied and its two review stills are refreshed; no full MP4 has been rendered. The full `client-v4.mp4` render remains gated on formal review.

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

All new form-state captures were made client-side in the existing safe Android emulator session (`emulator-5554`, SHEQ demo context). No Complete verification, Record, Record and Escalate, submission, or other production-writing action was pressed.

| Asset | Provenance and state |
| --- | --- |
| `public/ccv2/shots/ccv-04.png` | Genuine blank issue-form capture used as the base. Batch/lot `LOT-20250905`, chemical `1`, and water `50` are composed values. The calculated 2.0% explanatory panel is composed. No issue was recorded. |
| Beat 04 manual completion panel | Explicitly labeled composed illustration. It shows the manual-dilution-only Verify later / Verify now choice because safely capturing that dialog would require recording an issue. |
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

## Selected Review Stills

Current review directory: `/home/durai/Documents/projects/content-engine/remotion-branding/output/ccv-refresh/verify-v4-review-fixes`

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
- No `client-v4.mp4` exists or was rendered in this pass.
- Repository-wide TypeScript checking has known unrelated IINM/Root errors outside this standalone CCV entrypoint; those were not changed or suppressed.
- No production records were created, no app logic was changed, and nothing was committed, pushed, published, deployed, mailed, or sent to shared docs.

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
