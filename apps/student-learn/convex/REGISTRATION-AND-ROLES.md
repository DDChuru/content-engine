# Registration, roles and consent

**Companion to** `schema.ts`, `identity.ts`, `submissions.ts`, `lib/auth.ts`.
**Implements** PLAN-marking-platform.md §4 and §11. **Status:** design, not deployed.

---

## 1. What a student provides — and what they do not

**Collected:** first name, an **exam enrolment** (country → board → level → session →
subjects), self-declared age band, and whatever Clerk holds for the sign-in factor (a
Google account or an email address).

**Country is the top layer, not a field we file away.** It was collected and unused;
it now decides which exam bodies a student is offered at all. The relationship is
MANY-TO-MANY and is stored as a join (`catalogueCountryBodies`), not a tree:
Cambridge operates in over 160 countries, Zimbabwe sits both ZIMSEC and Cambridge,
South Africa sits the NSC and also Cambridge and Edexcel, and Pearson Edexcel
International is not available to candidates studying in the UK. The join carries an
optional `levelIds`, so a country can sit part of a board — Cambridge IGCSE is taken
at UK independent schools while Cambridge O Level and A Level are not.

The catalogue itself lives in Convex (six `catalogue*` tables, admin-CRUD via
`convex/examCatalogue.ts`), seeded from `content/catalogue/exam-catalogue.json` and
exported back to it by `scripts/export-exam-catalogue.mjs` so board data stays
reviewable in a git diff. Catalogue rows are **retired, never deleted** — there is no
delete mutation for any of them — and retiring something a cohort is sitting is
refused unless the admin acknowledges the count. `availability` is not a column and
no mutation accepts one: it is derived from `lib/syllabus.ts` on every read, and the
one way to contradict it is `setAvailabilityOverride`, a separate field with a
mandatory written reason and an audit row.

**Not collected:** surname, school, date of birth, address, photograph, phone number,
ID number.

**Challenge to the plan, and where it holds.** §4 says "first name and year only".
A bare year answered none of "which board", "which level" or "which series", and boards
set different papers under the same subject name — so "year" is now an `enrolments` row
(`lib/exam-catalogue.ts` + `convex/schema.ts`). It is a row and not a column because a
student resits, and sits a new session the next year; a mutable field would overwrite the
history. Two further fields have to be added to make the rest of the plan legal and
operable:

- **`ageBand`** — §11 turns on "most users are 16-18". You cannot apply a
  guardian-consent rule to minors without knowing who is one. A *band*
  (`under13` / `13-17` / `18plus`) is the minimum that answers it. A full date of
  birth is a stronger identifier and buys nothing. **Required for `role: 'student'`**,
  enforced in `registerSelf`: `session.status` reads a missing band as an adult, so an
  absent band silently disables the guardian gate that §0 amendment A exists to build.
- **`country`** — POPIA (South Africa) and Zimbabwe's Data Protection Act differ on
  consent age and on breach notification. Which regime applies is not derivable from
  anything else we hold, and guessing from an IP address is both wrong and worse.

Both are self-declared and unverified. That is deliberate: verifying a minor's age
requires collecting an ID document from a child, which is a larger harm than the one
it prevents. The declaration is what the consent record is built on, and the consent
record is the compliance artefact.

**Why a first name at all**, given blinding? It is never shown to a teacher. It exists
so the student's own screens address a person ("Nice work, Tanaka") and so a guardian
redeeming a link code sees who they just linked to. First name alone is weak enough to
be near-useless to an attacker who breaches the database and strong enough for both.

**Subjects we do not have are still selectable, and that is deliberate.** The library
covers one subject (Cambridge A Level Mathematics 9709) and one unit of it. A student may
still enrol in Physics; the pick is written to `subjectDemand`, which is §8's gap
aggregation one step earlier in the funnel — measured demand before a single mark exists.
The rule that makes this honest rather than a bait: `availability` is *derived* from
`lib/syllabus.ts`, never hand-declared, and the picker prints each subject's state on its
own row in the same type size as the subject name.

