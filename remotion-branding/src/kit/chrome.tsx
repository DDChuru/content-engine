/**
 * Stage chrome: the dark field-guide backdrop and the brand footer (wordmark +
 * progress bar). Extracted from src/ccv/ccvShared.tsx (SceneBackdrop, Wordmark)
 * and generalised so the footer label is caller-supplied.
 */
import React from 'react';
import { clamp01, DISPLAY, EMERALD, SKY } from './palette';

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

/** Bottom wordmark + a sky→emerald progress bar tracking overall completion. */
export const BrandFooter: React.FC<{ label: string; progress: number; left?: number }> = ({
  label,
  progress,
  left = 120,
}) => (
  <>
    <div
      style={{
        position: 'absolute',
        left,
        bottom: 46,
        color: 'rgba(255,255,255,0.42)',
        fontFamily: DISPLAY,
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: 3,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
    <div
      style={{
        position: 'absolute',
        left,
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
