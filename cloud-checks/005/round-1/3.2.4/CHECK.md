NOT CLEARED

Independent round-one check, 24 September 2026 — **3.2.4, “Trapping the enzyme: immobilised in alginate”.** Re-author the comparison's volume/concentration account and its interpretation in Beats 5–7; correct the reuse inference in Beat 8; make the exam close visually anchored throughout. The calculations, source quotations and literal cue checks pass. The 34-second overrun is not the reason for withholding clearance.

Reviewed STORYBOARD.md SHA-256: `1e7d0d18862bb0e474cdc7db62743eefcdb905b8047388b0b7aba1bd685651d0`.

## Must-fixes before narration

### M1 — The student-facing “fair comparison” overstates the matching actually achieved

**Locations:** `AlginateBeadRig` tubes state; Beat 5 narration/actions 2–4 (lines 126–134); Beat 7 action 5; Dataset 2 (lines 257–261); associated scope and absolutes ledgers.

The starting aliquots are matched correctly: 2.0 cm³ of the same amylase stock goes into each preparation. But the free enzyme is made up to **4.0 cm³ of solution**, whereas the other preparation is **80 rinsed beads made from a nominal 4.0 cm³ mixture**. The latter is not a measured 4.0 cm³ aqueous reaction volume. Syringe residue is explicitly shown; the retained bead water and carried-over rinse liquid are not measured. Consequently, “made up with buffer to the same volume” and the tag “4.0 cm³ each side” promise more than the method establishes.

The author's own calculation also gives **0.714% starch in A**, but **1% initially in the liquid surrounding B's beads**. Equal volumes of the same added starch suspension do not establish equal starting reaction concentrations. Dataset 2 discloses this, expressly “not narrated”, while the student sees “same starch volume and concentration” in a fair-comparison checklist. This is the same underlying fault the sibling checks warned against: a qualified ledger cannot repair stronger teaching on screen.

The cleared plan asks for **comparable**, not necessarily identical, conditions and an honest comparison of **operational activities**. I am not demanding identical substrate concentrations throughout a bead, nor proof of equal retained active enzyme. The repair must make the actual comparison and its limits consistent across the method, narration, diagram and inference:

1. Distinguish the measured free-solution volume from the nominal bead-making input. Remove the claim that counting 80 beads measures the final aqueous volume. State how beads are drained and what liquid accompanies them; record the nominal/unknown quantities honestly in the one table.
2. Replace the checklist's concentration claim with **“same added starch suspension: 10.0 cm³ at 1%”**. Put the resulting dilution/distribution limitation into the student-facing explanation, with a corresponding highlight on the tubes. Merely leaving it in Dataset 2 is insufficient. If the method is revised to improve matching, re-derive every affected volume and concentration from that revised table.
3. Keep the measured endpoints and 1/t values explicitly as results for **these two preparations under the stated conditions**. Their ratio is not a measurement of the intrinsic activity of equal retained quantities of enzyme. Alongside diffusion and possible enzyme loss, acknowledge the concentration/volume limitation when discussing possible causes. Replace Beat 7's categorical bracket **“both lower the measured rate; this comparison alone does not tell them apart”** with **“possible contributions; this comparison alone does not separate their effects”**.
4. Preserve the equal-stock-input caveat, enzyme-free bead control, regular iodine sampling and separate reuse run. Show a brief instruction to repeat each preparation/comparison before drawing a general conclusion; no invented repeat results or statistics lesson is needed. Remap affected cues and update the spine and ledgers after the method/inference is settled.

The operational comparison can remain. What cannot remain is an unqualified impression of matched final volume/concentration followed by an explanation confined to two possible causes.

### M2 — One sampling interval is not evidence that a change is unresolvable

**Locations:** Beat 8 narration/action 4 (lines 172–181), Dataset 3, absolutes sweep.

