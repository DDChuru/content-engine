import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, Scene, SS, C, Txt, Card, Cite, SCHEM, sceneAges, textW, clamp01, Bracket} from '../kit';
import {Body} from './Beat01';
import {MiniClose} from './Beat08';
import {T4} from '../t4-palette';
import {GOOD} from '../Panels';

/** Beat 9 · How it is asked, the local reject, and the hook: the forms surface at left (row 3 unnarrated from the
 * first cue), the familiar scene reduced at right, framed as beyond the mark scheme; the local contrast; the body
 * outline returns with the hook caption. Final frame held 2 s. */
export default function Beat09(s: any) {
  const t = gt(s), a = s.a;
  const S = 0.48, tx = 990 - 92 * S, ty = 200 - 196 * S;
  const fullHi = fi(a('full'), 0.4) * (1 - fe(a('beyond'), 0.6));
  const rcv = fi(a('decide'), 0.5);
  const r1 = fi(a('row1'), 0.4), r2 = fi(a('row2'), 0.4), r3 = fi(a('open'), 0.4);
  const L1 = '1. Prostaglandins are released by cells OR transported to target cells.';
  const b0 = 90 + textW('1. Prostaglandins are ', 20, 700), b1 = 90 + textW(L1.slice(0, -1), 20, 700);
  const X0 = tx + 92 * S, sx = (x: number) => tx + x * S;   // the reduced scene's labels are drawn at full size (008f)
  const tok = (k: number) => { const u = ((t * 0.3) % 1); return 150 + 260 * u; };
  return (
    <g>
      {/* reduced familiar scene at right */}
      <g transform={`translate(${tx} ${ty}) scale(${S})`}>
        <Scene t={t} {...sceneAges(t)} bindMuscle={99} bind={99} fail={99} respond={1} receptorGlow={{muscle: rcv, liver: rcv}}
          stage={{}} labels={{}} bare />
      </g>
      {[['secretion', 380], ['transport', 860], ['binding', 1160]].map(([k, x]: any) => <Txt key={k} x={sx(x)} y={216} size={21} weight={800} anchor="middle" fill={fullHi > 0.5 ? '#B64A30' : '#6F6A60'} opacity={0.45 + 0.55 * fullHi}>{k}</Txt>)}
      <Lbl x={1840} y={216} text="glucose transport protein" anchor="end" size={20} fill="#1E6B66" lx={sx(SS.muscle.x + SS.muscle.w / 2 - 70) + 2} ly={ty + (SS.muscle.y - SS.muscle.h / 2) * S - 6} />
      {a('beyond') >= 0 && <g opacity={fi(a('beyond'), 0.5)}>
        <rect data-role="decor" x={980} y={190} width={862} height={378} rx={14} fill="none" stroke={C.muted} strokeWidth={3} strokeDasharray="10 7" />
        <Pill x={990} y={594} text="beyond the mark scheme — our insulin illustration" size={20} />
      </g>}
      <MiniClose x={1550} y={612} w={300} h={318} t={t} />
      {/* the local contrast */}
      {a('reject') >= 0 && <Card x={990} y={612} w={546} h={134} opacity={fi(a('reject'), 0.4)} stroke={C.primary} fill="#FFFFFF">
        <Txt x={1008} y={646} size={21} weight={800} fill={C.primary}>✗ receptor active site</Txt>
        <Txt x={1270} y={646} size={21} weight={800} fill={GOOD}>✓ receptor binding site</Txt>
        <Txt x={1008} y={678} size={20} weight={700} fill={C.muted}>W22/23 Q5(a)(i), MS p.17, R active site</Txt>
        <Txt x={1008} y={706} size={20} weight={600} fill={C.muted} italic>R = rejected for that marking point in that question</Txt>
      </Card>}
      {/* the hook returns */}
      {a('search') >= 0 && <g opacity={fi(a('search'), 0.5)}>
        <rect data-role="decor" x={990} y={758} width={546} height={178} rx={12} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
        <Body x={994 - 255 * 0.2} y={768 - 240 * 0.2} sc={0.2} t={t} flow={1 + 0.6 * pulse(a('wide'), 1.6)} wedges={1} />
        <Txt x={1112} y={792} size={20} weight={800}>How does a hormone find the right cells?</Txt>
        <Txt x={1112} y={820} size={20} weight={700} fill={C.muted}>It does not search: no steering in the flow.</Txt>
        {rcv > 0 && <Txt x={1112} y={872} size={20} weight={800} fill={C.primary} opacity={rcv}>carried widely · complementary receptors</Txt>}
        {rcv > 0 && <Txt x={1112} y={898} size={20} weight={800} fill={C.primary} opacity={rcv}>determine which cells respond</Txt>}
      </g>}
      {/* forms surface */}
      <Txt x={70} y={216} size={24} weight={800} opacity={fi(a('open'), 0.4)}>How it is asked</Txt>
      {r1 > 0 && <Card x={70} y={232} w={890} h={330} opacity={r1} stroke={C.teal} fill="#FFFFFF">
        <Txt x={90} y={266} size={21} weight={800}>Prostaglandins in inflammation — outline cell signalling; 2 marks</Txt>
        <Txt x={90} y={294} size={20} weight={700} fill={C.muted}>M24/22 Q1(c)(iii), QP p.5 / MS p.7 · our paraphrase</Txt>
        <g data-role="drawing">
          <ellipse cx={130} cy={346} rx={50} ry={30} fill="none" stroke="#6B5B7B" strokeWidth={2.5} />
          <rect x={420} y={318} width={100} height={56} rx={18} fill="none" stroke="#6B5B7B" strokeWidth={2.5} />
          <circle cx={tok(0)} cy={346} r={10} fill={T4.ligand} stroke={T4.ligandEdge} strokeWidth={1.5} />
        </g>
        <path data-role="decor" d="M186 346H410M398 338L410 346L398 354" stroke={C.muted} strokeWidth={2} fill="none" />
        {fullHi > 0 && <g opacity={fullHi}><Txt x={130} y={398} size={20} weight={800} fill={C.primary} anchor="middle">secretion</Txt><Txt x={300} y={330} size={20} weight={800} fill={C.primary} anchor="middle">transport</Txt><Txt x={470} y={398} size={20} weight={800} fill={C.primary} anchor="middle">binding</Txt><Pill x={560} y={352} text="syllabus outline" size={20} fill={C.primary} /></g>}
        <Txt x={90} y={432} size={20} weight={700} opacity={fi(a('l1'), 0.4)}>{L1}</Txt>
        <Txt x={90} y={462} size={20} weight={700} opacity={fi(a('l2'), 0.4)}>2. They bind to receptors on target-cell surface membranes.</Txt>
        {fi(a('bracket'), 0.4) > 0 && <g opacity={fi(a('bracket'), 0.4)}><Bracket x={440} y0={b0} y1={b1} side={-1} horiz color={C.teal} /><Txt x={(b0 + b1) / 2} y={494} size={20} weight={700} fill={C.teal} anchor="middle">point 1: release and transport share one</Txt></g>}
        <Txt x={90} y={522} size={20} weight={600} fill={C.muted} italic opacity={fi(a('full'), 0.4)}>R24 p.21 (June 2024 P23 Q5(a)): intracellular details not required at AS;</Txt>
        <Txt x={90} y={546} size={20} weight={600} fill={C.muted} italic opacity={fi(a('full'), 0.4)}>fewer answers mentioned release/transport (supported paraphrase)</Txt>
      </Card>}
      {r2 > 0 && <Card x={70} y={574} w={890} h={128} opacity={r2} stroke={C.teal} fill="#FFFFFF">
        <Txt x={90} y={606} size={21} weight={800}>why different cell types respond to LL-37 (2 marks)</Txt>
        <Txt x={90} y={634} size={20} weight={700} fill={C.muted}>W22/23 Q5(a)(i), QP p.12 / MS p.17, our paraphrase</Txt>
        <Txt x={90} y={666} size={20} weight={700} fill={GOOD} opacity={fi(a('shared'), 0.4)}>credited: receptor identity · location · complementary shape; any two (our paraphrase)</Txt>
        <g data-role="drawing">{[0, 1].map((i) => { const cx = 830 + i * 76, cy = 614; return <g key={i}>{i === 0 ? <ellipse cx={cx} cy={cy} rx={30} ry={20} fill="#F4F0E4" stroke="#6B5B7B" strokeWidth={2} /> : <rect x={cx - 28} y={cy - 20} width={56} height={40} rx={10} fill="#F4F0E4" stroke="#6B5B7B" strokeWidth={2} />}<path d={`M${cx - 7} ${cy - 20}L${cx - 7} ${cy - 31}L${cx - 3} ${cy - 31}L${cx} ${cy - 26}L${cx + 3} ${cy - 31}L${cx + 7} ${cy - 31}L${cx + 7} ${cy - 20}Z`} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={1.2} /></g>; })}</g>
      </Card>}
      {r3 > 0 && <Card x={70} y={714} w={890} h={218} opacity={r3} stroke={C.line} fill="#FFFFFF">
        <Txt x={90} y={746} size={21} weight={800}>adjacent: a receptor inside the cell</Txt>
        <Txt x={90} y={774} size={20} weight={700} fill={C.muted}>S21/22 Q3(c), QP p.6 / MS p.12, 1 mark: hormone S binds cytoplasmic receptor R by</Txt>
        <Txt x={90} y={798} size={20} weight={700} fill={C.muted}>complementary shape, supplied in the question's diagram (our paraphrase);</Txt>
        <Txt x={90} y={822} size={20} weight={700} fill={C.muted}>adjacent specificity evidence only; not this lesson's cell-surface stages</Txt>
        <Txt x={90} y={850} size={20} weight={700} fill={C.primary}>MS p.12: Reject if hormone S or receptor R described as an antigen or enzyme</Txt>
        <g data-role="drawing"><ellipse cx={898} cy={894} rx={46} ry={30} fill="none" stroke="#6B5B7B" strokeWidth={2.5} /><rect x={886} y={886} width={24} height={16} rx={5} fill="none" stroke={T4.proteinEdge} strokeWidth={2} /></g>
      </Card>}
    </g>
  );
}
