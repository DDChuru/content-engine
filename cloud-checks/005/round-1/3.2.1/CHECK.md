**NOT CLEARED**

Independent round-one check of **3.2.1 — Working conditions: temperature and pH**, 24 September 2026. Re-author the gas-rig start sequence and controls, correct the pH recap/model mapping, and complete the visual contracts below before narration. The principal explanations, numerical tables and external quotations pass; the current cue validator does not catch the remaining scientific and temporal contradictions. Length alone is not a reason for this verdict.

Reviewed `STORYBOARD.md` SHA-256: `4ff088228ce4cb75bf7d9294f038fbc38f4f1fb30ec3da137b63adacb621c99a`.

## Must-fixes

### M1 — The pH recap turns a possibility into a diagnosis of the plotted endpoints

**Locations:** Beat 10 narration/action, lines 215–217; the pH model and Beat 9, lines 63–64 and 203–206.

Beat 9 correctly says that extreme pH **can** cause denaturation. Beat 10 reduces this to **“at extremes, denatured”** and pulses the two endpoints of the illustrative pH plot. Those endpoints are buffer pH **5.0 and 9.0**. Their lower rates do not establish unfolding, and being endpoints of the tested range does not establish that they are denaturing extremes. This repeats the kind of local-to-general overstatement punished in the cleared sibling checks. It also undermines this lesson's own reversible, modest-pH-change explanation.

Required repair:

- Replace the recap's final clause with **“at extreme pH, denaturation can occur.”** Remap its cue to that exact substring.
- At that cue, highlight the already-taught schematic denatured protein, with **“extreme pH can denature; not inferred from these endpoint measurements”**. Do not pulse the pH 5/9 data points as evidence of denaturation.
- Make the pH use of `denatured` explicitly reuse the unfolding, link-loss and failed-binding motions **without** the temperature-triggered thermometer rise or faster thermal jitter. The shared definition currently includes those heat actions, while Beat 9 calls for the “full” motion.
- Resolve Beat 9's numerical pH read-out: the data identify pH 8 as the **highest tested mean**, not an established exact optimum. Use qualitative schematic states for the mechanistic demonstration, or label 8.0 accordingly. Specify the “extreme pH” state qualitatively rather than leaving the builder to invent an unsupported numerical threshold. Preserve the measured pH graph and its 7–9 investigation bracket separately.

No new protein chemistry or additional pH values are required.

### M2 — Make equilibration, the gas-volume baseline and t = 0 one physically consistent sequence

**Locations:** apparatus contract, lines 46–48; Beat 3 actions 2–4, lines 109–111; dataset conditions, line 241.

The contract says timing starts at the tilt. The actual action sequence starts pouring at **“tilt the flask by its neck”**, returns the flask upright at **“the tube spills”**, and only then shows a stopwatch at zero and begins plunger motion at **“the timer starts”**. Following these cues literally loses the beginning of the reaction. This is a semantic cue failure even though every substring passes the validator.

There is a second start-state gap: the syringe is zeroed when the system is sealed, **before** ten minutes of equilibration at the selected temperature. Expansion or contraction of the enclosed gas during equilibration is not reaction gas. The storyboard needs a stable baseline at the end of equilibration; it cannot simply promise origin-starting curves and motionless controls from the earlier zero check.

Re-author Beat 3 and the model contract together so that:

1. Enzyme and peroxide remain separate for the full, equal ten-minute equilibration at each chosen temperature. Establish the collection baseline **after** equilibration, with a physically specified procedure. One workable version is an equilibration vent/three-way tap, setting the syringe to zero before closing the vent; the collection path is then gas-tight before mixing. Alternatively, specify a stable recorded baseline and plot changes from it, updating the displayed zero convention consistently. Do not open the reaction system after mixing or force the plunger back against a closed vessel.
2. First reactant contact, stopwatch start and collection start occur in the **same animation frame**. The stopwatch is already running when the flask returns upright. A later spoken reference may highlight that running timer; it must not reset it to zero.
3. The five temperatures are shown as **five separate runs/conditions**, not as one flask changing from 10 to 50 °C during one equilibration countdown. Change “warm separately” to **“equilibrate separately”** and show cooling appropriately at 10 °C.

