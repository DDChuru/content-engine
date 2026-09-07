import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, Artifact, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {HandwrittenLine, prepareLine} from './Ink';
export const T={bg:'#171c20',paper:'#f6f3eb',ink:'#273238',text:'#e9e7e0',muted:'#a9afad',accent:'#3f9e89',grid:'#c8cfca'};
export type Beat={id:string;text:string;start:number;end:number;speechEnd:number;cue:number;penEnd:number;hold:number;ink?:string;page?:number;target?:string;caption?:string};
export type Scene={id:string;title:string;mode:string;audio:string;duration:number;beats:Beat[];cues:Record<string,number>;holds:{start:number;end:number;kind:string;duration:number}[];figureEvents:{id:string;start:number;end?:number;target:string;kind:string;word?:string;wordIndex?:number}[]};
export const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const at=(s:Scene,id:string)=>{if(s.cues[id]===undefined)throw Error(`Missing cue ${s.id}:${id}`);return s.cues[id];};
export const between=(t:number,a:number,b:number)=>clamp((t-a)/Math.max(.01,b-a));
export const held=(s:Scene,t:number)=>s.holds.find(h=>t>=h.start&&t<h.end)?.start??t;
export const currentBeat=(s:Scene,t:number)=>s.beats.filter(b=>t>=b.cue).at(-1);
const Context=React.createContext<{s:Scene;t:number}|null>(null);
export const Figure:React.FC<{id:string;x:number;y:number;children:string;size?:number;ink?:boolean}>=({id,x,y,children,size=30,ink=false})=>{
 const context=React.useContext(Context);const ref=useRef<SVGTextElement>(null);const [box,setBox]=useState({x:0,width:children.length*size*.56});
 const events=context?.s.figureEvents.filter(e=>e.target===id&&context.t>=e.start&&context.t<(e.end??e.start+1.5)+.2)??[];
 const event=events.filter(e=>e.kind==='spoken').at(-1)??events.at(-1);
 useLayoutEffect(()=>{
  const text=ref.current;if(!text)return;
  const numbers:Record<string,string>={zero:'0',one:'1',two:'2',three:'3',four:'4',six:'6',eight:'8',nine:'9',twelve:'12'};
  const spoken=event?.word?.toLowerCase().replace(/[^a-z0-9]/g,'')??'';
  const value=numbers[spoken]??(/^\d+$/.test(spoken)?spoken:undefined);
  const match=value?Array.from<RegExpMatchArray>(String(children).matchAll(/−?\d+(?:\.\d+)?/g)).find(m=>m[0].replace('−','')===value):undefined;
  setBox(match?{x:text.getSubStringLength(0,match.index!),width:text.getSubStringLength(match.index!,match[0].length)}:{x:0,width:text.getComputedTextLength()});
 },[children,size,event?.id]);
 const width=box.width,ringX=x+box.x;
 const p=event?clamp(((context?.t??0)-event.start+1/30)/.4):0;
 const rx=width/2+12,ry=size*.7;
 const d=Array.from({length:65},(_,i)=>{const a=i/64*Math.PI*2,w=1+.025*Math.sin(3*a);return `${i?'L':'M'}${ringX+width/2+rx*Math.cos(a)*w} ${y-size*.32+ry*Math.sin(a)*w}`;}).join(' ');
 return <g><text ref={ref} data-figure-id={id} data-label="true" x={x} y={y} fontSize={size} fill={ink?T.ink:T.text}>{children}</text>{event&&<path data-ring={event.id} data-ring-target={id} data-ring-kind={event.kind} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1-p} fill="none" stroke={T.accent} strokeWidth={3}/>}</g>;
};
export const Caption:React.FC<{text?:string;x?:number;y?:number}>=({text,x=50,y=690})=>text?<g data-caption={text}><rect x={x-15} y={y-34} width={Math.min(800,text.length*16+30)} height={53} rx={7} fill="#b9bcb2"/><text data-label="true" x={x} y={y} fontSize={27} fill={T.ink}>{text}</text></g>:null;
export const Paper:React.FC<{s:Scene;t:number;problem:string[]}>=({s,t,problem})=>{
 const written=s.beats.filter(b=>b.ink&&t>=b.cue);const page=written.at(-1)?.page??0;
 if(!written.length)return <svg data-region="problem" width={790} height={730} style={{position:'absolute',left:1050,top:230}}><rect x={0} y={130} width={790} height={230} rx={10} fill="#b9bcb2"/>{problem.map((line,i)=><g key={line}><text data-label="true" data-problem-line="true" x={35} y={190+65*i} fill={T.ink} fontSize={30}>{line}</text>{i===Math.min(2,s.beats.filter(b=>t>=b.cue).length-1)&&<path d={`M35 ${203+65*i} H${35+Math.min(710,line.length*15)}`} stroke={T.accent} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1-between(t,currentBeat(s,t)?.cue??0,(currentBeat(s,t)?.cue??0)+.7)}/>}</g>)}</svg>;
 const lines=s.beats.filter(b=>b.ink&&(b.page??0)===page);
 return <svg data-region="paper" data-visual="paper" width={790} height={730} style={{position:'absolute',left:1050,top:230}}>
  <rect data-paper="true" x={0} y={0} width={790} height={730} rx={12} fill={T.paper}/>
  {Array.from({length:9},(_,i)=><line key={i} x1={35} x2={750} y1={105+i*70} y2={105+i*70} stroke={T.grid} strokeWidth={1}/>)}
  {lines.map((b,i)=>{const size=Math.min(34,705/prepareLine(b.ink!,1).width);return t>=b.cue?<g key={b.id} data-ink-id={b.id}><HandwrittenLine text={b.ink!} frame={t*30} start={b.cue*30} end={b.penEnd*30} x={42} y={60+i*105} size={size}/>{b.hold>0&&t>=b.penEnd&&t<=b.end+b.hold&&<path d={`M40 ${107+i*105} Q360 ${115+i*105} ${Math.min(749,45+prepareLine(b.ink!,size).width)} ${107+i*105}`} fill="none" stroke={T.accent} strokeWidth={3}/>}</g>:null;})}
 </svg>;
};
export const Motif:React.FC=()=> <g><path d="M80 520 H760 M120 580 V170" fill="none" stroke={T.muted} strokeWidth={4}/><path d="M120 470 C270 100 420 170 510 390 S680 540 740 270" fill="none" stroke={T.accent} strokeWidth={9}/><circle cx={510} cy={390} r={12} fill={T.accent}/></g>;
export const Cart:React.FC<{x:number;y?:number}>=({x,y=430})=><g data-cart-x={x} transform={`translate(${x} ${y})`}><rect x={-42} y={-37} width={84} height={45} rx={7} fill={T.accent}/><circle cx={-25} cy={16} r={14} fill={T.text}/><circle cx={25} cy={16} r={14} fill={T.text}/><path d="M-47 35 H50" stroke={T.muted} strokeWidth={2}/></g>;
export function duration(scenes:Scene[],fps:number){return scenes.reduce((n,s)=>n+Math.ceil(s.duration*fps),0);}
function useAudit(enabled:boolean,root:React.RefObject<HTMLDivElement|null>){
 const frame=useCurrentFrame();const [data,setData]=useState('');const [handle]=useState(()=>enabled?delayRender('Measure M4.2 still'):null);
 useLayoutEffect(()=>{if(!enabled||!root.current)return;let request=0;const measure=()=>{
 const el:HTMLDivElement=root.current!;if(el.getBoundingClientRect().width<1900){request=requestAnimationFrame(measure);return;}const visible=(e:Element)=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&!e.closest('[style*="display: none"]');};
 const boxes=Array.from<Element>(el.querySelectorAll('[data-label], [data-ink-text]')).filter(visible).map(e=>{const ink=e.hasAttribute('data-ink-text');const b=(ink?e.querySelector('[data-ink-extent]')!:e).getBoundingClientRect();return {text:e.getAttribute('data-ink-text')??e.textContent,ink,bounds:b.toJSON()};});
 const collisions=[];for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i].bounds,b=boxes[j].bounds;if(a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top)collisions.push([boxes[i].text,boxes[j].text]);}
 const bound=el.getBoundingClientRect();const overflow=boxes.filter(x=>x.bounds.left<bound.left||x.bounds.right>bound.right||x.bounds.top<bound.top||x.bounds.bottom>bound.bottom);
 const q=(selector:string)=>Array.from<Element>(el.querySelectorAll(selector)).filter(visible);
 setData(JSON.stringify({frame,scene:el.querySelector('[data-scene]')?.getAttribute('data-scene'),regions:q('[data-region]').length,collisions,overflow,boxes,visuals:q('[data-visual]').map(e=>({id:e.getAttribute('data-visual'),bounds:e.getBoundingClientRect().toJSON()})),root:bound.toJSON(),givens:q('[data-figure-id]').map(e=>({id:e.getAttribute('data-figure-id'),text:e.textContent})),rings:q('[data-ring]').map(e=>({id:e.getAttribute('data-ring'),target:e.getAttribute('data-ring-target'),kind:e.getAttribute('data-ring-kind')})),ink:q('[data-ink-text]').map(e=>({text:e.getAttribute('data-ink-text'),end:Number(e.getAttribute('data-ink-end')),complete:e.getAttribute('data-ink-complete')==='true',strokeEnds:JSON.parse(e.getAttribute('data-ink-stroke-ends')??'[]')})),captions:q('[data-caption]').map(e=>e.getAttribute('data-caption')),cart:el.querySelector('[data-cart-x]')?.getAttribute('data-cart-x')}));
 if(handle!==null)continueRender(handle);
 };request=requestAnimationFrame(measure);return()=>cancelAnimationFrame(request);},[frame,enabled,handle]);
 return enabled&&data?<Artifact filename={`verify-m42-${frame}.json`} content={data}/>:null;
}
const NarratedScene:React.FC<{s:Scene;audioEnabled:boolean;content:React.FC<{s:Scene;t:number}>}>=({s,audioEnabled,content:Content})=>{const t=held(s,useCurrentFrame()/30);return <AbsoluteFill data-scene={s.id}><div data-region="header" data-label="true" style={{position:'absolute',left:90,top:65,fontSize:52,fontWeight:600}}>{s.mode==='opening'&&currentBeat(s,t)?.id.startsWith('outcome')?'By the end you can...':s.title}</div><Context.Provider value={{s,t}}><Content s={s} t={t}/></Context.Provider>{audioEnabled&&<Audio src={staticFile(`audio/mechanics/${s.audio}`)}/>}</AbsoluteFill>;};
export const Lesson:React.FC<{scenes:Scene[];content:React.FC<{s:Scene;t:number}>;audioEnabled?:boolean;audit?:boolean}>=({scenes,content,audioEnabled=true,audit=false})=>{const ref=useRef<HTMLDivElement>(null);const artifact=useAudit(audit,ref);const {fps}=useVideoConfig();let offset=0;return <AbsoluteFill ref={ref} style={{background:T.bg,color:T.text,fontFamily:'Arial, sans-serif'}}>{artifact}{scenes.map(s=>{const from=offset;offset+=Math.ceil(s.duration*fps);return <Sequence key={s.id} from={from} durationInFrames={Math.ceil(s.duration*fps)}><NarratedScene s={s} audioEnabled={audioEnabled} content={content}/></Sequence>;})}</AbsoluteFill>;};
