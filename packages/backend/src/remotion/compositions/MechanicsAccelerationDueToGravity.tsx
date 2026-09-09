/** Vertical motion under constant downward gravity, following the recorded M4.2 lesson. */
import React from 'react';
import transcript from '../public/transcripts/mechanics/acceleration-due-to-gravity.json';
import {T, Scene, Lesson, Figure, Caption, at, between, currentBeat, duration} from './mechanics-m42/Presentation';
import {HandwrittenLine, prepareLine} from './mechanics-m42/Ink';

const SCENES = transcript.scenes as unknown as Scene[];
const OUTCOMES = ['Distinguish weight from acceleration.', 'Keep one positive direction.', 'Solve vertical motion problems.'];
export interface MechanicsAccelerationDueToGravityProps {audioEnabled?: boolean; audit?: boolean}
export const getMechanicsAccelerationDueToGravityDuration = (fps: number) => duration(SCENES, fps);
const beat = (s: Scene, id: string) => s.beats.find(b => b.id === id)!;
const valueAt = (s: Scene, id: string, target: string) => {
  const b = beat(s, id);
  return s.figureEvents.find(e => e.kind === 'spoken' && e.target === target && e.start >= b.cue && e.start < b.speechEnd)?.start ?? b.cue;
};
const spokenWord = (s: Scene, id: string, word: string) => {
  const words = (s as Scene & {words: {word: string; start: number}[]}).words;
  const b = beat(s, id);
  const found = words.find(w => w.start >= b.start && w.start < b.speechEnd && w.word.toLowerCase().replace(/[^a-z]/g, '') === word);
  if (!found) throw Error(`Missing word ${s.id}:${id}:${word}`);
  return found.start;
};
const storyWord = (s: Scene, word: string) => spokenWord(s, 'story', word);
const Diagram: React.FC<{children: React.ReactNode; centered?: boolean}> = ({children, centered}) => (
  <svg data-region="diagram" data-visual="diagram" width={900} height={820} style={{position: 'absolute', left: centered ? 490 : 80, top: 190}}>{children}</svg>
);
const Arrow: React.FC<{x: number; y: number; end: number; dashed?: boolean; accent?: boolean}> = ({x, y, end, dashed, accent}) => {
  const color = accent ? T.accent : T.muted;
  return <g data-obstacle="arrow"><path d={`M${x} ${y} V${end}`} stroke={color} strokeWidth={4} strokeDasharray={dashed ? '8 7' : undefined}/><path d={`M${x-9} ${end+(end>y?-15:15)} L${x} ${end} L${x+9} ${end+(end>y?-15:15)}`} fill="none" stroke={color} strokeWidth={4}/></g>;
};
const Stone: React.FC<{x: number; y: number}> = ({x, y}) => <g data-stone-y={y} transform={`translate(${x} ${y})`}><circle r={18} fill={T.accent}/><path d="M-8 -7 Q0 -14 8 -6" fill="none" stroke={T.text} strokeWidth={3} opacity={.6}/></g>;
const Positive: React.FC = () => <g><Arrow x={65} y={145} end={65}/><text data-label="true" x={100} y={105} fill={T.text} fontSize={27}>Upward positive</text></g>;
const Ground: React.FC<{sea?: boolean}> = ({sea}) => <g><path d="M50 680 H840" stroke={T.muted} strokeWidth={4}/>{sea ? [0,1,2].map(i => <path key={i} d={`M50 ${696+i*13} Q90 ${686+i*13} 130 ${696+i*13} T210 ${696+i*13} T290 ${696+i*13} T370 ${696+i*13} T450 ${696+i*13} T530 ${696+i*13} T610 ${696+i*13} T690 ${696+i*13} T770 ${696+i*13} T840 ${696+i*13}`} stroke={T.muted} opacity={.35} fill="none"/>) : Array.from({length: 20}, (_,i) => <path key={i} d={`M${60+i*39} 680 l-15 18`} stroke={T.muted} opacity={.45}/>)}<text data-label="true" x={60} y={sea ? 765 : 745} fill={T.muted} fontSize={27}>{sea ? 'Sea level' : 'Ground'}</text></g>;
const Motif: React.FC = () => <g><path d="M120 665 H780" stroke={T.muted} strokeWidth={4}/>{[170,225,320,455].map((y,i) => <circle key={y} cx={430} cy={y} r={12+i*2} fill={T.accent} opacity={.2+i*.2}/>)}<Stone x={430} y={620}/><Arrow x={540} y={270} end={565} accent/></g>;

