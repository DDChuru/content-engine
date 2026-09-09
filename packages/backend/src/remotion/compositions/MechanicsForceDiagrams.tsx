/** M4.1: identify and draw forces, following the source's six situations. */
import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, Artifact, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import transcript from '../public/transcripts/mechanics/force-diagrams.json';
import {HandwrittenLine} from './mechanics-m42/Ink';

const T = {bg:'#171c20', text:'#e9e7e0', muted:'#a9afad', ink:'#273238', paper:'#b9bcb2', accent:'#3f9e89'};
type Scene = typeof transcript.scenes[number];
type ArrowSpec = {id:string; cue:string; x:number; y:number; dx:number; dy:number; label:string; lx:number; ly:number; until?:string; only?:'system'|'pulley'};
type TimedArrow = ArrowSpec & {scene:string; start:number; end:number};
const scenes = transcript.scenes;
const clamp = (v:number) => Math.max(0, Math.min(1,v));
const progress = (t:number,a:number,b:number) => clamp((t-a)/Math.max(.001,b-a));
const at = (s:Scene,id:string):number => {
  const value = (s.cues as Record<string,number | undefined>)[id];
  if(value===undefined) throw Error(`Missing force-diagram cue ${s.id}:${id}`);
  return value;
};
const held = (s:Scene,t:number) => s.holds.find(h=>t>=h.start&&t<h.end)?.start??t;
const OUTCOMES = ['Choose the forces.', 'Draw and label arrows.', 'Check changed assumptions.'];
const HEADERS = ['Syllabus 4.1: force diagrams','Draw arrows from the particle','A suspended body','Driving and braking','Projected up a rough slope','Connected particles and the pulley','Tension and thrust','Complete the diagram'];
const a = (id:string,cue:string,x:number,y:number,dx:number,dy:number,label:string,lx:number,ly:number,extra:Partial<ArrowSpec>={}):ArrowSpec => ({id,cue,x,y,dx,dy,label,lx,ly,...extra});
const slopeArrows = (check=false):ArrowSpec[] => [
  a('weight','weight',650,360,0,225,'weight mg',685,510),
  a('reaction','reaction',650,360,-98,-170,'reaction R',335,135),
  a('friction','friction',650,360,-156,90,'friction F',235,440,check?{}:{until:'smooth'}),
];
const ARROWS:Record<string,ArrowSpec[]> = {
  s01:[],
  s02:[a('weight','weight',650,370,0,220,'weight mg',690,520),a('reaction','reaction',650,370,0,-220,'reaction R',690,170),a('tension','tension',650,370,270,0,'tension T',960,340),a('friction','rough',650,370,-190,0,'friction F',240,325)],
  s03:[a('weight','weight',650,350,0,355,'weight mg',695,590),a('left','left',650,350,-225,-130,'tension T₁',210,275,{until:'single'}),a('right','right',650,350,225,-225,'tension T₂',925,115,{until:'single'}),a('single','single',650,350,0,-355,'tension T',695,55)],
  s04:[a('weight','weight',650,370,0,220,'weight mg',700,520),a('reaction','reaction',650,370,0,-220,'reaction R',700,180),a('drive','drive',650,370,260,0,'drive D',965,340,{until:'remove'}),a('air','air',650,370,-260,0,'air resistance A',125,290),a('brake','brake',650,370,-390,0,'braking B',100,415)],
  s05:slopeArrows(),
  s06:[
    a('weight1','weight1',420,320,0,190,'weight m₁g',450,455,{only:'system'}),
    a('reaction','reaction',420,320,0,-190,'reaction R',450,145,{only:'system'}),
    a('tension1','tension1',420,320,230,0,'tension T',480,265,{only:'system'}),
    a('weight2','weight2',1010,490,0,250,'weight m₂g',1035,690,{only:'system'}),
    a('tension2','tension2',1010,490,0,-230,'tension T',1060,355,{only:'system'}),
    a('left','left',650,365,-210,0,'tension T',245,320,{only:'pulley'}),
    a('down','down',650,365,0,210,'tension T',690,545,{only:'pulley'}),
    a('support','support',650,365,210,-210,'support Rₚ',865,130,{only:'pulley'}),
    a('friction','rough',420,320,-190,0,'friction F',160,255,{only:'system'}),
  ],
  s07:[a('trailerT','trailerT',350,380,195,0,'tension T',345,220,{until:'thrust'}),a('carT','carT',900,380,-195,0,'tension T',740,220,{until:'thrust'}),a('trailerThrust','thrust',350,380,-195,0,'thrust',130,440,{until:'string'}),a('carThrust','carThrust',900,380,195,0,'thrust',1000,440,{until:'string'})],
  s08:slopeArrows(true),
};
function arrowsFor(s:Scene):TimedArrow[] {
  return ARROWS[s.id].map(spec=>{
    const start=at(s,spec.cue);
    const next=ARROWS[s.id].map(other=>at(s,other.cue)).filter(t=>t>start+.02).sort((a,b)=>a-b)[0]??s.duration;
    const hold=s.holds.find(h=>h.start>start);
    const end=Math.min(start+2.7,next-.06,(hold?.start??s.duration)-.04);
    if(end-start<.7) throw Error(`Insufficient pen time ${s.id}:${spec.id}`);
    return {...spec,scene:s.id,start,end};
  });
}
const SCHEDULE = scenes.flatMap(arrowsFor);
const Context=React.createContext<{s:Scene;t:number} | null>(null);
const Ring:React.FC<{target:string;x:number;y:number;rx?:number;ry?:number}>=({target,x,y,rx=33,ry=29})=>{
  const context=React.useContext(Context)!;
  const event=context.s.figures.filter(e=>e.target===target&&context.t>=e.start&&context.t<e.start+1.65).at(-1);
  if(!event)return null;
  const p=clamp((context.t-event.start+1/30)/.4);
  const d=Array.from({length:65},(_,i)=>{const angle=i*Math.PI/32,w=1+.035*Math.sin(3*angle+.5);return `${i?'L':'M'}${x+rx*Math.cos(angle)*w} ${y+ry*Math.sin(angle)*w}`;}).join(' ');
  return <path data-ring={event.id} data-ring-target={target} data-ring-word={event.wordIndex} d={d} fill="none" stroke={T.accent} strokeWidth={3.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1-p} opacity={1-clamp((context.t-event.start-1.4)/.25)}/>;
};
const Label:React.FC<{x:number;y:number;children:string;id?:string;size?:number}>=({x,y,children,id,size=29})=><g>
  <text data-label={children} data-given={id} x={x} y={y} fill={T.text} fontSize={size}>{children}</text>
  {id&&<Ring target={id} x={x+children.length*size*.27} y={y-size*.33} rx={children.length*size*.28+12} ry={size*.72}/>}
