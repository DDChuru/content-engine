'use client';

import { useId, useRef, useState } from 'react';
import { MathText } from '@/components/math-text';
import { MasteryBadge } from '@/components/mastery-badge';

/**
 * Tap-to-select → tap-region-to-place Venn diagram. Every interaction is
 * click/Enter/Space, so it works identically with touch, mouse, and keyboard
 * (v1's pointer model never fired on touch, killing the flagship interactive
 * on phones).
 */

export type VennRegion = 'a-only' | 'b-only' | 'both' | 'outside';

export interface VennSet {
  label: string;
  members: string[];
}

export interface VennBoardProps {
  universe: string[];
  setA: VennSet;
  setB: VennSet;
  onComplete?: () => void;
}

// --- Exam-paper geometry (viewBox 400×280) -------------------------------
const CXA = 154;
const CXB = 246;
const CY = 140;
const R = 86;
const MX = (CXA + CXB) / 2;
const LENS_H = Math.sqrt(R * R - ((CXB - CXA) / 2) ** 2);
const Y1 = +(CY - LENS_H).toFixed(1);
const Y2 = +(CY + LENS_H).toFixed(1);

const LENS_PATH = `M ${MX} ${Y1} A ${R} ${R} 0 0 1 ${MX} ${Y2} A ${R} ${R} 0 0 1 ${MX} ${Y1} Z`;
const A_ONLY_PATH = `M ${MX} ${Y1} A ${R} ${R} 0 1 0 ${MX} ${Y2} A ${R} ${R} 0 0 1 ${MX} ${Y1} Z`;
const B_ONLY_PATH = `M ${MX} ${Y1} A ${R} ${R} 0 1 1 ${MX} ${Y2} A ${R} ${R} 0 0 0 ${MX} ${Y1} Z`;

/** Overlay slots (percentages of the 400×280 canvas) where placed chips sit. */
const REGION_SLOTS: Record<VennRegion, string> = {
  'a-only': 'left-[17%] top-[26%] h-[48%] w-[23%]',
  'b-only': 'left-[60%] top-[26%] h-[48%] w-[23%]',
  both: 'left-[40%] top-[26%] h-[48%] w-[20%]',
  outside: 'inset-x-[4%] bottom-[3%]',
};

