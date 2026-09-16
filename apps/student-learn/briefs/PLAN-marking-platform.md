# Build Plan — Stem 4 Life marking platform

**Status:** Decided, not started · **Owner:** Durai · **Author:** Claude (conductor)
**Date:** 2026-09-16 · **App:** `apps/student-learn` (Next.js 14 App Router, port 3002)

Supersedes the monetisation and engagement sections of `PRD-9709-fusion.md`. That
document's "Live-Fire Past-Paper Run" displays real Cambridge question text in-app and
is **on hold** pending the legal question in §9.

---

## 1. The model, in one paragraph

Students study free and anonymously. The paid product is **blind diagnostic marking**:
a student photographs work done on paper, submits it, and a verified teacher marks it
and diagnoses the specific gaps. The output is not a score — it is a **prescription**
into recorded material: *here is what you work on next*. Teachers author nothing;
material is generated. Teachers mark and guide. Traffic is bought on TikTok. Selling
ad space is not a near-term question.

**What we sell that cannot be scraped:** the diagnosis. Save My Exams sells material.
It cannot tell a student which parts they personally need.

**Where the moat actually is:** the recorded library. The marking loop is the instrument
that tells us what to record, and the reason anyone pays. It is not the asset.

---

## 2. Starting position (audited 2026-09-16)

Be honest about this — every estimate below depends on it.

| | |
|---|---|
| Framework | Next.js 14 App Router. **Not** SvelteKit |
| Backend | **None.** No Convex anywhere in the monorepo, only aspirational comments in `lib/progress.ts` |
| Auth | **None.** No provider, no session, no middleware |
| Progress | `localStorage` key `student-learn:progress:v1`, behind a `ProgressStore` interface designed to be swapped |
| Questions | **Zero.** A student on the live site cannot answer one |
| Grading engine | Real (`gradeAnswer` in `components/question-card.tsx`) but **orphaned** behind `/lesson/[code]`, which nothing links to and which fetches `localhost:3001` |
| Notes | The one complete pipeline. ~28 unique Mechanics topics after removing `-fable` duplicates |
| Videos | 38 files, 682 MB, **gitignored, 0 tracked** — a deploy today ships none |
| Ink solutions | One |
| Deployment | None. No hosting config, no domain, no analytics |

---

## 3. Architecture

| Choice | Why |
|---|---|
| **Convex** — whole backend | Database, file storage, scheduled functions, server functions in one deploy. No devops for a solo operator. `ProgressStore` was already designed for this swap |
| **Clerk** — auth | Roles and metadata, Google + email OTP now, phone OTP later. No password-reset support burden |
| **Guardian as a separate linked account** | The payer is not the learner. Gives the payment rail and the safeguarding mirror in one |
| **Convex file storage** — submission photos | Server-issued upload URLs; access enforced in a query, not by URL secrecy |
| **Bunny.net Stream** (or R2 + HLS) — video | 682 MB must never enter git. African PoPs, adaptive bitrate for expensive mobile data |
| **Vercel** — hosting | Zero-config App Router, preview deploys |
| **Paynow** (EcoCash/OneMoney) + **Paystack or Yoco** (SA) | Mobile money is the actual rail. Stripe is not available for Zimbabwe |
| **Manual weekly payouts** | Below ~50 teachers, automation is wasted months |
| **PostHog + TikTok pixel** | Non-negotiable *before* ad spend. You cannot buy traffic you cannot attribute |
| **Questions as versioned JSON in the repo** | Mathematical correctness gets reviewed in a git diff by a human |

---

## 4. Identity and blinding

Three principals in one `users` table with a role discriminator.

- **student** — first name and year only. Never surfaced to a teacher.
- **teacher** — `verifiedAt`, credentials, payout method. Cannot claim work until verified by hand.
- **guardian** — holds credits, linked to students by a code the student generates. Read-only mirror.

Roles live in Convex, not only in Clerk metadata, and **every function re-derives role
server-side**. Never trust a client claim.

### Blinding

Students are pseudonymous to teachers. University model: the paper reaches the marker
without the author's name.

- **Per-submission code, not per-student.** `C-XXXX-XXXX`, Crockford base32, CSPRNG,
  excludes I/L/O/U. Nothing derived from the student — not a hash of the user id, not a
  counter, not a date. Codes are never reused.
- A stable code would let a teacher build a picture of a person across submissions,
  which is the thing blinding exists to prevent. The linkage lives server-side and never
  needs to be visible.
