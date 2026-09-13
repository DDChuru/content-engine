import React from 'react';
import transcript from '../public/transcripts/mechanics/energy-principles.json';
import {Lesson,Scene,Figure,Caption,T,at,clamp,currentBeat,duration} from './mechanics-m42/Presentation';
import {HandwrittenLine,prepareLine} from './mechanics-m42/Ink';
import {EnergyPrinciplesShapeAudit} from './energy-principles/ShapeAudit';
const scenes=transcript.scenes as unknown as Scene[];
export type MechanicsEnergyPrinciplesProps={audioEnabled?:boolean;audit?:boolean};
export const getMechanicsEnergyPrinciplesDuration=(fps:number)=>duration(scenes,fps);
const Txt:React.FC<{x:number;y:number;children:React.ReactNode;size?:number;fill?:string}>=({x,y,children,size=28,fill=T.text})=><text data-label="true" x={x} y={y} fill={fill} fontSize={size}>{children}</text>;
const Stage:React.FC<{children:React.ReactNode}>=({children})=><svg data-region="diagram" data-visual="diagram" width={930} height={820} style={{position:'absolute',left:80,top:190}}>{children}</svg>;
const Note:React.FC<{text:string;tick?:boolean}>=({text,tick})=><svg data-region="caption" width={800} height={220} style={{position:'absolute',left:1040,top:440}}>{tick&&<Txt x={24} y={25}>✓</Txt>}<Caption text={text} x={24} y={85}/></svg>;
const Paper:React.FC<{s:Scene;t:number}>=({s,t})=>{const bs=s.beats.filter(b=>b.ink);const step=bs.length>6?98:125;return <svg data-region="paper" data-visual="paper" width={800} height={790} style={{position:'absolute',left:1040,top:200}}><rect width={800} height={790} rx={12} fill={T.paper}/>{Array.from({length:11},(_,i)=><line key={i} x1={30} x2={770} y1={100+i*65} y2={100+i*65} stroke={T.grid}/>)}{bs.map((b,i)=>{const size=Math.min(34,718/prepareLine(b.ink!,1).width),y=44+i*step;return t>=b.cue?<g key={b.id} data-ink-id={b.id}><HandwrittenLine text={b.ink!} x={38} y={y} size={size} frame={t*30} start={b.cue*30} end={b.penEnd*30}/>{b.hold>=2&&t>=b.penEnd&&<path d={`M38 ${y+49} Q360 ${y+58} ${38+prepareLine(b.ink!,size).width} ${y+49}`} fill="none" stroke={T.accent} strokeWidth={3}/>}</g>:null;})}</svg>;};
export const roadY=(x:number)=>220+(x-160)*Math.tan(Math.PI/6);
const BY=roadY(640),C=Math.cos(Math.PI/6),S=.5;
const Car:React.FC<{x:number;y:number;roll?:number;opacity?:number}>=({x,y,roll=0,opacity=1})=><g data-car-x={x} data-car-y={y} transform={`translate(${x} ${y}) rotate(30)`} opacity={opacity}>
 <path d="M-64 -24 L-55 -48 L-28 -50 L-10 -72 H29 L48 -49 H62 Q71 -48 72 -27 V-19 H-64 Z" fill={T.accent} stroke={T.text} strokeWidth={2}/><path d="M-16 -52 L-3 -66 H25 L38 -52 Z" fill={T.bg}/>
 {[-42,43].map(wx=><g key={wx} transform={`translate(${wx} -14) rotate(${roll})`}><circle r={12.5} fill={T.bg} stroke={T.text} strokeWidth={3}/><path d="M-10 0 H10 M0 -10 V10" stroke={T.muted} strokeWidth={2}/></g>)}
 </g>;
