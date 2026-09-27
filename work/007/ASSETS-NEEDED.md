# Topic 5 — open image assets (cloud run 007)

Created in response to the round-1 README (`cloud-checks/007/round-1/README.md`): we hold **no** real
photomicrograph and describe none as if we did. Each needed image is an open asset. The conductor sources a
licensed image (preferred and, for 5.2.2, required by the plan check's MF4 and the 5.2.2 check's M2), or
approves a labelled drawing for a named frame, after which that frame is re-checked. Storyboard text says
*the image*, so it stays valid either way. No other lesson (5.1.1–5.1.6) needs an image asset.

For every asset record: source URL or archive identifier, reuse licence, organism, stain/preparation,
magnification, crop, and the pixel coordinates of every cell a beat rings or names. Image pixels stay static;
only annotations animate. The colour reference for the 5.2.2 demonstration must be an actual toluidine-blue
preparation.

Also open (not an image): the Topic 1 light-microscope component's registered name and handling spec
(5.2.2), and the Topic 1 cell-structure/nucleolus model name (5.2.1).

## 5.2.1

We hold no image for this lesson and describe no specific photograph. The asset below is a requirement, not a description of an image we have.

| Image id | What it must show | Stage(s) | Magnification | Stain | Organism | How the storyboard uses it | Fallback |
|---|---|---|---|---|---|---|---|
| `IMG-5.2.1-01` | A light photomicrograph of a stained root-tip (meristem) preparation, one field with several clearly visible interphase nuclei (stained chromatin) and several cells with darker condensed chromosomes in division; ideally three clear examples of each. Supply with: source URL or archive identifier, reuse licence, organism, preparation and stain metadata, the crop used, and the pixel coordinates of the interphase nuclei and dividing cells to be ringed. | Interphase plus any mitotic stages (no stage is named on it in 5.2.1; identification belongs to 5.2.2) | Light microscope; low-to-medium power field (for example ×100–×400 total), whole cells visible; record the actual value | A chromatin/DNA stain (for example toluidine blue, acetic orcein or Feulgen); record the actual stain; colours described only as they appear | Any plant root tip commonly used (for example onion *Allium cepa* or garlic); record the actual organism | Beat 1: fills the right half at *This image shows a stained root tip*; rings on the selected interphase nuclei (*chromatin stained*) and selected dividing cells (*condensed chromosomes*); *identification: 5.2.2* tag. Beat 13: returns as a small inset at *that growing root tip*. Static throughout; only annotations animate. Match the number and positions of rings to the image; if three clear examples of each are unavailable, reduce the rings and revise the cue. | Conductor-approved labelled drawing of a stained root-tip field (captioned *labelled drawing of a stained root tip*). Never generated microscopy; never the 2n = 4 schematic. Narration and on-screen text say *the image* and name no stain, organism or magnification, so they stay valid either way. |

Production clearance of 5.2.1 depends on this asset (round-1 check M3).

## 5.2.2

Source: `storyboards/topic-05/5.2.2/STORYBOARD.md` (`PhotomicrographPanel`), round-1 check M2 and the round-1 README. For the conductor to merge into `work/007/ASSETS-NEEDED.md`. None of these images is held. None may be generated. Default: a licensed real photomicrograph. Fallback (conductor approval only): an approved labelled drawing, captioned *labelled drawing — not a photomicrograph*; M2 is then re-ruled for that frame. For every attached image record: source URL or archive identifier, reuse licence, organism, stain/preparation, crop, and the exact cells used by each beat. Image pixels stay static; only annotations animate. If one field cannot supply all stages, use explicitly labelled separate fields from the documented set and update the cues.

Common requirements: root-tip squash, preferably garlic (*Allium sativum*); if another organism, the credit line names it and the narration's "garlic" is not attached to that image. Stain: **toluidine blue** (aqueous), the colour reference for the demonstrated SAPS protocol; if only another stain is available, Beat 8's colour clause is re-checked before audio.

| Image id | What it must show | Stage(s) | Magnification | Stain | Organism | How the storyboard uses it | Fallback |
|---|---|---|---|---|---|---|---|
| `PM-LOW` | a squash field with a region of small, densely packed meristem cells; cap/meristem labels only if a recognisable cap region is genuinely retained | mixed (mostly interphase) | low power (×4 or ×10 objective, about ×40–×100 total) | toluidine blue | garlic root tip preferred | Beat 8: scan box settles on the small meristem cells; Beat 16: recap thumbnail with *meristem: small cells, select here* | approved labelled drawing |
| `PM-HIGH` | meristem cells with visible cell boundaries; clearly resolved interphase nuclei (diffuse chromatin); at least one cell each of prophase, metaphase, anaphase and telophase (two reforming nuclei in one cell); dark-blue chromatin on a paler background; ideally one pale, detail-poor cell (Beat 12) | interphase, prophase, metaphase, anaphase, telophase | high power (×40 objective, about ×400 total) | toluidine blue | garlic root tip preferred | Beats 1, 8, 9 (boundaries traced, count tags 1/1/2, interphase and telophase cells ringed; cell plate traced only if actually resolved), 10, 12, 16, 17 | approved labelled drawing |
| `PM-PRO` | one prophase cell: condensed chromosomes dispersed through the nuclear region, not aligned | prophase | high power crop | toluidine blue | as `PM-HIGH` | Beats 10, 11, 16 | approved labelled drawing |
| `PM-MET` | one metaphase cell: chromosomes arranged at the equator (side view) | metaphase | high power crop | toluidine blue | as `PM-HIGH` | Beats 10 (equator line drawn), 11 (answer *metaphase — chromosomes across the equator*), 16, 17 | approved labelled drawing |
| `PM-MET-ANGLE` | a metaphase cell seen from another orientation, not a straight line | metaphase (alternate view) | high power crop | toluidine blue | as `PM-HIGH` | Beat 10: *metaphase seen from another angle: not a straight line* | approved labelled drawing |
| `PM-ANA` | one anaphase cell: two separated groups of condensed daughter chromosomes towards opposite poles | anaphase | high power crop | toluidine blue | as `PM-HIGH` | Beats 10 (two groups ringed, drawn arrows only), 11, 16, 17 (hook callback) | approved labelled drawing |
| `PM-TEL` | one undivided telophase cell with two reforming nuclei (decondensing chromosomes) within one boundary; cell plate only if resolved | telophase | high power crop | toluidine blue | as `PM-HIGH` | Beats 11, 16 | approved labelled drawing |
| `PM-UNCLEAR` | a cell that cannot be identified with justification (overlapping cells, or out of focus) | not identifiable | high power crop | toluidine blue | as `PM-HIGH` | Beat 12: answer *cannot be identified with justification: overlapping cells* | approved labelled drawing |
| `PM-HIGH` detail-poor cell (or crop `PM-PALE`) | one pale, detail-poor cell with no chromosomes visible; identify its position in `PM-HIGH`, or supply a separate crop from the documented set | uncertain (not proof of interphase) | high power | toluidine blue | as `PM-HIGH` | Beat 12: ghost label *interphase* struck through, *not enough evidence* | approved labelled drawing |

Also open (not images): the Topic 1 light-microscope component's registered name and handling spec, and its implementation check (Beat 8).
