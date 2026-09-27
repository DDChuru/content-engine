# Round 3 — 4.2.1b — CLEARED

Checked 27 September 2026 against the complete local round-two CHECK, revised STORYBOARD, `work/006/FIXES-round-2.md` and the diff from the previously reviewed commit. Workspace HEAD: `224cca1b843264bbfceedfcd27b2fd4a79166c06`. Reviewed STORYBOARD SHA-256: `23ad6ff31bed4f280066644850fdb30ad7ab7b8c6e3a4943f9c8264c29f7bcc8`.

## Every round-two item

| Item | Status | Evidence |
|---|---|---|
| A — hook count convention | **FIXED** | Beat 1 action 1 pauses the approaching ion outside. The 3 outside/10 inside reveal contains no crossing; Beat 5 performs the single inward transfer to 2/11. Dataset agrees. |
| A — root-hair replay reset | **FIXED** | Beat 13 action 6 explicitly labels the panel entry `replay: example restarted`, shows 3/10 and transfers one ion to 2/11 on release at “against their concentration gradient”. Equal-volume windows and generic-transporter guard remain. |
| B — energy annotation after ATP consumption | **FIXED** | Beat 6 action 7 highlights the persistent ATP-use caption and fills difference 2; it explicitly forbids restoring the consumed ATP token or starting another cycle. |
| Runtime ruling | **FIXED / retained** | Narration and both error beats are unchanged. The previously accepted overrun remains accepted. Schedule the existing final two-second hold within available visual time, or use the conservative total **11:30** (11:20 plus two four-second reads plus final hold). This report declares that total; no narration cut is required. |

## Earlier fixes retained

All items that round two marked fixed remain fixed: M1 hydrolysis/conformation start on the same frame and single-cycle/replay conservation; M2 separate concentration and water-potential equilibrium with continuing crossings; M3 describe-versus-name tariff and beyond-scheme root callback; M4 first-frame objective pictograms; S1 equal-volume windows; S2 vesicle leaflet orientation; S3 bounded carrier-capacity caption; S4 current-tab prominence/retained adaptation caption; S5 resolved evidence register. The relevant model, beat, dataset and citation instructions remain present. Rendered legibility and membrane continuity remain normal build checks, not inspected footage.

## Fresh validation and changed-text scan

Command: `python3 work/006/validate_storyboard.py storyboards/topic-04/4.2.1b/STORYBOARD.md`.

**13 beats; 1,360 words; 165 recognised cues; maximum gap 20 words; zero failing beats; 11:20 at 120 effective wpm.** E47 and E46 each remain 139 words and 73.5 seconds under the conservative read-inclusive convention, with all five error moves and truthful COMMON MISTAKE badges. Do not double-count silent reads against the effective-rate convention.

The inserted curly-quoted cue in Beat 13 is outside the validator's cue syntax, so its semantics were checked manually. It identifies the same final uptake event as the existing italic cue, not a second crossing: one ion, 3/10 → 2/11. The two Beat 1 count-reveal instructions likewise describe one reveal. Spoken order is respiration then uptake; the count instruction does not reverse that order.

No new quotation was introduced; unchanged QP/MS/ER wording retains the original-PDF verification recorded in rounds one and two. The revision introduces no new biology, measured data, practical handling, equilibrium claim or text-only frame. Models remain schematic and the real-world root example remains bounded and separated from the credited exam answer.

No outstanding replacement wording is required. Only this CHECK was written for this code; storyboard unchanged, no commit, push or deployment.

CLEARED
