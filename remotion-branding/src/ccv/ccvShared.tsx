/**
 * CCV "The Second Pair of Eyes" — shared primitives.
 *
 * Palette mirrors the e-wizer mobile Ecowize light register (lib/tokens.ts
 * lightPalette) so composed overlays are indistinguishable from real UI.
 * Fonts are the app's own Barlow Condensed (display) + DM Sans (body),
 * loaded from public/ccv-tutorial/fonts via the FontFace API.
 */
import React, { useEffect, useState } from 'react';
import {
  Img,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

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

export const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// ─── Fonts (app's own TTFs → pixel-faithful overlays) ──
// Nothing render-blocking lives at module scope: a module-level delayRender leaves a stale
// timeout behind once Remotion clears its handles between frames, and that timer cancels
// multi-frame renders ~28s later even though the fonts are loaded (proven with CDP on B).
// So: a fire-and-forget pre-warm here (no delayRender), and `useCcvFonts()` which owns one
// handle per mount and clears it on EVERY path — resolve, reject, 15s cutoff, early unmount.
const FONT_FACES: Array<[string, string, string]> = [
  ['Barlow Condensed', 'ccv-tutorial/fonts/BarlowCondensed_500Medium.ttf', '500'],
  ['Barlow Condensed', 'ccv-tutorial/fonts/BarlowCondensed_600SemiBold.ttf', '600'],
  ['Barlow Condensed', 'ccv-tutorial/fonts/BarlowCondensed_700Bold.ttf', '700'],
  ['DM Sans', 'ccv-tutorial/fonts/DMSans_400Regular.ttf', '400'],
  ['DM Sans', 'ccv-tutorial/fonts/DMSans_500Medium.ttf', '500'],
  ['DM Sans', 'ccv-tutorial/fonts/DMSans_700Bold.ttf', '700'],
];
const FONT_CUTOFF_MS = 15000;
const FONT_HANDLE_TIMEOUT_MS = 30000;

const canLoadFonts = () => typeof document !== 'undefined' && typeof FontFace !== 'undefined';

/** Add the six faces to document.fonts (idempotent per family+weight) and return their load promises. */
const loadFontFaces = (): Promise<unknown>[] => {
  const fonts = document.fonts as unknown as {
    add: (f: FontFace) => void;
    forEach: (cb: (f: FontFace) => void) => void;
  };
  const present = new Set<string>();
  fonts.forEach((f) => present.add(`${f.family}|${f.weight}`));
  return FONT_FACES.map(([family, url, weight]) => {
    const key = `${family}|${weight}`;
    if (present.has(key)) return Promise.resolve();
    const face = new FontFace(family, `url(${staticFile(url)})`, { weight });
    fonts.add(face);
    present.add(key);
    return face.load();
  });
};

// Fire-and-forget pre-warm so the first frames already have the faces — no delayRender here.
if (canLoadFonts()) {
  try {
    void Promise.allSettled(loadFontFaces());
  } catch {
    /* pre-warm is best-effort */
  }
}

/** Holds one delayRender handle while the faces load; always continues. Call once at the top of a composition. */
export const useCcvFonts = () => {
  const [handle] = useState(() => delayRender('ccv fonts', { timeoutInMilliseconds: FONT_HANDLE_TIMEOUT_MS }));
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      continueRender(handle);
    };
    if (!canLoadFonts()) {
      finish();
      return finish;
    }
    const cutoff = setTimeout(finish, FONT_CUTOFF_MS);
    let loads: Promise<unknown>[];
    try {
      loads = loadFontFaces();
    } catch {
      loads = [];
    }
    Promise.allSettled(loads).then(finish, finish);
    return () => {
      clearTimeout(cutoff);
      finish(); // unmounted early — never leave the handle open
    };
  }, [handle]);
};

// ─── Still geometry ────────────────────────────────────
export const STILL_W = 1344;
export const STILL_H = 2992;
export const CROP_TOP = 108; // Android status bar

export type ShotOverlay = (mapper: {
  sx: (x: number) => number;
  sy: (y: number) => number;
  s: (v: number) => number;
}) => React.ReactNode;

/**
 * Phone bezel showing a stack of stills. `shots` cross-fade by weight;
 * `pan` shifts the still vertically (in still px, 0 = status-bar crop top).
 * Children callbacks receive still→screen coordinate mappers for rings/taps.
 */
