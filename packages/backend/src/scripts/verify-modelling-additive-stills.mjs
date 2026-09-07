/** Batch still-only audit using a shared browser. Never renders video. */
import { openBrowser, renderStill, selectComposition } from '@remotion/renderer';
import { access, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const [serveUrl, output] = process.argv.slice(2);
if (!serveUrl || !output) throw new Error('Usage: node verify-modelling-additive-stills.mjs BUNDLE OUTPUT');
const requested = JSON.parse(await readFile(path.join(output, 'verify-frames.json'), 'utf8'));
const artifacts = path.resolve('out/MechanicsModellingAssumptions');
// Use only after a complete pass of the same bundle, to fill added audit frames.
const frames = process.argv.includes('--missing-only')
  ? (await Promise.all(requested.map(async (frame) => {
    try {
      await access(path.join(output, `${String(frame).padStart(5, '0')}.png`));
      await access(path.join(artifacts, `verify-modelling-${String(frame).padStart(5, '0')}.json`));
      return null;
    } catch { return frame; }
  }))).filter((frame) => frame !== null) : requested;
const inputProps = { audioEnabled: false, audit: true };
const browser = await openBrowser('chrome', { logLevel: 'error' });
await mkdir(artifacts, { recursive: true });
try {
  const composition = await selectComposition({ serveUrl, id: 'MechanicsModellingAssumptions',
    inputProps, puppeteerInstance: browser, logLevel: 'error' });
  if (composition.durationInFrames !== 8311) throw new Error('Approved runtime changed');
  let cursor = 0;
  const workers = Number(process.env.VERIFY_STILL_WORKERS ?? 3);
  await Promise.all(Array.from({ length: workers }, async () => {
    while (cursor < frames.length) {
      const frame = frames[cursor++];
      for (let attempt = 0; ; attempt++) {
        try {
          const pending = [];
          await renderStill({ composition, serveUrl, inputProps, puppeteerInstance: browser,
            output: path.join(output, `${String(frame).padStart(5, '0')}.png`), frame,
            imageFormat: 'png', scale: 0.5, logLevel: 'error',
            onArtifact: (artifact) => {
              pending.push(writeFile(path.join(artifacts, artifact.filename), artifact.content));
            } });
          await Promise.all(pending);
          break;
        } catch (error) { if (attempt >= 2) throw error; }
      }
      if (cursor % 25 === 0) console.log(`${cursor}/${frames.length} stills`);
    }
  }));
  console.log(`Completed ${frames.length} PNG stills; ${composition.durationInFrames} composition frames.`);
} finally {
  await browser.close({ silent: true });
}
