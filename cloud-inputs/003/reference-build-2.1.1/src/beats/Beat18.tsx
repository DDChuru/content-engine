/** Competence moment: four doubtful results, framed CHECK BEFORE CONCLUDING, each column coming into
 * full colour when discussed. Checks, not verdicts: one check performed on screen (heating timer
 * inspected and re-run; the positive control changes). Closes on CONDITIONS → OBSERVATION →
 * INFERENCE with a control beside it. */
import React from 'react';
import {BRAND as C, clamp01} from '../../../shared/src/theme';
import {Txt, Tag, Arrow} from '../../../shared/src/Type';
import {Tube, Timer} from '../Apparatus';
import {Checklist} from '../Panels';
import {fi, fe, between, ramp} from '../util';

const COLX = [300, 740, 1180, 1620];
export default function Beat18(s: any) {
  const {a} = s;
  const act = (i: number) => [a('t1'), a('t2'), a('t3'), a('t4')][i] > 0;
  const rr = a('rerun');
  const gT = rr >= 2.3 ? 1 : 0; // endpoint switch after the re-run heating
  const secs = ramp(rr, [[0.2, 60], [0.9, 60], [1.0, 0], [2.2, 240]]);
  const col = (i: number, body: any) => (
    <g opacity={fi(a('panel'))}>
      <g filter={act(i) ? undefined : 'url(#desaturate)'} opacity={act(i) ? 1 : 0.55}>{body}</g>
    </g>
  );
  return (
    <g>
      <rect x={80} y={205} width={1770} height={735} rx={20} fill="none" stroke={C.muted} strokeWidth={3} strokeDasharray="12 8" opacity={fi(a('open'))} />
      <g opacity={Math.min(fi(a('open'), 0.5), 1 - fi(a('panel'), 0.5))}>
        <Txt x={960} y={580} size={96} anchor="middle" weight={800} fill={C.primary}>CHECKS, NOT GUESSES</Txt>
      </g>
      <g opacity={fi(a('open'))}>
        <rect x={100} y={220} width={390} height={40} rx={12} fill={C.ink} />
        <Txt x={295} y={248} size={21} anchor="middle" weight={800} fill={C.white}>CHECK BEFORE CONCLUDING</Txt>
      </g>
      {/* 1: positive control stayed blue */}
      {col(0, <>
        <Tube id="u18" x={COLX[0] - 60} y={330} h={220} w={52} level={0.44} k="blue" label="S" pill={false} />
        <Tube id="g18" x={COLX[0] + 40} y={330} h={220} w={52} level={0.44} k="blue" to={gT > 0 ? 'brickred' : undefined} t={gT} ppt={gT} label="G" pill={false} />
        <Txt x={COLX[0]} y={590} size={19} anchor="middle" weight={800}>positive control stayed blue</Txt>
        <Checklist x={COLX[0] - 200} y={610} w={400} title="check" items={['control solution', 'labels', 'volumes', 'mixing', 'heating']} p={fe(a('c1'), 3.5) * 5} tick={false} />
      </>)}
      <g opacity={fi(rr)}>
        <Timer x={COLX[0] + 160} y={440} secs={secs} of={240} s={0.62} />
        <Txt x={COLX[0] + 160} y={400} size={16} anchor="middle" weight={800} fill={C.primary}>{rr < 1 ? 'heating was 1:00' : 're-run: 4:00'}</Txt>
        <Tag x={COLX[0]} y={306} text="re-run: control now changes" size={17} anchor="middle" fill="#1D8A4E" opacity={fi(rr - 3.3)} />
      </g>
      {/* 2: a green Benedict's tube */}
      {col(1, <>
        <Tube id="t218" x={COLX[1]} y={330} h={220} w={52} level={0.44} k="green" ppt={0.5} label="S" pillY={610 - 30} pill={false} />
        <Txt x={COLX[1]} y={590} size={19} anchor="middle" weight={800}>a green Benedict's tube</Txt>
        <Tag x={COLX[1]} y={300} text="possibly a valid result" size={17} anchor="middle" fill="#1D8A4E" opacity={fi(a('valid'))} />
        <Checklist x={COLX[1] - 200} y={610} w={400} title="check before reading the shade" items={['heating time', 'volumes', 'controls']} p={fe(a('c2'), 2.5) * 3} />
      </>)}
      {/* 3: known protein stayed blue */}
      {col(2, <>
        <Tube id="t318" x={COLX[2]} y={330} h={220} w={52} level={0.44} k="blue" label="alb" pill={false} />
        <Txt x={COLX[2]} y={590} size={19} anchor="middle" weight={800}>known protein stayed blue</Txt>
        <Checklist x={COLX[2] - 200} y={610} w={400} title="check" items={['alkali added?', 'correct copper volume?', 'time allowed?']} p={fe(a('c3'), 3.2) * 2 + fi(a('c3b'), 0.5)} />
      </>)}
      {/* 4: a clear emulsion tube */}
      {col(3, <>
        <Tube id="t418" x={COLX[3]} y={330} h={220} w={52} level={0.44} k="clear" label="E" pill={false} />
        <Txt x={COLX[3]} y={590} size={19} anchor="middle" weight={800}>a clear emulsion tube</Txt>
        <Tag x={COLX[3]} y={300} text="possibly a valid negative" size={17} anchor="middle" fill="#1D8A4E" opacity={fi(a('t4') - 0.6)} />
        <Checklist x={COLX[3] - 200} y={610} w={400} title="check" items={['extraction', 'blank']} p={fe(a('c4'), 1.6) * 2} />
      </>)}
      {/* name pills for the four doubtful contents */}
      <g opacity={fi(a('panel'))}>
        {[['blue', 0], ['green', 1], ['blue', 2], ['clear', 3]].map(([k, i]: any) => (
          <Txt key={i} x={COLX[i]} y={562} size={15} anchor="middle" weight={700} fill={C.muted}>MODEL · {k === 'clear' ? 'clear' : k}</Txt>
        ))}
      </g>
      {/* the discipline returns, with a control */}
      <g opacity={fi(a('coi'))}>
        {['CONDITIONS', 'OBSERVATION', 'INFERENCE'].map((t, i) => (
          <g key={t}>
            <rect x={560 + i * 330} y={222} width={290} height={52} rx={12} fill={C.primary} />
            <Txt x={705 + i * 330} y={257} size={22} anchor="middle" weight={800} fill={C.white}>{t}</Txt>
            {i < 2 && <Arrow x1={854 + i * 330} y1={248} x2={886 + i * 330} y2={248} color={C.ink} width={4} head={10} />}
          </g>
        ))}
        <Tube id="c18" x={1560} y={214} h={70} w={26} level={0.45} k="blue" pill={false} />
        <Txt x={1590} y={256} size={19} weight={800}>+ a control</Txt>
      </g>
    </g>
  );
}
Beat18.pin = () => '';
