import React from 'react';
import transcript from '../public/transcripts/mechanics/connected-bodies-ropes-and-tow-bars.json';
import {Lesson,Scene,Figure,Caption,T,at,clamp,currentBeat,duration} from './mechanics-m42/Presentation';
import {HandwrittenLine,prepareLine} from './mechanics-m42/Ink';
const scenes=transcript.scenes as Scene[];
export type MechanicsConnectedBodiesRopesAndTowBarsProps={audioEnabled?:boolean;audit?:boolean};
export const getMechanicsConnectedBodiesRopesAndTowBarsDuration=(fps:number)=>duration(scenes,fps);
const Txt:React.FC<{x:number;y:number;children:React.ReactNode;size?:number;fill?:string}>=({x,y,children,size=28,fill=T.text})=><text data-label="true" x={x} y={y} fill={fill} fontSize={size}>{children}</text>;
const Arrow:React.FC<{x:number;y:number;dx:number;dy?:number;accent?:boolean}>=({x,y,dx,dy=0,accent=false})=><path data-shape="arrow" d={`M${x} ${y} l${dx} ${dy}`} stroke={accent?T.accent:T.text} strokeWidth={4} fill="none" markerEnd={accent?'url(#tow-green)':'url(#tow-white)'}/>;
const Stage:React.FC<{children:React.ReactNode}>=({children})=><svg data-region="diagram" data-visual="diagram" width={930} height={790} style={{position:'absolute',left:85,top:210}}><defs>{['white','green'].map(c=><marker key={c} id={`tow-${c}`} markerWidth={9} markerHeight={9} refX={8} refY={4} orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke={c==='green'?T.accent:T.text} strokeWidth={1.5}/></marker>)}</defs>{children}</svg>;
const Vehicle:React.FC<{x:number;y:number;trailer?:boolean;scale?:number;wheel?:number}>=({x,y,trailer=false,scale=1,wheel=0})=><g data-shape="vehicle" transform={`translate(${x} ${y}) scale(${scale})`}>{trailer?<><rect x={-90} y={-90} width={180} height={120} rx={12} fill="#687c76" stroke={T.text} strokeWidth={3}/><rect x={-70} y={-72} width={67} height={44} fill="#c4d3cd"/><path d="M90 20 H120" stroke={T.text} strokeWidth={5}/></>:<><path d="M-130 28 L-125 -22 L-67 -34 L-35 -77 H59 L106 -31 L143 -11 L150 28 Z" fill="#687c76" stroke={T.text} strokeWidth={3}/><path d="M-52 -37 L-25 -66 H10 V-37 Z M23 -66 H52 L87 -37 H23 Z" fill="#c4d3cd"/></>}{(trailer?[-35]:[-83,93]).map(z=><g key={z}><circle cx={z} cy={30} r={27} fill="#151b1e" stroke={T.text} strokeWidth={3}/><path d={`M${z-18*Math.cos(wheel)} ${30-18*Math.sin(wheel)} L${z+18*Math.cos(wheel)} ${30+18*Math.sin(wheel)}`} stroke={T.muted} strokeWidth={3}/></g>)}</g>;
const Road:React.FC<{y?:number;travel?:number}>=({y=445,travel})=><g><path d={`M25 ${y} H890`} stroke={T.muted} strokeWidth={4}/>{travel===undefined?Array.from({length:12},(_,i)=><path key={i} d={`M${55+i*72} ${y+10} l-20 18`} stroke="#596862" strokeWidth={3}/>):<><defs><clipPath id="road-clip"><rect x={25} y={y+5} width={865} height={40}/></clipPath></defs><g clipPath="url(#road-clip)">{Array.from({length:15},(_,i)=><path key={i} data-road-motion="true" d={`M${i*72-(travel%72)} ${y+24} h32`} stroke="#81938c" strokeWidth={4}/>)}</g></>}</g>;
const Note:React.FC<{text:string}>=({text})=><svg data-region="caption" width={790} height={180} style={{position:'absolute',left:1050,top:465}}><Caption x={30} y={70} text={text}/></svg>;
const Paper:React.FC<{s:Scene;t:number}>=({s,t})=>{
 const page=s.id==='s07'&&t>=at(s,'check')?1:0; const bs=s.beats.filter(b=>b.ink&&(b.page??0)===page);
 const positions:Record<string,[number,number]>=s.id==='s06'?{formula:[40,50],symbols:[40,145],drive:[40,255],carRes:[183,255],trailerRes:[350,255],carMass:[40,335],trailerMass:[250,335],simplify:[40,435],divide:[40,535],answer:[40,635]}:s.id==='s07'&&page===0?{formula:[40,65],symbols:[40,170],resistance:[40,285],mass:[275,285],acceleration:[445,285],rearrange:[40,430],answer:[40,570]}:{};
 return <svg data-region="paper" data-visual="paper" width={790} height={740} style={{position:'absolute',left:1050,top:210}}><rect width={790} height={740} rx={12} fill={T.paper}/>{Array.from({length:10},(_,i)=><line key={i} x1={30} x2={758} y1={115+i*65} y2={115+i*65} stroke={T.grid}/>)}{bs.map((b,i)=>{const [x,y]=positions[b.id]??[40,65+i*130];const size=Math.min(b.id==='symbols'&&s.id==='s06'?31:36,705/prepareLine(b.ink!,1).width);return t>=b.cue?<g key={b.id}><HandwrittenLine text={b.ink!} x={x} y={y} size={size} frame={t*30} start={b.cue*30} end={b.penEnd*30}/>{b.id==='answer'&&t>=b.penEnd&&<path d={`M${x} ${y+49} Q260 ${y+62} ${x+prepareLine(b.ink!,size).width} ${y+48}`} stroke={T.accent} strokeWidth={4} fill="none"/>}</g>:null;})}</svg>;
};
const Givens:React.FC<{s:Scene;t:number}>=({s,t})=>{
 const answerA=s.id==='s07'||s.id==='s08'||s.id==='s06'&&t>=at(s,'answer');const answerT=s.id==='s08'||s.id==='s07'&&t>=at(s,'answer');
 const combined=s.id==='s06'||s.id==='s05'&&t>=at(s,'both');const individual=s.id==='s07'||s.id==='s08';const check=s.id==='s07'&&t>=at(s,'check');
 const vertical=s.id==='s05'&&t<at(s,'trailer');
 const whatif=s.id==='s08'&&t>=at(s,'whatif')&&t<at(s,'outcome1');
 return <Stage>
 <Arrow x={90} y={38} dx={110}/><Txt x={220} y={47}>Right is positive</Txt><Figure id="acceleration" x={575} y={47} size={31}>{whatif?'a decreases':answerA?'a = 1 m s⁻²':'a = ?'}</Figure>
 {combined&&<rect x={27} y={100} width={865} height={s.id==='s06'?614:596} rx={15} fill="none" stroke={T.accent} strokeWidth={3} strokeDasharray="13 9"/>}
 {individual&&<rect x={27} y={check?392:112} width={865} height={check?307:253} rx={15} fill="none" stroke={T.accent} strokeWidth={3}/>}
 <Txt x={72} y={153}>Trailer</Txt><Vehicle x={310} y={238} trailer scale={.7}/><Figure id="trailerMass" x={220} y={vertical?361:330} size={31}>m₂ = 200 kg</Figure>
 <Arrow x={238} y={230} dx={whatif?-64:-32}/><Figure id="trailerRes" x={40} y={205} size={29}>{whatif?'R₂ increased':'R₂ = 200 N'}</Figure>
 <Arrow x={395} y={242} dx={whatif?89.6:64} accent/><Figure id="tensionTrailer" x={whatif?520:480} y={247} size={31}>{answerT&&!whatif?'T = 400 N':'T = ?'}</Figure>
 <Txt x={72} y={422}>Car</Txt><Vehicle x={457} y={514} scale={.7}/><Figure id="carMass" x={375} y={647} size={31}>m₁ = 800 kg</Figure>
 <Arrow x={357} y={485} dx={-48}/><Figure id="carRes" x={127} y={459} size={29}>R₁ = 300 N</Figure>
 <Arrow x={357} y={552} dx={whatif?-89.6:-64} accent/><Figure id="tensionCar" x={123} y={591} size={31}>{answerT&&!whatif?'T = 400 N':'T = ?'}</Figure>
 <Arrow x={570} y={514} dx={240}/><Figure id="drive" x={608} y={462} size={29}>D = 1500 N</Figure>
 {vertical&&<><Arrow x={310} y={161} dx={0} dy={-43}/><Arrow x={310} y={281} dx={0} dy={43}/><Arrow x={457} y={455} dx={0} dy={-43}/><Arrow x={457} y={559} dx={0} dy={43}/><Txt x={343} y={135} size={25}>N₂</Txt><Txt x={343} y={302} size={25}>m₂g</Txt><Txt x={490} y={411} size={25}>N₁</Txt><Txt x={490} y={606} size={25}>m₁g</Txt></>}
 {s.id==='s06'&&t>=at(s,'simplify')&&<><Figure id="net" x={65} y={700} size={26}>F = 1000 N</Figure><Figure id="totalMass" x={530} y={700} size={26}>m = 1000 kg</Figure></>}
 <Txt x={55} y={746} size={25}>Level road · constant forces · light, rigid tow bar</Txt>
 </Stage>;
};
const Content:React.FC<{s:Scene;t:number}>=({s,t})=>{
 const b=currentBeat(s,t);
 if(s.mode==='opening')return <><Stage><Road/><Vehicle x={240} y={390} trailer/><path d="M360 410 H485" stroke={T.text} strokeWidth={6}/><Vehicle x={620} y={390}/><Arrow x={630} y={170} dx={180} accent/><Txt x={205} y={600} size={38}>One connection, shared motion</Txt></Stage>{b?.id.startsWith('outcome')?<Note text={b.caption!}/>:<svg data-region="syllabus" width={790} height={380} style={{position:'absolute',left:1050,top:330}}><rect width={790} height={360} rx={10} fill={T.paper}/><Txt x={35} y={64} size={27} fill={T.ink}>Syllabus 4.4 · excerpt · p.33</Txt>{['“solve simple problems which may be','modelled as the motion of','connected particles.”'].map((x,i)=><Txt key={x} x={35} y={145+i*58} size={34} fill={T.ink}>{x}</Txt>)}</svg>}</>;
 if(s.mode==='story'||s.mode==='concept'){
 const concept=s.mode==='concept';const brake=concept&&t>=at(s,'brake'),slack=concept&&t>=at(s,'slack');
 const elapsed=concept?t:Math.max(0,t-at(s,'move'));const brakingAt=concept?at(s,'brake'):Infinity;const brakingTime=Math.max(0,t-brakingAt);const preTravel=3*brakingAt+1.6*brakingAt*brakingAt;
 const travel=brake?preTravel+(3+3.2*brakingAt)/.22*(1-Math.exp(-.22*brakingTime)):3*(concept?elapsed:t)+1.6*elapsed*elapsed;
 const approach=slack?70*(1-Math.exp(-.22*(t-at(s,'slack')))):0;
 const trailerX=230+approach,carX=655;const connY=410;
 return <><Stage><Road travel={travel}/><Vehicle x={trailerX} y={389} trailer scale={.9} wheel={(travel+approach)/24.3}/><Vehicle x={carX} y={389} scale={.9} wheel={travel/24.3}/><path d={slack?`M${trailerX+108} ${connY} Q${(trailerX+carX)/2} 475 ${carX-118} ${connY}`:`M${trailerX+108} ${connY} H${carX-118}`} fill="none" stroke={T.text} strokeWidth={brake&&!slack?7:4}/>
 {concept&&t>=at(s,'pull')&&!slack&&<><Arrow x={trailerX+95} y={310} dx={brake?-90:90} accent/><Arrow x={carX-125} y={310} dx={brake?90:-90} accent/></>}
 {!slack&&<><Arrow x={trailerX-20} y={170} dx={brake?-95:95}/><Arrow x={carX-20} y={170} dx={brake?-95:95}/><Txt x={brake?255:300} y={120}>{brake?'Acceleration left':'Same acceleration'}</Txt></>}
 {concept&&<Txt x={80} y={605} size={29}>{slack?'Slack rope: no tension':brake?'Trailer resistance neglected; car brakes':t>=at(s,'light')?'Light connection: equal end forces':'Taut and inextensible: fixed separation'}</Txt>}
 </Stage><Note text={concept?(slack?'A rope cannot push':brake?'Thrust: the bar pushes':t>=at(s,'pull')?'Tension: the rope pulls':t>=at(s,'light')?'Negligible mass':'Fixed separation'):(t>=at(s,'goal')?'Find acceleration and tension':'Both vehicles speed up together')}/></>;
 }
 if(s.mode==='problem')return <><Givens s={s} t={t}/><svg data-region="problem" width={790} height={560} style={{position:'absolute',left:1050,top:300}}><rect width={790} height={535} rx={12} fill={T.paper}/>{['Straight, level road; constant forces.','Particles; light, inextensible tow bar.','Find common a and tow-bar tension T.'].map((x,i)=><g key={x}><Txt x={30} y={110+i*150} size={32} fill={T.ink}>{x}</Txt>{(i===0&&['car','trailer','drive','carRes','trailerRes'].includes(b?.id??'')||i===1&&b?.id==='conditions'||i===2&&b?.id==='unknown')&&<path d={`M30 ${128+i*150} H740`} stroke={T.accent} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1-clamp((t-b!.cue)/.7)}/>}</g>)}</svg></>;
 if(['forces','acceleration','tension'].includes(s.mode))return <><Givens s={s} t={t}/>{s.mode==='forces'&&t<at(s,'formula')?<Note text={t<at(s,'trailer')?'No vertical acceleration':t<at(s,'car')?'Forces on the trailer':'Forces on the car'}/>:<Paper s={s} t={t}/>}</>;
 return <><Givens s={s} t={t}/><Note text={b?.caption?`✓ ${b.caption}`:t>=at(s,'whatif')?'More resistance → smaller acceleration':t>=at(s,'answer')?'The other force acts on the car':'Cancel T on the trailer alone?'}/></>;
};
export const MechanicsConnectedBodiesRopesAndTowBars:React.FC<MechanicsConnectedBodiesRopesAndTowBarsProps>=props=><Lesson scenes={scenes} content={Content} {...props}/>;
