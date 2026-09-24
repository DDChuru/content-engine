const P=__dirname;
require('esbuild').buildSync({entryPoints:[P+'/src/Lesson.tsx'],bundle:true,platform:'node',format:'cjs',outfile:P+'/render-cache/Lesson.cjs',external:['react','react-dom'],jsx:'transform',logLevel:'warning'});
console.log('built');