Keep the separate S22/33 five-minute preheat/disc panel and its bounded citation. This finding does not dispute the chosen maintained-temperature investigation; it makes its start measurable.

### M3 — Complete the matched controls and the disc-preparation procedure

**Locations:** gas control, lines 46–49, Beat 4 and line 241; disc contract, lines 51–55; Beat 7 and line 260.

**Gas control:** the enzyme suspension is made in pH 7.0 buffer, but its replacement is plain water, described as **“same everything else”**. That also removes the buffer vehicle. The binding plan requires a **matched enzyme-free background control**. `SHARED-SPECS.md` supplies the water replacement, so this is an inherited specification conflict, not solely an author invention; that file expressly says the plan wins.

Use **5.0 cm³ of the same enzyme-free pH 7.0 buffer vehicle** in place of the suspension, with the same peroxide, thermal history and collection procedure. Change the water-control narration, labels, model entry and dataset description consistently. Preserve the zero readings as explicitly illustrative observations, not a promise that a blank must always give zero. The specimen's water-control answer is local validation of that question, not a requirement to remove buffer from this design.

**Disc series:** the plan's disc-rise paragraph expressly requires **“Mix the enzyme preparation before soaking discs”**. The draft describes initial mixing with buffer, followed by a ten-minute stand; it never specifies resuspension before each disc. Swirling the gas-rig stock does not satisfy this separate procedure. Add and cue gentle mixing of each soaking mixture immediately before each disc is introduced, with the same timing in every treatment and the boiled control. Specify clean/rinsed forceps between treatments so that changing tubes does not leave an unaddressed route for carrying enzyme/buffer between conditions.

Give the boiled control the same **2.0 cm³ suspension + 8.0 cm³ buffer**, final assay temperature, standing/soaking/draining times and release/endpoint conditions explicitly. Its stated 120-second observation limit is correct and must remain. Preserve fresh peroxide for every disc, the equal peroxide concentration/volume/depth, identical discs, three whole-second readings and the buffer-pH axis.

### M4 — Specify graphics on the objectives and throughout the opening of the exam close

**Locations:** Beat 2, line 94; Beat 11 action 1, line 226.

The checking brief forbids a text-only frame. Beat 2 currently specifies only a background and three text lines, explicitly “no diagram”; Beat 11 starts on a “plain forms surface” and does not explicitly retain the familiar graphics until the later model pulse/final layout. A builder should not have to infer an exception or invent the missing composition.

Keep the objectives on their **own styled surface**, as VIDEO-STRUCTURE requires, but specify accompanying contextual vector graphics—for example, the hook's human/thermometer and pH motifs—with a concrete reveal at each existing objective cue. Do not put the objectives on the not-yet-taught apparatus diagram.

For Beat 11, explicitly retain the familiar enzyme model and labelled factor plots from Beat 10 while the forms rows, question and marking points appear beside them. This supplies a continuous non-text visual, including during the anchored read. The catalase plots must retain their illustrative-data labels and must not masquerade as the missing protease figure.

### M5 — Restore the binding plan's labelled energy-profile recall

**Location:** omission ledger, line 380; plan's shared-model table; cleared 3.1.1-2 model specification and reuse ledger.

The plan assigns a labelled `EnergyProfileGraph` recall to **3.2.1**. The draft explicitly declines it because the quoted temperature marking chain does not need it. A mark scheme validates the explanation; it does not cancel a binding model handoff. The authors' summary acknowledges the omission but supplies no overriding clearance.

Add a brief, labelled **“recall: 3.1.1-2”** inset during Beat 5, attached to a unique existing cue such as **“more effective collisions”**. Reuse the established energy-against-reaction-progress graph, unchanged reactant/product levels, separate catalysed/uncatalysed barriers and correct bracket meanings. Do not animate warming as lowering the enzyme's activation-energy barrier. This is a recall, not another activation-energy lesson; no new numeric energy values or substantial narration are needed. Update the models/assets/omission ledger accordingly.

