// Scratch preview: bundle a .tsx whose default export renders an <svg> (1920x1080), rasterise to PNG.
// Usage: node prove-component.cjs tmp/preview.tsx out.png [prop=value ...]
const P=__dirname;process.env.FONTCONFIG_FILE=P+'/fonts/fonts.conf';process.env.XDG_CACHE_HOME=P+'/render-cache';
const fs=require('fs');fs.mkdirSync(P+'/render-cache',{recursive:true});
require('esbuild').buildSync({entryPoints:[process.argv[2]],bundle:true,platform:'node',format:'cjs',outfile:P+'/render-cache/preview.cjs',external:['react','react-dom'],jsx:'transform',logLevel:'warning'});
delete require.cache[P+'/render-cache/preview.cjs'];
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),sharp=require('sharp'),normalise=require('./raster-svg.cjs');
const props=Object.fromEntries(process.argv.slice(4).map(a=>{const [k,v]=a.split('=');return [k,Number(v)];}));
const svg=normalise(renderToStaticMarkup(React.createElement(require('./render-cache/preview.cjs').default,props)));
sharp(Buffer.from(svg)).png().toFile(process.argv[3]).then(()=>console.log('wrote',process.argv[3]));
