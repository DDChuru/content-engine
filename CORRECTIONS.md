# Mechanics video corrections — audit and dispatch backlog

Audit date: 2026-09-19. Branch: `mission/video-corrections`. **This audit changed no compositions, audio, registry, app files or video masters and performed no video renders.** Separate branding work was committed as `4c7689f` during the audit; it is not part of this audit's changes or verification.

## Decision for Durai

**The 31 lessons are not visually consistent with one another. There are two dominant looks: 7 “measurement lab” lessons and 24 “charcoal + paper” lessons.** The first group has saturated cyan/amber, glow, instrument panels and Inter/monospace text; the second uses flat charcoal, sage emphasis, Arial, thin diagrams and handwritten working. This is a series-consistency problem before it is a light-versus-dark branding problem. It is not 31 unrelated designs, and the underlying content/working does not need rebuilding.

Count precisely: **4 distinct base-background variants; 9 exact `T` colour dictionaries; 2 dominant visual families.** Dictionary counts include an added caption/line/grid token or a different paper token, so they are not nine equally different looks. Hardcoded object colours and separate ink engines add local variations outside those dictionaries. No `#070b16` literal was found in the worktree Remotion source: the original brief's colour was approximate.

The actual liked worked-question video is **not all white**. At 12s and 45s it has a dark blue outer surround, large light ruled-paper teaching panels, blue handwriting, terracotta rings, consistent brand fonts and shaded spheres. The light website theme and graph-paper bookend are related but distinct references. Keep this distinction: forcing every lesson onto a white background is neither a one-token correction nor required by what Durai liked.

**Recommended order:** finish the recurring branding frame first without rebuilding lessons; then select one lesson at a time. Darken pale graph strokes first, establish an opt-in paint theme, and reuse existing diagram geometry. Defer the few actual illustration redraws until the affected lesson is chosen. All changes below are proposed briefs, not claims that Durai has approved a specific replacement colour or artwork.

## Evidence and coverage

- Read-only source masters: `/home/dachu/Documents/projects/content-engine/apps/student-learn/public/videos/`. These are gitignored main-tree artifacts; their absence from a worktree is expected, not a defect.
- Canonical scope: the 31 entries in `output/stem4life-lessons/verification.json`, not all 38 filenames indiscriminately. The extra 7 MP4s are `-fable` alternatives, not seven additional canonical lessons. All 31 original-master SHA-256 hashes match that manifest. All 31 primary composition files also match their main-tree counterparts at audit time.
- Source-version caveat: the shared `mechanics-m42/Ink.tsx` differs between trees: main has opt-in `horizontalScale`/`tracking` parameters used by the worked-question reference, while preserving legacy defaults. Presentation, brand palette/fonts and the two equilibrium ink modules match. Do not copy the newer question composition into this worktree and assume that its narrower handwriting API is already available, or retune existing lesson glyphs to imitate it.
- Extracted and visually inspected **124 original-master stills: four per canonical lesson, at 15%, 35%, 60% and 85% of duration**. Eight contact sheets were inspected, with individual enlargement for diagrams and a further native-resolution S.I. units frame at 82s. Original timestamps are listed below; none include bookends. A bookended lesson from the existing manifest adds 5s before the body; do not mix its clock with the original clock.
- Also inspected one 60%-duration still from each of the 7 fable MP4s. They use the charcoal/sage/paper family too, with some brown crate artwork. Eight fable composition sources exist and import `mechanics-m42/Presentation.tsx`; `MechanicsEnergyFable.tsx` has no corresponding MP4 among these 38. Do not claim it was visually verified.
- Reference inspected: `/home/dachu/Documents/projects/content-engine/output/stem4life-question/stem4life-question.mp4` at 12s and 45s; the paper `intro-c.mp4` at 4.2s; and the existing worktree S.I. units framing candidate at 40s, 95s and 160s. The candidate shows that a cream border alone leaves the original navy/cyan body intact.
- Local audit evidence, intentionally separate from the committed backlog: `review-audit-manifest.json`, `review-extract.py`, `review-supplement.py`, and `review-frames/review-sheet-01.jpg` through `review-sheet-08.jpg`, plus `review-fable-sheet.jpg` and `review-question-12s.png` / `review-question-45s.png`. These are review artifacts, not source assets or releases. The timestamps, source paths and observations in this document make the briefs usable without those local sheets.
- This is sampled visual inspection, not playback verification of every second, an audio audit, or a new mathematical validation. A half-written equation/empty panel at a narration cue is not treated as a defect. “Image candidate” means an observed aesthetic improvement opportunity, not certainty about which image Durai had in mind.

Reproduce any still without running Remotion (write the destination only in this worktree):

```bash
ffmpeg -nostdin -v error -ss 82 \
  -i /home/dachu/Documents/projects/content-engine/apps/student-learn/public/videos/mechanics-si-units.mp4 \
  -frames:v 1 -n review-si-units-82s.png
```

## Concrete token comparison

All relative composition paths below resolve under `packages/backend/src/remotion/compositions/`; `C/` means that exact prefix. Source line numbers are audit-time locators, supplemented by component names.

| Surface/role | Lab family | Charcoal/paper family | Light brand / approved-reference evidence |
|---|---|---|---|
| Main background | A1/A2 `#061522` → `#03101b` gradient; A3 `#06131d` → `#020b12`; A4 `#07141d` → `#020a10` | Flat `#171c20` | CSS light surface `#FFFFFF`, warm `#F6F3EB`; TikTok surround `#182230` → `#23354e` |
| Panels/paper | `#0d2536`, `#17384a`; cream `#fff8e8` (A3 ivory `#fff7e5`, A4 paper `#fffaf0`) | Paper `#f6f3eb`; grey-green captions/setup cards `#b9bcb2` | TikTok paper `#fdfcf7`; bookend C warm `#F6F3EB` |
| Body/diagram text | `#f8f3e7` on navy; `#102435` on cream (A3/A4 `#faf5e9`, `#102332`) | `#e9e7e0` on charcoal; `#273238` on paper | Brand text `#253247`; TikTok handwriting `#213b78` |
| Emphasis | Cyan `#42dbe8`, amber `#f4aa45`, green `#61d095`/`#68d391`, coral/red, sometimes purple `#b69cff` | Sage `#3f9e89`; most shared handwriting already `#213b78` | Terracotta `#B64A30` on light surfaces; peach `#FFAC8F` available on dark surfaces |
| Rules/background texture | Moving cyan grid, radial glows, luminous frame lines | Flat background; pale horizontal notebook rules `#c8cfca` | Bookend C square 48px grid, `#253247` at .055 opacity; TikTok horizontal 78px rules `#b9d3ee` at .38 opacity and red margin |
| Type | Inter + JetBrains Mono declarations | Arial + custom stroke handwriting | Manrope display + Source Sans 3 body, via `C/stem4life/fonts.ts`; handwriting remains drawn, not a font replacement |

