# Cleaning Verification V4 genuine-capture register

## Capture identity and scope

- Capture date: **2026-09-06**
- Capture machine: **Machine B**
- Site: **Bakery Demo**
- Signed-in account identifier: **`demo@sunbakebread.co.za`**
- App source: **`6999d8eca52fc4f4fff69066dce365f54a609663`**, verified clean at audit time
- Content worktree base: **`8006cc64957ec5280adcac69d6b370c76cc4c53e`** (initial detached-worktree HEAD)
- Content worktree current HEAD: **`8006cc64957ec5280adcac69d6b370c76cc4c53e`** (`docs(video): record Daniel final approvals`)
- Capture directory: **`remotion-branding/public/cln-tutorial/v4-current-6999d8e/`**

This register covers exactly the six existing files listed below. All six are genuine, uncomposed captures of the current mobile app. There are **no composed operational screens** in this set: no reconstructed UI, substituted operational state, overlaid count, fabricated task result, or simulated app screen is classified as genuine here.

The stopped builder produced no final report. The six files were independently validated by a Claude reviewer and were then revalidated for this register by exact filename, SHA-256, byte size, format, dimensions, and visible content.

No password, token, or other secret is recorded here.

## Validated capture manifest

Every file below is a **720 × 1600, 8-bit RGBA, non-interlaced PNG**.

| # | Filename | SHA-256 | Bytes | Image spec | Classification | Concise screen content |
|---:|---|---|---:|---|---|---|
| 01 | `01-bakery-home-bill-of-health-entry.png` | `a05e7eac47e81a2277803ca9176cc2da63e4be205d455747f57fcac1e6376714` | 169,740 | 720×1600 RGBA PNG | Genuine current-app capture; read-only navigation state | Bakery Demo Home at the action area: two Cleaning remedials awaiting follow-up, Areas Covered `0 / 34`, `0/321` checks done, 22 NCRs, and the Bill of Health entry with badge 3. |
| 02 | `02-bill-of-health-cleaning-verification-entry.png` | `57c737d81d71cfd5b294ea0acb9412e90391791c8bb7930600d68c92a461ce0e` | 161,532 | 720×1600 RGBA PNG | Genuine current-app capture; read-only Bill of Health state | Bill of Health for Bakery Demo on Sun 6 Sept: 2 of 10 pillars clear; Cleaning Verification is row 02 with `0 of 235 checks done (0%)`, `235 cleaning checks missing`, and a `235 pending` UI chip. In this zero-captured baseline only, the chip number equals the missing count; the actual Cleaning Verification pillar counts missing scheduled checks. The visible daily rows also show CCV pending, Remedial open, Daily Hygiene not captured, and Equipment Recon cleared. |
| 03 | `03-cleaning-verification-live-baseline-summary.png` | `720154a539390662e8ded098c2c0ecf2a0fecc1d48a1dcf594341cf60813564a` | 130,509 | 720×1600 RGBA PNG | Genuine current-app capture; live backend-query proof | Cleaning Verification live baseline for Bakery Demo: **235 checks still to do**, **0 of 235 captured**, across **0 of 32 sections**. Premix Area is expanded with 19 outstanding daily checks and visible SSOP references. |
| 04 | `04-premix-area-due-tab-linked-ssop47.png` | `8e8058c12eb90775ee99437654d2d057377fadfe5cffc00a7f7ae79f6759e541` | 129,205 | 720×1600 RGBA PNG | Genuine current-app capture; locked operational route, no result recorded | Premix Area, medium risk, QR-locked. `DUE (19)` is selected, `OFF-SCHEDULE (14)` is visible, and progress is `0 of 19 tasks completed`. The visible daily list includes an unlinked Dispensers item and Blue Covers linked to SSOP47. |
| 05 | `05-premix-ssop47-detail.png` | `2a68b3f9fe302a0bdeb54ee5d1cdc93c2047f273d59b7f36f8883cc09e3da351` | 83,905 | 720×1600 RGBA PNG | Genuine current-app capture; SSOP reference viewed without capture | SSOP47, title `General`, showing Cleaning Inspection Points and Safety / LOTO photo sections. Both state that no photos have been added; neither Add photo action was used. |
| 06 | `06-premix-off-schedule-next-due.png` | `6809994973d075dbc6e35ecfa980e97cb72ae4ae16b8a9c15fa69c0fb71e5848` | 142,378 | 720×1600 RGBA PNG | Genuine current-app capture; locked off-schedule catalogue, no work recorded | Premix Area with `OFF-SCHEDULE (14)` selected and the QR lock still present. The screen explains that nothing is required; the visible weekly items include Roller Doors and Fly Catcher Units with `Next due: Sat, 12 Sept`, including SSOP6 linkage and a no-SSOP warning. |

### Live-query proof

Capture 03 is the backend-query live proof for this baseline. Its rendered values are:

- `235 checks still to do`
- `0 of 235 captured`
- `across 0 of 32 sections`

Those values are recorded from the genuine app screen, not composed or substituted for the video.

## Blocker and mutation assessment

The exact blocker is:

- `demo@sunbakebread.co.za` is not a `test@` account and therefore cannot use the shipped test-account check-in harness.
- The Premix Area operational route requires a physical zone-QR check-in before task completion unlocks.
- The harness is restricted by source to identifiers beginning with `test@`.
- The headless emulator camera path was unavailable for a genuine QR scan.

No pass, fail, unavailable, remedial-close, or five-band mutation was performed. In particular, no action was taken that could populate or move rows among the Cleaning Verification bands **Still to do**, **Follow-up owed**, **Couldn't access**, **Resolved today**, or **Passed**.

