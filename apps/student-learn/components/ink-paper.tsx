'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

/** One pen stroke as drawn by the model. Order of arrival is pen order. */
export interface InkStroke {
  id: string;
  group: string;
  d: string;
}

export interface InkGroup {
  id: string;
  say: string;
}

interface Scheduled extends InkStroke {
  startAt: number; // performance.now() ms when the pen starts this stroke
  duration: number; // ms
  delay: number; // ms from scheduling; fixed so re-renders never restart the animation
  length: number;
}

const PEN_SPEED = 420; // px per second, roughly a brisk hand
const STROKE_GAP = 70; // ms lift between strokes
const GROUP_GAP = 420; // ms pause before a new line of working
const MIN_HEIGHT = 720;
const LINE_PITCH = 110;

const INK = '#1a2a6c';
const RED_PEN = '#c0392b';
const RED_GROUPS = new Set(['answer', 'annot']);

/** Measures a path's length off-screen so the player can pace the pen. */
function useLengthMeter() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.style.visibility = 'hidden';
    document.body.appendChild(svg);
    svgRef.current = svg;
    return () => {
      svg.remove();
    };
  }, []);
  return (d: string): number => {
    const svg = svgRef.current;
    if (!svg) return 200;
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    svg.appendChild(p);
    let len = 200;
    try {
      len = p.getTotalLength();
    } catch {
      /* malformed path: still play it at a default pace */
    }
    p.remove();
    return Number.isFinite(len) && len > 0 ? len : 200;
  };
}

interface InkPaperProps {
  strokes: InkStroke[];
  groups: InkGroup[];
  /** Bumping this restarts playback from the first stroke (replay). */
  playKey?: number;
  /** Called as the pen reaches each group, so the caller can highlight its explanation. */
  onGroupStart?: (groupId: string) => void;
  onIdle?: () => void;
}

/**
 * Lined paper that writes strokes as they arrive. Works the same whether the strokes
 * are streamed live from the model or replayed from a stored drawing: the pen picks up
 * each new stroke when it is free, never earlier.
 */
export function InkPaper({ strokes, groups, playKey = 0, onGroupStart, onIdle }: InkPaperProps) {
  const measure = useLengthMeter();
  const [scheduled, setScheduled] = useState<Scheduled[]>([]);
  const penFreeAt = useRef(0);
  const lastGroup = useRef<string | null>(null);
  const seen = useRef(0);
  const groupTimers = useRef<number[]>([]);

  // Replay: forget everything scheduled and let the effect below re-queue from stroke 0.
  useEffect(() => {
    groupTimers.current.forEach((t) => window.clearTimeout(t));
    groupTimers.current = [];
    setScheduled([]);
    seen.current = 0;
    lastGroup.current = null;
    penFreeAt.current = performance.now();
  }, [playKey]);

  useEffect(() => {
    if (strokes.length <= seen.current) return;
    const now = performance.now();
    const next: Scheduled[] = [];
    for (let i = seen.current; i < strokes.length; i++) {
      const s = strokes[i];
      const length = measure(s.d);
      const duration = Math.max(120, (length / PEN_SPEED) * 1000);
      const newGroup = s.group !== lastGroup.current;
      const startAt = Math.max(now, penFreeAt.current) + (newGroup && lastGroup.current ? GROUP_GAP : 0);
      penFreeAt.current = startAt + duration + STROKE_GAP;
      if (newGroup) {
        lastGroup.current = s.group;
        const g = s.group;
        groupTimers.current.push(
          window.setTimeout(() => onGroupStart?.(g), Math.max(0, startAt - now)),
        );
      }
      next.push({ ...s, startAt, duration, delay: startAt - now, length });
    }
    seen.current = strokes.length;
    setScheduled((prev) => [...prev, ...next]);
    const idle = window.setTimeout(() => onIdle?.(), Math.max(0, penFreeAt.current - now));
    groupTimers.current.push(idle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes, playKey]);

  const height = useMemo(() => {
    const lines = Math.max(groups.length, 1);
    return Math.max(MIN_HEIGHT, 160 + lines * LINE_PITCH);
  }, [groups.length]);

  const rules = useMemo(() => {
    const ys: number[] = [];
    for (let y = 60; y < height; y += 40) ys.push(y);
    return ys;
  }, [height]);

  return (
    <svg
      viewBox={`0 0 800 ${height}`}
      className="w-full h-auto rounded-xl shadow-sm"
      style={{ background: '#fdfcf7' }}
      role="img"
      aria-label="Handwritten working"
    >
      <g stroke="#b9d3ee" strokeWidth={1}>
        {rules.map((y) => (
          <path key={y} d={`M0 ${y}H800`} />
        ))}
      </g>
      <path d={`M60 0V${height}`} stroke="#e8a0a0" strokeWidth={1.2} />
      <g fill="none" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        {scheduled.map((s) => (
          <path
            key={s.id}
            d={s.d}
            stroke={RED_GROUPS.has(s.group) ? RED_PEN : INK}
            strokeWidth={RED_GROUPS.has(s.group) ? 2.4 : 3}
            style={{
              strokeDasharray: s.length,
              strokeDashoffset: s.length,
              animation: `ink-write ${s.duration}ms linear ${Math.max(0, s.delay)}ms forwards`,
            }}
          />
        ))}
      </g>
    </svg>
  );
}
