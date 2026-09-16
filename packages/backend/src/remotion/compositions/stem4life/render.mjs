import {cpSync, existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';

const here = dirname(fileURLToPath(import.meta.url));
const backend = resolve(here, '../../../..');
const output = resolve(backend, '../../output/stem4life-bookends');
const previewsOnly = process.argv.includes('--stills-only');
const browserExecutable = process.env.CHROME_BIN || (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
const stagedPublic = join(output, '.render-public');
mkdirSync(join(stagedPublic, 'stem4life'), {recursive: true});
mkdirSync(join(output, 'preview'), {recursive: true});
mkdirSync(join(output, 'stills'), {recursive: true});
cpSync(join(backend, 'src/remotion/public/stem4life/fonts'), join(stagedPublic, 'stem4life/fonts'), {recursive: true});
writeFileSync(join(output, '.gitignore'), '.bundle/\n.render-public/\npreview/\n');
const serveUrl = await bundle({
  entryPoint: join(backend, 'src/remotion/index-stem4life.ts'),
  publicDir: stagedPublic, outDir: join(output, '.bundle'),
});
const fonts = new Set();
const onBrowserLog = (log) => {
  if (log.text.startsWith('[Stem4Life fonts]')) fonts.add(log.text);
  if (log.type === 'error') console.error(log.text);
};
const variants = [
  ['Stem4LifeIntroA', 'intro-a', 150], ['Stem4LifeIntroB', 'intro-b', 150],
  ['Stem4LifeIntroC', 'intro-c', 150], ['Stem4LifeOutro', 'outro', 180],
];
const report = {spec: {width: 1920, height: 1080, fps: 30}, renders: [], fontEvidence: [], urlHold: {firstFrame: 60, lastFrame: 179, seconds: 4}};
for (const [id, file, frames] of variants) {
  const composition = await selectComposition({serveUrl, id, browserExecutable});
  if (composition.durationInFrames !== frames || composition.fps !== 30 || composition.width !== 1920 || composition.height !== 1080) throw new Error(`Unexpected composition metadata: ${id}`);
  const checkpoints = frames === 150 ? [20, 60, 100, 149] : [20, 60, 100, 150, 179];
  if (previewsOnly) {
    for (const frame of checkpoints) {
      await renderStill({serveUrl, composition, frame, browserExecutable, onBrowserLog,
        output: join(output, `preview/${file}-${frame}.png`)});
    }
    console.log(`${id}: preview frames ${checkpoints.join(', ')}`);
  } else {
    let last = -1;
    const videoOnly = join(output, `.render-public/${file}-silent.mp4`);
    await renderMedia({serveUrl, composition, outputLocation: videoOnly, browserExecutable, onBrowserLog,
      codec: 'h264', crf: 18, pixelFormat: 'yuv420p', colorSpace: 'bt709', imageFormat: 'png', concurrency: 2,
      onProgress: ({progress}) => {const step = Math.floor(progress * 4); if (step !== last) {console.log(`${id}: ${step * 25}%`); last = step;}}});
    const outputFile = join(output, `${file}.mp4`);
    // Silent stereo AAC makes the bookends convenient for lesson concatenation;
    // no generated music or synthetic sound effect is baked into the identity.
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', videoOnly, '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
      '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-t', String(frames / 30),
      '-movflags', '+faststart', outputFile]);
    const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-count_frames', '-show_streams', '-show_format', '-of', 'json', outputFile], {encoding: 'utf8'}));
    const video = probe.streams.find((s) => s.codec_type === 'video');
    const audio = probe.streams.find((s) => s.codec_type === 'audio');
    if (video.width !== 1920 || video.height !== 1080 || video.r_frame_rate !== '30/1' || Number(video.nb_read_frames) !== frames || Number(video.duration) !== frames / 30) throw new Error(`ffprobe mismatch: ${file}`);
    if (video.codec_name !== 'h264' || video.pix_fmt !== 'yuv420p' || video.color_space !== 'bt709') throw new Error(`Colour/codec mismatch: ${file}`);
    if (audio.codec_name !== 'aac' || audio.channels !== 2 || audio.sample_rate !== '48000') throw new Error(`Audio mismatch: ${file}`);
    for (const frame of checkpoints) {
      execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', outputFile, '-vf', `select=eq(n\\,${frame})`, '-frames:v', '1', '-fps_mode', 'vfr', join(output, `stills/${file}-${frame}.png`)]);
    }
    report.renders.push({file: `${file}.mp4`, composition: id, frames: Number(video.nb_read_frames), fps: video.r_frame_rate,
      width: video.width, height: video.height, duration: video.duration, codec: video.codec_name, pixelFormat: video.pix_fmt, colorSpace: video.color_space, colorRange: video.color_range,
      audio: {codec: audio.codec_name, channels: audio.channels, sampleRate: audio.sample_rate}, inspectedFrames: checkpoints});
  }
}
// Exercise both alternative outro aesthetics and a long title through the same component.
const outro = await selectComposition({serveUrl, id: 'Stem4LifeOutro', browserExecutable});
for (const aesthetic of ['A', 'B']) {
  const inputProps = {...outro.props, aesthetic};
  const composition = await selectComposition({serveUrl, id: 'Stem4LifeOutro', browserExecutable, inputProps});
  if (composition.props.aesthetic !== aesthetic) throw new Error('Outro aesthetic override did not reach the resolved composition.');
  await renderStill({serveUrl, composition, frame: 100, browserExecutable, onBrowserLog,
    inputProps, output: join(output, `${previewsOnly ? 'preview' : 'stills'}/outro-${aesthetic.toLowerCase()}-100.png`)});
}
const longTitle = 'Connected particles: resolving forces and applying Newton’s second law to systems with friction';
const longTitleProps = {title: longTitle, subtitle: 'Cambridge A Level · Mechanics'};
const intro = await selectComposition({serveUrl, id: 'Stem4LifeIntroC', browserExecutable, inputProps: longTitleProps});
if (intro.props.title !== longTitle) throw new Error('Lesson title override did not reach the resolved composition.');
await renderStill({serveUrl, composition: intro, frame: 100, browserExecutable, onBrowserLog,
  inputProps: longTitleProps, output: join(output, `${previewsOnly ? 'preview' : 'stills'}/long-title-100.png`)});
// Independent, lossless checks of the URL's settled hold at its two endpoints.
for (const frame of [60, 179]) {
  await renderStill({serveUrl, composition: outro, frame, browserExecutable, onBrowserLog,
    output: join(output, `preview/outro-hold-${frame}.png`)});
}
report.fontEvidence = [...fonts];
if (!fonts.size) throw new Error('No successful font-load evidence was captured.');
if (!previewsOnly) writeFileSync(join(output, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`Done: ${output}`);
