/** Iodine test: no heat; sample spot on a white tile (seen from above); drops of iodine in KI;
 * reagent orange-brown; starch → blue-black (write both words); stays orange-brown = negative under
 * these conditions; water control beside a known-starch positive control; dedicated pipette, with a
 * framed WRONG METHOD inset of a shared pipette, ending on one pipette per reagent. */
import React from 'react';
import {BRAND as C, clamp01} from '../../../shared/src/theme';
import {Txt, Tag, Cite, InkRing} from '../../../shared/src/Type';
import {Fill, Swatch, NamePill, SwatchKey} from '../../../shared/src/Swatch';
import {WrongInset} from '../../../shared/src/ErrorMarker';
import {Bottle, Dropper, Tube, Rack} from '../Apparatus';
import {COIStack, QuoteTab} from '../Panels';
import {fi, fe, path, between, ramp} from '../util';

function Well({x, y, k, to, t = 0, fill = 0, label, sub, opacity = 1, subColor}: any) {
  const end = to && t >= 0.5 ? to : k;
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={58} fill="#F3F4F6" stroke="#B9C0CA" strokeWidth={3} />
      {k && fill > 0 && <g opacity={fill}><Fill k={k} to={to} t={t} shape={(p) => <circle cx={x} cy={y} r={47} {...p} />} /></g>}
      {label && <Txt x={x} y={y + 84} size={19} anchor="middle" weight={800}>{label}</Txt>}
      {k && fill > 0.5 && <NamePill x={x} y={y + 116} k={end} size={15} />}
      {sub && <Txt x={x} y={y + 146} size={16} anchor="middle" weight={800} fill={subColor ?? C.muted}>{sub}</Txt>}
    </g>
  );
}

const W1 = [540, 380], W2 = [800, 380], W3 = [540, 630], W4 = [800, 630];
export default function Beat10(s: any) {
  const {a} = s;
  const d = a('drops');
  // The dropper lives in its open bottle (neck top y 516): lifted out vertically, carried over the well, returned the same way.
  const [dx, dy] = d < 0 ? [215, 545] : a('pipette') > 0 ? path(a('pipette'), [[0, W1[0], 300], [0.6, 215, 330], [1.2, 215, 545]]) : path(d, [[0, 215, 545], [0.5, 215, 330], [1.1, W1[0], 300]]);
  const dropP = d > 1.2 ? ((d - 1.2) % 0.7) / 0.7 : 0;
  const iod1 = ramp(d, [[1.3, 0], [2.0, 1]]);
  const bbT = fe(a('bb'), 0.9);
  const inset = between(a('xinset'), a('end') + 1.5, 0.4);
  const right = 1 - fi(a('pipette'), 0.5);
  return (
    <g>
      <Bottle x={215} y={690} s={1.05} name={'iodine\nin KI'} k="orangebrown" hazard="irritant" open />
      <Txt x={215} y={740} size={18} anchor="middle" weight={700} fill={C.muted}>iodine in potassium</Txt>
      <Txt x={215} y={762} size={18} anchor="middle" weight={700} fill={C.muted}>iodide solution · irritant</Txt>
      {/* the tile, from above */}
      <rect x={400} y={275} width={540} height={640} rx={24} fill="#FFFFFF" stroke={C.ink} strokeWidth={3} />
      <Txt x={670} y={900} size={19} anchor="middle" weight={800} fill={C.muted}>white tile · seen from above</Txt>
      <Well x={W1[0]} y={W1[1]} k={iod1 > 0 ? 'orangebrown' : 'colourless'} to={bbT > 0 ? 'blueblack' : undefined} t={bbT} fill={fi(a('spot'))} label="sample" />
      <Well x={W2[0]} y={W2[1]} k="orangebrown" fill={fi(a('neg'))} label="another sample" opacity={fi(a('neg'))} sub="negative, these conditions" />
      <Well x={W3[0]} y={W3[1]} k="orangebrown" fill={1} label="water control" sub="unchanged" opacity={fi(a('controls'))} />
      <Well x={W4[0]} y={W4[1]} k="blueblack" fill={1} label="known starch" sub="positive control" subColor="#1D8A4E" opacity={fi(a('controls') - 0.8)} />
      <Dropper x={dx} y={dy} s={0.8} squeeze={dropP > 0 && dropP < 0.5 ? 1 : 0} drop={d > 1.2 && d < 3.3 ? dropP : 0} dropK="orangebrown" fall={(W1[1] - 300) / 0.8 - 6} />
      <Tag x={W1[0]} y={275} text="a few drops" size={19} anchor="middle" opacity={between(d - 0.8, a('ob'))} />
      <g opacity={fi(a('noheat'))}>
        <Tag x={96} y={835} text="no heating" size={24} fill={C.primary} />
      </g>
      <Txt x={W4[0]} y={W4[1] + 168} size={16} anchor="middle" weight={800} fill="#1D8A4E" opacity={fi(a('controls') - 1.4)}>confirms reagent works</Txt>
      {a('pipette') > 0 && <Tag x={215} y={250} text="iodine pipette: iodine only" size={20} anchor="middle" fill={C.primary} opacity={fi(a('pipette') - 1)} />}
      {/* right panel: reagent colour, observation → inference, mark scheme */}
      <g opacity={right}>
        <g opacity={fi(a('ob'))}>
          <Swatch x={1000} y={235} w={250} h={70} k="orangebrown" size={20} />
          <Txt x={1275} y={280} size={22} weight={700}>the reagent's own colour</Txt>
        </g>
        <g opacity={fi(a('bb'))}>
          <COIStack x={1000} y={360} w={840} cond="iodine in KI, no heat" obs="blue-black" obsK="blueblack" inf="starch present" o={fi(a('bb') - 0.3)} i={fi(a('bb') - 1.4)} hiObs={between(a('both'), a('neg')) > 0.5} />
          {fi(a('both')) > 0 && <InkRing cx={1300} cy={463} rx={120} ry={30} p={fe(a('both'), 0.6)} />}
          <Txt x={1440} y={470} size={20} weight={800} fill={C.primary} opacity={fi(a('both') - 0.5)}>both words</Txt>
        </g>
        <QuoteTab x={1000} y={590} w={840} opacity={fi(a('ms'))} quote={'"iodine solution and blue-black colour ;"'} source="9700/33 June 2021 Q1(a)(ii) mark scheme" size={24} />
      </g>
      {/* WRONG METHOD: a shared pipette */}
      <WrongInset x={1000} y={240} w={840} h={470} opacity={inset}>
        <Rack x={1420} y={520} w={200} h={150} slots={1}>
          <Tube id="x10" x={1420} y={430} h={230} w={60} level={0.45} k="blue" label="B" pill={false} />
        </Rack>
        <Dropper x={1420} y={400} s={1} drop={((s.local * 1.4) % 1)} dropK="orangebrown" squeeze={0.6} fall={153} />
        <Txt x={1100} y={330} size={22} weight={800}>iodine pipette</Txt>
        <Txt x={1100} y={358} size={22} weight={800}>into a Benedict's tube</Txt>
      </WrongInset>
      <g opacity={inset}>
        <Tag x={1030} y={680} text="cross-contamination: result unreliable" size={22} fill={C.primary} />
      </g>
      <g opacity={fi(a('end') + 1.6 - 0 > 1.9 ? a('end') - 0.3 : -1)}>
        <Tag x={1000} y={760} text="✓ one pipette per reagent, back in its own bottle" size={22} fill="#1D8A4E" />
      </g>
    </g>
  );
}
Beat10.pin = (s: any) => (s.a('bb') > 0 ? 'O' : 'C');
