/** M4.3a: a source-bounded signed-momentum comparison on separate tracks. */
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import transcript from '../public/transcripts/mechanics/momentum.json';
import {T, Scene, Lesson, Paper, at, between, currentBeat, duration, held} from './mechanics-m42/Presentation';
import {Motif, Pair} from './mechanics-momentum/Diagram';
import {storyPositions} from './mechanics-momentum/motion';

const SCENES=transcript.scenes as unknown as Scene[];
const STORY=SCENES.find(s=>s.mode==='story')!;
const OUTCOMES=['Calculate momentum.',"Use momentum's units.","Interpret momentum's direction."];
const PROBLEM=['Separate tracks. Take right as positive.','Find each signed momentum.','Compare their magnitudes and directions.'];
const CHECK=['Same masses and motion. Left is positive.','Find both signed momenta.','Does either trolley turn around?'];

export interface MechanicsMomentumProps {audioEnabled?:boolean;audit?:boolean}
export const getMechanicsMomentumDuration=(fps:number)=>duration(SCENES,fps);

// A missing required cue throws through at(); optional cues are absent only in
// scenes which do not introduce that result. No estimated speech timestamps.
function useCue(s:Scene,id:string|undefined){
 const frame=useCurrentFrame();const {fps}=useVideoConfig();
 return id!==undefined&&held(s,frame/fps)>=at(s,id);
}

const Outcome:React.FC<{s:Scene;index:number}>=({s,index})=>{
 const visible=useCue(s,`outcome${index+1}`);
 return visible?<g><text data-label="true" x={s.mode==='recap'?75:35} y={320+index*100} fill={T.ink} fontSize={31}>{OUTCOMES[index]}</text>{s.mode==='recap'&&<path d={`M28 ${309+index*100} l12 14 l23 -30`} fill="none" stroke={T.accent} strokeWidth={5} strokeLinecap="round"/>}</g>:null;
};
const Outcomes:React.FC<{s:Scene}>=({s})=>{
 const quote=useCue(s,s.mode==='opening'?'quote':undefined);
 return <svg data-region="outcomes" width={790} height={650} style={{position:'absolute',left:1050,top:230}}>
  <rect x={0} y={45} width={790} height={560} rx={12} fill="#b9bcb2"/>
  {quote&&<><text data-label="true" x={35} y={105} fill={T.ink} fontSize={25}>Cambridge 9709 · page 32 · excerpt</text><text data-label="true" x={35} y={170} fill={T.ink} fontSize={31}>“use the definition of linear momentum”</text></>}
  {[0,1,2].map(index=><Outcome key={index} s={s} index={index}/>)}
 </svg>;
};

const Question:React.FC<{s:Scene;t:number}>=({s,t})=>{
 const lines=s.mode==='check'?CHECK:PROBLEM;
 const keys=['condition-line','ask-line','compare-line'];
 return <svg data-region="problem" width={790} height={520} style={{position:'absolute',left:1050,top:300}}>
  <rect x={0} y={80} width={790} height={290} rx={12} fill="#b9bcb2"/>
  {lines.map((line,i)=>{const cue=s.cues[keys[i]];return <g key={line}><text data-label="true" data-problem-line="true" x={35} y={145+i*85} fill={T.ink} fontSize={30}>{line}</text>{cue!==undefined&&t>=cue&&<path d={`M35 ${158+i*85} H${35+line.length*14.2}`} fill="none" stroke={T.accent} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1-between(t,cue,cue+.65)}/>}</g>;})}
 </svg>;
};
const Working:React.FC<{s:Scene;t:number}>=({s,t})=>s.beats.some(b=>b.ink&&t>=b.cue)?<Paper s={s} t={t} problem={s.mode==='check'?CHECK:PROBLEM}/>:<Question s={s} t={t}/>;

const Comparison:React.FC<{s:Scene;t:number}>=({s,t})=>{
 const check=s.mode==='check',recap=s.mode==='recap',workB=s.mode==='work-b';
 const aResult=useCue(s,s.mode==='work-a'||check?'result-a':undefined);
 const bResult=useCue(s,workB||check?'result-b':undefined);
 const aSigned=useCue(s,s.mode==='work-a'||check?'signed-a':undefined);
 const bSigned=useCue(s,workB||check?'signed-b':undefined);
 const contrast=useCue(s,workB?'contrast':undefined);
 const fixed=storyPositions(at(STORY,'freeze'),at(STORY,'story'),at(STORY,'pass'),at(STORY,'freeze'),STORY.holds);
 const velocityA=recap?'−6':check?(aSigned?'−6':undefined):workB||aSigned?'+6':undefined;
 const velocityB=recap?'+4':check?(bSigned?'+4':undefined):bSigned?'−4':undefined;
 const momentumA=recap?'−12':check?(aResult?'−12':undefined):workB||aResult?'+12':undefined;
 const momentumB=recap?'+12':check?(bResult?'+12':undefined):bResult?'−12':undefined;
 return <Pair {...fixed} givens snapshot positive={check||recap?'left':'right'} velocityA={velocityA} velocityB={velocityB} momentumA={momentumA} momentumB={momentumB} compare={contrast} caption={recap?undefined:currentBeat(s,t)?.caption} focus={s.mode==='work-a'?'a':workB?'b':undefined}/>;
};

const Definition:React.FC<{s:Scene;t:number}>=({s,t})=>{
 const vector=useCue(s,'momentum-direction');
 return <><Motif momentum={vector}/><Paper s={s} t={t} problem={['Momentum follows the moving trolley.']}/></>;
};
const Story:React.FC<{s:Scene;t:number}>=({s,t})=>{
 const snapshot=useCue(s,'freeze');
 const positions=storyPositions(t,at(s,'story'),at(s,'pass'),at(s,'freeze'),s.holds);
 return <Pair {...positions} snapshot={snapshot}/>;
};
const Content:React.FC<{s:Scene;t:number}>=({s,t})=>{
 if(s.mode==='opening')return <><Motif/><Outcomes s={s}/></>;
 if(s.mode==='definition')return <Definition s={s} t={t}/>;
 if(s.mode==='story')return <Story s={s} t={t}/>;
 if(s.mode==='recap')return <><Comparison s={s} t={t}/><Outcomes s={s}/></>;
 return <><Comparison s={s} t={t}/>{s.mode==='setup'?<Question s={s} t={t}/>:<Working s={s} t={t}/>}</>;
};
export const MechanicsMomentum:React.FC<MechanicsMomentumProps>=(props)=><Lesson scenes={SCENES} content={Content} {...props}/>;
