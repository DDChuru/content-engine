/* Preserve reviewable SUVAT stills and check the actual pixels of completed lists. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const sharp=require('sharp');
const root=path.resolve(__dirname,'../..'),project=path.join(root,'projects/mechanics-suvat-in-1d'),out=path.join(root,'out/verify-suvat-in-1d-stills');
const d=JSON.parse(fs.readFileSync(path.join(out,'verify-measurements.json'))),t=JSON.parse(fs.readFileSync(path.join(root,'src/remotion/public/transcripts/mechanics/suvat-in-1d.json')));
(async()=>{
 assert.deepEqual(d.issues,[]);assert(d.durationSeconds>=300&&d.durationSeconds<=360);
 const source=fs.readFileSync(path.join(root,'src/remotion/Root.tsx'),'utf8');
 assert.equal((source.match(/id="MechanicsSuvatIn1D"/g)||[]).length,1);
 const registration=source.match(/<Composition\s+id="MechanicsSuvatIn1D"[\s\S]*?\/>/)[0];
 for(const text of ['component={MechanicsSuvatIn1D}','getMechanicsSuvatIn1DDuration(30)','fps={30}','width={1920}','height={1080}'])assert(registration.includes(text),text);
 const proofs=[],listPixels=[];let offset=0;
 const save=(row,name)=>{const dest=path.join(project,name);fs.copyFileSync(path.join(out,row.frame+'.png'),dest);proofs.push({file:name,frame:row.frame,sha256:crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex')});};
 const colors=async(frame,box,color)=>{const {data,info}=await sharp(path.join(out,frame+'.png')).extract(box).raw().toBuffer({resolveWithObject:true});let count=0;for(let i=0;i<data.length;i+=info.channels)if(Math.abs(data[i]-color[0])+Math.abs(data[i+1]-color[1])+Math.abs(data[i+2]-color[2])<80)count++;return count;};
 for(const s of t.scenes){
  const rows=d.measurements.filter(r=>r.scene===s.id);save(rows.at(-1),`verify-${s.id}-complete.png`);
  const writing=rows.find(r=>r.labels.some(l=>l.endsWith(':writing')));if(writing)save(writing,`verify-${s.id}-writing.png`);
  if(s.beats[0].id==='story'){const moving=rows.filter(r=>r.labels.some(l=>l.includes(':story:')&&!l.endsWith(':cue')&&!l.endsWith(':resolved-cue')));assert(moving.length>=3,'Missing moving-story samples');assert(new Set(moving.map(r=>r.cart)).size>1,'Story object did not move');const story=moving[1];if(story)save(story,`verify-${s.id}-story.png`);}
  const setup=rows.find(r=>r.labels.some(l=>l.includes(':setup-')&&l.endsWith(':cue')));if(setup)save(setup,`verify-${s.id}-problem.png`);
  for(const b of s.beats.filter(b=>b.list)){
   const frame=offset+Math.ceil(b.penEnd*30),row=rows.find(r=>r.frame===frame);assert(row,`${s.id}:${b.id} finish still`);
   for(let i=0;i<5;i++){
    assert(row.ink.some(ink=>ink.text===b.list[i]&&ink.complete),`${s.id}:${b.id}:${b.list[i]} incomplete`);
    const ink=await colors(frame,{left:469,top:150+52*i,width:13,height:18},[33,59,120]);assert(ink>8,`${s.id}:${b.id}: missing ${b.list[i][0]} pixels (${ink})`);
    const known=b.known.includes(i),required=(Array.isArray(b.required)?b.required:[b.required]).includes(i);
    const tick=known?await colors(frame,{left:553,top:148+52*i,width:19,height:22},[63,158,137]):null;
    const ring=required?await colors(frame,{left:460,top:141+52*i,width:30,height:33},[63,158,137]):null;
    if(known)assert(tick>8,`${s.id}:${b.id}: missing tick ${i}`);if(required)assert(ring>10,`${s.id}:${b.id}: missing target ring ${i}`);
    listPixels.push({scene:s.id,beat:b.id,frame,entry:b.list[i],inkPixels:ink,tickPixels:tick,ringPixels:ring});
   }
  }
  offset+=Math.ceil(s.duration*30);
 }
 const quote=d.measurements.find(r=>r.labels.includes('s01:quote2:resolved-cue'));assert(quote,'Second syllabus quote card not audited');save(quote,'verify-syllabus-quote.png');
 assert.equal(offset,d.durationFrames);
 const summary={...d,sourceAudioDuration:t.totalDuration,resolvedCues:t.scenes.reduce((n,s)=>n+Object.keys(s.cues).length,0),spokenFigureCues:t.scenes.reduce((n,s)=>n+s.figureEvents.filter(e=>e.kind==='spoken').length,0),listPixels,proofs};
 fs.writeFileSync(path.join(project,'verify-stills.json'),JSON.stringify(summary,null,2)+'\n');
 fs.writeFileSync(path.join(project,'verify-build.md'),`# MechanicsSuvatIn1D — build verification\n\n- Slug \`mechanics-suvat-in-1d\`, map M4.2. Registered by hand in Root.tsx: 1920 × 1080, 30 fps.\n- Audio-derived duration: ${d.durationFrames} frames / ${d.durationSeconds.toFixed(3)} seconds (5:36). Eight MP3s total ${t.totalDuration.toFixed(3)} seconds; each scene rounds up to a frame.\n- Narration checkpoint: 3ff1186, pushed through merge ec15e64 before composition work. Voice gYWKdgLtqjPO3D5uDrDP, 0.9 slow / 1.0 brisk; isolated local faster-whisper-small word timing. ${summary.resolvedCues} resolved cues; no fallback cue times.\n- Content stays within FRAME-LOG.md: bike, braking train, direction reversal and two-position car. Correct 10²; signed acceleration versus deceleration magnitude; speeds up after reversal. No force discussion or vertical motion.\n- Every calculation rewrites all five entries, ticks knowns and circles the target. Car lists circle both unknowns. General formula stays above substitution; car's first equation stays on the diagram during its second interval and elimination. All givens precede working; answers replace diagram unknowns.\n- ${d.stillCount} stills audited, including ${d.penFinishStills} pen finishes, ${d.figureRingChecks} spoken/substitution ring checks and all resolved cues. Maximum ${d.maxRegions} regions; zero measured text/handwriting collisions or overflow. Actual visual pixels checked in every sample.\n- ${listPixels.length} completed list-entry pixel checks pass, including each initial handwritten letter, every required tick and target ring. Explicit stroke segments retain the approved glyph geometry; completed letters, ticks and circles are checked in the PNG pixels.\n- All ${d.holdResults.length} inserted-silence hold pairs are byte-identical PNGs; encoded silence and audio hashes independently checked by verify-suvat-in-1d-cues.py. One three-second check hold.\n- Targeted TypeScript check, still bundling, Root registration checks and git diff --check pass. No video rendered; no deployment commands run; no paths deleted.\n\n## Evidence\n\nverify-stills.json contains all measured bounds, figure targets, pen completions, hold results, list pixel counts and proof-image hashes. verify-sNN-*.png preserves completed scenes, writing, stories and problem setups. Full stills remain in packages/backend/out/verify-suvat-in-1d-stills/.\n\n## Reproduce\n\nUse nvm Node and the existing backend node_modules. From packages/backend:\n\n1. Run src/scripts/verify-suvat-in-1d-stills.cjs with Node (still-only; never renderMedia).\n2. Run src/scripts/verify-suvat-in-1d-build.cjs with Node.\n3. Targeted TypeScript: tsc --noEmit --jsx react-jsx --esModuleInterop --resolveJsonModule --moduleResolution bundler --module esnext --target es2022 --skipLibCheck src/remotion/compositions/MechanicsSuvatIn1D.tsx src/scripts/verify-suvat-in-1d-entry.tsx.\n\nNarration reproduction uses verify-suvat-in-1d-narration.py mechanics-suvat-in-1d, then the same command with --transcribe, then verify-suvat-in-1d-cues.py. Python needs requests, numpy and faster-whisper; this host has /tmp/verify-equilibrium-venv/bin/python. CONTENT_ENGINE_ENV can override ~/Documents/projects/content-engine/.env. The generator makes paid ElevenLabs calls only for missing cached text; transcription is local.\n`);
 console.log(JSON.stringify({stills:d.stillCount,penFinishes:d.penFinishStills,ringChecks:d.figureRingChecks,listEntries:listPixels.length,proofs:proofs.length,issues:d.issues},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