export function VennBoard({ universe, setA, setB, onComplete }: VennBoardProps) {
  const uid = useId();
  const members = Array.from(new Set(universe.map(String)));
  const inA = new Set(setA.members.map(String));
  const inB = new Set(setB.members.map(String));

  const [placements, setPlacements] = useState<Record<string, VennRegion>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState(false);
  const [complete, setComplete] = useState(false);
  const [activeRegion, setActiveRegion] = useState<VennRegion | null>(null);
  /** onComplete fires at most once per mount, whatever the state churn. */
  const completeFiredRef = useRef(false);

  function correctRegion(m: string): VennRegion {
    if (inA.has(m) && inB.has(m)) return 'both';
    if (inA.has(m)) return 'a-only';
    if (inB.has(m)) return 'b-only';
    return 'outside';
  }

  function diagnosis(m: string): string {
    switch (correctRegion(m)) {
      case 'both':
        return `${m} is in both sets, so it lives in the intersection.`;
      case 'a-only':
        return `${m} is in ${setA.label} but not ${setB.label}, so it belongs in ${setA.label} only.`;
      case 'b-only':
        return `${m} is in ${setB.label} but not ${setA.label}, so it belongs in ${setB.label} only.`;
      case 'outside':
        return `${m} is in neither set, so it stays outside the circles.`;
    }
  }

  function tapChip(m: string) {
    if (complete) return;
    if (placements[m]) {
      // Pick a placed chip back up: returns to the tray, ready to re-place.
      setPlacements((p) => {
        const next = { ...p };
        delete next[m];
        return next;
      });
      setResults((r) => {
        const next = { ...r };
        delete next[m];
        return next;
      });
      setSelected(m);
    } else {
      setSelected((s) => (s === m ? null : m));
    }
  }

  function tapRegion(region: VennRegion) {
    if (complete || !selected) return;
    const chip = selected;
    setPlacements((p) => ({ ...p, [chip]: region }));
    setResults((r) => {
      const next = { ...r };
      delete next[chip];
      return next;
    });
    setSelected(null);
  }

  function check() {
    const next: Record<string, boolean> = {};
    for (const m of members) next[m] = placements[m] === correctRegion(m);
    setResults(next);
    setChecked(true);
    if (members.every((m) => next[m])) {
      setComplete(true);
      if (!completeFiredRef.current) {
        completeFiredRef.current = true;
        onComplete?.();
      }
    }
  }

  function reset() {
    if (complete) return;
    setPlacements({});
    setSelected(null);
    setResults({});
    setChecked(false);
    setComplete(false);
  }

  const trayMembers = members.filter((m) => !placements[m]);
  const unplaced = trayMembers.length;
  const misplaced = members.filter((m) => results[m] === false);

  const regions: Array<{
    id: VennRegion;
    name: string;
    outline: React.ReactNode;
    hit: { kind: 'path'; d: string } | { kind: 'rect' };
  }> = [
    { id: 'outside', name: 'Outside the circles', outline: null, hit: { kind: 'rect' } },
    { id: 'a-only', name: `${setA.label} only`, outline: null, hit: { kind: 'path', d: A_ONLY_PATH } },
    { id: 'b-only', name: `${setB.label} only`, outline: null, hit: { kind: 'path', d: B_ONLY_PATH } },
    {
      id: 'both',
      name: `Intersection of ${setA.label} and ${setB.label}`,
      outline: null,
      hit: { kind: 'path', d: LENS_PATH },
    },
  ];

  function chipClasses(m: string): string {
    const base =
      'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border bg-paper-raised px-3 py-1 text-sm animate-chip-in';
    if (selected === m) return `${base} border-accent ring-2 ring-accent`;
    if (results[m] === true) return `${base} border-secure ring-1 ring-secure`;
    if (results[m] === false)
      return `${base} border-developing ring-1 ring-developing`;
    return `${base} border-grid-line`;
  }

  function chipMark(m: string): React.ReactNode {
    if (results[m] === true)
      return (
        <span aria-hidden="true" className="mr-1 text-secure">
          ✓
        </span>
      );
    if (results[m] === false)
      return (
        <span aria-hidden="true" className="mr-1 text-developing">
          ✗
        </span>
      );
    return null;
  }

  const regionTint = (id: VennRegion) =>
    activeRegion === id && selected !== null && !complete;

  return (
    <div className="mt-5">
      <p className="text-sm text-ink-muted">
        Tap an element to pick it up, then tap the region of the diagram where
        it belongs. Tap a placed element to pick it back up.
      </p>

      <div className="mt-3 flex flex-col">
        {/* Tray first in the DOM so keyboard flow is select-then-place;
            visually it sits below the diagram. */}
        <div
          role="group"
          aria-label="Elements to place"
          className="order-2 mt-3 flex min-h-[52px] flex-wrap items-center gap-2"
        >
          {trayMembers.map((m) => (
            <button
              key={`tray-${m}`}
              type="button"
              aria-pressed={selected === m}
              onClick={() => tapChip(m)}
              className={chipClasses(m)}
            >
              <MathText>{m}</MathText>
            </button>
          ))}
          {trayMembers.length === 0 && !complete && (
            <span className="text-sm text-ink-muted">
              All elements placed.
            </span>
          )}
        </div>

        <div className="relative order-1 aspect-[10/7] w-full">
          <svg
            viewBox="0 0 400 280"
            className="h-full w-full"
            aria-label={`Venn diagram of sets ${setA.label} and ${setB.label}`}
          >
            {/* ξ boundary + circles: ink hairlines on paper */}
            <rect
              x="6"
              y="6"
              width="388"
              height="268"
              fill="var(--paper-raised)"
              stroke="var(--ink)"
              strokeWidth="1.5"
            />
            <circle
              cx={CXA}
              cy={CY}
              r={R}
              fill="none"
              stroke="var(--ink)"
              strokeWidth="1.5"
            />
            <circle
              cx={CXB}
              cy={CY}
              r={R}
              fill="none"
              stroke="var(--ink)"
              strokeWidth="1.5"
            />
            <text
              x="24"
              y="36"
              fontSize="20"
              fontStyle="italic"
              fill="var(--ink)"
              style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
            >
              ξ
            </text>
            <text
              x="96"
              y="62"
              fontSize="20"
              fontStyle="italic"
              fill="var(--ink)"
              style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
            >
              {setA.label}
            </text>
            <text
              x="296"
              y="62"
              fontSize="20"
              fontStyle="italic"
              fill="var(--ink)"
              style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
            >
              {setB.label}
            </text>

            {/* Active-region tint (display only, ≤8% accent) */}
            {regionTint('a-only') && (
              <path d={A_ONLY_PATH} fill="var(--accent)" opacity="0.07" />
            )}
            {regionTint('b-only') && (
              <path d={B_ONLY_PATH} fill="var(--accent)" opacity="0.07" />
            )}
            {regionTint('both') && (
              <path d={LENS_PATH} fill="var(--accent)" opacity="0.07" />
            )}
            {regionTint('outside') && (
              <>
                <mask id={`${uid}-outside`}>
                  <rect x="6" y="6" width="388" height="268" fill="white" />
                  <circle cx={CXA} cy={CY} r={R} fill="black" />
                  <circle cx={CXB} cy={CY} r={R} fill="black" />
                </mask>
                <rect
                  x="6"
                  y="6"
                  width="388"
                  height="268"
                  fill="var(--accent)"
                  opacity="0.07"
                  mask={`url(#${uid}-outside)`}
                />
              </>
            )}

            {/* Tap/keyboard hit areas — exact region shapes, no overlap */}
            {regions.map((r) => {
              const shared = {
                fill: 'transparent',
                stroke: activeRegion === r.id ? 'var(--accent)' : 'none',
                strokeWidth: 2,
                tabIndex: complete ? -1 : 0,
                role: 'button',
                'aria-label': selected
                  ? `${r.name}. Place ${selected} here`
                  : r.name,
                onClick: () => tapRegion(r.id),
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    tapRegion(r.id);
                  }
                },
                onPointerEnter: () => setActiveRegion(r.id),
                onPointerLeave: () => setActiveRegion(null),
                onFocus: () => setActiveRegion(r.id),
                onBlur: () => setActiveRegion(null),
                className: 'cursor-pointer focus:outline-none',
              };
              return r.hit.kind === 'rect' ? (
                <rect
                  key={r.id}
                  x="6"
                  y="6"
                  width="388"
                  height="268"
                  {...shared}
                />
              ) : (
                <path key={r.id} d={r.hit.d} {...shared} />
              );
            })}
          </svg>

          {/* Placed chips overlay the diagram; empty space falls through to
              the SVG regions underneath. */}
          {(Object.keys(REGION_SLOTS) as VennRegion[]).map((region) => (
            <div
              key={region}
              className={`pointer-events-none absolute flex flex-wrap content-center items-center justify-center gap-1 ${REGION_SLOTS[region]}`}
            >
              {members
                .filter((m) => placements[m] === region)
                .map((m) => (
                  <button
                    key={`${m}-${region}`}
                    type="button"
                    aria-label={`${m}, placed in ${
                      regions.find((r) => r.id === region)?.name
                    }. Tap to pick back up`}
                    onClick={() => tapChip(m)}
                    disabled={complete}
                    className={`pointer-events-auto ${chipClasses(m)}`}
                  >
                    {chipMark(m)}
                    <MathText>{m}</MathText>
                  </button>
                ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {complete ? (
          <p className="flex items-center gap-2 font-medium text-secure">
            <MasteryBadge state="secure" />
            Every element in its place.
          </p>
        ) : (
          <button
            type="button"
            onClick={check}
            disabled={unplaced > 0}
            className="min-h-[44px] rounded-sm bg-accent px-5 font-medium text-paper transition-colors duration-150 ease-out-quart hover:bg-accent-pressed disabled:bg-grid-line disabled:text-ink-muted"
          >
            {unplaced > 0
              ? `Place ${unplaced} more`
              : checked
                ? 'Check again'
                : 'Check'}
          </button>
        )}
        {/* Completion is terminal for the mounted board: no Reset after it. */}
        {!complete && (
          <button
            type="button"
            onClick={reset}
            disabled={Object.keys(placements).length === 0 && !checked}
            className="min-h-[44px] px-2 text-sm font-medium text-accent underline-offset-4 hover:underline disabled:text-ink-muted disabled:no-underline"
          >
            Reset
          </button>
        )}
      </div>

      {!complete && misplaced.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-sm" aria-live="polite">
          {misplaced.map((m) => (
            <li key={m} className="flex items-start gap-2">
              <span aria-hidden="true" className="text-developing">
                ✗
              </span>
              <MathText>{diagnosis(m)}</MathText>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
