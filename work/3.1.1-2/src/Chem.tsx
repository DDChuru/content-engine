/** Beat 9 atom-resolved inset: the four-glucose α-1,4 segment (C24H42O21) + WaterModel, and the `Hydrolyse`
 * net transformation at the MIDDLE bridge (2.2.6 spec, L2 amylase edge list):
 *   delete Og–Cp, Ow–Ht; create Og–Ht, Cp–Ow; retain C1–Og, Ow–Hr and every spectator edge.
 * One atom/bond graph drives BOTH the drawing and the valence audit, so what is audited is what is drawn.
 * The complete bond graph switches in ONE rendered frame (the `switch` cue frame); no cross-fade, no free
 * species. Whole molecules move smoothly only before and after, with their bonds fixed. */
import React from 'react';
import {BRAND as C, clamp01, easeInOut} from '../shared/src/theme';
import {Txt} from '../shared/src/Type';

type Atom = {id: string; el: 'C' | 'O' | 'H'; x: number; y: number; label?: string; hide?: boolean; mol?: 'L' | 'R' | 'W'};
type Bond = [string, string];

export const RING_DX = 290;
const RING: Record<string, [number, number]> = {O5: [48, -36], C1: [92, 0], C2: [48, 36], C3: [-48, 36], C4: [-92, 0], C5: [-48, -36]};

/** Build the segment. Residues A,B,C,D left→right (A: non-reducing end, D: reducing end, α-OH at C1).
 * Bridges Ai-C1–O–C4-(i+1). The middle bridge (B–C) oxygen is Og; B's C1 is "C1"; C's C4 is Cp. */
function segment(ox: number, oy: number) {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  const R = ['A', 'B', 'C', 'D'];
  R.forEach((r, i) => {
    const cx = ox + i * RING_DX, cy = oy, mol = i < 2 ? 'L' : 'R';
    const A = (id: string, el: any, x: number, y: number, extra: any = {}) => atoms.push({id: r + id, el, x: cx + x, y: cy + y, mol, ...extra});
    for (const [k, [x, y]] of Object.entries(RING)) A(k, k[0] as any, x, y);
    bonds.push([r + 'C1', r + 'C2'], [r + 'C2', r + 'C3'], [r + 'C3', r + 'C4'], [r + 'C4', r + 'C5'], [r + 'C5', r + 'O5'], [r + 'O5', r + 'C1']);
    // H on C1 (up), C2 (up), C3 (down), C4 (up), C5 (down)
    A('H1', 'H', 92, -40); A('H2', 'H', 48, 6); A('H3', 'H', -48, 76); A('H4', 'H', -92, -40); A('H5', 'H', -48, -8);
    bonds.push([r + 'C1', r + 'H1'], [r + 'C2', r + 'H2'], [r + 'C3', r + 'H3'], [r + 'C4', r + 'H4'], [r + 'C5', r + 'H5']);
    // OH on C2 (down), C3 (up)
    A('O2', 'O', 48, 78, {label: 'OH'}); A('HO2', 'H', 48, 78, {hide: true});
    A('O3', 'O', -64, 14, {label: 'HO'}); A('HO3', 'H', -64, 14, {hide: true});
    bonds.push([r + 'C2', r + 'O2'], [r + 'O2', r + 'HO2'], [r + 'C3', r + 'O3'], [r + 'O3', r + 'HO3']);
    // C6 group up from C5: CH2OH (condensed label; every atom is in the graph)
    A('C6', 'C', -48, -80, {label: 'CH₂OH'}); A('H6a', 'H', -48, -80, {hide: true}); A('H6b', 'H', -48, -80, {hide: true});
    A('O6', 'O', -48, -80, {hide: true}); A('HO6', 'H', -48, -80, {hide: true});
    bonds.push([r + 'C5', r + 'C6'], [r + 'C6', r + 'H6a'], [r + 'C6', r + 'H6b'], [r + 'C6', r + 'O6'], [r + 'O6', r + 'HO6']);
    if (i === 0) { A('O4', 'O', -92, 44, {label: 'HO'}); A('HO4', 'H', -92, 44, {hide: true}); bonds.push([r + 'C4', r + 'O4'], [r + 'O4', r + 'HO4']); }
    if (i === 3) { A('O1', 'O', 92, 44, {label: 'OH'}); A('HO1', 'H', 92, 44, {hide: true}); bonds.push([r + 'C1', r + 'O1'], [r + 'O1', r + 'HO1']); }
  });
  // bridges: A–B, B–C (middle: Og), C–D
  for (let i = 0; i < 3; i++) {
    const id = i === 1 ? 'Og' : 'Ob' + i;
    atoms.push({id, el: 'O', x: ox + i * RING_DX + RING_DX / 2, y: oy + 46, mol: i < 1 ? 'L' : i > 1 ? 'R' : 'L'});
    bonds.push([R[i] + 'C1', id], [id, R[i + 1] + 'C4']);
  }
  return {atoms, bonds};
}