Evidence available after the attempt showed no observed mutation: the live baseline remained `0/235`, the Premix route remained visibly QR-locked, the SSOP screen retained its empty-photo state, and the off-schedule screen remained informational. This is an evidence-based **none observed** assessment, not an absolute log proof: an emulator restart cleared the earlier log buffer, so the pre-restart log history was unavailable for retrospective confirmation.

## Runtime state at register creation

Only passive host inspection was used; no ADB command or emulator/Metro control command was issued.

- No running Android emulator/QEMU process was visible in the host process table.
- No running Node/Metro process was visible in the host process table.
- No listener was visible on the standard Metro/Expo ports 8081, 8082, 19000, 19001, or 19002.

This records the stopped state observable from Machine B without querying or changing the device.

## Authorized next path

Do not resume writable capture until Daniel provides or explicitly authorizes out-of-band access to **`test@sunbakebread.co.za`** and confirms its use for Bakery Demo.

The shipped test-account harness may then be used to establish the same app check-in handler state for downstream capture. That setup must be disclosed in the capture record and must **not** be shown, edited, or narrated as proof that a physical QR was scanned. If the video requires a truthful physical-presence claim, a controlled physical Bakery Demo QR and separately authorized camera method are required instead.

## Remaining genuine capture list and required sequence

Capture all open-state Cleaning evidence before closing any Cleaning remedial. A Remedial close can move rows and counts from Follow-up owed into Resolved today, destroying the open-state evidence needed earlier in the story.

### A. Cleaning Verification — capture first, before any remedial closure

1. **Authorized check-in setup and disclosure evidence** — test-account identity visible or separately logged; shipped harness entry and selected Bakery Demo zone recorded as setup evidence, without portraying it as physical presence.
2. **Premix Area unlocked Due state** — `DUE (19)` with completion controls genuinely enabled after authorized check-in.
3. **Single pass path** — clean task before action, pass action, recorded-pass confirmation, and resulting Passed state.
4. **Unavailable path** — unavailable entry screen, required reason/action, submission confirmation, and resulting Couldn't access state.
5. **Fail opens Remedial Action** — failed task and the genuine remedial capture form before data entry.
6. **Finding evidence and grading** — photo source choice where authorized, genuine photo/annotation state, severity guide, and selected Minor/Major/Critical grade.
7. **Finding details and evidence** — capture only the real fields: finding grade, required failure reason, optional action taken, and optional evidence.
8. **Fail submission proof** — confirmation that the failed check/remedial was recorded and time-stamped.
9. **Open-state Cleaning Verification bands** — capture the live rendered bands and counts after pass/unavailable/fail but **before** remedial sign-off: Still to do, Follow-up owed, Couldn't access, Passed, and any genuinely non-zero Resolved today band. Zero-value bands may be absent by design and must not be composed.
10. **Open daily Remedial evidence** — Bill of Health Remedial row, Home follow-up banner, and Cleaning follow-up queue with the newly open graded item, evidence, optional action taken, and `completedBy`: the person who captured the failure, not an assigned owner.
11. **Pass Remaining branch** — eligibility state, confirmation dialog, resulting area completion, and honest record retaining the failure and unavailable outcome.

### B. Cleaning Remedial — only after all open-state Cleaning captures exist

12. **Supervisor review of the open Cleaning remedial** — detail/evidence view before decision.
13. **Accept/close path** — verification note, after-photo only if genuinely supplied, confirmation, and closed result.
14. **Post-close state** — Cleaning Verification Resolved today row/count, changed daily Remedial count, and any genuine all-clear/closed-loop state. If reject is required for the teaching branch, capture it as a separate controlled case and preserve its actual resulting status rather than treating rejection as acceptance.

### C. Inspection Remedials — separate later workflow

15. **Bill of Health carry-over band** — the CARRIES OVER divider and Inspection Remedials row with genuine current count/subtitle.
16. **Inspection finding queue and detail** — an existing authorized finding showing genuine fields that the real UI exposes: status, severity, category/location/description, before/after evidence, created age/time, remedial action and `remedialBy` only if actually rendered, and verification history/time where available. No structured owner/assignee, target date, review date, frequency, or SLA is encoded; do not hunt for or imply one.
17. **Inspection remedial decision path** — remedied/open review and the genuine accept, reject/reopen, escalate, or close controls actually available for that record.
18. **Post-decision carry-over proof** — updated Inspection Remedials state on a later/current Bill of Health without claiming that a cleaning cycle cleared it.

## Two clocks must remain distinct

The Cleaning story and the later Inspection Remedials story run on different clocks:

- **Daily Cleaning clock:** today's scheduled checks produce today's Still to do, Passed, Couldn't access, Follow-up owed, and Resolved today state. A failed Cleaning check remains open in the daily Remedial workflow until supervisor verification/sign-off changes it.
- **Carry-over Inspection Remedials clock:** inspection findings sit below the Bill of Health carry-over divider and persist across day boundaries until their own inspection workflow genuinely closes or escalates them. They are not the same records as daily Cleaning remedials, and no claim should be made that the next high-level clean, cleaning cycle, or frequency automatically clears them.

For that reason, open Cleaning captures come first; Cleaning Remedial closure follows; Inspection Remedials are captured later as a separate carry-over workflow.

## Controlled QR camera scan addendum — 2026-09-06

The operator explicitly authorized this disposable Bakery Demo camera-only check-in using `demo@sunbakebread.co.za`. This addendum extends the original six-file register with capture 07 and supersedes the earlier camera blocker and test-account prerequisite **for this check-in only**. It does not authorize any of the task-result or remedial workflows listed above. The successful scan uses the shipped camera callback, not the test-account harness. It proves a controlled virtual-camera QR scan, not physical attendance at a bakery.

