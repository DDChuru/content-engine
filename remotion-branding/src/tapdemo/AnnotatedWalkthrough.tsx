/**
 * AnnotatedWalkthrough — the data-driven stitcher.
 *
 * Reads a storyboard JSON exported from tools/annotate.html (tap / rect /
 * circle / arrow / label marks in normalized clip-space + seconds) and renders
 * it over the real screen recording, wrapped in the Ecowize bookends. This is
 * the motion version of DailyHygieneTutorial — the on-screen teaching overlays
 * and the caption/narration cues both come straight from the exported marks.
 *
 * Everything is data: change the JSON, re-render. No per-video code.
 */
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { SKY, SKY_DEEP, EMERALD, DISPLAY, BODY } from '../kit/palette';
import { Chip, Headline, BodyText } from '../kit/CaptionPanel';
import {
  BrandIntro,
  BrandOutro,
  BOOKEND_INTRO_FRAMES,
  BOOKEND_OUTRO_FRAMES,
} from '../brand/EcowizeBookends';
import doc from './hygiene-walkthrough.json';

const PALETTE: Record<string, string> = {
  sky: SKY, skyDeep: SKY_DEEP, emerald: EMERALD, amber: '#E89A30', coral: '#D6432F',
};

type Ann = {
  type: 'tap' | 'rect' | 'circle' | 'arrow' | 'label';
  color: string; label?: string; note?: string; atSec: number; durSec: number;
  nx: number; ny: number; nw?: number; nh?: number; nx2?: number; ny2?: number; size?: number;
};

const CLIP = 'tapdemo/hygiene-full.mp4';
const CLIP_AUDIO = 'tapdemo/hygiene-audio.m4a'; // the operator's live voice
const CLIP_FRAMES = 7214; // 240.47s @ 30fps
const CLIP_SECONDS = 240.47;

// Timing modes:
//   'asDrawn'    — respect each mark's authored durSec from the tool (default;
//                  for a full 1:1 walkthrough the operator's own voice sets pace)
//   'holdToNext' — auto-extend each mark until the next is due (min/cap/gap), for
//                  cuts where you want no bare gaps between steps
const HOLD_MODE: 'asDrawn' | 'holdToNext' = 'asDrawn';
const HOLD_MIN = 1.25;
const HOLD_CAP = 6.0;
const HOLD_GAP = 0.15;

type Timed = Ann & { step: number; atF: number; durF: number };

const computeTimed = (anns: Ann[], fps: number): Timed[] => {
  const sorted = anns.map((a, i) => ({ a, i })).sort((x, y) => x.a.atSec - y.a.atSec);
  return sorted.map(({ a }, k) => {
    let durSec = a.durSec;
    if (HOLD_MODE === 'holdToNext') {
      const nextAt = k < sorted.length - 1 ? sorted[k + 1].a.atSec : CLIP_SECONDS;
      const end = Math.min(nextAt - HOLD_GAP, a.atSec + HOLD_CAP);
      durSec = Math.max(HOLD_MIN, end - a.atSec);
    }
    return { ...a, step: k + 1, atF: a.atSec * fps, durF: durSec * fps };
  });
};

// Phone geometry inside 1920×1080
const SRC_W = 660, SRC_H = 1434, SCALE = 0.66;
const VID_W = Math.round(SRC_W * SCALE);   // 436
const VID_H = Math.round(SRC_H * SCALE);   // 946
const PHONE_X = 250;
const PHONE_Y = Math.round((1080 - VID_H) / 2); // 67
const BEZEL_PAD = 14;

const clean = (s?: string) => (s || '').replace(/\s+/g, ' ').trim();