export const Phone: React.FC<{
  x: number;
  y: number;
  height: number;
  shots: Array<{ src: string; opacity: number }>;
  pan?: number;
  /** Visible still-height in still px (< STILL_H-CROP_TOP zooms in and makes pan meaningful). */
  window?: number;
  tilt?: number;
  entrance?: number; // 0..1, slides up + fades
  overlay?: ShotOverlay;
}> = ({ x, y, height, shots, pan = 0, window: visibleWindow, tilt = 0, entrance = 1, overlay }) => {
  const win = visibleWindow ?? STILL_H - CROP_TOP;
  const maxPan = STILL_H - CROP_TOP - win;
  const safePan = Math.min(Math.max(pan, 0), Math.max(maxPan, 0));
  const scale = height / win;
  const width = STILL_W * scale;
  const sx = (v: number) => v * scale;
  const sy = (v: number) => (v - CROP_TOP - safePan) * scale;
  const mapper = { sx, sy, s: (v: number) => v * scale };

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        opacity: entrance,
        transform: `translateY(${(1 - entrance) * 46}px) perspective(2600px) rotateY(${tilt}deg)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -14,
          top: -14,
          width: width + 28,
          height: height + 28,
          borderRadius: 46,
          background: 'linear-gradient(145deg, #2b3846, #0b1016)',
          boxShadow: '0 42px 120px rgba(0,0,0,0.6)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 34,
          overflow: 'hidden',
          background: CANVAS,
          boxShadow: '0 0 0 3px rgba(255,255,255,0.09)',
        }}
      >
        {shots.map(
          (shot) =>
            shot.opacity > 0.004 && (
              <Img
                key={shot.src}
                src={staticFile(`ccv-tutorial/shots/${shot.src}`)}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: -(CROP_TOP + safePan) * scale,
                  width,
                  height: STILL_H * scale,
                  opacity: shot.opacity,
                }}
              />
            ),
        )}
        {overlay?.(mapper)}
      </div>
    </div>
  );
};

/** Pulsing focus ring, positioned in still coordinates via the Phone mapper. */
export const Ring: React.FC<{
  box: { x: number; y: number; w: number; h: number };
  color?: string;
  appear: number; // 0..1
  mapper: { sx: (x: number) => number; sy: (y: number) => number; s: (v: number) => number };
}> = ({ box, color = SKY, appear, mapper }) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);
  const rgb = hexToRgb(color);
  const scale = interpolate(appear, [0, 1], [1.4, 1]);
  if (appear <= 0.004) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: mapper.sx(box.x) - 8,
        top: mapper.sy(box.y) - 8,
        width: mapper.s(box.w) + 16,
        height: mapper.s(box.h) + 16,
        borderRadius: 16,
        border: `4px solid rgba(${rgb},${0.55 + pulse * 0.4})`,
        // faint fill only — must never obscure the text it annotates
        background: `rgba(${rgb},${0.04 + pulse * 0.02})`,
        boxShadow: `0 0 ${18 + pulse * 22}px rgba(${rgb},0.6)`,
        opacity: appear,
        transform: `scale(${scale})`,
        pointerEvents: 'none',
      }}
    />
  );
};

/** Touch ripple used before a state change on a still. */
export const Tap: React.FC<{
  cx: number;
  cy: number;
  progress: number; // 0..1
  mapper: { sx: (x: number) => number; sy: (y: number) => number; s: (v: number) => number };
}> = ({ cx, cy, progress, mapper }) => {
  if (progress <= 0 || progress >= 1) return null;
  const r = interpolate(progress, [0, 1], [16, 74]);
  const op = interpolate(progress, [0, 0.25, 1], [0, 0.85, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        left: mapper.sx(cx) - r,
        top: mapper.sy(cy) - r,
        width: r * 2,
        height: r * 2,
        borderRadius: r,
        border: `4px solid rgba(${hexToRgb(SKY)},${op})`,
        background: `rgba(${hexToRgb(SKY)},${op * 0.25})`,
        pointerEvents: 'none',
      }}
    />
  );
};

// ─── The iris motif ────────────────────────────────────
/**
 * Cyan iris: outer ring + iris blades that open/close.
 * openness 0 = shut (lid closed), 1 = fully open.
 * flicker adds failure jitter (beat 1).
 */
export const Iris: React.FC<{
  cx: number;
  cy: number;
  r: number;
  openness: number;
  glow?: number; // 0..1 extra glow
  flicker?: number; // 0..1
}> = ({ cx, cy, r, openness, glow = 0.6, flicker = 0 }) => {
  const frame = useCurrentFrame();
  const jitter =
    flicker > 0
      ? flicker * (0.5 + 0.5 * Math.sin(frame * 2.7)) * (0.4 + 0.6 * Math.abs(Math.sin(frame * 1.13)))
      : 0;
  const open = clamp01(openness - jitter * 0.7);
  const alpha = clamp01(0.35 + open * 0.65 - jitter * 0.5);
  const rgb = hexToRgb(SKY);
  if (openness <= 0.002) return null;
  return (
    <div style={{ position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, pointerEvents: 'none' }}>
      <svg width={r * 2} height={r * 2} viewBox="0 0 200 200">
        {/* outer ring */}
        <circle cx={100} cy={100} r={92} fill="none" stroke={`rgba(${rgb},${alpha})`} strokeWidth={3.4} />
        <circle
          cx={100}
          cy={100}
          r={92}
          fill="none"
          stroke={`rgba(${rgb},${alpha * 0.5})`}
          strokeWidth={10}
          style={{ filter: 'blur(6px)' }}
        />
        {/* aperture: two lids closing from top/bottom */}
        <g>
          <ellipse cx={100} cy={100} rx={80} ry={80 * open} fill="none" stroke={`rgba(${rgb},${alpha})`} strokeWidth={2.6} />
          <ellipse
            cx={100}
            cy={100}
            rx={58}
            ry={58 * open}
            fill={`rgba(${rgb},${0.08 * open})`}
            stroke={`rgba(${rgb},${alpha * 0.75})`}
            strokeWidth={1.8}
          />
          {/* pupil */}
          <circle cx={100} cy={100} r={13 * open} fill={`rgba(${rgb},${alpha})`} style={{ filter: 'blur(0.4px)' }} />
        </g>
        {/* tick marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 + frame * 0.003;
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * 86}
              y1={100 + Math.sin(a) * 86}
              x2={100 + Math.cos(a) * 79}
              y2={100 + Math.sin(a) * 79}
              stroke={`rgba(${rgb},${alpha * 0.75})`}
              strokeWidth={2}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: -r * 0.35,
          borderRadius: '50%',
          boxShadow: `0 0 ${r * 0.9 * glow}px rgba(${rgb},${0.4 * glow * open})`,
        }}
      />
    </div>
  );
};

// ─── Right-panel typography kit ────────────────────────
export const ChipLabel: React.FC<{ text: string; color?: string; appear: number }> = ({
  text,
  color = SKY,
  appear,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: 50,
      padding: '0 22px',
      borderRadius: 999,
      background: `rgba(${hexToRgb(color)},0.14)`,
      border: `1px solid rgba(${hexToRgb(color)},0.45)`,
      color,
      fontFamily: DISPLAY,
      fontSize: 26,
      fontWeight: 600,
      letterSpacing: 2.6,
      textTransform: 'uppercase',
      opacity: appear,
      transform: `translateY(${(1 - appear) * 14}px)`,
    }}
  >
    {text}
  </div>
);

export const Headline: React.FC<{
  text: string;
  appear: number;
  size?: number;
  width?: number;
}> = ({ text, appear, size = 74, width = 940 }) => (
  <div
    style={{
      marginTop: 26,
      width,
      color: '#fff',
      fontFamily: DISPLAY,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.0,
      letterSpacing: 0.4,
      textShadow: '0 10px 34px rgba(0,0,0,0.4)',
      opacity: appear,
      transform: `translateY(${(1 - appear) * 22}px)`,
    }}
  >
    {text}
  </div>
);

export const BodyText: React.FC<{ text: string; appear: number; width?: number; size?: number }> = ({
  text,
  appear,
  width = 880,
  size = 32,
}) => (
  <div
    style={{
      marginTop: 22,
      width,
      color: 'rgba(255,255,255,0.74)',
      fontFamily: BODY,
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1.34,
      opacity: appear,
    }}
  >
    {text}
  </div>
);

/** Small proof chip with a glowing dot (hygiene-template idiom). */
export const ProofChip: React.FC<{ text: string; color?: string; appear: number }> = ({
  text,
  color = SKY,
  appear,
}) => (
  <div
    style={{
      marginTop: 26,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 13,
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.13)',
      borderRadius: 16,
      padding: '13px 19px',
      color: '#fff',
      fontFamily: BODY,
      fontSize: 25,
      fontWeight: 700,
      opacity: appear,
    }}
  >
    <div style={{ width: 13, height: 13, borderRadius: 7, background: color, boxShadow: `0 0 18px ${color}` }} />
    {text}
  </div>
);

// ─── Scene chrome ──────────────────────────────────────
export const SceneBackdrop: React.FC<{ variant?: 'default' | 'deep' }> = ({ variant = 'default' }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background:
        variant === 'deep'
          ? 'radial-gradient(circle at 50% 42%, rgba(60,182,224,0.10), transparent 42%), linear-gradient(160deg, #0a141d, #04080c 70%)'
          : 'radial-gradient(circle at 22% 16%, rgba(60,182,224,0.16), transparent 28%), radial-gradient(circle at 84% 80%, rgba(31,156,90,0.11), transparent 30%), linear-gradient(135deg, #111d28, #071018 58%, #05090d)',
    }}
  />
);

export const Wordmark: React.FC<{ progress: number }> = ({ progress }) => (
  <>
    <div
      style={{
        position: 'absolute',
        left: 560,
        bottom: 46,
        color: 'rgba(255,255,255,0.42)',
        fontFamily: DISPLAY,
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: 3,
        textTransform: 'uppercase',
      }}
    >
      e-wizer field guide — chemical concentration verification
    </div>
    <div
      style={{
        position: 'absolute',
        left: 560,
        right: 84,
        bottom: 30,
        height: 7,
        borderRadius: 999,
        background: 'rgba(255,255,255,0.10)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${clamp01(progress) * 100}%`,
          height: '100%',
          borderRadius: 999,
          background: `linear-gradient(90deg, ${SKY}, ${EMERALD})`,
          boxShadow: '0 0 22px rgba(60,182,224,0.45)',
        }}
      />
    </div>
  </>
);