| # | Filename | Capture timestamp (UTC) | App HEAD | Authenticated site / selected zone | Image spec / bytes | SHA-256 | Procedure / visible result | Mutation boundary |
|---:|---|---|---|---|---|---|---|---|
| 07 | `07-bakery-demo-controlled-qr-checkin-unlocked.png` | `2026-09-06T11:17:16.026157Z`–`11:17:16.324948Z` (13:17:16 Africa/Harare) | `6999d8eca52fc4f4fff69066dce365f54a609663`, clean before and after | Bakery Demo: `k57ae8hn0kgercz41hgy6s03mn88fzwd`; Premix Area: `kx75czmzd6hc5d7t4wct58tjm188ea8p` | 720×1600, 8-bit RGBA, non-interlaced PNG; 131,817 bytes | `316e04d7132cf2ad8f4aa382ed9e4572d531a8b080edebdb785fa2b87a39bb72` | Procedure below: virtualscene-image pixels → Expo CameraView → handleBarcodeScanned → local checkIn → automatic zone navigation. Genuine, unmodified `adb exec-out screencap -p`; visibly shows Premix Area, medium risk, **CHECKED IN — TASKS UNLOCKED**, DUE (19), OFF-SCHEDULE (14), 0%, and **0 of 19 tasks completed**, with completion controls enabled. No credentials, overlays, compositing, resizing, or re-encoding. | Normal authentication and local presence persistence only. No Cleaning result, pass, fail, unavailable result, remedial, NCR, photo upload, or application data mutation was submitted; no mutation endpoint was invoked by capture tooling. All five local mutation queues were empty before login and after check-in. |

### Exact capture procedure and evidence

1. Verified the exact mobile worktree `/home/durai/Documents/projects/react-native/e-wizer-mobile-capture-dev` was clean at the required HEAD. No emulator/QEMU or Node/Metro process was running at initial lane inspection, so no stale process needed termination. Started Metro from that worktree with `expo start --dev-client --port 8093 --localhost`. The content worktree HEAD observed at capture was `d85e4c921373c2c551ebc1897a6a5cb926417086`; unrelated concurrent content edits were left alone.
2. Started AVD `e_wizer_api36` on port `5580` with `-no-snapshot-load -no-snapshot-save -gpu swiftshader -feature -Vulkan -camera-back virtualscene -no-window -no-audio -no-boot-anim`. Its initial one-core boot produced Android system-service ANRs. Stopped only that instance and relaunched the same AVD with the same flags plus `-cores 4 -memory 4096`; allowed startup ANRs to settle via Wait. The initial emulator process reported an abort during requested shutdown; the successful scan ran in the second instance. Connected through the developer launcher's URL field to `http://127.0.0.1:8093`, with `adb -s emulator-5580 reverse tcp:8093 tcp:8093`. No deep link was used.
3. Entered the operator-supplied credentials using UIAutomator exact `android.widget.EditText` selection and `set_text`/accessibility setText, then selected SIGN IN. Login succeeded on the first submitted attempt; no credential-bearing screenshot or diagnostic dump was made. Runtime `[OfflineSync] init` reported `isAuthenticated: true`, active site `k57ae8hn0kgercz41hgy6s03mn88fzwd`, and only that ID in `siteIds`. Read the app's RKStorage database into an in-memory SQLite connection, without writing or injecting app storage. The master cache named the site Bakery Demo and mapped Premix Area's exact zone ID to that site, with parent Bread Plant (`kx736zc3vm1k711xw7c88y750988esr5`). The forbidden site `k578brxxgh6qh6b6wgf337f2w5875aah` was absent from the session's runtime log.
4. Navigated Home → Areas Covered → Zones → Bread Plant → Premix Area (with a read-only Production Area detour followed by Back). At `2026-09-06T11:09:05.046189Z`, before QR import or aiming, saved the site/zone evidence and confirmed empty local presence. The selected Premix Area screen visibly said **Scan zone QR to unlock task completion**. All five queues (`@ewizer_offline_queue`, `@ewizer_op_queue`, `@ewizer_audit_answer_queue`, `@ewizer_face_verification_queue`, `@ewizer_form_run_attest_queue`) contained zero entries.
5. Generated a QR encoding only `kx75czmzd6hc5d7t4wct58tjm188ea8p` with Python qrcode (error correction M, box size 24, border 4, black on white). Imported its PNG using `adb -s emulator-5580 emu virtualscene-image wall <temporary-zone.png>` and the equivalent `table` command; both returned OK. Selected the existing SCAN QR button, GRANT ACCESS, and Android's While using the app camera permission. The app displayed the rendered virtual room through its back-camera preview.
6. Used the emulator's authenticated local gRPC controller, port `8580`, solely to aim the virtual camera: three `rotateVirtualSceneCamera` calls with `(x=0, y=1.57079632679)` radians, then `setPhysicalModel` with STEP interpolation, POSITION `(-1.557, 0.32, 4.017)` metres at `11:15:47.210626Z` and ROTATION `(0, -150, 90)` degrees at `11:15:47.499602Z`, placing the camera near the wall poster. No application handler, test picker, deep link, or storage injection was used. Android Camera service identified `com.ewizer.app` as the active camera client. The temporary preview showed the QR as actual scene pixels.
7. Logcat recorded `[Scan] QR data: kx75czmzd6hc5d7t4wct58tjm188ea8p` at `2026-09-06T11:15:53.197Z` and `[Scan] Matched zone: Premix Area` at `11:15:53.207Z`. The normal source path is `app/(app)/scan.tsx` CameraView `onBarcodeScanned` → `handleBarcodeScanned` → `contexts/PresenceContext.tsx` `checkIn` → `router.replace` to the zone. Read-only post-scan storage inspection found one active Premix Area presence, `checkedInAt: 1788693353210` (`11:15:53.210Z`), scoped to the authenticated Bakery Demo identity. All five queues remained empty. UI selectors confirmed the unlocked banner and absence of the lock prompt before capturing the registered PNG directly from emulator 5580. Visually inspected the PNG and verified its dimensions, mode, byte size, and SHA-256 without altering it.