- **The rotation cap still works**: max 3 marks per student per 30 days, enforced in the
  claim query against `studentId`. The teacher never learns two items are related.
- **Teachers are blinded too** — students see "Marker T-4B9C". Stable per teacher so
  quality flags mean something. Symmetric blinding closes the contact route both ways and
  costs nothing.
- **The teacher still gets useful context**, computed server-side and leaking nothing:
  *"this candidate has attempted F=ma 3 times; last mark 4/7; most recent error: resolved
  along the wrong axis."* That is most of the pedagogical value of knowing a student.

### Honest limit

Say *"teachers never see your name"*. Do **not** say they cannot identify you. Handwriting
is recognisable, and a student who writes "my father's shop in Bulawayo" into a worked
example deanonymises herself in content no filter can remove without destroying the answer.

---

## 5. The photo is the leak

The product is a photograph of a school exercise book. Books have names on covers,
students write names at the top of pages, desks have uniforms and timetables in frame.
**Perfect database pseudonymity is defeated by a biro.** This fails silently.

**Cheapest fix first, and it is not software.** A printable/on-screen answer-sheet header
per submission carrying the candidate code and the instruction **"write the code, not your
name"**. This is the literal university model and removes most cases before any detector runs.

**Two storage ids per image, always:**
- `originalStorageId` — admin-gated, never served to a teacher, retained for disputes.
- `teacherStorageId` — re-encoded, redacted derivative. The only image a marking query returns.

**Ingest, server-side, treating every upload as hostile:**
1. Decode and re-encode to JPEG. This *is* the EXIF strip — GPS, device id and timestamps
   survive only on the original, behind the admin gate. Never trust a client-side strip.
2. Vision pass returning boxes for: handwritten/printed names, faces, school badges,
   letterheads, timetables, ID cards, phone numbers.
3. Names/handles/numbers → **redact** (burn an opaque box). Faces, badges, ID cards, or
   low-confidence regions → **reject** (a box over a crest still leaves the uniform).
   More than ~25% redacted → reject, it is no longer markable.
4. **The student sees the derivative before submitting**, redactions visible: *"We covered
   your name — teachers never see who you are. Check your working is still readable."*
   The person best placed to catch a missed leak is the one who took the photo. This is the
   specific mechanism that prevents silent failure.
5. Teachers get a **"this looks identifying"** button: one tap pulls the item, refunds the
   credit, files a flag. Detector misses become a measured rate rather than an invisible one.

**If Phase 1 slips**, ship the answer-sheet template plus detect-and-**reject** (far simpler
than redaction) and add redaction in Phase 2. The template does most of the work anyway.

---

## 6. The marking loop

### States

`draft → submitted → moderating → queued → claimed → marked → returned → queried → answered → closed`

- `moderating` is the machine step in §5, before any teacher can see the image.
- `claimed` reverts to `queued` if not marked within 45 minutes.
- `returned` auto-closes after 7 days.
- `queried` is the student's **one** follow-up, scoped to that submission. Bounded on
  purpose: it is the entire chat surface of the product.

### Routing

**Pooled claim queue, not assignment.** A verified teacher sees a queue filtered to their
approved topics, sorted by `dueAt`, and claims one. Claiming is a mutation with an
optimistic-concurrency check on `claimedBy == null`. No student picks a teacher — that
turns a queue into a marketplace and halves throughput.

### Submission format

**Both, photo-primary.** Work happens on paper; forcing typed LaTeX out of a 17-year-old on
a phone kills the product. Client-side resize to 1600px, JPEG q0.8, max 3 images.

A **typed final-answer field is required alongside**. It auto-marks instantly via the
existing `gradeAnswer`, so the student sees something in two seconds while the method mark
waits for a human. That instant partial response is what makes a 12-hour turnaround tolerable.

### Turnaround as a promise

Promise a **clock time, not a duration**: *"submitted before 6pm → marked by 9am"*. Show a
live "typical turnaround today". **Missing the deadline auto-refunds the credit** — and that
refund is what forces supply to stay ahead of ad spend. No weekend promise until there is
weekend coverage.

---

## 7. The mark is a prescription

Free text is demoted to one line. The output is structured.

Teachers **pick 1–3 misconception codes** from a catalogue scoped to the question's syllabus
point. They cannot submit without one. The **server generates the ordered prescription**
from the catalogue — blocking gaps first, prerequisites before dependents, note → video →
two practice questions. Consistency comes from the catalogue, which is what makes §8 possible.

