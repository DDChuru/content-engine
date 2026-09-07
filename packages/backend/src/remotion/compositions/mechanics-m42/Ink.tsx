/** Stroke geometry and pen playback retained from MechanicsDrawingTravelGraphs. */
import React, {useMemo} from 'react';
const T={blueInk:'#213b78',amber:'#3f9e89',ink:'#273238'};
const clamp01=(n:number)=>Math.max(0,Math.min(1,n));
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
const progressAt=(f:number,a:number,b:number)=>clamp01((f-a)/Math.max(.001,b-a));
type Point = readonly [number, number];
interface Glyph { width: number; strokes: readonly (readonly Point[])[] }
const G: Record<string, Glyph> = {
  '0': { width: .72, strokes: [[[.16,.08],[.55,.03],[.68,.22],[.66,.78],[.52,.96],[.16,.91],[.04,.72],[.06,.25],[.16,.08]]] },
  '1': { width: .52, strokes: [[[.08,.25],[.28,.06],[.29,.94]], [[.08,.94],[.48,.94]]] },
  '2': { width: .7, strokes: [[[.05,.25],[.18,.06],[.53,.05],[.67,.23],[.61,.42],[.07,.91],[.67,.91]]] },
  '3': { width: .68, strokes: [[[.05,.13],[.27,.04],[.58,.1],[.66,.28],[.56,.46],[.29,.5],[.57,.54],[.67,.74],[.56,.91],[.25,.97],[.04,.86]]] },
  '4': { width: .72, strokes: [[[.53,.96],[.53,.04],[.04,.68],[.68,.68]]] },
  '5': { width: .68, strokes: [[[.63,.07],[.13,.07],[.08,.48],[.47,.43],[.65,.58],[.61,.84],[.43,.96],[.14,.92],[.03,.81]]] },
  '6': { width: .69, strokes: [[[.61,.15],[.46,.04],[.2,.1],[.06,.35],[.08,.78],[.24,.95],[.53,.91],[.66,.7],[.59,.49],[.34,.42],[.08,.54]]] },
  '7': { width: .68, strokes: [[[.04,.08],[.66,.08],[.25,.96]]] },
  '8': { width: .7, strokes: [[[.33,.49],[.12,.39],[.08,.18],[.23,.04],[.5,.07],[.64,.23],[.57,.43],[.33,.49],[.12,.57],[.06,.78],[.2,.94],[.49,.95],[.66,.78],[.59,.58],[.33,.49]]] },
  '9': { width: .69, strokes: [[[.61,.48],[.36,.57],[.12,.47],[.06,.24],[.2,.06],[.5,.08],[.64,.29],[.59,.76],[.43,.95],[.15,.92]]] },
  v: { width: .75, strokes: [[[.03,.28],[.27,.94],[.48,.55],[.69,.25]]] },
  t: { width: .55, strokes: [[[.29,.08],[.25,.83],[.37,.95],[.51,.87]], [[.05,.34],[.52,.3]]] },
  s: { width: .64, strokes: [[[.59,.27],[.45,.17],[.19,.2],[.08,.38],[.2,.5],[.48,.54],[.59,.69],[.51,.9],[.24,.96],[.05,.84]]] },
  m: { width: 1.02, strokes: [[[.05,.93],[.09,.3],[.3,.19],[.44,.34],[.44,.92]], [[.44,.35],[.66,.19],[.83,.3],[.91,.93]]] },
  h: { width: .72, strokes: [[[.08,.04],[.07,.94]], [[.08,.56],[.28,.27],[.54,.26],[.65,.43],[.63,.94]]] },
  '=': { width: .7, strokes: [[[.08,.4],[.63,.4]], [[.06,.68],[.61,.67]]] },
  '+': { width: .7, strokes: [[[.34,.2],[.34,.84]], [[.04,.52],[.65,.52]]] },
  '-': { width: .65, strokes: [[[.06,.55],[.59,.53]]] },
  '−': { width: .65, strokes: [[[.06,.55],[.59,.53]]] },
  '×': { width: .7, strokes: [[[.08,.22],[.62,.82]], [[.61,.2],[.09,.84]]] },
  '/': { width: .58, strokes: [[[.05,.94],[.53,.05]]] },
  '.': { width: .3, strokes: [[[.13,.85],[.15,.88]]] },
  '(': { width: .42, strokes: [[[.34,.04],[.16,.23],[.09,.51],[.17,.79],[.34,.96]]] },
  ')': { width: .42, strokes: [[[.08,.04],[.27,.24],[.34,.51],[.26,.79],[.08,.96]]] },
  '½': { width: 1.05, strokes: [[[.03,.21],[.17,.07],[.18,.46]], [[.03,.47],[.34,.47]], [[.2,.96],[.84,.04]], [[.58,.65],[.69,.53],[.9,.55],[.95,.67],[.61,.94],[.97,.94]]] },
  '⁻': { width: .42, strokes: [[[.04,.22],[.37,.2]]] },
  '¹': { width: .38, strokes: [[[.04,.17],[.18,.04],[.19,.43]], [[.04,.43],[.34,.43]]] },
  '₁': { width: .38, strokes: [[[.04,.67],[.18,.53],[.19,.94]], [[.04,.94],[.34,.94]]] },
  '₂': { width: .45, strokes: [[[.03,.66],[.13,.53],[.34,.54],[.41,.65],[.35,.76],[.04,.94],[.42,.94]]] },
  '₃': { width: .45, strokes: [[[.03,.57],[.18,.52],[.37,.57],[.28,.72],[.4,.78],[.35,.92],[.15,.96],[.03,.9]]] },
  "a": {width: .75, strokes: [[[0.6, 0.3], [0.3, 0.2], [0.1, 0.4], [0.1, 0.8], [0.3, 0.95], [0.6, 0.75], [0.6, 0.25], [0.6, 0.95]]]},
  "b": {width: .75, strokes: [[[0.1, 0], [0.1, 0.95], [0.5, 0.95], [0.65, 0.7], [0.6, 0.4], [0.3, 0.3], [0.1, 0.5]]]},
  "c": {width: .75, strokes: [[[0.6, 0.3], [0.35, 0.2], [0.1, 0.4], [0.1, 0.8], [0.35, 0.95], [0.6, 0.85]]]},
  "d": {width: .75, strokes: [[[0.6, 0], [0.6, 0.95], [0.6, 0.3], [0.3, 0.2], [0.1, 0.4], [0.1, 0.8], [0.3, 0.95], [0.6, 0.75]]]},
  "e": {width: .75, strokes: [[[0.1, 0.55], [0.6, 0.55], [0.55, 0.3], [0.3, 0.2], [0.1, 0.4], [0.1, 0.8], [0.3, 0.95], [0.6, 0.85]]]},
  "f": {width: .75, strokes: [[[0.2, 0.95], [0.2, 0.2], [0.4, 0.05], [0.6, 0.1]], [[0.05, 0.4], [0.5, 0.4]]]},
  "g": {width: .75, strokes: [[[0.6, 0.3], [0.3, 0.2], [0.1, 0.4], [0.1, 0.75], [0.3, 0.85], [0.6, 0.65], [0.6, 0.25], [0.6, 1.15], [0.3, 1.25], [0.1, 1.1]]]},
  "i": {width: .75, strokes: [[[0.3, 0.3], [0.3, 0.95]], [[0.3, 0.1], [0.3, 0.12]]]},
  "l": {width: .75, strokes: [[[0.2, 0], [0.2, 0.9], [0.4, 0.95]]]},
  "n": {width: .75, strokes: [[[0.1, 0.95], [0.1, 0.25], [0.1, 0.5], [0.35, 0.25], [0.6, 0.4], [0.6, 0.95]]]},
  "o": {width: .75, strokes: [[[0.3, 0.2], [0.1, 0.35], [0.1, 0.8], [0.3, 0.95], [0.6, 0.8], [0.6, 0.35], [0.3, 0.2]]]},
  "p": {width: .75, strokes: [[[0.1, 1.2], [0.1, 0.25], [0.1, 0.45], [0.35, 0.25], [0.6, 0.35], [0.6, 0.7], [0.35, 0.85], [0.1, 0.7]]]},
  "r": {width: .75, strokes: [[[0.1, 0.95], [0.1, 0.25], [0.1, 0.5], [0.35, 0.25], [0.6, 0.3]]]},
  "u": {width: .75, strokes: [[[0.1, 0.25], [0.1, 0.8], [0.3, 0.95], [0.6, 0.75], [0.6, 0.25], [0.6, 0.95]]]},
  "w": {width: .75, strokes: [[[0.05, 0.25], [0.2, 0.95], [0.4, 0.5], [0.6, 0.95], [0.8, 0.25]]]},
  "y": {width: .75, strokes: [[[0.1, 0.25], [0.3, 0.8], [0.6, 0.25], [0.2, 1.2]]]},
  "\u0394": {width: .75, strokes: [[[0.35, 0], [0.03, 0.95], [0.7, 0.95], [0.35, 0]]]},
  ">": {width: .75, strokes: [[[0.1, 0.2], [0.6, 0.55], [0.1, 0.9]]]},
  ":": {width: .75, strokes: [[[0.3, 0.3], [0.3, 0.32]], [[0.3, 0.8], [0.3, 0.82]]]},
  ' ': { width: .36, strokes: [] },
};


