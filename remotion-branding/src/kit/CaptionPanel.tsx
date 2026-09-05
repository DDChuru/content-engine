/**
 * The right-side explainer kit: a numbered step Chip, a big caption, and a row
 * of ProgressDots, composed into CaptionPanel — the standard field-guide
 * explainer that sits beside the phone. Typography (Headline / BodyText /
 * ProofChip) is extracted from src/ccv/ccvShared.tsx; Chip + ProgressDots are
 * new, factored from the numbered-step / progress idioms across the tutorials.
 */
import React from 'react';
import { BODY, clamp01, DISPLAY, easeInOut, hexToRgb, seg, SKY } from './palette';

/** Numbered step chip: index badge + label pill. */
export const Chip: React.FC<{
  n: number;
  label: string;
  color?: string;
  appear?: number;
}> = ({ n, label, color = SKY, appear = 1 }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      height: 54,
      padding: '0 22px 0 8px',
      borderRadius: 999,
      background: `rgba(${hexToRgb(color)},0.14)`,
      border: `1px solid rgba(${hexToRgb(color)},0.45)`,
      opacity: appear,
      transform: `translateY(${(1 - appear) * 14}px) scale(${0.94 + appear * 0.06})`,
    }}
  >
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 999,
        background: color,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: 22,
      }}
    >
      {n}
    </div>
    <div
      style={{
        color,
        fontFamily: DISPLAY,
        fontSize: 25,
        fontWeight: 600,
        letterSpacing: 1.8,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
  </div>
);

/** Big caption headline (the explainer's dominant line) — clip-wipes on, left to right. */
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
      opacity: Math.min(1, appear * 2.2),
      transform: `translateY(${(1 - appear) * 22}px)`,
      clipPath: `inset(0 ${(1 - appear) * 100}% 0 0)`,
    }}
  >
    {text}
  </div>
);

/** Secondary explainer body copy. */
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
      transform: `translateY(${(1 - appear) * 16}px)`,
    }}
  >
    {text}
  </div>
);

/** Small proof chip with a glowing dot. */
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
      transform: `translateY(${(1 - appear) * 14}px)`,
    }}
  >
    <div style={{ width: 13, height: 13, borderRadius: 7, background: color, boxShadow: `0 0 18px ${color}` }} />
    {text}
  </div>
);

/** Beat progress: one dot per beat, the current beat elongated + lit. */
export const ProgressDots: React.FC<{
  total: number;
  current: number;
  color?: string;
  appear?: number;
}> = ({ total, current, color = SKY, appear = 1 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    {Array.from({ length: total }).map((_, i) => {
      const active = i === current;
      const done = i < current;
      // index-staggered pop-in — dots cascade rather than appearing as one block
      const dotAppear = clamp01(appear * total - i) ** 0.6;
      return (
        <div
          key={i}
          style={{
            width: active ? 40 : 12,
            height: 12,
            borderRadius: 999,
            background: active
              ? color
              : done
                ? `rgba(${hexToRgb(color)},0.5)`
                : 'rgba(255,255,255,0.18)',
            boxShadow: active ? `0 0 16px rgba(${hexToRgb(color)},0.6)` : undefined,
            opacity: dotAppear,
            transform: `scale(${0.4 + dotAppear * 0.6})`,
          }}
        />
      );
    })}
  </div>
);

/**
 * The standard right-side explainer: step chip, big caption, optional body,
 * and progress dots pinned to the bottom. Elements cascade in on a shared
 * scene-local VO clock (`sec`, seconds since this beat's narration starts)
 * rather than popping in together — chip/dots first, headline, then body.
 */
export const CaptionPanel: React.FC<{
  step: number;
  total: number;
  chip: string;
  caption: string;
  body?: string;
  color?: string;
  /** Scene-local seconds since this beat's VO starts (0 = VO onset). */
  sec: number;
  /** Absolute left / top / width in 1080p stage space. */
  x?: number;
  y?: number;
  width?: number;
}> = ({ step, total, chip, caption, body, color = SKY, sec, x = 720, y = 96, width = 1100 }) => {
  const chipAppear = easeInOut(seg(sec, -0.35, 0.1));
  const headAppear = easeInOut(seg(sec, -0.15, 0.45));
  const bodyAppear = easeInOut(seg(sec, 0.05, 0.6));
  return (
    <div style={{ position: 'absolute', left: x, top: y, width, height: 1080 - y - 90 }}>
      <Chip n={step + 1} label={chip} color={color} appear={chipAppear} />
      <Headline text={caption} appear={headAppear} size={clamp01(caption.length / 90) > 0.6 ? 52 : 64} width={width} />
      {body ? <BodyText text={body} appear={bodyAppear} width={width - 60} /> : null}
      <div style={{ position: 'absolute', left: 0, bottom: 0 }}>
        <ProgressDots total={total} current={step} color={color} appear={chipAppear} />
      </div>
    </div>
  );
};