const QUESTIONS: Record<string, string[]> = {
  symmetry: ['u = +12 m s⁻¹; back to launch height (s = 0)', 'a = −10 m s⁻²; no air resistance', 'Find v on return.'],
  drop: ['Stone dropped 15 m; no air resistance.', 'Find its velocity just before impact.', 'Take upward positive.'],
  'cliff-story': ['Projected upward at 8 m s⁻¹,', '20 m above sea, freely under gravity.', 'Find total time until impact.'],
  'cliff-time': ['Projected upward at 8 m s⁻¹,', '20 m above sea, freely under gravity.', 'Find total time until impact.'],
  'cliff-height': ['Same stone: 8 m s⁻¹ upward,', '20 m above sea, freely under gravity.', 'Find maximum height above sea level.'],
};
type ProblemMark = {line: number; phrase: string; start: number};
const ProblemLine: React.FC<{text: string; index: number; mark?: ProblemMark; t: number}> = ({text,index,mark,t}) => {
  const ref = React.useRef<SVGTextElement>(null);
  const [extent,setExtent] = React.useState({x:0,width:0});
  React.useLayoutEffect(() => {
    const element = ref.current;
    if(!element || !mark) return;
    const offset = text.indexOf(mark.phrase);
    if(offset < 0) throw Error(`Missing problem phrase ${mark.phrase}`);
    setExtent({x:element.getSubStringLength(0,offset),width:element.getSubStringLength(offset,mark.phrase.length)});
  },[text,mark?.phrase]);
  return <g><text ref={ref} data-label="true" data-problem-line="true" x={35} y={190+index*65} fill={T.ink} fontSize={30}>{text}</text>{mark && t >= mark.start && <path data-problem-highlight={mark.phrase} d={`M${35+extent.x} ${203+index*65} h${extent.width}`} stroke={T.accent} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1-between(t,mark.start,mark.start+.4)}/>}</g>;
};
const problemMark = (s: Scene, t: number): ProblemMark | undefined => {
  const b = currentBeat(s,t);
  if(!b) return;
  if(s.mode === 'symmetry') {
    if(b.id === 'story') {
      if(t >= spokenWord(s,'story','no')) return {line:1,phrase:'no air resistance',start:spokenWord(s,'story','no')};
      if(t >= valueAt(s,'story','displacement')) return {line:0,phrase:'back to launch height (s = 0)',start:valueAt(s,'story','displacement')};
      return {line:0,phrase:'+12 m s⁻¹',start:valueAt(s,'story','initial')};
    }
    if(b.id === 'givens') return t >= spokenWord(s,'givens','find')
      ? {line:2,phrase:'Find v on return.',start:spokenWord(s,'givens','find')}
      : {line:1,phrase:'a = −10 m s⁻²',start:valueAt(s,'givens','acceleration')};
    return;
  }
  if(s.mode === 'drop') {
    if(b.id === 'height') return {line:0,phrase:'15 m',start:valueAt(s,'height','displacement')};
    if(b.id === 'initial') return {line:0,phrase:'no air resistance',start:spokenWord(s,'initial','ignore')};
  } else {
    if(b.id === 'initial' || b.id === 'top') return {line:0,phrase:'8 m s⁻¹',start:valueAt(s,b.id,'initial')};
    if(b.id === 'height') return {line:1,phrase:'20 m above sea',start:valueAt(s,'height','cliff-height')};
    if(b.id === 'acceleration') return {line:1,phrase:'freely under gravity',start:b.cue};
    if(b.id === 'setup') return {line:2,phrase:s.mode === 'cliff-height' ? 'maximum height above sea level' : 'total time until impact',start:b.cue};
  }
};
const Working: React.FC<{s: Scene; t: number}> = ({s, t}) => {
  const lines = s.beats.filter(b => b.ink);
  const writing = lines.some(b => t >= b.cue);
  const mark = problemMark(s,t);
  return <svg data-region={writing ? 'paper' : 'problem'} data-visual={writing ? 'paper' : undefined} width={790} height={730} style={{position:'absolute', left:1050, top:230}}>
    {!writing ? <g><rect x={0} y={130} width={790} height={245} rx={10} fill="#b9bcb2"/>{QUESTIONS[s.mode].map((line,i) => <ProblemLine key={line} text={line} index={i} mark={mark?.line === i ? mark : undefined} t={t}/>)}</g> : <g>
      <rect x={0} y={0} width={790} height={730} rx={12} fill={T.paper}/>
      {Array.from({length:9},(_,i) => <path key={i} d={`M35 ${105+i*70} H750`} stroke={T.grid}/>) }
      {lines.map((line,i) => {
        if(t < line.cue) return null;
        const size = Math.min(34, 690/prepareLine(line.ink!,1).width);
        const width = prepareLine(line.ink!,size).width;
        const event = s.figureEvents.filter(e => e.target === `ink-${line.id}` && t >= e.start && t < (e.end ?? e.start+1.5)+.2).at(-1);
        // Finish the answer, then draw its ring before the silent hold starts.
        const answerLine = ['result','rise'].includes(line.id);
        const writeEnd = line.penEnd-(answerLine ? .45 : 0);
        const result = answerLine && t >= writeEnd;
        const ringStart = event?.start ?? writeEnd;
        const p = between(t,ringStart,ringStart+.4);
        const cx = 42+width/2, cy = 60+i*105+size*.5, rx = width/2+13, ry = size*.78;
        const ring = Array.from({length:65},(_,j) => {const a=j/64*Math.PI*2,w=1+.022*Math.sin(3*a+.4); return `${j?'L':'M'}${cx+rx*Math.cos(a)*w} ${cy+ry*Math.sin(a)*w}`;}).join(' ');
        return <g key={line.id} data-ink-id={line.id}>
          <HandwrittenLine text={line.ink!} frame={t*30} start={line.cue*30} end={writeEnd*30} x={42} y={60+i*105} size={size}/>
          {(event || result) && <path data-ring={event?.id ?? `result-${line.id}`} data-ring-target={`ink-${line.id}`} data-ring-kind={event?.kind ?? 'result'} d={ring} fill="none" stroke={T.accent} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1-Math.max(.06,p)}/>}
        </g>;
      })}
    </g>}
  </svg>;
};

