# 4.2.1a — Independent round-3 check

**CLEARED WITH MINOR EDITS.** R2-M1 and R2-M2 are fixed: completed counts now wait for genuine five-second windows, and the active net arrow fades when equality is reached. Two minor scheduling-record edits remain: explicitly carry the continuing water window across the Beat 12/13 boundary, and correct one provisional cue offset. No biological rewrite, narration cut or new error beat is required.

Reviewed at workspace commit `224cca1b`, against this reviewer's complete round-2 CHECK and `work/006/FIXES-round-2.md`. Read the revised storyboard and changes from `e3e3ebd1`; independently reran the validator and calculated cue offsets. Current storyboard SHA-256: `c178e99181b4e83b763729e2e3e7c6e592ba9faf0adcff43e7407874f6dbccf0`. No storyboard or shared input was edited. The template's explicit round-2 report path controls its stray “round-1 report” wording.

## Every round-2 item

| Round-2 item | Status | Evidence |
|---|---|---|
| R2-M1 — explicit window starts and separate live/completed counters | **FIXED** | DiffusionField's counter convention starts each window at zero, counts actual crossings and live populations, retains completed results in a separate labelled card, and forbids an early completed result. The completion guard is propagated to reused models and Plan interpretation 4. |
| R2-M1 — Beat 3 first window | **FIXED** | Actions 5–7 now start at “watch the counter in the middle”, 19.0 s, complete at 24.0 s, and highlight the already established imbalance at 24.5 s. The completed 12/4 and populations 22/18 stay historical through the definition; subsequent motion stays within compartments. |
| R2-M1 — Beat 4 windows and equality arrow | **FIXED** | Window 2 explicitly runs 0–5 s from 22/18, completing 9/7 and 20/20. Net 2 belongs only to that historical card. The active arrow fades at 5–6 s; window 3 runs 5–10 s with balanced crossings and completes 8/8 at 10 s. Later fade narration highlights the already-zero arrow. Dataset 1 and the model contract agree. The 7.0 s parenthetical is only a timing-record typo; correct it below. |
| R2-M1 — continuing balanced counts and thumbnail | **FIXED** | Beat 4 keeps live and retained counters separate. At the 36.5 s “cells exchange substances” cue, the current balanced window can finish at 40 s while the field shrinks; the thumbnail then retains the completed result. It fits the 51.5 s beat. |
| R2-M1 — oxygen/channel completion guards | **FIXED** | Beat 5 starts at 39 s and completes at 44 s, before its 45 s simple-diffusion cue. Beat 6 runs 2.5–7.5 s before the 8 s comparison. Beat 8 runs 26.5–31.5 s; its 29 s reverse-crossing cue no longer prematurely completes the sample. Correct endpoints and side populations are retained. |
| R2-M2 — unequal water sample | **FIXED** | Beat 12 actions 1 and 4 explicitly run the first window 2.5–7.5 s. The 15.5 s narration highlights a completed 15/9 result. Later crossings have their own live counter; unequal windows stop at the last endpoint before the intervention. |
| R2-M2 — equality, new sample and arrow | **FIXED** | Actions 8–10 retain the explicit solute-addition intervention, stop boundary crossings during it, label the old card before the change, start a NEW 0/0 counter at equality (42.5 s), and fade the arrow immediately over 42.5–43.5 s. The 45 s fade cue highlights zero rather than closing a sample. The equal-state 12/12 result waits until 47.5 s. |
| R2-M2 — propagate the state contract | **FIXED** | WaterPotentialModel.net-osmosis/equalise, Dataset 3 and Reusable models carry separate unequal/equal windows, explicit endpoints and immediate fade. No unequal-state crossing contributes to the new equal-state sample. The continuing next window needs the minor handoff clarification below. |
| S-R2.1 — regenerate beat headings | **FIXED** | All fourteen headings match the round-2 schedule, including the four-second E45 read and final two-second hold. The new continuous-water-window instruction needs explicit overlap with the opening recap to preserve those headings, as below. |
| S-R2.2 — Dataset introduction | **FIXED** | The requested replacement distinguishes Datasets 1–2's selected whole-token counts and probability illustration from Dataset 3's separately chosen water counts. It disclaims measured or exact predicted random outcomes. |
| Runtime ruling, E45 and protected cuts | **FIXED / FOLLOWED** | Narration and cue lists are unchanged. E45 remains 141 words plus four seconds reading, 74.5 seconds, with the written error, explanation and in-place correction protected. Optional cuts 2–5 remain untaken. The 11:15 ruling stands with the explicit overlap below. |

## Minor edits — exact wording

### R3-S1 — specify the continuing water window's handoff into the recap

The first equal-state window correctly ends at **47.5 s**, exactly when “water still crosses both ways” starts. Action 11 then keeps live counting going and says the window in progress at the beat's end must finish. The next window therefore runs **47.5–52.5 s**, crossing the **50.0 s** end of Beat 12. Beat 13 currently describes a static recap with only random token motion. The report's claim that all completed windows fit before their reporting cues does not resolve this new overlap.

