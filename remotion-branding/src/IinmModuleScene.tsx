import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  staticFile,
  interpolate,
  useCurrentFrame,
} from 'remotion';

/**
 * Scene 2 — "Meet e-wizer: your guide through every incident".
 * Walks ALL FOUR classification cards on the REAL app, clicking each, showing
 * e-wizer's real explainer + the categorisation that follows. Pixel-accurate
 * annotations (rings use captured boundingBoxes). ~89s @ 30fps. durationInFrames = 2670.
 *
 * FACT: every incident is recorded; only serious ones ALSO go to the Dept of Labour (§24).
 */

const TEAL = '20,184,166';
const AMBER = '245,158,11';
const INK = '#0F172A';
const FONT = 'Helvetica Neue, Helvetica, Arial, sans-serif';
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// captured boxes (CSS px == video px)
const CARDS: Record<string, { x: number; y: number; w: number; h: number }> = {
  injury: { x: 757, y: 263, w: 310, h: 100 },
  health: { x: 1077, y: 263, w: 310, h: 100 },
  property: { x: 757, y: 373, w: 310, h: 84 },
  nearmiss: { x: 1077, y: 373, w: 310, h: 84 },
};
const RAILS: Record<string, { x: number; y: number; w: number; h: number }> = {
  welcome: { x: 1600, y: 96, w: 300, h: 200 },
  injury: { x: 1600, y: 96, w: 300, h: 346 },
  health: { x: 1600, y: 96, w: 300, h: 289 },
  property: { x: 1600, y: 96, w: 300, h: 289 },
  nearmiss: { x: 1600, y: 96, w: 300, h: 289 },
};
const EDITOR = { pills: { x: 512, y: 294, w: 575, h: 34 }, s24: { x: 712, y: 356, w: 486, h: 40 } };

const ctr = (b: { x: number; y: number; w: number; h: number }) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

type Beat = { key: string; still: string; in: number; out: number; click: number; cap: string };
const BEATS: Beat[] = [
  { key: 'injury', still: 'cat-injury.png', in: 270, out: 810, click: 250, cap: 'Injury → captured. Serious (>13 days) → Section 24 to the DoL.' },
  { key: 'health', still: 'cat-health.png', in: 810, out: 1260, click: 790, cap: 'Personal health event → recorded & investigated.' },
  { key: 'property', still: 'cat-property.png', in: 1260, out: 1620, click: 1240, cap: 'Property / machine damage → logged. Today’s damage, tomorrow’s injury.' },
  { key: 'nearmiss', still: 'cat-nearmiss.png', in: 1620, out: 2280, click: 1600, cap: 'Near miss → the cheapest lesson you’ll ever get.' },
];
const XF = 50; // crossfade length

