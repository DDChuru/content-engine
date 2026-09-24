/** What I told you, in place: no new slide. The familiar bench, static, with the finished tubes and
 * their controls in the rack, the iodine spots on the tile and the table beside them. Each clause
 * brightens its tube, spot or column in place. */
import React from 'react';
import {BRAND as C, clamp01} from '../../../shared/src/theme';
import {Txt, Tag} from '../../../shared/src/Type';
import {NamePill, Fill} from '../../../shared/src/Swatch';
import {Bench} from '../Bench';
import {fi, between} from '../util';

const ROWS = [
  {key: 'ben', test: "Benedict's, ≥ 80 °C", obs: 'green … brick-red, precipitate', k: 'orange', inf: 'reducing sugar'},
  {key: 'iod', test: 'iodine in KI', obs: 'blue-black', k: 'blueblack', inf: 'starch'},
  {key: 'emu', test: 'ethanol, then water', obs: 'cloudy white emulsion', k: 'cloudy', inf: 'lipid'},
  {key: 'biu', test: 'alkali, then Cu²⁺', obs: 'violet', k: 'violet', inf: 'protein (peptide bonds)'},
];
const ORDER = ['ben', 'iod', 'emu', 'biu', 'heads', 'inf', 'controls'];

export default function Beat19(s: any) {
  const {a} = s;
  const cur = (k: string) => {
    const i = ORDER.indexOf(k);
    return a(k) > 0 && (i === ORDER.length - 1 || a(ORDER[i + 1]) < 0);
  };
  const ctl = a('controls') > 0;
  const tubes = [
    {id: 'r19a', k: 'orange', ppt: 1, settle: 1, label: 'S', glow: cur('ben')},
    {id: 'r19b', k: 'blue', label: 'W', glow: ctl},
    {id: 'r19c', k: 'cloudy', label: 'E', glow: cur('emu')},
    {id: 'r19d', k: 'clear', label: 'blk', glow: ctl},
    {id: 'r19e', k: 'violet', label: 'P1', glow: cur('biu')},
    {id: 'r19f', k: 'blue', label: 'W', glow: ctl},
  ];
  const all = {rack: 1, label: 0, syringe: 0, dropper: 1, bath: 1, electric: 1, holder: 1, tile: 1, goggles: 1, reagents: 1, waste: 1};
  const hiObs = between(a('obs'), a('ben')) > 0.5 || cur('heads');
  const hiInf = a('inf') > 0 && a('controls') < 0;
  const spots = (
    <g>
      <ellipse cx={260} cy={838} rx={40} ry={14} fill="#FFFFFF" stroke={cur('iod') ? C.primary : 'none'} strokeWidth={4} />
      <Fill k="blueblack" shape={(p) => <ellipse cx={260} cy={838} rx={34} ry={11} {...p} />} />
      <Fill k="orangebrown" shape={(p) => <ellipse cx={360} cy={838} rx={34} ry={11} {...p} />} />
      {ctl && <ellipse cx={360} cy={838} rx={42} ry={16} fill="none" stroke={C.accent} strokeWidth={5} />}
    </g>
  );
  return (
    <g>
      <Bench show={all} tubes={tubes} tileContent={spots} glow={cur('ben') ? 'bath' : ''} />
      {/* tags in place */}
      <Tag x={1300} y={235} text="≥ 80 °C" size={22} anchor="middle" fill={C.primary} opacity={fi(a('ben'))} />
      <Tag x={310} y={790} text="blue-black · control orange-brown" size={17} anchor="middle" opacity={fi(a('iod'))} />
      <g opacity={fi(a('controls'))}>
        <Tag x={930} y={612} text="controls: W · blank · W" size={19} anchor="middle" fill={C.white} bg={C.primary} stroke={C.primary} />
      </g>
      <Txt x={930} y={955} size={15} anchor="middle" weight={700} fill={C.muted}>S · W · E · blank · P1 · W — MODEL colours</Txt>
      {/* the table beside them */}
      <g opacity={fi(a('open'))}>
        <rect x={86} y={214} width={1010} height={244} rx={14} fill={C.white} stroke={C.line} strokeWidth={2} />
        {['test', 'observation (in words)', 'inference (a class)'].map((h, i) => {
          const hi = (i === 1 && hiObs) || (i === 2 && hiInf) || cur('heads');
          return <Txt key={h} x={[106, 380, 800][i]} y={246} size={19} weight={800} fill={hi ? C.primary : C.muted}>{h}</Txt>;
        })}
        {hiObs && <rect x={370} y={224} width={416} height={226} rx={10} fill="none" stroke={C.primary} strokeWidth={3} />}
        {hiInf && <rect x={790} y={224} width={298} height={226} rx={10} fill="none" stroke={C.primary} strokeWidth={3} />}
        {ROWS.map((r, i) => {
          const y = 290 + i * 46;
          const on = cur(r.key);
          return (
            <g key={r.key}>
              {on && <rect x={92} y={y - 30} width={998} height={42} rx={8} fill={C.accent} opacity={0.35} />}
              <Txt x={106} y={y} size={20} weight={800}>{r.test}</Txt>
              <NamePill x={380} y={y + 1} k={r.k} text={r.obs} anchor="start" size={17} model={false} />
              <Txt x={800} y={y} size={20} weight={800}>{r.inf}</Txt>
            </g>
          );
        })}
      </g>
    </g>
  );
}
Beat19.pin = (s: any) => (s.a('inf') > 0 && s.a('controls') < 0 ? 'I' : s.a('obs') > 0 && s.a('ben') < 0 ? 'O' : s.a('cond') > 0 && s.a('obs') < 0 ? 'C' : '');
