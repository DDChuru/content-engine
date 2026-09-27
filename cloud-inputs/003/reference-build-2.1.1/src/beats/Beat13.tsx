/** Biuret 1: a single bottle (follow the supplied protocol) or two bottles as in June 2021 (5% KOH,
 * 0.15% copper sulfate, concentrations as supplied); the order strip; 1 cm³ sample → 1 cm³ KOH
 * (irritant, eye protection stays on) → shake → 1 cm³ copper sulfate → shake; framed WRONG METHOD
 * inset (no alkali: no violet result) ending on alkali first; no heating; wait ≥ 1 minute. */
import React from 'react';
import {BRAND as C, clamp01} from '../../../shared/src/theme';
import {Txt, Tag, Cite, Lines} from '../../../shared/src/Type';
import {WrongInset} from '../../../shared/src/ErrorMarker';
import {Tube, Rack, Bottle, Syringe, Goggles, Hazard, Timer} from '../Apparatus';
import {fi, fe, path, ramp, between, shake} from '../util';

const TX = 920, TY = 430;
function Dispense({age, fromX, k, label}: any) {
  if (age < 0 || age > 3.1) return null;
  // down into the liquid of the open bottle, up clear of it, across above the tube rim (430), then in
  const [x, y] = path(age, [[0, fromX, 470], [0.4, fromX, 640], [1.0, fromX, 640], [1.4, fromX, 400], [1.9, TX, 400], [2.2, TX, 470]]);
  const f = ramp(age, [[0.4, 0], [1.0, 0.3], [2.2, 0.3], [2.7, 0]]);
  return (
    <g opacity={Math.min(fi(age, 0.3), fi(3.1 - age, 0.3))}>
      <Syringe x={x} y={y} s={0.8} fill={f} k={k} />
      {f > 0.25 && <Tag x={x + 36} y={y - 160} text={label} size={19} fill={C.primary} />}
    </g>
  );
}