Sources: `apps/student-learn/app/brand-tokens.css:10` (read only, has both light and dark themes); `C/stem4life/palette.ts:2`; `C/stem4life/Stem4LifeBookends.tsx:14` and `:20`; `C/mechanics-m42/Presentation.tsx:4`; `C/mechanics-m42/Ink.tsx:3`. The worked-question source is newer and absent from this worktree: read-only `/home/dachu/Documents/projects/content-engine/packages/backend/src/remotion/compositions/stem4life-question/Stem4LifeQuestion.tsx:7,37,62,179`. Its shaded spheres are SVG, not a photograph. Bookend A is white, B is dark, C is warm graph paper: do not describe all existing bookends as light.

The pale graph-stroke finding is supported by the source colours, not only taste: opaque cyan `#42dbe8` against cream `#fff8e8` has a calculated sRGB luminance contrast of **1.58:1**; amber `#f4aa45` is **1.86:1**. Blue `#213b78` against proposed paper `#fdfcf7` is **10.42:1**, terracotta `#B64A30` is **5.10:1**. These are token-pair calculations, not measurements of every antialiased video pixel or a blanket accessibility certification. Grid/area fills should remain lighter than instructional strokes.

### Palette census: every canonical lesson is accounted for

Exact dictionary grouping uses colour key/value pairs in the effective top-level `T`, following the shared Presentation import. Font strings and hardcoded colours outside `T` are excluded from this particular count. This is a reproducible grouping, not a perceptual metric.

| Group | Count | Effective colour declaration | Difference that matters |
|---|---:|---|---|
| A1 | 2 | SIUnits:31, DerivedUnits:27 | Lab `#061522`; includes `moon` |
| A2 | 3 | ScalarsVectors:32, TypesOfForces:27, DisplacementTimeGraphs:33 | Same base; `purple` instead of `moon` |
| A3 | 1 | VelocityTimeGraphs:29 | `#06131d` base, different panels/ivory/teal/coral |
| A4 | 1 | DrawingTravelGraphs:33 | `#07141d` base plus separate paper/rule/margin/blueInk |
| B1 | 1 | ModellingAssumptions:21 | Charcoal, paper, line; no shared grid token |
| B2 | 1 | MultipleCollisions:22 | B1 plus caption |
| B3 | 20 | mechanics-m42/Presentation.tsx:4 | Shared charcoal/paper/sage/grid; separate blue ink implementation |
| B4 | 1 | EquilibriumIn1D:17 | Local charcoal/paper/caption, no line/grid |
| B5 | 1 | ForceDiagrams:7 | Local charcoal/sage; `paper` actually grey-green `#b9bcb2` |

Names in the declaration column abbreviate the full `Mechanics*.tsx` filenames used in the ledger and briefs below. Counts sum to 31 (7 A + 24 B). Twenty canonical consumers plus eight fable compositions share the Presentation module: a global default edit would exceed a one-lesson brief.

## Commercial routes: what avoids a full composition render?

| Route | What can be changed | Remotion body render? | Video re-encode? | Relative effort |
|---|---|---|---|---|
| N0 — reuse bookends | Swap/prepend/append **already rendered, correctly titled** matching clips | No | Body can remain stream-copied if stream signatures/timestamps match | Small; title variants not already rendered require rendering those short bookends only |
| N1 — frame/wordmark | Pad/scale the existing picture and composite a border/logo/footer using FFmpeg | No | **Yes, every affected video frame**; audio can be copied | Small/medium packaging work; not a lossless body change |
| N2 — player surround | Render brand chrome outside the video element | No | No | Cheapest persistent web treatment; dev-owned player integration, absent from downloads, picture-in-picture and native video-only fullscreen |
| P — paint | Tokens, SVG fills/strokes, panel colours, glow removal | **Yes** for the selected lesson or a carefully isolated scene | Yes | Usually 1–3 hours of local authoring/review; 3–6 hours for hardcoded multi-surface exceptions; render time extra |
| L — layout/type | Fonts, sizing, margins, label hierarchy, panel allocation | Yes | Yes | Usually 3–8 hours including fitting and cue checks; not a token-only task |
| D — redraw | New globe/vehicle/cyclist geometry or new object illustration | Yes | Yes | Roughly 4–12 hours per asset/scene family plus review; not measured quotations |

These are planning bands, not measured render or commercial prices. A gradient inside an existing sphere is P, not a redraw. Simple particles/force arrows are intentional teaching diagrams, not missing image assets. The inspected primary sources contain no `<Img>`/`<img>` or PNG/JPEG/WebP references: the visible candidate “images” are CSS/SVG drawings. A photo replacement would create new work unnecessarily.

A colour change cannot safely be applied to the flattened MP4 as a global replacement/LUT: identical colours appear in different teaching roles; antialiasing, gradients and transparency are baked in. Scene-only rendering/splicing may be feasible later, but is not promised: it needs exact frame boundaries, compatible streams and seam/audio checks. Default estimate is a selected-lesson render, not a series rebuild.

## Dispatch order and boundaries

1. **F01 first:** agree/package the recurring frame from existing candidates. Leave lesson bodies alone for now.
2. **When individual revisits begin:** L05, L06, L08 (pale graph strokes; high visual benefit at low art cost), then L01–L04 (lab-family branding). Treat the three graphs as separate jobs.
3. **F02 then L10 pilot:** opt-in shared paint support; proceed through the remaining B-family L entries one selected lesson at a time. L07, L09, L12, L15 are independent local implementations and do not need the shared migration.
4. **I01:** cheap sphere shading when Direct collisions is selected. **F03:** typography pilot only after paint/frame geometry is settled.
5. **I02–I04 last:** optional real redraws, commissioned only if the remaining visual gap justifies them. Do not blanket-redraw standard force diagrams.

Priority meanings: P1 = first visual corrections after the framing decision (not a claim of a mathematical failure); P2 = series identity/alignment; P3 = optional illustration polish. Confidence is high for observed source/frame differences; medium for subjective illustration recommendations. Each L entry is one lesson's **paint issue**, with redraw and typography explicitly separate.

