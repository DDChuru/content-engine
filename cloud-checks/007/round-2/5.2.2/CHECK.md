# CHECK — 5.2.2 — round 2

Checked 27 September 2026 at `ac5d63c3`, against the complete current storyboard, own round-1 CHECK, `work/007/FIXES-round-1.md`, 5.2.1's owner model, shared spec, OPEN ASSETS register and conductor's round-1 README (read from `origin/cloud/007-checks`). Source SHA-256: `a1de04ebdabeab0b698701ddeafd4c619a82fa884f327f85428157428bb383ae`.

All must-fixes are resolved under the conductor's image ruling. One should-fix is partly complete: the blue style is registered, but its owner/shared-spec usage wording conflicts with the consumer's field-only instruction. No storyboard edited.

## Every round-1 item

| Item | Status | Evidence in revised storyboard |
|---|---|---|
| M1 — incorrect one-group gate | FIXED | Causal spine, DecisionStrip step 3 and Beat 10 title/opening/action 1 use arrangement within each cell; two separated groups explicitly support anaphase. Two reforming nuclei remain the telophase distinction. |
| M2 — real-image dependency | FIXED under conductor ruling | `work/007/ASSETS-NEEDED.md` lists all PM frames plus the detail-poor cell/PM-PALE, their required features, stages, magnification, stain, organism and beat uses. Narration uses *image* and *cells in the image* rather than claiming a real photograph is held. The fallback is an explicitly labelled drawing, never synthetic microscopy. This check does not demand actual image files. Topic 1 component resolution also remains production work. |
| M3 — first-contact stain timer | FIXED | Rig `stain` state and Beat 6 actions 4–5 start timer and gradual colour change on first contact; subsequent cues highlight the existing sequence and never restart it. Treatment finishes before rinse. Acid's first-contact rule remains explicit. |
| M4 — dispensing versus aspiration | FIXED | Parts include separate bulb pipette and labelled waste. Handling, `rinse-stain` and Beat 6 action 6 compress the bulb before immersion, immerse at the liquid edge away from tips, release to aspirate, lift and empty into waste; repeat for rinse water. Specimens remain on the watch glass. |
| SF1 — low-power selection after squash | FIXED | Beat 8 scans small meristem cells; intact-root anatomy is shown on the earlier schematic. PM-LOW cap labels are conditional on a genuinely retained region; recap/counting references follow that rule. |
| SF2 — protocol provenance | FIXED | Rig introduction explicitly identifies collar, blade/tile and bath support as handling adaptations to the SAPS chemical sequence/timings, and names the source's different props. |
| SF3 — objective entry | FIXED | All three authored pictograms are visible from the objectives surface's first frame; text/secondary icons arrive at cues. |
| SF4 — owner registration of blue style | PARTLY | 5.2.1 now registers the style with unchanged geometry/states/counts. However its paragraph and SHARED-SPECS say diagram references, whereas this storyboard requires blue exclusively in FieldOfViewSchematic and shared hues elsewhere. Exact shared repair below. |
| SF5 — stale PDF flags | FIXED | Historical items 3–5 are now explicitly resolved by the original-PDF audit; exam cards remain authored adaptations. Microtubules-not-visible context is verified without inventing an absence of plant microtubules. |
| SF6 — reproducible E5-05 timing | FIXED | Beat 13: 60.41 s speech + 4.00 s read + 8.59 s anchored holds = 73.00 s. Mark boxes/evidence comparison provide 5.70 s inside the talk-through: 39.31 + 5.70 = 45.01 s. Completed frame gets 2.89 s. Final measured audio must retain 65–75 s total and at least 45 s talk-through. |
| SF7 — final hold | FIXED | Beat 17, beat introduction and ledger consistently add 2 s: 11:26.5 becomes 11:28.5. |
| Runtime ruling and cuts | FIXED | Total stays within explicit 11:29 acceptance; optional list now totals 58 words and gives 10:59.5 including the hold. No forced cut or thinned error beat. |
| Quote-check reproducibility | FIXED | Literal revised checker succeeds using existing input-branch refs where needed: 15 checked, 0 not found. No fetch needed. |