</g>;
const Particle:React.FC<{x:number;y:number}>=({x,y})=><rect data-particle="true" x={x-13} y={y-13} width={26} height={26} rx={3} fill={T.bg} stroke={T.text} strokeWidth={3}/>;
const ForceArrow:React.FC<{spec:TimedArrow;t:number}>=({spec,t})=>{
  const p=progress(t,spec.start,spec.start+.4);
  const x=spec.x+spec.dx*p,y=spec.y+spec.dy*p;
  const angle=Math.atan2(spec.dy,spec.dx),head=18;
  const d=`M${spec.x} ${spec.y} L${x} ${y} M${x-head*Math.cos(angle-.48)} ${y-head*Math.sin(angle-.48)} L${x} ${y} L${x-head*Math.cos(angle+.48)} ${y-head*Math.sin(angle+.48)}`;
  return <g data-force-id={spec.id} data-force-complete={t>=spec.end} data-force-end={spec.end}>
    <path data-force-path={spec.id} d={d} fill="none" stroke={T.text} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round"/>
    {p<1&&<circle cx={x} cy={y} r={5} fill={T.accent}/>}
    <HandwrittenLine text={spec.label} frame={t*30} start={(spec.start+.4)*30} end={spec.end*30} x={spec.lx} y={spec.ly} size={25} color={T.text}/>
    <Ring target={spec.id} x={spec.x+spec.dx} y={spec.y+spec.dy}/>
  </g>;
};
const Motion:React.FC<{x:number;y:number;dx:number;dy?:number;label:string;id?:string}>=({x,y,dx,dy=0,label,id})=>{
  const angle=Math.atan2(dy,dx),ex=x+dx,ey=y+dy;
  return <g><path d={`M${x} ${y} L${ex} ${ey} M${ex-15*Math.cos(angle-.5)} ${ey-15*Math.sin(angle-.5)} L${ex} ${ey} L${ex-15*Math.cos(angle+.5)} ${ey-15*Math.sin(angle+.5)}`} stroke={T.muted} strokeWidth={3} strokeDasharray="9 8" fill="none"/>
    <Label x={Math.min(x,ex)} y={Math.min(y,ey)-25}>{label}</Label>{id&&<Ring target={id} x={ex} y={ey}/>}</g>;
};
const Car:React.FC<{x:number;y:number;wheel:number;trailer?:boolean}>=({x,y,wheel,trailer=false})=><g data-object-x={x} transform={`translate(${x} ${y})`}>
  <path d={trailer?'M-90 -65 H85 V0 H-90 Z':'M-120 -25 L-100 -55 L-55 -60 L-25 -105 H45 L80 -58 L115 -42 V0 H-120 Z'} fill={T.bg} stroke={T.text} strokeWidth={4}/>
  {!trailer&&<path d="M-40 -65 L-20 -92 H37 L61 -65 Z" fill={T.muted} opacity={.4}/>}
  {[-65,65].map(wx=><g key={wx} transform={`translate(${wx} 5) rotate(${wheel})`}><circle r={23} fill={T.bg} stroke={T.text} strokeWidth={4}/><path d="M-16 0 H16 M0 -16 V16" stroke={T.muted} strokeWidth={3}/></g>)}