Object.assign(G, {
  '²': {width:.45,strokes:[[[.03,.16],[.14,.04],[.34,.06],[.4,.17],[.04,.43],[.42,.43]]]},
  '³': {width:.45,strokes:[[[.03,.07],[.2,.03],[.38,.1],[.24,.23],[.39,.31],[.31,.43],[.09,.43],[.02,.37]]]},
  '₀': {width:.45,strokes:[[[.1,.56],[.33,.55],[.4,.65],[.39,.86],[.29,.96],[.09,.92],[.03,.72],[.1,.56]]]},
  '∫': {width:.65,strokes:[[[.6,.03],[.44,0],[.32,.14],[.26,.91],[.1,1.1],[0,1.04]]]},
  'C': {width:.8,strokes:[[[.7,.12],[.46,.02],[.15,.12],[.04,.5],[.17,.86],[.46,.96],[.74,.85]]]},
  'D': {width:.8,strokes:[[[.05,.96],[.05,.03],[.43,.05],[.7,.26],[.72,.7],[.45,.94],[.05,.96]]]},
  '[': {width:.4,strokes:[[[.35,.03],[.1,.03],[.1,.98],[.35,.98]]]},
  ']': {width:.4,strokes:[[[.05,.03],[.3,.03],[.3,.98],[.05,.98]]]},
  '|': {width:.25,strokes:[[[.1,.02],[.1,.98]]]},
  '≠': {width:.7,strokes:[[[.08,.4],[.63,.4]],[[.06,.68],[.61,.67]],[[.53,.15],[.17,.91]]]},
});

