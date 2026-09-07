/** Source-bounded calculus lesson: two recorded examples, narrated ink and signed graphs. */
import React from 'react';
import transcript from '../public/transcripts/mechanics/using-calculus-in-1d.json';
import {T, Scene, Lesson, Paper, Figure, Caption, Cart, Motif, at, between, currentBeat, duration} from './mechanics-m42/Presentation';
const SCENES=transcript.scenes as unknown as Scene[];
export interface MechanicsUsingCalculusIn1DProps {audioEnabled?:boolean;audit?:boolean}
export const getMechanicsUsingCalculusIn1DDuration=(fps:number)=>duration(SCENES,fps);
const displacement=(t:number)=>t*t*t-6*t*t+9*t;
const velocity=(t:number)=>3*t*t-12*t+9;
const Diagram:React.FC<{children:React.ReactNode}>=({children})=><svg data-region="diagram" data-visual="diagram" width={900} height={800} style={{position:'absolute',left:80,top:190,overflow:'visible'}}>{children}</svg>;
const Givens:React.FC=()=> <g><Figure id="given-poly" x={30} y={40} size={32}>v = 3t² − 12t + 9 m s⁻¹</Figure><Figure id="given-range" x={30} y={100}>0 ≤ t ≤ 3 s</Figure><Figure id="given-origin" x={380} y={100}>s(0) = 0 m</Figure><path d="M650 152 H805 l-16 -10 m16 10 l-16 10" fill="none" stroke={T.muted} strokeWidth={3}/><text data-label="true" x={465} y={162} fill={T.muted} fontSize={25}>Right is positive</text></g>;
const Graph:React.FC<{kind:'s'|'v';x?:number;y?:number;width?:number;height?:number;until?:number;shade?:boolean}>=({kind,x=80,y=250,width=710,height=330,until=3,shade=false})=>{
 const min=kind==='s'?0:-4,max=kind==='s'?5:10;const X=(t:number)=>x+width*t/3;const Y=(v:number)=>y+height*(max-v)/(max-min);const f=kind==='s'?displacement:velocity;
 const curve=(a:number,b:number)=>Array.from({length:81},(_,i)=>{const t=a+(b-a)*i/80;return `${i?'L':'M'}${X(t)} ${Y(f(t))}`;}).join(' ');
 return <g data-graph={kind}><rect x={x-65} y={y-65} width={width+105} height={height+150} rx={12} fill={T.paper}/><text data-label="true" x={x-38} y={y-29} fill={T.ink} fontSize={25}>{kind==='s'?'Displacement / m':'Velocity / m s⁻¹'}</text>
 {[1,2,3].map(t=><g key={t}><line x1={X(t)} x2={X(t)} y1={y} y2={y+height} stroke={T.grid}/><Figure id={`${kind}-time-${t}`} x={X(t)-6} y={y+height+34} size={24} ink>{String(t)}</Figure></g>)}
 {(kind==='s'?[0,4]:[-3,0,9]).map(v=><g key={v}><line x1={x} x2={x+width} y1={Y(v)} y2={Y(v)} stroke={T.grid}/><Figure id={`${kind}-value-${v}`} x={x-45} y={Y(v)+8} size={24} ink>{String(v).replace('-','−')}</Figure></g>)}
 <path d={`M${x} ${y-5} V${y+height} M${x} ${Y(0)} H${x+width+8}`} fill="none" stroke={T.ink} strokeWidth={2.5}/>
 {shade&&kind==='v'&&[[0,1],[1,3]].map(([a,b])=><path key={a} d={`${curve(a,b)} L${X(b)} ${Y(0)} L${X(a)} ${Y(0)} Z`} fill={T.accent} opacity={a===0?.28:.14}/>)}
 <path d={curve(0,until)} fill="none" stroke={T.accent} strokeWidth={5}/><circle cx={X(until)} cy={Y(f(until))} r={7} fill={T.accent}/><text data-label="true" x={x+width/2-38} y={y+height+70} fill={T.ink} fontSize={24}>Time / s</text>
 {kind==='s'&&until>=3&&<path d={`M${X(3)-30} ${Y(0)} H${X(3)+5}`} stroke={T.ink} strokeWidth={3}/>}{kind==='s'&&until>=1&&<path d={`M${X(1)-30} ${Y(4)} H${X(1)+30}`} stroke={T.ink} strokeWidth={3}/>}
 </g>;
};
const Content:React.FC<{s:Scene;t:number}>=({s,t})=>{
 const b=currentBeat(s,t);const done=(id:string)=>t>=s.beats.find(b=>b.id===id)!.penEnd;
 if(s.mode==='opening')return <><Diagram><Motif/></Diagram><svg data-region="card" width={860} height={600} style={{position:'absolute',left:990,top:320}}><rect x={0} y={100} width={850} height={190} rx={10} fill="#b9bcb2"/>{(b?.id==='quote1'?['use differentiation and integration','with respect to time']:b?.id==='quote2'?['to solve simple problems concerning','displacement, velocity and acceleration']:[b?.caption??'Syllabus 4.2']).map((line,i)=><text data-label="true" key={i} x={30} y={170+i*55} fontSize={30} fill={T.ink}>{line}</text>)}</svg></>;
 if(s.mode==='chain')return <><Diagram><Figure id="chain" x={80} y={80} size={39}>s → v → a</Figure><path d="M90 530 H790 M90 530 V260" fill="none" stroke={T.muted} strokeWidth={3}/><path d={t>=at(s,'contrast')?'M90 490 Q430 470 790 290':'M90 490 L790 290'} fill="none" stroke={T.accent} strokeWidth={6}/><text data-label="true" x={130} y={585} fill={T.text} fontSize={29}>Velocity–time</text><Caption text={b?.caption}/></Diagram><Paper s={s} t={t} problem={['Connect displacement, velocity','and acceleration using calculus.']}/></>;
 if(s.mode==='constants'){
 const setup=t>=at(s,'given-a');
 return <><Diagram>{setup&&<><Figure id="given-a" x={30} y={40}>a = 6t + 2 m s⁻²</Figure><Figure id="given-v" x={30} y={100}>v(0) = +4 m s⁻¹</Figure><Figure id="given-s" x={30} y={160}>s(0) = +1 m</Figure><text data-label="true" x={470} y={160} fill={T.muted} fontSize={26}>Right is positive →</text></>}
 <path d="M70 485 H800" stroke={T.muted} strokeWidth={4}/><Cart x={setup?340:110+620*Math.pow(between(t,at(s,'story'),at(s,'given-a')),2)}/>{setup&&<><text data-label="true" x={80} y={535} fill={T.text} fontSize={28}>O</text><text data-label="true" x={310} y={535} fill={T.text} fontSize={28}>+1 m</text></>}
 {done('constant-v')&&<Figure id="result-v" x={30} y={620}>v = 3t² + 2t + 4 m s⁻¹</Figure>}{done('constant-s')&&<Figure id="result-s" x={30} y={675}>s = t³ + t² + 4t + 1 m</Figure>}{t>=at(s,'what-if')&&<Figure id="hypothetical" x={30} y={750}>If s(0) = −1 m: D = −1</Figure>}
 </Diagram>{setup&&<Paper s={s} t={t} problem={['Find v(t) and s(t).','Use both initial conditions.','Right of O means positive s.']}/>}</>;
 }
 if(s.mode==='story'){
 const tau=t<at(s,'turn')?between(t,at(s,'outward'),at(s,'turn')):1+2*between(t,at(s,'turn'),s.beats.find(b=>b.id==='return')!.speechEnd??s.duration);
 return <Diagram><path d="M80 485 H800" stroke={T.muted} strokeWidth={4}/><Cart x={100+displacement(Math.min(3,tau))*160}/><text data-label="true" x={80} y={555} fill={T.text} fontSize={33}>Origin</text></Diagram>;
 }
 if(s.mode==='rest')return <><Diagram><Givens/><path d="M75 455 H805" stroke={T.muted} strokeWidth={4}/><Cart x={450} y={405}/>{t>=at(s,'rest-formula')&&<Figure id="rest-condition" x={40} y={500}>Rest: v = 0</Figure>}<Figure id="unknowns" x={40} y={570}>First rest: t = ?     a(t) = ?</Figure>{t>=at(s,'roots')&&<Figure id="roots" x={40} y={640}>Rest: t = 1 s, 3 s</Figure>}{t>=at(s,'accel-result')&&<Figure id="accel" x={40} y={710}>a = 6t − 12 m s⁻²</Figure>}</Diagram><Paper s={s} t={t} problem={['Find the first instantaneous rest.','Find acceleration in terms of t.','Use the model shown on the diagram.']}/></>;
 if(s.mode==='displacement'){
 const graph=t>=at(s,'graph-out');const tau=t<at(s,'graph-back')?between(t,at(s,'graph-out'),at(s,'graph-back')):1+2*between(t,at(s,'graph-back'),s.beats.at(-1)!.penEnd);
 return <><Diagram><Givens/>{graph?<Graph kind="s" until={tau}/>:<><path d="M75 450 H800" stroke={T.muted} strokeWidth={4}/><Cart x={300} y={400}/><Figure id="s-unknown" x={40} y={570}>s(t) = ?</Figure></>}{done('constant')&&<Figure id="s-answer" x={30} y={730}>s = t³ − 6t² + 9t m</Figure>}</Diagram><Paper s={s} t={t} problem={['Find displacement s(t).','Sketch the displacement–time graph.','Use s(0) = 0.']}/></>;
 }
 if(s.mode==='distance')return <><Diagram><Givens/><Figure id="s-model" x={30} y={205} size={27}>s(t) = t³ − 6t² + 9t m</Figure><Graph kind="s" x={60} y={280} width={310} height={270}/><Graph kind="v" x={520} y={280} width={310} height={270} until={3*between(t,at(s,'velocity'),s.beats[0].penEnd)} shade={t>=at(s,'area-formula')}/><Figure id="leg-out" x={30} y={710} size={25}>{t>=at(s,'out-result')?'0→1 s: Δs₁ = +4 m':'Outward leg: 0→1 s'}</Figure><Figure id="leg-back" x={460} y={710} size={25}>{t>=at(s,'back-result')?'1→3 s: Δs₂ = −4 m':'Return leg: 1→3 s'}</Figure>{done('back-result')&&<Figure id="areas" x={30} y={770} size={26}>Legs: +4 m, −4 m; time = 3 s</Figure>}</Diagram><Paper s={s} t={t} problem={['Find distance in the first 3 seconds.','Then find average speed.','Count both legs of the journey.']}/></>;
 if(s.mode==='maximum')return <><Diagram><Givens/><Graph kind="v"/><Figure id="candidate-mid" x={30} y={730}>a(2) = 0; v(2) = −3 m s⁻¹</Figure></Diagram><svg data-region="card" width={790} height={700} style={{position:'absolute',left:1050,top:260}}><Figure id="candidates" x={25} y={100} size={28}>{t>=at(s,'answer')?'|v(0)| = 9; |v(2)| = 3; |v(3)| = 0':'Compare |v| at t = 0, 2, 3 s'}</Figure>{t>=at(s,'answer')&&<Figure id="maximum" x={25} y={200}>Maximum speed = 9 m s⁻¹</Figure>}<Caption text={b?.caption} x={25} y={390}/></svg></>;
 return null;
};
export const MechanicsUsingCalculusIn1D:React.FC<MechanicsUsingCalculusIn1DProps>=(props)=><Lesson scenes={SCENES} content={Content} {...props}/>;
