/** Choosing SUVAT from knowns: the recorded bike, train, reversal and car journeys. */
import React from 'react';
import transcript from '../public/transcripts/mechanics/suvat-in-1d.json';
import {T, Beat, Scene, Lesson, Figure, Caption, at, between, currentBeat, duration} from './mechanics-m42/Presentation';
import {HandwrittenLine, prepareLine} from './mechanics-m42/Ink';

type SuvatBeat = Beat & {list?: string[]; known?: number[]; required?: number | number[]; result?: string};
type SuvatScene = Omit<Scene, 'beats'> & {beats: SuvatBeat[]; words: {word:string;start:number;end:number}[]};
const SCENES = transcript.scenes as unknown as SuvatScene[];
const OUTCOMES = ['Choose from knowns', 'Keep signed values', 'Solve linked equations'];
export interface MechanicsSuvatIn1DProps {audioEnabled?: boolean; audit?: boolean}
export const getMechanicsSuvatIn1DDuration = (fps: number) => duration(SCENES, fps);
const started = (s: Scene, id: string, t: number) => s.cues[id] !== undefined && t >= s.cues[id];
const resultAt = (s: SuvatScene, result: string, t: number) => s.beats.find(b => b.result === result && t >= b.cue);
const Diagram: React.FC<{children: React.ReactNode}> = ({children}) => <svg data-region="diagram" data-visual="diagram" width={790} height={810} style={{position:'absolute',left:70,top:180}}>
  <defs><marker id="suvat-arrow" markerWidth={8} markerHeight={8} refX={6} refY={4} orient="auto"><path d="M0 0 L8 4 L0 8" fill={T.accent}/></marker></defs>{children}
</svg>;
const Arrow: React.FC<{x:number;y:number;dx:number;dashed?:boolean}> = ({x,y,dx,dashed=false}) => <path d={`M${x} ${y} h${dx}`} fill="none" stroke={T.accent} strokeWidth={4} strokeDasharray={dashed?'8 7':undefined} markerEnd="url(#suvat-arrow)"/>;
const Road: React.FC = () => <g><path d="M25 393 H765" stroke={T.muted} strokeWidth={4}/><path d="M25 418 H765" stroke={T.muted} opacity={.25} strokeWidth={2} strokeDasharray="28 22"/></g>;
const Bracket: React.FC<{x1:number;x2:number;y:number}> = ({x1,x2,y}) => <path d={`M${x1} ${y-12} v24 m0 -12 H${x2} m0 -12 v24`} fill="none" stroke={T.muted} strokeWidth={2}/>;
const LooseRing: React.FC<{x:number;y:number;rx:number;ry?:number;p?:number}> = ({x,y,rx,ry=27,p=1}) => <polyline points={Array.from({length:Math.ceil(p*64)+1},(_,i)=>{const a=Math.min(i/64,p)*Math.PI*2,w=1+.025*Math.sin(3*a+.4);return `${x+rx*Math.cos(a)*w},${y+ry*Math.sin(a)*w}`;}).join(' ')} fill="none" stroke={T.accent} strokeWidth={3}/>;

