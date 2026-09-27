const P=__dirname,N='/home/dachu/Documents/projects/content-engine/packages/backend/node_modules';module.paths.unshift(N);process.env.NODE_PATH=N;require('module').Module._initPaths();
require('esbuild').buildSync({entryPoints:[P+'/src/Lesson.tsx'],bundle:true,platform:'node',format:'cjs',outfile:P+'/render-cache/Lesson.cjs',external:['react','react-dom'],nodePaths:[N],jsx:'transform',logLevel:'warning'});
console.log('built');
