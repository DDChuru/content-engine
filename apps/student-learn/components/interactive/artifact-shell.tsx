'use client';

import React, { useId, useState } from 'react';
import { MathText } from '@/components/math-text';

/**
 * Shared chrome for the interactive notes artifacts.
 *
 * The design rule these encode: the student must be WRONG FIRST, visibly.
 * Every artifact opens with a PredictGate — a committed guess — and only then
 * unlocks the thing that shows the guess failing. An animation you can only
 * watch is a textbook that moves; the surprise is the teaching.
 *
 * Everything here is SVG + CSS. No images, no chart library, no canvas.
 */

export function Artifact({
  code,
  title,
  claim,
  children,
}: {
  code: string;
  title: string;
  /** The wrong belief, in the student's own voice. Named out loud, up front. */
  claim: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-grid-line bg-paper-raised p-4 md:p-6">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
        {code}
      </p>
      <h2 className="mt-1 font-heading text-xl md:text-2xl">{title}</h2>
      <p className="mt-2 border-l-2 border-accent pl-3 text-sm italic text-ink-muted">
        <MathText>{claim}</MathText>
      </p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export interface PredictOption {
  id: string;
  label: string;
  correct?: boolean;
  /** Shown after committing — why this guess is tempting, or why it holds. */
  note: string;
}

/**
 * Commit-then-see. No score, no streak, no timer: the only thing recorded is
 * whether the prediction survived contact with the physics.
 */
export function PredictGate({
  question,
  options,
  children,
}: {
  question: string;
  options: PredictOption[];
  /** Rendered only after a prediction is committed. */
  children: (state: { chosen: PredictOption; correct: boolean }) => React.ReactNode;
}) {
  const uid = useId();
  const [chosenId, setChosenId] = useState<string | null>(null);
  const chosen = options.find((o) => o.id === chosenId) ?? null;

  return (
    <div>
      <fieldset
        className="rounded-lg border border-grid-line bg-paper p-3"
        aria-describedby={`${uid}-verdict`}
      >
        <legend className="px-1 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          Predict first
        </legend>
        <p className="text-sm font-medium text-ink">
          <MathText>{question}</MathText>
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {options.map((o) => {
            const picked = o.id === chosenId;
            const settled = chosen !== null;
            const tone = !settled
              ? 'border-grid-line hover:border-accent'
              : o.correct
                ? 'border-secure bg-[color-mix(in_srgb,var(--secure)_10%,transparent)]'
                : picked
                  ? 'border-accent bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]'
                  : 'border-grid-line opacity-60';
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={picked}
                onClick={() => setChosenId(o.id)}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${tone}`}
              >
                <span className="font-medium">
                  <MathText>{o.label}</MathText>
                </span>
                {settled && (
                  <span className="mt-1 block text-xs text-ink-muted">
                    <MathText>{o.note}</MathText>
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p id={`${uid}-verdict`} role="status" className="mt-3 text-sm">
          {chosen ? (
            chosen.correct ? (
              <span className="font-semibold text-secure">
                You committed to the right one. Now prove it to yourself below.
              </span>
            ) : (
              <span className="font-semibold text-accent">
                That is the common answer, and it is wrong. Watch it break below.
              </span>
            )
          ) : (
            <span className="text-ink-muted">
              Choose one. The model unlocks after you commit — guessing in your
              head does not count.
            </span>
          )}
        </p>
      </fieldset>

      {chosen && (
        <div className="mt-4 animate-chip-in">
          {children({ chosen, correct: Boolean(chosen.correct) })}
        </div>
      )}
    </div>
  );
}

/** Labelled range input: touch-draggable, keyboard-operable, zero bytes of JS library. */
export function Dial({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  valueText,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  valueText?: string;
}) {
  const uid = useId();
  return (
    <div>
      <label
        htmlFor={uid}
        className="flex items-baseline justify-between text-xs font-medium text-ink-muted"
      >
        <span>{label}</span>
        <span className="font-mono text-sm text-ink">
          {valueText ?? `${value}${unit ? ` ${unit}` : ''}`}
        </span>
      </label>
      <input
        id={uid}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText ?? `${value} ${unit ?? ''}`.trim()}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 h-6 w-full cursor-pointer accent-[var(--accent)]"
      />
    </div>
  );
}

/** A number the student is meant to watch change. */
export function Readout({
  label,
  value,
  tone = 'ink',
}: {
  label: string;
  value: string;
  tone?: 'ink' | 'accent' | 'secure' | 'muted';
}) {
  const colour =
    tone === 'accent'
      ? 'text-accent'
      : tone === 'secure'
        ? 'text-secure'
        : tone === 'muted'
          ? 'text-ink-muted'
          : 'text-ink';
  return (
    <div className="rounded-lg border border-grid-line bg-paper px-3 py-2">
      <p className="whitespace-nowrap text-[0.7rem] tracking-[0.06em] text-ink-muted">
        <MathText>{label}</MathText>
      </p>
      <p className={`font-mono text-base font-semibold ${colour}`}>{value}</p>
    </div>
  );
}

/** True when the reader asked the OS for less motion. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return reduced;
}