**The catalogue is mostly already written.** Generated lessons already carry a
`misconceptions[]` array with `wrongIdea` / `whyWrong` / `correctUnderstanding`, and
`Misconception` is already a type in `lib/types.ts`. Codes are syllabus-keyed off
`lib/syllabus.ts`, e.g. `M4.2-X03`.

### What the student sees

Not a marked page. **A short assignment.**

> **4 / 7.** Your setup was right; you resolved along the wrong axis twice.
> **Work on this next — about 25 minutes:**
> 1. Watch *Resolving forces on an inclined plane* (3 min)
> 2. Read the notes, "choosing your axes"
> 3. Try these 2 questions ← auto-graded, free, instant

Annotated photo underneath, not above. Items tick off. **Prescription completion is the
single best retention metric in the product** and the thing to optimise.

### Keep one human sentence

One mandatory `encouragement` line, free text. A mark built entirely from a picker reads
like an autograder — which is exactly what a student can already get for free. That line
does the work of proving a person read her page, which is the thing being sold.

---

## 8. Gap aggregation is the content roadmap

Every marked submission produces a diagnosed misconception tagged to a syllabus point.
Aggregated, that is a ranked list of what the cohort actually gets wrong — a content
roadmap generated by measured demand, pointed at the one capability that is faster and
cheaper here than anywhere else.

- **The catalogue is closed.** Teachers select, never invent. New codes are proposed as
  free text and only the owner promotes one. Without this the aggregation is noise within a month.
- Rank by `frequency × severity × (1 + coverage_gap_bonus)`, deduplicated by student so one
  struggling student does not outrank fifty.
- **"Record next" screen**: misconception, syllabus point, distinct students hit this month,
  whether a lesson exists, and one click to open the lesson pipeline pre-filled with the
  misconception and three real anonymised student errors as worked wrong-examples.

**Watch for tag drift.** Teachers will gravitate to the top three codes in the list because
picking is work. Randomise list order, require the evidence step, audit tag distribution
weekly — or the roadmap quietly becomes a popularity contest among the first-listed codes.

---

## 9. Coverage is a promise, and the gate on charging

A prescription is only as good as the material it points at.

**When a teacher diagnoses an uncovered gap:** the picker says "no lesson yet"; the
prescription surfaces the nearest covered prerequisite plus a 3–5 sentence targeted
explanation from the teacher (paid at 1.5×, it is genuinely more work); the student is told
the truth — *"We don't have a lesson on this yet. It's now top of the list — we'll message
you when it's up."* Then actually message them. A miss that converts into a published lesson
is a stronger retention event than a lesson that already existed.

**Do not charge until all of these hold:**
- Marking is sold **only for syllabus points in scope.** Scope starts at Mechanics. Never
  sell Pure marking with zero Pure lessons.
- Every in-scope syllabus point: ≥1 lesson or notes page, ≥3 questions.
- ≥80% of in-scope catalogue codes are `covered`.
- Measured miss rate <15% over a 50-mark pilot.

Until then marking is free pilot work, not a product. **Charging for a prescription that
points at nothing is the fastest route to a refund culture.**

### Legal, unresolved

Two council panelists cited Cambridge's permissions policy as refusing permission to
republish past-paper questions electronically; the judge could not confirm it (403).
**Treat as a real blocker until a lawyer says otherwise.** Decided approach: AI-remodelled
questions in-app, genuine papers on TikTok. Note the riskier leg is the TikTok one — that
claim arrives as a channel strike and kills the acquisition channel overnight.
Get a 1–2 hour opinion covering this *and* minors' data consent (POPIA, Zimbabwe DPA)
before writing questions.

---

## 10. AI in the loop, human on the hook

**Settled:** human in the loop, scale AI assistance as agreement is proven.

AI does **not** issue the verdict. The premium is that a real teacher looked at the work;
if a model marks it, that is not what is being sold, and marking stops being the scarce
asset a competitor cannot scrape.

Where AI earns its keep without touching that:
- **Transcribe handwriting into structured steps** so the teacher reads clean maths, not a photo.
- **Auto-mark the typed final answer** instantly (already planned).
- **Draft the mark; the teacher corrects it.** Six minutes to two cuts cost by two thirds
  and still sells a human verdict.
