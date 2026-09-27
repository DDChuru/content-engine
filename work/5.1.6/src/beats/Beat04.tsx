/** Beat 4 · A change in a control gene. The inset gene bracketed (a length of DNA); "mutation"; UV from a sun pictogram
 * travels into the skin; two basal nuclei flash; a grey change outside the division-control genes (then cleared); the
 * control gene highlighted; the black star on that band and on the linked basal nucleus; the link brightens; repeated
 * division begins. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Tissue, tGeom, Balance, Pile, UV} from '../TissueGrowthModel';
import {Leader, Glow} from '../T5Annot';
import {fi, fe, pulse, between} from '../util';
import {TB, STARCOL, ExcerptCap, ChromInset} from './tis';

export default function Beat04(s: any) {
  const a = s.a, L = s.local;
  const G = tGeom(TB as any);
  const IX = 1560, IY = 330, cx = G.colX(STARCOL);
  const uv = a('uv') >= 0 ? fe(a('uv'), 2.2) : 0;
  const star = fi(a('star'), 0.3);
  const n = a('rep') >= 0 ? 1 + Math.min(1, a('rep') / 2.4) : 0;
  return (
    <g>
      <Tissue {...TB} t={L * 0.16} shed={1} vesselT={L} labels={1} basalStar={a('rep') >= 0 ? 0 : star} starCol={STARCOL} />
      <Txt x={TB.x} y={G.bottom + 26} size={15} weight={600} fill={C.muted} italic>schematic tissue; not to scale</Txt>
      {n > 0 && <Pile cx={cx} bm={G.bm} n={n} r={22} />}
      <ChromInset x={IX} y={IY} r={120} ring={a('ctrl') >= 0 ? 1 : 0.8} bracket={fi(a('dna'), 0.4)} dot={between(a('many'), a('ctrl'))} star={star} />
      <Txt x={IX + 60} y={IY - 90} size={16} weight={700} fill={T5.ringHalo}>gene</Txt>
      {a('dna') >= 0 && <Tag x={IX - 120} y={IY - 150} text="gene: a length of DNA" size={17} opacity={fi(a('dna'), 0.4)} />}
      {a('mut') >= 0 && <g opacity={fi(a('mut'), 0.4)}>
        <Txt x={IX - 170} y={IY + 176} size={26} weight={800} fill={T5.ringHalo}>mutation</Txt>
        <Txt x={IX - 170} y={IY + 200} size={15} weight={600} fill={C.muted} italic>mutation types and their effects: 6.2.6, 6.2.7</Txt>
      </g>}
      <Leader x1={IX - 110} y1={IY + 60} x2={cx} y2={G.base} opacity={a('loss') >= 0 ? 1 : 0.6} color={a('loss') >= 0 ? T5.ring : T5.ringHalo} />
      {a('uv') >= 0 && <g opacity={fi(a('uv'), 0.4) * (1 - fi(a('many') - 1, 0.6))}>
        <g data-role="drawing"><circle cx={170} cy={230} r={34} fill="#F2C45A" stroke="#C98A1B" strokeWidth={3} />
          {Array.from({length: 8}, (_, i) => { const an = i * Math.PI / 4; return <line key={i} x1={170 + 42 * Math.cos(an)} y1={230 + 42 * Math.sin(an)} x2={170 + 56 * Math.cos(an)} y2={230 + 56 * Math.sin(an)} stroke="#C98A1B" strokeWidth={3} />; })}</g>
        <Txt x={120} y={292} size={16} weight={700} fill={T5.ringHalo}>sunlight</Txt>
        {[3, 5, 8].map((col, i) => { const x1 = 230 + i * 30, y1 = 250, x2 = G.colX(col), y2 = G.base; const k = uv; return <g key={i} data-role="decor">
          <path d={`M${x1} ${y1}L${x1 + (x2 - x1) * k} ${y1 + (y2 - y1) * k}`} stroke={UV} strokeWidth={4} strokeDasharray="10 7" />
        </g>; })}
        <Txt x={300} y={300} size={20} weight={800} fill={UV}>UV</Txt>
      </g>}
      {a('hit') >= 0 && [3, 8].map((col, i) => <Glow key={i} cx={G.colX(col)} cy={G.base} r={32} a={pulse(a('hit') - 0.2 * i, 1.0)} />)}
      {a('many') >= 0 && <Tag x={IX - 240} y={IY + 240} text="a change outside a division-control gene (schematic)" size={16} opacity={between(a('many'), a('ctrl'))} />}
      {a('star') >= 0 && <Tag x={TB.x + 220} y={TB.y - 30} text="a mutation that disrupts division control in this example" size={18} opacity={star} />}
      <Balance x={1520} y={620} tilt={a('rep') >= 0 ? 0.2 * fe(a('rep'), 2) : 0} hi={pulse(a('open'), 1.2)} />
      <ExcerptCap op={a('rep') >= 0 ? 1 : 0} />
    </g>
  );
}