### M6 — Give the final temperature contrast an exact cue and an unambiguous scope

**Location:** Beat 11 action 3, line 228.

The card appears **“During this build”**, with no precise entry cue, while the narration and marks concern a **pH** question. Both card lines say only “above the optimum”. The kinetic-energy contrast concerns temperature, and should not depend on the viewer remembering an earlier context.

Specify one exact entry cue, retain the authored-contrast caption, and write:

- **✗ above the temperature optimum the molecules slow down**
- **✓ above the temperature optimum the enzyme is increasingly denatured, so fewer active sites are functional**

Show the wrong line already unmistakably crossed out alongside the correct one; finish with the correct statement visually dominant. It must never appear as an unmarked method claim. Do not label this COMMON MISTAKE: the register supplies positive marking points, not a diagnosis of this particular wording error. It can remain the short captioned closing contrast permitted by the standards/shared brief and the cleared sibling precedents; do not invent an extra allocated error beat or steal one from 3.2.1b.

## Scope, science and chemistry verification

I read the complete target storyboard, topic plan and weights, VIDEO-STRUCTURE, Topic 3 outcome/introduction text in the syllabus detail, all three specified evidence files, both cleared sibling storyboards and their two rounds of checks, SHARED-SPECS and SUMMARY. Verification was text-to-text against the supplied register; no exam PDF was available or claimed to have been inspected.

The opening outcome quotation matches syllabus p.20. Both owned factors fulfil **investigate and explain**: each has an investigation, measured quantity, rate calculation and active-site explanation. Enzyme/substrate/inhibitor concentration and E38–E40 are explicitly handed to 3.2.1b. No Q10 rule, additional inhibition class, Michaelis–Menten derivation, reciprocal plot or catalytic-residue mechanism is introduced. The hook, objectives, explanations, familiar-diagram recap and cited exam close are all present.

The sentence-level sweep included narration, captions, model actions and the author's absolutes ledger. The main temperature chain is sound: kinetic energy and effective collisions below the optimum; increasing loss of functional sites, tertiary structure and complementarity above it; particles do not slow merely because the measured rate falls. Cold inactivity is distinguished from denaturation. “Held partly”, “some R groups”, “need not unfold” and “can return” preserve appropriate limits. The peptide backbone stays intact. The press-stud analogy is identified as an analogy and immediately translated into biological wording; it need not be removed. M1 identifies the recap's loss of qualification, which the author's own sweep missed.

The pH mechanism stays at the required R-group charge/bonding/shape depth. The moderate shift and return are distinguished from unfolding and from the sibling lesson's reversible inhibitor state. Keep charge tags and H⁺ tokens schematic; no atom-resolved covalent proton-transfer mechanism is specified or needed.

**Formula equation: PASS.** `2H₂O₂ → 2H₂O + O₂` has H4/O4 on both sides. It is a static balanced formula display. No atom-resolved `CatalaseNet` exchange is drawn here, so this lesson needs no new atom edge list or valence-switch animation. The unfolding/link-loss events are non-covalent motion, not backbone cleavage. The authors' separate concern about catalase atom mapping in 3.1.3 does not affect this formula-only storyboard.

**Handling:** the small inner tube—not the outer flask—is explicitly mouth-below-base, with a stream from its lip and level liquid. A 50° outer-flask tilt is not itself the prohibited pouring angle; the builder must preserve the stated inner-tube geometry. Hot comparison/control tubes use holders; peroxide tubes stand in a rack; discs use forceps and defined release/surface endpoints. M2 repairs the timing conflict. In Beat 7, specify pipette tips above the receiving mouths and make the “contains enzyme” tint an **outline/annotation highlight**, not a new liquid colour. The hook's organ tints are diagram annotations. No reagent colour-change sequence is otherwise taught, and no RGB reagent tween is specified.

## Numerical audit

The tables are authored illustrative inputs, not purported Cambridge measurements. All displayed means, plotted points and the worked rate are reproducible:

