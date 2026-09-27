// Beat fingerprint: shared house components + every lesson component/data file in src/ + the beat routing index + the
// output-affecting renderer code (SVG normaliser, frame renderer, build) + this beat's source (+ beat files and beat-local
// helpers it imports) + its scene. Any change to what a beat renders changes it.
const fs=require('fs'),crypto=require('crypto'),path=require('path'),P=__dirname;
const SHARED=['theme.ts','Type.tsx','ErrorMarker.tsx','metrics.json'].map(f=>path.join(P,'shared/src',f));
const LOCAL=()=>[...fs.readdirSync(P+'/src').filter(f=>/\.(tsx?|json)$/.test(f)).sort().map(f=>path.join(P,'src',f)),path.join(P,'src/beats/index.ts')];
const RENDER=['raster-svg.cjs','render-beat.cjs','build.cjs','label-audit.cjs'].map(f=>path.join(P,f));
const beatFiles=(id,seen=new Set())=>{const f=path.join(P,'src/beats/Beat'+String(id).padStart(2,'0')+'.tsx');if(seen.has(f))return[];seen.add(f);const out=[f];const src=fs.readFileSync(f,'utf8');for(const m of src.matchAll(/from '\.\/Beat(\d\d)'/g))out.push(...beatFiles(Number(m[1]),seen));for(const m of src.matchAll(/from '\.\/([a-z][\w-]*)'/g)){const g=path.join(P,'src/beats',m[1]+'.tsx');if(!seen.has(g)&&fs.existsSync(g)){seen.add(g);out.push(g);}}return out;};
module.exports=id=>{const h=crypto.createHash('sha256');for(const f of [...SHARED,...LOCAL(),...RENDER,...beatFiles(id)])if(fs.existsSync(f))h.update(fs.readFileSync(f));h.update(JSON.stringify(JSON.parse(fs.readFileSync(P+'/timeline.json')).scenes.find(s=>s.id===id)));return h.digest('hex');};
