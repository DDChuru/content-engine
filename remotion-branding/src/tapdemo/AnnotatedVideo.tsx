/**
 * AnnotatedVideo — the generic, data-driven annotation stitcher (VidStud).
 *
 * Renders ANY screen recording with the marks exported from tools/annotate.html
 * (tap / rect / circle / arrow / label in normalized clip-space + seconds),
 * optionally wrapped in brand bookends. Everything is props — point it at a
 * different video + marks JSON and it just works. Two layouts:
 *   • 'phone' — portrait recording in a phone bezel on the left, notes panel
 *               on the right (the original Daily Hygiene look).
 *   • 'wide'  — landscape/desktop recording filling the frame, captions as a
 *               lower-third band.
 *
 * The Daily Hygiene walkthrough is now just `hygieneProject` passed into this.
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
import { SKY, SKY_DEEP, EMERALD, BODY } from '../kit/palette';
import { Chip, Headline, BodyText } from '../kit/CaptionPanel';
import {
  BrandIntro,
  BrandOutro,
  BOOKEND_INTRO_FRAMES,
  BOOKEND_OUTRO_FRAMES,
} from '../brand/EcowizeBookends';

const PALETTE: Record<string, string> = {
  sky: SKY, skyDeep: SKY_DEEP, emerald: EMERALD, amber: '#E89A30', coral: '#D6432F',
};

export type Mark = {
  type: 'tap' | 'rect' | 'circle' | 'arrow' | 'label';
  color: string; label?: string; note?: string; atSec: number; durSec: number;
  nx: number; ny: number; nw?: number; nh?: number; nx2?: number; ny2?: number; size?: number;
};

export type Bookend = {
  intro?: { title: string; tagline?: string };
  outro?: { kicker?: string; headline?: string; body?: string; cards?: { label: string; color: string }[] };
  accentA?: string; accentB?: string;
} | null;

/** A VidStud "project" — a recording + its marks + how to frame it. */
export type VideoProject = {
  video: string;          // staticFile path, e.g. 'tapdemo/hygiene-full.mp4'
  audio?: string;         // optional voiceover, staticFile path
  fps: number;
  clipSeconds: number;    // length of the recording
  srcW: number;           // recording pixel width  (for aspect)
  srcH: number;           // recording pixel height
  marks: Mark[];
  layout?: 'phone' | 'wide';
  holdMode?: 'asDrawn' | 'holdToNext';
  bookend?: Bookend;      // null / omitted → no bookends, just the clip
};

const FRAME_W = 1920, FRAME_H = 1080;
const HOLD_MIN = 1.25, HOLD_CAP = 6.0, HOLD_GAP = 0.15;

// ─── Geometry: fit the recording into the frame for the chosen layout ─────────
type Geom = { VID_W: number; VID_H: number; X: number; Y: number; radius: number; glow: boolean; layout: 'phone' | 'wide' };

const geometry = (p: VideoProject): Geom => {
  const layout = p.layout ?? 'phone';
  const ar = p.srcW / p.srcH;
  if (layout === 'wide') {
    const maxW = FRAME_W - 160;        // 1760
    const maxH = FRAME_H - 300;        // 780 — leave a lower-third for captions
    let w = maxW, h = w / ar;
    if (h > maxH) { h = maxH; w = h * ar; }
    return { VID_W: Math.round(w), VID_H: Math.round(h), X: Math.round((FRAME_W - w) / 2), Y: 60, radius: 18, glow: false, layout };
  }
  // phone (portrait)
  const maxH = Math.round(FRAME_H * 0.876);   // 946
  let h = maxH, w = h * ar;
  const maxW = 760;
  if (w > maxW) { w = maxW; h = w / ar; }
  return { VID_W: Math.round(w), VID_H: Math.round(h), X: 250, Y: Math.round((FRAME_H - h) / 2), radius: 54, glow: true, layout };
};

type Timed = Mark & { step: number; atF: number; durF: number };

