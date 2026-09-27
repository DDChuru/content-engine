# 4.1.3 — independent storyboard check, round 2

**CLEARED**

All four round-one must-fixes and all five should-fixes are implemented. The permeability wording is bounded, the source contexts are distinguished, and E43 retains all five moves with its full **75-second** allocation. No further required edit was found.

Reviewed workspace commit: `e3e3ebd1`.

Reviewed STORYBOARD.md SHA-256: `f2b49401982ccd1819d4663029f22b888d01d48d9914fcff6a3db65c82ece681`.

Read the round-two brief, FIXES-round-1.md, my complete round-one report and the complete revised storyboard, including its response table. Checked the substantive text rather than relying on the author's “applied” labels. The version at `b0fa3560` hashes to the exact round-one draft (`c40221cf…581e`). Only Beats **2, 4 and 5** have changed narration; Beat 7's E43 narration is unchanged. References below are to the current STORYBOARD.md.

## Every round-one item

| Round-one item | Status | Evidence in the revised storyboard |
|---|---|---|
| M1: qualify the objective and universal polar-molecule wording | **FIXED** | Beat 2 narration, objective and cue name **sodium ions and glucose**. Beat 5's opening and cues now ask how **sodium ions** cross, rather than asserting that anything polar requires proteins. |
| M1: remove “nothing to interact with” | **FIXED** | Beat 4 says entering the hydrophobic core is **unfavourable** for sodium ions and glucose, so they do not cross readily. Water-halo and rebound actions use the replacement cues. No zero-interaction claim remains in the active narration. |
| M1: receptor site rather than carbohydrate chain receives the signal | **FIXED** | Spine now assigns interaction with water/recognition to chains and signalling-molecule reception to specific receptor binding sites. Beat 10's binding cup remains on the protein. Typicality rules and absolutes sweep reflect the changes. |
| M2: count silent reading separately and keep the full error beat | **FIXED** | Header, beat-window preamble, ledger and recount all state **142 words / 71 seconds narration + four-second read = 75 seconds**. The new window is **4:32–5:47**. No E43 wording or move was cut. |
| M2: recount edited narration, regenerate boundaries and account for closing hold | **FIXED** | Current ledger totals **1,201 words**, **604.5 seconds including silence**, or **606.5 seconds with the extra two-second hold**. Later provisional windows have moved accordingly. The retained 1,203-word figures are explicitly labelled the pre-edit draft, not the current total. |
| M3: distinguish W22/23's actual ions from the generic sodium drawing | **FIXED** | Beat 7 action 2 identifies hydrogencarbonate/chloride in a red blood cell, QP p.15 / MS p.19; explicitly labels the sodium-channel drawing as the author's generic illustration. The wrong answer remains constructed, not a candidate transcript or QP quotation. |
| M3: resolve marking claims and cholesterol alternatives | **FIXED** | Beat 13 actions 3 and 5 contain the requested PDF-checked paraphrases and the **any-one-role** cholesterol note. UNVERIFIED items 1, 2, 4 and 5 are resolved with source pages; descriptions remain paraphrases. |
| M3: distinguish the two question forms and retain scope boundaries | **FIXED** | Citation source ledger distinguishes the glucose/protein question from the sodium/simple-diffusion question; their grouping is explicitly editorial. ABO remains omitted. Item 6 limits the unverified stability/antigen exam search to selected ledger entries. Historical PDF-access wording is followed by the independent-check record. |
| M4: inherit the corrected glycolipid | **FIXED** | `FluidMosaicMembrane` reuse contract specifies the neutral attachment node, two tails and four-bead external chain, explicitly excluding the amber phosphate-head glyph. This agrees with revised 4.1.1-2. |
| M4: remove obsolete response-pulse alternative | **FIXED** | Published models, `ReceptorLigand` heading, reusable-model table and Plan interpretation 2 consistently use **`response-uptake`** for the later named response. Any occurrence of the obsolete alternative in CHECK RESPONSE describes the past edit, not a current build instruction. |
| SF1: objective pictograms visible from entry | **FIXED** | Beat 2 action 1 explicitly has authored pictograms **already visible from the first frame**, with objective lines entering beside them. |
| SF2: remove the unnarrated S21 rows from the exam-close screen | **FIXED** | Beat 13 shows only its two narrated forms. S21/22 Q3(b) and Q3(c) remain in the evidence ledger; scope/citation rows and Plan interpretation 7 agree. |
| SF3: prevent carrier rotation or a continuous open pore | **FIXED** | Shape-change contract explicitly alternates access to the binding site, keeps the protein embedded in its orientation, prohibits a continuous pore and prohibits whole-protein rotation/leaflet flipping. |
| SF4: distinguish lateral packing from membrane thickness | **FIXED** | Low-temperature inset changes lateral head-to-head spacing; specification explicitly says not to depict thinning along the membrane normal. Qualitative/no-measured-data caption remains. |
| SF5: distinguish animation durations from student-facing numbers | **FIXED** | Datasets calls the 0.6/0.8/0.5/1.2-second durations build instructions, not learner-visible readings. Schematic/not-to-scale caption remains. |
| Runtime ruling: accept corrected estimate without thinning E43 | **FIXED** | Both the four-second read and possible additional closing hold are counted; current total fits 10:15. Only teaching wording was shortened, by two words overall. |

No item is PARTLY or NOT FIXED. The relevant earlier plan corrections remain present. Full signalling-response teaching belongs to 4.1.4 and is not separately certified by this check.

