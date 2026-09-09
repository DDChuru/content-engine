/* Re-render the reviewed S07 with its original source and transcript as a control. */
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const {bundle}=require('@remotion/bundler');
const {openBrowser,selectComposition,renderStill}=require('@remotion/renderer');
const root=path.resolve(__dirname,'../..'),repo=path.resolve(root,'../..');
(async()=>{const work=path.join(root,'out/verify-return-height-baseline');fs.mkdirSync(work,{recursive:true});
let source=cp.execFileSync('git',['show','4bf0414:packages/backend/src/remotion/compositions/MechanicsAccelerationDueToGravity.tsx'],{cwd:repo,encoding:'utf8'});
source=source.replace('../public/transcripts/mechanics/acceleration-due-to-gravity.json','./verify-baseline-transcript.json').replace('./mechanics-m42/Presentation',path.join(root,'src/remotion/compositions/mechanics-m42/Presentation')).replace('./mechanics-m42/Ink',path.join(root,'src/remotion/compositions/mechanics-m42/Ink'));
fs.writeFileSync(path.join(work,'verify-baseline.tsx'),source);
const baselineTranscript=JSON.parse(cp.execFileSync('git',['show','4bf0414:packages/backend/src/remotion/public/transcripts/mechanics/acceleration-due-to-gravity.json'],{cwd:repo}));
const currentTranscript=JSON.parse(fs.readFileSync(path.join(root,'src/remotion/public/transcripts/mechanics/acceleration-due-to-gravity.json')));
// Align the absolute timeline; S07 source, words and relative frame remain original.
baselineTranscript.scenes.find(s=>s.id==='s04').duration=currentTranscript.scenes.find(s=>s.id==='s04').duration;
fs.writeFileSync(path.join(work,'verify-baseline-transcript.json'),JSON.stringify(baselineTranscript));
fs.writeFileSync(path.join(work,'verify-baseline-entry.tsx'),"import React from 'react';import {Composition,registerRoot} from 'remotion';import {MechanicsAccelerationDueToGravity,getMechanicsAccelerationDueToGravityDuration} from './verify-baseline';registerRoot(()=> <Composition id='MechanicsAccelerationDueToGravity' component={MechanicsAccelerationDueToGravity} width={1920} height={1080} fps={30} durationInFrames={getMechanicsAccelerationDueToGravityDuration(30)}/>);");
const serveUrl=await bundle({entryPoint:path.join(work,'verify-baseline-entry.tsx'),publicDir:null,outDir:path.join(work,'verify-bundle'),webpackOverride:c=>({...c,resolve:{...c.resolve,modules:[path.join(root,'node_modules'),'node_modules']}})});
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/google-chrome',chromiumOptions:{gl:'angle'}});try{
const inputProps={audioEnabled:false,audit:true},composition=await selectComposition({serveUrl,id:'MechanicsAccelerationDueToGravity',inputProps,puppeteerInstance:browser});const output=path.join(work,'verify-baseline-s07.png');
await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame:10353,scale:.5,imageFormat:'png',output});
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');const report={baselineSourceCommit:'4bf0414',baselineFrame:10353,currentFrame:10353,timelineAligned:true,baselineRenderedSha256:sha(output),currentRenderedSha256:sha(path.join(root,'out/verify-return-height-stills/10353.png'))};
fs.writeFileSync(path.join(root,'projects/mechanics-acceleration-due-to-gravity/verify-return-height-baseline.json'),JSON.stringify(report,null,2)+'\n');console.log(report);
}finally{await browser.close({silent:true});}})().catch(e=>{console.error(e);process.exitCode=1;});
