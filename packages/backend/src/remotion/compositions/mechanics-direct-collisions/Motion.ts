/** One-dimensional particle motion. The caller supplies a narration-derived clock. */
export type Trial = 'separate' | 'together';
export const RADIUS = 40;
export const CONTACT_A = 440;
export const CONTACT_B = CONTACT_A + 2 * RADIUS;

export function collisionPositions(trial: Trial, secondsFromImpact: number, pixelsPerMetre = 24) {
  const before = secondsFromImpact < 0;
  const velocityA = before ? 4 : trial === 'separate' ? -2 : 1;
  const velocityB = before ? -1 : trial === 'separate' ? 3 : 1;
  return {
    a: CONTACT_A + velocityA * secondsFromImpact * pixelsPerMetre,
    b: CONTACT_B + velocityB * secondsFromImpact * pixelsPerMetre,
    velocityA,
    velocityB,
  };
}

/** Remove actual inserted silences from elapsed motion; resume without a jump. */
export function motionClock(
  t: number,
  holds: {start: number; end: number}[],
) {
  return t - holds.reduce((sum, h) => sum + Math.max(0, Math.min(t, h.end) - h.start), 0);
}
