# Cleaning Verification V4 builder notes

**Current review status — checkpoint:** Claude final review **APPROVE**, `defects: []`,
as reported by the Conductor on 2026-09-07, for
`cln-verification-v4-review-candidate-v4.mp4`, SHA-256
`36ba66ff3bdae38bf0ddd7ffa9b2a92a6759d50d1437e2dd95f8b74499f9eec3`.
**Human approval remains pending.** This status supersedes historical Claude-pending
and capture-limitation gate language below. The native training-note limitations
remain documented and are nonblocking under that exact-artifact review. No new
render, recapture, inventory update or playback switch is part of this checkpoint.

**Preserved reference — V3:** `/home/durai/Documents/projects/content-engine-cleaning-v4/remotion-branding/output/cln-verification-v4/cln-verification-v4-review-candidate-v3.mp4`, 23,560,254 bytes, SHA-256 `2b363696a93600fe3f4a3b4ab0594f20c81b1819770ba370939a9b48202b6b12`. Renderer exited 0 at `2026-09-06T16:50:25.268809+00:00`; builder QA passes. The V3 record at the end supersedes the historical V2 failed/targeted-proof status below. Cross-engine and human approval remain pending.

V4 has **complete, opposite-engine-approved capture evidence** integrated into the composition: **0 missing capture groups; 35/35 required views; 26/26 newly required views; 19/19 new PNGs; 30 checks**. Its measured timeline remains 1920 × 1080 at 30 fps, **8,295 frames / 276.5 seconds (04:36:15)**, with **30 spoken beats and two music bookends without narration**. The V2 polish script has 459 whitespace-separated words; selected local ASR has 460 word tokens, normalized for full-text comparison. Capture coverage remains eight baseline views plus 27 operational views; capture 24 is supplemental.

**V2 full render completed successfully at 2026-09-06 16:14:30.935 UTC. Encoded QA is UNAPPROVED: two ring/neighbor-label overlaps remain.** The genuine Home bottom-nav Scan now precedes the scanner, with a disclosed deterministic training QR, ten brief measured ring cues, and the established CCV/BoH music in the existing bookends. Twenty-eight recordings were reused; only Home→Scan and scanner narration were regenerated and measured locally. Technical narration acceptance is recorded in `docs/verify-cln-v4-audio-polish-approval.json`; new Claude review and Daniel listening/visual approval remain pending. The completed-render QA record at the end of these notes is current; its failed visual checks supersede the earlier targeted-proof assessment. Earlier finishing and V1 render records below are retained as historical provenance.

## Entry points and scope

- Studio: normal `src/index.ts` registers V4 through `src/Root.tsx`.
- Isolated validation/render entry: `src/index-cln-v4.ts`.
- Preview composition: `CleaningVerificationTutorialV4-INTERNAL-PREVIEW`.
- Guarded composition: `CleaningVerificationTutorialV4`. Its fixed wrapper has no props for a waiver, render mode, alternate asset manifest, or suppression of blockers.
- Existing V1/V2/V3 code, audio, the Remedial storyboard, and video inventory are untouched by this builder.

The six original PNGs remain pinned to the independent capture register. Capture 07 supplies **unlock only**, visibly disclosed as “Controlled virtual-camera QR scan · no physical attendance claim · 0 tasks completed.” Capture 08 now supplies the live scanner. Narration identifies 07 as an earlier approved unlocked-state capture, not the immediate result of 08. Capture 09 shows the later unlocked state before the individual training pass. This builder created none of these PNGs, edited no register, operated no app, and submitted no results.

Captures 09–26 are classified `authorized-seeded-demonstration`, with persistent visible disclosure: “Bakery Demo · authorized seeded demonstration record · simulated inspection and work.” They are genuine shipped-app pixels of persisted, authorized synthetic training records. The spoken opening also discloses simulated inspections and work. Capture 08 retains the controlled-camera/no-physical-attendance disclosure. No simulated defect, cleaning, recheck or physical attendance is presented as a real-world event.

## Product and editorial decisions

V4 owns the scheduled check and immediate follow-up loop. Recording a failed scheduled check can satisfy that due occurrence while its finding remains open in Remedial. The five bands are Still to do, Passed, Follow-up owed, Couldn't access, and Resolved today. Closing a finding does not rewrite the original fail as a pass, and V4 makes no site-wide all-clear claim.

Pass all is scoped to one frequency and needs an actual inspection of that same frequency, recorded as pass or fail. Capture 09 shows disabled **Inspect 1 first**, 10 the individual inline pass, and 11 enabled **Daily Pass all (18)**. Eligibility now appears before the exception beats in the tutorial. After Major, Critical and unavailable are captured, 19 confirms exactly **15 remaining Daily checks in Premix Area**. Pass all was applied to those 15 remaining Daily checks. The pass and three exceptions are excluded; all 14 weekly off-schedule items remain untouched. Capture 20 retains the failures/access outcome at 19/19 completed (16 passes, two fails, one unavailable).

The boolean pass saves inline. The stable `single-pass/confirmation` contract key means the **saved green row and UNDO**, not a dialog. The script and emphasis explicitly teach inline saving. The stable `critical-ncr/ncr-queued` key is satisfied by the stronger native **“An NCR has been raised”** acknowledgement in 16. The register records linked NCR `rx7dgxae4cnc7rm2k7pqdvf30x8dw98r`; 20 shows NCR raised. The NCR remains open.

The fail form teaches the required grade/reason and optional action taken/evidence. There is no invented owner/assignee or displayed attribution. The close path is Follow-ups → Cleaning finding → CONFIRM FOLLOWED UP → optional note/photo → inner CONFIRM, after correction and an honest recheck. The genuine capture is filtered to Blue Covers with ALL selected; narration says to find the Cleaning finding and does not pretend the Cleaning tab is selected. The follow-up is explicitly simulated here. Capture 23 is the inner confirmation view; 24 is the supplemental result, **No matches**, with the same search. There is no success dialog. Total open Cleaning findings drops 4→3; two pre-existing findings are untouched.

The separate Remedial video owns the deeper explanation of persistent findings and Inspection Remedials carry-over. Its storyboard is read-only here. The user's V4 task explicitly retains the short immediate follow-up loop, even though that storyboard proposes a narrower capture-form handoff.

All V4 copy is fresh. Old owner language, broad “pass the rest” narration, QR composites, staged evidence images, stale counts, and prior audio are not imported. The SSOP empty-photo state and baseline counts are presented as observed, dated context.

## Capture replacement contract

Edit `src/cln/captures-v4.json`, placing new approved PNGs under a `public/cln-tutorial/v4-.../` path. Each existing slot accepts a `captures` array; each PNG declares the evidence views it actually proves. A multi-screen band sequence can use multiple PNGs. One PNG may cover several views in the **same** slot, but a baseline cannot be relabelled as an operation. The optional `closed-result` key is independently listed in `SUPPLEMENTAL_VIEWS`; adding supplemental evidence cannot satisfy a different required key.

For each new PNG record:

- Exact public-relative path, SHA-256, byte size and raw dimensions.
- Genuine-current-app or authorized-seeded-demonstration classification, `uncomposed: true`, app commit, capture time, machine, site and account identifier; never credentials.
- Capture authorization and independent review references; restricted record-log reference for operational evidence.
- One coherent scenario ID and increasing event order. The actual inspected frequency must agree across the single-pass and Pass all captures.
- Capture method and visible disclosure. Controlled virtual-camera scans must explicitly disclaim physical attendance. Harness setup can be disclosed for downstream operations but cannot satisfy the QR scanner/unlock evidence slots.
- `views` mapping each required evidence key to a normalized `{x,y,w,h}` crop, or `null` to show only the full image. These are crops of original pixels, not reconstructed UI.

Do not infer review approval from a filename or a hash. Automated checks bind a reviewed declaration to bytes and catch missing/corrupt/mislabelled inputs; they cannot establish authenticity or truthful operational state by inspecting pixels. The capture register and human review remain the source of that judgment.

**Capture order:** QR check-in → individual inspection/pass → exception cases → scoped bulk pass → all four open-state bands → follow-up closure → five-band post-close view. Capture every open-state view before closing the Major finding. Leave a genuine open finding, a still-due item, an unavailable outcome and a pass visible so all five post-close bands really exist. Never compose absent zero-value bands. The register’s authorized operational-evidence addendum supersedes the earlier camera-only boundary for the already completed demo session. This integration performs no new app operations.

### Integrated capture mapping

All filenames are under `public/cln-tutorial/v4-current-6999d8e/`. Exact byte identities, capture dates, scenario/event order, disclosure and reviewed normalized crops live in `captures-v4.json`; the validation harness checks this mapping against the independent register table, including every multi-view file. No PNG was altered.

| File | Slot | Views |
|---|---|---|
| `01-bakery-home-bill-of-health-entry.png` | `home` | `entry` |
| `02-bill-of-health-cleaning-verification-entry.png` | `boh` | `entry` |
| `03-cleaning-verification-live-baseline-summary.png` | `summary` | `baseline` |
| `04-premix-area-due-tab-linked-ssop47.png` | `due` | `due`, `ssop-link`, `scan-entry` |
| `05-premix-ssop47-detail.png` | `ssop` | `reference` |
| `06-premix-off-schedule-next-due.png` | `off-schedule` | `catalogue` |
| `07-bakery-demo-controlled-qr-checkin-unlocked.png` | `qr-check-in` | `unlocked` |
| `08-qr-check-in-scanner.png` | `qr-check-in` | `scanner` |
| `09-single-pass-inspection.png` | `single-pass` | `inspection` |
| `10-single-pass-confirmed.png` | `single-pass` | `confirmation`, `passed` |
| `11-frequency-pass-all-eligible.png` | `frequency-pass-all` | `eligible` |
| `19-frequency-pass-all-confirmation.png` | `frequency-pass-all` | `confirmation` |
| `20-frequency-pass-all-result.png` | `frequency-pass-all` | `result` |
| `12-major-fail-form.png` | `major-fail` | `form` |
| `13-major-fail-grade-reason.png` | `major-fail` | `grade-reason` |
| `14-major-fail-recorded.png` | `major-fail` | `recorded` |
| `15-critical-ncr-grade.png` | `critical-ncr` | `grade` |
| `16-critical-ncr-created.png` | `critical-ncr` | `ncr-queued` |
| `17-couldnt-access-reason.png` | `couldnt-access` | `reason` |
| `18-couldnt-access-recorded.png` | `couldnt-access` | `recorded` |
| `21-four-band-open.png` | `four-band-open` | `still-to-do`, `passed`, `follow-up-owed`, `couldnt-access` |
| `22-follow-ups-close-open-item.png` | `follow-ups-close` | `queue`, `confirm-followed-up` |
| `23-follow-ups-close-training-note.png` | `follow-ups-close` | `confirmation` |
| `24-follow-ups-close-confirmation.png` | `follow-ups-close` | `closed-result` |
| `25-five-band-resolved-today.png` | `five-band-resolved` | `still-to-do`, `passed`, `follow-up-owed`, `couldnt-access` |
| `26-five-band-resolved-item.png` | `five-band-resolved` | `resolved-today` |

Capture 24 is optional supplemental `closed-result` evidence, declared separately from the required contract views and displayed in its own beat. Capture 23 remains the required inner-confirmation view. 10 supplies two required keys, 21 four, 22 two, and 25 four. No hash crosses slots. Every declared PNG/view is shown by a narration beat.

**0 missing capture groups; 35/35 required views covered.** Every required capture view is integrated. The preview banner says **CAPTURE EVIDENCE COMPLETE** while retaining its non-final audio status.

The genuine four-to-five-band transition is **216/16/2/1/0 → 216/16/1/1/1**, ordered Still to do / Passed / Follow-up owed / Couldn't access / Resolved today:

| Value | Before Major closure (21) | After closure (25–26) |
|---|---:|---:|
| Still to do | 216 | 216 |
| Passed | 16 | 16 |
| Follow-up owed | 2 | 1 |
| Couldn’t access | 1 | 1 |
| Resolved today | 0 | 1 |
| Captured / scheduled | 19 / 235 | 19 / 235 |

Major closure leaves Cleaning Verification's 216 still to do, 16 passed, 1 couldn't access and 19/235 captured/scheduled counts unchanged; only follow-up owed 2→1 and resolved today 0→1 move. The Major keeps its original `fail` with accepted verification. Critical remains open with its linked NCR. The contract checks the partition/count arithmetic and closure invariants; the harness also checks these exact registered observations.

## Narration and frame math

`src/cln/narration-v4.json` is the measured frame manifest: each beat has absolute `from`, duration, narration text, measured voice in/out, emphasis/detail cues and evidence keys. End frames are exclusive. The fresh Daniel master supplies narration and retains silent bookend regions; V2 adds separate, trimmed series-music sequences only in those bookends.

Operational screens cut directly with **0 frames of overlap**. `sum(durationInFrames) - sum(overlapFromPrevious) = 8295 - 0 = 8295 frames`; `8295 / 30 = 276.5 seconds`. The explicit construction is **7,074 rounded clip frames + 18 initial lead frames + 870 gap frames (30 × 29) + 3 retained editorial hold frames + 330 bookend frames (150 + 180) = 8,295**. Each spoken beat uses `max(plannedDurationInFrames, clipStartFrame + ceil(durationSeconds × 30) + 29)`; 28 beats expanded, one retained an extra three-frame hold and one already fit exactly. `plannedDurationInFrames` preserves the original 5,640-frame / 188-second plan for comparison. Speech is neither sped up nor clipped. Every frame belongs to one beat. Voice, emphasis, detail and `proofFromFrames` cuts follow measured words. Repeated evidence keys may hold the same PNG/crop continuously; every actual image/detail change remains visible for at least two seconds.

For final narration, record the fresh script, align the manifest's cues with measured word timings, master the audio to the full timeline (including silent bookends), and supply the actual audio hash, bytes, transcript reference and approval. The preparation tool may set `timingStatus: measured-transcript` and `wordTimingVerified: true` only after real transcription/cue resolution. It always leaves audio `generated-unapproved` with no approval reference. Set `audioStatus: approved-recording` and the approval reference only after the actual audio and alignment are reviewed. The guard checks byte-bound master/transcript/source clips, spoken script, word intervals and cue frames. Do not flip flags to bypass an incomplete preparation.

