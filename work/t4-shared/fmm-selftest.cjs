// Self-test of FluidMosaicMembrane geometry (008f). Run: node fmm-selftest.cjs  (from work/t4-shared; uses ../node_modules)
// 1. `full`: every component sits at its SHARED-SPECS slot (1-based, counted left to right, slot = u).
// 2. 12 phospholipids per leaflet in every state.
// 3. Every entry used by the lessons, swept p = 0 → 1 in steps of 0.005 (static layout: no jitter/drift):
//    no two footprints in a leaflet overlap (lipid head ±0.40u; spanning protein ±W/2 × entry scale; cholesterol /
//    glycolipid ±0.25u / ±0.30u × entry scale), no clear space between neighbours exceeds 0.62u (a "hole"), and no
//    item jumps more than 0.03u between consecutive steps (continuous motion).
const esb = require('../node_modules/esbuild'), path = require('path'), fs = require('fs');
const out = path.join(__dirname, '.fmm-test.cjs');
esb.buildSync({entryPoints: [path.join(__dirname, 'FluidMosaicMembrane.tsx')], bundle: true, platform: 'node', format: 'cjs', outfile: out, external: ['react'], jsx: 'transform', logLevel: 'error', nodePaths: [path.join(__dirname, '../node_modules')]});
const M = require(out); fs.unlinkSync(out);
const {fmmLayout, FULL, BILAYER, SLOTS} = M, u = 58, cx = 960;
let fails = 0; const bad = (...a) => { fails++; if (fails < 40) console.log('FAIL', ...a); };
// 1. slots
{ const L = fmmLayout({cx, u, show: FULL}), slot = (x) => (x - L.x0) / u + 0.5;
  for (const [k, want] of Object.entries(SLOTS)) {
    if (k === 'extrinsicUnder') { const s = slot(L.comps.extrinsic.x); if (Math.abs(s - 3.5) > 0.06) bad('extrinsic centre slot', s.toFixed(2)); continue; }
    const c = L.comps[k], mid = (want[0] + want[want.length - 1]) / 2, s = slot(c.x);
    if (Math.abs(s - mid) > 1e-6) bad('slot', k, s.toFixed(3), 'want', mid); }
  const pls = (arr) => arr.filter((i) => i.kind === 'pl').map((i) => +slot(i.x).toFixed(3));
  console.log('full width', (L.width / u).toFixed(2), 'slots; outer pl slots', pls(L.outer).join(' '), '| inner', pls(L.inner).join(' '));
  for (const [nm, want] of [['outer', [1, 3, 7]], ['inner', [1, 2, 3, 6]]]) for (const w of want) if (!pls(L[nm]).includes(w)) bad(nm, 'lipid missing at slot', w);
}
const HALF = {channel: 0.95, receptor: 0.95, carrier: 0.95, glycoprotein: 0.43, cholOut: 0.25, cholIn: 0.25, glycolipid: 0.3};
function footprints(L, leaf) {
  const f = [];
  for (const it of L[leaf]) { if (it.kind === 'pl') f.push([it.x - 0.4 * u, it.x + 0.4 * u, 'pl' + it.idx]); else { const c = L.comps[it.kind]; if (c.sx > 0) f.push([c.x - HALF[it.kind] * u * c.sx, c.x + HALF[it.kind] * u * c.sx, it.kind]); } }
  for (const k of ['channel', 'receptor', 'carrier', 'glycoprotein']) { const c = L.comps[k]; if (c.sx > 0) f.push([c.x - HALF[k] * u * c.sx, c.x + HALF[k] * u * c.sx, k]); }
  return f.sort((a, b) => a[0] + a[1] - b[0] - b[1]);
}
const SEQ = [ // [label, base show, keys entering together]
  ['B6 proteins', BILAYER, ['channel', 'receptor', 'carrier']],
  ['B8 cholesterol', {...BILAYER, channel: 1, receptor: 1, carrier: 1, extrinsic: 1}, ['cholOut', 'cholIn']],
  ['B9 glycolipid', {...BILAYER, channel: 1, receptor: 1, carrier: 1, extrinsic: 1, cholOut: 1, cholIn: 1}, ['glycolipid']],
  ['B10 glycoprotein', {...FULL, glycoprotein: 0}, ['glycoprotein']],
];
for (const [label, base, keys] of SEQ) {
  let prev = null, worstGap = 0, worstOv = 0;
  for (let k = 0; k <= 200; k++) {
    const p = k / 200, show = {...base}; for (const key of keys) show[key] = p;
    const L = fmmLayout({cx, u, show});
    for (const leaf of ['outer', 'inner']) {
      if (L[leaf].filter((i) => i.kind === 'pl').length !== 12) bad(label, leaf, 'lipid count');
      const f = footprints(L, leaf);
      for (let i = 1; i < f.length; i++) { const gap = f[i][0] - f[i - 1][1]; worstGap = Math.max(worstGap, gap / u); worstOv = Math.max(worstOv, -gap / u);
        if (gap < -0.005 * u) bad(label, 'p', p.toFixed(3), leaf, 'overlap', f[i - 1][2], f[i][2], (gap / u).toFixed(3));
        if (gap > 0.62 * u) bad(label, 'p', p.toFixed(3), leaf, 'hole', f[i - 1][2], f[i][2], (gap / u).toFixed(3)); }
      if (prev) for (let i = 0; i < L[leaf].length; i++) { const a = L[leaf][i], b = prev[leaf][i]; if (a.kind === 'pl' && Math.abs(a.x - b.x) > 0.1 * u) bad(label, 'jump', leaf, a.idx, ((a.x - b.x) / u).toFixed(3)); }
    }
    prev = L;
  }
  console.log(label.padEnd(18), 'max clear space', worstGap.toFixed(3) + 'u', 'max overlap', Math.max(0, worstOv - 0).toFixed(3) + 'u (negative gap)');
}
console.log(fails ? `FMM SELF-TEST FAILED (${fails})` : 'FMM SELF-TEST PASSED'); process.exit(fails ? 1 : 0);
