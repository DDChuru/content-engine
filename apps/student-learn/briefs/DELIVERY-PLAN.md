# Delivery plan — Stem 4 Life app

**Status:** Live · **Owner:** Durai · **Author:** Claude (conductor)
**Date:** 2026-09-17 · Companion to `PLAN-marking-platform.md` (the *what*). This is the *who,
in what order, without colliding*.

---

## 1. Done — do not rebuild

| Thing | Where | State |
|---|---|---|
| Convex backend | `convex/schema.ts` + `identity.ts` + `submissions.ts` + `lib/` | Live on `dev:proper-mule-197`. 13 tables, 24 indexes, 16 functions |
| Blinding | `convex/lib/codes.ts`, `submissions.ts` | Per-submission candidate codes, teacher codes, rotation cap, pooled OCC claim, audited `revealCandidate`. **`toTeacherView` verified not to leak** |
| Clerk auth | `convex/auth.config.ts`, `middleware.ts`, `components/convex-client-provider.tsx` | Linked, JWT template `convex` live, issuer set per-deployment |
| Misconception catalogue | `content/misconceptions/mechanics.json` | 21 items seeded to Convex. 4 covered / 17 partial / 0 uncovered |
| Exercise questions | `content/questions/`, `scripts/build-exercise-questions.py` | 12 verified, solve-gated. Schema extends the app's existing `Question` so `gradeAnswer` works with no adapter |
| Notes + videos | `public/notes/`, `public/videos/` | ~28 unique topics. **Videos gitignored — a deploy ships none** |
| Registration | `app/sign-up`, `app/sign-in`, onboarding | In flight |

---

## 2. The one rule for parallel teams

**A workstream owns its files exclusively.** Today's registry tickets all came from two agents
writing the same path. Ownership below is not advisory.

**`convex/schema.ts` is the contended file.** Several streams need columns added. Do NOT let
each stream edit it. One person batches all pending schema changes, deploys once, tells
everyone. A schema change is cheap; two streams racing on it is not.

Also shared, same rule: `lib/syllabus.ts`, `lib/types.ts`, `app/layout.tsx`, `package.json`.

---

## 3. Do this first, before more UI exists

### W0 — Next 15 migration (blocking, and it gets more expensive every day)

Next 14 carries an **unpatched critical advisory** (DoS via the image optimiser and via RSC
request deserialisation). It cannot ship publicly to a site taking payments and photographs of
children's work.

**Do it now, not at deploy time.** There are 6 routes today. Every page built on 14 is a page
to re-verify after the migration. At 20 routes this is a week; at 6 it is a day. Clerk 7 also
requires 15+, so this unblocks staying current on the auth provider.

- Owns: `package.json`, `next.config.js`, every `app/**` route (async request APIs changed)
- Blocks: nothing functionally, but **schedule it before W1/W3 land large new UI**
- Done when: `next build` passes, all existing routes render, `npm audit` shows no critical

---

## 4. Workstreams that can start immediately

No blockers, no collisions with each other.

### W1 — Teacher marking interface
The backend already exists; this is the missing face of it.
- **Owns:** `app/teacher/**`
- **Consumes:** `submissions:queue`, `claim`, `release`, `getForMarking` (all deployed)
- **Needs from W4:** the diagnosis picker needs `misconceptionCatalogue` with `title` (see
  amendment K). Build against the JSON shape; wire when the schema lands.
- **Done when:** a verified teacher can see a queue, claim an item, see only the blinded view,
  submit marks against the mark scheme, and the claim releases after 45 minutes if abandoned.
- **Watch:** per amendment J, **coverage state must not be visible in the picker** or teachers
  are paid to misdiagnose.

#### W1 inherits five verified security findings — read before writing a line

A cross-engine review (3 rounds, Codex reviewing Claude) found these in `convex/submissions.ts`.
They were deliberately NOT fixed because that file has no UI yet and W1 rebuilds on it. They are
verified, with exploit paths. **Do not rediscover them; do not ship without closing them.**

1. **The queue hands out full work before any claim.** `queue` returns `toTeacherView` for up to
   50 submissions — redacted images, typed answers, candidate codes, prior context — with no claim
   required. That is browsing, not "take the next item", and it lets a marker shop for students.
   Return minimal metadata before claim; the full view comes only with a live claim.

2. **Access outlives the claim, and completed work can be reopened.** `getForMarking` only applies
   expiry when `status === 'claimed'`, so a teacher whose `claimedBy` is still set can read
   `marked`, `returned`, `queried`, `closed` and `refunded` submissions indefinitely. `release`
   has no status guard at all and can push completed or refunded work back to `queued` with its
   mark still attached.

3. **The rotation cap is erasable, so it is not a cap.** `rotationCapReached` counts mutable
   `claimedBy`/`claimedAt`. Both voluntary release and expiry clear those fields. Claim, read,
   release, repeat — the counter never rises. **It needs an append-only assignment history**, not a
   count of current state.

