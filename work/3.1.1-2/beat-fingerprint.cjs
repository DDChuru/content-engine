// Beat fingerprint: shared components + lesson components + this beat's source (+ any beat files it imports,
// e.g. Beat05 → Beat04's CellScene) + its scene. Any change to what a beat renders changes its fingerprint.
const fs=require('fs'),crypto=require('crypto'),path=require('path'),P=__dirname;
const SHARED=['theme.ts','Type.tsx','ErrorMarker.tsx','metrics.json'].map(f=>path.join(P,'shared/src',f));
const LOCAL=['src/Lesson.tsx','src/Model.tsx','src/Graph.tsx','src/Scenes.tsx','src/Panels.tsx','src/Chem.tsx','src/util.ts'].map(f=>path.join(P,f));
const beatFiles=(id,seen=new Set())=>{const f=path.join(P,'src/beats/Beat'+String(id).padStart(2,'0')+'.tsx');if(seen.has(f))return[];seen.add(f);const out=[f];for(const m of fs.readFileSync(f,'utf8').matchAll(/from '\.\/Beat(\d\d)'/g))out.push(...beatFiles(Number(m[1]),seen));return out;};
module.exports=id=>{const h=crypto.createHash('sha256');for(const f of [...SHARED,...LOCAL,...beatFiles(id)])if(fs.existsSync(f))h.update(fs.readFileSync(f));h.update(JSON.stringify(JSON.parse(fs.readFileSync(P+'/timeline.json')).scenes.find(s=>s.id===id)));return h.digest('hex');};
