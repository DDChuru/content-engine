/** The fold, and the active site. Zoom to rest-lk; backbone traced; tertiary links (2.3.3 legend); the
 * cleft brightens and is ringed, labelled active site; R-group stubs on the cleft wall; ring pulses. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, InkRing} from '../../shared/src/Type';
import {Enzyme, ModelTag, Label, pt} from '../Model';
import {fi, fe, pulse, lerp} from '../util';

export default function Beat06(s: any) {
  const {a} = s;
  const z = fe(a('zoom'), 1.0);
  const X = lerp(700, 860, z), Y = lerp(600, 580, z), S = lerp(0.9, 1.45, z);
  const [cx, cy] = pt(X, Y, S, 70, -108);
  const here = pulse(a('here'), 0.8);
  return (
    <g>
      <Enzyme x={X} y={Y} s={S} backbone={a('backbone') >= 0 ? fe(a('backbone'), 1.4) : 0} links={fi(a('links'))} cleftGlow={a('region') >= 0 ? Math.max(0.5, pulse(a('region'), 0.8)) : 0}
        stubs={fi(a('stubs'))} pulse={pulse(a('stubs') - 0.3, 0.8)} />
      <ModelTag x={X} y={Y + 300} opacity={fi(a('zoom'))} />
      <Label lx={1310} ly={330} text="one folded polypeptide" size={26} opacity={fi(a('backbone') - 0.4)} />
      <Txt x={1310} y={360} size={18} weight={600} fill={C.muted} italic opacity={fi(a('backbone') - 0.4)}>backbone traced (2.3.1 N–Cα–C repeat; schematic, not to scale)</Txt>
      <Label lx={1310} ly={430} text="tertiary structure" size={26} opacity={fi(a('tertiary'))} />
      <g opacity={fi(a('links'))}>
        <Tag x={1310} y={480} text="recall 2.3.3 bond legend" size={19} fill={C.teal} />
        <path d="M1316 520H1376" stroke={C.teal} strokeWidth={4} strokeDasharray="9 7" />
        <Txt x={1390} y={527} size={20} weight={700}>hydrogen bond</Txt>
        <path d="M1316 556H1376" stroke={C.gold} strokeWidth={4} strokeDasharray="2 7" strokeLinecap="round" />
        <Txt x={1390} y={563} size={20} weight={700}>ionic bond</Txt>
        <Txt x={1316} y={596} size={17} weight={600} fill={C.muted} italic>interactions between R groups hold the fold</Txt>
      </g>
      {a('region') >= 0 && <InkRing cx={cx} cy={cy} rx={115 * S / 1.45} ry={85 * S / 1.45} p={fe(a('region'), 0.6)} width={4 + 4 * here} />}
      <Label lx={1310} ly={700} tx={cx + 70} ty={cy - 20} text="active site" size={34} opacity={fi(a('label'))} />
      <Txt x={1310} y={736} size={19} weight={600} fill={C.muted} italic opacity={fi(a('cleft'))}>a small region: a cleft or pocket</Txt>
      <g opacity={fi(a('stubs'))}>
        <Txt x={1310} y={800} size={22} weight={800} fill={C.primary}>R groups line the cleft wall;</Txt>
        <Txt x={1310} y={830} size={22} weight={800} fill={C.primary}>its shape is set by the whole fold</Txt>
      </g>
      <Txt x={1310} y={890} size={26} weight={800} fill={C.ink} opacity={fi(a('here'))}>catalysis happens here</Txt>
    </g>
  );
}
