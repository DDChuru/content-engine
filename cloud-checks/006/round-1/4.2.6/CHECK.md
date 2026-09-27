# 4.2.6 — Independent storyboard check, round 1

Reviewed 27 September 2026. **NOT CLEARED.** The water-potential explanation and six-case comparison are largely correct. The published state contract nevertheless permits sustained net influx beside a fully turgid cell, contradicts both its counter data and the shared model used by 4.2.5, and applies intact-membrane crossing behavior after haemolysis. Correct those build instructions, the empty objectives entry, real-sample explanation and scope of the exam-frequency claim.

## Basis and method

Read the complete storyboard, relevant amended plan and weights, shared-model specifications, SUMMARY, the governing VIDEO-STRUCTURE in full including REAL-WORLD SAMPLES, and the verbatim syllabus outcome. Followed the supplied Topic 3 CHECK model. Ran the supplied validator, independently checked word counts/cut arithmetic and compared the published states with their actual 4.2.2b and 4.2.5 consumers.

Extracted actual PDFs using `pdftotext -layout`: `/home/dachu/sme-9700-archive/pastpapers/2020/November/9700_w20_qp_21.pdf` p.11 and `9700_w20_ms_21.pdf` p.10; `9700_w20_qp_51.pdf` p.5 and `9700_w20_ms_51.pdf` p.9. Page references below are one-based PDF pages. No lesson render or audio was available; this is a storyboard check, not rendered-frame certification. Source SHA-256: `5c0eec60b8a2022505c112343a69fd18c854219b0afb51718e6d7130effaab9f`. Only this CHECK was written for this code.

## Must-fixes — exact replacements

### M1 — One shared turgid endpoint, with biologically consistent crossing counts

SHARED-SPECS and the amended plan define `plant-turgid` as the endpoint reached when cell water potential equals the surrounding solution's and the net arrow has faded. This storyboard instead publishes `plant-turgid` with a net-in arrow, calls it **fully turgid** in Beat 7, holds it through the lettuce aside, and starts Beat 8 in the same state. Only `plant-turgid-equilibrium` later satisfies the shared contract. 4.2.5 imports `plant-turgid` expecting the already-equilibrated endpoint; 4.2.2b imports `plant-turgid-equilibrium`. Neither consumer should need to guess which meaning was intended.

Use these exact state definitions:

> **`plant-taking-up-water` (lesson-local transition):** vacuole enlarges, protoplast presses increasingly against the resisting wall, cell water-potential marker rises, inward and outward crossings progressively approach balance. Net inflow is present only while the water potentials differ. Label: **becoming more turgid; water uptake in progress**.
>
> **`plant-turgid` (canonical shared endpoint):** protoplast pressed firmly against the wall; water potentials equal; no net arrow; water molecules continue crossing both ways at equal average rates. Label: **turgid · water potentials now equal · no net movement**.
>
> **`plant-turgid-equilibrium`:** compatibility alias of `plant-turgid`, with exactly the same geometry, flux and labels.

In Beat 7 replace **“the cell becomes fully turgid”** with **“the cell becomes more turgid”**. Its cue launches/labels `plant-taking-up-water`, not the canonical endpoint. The explanatory model continues the approach to equilibrium; do not freeze a permanent influx arrow beside a completed turgid state. The finished lettuce inset can use the canonical endpoint, with no net arrow.

Replace Beat 8 action 1 with:

> From the first frame, retain the plant cell undergoing water uptake from Beat 7, labelled **becoming more turgid**, with a positive but diminishing inward flux. At “does not flood in for ever”, ring that diminishing imbalance. This is `plant-taking-up-water`, not the completed `plant-turgid` state.

At Beat 8's equality cue, change to the canonical `plant-turgid` endpoint, and let the board retain it. Keep the newly named transition local; the two existing shared endpoint IDs must remain compatible with downstream lessons.

There is also a direct internal contradiction in `cell-vs-solution:equalise`: **“crossings continue both ways at equal rates throughout and after”** would give zero net uptake throughout the alleged equilibration. Replace the complete sub-state paragraph with:

> During `cell-vs-solution:equalise`, water crosses both ways with an imbalance that decreases as the cell's water potential approaches the solution's. The counters are explicitly **crossings per model-time window**, not cumulative totals. For the higher-external-water-potential example, use 15/5 → 13/7 → 11/9 → 10/10, with net inward values 10 → 6 → 2 → 0. Only at equality do average inward and outward rates balance. The net arrow shortens with the imbalance and disappears as the markers meet; balanced molecular crossings continue afterwards. Model time is schematic and compressed, not experimental timing.

Replace Beat 8 actions 4–5 with:

