// Text-only audit, PURELY ROLE-BASED (review r3, 27 Sep). The frame's SVG is parsed into a TREE (not regex): every element's
// role is the nearest data-role on itself or an ancestor. Kept for counting: elements whose role is "drawing" (molecules,
// structures, apparatus, pictograms, orbital panels, the isomer family diagram) — regardless of fill, colour or orientation.
// Dropped: every <text>/<tspan> and any element or group (paired, self-closing, nested) whose role is "decor" (cards, pills,
// highlights, rings, brackets, connectors, underlines, strips, page chrome, the error frame). A SHAPE with no role anywhere in
// its ancestry is UNTAGGED: never counted, and a hard error (the audit and --controls exit 1 listing it), so tagging stays complete.
// Every 0.5 s: raster the kept tree at 480×270 and count pixels differing from the background INSIDE THE TEACHING AREA
// (x 70–1850, y 205–940). < 40 = TEXT-ONLY. Reports runs; exits 1 on any run > 2 s or any untagged shape.
// Modes: (default) audit the lesson · --selftest F… frame counts · --controls synthetic role cases + untagged scan of the lesson.
// Module use: require('./verify-text-only.cjs') → {strip, parse, classify} (the reviewer's harness imports strip from here).
const P = __dirname;   // CLOUD: react/react-dom/sharp resolve from this work dir's node_modules
process.env.FONTCONFIG_FILE = P + '/fonts/fonts.conf'; process.env.XDG_CACHE_HOME = P + '/render-cache';
const SHAPES = new Set(['rect', 'path', 'circle', 'ellipse', 'line', 'polygon', 'polyline', 'image', 'use']);
const TEXT = new Set(['text', 'tspan', 'textPath']);