- **Draft the prescription** — mapping a diagnosed gap to lessons is pattern matching.
- **Flag teacher inconsistency** against the mark scheme. Quality control impossible by hand.

**Settle it with evidence.** While marking the first 200 submissions by hand to calibrate
the rubric, run AI marking silently alongside and compare. That gives a real agreement rate
before betting anything.

Why not full auto-marking: Cambridge mark schemes award method, accuracy and **follow-through**
marks. Follow-through requires reconstructing what the student *would* have got given their
own earlier error — a model of intent, not a check of arithmetic. It is exactly where a model
produces a fluent, plausible, wrong judgement.

---

## 11. Safeguarding

Adults interacting with minors. A design constraint from the first schema, not a later feature.

1. **No freeform channel exists.** No compose box not bound to a `submissionId`. No user
   search, no profiles, no way to address a person. Structural, not policy.
2. **Server-side contact filter** on every message and comment: phone numbers, emails,
   `@handles`, whatsapp/telegram/signal/instagram. Rejections write a flag. Grooming starts
   with "message me on WhatsApp" — block the sentence.
3. **Image moderation before a teacher sees anything** (§5).
4. **Manual teacher verification** by the owner: government ID, teaching credential, paid
   trial of 10 marks reviewed against a rubric. Police clearance moves to Phase 3 — with no
   channel, no identity and a rotation cap, the grooming pathway is structurally closed
   rather than screened. Revisit the moment any feature reopens a persistent channel.
5. **Append-only everything.** No delete, no edit. Corrections are new rows. Retain 3 years.
6. **Guardian mirror** where linked, and both parties are told it exists. Observed channels
   do not get abused.
7. **Report button** on every message and mark. Two open flags → automatic queue suspension.
8. **Rotation cap** — 3 marks per student per 30 days. Prevents a relationship forming.
9. **Published policy page and a named safeguarding contact.** TikTok ad review and any
   school will ask.

### De-anonymisation is an audited action

Not an ambient admin capability. Every admin view renders candidate codes; there is no
join from submission to student in any UI query. The only path is one mutation,
`revealCandidate({ submissionId, trigger, reason })`.

- **Who:** the owner only in Phase 1. Teachers never, however senior.
- **Triggers**, enumerated and required: `safeguarding_flag`, `payment_dispute`,
  `legal_request`, `student_or_guardian_request`, `account_recovery`. Free-text reason required.
- **Scoped and time-boxed:** one student, 60 minutes. Not a session-wide unmasking.
- **Logged** append-only, and exported off-platform weekly.
- **Notified:** student and guardian told within 24 hours naming the trigger, unless a
  safeguarding or legal hold suppresses it — which itself needs a second logged reason.
  Notification is what makes the log a control rather than a record nobody reads.

---

## 12. Unit economics

Marking costs real teacher time per submission. This is **not** a zero-marginal-cost
product, and that is the single most important fact when buying traffic.

**Assumptions:** teacher $0.70 per mark (~7 min, ~$6/hr effective — strong money in
Zimbabwe against a ~$300/month teacher salary). Processing 4%. Blended CAC ~$10 per paying
customer at $0.30/registration and 3% conversion.

**The pack: $12/month, 4 marks included, extra marks $2.50.**

| | |
|---|---|
| Revenue | $12.00 |
| Processing | −$0.48 |
| Marking (4 × $0.70) | −$2.80 |
| **Contribution** | **$8.72/month (~73%)** |
| CAC payback | ~1.15 months |

Four included rather than six because a prescription sends the student to free material and
free auto-graded questions before they submit again.

**The rule: price per mark ≥ 3× teacher pay per mark.** At 4.3× there is room for a teacher
pay rise or a CAC miss. At 2× there is neither.

### What loses money

| Shape | Outcome |
|---|---|
| **Unlimited marking** for a flat fee | Fatal. An exam-term student submits 60+. More tempting now because fulfilment *looks* free — it is not, the diagnosis costs $0.70 every time |
| 10 marks for $5 | −$1.20 per pack before any ad spend. Every sale makes it worse |
| **"First mark free" on cold TikTok traffic** | The money incinerator. ~$20 of trial marking burned per paying customer *on top of* $10 CAC. **Never offer free marks to paid traffic** |
| Rollover credits, no expiry | Cost concentrates in exam months with no matching revenue. A cashflow failure disguised as margin |

