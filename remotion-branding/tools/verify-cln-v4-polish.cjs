#!/usr/bin/env node
// Read-only V2 contract checks. QR decoding uses an independent barcode engine.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
for (const extension of ['.ts', '.tsx']) require.extensions[extension] ??= (module, filename) => {
	// Use the actual ESM Audio export in this CJS verification harness. Avoid
	// --conditions=module, which changes Remotion's worker-path resolution.
	const requireFrom = module.require.bind(module);
	module.require = (id) => requireFrom(id === '@remotion/media' ? path.join(path.dirname(require.resolve('@remotion/media/package.json')), require('@remotion/media/package.json').module) : id);
	module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
		compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, resolveJsonModule: true },
	}).outputText, filename);
};
const load = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const { assertV4Polish, verifyV4PolishAssets, CLN_V4_POLISH: polish } = require('../src/cln/v4-polish.ts');
const { musicVolume } = require('../src/cln/V4Polish.tsx');

async function verify() {
	const narration = load('src/cln/narration-v4.json'); const captures = load('src/cln/captures-v4.json');
	const measured = load(`public/${narration.audio.transcript.path}`);
	const checks = [];
	const pass = (name, fn) => { fn(); checks.push(name); };
	pass('V2 Home→scanner order, disclosure, measured ring cues and 8295-frame music contract', () => assertV4Polish(captures, narration, measured));
	await verifyV4PolishAssets(async (file) => new Uint8Array(fs.readFileSync(path.join(root, 'public', file))), async (bytes) => hash(bytes));
	checks.push('V2 exact series music and QR bytes');
	const python = process.env.CLN_V4_QR_PYTHON ?? '/tmp/verify-cln-v4-polish-qr/bin/python';
	assert.ok(fs.existsSync(python), `QR diagnostic required: set CLN_V4_QR_PYTHON to Python with qrcode 8.2, Pillow 11.3.0 and zxing-cpp 2.3.0; missing ${python}`);
	const qr = JSON.parse(execFileSync(python, [path.join(root, 'tools/verify-cln-v4-qr.py')], { encoding: 'utf8' }));
	pass('V2 independent ZXing QR decode equals the exact Premix Area payload', () => {
		assert.equal(qr.decoded, 'kx75czmzd6hc5d7t4wct58tjm188ea8p'); assert.equal(qr.sha256, polish.qr.sha256);
		assert.deepEqual(qr.size, [polish.qr.width, polish.qr.height]); assert.equal(qr.quietZoneModules, 4);
	});
	pass('V2 rings use inspected genuine control coordinates', () => {
		const targets = [
			['scan-entry', '01-', 377, 1422, 112, 112], ['inspect-pass', '09-', 72, 1090, 88, 88],
			['bulk-eligible', '11-', 531, 823, 149, 54], ['major-fields', '13-', 270, 560, 180, 81],
			['critical-grade', '15-', 466, 560, 180, 81], ['unavailable-reason', '17-', 74, 856, 572, 108],
			['bulk-confirm', '19-', 493, 935, 135, 38], ['follow-queue', '22-', 128, 159, 472, 93],
			['follow-expand', '22-', 56, 1124, 608, 87], ['resolved-bands', '26-', 92, 942, 228, 72],
		];
		assert.equal(polish.rings.length, targets.length);
		for (const [beat, prefix, x, y, w, h] of targets) {
			const ring = polish.rings.find((cue) => cue.beat === beat);
			assert.ok(ring && path.basename(ring.capturePath).startsWith(prefix), beat);
			assert.deepEqual(ring.rect, { x: x / 720, y: y / 1600, w: w / 720, h: h / 1600 });
		}
	});
	const musicProbe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', path.join(root, 'public', polish.music.path)], { encoding: 'utf8' }));
	pass('V2 music has explicit source trims, non-clipping gain and zero body overlap', () => {
		const stream = musicProbe.streams.find((item) => item.codec_type === 'audio');
		assert.equal(stream.codec_name, 'mp3'); assert.equal(Number(stream.sample_rate), 44100); assert.equal(stream.channels, 2);
		assert.equal(Number(musicProbe.format.duration), polish.music.sourceDurationSeconds);
		for (const segment of polish.music.segments) {
			assert.equal(musicVolume(0, segment.durationInFrames), 0); assert.equal(musicVolume(segment.durationInFrames - 1, segment.durationInFrames), 0);
			for (let frame = 0; frame < segment.durationInFrames; frame++) assert.ok(musicVolume(frame, segment.durationInFrames) >= 0 && musicVolume(frame, segment.durationInFrames) <= 0.88);
			assert.ok(segment.trimAfter / 30 < polish.music.sourceDurationSeconds);
		}
		for (const beat of narration.beats.filter((item) => item.narration)) for (const segment of polish.music.segments) assert.ok(segment.from + segment.durationInFrames <= beat.from || segment.from >= beat.from + beat.durationInFrames);
	});
	pass('V2 rejects incorrect QR, source order, evidence anchors, word cues and music', () => {
		for (const mutate of [
			(p) => { p.qr.payload += 'x'; }, (p) => { p.qr.disclosure = ''; }, (p) => { p.qr.rect.y = 0; },
			(p) => { p.simulationBanner.text = 'DEMO'; }, (p) => { p.simulationBanner.left = 100; },
			(p) => { p.scan.homeBeat = 'due'; }, (p) => { p.rings[0].captureSha256 = '0'.repeat(64); },
			(p) => { p.rings[0].fromFrame++; }, (p) => { p.rings[0].rect.x = 1; },
			(p) => { p.music.segments[0].durationInFrames++; }, (p) => { p.music.sha256 = '0'.repeat(64); },
			(p) => { p.music.fadeOutFrames = 0; }, (p) => { p.totalFrames++; },
		]) { const invalid = structuredClone(polish); mutate(invalid); assert.throws(() => assertV4Polish(captures, narration, measured, invalid), /CLN V4 polish/); }
	});
	pass('V2 uses Remotion image/media primitives, frame envelopes and final-only labels', () => {
		const code = fs.readFileSync(path.join(root, 'src/cln/V4Polish.tsx'), 'utf8');
		assert.match(code, /import \{ Audio \} from '@remotion\/media'/); assert.match(code, /<Img data-v4-training-qr src=\{staticFile\(qr.path\)\}/);
		assert.match(code, /trimBefore=\{segment.trimBefore\} trimAfter=\{segment.trimAfter\}/);
		assert.doesNotMatch(code, /<img\b|backgroundImage\s*:|\btransition\s*:|\banimation\s*:|Math\.random|Date\.now|setInterval|setTimeout|INTERNAL PREVIEW|CAPTURE REQUIRED/);
		const component = fs.readFileSync(path.join(root, 'src/cln/CleaningVerificationTutorialV4.tsx'), 'utf8');
		assert.match(component, /data-v4-simulation-banner/); assert.match(component, /<V4Timeline preview=\{false\}/);
		assert.doesNotMatch(component, /data-v4-qr-disclosure|\{capture.disclosure\}|Genuine app capture|SAME GENUINE CAPTURE|Generated teaching overlay|No captured physical/);
		assert.doesNotMatch(narration.beats.map((beat) => [beat.headline, beat.body, beat.emphasis, beat.narration].join(' ')).join('\n'), /INTERNAL PREVIEW|CAPTURE REQUIRED|CAPTURE GROUPS MISSING/);
	});
	return { result: 'pass', checks, totalFrames: narration.totalFrames, seconds: narration.totalFrames / narration.fps, qr, musicProbe,
		rings: polish.rings.map((cue) => ({ ...cue, absoluteFrame: narration.beats.find((beat) => beat.id === cue.beat).from + cue.fromFrame })) };
}
module.exports = { verify };
if (require.main === module) verify().then((result) => {
	for (const check of result.checks) console.log(`PASS ${check}`);
	if (process.argv[2] === '--output' && process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
}).catch((error) => { console.error(error.message); process.exitCode = 1; });
