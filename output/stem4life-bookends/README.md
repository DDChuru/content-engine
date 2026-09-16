# Stem 4 Life — bookends for review

**Selected direction: Intro B with the approved outro.** Four hero sizes are supplied for Durai's final choice. The design recommendation is 48%: it gives the microscope a clear solo beat without crowding the kicker or making the later lockup feel anticlimactic. Intro A, Intro C and the outro remain unchanged.

| Render | Idea | Duration |
| --- | --- | --- |
| [intro-a.mp4](intro-a.mp4) | Typography assembles on white; the terracotta 4 lands last | 5s / 150 frames |
| [intro-b-74.mp4](intro-b-74.mp4) | Original 800px / 74% hero, preserved unchanged | 5s / 150 frames |
| [intro-b-60.mp4](intro-b-60.mp4) | 648px / 60% hero | 5s / 150 frames |
| [intro-b-48.mp4](intro-b-48.mp4) | 518px / 48% hero — recommended | 5s / 150 frames |
| [intro-b-38.mp4](intro-b-38.mp4) | 410px / 38% hero | 5s / 150 frames |
| [intro-c.mp4](intro-c.mp4) | Graph-paper rules draw, then the lockup settles onto the worked page | 5s / 150 frames |
| [outro.mp4](outro.mp4) | Paper treatment; lesson title, CTA and a large, stationary website | 6s / 180 frames |

All seven listed files are 1920×1080, 30fps, H.264/yuv420p, BT.709, with silent 48kHz stereo AAC. No existing lesson videos have been altered. This is a selectable set, not a batch rebrand of the 31 lessons.

The outro's `stem4life.com` is set in 108px Manrope. It is fully settled for **frames 60–179: four seconds**. There is no final fade. The endpoint source stills are pixel-identical. The website is also visible at the end of each intro.

## Inspection evidence

- [Intro A frames](intro-a-frames.png) and [Intro C frames](intro-c-frames.png): frames 20, 60, 100 and 149, extracted from the MP4s.
- [Intro B size comparison](intro-b-sizes.png): the encoded frame 72 hero hold for 74%, 60%, 48% and 38%, shown at equal scale in one row.
- Variant stills in `stills/`: encoded frames 72, 105 and 149 for each size. The lossless Remotion frame 149 is pixel-identical across all four prop values; the separately compressed MP4 frames were also inspected visually.
- [Original Intro B timeline](intro-b-frames.png): the 74% version at frames 20, 45, 72, 88, 105, 120 and 149. The earlier pre-hero render remains [intro-b-preshrink.mp4](intro-b-preshrink.mp4).
- [Outro frames](outro-frames.png): frames 20, 60, 100, 150 and 179, extracted from the MP4.
- [Alternative outro aesthetics](outro-variants.png): A and B at frame 100, rendered from the same prop-driven component.
- [Long lesson title](stills/long-title-100.png): a two-line title without truncation or overlap.
- [Full-resolution settled outro](stills/outro-100.png): the URL is clear at 1080p and the lockup remains inside safe margins.
- [verification.json](verification.json): full-set ffprobe results, loaded-font evidence, prop checks and the outro hold check.
- [verification-intro-b.json](verification-intro-b.json): revised Intro B timing, ffprobe and inspection-frame evidence.

Both Manrope and Source Sans 3 load from the committed local WOFF2 files. Rendering fails if either CSS family cannot resolve. Logo letterforms and the microscope are inline SVG paths, not font glyphs or external images.

Source and reproduction instructions: [Stem 4 Life composition README](../../packages/backend/src/remotion/compositions/stem4life/README.md). The standalone entry avoids the shared `Root.tsx`.
