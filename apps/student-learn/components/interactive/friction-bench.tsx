'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Artifact,
  Dial,
  PredictGate,
  Readout,
  usePrefersReducedMotion,
} from '@/components/interactive/artifact-shell';
import { MathText } from '@/components/math-text';

/**
 * M4.1e-X01 — "Friction is always μR" (and M4.4e-X01, "friction is μ × mass").
 *
 * Physics implemented (g = 10, horizontal floor, horizontal push P):
 *   R  = mg                              (vertical equilibrium)
 *   f  = min(P, μR)  while P ≤ μR        (friction takes only what it needs)
 *   f  = μR          once P > μR         (limiting / sliding)
 *   a  = (P − μR) / m                    (Newton's second law along the floor)
 *
 * The lesson is the instant f stops matching P. Below the limit the two arrows
 * are the same length and the block will not move however hard you look at it;
 * one notch past μR they separate and the block goes.
 */

const G = 10;

export function FrictionBench() {
  return (
    <Artifact
      code="M4.1e-X01 · M4.4e-X01"
      title="Friction takes only what it needs"
      claim="“The surface is rough, so friction is $\mu R$. And $\mu R$ is $\mu$ times the mass.”"
    >
      <PredictGate
        question="A 4 kg block sits on a rough floor, $\mu = 0.5$. You push it horizontally with 12 N and it does not move. What is the friction force on it?"
        options={[
          {
            id: 'mur',
            label: '20 N — friction is $\\mu R = 0.5 \\times 40$',
            note: 'This is the trap. $\\mu R$ is the MOST friction the surface can supply, not the friction acting. 20 N would push the block backwards on its own.',
          },
          {
            id: 'match',
            label: '12 N — friction matches the push',
            correct: true,
            note: 'The block is in equilibrium, so the horizontal forces balance: $f = P = 12$ N. Friction only reaches $\\mu R$ at the point of slipping.',
          },
          {
            id: 'mum',
            label: '2 N — friction is $\\mu m = 0.5 \\times 4$',
            note: '$\\mu$ multiplies a FORCE in newtons, never a mass in kilograms. $\\mu m$ is wrong by a factor of $g$ and has the wrong units.',
          },
        ]}
      >
        {() => <Bench />}
      </PredictGate>
    </Artifact>
  );
}

