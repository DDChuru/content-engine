/** Beat 5 · Bone marrow to red blood cell. A stem cell in the marrow divides (excerpt: caption, hold, time cut,
 * anaphase → cytokinesis); in one possible pattern one daughter stays and the other moves along the differentiation arrow
 * through three drawn intermediate stages (smaller, nucleus denser, tint deepening in one red hue); the condensed nucleus
 * is pushed out and drifts away; the cell leaves the marrow into the vessel and only there settles into the mature disc;
 * the typical lifespan note; daughter A begins another excerpt. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Bone, StemCell, Excerpt, excerptDaughters, DiffPath, Vessel, SL, EXCERPT} from '../StemCellLineage';
import {Label} from '../T5Annot';
import {fi, fe, pulse} from '../util';
import {StepArrow, MIT, DIF, CAP1, CAP2} from './lin';

export default function Beat05(s: any) {
  const a = s.a, L = s.local;
  const N = SL.N;
  const u1 = a('div') < 0 ? -1 : Math.min(1.001, a('div') / 2.6);
  const [A, B] = excerptDaughters(N[0], N[1], 0.2);
  const p = a('diff') < 0 ? 0 : a('inter') < 0 ? Math.min(1, a('diff') / 3.6) : 1 + Math.min(2, a('inter') / 2.4) + (a('nuc') >= 0 ? 0.001 : 0);
  const nucOut = a('nuc') >= 0 ? Math.min(1, a('nuc') / 1.8) : 0;
  const rel = a('blood') >= 0 ? fe(a('blood'), 1.2) : 0, mature = a('mature') >= 0 ? fe(a('mature'), 1.2) : 0;
  const u3 = a('life') < 0 ? -1 : Math.min(1.001, a('life') / 2.6);
  const exc = (u1 >= 0 && u1 < 1) || (u3 >= 0 && u3 < 1);
  return (
    <g>
      <Txt x={70} y={214} size={20} weight={800} fill={T5.ringHalo}>{CAP1}</Txt>
      {pulse(a('pattern'), 1.4) > 0 && <rect data-role="decor" x={62} y={190} width={220} height={32} rx={8} fill={T5.ring} opacity={0.4 * pulse(a('pattern'), 1.4)} />}
      <Txt x={70} y={238} size={15} weight={600} fill={C.muted} italic>{CAP2}</Txt>
      <Bone hi={pulse(a('open') - 0.2, 1.6)} />
      <Label x={420} y={372} text="bone marrow" size={20} />
      <Vessel x0={SL.V.x0} x1={SL.V.x1} y={SL.V.y} h={SL.V.h} t={L} skip={1} />
      <Txt x={SL.V.x0 + 320} y={SL.V.y - SL.V.h / 2 - 12} size={16} weight={700} fill={T5.ringHalo}>blood vessel</Txt>
      {u1 < 1 && <Excerpt x={N[0]} y={N[1]} u={u1 < 0 ? 0 : u1} size={0.2} />}
      {u1 >= 1 && <>
        {u3 < 0 || u3 >= 1 ? <StemCell x={A[0]} y={A[1]} r={40} /> : <Excerpt x={A[0]} y={A[1]} u={u3} size={0.2} />}
        {u3 >= 1 && <StemCell x={A[0] - 46} y={A[1]} r={34} />}
        <DiffPath p={p} from={B} nucOut={nucOut} rel={rel} mature={mature} />
      </>}
      {exc && <Txt x={SL.marrow[0] + 10} y={SL.marrow[1] + SL.marrow[3] + 28} size={16} weight={700} fill={C.muted} italic>{EXCERPT}</Txt>}
      {a('div') >= 0 && <StepArrow x1={N[0] - 60} y1={N[1] - 78} x2={N[0] + 60} y2={N[1] - 78} color={MIT} label="mitosis" lx={N[0] - 60} ly={N[1] - 92} op={fi(a('div'), 0.4)} />}
      {a('stay') >= 0 && <Txt x={A[0]} y={A[1] + 68} size={18} weight={800} fill={T5.ringHalo} anchor="middle" opacity={fi(a('stay'), 0.4)}>stem cell (self-renewal)</Txt>}
      {a('diff') >= 0 && <StepArrow x1={SL.S[0][0] - 90} y1={SL.S[0][1] + 64} x2={SL.S[2][0] + 40} y2={SL.S[2][1] + 64} color={DIF} label="differentiation" lx={SL.S[0][0] - 60} ly={SL.S[0][1] + 92} op={fi(a('diff'), 0.4)} />}
      {a('inter') >= 0 && <Txt x={SL.S[1][0]} y={SL.S[1][1] - 52} size={17} weight={700} fill={T5.ringHalo} anchor="middle" opacity={fi(a('inter'), 0.4)}>intermediate stages</Txt>}
      {a('hb') >= 0 && <Tag x={SL.S[2][0] - 40} y={SL.S[2][1] + 128} text="haemoglobin" size={18} opacity={fi(a('hb'), 0.4)} />}
      {a('nuc') >= 0 && <Txt x={SL.S[2][0] + 70} y={SL.S[2][1] - 58} size={17} weight={800} fill={T5.ringHalo} opacity={fi(a('nuc') - 0.8, 0.4)}>nucleus lost</Txt>}
      {a('mature') >= 0 && <g opacity={fi(a('mature') - 0.6, 0.4)}>
        <Txt x={SL.M[0]} y={SL.M[1] + 80} size={18} weight={800} fill={T5.ringHalo} anchor="middle">mature human red blood cell · no nucleus</Txt>
        <Txt x={SL.M[0]} y={SL.M[1] + 104} size={18} weight={800} fill={T5.ringHalo} anchor="middle">specialised cell</Txt>
      </g>}
      {a('life') >= 0 && <Txt x={820} y={SL.M[1] + 170} size={17} weight={600} fill={C.muted} italic opacity={fi(a('life'), 0.4)}>typical lifespan of a human red blood cell: about four months (context, not a marking point)</Txt>}
    </g>
  );
}
