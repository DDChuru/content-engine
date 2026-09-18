'use client';

import { useState } from 'react';
import {
  Artifact,
  Dial,
  PredictGate,
  Readout,
} from '@/components/interactive/artifact-shell';
import { MathText } from '@/components/math-text';

/**
 * M4.1d-X01 — "sin and cos swapped on a slope".
 *
 * Physics implemented (g = 10, block of mass m resting on a plane inclined at θ
 * to the horizontal, weight mg vertically down):
 *   along the slope (down-slope):      mg sin θ
 *   perpendicular to the slope:        mg cos θ
 *   and the two are the legs of a right triangle whose hypotenuse IS the weight:
 *     (mg sin θ)² + (mg cos θ)² = (mg)²
 *
 * The drawing is the argument: θ appears between the weight and the normal,
 * so the leg OPPOSITE θ — the one along the slope — carries the sine.
 * Dragging to 0° settles it: a flat table pulls nothing along itself.
 */

const G = 10;
const RAD = Math.PI / 180;

export function SlopeResolver() {
  return (
    <Artifact
      code="M4.1d-X01"
      title="Which one gets the sine?"
      claim="“Down the slope is $mg\cos\theta$, and into the slope is $mg\sin\theta$.”"
    >
      <PredictGate
        question="A block rests on a slope at angle $\theta$ to the horizontal. Which expression is the component of its weight ALONG the slope?"
        options={[
          {
            id: 'cos',
            label: '$mg\\cos\\theta$',
            note: 'The usual swap. It is self-consistent enough to look right, and it is wrong at every angle except 45°. Drag to 0° below and watch it claim a flat table pulls the block sideways.',
          },
          {
            id: 'sin',
            label: '$mg\\sin\\theta$',
            correct: true,
            note: 'Right. $\\theta$ sits between the weight and the normal, so the leg along the slope is the one opposite $\\theta$.',
          },
          {
            id: 'tan',
            label: '$mg\\tan\\theta$',
            note: 'Tangent is a ratio of the two legs, not a component. At 90° it is infinite, which no force is.',
          },
        ]}
      >
        {({ chosen }) => <Slope studentRule={chosen.id === 'cos' ? 'cos' : chosen.id === 'tan' ? 'tan' : 'sin'} />}
      </PredictGate>
    </Artifact>
  );
}

type Rule = 'sin' | 'cos' | 'tan';

