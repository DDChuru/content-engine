/** E33 · five moves · COMMON MISTAKE (ECR Paper 2 Q1 comment B lists the hybrids; "looking only for
 * 'induced fit'"). Written hybrid, never voiced; the two fragments pulled apart onto the two panels;
 * correction in place. Marker to the exit cue (end of "never a blend of the two"). */
import React from 'react';
import {BRAND as C, clamp01} from '../../shared/src/theme';
import {Txt, Arrow, Underline, textW} from '../../shared/src/Type';
import {QHeader, Written, span, QuoteTab, quoteSpan, SideNote, Strike, GOOD} from '../Panels';
import {Frame, LKRun, PANEL, LKC, IFC} from './Beat12';
import {IFRun} from './Beat13';
import {fi, fe, pulse, between} from '../util';

const PX = 760, PW = 1090;
const Q = `"B. Some candidates gave a mixture of terms, such as 'induced key', 'induced fit key',\n'induced lock and key', 'induced substrate', 'lock and key fit'. The examiners were looking only for 'induced fit'."`;
const WRONG = 'induced lock and key', RIGHT = 'induced fit';

export default function Beat14(s: any) {
  const {a, k, at} = s;
  const cf = k - Math.ceil(at.correct * 30 - 1e-9);
  const strike = clamp01(cf / 9), repl = clamp01((cf - 9) / 9), corrected = cf >= 18;
  const cardY = 460, ws = 54;
  const [i0, i1] = span(PX + 30, WRONG, 0, 7, ws), [l0, l1] = span(PX + 30, WRONG, 8, 20, ws);
  const tint = a('tint') >= 0 && !corrected;
  const both = pulse(a('merge'), 1.2);
  // left: the two panels from Beats 12–13, scaled into the left third
  const ifAge = a('ifchange');
  const cl = ifAge >= 0 && ifAge < 3 ? ifAge : -1;
  const qy = 640;
  const only = quoteSpan(PX, qy, Q, 1, Q.split('\n')[1].indexOf('The examiners'), Q.split('\n')[1].length, 19);
  return (
    <g>
      <g transform="translate(40 250) scale(0.36)">
        <g transform={`translate(0 ${-PANEL.y})`}>
          <Frame which="lk" dim={0.5} glow={both + pulse(a('lkfixed'), 1.2)} tick={1} />
          <LKRun seat={-1} complex={-1} leave={1e9} same={a('lkfixed') >= 0 && a('ifchange') < 0 ? a('lkfixed') : 1e9} dim={0.3} />
          <g transform={`translate(${PANEL.lk.x - PANEL.if.x + 0} ${PANEL.h + 40})`}>
            <Frame which="if" dim={0.5} glow={both + (corrected ? fi(cf / 30) : 0) + pulse(a('ifchange'), 1.5)} />
            <IFRun cl={cl} match={-1} complex={-1} leave={-1} reopen={cl >= 1.6 ? cl - 1.6 : -1} dim={0.3} />
          </g>
        </g>
      </g>
      <Txt x={60} y={236} size={18} weight={700} fill={C.muted} opacity={fi(a('announce'))}>from Beats 12–13: the two drawings</Txt>
      <SideNote x={60} y={930} text="taught together" size={22} opacity={between(a('merge'), a('lkfixed'))} />
      <QHeader x={PX} y={200} w={PW} label="THE QUESTION · our framing" size={26} opacity={fi(a('header'))}
        text={'the name of the hypothesis in which the active site changes\nshape as the substrate binds'}
        src={'Our framing of June 2016 Paper 22 Q1; question reproduced in ECR Paper 2 p.7; examiner comment quoted from p.10.'} />
      <g opacity={fi(a('show'), 0.3)}>
        <rect x={PX} y={cardY - 72} width={760} height={122} rx={14} fill={C.white} stroke={corrected ? '#1D8A4E' : C.primary} strokeWidth={4} />
        <Txt x={PX + 22} y={cardY - 46} size={16} weight={800} fill={C.muted}>A WRITTEN ANSWER</Txt>
        {!corrected && <g opacity={1 - repl}>
          <Written x={PX + 30} y={cardY + 20} text="" size={ws} />
          <Txt x={i0} y={cardY + 20} size={ws} weight={600} fill={tint ? IFC : '#2B3A8C'} italic>induced</Txt>
          <Txt x={l0} y={cardY + 20} size={ws} weight={600} fill={tint ? LKC : '#2B3A8C'} italic>lock and key</Txt>
          {a('ul') >= 0 && <><Underline x1={i0} x2={i1} y={cardY + 32} p={fe(a('ul'), 0.4)} /><Underline x1={l0} x2={l1} y={cardY + 32} p={fe(a('ul') - 0.5, 0.4)} /></>}
          {strike > 0 && <Strike x1={i0 - 4} x2={l1 + 4} y={cardY + 2} p={strike} />}
        </g>}
        {repl > 0 && <Written x={PX + 30} y={cardY + 20} text={RIGHT} size={ws} ok opacity={repl} />}
      </g>
      {tint && a('merge') < 0 && <g opacity={fi(a('tint'))}>
        <Arrow x1={330} y1={600} x2={(i0 + i1) / 2} y2={cardY + 42} color={IFC} width={3} head={12} bend={-60} />
        <Arrow x1={330} y1={320} x2={(l0 + l1) / 2} y2={cardY - 44} color={LKC} width={3} head={12} bend={40} />
        <SideNote x={PX + 780} y={cardY - 20} text={'a piece of each,\nglued together'} size={20} />
      </g>}
      <SideNote x={PX + 780} y={cardY - 20} text={'lock-and-key:\nthe fixed shape'} size={20} color={LKC} opacity={between(a('lkfixed'), a('ifchange'))} />
      <SideNote x={PX + 780} y={cardY - 20} text={'induced fit:\nthe shape that changes'} size={20} color={IFC} opacity={between(a('ifchange'), a('cite'))} />
      <QuoteTab x={PX} y={qy} w={PW} quote={Q} source="ECR Paper 2 Q1, p.10 (examiner comment)" size={19} opacity={fi(a('cite'))}>
        {a('only') >= 0 && <Underline x1={only.x0} x2={only.x1} y={only.y} p={fe(a('only'), 0.6)} width={3} />}
      </QuoteTab>
      <Txt x={PX} y={850} size={24} weight={800} fill={C.ink} opacity={fi(a('correct'))}>two drawings · two names: lock-and-key, or induced fit</Txt>
    </g>
  );
}