The mutation assessment combines the controlled action sequence, unchanged visible `0 of 19` task progress, empty queues before and after, and source inspection showing check-in writes local presence. It is not a server-wide transaction audit; ordinary login/session activity is distinct from the prohibited application data mutations.

Non-sensitive supporting evidence is retained on Machine B in `/tmp/verify-bakery-qr-20260906/`: `selected-zone-before-scan.log`, `after-scan-state.log`, `scan-events.log`, `camera-aim.log`, `ui-state-evidence.log`, and `final-capture.json`, alongside the emulator/Metro startup logs and `verify-*` proof scripts. Temporary QR and screenshot/XML assets are removed after verification; capture 07 is the sole retained PNG from this attempt. Cleanup and final lane state are recorded below.

### Cleanup and final lane state

Restored both virtualscene wall and table posters to their defaults, then stopped only emulator 5580 and this worktree's Metro 8093 process and its three workers. The successful emulator exited with code 143 after requested shutdown; there was no in-scan emulator crash. The final read-only state check still showed only the authorized Premix Area presence and five empty queues. No app-source changes, commits, pushes, deploys, or releases were made.

Deleted the following temporary files from `/tmp/verify-bakery-qr-20260906/` (full paths and individual justifications also retained in `deleted-artifacts.log`):

| Deleted relative path | Justification |
|---|---|
| `bread-navigation.png` | Temporary navigation capture; final registered proof preserved. |
| `camera-back.png` | Temporary camera-aim capture; scan event evidence preserved. |
| `camera-initial.png` | Temporary camera permission capture; final registered proof preserved. |
| `camera-left.png` | Temporary camera-aim capture; scan event evidence preserved. |
| `camera-ready.png` | Temporary virtual-room preview; scan event evidence preserved. |
| `camera-right.png` | Temporary camera-aim capture; scan event evidence preserved. |
| `camera-wall-pose.png` | Temporary QR preview; scan event evidence preserved. |
| `home.png` | Temporary Home capture; authenticated site evidence preserved. |
| `launcher.png` | Temporary developer-launcher capture; procedure recorded above. |
| `navigation.png` | Temporary navigation capture; final registered proof preserved. |
| `premix-before.xml` | Temporary locked-state UI dump; text evidence preserved in `ui-state-evidence.log`. |
| `premix-unlocked.xml` | Temporary unlocked-state UI dump; text evidence and final PNG preserved. |
| `sections.png` | Temporary section-navigation capture; final registered proof preserved. |
| `zone.png` | Temporary authorized-zone QR input; camera posters restored to defaults. |

## Authorized Bakery Demo operational evidence — 2026-09-06

The resumed operator instruction explicitly authorized synthetic training records through the normal shipped app UI in Bakery Demo. This authorization supersedes the earlier camera-only mutation boundary for this operational session only. All mutations below belong to site `k57ae8hn0kgercz41hgy6s03mn88fzwd`, Premix Area zone `kx75czmzd6hc5d7t4wct58tjm188ea8p`, scheme `k17aac45esrcy49ccdwg361k9h88fzes`, due date `2026-09-06`, frequency **daily**. No other zone was mutated. The prohibited customer site was not active or encountered in the authenticated session. These are genuine current-app pixels and genuine persisted demo operations, with synthetic training content; they do not establish physical attendance, inspection, contamination, correction, or production impact.

Mobile HEAD stayed clean at `6999d8eca52fc4f4fff69066dce365f54a609663`. Content worktree HEAD was `d85e4c921373c2c551ebc1897a6a5cb926417086`. Scenario: `bakery-demo-cleaning-v4-2026-09-06`. Machine B; AVD `e_wizer_api36`, emulator 5580; all timestamps below are UTC (Africa/Harare = UTC+02:00). Numbered captures supply eventOrder values 8–26; prior capture 07 remains eventOrder 1. The existing empty manifest slots proposed no filenames, so the new files use their numbered slot/view names. No existing filename was repurposed to describe a different state.

### Procedure, sequencing, and scope proof