For every future brief: keep narration files, transcript words, cues, holds, scene durations, order, 1920×1080 aspect ratio, all mathematics and instructional diagrams' meaning. Retain cue-specific DOM/data identifiers used by existing audits. Save candidate outputs in the mission worktree, never overwrite main-tree masters. Do not touch `apps/student-learn/convex/**`, `app/**`, `lib/**`, `middleware.ts`, notes index, `packages/backend/content-registry.json`, or `src/remotion/Root.tsx`. Use Node 22 (`export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"`); do not use port 3210; no deploy or push. Future rendering needs a separate implementation task: this audit authorises none.

Proposed common paint target for these briefs: preserve a dark brand surround `#182230`, use `#fdfcf7`/`#F6F3EB` for existing paper/cards, `#253247` for printed text on light surfaces, `#213b78` for working/primary graph strokes, `#B64A30` for emphasis on light surfaces and `#FFAC8F` for emphasis on dark surfaces. Keep light text on the dark surround. Do not replace every semantic force/series colour with one accent: retain labels, solid/dashed distinctions and a dark secondary colour where required. This is the closest low-redesign path to the actual liked reference; a full light teaching stage is a separate layout decision.

For acceptance of P/L/D work, compare original and candidate at each ledger timestamp, plus the relevant cue's before/during/settled frames and scene boundaries; inspect at native size and 960×540. Check complete words, formulas, label bounds, colour-role correspondence and timing. Preserve original duration/frame count and decoded narration alignment/content. Tests appropriate to the touched diagrams already exist under `packages/backend/src/scripts/`; run relevant existing checks, not a blanket rewrite of test artifacts. Do not declare acceptance from a source token check alone.

## Shared/frame briefs

### F01 — Reuse the branding-frame work without a body rebuild

- **Priority / confidence / route:** P1 / high / prefer N2 + N0 for web playback; N1 only when persistent branding must be inside the downloadable picture. No Remotion body render.
- **Files:** existing candidates `output/stem4life-inflight-branding/option-a-corner-bug.png`, `option-b-framed-page.png`, `option-c-header-rule.png` and their `sample-*.mp4` files; full candidate `FULL-si-units-option-b.mp4`. Brand artwork `C/stem4life/Artwork.tsx`, palette and fonts. **Concurrent branding work appeared during this audit:** `output/stem4life-branding-sample/README.md`, its `index.html` and MP4, `C/stem4life/LessonFrameBookends.tsx`, `packages/backend/src/remotion/index-stem4life-branding.tsx` and `packages/backend/src/scripts/verify-branding-sample.mjs`. These are that work's artifacts, untouched here; its verification claims were not independently re-run in this audit. Read `packages/backend/src/scripts/apply-stem4life-bookends.mjs` for the reusable mux approach, but do not blindly execute it: it also renders bookends and assumes a local master directory.
- **Wrong:** original bodies lack a consistent recurring brand frame. Existing light framing candidates improve identity but do not resolve the inner cyan/charcoal difference; the S.I. sample at 95s demonstrates that limit. A burnt-in footer would also introduce needless encoding cost if only web playback needs the branding.
- **Done:** review/reuse the existing branding sample and the treatment settled with Durai, rather than building a second frame tool. Keep its player rail outside the image; hand off production player integration as a brief to the dev owner because app edits are excluded from this lane. Verify a dense working frame from each family at the chosen displayed size. Confirm the title and intro/outro offsets for each selected lesson. Record that browser-only framing is absent from downloads/PiP/native video fullscreen; whole-frame fullscreen must be separately verified. If persistent downloadable branding is chosen, explicitly use N1, save a separate candidate and report the video re-encode. Do not label any candidate approved or auto-run all 31.
- **Must not change:** body content/timing, main-tree masters or another agent's in-progress files. No cropping/stretching, footer over equations, double bookends, or music over narration. For N2/N0, retain bit-identical body frames and narration with documented bookend offsets; for N1, retain timing/audio and disclose that video pixels are re-encoded. This audit does not approve or execute the concurrent branding work.

### F02 — Isolate shared paint before touching a single B3 lesson

- **Priority / confidence / route:** P2 prerequisite / high / P infrastructure, about 3–6 hours before the first selected-lesson render.
- **Files:** `C/mechanics-m42/Presentation.tsx:4,38,39,65,67`; proposed `C/mechanics-m42/brandTheme.ts` (new). Read `C/mechanics-m42/Ink.tsx:3` and `C/stem4life/palette.ts`; do not globally change their defaults.
- **Wrong:** 20 canonical and 8 fable composition sources import the same static theme/primitives. A direct default-token edit changes unrelated lessons on their next render. Local Paper/Caption implementations and hardcoded `#b9bcb2` also mean that editing `T` alone gives an incomplete migration.
- **Done:** add an explicit opt-in theme path for Lesson, Figure, Caption, Paper and related primitives, preserving the old default. Make surface-specific text/accent roles available to selected compositions and local SVG drawings. Do not migrate consumers in this brief; L10 is the first consumer brief. Prove existing callers retain legacy paint and ensure an opt-in caller can theme rings/captions/paper without changing timing or glyph paths. Include the hardcoded Caption/problem-card fills in the themed path.
- **Must not change:** default appearances of all current consumers, global Ink glyph data/scheduling, any lesson transcript/audio or renderer registration. No mass migration and no copying/replacing 20 lesson bodies.

### F03 — One typography pilot after paint and framing

- **Priority / confidence / route:** P2 / high / L, not a cheap colour swap.
- **Files:** `C/MechanicsSIUnits.tsx:47` and its SceneShell/card text; reuse `C/stem4life/fonts.ts`. App brand tokens are read-only reference.
- **Wrong:** S.I. uses Inter and JetBrains Mono declarations while the accepted worked-question reference uses Manrope/Source Sans 3; replacing font names without reflow would alter unit-chip and equation widths.
- **Done:** in S.I. only, use loaded brand display/body fonts for headings/prose, retain or explicitly fit tabular numerals/technical symbols where needed, and check every scene for clipping/wrapping at the selected frame inset. Record a repeatable typographic spec for later lesson briefs; do not bulk-change Arial in Presentation.
- **Must not change:** mathematical glyphs, superscripts, unit spacing/meaning, numeric alignment, custom handwriting, timings and other lessons. Preserve the teaching hierarchy even when the new font requires local fitting.

## Per-lesson evidence ledger

All times are seconds in the **original main-tree MP4**, filename `mechanics-<slug>.mp4`. “Paint” refers to the matching L brief below, not a render performed in this audit.

