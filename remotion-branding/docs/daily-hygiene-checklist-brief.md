# Daily Hygiene Checklist Tutorial Brief

Status: draft for next tutorial track.

Target output:

- 2 to 4 minute e-wizer module tutorial.
- 16:9, 1920x1080, 30 fps.
- Same field-guide pattern as Cleaning Verification V3.
- Branded intro/outro can reuse the `CleaningVerificationTutorialV3Branded` pattern.

## Goal

Teach the Daily Hygiene Checklist as a clear hygiene record for the shift.

The user must understand this order:

1. Make sure the right shift/site context is ready before starting.
2. Start the Daily Hygiene checklist from Home.
3. Create the right checklist checkpoint and tie it to a shift.
4. Indicate operatives who are absent or off duty first, so the checklist does not create hygiene outcomes for people who were not working.
5. Check at least one operative who is present.
6. If everything is fine, use `Pass all remaining clear`.
7. If there are issues, record each affected operative as an exception with the failed criterion and action taken.
8. Once the real issues are captured, use `Pass all remaining clear` only for the remaining clear operatives.
9. Complete the session.

## App Source Facts

Home entry:

- `app/(app)/index.tsx:716` labels the action `Daily Hygiene Checklist`.
- `app/(app)/index.tsx:719` routes that tile to `/(app)/hygiene`.

Checklist list screen:

- `app/(app)/hygiene/index.tsx:2` defines this as pre-shift / during-shift personnel hygiene check sessions.
- `app/(app)/hygiene/index.tsx:45` reads `hygieneSessions`, `masterData`, `operatives`, and `createHygieneSession`.
- `app/(app)/hygiene/index.tsx:46` reads `siteShifts`.
- `app/(app)/hygiene/index.tsx:47` counts active operatives.
- `app/(app)/hygiene/index.tsx:102` labels the primary action `+ New hygiene checklist`.
- `app/(app)/hygiene/index.tsx:109` says `No hygiene checklists yet today.`
- `app/(app)/hygiene/index.tsx:138` labels the modal `New hygiene checklist` or `Pick the shift`.
- `app/(app)/hygiene/index.tsx:146` asks `When is this check happening?`
- `app/(app)/hygiene/index.tsx:27` defines the checkpoints as `Start of shift` and `During shift`.
- `app/(app)/hygiene/index.tsx:162` says `Start of shift — tie to a shift` or `During shift — tie to a shift`.
- `app/(app)/hygiene/index.tsx:171` allows `Skip · no specific shift`.

Session detail screen:

- `app/(app)/hygiene/[id].tsx:2` defines the detail screen as a per-operative attestation roster.
- `app/(app)/hygiene/[id].tsx:3` says each operative is marked `CLEAR / EXCEPTION / OFF-DUTY`.
- `app/(app)/hygiene/[id].tsx:4` says an exception captures a criterion, action, and optional photo.
- `app/(app)/hygiene/[id].tsx:181` computes `allAttested`.
- `app/(app)/hygiene/[id].tsx:184` defines the pass-all gate: off-duty does not unlock pass-all; at least one real `clear` or `exception` verdict is required.
- `app/(app)/hygiene/[id].tsx:254` provides `Search operatives…`.
- `app/(app)/hygiene/[id].tsx:276` shows the status picker options: `Clear ✓`, `Exception ✕`, `Off duty`.
- `app/(app)/hygiene/[id].tsx:285` says `Mark one operative clear, or flag an exception, before passing the rest`.
- `app/(app)/hygiene/[id].tsx:286` labels the shortcut `Pass all remaining clear`.
- `app/(app)/hygiene/[id].tsx:287` labels final sign-off `Complete session`.
- `app/(app)/hygiene/[id].tsx:217` confirms `The hygiene checklist is complete.`

Operative setup:

- `app/(app)/operatives/index.tsx:2` defines the staff list.
- `app/(app)/operatives/index.tsx:184` shows each operative's allocation count.
- `app/(app)/operatives/[id].tsx:5` describes dynamic role and zone allocations.
- `app/(app)/operatives/[id].tsx:307` uses `allocateToZone`.
- `app/(app)/operatives/[id].tsx:647` displays allocated zones.
- `app/(app)/operatives/[id].tsx:847` labels already allocated zones as `ALLOCATED`.

