import React from 'react';
import transcript from '../public/transcripts/mechanics/resolving-forces-and-inclined-planes-fable.json';
import {Lesson,Scene,Figure,Caption,T,at,clamp,currentBeat,duration,between} from './mechanics-m42/Presentation';
import {HandwrittenLine,prepareLine} from './mechanics-m42/Ink';
const scenes=transcript.scenes as unknown as Scene[];
export type MechanicsResolvingForcesAndInclinedPlanesFableProps={audioEnabled?:boolean;audit?:boolean};
export const getMechanicsResolvingForcesAndInclinedPlanesFableDuration=(fps:number)=>duration(scenes,fps);
const D=Math.PI/180;
const wordAt=(s:Scene,pattern:RegExp,fallback:number)=>(s as unknown as {words:{word:string;start:number}[]}).words.find(w=>pattern.test(w.word.trim()))?.start??fallback;
const Txt:React.FC<{x:number;y:number;children:React.ReactNode;size?:number;fill?:string}>=({x,y,children,size=28,fill=T.text})=><text data-label="true" x={x} y={y} fill={fill} fontSize={size}>{children}</text>;
const Arrow:React.FC<{x:number;y:number;dx:number;dy:number;accent?:boolean;dashed?:boolean;p?:number}>=({x,y,dx,dy,accent=false,dashed=false,p=1})=>{const q=clamp(p);return <path data-force-arrow="true" data-label={dx===0||dy===0?'true':undefined} d={`${dx===0||dy===0?`M${x} ${y} l${dx===0?.6:0} ${dy===0?.6:0} `:''}M${x} ${y} l${dx*q} ${dy*q}`} stroke={accent?T.accent:T.text} strokeWidth={4} strokeDasharray={dashed?'10 8':undefined} opacity={dashed?.55:1} fill="none" markerEnd={accent?'url(#rf-green)':'url(#rf-white)'}/>;};
const Arc:React.FC<{cx:number;cy:number;r:number;from:number;to:number;p?:number}>=({cx,cy,r,from,to,p=1})=>{const a=from,b=from+(to-from)*clamp(p);const pt=(g:number)=>`${cx+r*Math.cos(g*D)} ${cy-r*Math.sin(g*D)}`;return <path d={`M${pt(a)} A${r} ${r} 0 ${Math.abs(b-a)>180?1:0} ${b>a?0:1} ${pt(b)}`} fill="none" stroke={T.accent} strokeWidth={3}/>;};
const Stage:React.FC<{children:React.ReactNode}>=({children})=><svg data-region="diagram" data-visual="diagram" width={930} height={810} style={{position:'absolute',left:80,top:205}}><defs><marker id="rf-white" markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke={T.text} strokeWidth={1.5}/></marker><marker id="rf-green" markerWidth={10} markerHeight={10} refX={9} refY={5} orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke={T.accent} strokeWidth={1.5}/></marker></defs>{children}</svg>;
const Note:React.FC<{text:string}>=({text})=><svg data-region="caption" width={790} height={220} style={{position:'absolute',left:1040,top:435}}><Caption x={24} y={85} text={text}/></svg>;
const Paper:React.FC<{s:Scene;t:number}>=({s,t})=>{const written=s.beats.filter(b=>b.ink&&t>=b.cue);if(!written.length)return null;const page=written.at(-1)!.page??0;const bs=s.beats.filter(b=>b.ink&&(b.page??0)===page);return <svg data-region="paper" data-visual="paper" width={800} height={770} style={{position:'absolute',left:1040,top:210}}><rect width={800} height={770} rx={12} fill={T.paper}/>{Array.from({length:10},(_,i)=><line key={i} x1={30} x2={770} y1={105+i*65} y2={105+i*65} stroke={T.grid}/>)}{page>0&&<text data-label="true" x={600} y={745} fontSize={22} fill={T.ink}>continued</text>}{bs.map((b,i)=>{const size=Math.min(36,718/prepareLine(b.ink!,1).width),y=52+i*(bs.length>5?113:135);return t>=b.cue?<g key={b.id}><HandwrittenLine text={b.ink!} x={38} y={y} size={size} frame={t*30} start={b.cue*30} end={b.penEnd*30}/>{b.hold>=1.5&&t>=b.penEnd&&<path d={`M38 ${y+53} Q360 ${y+68} ${38+prepareLine(b.ink!,size).width} ${y+53}`} fill="none" stroke={T.accent} strokeWidth={4}/>}</g>:null;})}</svg>;};
const Problem:React.FC<{s:Scene;t:number}>=({s,t})=>{const b=currentBeat(s,t);const line:Record<string,number>={force:0,accel:1,given:2,conditions:1,unknown:2};const lines=['Rope pulls 16 N at 60° above the floor.','Smooth floor. Box stays on the floor. a = 2 m s⁻².','g = 10 m s⁻². Find the mass m and reaction R.'];return <svg data-region="problem" width={800} height={630} style={{position:'absolute',left:1040,top:290}}><rect width={800} height={590} rx={12} fill={T.paper}/>{lines.map((x,i)=><g key={x}><Txt x={30} y={120+i*150} fill={T.ink} size={30}>{x}</Txt>{b&&line[b.id]===i&&<path d={`M30 ${138+i*150} H770`} stroke={T.accent} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1-between(t,b.cue,b.cue+.6)}/>}</g>)}</svg>;};
const active=(s:Scene,v:number)=>v-s.holds.reduce((n,h)=>n+Math.max(0,Math.min(v,h.end)-h.start),0);
const Box:React.FC<{x:number;y:number;w?:number;h?:number;muted?:boolean}>=({x,y,w=150,h=110,muted=false})=><rect data-box-x={x} x={x} y={y} width={w} height={h} rx={5} fill="#293431" stroke={T.text} strokeWidth={4} opacity={muted?.35:1}/>;
/* Flat-floor force picture. C = (375,300) is the particle; 10 px per newton. */
const Flat:React.FC<{s:Scene;t:number;stage:'problem'|'resolve'|'newton'|'whatif';results:{mass:boolean;reaction:boolean;H:boolean;V:boolean;weight:boolean};components:boolean;replaced:boolean;triangle?:{hyp:boolean;H:boolean;V:boolean;Vlabel:boolean}}>=({s,t,stage,results,components,replaced,triangle})=>{
 const w=stage==='whatif',dy=w?100:0,C={x:375,y:300+dy};const tip=w?{x:C.x+160,y:C.y}:{x:C.x+160*Math.cos(60*D),y:C.y-160*Math.sin(60*D)};const O={x:590,y:640},K={x:590+320*Math.cos(60*D),y:640-320*Math.sin(60*D)};
 return <g>
  <Txt x={35} y={35} size={26}>{w?'Changed condition: rope horizontal':'Smooth floor · box modelled as a particle'}</Txt>
  <path d={`M40 ${340+dy} H900`} stroke={T.muted} strokeWidth={5}/>
  <path d={w?`M430 ${C.y} H600`:`M398 ${260+dy} L500 ${84+dy}`} stroke={T.muted} strokeWidth={5} strokeLinecap="round"/>
  <Box x={320} y={260+dy} w={110} h={80}/>
  {!w&&<path d={`M${C.x} ${C.y} H475`} stroke={T.muted} strokeWidth={2} strokeDasharray="6 6"/>}
  <Arrow x={C.x} y={C.y} dx={tip.x-C.x} dy={tip.y-C.y} accent dashed={replaced}/>
  <Figure id="force" x={w?440:515} y={w?C.y-18:135} size={28}>16 N</Figure>
  {!w&&<><Arc cx={C.x} cy={C.y} r={60} from={0} to={60}/><Figure id="angle" x={445} y={332} size={26}>60°</Figure></>}
  {components&&!w&&<><Arrow x={C.x} y={C.y} dx={0} dy={tip.y-C.y} accent/><Arrow x={C.x} y={C.y} dx={tip.x-C.x} dy={0} accent/><Txt x={383} y={150} fill={T.accent}>V</Txt><Txt x={468} y={292} fill={T.accent}>H</Txt></>}
  {triangle?.hyp&&!w&&<g><Txt x={O.x} y={706} size={22} fill={T.muted}>not to scale with the box</Txt><path d={`M${O.x-30} ${O.y} H${O.x+250}`} stroke={T.muted} strokeWidth={2}/><Arrow x={O.x} y={O.y} dx={K.x-O.x} dy={K.y-O.y}/><Txt x={O.x-60} y={O.y-170} size={30}>16 N</Txt><Arc cx={O.x} cy={O.y} r={55} from={0} to={60}/><Txt x={O.x+62} y={O.y-12} size={28}>60°</Txt>{triangle.H&&<><Arrow x={O.x} y={O.y} dx={K.x-O.x} dy={0} accent/><Txt x={O.x+10} y={O.y+40} size={28} fill={T.accent}>H = 8 N</Txt></>}{triangle.V&&<><Arrow x={K.x} y={O.y} dx={0} dy={K.y-O.y} accent/><Txt x={K.x+14} y={(O.y+K.y)/2+10} size={28} fill={T.accent}>{triangle.Vlabel?'V = 8√3 N':'V'}</Txt></>}</g>}
  <Arrow x={345} y={340+dy} dx={0} dy={w?-385:-246}/>{w?<Figure id="reaction" x={170} y={120} size={28}>R = 40 N</Figure>:<Txt x={308} y={110}>R</Txt>}
  <Arrow x={405} y={C.y} dx={0} dy={w?300:400}/>{w?<Figure id="weight" x={422} y={C.y+200} size={28}>mg = 40 N</Figure>:<Txt x={422} y={C.y+220}>mg</Txt>}
  {stage!=='whatif'&&<><Arrow x={600} y={C.y} dx={100} dy={0} accent/><Figure id="accel" x={598} y={C.y-18} size={26}>a = 2 m s⁻²</Figure></>}
  {w&&<><Arrow x={660} y={C.y} dx={100} dy={0} accent/><Txt x={690} y={C.y-18} size={26}>a</Txt></>}
  {w?<><Figure id="mass" x={660} y={C.y+80} size={27}>m = 4 kg</Figure><Txt x={660} y={C.y+130} size={27}>H = 16 N · V = 0</Txt></>:<>
  <path d="M35 715 H895" stroke={T.muted} strokeWidth={1}/>
  <Figure id="gravity" x={45} y={755} size={27}>g = 10 m s⁻²</Figure>
  <Figure id="mass" x={330} y={755} size={27}>{results.mass?'m = 4 kg':'m = ?'}</Figure>
  <Figure id="reaction" x={585} y={755} size={27}>{results.reaction?'R = 26.1 N':'R = ?'}</Figure>
  <Figure id="H" x={45} y={798} size={27}>{results.H?'H = 8 N':'H = ?'}</Figure>
  <Figure id="V" x={330} y={798} size={27}>{results.V?'V = 8√3 N':'V = ?'}</Figure>
  {results.weight&&<Figure id="weight" x={585} y={798} size={27}>mg = 40 N</Figure>}</>}
 </g>;};
