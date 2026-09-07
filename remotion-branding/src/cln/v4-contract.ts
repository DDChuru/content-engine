/** Shared browser/Node contract. A declaration is evidence to review, never proof
 * of authenticity by itself; byte hashes bind it to the reviewed source capture. */
export type Rect = { x: number; y: number; w: number; h: number };
export type FileIdentity = { path: string; sha256: string; bytes: number };
export type Capture = FileIdentity & {
	width: number;
	height: number;
	classification: string;
	uncomposed: boolean;
	appCommit: string;
	capturedOn: string;
	machine: string;
	site: string;
	account: string;
	captureMethod: string;
	authorizationRef: string;
	reviewRef: string;
	scenario: string;
	eventOrder: number;
	recordRef?: string;
	inspectionFrequency?: string;
	disclosure: string;
	evidenceNote?: string;
	observed?: Record<string, string | number | boolean | string[]>;
	views: Record<string, Rect | null>;
};
export type CaptureSlot = { id: string; title: string; blocker: string | null; captures: Capture[] };
export type CaptureManifest = {
	schemaVersion: number;
	register: string;
	baselineAppCommit: string;
	slots: CaptureSlot[];
};
export type V4Beat = {
	id: string;
	kind: string;
	durationInFrames: number;
	overlapFromPrevious: number;
	from: number;
	chapter: string;
	slot: string | null;
	proofs: string[];
	headline: string;
	body: string;
	emphasis: string;
	narration: string;
	voiceFromFrame: number;
	voiceToFrame: number;
	emphasisAtFrame: number;
	focusAtFrame: number;
	cueWords: { emphasis: string; focus: string };
	proofCueWords: string[];
	proofFromFrames: number[];
};
export type NarrationManifest = {
	schemaVersion: number;
	fps: number;
	width: number;
	height: number;
	totalFrames: number;
	timingStatus: string;
	audioStatus: string;
	audio: (FileIdentity & { durationInFrames: number; transcriptRef: string; transcript?: FileIdentity }) | null;
	narrationApprovalRef: string | null;
	wordTimingVerified: boolean;
	beats: V4Beat[];
};
export type MeasuredWord = { word: string; start: number; end: number };
export type MeasuredClip = {
	id: string; script: string; audio: FileIdentity; receipt: FileIdentity; transcript: FileIdentity;
	transcriptionProvider?: string;
	clipStartFrame: number; durationSeconds: number; words: MeasuredWord[];
};
export type MeasuredNarration = {
	schemaVersion: number; provider: string; fps: number; totalFrames: number; masterSha256: string; clips: MeasuredClip[];
};

// Independent requirements: removing a slot/beat or changing a JSON flag cannot
// silently turn a missing operation into optional evidence.
export const CAPTURE_REQUIREMENTS: Record<string, readonly string[]> = {
	home: ['entry'],
	boh: ['entry'],
	summary: ['baseline'],
	due: ['due', 'ssop-link', 'scan-entry'],
	ssop: ['reference'],
	'off-schedule': ['catalogue'],
	'qr-check-in': ['scanner', 'unlocked'],
	'single-pass': ['inspection', 'confirmation', 'passed'],
	'frequency-pass-all': ['eligible', 'confirmation', 'result'],
	'major-fail': ['form', 'grade-reason', 'recorded'],
	'critical-ncr': ['grade', 'ncr-queued'],
	'couldnt-access': ['reason', 'recorded'],
	'four-band-open': ['still-to-do', 'passed', 'follow-up-owed', 'couldnt-access'],
	'follow-ups-close': ['queue', 'confirm-followed-up', 'confirmation'],
	'five-band-resolved': ['still-to-do', 'passed', 'follow-up-owed', 'couldnt-access', 'resolved-today'],
};

// These stable register keys describe evidence, not necessarily a dialog.
export const CAPTURE_VIEW_SEMANTICS = {
	'single-pass/confirmation': 'Inline saved green row with UNDO; no separate confirmation dialog.',
	'critical-ncr/ncr-queued': 'Native NCR-raised acknowledgement; a created NCR satisfies this key.',
	'follow-ups-close/confirmation': 'Optional note/photo and inner CONFIRM, before closure.',
	'follow-ups-close/closed-result': 'Supplemental filtered queue after closure: No matches, no success dialog.',
};
export const SUPPLEMENTAL_VIEWS: Record<string, readonly string[]> = { 'follow-ups-close': ['closed-result'] };
const allowedViews = (id: string) => [...CAPTURE_REQUIREMENTS[id], ...(SUPPLEMENTAL_VIEWS[id] ?? [])];

