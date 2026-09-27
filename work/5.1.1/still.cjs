// run 009f helper: node still.cjs FRAME [FRAME…] → tmp/still-FRAME.png (for looking at a specific frame)
const P=__dirname;process.env.FONTCONFIG_FILE=P+'/fonts/fonts.conf';process.env.XDG_CACHE_HOME=P+'/render-cache';
const fs=require('fs'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),sharp=require('sharp'),normalise=require('./raster-svg.cjs'),{Lesson}=require(P+'/render-cache/Lesson.cjs');
fs.mkdirSync(P+'/tmp',{recursive:true});
(async()=>{for(const f of process.argv.slice(2).map(Number)){const svg=normalise(renderToStaticMarkup(React.createElement(Lesson,{frame:f})));await sharp(Buffer.from(svg)).png().toFile(P+'/tmp/still-'+f+'.png');console.log('tmp/still-'+f+'.png');}})();
