import {Easing, interpolate, spring} from 'remotion';

export const INTRO_FRAMES = 150;
export const OUTRO_FRAMES = 180;
export const FPS = 30;
export const URL_SETTLED_FRAME = 60;

export const progress = (frame: number, fps: number, start: number, duration: number) =>
  interpolate(frame / fps, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic),
  });

export const settle = (frame: number, fps: number, start: number, duration = 0.7) => {
  if (frame / fps <= start) return 0;
  // Exact endpoint: the holds contain no residual spring movement.
  if (frame / fps >= start + duration) return 1;
  return spring({frame: frame - start * fps, fps, durationInFrames: duration * fps,
    config: {damping: 200, stiffness: 120, overshootClamping: true}});
};