| Beat | In (MM:SS:FF) | Out, exclusive | Frames | Evidence slot |
|---|---|---|---:|---|
| intro | 00:00:00 | 00:05:00 | 150 | intro |
| home | 00:05:00 | 00:14:03 | 273 | home |
| boh | 00:14:03 | 00:21:22 | 229 | boh |
| baseline | 00:21:22 | 00:30:06 | 254 | summary |
| due | 00:30:06 | 00:37:17 | 221 | due |
| ssop-link | 00:37:17 | 00:42:10 | 143 | due |
| ssop-reference | 00:42:10 | 00:47:15 | 155 | ssop |
| off-schedule | 00:47:15 | 00:57:28 | 313 | off-schedule |
| scan-entry | 00:57:28 | 01:01:28 | 120 | home |
| controlled-scan | 01:01:28 | 01:09:17 | 229 | qr-check-in |
| unlocked | 01:09:17 | 01:16:07 | 200 | qr-check-in |
| inspect-pass | 01:16:07 | 01:25:10 | 273 | single-pass |
| pass-inline-saved | 01:25:10 | 01:30:20 | 160 | single-pass |
| passed-state | 01:30:20 | 01:33:21 | 91 | single-pass |
| bulk-eligible | 01:33:21 | 01:46:14 | 383 | frequency-pass-all |
| major-form | 01:46:14 | 01:52:07 | 173 | major-fail |
| major-fields | 01:52:07 | 02:05:17 | 400 | major-fail |
| major-recorded | 02:05:17 | 02:18:04 | 377 | major-fail |
| critical-grade | 02:18:04 | 02:25:08 | 214 | critical-ncr |
| critical-ncr | 02:25:08 | 02:31:26 | 198 | critical-ncr |
| unavailable-reason | 02:31:26 | 02:41:26 | 300 | couldnt-access |
| unavailable-result | 02:41:26 | 02:47:28 | 182 | couldnt-access |
| bulk-confirm | 02:47:28 | 03:02:13 | 435 | frequency-pass-all |
| bulk-result | 03:02:13 | 03:14:14 | 361 | frequency-pass-all |
| open-bands | 03:14:14 | 03:29:24 | 460 | four-band-open |
| follow-queue | 03:29:24 | 03:38:17 | 263 | follow-ups-close |
| follow-expand | 03:38:17 | 03:47:15 | 268 | follow-ups-close |
| follow-confirm | 03:47:15 | 03:53:15 | 180 | follow-ups-close |
| follow-result | 03:53:15 | 03:58:17 | 152 | follow-ups-close |
| resolved-bands | 03:58:17 | 04:19:14 | 627 | five-band-resolved |
| handoff | 04:19:14 | 04:30:15 | 331 | handoff |
| outro | 04:30:15 | 04:36:15 | 180 | outro |

## Validation and local preview

Use the package's existing dependencies. On this machine, local ignored `node_modules/` links reuse the installed Remotion **4.0.484**, React **19.2.7** and TypeScript **5.9.3** from the main content-engine worktree; no dependency versions or lockfiles were changed.

Run from `remotion-branding/`:

```bash
npm run validate:cln-v4
npm run preflight:cln-v4:final
npm run smoke:cln-v4
npm run render:cln-v4:internal-preview
```

- Validation typechecks the isolated entry and runs provenance, byte identity, missing-file, required-evidence, copy, timing, chronology, frequency and disclosure checks.
- Final preflight is **validation only**. It now exits 0 after technical acceptance of the completed narration and timing; it has no render action.
- Smoke selects the actual preview composition in Chrome, tests final refusal at metadata and direct late-frame component boundaries, renders every beat/evidence view in reverse seek order, and compares a repeated frame's pixel hash.
- The preview render command runs those same proofs first, then creates only an explicitly named INTERNAL PREVIEW MP4. It checks output frame count, duration, resolution/FPS and silence using ffprobe.
- Proof folders are retained under `out/verify-cln-v4-INTERNAL-PREVIEW-*/`. Unique folders avoid overwriting earlier proofs. The runner copies only referenced original assets to a temporary bundle and uses free ports in 3215–3220. It never uses or kills 3210.
- Both metadata preflight and the mounted component enforce the final gate. Browser-side byte verification uses `staticFile()`, fetch and SHA-256 before rendering; Node uses the same contract. All images use Remotion `Img`. Frame-derived motion and shared bookends have no CSS animation/transition.

The guard placement follows Remotion's [metadata preflight](https://www.remotion.dev/docs/calculate-metadata) and [render cancellation](https://www.remotion.dev/docs/cancel-render) APIs. Runtime source was also checked against the installed package.

The initial builder wave verified **24 existing errors** in the whole package's `tsc --noEmit`, chiefly IINM timing types, legacy composition props, and missing legacy `kit` modules; its diagnostics matched the pre-build baseline. This integration reran the isolated V4 typecheck, which passes, rather than the unrelated whole-package check. Those unrelated sources are preserved.

## Review focus

Inspect full-resolution proof frames and the INTERNAL PREVIEW before approving replacement captures. Check heading/body spacing, the SSOP47 link crop near the app's existing floating navigation, the enlarged Due/off-schedule text, and readability of capture 07's controlled-camera disclosure. No screenshot has an annotation placed over its controls. The smaller phone preserves context; the adjacent crop supplies legibility.

All evidence groups and measured narration are complete. The expanded 276.5-second timeline accommodates the recorded speech, lead, gaps and readable evidence holds. The automated technical acceptance covers exact script alignment, source audio placement and measured cues. Human listening and review of a full video with this audio have not been performed. Inventory remains untouched.

## Narration audit and audio provenance

Every spoken line in `src/cln/narration-v4.json` was checked against the approved register and visually inspected captures 08–26. The table records each disposition; full current wording and exact planned frames are in that manifest. Intro/outro are silent brand copy, unchanged in scope. No stale earlier narration MP3, owner/assignee claim, physical-work claim, or site-wide all-clear is reused.

| Spoken beat | Evidence audit |
|---|---|
| `home` | Adds the synthetic training disclosure; retains the genuine Home entry. |
| `boh` | Separates missing scheduled checks from open Remedial findings. |
| `baseline` | States the dated 235/0 baseline rather than a live universal total. |
| `due` | States 19 Daily checks and QR lock in the captured Premix area. |
| `ssop-link` | Retains the linked inspection reference; no check claimed. |
| `ssop-reference` | Qualifies the observed empty photos; reference viewing records no check. |
| `off-schedule` | States 14 weekly items, next due dates and untouched scope. |
| `scan-entry` | V2: genuine Home bottom-nav Scan, followed by the genuine scanner. |
| `controlled-scan` | V2: disclosed training QR overlay in the controlled camera viewport; no physical attendance claim. |
| `unlocked` | Explicitly identifies the earlier capture with zero completed. |
| `inspect-pass` | Teaches inspect-before-tick and identifies the demo before-state. |
| `pass-inline-saved` | Replaces dialog implication with inline green status and UNDO. |
| `passed-state` | States the actual 1/19 progress result. |
| `bulk-eligible` | Shows Daily eligibility at 18 immediately after the first inspection, before exceptions. |
| `major-form` | Uses the real red-cross entry and native form. |
| `major-fields` | Required grade/reason, optional action/photo, explicitly simulated Major. |
| `major-recorded` | Acknowledgement captures the due occurrence while the finding stays open. |
| `critical-grade` | Separate Tables Critical example, NCR raised. |
| `critical-ncr` | Uses the actual raised acknowledgement and registered linked NCR, still open. |
| `unavailable-reason` | Native Unavailable form; reason and optional next step. |
| `unavailable-result` | Native recorded acknowledgement; no pass claimed. |
| `bulk-confirm` | Exactly 15 remaining Daily checks in Premix, excluding four prior outcomes. |
| `bulk-result` | 19 completed retains 16 passes, two fails, one unavailable and the NCR. |
| `open-bands` | Reads genuine 216/16/2/1 and 19 captured before closure. |
| `follow-queue` | Finds the Cleaning finding; does not imply the unselected Cleaning filter is selected. |
| `follow-expand` | Exact CONFIRM FOLLOWED UP, recheck prerequisite, simulated recheck disclosed. |
| `follow-confirm` | Optional note/photo and actual inner CONFIRM. |
| `follow-result` | No matches with unchanged search; no fabricated success dialog. |
| `resolved-bands` | 216/16/1/1/1; original fail and 19 captured unchanged. |
| `handoff` | Scheduled check plus immediate follow-up only; persistence/carry-over belongs to Remedial. |

**Historical remote attempt, superseded by local completion below.** `tools/prepare-cln-v4-audio.cjs` adapts the existing per-beat ElevenLabs workflow at `packages/backend/scripts/generate-cln-tutorial-audio.ts` and the repository’s Whisper word-timestamp workflow. It reads only voice/settings from the legacy narration config, not its stale script. The established series configuration is **voice `gYWKdgLtqjPO3D5uDrDP` (Daniel; provider name DC), `eleven_multilingual_v2`, stability 0.55, similarity boost 0.8, style 0.35, speaker boost true**. Provider lookup succeeded. Existing credentials were read from the main Machine B worktree `.env`; no credential values were emitted or copied.

Exact attempted command, from `remotion-branding/`:

```bash
node tools/prepare-cln-v4-audio.cjs --env-file /home/durai/Documents/projects/content-engine/.env
```

**Verified stop cause: `Whisper home: HTTP 429 (credit_balance_exhausted)`.** `/tmp/verify-cln-v4-audio-prep.log` contains exactly `Generate established series voice: home` followed by `AUDIO PREP BLOCKED: Whisper home: HTTP 429 (credit_balance_exhausted)` (110 bytes; SHA-256 `ab6a8ee64e14c651dd06073844ae1140bc23015518bab3963f096a02bc3095d6`). The script saves each MP3/receipt and its `generatedClips` entry, then awaits that clip's `whisper-1` transcription at `https://api.openai.com/v1/audio/transcriptions` before advancing to the next beat. `responseOrThrow` throws on the non-OK response; the outer catch saves `status: blocked` and exits 1. The first transcription therefore stopped the loop before `boh`, measured `clips`, or master creation. Only 1/30 spoken clips exists. This is the logged provider error and observed script path; the sanitized log does not retain the raw response, transcription request ID, or billing-project identity.

- Clip: `public/cln-tutorial/v4-audio/home-ad6166646fa9.mp3` — **7.523265 seconds**, 120,834 bytes, MP3 mono/44.1 kHz; SHA-256 `cec82b495b552c31d810185412b33e87c58e4463b729f1a732344b5f84fde519`.
- The MP3 is retained on disk but ignored by the repository’s existing `*.mp3` rule. No ignore rule or staging state was changed. The JSON receipt records its exact identity.
- Provider receipt: `public/cln-tutorial/v4-audio/home-ad6166646fa9-provenance.json` — generated at **`2026-09-06T12:54:45.411Z`**, ElevenLabs **requestId `BSHrALFqXp7lhNtBe0HZ`**, request hash `ad6166646fa9ca1f9d11f0adc28ed0aee6978aa279b9dfb6bede18ec9dbdaa79`; exact current `home` script and established voice/settings. Receipt: 727 bytes, SHA-256 `1950468e082e5775c0e69702501ee22f53598fdcafd99142670105bf94c646cd`. Both receipt and MP3 identities were rechecked without generating audio.
- Preparation record: `src/cln/audio-v4.json` — exact blocker, generated clip/receipt identities, measured-clips list empty, established voice/workflow references, remaining gates.
- At that remote failure, the composition was silent and no transcript/master existed. The retained home clip is now part of the completed master; current state is `audioStatus: approved-recording`, `timingStatus: measured-transcript`, `wordTimingVerified: true`, with the technical acceptance reference recorded.

**Remote diagnostic only:** the saved error establishes the reported `credit_balance_exhausted` response, but not the effective key’s billing history or current balance. A future remote retry would require usable credit/access and a sanitized status/code/request-ID diagnostic. **No credit restoration is needed for current V4 readiness**: explicit local mode completed all word measurement offline. Normal remote mode retains automatic local fallback for that exact HTTP 429 code.

Request-content hashes prevent stale text reuse; retained clips require matching byte identities and receipts. Local transcript reuse additionally compares model identities, installed engine versions and decoding settings. Every source response remains immutable. The completed 48 kHz mono PCM master places clips at exact 1,600-sample frame boundaries with the established 18-frame initial lead and 29-frame gaps, preserves 150/180-frame silent bookends, and totals **8,295 frames / 276.5 seconds**. A full cached preparation replay produced the same master/transcript and made no TTS or transcription calls.

Current technical gates are satisfied and final preflight passes. The acceptance is an automated audio/word-alignment audit under the user’s finishing instruction, with no claim of human listening approval. Full video rendering remains outside this turn.

## Historical capture integration validation and handoff — 2026-09-06

These pre-local-audio integration results are retained separately from current finishing validation below. Protected register, all 26 PNGs, Remedial storyboard and both inventory files are hash-checked against `/tmp/verify-cln-v4-integration-protected.json`.

| Command | Result |
|---|---|
| `npm run validate:cln-v4` | PASS: isolated TypeScript check plus 22 automated checks; 35/35 required views, 26/26 newly required views, 19/19 new PNGs wired, supplemental 24 shown. |
| `npm run preflight:cln-v4:final` | Expected exit 1: **narration only**. No missing capture group. |
| `npm run smoke:cln-v4` | PASS: **43 stills** covering every beat/view, browser metadata and late-frame final refusal, identical seek replay at frame 3405, one-second silent test. |
| `node_modules/.bin/tsc -p tsconfig-cln-v4.json` | PASS, exit 0, also run directly. |
| `ffmpeg -v error -i public/cln-tutorial/v4-audio/home-ad6166646fa9.mp3 -f null -` | PASS, exit 0: retained partial narration decodes. |
| `node --check tools/prepare-cln-v4-audio.cjs` and `node --check tools/verify-cln-v4.cjs` | PASS. |
| `git diff --check` | PASS. |
| Audio-prep command above | BLOCKED, exit 1: Whisper HTTP 429 `credit_balance_exhausted`; first series-voice clip retained, unused. |

