/** Beat 4 · What makes a cell a stem cell. StemCellLineage marrow: the stem cell (unspecialised); a division EXCERPT
 * (omitted-interval caption and hold, explicit time cut into anaphase, then motion to two cells); one daughter stays and
 * runs the excerpt again (self-renewal); the other moves along the differentiation arrow to the specialised-cell slot
 * (outline only). The plant-stem handle, then the boxed sentence; MEMORY HOOK: "stem" and "a stem cell" glow together as
 * spoken, then the branches and "differentiate into specialised cells"; a 2 s silent hold follows (audio). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, textW} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Bone, StemCell, DiffCell, Excerpt, excerptDaughters, SL, EXCERPT} from '../StemCellLineage';
import {Label} from '../T5Annot';
import {fi, fe, lerp, pulse} from '../util';
import {StepArrow, MIT, DIF, CAP1, CAP2} from './lin';
import {SentenceStrip, stripSpan, typed} from './kit';

export const SENT4 = 'a stem cell divides by mitosis, and some of its daughter cells differentiate into specialised cells';
export default function Beat04(s: any) {
  const a = s.a;
  const N = SL.N;
  const u1 = a('div') < 0 ? -1 : Math.min(1.001, a('div') / 3.2);
  const [A, B] = excerptDaughters(N[0], N[1], 0.2);
  const u2 = a('keep') < 0 ? -1 : Math.min(1.001, a('keep') / 2.2);
  const [A1, A2] = excerptDaughters(A[0], A[1], 0.2);
  const SLOT = [720, 470];
  const bMove = fe(a('diff'), 3.2);
  const bx = lerp(B[0], SLOT[0], bMove), by = B[1];
  const outline = fi(a('spec'), 0.6);
  const a2 = fe(a('keep') - 2.3, 1.2);
  const exc = (u1 >= 0 && u1 < 1) || (u2 >= 0 && u2 < 1);
  const icon = a('handle') >= 0 ? 1 : 0, iconShrink = fe(a('wp'), 0.8);
  const IX = lerp(1540, 1640, iconShrink), IY = lerp(560, 330, iconShrink), IS = lerp(1, 0.6, iconShrink);
  const shown = a('wp') < 0 ? 0 : typed(SENT4, a('wp') - 0.3, SENT4.length / 6.5).length;
  const SX = 110, SY = 780, SW = 1320;
  const h1 = a('wp') >= 0 && a('c2') < 0 ? 1 : a('c2') >= 0 ? 0.35 : 0, h2 = a('c2') >= 0 ? 1 : 0;
  const sp1 = stripSpan(SX, SY, SW, SENT4, 'a stem cell', 28), spM = stripSpan(SX, SY, SW, SENT4, 'mitosis', 28);
  const sp2 = stripSpan(SX, SY, SW, SENT4, 'differentiate into specialised cells', 28), spD = stripSpan(SX, SY, SW, SENT4, 'differentiate', 28);
  return (
    <g>
      <Txt x={70} y={214} size={20} weight={800} fill={T5.ringHalo} opacity={fi(a('stem'), 0.4)}>{CAP1}</Txt>
      <Txt x={70} y={238} size={15} weight={600} fill={C.muted} italic opacity={fi(a('stem'), 0.4)}>{CAP2}</Txt>
      <g opacity={fi(s.local, 0.3)}>
        <Bone />
        <Label x={420} y={372} text="bone marrow" size={20} />
      </g>
      {u1 < 1 && <g opacity={fi(s.local, 0.3)}><Excerpt x={N[0]} y={N[1]} u={u1 < 0 ? 0 : u1} size={0.2} hi={pulse(a('unsp'), 1.6)} /></g>}
      {a('stem') >= 0 && u1 < 0 && <Label x={N[0] - 40} y={N[1] + 72} text="stem cell" size={20} />}
      {a('unsp') >= 0 && <Tag x={480} y={330} text="unspecialised: no particular job yet" size={20} opacity={fi(a('unsp'), 0.4) * (1 - fi(a('div') - 0.2, 0.4))} />}
      {exc && <Txt x={SL.marrow[0] + 10} y={SL.marrow[1] + SL.marrow[3] + 28} size={16} weight={700} fill={C.muted} italic>{EXCERPT}</Txt>}
      {u1 >= 1 && <>
        {u2 < 1 ? <Excerpt x={A[0]} y={A[1]} u={u2 < 0 ? 0 : u2} size={0.2} /> : <>
          <StemCell x={A1[0]} y={A1[1]} r={40} />
          <StemCell x={lerp(A2[0], 330, a2)} y={lerp(A2[1], 540, a2)} r={34} outline={true} op={0.9} />
        </>}
        <g opacity={1}>
          {outline < 1 && <DiffCell x={bx} y={by} r={40} tint={0} nucR={0.5} op={1 - outline} />}
          {outline > 0 && <circle data-role="drawing" cx={SLOT[0]} cy={SLOT[1]} r={40} fill="none" stroke={T5.membrane} strokeWidth={2.5} strokeDasharray="6 5" opacity={outline} />}
        </g>
      </>}
      {a('div') >= 0 && <StepArrow x1={N[0] - 60} y1={N[1] - 78} x2={N[0] + 60} y2={N[1] - 78} color={MIT} label="mitosis" lx={N[0] - 60} ly={N[1] - 92} op={fi(a('div'), 0.4)} hi={spM && a('c2') >= 0 ? 0.8 : 0} />}
      {a('self') >= 0 && <Txt x={A1[0]} y={A1[1] + 68} size={18} weight={800} fill={T5.ringHalo} anchor="middle" opacity={fi(a('self'), 0.4)}>stem cell (self-renewal)</Txt>}
      {a('diff') >= 0 && <StepArrow x1={B[0] + 40} y1={N[1] + 70} x2={SLOT[0] + 20} y2={N[1] + 70} color={DIF} label="differentiation" lx={B[0] + 60} ly={N[1] + 98} op={fi(a('diff'), 0.4)} hi={a('c2') >= 0 ? 0.8 : 0} />}
      {a('spec') >= 0 && <Tag x={SLOT[0] - 60} y={SLOT[1] - 64} text="specialised cell" size={19} opacity={fi(a('spec'), 0.4)} />}
      {icon > 0 && <g transform={`translate(${IX} ${IY}) scale(${IS})`} opacity={fi(a('handle'), 0.4)}>
        <rect data-role="decor" x={-150} y={-190} width={300} height={250} rx={16} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        {h1 > 0 && <path data-role="decor" d="M0 40V-150" stroke={T5.ring} strokeWidth={16} opacity={0.5 * h1} strokeLinecap="round" />}
        {h2 > 0 && <path data-role="decor" d="M0 -40L-70 -110M0 -80L70 -150" stroke={T5.ring} strokeWidth={16} opacity={0.5 * h2} strokeLinecap="round" />}
        <g data-role="drawing">
          <path d="M0 40V-150" stroke="#2F602C" strokeWidth={7} strokeLinecap="round" />
          <path d="M0 -40L-70 -110" stroke="#2F602C" strokeWidth={5} strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - fe(a('handle') - 0.4, 1.0)} />
          <path d="M0 -80L70 -150" stroke="#2F602C" strokeWidth={5} strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - fe(a('handle') - 0.9, 1.0)} />
        </g>
        <Txt x={0} y={30} size={17} weight={700} fill={T5.ringHalo} anchor="middle" opacity={1 - iconShrink}>handle: the stem is where the branches start</Txt>
        {a('wp') >= 0 && <Txt x={0} y={30} size={22} weight={700} fill={T5.ringHalo} anchor="middle">memory aid, not the exam answer</Txt>}
      </g>}
      {a('wp') >= 0 && <SentenceStrip x={SX} y={SY} w={SW} text={SENT4} shown={shown} size={28} opacity={fi(a('wp'), 0.4)} />}
      {sp1 && h1 > 0 && shown >= 11 && <rect data-role="decor" x={sp1[0] - 4} y={sp1[2] - 28} width={sp1[1] - sp1[0] + 8} height={36} rx={8} fill={T5.ring} opacity={0.35 * h1} />}
      {sp2 && h2 > 0 && <rect data-role="decor" x={sp2[0] - 4} y={sp2[2] - 28} width={sp2[1] - sp2[0] + 8} height={36} rx={8} fill={T5.ring} opacity={0.35 * h2} />}
      {a('c2') >= 0 && spM && <path data-role="decor" d={`M${spM[0]} ${spM[2] + 8}H${spM[1]}`} stroke={MIT} strokeWidth={5} opacity={fi(a('c2'), 0.4)} />}
      {a('c2') >= 0 && spD && <path data-role="decor" d={`M${spD[0]} ${spD[2] + 8}H${spD[1]}`} stroke={DIF} strokeWidth={5} opacity={fi(a('c2'), 0.4)} />}
    </g>
  );
}
