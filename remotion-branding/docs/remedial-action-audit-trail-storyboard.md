# Remedial Action audit-trail storyboard

## Teaching thesis

**Recording the failure clears today's due occurrence. It does not clear the finding.**

## Audience and learning outcome

This video is for cleaning operatives, site supervisors, and managers who use the mobile Bill of Health and follow-up queues. By the end, an operative should know what evidence to record with a failed Cleaning Verification check, and a supervisor should know how to find, recheck, evidence, and sign off that open Cleaning remedial. Both groups should also understand that Inspection Remedials are a separate carry-over trail, not another view of today's cleaning schedule and not an NCR/CAPA workflow.

## Source basis and scope

- Mobile UI and local scheduling were reconfirmed read-only at app commit `6999d8eca52fc4f4fff69066dce365f54a609663` in `/home/durai/Documents/projects/react-native/e-wizer-mobile-capture-dev`.
- Record lifecycle was reconfirmed against the available backend checkout and source history in `/home/durai/Documents/projects/e-wizer/convex`.
- Bill of Health ordering/count semantics were reconfirmed from available backend history at `a1d5740fd32bbed1ca4cc877703251a48c8c811a:convex/pillarStatus.ts`; that source is history evidence, not a claim about an uninspected live deployment. Immediately before capture, reconfirm the relevant `pillarStatus` labels, ordering, bands, count predicates, and detail text against the backend's then-current `origin/dev`. Stop and revise this plan if they differ.
- This is a planning document. It does not authorize a capture, mutation, seed, render, or production change.

## Keep the three concepts separate

| Trail | Record and clock | What opens it | What removes it from its open state | What it is not |
|---|---|---|---|---|
| Daily Cleaning Remedial | A failed `taskCompletions` record, originating from a scheduled check occurrence. The occurrence belongs to its `dueDate`; the unresolved failure remains a separate follow-up concern. | Submit a Cleaning Verification result of `fail` with a required finding grade and failure reason; action taken and photo evidence are optional. | A site manager or above uses the Cleaning follow-up action. `CONFIRM FOLLOWED UP` reveals the optional note/photo form; the inner `CONFIRM` records `verificationResult: accepted`, `verifiedBy`, and `verifiedAt`. | It is not another missing check. Recording the fail satisfies the occurrence while leaving its finding open. It is also not an assigned work order. |
| Carry-over Inspection Remedial | A finding embedded in a pictorial inspection. `open` and `remedied` findings are selected site-wide without a parent inspection date/status gate. | `ADD FINDING` captures evidence plus severity, category, section/area, and description, then saves the finding as `open`. | `ACCEPT` changes it to `closed`; `REJECT` sends it back to `open`; explicit `NCR`/`ESCALATE TO NCR` changes it to `escalated` and creates/links a formal NCR. An authorized higher role can later `REOPEN` an eligible closed finding with a required comment. | It is not today's Cleaning Verification occurrence and it does not expire with the inspection or day. |
| Formal NCR/CAPA | A separate `ncrs` record with its own state and controls. | An explicit Inspection escalation creates one; a Critical Cleaning failure can also trigger an NCR under the shipped critical-only rule. | The NCR/CAPA workflow, not a remedial-card sign-off. | It is not synonymous with either remedial record. A shared Bill of Health summary or link does not merge the audit trails. |

“Daily” describes the Cleaning remedial's scheduled origin and Bill of Health band, not an automatic expiry rule: both the inspected Bill of Health source and Cleaning follow-up list gather unresolved Cleaning failures all-time. The Bill of Health row is labelled `Remedial`, and its detail can combine “cleaning remedial(s) open” with “CAPA action(s) due.” Never present that combined number as a Cleaning-only count; read and teach the two components separately.

### Current field and automation boundary

The app currently has **no structured remedial owner, assignee, due date, review date, recurrence frequency, SLA, reminder, or automatic escalation for Inspection Remedials**. Do not narrate, label, or visually imply any of them. `remedialBy`, where populated, is attribution for an action entered at verification; it is not an assigned owner. The next high-level clean, cleaning cycle, or authored frequency is operational context only: no inspected lifecycle code automatically closes or advances an Inspection finding on that event.

The age badge is an indicator only. The code displays age in days, uses muted styling through day 7, amber when age is **greater than 7 days**, and coral when age is **greater than 30 days**. It does not set a deadline, send a reminder, change severity, escalate, or close a record.

## Story structure

Target a short combined video with one clean handoff between the two clocks. The Cleaning Verification tutorial owns the detailed fail-capture form walkthrough; this story uses only a brief establishing view of the completed capture and then teaches what happens to its audit trail.

