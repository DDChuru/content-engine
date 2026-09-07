/** Constant-acceleration graph derivations, within the recorded M4.2 lesson. */
import React from 'react';
import transcript from '../public/transcripts/mechanics/deriving-suvat.json';
import {T,Scene,Lesson,Paper,Figure,Caption,Cart,Motif,at,between,currentBeat,duration} from './mechanics-m42/Presentation';
const SCENES=transcript.scenes as unknown as Scene[];
export interface MechanicsDerivingSuvatProps {audioEnabled?:boolean;audit?:boolean}
export const getMechanicsDerivingSuvatDuration=(fps:number)=>duration(SCENES,fps);
const Diagram:React.FC<{children:React.ReactNode}>=({children})=><svg data-region="diagram" data-visual="diagram" width={900} height={800} style={{position:'absolute',left:80,top:190}}>{children}</svg>;
const Graph:React.FC<{s:Scene;t:number}>=({s,t})=>{
 const area=s.mode==='area'&&t>=at(s,'area')||['remove-v','remove-u','remove-t','choice'].includes(s.mode);
 const negative=s.mode==='area'&&t>=at(s,'negative-graph');
 const baseline=negative?470:610,uy=negative?325:450,vy=negative?615:245;
 const p=s.mode==='gradient'?between(t,at(s,'setup'),s.beats[0].penEnd):1;
 const x=120+610*p,y=uy+(vy-uy)*p;
 const guides=s.mode==='gradient'&&t>=at(s,'formula');
 return <g data-graph="velocity"><rect x={25} y={190} width={835} height={535} rx={12} fill={T.paper}/>
 <text data-label="true" x={55} y={225} fill={T.ink} fontSize={27}>Velocity / m s⁻¹</text>
 {[120,272,424,576,730].map(x=><line key={x} x1={x} x2={x} y1={245} y2={645} stroke={T.grid}/>)}
 {[280,390,500,610].map(y=><line key={y} x1={120} x2={730} y1={y} y2={y} stroke={T.grid}/>)}
 <path d={`M120 245 V660 M120 ${baseline} H795`} fill="none" stroke={T.ink} strokeWidth={3}/>
 {area&&!negative&&<path d={`M120 ${baseline} V${uy} L730 ${vy} V${baseline} Z`} fill={T.accent} opacity={.25}/>}
 {area&&negative&&<><path d={`M120 ${baseline} V${uy} L425 ${baseline} Z`} fill={T.accent} opacity={.28}/><path d={`M425 ${baseline} L730 ${vy} V${baseline} Z`} fill={T.accent} opacity={.14}/></>}
 {area&&<path d={`M120 ${baseline} V${uy} M730 ${baseline} V${vy}`} stroke={T.accent} strokeWidth={5}/>}
 <path d={`M120 ${uy} L${x} ${y}`} stroke={T.accent} fill="none" strokeWidth={6}/><circle cx={x} cy={y} r={8} fill={T.accent}/>
 <Figure id="initial" x={75} y={uy+8} size={32} ink>u</Figure><Figure id="final" x={760} y={vy+8} size={32} ink>v</Figure><Figure id="time" x={718} y={695} size={30} ink>t</Figure><Figure id="zero-time" x={105} y={695} size={28} ink>0</Figure><text data-label="true" x={410} y={695} fill={T.ink} fontSize={25}>Time / s</text>
 <line x1={730} x2={730} y1={vy} y2={baseline} stroke={T.accent} strokeWidth={2} strokeDasharray="7 6"/>
 {guides&&<><path d={`M120 ${uy} H730 V${vy}`} fill="none" stroke={T.ink} strokeWidth={3} strokeDasharray="8 6"/><Figure id="rise" x={565} y={360} size={27} ink>v − u</Figure><Figure id="run" x={410} y={uy+37} size={27} ink>t</Figure></>}
 {<Figure id="area" x={280} y={negative?650:550} size={30} ink>{negative?'s = signed area':'s metres'}</Figure>}
 </g>;
};
const Givens:React.FC<{s:Scene;t:number}>=({s,t})=><g><Figure id="acceleration" x={30} y={40} size={29}>a constant / m s⁻²; right is positive →</Figure><Figure id="endpoints" x={30} y={98} size={28}>u → v over t seconds; s = displacement</Figure>{s.mode==='gradient'?<Figure id="rise-run" x={30} y={155} size={28}>{t>=at(s,'formula')?'Rise = v − u; run = t > 0':'Find v in terms of u, a and t'}</Figure>:s.mode==='remove-t'?<Figure id="condition" x={30} y={155} size={28}>Division assumes a ≠ 0</Figure>:<Figure id="known-formulas" x={30} y={155} size={28}>{s.mode==='area'&&t<at(s,'result')?'v = u + at':'v = u + at; s = ½(u + v)t'}</Figure>}{s.mode==='remove-t'&&<Figure id="known-formulas" x={30} y={752} size={26}>v = u + at; s = ½(u + v)t</Figure>}</g>;
const questions:Record<string,string[]>={gradient:['Constant a; start at u; reach v after t.','Derive the velocity equation.','Use the gradient of the graph.'],area:['Find displacement over this interval.','Use the same u, v and t.','Identify the parallel sides.'],'remove-v':['Derive a formula without v.','Use the gradient and area results.'],'remove-u':['Derive a formula without u.','Use the gradient and area results.'],'remove-t':['Derive a formula without t.','Assume a ≠ 0 for division.','Check a = 0 separately.']};
const Content:React.FC<{s:Scene;t:number}>=({s,t})=>{
 const b=currentBeat(s,t);
 if(s.mode==='opening')return <><Diagram><Motif/></Diagram><svg data-region="card" width={850} height={530} style={{position:'absolute',left:1000,top:330}}><rect x={0} y={100} width={840} height={180} rx={10} fill="#b9bcb2"/>{(b?.id==='quote2'?['with constant acceleration','in a straight line']:[b?.caption??'Syllabus 4.2']).map((line,i)=><text data-label="true" key={line} x={30} y={173+i*52} fill={T.ink} fontSize={32}>{line}</text>)}</svg></>;
 if(s.mode==='story'){
 const q=between(t,at(s,'story'),at(s,'contrast'));const x=100+640*(.2*q+.8*q*q);
 const contrast=t>=at(s,'contrast');
 return <Diagram><path d="M70 485 H820" fill="none" stroke={T.muted} strokeWidth={4}/><Cart x={contrast?740+70*(1-Math.pow(1-between(t,at(s,'contrast'),s.beats.at(-1)!.penEnd),3)):x}/>{!contrast&&[0,.2,.4,.6,.8].filter(v=>v<q).map(v=><circle key={v} cx={100+640*(.2*v+.8*v*v)} cy={485} r={5} fill={T.accent} opacity={.45}/>)}<Caption text={b?.caption}/></Diagram>;
 }
 if(s.mode==='choice'){
 const rows=[['missing-s','omit-s','v = u + at    (no s)'],['missing-a','omit-a','s = ½(u + v)t    (no a)'],['missing-v','omit-v','s = ut + ½at²    (no v)'],['missing-u','omit-u','s = vt − ½at²    (no u)'],['answer','omit-t','v² = u² + 2as    (no t)']];
 return <><Diagram><Givens s={s} t={t}/><Graph s={s} t={t}/></Diagram><svg data-region="equations" width={790} height={800} style={{position:'absolute',left:1050,top:210}}>{rows.map(([cue,id,text],i)=>t>=at(s,cue)&&<Figure key={id} id={id} x={25} y={90+i*95} size={32}>{text}</Figure>)}<Caption text={b?.caption} x={25} y={675}/></svg></>;
 }
 return <><Diagram><Givens s={s} t={t}/><Graph s={s} t={t}/>{s.mode==='remove-t'&&t>=at(s,'zero')?<Figure id="zero-case" x={30} y={795} size={24}>If a = 0: v = u, so v² = u²</Figure>:<Caption text={b?.caption} y={780}/>}</Diagram><Paper s={s} t={t} problem={questions[s.mode]}/></>;
};
export const MechanicsDerivingSuvat:React.FC<MechanicsDerivingSuvatProps>=(props)=><Lesson scenes={SCENES} content={Content} {...props}/>;
