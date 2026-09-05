const fs = require('node:fs');
const path = require('node:path');
const { openBrowser } = require('@remotion/renderer');
(async () => {
  const browser = await openBrowser('chrome');
  try {
    const page = await browser.newPage({ context:null,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:null,onLog:()=>{} });
    const result = await page.evaluate(async (outlines,png) => {
      const img=new Image();img.src=`data:image/png;base64,${png}`;await img.decode();
      const canvas=document.createElement('canvas');canvas.width=365;canvas.height=56;const ctx=canvas.getContext('2d',{willReadFrequently:true});
      ctx.drawImage(img,-82,-64);const target=ctx.getImageData(0,0,365,56).data;
      let best={error:Infinity};const scores=[];
      for(const [mode,glyphs] of Object.entries(outlines).filter(([key])=>key.startsWith('body-'))) {
        for(const kern of [0,-.5,-.609375]) {
          ctx.fillStyle='#fff';ctx.fillRect(0,0,365,56);ctx.fillStyle='#939CA8';
          for(const [line,y] of [['536 of 536 checks done (100%)',21],['· 0 cleaning checks missing · confor…',49]]) {
            let x=0,prev='';
            for(const ch of line) {
              if(prev+ch==='ks')x+=kern;if(prev+ch==='fo')x-=.421875;
              const g=glyphs[ch];ctx.save();ctx.translate(x,y);ctx.fill(new Path2D(g.path));ctx.restore();x+=g.advance;prev=ch;
            }
          }
          const data=ctx.getImageData(0,0,365,56).data;let error=0,count=0;
          for(let i=0;i<data.length;i+=4){let d=0;for(let c=0;c<3;c++)d+=Math.abs(data[i+c]-target[i+c]);error+=d;if(d)count++;}
          const score={mode,kern,error,count};scores.push(score);
          if(error<best.error)best={...score,png:canvas.toDataURL()};
        }
      }
      return {best,scores};
    },JSON.parse(fs.readFileSync(path.join(__dirname,'verify-outlines.json'),'utf8')),fs.readFileSync(path.join(__dirname,'../../../public/boh-alt/reconstruct/cleaning-compose.png')).toString('base64'));
    fs.writeFileSync('/tmp/boh-outline-text.png',Buffer.from(result.best.png.split(',')[1],'base64'));delete result.best.png;console.log(result);
  } finally {await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
