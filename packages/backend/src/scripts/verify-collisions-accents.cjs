/* Complete still-only collision audit, including spoken and substituted figure accents. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),cp=require('node:child_process');
const {bundle}=require('@remotion/bundler');
const {openBrowser,selectComposition,renderStill}=require('@remotion/renderer');
const root=path.resolve(__dirname,'../..'),output=path.join(root,'out/verify-collisions-accent-stills');
const scenes=JSON.parse(fs.readFileSync(path.join(root,'src/remotion/public/transcripts/mechanics/multiple-collisions.json'))).scenes;
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const serveUrl=await bundle({entryPoint:path.join(__dirname,'verify-collisions-accent-entry.tsx'),publicDir:null,outDir:path.join(root,'out/verify-collisions-accent-bundle')});
 const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/google-chrome',chromiumOptions:{gl:'angle'}});
 try {
  const inputProps={audioEnabled:false,audit:true};
  const composition=await selectComposition({serveUrl,id:'MechanicsMultipleCollisions',inputProps,puppeteerInstance:browser});
  async function capture(frame){let row;await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame,scale:.5,imageFormat:'png',output:path.join(output,`${String(frame).padStart(5,'0')}.png`),onArtifact:a=>{row=JSON.parse(Buffer.from(a.content).toString());}});assert(row,`Missing measurement ${frame}`);fs.writeFileSync(path.join(output,`verify-${String(frame).padStart(5,'0')}.json`),JSON.stringify(row));return row;}
  const initial=await capture(0);
  const plan=JSON.parse(cp.execFileSync('python3',['-c',`import importlib.util,json\np=${JSON.stringify(path.join(__dirname,'verify-mechanics-multiple-collisions.py'))}\ns=importlib.util.spec_from_file_location('verify_collisions',p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)\nscenes=json.loads(m.TRANSCRIPT.read_text())['scenes'];frames,holds=m.audit_frames(scenes)\nprint(json.dumps({'frames':frames,'holds':holds}))`],{encoding:'utf8'}));
  const frames=new Map(Object.entries(plan.frames).map(([f,labels])=>[Number(f),{frame:Number(f),cueLabels:labels,expectedRings:[],expectedUnderlines:[]}]));
  const offsets={};let offset=0;for(const s of scenes){offsets[s.id]=offset;offset+=Math.ceil(s.duration*30);}
  const add=(frame,label)=>{if(!frames.has(frame))frames.set(frame,{frame,cueLabels:[],expectedRings:[],expectedUnderlines:[]});const row=frames.get(frame);row.cueLabels.push(label);return row;};
  for(const event of initial.figureSchedule){
    for(const delta of [0,.4,1.5]){
      if(event.kind==='substitution'&&event.start+delta>event.end)continue;
      const f=offsets[event.scene]+Math.ceil((event.start+delta)*30);
      const row=add(f,`${event.id}:${delta}`);
      // The exact word/pen cue must identify its source; later samples also audit
      // complete ellipse clearance, allowing a later reference to replace it.
      if(delta===0)row.expectedRings.push({target:event.target,id:event.id,kind:event.kind,word:event.word});
    }
  }
  for(const phrase of initial.phraseSchedule)for(const t of [phrase.start,(phrase.start+phrase.end)/2,phrase.end])add(offsets.s07+Math.ceil(t*30),phrase.id).expectedUnderlines.push(phrase.id);
  const items=[...frames.values()].sort((a,b)=>a.frame-b.frame),rows=[];let cursor=0;
  await Promise.all(Array.from({length:2},async()=>{while(cursor<items.length){const item=items[cursor++];const row=item.frame===0?initial:await capture(item.frame);rows.push({...row,...item});console.log('Verified still',item.frame);}}));
  const violations=[];
  for(const row of rows){
    const missing=row.expectedRings.filter(expected=>!row.figureRings.some(ring=>ring.target===expected.target&&ring.encloses&&ring.progress>0));
    const missingUnderline=row.expectedUnderlines.filter(id=>!row.underlines.includes(id));
    if(row.regions>3||row.overflow||row.textCollisions.length||row.figureRings.some(ring=>!ring.encloses)||missing.length||missingUnderline.length)violations.push({frame:row.frame,missing,missingUnderline,textCollisions:row.textCollisions,overflow:row.overflow,regions:row.regions});
  }
  const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(path.join(output,`${String(f).padStart(5,'0')}.png`))).digest('hex');
  const holdResults=[];
  for(const [start,end,duration] of plan.holds){let retries=0;while(hash(start)!==hash(end)&&retries<3){retries++;await capture(start);await capture(end);}holdResults.push({start,end,duration,retries,identical:hash(start)===hash(end)});}
  const report={durationFrames:composition.durationInFrames,stillCount:rows.length,spokenFigureCount:initial.figureSchedule.filter(e=>e.kind==='spoken').length,substitutionSourceCount:initial.figureSchedule.filter(e=>e.kind==='substitution').length,phraseCount:initial.phraseSchedule.length,figureSchedule:initial.figureSchedule,phraseSchedule:initial.phraseSchedule,holdResults,violations,measurements:rows};
  fs.writeFileSync(path.join(output,'verify-measurements.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({stills:rows.length,spokenFigures:report.spokenFigureCount,substitutionSources:report.substitutionSourceCount,violations:violations.length,movingHolds:holdResults.filter(h=>!h.identical).length}));
  assert.equal(violations.length,0,'See verify-measurements.json');assert(holdResults.every(h=>h.identical),'Hold moved');
 }finally{await browser.close({silent:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