| Temperature / °C | Sum of three initial rates / cm³ s⁻¹ | Mean / cm³ s⁻¹ |
|---:|---:|---:|
| 10 | 0.45 | 0.15 |
| 20 | 0.78 | 0.26 |
| 30 | 1.20 | 0.40 |
| 40 | 1.59 | 0.53 |
| 50 | 0.63 | 0.21 |

The tangent's `12.0 cm³ / 30 s = 0.40 cm³ s⁻¹` matches 30 °C repeat 1. Its triangle is explicitly on the **tangent**, not an arbitrary chord. The highest tested mean is 0.53 at 40 °C; 30 and 50 °C supply the lower neighbouring values for the planned 30–50 °C search bracket. No exact universal optimum is asserted. The graph contract fixes the initial gradients; it does not supply measured intermediate readings, and the builder must not invent labelled readings or claim the tangent endpoint is necessarily a measured curve point.

| Buffer pH | Sum of times / s | Mean / s | Reciprocal before rounding / s⁻¹ | Two significant figures / s⁻¹ |
|---:|---:|---:|---:|---:|
| 5 | 87 | 29 | 0.0344827586… | 0.034 |
| 6 | 51 | 17 | 0.0588235294… | 0.059 |
| 7 | 39 | 13 | 0.0769230769… | 0.077 |
| 8 | 36 | 12 | 0.0833333333… | 0.083 |
| 9 | 63 | 21 | 0.0476190476… | 0.048 |

The 13-second animation is pH 7 repeat 2. The pH 7/8 ranges, 12–14 and 11–13 seconds, overlap as disclosed. The highest reciprocal mean is at pH 8; the planned neighbouring-value bracket is pH 7–9. The boiled control correctly has dashes rather than a fabricated mean or reciprocal: “did not rise within 120 s” is not a measured endpoint of 120 s and does not prove zero activity.

Correct the pH 5 worked line to **`1 ÷ 29 = 0.0344827586… → 0.034 (2 s.f.)`**. Its result is right; the present `0.0345 → 0.034` invites an incorrect double-rounding explanation.

Volumes are consistent: the gas run mixes 5.0 + 10.0 = 15.0 cm³; each disc soaking mixture is 2.0 + 8.0 = 10.0 cm³. Peroxide amount is `0.010 dm³ × 0.20 mol dm⁻³ = 0.0020 mol`, giving `0.0010 mol O₂`, approximately **24 cm³ at the shared room-temperature/pressure collection convention**. The progress-curve ceiling is consistent with that stated convention; it is not a gas volume at every bath temperature. The 10-minute/60-second/5-second timings, bath temperatures and drawing durations are design specifications, not numbers derived from the tables. They are not presented as verbatim S22/33 instructions.

## Quotations and evidence status

**UNVERIFIED external quotations: none.** I checked the exact strings, including short fragments, without relying solely on the authors' checker (which skips short terms and normalises more than whitespace). Paper/session/question/page attributions agree with the register.

| External quotation/group | Verified register location | Attribution confirmed |
|---|---|---|
| Outcome 3.2.1 and all five bullets; “investigate and explain” | Syllabus detail, Topic 3, lines 317–325 | 2025–2027 syllabus p.20 |
| Full kinetic-energy/collisions/complexes/shape/denaturation chain | Plan §3.2.1, line 156 | 9700/33 June 2022 Q1(b)(v), MS p.6 |
| Oxygen release; three times; mean; whole seconds; boiled enzyme; contamination; fresh peroxide | Plan §3.1.3, line 83; weights' S22/33 ledger corroboration | 9700/33 June 2022 Q1(a), MS p.6 |
| “Use the data in Table 1.3…” instruction | Weights S-J, line 106 | 9700/32 June 2024 Q1(b)(ii), QP p.6, 3 marks |
| Complete protease pH marking passage and its separately displayed fragments | Weights S-J, line 106 | Same question, MS p.7, any three |

The numbers **6.1, 1.8 and 8.5** in the protease quotation are source values, not derived from the invented catalase table. Lipase pH 8 and specimen Q15 key C are supported paraphrases from the weights. The S22/33 preheat summary agrees with the plan and does not add an unsupported room-temperature-testing claim.

