/** Browser and Node share this contract. Hashes bind reviewed declarations to
 * actual bytes; a label such as "genuine" is never sufficient by itself. */
export type FileIdentity = { path: string; sha256: string; bytes: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type Capture = FileIdentity & {
	id: string;
	trail: 'cleaning' | 'inspection';
	siteId: string;
	width: number;
	height: number;
	uncomposed: boolean;
	classification: string;
	appCommit: string;
	capturedOn: string;
	machine: string;
	site: string;
	account: string;
	captureMethod: string;
	authorizationRef: string;
	reviewRef: string;
	recordRef?: string;
	scenario: string;
	eventOrder: number;
	disclosure: string;
	evidenceNote?: string;
	observed?: Record<string, unknown>;
	views: Record<string, Rect | null>;
	origin: { worktree: string; head: string; sourcePath: string; sourceSlot: string; manifest: string; register: string };
};
export type EvidenceRef = { captureId: string; view: string };
export type CaptureManifest = {
	schemaVersion: number;
	register: string;
	siteId: string;
	storyboard: FileIdentity;
	provenance: FileIdentity[];
	brandAssets: FileIdentity[];
	captures: Capture[];
	slots: Record<string, Record<string, EvidenceRef | null>>;
};
export type Beat = {
	id: string;
	kind: 'intro' | 'outro' | 'screen' | 'diagram' | 'age';
	chapter: string;
	headline: string;
	body: string;
	emphasis: string;
	narration: string;
	claimIds: string[];
	note: string;
	slot: string | null;
	cues: { proof: string; fromFrame: number; focusAtFrame: number; detail: Rect | null }[];
	durationInFrames: number;
	overlapFromPrevious: number;
	from: number;
	voiceFromFrame: number;
	voiceToFrame: number;
	emphasisAtFrame: number;
};
export type NarrationManifest = {
	schemaVersion: number; fps: number; width: number; height: number;
	totalFrames: number; timingStatus: string; audioStatus: string;
	audio: FileIdentity | null; measuredTranscript: FileIdentity | null;
	wordTimingVerified: boolean; narrationApprovalRef: string | null;
	beats: Beat[];
};
export type SourceAudit = {
	schemaVersion: number;
	mobileHead: string;
	backendReference: string;
	deploymentVerified: boolean;
	claims: Record<string, { statement: string; references: string[] }>;
};

export const SITE_ID = 'k57ae8hn0kgercz41hgy6s03mn88fzwd';
export const FORBIDDEN_SITE_ID = 'k578brxxgh6qh6b6wgf337f2w5875aah';
export const APP_COMMIT = '6999d8eca52fc4f4fff69066dce365f54a609663';
export const STORYBOARD_SHA256 = 'd0d4490b7a571b99874867702266eb3e3d7f3bfa35b223f032df87f8a2a900ff';
export const PREVIEW_ID = 'RemedialActionTutorial-INTERNAL-PREVIEW';
export const FINAL_ID = 'RemedialActionTutorial';
export const EXPLANATORY_LABEL = 'explanatory graphic — not an app screen';

// Independent coverage requirements cannot be removed by deleting a JSON slot,
// declaring it complete, or reclassifying a Cleaning PNG as Inspection evidence.
export const REQUIREMENTS: Record<string, readonly string[]> = {
	'cleaning-baseline': ['home', 'bill', 'summary'],
	'cleaning-capture': ['fields', 'recorded'],
	'cleaning-open': ['summary'],
	'cleaning-followup': ['bucket-cleaning', 'card', 'expand', 'confirm', 'removed'],
	'cleaning-resolved': ['summary', 'item'],
	'cleaning-critical': ['ncr'],
	'inspection-capture': ['form', 'local-saved', 'complete-issued', 'server-open'],
	'inspection-carryover': ['bill-row', 'followups', 'verify-open', 'later-day'],
	'inspection-review': ['before-detail', 'after-required-alert', 'after-attached'],
	'inspection-accept': ['accept-control', 'closed-accepted'],
	'inspection-reject': ['reject-confirm', 'returned-open'],
	'inspection-ncr': ['escalate-dialog', 'escalated-linked'],
	'inspection-history': ['closed-history', 'bill-after'],
};

export const REQUIRED_CLAIMS = [
	'cleaning-occurrence', 'demo-disclosure', 'baseline-context', 'cleaning-fields',
	'cleaning-queue', 'bill-components', 'human-recheck', 'cleaning-verification',
	'cleaning-audit', 'no-assignment', 'critical-ncr', 'inspection-creation',
	'inspection-persistence', 'inspection-age', 'inspection-evidence',
	'inspection-accept', 'inspection-reject', 'inspection-ncr', 'inspection-history',
] as const;

const APPROVED_CLEANING: Record<string, string> = {
	home: 'a05e7eac47e81a2277803ca9176cc2da63e4be205d455747f57fcac1e6376714',
	bill: '57c737d81d71cfd5b294ea0acb9412e90391791c8bb7930600d68c92a461ce0e',
	baseline: '720154a539390662e8ded098c2c0ecf2a0fecc1d48a1dcf594341cf60813564a',
	'major-fields': '25196a2b2f77020135b5efb21fe3f316c2e9b4df2adf44f76a81d1cf6f475eb9',
	'major-recorded': 'dbfbf8209296f3126bb8ec69460c91a3417b03b4850729a75ea6d602c55ba7d7',
	'critical-ncr': 'bff05b336a0b06fca864c3ce351258db3fa16bd50c56866adfa43dbf9830a60c',
	'open-summary': 'e492017102a9a0221d1dbc43434cdeaf5ec4408435eab38a6941cb1de73be0ce',
	'open-card': '3a8e6c92435cf0b2392d9a81383db5830dd14186a66bc540f922b110ef82ce14',
	'confirm-note': '12bdde3109384cbf840bbd08a4e7f092cdfa6e11aae19786add676a4cfb7d729',
	'queue-empty': 'cde5cc5cb8cb735d13c31603a6ac7fd9d8ee269a26d8fa5a26a2ac12a8a34640',
	'resolved-summary': 'dfe081534596f143b10368bcf5f90729555334d49077a79dc27471b911e2194c',
	'resolved-item': 'b374e795b9baadd3a6ae79f54f0fbc1d32807c92031752e7b5c287a383fb4e87',
};
const SOURCE_SNAPSHOTS: Record<string, string> = {
	'remedial-tutorial/provenance/cleaning-v4-captures.json': '96aa3c3a8a3d151b0fb6d425b5acabce767feb4eb00d29ab027b15f120d4d935',
	'remedial-tutorial/provenance/cleaning-v4-register.md': '0ad3895348a60da5c895478017c9440ef4ac86cc709ee007bc8dfecde34eb39f',
};
const BRAND_HASHES: Record<string, string> = {
	'images/ewizer-logo.png': '7ab3dcf75f9b8d66a6caf947abc4a63782812c6d568f8c1207e71fc327b4ced6',
	'images/ecowize-logo.webp': 'f7401f888d9b55e4b8ccb80aaf4f20a712abfab04ce83c5208cf8ddaa0362555',
	'ccv-tutorial/fonts/BarlowCondensed_700Bold.ttf': '53550669f93c07de6221e051905462f862066459eb50148268b5628104a58a30',
	'ccv-tutorial/fonts/DMSans_400Regular.ttf': '20ccb90498d8ca511bb0be31a74eccd5f29fbe1161852ef72781b703929e98ec',
	'ccv-tutorial/fonts/DMSans_700Bold.ttf': '3764a2ce62fa95596c3315c1a0ca379e7cf827ed397c97fc036925b9b20b74dc',
};
const CLEANING_BINDINGS: Record<string, readonly [string, string]> = {
	'cleaning-baseline/home': ['home', 'entry'],
	'cleaning-baseline/bill': ['bill', 'entry'],
	'cleaning-baseline/summary': ['baseline', 'baseline'],
	'cleaning-capture/fields': ['major-fields', 'grade-reason'],
	'cleaning-capture/recorded': ['major-recorded', 'recorded'],
	'cleaning-open/summary': ['open-summary', 'follow-up-owed'],
	'cleaning-followup/card': ['open-card', 'queue'],
	'cleaning-followup/expand': ['open-card', 'confirm-followed-up'],
	'cleaning-followup/confirm': ['confirm-note', 'confirmation'],
	'cleaning-followup/removed': ['queue-empty', 'closed-result'],
	'cleaning-resolved/summary': ['resolved-summary', 'still-to-do'],
	'cleaning-resolved/item': ['resolved-item', 'resolved-today'],
	'cleaning-critical/ncr': ['critical-ncr', 'ncr-queued'],
};

// All displayed/spoken copy is source-checked and fingerprinted, including
// negations and disclosures. Changing this fingerprint requires a copy audit;
// the checksum is NOT a product approver's sign-off or final release approval.
const COPY_SHA256 = 'bdc74e4eb607edc764f19bd933adbf4584b79a9b5f132aa52a295d36ac69802f';
export const copyPayload = (timing: NarrationManifest) => JSON.stringify(timing.beats.map((beat) => [
	beat.id, beat.kind, beat.chapter, beat.headline, beat.body, beat.emphasis, beat.narration, beat.note, beat.claimIds,
]));

const requireValue = (condition: unknown, message: string): void => {
	if (!condition) throw new Error(`REMEDIAL: ${message}`);
};
const text = (value: unknown) => typeof value === 'string' && value.trim().length > 0;
const sameKeys = (object: object, keys: readonly string[]) =>
	JSON.stringify(Object.keys(object).sort()) === JSON.stringify([...keys].sort());
export const assertRect = (rect: Rect) => requireValue(
	[rect.x, rect.y, rect.w, rect.h].every(Number.isFinite) && rect.x >= 0 && rect.y >= 0 && rect.w > 0 && rect.h > 0 && rect.x + rect.w <= 1 && rect.y + rect.h <= 1,
	'crop must remain inside the genuine image',
);
export const assertFileIdentity = (file: FileIdentity) => {
	requireValue(/^(remedial-tutorial\/[a-zA-Z0-9/_-]+\.(png|json|md)|images\/(ewizer-logo\.png|ecowize-logo\.webp)|ccv-tutorial\/fonts\/[a-zA-Z0-9_]+\.ttf)$/.test(file.path), `unsafe asset path: ${file.path}`);
	requireValue(/^[a-f0-9]{64}$/.test(file.sha256) && Number.isInteger(file.bytes) && file.bytes > 0, `file identity required: ${file.path}`);
};

export const assertCaptureManifest = (manifest: CaptureManifest) => {
	requireValue(manifest.schemaVersion === 1 && manifest.siteId === SITE_ID, 'Bakery Demo site guard');
	requireValue(sameKeys(manifest.slots, Object.keys(REQUIREMENTS)), 'required evidence slot removed or unknown slot');
	requireValue(manifest.storyboard.sha256 === STORYBOARD_SHA256 && manifest.storyboard.path === 'remedial-tutorial/provenance/approved-storyboard.md', 'approved storyboard identity changed');
	requireValue(manifest.provenance.length === 2 && new Set(manifest.provenance.map((file) => file.path)).size === 2, 'both independent provenance snapshots required');
	for (const file of manifest.provenance) requireValue(file.sha256 === SOURCE_SNAPSHOTS[file.path], 'independent source provenance hash mismatch');
	requireValue(manifest.brandAssets.length === 5 && new Set(manifest.brandAssets.map((file) => file.path)).size === 5, 'all shared brand assets must be verified');
	for (const file of manifest.brandAssets) requireValue(file.sha256 === BRAND_HASHES[file.path], 'shared brand asset identity changed');
	const identities = [...manifest.provenance, manifest.storyboard, ...manifest.brandAssets, ...manifest.captures];
	for (const file of identities) assertFileIdentity(file);
	requireValue(new Set(identities.map((file) => file.path)).size === identities.length, 'duplicate asset path');
	requireValue(manifest.captures.length === 12 && new Set(manifest.captures.map((capture) => capture.id)).size === 12, 'twelve approved Cleaning source captures required');
	for (const capture of manifest.captures) {
		requireValue(capture.sha256 === APPROVED_CLEANING[capture.id], `unregistered Cleaning evidence: ${capture.id}`);
		requireValue(capture.trail === 'cleaning' && capture.siteId === SITE_ID && capture.site === 'Bakery Demo', 'Cleaning evidence cannot be relabelled as Inspection or another site');
		requireValue(capture.uncomposed === true && capture.width === 720 && capture.height === 1600 && capture.appCommit === APP_COMMIT, 'uncomposed source PNG at approved app revision required');
		requireValue(capture.path === `remedial-tutorial/cleaning/${capture.origin.sourcePath.split('/').at(-1)}`, 'exact source filename must be preserved');
		requireValue(capture.origin.worktree === '/home/durai/Documents/projects/content-engine-cleaning-v4' && capture.origin.head === 'd85e4c921373c2c551ebc1897a6a5cb926417086', 'source worktree provenance required');
		requireValue(sameKeys(SOURCE_SNAPSHOTS, [capture.origin.manifest, capture.origin.register]), 'source snapshot references required');
		for (const key of ['capturedOn', 'machine', 'account', 'captureMethod', 'authorizationRef', 'reviewRef', 'scenario', 'disclosure'] as const) requireValue(text(capture[key]), `${key} provenance required`);
		requireValue(Number.isFinite(Date.parse(capture.capturedOn)), 'capture date required');
		if (capture.eventOrder > 0) {
			requireValue(capture.classification === 'authorized-seeded-demonstration' && /authorized seeded demonstration record/.test(capture.disclosure) && /simulated inspection and work/.test(capture.disclosure), 'synthetic-work disclosure required');
			requireValue(text(capture.recordRef), 'persisted record reference required');
		} else requireValue(capture.classification === 'genuine-current-app', 'baseline classification required');
		for (const rect of Object.values(capture.views)) if (rect) assertRect(rect);
	}
	for (const [slot, proofs] of Object.entries(REQUIREMENTS)) {
		requireValue(sameKeys(manifest.slots[slot], proofs), `required evidence view removed: ${slot}`);
		for (const proof of proofs) {
			const ref = manifest.slots[slot][proof];
			if (!ref) continue;
			const expected = CLEANING_BINDINGS[`${slot}/${proof}`];
			requireValue(expected && expected[0] === ref.captureId && expected[1] === ref.view, `missing authentic evidence cannot use an alias: ${slot}/${proof}`);
			const capture = manifest.captures.find((item) => item.id === ref.captureId);
			requireValue(capture && Object.hasOwn(capture.views, ref.view), `capture/view absent: ${slot}/${proof}`);
		}
	}
};

export const getMissingEvidence = (manifest: CaptureManifest) => Object.entries(REQUIREMENTS).flatMap(([slot, proofs]) =>
	proofs.filter((proof) => !manifest.slots[slot]?.[proof]).map((proof) => `${slot}/${proof}`),
);

export const buildTimeline = (beats: Pick<Beat, 'durationInFrames' | 'overlapFromPrevious'>[]) => {
	let end = 0;
	const entries = beats.map((beat, index) => {
		requireValue(Number.isInteger(beat.durationInFrames) && beat.durationInFrames > 0, 'positive integer duration required');
		requireValue(Number.isInteger(beat.overlapFromPrevious) && beat.overlapFromPrevious >= 0 && beat.overlapFromPrevious < beat.durationInFrames && (index ? beat.overlapFromPrevious < beats[index - 1].durationInFrames : beat.overlapFromPrevious === 0), 'invalid transition overlap');
		const from = end - beat.overlapFromPrevious;
		end = from + beat.durationInFrames;
		return { from, durationInFrames: beat.durationInFrames };
	});
	return { entries, totalFrames: end };
};

export const assertNarrationManifest = (timing: NarrationManifest) => {
	requireValue(timing.schemaVersion === 1 && timing.fps === 30 && timing.width === 1920 && timing.height === 1080, 'format must be 1920×1080 / 30 fps');
	requireValue(timing.beats.length === 24 && new Set(timing.beats.map((beat) => beat.id)).size === 24, 'all 24 unique storyboard beats required');
	const timeline = buildTimeline(timing.beats);
	requireValue(timeline.totalFrames === timing.totalFrames, 'duration minus overlap math mismatch');
	requireValue(timing.beats[0].kind === 'intro' && timing.beats[0].durationInFrames === 150 && timing.beats.at(-1)?.kind === 'outro' && timing.beats.at(-1)?.durationInFrames === 180, 'series bookend duration changed');
	const coverage = new Set<string>();
	const claims = new Set<string>();
	for (const [index, beat] of timing.beats.entries()) {
		requireValue(beat.from === timeline.entries[index].from, `absolute start mismatch: ${beat.id}`);
		requireValue(beat.overlapFromPrevious === 0, 'hard cuts required between operational states; overlap must be zero');
		requireValue(['intro', 'outro', 'screen', 'diagram', 'age'].includes(beat.kind), 'unknown beat kind');
		if (beat.kind === 'screen') {
			requireValue(beat.slot && REQUIREMENTS[beat.slot] && beat.cues.length > 0 && beat.cues[0].fromFrame === 0, `evidence cues required: ${beat.id}`);
			for (const [i, cue] of beat.cues.entries()) {
				requireValue(REQUIREMENTS[beat.slot!].includes(cue.proof), `unknown evidence cue: ${beat.id}/${cue.proof}`);
				const end = beat.cues[i + 1]?.fromFrame ?? beat.durationInFrames;
				requireValue(Number.isInteger(cue.fromFrame) && cue.fromFrame >= 0 && end - cue.fromFrame >= 60, 'each genuine view requires at least two seconds');
				requireValue(Number.isInteger(cue.focusAtFrame) && cue.focusAtFrame >= cue.fromFrame && cue.focusAtFrame + 12 < end, 'focus animation outside evidence hold');
				if (cue.detail) assertRect(cue.detail);
				coverage.add(`${beat.slot}/${cue.proof}`);
			}
		} else requireValue(beat.slot === null && beat.cues.length === 0, 'explanatory graphics must not impersonate app evidence');
		if (beat.narration) {
			requireValue(Number.isInteger(beat.voiceFromFrame) && Number.isInteger(beat.voiceToFrame) && beat.voiceFromFrame >= 0 && beat.voiceToFrame > beat.voiceFromFrame && beat.voiceToFrame <= beat.durationInFrames, 'planned voice interval outside beat');
			requireValue(Number.isInteger(beat.emphasisAtFrame) && beat.emphasisAtFrame >= beat.voiceFromFrame && beat.emphasisAtFrame + 12 <= beat.voiceToFrame, 'emphasis cue outside planned narration');
			requireValue(beat.claimIds.length > 0, 'spoken product claim requires source references');
		} else requireValue(['intro', 'outro'].includes(beat.kind), 'narration missing');
		for (const id of beat.claimIds) {
			requireValue((REQUIRED_CLAIMS as readonly string[]).includes(id), `unreviewed product claim: ${id}`);
			claims.add(id);
		}
	}
	for (const [slot, proofs] of Object.entries(REQUIREMENTS)) for (const proof of proofs) requireValue(coverage.has(`${slot}/${proof}`), `storyboard evidence omitted: ${slot}/${proof}`);
	for (const id of REQUIRED_CLAIMS) requireValue(claims.has(id), `required product boundary omitted: ${id}`);
	requireValue(timing.timingStatus === 'planned-not-recorded' && timing.audioStatus === 'not-generated' && timing.audio === null && timing.measuredTranscript === null && timing.wordTimingVerified === false && timing.narrationApprovalRef === null, 'wave 1 is silent with provisional timing; no final audio or invented word measurements');
};

export const assertFinalReady = (manifest: CaptureManifest, timing: NarrationManifest): never => {
	assertCaptureManifest(manifest);
	assertNarrationManifest(timing);
	throw new Error(`REMEDIAL: FINAL RENDER REFUSED\n${getMissingEvidence(manifest).map((key) => `Missing authentic evidence: ${key}`).join('\n')}\nFresh approved narration and measured word timing are absent.\nWave 1 permits INTERNAL PREVIEW only; final rendering and video inventory publication are disabled.\nUse ${PREVIEW_ID}.`);
};

export const assertFileBytes = (file: FileIdentity, bytes: Uint8Array, sha256: string) => {
	requireValue(bytes.byteLength === file.bytes, `byte size mismatch: ${file.path}`);
	requireValue(sha256 === file.sha256, `SHA-256 mismatch: ${file.path}`);
};
export const assertPng = (capture: Capture, bytes: Uint8Array) => {
	requireValue(bytes.length >= 33 && [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v), `invalid PNG: ${capture.id}`);
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	requireValue(view.getUint32(8) === 13 && view.getUint32(12) === 0x49484452 && view.getUint32(16) === capture.width && view.getUint32(20) === capture.height && bytes[24] === 8 && bytes[25] === 6 && bytes[28] === 0, `PNG dimensions/format changed: ${capture.id}`);
};
export const publicFiles = (manifest: CaptureManifest) => [manifest.storyboard, ...manifest.provenance, ...manifest.brandAssets, ...manifest.captures];

export const verifyAssets = async (
	manifest: CaptureManifest,
	timing: NarrationManifest,
	audit: SourceAudit,
	read: (path: string) => Promise<Uint8Array>,
	digest: (bytes: Uint8Array) => Promise<string>,
) => {
	assertCaptureManifest(manifest);
	assertNarrationManifest(timing);
	requireValue(await digest(new TextEncoder().encode(JSON.stringify(audit))) === '08f904dea2645aac415924725790c2c587bf3cd008349ace6c0c5c1f2de53a1a', 'source audit changed; revalidate product claims and source identities');
	requireValue(audit.schemaVersion === 1 && audit.mobileHead === APP_COMMIT && audit.deploymentVerified === false, 'source audit must distinguish local source from a live deployment');
	requireValue(sameKeys(audit.claims, REQUIRED_CLAIMS), 'source claim index incomplete');
	for (const claim of Object.values(audit.claims)) requireValue(text(claim.statement) && claim.references.length > 0 && claim.references.every(text), 'source citation missing');
	requireValue(await digest(new TextEncoder().encode(copyPayload(timing))) === COPY_SHA256, 'source-checked product copy changed; re-audit claims and disclosures');
	const bytes = new Map<string, Uint8Array>();
	await Promise.all(publicFiles(manifest).map(async (file) => {
		const raw = await read(file.path);
		assertFileBytes(file, raw, await digest(raw));
		bytes.set(file.path, raw);
	}));
	const source = JSON.parse(new TextDecoder().decode(bytes.get(manifest.provenance[0].path))) as { slots: { id: string; captures: object[] }[] };
	const register = new TextDecoder().decode(bytes.get(manifest.provenance[1].path));
	for (const capture of manifest.captures) {
		assertPng(capture, bytes.get(capture.path)!);
		const { id, trail, siteId, origin, ...original } = capture;
		const expected = { ...original, path: origin.sourcePath.replace(/^remotion-branding\/public\//, '') };
		const sourceCapture = source.slots.find((slot) => slot.id === origin.sourceSlot)?.captures.find((item) => (item as FileIdentity).sha256 === capture.sha256);
		// Compare the whole original declaration: record refs, observed counts,
		// disclosures, event order and crop provenance cannot silently change.
		requireValue(JSON.stringify(sourceCapture) === JSON.stringify(expected), `source provenance differs: ${id}`);
		requireValue(register.split('\n').some((line) => line.includes(origin.sourcePath.split('/').at(-1)!) && line.includes(capture.sha256) && line.includes(capture.bytes.toLocaleString('en-US'))), `capture absent from independent register: ${id}`);
	}
};