interface PreparedStroke { d: string; length: number; points: Point[]; start: number; end: number }
interface PreparedLine { strokes: PreparedStroke[]; width: number }
export function prepareLine(text: string, size: number): PreparedLine {
  const raw: Array<{ d: string; length: number; points: Point[] }> = [];
  let cursor = 0;
  for (const character of text) {
    const glyph = G[character];
    if (!glyph) throw new Error(`Missing handwritten glyph: ${character}`);
    for (const source of glyph.strokes) {
      const points = source.map(([x, y]) => [cursor + x * size, y * size] as Point);
      let length = 0;
      for (let i = 1; i < points.length; i += 1) length += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
      const d = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
      raw.push({ d, length: Math.max(2, length), points });
    }
    cursor += (glyph.width + .16) * size;
  }
  const gap = size * .12;
  const total = raw.reduce((sum, stroke) => sum + stroke.length + gap, 0);
  let used = 0;
  const strokes = raw.map((stroke) => {
    const start = used / total;
    const end = (used + stroke.length) / total;
    used += stroke.length + gap;
    return { ...stroke, start, end };
  });
  return { strokes, width: cursor };
}

function pointOnStroke(points: Point[], progress: number): Point {
  const lengths = points.slice(1).map((point, index) => Math.hypot(point[0] - points[index][0], point[1] - points[index][1]));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let target = total * clamp01(progress);
  for (let index = 0; index < lengths.length; index += 1) {
    if (target <= lengths[index]) {
      const p = target / Math.max(1, lengths[index]);
      return [mix(points[index][0], points[index + 1][0], p), mix(points[index][1], points[index + 1][1], p)];
    }
    target -= lengths[index];
  }
  return points[points.length - 1] ?? [0, 0];
}

export const HandwrittenLine: React.FC<{
  text: string;
  frame: number;
  start: number;
  end: number;
  x: number;
  y: number;
  size?: number;
  color?: string;
  panel?: string;
}> = ({ text, frame, start, end, x, y, size = 29, color = T.blueInk, panel = "working" }) => {
  if (end <= start) throw new Error(`Invalid handwriting window: ${text}`);
  const prepared = useMemo(() => prepareLine(text, size), [text, size]);
  // Measure the entire final stroke geometry, including stroke width, even mid-write.
  const points = prepared.strokes.flatMap(stroke => stroke.points);
  const extent = {left: Math.min(...points.map(p => p[0])) - 1.55, top: Math.min(...points.map(p => p[1])) - 1.55,
    right: Math.max(...points.map(p => p[0])) + 1.55, bottom: Math.max(...points.map(p => p[1])) + 1.55};
  const lineProgress = progressAt(frame, start, end);
  let tip: Point | null = null;
  return (
    <g data-ink-text={text} data-ink-panel-id={panel} data-ink-active={frame>start ? "true" : "false"} data-ink-end={end} data-ink-stroke-ends={JSON.stringify(prepared.strokes.map(stroke => start + stroke.end * (end-start)))} data-ink-complete={frame>=end ? "true" : "false"} transform={`translate(${x} ${y})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect data-ink-extent="true" x={extent.left} y={extent.top} width={extent.right-extent.left} height={extent.bottom-extent.top} fill="none" stroke="none"/>
      {prepared.strokes.map((stroke, index) => {
        const strokeProgress = clamp01((lineProgress - stroke.start) / Math.max(.0001, stroke.end - stroke.start));
        if (strokeProgress > 0 && strokeProgress < 1) tip = pointOnStroke(stroke.points, strokeProgress);
        return <path key={index} d={stroke.d} stroke={color} strokeWidth={3.1} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strokeProgress} />;
      })}
      {tip && lineProgress < 1 && <g transform={`translate(${tip[0]} ${tip[1]}) rotate(-38)`}><rect x={-5} y={-34} width={10} height={35} rx={4} fill={T.amber} stroke={T.ink} strokeWidth={2} /><path d="M -5 0 L 0 10 L 5 0 Z" fill={T.ink} /></g>}
    </g>
  );
};