**`under13` is refused at registration**, not accommodated. Both regimes treat
under-13 data as a distinct and heavier category, the syllabus is A-Level, and the
product has no use for them. Refusing is cheaper than complying.

---

## 2. Guardian linking

The **student generates** a `G-XXXX-XXXX` code (`createGuardianLinkCode`); the guardian
registers separately and redeems it (`redeemGuardianLinkCode`).

Direction matters. If a guardian could invite a student by email, the platform would
hold a route from an adult to a named child, which is exactly the channel §11.1 is
built to not have. Student-generated means the link is always an act the learner
performed, in the room, out loud.

Properties: single use, 7-day expiry, revocable by either side, and the row survives
revocation for the audit trail. A wrong, expired, revoked or already-redeemed code all
raise the **same** error — otherwise the endpoint is an oracle for guessing valid codes.

Redemption writes two things: the link, and a `minor_processing` consent row with the
guardian as `grantedBy`. It also stamps `mirrorDisclosedAt`, because §11.6 requires
both parties to be *told* the mirror exists, and an undisclosed mirror is surveillance.

**Open, flagged:** for a 13-17 student the guardian consent arrives *after* the student
registered and possibly after they submitted work. The clean fix is to gate paid
submission — not free study — on a redeemed guardian link. Free anonymous study needs
no guardian; taking money and a photograph of a child's work does. That gate is not
written yet and should be, before Phase 1 charges anyone.

---

## 3. Teacher verification

Two separate pieces of state, and the distinction is the whole control:

| Field | Meaning |
|---|---|
| `role: 'teacher'` | Identity class. Set by `promoteToTeacher`, admin only. Grants **nothing**. |
| `verifiedAt` | The owner checked ID, credential and a paid trial of 10 marks (§11.4). |
| `approvedTopicCodes` | Which syllabus points they may claim from. Empty = an empty queue. |
| `suspendedAt` | Set on two open flags (§11.7). Blocks claiming without deleting anything. |

`requireVerifiedTeacher` demands all four conditions. `verifyTeacher` refuses a blank
`evidenceNote` — a verification with no recorded evidence is not a verification — and
writes an audit row naming the admin who did it.

Nobody self-registers as a teacher: `registerSelf` only accepts `student` or
`guardian`. Applications arrive out of band and the owner promotes by hand. At the
Phase 1 scale in §13 (five teachers) an application table is over-engineering.

---

## 4. Where role is authoritative

**Convex, always.** `lib/auth.ts` is the only place identity is resolved, and it uses
exactly one thing from Clerk: the `subject` claim, which Convex has verified against
Clerk's JWKS.

It deliberately **ignores** `publicMetadata`, `privateMetadata` and every custom claim.
Those are edited in a dashboard and delivered in a token that may be minutes stale; a
role revocation that only lands in Clerk would leave a suspended teacher marking until
their JWT expired. The `users` row is revoked the instant it is patched.

```
client ──JWT──▶ Convex verifies signature ──▶ identity.subject
                                                   │
                        users.by_auth_subject ◀────┘
                                │
                     role + verifiedAt + suspendedAt  ← authority
```

Three rules make this hold, and they are reviewable by grep:

1. **No mutation takes a role, `userId`, `studentId` or `teacherId` from the client.**
   Every function starts from `requireUser` / `requireRole` / `requireVerifiedTeacher`.
   Check: `grep -n "role: v\.\|userId: v.id('users')" convex/*.ts` — the only hits
   should be admin-only functions, where the *caller* is still re-derived server-side.
2. **Capability checks are on state, not on role.** `role === 'teacher'` never grants
   access; `verifiedAt && !suspendedAt` does.
3. **Middleware is a redirect, not a gate.** `middleware.ts` keeping a student out of
   `/teacher/*` is UX. The query behind the page refuses independently, so a hand-rolled
   fetch gets nothing.

---

## 5. Under-18 consent, retention, deletion

**Position:** most users are 16-18 and therefore children under both POPIA (s.34-35,
consent of a competent person required for personal information of a child) and
Zimbabwe's DPA (Chapter 11:12, guardian authorisation for minors).

