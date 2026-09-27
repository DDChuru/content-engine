# 4.1.1-2 — independent storyboard check, round 2

**CLEARED**

All round-one must-fixes and should-fixes are implemented in the actual storyboard. No further required edit was found. Accept **9:16.5 including the final hold**; the increase over the previously accepted estimate comes from the required, corrected recap.

Reviewed workspace commit: `e3e3ebd1`.

Reviewed STORYBOARD.md SHA-256: `dd79d3fc8465095a130c4c1f066765fb8be3ba6569f9ec26954853262cff7357`.

Read the round-two brief, FIXES-round-1.md, my complete round-one report and the complete revised storyboard, including its response table. Independently checked the implementation rather than accepting the response table as evidence. The version at `b0fa3560` hashes to the exact draft reviewed in round one (`526c184f…fdbfe`). Comparing narration shows that **only Beat 12 changed**. References below are to the current STORYBOARD.md.

## Every round-one item

| Round-one item | Status | Evidence in the revised storyboard |
|---|---|---|
| M1: bound orientation to the assembled membrane | **FIXED** | `PhospholipidToken`, `assemble`, motion contract, Assets and reusable-model row all allow transient tail exposure before assembly and require inward tails in the assembled bilayer. The impossible global “tails never in water” condition is removed from the active specification. |
| M1: reconcile assembly duration and completion cues | **FIXED** | Beat 4 action 4 runs assembly for about three seconds; action 8 brackets the **already-formed** rows at “two layers” and explicitly forbids completion/replay there. Twenty-four tokens become twelve per leaflet. Action 12 adds lateral drift to ongoing jitter rather than restarting motion. |
| M1: distinguish staged explanatory drawing from membrane synthesis | **FIXED** | Layer-reveal contract supplies the requested caption during Beats 6, 8, 9 and 10: components progressively build the explanatory drawing, not cellular synthesis/insertion machinery. |
| M2: distinguish glycolipid from the phosphate-head glyph | **FIXED** | Model specification and Beat 9 action 2 use two tails, a neutral attachment node and the external four-bead chain; the amber phosphate-head glyph and phosphate/glycerol labels are explicitly prohibited. The reusable-model row publishes the same geometry, and revised 4.1.3 explicitly inherits it. |
| M3: correct completed-model protein census | **FIXED** | Beat 12 narration names **four spanning proteins** and an extrinsic protein. Actions 4–8 highlight/bracket the four spanning components and outline **all five proteins**. This matches the separate glycoprotein added in Beat 10. |
| M3: propagate counts without corrupting earlier build stages | **FIXED** | Scope ledger and absolutes sweep distinguish the completed model from Beat 6's three spanning examples and Beat 7's four total proteins. Those earlier counts remain unchanged and correct for their stages. |
| M4: resolve QP/MS source gaps and preserve editorial scope | **FIXED** | Citation rows 5–6 identify the independent PDF check; old UNVERIFIED items 2–3 are resolved. Item 1 and the spine use “No directly relevant full 4.1.1 question has been verified in the cited blocks.” The cholesterol-question scope ruling remains editorial, not an exam quotation. |
| M4: do not require both polarity links for one mark | **FIXED** | Beat 13 action 3 explicitly says **one valid link** between a cholesterol region's polarity and position earns the mark. Both relationships remain available for teaching, without a two-point requirement for this one-mark question. |
| Should-fix 1: remove unsupported time-lapse ×4 | **FIXED** | Beat 7, on-screen list and Datasets now use “schematic lateral motion; not measured”; Datasets explicitly says no time compression is applied. |
| Should-fix 2: preserve layout counts and avoid overlaps | **FIXED** | Ordinal component positions and twelve visible phospholipids per leaflet remain consistent. Assets now requires components to displace phospholipid glyphs instead of overlapping them. Rendered geometry remains a build check, not a completed inspection. |
| Science note accompanying should-fix 2: distinguish pore lining from protein exterior | **FIXED** | Assets explicitly preserves the hydrophilic pore lining as visually distinct from the hydrophobic protein exterior against tails. The existing R-group overlays support that distinction. |
| Should-fix 3: do not extend opening/close meta-commentary | **FIXED** | Narration in Beats 1 and 13 is unchanged: 88 and 107 words. No additional spoken source commentary was inserted. |
| Runtime: count final hold, recount recap, remap cues, do not speed narration | **FIXED** | Beat 12 is recounted at 98 words; new cues pass validation. Beat 13 schedules the two-second hold **after** narration, 9:14.5–9:16.5. The ledger includes a separate hold row. Narration is not to be accelerated; optional cuts remain optional. |