const Arrow:React.FC<{x:number;y:number;dx:number;dy:number;id?:string}>=({x,y,dx,dy,id})=>{const L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;return <path data-force-arrow={id} d={`M${x} ${y} l${dx} ${dy} m${-ux*17-uy*8} ${-uy*17+ux*8} L${x+dx} ${y+dy} l${-ux*17+uy*8} ${-uy*17-ux*8}`} stroke={T.accent} strokeWidth={4} fill="none"/>;};
function result(s:Scene,t:number,id:string){return s.cues[id]!==undefined&&t>=at(s,id);}
const Givens:React.FC<{s:Scene;t:number}>=({s,t})=>{const later=['kinetic','balance','closing'].includes(s.mode),energy=['balance','closing'].includes(s.mode);return <g>
 <path d="M25 556 H902" stroke={T.muted}/><Figure id="mass" x={35} y={595}>m = 800 kg</Figure><Figure id="gravity" x={480} y={595}>g = 10 m s⁻²</Figure>
 <Figure id="resistance" x={35} y={639}>{s.mode==='closing'||result(s,t,'forceResult')?'F = 2800 N uphill':'F = ? uphill · constant'}</Figure><Txt x={480} y={639} size={27}>No driving force · particle</Txt>
 <Figure id="initialKE" x={35} y={687} size={27}>{energy||result(s,t,'initialKEResult')?'KE at A = 40000 J':'KE at A = ?'}</Figure><Figure id="initialGPE" x={480} y={687} size={27}>{later||result(s,t,'initialGPEResult')?'GPE at A = 400000 J':'GPE at A = ?'}</Figure>
 <Figure id="finalKE" x={35} y={735} size={27}>{energy||result(s,t,'finalKEResult')?'KE at B = 160000 J':'KE at B = ?'}</Figure><Figure id="finalGPE" x={480} y={735} size={27}>{later||result(s,t,'finalGPEResult')?'GPE at B = 0 J':'GPE at B = ?'}</Figure>
 {s.mode==='closing'||result(s,t,'totalResult')?<Figure id="total" x={35} y={790} size={27}>Total at A = 440000 J</Figure>:<Txt x={35} y={790} size={25}>Same car · A to B · constant mass and g</Txt>}
 </g>};
const Journey:React.FC<{s:Scene;t:number;simple?:boolean}>=({s,t,simple=false})=>{const story=s.mode==='story';const moving=story&&t<at(s,'snapshot');let q=1;if(moving){const z=clamp(t/at(s,'snapshot'));q=(2*z+z*z)/3;}const height=['kinetic','balance','closing'].includes(s.mode)||result(s,t,'heightResult');return <g>
 <Txt x={35} y={38} size={28}>{simple?(moving?'Coasting downhill · speed increasing':'Snapshot at B · still moving'):'Two snapshots · same downhill journey'}</Txt>
 <path data-road="true" d={`M60 ${roadY(60)} L710 ${roadY(710)}`} stroke={T.muted} strokeWidth={4}/>
 {moving?<Car x={160+480*q} y={roadY(160+480*q)} roll={q*480/C/14*180/Math.PI}/>:simple?<Car x={640} y={BY}/>:<><Car x={160} y={220} opacity={.68}/><Car x={640} y={BY}/></>}
 <path d={`M640 ${BY+9} V${BY+38}`} stroke={T.text} strokeWidth={4}/><Txt x={610} y={BY+50}>B</Txt>
 {!simple&&<>
 <Txt x={80} y={235}>A</Txt><Figure id="initial" x={35} y={110}>u = 10 m s⁻¹</Figure><Figure id="final" x={480} y={280}>v = 20 m s⁻¹</Figure>
 <path data-distance="true" d={`M235 166 L650 ${166+415*Math.tan(Math.PI/6)}`} stroke={T.accent} strokeWidth={2} strokeDasharray="7 7"/><Figure id="distance" x={350} y={185}>d = 100 m</Figure>
 <path d={`M160 220 H846 V${BY} H160 Z`} stroke={T.muted} strokeWidth={2} strokeDasharray="6 7" fill="none"/>
 <path data-height="true" d={`M846 220 V${BY} M835 220 H856 M835 ${BY} H856`} stroke={T.accent} strokeWidth={3} fill="none"/>
 <Figure id="height" x={710} y={285} size={27}>{height?'h = 50 m':'h = ?'}</Figure><Figure id="zero" x={35} y={533} size={26}>B datum: h = 0</Figure>
 <path d={`M${640-95} ${BY} A95 95 0 0 1 ${640-95*C} ${BY-95*S}`} stroke={T.accent} strokeWidth={3} fill="none"/><Figure id="angle" x={460} y={480} size={27}>30°</Figure>
 <Arrow x={684} y={424} dx={-104} dy={-60} id="resistance"/><Txt x={710} y={440} size={28}>F</Txt>
 <Givens s={s} t={t}/>
 </>}
 {simple&&<Caption x={125} y={700} text={story?'No driving force; resistance opposes motion':'Motion and height contribute mechanical energy'}/>}
 </g>};
const Bars:React.FC<{s:Scene;t:number}>=({s,t})=><g>
 <Txt x={35} y={40} size={29}>One scale · derived energies in joules</Txt>
 <Txt x={35} y={125}>At A</Txt><rect data-energy-bar="initialKE" data-joules="40000" x={35} y={155} width={70} height={65} fill={T.accent}/><rect data-energy-bar="initialGPE" data-joules="400000" x={105} y={155} width={700} height={65} fill={T.muted}/><Figure id="total" x={390} y={125}>440000 J</Figure>
 <Txt x={35} y={278} size={26}>KE: 40000 J</Txt><Txt x={375} y={278} size={26}>GPE: 400000 J</Txt>
 <Txt x={35} y={360}>At B</Txt><rect data-energy-bar="finalKE" data-joules="160000" x={35} y={390} width={280} height={65} fill={T.accent}/><Figure id="finalKE" x={390} y={360}>160000 J</Figure>
 {t>=at(s,'loss')&&<><rect data-energy-bar="transferred" data-joules="280000" x={315} y={390} width={490} height={65} fill="none" stroke={T.muted} strokeWidth={3}/><Txt x={405} y={430} size={25}>Transferred to other forms</Txt></>}
 <Txt x={35} y={514} size={26}>Final GPE = 0 at the B datum</Txt><Txt x={35} y={635}>Total energy remains accounted for.</Txt><Caption x={50} y={735} text="Energy transferred, never destroyed"/>
 </g>;
