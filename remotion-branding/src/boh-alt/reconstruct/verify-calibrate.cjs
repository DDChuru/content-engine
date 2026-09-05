// Measures browser glyph placement against the untouched crop; writes calibration evidence.
const fs = require('node:fs');
const path = require('node:path');
const { openBrowser } = require('@remotion/renderer');
const root = path.resolve(__dirname, '../../..');
(async () => {
  const browser = await openBrowser('chrome');
  try {
    const page = await browser.newPage({ context: null, logLevel: 'error', indent: false, pageIndex: 0, onBrowserLog: null, onLog: () => {} });
    const result = await page.evaluate(async (png, ttf) => {
      const face = new FontFace('DM Sans', `url(data:font/ttf;base64,${ttf})`);
      document.fonts.add(face); await face.load();
      const img = new Image(); img.src = `data:image/png;base64,${png}`; await img.decode();
      const src = document.createElement('canvas');src.width=660;src.height=148;
      const sctx=src.getContext('2d');sctx.drawImage(img,0,0);
      const target=sctx.getImageData(82,64,365,56).data;
      const canvas=document.createElement('canvas');canvas.width=365;canvas.height=56;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      function score(p) {
        ctx.fillStyle='#fff';ctx.fillRect(0,0,365,56);ctx.fillStyle='#939CA8';
        ctx.font=`${p.size}px "DM Sans"`;ctx.letterSpacing=`${p.tracking}px`;
        ctx.fillText('536 of 536 checks done (100%)',p.x,p.y-64);
        ctx.fillText('· 0 cleaning checks missing · confor'+p.ellipsis,p.x,p.y-64+p.leading);
        const data=ctx.getImageData(0,0,365,56).data;let error=0,count=0;
        for(let i=0;i<data.length;i+=4){const d=Math.abs(data[i]-target[i])+Math.abs(data[i+1]-target[i+1])+Math.abs(data[i+2]-target[i+2]);error+=d;if(d)count++;}
        return {error,count};
      }
      let best={size:21,tracking:0,x:0,y:85,leading:28,ellipsis:'…'};let min=score(best);
      for(let round=0;round<4;round++) {
        for(const [key,values] of Object.entries({size:Array.from({length:41},(_,i)=>20.5+i*.025),tracking:Array.from({length:21},(_,i)=>i*.01),x:Array.from({length:25},(_,i)=>-.5+i*.0625),y:Array.from({length:49},(_,i)=>84+i*.0625),leading:Array.from({length:33},(_,i)=>27+i*.0625),ellipsis:['…','...']})) {
          for(const value of values) {const p={...best,[key]:value};const s=score(p);if(s.error<min.error){best=p;min=s;}}
        }
      }
      score(best); return {best,...min,png:canvas.toDataURL()};
    }, fs.readFileSync(path.join(root,'public/boh-alt/reconstruct/cleaning-compose.png')).toString('base64'), fs.readFileSync(path.join(root,'public/ccv-tutorial/fonts/DMSans_400Regular.ttf')).toString('base64'));
    fs.writeFileSync('/tmp/boh-calibrated-text.png',Buffer.from(result.png.split(',')[1],'base64'));
    delete result.png;
    fs.writeFileSync(path.join(__dirname,'verify-calibration.json'),JSON.stringify(result,null,2)+'\n');
    console.log(result);
  } finally {await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
