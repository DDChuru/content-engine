#!/usr/bin/env node
// Candidate-only evidence, timing, media QA and rendering. No inventory writer.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');const ts=require('typescript');
const root=path.resolve(__dirname,'..'),pub=path.join(root,'public'),source=path.join(root,'src/remedial');
require.extensions['.ts']=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,resolveJsonModule:true,esModuleInterop:true}}).outputText,file);
const c=require(path.join(source,'candidate-contract.ts')),candidate=require(path.join(source,'candidate.json')),timing=require(path.join(source,'candidate-narration.json'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=async p=>new Uint8Array(fs.readFileSync(path.join(pub,p)));
const verify=(data=candidate,narration=timing,reader=read)=>c.verifyCandidateAssets(data,narration,reader,async b=>sha(b));
const output=path.join(root,'out/remedial-action-candidate-v2');fs.mkdirSync(output,{recursive:true});
const save=(name,data)=>fs.writeFileSync(path.join(output,name),JSON.stringify(data,null,2)+'\n');
async function main(){
 await verify();console.log('PASS original Cleaning/source guards and full candidate bytes/provenance');
 let negatives=0;
 for(const mutate of [x=>x.captures.pop(),x=>x.captures[0].siteId='forbidden',x=>x.captures[1].trail='cleaning',x=>x.captures[1].capturedOn='invented',x=>x.captures[1].disclosure='real workplace',x=>x.captures[2].sha256='0'.repeat(64),x=>delete x.bindings['inspection-review/after-required-alert'],x=>x.approvals.daniel='approved',x=>x.limitations.laterDay='An aged example was filmed']){const x=structuredClone(candidate);mutate(x);await assert.rejects(verify(x));negatives++;}
 for(const mutate of [x=>x.beats[1].narration='A failure is a pass.',x=>x.beats[1].from++,x=>x.totalFrames--,x=>x.beats.find(b=>b.id==='inspection-carryover').note='No aged Inspection record was available.',x=>x.beats.find(b=>b.id==='inspection-capture').cues.pop()]){const x=structuredClone(timing);mutate(x);await assert.rejects(verify(candidate,x));negatives++;}
 for(const [mutate,reason] of [
  [x=>{[x.beats[1],x.beats[3]]=[x.beats[3],x.beats[1]]},/Home banner first/],
  [x=>x.beats[1].cues[0].detail={x:.025,y:.647,w:.32,h:.152},/Home follow-up banner/],
  [x=>x.beats[2].cues[1].detail={x:.043,y:.42,w:.914,h:.10},/Home Bill tile/],
  [x=>x.beats[2].emphasisAtFrame=90,/Bill component counts/],
  [x=>x.beats[3].narration+=' This simulation uses an Android emulator.',/production commentary/],
  [x=>x.beats.find(b=>b.id==='inspection-carryover').narration+=' This was filmed eight days later.',/invented filmed ageing/],
 ]){const x=structuredClone(timing);mutate(x);assert.throws(()=>c.assertCandidateReady(candidate,x),reason);negatives++;}
 await assert.rejects(verify(candidate,timing,async p=>{const b=await read(p);if(p===candidate.captures[1].path)b[50]^=1;return b}));negatives++;
 await assert.rejects(verify(candidate,timing,async p=>{if(p===candidate.narration.master.path)throw Error('missing master');return read(p)}));negatives++;
 console.log('PASS',negatives,'negative evidence/copy/approval/audio fixtures');
 for(let f=0;f<timing.totalFrames;f++)assert.equal(timing.beats.filter(b=>f>=b.from&&f<b.from+b.durationInFrames).length,1);
 const cueAlignment=JSON.parse(fs.readFileSync(path.join(pub,candidate.narration.cueAlignment.path)));for(const q of cueAlignment){const beat=timing.beats.find(b=>b.id===q.beat),clip=candidate.narration.clips.find(b=>b.id===q.beat),t=JSON.parse(fs.readFileSync(path.join(pub,clip.transcript.path))),cue=beat.cues.find(c=>c.proof===q.proof);assert.equal(t.words[q.measuredWordIndex].start,q.recordingTime);assert.equal(beat.from+cue.fromFrame,q.fromFrame);assert.equal(cue.fromFrame,18+Math.round(q.recordingTime*30));}
 const clips=[];for(const clip of candidate.narration.clips){const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_format','-show_streams','-of','json',path.join(pub,clip.audio.path)]));assert.equal(probe.streams[0].codec_type,'audio');assert.ok(Math.abs(Number(probe.format.duration)-clip.durationSeconds)<.001);clips.push({id:clip.id,duration:clip.durationSeconds,words:clip.wordCount});}
 console.log('PASS every timeline frame, measured operational cuts and',clips.length,'decoded clip durations; Home/Bill entry and production-copy regression tests');
 const results={status:'PASS',candidateId:c.CANDIDATE_ID,frames:timing.totalFrames,duration:timing.totalFrames/30,newCaptures:20,reusedCleaning:12,negativeFixtures:negatives,measuredCueAnchors:cueAlignment.length,clips,approval:'UNAPPROVED — independent review and Daniel pending',limitations:candidate.limitations};
 save('verify-preflight.json',results);
 if(process.argv.includes('--inventory'))throw Error('Inventory approval/publication remains disabled; Daniel owns sign-off.');
 if(!process.argv.includes('--render')&&!process.argv.includes('--stills'))return;
 const {bundle}=require('@remotion/bundler'),{selectComposition,renderStill,renderMedia,openBrowser}=require('@remotion/renderer');
 const browser=await openBrowser('chrome',{chromiumOptions:{gl:'angle'}});
 try{
 const domSamples=[];let activeSample=null;
 const newPage=browser.newPage.bind(browser);
 browser.newPage=async(...args)=>{
  const page=await newPage(...args),client=page._client(),send=client.send.bind(client);
  client.send=async(method,...args)=>{
   if(method==='Page.captureScreenshot'&&activeSample){
    const result=await page.evaluate(()=>{
     const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};
     const visible=e=>e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true});
     const badges=[...document.querySelectorAll('[data-remedial-simulation]')].filter(visible);
     return {badges:badges.map(e=>({text:e.textContent,rect:rect(e),width:getComputedStyle(e).width,height:getComputedStyle(e).height,color:getComputedStyle(e).color,background:getComputedStyle(e).backgroundColor,fontWeight:getComputedStyle(e).fontWeight})),content:[...document.querySelectorAll('[data-remedial-app],[data-remedial-detail],[data-remedial-copy],[data-remedial-body],[data-remedial-emphasis]')].filter(visible).map(rect),editorial:[...document.querySelectorAll('[data-remedial-note],[data-remedial-disclosure],[data-remedial-preview-label]')].filter(visible).length};
    });
    const beat=timing.beats.find(b=>activeSample.frame>=b.from&&activeSample.frame<b.from+b.durationInFrames),instructional=!['intro','outro'].includes(beat.kind);
    assert.equal(result.editorial,0,'no editorial disclosures/review status in v2');
    assert.equal(result.badges.length,instructional?1:0,'one SIMULATION badge on every instructional scene');
    if(instructional){const badge=result.badges[0];assert.equal(badge.text,'SIMULATION');assert.equal(badge.width,'300px');assert.equal(badge.height,'56px');assert.equal(badge.background,'rgb(255, 211, 72)');assert.equal(badge.fontWeight,'700');for(const box of result.content)assert.ok(badge.rect.right<=box.left||badge.rect.left>=box.right||badge.rect.bottom<=box.top||badge.rect.top>=box.bottom,'SIMULATION badge overlaps instruction or phone');}
    domSamples.push({...activeSample,...result});
   }
   return send(method,...args);
  };
  return page;
 };
 const bundlePath=path.join(output,'verify-bundle');
 const serveUrl=await bundle({entryPoint:path.join(root,'src/index-remedial-candidate.ts'),outDir:bundlePath});
 const opts={serveUrl,puppeteerInstance:browser,chromiumOptions:{gl:'angle'},timeoutInMilliseconds:120000};
 const composition=await selectComposition({...opts,id:c.CANDIDATE_ID});assert.equal(composition.durationInFrames,timing.totalFrames);
 const samples=[];
 for(const beat of timing.beats){samples.push({beat:beat.id,frame:beat.from+Math.min(120,beat.durationInFrames-1)});for(const cue of beat.cues)samples.push({beat:beat.id+'-'+cue.proof,frame:beat.from+cue.focusAtFrame+15});}
 // Reverse seeks prove frame-derived state; stills expose every evidence cue.
 if(!process.argv.includes('--skip-stills'))for(const sample of [...samples].reverse()){activeSample=sample;const file=path.join(output,`verify-frame-${sample.frame}-${sample.beat}.png`);await renderStill({...opts,composition,frame:sample.frame,output:file,imageFormat:'png',scale:.5,overwrite:true});}
 activeSample=null;
 if(domSamples.length){assert.equal(domSamples.length,samples.length);save('verify-banner-layout.json',{status:'PASS',samples:domSamples});}
 if(process.argv.includes('--skip-stills')){const report=JSON.parse(fs.readFileSync(path.join(output,'verify-banner-layout.json')));assert.equal(report.status,'PASS');assert.equal(report.samples.length,samples.length);for(const sample of samples)assert.ok(fs.existsSync(path.join(output,`verify-frame-${sample.frame}-${sample.beat}.png`)));console.log('PASS',samples.length,'existing candidate stills and banner layout report reused');}
 else console.log('PASS',samples.length,'candidate stills rendered, reverse seek order');
 save('verify-still-samples.json',samples);
 if(process.argv.includes('--render')){
 const file=path.join(output,'remedial-action-review-candidate-v2.mp4');
 await renderMedia({...opts,composition,outputLocation:file,codec:'h264',crf:18,pixelFormat:'yuv420p',audioCodec:'aac',audioBitrate:'192k',imageFormat:'jpeg',jpegQuality:95,concurrency:4,overwrite:false,onProgress:({progress})=>{const n=Math.floor(progress*100);if(n%10===0&&n!==main.last){main.last=n;console.log('RENDER',n+'%');}}});
 save('verify-render-identity.json',{path:file,bytes:fs.statSync(file).size,sha256:sha(fs.readFileSync(file)),durationSeconds:timing.totalFrames/30});console.log('MP4',file);
 // Retain the unadjusted output. The established encoder adds 2048 AAC samples
 // at 48 kHz; the final encoded QA must confirm zero-lag master correlation.
 const aligned=path.join(output,'remedial-action-review-candidate-v2-audio-aligned.mp4');
 execFileSync('ffmpeg',['-v','error','-n','-i',file,'-itsoffset','-0.042666666667','-i',file,'-map','0:v:0','-map','1:a:0','-c','copy','-avoid_negative_ts','disabled','-movflags','+faststart',aligned]);
 save('verify-aligned-identity.json',{path:aligned,bytes:fs.statSync(aligned).size,sha256:sha(fs.readFileSync(aligned)),durationSeconds:timing.totalFrames/30,audioAdvanceSeconds:2048/48000});console.log('ALIGNED MP4',aligned);
 }
 }finally{await browser.close({silent:true});}
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1});