### A. Daily Cleaning Remedials

| Beat | Exact screen/action to capture | Exact teaching claim | Capture status |
|---:|---|---|---|
| 1. Two outcomes from one submission | Bill of Health → `Cleaning Verification`, then the Cleaning Verification summary at `/(app)/cleaning-verification`. Establish today's `Still to do` count. Cut to the state immediately after a non-Critical fail has been submitted; show the affected check under `Follow-up owed`. | The failed submission is a captured completion, so today's due occurrence leaves `Still to do`. The failed finding stays open under `Follow-up owed`. State the thesis verbatim. | **Authentic now:** existing genuine captures `02-bill-of-health-cleaning-verification-entry.png` and `03-cleaning-verification-live-baseline-summary.png` establish the unmutated baseline. **Authorized seeded record required:** the post-fail band transition and affected row. |
| 2. Preserve what was found | Briefly show the real failed task record, without reteaching the whole form: `FINDING GRADE *`, `FAILURE REASON *`, optional `ACTION TAKEN`, and optional `PHOTO EVIDENCE`. Then show the genuine completion confirmation. | Grade and reason describe the finding. Action taken and evidence strengthen the trail but are optional in this flow. `completedBy` identifies the person who captured the failure; it is not an assignee. `completedAt` is the capture time. | **Authorized seeded record required.** Use an authorized test identity and a controlled non-Critical record so the NCR branch does not obscure this lesson. Capture attribution only on a real screen that actually renders it; otherwise teach it in narration and inventory metadata, not as fabricated UI. |
| 3. Find the open remedial | Home follow-up banner and Bill of Health `Remedial` row, then `/(app)/follow-ups` with the `CLEANING` bucket selected. Show a `CLEANING CHECK` card with its actual grade, task and zone, due date/age, failure reason, genuine photo if present, and `ACTION TAKEN` if present. | The daily schedule occurrence is complete, but the failed completion remains unresolved until verification exists. The unresolved failure appears in the all-time Cleaning follow-up list; the card is the control point, not evidence that the original check is still due. Read the Bill row's Cleaning-open and CAPA-due components separately; its total is not a Cleaning-only count. | **Authentic now:** `01-bakery-home-bill-of-health-entry.png` and `02-bill-of-health-cleaning-verification-entry.png` establish genuine counts only. **Authorized seeded record and manager access required:** the matching queue card. |
| 4. Remedy and recheck | Show the corrected condition in the real workplace, then return to the same Cleaning card. The supervisor selects `CONFIRM FOLLOWED UP`, reviews the optional `Follow-up note`, and adds `Add photo (optional)` only when genuine evidence is available. | The physical correction and recheck happen before sign-off. The app does not enforce or separately structure a recheck result here; the supervisor must not use the button as a substitute for observing the condition. | **Authorized seeded record, manager access, and genuine controlled evidence required.** Do not stage a workplace image as genuine evidence. |
| 5. Confirm the follow-up | In the expanded card, select the inner `CONFIRM`. Capture the card leaving the Cleaning queue and the Cleaning Verification `Resolved today` band/count. | `CONFIRM` records an accepted verification with `verifiedBy` and `verifiedAt`; the optional note is `verificationNote`, and an optional follow-up photo is appended to the record's evidence images. This clears the open finding; it does not rewrite the original fail as a pass. | **Authorized seeded record required.** Capture all open-state evidence before this mutation because the row and counts will change. |
| 6. Read the audit trail, not just the green state | Hold on the genuine post-close `Resolved today` row and, only if an existing real UI exposes it, the completion/verification attribution. | The record retains the original `result: fail`, `failureReason`, grade, evidence, `completedBy/completedAt`, and the later `verifiedBy/verifiedAt`. Capture and verification are two different acts by potentially different people. | **Authorized seeded record required.** The current mobile Cleaning Verification list does not render the names/timestamps, so never composite them into that screen. Use a genuine reporting/detail surface if one is approved and verified; otherwise narration plus the capture register is sufficient. |

#### Cleaning handoff from the Cleaning Verification video

End that video's capture-form tutorial at the genuine submission confirmation. Begin this video on the resulting `Follow-up owed` state and repeat only the thesis. Do not repeat how to select Fail, choose a grade, type the reason, or take/annotate the first photo. The handoff line is: “The check has been recorded for today; now the finding needs its own follow-up.”

### B. Five-beat carry-over branch: Inspection Remedials

