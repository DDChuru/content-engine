/** House palette: Stem 4 Life brand tokens (packages/backend/src/remotion/compositions/stem4life/palette.ts)
 * plus the lesson-neutral greys and the lesson's construction ink. Rebuilt for the cloud build; the
 * Topic 2 shared/src files were not in the inputs. */
export const BRAND = {
  ink: '#253247', primary: '#B64A30', accent: '#FFAC8F', warm: '#F6F3EB', dark: '#182230', white: '#FFFFFF',
  muted: '#6B7382', line: '#D6CFC0', card: '#FFFFFF', paper: '#FBF8F1',
  /** correct construction ink ("the accent" in the storyboard): deliberately NOT terracotta, which marks error */
  teal: '#1C6E8C', good: '#1D8A4E', goodDark: '#1D6B40',
  enzyme: '#C8D9E6', enzymeEdge: '#3E5873', substrate: '#F2C45A', inhibitor: '#EBA48D',
  curveA: '#253247', curveB: '#7A4FA0', curveC: '#2E8B6E',
};
export const BODY = 'Source Sans 3';
export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
/** Deterministic PRNG (mulberry32). */
export const rng = (seed: number) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
