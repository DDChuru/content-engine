/* Gravity still audit, based on verify-m42-stills.cjs, with moving-story samples. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {bundle}=require('@remotion/bundler');
const {openBrowser,selectComposition,renderStill}=require('@remotion/renderer');
const sharp=require('sharp');
const root=path.resolve(__dirname,'../..');
const [prefix='acceleration-due-to-gravity',id='MechanicsAccelerationDueToGravity',entry='verify-acceleration-entry.tsx']=process.argv.slice(2);
const output=path.join(root,'out','verify-'+prefix+'-stills');
const transcript=JSON.parse(fs.readFileSync(path.join(root,'src/remotion/public/transcripts/mechanics',prefix+'.json')));
const proofHash=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'src/remotion/compositions/MechanicsAccelerationDueToGravity.tsx'))).update(JSON.stringify(transcript)).digest('hex');
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const serveUrl=await bundle({entryPoint:path.join(__dirname,entry),publicDir:null,webpackOverride:config=>({...config,resolve:{...config.resolve,modules:[process.env.NODE_PATH,'node_modules'].filter(Boolean)}}),outDir:path.join(root,'out','verify-'+prefix+'-bundle')});
 let browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/google-chrome',chromiumOptions:{gl:'angle'}});
 try{
 const inputProps={audioEnabled:false,audit:true};
 const composition=await selectComposition({serveUrl,id,inputProps,puppeteerInstance:browser});
 const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(path.join(output,f+'.png'))).digest('hex');
 const stabilize=async h=>{h.retries=0;while(hash(h.start)!==hash(h.end)&&h.retries<3){h.retries++;for(const frame of [h.start,h.end])await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame,scale:.5,imageFormat:'png',output:path.join(output,frame+'.png')});}h.identical=hash(h.start)===hash(h.end);};
 if(process.argv.includes('--resume-holds')){
  const saved=JSON.parse(fs.readFileSync(path.join(output,'verify-measurements.json')));
  for(const h of saved.holdResults)if(!h.identical)await stabilize(h);
  saved.issues=saved.issues.filter(issue=>issue.reason!=='hold changed'||!saved.holdResults.find(h=>h.start===issue.start)?.identical);
  fs.writeFileSync(path.join(output,'verify-measurements.json'),JSON.stringify(saved,null,2)+'\n');console.log(JSON.stringify({issues:saved.issues,holds:saved.holdResults}));assert.equal(saved.issues.length,0);return;
 }
 assert.equal(composition.width,1920);assert.equal(composition.height,1080);assert.equal(composition.fps,30);assert(composition.durationInFrames>=8100&&composition.durationInFrames<=9900,'Duration must be 4:30–5:30');
 const frames=new Map(),holds=[],offsets={};let offset=0;
 const add=(frame,label)=>{if(frame>=composition.durationInFrames)return;if(!frames.has(frame))frames.set(frame,[]);frames.get(frame).push(label);};
 for(const s of transcript.scenes){offsets[s.id]=offset;add(offset,s.id+':start');add(offset+Math.ceil(s.duration*30)-1,s.id+':end');
  for(const b of s.beats){if(b.id==='story')for(const p of [.05,.25,.5,.75,.95])add(offset+Math.round((b.cue+(b.speechEnd-b.cue)*p)*30),s.id+':story-motion-'+p);add(offset+Math.ceil(b.cue*30)+1,s.id+':'+b.id+':cue');if(b.ink){add(offset+Math.ceil(b.penEnd*30),s.id+':'+b.id+':pen-finish');add(offset+Math.round((b.cue+b.penEnd)*15),s.id+':'+b.id+':writing');}}
  for(const e of s.figureEvents.filter(e=>e.kind==='spoken'))add(offset+Math.ceil(e.start*30)+4,s.id+':ring:'+e.id);
  for(const h of s.holds){const a=offset+Math.ceil(h.start*30),b=offset+Math.ceil(h.end*30)-1;add(a,s.id+':hold-start');add(b,s.id+':hold-end');holds.push([a,b]);}
  offset+=Math.ceil(s.duration*30);
 }
 const items=[...frames].sort((a,b)=>a[0]-b[0]);const rows=[];let next=0;
 await Promise.all(Array.from({length:1},async()=>{while(next<items.length){const [frame,labels]=items[next++];let row;
  const checkpoint=path.join(output,'verify-frame-'+frame+'.json');
  if(fs.existsSync(checkpoint)) {const saved=JSON.parse(fs.readFileSync(checkpoint));if(saved.proofHash===proofHash&&fs.existsSync(path.join(output,frame+'.png')))row=saved.row;}
  if(!row)for(let attempt=0;attempt<3;attempt++) {
   try {
    await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame,timeoutInMilliseconds:90000,scale:.5,imageFormat:'png',output:path.join(output,frame+'.png'),onArtifact:a=>{row=JSON.parse(Buffer.from(a.content).toString());}});
    assert(row,'Missing DOM artifact');fs.writeFileSync(checkpoint,JSON.stringify({proofHash,row}));break;
   }catch(error){if(attempt===2)throw error;await browser.close({silent:true}).catch(()=>{});browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/google-chrome',chromiumOptions:{gl:'angle'}});}
  }
  assert(row,'Missing DOM artifact');rows.push({...row,labels});if(rows.length%25===0)console.log('Stills',rows.length,'/',items.length);
  if(rows.length%75===0){await browser.close({silent:true});browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/google-chrome',chromiumOptions:{gl:'angle'}});}
 }}));
 rows.sort((a,b)=>a.frame-b.frame);const issues=[];
 for(const row of rows){
  if(row.regions>3||row.collisions.length||row.overflow.length||!row.visuals.length)issues.push({frame:row.frame,reason:'layout',regions:row.regions,collisions:row.collisions,overflow:row.overflow});
  for(const text of row.captions)if(text.split(/\s+/).length>8)issues.push({frame:row.frame,reason:'caption too long',text});
  const pixels=await sharp(path.join(output,row.frame+'.png')).raw().toBuffer({resolveWithObject:true});let nonblank=0;
  for(const v of row.visuals){const b=v.bounds,scale=pixels.info.width/row.root.width;const x0=Math.max(0,Math.round((b.left-row.root.left)*scale)),y0=Math.max(0,Math.round((b.top-row.root.top)*scale));const x1=Math.min(pixels.info.width,Math.round((b.right-row.root.left)*scale)),y1=Math.min(pixels.info.height,Math.round((b.bottom-row.root.top)*scale));for(let y=y0;y<y1;y+=3)for(let x=x0;x<x1;x+=3){const i=(y*pixels.info.width+x)*pixels.info.channels;if(Math.abs(pixels.data[i]-23)+Math.abs(pixels.data[i+1]-28)+Math.abs(pixels.data[i+2]-32)>50)nonblank++;}}
  if(nonblank<100)issues.push({frame:row.frame,reason:'blank visual pixels'});
  const s=transcript.scenes.find(s=>s.id===row.scene);
  for(const label of row.labels.filter(l=>l.includes(':ring:'))){const event=s.figureEvents.find(e=>label.endsWith(':ring:'+e.id));if(!row.rings.some(r=>r.target===event.target))issues.push({frame:row.frame,reason:'missing ring',event});}
  if(s&&row.ink.length&&['rest','displacement','distance'].includes(s.mode))for(const given of ['given-poly','given-range','given-origin'])if(!row.givens.some(g=>g.id===given))issues.push({frame:row.frame,reason:'missing given',given});
 }
 const holdResults=holds.map(([a,b])=>({start:a,end:b,identical:hash(a)===hash(b)}));
 for(const h of holdResults)if(!h.identical)await stabilize(h);
 for(const h of holdResults)if(!h.identical)issues.push({...h,reason:'hold changed'});
 const report={durationFrames:composition.durationInFrames,durationSeconds:composition.durationInFrames/30,stillCount:rows.length,penFinishStills:rows.filter(r=>r.labels.some(l=>l.endsWith('pen-finish'))).length,spokenRingChecks:rows.reduce((n,r)=>n+r.labels.filter(l=>l.includes(':ring:')).length,0),maxRegions:Math.max(...rows.map(r=>r.regions)),holdResults,issues,measurements:rows};
 fs.writeFileSync(path.join(output,'verify-measurements.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,measurements:undefined},null,2));assert.equal(issues.length,0,'See verify-measurements.json');
 }finally{await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
