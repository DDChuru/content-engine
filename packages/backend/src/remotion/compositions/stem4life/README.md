# Stem 4 Life lesson bookends

The standalone entry is `src/remotion/index-stem4life.ts`, relative to `packages/backend`. It does not import or modify the shared Remotion root.

| Composition | Treatment | Frames / duration |
| --- | --- | --- |
| `Stem4LifeIntroA` | White surface; outlined letters assemble, terracotta 4 lands last | 150 / 5s |
| `Stem4LifeIntroB` | Dark chrome; microscope draws, then moves into the wordmark lockup | 150 / 5s |
| `Stem4LifeIntroC` | Warm graph paper; rules draw and the lockup settles onto the page | 150 / 5s |
| `Stem4LifeOutro` | CTA, large URL, lesson title; `aesthetic: 'A'`, `'B'` or `'C'` | 180 / 6s |

All compositions are 1920×1080 at 30fps. C is the recommended default because its graph paper connects the lessons to the learning app; A is the quietest alternative.

## Component API

```tsx
import {Stem4LifeIntro, Stem4LifeOutro, IntroA, IntroB, IntroC} from './Stem4LifeBookends';

<Stem4LifeIntro title="Force, mass & acceleration" subtitle="Cambridge A Level · Mechanics" />
<Stem4LifeOutro title="Force, mass & acceleration" aesthetic="C" />
```

All components accept `{title, subtitle?, accentA?, accentB?}`. The two generic bookends also accept `aesthetic?: 'A' | 'B' | 'C'` and default to C. The three named intros choose their own treatment. `accentA` overrides the light terracotta accent; `accentB` overrides the dark peach accent. Keep the defaults for normal brand use. Composition schemas expose these props in Studio. Titles are measured in the loaded display font and fitted to two lines without truncation.

## Timing and editing

- A: letters enter from 0.14s; the 4 enters at 1.22s and is settled at 1.88s.
- B: after a 12-frame fade, the microscope draws at an exact 800px visible height during frames 12–72, holds large through frame 88, then uses an overshoot-clamped spring to dock during frames 88–118. The wordmark enters during frames 100–118. The title, rule and website also finish by frame 118, leaving the approved lockup static for the final 32 frames.
- C: graph rules enter during the first 1.5s; the complete lockup settles at 1.58s.
- Lesson information and the small intro website settle by 3.15s. Final intro frames hold for a clean editorial cut.
- Outro: the 108px URL enters at 0.85s and is completely settled by 1.8s. All motion has ended before frame 60. **Frames 60–179 provide four uninterrupted seconds with the URL fully opaque and stationary.** There is no end fade that erodes this hold.
- The render script uses PNG frame capture and BT.709 H.264/yuv420p encoding, then adds silent 48kHz stereo AAC for convenient concatenation. These bookends contain no music or voiceover. No existing lesson video is modified by this task.

## Artwork and fonts

`paths.ts` preserves the canonical wordmark outlines and letter positions from `stem4life-brand/dist/logo/wordmark-light.svg`, plus the approved refined microscope from the horizontal lockup. React renders SVG paths directly, never an image file. The microscope animation uses reveal masks over the original filled outlines. At rest, the horizontal lockup preserves its 1.2× cap-height icon and 33-unit spacing.

`palette.ts` contains the six canonical brand colours from `dist/tokens/tokens.json`. Dark lettering is warm white and the numeral/icon are peach, not terracotta. The paper grid interprets `apps/student-learn/app/globals.css` at video scale: 48px rules instead of an 8px UI grid.

Four unmodified, self-hosted WOFF2 files are in `src/remotion/public/stem4life/fonts/`: normal Manrope 500–700 and Source Sans 3 400–700, each in Latin and Latin Extended. The supplied OFL licenses are retained. `useBrandFonts` blocks rendering until all faces load and CSS resolves both families; failure cancels the render. No runtime Google Fonts request or fallback face is needed. The Source Sans 3 CSS family is quoted because its name contains a numeric token.

## Render and verify

From `packages/backend`:

```sh
./node_modules/.bin/tsc -p src/remotion/compositions/stem4life/tsconfig.json
node src/remotion/compositions/stem4life/render.mjs --stills-only
node src/remotion/compositions/stem4life/render.mjs
node src/remotion/compositions/stem4life/verify.mjs

# Intro B selection revision only
node src/remotion/compositions/stem4life/render-intro-b.mjs --preview
node src/remotion/compositions/stem4life/render-intro-b.mjs
```

The render script bundles only this entry and stages only the required fonts. Output goes to the repository's `output/stem4life-bookends/`. Set `CHROME_BIN` if Chrome is installed elsewhere. The normal render makes all four MP4s, probes their frame count/duration/format, extracts full-resolution stills from the encoded videos, exercises alternative outro props and a long title, and saves `verification.json`. The verifier makes labelled contact sheets and checks that lossless outro frames 60 and 179 are pixel-identical. Temporary bundles and previews are ignored within that output directory.

For interactive preview:

```sh
npx remotion studio src/remotion/index-stem4life.ts
```

For a custom lesson, use Remotion's `--props` JSON file with `title` and optional `subtitle`. Pass `aesthetic` for the outro. When using the renderer API, pass the same input props to both `selectComposition` and the render call so resolved props match the request.