// The six baseline screens are pinned to the independently reviewed register.
// New operational captures belong in their own slots, never in a baseline alias.
export const BASELINE_HASHES: Record<string, string> = {
	home: 'a05e7eac47e81a2277803ca9176cc2da63e4be205d455747f57fcac1e6376714',
	boh: '57c737d81d71cfd5b294ea0acb9412e90391791c8bb7930600d68c92a461ce0e',
	summary: '720154a539390662e8ded098c2c0ecf2a0fecc1d48a1dcf594341cf60813564a',
	due: '8e8058c12eb90775ee99437654d2d057377fadfe5cffc00a7f7ae79f6759e541',
	ssop: '2a68b3f9fe302a0bdeb54ee5d1cdc93c2047f273d59b7f36f8883cc09e3da351',
	'off-schedule': '6809994973d075dbc6e35ecfa980e97cb72ae4ae16b8a9c15fa69c0fb71e5848',
};

const requireValue = (condition: unknown, message: string): void => {
	if (!condition) throw new Error(`CLN V4: ${message}`);
};
const nonempty = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

export const assertFileIdentity = (file: FileIdentity) => {
	requireValue(/^cln-tutorial\/v4-[a-zA-Z0-9/_-]+\.[a-z0-9]+$/.test(file.path), `unsafe or legacy asset path: ${file.path}`);
	requireValue(/^[a-f0-9]{64}$/.test(file.sha256), `SHA-256 required: ${file.path}`);
	requireValue(Number.isInteger(file.bytes) && file.bytes > 0, `byte size required: ${file.path}`);
};