function Bench() {
  const [mass, setMass] = useState(4);
  const [mu, setMu] = useState(0.5);
  const [push, setPush] = useState(12);
  const reduced = usePrefersReducedMotion();

  const R = mass * G;
  const limit = mu * R;
  const slipping = push > limit + 1e-9;
  const friction = slipping ? limit : push;
  const accel = slipping ? (push - limit) / mass : 0;

  // --- block motion -------------------------------------------------------
  const [x, setX] = useState(0);
  const state = useRef({ x: 0, v: 0, t: 0 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!slipping) {
      state.current = { x: 0, v: 0, t: 0 };
      setX(0);
      return;
    }
    if (reduced) {
      // No animation: show the displaced block, the fact that it moved is the point.
      state.current = { x: 90, v: 0, t: 0 };
      setX(90);
      return;
    }
    let live = true;
    state.current = { x: 0, v: 0, t: performance.now() };
    const step = (now: number) => {
      if (!live) return;
      const s = state.current;
      const dt = Math.min((now - s.t) / 1000, 0.05);
      s.t = now;
      s.v += accel * dt;
      s.x += s.v * 12 * dt; // 12 px per metre — keeps a slow slip visible
      if (s.x > 100) {
        s.x = 0;
        s.v = 0;
      }
      setX(s.x);
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => {
      live = false;
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [slipping, accel, reduced]);

  // Bar chart: baseline y = 62, 48 px of headroom, scaled so both bars and the
  // dashed limit line share one scale whatever the sliders say.
  const barScale = Math.max(limit, push, 1);
  const barY = (v: number) => 62 - (48 * v) / barScale;
  const limitY = barY(limit);

  const pxPerN = 1.6;
  const arrowP = Math.max(2, push * pxPerN);
  const arrowF = Math.max(2, friction * pxPerN);

  return (
    <div>
      <svg
        viewBox="0 0 360 170"
        className="w-full rounded-lg border border-grid-line bg-paper"
        role="img"
        aria-label={`Block of ${mass} kilograms. Push ${push} newtons, friction ${friction.toFixed(1)} newtons, limit ${limit.toFixed(1)} newtons. ${slipping ? `Sliding with acceleration ${accel.toFixed(2)} metres per second squared.` : 'Not moving.'}`}
      >
        <defs>
          <marker id="fb-head-accent" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="var(--accent)" />
          </marker>
          <marker id="fb-head-ink" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="var(--ink)" />
          </marker>
        </defs>

        {/* floor */}
        <line x1="10" y1="118" x2="350" y2="118" stroke="var(--ink)" strokeWidth="2" />
        {Array.from({ length: 18 }, (_, i) => (
          <line
            key={i}
            x1={12 + i * 19}
            y1="118"
            x2={4 + i * 19}
            y2="128"
            stroke="var(--ink-muted)"
            strokeWidth="1"
          />
        ))}

        <g transform={`translate(${120 + x} 0)`}>
          {/* block */}
          <rect
            x="0"
            y="76"
            width="62"
            height="42"
            rx="3"
            fill="var(--paper-raised)"
            stroke="var(--ink)"
            strokeWidth="2"
          />
          <text x="31" y="102" textAnchor="middle" fontSize="13" fill="var(--ink)">
            {mass} kg
          </text>

          {/* applied push, from the left */}
          <line
            x1={-arrowP}
            y1="97"
            x2="-3"
            y2="97"
            stroke="var(--accent)"
            strokeWidth="3"
            markerEnd="url(#fb-head-accent)"
          />
          <text x={-arrowP} y="88" fontSize="11" fill="var(--accent)">
            P = {push} N
          </text>

          {/* friction, at the contact, opposing */}
          <line
            x1={arrowF}
            y1="126"
            x2="1"
            y2="126"
            stroke="var(--ink)"
            strokeWidth="3"
            markerEnd="url(#fb-head-ink)"
          />
          <text x={arrowF + 4} y="142" fontSize="11" fill="var(--ink)">
            f = {friction.toFixed(1)} N
          </text>
        </g>

        {/* the limit, as a ceiling the friction bar can never pass */}
        <g>
          <line
            x1="10"
            y1={limitY}
            x2="350"
            y2={limitY}
            stroke="var(--developing)"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <text x="12" y={limitY - 5} fontSize="11" fill="var(--developing)">
            limit μR = {limit.toFixed(1)} N
          </text>
          <rect x="250" y={barY(push)} width="26" height={62 - barY(push)} fill="var(--accent)" />
          <rect x="286" y={barY(friction)} width="26" height={62 - barY(friction)} fill="var(--ink)" />
          <line x1="244" y1="62" x2="318" y2="62" stroke="var(--ink-muted)" strokeWidth="1" />
          <text x="263" y="72" fontSize="9" textAnchor="middle" fill="var(--ink-muted)">
            push
          </text>
          <text x="299" y="72" fontSize="9" textAnchor="middle" fill="var(--ink-muted)">
            friction
          </text>
        </g>
      </svg>

      <p
        role="status"
        className={`mt-3 rounded-lg px-3 py-2 text-sm font-medium ${
          slipping
            ? 'bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-accent'
            : 'bg-[color-mix(in_srgb,var(--secure)_12%,transparent)] text-secure'
        }`}
      >
        {slipping ? (
          <MathText>
            {`Slipping. Friction is stuck at its maximum $\\mu R$, the push wins, and $a = (P - \\mu R)/m$.`}
          </MathText>
        ) : (
          <MathText>
            {`Still. Friction is exactly matching the push — it is $P$, not $\\mu R$. Push harder.`}
          </MathText>
        )}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
        <Readout label="$R = mg$" value={`${R.toFixed(0)} N`} />
        <Readout label="limit: $\mu R$" value={`${limit.toFixed(1)} N`} tone="muted" />
        <Readout
          label="friction acting $f$"
          value={`${friction.toFixed(1)} N`}
          tone={slipping ? 'accent' : 'secure'}
        />
        <Readout
          label="acceleration $a$"
          value={`${accel.toFixed(2)} m s⁻²`}
          tone={slipping ? 'accent' : 'muted'}
        />
      </div>

      <div className="mt-3 rounded-lg border border-dashed border-grid-line px-3 py-2 text-xs text-ink-muted">
        <MathText>
          {`The other trap, side by side: $\\mu m = ${(mu * mass).toFixed(1)}$ — a number with no units that means nothing. $\\mu R = ${limit.toFixed(1)}$ N is the one that is a force.`}
        </MathText>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Dial label="Push P" value={push} min={0} max={60} step={1} unit="N" onChange={setPush} />
        <Dial label="Mass m" value={mass} min={1} max={10} step={1} unit="kg" onChange={setMass} />
        <Dial label="Coefficient μ" value={mu} min={0} max={1} step={0.05} onChange={setMu} />
      </div>

      <button
        type="button"
        onClick={() => setPush(Math.round(limit) + 1)}
        className="mt-3 rounded-lg border border-accent px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
      >
        Take me to one newton past the limit
      </button>
    </div>
  );
}
