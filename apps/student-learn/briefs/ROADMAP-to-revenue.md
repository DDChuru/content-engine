# Product plan — Stem 4 Life

**Status:** Live plan · **Owner:** Durai · **Author:** Claude (conductor)
**Date:** 2026-09-18 · Supersedes the exam-calendar roadmap of the same name.

Companion to `PLAN-marking-platform.md` (the *what*) and `DELIVERY-PLAN.md` (the *workstreams*).
**This one is about what to build, in what order.** Marketing is deliberately out of scope here.

---

## 0. Two corrections to the previous version

1. **There is no exam-date deadline.** The Oct/Nov 2026 pressure was a personal milestone, not a
   commercial one. Nothing in this plan is dated against an exam timetable. Ship when it is good.
2. **Free AND paid from day one.** The previous plan said run free and charge from February. That
   was wrong, for a reason worth keeping: a product that is free while a paid tier is "coming"
   anchors everyone on free and converts nobody. Payments get built early, not late.

---

## 1. The free/paid line

The principle is the one already settled: **the material is marketing, the assessment is the
product.** Applied one tier lower than `PLAN-marking-platform.md` §7 assumed, so it can ship
before verified markers exist.

| FREE — learn | PAID — practise and be assessed |
|---|---|
| All notes | The exercise-question bank |
| All videos | Auto-marking + full worked solutions |
| **The interactive artifacts** | Mastery tracking that means something |
| Registration, progress on one device | Offline / low-data packs |
| A sample of questions per topic | Progress synced across devices |
| | *Later:* human marking + prescriptions (upgrade tier) |

**Why the interactives are free.** They are the memorable, shareable thing — the reason a
student sends a link to a friend and the thing a celebrity can point a camera at. Paywalling
the hook kills the distribution it exists to create. Same argument as video: cheap for us,
expensive to copy, best used as reach.

**Why human marking is not the entry tier.** It has a real marginal cost per submission and it
needs verified markers with weekday coverage. Launching it thin produces missed turnarounds and
refunds. Paid tier 1 has **zero marginal cost**, so it can launch the day the payment rail works.

**The hard consequence:** 12 questions is not a paid product. The question bank stops being a
gate on a roadmap and becomes **the thing that decides whether launch works at all.**

---

## 1a. The product is the interactive artifact (decided 2026-09-18)

Durai, on seeing the three prototypes: **"OMG mind blown, that is the product."**

This supersedes the ordering in §2, which had interactives as P4, a differentiator on the free
tier. They are the product. The consequence is not enthusiasm, it is a merge:

**A predict-gate IS a question.** The pulley artifact already makes a student commit a number and
then shows them being wrong. That is auto-marked assessment wearing the costume of play. The
question bank (P1) and the artifacts (P4) are therefore **one workstream at two scales**, not two.

**What turns it from a demo into a product: persistence.** The prototypes deliberately record
nothing. "You said 10, it was 4" is:
- the mastery signal — real evidence of a held misconception, not a self-reported confidence
- the thing that makes the app feel like it knows the student
- the bridge to the marking platform: a marker seeing "this candidate predicted g on a pulley
  twice" has the §4 anonymous prior context, earned rather than inferred
- the part no competitor can copy by looking at the page

It needs `lib/progress.ts` → Convex, which is the swap the interface was built for.

**Scope, from the build's own recommendation — take it.** Not 28 topics. It earns its place only
where a wrong belief is *visual and numeric with something to drag*. Third-law pairing and unit
discipline are language errors; a widget there is a quiz with extra steps. Target the **8-10
misconceptions at severity 4-5 that have a draggable parameter**, each one the *hinge* of a
notes page: prose leads in, the artifact is where the student gets caught, prose closes with the
exam-safe procedure.

**One critique to fix while scaling:** two of the three hide their model until the student
commits, so the page's first impression is reading, not touching — the opposite of the instinct
this is built on. The pulley shows its diagram first and reads far better. Give every artifact a
live teaser above the gate.

**Free/paid, revisited.** §1 still holds but sharpens: free is a handful of exemplar artifacts —
they are the shareable hook a celebrity can point a camera at. Paid is **practising every
misconception with your predictions tracked**, which is where the value compounds and where the
zero-marginal-cost tier finally has something substantial in it.