/** The scene graph at a given phase.
 * w: water visible (0..1 approach progress, <0 = absent); post: after the switch frame; relax 0..1 after it. */
export function hydrolyseGraph(ox: number, oy: number, w: number, post: boolean, relax: number, sep: number) {
  const {atoms, bonds} = segment(ox, oy);
  const og = atoms.find((a) => a.id === 'Og')!;
  const xb = og.x, yb = og.y;
  const hasWater = w >= 0;
  if (hasWater) {
    const u = easeInOut(clamp01(w)), fy = 110 * (1 - u);
    atoms.push({id: 'Ht', el: 'H', x: xb - 2, y: yb + 40 + fy, mol: 'W'}, {id: 'Ow', el: 'O', x: xb + 30, y: yb + 64 + fy, mol: 'W'}, {id: 'Hr', el: 'H', x: xb + 64, y: yb + 70 + fy, mol: 'W'});
  }
  let B = bonds.slice();
  if (post) {
    B = B.filter(([a, b]) => !((a === 'Og' && b === 'CC4') || (a === 'CC4' && b === 'Og')));
    B.push(['Og', 'Ht'], ['CC4', 'Ow'], ['Ow', 'Hr']);
    for (const a of atoms) if (a.id === 'Ht' || a.id === 'Og') a.mol = 'L';
    for (const a of atoms) if (a.id === 'Ow' || a.id === 'Hr') a.mol = 'R';
    // relax (bonds fixed): product hydroxyls straighten; right product moves right by sep
    const r = easeInOut(clamp01(relax));
    const c1 = atoms.find((a) => a.id === 'BC1')!, cp = atoms.find((a) => a.id === 'CC4')!;
    const set = (id: string, x: number, y: number) => { const a = atoms.find((q) => q.id === id)!; a.x = a.x + (x - a.x) * r; a.y = a.y + (y - a.y) * r; };
    set('Og', c1.x, c1.y + 46); set('Ht', c1.x + 30, c1.y + 70);
    set('Ow', cp.x, cp.y + 46); set('Hr', cp.x - 30, cp.y + 70);
    for (const a of atoms) if (a.mol === 'R') a.x += sep * r;
  } else if (hasWater) B.push(['Ow', 'Ht'], ['Ow', 'Hr']);
  return {atoms, bonds: B};
}

const VAL = {C: 4, O: 2, H: 1};
/** Valence audit of one graph: every atom's bond count equals its valence; per-molecule formulae. */
export function auditGraph(g: {atoms: Atom[]; bonds: Bond[]}) {
  const n: Record<string, number> = {};
  for (const a of g.atoms) n[a.id] = 0;
  for (const [a, b] of g.bonds) { n[a]++; n[b]++; }
  const bad = g.atoms.filter((a) => n[a.id] !== VAL[a.el]).map((a) => `${a.id}:${n[a.id]}`);
  // connected components → formulae
  const adj: Record<string, string[]> = {};
  for (const a of g.atoms) adj[a.id] = [];
  for (const [a, b] of g.bonds) { adj[a].push(b); adj[b].push(a); }
  const seen = new Set<string>(), mols: string[] = [];
  for (const a of g.atoms) {
    if (seen.has(a.id)) continue;
    const st = [a.id], cnt: any = {C: 0, H: 0, O: 0};
    seen.add(a.id);
    while (st.length) { const id = st.pop()!; cnt[g.atoms.find((q) => q.id === id)!.el]++; for (const b of adj[id]) if (!seen.has(b)) { seen.add(b); st.push(b); } }
    mols.push(`C${cnt.C}H${cnt.H}O${cnt.O}`);
  }
  return {ok: bad.length === 0, bad, molecules: mols.sort()};
}

/** Phase of the inset from the beat state (cue ages). Exported for the renderer's per-frame audit. */
export const INSET = {ox: 750, oy: 500};
export function hydroPhase(s: any) {
  const {a} = s;
  const shown = a('inset') >= 0 && a('unchanged') < 0.6;
  const w = a('water') >= 0 ? a('water') / 1.3 : -1;
  const post = a('switch') >= 0;
  const relax = post ? a('switch') / 0.9 : 0;
  return {shown, w, post, relax, sep: 60};
}
export function hydrolyseAudit(s: any) {
  const p = hydroPhase(s);
  if (!p.shown) return null;
  const g = hydrolyseGraph(INSET.ox, INSET.oy, p.w, p.post, p.relax, p.sep);
  const r = auditGraph(g);
  const want = p.post ? ['C12H22O11', 'C12H22O11'] : p.w >= 0 ? ['C0H2O1', 'C24H42O21'] : ['C24H42O21'];
  const ok = r.ok && JSON.stringify(r.molecules) === JSON.stringify(want.sort());
  return {ok, state: p.post ? 'post' : p.w >= 0 ? 'pre+water' : 'pre', molecules: r.molecules, bad: r.bad};
}