function Slope({ studentRule }: { studentRule: Rule }) {
  const [deg, setDeg] = useState(30);
  const [mass, setMass] = useState(5);

  const th = deg * RAD;
  const W = mass * G;
  const along = W * Math.sin(th);
  const perp = W * Math.cos(th);
  const studentValue =
    studentRule === 'sin' ? along : studentRule === 'cos' ? perp : W * Math.tan(th);

  // --- geometry (viewBox 360 × 240) ---------------------------------------
  // The wedge is drawn as long as the frame allows and then centred, so a steep
  // slope does not shrink into a corner.
  const maxRise = 118; // apex stays clear of the two labels at the top
  const L = Math.max(130, Math.min(290, deg < 1 ? 290 : maxRise / Math.sin(th)));
  const baseW = L * Math.cos(th);
  const pivot = { x: Math.min(300, (360 - baseW) / 2 + baseW), y: 170 };
  const apex = {
    x: pivot.x - L * Math.cos(th),
    y: pivot.y - L * Math.sin(th),
  };
  // Unit vectors in SCREEN coordinates (y grows downwards).
  const u = { x: Math.cos(th), y: Math.sin(th) }; // down the slope
  const n = { x: -Math.sin(th), y: Math.cos(th) }; // into the slope
  const foot = 0.45; // where the block sits along the slope
  const B = {
    x: apex.x + (pivot.x - apex.x) * foot,
    y: apex.y + (pivot.y - apex.y) * foot,
  };
  // The weight arrow is drawn the same length at every mass: the triangle is an
  // argument about DIRECTION, and the numbers are in the readouts.
  const scale = 62 / W; // px per newton
  const wLen = W * scale;
  const Wtip = { x: B.x, y: B.y + wLen };
  const aTip = { x: B.x + u.x * along * scale, y: B.y + u.y * along * scale };

  return (
    <div>
      <svg
        viewBox="0 0 360 240"
        className="w-full rounded-lg border border-grid-line bg-paper"
        role="img"
        aria-label={`Slope at ${deg} degrees. Weight ${W} newtons. Component along the slope ${along.toFixed(1)} newtons, perpendicular ${perp.toFixed(1)} newtons.`}
      >
        <defs>
          <marker id="sr-head" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="var(--ink)" />
          </marker>
          <marker id="sr-head-a" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="var(--accent)" />
          </marker>
          <marker id="sr-head-s" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="var(--secure)" />
          </marker>
        </defs>

        {/* the wedge */}
        <path
          d={`M ${apex.x} ${apex.y} L ${pivot.x} ${pivot.y} L ${apex.x} ${pivot.y} Z`}
          fill="color-mix(in srgb, var(--grid-line) 45%, transparent)"
          stroke="var(--ink)"
          strokeWidth="2"
        />
        {/* angle arc at the pivot, θ to the horizontal */}
        <path
          d={`M ${pivot.x - 46} ${pivot.y} A 46 46 0 0 0 ${pivot.x - 46 * Math.cos(th)} ${pivot.y - 46 * Math.sin(th)}`}
          fill="none"
          stroke="var(--developing)"
          strokeWidth="2"
        />
        <text x={pivot.x - 62} y={pivot.y - 10} fontSize="12" fill="var(--developing)">
          θ = {deg}°
        </text>

        {/* the block */}
        <rect
          x={-13}
          y={-20}
          width="26"
          height="20"
          rx="2"
          fill="var(--paper-raised)"
          stroke="var(--ink)"
          strokeWidth="2"
          transform={`translate(${B.x} ${B.y}) rotate(${-deg})`}
        />

        {/* weight: the hypotenuse */}
        <line
          x1={B.x}
          y1={B.y}
          x2={Wtip.x}
          y2={Wtip.y}
          stroke="var(--ink)"
          strokeWidth="2.5"
          markerEnd="url(#sr-head)"
        />
        <text x={B.x + 6} y={B.y + wLen * 0.6} fontSize="11" fill="var(--ink)">
          mg = {W} N
        </text>

        {/* leg 1: along the slope, opposite θ → the sine */}
        <line
          x1={B.x}
          y1={B.y}
          x2={aTip.x}
          y2={aTip.y}
          stroke="var(--accent)"
          strokeWidth="3"
          markerEnd="url(#sr-head-a)"
        />
        {/* leg 2: from that tip, perpendicular into the slope, closing on the weight */}
        <line
          x1={aTip.x}
          y1={aTip.y}
          x2={Wtip.x}
          y2={Wtip.y}
          stroke="var(--secure)"
          strokeWidth="3"
          strokeDasharray="5 4"
          markerEnd="url(#sr-head-s)"
        />
        {/* the right angle between the two legs */}
        <path
          d={`M ${aTip.x - u.x * 9} ${aTip.y - u.y * 9} L ${aTip.x - u.x * 9 + n.x * 9} ${aTip.y - u.y * 9 + n.y * 9} L ${aTip.x + n.x * 9} ${aTip.y + n.y * 9}`}
          fill="none"
          stroke="var(--ink-muted)"
          strokeWidth="1.2"
        />

        <text x="10" y="18" fontSize="12" fill="var(--accent)" fontWeight="600">
          along slope = {along.toFixed(1)} N
        </text>
        <text x="10" y="34" fontSize="12" fill="var(--secure)" fontWeight="600">
          into slope = {perp.toFixed(1)} N
        </text>
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
        <Readout label="weight $mg$" value={`${W} N`} />
        <Readout label="along: $mg\sin\theta$" value={`${along.toFixed(1)} N`} tone="accent" />
        <Readout label="into: $mg\cos\theta$" value={`${perp.toFixed(1)} N`} tone="secure" />
        <Readout
          label="the two legs recombine"
          value={`${Math.hypot(along, perp).toFixed(1)} N`}
          tone="muted"
        />
      </div>

      {studentRule !== 'sin' && (
        <p className="mt-3 rounded-lg bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-3 py-2 text-sm text-accent">
          <MathText>
            {`Your rule says the pull down the slope is $${studentRule === 'cos' ? 'mg\\cos\\theta' : 'mg\\tan\\theta'} = ${Number.isFinite(studentValue) ? studentValue.toFixed(1) : '\\infty'}$ N. The drawing says ${along.toFixed(1)} N.`}
          </MathText>
        </p>
      )}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Dial
          label="Slope angle θ"
          value={deg}
          min={0}
          max={90}
          step={1}
          unit="°"
          onChange={setDeg}
        />
        <Dial label="Mass m" value={mass} min={1} max={10} step={1} unit="kg" onChange={setMass} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDeg(0)}
          className="rounded-lg border border-accent px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
        >
          Flatten it to 0°
        </button>
        <button
          type="button"
          onClick={() => setDeg(90)}
          className="rounded-lg border border-accent px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
        >
          Stand it up to 90°
        </button>
      </div>

      <p role="status" className="mt-3 text-sm text-ink-muted">
        {deg === 0 && (
          <MathText>
            {`Flat table. Nothing pulls the block sideways, and the whole weight presses into the surface: along $= 0$, into $= mg$. Only $\\sin 0 = 0$ can say that.`}
          </MathText>
        )}
        {deg === 90 && (
          <MathText>
            {`A vertical wall. The block is in free fall along the surface and presses on nothing: along $= mg$, into $= 0$. Only $\\sin 90 = 1$ can say that.`}
          </MathText>
        )}
        {deg !== 0 && deg !== 90 && (
          <MathText>
            {`Drag to the two ends. $\\theta = 0$ and $\\theta = 90$ are the cases where a swapped sine and cosine become absurd — ${deg === 45 ? 'and note that at 45° the two legs are equal, which is exactly why the swap survives so long' : 'at 45° alone the swap is invisible'}.`}
          </MathText>
        )}
      </p>
    </div>
  );
}
