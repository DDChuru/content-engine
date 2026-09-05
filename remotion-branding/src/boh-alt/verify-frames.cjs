// One bundle/browser for the requested mid-beat PNGs and boundary checks.
// Run: source ~/.nvm/nvm.sh && nvm use 22 && node src/boh-alt/verify-frames.cjs
const path = require('node:path');
const { bundle } = require('@remotion/bundler');
const { openBrowser, getCompositions, renderStill } = require('@remotion/renderer');
const timing = require('./timing.json');

async function main() {
  const root = path.resolve(__dirname, '../..');
  const serveUrl = await bundle({ entryPoint: path.join(__dirname, 'index-alt.ts'), publicDir: path.join(root, 'public') });
  const browser = await openBrowser('chrome');
  try {
    const comps = await getCompositions(serveUrl, { puppeteerInstance: browser });
    const expected = ['BillOfHealthAlt', 'BillOfHealthAltBranded'];
    if (JSON.stringify(comps.map((c) => c.id)) !== JSON.stringify(expected)) throw new Error('Unexpected standalone registrations');
    const starts = timing.beats.map((beat, i) => i ? Math.round((beat.voStart - 0.6) * timing.fps) : 0);
    const mids = [2, 3, 9, 10, 12, 5, 8, 11].map((beat) => ({
      id: expected[0], frame: Math.floor((starts[beat - 1] + (starts[beat] ?? timing.total_frames)) / 2),
      output: `/tmp/boh-alt-${String(beat).padStart(2, '0')}.png`,
    }));
    const checks = [
      ...mids,
      ...[9, 10, 12].map((beat) => ({ id: expected[0], frame: starts[beat - 1], output: `/tmp/boh-alt-${beat}-first.png` })),
      { id: expected[0], frame: timing.total_frames - 1, output: '/tmp/boh-alt-last.png' },
      { id: expected[1], frame: 0, output: '/tmp/boh-alt-branded-first.png' },
      { id: expected[1], frame: timing.total_frames + 330 - 1, output: '/tmp/boh-alt-branded-last.png' },
    ];
    for (const check of checks) {
      const composition = comps.find((comp) => comp.id === check.id);
      await renderStill({ serveUrl, composition, puppeteerInstance: browser, imageFormat: 'png', frame: check.frame, output: check.output });
      console.log(`PASS ${check.id} frame ${check.frame}: ${check.output}`);
    }
  } finally {
    await browser.close({ silent: true });
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