/** Draw the graph. hi: set of edge keys 'a|b' to highlight. */
export function HydrolyseInset({s, opacity = 1, hi = [] as string[], hiColor = C.primary, brackets = 0, ringLabels = {} as Record<string, string>}: any) {
  const p = hydroPhase(s);
  const g = hydrolyseGraph(INSET.ox, INSET.oy, p.w, p.post, p.relax, p.sep);
  const byId: Record<string, Atom> = {};
  for (const a of g.atoms) byId[a.id] = a;
  const key = (a: string, b: string) => [a, b].sort().join('|');
  const hiSet = new Set(hi.map((h: string) => h.split('|').sort().join('|')));
  // draw anchors: labelled groups sit at the end of their bond line; ring C drawn as small letters
  const label = (a: Atom) => ringLabels[a.id] ?? a.label ?? (a.hide ? '' : a.el);
  const EXPLICIT = new Set(['Og', 'Ht', 'Ow', 'Hr']);
  const offset = (a: Atom, b: Atom) => { // shorten lines so they do not run into letters
    const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
    const ra = label(a) ? (label(a).length > 2 ? 16 : 11) : 0, rb = label(b) ? (label(b).length > 2 ? 16 : 11) : 0;
    return [a.x + dx / L * ra, a.y + dy / L * ra, b.x - dx / L * rb, b.y - dy / L * rb];
  };
  const lines = g.bonds.filter(([a, b]) => {
    const A = byId[a], B = byId[b];
    return !(A.x === B.x && A.y === B.y); // condensed-group bonds (same anchor) are carried by the label
  });
  return (
    <g opacity={opacity < 1 ? opacity : undefined} data-hydrolyse={p.post ? 'post' : 'pre'}>
      {lines.map(([a, b]) => {
        const [x1, y1, x2, y2] = offset(byId[a], byId[b]);
        const k = key(a, b), h = hiSet.has(k);
        const front = (a.endsWith('C2') && b.endsWith('C3')) || (a.endsWith('C3') && b.endsWith('C2'));
        return <g key={k}>
          {h && <path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={hiColor} strokeWidth={12} strokeLinecap="round" opacity={0.45} />}
          <path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={C.ink} strokeWidth={front ? 6 : 2.6} strokeLinecap="round" />
        </g>;
      })}
      {g.atoms.filter((a) => label(a)).map((a) => {
        const t = label(a), named = a.id in ringLabels, ring = /C[1-5]$/.test(a.id) && !named, ex = EXPLICIT.has(a.id);
        const size = named ? 22 : ring ? 16 : ex ? 24 : 19;
        return <g key={a.id}>
          {!ring && <rect x={a.x - (t.length * size * 0.33)} y={a.y - size * 0.62} width={t.length * size * 0.66} height={size * 1.2} rx={4} fill={C.white} />}
          <Txt x={a.x} y={a.y + size * 0.36} size={size} weight={ex ? 800 : ring ? 600 : 700} fill={named ? C.primary : ring ? C.muted : a.mol === 'W' || ex ? C.teal : C.ink} anchor="middle">{t}</Txt>
        </g>;
      })}
      {brackets > 0 && (() => {
        const L = g.atoms.filter((q) => q.mol === 'L'), R = g.atoms.filter((q) => q.mol === 'R');
        const box = (arr: Atom[]) => [Math.min(...arr.map((q) => q.x)) - 30, Math.max(...arr.map((q) => q.x)) + 30];
        const [l0, l1] = box(L), [r0, r1] = box(R), yy = INSET.oy + 124;
        return <g opacity={clamp01(brackets)}>
          {[[l0, l1], [r0, r1]].map(([x0, x1], i) => <g key={i}>
            <path d={`M${x0} ${yy - 12}V${yy}H${x1}V${yy - 12}`} fill="none" stroke={C.primary} strokeWidth={4} />
            <Txt x={(x0 + x1) / 2} y={yy + 34} size={26} weight={800} fill={C.primary} anchor="middle">maltose</Txt>
          </g>)}
        </g>;
      })()}
    </g>
  );
}
