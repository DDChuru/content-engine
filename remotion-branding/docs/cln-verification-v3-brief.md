# Cleaning Verification Tutorial V3 Brief

Status: rendered.

Current reference outputs:

- `../output/cln-verification-tutorial/e-wizerinspection-v2-small.mp4`
- `../output/cln-verification-tutorial/e-wizerinspection-v3.mp4`
- `../output/cln-verification-tutorial/e-wizerinspection-v3-small.mp4`
- V3 duration: 4:00.768
- V3 composition: `CleaningVerificationTutorialV3`
- V3 timing: `src/cln/timing-v3.json`

## Goal

Keep the V2 clarity and severity-guide pattern, but make the operational workflow more explicit. The next version must show every entry and exception step clearly enough that a cleaner, team leader, or supervisor can follow it without guessing.

## Non-Negotiables

1. Do not skip from Home directly into the scan or zone screen without showing the tap target.
2. Show the Home hero scan CTA first.
3. Show the floating control-panel scan button second.
4. Annotate only one scan entry point at a time.
5. Show the scan frame before showing the checked-in zone.
6. Show both scheduled and off-schedule work paths.
7. Explain why work may not appear in today's Due list.
8. Show the app path that covers ad-hoc, holiday, booked extra shift, and rescheduled work.
9. Use app wording from code where possible.

## App Source Facts

Home entry:

- `app/(app)/index.tsx:398` derives the Home hero state.
- `app/(app)/index.tsx:412` says `No tasks scheduled · scan to check in when ready`.
- `app/(app)/index.tsx:413` sets the hero CTA to `Scan QR code` when not checked in.
- `app/(app)/index.tsx:422` sends the hero CTA to `/(app)/scan`.
- `app/(app)/index.tsx:581` renders the hero CTA.

Control-panel entry:

- `components/ui/FloatingNav.tsx:132` defines nav items.
- `components/ui/FloatingNav.tsx:136` defines the central scan item.
- `components/ui/FloatingNav.tsx:167` renders the central scan `Pressable`.
- `app/(app)/_layout.tsx:70` sends scan navigation to `/(app)/scan`.

Scan behavior:

- `app/(app)/scan.tsx:184` documents supported QR matching forms.
- `app/(app)/scan.tsx:211` auto check-in and route to the zone.
- `app/(app)/scan.tsx:290` shows `SCAN ZONE QR`.
- `app/(app)/scan.tsx:313` renders the scan area.
- `app/(app)/scan.tsx:332` says `Position QR code within frame`.
- V3 scan-frame asset: `public/cln-tutorial/shots/v3-phone-02-scanner-frame-qr.png`.
- V3 QR asset: `public/cln-tutorial/zone-qr-super-line-simplot.png`.

Scheduled and off-schedule work:

- `lib/scheduling.ts:43` checks site operating days.
- `lib/scheduling.ts:48` checks excluded dates.
- `app/(app)/zone/[id].tsx:122` defines the Due and Off-schedule views.
- `app/(app)/zone/[id].tsx:193` explains that the schedule is a minimum cadence, not a cap.
- `app/(app)/zone/[id].tsx:202` builds off-schedule tasks from the full zone task catalogue.
- `app/(app)/zone/[id].tsx:702` says off-schedule capture is always available.
- `app/(app)/zone/[id].tsx:721` labels `Off-schedule`.
- `app/(app)/zone/[id].tsx:770` shows `No tasks due today for this zone`.
- `app/(app)/zone/[id].tsx:774` shows `Capture out-of-schedule work`.
- `app/(app)/zone/[id].tsx:815` says `Record work done outside today's schedule. Capture only what you actually did — nothing here is required.`
- `app/(app)/task/[id].tsx:304` falls back to the full cached catalogue when a task is not due today.

## V3 Beat Inserts

Add these beats to the existing V2 structure.

### 1. Home Hero Entry

Placement: after the current intro beat.

Shot needed:

- Home screen with no active presence.
- Hero title: `Scan a zone to check in`.
- Hero CTA: `Scan QR code`.

Visual:

- Annotation rectangle around the hero CTA only.
- Right explainer: `Start from Home`.
- Do not show the floating scan button in the same annotation.

Draft narration:

> From Home, start with the Scan QR code button in the hero. This is the main way to begin your area check-in.

### 2. Control-Panel Scan Entry

Placement: immediately after Home Hero Entry.

Shot needed:

- Same Home screen or any main app screen with floating nav visible.
- Central scan button visible in the bottom control panel.

Visual:

- Annotation rectangle around the central scan button only.
- Optional small connector text: `Same scanner, same check-in path`.