export const assertCaptureManifest = (manifest: CaptureManifest) => {
	requireValue(manifest.schemaVersion === 1, 'unsupported capture schema');
	requireValue(manifest.baselineAppCommit === '6999d8eca52fc4f4fff69066dce365f54a609663', 'baseline source revision changed');
	requireValue(nonempty(manifest.register), 'capture register required');
	const ids = manifest.slots.map((slot) => slot.id);
	requireValue(new Set(ids).size === ids.length, 'duplicate capture slot');
	requireValue(ids.length === Object.keys(CAPTURE_REQUIREMENTS).length, 'required capture slot removed or unknown slot added');
	const hashSlots = new Map<string, string>();
	for (const [id, requirements] of Object.entries(CAPTURE_REQUIREMENTS)) {
		const slot = manifest.slots.find((item) => item.id === id);
		requireValue(slot && nonempty(slot.title), `required capture slot absent: ${id}`);
		if (!slot) continue;
		if (BASELINE_HASHES[id]) requireValue(slot.captures.length === 1, `one pinned baseline required: ${id}`);
		const seenProofs = new Set<string>();
		for (const capture of slot.captures) {
			assertFileIdentity(capture);
			requireValue(capture.path.endsWith('.png'), `operational UI must be a captured PNG: ${id}`);
			requireValue(capture.uncomposed === true, `composed UI forbidden: ${id}`);
			requireValue(['genuine-current-app', 'authorized-seeded-demonstration'].includes(capture.classification), `genuine capture classification required: ${id}`);
			requireValue(/^[a-f0-9]{40}$/.test(capture.appCommit), `app revision required: ${id}`);
			requireValue(/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(capture.capturedOn) && Number.isFinite(Date.parse(capture.capturedOn)), `capture date required: ${id}`);
			for (const field of ['machine', 'site', 'account', 'authorizationRef', 'reviewRef', 'scenario', 'disclosure'] as const) {
				requireValue(nonempty(capture[field]), `${field} required: ${id}`);
			}
			requireValue(capture.site === 'Bakery Demo', `unexpected demonstration site: ${id}`);
			requireValue(Number.isInteger(capture.width) && capture.width >= 360 && Number.isInteger(capture.height) && capture.height > capture.width, `portrait dimensions required: ${id}`);
			requireValue(['read-only-navigation', 'physical-qr', 'controlled-virtual-camera-qr', 'authorized-app-operation', 'disclosed-test-harness'].includes(capture.captureMethod), `capture method required: ${id}`);
			if (BASELINE_HASHES[id]) {
				requireValue(capture.sha256 === BASELINE_HASHES[id] && capture.width === 720 && capture.height === 1600 && capture.appCommit === manifest.baselineAppCommit, `pinned baseline mismatch: ${id}`);
			} else {
				requireValue(!Object.values(BASELINE_HASHES).includes(capture.sha256), `baseline is not operational proof: ${id}`);
				requireValue(Number.isInteger(capture.eventOrder) && capture.eventOrder > 0 && nonempty(capture.recordRef), `operation order and restricted record-log reference required: ${id}`);
			}
			if (id === 'qr-check-in') requireValue(['physical-qr', 'controlled-virtual-camera-qr'].includes(capture.captureMethod), 'real QR evidence cannot be satisfied by a harness');
			// Detailed disclosure is internal provenance; the composition displays
			// only SIMULATION, per Daniel's V4 editorial revision.
			if (capture.captureMethod === 'controlled-virtual-camera-qr') requireValue(/controlled virtual-camera QR scan/i.test(capture.disclosure) && /no physical attendance claim/i.test(capture.disclosure), `controlled-camera disclosure required in provenance: ${id}`);
			if (capture.captureMethod === 'disclosed-test-harness') requireValue(/harness/i.test(capture.disclosure), `internal harness disclosure required: ${id}`);
			if (capture.classification === 'authorized-seeded-demonstration') requireValue(/authorized seeded demonstration record/i.test(capture.disclosure), `seeded-record disclosure required: ${id}`);
			const prior = hashSlots.get(capture.sha256);
			requireValue(!prior || prior === id, `same PNG reused as different operational evidence: ${prior} / ${id}`);
			hashSlots.set(capture.sha256, id);
			requireValue(Object.keys(capture.views).length > 0, `capture needs reviewed evidence views: ${id}`);
			for (const [proof, rect] of Object.entries(capture.views)) {
				requireValue(allowedViews(id).includes(proof) && !seenProofs.has(proof), `unknown or duplicate evidence: ${id}/${proof}`);
				seenProofs.add(proof);
				if (rect) requireValue([rect.x, rect.y, rect.w, rect.h].every(Number.isFinite) && rect.x >= 0 && rect.y >= 0 && rect.w > 0 && rect.h > 0 && rect.x + rect.w <= 1 && rect.y + rect.h <= 1, `crop outside genuine image: ${id}/${proof}`);
			}
		}
	}
	const captures = (id: string) => manifest.slots.find((slot) => slot.id === id)!.captures;
	const operations = manifest.slots.filter((slot) => !BASELINE_HASHES[slot.id]).flatMap((slot) => slot.captures);
	requireValue(new Set(operations.map((capture) => capture.scenario)).size <= 1, 'operational captures must share one documented scenario');
	const before = (first: string, second: string) => {
		if (captures(first).length && captures(second).length) requireValue(Math.max(...captures(first).map((c) => c.eventOrder)) < Math.min(...captures(second).map((c) => c.eventOrder)), `capture chronology must preserve ${first} before ${second}`);
	};
	before('qr-check-in', 'single-pass');
	before('single-pass', 'frequency-pass-all');
	for (const id of ['single-pass', 'major-fail', 'critical-ncr', 'couldnt-access', 'frequency-pass-all']) before(id, 'four-band-open');
	before('four-band-open', 'follow-ups-close');
	before('follow-ups-close', 'five-band-resolved');
	const frequencyCaptures = [...captures('single-pass'), ...captures('frequency-pass-all')];
	for (const capture of frequencyCaptures) requireValue(nonempty(capture.inspectionFrequency), 'actual inspected frequency must be recorded for single pass and Pass all');
	requireValue(new Set(frequencyCaptures.map((capture) => capture.inspectionFrequency)).size <= 1, 'Pass all must follow an inspection of the SAME frequency');
	// Compare actual evidence events, including eligibility BEFORE exceptions and
	// the bulk confirmation AFTER them. Slot-wide ordering alone cannot prove it.
	const evidence = (id: string, proof: string) => captures(id).find((capture) => Object.hasOwn(capture.views, proof));
	const earlier = (first: Capture | undefined, second: Capture | undefined) => {
		if (first && second) requireValue(first.eventOrder < second.eventOrder, 'capture chronology must preserve action before result');
	};
	earlier(evidence('single-pass', 'inspection'), evidence('single-pass', 'confirmation'));
	for (const id of ['major-fail', 'couldnt-access']) earlier(evidence(id, 'recorded'), evidence('frequency-pass-all', 'confirmation'));
	earlier(evidence('critical-ncr', 'ncr-queued'), evidence('frequency-pass-all', 'confirmation'));
	earlier(evidence('follow-ups-close', 'confirmation'), evidence('follow-ups-close', 'closed-result'));
	const saved = evidence('single-pass', 'confirmation')?.observed;
	if (saved) requireValue(saved.passSave === 'inline' && saved.confirmationDialog === false, 'individual boolean pass saves inline, without a dialog');
	const bulk = evidence('frequency-pass-all', 'confirmation')?.observed;
	const result = evidence('frequency-pass-all', 'result')?.observed;
	if (bulk && result) requireValue(Number(bulk.completed) + Number(bulk.bulkCount) === result.completed && result.completed === result.scheduled && Number(result.passed) + Number(result.failed) + Number(result.unavailable) === result.completed, 'bulk count must exclude already captured outcomes');
	const open = evidence('four-band-open', 'still-to-do')?.observed;
	const closed = evidence('five-band-resolved', 'still-to-do')?.observed;
	if (open && closed) {
		for (const key of ['stillToDo', 'passed', 'couldntAccess', 'captured', 'scheduled']) requireValue(open[key] === closed[key], `Major closure must leave ${key} unchanged`);
		requireValue(Number(open.followUpOwed) - 1 === closed.followUpOwed && Number(open.resolvedToday) + 1 === closed.resolvedToday, 'Major closure moves one finding from follow-up owed to resolved today');
		for (const counts of [open, closed]) requireValue(Number(counts.passed) + Number(counts.followUpOwed) + Number(counts.couldntAccess) + Number(counts.resolvedToday) === counts.captured && Number(counts.captured) + Number(counts.stillToDo) === counts.scheduled, 'five bands must partition scheduled occurrences');
	}
};