const computeTimed = (anns: Mark[], fps: number, clipSeconds: number, holdMode: 'asDrawn' | 'holdToNext'): Timed[] => {
  const sorted = anns.map((a, i) => ({ a, i })).sort((x, y) => x.a.atSec - y.a.atSec);
  return sorted.map(({ a }, k) => {
    let durSec = a.durSec;
    if (holdMode === 'holdToNext') {
      const nextAt = k < sorted.length - 1 ? sorted[k + 1].a.atSec : clipSeconds;
      const end = Math.min(nextAt - HOLD_GAP, a.atSec + HOLD_CAP);
      durSec = Math.max(HOLD_MIN, end - a.atSec);
    }
    return { ...a, step: k + 1, atF: a.atSec * fps, durF: durSec * fps };
  });
};

const clean = (s?: string) => (s || '').replace(/\s+/g, ' ').trim();

// ─── One annotation's overlay shape (in recording-px via SVG viewBox) ─────────
const Shape: React.FC<{ a: Mark; local: number; durF: number; fps: number; g: Geom }> = ({ a, local, durF, fps, g }) => {
  const { VID_W, VID_H } = g;
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
  return null; // 'label' → caption only
};

type CapTimed = Timed & { holdF: number };

// ─── Side notes panel (phone layout) ─────────────────────────────────────────
const SideCaption: React.FC<{ m: CapTimed; total: number; local: number; trail: CapTimed[] }> = ({ m, total, local, trail }) => {
  const appear = interpolate(local, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const vanish = interpolate(local, [m.holdF - 10, m.holdF], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const a = Math.min(appear, vanish);
  const col = PALETTE[m.color] || SKY;
  const text = clean(m.label);
  if (!text) return null;
  const note = clean(m.note);
  const noteAppear = Math.min(interpolate(local, [10, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), vanish);
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

// ─── Lower-third caption band (wide layout) ──────────────────────────────────
const LowerCaption: React.FC<{ m: CapTimed; total: number; local: number }> = ({ m, total, local }) => {
  const appear = interpolate(local, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const vanish = interpolate(local, [m.holdF - 10, m.holdF], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const a = Math.min(appear, vanish);
  const col = PALETTE[m.color] || SKY;
  const text = clean(m.label);
  if (!text) return null;
  const note = clean(m.note);
  const noteAppear = Math.min(interpolate(local, [10, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), vanish);
  return (
    <div style={{ position: 'absolute', left: 80, right: 80, bottom: 56, opacity: a, transform: `translateY(${(1 - appear) * 18}px)` }}>
      <div style={{ display: 'inline-block', background: 'rgba(6,13,20,0.82)', border: `1px solid ${col}55`, borderLeft: `5px solid ${col}`, borderRadius: 16, padding: '20px 30px', maxWidth: 1500, backdropFilter: 'blur(4px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: note ? 10 : 0 }}>
          <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: 22, color: col, letterSpacing: 1 }}>STEP {m.step} / {total}</span>
          <span style={{ fontFamily: BODY, fontWeight: 800, fontSize: 40, color: '#EAF2F8' }}>{text}</span>
        </div>
        {note ? <div style={{ opacity: noteAppear, fontFamily: BODY, fontSize: 28, color: 'rgba(255,255,255,0.75)', maxWidth: 1400, lineHeight: 1.35 }}>{note}</div> : null}
      </div>
    </div>
  );
};

// ─── The scene: recording + active marks + caption ───────────────────────────
const Scene: React.FC<{ project: VideoProject; g: Geom }> = ({ project, g }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, durationInFrames: 24, config: { damping: 170 } });
  const holdMode = project.holdMode ?? 'asDrawn';
  const marks = React.useMemo(() => computeTimed(project.marks, fps, project.clipSeconds, holdMode), [project.marks, fps, project.clipSeconds, holdMode]);

  const active = marks.filter((m) => frame >= m.atF - 8 && frame <= m.atF + m.durF + 8);
  const captions = React.useMemo<CapTimed[]>(() => {
    const labeled = marks.filter((m) => clean(m.label));
    return labeled.map((m, i) => ({
      ...m,
      holdF: (i + 1 < labeled.length ? labeled[i + 1].atF : project.clipSeconds * fps) - m.atF,
    }));
  }, [marks, fps, project.clipSeconds]);
  const capIdx = captions.reduce((acc, c, i) => (frame >= c.atF ? i : acc), -1);
  const captionPick = capIdx >= 0 ? captions[capIdx] : undefined;
  const trail = capIdx > 0 ? captions.slice(Math.max(0, capIdx - 3), capIdx) : [];

  const pad = 14;
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #0C1723, #071018 70%)', fontFamily: BODY }}>
      {project.audio ? <Audio src={staticFile(project.audio)} /> : null}

      {g.glow && (
        <div style={{ position: 'absolute', left: g.X - 120, top: g.Y - 40, width: g.VID_W + 240, height: g.VID_H + 80, background: 'radial-gradient(circle at 50% 40%, rgba(60,182,224,0.2), transparent 62%)', filter: 'blur(8px)' }} />
      )}
      {/* bezel / frame */}
      <div style={{ position: 'absolute', left: g.X - pad, top: g.Y - pad, width: g.VID_W + pad * 2, height: g.VID_H + pad * 2, borderRadius: g.radius + 12, background: '#05090D', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 90px rgba(0,0,0,0.5)', opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)` }} />
      {/* recording — mute only when a separate voiceover is supplied; otherwise
          play the clip's own audio (picked projects have no voiceover track) */}
      <div style={{ position: 'absolute', left: g.X, top: g.Y, width: g.VID_W, height: g.VID_H, borderRadius: g.radius, overflow: 'hidden', opacity: enter }}>
        <OffthreadVideo src={staticFile(project.video)} style={{ width: g.VID_W, height: g.VID_H, objectFit: 'cover' }} muted={!!project.audio} />
      </div>
      {/* shapes overlay (recording-px space) */}
      <svg style={{ position: 'absolute', left: g.X, top: g.Y, width: g.VID_W, height: g.VID_H, overflow: 'visible' }} viewBox={`0 0 ${g.VID_W} ${g.VID_H}`}>
        {active.map((m) => <Shape key={m.step} a={m} local={frame - m.atF} durF={m.durF} fps={fps} g={g} />)}
      </svg>
      {/* caption */}
      {captionPick && (g.layout === 'wide'
        ? <LowerCaption m={captionPick} total={captions.length} local={frame - captionPick.atF} />
        : <SideCaption m={captionPick} total={captions.length} local={frame - captionPick.atF} trail={trail} />)}
    </AbsoluteFill>
  );
};

// ─── Duration helper (used by the Composition's calculateMetadata) ───────────
export const projectFrames = (p: VideoProject): number => {
  const introF = p.bookend?.intro ? BOOKEND_INTRO_FRAMES : 0;
  const outroF = p.bookend?.outro ? BOOKEND_OUTRO_FRAMES : 0;
  return introF + Math.round(p.clipSeconds * p.fps) + outroF;
};

// ─── The generic composition ─────────────────────────────────────────────────
export const AnnotatedVideo: React.FC<VideoProject> = (project) => {
  const g = geometry(project);
  const clipF = Math.round(project.clipSeconds * project.fps);
  const bk = project.bookend;
  const introF = bk?.intro ? BOOKEND_INTRO_FRAMES : 0;
  const outroF = bk?.outro ? BOOKEND_OUTRO_FRAMES : 0;
  const accentA = bk?.accentA ?? SKY;
  const accentB = bk?.accentB ?? SKY_DEEP;
  return (
    <AbsoluteFill style={{ background: '#071018' }}>
      {bk?.intro && (
        <Sequence durationInFrames={introF}>
          <BrandIntro title={bk.intro.title} tagline={bk.intro.tagline ?? ''} accentA={accentA} accentB={accentB} />
        </Sequence>
      )}
      <Sequence from={introF} durationInFrames={clipF}>
        <Scene project={project} g={g} />
      </Sequence>
      {bk?.outro && (
        <Sequence from={introF + clipF} durationInFrames={outroF}>
          <BrandOutro
            outroKicker={bk.outro.kicker ?? ''}
            outroHeadline={bk.outro.headline ?? ''}
            outroBody={bk.outro.body ?? ''}
            outroCards={bk.outro.cards ?? []}
            accentA={accentA}
            accentB={accentB}
          />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
