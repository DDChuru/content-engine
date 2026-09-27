# Round 2 — 4.2.1b — CLEARED WITH MINOR EDITS

Checked 27 September 2026 against the complete round-one report, revised storyboard, `work/006/FIXES-round-1.md`, shared contracts and the round-one-to-current diff. All four round-one must-fixes are implemented. The remaining edits clarify small replay/annotation details; they do not require a new explanation or error beat.

Workspace HEAD: `e3e3ebd17221eb90b547bea728a755ff7700ef42`.
Reviewed STORYBOARD.md SHA-256: `cf60c3558244874c9c76fa04300200aeb01fdae7105a2cb694ed89f87198a39a`.
The version at `36594f9f` hashes to the exact round-one reviewed file, `85bcb57625df21cf9471a173283952fe5816d91c0604554e5415522afcabf47f`, so the comparison is against the correct draft.

## Every round-one item

| Item | Status | Evidence in the revised storyboard |
|---|---|---|
| M1 — ATP switch and conformational change share one start | **FIXED** | Beat 4 action 7 starts both at “ATP is hydrolysed to ADP and phosphate”; the later shape-change cue highlights the completed conformation and explicitly does not restart it. Bound ion remains attached during movement. |
| M1 — remove extra pump cycle; conserve replay particles | **FIXED** | Beat 4 action 9 now returns only the empty carrier and holds 3 outside/13 inside. Dataset agrees. Beat 6 starts from that state, finishes 2/14, and its repeated comparison explicitly restarts at 3/13 under “replay: example restarted”; passive comparison is 9/3 → 8/4 with the same restart rule. |
| M2 — diffusion versus osmosis equilibrium | **FIXED** | Beat 2 uses the exact replacement: concentrations equal for the diffusion models, water potentials equal for osmosis, continuing crossings both ways. Action 7 assigns each quantity to the proper panel. |
| M3 — describe engulfment versus name a process | **FIXED** | Beat 13 row 3 says “Describe engulfment / name a process”, identifies W22’s three-mark description/any-three rubric, and limits naming to one point. S23 and S21 naming tasks remain one mark each. E46 retains a sufficient macrophage description. The shorter spoken “name a bulk process” remains true of the two naming questions; the row no longer assigns three marks to naming. |
| M3 — root-hair exam callback | **FIXED** | Beat 13 speaks “The scheme does not need this example…” and puts RootHairScene on a dashed “beyond the mark scheme” panel, with no marking tick/MS tab. Comparison answer stays separately visible. Generic-transporter guard and Real-world samples ledger are updated. |
| M4 — objectives from the first frame | **FIXED** | Beat 3 opens with all three actual pictograms. Text slots are initially empty; text enters next to the already-visible icons. |
| S1 — concentration density, not whole-cell totals | **FIXED** | RootHairScene and Dataset specify equal-volume sampling windows and density proportional to concentration, explicitly rejecting whole-cell totals as the gradient criterion. |
| S2 — vesicle leaflet orientation | **FIXED** | Exocytosis model states outer heads face cytoplasm, inner heads face aqueous lumen, tails face one another. |
| S3 — bounded plateau caption | **FIXED** | Beat 7 action 7 says the plateau reflects limited carrier capacity **in this carrier-uptake model**, and does not establish ATP use by itself. |
| S4 — E46 readability | **FIXED at storyboard level** | Beat 11’s Production QA note retains the complete adaptation caption and gives only the current citation tab full prominence. Rendered legibility remains a build check; no render was supplied. |
| S5 — resolve eight evidence items | **FIXED** | All eight are recorded as resolved with provenance. Authored question/answer summaries remain explicitly authored; no paraphrase is promoted to Cambridge wording. |
| Runtime ruling | **FIXED** | Counts/windows updated; both 139-word error beats retained. Effective-rate and conservative read-inclusive estimates are distinguished. Former mandatory exam-close cut withdrawn; only optional genuine repetition cuts remain. |

## Minor edits before build

### A — Make the hook and root-hair reset obey the count convention

