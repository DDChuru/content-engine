// Lists beats whose rendered video was made from a source fingerprint that differs from the current source.
const fs=require('fs'),fp=require('./beat-fingerprint.cjs'),T=require('./timeline.json');
const out=[];for(const sc of T.scenes){const f=__dirname+`/render-cache/beat-${String(sc.id).padStart(2,'0')}/complete.json`;
 if(!fs.existsSync(f)){out.push([sc.id,'not complete']);continue;}const c=JSON.parse(fs.readFileSync(f));out.push([sc.id,c.sourceHash===fp(sc.id)?'current':'STALE']);}
console.log(out.map(x=>x.join(':')).join('  '));
