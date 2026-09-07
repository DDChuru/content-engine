import baseline from './captures.json';
import planned from './narration.json';
import audit from './source-audit.json';
import { SIMULATION_BADGE } from './candidate-presentation';
import {
	APP_COMMIT, SITE_ID, REQUIREMENTS, REQUIRED_CLAIMS, assertRect, assertFileBytes,
	assertPng, buildTimeline, verifyAssets, type Capture, type CaptureManifest,
	type FileIdentity, type NarrationManifest,
} from './contract';

export const CANDIDATE_ID = 'RemedialActionTutorial-REVIEW-CANDIDATE-V2';
export const CANDIDATE_REQUIREMENTS = {
	...REQUIREMENTS,
	// Daniel's v2 entry replaces the earlier Cleaning Verification detour.
	'cleaning-baseline': ['home', 'bill'],
	// Explicit evidence-limited treatment authorized in the build instruction.
	// This is real same-day evidence, never an alias for the absent later-day view.
	'inspection-carryover': ['bill-row', 'followups', 'verify-open', 'age-current'],
};
export type Candidate = {
	schemaVersion: number; status: string;
	approvals: { daniel: null; independentReview: null };
	evidenceRegister: FileIdentity;
	captures: Capture[];
	bindings: Record<string, { captureId: string; view: string }>;
	narration: { clips: { id: string; audio: FileIdentity; receipt: FileIdentity; transcript: FileIdentity; durationSeconds: number; fromFrame: number; wordCount: number }[]; master: FileIdentity; transcript: FileIdentity; cueAlignment: FileIdentity };
	music: FileIdentity & { volume: number };
	stateEvidence: FileIdentity[]; supportingSetup: FileIdentity[];
	limitations: Record<string, string>;
};
const check = (condition: unknown, message: string): void => { if (!condition) throw new Error(`REMEDIAL CANDIDATE: ${message}`); };
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
export const candidatePayload = (candidate: Candidate, narration: NarrationManifest) => JSON.stringify({ candidate, narration });
export const CANDIDATE_SHA256 = '9ca4d93fa6e19711cbfb2c91d9a648ae444dcc45440a69552ec63e493233738e';
export const EVIDENCE_SHA256 = '4168799073d974273d99c0aafe9e63f3c3c08c19763f5aea968a44bc4406e04d';

export const candidateCaptures = (candidate: Candidate): CaptureManifest => {
	const data = structuredClone(baseline) as unknown as CaptureManifest;
	data.captures.push(...candidate.captures);
	data.slots['inspection-carryover'] = { 'bill-row': null, followups: null, 'verify-open': null, 'age-current': null };
	for (const [key, ref] of Object.entries(candidate.bindings)) {
		const [slot, proof] = key.split('/');
		check(data.slots[slot] && Object.hasOwn(data.slots[slot], proof), `unknown evidence binding ${key}`);
		data.slots[slot][proof] = ref;
	}
	return data;
};