---

## 2. Build order — what to code

### P1. The question bank (the critical path)

Everything paid depends on this. Nothing else matters as much.

- Take `content/questions/` from **12 → 150+** items across the Mechanics unit.
- `scripts/build-exercise-questions.py` already gates: 3 independent solution routes, one
  symbolic, all agreeing to 3sf, or the item is discarded.
- **Decide first:** `covered` = ≥2 questions per misconception code, or ≥3? At 2 the current
  count is 4 codes; **at 3 it is 0.** Authoring starts on the wrong target until this is settled.
- Apply amendment F: allow recurring answers where the stem says "to 3 significant figures".
- The real rate limit is **human sign-off of the mark scheme**, ~40 items/hour — not generation.
- Then: **Pure 1.** Every candidate sits Pure; Mechanics is one option among several.

### P1b. Question sourcing — a SEPARATE project (decided 2026-09-18)

Durai holds a large archive of real past papers and mark schemes. The pipeline splits in two,
and the split is exactly where the copyright exposure sits:

**Scraper — the genuine article, for social media.** Ingest real papers and their mark schemes
into a structured store. These are used **as they are on TikTok and YouTube**, where publishing
the real question is the point. Note the risk already recorded in §9 of the marking plan: the
TikTok leg is the *more* exposed of the two, because a claim there arrives as a channel strike
and kills the acquisition channel overnight.

**Generator — original items, for the app.** Takes a scraped item and varies the numbers, the
context and the wording to produce an original question *and its mark scheme*, which is the part
`build-exercise-questions.py` currently has no machine check for (amendment E: the mark scheme,
not the answer, is what human sign-off is really for). Output goes through the existing solve
gate — three routes, one symbolic, agreement to 3sf or discard.

**This is the product**, and it is a project of its own rather than a task inside the app build.
Set it up separately. Nothing in the app shell waits on it.

### P2. Payments and entitlement

Build it now, not later. It is the thing that makes tier 1 real.

- Credit/subscription ledger, entitlement checks server-side (never client-trusted).
- Paynow (EcoCash/OneMoney, ZW) + Paystack or Yoco (SA). Mobile money is the rail; cards are not.
- **A parent must be able to pay for a student they are linked to** — the payer is not the learner.
- Amendment A: paid actions by a minor require a redeemed guardian link.
- Per `PLAN-marking-platform.md` Appendix A, consent `assuranceLevel` upgrades to
  `payment_verified` here. **This is the only real verification of a guardian that exists.**

### P3. Practice loop

- Topic → question → attempt → auto-mark the typed answer → full worked solution → retry.
- Reuse `gradeAnswer`; `ExerciseQuestion` already extends `Question` so no adapter is needed.
- **Un-orphan or delete `/lesson/[code]`** — it fetches `localhost:3001` and fails on load.
- Mastery derived from real attempts, so the badges finally fire.

### P4. Interactive artifacts (free tier, and the differentiator)

- Three prototypes in flight. The standard: **the misconception catalogue is the spec, and every
  artifact lets the student be wrong first.** Predict, commit, find out.
- Scale across the unit once the standard is agreed. Not all 28 topics need one; some are
  genuinely better as prose.
- Phone-first, touch, low data. They must weigh less than a video, not more.

### P5. Deployability

- **Next 15 migration** — unpatched critical advisory on 14; cannot ship publicly. Cheapest now.
- Videos off git to a host. 682 MB gitignored: a deploy today ships **zero** videos.
- Vercel + stem4life.com. Low-data mode: notes first, 360p option, sizes shown.
- Analytics before any paid traffic. You cannot buy attention you cannot measure.

### P6. Human marking (upgrade tier, after the above)

Everything in `DELIVERY-PLAN.md` W1 plus the five deferred security findings — the queue
exposing work pre-claim, access outliving the claim, the erasable rotation cap, the
context fingerprint, unsanitised teacher-visible strings. Needs image ingest (vision provider),
the submission path, and verified markers.

---

## 3. Gates that still stand

Not dates. Conditions.

