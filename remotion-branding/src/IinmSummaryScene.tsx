import React from 'react';
import { AbsoluteFill, Audio, staticFile, interpolate, useCurrentFrame } from 'remotion';

/**
 * Scene 6 — "Summary".
 * Captured · Guided · Routed · Proven, then the brand close. Pure Remotion (no stills).
 * ~20s @ 30fps. dur = 600 (audio 544f).
 */
const TEAL = '20,184,166';
const INK = '#0F172A';
const MUTED = '#64748B';
const FONT = 'Helvetica Neue, Helvetica, Arial, sans-serif';
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const PILLARS = [
  { word: 'Captured', sub: 'In seconds — by anyone on the floor.', show: 110,
    icon: <><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></> },
  { word: 'Guided', sub: 'The right call is the easy one.', show: 195,
    icon: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></> },
  { word: 'Routed', sub: 'To the right person, every step.', show: 270,
    icon: <><circle cx="6" cy="19" r="2.4" /><circle cx="18" cy="5" r="2.4" /><path d="M8 19h6a4 4 0 0 0 4-4V8" /></> },
  { word: 'Proven', sub: 'The report the law expects, on time.', show: 360,
    icon: <><path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6z" /><path d="m9 12 2 2 4-4" /></> },
];

const CARD_W = 400, GAP = 28;
const ROW_W = PILLARS.length * CARD_W + (PILLARS.length - 1) * GAP;
const ROW_X = (1920 - ROW_W) / 2;

export const IinmSummaryScene: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOp = interpolate(frame, [10, 60, 420, 470], [0, 1, 1, 0], clamp);
  const rowFade = interpolate(frame, [420, 480], [1, 0], clamp);
  const brandOp = interpolate(frame, [435, 500], [0, 1], clamp);
  const avatarScale = interpolate(frame, [445, 540], [0.7, 1], clamp);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: 'radial-gradient(120% 120% at 50% 0%, #14233B 0%, #0B1220 60%)' }}>
      {/* title */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 132, textAlign: 'center', opacity: titleOp }}>
        <div style={{ color: `rgb(${TEAL})`, fontWeight: 800, fontSize: 24, letterSpacing: 5, textTransform: 'uppercase' }}>Incident management</div>
        <div style={{ color: 'white', fontWeight: 800, fontSize: 60, marginTop: 10 }}>the <span style={{ color: `rgb(${TEAL})` }}>e</span>-wizer way</div>
      </div>

      {/* pillars */}
      <div style={{ position: 'absolute', left: ROW_X, top: 360, width: ROW_W, opacity: rowFade }}>
        {PILLARS.map((p, i) => {
          const o = interpolate(frame, [p.show, p.show + 45], [0, 1], clamp);
          const rise = interpolate(frame, [p.show, p.show + 45], [40, 0], clamp);
          return (
            <div key={p.word} style={{ position: 'absolute', left: i * (CARD_W + GAP), top: 0, width: CARD_W, opacity: o, transform: `translateY(${rise}px)` }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(${TEAL},0.35)`, borderRadius: 22, padding: '34px 28px', height: 300, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: `rgba(${TEAL},0.14)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={`rgb(${TEAL})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{p.icon}</svg>
                </div>
                <div style={{ color: 'white', fontWeight: 800, fontSize: 34 }}>{p.word}</div>
                <div style={{ color: 'rgba(255,255,255,0.66)', fontSize: 22, lineHeight: 1.35 }}>{p.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* brand close */}
      {brandOp > 0 && (
        <AbsoluteFill style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F6FA 100%)', opacity: brandOp, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18 }}>
          <div style={{ width: 96, height: 96, borderRadius: 26, background: `rgb(${TEAL})`, boxShadow: '0 22px 50px rgba(20,184,166,0.4)', transform: `scale(${avatarScale})` }} />
          <div style={{ fontSize: 24, letterSpacing: 5, textTransform: 'uppercase', color: MUTED, fontWeight: 700 }}>The same Ecowize attention to detail</div>
          <div style={{ fontSize: 92, fontWeight: 800, color: INK, lineHeight: 1 }}>Now wiser.</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: INK }}><span style={{ color: `rgb(${TEAL})` }}>e</span>-wizer</div>
        </AbsoluteFill>
      )}

      <Audio src={staticFile('scene6-narration.mp3')} />
    </AbsoluteFill>
  );
};
