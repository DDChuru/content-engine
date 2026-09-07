/* Still-only audit. Never invokes renderMedia or a video-render command. */
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {bundle}=require('@remotion/bundler');
const {openBrowser,selectComposition,renderStill}=require('@remotion/renderer');
const root=path.resolve(__dirname,'../..');
const output=path.join(root,'out/verify-travel-v4-stills');
const transcript=JSON.parse(fs.readFileSync(path.join(root,'src/remotion/public/transcripts/mechanics/drawing-travel-graphs.json')));
const ts=require('typescript');
const compositionSource=fs.readFileSync(path.join(root,'src/remotion/compositions/MechanicsDrawingTravelGraphs.tsx'),'utf8');
const physicsSource=compositionSource.slice(compositionSource.indexOf('const WORD_MODEL:'),compositionSource.indexOf('interface PlotSpec'));
const physics=Function(ts.transpileModule(physicsSource,{compilerOptions:{target:ts.ScriptTarget.ES2020}}).outputText+';return {stateAt,LIFT_MODEL,BALL_MODEL,WORD_MODEL};')();
const near=(actual,expected)=>assert(Math.abs(actual-expected)<1e-8,`${actual} != ${expected}`);
for(const [t,v,s] of [[0,0,0],[2,3,3],[6,3,15],[8,0,18]]){const p=physics.stateAt(physics.LIFT_MODEL,t);near(p.velocity,v);near(p.displacement,s);}
for(const [t,v,s] of [[0,15,0],[1.5,0,11.25],[3,-15,0]]){const p=physics.stateAt(physics.BALL_MODEL,t);near(p.velocity,v);near(p.displacement,s);}
for(const [t,s] of [[0,0],[4,12],[6,15],[9,15],[14,0]])near(physics.stateAt(physics.WORD_MODEL,t).displacement,s);
for(const model of [physics.LIFT_MODEL,physics.BALL_MODEL,physics.WORD_MODEL])for(const phase of model.phases){const t=(phase.start+phase.end)/2,h=.0001;near((physics.stateAt(model,t+h).displacement-physics.stateAt(model,t-h).displacement)/(2*h),physics.stateAt(model,t).velocity);}
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const serveUrl=await bundle({entryPoint:path.join(__dirname,'verify-travel-v4-entry.tsx'),publicDir:null,outDir:path.join(root,'out/verify-travel-v4-bundle-code')});
 const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/google-chrome',chromiumOptions:{gl:'angle'}});
 try {
 const inputProps={audioEnabled:false,audit:true};
 const composition=await selectComposition({serveUrl,id:'MechanicsDrawingTravelGraphs',inputProps,puppeteerInstance:browser});
 const frames=new Map(),holds=[],sceneOffsets={};
 const add=(frame,label,scene)=>{if(!frames.has(frame))frames.set(frame,{frame,labels:[],scene});frames.get(frame).labels.push(label);};
 let offset=0;
 for(const scene of transcript.scenes){
   sceneOffsets[scene.id]=offset;
   add(offset+20,`${scene.id}:opening`,scene.id);
   if(scene.id==='s01')add(offset+150,'s01:outcomes',scene.id);
   for(const [id,time] of Object.entries(scene.cues))add(offset+Math.ceil(time*30)+15,`${scene.id}:${id}`,scene.id);
   for(const h of scene.holds||[]){
     if(h.kind!=='hold')continue;
     const start=offset+Math.ceil(h.start*30),end=start+59;
     add(start,`${scene.id}:hold-start`,scene.id);add(end,`${scene.id}:hold-end`,scene.id);holds.push({start,end,scene:scene.id});
   }
   if(scene.id==='s09'){
     for(const [phase,a,b] of [['cruise','cruise-story','slow-story'],['brake','slow-story','rest-story'],['rest','rest-story','return-story'],['return','return-story','displacement']])
       for(const fraction of [.25,.5,.75])add(offset+Math.round((scene.cues[a]+fraction*(scene.cues[b]-scene.cues[a]))*30),`s09:motion-${phase}-${fraction}`,scene.id);
     add(offset+Math.floor(scene.cues.velocity*30)-1,'s09:displacement-complete',scene.id);
   }
   offset+=Math.ceil(scene.duration*30);
 }
 const items=[...frames.values()].sort((a,b)=>a.frame-b.frame);
 const measurements=[];
 // Reuse one browser; modest concurrency keeps host B responsive.
 let cursor=0;
 await Promise.all(Array.from({length:2},async()=>{
   while(cursor<items.length){const item=items[cursor++];let measured;
     await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame:item.frame,timeoutInMilliseconds:90000,scale:.5,imageFormat:'png',output:path.join(output,`${item.frame}.png`),onArtifact:artifact=>{measured=JSON.parse(Buffer.from(artifact.content).toString());}});
     assert(measured,`Missing DOM audit for ${item.frame}`);
     measurements.push({...item,...measured});
     fs.writeFileSync(path.join(output,`${item.frame}.json`),JSON.stringify(measured));
     console.log('Verified still',item.frame);
   }
 }));
 const violations=[];
 for(const row of measurements){
   if(row.axisCollisions.length||row.overflow)violations.push(row);
   const cap=['s04','s06','s01','s08'].includes(row.scene)?4:3;
   if(row.regions>cap)violations.push({...row,reason:'region count'});
   if(row.scene==='s09'&&row.labels.some(x=>x==='s09:displacement-complete'))assert.deepEqual(row.graphs,['displacement']);
 }
 const closing=transcript.scenes.find(s=>s.id==='s09');
 for(const row of measurements.filter(r=>r.scene==='s09')) {
   assert(row.regions>=1,'Text-only cyclist frame');
   if(row.frame<sceneOffsets.s09+closing.cues.velocity*30)assert(!row.graphs.includes('velocity'),'Velocity appeared before displacement was finished');
 }
 const motion={};
 for(const phase of ['cruise','brake','rest','return']) {
   const samples=[.25,.5,.75].map(f=>measurements.find(r=>r.labels.includes(`s09:motion-${phase}-${f}`)).cyclist);
   const dx=[samples[1].x-samples[0].x,samples[2].x-samples[1].x];
   if(phase==='brake')assert(dx[0]>dx[1]&&dx[1]>0,'Braking must visibly slow');
   else if(phase==='rest')assert(dx.every(x=>Math.abs(x)<.001),'Cyclist must rest');
   else {assert(Math.abs(dx[1]-dx[0])<.12*Math.abs(dx[0]),'Cruise/return must be steady');assert(phase==='cruise'?dx[0]>0:dx[0]<0,'Wrong travel direction');}
   motion[phase]={samples,dx};
 }
 const hash=frame=>crypto.createHash('sha256').update(fs.readFileSync(path.join(output,`${frame}.png`))).digest('hex');
 const holdResults=[];
 for(const h of holds){
   let retries=0;
   // Chrome occasionally changes a few raster-edge pixels between independent pages.
   // Retry the pair, but retain the strict byte-identical hold requirement.
   while(hash(h.start)!==hash(h.end)&&retries<3){
     retries++;
     for(const frame of [h.start,h.end])await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame,scale:.5,imageFormat:'png',output:path.join(output,`${frame}.png`)});
   }
   holdResults.push({...h,retries,identical:hash(h.start)===hash(h.end)});
 }
 const report={motion,durationFrames:composition.durationInFrames,durationSeconds:composition.durationInFrames/30,stillCount:measurements.length,axisCollisionCount:measurements.reduce((n,r)=>n+r.axisCollisions.length,0),maxRegions:Math.max(...measurements.map(r=>r.regions)),holdResults,violations,measurements};
 fs.writeFileSync(path.join(output,'verify-measurements.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({stills:report.stillCount,collisions:report.axisCollisionCount,violations:violations.length,movingHolds:holdResults.filter(h=>!h.identical).length}));
 assert.equal(violations.length,0,'See verify-measurements.json');
 assert(holdResults.every(h=>h.identical),'A silent hold moved');
 } finally {await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