const Curve:React.FC<{s:Scene;t:number}>=({s,t})=>{const question=t>=at(s,'question');if(question)return <Journey s={{...s,mode:'closing'}} t={t}/>;return <g>
 <Txt x={35} y={40} size={28}>Snapshot · smooth, stationary curved track</Txt>
 <path data-curve="true" d="M90 215 C220 215 260 555 450 555 S670 390 820 390" fill="none" stroke={T.muted} strokeWidth={5}/>
 <circle cx={248.75} cy={385} r={12} fill={T.accent}/><Arrow x={248.75} y={385} dx={81.130798} dy={-58.461899} id="normal"/><Txt x={345} y={315} size={26}>Normal reaction</Txt><Arrow x={259} y={399.2} dx={58.461899} dy={81.130798} id="motion"/><Txt x={335} y={470} size={26}>Motion</Txt>
 <path d="M90 555 H850 M90 215 V555 M820 390 V555" stroke={T.muted} strokeWidth={2} strokeDasharray="8 8" fill="none"/>
 <Txt x={35} y={175}>A</Txt><Txt x={815} y={350}>B</Txt><Txt x={40} y={395} size={26}>h_A</Txt><Txt x={838} y={485} size={26}>h_B</Txt>
 <Txt x={35} y={645}>No resistance · no driving force</Txt><Caption x={50} y={735} text={t>=at(s,'constant')?'KE + GPE stays constant':'Reaction is perpendicular to motion'}/>
 </g>};
const Content:React.FC<{s:Scene;t:number}>=({s,t})=>{const b=currentBeat(s,t);
 if(s.mode==='opening')return <><Stage><Journey s={s} t={t} simple/></Stage>{b?.id.startsWith('outcome')?<Note text={b.caption!}/>:<svg data-region="syllabus" width={800} height={330} style={{position:'absolute',left:1040,top:330}}><rect width={800} height={330} rx={12} fill={T.paper}/><Txt x={35} y={65} size={27} fill={T.ink}>Syllabus 4.5 · excerpt · p.33</Txt><Txt x={35} y={155} size={40} fill={T.ink}>“conservation of energy”</Txt></svg>}</>;
 if(s.mode==='story')return <><Stage><Journey s={s} t={t} simple/></Stage><Note text={t>=at(s,'question')?'Now state the whole question':'One coast: lower position, greater speed'}/></>;
 if(s.mode==='problem')return <><Stage><Journey s={s} t={t}/></Stage><svg data-region="problem" width={800} height={660} style={{position:'absolute',left:1040,top:240}}><rect width={800} height={660} rx={12} fill={T.paper}/>{['A car coasts downhill from A to B.','Use every given and condition shown.','Find the constant resistance F using energy.'].map((line,i)=><g key={line}><Txt x={27} y={115+i*205} size={30} fill={T.ink}>{line}</Txt>{t>=at(s,i===0?'mass':i===1?'distance':'unknown')&&<path d={`M27 ${135+i*205} H760`} stroke={T.accent} strokeWidth={3}/>}</g>)}</svg></>;
 if(s.mode==='balance'&&t>=at(s,'bars'))return <><Stage><Journey s={s} t={t}/></Stage><svg data-region="bars" data-visual="paper" viewBox="0 0 930 820" width={800} height={790} style={{position:"absolute",left:1040,top:200}}><Bars s={s} t={t}/></svg></>;
 if(s.mode==='conservation')return <><Stage><Curve s={s} t={t}/></Stage>{t>=at(s,'question')?<Note text={b?.caption??'No engine: is mechanical energy conserved?'}/>:<Paper s={s} t={t}/>}</>;
 if(s.mode==='closing')return <><Stage><Journey s={s} t={t}/></Stage><Note text={b?.caption??'Build a signed energy balance'} tick/></>;
 return <><Stage><Journey s={s} t={t}/></Stage><Paper s={s} t={t}/></>;
};
export const MechanicsEnergyPrinciples:React.FC<MechanicsEnergyPrinciplesProps>=props=><><Lesson scenes={scenes} content={Content} {...props}/>{props.audit&&<EnergyPrinciplesShapeAudit/>}</>;
