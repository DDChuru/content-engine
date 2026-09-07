#!/usr/bin/env node
// Audio-only proof: decode every clip/master, verify timing and exact placement.
// This validator neither generates narration nor approves it nor renders video.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { contract } = require('./prepare-cln-v4-audio.cjs');
const root = path.resolve(__dirname, '..');
const load = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const publicFile = (file) => path.join(root, 'public', file);
const decode = (file) => execFileSync('ffmpeg', ['-v', 'error', '-i', publicFile(file), '-ac', '1', '-ar', '48000', '-f', 's16le', '-'], { maxBuffer: 128 * 1024 * 1024 });

async function main() {
	const args = process.argv.slice(2);
	assert.ok(args.length === 0 || (args.length === 2 && args[0] === '--output'), 'Usage: node tools/verify-cln-v4-audio.cjs [--output /path/verify-audio.json]');
	const timing = load('src/cln/narration-v4.json');
	const prep = load('src/cln/audio-v4.json');
	assert.ok(timing.audio?.transcript, 'Complete measured narration required');
	const measured = load(`public/${timing.audio.transcript.path}`);
	await contract.verifyAssetFiles(load('src/cln/captures-v4.json'), timing, async (file) => new Uint8Array(fs.readFileSync(publicFile(file))), async (bytes) => hash(bytes));
	assert.deepEqual(prep.clips, measured.clips);
	assert.deepEqual(prep.audio, timing.audio);
	const spoken = timing.beats.filter((beat) => beat.narration);
	assert.equal(prep.generatedClips.length, spoken.length);
	assert.equal(measured.clips.length, spoken.length);
	const master = decode(timing.audio.path);
	assert.equal(master.length, timing.totalFrames * 1600 * 2, 'Exact 48 kHz master sample count');
	const silent = (start, end) => { for (let i = start; i < end; i += 2) assert.equal(master.readInt16LE(i), 0, 'Unexpected sound outside placed clips'); };
	const results = [];
	let cursor = 0;
	for (const [index, clip] of measured.clips.entries()) {
		const beat = spoken[index];
		const generated = prep.generatedClips[index];
		assert.equal(generated.id, beat.id);
		assert.deepEqual(generated.audio, clip.audio); assert.deepEqual(generated.receipt, clip.receipt);
		const receipt = load(`public/${clip.receipt.path}`);
		const transcript = load(`public/${clip.transcript.path}`);
		let prior = transcript.firstAttempt;
		const seenAttempts = new Set();
		while (prior) {
			contract.assertFileIdentity(prior);
			assert.ok(!seenAttempts.has(prior.path), 'Transcription retry provenance must not cycle');
			seenAttempts.add(prior.path);
			const bytes = fs.readFileSync(publicFile(prior.path));
			contract.assertFileBytes(prior, bytes, hash(bytes));
			const attempt = JSON.parse(bytes.toString('utf8'));
			assert.equal(attempt.audioSha256, clip.audio.sha256, 'Retry must measure the same audio');
			prior = attempt.firstAttempt;
		}
		if (transcript.windowRefinements) {
			let reconstructed = load(`public/${transcript.firstAttempt.path}`).response.words;
			for (const window of transcript.windowRefinements) {
				contract.assertFileIdentity(window.transcript);
				const bytes = fs.readFileSync(publicFile(window.transcript.path));
				contract.assertFileBytes(window.transcript, bytes, hash(bytes));
				const source = JSON.parse(bytes.toString('utf8'));
				assert.equal(source.audioSha256, clip.audio.sha256);
				assert.deepEqual(source.transcription.settings.clip_timestamps, window.clipTimestamps);
				contract.assertTranscriptText(reconstructed.slice(window.fromWordIndex, window.toWordIndex).map((word) => word.word).join(' '), source.response.words, `${clip.id}/window`);
				contract.assertWordIntervals(source.response.words, clip.durationSeconds, timing.fps, `${clip.id}/window`);
				reconstructed = [...reconstructed.slice(0, window.fromWordIndex), ...source.response.words, ...reconstructed.slice(window.toWordIndex)];
			}
			assert.deepEqual(transcript.response.words, reconstructed, 'Refined words must exactly reproduce measured source windows');
		}
		assert.equal(receipt.provider, 'ElevenLabs'); assert.ok(receipt.requestId);
		assert.equal(receipt.voiceId, 'gYWKdgLtqjPO3D5uDrDP');
		assert.equal(receipt.request.model_id, 'eleven_multilingual_v2');
		assert.deepEqual(receipt.request.voice_settings, prep.voiceSettings);
		assert.equal(receipt.requestHash, hash(JSON.stringify({ voiceId: receipt.voiceId, ...receipt.request })));
		const duration = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', publicFile(clip.audio.path)], { encoding: 'utf8' }).trim());
		assert.equal(duration, clip.durationSeconds); assert.equal(duration, generated.durationSeconds);
		const pcm = decode(clip.audio.path);
		const start = (beat.from + clip.clipStartFrame) * 1600 * 2;
		const end = start + pcm.length;
		assert.ok(start >= cursor && end <= (beat.from + beat.durationInFrames) * 1600 * 2, 'Clip must fit wholly inside its beat');
		silent(cursor, start);
		let maxDelta = 0; let peak = 0;
		for (let i = 0; i < pcm.length; i += 2) {
			const sample = pcm.readInt16LE(i);
			maxDelta = Math.max(maxDelta, Math.abs(sample - master.readInt16LE(start + i)));
			peak = Math.max(peak, Math.abs(sample));
		}
		assert.ok(maxDelta <= 1, `Master differs from source PCM: ${clip.id}, ${maxDelta}`);
		assert.ok(peak > 0 && peak < 32767, `Silent or clipped source: ${clip.id}`);
		cursor = end;
		results.push({ id: clip.id, requestId: receipt.requestId, generatedAt: receipt.generatedAt, audio: clip.audio,
			durationSeconds: duration, measuredWords: clip.words.length, from: beat.from, frames: beat.durationInFrames,
			plannedFrames: beat.plannedDurationInFrames, pcmSamples: pcm.length / 2, maxMasterSampleDelta: maxDelta, peak,
			transcript: clip.transcript, computeType: transcript.transcription?.computeType,
			scriptContextRetry: Boolean(transcript.transcription?.settings.initial_prompt), retainedPriorAttempts: [...seenAttempts], windowRefinements: transcript.windowRefinements ?? [] });
	}
	silent(cursor, master.length);
	const report = { schemaVersion: 1, result: 'pass', reviewKind: 'automated audio and word-alignment audit', humanListeningReview: false,
		master: timing.audio, totalFrames: timing.totalFrames, durationSeconds: timing.totalFrames / timing.fps,
		fps: timing.fps, sampleRate: 48000, samples: master.length / 2, spokenBeats: spoken.length,
		silentBookends: timing.beats.filter((beat) => !beat.narration).map((beat) => ({ id: beat.id, from: beat.from, frames: beat.durationInFrames })),
		transcription: prep.transcription, clips: results };
	if (args.length) fs.writeFileSync(args[1], JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
	console.log(`PASS audio: ${results.length}/${spoken.length} clips; script, receipts, hashes, words, cues, PCM placement and silence; ${timing.totalFrames} frames / ${timing.totalFrames / timing.fps}s.`);
}

if (require.main === module) main().catch((error) => { console.error(error.message); process.exitCode = 1; });