No item is PARTLY or NOT FIXED. Applicable earlier plan fixes also remain intact; this does not certify the other eight Topic 4 storyboards.

## New and changed source wording: PDF audit

Used actual local PDFs with `pdftotext -f N -l N -layout <file> -`. Files: `/home/dachu/sme-9700-archive/pastpapers/2024/March/9700_m24_qp_22.pdf` and `9700_m24_ms_22.pdf`.

Although the learner-facing close still paraphrases the source, the revised author citation ledger now contains direct extracts. Those additions were checked as quotations.

| Added quotation or revised claim | PDF page | Finding |
|---|---|---|
| “Using the information in Fig. 1.2, explain the orientation (positioning) of cholesterol molecules in the phospholipid bilayer, as shown in Fig. 1.1.” | QP p.3, Q1(a)(ii) | **VERBATIM MATCH**, joining PDF line wraps. One mark. |
| “any one from” | MS p.5, Q1(a)(ii) | **VERBATIM MATCH** as an excerpt, omitting the following colon. |
| `hydroxyl / polar, group, interacts with, phosphate heads ;` | MS p.5, Q1(a)(ii) | **VERBATIM MATCH.** |
| `non-polar part, in region of / AW, fatty acid tails / AW, as both are, non-polar / hydrophobic ;` | MS p.5, Q1(a)(ii) | **VERBATIM MATCH.** |
| Aqueous-facing polar hydroxyl explanation is also accepted; one valid relationship suffices | MS p.5, Q1(a)(ii) | **SUPPORTED PARAPHRASE.** The accepted alternatives and one-mark tariff substantiate the new note. |

Repeated copies in the resolved-items section have the same wording. No mismatch or unfound new quotation. The syllabus quotations are unchanged from the independently verified round-one draft. Historical statements about the first draft not opening PDFs are accompanied by the subsequent verification record; they are not unresolved source dependencies.

## Regression scan and timing

The corrected recap matches the actual completed model, and its highlighting cues are exact, ordered narration substrings. Assembly now has one completion point; the later “two layers” cue identifies a completed drawing. The revised lipid glyph introduces no additional lipid chemistry or false phosphate identity. Heads/tails, external chains, cholesterol orientation and protein regions remain consistent with the syllabus and earlier review.

Every beat retains a non-text visual from entry; the still recap is intentional. Staged component placement is explicitly explanatory. The red-blood-cell example and its plasma/cytoplasm explanation remain spoken and labelled. There is no handled sample, reagent colour transition, first-contact timer, equilibrium calculation, reading or estimated observation. Token counts and movement durations remain schematic specifications.

Actual validator rerun:

```text
python3 work/006/validate_storyboard.py storyboards/topic-04/4.1.1-2/STORYBOARD.md
TOTAL words 1109  cues 125  runtime at 120 wpm 9:14.5  beats 13  failing beats 0
```

Maximum uncued gap: **21 words**. Per-beat narration counts: **88, 44, 77, 90, 98, 95, 85, 91, 75, 81, 80, 98, 107**.

The seven added recap words account for **3.5 seconds** beyond the accepted round-one narration estimate: 1,109 ÷ 2 = **554.5 seconds**, plus two seconds = **556.5 seconds (9:16.5)**. Accept this modest overrun against 9:00. No cut or speed-up is required. No error beat is allocated to these outcomes, and none has been inserted or shortened.

## Remaining edits

**None required.** All round-one items are closed at storyboard level. Clearance does not claim that an audio track or rendered geometry has been inspected. Only this round-two CHECK.md was written for this code; no storyboard or git state was changed.

CLEARED