/* Generic force triangle for the components scene; θ animates for the extremes contrast. */
const Triangle:React.FC<{theta:number;showTriangle:boolean;showH:boolean;showV:boolean;labels?:boolean}>=({theta,showTriangle,showH,showV,labels=true})=>{const O={x:250,y:600},L=340,tip={x:O.x+L*Math.cos(theta*D),y:O.y-L*Math.sin(theta*D)};return <g>
 <path d={`M60 ${O.y} H880`} stroke={T.muted} strokeWidth={3}/>
 {showTriangle&&<path d={`M${O.x} ${O.y} H${tip.x} V${tip.y}`} fill="none" stroke={T.muted} strokeWidth={3} strokeDasharray="10 8"/>}
 <Arrow x={O.x} y={O.y} dx={tip.x-O.x} dy={tip.y-O.y}/>
 {labels&&<Txt x={tip.x+18} y={tip.y-10} size={32}>F</Txt>}
 {theta>3&&<><Arc cx={O.x} cy={O.y} r={70} from={0} to={theta}/><Txt x={O.x+82} y={O.y-12} size={30}>θ</Txt></>}
 {showH&&<><Arrow x={O.x} y={O.y} dx={tip.x-O.x} dy={0} accent/>{theta<85&&<Txt x={O.x+90} y={O.y+42} fill={T.accent}>F cos θ</Txt>}</>}
 {showV&&<><Arrow x={tip.x} y={O.y} dx={0} dy={tip.y-O.y} accent/>{theta>5&&<Txt x={tip.x+22} y={(O.y+tip.y)/2+10} fill={T.accent}>F sin θ</Txt>}</>}
</g>;};
const Ramp:React.FC<{s:Scene;t:number}>=({s,t})=>{const th=25,A={x:200,y:650},B={x:820,y:650},top={x:820,y:650-620*Math.tan(th*D)};const u={x:Math.cos(th*D),y:-Math.sin(th*D)},n={x:-Math.sin(th*D),y:-Math.cos(th*D)};const M={x:(A.x+top.x)/2,y:(A.y+top.y)/2},C={x:M.x+40*n.x,y:M.y+40*n.y};const W=240,cos=W*Math.cos(th*D),sin=W*Math.sin(th*D);
 const axes=t>=wordAt(s,/^axes/i,at(s,'axes')+9),geo=t>=at(s,'geometry'),par=t>=at(s,'parallel'),perp=t>=at(s,'perpendicular'),rea=t>=at(s,'reaction'),newton=t>=at(s,'newton');const g=clamp((t-at(s,'geometry'))/1.2);
 return <g>
  <Txt x={35} y={35} size={26}>Smooth slope · nothing pulling</Txt>
  <path d={`M${A.x} ${A.y} H${B.x} L${top.x} ${top.y} Z`} fill="#22302c" stroke={T.muted} strokeWidth={4}/>
  <g transform={`translate(${M.x} ${M.y}) rotate(${-th})`}><rect x={-70} y={-80} width={140} height={80} rx={5} fill="#293431" stroke={T.text} strokeWidth={4}/></g>
  {axes&&<><path d={`M${C.x-260*u.x} ${C.y-260*u.y} L${C.x+260*u.x} ${C.y+260*u.y}`} stroke={T.accent} strokeWidth={3} strokeDasharray="9 7"/><path d={`M${C.x-150*n.x} ${C.y-150*n.y} L${C.x+300*n.x} ${C.y+300*n.y}`} stroke={T.accent} strokeWidth={3} strokeDasharray="9 7"/></>}
  <Arrow x={C.x} y={C.y} dx={0} dy={W} dashed={par}/><Txt x={C.x+14} y={C.y+W-30}>mg</Txt>
  <Arrow x={C.x} y={C.y} dx={cos*n.x} dy={cos*n.y} accent={rea}/><Txt x={C.x+cos*n.x-40} y={C.y+cos*n.y-14}>{rea?'R = mg cos θ':'R'}</Txt>
  <Arc cx={A.x} cy={A.y} r={80} from={0} to={th}/><Txt x={A.x+92} y={A.y-6} size={28}>θ</Txt>
  {geo&&<><Arc cx={C.x} cy={C.y} r={90} from={270} to={270+th} p={g}/><Txt x={C.x+46} y={C.y+124} size={28}>θ</Txt><path d={`M${C.x-14*u.x+12*n.x} ${C.y-14*u.y+12*n.y} l${-16*n.x} ${-16*n.y} l${16*u.x} ${16*u.y}`} fill="none" stroke={T.muted} strokeWidth={2}/></>}
  {geo&&<g opacity={g}><path d={`M${A.x} ${A.y} V${A.y-260}`} stroke={T.text} strokeWidth={3} strokeDasharray="9 7"/><path d={`M${A.x} ${A.y} l${260*n.x} ${260*n.y}`} stroke={T.accent} strokeWidth={3} strokeDasharray="9 7"/><Arc cx={A.x} cy={A.y} r={80} from={90} to={90+th}/><Txt x={A.x-25} y={A.y-110} size={28}>θ</Txt></g>}
  {par&&<><Arrow x={C.x} y={C.y} dx={-sin*u.x} dy={-sin*u.y} accent/><Txt x={C.x-sin*u.x-136} y={C.y-sin*u.y+54} fill={T.accent} size={26}>mg sin θ</Txt></>}
  {perp&&<><Arrow x={C.x} y={C.y} dx={-cos*n.x} dy={-cos*n.y} accent/><Txt x={C.x-cos*n.x+18} y={C.y-cos*n.y+6} fill={T.accent} size={26}>mg cos θ</Txt></>}
  {newton&&<><Arrow x={C.x-120*u.x+70*n.x} y={C.y-120*u.y+70*n.y} dx={-110*u.x} dy={-110*u.y} accent/><Txt x={300} y={380} fill={T.accent} size={26}>a = g sin θ</Txt></>}
 </g>;};
