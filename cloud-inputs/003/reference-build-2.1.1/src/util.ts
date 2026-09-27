import {clamp01, easeInOut, easeOut} from '../../shared/src/theme';
/** 0→1 over d seconds from age a (age = seconds since a cue; negative before it). */
export const fi = (a: number, d = 0.45) => clamp01(a / d);
export const fe = (a: number, d = 0.6) => easeInOut(clamp01(a / d));
export const fo = (a: number, d = 0.6) => easeOut(clamp01(a / d));
/** Visible from cue age a until cue age b (b relative to the same clock): fade in, fade out. */
export const between = (a: number, b: number, d = 0.35) => Math.min(clamp01(a / d), clamp01(-b / d + 1));
/** Damped wobble, degrees, for ~1 s after a cue. */
export const wobble = (a: number, amp = 7) => (a < 0 || a > 1.2 ? 0 : amp * Math.sin(a * 22) * (1 - a / 1.2));
/** Shake: oscillation during [0, dur]. */
export const shake = (a: number, dur = 1.2, amp = 9) => (a < 0 || a > dur ? 0 : amp * Math.sin(a * 30) * Math.sin(Math.PI * a / dur));
/** Linear position between two points with easing. */
export const move = (a: number, d: number, from: number, to: number) => from + (to - from) * easeInOut(clamp01(a / d));
/** Keyframed position: frames [[t, x, y], ...] in seconds of age; eased between keys. */
export const path = (age: number, keys: number[][]) => {
  if (age <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let i = 1; i < keys.length; i++) {
    const [t1, x1, y1] = keys[i], [t0, x0, y0] = keys[i - 1];
    if (age <= t1) { const u = easeInOut((age - t0) / (t1 - t0)); return [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u]; }
  }
  const l = keys[keys.length - 1]; return [l[1], l[2]];
};
/** Piecewise value over age: [[t, v], ...] linear between keys. */
export const ramp = (age: number, keys: number[][]) => {
  if (age <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i], [t0, v0] = keys[i - 1];
    if (age <= t1) return v0 + (v1 - v0) * clamp01((age - t0) / (t1 - t0));
  }
  return keys[keys.length - 1][1];
};
