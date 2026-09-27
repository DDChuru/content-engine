/** Beat 5 · From one cell to a mass. The inset replicates schematically (star on both sister chromatids); the starred cell
 * divides (excerpt, captioned) and both daughters carry the star; the inset returns to one unreplicated daughter
 * chromosome at a labelled post-division transition; later rounds double the starred pile while ordinary surface loss
 * continues; the tap handle; the sentence clause by clause (MEMORY HOOK: tap ↔ loss of control / repeated division,
 * the rising level ↔ the mass, highlighted together as spoken; a 2 s silent hold follows); "usually more than one". */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Tissue, tGeom, Balance, Pile, TapInset, AbCell, Star} from '../TissueGrowthModel';
import {Ring} from '../T5Annot';
import {fi, fe, pulse} from '../util';
import {TB, STARCOL, ExcerptCap, ChromInset} from './tis';
import {SentenceStrip, stripSpan, typed} from './kit';

export const SENT5 = 'a mutation in a gene that controls cell division can cause loss of control of the cell cycle, so the cell divides repeatedly by mitosis, producing a mass of abnormal cells: a tumour';
export default function Beat05(s: any) {
  const a = s.a, L = s.local;
  const TBs = {...TB, y: 300, h: 300};
  const G = tGeom(TBs as any);
  const cx = G.colX(STARCOL);
  const repP = a('copy') < 0 ? -1 : Math.min(1, a('copy') / 3.2);
  const postDiv = a('inherit') >= 1.6;
  const insetRep = postDiv ? -1 : repP;
  const n = a('inherit') < 0 ? 1 : a('rounds') < 0 ? 1 + Math.min(1, a('inherit') / 1.6) : 2 + 14 * Math.min(1, a('rounds') / 5.0);
  const IX = 1560, IY = 300;
  const tap = a('tap') >= 0;
  const c1 = a('c1') >= 0, c2 = a('c2') >= 0, c3 = a('c3') >= 0;
  const SX = 80, SY = 780, SW = 1150;
  const shown = a('wp') < 0 ? 0 : c3 && a('c3') > 2.5 ? SENT5.length : typed(SENT5, a('wp') - 0.2, 12.7).length;
  const hTap = c1 && !c2 ? 1 : 0, hFlow = c2 && !c3 ? 1 : 0, hLevel = c3 ? 1 : 0;
  const sp1 = stripSpan(SX, SY, SW, SENT5, 'loss of control of the cell cycle', 26), sp2 = stripSpan(SX, SY, SW, SENT5, 'divides repeatedly by mitosis', 26), sp3 = stripSpan(SX, SY, SW, SENT5, 'a mass of abnormal cells', 26);
  const lvl = tap ? 0.25 + 0.6 * Math.min(1, a('tap') / 16) : 0.25;
  const hl = (sp: any, on: number) => sp && on > 0 ? <rect data-role="decor" x={sp[0] - 4} y={sp[2] - 26} width={sp[1] - sp[0] + 8} height={34} rx={8} fill={T5.ring} opacity={0.35 * on} /> : null;
  return (
    <g>
      <Tissue {...TBs} t={L * 0.16} shed={1} vesselT={L} labels={1} />
      <Pile cx={cx} bm={G.bm} n={n} r={22} />
      {a('rounds') >= 0 && <Tag x={cx + 120} y={G.bm - 220} text="abnormal cells" size={19} opacity={fi(a('rounds'), 0.4)} />}
      {c3 && <Ring cx={cx} cy={G.bm - 80} rx={150} ry={100} p={fe(a('c3'), 0.6)} />}
      {c3 && <Tag x={cx - 190} y={G.bm - 200} text="tumour" size={22} opacity={fi(a('c3'), 0.4)} />}
      <ChromInset x={IX} y={IY} r={120} rep={insetRep} star={1} caption={postDiv ? 'after division: one daughter chromosome (schematic)' : 'schematic'} />
      {repP >= 0 && !postDiv && <Txt x={IX} y={IY + 164} size={14} weight={600} fill={C.muted} anchor="middle" italic>schematic account of replication during S; detailed replication in 6.1.4 · recall: 5.1.3</Txt>}
      {a('inherit') >= 0 && <Tag x={1280} y={470} text="recall: 5.1.2 — each daughter cell receives the same genetic information" size={15} opacity={fi(a('inherit'), 0.4)} />}
      <Balance x={1560} y={515} tilt={0.2 + 0.5 * fe(a('rounds'), 5)} s={0.85} />
      {tap && <g opacity={fi(a('tap'), 0.4)} transform={`translate(0 0)`}>
        <TapInset x={1310} y={770} level={lvl} t={L} />
        {hTap + hFlow > 0 && <rect data-role="decor" x={1340} y={680} width={90} height={80} rx={12} fill={T5.ring} opacity={0.35} />}
        {hLevel > 0 && <rect data-role="decor" x={1310} y={770} width={170} height={110} rx={8} fill={T5.ring} opacity={0.3} />}
        <Txt x={1500} y={710} size={15} weight={700} fill={T5.ringHalo}>tap stuck open: division</Txt>
        <Txt x={1500} y={734} size={15} weight={700} fill={T5.ringHalo}>drain the same: cells lost</Txt>
        <Txt x={1500} y={758} size={15} weight={700} fill={T5.ringHalo}>level rises: a mass</Txt>
      </g>}
      {a('wp') >= 0 && <SentenceStrip x={SX} y={SY} w={SW} text={SENT5} shown={shown} size={26} opacity={fi(a('wp'), 0.4)} />}
      {hl(sp1, hTap)}{hl(sp2, hFlow)}{hl(sp3, hLevel)}
      {a('more') >= 0 && <g opacity={fi(a('more'), 0.4)}>
        {[1, 2, 3].map((k, i) => <g key={i}><AbCell x={110 + i * 64} y={912} r={22} seed={i} star={0} />{Array.from({length: k}, (_, j) => <Star key={j} x={110 + i * 64 - (k - 1) * 7 + j * 14} y={912} r={6} />)}</g>)}
        <Txt x={300} y={918} size={16} weight={700} fill={T5.ringHalo}>usually more than one mutation; number schematic</Txt>
      </g>}
      <ExcerptCap op={a('inherit') >= 0 && a('rounds') < 5.5 ? 1 : 0} />
    </g>
  );
}
