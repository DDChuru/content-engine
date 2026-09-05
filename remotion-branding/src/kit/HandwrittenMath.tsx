/**
 * HandwrittenMath — a worked solution written out by hand, one stroke at a
 * time, then the next line, then the next.
 *
 * The strokes are a real person's pen, recovered from ink they wrote on the
 * mathboard; the steps come from that board's algebra engine, so the wording
 * beside each line ("divided both sides by 2") is the move the board actually
 * performed rather than a caption typed after the fact.
 *
 * This is a `still: null` scene in the beats sense — pure motion, no capture —
 * so it drops into the slot TutorialKit already leaves for bespoke scenes and
 * inherits the surrounding chrome.
 *
 * Everything is a pure function of the frame. Each stroke is rendered as a
 * filled outline rather than a stroked path, because a pen varies in width
 * along its length and a constant-width `stroke` reads as a marker; the
 * outline is built from the same per-point radii the board draws with.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { BODY, clamp01, DISPLAY, FG2, INK, MUTED, SKY } from './palette';

export type MathStroke = { width: number; pts: [number, number, number][] };
export type MathLine = {
  text: string;
  label: string;
  startF: number;
  endF: number;
  len: number;
  strokes: MathStroke[];
};
export type MathScene = {
  equation: string;
  w: number;
  h: number;
  fps: number;
  durationInFrames: number;
  missing: string[];
  lines: MathLine[];
};

/** Nib radius at a point — the board's own pressure curve. */
const radiusAt = (p: number, width: number) => (width * (0.35 + 0.65 * p)) / 2;

/**
 * The outline of a pen stroke: up one side, round the tip, back down the
 * other. Built only as far as `upto` points, which is what makes the ink
 * appear to be written rather than to fade in.
 */
function outline(pts: [number, number, number][], width: number, upto: number): string {
  const n = Math.min(pts.length, Math.max(2, Math.floor(upto)));
  if (n < 2) return '';
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i < n; i++) {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(n - 1, i + 1)];
    let dx = next[0] - prev[0];
    let dy = next[1] - prev[1];
    const d = Math.hypot(dx, dy) || 1;
    dx /= d;
    dy /= d;
    const r = radiusAt(pts[i][2], width);
    const nx = -dy * r;
    const ny = dx * r;
    left.push(`${(pts[i][0] + nx).toFixed(2)},${(pts[i][1] + ny).toFixed(2)}`);
    right.push(`${(pts[i][0] - nx).toFixed(2)},${(pts[i][1] - ny).toFixed(2)}`);
  }
  const rTip = radiusAt(pts[n - 1][2], width);
  const rEnd = radiusAt(pts[0][2], width);
  return (
    `M${left.join('L')}` +
    `A${rTip.toFixed(2)},${rTip.toFixed(2)} 0 0 1 ${right[n - 1]}` +
    `L${right.reverse().join('L')}` +
    `A${rEnd.toFixed(2)},${rEnd.toFixed(2)} 0 0 1 ${left[0]}Z`
  );
}

/** One written line, revealed by how much of its total path length is done. */
const Line: React.FC<{ line: MathLine; frame: number; ink: string }> = ({ line, frame, ink }) => {
  const span = Math.max(1, line.endF - line.startF);
  const t = clamp01((frame - line.startF) / span);
  if (t <= 0) return null;
  const written = t * line.len;

  let seen = 0;
  const paths: React.ReactNode[] = [];
  for (let i = 0; i < line.strokes.length; i++) {
    const s = line.strokes[i];
    // points are evenly resampled by the generator, so length ≈ index × step
    let run = 0;
    for (let k = 1; k < s.pts.length; k++)
      run += Math.hypot(s.pts[k][0] - s.pts[k - 1][0], s.pts[k][1] - s.pts[k - 1][1]);
    if (seen >= written) break;
    const share = clamp01((written - seen) / (run || 1));
    seen += run;
    const upto = share >= 1 ? s.pts.length : Math.max(2, share * s.pts.length);
    const d = outline(s.pts, s.width, upto);
    if (d) paths.push(<path key={i} d={d} fill={ink} />);
  }
  return <>{paths}</>;
};

export const HandwrittenMath: React.FC<{
  scene: MathScene;
  /** Paper tone behind the ink. */
  paper?: string;
  ink?: string;
  /** Show the move that produced each line, beside it. */
  labels?: boolean;
  title?: string;
}> = ({ scene, paper = '#F7F4EC', ink = INK, labels = true, title }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: paper }}>
      {/* ruled paper, kept very faint so it reads as texture not as content */}
      <svg width={width} height={height} viewBox={`0 0 ${scene.w} ${scene.h}`} style={{ position: 'absolute' }}>
        {Array.from({ length: 11 }, (_, i) => (
          <line
            key={i}
            x1={scene.w * 0.06}
            x2={scene.w * 0.94}
            y1={(scene.h / 11) * (i + 1)}
            y2={(scene.h / 11) * (i + 1)}
            stroke="rgba(28,25,23,0.055)"
            strokeWidth={1.6}
          />
        ))}
        {scene.lines.map((l, i) => (
          <Line key={i} line={l} frame={frame} ink={ink} />
        ))}
      </svg>

      {title && (
        <div
          style={{
            position: 'absolute',
            top: 44,
            left: 60,
            fontFamily: DISPLAY,
            fontSize: 30,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: MUTED,
            opacity: clamp01(frame / 18),
          }}
        >
          {title}
        </div>
      )}

      {labels &&
        scene.lines.map((l, i) => {
          if (i === 0) return null; // the first line is the problem, not a move
          const appear = clamp01((frame - l.startF + 6) / 14);
          if (appear <= 0) return null;
          const y = (l.strokes[0]?.pts[0]?.[1] ?? 0) * (height / scene.h);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: width * 0.62,
                top: y - 18,
                maxWidth: width * 0.33,
                fontFamily: BODY,
                fontSize: 27,
                lineHeight: 1.35,
                color: FG2,
                opacity: appear,
                transform: `translateX(${(1 - appear) * 16}px)`,
              }}
            >
              <span style={{ color: SKY, fontFamily: DISPLAY, letterSpacing: '0.14em' }}>
                {String(i).padStart(2, '0')}
              </span>
              <br />
              {l.label}
            </div>
          );
        })}
    </AbsoluteFill>
  );
};
