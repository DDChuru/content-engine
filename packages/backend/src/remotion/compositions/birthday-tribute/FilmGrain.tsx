import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

/**
 * Subtle moving film grain over the whole composition.
 *
 * Uses an SVG `feTurbulence` noise filter cycled across 6 seeds at the frame
 * rate to give the grain a "living" quality without being distracting. Blended
 * via mix-blend-mode: overlay so it adds texture to both bright and dark areas
 * naturally — like real film, not like a static noise overlay slapped on top.
 *
 * Opacity is intentionally low (~7%). Anything more reads as "broken video"
 * rather than "tasteful texture."
 */
const SEED_CYCLE = 6;

export const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame % SEED_CYCLE;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity: 0.07,
        mixBlendMode: 'overlay',
      }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
