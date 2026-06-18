import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, interpolate, useCurrentFrame } from 'remotion';

/**
 * Scene 4 — "Compliance you can prove".
 * The §24 clock (set automatically the moment you classify) → one-click Annexure 1
 * generated from the record → ready to hand over. ~37s @ 30fps. dur = 1110 (audio 968f).
 *
 * FACT: only SERIOUS injuries (≥14 days / amputation / unconsciousness / likely-to-die /
 * likely-permanent-defect / fatality) OR a dangerous occurrence go to the Dept of Labour (§24).
 * The Annexure shown (IINM-683-003, Sarah Phokane, >2-4 weeks) is genuinely §24-reportable.
 */
const TEAL = '20,184,166';
const AMBER = '245,158,11';
const RED = '225,29,72';
const EMERALD = '16,185,129';
const INK = '#0F172A';
const MUTED = '#64748B';
const FONT = 'Helvetica Neue, Helvetica, Arial, sans-serif';
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// captured boxes (CSS px == video px @ 1920x1080)
const S24 = { x: 735, y: 365, w: 375, h: 19 };
const ANNEX_BTN = { x: 1319, y: 87, w: 137, h: 34 };
const ctr = (b: { x: number; y: number; w: number; h: number }) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

// annexure two-page spread layout
const PAGE_H = 820;
const PAGE_W = Math.round(PAGE_H * (910 / 1287)); // 580
const GAP = 40;
const SPREAD_W = PAGE_W * 2 + GAP;
const SPREAD_X = (1920 - SPREAD_W) / 2;
const SPREAD_TOP = (1080 - PAGE_H) / 2 - 10;