// ─── Recreated app atoms (match the real screens) ──────
/** App-style status badge, e.g. NEEDS VERIFY / DUE NOW / OPEN. */
export const AppBadge: React.FC<{
  text: string;
  color: string;
  size?: number;
  appear?: number;
  dot?: boolean;
}> = ({ text, color, size = 26, appear = 1, dot = true }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.4,
      background: `rgba(${hexToRgb(color)},0.15)`,
      borderRadius: 10,
      padding: `${size * 0.32}px ${size * 0.66}px`,
      opacity: appear,
      transform: `scale(${0.6 + 0.4 * appear})`,
    }}
  >
    {dot && <div style={{ width: size * 0.32, height: size * 0.32, borderRadius: size, background: color }} />}
    <div
      style={{
        color,
        fontFamily: DISPLAY,
        fontWeight: 600,
        fontSize: size,
        letterSpacing: size * 0.08,
      }}
    >
      {text}
    </div>
  </div>
);

/** The app's cyan primary button. */
export const AppButton: React.FC<{
  text: string;
  width?: number;
  height?: number;
  fontSize?: number;
  disabled?: boolean;
  glow?: number;
}> = ({ text, width = 560, height = 84, fontSize = 27, disabled = false, glow = 0 }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 18,
      background: disabled ? '#B9C4CE' : SKY,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: disabled ? 'rgba(255,255,255,0.85)' : '#fff',
      fontFamily: DISPLAY,
      fontWeight: 600,
      fontSize,
      letterSpacing: 2.4,
      boxShadow: glow > 0 ? `0 0 ${18 + glow * 26}px rgba(${hexToRgb(SKY)},${0.35 + glow * 0.3})` : undefined,
    }}
  >
    {text}
  </div>
);

