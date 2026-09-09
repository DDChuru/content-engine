/* Check GPU still repeatability without altering scene data or rendering video. */
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {openBrowser,selectComposition,renderStill}=require('@remotion/renderer');
const root=path.resolve(__dirname,'../..'),serveUrl=path.join(root,'out/verify-return-height-bundle');
(async()=>{const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/google-chrome',chromiumOptions:{gl:'angle'}});try{
const inputProps={audioEnabled:false,audit:true};const composition=await selectComposition({serveUrl,id:'MechanicsAccelerationDueToGravity',inputProps,puppeteerInstance:browser});
for(let i=0;i<3;i++){const output=path.join(root,'out/verify-return-height-stills/verify-repeat-'+i+'.png');await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame:10353,scale:.5,imageFormat:'png',output});console.log(i,crypto.createHash('sha256').update(fs.readFileSync(output)).digest('hex'));}
}finally{await browser.close({silent:true});}})().catch(e=>{console.error(e);process.exitCode=1;});
