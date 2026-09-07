#!/usr/bin/env node
// All negative fixtures stay in memory. Browser output is always watermarked
// INTERNAL PREVIEW. This tool never writes inventory or a final media artifact.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const net = require('node:net');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'src/remedial');
const manifest = require(path.join(source, 'captures.json'));
const timing = require(path.join(source, 'narration.json'));
const audit = require(path.join(source, 'source-audit.json'));
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const read = async (file) => new Uint8Array(fs.readFileSync(path.join(root, 'public', file)));
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, file) => {
	const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
		compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, resolveJsonModule: true },
	});
	module._compile(compiled.outputText, file);
};
const contract = require(path.join(source, 'contract.ts'));
let checks = 0;
const pass = (name, run) => { run(); checks++; console.log(`PASS ${name}`); };
const verify = (data = manifest, narration = timing, sourceAudit = audit, reader = read) => contract.verifyAssets(data, narration, sourceAudit, reader, async (bytes) => hash(bytes));

async function validate() {
	pass('isolated composition schemas and source format', () => {
		contract.assertCaptureManifest(manifest); contract.assertNarrationManifest(timing);
		assert.equal(manifest.register, 'docs/remedial-action-build-wave-1.md');
		assert.ok(fs.statSync(path.join(root, manifest.register)).isFile(), 'capture register handoff missing');
		for (const name of ['remotion', '@remotion/media', '@remotion/cli', '@remotion/renderer', '@remotion/bundler']) assert.equal(require(`${name}/package.json`).version, '4.0.484', `mixed Remotion version: ${name}`);
	});
	await verify(); checks++; console.log('PASS every PNG, provenance snapshot, storyboard, brand/font hash and exact original capture declaration');
	pass('restored storyboard is exactly the approved git blob', () => {
		const file = 'remotion-branding/docs/remedial-action-audit-trail-storyboard.md';
		const approved = execFileSync('git', ['show', `81986c80f25f59b05a8421a6811e3cd5bbfbe091:${file}`], { cwd: path.dirname(root) });
		assert.equal(hash(approved), contract.STORYBOARD_SHA256);
		assert.deepEqual(fs.readFileSync(path.join(path.dirname(root), file)), approved);
	});
	pass('source evidence is bound to inspected mobile and local backend git revisions', () => {
		assert.equal(audit.deploymentVerified, false);
		for (const file of audit.sources) {
			const raw = execFileSync('git', ['show', `${file.revision}:${file.path}`], { cwd: file.repository });
			assert.equal(hash(raw), file.sha256, file.path); assert.equal(raw.length, file.bytes);
			if (file.readFrom === 'working-tree-and-git') assert.deepEqual(fs.readFileSync(path.join(file.repository, file.path)), raw, `mobile source drift: ${file.path}`);
		}
	});
	pass('every reused source PNG remains byte-identical in the read-only Cleaning worktree', () => {
		for (const capture of manifest.captures) assert.equal(hash(fs.readFileSync(path.join(capture.origin.worktree, capture.origin.sourcePath))), capture.sha256);
	});
	pass('every frame has exactly one scene; all evidence holds have explicit timing', () => {
		const timeline = contract.buildTimeline(timing.beats);
		assert.equal(timeline.totalFrames, 8580);
		assert.equal(timeline.totalFrames, timing.beats.reduce((sum, beat) => sum + beat.durationInFrames - beat.overlapFromPrevious, 0));
		for (let frame = 0; frame < timing.totalFrames; frame++) assert.equal(timeline.entries.filter((beat) => frame >= beat.from && frame < beat.from + beat.durationInFrames).length, 1, `gap/overlap at ${frame}`);
		assert.equal(contract.buildTimeline([{ durationInFrames: 100, overlapFromPrevious: 0 }, { durationInFrames: 80, overlapFromPrevious: 12 }]).totalFrames, 168);
		for (const mutate of [
			(data) => { data.totalFrames++; },
			(data) => { data.beats[1].from++; },
			(data) => { data.beats[1].overlapFromPrevious = 12; },
			(data) => { data.beats.find((beat) => beat.id === 'inspection-capture').cues.pop(); },
			(data) => { data.beats[1].cues[0].fromFrame = 1; },
		]) { const invalid = structuredClone(timing); mutate(invalid); assert.throws(() => contract.assertNarrationManifest(invalid)); }
	});
	pass('thesis, daily band counts and independent Critical NCR branch', () => {
		assert.ok(timing.beats[1].narration.includes("Recording the failure clears today's due occurrence. It does not clear the finding."));
		const observed = (id) => manifest.captures.find((capture) => capture.id === id).observed;
		const open = observed('open-summary'), closed = observed('resolved-summary');
		for (const key of ['stillToDo', 'passed', 'couldntAccess', 'captured', 'scheduled']) assert.equal(open[key], closed[key]);
		assert.equal(open.followUpOwed - closed.followUpOwed, 1); assert.equal(closed.resolvedToday - open.resolvedToday, 1);
		assert.equal(open.passed + open.followUpOwed + open.couldntAccess, open.captured);
		assert.equal(observed('resolved-item').originalResult, 'fail');
		assert.equal(observed('resolved-item').verificationResult, 'accepted');
		assert.equal(observed('critical-ncr').ncrState, 'raised');
		const order = ['major-fields', 'major-recorded', 'open-summary', 'open-card', 'confirm-note', 'queue-empty', 'resolved-summary', 'resolved-item'].map((id) => manifest.captures.find((capture) => capture.id === id).eventOrder);
		assert.deepEqual(order, [...order].sort((a, b) => a - b));
	});
	pass('all 20 missing authentic views remain required, including selected CLEANING and all Inspection branches', () => {
		const missing = contract.getMissingEvidence(manifest);
		assert.equal(missing.length, 20);
		assert.equal(missing.filter((item) => item.startsWith('inspection-')).length, 19);
		assert.ok(missing.includes('cleaning-followup/bucket-cleaning'));
		assert.throws(() => contract.assertFinalReady(manifest, timing), (error) => /FINAL RENDER REFUSED/.test(error.message) && missing.every((item) => error.message.includes(item)) && /inventory/.test(error.message));
		// The actual wrapper and hostile props are exercised in Chrome by --smoke;
		// media Audio is ESM-only and should not be mocked in this Node contract test.
	});
	pass('slot deletion, baseline aliases, composed UI and wrong site cannot clear evidence requirements', () => {
		for (const mutate of [
			(data) => { delete data.slots['inspection-capture']; },
			(data) => { delete data.slots['inspection-accept']['closed-accepted']; },
			(data) => { data.slots['inspection-capture'].form = { captureId: 'baseline', view: 'baseline' }; },
			(data) => { data.slots['cleaning-followup']['bucket-cleaning'] = { captureId: 'open-card', view: 'queue' }; },
			(data) => { data.captures[0].uncomposed = false; },
			(data) => { data.captures[0].trail = 'inspection'; },
			(data) => { data.siteId = contract.FORBIDDEN_SITE_ID; },
			(data) => { data.captures[0].siteId = contract.FORBIDDEN_SITE_ID; },
			(data) => { data.captures[0].path = '../fake.png'; },
			(data) => { data.provenance[0].sha256 = '0'.repeat(64); },
			(data) => { data.captures.find((capture) => capture.id === 'open-card').disclosure = 'Real inspection'; },
			(data) => { data.brandAssets.pop(); },
		]) { const invalid = structuredClone(manifest); mutate(invalid); assert.throws(() => contract.assertCaptureManifest(invalid)); }
	});
	for (const mutate of [
		(data) => { data.captures[0].account = 'invented@example.com'; },
		(data) => { data.captures.find((item) => item.id === 'resolved-item').observed.originalResult = 'pass'; },
		(data) => { data.captures.find((item) => item.id === 'open-card').eventOrder = 99; },
	]) { const invalid = structuredClone(manifest); mutate(invalid); await assert.rejects(verify(invalid), /source provenance differs/); }
	checks++; console.log('PASS attribution, observed state and chronology must match the pinned register declaration');
	for (const [id, sentence] of [
		['two-outcomes', 'The failed check remains still to do.'],
		['bill-components', 'Seven Cleaning findings are open.'],
		['inspection-carryover', 'The next day automatically clears Inspection findings.'],
		['inspection-age', 'After seven days the SLA automatically escalates the finding.'],
		['inspection-review', 'Assign an owner, due date, review date and frequency.'],
		['inspection-reject', 'Reject closes the finding.'],
		['critical-handoff', 'Every failure raises an NCR.'],
	]) { const invalid = structuredClone(timing); invalid.beats.find((beat) => beat.id === id).narration = sentence; await assert.rejects(verify(manifest, invalid), /product copy changed/); }
	const fakeAudit = structuredClone(audit); fakeAudit.claims['no-assignment'].statement = 'Inspection findings have an owner.';
	await assert.rejects(verify(manifest, timing, fakeAudit), /source audit changed/);
	checks++; console.log('PASS product-claim regressions and source-audit tampering fail closed');
	pass('planned timing cannot masquerade as recorded or measured narration', () => {
		for (const [key, value] of Object.entries({ audioStatus: 'approved-recording', timingStatus: 'measured-transcript', wordTimingVerified: true, narrationApprovalRef: 'approved', audio: { path: 'fake.wav' } })) {
			const invalid = structuredClone(timing); invalid[key] = value;
			assert.throws(() => contract.assertNarrationManifest(invalid), /silent with provisional timing/);
		}
	});
	pass('altered source bytes and invalid crops/dimensions fail closed', () => {
		const capture = manifest.captures[0], raw = fs.readFileSync(path.join(root, 'public', capture.path));
		const altered = Buffer.from(raw); altered[altered.length - 1] ^= 1;
		assert.throws(() => contract.assertFileBytes(capture, altered, hash(altered)), /SHA-256/);
		assert.throws(() => contract.assertPng({ ...capture, width: 721 }, raw), /dimensions/);
		assert.throws(() => contract.assertRect({ x: 0.9, y: 0, w: 0.2, h: 1 }), /crop/);
	});
	await assert.rejects(verify(manifest, timing, audit, async () => { throw new Error('ENOENT authentic evidence missing'); }), /ENOENT/);
	checks++; console.log('PASS declared but absent files refuse rendering');
	pass('frame-driven rendering, premounts, media Audio, staticFile and isolated registration', () => {
		const code = fs.readFileSync(path.join(source, 'RemedialActionTutorial.tsx'), 'utf8');
		assert.doesNotMatch(code, /<img\b|<audio\b|\banimation\s*:|\btransition\s*:|Math\.random|Date\.now|setInterval|setTimeout/);
		assert.match(code, /import \{ Audio \} from '@remotion\/media'/);
		assert.match(code, /<Img src=\{staticFile\(capture.path\)\}/);
		assert.equal((code.match(/<Sequence\b/g) ?? []).length, (code.match(/premountFor=\{FPS\}/g) ?? []).length);
		assert.ok(code.includes('data-remedial-blocker')); assert.ok(code.includes('data-remedial-preview-label'));
		assert.doesNotMatch(fs.readFileSync(path.join(root, 'src/index-remedial.ts'), 'utf8'), /import.*['"]\.\/Root['"]/);
		const registration = fs.readFileSync(path.join(source, 'RootRemedial.tsx'), 'utf8');
		assert.equal((registration.match(/<Composition\b/g) ?? []).length, 2);
		assert.match(registration, /if \(isRendering\) assertFinalReady/);
	});
	console.log(`Validated ${checks} groups: ${timing.beats.length} beats, ${timing.totalFrames} frames / ${timing.totalFrames / 30}s; 12 genuine PNGs, 20 authentic views pending. Final and inventory remain blocked.`);
}

async function freePort() {
	for (let port = 3215; port <= 3220; port++) {
		const free = await new Promise((resolve) => {
			const server = net.createServer(); server.once('error', () => resolve(false));
			server.listen(port, '127.0.0.1', () => server.close(() => resolve(true)));
		});
		if (free) return port;
	}
	throw new Error('No free Remotion port in 3215–3220; existing services were left alone.');
}

async function smoke() {
	const { bundle } = require('@remotion/bundler');
	const { openBrowser, selectComposition, renderStill, renderMedia } = require('@remotion/renderer');
	const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-remedial-'));
	const outputRoot = path.join(root, 'out'); fs.mkdirSync(outputRoot, { recursive: true });
	const output = fs.mkdtempSync(path.join(outputRoot, 'verify-remedial-INTERNAL-PREVIEW-'));
	// Bundle only exact referenced assets; never copy the entire shared public tree.
	for (const file of contract.publicFiles(manifest)) {
		const dest = path.join(scratch, 'public', file.path); fs.mkdirSync(path.dirname(dest), { recursive: true });
		fs.copyFileSync(path.join(root, 'public', file.path), dest);
	}
	const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index-remedial.ts'), publicDir: path.join(scratch, 'public'), outDir: path.join(scratch, 'bundle') });
	const browser = await openBrowser('chrome');
	const options = async () => ({ serveUrl, puppeteerInstance: browser, port: await freePort(), logLevel: 'error' });
	try {
		const composition = await selectComposition({ ...await options(), id: contract.PREVIEW_ID });
		assert.equal(composition.durationInFrames, 8580); assert.equal(composition.fps, 30);
		await assert.rejects(selectComposition({ ...await options(), id: contract.FINAL_ID, inputProps: { preview: true, allowMissing: true } }), /FINAL RENDER REFUSED/);
		// Deliberately bypass metadata, seek to the last frame, and ask for no file.
		await assert.rejects(renderStill({ ...await options(), composition: { ...composition, id: contract.FINAL_ID }, inputProps: { preview: true, allowMissing: true }, frame: timing.totalFrames - 1, output: null }), /FINAL RENDER REFUSED/);
		console.log('PASS browser final refusal at metadata AND direct late-frame component boundary');
		const frames = new Set([0, timing.totalFrames - 1]);
		for (const beat of timing.beats) {
			frames.add(beat.from + Math.min(beat.durationInFrames - 1, 120));
			for (const [i, cue] of beat.cues.entries()) frames.add(beat.from + Math.floor((cue.fromFrame + (beat.cues[i + 1]?.fromFrame ?? beat.durationInFrames)) / 2));
		}
		const stills = [];
		// Reverse order and replay exercise seek-safe rendering from a cold mount.
		for (const frame of [...frames].sort((a, b) => b - a)) {
			const file = path.join(output, `verify-frame-${String(frame).padStart(5, '0')}-INTERNAL-PREVIEW.png`);
			await renderStill({ ...await options(), composition, frame, output: file, imageFormat: 'png', overwrite: false });
			stills.push({ frame, path: file, sha256: hash(fs.readFileSync(file)) });
			console.log(`PASS INTERNAL PREVIEW still ${frame}`);
		}
		for (const beatId of ['two-outcomes', 'confirm', 'inspection-capture', 'inspection-age']) {
			const beat = timing.beats.find((item) => item.id === beatId);
			const first = stills.find((item) => item.frame === beat.from + 120);
			const repeat = await renderStill({ ...await options(), composition, frame: first.frame, output: null, imageFormat: 'png' });
			assert.equal(hash(repeat.buffer), first.sha256, `non-deterministic seek: ${beatId}`);
		}
		console.log('PASS repeat seeks: genuine UI, confirmation, blocker and explanatory age graphic');
		const video = path.join(output, 'verify-remedial-excerpt-INTERNAL-PREVIEW.mp4');
		const start = timing.beats[1].from;
		await renderMedia({ ...await options(), composition, outputLocation: video, frameRange: [start, start + 179], codec: 'h264', crf: 18, pixelFormat: 'yuv420p', imageFormat: 'png', concurrency: 2, muted: true, enforceAudioTrack: false, overwrite: false });
		const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height,r_frame_rate,nb_frames', '-of', 'json', video], { encoding: 'utf8' }));
		assert.equal(probe.streams.length, 1); assert.equal(probe.streams[0].codec_type, 'video');
		assert.equal(Number(probe.streams[0].nb_frames), 180); assert.equal(Number(probe.format.duration), 6);
		assert.equal(probe.streams[0].width, 1920); assert.equal(probe.streams[0].height, 1080); assert.equal(probe.streams[0].r_frame_rate, '30/1');
		const results = { composition: composition.id, timelineFrames: timing.totalFrames, timelineSeconds: timing.totalFrames / 30, missing: contract.getMissingEvidence(manifest), stills, video: { path: video, sha256: hash(fs.readFileSync(video)), frames: 180, seconds: 6, audioStreams: 0, classification: 'INTERNAL PREVIEW excerpt only' }, finalMetadataRefused: true, finalDirectRenderRefused: true, seekReplayPassed: true, scratch };
		fs.writeFileSync(path.join(output, 'verify-remedial-results.json'), JSON.stringify(results, null, 2) + '\n', { flag: 'wx' });
		console.log(JSON.stringify(results.video, null, 2));
		console.log(`Proof artifacts: ${output}`);
	} finally { await browser.close({ silent: true }); }
}

(async () => {
	const args = process.argv.slice(2);
	assert.ok(args.length <= 1 && args.every((arg) => ['--final', '--inventory', '--smoke'].includes(arg)), 'Use no argument, --final/--inventory (preflight only), or --smoke (INTERNAL PREVIEW only).');
	await validate();
	if (args.includes('--final') || args.includes('--inventory')) contract.assertFinalReady(manifest, timing);
	if (args.includes('--smoke')) await smoke();
})().catch((error) => { console.error(error.stack ?? error); process.exitCode = 1; });