## Non-Negotiables

1. Do not begin on the checklist detail screen without showing how the user enters Daily Hygiene.
2. Show the Home tile `Daily Hygiene Checklist`.
3. Show `+ New hygiene checklist`.
4. Show both checkpoint options: `Start of shift` and `During shift`.
5. Show shift selection, because the checklist is best when tied to the actual shift.
6. Include a setup note that the shift/site context should be ready before the checklist starts.
7. In the checklist, indicate absent/off-duty operatives first.
8. Explain that `Off duty` is not a hygiene verdict and does not unlock `Pass all remaining clear`.
9. Show the pass-all gate locked first.
10. Unlock pass-all by marking one present operative `Clear`, or by recording one real `Exception`.
11. If there are issues, show the exception modal and record criterion + action taken before bulk passing the rest.
12. Finish on `Complete session`, not on pass-all.

## Beat Plan

### 1. Promise

Visual:

- Branded field-guide title: `Daily Hygiene Checklist`.
- Three blocks: `Shift context`, `Check people`, `Complete proof`.

Narration:

> Daily Hygiene creates a clear hygiene record for the shift. You confirm who is present, indicate who is off duty, and record whether each working operative is clear or needs action.

### 2. Setup Before The Shift

Visual:

- Staff / operative setup screen.
- Annotation on allocation count or allocated zones.
- Small side panel: `Best experience: active operatives allocated before shift`.

Narration:

> Before the checklist starts, make sure the site and shift context is ready. The checklist then uses that context so you can focus on the hygiene check itself.

### 3. Enter From Home

Visual:

- Home screen.
- Annotation rectangle around `Daily Hygiene Checklist`.

Narration:

> From Home, open Daily Hygiene Checklist. This takes you to today's hygiene sessions for the site.

### 4. Start A Checklist

Visual:

- Daily Hygiene list screen.
- Annotation around `+ New hygiene checklist`.
- Empty state `No hygiene checklists yet today.` if available.

Narration:

> Tap New hygiene checklist. If there are no sessions yet today, this is the first record for the shift.

### 5. Pick The Checkpoint

Visual:

- Modal showing `Start of shift` and `During shift`.
- Annotate one option at a time.

Narration:

> Choose when the check is happening. Use Start of shift for the first hygiene check. Use During shift when you are checking the team again later.

### 6. Tie It To The Shift

Visual:

- `Pick the shift` modal.
- Show a real shift option first.
- Briefly show `Skip · no specific shift` only as fallback.

Narration:

> Tie the checklist to the shift whenever you can. That keeps the record clear for supervisors and avoids confusion about which team was checked.

### 7. Checklist Opens

Visual:

- `DAILY HYGIENE CHECKLIST` detail screen.
- Header with checkpoint, shift, date.
- Operatives list with `NOT CHECKED`.

Narration:

> The checklist opens with the operatives for that shift context. Every operative shown must end with a status before the session can be completed.

### 8. Indicate Off-Duty Or Absent First

Visual:

- Tap an operative.
- Status picker with `Clear ✓`, `Exception ✕`, `Off duty`.
- Select `Off duty`.
- Show row changing to `OFF DUTY`.

Narration:

> Start by indicating anyone who is off duty or absent from the shift. This keeps the record honest before you check the people who are actually present.

### 9. Explain The Gate

Visual:

- Footer with disabled `Pass all remaining clear`.
- Gate hint: `Mark one operative clear, or flag an exception, before passing the rest`.
- Side explainer: `Off duty is absence, not a hygiene verdict`.

Narration:

> Off duty does not unlock pass-all, because it is not a hygiene result. The app needs one real verification first: either one operative is clear, or one issue is recorded.

### 10. Happy Path: One Clear Verification

Visual:

- Tap a present operative.
- Select `Clear ✓`.
- Row changes to `CLEAR`.
- Footer `Pass all remaining clear` unlocks.

