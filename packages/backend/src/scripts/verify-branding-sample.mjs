#!/usr/bin/env node

import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {cpSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {
  assertApprovedMaster, assertBookendMatchesMaster, concatenate, muxBookend,
  probeFirstAudioDtsSeconds, probeMedia, renderBookendVideo, sha256File, verifyOutput,
} from './apply-stem4life-bookends.mjs';

// Intentionally one sample, with read-only external inputs and worktree outputs.
const backend = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const outputDir = resolve(backend, '../../output/stem4life-branding-sample');
const work = join(outputDir, '.work');
const output = join(outputDir, 'mechanics-si-units.mp4');
const args = process.argv.slice(2);
const value = (key) => args.find((arg) => arg.startsWith(`--${key}=`))?.slice(key.length + 3);
assert.ok(args.every((arg) => /^--(source|music-dir)=.+$/.test(arg) || ['--stills-only', '--verify-only'].includes(arg)), 'Unknown argument.');
assert.ok(value('source') && value('music-dir'), 'Usage: node src/scripts/verify-branding-sample.mjs --source=<original-si-units.mp4> --music-dir=<approved-.work/music> [--stills-only | --verify-only]');
assert.ok(!(args.includes('--stills-only') && args.includes('--verify-only')), 'Choose one mode.');
const source = resolve(value('source'));
const introAudio = resolve(value('music-dir'), 'intro.aac');
const outroAudio = resolve(value('music-dir'), 'outro.aac');
for (const file of [source, introAudio, outroAudio]) assert.ok(existsSync(file), `Missing input: ${file}`);
mkdirSync(work, {recursive: true});
mkdirSync(join(outputDir, 'stills'), {recursive: true});
const lesson = {slug: 'mechanics-si-units', title: 'S.I. units for mechanics', subtitle: 'Cambridge A Level · Mechanics', sourceMaster: source};
const sourceProbe = probeMedia(source);
assertApprovedMaster(lesson, sourceProbe);
assert.equal(probeFirstAudioDtsSeconds(source), 0, 'This sample uses the non-primed SI-units body; do not substitute another lesson.');
const sourceHash = await sha256File(source);
assert.equal(sourceHash, 'caacbd96abb069be550c76e0d8df6e7fa5835b3b5cea4e47dc3abafeb5ae2ff7', 'Expected the approved, unwrapped SI-units master.');
const inputHashes = {source: sourceHash, introAudio: await sha256File(introAudio), outroAudio: await sha256File(outroAudio)};
const intro = join(work, 'intro.mp4');
const outro = join(work, 'outro.mp4');
const browserExecutable = process.env.CHROME_BIN || '/usr/bin/google-chrome';

if (!args.includes('--verify-only')) {
  if (!args.includes('--stills-only')) assert.ok(!existsSync(output), 'Sample exists; use --verify-only. No automatic overwriting or batch render.');
  const publicDir = join(work, 'public');
  mkdirSync(join(publicDir, 'stem4life'), {recursive: true});
  cpSync(join(backend, 'src/remotion/public/stem4life/fonts'), join(publicDir, 'stem4life/fonts'), {recursive: true});
  const serveUrl = await bundle({entryPoint: join(backend, 'src/remotion/index-stem4life-branding.tsx'), publicDir, outDir: join(work, 'bundle')});
  for (const [id, frames, file, audio] of [
    ['LessonFrameIntro', 150, intro, introAudio],
    ['LessonFrameOutro', 180, outro, outroAudio],
  ]) {
    if (args.includes('--stills-only')) {
      const composition = await selectComposition({serveUrl, id, inputProps: lesson, browserExecutable});
      await renderStill({serveUrl, composition, inputProps: lesson, browserExecutable, frame: 75,
        output: join(outputDir, 'stills', `${id}-design.png`)});
    } else {
      const videoOnly = join(work, `${id}-video.mp4`);
      await renderBookendVideo({serveUrl, lesson, id, output: videoOnly, expectedFrames: frames, ordinal: 1, total: 1, fonts: new Set(), concurrency: 1});
      // Reuse the approved, already-faded music without another AAC generation.
      muxBookend(videoOnly, audio, file);
      assertBookendMatchesMaster(id, probeMedia(file), sourceProbe, frames, frames / 30);
    }
  }
  if (args.includes('--stills-only')) process.exit(0);
  const diagnostics = concatenate({intro, master: source, outro, manifest: join(work, 'concat.txt'), destination: output, label: lesson.slug});
  writeFileSync(join(work, 'concat-diagnostics.json'), `${JSON.stringify(diagnostics, null, 2)}\n`);
}

console.log('Verifying decoded audio, seams, codec compatibility and frame count...');
const verification = verifyOutput({lesson, sourceProbe, output, introProbe: probeMedia(intro), outroProbe: probeMedia(outro), work});
// Strengthen the existing middle-frame check to EVERY body frame. The raw RGB
// stream is hashed by FFmpeg, never buffered in Node or written as a huge file.
const bodyFrames = Number(sourceProbe.video.nb_frames);
const rgbHash = (file, startFrame) => execFileSync('ffmpeg', [
  '-v', 'error', '-threads', '1', '-filter_threads', '1', '-i', file, '-an',
  '-vf', `trim=start_frame=${startFrame}:end_frame=${startFrame + bodyFrames},setpts=PTS-STARTPTS`,
  '-fps_mode', 'passthrough', '-pix_fmt', 'rgb24', '-c:v', 'rawvideo', '-threads', '1',
  '-f', 'hash', '-hash', 'sha256', '-',
], {encoding: 'utf8'}).trim();
console.log(`Comparing all ${bodyFrames} decoded RGB24 frames (sequential, one thread)...`);
const originalRgb = rgbHash(source, 0);
const sampleRgb = rgbHash(output, 150);
assert.match(originalRgb, /^SHA256=[a-f0-9]{64}$/);
assert.equal(sampleRgb, originalRgb, 'The complete decoded lesson picture changed.');
const after = {source: await sha256File(source), introAudio: await sha256File(introAudio), outroAudio: await sha256File(outroAudio)};
assert.deepEqual(after, inputHashes, 'An input changed during the run.');
const proof = {
  inputs: {source, introAudio, outroAudio, hashesBefore: inputHashes, hashesAfter: after},
  output, outputSha256: await sha256File(output),
  bodyReencoded: false, renderConcurrency: 1,
  concat: JSON.parse(readFileSync(join(work, 'concat-diagnostics.json'), 'utf8')),
  allBodyFrames: {count: bodyFrames, format: 'RGB24', originalSha256: originalRgb.slice(7), sampleSha256: sampleRgb.slice(7), bitExact: true},
  ...verification,
};
writeFileSync(join(outputDir, 'verify-body.json'), `${JSON.stringify(proof, null, 2)}\n`);
const outroStart = 5 + Number(sourceProbe.format.duration);
for (const [label, seconds] of [
  ['intro-0.7', 0.7], ['intro-title', 2.5], ['intro-final', 149 / 30],
  ['first-body-frame', 5], ['body-middle', 98.433333], ['last-body-frame', 5 + (bodyFrames - 1) / 30],
  ['outro-0.7', outroStart + 0.7], ['outro-hold', outroStart + 2.4], ['outro-final', outroStart + 179 / 30],
]) execFileSync('ffmpeg', ['-y', '-v', 'error', '-ss', String(seconds), '-i', output, '-frames:v', '1', join(outputDir, 'stills', `${label}.png`)]);
console.log(`PASS: complete body RGB24 and PCM unchanged. Sample: ${output}`);
