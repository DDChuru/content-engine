// Beat fingerprint: shared components + lesson components + this beat's source + its scene.
const fs=require('fs'),crypto=require('crypto'),path=require('path'),P=__dirname;
const SHARED=['theme.ts','Type.tsx','ErrorMarker.tsx','metrics.json'].map(f=>path.join(P,'shared/src',f));
const LOCAL=['src/Lesson.tsx','src/Model.tsx','src/Graph.tsx','src/Scenes.tsx','src/Panels.tsx','src/Chem.tsx','src/util.ts'].map(f=>path.join(P,f));
module.exports=id=>{const h=crypto.createHash('sha256');for(const f of [...SHARED,...LOCAL,path.join(P,'src/beats/Beat'+String(id).padStart(2,'0')+'.tsx')])if(fs.existsSync(f))h.update(fs.readFileSync(f));h.update(JSON.stringify(JSON.parse(fs.readFileSync(P+'/timeline.json')).scenes.find(s=>s.id===id)));return h.digest('hex');};