export const getMissingCaptures = (manifest: CaptureManifest) => Object.entries(CAPTURE_REQUIREMENTS).flatMap(([id, proofs]) => {
	const slot = manifest.slots.find((item) => item.id === id);
	const missing = proofs.filter((proof) => !slot?.captures.some((capture) => Object.hasOwn(capture.views, proof)));
	return missing.length ? [{ id, title: slot?.title ?? id, proofs: missing }] : [];
});

export const buildTimeline = (beats: Pick<V4Beat, 'durationInFrames' | 'overlapFromPrevious'>[]) => {
	let end = 0;
	const entries = beats.map((beat, index) => {
		requireValue(Number.isInteger(beat.durationInFrames) && beat.durationInFrames > 0, 'duration must be positive integer frames');
		requireValue(Number.isInteger(beat.overlapFromPrevious) && beat.overlapFromPrevious >= 0 && beat.overlapFromPrevious < beat.durationInFrames && (index ? beat.overlapFromPrevious < beats[index - 1].durationInFrames : beat.overlapFromPrevious === 0), 'invalid transition overlap');
		const from = end - beat.overlapFromPrevious;
		end = from + beat.durationInFrames;
		return { from, durationInFrames: beat.durationInFrames };
	});
	return { entries, totalFrames: end };
};

