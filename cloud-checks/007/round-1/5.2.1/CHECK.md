# CHECK — 5.2.1 — round 1

**NOT CLEARED.** The plan's scientific corrections largely reached the prose, count table and error beats. However, Beat 8 delays the corrected chromosome count until well after separation, contradicting the shared model's one-frame contract. Prophase spindle geometry needs an explicit envelope constraint. The real photomicrograph is still an unresolved production dependency.

Checked independently on 27 September 2026 against the complete local VIDEO-STRUCTURE.md (including REAL-WORLD SAMPLES), verbatim syllabus outcome, amended Topic 5 plan and weights, SHARED-SPECS, SUMMARY, and the original Topic 5 plan CHECK retrieved from `origin/cloud/007-checks`. Storyboard source was read only. Original QP/MS PDFs were read with pdftotext; the whitefish and chromosome 11 question figures were also rendered and inspected.

## Must-fixes — exact replacements

### M1. Make the anaphase count, labels and separation agree on the same frame

Beat 8 actions 2–5 currently separate the units at “The centromeres divide”, introduce their name later and leave the whole-cell strip at four chromosomes until “Now count”. The intervening movement would show eight separate chromosomes against a four-chromosome count. The correct dataset elsewhere does not resolve contradictory execution cues.

Replace Beat 8 actions 2–5 with:

> 2. At *The centromeres divide*, switch every replicated chromosome to two separated units in one rendered frame. On that same frame, give each unit its own centromere, label one deep-blue unit **daughter chromosome**, and update the strip to **whole cell · 8 daughter chromosomes · 8 DNA molecules**. Remove the joined-sister label. Preserve all eight DNA molecules.
> 3. At *each one is a daughter chromosome*, highlight the existing daughter-chromosome label and its centromere; do not introduce or change the biological state here.
> 4. At *shorten, pulling them to opposite poles*, shorten the attached fibres as the daughter chromosomes move towards opposite poles. At *centromere first*, ring the leading centromeres. Retain the U/V schematic qualification.
> 5. At *Now count*, stop movement near the poles and highlight the already-correct whole-cell strip; do not change its values. Introduce the one-pole row only after arrival, as specified in action 7.

Add to the shared-model/count-strip instruction:

> All replays, including Beat 9 and downstream lessons, update the chromosome count and daughter-chromosome label on the separation frame. DNA-molecule count does not change. A row labelled “one pole” describes an arrived group; before arrival use “moving towards one pole”.

### M2. Keep spindle fibres outside the intact nuclear envelope

Beat 6 draws fibres meeting across the cell before its central nuclear envelope fragments. The geometry must not allow those lines to pass through the intact nucleus or attach prematurely.

Replace Beat 6 action 2 with:

> At *microtubules grow out*, grow spindle microtubules from the centrosomes through the cytoplasm around the outside of the still-intact nuclear envelope; label **spindle (microtubules)**. No fibre crosses the intact envelope or reaches a chromosome. Once action 3 fragments the envelope, fibres may extend into the former nuclear region. Show centromere attachment at the existing Beat 7 attachment cue.

Replace the model's Spindle transition with:

> Spindle microtubules grow from the animal centrosomes or the plant's broad pole regions. While the nuclear envelope is intact, keep them outside it. After envelope breakdown, chromosome-attached fibres reach the centromere regions, with opposite-pole attachments to the two sister chromatids. Distinguish these from any fibres overlapping elsewhere in the spindle.

This preserves spindle formation during prophase without adding motor chemistry or extra named stages.

### M3. Resolve the real-image dependency and remove the visibility absolute

Beats 1 and 13 require a real root-tip image, but no source, licence, organism, stain or actual target cells are identified. It is honest to flag the placeholder, but it does not satisfy the real-sample requirement for production clearance. In addition, staining does not justify “every nucleus shows” in an unselected image.

Replace the Beat 1 sentences beginning “The stain colours…” with:

> Staining can reveal chromatin between divisions too. In some cells, darker condensed chromosomes show that division is under way. We will use their arrangement to recognise stages in the next lesson.

Replace Beat 1 action 4 with:

> At *Staining can reveal chromatin*, ring the selected visible interphase nuclei, tag **chromatin stained**. At *darker condensed chromosomes*, ring the selected dividing cells, tag **condensed chromosomes**. At *recognise stages in the next lesson*, show the **identification: 5.2.2** tag. Match the number and positions of rings to the verified image.

Replace the photomicrograph asset instruction with:

> Before production clearance, supply the actual licensed root-tip photomicrograph, its source URL or archive identifier, reuse licence, organism and preparation/stain metadata. Record the image crop and coordinates of the visible interphase nuclei and dividing cells used by Beats 1 and 13. Match rings, labels and colour descriptions to that image. If three clear examples of each are unavailable, reduce the rings and revise the cue accordingly. Retain the specimen as a static photograph; animate only annotations. Do not substitute generated microscopy or the 2n = 4 schematic.

The missing factual metadata cannot be supplied as invented replacement text. It remains an open asset dependency.

## Should-fixes