const Drop: React.FC<{s: Scene; t: number}> = ({s,t}) => {
  const setup = t >= at(s,'height');
  const p = between(t,storyWord(s,'falls'),storyWord(s,'impact'));
  const y = setup ? 180 : 180+480*p*p;
  const result = t >= valueAt(s,'result','result');
  const changed = t >= at(s,'change');
  return <><Diagram centered={!setup}><Ground/><path d="M355 180 V660" fill="none" stroke={T.muted} strokeWidth={2} strokeDasharray="7 7"/><Stone x={355} y={y}/>
    {setup && <><Positive/><path d="M190 180 H390 M200 180 V680 M188 680 H212" stroke={T.muted} strokeWidth={2} fill="none"/>
      <Figure id="initial" x={425} y={180} size={30}>u = 0 m s⁻¹</Figure>
      {changed && <Figure id="changed-initial" x={425} y={245} size={29}>If thrown down: u &lt; 0</Figure>}
      <Arrow x={450} y={300} end={410} accent/><Figure id="acceleration" x={490} y={355} size={30}>a = −10 m s⁻²</Figure>
      <Figure id="displacement" x={55} y={485} size={30}>s = −15 m</Figure>
      <Arrow x={390} y={565} end={645} dashed={!result}/><Figure id="result" x={425} y={630} size={30}>{result ? 'v = −17.3 m s⁻¹' : 'v = ?'}</Figure>
      <Caption text={currentBeat(s,t)?.caption} x={200} y={790}/>
    </>}
  </Diagram>{setup && <Working s={s} t={t}/>}</>;
};

const Cliff: React.FC<{s: Scene; t: number}> = ({s,t}) => {
  const story = s.mode === 'cliff-story';
  const setup = !story || t >= at(s,'initial');
  const heightMode = s.mode === 'cliff-height';
  let y = heightMode ? 216 : 280;
  if(story && !setup) {
    const rise = between(t,storyWord(s,'rises'),storyWord(s,'returns'));
    const fall = between(t,storyWord(s,'returns'),storyWord(s,'hits')+.45);
    y = fall > 0 ? 216+444*fall*fall : 280-64*(2*rise-rise*rise);
  }
  const timeResult = s.mode === 'cliff-time' && t >= valueAt(s,'result','time-result');
  const riseResult = heightMode && t >= valueAt(s,'rise','rise');
  const heightResult = heightMode && t >= valueAt(s,'result','height-result');
  return <><Diagram centered={!setup}><Ground sea/><path d="M60 280 H300 L318 375 L300 470 L323 565 L305 680 H60 Z" fill="#30383c" stroke={T.muted} strokeWidth={2}/><path d="M430 280 V216 M452 216 V660" stroke={T.muted} strokeWidth={2} strokeDasharray="7 7"/><Stone x={setup ? 430 : 452} y={y}/>
    {setup && <><Positive/>
      <path d="M350 280 H465" stroke={T.muted} strokeWidth={2}/><text data-label="true" x={75} y={260} fill={T.muted} fontSize={26}>Launch: s = 0</text>
      <Arrow x={475} y={335} end={280}/><Figure id="initial" x={510} y={310} size={30}>u = 8 m s⁻¹</Figure>
      <Arrow x={475} y={410} end={520} accent/><Figure id="acceleration" x={515} y={465} size={30}>a = −10 m s⁻²</Figure>
      <path d="M110 280 V680 M98 280 H122 M98 680 H122" stroke={T.muted} strokeWidth={2}/><Figure id="cliff-height" x={150} y={425} size={30}>20 m</Figure>
      {!heightMode && <Figure id="displacement" x={150} y={570} size={30}>s = −20 m</Figure>}
      {heightMode ? <><Figure id="top" x={510} y={150} size={29}>v = 0 m s⁻¹</Figure><Figure id="rise" x={510} y={220} size={29}>{riseResult ? 'Rise: s = 3.2 m' : 'Rise: s = ?'}</Figure><Figure id="height-result" x={390} y={765} size={30}>{heightResult ? 'Height = 23.2 m' : 'Height above sea = ?'}</Figure></> : <Figure id="time-result" x={490} y={630} size={30}>{timeResult ? 't = 2.95 s' : 'Total time: t = ?'}</Figure>}
      {!heightMode && <Caption text={currentBeat(s,t)?.caption} x={200} y={790}/>}
    </>}
  </Diagram>{setup && <Working s={s} t={t}/>}</>;
};

