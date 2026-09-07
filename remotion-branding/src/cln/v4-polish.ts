import data from './polish-v4.json';
import { assertFileBytes, measuredCueTime, type CaptureManifest, type MeasuredNarration, type NarrationManifest, type Rect } from './v4-contract';

export const CLN_V4_POLISH = data;
export type RingCue = typeof data.rings[number];
const requireValue = (condition: unknown, message: string) => {
	if (!condition) throw new Error(`CLN V4 polish: ${message}`);
};
const validRect = (rect: Rect) => Object.values(rect).every(Number.isFinite) && rect.x >= 0 && rect.y >= 0 && rect.w > 0 && rect.h > 0 && rect.x + rect.w <= 1 && rect.y + rect.h <= 1;
const contains = (outer: Rect, inner: Rect) => inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.w <= outer.x + outer.w && inner.y + inner.h <= outer.y + outer.h;

export const assertV4Polish = (captures: CaptureManifest, narration: NarrationManifest, measured: MeasuredNarration, polish = CLN_V4_POLISH) => {
	requireValue(polish.schemaVersion === 1 && polish.totalFrames === 8295 && narration.totalFrames === 8295 && polish.fps === 30 && narration.fps === 30, 'approved 8295-frame / 276.5s timeline required');
	const home = narration.beats.find((beat) => beat.id === polish.scan.homeBeat)!;
	const scanner = narration.beats.find((beat) => beat.id === polish.scan.scannerBeat)!;
	const sourceFor = (beat: typeof home, proof: string) => captures.slots.find((slot) => slot.id === beat.slot)?.captures.find((capture) => Object.hasOwn(capture.views, proof));
	requireValue(home?.slot === 'home' && home.proofs.length === 1 && home.proofs[0] === 'entry' && sourceFor(home, 'entry')?.path === polish.scan.homeCapture, 'scan initiation must use the approved genuine Home capture');
	requireValue(narration.beats.find((beat) => beat.kind === 'screen')?.id === home.id, 'first instructional screen must initiate Scan from Home');
	requireValue(scanner?.proofs[0] === 'scanner' && sourceFor(scanner, 'scanner')?.path === polish.scan.scannerCapture && home.from + home.durationInFrames === scanner.from, 'Home must precede scanner without a gap or intervening screen');
	requireValue(validRect(polish.scan.detailRect), 'Home navigation detail crop is invalid');
	requireValue(polish.qr.payload === 'kx75czmzd6hc5d7t4wct58tjm188ea8p' && polish.qr.disclosure === 'Bakery Demo training QR overlay', 'exact QR payload and internal provenance required');
	const banner = polish.simulationBanner;
	requireValue(banner.text === 'SIMULATION' && banner.left === 1592 && banner.top === 28 && banner.width === 300 && banner.height === 56 && banner.background === '#FFC533' && banner.color === '#17222C' && banner.borderRadius === 14 && banner.fontSize === 28 && banner.fontWeight === 850, 'readable SIMULATION banner required outside phone and action details');
	const prose = narration.beats.map((beat) => [beat.headline, beat.body, beat.emphasis, beat.narration].join(' ')).join('\n');
	requireValue(!/simulat|emulator|virtual.camera|teaching overlay|QR composition|capture register|physical (?:visit|presence|attendance)|earlier (?:approved )?capture|internal QA|review approval/i.test(prose), 'operator copy must omit production mechanisms and simulation explanations');
	requireValue(validRect(polish.qr.rect) && validRect(polish.qr.viewport) && contains(polish.qr.viewport, polish.qr.rect), 'QR must stay inside the genuine scanner camera viewport');
	requireValue(Math.abs(polish.qr.rect.w * 720 - polish.qr.rect.h * 1600) < 0.001, 'QR may not be distorted');
	for (const ring of polish.rings) {
		const beat = narration.beats.find((item) => item.id === ring.beat);
		const clip = measured.clips.find((item) => item.id === ring.beat);
		requireValue(beat && clip && validRect(ring.rect) && ['circle', 'pill'].includes(ring.shape), `invalid ring target: ${ring.beat}`);
		if (!beat || !clip) continue;
		requireValue(ring.fromFrame === clip.clipStartFrame + Math.floor(measuredCueTime(clip.words, ring.cueWords) * narration.fps), `ring must follow measured words: ${ring.beat}`);
		requireValue(ring.durationInFrames === 48 && ring.fromFrame >= 0 && ring.fromFrame + ring.durationInFrames <= beat.durationInFrames, `brief ring must fit its beat: ${ring.beat}`);
		for (const frame of [ring.fromFrame, ring.fromFrame + ring.durationInFrames - 1]) {
			const index = beat.proofFromFrames.reduce((active, from, i) => frame >= from ? i : active, 0);
			const capture = sourceFor(beat, beat.proofs[index]);
			requireValue(capture?.path === ring.capturePath && capture.sha256 === ring.captureSha256, `ring must anchor to the active genuine evidence: ${ring.beat}`);
		}
	}
	const music = polish.music;
	requireValue(music.path === 'cln-tutorial/audio/tutorial.mp3' && music.sha256 === 'f1928a7b68b79b89c843af517583ddc636773e8c4a354e3b610d42611962d186', 'established CCV/BoH music bytes required');
	requireValue(music.volume === 0.88 && music.fadeInFrames === 24 && music.fadeOutFrames === 28 && music.narrationOverlapFrames === 0, 'explicit series gain and bookend fades required');
	requireValue(music.segments.length === 2, 'music belongs only in the two bookends');
	for (const [index, segment] of music.segments.entries()) {
		const beat = narration.beats.find((item) => item.id === (index ? 'outro' : 'intro'))!;
		requireValue(segment.beat === beat.id && !beat.narration && segment.from === beat.from && segment.durationInFrames === beat.durationInFrames && segment.trimBefore === 0 && segment.trimAfter === beat.durationInFrames, 'music must use explicit source trims inside silent narration bookends');
	}
};

export const verifyV4PolishAssets = async (read: (path: string) => Promise<Uint8Array>, hash: (bytes: Uint8Array) => Promise<string>) => {
	for (const file of [CLN_V4_POLISH.qr, CLN_V4_POLISH.music]) {
		const bytes = await read(file.path);
		assertFileBytes(file, bytes, await hash(bytes));
	}
};
