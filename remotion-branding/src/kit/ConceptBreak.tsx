/**
 * ConceptBreak — a before/after image pair with labels, for the "pause the
 * journey and explain the concept" beats in the module tutorial pattern
 * (severity grading, compliance status, evidence quality). Each side enters
 * large, then settles; frame-driven throughout.
 *
 * Factored from the concept-break idiom described in
 * docs/module-tutorial-pattern.md. TutorialKit renders it for beats of
 * kind "concept" that carry a `before`/`after` pair (via boxes/assets later);
 * today it is a self-contained, reusable primitive.
 */
import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { APP_BORDER, BODY, DISPLAY, FG, hexToRgb, MUTED, resolveColor, SURFACE } from './palette';

const Panel: React.FC<{
  assetBase: string;
  src: string;
  label: string;
  caption?: string;
  color: string;
  appear: number;
}> = ({ assetBase, src, label, caption, color, appear }) => {
  const frame = useCurrentFrame();
  // one living micro-detail: the frame border breathes gently once settled in
  const glow = 0.5 + 0.5 * Math.sin(frame / 26);
  const rgb = hexToRgb(color);
  return (
    <div
      style={{
        width: 720,
        opacity: appear,
        transform: `scale(${1.06 - appear * 0.06}) translateY(${(1 - appear) * 20}px)`,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 720,
          height: 460,
          borderRadius: 24,
          overflow: 'hidden',
          border: `2px solid ${color}`,
          boxShadow: `0 26px 70px rgba(0,0,0,0.5), 0 0 ${28 + glow * 14}px rgba(${rgb},${0.18 + glow * 0.1})`,
        }}
      >
        <Img
          src={staticFile(`${assetBase}/${src}`)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 20,
            padding: '8px 18px',
            borderRadius: 999,
            background: color,
            color: '#fff',
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
      </div>
      {caption ? (
        <div
          style={{
            marginTop: 18,
            padding: '16px 20px',
            borderRadius: 16,
            background: SURFACE,
            border: `1px solid ${APP_BORDER}`,
            color: FG,
            fontFamily: BODY,
            fontSize: 26,
            fontWeight: 500,
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
};

export type ConceptPair = {
  before: { src: string; label: string; caption?: string; color?: string };
  after: { src: string; label: string; caption?: string; color?: string };
};

export const ConceptBreak: React.FC<{
  assetBase: string;
  pair: ConceptPair;
  appear: number;
}> = ({ assetBase, pair, appear }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 60,
    }}
  >
    {/* index-staggered: before settles in first, after follows ~0.3s behind */}
    <Panel
      assetBase={assetBase}
      src={pair.before.src}
      label={pair.before.label}
      caption={pair.before.caption}
      color={resolveColor(pair.before.color ?? 'coral')}
      appear={appear}
    />
    <div style={{ color: MUTED, fontFamily: DISPLAY, fontSize: 60, fontWeight: 700 }}>→</div>
    <Panel
      assetBase={assetBase}
      src={pair.after.src}
      label={pair.after.label}
      caption={pair.after.caption}
      color={resolveColor(pair.after.color ?? 'emerald')}
      appear={Math.min(1, Math.max(0, appear * 1.2 - 0.2))}
    />
  </div>
);
