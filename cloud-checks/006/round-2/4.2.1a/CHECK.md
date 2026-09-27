# 4.2.1a — Independent storyboard check, round 2

**NOT CLEARED.** The corrected populations, 16-second carrier sequence, passive-route qualification, steroid answer and dissolved-oxygen example are sound. The remaining blocker is narrower than round 1: some five-second counting windows still close at narration cues that do not leave five seconds, and the water-model instructions retain the old net arrow briefly after equality. These are visual timing instructions, not a need to rewrite the biological explanation or shorten the lesson.

Read this reviewer's complete round-1 report, the complete revised storyboard and `work/006/FIXES-round-1.md`. Independently reran the supplied validator, calculated cue offsets and population changes, and reopened the PDFs supporting changed source claims. Workspace commit: `e3e3ebd1`. Storyboard SHA-256: `b00623debcff1a7c7074db5e384f4e97a19dacd995693f748ecbe95d9cfd7da0`. No storyboard, shared model or source input was edited.

## Every round-1 item

| Round-1 item | Status | Evidence and remaining limit |
|---|---|---|
| M1 — Dataset 2 finite-population continuity | **FIXED** | Models and Dataset 2 contain the requested labelled-new-setup contract, live side-count updates, conserved populations and last-completed-result captions. The old “not depleted” instruction is removed. The recap uses completed populations rather than starting values. |
| M1 — Beat 5 impossible 20/20 → 24/8 addition | **FIXED** | Action 5 explicitly resets to a new 24/8 setup and says it is not a continuation. Remapping to “Here we track freely dissolved oxygen” is necessary after M4 removed the old cue and preserves the requested action. Six inward/two outward ends at 20/12. |
| M1 — Beat 6 stale population and comparison | **FIXED** | Begins at the completed 20/12 result, explicitly resets to 32/8 for the steeper-gradient comparison, and ends at 26/14. Net 6 versus net 4 is shown only when the window has finished. Other factors reset separately. |
| M1 — channel populations and uncounted mechanism | **FIXED** | Beat 8 starts a labelled 20/5 setup, separates the explanatory first ion into a mechanism callout, and counts eight inward/two outward in the main field, ending 14/11. The completion action can run to the actual end of its five-second window; it need not finish at the start of “A few go the other way”. |
| M1 — carrier's impossible five-second window | **FIXED** | Beat 9 explicitly uses 16 seconds, including a 0.8-second empty reorientation. A reverse cycle followed by three inward cycles conserves 20 tokens and finishes 13/7. The 3/1 result is withheld until all events finish. The exception appears in Models, Dataset 2, Reusable models and Plan interpretations 4. No time-lapse or instantaneous flipping remains. |
| M1 — uncounted carrier replays altering the counted field | **FIXED** | Beat 9 separates its teaching cycle from a labelled counted reset. Beats 10 and 14 use independent, labelled mechanism callouts while retaining the counted field's 13/7 result. |
| M1 — Beats 3–4 staged windows and live counts | **PARTLY** | Conservation and last-completed-window language are present, but exact cue instructions still close the first window after only about 2.5 seconds and do not explicitly start the next two windows. R2-M1 below supplies the missing timer/state contract. This is a remaining scheduling gap, not a claim that the requested paragraph was omitted. |
| M1 — expected counts versus actual random outcomes | **FIXED** | Dataset 1 says selected illustrative counts and distinguishes the p × population expectation from a guaranteed random sample. Equilibrium's deliberately paired crossings are identified as an illustration of equal average flux, not a universal five-second result. |
| M2 — protein requirement alone must not imply facilitated diffusion | **FIXED** | Beat 7, Beat 13, causal spine and route bracket now state net movement down the gradient without ATP at the classification itself. Beat 9's caution and the 4.2.1b handoff remain. |
| M3 — steroid synonyms are one property point | **FIXED** | The 16-word narration sentence is removed. Beat 14 row 3 gives the required two-point property-plus-bilayer answer, says non-polar/lipid-soluble are alternatives within one point, and retains small size as another accepted point in this question. Obsolete cues are gone; the steroid/bilayer visual remains. |
| M4 — dissolved versus haemoglobin-bound oxygen | **FIXED** | Beat 5 uses the replacement narration and visible freely-dissolved-O₂ caption. The source ledger identifies W22/23 Fig. 6.1 and OpenStax; it does not invent an endorsed-coursebook page or imply that every lung-capillary red cell maintains an inward gradient indefinitely. |
| S1 — visible water-model assumptions and intervention | **FIXED** | Model contract and Beats 11–12 display fixed volume/temperature/pressure, not an osmometer, volume changes not modelled; solute addition is labelled “we change the left solution”. Same-solute equality is bounded to this comparison. The separate timing issue in the equality transition is R2-M2. |
| S2 — generic barrier versus real membrane | **FIXED** | Main barrier remains conspicuously a generic water-only model; the real-cell inset has a continuous bilayer and an actual teal water-channel protein, with no exposed-tail hole or macroscopic tear. The reuse guard is documented. |
| S3 — carrier must have an occluded middle | **FIXED** | `TransportProteinSet` says outer access closes before inner access opens and vice versa; the site is never open to both sides simultaneously. |
| S4 — one rate factor at a time; bound the property statement | **FIXED** | Beat 6 restores baseline before temperature, area and distance. Uncounted qualitative demonstrations set aside numeric counters. The final sentence is explicitly about bilayer passage. |
| S5 — student-facing provenance and citation cleanup | **FIXED** | Internal plan/PDF/UNVERIFIED labels are removed from student-facing question cards; authored paraphrase labels remain. Citations include W22/23 and W20/21, and resolved source gaps are recorded with the original author's status distinguished from the independent check. |
| S6 — hook protein route and recap history/equality | **FIXED** | Beat 1 glucose crosses at a teal protein symbol. Beat 13 highlights the old “initially” labels as history, dims them, then highlights current equality; it no longer treats unequal and equal potentials as simultaneous current conditions. |
| Runtime ruling — take cut 1, retain cuts 2–5, declare holds | **FIXED / FOLLOWED** | Only the required steroid cut is taken. Total is recounted at 1,338 words; explicit read and final hold are separately included. The carrier window fits its beat at the estimated pace. Headings have not all been regenerated from the revised ledger; see S-R2 below. |

