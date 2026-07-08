'use client';

import { useEffect, useState } from 'react';
import type { SkillState } from '@/lib/progress';

const LABELS: Record<SkillState, string> = {
  'not-started': 'Not started yet',
  developing: 'Needs one more pass',
  secure: 'Secure',
};

/** Tick path length in viewBox units (slightly over-measured to fully hide). */
const TICK_LENGTH = 20;

/** Ticks already drawn this session — later renders show a static tick. */
const drawnTicks = new Set<string>();

interface MasteryBadgeProps {
  state: SkillState;
  size?: 'sm' | 'md';
  /**
   * Stable identity for the "seen" tracking (e.g. the topic code). Without it
   * the tick redraws on every fresh mount.
   */
  drawKey?: string;
}

export function MasteryBadge({ state, size = 'md', drawKey }: MasteryBadgeProps) {
  const px = size === 'sm' ? 16 : 20;
  const label = LABELS[state];
  const [drawn, setDrawn] = useState(() =>
    drawKey ? drawnTicks.has(drawKey) : false
  );

  useEffect(() => {
    if (state !== 'secure' || drawn) return;
    // Two frames so the fully-hidden stroke paints first, then transitions in.
    let inner: number;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        setDrawn(true);
        if (drawKey) drawnTicks.add(drawKey);
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      if (inner) cancelAnimationFrame(inner);
    };
  }, [state, drawn, drawKey]);

  return (
    <svg
      viewBox="0 0 24 24"
      width={px}
      height={px}
      role="img"
      aria-label={label}
      className="shrink-0"
    >
      <title>{label}</title>
      {state === 'not-started' && (
        <circle
          cx="12"
          cy="12"
          r="5.5"
          fill="none"
          stroke="var(--ink-muted)"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
      )}
      {state === 'developing' && (
        <>
          <circle cx="12" cy="12" r="3.5" fill="var(--developing)" />
          <circle
            cx="12"
            cy="12"
            r="7.5"
            fill="none"
            stroke="var(--developing)"
            strokeOpacity="0.4"
            strokeWidth="1.25"
          />
        </>
      )}
      {state === 'secure' && (
        <path
          d="M5.5 12.5l4.2 4.2L18.5 7.5"
          fill="none"
          stroke="var(--secure)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={TICK_LENGTH}
          strokeDashoffset={drawn ? 0 : TICK_LENGTH}
          style={{
            transition: 'stroke-dashoffset 300ms cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />
      )}
    </svg>
  );
}