“One sampling interval from the first run, too close to show a change” is not justified by the supplied observations. Let τ denote the underlying loss-of-blue-black threshold time, distinct from the recorded first-negative sample time:

- First use: **300 < τ₁ ≤ 330 s**.
- Second use: **330 < τ₂ ≤ 360 s**.

Those intervals are adjacent but **do not overlap**. At 330 s, the first run is yellow-brown and the second is still blue-black. There is an observed later endpoint; one pair of runs does not establish a repeatable change in activity. Sampling resolution and variation between runs are different limitations. Do not replace the present claim with a claim of proven enzyme deterioration either.

**Replace the complete Beat 8 narration with:**

> In a separate run, strain the beads out, rinse them and add fresh starch, something you cannot easily do with free enzyme. The starch is broken down again, with the endpoint at three hundred and sixty seconds: one sampling interval later than the first run. This shows re-use; repeated comparisons would be needed to establish a consistent change in activity.

Keep actions 1–3. In action 4, change the cue to **“one sampling interval later than the first run”** and the tag to **“recorded endpoint 30 s later”**. In action 5, cue the divider highlight on **“This shows re-use”**, then cue **“repeated comparisons would be needed”** to reveal **“repeat before concluding a consistent activity change”**; keep the reuse table separate. Remove “within one sampling interval” and “too close to show a change” from the display and ledger. Replace Dataset 3's inference with **“The recorded second-use endpoint is 30 s later. These adjacent threshold-time windows do not overlap; this one pair of runs demonstrates reuse but does not establish a consistent change in activity.”**

### M3 — The exam close permits bare text frames and an un-timed extra row

**Location:** Beat 12 actions 1–4 (lines 225–228).

The opening instruction is “a forms surface, plain”. The first specified apparatus inset does not appear until “product removed immediately”, and then only “flashes”. The bars likewise only flash later. Nothing commits the builder to keeping a diagram visible during the intervening citation/card frames. This fails this checking brief's explicit no-card-alone-on-a-bare-page requirement; a later final-frame diagram does not fix earlier frames.

**Required build instruction:**

> From the first frame of Beat 12 to its last frame, retain the familiar strainer, beads and collecting beaker at right, with the column alongside. The forms surface occupies the left only. At “product removed immediately”, highlight the column outlet and product flow; at “compare the measured activities”, highlight the existing free/bead bars. These are persistent visual anchors, not brief replacement flashes. Keep the reject card visibly marked as our authored wording contrast while its wrong line is visible, and end with the correct line prominent.

The material-properties row currently appears “directly after” another tab with **no separate cue** and no spoken guidance. Either give that row an explicit cue and enough anchored reading time, or omit it from the learner-facing close while retaining its verified quotation in the citation ledger. It is supplementary evidence, not an additional required syllabus list. Do not cram it in to preserve a nominal word count.

Keep the objectives on their own styled surface, as VIDEO-STRUCTURE requires; do not move them onto the unfamiliar lesson diagram. Specify their branded visual treatment rather than treating “no diagram” as permission for a bare page.

## Additional build clarifications

- **Product-inhibition inset, Beat 9:** the conditional narration and flow-through restriction are sound. Make the inset explicitly **“general example where product inhibition occurs; not a result of this amylase experiment”**. The miniature must not quietly establish an amylase-specific binding mechanism. Its current product-occupancy/substrate-waiting action also sits uneasily beside “how the product binds is not specified here”. Prefer accumulated product symbols and a slowed activity arrow, followed by product removal and recovery, without docking a product at a particular binding site. Keep the continuous-flow apparatus and closed-batch contrast.
- **Bead-making repeatability:** specify a chosen calcium chloride solution volume and measured rinse volume in Dataset 1; the 100 cm³ beaker capacity is not its fill volume, and “same rinse” alone does not specify the operation. Explicitly orient the syringe **tip down, plunger above**, rather than relying on “upright”. These are authored conditions, not Cambridge prescriptions.
- **Chemistry description:** the claim “no … atom labels” is inconsistent with the specified **Ca²⁺** labels. Say **“schematic calcium-ion cross-links; no atom-resolved covalent bond graph”**. This is a description correction, not a demand for a new reaction animation.
- **Callback absolute:** “the enzyme you could not get back” turns the hook's “hard to recover” into impossibility. The length ruling below takes the author's callback cut, removing this problem. If retained instead, use **“the enzyme you wanted to get back”** and remap the cue.

