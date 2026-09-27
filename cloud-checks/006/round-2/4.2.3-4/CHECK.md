CLEARED WITH MINOR EDITS

Independent round-two check of **4.2.3-4 — Surface area to volume: calculating it and testing it with agar**, 27 September 2026. All four round-one must-fixes are implemented. The graph, recap, transport route, temperature control, safety attribution and exam close now agree with the intended teaching. One small narration edit remains: say that thymolphthalein becomes colourless below its transition range, matching the corrected screen label, rather than implying complete neutralisation of the alkali.

Reviewed commit: `e3e3ebd1`. STORYBOARD.md SHA-256: `ac37f06bbd8db49aec401891d413b91aef954cfa51010193b2a1f0bc10505f9c`.

Read my complete round-one report, the complete revised storyboard and its CHECK RESPONSE, and `work/006/FIXES-round-1.md`. The original file at `3de96966` matches the round-one report's hash. Applied the previously read syllabus and full VIDEO-STRUCTURE, including REAL-WORLD SAMPLES. Re-ran the validator and freshly extracted the actual S21/22 QP/MS pages with `pdftotext -layout`; checked the newly incorporated reference-source descriptions as detailed below. Only this round-two CHECK.md is written for this code.

## Every round-one item

| Round-one item | Status | Evidence in the revised storyboard |
|---|---|---|
| **M1 — graph finishing order** | **FIXED** | Beat 13 action 4 explicitly highlights (12,70), (6,260), (3,1016), right to left. The paper's A/B/C icons are separate and correctly sized 1/2/3 cm; they are not assigned this practical's 0.5/1/2 cm sizes. |
| M1 — completed cubes versus blue recap band | **FIXED** | Beat 12 retains colourless endpoint cubes and their clocks. Its blue band belongs to a separate familiar cutaway labelled **earlier during exposure: explanatory snapshot**. The text expressly prohibits restoring blue to a completed cube. |
| M1 — glucose route | **FIXED** | Beat 6 glucose tokens enter through a labelled carrier-protein symbol; oxygen crosses separately. No new ATP claim or carrier mechanism was introduced. |
| **M2 — demonstrated temperature control** | **FIXED** | A thermometer and per-run temperature-record field are in the rig, Beat 9, Dataset 5 and assets. The same recorded room temperature is spoken. The illustrative entry stays blank, so no temperature measurement is fabricated. Fresh acid is allowed to reach the same temperature before later runs. |
| **M3 — working-concentration hazard evidence** | **FIXED** | Acid/alkali tags and Beat 9 explicitly attribute the below-irritant-label wording to the specified Practical Biology protocol while retaining eye protection and splash rinsing. This is not represented as a universal supplier classification. |
| M3 — indicator formulation and source separation | **FIXED** | The model identifies Carl Roth 8152, 0.1% in denatured ethanol, and gives the stock's flammability/eye-irritation classification. The finished agar is distinguished from the stock. Syllabus materials-list codes remain separately identified. Actual bench stock and addition amount remain disclosed dependencies if real footage is used. |
| **M4 — closing contrast** | **FIXED** | Beat 13 has the required written ✗/✓ card, correct spoken line and authored-provenance caption, without an invented examiner reject or error-beat badge. The contradictory no-card instructions are removed. |
| M4 — real-world exam callback | **FIXED** | The final organism explanation is spoken as **Beyond the mark scheme**, displayed on its own labelled panel, and follows the paper's credited answers, which stay visible. |
| **S1 — faces contact acid at different moments** | **FIXED** | Beat 10 and `decolourising` now distinguish the lower face's first contact from later side/top contact during immersion. “Every face at once” is removed. |
| **S2 — indicator transition versus neutralisation** | **PARTLY** | The requested label and real-world table were corrected exactly, and the transition-range source was added. Beat 7's narration still ends the indicator sentence with **to neutralise the alkali**. The fixer correctly discloses this in FIXES-round-1; my earlier exact instruction named only the label. Complete the alignment with the minor replacement below. |
| **S3 — acid inventory versus measured concentration** | **FIXED** | Dataset 4 states 0.8% stoichiometric consumption and explicitly denies that this measures the external concentration. It allows redistribution into the water-filled gel and only claims equal **starting** concentration/volume. |
| **S4 — whole-cube area per volume** | **FIXED** | The model and Beats 4/6 highlight the whole outer surface with the whole volume. No internal 1 cm³ block is given a fictional share of exposed faces. |
| **S5 — objectives entry** | **FIXED** | Beat 2 starts with three visible authored pictograms beside empty text slots. |
| **S6 — cuboid coverage** | **FIXED** | The redundant 3,3,3 substitution was cut under the runtime ruling. A generic cuboid, the correct formulae and all three opposite-face pairs remain. The optional rectangular numerical example was not a requirement and need not be added. |
| **Citation audit — apparatus pages** | **FIXED** | The scope ledger distinguishes beakers on p56 from the relevant apparatus on p57 and cites pp56–57 collectively. |
| **Citation audit — available exam sources** | **FIXED** | Beat 13 and Dataset 6 carry the round-one checked source caption and paper sizes. UNVERIFIED 1/2 are resolved. Adapted descriptions stay labelled as such, rather than being promoted to Cambridge quotations. |
| **Citation audit — genuine residual dependencies** | **FIXED** | Exact bench-tested endpoint times remain unavailable and the data remain explicitly illustrative. Working-solution evidence is resolved separately from the centre's actual stock/recipe dependency. |
| **Runtime — four required cuts** | **FIXED** | Beat 11 −12, Beat 5 −13, Beat 12 −9 and Beat 1 −6 words: 40 removed in total. Their cues are remapped; graph values and cylinder labels remain visible. The protected Beat 3 units explanation remains. |
| **Runtime — remaining overrun** | **FIXED** | Replacement wording adds 15 words after those cuts: 1378 − 40 + 15 = **1353**. The accepted overrun is honestly recorded; no acceleration or error-beat shortening is proposed. |