export const IinmModuleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 15);

  const ring = (b: { x: number; y: number; w: number; h: number }, color: string, op: number, pad = 8, radius = 16) =>
    op <= 0 ? null : (
      <div style={{ position: 'absolute', left: b.x - pad, top: b.y - pad, width: b.w + pad * 2, height: b.h + pad * 2, borderRadius: radius, border: `4px solid rgba(${color},${0.5 + pulse * 0.45})`, boxShadow: `0 0 ${16 + pulse * 22}px rgba(${color},0.5)`, opacity: op, pointerEvents: 'none' }} />
    );
  const tag = (text: string, left: number, top: number, op: number, color = TEAL, dark = false) =>
    op <= 0 ? null : (
      <div style={{ position: 'absolute', left, top, opacity: op, background: `rgb(${color})`, color: dark ? '#3b2607' : 'white', fontWeight: 800, fontSize: 22, padding: '9px 16px', borderRadius: 12, boxShadow: `0 10px 24px rgba(${color},0.4)`, whiteSpace: 'nowrap' }}>{text}</div>
    );

  // still opacities
  const opWelcome = interpolate(frame, [270, 270 + XF], [1, 0], clamp);
  const opInjury = interpolate(frame, [270, 270 + XF, 810, 810 + XF], [0, 1, 1, 0], clamp);
  const opHealth = interpolate(frame, [810, 810 + XF, 1260, 1260 + XF], [0, 1, 1, 0], clamp);
  const opProperty = interpolate(frame, [1260, 1260 + XF, 1620, 1620 + XF], [0, 1, 1, 0], clamp);
  const opNearmiss = interpolate(frame, [1620, 1620 + XF, 2280, 2280 + XF], [0, 1, 1, 0], clamp);
  const opEditor = interpolate(frame, [2280, 2280 + XF], [0, 1], clamp);

  // cursor hops card → card
  const cx = interpolate(frame, [170, 250, 700, 790, 1150, 1240, 1510, 1600], [1320, ctr(CARDS.injury).x, ctr(CARDS.injury).x, ctr(CARDS.health).x, ctr(CARDS.health).x, ctr(CARDS.property).x, ctr(CARDS.property).x, ctr(CARDS.nearmiss).x], clamp);
  const cy = interpolate(frame, [170, 250, 700, 790, 1150, 1240, 1510, 1600], [820, ctr(CARDS.injury).y, ctr(CARDS.injury).y, ctr(CARDS.health).y, ctr(CARDS.health).y, ctr(CARDS.property).y, ctr(CARDS.property).y, ctr(CARDS.nearmiss).y], clamp);
  const cursorOp = interpolate(frame, [160, 185, 1660, 1710], [0, 1, 1, 0], clamp);
  const clickAt = (f0: number) => interpolate(frame, [f0, f0 + 16], [0, 1], clamp) * interpolate(frame, [f0 + 16, f0 + 38], [1, 0], clamp);
  const click = Math.max(clickAt(250), clickAt(790), clickAt(1240), clickAt(1600));

  // intro rail spotlight + "meet e-wizer"
  const introRailOp = interpolate(frame, [50, 90, 250, 290], [0, 1, 1, 0], clamp);
  const meetTagOp = interpolate(frame, [60, 100, 250, 285], [0, 1, 1, 0], clamp);

  // per-beat rings
  const beatRing = (b: Beat) => {
    const op = interpolate(frame, [b.in + XF, b.in + XF + 30, b.out - 40, b.out], [0, 1, 1, 0], clamp);
    return (
      <React.Fragment key={b.key}>
        {ring(CARDS[b.key], TEAL, op, 10, 18)}
        {ring(RAILS[b.key], TEAL, op, 6, 18)}
      </React.Fragment>
    );
  };
  // injury §24 amber emphasis
  const s24RailOp = interpolate(frame, [430, 470, 760, 800], [0, 1, 1, 0], clamp);

  // recap overlay
  const recapOp = interpolate(frame, [1960, 2010, 2240, 2280], [0, 1, 1, 0], clamp);
  // lifecycle rings
  const pillsOp = interpolate(frame, [2360, 2405, 2520, 2560], [0, 1, 1, 0], clamp);
  const s24BannerOp = interpolate(frame, [2440, 2485, 2560, 2600], [0, 1, 1, 0], clamp);
  // close
  const closing = interpolate(frame, [2560, 2615], [0, 1], clamp);

  const captions: Array<[number, number, string]> = [
    [40, 250, 'A guide on every report — e-wizer asks: what happened?'],
    [330, 800, BEATS[0].cap],
    [860, 1250, BEATS[1].cap],
    [1310, 1610, BEATS[2].cap],
    [1670, 1950, BEATS[3].cap],
    [1980, 2260, 'Every incident recorded — only the serious go to the Dept of Labour.'],
    [2360, 2540, 'Then it routes itself — the right person at each step.'],
  ];

  const still = (src: string, op: number) =>
    op <= 0 ? null : <Img src={staticFile(`images/${src}`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: op }} />;

  const recapChips = [
    { t: 'Injury', c: '#E11D48' },
    { t: 'Health event', c: '#0EA5E9' },
    { t: 'Property damage', c: AMBER },
    { t: 'Near miss', c: TEAL },
  ];

  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: '#0B1220' }}>
      {still('cat-welcome.png', opWelcome)}
      {still('cat-injury.png', opInjury)}
      {still('cat-health.png', opHealth)}
      {still('cat-property.png', opProperty)}
      {still('cat-nearmiss.png', opNearmiss)}
      {still('real-editor-e.png', opEditor)}

      {/* intro: introduce e-wizer on the right */}
      {ring(RAILS.welcome, TEAL, introRailOp, 6, 18)}
      {tag('Meet e-wizer — your guide →', RAILS.welcome.x - 330, RAILS.welcome.y + 4, meetTagOp)}

      {/* per-beat card + rail rings */}
      {BEATS.map(beatRing)}

      {/* injury §24 amber emphasis on the rail */}
      {ring({ x: RAILS.injury.x, y: 300, w: RAILS.injury.w, h: 140 }, AMBER, s24RailOp, 4, 14)}
      {tag('Section 24 — only if it’s serious', RAILS.injury.x - 360, 340, s24RailOp, AMBER, true)}

      {/* cursor */}
      <div style={{ position: 'absolute', left: cx, top: cy, opacity: cursorOp, pointerEvents: 'none' }}>
        {click > 0 && <div style={{ position: 'absolute', left: -24, top: -24, width: 48, height: 48, borderRadius: 999, border: `3px solid rgb(${TEAL})`, opacity: 1 - click, transform: `scale(${0.5 + click * 1.2})` }} />}
        <svg width="38" height="38" viewBox="0 0 24 24" fill="white" stroke={INK} strokeWidth="1.4" style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.45))' }}><path d="M5 3l14 7-6 2-2 6z" /></svg>
      </div>

      {/* lifecycle rings */}
      {ring(EDITOR.pills, TEAL, pillsOp, 10, 18)}
      {ring(EDITOR.s24, AMBER, s24BannerOp, 8, 12)}

      {/* recap overlay */}
      {recapOp > 0 && (
        <AbsoluteFill style={{ background: 'rgba(11,18,32,0.82)', opacity: recapOp, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34 }}>
          <div style={{ color: 'white', fontSize: 30, fontWeight: 700, letterSpacing: 1 }}>Whatever happened, e-wizer records it</div>
          <div style={{ display: 'flex', gap: 22 }}>
            {recapChips.map((c, i) => {
              const o = interpolate(frame, [2010 + i * 22, 2050 + i * 22], [0, 1], clamp) * recapOp;
              return (
                <div key={c.t} style={{ opacity: o, background: c.c.includes(',') ? `rgb(${c.c})` : c.c, color: 'white', fontSize: 28, fontWeight: 800, padding: '18px 28px', borderRadius: 16, boxShadow: '0 14px 30px rgba(0,0,0,0.4)' }}>{c.t}</div>
              );
            })}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.92)', fontSize: 26, fontWeight: 600, marginTop: 6 }}>
            …and flags only the serious ones for the <span style={{ color: `rgb(${AMBER})` }}>Department of Labour</span>.
          </div>
        </AbsoluteFill>
      )}

      {/* captions */}
      {captions.map(([s, e, text], i) => {
        const o = interpolate(frame, [s, s + 20, e - 20, e], [0, 1, 1, 0], clamp);
        return o <= 0 ? null : (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: 46, display: 'flex', justifyContent: 'center', opacity: o }}>
            <div style={{ background: 'rgba(11,18,32,0.9)', color: 'white', fontSize: 30, fontWeight: 700, padding: '16px 30px', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', maxWidth: 1500, textAlign: 'center' }}>{text}</div>
          </div>
        );
      })}

      {/* close */}
      {closing > 0 && (
        <AbsoluteFill style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F6FA 100%)', opacity: closing, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18 }}>
          <div style={{ width: 96, height: 96, borderRadius: 26, background: `rgb(${TEAL})`, boxShadow: '0 22px 50px rgba(20,184,166,0.4)' }} />
          <div style={{ fontSize: 52, fontWeight: 800, color: INK }}>Incident management — the <span style={{ color: `rgb(${TEAL})` }}>e</span>-wizer way.</div>
        </AbsoluteFill>
      )}

      <Audio src={staticFile('scene2-narration.mp3')} />
    </AbsoluteFill>
  );
};
