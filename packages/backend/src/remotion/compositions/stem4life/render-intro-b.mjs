import {cpSync, existsSync, mkdirSync, renameSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const backend = resolve(here, '../../../..');
const output = resolve(backend, '../../output/stem4life-bookends');
const previewOnly = process.argv.includes('--preview');
const browserExecutable = process.env.CHROME_BIN || (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
const stagedPublic = join(output, '.render-public');
const inspectionFrames = [72, 105, 149];
const variants = [
  {percentage: 74, heroHeight: 800, existing: true},
  {percentage: 60, heroHeight: 648},
  {percentage: 48, heroHeight: 518},
  {percentage: 38, heroHeight: 410},
];
const defaultProps = {title: 'Force, mass & acceleration', subtitle: 'Cambridge A Level · Mechanics'};

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
const propsFor = ({heroHeight}) => ({...defaultProps, heroHeight});
const selectIntro = async (variant) => {
  const inputProps = propsFor(variant);
  const composition = await selectComposition({serveUrl, id: 'Stem4LifeIntroB', browserExecutable, inputProps});
  if (composition.durationInFrames !== 150 || composition.fps !== 30 || composition.width !== 1920 || composition.height !== 1080) {
    throw new Error('Stem4LifeIntroB composition metadata changed unexpectedly.');
  }
  return {composition, inputProps};
};

if (previewOnly) {
  for (const variant of variants) {
    const {composition, inputProps} = await selectIntro(variant);
    for (const frame of inspectionFrames) {
      await renderStill({serveUrl, composition, inputProps, frame, browserExecutable, onBrowserLog,
        output: join(output, `preview/intro-b-${variant.percentage}-${frame}.png`)});
    }
  }
  console.log(`Intro B size previews: ${variants.map(({percentage}) => `${percentage}%`).join(', ')}`);
  process.exit(0);
}

const current = join(output, 'intro-b.mp4');
const hero74 = join(output, 'intro-b-74.mp4');
if (existsSync(current) && !existsSync(hero74)) renameSync(current, hero74);
if (!existsSync(hero74)) throw new Error('The committed 800px Intro B could not be preserved as intro-b-74.mp4.');

const probeRender = (file) => {
  const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-count_frames', '-show_streams', '-show_format', '-of', 'json', file], {encoding: 'utf8'}));
  const video = probe.streams.find((stream) => stream.codec_type === 'video');
  const audio = probe.streams.find((stream) => stream.codec_type === 'audio');
  if (video.width !== 1920 || video.height !== 1080 || video.r_frame_rate !== '30/1' || Number(video.nb_read_frames) !== 150 || Number(video.duration) !== 5) {
    throw new Error(`${file} has incorrect timing or dimensions.`);
  }
  if (video.codec_name !== 'h264' || video.profile !== 'High' || video.pix_fmt !== 'yuv420p' || video.color_space !== 'bt709') {
    throw new Error(`${file} has incorrect video encoding.`);
  }
  if (audio.codec_name !== 'aac' || audio.channels !== 2 || audio.sample_rate !== '48000') {
    throw new Error(`${file} has an incorrect audio track.`);
  }
  return {file: file.split('/').at(-1), width: video.width, height: video.height, frames: Number(video.nb_read_frames),
    fps: video.r_frame_rate, duration: video.duration, codec: video.codec_name, profile: video.profile, pixelFormat: video.pix_fmt,
    colorSpace: video.color_space, colorRange: video.color_range,
    audio: {codec: audio.codec_name, channels: audio.channels, sampleRate: audio.sample_rate}};
};

const renderVariant = async (variant) => {
  const {composition, inputProps} = await selectIntro(variant);
  const silent = join(stagedPublic, `intro-b-${variant.percentage}-silent.mp4`);
  const destination = join(output, `intro-b-${variant.percentage}.mp4`);
  let last = -1;
  await renderMedia({serveUrl, composition, inputProps, outputLocation: silent, browserExecutable, onBrowserLog,
    codec: 'h264', crf: 18, pixelFormat: 'yuv420p', colorSpace: 'bt709', imageFormat: 'png', concurrency: 2,
    onProgress: ({progress}) => {
      const step = Math.floor(progress * 4);
      if (step !== last) {console.log(`Intro B ${variant.percentage}%: ${step * 25}%`); last = step;}
    }});
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', silent, '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
    '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-t', '5',
    '-movflags', '+faststart', destination]);
};

for (const variant of variants.filter(({existing}) => !existing)) await renderVariant(variant);