No item is NOT FIXED. S2 is the only remaining content edit.

## Exact minor replacement

**Beat 7 narration:** replace the complete sentence beginning “Thymolphthalein responds to pH” with:

> Thymolphthalein responds to pH: it is blue in this alkaline agar, and colourless once enough acid has diffused in to lower the pH below its transition range.

The manufacturer's [indicator specification](https://www.thermofisher.com/order/catalog/product/B23896.30) gives colourless at pH 9.3 and blue at pH 10.5. Colourlessness therefore does not certify pH 7 or complete consumption of the alkali. The numerical transition values need not be taught; the existing corrected label already gives the necessary explanation.

Both existing cues, *Thymolphthalein responds to pH* and *colourless once enough acid has diffused in*, remain exact and in order. The replacement adds **four words**: Beat 7 becomes **118 words**, the lesson **1357 words = 11:18.5**. Update the ledger, CHECK RESPONSE S2 status and final timing from those figures. I tested this replacement **in memory**, using the actual validator's parser/check functions: **154 cues, 0 failing beats**, Beat 7 maximum gap still 15 words. The storyboard itself was not modified.

Keep the later wording **as alkali is neutralised** in Beats 10/12: that describes an ongoing process and already identifies the pH transition. It does not make the complete-neutralisation claim being removed above. No new chemical mechanism or extra beat is required.

## Changed-text and numerical audit

The repaired graph order matches the increasing-SA:V axis. The recap now has valid endpoint and earlier-exposure states in distinct panels. First contact still starts each cube's own clock atomically; later cues highlight that running clock. Partial immersion and later inward colour progress no longer require simultaneous initial exposure of all faces. Blue → paler blue → colourless remains the demonstrated sequence; the paper's universal-indicator blue/red colours remain separate static reference swatches.

The added thermometer is procedural, with a deliberately blank record field, rather than invented measured evidence. The 125-fold excess remains stoichiometric bookkeeping: 0.0100 mol initial acid divided by 0.000080 mol hydroxide in the largest cube. Its 0.8% consumption does not become a measured external-bath concentration. All trials still use fresh cubes and acid, with one bath per cube.

The geometry and retained numbers remain consistent: cube ratios 6/3/2 cm⁻¹; practical ratios 3/6/12 cm⁻¹; cylinder area 3.5π, volume 0.75π and ratio 4.67 cm⁻¹. The three illustrative means remain 1016, 260 and 70 s, and the plotted points and endpoint order agree. Calculated ratios, means and reciprocal times remain identified as calculations, not instrument readings; the reciprocal-time label does not claim a diffusion coefficient, flux or molecular speed. Illustrative times are not certified bench observations.