## Verification record

### Scope, science and sibling consistency

The 3.2.4 quotation exactly matches the supplied syllabus detail, p.20. Both commands are addressed: bead preparation and a free-versus-immobilised activity investigation, followed by advantages at **state** strength. The investigation's qualification problem is M1; there is no missing advantage. Separation/reuse, continuous processing, possible operational stability, and conditional reduction of product inhibition through product-removing flow are present. A lower rate and a wider operating range are not promised. No other immobilisation method, industrial catalogue, extra inhibition class or kinetic derivation is introduced.

I read the full lesson standard, plan and weights, the three named evidence documents, both cleared sibling storyboards and both rounds of their check reports, and the shared specifications and summary. The same local-versus-general discipline applies here. “The gel alone did not clear it” is correctly bounded to this run and 600 s. The enzyme-retention warning is substantive and must remain. The plan's separation/product-contamination advantage is retained at its prescribed statement strength; it is not laboratory evidence that this preparation has zero leakage during use.

`EnzymeActiveSiteModel` preserves the sibling silhouette, addressable `rest-lk`, `bound` and `products` states, full enzyme–substrate-complex label, schematic caption and approach/seating/release motion. `RateGraph` correctly uses two categorical bars with **1/endpoint time / s⁻¹**, not the sibling initial-rate/substrate-concentration curve. No Vmax/Km inference is made. `EnergyProfileGraph` is not used and need not be inserted. The iodine sampler and labelled recalls to 3.1.3, 3.2.1 and 3.2.2-3 are consistent with the supplied contracts. Matching 3.1.3's 150 s example is explicitly an authored choice, not a claim of identical experimental conditions.

The author's summary is supported on the equal nominal input, separate reuse run, conditional stability and flow-through wording. Its claim that the starch limitation is “disclosed” is true only of the author notes, not the teaching, and its reuse-resolution inference does not pass M2. Validator success cannot establish those scientific claims.

### Numbers re-derived

| Item | Independent calculation and ruling |
|---|---|
| Bead-making input | 2.0 + 2.0 = **4.0 cm³** for each starting mixture. Nominal mixture per bead 4/80 = **0.050 cm³**; nominal stock per enzyme bead 2/80 = **0.025 cm³**. Correct as input bookkeeping, not retained-volume measurements. |
| Free preparation after starch addition | 2.0 + 2.0 + 10.0 = **14.0 cm³**; starch 10 × 1% / 14 = **0.714285…%**, rounded **0.71%**. Correct. B/C's approximately 14 cm³ is only a nominal bead-plus-liquid volume, subject to M1. |
| Free endpoint | First Y at **150 s**, preceding B at **120 s**. 1/150 = **0.006666… s⁻¹ → 0.0067**. Threshold-time reciprocal interval **[1/150, 1/120)**, approximately **[0.0067, 0.0083)**. |
| Bead endpoint | First Y at **330 s**, preceding B at **300 s**. 1/330 = **0.003030… s⁻¹ → 0.0030**. Reciprocal interval **[1/330, 1/300)**, approximately **[0.0030, 0.0033)**. |
| Bead/free proxy ratio | (1/330)/(1/150) = 150/330 = **0.454545… ≈ 0.45**. “A little under half” is correct for the recorded proxies. Calculate from unrounded values; the rounded display 0.0030/0.0067 ≈ 0.45 is also appropriate. |
| Control | Still B at every sample through **600 s = 10 min**. No endpoint recorded, hence no calculated proxy and no zero-height rate bar. If a later endpoint exists, its reciprocal is **<1/600 = 0.001666… s⁻¹**, rounded bound approximately **0.0017**. |
| Reuse | First Y at **360 s**; 1/360 = **0.002777… s⁻¹ → 0.0028**. Recorded endpoint difference **360 − 330 = 30 s**. Arithmetic passes; inference fails M2. |
| Schedules and apparatus numbers | 10 min equilibration/hardening = **600 s**; 30 s sampling; 10 s stagger gives separate tube schedules at offsets 0/10/20 s. Volumes, 2% alginate stock, 1.5% calcium chloride, 1% added starch, pH 7.0, 30 °C, approximately 10 cm drop height and 80 counted beads are declared illustrative conditions/observations, not derived Cambridge values. |

