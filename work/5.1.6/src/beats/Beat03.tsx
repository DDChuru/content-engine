/** Beat 3 · Division held in balance. Closer on the tissue (labels); a basal division (excerpt, captioned) with recall
 * tags; the chromosome inset (C1, two gene bands); one band ringed and tagged *controls cell division*, linked to a basal
 * nucleus; loss answered by division (pans rock and settle); `held` (no loss, no division); a side inset `growing`
 * (net growth); the adult tissue stays level. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Tissue, tGeom, Balance} from '../TissueGrowthModel';
import {SkinStrip} from '../ContextStrip';
import {Leader} from '../T5Annot';
import {fi, fe, pulse, between} from '../util';
import {TB, STARCOL, ExcerptCap, ChromInset, insetGene} from './tis';

export default function Beat03(s: any) {
  const a = s.a, L = s.local;
  const G = tGeom(TB as any);
  const held = a('held') >= 0 && a('grow') < 0;
  const tFreeze = a('held') >= 0 ? a('held') + (a('held') < 0 ? 0 : 0) : 0;
  const t = held ? (s.sc.cues.find((c: any) => c.key === 'held').localTime) * 0.16 : L * 0.16;
  const runs: [string, number][] = [['div', 3], ['repl', 7], ['open', 9]];
  let divAt = -1, divU = 0;
  for (const [k, col] of runs) { const ag = a(k) - (k === 'open' ? 0.5 : 0); if (ag >= 0 && ag < 2.2 && !held) { divAt = col; divU = ag / 2.2; } }
  const rock = a('repl') >= 0 && a('held') < 0 ? 0.25 * Math.sin(a('repl') * 4) * Math.max(0, 1 - a('repl') / 3) : 0;
  const IX = 1560, IY = 330;
  const gp = insetGene(IX, IY);
  const growOp = between(a('grow'), a('level'));
  return (
    <g>
      <Tissue {...TB} t={t} shed={held ? 0 : 1} vesselT={L} divAt={divAt} divU={divU} labels={1} />
      <Txt x={TB.x} y={G.bottom + 26} size={15} weight={600} fill={C.muted} italic>schematic tissue; not to scale</Txt>
      <g opacity={fi(a('open'), 0.5)}>
        <Tag x={TB.x + TB.w + 10} y={G.base + 6} text="dividing cells" size={18} />
        <Tag x={TB.x + TB.w + 10} y={G.bm + 26} text="basement layer" size={18} />
        <Tag x={TB.x + TB.w + 10} y={TB.y + 20} text="surface" size={18} />
      </g>
      {a('div') >= 0 && <Tag x={TB.x} y={TB.y - 30} text="recall: 5.1.2 — daughter cells genetically identical" size={17} opacity={fi(a('div'), 0.4)} />}
      {a('spec') >= 0 && <Tag x={TB.x + 480} y={TB.y - 30} text="recall: 5.1.5" size={17} opacity={fi(a('spec'), 0.4)} />}
      {a('chance') >= 0 && <g opacity={fi(a('chance'), 0.5) * (1 - 0.85 * growOp)}>
        <ChromInset x={IX} y={IY} r={120} ring={fi(a('genes'), 0.4)} />
        <Txt x={IX + 60} y={IY - 90} size={16} weight={700} fill={T5.ringHalo}>gene</Txt>
      </g>}
      {a('genes') >= 0 && <g opacity={fi(a('genes'), 0.4)}>
        <Tag x={IX - 150} y={IY + 164} text="controls cell division" size={18} />
        <Leader x1={IX - 110} y1={IY + 60} x2={G.colX(STARCOL)} y2={G.base} />
      </g>}
      <Balance x={1520} y={600} tilt={rock + (a('grow') >= 0 && a('level') < 0 ? 0 : 0)} op={1} hi={pulse(a('level'), 1.4)} />
      {held && <Tag x={TB.x + 400} y={TB.y - 30} text="held: no loss, no division" size={17} />}
      {growOp > 0 && <g opacity={growOp}>
        <rect data-role="decor" x={1250} y={250} width={560} height={260} rx={14} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <SkinStrip x={1270} y={330 - 60 * fe(a('grow'), 3)} w={520} h={140 + 60 * fe(a('grow'), 3)} cols={8} t={a('grow') * 0.2} shed={1} />
        <Txt x={1270} y={280} size={17} weight={800} fill={T5.ringHalo}>growing tissue: net growth (made &gt; lost)</Txt>
      </g>}
      <ExcerptCap op={divAt >= 0 ? 1 : 0} />
    </g>
  );
}
