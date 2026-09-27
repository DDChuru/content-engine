/** Benedict's 2: into the water bath at ≥ 80 °C (boiling in the cited practical); a framed WRONG
 * METHOD inset of a flame on the tube, introduced as a mistake and ending on the water bath; a
 * stated heating time (4:00, sourced); holder lifts the hot tube; the white tile slides behind. */
import React from 'react';
import {BRAND as C, clamp01} from '../../../shared/src/theme';
import {Txt, Tag, Cite} from '../../../shared/src/Type';
import {WrongInset} from '../../../shared/src/ErrorMarker';
import {Tube, Rack, BeakerBath, Bunsen, Holder, Timer, Tile, rotP} from '../Apparatus';
import {fi, fe, path, ramp, between} from '../util';

export default function Beat07(s: any) {
  const {a} = s;
  const into = a('bath'), lift = a('lift');
  // Held by the holder going in and coming out; lifted until its base clears the beaker rim (y 493)
  // before any sideways move, so it never passes through the glass.
  let [tx, ty] = path(into, [[0, 220, 470], [0.8, 220, 200], [1.7, 470, 200], [2.6, 470, 450]]);
  if (lift > 0) [tx, ty] = path(lift, [[0, 470, 450], [0.8, 470, 200], [1.8, 860, 300]]);
  const held = (into > 0 && into < 2.9) || lift > 0;
  const mouth = rotP(1235, 290, 1235, 400, 25), jaw = rotP(1235, 330, 1235, 400, 25);
  const tm = a('timer');
  const secs = ramp(tm, [[0.3, 0], [3.3, 240]]);
  // S is read only after the stated heating: its endpoint appears as a switch at 4:00 (no cross-fade,
  // which would pass through false colours, and no implied colour journey — CHECK M3).
  const heat = secs >= 240 ? 1 : 0;
  const inBath = into > 2.4 && lift < 0.9;
  const inset = between(a('flameX'), a('timer'), 0.4);
  const flick = (n: number) => 0.5 + 0.5 * Math.sin(s.local * 18 + n);
  return (
    <g>
      {a('tile') > 0 && (
        <g opacity={fi(a('tile'))} transform={`translate(${(1 - fe(a('tile'), 0.7)) * 160} 0)`}>
          <rect x={790} y={290} width={150} height={440} rx={10} fill="#FFFFFF" stroke={C.ink} strokeWidth={2.5} />
          <Txt x={865} y={764} size={20} anchor="middle" weight={700}>white tile behind</Txt>
        </g>
      )}
      <BeakerBath x={500} y={905} s={1.05} flame={1} reading="≥ 80 °C">
        <g clipPath={inBath ? undefined : undefined}>
          <Tube id="t7" x={tx} y={ty} h={260} w={56} level={0.44} k="blue" to={heat > 0 ? 'orange' : undefined} t={heat}
            ppt={heat > 0.4 ? clamp01((heat - 0.4) / 0.6) : 0} label="S" pill={lift > 0} pillY={ty + 300} />
        </g>
      </BeakerBath>
      <Rack x={220} y={560} w={150} h={250} slots={1} />
      <Tag x={330} y={440} text="boiling water bath in the cited practical" size={20} anchor="middle" opacity={fi(a('boiling'))} />
      <Tag x={500} y={940} text="water bath: even heating, known temperature" size={19} anchor="middle" fill="#1D8A4E" opacity={fi(a('timer'))} />
      {/* WRONG METHOD inset: flame straight on the tube */}
      <WrongInset x={1000} y={220} w={500} h={430} opacity={inset}>
        <Tube id="w7" x={1235} y={290} h={200} w={50} level={0.4} k="blue" rot={25} pill={false} />
        <Holder x={jaw[0]} y={jaw[1]} s={0.75} rot={25} />
        <Bunsen x={1215} y={630} flame={1.25} s={1.05} />
        {a('spit') > 0 && [0, 1, 2, 3].map((n) => (
          <circle key={n} cx={mouth[0] + 8 + n * 14} cy={mouth[1] - 10 - 30 * flick(n) - n * 10} r={6} fill="#3F7FD6" opacity={fi(a('spit'))} />
        ))}
        <circle cx={1210} cy={468} r={17} fill="#FFB347" opacity={0.85 * fi(a('spot'))} />
      </WrongInset>
      <g opacity={inset}>
        <Tag x={1520} y={330} text="heats one spot" size={21} fill={C.primary} opacity={fi(a('spot'))} />
        <Tag x={1520} y={400} text="liquid can spit out" size={21} fill={C.primary} opacity={fi(a('spit'))} />
        <Tag x={1520} y={470} text="no known temperature" size={21} fill={C.primary} opacity={fi(a('notemp'))} />
      </g>
      {/* heating time */}
      <g opacity={fi(tm)}>
        <Timer x={1250} y={330} secs={secs} of={240} label="stated time (shown fast)" s={1.2} />
        <Cite x={1000} y={470} size={19} text={'9700/12 June 2022 Q6: 240 s · 9700/35 June 2021: 1 minute ·\n9700/32 June 2023: time to first change. Follow the supplied method.'} />
        <Tag x={1000} y={560} text="in an exam: follow the supplied method" size={22} fill={C.primary} opacity={fi(a('follow'))} />
      </g>
      {/* lift with the holder; white tile behind */}
      {held && <Holder x={tx - 4} y={ty + 40} s={0.9} rot={0} />}
      <g opacity={fi(lift - 0.5)}>
        <Tag x={1000} y={660} text="hot: holder, not fingers" size={24} fill={C.white} bg={C.primary} stroke={C.primary} />
        <Cite x={1000} y={710} size={19} text={'hot-water risk credited in 9700/35 June 2021 Q1(a)(i): "damaging skin"'} />
      </g>
    </g>
  );
}
Beat07.pin = () => 'C';
