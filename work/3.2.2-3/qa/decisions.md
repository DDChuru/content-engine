# Decisions and interpretations — 3.2.2-3

## House style (matched to reference-build-2.1.1 `src/`)
- Frame chrome copied from 2.1.1 `Lesson.tsx`: small-caps strip (y 44), title (43 px bold), MODEL line, rule at y 959,
  terracotta tick + caption bar. Objectives beat on the dark ink surface (2.1.1 used this for its objectives beat).
- The Topic 2 `shared/src` files (theme, Type, ErrorMarker) were NOT in the inputs; rebuilt in `src/shared/` from the
  Stem 4 Life brand tokens (`packages/backend/src/remotion/compositions/stem4life/palette.ts`): ink #253247,
  primary (terracotta) #B64A30, accent #FFAC8F, warm #F6F3EB. The primary is exactly the colour verify.py's badge probe
  expects. Badge geometry kept (1410, 22, 440 × 56).
- Typeface: the brand's Source Sans 3 (static instances made from the repo's WOFF2 files). Manrope was removed from the
  fontconfig path because fontconfig resolved Source Sans ≥600 to Manrope when both were present.
- Correct construction ink is TEAL (#1C6E8C) — the storyboard's "accent" — deliberately distinct from terracotta, which
  marks error throughout (error marker, wrong-answer tags, struck lines). Ticks and "written properly" are green.

## Models
- `RateGraph` curves: v = Vmax·tanh(atanh(½)·S/Km). Every half-Vmax intersection is an exact point on the drawn curve
  (CHECK should-fix 5); curves start at 0, rise monotonically, no overshoot; within the plotted range each curve is within
  ~1% of its plateau. Three-enzyme initial slopes X 8.2 > Y 3.4 > Z 1.6 (order X, Y, Z as required); order of affinity
  X, Z, Y. One linear scale per comparison; units reset (mmol dm⁻³ lactase; µmol dm⁻³ three enzymes).
- Inhibitor graphs assert no numbers (CHECK value audit): competitive shares the plateau (one vmax-line, "one line because
  the plateaux coincide"), larger Km, merging; non-competitive (simplified model) lower plateau with its own vmax-line,
  each curve's own half-line, both drops on the same concentration.
- `EnzymeActiveSiteModel` built to the L1 spec (3.1.1-2 STORYBOARD): cleft upper right (rest-lk), second site lower left;
  the substrate, the competitive wedge (one corner clipped, terracotta tint) and the round non-competitive inhibitor are
  generated from the same profile functions as the notches they fit. The non-competitive shape change tweens the cleft
  profile over 0.6 s (reversible motion; silhouette stays tight — not `denatured`) and returns over 0.6 s.
- Substrate → products (Beat 11, symbolic, as L1's `products` state) switches in ONE frame; no cross-fade, no bonds drawn.
  No covalent bond is drawn anywhere, so no valence audit applies (storyboard: "No covalent bond is made or broken").

## Error beats (all three badge COMMON MISTAKE — an examiner report diagnoses each)
- E37 (Beat 6): June 2023 ER p.26 "The most common error …". Marker clears 18 frames after "all three marks are on the page",
  after the three lines are drawn in place and the "no working on the graph" tag is struck.
- E36 (Beat 9): June 2024 ER p.4 reports both wrong reasonings (options C and A). Line 1 corrected at "Affinity is read from
  Km" (marker stays on), line 2 at "Lowest Km, highest affinity" (last fault) → marker clears 18 frames later.
- E41 (Beat 13): June 2023 ER p.22; March 2023 ER p.2. Above-maximum ghost struck first ("which an inhibitor does not do");
  lower-plateau sketch struck and the correct competitive curve drawn at "Redraw it"; marker clears at +54 frames when the
  curve is complete. The struck sketches then fade back so the corrected sketch reads clearly.
- Written wrong answers are labelled composites ("illustrating the error the report describes; not a transcript").

## Storyboard points needing interpretation
- Beat 1 / Beat 10: the inhibitor's binding site is deliberately unspecified — drawn as a generic terracotta blob seated on
  the enzyme surface (neither site).
- Beat 16 row tags (P1/P2/P3/P5) are the component numbers of the cited papers (e.g. s23_31 → Paper 3).
- Beat 17 "the two inhibitor curves flash once on the main graph": drawn dashed on the lactase graph for 1.4 s with labels;
  competitive Km chosen (25) so it visibly merges within that graph's range.
- Beat 3 "Vmax (supplied)" note says only "the value is given in the question" — no invented example value.
