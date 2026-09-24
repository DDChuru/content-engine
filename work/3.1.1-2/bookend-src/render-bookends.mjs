import {cpSync, existsSync, mkdirSync, rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';

const here = dirname(fileURLToPath(import.meta.url));
const sourceRoot = null; // cloud: sources copied into bookend-src/ from packages/backend/src/remotion
const outputDir = join(here, '..', 'bookends');
const publicDir = join(here, 'public');
const bundleDir = join(here, '.bundle');
const subtitle = 'Cambridge A Level · Biology';
const browserExecutable = process.env.CHROME_BIN ||
  (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);

const usage = 'Usage: node render-bookends.mjs "<code>=<title>" …';
if (process.argv.length < 3) {
  console.error(usage);
  process.exit(1);
}

const lessons = process.argv.slice(2).map((argument) => {
  const separator = argument.indexOf('=');
  if (separator < 1 || separator === argument.length - 1) {
    throw new Error(`Invalid lesson ${JSON.stringify(argument)}. ${usage}`);
  }
  const code = argument.slice(0, separator);
  const title = argument.slice(separator + 1);
  if (!/^[A-Za-z0-9.-]+$/.test(code)) {
    throw new Error(`Unsafe lesson code ${JSON.stringify(code)}.`);
  }
  return {code, title};
});

mkdirSync(outputDir, {recursive: true});
mkdirSync(join(publicDir, 'stem4life'), {recursive: true});

console.log('Bundling Stem 4 Life bookends…');
const serveUrl = await bundle({
  entryPoint: join(here, 'index.tsx'),
  publicDir,
  outDir: bundleDir,
});

const onBrowserLog = (log) => {
  if (log.text.startsWith('[Stem4Life fonts]')) console.log(log.text);
  if (log.type === 'error') console.error(log.text);
};

const renderBookend = async ({code, title}, kind) => {
  const isIntro = kind === 'intro';
  const id = isIntro ? 'Stem4LifeIntroB' : 'Stem4LifeOutro';
  const frames = isIntro ? 150 : 180;
  const inputProps = isIntro
    ? {title, subtitle, heroHeight: 518}
    : {title, subtitle, aesthetic: 'C'};
  const composition = await selectComposition({
    serveUrl,
    id,
    browserExecutable,
    inputProps,
  });
  if (composition.width !== 1920 || composition.height !== 1080 || composition.fps !== 30 || composition.durationInFrames !== frames) {
    throw new Error(`${id} metadata changed unexpectedly.`);
  }

  const silent = join(outputDir, `.${kind}-${code}-silent.mp4`);
  const output = join(outputDir, `${kind}-${code}.mp4`);
  let lastStep = -1;
  console.log(`Rendering ${kind}-${code}.mp4 — ${title}`);
  try {
    await renderMedia({
      serveUrl,
      composition,
      inputProps,
      outputLocation: silent,
      browserExecutable,
      onBrowserLog,
      codec: 'h264',
      crf: 18,
      pixelFormat: 'yuv420p',
      colorSpace: 'bt709',
      imageFormat: 'png',
      concurrency: 1,
      onProgress: ({progress}) => {
        const step = Math.min(4, Math.floor(progress * 4));
        if (step !== lastStep) {
          console.log(`${kind}-${code}: ${step * 25}%`);
          lastStep = step;
        }
      },
    });
    execFileSync('ffmpeg', [
      '-y', '-v', 'error', '-i', silent,
      '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
      '-map', '0:v:0', '-map', '1:a:0',
      '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k',
      '-t', String(frames / 30), '-movflags', '+faststart', output,
    ]);
  } finally {
    rmSync(silent, {force: true});
  }
};

for (const lesson of lessons) {
  await renderBookend(lesson, 'intro');
  await renderBookend(lesson, 'outro');
}

console.log(`Done: ${outputDir}`);