## Plan must-fix propagation and changed-text scan

MF1: shared plant model retains centromere division and daughter labels on the separation frame; no count strip is displayed; 2n = 4 teaching model is distinguished from garlic 2n = 16. MF2: E5-05 penalises E only, preserves F's mark, finishes with E metaphase/F anaphase, and puts evidence beyond the mark scheme. MF3: nucleoli fade and return in the recall. MF4: decision route, complete SAPS sequence, first-contact timing, physically possible aspiration, low-power selection and static-image interpretation are now explicit; OPEN ASSETS plus photo-or-labelled-drawing wording satisfy the conductor's storyboard ruling. MF5: 51/4/2/1/2 = 60; nine mitotic cells; 9/60 = 0.15 = 15%; interphase 85%; an undivided telophase cell counts once. Frequency/duration inference remains conditional and approximate, with no duration invented from the authored field. MF6: four of fifteen fixed-sample papers, six marks plus one disclosed mixed mark, zero sampled P3, and counting's syllabus basis remain correct. All applicable plan must-fixes now reach this storyboard under the conductor ruling.

Changed text introduces no new biology, timing/contact-state error, invented reading or observation/estimate substitution. Sixty distinct whole schematic cells and the nine valid mitotic addresses remain consistent. Timers are method timings, not readings. Covered supported pressing and low/high-power microscope handling remain physically specified. Objectives and exam/recap surfaces retain visible pictograms/models/images; grey placeholders are openly declared asset slots, not invented specimens. Drawings are labelled as drawings.

## Remaining minor edit — SF4 owner/consumer agreement

Keep 5.2.2's existing field-only blue-style rule. In `storyboards/topic-05/5.2.1/STORYBOARD.md`, replace the **Render styles** paragraph with:

> **Render styles (registered by the conductor after round 1, at 5.2.2's request):** `default` uses the chromosome hues above. `toluidine-blue-schematic` is a plant-only style with dark-blue chromatin and chromosomes on a paler background, with no per-chromosome hues; in 5.2.2 it is used exclusively inside `FieldOfViewSchematic`. Diagram references beside the image panels retain `default`. Geometry, stage states and counts are identical in both styles. Retain the schematic and non-garlic-karyotype captions.

In `work/007/SHARED-SPECS.md`, replace the matching registration bullet with:

> `MitosisCellModel` registers `renderStyle: toluidine-blue-schematic` (plant variant only, dark-blue chromatin and chromosomes on a paler background) exclusively for 5.2.2's `FieldOfViewSchematic`. Its diagram references beside image panels retain the default chromosome hues. Geometry, stage states and counts are unchanged; retain the schematic and non-garlic-karyotype captions.

This is one shared minor repair, also recorded in 5.2.1's report. No narration change is needed. The historical CHECK RESPONSE need not be rewritten as if the later registration already existed at its original writing.

## Validation and evidence

`python3 work/007/validate_storyboard.py storyboards/topic-05/5.2.2/STORYBOARD.md` — **17 beats, 1,373 words, 178 cues, maximum gap 27 words, 0 failing beats**. E5-05 **146 words/95 talk-through words**. `python3 work/007/check_quotes.py storyboards/topic-05/5.2.2/STORYBOARD.md` — **15 checked, 0 not found**. Source-text matching alone does not establish original-PDF authority; that audit is recorded in round 1.

No new substantive Cambridge quotation was introduced. Rechecked the clarified microtubule claim against `/home/dachu/sme-9700-archive/pastpapers/2021/June/9700_s21_qp_22.pdf`, p2, Q1(a)(ii), with pdftotext: microtubules are present but not visible in Fig. 1.1. Original R-line, answer, tariff and figure checks carry forward from round 1. The chemical protocol is unchanged; handling adaptations are now accurately attributed.

Runtime: 1,227 teaching words = 613.5 s; error beat 73.0 s effective; total 686.5 + 2 s final hold = **688.5 s (11:28.5)**, within the explicit round-1 limit. Missing images remain OPEN ASSETS, not outstanding must-fixes for this storyboard check.

CLEARED WITH MINOR EDITS
