# Cloud run 006 — fixes applied after check round 1

27 September 2026. Source: `origin/cloud/006-checks:cloud-checks/006/round-1/` (README and ten `<code>/CHECK.md`).

Verdicts: 4.1.1-2 and 4.1.3 were CLEARED WITH MINOR EDITS; the other eight lessons were NOT CLEARED.

Method: one fixer per lesson worked under `work/006/FIX-BRIEF.md`. Each applied every must-fix exactly, using the check's replacement wording verbatim, plus the should-fixes and runtime rulings. Each re-ran the validator and appended `## CHECK RESPONSE (round 1)` to the storyboard, with one row per check item: status, then the new words quoted. That section in each storyboard is the item-level record. This file is the index. Nothing in any check was left unapplied except where noted below.

## Results

| Lesson | Round-1 verdict | Items applied | Words (before → after) | Runtime after | Budget | Validator |
|---|---|---|---:|---:|---:|---|
| 4.1.1-2 | CLEARED WITH MINOR EDITS | M1–M4, all should-fixes, runtime ruling (2 s final hold scheduled separately) | 1,102 → 1,109 | 9:14.5 narration (+2 s hold) | 9:00 | 0 failing |
| 4.1.3 | CLEARED WITH MINOR EDITS | M1–M4, SF1–SF5 | 1,203 → 1,201 | 10:00.5 narration; 10:04.5 with E43's silent read | 10:15 | 0 failing |
| 4.1.4 | NOT CLEARED | M1 (separate glucose carrier; no plain gap), M2 (Beat 9 close replaced; local reject ✗ receptor active site / ✓ binding site), SF1–SF4 | 801 → 805 | 6:42.5; 6:46.5 with the read | 7:00 | 0 failing |
| 4.2.1a | NOT CLEARED | M1 (particle-count continuity contract and exact start → end rows; 16 s carrier window), M2 (protein route ≠ facilitated diffusion), M3 (steroid sentence cut; row 3 verbatim), M4 (freely dissolved oxygen), S1–S6 | 1,334 → 1,338 | 11:09.0; 11:13 with the read; 11:15 with the final hold | 10:45 | 0 failing |
| 4.2.1b | NOT CLEARED | M1 (ATP switch and shape change on one frame; replay reset), M2 (Beat 2 equilibrium wording), M3 (Beat 13 row 3; the root hair on a beyond-the-mark-scheme panel), M4 (pictograms), S1–S5 | 1,348 → 1,360 | 11:20.0; 11:28 with the two reads | 11:15 | 0 failing |
| 4.2.6 | NOT CLEARED | M1 (one shared turgid endpoint: `plant-taking-up-water` → `plant-turgid`), M2 (no osmosis across a ruptured membrane), M3 (pictograms), M4 (sample contents, saline, lettuce), M5 (bounded exam claim), SF1–SF5, runtime ruling (author cuts 1, 3, 4, 6) | 1,147 → 1,136 | 9:28.0 | 8:15 (overrun accepted by the check) | 0 failing |
| 4.2.2a | NOT CLEARED | M1 (invented osmometer trace withdrawn; qualitative schematic only; "Osmometer evidence pending"), M2 (sampling contract), M3 (agar well and first-drop timing; grid backing), M4 (reject card and S21/21 Q3(a) evidence), M5 (mass balance), M6 (objectives opening), S1, S2, S3, S5, S7; runtime cuts 1 and 2 | 1,290 → 1,329 | 11:04.5 | 9:30 | 0 failing |
| 4.2.2b | NOT CLEARED | M1 (tube removal order), M2 (cell-surface-membrane inset only, whole-cell thumbnail), M3 (exam close; 10–50 °C range), SF1–SF5, runtime ruling | 957 → 955 | 7:57.5 | 7:30 (overrun accepted) | 0 failing |
| 4.2.3-4 | NOT CLEARED | M1 (graph order, recap snapshot, glucose carrier), M2 (thermometer and temperature record), M3 (hazard wording from the cited protocol and reference formulation), M4 (✗/✓ card and a beyond-the-mark-scheme callback), S1–S6, citation audit, four required cuts | 1,378 → 1,353 | 11:16.5 | 9:45 (overrun accepted) | 0 failing |
| 4.2.5 | NOT CLEARED | M1 (borer stops at the tile; covered humid container; solutions made up before cutting), M2 ("resolution 0.01 g"), M3 (calculated mean; ✗/✓ contrast), SF1–SF5, author cut 1 | 1,385 → 1,387 | 11:33.5; 11:37.5 with the read | 11:15 (overrun accepted) | 0 failing |
| **Topic 4** | | | **11,945 → 11,973** | **99:46.5 narration (+24 s silent reads)** | **94:30** | **all 0 failing** |

Error beats: all six are unchanged in substance and still within 122–142 narration words. E48 now sits at 142 words, 75 s with its silent read, after SF5 changed "nobody could repeat it" to "the quantity to standardise is unclear". Badges are unchanged: five COMMON MISTAKE, one EXAM CONTRAST.

Validator output after all fixes:

```
4.1.1-2  TOTAL words 1109  cues 125  runtime at 120 wpm 9:14.5   beats 13  failing beats 0
4.1.3    TOTAL words 1201  cues 138  runtime at 120 wpm 10:00.5  beats 13  failing beats 0
4.1.4    TOTAL words 805   cues 98   runtime at 120 wpm 6:42.5   beats 9   failing beats 0
4.2.1a   TOTAL words 1338  cues 140  runtime at 120 wpm 11:09.0  beats 14  failing beats 0
4.2.1b   TOTAL words 1360  cues 165  runtime at 120 wpm 11:20.0  beats 13  failing beats 0
4.2.6    TOTAL words 1136  cues 123  runtime at 120 wpm 9:28.0   beats 11  failing beats 0
4.2.2a   TOTAL words 1329  cues 164  runtime at 120 wpm 11:04.5  beats 13  failing beats 0
4.2.2b   TOTAL words 955   cues 118  runtime at 120 wpm 7:57.5   beats 10  failing beats 0
4.2.3-4  TOTAL words 1353  cues 154  runtime at 120 wpm 11:16.5  beats 13  failing beats 0
4.2.5    TOTAL words 1387  cues 155  runtime at 120 wpm 11:33.5  beats 14  failing beats 0
```

## Cross-cutting README rules

- **Animation logic agrees with narration.** Particle counts, timings and equilibrium states were reconciled:
  - 4.2.1a: continuity contract and exact counter rows.
  - 4.2.6: counts go 15/5 → 10/10 at equilibrium, and the burst cell loses its counter at rupture.
  - 4.2.1b: the pump cycle ends at 3 outside / 13 inside, and replays are labelled as restarts.
  - 4.2.2b: tube removal times follow loading order.
- **No invented measured readings.** 4.2.2a's osmometer trace (48–105 mm) and control readings are withdrawn. The graph is a numberless qualitative schematic, and a real recorded run is listed as an open dependency. 4.2.3-4 keeps its illustrative cube times, labelled illustrative; the check did not rule these out.
- **Fitted or estimated values are never shown as observed.**
  - 4.2.5: "calculated mean of three percentage changes"; the intercept is read from the trend.
  - 4.2.5: "estimates the tissue's initial water potential" (conductor edit from phase 2, retained).

## Interpretations and items not applied as written

- **4.2.6, M4.** The check says "Replace Beat 7's final three sentences". Taken literally, this would also delete "The wall resists expansion, so it stretches only slightly and the cell does not burst", which the plan requires and which the check's own biology ruling relies on. Only the two lettuce sentences were replaced, with the check's four sentences. Conductor agrees with this reading.
- **4.2.2a, S4 and S6.**
  - S4 is superseded: the control readings it refers to were withdrawn under M1.
  - S6 is moot: the beyond-the-mark-scheme panel it concerns was cut under the runtime ruling.
- **4.2.2b and 4.2.5 cue format.** Cue phrases the checks wrote in curly quotes were re-expressed in italics, the validator's cue form, with no word changed.
- **4.1.4, SF1.** The check's 6:46.5 was computed for the 801-word draft. With the 2 s final hold treated as a settling hold inside the pacing estimate, the new 805-word draft is 6:46.5. If the hold is scheduled separately, it is 6:48.5.
- **4.2.1a, M1.** M4 removed "from the air in the alveoli", so the linked visual action was moved to the cue "Here we track freely dissolved oxygen". Beat 8's counted sequence and the carrier cycles in Beats 10 and 14 were marked "mechanism view; not counted" so that they stay consistent with the continuity contract.
- **4.2.1b, M1.** Beat 6's side-by-side replay now runs under the tag *replay: example restarted*, to follow the new replay rule.
- **4.2.3-4, S2.** The label now says "lowered the pH below the indicator's transition range". The Beat 7 narration ("enough acid has diffused in to neutralise the alkali") was left as written because the check named only the label. It is flagged here for the round-2 checker.
- **4.2.3-4, S6.** Applied with interpretation. The 3, 3, 3 cuboid example was removed by a required cut. No new rectangular example was added, because the check says not to add another long numerical beat.

## Still open after round 1

- **4.2.2a:** a real recorded osmometer run for this tubing, bore and concentration (UNVERIFIED 4). Beat 8–9 cue times are to be rescheduled once it exists. The iodine working concentration and the Benedict's product are left for the builder's reagent list.
- **4.2.1a:** an endorsed-coursebook page for the oxygen example. It is now sourced from OpenStax 22.4/22.5 and W22/23 QP p.15.
- **4.1.4:** the identity of LL-37's receptor. It stays unnamed and undrawn.
- **Assets:**
  - sourced micrographs of red blood cells (4.2.6) and of plasmolysed red onion (4.2.2b)
  - a potato density source (4.2.5; not narrated)
- **Branch hygiene (from phase 2):** `cloud-inputs/` was committed by the second session (006b). It is not removed; conductor decision.
- **Length:** the topic is 99:46.5 of narration against 94:30. The checks accepted the practical overruns. Every remaining optional cut is listed in each storyboard's *Length, honestly* section.