| Beat | Exact screen/action to capture | Exact teaching claim | Capture status |
|---:|---|---|---|
| 1. Capture the Inspection finding | In an authorized draft at `/(app)/inspections/[id]`, select `ADD FINDING`, capture/annotate genuine before evidence, then use `New finding`: `SEVERITY`, `CATEGORY`, `SECTION / AREA`, `DESCRIPTION`, and `SAVE FINDING`. Expand the saved card and show `REMEDIAL ACTION`/`+ ADD REMEDIAL ACTION` only if that action is genuinely part of the case. | Saving creates an `open` finding with `createdAt`. These are finding facts and evidence, not an assignment: the finding has no structured owner, assignee, target/review date, frequency, SLA, or reminder. | **Authorized seeded record and approved evidence subject required.** No current genuine baseline capture proves this operation. Do not show `remedialBy`; the current card does not render it. |
| 2. Cross the carry-over divider and prioritise | Bill of Health at `/(app)/current-status`: scroll below `CARRIES OVER` to `Inspection Remedials`, select it to open `/(app)/follow-ups`, choose `INSPECTIONS`, then select `OPEN VERIFY FLOW`. On `/(app)/inspections/verify`, show `OPEN (n)`, severity filters, search, area grouping, and genuine age badges. | Every finding whose status is `open` or `remedied` contributes to the carry-over count regardless of parent inspection status/date. The queue sorts by severity then oldest. Age helps review but is not a deadline, SLA, reminder, or escalation trigger. | **Authorized seeded records required**, ideally one under/equal to 7 days, one greater than 7, and one greater than 30, with truthful created times. A read-only current-site row is usable only if it is authorized and recorded as observed. Do not alter timestamps merely to colour a badge unless Daniel explicitly authorizes labelled seeded demonstration data. |
| 3. Review the finding and remedy evidence | On `Verify remedial actions`, open one genuine row. Show severity, location, age, before photo, description, `REMEDIAL ACTION LOGGED` when actually present, and an actual after photo if supplied. If the source inspection uses `before_after_required`, attempt `ACCEPT` without an after photo only in an authorized test record to capture the real `After-photo required` alert; otherwise show the optional label as rendered. | Before evidence proves what was found. Remedial action records what was done. After evidence is required only when the parent inspection's before/after mode requires it; otherwise it is optional. No structured owner/date/SLA exists. | **Authorized seeded records required.** The current verify list does not return or render `remedialBy`; do not request or overlay it. |
| 4. Make an explicit disposition | Capture three separate authorized cases, never one fabricated branching screen: `ACCEPT`; `REJECT` → optional reason → `CONFIRM REJECT`; and `NCR` → `Escalate to NCR` dialog → `Escalate`. | Accept closes the finding. Reject records a rejected verification and returns the finding to `open`. NCR escalation is a deliberate action that creates and links a separate formal NCR and changes the finding to `escalated`; Inspection findings do not auto-escalate. | **Authorized seeded records and manager access required.** Each branch needs its own record or a documented reset/reopen plan; do not destroy earlier open-state evidence. |
| 5. Prove persistence and history | On `CLOSED (n)`, show genuine `CLOSED — verified` and/or `ESCALATED · <reference>` states. Where present, show the history lines `Accepted`, `Rejected`, `Reopened`, or `Escalated` with the rendered actor name and comment. For an eligible closed case and authorized higher role, `REOPEN` → required reason → `CONFIRM REOPEN` can demonstrate return to `OPEN`. Finish back on the Bill of Health carry-over row. | Open/remedied findings persist until their own Accept/Close or explicit formal escalation. Closed/escalated rows remain visible in this mobile Closed view only for the backend's 30-day recent window; the stored history is append-only. Reopen preserves prior verification fields/history and adds a new event. | **Authorized seeded records required.** The current mobile history line renders action, actor name, and comment but not the event time; capture time only where a genuine UI exposes it. |

## Authentic capture plan

### Available now without creating operational state

The reviewed genuine set in `public/cln-tutorial/v4-current-6999d8e/` can supply only the establishing frames:

- `01-bakery-home-bill-of-health-entry.png` — Home follow-up banner and Bill of Health entry.
- `02-bill-of-health-cleaning-verification-entry.png` — Bill of Health baseline, including the current `Remedial` row.
- `03-cleaning-verification-live-baseline-summary.png` — genuine zero-captured Cleaning Verification baseline.
- `04-premix-area-due-tab-linked-ssop47.png`, `05-premix-ssop47-detail.png`, and `06-premix-off-schedule-next-due.png` — genuine context/QR-lock/SSOP frames, but not proof of a failure or remedial lifecycle.

These six files contain no composed operational screens. None shows a new pass, fail, unavailable result, Cleaning follow-up closure, or Inspection decision.

### Requires authorized seeded records

