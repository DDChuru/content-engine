#!/usr/bin/env node
// V4 adaptation of packages/backend/scripts/generate-cln-tutorial-audio.ts.
// Same series voice/model/settings; new clips only. Never approves or renders.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const os = require('node:os');
const { Module } = require('node:module');
const root = path.resolve(__dirname, '..');
const timingPath = path.join(root, 'src/cln/narration-v4.json');
const provenancePath = path.join(root, 'src/cln/audio-v4.json');
const timing = JSON.parse(fs.readFileSync(timingPath, 'utf8'));
const series = JSON.parse(fs.readFileSync(path.join(root, 'src/cln/narration.json'), 'utf8'));
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const stable = (value) => JSON.stringify(value);
const relativeDir = 'cln-tutorial/v4-audio';
const audioDir = path.join(root, 'public', relativeDir);
const fps = 30;
const model = 'eleven_multilingual_v2';
const settings = { stability: 0.55, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true };
const identity = (file) => ({ path: path.relative(path.join(root, 'public'), file), bytes: fs.statSync(file).size, sha256: sha(fs.readFileSync(file)) });
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
const durationOf = (file) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file], { encoding: 'utf8' }).trim());
// Compile the same browser/Node contract in memory; never emit generated source.
const contractPath = path.join(root, 'src/cln/v4-contract.ts');
const contractModule = new Module(contractPath, module);
const ts = require('typescript');
contractModule._compile(ts.transpileModule(fs.readFileSync(contractPath, 'utf8'), {
	compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, contractPath);
const contract = contractModule.exports;
const cueTime = contract.measuredCueTime;
const provenance = {
	schemaVersion: 1, status: 'preparing', voiceId: series.voiceId, voiceNameInSeries: 'Daniel',
	provider: 'ElevenLabs', model, voiceSettings: settings,
	voiceConfigRef: 'src/cln/narration.json',
	workflowRef: '../packages/backend/scripts/generate-cln-tutorial-audio.ts',
	transcriptionWorkflowRef: '../packages/backend/src/scripts/transcribe-biology.ts',
	transcription: { provider: 'OpenAI', model: 'whisper-1', language: 'en', temperature: 0, timestampGranularities: ['word', 'segment'] },
	leadFrames: 18, interBeatGapFrames: 29, transitionOverlapFrames: 0,
	note: 'Established 0.6s lead and 0.95s gap, rounded up to whole frames. Persisted audio bytes and measured Whisper words drive playback; generation is never repeated during rendering. No approval is inferred from generation.',
	generatedClips: [], clips: [], blocker: null,
};

async function responseOrThrow(response, operation) {
	if (response.ok) return response;
	let status = 'provider error';
	try { const body = await response.json(); status = body.detail?.status ?? body.error?.code ?? status; } catch {}
	// Do not print provider response bodies or credentials.
	throw Object.assign(new Error(`${operation}: HTTP ${response.status} (${status})`), { httpStatus: response.status, providerCode: status });
}

const isCreditExhaustion = (error) => error.httpStatus === 429 && error.providerCode === 'credit_balance_exhausted';
// A helper edit does not invalidate an existing measured response when its
// model bytes, installed engines and every decoding parameter are unchanged.
const localFingerprint = ({ helper, ...config }) => stable(config);

async function main() {
	const args = process.argv.slice(2);
	const options = {};
	for (let i = 0; i < args.length; i += 2) {
		assert.ok(['--env-file', '--transcription', '--local-python', '--local-model', '--preserve-timeline'].includes(args[i]) && args[i + 1] && !options[args[i]], 'Usage: node tools/prepare-cln-v4-audio.cjs [--env-file /absolute/.env] [--transcription remote|local] [--local-python /path/python] [--local-model /cached/model] [--preserve-timeline true]');
		options[args[i]] = args[i + 1];
	}
	let transcriptionMode = options['--transcription'] ?? 'remote';
	assert.ok(!options['--preserve-timeline'] || options['--preserve-timeline'] === 'true', '--preserve-timeline accepts true only');
	assert.ok(['remote', 'local'].includes(transcriptionMode), 'Transcription must be remote or local');
	if (options['--env-file']) { process.loadEnvFile(options['--env-file']); provenance.credentialSource = path.resolve(options['--env-file']); }
	else {
		const env = path.resolve(root, '../.env');
		if (fs.existsSync(env)) process.loadEnvFile(env);
		provenance.credentialSource = 'process environment or worktree root .env';
	}
	assert.equal(series.voiceId, 'gYWKdgLtqjPO3D5uDrDP', 'Established series voice changed; inspect before generating');
	assert.deepEqual(series.voiceSettings, settings, 'Established series settings changed; inspect before generating');
	for (const key of ['ELEVENLABS_API_KEY', ...(transcriptionMode === 'remote' ? ['OPENAI_API_KEY'] : [])]) if (!process.env[key]) throw new Error(`${key} unavailable; no substitute voice or unmeasured narration generated`);
	const localPython = options['--local-python'] ?? process.env.CLN_V4_WHISPER_PYTHON ?? '/tmp/si-units-faster-whisper/bin/python';
	const localModel = () => {
		if (options['--local-model']) return path.resolve(options['--local-model']);
		const cache = path.join(os.homedir(), '.cache/huggingface/hub/models--Systran--faster-whisper-small');
		return path.join(cache, 'snapshots', fs.readFileSync(path.join(cache, 'refs/main'), 'utf8').trim());
	};
	const localRun = (mp3, prompt, computeType = 'int8', window) => JSON.parse(execFileSync(localPython, [path.join(root, 'tools/transcribe-cln-v4-local.py'), '--model-path', localModel(), '--compute-type', computeType, ...(mp3 ? ['--audio', mp3] : []), ...(prompt ? ['--initial-prompt', prompt] : []), ...(window ? ['--clip-timestamps', window.join(',')] : [])], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024, timeout: 180000 }));
	let localConfig = null;
	const useLocal = () => { localConfig ??= localRun(); provenance.transcription = localConfig; provenance.transcriptionWorkflowRef = 'tools/transcribe-cln-v4-local.py'; transcriptionMode = 'local'; };
	if (transcriptionMode === 'local') useLocal(); // Fail before TTS if the offline environment is unavailable.
	const prior = JSON.parse(fs.readFileSync(provenancePath, 'utf8'));
	provenance.previousBlocker = prior.previousBlocker ?? { blocker: prior.blocker, evidence: prior.blockerEvidence };
	provenance.requestedTranscription = options['--transcription'] ?? 'remote';
	const voice = await (await responseOrThrow(await fetch(`https://api.elevenlabs.io/v1/voices/${series.voiceId}`, {
		headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY }, signal: AbortSignal.timeout(30000),
	}), 'Established voice lookup')).json();
	assert.equal(voice.voice_id, series.voiceId);
	provenance.providerVoiceName = voice.name;
	provenance.providerVoiceCategory = voice.category;
	fs.mkdirSync(audioDir, { recursive: true });
	let spoken = 0;
	for (const beat of timing.beats.filter((item) => item.narration)) {
		const request = { text: beat.narration, model_id: model, voice_settings: settings };
		const requestHash = sha(stable({ voiceId: series.voiceId, ...request }));
		const stem = `${beat.id}-${requestHash.slice(0, 12)}`;
		const mp3 = path.join(audioDir, `${stem}.mp3`);
		const receipt = path.join(audioDir, `${stem}-provenance.json`);
		let transcript = path.join(audioDir, `${stem}-whisper.json`);
		if (fs.existsSync(mp3)) {
			assert.ok(fs.existsSync(receipt), `Existing clip has no provenance; retained without reuse: ${mp3}`);
			const prior = JSON.parse(fs.readFileSync(receipt, 'utf8'));
			assert.equal(prior.requestHash, requestHash); assert.deepEqual(prior.audio, identity(mp3));
		} else {
			console.log(`Generate established series voice: ${beat.id}`);
			const response = await responseOrThrow(await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${series.voiceId}`, {
				method: 'POST', headers: { Accept: 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': process.env.ELEVENLABS_API_KEY },
				body: stable(request), signal: AbortSignal.timeout(120000),
			}), `ElevenLabs ${beat.id}`);
			fs.writeFileSync(mp3, Buffer.from(await response.arrayBuffer()), { flag: 'wx' });
			save(receipt, { provider: 'ElevenLabs', voiceId: series.voiceId, requestHash, request, generatedAt: new Date().toISOString(), requestId: response.headers.get('request-id'), audio: identity(mp3) });
		}
		provenance.generatedClips.push({ id: beat.id, audio: identity(mp3), receipt: identity(receipt), durationSeconds: durationOf(mp3) });
		save(provenancePath, provenance);
		if (transcriptionMode === 'remote' && !fs.existsSync(transcript)) {
			const form = new FormData();
			form.append('file', new Blob([fs.readFileSync(mp3)], { type: 'audio/mpeg' }), path.basename(mp3));
			form.append('model', 'whisper-1'); form.append('language', 'en'); form.append('temperature', '0');
			form.append('response_format', 'verbose_json'); form.append('timestamp_granularities[]', 'word'); form.append('timestamp_granularities[]', 'segment');
			try {
				const response = await responseOrThrow(await fetch('https://api.openai.com/v1/audio/transcriptions', {
					method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: form, signal: AbortSignal.timeout(120000),
				}), `Whisper ${beat.id}`);
				save(transcript, { audioSha256: identity(mp3).sha256, measuredAt: new Date().toISOString(), transcription: provenance.transcription, response: await response.json() });
			} catch (error) {
				if (!isCreditExhaustion(error)) throw error;
				provenance.fallback = { reason: error.message, beat: beat.id };
				console.log(`Whisper credit exhausted at ${beat.id}; use cached local word transcription.`);
				useLocal();
			}
		}
		if (transcriptionMode === 'local') {
			transcript = localTranscript(localConfig);
		}
		function localTranscript(config, prompt, firstAttempt) {
			const cached = fs.readdirSync(audioDir).sort().filter((name) => name.startsWith(`${stem}-local-`) && name.endsWith('.json')).find((name) => {
				const saved = JSON.parse(fs.readFileSync(path.join(audioDir, name), 'utf8'));
				return saved.audioSha256 === identity(mp3).sha256 && localFingerprint(saved.transcription) === localFingerprint(config);
			});
			if (cached) return path.join(audioDir, cached);
			const file = path.join(audioDir, `${stem}-local-${sha(localFingerprint(config)).slice(0, 12)}.json`);
			const result = localRun(mp3, prompt, config.computeType, config.settings.clip_timestamps);
			assert.equal(localFingerprint(result.transcription), localFingerprint(config), 'Local decoding parameters changed');
			if (firstAttempt) result.firstAttempt = firstAttempt;
			save(file, result);
			return file;
		}
		let raw = JSON.parse(fs.readFileSync(transcript, 'utf8'));
		assert.equal(raw.audioSha256, identity(mp3).sha256);
		if (transcriptionMode === 'local') assert.equal(localFingerprint(raw.transcription), localFingerprint(localConfig), 'Local transcript model/settings/version changed');
		let words = raw.response.words;
		assert.ok(words?.length, `Whisper returned no measured words: ${beat.id}`);
		const duration = durationOf(mp3);
		const validateWords = () => { contract.assertTranscriptText(beat.narration, words, beat.id); contract.assertWordIntervals(words, duration, fps, beat.id); };
		if (transcriptionMode === 'local') {
			for (const computeType of ['int8', 'float32']) {
				try { validateWords(); break; } catch {}
				const { hotwords, ...settings } = localConfig.settings;
				const retryConfig = { ...localConfig, computeType, settings: { ...settings, initial_prompt: beat.narration } };
				console.log(`Retry local transcription with script context (${computeType}): ${beat.id}; retain prior response.`);
				transcript = localTranscript(retryConfig, beat.narration, identity(transcript));
				raw = JSON.parse(fs.readFileSync(transcript, 'utf8')); words = raw.response.words;
				assert.equal(raw.audioSha256, identity(mp3).sha256);
				assert.equal(localFingerprint(raw.transcription), localFingerprint(retryConfig));
			}
			if (contract.normalizedSpeech(beat.narration) === contract.normalizedSpeech(words.map((word) => word.word).join(' ')) && words.some((word) => word.end <= word.start)) {
				const baseTranscript = identity(transcript);
				const refinements = [];
				// Re-measure the whole sentence around a collapsed word. Whisper's
				// clip_timestamps returns original-audio seconds: never interpolate,
				// stretch or invent a duration for the failed word boundary.
				for (let bad = words.findIndex((word) => word.end <= word.start); bad >= 0; bad = words.findIndex((word) => word.end <= word.start)) {
					assert.ok(refinements.length < raw.response.words.length, 'Sentence-window alignment did not converge');
					let start = bad; let end = bad + 1;
					while (start > 0 && !/[.!?;]$/.test(words[start - 1].word)) start--;
					while (end < words.length && !/[.!?;]$/.test(words[end - 1].word)) end++;
					const window = [start ? words[start - 1].end : 0, end < words.length ? words[end].start : duration];
					const sentence = words.slice(start, end).map((word) => word.word).join(' ');
					const config = { ...raw.transcription, settings: { ...raw.transcription.settings, initial_prompt: sentence, clip_timestamps: window } };
					console.log(`Re-measure sentence window: ${beat.id}, ${window.join('–')}s.`);
					const file = localTranscript(config, sentence);
					const measuredWindow = JSON.parse(fs.readFileSync(file, 'utf8')).response.words;
					contract.assertTranscriptText(sentence, measuredWindow, `${beat.id}/sentence-window`);
					contract.assertWordIntervals(measuredWindow, duration, fps, `${beat.id}/sentence-window`);
					assert.ok(measuredWindow[0].start >= window[0] && measuredWindow.at(-1).end <= window[1]);
					refinements.push({ fromWordIndex: start, toWordIndex: end, clipTimestamps: window, transcript: identity(file) });
					words = [...words.slice(0, start), ...measuredWindow, ...words.slice(end)];
				}
				const file = path.join(audioDir, `${stem}-local-${sha(stable({ baseTranscript, refinements })).slice(0, 12)}.json`);
				if (!fs.existsSync(file)) save(file, { ...raw, refinedAt: new Date().toISOString(), firstAttempt: baseTranscript,
					transcription: { ...raw.transcription, wordTimingMethod: 'sentence-window-v1', baseTranscriptSha256: baseTranscript.sha256 },
					windowRefinements: refinements, response: { ...raw.response, text: words.map((word) => word.word).join(' '), words } });
				transcript = file; raw = JSON.parse(fs.readFileSync(file, 'utf8')); words = raw.response.words;
			}
		}
		try { validateWords(); }
		catch (error) {
			(provenance.alignmentIssues ??= []).push({ id: beat.id, error: error.message, transcript: identity(transcript) });
			console.log(`Alignment review required: ${beat.id}; original audio/transcript retained.`);
			save(provenancePath, provenance);
			continue;
		}
		assert.ok(Number.isFinite(duration) && duration > 0);
		const clipStartFrame = spoken++ === 0 ? 18 : 0;
		beat.plannedDurationInFrames ??= beat.durationInFrames;
		const requiredFrames = clipStartFrame + Math.ceil(duration * fps) + 29;
		if (options['--preserve-timeline']) assert.ok(requiredFrames <= beat.durationInFrames, `${beat.id}: measured clip plus 29-frame tail requires ${requiredFrames} frames; existing beat has ${beat.durationInFrames}. Revise only this narration or explicitly review timing.`);
		else beat.durationInFrames = Math.max(beat.plannedDurationInFrames, requiredFrames);
		beat.voiceFromFrame = clipStartFrame + Math.floor(words[0].start * fps);
		beat.voiceToFrame = clipStartFrame + Math.ceil(words.at(-1).end * fps);
		beat.emphasisAtFrame = clipStartFrame + Math.floor(cueTime(words, beat.cueWords.emphasis) * fps);
		beat.focusAtFrame = clipStartFrame + Math.floor(cueTime(words, beat.cueWords.focus) * fps);
		beat.proofFromFrames = beat.proofs.map((_, i) => i === 0 ? 0 : clipStartFrame + Math.floor(cueTime(words, beat.proofCueWords[i]) * fps));
		assert.ok(beat.voiceToFrame <= beat.durationInFrames);
		provenance.clips.push({ id: beat.id, script: beat.narration, requestHash, audio: identity(mp3), receipt: identity(receipt), transcript: identity(transcript), transcriptionProvider: raw.transcription?.provider ?? 'OpenAI', clipStartFrame, durationSeconds: duration, words });
		console.log(`Measured ${beat.id}: ${duration.toFixed(3)}s, ${words.length} words`);
		save(provenancePath, provenance);
	}
	assert.ok(!provenance.alignmentIssues?.length, `Transcript text review required: ${provenance.alignmentIssues?.map((item) => item.id).join(', ')}`);
	let cursor = 0;
	for (const beat of timing.beats) { beat.from = cursor; cursor += beat.durationInFrames - beat.overlapFromPrevious; }
	timing.totalFrames = cursor;
	contract.assertNarrationManifest(timing);
	contract.assertEvidenceTiming(JSON.parse(fs.readFileSync(path.join(root, 'src/cln/captures-v4.json'), 'utf8')), timing);
	const editHash = sha(stable({ beats: timing.beats, clips: provenance.clips.map((clip) => clip.audio.sha256) }));
	const master = path.join(audioDir, `narration-${editHash.slice(0, 12)}.wav`);
	if (!fs.existsSync(master)) {
		const args = ['-v', 'error', '-n'];
		for (const clip of provenance.clips) args.push('-i', path.join(root, 'public', clip.audio.path));
		const filters = provenance.clips.map((clip, i) => {
			const beat = timing.beats.find((item) => item.id === clip.id);
			const samples = (beat.from + clip.clipStartFrame) * 1600; // 48k / 30fps, exact samples.
			return `[${i}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=mono,adelay=${samples}S:all=1[a${i}]`;
		});
		filters.push(`${provenance.clips.map((_, i) => `[a${i}]`).join('')}amix=inputs=${provenance.clips.length}:normalize=0,apad=whole_len=${cursor * 1600},atrim=end_sample=${cursor * 1600}[master]`);
		args.push('-filter_complex', filters.join(';'), '-map', '[master]', '-c:a', 'pcm_s16le', '-ar', '48000', master);
		execFileSync('ffmpeg', args);
	}
	assert.equal(Math.round(durationOf(master) * fps), cursor);
	const measuredPath = path.join(audioDir, `narration-${editHash.slice(0, 12)}-measured.json`);
	const providers = [...new Set(provenance.clips.map((clip) => clip.transcriptionProvider))];
	const measured = { schemaVersion: 1, provider: providers.length > 1 ? 'whisper-mixed' : providers[0] === 'local-faster-whisper' ? 'local-faster-whisper' : 'openai-whisper-1', fps, totalFrames: cursor, masterSha256: identity(master).sha256, clips: provenance.clips };
	if (!fs.existsSync(measuredPath)) save(measuredPath, measured);
	else assert.deepEqual(JSON.parse(fs.readFileSync(measuredPath, 'utf8')), measured);
	timing.audio = { ...identity(master), durationInFrames: cursor, transcriptRef: path.relative(root, measuredPath), transcript: identity(measuredPath) };
	contract.assertMeasuredNarration(timing, measured);
	timing.audioStatus = 'generated-unapproved'; timing.timingStatus = 'measured-transcript';
	timing.wordTimingVerified = true; timing.narrationApprovalRef = null;
	timing.note = 'Fresh established-series voice; persisted Whisper word times drive voice, emphasis, detail and evidence cuts. Audio is unapproved pending listening review. Zero transition overlaps.';
	provenance.status = 'generated-unapproved'; provenance.audio = timing.audio;
	provenance.totalFrames = cursor; provenance.durationSeconds = cursor / fps;
	provenance.coverage = { timelineBeats: timing.beats.length, spokenBeats: spoken, measuredClips: provenance.clips.length, silentBookends: timing.beats.filter((beat) => !beat.narration).map((beat) => beat.id) };
	const selectedAudio = new Set(provenance.clips.map((clip) => clip.audio.path));
	provenance.retainedUnusedRecordings = fs.readdirSync(audioDir).filter((name) => name.endsWith('-provenance.json')).map((name) => {
		const file = path.join(audioDir, name); const receipt = JSON.parse(fs.readFileSync(file, 'utf8'));
		return { requestId: receipt.requestId, audio: receipt.audio, receipt: identity(file), script: receipt.request.text };
	}).filter((record) => !selectedAudio.has(record.audio.path));
	provenance.remainingGate = 'Listening/word-alignment review and explicit narration approval; no final video rendered.';
	save(provenancePath, provenance); save(timingPath, timing);
	console.log(`Audio prepared, NOT approved: ${cursor} frames / ${(cursor / fps).toFixed(3)} seconds`);
}

module.exports = { cueTime, durationOf, isCreditExhaustion, contract };
if (require.main === module) main().catch((error) => {
	provenance.status = 'blocked'; provenance.blocker = error.message;
	save(provenancePath, provenance);
	console.error(`AUDIO PREP BLOCKED: ${error.message}`); process.exitCode = 1;
});
