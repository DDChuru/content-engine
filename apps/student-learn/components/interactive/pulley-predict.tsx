'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Artifact,
  Dial,
  Readout,
  usePrefersReducedMotion,
} from '@/components/interactive/artifact-shell';
import { MathText } from '@/components/math-text';

/**
 * M4.4d-X02 — "the hanging mass falls freely, so a = g".
 *
 * Physics implemented (g = 10, smooth table, light inextensible string, smooth
 * pulley; m₁ on the table, m₂ hanging):
 *   m₁:  T = m₁a                    (along the table)
 *   m₂:  m₂g − T = m₂a              (downwards positive)
 *   add: m₂g = (m₁ + m₂)a  ⇒  a = m₂g / (m₁ + m₂)
 *        T = m₁m₂g / (m₁ + m₂)
 * Both bodies share one acceleration because the string does not stretch.
 * a < g whenever m₁ > 0, and T < m₂g whenever a > 0.
 *
 * Wrong-first mechanism: the student COMMITS a number, and their number is then
 * raced, as a ghost, against the real one. A prediction of 10 hits the floor
 * first and visibly; nothing is scored except whether the prediction survived.
 */

const G = 10;
const DROP = 1.5; // metres the hanging mass has to fall
const PX_PER_M = 52;

export function PulleyPredict() {
  return (
    <Artifact
      code="M4.4d-X02"
      title="The hanging mass is not falling freely"
      claim="“Nothing holds the hanging mass up, so it falls at $g$ — the acceleration is 10.”"
    >
      <Rig />
    </Artifact>
  );
}

type Phase = 'predict' | 'running' | 'done';