Latest canonical integration proof: **`out/verify-cln-v4-INTERNAL-PREVIEW-t9x83J/verify-cln-v4-results.json`**, completed **2026-09-06 13:13:07 UTC**. It records 35/35 required views, zero missing groups, 26 registered PNGs and all 43 proof-frame hashes. `video: null`: no full tutorial MP4 exists in this new proof set. Its only MP4 is the one-second silence regression. `verify-cln-v4-delivery.json`, command logs and `verify-cln-v4-git-status.txt` alongside it record exact delivery identities and worktree status. Corrected inline/closed-result frames 2085 and 4845 were visually re-inspected after this final smoke. All 30 protected files match the start-of-wave hashes.

The integration/audio-preparation wave changed these ten worktree files, relative to `remotion-branding/`, including `src/cln/audio-v4.json`, `tools/prepare-cln-v4-audio.cjs` and both retained files in `public/cln-tutorial/v4-audio/`:

```text
src/cln/captures-v4.json
src/cln/v4-contract.ts
src/cln/narration-v4.json
src/cln/CleaningVerificationTutorialV4.tsx
src/cln/audio-v4.json
tools/verify-cln-v4.cjs
tools/prepare-cln-v4-audio.cjs
docs/cln-verification-v4-builder-notes.md
public/cln-tutorial/v4-audio/home-ad6166646fa9.mp3
public/cln-tutorial/v4-audio/home-ad6166646fa9-provenance.json
```

Existing V4 entry/registration, package scripts and isolated tsconfig remain in place from the prior wave; they were not edited this time. Git HEAD remains `d85e4c921373c2c551ebc1897a6a5cb926417086`. The existing modified capture register, untracked 07–26 PNGs and Remedial storyboard are preserved external work. The prior opposite-engine review summary in this thread corrected the completion report; the operator now reports the genuine evidence phase opposite-engine APPROVED. The V3 brief remains confirmed at `remotion-branding/docs/cln-verification-v3-brief.md`; no operator answer is pending.

Historical silent-timeline review positions (use the measured table above for current timing): the inline saved row at **01:09.5 / frame 2085**, 18-count eligibility at **01:15.5 / 2265**, Major reason at **01:27.5 / 2625**, native raised NCR at **01:49.5 / 3285**, 15-count dialog at **02:03.5 / 3705**, inner CONFIRM at **02:35.5 / 4665**, closed search at **02:41.5 / 4845**, and resolved item at **02:53.8 / 5214**. Baseline SSOP47 and controlled-camera disclosure remain **00:33.5 / 1005** and **00:59.5 / 1785**. Native floating navigation and clipped app headers are preserved source pixels. Detail crops stay at most 2×, so narrow original text can remain soft; none is covered by an added annotation. The silent editorial pace and dense spoken counts need measured-audio review.

No full tutorial render, inventory edit, commit, push, deployment, or file deletion occurred in this wave.

## Historical initial delivery record — 2026-09-06

This section retains the initial delivery's artifact identities for traceability. Those artifacts predate capture integration; current coverage and validation are recorded above. The last initial-wave smoke was `out/verify-cln-v4-INTERNAL-PREVIEW-wR1e1L/` (42 stills and a one-second silence test, no full tutorial MP4 in that folder).

Delivered internal preview:

- Path: `out/verify-cln-v4-INTERNAL-PREVIEW-16cBNy/cln-verification-v4-SILENT-INTERNAL-PREVIEW.mp4`
- Exactly **188.000000 seconds**, **5,640 frames**, H.264, 1920 × 1080, 30 fps; **no audio stream**.
- Size: **10,187,679 bytes**.
- SHA-256: `2751b2a1f7ba22c6aee709ffcd62a796cb65b647c55a61e4a14199f390c82009`.
- Video proof: `out/verify-cln-v4-INTERNAL-PREVIEW-16cBNy/verify-cln-v4-video-results.json`.
- Full 42-frame proof set: `out/verify-cln-v4-INTERNAL-PREVIEW-KAjKGp/verify-cln-v4-results.json`.

The first full render correctly produced 5,640 video frames, but its packaging check caught an unexpected silent AAC stream extending the container to 188.053333 seconds. The runner now explicitly uses `muted: true` when narration is absent and `enforceAudioTrack: false`. A one-second browser render verified exactly 30 frames / 1.000000 second with no audio track. That regression check is now also part of the smoke command.

The delivered full preview removes the unwanted audio by **lossless stream copy**. The original INTERNAL PREVIEW is retained. Both files have the identical encoded-video stream SHA-256 `f335e04b2034bba9065d680ebfe587b5927c2a6a9a9e8b71621699c8ec661a60`. No video frames were re-rendered or re-encoded for this correction.

Exact correction command, run from this package:

```bash
ffmpeg -v error -n -i out/verify-cln-v4-INTERNAL-PREVIEW-16cBNy/cln-verification-v4-INTERNAL-PREVIEW.mp4 -map 0:v:0 -c:v copy -an -movflags +faststart out/verify-cln-v4-INTERNAL-PREVIEW-16cBNy/cln-verification-v4-SILENT-INTERNAL-PREVIEW.mp4
```

Validation results:

| Command / check | Result |
|---|---|
| `npm run validate:cln-v4` | Initial delivery passed its then-current harness; the subsequent capture integration passed 22 checks. Current local-audio validation passes 23. |
| `npm run preflight:cln-v4:final` | This historical refusal predates local audio completion. Current final preflight passes, exit 0; capture evidence and technically accepted narration/timing are complete. |
| `npm run smoke:cln-v4` | PASS: browser metadata + late-frame final refusals, 42 preview stills, identical pixels after arbitrary seek. |
| `npm run render:cln-v4:internal-preview` | Full video frames rendered; strict container check exposed silent AAC padding. Fixed silence configuration and corrected the delivered file by stream copy as recorded above. |
| Explicit muted 30-frame browser render | PASS: exactly 1 second, no audio stream; `verify-muted-render-results.json` beside the delivered MP4. |
| Delivered-file ffprobe / encoded-stream hash comparison | PASS: exactly 188 seconds, 5,640 frames, 1080p/30, no audio; video packets unchanged. |
| `node_modules/.bin/tsc --noEmit` | Existing failure, exit 2: the same 24 baseline diagnostics, no added V4 diagnostics. |
| `node --check tools/verify-cln-v4.cjs` and `git diff --check` | PASS. |

Initial delivery files, all relative to `remotion-branding/`; the later integration/audio-preparation additions are listed above:

```text
package.json
src/Root.tsx
src/index-cln-v4.ts
src/cln/RootClnV4.tsx
src/cln/CleaningVerificationTutorialV4.tsx
src/cln/captures-v4.json
src/cln/narration-v4.json
src/cln/v4-contract.ts
tools/verify-cln-v4.cjs
tsconfig-cln-v4.json
docs/cln-verification-v4-builder-notes.md
```

Initial delivery HEAD was `d85e4c921373c2c551ebc1897a6a5cb926417086`. Current worktree status is recorded in the fresh correction report below. The external capture register and PNGs 07–26 are preserved. The pre-existing untracked Remedial storyboard is unchanged at SHA-256 `d0d4490b7a571b99874867702266eb3e3d7f3bfa35b223f032df87f8a2a900ff`.

The original app’s floating navigation partly covers lower task cards; that source content is preserved. Outcome and closure captures remain approved. Current measured timing is in the frame table; human listening and full-video review are separate from the technical readiness established below.

No files were deleted. No commit, push, deployment, final video, or inventory edit was made.

## Historical bounded correction before local audio — 2026-09-06

This correction changed exactly `docs/cln-verification-v4-builder-notes.md` and `src/cln/audio-v4.json`, relative to `remotion-branding/`. It reconciles capture coverage, mapping and historical status, and binds the audio blocker/unblocker to the saved log, receipt and preparation script. Delivery details added concurrently during inspection were preserved. The capture register/PNGs, audio files and preparation script, Remedial storyboard, inventory, composition and timing remain unchanged by this correction.

Fresh non-generative results:

| Check | Result |
|---|---|
| Stale-phrase grep across these notes | PASS: no obsolete capture-gap or placeholder claims. |
| JSON parse | PASS: all three V4 manifests and the retained audio receipt. |
| `npm run validate:cln-v4` | PASS, exit 0: isolated TypeScript and **22 checks**; **0 missing capture groups, 35/35 required views, 26/26 newly required views, 19/19 new PNGs**. |
| `npm run preflight:cln-v4:final` | Expected exit 1 after the same 22 checks; sole refusal: **fresh approved narration and measured word-aligned timing**. |
| Duration math | **5640 - 0 = 5640 frames; 5640 / 30 = 188 seconds**. |
| Audio provenance | Existing `home` MP3/receipt bytes and hashes match; ffprobe confirms 7.523265 seconds. RequestId **`BSHrALFqXp7lhNtBe0HZ`**. |
| `git diff --check` | PASS. |

At that correction, the sole production gate was narration. Preparation had stopped on the logged **Whisper home HTTP 429 (`credit_balance_exhausted`)**, before any measured word transcript or subsequent beat. Restore usable transcription credit/access, then resume preparation in an authorized audio turn using the retained `home` clip; finish measurement, master and listening/alignment approval. The exact recovery command and diagnostic limits are recorded in the audio provenance section and `audio-v4.json`.

HEAD remains **`d85e4c921373c2c551ebc1897a6a5cb926417086`**. `git status --short` retains the same **3 modified tracked files and 33 untracked entries** as at correction start; both corrected files were already untracked. Exact status and fresh command logs are retained under `/tmp/verify-cln-v4-correction-2rr82chr/`, including `verify-git-status.txt`, `verify-validation.log`, `verify-final-preflight.log` and `verify-json-parse.log`. No audio generation, transcription retry, smoke/render, capture operation, output deletion, commit or push was performed in this correction.


## Local narration finishing — 2026-09-06

**Complete: 30/30 spoken recordings and 30/30 selected local transcripts; 32/32 timeline beats including silent intro/outro.** The instruction’s “remaining 31 beats” counted all remaining timeline entries. The actual manifest contains 30 spoken beats, so home was reused and 29 other spoken beats generated. No narration was invented for the two silent brand bookends.