| Brief | Lesson slug | Family/dictionary | Inspected original times | Source file |
|---|---|---|---|---|
| L01 | si-units | A1 | 28.04, 65.42, 112.15, 158.88 | `C/MechanicsSIUnits.tsx` |
| L02 | scalars-vectors | A2 | 27.56, 64.30, 110.23, 156.16 | `C/MechanicsScalarsVectors.tsx` |
| L03 | derived-units | A1 | 26.41, 61.63, 105.65, 149.67 | `C/MechanicsDerivedUnits.tsx` |
| L04 | types-of-forces | A2 | 30.82, 71.91, 123.28, 174.64 | `C/MechanicsTypesOfForces.tsx` |
| L05 | displacement-time-graphs | A2 | 49.14, 114.66, 196.56, 278.46 | `C/MechanicsDisplacementTimeGraphs.tsx` |
| L06 | velocity-time-graphs | A3 | 25.66, 59.88, 102.66, 145.43 | `C/MechanicsVelocityTimeGraphs.tsx` |
| L07 | modelling-assumptions | B1 | 41.56, 96.97, 166.23, 235.50 | `C/MechanicsModellingAssumptions.tsx` |
| L08 | drawing-travel-graphs | A4 | 57.65, 134.53, 230.62, 326.71 | `C/MechanicsDrawingTravelGraphs.tsx` |
| L09 | multiple-collisions | B2 | 60.06, 140.13, 240.23, 340.33 | `C/MechanicsMultipleCollisions.tsx` |
| L10 | using-calculus-in-1d | B3 | 52.42, 122.31, 209.68, 297.04 | `C/MechanicsUsingCalculusIn1D.tsx` |
| L11 | deriving-suvat | B3 | 50.48, 117.78, 201.91, 286.04 | `C/MechanicsDerivingSuvat.tsx` |
| L12 | equilibrium-in-1d | B4 | 40.07, 93.51, 160.29, 227.08 | `C/MechanicsEquilibriumIn1D.tsx` |
| L13 | acceleration-due-to-gravity | B3 | 55.04, 128.43, 220.17, 311.91 | `C/MechanicsAccelerationDueToGravity.tsx` |
| L14 | suvat-in-1d | B3 | 50.41, 117.63, 201.65, 285.67 | `C/MechanicsSuvatIn1D.tsx` |
| L15 | force-diagrams | B5 | 53.25, 124.26, 213.02, 301.77 | `C/MechanicsForceDiagrams.tsx` |
| L16 | equilibrium-in-2d | B3 | 44.47, 103.76, 177.87, 251.98 | `C/MechanicsEquilibriumIn2D.tsx` |
| L17 | f-equals-ma | B3 | 49.19, 114.79, 196.77, 278.76 | `C/MechanicsFEqualsMa.tsx` |
| L18 | connected-bodies-ropes-and-tow-bars | B3 | 54.70, 127.64, 218.82, 309.99 | `C/MechanicsConnectedBodiesRopesAndTowBars.tsx` |
| L19 | connected-bodies-lifts | B3 | 55.31, 129.05, 221.24, 313.42 | `C/MechanicsConnectedBodiesLifts.tsx` |
| L20 | connected-bodies-pulleys | B3 | 66.51, 155.19, 266.05, 376.90 | `C/MechanicsConnectedBodiesPulleys.tsx` |
| L21 | resolving-forces-and-inclined-planes | B3 | 59.08, 137.85, 236.31, 334.78 | `C/MechanicsResolvingForcesAndInclinedPlanes.tsx` |
| L22 | coefficient-of-friction | B3 | 68.15, 159.01, 272.59, 386.17 | `C/MechanicsCoefficientOfFriction.tsx` |
| L23 | coefficient-of-friction-f-equals-ma | B3 | 61.77, 144.14, 247.09, 350.05 | `C/MechanicsCoefficientOfFrictionFEqualsMa.tsx` |
| L24 | coefficient-of-friction-and-inclined-planes | B3 | 72.11, 168.26, 288.44, 408.62 | `C/MechanicsCoefficientOfFrictionAndInclinedPlanes.tsx` |
| L25 | coefficient-of-friction-harder-problems | B3 | 59.66, 139.21, 238.64, 338.07 | `C/MechanicsCoefficientOfFrictionHarderProblems.tsx` |
| L26 | work | B3 | 59.63, 139.14, 238.52, 337.90 | `C/MechanicsWork.tsx` |
| L27 | energy | B3 | 72.38, 168.88, 289.50, 410.12 | `C/MechanicsEnergy.tsx` |
| L28 | energy-principles | B3 | 73.14, 170.66, 292.56, 414.46 | `C/MechanicsEnergyPrinciples.tsx` |
| L29 | power | B3 | 69.37, 161.86, 277.48, 393.10 | `C/MechanicsPower.tsx` |
| L30 | momentum | B3 | 42.17, 98.40, 168.69, 238.98 | `C/MechanicsMomentum.tsx` |
| L31 | direct-collisions | B3 | 45.38, 105.88, 181.52, 257.15 | `C/MechanicsDirectCollisions.tsx` |

## Individual paint briefs

S = roughly 1–3 hours of authoring/review; M = roughly 3–6 hours; selected-lesson render/encode time extra. All are route P, so none can recolour an already encoded body losslessly. Shared-theme consumers require F02, but local T implementations do not.

### L01 — S.I. units for mechanics: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsSIUnits.tsx:31`.
- **Wrong / evidence:** Glowing cyan/amber lab shell, cream cards and coloured panels read as a different product from the later charcoal lessons. Inspected original `mechanics-si-units.mp4` at 28.04s, 65.42s, 112.15s, 158.88s.
- **Done:** Use the brand surround/paper roles; remove decorative cyan glow from SceneShell and card edges. Retain distinct length/time/mass identification with labels plus blue/terracotta/deep-green accents; include cardInk and hardcoded object colours in the review. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Length/time/mass categories, conversions, the mass-versus-weight comparison, and the different loaded/unloaded cart travel. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L02 — Scalars and vectors: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsScalarsVectors.tsx:32`.
- **Wrong / evidence:** Neon road/arrow colours and heavy lab chrome differ from both the quiet later lessons and the paper reference. Inspected original `mechanics-scalars-vectors.mp4` at 27.56s, 64.30s, 110.23s, 156.16s.
- **Done:** Repaint SceneShell, route, number line and cards. Map magnitude and direction to separately labelled colours; keep the return-to-start scene and vector arrows immediately distinguishable. Do not replace the Person artwork in this brief. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Route shape/length, signed direction, displacement versus distance, start/finish positions and arrowheads. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L03 — Derived units: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsDerivedUnits.tsx:27`.
- **Wrong / evidence:** Cyan machinery-style panel edges and amber unit tiles repeat the lab identity rather than the brand roles. Inspected original `mechanics-derived-units.mp4` at 26.41s, 61.63s, 105.65s, 149.67s.
- **Done:** Repaint the local T and SceneShell and the unit-assembly/conversion panels; remove decorative edge glow. Darken coloured text on paper, keeping numerator/denominator and squared conversion steps visually distinct. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Compound-unit assembly, factor application twice for squared units, all conversion values and force construction. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L04 — Types of force: align paint roles