1. Read the current capture manifest, V4 contract, builder notes and register. Verified the exact mobile HEAD and clean tree, required asset directory and documents. Inspected lane processes before starting; no stale instance needed termination. Started the exact worktree's Metro with `expo start --dev-client --port 8093 --localhost` and emulator with `-avd e_wizer_api36 -port 5580 -no-snapshot-load -no-snapshot-save -gpu swiftshader -feature -Vulkan -camera-back virtualscene -no-window -no-audio -no-boot-anim -cores 4 -memory 4096`. Connected using the normal developer-launcher URL field and ADB reverse 8093. A launcher URL error was corrected through that field; it was not an authentication failure. The existing authenticated demo session restored without re-entering credentials.
2. At `2026-09-06T12:10:57.660159Z`, before QR import/aiming, runtime auth listed only the allowed site and read-only in-memory RKStorage inspection mapped Premix Area to Bakery Demo. Today's completion cache was empty and all five queues were empty. The prior local Premix presence was restored. Profile later independently showed Bakery Demo / active Premix Area. No storage write or injection was performed by tooling.
3. Opened the shipped scanner and captured 08's live CameraView before aiming. Generated a QR containing only the exact allowed zone ID; imported it into virtualscene wall/table through `adb emu virtualscene-image`. Authenticated emulator gRPC camera controls set STEP position `(-1.557, 0.32, 4.017)` and rotation `(0, -150, 90)` at `12:12:47.289879Z` / `12:12:47.296379Z`. The normal decoder logged the zone QR at `12:13:04.144Z`, matched Premix at `12:13:04.171Z`, and local check-in persisted `checkedInAt=1788696784269` (`12:13:04.269Z`). CameraView pixels → handleBarcodeScanned → checkIn → normal zone navigation; no handler invocation, deep link, harness, or fake UI. The post-scan state at `12:13:42.253358Z` still had zero completions. Capture 07 remains the earlier registered unlocked proof; capture 09 also shows the current unlocked state before operations.
4. Inspected the real pending Dispensers row in the app and recorded one individual training pass using its shipped inline check control. Capture 09 shows **Inspect 1 first** before it; 10 shows the saved pass and 11 the enabled **Daily Pass all (18)**. The boolean-row implementation saves directly, without a separate confirmation dialog or free-text inspection field. This is an actual persisted app pass in an authorized simulated inspection, not a claim that equipment was physically inspected.
5. Preserved exception scenarios before bulk completion: submitted Blue Covers Major, Tables Critical, and Mixing Bowls Unavailable through their real forms with the exact training texts below. Optional photos were omitted because no real defect or correction was photographed. A first Major form draft was dismissed without submission and re-entered; only one Major completion was created. Critical's acknowledgement said an NCR was raised. The bulk dialog then offered exactly the remaining 15 **daily** checks in **Premix Area**, excluding the individual pass and the three exception occurrences. Confirmed that dialog normally. Fourteen off-schedule weekly items were untouched. The final zone view shows 19/19 completed while failed/unavailable rows persist; Tables explicitly shows NCR raised.
6. Navigated Home → Bill of Health → Cleaning Verification. Before any closure the live Bakery Demo summary showed 216 still to do, 16 passed, 2 follow-up owed and 1 couldn't access (19/235 captured). Then Bill of Health → Remedial opened **Follow-ups**. Filtered to Blue Covers; its Major finding, reason/action and **CONFIRM FOLLOWED UP** remained visible. Selected that button, entered the explicit simulated follow-up note, omitted the optional photo and selected the inner **CONFIRM**. The same filtered queue became No matches and total open Cleaning remedials fell 4→3; the two pre-existing items were untouched. Reopened Cleaning Verification: all five bands were present and the expanded **Resolved today** band named Blue Covers / Premix Area.
7. Used Profile → Data sync → **Sync now**. At `2026-09-06T12:34:01.481319Z`, read-only cached server results contained all 19 completion IDs, the Critical NCR link, the Major accepted verification with its server timestamp and exact note, and five empty queues. No direct backend mutation call was made by tooling. Persisted result timestamps below are from this synced snapshot, superseding slightly different optimistic local timestamps in intermediate snapshots. This is evidence of these controlled operations, not a server-wide transaction audit.

### Registered operational PNGs

Every row is a visually inspected, unmodified `adb -s emulator-5580 exec-out screencap -p` PNG: **720×1600, 8-bit RGBA, non-interlaced**. No resize, re-encoding, compositing, reconstructed UI, or credential-bearing screenshot. All files are under `public/cln-tutorial/v4-current-6999d8e/`. The site/zone, HEAD, scenario and mutation boundary above apply to every row. Capture 24 is supplemental closed-result proof, not an extra contract key. Capture 23 supplies the contract's inner-confirmation view; capture 26 supplies the explicit resolved-today item view. The curated mapping below supersedes provisional proof labels in the raw capture log.

