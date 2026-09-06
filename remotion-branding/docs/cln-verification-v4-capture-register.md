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