Draft narration:

> You can also use the centre scan button in the control panel at any time. It opens the same scanner and follows the same check-in path.

### 3. Scan Frame

Placement: before checked-in zone screen.

Shot needed:

- `shot-02a-scan-frame-qr.png`.
- Scan screen with `SCAN ZONE QR`.
- `Super Line · Simplot packing line` QR positioned inside the scan frame.

Visual:

- Annotation rectangle around scan frame.
- Keep the QR card inside the scanner frame so the user can see exactly what they are scanning.

Draft narration:

> Point the scan frame at the zone QR. Once the area is recognised, e-wizer checks you in and opens that zone.

### 4. Scheduled Work Path

Placement: after checked-in zone screen and before the first pass/fail example.

Shot needed:

- Zone screen showing Due tab selected.
- Today's progress card.
- Due tasks visible.

Visual:

- Annotation rectangle around `Due`.
- Then move annotation to the progress card or first due task.

Draft narration:

> If work is scheduled for today, it appears under Due. Start there first. These are the checks expected for this zone today.

### 5. No Tasks Showing

Placement: after Scheduled Work Path.

Shot needed:

- Zone screen where Due is selected and the empty state is visible.
- `No tasks due today for this zone`.
- `Capture out-of-schedule work` button visible.

Visual:

- Annotation rectangle around the empty-state text first.
- Then annotation rectangle around `Capture out-of-schedule work`.

Draft narration:

> Sometimes nothing shows under Due. That can happen on a holiday, an extra booked shift, an ad-hoc clean, or a weekly or monthly clean that is not due today.

### 6. Off-Schedule Capture

Placement: immediately after No Tasks Showing.

Shot needed:

- Off-schedule tab selected.
- Hint visible: `Record work done outside today's schedule...`
- Off-schedule tasks visible.

Visual:

- Annotation rectangle around `Off-schedule`.
- Then annotation rectangle around the hint.
- Then move annotation to one task card.

Draft narration:

> Open Off-schedule. This is the full zone catalogue for work done outside today's schedule. Capture only what you actually did. Nothing here is forced.

### 7. Off-Schedule Task Completion

Placement: after Off-Schedule Capture, before returning to the normal pass/fail workflow or as a branch note.

Shot needed:

- Task detail opened from Off-schedule.
- Completion submit state or recorded pass/fail.

Visual:

- Reuse the same task capture visuals as the scheduled path.
- Add a small `Off-schedule` badge in the explainer panel.

Draft narration:

> The capture itself is the same. Pass it if it was clean, or record the remedial action if it was not. The record is still tied to the zone and today's date.

## Required New Shots

Captured from Android emulator on 2026-06-18 using `test@iandj.co.za`:

1. `v3-android-01-home-scan-entry.png` — Home with hero scan CTA and floating control-panel scan button.
2. `v3-android-02-scanner-frame.png` — real scanner frame with `DEV · CHECK IN WITHOUT QR` visible.
3. `v3-android-03-fake-zone-picker-simplot.png` — test zone picker with `Simplot packing line`.
4. `v3-android-04-simplot-due-tasks.png` — checked-in zone, `Due (9)` selected.
5. `v3-android-05-simplot-off-schedule.png` — same zone, `Off-schedule (1)` selected.
6. `v3-android-06-spiral-no-due.png` — checked-in zone, `Due (0)`, `No tasks due today for this zone`, and `Capture out-of-schedule work`.
7. `v3-android-07-spiral-off-schedule.png` — `Off-schedule (4)` list after tapping `Capture out-of-schedule work`.
8. `v3-phone-02-scanner-frame-qr.png` — generated QR-in-scanner composite from the provided `Super Line · Simplot packing line` QR.

Normalized 720x1604 Remotion stills were generated from the emulator captures as `v3-phone-*.png`.

Setup-only captures, probably not part of the main tutorial unless first-run setup is mentioned:

- `v3-android-setup-camera-access-required.png`
- `v3-android-setup-camera-permission-dialog.png`

## Annotation Requirements

Use the existing annotation rectangle/ring language, but be stricter:

- One target per beat.
- Target rectangle centered on the actual UI element.
- Minimum hold: about 1.5 seconds before screen transition.
- If a beat mentions two controls, split it into two beats.
- Render stills for every new annotation before the full render.

## Expected Length Impact

The V3 inserts will likely add 35 to 55 seconds.

Expected final duration:

- About 3:50 to 4:15 if all operational nuance is included.

That is acceptable for this module because the scan entry and off-schedule handling are core field workflow, not optional feature detail.
