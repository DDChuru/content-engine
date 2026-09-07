/* Prove the still audit rejects the reported caption overlap and right-edge overflow. */
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {bundle}=require('@remotion/bundler');
const {openBrowser,selectComposition,renderStill}=require('@remotion/renderer');
const root=path.resolve(__dirname,'../..');
(async()=>{
 const output=path.join(root,'out/verify-travel-ink-regression');
 fs.mkdirSync(output,{recursive:true});
 // Restore the overlapping caption row; move its last value 20 px farther right
 // to exercise definite full-stroke overflow independently of the moving pen.
 const source=fs.readFileSync(path.join(root,'src/remotion/compositions/MechanicsDrawingTravelGraphs.tsx'),'utf8')
   .replace("'../public/transcripts/mechanics/drawing-travel-graphs.json'",JSON.stringify(path.join(root,'src/remotion/public/transcripts/mechanics/drawing-travel-graphs.json')))
   .replace('x={rowX(i)} y={616} size={23*rowScale}','x={i===0?110:i===1?350:580} y={616} size={23}')
   .replace('        <circle cx={xFor(sPlot,sUntil)}', '<text x={180} y={638} fill={T.ink} fontSize={25}>Chord: average velocity; tangent: changing velocity</text>\n        <circle cx={xFor(sPlot,sUntil)}');
 assert(source.includes('x={i===0?110:i===1?350:580}'),'Regression layout was not injected');
 fs.writeFileSync(path.join(output,'verify-travel-ink-regression.tsx'),source);
 fs.writeFileSync(path.join(output,'verify-travel-ink-entry.tsx'),fs.readFileSync(path.join(__dirname,'verify-travel-v4-entry.tsx'),'utf8').replace('../remotion/compositions/MechanicsDrawingTravelGraphs','./verify-travel-ink-regression'));
 const serveUrl=await bundle({entryPoint:path.join(output,'verify-travel-ink-entry.tsx'),publicDir:null,outDir:path.join(output,'verify-bundle')});
 const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/google-chrome',chromiumOptions:{gl:'angle'}});
 try {
   const inputProps={audioEnabled:false,audit:true};
   const composition=await selectComposition({serveUrl,id:'MechanicsDrawingTravelGraphs',inputProps,puppeteerInstance:browser});
   let measured;
   await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame:9591,scale:.5,imageFormat:'png',output:path.join(output,'verify-original-defect.png'),onArtifact:artifact=>{measured=JSON.parse(Buffer.from(artifact.content).toString());}});
   assert(measured.inkCollisions.some(line=>line.collisions.some(text=>text.startsWith('Chord:'))),'Audit missed the original caption overlap');
   const line=measured.inkLayouts.find(line=>line.text==='v: positive to 0');
   const graph=measured.inkLayouts.find(line=>line.panel==='displacement').panelBounds;
   assert(line.bounds.right>graph.right,'Fixture no longer overflows the graph panel');
   assert(measured.inkOverflow.some(line=>line.text==='v: positive to 0'),'Audit missed the full-stroke right-edge overflow');
   fs.writeFileSync(path.join(output,'verify-regression.json'),JSON.stringify({frame:9591,captionOverlapDetected:true,panelOverflowDetected:true,inkCollisions:measured.inkCollisions,inkOverflow:measured.inkOverflow},null,2)+'\n');
   console.log('Caption-overlap regression and full-stroke overflow fixture both rejected.');
 } finally {await browser.close({silent:true});}
})().catch(error=>{console.error(error);process.exitCode=1;});
