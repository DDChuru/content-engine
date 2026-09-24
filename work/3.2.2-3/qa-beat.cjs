// Stills for each cue (0.8 s after it), the beat end, and error-marker boundaries, for LOOKING before approval.
const P=__dirname,N='/home/user/deps/node_modules';module.paths.unshift(N);process.env.NODE_PATH=N;require('module').Module._initPaths();process.env.FONTCONFIG_FILE=P+'/render-cache/fonts.conf';process.env.XDG_CACHE_HOME=P+'/render-cache';process.env.RAYON_NUM_THREADS='3';
const fs=require('fs'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),sharp=require('sharp'),normalise=require('./raster-svg.cjs'),{Lesson,stateAt,isError}=require('./render-cache/Lesson.cjs'),T=require('./timeline.json'),fingerprint=require('./beat-fingerprint.cjs');sharp.concurrency(3);
const id=Number(process.argv[2]),extra=(process.argv[3]||'').split(',').filter(Boolean).map(Number),sc=T.scenes.find(s=>s.id===id);if(!sc)throw Error('Unknown beat');const dir=P+'/qa/beat-'+String(id).padStart(2,'0');fs.mkdirSync(dir,{recursive:true});
for(const f of fs.readdirSync(dir))if(/\.(png|svg)$/.test(f))fs.unlinkSync(dir+'/'+f);
(async()=>{const entries=sc.cues.map((c,i)=>({id:c.id+'-'+c.key,frame:sc.startFrame+Math.round(Math.min(c.localTime+.8,sc.cues[i+1]?sc.cues[i+1].localTime-.04:sc.duration-.04)*30)}));entries.push({id:'END',frame:sc.startFrame+sc.frames-1});
for(const x of extra)entries.push({id:'T'+x.toFixed(1),frame:sc.startFrame+Math.round(x*30)});
for(let k=1;k<sc.frames;k++){const f=sc.startFrame+k;if(isError(stateAt(f))!==isError(stateAt(f-1)))entries.push({id:'BEFORE-CORRECTION',frame:f-1},{id:'CORRECTION',frame:f});}
entries.sort((a,b)=>a.frame-b.frame);
for(const e of entries){const svg=normalise(renderToStaticMarkup(React.createElement(Lesson,{frame:e.frame})));fs.writeFileSync(dir+'/'+e.id+'.svg',svg);await sharp(Buffer.from(svg)).png().toFile(dir+'/'+e.id+'.png');}
fs.writeFileSync(dir+'/index.json',JSON.stringify(entries,null,2));fs.writeFileSync(dir+'/review-source.json',JSON.stringify({beat:id,sourceHash:fingerprint(id),stills:entries.length},null,2));console.log('Beat',id,entries.length,'stills ready');})();