export const assertNarrationManifest = (timing: NarrationManifest) => {
	requireValue(timing.schemaVersion === 1 && timing.fps === 30 && timing.width === 1920 && timing.height === 1080, 'V4 format must be 1920×1080 at 30 fps');
	requireValue(timing.beats.length > 2 && new Set(timing.beats.map((beat) => beat.id)).size === timing.beats.length, 'unique narration beats required');
	const timeline = buildTimeline(timing.beats);
	requireValue(timeline.totalFrames === timing.totalFrames, 'composition duration does not match duration minus overlap math');
	requireValue(timing.beats[0].kind === 'intro' && timing.beats[0].durationInFrames === 150 && timing.beats.at(-1)?.kind === 'outro' && timing.beats.at(-1)?.durationInFrames === 180, 'shared brand bookend durations changed');
	const covered = new Set<string>();
	for (const [index, beat] of timing.beats.entries()) {
		requireValue(beat.from === timeline.entries[index].from, `incorrect absolute start frame: ${beat.id}`);
		requireValue(beat.overlapFromPrevious === 0, 'operational screens use hard cuts; no blended app states');
		requireValue(['intro', 'screen', 'handoff', 'outro'].includes(beat.kind), `unknown beat kind: ${beat.id}`);
		if (beat.kind === 'screen') {
			requireValue(beat.slot && CAPTURE_REQUIREMENTS[beat.slot] && beat.proofs.length > 0, `screen requires an evidence slot: ${beat.id}`);
			for (const proof of beat.proofs) {
				requireValue(allowedViews(beat.slot!).includes(proof), `unknown narration evidence: ${beat.id}/${proof}`);
				covered.add(`${beat.slot}/${proof}`);
			}
			requireValue(beat.proofFromFrames.length === beat.proofs.length && beat.proofFromFrames[0] === 0, `explicit evidence timing required: ${beat.id}`);
			for (const [i, from] of beat.proofFromFrames.entries()) requireValue(Number.isInteger(from) && from >= 0 && (beat.proofFromFrames[i + 1] ?? beat.durationInFrames) > from, `evidence cues must increase within the beat: ${beat.id}`);
		}
		if (beat.narration) {
			requireValue(Number.isInteger(beat.voiceFromFrame) && Number.isInteger(beat.voiceToFrame) && beat.voiceFromFrame >= 0 && beat.voiceToFrame > beat.voiceFromFrame && beat.voiceToFrame <= beat.durationInFrames, `narration outside beat: ${beat.id}`);
			for (const cue of [beat.emphasisAtFrame, beat.focusAtFrame]) requireValue(Number.isInteger(cue) && cue >= beat.voiceFromFrame && cue < beat.voiceToFrame, `visual cue outside narration: ${beat.id}`);
		} else requireValue(['intro', 'outro'].includes(beat.kind), `narration missing: ${beat.id}`);
	}
	for (const [id, proofs] of Object.entries(CAPTURE_REQUIREMENTS)) for (const proof of proofs) requireValue(covered.has(`${id}/${proof}`), `required operation removed from narration: ${id}/${proof}`);
	if (timing.audio) {
		assertFileIdentity(timing.audio);
		requireValue(timing.audio.durationInFrames === timing.totalFrames && nonempty(timing.audio.transcriptRef), 'mastered narration must match the full timeline and reference its measured transcript');
		if (timing.audio.transcript) assertFileIdentity(timing.audio.transcript);
	}
};

export const assertEvidenceTiming = (manifest: CaptureManifest, timing: NarrationManifest) => {
	for (const beat of timing.beats.filter((item) => item.kind === 'screen')) {
		const slot = manifest.slots.find((item) => item.id === beat.slot)!;
		let start = 0; let prior = '';
		for (let i = 0; i <= beat.proofs.length; i++) {
			const proof = beat.proofs[i];
			const capture = slot.captures.find((item) => Object.hasOwn(item.views, proof));
			const key = i === beat.proofs.length ? '' : capture ? `${capture.sha256}:${JSON.stringify(capture.views[proof])}` : proof;
			const at = beat.proofFromFrames[i] ?? beat.durationInFrames;
			if (i && key !== prior) { requireValue(at - start >= 60, `genuine screen/detail must remain legible for two seconds: ${beat.id}`); start = at; }
			prior = key;
		}
	}
};

// Compare spoken text, allowing only orthography (case, punctuation, digits and
// contractions). Raw ASR words/timestamps remain intact in the source transcript.
const numberWords = (value: number): string => {
	const small = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
	if (value < 20) return small[value];
	if (value < 100) return ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'][Math.floor(value / 10)] + (value % 10 ? numberWords(value % 10) : '');
	if (value < 1000) return small[Math.floor(value / 100)] + 'hundred' + (value % 100 ? numberWords(value % 100) : '');
	return String(value);
};
export const normalizedSpeech = (text: string): string => text.toLowerCase().replaceAll('’', "'")
	.replace(/\bhere's\b/g, 'here is').replace(/\bcouldn't\b/g, 'could not')
	.replace(/\b(\d+)\b/g, (value) => numberWords(Number(value)))
	.replace(/[^a-z0-9]/g, '').replaceAll('hundredand', 'hundred');

export const assertTranscriptText = (script: string, words: MeasuredWord[], id: string) => {
	requireValue(normalizedSpeech(script) === normalizedSpeech(words.map((word) => word.word).join(' ')), `transcribed text differs from spoken script: ${id}`);
};

