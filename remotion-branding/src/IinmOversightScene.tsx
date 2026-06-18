import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, interpolate, useCurrentFrame } from 'remotion';

/**
 * Scene 5 — "Nothing slips".
 * Oversight from the REAL register: summary tiles (open investigations, due to the
 * Dept of Labour) + the live record list, with an overdue-deadline flag. ~26s @ 30fps.
 * dur = 780 (audio 649f). Backdrop = s5-register.png (3 reports · 2 open · 2 DOL-required).
 */
const TEAL = '20,184,166';
const AMBER = '245,158,11';
const RED = '225,29,72';
const INK = '#0F172A';
const MUTED = '#64748B';
const FONT = 'Helvetica Neue, Helvetica, Arial, sans-serif';
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// summary tiles (video px; verified against the still) — TOTAL · OPEN INV · DOL · FATALITIES
const TILE = (i: number) => ({ x: 510 + i * 283, y: 146, w: 270, h: 114 });
// record list block + rows (exact captured boxes)
const LIST = { x: 510, y: 415, w: 1116, h: 200 };
const ROW3 = { x: 518, y: 545, w: 1108, h: 60 }; // Peter Maela · 683-001 · DOL · Reported

export const IinmOversightScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 15);

  const ring = (b: { x: number; y: number; w: number; h: number }, color: string, op: number, pad = 8, radius = 14) =>
    op <= 0 ? null : (
      <div style={{ position: 'absolute', left: b.x - pad, top: b.y - pad, width: b.w + pad * 2, height: b.h + pad * 2, borderRadius: radius, border: `4px solid rgba(${color},${0.5 + pulse * 0.45})`, boxShadow: `0 0 ${16 + pulse * 22}px rgba(${color},0.5)`, opacity: op, pointerEvents: 'none' }} />
    );

  // tile rings appear in sequence as narration names them
  const tileOpen = interpolate(frame, [180, 222, 560, 610], [0, 1, 1, 0], clamp);
  const tileDol = interpolate(frame, [256, 300, 560, 610], [0, 1, 1, 0], clamp);
  // whole-list "at a glance" ring
  const listOp = interpolate(frame, [400, 450, 610, 650], [0, 1, 1, 0], clamp);
  // overdue flag on the oldest DOL row
  const flagOp = interpolate(frame, [520, 565, 645, 690], [0, 1, 1, 0], clamp);

  const closeOp = interpolate(frame, [648, 705], [0, 1], clamp);

  const captions: Array<[number, number, string]> = [
    [20, 180, 'Across a busy site, incidents pile up.'],
    [200, 460, 'One place — open investigations, what’s due to the Department of Labour, what’s coming up.'],
    [470, 645, 'Management sees it at a glance. And if something runs late, e-wizer flags it first.'],
  ];

  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: '#0B1220' }}>
      <Img src={staticFile('images/s5-register.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* summary tile rings */}
      {ring(TILE(1), TEAL, tileOpen, 6, 12)}
      {ring(TILE(2), RED, tileDol, 6, 12)}

      {/* tile callout tags */}
      {tileOpen > 0 && (
        <div style={{ position: 'absolute', left: TILE(1).x + 2, top: TILE(1).y - 46, opacity: tileOpen, background: `rgb(${TEAL})`, color: 'white', fontWeight: 800, fontSize: 18, padding: '7px 14px', borderRadius: 10, boxShadow: `0 10px 24px rgba(${TEAL},0.4)`, whiteSpace: 'nowrap' }}>Open investigations</div>
      )}
      {tileDol > 0 && (
        <div style={{ position: 'absolute', left: TILE(2).x + 2, top: TILE(2).y - 46, opacity: tileDol, background: `rgb(${RED})`, color: 'white', fontWeight: 800, fontSize: 18, padding: '7px 14px', borderRadius: 10, boxShadow: `0 10px 24px rgba(${RED},0.4)`, whiteSpace: 'nowrap' }}>Due to the Dept of Labour</div>
      )}

      {/* whole-list ring */}
      {ring(LIST, TEAL, listOp, 8, 16)}

      {/* overdue flag on the oldest DOL row */}
      {ring(ROW3, AMBER, flagOp, 6, 12)}
      {flagOp > 0 && (
        <div style={{ position: 'absolute', left: 1180, top: ROW3.y + ROW3.h + 14, opacity: flagOp, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(11,18,32,0.95)', border: `1px solid rgba(${AMBER},0.7)`, color: `rgb(${AMBER})`, fontWeight: 800, fontSize: 19, padding: '10px 16px', borderRadius: 12, boxShadow: '0 14px 30px rgba(0,0,0,0.45)', whiteSpace: 'nowrap', transform: `scale(${0.97 + pulse * 0.05})` }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={`rgb(${AMBER})`} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V4h13l-2 4 2 4H4" /></svg>
          DoL report due soon — flagged
        </div>
      )}

      {/* captions */}
      {captions.map(([s, e, text], i) => {
        const o = interpolate(frame, [s, s + 20, e - 20, e], [0, 1, 1, 0], clamp);
        return o <= 0 ? null : (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: 46, display: 'flex', justifyContent: 'center', opacity: o }}>
            <div style={{ background: 'rgba(11,18,32,0.92)', color: 'white', fontSize: 30, fontWeight: 700, padding: '16px 30px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', maxWidth: 1560, textAlign: 'center' }}>{text}</div>
          </div>
        );
      })}

      {/* close */}
      {closeOp > 0 && (
        <AbsoluteFill style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F6FA 100%)', opacity: closeOp, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 26, letterSpacing: 5, textTransform: 'uppercase', color: `rgb(${TEAL})`, fontWeight: 800 }}>Oversight, built in</div>
          <div style={{ fontSize: 64, fontWeight: 800, color: INK }}>Nothing slips.</div>
          <div style={{ fontSize: 28, color: MUTED }}>No chasing. No surprises.</div>
        </AbsoluteFill>
      )}

      <Audio src={staticFile('scene5-narration.mp3')} />
    </AbsoluteFill>
  );
};