1. **Resolve stale verification labels.** The QP stems/figures, MCQ demands and nucleolus credit have now been checked directly (table below). Replace Citations UNVERIFIED items 2–4 and the “PDF-UNCHECKED” nucleolus entry with: **“PDF-VERIFIED in round-1 CHECK against the original QP/MS pages listed below; displayed question cards and drawings remain authored adaptations.”** Keep image licensing and Topic 1 component identifiers open. Do not present authored cards as Cambridge transcripts.
2. **Error-beat timing needs a production ledger.** The declared 120 wpm is an effective final-video rate including silence, so adding another four seconds mechanically would be wrong. However, word counts alone do not prove a 45-second talk-through. Preserve both scripts and specify a feasible schedule. At a spoken 145 wpm, E5-04 can use 60.83 s speech + 4 s reading + 8.67 s anchored holds = 73.50 s; allocate at least 6.11 s of the holds within its 94-word talk-through. E5-03 can use 62.07 s speech + 4 s reading + 8.93 s anchored holds = 75.00 s; allocate at least 7.35 s within its 91-word talk-through. Anchor these holds to the DNA tally and the two local reject/correction comparisons respectively. Measure the final audio and maintain at least 45 s talk-through and 65–75 s total; do not speed or thin the explanation to fit.
3. **Objective entry:** add **“The three authored pictogram groups are visible from the first frame of the objectives surface; narration cues introduce their corresponding text and highlights.”** This removes the unspecified opening interval before the first cue without using the lesson diagram as the objectives background.
4. **E5-03 marking precision:** replace “three credited points for three marks” with **“a sufficient answer for the three available marks; not every alternative in the scheme is required.”** Its final sentence contains material matching more than three listed alternatives (including both cytokinesis and membrane pinching); the question is capped at three, not a compulsory three-item checklist.
5. **Handle bookkeeping:** replace the stale typicality sentence about “Splits” with **“The handle is ‘line up, part the pair, walk apart’; the scientific description says that centromeres divide and sister chromatids separate.”**
6. **Final hold accounting:** Beat 19 explicitly holds its final frame for two seconds. State whether this is reserved within the effective runtime or additive; the conservative ruling below includes it.
7. **Cut arithmetic:** the proposed four cuts total 57 words using the validator's counting convention (16 + 7 + 10 + 5 + 19), not 55/about 50. Runtime acceptance below makes them optional. Do not silently remove human-count teaching merely to claim exact budget compliance.

## Did the plan CHECK's must-fixes reach this storyboard?

| Plan must-fix | Finding in 5.2.1 | Status |
|---|---|---|
| MF1: count chromosomes by centromeres; distinguish compartments; S replication; telophase whole cell vs each nucleus | Table correctly gives post-S/metaphase 4/8, separated whole cell 8/8, one pole/new nucleus 4/4, daughters 4/4. Typical diploid human counts are qualified. Replication occurs in S, not prophase. Daughter-chromosome wording is accepted. Beat 8's delayed strip conflicts with the corrected model. | **Partial — M1** |
| MF2: E5-03 local rejects and completed answer; E5-04 conserve chromosome 11's DNA and mark correctly | E5-03 corrects envelope and animal cytokinesis, keeps the marker until both repairs, and cites the local counter-ruling. E5-04 starts from one chromosome 11, exposes invented DNA in two intact Xs, permits U/V, and states 3 marks from 4 features. The 2n = 4 extension is labelled. | **Reached** |
| MF3: nucleolus disappears in prophase and reappears in telophase | Explicit in spine, model, animal and plant teaching; no extra ribosome lesson. Other telomere/stem/cancer fixes belong to other lessons. | **Reached for applicable scope** |
| MF4: genuine microscopy, stain honesty, root-tip handling | Context photo is explicitly real and static, not the schematic; no stage diagnosis is claimed here. Source/licence/organism/stain are still missing, and “every nucleus” overstates visibility. Full preparation and identification belong to 5.2.2. | **Partial — M3** |
| MF5: index counts and duration caveat | No index calculation or invented duration inference in this lesson. | **Not applicable; owned by 5.2.2** |
| MF6: corrected incidence/marks and local A/R distinctions | Header uses 6/15, 3 P1 + 3 P2, 14 marks; the six-paper demand ledger below supports the allocation. B name/function is 1 of 2 marks. Local kinetochore and nuclear-envelope distinctions retained. ATP is left with 5.1.3. | **Reached** |

The plan check's must-fixes therefore did **not all fully reach executable storyboard instructions**, despite the corrected prose and tables.

## Citation audit — original documents

Archive root: `/home/dachu/sme-9700-archive/pastpapers/`. Page numbers are one-based PDF pages. Both the question and mark-scheme contexts were checked; no examiner-report frequency claim is inferred from a reject line.