## Remaining must-fixes — exact replacement instructions

### R2-M1 — Complete five-second windows on the animation clock, not on premature result cues

The validator tests cue strings, not elapsed time. Under the storyboard's own effective 120 wpm schedule:

- Beat 3 starts crossing at “Particles cross both ways”, approximately **22.0 s**, and says the first five-second window closes at “more cross from left to right”, approximately **24.5 s**: only **2.5 s** later.
- Beat 4 begins with the old 12/4 result and no stated new-window start, yet closes another window at “the counts come closer”, approximately **4.0 s** into the beat. It then closes the balanced window at approximately **9.0 s**. The first interval is short or unspecified.
- The generic instructions mix a frozen “last completed window” with a counter that continues incrementing. Separate the completed result from the live counter instead of allowing a historical result to acquire new crossings under its old label.

Replace the relevant counter convention and Beat 3 actions 5–7 / Beat 4 actions 1–4 with:

> Each counted window has an explicit start and runs for five seconds of animation time. The current-window counter begins at zero and increments only on actual crossings; the live side populations update at the same crossings. On completion, retain its result in a small card labelled “last completed five-second window”. A continuing live counter is labelled “current five-second window” and is separate from that retained result. No completed result is revealed before its window has elapsed. Tokens can continue moving within their compartments between counted sequences; whenever they cross the boundary, count them.
>
> Beat 3: at *watch the counter in the middle*, start the first five-second window and its actual two-way crossings. At *Particles cross both ways*, highlight crossings already in progress. At *more cross from left to right*, highlight the developing imbalance; show the completed 12/4 result and 22/18 side totals only once the five-second window has completed. Retain that completed result through the definition, with random motion within the compartments; do not perform uncounted boundary crossings.
>
> Beat 4: from the first frame, start the second five-second window from 22/18. At *the counts come closer*, highlight the developing difference, not a prematurely completed total. At five seconds, complete 9/7 and the live populations 20/20; retain net 2 only in that completed-window card. Immediately start a third five-second window, with scripted balanced two-way crossings and the active net arrow at zero for the now-equal concentrations. At *the two numbers run level*, highlight its equal live counters. At ten seconds, retain the completed 8/8 result. From *still cross both ways*, continue balanced counted windows with the live counter distinct from the retained result. Keep the net arrow at zero for the equal-concentration state; random movement and two-way crossings continue.