function Rig() {
  const [m1, setM1] = useState(6); // on the table
  const [m2, setM2] = useState(4); // hanging
  const [guess, setGuess] = useState(10);
  const [phase, setPhase] = useState<Phase>('predict');
  const [t, setT] = useState(0);
  const reduced = usePrefersReducedMotion();

  const a = (m2 * G) / (m1 + m2);
  const T = (m1 * m2 * G) / (m1 + m2);
  const tReal = Math.sqrt((2 * DROP) / a);
  const tGuess = guess > 0 ? Math.sqrt((2 * DROP) / guess) : Infinity;

  // --- the race -----------------------------------------------------------
  const frame = useRef<number | null>(null);
  useEffect(() => {
    if (phase !== 'running') return;
    if (reduced) {
      setT(tReal);
      setPhase('done');
      return;
    }
    const t0 = performance.now();
    const slow = 1.6; // slow motion, so the gap is watchable
    const step = (now: number) => {
      const elapsed = (now - t0) / 1000 / slow;
      if (elapsed >= tReal) {
        setT(tReal);
        setPhase('done');
        return;
      }
      setT(elapsed);
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [phase, tReal, reduced]);

  const drop = (acc: number) => Math.min(DROP, 0.5 * acc * t * t);
  const sReal = drop(a);
  const sGuess = drop(guess);

  // arrow lengths are clamped so nothing escapes the viewBox at 12 kg
  const weightLen = Math.min(26, m2 * G * 0.45);

  const reset = () => {
    setT(0);
    setPhase('predict');
  };

  const guessedG = guess >= 9.5;

  return (
    <div>
      <svg
        viewBox="0 0 360 230"
        className="w-full rounded-lg border border-grid-line bg-paper"
        role="img"
        aria-label={`Pulley system. ${m1} kilogram mass on a smooth table joined over a pulley to a hanging ${m2} kilogram mass. Acceleration ${a.toFixed(2)} metres per second squared, tension ${T.toFixed(1)} newtons.`}
      >
        <defs>
          <marker id="pp-head" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="var(--secure)" />
          </marker>
        </defs>

        {/* table top and edge */}
        <line x1="8" y1="70" x2="240" y2="70" stroke="var(--ink)" strokeWidth="2" />
        <line x1="240" y1="70" x2="240" y2="214" stroke="var(--ink)" strokeWidth="2" />
        <text x="10" y="24" fontSize="10" fill="var(--ink-muted)">
          smooth table
        </text>

        {/* pulley */}
        <circle cx="240" cy="70" r="9" fill="none" stroke="var(--ink)" strokeWidth="2" />

        {/* string */}
        <line
          x1={60 + sReal * PX_PER_M}
          y1="58"
          x2="240"
          y2="58"
          stroke="var(--ink)"
          strokeWidth="1.5"
        />
        <line
          x1="249"
          y1="70"
          x2="249"
          y2={96 + sReal * PX_PER_M}
          stroke="var(--ink)"
          strokeWidth="1.5"
        />

        {/* m1 on the table */}
        <g transform={`translate(${sReal * PX_PER_M} 0)`}>
          <rect
            x="26"
            y="40"
            width="36"
            height="30"
            rx="3"
            fill="var(--paper-raised)"
            stroke="var(--ink)"
            strokeWidth="2"
          />
          <text x="44" y="60" fontSize="12" textAnchor="middle" fill="var(--ink)">
            {m1}
          </text>
        </g>

        {/* the ghost: what the student predicted */}
        {phase !== 'predict' && Math.abs(guess - a) > 0.05 && (
          <g transform={`translate(0 ${sGuess * PX_PER_M})`} opacity="0.45">
            <rect
              x="288"
              y="96"
              width="34"
              height="30"
              rx="3"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <text x="305" y="116" fontSize="10" textAnchor="middle" fill="var(--accent)">
              a={guess}
            </text>
          </g>
        )}

        {/* m2 hanging */}
        <g transform={`translate(0 ${sReal * PX_PER_M})`}>
          <rect
            x="232"
            y="96"
            width="34"
            height="30"
            rx="3"
            fill="var(--paper-raised)"
            stroke="var(--ink)"
            strokeWidth="2"
          />
          <text x="249" y="116" fontSize="12" textAnchor="middle" fill="var(--ink)">
            {m2}
          </text>
          {/* tension on the hanging mass, drawn against its weight */}
          <line
            x1="249"
            y1="96"
            x2="249"
            y2={96 - Math.min(34, Math.max(8, T * 0.45))}
            stroke="var(--secure)"
            strokeWidth="2.5"
            markerEnd="url(#pp-head)"
          />
          <text x="256" y="90" fontSize="10" fill="var(--secure)">
            T = {T.toFixed(1)} N
          </text>
          <line x1="249" y1="126" x2="249" y2={126 + weightLen} stroke="var(--ink)" strokeWidth="2" />
          <text x="256" y={134 + weightLen} fontSize="10" fill="var(--ink)">
            {m2 * G} N
          </text>
        </g>

        {/* the floor the fall ends on */}
        <line
          x1="196"
          y1={126 + DROP * PX_PER_M}
          x2="352"
          y2={126 + DROP * PX_PER_M}
          stroke="var(--ink-muted)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
      </svg>

      {phase === 'predict' ? (
        <div className="mt-3 rounded-lg border border-grid-line bg-paper p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            Predict first
          </p>
          <p className="mt-1 text-sm text-ink">
            <MathText>
              {`The string is released. What is the acceleration of the hanging ${m2} kg mass? Commit a number — you cannot run it until you do.`}
            </MathText>
          </p>
          <div className="mt-3">
            <Dial
              label="My prediction for a"
              value={guess}
              min={0}
              max={10}
              step={0.5}
              unit="m s⁻²"
              onChange={setGuess}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setT(0);
              setPhase('running');
            }}
            className="mt-3 w-full rounded-lg bg-accent px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-pressed"
          >
            Commit {guess} and release the string
          </button>
        </div>
      ) : (
        <div className="mt-3">
          <p
            role="status"
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              Math.abs(guess - a) < 0.05
                ? 'bg-[color-mix(in_srgb,var(--secure)_12%,transparent)] text-secure'
                : 'bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-accent'
            }`}
          >
            {Math.abs(guess - a) < 0.05 ? (
              <MathText>
                {`You called it: $a = ${a.toFixed(2)}$ m s⁻². The hanging weight has to drag the table mass along too.`}
              </MathText>
            ) : guessedG ? (
              <MathText>
                {`You said 10 — “it just falls”. It does not: $a = ${a.toFixed(2)}$ m s⁻². Your ghost block reached the floor in ${tGuess.toFixed(2)} s; the real one takes ${tReal.toFixed(2)} s. The string is taut, so the same ${m2 * G} N of driving weight has to accelerate all ${m1 + m2} kg.`}
              </MathText>
            ) : (
              <MathText>
                {`You said ${guess}; the truth is $a = ${a.toFixed(2)}$ m s⁻². The driving force is only the hanging weight, but the mass being moved is the total.`}
              </MathText>
            )}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Readout label="driving force $m_2g$" value={`${(m2 * G).toFixed(0)} N`} />
            <Readout label="total mass moved" value={`${m1 + m2} kg`} />
            <Readout label="$a = m_2g/(m_1+m_2)$" value={`${a.toFixed(2)} m s⁻²`} tone="accent" />
            <Readout
              label="tension $T = m_1a$"
              value={`${T.toFixed(1)} N`}
              tone="secure"
            />
          </div>

          <div className="mt-3 rounded-lg border border-dashed border-grid-line px-3 py-2 text-xs text-ink-muted">
            <MathText>
              {`Two equations, one unknown each way. Table mass: $T = m_1a = ${m1} \\times ${a.toFixed(2)} = ${T.toFixed(1)}$ N. Hanging mass: $m_2g - T = ${(m2 * G).toFixed(0)} - ${T.toFixed(1)} = ${(m2 * a).toFixed(1)} = m_2a$. The tension is less than the ${m2 * G} N weight — that gap is exactly what is left over to move the block on the table.`}
            </MathText>
          </div>

          <button
            type="button"
            onClick={reset}
            className="mt-3 rounded-lg border border-accent px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
          >
            Change the masses and predict again
          </button>
        </div>
      )}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Dial
          label="On the table m₁"
          value={m1}
          min={0}
          max={12}
          step={1}
          unit="kg"
          onChange={(v) => {
            setM1(v);
            reset();
          }}
        />
        <Dial
          label="Hanging m₂"
          value={m2}
          min={1}
          max={12}
          step={1}
          unit="kg"
          onChange={(v) => {
            setM2(v);
            reset();
          }}
        />
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        <MathText>
          {`Set $m_1 = 0$ to see the only case where the hanging mass really does fall at $g$ — there is nothing left to drag, and the tension goes to zero.`}
        </MathText>
      </p>
    </div>
  );
}