export const assertCandidateReady = (candidate: Candidate, narration: NarrationManifest) => {
	check(candidate.schemaVersion === 1 && candidate.status === 'review-candidate-unapproved', 'unapproved review status required');
	check(candidate.approvals.daniel === null && candidate.approvals.independentReview === null, 'approval cannot be inferred by the builder');
	check(candidate.evidenceRegister.sha256 === EVIDENCE_SHA256, 'independent evidence register identity changed');
	check(candidate.captures.length === 20 && new Set(candidate.captures.map((c) => c.id)).size === 20, 'twenty authentic new views required');
	check(Object.keys(candidate.bindings).length === 20, 'complete new evidence bindings required');
	for (const capture of candidate.captures) {
		check(capture.siteId === SITE_ID && capture.site === 'Bakery Demo' && capture.account === 'demo@sunbakebread.co.za', 'Bakery Demo identity guard');
		check(capture.appCommit === APP_COMMIT && capture.uncomposed && capture.width === 720 && capture.height === 1600, 'uncomposed current-app screenshot required');
		check(capture.path.startsWith('remedial-tutorial/inspection/') && !capture.path.includes('..'), 'capture path guard');
		check(capture.captureMethod === 'unmodified adb exec-out screencap -p', 'genuine capture method required');
		check(Number.isFinite(Date.parse(capture.capturedOn)) && capture.eventOrder > 0, 'real chronology required');
		check(capture.trail === (capture.eventOrder === 1 ? 'cleaning' : 'inspection'), 'evidence trail cannot be relabelled');
		if (capture.trail === 'inspection') check(/simulated inspection and work/.test(capture.disclosure) && /Android camera test scene/.test(capture.disclosure), 'camera and simulated-work disclosure required');
		for (const rect of Object.values(capture.views)) if (rect) assertRect(rect);
	}
	const merged = candidateCaptures(candidate);
	for (const [slot, proofs] of Object.entries(CANDIDATE_REQUIREMENTS)) for (const proof of proofs) {
		const ref = merged.slots[slot]?.[proof];
		check(ref, `missing authentic evidence ${slot}/${proof}`);
		const capture = merged.captures.find((c) => c.id === ref?.captureId);
		check(capture && Object.hasOwn(capture.views, ref!.view), `missing capture/view ${slot}/${proof}`);
	}
	const order = ['intro', 'home-entry', 'bill-components', ...planned.beats.map((b) => b.id).filter((id) => !['intro', 'home-entry', 'bill-components', 'earlier-baseline'].includes(id))];
	check(narration.beats.length === 23 && same(narration.beats.map((b) => b.id), order), 'Home banner first, Bill of Health second; no early due-check detour');
	check(narration.beats.every((b) => b.kind === planned.beats.find((p) => p.id === b.id)?.kind), 'original scene kinds required');
	const home = narration.beats[1], bill = narration.beats[2];
	check(home.slot === 'cleaning-baseline' && home.cues.length === 1 && home.cues[0].proof === 'home' && same(home.cues[0].detail, { x: .045, y: .03, w: .91, h: .101 }), 'genuine Home follow-up banner must be emphasized');
	check(home.narration.includes('Remedial actions awaiting follow-up banner') && home.narration.includes('open Follow-ups'), 'Home banner entry instruction required');
	check(bill.slot === 'cleaning-baseline' && same(bill.cues.map((c) => c.proof), ['home', 'bill']) && bill.cues[0].detail === null && same(bill.cues[1].detail, { x: .043, y: .593, w: .914, h: .102 }), 'genuine Home Bill tile then Remedial row required');
	check(bill.emphasisAtFrame >= bill.cues[1].focusAtFrame, 'Bill component counts must wait for the Remedial row');
	check(bill.narration.includes('then select the Remedial row') && bill.narration.includes('not a Cleaning-only count'), 'Bill entry and mixed-count distinction required');
	check(SIMULATION_BADGE.text === 'SIMULATION' && SIMULATION_BADGE.width === 300 && SIMULATION_BADGE.height === 56 && SIMULATION_BADGE.top === 28 && SIMULATION_BADGE.right === 28 && SIMULATION_BADGE.background === '#FFD348', 'requested simulation badge required');
	check(narration.fps === 30 && narration.width === 1920 && narration.height === 1080, '1920×1080/30 required');
	check(narration.timingStatus === 'measured-recordings' && narration.audioStatus === 'generated-measured' && narration.wordTimingVerified && narration.narrationApprovalRef === null, 'measured narration without invented approval required');
	check(same(narration.audio, candidate.narration.master) && same(narration.measuredTranscript, candidate.narration.transcript), 'master/transcript identity differs');
	const timeline = buildTimeline(narration.beats);
	check(timeline.totalFrames === narration.totalFrames, 'duration math differs');
	const coverage = new Set<string>(), claims = new Set<string>();
	for (const [index, beat] of narration.beats.entries()) {
		const copy = [beat.chapter, beat.headline, beat.body, beat.emphasis, beat.note, beat.narration].join(' ');
		check(!/simulat|emulator|android|test[ -]?scene|\bdemo\b|source.backed|source explanation|runtime audit|aged (?:record|inspection)|later.day comparison|review candidate|not approved|baseline|genuine capture|production/i.test(copy), `production commentary must remain internal: ${beat.id}`);
		check(beat.note === '', 'editorial notes remain in provenance, outside the instructional composition');
		check(beat.from === timeline.entries[index].from && beat.overlapFromPrevious === 0, 'hard-cut timeline coverage required');
		if (beat.narration) {
			const clip = candidate.narration.clips.find((c) => c.id === beat.id);
			check(clip && clip.fromFrame === beat.from + beat.voiceFromFrame && Math.ceil(clip.durationSeconds * 30) + beat.voiceFromFrame === beat.voiceToFrame, `recorded speech timing differs ${beat.id}`);
			check(beat.voiceToFrame + 29 <= beat.durationInFrames && beat.voiceFromFrame === 18, `speech truncation/gap ${beat.id}`);
			check(beat.emphasisAtFrame >= beat.voiceFromFrame && beat.emphasisAtFrame + 12 < beat.voiceToFrame, 'emphasis outside narration');
		} else check(beat.kind === 'intro' || beat.kind === 'outro', 'missing narration');
		for (const [i, cue] of beat.cues.entries()) {
			check(beat.slot && CANDIDATE_REQUIREMENTS[beat.slot as keyof typeof CANDIDATE_REQUIREMENTS]?.includes(cue.proof), 'unknown candidate cue');
			check((i !== 0 || cue.fromFrame === 0) && (beat.cues[i + 1]?.fromFrame ?? beat.durationInFrames) - cue.fromFrame >= 60, `short or missing evidence hold ${beat.id}`);
			check(cue.focusAtFrame >= cue.fromFrame && cue.focusAtFrame + 12 < (beat.cues[i + 1]?.fromFrame ?? beat.durationInFrames), 'focus crosses hard cut');
			coverage.add(`${beat.slot}/${cue.proof}`);
		}
		for (const claim of beat.claimIds) { check((REQUIRED_CLAIMS as readonly string[]).includes(claim), 'unregistered product claim'); claims.add(claim); }
	}
	for (const [slot, proofs] of Object.entries(CANDIDATE_REQUIREMENTS)) for (const proof of proofs) check(coverage.has(`${slot}/${proof}`), `required evidence omitted ${slot}/${proof}`);
	for (const claim of REQUIRED_CLAIMS) check(claims.has(claim), `product boundary omitted ${claim}`);
	const carry = narration.beats.find((b) => b.id === 'inspection-carryover')!;
	check(carry.narration.includes('remain in the queue across inspection dates and statuses') && carry.narration.includes('until their own decision closes or escalates them'), 'actual carry-over rule required');
	check(!/filmed|days later|aged footage|backdat|automatic(?:ally)? closes/i.test(carry.narration), 'no invented filmed ageing or automatic closure');
	check(candidate.limitations.laterDay.includes('no later-day comparison') && candidate.limitations.camera.includes('No physical presence'), 'internal factual limitations must be retained');
	check(candidate.narration.clips.length === 21 && candidate.music.sha256 === 'f1928a7b68b79b89c843af517583ddc636773e8c4a354e3b610d42611962d186', 'established narration/bookend music required');
};

