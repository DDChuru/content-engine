# Cloud run 007 — fixes for round-1 checks (`cloud-checks/007/round-1/`)

27 September 2026. Round-1 verdicts: 5.1.1 CLEARED WITH MINOR EDITS; 5.1.2, 5.1.3, 5.1.4, 5.1.5, 5.1.6, 5.2.1,
5.2.2 NOT CLEARED. Every must-fix was applied as instructed (the check's replacement text used verbatim);
every should-fix was applied (none declined). Each storyboard ends with a `## CHECK RESPONSE (round 1)` table
listing item, ruling, location and exact action. One formatting rule was applied throughout: the checks'
authored replacement captions are set in italics rather than double quotation marks, because double quotes
are reserved for verbatim source text and the quote checker would otherwise (rightly) reject them.

## Per lesson

| Code | Verdict | Must-fixes applied | Should-fixes | Words / runtime (budget) | Validator · quotes |
|---|---|---|---|---|---|
| 5.1.1 | CLEARED WITH MINOR EDITS | M1 human scale threads kept separate from the 2n = 4 model (dissolve to a labelled model-cell panel); M2 resolved UNVERIFIED labels replaced by the check's record, scale references (NHGRI; AFM paper) added | 3/3 (Before-S reset label; histone linker wording; drawn 5 µm bar) | 746 · 6:13 (6:00) | 0 failing · 15/0 |
| 5.1.2 | NOT CLEARED | M1 mature red cell shown already anucleate, never expelling a nucleus; M2 E5-06 display: examples strip as alternatives, three credited rows filling with the clauses, no empty tick | 6/6 (simplified-set captions; labelled replay resets; set cards on new daughters not shed cells; 'cells' framing; verified sources; ledger note) | 802 · 6:41 (6:30) | 0 · 12/0 |
| 5.1.3 | NOT CLEARED | M1 counters change on the event frame (S completion; centromere division; cytokinesis with the graph drop); M2 false closing 'nothing halved' replaced | 4/4 (pictogram from frame 1; inset caption and one-chromosome counter; per-nucleus axis label, 'earlier in mitosis' replay tag; verified sources, command word *suggest* noted) | 1,071 · 8:55.5 (8:30) | 0 · 6/0 |
| 5.1.4 | NOT CLEARED | M1 bounded sentence in answer, recap and ✓ card; M2 s22_12 Q18's conclusion (a cell may stop dividing if telomeres become too short) taught and shown | 5/5 (6.1.4 handoff split; restored chromosome before zoom; schematic-copying caption; persistent TTAGGG label, continuous sweep; verified sources) | 512 · 4:16 (4:00; +6.7 %, content-led, as the check directed — optional 15-word cut list) | 0 · 2/0 |
| 5.1.5 | NOT CLEARED | M1 division excerpts labelled with the omitted interval and full telophase counts; M2 exam answer row B first, marrow callback on a beyond-the-mark-scheme panel; M3 objectives beside pictograms | 4/4 (spine sentence; red-cell sentence with source; timestamps; resolved sources incl. QP p10) | 529 · 4:24.5 (4:30) | 0 · 3/0 |
| 5.1.6 | NOT CLEARED | M1 mutation defined as a change in DNA sequence; 'can' cause loss of control; label *a mutation that disrupts division control in this example*; M2 division-excerpt contract, surface loss continues during tumour growth; M3 credited answer before and beside the healthy-tissue extension; M4 E5-07 header/underline match | 4/4 (74 s schedule; recounts; S24 label and 'why they could treat a tumour'; verified sources) | 744 · 6:12 (6:00) | 0 · 8/0 |
| 5.2.1 | NOT CLEARED | M1 anaphase count and daughter-chromosome label on the separation frame, 'one pole' row only after arrival (also Beats 9, 14, 17); M2 spindle outside the intact envelope (animal and plant); M3 real image made an open asset, narration 'This image shows…' | 7/7 (sources; hold accounting; inserted sentences; cut arithmetic 57 words) | 1,494 · 12:27 + 2 s hold (12:00; within the check's 12:29.5) | 0 · 9/0 |
| 5.2.2 | NOT CLEARED | M1 decision strip: anaphase no longer routed through 'one group'; M2 asset completion instruction verbatim, eight PM frames plus the detail-poor cell listed as open assets, no real image described as held; M3 stain timer from first contact; M4 separate bulb pipette and waste for removing stain | 7/7 (Beat 8 rewrite; provenance; objectives entry; render style; verified sources; E5-05 schedule; hold accounting) | 1,373 · 11:26.5 + 2 s hold (11:00; within the check's 11:29) | 0 · 15/0 |

Topic total: **7,271 words ≈ 60:36** against 58:30 (+3.5 %); every lesson inside the limits its check accepted
except 5.1.4, whose check directed a content-led overrun rather than cutting qualifiers. Error beats unchanged in
length and structure (all 130–150 words; talk-throughs 91–108 words).

## Conductor changes outside the storyboards

- **Quote checker made reproducible** (every check reported `FileNotFoundError` because `cloud-inputs/` is not on
  the run branch): `work/007/check_quotes.py` now reads a missing `cloud-inputs/NNN/…` source from its input
  branch with `git show origin/cloud/inputs-NNN:<path>`, fetching on demand, and exits 2 (not a false pass) if a
  source still cannot be read. Tested with `cloud-inputs/` removed from disk: 5.1.1 reproduces `quotes checked
  15 not found 0`.
- **`work/007/ASSETS-NEEDED.md`** created (README instruction): IMG-5.2.1-01; PM-LOW, PM-HIGH, PM-PRO, PM-MET,
  PM-MET-ANGLE, PM-ANA, PM-TEL, PM-UNCLEAR and the detail-poor cell for 5.2.2; plus the Topic 1 component
  names. Rule recorded: licensed real photomicrographs are the target; a labelled drawing only with conductor
  approval for a named frame, which is then re-checked.
- **`work/007/SHARED-SPECS.md`**: new *Round-1 contracts* section — counts change on the event frame; the 5.2.1
  separation-frame and spindle/intact-envelope rules (verbatim); the division-excerpt/omitted-interval
  contract (5.1.5, 5.1.6); labelled replay resets; exam answer first; the real-image rule; first-contact
  timers; telomere caption persistence; `MitosisCellModel` render style `toluidine-blue-schematic` (also
  registered in 5.2.1's model spec at 5.2.2's request). Per-nucleus axis label corrected.
- **`work/007/VERIFIED-EVIDENCE.md`**: four exact Cambridge wordings the round-1 checks read in the PDFs added
  (w20_21 Q1(a)(iii) and Q6(a)(i) stems; s24_23 Q5(d) stem, MS p10; s22_12 Q18 keyed statement), plus verified
  facts (w22_23 command *State*; s21_22 microtubules not visible; w22_13 Q20 on QP p10; others). Each was
  confirmed against the round-1 CHECK.md text before adding.
- **Plan and weights**: per-nucleus axis label; 5.1.4 converted sentence and ✓ card to the bounded M1 wording and
  the s22_12 Q18 conclusion; `TissueGrowthModel` label; exact stems for w20_21 Q1(a)(iii), Q6(a)(i) and s24_23
  Q5(d); s24_23 (d) on MS p10; w22_13 Q20 on QP p10.

## Still open (production dependencies, not storyboard defects)

Licensed photomicrographs for 5.2.1 and 5.2.2 (`work/007/ASSETS-NEEDED.md`); the Topic 1 microscope and
cell-structure component names. These cannot be supplied from this run without inventing sources.
