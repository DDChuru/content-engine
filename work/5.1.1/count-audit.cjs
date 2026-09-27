// run 009f: count audit helper. For the given beats, find every frame where the on-screen count text (count strips,
// per-chromosome labels) changes, and print the value before and on that frame. Usage: node count-audit.cjs 5 8 9
const P = __dirname; process.env.FONTCONFIG_FILE = P + '/fonts/fonts.conf';
const React = require('react'), {renderToStaticMarkup} = require('react-dom/server'), normalise = require('./raster-svg.cjs');
const {Lesson, stateAt} = require(P + '/render-cache/Lesson.cjs'), T = require('./timeline.json');
const {parse} = require('./verify-text-only.cjs');
const RX = /^(\d+|replication in progress|\(.*chromatids\)|whole cell|one pole|one nucleus|each new nucleus|each daughter cell|one daughter cell|this chromosome: .*|tracked .*|\d+ centromeres? · .*|1 centromere · .*)$/;
function counts(f) {
  const out = []; const walk = (n) => { if (n.tag === 'text') { const t = (function g(m) { return (m.children || []).map((c) => c.tag === '#text' ? c.text : g(c)).join(''); })(n).trim(); if (RX.test(t)) out.push(t); return; } for (const c of n.children || []) if (c.tag !== '#text') walk(c); };
  walk(parse(normalise(renderToStaticMarkup(React.createElement(Lesson, {frame: f}))))); return out.join(' | ');
}
for (const b of process.argv.slice(2).map(Number)) {
  const sc = T.scenes.find((s) => s.id === b); let prev = counts(sc.startFrame);
  for (let f = sc.startFrame + 1; f < sc.startFrame + sc.frames; f++) { const c = counts(f); if (c !== prev) { console.log(`B${b} f${f} (${(f / 30).toFixed(3)}s)\n   before: ${prev}\n   event:  ${c}`); prev = c; } }
}