export const candidateFiles = (candidate: Candidate) => [candidate.evidenceRegister, ...candidate.captures, ...candidate.stateEvidence, ...candidate.supportingSetup, candidate.music, candidate.narration.master, candidate.narration.transcript, candidate.narration.cueAlignment, ...candidate.narration.clips.flatMap((c) => [c.audio, c.receipt, c.transcript])];
export const verifyCandidateAssets = async (candidate: Candidate, narration: NarrationManifest, read: (path: string) => Promise<Uint8Array>, digest: (bytes: Uint8Array) => Promise<string>) => {
	// Original source/copy/evidence guards run unchanged, including Cleaning provenance.
	await verifyAssets(baseline as unknown as CaptureManifest, planned as NarrationManifest, audit, read, digest);
	assertCandidateReady(candidate, narration);
	check(await digest(new TextEncoder().encode(candidatePayload(candidate, narration))) === CANDIDATE_SHA256, 'audited candidate declarations changed');
	const bytes = new Map<string, Uint8Array>();
	await Promise.all(candidateFiles(candidate).map(async (file) => {
		check(!file.path.includes('..') && !file.path.startsWith('/'), 'unsafe public asset path');
		const data = await read(file.path); assertFileBytes(file, data, await digest(data)); bytes.set(file.path, data);
	}));
	const parse = (file: FileIdentity) => JSON.parse(new TextDecoder().decode(bytes.get(file.path)!));
	const register = parse(candidate.evidenceRegister);
	check(same(register.captures, candidate.captures) && same(register.bindings, candidate.bindings) && same(register.limitations, candidate.limitations), 'capture provenance or factual limits differ from independent register');
	for (const capture of candidate.captures) assertPng(capture, bytes.get(capture.path)!);
	for (const clip of candidate.narration.clips) {
		const receipt = parse(clip.receipt), transcript = parse(clip.transcript);
		check(receipt.voiceId === 'gYWKdgLtqjPO3D5uDrDP' && receipt.request.model_id === 'eleven_multilingual_v2', 'established voice/model required');
		check(receipt.request.text === narration.beats.find((b) => b.id === clip.id)?.narration && (['path', 'bytes', 'sha256'] as const).every((key) => receipt.audio[key] === clip.audio[key]), 'narration request/audio mismatch');
		check(transcript.audioSha256 === clip.audio.sha256 && transcript.words.length === clip.wordCount && clip.wordCount > 0, 'measured words must match audio');
		let last = 0;
		for (const word of transcript.words) { check(Number.isFinite(word.start) && word.start >= last - 0.02 && word.end >= word.start && word.end <= clip.durationSeconds + 0.05, 'invalid measured word time'); last = word.end; }
	}
	const state = (suffix: string) => parse(candidate.stateEvidence.find((f) => f.path.endsWith(`candidate-${suffix}.json`))!);
	const identity = state('actor-identity').rows[0];
	check(identity.email === 'demo@sunbakebread.co.za' && identity.role === 'site_admin' && same(identity.siteIds, [SITE_ID]), 'actual authenticated actor scope required');
	const open = state('server-abc-open').rows;
	check(open.length === 3 && open.every((r: { status: string }) => r.status === 'open'), 'three distinct open cases required');
	const inspections = state('inspection-details-final').rows;
	check(inspections.length === 2 && inspections.every((r: { siteId: string; status: string }) => r.siteId === SITE_ID && r.status === 'issued'), 'issued Bakery Demo inspections required');
	const findings = inspections.flatMap((r: { findings: unknown[] }) => r.findings);
	const [a, b, c] = ['A', 'B', 'C'].map((label) => findings.find((f: { description: string }) => f.description.startsWith(`Demo ${label} -`)));
	check(a.status === 'closed' && a.verificationDecision === 'accepted' && a.afterPhotoStorageId && a.annotatedAfterPhotoStorageId && a.remedialAction.includes('simulated correction'), 'A acceptance and after evidence must persist');
	check(b.status === 'open' && b.verificationDecision === 'rejected' && b.verificationHistory[0].comment.includes('Training only'), 'B rejection must remain open');
	check(c.status === 'escalated' && c.ncrId === 'rx77bgfv0767hcze58sn8csxgx8dy0tt' && c.verificationHistory[0].comment === 'NCR-2026-00044', 'C explicit NCR linkage required');
	for (const f of [a, b, c]) {
		const initial = open.find((r: { findingId: string }) => r.findingId === f.id);
		check(initial && initial.createdAt === f.createdAt && f.verificationHistory[0].at > f.createdAt && f.verificationHistory[0].by === identity._id, 'actor/time/finding identity changed');
	}
};
