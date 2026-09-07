import React, { useEffect, useState } from 'react';
import {
	AbsoluteFill, Img, Sequence, cancelRender, continueRender, delayRender,
	interpolate, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import { Audio } from '@remotion/media';
import { BrandIntro, BrandOutro } from '../brand/EcowizeBookends';
import captureData from './captures.json';
import narrationData from './narration.json';
import auditData from './source-audit.json';
import { SIMULATION_BADGE } from './candidate-presentation';
import {
	EXPLANATORY_LABEL, assertCaptureManifest, assertFinalReady, assertNarrationManifest,
	buildTimeline, getMissingEvidence, verifyAssets,
	type Beat, type Capture, type CaptureManifest, type NarrationManifest, type Rect,
} from './contract';

// JSON inference widens heterogeneous view keys; the shared runtime contract
// validates the complete declaration before any frame can render.
export const CAPTURES = captureData as unknown as CaptureManifest;
export const NARRATION = narrationData as NarrationManifest;
export const FPS = NARRATION.fps;
export const FRAMES = buildTimeline(NARRATION.beats).totalFrames;
const SKY = '#3CB6E0';
const EMERALD = '#1F9C5A';
const AMBER = '#E89A30';
const CORAL = '#D6432F';
const MUTED = '#B7C3CF';
const INK = '#071018';
const BODY = '"DM Sans", sans-serif';
const DISPLAY = '"Barlow Condensed", sans-serif';
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const verifyBrowserAssets = () => verifyAssets(CAPTURES, NARRATION, auditData,
	async (path) => {
		const response = await fetch(staticFile(path));
		if (!response.ok) throw new Error(`REMEDIAL: missing registered file: ${path} (${response.status})`);
		return new Uint8Array(await response.arrayBuffer());
	},
	async (bytes) => {
		const hash = await crypto.subtle.digest('SHA-256', new Uint8Array(bytes));
		return Array.from(new Uint8Array(hash), (value) => value.toString(16).padStart(2, '0')).join('');
	},
);

const loadFonts = async () => {
	const faces = [
		['Barlow Condensed', 'BarlowCondensed_700Bold.ttf', '700'],
		['DM Sans', 'DMSans_400Regular.ttf', '400'],
		['DM Sans', 'DMSans_700Bold.ttf', '700'],
	];
	await Promise.all(faces.map(async ([family, file, weight]) => {
		const face = new FontFace(family, `url(${staticFile(`ccv-tutorial/fonts/${file}`)})`, { weight });
		await face.load();
		(document.fonts as unknown as { add: (font: FontFace) => void }).add(face);
	}));
};

// Also protects direct renderStill/renderMedia callers that skip calculateMetadata.
export const VerifiedAssets: React.FC<{ children: React.ReactNode; verify?: () => Promise<void> }> = ({ children, verify = verifyBrowserAssets }) => {
	const [handle] = useState(() => delayRender('Verify Remedial evidence, provenance and fonts'));
	const [ready, setReady] = useState(false);
	useEffect(() => {
		let active = true;
		Promise.all([verify(), loadFonts()]).then(() => {
			if (active) { setReady(true); continueRender(handle); }
		}).catch((error: unknown) => {
			if (active) cancelRender(error instanceof Error ? error : new Error(String(error)));
		});
		return () => { active = false; continueRender(handle); };
	}, [handle, verify]);
	return ready ? <>{children}</> : null;
};

const GenuineCapture: React.FC<{ capture: Capture; candidate: boolean }> = ({ capture, candidate }) => (
	<>
		{/* Original full PNG. No inserted fields, status bars, buttons or overlays. */}
		<div data-remedial-app style={{ position: 'absolute', left: 108, top: 108, width: 396, height: 880, boxShadow: '0 0 0 8px #152433, 0 0 0 10px #384B5C, 0 30px 70px #0008' }}>
			<Img src={staticFile(capture.path)} style={{ width: '100%', height: '100%', display: 'block' }} />
		</div>
		{!candidate ? <div style={{ position: 'absolute', left: 108, top: 1002, color: MUTED, fontSize: 17 }}>Genuine app capture · full original frame</div> : null}
	</>
);

const Detail: React.FC<{ capture: Capture; rect: Rect; opacity: number; left?: number }> = ({ capture, rect, opacity, left = 620 }) => {
	const cropWidth = capture.width * rect.w;
	const cropHeight = capture.height * rect.h;
	const scale = Math.min(1180 / cropWidth, 320 / cropHeight, 2);
	return (
		<div data-remedial-detail style={{ position: 'absolute', left, top: 610, width: cropWidth * scale, height: cropHeight * scale, overflow: 'hidden', outline: '1px solid #6F8597', boxShadow: '0 20px 60px #0004', opacity }}>
			<Img src={staticFile(capture.path)} style={{ position: 'absolute', left: -rect.x * capture.width * scale, top: -rect.y * capture.height * scale, width: capture.width * scale, height: capture.height * scale, maxWidth: 'none' }} />
		</div>
	);
};

const CaptureBlocker: React.FC<{ slot: string; proof: string }> = ({ slot, proof }) => (
	// This standalone editorial card has no phone frame or app-shaped controls.
	<div data-remedial-blocker style={{ position: 'absolute', left: 90, top: 252, width: 440, padding: 34, boxSizing: 'border-box', borderTop: `4px solid ${AMBER}`, background: '#192633', color: MUTED }}>
		<div style={{ fontSize: 20, color: AMBER, fontWeight: 700, letterSpacing: 1.5 }}>DEVELOPMENT BLOCKER</div>
		<div style={{ fontFamily: DISPLAY, fontSize: 45, lineHeight: 1.08, color: '#F7FAFC', marginTop: 30 }}>Authentic capture<br />required</div>
		<div style={{ fontSize: 24, lineHeight: 1.5, marginTop: 28 }}>{slot.startsWith('inspection') ? 'Inspection Remedial evidence is not registered.' : 'The selected Cleaning bucket is not captured.'}</div>
		<div style={{ fontSize: 21, marginTop: 28, color: '#F7FAFC' }}>{proof.replaceAll('-', ' ')}</div>
		<div style={{ fontSize: 18, marginTop: 34, lineHeight: 1.5 }}>Outside app chrome<br />Not an app screen<br />Final render refused</div>
	</div>
);

const ScreenBeat: React.FC<{ beat: Beat; captures: CaptureManifest; candidate: boolean }> = ({ beat, captures, candidate }) => {
	const frame = useCurrentFrame();
	const cueIndex = beat.cues.reduce((active, cue, i) => frame >= cue.fromFrame ? i : active, 0);
	const cue = beat.cues[cueIndex];
	const ref = captures.slots[beat.slot!][cue.proof];
	const capture = ref ? captures.captures.find((item) => item.id === ref.captureId) : undefined;
	// V3 retains the genuine closed record without returning to its daily backlog.
	const recordOnly = candidate && capture?.id === 'resolved-item';
	const copyLeft = recordOnly ? 120 : 620;
	const rect = cue.detail ?? (ref && capture?.views[ref.view]);
	const textIn = interpolate(frame, [0, beat.voiceFromFrame], [0, 1], clamp);
	const emphasisIn = interpolate(frame, [beat.emphasisAtFrame, beat.emphasisAtFrame + 12], [0, 1], clamp);
	const detailIn = interpolate(frame, [cue.focusAtFrame, cue.focusAtFrame + 12], [0, 1], clamp);
	const accent = beat.slot?.startsWith('inspection') ? AMBER : SKY;
	return (
		<AbsoluteFill>
			{capture ? !recordOnly ? <GenuineCapture capture={capture} candidate={candidate} /> : null : <CaptureBlocker slot={beat.slot!} proof={cue.proof} />}
			<div data-remedial-copy style={{ position: 'absolute', left: copyLeft, top: 102, width: 1180, opacity: textIn }}>
				<div style={{ color: accent, fontSize: 22, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>{beat.chapter}</div>
				<div style={{ fontFamily: DISPLAY, fontSize: 76, fontWeight: 700, lineHeight: 0.98, whiteSpace: 'pre-line', marginTop: 26 }}>{beat.headline}</div>
			</div>
			<div data-remedial-body style={{ position: 'absolute', left: copyLeft, top: 330, width: 1160, color: MUTED, fontSize: 31, lineHeight: 1.35, opacity: textIn }}>{beat.body}</div>
			<div data-remedial-emphasis style={{ position: 'absolute', left: copyLeft, top: 458, width: 1160, borderLeft: `4px solid ${accent}`, paddingLeft: 24, boxSizing: 'border-box', fontSize: 31, lineHeight: 1.3, fontWeight: 700, opacity: emphasisIn, transform: `translateY(${8 * (1 - emphasisIn)}px)` }}>{beat.emphasis}</div>
			{!candidate ? <div style={{ position: 'absolute', left: 620, top: 570, color: capture ? accent : MUTED, fontSize: 18, letterSpacing: 1.6, fontWeight: 700 }}>{capture ? 'ENLARGED DETAIL · SAME GENUINE CAPTURE' : 'PLANNED TEACHING · AUTHENTIC EVIDENCE PENDING'}</div> : null}
			{capture && rect ? <Detail capture={capture} rect={rect} opacity={detailIn} left={copyLeft} /> : null}
			{!capture ? <div style={{ position: 'absolute', left: 620, top: 622, width: 1110, borderTop: '1px solid #344A5E', paddingTop: 30, color: MUTED, fontSize: 26, lineHeight: 1.55 }}>
				<div style={{ color: '#EEF4F9', fontFamily: DISPLAY, fontSize: 39 }}>View {cueIndex + 1} of {beat.cues.length}: {cue.proof.replaceAll('-', ' ')}</div>
				<div style={{ marginTop: 20 }}>Capture through the shipped app in Bakery Demo. Register the exact pixels, record identity and state before replacing this card.</div>
				<div style={{ marginTop: 20, color: AMBER }}>No operational action is demonstrated by this placeholder.</div>
			</div> : null}
			{!candidate ? <div data-remedial-note style={{ position: 'absolute', left: 620, top: 950, width: 1180, fontSize: 18, color: MUTED, lineHeight: 1.35 }}>{beat.note}</div> : null}
			{capture && !candidate ? <div data-remedial-disclosure style={{ position: 'absolute', left: 620, top: 996, width: 1180, fontSize: 18, color: MUTED }}>{capture.disclosure}</div> : null}
		</AbsoluteFill>
	);
};

const Explanation: React.FC<{ beat: Beat; candidate: boolean }> = ({ beat, candidate }) => {
	const frame = useCurrentFrame();
	const reveal = interpolate(frame, [beat.emphasisAtFrame, beat.emphasisAtFrame + 18], [0, 1], clamp);
	const age = beat.kind === 'age';
	const cards = age ? [
		{ title: '0–7 days', body: 'Muted', color: MUTED },
		{ title: '8–30 days', body: 'Amber · greater than 7', color: AMBER },
		{ title: '31+ days', body: 'Coral · greater than 30', color: CORAL },
	] : [
		{ title: 'Daily Cleaning', body: 'A scheduled occurrence is captured.\nIts finding still needs follow-up.', color: SKY },
		{ title: 'Inspection Remedials', body: 'An inspection finding carries over.\nIts own decision closes or escalates it.', color: AMBER },
	];
	return (
		<AbsoluteFill data-remedial-explanation style={{ padding: '116px 120px', boxSizing: 'border-box' }}>
			<div style={{ fontSize: 23, color: SKY, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>{beat.chapter}</div>
			<div style={{ fontFamily: DISPLAY, fontSize: 96, lineHeight: 1.02, fontWeight: 700, marginTop: 28, whiteSpace: 'pre-line' }}>{beat.headline}</div>
			<div style={{ width: 1520, marginTop: 30, color: MUTED, fontSize: 31, lineHeight: 1.4 }}>{beat.body}</div>
			<div style={{ position: 'absolute', left: 120, right: 120, top: 556, display: 'flex', gap: 30, opacity: reveal, transform: `translateY(${12 * (1 - reveal)}px)` }}>
				{cards.map((card) => <div key={card.title} style={{ flex: 1, borderTop: `4px solid ${card.color}`, padding: '34px 30px', background: '#142432' }}>
					<div style={{ color: card.color, fontFamily: DISPLAY, fontSize: 55, fontWeight: 700 }}>{card.title}</div>
					<div style={{ color: MUTED, fontSize: 27, lineHeight: 1.5, marginTop: 18, whiteSpace: 'pre-line' }}>{card.body}</div>
				</div>)}
			</div>
			<div style={{ position: 'absolute', left: 120, top: 850, fontSize: 34, fontWeight: 700, opacity: reveal }}>{beat.emphasis}</div>
			{!candidate ? <div style={{ position: 'absolute', left: 120, top: 949, fontSize: 21, color: AMBER }}>{EXPLANATORY_LABEL}</div> : null}
		</AbsoluteFill>
	);
};

export const Timeline: React.FC<{ captures?: CaptureManifest; narration?: NarrationManifest; candidate?: boolean; music?: { path: string; volume: number } }> = ({ captures = CAPTURES, narration = NARRATION, candidate = false, music }) => {
	const FRAMES = narration.totalFrames;
	const FPS = narration.fps;
	const frame = useCurrentFrame();
	const config = useVideoConfig();
	if (config.fps !== FPS || config.durationInFrames !== FRAMES || config.width !== 1920 || config.height !== 1080) throw new Error('REMEDIAL: composition config disagrees with the timing contract');
	const active = narration.beats.reduce((current, beat, i) => frame >= beat.from ? i : current, 0);
	return (
		<AbsoluteFill style={{ background: 'radial-gradient(ellipse at 16% 32%, #123749 0%, transparent 48%), linear-gradient(125deg, #10202D, #071018 68%)', color: '#F7FAFC', fontFamily: BODY }}>
			{narration.beats.map((beat) => <Sequence key={beat.id} name={beat.id} from={beat.from} durationInFrames={beat.durationInFrames} premountFor={FPS}>
				{beat.kind === 'intro' ? <BrandIntro title={beat.headline} tagline={beat.body} accentA={SKY} accentB={EMERALD} /> :
					beat.kind === 'outro' ? <BrandOutro outroKicker="e-wizer field guide" outroHeadline={beat.headline} outroBody={beat.body} outroCards={[{ label: candidate ? 'Review' : 'Record', color: SKY }, { label: 'Verify', color: AMBER }, { label: 'Follow up', color: EMERALD }]} accentA={SKY} accentB={EMERALD} /> :
						beat.kind === 'screen' ? <ScreenBeat beat={beat} captures={captures} candidate={candidate} /> : <Explanation beat={beat} candidate={candidate} />}
			</Sequence>)}
			{/* Persisted, measured narration; original internal preview remains silent. */}
			{narration.audio ? <Sequence from={0} durationInFrames={FRAMES} premountFor={FPS}><Audio src={staticFile(narration.audio.path)} onError={() => 'fail'} /></Sequence> : null}
			{music ? narration.beats.filter((beat) => beat.kind === 'intro' || beat.kind === 'outro').map((beat) => <Sequence key={`music-${beat.id}`} from={beat.from} durationInFrames={beat.durationInFrames} premountFor={FPS}><Audio src={staticFile(music.path)} volume={(f) => music.volume * interpolate(f, [0, 24, beat.durationInFrames - 29, beat.durationInFrames - 1], [0, 1, 1, 0], clamp)} onError={() => 'fail'} /></Sequence>) : null}
			{/* Candidate wrapper is guarded separately; original preview keeps its label. */}
			{candidate ? !['intro', 'outro'].includes(narration.beats[active].kind) ? <div data-remedial-simulation style={{ position: 'absolute', top: SIMULATION_BADGE.top, right: SIMULATION_BADGE.right, width: SIMULATION_BADGE.width, height: SIMULATION_BADGE.height, borderRadius: SIMULATION_BADGE.borderRadius, background: SIMULATION_BADGE.background, color: SIMULATION_BADGE.color, fontSize: SIMULATION_BADGE.fontSize, fontWeight: 700, letterSpacing: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{SIMULATION_BADGE.text}</div> : null : <div data-remedial-preview-label style={{ position: 'absolute', inset: '0 0 auto', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E1E7EC', color: INK, fontSize: 19, letterSpacing: 1.6, fontWeight: 700 }}>{`INTERNAL PREVIEW · SILENT · PLANNED TIMING · ${getMissingEvidence(CAPTURES).length} AUTHENTIC VIEWS PENDING`}</div>}
			<div style={{ position: 'absolute', left: 620, top: 1038, width: 1180, display: 'flex', justifyContent: 'space-between', fontSize: 16, color: MUTED, letterSpacing: 1 }}><span>e-wizer field guide · Remedial Action</span><span>{String(active + 1).padStart(2, '0')} / {narration.beats.length}</span></div>
			<div style={{ position: 'absolute', bottom: 0, height: 5, left: 0, width: `${interpolate(frame, [0, FRAMES - 1], [0, 100], clamp)}%`, background: `linear-gradient(90deg, ${SKY}, ${EMERALD})` }} />
		</AbsoluteFill>
	);
};

export const RemedialActionInternalPreview: React.FC = () => {
	assertCaptureManifest(CAPTURES);
	assertNarrationManifest(NARRATION);
	return <VerifiedAssets><Timeline /></VerifiedAssets>;
};

// No input props, mode switch, waiver, or preview fallback on the final wrapper.
export const RemedialActionTutorial: React.FC = () => assertFinalReady(CAPTURES, NARRATION);
