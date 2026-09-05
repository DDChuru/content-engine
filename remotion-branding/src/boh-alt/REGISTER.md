# Bill of Health — alternate comparison build

The standalone entry is `src/boh-alt/index-alt.ts`. It registers **only**
`BillOfHealthAlt` and `BillOfHealthAltBranded`. `src/Root.tsx` and Fable's
`src/boh` / `public/boh` assets are unchanged by this build.

| Composition | Frames | FPS | Size | Duration |
| --- | ---: | ---: | --- | --- |
| BillOfHealthAlt | 9048 | 30 | 1920 × 1080 | 5:01.600 |
| BillOfHealthAltBranded | 9378 | 30 | 1920 × 1080 | 5:12.600 |

The recorded timing takes precedence over the storyboard's estimated 4:40.
`narration.json` and `timing.json` are byte-for-byte copies of the finished take,
including beat 4's re-recorded script. The twelve existing MP3s are referenced
directly, with narration at 1.5.

## Three deliberate differences

1. **Device framing:** a silver device on a light, paper-coloured stage, showing
   the whole real still at 0.53 scale. The caption column starts at x=640; STEP
   lives there. There is no source crop or additional padding applied to rings.
2. **The two ledger bands:** seven sky bars and three amber bars form two separate
   panels across a visible divider. Emphasis moves from today's seven to the
   three that persist on the narration cue. The real ledger stays visible beside
   this explanatory graphic.
3. **Due diligence as an evidence file:** a white WHO / WHAT / WHEN record card
   with a “Recorded at the time” stamp, alongside the three audit contexts.
   This gives the spoken “show me” argument a concrete visual structure.

## Capture truth and ring audit

`boxes.json` records the measured target pixel bounds, an exact 10px source-pixel
margin, normalized geometry, colour, and provisional status for all 15 rings.
The 3×3 contact sheet shows every ring stage together on the nine phone stills:
`public/boh-alt/contact-rings.png`. It was rendered and visually inspected.

| Beat | Visible limitation — Monday recapture required |
| --- | --- |
| 3 | Current row says 536 / 536, Cleared; final VO says 542 / 677, 135 due. |
| 5 | Current image has follow-up rows with the area below the section; it lacks the narrated Toilets pair and open counts. |
| 8 | Yesterday is real, but the shown row is Remedial, 116 pending; it does not show the narrated 66 missed cleaning checks. |
| 11 | Only one amber Remedial row is visible; the two-row mid-shift capture is pending. |

Those beats have dashed provisional rings and a persistent, explicit recapture
notice in the caption column. No app text, counts or extra rows were fabricated.
Once the real recaptures arrive, remeasure their boxes and zoom crops and verify
the visual/VO match before removing those notices. The final scripts stay final.

The row and area zooms are exactly 2.4× the displayed phone scale. Their left
edge is x=640; the larger panel ends at x=1515.136, safely inside the 96px margin.
Card beats 9, 10 and 12 exclusively render cards, so they cannot mount a phone
or a still placeholder. The closing card holds through tutorial frame 9047 and
the branded closing hold through frame 9377. Closing text starts at x=980.

Font readiness is gated inside an effect per mount. Resolve, rejection,
synchronous failure, a 15-second cutoff and unmount all release the handle.
There is no module-level `delayRender`. Actual images/audio use Remotion's
asset components directly, so missing assets fail visibly rather than being
silently replaced or skipped.

The existing 74.031-second music source covers the entire composition through
74-second segments overlapping by four seconds. Volume is 0.34 for the hook,
0.09 under VO, and rises to 0.38 **after** the last recording ends. A single
continuous bed also spans the branded intro/tutorial/outro boundaries.

## Verification

Run from `remotion-branding`:

```bash
source ~/.nvm/nvm.sh && nvm use 22
npx tsc -p src/boh-alt/tsconfig.json
python3 src/boh-alt/verify-rings.py
npx remotion render src/boh-alt/index-alt.ts BillOfHealthAlt /tmp/boh-alt-proof --frames=0-300 --concurrency=3 --image-format=jpeg --sequence
node src/boh-alt/verify-frames.cjs
```

Typecheck passed. The proof sequence completed with 301 JPEGs. The font gate
survived the multi-frame render. The twelve source MP3 durations were checked
against timing.json, and both copied JSON files were checked byte-for-byte.

| Requested midpoint | Frame | PNG |
| --- | ---: | --- |
| Beat 2 | 1043 | `/tmp/boh-alt-02.png` |
| Beat 3, zoom | 1882 | `/tmp/boh-alt-03.png` |
| Beat 9 | 6157 | `/tmp/boh-alt-09.png` |
| Beat 10 | 7237 | `/tmp/boh-alt-10.png` |
| Beat 12 | 8828 | `/tmp/boh-alt-12.png` |

The frame script also renders beats 5/8/11, the first frames of all three card
beats, the final tutorial frame, and the first/final branded frames. These
checks cover provisional notices, nonempty scene entrances and closing holds.
Only the requested short sequence and stills were rendered; no full video or
audio mix was exported.

Proof render's last log line (`/tmp/verify-boh-alt-proof.log`):

```text
○                    /tmp/boh-alt-proof
```

## Optional registration snippet

For later manual integration into `src/Root.tsx`, import:

```tsx
import {
  BillOfHealthAlt,
  BillOfHealthAltBranded,
  BOH_ALT_FPS,
  BOH_ALT_FRAMES,
  BOH_ALT_BRANDED_FRAMES,
} from './boh-alt/BillOfHealthAlt';
```

Then add these inside the root's existing JSX (using its `Composition` import):

```tsx
<Composition
  id="BillOfHealthAlt"
  component={BillOfHealthAlt}
  durationInFrames={BOH_ALT_FRAMES}
  fps={BOH_ALT_FPS}
  width={1920}
  height={1080}
/>
<Composition
  id="BillOfHealthAltBranded"
  component={BillOfHealthAltBranded}
  durationInFrames={BOH_ALT_BRANDED_FRAMES}
  fps={BOH_ALT_FPS}
  width={1920}
  height={1080}
/>
```

Do not import the standalone `index-alt.ts` into the shared root; it calls
`registerRoot` itself.

## Files created

- `src/boh-alt/narration.json`
- `src/boh-alt/timing.json`
- `src/boh-alt/boxes.json`
- `src/boh-alt/BillOfHealthAlt.tsx`
- `src/boh-alt/index-alt.ts`
- `src/boh-alt/REGISTER.md`
- `src/boh-alt/tsconfig.json`
- `src/boh-alt/verify-rings.py`
- `src/boh-alt/verify-frames.cjs`
- `public/boh-alt/contact-rings.png`

No source files were deleted. No commits or deployment commands were run.
