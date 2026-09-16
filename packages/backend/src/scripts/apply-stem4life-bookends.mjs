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
const MUSIC_FILE = join(REPO_DIR, 'remotion-branding/public/cln-tutorial/audio/tutorial.mp3');

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
const REPORT_SCHEMA_VERSION = 2;
const EXPECTED_MUSIC_SHA256 = 'f1928a7b68b79b89c843af517583ddc636773e8c4a354e3b610d42611962d186';
const MUSIC_RECIPE_ID = 'blue-sea-bookends-v1';
const MUSIC_GAIN_DB = -13;
const AUDIO_SAMPLE_RATE = 48_000;
const AAC_SAMPLES_PER_PACKET = 1024;
const PCM_COMPARISON_FORMAT = 'f32le';
const PCM_COMPARISON_CODEC = 'pcm_f32le';
const SEAM_BIN_SECONDS = 0.1;
const MUSIC_SECTIONS = {
  intro: {
    sourceStartSeconds: 20.133333,
    sourceEndSeconds: 25.133333,
    fadeInSeconds: 0.4,
    fadeOutStartSeconds: 3.5,
    fadeOutSeconds: 1.2,
    silentTailSeconds: 0.3,
    rationale: 'Starts 22ms before the strong 20.155s downbeat and follows five recurring beat accents. The envelope reaches digital zero at 4.700s, leaving 300ms clear before narration.',
  },
  outro: {
    sourceStartSeconds: 68,
    sourceEndSeconds: 74,
    fadeInSeconds: 0.5,
    fadeOutStartSeconds: 4,
    fadeOutSeconds: 1.7,
    silentTailSeconds: 0.3,
    rationale: 'Uses the track\'s authored final cadence; its natural decay is below -60 dBFS by 73.677s. The explicit envelope reaches zero at 5.700s and leaves the final 300ms silent.',
  },
};

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