/** Cyan spec hero, exactly like the verify screen's APPROVED RANGE card. */
export const SpecHero: React.FC<{
  label: string;
  value: string;
  method: string;
  width?: number;
  scale?: number;
}> = ({ label, value, method, width = 620, scale = 1 }) => (
  <div
    style={{
      width,
      borderRadius: 22 * scale,
      background: 'rgba(60,182,224,0.10)',
      border: '1px solid rgba(60,182,224,0.30)',
      padding: `${30 * scale}px ${24 * scale}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <div
      style={{
        color: SKY_DEEP,
        fontFamily: DISPLAY,
        fontWeight: 600,
        fontSize: 22 * scale,
        letterSpacing: 3 * scale,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
    <div
      style={{
        marginTop: 12 * scale,
        color: SKY_DEEP,
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: 64 * scale,
        letterSpacing: -0.5,
        lineHeight: 1.02,
      }}
    >
      {value}
    </div>
    <div style={{ marginTop: 12 * scale, color: FG2, fontFamily: BODY, fontSize: 21 * scale }}>{method}</div>
  </div>
);

/** Light-register card container for recreated app UI. */
export const AppCard: React.FC<{
  width: number;
  children: React.ReactNode;
  padding?: number;
  style?: React.CSSProperties;
}> = ({ width, children, padding = 26, style }) => (
  <div
    style={{
      width,
      borderRadius: 22,
      background: SURFACE,
      border: `1px solid ${APP_BORDER}`,
      boxShadow: '0 22px 60px rgba(0,0,0,0.35)',
      padding,
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── Motion helpers ────────────────────────────────────
export const useLocalSpring = (startFrame: number, durationInFrames = 26, damping = 180) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - startFrame, fps, durationInFrames, config: { damping } });
};

export const easeInOut = (t: number) => {
  const v = clamp01(t);
  return v * v * (3 - 2 * v);
};

/** Progress 0..1 between two absolute seconds, given local scene seconds. */
export const seg = (sec: number, from: number, to: number) => clamp01((sec - from) / Math.max(to - from, 0.0001));