**What is collected:** §1 above, plus — once paid marking starts — photographs of the
student's own handwritten work, a typed answer, the resulting mark and prescription,
and a credit ledger belonging to the *payer*. Nothing biometric, no location (the EXIF
strip in §5.1 of the plan is what makes that true), no behavioural advertising profile.

**What consent is captured where:**

| Consent | Who grants | Where it lives |
|---|---|---|
| Terms, privacy | The registering user | `consents` row at `registerSelf` |
| Processing a 13-17 student's data | The **guardian** | `consents` row at `redeemGuardianLinkCode`, `kind: 'minor_processing'` |
| Marketing | Never for a minor | `consents`, and simply not offered when `ageBand === '13-17'` |
| Teacher verification evidence | The teacher | Out of band; the *fact* is `verifyTeacher`'s `evidenceNote` + audit row |

Consent is versioned by policy document (`documentVersion`), because a re-worded privacy
policy needs re-consent and "they agreed to something once" is not a defensible record.
Withdrawal is a new row, never an edit.

**Retention:** §11.5 requires append-only and three years. That collides head-on with a
deletion request, so the two are reconciled explicitly:

- **Erasure** = scrub identifying fields on the `users` row in place (`firstName` →
  `"[erased]"`, contact fields cleared), set `erasedAt`, and **keep** the marks,
  prescriptions, flags, audit rows and ledger. Those are keyed by candidate code and
  by user id, and once the `users` row is scrubbed they are no longer personal data in
  any practical sense.
- **The `auditLog` and `deanonymisations` tables are never scrubbed.** They are the
  safeguarding record, and both regimes allow retention where there is a legal or
  substantial-public-interest basis. Weekly off-platform export (§11) is what makes
  them evidence rather than a mutable database.
- **Image originals** carry the real risk and get the shortest life: delete
  `originalStorageId` at 12 months absent an open dispute or flag; the redacted
  derivative follows the three-year rule.
- **90-day credit expiry** (§12) is a commercial rule, not a data one — the ledger row
  stays.

**Unresolved, and a lawyer question, not a code question:** whether a 16-year-old in
Zimbabwe can consent for themselves to a paid service. §9 already schedules that
opinion. Until it lands, the conservative position — guardian consent for everyone
under 18, gated before payment — is the one the schema supports.

---

## 6. The blinding primitives, in one place

| Primitive | Where | Note |
|---|---|---|
| `C-XXXX-XXXX` per submission | `lib/codes.ts`, `identity.allocateCandidateCode` | CSPRNG, Crockford base32 (already excludes I/L/O/U), uniqueness by `by_candidate_code`, never reused |
| `T-XXXX` per teacher | `identity.allocateTeacherCode` | Stable, so quality flags aggregate |
| The pool | `submissions.queue` | Approved topics, `dueAt` order, no teacher choice |
| Atomic claim | `submissions.claim` | OCC on `claimedBy == null` inside a serialisable transaction |
| Rotation cap | `submissions.rotationCapReached` | 3 per student per 30 days, silent — a capped item is simply absent |
| The blinded view | `submissions.toTeacherView` | Explicit field construction, never a spread |
| Reveal | `identity.revealCandidate` + `readRevealedCandidate` | Admin only, enumerated trigger, ≥20-char reason, 60 minutes, one student, every read counted |

**Honest limit, restated from §4:** this makes a teacher unable to *look up* who wrote
a page. It does not make them unable to *recognise* one. Handwriting, dialect and a
worked example mentioning a family shop all survive every control here. The copy must
say "teachers never see your name", never "teachers cannot identify you".

---

## 7. What cannot be done without accounts the owner must create

Nothing here has been installed and no account has been touched. To run it:

1. **Convex deployment** — `npx convex dev` in `apps/student-learn`. Until then
   `convex/_generated/*` does not exist, so every import of `_generated/server` and
   `_generated/dataModel` is unresolved and `tsc` will fail on these files. This is
   expected; the generated directory is produced by the CLI from `schema.ts`.