| Claim / quotation | Original evidence | Result |
|---|---|---|
| Outcome 5.2.1 verbatim; introduction “DNA replication followed by nuclear division” | Local SYLLABUS-9700-DETAIL.md, outcome 5.2.1 and Topic 5 introduction, syllabus p23 | Matches. |
| Whitefish A/B stage context; role of microtubules, describe, any 3 | `2022/November/9700_w22_qp_23.pdf` pp10–11; `9700_w22_ms_23.pdf` pp14–15 | Confirmed. Q4(a)(ii) 3 marks; attachment, movement/alignment, shortening and segregation are supported alternatives, not a mandatory full list. Figure inspected. |
| Q4(a)(iii), until two cells form, R nuclear membrane / R cell plate; nucleolus reappears | Same QP pp10–11; MS p15 | Confirmed, any 3. Original stem uses “State”; authored “describe” framing must remain labelled an adaptation. Envelope formation, decondensation and animal cytokinesis answer is sufficient. Nucleolus credit is now **PDF-VERIFIED**. |
| Local acceptance of nuclear membrane(s) | `2023/June/9700_s23_qp_21.pdf` p2 and MS p8, Q1(a)(ii), organelle/function table | Confirmed. A local counterexample, not a reversal of the other scheme's R. |
| Kinetochore accepted as attachment wording in a microtubule-function answer | `2021/June/9700_s21_ms_22.pdf` p7, Q1(a)(ii) | Confirmed, 1 mark. Does not establish universal acceptance as the name of A in another diagram. |
| A centromere, I kinetochore; B spindle fibres/microtubules with a function | `2023/June/9700_s23_qp_21.pdf` p14; MS p15, Q4(c)(i) | Confirmed. Two marks across A/B, one per name-plus-function pair, with the scheme's limited partial-credit fallback. |
| Draw chromosome 11 in anaphase; separate units, attachment, U/V pointing towards poles, centromeres | Same QP p14 (figure inspected); MS p15, Q4(c)(ii) | Confirmed, 3 marks from 4 features. Whole 2n = 4 cell is a teaching extension. |
| Paper 1 blocked spindle and key A | `2020/June/9700_s20_qp_12.pdf` p9, Q21; MS p2 | Confirmed: sister-chromatid separation/poleward movement prevented; answer A, stages 1 and 2. |
| Prophase events and key B | `2022/June/9700_s22_qp_12.pdf` p8, Q20; MS p2 | Confirmed: envelope fragmentation, nucleolus disappearance, visibility of stained chromosomes; centriole replication is the excluded event. |
| Spindle-length graph and key D | `2024/June/9700_s24_qp_12.pdf` p12, Q20; MS p2 | Confirmed: when all centromeres have detached, key D. No unsupported graph lesson added. |
| G05 “Specify the structure attached…” sentence | Local `gate-criteria/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md`, checklist | Exact authored wording verified; correctly labelled G05's summary, not Cambridge quotation. |
| 6/15 papers, 14 overlapping marks | Amended weights: 3 P1 marks; S21 microtubules 1; W22 role 3 + post-C events 3; S23 B 1 + drawing 3 | Arithmetic and ownership confirmed: 3 + 1 + 6 + 4 = 14. This is the fixed sample, not all Cambridge papers. |

No unsupported “common in candidates” assertion was found. E5-03's COMMON MISTAKE badge is grounded in the explicit R lines; E5-04 correctly uses EXAM CONTRAST.

## Visual, biological and scope checks

The late-interphase model is explicitly post-S. The 2n = 4 model and colour identity are consistent with SHARED-SPECS; hues never imply parental origin. Telophase retains eight whole-cell chromosomes while each nucleus has four; cytokinesis is separate and may overlap telophase. Plant spindle formation does not depend on centrioles. Nucleoli, envelope changes and cell-surface-membrane behaviour are included. No telomere, cancer, meiosis or molecular-motor expansion is introduced.

Both error beats contain announce, written error, four-second silent read, causal talk-through and correction in place; the marker stays through the repair. Recap/exam/reject surfaces remain beside a model. Photographs stay static while annotations move. M1 and M2 concern the actual animation instructions, which a text validator cannot catch.

## Validation and runtime ruling

Independent run: `python3 work/007/validate_storyboard.py storyboards/topic-05/5.2.1/STORYBOARD.md` — **19 beats, 1,495 words, 171 cues, maximum gap 24 words, 0 failing beats**. E5-04: 147 words / 94 talk-through words. E5-03: 150 / 91. Exact outcome checked separately.

The supplied `check_quotes.py` was also attempted, but exits with **FileNotFoundError** for `cloud-inputs/007/evidence/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md` before completing its audit. The storyboard's recorded “quotes checked 9, not found 0” is therefore not independently reproducible in this checkout. The manual original-source audit above resolves the substantive citations; it does not misrepresent the broken script as passing.

**Accept up to 12:29.5**, conservatively including the explicit two-second final hold in addition to the 12:27.5 word ledger, subject to the error-beat timing ledger above and recounting replacement narration. The word ledger is 27.5 s over the 12:00 allocation (29.5 s with the final hold added): teaching 9:59 (+19 s), errors 2:28.5 (+8.5 s). Both errors must remain complete. No forced cuts are required; if a shorter teaching section is wanted, deleting Beat 4's last sentence and the seven-word gut-lining clause removes 23 words (11.5 s) without removing a counted stage fact. The storyboard's claimed ±5% tolerance is not needed as a clearance rule; this is an explicit reviewer acceptance of the bounded overrun.

**Final verdict: NOT CLEARED**
