#!/usr/bin/env node
/* Metadata-only negative fixtures never become images or operational app UI.
 * All browser proofs and video output use the checked-in genuine manifest. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const net = require('node:net');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'src/cln');
const manifest = require(path.join(source, 'captures-v4.json'));
const timing = require(path.join(source, 'narration-v4.json'));
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const clone = (value) => structuredClone(value);

// In-memory compilation uses the package's existing TypeScript dependency and
// writes no generated source. The same contract is exercised by Node and Chrome.
for (const extension of ['.ts', '.tsx']) {
	require.extensions[extension] = (module, filename) => {
		const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
			compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, resolveJsonModule: true },
		});
		// @remotion/media exports only ESM. Node 22 can load its real published
		// module by path without changing conditions for Remotion's bundler.
		const requireFrom = module.require.bind(module);
		module.require = (id) => requireFrom(id === '@remotion/media' ? path.join(path.dirname(require.resolve('@remotion/media/package.json')), require('@remotion/media/package.json').module) : id);
		module._compile(compiled.outputText, filename);
	};
}
const contract = require(path.join(source, 'v4-contract.ts'));
const component = require(path.join(source, 'CleaningVerificationTutorialV4.tsx'));
let checks = 0;
const pass = (name, fn) => { fn(); checks++; console.log(`PASS ${name}`); };
const slot = (data, id) => data.slots.find((item) => item.id === id);
const read = async (file) => new Uint8Array(fs.readFileSync(path.join(root, 'public', file)));
const coverage = () => {
	const missing = contract.getMissingCaptures(manifest);
	const requiredViews = Object.values(contract.CAPTURE_REQUIREMENTS).reduce((sum, views) => sum + views.length, 0);
	return { requiredViews, coveredViews: requiredViews - missing.reduce((sum, group) => sum + group.proofs.length, 0), missingGroups: missing.length,
		operationalGroups: 9, newlySuppliedViews: 26, registeredPngs: manifest.slots.reduce((sum, item) => sum + item.captures.length, 0),
		mapping: manifest.slots.flatMap((item) => item.captures.map((capture) => ({ slot: item.id, path: capture.path, views: Object.keys(capture.views), sha256: capture.sha256 }))) };
};

// Clone the complete genuine capture set and use metadata-only audio approval
// fixtures to test each gate. No fixture is written to public/ or rendered.
const completeDeclarations = () => {
	const data = clone(manifest);
	const voice = clone(timing);
	voice.audioStatus = 'approved-recording'; voice.timingStatus = 'measured-transcript'; voice.wordTimingVerified = true;
	voice.narrationApprovalRef = 'verify-in-memory-fixture';
	voice.audio = { path: 'cln-tutorial/v4-verify-fixture/narration.wav', sha256: hash('metadata-only-audio'), bytes: 1, durationInFrames: timing.totalFrames, transcriptRef: 'verify-in-memory-fixture', transcript: { path: 'cln-tutorial/v4-verify-fixture/measured.json', sha256: hash('metadata-only-transcript'), bytes: 1 } };
	return { data, voice };
};

async function validate() {
	pass('capture and narration schemas', () => { contract.assertCaptureManifest(manifest); contract.assertNarrationManifest(timing); });
	await contract.verifyAssetFiles(manifest, timing, read, async (bytes) => hash(bytes));
	checks++; console.log('PASS every declared genuine file: existence, SHA-256, bytes, PNG header and dimensions');
	pass('every declared capture identity matches the independent capture register', () => {
		const register = fs.readFileSync(path.join(root, manifest.register), 'utf8');
		for (const capture of manifest.slots.flatMap((item) => item.captures)) {
			const row = register.split('\n').find((line) => line.includes(path.basename(capture.path)) && line.includes(capture.sha256));
			assert.ok(row, capture.path); assert.ok(row.includes(capture.bytes.toLocaleString('en-US')), capture.path);
		}
	});
	pass('all 19 registered operational PNGs map exactly to 26 newly supplied views and the supplemental closure result', () => {
		const register = fs.readFileSync(path.join(root, manifest.register), 'utf8');
		const captures = manifest.slots.flatMap((item) => item.captures.map((capture) => ({ slot: item.id, ...capture })));
		let files = 0; let views = 0;
		for (const row of register.split('\n').filter((line) => /^\| `(?:0[89]|1\d|2[0-6])-.*\.png` \|/.test(line))) {
			const columns = row.split('|');
			const filename = columns[1].match(/`([^`]+)`/)[1];
			const keys = [...columns[3].matchAll(/`([^`]+)`/g)].map((match) => match[1]);
			const capture = captures.find((item) => path.basename(item.path) === filename);
			assert.ok(capture, filename); assert.equal(capture.slot, keys[0]);
			const expected = keys.slice(1);
			assert.deepEqual(Object.keys(capture.views).sort(), (filename.startsWith('24-') ? ['closed-result'] : expected).sort(), filename);
			assert.ok(capture.evidenceNote, filename);
			files++; views += expected.length;
		}
		assert.equal(files, 19); assert.equal(views, 26);
		assert.equal(captures.length, 26); assert.deepEqual(contract.getMissingCaptures(manifest), []);
		for (const capture of captures) for (const proof of Object.keys(capture.views)) assert.ok(timing.beats.some((beat) => beat.slot === capture.slot && beat.proofs.includes(proof)), `PNG/view never shown: ${capture.path}/${proof}`);
	});
	pass('approved inline pass, 15 Daily bulk checks, raised NCR and unchanged closure totals', () => {
		const observed = (data, id, proof) => slot(data, id).captures.find((capture) => Object.hasOwn(capture.views, proof)).observed;
		assert.deepEqual(observed(manifest, 'single-pass', 'confirmation'), { completed: 1, scheduled: 19, passSave: 'inline', confirmationDialog: false });
		assert.equal(observed(manifest, 'frequency-pass-all', 'eligible').eligibleRemaining, 18);
		assert.deepEqual(observed(manifest, 'frequency-pass-all', 'confirmation'), { completed: 4, bulkCount: 15, scheduled: 19, frequency: 'daily', excludedOutcomes: ['individual-pass', 'major-fail', 'critical-fail', 'unavailable'] });
		assert.equal(observed(manifest, 'critical-ncr', 'ncr-queued').acknowledgement, 'An NCR has been raised for this critical finding.');
		assert.equal(observed(manifest, 'critical-ncr', 'ncr-queued').linkedNcrId, 'rx7dgxae4cnc7rm2k7pqdvf30x8dw98r');
		assert.deepEqual(observed(manifest, 'four-band-open', 'still-to-do'), { stillToDo: 216, passed: 16, followUpOwed: 2, couldntAccess: 1, resolvedToday: 0, captured: 19, scheduled: 235 });
		assert.deepEqual(observed(manifest, 'five-band-resolved', 'still-to-do'), { stillToDo: 216, passed: 16, followUpOwed: 1, couldntAccess: 1, resolvedToday: 1, captured: 19, scheduled: 235 });
		for (const [id, proof, key, value, pattern] of [
			['single-pass', 'confirmation', 'confirmationDialog', true, /inline/],
			['frequency-pass-all', 'confirmation', 'bulkCount', 18, /bulk count/],
			['five-band-resolved', 'still-to-do', 'captured', 20, /unchanged/],
			['five-band-resolved', 'still-to-do', 'resolvedToday', 2, /moves one/],
		]) {
			const invalid = clone(manifest); observed(invalid, id, proof)[key] = value;
			assert.throws(() => contract.assertCaptureManifest(invalid), pattern);
		}
	});
	pass('duration math and every-frame coverage', () => {
		assert.equal(component.CLN_V4_FRAMES, timing.totalFrames);
		const timeline = contract.buildTimeline(timing.beats);
		assert.equal(timeline.totalFrames, timing.beats.reduce((sum, beat) => sum + beat.durationInFrames - beat.overlapFromPrevious, 0));
		for (let frame = 0; frame < timing.totalFrames; frame++) assert.equal(timeline.entries.filter((beat) => frame >= beat.from && frame < beat.from + beat.durationInFrames).length, 1, `gap/overlap at frame ${frame}`);
		assert.equal(contract.buildTimeline([{ durationInFrames: 100, overlapFromPrevious: 0 }, { durationInFrames: 80, overlapFromPrevious: 12 }]).totalFrames, 168);
		assert.throws(() => contract.buildTimeline([{ durationInFrames: 100, overlapFromPrevious: 1 }]), /overlap/);
		const invalid = clone(timing); invalid.totalFrames++; assert.throws(() => contract.assertNarrationManifest(invalid), /duration/);
		const missingBeat = clone(timing); missingBeat.beats.find((beat) => beat.id === 'bulk-eligible').proofs = []; assert.throws(() => contract.assertNarrationManifest(missingBeat), /evidence/);
	});
	const missing = contract.getMissingCaptures(manifest);
	if (missing.length) pass('current final refusal lists every outstanding capture group', () => {
		assert.throws(() => contract.assertFinalReady(manifest, timing), (error) => /FINAL RENDER REFUSED/.test(error.message) && missing.every((item) => error.message.includes(item.title)));
		assert.throws(() => component.CleaningVerificationTutorialV4({ preview: true, allowMissing: true }), /FINAL RENDER REFUSED/);
	});
	pass('completed declarations still need approved measured narration', () => {
		const { data, voice } = completeDeclarations();
		contract.assertFinalReady(data, voice);
		for (const [field, value] of Object.entries({ audioStatus: 'generated-unapproved', timingStatus: 'planned-not-recorded', wordTimingVerified: false, narrationApprovalRef: null })) {
			const unapproved = clone(voice); unapproved[field] = value;
			assert.throws(() => contract.assertFinalReady(data, unapproved), /narration/);
		}
		const noTranscript = clone(voice); delete noTranscript.audio.transcript;
		assert.throws(() => contract.assertFinalReady(data, noTranscript), /narration/);
		if (!timing.narrationApprovalRef) assert.throws(() => component.CleaningVerificationTutorialV4({ preview: true, allowMissing: true }), /FINAL RENDER REFUSED/);
	});
	pass('measured narration binds script, words and cues to exact audio; partial generation is not approval', () => {
		const prep = require('./prepare-cln-v4-audio.cjs');
		const words = [{ word: 'Confirm', start: 0.2, end: 0.6 }, { word: 'Followed', start: 0.6, end: 1 }, { word: 'Up.', start: 1, end: 1.2 }];
		assert.equal(prep.cueTime(words, 'Followed Up'), 0.6);
		assert.equal(contract.measuredCueTime(words, 'Followed Up'), 0.6);
		assert.throws(() => contract.measuredCueTime(words, 'invented dialog'), /no cue/);
		const { voice } = completeDeclarations();
		assert.throws(() => contract.assertMeasuredNarration(voice, { schemaVersion: 1, provider: 'openai-whisper-1', fps: 30, totalFrames: voice.totalFrames, masterSha256: 'wrong-audio', clips: [] }), /exact mastered audio/);
		assert.throws(() => contract.assertMeasuredNarration(voice, { schemaVersion: 1, provider: 'openai-whisper-1', fps: 30, totalFrames: voice.totalFrames, masterSha256: voice.audio.sha256, clips: [] }), /every spoken beat/);
		const provenance = JSON.parse(fs.readFileSync(path.join(source, 'audio-v4.json'), 'utf8'));
		const series = JSON.parse(fs.readFileSync(path.join(source, 'narration.json'), 'utf8'));
		assert.equal(provenance.voiceId, series.voiceId); assert.deepEqual(provenance.voiceSettings, series.voiceSettings);
		for (const clip of provenance.generatedClips) {
			for (const file of [clip.audio, clip.receipt]) {
				const bytes = fs.readFileSync(path.join(root, 'public', file.path)); contract.assertFileBytes(file, bytes, hash(bytes));
			}
			const receipt = JSON.parse(fs.readFileSync(path.join(root, 'public', clip.receipt.path), 'utf8'));
			assert.equal(receipt.request.text, timing.beats.find((beat) => beat.id === clip.id).narration);
			assert.equal(receipt.voiceId, series.voiceId);
		}
		if (provenance.status === 'blocked') { assert.equal(timing.audio, null); assert.equal(timing.wordTimingVerified, false); }
		if (provenance.status === 'approved-recording') {
			assert.equal(timing.audioStatus, 'approved-recording');
			assert.equal(provenance.approvalRecord.path, timing.narrationApprovalRef);
			assert.match(provenance.approvalRecord.path, /^docs\/verify-cln-v4-audio-[a-z-]+\.json$/);
			const bytes = fs.readFileSync(path.join(root, provenance.approvalRecord.path));
			contract.assertFileBytes(provenance.approvalRecord, bytes, hash(bytes));
			const approval = JSON.parse(bytes.toString('utf8'));
			assert.equal(approval.result, 'pass'); assert.ok(approval.acceptance?.authorization);
			assert.equal(approval.spokenBeats, timing.beats.filter((beat) => beat.narration).length);
			assert.deepEqual(approval.master, timing.audio);
		}
	});
	pass('local fallback is limited to credit exhaustion and transcription must match the full script', () => {
		const prep = require('./prepare-cln-v4-audio.cjs');
		assert.equal(prep.isCreditExhaustion({ httpStatus: 429, providerCode: 'credit_balance_exhausted' }), true);
		for (const error of [{ httpStatus: 429, providerCode: 'rate_limit_exceeded' }, { httpStatus: 401, providerCode: 'credit_balance_exhausted' }, new Error('network failure')]) assert.equal(prep.isCreditExhaustion(error), false);
		const words = (text) => text.split(' ').map((word, i) => ({ word, start: i, end: i + 1 }));
		contract.assertTranscriptText('Two hundred and thirty-five checks.', words('235 checks'), 'orthography');
		contract.assertTranscriptText("Here's the Couldn't access outcome.", words('Here is the could not access outcome'), 'contractions');
		assert.throws(() => contract.assertTranscriptText('Fifteen remaining checks', words('Fifty remaining checks'), 'wrong-count'), /transcribed text differs/);
		assert.throws(() => contract.assertTranscriptText('No real defect', words('Real defect'), 'omitted-negation'), /transcribed text differs/);
		assert.throws(() => contract.assertTranscriptText('A Critical finding', words('A Major finding'), 'wrong-grade'), /transcribed text differs/);
		if (timing.audio?.transcript) {
			const measured = JSON.parse(fs.readFileSync(path.join(root, 'public', timing.audio.transcript.path), 'utf8'));
			contract.assertMeasuredNarration(timing, measured);
			for (const mutate of [
				(data) => { data.provider = 'unmeasured-local'; },
				(data) => { data.clips[0].words[0].word = 'Fabricated'; },
				(data) => { data.clips[0].words[0].end = data.clips[0].words[0].start; },
				(data) => { data.clips[0].words[0].start = -1; },
				(data) => { data.clips[0].words[1].start = data.clips[0].words[0].start; },
			]) {
				const invalid = clone(measured); mutate(invalid);
				assert.throws(() => contract.assertMeasuredNarration(timing, invalid), /exact mastered audio|transcribed text differs|invalid measured word interval/);
			}
		}
	});
	for (const id of Object.keys(contract.CAPTURE_REQUIREMENTS).filter((key) => !contract.BASELINE_HASHES[key])) {
		pass(`final independently refuses missing ${id}`, () => {
			const { data, voice } = completeDeclarations(); slot(data, id).captures = [];
			assert.throws(() => contract.assertFinalReady(data, voice), /FINAL RENDER REFUSED/);
		});
	}
	pass('manifest cannot hide missing slots or accept composed/legacy UI', () => {
		const removed = clone(manifest); removed.slots = removed.slots.filter((item) => item.id !== 'critical-ncr'); assert.throws(() => contract.assertCaptureManifest(removed), /slot/);
		const composed = clone(manifest); composed.slots[0].captures[0].uncomposed = false; assert.throws(() => contract.assertCaptureManifest(composed), /composed/);
		const legacy = clone(manifest); legacy.slots[0].captures[0].path = 'cln-tutorial/shots/shot-17-all-clear.png'; assert.throws(() => contract.assertCaptureManifest(legacy), /legacy/);
		const noReview = clone(manifest); noReview.slots[0].captures[0].reviewRef = ''; assert.throws(() => contract.assertCaptureManifest(noReview), /reviewRef/);
		const { data } = completeDeclarations(); slot(data, 'single-pass').captures[0].sha256 = contract.BASELINE_HASHES.home; assert.throws(() => contract.assertCaptureManifest(data), /baseline is not operational proof/);
	});
	pass('physical QR, frequency scope, capture chronology and truthful disclosures', () => {
		let { data } = completeDeclarations(); slot(data, 'qr-check-in').captures[0].captureMethod = 'disclosed-test-harness'; assert.throws(() => contract.assertCaptureManifest(data), /real QR/);
		({ data } = completeDeclarations()); slot(data, 'frequency-pass-all').captures[0].inspectionFrequency = 'weekly'; assert.throws(() => contract.assertCaptureManifest(data), /SAME frequency/);
		({ data } = completeDeclarations()); slot(data, 'follow-ups-close').captures[0].eventOrder = 1; assert.throws(() => contract.assertCaptureManifest(data), /chronology/);
		({ data } = completeDeclarations()); slot(data, 'major-fail').captures[0].disclosure = 'Current app'; assert.throws(() => contract.assertCaptureManifest(data), /seeded-record disclosure/);
	});
	pass('invalid crop, altered bytes, and wrong PNG dimensions fail closed', () => {
		const invalid = clone(manifest); invalid.slots[0].captures[0].views.entry.x = 1; assert.throws(() => contract.assertCaptureManifest(invalid), /crop/);
		const capture = manifest.slots[0].captures[0]; const bytes = fs.readFileSync(path.join(root, 'public', capture.path));
		const altered = Buffer.from(bytes); altered[altered.length - 1] ^= 1; assert.throws(() => contract.assertFileBytes(capture, altered, hash(altered)), /SHA-256/);
		assert.throws(() => contract.assertPngBytes({ ...capture, width: 721 }, bytes), /dimensions/);
	});
	await assert.rejects(contract.verifyAssetFiles(manifest, timing, async () => { throw new Error('ENOENT genuine capture missing'); }, async (bytes) => hash(bytes)), /ENOENT/);
	checks++; console.log('PASS declared-but-absent files abort preview and final verification');
	pass('V4 rendering contract and stale-copy exclusions', () => {
		const code = fs.readFileSync(path.join(source, 'CleaningVerificationTutorialV4.tsx'), 'utf8');
		assert.doesNotMatch(code, /<img\b|backgroundImage\s*:|\btransition\s*:|\banimation\s*:|Math\.random|Date\.now|setInterval|setTimeout/);
		assert.doesNotMatch(code, /from ['"].*CleaningVerification(?:Branded|TutorialV2)|timing-v3|\/shots\//);
		const prose = timing.beats.map((beat) => [beat.narration, beat.headline, beat.body, beat.emphasis].join(' ')).join('\n');
		assert.doesNotMatch(prose, /\bowner\b|\bassignee\b|all clear|no owner|nine checks, one tap/i);
		assert.match(fs.readFileSync(path.join(root, 'src/Root.tsx'), 'utf8'), /<RootClnV4\s*\/>/);
	});
	const polish = await require('./verify-cln-v4-polish.cjs').verify();
	for (const name of polish.checks) { checks++; console.log(`PASS ${name}`); }
	console.log(`Validated ${checks} checks. ${timing.totalFrames} frames / ${timing.totalFrames / timing.fps}s. ${missing.length} missing capture groups.`);
	console.log(`Coverage: ${coverage().coveredViews}/${coverage().requiredViews} required views; 26/26 newly required views; 19/19 new PNGs; capture 24 shown as supplemental closed result.`);
	return missing;
}

async function browserProofs(renderPreview) {
	const { bundle } = require('@remotion/bundler');
	const { openBrowser, selectComposition, renderStill, renderMedia } = require('@remotion/renderer');
	const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-cln-v4-'));
	const proofDir = fs.mkdtempSync(path.join(root, 'out', 'verify-cln-v4-INTERNAL-PREVIEW-'));
	const publicDir = path.join(scratch, 'public');
	const publicFiles = [...manifest.slots.flatMap((item) => item.captures.map((capture) => capture.path)), 'images/ewizer-logo.png', 'images/ecowize-logo.webp'];
	const polish = require(path.join(source, 'polish-v4.json'));
	publicFiles.push(polish.qr.path, polish.music.path);
	if (timing.audio) publicFiles.push(timing.audio.path);
	if (timing.audio?.transcript) {
		publicFiles.push(timing.audio.transcript.path);
		const measured = JSON.parse(fs.readFileSync(path.join(root, 'public', timing.audio.transcript.path), 'utf8'));
		for (const clip of measured.clips) publicFiles.push(clip.audio.path, clip.receipt.path, clip.transcript.path);
	}
	for (const file of publicFiles) {
		const dest = path.join(publicDir, file); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(path.join(root, 'public', file), dest);
	}
	console.log('Bundle isolated V4 entry with byte-identical copies of only its referenced public assets.');
	const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index-cln-v4.ts'), publicDir, outDir: path.join(scratch, 'bundle') });
	const browser = await openBrowser('chrome');
	const options = { serveUrl, puppeteerInstance: browser, logLevel: 'error' };
	// Expected render refusals can close their HTTP listener asynchronously.
	// Pick an available permitted port per operation; never touch port 3210.
	const safeOptions = async () => {
		for (let port = 3215; port <= 3220; port++) {
			const free = await new Promise((resolve) => {
				const server = net.createServer();
				server.once('error', () => resolve(false));
				server.listen(port, () => server.close(() => resolve(true)));
			});
			if (free) return { ...options, port };
		}
		throw new Error('No free Remotion port in 3215–3220; existing services were left alone.');
	};
	try {
		const composition = await selectComposition({ ...await safeOptions(), id: component.CLN_V4_PREVIEW_ID });
		assert.equal(composition.durationInFrames, timing.totalFrames);
		assert.equal(composition.fps, 30); assert.equal(composition.width, 1920); assert.equal(composition.height, 1080);
		let finalBlocked = false;
		try { contract.assertFinalReady(manifest, timing); } catch { finalBlocked = true; }
		if (finalBlocked) {
			await assert.rejects(selectComposition({ ...await safeOptions(), id: component.CLN_V4_ID, inputProps: { preview: true, allowMissing: true } }), /FINAL RENDER REFUSED/);
			// Bypass metadata deliberately: the component itself must reject even a
			// late-frame direct renderer request. No output file is requested.
			await assert.rejects(renderStill({ ...await safeOptions(), composition: { ...composition, id: component.CLN_V4_ID }, frame: timing.totalFrames - 1, output: null }), /FINAL RENDER REFUSED/);
			console.log('PASS browser final refusal at metadata AND late-frame component boundary; no final artifact written');
		}
		const frames = new Set([0, timing.totalFrames - 1]);
		for (const beat of timing.beats) {
			frames.add(beat.from + Math.min(beat.durationInFrames - 1, 75));
			if (beat.proofs.length > 1) for (let i = 0; i < beat.proofs.length; i++) frames.add(beat.from + Math.floor((beat.proofFromFrames[i] + (beat.proofFromFrames[i + 1] ?? beat.durationInFrames)) / 2));
		}
		for (const beat of timing.beats) for (let i = 0; i < beat.proofs.length; i++) assert.ok([...frames].some((frame) => frame >= beat.from + beat.proofFromFrames[i] && frame < beat.from + (beat.proofFromFrames[i + 1] ?? beat.durationInFrames)), `smoke omitted ${beat.id}/${beat.proofs[i]}`);
		// Reverse order exercises direct seeks; no prior frame can supply state.
		const results = [];
		for (const frame of [...frames].sort((a, b) => b - a)) {
			const output = path.join(proofDir, `verify-frame-${String(frame).padStart(5, '0')}-INTERNAL-PREVIEW.png`);
			await renderStill({ ...await safeOptions(), composition, frame, output, imageFormat: 'png' });
			results.push({ frame, path: output, sha256: hash(fs.readFileSync(output)) });
			console.log(`PASS preview still ${frame}`);
		}
		const repeated = results[Math.floor(results.length / 2)];
		const replay = await renderStill({ ...await safeOptions(), composition, frame: repeated.frame, output: null, imageFormat: 'png' });
		assert.equal(hash(replay.buffer), repeated.sha256, 'arbitrary seek must produce identical pixels');
		console.log(`PASS deterministic seek replay at frame ${repeated.frame}`);
		const audioOptions = { muted: timing.audio === null, enforceAudioTrack: false };
		if (!timing.audio) {
			const outputLocation = path.join(proofDir, 'verify-muted-render-INTERNAL-PREVIEW.mp4');
			await renderMedia({ ...await safeOptions(), ...audioOptions, composition, outputLocation, frameRange: [0, 29], codec: 'h264', crf: 18, pixelFormat: 'yuv420p', imageFormat: 'png', concurrency: 2 });
			const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,nb_frames', '-of', 'json', outputLocation], { encoding: 'utf8' }));
			assert.equal(probe.streams.length, 1); assert.equal(probe.streams[0].codec_type, 'video');
			assert.equal(Number(probe.streams[0].nb_frames), 30); assert.equal(Number(probe.format.duration), 1);
			console.log('PASS explicit silence: 30 frames, exactly one second, no audio stream');
		}
		let video = null;
		if (renderPreview) {
			const outputLocation = path.join(proofDir, 'cln-verification-v4-INTERNAL-PREVIEW.mp4');
			let lastPercent = -10;
			await renderMedia({ ...await safeOptions(), ...audioOptions, composition, outputLocation, codec: 'h264', crf: 18, pixelFormat: 'yuv420p', imageFormat: 'png', concurrency: 2, onProgress: ({ progress }) => {
				const percent = Math.floor(progress * 100); if (percent >= lastPercent + 10) { console.log(`INTERNAL PREVIEW ${percent}%`); lastPercent = percent; }
			} });
			const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height,r_frame_rate,nb_frames', '-of', 'json', outputLocation], { encoding: 'utf8' }));
			const stream = probe.streams.find((item) => item.codec_type === 'video');
			assert.equal(Number(stream.nb_frames), timing.totalFrames); assert.equal(stream.width, 1920); assert.equal(stream.height, 1080); assert.equal(stream.r_frame_rate, '30/1');
			assert.equal(Number(probe.format.duration), timing.totalFrames / 30);
			if (!timing.audio) assert.equal(probe.streams.filter((item) => item.codec_type === 'audio').length, 0);
			video = { path: outputLocation, duration: probe.format.duration, frames: stream.nb_frames, sha256: hash(fs.readFileSync(outputLocation)), audio: timing.audio ? 'non-final preview' : 'silent; no audio stream' };
			console.log(JSON.stringify(video, null, 2));
		}
		fs.writeFileSync(path.join(proofDir, 'verify-cln-v4-results.json'), JSON.stringify({ composition: composition.id, totalFrames: timing.totalFrames, durationSeconds: timing.totalFrames / 30, coverage: coverage(), missing: contract.getMissingCaptures(manifest), stills: results, video, scratch }, null, 2) + '\n');
		console.log(`Proof artifacts: ${proofDir}`);
	} finally { await browser.close({ silent: true }); }
}

(async () => {
	const args = process.argv.slice(2);
	assert.ok(args.length <= 1 && args.every((arg) => ['--final', '--smoke', '--render-preview'].includes(arg)), 'Use no argument, --final (preflight only), --smoke, or --render-preview');
	await validate();
	if (args.includes('--final')) {
		contract.assertFinalReady(manifest, timing);
		if (timing.audio) {
			const seconds = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', path.join(root, 'public', timing.audio.path)], { encoding: 'utf8' }));
			assert.equal(Math.round(seconds * timing.fps), timing.totalFrames, 'measured narration duration must match the frame manifest');
		}
		console.log('Final preflight passed; this command never renders.');
	}
	if (args.includes('--smoke') || args.includes('--render-preview')) {
		fs.mkdirSync(path.join(root, 'out'), { recursive: true });
		await browserProofs(args.includes('--render-preview'));
	}
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
