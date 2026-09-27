// Expected error-marker state for EVERY frame, from the same Lesson code that rendered it.
const P=__dirname;
const fs=require('fs'),{stateAt,isError,ERROR_LABEL,ERROR_BEATS,clearFrame}=require('./render-cache/Lesson.cjs'),T=require('./timeline.json');
const intervals=[];let open=null;
for(let f=0;f<T.durationFrames;f++){const s=stateAt(f),e=Boolean(isError(s));if(e&&!open)open={beat:s.sc.id,label:ERROR_LABEL[s.sc.id],startFrame:f};if(!e&&open){open.endFrame=f;intervals.push(open);open=null;}}
if(open){open.endFrame=T.durationFrames;intervals.push(open);}
for(const i of intervals){const sc=T.scenes.find(s=>s.id===i.beat);i.announceFrame=sc.startFrame;i.beatEndFrame=sc.startFrame+sc.frames;i.clearKey=ERROR_BEATS[i.beat].clearKey;i.clearsOnFrame=sc.startFrame+clearFrame(sc);}
fs.writeFileSync(P+'/qa/error-intervals.json',JSON.stringify({intervals},null,2));console.log(JSON.stringify(intervals));
