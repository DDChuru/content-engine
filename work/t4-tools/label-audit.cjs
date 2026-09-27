// Per-frame LABEL AUDIT (review 008a → 008f; binding for every Topic 4 lesson; NO exemptions).
//   1. SIZE: every <text> node with any visible opacity must have an effective font size >= 17 px in the DELIVERED
//      1920x1080 frame: source font-size × every ancestor transform scale × the branding slot scale (950/1080).
//      Letters inside drawings (L/R, ATP, charges, captions) count exactly like labels.
//   2. OVERLAP (vector): no two visible text boxes intersect; no leader/connector/arrow line (decor path/line) crosses
//      a text box unless one end of that line is attached to the box (its own leader, underline or strike); the border
//      of a stroked box (card, pill, inset frame) may never run through a text box.
//   2b. FRAME: no visible text box leaves the content area (x 60–1860) or the frame, and no text is cut by a clip-path
//       (text wholly clipped away is not on screen and is not checked).
//   3. OVERLAP (raster): no text box that is not itself part of a drawing sits on VISIBLE drawn geometry: the frame is
//      re-rasterised in document order with data-role="drawing" shapes in black (particle fields tagged data-field are
//      background, like the page) and large opaque cards/insets in white (they hide what they cover); the dark pixels
//      inside each text box are counted.
// Throws nothing itself: returns {violations, minEff, texts}; render-beat.cjs fails the beat on any violation.
const M = require('./shared/src/metrics.json');
const BRAND_SCALE = 950 / 1080;           // apply-branding-cloud.sh: 1920x1080 → 1690x950 slot (the smaller axis)
const MIN_PX = 17;
const OP_MIN = 0.25;                      // a text or line counts in the OVERLAP checks from this opacity on
const tw = (t, size, weight) => { const tab = M[weight >= 700 ? 700 : weight >= 600 ? 600 : 400]; let w = 0; for (const ch of t) w += tab[ch] ?? 0.6; return w * size; };
const mul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
const ap = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
function parseTransform(s) {
  let m = [1, 0, 0, 1, 0, 0];
  for (const [, fn, args] of s.matchAll(/(\w+)\s*\(([^)]*)\)/g)) {
    const a = args.split(/[\s,]+/).filter(Boolean).map(Number);
    let t;
    if (fn === 'translate') t = [1, 0, 0, 1, a[0], a[1] || 0];
    else if (fn === 'scale') t = [a[0], 0, 0, a[1] ?? a[0], 0, 0];
    else if (fn === 'rotate') { const r = (a[0] * Math.PI) / 180, c = Math.cos(r), sn = Math.sin(r), cx = a[1] || 0, cy = a[2] || 0; t = mul(mul([1, 0, 0, 1, cx, cy], [c, sn, -sn, c, 0, 0]), [1, 0, 0, 1, -cx, -cy]); }
    else if (fn === 'matrix') t = a;
    else if (fn === 'skewX') t = [1, 0, Math.tan((a[0] * Math.PI) / 180), 1, 0, 0];
    else if (fn === 'skewY') t = [1, Math.tan((a[0] * Math.PI) / 180), 0, 1, 0, 0];
    else throw Error('label-audit: transform ' + fn);
    m = mul(m, t);
  }
  return m;
}
const attrs = (s) => { const o = {}; for (const [, k, v] of s.matchAll(/([\w:-]+)="([^"]*)"/g)) o[k] = v; return o; };
const SHAPES = new Set(['rect', 'circle', 'ellipse', 'path', 'line', 'polygon', 'polyline']);
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'");
/** Flatten an SVG path (absolute M L H V C Q Z; relative forms too) to polylines in local coords. */
function flatten(d) {
  const toks = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []; let i = 0, cmd = '', p = [0, 0], st = [0, 0]; const polys = []; let cur = null;
  const n = () => Number(toks[i++]);
  while (i < toks.length) {
    if (/[A-Za-z]/.test(toks[i])) cmd = toks[i++];
    const rel = cmd === cmd.toLowerCase() && cmd !== 'z', C = cmd.toUpperCase(), o = rel ? p : [0, 0];
    if (C === 'M') { p = [n() + o[0], n() + o[1]]; st = p; cur = [p]; polys.push(cur); cmd = rel ? 'l' : 'L'; }
    else if (C === 'L') { p = [n() + o[0], n() + o[1]]; cur.push(p); }
    else if (C === 'H') { p = [n() + (rel ? p[0] : 0), p[1]]; cur.push(p); }
    else if (C === 'V') { p = [p[0], n() + (rel ? p[1] : 0)]; cur.push(p); }
    else if (C === 'C') { const q = [n() + o[0], n() + o[1], n() + o[0], n() + o[1], n() + o[0], n() + o[1]]; for (let k = 1; k <= 12; k++) { const t = k / 12, u = 1 - t; cur.push([u * u * u * p[0] + 3 * u * u * t * q[0] + 3 * u * t * t * q[2] + t * t * t * q[4], u * u * u * p[1] + 3 * u * u * t * q[1] + 3 * u * t * t * q[3] + t * t * t * q[5]]); } p = [q[4], q[5]]; }
    else if (C === 'Q') { const q = [n() + o[0], n() + o[1], n() + o[0], n() + o[1]]; for (let k = 1; k <= 12; k++) { const t = k / 12, u = 1 - t; cur.push([u * u * p[0] + 2 * u * t * q[0] + t * t * q[2], u * u * p[1] + 2 * u * t * q[1] + t * t * q[3]]); } p = [q[2], q[3]]; }
    else if (C === 'A') { n(); n(); n(); n(); n(); p = [n() + o[0], n() + o[1]]; cur.push(p); }
    else if (C === 'Z') { cur.push(st); p = st; }
    else throw Error('label-audit: path command ' + cmd);
  }
  return polys;
}
const segHitsBox = (a, b, B) => { // Liang–Barsky
  let t0 = 0, t1 = 1; const dx = b[0] - a[0], dy = b[1] - a[1];
  for (const [p, q] of [[-dx, a[0] - B[0]], [dx, B[2] - a[0]], [-dy, a[1] - B[1]], [dy, B[3] - a[1]]]) {
    if (p === 0) { if (q < 0) return false; } else { const r = q / p; if (p < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; } }
  }
  return true;
};
const inBox = (p, B) => p[0] >= B[0] && p[0] <= B[2] && p[1] >= B[1] && p[1] <= B[3];
const grow = (B, g) => [B[0] - g, B[1] - g, B[2] + g, B[3] + g];
const meet = (A, B) => A[0] < B[2] && B[0] < A[2] && A[1] < B[3] && B[1] < A[3];

/** Parse one frame. Returns texts (with boxes), decor lines, and the geometry-only SVG. */
function parse(svg) {
  const re = /<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>|([^<]+)/g;
  const stack = [{m: [1, 0, 0, 1, 0, 0], op: 1, fs: 16, fw: 400, anchor: 'start', role: null, field: false, keep: true, defs: false, clip: null}];
  const texts = [], lines = [], clips = {}; let geom = ''; let txt = null; let m; let clipId = null;
  while ((m = re.exec(svg))) {
    if (m[5] != null) { if (txt) txt.s += dec(m[5]); else if (stack[stack.length - 1].defs) geom += m[5]; continue; }
    const [whole, close, tag, rest, self] = m;
    if (close) {
      const top = stack.pop();
      if (tag === 'clipPath') clipId = null;
      if (tag === 'text' && txt) { finishText(txt, texts); txt = null; }
      if (top.keep) geom += whole;
      continue;
    }
    const A = attrs(rest), P = stack[stack.length - 1];
    if (tag === 'clipPath') clipId = A.id;
    if (clipId && (tag === 'rect' || tag === 'circle') && !clips[clipId]) {
      clips[clipId] = tag === 'rect' ? [Number(A.x || 0), Number(A.y || 0), Number(A.x || 0) + Number(A.width), Number(A.y || 0) + Number(A.height)]
        : [Number(A.cx) - Number(A.r), Number(A.cy) - Number(A.r), Number(A.cx) + Number(A.r), Number(A.cy) + Number(A.r)];
    }
    const e = {m: A.transform ? mul(P.m, parseTransform(A.transform)) : P.m, op: P.op * (A.opacity != null ? Number(A.opacity) : 1) * (A['fill-opacity'] != null && tag === 'text' ? Number(A['fill-opacity']) : 1),
      fs: A['font-size'] != null ? Number(A['font-size']) : P.fs, fw: A['font-weight'] != null ? Number(A['font-weight']) || 400 : P.fw, anchor: A['text-anchor'] || P.anchor,
      role: A['data-role'] || P.role, field: P.field || A['data-field'] != null, inText: P.inText || tag === 'text' || tag === 'tspan', defs: P.defs || tag === 'defs'};
    if (A.visibility === 'hidden' || A.display === 'none') e.op = 0;
    // clip-path (rect / circle bounding box, in this element's user space): visible text is cut to it
    e.clip = P.clip;
    const cp = A['clip-path'] && A['clip-path'].match(/url\(#([^)]+)\)/);
    if (cp && clips[cp[1]]) {
      const b = clips[cp[1]], c = [[b[0], b[1]], [b[2], b[1]], [b[0], b[3]], [b[2], b[3]]].map((q) => ap(e.m, q[0], q[1]));
      const cb = [Math.min(...c.map((q) => q[0])), Math.min(...c.map((q) => q[1])), Math.max(...c.map((q) => q[0])), Math.max(...c.map((q) => q[1]))];
      e.clip = P.clip ? [Math.max(P.clip[0], cb[0]), Math.max(P.clip[1], cb[1]), Math.min(P.clip[2], cb[2]), Math.min(P.clip[3], cb[3])] : cb;
    }
    // geometry raster (document order): drawing-role shapes outside particle fields paint BLACK; large opaque decor
    // boxes (cards, insets, panels: ≥ 20,000 px² on screen) paint WHITE and so hide what they cover; everything else
    // is left out. Visible geometry under a text box = dark pixels.
    const isGeom = SHAPES.has(tag) && e.role === 'drawing' && !e.field && !e.inText && !e.defs;
    let isOcc = false;
    if (tag === 'rect' && e.role !== 'drawing' && !e.defs && A.fill && A.fill !== 'none' && !/url\(/.test(A.fill)) {
      const sc2 = Math.abs(e.m[0] * e.m[3] - e.m[1] * e.m[2]);
      isOcc = Number(A.width) * Number(A.height) * sc2 >= 20000 && e.op * (A['fill-opacity'] != null ? Number(A['fill-opacity']) : 1) >= 0.9;
    }
    e.keep = e.defs || tag === 'svg' || tag === 'g' || isGeom || isOcc;
    if (e.keep) {
      let w = whole;
      if (isGeom) w = w.replace(/\bfill="(?!none")[^"]*"/, 'fill="#000000"').replace(/\bstroke="(?!none")[^"]*"/, 'stroke="#000000"');
      if (isOcc) w = w.replace(/\bfill="[^"]*"/, 'fill="#FFFFFF"').replace(/\bstroke="[^"]*"/, 'stroke="none"');
      geom += w;
    }
    if (tag === 'text') txt = {x: Number(A.x || 0), y: Number(A.y || 0), m: e.m, op: e.op, fs: e.fs, fw: e.fw, anchor: e.anchor, drawing: e.role === 'drawing', s: '', tspanFs: [], clip: e.clip};
    if (tag === 'tspan' && txt && A['font-size']) txt.tspanFs.push(Number(A['font-size']));
    if (SHAPES.has(tag) && e.role !== 'drawing' && !e.inText && !e.defs && e.op >= OP_MIN) {
      const sw = Number(A['stroke-width'] || 1), stroked = A.stroke && A.stroke !== 'none', filled = A.fill && A.fill !== 'none';
      let polys = null;
      if (tag === 'rect' && stroked && Number(A.width) > 0 && Number(A.height) > 0) {
        // a card / box / pill border: its four edges may not run through any text box (no attachment exemption)
        const x = Number(A.x || 0), y = Number(A.y || 0), w = Number(A.width), h = Number(A.height), r = Math.min(Number(A.rx || 0), w / 2, h / 2);
        for (const pl of [[[x + r, y], [x + w - r, y]], [[x + w, y + r], [x + w, y + h - r]], [[x + w - r, y + h], [x + r, y + h]], [[x, y + h - r], [x, y + r]]]) lines.push({pts: pl.map((q) => ap(e.m, q[0], q[1])), op: e.op, sw, border: true});
      }
      if (tag === 'line') polys = [[[Number(A.x1), Number(A.y1)], [Number(A.x2), Number(A.y2)]]];
      else if (tag === 'path' && stroked && !filled) polys = flatten(A.d);
      if (polys) for (const pl of polys) if (pl.length > 1) lines.push({pts: pl.map((q) => ap(e.m, q[0], q[1])), op: e.op, sw});
    }
    if (self) { if (tag === 'text' && txt) { finishText(txt, texts); txt = null; } }
    else stack.push(e);
  }
  return {texts, lines, geom};
}
function finishText(t, texts) {
  const s = t.s.replace(/\s+/g, ' ').trim(); if (!s) return;
  const sc = Math.sqrt(Math.abs(t.m[0] * t.m[3] - t.m[1] * t.m[2]));
  const fsMin = Math.min(t.fs, ...t.tspanFs);
  const w = tw(s, t.fs, t.fw), x0 = t.anchor === 'middle' ? t.x - w / 2 : t.anchor === 'end' ? t.x - w : t.x;
  const c = [[x0, t.y - 0.7 * t.fs], [x0 + w, t.y - 0.7 * t.fs], [x0, t.y + 0.16 * t.fs], [x0 + w, t.y + 0.16 * t.fs]].map((q) => ap(t.m, q[0], q[1]));
  const box = [Math.min(...c.map((q) => q[0])), Math.min(...c.map((q) => q[1])), Math.max(...c.map((q) => q[0])), Math.max(...c.map((q) => q[1]))];
  let cut = false, vis = box;
  if (t.clip) {
    vis = [Math.max(box[0], t.clip[0]), Math.max(box[1], t.clip[1]), Math.min(box[2], t.clip[2]), Math.min(box[3], t.clip[3])];
    if (vis[0] >= vis[2] || vis[1] >= vis[3]) return;            // wholly clipped away: not on screen
    cut = vis[0] > box[0] + 2 || vis[1] > box[1] + 2 || vis[2] < box[2] - 2 || vis[3] < box[3] - 2;
  }
  texts.push({s, op: t.op, eff: fsMin * sc * BRAND_SCALE, src: fsMin, scale: sc, box: vis, drawing: t.drawing, cut});
}

let sharp = null;
/** Audit one frame. opts.raster: also run the raster geometry check (async). */
async function audit(svg, opts = {}) {
  const {texts, lines, geom} = parse(svg);
  const V = [];
  let minEff = Infinity;
  for (const t of texts) if (t.op > 0) { minEff = Math.min(minEff, t.eff); if (t.eff < MIN_PX - 1e-9) V.push({type: 'size', text: t.s.slice(0, 60), eff: +t.eff.toFixed(2), src: t.src, scale: +t.scale.toFixed(3)}); }
  for (const t of texts) if (t.op >= OP_MIN && t.cut) V.push({type: 'clipped', text: t.s.slice(0, 50)});
  for (const t of texts) if (t.op >= OP_MIN && (t.box[0] < 60 || t.box[2] > 1860 || t.box[1] < 0 || t.box[3] > 1080)) V.push({type: 'off-frame', text: t.s.slice(0, 50), box: t.box.map((v) => Math.round(v))});
  const vis = texts.filter((t) => t.op >= OP_MIN);
  // dedupe halos (a stroked copy under the same text)
  const uniq = [];
  for (const t of vis) if (!uniq.some((u) => u.s === t.s && Math.abs(u.box[0] - t.box[0]) < 0.6 && Math.abs(u.box[1] - t.box[1]) < 0.6)) uniq.push(t);
  for (let i = 0; i < uniq.length; i++) for (let j = i + 1; j < uniq.length; j++) {
    if (meet(grow(uniq[i].box, -1.5), grow(uniq[j].box, -1.5))) V.push({type: 'text-text', a: uniq[i].s.slice(0, 50), b: uniq[j].s.slice(0, 50)});
  }
  for (const t of uniq) {
    const B = grow(t.box, -2), att = grow(t.box, 18);
    for (const L of lines) {
      const ends = [L.pts[0], L.pts[L.pts.length - 1]];
      if (!L.border && ends.some((p) => inBox(p, att))) continue;
      for (let k = 1; k < L.pts.length; k++) if (segHitsBox(L.pts[k - 1], L.pts[k], B)) { V.push({type: 'line-text', text: t.s.slice(0, 50), at: L.pts[k].map((v) => Math.round(v))}); break; }
    }
  }
  if (opts.raster) {
    sharp = sharp || require('sharp');
    const k = 0.5, W = 960, H = 540;
    const {data} = await sharp(Buffer.from(geom), {density: 72 * k}).resize(W, H).ensureAlpha().raw().toBuffer({resolveWithObject: true});
    for (const t of uniq) {
      if (t.drawing) continue;   // letters that are part of a drawing sit on their own drawing by design (size still checked)
      const x0 = Math.max(0, Math.floor((t.box[0] + 2) * k)), x1 = Math.min(W, Math.ceil((t.box[2] - 2) * k)), y0 = Math.max(0, Math.floor((t.box[1] + 2) * k)), y1 = Math.min(H, Math.ceil((t.box[3] - 2) * k));
      let hit = 0, area = Math.max(1, (x1 - x0) * (y1 - y0));
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const q = (y * W + x) * 4; if (data[q + 3] > 90 && data[q] < 110) hit++; }
      if (hit > Math.max(6, 0.02 * area)) V.push({type: 'text-geometry', text: t.s.slice(0, 50), px: hit, frac: +(hit / area).toFixed(3)});
    }
  }
  return {violations: V, minEff, nTexts: texts.length};
}
module.exports = {audit, parse, MIN_PX, BRAND_SCALE};