- **Priority / confidence / cost:** P2 / high / P–M; selected-lesson composition render required later.
- **Files:** `C/MechanicsTypesOfForces.tsx:27`.
- **Wrong / evidence:** The glossy cyan platform and colour-coded friction/force panels are noticeably different from the restrained Force diagrams lesson. Inspected original `mechanics-types-of-forces.mp4` at 30.82s, 71.91s, 123.28s, 174.64s.
- **Done:** Repaint SceneShell and the local cards, platform, rough/smooth surface panels and force arrows. Keep colour correspondence between arrows and equation terms, using explicit labels; remove decorative glow, not the texture that distinguishes roughness. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Every force origin/direction and label; smooth versus rough, push versus pull, reaction/weight balance and the numerical resultant. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L05 — Displacement-time graphs: align paint roles

- **Priority / confidence / cost:** P1 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsDisplacementTimeGraphs.tsx:33`.
- **Wrong / evidence:** Cyan traces and amber horizontal segments are pale on cream graph cards; the three-card plot and final cyclist plot retain lab-coloured frames. Inspected original `mechanics-displacement-time-graphs.mp4` at 49.14s, 114.66s, 196.56s, 278.46s.
- **Done:** Use ink-blue main traces and terracotta emphasis on paper, with deep green for a required third series and muted rules behind them. Repaint GraphAxes, cards and SceneShell together. Keep matching colours in legends, track dots and slope constructions. Inspect at 960×540 as well as native size. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** All graph coordinates, axes, time ticks, tangents, signed gradients, turn/stop times and distance/displacement results. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L06 — Velocity-time graphs: align paint roles

- **Priority / confidence / cost:** P1 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsVelocityTimeGraphs.tsx:29`.
- **Wrong / evidence:** The cyan line and amber rise/run triangle are low-contrast on ivory; navy dashboard/dial chrome is a third exact base palette. Inspected original `mechanics-velocity-time-graphs.mp4` at 25.66s, 59.88s, 102.66s, 145.43s.
- **Done:** Darken the curve and triangle using blue/terracotta strokes; keep area fills translucent with distinct positive/negative outlines or hatching. Repaint the dial, road and SceneShell with brand roles, retaining numeric sign cues. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Curve geometry, area integrals, below-axis sign, signed displacement versus total distance, road motion and meter values. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L07 — Modelling assumptions: align paint roles

- **Priority / confidence / cost:** P2 / high / P–M; selected-lesson composition render required later.
- **Files:** `C/MechanicsModellingAssumptions.tsx:21`.
- **Wrong / evidence:** Flat charcoal, grey-green captions and very thin outline apparatus differ sharply from the preceding graph lesson; handwriting is dark grey rather than the reference blue. Inspected original `mechanics-modelling-assumptions.mp4` at 41.56s, 96.97s, 166.23s, 235.50s.
- **Done:** Repaint local T, Card, Paper, System and the local InkPlayback colour roles. Use brand-blue working on paper and terracotta spoken emphasis; increase only secondary apparatus line visibility where the sampled falling-stone/pulley scenes need it. Do not redesign the modelling symbols. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Real system to idealised particle transitions, assumption labels, falling-stone equation/height curve, rig geometry and the hand-drawn stroke schedule. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L08 — Drawing travel graphs: align paint roles

- **Priority / confidence / cost:** P1 / high / P–M; selected-lesson composition render required later.
- **Files:** `C/MechanicsDrawingTravelGraphs.tsx:33`.
- **Wrong / evidence:** Two bright graph cards plus cyan/amber connectors compete with the working sheet; this lesson has its own navy/paper/rule palette. Inspected original `mechanics-drawing-travel-graphs.mp4` at 57.65s, 134.53s, 230.62s, 326.71s.
- **Done:** Repaint graph strokes, connectors and PaperRules paper with brand roles; remove ambient glow. Darken thin curve/gradient marks on paper, keeping gradient and signed area independently identifiable. Include the hardcoded lift-shaft fill and blue-ink paper border. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Paired s–t/v–t synchronisation, lift/ball/cyclist coordinates, signed areas, shared time gates, holds and handwritten derivations. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L09 — Multiple collisions: align paint roles

- **Priority / confidence / cost:** P2 / high / P–M; selected-lesson composition render required later.
- **Files:** `C/MechanicsMultipleCollisions.tsx:22`.
- **Wrong / evidence:** The charcoal shell and grey-green question strips differ from the lab lessons; its shaded spheres are already stronger artwork than the flat discs in Direct collisions. Inspected original `mechanics-multiple-collisions.mp4` at 60.06s, 140.13s, 240.23s, 340.33s.
- **Done:** Repaint local T, Card, Paper and InkPlayback; use blue working and terracotta emphasis on paper with a brand-dark surround. Keep the existing Sphere shading and geometry; recolour its highlight/ring only as needed for the new surface. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** A–B then B–C chronology, masses, signed velocities, collision radii/positions, the later-collision conclusion and word-specific figure cues. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L10 — Using calculus in 1D: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsUsingCalculusIn1D.tsx:4`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** The tiny sage trolley, grey problem strip and charcoal field are visually disconnected from the blue/cream working sheet. Inspected original `mechanics-using-calculus-in-1d.mp4` at 52.42s, 122.31s, 209.68s, 297.04s.
- **Done:** After F02, opt only this composition into the brand paint roles for Lesson, Figure, Caption, Paper and Cart. Darken plotted marks on paper and use surface-specific accent colours; retain the trolley drawing and current layout. This is the suggested shared-theme pilot. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Integration constants, initial conditions, particle/graph correspondence, signed displacement, two-leg distance and average-speed working. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L11 — Deriving the suvat formulae: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsDerivingSuvat.tsx:4`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** Sage area shading/underlines and grey question strips are an unbranded palette beside otherwise usable paper working. Inspected original `mechanics-deriving-suvat.mp4` at 50.48s, 117.78s, 201.91s, 286.04s.
- **Done:** After F02, opt only this lesson and its imported Paper/Figure primitives into brand paint. Keep the area fill translucent and its boundary stronger than the paper grid; use terracotta for the active derivation cue. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Velocity-time geometry, constant-acceleration assumption, u/v/a/t/s symbols, derivation order, area decomposition and validity conditions. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L12 — Equilibrium in 1D: align paint roles