The per-volume picture, cuboid face pairs and cylinder net retain the required mathematical teaching after the cuts. Apparatus handling is explicitly specified, objective pictograms are visible from entry, and the familiar models remain beside the exam cards. No new text-only frame, impossible colour sequence, particle-count claim or equilibrium assertion was introduced. No evidenced error beat is allocated; the short authored closing card does not require a fabricated 65–75-second error demonstration.

## Fresh citation checks

No new verbatim Cambridge quotation was added. The revised exam descriptions and newly incorporated non-exam source claims were checked as follows.

| Source | Round-two finding |
|---|---|
| [S21/22 QP p9](/home/dachu/sme-9700-archive/pastpapers/2021/June/9700_s21_qp_22.pdf#page=9) | Table 4.1 gives A 1 cm, B 2 cm, C 3 cm. The agar contains sodium hydroxide and Universal Indicator; it begins blue and the indicator is red in acid. The paper places its cubes together in one beaker. All revised descriptions match; the authored practical's different sizes/separate baths are disclosed. |
| [S21/22 MS p14](/home/dachu/sme-9700-archive/pastpapers/2021/June/9700_s21_ms_22.pdf#page=14) | Q4(b): one mark for cm³, one for SA 54 and V 27. Q4(c): A → B → C, with equivalent size/ratio orders accepted, one mark. No reject line is supplied for these parts. |
| [Practical Biology protocol](https://practicalbiology.org/exchange-of-materials/diffusion/effect-of-size-on-uptake-by-diffusion.html) | The primary publisher's indexed page confirms the low-concentration irritant-label statement and 0.1 M HCl. A fresh direct fetch returned HTTP 403, so it is not described here as a successful direct-page retrieval. The storyboard retains the protocol-specific attribution from the round-one check and does not generalise it to every SDS. |
| [Carl Roth 8152 SDS, Ireland English edition](https://www.carlroth.com/medias/SDB-8152-IE-EN.pdf?context=bWFzdGVyfHNlY3VyaXR5RGF0YXNoZWV0c3wyODcxNzB8YXBwbGljYXRpb24vcGRmfGFHWTNMMmczTWk4NU1UYzRPVEEzTlRBNE56WTJMMU5FUWw4NE1UVXlYMGxGWDBWT0xuQmtaZ3xiNWJkMjM0MjY1OThkNzdmYzkxYjFhMzU4MTg2OGM5MGE2N2M3MDkyMWJkZjRlMjhkZDU3MWFlM2I3NDhhMGFj), section 2, pp1–2 | The original GB link returned HTTP 403 on this attempt. The manufacturer's accessible IE PDF identifies the same 8152 formulation, 0.1% in denatured ethanol, and confirms Flam. Liq. 2/H225 and Eye Irrit. 2/H319. This independently supports the selected reference-stock tag; it does not identify a centre's actual bottle. |
| [Thermo Fisher B23896](https://www.thermofisher.com/order/catalog/product/B23896.30) | Directly retrieved specification confirms the pH-transition values supporting S2. This is indicator-property evidence, not a Cambridge marking point or a reading made in the agar experiment. |

## Runtime and final ruling

Fresh `python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.3-4/STORYBOARD.md` passes: **1353 words, 154 cues, 13 beats, 0 failing beats**, no missing-section/citation warnings. Beat counts: **87, 56, 101, 113, 122, 107, 114, 91, 108, 135, 99, 96, 124**. Maximum uncued stretch: **23 words**.

**Accept the present 11:16.5 and the proposed 11:18.5 after S2**, against 9:45. The reason for the round-one overrun allowance still holds: nets/calculation and a complete practical have distinct teaching jobs, and the requested repetition cuts were taken. The final two-second hold should be scheduled within the stated effective allowance; if the editor adds it separately, declare the resulting total explicitly. Provisional pre-edit beat headings are not a measured timing certificate; the current ledger and eventual audio control cue placement.

The limited S2 wording edit is required before narration. No redesign, additional experiment, forced split or further content cut is required. Actual bench stock/indicator amount and observed times remain dependencies only if real footage is used; rendered handling and colour frames remain to be verified in production.

Final verdict: CLEARED WITH MINOR EDITS