## New/changed citations and source claims

No new verbatim exam quotation was introduced. The new source-context captions and resolved paraphrases were checked against actual local PDFs using `pdftotext -f N -l N -layout <file> -`; the table also records fresh spot-checks of the retained quotation evidence. Archive root: `/home/dachu/sme-9700-archive/pastpapers/`.

| Revised or retained evidence | Actual PDF | Result |
|---|---|---|
| New E43 caption: red-blood-cell HCO₃⁻/Cl⁻ question, not sodium | `2022/November/9700_w22_qp_23.pdf`, Q6(a), p.15 | **SUPPORTED PARAPHRASE.** QP explicitly names both ions and red blood cell membranes. The generic sodium drawing is now labelled correctly. |
| Retained `I ‘ions cannot pass through the membrane’`; resolved one-mark alternatives | `2022/November/9700_w22_ms_23.pdf`, Q6(a), p.19 | **VERBATIM MATCH** for the quotation. **SUPPORTED PARAPHRASE** for bilayer/core exclusion, hydrophilic pathway, facilitated diffusion and accepted anion-exchanger alternative. I remains ignore, with no claim of prevalence. |
| New cholesterol accepted-role note: any one of fluidity, mechanical stability, limiting entry of hydrophilic/polar substances or ions | `2024/March/9700_m24_ms_22.pdf`, Q1(a)(iii), p.5 | **SUPPORTED PARAPHRASE.** One mark. High/low-temperature fluidity qualifications are also explicitly accepted by this scheme. |
| Revised source ledger: sodium question asks about inability to cross by simple diffusion; marking links charge to hydrophobic/non-polar core | `2024/March/9700_m24_qp_22.pdf`, p.3; `9700_m24_ms_22.pdf`, p.5 | **SUPPORTED PARAPHRASE.** Does not turn the editor's grouping into identical QP wording. |
| Revised S23 note: polarity and bilayer/core; size-only, active transport and facilitated diffusion ignored at that point | `2023/June/9700_s23_ms_21.pdf`, Q3(a), p.11 | **SUPPORTED PARAPHRASE.** The one-mark context and local ignore instruction remain correctly bounded. QP p.8 context was verified in round one and has not changed. |
| Resolved S21 steroid alternatives include small size; cytoplasmic-receptor rejection retained only as adjacent evidence | `2021/June/9700_s21_ms_22.pdf`, Q3(b)–(c), p.12 | **SUPPORTED PARAPHRASE** for the two-mark alternatives; **VERBATIM MATCH** for `Reject if hormone S or receptor R described as an antigen or enzyme`. Removing these rows from the screen has not changed their evidence status. |

No mismatch or unfound quotation in the changes. The remaining syllabus and handoff citations are unchanged from round one. The constructed wrong/right cards continue to identify their wording as the author's.

## Regression scan

The new permeability sentences avoid implying that all polar molecules require transport proteins. Glucose remains an example needing a protein route, with gradient and energy questions deferred rather than automatically labelled facilitated diffusion. Signalling remains at receptor-role depth; no detailed pathway is added. The response-state metadata now agrees with the shared named-response requirement.

The carrier's new geometry guard prevents a misleading rotating protein or channel-like pore. The cholesterol inset is explicitly qualitative, has no invented temperatures or measurements, and now distinguishes lateral spacing from thickness. Shared component identities and external carbohydrate-chain orientation agree with 4.1.1-2. No counted diffusion/equilibrium sequence, practical handling, reagent colour change, first-contact timer, measured reading or estimate presented as an observation is introduced by these changes.

The objective frame has visible pictograms from entry. Motion remains tied to exact narration cues; the recap is an intentional still familiar model. Removing the unnarrated source rows reduces the exam-close reading burden. The spoken oxygen/red-blood-cell, sodium and glucose examples remain; no sample assay is performed. The REAL-WORLD SAMPLES rule introduces no unresolved material/measurement dependency here.

E43 retains announcement, a written constructed wrong answer, four-second silent read, annotated explanation of the wording/error/evidence, and in-place correction. The badge remains EXAM CONTRAST until the corrected frame; no wrong sentence is spoken as fact and no prevalence claim has appeared.

## Validator and independent runtime ruling

Actual rerun:

```text
python3 work/006/validate_storyboard.py storyboards/topic-04/4.1.3/STORYBOARD.md
TOTAL words 1201  cues 138  runtime at 120 wpm 10:00.5  beats 13  failing beats 0
```

Maximum uncued gap: **24 words**. Per-beat counts: **93, 53, 94, 107, 96, 101, 142, 97, 81, 95, 68, 71, 103**.

Independent arithmetic:

- Teaching: 1,059 words ÷ 2 = **529.5 seconds**.
- E43: 142 words ÷ 2 + 4-second read = **75 seconds**.
- Total: **604.5 seconds (10:04.5)**; with the separately allowed two-second closing hold, **606.5 seconds (10:06.5)**.

**Accept 10:06.5 including that hold**, leaving 8.5 seconds within 10:15. No cut is required. The validator's printed 10:00.5 is correctly identified as narration-only. The full five-move error budget is preserved.

## Remaining edits

**None required.** All round-one items are closed at storyboard level. Audio timing and rendered layout still require the normal production verification; they have not been claimed as tested here. Only this round-two CHECK.md was written for this code; no storyboard or git state was changed.

CLEARED