const Content:React.FC<{s:Scene;t:number}>=({s,t})=>{const b=currentBeat(s,t);
 if(s.mode==='opening')return <><Stage><Triangle theta={40} showTriangle showH showV/></Stage>{b?.id.startsWith('outcome')?<Note text={b.caption!}/>:<svg data-region="syllabus" width={800} height={430} style={{position:'absolute',left:1040,top:315}}><rect width={800} height={390} rx={12} fill={T.paper}/><Txt x={35} y={65} size={27} fill={T.ink}>Syllabus 4.1 · excerpt · p.31</Txt>{['“understand the vector nature of','force, and find and use','components and resultants”'].map((x,i)=><Txt key={x} x={35} y={155+i*65} size={36} fill={T.ink}>{x}</Txt>)}</svg>}</>;
 if(s.mode==='components'){const c=at(s,'contrast');const words=(s as unknown as {words:{word:string;start:number}[]}).words;const ninety=words.find(w=>/^(90|ninety)/i.test(w.word.trim()))?.start??c+5;let theta=40;if(t>=c)theta=40-40*clamp((t-c)/1);if(t>=ninety)theta=90*clamp((t-ninety)/1);const written=t>=at(s,'cos');return <><Stage><Triangle theta={theta} showTriangle={t>=at(s,'triangle')} showH={t>=at(s,'cos')} showV={t>=at(s,'sin')}/></Stage>{written?<Paper s={s} t={t}/>:<Note text={t>=at(s,'triangle')?'Adjacent and opposite sides':'Part drags, part lifts'}/>}</>;}
 if(s.mode==='resultant'){const O={x:430,y:470},F1={L:260,th:35},F2={L:200,th:130};const p1={x:O.x+F1.L*Math.cos(F1.th*D),y:O.y-F1.L*Math.sin(F1.th*D)},p2={x:O.x+F2.L*Math.cos(F2.th*D),y:O.y-F2.L*Math.sin(F2.th*D)};const rx=t>=at(s,'rx'),ry=t>=at(s,'ry'),mag=t>=at(s,'magnitude');const R={x:p1.x-O.x+p2.x-O.x,y:p1.y-O.y+p2.y-O.y};return <><Stage>
  <Txt x={35} y={35} size={26}>Resolve each force, then add</Txt>
  <path d={`M60 ${O.y} H880 M${O.x} 120 V720`} stroke={T.muted} strokeWidth={2} strokeDasharray="6 6"/>
  {rx&&<><Arrow x={O.x} y={O.y} dx={p1.x-O.x} dy={0} accent/><Arrow x={O.x} y={O.y} dx={p2.x-O.x} dy={0} accent/><Txt x={O.x+60} y={O.y+40} fill={T.accent} size={25}>F₁cosθ₁</Txt><Txt x={O.x-215} y={O.y+40} fill={T.accent} size={25}>F₂cosθ₂</Txt></>}
  {ry&&<><Arrow x={p1.x} y={O.y} dx={0} dy={p1.y-O.y} accent/><Arrow x={p2.x} y={O.y} dx={0} dy={p2.y-O.y} accent/><Txt x={p1.x+16} y={O.y-60} fill={T.accent} size={25}>F₁sinθ₁</Txt><Txt x={p2.x-150} y={O.y-60} fill={T.accent} size={25}>F₂sinθ₂</Txt></>}
  <Arrow x={O.x} y={O.y} dx={p1.x-O.x} dy={p1.y-O.y} dashed={mag}/><Arrow x={O.x} y={O.y} dx={p2.x-O.x} dy={p2.y-O.y} dashed={mag}/>
  <Txt x={p1.x+14} y={p1.y-14} size={30}>F₁</Txt><Txt x={p2.x-48} y={p2.y-14} size={30}>F₂</Txt>
  <Arc cx={O.x} cy={O.y} r={80} from={0} to={F1.th}/><Txt x={O.x+90} y={O.y-16} size={26}>θ₁</Txt>
  <Arc cx={O.x} cy={O.y} r={110} from={0} to={F2.th}/><Txt x={O.x-60} y={O.y-125} size={26}>θ₂</Txt>
  {mag&&<><Arrow x={O.x} y={O.y} dx={R.x} dy={R.y} accent/><Txt x={O.x+R.x+16} y={O.y+R.y-10} fill={T.accent} size={32}>R</Txt></>}
 </Stage>{t>=at(s,'rx')?<Paper s={s} t={t}/>:<Note text="Same rule for every force"/>}</>;}
 if(s.mode==='story'){const pull=at(s,'pull'),floor=at(s,'floor');const tau=Math.max(0,active(s,t)-active(s,pull));const total=active(s,s.duration)-active(s,pull);const k=2*480/(total*total);const x=120+.5*k*tau*tau,v=k*tau;const C={x:x+75,y:300};return <><Stage>
  <Txt x={35} y={35} size={26}>{t>=floor?'Slides along the floor · never lifts':t>=pull?'Pulled: moving right, speeding up':'At rest on a smooth floor'}</Txt>
  <path d="M40 355 H900" stroke={T.muted} strokeWidth={5}/>
  <path d={`M${x+107} 245 L${x+200} 84`} stroke={T.muted} strokeWidth={5} strokeLinecap="round"/><circle cx={x+200} cy={84} r={9} fill={T.muted}/>
  <Box x={x} y={245}/>
  <path d={`M${C.x} ${C.y} H${C.x+100}`} stroke={T.muted} strokeWidth={2} strokeDasharray="6 6"/><Arc cx={C.x} cy={C.y} r={60} from={0} to={60}/><Figure id="angle" x={C.x+92} y={C.y+36} size={26}>60°</Figure>
  {t>=pull&&<><Arrow x={x+165} y={300} dx={Math.max(12,v*3)} dy={0} accent/><Txt x={x+165} y={282} fill={T.accent} size={25}>speed</Txt></>}
 </Stage><Note text={t>=floor?'Forwards and upwards at once':t>=pull?'Faster every second':'A box, a rope at 60°'}/></>;}
 if(s.mode==='problem')return <><Stage><Flat s={s} t={t} stage="problem" results={{mass:false,reaction:false,H:false,V:false,weight:false}} components={false} replaced={false}/></Stage><Problem s={s} t={t}/></>;
 if(s.mode==='resolve'){const carry=t>=wordAt(s,/^replace/i,at(s,'vvalue')+7);return <><Stage><Flat s={s} t={t} stage="resolve" results={{mass:false,reaction:false,H:t>=at(s,'hvalue'),V:t>=at(s,'vvalue'),weight:false}} components={carry} replaced={carry} triangle={{hyp:t>=at(s,'hformula'),H:t>=at(s,'hvalue'),V:t>=at(s,'vformula'),Vlabel:t>=at(s,'vvalue')}}/></Stage>{t>=at(s,'hformula')?<Paper s={s} t={t}/>:<Note text="Only the pull is at an angle"/>}</>;}
 if(s.mode==='newton'){const w=t>=at(s,'whatif');return <><Stage><Flat s={s} t={t} stage={w?'whatif':'newton'} results={{mass:t>=at(s,'mass'),reaction:t>=at(s,'reaction'),H:true,V:true,weight:t>=at(s,'vsub')}} components={!w} replaced/></Stage>{w?<Note text="V = 0: R = mg"/>:<Paper s={s} t={t}/>}</>;}
 if(s.mode==='ramp')return <><Stage><Ramp s={s} t={t}/></Stage>{t>=at(s,'parallel')?<Paper s={s} t={t}/>:<Note text={t>=at(s,'geometry')?'Same angle θ, turned by 90°':'Weight down, reaction perpendicular'}/>}</>;
 return <><Stage><Flat s={s} t={t} stage="newton" results={{mass:true,reaction:true,H:true,V:true,weight:true}} components replaced/></Stage><Note text={b?.caption?`✓ ${b.caption}`:'Split · replace · apply the law'}/></>;
};
export const MechanicsResolvingForcesAndInclinedPlanesFable:React.FC<MechanicsResolvingForcesAndInclinedPlanesFableProps>=props=><Lesson scenes={scenes} content={Content} {...props}/>;