The free/bead sampling windows are well separated. That establishes a difference between these recorded runs beyond their sampling interval; it does not repair concentration matching or prove its cause. The thin graph brackets should be labelled **sampling-resolution bounds**, not repeat variability or confidence intervals. No gradients, calibration values or initial rates are claimed in this lesson.

### Chemistry, physical handling and colours

No formula reaction or atom-resolved covalent exchange is shown. The schematic substrate/product silhouettes are consistent with the cleared sibling's symbolic model; the optional atom-resolved `Hydrolyse` replay is not required merely because products leave a cleft. There is therefore no new edge list or valence audit to perform. Calcium-ion gel cross-linking is schematic, not a drawn covalent mechanism. Do not introduce bond deletion/morphing during the build without the full inherited one-frame net-reaction contract.

Bead preparation has the correct direction: **amylase plus sodium alginate drops into calcium chloride**, with reagents and apparatus named where they sit. Pouring specifies approximately 120°, mouth below base, lip-origin streams and level liquid; rinsing and sampling nozzles stay above the receiving objects; the reaction tubes are supported in the water-bath rack. The reuse run retrieves/rinses the same beads and adds fresh substrate separately. No unsupported heated-tube hand movement is specified. These pass at storyboard level, subject to the repeatability/orientation clarifications above; no render exists to inspect.

The liquid/gel drawings do not invent a reaction colour. Iodine results switch in one frame between blue-black and yellow-brown, explicitly iodine's own colour; no RGB intermediate or colourless endpoint is specified. Each well represents a fresh timed sample, not a continuously monitored quantitative concentration reading.

### Error treatment, cues and full shape

The plan allocates **zero error beats** to 3.2.4. None has been invented, and no protected error treatment is being cut. The single closing reject card is correctly captioned as our own contrast, without a false COMMON MISTAKE or EXAM CONTRAST evidence claim. Its wrong proposition is written, never voiced as fact. A five-move examiner-error sequence is therefore not missing; the required card/visual treatment is covered by M3.

The read-only validator reproduces **115 exact, unique, ordered cues; zero failing beats**. Independent narration extraction reproduces all per-beat counts. Sampled against their actions: Beat 3 has 16 cues/max gap 11 words; Beat 6 has 12/15; Beat 7 has 9/14; Beat 8 has 11/10; Beat 12 has 10/13. Across all beats the maximum gap is **19 words**. These lexical checks pass but do not validate the uncued material-properties row or bare-frame risk.

Hook/context, separate objectives, explanation, statement construction, in-place recap and evidence-based exam close are all present. Narration generally speaks to the student and develops a connected practical sequence. The recap retains the familiar rig, sampling rows, bars and column. Preserve that full shape through the repairs.

## Quotation verification — text to text only

No exam PDF was available or opened. Findings below establish agreement with the authorised, previously verified register, not a fresh PDF verification. Wording was independently checked with whitespace normalised and without silently paraphrasing source words; paper/session/question/page were checked in their register entries.