/** Minimal XML parser for renderToStaticMarkup SVG: returns {tag, attrs, raw, children, text} nodes. */
function parse(svg) {
  const root = {tag: '#root', attrs: {}, children: []}, stack = [root];
  const re = /<!--[\s\S]*?-->|<\/([\w:-]+)\s*>|<([\w:-]+)((?:\s+[\w:-]+(?:="[^"]*")?)*)\s*(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(svg))) {
    if (m[0].startsWith('<!--')) continue;
    if (m[1]) { const top = stack.pop(); if (!top || top.tag !== m[1]) throw Error('SVG parse: mismatched </' + m[1] + '>'); continue; }
    if (m[2]) {
      const attrs = {}; for (const a of (m[3] || '').matchAll(/([\w:-]+)(?:="([^"]*)")?/g)) attrs[a[1]] = a[2] ?? '';
      const node = {tag: m[2], attrs, attrText: m[3] || '', children: []};
      stack[stack.length - 1].children.push(node);
      if (!m[4]) stack.push(node);
      continue;
    }
    if (m[5] != null) stack[stack.length - 1].children.push({tag: '#text', text: m[5]});
  }
  if (stack.length !== 1) throw Error('SVG parse: unclosed <' + stack[stack.length - 1].tag + '>');
  return root;
}
/** Walk with inherited role; returns the serialised kept tree and the list of untagged shapes. */
function classify(svg) {
  const untagged = [];
  const ser = (n, role, inDefs) => {
    if (n.tag === '#text') return '';                                         // text content never counts
    if (n.tag === '#root') return n.children.map((c) => ser(c, role, inDefs)).join('');
    if (TEXT.has(n.tag)) return '';
    const r = n.attrs['data-role'] ?? role;
    if (r === 'decor') return '';
    const defs = inDefs || n.tag === 'defs';
    if (SHAPES.has(n.tag) && !defs) {
      if (r !== 'drawing') { untagged.push('<' + n.tag + n.attrText.slice(0, 120) + '>'); return ''; }
    }
    return '<' + n.tag + n.attrText + '>' + n.children.map((c) => ser(c, r, defs)).join('') + '</' + n.tag + '>';
  };
  return {svg: ser(parse(svg), undefined, false), untagged};
}
const strip = (svg) => classify(svg).svg;
module.exports = {strip, parse, classify};

async function teachingPixels(svgKept, bg) {
  const sharp = require('sharp');
  const {data} = await sharp(Buffer.from(svgKept)).resize(480, 270).flatten({background: {r: bg[0], g: bg[1], b: bg[2]}}).raw().toBuffer({resolveWithObject: true});
  let n = 0; for (let y = 52; y < 235; y++) for (let x = 18; x < 462; x++) { const i = (y * 480 + x) * 3; if (Math.abs(data[i] - bg[0]) + Math.abs(data[i + 1] - bg[1]) + Math.abs(data[i + 2] - bg[2]) > 40) n++; }
  return n;
}
if (require.main === module) (async () => {
  const React = require('react'), {renderToStaticMarkup} = require('react-dom/server'), fs = require('fs'), normalise = require('./raster-svg.cjs');
  const lesson = () => require(P + '/' + (process.env.BUNDLE || 'render-cache/Lesson.cjs')), T = require('./timeline.json');
  const frameSvg = (f) => { const {Lesson} = lesson(); return normalise(renderToStaticMarkup(React.createElement(Lesson, {frame: f}))); };
  const bgOf = (f) => (lesson().stateAt(f).sc.id === 3 ? [0x25, 0x32, 0x47] : [0xF6, 0xF3, 0xEB]);
  const count = async (f) => { const c = classify(frameSvg(f)); return {n: await teachingPixels(c.svg, bgOf(f)), untagged: c.untagged}; };
  const arg = process.argv[2];
  if (arg === '--selftest') { for (const f of process.argv.slice(3).map(Number)) { const {n, untagged} = await count(f); console.log('frame', f, (f / 30).toFixed(2) + 's', 'graphic px', n, n < 40 ? 'TEXT-ONLY' : 'graphic', untagged.length ? 'UNTAGGED ' + untagged.length : ''); } return; }
  if (arg === '--controls') {
    const e = React.createElement, W = (el) => renderToStaticMarkup(e('svg', {xmlns: 'http://www.w3.org/2000/svg', width: 1920, height: 1080}, e('rect', {'data-role': 'decor', width: 1920, height: 1080, fill: '#F6F3EB'}), el));
    const BG = [0xF6, 0xF3, 0xEB];
    const C = [
      ['heading text + underline (decor)', e('g', null, e('text', {x: 120, y: 260, fontSize: 40}, 'By the end you can'), e('path', {'data-role': 'decor', d: 'M120 272H520', stroke: '#B64A30', strokeWidth: 4})), false],
      ['text card (decor)', e('g', {'data-role': 'decor'}, e('rect', {x: 300, y: 300, width: 800, height: 200, fill: '#FFFFFF'}), e('text', {x: 320, y: 400}, 'words')), false],
      ['paired circle marked decor', e('circle', {'data-role': 'decor', cx: 700, cy: 500, r: 30, fill: '#B64A30'}), false],
      ['nested group marked decor', e('g', {'data-role': 'decor'}, e('g', null, e('circle', {cx: 700, cy: 500, r: 30, fill: '#B64A30'}))), false],
      ['card in a different colour (decor)', e('g', {'data-role': 'decor'}, e('rect', {x: 300, y: 300, width: 800, height: 200, fill: '#2E3D55'}), e('text', {x: 320, y: 400}, 'words')), false],
      ['decor inside a drawing is dropped', e('g', {'data-role': 'drawing'}, e('rect', {'data-role': 'decor', x: 300, y: 300, width: 800, height: 200, fill: '#2E3D55'})), false],
      ['horizontal bond marked drawing', e('path', {'data-role': 'drawing', d: 'M300 400L700 400', stroke: '#253247', strokeWidth: 8}), true],
      ['white apparatus rect marked drawing', e('rect', {'data-role': 'drawing', x: 300, y: 300, width: 120, height: 80, fill: '#FFFFFF', stroke: '#253247', strokeWidth: 4}), true],
      ['outlined pictogram (fill none) in a drawing group', e('g', {'data-role': 'drawing'}, e('rect', {x: 300, y: 300, width: 120, height: 80, fill: 'none', stroke: '#253247', strokeWidth: 4})), true],
      ['self-closing drawing element', null, true],
    ];
    let ok = true;
    for (const [name, el, want] of C) {
      const svg = el ? W(el) : '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect data-role="decor" width="1920" height="1080" fill="#F6F3EB"/><circle data-role="drawing" cx="700" cy="500" r="30" fill="#404040"/></svg>';
      const c = classify(svg), n = await teachingPixels(c.svg, BG), got = n >= 40;
      if (c.untagged.length) { ok = false; console.log('FAIL untagged in control', name, c.untagged); }
      ok = ok && got === want; console.log(got === want ? 'PASS' : 'FAIL', name, 'graphic px', n, '→', got ? 'graphic' : 'TEXT-ONLY');
    }
    const u = classify(W(e('rect', {x: 300, y: 300, width: 100, height: 100, fill: '#404040'}))).untagged;
    console.log(u.length === 1 ? 'PASS' : 'FAIL', 'untagged shape is reported as an error:', u[0] || 'none'); ok = ok && u.length === 1;
    // tagging completeness on the lesson itself: every 0.5 s frame, no untagged shape anywhere
    const bad = new Map();
    for (let f = 0; f < T.durationFrames; f += 15) for (const x of classify(frameSvg(f)).untagged) if (!bad.has(x)) bad.set(x, f);
    console.log(bad.size ? 'FAIL' : 'PASS', 'lesson tagging complete:', bad.size, 'distinct untagged shapes', [...bad].slice(0, 40).map(([x, f]) => `frame ${f}: ${x}`).join('\n  '));
    process.exit(ok && !bad.size ? 0 : 1);
  }
  const runs = []; let cur = null; const untaggedAll = new Map();
  for (let f = 0; f < T.durationFrames; f += 15) {
    const {n, untagged} = await count(f); for (const x of untagged) if (!untaggedAll.has(x)) untaggedAll.set(x, f);
    if (n < 40) { if (!cur) cur = {from: f / 30, beat: lesson().stateAt(f).sc.id}; cur.to = f / 30; } else if (cur) { runs.push(cur); cur = null; }
  }
  if (cur) runs.push(cur);
  const all = runs.map((r) => ({...r, seconds: +(r.to - r.from + 0.5).toFixed(1)})), long = all.filter((r) => r.seconds > 2);
  const max = Math.max(0, ...all.map((r) => r.seconds));
  fs.writeFileSync(process.env.OUT || P + '/qa/text-only-audit.json', JSON.stringify({classifier: 'role-based tree (data-role drawing/decor; untagged = error)', sampledEvery: 0.5, threshold: '<40 drawing px in the teaching area at 480x270', longestSeconds: max, runs: all, over2s: long, untagged: [...untaggedAll].map(([x, f]) => ({frame: f, el: x}))}, null, 1));
  console.log('text-only runs:', JSON.stringify(all)); console.log('longest', max, 's; over 2 s:', JSON.stringify(long), '; untagged shapes:', untaggedAll.size);
  process.exit(long.length || untaggedAll.size ? 1 : 0);
})();