| File | Capture interval UTC | Contract slot / views | Bytes | SHA-256 | What it proves |
|---|---|---|---:|---|---|
| `08-qr-check-in-scanner.png` | `2026-09-06T12:12:08.540050Z`–`2026-09-06T12:12:19.815679Z` | `qr-check-in` / `scanner` | 546,351 | `339e99f49e71c5a0a9cd6388f826d9c3e34dc36099e21840f37ae9f6aa9ce578` | Live SCAN ZONE QR CameraView showing the emulator virtual room before the repeat genuine decode; controlled virtual-camera QR scan, no physical attendance claim. |
| `09-single-pass-inspection.png` | `2026-09-06T12:15:13.540994Z`–`2026-09-06T12:15:14.667497Z` | `single-pass` / `inspection` | 132,594 | `5fd082c40a85ee58680e83f0f68d9d1c3ce1066fd09ec2ee8001a4bde8e21a5a` | Premix unlocked; Dispensers pending; 0 of 19 and Inspect 1 first. Before the individual Daily pass; the shipped inline boolean control is the inspection entry. |
| `10-single-pass-confirmed.png` | `2026-09-06T12:16:03.996940Z`–`2026-09-06T12:16:05.268444Z` | `single-pass` / `confirmation`, `passed` | 137,624 | `c190d48f47546f4a4ae70d69acb4c114368701f9fa600a577cac7df3f088b9d4` | Individual Dispensers pass saved: green completed row and UNDO, 1 of 19 (5%). This inline saved state is both confirmation and Passed evidence; this control has no separate confirmation dialog. |
| `11-frequency-pass-all-eligible.png` | `2026-09-06T12:16:08.482760Z`–`2026-09-06T12:16:10.149362Z` | `frequency-pass-all` / `eligible` | 144,559 | `c5b73704dc599e0b056c39aab0b4a1cf901bb479a69a457bc027a8101f6bb912` | Daily Pass all (18) is enabled after the one individual Daily Dispensers pass; initial disabled Inspect 1 first is in capture 09. |
| `12-major-fail-form.png` | `2026-09-06T12:17:10.625104Z`–`2026-09-06T12:17:10.944357Z` | `major-fail` / `form` | 114,913 | `aac54aa7065e7d52d37d37f872246247203bab943d9a5b22977f4cdba0d343a7` | Blue Covers / Premix Area Remedial Action form, grade choices and optional empty photo field before entering the Major training example. |
| `13-major-fail-grade-reason.png` | `2026-09-06T12:18:19.310139Z`–`2026-09-06T12:18:19.622785Z` | `major-fail` / `grade-reason` | 133,766 | `25196a2b2f77020135b5efb21fe3f316c2e9b4df2adf44f76a81d1cf6f475eb9` | Major selected with the full truthful synthetic training reason and action, no photo, and submit control visible. |
| `14-major-fail-recorded.png` | `2026-09-06T12:18:53.165887Z`–`2026-09-06T12:18:54.646611Z` | `major-fail` / `recorded` | 113,557 | `dbfbf8209296f3126bb8ec69460c91a3417b03b4850729a75ea6d602c55ba7d7` | Normal app Task Completed / Your completion has been recorded acknowledgement after submitting the Major failure. |
| `15-critical-ncr-grade.png` | `2026-09-06T12:20:40.679866Z`–`2026-09-06T12:20:40.960254Z` | `critical-ncr` / `grade` | 134,169 | `6409de9383269af3ef03e0611183ae80eb50c9de512a7bb41bd2d188c58c5b5d` | Separate Tables Critical selection with truthful synthetic training reason/action; no real defect or live-production claim. |
| `16-critical-ncr-created.png` | `2026-09-06T12:21:04.747949Z`–`2026-09-06T12:21:05.029807Z` | `critical-ncr` / `ncr-queued` | 119,977 | `bff05b336a0b06fca864c3ce351258db3fa16bd50c56866adfa43dbf9830a60c` | Critical finding recorded / An NCR has been raised for this critical finding. Created satisfies contract ncr-queued; later synced record contains the linked NCR ID. |
| `17-couldnt-access-reason.png` | `2026-09-06T12:22:36.602407Z`–`2026-09-06T12:22:38.019365Z` | `couldnt-access` / `reason` | 134,416 | `4706f86ce5f4bce20c44b9b7557cb940cf65c3c066078e8b64cdd5c8120bef72` | Mixing Bowls Unavailable form with truthful synthetic access restriction and simulated next step. |
| `18-couldnt-access-recorded.png` | `2026-09-06T12:23:26.897820Z`–`2026-09-06T12:23:27.186355Z` | `couldnt-access` / `recorded` | 116,705 | `9558db42c6bfe5cb498ed413162af969a24bbbf31647d00f3a5d4d1f1b4bceb6` | Unavailable recorded / Availability note recorded for follow-up acknowledgement after normal submission. |
| `19-frequency-pass-all-confirmation.png` | `2026-09-06T12:23:53.663133Z`–`2026-09-06T12:23:53.988041Z` | `frequency-pass-all` / `confirmation` | 147,793 | `688383fe150e4724ef0539fc34fe4629f5fc417a7f9fb8fa48988bf7e450d32d` | Pass all daily (15): dialog explicitly limits the operation to 15 Daily checks in Premix Area. The four already captured occurrences are excluded. |
| `20-frequency-pass-all-result.png` | `2026-09-06T12:24:55.181849Z`–`2026-09-06T12:24:55.457882Z` | `frequency-pass-all` / `result` | 153,443 | `2ba49239982309fe06ffb89a30ee4b34316911aec78359f220e225ee16234ae9` | 19 of 19 (100%) after Daily bulk pass; Dispensers green, Blue Covers red, Tables red with NCR raised, Mixing Bowls orange. Completed occurrence does not mean passed. |
| `21-four-band-open.png` | `2026-09-06T12:30:04.566165Z`–`2026-09-06T12:30:04.878767Z` | `four-band-open` / `still-to-do`, `passed`, `follow-up-owed`, `couldnt-access` | 132,943 | `e492017102a9a0221d1dbc43434cdeaf5ec4408435eab38a6941cb1de73be0ce` | Bakery Demo dated summary before any closure: 216 still to do, 16 passed, 2 follow-up owed, 1 could not access; 19 of 235 across 1 of 32 sections. |
| `22-follow-ups-close-open-item.png` | `2026-09-06T12:30:49.164096Z`–`2026-09-06T12:30:49.444783Z` | `follow-ups-close` / `queue`, `confirm-followed-up` | 135,028 | `3a8e6c92435cf0b2392d9a81383db5830dd14186a66bc540f922b110ef82ce14` | Follow-ups Cleaning queue filtered to Blue Covers; Premix Major training finding remains open with its reason/action and CONFIRM FOLLOWED UP button. Four total open cleaning remedials include two pre-existing items. |
| `23-follow-ups-close-training-note.png` | `2026-09-06T12:31:34.008098Z`–`2026-09-06T12:31:34.321386Z` | `follow-ups-close` / `confirmation` | 149,875 | `12bdde3109384cbf840bbd08a4e7f092cdfa6e11aae19786add676a4cfb7d729` | Actual optional follow-up training note and inner CONFIRM after selecting CONFIRM FOLLOWED UP. No photo supplied. Canonical contract confirmation view. |
| `24-follow-ups-close-confirmation.png` | `2026-09-06T12:31:52.079090Z`–`2026-09-06T12:31:52.348708Z` | `follow-ups-close` / supplemental closed result | 85,017 | `cde5cc5cb8cb735d13c31603a6ac7fd9d8ee269a26d8fa5a26a2ac12a8a34640` | Supplemental closed result: unchanged Blue Covers search now has No matches and total open cleaning remedials drops from 4 to 3. No success dialog exists in this flow. |
| `25-five-band-resolved-today.png` | `2026-09-06T12:32:10.790108Z`–`2026-09-06T12:32:11.062356Z` | `five-band-resolved` / `still-to-do`, `passed`, `follow-up-owed`, `couldnt-access` | 133,409 | `dfe081534596f143b10368bcf5f90729555334d49077a79dc27471b911e2194c` | Bakery Demo dated five-band summary after Major closure: 216 still to do, 16 passed, 1 follow-up owed, 1 could not access, 1 resolved; 19 of 235 remains unchanged. |
| `26-five-band-resolved-item.png` | `2026-09-06T12:33:18.445212Z`–`2026-09-06T12:33:18.708146Z` | `five-band-resolved` / `resolved-today` | 119,136 | `b374e795b9baadd3a6ae79f54f0fbc1d32807c92031752e7b5c287a383fb4e87` | Resolved today expanded: Blue Covers / Bread Plant / Premix Area / daily / SSOP47 under Failed and signed off; remaining 216, follow-up owed 1, could not access 1 and passed 16 remain visible. |