export const assertWordIntervals = (words: MeasuredWord[], duration: number, fps: number, id: string) => {
	requireValue(words.length > 0, `measured words missing: ${id}`);
	for (const [index, word] of words.entries()) requireValue(nonempty(word.word) && Number.isFinite(word.start) && Number.isFinite(word.end) && word.start >= (index ? words[index - 1].end : 0) && word.end > word.start && word.end <= duration + 1 / fps, `invalid measured word interval: ${id}`);
};

export const measuredCueTime = (words: MeasuredWord[], phrase: string) => {
	const normalize = normalizedSpeech;
	const tokens = words.map((word) => normalize(word.word));
	const index = tokens.join('').indexOf(normalize(phrase));
	requireValue(nonempty(phrase) && index >= 0, `measured transcript has no cue: ${phrase}`);
	let offset = 0;
	for (let i = 0; i < words.length; i++) {
		if (index < offset + tokens[i].length) return words[i].start;
		offset += tokens[i].length;
	}
	throw new Error(`CLN V4: unresolved measured cue: ${phrase}`);
};

export const assertMeasuredNarration = (timing: NarrationManifest, measured: MeasuredNarration) => {
	requireValue(measured.schemaVersion === 1 && ['openai-whisper-1', 'local-faster-whisper', 'whisper-mixed'].includes(measured.provider) && measured.fps === timing.fps && measured.totalFrames === timing.totalFrames && measured.masterSha256 === timing.audio?.sha256, 'measured transcript must identify this exact mastered audio and timeline');
	const beats = timing.beats.filter((beat) => beat.narration);
	requireValue(measured.clips.length === beats.length, 'measured narration must cover every spoken beat');
	for (const [i, clip] of measured.clips.entries()) {
		const beat = beats[i];
		requireValue(clip.id === beat.id && clip.script === beat.narration, `measured script mismatch: ${beat.id}`);
		for (const file of [clip.audio, clip.receipt, clip.transcript]) assertFileIdentity(file);
		requireValue(Number.isInteger(clip.clipStartFrame) && clip.clipStartFrame >= 0 && Number.isFinite(clip.durationSeconds) && clip.durationSeconds > 0 && clip.clipStartFrame + Math.ceil(clip.durationSeconds * timing.fps) <= beat.durationInFrames, `measured clip outside beat: ${beat.id}`);
		requireValue(clip.words.length > 0, `measured words missing: ${beat.id}`);
		assertTranscriptText(beat.narration, clip.words, beat.id);
		assertWordIntervals(clip.words, clip.durationSeconds, timing.fps, beat.id);
		const from = clip.clipStartFrame + Math.floor(clip.words[0].start * timing.fps);
		const to = clip.clipStartFrame + Math.ceil(clip.words.at(-1)!.end * timing.fps);
		requireValue(beat.voiceFromFrame === from && beat.voiceToFrame === to, `voice interval must follow measured words: ${beat.id}`);
		for (const [cue, frame] of [[beat.cueWords.emphasis, beat.emphasisAtFrame], [beat.cueWords.focus, beat.focusAtFrame]] as const) requireValue(frame === clip.clipStartFrame + Math.floor(measuredCueTime(clip.words, cue) * timing.fps), `visual cue must follow measured words: ${beat.id}`);
		for (let index = 1; index < beat.proofs.length; index++) requireValue(beat.proofFromFrames[index] === clip.clipStartFrame + Math.floor(measuredCueTime(clip.words, beat.proofCueWords[index]) * timing.fps), `evidence cut must follow measured words: ${beat.id}`);
	}
};

export const assertFinalReady = (manifest: CaptureManifest, timing: NarrationManifest) => {
	assertCaptureManifest(manifest);
	assertNarrationManifest(timing);
	const missing = getMissingCaptures(manifest);
	const blockers = missing.map((item) => `${item.title}: ${item.proofs.join(', ')}`);
	if (timing.audioStatus !== 'approved-recording' || timing.timingStatus !== 'measured-transcript' || !timing.audio?.transcript || !timing.wordTimingVerified || !nonempty(timing.narrationApprovalRef)) blockers.push('fresh approved narration and measured word-aligned timing');
	requireValue(blockers.length === 0, `FINAL RENDER REFUSED\n${blockers.join('\n')}\nUse CleaningVerificationTutorialV4-INTERNAL-PREVIEW.`);
	// Several measured cues can hold one genuine image continuously. Missing
	// assets must refuse first, before those cues are treated as separate views.
	assertEvidenceTiming(manifest, timing);
};