Capture the following only after Daniel provides or authorizes out-of-band `test@sunbakebread.co.za` access, confirms Bakery Demo authority, and approves the record set:

1. One non-Critical Cleaning failure with a real grade/reason and controlled before evidence; optional action taken only if it truly occurred.
2. Its resulting Cleaning Verification `Follow-up owed` row and matching `CLEANING CHECK` follow-up card.
3. A genuine correction/recheck, optional follow-up note/photo, `CONFIRM FOLLOWED UP`, inner `CONFIRM`, and the resulting `Resolved today` state.
4. Inspection findings in `open`, `remedied`, `closed`, rejected-back-to-open, and `escalated` paths, with controlled before/after modes and truthful creation times.
5. Separate Inspection Accept, Reject, NCR, and optional Reopen cases so each transition remains auditable.

Use the shipped test harness only as disclosed setup. It may establish app access/check-in state, but it must never be portrayed as proof of physical presence or a physical QR scan. Capture open-state Cleaning frames first; closing a Cleaning row changes the counts. Capture Inspection open/remedied frames before Accept/NCR transitions for the same reason.

## Proof and attribution model

| Trail | Origin evidence and attribution | Remedy/after evidence | Verification evidence and attribution | Current mobile rendering limit |
|---|---|---|---|---|
| Cleaning | `result: fail`, `findingSeverity`, required `failureReason`, optional `actionTaken`, optional `photoStorageId`/`imageIds`; `completedBy` is the person who captured the failure and `completedAt` is the capture time. There is no literal Cleaning `capturedBy` field in the inspected schema. | The follow-up form accepts an optional note and optional photo. The backend appends that photo to `imageIds`; it is not stored in a separately named after-photo field on `taskCompletions`. | Close records `verificationResult: accepted`, `verificationNote`, `verifiedBy`, and `verifiedAt`. | The follow-up card renders source, severity, due date/age, task/zone, reason, first image, and action taken. It does not render `completedBy`, `completedAt`, `verifiedBy`, or `verifiedAt`; Cleaning Verification renders bands/counts, not those identities. |
| Inspection | The parent stores `inspectorId`; each finding stores `createdAt`, severity, category, location, description, and before/annotated-before evidence. There is no finding-level `capturedBy` field. | A finding may store `remedialAction` and `remedialBy`; verification may append a new action and stamp `remedialBy`. Before/after-required inspections gate Accept on after evidence; other modes do not. | `verifiedBy`, `verifiedAt`, latest decision/rejection reason, and append-only history events (`at`, `by`, `byName`, action, optional decision/comment) are stored. | The verify row renders before photo, action text, age, status, and history action/actor/comment. It currently does not render `remedialBy` or the history event time, and its query does not supply an after-photo URL for already closed rows. Do not manufacture those views. |

Attribution is evidence of who performed an action; it is not assignment. Never relabel `completedBy`, `inspectorId`, `remedialBy`, or `verifiedBy` as an owner or assignee.

## Explicit non-claims and disclosure rules

- Do not claim that a failed Cleaning check remains “still to do.” Its scheduled occurrence is captured; its finding remains open.
- Do not claim that `CONFIRM FOLLOWED UP` proves a physical recheck. The app accepts an optional note/photo and records acceptance; the human process must supply the honest review.
- Do not call a Cleaning `completedBy` value an owner. It identifies the person who captured the failure.
- Do not claim an Inspection finding has a structured owner, assignee, due date, review date, frequency, SLA, reminder, or automatic escalation.
- Do not claim the amber/coral age treatment is a deadline or automation. It is a visual indicator only.
- Do not claim the next high-level clean, day boundary, parent inspection completion/archive, or cleaning frequency closes an Inspection finding.
- Do not call an Inspection `remedialBy` value an owner. It is action attribution and is not rendered in the current verify queue.
- Do not describe an Inspection reject as closure: it records rejection and returns the finding to `open`.
- Do not merge Inspection Remedials with formal NCR/CAPA. An explicit escalation creates/links an NCR and changes the finding to `escalated`; the NCR continues in its own workflow.
- A Critical Cleaning failure may additionally raise an NCR under the current critical-only trigger. If shown, disclose that linked branch explicitly; do not imply every Cleaning fail raises one.
- Any authorized seed must be labelled **“authorized seeded demonstration record”** in the capture register and production inventory. A test-harness check-in must be disclosed and must not be narrated as a physical QR scan.
- Composed callouts may explain a genuine screen, but may not replace or alter app fields, values, counts, timestamps, actors, photos, buttons, status, or navigation. Any non-app diagram or reconstruction must be labelled **“explanatory graphic — not an app screen.”** No composed operational screen may be classified as genuine.