// ─── One annotation's overlay shape (in phone-screen px via SVG viewBox) ──────
const Shape: React.FC<{ a: Ann; local: number; durF: number; fps: number }> = ({ a, local, durF, fps }) => {
  const appear = interpolate(local, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const vanish = interpolate(local, [durF - 8, durF], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const op = Math.min(appear, vanish);
  const col = PALETTE[a.color] || SKY;
  const sw = 6;

  if (a.type === 'tap') {
    const cx = a.nx * VID_W, cy = a.ny * VID_H, base = (a.size ?? 0.16) * VID_W;
    const rings = [0, 9].map((off, i) => {
      const l = local - off;
      const p = interpolate(l, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      const o = interpolate(l, [0, 5, 30], [0, 0.8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      return { i, r: base * (0.5 + p * 0.9), o: o * vanish };
    });
    const pop = spring({ frame: local, fps, durationInFrames: 14, config: { damping: 140 } });
    return (
      <g>
        {rings.map(({ i, r, o }) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth={sw} opacity={o} />
        ))}
        <circle cx={cx} cy={cy} r={base * 0.28} fill={col} opacity={op} transform={`scale(${0.6 + pop * 0.4})`} style={{ transformOrigin: `${cx}px ${cy}px` }} />
      </g>
    );
  }
  if (a.type === 'rect') {
    const x = a.nx * VID_W, y = a.ny * VID_H, w = (a.nw ?? 0.2) * VID_W, h = (a.nh ?? 0.08) * VID_H;
    const grow = interpolate(appear, [0, 1], [0.985, 1]);
    return (
      <g opacity={op}>
        <rect x={x} y={y} width={w} height={h} rx={12} fill={col} opacity={0.1} />
        <rect x={x} y={y} width={w} height={h} rx={12} fill="none" stroke={col} strokeWidth={sw}
          style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px`, transform: `scale(${grow})` }} />
      </g>
    );
  }
  if (a.type === 'circle') {
    const cx = (a.nx + (a.nw ?? 0.2) / 2) * VID_W, cy = (a.ny + (a.nh ?? 0.1) / 2) * VID_H;
    const rx = (a.nw ?? 0.2) * VID_W / 2, ry = (a.nh ?? 0.1) * VID_H / 2;
    return (
      <g opacity={op}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={col} opacity={0.1} />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={col} strokeWidth={sw} />
      </g>
    );
  }
  if (a.type === 'arrow') {
    const x1 = a.nx * VID_W, y1 = a.ny * VID_H, x2 = (a.nx2 ?? a.nx + 0.14) * VID_W, y2 = (a.ny2 ?? a.ny - 0.1) * VID_H;
    const grow = interpolate(appear, [0, 1], [0, 1]);
    const ex = x1 + (x2 - x1) * grow, ey = y1 + (y2 - y1) * grow;
    const ang = Math.atan2(ey - y1, ex - x1), ah = VID_W * 0.03;
    return (
      <g opacity={op} stroke={col} strokeWidth={sw} strokeLinecap="round" fill="none">
        <line x1={x1} y1={y1} x2={ex} y2={ey} />
        <path d={`M ${ex} ${ey} L ${ex - ah * Math.cos(ang - 0.4)} ${ey - ah * Math.sin(ang - 0.4)} M ${ex} ${ey} L ${ex - ah * Math.cos(ang + 0.4)} ${ey - ah * Math.sin(ang + 0.4)}`} />
      </g>
    );
  }
  return null; // 'label' → caption only, no shape
};

// ─── Side notes panel — the "minimal notes" kit from the previous videos ─────
// Captions run on their own clock, decoupled from the on-phone shape's durSec:
// each note holds until the next labeled mark begins (holdF), so the panel is
// never blank mid-narration. Below the live note, the last few completed steps
// stay visible as a dimmed ✓ trail — the story accumulates as the voice goes.
type CapTimed = Timed & { holdF: number };

const Caption: React.FC<{ m: CapTimed; total: number; local: number; trail: CapTimed[] }> = ({ m, total, local, trail }) => {
  const appear = interpolate(local, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const vanish = interpolate(local, [m.holdF - 10, m.holdF], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const a = Math.min(appear, vanish);
  const col = PALETTE[m.color] || SKY;
  const text = clean(m.label);
  if (!text) return null;
  const note = clean(m.note);
  // the note body cascades in just after the headline
  const noteAppear = Math.min(interpolate(local, [10, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), vanish);
  // scale the headline down as the note gets longer so it always fits the panel
  const size = text.length > 64 ? 46 : text.length > 42 ? 54 : text.length > 26 ? 64 : 74;
  return (
    <div style={{ position: 'absolute', left: 838, top: 180, width: 940 }}>
      <Chip n={m.step} label={`Step ${m.step} of ${total}`} color={col} appear={appear} />
      <Headline text={text} appear={a} size={size} width={940} />
      {note ? <BodyText text={note} appear={noteAppear} width={880} size={34} /> : null}
      {trail.length > 0 && (
        <div style={{ marginTop: 46, opacity: vanish }}>
          {trail.map((t, i) => {
            const isNewest = i === trail.length - 1;
            // only the newest arrival animates in — older lines sit still
            const o = isNewest ? interpolate(local, [8, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
            return (
              <div key={t.step} style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 14, fontFamily: BODY, fontSize: 27, fontWeight: 500, color: 'rgba(255,255,255,0.42)', opacity: o, transform: `translateY(${(1 - o) * 10}px)` }}>
                <span style={{ color: PALETTE[t.color] || SKY, opacity: 0.85, fontWeight: 700 }}>✓</span>
                <span>{clean(t.label)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── The walkthrough scene: phone + video + all active marks + caption ───────
const WalkScene: React.FC<{ anns: Ann[] }> = ({ anns }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, durationInFrames: 24, config: { damping: 170 } });
  const marks = React.useMemo(() => computeTimed(anns, fps), [anns, fps]);

  // active marks at this clip frame
  const active = marks.filter((m) => frame >= m.atF - 8 && frame <= m.atF + m.durF + 8);
  // caption timeline: each labeled mark holds the panel until the next one starts
  // (the last one holds to the end of the clip) — independent of the shape's durSec
  const captions = React.useMemo<CapTimed[]>(() => {
    const labeled = marks.filter((m) => clean(m.label));
    return labeled.map((m, i) => ({
      ...m,
      holdF: (i + 1 < labeled.length ? labeled[i + 1].atF : CLIP_SECONDS * fps) - m.atF,
    }));
  }, [marks, fps]);
  const capIdx = captions.reduce((acc, c, i) => (frame >= c.atF ? i : acc), -1);
  const captionPick = capIdx >= 0 ? captions[capIdx] : undefined;
  // the ✓ story trail: up to the last 3 completed steps
  const trail = capIdx > 0 ? captions.slice(Math.max(0, capIdx - 3), capIdx) : [];

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #0C1723, #071018 70%)', fontFamily: BODY }}>
      {/* the operator's live voice, aligned to the recording */}
      <Audio src={staticFile(CLIP_AUDIO)} />

      <div style={{ position: 'absolute', left: PHONE_X - 120, top: PHONE_Y - 40, width: VID_W + 240, height: VID_H + 80, background: 'radial-gradient(circle at 50% 40%, rgba(60,182,224,0.2), transparent 62%)', filter: 'blur(8px)' }} />
      {/* bezel */}
      <div style={{ position: 'absolute', left: PHONE_X - BEZEL_PAD, top: PHONE_Y - BEZEL_PAD, width: VID_W + BEZEL_PAD * 2, height: VID_H + BEZEL_PAD * 2, borderRadius: 54, background: '#05090D', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 90px rgba(0,0,0,0.5)', opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)` }} />
      {/* recording */}
      <div style={{ position: 'absolute', left: PHONE_X, top: PHONE_Y, width: VID_W, height: VID_H, borderRadius: 42, overflow: 'hidden', opacity: enter }}>
        <OffthreadVideo src={staticFile(CLIP)} style={{ width: VID_W, height: VID_H, objectFit: 'cover' }} muted />
      </div>
      {/* shapes overlay (phone-screen px space) */}
      <svg style={{ position: 'absolute', left: PHONE_X, top: PHONE_Y, width: VID_W, height: VID_H, overflow: 'visible' }} viewBox={`0 0 ${VID_W} ${VID_H}`}>
        {active.map((m) => <Shape key={m.step} a={m} local={frame - m.atF} durF={m.durF} fps={fps} />)}
      </svg>
      {/* notes panel */}
      {captionPick && <Caption m={captionPick} total={captions.length} local={frame - captionPick.atF} trail={trail} />}
    </AbsoluteFill>
  );
};

// ─── Full composition ────────────────────────────────────────────────────────
export const WALK_FPS = 30;
export const WALK_FRAMES = BOOKEND_INTRO_FRAMES + CLIP_FRAMES + BOOKEND_OUTRO_FRAMES;

export const AnnotatedWalkthrough: React.FC = () => {
  const anns = (doc.annotations as Ann[]);
  return (
    <AbsoluteFill style={{ background: '#071018' }}>
      <Sequence durationInFrames={BOOKEND_INTRO_FRAMES}>
        <BrandIntro title="Daily Hygiene Checks" tagline="How to run the shift hygiene check, step by step — on the real app." accentA={SKY} accentB={SKY_DEEP} />
      </Sequence>
      <Sequence from={BOOKEND_INTRO_FRAMES} durationInFrames={CLIP_FRAMES}>
        <WalkScene anns={anns} />
      </Sequence>
      <Sequence from={BOOKEND_INTRO_FRAMES + CLIP_FRAMES} durationInFrames={BOOKEND_OUTRO_FRAMES}>
        <BrandOutro outroKicker="e-wizer field guide" outroHeadline="That's a Daily Hygiene check" outroBody="Confirm who's present, clear or flag each operative, then complete the session." outroCards={[{ label: 'Present', color: SKY }, { label: 'Clear / flag', color: EMERALD }, { label: 'Complete', color: SKY_DEEP }]} accentA={SKY} accentB={SKY_DEEP} />
      </Sequence>
    </AbsoluteFill>
  );
};