const extractFrame = (variant, frame) => {
  const video = join(output, `intro-b-${variant.percentage}.mp4`);
  const still = join(output, `stills/intro-b-${variant.percentage}-${frame}.png`);
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', video, '-vf', `select=eq(n\\,${frame})`,
    '-frames:v', '1', '-fps_mode', 'vfr', still]);
  return still;
};
for (const variant of variants) for (const frame of inspectionFrames) extractFrame(variant, frame);

const rawPixels = async (file) => sharp(file).removeAlpha().raw().toBuffer();
const sourceEndpoints = new Map();
for (const variant of variants) {
  const {composition, inputProps} = await selectIntro(variant);
  const sourceEndpoint = join(output, `preview/intro-b-${variant.percentage}-149-source.png`);
  await renderStill({serveUrl, composition, inputProps, frame: 149, browserExecutable, onBrowserLog, output: sourceEndpoint});
  sourceEndpoints.set(variant.percentage, sourceEndpoint);
}
const approvedEndpoint = await rawPixels(sourceEndpoints.get(74));
const measureMark = async (file) => {
  const {data, info} = await sharp(file).removeAlpha().raw().toBuffer({resolveWithObject: true});
  let minX = info.width; let minY = info.height; let maxX = -1; let maxY = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const index = (y * info.width + x) * info.channels;
    const r = data[index]; const g = data[index + 1]; const b = data[index + 2];
    if (x >= 635 && x < 1450 && y >= 125 && y < 960 && r > 205 && r - g > 35 && g - b > 5 && b > 85) {
      minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    }
  }
  if (maxX < 0) throw new Error(`Could not measure the microscope in ${file}.`);
  return {x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1};
};

const reports = [];
for (const variant of variants) {
  const destination = join(output, `intro-b-${variant.percentage}.mp4`);
  const endpoint = await rawPixels(sourceEndpoints.get(variant.percentage));
  const endpointIdentical = endpoint.equals(approvedEndpoint);
  if (!endpointIdentical) throw new Error(`Intro B ${variant.percentage}% changed the approved source frame 149.`);
  reports.push({percentage: variant.percentage, targetHeroHeightPx: variant.heroHeight,
    measuredHeroBounds: await measureMark(join(output, `stills/intro-b-${variant.percentage}-72.png`)),
    focusBracket: {width: variant.heroHeight, height: Math.round(variant.heroHeight * 0.825), corner: Math.round(Math.max(36, variant.heroHeight * 0.0625))},
    springAdjusted: false, settledSourceFramePixelIdentical: endpointIdentical,
    encodedInspectionFrames: inspectionFrames, probe: probeRender(destination)});
}

const cardWidth = 480; const frameHeight = 270; const labelHeight = 72;
const layers = [];
for (let i = 0; i < variants.length; i++) {
  const variant = variants[i]; const report = reports[i]; const left = i * cardWidth;
  layers.push({input: await sharp(join(output, `stills/intro-b-${variant.percentage}-72.png`)).resize(cardWidth, frameHeight).toBuffer(), left, top: labelHeight});
  const label = `<svg width="${cardWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111923"/><text x="24" y="44" font-family="DejaVu Sans, sans-serif" font-size="28" font-weight="700" fill="#FFAC8F">${variant.percentage}%</text><text x="104" y="44" font-family="DejaVu Sans, sans-serif" font-size="21" fill="#F6F3EB">${report.measuredHeroBounds.height}px rendered</text><path d="M479 0V342" stroke="#344258"/></svg>`;
  layers.push({input: Buffer.from(label), left, top: 0});
}
await sharp({create: {width: cardWidth * variants.length, height: labelHeight + frameHeight, channels: 3, background: '#182230'}})
  .composite(layers).png().toFile(join(output, 'intro-b-sizes.png'));

if (!fontEvidence.size) throw new Error('No successful local-font evidence was captured.');
writeFileSync(join(output, 'verification-intro-b.json'), JSON.stringify({
  composition: {width: 1920, height: 1080, frames: 150, fps: 30},
  inspectionFrames,
  choreography: {fade: [0, 12], draw: [12, 72], largeHold: [72, 88], dock: [88, 118], wordmark: [100, 118], settled: [118, 149]},
  approvedEndpoint: 'lossless Remotion frame 149 for intro-b-74',
  pixelIdentityBasis: 'Lossless renderStill pixels; MP4 inspection frames are independently H.264-compressed.',
  variants: reports,
  contactSheet: 'intro-b-sizes.png',
  fontEvidence: [...fontEvidence],
}, null, 2) + '\n');
console.log(`Rendered and verified Intro B sizes: ${variants.map(({percentage}) => `${percentage}%`).join(', ')}`);
