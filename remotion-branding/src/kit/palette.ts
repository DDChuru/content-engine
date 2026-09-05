/**
 * TutorialKit — shared design tokens + frame-math helpers.
 *
 * The colour tokens are the Ecowize light register (mirrors e-wizer mobile
 * lib/tokens.ts lightPalette + the video ink), copied verbatim from the
 * per-video compositions (src/ccv/ccvShared.tsx) so extracted overlays stay
 * pixel-indistinguishable from the real app UI. This is the single place the
 * tokens live for every data-driven tutorial.
 *
 * Fonts are the app's own Barlow Condensed (display) + DM Sans (body), loaded
 * from public/<fontsBase>/fonts via the FontFace API (delayRender-gated so the
 * first frame renders with the correct type).
 */
import { continueRender, delayRender, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

// ─── Palette (Ecowize light register + video ink) ──────
export const SKY = '#3CB6E0';
export const SKY_DEEP = '#1582AB';
export const SKY_TINT = '#E5F4FB';
export const EMERALD = '#1F9C5A';
export const EMERALD_TINT = '#DCEFE3';
export const AMBER = '#E89A30';
export const AMBER_TINT = '#FBEEDB';
export const CORAL = '#D6432F';
export const CORAL_TINT = '#F8DDD8';
export const CANVAS = '#F2F5F8';
export const SURFACE = '#FFFFFF';
export const APP_BORDER = '#E1E6EC';
export const FG = '#181F26';
export const FG2 = '#4A5563';
export const MUTED = '#8A93A0';
export const INK = '#071018';
export const PANEL = '#0E1822';

export const DISPLAY = '"Barlow Condensed", "Arial Narrow", sans-serif';
export const BODY = '"DM Sans", Inter, system-ui, sans-serif';

/** Named box colours (beats.json `boxes[].color`) → palette hex. */
export const BOX_COLORS: Record<string, string> = {
  sky: SKY,
  skyDeep: SKY_DEEP,
  emerald: EMERALD,
  amber: AMBER,
  coral: CORAL,
};

/** Resolve a beats.json colour name (or raw hex) to a hex string. */
export const resolveColor = (name?: string): string =>
  (name && (BOX_COLORS[name] ?? (name.startsWith('#') ? name : undefined))) || SKY;

// ─── Frame-math helpers (all deterministic, no CSS animation) ──
export const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const easeInOut = (t: number) => {
  const v = clamp01(t);
  return v * v * (3 - 2 * v);
};

/** Progress 0..1 between two absolute seconds, given a scene-local seconds clock. */
export const seg = (sec: number, from: number, to: number) =>
  clamp01((sec - from) / Math.max(to - from, 0.0001));

/** Spring-driven progress for "physical" entrances (snaps, rings, stamps) — the
 * counterpart to `easeInOut`/`seg` (UI motion). `startFrame` is scene-local. */
export const useLocalSpring = (startFrame: number, durationInFrames = 26, damping = 180) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - startFrame, fps, durationInFrames, config: { damping } });
};

/** 1→0 fade over the last `fade` seconds of a scene, given scene-local seconds
 * and the scene's total duration in seconds. The shared "no hard cuts" tail. */
export const fadeTail = (sceneSec: number, sceneDurSec: number, fade = 0.4) =>
  1 - seg(sceneSec, sceneDurSec - fade, sceneDurSec);

// ─── Fonts (app's own TTFs → pixel-faithful overlays) ──
/**
 * Loads the Ecowize brand fonts once. The TTFs currently live under
 * public/ccv-tutorial/fonts (the first video to ship the kit); pass a
 * different base when a later video vendors its own copy.
 */
let fontsLoaded = false;
export const ensureKitFonts = (fontsBase = 'ccv-tutorial/fonts') => {
  if (fontsLoaded || typeof document === 'undefined') return;
  fontsLoaded = true;
  const handle = delayRender('tutorialkit fonts');
  const faces: Array<[string, string, string]> = [
    ['Barlow Condensed', `${fontsBase}/BarlowCondensed_500Medium.ttf`, '500'],
    ['Barlow Condensed', `${fontsBase}/BarlowCondensed_600SemiBold.ttf`, '600'],
    ['Barlow Condensed', `${fontsBase}/BarlowCondensed_700Bold.ttf`, '700'],
    ['DM Sans', `${fontsBase}/DMSans_400Regular.ttf`, '400'],
    ['DM Sans', `${fontsBase}/DMSans_500Medium.ttf`, '500'],
    ['DM Sans', `${fontsBase}/DMSans_700Bold.ttf`, '700'],
  ];
  Promise.all(
    faces.map(([family, url, weight]) => {
      const face = new FontFace(family, `url(${staticFile(url)})`, { weight });
      (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};

// ─── Still geometry (Pixel-emulator capture defaults) ──
export const STILL_W = 1344;
export const STILL_H = 2992;
export const CROP_TOP = 108; // Android status bar
