/* Check the real Root registration without rendering video or deploying. */
const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const {bundle} = require('@remotion/bundler');
const {openBrowser, selectComposition} = require('@remotion/renderer');
const root = path.resolve(__dirname, '../..');
(async () => {
  const serveUrl = await bundle({entryPoint: path.join(root, 'src/remotion/Root.tsx'), publicDir: null,
    outDir: path.join(root, 'out/verify-force-diagrams-root-bundle')});
  const browser = await openBrowser('chrome', {browserExecutable: '/usr/bin/google-chrome'});
  try {
    const c = await selectComposition({serveUrl, id: 'MechanicsForceDiagrams', inputProps: {audioEnabled: false}, puppeteerInstance: browser});
    assert.equal(c.width, 1920); assert.equal(c.height, 1080); assert.equal(c.fps, 30); assert.equal(c.durationInFrames, 10650);
    const report = {passed: true, id: c.id, width: c.width, height: c.height, fps: c.fps, durationInFrames: c.durationInFrames};
    fs.writeFileSync(path.join(root, 'projects/mechanics-force-diagrams/verify-root.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(report);
  } finally {await browser.close({silent: true});}
})().catch(e => {console.error(e); process.exitCode = 1;});
