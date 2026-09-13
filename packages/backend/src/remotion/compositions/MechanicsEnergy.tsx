import React from 'react';
import transcript from '../public/transcripts/mechanics/energy.json';
import {Lesson,Scene,Figure,Caption,T,at,clamp,currentBeat,duration} from './mechanics-m42/Presentation';
import {HandwrittenLine,prepareLine} from './mechanics-m42/Ink';
import {EnergyShapeAudit} from './energy/ShapeAudit';
const scenes=transcript.scenes as unknown as Scene[];
export type MechanicsEnergyProps={audioEnabled?:boolean;audit?:boolean};
export const getMechanicsEnergyDuration=(fps:number)=>duration(scenes,fps);
const Txt:React.FC<{x:number;y:number;children:React.ReactNode;size?:number;fill?:string}>=({x,y,children,size=28,fill=T.text})=><text data-label="true" x={x} y={y} fill={fill} fontSize={size}>{children}</text>;
const Stage:React.FC<{children:React.ReactNode}>=({children})=><svg data-region="diagram" data-visual="diagram" width={930} height={820} style={{position:'absolute',left:80,top:190}}>{children}</svg>;
const Note:React.FC<{text:string;tick?:boolean}>=({text,tick})=><svg data-region="caption" width={800} height={210} style={{position:'absolute',left:1040,top:450}}>{tick&&<Txt x={24} y={25}>✓</Txt>}<Caption text={text} x={24} y={85}/></svg>;
const Paper:React.FC<{s:Scene;t:number}>=({s,t})=>{const bs=s.beats.filter(b=>b.ink);const step=bs.length>6?96:125;return <svg data-region="paper" data-visual="paper" width={800} height={790} style={{position:'absolute',left:1040,top:200}}><rect width={800} height={790} rx={12} fill={T.paper}/>{Array.from({length:11},(_,i)=><line key={i} x1={30} x2={770} y1={100+i*65} y2={100+i*65} stroke={T.grid}/>)}{bs.map((b,i)=>{const size=Math.min(34,718/prepareLine(b.ink!,1).width),y=44+i*step;return t>=b.cue?<g key={b.id} data-ink-id={b.id}><HandwrittenLine text={b.ink!} x={38} y={y} size={size} frame={t*30} start={b.cue*30} end={b.penEnd*30}/>{b.hold>=2&&t>=b.penEnd&&<path d={`M38 ${y+49} Q360 ${y+58} ${38+prepareLine(b.ink!,size).width} ${y+49}`} fill="none" stroke={T.accent} strokeWidth={3}/>}</g>:null;})}{s.mode==='kinetic'&&currentBeat(s,t)?.caption&&<Caption text={currentBeat(s,t)?.caption} x={35} y={690}/>}</svg>;};
const angle=-Math.atan(165/430),C=Math.cos(angle),S=Math.sin(angle);
/** Particle is at local origin; wheel support line is local y=91. */
const Bike:React.FC<{x:number;y:number;roll?:number;opacity?:number}>=({x,y,roll=0,opacity=1})=><g data-bike-x={x} data-bike-y={y} transform={`translate(${x} ${y}) rotate(${angle*180/Math.PI})`} opacity={opacity}>
 {[[-48,65],[48,65]].map(([wx,wy],i)=><g key={i} transform={`translate(${wx} ${wy}) rotate(${roll})`}><circle r={26} stroke={T.text} strokeWidth={4} fill={T.bg}/><path d="M-24 0 H24 M0 -24 V24" stroke={T.muted} strokeWidth={2}/></g>)}
 <path d="M-48 65 L-19 19 L4 65 Z M-19 19 H26 L48 65 H4 L26 19 L22 7 H37 M-29 18 H-10" fill="none" stroke={T.accent} strokeWidth={5} strokeLinejoin="round"/>
 <path d="M-7 -24 L-25 3 L-19 17 M-25 3 L-7 38 L4 65 M-7 -24 L21 -10 L26 12" fill="none" stroke={T.text} strokeWidth={8} strokeLinecap="round"/>
 <circle cx={0} cy={-43} r={14} fill={T.text}/><path d="M-13 -48 Q0 -65 15 -47" fill="none" stroke={T.accent} strokeWidth={6}/>
 <circle data-particle="true" cx={0} cy={0} r={5} fill={T.accent}/>
 </g>;
const roadY=(x:number)=>390-(x-180)*165/430+91/C;
const Givens:React.FC<{s:Scene;t:number}>=({s,t})=>{const mass=['potential','closing'].includes(s.mode)||s.mode==='mass'&&t>=at(s,'massResult');const gpe=s.mode==='closing'||s.mode==='potential'&&t>=at(s,'gpeResult');const joules=['potential','closing'].includes(s.mode)||s.mode==='mass'&&t>=at(s,'joulesResult');return <g>
 <path d="M35 570 H890" stroke={T.muted}/><Figure id="change" x={45} y={620}>{joules?'ΔKE = 2400 J':'ΔKE = 2.4 kJ'}</Figure><Figure id="gravity" x={500} y={620}>g = 10 m s⁻²</Figure>
 <Figure id="mass" x={45} y={685}>{mass?'Total m = 100 kg':'Total m = ?'}</Figure><Figure id="gpe" x={500} y={685}>{gpe?'ΔGPE = 3000 J':'ΔGPE = ?'}</Figure>
 <Txt x={45} y={744} size={25}>One particle · constant total mass and g</Txt><Txt x={45} y={791} size={25}>Same journey · A to B · gain in KE given</Txt>
 </g>};