| Quotation/source | Result |
|---|---|
| Full 3.2.4 outcome; 2025–2027 syllabus p.20; “investigate” and “state” | **VERIFIED**, syllabus detail, outcome 3.2.4. |
| “materials for preparing immobilised enzymes: calcium chloride, sodium alginate”; syllabus p.58 | **VERIFIED**, syllabus detail, materials list p.58. |
| “products and enzyme kept separated / AW ; product removed immediately ;”; Specimen 2022 Paper 2 Q3(b)(ii), MS p.12 | **VERIFIED**, plan §3.2.4, exact mark-scheme keys. |
| “inert / unreactive / cannot be digested by lactase / AW ; non-toxic ; insoluble ; long shelf-life ;”; Specimen 2022 Paper 2 Q3(b)(iii), MS p.12 | **VERIFIED**, same plan entry. This is material-property evidence, not a new generic advantage list. |
| “Lipase was immobilised in alginate beads”; November 2020 Paper 21 Q2(b), QP p.6 | **VERIFIED**, plan §3.2.4. Context only; no separate immobilisation mark. |
| Quoted planning statements about sampled marks, no selected error beat, closed-batch product removal and unproven retained active enzyme | **VERIFIED** against the plan, correctly identified as planning text rather than Cambridge testimony. |
| Canonical rate explanation | Matches SHARED-SPECS §4 after removing Markdown quote formatting; correctly labelled authored wording, not a Cambridge quotation. |

**Unverified quotations actually used: none.** The supplied quote script currently reports **18 distinct double-quoted strings, 0 not found**, rather than the pasted 17; it skips short terms and does not verify attribution, so its success is corroboration only.

Retain the explicit **UNVERIFIED** status for the specimen Q3(b)(ii)/(iii) question wording and arrangement, the Learner Guide p.18 wording, and W20/21 Q2(b)'s wider wording. Those missing passages are not reproduced. The weights support specimen Q3(a)–(c)'s aggregate QP location pp.8–9, not a fresh verification of each subpart's exact page. No fabricated question or examiner diagnosis is needed to complete this lesson.

## Length ruling

Independent speech counts by beat: **60, 38, 84, 49, 68, 91, 80, 57, 80, 62, 49, 70**. Total **788 words / 120 wpm = 6:34**, **34 s / 68 words over** the 6:00 plan. All of this is teaching/framing, because there are no allocated error beats. Use the agreed effective final-video rate; do not double-add ordinary holds or speed the narration.

| Author's ordered cut | Ruling |
|---|---|
| 1. Replace Beat 10's spoken statements with a six-second silent read | **DO NOT TAKE AS WRITTEN.** The clause-by-clause expression has a distinct teaching purpose. Six seconds is not a credible sole reading window for the full approximately sixty-word statement, even with the apparatus present. Retain the staged expression; a properly timed redesign can remove repetition, but cannot simply shift it into unreadable text. |
| 2. Remove the Beat 12 hook callback | **TAKE.** The recovery has already been demonstrated. Keep the final strainer/product image. The actual saving is **17 words**, and the cut removes the “could not get back” overclaim. |
| 3. Remove “for the next batch” from Beat 1 | **TAKE**, saving **4 words**. Keep the recovery problem and bead solution. Remap the visual cue to **“hard to recover”**. |
| 4. Remove “iodine's own colour” | **KEEP.** It usefully prevents the colourless-endpoint misconception; three words are not the source of the overrun. |
| 5. Remove “with no needle” from speech | **KEEP.** It supports physically clear bead-making instructions at a cost of three words. |

Cuts 2 and 3 alone yield **767 words = 6:23.5**, before the required scientific repairs. Accept that modest residual teaching overrun rather than strip the method, honest-inference explanation or full lesson shape. Recount after re-authoring; this is not clearance of an unknown final duration. The author's five proposed cuts total approximately 64 words under the stated wording, not a guaranteed return to 720 words. No error beat may be thinned for time.
