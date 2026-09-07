import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

/** A loose pen ring, traced at the measured word cue and faded after 1.5 s. */
export const SpokenFigure: React.FC<{
  id: string;
  cues: number[];
  children: React.ReactNode;
  color?: string;
}> = ({ id, cues, children, color = '#f4aa45' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const cue = cues.filter((at) => at <= now).sort((a, b) => b - a)[0];
  const elapsed = cue === undefined ? Infinity : now - cue;
  const progress = Math.min(1, (elapsed + 1 / fps) / 0.4);
  const opacity = Math.max(0, Math.min(1, (1.75 - elapsed) / 0.25));

  return (
    <span data-spoken-figure={id} style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap' }}>
      {children}
      {elapsed < 1.75 && (
        <svg
          data-figure-ring={id}
          data-cue={cue}
          data-progress={progress}
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
          style={{ position: 'absolute', left: '-22%', top: '-30%', width: '144%', height: '160%', overflow: 'visible', pointerEvents: 'none', opacity }}
        >
          <path d="M 97,29 C 99,45 77,57 49,56 C 22,59 2,45 3,28 C 1,13 24,3 50,4 C 77,1 98,14 97,31"
            fill="none" stroke={color} strokeWidth={3} vectorEffect="non-scaling-stroke"
            pathLength={1} strokeDasharray={progress < 1 ? 1 : undefined} strokeDashoffset={progress < 1 ? 1 - progress : undefined} strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
};