**Guardrails:** credits expire at 90 days. Free tier is notes, videos and auto-graded
quizzes, forever, no marking. Cap extra marks at 25/month — beyond that the student needs a
tutor, not a queue.

---

## 13. Teacher supply

**Teachers author nothing.** Material is generated. They mark and guide. This is a much
larger recruitment pool than content creators, a lower bar to verify, and it decouples
teacher supply from content production entirely.

**Seed supply before a single ad dollar.** Demand is buyable; verified maths teachers are
not. A student whose first paid submission sits unmarked for two days never returns.

> **Hard gate: 5 verified teachers with 6am–9pm weekday coverage before any ad spend.**

Until then the owner marks everything. The first 200 marks done personally are how the
rubric and the pay-per-mark figure get calibrated on real data — and how the AI agreement
rate in §10 gets measured.

**Recruit** via Zimbabwean teacher Facebook/WhatsApp groups and SA tutoring networks;
recently-retired teachers; final-year maths-education students (supervised). The pitch is
USD-denominated piecework, paid weekly, from a phone.

**Quality:** owner samples 10% of marks weekly. `timeSpentSec` under 90 auto-flags.
This is not hygiene — **the student cannot tell a sharp diagnosis from a lazy one**, so
sampling is the only thing standing between the product and silent degradation while
retention metrics still look fine.

**Payout:** weekly, manual, USD. EcoCash or Innbucks (ZW), instant EFT/Capitec (SA),
Mukuru cross-border. Do not automate until it costs more than an hour a week.

### Non-solicitation

Architecture removes the channel; the contract removes the incentive.

Independent contractor, per-mark fee. **12-month non-solicitation** covering anyone
encountered through the platform — enforceable precisely *because* the teacher was never
told who they were. No off-platform contact ever, including responding to a student who
initiates. All marks and prescriptions assigned to Stem 4 Life; student work is confidential
and never appears in a teacher's own content. No describing themselves as a Stem 4 Life
tutor on personal channels. **Liquidated damages with a specific number** — an unquantified
clause deters nobody.

Detection: the free-text surface is tiny, so the contact filter covers nearly all of it.
Add a one-tap student report — *"Did a marker ask you to contact them elsewhere?"* — on
every returned mark, plus an alert on anomalously high fallback-explanation rates, since
long free text is the only place solicitation can hide.

Risk here is genuinely **low**. The contract is for the day a teacher becomes popular.

---

## 14. Question pipeline

Six stages, one accountable human.

1. **Extract** — past paper item → `{stem, marks, topicCode, skillTag, markScheme}`.
2. **Remodel** — three models independently produce a variant: new numbers, new context,
   same skill, same mark tariff. Judge model picks best of three.
3. **Solve gate** — solved independently by two models *and* checked symbolically with
   SymPy. All three must agree to 3sf or the item is **discarded, not fixed**. Auto-reject
   ugly answers (non-terminating decimals, absurd magnitudes) — real exam questions have
   clean answers, and ugly ones are the signature of a botched remodel.
4. **Similarity gate** — reject if too close to source (copyright) or if the skill tag
   drifted (pedagogy).
5. **Human sign-off** — owner or verified senior teacher approves each item by name.
   **AI never self-approves mathematical correctness.** ~40 items/hour is the real rate limit.
6. **Publish with provenance** — source paper, generating model, solver agreement, approver,
   date — into `content/questions/<topic>.json` so correctness is reviewable in a git diff.

---

## 15. Build sequence

### Phase 0 — Make it public (~1 week)
Videos to Bunny; `public/notes/index.json` rewritten to playback ids; `/lesson/[code]`
deleted or defused (it fetches `localhost:3001` and fails on load); Vercel + domain +
PostHog.
**Demonstrable: a real URL a stranger can use, 28 topics of notes, 38 working videos.**

### Phase 1 — Identity + one paid marking loop (~5.5 weeks)
Convex; Clerk with three roles; `ProgressStore` swapped to Convex behind the existing
interface; **20 approved questions on one topic cluster** (forces and F=ma); candidate codes;
photo submission with the two-storage-id ingest, EXIF strip and redaction; the student
confirms-derivative step; answer-sheet header; pooled claim queue; diagnosis picker and
server-generated prescriptions; the bounded thread; contact filter; audit log;
`revealCandidate`; credits, Paynow checkout, **manual payout by spreadsheet**.
Owner marks everything.
**Demonstrable: a student photographs paper work, pays a credit, and a real teacher returns
marks and a prescription inside the promised window.**

