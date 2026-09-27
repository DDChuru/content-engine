// Expand SVG normalized dash lengths for librsvg (Chromium handles pathLength natively; librsvg does not).
// Used for ink rings, ticks, graph lines and arrows drawn with pathLength="1".
// Path length supports absolute M, L, H, V, C and Z (every command this lesson emits); anything else throws, so an
// unsupported path can never silently collapse to length 0 (review finding 5: L was ignored → lines popped on).
const lengths=new Map();
function pathLength(d){
  if(lengths.has(d))return lengths.get(d);
  const toks=d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi);let i=0,cmd='',pos=[0,0],start=[0,0],len=0;
  const num=()=>Number(toks[i++]);
  while(i<toks.length){
    if(/[A-Za-z]/.test(toks[i]))cmd=toks[i++];
    if(cmd==='M'){pos=[num(),num()];start=pos.slice();cmd='L';}
    else if(cmd==='L'){const p=[num(),num()];len+=Math.hypot(p[0]-pos[0],p[1]-pos[1]);pos=p;}
    else if(cmd==='H'){const p=[num(),pos[1]];len+=Math.abs(p[0]-pos[0]);pos=p;}
    else if(cmd==='V'){const p=[pos[0],num()];len+=Math.abs(p[1]-pos[1]);pos=p;}
    else if(cmd==='C'){const n=[num(),num(),num(),num(),num(),num()];let old=pos;for(let k=1;k<=200;k++){const t=k/200,u=1-t;const p=[u*u*u*pos[0]+3*u*u*t*n[0]+3*u*t*t*n[2]+t*t*t*n[4],u*u*u*pos[1]+3*u*u*t*n[1]+3*u*t*t*n[3]+t*t*t*n[5]];len+=Math.hypot(p[0]-old[0],p[1]-old[1]);old=p;}pos=[n[4],n[5]];}
    else if(cmd==='Z'||cmd==='z'){len+=Math.hypot(start[0]-pos[0],start[1]-pos[1]);pos=start.slice();}
    else throw Error('raster-svg: unsupported path command '+cmd+' in '+d.slice(0,80));
  }
  if(!(len>0))throw Error('raster-svg: zero-length animated path '+d.slice(0,80));
  lengths.set(d,len);return len;}
module.exports=(s)=>s.replace(/<(?:path|circle)\b[^>]*\bpathLength="1"[^>]*>/g,tag=>{const d=tag.match(/\bd="([^"]+)"/),r=tag.match(/\br="([^"]+)"/);const len=d?pathLength(d[1]):2*Math.PI*Number(r[1]);return tag.replace(/ pathLength="1"/,'').replace(/stroke-dasharray="1"/,`stroke-dasharray="${len}"`).replace(/stroke-dashoffset="([^"]+)"/,(_,v)=>`stroke-dashoffset="${Number(v)*len}"`);});
// Greek letters (π, σ) are not in the brand font; letting pango fall back mid-run leaves a wide gap after them
// ("π  bond"). Give each its own tspan in the fallback font, which lays out with normal spacing.
const _norm=module.exports;
module.exports=(s)=>_norm(s).replace(/>([^<>]*[πσ][^<>]*)</g,(m,t)=>'>'+t.replace(/[πσ]/g,c=>`<tspan font-family="DejaVu Sans">${c}</tspan>`)+'<');
