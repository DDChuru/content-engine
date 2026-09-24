/** The reaction, and the enzyme goes again. Main model: amylase, bound → (one frame, the same frame as the
 * inset's bond-graph switch) products → products drift out → unchanged → a new substrate seats (reused).
 * Inset: the four-glucose segment + water; Hydrolyse exchange in ONE frame; caption "net reaction; not a
 * stepwise mechanism" on screen from the inset opening to the end of the product hold. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, Lines} from '../../shared/src/Type';
import {Enzyme, Substrate, Products, Ticks, ModelTag, Label, pt} from '../Model';
import {HydrolyseInset, hydroPhase, INSET} from '../Chem';
import {fi, fe, pulse, path, between} from '../util';

export default function Beat09(s: any) {
  const {a} = s;
  const X = 320, Y = 650, S = 0.78;
  const ph = hydroPhase(s);
  const post = a('switch') >= 0;
  const leave = a('leave') >= 0 ? fe(a('leave'), 1.6) : 0;
  const reuse = a('reuse') >= 0 ? path(a('reuse'), [[0, 60, -330], [0.9, 0, -30], [1.2, 0, 0]]) : null;
  const insetO = ph.shown ? Math.min(fi(a('inset'), 0.4), 1 - fi(a('unchanged') - 0.2, 0.4)) : 0;
  const hi: string[] = [];
  if (between(a('c1og'), a('oght')) > 0) hi.push('BC1|Og');
  if (between(a('oght'), a('cpow')) > 0) hi.push('Og|Ht');
  if (between(a('cpow'), a('maltose')) > 0) hi.push('CC4|Ow', 'Ow|Hr');
  const unch = fi(a('unchanged'), 0.4);
  return (
    <g>
      <Enzyme x={X} y={Y} s={S} pulse={pulse(a('unchanged'), 1.0)} trace={a('site') >= 0 ? fe(a('site'), 0.8) : 0} traceColor={C.primary}>
        {!post && <Substrate kind="gen" />}
        {!post && <Ticks p={1} />}
        {post && <Products lx={-150 * leave} ly={-190 * leave} rx={150 * leave} ry={-210 * leave} lrot={-30 * leave} rrot={30 * leave} opacity={1 - fi(a('leave') - 1.2, 0.5)} />}
        {reuse && <Substrate kind="gen" dx={reuse[0]} dy={reuse[1]} />}
        {reuse && a('reuse') >= 1.2 && <Ticks p={fi(a('reuse') - 1.2, 0.3)} />}
      </Enzyme>
      <ModelTag x={X} y={Y + 230} />
      <Label lx={X} ly={Y + 200} text={a('amylase') >= 0 ? 'amylase' : 'enzyme'} anchor="middle" size={28} />
      <Label lx={X + 40} ly={330} tx={X + 70 * S} ty={Y - 200 * S} text="starch (substrate)" size={24} opacity={between(a('starch'), a('switch'))} />
      <Label lx={X - 200} ly={330} text="products" size={26} opacity={fi(a('leave')) * (1 - fi(a('unchanged')))} />
      {unch > 0 && <g opacity={unch}>
        <path d={`M${X + 110} ${Y + 40}l22 24l44 -52`} stroke="#1D8A4E" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Tag x={X + 190} y={Y + 70} text="unchanged" size={26} fill="#1D6B40" />
      </g>}
      <Tag x={X + 190} y={Y + 120} text="same fold, same active site" size={20} fill={C.primary} opacity={fi(a('site'))} />
      <g opacity={fi(a('reuse') - 0.6)}>
        <Tag x={X - 200} y={Y - 250} text="reused" size={26} fill={C.white} bg="#1D8A4E" stroke="#1D8A4E" />
        <Txt x={X + 190} y={Y + 190} size={34} weight={800} fill={C.primary}>biological catalyst</Txt>
      </g>
      {/* the inset */}
      {insetO > 0 && <g opacity={insetO}>
        <rect x={610} y={250} width={1250} height={520} rx={16} fill={C.white} stroke={C.line} strokeWidth={2} />
        <Txt x={632} y={286} size={20} weight={800} fill={C.muted}>atom-resolved substrate (MODEL): four glucose units, α-1,4</Txt>
        <Tag x={1840} y={288} text="net reaction; not a stepwise mechanism" size={20} fill={C.white} bg={C.primary} stroke={C.primary} anchor="end" />
        <Txt x={632} y={800} size={16} weight={600} fill={C.muted} italic>the same edge exchange is the L2 amylase spec; catalase has its own edge list in L2.</Txt>
        <HydrolyseInset s={s} hi={hi} brackets={fi(a('maltose'))} ringLabels={{...(between(a('c1og'), a('maltose')) > 0 ? {BC1: 'C1'} : {}), ...(between(a('cpow'), a('maltose')) > 0 ? {CC4: 'C4'} : {})}} />
        <Txt x={INSET.ox + 1.5 * 290} y={752} size={17} weight={700} fill={C.teal} anchor="middle" opacity={between(a('water'), a('switch'))}>water: fully bonded as it approaches</Txt>
        <Tag x={INSET.ox + 290 * 1.5} y={750} text="both product hydroxyls complete" size={19} fill="#1D6B40" anchor="middle" opacity={between(a('cpow') + 0.8, a('maltose'))} />
        <Txt x={1840} y={752} size={19} weight={800} fill={C.ink} anchor="end" opacity={fi(a('maltose'))}>C₂₄H₄₂O₂₁ + H₂O → 2 C₁₂H₂₂O₁₁</Txt>
      </g>}
    </g>
  );
}