Narration:

> If the team is clean and ready, check one present operative and mark them Clear. That proves the check has started properly and unlocks the shortcut for the remaining clear operatives.

### 11. Pass The Remaining Clear Operatives

Visual:

- Annotation around `Pass all remaining clear`.
- Rows fill to `CLEAR` except already off-duty rows.

Narration:

> Now use Pass all remaining clear. It only applies to the people who still need a status; it does not overwrite the off-duty people you already marked.

### 12. Issue Path: Record An Exception

Visual:

- Rewind or branch panel: `If you find a problem`.
- Tap an operative.
- Select `Exception ✕`.
- Open exception modal.

Narration:

> If someone has an issue, do not pass them. Mark Exception and capture the failed hygiene criterion.

### 13. Capture Criterion And Action

Visual:

- Exception modal.
- Annotate `CRITERION`.
- Annotate `ACTION TAKEN`.
- Optional photo area.

Narration:

> Pick the criterion that failed, then write the action taken. Add a photo if it helps prove the issue or the correction.

### 14. Multiple Issues

Visual:

- Roster with one `EXCEPTION`.
- Another operative opened for exception.
- Side panel: `Record each affected operative`.

Narration:

> If more than one operative has an issue, record each one before you pass the rest. The shortcut is for the clear remainder, not for hiding problems.

### 15. Complete The Session

Visual:

- All operatives have statuses: off-duty, clear, exception.
- Button changes to `Complete session`.
- Tap complete.

Narration:

> When every operative shown has a status, complete the session. The checklist is now an honest hygiene record: who was off duty, who was clear, and who needed action.

### 16. Close Strong

Visual:

- Summary blocks:
  - `Off duty first`
  - `One real verification`
  - `Exceptions before pass-all`
- Final proof card: `The hygiene checklist is complete.`

Narration:

> The order is simple: off duty first, one real verification to unlock pass-all, and all exceptions recorded before the session is completed.

## Required Shots

Capture these from the Android app, preferably with the `test@iandj.co.za` account:

1. `daily-hygiene-01-home-tile.png` — Home with `Daily Hygiene Checklist` tile visible.
2. `daily-hygiene-02-staff-allocation.png` — Staff / operative detail showing zone allocation or allocation count.
3. `daily-hygiene-03-list-empty.png` — Daily Hygiene list with `+ New hygiene checklist` and empty state.
4. `daily-hygiene-04-checkpoint-modal.png` — `New hygiene checklist` modal with `Start of shift` and `During shift`.
5. `daily-hygiene-05-shift-picker.png` — `Pick the shift` modal with shift rows.
6. `daily-hygiene-06-roster-unchecked.png` — Detail screen with unchecked operatives.
7. `daily-hygiene-07-status-picker.png` — Status picker showing `Clear ✓`, `Exception ✕`, `Off duty`.
8. `daily-hygiene-08-off-duty-marked.png` — Roster row marked `OFF DUTY`.
9. `daily-hygiene-09-pass-all-gated.png` — Footer showing disabled pass-all and gate hint.
10. `daily-hygiene-10-one-clear.png` — One operative marked `CLEAR` and pass-all unlocked.
11. `daily-hygiene-11-pass-all-complete-roster.png` — Remaining operatives marked clear.
12. `daily-hygiene-12-exception-modal.png` — Exception modal with criteria and action field.
13. `daily-hygiene-13-exception-recorded.png` — Roster row marked `EXCEPTION`.
14. `daily-hygiene-14-complete-session.png` — `Complete session` available.
15. `daily-hygiene-15-completed.png` — Completion confirmation or completed session state.

## Visual Notes

- Keep the phone journey on the left.
- Use right-side explainer panels for the pass-all gate and exception branch.
- Show off-duty first as a deliberate operational step, not as an afterthought.
- Use a branch marker for the issue path: `If there is a hygiene issue`.
- Keep `Pass all remaining clear` visually locked until the voiceover explains why it unlocks.
- Use one large zoom for the gate hint because this is the key product behavior users need to understand.
- Use final summary cards in the same style as the V3 cleaning verification outro.