</g>;
const Caption:React.FC<{children:React.ReactNode;words?:string;underline?:number}>=({children,words,underline})=><div data-region="caption" data-caption={words} style={{position:'absolute',left:1400,top:420,maxWidth:440,padding:'18px 22px',borderRadius:8,background:T.paper,color:T.ink,fontSize:32,lineHeight:1.5}}>{children}{underline!==undefined&&<svg width="100%" height={9} style={{display:'block'}}><path d="M0 4 H390" stroke={T.accent} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1-underline}/></svg>}</div>;
const Surface:React.FC<{rough?:boolean}>=({rough=false})=><g><path d="M150 410 H1200" stroke={T.muted} strokeWidth={4}/>{rough&&Array.from({length:25},(_,i)=><path key={i} d={`M${170+i*40} 410 l-12 18`} stroke={T.muted} strokeWidth={2}/>)}</g>;
function Content({s,t}:{s:Scene;t:number}) {
  const index=scenes.indexOf(s), is=(id:string)=>t>=at(s,id);
  const storyEnd=s.id==='s01'?0:at(s,'question');
  const moving=progress(t,.55,Math.max(1,storyEnd-.3));
  const pulley=s.id==='s06'&&is('isolate')&&!is('whatif');
  const forceSpecs=SCHEDULE.filter(a=>a.scene===s.id&&t>=a.start&&(!a.until||t<at(s,a.until))&&(!a.only||(a.only==='pulley')===pulley));
  let visual:React.ReactNode, caption:React.ReactNode=null;
  if(s.id==='s01') {
    visual=<g><Particle x={620} y={360}/><path d="M620 360 V165 M620 360 V555 M620 360 H850 M608 185 L620 165 L632 185 M608 535 L620 555 L632 535 M830 348 L850 360 L830 372" stroke={T.text} fill="none" strokeWidth={5}/><circle cx={620} cy={360} r={75} fill="none" stroke={T.accent} strokeWidth={3}/></g>;
    caption=is('outcomes')?<Caption>{OUTCOMES.map((o,i)=>is(`o${i+1}`)&&<div key={o}>{o}</div>)}</Caption>:<Caption>“identify the forces acting in a given situation”</Caption>;
  } else if(s.id==='s02') {
    const x=350+300*moving;
    visual=<><Surface rough={is('rough')}/><path d={`M${x} 370 H1180`} stroke={T.muted} strokeWidth={2}/>{t<storyEnd?<rect data-object-x={x} x={x-40} y={330} width={80} height={80} rx={5} fill={T.bg} stroke={T.text} strokeWidth={4}/>:<Particle x={650} y={370}/>}
      <Label x={765} y={715}>{is('rough')?'rough table':'smooth table'}</Label><Label x={1100} y={290}>string</Label><Label x={530} y={465}>mass m</Label><Motion x={180} y={90} dx={210} label="moving right"/></>;
    const text=is('rough')?'Rough contact can exert friction.':is('whatif')?'What if the table is rough?':is('length')?'Equal forces have equal arrow lengths.':is('formula')&&!is('weight')?'Weight = mass × g':t>=storyEnd&&!is('particle')?'Which forces act?':t<storyEnd?'A string pulls a box right.':'Arrows start at the particle.';
    caption=<Caption words={text}>{text}</Caption>;
  } else if(s.id==='s03') {
    const single=is('single'),x=650+(!single&&t<storyEnd?12*Math.sin(t*2)*(1-moving):0);
    visual=<><path d="M20 0 H1120" stroke={T.muted} strokeWidth={5}/><path data-obstacle="suspension strings" d={single?`M650 0 V350`:`M45 0 L${x} 350 L1000 0`} fill="none" stroke={T.muted} strokeWidth={2}/>{t<storyEnd?<g><path d={`M${x-35} 340 Q${x} 325 ${x+35} 340 L${x+28} 395 H${x-28} Z`} fill={T.bg} stroke={T.text} strokeWidth={4}/><path d={`M${x-20} 340 Q${x} 305 ${x+20} 340`} fill="none" stroke={T.text} strokeWidth={3}/></g>:<Particle x={x} y={350}/>}<Label x={520} y={430}>mass m</Label>
      {!single&&<><path d="M515 350 H790" stroke={T.muted} strokeWidth={2} strokeDasharray="5 7"/><path d="M570 350 A80 80 0 0 1 581 310 M730 350 A80 80 0 0 0 707 293" stroke={T.muted} strokeWidth={2} fill="none"/><Label x={490} y={335} id="angle30">30°</Label><Label x={770} y={310} id="angle45">45°</Label></>}
      <Label x={170} y={740}>at rest · only forces on the body</Label></>;
    const text=is('single')?'One string: one tension.':is('whatif')?'What if one vertical string replaces both?':is('remember')?'Questions will not tell you to add weight':is('contact')?'No surface contact: no normal reaction.':t>=storyEnd&&!is('weight')?'Which forces act?':t<storyEnd?'A body hangs at rest.':'Forces on the body';
    caption=<Caption words={text}>{text}</Caption>;
  } else if(s.id==='s04') {
    const x=350+300*moving;
    const brakeMove=is('brakeStory')?60*progress(t,at(s,'brakeStory'),at(s,'remove')):0;
    visual=<><Surface/>{t<storyEnd?<Car x={x} y={380} wheel={x*2}/>:<><Car x={650+brakeMove} y={730} wheel={is('brakeStory')?brakeMove*2:t*45}/><Particle x={650} y={370}/></>}
      <Label x={530} y={465}>mass m</Label><Label x={1020} y={715}>level road</Label><Label x={925} y={615}>{is('remove')?'engine off':'engine driving'}</Label><Motion x={150} y={85} dx={210} label="moving right"/>
      {is('positive')&&<Label x={890} y={90} id="positive">right is positive</Label>}
      {is('acceleration')&&<Motion x={1120} y={260} dx={-185} label="a < 0" id="acceleration"/>}</>;
    const text=is('double')?'Braking already includes tyre friction.':is('brake')?'Engine off; air resistance remains.':is('remove')?'Remove the driving force.':is('brakeStory')?'Now brake and stop driving.':is('steady')?'Steady speed: horizontal forces balance.':t>=storyEnd&&!is('weight')?'Which forces act?':'Engine driving';
    caption=<Caption words={text}>{text}</Caption>;
  } else if(s.id==='s05'||s.id==='s08') {
    const check=s.id==='s08',smooth=!check&&is('smooth');
    const x=check?650:400+250*(1-(1-moving)**2),y=360+(650-x)/Math.sqrt(3);
    visual=<><path d="M220 630 L1120 110" stroke={T.muted} strokeWidth={5}/>{!smooth&&Array.from({length:23},(_,i)=><path key={i} d={`M${230+i*38} ${624-i*38/Math.sqrt(3)} l2 20`} stroke={T.muted} strokeWidth={2}/>)}
      <path d="M220 630 H450 M340 630 A120 120 0 0 0 324 570" fill="none" stroke={T.muted} strokeWidth={2}/><Label x={365} y={607} id="angle">30°</Label>
      <g data-object-x={x} transform={`translate(${x} ${y}) rotate(-30)`}>{t<storyEnd?<rect x={-28} y={-28} width={56} height={56} rx={4} fill={T.bg} stroke={T.text} strokeWidth={4}/>:<Particle x={0} y={0}/>}</g>
      <Label x={710} y={390}>mass m</Label><Label x={850} y={690}>after release</Label><Label x={850} y={620}>{smooth?'smooth slope':'rough slope'}</Label>
      <Motion x={890} y={180} dx={150} dy={-87} label="sliding uphill"/>
      {!check&&is('positive')&&<Label x={80} y={75} id="positive">uphill is positive</Label>}
      {!check&&is('acceleration')&&<Motion x={1030} y={475} dx={-150} dy={87} label="a < 0" id="acceleration"/>}</>;
    const text=check?'Complete the force diagram after release.':is('smooth')?'Smooth: remove friction only.':is('whatif')?'What if the slope is smooth?':is('push')?'No continuing projection force.':'Draw forces after the push ends.';
    caption=check&&is('o1')?<Caption>{OUTCOMES.map((o,i)=>is(`o${i+1}`)&&<div key={o}>✓ {o}</div>)}</Caption>:<Caption words={text} underline={progress(t,at(s,'question'),at(s,'question')+.7)}>{text}</Caption>;
  } else if(s.id==='s06') {
    if(pulley) {
      visual=<><circle cx={650} cy={365} r={65} fill={T.bg} stroke={T.text} strokeWidth={5}/><circle cx={650} cy={365} r={9} fill={T.text}/><path data-obstacle="pulley string" d="M440 300 H650 A65 65 0 0 1 715 365 V480" stroke={T.muted} strokeWidth={3} fill="none"/><Label x={565} y={90} id="pulley">pulley</Label>{is('light')&&<Label x={190} y={700} id="light">light = massless</Label>}</>;
    } else {
      const x=220+200*moving,y=380+110*moving;
      visual=<><path d="M140 350 H960 V710" stroke={T.muted} strokeWidth={5} fill="none"/><circle cx={980} cy={320} r={30} stroke={T.text} strokeWidth={4} fill="none"/><path d={`M${x} 320 H980 Q1010 320 1010 350 V${y}`} stroke={T.muted} strokeWidth={2} fill="none"/>
        {t<storyEnd?<><rect data-object-x={x} x={x-35} y={290} width={70} height={60} rx={5} fill={T.bg} stroke={T.text} strokeWidth={4}/><rect x={980} y={y-40} width={60} height={80} rx={12} fill={T.bg} stroke={T.text} strokeWidth={4}/></>:<><Particle x={x} y={320}/><Particle x={1010} y={y}/></>}<Label x={285} y={385} id="mass1">m₁</Label><Label x={945} y={535} id="mass2">m₂</Label>
        <Label x={100} y={70} id="string">light, inextensible string</Label><Label x={830} y={145}>smooth, light pulley</Label><Label x={95} y={720}>{is('rough')?'rough table':'smooth table'}</Label>
        {is('acceleration')&&<>{t>=s.figures.find(e=>e.id==='a1')!.start&&<Motion x={150} y={180} dx={190} label="a" id="a1"/>}{t>=s.figures.find(e=>e.id==='a2')!.start&&<Motion x={1260} y={420} dx={0} dy={190} label="a" id="a2"/>}</>}
        </>;
    }
    const text=pulley?(is('light')?'Light means massless.':'Forces on the pulley itself.'):is('whatif')?'What if the table is rough?':is('equal')?'Equal tensions; equal acceleration magnitudes.':t>=storyEnd&&!is('firstdiagram')?'Which forces act on each particle?':'Two particles connected by a string.';
    caption=<Caption words={text}>{text}</Caption>;
  } else {
    const slack=is('string'),compressed=is('thrust'),shift=t<storyEnd?-100+100*moving:0;
    visual=<><Car x={350+shift} y={395} wheel={t<storyEnd?moving*220:0} trailer/><Car x={900+shift} y={395} wheel={t<storyEnd?moving*220:0}/>
      <path d={slack?'M435 365 Q625 530 780 365':`M${435+shift} 365 H${780+shift}`} fill="none" stroke={T.muted} strokeWidth={slack?2:8}/>
      <Label x={240} y={555}>trailer</Label><Label x={865} y={555}>car</Label><Label x={560} y={650} id="rod">{slack?'string':'light rod'}</Label>
      {t>=storyEnd&&<><Particle x={350} y={380}/><Particle x={900} y={380}/></>}
      <Motion x={125} y={95} dx={190} label="moving right"/>
      {compressed&&!slack&&<path d="M560 335 L600 365 L560 395 M700 335 L660 365 L700 395" stroke={T.muted} strokeWidth={3} fill="none"/>}</>;
    const text=slack?'A string cannot push.':is('whatif')?'What if a string replaces the rod?':compressed?'Thrust: the rod pushes.':is('brakeStory')?'Braking compresses the rod.':t>=storyEnd&&!is('trailerT')?'Which connector forces act?':'Connector forces only';
    caption=<Caption words={text}>{text}</Caption>;
  }
  return <><div data-region="header" data-label="header" style={{position:'absolute',left:90,top:65,fontSize:53,fontWeight:600}}>{HEADERS[index]}</div>
    <svg data-region="diagram" data-visual="diagram" width={1300} height={780} style={{position:'absolute',left:55,top:215,overflow:'visible'}}>
      {visual}{forceSpecs.map(spec=><ForceArrow key={spec.id} spec={spec} t={t}/>)}
    </svg>{caption}</>;
}

