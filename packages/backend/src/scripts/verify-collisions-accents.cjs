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
      if(event.start+delta>=scenes.find(scene=>scene.id===event.scene).duration)continue;
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
  // A laid-out DOM can occasionally precede Chromium's painted screenshot.
  // Check actual pixels for every capture, and retry a blank image rather than
  // accepting its otherwise-valid layout artifact.
  fs.writeFileSync(path.join(output,'verify-pixel-plan.json'),JSON.stringify(rows.map(row=>row.frame)));
  const blankFrames=()=>JSON.parse(cp.execFileSync('python3',['-c',`import importlib.util,json\nfrom pathlib import Path\np=${JSON.stringify(path.join(__dirname,'verify-mechanics-multiple-collisions.py'))}\ns=importlib.util.spec_from_file_location('verify_collisions',p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)\nout=Path(${JSON.stringify(output)});bad=[]\nfor frame in json.loads((out/'verify-pixel-plan.json').read_text()):\n row=json.loads((out/f'verify-{frame:05d}.json').read_text());row=row.get('measurement',row)\n try:m.assert_visible_pixels(row,out/f'{frame:05d}.png')\n except AssertionError:bad.append(frame)\nprint(json.dumps(bad))`],{encoding:'utf8'}));
  const blankCaptureRetries=[];
  let blank=blankFrames();
  for(let attempt=0;blank.length&&attempt<3;attempt++){
    for(const frame of blank){blankCaptureRetries.push(frame);Object.assign(rows.find(row=>row.frame===frame),await capture(frame));}
    blank=blankFrames();
  }
  assert.deepEqual(blank,[],'Blank still after retries');
  const violations=[];
  for(const row of rows){
    const missing=row.expectedRings.filter(expected=>!row.figureRings.some(ring=>{
      const word=(expected.word??'').toLowerCase().replace(/[^a-z0-9]/g,'');
      const number=({one:1,two:2,three:3,four:4})[word]??(/^[1-4]$/.test(word)?Number(word):undefined);
      return ring.target===expected.target&&ring.encloses&&ring.progress>0&&(number===undefined||Number((ring.targetText??'').match(/\d+/)?.[0])===number);
    }));
    const missingUnderline=row.expectedUnderlines.filter(id=>!row.underlines.includes(id));
    if(row.regions>3||row.overflow||row.textCollisions.length||row.figureRings.some(ring=>!ring.encloses)||missing.length||missingUnderline.length)violations.push({frame:row.frame,missing,missingUnderline,textCollisions:row.textCollisions,overflow:row.overflow,regions:row.regions});
  }
  const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(path.join(output,`${String(f).padStart(5,'0')}.png`))).digest('hex');
  const holdResults=[];
  for(const [start,end,duration] of plan.holds){
    const annotationCueOverlap=initial.figureSchedule.filter(event=>event.kind==='spoken'&&offsets[event.scene]+Math.ceil(event.start*30)>=start&&offsets[event.scene]+Math.ceil(event.start*30)<=end).map(event=>event.id);
    let retries=0;while(hash(start)!==hash(end)&&retries<3&&!annotationCueOverlap.length){retries++;await capture(start);await capture(end);}
    holdResults.push({start,end,duration,retries,identical:hash(start)===hash(end),annotationCueOverlap});
  }
  const report={pixelCheckedStillCount:rows.length,blankCaptureRetries,durationFrames:composition.durationInFrames,stillCount:rows.length,spokenFigureCount:initial.figureSchedule.filter(e=>e.kind==='spoken').length,substitutionSourceCount:initial.figureSchedule.filter(e=>e.kind==='substitution').length,phraseCount:initial.phraseSchedule.length,figureSchedule:initial.figureSchedule,phraseSchedule:initial.phraseSchedule,holdResults,violations,measurements:rows};
  fs.writeFileSync(path.join(output,'verify-accent-measurements.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({stills:rows.length,spokenFigures:report.spokenFigureCount,substitutionSources:report.substitutionSourceCount,violations:violations.length,annotationOnlyHolds:holdResults.filter(h=>!h.identical&&h.annotationCueOverlap.length).length,unexpectedMovingHolds:holdResults.filter(h=>!h.identical&&!h.annotationCueOverlap.length).length}));
  assert.equal(violations.length,0,'See verify-accent-measurements.json');assert(holdResults.every(h=>h.identical||h.annotationCueOverlap.length),'Hold moved without a spoken annotation cue');
  // Replay every existing physics, pixel, setup, handwriting and contact assertion
  // against these fresh captures using the original verifier's hashed cache.
  const bundleDir=path.join(root,'out/verify-collisions-accent-bundle');
  const bundleHash=crypto.createHash('sha256');
  for(const name of fs.readdirSync(bundleDir).filter(name=>name.endsWith('.js')).sort()){bundleHash.update(name);bundleHash.update(fs.readFileSync(path.join(bundleDir,name)));}
  const bundleSha256=bundleHash.digest('hex');
  for(const row of rows)fs.writeFileSync(path.join(output,`verify-${String(row.frame).padStart(5,'0')}.json`),JSON.stringify({bundleSha256,imageSha256:hash(row.frame),measurement:row}));
  console.log(cp.execFileSync('python3',[path.join(__dirname,'verify-mechanics-multiple-collisions.py'),'--bundle',bundleDir,'--output',output,'--workers','2','--reuse-stills'],{encoding:'utf8',maxBuffer:10*1024*1024}));
 }finally{await browser.close({silent:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
