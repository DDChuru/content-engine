// Render the actual demo components, including native-size fidelity frames.
const path = require('node:path');
const fs = require('node:fs');
const { bundle } = require('@remotion/bundler');
const { openBrowser, selectComposition, renderStill } = require('@remotion/renderer');
(async () => {
  const serveUrl = await bundle({ entryPoint: path.join(__dirname, 'index-reconstruct.ts'), symlinkPublicDir: true });
  const browser = await openBrowser('chrome');
  try {
    const jobs = [
      ['LedgerReconstructPhone', 0, '/tmp/boh-recon-empty.png'],
      ['LedgerReconstructPhone', 500, '/tmp/boh-recon-before-scroll.png'],
      ['LedgerReconstructPhone', 835, '/tmp/boh-recon-after-scroll.png'],
      ['LedgerReconstructDemo', 209, '/tmp/boh-recon-25.png'],
      ['LedgerReconstructDemo', 418, '/tmp/boh-recon-50.png'],
      ['LedgerReconstructDemo', 627, '/tmp/boh-recon-75.png'],
      ['ComposeRowFidelity', 0, '/tmp/boh-compose-reset.png'],
      ['ComposeRowDemo', 0, '/tmp/boh-compose-proof.png'],
    ];
    const configs = {};
    for (const [id] of jobs) {
      if (!configs[id]) configs[id] = await selectComposition({ serveUrl, id, puppeteerInstance: browser });
    }
    // Three independent pages, matching the requested video concurrency.
    for (let i = 0; i < jobs.length; i += 3) {
      const outcomes = await Promise.allSettled(jobs.slice(i, i + 3).map(async ([id, frame, output]) => {
        await renderStill({ serveUrl, composition: configs[id], puppeteerInstance: browser, frame, output, imageFormat: 'png' });
        console.log(`${id} frame ${frame}: ${output}`);
      }));
      for (const outcome of outcomes) if (outcome.status === 'rejected') throw outcome.reason;
    }
    fs.writeFileSync(path.join(__dirname,'verify-renders.json'),JSON.stringify(jobs.map(([id,frame,output])=>({id,frame,output})),null,2)+'\n');
  } finally { await browser.close({ silent: true }); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