The repaired Beat 4/6 sequence is consistent. The unchanged hook still moves an ion inward before revealing the nominal start counts 3/10, and the revised Beat 13 restores 3/10 without its own restart label. These can be resolved locally without changing narration.

Replace Beat 1’s ion-entry instruction with:

> At “Ever wondered how a root hair cell”, let a violet ion approach the root-hair membrane and pause outside; it does not cross in this preview. At “more of some of them”, reveal the start counts 3 outside and 10 inside in the equal-volume sampling windows. Beat 5 performs the counted inward transfer, ending 2/11.

Add to Beat 13 action 6:

> On the root-hair panel’s entry, show “replay: example restarted” with 3 outside/10 inside. At “against their concentration gradient”, transfer one ion inward and update the counts to 2/11 on release. Keep the same equal-volume windows and generic-transporter guard.

These are caption/event clarifications, not permission for an unexplained particle reset in an otherwise continuous shot.

### B — Highlight the energy annotation after ATP has already been consumed

Beat 6 action 7 says the right panel’s “ATP token pulses”, but its preceding full cycle has switched that token to ADP + Pi and allowed the products to drift away. Replace that instruction with:

> At “active transport uses ATP from respiration”, highlight the persistent ATP-use caption and fill the difference-2 cell. Do not restore the consumed ATP token or start another transport cycle.

The reaction itself remains the corrected one-frame token switch. No chemical mechanism is added.

## Changed evidence recheck

Original PDFs were re-extracted with `pdftotext -layout`; paths are under `/home/dachu/sme-9700-archive/pastpapers/`. Unchanged ER quotations retain the independent round-one verification; this is a revision check, not a claim that every unchanged source was newly reread.

| Changed source text | Original PDF and result |
|---|---|
| W22 macrophage description and tariff | `2022/November/9700_w22_qp_23.pdf` p4 and `9700_w22_ms_23.pdf` p9: “Describe how macrophages engulf bacteria.” Three marks, any three of six points; naming phagocytosis/endocytosis is one. Energy/ATP is accepted while “active transport” is rejected. Revised row is accurate. |
| Newly recorded channel-context guidance | `2024/March/9700_m24_ms_22.pdf` p6, Q1(b)(ii): exact **“R if incorrect context of channel protein”** verified. One similarity/two differences, three marks. The authored contrast remains correctly labelled. |
| Newly recorded X question wording | `2023/June/9700_s23_qp_21.pdf` p3: exact **“Name the process that is occurring at X.”** verified. Plant-vacuole-development context matches the retained adaptation disclaimer. |

No new unsupported quotation or mark tariff was introduced. The corrected root-hair callback is clearly an additional example after the answer, satisfying the exam-close rule.

## Validator, timing and regression scan

Fresh command: `python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.1b/STORYBOARD.md`.

**13 beats; 1,360 words; 165 cues; maximum gap 20 words; zero failing beats.** Effective-rate estimate **11:20**; conservative estimate with both four-second reads **11:28**, versus 11:15 budget. **Accept the 13-second conservative overrun**, consistent with round one’s allowance for the exact repairs. The final two-second hold must be absorbed into scheduled visual time or declared separately (11:30 on that conservative convention); it is not a reason to trim either error beat.

E47 and E46 still contain all five moves and truthful COMMON MISTAKE badges. Each remains 139 words, 73.5 seconds including the read under the supplied validator convention. Actual audio and holds must preserve the explanation time; the validator does not measure the recording. Neither error’s substance was thinned.

The revised equilibrium language, counts, carrier-only comparison, saturation limit and vesicle orientation are sound. Graphs remain schematic, without fabricated readings; no laboratory handling or real-sample assay is introduced. Models remain visible beside cards and on objectives. No new substantive biology or scope defect was found. Rendered token continuity, membrane fusion and caption legibility remain normal build verification, not evidence already inspected here.

Only this round-two CHECK was written for this code. Storyboard unchanged; no commit, push or deployment.

CLEARED WITH MINOR EDITS