function useAudit(enabled:boolean,root:React.RefObject<HTMLDivElement|null>) {
  const frame=useCurrentFrame();const [data,setData]=useState('');
  const [handle]=useState(()=>enabled?delayRender('Measure force diagram still'):null);
  useLayoutEffect(()=>{
    if(!enabled)return;
    let request=0;
    const measure=()=>{
      const el=root.current;
      if(!el||el.getBoundingClientRect().width<1900){request=requestAnimationFrame(measure);return;}
      const visible=(e:Element)=>{let n:Element|null=e;while(n&&n!==el){const c=getComputedStyle(n);if(c.display==='none'||c.visibility==='hidden'||Number(c.opacity)<.001)return false;n=n.parentElement;}const b=e.getBoundingClientRect();return b.width>0&&b.height>0;};
      const q=(selector:string)=>Array.from(el.querySelectorAll(selector)).filter(visible);
      const boxes=q('[data-label], [data-ink-text][data-ink-active="true"], [data-region="caption"]').map(e=>({text:e.getAttribute('data-ink-text')??e.textContent??'',bounds:(e.querySelector('[data-ink-extent]')??e).getBoundingClientRect().toJSON()}));
      const overlaps=(a:DOMRect,b:DOMRect)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
      const collisions:{text:string;other:string}[]=[];
      boxes.forEach((a,i)=>boxes.slice(i+1).forEach(b=>{if(overlaps(a.bounds as DOMRect,b.bounds as DOMRect))collisions.push({text:a.text,other:b.text});}));
      // Sample actual arrow strokes, avoiding the false rectangular bounds of a diagonal.
      const paths=q('[data-force-path], [data-obstacle]') as SVGPathElement[];
      for(const path of paths){const matrix=path.getScreenCTM();if(!matrix)continue;const length=path.getTotalLength();for(const box of boxes){let hit=false;for(let d=0;d<=length;d+=3){const point=path.getPointAtLength(d).matrixTransform(matrix);if(point.x>box.bounds.left-3&&point.x<box.bounds.right+3&&point.y>box.bounds.top-3&&point.y<box.bounds.bottom+3){hit=true;break;}}if(hit)collisions.push({text:box.text,other:path.hasAttribute('data-force-path')?'arrow:'+path.getAttribute('data-force-path'):'diagram:'+path.getAttribute('data-obstacle')});}}
      const bounds=el.getBoundingClientRect();const overflow=boxes.filter(b=>b.bounds.left<bounds.left||b.bounds.right>bounds.right||b.bounds.top<bounds.top||b.bounds.bottom>bounds.bottom);
      setData(JSON.stringify({frame,scene:el.querySelector('[data-scene]')?.getAttribute('data-scene'),regions:q('[data-region]').length,collisions,overflow,boxes,visuals:q('[data-visual]').map(e=>e.getAttribute('data-visual')),captions:q('[data-caption]').map(e=>e.getAttribute('data-caption')),rings:q('[data-ring]').map(e=>({id:e.getAttribute('data-ring'),target:e.getAttribute('data-ring-target')})),arrows:q('[data-force-id]').map(e=>({id:e.getAttribute('data-force-id'),complete:e.getAttribute('data-force-complete')==='true',end:Number(e.getAttribute('data-force-end'))})),ink:q('[data-ink-text]').map(e=>({text:e.getAttribute('data-ink-text'),complete:e.getAttribute('data-ink-complete')==='true',finishedStrokes:Array.from(e.querySelectorAll('path[stroke-dashoffset]')).every(p=>Number(p.getAttribute('stroke-dashoffset'))===0),strokeEnds:JSON.parse(e.getAttribute('data-ink-stroke-ends')??'[]')})),givens:q('[data-given]').map(e=>e.textContent),schedule:frame===0?SCHEDULE:undefined}));
      if(handle!==null)continueRender(handle);
    };
    request=requestAnimationFrame(measure);return()=>cancelAnimationFrame(request);
  },[frame,enabled,handle]);
  return enabled&&data?<Artifact filename={`verify-force-diagrams-${frame}.json`} content={data}/>:null;
}
export interface MechanicsForceDiagramsProps {audioEnabled?:boolean;audit?:boolean}
export const getMechanicsForceDiagramsDuration=(fps:number)=>scenes.reduce((n,s)=>n+Math.ceil(s.duration*fps),0);
const Narrated:React.FC<{s:Scene;audioEnabled:boolean}>=({s,audioEnabled})=>{
  const t=held(s,useCurrentFrame()/30);
  return <AbsoluteFill data-scene={s.id}><Context.Provider value={{s,t}}><Content s={s} t={t}/></Context.Provider>{audioEnabled&&<Audio src={staticFile(`audio/mechanics/${s.audio}`)}/>}</AbsoluteFill>;
};
export const MechanicsForceDiagrams:React.FC<MechanicsForceDiagramsProps>=({audioEnabled=true,audit=false})=>{
  const ref=useRef<HTMLDivElement>(null);const artifact=useAudit(audit,ref);let from=0;
  return <AbsoluteFill ref={ref} style={{background:T.bg,color:T.text,fontFamily:'Arial, sans-serif'}}>{artifact}{scenes.map(s=>{const start=from,duration=Math.ceil(s.duration*30);from+=duration;return <Sequence key={s.id} from={start} durationInFrames={duration}><Narrated s={s} audioEnabled={audioEnabled}/></Sequence>;})}</AbsoluteFill>;
};