const Symmetry: React.FC<{s: Scene; t: number}> = ({s,t}) => {
  const graph = t >= at(s,'graph');
  const trianglesAt = spokenWord(s,'graph','triangles');
  const equal = graph && t >= trianglesAt;
  const lowerAt = spokenWord(s,'caveat','cliff');
  const lower = t >= lowerAt;
  const returned = t >= valueAt(s,'result','return');
  const initial = t >= valueAt(s,'story','initial');
  const sameHeight = t >= valueAt(s,'story','displacement');
  const conditions = t >= spokenWord(s,'story','no');
  const positive = t >= spokenWord(s,'story','positive');
  const acceleration = t >= valueAt(s,'givens','acceleration');
  const graphP = between(t,at(s,'graph'),trianglesAt);
  const flight = graph ? graphP : between(t,storyWord(s,'up'),storyWord(s,'caught'));
  const y = 565-350*4*flight*(1-flight);
  const caption = lower ? 'Cliff landing: faster' : currentBeat(s,t)?.caption;
  return <><Diagram>
    <path d="M100 565 H810" stroke={T.muted} strokeWidth={3}/>
    <text data-label="true" x={90} y={605} fill={T.muted} fontSize={27}>Launch / catch height</text>
    <path d="M375 565 V215 M400 215 V565" stroke={T.muted} strokeWidth={2} strokeDasharray="7 7"/>
    <Stone x={flight <= .5 ? 375 : 400} y={lower ? 565+85*between(t,lowerAt,beat(s,'caveat').penEnd) : y}/>
    {positive && <Positive/>}
    {conditions && <Figure id="conditions" x={90} y={175} size={29}>No air resistance</Figure>}
    {initial && <><Arrow x={345} y={535} end={465}/><Figure id="initial" x={465} y={455} size={29}>u = +12 m s⁻¹</Figure></>}
    {sameHeight && <Figure id="displacement" x={90} y={660} size={29}>s = 0 m</Figure>}
    {acceleration && <><Arrow x={430} y={300} end={410} accent/><Figure id="acceleration" x={480} y={355} size={29}>a = −10 m s⁻²</Figure></>}
    <Arrow x={440} y={485} end={565} dashed={!returned}/>
    <Figure id="return" x={485} y={605} size={29}>{returned ? 'v = −12 m s⁻¹' : 'Return: v = ?'}</Figure>
    <Caption text={caption} x={90} y={755}/>
  </Diagram>{!graph ? <Working s={s} t={t}/> : <svg data-region="graph" data-visual="graph" width={790} height={730} style={{position:'absolute', left:1050, top:230}}>
    <rect width={790} height={730} rx={12} fill={T.paper}/><text data-label="true" x={35} y={50} fill={T.ink} fontSize={28}>Velocity / m s⁻¹</text>
    {[140,265,390,515,640].map(x => <path key={x} d={`M${x} 110 V575`} stroke={T.grid}/>)}
    {[150,250,350,450,550].map(y => <path key={y} d={`M140 ${y} H690`} stroke={T.grid}/>)}
    <path d="M140 100 V585 M125 350 H710" stroke={T.ink} strokeWidth={3} fill="none"/>
    {equal && <><path d="M140 350 V150 L390 350 Z" fill={T.accent} opacity={.3}/><path d="M390 350 L640 550 V350 Z" fill={T.accent} opacity={.18}/></>}
    {lower && <path d={`M640 550 L${640+60*between(t,lowerAt,beat(s,'caveat').penEnd)} ${550+48*between(t,lowerAt,beat(s,'caveat').penEnd)}`} stroke={T.accent} strokeWidth={4} strokeDasharray="6 5" fill="none"/>}
    <path d={`M140 150 L${140+500*graphP} ${150+400*graphP}`} stroke={T.accent} strokeWidth={6} fill="none"/><circle cx={140+500*graphP} cy={150+400*graphP} r={8} fill={T.accent}/>
    <Figure id="initial" x={75} y={160} size={29} ink>12</Figure><text data-label="true" x={95} y={360} fontSize={29} fill={T.ink}>0</text>
    <Figure id="return" x={60} y={560} size={29} ink>−12</Figure>
    <text data-label="true" x={650} y={625} fill={T.ink} fontSize={27}>Time / s</text>
    <text data-label="true" x={106} y={625} fill={T.ink} fontSize={25}>Launch</text><text data-label="true" x={370} y={625} fill={T.ink} fontSize={25}>Top</text><text data-label="true" x={560} y={625} fill={T.ink} fontSize={25}>Return</text>
    {equal && <><path d="M140 670 H390 M390 670 H640 M140 660 V680 M390 660 V680 M640 660 V680" stroke={T.accent} strokeWidth={3}/><Figure id="displacement" x={225} y={710} size={27} ink>{lower ? 'Same-height result only' : 'Equal areas: s = 0'}</Figure></>}
  </svg>}</>;
};