export const assertFileBytes = (file: FileIdentity, bytes: Uint8Array, sha256: string) => {
	requireValue(bytes.byteLength === file.bytes, `byte size mismatch: ${file.path}`);
	requireValue(sha256 === file.sha256, `SHA-256 mismatch: ${file.path}`);
};

export const assertPngBytes = (capture: Capture, bytes: Uint8Array) => {
	const signature = [137, 80, 78, 71, 13, 10, 26, 10];
	requireValue(bytes.length >= 33 && signature.every((value, index) => bytes[index] === value), `not a PNG: ${capture.path}`);
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	requireValue(view.getUint32(8) === 13 && view.getUint32(12) === 0x49484452 && view.getUint32(16) === capture.width && view.getUint32(20) === capture.height, `PNG dimensions/IHDR mismatch: ${capture.path}`);
	requireValue(bytes[24] === 8 && [2, 6].includes(bytes[25]) && bytes[28] === 0, `expected 8-bit non-interlaced RGB/RGBA PNG: ${capture.path}`);
};

export const verifyAssetFiles = async (
	manifest: CaptureManifest,
	timing: NarrationManifest,
	read: (path: string) => Promise<Uint8Array>,
	digest: (bytes: Uint8Array) => Promise<string>,
) => {
	assertCaptureManifest(manifest);
	assertNarrationManifest(timing);
	assertEvidenceTiming(manifest, timing);
	await Promise.all(manifest.slots.flatMap((slot) => slot.captures).map(async (capture) => {
		const bytes = await read(capture.path);
		assertFileBytes(capture, bytes, await digest(bytes));
		assertPngBytes(capture, bytes);
	}));
	if (timing.audio) {
		const bytes = await read(timing.audio.path);
		assertFileBytes(timing.audio, bytes, await digest(bytes));
		if (timing.audio.transcript) {
			const file = timing.audio.transcript;
			const raw = await read(file.path);
			assertFileBytes(file, raw, await digest(raw));
			const measured = JSON.parse(new TextDecoder().decode(raw)) as MeasuredNarration;
			assertMeasuredNarration(timing, measured);
			await Promise.all(measured.clips.map(async (clip) => {
				const assets = await Promise.all([clip.audio, clip.receipt, clip.transcript].map(async (item) => {
					const data = await read(item.path); assertFileBytes(item, data, await digest(data)); return data;
				}));
				const receipt = JSON.parse(new TextDecoder().decode(assets[1]));
				const transcript = JSON.parse(new TextDecoder().decode(assets[2]));
				requireValue(receipt.voiceId === 'gYWKdgLtqjPO3D5uDrDP' && receipt.request.text === clip.script && receipt.audio.sha256 === clip.audio.sha256, `series voice/script provenance mismatch: ${clip.id}`);
				requireValue(transcript.audioSha256 === clip.audio.sha256 && JSON.stringify(transcript.response.words) === JSON.stringify(clip.words), `measured words must match persisted Whisper response: ${clip.id}`);
				const provider = clip.transcriptionProvider ?? 'OpenAI';
				requireValue(['OpenAI', 'local-faster-whisper'].includes(provider) && (transcript.transcription?.provider ?? 'OpenAI') === provider, `transcription provider mismatch: ${clip.id}`);
				if (provider === 'local-faster-whisper') {
					const local = transcript.transcription;
					requireValue(local.model === 'Systran/faster-whisper-small' && nonempty(local.modelRevision) && nonempty(local.versions?.['faster-whisper']) && nonempty(local.versions?.ctranslate2) && local.localFilesOnly === true && local.device === 'cpu' && ['int8', 'float32'].includes(local.computeType) && local.settings?.word_timestamps === true && local.settings?.temperature === 0, `local Whisper provenance required: ${clip.id}`);
					for (const name of ['model.bin', 'config.json', 'tokenizer.json', 'vocabulary.txt']) requireValue(local.modelFiles?.some((file: { name: string; bytes: number; sha256: string }) => file.name === name && file.bytes > 0 && /^[a-f0-9]{64}$/.test(file.sha256)), `local Whisper model identity required: ${clip.id}/${name}`);
				}
				requireValue(measured.provider === 'whisper-mixed' || measured.provider === (provider === 'OpenAI' ? 'openai-whisper-1' : provider), `master transcription provider mismatch: ${clip.id}`);
			}));
		}
	}
};
