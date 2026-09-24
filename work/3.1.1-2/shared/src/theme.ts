/** House style. Reconstructed for the cloud build from the Stem 4 Life brand tokens
 * (packages/backend/src/remotion/compositions/stem4life/palette.ts) and the 2.1.1 reference chrome,
 * because the reference's topic-02/shared/src was not shipped with the inputs. Same token names. */
export const BRAND = {
  ink: '#253247',       // brand ink (navy)
  primary: '#B64A30',   // brand primary (terracotta): highlights, rings, caption bar, error treatment
  accent: '#FFAC8F',    // brand accent (peach)
  warm: '#F6F3EB',      // brand surface-warm: lesson background
  white: '#FFFFFF',
  dark: '#182230',      // brand surface-dark
  muted: '#6F6A60',
  line: '#D6CEBD',
  green: '#1D8A4E',     // correct / tick
  greenDark: '#1D6B40',
  teal: '#2F7F86',      // second model accent (matching traces)
  gold: '#C98A1B',      // second, contrasting trace accent
  model: '#C9D6E3',     // enzyme silhouette fill
  modelEdge: '#3C5570',
  sub: '#F2C45A',       // substrate fill
  subEdge: '#8A6414',
};
export const BODY = "'Stem4Life Source Sans 3', 'DejaVu Sans', sans-serif";
export const DISPLAY = "'Stem4Life Manrope', 'Stem4Life Source Sans 3', 'DejaVu Sans', sans-serif";
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const rng = (seed: number) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