2. **`convex` and `@clerk/nextjs` in `package.json`** — not added, per the constraint.
3. **Clerk application** — publishable + secret keys, and a JWT template named
   `convex`. Then `convex/auth.config.ts`:
   ```ts
   export default { providers: [{ domain: process.env.CLERK_JWT_ISSUER_DOMAIN, applicationId: 'convex' }] };
   ```
   with `CLERK_JWT_ISSUER_DOMAIN` set in the Convex dashboard, not in `.env.local`.
4. **Convex file storage** is part of the deployment; no separate account. **Bunny.net**
   (video) and **Paynow/Paystack** (payments) are separate signups and are not touched
   by any file here.
5. **A vision model** for the §5 redaction pass — `imageIngest.ts` is not written; it
   needs a decided provider and an `"use node"` action, since re-encoding cannot run in
   the V8 runtime.

Everything written here is reviewable now and compiles the moment step 1 runs.

## 8. Not written yet, deliberately

`marks.ts` (submit-a-mark, catalogue validation, `timeSpentSec` auto-flag),
`prescriptions.ts` (server-side generation), `imageIngest.ts` (§5), `crons.ts` (claim
expiry, auto-close, credit expiry, the 24h reveal-notification sweep), `middleware.ts`,
and `lib/progress-convex.ts`. `lib/progress.ts` is untouched — its `ProgressStore`
interface is the seam the Convex implementation slots behind, and changing its shape
now would be the one change that makes the swap harder rather than easier.

---

## Clerk instance configuration (not in code — set on the instance)

State that lives in Clerk, not the repo. Re-apply it on the **production instance**, which
starts from Clerk's defaults and will otherwise reintroduce the problem below.

**Phone collection is OFF.** The instance shipped with `auth_phone.required_for_sign_up: true`,
which meant Clerk's own `<SignUp>` asked every student for a phone number *before* onboarding
ran — collecting a minor's phone number in direct contradiction of §1 ("Not collected: …
phone number"). Disabled 2026-09-17:

```
npx clerk@3.3.0 config patch --json '{"auth_phone":{
  "required_for_sign_up": false, "used_for_sign_up": false,
  "used_for_sign_in": false, "used_for_second_factor": false }}'
```

Verified by creating a user with an email address and no phone. Email remains required.
`clerk config pull` prints the current state; `--dry-run` on a patch shows the diff first.

**JWT template `convex`** — `aud: convex`, lifetime 3600, clock skew 5. Created via
`POST /jwt_templates`. Convex trusts the issuer through `CLERK_JWT_ISSUER_DOMAIN`, set per
Convex deployment, so production points at the production Clerk instance without a code change.
**That env var is currently set on dev only** — `npx convex deploy` (which targets production)
fails until it is set there too.

**Password minimum is 8, not 15.** The instance shipped with `min_length: 15`, which failed
students on the very first screen after acquisition. Lowered 2026-09-17:

```
npx clerk@3.3.0 config patch --json '{"auth_password":{"min_length":8}}'
```

This is not a security downgrade. Breach checking (HIBP) is on at both sign-up and sign-in,
and no composition rules are set — which is the current NIST position: length minimums plus
composition rules push people toward predictable patterns, while breach-list checking blocks
the passwords that are actually used in attacks. 8 is also Clerk's own default.

**Password is optional — the student picks their sign-in method.** `auth_password.required`
was `true`, forcing every account to invent a password. Set to `false` 2026-09-17:

```
npx clerk@3.3.0 config patch --json '{"auth_password":{"required":false}}'
```

Password stays *enabled*, and `auth_email.sign_in_strategies` already contains `email_code`, so
both routes are live at once: a student may set a password and use it, or skip it and sign in
with a code sent to their email. Verified by creating an account with an email address and no
password (`password_enabled: false`).

Why it matters for this audience: teenagers lose passwords, and every password reset is support
work for a solo operator. Offering the code route removes that for the students who take it,
without taking passwords away from those who prefer them — notably guardians, who sign in
rarely and may not want to hunt for an email each time.

**Phone OTP is a Phase 2 item** (PLAN §3): SMS costs money per send and is an abuse vector
under paid ad traffic. If it is turned on later, turn it on for *sign-in*, not for sign-up.