Keep 30/10 → 22/18 → 20/20 and all existing narration. In the final edit, if a spoken result would precede actual completion, move the window's start earlier within its established setup or insert a labelled looking pause and account for it; never accelerate a five-second window or fabricate its completed counter. Apply that same completion guard to the correctly specified five-second oxygen and channel examples. No new experimental readings or biological rate claims are introduced.

### R2-M2 — Align the water-model counter and net arrow with the actual equality state

Beat 12 begins its first counted movement at about **2.5 s** but says the five-second window closes at “More water molecules cross from the higher”, about **15.5 s**. A displayed five-second sample cannot actually span thirteen seconds. At the other end, equality is reached around **42.5 s**, but “The net arrow fades” around **45.0 s** is instructed to close the next five-second window only **2.5 s** later. The arrow must represent the active equality condition, not wait for an old unequal sample to expire. The newly explicit fixed-volume intervention makes this state distinction clear; retain it.

Replace Beat 12's counter/equality actions and the corresponding `WaterPotentialModel.equalise` contract with:

> At *in both directions all the time*, start a five-second illustrative window in the unequal comparison, with actual water crossings. Complete and retain 15/9 only after five seconds, labelled “last completed five-second window”; further displayed crossings have a separate live counter. At *More water molecules cross from the higher*, highlight this completed unequal-state result rather than closing a thirteen-second interval as if it were five seconds.
>
> At *add solute to the left*, show “we change the left solution” and the eight added sucrose tokens as specified. When L reaches R at *the water potentials are equal*, label the previous 15/9 card “before the change — completed window”, start a NEW five-second window at 0/0, and fade the net arrow to zero over one second immediately. Script balanced two-way crossings throughout this equal-potential window. At *The net arrow fades*, highlight the now-zero net movement; do not claim the new five-second counter has already completed. Only at the actual five-second endpoint show its completed 12/12 result. At *water still crosses both ways*, keep the equal-state motion and live counting going, with no net arrow. Unequal and equal samples remain visibly separate.

This preserves the correct biology and count arithmetic. It also prevents any build from collecting unequal-state crossings into the new equality window to obtain its 12/12 target. The existing 50-second beat has room for this schedule at the stated pace; no narration cut is needed.

## S-R2 — minor record corrections

1. **Regenerate provisional beat headings.** The runtime ledger is correct, but headings after the edited teaching still reflect old lengths. From the current word totals, with the four-second read and separately declared final hold, use this provisional schedule (seconds; final measured audio supersedes it):

| Beat | Start–end |
|---|---|
| 1 | 0:00–0:48 |
| 2 | 0:48–1:13 |
| 3 | 1:13–2:03.5 |
| 4 | 2:03.5–2:55 |
| 5 | 2:55–3:44 |
| 6 | 3:44–4:25 |
| 7 | 4:25–5:10 |
| 8 | 5:10–5:57 |
| 9 | 5:57–6:44.5 |
| 10 | 6:44.5–7:59 |
| 11 | 7:59–8:43 |
| 12 | 8:43–9:33 |
| 13 | 9:33–10:29 |
| 14 | 10:29–11:15, including the final two-second hold |

2. The Datasets introduction still says every dataset is built from one probability, although Dataset 3 correctly says its water counts are not derived that way. Replace that introductory claim with: **“Datasets 1 and 2 use selected whole-token counts illustrated by p × starting population; Dataset 3 uses separately chosen illustrative water-crossing counts. None is a measured or predicted exact random outcome.”**

## Independent arithmetic, carrier and source checks

| Demonstration | Independent result |
|---|---|
| Open field | 30/10 with 12/4 → 22/18; then 9/7 → 20/20; balanced 8/8 retains 20/20. Forty tokens conserved. |
| Oxygen | 24/8 with 6/2 → 20/12; separately reset 32/8 with 8/2 → 26/14. Totals 32 and 40 conserved respectively. |
| Ions | 20/5 with 8/2 → 14/11. Twenty-five tokens conserved. |
| Glucose | 15/5; first outward release → 16/4; three inward releases → 15/5 → 14/6 → 13/7. Final counter 3 inward/1 outward; twenty tokens conserved. |
| Water comparison | 15 − 9 = 6 towards the initially lower potential. Added sucrose: 4 + 8 = 12. New equal-state counter 12 − 12 = 0. No numerical potential is claimed apart from the defined 0 kPa reference. |