- **Priority / confidence / cost:** P2 / high / P–M; selected-lesson composition render required later.
- **Files:** `C/MechanicsEquilibriumIn1D.tsx:17`.
- **Wrong / evidence:** Grey-green captions and parcel artwork sit on charcoal while the working uses grey ink; this is an independent implementation rather than a shared-theme consumer. Inspected original `mechanics-equilibrium-in-1d.mp4` at 40.07s, 93.51s, 160.29s, 227.08s.
- **Done:** Repaint local T, Caption and Paper, and pass blue ink explicitly to the existing EquilibriumInk playback. Keep the parcel illustration and rope paths; use terracotta emphasis on the paper without changing glyph geometry. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Force directions and magnitudes, hanging-cord attachment, equilibrium balance, mass/weight distinction and all handwritten symbols/timing. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L13 — Acceleration due to gravity: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsAccelerationDueToGravity.tsx:4`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** The sea/cliff guide lines and sage height annotations are subdued on a large charcoal field; the paper working is already usable. Inspected original `mechanics-acceleration-due-to-gravity.mp4` at 55.04s, 128.43s, 220.17s, 311.91s.
- **Done:** After F02, opt in this lesson and its shared primitives. Repaint the cliff/sea guides and distinguish the stone/active vector from construction lines; keep the existing schematic cliff rather than commissioning scenery. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Up-positive sign convention, launch/return/sea reference levels, stone trajectory, height brackets and every SUVAT value/cue. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L14 — suvat in 1D: align paint roles

- **Priority / confidence / cost:** P2 / high / P–M; selected-lesson composition render required later.
- **Files:** `C/MechanicsSuvatIn1D.tsx:4`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** Sage vehicles, grey setup cards and the dark road sit beside cream paper; local Sheet and InkLine contain additional hardcoded paint beyond shared T. Inspected original `mechanics-suvat-in-1d.mp4` at 50.41s, 117.63s, 201.65s, 285.67s.
- **Done:** After F02, opt in this lesson, then repaint the local Sheet/InkLine/Vehicle roles and the hardcoded #b9bcb2 setup card. Keep the pale starting-position ghost visibly different from the current vehicle; no new vehicle geometry here. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Known/unknown checklists, signed reversal, start/end snapshots, bike/train/car trajectories, page changes and the clipped handwriting implementation. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L15 — Force diagrams: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsForceDiagrams.tsx:7`.
- **Wrong / evidence:** Its caption “paper” is #b9bcb2 rather than the cream used elsewhere; white wireframe cars and sage emphasis reinforce a separate style. Inspected original `mechanics-force-diagrams.mp4` at 53.25s, 124.26s, 213.02s, 301.77s.
- **Done:** Repaint the independent T and Caption with brand roles, leaving diagrams on the dark surround. Keep clear force arrows, label contrast and a subordinate ground line; retain current vehicle geometry until I03. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Particles, arrow origins, force schedules, moving-story to isolated-body transition, pulley strings and tension/thrust directions. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L16 — Equilibrium in 2D: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsEquilibriumIn2D.tsx:4`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** Sage arrows/rings and a grey problem card do not match the paper/terracotta reference, although the sparse force diagram itself is appropriate. Inspected original `mechanics-equilibrium-in-2d.mp4` at 44.47s, 103.76s, 177.87s, 251.98s.
- **Done:** After F02, opt in this lesson and explicitly style the local Equilibrium2DInk pen/colour roles without changing its geometry. Keep horizontal/vertical balance distinguishable by labels and active emphasis. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Force attachment, separately drawn horizontal components, P/Q equations and answers, vector directions and spoken rings. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L17 — F = ma: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsFEqualsMa.tsx:3`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** The grey-green car and sage force emphasis are visibly different from the bright lab vehicles and from the TikTok palette. Inspected original `mechanics-f-equals-ma.mp4` at 49.19s, 114.79s, 196.77s, 278.76s.
- **Done:** After F02, opt in this lesson and repaint the local Car hardcoded body/window colours to restrained brand neutrals. Preserve the existing car silhouette; use surface-specific active-force and paper emphasis colours. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Opposite forces on different bodies, drive/resistance values, acceleration, distance, motion and wheel anchors. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L18 — Connected bodies (ropes & tow bars): align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsConnectedBodiesRopesAndTowBars.tsx:3`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** Hardcoded green-grey vehicles and sage system boxes make the body feel unrelated to the brand paper. Inspected original `mechanics-connected-bodies-ropes-and-tow-bars.mp4` at 54.70s, 127.64s, 218.82s, 309.99s.
- **Done:** After F02, opt in this lesson; repaint Vehicle fills and the separate/combined-system outlines along with shared paper. Keep the car and trailer identifiable even without colour. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Rope versus rigid-bar behavior, equal/opposite internal forces, system boundary, attachment points and 400 N tension result. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L19 — Connected bodies (lifts): align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsConnectedBodiesLifts.tsx:3`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** The sage passenger and fine grey lift outline float on charcoal; the useful working sheet is a different visual surface. Inspected original `mechanics-connected-bodies-lifts.mp4` at 55.31s, 129.05s, 221.24s, 313.42s.
- **Done:** After F02, opt in this lesson; repaint Person, lift/cable and Values divider with brand roles. Keep the simple passenger pictogram and separate acceleration/velocity arrow meanings. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Floor contact, passenger versus combined system, cable anchor, up-positive braking, masses and R/T results. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L20 — Connected bodies (pulleys): align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsConnectedBodiesPulleys.tsx:4`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** Sage rope/pulley and muted mass blocks contrast weakly with the blackboard styling around the paper. Inspected original `mechanics-connected-bodies-pulleys.mp4` at 66.51s, 155.19s, 266.05s, 376.90s.
- **Done:** After F02, opt in this lesson and repaint pulley, rope, P/Q blocks and state captions; use label/outline differences as well as colour. Keep the engineering diagram, which needs no redraw in the reviewed frames. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Taut/slack state, exact floor contact, pulley clearance, mass identities, motion clock, maximum-height stages and cue order. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L21 — Resolving forces & inclined planes: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsResolvingForcesAndInclinedPlanes.tsx:4`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** Sage force triangles and dark green block surfaces read as the chalkboard family rather than the brand. Inspected original `mechanics-resolving-forces-and-inclined-planes.mp4` at 59.08s, 137.85s, 236.31s, 334.78s.
- **Done:** After F02, opt in this lesson; repaint the block, component triangle and shared paper/rings. Preserve clear solid/dashed distinctions and use stronger primary vectors than construction guides. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Angle labels, component directions, rotated axes, reaction, acceleration and the distinction between mg and its resolved components. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L22 — Coefficient of friction: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsCoefficientOfFriction.tsx:3`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** The sage crate and grey equation captions have no visual continuity with the first seven lab-styled lessons. Inspected original `mechanics-coefficient-of-friction.mp4` at 68.15s, 159.01s, 272.59s, 386.17s.
- **Done:** After F02, opt in this lesson and repaint the crate/surface and working emphasis. Keep rough-surface hatching and a separate visual cue for the friction limit versus actual friction. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Three independent rest-start trials, limiting versus actual friction, force arrows, contact and the onset of sliding. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L23 — Coefficient of friction — F = ma: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsCoefficientOfFrictionFEqualsMa.tsx:3`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** Sage angled-force components and green-grey surfaces are another use of the unbranded shared palette. Inspected original `mechanics-coefficient-of-friction-f-equals-ma.mp4` at 61.77s, 144.14s, 247.09s, 350.05s.
- **Done:** After F02, opt in this lesson; repaint the force/component triangle, body and local paper. Keep the unknown pull, its components and friction independently legible with labels. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** P/Q values, angle and component geometry, R=36 N, fmax=9 N, the rest test and final acceleration. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L24 — Coefficient of friction & inclined planes: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsCoefficientOfFrictionAndInclinedPlanes.tsx:3`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** Several thin sage/grey vectors crowd the dark slope, while terracotta is absent from all instructional emphasis. Inspected original `mechanics-coefficient-of-friction-and-inclined-planes.mp4` at 72.11s, 168.26s, 288.44s, 408.62s.
- **Done:** After F02, opt in this lesson; repaint primary forces, secondary components and local Paper as separate roles. Compare the dense 168.26s frame after recolouring; change stroke weight only if the components still merge visually. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Slope angle, weight components, pull above slope, actual impending motion, friction direction, force origins and acceleration. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L25 — Coefficient of friction (harder problems): align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsCoefficientOfFrictionHarderProblems.tsx:3`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** The dark slope and sage range marker lack the brand hierarchy; the diagram geometry and interval already communicate the mathematics. Inspected original `mechanics-coefficient-of-friction-harder-problems.mp4` at 59.66s, 139.21s, 238.64s, 338.07s.
- **Done:** After F02, opt in this lesson; repaint the block, friction-direction emphasis and interval endpoints. Keep labels and endpoints as well as colour, with no redraw of the slope. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Static equilibrium throughout, minimum/maximum P, reversal of limiting friction, included endpoints and no-effect-of-pull-on-R condition. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L26 — Work: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsWork.tsx:3`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** Sage slope/force marks and charcoal around cream working repeat the older palette; the schematic crate is adequate. Inspected original `mechanics-work.mp4` at 59.63s, 139.14s, 238.52s, 337.90s.
- **Done:** After F02, opt in this lesson and repaint force/displacement arrows, height bracket and paper emphasis. Use distinct labelled marks for work by a force and work against it. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Force/displacement angle, constant-speed condition, friction/weight work signs, ramp geometry and numerical work values. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L27 — Energy: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsEnergy.tsx:3`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** The thin sage cyclist and dark slope sit beside useful blue handwriting; the palette, not the mathematics, needs alignment. Inspected original `mechanics-energy.mp4` at 72.38s, 168.88s, 289.50s, 410.12s.
- **Done:** After F02, opt in this lesson and repaint Bike, journey/datums and Paper using brand roles. Keep bicycle geometry unchanged in this paint brief; I04 separately covers an optional illustration redraw. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Particle origin, 3 m height gain, initial/final speeds, total cyclist-plus-bike mass, kJ conversion and ascent/descent sign contrast. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L28 — Energy principles: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsEnergyPrinciples.tsx:3`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** Green-grey cars, charcoal terrain and sage arrows are inconsistent with the lab-family vehicle colours. Inspected original `mechanics-energy-principles.mp4` at 73.14s, 170.66s, 292.56s, 414.46s.
- **Done:** After F02, opt in this lesson and repaint Car, height/datum lines and local Paper. Keep the diagram and energy-balance structure; no scenery or vehicle redesign. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Same car at A/B, slope/height geometry, work by non-gravitational resistance, datum, speed values and conservation conditions. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L29 — Power: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsPower.tsx:3`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** The sage car and force arrows repeat the chalkboard look while the paper already resembles the target. Inspected original `mechanics-power.mp4` at 69.37s, 161.86s, 277.48s, 393.10s.
- **Done:** After F02, opt in this lesson; repaint local Car, Road, force arrows and Paper. Preserve the emphasis that distinguishes driving force from resistance and the weight component. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Shallow slope, shared force-arrow scale, P=Dv, sinθ=1/20, 1000 N drive result and nonzero-speed comparison. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L30 — Momentum: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsMomentum.tsx:5`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** Two very small grey trolleys on a charcoal field and sage cues differ from the larger shaded objects in the worked-question reference. Inspected original `mechanics-momentum.mp4` at 42.17s, 98.40s, 168.69s, 238.98s.
- **Done:** After F02, opt in this lesson and mechanics-momentum/Diagram.tsx paint roles; strengthen trolley/body outlines while retaining the simple cart geometry and two separate tracks. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Separate trolleys rather than a collision, masses and signed velocities, reversal of positive direction and unchanged momentum magnitudes. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

### L31 — Direct collisions: align paint roles

- **Priority / confidence / cost:** P2 / high / P–S; selected-lesson composition render required later.
- **Files:** `C/MechanicsDirectCollisions.tsx:7`. Shared paint provider: `C/mechanics-m42/Presentation.tsx:4`; use F02 opt-in, not a default edit.
- **Wrong / evidence:** The shared charcoal/grey setup styling and sage rings differ from the branded paper reference; the flat-disc illustration is a separate optional polish item. Inspected original `mechanics-direct-collisions.mp4` at 45.38s, 105.88s, 181.52s, 257.15s.
- **Done:** After F02, opt in this lesson and repaint Conditions, Paper, track, Particle labels and emphasis. Keep A/B distinct and trial headings prominent. Do not alter the circle geometry; I01 handles only its shading. Apply the common paint target above, preserving the current layout and typography; verify sampled and settled cue frames at native and 960×540 sizes.
- **Must not change:** Independent trials restarting from the same incoming state, collision positions/radii, separate versus sticking outcomes and all signed velocity/momentum working. Preserve all narration, cues, holds, duration, equations and scene order; do not modify any other lesson or the shared legacy defaults.

## Specific image and illustration briefs

### I01 — Direct collisions: give the existing spheres volume, without redrawing motion

- **Priority / confidence / route:** P2 / high observation, medium preference / P–S (roughly 1–2 hours plus selected-lesson render). This is the cheapest image polish, not a full redraw.
- **Files:** `C/MechanicsDirectCollisions.tsx:32` (`Particle`, its circle and label). Read `C/MechanicsMultipleCollisions.tsx:1352` (`Sphere`) and the main-tree worked-question `Spheres` at line 37 as visual references only.
- **Wrong / evidence:** at 181.52s and 257.15s A/B are flat sage/grey discs; Multiple collisions at 240.23s already uses shaded spheres, and the TikTok at 12s uses consistent soft blue volume. The two collision lessons therefore disagree on object treatment.
- **Done:** add a restrained radial fill/highlight to the existing circles and adjust label contrast. Use unique gradient IDs per instance/trial, keep A/B distinguishable by letters/outlines, and compare all separated/contact/sticking states. No new physics or asset pipeline is needed.
- **Must not change:** circle centres, RADIUS, collisionPositions/motionClock, track contact, masses/velocities, arrow lengths, label identities, tentative dashes, independently reset trials or any narration/cues. Do not import a reference component whose different radius would move collision contact.

### I02 — S.I. units: redraw the Earth/Moon illustration only

- **Priority / confidence / route:** P3 / high observation, medium preference / D–M, roughly 4–8 hours plus scene/lesson render and review.
- **Files:** `C/MechanicsSIUnits.tsx:1123` (`Planet`), its use in the mass-versus-weight Scene06. Paint-only alignment remains L01.
- **Wrong / evidence:** the native 82s still shows a large blue Earth with simple green oval land patches and luminous edges. This is the clearest “some images” candidate: it looks like a placeholder globe beside the more finished shaded spheres in the liked reference. The balance on the left is schematic but adequate.
- **Done:** replace only the planet's local CSS/SVG artwork with a restrained shaded sphere and a few recognisable land contours; give the Moon a compatible neutral/crater treatment. Keep the image subordinate to the mass/weight comparison. Show the Earth and Moon settled states with the unchanged weight arrow and 1 kg label before accepting the artwork.
- **Must not change:** planet bounds/position, 1 kg identity, Earth/Moon switch cue, different weight-arrow lengths, the statement that mass is unchanged, balance/cart behavior or narration. This is not a request for new gravity calculations, photorealism or a geography animation.

### I03 — Force diagrams: improve the wireframe car/trailer while preserving the particle model

- **Priority / confidence / route:** P3 / high style inconsistency, medium preference / D–M, roughly 4–8 hours plus render. Recolour-only improvement belongs to L15 and should be tried first.
- **Files:** `C/MechanicsForceDiagrams.tsx:90` (`Car`, trailer variant). Read existing `C/MechanicsFEqualsMa.tsx:10` (`Car`) and `C/MechanicsConnectedBodiesRopesAndTowBars.tsx:11` (`Vehicle`) for a consistent restrained silhouette. Do not migrate those lessons in this brief.
- **Wrong / evidence:** at 124.26s and 301.77s the car/trailer are hollow outlines with crosshair wheels, while F=ma at 114.79s uses filled panels/windows. The two lessons' real-object illustrations do not look like one series. This is aesthetic, not an incorrect free-body diagram.
- **Done:** redraw/refine the real-object car/trailer into a consistent filled vector silhouette with restrained windows/body shading and cleaner wheel hubs. Keep the isolated force diagram as a particle; do not decorate the force arrows. Show the moving and isolated states and both connection cases at the same geometry.
- **Must not change:** wheel centres/contact line, object-x translation, car/trailer attachment points, story-to-particle transition, arrow origins, tension/thrust distinction, word cues or any forces. Do not wholesale replace the SVG with a raster image that moves the anchors.

### I04 — Energy: optional cyclist illustration refinement

- **Priority / confidence / route:** P3 / medium preference / D–M/L, roughly 6–12 hours plus render and motion review. Lower value than paint; do not commission merely because the rider is simple.
- **Files:** `C/MechanicsEnergy.tsx:15` (`Bike`); compare `C/MechanicsSuvatIn1D.tsx:46` (`Vehicle`) and `C/MechanicsDrawingTravelGraphs.tsx` cyclist drawing as read-only visual references.
- **Wrong / evidence:** at 72.38s, 168.88s and 410.12s the cyclist is assembled from thin angular limb/bike strokes, while the new reference has more finished object volume. The current rider is recognisable and not a teaching error; it is a candidate only if Durai still dislikes the imagery after L27.
- **Done:** refine the rider's silhouette/limbs and bicycle details while retaining a small, uncluttered vector illustration. Use consistent material colours and line weights across both journey snapshots and the descent contrast. Judge at actual playback size; additional detail that disappears at 960×540 is not an improvement.
- **Must not change:** the explicitly modelled particle at local origin, wheel support line at local y=91, slope rotation, x/y data attributes, roll animation, start/end position, speed/height brackets or the total cyclist-plus-bike mass. Do not alter the mathematical motion to suit the drawing.

## What is deliberately not a correction

- Multiple collisions already has shaded spheres; recolour through L09 before considering any new artwork.
- Pulleys, hanging masses, blocks, force arrows, the lift passenger icon and slope diagrams are valid deliberate abstractions. Their reviewed geometry is not an image defect. Paint/hierarchy should be tried before scenery or object redesign.
- Sparse frames, a blank working sheet before the pen starts, a ghosted initial vehicle and partial equations during speech are scheduled teaching states, not evidence of missing content.
- No wholesale migration to white, font replacement across all shared consumers, narration regeneration, mathematical rewrite or replacement of original masters is proposed for this audit.

## Audit completion and later acceptance

This backlog provides all 31 lesson paint briefs, the framing/theme/type prerequisites, four specifically located image candidates, ranked dispatch order, original-video timestamps and preservation rules. The 38-file inventory is reconciled as 31 canonical + 7 alternate renders. Extracted stills were inspected; no video was rendered or changed. Later corrections must return before/after frames and the exact selected lesson/brief ID, and must be verified visually before being marked fixed. A changed hex value is not sufficient evidence that a video was corrected.
