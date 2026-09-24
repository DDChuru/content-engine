// Beat-chunked renderer: React -> react-dom/server -> Sharp/librsvg -> ffmpeg. No browser.
// Writes render-cache/beat-NN/video.mp4 and complete.json LAST. Identical frames are reused by hash.
const P=__dirname,N='/home/dachu/Documents/projects/content-engine/packages/backend/node_modules';module.paths.unshift(N);process.env.NODE_PATH=N;require('module').Module._initPaths();
process.env.RAYON_NUM_THREADS='2';process.env.UV_THREADPOOL_SIZE='2';process.env.TMPDIR=P+'/tmp';process.env.FONTCONFIG_FILE=P+'/render-cache/fonts.conf';process.env.XDG_CACHE_HOME=P+'/render-cache';
const fs=require('fs'),crypto=require('crypto'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),sharp=require('sharp'),{spawn}=require('child_process'),normalise=require('./raster-svg.cjs');
sharp.concurrency(2);sharp.cache({memory:96,files:0,items:64});
const {Lesson,stateAt,isError,ERROR_LABEL}=require('./render-cache/Lesson.cjs'),T=require('./timeline.json');const id=Number(process.argv[2]),sc=T.scenes.find(s=>s.id===id);if(!sc)throw Error('Unknown beat');
const approval=JSON.parse(fs.readFileSync(P+'/qa/beat-'+String(id).padStart(2,'0')+'/approved.json'));if(approval.sourceHash!==require('./beat-fingerprint.cjs')(id))throw Error('Source changed since visual approval');
const name='beat-'+String(id).padStart(2,'0'),dir=P+'/render-cache/'+name;fs.mkdirSync(dir+'/frames',{recursive:true});
(async()=>{try{fs.writeFileSync(dir+'/render.lock',String(process.pid),{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;throw Error('render.lock exists for '+name+': check the PID inside; never delete a live lock');}
 if(fs.existsSync(dir+'/complete.json'))fs.unlinkSync(dir+'/complete.json');
 let prev='',unique=0,records=[],last=-1,start=Date.now();const count=sc.frames+(id===T.scenes.length?30:0);
 for(let k=0;k<count;k++){
  const frame=sc.startFrame+k,s=normalise(renderToStaticMarkup(React.createElement(Lesson,{frame})));
  const err=Boolean(isError(stateAt(frame)));
  if(s.includes('data-error-marker=')!==err)throw Error('Error marker presence wrong at frame '+frame);
  if(err&&!s.includes('data-error-label="'+ERROR_LABEL[id]+'"'))throw Error('Error marker label wrong at frame '+frame);
  if(s!==prev){const hash=crypto.createHash('sha256').update(s).digest('hex'),file='frames/'+hash+'.jpg';if(!fs.existsSync(dir+'/'+file)||fs.statSync(dir+'/'+file).size<2){await sharp(Buffer.from(s)).jpeg({quality:95,chromaSubsampling:'4:4:4'}).toFile(dir+'/'+file+'.part.jpg');fs.renameSync(dir+'/'+file+'.part.jpg',dir+'/'+file);}records.push({file,from:frame,count:1,hash});prev=s;unique++;}else records[records.length-1].count++;
  const n=Math.floor(k/count*10);if(n!==last){console.log(name,n*10+'%',k,'unique',unique,'seconds',Math.round((Date.now()-start)/1000));last=n;fs.writeFileSync(dir+'/progress.json',JSON.stringify({beat:id,percent:n*10,frame:k,frames:count,unique,seconds:(Date.now()-start)/1000}));}
 }
 let manifest='ffconcat version 1.0\n';for(const r of records)manifest+="file '"+r.file+"'\noption framerate 30\nduration "+(r.count/30).toFixed(9)+"\n";manifest+="file '"+records[records.length-1].file+"'\noption framerate 30\n";
 fs.writeFileSync(dir+'/frames.ffconcat',manifest);fs.writeFileSync(dir+'/ledger.json',JSON.stringify(records));
 console.log(name,'encoding',count,'frames');
 const ff=spawn('nice',['-n','10','ffmpeg','-v','error','-y','-safe','0','-f','concat','-i',dir+'/frames.ffconcat','-vf','fps=30','-frames:v',String(count),'-an','-c:v','libx264','-preset','veryfast','-crf','18','-threads','3','-bf','0','-pix_fmt','yuv420p','-video_track_timescale','15360',dir+'/video.mp4'],{stdio:['ignore','ignore','inherit']});await new Promise((r,j)=>{ff.on('close',c=>c===0?r():j(Error('ffmpeg '+c)));ff.on('error',j)});
 const probe=JSON.parse(require('child_process').execFileSync('ffprobe',['-v','error','-select_streams','v:0','-count_packets','-show_entries','stream=nb_read_packets','-of','json',dir+'/video.mp4']));if(Number(probe.streams[0].nb_read_packets)!==count)throw Error('Encoded frame count mismatch');
 fs.writeFileSync(dir+'/complete.json',JSON.stringify({beat:id,frames:count,unique,seconds:(Date.now()-start)/1000,sourceHash:approval.sourceHash}));fs.unlinkSync(dir+'/render.lock');console.log(name,'COMPLETE',unique,'unique',Math.round((Date.now()-start)/1000),'seconds');
})().catch(e=>{console.error(e);process.exit(1)});