**Explicitly NOT in Phase 1:** annotation canvas over the photo; teacher choice, ratings or
profiles; automated payouts; the full question bank; phone OTP; guardian dashboard beyond
the read-only mirror; native apps; **any ad spend**; leaderboards, streaks, gamification;
live TikTok; the orphaned `/lesson/[code]` renderer.

### Phase 2 — Supply and trust (~3 weeks)
Recruit and verify 5 teachers; paid trial marks; rubric; 10% sampling; SLA timer with
automatic credit refund; report flow; payout statements; phone OTP.
**Demonstrable: five external teachers clear a day's queue without the owner touching it.**

### Phase 3 — Acquisition (~3 weeks)
TikTok pixel and conversion events; a landing route built for the ad; 200 questions across
Mechanics; annotation canvas for teachers (reuse `perfect-freehand`); guardian dashboard;
police clearance collection; live TikTok if a second moderator exists.
**Demonstrable: $200 of ad spend produces a measured CAC to compare against $8.72/month.**

### Phase 4 — Scale what the numbers justify
Automated payouts, teacher choice, Pure papers, referrals, a $5 library-only downgrade tier
(zero marginal cost, an alternative to churn).

---

## 16. Files

**Create**
- `convex/schema.ts` — submissions, marks, prescriptions, misconceptionCatalogue, coverageMisses, creditLedger, teacherPayouts, flags, auditLog, deanonymisations
- `convex/submissions.ts` — submit / moderate / claim / mark / return, role checks server-side
- `convex/identity.ts` — code generation, `revealCandidate`, de-anonymisation log
- `convex/imageIngest.ts` — re-encode, EXIF strip, vision redaction, dual storage ids
- `convex/prescriptions.ts` — catalogue lookup, server-side generation, completion tracking
- `convex/auth.config.ts` + `middleware.ts` — Clerk, role gating for `/teacher/*`
- `lib/progress-convex.ts` — `ProgressStore` implementation swapped in behind the interface
- `app/submit/[questionId]/page.tsx` + `redaction-preview.tsx`
- `app/teacher/queue/page.tsx`, `app/teacher/mark/[id]/page.tsx` + `diagnosis-picker.tsx`
- `app/mark/[id]/prescription.tsx` — the "next 25 minutes" screen
- `app/admin/record-next/page.tsx` — the ranked gap roadmap
- `components/answer-sheet-header.tsx`
- `content/misconceptions/mechanics.json`, `content/questions/mechanics-f-equals-ma.json`
- `scripts/remodel-questions.ts`

**Change**
- `lib/progress.ts` — export the Convex store as the `progress` singleton, interface untouched
- `lib/syllabus.ts` — syllabus points become the catalogue join key; per-topic coverage state; add practice/submit targets
- `public/notes/index.json` — video paths → Bunny playback ids
- `app/lesson/[code]/page.tsx` — delete, or cut the `localhost:3001` fetch
- `package.json` / `next.config.js` — convex, @clerk/nextjs, image domains

---

## 17. Risks

1. **Highest-risk assumption, named: that a Zimbabwean or South African guardian will pay
   ~$12/month for marking, reached through a TikTok ad, having never met the teacher.**
   Every number in §12 is downstream of it and none of it has been tested.
   **Test it before building the queue** — landing page in Phase 0, 20 pre-orders taken by
   hand, marked personally over WhatsApp. If ten guardians will not pay, no architecture
   rescues it.
2. **Under-investing in the library while building marking infrastructure.** The moat is
   recorded material. 28 Mechanics topics is enough to pilot and nowhere near enough to
   charge broadly. §9's gate is a hard stop, not a target.
3. **Supply collapse under ad load** — one slow weekend after a TikTok spike and SLA refunds
   eat the month. Mitigated by the hard gate in §13.
4. **A safeguarding incident** — low probability, terminal impact, unrecoverable for a solo
   founder. §11 is the insurance premium.
5. **Question pipeline throughput** — human verification at ~40/hour is the bottleneck, and
   skipping it ships wrong maths, which destroys the only thing a teacher-marked product sells.
6. **TikTok copyright strike** on the genuine-papers channel, killing acquisition overnight.
7. **Payment rail friction** — mobile money failure rates are materially worse than card;
   expect 10–20% of early checkouts to need manual rescue.
8. **Tag drift** quietly turning the content roadmap into a popularity contest (§8).
