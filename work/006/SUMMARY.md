# Cloud run 006 — Topic 4 storyboards: summary

27 September 2026. Branch `cloud/006-topic4`. Phase 1: the plan and weights were pushed, and the plan check (`cloud-checks/006/plan/CHECK.md`, NOT CLEARED, MF1–MF7 plus should-fixes 1–8) was applied. Phase 2: ten storyboards were written in parallel, one author per lesson, from `work/006/SHARED-SPECS.md` and `work/006/AGENT-BRIEF.md`, then reviewed here. No audio, no code, no renders.

**Two sessions wrote to this branch.** A second session ("cloud run 006b", started 03:41 UTC by a forced trigger) applied the same plan check independently. It pushed `cef5d0c` (plan and weights) and `87a6f03` (shared specs, brief and validator) on top of this run's rework `4d5e6ff`. This run built on those commits rather than overwrite them. The two applications agree in substance: same budgets (94:30), badges (five COMMON MISTAKE, one EXAM CONTRAST), exam closes and model states. **Conductor action needed:** `cef5d0c` also committed `cloud-inputs/` (003 and 006) to the branch, which the brief forbids ("containing ONLY plan/topic-04/, storyboards/topic-04/ and work/006/"). This run has not removed those files, because removing them could break the other session's working tree. The conductor should decide which session continues and whether to drop `cloud-inputs/` from the branch.

## Per lesson