const Content: React.FC<{s: Scene; t: number}> = ({s,t}) => {
  const b = currentBeat(s,t);
  if(s.mode === 'opening') return <><Diagram><Motif/></Diagram><svg data-region="card" width={790} height={530} style={{position:'absolute',left:1050,top:340}}><rect x={0} y={70} width={790} height={220} rx={10} fill="#b9bcb2"/>{(b?.id === 'quote2' ? ['with constant acceleration','in a straight line'] : [b?.caption ?? 'Syllabus 4.2']).map((text,i) => <text data-label="true" key={text} x={30} y={160+i*52} fill={T.ink} fontSize={34}>{text}</text>)}</svg></>;
  if(s.mode === 'drop') return <Drop s={s} t={t}/>;
  if(s.mode.startsWith('cliff')) return <Cliff s={s} t={t}/>;
  if(s.mode === 'symmetry') return <Symmetry s={s} t={t}/>;
  const check = s.mode === 'check';
  const top = check || t >= at(s,'top');
  const modelProgress = check ? 1 : between(t,at(s,'sign'),at(s,'top'));
  const stoneY = 300-80*(2*modelProgress-modelProgress*modelProgress);
  return <><Diagram centered={!check}>
    <path d="M100 650 H810" stroke={T.muted} strokeWidth={3}/><Stone x={360} y={stoneY}/>
    <Arrow x={415} y={stoneY} end={stoneY+200} accent/>
    {!check && <Figure id="weight" x={100} y={590} size={31}>Weight: gravitational force</Figure>}
    {!check && <Figure id="gravity" x={480} y={315} size={30}>{t >= at(s,'gravity') ? 'g = 10 m s⁻²' : 'g: acceleration'}</Figure>}
    {(check || t >= at(s,'sign')) && <><Positive/><Figure id="acceleration" x={480} y={425} size={30}>{check && t < valueAt(s,'answer','acceleration') ? 'a = ?' : 'a = −10 m s⁻²'}</Figure></>}
    {top && <Figure id="top" x={480} y={215} size={30}>v = 0 m s⁻¹</Figure>}
    <Caption text={b?.caption} x={100} y={735}/>
  </Diagram>{check && t >= at(s,'outcome1') && <svg data-region="outcomes" width={790} height={500} style={{position:'absolute',left:1050,top:330}}>{OUTCOMES.map((text,i) => t >= at(s,`outcome${i+1}`) && <g key={text}><path d={`M20 ${100+i*110} l12 13 25 -30`} stroke={T.accent} strokeWidth={5} fill="none"/><text data-label="true" x={80} y={110+i*110} fontSize={32} fill={T.text}>{text}</text></g>)}</svg>}</>;
};
export const MechanicsAccelerationDueToGravity: React.FC<MechanicsAccelerationDueToGravityProps> = props => <Lesson scenes={SCENES} content={Content} {...props}/>;