> At “until it equals the water potential of the surrounding solution”, the markers meet, the current-window counts become equal, and the net arrow has faded to zero. At “no net water entry”, highlight **net = 0**. At “Watch the net arrow fade”, replay that immediately preceding final approach in a small inset labelled **replay: approaching equilibrium**; the main endpoint stays at net zero. At “keep crossing both ways, in equal numbers”, highlight the continuing balanced crossings in the main cell.

This keeps the existing spoken cues without delaying a net-in arrow until several seconds after equality. An equally small alternative is to reword the narration so the fade cue precedes equality; do not leave contradictory timing in the build contract.

### M2 — Do not show osmosis across a membrane that has already ruptured

Beat 1 plays haemolysis before its membrane magnifier shows two-way crossings on that same cell's residual outline. The global motion contract also says membrane crossings occur **“in every state”**, which includes `rbc-haemolysed`. An empty ruptured outline is not an intact selectively permeable compartment.

Take author cut 1: delete the 19-word sentence **“Cells are bathed in watery solutions, wrapped in a membrane that water crosses all the time, in both directions.”** and remove Beat 1 action 4. The same correct explanation is already developed on intact cells in Beats 3–4. Keep the leaf and haemolysis model visible through the shortened hook.

Replace the global motion contract with:

> In all intact-cell states, water tokens cross the cell surface membrane in both directions; the difference between the two fluxes determines net movement. In `rbc-haemolysed`, the membrane is ruptured: remove the osmosis net arrow and crossing counter, disperse the contents through the opening, and do not retain a closed-cell water-potential comparison for that ghost. Retained initial-condition labels describe the cause of the event, not the ghost's current osmotic state.

Replace Beat 1 action 3 and Beat 11's final blue-arrow instruction with:

> Attach **water entered before haemolysis** to the swelling-stage thumbnail, not an inward osmosis arrow to the burst ghost. The leaf's completed turgid inset likewise carries a past-event label **water uptake restored turgor**, with no continuing net-in arrow at equilibrium.

The recap may hold the endpoint diagrams static with labels; it must not hold scientifically false net arrows.

### M3 — Establish objectives pictograms at entry

Beat 2 says the first frame has **three empty pictogram slots**, then introduces each pictogram with its line. That leaves the opening narration over an empty/typographic surface even though the validator accepts the phrase “From the first frame”.

Replace Beat 2 action 1's opening with:

> From the first frame, the objectives' styled surface contains all three flat authored pictograms: droplet with opposed arrows, red disc beside green rectangle, and thick wall beside thin membrane outline. Their text slots are empty. Reveal each objective's text at its existing narration cue and brighten the already-visible matching pictogram. Keep this surface separate from the detailed lesson diagram.

No narration change or additional beat is needed.

### M4 — Speak what the real samples contain and the limits of their example

The real-world table describes observable shape/firmness but never gives the narrated material composition required by the final REAL-WORLD SAMPLES rule. The saline example says “matching effective osmotic conditions” without identifying saline in speech; the lettuce's dead/damaged-cell limitation exists only in small type. These need short concrete explanations, not another procedure or clinical lesson.

Replace Beat 5's opening sentence with:

> Take a red blood cell, drawn here as a model. It contains water, dissolved salts and haemoglobin; we compare its outline as water moves in or out, without measuring its water potential.

Retain the optional **sourced** micrograph or explicitly labelled drawn fallback. Cue the outline highlight at **“compare its outline”** and its limitation tag at **“without measuring its water potential”**. Keep the red material labelled **haemoglobin-containing cell contents** as it disperses; this is a composition label, not molecular detail.

After the prescribed isotonic-saline sentence in Beat 6 add:

> Saline is sodium chloride dissolved in water; here its concentration is chosen to keep the cells' volume steady.

On that sentence, use a simple solution vessel labelled **sodium chloride solution; matched conditions in this example**, not a clinical infusion-bag silhouette. No concentration, dose or treatment guidance is required. Add saline to the Real-world samples table.

Replace Beat 7's final three sentences with:

> That explains the lettuce: its living cells contain water and dissolved cell-sap solutes. Water entry restores turgor and the leaf firms up. This works as a qualitative demonstration when the cells are intact; a dead or badly damaged leaf may not recover. Firmness does not measure water potential.

Cue **“dissolved cell-sap solutes”** to the vacuole inset and **“when the cells are intact”** to the fit/limitation note. The separate component potentials remain unnamed. Replace **“No real material is handled in this lesson”** with **“All examples are schematic; the lettuce handling is illustrated, not a recorded experiment.”**

### M5 — Keep the exam-evidence claim within the actual sample

Beat 11 says **“In the papers checked for this topic, no question tests this outcome directly”**. The weights expressly say this was not a full re-audit of every question in those papers; 0/5 is coding of **cited Paper 2 blocks**. The on-screen qualifier does not repair the broader spoken claim.

Replace Beat 11's first two sentences with:

> How this reaches you. None of the cited question parts in the five-paper Paper 2 sample directly tests this outcome. So this close follows the syllabus: explain water movement in water-potential terms and compare its effects on plant and animal cells.

Change the exposure cue to **“None of the cited question parts”**, and retain **direct exposure in the cited Paper 2 blocks: 0/5**. Do not imply absence throughout those papers or the archive. The two adjacent exam references remain valid, as verified below.

## Should-fixes

1. **Plasmolysis wording:** “Plasmolysis is a plant-cell term” is too exclusive: having a wall, rather than belonging to plants, is the relevant distinction. Either take author cut 6 (my runtime ruling below), or replace it with **“Here the plant protoplast withdraws from its wall; the red blood cell has no wall to pull away from.”** Keep the local comparison label **no wall: crenation, not plasmolysis**. There is no need to teach other walled organisms here.
2. **Model-state bookkeeping:** the plan/shared spec has eight named `CellOsmosisSet` states; the draft's `rbc-equal` and `plant-turgid-equilibrium` are local additions. Replace **“all ten states the plan lists”** with **“the eight shared states, plus local equality/compatibility states specified here”**. After M1, explicitly list the transition separately. The Reusable models table says 4.2.5 uses `plant-plasmolysed`; that storyboard explicitly excludes it. Replace that consumer list with **`plant-turgid`, `plant-equal`, `plant-flaccid`**.
3. **Recap wall count:** Beat 10 action 6 says **“the two plant-row walls”**, but the board has three plant cells. Replace with **“all three plant-row walls”**.
4. **General lower-potential cases:** label the final lower-column plant outcome **“with sufficient further water loss: plasmolysed”**. A lower external water potential establishes the initial net direction; an arbitrarily small difference need not cause full plasmolysis. The existing “with further loss” narration is appropriate; keep it on recap labels too.
5. **Clock:** do not put invented elapsed-minute figures on the lettuce clock. Retain **time compressed; our example; nothing measured** and use an unnumbered time-passing graphic if no actual duration is supplied. The first-contact start itself is correct.

## Biology, scope and shared-model ruling

The syllabus quotation matches **4.2.6 p.22** verbatim, including the exclusion. All six initial conditions are present. The lesson distinguishes each solution's water potential from the cell's; pure water at atmospheric pressure is the zero reference, and “at the same temperature and pressure” qualifies the solute comparison. No “concentration of water” explanation or component-potential names/equations enter the narration.

The definition of osmosis is correct. The handle is immediately converted to the precise definition; the scale represents water potential, not physical downhill flow. The central plant mechanism is sound: the wall resists expansion, total cell water potential rises to the surrounding solution's, and net entry stops while water continues crossing both ways. Equal water potentials are explicitly neither proof of flaccidity nor equal solute concentrations. The normal red-cell shape is retained only for the illustrated initially-normal cell. M1 is needed because the current animation contract contradicts this otherwise correct narration.

**Pure-water haemolysis is acceptable as the specified schematic case.** Beat 5 does not say every slightly higher external water potential necessarily bursts a red cell; the pure-water condition and explicit swell-without-bursting caveat bound it. SUMMARY's query about “may burst” does not by itself require weakening this correctly specified example. Keep the pure-water label wherever the bursting endpoint is reused. No clinical claim or dosage is taught.

The plasmolysed cell correctly retains a fixed wall, a separate cell surface membrane and tonoplast, and an external-solution-filled gap; water and sucrose enter the gap through the freely permeable wall rather than through the cell membrane. No nucleus is added to the red cell. Cell drawings and crossing numbers are explicitly schematic. Slight wall deformation is appropriate; neither morphology percentages nor crossing counts are claimed as measurements.

The reason for the lesson is clear: useful cellular water content and turgor's support function. Objectives precede explanation; the comparison board accumulates the six cases and is reused for recap and close. Aside from M2–M3, non-text models are specified at entry and visual cues change the scientific state or highlight a specific structure. Static recap is allowed because attention is explicitly directed. There are no reagent colour changes or covalent transformations to audit. Cell swelling, shrinking, rupture and gap filling are real motions, not cuts between assertions.

**Error beats: none, correctly.** The weights identify no evidenced error for this outcome. The final equal-potential/flaccidity card is an honestly labelled authored contrast, not an examiner quotation or claim about common candidate behavior. Retain it under the governing VIDEO-STRUCTURE and the consistent ruling used for 4.2.5. A short closing contrast does not create an extra 65–75 s evidenced error beat.

## Citation audit and resolution of UNVERIFIED items