export const IinmComplianceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 15);

  const ring = (b: { x: number; y: number; w: number; h: number }, color: string, op: number, pad = 8, radius = 14) =>
    op <= 0 ? null : (
      <div style={{ position: 'absolute', left: b.x - pad, top: b.y - pad, width: b.w + pad * 2, height: b.h + pad * 2, borderRadius: radius, border: `4px solid rgba(${color},${0.5 + pulse * 0.45})`, boxShadow: `0 0 ${16 + pulse * 22}px rgba(${color},0.5)`, opacity: op, pointerEvents: 'none' }} />
    );

  // editor still: holds, fades out as the annexure reveals
  const opEditor = interpolate(frame, [0, 1, 620, 690], [1, 1, 1, 0], clamp);
  // §24 banner ring + clock callout
  const s24Op = interpolate(frame, [40, 90, 560, 620], [0, 1, 1, 0], clamp);
  const clockOp = interpolate(frame, [90, 150, 560, 620], [0, 1, 1, 0], clamp);
  // 7-day countdown sweep (decorative): 0->1 over the clock's life
  const sweep = interpolate(frame, [120, 430], [0, 1], clamp);

  // annexure button ring + cursor + click
  const btnRingOp = interpolate(frame, [500, 545, 660, 700], [0, 1, 1, 0], clamp);
  const cursorOp = interpolate(frame, [470, 500, 700, 740], [0, 1, 1, 0], clamp);
  const cx = interpolate(frame, [470, 600], [980, ctr(ANNEX_BTN).x], clamp);
  const cy = interpolate(frame, [470, 600], [560, ctr(ANNEX_BTN).y], clamp);
  const clickAt = (f0: number) => interpolate(frame, [f0, f0 + 16], [0, 1], clamp) * interpolate(frame, [f0 + 16, f0 + 40], [1, 0], clamp);
  const click = clickAt(615);

  // annexure reveal
  const scrim = interpolate(frame, [615, 690], [0, 0.92], clamp) * interpolate(frame, [1000, 1060], [1, 0], clamp);
  const spreadOp = interpolate(frame, [650, 720, 1000, 1055], [0, 1, 1, 0], clamp);
  const spreadRise = interpolate(frame, [650, 730], [46, 0], clamp);
  const spreadScale = interpolate(frame, [650, 760], [0.9, 1], clamp);
  const page2Op = interpolate(frame, [770, 850], [0, 1], clamp);
  const badgeOp = interpolate(frame, [840, 920, 1000, 1055], [0, 1, 1, 0], clamp);

  // closing card
  const closeOp = interpolate(frame, [1005, 1060], [0, 1], clamp);

  const captions: Array<[number, number, string]> = [
    [60, 560, 'Serious incident? e-wizer sets the Section 24 deadline the moment you classify.'],
    [600, 1000, 'One click — the official Annexure 1, filled straight from the record.'],
  ];

  // countdown ring geometry (decorative clock)
  const R = 30, C = 2 * Math.PI * R;

  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: '#0B1220' }}>
      {/* editor still */}
      {opEditor > 0 && (
        <Img src={staticFile('images/s4-editor.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: opEditor }} />
      )}

      {/* §24 banner ring (red — it's the reportable banner) */}
      {ring(S24, RED, s24Op, 10, 12)}

      {/* §24 clock callout — anchored above-right of the banner */}
      {clockOp > 0 && (
        <div style={{ position: 'absolute', left: 1135, top: 300, width: 470, opacity: clockOp, background: 'rgba(11,18,32,0.95)', border: `1px solid rgba(${AMBER},0.55)`, borderRadius: 16, padding: '16px 18px', boxShadow: '0 18px 40px rgba(0,0,0,0.45)', display: 'flex', gap: 16, alignItems: 'center' }}>
          {/* countdown ring */}
          <svg width="78" height="78" viewBox="0 0 78 78" style={{ flexShrink: 0 }}>
            <circle cx="39" cy="39" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="7" />
            <circle cx="39" cy="39" r={R} fill="none" stroke={`rgb(${AMBER})`} strokeWidth="7" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * sweep} transform="rotate(-90 39 39)" />
            <text x="39" y="36" textAnchor="middle" fill="white" fontSize="20" fontWeight="800" fontFamily={FONT}>7</text>
            <text x="39" y="52" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontWeight="700" fontFamily={FONT}>DAYS</text>
          </svg>
          <div>
            <div style={{ color: `rgb(${AMBER})`, fontWeight: 800, fontSize: 18, letterSpacing: 0.3 }}>Section 24 · Department of Labour</div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 16, marginTop: 4 }}>Report due 16 Jun 2026 — set automatically</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 3 }}>No diarising. No missed dates.</div>
          </div>
        </div>
      )}

      {/* annexure button ring */}
      {ring(ANNEX_BTN, TEAL, btnRingOp, 8, 12)}

      {/* cursor */}
      {cursorOp > 0 && (
        <div style={{ position: 'absolute', left: cx, top: cy, opacity: cursorOp, pointerEvents: 'none' }}>
          {click > 0 && <div style={{ position: 'absolute', left: -24, top: -24, width: 48, height: 48, borderRadius: 999, border: `3px solid rgb(${TEAL})`, opacity: 1 - click, transform: `scale(${0.5 + click * 1.2})` }} />}
          <svg width="38" height="38" viewBox="0 0 24 24" fill="white" stroke={INK} strokeWidth="1.4" style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.45))' }}><path d="M5 3l14 7-6 2-2 6z" /></svg>
        </div>
      )}

      {/* dim scrim for the reveal */}
      <AbsoluteFill style={{ background: '#0B1220', opacity: scrim }} />

      {/* annexure two-page spread */}
      {spreadOp > 0 && (
        <div style={{ position: 'absolute', left: SPREAD_X, top: SPREAD_TOP, width: SPREAD_W, height: PAGE_H, opacity: spreadOp, transform: `translateY(${spreadRise}px) scale(${spreadScale})`, transformOrigin: 'center top' }}>
          <Img src={staticFile('images/s4-annexure-1.png')} style={{ position: 'absolute', left: 0, top: 0, width: PAGE_W, height: PAGE_H, borderRadius: 6, boxShadow: '0 30px 70px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }} />
          <Img src={staticFile('images/s4-annexure-2.png')} style={{ position: 'absolute', left: PAGE_W + GAP, top: 0, width: PAGE_W, height: PAGE_H, borderRadius: 6, boxShadow: '0 30px 70px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', opacity: page2Op }} />
        </div>
      )}

      {/* generated badge */}
      {badgeOp > 0 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 56, display: 'flex', justifyContent: 'center', gap: 14, opacity: badgeOp }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: `rgba(${EMERALD},0.16)`, border: `1px solid rgba(${EMERALD},0.7)`, color: `rgb(${EMERALD})`, fontWeight: 800, fontSize: 22, padding: '10px 20px', borderRadius: 999 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={`rgb(${EMERALD})`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            Annexure 1 generated · OHS-ANN-01
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', color: 'white', fontWeight: 700, fontSize: 22, padding: '10px 20px', borderRadius: 999 }}>
            Filled from the record · ready to send
          </div>
        </div>
      )}

      {/* captions */}
      {captions.map(([s, e, text], i) => {
        const o = interpolate(frame, [s, s + 20, e - 20, e], [0, 1, 1, 0], clamp);
        return o <= 0 ? null : (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: 46, display: 'flex', justifyContent: 'center', opacity: o }}>
            <div style={{ background: 'rgba(11,18,32,0.92)', color: 'white', fontSize: 30, fontWeight: 700, padding: '16px 30px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', maxWidth: 1500, textAlign: 'center' }}>{text}</div>
          </div>
        );
      })}

      {/* close */}
      {closeOp > 0 && (
        <AbsoluteFill style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F6FA 100%)', opacity: closeOp, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 26, letterSpacing: 5, textTransform: 'uppercase', color: `rgb(${TEAL})`, fontWeight: 800 }}>Compliance you can prove</div>
          <div style={{ fontSize: 56, fontWeight: 800, color: INK }}>The report the law expects.</div>
          <div style={{ fontSize: 28, color: MUTED }}>On paper. On time.</div>
        </AbsoluteFill>
      )}

      <Audio src={staticFile('scene4-narration.mp3')} />
    </AbsoluteFill>
  );
};
