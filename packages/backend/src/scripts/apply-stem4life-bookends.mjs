#!/usr/bin/env node

import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {
  cpSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import {basename, dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import sharp from 'sharp';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const BACKEND_DIR = resolve(SCRIPT_DIR, '../..');
const REPO_DIR = resolve(BACKEND_DIR, '../..');
const MASTER_DIR = join(REPO_DIR, 'apps/student-learn/public/videos');
const OUTPUT_DIR = join(REPO_DIR, 'output/stem4life-lessons');
const WORK_DIR = join(OUTPUT_DIR, '.work');
const STILLS_DIR = join(OUTPUT_DIR, 'stills');
const REGISTRY_FILE = join(BACKEND_DIR, 'content-registry.json');
const ENTRY_FILE = join(BACKEND_DIR, 'src/remotion/index-stem4life.ts');
const FONT_DIR = join(BACKEND_DIR, 'src/remotion/public/stem4life/fonts');
const STAGED_PUBLIC_DIR = join(OUTPUT_DIR, '.render-public');
const BUNDLE_DIR = join(OUTPUT_DIR, '.bundle');
const VERIFICATION_FILE = join(OUTPUT_DIR, 'verification.json');
const CONTACT_SHEET_FILE = join(OUTPUT_DIR, 'contact-sheet.png');

const FPS = 30;
const INTRO_FRAMES = 150;
const OUTRO_FRAMES = 180;
const INTRO_SECONDS = INTRO_FRAMES / FPS;
const OUTRO_SECONDS = OUTRO_FRAMES / FPS;
const SUBTITLE = 'Cambridge A Level · Mechanics';
const INTRO_MOTION_STILL_SECONDS = 2.4;
// Intro B is still showing the large microscope at 2.4s. Keep that requested
// still, and use the settled title hold for the title-review contact sheet.
const INTRO_TITLE_STILL_SECONDS = 4.2;
const OUTRO_URL_HOLD_SECONDS = 2.4;
const DURATION_TOLERANCE_SECONDS = 1 / FPS;
const EXPECTED_LESSON_COUNT = 31;
const REPORT_SCHEMA_VERSION = 1;

// This registry lesson intentionally uses a longer canonical slug than its
// approved master filename. Output slugs follow the master filename.
const SOURCE_SLUG_OVERRIDES = new Map([
  ['mechanics-deriving-the-suvat-formulae', 'mechanics-deriving-suvat'],
]);

const browserExecutable = process.env.CHROME_BIN
  || (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);

const usage = () => {
  console.error('Usage: node src/scripts/apply-stem4life-bookends.mjs (--all | --slug=<lesson>) [--force]');
};

const parseArguments = () => {
  const args = process.argv.slice(2);
  const all = args.includes('--all');
  const force = args.includes('--force');
  const slugArgs = args.filter((arg) => arg.startsWith('--slug='));
  const unknown = args.filter((arg) => arg !== '--all' && arg !== '--force' && !arg.startsWith('--slug='));
  if (unknown.length || slugArgs.length > 1 || all === Boolean(slugArgs.length)) {
    usage();
    throw new Error('Choose exactly one of --all or --slug=<lesson>.');
  }
  const slug = slugArgs[0]?.slice('--slug='.length);
  if (slugArgs.length && !slug) {
    usage();
    throw new Error('--slug requires a non-empty lesson slug.');
  }
  return {all, force, slug};
};

const run = (command, args, options = {}) => execFileSync(command, args, {
  encoding: options.encoding ?? 'utf8',
  maxBuffer: options.maxBuffer ?? 64 * 1024 * 1024,
  stdio: options.stdio,
  ...options,
});

const ensureCommand = (command) => {
  try {
    run(command, ['-version']);
  } catch {
    throw new Error(`${command} is required but was not found.`);
  }
};

const sha256File = (file) => new Promise((resolveHash, reject) => {
  const hash = createHash('sha256');
  const stream = createReadStream(file);
  stream.on('error', reject);
  stream.on('data', (chunk) => hash.update(chunk));
  stream.on('end', () => resolveHash(hash.digest('hex')));
});

const sha256Buffer = (buffer) => createHash('sha256').update(buffer).digest('hex');

const round = (number, digits = 6) => Number(number.toFixed(digits));

const readRegistryLessons = () => {
  assert.ok(existsSync(REGISTRY_FILE), `Missing registry: ${REGISTRY_FILE}`);
  const registry = JSON.parse(readFileSync(REGISTRY_FILE, 'utf8'));
  const topics = registry.subjects?.['mathematics-9709']?.topics;
  assert.ok(topics && !Array.isArray(topics), 'Missing mathematics-9709 topics in content-registry.json.');

  const lessons = Object.entries(topics)
    .filter(([key]) => key.startsWith('mechanics-') && !key.endsWith('-fable'))
    .map(([registryKey, topic]) => {
      assert.equal(typeof topic.slug, 'string', `Missing slug for registry topic ${registryKey}.`);
      assert.equal(typeof topic.label, 'string', `Missing label for registry topic ${registryKey}.`);
      const sourceSlug = SOURCE_SLUG_OVERRIDES.get(topic.slug) ?? topic.slug;
      const sourceMaster = join(MASTER_DIR, `${sourceSlug}.mp4`);
      assert.ok(existsSync(sourceMaster), `Named lesson master does not exist: ${sourceMaster}`);
      return {
        slug: sourceSlug,
        registrySlug: topic.slug,
        title: topic.label,
        subtitle: SUBTITLE,
        sourceMaster,
      };
    });

  assert.equal(lessons.length, EXPECTED_LESSON_COUNT,
    `Expected ${EXPECTED_LESSON_COUNT} non-Fable registry lessons, found ${lessons.length}.`);

  const expectedMasters = new Set(lessons.map(({sourceMaster}) => basename(sourceMaster)));
  const actualMasters = new Set(run('find', [MASTER_DIR, '-maxdepth', '1', '-type', 'f', '-name', 'mechanics-*.mp4',
    '!', '-name', '*-fable.mp4', '-printf', '%f\n']).trim().split('\n').filter(Boolean));
  assert.equal(actualMasters.size, EXPECTED_LESSON_COUNT,
    `Expected ${EXPECTED_LESSON_COUNT} non-Fable masters, found ${actualMasters.size}.`);
  assert.deepEqual([...actualMasters].sort(), [...expectedMasters].sort(),
    'Registry-to-master mapping does not account for exactly the 31 approved masters.');
  return lessons;
};

const probeExtradataHash = (file, selector) => sha256Buffer(Buffer.from(run('ffprobe', [
  '-v', 'error', '-select_streams', selector, '-show_entries', 'stream=extradata',
  '-show_data', '-of', 'default=nw=1:nk=1', file,
])));

const probeMedia = (file, countFrames = false) => {
  const result = JSON.parse(run('ffprobe', [
    '-v', 'error', ...(countFrames ? ['-count_frames'] : []),
    '-show_streams', '-show_format', '-of', 'json', file,
  ]));
  const video = result.streams.find((stream) => stream.codec_type === 'video');
  const audio = result.streams.find((stream) => stream.codec_type === 'audio');
  assert.ok(video, `No video stream in ${file}.`);
  assert.ok(audio, `No audio stream in ${file}.`);
  return {
    video,
    audio,
    format: result.format,
    videoExtradataSha256: probeExtradataHash(file, 'v:0'),
    audioExtradataSha256: probeExtradataHash(file, 'a:0'),
  };
};

const probeFirstAudioDtsSeconds = (file) => {
  const result = JSON.parse(run('ffprobe', [
    '-v', 'error', '-select_streams', 'a:0', '-read_intervals', '%+0.1',
    '-show_packets', '-show_entries', 'packet=dts_time', '-of', 'json', file,
  ]));
  assert.ok(result.packets?.length, `No audio packets in ${file}.`);
  const firstDtsSeconds = Number(result.packets[0].dts_time);
  assert.ok(Number.isFinite(firstDtsSeconds), `Invalid first audio DTS in ${file}.`);
  return firstDtsSeconds;
};

const streamValue = (stream, key) => stream[key] ?? null;

const sharedVideoFields = [
  'codec_name', 'profile', 'width', 'height', 'pix_fmt', 'level', 'color_range',
  'color_space', 'chroma_location', 'field_order', 'r_frame_rate', 'time_base',
];
const sharedAudioFields = [
  'codec_name', 'profile', 'sample_fmt', 'sample_rate', 'channels', 'channel_layout', 'time_base',
];

const assertApprovedMaster = (lesson, probe) => {
  const {video, audio} = probe;
  const expectedVideo = {
    codec_name: 'h264', profile: 'High', width: 1920, height: 1080, pix_fmt: 'yuvj420p',
    level: 40, color_range: 'pc', color_space: 'bt470bg', chroma_location: 'center',
    field_order: 'progressive', r_frame_rate: '30/1', time_base: '1/15360',
  };
  const expectedAudio = {
    codec_name: 'aac', profile: 'LC', sample_fmt: 'fltp', sample_rate: '48000',
    channels: 2, channel_layout: 'stereo', time_base: '1/48000',
  };
  for (const [key, expected] of Object.entries(expectedVideo)) {
    assert.equal(streamValue(video, key), expected, `${lesson.slug}: unexpected master video ${key}.`);
  }
  for (const [key, expected] of Object.entries(expectedAudio)) {
    assert.equal(streamValue(audio, key), expected, `${lesson.slug}: unexpected master audio ${key}.`);
  }
  assert.equal(Number(video.nb_read_frames ?? video.nb_frames) > 0, true,
    `${lesson.slug}: master has no counted video frames.`);
};

const assertBookendMatchesMaster = (label, bookend, master, expectedFrames, expectedSeconds) => {
  for (const key of sharedVideoFields) {
    assert.equal(streamValue(bookend.video, key), streamValue(master.video, key),
      `${label}: video parameter ${key} does not match the master.`);
  }
  for (const key of sharedAudioFields) {
    assert.equal(streamValue(bookend.audio, key), streamValue(master.audio, key),
      `${label}: audio parameter ${key} does not match the master.`);
  }
  assert.equal(bookend.videoExtradataSha256, master.videoExtradataSha256,
    `${label}: H.264 codec configuration does not match the master.`);
  assert.equal(bookend.audioExtradataSha256, master.audioExtradataSha256,
    `${label}: AAC codec configuration does not match the master.`);
  assert.equal(Number(bookend.video.nb_read_frames ?? bookend.video.nb_frames), expectedFrames,
    `${label}: wrong video frame count.`);
  assert.equal(Number(bookend.video.duration), expectedSeconds, `${label}: wrong video duration.`);
  assert.ok(Number(bookend.audio.duration) <= expectedSeconds,
    `${label}: silence exceeds its video duration.`);
};

const writeJsonAtomic = (file, value) => {
  const temporary = `${file}.in-progress`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(temporary, file);
};

const loadPreviousReport = () => {
  if (!existsSync(VERIFICATION_FILE)) return null;
  try {
    const report = JSON.parse(readFileSync(VERIFICATION_FILE, 'utf8'));
    return report.schemaVersion === REPORT_SCHEMA_VERSION ? report : null;
  } catch {
    return null;
  }
};

const baseReport = (previous, lessonCount) => ({
  schemaVersion: REPORT_SCHEMA_VERSION,
  generatedAt: new Date().toISOString(),
  lessonCount,
  completedCount: 0,
  subtitle: SUBTITLE,
  compositions: {
    intro: {id: 'Stem4LifeIntroB', frames: INTRO_FRAMES, fps: FPS, heroHeight: 518},
    outro: {id: 'Stem4LifeOutro', frames: OUTRO_FRAMES, fps: FPS},
  },
  concatStrategy: {
    type: 'FFmpeg concat demuxer with stream copy',
    commandCodec: 'copy',
    rationale: 'All 31 masters share one H.264/AAC signature. Each bookend is encoded and checked against that signature so the long approved lesson body is remuxed without re-encoding. Six masters retain two negative AAC priming packets; their silent intro tracks end earlier so those packets enter without DTS correction.',
    bodyReencoded: false,
  },
  verification: {
    durationToleranceSeconds: DURATION_TOLERANCE_SECONDS,
    durationToleranceFrames: 1,
    bodyFrameMethod: 'SHA-256 of decoded RGB24 frames at matching middle-body timestamps',
    fullDecode: true,
    concatDiagnostics: 'FFmpeg warning output must be empty, including at AAC priming boundaries.',
  },
  stills: {
    requestedIntroMotionSeconds: INTRO_MOTION_STILL_SECONDS,
    settledIntroTitleSeconds: INTRO_TITLE_STILL_SECONDS,
    outroUrlSecondsAfterOutroStart: OUTRO_URL_HOLD_SECONDS,
    note: 'Intro B has no lesson title at 2.4s, so the contact sheet uses the additional settled-title still at 4.2s.',
  },
  contactSheet: previous?.contactSheet ?? null,
  lessons: previous?.lessons ?? [],
});

const makeFfmpegOverride = ({type, args}) => {
  if (type !== 'stitcher') return args;
  const next = [...args];
  for (let index = 0; index < next.length; index++) {
    if (next[index] === '-pix_fmt') next[index + 1] = 'yuvj420p';
    if (next[index] === '-video_track_timescale') next[index + 1] = '15360';
  }
  next.splice(next.length - 1, 0,
    '-color_range', 'pc',
    '-colorspace', 'bt470bg',
    '-chroma_sample_location', 'center',
    '-x264-params', 'chromaloc=1',
    '-profile:v', 'high',
    '-level:v', '4.0');
  return next;
};

const renderBookendVideo = async ({serveUrl, lesson, id, output, expectedFrames, ordinal, total, fonts}) => {
  const inputProps = {title: lesson.title, subtitle: lesson.subtitle};
  const composition = await selectComposition({
    serveUrl,
    id,
    inputProps,
    browserExecutable,
  });
  assert.equal(composition.durationInFrames, expectedFrames, `${id}: unexpected duration.`);
  assert.equal(composition.fps, FPS, `${id}: unexpected frame rate.`);
  assert.equal(composition.width, 1920, `${id}: unexpected width.`);
  assert.equal(composition.height, 1080, `${id}: unexpected height.`);
  assert.equal(composition.props.title, lesson.title, `${id}: title prop did not resolve.`);
  assert.equal(composition.props.subtitle, SUBTITLE, `${id}: subtitle prop did not resolve.`);
  if (id === 'Stem4LifeIntroB') {
    assert.equal(composition.props.heroHeight, 518, 'Stem4LifeIntroB must use the default 518px hero.');
  }
  if (id === 'Stem4LifeOutro') {
    assert.equal(composition.props.aesthetic, 'C', 'Stem4LifeOutro must use the shared default aesthetic.');
  }

  let lastStep = -1;
  await renderMedia({
    serveUrl,
    composition,
    inputProps,
    outputLocation: output,
    browserExecutable,
    codec: 'h264',
    crf: 18,
    imageFormat: 'png',
    concurrency: 2,
    disallowParallelEncoding: true,
    timeoutInMilliseconds: 120_000,
    ffmpegOverride: makeFfmpegOverride,
    overwrite: true,
    onBrowserLog: (log) => {
      if (log.text.startsWith('[Stem4Life fonts]')) fonts.add(log.text);
      if (log.type === 'error') console.error(log.text);
    },
    onProgress: ({progress}) => {
      const step = Math.min(4, Math.floor(progress * 4));
      if (step !== lastStep) {
        lastStep = step;
        console.log(`[${ordinal}/${total}] ${lesson.slug}: ${id} ${step * 25}%`);
      }
    },
  });
};

const ensureSilence = (file, requestedEncoderFrames, expectedPackets) => {
  run('ffmpeg', [
    '-y', '-v', 'error',
    '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
    '-frames:a', String(requestedEncoderFrames),
    '-c:a', 'aac', '-b:a', '192k', '-f', 'adts', file,
  ]);
  const packetCount = Number(run('ffprobe', [
    '-v', 'error', '-count_packets', '-select_streams', 'a:0',
    '-show_entries', 'stream=nb_read_packets', '-of', 'default=nw=1:nk=1', file,
  ]).trim());
  assert.equal(packetCount, expectedPackets, `${file}: unexpected AAC packet count.`);
};

const muxBookend = (videoOnly, silence, destination) => {
  run('ffmpeg', [
    '-y', '-v', 'error', '-i', videoOnly, '-i', silence,
    '-map', '0:v:0', '-map', '1:a:0', '-c', 'copy',
    '-bsf:v', 'h264_metadata=sample_aspect_ratio=1/1',
    '-video_track_timescale', '15360', '-movflags', '+faststart', destination,
  ]);
};

const quoteConcatPath = (file) => `file '${file.replaceAll("'", "'\\''")}'`;

const concatenate = ({intro, master, outro, manifest, destination, label}) => {
  writeFileSync(manifest, `${[intro, master, outro].map(quoteConcatPath).join('\n')}\n`);
  const result = spawnSync('ffmpeg', [
    '-y', '-v', 'warning', '-f', 'concat', '-safe', '0', '-i', manifest,
    '-map', '0:v:0', '-map', '0:a:0', '-c', 'copy',
    '-video_track_timescale', '15360', '-movflags', '+faststart', destination,
  ], {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${label}: FFmpeg concat failed (${result.status}).\n${result.stderr}`);
  }
  const warnings = result.stderr.trim();
  assert.equal(warnings, '', `${label}: FFmpeg concat emitted a warning.\n${warnings}`);
  return {warningFree: true};
};

const decodeFrame = (file, timestampSeconds) => run('ffmpeg', [
  '-v', 'error', '-ss', timestampSeconds.toFixed(9), '-i', file,
  '-map', '0:v:0', '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', 'pipe:1',
], {encoding: null, maxBuffer: 16 * 1024 * 1024});

const extractStill = (file, timestampSeconds, destination) => {
  run('ffmpeg', [
    '-y', '-v', 'error', '-ss', timestampSeconds.toFixed(9), '-i', file,
    '-map', '0:v:0', '-frames:v', '1', destination,
  ]);
};

const compareBodyFrame = ({source, output, sourceFrameCount}) => {
  const sourceFrameIndex = Math.floor(sourceFrameCount / 2);
  const sourceTimestampSeconds = sourceFrameIndex / FPS;
  const outputTimestampSeconds = INTRO_SECONDS + sourceTimestampSeconds;
  const sourceFrame = decodeFrame(source, sourceTimestampSeconds);
  const outputFrame = decodeFrame(output, outputTimestampSeconds);
  assert.equal(sourceFrame.length, 1920 * 1080 * 3, 'Source comparison frame has the wrong byte length.');
  assert.equal(outputFrame.length, sourceFrame.length, 'Output comparison frame has the wrong byte length.');
  const sourceFrameSha256 = sha256Buffer(sourceFrame);
  const outputFrameSha256 = sha256Buffer(outputFrame);
  const bitExact = sourceFrameSha256 === outputFrameSha256;
  return {
    method: 'decoded RGB24 SHA-256',
    sourceFrameIndex,
    outputFrameIndex: INTRO_FRAMES + sourceFrameIndex,
    sourceTimestampSeconds: round(sourceTimestampSeconds),
    outputTimestampSeconds: round(outputTimestampSeconds),
    sourceFrameSha256,
    outputFrameSha256,
    bitExact,
    psnr: bitExact ? 'infinite' : null,
  };
};

const verifyFullDecode = (file) => {
  run('ffmpeg', [
    '-v', 'error', '-i', file, '-map', '0:v:0', '-map', '0:a:0', '-f', 'null', '-',
  ]);
  return true;
};

const verifyOutput = ({lesson, sourceProbe, output, introProbe, outroProbe}) => {
  const outputProbe = probeMedia(output, true);
  const sourceFrameCount = Number(sourceProbe.video.nb_read_frames ?? sourceProbe.video.nb_frames);
  const frameCount = Number(outputProbe.video.nb_read_frames ?? outputProbe.video.nb_frames);
  const expectedFrameCount = INTRO_FRAMES + sourceFrameCount + OUTRO_FRAMES;
  assert.equal(frameCount, expectedFrameCount, `${lesson.slug}: output frame count mismatch.`);

  for (const key of sharedVideoFields) {
    assert.equal(streamValue(outputProbe.video, key), streamValue(sourceProbe.video, key),
      `${lesson.slug}: output video parameter ${key} changed.`);
  }
  for (const key of sharedAudioFields) {
    assert.equal(streamValue(outputProbe.audio, key), streamValue(sourceProbe.audio, key),
      `${lesson.slug}: output audio parameter ${key} changed.`);
  }
  assert.equal(outputProbe.videoExtradataSha256, sourceProbe.videoExtradataSha256,
    `${lesson.slug}: output H.264 configuration changed.`);
  assert.equal(outputProbe.audioExtradataSha256, sourceProbe.audioExtradataSha256,
    `${lesson.slug}: output AAC configuration changed.`);

  const expectedDurationSeconds = INTRO_SECONDS + Number(sourceProbe.format.duration) + OUTRO_SECONDS;
  const videoDurationSeconds = Number(outputProbe.video.duration);
  const audioDurationSeconds = Number(outputProbe.audio.duration);
  const formatDurationSeconds = Number(outputProbe.format.duration);
  const durationDeltaSeconds = videoDurationSeconds - expectedDurationSeconds;
  assert.ok(Math.abs(durationDeltaSeconds) <= DURATION_TOLERANCE_SECONDS,
    `${lesson.slug}: duration differs by ${durationDeltaSeconds}s (more than one frame).`);
  assert.ok(videoDurationSeconds >= audioDurationSeconds,
    `${lesson.slug}: video (${videoDurationSeconds}s) ends before audio (${audioDurationSeconds}s).`);

  const bodyFrameComparison = compareBodyFrame({
    source: lesson.sourceMaster,
    output,
    sourceFrameCount,
  });
  assert.ok(bodyFrameComparison.bitExact,
    `${lesson.slug}: middle lesson-body frame is not bit-exact; the body may have been re-encoded or shifted.`);

  return {
    outputProbe,
    frameCount,
    expectedFrameCount,
    expectedDurationSeconds,
    videoDurationSeconds,
    audioDurationSeconds,
    formatDurationSeconds,
    durationDeltaSeconds,
    bodyFrameComparison,
    fullDecodePassed: verifyFullDecode(output),
    bookendDurations: {
      introVideoSeconds: Number(introProbe.video.duration),
      introAudioSeconds: Number(introProbe.audio.duration),
      outroVideoSeconds: Number(outroProbe.video.duration),
      outroAudioSeconds: Number(outroProbe.audio.duration),
    },
  };
};

const escapeXml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const makeContactSheet = async (lessons) => {
  const columns = 4;
  const cardWidth = 480;
  const cardHeight = 270;
  const labelHeight = 42;
  const headerHeight = 70;
  const rows = Math.ceil(lessons.length / columns);
  const layers = [];

  for (let index = 0; index < lessons.length; index++) {
    const lesson = lessons[index];
    const still = join(STILLS_DIR, `${lesson.slug}-intro-title.png`);
    assert.ok(existsSync(still), `Missing contact-sheet still: ${still}`);
    const left = (index % columns) * cardWidth;
    const top = headerHeight + Math.floor(index / columns) * (cardHeight + labelHeight);
    layers.push({
      input: await sharp(still).resize(cardWidth, cardHeight).png().toBuffer(),
      left,
      top,
    });
    const label = `${String(index + 1).padStart(2, '0')}  ${lesson.slug}`;
    const svg = `<svg width="${cardWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111923"/><text x="14" y="27" font-family="DejaVu Sans, sans-serif" font-size="14" fill="#F6F3EB">${escapeXml(label)}</text></svg>`;
    layers.push({input: Buffer.from(svg), left, top: top + cardHeight});
  }

  const header = `<svg width="${cardWidth * columns}" height="${headerHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#182230"/><text x="28" y="43" font-family="DejaVu Sans, sans-serif" font-size="26" font-weight="700" fill="#FFAC8F">Stem 4 Life · Cambridge A Level Mechanics · ${lessons.length} intro title cards</text></svg>`;
  layers.push({input: Buffer.from(header), left: 0, top: 0});

  const temporary = join(OUTPUT_DIR, '.contact-sheet.in-progress.png');
  await sharp({
    create: {
      width: cardWidth * columns,
      height: headerHeight + rows * (cardHeight + labelHeight),
      channels: 3,
      background: '#182230',
    },
  }).composite(layers).png().toFile(temporary);
  renameSync(temporary, CONTACT_SHEET_FILE);
  return {
    file: relative(REPO_DIR, CONTACT_SHEET_FILE),
    lessons: lessons.length,
    columns,
    rows,
    frameTimeSeconds: INTRO_TITLE_STILL_SECONDS,
    sha256: await sha256File(CONTACT_SHEET_FILE),
  };
};

const saveReport = (report, lessonOrder) => {
  const order = new Map(lessonOrder.map((lesson, index) => [lesson.slug, index]));
  report.lessons.sort((a, b) => order.get(a.slug) - order.get(b.slug));
  report.completedCount = report.lessons.length;
  report.generatedAt = new Date().toISOString();
  writeJsonAtomic(VERIFICATION_FILE, report);
};

const validCompletedEntry = async (entry, lesson, sourceSha256, sourceAudioFirstDtsSeconds) => {
  if (!entry || entry.sourceMasterSha256 !== sourceSha256 || !entry.bodyFrameComparison?.bitExact
    || !entry.fullDecodePassed) return false;
  if (sourceAudioFirstDtsSeconds < 0
    && (entry.bookendDurations?.introAudioSeconds > 4.95 || !entry.concatDiagnostics?.warningFree)) {
    return false;
  }
  const output = join(OUTPUT_DIR, `${lesson.slug}.mp4`);
  if (!existsSync(output)) return false;
  return await sha256File(output) === entry.outputSha256;
};

const ensureEvidenceStills = (lesson, sourceProbe, output) => {
  const introMotion = join(STILLS_DIR, `${lesson.slug}-intro-2.4s.png`);
  const introTitle = join(STILLS_DIR, `${lesson.slug}-intro-title.png`);
  const outroUrl = join(STILLS_DIR, `${lesson.slug}-outro-url.png`);
  if (!existsSync(introMotion)) extractStill(output, INTRO_MOTION_STILL_SECONDS, introMotion);
  if (!existsSync(introTitle)) extractStill(output, INTRO_TITLE_STILL_SECONDS, introTitle);
  if (!existsSync(outroUrl)) {
    extractStill(output, INTRO_SECONDS + Number(sourceProbe.format.duration) + OUTRO_URL_HOLD_SECONDS, outroUrl);
  }
  return {
    introMotion: relative(REPO_DIR, introMotion),
    introTitle: relative(REPO_DIR, introTitle),
    outroUrl: relative(REPO_DIR, outroUrl),
  };
};

const main = async () => {
  const {all, force, slug: requestedSlug} = parseArguments();
  ensureCommand('ffmpeg');
  ensureCommand('ffprobe');
  assert.ok(existsSync(ENTRY_FILE), `Missing Stem 4 Life entry: ${ENTRY_FILE}`);
  assert.ok(existsSync(FONT_DIR), `Missing Stem 4 Life fonts: ${FONT_DIR}`);

  mkdirSync(OUTPUT_DIR, {recursive: true});
  mkdirSync(WORK_DIR, {recursive: true});
  mkdirSync(STILLS_DIR, {recursive: true});
  mkdirSync(join(STAGED_PUBLIC_DIR, 'stem4life'), {recursive: true});
  cpSync(FONT_DIR, join(STAGED_PUBLIC_DIR, 'stem4life/fonts'), {recursive: true});

  const lessons = readRegistryLessons();
  const selected = all
    ? lessons
    : lessons.filter((lesson) => lesson.slug === requestedSlug || lesson.registrySlug === requestedSlug);
  if (!selected.length) {
    throw new Error(`Unknown non-Fable mechanics slug: ${requestedSlug}.`);
  }

  const previous = loadPreviousReport();
  const report = baseReport(previous, lessons.length);
  const entries = new Map(report.lessons.map((entry) => [entry.slug, entry]));
  const jobs = [];

  for (const lesson of selected) {
    const sourceProbe = probeMedia(lesson.sourceMaster);
    assertApprovedMaster(lesson, sourceProbe);
    const sourceMasterSha256 = await sha256File(lesson.sourceMaster);
    const sourceAudioFirstDtsSeconds = probeFirstAudioDtsSeconds(lesson.sourceMaster);
    if (!force && await validCompletedEntry(entries.get(lesson.slug), lesson, sourceMasterSha256,
      sourceAudioFirstDtsSeconds)) {
      const output = join(OUTPUT_DIR, `${lesson.slug}.mp4`);
      ensureEvidenceStills(lesson, sourceProbe, output);
      entries.set(lesson.slug, {
        ...entries.get(lesson.slug),
        sourceAudioFirstDtsSeconds: round(sourceAudioFirstDtsSeconds),
        aacPrimingAdjusted: false,
      });
      console.log(`[skip] ${lesson.slug}: existing output and verification hashes match (use --force to rebuild).`);
      continue;
    }
    jobs.push({lesson, sourceProbe, sourceMasterSha256, sourceAudioFirstDtsSeconds});
  }

  let serveUrl = null;
  const fonts = new Set();
  if (jobs.length) {
    console.log(`Bundling Stem 4 Life entry once for ${jobs.length} lesson${jobs.length === 1 ? '' : 's'}...`);
    serveUrl = await bundle({
      entryPoint: ENTRY_FILE,
      publicDir: STAGED_PUBLIC_DIR,
      outDir: BUNDLE_DIR,
    });
  }

  const silenceDir = join(WORK_DIR, 'silence');
  mkdirSync(silenceDir, {recursive: true});
  const introSilence = join(silenceDir, 'intro.aac');
  const primedIntroSilence = join(silenceDir, 'intro-before-primed-source.aac');
  const outroSilence = join(silenceDir, 'outro.aac');
  if (jobs.length) {
    // The native AAC encoder emits one delayed packet when flushed. These
    // counts yield 234 (4.992s) and 281 (5.994667s) muxed packets so silence
    // never runs past the 5s/6s video bookends.
    ensureSilence(introSilence, 233, 234);
    // Some masters retain two negative AAC priming packets. Ending silence at
    // 4.949333s leaves those packets their original 42.667ms lead-in and avoids
    // FFmpeg rewriting a packet timestamp at the 5s join.
    ensureSilence(primedIntroSilence, 231, 232);
    ensureSilence(outroSilence, 280, 281);
  }

  for (let index = 0; index < jobs.length; index++) {
    const {lesson, sourceProbe, sourceMasterSha256, sourceAudioFirstDtsSeconds} = jobs[index];
    const ordinal = index + 1;
    const work = join(WORK_DIR, lesson.slug);
    mkdirSync(work, {recursive: true});
    const introVideoOnly = join(work, 'intro-video-only.mp4');
    const outroVideoOnly = join(work, 'outro-video-only.mp4');
    const intro = join(work, 'intro.mp4');
    const outro = join(work, 'outro.mp4');
    const concatManifest = join(work, 'concat.txt');
    const candidate = join(work, `${lesson.slug}.mp4`);
    const output = join(OUTPUT_DIR, `${lesson.slug}.mp4`);

    console.log(`[${ordinal}/${jobs.length}] ${lesson.slug}: ${lesson.title}`);
    await renderBookendVideo({
      serveUrl, lesson, id: 'Stem4LifeIntroB', output: introVideoOnly,
      expectedFrames: INTRO_FRAMES, ordinal, total: jobs.length, fonts,
    });
    const aacPrimingAdjusted = sourceAudioFirstDtsSeconds < 0;
    muxBookend(introVideoOnly, aacPrimingAdjusted ? primedIntroSilence : introSilence, intro);
    const introProbe = probeMedia(intro);
    assertBookendMatchesMaster(`${lesson.slug} intro`, introProbe, sourceProbe, INTRO_FRAMES, INTRO_SECONDS);

    await renderBookendVideo({
      serveUrl, lesson, id: 'Stem4LifeOutro', output: outroVideoOnly,
      expectedFrames: OUTRO_FRAMES, ordinal, total: jobs.length, fonts,
    });
    muxBookend(outroVideoOnly, outroSilence, outro);
    const outroProbe = probeMedia(outro);
    assertBookendMatchesMaster(`${lesson.slug} outro`, outroProbe, sourceProbe, OUTRO_FRAMES, OUTRO_SECONDS);

    console.log(`[${ordinal}/${jobs.length}] ${lesson.slug}: stream-copy concat and verification`);
    const concatDiagnostics = concatenate({
      intro, master: lesson.sourceMaster, outro, manifest: concatManifest,
      destination: candidate, label: lesson.slug,
    });
    const verification = verifyOutput({lesson, sourceProbe, output: candidate, introProbe, outroProbe});
    const outputSha256 = await sha256File(candidate);
    const stillPaths = ensureEvidenceStills(lesson, sourceProbe, candidate);
    renameSync(candidate, output);

    entries.set(lesson.slug, {
      slug: lesson.slug,
      registrySlug: lesson.registrySlug,
      title: lesson.title,
      subtitle: lesson.subtitle,
      sourceMaster: relative(REPO_DIR, lesson.sourceMaster),
      sourceMasterSha256,
      sourceAudioFirstDtsSeconds: round(sourceAudioFirstDtsSeconds),
      aacPrimingAdjusted,
      output: relative(REPO_DIR, output),
      outputSha256,
      frameCount: verification.frameCount,
      expectedFrameCount: verification.expectedFrameCount,
      videoDurationSeconds: round(verification.videoDurationSeconds),
      audioDurationSeconds: round(verification.audioDurationSeconds),
      formatDurationSeconds: round(verification.formatDurationSeconds),
      expectedDurationSeconds: round(verification.expectedDurationSeconds),
      durationDeltaSeconds: round(verification.durationDeltaSeconds, 9),
      durationDeltaFrames: round(verification.durationDeltaSeconds * FPS, 6),
      videoEndsAtOrAfterAudio: verification.videoDurationSeconds >= verification.audioDurationSeconds,
      fullDecodePassed: verification.fullDecodePassed,
      concatDiagnostics,
      bodyFrameComparison: verification.bodyFrameComparison,
      bookendDurations: verification.bookendDurations,
      stills: stillPaths,
    });
    report.lessons = [...entries.values()];
    saveReport(report, lessons);
    console.log(`[${ordinal}/${jobs.length}] ${lesson.slug}: complete (${verification.frameCount} frames, body frame bit-exact)`);
  }

  if (jobs.length && !fonts.size) {
    throw new Error('No successful Stem 4 Life local-font load evidence was captured.');
  }

  report.lessons = [...entries.values()];
  const allComplete = lessons.every((lesson) => entries.has(lesson.slug)
    && existsSync(join(OUTPUT_DIR, `${lesson.slug}.mp4`)));
  if (allComplete) {
    report.contactSheet = await makeContactSheet(lessons);
  }
  saveReport(report, lessons);

  console.log(`Done: ${selected.length} selected, ${jobs.length} rendered, ${selected.length - jobs.length} skipped.`);
  console.log(`Verification: ${VERIFICATION_FILE}`);
  if (allComplete) console.log(`Contact sheet: ${CONTACT_SHEET_FILE}`);
};

main().catch((error) => {
  console.error(error.stack ?? error.message ?? error);
  process.exitCode = 1;
});
