# Roadmap to revenue — Stem 4 Life

**Status:** Live plan · **Owner:** Durai · **Author:** Claude (conductor)
**Date:** 2026-09-18 · Works backwards from the May/June 2027 exam season.

Companion to `PLAN-marking-platform.md` (the *what*) and `DELIVERY-PLAN.md` (the *workstreams*).
This one answers **by when, and what we give up**.

---

## 1. The calendar, honestly

| | Date | From today |
|---|---|---|
| Cambridge Oct/Nov 2026 exams begin | ~12 Oct 2026 | **24 days** |
| Oct/Nov season ends | ~27 Nov 2026 | 10 weeks |
| Selling opens for May/June | 1 Feb 2027 | 19 weeks |
| May/June 2027 exams begin | ~3 May 2027 | **32 weeks** |

*(Exam dates are approximate — confirm against the published Cambridge and ZIMSEC timetables
before anything depends on a specific day.)*

---

## 2. What we concede, and why it is not a loss

**Concede: no paid marking in the Oct/Nov 2026 season.**

Twenty-four days is not enough to build a submission path, an image pipeline, a marking
interface, a payment rail and recruit five verified markers. Attempting it produces all five
half-finished and none working.

**This was never a revenue season in the plan.** The go-to-market decision already said run
Oct/Nov free and start charging in February. So "we are behind" is only true against a target
nobody set. What we would genuinely lose is the *beta* — and that is what makes February
possible, because it is where the marking rubric gets calibrated, the first real submissions
arrive, and the pay-per-mark figure stops being a guess.

**So the October target changes from "the product" to "the library, in public."**

---

## 3. Phase A — Ship the library (now → 12 Oct, 3 weeks)

One goal: **a stranger can use stem4life.com and study 9709 Mechanics for free, on a phone,
during the highest-intent three weeks of the year.**

No accounts required. No submission. No marking. No payments.

| # | Work | Why it is in scope |
|---|---|---|
| A1 | **Next 15 migration** | Unpatched critical advisory; cannot ship publicly without it. 6 routes now, a week's work at 20 |
| A2 | **Videos off git to a host** | 682 MB gitignored — a deploy today ships *zero* videos and every lesson says "coming soon" |
| A3 | **Deploy to stem4life.com** | Vercel + DNS. Durai owns the domain |
| A4 | **Low-data mode** | Notes first, 360p option, file sizes shown. Mobile data in Zimbabwe is among the world's most expensive — this is retention, not polish |
| A5 | **Analytics (Plausible) + error reporting** | You cannot improve or later buy traffic for something you cannot measure |
| A6 | **YouTube: upload all 31 lessons** | Free distribution, Google carries ad compliance, and it is where students already are |

**Not in Phase A:** registration is built and works, but does not need to be *required* — study
stays anonymous. Leave the sign-up path live for anyone who wants progress sync.

**Done when:** a phone on a Zimbabwean network loads a lesson in under 5 seconds and plays the
video.

---

## 4. Phase B — Build the loop while the season runs (Oct → Nov, weeks 4-10)

The season is running; students are on the site. Build the thing they will pay for next time,
and **use real students to test it.**

| # | Work | Notes |
|---|---|---|
| B1 | **Image ingest** | Gemini first. Answer-sheet header + student-confirms-redaction are the layered defence that makes a good-not-perfect detector safe |
| B2 | **Submission path** | Camera-first, client compression, typed final answer for instant auto-marking |
| B3 | **Marking interface** | Must close the 5 deferred findings in `DELIVERY-PLAN` W1 — especially the rotation cap, which release currently erases |
| B4 | **Prescriptions** | Needs the amendment-K schema fix first. The student sees "your next 25 minutes", not a score |
| B5 | **Questions 12 → 40+** | Coverage 19% → 80%. **Decide first: is `covered` ≥2 questions or ≥3?** At 3 it is currently 0 |
| B6 | **Durai marks everything himself** | The first 200 marks calibrate the rubric, set the real pay-per-mark, and measure AI agreement silently alongside |

**Done when:** a real student submits a photo and gets a human-marked prescription back inside
the promised window — **for free**, with Durai as the only marker.

---

## 5. Phase C — Supply and trust (Dec → Jan, weeks 11-19)

Nothing here is buildable without Phase B running first.

| # | Work |
|---|---|
| C1 | Recruit and verify **5 markers** — university students + retired teachers (counter-cyclical availability) |
| C2 | Paid trial of 10 marks each, reviewed against the rubric Phase B produced |
| C3 | 10% sampling, SLA timer with automatic credit refund, report flow |
| C4 | Credits + Paynow/Paystack checkout; **guardian-link gate on paid submission** (amendment A) |
| C5 | Legal opinion delivered and acted on: Cambridge question reuse + minors' consent |
| C6 | Terms, privacy notice, refund policy published |

**Done when:** five external markers clear a day's queue without Durai touching it.

---

## 6. Phase D — Sell (Feb → May 2027, weeks 20-32)

| # | Work |
|---|---|
| D1 | Open Session Pass sales for May/June 2027 |
| D2 | **First ad spend** — and not before C1 is done. A student whose first paid submission sits unmarked for two days never returns |
| D3 | Pure 1 production in parallel — every candidate sits Pure; Mechanics is one option among several |
| D4 | School and tutor pilots: 3-5 Cambridge schools in Harare and Johannesburg |

---

## 7. The gates — do not pass these

These are not targets. Passing them early does more damage than arriving late.

1. **No ad spend until 5 verified markers cover 6am-9pm weekdays.**
2. **No charging until ≥80% of in-scope catalogue codes are `covered`.** Today: 19%.
3. **No charging until the legal opinion is in.** It decides which product exists.
4. **No public deployment on Next 14.** Unpatched critical advisory.
5. **No paid submission by a minor without a redeemed guardian link.**
6. **Never a free mark to paid traffic.** ~$20 of trial marking burned per paying customer, on
   top of ~$10 acquisition. It is the fastest way to lose money at scale.

---

## 8. Blocked on Durai — each is one decision

| Decision | Blocks | Cost of delay |
|---|---|---|
| **Vision provider** (recommend: Gemini) | B1 → B2 → B3 → everything | The whole submission path |
| **Video host + Vercel** | A2, A3 | Phase A entirely |
| **Merchant account** (Paynow ZW / Paystack or Yoco SA) | C4 | Only bites in Dec; start it in Nov, onboarding is slow |
| **Legal opinion** (1-2 hours) | C5, and the question pipeline | Could invalidate work already done |
| **`covered` = 2 or 3 questions?** | B5 | Authoring starts on the wrong target |

---

## 9. What "behind" actually means

Not behind on revenue — February was always the date.

The real risk is **Phase A slipping past mid-October**, because then the highest-intent window
of the year passes with nothing public, no traffic measured, no students to test Phase B
against, and no audience to sell to in February.

**Phase A is three weeks of work and needs three accounts opened.** That is the whole
critical path right now.