1. **The paid tier must be substantial at launch.** Thin paid + bought traffic = refunds.
2. **No human marking sold until 5 verified markers cover weekdays.**
3. **No public deployment on Next 14.**
4. **No paid action by a minor without a redeemed guardian link.**
5. **Never a free human mark to paid traffic** (~$20 of marking burned per conversion, on top of
   acquisition). Auto-marked free samples are fine — they cost nothing.
6. **Legal opinion before the question pipeline scales:** Cambridge reuse + minors' consent.

---

## 4. Blocked on Durai

| Decision | Blocks |
|---|---|
| `covered` = 2 or 3 questions? | P1 — authoring starts now and needs the target |
| Merchant account (Paynow / Paystack or Yoco) | P2 — onboarding is slow, start it early |
| Video host + Vercel | P5 |
| Vision provider (recommend Gemini) | P6 only — no longer on the critical path |
| Legal opinion (1-2 hours) | P1 at scale |

---

## Appendix — Distribution (recorded, not planned here)

Kept for context because it shapes what the product must withstand, not because this document
plans it.

- **Paid celebrity promotion on TikTok** — musicians and comedians paid to push the channel.
  Decided 2026-09-18.
- Implication for the product: traffic will arrive in **spikes**, from people who trust the
  promoter rather than the product, and who will judge it in seconds. That argues for the free
  tier being genuinely impressive (the interactives), the paid tier being obviously substantial,
  and the sign-up path being short — the current five-step picker is long for a phone.
- A free revision offer for students sitting current-session exams is a marketing option once a
  syllabus is complete. It is not a build dependency.

---

## Appendix B — OPEN: tutor and admin dashboards, and the correction loop

Raised 2026-09-18. **For stewing, not for building yet.**

### The idea
A **tutor dashboard** where tutors review published material and leave corrections —
including **timestamped comments on a video** ("at 2:14 the normal reaction is drawn wrong").
An **admin dashboard** over the top for oversight. The video and content people then pick the
corrections up and act on them.

### The constraint that shapes the design
**The correction work is done through Claude Code and Codex, not through an API.** Durai already
pays for those; metered API calls are a separate cost he does not want to take on yet. If the API
route ever becomes sustainable, that is a later decision.

This is not a limitation, it is a design instruction, and it changes what the dashboard is for:

- The dashboard's **output is a brief**, not an API call. A correction should come out shaped
  like the briefs that already drive this project: which file, what is wrong, what "done" looks
  like, what must not change.
- A human dispatches that brief to an agent. The dashboard tracks the correction's state
  (raised → briefed → fixed → verified) but never executes anything itself.
- **This keeps the expensive judgement where it already works** — a person deciding what to fix
  and an agent doing it under a cross-engine review gate.

### What already exists and should be reused, not rebuilt

1. **Timestamped video comments are already built.** `remotion-branding/tools/annotate.html`
   loads a recording, lets you scrub and drop marks (tap / rect / circle / arrow / label) with
   `atSec` and normalised 0..1 coordinates, and exports marks JSON. That IS the tutor comment
   feature. It was written to annotate tutorials; the data shape is identical to what a
   correction needs.
2. **The admin dashboard partly exists** — `app/admin/catalogue` with role gating, audited
   mutations and a no-hard-delete rule already established.
3. **The append-only audit machinery** (`auditLog`, every consequential action recorded) is the
   ledger a correction workflow needs.

### Questions to settle before building
- Is a "tutor" here the same principal as a **marker** (blinded, pooled, per-submission) or a
  different, named role? A reviewer of published material has no reason to be anonymous, and
  probably should NOT be — corrections need attribution. That is a second, named role.
- Does a correction attach to a **video timestamp**, a **notes paragraph**, a **question**, or a
  **misconception code**? Probably all four, which argues for one `corrections` table with a
  polymorphic target rather than four features.
- A correction that says "this lesson teaches the misconception wrong" is the highest-value kind
  and links straight to the catalogue. Worth designing for explicitly.
- Who closes a correction — the person who raised it, or the one who fixed it? (The marking
  platform already answers this for submissions; reuse the pattern.)

### The wider reuse
This is the same shape as the food-safety training product (Appendix note, 2026-09-18): a review
loop over published material, with an attributable ledger. Building it once for Stem 4 Life and
again for corporate training would be a mistake worth avoiding.
