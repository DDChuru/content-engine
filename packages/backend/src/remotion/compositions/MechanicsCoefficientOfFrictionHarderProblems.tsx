import React from 'react';
import transcript from '../public/transcripts/mechanics/coefficient-of-friction-harder-problems.json';
import {Lesson,Scene,Figure,Caption,T,at,clamp,currentBeat,duration} from './mechanics-m42/Presentation';
import {HandwrittenLine,prepareLine} from './mechanics-m42/Ink';
import {HarderShapeAudit} from './coefficient-of-friction-harder-problems/ShapeAudit';
const scenes=transcript.scenes as unknown as Scene[];
export type MechanicsCoefficientOfFrictionHarderProblemsProps={audioEnabled?:boolean;audit?:boolean};
export const getMechanicsCoefficientOfFrictionHarderProblemsDuration=(fps:number)=>duration(scenes,fps);
const Txt:React.FC<{x:number;y:number;children:React.ReactNode;size?:number;fill?:string}>=({x,y,children,size=28,fill=T.text})=><text data-label="true" x={x} y={y} fill={fill} fontSize={size}>{children}</text>;
const Arrow:React.FC<{id:string;x:number;y:number;dx:number;dy:number;accent?:boolean}>=({id,x,y,dx,dy,accent=false})=><path data-force-arrow={id} d={`M${x} ${y} l${dx} ${dy}`} stroke={accent?T.accent:T.text} strokeWidth={4} fill="none" markerEnd={accent?'url(#hp-green)':'url(#hp-white)'}/>;
const Stage:React.FC<{children:React.ReactNode}>=({children})=><svg data-region="diagram" data-visual="diagram" width={930} height={820} style={{position:'absolute',left:80,top:195}}><defs>{[['white',T.text],['green',T.accent]].map(([id,color])=><marker key={id} id={'hp-'+id} markerWidth={8} markerHeight={8} refX={7} refY={4} orient="auto"><path d="M1 1 L7 4 L1 7" fill="none" stroke={color} strokeWidth={1.5}/></marker>)}</defs>{children}</svg>;
const Note:React.FC<{text:string}>=({text})=><svg data-region="caption" width={800} height={220} style={{position:'absolute',left:1040,top:435}}>{text.startsWith('✓ ')&&<Txt x={24} y={30}>✓</Txt>}<Caption x={24} y={85} text={text.replace(/^✓ /,'')}/></svg>;
const Paper:React.FC<{s:Scene;t:number}>=({s,t})=>{const bs=s.beats.filter(b=>b.ink);return <svg data-region="paper" data-visual="paper" width={800} height={770} style={{position:'absolute',left:1040,top:210}}><rect width={800} height={770} rx={12} fill={T.paper}/>{Array.from({length:10},(_,i)=><line key={i} x1={30} x2={770} y1={105+i*65} y2={105+i*65} stroke={T.grid}/>)}{bs.map((b,i)=>{const size=Math.min(34,718/prepareLine(b.ink!,1).width),y=52+i*132;return t>=b.cue?<g key={b.id} data-ink-id={b.id}><HandwrittenLine text={b.ink!} x={38} y={y} size={size} frame={t*30} start={b.cue*30} end={b.penEnd*30}/>{b.hold>=2&&t>=b.penEnd&&<path d={`M38 ${y+51} Q360 ${y+64} ${38+prepareLine(b.ink!,size).width} ${y+51}`} fill="none" stroke={T.accent} strokeWidth={4}/>}</g>:null;})}</svg>;};
const Givens:React.FC=()=><g><path d="M35 601 H890" stroke={T.muted}/><Figure id="mass" x={45} y={650}>m = 4 kg</Figure><Figure id="mu" x={330} y={650}>μ = 0.25</Figure><Figure id="gravity" x={595} y={650} size={27}>g = 10 m s⁻²</Figure><Figure id="angle" x={45} y={706}>θ = 30°</Figure><Txt x={330} y={706}>P uphill, parallel to slope</Txt><Txt x={45} y={762} size={24}>Fixed rough plane · contact maintained · initially at rest</Txt><Txt x={45} y={807} size={24}>No other applied forces · find both limits of P</Txt></g>;
const C=Math.sqrt(3)/2, R=20*Math.sqrt(3),F=5*Math.sqrt(3);
const Slope:React.FC<{s:Scene;t:number;simple?:boolean}>=({s,t,simple=false})=>{
 const story=s.mode==='story',closing=s.mode==='closing';
 const hi=s.mode==='maximum'||story&&t>=at(s,'upper');
 const zero=closing&&t>=at(s,'zeroResult');
 const interior=closing&&t>=at(s,'interiorResult');
 let p=hi?20+F:20-F;
 // During the story the applied force grows through equilibrium values; friction balances throughout.
 if(story){const q=clamp((t-at(s,'upper'))/3);p=20-F+2*F*q;}
 if(interior)p=20;
 const f=20-p;
 const component=['reaction','limit','minimum','maximum','closing'].includes(s.mode);
 const rKnown=['limit','minimum','maximum','closing'].includes(s.mode)||s.mode==='reaction'&&t>=at(s,'reactionResult');
 const wKnown=['limit','minimum','maximum','closing'].includes(s.mode)||s.mode==='reaction'&&t>=at(s,'weightResult');
 const capKnown=['minimum','maximum','closing'].includes(s.mode)||s.mode==='limit'&&t>=at(s,'capResult');
 const minKnown=['maximum','closing'].includes(s.mode)||s.mode==='minimum'&&t>=at(s,'minResult');
 const maxKnown=closing||s.mode==='maximum'&&t>=at(s,'maxResult');
 const bx=460,by=560-(460-120)/Math.sqrt(3)-45/C;
 return <g data-pull-newtons={p} data-friction-uphill={f}><Txt x={45} y={38} size={29}>{simple?(story?(t>=at(s,'upper')+3?'Upper limit: almost sliding uphill':t>=at(s,'upper')?'Increasing P: friction adjusts':'Lower limit: almost slipping downhill'):'One block · two equilibrium limits'):'Stationary particle · forces balance'}</Txt>
 <path d="M120 560 L865 130 M120 560 H870" stroke={T.muted} strokeWidth={3} fill="none"/>{Array.from({length:20},(_,i)=><path key={i} d={`M${140+i*35} ${550-i*35/C*.5} l-5 17`} stroke={T.muted} strokeWidth={1.5}/>)}
 <path d="M212 560 A92 92 0 0 0 200 514" stroke={T.muted} strokeWidth={2} fill="none"/><Txt x={230} y={540} size={25}>{simple?'Slope':'30°'}</Txt>
 <g data-box-x={bx} data-box-y={by} transform={`translate(${bx} ${by}) rotate(-30)`}><rect x={-60} y={-45} width={120} height={90} rx={4} fill="#31453f" stroke={T.text} strokeWidth={3}/><path d="M-60 -45 L0 -20 L60 -45 M0 -20 V45" stroke={T.muted} strokeWidth={2}/></g>
 <Arrow id="pull" x={bx+60*C} y={by-30} dx={p*4*C} dy={-p*2} accent/><Figure id="pull" x={650} y={175} size={28}>{interior?'P = 20 N':'P uphill'}</Figure>
 {Math.abs(f)>1e-6&&<Arrow id="friction" x={bx-25} y={by+25} dx={f*4*C} dy={-f*2}/>}
 <Txt x={45} y={430} size={26}>{interior?(zero?'Friction not needed':'Determine actual friction'):f>=0?'Friction uphill':'Friction downhill'}</Txt>
 <Arrow id="reaction" x={bx-25} y={by-43} dx={-R*2} dy={-R*4*C}/>
 {!component?<><Arrow id="weight" x={bx} y={by+52} dx={0} dy={160}/><Txt x={490} y={530}>mg</Txt></>:<><Arrow id="weightNormal" x={bx+25} y={by+43} dx={R*2} dy={R*4*C}/><Arrow id="weightParallel" x={bx-52} y={by+30} dx={-20*4*C} dy={20*2}/></>}
 {!simple&&<><Figure id="reaction" x={45} y={115} size={28}>{rKnown?'R = 20√3 N':'R = ?'}</Figure>{component&&<Figure id="weightParallel" x={45} y={482} size={26}>{wKnown?'W∥ = 20 N':'W∥ = mg sinθ'}</Figure>}{component&&<Figure id="weightNormal" x={575} y={505} size={26}>{rKnown?'W⊥ = 20√3 N':'W⊥ = mg cosθ'}</Figure>}<Figure id="cap" x={540} y={587} size={27}>{capKnown?'f max = 5√3 N':'f max = ?'}</Figure><Figure id="min" x={45} y={165} size={27}>{minKnown?'P min ≈ 11.34 N':s.mode==='minimum'&&t>=at(s,'minExactResult')?'P min = (20 − 5√3) N':'P min = ?'}</Figure><Figure id="max" x={520} y={105} size={27}>{maxKnown?'P max ≈ 28.66 N':s.mode==='maximum'&&t>=at(s,'maxExactResult')?'P max = (20 + 5√3) N':'P max = ?'}</Figure>{closing&&<Figure id="actual" x={45} y={587} size={27}>{zero?'f = 0 N':'f = ?'}</Figure>}<Givens/></>}
 {simple&&<Txt x={160} y={700} size={31}>The box remains at rest</Txt>}
 </g>;
};
const Content:React.FC<{s:Scene;t:number}>=({s,t})=>{const b=currentBeat(s,t);
 if(s.mode==='opening')return <><Stage><Slope s={s} t={t} simple/></Stage>{b?.id.startsWith('outcome')?<Note text={b.caption!}/>:<svg data-region="syllabus" width={800} height={370} style={{position:'absolute',left:1040,top:330}}><rect width={800} height={330} rx={12} fill={T.paper}/><Txt x={35} y={65} size={27} fill={T.ink}>Syllabus 4.1 · excerpt · p.31</Txt><Txt x={35} y={155} size={37} fill={T.ink}>“limiting friction and</Txt><Txt x={35} y={220} size={37} fill={T.ink}>limiting equilibrium”</Txt></svg>}</>;
 if(s.mode==='story')return <><Stage><Slope s={s} t={t} simple/></Stage><Note text={t>=at(s,'upper')?'Friction reverses as the force increases':'Less pull: friction helps uphill'}/></>;
 if(s.mode==='problem')return <><Stage><Slope s={s} t={t}/></Stage><svg data-region="problem" width={800} height={660} style={{position:'absolute',left:1040,top:260}}><rect width={800} height={650} rx={12} fill={T.paper}/>{['A particle rests on the fixed rough plane.','P acts uphill along the greatest slope.','Find minimum and maximum P for equilibrium.'].map((line,i)=><g key={line}><Txt x={28} y={120+i*210} size={30} fill={T.ink}>{line}</Txt>{t>=at(s,i===0?'mass':i===1?'pull':'unknown')&&<path d={`M28 ${135+i*210} H745`} stroke={T.accent} strokeWidth={3}/>}</g>)}</svg></>;
 if(s.mode==='closing')return <><Stage><Slope s={s} t={t}/></Stage>{t>=at(s,'formula')&&!b?.caption?<Paper s={s} t={t}/>:b?.caption?<Note text={'✓ '+b.caption}/>:<svg data-region="range" width={800} height={660} style={{position:'absolute',left:1040,top:260}}><Txt x={25} y={80} size={32}>Equilibrium includes both endpoints</Txt><path d="M65 260 H725" stroke={T.muted} strokeWidth={4}/><path d="M130 260 H660" stroke={T.accent} strokeWidth={12}/><circle cx={130} cy={260} r={11} fill={T.accent}/><circle cx={660} cy={260} r={11} fill={T.accent}/><Txt x={35} y={330} size={28}>20 − 5√3</Txt><Txt x={585} y={330} size={28}>20 + 5√3</Txt><Txt x={70} y={405} size={29}>20 − 5√3 ≤ P ≤ 20 + 5√3 (N)</Txt><Caption x={25} y={530} text={t>=at(s,'question')?'P balances weight: what friction is needed?':'Inside: friction stays below its limit'}/></svg>}</>;
 return <><Stage><Slope s={s} t={t}/></Stage><Paper s={s} t={t}/></>;
};
export const MechanicsCoefficientOfFrictionHarderProblems:React.FC<MechanicsCoefficientOfFrictionHarderProblemsProps>=props=><><Lesson scenes={scenes} content={Content} {...props}/>{props.audit&&<HarderShapeAudit/>}</>;