The carrier schedule is now physically schedulable within its abstraction: reverse 0–2.7 s; inward cycles 3.2–5.9, 6.7–9.4 and 10.2–12.9 s, then rest through 16 s. Populations update on releases, not only after the empty reset; the final release precedes the final reset, so withholding the completed card until 12.9 s is conservative and valid. From “without ATP” to the beat end there are approximately **18 seconds** at the counting convention (29.5–47.5 s); the last cue is about 16.5 seconds after the start. The author's rounded 16/17-second explanation is slightly rough but does not conceal a required hold. Actual audio still decides whether one is needed.

| Source treatment changed in round 1 | Actual PDF verification in round 2 |
|---|---|
| S21/22 steroid answer | Reopened `/home/dachu/sme-9700-archive/pastpapers/2021/June/9700_s21_qp_22.pdf` p.6 and `9700_s21_ms_22.pdf` p.12. Q3(b), two marks, any two: bilayer/core passage; the property group including non-polar/lipid-soluble; small size. The new row separates those points correctly. |
| W22/23 oxygen context and ion-route citation | Reopened `2022/November/9700_w22_qp_23.pdf` p.15, Fig. 6.1, and `9700_w22_ms_23.pdf` p.19. The diagram supplies a lung-capillary red cell with oxygen entering and haemoglobin combination. Q6(a)'s one-mark alternatives support the protein-route reminder without forcing the exchanger to be the lesson's fixed open channel. |
| W20/21 added citation-table row | Reopened `2020/November/9700_w20_ms_21.pdf` p.10, Q4(b)(ii). It is a mixed five-mark phloem account, not five pure osmosis marks. The revised ledger remains correctly bounded. |
| E45's exact ER quotation and local MS treatment | Unchanged from the round-1 directly verified passage and scheme. The “incorrect answers” subgroup is preserved; there is no new purported Cambridge quotation, global size prohibition or examiner-frequency claim. OpenStax remains an attributed supporting source for the example, not a fabricated endorsed-coursebook page. |

## Validator, new-problem scan and runtime ruling

Literal validator rerun: **1,338 words, 140 cues, 14 beats, zero failing beats**; maximum gap **27 words**. Beat totals: **96, 50, 101, 103, 98, 82, 90, 94, 95, 141, 88, 100, 112, 88**. The results in FIXES-round-1.md agree. It checks exact cue text/order and error-beat length, but cannot detect the clock/state conflicts above.

No new substantive biology error was found in the repaired narration. Channel versus carrier, occlusion, same-compartment count bookkeeping, passive conditions and dissolved-oxygen qualification pass. Water potentials retain correct signs/direction; equality is an explicit intervention within the bounded comparison, not a simulated osmometer. No observed or calculated experimental reading is invented. Mechanism callouts now separate uncounted explanatory cycles from finite demonstrations. Objectives and revised close retain visual scaffolds; there is no new text-only beat. No real apparatus, stain, first-contact timer or handled specimen is introduced; the relevant real-world examples remain schematic and properly scoped.

E45 remains complete: written composite, four-second silent read, full explanation and in-place correction under the COMMON MISTAKE marker until the completed answer. Its **141 words / 74.5 seconds including the read** are protected. Source-wording distinctions and genuine exam contexts are retained.

**Accept 11:15**, including the explicit four-second read and two-second final hold, thirty seconds above the 10:45 budget. Teaching is 1,197 words = 9:58.5, plus the two-second final hold; the error beat is 74.5 seconds. Required scientific repairs account for the small increase since round 1. R2-M1/M2 change visual scheduling, not spoken length, and can fit within these beat allowances. If final audio requires an additional anchored hold, count it honestly; do not speed speech or thin E45. Keep the previously protected optional cuts 2–5.

Return required only for R2-M1/R2-M2's completed-window/equality instructions and their propagated model/data records, plus refreshed provisional timings. This ruling does not reopen the corrected biology or demand a new lesson split.

NOT CLEARED