const runCaptured = (command, args, label = command) => {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${label} failed (${result.status}).\n${result.stderr}`);
  }
  return result;
};

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

const parseLevel = (value) => value === '-inf' ? '-inf' : Number(value);

const levelAtOrBelow = (value, threshold) => value === '-inf' || value <= threshold;

const analyzeLoudness = (file, {startSeconds, durationSeconds} = {}) => {
  const args = ['-hide_banner', '-nostats'];
  if (startSeconds !== undefined) args.push('-ss', String(startSeconds));
  if (durationSeconds !== undefined) args.push('-t', String(durationSeconds));
  args.push('-i', file, '-map', '0:a:0', '-af', 'ebur128=peak=true', '-f', 'null', '-');
  const {stderr} = runCaptured('ffmpeg', args, `Loudness analysis for ${file}`);
  const summary = stderr.slice(stderr.lastIndexOf('Summary:'));
  const integrated = summary.match(/I:\s+(-?inf|-?\d+(?:\.\d+)?) LUFS/);
  const truePeak = summary.match(/Peak:\s+(-?inf|-?\d+(?:\.\d+)?) dBFS/);
  assert.ok(integrated, `Could not parse integrated loudness for ${file}.`);
  assert.ok(truePeak, `Could not parse true peak for ${file}.`);
  return {
    integratedLufs: parseLevel(integrated[1]),
    truePeakDbfs: parseLevel(truePeak[1]),
  };
};

const measureVolume = (file, {startSeconds, durationSeconds} = {}) => {
  const args = ['-hide_banner', '-nostats'];
  if (startSeconds !== undefined) args.push('-ss', String(startSeconds));
  if (durationSeconds !== undefined) args.push('-t', String(durationSeconds));
  args.push('-i', file, '-map', '0:a:0', '-af', 'volumedetect', '-f', 'null', '-');
  const {stderr} = runCaptured('ffmpeg', args, `Volume analysis for ${file}`);
  const mean = stderr.match(/mean_volume:\s+(-?inf|-?\d+(?:\.\d+)?) dB/);
  const peak = stderr.match(/max_volume:\s+(-?inf|-?\d+(?:\.\d+)?) dB/);
  assert.ok(mean, `Could not parse mean volume for ${file}.`);
  assert.ok(peak, `Could not parse peak volume for ${file}.`);
  return {
    meanDbfs: parseLevel(mean[1]),
    peakDbfs: parseLevel(peak[1]),
  };
};

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
    `${label}: audio exceeds its video duration.`);
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
  music: {
    recipeId: MUSIC_RECIPE_ID,
    source: relative(REPO_DIR, MUSIC_FILE),
    sourceSha256: null,
    expectedSourceSha256: EXPECTED_MUSIC_SHA256,
    track: 'Blue Sea — Swoop',
    gainDb: MUSIC_GAIN_DB,
    fadeCurve: 'quarter-sine (FFmpeg qsin)',
    sections: MUSIC_SECTIONS,
    encodes: previous?.music?.encodes ?? null,
  },
  leveling: {
    narrationReferenceWindow: '1.000s to 61.000s of each approved master',
    rationale: 'Music is set near -22 LUFS, about 1 LU below representative narration around -21 LUFS, with substantially lower peaks. The intro is then silent for 300ms before the lesson.',
    narrationSummary: previous?.leveling?.narrationSummary ?? null,
  },
  concatStrategy: {
    type: 'FFmpeg concat demuxer with stream copy',
    commandCodec: 'copy',
    rationale: 'All 31 masters share one H.264/AAC signature. Music is encoded only into the bookend AAC streams; the approved lesson H.264 and AAC packets are remuxed without re-encoding. Six masters retain two negative AAC priming packets, so their intro tracks end earlier and leave those packets their original timestamp lead-in.',
    bodyReencoded: false,
    narrationReencoded: false,
  },
  verification: {
    durationToleranceSeconds: DURATION_TOLERANCE_SECONDS,
    durationToleranceFrames: 1,
    bodyFrameMethod: 'SHA-256 of decoded RGB24 frames at matching middle-body timestamps',
    lessonAudioMethod: 'SHA-256 of the complete decoded lesson body as f32le 48kHz stereo PCM at matching timestamps',
    lessonAudioAlsoProves: 'No music is present during the lesson body.',
    seamWindows: {
      introSeconds: [4.5, 6],
      outroSecondsBeforeEnd: 7,
      rmsBinSeconds: SEAM_BIN_SECONDS,
    },
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

const ensureBookendMusic = async ({file, section, inputSamples, expectedPackets}) => {
  const recipe = MUSIC_SECTIONS[section];
  assert.ok(recipe, `Unknown music section: ${section}.`);
  const sectionDuration = recipe.sourceEndSeconds - recipe.sourceStartSeconds;
  assert.equal(round(sectionDuration, 6), section === 'intro' ? INTRO_SECONDS : OUTRO_SECONDS,
    `${section}: music source section has the wrong duration.`);
  assert.equal(round(recipe.fadeOutStartSeconds + recipe.fadeOutSeconds + recipe.silentTailSeconds, 6),
    sectionDuration, `${section}: fade and silent tail do not reach the bookend boundary.`);

  const filter = [
    `atrim=start=${recipe.sourceStartSeconds}:end=${recipe.sourceEndSeconds}`,
    'asetpts=N/SR/TB',
    `aresample=${AUDIO_SAMPLE_RATE}`,
    'aformat=channel_layouts=stereo',
    `afade=t=in:st=0:d=${recipe.fadeInSeconds}:curve=qsin`,
    `afade=t=out:st=${recipe.fadeOutStartSeconds}:d=${recipe.fadeOutSeconds}:curve=qsin`,
    `volume=${MUSIC_GAIN_DB}dB`,
    'apad',
    `atrim=end_sample=${inputSamples}`,
  ].join(',');
  run('ffmpeg', [
    '-y', '-v', 'error',
    '-i', MUSIC_FILE, '-map', '0:a:0', '-vn', '-af', filter,
    '-c:a', 'aac', '-b:a', '192k', '-f', 'adts', file,
  ]);
  const packetCount = Number(run('ffprobe', [
    '-v', 'error', '-count_packets', '-select_streams', 'a:0',
    '-show_entries', 'stream=nb_read_packets', '-of', 'default=nw=1:nk=1', file,
  ]).trim());
  assert.equal(packetCount, expectedPackets, `${file}: unexpected AAC packet count.`);
  const loudness = analyzeLoudness(file);
  const volume = measureVolume(file);
  assert.notEqual(loudness.integratedLufs, '-inf', `${section}: encoded music is silent.`);
  assert.notEqual(volume.meanDbfs, '-inf', `${section}: encoded music RMS is silent.`);
  return {
    section,
    inputSamples,
    expectedPackets,
    packetCount,
    sha256: await sha256File(file),
    loudness,
    volume,
  };
};

const muxBookend = (videoOnly, audio, destination) => {
  run('ffmpeg', [
    '-y', '-v', 'error', '-i', videoOnly, '-i', audio,
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

const decodedPcmSha256 = ({file, startSeconds, endSeconds}) => {
  const filter = `atrim=start=${startSeconds.toFixed(9)}:end=${endSeconds.toFixed(9)},asetpts=N/SR/TB`;
  const hashOutput = run('ffmpeg', [
    '-v', 'error', '-i', file, '-map', '0:a:0', '-af', filter,
    '-ar', String(AUDIO_SAMPLE_RATE), '-ac', '2', '-c:a', PCM_COMPARISON_CODEC,
    '-f', 'hash', '-hash', 'sha256', '-',
  ]).trim();
  const match = hashOutput.match(/^SHA256=([a-f0-9]{64})$/);
  assert.ok(match, `Could not parse decoded PCM hash for ${file}.`);
  return match[1];
};

const compareLessonAudio = ({source, output, sourceAudioDurationSeconds}) => {
  assert.ok(Number.isFinite(sourceAudioDurationSeconds) && sourceAudioDurationSeconds > 0,
    `Invalid source audio duration for ${source}.`);
  const sourcePcmSha256 = decodedPcmSha256({
    file: source,
    startSeconds: 0,
    endSeconds: sourceAudioDurationSeconds,
  });
  const outputPcmSha256 = decodedPcmSha256({
    file: output,
    startSeconds: INTRO_SECONDS,
    endSeconds: INTRO_SECONDS + sourceAudioDurationSeconds,
  });
  const bitExact = sourcePcmSha256 === outputPcmSha256;
  return {
    method: `complete decoded ${PCM_COMPARISON_FORMAT} ${AUDIO_SAMPLE_RATE}Hz stereo PCM SHA-256`,
    sourceStartSeconds: 0,
    outputStartSeconds: INTRO_SECONDS,
    comparedDurationSeconds: round(sourceAudioDurationSeconds),
    sourcePcmSha256,
    outputPcmSha256,
    bitExact,
    musicAbsentFromLessonBody: bitExact,
  };
};

const extractAudioWindow = ({source, startSeconds, durationSeconds, destination}) => {
  const endSeconds = startSeconds + durationSeconds;
  run('ffmpeg', [
    '-y', '-v', 'error', '-i', source, '-map', '0:a:0',
    '-af', `atrim=start=${startSeconds.toFixed(9)}:end=${endSeconds.toFixed(9)},asetpts=N/SR/TB`,
    '-ar', String(AUDIO_SAMPLE_RATE), '-ac', '2', '-c:a', 'pcm_s16le', destination,
  ]);
};

const analyzeRmsCurve = ({audio, curveFile}) => {
  const temporary = `${curveFile}.in-progress`;
  const samplesPerBin = Math.round(AUDIO_SAMPLE_RATE * SEAM_BIN_SECONDS);
  run('ffmpeg', [
    '-y', '-v', 'error', '-i', audio,
    '-af', `asetnsamples=n=${samplesPerBin}:p=1,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=${temporary}`,
    '-f', 'null', '-',
  ]);
  renameSync(temporary, curveFile);
  const text = readFileSync(curveFile, 'utf8');
  const values = [];
  const pattern = /frame:(\d+)\s+pts:\d+\s+pts_time:([^\s]+)\s+lavfi\.astats\.Overall\.RMS_level=([^\s]+)/g;
  for (const match of text.matchAll(pattern)) {
    values.push({
      bin: Number(match[1]),
      startSeconds: round(Number(match[2]), 3),
      rmsDbfs: parseLevel(match[3]),
    });
  }
  assert.ok(values.length, `No RMS curve values parsed from ${curveFile}.`);
  return values;
};

const analyzeBookendAudio = ({output, videoDurationSeconds, work}) => {
  const introMusic = measureVolume(output, {startSeconds: 0.4, durationSeconds: 3.1});
  const outroStartSeconds = videoDurationSeconds - OUTRO_SECONDS;
  const outroMusic = measureVolume(output, {startSeconds: outroStartSeconds + 0.5, durationSeconds: 3.2});
  assert.notEqual(introMusic.meanDbfs, '-inf', 'Intro music is silent.');
  assert.notEqual(outroMusic.meanDbfs, '-inf', 'Outro music is silent.');
  assert.ok(introMusic.meanDbfs > -60, `Intro music is unexpectedly quiet (${introMusic.meanDbfs} dBFS).`);
  assert.ok(outroMusic.meanDbfs > -60, `Outro music is unexpectedly quiet (${outroMusic.meanDbfs} dBFS).`);

  const seams = join(work, 'seams');
  mkdirSync(seams, {recursive: true});
  const introWav = join(seams, 'intro-seam-4.5-6.0.wav');
  const outroWav = join(seams, 'outro-seam-final-7s.wav');
  const introCurveFile = join(seams, 'intro-seam-rms-100ms.txt');
  const outroCurveFile = join(seams, 'outro-seam-rms-100ms.txt');
  extractAudioWindow({source: output, startSeconds: 4.5, durationSeconds: 1.5, destination: introWav});
  extractAudioWindow({
    source: output,
    startSeconds: videoDurationSeconds - 7,
    durationSeconds: 7,
    destination: outroWav,
  });
  const introCurve = analyzeRmsCurve({audio: introWav, curveFile: introCurveFile});
  const outroCurve = analyzeRmsCurve({audio: outroWav, curveFile: outroCurveFile});
  const introSilentTail = introCurve.filter(({startSeconds}) => startSeconds >= 0.3 && startSeconds < 0.5);
  const outroSilentTail = outroCurve.filter(({startSeconds}) => startSeconds >= 6.8);
  assert.equal(introSilentTail.length, 2, 'Intro seam must contain two final 100ms pre-lesson bins.');
  assert.ok(introSilentTail.every(({rmsDbfs}) => levelAtOrBelow(rmsDbfs, -60)),
    'Intro music did not reach silence before the lesson boundary.');
  assert.ok(outroSilentTail.length >= 2, 'Outro seam must contain final silence bins.');
  assert.ok(outroSilentTail.every(({rmsDbfs}) => levelAtOrBelow(rmsDbfs, -60)),
    'Outro music did not fade to silence by the final frame.');

  return {
    musicPresence: {
      intro: {...introMusic, measuredWindowSeconds: [0.4, 3.5], present: true},
      outro: {
        ...outroMusic,
        measuredWindowSeconds: [round(outroStartSeconds + 0.5), round(outroStartSeconds + 3.7)],
        present: true,
      },
    },
    seamAnalysis: {
      binSeconds: SEAM_BIN_SECONDS,
      intro: {
        sourceWindowSeconds: [4.5, 6],
        wav: relative(REPO_DIR, introWav),
        curveFile: relative(REPO_DIR, introCurveFile),
        rmsDbfs: introCurve,
        finalPreLessonBinsAtOrBelowMinus60Dbfs: true,
      },
      outro: {
        sourceWindowSeconds: [round(videoDurationSeconds - 7), round(videoDurationSeconds)],
        wav: relative(REPO_DIR, outroWav),
        curveFile: relative(REPO_DIR, outroCurveFile),
        rmsDbfs: outroCurve,
        finalBinsAtOrBelowMinus60Dbfs: true,
      },
    },
  };
};

const verifyFullDecode = (file) => {
  run('ffmpeg', [
    '-v', 'error', '-i', file, '-map', '0:v:0', '-map', '0:a:0', '-f', 'null', '-',
  ]);
  return true;
};

const verifyOutput = ({lesson, sourceProbe, output, introProbe, outroProbe, work}) => {
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

  const sourceAudioDurationSeconds = Number(sourceProbe.audio.duration);
  const lessonAudioComparison = compareLessonAudio({
    source: lesson.sourceMaster,
    output,
    sourceAudioDurationSeconds,
  });
  assert.ok(lessonAudioComparison.bitExact,
    `${lesson.slug}: decoded lesson narration changed or music entered the lesson body.`);

  const narrationWindowStartSeconds = 1;
  const narrationWindowDurationSeconds = Math.min(60,
    sourceAudioDurationSeconds - narrationWindowStartSeconds);
  assert.ok(narrationWindowDurationSeconds > 0, `${lesson.slug}: source narration is too short to analyze.`);
  const narrationLoudness = {
    windowStartSeconds: narrationWindowStartSeconds,
    windowDurationSeconds: round(narrationWindowDurationSeconds),
    ...analyzeLoudness(lesson.sourceMaster, {
      startSeconds: narrationWindowStartSeconds,
      durationSeconds: narrationWindowDurationSeconds,
    }),
    firstSecond: measureVolume(lesson.sourceMaster, {startSeconds: 0, durationSeconds: 1}),
  };
  const bookendAudio = analyzeBookendAudio({output, videoDurationSeconds, work});

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
    lessonAudioComparison,
    narrationLoudness,
    ...bookendAudio,
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
  const narrationLevels = report.lessons
    .map((lesson) => lesson.narrationLoudness?.integratedLufs)
    .filter((value) => Number.isFinite(value));
  const firstSecondLevels = report.lessons
    .map((lesson) => lesson.narrationLoudness?.firstSecond?.meanDbfs)
    .filter((value) => Number.isFinite(value));
  report.leveling.narrationSummary = narrationLevels.length ? {
    lessonsMeasured: narrationLevels.length,
    integratedLufs: {
      mean: round(narrationLevels.reduce((sum, value) => sum + value, 0) / narrationLevels.length, 2),
      min: Math.min(...narrationLevels),
      max: Math.max(...narrationLevels),
    },
    firstSecondMeanDbfs: {
      mean: round(firstSecondLevels.reduce((sum, value) => sum + value, 0) / firstSecondLevels.length, 2),
      min: Math.min(...firstSecondLevels),
      max: Math.max(...firstSecondLevels),
    },
  } : null;
  report.generatedAt = new Date().toISOString();
  writeJsonAtomic(VERIFICATION_FILE, report);
};

const validCompletedEntry = async (entry, lesson, sourceSha256, sourceAudioFirstDtsSeconds) => {
  if (!entry || entry.sourceMasterSha256 !== sourceSha256 || !entry.bodyFrameComparison?.bitExact
    || entry.title !== lesson.title || entry.subtitle !== lesson.subtitle
    || entry.musicRecipeId !== MUSIC_RECIPE_ID || !entry.lessonAudioComparison?.bitExact
    || !entry.lessonAudioComparison?.musicAbsentFromLessonBody
    || !entry.musicPresence?.intro?.present || !entry.musicPresence?.outro?.present
    || !entry.seamAnalysis?.intro?.finalPreLessonBinsAtOrBelowMinus60Dbfs
    || !entry.seamAnalysis?.outro?.finalBinsAtOrBelowMinus60Dbfs
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
  assert.ok(existsSync(MUSIC_FILE), `Missing approved e-wizer music: ${MUSIC_FILE}`);

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
  const sourceMusicSha256 = await sha256File(MUSIC_FILE);
  assert.equal(sourceMusicSha256, EXPECTED_MUSIC_SHA256,
    'The e-wizer music bytes do not match the approved Blue Sea track.');
  report.music.sourceSha256 = sourceMusicSha256;
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
        aacPrimingAdjusted: sourceAudioFirstDtsSeconds < 0,
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

  const musicDir = join(WORK_DIR, 'music');
  mkdirSync(musicDir, {recursive: true});
  const introMusic = join(musicDir, 'intro.aac');
  const primedIntroMusic = join(musicDir, 'intro-before-primed-source.aac');
  const outroMusic = join(musicDir, 'outro.aac');
  if (jobs.length) {
    // Feed exact PCM sample counts into the delayed native AAC encoder. The
    // resulting packet counts preserve the timestamp layout proven by the
    // silent-bookend batch while changing only the bookend payloads.
    const normalIntroEncode = await ensureBookendMusic({
      file: introMusic,
      section: 'intro',
      inputSamples: 233 * AAC_SAMPLES_PER_PACKET,
      expectedPackets: 234,
    });
    // Six masters retain two negative AAC priming packets. Ending the intro at
    // 4.949333s leaves those packets their original 42.667ms lead-in and avoids
    // any timestamp rewrite at the 5s join.
    const primedIntroEncode = await ensureBookendMusic({
      file: primedIntroMusic,
      section: 'intro',
      inputSamples: 231 * AAC_SAMPLES_PER_PACKET,
      expectedPackets: 232,
    });
    const outroEncode = await ensureBookendMusic({
      file: outroMusic,
      section: 'outro',
      inputSamples: 280 * AAC_SAMPLES_PER_PACKET,
      expectedPackets: 281,
    });
    report.music.encodes = {
      normalIntro: normalIntroEncode,
      primedIntro: primedIntroEncode,
      outro: outroEncode,
    };
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
    muxBookend(introVideoOnly, aacPrimingAdjusted ? primedIntroMusic : introMusic, intro);
    const introProbe = probeMedia(intro);
    assertBookendMatchesMaster(`${lesson.slug} intro`, introProbe, sourceProbe, INTRO_FRAMES, INTRO_SECONDS);

    await renderBookendVideo({
      serveUrl, lesson, id: 'Stem4LifeOutro', output: outroVideoOnly,
      expectedFrames: OUTRO_FRAMES, ordinal, total: jobs.length, fonts,
    });
    muxBookend(outroVideoOnly, outroMusic, outro);
    const outroProbe = probeMedia(outro);
    assertBookendMatchesMaster(`${lesson.slug} outro`, outroProbe, sourceProbe, OUTRO_FRAMES, OUTRO_SECONDS);

    console.log(`[${ordinal}/${jobs.length}] ${lesson.slug}: stream-copy concat and verification`);
    const concatDiagnostics = concatenate({
      intro, master: lesson.sourceMaster, outro, manifest: concatManifest,
      destination: candidate, label: lesson.slug,
    });
    const verification = verifyOutput({
      lesson, sourceProbe, output: candidate, introProbe, outroProbe, work,
    });
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
      musicRecipeId: MUSIC_RECIPE_ID,
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
      lessonAudioComparison: verification.lessonAudioComparison,
      narrationLoudness: verification.narrationLoudness,
      musicPresence: verification.musicPresence,
      seamAnalysis: verification.seamAnalysis,
      bookendDurations: verification.bookendDurations,
      stills: stillPaths,
    });
    report.lessons = [...entries.values()];
    saveReport(report, lessons);
    console.log(`[${ordinal}/${jobs.length}] ${lesson.slug}: complete (${verification.frameCount} frames, video and narration bit-exact)`);
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