const Journey:React.FC<{s:Scene;t:number;simple?:boolean}>=({s,t,simple=false})=>{const story=s.mode==='story';const moving=story&&t<at(s,'both');let q=1;if(story){const end=at(s,'both');q=clamp(t/end);q=(2*q+q*q)/3;}return <g>
 <Txt x={45} y={38} size={29}>{simple?(story?'Cyclist and bicycle climb together':'Motion and height'):'Two snapshots · same cyclist and bicycle'}</Txt>
 <path data-road="true" d={`M70 ${roadY(70)} L730 ${roadY(730)}`} stroke={T.muted} strokeWidth={4} fill="none"/>
 {moving?<Bike x={180+430*q} y={390-165*q} roll={q*1015}/>:story&&t<at(s,'freeze')?<Bike x={610} y={225}/>:<><Bike x={180} y={390} opacity={.7}/><Bike x={610} y={225}/></>}
 {!moving&&<><Txt x={110} y={545}>A</Txt><Txt x={610} y={380}>B</Txt></>}
 {!simple&&<>
 <Figure id="initial" x={55} y={285}>u = 4 m s⁻¹</Figure><Figure id="final" x={535} y={110}>v = 8 m s⁻¹</Figure>
 <path data-datum="true" d="M180 390 H840" stroke={T.muted} strokeWidth={2} strokeDasharray="8 9"/>
 <path data-height="true" d="M820 225 V390 M807 225 H833 M807 390 H833 M610 225 H810" stroke={T.accent} strokeWidth={3} fill="none"/>
 <Figure id="height" x={680} y={345} size={27}>Δh = 3 m</Figure><Figure id="zero" x={545} y={445} size={26}>A datum: h = 0</Figure>
 <Givens s={s} t={t}/>
 </>}
 {simple&&<Caption x={85} y={715} text={story?(t>=at(s,'freeze')?'Two snapshots of the same journey':t>=at(s,'both')?'Snapshot at B · still moving':'Higher position and greater speed'):'Kinetic energy and gravitational potential energy'}/>}
 </g>};
const Contrast:React.FC<{s:Scene;t:number}>=({s,t})=>{const question=t>=at(s,'question'),answer=t>=at(s,'answer');return <g><Txt x={45} y={38} size={29}>{question?'Snapshot: moving above the datum':'A later descent · symbolic contrast'}</Txt><path d="M100 600 H835" stroke={T.muted} strokeDasharray="8 9" strokeWidth={3}/><Txt x={110} y={655}>Chosen datum</Txt><path d={`M340 ${300+130*165/430+91/C} L640 ${300-170*165/430+91/C}`} stroke={T.muted} strokeWidth={4}/><Bike x={470} y={300}/>{question&&<Txt x={520} y={475} size={26}>Speed v &gt; 0</Txt>}{question?<><path d="M730 300 V600 M715 300 H745 M715 600 H745" stroke={T.accent} strokeWidth={4}/><Txt x={745} y={470}>h &gt; 0</Txt><Txt x={90} y={165}>{answer?'Motion → kinetic energy':'Moving'}</Txt>{answer&&<Txt x={90} y={745}>Height → gravitational potential energy</Txt>}</>:<><path d="M230 220 L210 445 l-12 -22 M210 445 l17 -20" fill="none" stroke={T.accent} strokeWidth={5}/><Txt x={85} y={125}>Final height &lt; initial height</Txt><Txt x={85} y={745}>Δh &lt; 0 → ΔGPE &lt; 0</Txt></>}</g>};
const Content:React.FC<{s:Scene;t:number}>=({s,t})=>{const b=currentBeat(s,t);
 if(s.mode==='opening')return <><Stage><Journey s={s} t={t} simple/></Stage>{b?.id.startsWith('outcome')?<Note text={b.caption!}/>:<svg data-region="syllabus" width={800} height={330} style={{position:'absolute',left:1040,top:330}}><rect width={800} height={330} rx={12} fill={T.paper}/><Txt x={35} y={65} size={27} fill={T.ink}>Syllabus 4.5 · excerpt · p.33</Txt><Txt x={35} y={155} size={38} fill={T.ink}>“gravitational potential energy”</Txt></svg>}</>;
 if(s.mode==='story')return <><Stage><Journey s={s} t={t} simple/></Stage><Note text={t>=at(s,'freeze')?'Now state the whole question':'One journey: uphill and speeding up'}/></>;
 if(s.mode==='problem')return <><Stage><Journey s={s} t={t}/></Stage><svg data-region="problem" width={800} height={680} style={{position:'absolute',left:1040,top:245}}><rect width={800} height={680} rx={12} fill={T.paper}/>{['A cyclist and bicycle climb from A to B.','The diagram gives speeds, height and KE increase.','Find total mass and gain in GPE.'].map((line,i)=><g key={line}><Txt x={27} y={125+i*205} size={30} fill={T.ink}>{line}</Txt>{t>=at(s,i===0?'start':i===1?'height':'unknown')&&<path d={`M27 ${145+i*205} H758`} stroke={T.accent} strokeWidth={3}/>}</g>)}</svg></>;
 if(s.mode==='contrast')return <><Stage><Contrast s={s} t={t}/></Stage>{t>=at(s,'question')?<Note text={b?.caption??'Moving above the datum: is GPE zero?'}/>:<Paper s={s} t={t}/>}</>;
 if(s.mode==='closing')return <><Stage><Journey s={s} t={t}/></Stage><Note text={b?.caption??'Calculate kinetic energy changes'} tick/></>;
 return <><Stage><Journey s={s} t={t}/></Stage><Paper s={s} t={t}/></>;
};
export const MechanicsEnergy:React.FC<MechanicsEnergyProps>=props=><><Lesson scenes={scenes} content={Content} {...props}/>{props.audit&&<EnergyShapeAudit/>}</>;