export default function Beat13(s: any) {
  const {a} = s;
  const two = fi(a('two'), 0.6);
  const lvl = ramp(a('s'), [[2.2, 0], [2.7, 0.12]]) + ramp(a('p'), [[2.2, 0], [2.7, 0.12]]) + ramp(a('c'), [[2.2, 0], [2.7, 0.12]]);
  const cuT = ramp(a('c'), [[2.2, 0], [2.7, 1]]);
  const tm = a('timer');
  const secs = ramp(tm, [[0.2, 0], [3.0, 60]]);
  const vio = clamp01((secs - 15) / 40);
  const k = cuT > 0 ? (vio > 0 ? 'blue' : 'blue') : 'colourless';
  const rot = shake(a('shake1'), 1.4, 9) + shake(a('shake2'), 1.4, 9);
  const step = a('timer') > 0 ? 3 : a('c') > 0 ? 2 : a('p') > 0 ? 1 : a('s') > 0 ? 0 : -1;
  const inset = between(a('xinset'), a('correct') + 1.2, 0.4);
  return (
    <g>
      {/* reagents */}
      <g opacity={fi(a('single')) * (1 - two)}>
        <Bottle x={360} y={700} s={1.1} name={'biuret\nreagent'} k="blue" hazard="irritant" />
        <Tag x={360} y={760} text="follow the supplied protocol" size={20} anchor="middle" fill={C.primary} />
      </g>
      <g opacity={two}>
        <Bottle x={160} y={700} s={0.95} name="sample" k="colourless" open={a('s') > 0.2 && a('s') < 1.35} />
        <Bottle x={360} y={700} s={1.05} name={'P\nKOH'} k="clear" hazard="irritant" glow={between(a('koh'), a('cuso4')) > 0.5} open={a('p') > 0.2 && a('p') < 1.35} />
        <Bottle x={560} y={700} s={1.05} name={'C\nCuSO₄'} k="blue" glow={between(a('cuso4'), a('order')) > 0.5} open={a('c') > 0.2 && a('c') < 1.35} />
        <Txt x={360} y={752} size={18} anchor="middle" weight={800} opacity={fi(a('koh'))}>5% potassium hydroxide</Txt>
        <Txt x={560} y={778} size={18} anchor="middle" weight={800} opacity={fi(a('cuso4'))}>0.15% copper sulfate</Txt>
        <Cite x={96} y={850} size={18} opacity={fi(a('cuso4'))} text={'9700/33 June 2021, Table 1.1: concentrations as supplied;\ndifferent strengths need the supplied volumes'} />
      </g>
      <Txt x={96} y={262} size={20} weight={700} fill={C.muted} opacity={fi(a('two'))}>as in the June 2021 practical: two bottles</Txt>
      {/* tube P1 */}
      <g opacity={fi(a('s') + 0.5)}>
        <Rack x={TX} y={530} w={170} h={250} slots={1}>
          <Tube id="P13" x={TX} y={TY} h={300} w={68} level={lvl} k={lvl > 0.01 ? (cuT > 0 ? 'blue' : 'colourless') : undefined} to={vio > 0 ? 'lilac' : cuT > 0 && cuT < 1 ? undefined : undefined} t={vio}
            label="P1" rot={rot} pillY={840} pill={lvl > 0.3} />
        </Rack>
      </g>
      <Dispense age={a('s')} fromX={160} k="colourless" label="1 cm³ sample" />
      <Dispense age={a('p')} fromX={360} k="clear" label="1 cm³ P (KOH)" />
      <Dispense age={a('c')} fromX={560} k="blue" label="1 cm³ C (CuSO₄)" />
      <Tag x={TX + 100} y={500} text="shake gently" size={19} opacity={between(a('shake1'), a('c')) + between(a('shake2'), a('xinset'))} />
      {/* order strip */}
      <g opacity={fi(a('order'))}>
        {['1 cm³ sample', 'KOH, shake', 'CuSO₄, shake', 'wait ≥ 1 min'].map((t, i) => {
          const on = step === i;
          return (
            <g key={t} opacity={fi(a('order') - i * 0.3, 0.3)}>
              <rect x={1180 + i * 168} y={230} width={156} height={78} rx={14} fill={on ? C.primary : C.white} stroke={on ? C.primary : C.line} strokeWidth={2} />
              <Txt x={1196 + i * 168} y={262} size={22} weight={800} fill={on ? C.white : C.primary}>{i + 1}</Txt>
              <Txt x={1196 + i * 168} y={292} size={18} weight={800} fill={on ? C.white : C.ink}>{t}</Txt>
            </g>
          );
        })}
        <Txt x={1180} y={340} size={21} weight={800} fill={C.primary}>alkali first</Txt>
      </g>
      {/* hazard at the moment of handling */}
      <g opacity={fi(a('irr'))}>
        <Goggles x={1250} y={410} s={0.8} glow={between(a('irr'), a('shake1')) > 0.5} />
        <Hazard x={1360} y={410} s={1} kind="irritant" />
        <Txt x={1400} y={404} size={22} weight={800}>KOH: irritant</Txt>
        <Txt x={1400} y={432} size={19} weight={700} fill={C.muted}>eye protection stays on</Txt>
      </g>
      {/* WRONG METHOD: no alkali */}
      <WrongInset x={1180} y={470} w={670} h={420} opacity={inset}>
        <Rack x={1330} y={640} w={150} h={190} slots={1}>
          <Tube id="X13" x={1330} y={560} h={250} w={60} level={0.3} k="blue" label="?" pill={false} />
        </Rack>
        <Lines x={1420} y={590} size={21} step={29} weight={800} text={'sample +\ncopper sulfate,\nno alkali'} />
      </WrongInset>
      <g opacity={inset}>
        <Tag x={1420} y={740} text="no alkali: no violet result" size={21} fill={C.primary} />
        <Tag x={1420} y={800} text="stays the reagent's blue" size={19} />
      </g>
      <g opacity={fi(a('correct') + 1.2 > 1.25 ? a('correct') - 0.9 : -1)}>
        <Tag x={1180} y={520} text="✓ alkali first: violet can develop" size={22} fill="#1D8A4E" />
      </g>
      <Tag x={1180} y={590} text="no heating" size={22} fill={C.primary} opacity={fi(a('noheat'))} />
      <g opacity={fi(tm)}>
        <Timer x={1330} y={700} secs={secs} of={60} label="at least 1 minute (shown fast)" />
      </g>
    </g>
  );
}
Beat13.pin = () => 'C';