### Exact persisted training mutations

All 19 rows below have the allowed site/zone IDs and daily due date given above. One individual pass and 15 bulk passes produce 16 passes total; the other outcomes are two failures and one not_done. No structured owner/assignee was created or claimed. The account is the acting Bakery Demo Site Manager, not an assignee.

| Task | Scheme item ID | Completion ID | Server completedAt UTC | Result / action |
|---|---|---|---|---|
| Dispensers | `jx74eszfza3fw0bx49q1bt27fx88fa42` | `r17ah05bq6rwq785jb7namr4n18dx6rx` | `2026-09-06T12:15:32.484Z` (`1788696932484`) | individual inline training pass |
| Blue Covers | `jx720cxpnw26j15dn5nk4pdq9d88ecwj` | `r17cdthccav5rx1621x1522evh8dwx5m` | `2026-09-06T12:18:21.627Z` (`1788697101627`) | fail / major |
| Tables | `jx70n8xrf4qf6bgwcrnh6hn46d88fhgc` | `r171w4f0hy2hnkhrc7pxam9vph8dxrga` | `2026-09-06T12:20:43.010Z` (`1788697243010`) | fail / critical |
| Mixing Bowls | `jx7cc0ddwrtq86gmhcj7cj9vvh88ewnv` | `r173jw73m7swx1yes1zkgkd7cx8dwp80` | `2026-09-06T12:22:43.116Z` (`1788697363116`) | not_done / unavailable |
| Walls Spot Cleaned | `jx781fs7g87hq8mqafp7pejyg988fpve` | `r17azkc5yz1mncksct8mk45nax8dwj7x` | `2026-09-06T12:23:55.848Z` (`1788697435848`) | frequency-scoped Daily bulk training pass |
| Trolleys | `jx7brrm0nbm5d16d89qtm49vgh88ffq4` | `r177mk1bw3c9fgxarjskz932x18dx392` | `2026-09-06T12:23:56.207Z` (`1788697436207`) | frequency-scoped Daily bulk training pass |
| Scales | `jx7049r8qg9wvap601d52k3e8x88f98a` | `r17ay7g2e6df169zy1qs9q8t0n8dxk9s` | `2026-09-06T12:23:56.569Z` (`1788697436569`) | frequency-scoped Daily bulk training pass |
| Bait Stations | `jx756s54ja2d8t5vdek3f954bn88e4aq` | `r17czyxtc7e2ejp1ra3rr1h1dd8dx5m0` | `2026-09-06T12:23:56.992Z` (`1788697436992`) | frequency-scoped Daily bulk training pass |
| Floors | `jx789mk329se7vq44x12rd4wwn88fy3f` | `r178b3bbvx9fx2bqzcfpe8sjyx8dxdde` | `2026-09-06T12:23:57.376Z` (`1788697437376`) | frequency-scoped Daily bulk training pass |
| Premix Buckets | `jx7b28bnn60pe1hny5294e7amd88epzr` | `r17467xctvfcamftftezx6ahbd8dwv67` | `2026-09-06T12:23:57.786Z` (`1788697437786`) | frequency-scoped Daily bulk training pass |
| Waste Bins | `jx77mnp8dxpg8yvngcrcjxef0988fsgc` | `r17d2fbak7chm6z9a2ekvvfztd8dwb9r` | `2026-09-06T12:23:58.271Z` (`1788697438271`) | frequency-scoped Daily bulk training pass |
| Wash basin | `jx7apabdq4njwszta55yhwb4px88e052` | `r17878425hpsd2ynzmy05t7dkn8dw79r` | `2026-09-06T12:23:58.612Z` (`1788697438612`) | frequency-scoped Daily bulk training pass |
| Floor Railings | `jx7058mpz1prgt016krz8kab0h88e08j` | `r17c7ckj18q4des4a0bqe09mf18dw2vc` | `2026-09-06T12:23:59.103Z` (`1788697439103`) | frequency-scoped Daily bulk training pass |
| Diosna Mixers | `jx7emath5wqe2g6skdfhm6znqh88epbs` | `r17bd9ktrvg71kkkmxt9amf21x8dwpwk` | `2026-09-06T12:23:59.522Z` (`1788697439522`) | frequency-scoped Daily bulk training pass |
| Bakery Utensils | `jx785cdpvn0f3zmp5r0z6c7kxh88ey6n` | `r170e4mg1jn1mk8pe9mwj8028x8dw9d6` | `2026-09-06T12:23:59.884Z` (`1788697439884`) | frequency-scoped Daily bulk training pass |
| Fire Extinguishers | `jx770avhdqzhz8hk6mb7n0rj8d88fhan` | `r1768hr4x8w3a7s89tkypj5yj98dw0ed` | `2026-09-06T12:24:00.236Z` (`1788697440236`) | frequency-scoped Daily bulk training pass |
| Prodution Manager Office | `jx77cwgbhcvdsce3ww4wtb6jxd88esmn` | `r17d30m7hzbpbtgajvsxqgt89n8dx4dn` | `2026-09-06T12:24:00.618Z` (`1788697440618`) | frequency-scoped Daily bulk training pass |
| Lift | `jx790affbrfjdq2bygddgmdtwx88e1gv` | `r17epahjmdxy1tcc4yf7da8w418dw5ha` | `2026-09-06T12:24:00.987Z` (`1788697440987`) | frequency-scoped Daily bulk training pass |
| Coldroom Inside | `jx7ewp78rxqsm49yjt3q98djbh88ejca` | `r17dfdhkrf5ghjhp9h67408f558dxnbs` | `2026-09-06T12:24:01.361Z` (`1788697441361`) | frequency-scoped Daily bulk training pass |