## Capture go/no-go and open questions

**No-go for operational capture now.** The current genuine set is suitable for the read-only opening only. Continue only after Daniel authorizes the test identity, Bakery Demo access, seeded cases, evidence subjects, manager decisions, and NCR creation. Source-only storyboard production may proceed, but no animation should imply missing operational proof.

**Structural filming gate — no-go for a claimed on-screen closed Cleaning audit record:** no current mobile screen renders one closed Cleaning record with both `completedBy/completedAt` and `verifiedBy/verifiedAt`. Do not pretend that screen exists and do not compose those fields into another screen. Before approving beat 6, Daniel must choose and sign off either (a) narration plus the capture register to state the stored attribution, while explicitly acknowledging that it is not rendered together in the current mobile UI, or (b) a separately verified genuine product surface that actually renders the complete record. If neither treatment is approved, omit the on-screen audit-record claim.

Resolve these questions before capture:

1. Should the Inspection branch demonstrate both `before_after_required` and optional modes, or teach only the mode present in Daniel's approved seeded inspection?
2. Is `remedied` a state Daniel wants explicitly seeded and shown, or is an `open` → Accept/Reject/NCR demonstration sufficient for the current mobile flow?
3. Should the Critical Cleaning → NCR rule receive a short disclosed callout, or should all training captures use Major to keep the Cleaning remedial and formal NCR stories visually separate?
4. Which role/person is authorized to perform each mutation, and what rollback/retention procedure will preserve all open-state evidence after the capture session?

## Proposed final-video inventory metadata

Record these fields for later sign-off:

- Asset ID, working title, version, duration, resolution/FPS, and output SHA-256.
- App commit, backend/deployment identifier if available, capture date/time/timezone, machine, site, and account identifier (never credentials).
- Source clip/image filenames and hashes; beat and exact in/out timecodes; app route and rendered labels.
- Trail (`cleaning_remedial`, `inspection_remedial`, or `ncr_capa`) and demonstrated state transition.
- Evidence classification (`genuine current state`, `authorized seeded demonstration`, or `explanatory graphic — not an app screen`).
- Harness/physical-presence disclosure, data authority reference, mutation performed, record identifiers kept in the restricted capture log, and restoration/retention status.
- Visible attribution fields and omitted/unrendered fields; non-claim checklist result.
- Reviewer, product approver, compliance approver, approval date, decision, exceptions, and final sign-off reference.

## Source evidence index

All line numbers below refer to the reconfirmed files at the source revisions named in “Source basis and scope.” Historical `pillarStatus` evidence is not capture authority: revalidate those semantics against the backend's then-current `origin/dev` immediately before capture.

- Daily completion capture and validation: mobile `app/(app)/task/[id].tsx:408-455`, `:504-529`, `:723-818`, `:859-870`; backend `convex/scheduling.ts:1773-1832` and `convex/schema.ts:2573-2630`.
- Why a fail clears the due occurrence: mobile `lib/scheduling.ts:325-365`, `:400-415`, and `:440-460`; Bill of Health history `convex/pillarStatus.ts:595-636` at `a1d5740f…`.
- Cleaning Verification bands: mobile `app/(app)/cleaning-verification/index.tsx:1-21`, `:505-560`.
- Cleaning all-time follow-up population, fields, and close stamp: backend-history `convex/followUps.ts:31-77`, `:210-235` at `a1d5740f…`; mobile `app/(app)/follow-ups.tsx:112-160`, `:316-340`, `:482-548`, `:550-623`.
- Bill of Health labels/order/counts: backend-history `convex/pillarStatus.ts:41-72`, `:705-736`, `:817-859` at `a1d5740f…`; mobile routes/divider `app/(app)/current-status/index.tsx:87-108`, `:444-455`.
- Inspection finding creation and source fields: mobile `app/(app)/inspections/[id].tsx:445-475`, `:586-644`, `:934-1019`, `:1041-1050`, `:1076-1231`; backend `convex/schema.ts:5185-5245`.
- Inspection carry-over selection and recent Closed window: backend `convex/pictorialInspections.ts:122-188`; Bill of Health history `convex/pillarStatus.ts:817-832` at `a1d5740f…`.
- Inspection Accept/Reject/Reopen/NCR lifecycle: mobile `app/(app)/inspections/verify.tsx:91-148`, `:330-425`, `:427-480`, `:491-510`, `:579-735`; backend `convex/pictorialInspections.ts:419-490`, `:500-535`, `:662-758`.
- Critical-only Cleaning NCR preview rule: mobile `lib/ncrEscalation.ts:1-7` and `app/(app)/task/[id].tsx:408-455`.