Local tooling was already installed at `/tmp/si-units-faster-whisper/bin/python`: **Python 3.12.3, faster-whisper 1.2.1, CTranslate2 4.8.2, PyAV 18.1.0, tokenizers 0.23.2**. The existing repository precedent is `packages/backend/src/scripts/transcribe-mechanics-si-units-local.py`. The existing **Systran/faster-whisper-small** snapshot is `536b0662742c02347bc0e980a01041f333bce120` in Machine B’s Hugging Face cache. Its `model.bin` is 483,546,902 bytes, SHA-256 `3e305921506d8872816023e4c273e75d2419fb89b24da97b4fe7bce14170d671`; all four model/tokenizer/config file identities are recorded in the transcripts and approval audit. **No package or model was downloaded.** The local helper enforces offline loading. The [upstream faster-whisper documentation](https://github.com/SYSTRAN/faster-whisper) describes the CPU/int8 and word-timestamp interfaces used here.

`tools/transcribe-cln-v4-local.py` uses fixed English, beam size 5, temperature 0, four CPU threads, one worker, no VAD and no previous-text conditioning. The normal local pass uses a recorded domain vocabulary. Ten selected beats needed a script-context decoding retry; their first responses remain on disk. Twenty-nine selected transcripts use int8. The off-schedule transcript uses the same cached model at float32 plus a recorded sentence-window measurement. All timestamps are produced by Whisper from the MP3 bytes. No word duration is interpolated or manually extended.

The original off-schedule wording produced a collapsed word interval. The sentence was revised to “Off-schedule lists fourteen weekly items. Check the next due date. These items stay untouched here. Record only work actually done.” Its first recording/receipt/transcript are retained as superseded evidence. The revised recording still needed sentence-window measurement around the final sentence: **6.9–9.456327 seconds**. Whisper measured **Record 7.06–7.68, only 7.68–7.98, work 7.98–8.28, actually 8.28–8.70, done 8.70–8.98**. The audio validator reconstructs the final word array exactly from the retained full-clip response and window response. The script’s source claims and all capture mappings remain accurate.

Preparation command, from `remotion-branding/`:

```bash
node tools/prepare-cln-v4-audio.cjs --env-file /home/durai/Documents/projects/content-engine/.env --transcription local --local-python /tmp/si-units-faster-whisper/bin/python --local-model /home/durai/.cache/huggingface/hub/models--Systran--faster-whisper-small/snapshots/536b0662742c02347bc0e980a01041f333bce120
```

Without `--transcription local`, remote Whisper remains the normal option. Only HTTP 429 with `credit_balance_exhausted` selects the automatic local fallback; ordinary rate limits, authentication and network failures are not misclassified. Local mode requires no OpenAI credential. Provider secrets were neither printed nor persisted. Preparation itself always leaves recordings unapproved; acceptance was recorded separately only after all requested technical conditions passed.

**Provider assets:** 30 active ElevenLabs clips/receipts, all voice `gYWKdgLtqjPO3D5uDrDP`, model `eleven_multilingual_v2`, with the established settings. There were **30 new generation requests** in this turn: 29 missing beats plus the one off-schedule revision. Together with retained home request `BSHrALFqXp7lhNtBe0HZ`, there are **31 receipts/MP3s on disk**, including the superseded off-schedule version. All 30 active request IDs are listed in the approval audit; the superseded receipt is identified in `audio-v4.json.retainedUnusedRecordings`.

The audio directory contains **111 files**: 31 MP3s, 31 provider receipt JSONs, 47 local response/measurement JSONs (including retries and the selected refined response), one measured-master JSON and one WAV master. **109 files were added**; the original home MP3/receipt were reused byte-for-byte. No rejected or superseded output was removed.

**Master:** `public/cln-tutorial/v4-audio/narration-985fe1c954f4.wav`, 26,544,078 bytes, SHA-256 `7a4aa4a166703e21628e7c8c3a1260a78cca7d701606afb83fdb841194f5e463`. It contains **13,272,000 mono PCM16 samples at 48 kHz**, exactly **276.5 seconds / 8,295 frames**. Measured transcript: `narration-985fe1c954f4-measured.json`, 96,254 bytes, SHA-256 `7530fd8957ae4c4db1c096755e03ea678fe809195cc661345898c8ce902783ce`. The 30 source file durations sum to 235.311019 seconds; the full timeline includes measured clip rounding, lead/gaps, retained hold and silent bookends as shown in the frame math above.

| Fresh check | Result |
|---|---|
| JSON parse | PASS: V4 manifests, all audio JSONs and the approval audit. |
| Isolated `tsc -p tsconfig-cln-v4.json` | PASS, exit 0. |
| `npm run validate:cln-v4` | PASS, exit 0: **23 checks** and unchanged complete capture coverage. |
| `node tools/verify-cln-v4-audio.cjs` | PASS: **30/30** source clips, receipts, byte identities, full script, positive/ordered word intervals, measured cue frames, scene fit and source-window reconstruction. Every decoded clip matches its exact master placement with **zero sample difference**; all gaps/bookends are silent. |
| Cached preparation replay | PASS: same master and measured transcript; no TTS or transcription calls. |
| Independent fresh home decode | PASS: identical text, segments, word probabilities and timestamps. |
| `npm run preflight:cln-v4:final` | **PASS, exit 0**; this command renders nothing. |

The measured timing exposed a negative-test ordering issue when an entire multi-view capture is removed: the guard now reports missing capture/narration blockers before checking legibility. Both requirements remain enforced, and all nine missing-capture regression tests pass. New negative checks reject wrong spoken counts/negation/grade, invalid word intervals and unsupported transcription providers.

**Acceptance and residual concern:** `docs/verify-cln-v4-audio-approval.json` records the user-authorized **technical narration and timing acceptance**, 30 per-clip audit records and exact source/master identities. `audio-v4.json` binds that record by hash and byte size. `narration-v4.json` is `approved-recording` / `measured-transcript`, with `wordTimingVerified: true` and that acceptance reference. **No technical preflight blocker remains. Human listening review and review of a full video with this audio have not been performed or claimed.** The earlier OpenAI error remains historical provenance in `audio-v4.json.previousBlocker`.

Changed source/proof files in this finishing turn, relative to `remotion-branding/`:

```text
docs/cln-verification-v4-builder-notes.md
docs/verify-cln-v4-audio-approval.json
src/cln/audio-v4.json
src/cln/narration-v4.json
src/cln/v4-contract.ts
tools/prepare-cln-v4-audio.cjs
tools/transcribe-cln-v4-local.py
tools/verify-cln-v4-audio.cjs
tools/verify-cln-v4.cjs
```

The 109 added asset paths are enumerated in `/tmp/verify-cln-v4-local-audio-h5106m_q/verify-final-report.json`; all are under `public/cln-tutorial/v4-audio/`. Fresh command logs, source snapshots, rejected-ASR diagnostics and replay proofs are retained in that same proof directory. HEAD remains `d85e4c921373c2c551ebc1897a6a5cb926417086`. Existing tracked modifications and unrelated untracked work are preserved. No full video render, capture PNG/register change, Remedial/inventory edit, output deletion, commit, push or deployment occurred.


## Review candidate v1 render and QA — 2026-09-06

**Review candidate only; not final/client-approved.** One full render was authorized and completed on Machine B (`durai-HP-Laptop-15-da0xxx`), using the existing production Remotion CLI **4.0.484**, isolated `src/index-cln-v4.ts` entry and fixed final-ready **CleaningVerificationTutorialV4** composition. No alternate variant, composition/source/manifest/audio/capture change, capture-register edit, Remedial/storyboard/inventory edit, deletion, commit or push occurred. Only this builder-notes file was edited outside the new output/proof directory.

### Immediate gates and exact render provenance

Both required gates ran immediately before the render, with no intervening source mutation:

| Stage | UTC start | UTC finish | Result |
|---|---|---|---|
| `npm run validate:cln-v4` | 14:18:02.678 | 14:18:07.178 | Exit 0; **23 checks**, 8,295 frames / 276.5s; complete capture coverage. |
| `npm run preflight:cln-v4:final` | 14:18:07.178 | 14:18:09.290 | Exit 0; final preflight passed. |
| Single full render | 14:18:09.290 | 14:41:36.177 | Exit 0; **8,295/8,295 encoded frames**, 23m 26.887s elapsed. |

```sh
./node_modules/.bin/remotion render src/index-cln-v4.ts CleaningVerificationTutorialV4 output/cln-verification-v4/cln-verification-v4-review-candidate-v1.mp4 --codec=h264 --crf=18 --x264-preset=medium --pixel-format=yuv420p --image-format=jpeg --jpeg-quality=80 --audio-codec=aac --audio-bitrate=320k --sample-rate=48000 --concurrency=3 --port=3215 --overwrite=false
```

The retained CCV v5 and BoH client v2 MP4s were inspected directly: both contain x264 CRF 18 settings and H.264 High / 4:2:0 video, AAC-LC 48 kHz stereo near 320 kb/s. Their paths, hashes, x264 SEI settings and stream properties are retained in `output/cln-verification-v4/verify-review-candidate-v1/verify-encoding-references.json`. This render uses the same medium x264 settings, CRF 18 and AAC target; JPEG quality 80 follows the production config/default. No production deployment or publication was invoked.

**Candidate:** `output/cln-verification-v4/cln-verification-v4-review-candidate-v1.mp4` — **23,111,153 bytes**, SHA-256 **`4a25e758c7d55eae78ac413716416da703420429b89a0247b548ad42f99ef2f3`**.

**Approved master:** `public/cln-tutorial/v4-audio/narration-985fe1c954f4.wav` — 26,544,078 bytes, SHA-256 `7a4aa4a166703e21628e7c8c3a1260a78cca7d701606afb83fdb841194f5e463`. The narration manifest remains 32,765 bytes, SHA-256 `fa009aa4f181058067aa08e6f1ad36417683d06340f863a5e4f5c5034dbc1c0a`; measured-transcript SHA-256 remains `7530fd8957ae4c4db1c096755e03ea678fe809195cc661345898c8ce902783ce`. All **41 direct render inputs** have exact identities in `verify-render-inputs.json`; its canonical input-identity digest is `68775227381bfd8f2bb89894310a30e62e44d03881cca6104e71af2eb843abf7` (an inventory digest, not a JavaScript bundle hash).

### Encoded media and audio measurements

System ffmpeg/ffprobe **6.1.1-3ubuntu5** verified the finished MP4:

| Property/check | Actual result |
|---|---|
| Full ffmpeg video and audio decode with `-xerror` | **Exit 0**, 8,295 decoded video frames; 0 duplicated and 0 dropped frames. |
| Video | H.264 **High**, `yuvj420p` (full-range 4:2:0), **1920 × 1080**, both frame-rate fields **30/1**. |
| Frame count / video duration | **8,295 / 276.500000s**. Source math remains **7,074 + 18 + 870 + 3 + 330 = 8,295**; 8,295 / 30 = 276.5s. |
| Audio | AAC **LC**, **48,000 Hz**, **2 channels (stereo)**, 317,375 bit/s measured; 320k target. |
| Container/audio duration | **276.544000s**; +44ms AAC packaging length versus the exact video/master duration. No scene frames were added. |
| Encoded signal versus approved master | **0.9999822243 correlation**, 44.4913dB signal-to-error after measured **2,048-sample / 42.6667ms** AAC delay and 0.706324 mono-to-stereo gain. Both channels are identical. |
| Envelope | **30/30 spoken beats active**; global activity **5.650–269.150s** using 10ms RMS windows at −45dBFS. Peak **−4.6809dBFS**; overall RMS **−25.7181dBFS**; no digital clipping. |
| Silent bookends | Both decode to exact zero signal; −240dBFS is the reporting floor used for zero, not measured noise. |

The envelope is measured from the encoded MP4 and is distinct from ASR word boundaries. Per-beat activity windows below use each clip's frame-aligned window, so their 10ms rounding grid can differ slightly from the global window. The fixed AAC delay is an encoding observation; the source master, measured word timestamps, cue frames and pacing were preserved. No human listening or pronunciation approval is implied by correlation or signal detection.

### Visual sampling and timing evidence

**171 exact 1920 × 1080 PNGs** were extracted from this MP4, spanning all 32 beats, early/settled moments, scene boundaries and evidence-cue cuts. `verify-sampling-plan.json` names exact frame numbers, times and purposes; `verify-extracted-frames.json` binds every extracted PNG by hash. Eight `verify-contact-beats-*.jpg` sheets were inspected for all 32 major beats, plus evidence sheets 08/09 and five selected full-resolution frames; these are encoded-video samples, not separately rendered variants.

The every-frame audit examined all **8,295** frames: **7,634 screen frames** match their expected full original PNGs across all **26 captures**. Maximum reduced-image mean absolute RGB error is **1.2911/255**; all **52** before/after capture-boundary comparisons favor the expected image on the exact declared frame. Operational transitions retain zero overlap, with no timeline gaps. Repeated four-band keys hold the same genuine summary continuously. The resolved-item cut occurs at **frame 7,518 / 04:10:18**, matching the measured cue and leaving the expanded holds intact.

No **INTERNAL PREVIEW**, **CAPTURE REQUIRED**, missing-evidence or narration-blocker label was observed in the sampled final composition. All 8,295 top bands were also measured; their maximum mean RGB is 27.8287/255, with no bright preview banner. The final fixed wrapper has `preview=false` and every required capture slot passed byte verification.

Sampled scanner, inline pass/UNDO, Daily Pass all **15**, Major grade/reason, native Critical/NCR acknowledgement, unavailable outcome, four-band open state, both closure confirmations, five-band result and final handoff remain legible. Genuine full-phone evidence stays visible; tutorial copy, enlarged details and persistent demo/controlled-camera disclosures sit outside the phone. No added tutorial overlay obscures the relevant actionable labels/arrows/buttons. The source's native navigation and scrolled status-bar appearance remain part of its original pixels. Counts visibly change **216/16/2/1/0 → 216/16/1/1/1**, with **19/235** captured/scheduled and **216** outstanding unchanged.

Two specific items remain for human visual/pacing judgment: **00:40:17**, the SSOP47 label and arrow are readable but the approved detail crop trims the pill's lower outline; and **04:19:14–04:21:17**, the handoff retains its source-defined initial 63-frame hold before the 15-frame reveal completes at **04:22:02**. Neither source nor crop was altered in this render/QA turn. No render-blocking source defect was found in the sampled review.

### Human review checklist — all pending

Review the full MP4 at normal speed and intended playback size. Listen for pronunciation, natural delivery, continuity, level and synchronization; confirm all demo disclosures and actionable evidence remain readable. These checkboxes are **not** human listening, visual or client approval. Scene out points are exclusive; frame timecodes are **MM:SS:FF at 30 fps**. Measured-word times remain the approved local-transcription values; encoded activity is the independent audio-envelope measurement.

| Spoken beat | Scene in–out (MM:SS:FF) | Measured first–last word (seconds) | Encoded activity (seconds) | Human review item (pending) |
|---|---|---|---|---|
| home | 00:05:00–00:14:03 | 5.600–12.560 | 5.650–12.760 | ☐ Listen for the simulated-inspections/work disclosure; check the Bill of Health entry. |
| boh | 00:14:03–00:21:22 | 14.100–20.300 | 14.210–20.240 | ☐ Confirm the Cleaning Verification entry remains legible. |
| baseline | 00:21:22–00:30:06 | 21.733–28.713 | 21.863–28.903 | ☐ Check the dated baseline screen and exact displayed counts. |
| due | 00:30:06–00:37:17 | 30.200–36.100 | 30.260–36.250 | ☐ Check Due context and the remaining scheduled items. |
| ssop-link | 00:37:17–00:42:10 | 37.567–40.687 | 37.647–40.897 | ☐ Read the SSOP47 link; check that native navigation does not hide the link. |
| ssop-reference | 00:42:10–00:47:15 | 42.333–45.973 | 42.413–46.003 | ☐ Check the genuine reference and empty-photo disclosure. |
| off-schedule | 00:47:15–00:57:28 | 47.500–56.480 | 47.580–56.520 | ☐ Listen to the revised wording; check fourteen weekly items and next due dates. |
| scan-entry | 00:57:28–01:01:28 | 57.933–60.393 | 58.023–60.533 | ☐ Check the native Scan QR control and zone context. |
| controlled-scan | 01:01:28–01:09:17 | 61.933–68.013 | 62.023–68.213 | ☐ Inspect the real scanner and controlled-camera/no-physical-attendance disclosure. |
| unlocked | 01:09:17–01:16:07 | 69.567–74.767 | 69.677–74.917 | ☐ Check that narration identifies this as an earlier approved unlocked-state capture. |
| inspect-pass | 01:16:07–01:25:10 | 76.233–83.913 | 76.333–84.033 | ☐ Check the initial inspection and disabled Inspect 1 first state. |
| pass-inline-saved | 01:25:10–01:30:20 | 85.333–89.053 | 85.483–89.363 | ☐ Confirm green saved row and UNDO; the boolean pass saves inline. |
| passed-state | 01:30:20–01:33:21 | 90.667–92.107 | 90.787–92.287 | ☐ Check the one-pass result without implying a confirmation dialog. |
| bulk-eligible | 01:33:21–01:46:14 | 93.700–104.900 | 93.820–105.040 | ☐ Check Daily Pass all eligibility after one recorded training inspection; count 18 at this stage. |
| major-form | 01:46:14–01:52:07 | 106.467–110.727 | 106.567–110.797 | ☐ Read grade/reason requirements and optional action/evidence fields. |
| major-fields | 01:52:07–02:05:17 | 112.233–124.013 | 112.353–124.233 | ☐ Read the Major grade and synthetic training reason; no physical-defect claim. |
| major-recorded | 02:05:17–02:18:04 | 125.567–136.747 | 125.647–136.697 | ☐ Check that the due check is captured while its finding remains open. |
| critical-grade | 02:18:04–02:25:08 | 138.133–143.733 | 138.283–143.943 | ☐ Read Critical and the NCR consequence. |
| critical-ncr | 02:25:08–02:31:26 | 145.267–150.347 | 145.397–150.477 | ☐ Read native An NCR has been raised acknowledgement; linked NCR remains open. |
| unavailable-reason | 02:31:26–02:41:26 | 151.867–160.367 | 152.007–160.497 | ☐ Read the reason for unavailable access; no inferred completion/pass. |
| unavailable-result | 02:41:26–02:47:28 | 161.867–166.387 | 161.957–166.547 | ☐ Check the saved unavailable outcome. |
| bulk-confirm | 02:47:28–03:02:13 | 167.933–180.833 | 168.033–180.993 | ☐ Read exactly 15 remaining Daily checks in Premix Area; weekly items excluded. |
| bulk-result | 03:02:13–03:14:14 | 182.433–193.013 | 182.503–193.123 | ☐ Check 19/19 completed: 16 passes, two fails, one unavailable; exceptions preserved. |
| open-bands | 03:14:14–03:29:24 | 194.467–208.227 | 194.547–208.447 | ☐ Read 216/16/2/1/0 in Still to do/Passed/Follow-up owed/Could not access/Resolved order. |
| follow-queue | 03:29:24–03:38:17 | 209.800–217.020 | 209.890–217.060 | ☐ Find the Blue Covers Cleaning finding in ALL/search context; no invented Cleaning-tab selection. |
| follow-expand | 03:38:17–03:47:15 | 218.567–225.947 | 218.637–225.977 | ☐ Check honest recheck-before-close wording and CONFIRM FOLLOWED UP. |
| follow-confirm | 03:47:15–03:53:15 | 227.500–231.900 | 227.590–232.150 | ☐ Read the simulated follow-up note and inner CONFIRM; note/photo remain optional. |
| follow-result | 03:53:15–03:58:17 | 233.500–237.000 | 233.540–237.200 | ☐ Check No matches for the same search; no invented success dialog. |
| resolved-bands | 03:58:17–04:19:14 | 238.567–257.687 | 238.647–258.157 | ☐ Read 216/16/1/1/1 and the resolved item; captured/scheduled stays 19/235; Critical remains open. |
| handoff | 04:19:14–04:30:15 | 259.467–269.067 | 259.607–269.157 | ☐ Check measured reveal/hold and deeper Remedial-video handoff; no site-wide all-clear claim. |

Also review the silent intro **00:00:00–00:05:00** and outro **04:30:15–04:36:15**, including logos, the final fade and the absence of unexpected audio. Explicit human/client sign-off remains required before calling this final/client-approved. This turn does not set or infer that sign-off.

### Artifact register and repository state

All logs, invocation/settings, source identities, ffprobe output, full-decode progress, audio-envelope measurements, screen-sequence audit, visual observations, 171 frame PNGs, contact sheets and the pending checklist are retained under `output/cln-verification-v4/verify-review-candidate-v1/`. The exact final file inventory and preservation result are recorded in `verify-final-report.json` there. Original source/capture/audio work remains intact. HEAD is **`d85e4c921373c2c551ebc1897a6a5cb926417086`**; final git status is retained in `verify-git-status.txt`. No commit, push, deletion, additional video variant or live-environment action occurred.


## V2 polish implementation and targeted proof — 2026-09-06, Machine B

**Historical implementation-stage record.** The completed-render QA below supersedes its no-full-render status and no-occlusion assessment.

Daniel’s approved polish adds Home Scan initiation, a disclosed training QR, selective rings and the existing series music. This is an implementation/proof handoff to Claude. It does not assert new human listening, cross-engine approval or client approval, and it does not close the mission. No full V2 render, commit, push or deployment was performed.

### Genuine Home → Scan and QR

The chosen source is approved capture **01**, `01-bakery-home-bill-of-health-entry.png`. Its actual bottom-nav Scan icon is clear; the hero shortcut is outside this captured scroll position. The full genuine Home PNG and an enlarged bottom-nav crop are held for frames **1738–1857** (00:57:28–01:01:28, exclusive end). A measured ring starts at local **43**, absolute **1781**, on the word “Scan”. Capture **08**, `08-qr-check-in-scanner.png`, follows immediately at **1858**, with the QR fading in over 12 frames. No app button is invented or redrawn.

Capture 04’s existing `due/scan-entry` locked-banner evidence is still covered: the earlier `due` beat now shows `due` at local 0 and `scan-entry` at local **134**, measured from “Completion”. Those image-detail holds are **134/87 frames**, both longer than two seconds. Capture manifest/register and PNGs are byte-identical. Capture 07 remains the explicitly earlier approved unlocked-state view; V2 does not claim that this overlay caused a new app check-in.

QR payload is exactly **`kx75czmzd6hc5d7t4wct58tjm188ea8p`** (bare Bakery Demo Premix Area zone ID, no URL or whitespace). Asset: `public/cln-tutorial/v4-polish/bakery-demo-premix-training-qr.png`, **444×444 RGB PNG, 2,198 bytes**, SHA-256 **`a3f89be743011e7bf66d677ee5f57493b0b892c43a36a79e379bdd7b9f6102f6`**. Python **qrcode 8.2 / Pillow 11.3.0** encoded QR version **3**, error correction **M**, 12 pixels/module, four-module quiet zone, deterministic byte-mode input. No image-generation model was used. Independent **ZXing-C++ 2.3.0** decoded both the original PNG and the QR in the rendered 1080p scanner proof back to that exact payload; see `verify-qr.json` and `verify-rendered-qr.json` in the proof directory.

The overlay is a Remotion `<Img src={staticFile(...)}>` at source-pixel rectangle **(185,642,350,350)**, inside the actual camera viewport **(108,567,504,498)**. Configuration stores exact normalized coordinates. Close, flash and lower instructions remain unobscured. The outside-chrome label is **“Bakery Demo training QR overlay”**, accompanied by teaching-overlay/no-physical-poster copy. The existing controlled-camera/no-physical-attendance disclosure remains visible.

### Ring cue table

Ten cues, each **48 frames / 1.6s**, use frame interpolation with 6-frame fade-in and 10-frame fade-out. Two unfilled strokes sit outside each target; there is no CSS animation/transition. Rings repeat in the enlarged detail only when the whole target is inside that crop. The pulse can extend into the empty margin rather than being clipped by the image crop. No ring obscures its label or key data in the current inspected proofs.

Coordinates below are source pixels **x,y,w,h** in the genuine **720×1600** PNG; exact normalized values live in `src/cln/polish-v4.json`. Both the PNG path and its SHA bind each cue to the active evidence. Cues are independently checked against measured transcript words.

| Beat / capture | Measured phrase | Local start | Absolute start / timestamp | Target | Source x,y,w,h |
|---|---|---:|---|---|---|
| `scan-entry` / 01 | Scan | 43 | 1781 / 00:59:11 | Home bottom-nav Scan | 377,1422,112,112 |
| `inspect-pass` / 09 | green | 137 | 2424 / 01:20:24 | Individual green Pass | 72,1090,88,88 |
| `bulk-eligible` / 11 | Daily Pass all | 0 | 2811 / 01:33:21 | Daily Pass all (18) eligibility | 531,823,149,54 |
| `major-fields` / 13 | Major | 68 | 3435 / 01:54:15 | Selected Major grade | 270,560,180,81 |
| `critical-grade` / 15 | Critical | 62 | 4206 / 02:20:06 | Selected Critical grade | 466,560,180,81 |
| `unavailable-reason` / 17 | why access | 114 | 4670 / 02:35:20 | Required WHY UNAVAILABLE reason | 74,840,572,132 |
| `bulk-confirm` / 19 | Confirm only | 317 | 5355 / 02:58:15 | CONFIRM 15 remaining Daily checks | 493,935,135,38 |
| `follow-queue` / 22 | Follow-ups | 10 | 6304 / 03:30:04 | Follow-ups page title | 132,163,193,44 |
| `follow-expand` / 22 | Confirm Followed Up | 64 | 6621 / 03:40:21 | CONFIRM FOLLOWED UP | 56,1124,608,87 |
| `resolved-bands` / 26 | resolved today | 383 | 7540 / 04:11:10 | Resolved today label and subtitle | 92,942,228,72 |

The Daily eligibility ring highlights the actual **Pass all (18)** control before exceptions. The later confirmation ring highlights **CONFIRM** for **15 remaining Daily checks** after those exceptions. Major/Critical rings point to the real selected grades; the native NCR acknowledgement/link stays unchanged. The unavailable cue surrounds the required reason; the resolved cue surrounds both the label and subtitle, leaving count/chevron visible.

### Music provenance, trims and actual audio measurements

Reused exact approved CCV/BoH series identity: **“Blue Sea” — Swoop**, [official Uppbeat track page](https://uppbeat.io/music/tracks/swoop/blue-sea). The existing asset was copied byte-for-byte from `/home/durai/Documents/projects/content-engine/remotion-branding/public/cln-tutorial/audio/tutorial.mp3` into this worktree’s same public-relative path. Series references are `src/ccv2/CcvRefresh.tsx` and `src/boh/BillOfHealthTutorial.tsx`; both use this path and gain **0.88**. **3,165,053 bytes**, SHA-256 **`f1928a7b68b79b89c843af517583ddc636773e8c4a354e3b610d42611962d186`**; MP3, **74.031020s**, **44.1 kHz stereo**, ID3 title/artist verified. Embedded cover art is not used.

**License evidence:** Daniel explicitly authorized reuse of the established approved series asset. Neither worktree contained the original Uppbeat license receipt/code; that reference was requested from Daniel and remains a provenance follow-up. No new license, receipt, commercial clearance or substitute track is claimed.

Music uses **`Audio` from `@remotion/media` 4.0.484**, `staticFile()`, gain 0.88 and explicit trims. Intro sequence is **[0,150)**, source **[0,150)**; outro sequence is **[8115,8295)**, source **[0,180)**, at 30 fps. Volume interpolates **0 → .88 → .88 → 0** at local frames **[0,24,121,149]** for intro and **[0,24,151,179]** for outro. Body and first/last narration have **zero music overlap**; no duration expansion or narration ducking was necessary.

Actual audio-only renders from the same guarded composition were decoded and analyzed, not merely simulated from configuration:

| Bookend | PCM output | Integrated loudness | True peak | Audible >−50 dBFS, local | Decode |
|---|---|---:|---:|---|---|
| intro | 5.0s, 48 kHz stereo PCM16, 240,000 samples/channel | -13.46 LUFS | -1.68 dBTP | 0.40–4.97s | exit 0 |
| outro | 6.0s, 48 kHz stereo PCM16, 288,000 samples/channel | -12.75 LUFS | -1.65 dBTP | 0.40–5.97s | exit 0 |

Full source-track loudness was -8.71 LUFS / -0.29 dBTP. The actual rendered fades match the configured gain within **0.006987 absolute gain** for source frames above −54 dBFS. Source correlation measured a **1,203-sample / 25.0625ms** offset between Remotion media decoding and ffmpeg’s source decode; no asset or sequence was shifted. This small decoder difference is included in the audit, not mistaken for a fabricated exact PCM match. First frames are zero; final 10ms is below −80 dBFS; no clipping. Raw 10ms envelopes, frame gain measurements and hashes are in `verify-music-audit.json`. These measurements do not substitute for Daniel’s listening review.

### Narration, receipts and unchanged duration

Only these two scripts changed, using the existing authorized env file (credentials never printed), Daniel series voice `gYWKdgLtqjPO3D5uDrDP`, ElevenLabs `eleven_multilingual_v2`, stability .55, similarity .8, style .35, speaker boost true:

| Beat | Revised script | Receipt request ID | MP3 duration | Existing beat | Measured speech, local |
|---|---|---|---:|---:|---|
| `scan-entry` | From Home, tap the bottom Scan. | `8EWvmE4ved9PZQ27j0rh` | 2.272653s | 120 frames | 0.00–1.74s |
| `controlled-scan` | This training QR represents Premix Area. No physical visit is shown. | `MAPgLLdYrkJ58YqxASJv` | 5.746939s | 229 frames | 0.00–5.24s |

Exactly **2 new ElevenLabs TTS requests**, **28 reused MP3/receipt/transcript selections**, **30/30 active spoken beats**, **30/30 full-text aligned transcripts**. The retained original Home recording remains unchanged. Three new local ASR response JSONs were retained: one for Home Scan and two scanner attempts (the selected scanner response uses script-context retry). All word intervals are measured; no timing interpolation, narration speed-up or trimming was used.

Local path: Python **3.12.3**, **faster-whisper 1.2.1**, **CTranslate2 4.8.2**, **PyAV 18.1.0**, CPU/int8, four threads, cached **Systran/faster-whisper-small**, revision **536b0662742c02347bc0e980a01041f333bce120**. No model download or OpenAI transcription request was needed. The original OpenAI 429 credit error remains historical provenance, not a current blocker. The prep script’s new explicit `--preserve-timeline true` mode refuses a clip that cannot fit its existing scene plus the 29-frame tail; both replacements fit. Normal remote/local preparation behavior remains available without this flag.

New measured master: `public/cln-tutorial/v4-audio/narration-186394f76142.wav`, **26,544,078 bytes**, SHA-256 **`a3ec81a318c09b16e3937fcc786fef5a49b33458aaa3557cdd465a9036b8697e`**. Measured JSON: `public/cln-tutorial/v4-audio/narration-186394f76142-measured.json`, **95,675 bytes**, SHA-256 **`99b71a2b27561f1c82d1dabbb37be5e5622c16864e212706ab8b952cf4d57edd`**. Master remains **13,272,000 mono PCM16 samples at 48 kHz**. Exact math: **150 intro + 7,965 spoken-beat frames + 180 outro − 0 overlap = 8,295 frames; 8,295 / 30 = 276.5s**. Every one of the 32 original beat starts and durations is unchanged.

There are **120 retained audio-directory files**, up from 111: two MP3s, two receipts, three ASR responses, one new master and one measured-master JSON were added. Old clips, prior transcription attempts, the V1 master and V1 MP4 were preserved. The technical narration gate is backed by `docs/verify-cln-v4-audio-polish-approval.json` and the full PCM/word audit; it explicitly excludes human/cross-engine approval.

### Validation and targeted proofs for Claude

All final commands exit **0**:

- Isolated `tsc -p tsconfig-cln-v4.json`.
- JSON parse: **90** V4/manifests/audio/approval JSON files.
- `npm run validate:cln-v4`: **30 checks**; unchanged 35/35 coverage, 26/26 newly required views, 19/19 newly supplied captures, 0 missing groups.
- `npm run preflight:cln-v4:final`: **Final preflight passed**.
- `node tools/verify-cln-v4-audio.cjs`: **30/30** source clips; hashes, receipts, script/word intervals, cues, master PCM placement and narration-only bookend silence pass.
- `node tools/verify-cln-v4-polish.cjs`: seven additional groups cover QR decode, source order/disclosure, actual evidence anchors, measured ring cues/coordinates, music identity/trim/fades, duration and rendering primitives/label exclusions, including negative cases.
- `tools/verify-cln-v4-polish-audio.py`: actual Remotion music WAVs, source correlation, 10ms envelopes, fades, loudness and peak checks pass.
- Preservation audit: all **5,327** initial regular files checked; only the seven explicitly scoped existing files listed below changed. No deletion or unrelated modification; all 28 reused clip records and all 32 beat positions/durations match their before snapshot.

Targeted render method: Remotion **4.0.484** bundler/renderer, isolated `src/index-cln-v4.ts`, real guarded `CleaningVerificationTutorialV4`, **1920×1080/30fps**, safe ports **3215–3220**. There are **19 current PNG proofs and two short audio-only WAV proofs**; ten earlier ring stills remain retained and superseded by `verify-refined-rings/`. No full V2 video was rendered. Current file identities are collected in `output/cln-verification-v4/verify-v2-polish/verify-current-proofs.json`.

The initial Node ESM loading attempt caused a pre-render bundler worker-path error under global `--conditions=module`; no video or audio was produced by that attempt. The verification harness now resolves the actual published media ESM entry only for that import under Node 22, leaving normal Remotion resolution intact. The initial log is retained. Installed media uses the already available on-machine 4.0.484 package through an ignored dependency symlink; `package.json` declares it explicitly. QR verification uses `/tmp/verify-cln-v4-polish-qr/bin/python` with the pinned small libraries above; set `CLN_V4_QR_PYTHON` to an equivalent environment if the temporary environment is removed.

**Visual inspection:** genuine Home icon, scanner controls/QR, individual pass, Daily eligibility/15 confirmation, Major/Critical, unavailable reason, Follow-ups/CONFIRM FOLLOWED UP, and Resolved Today are legible. The outer-ring clipping and subtitle overlap found in initial stills were corrected; current ring proofs show no added occlusion or pulse clipping. The native app scroll/status-bar appearance remains original evidence. No INTERNAL PREVIEW or blocker cards were observed; current PNGs also pass the preview-bar pixel exclusion. Bookend logos/text remain intact. QR bytes and its rendered proof decode independently. This is builder visual inspection, not Daniel’s human sign-off.

Current targeted paths below are relative to `output/cln-verification-v4/verify-v2-polish/`:

| Proof | Frame / range | File | Bytes | SHA-256 |
|---|---|---|---:|---|
| intro | 90 | `verify-intro-f90.png` | 1,951,860 | `535e710eacfc8cbd61474d34a157a8fb89891e4ae3a87a8193d78ea680eb906e` |
| home-before-ring | 1758 | `verify-home-before-ring-f1758.png` | 1,122,034 | `b45669c1fa99134c0dececd251f248710fb45912e29b3905433ff30804904812` |
| scan-entry | 1797 | `verify-refined-rings/verify-scan-entry-f1797.png` | 1,079,577 | `89991515b2b6f5ea54b60b45028e562a7306befe2673a4bf49865841e9c7e39f` |
| inspect-pass | 2440 | `verify-refined-rings/verify-inspect-pass-f2440.png` | 1,001,253 | `164e4bfd702f12167b655516d852fe0df069696d97c7da0ec09b9ab7c0069b54` |
| bulk-eligible | 2827 | `verify-refined-rings/verify-bulk-eligible-f2827.png` | 1,005,654 | `a2aa2875776586392c3445d1b13d28baadaa93232a60eda018b46c51fb435b4c` |
| major-fields | 3451 | `verify-refined-rings/verify-major-fields-f3451.png` | 1,041,741 | `dcc4d73e7464b92da12791eebf4658558173033e0476149f4dad8c572dfc93d2` |
| critical-grade | 4222 | `verify-refined-rings/verify-critical-grade-f4222.png` | 1,016,166 | `be27532bcf8b77efe5edfc712ee48fab8cbc2df3abc6da91c276791c3bf377f7` |
| unavailable-reason | 4686 | `verify-refined-rings/verify-unavailable-reason-f4686.png` | 1,023,738 | `c3ef354aca07a8a16e8588f670259b47ab0ebb442256ad44843c6d174cfe8c5a` |
| bulk-confirm | 5371 | `verify-refined-rings/verify-bulk-confirm-f5371.png` | 1,014,761 | `1f670c9762b97c98503020b749ebe59b6b5ec882acd4d567557851f647a491d5` |
| follow-queue | 6320 | `verify-refined-rings/verify-follow-queue-f6320.png` | 1,112,381 | `8c2a833d9324e8bdd98308f9d3ae5b355677b377d4f6ae832889daac3406e5ec` |
| follow-expand | 6637 | `verify-refined-rings/verify-follow-expand-f6637.png` | 1,048,190 | `134f56818873eec1e4379e063d7d9f4157acc0d955ae7882dbf289111e99685b` |
| resolved-bands | 7556 | `verify-refined-rings/verify-resolved-bands-f7556.png` | 988,899 | `bc5fa9e5260432ccc06f8e2eb190a1e9252008731d572c8274982733c44a480a` |
| home-ring-finished | 1848 | `verify-home-ring-finished-f1848.png` | 1,058,754 | `c458f7b7b6e9eb3777a573f236d30111749ab6917955e1e83cbdf5f621f2c9db` |
| home-last | 1857 | `verify-home-last-f1857.png` | 1,058,748 | `3591090a5c0c1ced8a72cb872dc0772c66ac19f97e0f8c9bf27f7616ae5c6e66` |
| scanner-first | 1858 | `verify-scanner-first-f1858.png` | 1,389,840 | `10a11df7c3800dca4935d233c895096c58b31a110c47e9add30d190552164976` |
| scanner-qr | 1903 | `verify-scanner-qr-f1903.png` | 1,352,021 | `ebfe80077b3b0e17ed97f334d5fed163e01138a14a8e82dc83cc89dd5bfa2110` |
| scanner-disclosure | 2013 | `verify-scanner-disclosure-f2013.png` | 1,362,032 | `1d1951c4d629d15dea29f596266ad86031086561a80107f0cacb7aabea5b0730` |
| unlocked | 2177 | `verify-unlocked-f2177.png` | 981,463 | `21b0629d606e3b8adef30d762bb9f021121a2f5f34b17a2ddfcacdf563045bc8` |
| outro | 8205 | `verify-outro-f8205.png` | 1,915,163 | `52ef957e0792214394ea6e9d539457dd57122e50d337619eba4d18d3ea2bbc18` |
| intro-music | [0, 149] | `verify-intro-music.wav` | 960,078 | `7e1010d16597c000176d859e8a17d455e684680234ca2282f159bbdb9d0809b6` |
| outro-music | [8115, 8294] | `verify-outro-music.wav` | 1,152,078 | `257325cad72c22e50165e53486c614c7c63b4a9a7e005687bb948ddc86a92736` |

### Exact scoped files and planned V2 render

Existing files changed in this turn (relative to `remotion-branding/`):

- `docs/cln-verification-v4-builder-notes.md`
- `package.json`
- `src/cln/CleaningVerificationTutorialV4.tsx`
- `src/cln/audio-v4.json`
- `src/cln/narration-v4.json`
- `tools/prepare-cln-v4-audio.cjs`
- `tools/verify-cln-v4.cjs`

New implementation/asset/proof-script files (the exact hashes, including ignored assets, are in `verify-preservation.json`):

- `docs/verify-cln-v4-audio-polish-approval.json`
- `public/cln-tutorial/audio/tutorial.mp3`
- `public/cln-tutorial/v4-audio/controlled-scan-f21175565ff9-local-647186afe9c7.json`
- `public/cln-tutorial/v4-audio/controlled-scan-f21175565ff9-local-f1bd5c8aabb8.json`
- `public/cln-tutorial/v4-audio/controlled-scan-f21175565ff9-provenance.json`
- `public/cln-tutorial/v4-audio/controlled-scan-f21175565ff9.mp3`
- `public/cln-tutorial/v4-audio/narration-186394f76142-measured.json`
- `public/cln-tutorial/v4-audio/narration-186394f76142.wav`
- `public/cln-tutorial/v4-audio/scan-entry-57f696ed08c3-local-f1bd5c8aabb8.json`
- `public/cln-tutorial/v4-audio/scan-entry-57f696ed08c3-provenance.json`
- `public/cln-tutorial/v4-audio/scan-entry-57f696ed08c3.mp3`
- `public/cln-tutorial/v4-polish/bakery-demo-premix-training-qr.png`
- `src/cln/V4Polish.tsx`
- `src/cln/polish-v4.json`
- `src/cln/v4-polish.ts`
- `tools/verify-cln-v4-polish-audio.py`
- `tools/verify-cln-v4-polish-preservation.py`
- `tools/verify-cln-v4-polish-proofs.cjs`
- `tools/verify-cln-v4-polish.cjs`
- `tools/verify-cln-v4-qr.py`

Additional scratch/report files stay under `output/cln-verification-v4/verify-v2-polish/`; no `review-*` file was touched. No existing output was deleted. Capture PNGs, `captures-v4.json`, capture register, Remedial files, inventory and the V1 MP4 retain their before hashes. The V1 MP4 remains **23,111,153 bytes**, SHA-256 **`4a25e758c7d55eae78ac413716416da703420429b89a0247b548ad42f99ef2f3`**.

**HEAD:** `d85e4c921373c2c551ebc1897a6a5cb926417086`, unchanged. The worktree was already dirty; exact before/after status is retained in `verify-before.json` / `verify-preservation.json`. No commit or push.

**Next gates:** Claude review of these proofs and the two new voice clips; Daniel listening/visual review of the music and tap pacing. The missing original Uppbeat receipt reference is a provenance follow-up. There is no remaining technical preflight blocker. After separate render authorization, the planned output is `output/cln-verification-v4/cln-verification-v4-review-candidate-v2.mp4`, preserving the V1 candidate. Re-run validation/preflight immediately before using the existing production H.264 High / CRF18 / medium / yuv420p / AAC 320k / 48kHz settings at 8295 frames, 1920×1080, 30fps. **That full render was not run in this turn.**


## V2 completed render and takeover QA — 2026-09-06T16:25:03.908231+00:00

**UNAPPROVED — two visual QA failures.** The requested MP4 exists and the original renderer exited successfully. This takeover observed the live Python wrapper PID 1326607 and Remotion PID 1328122 progressing, waited for them, and started **zero** additional renderers. The successful original render ran from **2026-09-06T16:01:42.680030+00:00** to **2026-09-06T16:14:30.935193+00:00**, exit **0**. Its immediately preceding validation and final preflight also exited **0**. Exact invocation and UTC stage times are in `output/cln-verification-v4/verify-review-candidate-v2/verify-render-invocation.json`.

**Candidate:** `output/cln-verification-v4/cln-verification-v4-review-candidate-v2.mp4`, **23,568,876 bytes**, SHA-256 **`7fdc4ef2a3e97b81930315d6b9d186a63cdbad0636706c2e5b07bfb26cf708c9`**. Machine B host: `durai-HP-Laptop-15-da0xxx`; Remotion/media/CLI/renderer **4.0.484**, React **19.2.0**, isolated `src/index-cln-v4.ts`, composition `CleaningVerificationTutorialV4`.

```sh
./node_modules/.bin/remotion render src/index-cln-v4.ts CleaningVerificationTutorialV4 output/cln-verification-v4/cln-verification-v4-review-candidate-v2.mp4 --codec=h264 --crf=18 --x264-preset=medium --pixel-format=yuv420p --image-format=jpeg --jpeg-quality=80 --audio-codec=aac --audio-bitrate=320k --sample-rate=48000 --concurrency=3 --port=3215 --overwrite=false
```

### Failed checks — do not approve or publish this candidate

1. **V2-RING-01**, `follow-queue`, **frame 6342 / 03:31:12**, local ring frame 38: the outer cyan title ring crosses the top of the neighboring **“4 remedial actions awaiting follow-up”** subtitle. The title remains readable, but the explicit no-label-occlusion requirement fails. Compare encoded f6304 without the ring against f6342 in `verify-follow-queue-neighbor-inspection.png`; original encoded evidence is `frames/verify-frame-199.png`.
2. **V2-RING-02**, `unavailable-reason`, **frame 4708 / 02:36:28**, local ring frame 38: the outer amber field ring crosses the lower edge of **“WHY UNAVAILABLE *”**. The entered reason remains readable, but the no-label-occlusion requirement fails. `verify-neighbor-label-inspection.png` compares f4670 with f4708; original encoded evidence is `frames/verify-frame-151.png`.

Those proof paths are relative to `output/cln-verification-v4/verify-review-candidate-v2/`. Both defects remain in the delivered MP4. No source/geometry fix or rerender was attempted in this takeover. The next bounded step for codex-18 is to correct only these two ring extents, then render one corrected candidate and repeat the relevant encoded QA plus decode/audio/preservation checks. Human listening, cross-engine review and client approval remain pending.

### Complete encoded media/audio QA

- Full ffmpeg video and audio decode with `-xerror`: **exit 0**, **8295 decoded frames**, **0 duplicate / 0 dropped**; empty error log. No container-only shortcut was used.
- ffprobe: H.264 **High**, **1920×1080**, `r_frame_rate=30/1`, `avg_frame_rate=30/1`, **8295 frames**, **276.500000s** video. Actual pixel format is **`yuvj420p`, full range `pc`**, matching V1. The existing command requested `--pixel-format=yuv420p`; the exact observed full-range label is retained rather than rewritten in the report.
- Audio: AAC **LC**, **48000 Hz**, **stereo**. Container/audio duration **276.544000s** includes AAC packaging beyond the exact video duration. Measured AAC priming/alignment is **2048 samples / 42.6667ms**; no timeline shift or source edit was applied.
- All **30/30 narration beats active**. Full narration-body correlation **0.9999826480**, signal-to-error **44.5961dB**, measured mono-to-stereo gain **0.706324965**. Minimum individual beat correlation **0.9999656807**; minimum beat signal-to-error **41.6341dB**. Correlation/activity do not constitute human listening or pronunciation approval.
- Music remains the exact approved-series **Blue Sea — Swoop**, source SHA-256 `f1928a7b68b79b89c843af517583ddc636773e8c4a354e3b610d42611962d186`. Approved music-only WAV references and their hashes are bound in `verify-media-audio.json`. Encoded intro/outro correlate above **0.99995** with those rendered references; gains are **0.998309 / 0.998550**. Frame envelope/fade comparisons pass, both first frames are zero and final 10ms windows fade below −100dBFS. No clipping: whole-file true peak **−1.64dBTP**.
- Narration master has **zero nonzero samples** in the exact intro/outro windows (240000 and 288000 mono samples). No narration/music overlap detected. All **2642** examined 10ms narration-free body windows decode to exact zero, and body channels have zero difference: no unintended music/body bleed detected. The −240dBFS JSON value is the reporting floor for exact zero.

Per-bookend measurements below use **`atrim` before `loudnorm`**, after accounting for AAC alignment. The initial verifier's output `-ss/-t` method incorrectly admitted preceding audio into its segment loudness analysis; its old values are retained as superseded measurements in the JSON. The first verifier attempt also had an overly narrow `yuv420p` assertion; its exit-1 log remains retained. Only the QA harness was corrected. Full decode, waveform correlation, activity, PCM peaks, global loudness and the MP4 itself were unaffected by these verifier corrections.

| Bookend | From / frames | Integrated LUFS | True peak dBTP | Reference correlation | Final 10ms RMS dBFS |
|---|---|---:|---:|---:|---:|
| intro | 0 / 150 | -13.48 | -1.68 | 0.999951913 | -133.09 |
| outro | 8115 / 180 | -12.77 | -1.64 | 0.999962033 | -105.61 |

The complete envelope/frame gain arrays and exact reference hashes are in `verify-media-audio.json`; corrected segment analysis and zero-narration checks are in `verify-bookend-measurement.json`.

| Spoken beat | Encoded activity, seconds | Master correlation | Signal-to-error dB |
|---|---|---:|---:|
| `home` | 5.650–12.760 | 0.999984218 | 45.008 |
| `boh` | 14.210–20.240 | 0.999984981 | 45.223 |
| `baseline` | 21.863–28.903 | 0.999980320 | 44.049 |
| `due` | 30.260–36.250 | 0.999988897 | 46.535 |
| `ssop-link` | 37.647–40.897 | 0.999986676 | 45.743 |
| `ssop-reference` | 42.413–46.003 | 0.999985029 | 45.237 |
| `off-schedule` | 47.580–56.520 | 0.999976638 | 43.304 |
| `scan-entry` | 58.083–59.873 | 0.999984585 | 45.110 |
| `controlled-scan` | 62.073–67.273 | 0.999988675 | 46.449 |
| `unlocked` | 69.677–74.917 | 0.999985529 | 45.385 |
| `inspect-pass` | 76.333–84.033 | 0.999975653 | 43.125 |
| `pass-inline-saved` | 85.483–89.363 | 0.999970260 | 42.256 |
| `passed-state` | 90.787–92.287 | 0.999965681 | 41.634 |
| `bulk-eligible` | 93.820–105.040 | 0.999975543 | 43.106 |
| `major-form` | 106.567–110.797 | 0.999980082 | 43.997 |
| `major-fields` | 112.353–124.233 | 0.999987652 | 46.074 |
| `major-recorded` | 125.647–136.697 | 0.999976821 | 43.339 |
| `critical-grade` | 138.283–143.943 | 0.999986945 | 45.832 |
| `critical-ncr` | 145.397–150.477 | 0.999973227 | 42.712 |
| `unavailable-reason` | 152.007–160.497 | 0.999967634 | 41.889 |
| `unavailable-result` | 161.957–166.547 | 0.999979508 | 43.874 |
| `bulk-confirm` | 168.033–180.993 | 0.999982363 | 44.525 |
| `bulk-result` | 182.503–193.123 | 0.999985740 | 45.448 |
| `open-bands` | 194.547–208.447 | 0.999984804 | 45.172 |
| `follow-queue` | 209.890–217.060 | 0.999989277 | 46.687 |
| `follow-expand` | 218.637–225.977 | 0.999981301 | 44.271 |
| `follow-confirm` | 227.590–232.150 | 0.999978373 | 43.640 |
| `follow-result` | 233.540–237.200 | 0.999987803 | 46.127 |
| `resolved-bands` | 238.647–258.157 | 0.999980312 | 44.047 |
| `handoff` | 259.607–269.157 | 0.999974424 | 42.911 |

### Encoded picture, QR, all rings and final handoff

**259** exact PNGs were extracted from this MP4. All **32** beat milestones were inspected on eight contact sheets, plus **80** ring samples (ten cues × local frames **0,6,16,24,38,42,47,48**) and enlarged neighbor-label comparisons. These are encoded samples, not independent Remotion still renders. Ten ring sheets retain midpoint full-composition/detail context; eight rings pass sampled no-occlusion inspection and the two failures above remain explicit.

| Ring | Absolute frame interval, end exclusive | Encoded no-occlusion result |
|---|---|---|
| `scan-entry` | 1781–1829 | pass in sampled frames |
| `inspect-pass` | 2424–2472 | pass in sampled frames |
| `bulk-eligible` | 2811–2859 | pass in sampled frames |
| `major-fields` | 3435–3483 | pass in sampled frames |
| `critical-grade` | 4206–4254 | pass in sampled frames |
| `unavailable-reason` | 4670–4718 | fail |
| `bulk-confirm` | 5355–5403 | pass in sampled frames |
| `follow-queue` | 6304–6352 | fail |
| `follow-expand` | 6621–6669 | pass in sampled frames |
| `resolved-bands` | 7540–7588 | pass in sampled frames |

The Home bottom-nav Scan ring occupies **[1781,1829)**, finishes before the scanner, and remains on the genuine Home image. Encoded f1857 is Home; f1858 is the scanner. At **f1903 / 01:03:13**, independent **ZXing-C++ 2.3.0** decoded the QR in the extracted **1920×1080** PNG to exactly **`kx75czmzd6hc5d7t4wct58tjm188ea8p`**, with no URL/whitespace. The extracted frame is **734056 bytes**, SHA-256 **`cb493208a0c57d6c3abf5bd489bfbcb3e81927e4d05803e18a0a699b95a0c763`**. Source QR hash remains `a3f89be743011e7bf66d677ee5f57493b0b892c43a36a79e379bdd7b9f6102f6`; its deterministic qrcode/Pillow provenance is unchanged. Controlled-camera/teaching-overlay/no-physical-attendance disclosures remain visible; scanner close/flash/instructions are unobscured.

All **8295** top bands and **7634** operational phone frames were checked. All **26** capture PNGs occur; maximum reduced phone mean RGB error **2.230208/255**, all **52** adjacent-capture comparisons favor the declared screen on its exact boundary. No INTERNAL PREVIEW, CAPTURE REQUIRED or evidence/narration blocker label was observed in the sampled beats; maximum every-frame top-band mean RGB is **27.828703/255**. The QR viewport is explicitly excluded from the phone-template comparison and independently decoded above; rings remain in that comparison. This automated check does not replace the visual neighbor-label checks that found the defects.

Major grade/reason/acknowledgement, the separate Critical NCR acknowledgement, unavailable outcome, Daily 15 confirmation, Follow-ups sign-off, no-matches and resolved evidence were inspected. Counts and simulation disclosures are preserved. The final handoff at **f7949 / 04:24:29** is legible and points to Remedial Action/persistent findings/Inspection carry-over; the source-defined 63-frame initial hold and 15-frame reveal are unchanged. The historical SSOP47 tight lower-pill crop remains a human framing review item. No complete human listening or client sign-off is claimed.

### Preservation and current reports

All **138** recorded render-input identities remain unchanged, canonical input-identity digest **`4f607eb84997a5a3098f0af09b8d3c6470bfff7fca39b8c3727c05fa7536df5c`**. Narration master remains **26544078 bytes**, SHA-256 **`a3ec81a318c09b16e3937fcc786fef5a49b33458aaa3557cdd465a9036b8697e`**. Capture PNGs/manifest/register, music/QR sources, measured transcripts, composition/entry and dependency files were not changed. V1 remains **23,111,153 bytes**, SHA-256 **`4a25e758c7d55eae78ac413716416da703420429b89a0247b548ad42f99ef2f3`**. Both video-inventory files retain their takeover hashes. HEAD remains **`d85e4c921373c2c551ebc1897a6a5cb926417086`**; git-status paths/flags match the render-start snapshot. No commit, push, deletion or publication occurred.

The stale `output/cln-verification-v4/verify-v2-polish/verify-v2-polish-report.json` has been replaced with the current **failed/unapproved** encoded-QA report. Its exact prior bytes are retained at `verify-review-candidate-v2/verify-stale-polish-report-before.json`. The current report is also available at `verify-review-candidate-v2/verify-final-report.json`, with MP4 identity, UTC timestamps, exact command/source provenance, all measurements, both failures and preservation results. New scratch/proof artifacts use `verify-*`; no reviewer-owned `review-*` file was edited. Outside the QA output area, only these builder notes changed.

## V3 two-ring correction and completed QA — 2026-09-06T16:54:40.311450+00:00

V3 completed with builder technical/visual QA passing. Exactly one full candidate renderer exited 0; cross-engine review and human listening/client approval remain pending.

- Candidate: `/home/durai/Documents/projects/content-engine-cleaning-v4/remotion-branding/output/cln-verification-v4/cln-verification-v4-review-candidate-v3.mp4`
- Bytes: **23,560,254**
- SHA-256: `2b363696a93600fe3f4a3b4ab0594f20c81b1819770ba370939a9b48202b6b12`
- Render start UTC: `2026-09-06T16:37:44.317518+00:00`
- Renderer exit UTC: `2026-09-06T16:50:25.268809+00:00`
- MP4 modification UTC: `2026-09-06T16:50:25.201438+00:00` (ns: `1788713425201437612`)
- QA completion UTC: `2026-09-06T16:54:40.311450+00:00`

Only the two ring rectangles changed in `src/cln/polish-v4.json`: Unavailable `(74,840,572,132) → (74,856,572,108)` and Follow-ups `(132,163,193,44) → (128,159,472,93)`, in original 720×1600 source pixels. The Follow-ups ring now encloses the complete title and subtitle; the Unavailable ring is inset below its required label. The two matching expected-coordinate rows in `tools/verify-cln-v4-polish.cjs` were updated. Timing, pulse/stroke behavior, narration, music, QR, screens, evidence and the other eight ring cues are unchanged.

Twenty final 1920×1080 pre-render stills cover local frames 0,1,6,16,24,38,42,46,47,48 for each correction. Start/mid/end, first/last visible, and both original failure frames were visually inspected before the full render. All 48 pulse frames pass source-glyph geometry clearance, including stroke width and an extra one-pixel sampling allowance: subtitle ≥4.628125 output pixels; WHY UNAVAILABLE ≥5.221875 pixels; title ≥6.736087 pixels. The initial still set was retained after a further four-source-pixel title-corner expansion to meet the chosen 4px clearance gate. No full candidate was rendered for that initial geometry.

Source/typecheck, polish and final preflight each exited 0 immediately before rendering. Full video/audio decode exited 0 with 8,295 frames, no duplicates/drops and an empty error log. ffprobe: H.264 High, **1920×1080**, **30/1 fps**, **8,295 frames**, **276.500000s** video; observed pixel format `yuvj420p`, range `pc`. AAC LC, **48,000 Hz stereo**; container duration **276.544000s**. The extra AAC packaging and measured 2048-sample alignment are recorded without changing source timing.

All **30/30 narration beats** are active and correlate with the unchanged measured master. Full-body correlation **0.9999826480**, signal-to-error **44.5961dB**. Minimum individual correlation **0.9999656807**. This is technical presence/placement QA, not human listening approval.

A supplementary AAC-packet equality assertion exited 1: V3 and V2 compressed packet hashes differ. No compressed-audio byte identity is claimed. The required source-hash and waveform/activity/envelope audits pass; exact packet diagnostics are retained in `verify-audio-packet-comparison.json`.

Intro/outro reference correlation, frame-by-frame fades and peaks pass. Exact source narration samples are zero in both music windows. All 2642 checked narration-free 10ms body windows are silent at the reported -240dBFS floor; maximum body stereo-channel difference is 0.0. No body music bleed or clipping detected; whole-file true peak **-1.64dBTP**. Bookend loudness uses `atrim` before `loudnorm` with measured AAC alignment.

| Bookend | LUFS | True peak dBTP | Reference correlation | Final 10ms RMS dBFS |
|---|---:|---:|---:|---:|
| intro | -13.48 | -1.68 | 0.9999518763 | -133.09 |
| outro | -12.77 | -1.64 | 0.9999617153 | -105.61 |

All ten rings were inspected in encoded start/mid/end sheets plus local 0,6,16,24,38,42,47,48 samples. Both corrected cues also have exhaustive encoded local 0–48 checks, including phone and active enlarged detail. No label overlap was observed; the original failed frames **4708** and **6342** pass with visible safe gaps. The geometry proof and encoded glyph comparisons are retained separately.

| Ring | Encoded interval, end exclusive | Sampled visual result |
|---|---:|---|
| `scan-entry` | 1781–1829 | pass; no overlap observed |
| `inspect-pass` | 2424–2472 | pass; no overlap observed |
| `bulk-eligible` | 2811–2859 | pass; no overlap observed |
| `major-fields` | 3435–3483 | pass; no overlap observed |
| `critical-grade` | 4206–4254 | pass; no overlap observed |
| `unavailable-reason` | 4670–4718 | pass; no overlap observed |
| `bulk-confirm` | 5355–5403 | pass; no overlap observed |
| `follow-queue` | 6304–6352 | pass; no overlap observed |
| `follow-expand` | 6621–6669 | pass; no overlap observed |
| `resolved-bands` | 7540–7588 | pass; no overlap observed |

Home Scan ring remains **[1781,1829)**, followed by the last Home frame **1857** and scanner first frame **1858**. Independent ZXing-C++ decoded the QR from the V3-extracted full-resolution frame **1903** to exactly **`kx75czmzd6hc5d7t4wct58tjm188ea8p`**. No URL or extra whitespace. Scanner controls and the training/controlled-camera disclosures remain unobscured.

**339** exact V3 PNGs were extracted. Every-frame checks covered all **8295** top bands and **7634** operational phone frames, all **26** genuine capture PNGs and **52** adjacent-capture boundary comparisons. Maximum reduced phone RGB error **2.230208/255**; maximum top-band mean **27.828703/255**. The QR rectangle alone is excluded from phone-template comparison and independently decoded. Sampled visuals show no INTERNAL PREVIEW, CAPTURE REQUIRED or evidence/narration blocker labels.

Major grade/reason/recorded acknowledgement, separate Critical NCR, unavailable outcome, Daily 15 confirmation, open bands, Follow-ups sign-off/inner confirmation, no matches, resolved evidence and final Remedial handoff were inspected. Evidence counts and simulation disclosures remain intact. Handoff f7949 is legible with the unchanged 63-frame initial hold and 15-frame reveal.

Fresh reports and proof stills are under `output/cln-verification-v4/verify-v3-polish/`: `verify-v3-polish-report.json`, `verify-v3-polish-report.md`, `verify-media-audio.json`, `verify-screen-sequence.json`, `verify-ring-samples.json`, `verify-rings-qr.json`, `verify-ring-clearance.json`, `verify-encoded-clearance.json`, `verify-prerender-inspection.json` and `verify-preservation.json`. Exact final report/builder-note identities and timestamps are recorded in `verify-artifact-identities.json`.

V1/V2 MP4s, retained V2 QA records, all captures, capture manifest/register, both inventory files, narration/music/QR assets, measured transcripts and other eight rings retain their baseline hashes and modification timestamps. Of 138 previous render inputs, 137 are byte-identical; only `polish-v4.json` differs. HEAD and pre-existing git-status paths/flags are unchanged. No deletions, inventory edit, commit, push, deployment or publication. Follow-up: independent cross-engine review and human listening/visual approval; neither is claimed here.


## Daniel revision V4 — 2026-09-07 (in progress)

Daniel's latest instruction supersedes historical requirements above for persistent
verbose on-screen or spoken simulation disclosures. The sole editorial disclosure
is now **SIMULATION**, in a 300 × 56 px rounded amber rectangle (`#FFC533`), dark
28 px bold text (`#17222C`), 28 px from the top/right of the 1920 × 1080 canvas.
It is outside the full phone and all action/detail regions during screen instruction
and the handoff. Detailed classifications, controlled-camera/QR limitations,
authorizations and source/site/hash evidence remain internal in the unchanged
capture manifest/register and the QR manifest. Preview blocker safeguards remain
internal; they are absent from the candidate composition.

The first instructional screen after the established five-second music opener is
the existing genuine Home PNG, with its bottom Scan control enlarged and ringed.
Home → scanner → unlocked area now precedes the optional planning branch.
“Another route: Bill of Health” explicitly reviews work **before check-in**;
this keeps the earlier QR-locked Due/reference/catalogue screens truthful rather
than implying that the just-unlocked area became locked. The sequence then resumes
inspection after check-in. All original beat durations are retained (8295 frames).

The current mobile source was read only at capture revision
`6999d8eca52fc4f4fff69066dce365f54a609663`. Home's conditional hero really routes to
Scan when not checked in and to zone tasks when checked in. However, the available
Home PNG is scrolled below that hero. No hero CTA image, tap or navigation was
fabricated. Existing bottom Scan and Bill of Health controls provide the displayed
alternatives. Exact source hashes and route references are in
`output/cln-verification-v4/verify-v4-revision/verify-app-source.json`.

No emulator/UI/capture operation was performed: Remedialbuildercodex-5 owns that
lane. Source limitation: existing native app records contain training notes,
including `23-follow-ups-close-training-note.png` (the optional follow-up note says
simulated correction/recheck and no physical work claimed) and the Major finding
shown in `13-major-fail-grade-reason.png` / `22-follow-ups-close-open-item.png`.
These native evidence pixels are preserved, not painted over or presented as an
editorial disclosure. If Daniel requires those saved notes removed as well, clean
replacement app captures are needed from the exclusive capture owner, maintaining
the same grade/reason, action, confirmation controls, counts and actual records.
The Home hero also needs a genuine unscrolled capture if it must be demonstrated.
Neither is required to show the existing bottom Scan path.

Seven spoken beats change: `controlled-scan`, `unlocked`, `home`, `due`,
`inspect-pass`, `major-fields`, `follow-expand`. The remaining 23 source recordings
are reused; the first spoken `scan-entry` receives the established 18-frame lead.
Changed takes that exceeded the existing windows are retained unused, with shorter
replacements measured from actual audio. No durations or words are fabricated.
All ten V3 ring rectangles and pulse geometry are retained; cue times follow the
selected measured recordings. Blue Sea music/settings remain unchanged.

The existing local AGENTS/CLAUDE instruction normally defers rendering to VidStud;
Daniel explicitly requested a new MP4 and bounded stills/full render here, so this
specific task authorizes local rendering. No deployment, publication, commit,
inventory update, playback switch or human/cross-engine approval is performed.
V1/V2/V3 MP4s and prior proofs remain preserved. Claude-2 review remains pending.


### V4 bounded pass completed before full rendering

All 30 measured source clips pass script/receipt/hash/duration/word/cue/PCM placement
and silence checks. Seven recordings changed; 23 were reused. The existing technical
readiness gate references `docs/verify-cln-v4-audio-revision-acceptance.json`; it is
explicitly an automated render-readiness record, not listening or final approval.
Source validation passes 30 checks, isolated TypeScript passes, final preflight passes,
and 35/35 required evidence views remain present. Twenty-one full-resolution stills
cover entry first/ring/last, scanner first/QR, unlocked, alternate Home, Due, all ten
ring cues, follow-up confirmation, handoff and bookends. Their visual inspection
found the SIMULATION banner readable and clear of phone/actions, with no new ring
occlusion. Both previously corrected rings pass all 48 pulse frames against source
glyph masks (minimum safe clearance 4.628125 px).

The single full V4 candidate renderer started at 2026-09-07T04:24:31Z after this
bounded pass, at 1920 × 1080 / 30 fps / 8295 frames, using the same V3 H.264/AAC
settings and concurrency 3. Full-render status and exact stage timestamps are in
`output/cln-verification-v4/verify-v4-revision/verify-render-invocation.json`.

Additional native source notes that need replacement captures if they must be removed:
`15-critical-ncr-grade.png` contains the Critical training reason/action and
`17-couldnt-access-reason.png` contains the simulated access reason/next step.
`verify-copy-changes.json` lists all eight affected source images and the exact seven
old/new spoken lines. These limitations are visible in the candidate; no claim is
made that every native simulation sentence has disappeared.


Encoded inspection additionally confirms the same native notes remain visible behind
the acknowledgement dialogs in `14-major-fail-recorded.png`,
`16-critical-ncr-created.png` and `18-couldnt-access-recorded.png`. Therefore the
complete replacement-capture list has **eight** images, not just the five unobscured
forms/follow-up views identified in the initial bounded pass. Replacement captures
must retain the observed pass/fail/access acknowledgements, counts and outcomes;
no capture or app-state mutation was attempted in this lane.


### V4 render and encoded technical QA completed — 2026-09-07T04:49:06.943891+00:00

Candidate: `/home/durai/Documents/projects/content-engine-cleaning-v4/remotion-branding/output/cln-verification-v4/cln-verification-v4-review-candidate-v4.mp4`; **23,096,076 bytes**;
SHA-256 `36ba66ff3bdae38bf0ddd7ffa9b2a92a6759d50d1437e2dd95f8b74499f9eec3`. The renderer exited 0. Full video/audio decode
passed all 8295 frames with no duplicate/dropped frames. 1920 × 1080, 30 fps,
276.5 seconds of video, H.264 / 48 kHz stereo AAC. No prior MP4 was overwritten.

All 30 encoded narration beats correlate with the measured source master;
full-body correlation 0.999982134, with measured AAC
alignment 2048 samples. Music waveform/gain/fades,
zero narration in music bookends, body silence and peak checks pass. Whole-file
true peak: -1.64 dBTP. No human listening or
final approval is inferred from these technical checks.

Every-frame evidence QA covers 7634 phone frames,
all 26 genuine PNGs and exact adjacent-capture boundaries.
The SIMULATION banner matches the inspected reference throughout all
7965 screen/handoff frames; contrast ratio
10.21:1, 300 × 56 px, 28 px top/right margin. It is outside
the phone, text and all action/ring regions. All ten encoded ring pulses and
exhaustive glyph checks for the two V3 corrections pass. QR decoded from the
encoded scanner frame to exactly `kx75czmzd6hc5d7t4wct58tjm188ea8p`.

Home is the first instruction at frame 150 (00:05), the Scan cue begins at frame
211, and the scanner starts at frame 270 (00:09). Native training notes in the
eight source images listed above remain the capture-limited portion of Daniel's
request. No hero route was fabricated; a genuine unscrolled Home capture is needed
only if the hero alternative must be shown. Claude-2 review remains pending.

Proofs: `output/cln-verification-v4/verify-v4-revision/verify-encoded-qa.json`,
`verify-media-audio.json`, `verify-banner.json`, `verify-rings-qr.json`,
`verify-screen-sequence.json`, `verify-encoded-clearance.json` and
`verify-preservation.json`. Exact changed/new artifact paths are listed in
`verify-modified-paths.json`. No deletion, commit, deploy, publication, inventory
edit, playback switch or final approval occurred.


## Cleaning V4 source/evidence checkpoint — 2026-09-07

Prepared on content-engine dev after Remedial V2 checkpoint
`2b934d5ed340dc3afcd2a55883a791a54e7bc514`. The approved 112-path scope comprises
three additive shared-file modifications, 19 source/validator/document additions,
21 PNG additions and 69 selected audio-provenance JSONs. All historical worktrees,
media and dirty edits remain intact. Remedial code, scripts, dependencies and
registrations are inherited unchanged. The earlier technical audio acceptance JSON
is retained byte-for-byte as historical evidence; it is not human approval.

### Standalone reproduction limits

MP3/WAV/MP4 files, generated output, lockfiles, dependency trees and scratch proofs
are excluded under the existing repository policy. A fresh checkout therefore needs
these retained assets copied locally at their original public-relative paths before
`npm run validate:cln-v4`, `npm run preflight:cln-v4:final`, or
`node tools/verify-cln-v4-audio.cjs` can pass:

- `public/cln-tutorial/v4-audio/narration-314e6621e1e7.wav`, SHA-256
  `913f7fa7a9b112fffbed95950f01597ffc0c4af3089b64559568d1f59a446249`.
- The 30 original MP3s identified, with exact hashes, by `clips[].audio` in
  `public/cln-tutorial/v4-audio/narration-314e6621e1e7-measured.json`.
- `public/cln-tutorial/audio/tutorial.mp3` (Blue Sea), SHA-256
  `f1928a7b68b79b89c843af517583ddc636773e8c4a354e3b610d42611962d186`.

The 32 files above are retained locally for checkpoint validation, not committed.
All 26 genuine capture PNGs, the deterministic QR PNG, selected word transcripts,
provider receipts and their referenced timing retries are available from Git after
this checkpoint (six PNGs are inherited). Historical unselected audio and earlier
QA/output references stay in the original Cleaning worktree; they are not required
by the current validation path. Preserve the approved V4 MP4 and V1/V2/V3 MP4s there.

The tested environment uses Node 22.22.0, TypeScript 5.9.3, Remotion/media/renderer/
bundler 4.0.484, FFmpeg/ffprobe, and Python with qrcode 8.2, Pillow 11.3.0 and
zxing-cpp 2.3.0. Set `CLN_V4_QR_PYTHON` to that Python environment if the default
machine-local `/tmp/verify-cln-v4-polish-qr/bin/python` does not exist. Existing dev
package dependency ranges are preserved, so a new installation must resolve the
compatible tested versions; no lockfile or dependency repinning is included.

No provider credentials or Whisper model are needed to validate retained audio.
Generating replacement narration separately requires the documented series voice,
provider access and measured transcription environment; regeneration is not a way
to reproduce the approved audio bytes. Browser render proofs additionally require
Remotion's Chrome runtime and the retained media. Internal source/site/capture
provenance remains in the manifest and capture register; no mobile worktree or app
operation is required for this source/evidence checkpoint.

### Checkpoint verification

In the isolated checkpoint worktree, `npm run validate:cln-v4` passed the scoped
TypeScript check and all 30 validation checks. `npm run preflight:cln-v4:final`
passed all 30 checks with zero missing capture groups. The independent
`verify-cln-v4-audio.cjs` audit passed 30/30 clips, including full-script matching,
receipt/transcript hashes, word and cue alignment, PCM placement and silence,
for the unchanged 8295-frame / 276.5-second timeline. These checks used the
32 retained ignored media files documented above. No new render was needed;
Claude's APPROVE applies to the exact retained V4 MP4 hash recorded at the top.
Human approval remains pending.