/** The house glyphs, clipped geometrically so completed strokes cannot lose dash-cache pixels. */
const InkLine: React.FC<React.ComponentProps<typeof HandwrittenLine>> = ({text,frame,start,end,x,y,size=29,color='#213b78',panel='working'}) => {
  const prepared=React.useMemo(()=>prepareLine(text,size),[text,size]);
  const points=prepared.strokes.flatMap(s=>s.points),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
  const left=Math.min(...xs)-1.55,top=Math.min(...ys)-1.55,right=Math.max(...xs)+1.55,bottom=Math.max(...ys)+1.55;
  let tip:readonly[number,number]|undefined;
  const paths=prepared.strokes.map((stroke,index)=>{
    const p=between(frame,start+stroke.start*(end-start),start+stroke.end*(end-start));
    if(p<=0)return null;
    const visible:Array<readonly[number,number]>=[stroke.points[0]];
    let remaining=stroke.length*p;
    for(let i=1;i<stroke.points.length;i++){
      const a=stroke.points[i-1],b=stroke.points[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);
      if(remaining>=length){visible.push(b);remaining-=length;}
      else{const q=remaining/Math.max(.001,length);visible.push([a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q]);break;}
    }
    if(p<1)tip=visible.at(-1);
    return <polyline key={index} points={visible.map(p=>p.join(',')).join(' ')} stroke={color} strokeWidth={3.1}/>;
  });
  return <g data-ink-text={text} data-ink-panel-id={panel} data-ink-active={frame>start?'true':'false'} data-ink-end={end} data-ink-complete={frame>=end?'true':'false'} data-ink-stroke-ends={JSON.stringify(prepared.strokes.map(s=>start+s.end*(end-start)))} transform={`translate(${x} ${y})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect data-ink-extent="true" x={left} y={top} width={right-left} height={bottom-top} fill="none" stroke="none"/>{paths}
    {tip&&frame<end&&<g transform={`translate(${tip[0]} ${tip[1]}) rotate(-38)`}><rect x={-5} y={-34} width={10} height={35} rx={4} fill={T.accent} stroke={T.ink} strokeWidth={2}/><path d="M-5 0 L0 10 L5 0 Z" fill={T.ink}/></g>}
  </g>;
};

/** Recognisable vehicles retain the moving-story language of DrawingTravelGraphs. */
const Vehicle: React.FC<{kind:string;x:number;t:number;moving?:boolean;opacity?:number}> = ({kind,x,t,moving=true,opacity=1}) => {
  const angle=moving?t*200:0;
  if(kind==='reversal')return <g data-cart-x={x} transform={`translate(${x} 370)`} opacity={opacity}><circle r={20} fill={T.accent}/><circle cx={-6} cy={-7} r={6} fill={T.text} opacity={.45}/></g>;
  const wheel=(cx:number,r:number) => <g key={cx} transform={`translate(${cx} 0) rotate(${angle})`}><circle r={r} fill={T.bg} stroke={T.text} strokeWidth={4}/><path d={`M${-r} 0 H${r} M0 ${-r} V${r}`} stroke={T.muted} strokeWidth={2}/><circle r={4} fill={T.text}/></g>;
  return <g data-cart-x={x} transform={`translate(${x} 367)`} opacity={opacity}>
    {kind.startsWith('bike')?<>{wheel(-43,25)}{wheel(43,25)}<path d="M-43 0 L-15 -48 L7 0 Z M-15 -48 H24 L43 0 M7 0 L24 -48 L22 -63 H36 M-22 -53 H-5" fill="none" stroke={T.accent} strokeWidth={6} strokeLinejoin="round"/><circle cx={-3} cy={-106} r={13} fill={T.text}/><path d="M-6 -89 L-22 -59 L6 -42 L7 0 M-8 -86 L21 -63" fill="none" stroke={T.text} strokeWidth={8} strokeLinecap="round"/></>:kind==='train'?<><path d="M-104 -15 V-75 Q-104 -85 -94 -85 H50 L88 -48 V-15 Z" fill={T.accent}/>{[-80,-35,10].map(cx=><rect key={cx} x={cx} y={-68} width={29} height={27} rx={3} fill={T.paper}/>)}<path d="M55 -70 L76 -47 H55 Z" fill={T.paper}/>{[-70,-20,55].map(cx=>wheel(cx,19))}<path d="M-112 -14 H95" stroke={T.text} strokeWidth={4}/></>:<><path d="M-80 -10 V-36 L-51 -44 L-29 -73 H29 L58 -43 L80 -34 V-10 Z" fill={T.accent}/><path d="M-38 -45 L-21 -65 H3 V-45 Z M12 -65 H24 L44 -45 H12 Z" fill={T.paper}/>{wheel(-48,20)}{wheel(48,20)}<path d="M63 -29 H76" stroke={T.paper} strokeWidth={5}/></>}
  </g>;
};

const QUESTIONS: Record<string,string[]> = {
  bike:['Bike accelerates uniformly at 4 m s⁻².','From 10 m s⁻¹ over 48 m.','Find its final velocity.'],
  'bike-time':['Same bike: u = 10 m s⁻¹; a = 4 m s⁻².','After 48 m, v = 22 m s⁻¹.','Find the time.'],
  train:['Train brakes uniformly for 6 s.','From 7 m s⁻¹ to rest.','Find deceleration, then distance.'],
  reversal:['Particle: u = 10 m s⁻¹; a = −4 m s⁻².','After 5 s, find velocity and displacement.','Acceleration remains constant.'],
  car:['Car accelerates uniformly: AC = 165 m in 10 s.','At 8 s, AB = 112 m.','Find initial velocity u and acceleration a.'],
  check:['Train distance: choose an equation.','Use u, v and t.','Which equation omits acceleration?'],
};
const Sheet: React.FC<{s:SuvatScene;t:number}> = ({s,t}) => {
  const active=s.beats.filter(b=>b.ink&&t>=b.cue),page=active.at(-1)?.page??0;
  const list=s.beats.find(b=>b.list&&(b.page??0)===page);
  const lines=s.beats.filter(b=>b.ink&&!b.list&&(b.page??0)===page).flatMap(b=>{
    if(b.id!=='eliminate')return [b];
    const subtract=s.words.find(w=>w.start>=b.cue&&w.start<b.speechEnd&&w.word.toLowerCase().startsWith('subtract'));
    if(!subtract)throw new Error('Missing local subtraction word cue');
    return [{...b,id:'double',ink:'2u + 8a = 28',penEnd:subtract.start-.06}, {...b,cue:subtract.start}];
  });
  const current=currentBeat(s,t);
  if(!active.length){
    const question=QUESTIONS[s.mode];
    const index=s.mode==='car'?(current?.id==='setup-b'?1:0):current?.id==='setup-v'?1:current?.id==='setup-u'?1:current?.id==='setup-s'?1:0;
    return <svg data-region="problem" width={930} height={450} style={{position:'absolute',left:910,top:300}}><rect x={0} y={60} width={930} height={260} rx={10} fill="#b9bcb2"/>{question.map((line,i)=><g key={line}><text data-label="true" data-problem-line="true" x={30} y={125+i*72} fontSize={30} fill={T.ink}>{line}</text>{i===index&&<path d={`M30 ${138+i*72} H${30+line.length*14.5}`} fill="none" stroke={T.accent} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1-between(t,current?.cue??0,(current?.speechEnd??1))}/>}</g>)}</svg>;
  }
  const required=Array.isArray(list?.required)?list.required:[list?.required];
  return <svg data-region="paper" data-visual="paper" width={930} height={770} style={{position:'absolute',left:910,top:200}}>
    <rect data-paper="true" x={0} y={0} width={930} height={770} rx={12} fill={T.paper}/>
    {Array.from({length:9},(_,i)=><line key={i} x1={25} x2={900} y1={112+i*75} y2={112+i*75} stroke={T.grid}/>)}
    {list&&<line x1={236} x2={236} y1={25} y2={720} stroke={T.grid} strokeWidth={2}/>}
    {list?.list?.map((text,i)=>{
      const span=(list.penEnd-list.cue)/5,start=list.cue+i*span,end=start+span-.25;
      const size=Math.min(28,175/prepareLine(text,1).width),y=100+i*104;
      return t>=start?<g key={text}><InkLine text={text} frame={t*30} start={start*30} end={end*30} x={28} y={y} size={size} panel="suvat-list"/>
        {list.known?.includes(i)&&t>=end&&<polyline data-known-tick={i} points={t>=end+.08?`200,${y+17} 208,${y+27} ${208+16*between(t,end+.08,end+.2)},${y+27-23*between(t,end+.08,end+.2)}`:`200,${y+17} ${200+8*between(t,end,end+.08)},${y+17+10*between(t,end,end+.08)}`} fill="none" stroke={T.accent} strokeWidth={4}/>}
        {required.includes(i)&&t>=end&&<LooseRing x={39} y={y+14} rx={25} p={between(t,end,end+.2)}/>}
      </g>:null;
    })}
    {lines.map((b,i)=>{
      const x=list?266:48,width=list?630:830,size=Math.min(31,width/prepareLine(b.ink!,1).width),y=65+i*(lines.length>6?100:108);
      return t>=b.cue?<g key={b.id}><InkLine text={b.ink!} frame={t*30} start={b.cue*30} end={b.penEnd*30} x={x} y={y} size={size}/>{b.result&&t>=b.penEnd&&<LooseRing x={x+prepareLine(b.ink!,size).width/2} y={y+size*.5} rx={prepareLine(b.ink!,size).width/2+12} ry={size*.85} p={between(t,b.penEnd,b.end)}/>}</g>:null;
    })}
  </svg>;
};

const SimpleJourney: React.FC<{s:SuvatScene;t:number;story:boolean}> = ({s,t,story}) => {
  const mode=s.mode==='check'?'train':s.mode;
  const storyEnd=s.beats.find(b=>b.id.startsWith('setup'))?.cue??s.beats[0].penEnd;
  const p=between(t,at(s,s.beats[0].id),storyEnd),bike=mode.startsWith('bike'),train=mode==='train';
  const stop=s.words.find(w=>w.start<storyEnd&&w.word.toLowerCase().startsWith(train?'rest':'stops'))?.start??storyEnd/2;
  const outward=between(t,at(s,s.beats[0].id),stop),returning=between(t,stop,storyEnd);
  const x=story?(bike?110+530*(.25*p+.75*p*p):train?130+510*(2*outward-outward*outward):t<stop?300+340*(2*outward-outward*outward):640-340*returning*returning):mode==='reversal'?300:640;
  const v=resultAt(s,'v',t),a=resultAt(s,'a',t),displacement=resultAt(s,'s',t),time=resultAt(s,'t',t);
  return <Diagram><Road/>
    {!story&&<Vehicle kind={mode} x={bike?110:train?130:300} t={0} moving={false} opacity={.22}/>}
    <Vehicle kind={mode} x={x} t={t} moving={story&&(!train||t<stop)}/>
    {story?<>{[.15,.3,.45,.6,.75].filter(v=>v<p).map(v=><circle key={v} cx={bike?110+530*(.25*v+.75*v*v):train?130+510*(2*v-v*v):300+340*4*v*(1-v)} cy={430} r={4} fill={T.accent} opacity={.35}/>)}{mode==='reversal'&&t>=stop&&<Arrow x={x+20} y={315} dx={-105}/>}</>:<>
      <Figure id="a" x={150} y={68} size={29}>{bike?'a = 4 m s⁻²':train?(a?'a = −7/6 m s⁻²':'a = ? m s⁻²'):'a = −4 m s⁻²'}</Figure>
      <Figure id="u" x={25} y={158} size={29}>{train?'u = 7 m s⁻¹':'u = 10 m s⁻¹'}</Figure><Arrow x={70} y={188} dx={120}/>
      <Figure id="v" x={435} y={158} size={29}>{bike?(v||mode==='bike-time'?'v = 22 m s⁻¹':'v = ? m s⁻¹'):train?'v = 0 m s⁻¹':v?'v = −10 m s⁻¹':'v = ? m s⁻¹'}</Figure>
      {train?<path d="M535 178 v20 M550 178 v20" stroke={T.muted} strokeWidth={4}/>:<Arrow x={mode==='reversal'?650:495} y={188} dx={mode==='reversal'?-120:120} dashed={!v&&mode!=='bike-time'}/>}
      {mode==='reversal'?<><path d="M300 320 Q480 240 640 320 M640 440 Q470 510 300 440" fill="none" stroke={T.accent} strokeWidth={3} markerEnd="url(#suvat-arrow)"/><path d="M300 280 V470" stroke={T.muted} strokeDasharray="5 6"/><text data-label="true" x={240} y={516} fontSize={27} fill={T.muted}>Start / return</text></>:<Bracket x1={bike?110:130} x2={640} y={474}/>}
      <Figure id="s" x={225} y={582} size={31}>{bike?'s = 48 m':train?(displacement?'s = 21 m':'s = ? m'):displacement?'s = 0 m':'s = ? m'}</Figure>
      <Figure id="t" x={235} y={659} size={29}>{bike?(time?'t = 3 s':'t = ? s'):train?'t = 6 s':'t = 5 s'}</Figure>
      {mode==='bike'&&started(s,'square',t)&&!v&&<Figure id="squared" x={230} y={733} size={29}>v² = 484 m² s⁻²</Figure>}
      {train&&started(s,'meaning',t)&&<Figure id="deceleration" x={110} y={744} size={27}>Deceleration = 1.17 m s⁻²</Figure>}
      {mode==='bike-time'&&started(s,'alternative',t)&&<Caption text="Different routes; same time" x={190} y={748}/>}
    </>}
  </Diagram>;
};
const CarJourney: React.FC<{s:SuvatScene;t:number;story:boolean}> = ({s,t,story}) => {
  const p=between(t,at(s,'story'),at(s,'setup-c')),x=90+600*(.25*p+.75*p*p);
  const a=resultAt(s,'a',t),u=resultAt(s,'u',t);
  return <Diagram><Road/><Vehicle kind="car" x={story?x:690} t={t} moving={story}/>
    {[['A',90],['B',497],['C',690]].map(([name,x])=><g key={name}><path d={`M${x} 395 v20`} stroke={T.muted} strokeWidth={3}/><Figure id={String(name)} x={Number(x)-10} y={455} size={28}>{String(name)}</Figure></g>)}
    {!story&&<>
      <Figure id="u" x={30} y={70} size={28}>{u?'u = 4 m s⁻¹':'u = ? m s⁻¹'}</Figure><Arrow x={70} y={100} dx={110} dashed={!u}/>
      <Figure id="a" x={420} y={70} size={28}>{a?'a = 2.5 m s⁻²':'a = ? m s⁻²'}</Figure><Arrow x={470} y={100} dx={110} dashed={!a}/>
      {started(s,'formula',t)&&<Figure id="v" x={30} y={180} size={27}>v not needed</Figure>}
      <Figure id="Bt" x={370} y={195} size={28}>t = 8 s</Figure><path d="M497 218 V275" stroke={T.muted} strokeDasharray="5 6"/>
      <Figure id="Ct" x={590} y={268} size={28}>t = 10 s</Figure>
      <Bracket x1={90} x2={690} y={504}/><Figure id="Cs" x={280} y={548} size={29}>AC = 165 m</Figure>
      <Bracket x1={90} x2={497} y={590}/><Figure id="Bs" x={210} y={633} size={29}>AB = 112 m</Figure>
      {started(s,'simplify',t)&&<Figure id="eq1" x={80} y={708} size={29}>33 = 2u + 10a</Figure>}
      {started(s,'second-simplify',t)&&<Figure id="eq2" x={420} y={768} size={29}>14 = u + 4a</Figure>}
    </>}
  </Diagram>;
};
const Outcomes: React.FC<{s:Scene;t:number;closing?:boolean}> = ({s,t,closing=false}) => <svg data-region="outcomes" width={910} height={600} style={{position:'absolute',left:910,top:270}}>{OUTCOMES.map((text,i)=>started(s,`outcome${i+1}`,t)&&<g key={text}><rect x={0} y={40+i*130} width={660} height={80} rx={8} fill="#b9bcb2"/><text data-label="true" x={closing?70:30} y={93+i*130} fill={T.ink} fontSize={36}>{text}</text>{closing&&<path d={`M20 ${77+i*130} l12 15 l24 -30`} fill="none" stroke={T.accent} strokeWidth={4}/>}</g>)}</svg>;
const Opening: React.FC<{s:Scene;t:number}> = ({s,t}) => <><Diagram><Road/><Vehicle kind="bike" x={370} t={t} moving={false}/><Arrow x={290} y={485} dx={190}/></Diagram>{started(s,'outcomes',t)?<Outcomes s={s} t={t}/>:<svg data-region="syllabus" width={930} height={440} style={{position:'absolute',left:910,top:320}}><rect x={0} y={75} width={900} height={125} rx={10} fill="#b9bcb2"/><text data-label="true" x={30} y={149} fill={T.ink} fontSize={35}>{started(s,'quote2',t)?'with constant acceleration in a straight line':'use appropriate formulae for motion'}</text></svg>}</>;
const Method: React.FC<{s:Scene;t:number}> = ({s,t}) => {
  const contrast=started(s,'contrast',t)&&!started(s,'sign',t),write=started(s,'method',t),b=s.beats.find(b=>b.id==='method')!;
  return <><Diagram><rect x={25} y={110} width={735} height={550} rx={12} fill={T.paper}/><path d="M100 185 V580 H715" fill="none" stroke={T.ink} strokeWidth={3}/><text data-label="true" x={65} y={155} fontSize={28} fill={T.ink}>Velocity / m s⁻¹</text><text data-label="true" x={435} y={624} fontSize={27} fill={T.ink}>Time / s</text>
    <path d={contrast?'M100 500 Q390 495 680 250 L680 580 H100 Z':'M100 500 L680 250 V580 H100 Z'} fill={T.accent} opacity={.16}/>
    <path d={contrast?'M100 500 Q390 495 680 250':'M100 500 L680 250'} stroke={T.accent} strokeWidth={6} fill="none"/>
    {[245,390,535,680].map((x,i)=><path key={x} d={`M${x} 580 V${contrast?500-250*Math.pow((i+1)/4,2):500-250*(i+1)/4}`} stroke={T.muted} strokeDasharray="6 5"/>)}
    <Figure id="u" x={57} y={505} ink>u</Figure><Figure id="v" x={696} y={258} ink>v</Figure><Figure id="a" x={290} y={235} size={28} ink>{contrast?'a varies':'a constant'}</Figure><Figure id="s" x={320} y={536} size={28} ink>s = displacement</Figure><Figure id="t" x={676} y={623} size={28} ink>t</Figure>
    <Caption text={started(s,'sign',t)?'Right is positive →':contrast?'Changing acceleration: one calculation fails':'Constant acceleration only'} x={75} y={748}/>
  </Diagram>{write&&<svg data-region="paper" data-visual="paper" width={930} height={770} style={{position:'absolute',left:910,top:200}}><rect width={930} height={770} rx={12} fill={T.paper}/>{['s','u','v','a','t'].map((letter,i)=>{
    const start=b.cue+(b.penEnd-b.cue)*i/5,end=start+(b.penEnd-b.cue)/5-.08;
    return t>=start?<g key={letter}><InkLine text={letter} frame={t*30} start={start*30} end={end*30} x={75} y={90+i*115} size={39}/><text data-label="true" x={160} y={125+i*115} fontSize={32} fill={T.ink}>{['displacement','initial velocity','final velocity','acceleration','time'][i]}</text></g>:null;
  })}</svg>}</>;
};
const Content: React.FC<{s:Scene;t:number}> = ({s:base,t}) => {
  const s=base as SuvatScene;
  if(s.mode==='opening')return <Opening s={s} t={t}/>;
  if(s.mode==='method')return <Method s={s} t={t}/>;
  const story=s.beats[0].id==='story'&&t<s.beats[1].cue;
  if(s.mode==='car')return <><CarJourney s={s} t={t} story={story}/>{!story&&<Sheet s={s} t={t}/>}</>;
  if(s.mode==='check'&&started(s,'recap',t))return <><SimpleJourney s={s} t={t} story={false}/><Outcomes s={s} t={t} closing/></>;
  return <><SimpleJourney s={s} t={t} story={story}/>{!story&&<Sheet s={s} t={t}/>}</>;
};
export const MechanicsSuvatIn1D: React.FC<MechanicsSuvatIn1DProps> = props => <Lesson scenes={SCENES} content={Content} {...props}/>;
