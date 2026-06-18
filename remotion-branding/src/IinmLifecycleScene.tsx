import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, interpolate, useCurrentFrame } from 'remotion';

/**
 * Scene 3 — "The right person, every step".
 * The role-gated lifecycle: same real record seen as Site Manager / Area Manager / SHEQ,
 * plus an accurate permission matrix (who can edit which phase). ~40s @ 30fps. dur = 1230.
 * Edit rights (from the live app): Site = Report+Investigate · Area = +Action · SHEQ = Close.
 */
const TEAL = '20,184,166';
const INK = '#0F172A';
const MUTED = '#64748B';
const FONT = 'Helvetica Neue, Helvetica, Arial, sans-serif';
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const PHASES = ['Report', 'Investigate', 'Action', 'Close'];
const ROLES = [
  { name: 'Site Manager', edits: [1, 1, 0, 0], show: 360 },
  { name: 'Area Manager', edits: [1, 1, 1, 0], show: 540 },
  { name: 'SHEQ Officer', edits: [0, 0, 0, 1], show: 720 },
];
const PILLS = { x: 512, y: 294, w: 575, h: 34 };

export const IinmLifecycleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 15);

  // real role stills crossfade (proof it's the live app)
  const opSite = interpolate(frame, [0, 1, 560, 610], [1, 1, 1, 0], clamp);
  const opArea = interpolate(frame, [560, 610, 760, 810], [0, 1, 1, 0], clamp);
  const opSheq = interpolate(frame, [760, 810], [0, 1], clamp);
  const still = (src: string, op: number) =>
    op <= 0 ? null : <Img src={staticFile(`images/${src}`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: op }} />;

  // dim scrim once the matrix comes up
  const scrim = interpolate(frame, [300, 360], [0, 0.78], clamp) * interpolate(frame, [1080, 1140], [1, 0.0], clamp);

  // phase-nav ring (intro)
  const pillRing = interpolate(frame, [60, 100, 290, 330], [0, 1, 1, 0], clamp);

  // matrix
  const matrixOp = interpolate(frame, [300, 350, 1080, 1140], [0, 1, 1, 0], clamp);
  const headerOp = interpolate(frame, [300, 350], [0, 1], clamp);

  const closeOp = interpolate(frame, [1080, 1140], [0, 1], clamp);

  const captions: Array<[number, number, string]> = [
    [40, 280, 'Raise it — and the incident routes itself.'],
    [300, 560, 'Site Manager investigates.'],
    [560, 760, 'Area Manager verifies the action — and signs.'],
    [760, 1060, 'SHEQ reviews and closes. Everyone sees all; each edits only their part.'],
  ];

  // matrix layout
  const MX = 360, MY = 300, COLW = 250, ROWH = 116, LABELW = 320;

  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: '#0B1220' }}>
      {still('s3-site.png', opSite)}
      {still('s3-area.png', opArea)}
      {still('s3-sheq.png', opSheq)}

      {/* phase-nav ring (the lifecycle, intro) */}
      {pillRing > 0 && (
        <div style={{ position: 'absolute', left: PILLS.x - 10, top: PILLS.y - 10, width: PILLS.w + 20, height: PILLS.h + 20, borderRadius: 18, border: `4px solid rgba(${TEAL},${0.5 + pulse * 0.45})`, boxShadow: `0 0 ${16 + pulse * 22}px rgba(${TEAL},0.5)`, opacity: pillRing }} />
      )}

      {/* dim scrim */}
      <AbsoluteFill style={{ background: '#0B1220', opacity: scrim }} />

      {/* permission matrix */}
      {matrixOp > 0 && (
        <div style={{ position: 'absolute', inset: 0, opacity: matrixOp }}>
          <div style={{ position: 'absolute', left: MX, top: 150, color: 'white', fontSize: 40, fontWeight: 800 }}>Who does what — and who can change it</div>
          <div style={{ position: 'absolute', left: MX, top: 206, color: `rgba(255,255,255,0.7)`, fontSize: 22 }}>The same record. Each role edits only its part — everyone can see the whole story.</div>

          {/* phase header */}
          {PHASES.map((p, i) => (
            <div key={p} style={{ position: 'absolute', left: MX + LABELW + i * COLW, top: MY, width: COLW - 16, opacity: headerOp, textAlign: 'center' }}>
              <div style={{ color: `rgb(${TEAL})`, fontWeight: 800, fontSize: 16 }}>STEP {i + 1}</div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 26, marginTop: 2 }}>{p}</div>
            </div>
          ))}

          {/* role rows */}
          {ROLES.map((r, ri) => {
            const rowOp = interpolate(frame, [r.show, r.show + 50], [0, 1], clamp);
            return (
              <div key={r.name} style={{ position: 'absolute', left: MX, top: MY + 64 + ri * ROWH, opacity: rowOp }}>
                <div style={{ position: 'absolute', left: 0, top: ROWH / 2 - 36, width: LABELW - 24, color: 'white', fontSize: 26, fontWeight: 700 }}>{r.name}</div>
                {r.edits.map((e, ci) => {
                  const cellOp = interpolate(frame, [r.show + 20 + ci * 12, r.show + 60 + ci * 12], [0, 1], clamp);
                  return (
                    <div key={ci} style={{ position: 'absolute', left: LABELW + ci * COLW, top: 8, width: COLW - 16, height: ROWH - 28, borderRadius: 14, opacity: cellOp, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: e ? `rgba(${TEAL},0.16)` : 'rgba(255,255,255,0.05)', border: e ? `2px solid rgba(${TEAL},0.85)` : '2px solid rgba(255,255,255,0.12)' }}>
                      {e ? (
                        <>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={`rgb(${TEAL})`} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                          <span style={{ color: `rgb(${TEAL})`, fontWeight: 800, fontSize: 20 }}>Can edit</span>
                        </>
                      ) : (
                        <>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 18 }}>View only</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div style={{ position: 'absolute', left: MX, top: MY + 64 + 3 * ROWH + 18, color: 'rgba(255,255,255,0.85)', fontSize: 24, opacity: interpolate(frame, [840, 900], [0, 1], clamp) }}>
            …and the steps advance on their own as each part is done — so you always know whose turn it is.
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
          <div style={{ fontSize: 26, letterSpacing: 5, textTransform: 'uppercase', color: `rgb(${TEAL})`, fontWeight: 800 }}>Governed, not just collected</div>
          <div style={{ fontSize: 56, fontWeight: 800, color: INK }}>The right person, every step.</div>
          <div style={{ fontSize: 28, color: MUTED }}>Nothing falls through the cracks.</div>
        </AbsoluteFill>
      )}

      <Audio src={staticFile('scene3-narration.mp3')} />
    </AbsoluteFill>
  );
};
