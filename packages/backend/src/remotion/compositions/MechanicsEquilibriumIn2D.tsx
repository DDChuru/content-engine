/** Cambridge 9709 M4.1: independent horizontal and vertical equilibrium. */
import React from 'react';
import transcript from '../public/transcripts/mechanics/equilibrium-in-2d.json';
import {Lesson, Scene, T, at, between, currentBeat, duration, Figure, Caption} from './mechanics-m42/Presentation';
import {HandwrittenLine, prepareLine} from './Equilibrium2DInk';
const scenes=transcript.scenes as unknown as Scene[];
export interface MechanicsEquilibriumIn2DProps {audioEnabled?:boolean;audit?:boolean}
export const getMechanicsEquilibriumIn2DDuration=(fps:number)=>duration(scenes,fps);
const outcomes=['Check equilibrium in two directions.','Use two balances to find unknown forces.','Explain why balancing one direction is not enough.'];
const Defs=()=> <defs><marker id="eq2-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill={T.text}/></marker><marker id="eq2-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill={T.accent}/></marker></defs>;
const Arrow:React.FC<{x:number;y:number;dx:number;dy:number;active?:boolean;progress?:number}>=({x,y,dx,dy,active=false,progress=1})=><path d={`M${x} ${y} l${dx*progress} ${dy*progress}`} stroke={active?T.accent:T.text} strokeWidth={6} fill="none" markerEnd={`url(#eq2-${active?'active':'arrow'})`}/>;
const Text:React.FC<{x:number;y:number;children:React.ReactNode;size?:number;fill?:string}>=({x,y,children,size=30,fill=T.text})=><text data-label="true" x={x} y={y} fontSize={size} fill={fill}>{children}</text>;
const Particle:React.FC<{x:number;y:number;rich?:boolean}>=({x,y,rich=false})=>rich?<g transform={`translate(${x} ${y})`}><path d="M-38 -31 L24 -31 L39 -17 L39 33 L-24 33 L-38 18Z" stroke={T.text} strokeWidth={3} fill="#737f7a"/><path d="M-38 -31 L-24 -17 L39 -17 M-24 -17 V33 M-4 -31 L10 -17 V33" fill="none" stroke="#bcc5bb" strokeWidth={3}/></g>:<rect x={x-18} y={y-19} width={36} height={38} fill="#8c9691" stroke={T.text} strokeWidth={3}/>;
function ForceDiagram({s,t,recap=false}:{s:Scene;t:number;recap?:boolean}){
 const solvedP=s.mode==='vertical'||s.mode==='recap'||s.mode==='horizontal'&&t>=s.beats.find(b=>b.id==='answer')!.penEnd;
 const solvedQ=s.mode==='recap'||s.mode==='vertical'&&t>=s.beats.find(b=>b.id==='answer')!.penEnd;
 const checked=s.mode==='recap'||s.mode==='vertical'&&t>=at(s,'check');
 const changing=recap&&t>=at(s,'question');
 const down=changing?245:225;
 const horizontal=s.mode==='horizontal',vertical=s.mode==='vertical';
 return <svg data-region="diagram" data-visual="five-force-diagram" width={870} height={790} style={{position:'absolute',left:90,top:190}}><Defs/>
  <Text x={40} y={42} size={30}>{recap?'Only the downward pull changes.':'Particle in equilibrium. Find Q.'}</Text>
  {s.mode==='setup'&&<path d="M40 56 H490" stroke={T.accent} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1-between(t,at(s,'problem'),at(s,'problem')+1.2)}/>}
  <g transform="translate(0 45)">
   <Arrow x={432} y={338} dx={-270} dy={0} active={horizontal}/><Arrow x={432} y={374} dx={-310} dy={0} active={horizontal}/><Arrow x={468} y={355} dx={280} dy={0} active={horizontal}/>
   <Arrow x={450} y={336} dx={0} dy={-215} active={vertical}/><Arrow x={450} y={374} dx={0} dy={down} active={vertical||changing}/><Particle x={450} y={355}/>
   <Figure id="p" x={155} y={306} size={34}>{solvedP?'P N = 12 N':'P N'}</Figure>
   <Figure id="left20" x={160} y={437} size={34}>20 N</Figure>
   <Figure id="right32" x={650} y={320} size={34}>32 N</Figure>
   <Figure id="up2p" x={490} y={148} size={34}>{checked?'2P N = 24 N':'2P N'}</Figure>
   {!changing&&<Figure id="q" x={486} y={627} size={34}>{solvedQ?'Q N = 24 N':'Q N'}</Figure>}
   {changing&&<Text x={490} y={627} size={30}>larger pull</Text>}
   {horizontal&&<><Arrow x={605} y={510} dx={135} dy={0}/><Text x={619} y={563} size={26}>positive</Text></>}
   {vertical&&<><Arrow x={720} y={240} dx={0} dy={-90}/><Text x={675} y={100} size={26}>positive</Text></>}
  </g>
  <Text x={65} y={765} size={24} fill={T.muted}>Arrows separated for clarity; same particle.</Text>
 </svg>;
}
function Paper({s,t}:{s:Scene;t:number}){
 const lines=s.beats.filter(b=>b.ink);
 return <svg data-region="paper" data-visual="working-paper" width={790} height={750} style={{position:'absolute',left:1050,top:210}}>
  <rect width={790} height={750} rx={12} fill={T.paper}/>
  <Text x={40} y={56} size={28} fill={T.ink}>{s.mode==='horizontal'?'Horizontal resultant = 0':'Vertical resultant = 0'}</Text>
  {Array.from({length:8},(_,i)=><line key={i} x1={35} x2={750} y1={137+i*76} y2={137+i*76} stroke={T.grid} strokeWidth={1}/>)}
  {lines.map((b,i)=>t>=b.cue?<g key={b.id}><HandwrittenLine text={b.ink!} frame={t*30} start={b.cue*30} end={b.penEnd*30} x={42} y={102+i*117} size={Math.min(40,700/prepareLine(b.ink!,1).width)}/>{t>=b.penEnd&&b.id==='answer'&&<path d={`M35 ${160+i*117} Q350 ${170+i*117} 385 ${158+i*117}`} stroke={T.accent} strokeWidth={4} fill="none"/>}</g>:null)}
 </svg>;
}
function Opening({s,t}:{s:Scene;t:number}){
 const beat=currentBeat(s,t)?.id??'quote1';
 const idx=beat.startsWith('outcome')?Number(beat.slice(-1))-1:-1;
 return <><svg data-region="diagram" data-visual="equilibrium-motif" width={750} height={650} style={{position:'absolute',left:90,top:210}}><Defs/><Particle x={340} y={340}/><Arrow x={322} y={340} dx={-170} dy={0}/><Arrow x={358} y={340} dx={170} dy={0}/><Arrow x={340} y={321} dx={0} dy={-220}/><Arrow x={340} y={359} dx={0} dy={220}/></svg>
 <svg data-region="caption" width={960} height={620} style={{position:'absolute',left:880,top:270}}>
 {idx<0?<><Text x={25} y={60} size={28} fill={T.muted}>Syllabus 4.1 · Forces and equilibrium</Text><rect x={0} y={118} width={960} height={190} rx={10} fill="#b9bcb2"/>{(beat==='quote2'?['“the vector sum of the forces','acting is zero”']:['“use the principle that, when','a particle is in equilibrium,”']).map((line,i)=><Text key={line} x={30} y={185+i*58} size={36} fill={T.ink}>{line}</Text>)}</>:<>{outcomes.map((o,i)=>i<=idx&&<g key={o}><Text x={30} y={150+i*124} size={32}>{o}</Text><path d={`M0 ${142+i*124} l8 8 l16 -24`} stroke={T.accent} strokeWidth={4} fill="none"/></g>)}</>}
 </svg></>;
}
function Concept({s,t}:{s:Scene;t:number}){
 const unbalanced=t>=at(s,'unbalanced'),balanced=t>=at(s,'vertical'),different=t>=at(s,'different');
 const h=t>=at(s,'horizontal'),v=unbalanced;
 return <svg data-region="diagram" data-visual="two-directions" width={1740} height={790} style={{position:'absolute',left:90,top:210}}><Defs/>
  <Particle x={420} y={370}/>
  {!h&&<><path d="M170 620H770 M190 650V140" stroke={T.muted} strokeWidth={3}/><Text x={560} y={674}>horizontal</Text><Text x={35} y={125}>vertical</Text><path d="M190 593H217V620" stroke={T.accent} strokeWidth={3} fill="none"/></>}
  {h&&<><Arrow x={402} y={370} dx={-200} dy={0} active={!unbalanced||different}/><Arrow x={438} y={370} dx={200} dy={0} active={!unbalanced||different}/><Text x={145} y={325}>equal</Text><Text x={570} y={325}>equal</Text></>}
  {v&&<><Arrow x={420} y={351} dx={0} dy={-245} active={!different}/><Arrow x={420} y={389} dx={0} dy={balanced?245:110} active={!different}/><Text x={465} y={153}>{balanced?'equal':'larger'}</Text><Text x={465} y={balanced?620:508}>{balanced?'equal':'smaller'}</Text></>}
  {unbalanced&&<><Text x={1170} y={235} size={34}>Resultant</Text><Particle x={1260} y={455}/>{!balanced?<><Arrow x={1260} y={436} dx={0} dy={-150} active/><Text x={1310} y={385}>upward</Text></>:<Text x={1320} y={465} size={44}>0</Text>}</>}
  <Caption x={940} y={675} text={different?'Opposite pairs balance independently':balanced?'Both directions balance':unbalanced?'One balanced direction is insufficient':h?'Horizontal forces cancel':undefined}/>
 </svg>;
}
function Story({s,t}:{s:Scene;t:number}){
 const side=between(t,at(s,'sideways'),at(s,'sideways')+1.2),updown=between(t,at(s,'updown'),at(s,'updown')+1.2);
 return <svg data-region="diagram" data-visual="animated-object" width={1740} height={780} style={{position:'absolute',left:90,top:220}}><Defs/>
 <g transform="translate(400 0)"><Particle x={450} y={355} rich/>
 <Arrow x={412} y={338} dx={-280} dy={0} progress={side}/><Arrow x={412} y={373} dx={-315} dy={0} progress={side}/><Arrow x={489} y={355} dx={300} dy={0} progress={side}/>
 <Arrow x={450} y={324} dx={0} dy={-210} progress={updown}/><Arrow x={450} y={388} dx={0} dy={225} progress={updown}/>
 </g>{t>=at(s,'goal')&&<Caption x={650} y={725} text="Find the unknown downward force"/>}
 </svg>;
}
function Setup({s,t}:{s:Scene;t:number}){
 const b=currentBeat(s,t)?.id;
 const cap=b==='same'?'The same P links two forces':b==='units'?'All forces are already in newtons':b==='think'?'Which direction finds P first?':undefined;
 return <><ForceDiagram s={s} t={t}/><svg data-region="question" width={790} height={710} style={{position:'absolute',left:1050,top:250}}>
 <rect x={0} y={90} width={790} height={236} rx={10} fill="#b9bcb2"/>
 {['The particle is in equilibrium.','Forces are shown on the diagram.','Find Q.'].map((line,i)=><Text key={line} x={35} y={152+i*62} size={32} fill={T.ink}>{line}</Text>)}
 {cap&&<Caption x={20} y={490} text={cap}/>}</svg></>;
}
function Recap({s,t}:{s:Scene;t:number}){
 const b=currentBeat(s,t)?.id??'question';const idx=b.startsWith('outcome')?Number(b.slice(-1))-1:-1;
 return <><ForceDiagram s={s} t={t} recap/><svg data-region="caption" width={820} height={730} style={{position:'absolute',left:1010,top:230}}>
 {idx<0?<><Text x={65} y={230} size={34}>{b==='answer'?'No: the vertical resultant is downward.':'Is it still in equilibrium?'}</Text>{b==='answer'&&<Caption x={70} y={360} text="Both directions must balance"/>}</>:outcomes.map((o,i)=>i<=idx&&<g key={o}><Text x={35} y={140+i*145} size={30}>{o}</Text><path d={`M0 ${133+i*145} l9 10 l19 -28`} stroke={T.accent} strokeWidth={4} fill="none"/></g>)}
 </svg></>;
}
const Content:React.FC<{s:Scene;t:number}>=({s,t})=>s.mode==='opening'?<Opening s={s} t={t}/>:s.mode==='concept'?<Concept s={s} t={t}/>:s.mode==='story'?<Story s={s} t={t}/>:s.mode==='setup'?<Setup s={s} t={t}/>:s.mode==='recap'?<Recap s={s} t={t}/>:<><ForceDiagram s={s} t={t}/><Paper s={s} t={t}/></>;
export const MechanicsEquilibriumIn2D:React.FC<MechanicsEquilibriumIn2DProps>=props=><Lesson scenes={scenes} content={Content} {...props}/>;