4. **Prior context is a cross-submission fingerprint.** `buildContext` returns exact attempt count,
   last mark and latest misconception. Two queued submissions from one student carry the same
   tuple; sequential ones form an incrementing series. That makes per-submission candidate codes
   linkable, which defeats the whole point of them. It also counts drafts and rejected work,
   because no status filter is applied.

5. **Teacher-visible strings are unsanitised.** `createDraft` takes client-controlled `questionId`
   and `topicCode` and `toTeacherView` returns them verbatim, as it does `typedFinalAnswer`. A
   student typing their name or email into the answer field walks straight past the image
   redaction boundary. Re-resolve identifiers server-side; filter every free-text field a teacher
   sees, using the same contact-detail filter as the thread.

Confirmed still holding, so do not regress them: no teacher-callable endpoint returns `studentId`,
a name, an email or `originalStorageId`; every teacher endpoint requires a verified, unsuspended
teacher row; clients cannot self-register as teacher or admin.

### W2 — Exercise questions at scale
The coverage gate is at **19%** against an 80% requirement. This is the path to charging.
- **Owns:** `content/questions/**`, `scripts/build-exercise-questions.py`
- **Target:** ~25-30 more items, concentrated on the 8 force-diagram / friction / resolving
  codes that currently have no question at all. `content/misconceptions/mechanics.json` names
  exactly which.
- **Done when:** ≥80% of in-scope catalogue codes reach `covered`.
- **Decide first (amendment L):** covered means ≥2 questions or ≥3? At 2 it is 4 codes today.
  **At 3 it is 0.** Pick one number before authoring.
- **Also apply amendment F:** allow recurring answers where the stem says "to 3 significant
  figures", or the bank drifts toward contrived numbers.

### W3 — Prescriptions
The thing the student actually bought.
- **Owns:** `convex/prescriptions.ts`, `app/mark/**`, `content/misconceptions/**`
- **Needs the schema fix first (amendment K):** `noteSlugs: v.array`, `videoIds: v.array`,
  `title`, `description`. Currently single-valued, so the ordered note → video → 2 questions
  prescription cannot be represented and the picker has no short label.
- **Done when:** a mark produces a server-generated ordered prescription and the student sees
  a "next 25 minutes" screen, items ticking off, not a marked page.

---

## 5. Blocked on Durai

These cannot start until an account or a decision exists. **Each is one decision, not a project.**

| # | Workstream | Blocked on | Note |
|---|---|---|---|
| W4 | Image ingest (re-encode, EXIF strip, vision redaction) | **Choice of vision provider** | Needs a `"use node"` Convex action; re-encoding cannot run in V8. Sits on the critical path of W5 |
| W5 | Student submission flow | W4 | Camera capture, client compression, typed answer, **the student-confirms-redaction step** |
| W6 | Credits + payments | **Merchant account** (Paynow ZW / Paystack or Yoco SA) | Amendment A: gate paid submission on a redeemed guardian link for minors |
| W7 | Deploy | **Video host account + Vercel + DNS on stem4life.com** | 682 MB of video must leave the repo permanently, not be un-gitignored |

**Cheapest unblock, highest value: W4's vision provider.** It gates the entire submission
path, which is the product.

---

## 6. Later, and deliberately not now

- **Admin gap roadmap** (`app/admin/record-next`) — needs real marks to aggregate. Meaningless
  before W1 has run for a few weeks.
- **Annotation canvas** over the photo — `perfect-freehand` is already in the repo, tempting,
  and explicitly out of Phase 1.
- **Teacher payouts** — manual by spreadsheet until it costs more than an hour a week.
- **Live TikTok** — needs a second moderator; it is acquisition, and acquisition is later.

---

## 7. Suggested dispatch

**Wave 1 (now, 3 teams in parallel):** W0 Next 15 · W1 teacher marking · W2 questions.
These touch `package.json`+`app/**`, `app/teacher/**`, `content/questions/**` respectively.
W0 and W1 overlap on `app/**` — **run W0 first and let it finish**, it is a day.

**Wave 2:** W3 prescriptions (after one batched schema change) · W4 image ingest (the moment
the vision provider is chosen).

**Wave 3:** W5 submission · W6 payments · W7 deploy.

**Cross-engine review gate applies to every workstream.** Codex builds → Claude verifies, or
the reverse. Nothing is done until the opposite engine has seen the real diff.

---

## 8. What "ready to charge" actually requires

From `PLAN-marking-platform.md` §9, restated as a checklist because it is the real finish line:

- [ ] ≥80% of in-scope catalogue codes `covered` (**at 19% today**)
- [ ] Every in-scope syllabus point: ≥1 lesson/notes page, ≥3 questions
- [ ] Measured miss rate <15% over a 50-mark pilot
- [ ] 5 verified teachers, 6am-9pm weekday coverage, **before any ad spend**
- [ ] Guardian consent gated before paid submission (amendment A)
- [ ] Legal opinion: Cambridge question reuse + minors' data consent
- [ ] Payment → access path tested end to end, including refunds
- [ ] Next 15 (no critical advisories on a public deployment)
