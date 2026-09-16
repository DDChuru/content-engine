# Stem 4 Life — bookends for review

**Selected: Intro B with the approved outro.** The chosen microscope now draws at hero scale on the dark chrome, holds long enough to register, then docks beside the wordmark. Intro A and Intro C remain available as unchanged alternatives.

| Render | Idea | Duration |
| --- | --- | --- |
| [intro-a.mp4](intro-a.mp4) | Typography assembles on white; the terracotta 4 lands last | 5s / 150 frames |
| [intro-b.mp4](intro-b.mp4) | Microscope draws at 800px on dark chrome, holds, then docks beside the wordmark | 5s / 150 frames |
| [intro-c.mp4](intro-c.mp4) | Graph-paper rules draw, then the lockup settles onto the worked page | 5s / 150 frames |
| [outro.mp4](outro.mp4) | Paper treatment; lesson title, CTA and a large, stationary website | 6s / 180 frames |

All four files are 1920×1080, 30fps, H.264/yuv420p, BT.709, with silent 48kHz stereo AAC. No existing lesson videos have been altered. This is a selectable set, not a batch rebrand of the 31 lessons.

The outro's `stem4life.com` is set in 108px Manrope. It is fully settled for **frames 60–179: four seconds**. There is no final fade. The endpoint source stills are pixel-identical. The website is also visible at the end of each intro.

## Inspection evidence

- [Intro A frames](intro-a-frames.png) and [Intro C frames](intro-c-frames.png): frames 20, 60, 100 and 149, extracted from the MP4s.
- [Intro B frames](intro-b-frames.png): frames 20, 45, 72, 88, 105, 120 and 149, extracted from the revised MP4. The former approved render is preserved as [intro-b-preshrink.mp4](intro-b-preshrink.mp4).
- [Outro frames](outro-frames.png): frames 20, 60, 100, 150 and 179, extracted from the MP4.
- [Alternative outro aesthetics](outro-variants.png): A and B at frame 100, rendered from the same prop-driven component.
- [Long lesson title](stills/long-title-100.png): a two-line title without truncation or overlap.
- [Full-resolution settled outro](stills/outro-100.png): the URL is clear at 1080p and the lockup remains inside safe margins.
- [verification.json](verification.json): full-set ffprobe results, loaded-font evidence, prop checks and the outro hold check.
- [verification-intro-b.json](verification-intro-b.json): revised Intro B timing, ffprobe and inspection-frame evidence.

Both Manrope and Source Sans 3 load from the committed local WOFF2 files. Rendering fails if either CSS family cannot resolve. Logo letterforms and the microscope are inline SVG paths, not font glyphs or external images.

Source and reproduction instructions: [Stem 4 Life composition README](../../packages/backend/src/remotion/compositions/stem4life/README.md). The standalone entry avoids the shared `Root.tsx`.
