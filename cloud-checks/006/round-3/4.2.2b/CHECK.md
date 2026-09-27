# 4.2.2b — round-three regression check

Reviewed 27 September 2026 at `224cca1b`. Read my complete round-two CHECK.md, the current storyboard and `work/006/FIXES-round-2.md`. The template's reference to a “round-1 report” is followed by a round-2 path and the requirement to assess round-two items; this report uses that specified round-two baseline.

**No regression: the storyboard is byte-for-byte identical to the version cleared in round two.** Current and `e3e3ebd1` SHA-256 both equal `3909c4c67a57a0f78f279780fe8e19d3e1589d58bcb6ecd16c9befbdd1aee45d`. There were no outstanding textual fixes in that report.

## Round-two items retained

FIXED below means the correction verified in round two remains present; no new edit was needed.

| Round-two item / carried-forward finding | Status | Current evidence |
|---|---|---|
| M1 — chronological removal schedule | FIXED | Beat 5 action 1 still ends 30-A/B/C at 30:00/31:00/32:00, then 70-A/B/C at 33:00/34:00/35:00. Each tube gets 30 minutes against one clock, without reversal or reset. |
| M1 — finite batch handling | FIXED | BeetrootRig still defines nominal onset by first-disc contact, consistent prompt loading/removal and non-simultaneous contact of all ten discs. Hot tubes use holders. |
| M2 — compartment topology | FIXED | Enlarged bilayer remains cell surface membrane only; whole-cell thumbnail separately shows vacuolar sap → tonoplast → cytoplasm → cell surface membrane → external water, with both crossings labelled. |
| M3 — question-specific close | FIXED | Beat 10 retains turnip/distilled water, 10–50 °C, six of nine alternatives, selected optional points and different blocks **with a mean**. The onion point remains differing water potentials. The two-temperature beetroot design is not invalidated by the paper's separate range requirement. |
| SF1 — stock concentration | FIXED | Beat 7 still says stock **concentration**, with 1.0 mol dm⁻³ and the explicit distinction from conditions at every cell. |
| SF2 — pH limitation | FIXED | Real-world table and interpretation 3 retain unmeasured final pH and pigment stability as limitations; one water stock is not claimed to prove equal pH. |
| SF3 — standards preparation | FIXED | Beat 5 action 4 retains crushing, filtration and measured dilution with labelled apparatus. |
| SF4 — ordinal results | FIXED | Observed category spans 1–2 and 4–5 remain; unequal dilution steps are disclosed and no concentration or arithmetic mean is inferred from ordinal labels. |
| SF5 — onion clock | FIXED | Beat 7 holds the front short of the tissue until first contact and clock start occur on the same frame. Different cells' contact times remain disclosed. |
| SF5 — final hold | FIXED | Beat 10 and the runtime ledger reserve the two-second hold within the effective allowance unless separately declared in the edit. |
| Citation resolutions | FIXED | M24 descriptions remain checked paraphrases with question-specific provenance; no direct red-onion-plasmolysis question or archive-wide absence is invented. |
| Runtime / protected teaching | FIXED | 955-word ledger, accepted overrun, coverslip instruction and optional-colorimeter explanation remain. No new cut or accelerated delivery is requested. |

## Shared-model and content regression audit

The owner lesson **4.2.6** has changed since round two, so unchanged consumer bytes alone were not treated as sufficient. Its current state table still defines `plant-turgid-equilibrium` as an exact compatibility alias of canonical `plant-turgid`: matching geometry, equal average two-way crossings, equal water potentials and no net arrow. Its revised heading now distinguishes initial conditions from current states. `plant-flaccid` and `plant-plasmolysed` still describe ongoing loss, a fixed wall and external solution entering the gap. These remain compatible with this lesson's water-mount and subsequent sucrose sequence. The owner's new holds and micrograph note do not alter the imported model states. `work/006/SHARED-SPECS.md` is unchanged from the cleared baseline.

No changed lesson text exists to introduce a new quotation, invented reading, estimated-as-observed value, handling error, text-only entrance, contradictory animation/equilibrium state or unbounded real-world exam extension. Rereading confirms the preserved distinctions: illustrative colour scores/cell counts versus calculations, blank-zero 0.00 versus an absorbance sample reading, tonoplast versus cell surface membrane, and credited answer rows before the labelled beyond-scheme panel. No new past-paper quotation requires verification; the unchanged M24/52 citations retain the direct PDF verification recorded in round two (QP pp4–7; MS pp5–7).

Fresh `python3 -B work/006/validate_storyboard.py storyboards/topic-04/4.2.2b/STORYBOARD.md` passes: **955 words, 118 cues, 10 beats, 0 failures**, maximum gap **25 words**, no missing-section/citation warnings. Runtime remains **7:57.5** against 7:30, accepted as before. No replacement wording is required.

The real onion micrograph remains a disclosed unsourced production dependency; the current field is explicitly drawn. This clearance does not certify future photographs, bench measurements, measured audio or rendered handling. Only this report was written; no storyboard was edited or committed.

CLEARED
