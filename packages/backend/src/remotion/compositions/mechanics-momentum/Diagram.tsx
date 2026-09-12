import React from 'react';
import {Caption, Figure, T} from '../mechanics-m42/Presentation';

export const Diagram:React.FC<{children:React.ReactNode}>=({children})=>
 <svg data-region="diagram" data-visual="diagram" width={900} height={800} style={{position:'absolute',left:80,top:190}}>{children}</svg>;

export const Arrow:React.FC<{x:number;y:number;dx:number;accent?:boolean;dashed?:boolean}>=({x,y,dx,accent=false,dashed=false})=>{
 const end=x+dx,sign=Math.sign(dx);
 return <path d={`M${x} ${y} H${end} M${end-sign*14} ${y-10} L${end} ${y} L${end-sign*14} ${y+10}`} fill="none" stroke={accent?T.accent:T.text} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed?'8 7':undefined}/>;
};

// Wheel centres are 14 px above the rail, with radius 14: both contact points
// lie exactly on the track. Body width represents the object, not a mass scale.
const Trolley:React.FC<{id:string;x:number;rail:number;accent?:boolean}>=({id,x,rail,accent=false})=>
 <g data-trolley={id} data-trolley-x={x} data-rail-y={rail} transform={`translate(${x} ${rail})`}>
  <rect x={-48} y={-62} width={96} height={40} rx={7} fill={T.muted} stroke={accent?T.accent:undefined} strokeWidth={3}/>
  {[-30,30].map(wheel=><g key={wheel}><circle data-wheel="true" cx={wheel} cy={-14} r={14} fill={T.text}/><circle cx={wheel} cy={-14} r={4} fill={T.ink}/></g>)}
  <Figure id={`label-${id.toLowerCase()}`} x={-12} y={-34} size={28} ink>{id}</Figure>
 </g>;

export const Motif:React.FC<{momentum?:boolean}>=({momentum=false})=><Diagram>
 <path d="M80 480 H820" stroke={T.muted} strokeWidth={4}/>
 <Trolley id="A" x={350} rail={480} accent/>
 <Figure id="symbol-mass" x={330} y={370} size={36}>m</Figure>
 <Arrow x={500} y={355} dx={180}/><Figure id="symbol-velocity" x={570} y={325} size={36}>v</Figure>
 {momentum&&<><Arrow x={500} y={580} dx={180} accent/><Figure id="symbol-momentum" x={570} y={640} size={36}>p</Figure></>}
 </Diagram>;

export interface PairProps {
 xA:number;xB:number;givens?:boolean;positive?:'right'|'left';snapshot?:boolean;
 velocityA?:string;velocityB?:string;momentumA?:string;momentumB?:string;
 compare?:boolean;caption?:string;focus?:'a'|'b';
}
export const Pair:React.FC<PairProps>=({xA,xB,givens=false,positive='right',snapshot=false,velocityA,velocityB,momentumA,momentumB,compare=false,caption,focus})=>
 <Diagram>
  {givens&&<><text data-label="true" x={30} y={35} fill={T.text} fontSize={29}>{positive==='right'?'Right is positive':'Left is positive'}</text><Arrow x={positive==='right'?365:525} y={25} dx={positive==='right'?160:-160}/></>}
  <text data-label="true" x={30} y={givens?90:65} fill={T.muted} fontSize={26}>{snapshot?'Separate tracks · snapshot':'Separate parallel tracks'}</text>
  {[{id:'A',x:xA,rail:300,side:'a' as const,mass:'2',speed:'6',velocity:velocityA,momentum:momentumA},{id:'B',x:xB,rail:620,side:'b' as const,mass:'3',speed:'4',velocity:velocityB,momentum:momentumB}].map(({id,x,rail,side,mass,speed,velocity,momentum})=><g key={id} data-track={id}>
   <path d={`M55 ${rail} H845`} stroke={T.muted} strokeWidth={3}/>
   <Trolley id={id} x={x} rail={rail} accent={focus===side}/>
   {givens&&<>
    <Figure id={`mass-${side}`} x={x-42} y={rail-90} size={30}>{`${mass} kg`}</Figure>
    <Figure id={`speed-${side}`} x={side==='a'?x+180:x-270} y={rail-118} size={30}>{`${speed} m/s`}</Figure>
    <Arrow x={side==='a'?x+180:x-150} y={rail-90} dx={side==='a'?144:-96}/>
    <Figure id={`velocity-${side}`} x={30} y={rail+60} size={29}>{`${id}: v = ${velocity??'?'}${velocity?' m/s':''}`}</Figure>
    <Figure id={`momentum-${side}`} x={440} y={rail+60} size={29}>{`${id}: p = ${momentum??'?'}${momentum?' kg m/s':''}`}</Figure>
    {momentum&&<Arrow x={side==='a'?500:680} y={rail+98} dx={side==='a'?180:-180} accent={compare||focus===side}/>}
   </>}
  </g>)}
  <Caption text={caption} x={30} y={765}/>
 </Diagram>;