Runtime = words ÷ 120 (the validator's count). The four error beats with a 4 s silent read add 4 s each on top, which the per-lesson figures below include where noted. The validator on the branch is the 006b version: error-beat narration 122–142 words plus the silent read, so 65–75 s complete.

| Lesson | Beats (teaching + error) | Words | Runtime | Budget | Over / under | Error beats (badge; length) | Validator |
|---|---|---:|---:|---:|---:|---|---|
| 4.1.1-2 | 13 + 0 | 1,102 | 9:11.0 | 9:00 | +0:11 (cut list → 8:59) | — | 0 failing |
| 4.1.3 | 12 + 1 | 1,203 | 10:01.5 (+4 s read) | 10:15 | −0:09.5 | E43 EXAM CONTRAST; 142 words, 75 s | 0 failing |
| 4.1.4 | 8 + 1 | 801 | 6:40.5 (+4 s) | 7:00 | −0:15.5 | E44 COMMON MISTAKE; 142 words, 75 s | 0 failing |
| 4.2.1a | 13 + 1 | 1,334 | 11:07.0 (+4 s) | 10:45 | +0:26 (cut list → 10:46) | E45 COMMON MISTAKE; 141 words, 74.5 s | 0 failing |
| 4.2.1b | 11 + 2 | 1,348 | 11:14.0 (+8 s) | 11:15 | +0:07 | E47 and E46 COMMON MISTAKE; 139 words each, 73.5 s | 0 failing |
| 4.2.6 | 11 + 0 | 1,147 | 9:33.5 | 8:15 | +1:18.5 (cut list → 8:57) | — | 0 failing |
| 4.2.2a | 13 + 0 | 1,290 | 10:45.0 | 9:30 | +1:15 (cut list → 10:17) | — | 0 failing |
| 4.2.2b | 10 + 0 | 957 | 7:58.5 | 7:30 | +0:28.5 (cut list → 7:39.5) | — | 0 failing |
| 4.2.3-4 | 13 + 0 | 1,378 | 11:29.0 | 9:45 | +1:44 (cut list → 11:01) | — | 0 failing |
| 4.2.5 | 13 + 1 | 1,385 | 11:32.5 (+4 s) | 11:15 | +0:21.5 (cut list → 11:12.5) | E48 COMMON MISTAKE; 140 words, 74 s | 0 failing |
| **Topic 4** | **117 + 6 = 123** | **11,945** | **99:32.5 (+0:24 reads)** | **94:30** | **+5:26** | 5 COMMON MISTAKE, 1 EXAM CONTRAST | **all 0 failing** |

Beat counts match the plan exactly (117 teaching, 6 error). Every error beat keeps all five moves, and its marker clears only on the completed correct frame; none was thinned. **The overrun is honest and concentrated in the practical lessons:** 4.2.3-4 +1:44, 4.2.6 +1:18.5 and 4.2.2a +1:15. Each lesson's cut list is in its *Word count and runtime* section, and none touches an error beat. Taking every listed cut brings the topic to about 96:40. The authors judge that the remaining overrun is compulsory content: MF5 sampling and osmometer rules, the MF3 equilibrium beat, all six osmosis cases, and the calculation working. This fits the Topic 3 precedent, where 3.1.3 cleared at 11:49 against a 10:15 budget.

Validator output (branch version, run after review):

```
4.1.1-2  TOTAL words 1102  cues 125  runtime at 120 wpm 9:11.0   beats 13  failing beats 0
4.1.3    TOTAL words 1203  cues 138  runtime at 120 wpm 10:01.5  beats 13  failing beats 0
4.1.4    TOTAL words 801   cues 96   runtime at 120 wpm 6:40.5   beats 9   failing beats 0
4.2.1a   TOTAL words 1334  cues 138  runtime at 120 wpm 11:07.0  beats 14  failing beats 0
4.2.1b   TOTAL words 1348  cues 164  runtime at 120 wpm 11:14.0  beats 13  failing beats 0
4.2.6    TOTAL words 1147  cues 122  runtime at 120 wpm 9:33.5   beats 11  failing beats 0
4.2.2a   TOTAL words 1290  cues 155  runtime at 120 wpm 10:45.0  beats 13  failing beats 0
4.2.2b   TOTAL words 957   cues 118  runtime at 120 wpm 7:58.5   beats 10  failing beats 0
4.2.3-4  TOTAL words 1378  cues 160  runtime at 120 wpm 11:29.0  beats 13  failing beats 0
4.2.5    TOTAL words 1385  cues 157  runtime at 120 wpm 11:32.5  beats 14  failing beats 0
```

No MISSING SECTION or CITATION lines appear in any file.

## Error beats

| ID | Lesson / beat | Badge | Evidence quoted (status) | Card |
|---|---|---|---|---|
| E43 | 4.1.3 Beat 7 | EXAM CONTRAST | W22/23 Q6(a) MS p.19: I ‘ions cannot pass through the membrane’ (PDF-CHECKED, plan check) | our framing; "membrane" → "hydrophobic core of the bilayer; through channel or carrier proteins" |
| E44 | 4.1.4 Beat 7 | COMMON MISTAKE | W22/23 Q5(a)(i) MS p.17: `R active site` (PDF-CHECKED) | our framing of the LL-37 question; "active site" → shared complementary receptor with a binding site; "specific does not mean one cell type" |
| E45 | 4.2.1a Beat 10 | COMMON MISTAKE | R23 p.12: “Most incorrect answers stated that glucose was too large.” (PDF-CHECKED) | our framing of S23/21 Q3(a); corrected to the MF2 glucose wording |
| E46 | 4.2.1b Beat 11 | COMMON MISTAKE | W22/23 Q2(a)(i) MS p.9 `R active transport`; S23/21 Q1(b)(i) MS p.8 `endocytosis / pinocytosis ; R phagocytosis` (PDF-CHECKED) | composite of two questions, two faults, the plan check's exact S23/21 X caption |
| E47 | 4.2.1b Beat 8 | COMMON MISTAKE | R23 p.12: “Some thought that the membrane protein was an enzyme with an active site, rather than a carrier protein with a binding site.” (PDF-CHECKED) | constructed, two faults ("stops"; "active sites of the enzyme") |
| E48 | 4.2.5 Beat 9 | COMMON MISTAKE | R24 p.54: “The term ‘amount’ is not accepted as it is not specific.” (PDF-CHECKED) | constructed plan, two faults; caption says it is a paper-wide key message, not an osmosis question or a transcript |

## Citations

Every exam quotation in the ten storyboards is on the verified list in SHARED-SPECS §2 and is tagged **PDF-CHECKED (plan check)**. The full set is:

- `R active transport`
- `endocytosis / pinocytosis ; R phagocytosis`
- `R active site`
- `I ‘ions cannot pass through the membrane’`
- `Reject if hormone S or receptor R described as an antigen or enzyme` (adjacent evidence only)
- `ref. to hazard and risk and precaution ;`
- `–860kPa ;`
- the two R23 p.12 sentences
- the R24 p.54 sentence

No exam quotation in any storyboard remains PDF-UNCHECKED. The remaining "PDF-UNCHECKED" strings in the files are rule text, not quotations.

Everything else from the exam evidence appears only as a labelled description (our paraphrase with its citation), for example:

- W20/51 Table 1.1, shown as *supplied data from W20/51*
- S21/22 Q4(b) cube C (54 cm², 27 cm³)
- M24/52's "maximum 6 marks; any six of nine listed points"

A review script checked every syllabus quotation against `SYLLABUS-9700-DETAIL.md` and found all present: outcome wordings, the p.21 introduction, 2.2.11 and 14.1.10 excerpts, apparatus p.57, materials p.58, maths p.63, and planning bullets.

### UNVERIFIED items, by lesson (full text in each storyboard's *Citations* section)

- **4.1.1-2:** a marked 4.1.1 question (none exists); exact MS and QP wording of M24/22 Q1(a)(ii).
- **4.1.3:**
  - QP and MS wording of W22/23 Q6(a) beyond the I line
  - MS wording of S23/21 Q3(a), M24/22 Q1(b)(i) and Q1(a)(iii), including which cholesterol roles are accepted
  - a content source for ABO: **ABO omitted** under the plan-check rule
  - QP wording of S23/21 Q3(a) and M24/22 Q1(b)(i)
  - S21/22 Q3(b) MS wording
  - no marked question on glycolipid/glycoprotein stability or on antigens
- **4.1.4:**
  - QP and MS wording of M24/22 Q1(c)(iii)
  - QP wording of W22/23 Q5(a)(i) and its points beyond the R line
  - LL-37's receptor identity (never named or drawn)
  - R24 p.21 wording (paraphrase only)
  - S21/22 Q3(c) QP and diagram
- **4.2.1a:**
  - QP wording of S23/21 Q3(a)
  - MS wording of S23/21 Q3(a), M24/22 Q1(b)(i) and S21/22 Q3(b)
  - QP wording of M24/22 Q1(b)(i) and S21/22 Q3(b)
  - a textbook source for the alveolar-oxygen example
- **4.2.1b:**
  - MS and QP wording of M24/22 Q1(b)(ii)
  - MS and QP wording and figure of S23/21 Q3(b)(i)
  - R23 p.12 wording on the stopping and plateau errors (described, not quoted)
  - W22/23 Q2(a)(i) QP and MS beyond the R line
  - S23/21 Q1(b)(i) QP
  - S21/22 Q5(b)(ii) MS
- **4.2.6:**
  - a direct 4.2.6 question (none; the close is labelled syllabus-based)
  - W20/21 Q4(b)(ii) MS
  - W20/51 Q1(c)(ii) QP and MS
  - a sourced red-blood-cell micrograph (asset)
  - a lettuce content source beyond the plan check's ruling
- **4.2.2a:**
  - a Visking question (none; that part of the close is labelled syllabus-based)
  - S21/22 Q4(c) wording
  - the sizes of cubes A and B
  - a measured osmometer trace (the data are illustrative)
  - a Benedict's colour–concentration correspondence (none assigned)
- **4.2.2b:**
  - M24/52 Q1(c)(i) and Q1(b)(ii) MS wording
  - M24/52 Q1 stems
  - a beetroot or onion question (none)
  - a sourced plasmolysed red-onion micrograph (asset)
- **4.2.3-4:**
  - S21/22 Q4(b–c) wording, figure and the A/B sizes
  - verbatim MS strings for Q4(b–c)
  - bench-tested cube times (Dataset 5 is illustrative)
  - **the hazard classification of 0.1 mol dm⁻³ HCl and 0.01 mol dm⁻³ NaOH.** This is the one place a storyboard falls short of the plan's safety wording; the centre's hazard data must confirm it before build.
- **4.2.5:**
  - W20/51 Q1(c)(ii) and Q1(d)(i) wording
  - W20/51 Q1(c)(ii) MS points
  - density-drop details
  - M24/52 MS wording
  - which Paper 52 question(s) the "amount" key message came from
  - a source for the hook's firm/limp strips (labelled our illustration)
  - a potato density (not narrated)

## Plan interpretations (main ones; each storyboard lists all of its own in *Plan interpretations*)

1. **Reject cards.** VIDEO-STRUCTURE says "close every video with one reject card". The 006b revision of SHARED-SPECS §2a and the brief allows a reject card only where a verified R or I line exists. Two authors followed the revision:
   - 4.2.5 closes on a ticked model sentence captioned as ours.
   - 4.2.3-4 uses a labelled teaching point with no ✗ and no MS tab.

   Seven lessons keep a reject card captioned *our wording contrast; not a mark-scheme reject line*, as the cleared Topic 3 storyboards did: 4.1.1-2, 4.1.3, 4.1.4, 4.2.1a, 4.2.1b, 4.2.6 and 4.2.2a. None of these cards cites examiner evidence. **Checker to rule on which convention applies.**
2. **4.2.5 intercept.** The plan fixes both the tested concentrations and the 0.40 mol dm⁻³ intercept, so the intercept falls on a tested concentration. The 0.40 mean is set at +0.1 %, not zero. The answer is read from a least-squares quadratic trend through the means, which crosses zero at 0.398, and is never plotted as a point. The lookup gives −1120 kPa from W20/51 Table 1.1.
3. **4.2.2a:**
   - "Separate matched vessels" is implemented as three matched tube-and-bag set-ups, each sampled once.
   - A distilled-water control osmometer was added to make bag stretching visible.
   - The meniscus data are labelled illustrative and listed as UNVERIFIED, reconciling MF5's "rather than inventing a meniscus trace" with the need for data on screen.
4. **4.1.4:** `response-uptake` follows the plan; the earlier SHARED-SPECS draft had `response-pulse`. Liver cells are the second target cell sharing the receptor (syllabus 14.1.10); the non-target cell is left unnamed.
5. **4.1.3:** the carrier preview runs its shape change once, since the plan's "binds and changes shape (preview only)" wins over the spec's "static previews". A `RoleGrid` panel maps five components against six roles. ABO is omitted.
6. **4.2.1b:** the generic pump moves its ion from outside into the cytoplasm (root-hair direction). E47 separates enzyme from carrier using a Topic 3 enzyme miniature. The channel-versus-carrier condition qualifies the shape-change similarity rather than counting as a third difference.
7. **4.2.1a:** equal water potentials are reached in the model by adding solute to the left compartment at fixed volumes. The counters show illustrative crossings per window.
8. **4.2.6:** `plant-equal` is the starting cell for all three plant cases, pressing gently on its wall, so "equal" never looks flaccid. Pure water is the "higher" example for both cell types.
9. **4.2.2b:**
   - 30 min exposure, with liquids cooled before comparison.
   - Colour standards are dilutions of one extract, summarised as median and range.
   - Illustrative onion counts: 27 of 28 whole cells plasmolysed.
10. **4.2.3-4:**
    - Three runs of three baths, so no cube ever shares acid.
    - A 30 min observation period in which all cubes finish (means 1016, 260 and 70 s, illustrative).
    - The limit and fixed-time alternatives are shown on a card.
11. **4.1.1-2:** the component positions in SHARED-SPECS are read as component slots, with the section drawn wider so that 12 phospholipids per leaflet stay visible. The builder should confirm against the house layout.

## Conductor review changes (this run)

- **4.2.5 Beat 3:** the handle's creditworthy sentence said the zero-change solution's water potential "equals the tissue's initial water potential". It now reads "estimates the tissue's initial water potential" in the narration, the cue and the handle line, and the on-screen sentence reads "gives an estimate of the tissue's initial water potential, under these conditions". This matches MF5 ("provides an estimate … under these conditions") and the lesson's own Beat 12. Word count is unchanged (1,385) and the validator shows 0 failing beats.
- **Checks run across all ten files, all clean:**
  - forbidden-phrase sweep ("concentration of water", solute/pressure potential and ψs/ψp occur only in rule and sweep text)
  - shared numbers identical across lessons: potato cylinder 11.0 cm², 2.36 cm³, 4.67 cm⁻¹; cubes 6, 3, 2 and 3, 6, 12 cm⁻¹; Table 1.1 → −1120 kPa at 0.40
  - quotation audit, as under *Citations* above
- **Narration read in full for all ten lessons** for register, science, typicality and handling. No other change was made. Pages the checker should look at closely:
  - 4.2.6 Beat 5: "in pure water the membrane stretches until it bursts" is bounded to pure water; the plan says "may burst"
  - 4.2.2a Beat 6: the illustrative Benedict's colours reach orange by 20 min
  - 4.2.3-4: the illustrative decolourisation times for the 2 cm cube are about 17 min
