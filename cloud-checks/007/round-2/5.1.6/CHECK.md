# 5.1.6 — round-two check

Reviewed 27 September 2026 at `ac5d63c3`, against my round-one report and `work/007/FIXES-round-1.md`. Read the complete revised storyboard and amended shared contracts. Storyboard SHA-256: `5c976fd0cec41aa15ca8bf6dbe318d0426bfd47ec531af8ca60f0f54b70fccbd`.

## Every round-one item

| Item | Status | Evidence in revised STORYBOARD.md |
|---|---|---|
| M1 — mutation definition and causal qualification | FIXED | Beat 4 defines a DNA-sequence change, uses **can disrupt**, and bounds loss of control to the illustrated example. The star label names a control-disrupting mutation. Beat 5's general sentence/box and Beat 8's standalone recap retain **can**. Multiple mutations remain typical and the three-star illustration is labelled schematic, not an obligatory threshold. |
| M2a — repeated cycles and replication inset | FIXED | Lines 50–58 and the beat-wide contract require an omitted-interphase/early-mitosis caption and explicit time cut before each miniature run, including secondary growth. Visible chromosome groups are labelled a simplified model set. Beat 5's replication inset precedes the selected division and closes or returns to an unreplicated daughter at a labelled transition; Beat 8 explicitly uses that post-division state. |
| M2b — continued surface loss | FIXED | `repeated-division`, Beat 1 action 8 and Beat 5 action 4 preserve ordinary surface loss while starred-cell production exceeds it. The tap's drain continues. `held` is expressly restricted to a brief healthy-tissue comparison. |
| M3a — E5-07 extension boundary and answer order | FIXED | Beat 7 introduces its credited-answer summary after the four-second read and before “Beyond the scheme”. The healthy comparison has its own labelled panel and the answer stays visible. The full correction, truthful badge and 90-word talk-through are preserved. |
| M3b — both final answers before the skin callback | FIXED | Beat 9 actions 2–3 supply the W20 sufficient answer and the distinct two-link S24 answer. Both remain visible during the spoken beyond-scheme callback and labelled healthy-skin panel. |
| M4a — actual highlight target | FIXED | Beat 7 action 9 underlines **has mutated**, which exists in the displayed adapted header; the supplied-context tag and our-framing caption remain. |
| M4b — objective first frame | FIXED | Beat 2 begins with all pictograms present; existing narration cues reveal text and emphasise the pictures. |
| M4c — mutually exclusive tissue states | FIXED | Beat 7 holds the tumour at left; the separate healthy panel enters later. No single instance is simultaneously balanced and growing a tumour. |
| SF1 — explicit error-beat delivery schedule and hold | FIXED | Runtime section reserves 12 s framing + 4 s silent read + 45 s talk-through + 13 s correction = **74 s**, explicitly an allocation pending recording. The final two-second hold is reserved within the effective envelope. |
| SF2 — recount and sensible cut policy | FIXED | Fresh totals reproduce 744 words / 6:12; cumulative headings reach 6:12 (intermediate boundaries rounded to whole seconds). The 147-word error beat is 73.5 s by the effective-rate estimate and has the separate feasible 74 s delivery allocation above. The 14-word contingency cuts correctly yield 730 words / 6:05 and protect the error beat. |
| SF3 — precise S24 demand | FIXED | Beat 9 row 2 says why supplied CDK inhibitors can treat a cancerous tumour, with the treatment purpose also in narration. CDK is supplied question context, not a new recall list or mechanism lesson. |
| SF4 and citation-resolution items | FIXED | Both stems, both schemes and the supplied inhibitor information are resolved; adapted headers/answers remain labelled our framing/summary. Fresh quote check completes: 8 checked, 0 not found. Its source reader uses existing input-branch objects where disk files are absent; no fetch was needed. Rendered QA remains explicitly pending. |

## Fresh checks and actual-source audit

`python3 -B work/007/validate_storyboard.py storyboards/topic-05/5.1.6/STORYBOARD.md` passes: **744 words; 85 cues; 9 beats; 0 failures; maximum gap 20 words; E5-07 147 words, talk-through 90 words**. Teaching/framing/recap totals 597 words (4:58.5); the error beat adds 73.5 effective seconds, giving **6:12**, 12 seconds / 3.3% above the six-minute budget. Accept this content-led overrun; no cut is required. The four-second read is not added twice. The explicit subsection allocation protects the full 45-second talk-through and remains within 65–75 seconds.

Reopened the actual local PDFs with `pdftotext -layout`:

- November 2020 `9700_w20_qp_21.pdf`, p15: the newly transcribed stem **“Outline how mutations can result in the development of a tumour.”** is exact. Its supplied mutation context and two-mark tariff are correct. `9700_w20_ms_21.pdf`, p12, confirms any two credited consequences; the displayed chain is sufficient. The adapted lesson question correctly keeps its own framing label rather than attributing **explain** to the original stem.
- June 2024 `9700_s24_qp_23.pdf`, p13: **“Explain why CDK inhibitors can be used to treat cancerous tumours.”** is exact, and the supplied CDK/role/inhibitor table is present above it. `9700_s24_ms_23.pdf`, p10, confirms stopping the cycle before division and preventing uncontrolled division from increasing tumour size. This is a two-link answer, not W20's any-two rubric.

These newly transcribed stems match the PDFs regardless of their italic rather than double-quote formatting. The G05 statements remain authored summary/inference, not Cambridge quotations. The storyboard's historical note that the stems were not yet in VERIFIED-EVIDENCE describes its drafting source state; they now also appear in the amended shared evidence file. Likewise, the fresh successful quote run here relies on existing git objects rather than on the draft author's disk layout. Neither historical note undermines the now-reproduced source checks.

## Regression and plan-fix propagation

The plan's adult-tissue qualifier, E5-07 supplied-mutation/any-two explanation, single-mutagen scope, typical multiple-mutation qualification and supplied-information S24 item remain intact. Previously incomplete shared replication/repeat and exam-extension requirements are now satisfied. Mutation inheritance, nuclear/cytoplasmic division order, continuing loss versus production, invasion, vessel travel and secondary growth have compatible specified motion. No invented assay, measured cell counts, calculated-as-observed values, new handling issue, text-only entrance or unlabelled real-world exam extension was found. Error marking clears only on the completed corrected frame; the wrong answer stays written, and no candidate prevalence is invented.

No outstanding replacement is required. Clearance is for the written storyboard, not measured audio or rendered-frame performance. Only this report was written; storyboard content was not changed.

CLEARED