Exact synthetic text and linked outcomes:

- **Major / Blue Covers** — reason: “Bakery Demo training only: simulated residue; no real defect.” Action: “Training: simulate cleaning, then recheck; no real work claimed.” No photo was supplied.
- **Critical / Tables** — reason: “Bakery Demo training only: simulated gross soiling; no real defect.” Action: “Training: simulate isolation and NCR escalation; no live production affected.” No photo was supplied.
- **Unavailable / Mixing Bowls** — reason: “Bakery Demo training only: simulated access restriction; no real outage.” Action: “Training: arrange simulated access and recheck before cleaning.” No photo was supplied.
- **Critical NCR created:** `rx7dgxae4cnc7rm2k7pqdvf30x8dw98r`, linked to completion `r171w4f0hy2hnkhrc7pxam9vph8dxrga`. Capture 16 proves the created acknowledgement, capture 20 shows NCR raised, and the final synced snapshot proves the ID. The NCR remains open; no NCR closure/escalation action was performed separately.
- **Major follow-up closure:** existing completion `r17cdthccav5rx1621x1522evh8dwx5m` was verified at `2026-09-06T12:31:36.313Z` (`1788697896313`), verificationResult `accepted`, via Follow-ups → CONFIRM FOLLOWED UP → inner CONFIRM. Exact note: “Bakery Demo training only: simulated correction and recheck completed; no real defect or physical work claimed.” No after-photo. Its stored result remains `fail`; the accepted verification moves its daily band to Resolved today.

### Coverage, product behavior, and handoff

All nine groups / 26 previously missing evidence views are now captured and mapped above. A single genuine PNG supplies multiple views only within its own slot (10, 21, 22 and 25). No PNG hash is reused across slots. The real UI's inline pass confirmation is the persisted green row, and Follow-ups closure confirms by removing the matching item rather than displaying a success alert. These differences are disclosed rather than fabricating dialogs. The optional follow-up note and inner CONFIRM are preserved in 23, with closed result in 24 and resolved item in 26.

The fail-versus-due distinction is directly evidenced: the failed scheduled occurrences count toward 19 captured and clear those due occurrences, while their findings remain in Follow-ups until separately verified. Closing Major changes follow-up owed 2→1 and resolved 0→1 without changing 19 captured, 16 passed, 1 unavailable or 216 still to do. Critical remains open with a created NCR. Pass all was unavailable before the first real app inspection/pass, became available for that same Daily frequency afterward, and submitted only 15 remaining Daily occurrences in the selected zone.

The V4 TS/JSON, builder notes, inventory and Remedial storyboard were not edited. Therefore the checked-in manifest still reports its original nine groups / 26 missing views until a later authorized integration maps these reviewed files; this capture task does not claim the final-render gate is cleared or narration approved. Empty slots supplied no contradictory required filename. An in-memory candidate mapping is retained in `verify-capture-records.json`; it is provenance for integration and not a source-manifest edit or reviewer approval.

Supporting non-sensitive records remain in `/tmp/verify-bakery-ops-20260906/`: raw `captures.jsonl`, curated `verify-capture-records.json`, `capture-rejections.jsonl`, `ui-events.log`, `scan-events.log`, `camera-aim.log`, `camera-service.log`, the baseline/intermediate/final scoped state snapshots, emulator/Metro logs, `shutdown.log`, `deleted-artifacts.log`, and `verify-*` scripts. The provisional capture 09 still showing the scanner was rejected after visual inspection; its old hash is preserved in the rejection log, and only the settled genuine recapture is registered above. No rejected trial is counted as evidence.

### Operational cleanup

Restored virtualscene wall and table defaults. After the final synced state and all captures, requested clean shutdown of only emulator 5580 and the exact worktree's Metro 8093 plus its three verified workers. Registered PNGs 07–26 are preserved. No commit, push, deploy, release, app-source edit, or unrelated-process termination occurred.

Deleted paths in this session (explicit temporary-artifact cleanup only):

| Path | Justification |
|---|---|
| `/tmp/verify-bakery-ops-20260906/zone.png` | Temporary allowed-zone QR input; posters restored and registered evidence retained. |
| `/home/durai/Documents/projects/content-engine-cleaning-v4/remotion-branding/public/cln-tutorial/v4-current-6999d8e/09-single-pass-inspection.png` (rejected trial bytes only) | Removed the premature unregistered scanner trial; recaptured the settled inspection view under the same filename. The current registered PNG is preserved. |

Final verification at `2026-09-06T12:39:02.049Z`: all 19 new PNG byte sizes, SHA-256 values and RGBA dimensions matched this register. The unmodified V4 contract accepted the in-memory real-file mapping, including chronology and Daily frequency; no required views remained missing in that candidate. The source manifest was not changed. Protected-file hashes matched; mobile git status/diff were empty at the required HEAD. All five verified lane PIDs had exited and no temporary PNG/XML/JPEG input remained. Exact asset/mobile git status and diff logs, plus `verification-results.json`, are retained in the operational evidence directory. The asset tree retains pre-existing package/Root/V4 work; this session added only PNGs 08–26 and this register addendum.
