// Label-size audit (run 009f, review 27 Sep): NO text under 17 px in the DELIVERED 1920x1080 picture, anywhere.
// Every 0.5 s (and at every cue frame) the frame's SVG is parsed as a tree; every visible <text>/<tspan> with glyphs gets
// its effective size = font-size (inherited) × the accumulated transform scale of its ancestors × the branding scale
// (the lesson is composited into a 1690-px-wide slot: 1690/1920 = 0.8802). Visible = accumulated opacity ≥ 0.3.
// Also: no two visible <text> boxes (brand-font metrics, full transforms) may overlap by > 3 px — crowded/colliding labels.
// Exits 1 on any visible text below MIN (17) or any overlap. Writes qa/label-size-audit.json. Usage: node verify-label-size.cjs [beat…]
const P = __dirname;
process.env.FONTCONFIG_FILE = P + '/fonts/fonts.conf'; process.env.XDG_CACHE_HOME = P + '/render-cache';
const MIN = 17, BRAND = 1690 / 1920;
const {parse} = require('./verify-text-only.cjs');
const scaleOf = (tr) => {
  let k = 1;
  for (const m of (tr || '').matchAll(/(matrix|scale|translate|rotate|skewX|skewY)\s*\(([^)]*)\)/g)) {
    const a = m[2].split(/[\s,]+/).filter(Boolean).map(Number);
    if (m[1] === 'scale') k *= Math.sqrt(Math.abs(a[0] * (a.length > 1 ? a[1] : a[0])));
    else if (m[1] === 'matrix') k *= Math.sqrt(Math.abs(a[0] * a[3] - a[1] * a[2]));
  }
  return k;
};
const num = (v, d) => { if (v == null || v === '') return d; const x = parseFloat(v); return Number.isFinite(x) ? x : d; };
const styleProp = (st, p) => { const m = (st || '').match(new RegExp('(?:^|;)\\s*' + p + '\\s*:\\s*([^;]+)')); return m ? m[1] : null; };
const M = require('./shared/src/metrics.json');
const mul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
const matOf = (tr) => {
  let m = [1, 0, 0, 1, 0, 0];
  for (const t of (tr || '').matchAll(/(matrix|scale|translate|rotate)\s*\(([^)]*)\)/g)) {
    const a = t[2].split(/[\s,]+/).filter(Boolean).map(Number);
    if (t[1] === 'translate') m = mul(m, [1, 0, 0, 1, a[0], a[1] || 0]);
    else if (t[1] === 'scale') m = mul(m, [a[0], 0, 0, a.length > 1 ? a[1] : a[0], 0, 0]);
    else if (t[1] === 'matrix') m = mul(m, a);
    else if (t[1] === 'rotate') { const r = a[0] * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); const cx = a[1] || 0, cy = a[2] || 0;
      m = mul(m, [1, 0, 0, 1, cx, cy]); m = mul(m, [c, s, -s, c, 0, 0]); m = mul(m, [1, 0, 0, 1, -cx, -cy]); }
  }
  return m;
};
const width = (t, fs, wt) => { const tab = M[wt >= 700 ? 700 : wt >= 600 ? 600 : 400]; let w = 0; for (const ch of t) w += tab[ch] ?? 0.6; return w * fs; };
const allText = (n) => (n.children || []).map((c) => c.tag === '#text' ? c.text : allText(c)).join('');
const decode = (t) => t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
function texts(svg) {
  const out = [], boxes = [];
  const walk = (n, m, fs, op, inDefs, wt, anchor) => {
    if (n.tag === '#text') return;
    const a = n.attrs || {};
    const defs = inDefs || n.tag === 'defs' || n.tag === 'clipPath' || n.tag === 'mask';
    if (a.display === 'none' || a.visibility === 'hidden') return;
    const m2 = a.transform ? mul(m, matOf(a.transform)) : m, k2 = Math.sqrt(Math.abs(m2[0] * m2[3] - m2[1] * m2[2]));
    const fs2 = num(a['font-size'] ?? styleProp(a.style, 'font-size'), fs);
    const wt2 = num(a['font-weight'], wt), an2 = a['text-anchor'] ?? anchor;
    const op2 = op * num(a.opacity, 1) * num(a['fill-opacity'], 1);
    if ((n.tag === 'text' || n.tag === 'tspan') && !defs) {
      const own = decode((n.children || []).filter((c) => c.tag === '#text').map((c) => c.text).join('')).trim();
      if (own && op2 >= 0.3) out.push({text: own.slice(0, 60), eff: +(fs2 * k2 * BRAND).toFixed(2), src: +(fs2 * k2).toFixed(2)});
      if (n.tag === 'text' && op2 >= 0.3) {
        const full = decode(allText(n)); const w = width(full, fs2, wt2), x = num(a.x, 0), y = num(a.y, 0);
        if (full.trim()) {
          const x0 = an2 === 'middle' ? x - w / 2 : an2 === 'end' ? x - w : x;
          const pts = [[x0, y - 0.72 * fs2], [x0 + w, y - 0.72 * fs2], [x0, y + 0.2 * fs2], [x0 + w, y + 0.2 * fs2]].map(([px, py]) => [m2[0] * px + m2[2] * py + m2[4], m2[1] * px + m2[3] * py + m2[5]]);
          boxes.push({text: full.trim().slice(0, 50), x0: Math.min(...pts.map((q) => q[0])), x1: Math.max(...pts.map((q) => q[0])), y0: Math.min(...pts.map((q) => q[1])), y1: Math.max(...pts.map((q) => q[1]))});
        }
      }
    }
    for (const c of n.children || []) walk(c, m2, fs2, op2, defs, wt2, an2);
  };
  walk(parse(svg), [1, 0, 0, 1, 0, 0], 16, 1, false, 400, 'start');
  texts.boxes = boxes;
  return out;
}
/** Pairs of visible text boxes that overlap (by more than 3 px each way). */
function overlaps(boxes) {
  const res = [];
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const A = boxes[i], B = boxes[j];
    const ox = Math.min(A.x1, B.x1) - Math.max(A.x0, B.x0), oy = Math.min(A.y1, B.y1) - Math.max(A.y0, B.y0);
    if (ox > 3 && oy > 3) res.push([A.text, B.text, Math.round(ox), Math.round(oy)]);
  }
  for (const A of boxes) if (A.x0 < 15 || A.x1 > 1905 || A.y0 < 0 || A.y1 > 1075) res.push([A.text, '(frame edge)', Math.round(A.x0), Math.round(A.x1)]);
  return res;
}
module.exports = {texts, overlaps, MIN, BRAND};
if (require.main === module) {
  const React = require('react'), {renderToStaticMarkup} = require('react-dom/server'), fs = require('fs'), normalise = require('./raster-svg.cjs');
  const {Lesson, stateAt} = require(P + '/' + (process.env.BUNDLE || 'render-cache/Lesson.cjs')), T = require('./timeline.json');
  const only = new Set(process.argv.slice(2).map(Number));
  const frames = new Set();
  for (let f = 0; f < T.durationFrames; f += 15) frames.add(f);
  for (const sc of T.scenes) for (const c of sc.cues || []) { const f = Math.round((c.t ?? c.time ?? c.start ?? 0) * 30); for (const d of [0, 30, 60]) if (f + d < T.durationFrames) frames.add(f + d); }
  const bad = new Map(), clash = new Map(); let n = 0, minSeen = 1e9;
  for (const f of [...frames].sort((a, b) => a - b)) {
    const beat = stateAt(f).sc.id; if (only.size && !only.has(beat)) continue;
    n++;
    const tt = texts(normalise(renderToStaticMarkup(React.createElement(Lesson, {frame: f}))));
    for (const [p1, p2, ox, oy] of overlaps(texts.boxes)) { const key = beat + '|' + p1 + '|' + p2; if (!clash.has(key)) clash.set(key, {beat, frame: f, t: +(f / 30).toFixed(2), a: p1, b: p2, ox, oy}); }
    for (const t of tt) {
      minSeen = Math.min(minSeen, t.eff);
      if (t.eff < MIN) { const key = beat + '|' + t.text + '|' + t.eff; if (!bad.has(key)) bad.set(key, {beat, frame: f, t: +(f / 30).toFixed(2), ...t}); }
    }
  }
  const list = [...bad.values()];
  const cl = [...clash.values()];
  const res = {rule: 'no visible text < 17 px in the delivered 1920x1080 frame; no two visible text boxes overlap', overlapFailures: cl.length, overlaps: cl.slice(0, 200), brandingScale: +BRAND.toFixed(4), minSourcePx: +(MIN / BRAND).toFixed(2), framesChecked: n, smallestEffectivePx: +minSeen.toFixed(2), failures: list.length, list: list.slice(0, 400)};
  if (!only.size) fs.writeFileSync(P + '/qa/label-size-audit.json', JSON.stringify(res, null, 1));
  console.log(`label size: ${n} frames, smallest effective ${minSeen.toFixed(2)} px, ${list.length} distinct failures`);
  for (const x of list.slice(0, 80)) console.log(`  B${x.beat} f${x.frame} ${x.eff}px (src ${x.src}) "${x.text}"`);
  console.log(`text overlaps: ${cl.length} distinct pairs`);
  for (const x of cl.slice(0, 80)) console.log(`  B${x.beat} f${x.frame} (${x.t}s) "${x.a}" × "${x.b}" (${x.ox}x${x.oy})`);
  process.exit(list.length || cl.length ? 1 : 0);
}