| Claim | Actual source checked | Finding and status |
|---|---|---|
| Full 4.2.6 outcome and shortened close quotation | SYLLABUS-9700-DETAIL p.22 | Verbatim match. Close is a contiguous excerpt ending before the parenthetical exclusion, not an altered quote. |
| Five-mark phloem explanation containing osmosis/water-potential points | W20/21 QP p.11 Q4(b)(ii); MS p.10 | Verified. The question asks how assimilates and viruses travel through phloem sieve tubes. Scheme awards any five relevant points, including assimilate entry lowering water potential and consequent water entry by osmosis; other points concern hydrostatic-pressure gradients and mass flow. Five marks are not all for osmosis. **PDF-CHECKED (this check)**; resolve UNVERIFIED 2. |
| Three-mark sketch/intercept form, red pepper fruit wall | W20/51 QP p.5 Q1(c)(ii); MS p.9 | Verified. Stem asks for expected-result sketch, axes labels/units and how to estimate the equivalent sucrose concentration. Three points cover x-axis label/unit, single downward crossing and identifying the intercept. No numerical −860 kPa answer belongs to this part. **PDF-CHECKED (this check)**; resolve UNVERIFIED 3. |
| No directly testing cited part, 0/5 | Amended weights' selected-block coding | Supported as a limited ledger claim, not an exhaustive absence claim; M5 bounds it. UNVERIFIED 1 remains “no direct example identified in this cited set”; the two adjacent PDFs do not establish that no direct question exists elsewhere. |
| Reject card: equality does not require flaccidity | Author's explanatory wording; amended plan MF3 | Honest label, no manufactured R/I line. Mechanism supports it. |
| Sourced red-cell micrograph | No asset supplied | UNVERIFIED 4 remains an optional asset dependency. The explicitly labelled authored-model fallback is permitted; no generated or falsely sourced micrograph. |
| Lettuce demonstration | Plan-supported qualitative example; no measured observation supplied | UNVERIFIED 5 is not resolved by the exam PDFs. Keep the illustrative status and no numeric potential/duration; M4 supplies the material/fit caveat required for teaching it. |

No direct exam quotation is used, and every actual exam-mark claim in the draft was checked against its original QP/MS. Retain “our paraphrase” even after upgrading the verification status. The component-potential and phloem details present in source PDFs are not an invitation to expand this lesson's syllabus scope.

## Numerical, cue and runtime audit

| Item | Independent ruling |
|---|---|
| Crossing examples | 15−5 = 10 inward; 10−10 = 0; 5−15 = −10. Equalisation windows give 10, 6, 2, 0; each window totals 20 crossings. These are schematic flux counts, not cumulative totals or measured rates. M1 resolves the contradictory prose. |
| Scale positions | 0.40, 0.35 and 0.65 are dimensionless drawing positions below the zero reference; not fabricated kPa measurements. Plant marker reaching pure-water level at equilibrium is correct for the stated model. |
| Morphology | 70/80/55% vacuole area, 45% protoplast area, 2% wall bulge, 75% crenated face area and 10–12 points are explicitly drawing instructions; do not put them on measurement readouts. |
| Validator rerun | **1,147 words; 122 cues; 11 beats; zero failing beats; maximum gap 25 words**. No missing-section/citation-tag failures. |
| Per-beat words | **89, 53, 114, 110, 108, 108, 128, 106, 116, 99, 116**. |
| Runtime | 1,147 ÷ 2 = **573.5 s = 9:33.5**, against **8:15**, an overrun of **78.5 s**. No error-beat read allowance applies. |

The validator's success certifies textual cue matches/order and gap lengths, not whether a ruptured membrane can sustain osmosis, whether an endpoint is still transporting net water, or whether the first-frame pictogram slots are empty.

**Runtime ruling:** take author cuts **1, 3, 4 and 6**, totaling **19 + 8 + 7 + 13 = 47 words**. Cut 1 also removes the erroneous post-haemolysis magnifier; cut 6 removes the overexclusive plasmolysis sentence while retaining the local visual contrast. Keep cut 2's 22-word recap sentence: revisiting the comparison and direction is useful synthesis. Keep cut 5's four-word starting-cell context, since it explains why the equal case stays somewhat turgid. Before required replacements/additions, the selected cuts give **1,100 words = 9:10**, 55 s over budget.

**Accept that remaining overrun and the modest material/fit additions.** The six comparisons, standalone definition, plant equilibrium, real examples and recap each do distinct work. No case should be deleted, no error beat invented, and no narration accelerated. The author's full six-cut arithmetic (1,074 words = 8:57) is correct, but “9:00 is the honest floor” is an editorial judgment, not a calculated limit. Recount after M4–M5 and the selected cuts, update all windows/ledger entries, and keep all affected cues exact and unique.

Return check: M1–M5 and their affected cue/state definitions, with particular attention to shared `plant-turgid` consumers, haemolysis endpoints and the final 0/5 wording. Rendered still-frame verification remains pending.

NOT CLEARED
