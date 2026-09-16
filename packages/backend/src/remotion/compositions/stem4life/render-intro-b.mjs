import {cpSync, existsSync, mkdirSync, renameSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';

const here = dirname(fileURLToPath(import.meta.url));
const backend = resolve(here, '../../../..');
const output = resolve(backend, '../../output/stem4life-bookends');
const previewOnly = process.argv.includes('--preview');
const browserExecutable = process.env.CHROME_BIN || (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
const stagedPublic = join(output, '.render-public');
const frames = [20, 45, 60, 72, 88, 100, 105, 120, 149];
const requestedFrames = [20, 45, 72, 88, 105, 120, 149];
mkdirSync(join(stagedPublic, 'stem4life'), {recursive: true});
mkdirSync(join(output, 'preview'), {recursive: true});
mkdirSync(join(output, 'stills'), {recursive: true});
cpSync(join(backend, 'src/remotion/public/stem4life/fonts'), join(stagedPublic, 'stem4life/fonts'), {recursive: true});

const serveUrl = await bundle({
  entryPoint: join(backend, 'src/remotion/index-stem4life.ts'),
  publicDir: stagedPublic,
  outDir: join(output, '.bundle'),
});
const fontEvidence = new Set();
const onBrowserLog = (log) => {
  if (log.text.startsWith('[Stem4Life fonts]')) fontEvidence.add(log.text);
  if (log.type === 'error') console.error(log.text);
};
const composition = await selectComposition({serveUrl, id: 'Stem4LifeIntroB', browserExecutable});
if (composition.durationInFrames !== 150 || composition.fps !== 30 || composition.width !== 1920 || composition.height !== 1080) {
  throw new Error('Stem4LifeIntroB composition metadata changed unexpectedly.');
}

if (previewOnly) {
  for (const frame of requestedFrames) {
    await renderStill({serveUrl, composition, frame, browserExecutable, onBrowserLog,
      output: join(output, `preview/intro-b-revised-${frame}.png`)});
  }
  console.log(`Intro B preview frames: ${requestedFrames.join(', ')}`);
} else {
  const current = join(output, 'intro-b.mp4');
  const preserved = join(output, 'intro-b-preshrink.mp4');
  if (existsSync(current) && !existsSync(preserved)) renameSync(current, preserved);
  if (!existsSync(preserved)) throw new Error('The approved pre-shrink Intro B was not preserved.');

  const silent = join(stagedPublic, 'intro-b-silent.mp4');
  let last = -1;
  await renderMedia({serveUrl, composition, outputLocation: silent, browserExecutable, onBrowserLog,
    codec: 'h264', crf: 18, pixelFormat: 'yuv420p', colorSpace: 'bt709', imageFormat: 'png', concurrency: 2,
    onProgress: ({progress}) => {const step = Math.floor(progress * 4); if (step !== last) {console.log(`Stem4LifeIntroB: ${step * 25}%`); last = step;}}});
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', silent, '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
    '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-t', '5',
    '-movflags', '+faststart', current]);

  const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-count_frames', '-show_streams', '-show_format', '-of', 'json', current], {encoding: 'utf8'}));
  const video = probe.streams.find((stream) => stream.codec_type === 'video');
  const audio = probe.streams.find((stream) => stream.codec_type === 'audio');
  if (video.width !== 1920 || video.height !== 1080 || video.r_frame_rate !== '30/1' || Number(video.nb_read_frames) !== 150 || Number(video.duration) !== 5) throw new Error('Intro B ffprobe timing mismatch.');
  if (video.codec_name !== 'h264' || video.pix_fmt !== 'yuv420p' || video.color_space !== 'bt709') throw new Error('Intro B codec/colour mismatch.');
  if (audio.codec_name !== 'aac' || audio.channels !== 2 || audio.sample_rate !== '48000') throw new Error('Intro B audio-track mismatch.');

  for (const frame of frames) {
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', current, '-vf', `select=eq(n\\,${frame})`,
      '-frames:v', '1', '-fps_mode', 'vfr', join(output, `stills/intro-b-${frame}.png`)]);
  }
  if (!fontEvidence.size) throw new Error('No successful local-font evidence was captured.');
  writeFileSync(join(output, 'verification-intro-b.json'), JSON.stringify({
    render: {file: 'intro-b.mp4', width: video.width, height: video.height, frames: Number(video.nb_read_frames),
      fps: video.r_frame_rate, duration: video.duration, codec: video.codec_name, pixelFormat: video.pix_fmt,
      colorSpace: video.color_space, colorRange: video.color_range,
      audio: {codec: audio.codec_name, channels: audio.channels, sampleRate: audio.sample_rate}},
    preservedRender: 'intro-b-preshrink.mp4',
    requestedInspectionFrames: requestedFrames,
    additionalExtractedFrames: frames.filter((frame) => !requestedFrames.includes(frame)),
    choreography: {fade: [0, 12], draw: [12, 72], largeHold: [72, 88], dock: [88, 118], settled: [118, 149], heroVisibleHeightPx: 800},
    fontEvidence: [...fontEvidence],
  }, null, 2) + '\n');
  console.log(`Rendered and verified ${current}`);
}
