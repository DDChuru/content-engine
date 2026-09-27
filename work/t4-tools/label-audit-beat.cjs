// Design-time runner of label-audit.cjs over a beat: every `step`-th frame (default 1 = every frame), no JPEG output.
// Prints violations grouped by kind+text with their frame ranges (beat-local seconds). Exit 1 on any violation.
const P=__dirname;process.env.FONTCONFIG_FILE=P+'/fonts/fonts.conf';process.env.XDG_CACHE_HOME=P+'/render-cache';
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),normalise=require('./raster-svg.cjs'),{audit}=require('./label-audit.cjs');
const {Lesson}=require(P+'/'+(process.env.BUNDLE||'render-cache/Lesson.cjs')),T=require('./timeline.json');
const id=Number(process.argv[2]),step=Number(process.argv[3]||1),sc=T.scenes.find(s=>s.id===id);if(!sc)throw Error('Unknown beat');
(async()=>{const groups=new Map();let minEff=1e9,n=0;
 const count=sc.frames+(id===T.scenes.length?30:0);
 for(let k=0;k<count;k+=step){const f=sc.startFrame+k,s=normalise(renderToStaticMarkup(React.createElement(Lesson,{frame:f})));const r=await audit(s,{raster:true});n++;minEff=Math.min(minEff,r.minEff);
  for(const v of r.violations){const key=v.type+' | '+(v.text||(v.a+' ⟂ '+v.b))+(v.type==='size'?' | '+v.eff+'px':'');const g=groups.get(key)||{first:k,last:k,n:0};g.last=k;g.n++;groups.set(key,g);}}
 for(const [k,g] of groups)console.log(`B${id} ${(g.first/30).toFixed(2)}–${(g.last/30).toFixed(2)}s x${g.n}  ${k}`);
 console.log(`B${id} audited ${n} frames (step ${step}); min effective text ${minEff.toFixed(2)} px; ${groups.size} violation groups`);process.exit(groups.size?1:0);})();
