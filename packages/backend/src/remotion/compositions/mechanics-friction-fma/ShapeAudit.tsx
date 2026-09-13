import React,{useLayoutEffect,useState} from 'react';
import {Artifact,continueRender,delayRender,useCurrentFrame} from 'remotion';
import transcript from '../../public/transcripts/mechanics/coefficient-of-friction-f-equals-ma.json';
export const FrictionFmaShapeAudit:React.FC=()=>{
 const frame=useCurrentFrame(),[handle]=useState(()=>delayRender('Friction force geometry')),[data,setData]=useState('');
 useLayoutEffect(()=>{let req=0;const run=()=>{
  const stage=document.querySelector('svg[data-visual="diagram"]');if(!stage||stage.getBoundingClientRect().width<900){req=requestAnimationFrame(run);return;}
  const bounds=stage.getBoundingClientRect(),sid=stage.closest('[data-scene]')?.getAttribute('data-scene'),scene=transcript.scenes.find(s=>s.id===sid);
  const shapes=Array.from(stage.querySelectorAll('path,rect,circle')).filter(e=>!e.closest('defs')).map(e=>({kind:e.tagName,force:e.hasAttribute('data-force-arrow'),name:e.getAttribute('data-force-arrow'),opacity:e.getAttribute('opacity'),d:e.getAttribute('d'),bounds:e.getBoundingClientRect().toJSON()}));
  const overflow=shapes.filter(s=>s.bounds.left<bounds.left+4||s.bounds.right>bounds.right-4||s.bounds.top<bounds.top+4||s.bounds.bottom>bounds.bottom-4);
  const rings=Array.from(stage.querySelectorAll('path[data-ring]')).map(e=>{
   const target=e.getAttribute('data-ring-target'),event=scene?.figureEvents.find(q=>q.id===e.getAttribute('data-ring')),label=stage.querySelector(`text[data-figure-id="${target}"]`) as SVGTextElement;
   const matches=Array.from((label?.textContent??'').matchAll(/−?\d+(?:\.\d+)?(?:√\d+)?|√\d+/g)),match=matches.find(m=>m[0]===event?.word),r=e.getBoundingClientRect();
   const left=match?label.getBoundingClientRect().left+label.getSubStringLength(0,match.index!):null,width=match?label.getSubStringLength(match.index!,match[0].length):null;
   return {target,value:event?.word,label:label?.textContent,matched:!!match,expectedLeft:left,expectedWidth:width,centerError:left!==null&&width!==null?Math.abs(r.left+r.width/2-left-width/2):null,widthError:width!==null?Math.abs(r.width-width-24):null,bounds:r.toJSON()};
  });
  setData(JSON.stringify({frame,stage:bounds.toJSON(),shapes,overflow,rings}));continueRender(handle);
 };req=requestAnimationFrame(run);return()=>cancelAnimationFrame(req);},[frame,handle]);
 return data?<Artifact filename={`friction-fma-shapes-${frame}.json`} content={data}/>:null;
};