This is a small handoff clarification, not a return of the premature-result or wrong-equilibrium defect. The unchanged water model can finish the sample during the recap's first 2.5 seconds, before “on the membrane and the water model” at 3.5 seconds. No additional hold is necessary if that carry is explicit.

Replace Beat 12 action 11 with:

> At *water still crosses both ways*, keep balanced two-way crossings and live counting going, with no net arrow; tag *no net movement; crossings continue*. The first equal-state window completes at 47.5 s. The next five-second window runs 47.5–52.5 s continuously across the transition into Beat 13: preserve the same water model, equal potentials and current-window counter through the transition, and finish that window 2.5 s into the recap before updating the last-completed-window card. Keep live counting separate from that retained card whenever further crossings are drawn. Unequal and equal samples remain visibly separate. Do not restart, shorten or prematurely complete a window at the beat boundary; this overlap adds no hold.

Add to Beat 13's opening visual instruction:

> The recap layout is fixed, but token motion and the current-window counter remain live. Carry the water window already in progress from Beat 12 to its endpoint 2.5 s into this beat; then update the separate last-completed-window card. Continued boundary crossings remain counted, with the net arrow at zero.

Append to Dataset 3's round-2 schedule:

> The next equal-state window, 47.5–52.5 s relative to Beat 12, continues through the same model into the first 2.5 s of Beat 13; the recap retains separate live and completed counters. No additional hold is required for this overlap.

Replace the CHECK RESPONSE round-2 runtime row's “No new hold is required … every completed window …” sentence with:

> The first equal-state water window completes within Beat 12; the next continues into the first 2.5 s of Beat 13 without a reset or extra hold. Other demonstrated windows fit their stated beats. Final measured audio controls the exact timings, and any additional hold must be counted.

### R3-S2 — one provisional offset

In Beat 4 action 2, replace:

> before *until the concentrations are equal* at 7.0 s

with:

> before *until the concentrations are equal* at 6.0 s

The validator's own tokenisation places 12 words before that phrase, hence 6.0 seconds at 120 wpm. Equality still occurs at 5.0 seconds and the fade completes at 6.0 seconds, so this correction does not change the intended animation.

## Regression, sources and new-problem scan

Programmatic comparison confirms **all narration blocks and all extracted cue lists unchanged** from the round-2-reviewed version. Citations, Real-world samples and Scope ledger sections are also unchanged. No new verbatim Cambridge quotation or assessment claim was introduced; the actual-PDF verification in the earlier reports still applies. New quoted prose is reviewer-authored scheduling guidance, not an exam quotation, so no new source-PDF verification is needed.

Previously cleared biology remains fixed: passive classification explicitly requires down-gradient movement without ATP; the glucose protein requirement alone does not classify every transporter; the carrier has an occluded middle; steroid synonyms remain one property point; the oxygen illustration tracks freely dissolved oxygen. The water comparison remains bounded to fixed volume, temperature and pressure, with equality caused by the labelled addition of solute rather than fictitious spontaneous equilibration.

Population arithmetic remains conserved: open field 30/10 → 22/18 → 20/20; oxygen 24/8 → 20/12 and separate 32/8 → 26/14; ions 20/5 → 14/11; glucose 15/5 → 16/4 → 15/5 → 14/6 → 13/7. Balanced open-field windows retain 20/20. Water counts remain chosen illustrations, 15−9=6 then 12−12=0; adding eight sucrose tokens gives 4+8=12 against 12 on the other side. Repeated water windows do not claim measured fluxes or a numerical water potential.

The new schedules do not introduce a handled sample, fabricated reading, estimate presented as an observation, text-only frame or unsupported real-world example. The generic water-only barrier remains visibly distinguished from the real-cell inset's continuous bilayer/channel. Existing conceptual-model limitations are not reopened as new defects. The one-second fade starts at equality; later spoken fade cues highlight its completed state rather than restarting it.

## Validation and runtime

Fresh supplied-validator run: **1,338 words, 140 cues, fourteen beats, zero failing beats**, maximum gap **27 words**. Beat totals: **96, 50, 101, 103, 98, 82, 90, 94, 95, 141, 88, 100, 112, 88**. Independent cue calculations confirm the principal windows above. The validator does not test elapsed animation time; the manual check is therefore necessary.

**Accept 11:15**, comprising 669 seconds effective narration, four seconds reading and two seconds final hold. The explicit overlap above preserves that estimate without shortening any window or speeding narration. E45 remains 74.5 seconds and the 16-second carrier sequence remains schedulable within Beat 9. If production instead holds at the end of Beat 12 until the continuing window completes, it must add 2.5 seconds at this provisional pace and shift later headings; the recommended overlap avoids that extra hold. Actual measured audio and rendered frames remain production checks.

Only R3-S1 and R3-S2 remain as minor edits. No new substantive return is required for the biology or the repaired R2-M1/R2-M2 mechanisms.

CLEARED WITH MINOR EDITS