The S22/33 question-paper method wording and S24/32 Table 1.3/Fig. 1.2 remain unavailable here and are deliberately not reproduced. That is an evidence boundary, not an unverified quotation actually used. The author's quotations of its own narration in the audit ledger are not claimed Cambridge evidence. Do not add the missing table, figure or method text from memory during rework.

## Cues, error treatment and cross-lesson consistency

An independent narration extraction agrees with the read-only validator: **963 words; 138 literal cues; no missing, repeated or out-of-order cues; maximum gap 15 words**. Per-beat maximum gaps are **12, 14, 12, 13, 15, 13, 11, 11, 15, 10, 12**. Detailed sampling of Beats 3, 6, 7, 9 and 11 confirmed the literal matches. M2 and M6 explain why a literal pass is insufficient: the mapped action can still happen at the wrong biological moment, or remain outside the exact-cue syntax entirely.

There are **zero allocated error beats**, correctly. E38–E40 are not silently omitted; they belong to 3.2.1b. Therefore there is no five-move COMMON MISTAKE sequence to approve or thin here. The short final authored contrast is not evidence that examiners diagnosed this particular error. Keep that distinction and the written-only wrong proposition clear, as M6 requires.

`EnzymeActiveSiteModel` retains the cleared base silhouette/resting-state identity, temporary binding and backbone continuity; 3.2.1 supplies its assigned denaturation extension. The added schematic links/charge tags are an extension, not an asserted molecular bond count. `RateGraph` keeps time and factor axes distinct, an initial tangent for gas collection, and an explicitly relative reciprocal-time measure for discs. The canonical rate sentence is reproduced verbatim from SHARED-SPECS and is suitable for the 3.2.1b recall. The shared 30 °C mean 0.40 and pH 7 row 12/13/14 agree with the shared specifications and summary. `EnergyProfileGraph` is the explicit missing handoff, addressed by M5.

The authors' SUMMARY is accurate about the word count, table values and quotation availability. Its acknowledged energy-profile omission is still a plan deviation; its general assurance of cross-lesson consistency cannot clear the control mismatch or the temporal/recap defects above. No render exists: this check approves neither actual liquid geometry nor rendered colour/frame transitions in advance.

## Length ruling

Independent words by beat: **81, 39, 110, 100, 87, 117, 108, 78, 95, 58, 90**. Total **963 words / 120 wpm = 8:01.5**, **1:01.5 over 7:00**, entirely teaching. Do not add the five-second read and two-second final hold again to this effective final-video planning rate. The provisional beat headings are stale; the current word-count table is correct.

**Accept the present teaching overrun; take none of the four proposed ordered cuts.** This is a content-led ruling, not clearance of the defects above. The investigations, causal explanations and recap do different jobs. Repetition that supports the governing hook/objectives/explanation/recap/exam structure is not automatically expendable.

| Author's ordered cut | Ruling |
|---|---|
| 1. Remove the spoken S22/33 design contrast, 32 words | **KEEP.** The binding plan explicitly requires the designs to be distinguished. The current spoken comparison helps prevent a genuine experimental conflation. |
| 2. Remove the pH hook sentence, 21 words | **KEEP.** It supplies the second factor's biological context, not another reading of the pH results. |
| 3. Remove the press-stud sentence, 12 words | **KEEP.** It is the lesson's handle, immediately converted into precise wording. Removing the sole handle to save six seconds is not a repetition cut. |
| 4. Remove the exam-forms sentence, 18 words | **KEEP.** It supplies the required exam orientation; the real-question read alone does not replace that move. |

Correct the cut arithmetic: **963 − 83 = 880 words = 7:20**, not 874 words/7:17. The latter uses the stale 957-word draft. The explanation subtotal is **87 + 117 + 95 = 299 words = 2:29.5**, not 295/2:27.5; the investigation subtotal **394 = 3:17** is correct. Recount after the required repairs and report the resulting teaching overrun honestly. Do not speed narration, omit controls, or reduce any error beat in a dependent lesson to compensate.

Recheck the revised procedural actions, pH mappings and exact cues before buying narration. Only this report was written; the storyboard was not edited.
