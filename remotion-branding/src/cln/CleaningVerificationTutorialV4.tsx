import React, { useEffect, useState } from 'react';
import {
	AbsoluteFill,
	Audio,
	Img,
	Sequence,
	cancelRender,
	continueRender,
	delayRender,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { BrandIntro, BrandOutro, hexToRgb } from '../brand/EcowizeBookends';
import captureData from './captures-v4.json';
import narrationData from './narration-v4.json';
import { V4BookendMusic, V4EvidenceOverlays } from './V4Polish';
import { CLN_V4_POLISH, assertV4Polish, verifyV4PolishAssets } from './v4-polish';
import {
	assertCaptureManifest,
	assertFinalReady,
	assertNarrationManifest,
	buildTimeline,
	getMissingCaptures,
	verifyAssetFiles,
	type Capture,
	type CaptureManifest,
	type NarrationManifest,
	type Rect,
	type V4Beat,
} from './v4-contract';

export const CLN_V4_CAPTURES = captureData as CaptureManifest;
export const CLN_V4_NARRATION = narrationData as NarrationManifest;
export const CLN_V4_FPS = CLN_V4_NARRATION.fps;
export const CLN_V4_FRAMES = buildTimeline(CLN_V4_NARRATION.beats).totalFrames;
export const CLN_V4_PREVIEW_ID = 'CleaningVerificationTutorialV4-INTERNAL-PREVIEW';
export const CLN_V4_ID = 'CleaningVerificationTutorialV4';

const SKY = '#3CB6E0';
const EMERALD = '#1F9C5A';
const AMBER = '#E89A30';
const INK = '#071018';
const MUTED = '#B7C3CF';
const FONT = 'Inter, "DM Sans", system-ui, sans-serif';
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const { text: simulationLabel, ...simulationStyle } = CLN_V4_POLISH.simulationBanner;

// Used by metadata preflight AND by the mounted component. The latter also
// guards direct renderMedia()/renderStill() callers that supply their own config.
export const verifyV4BrowserAssets = async () => {
	const read = async (path: string) => {
		const response = await fetch(staticFile(path));
		if (!response.ok) throw new Error(`CLN V4: missing genuine asset (${response.status}): ${path}`);
		return new Uint8Array(await response.arrayBuffer());
	};
	const hash = async (bytes: Uint8Array) => {
		const hash = await crypto.subtle.digest('SHA-256', new Uint8Array(bytes));
		return Array.from(new Uint8Array(hash), (value) => value.toString(16).padStart(2, '0')).join('');
	};
	await Promise.all([verifyAssetFiles(CLN_V4_CAPTURES, CLN_V4_NARRATION, read, hash), verifyV4PolishAssets(read, hash)]);
	if (CLN_V4_NARRATION.audio?.transcript) assertV4Polish(CLN_V4_CAPTURES, CLN_V4_NARRATION, JSON.parse(new TextDecoder().decode(await read(CLN_V4_NARRATION.audio.transcript.path))));
};

const VerifiedAssets: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [handle] = useState(() => delayRender('Verify every CLN V4 genuine asset and its provenance'));
	const [ready, setReady] = useState(false);
	useEffect(() => {
		let active = true;
		verifyV4BrowserAssets().then(() => {
			if (active) {
				setReady(true);
				continueRender(handle);
			}
		}).catch((error: unknown) => {
			if (active) cancelRender(error instanceof Error ? error : new Error(String(error)));
		});
		return () => { active = false; continueRender(handle); };
	}, [handle]);
	return ready ? <>{children}</> : null;
};

const DetailCrop: React.FC<{ capture: Capture; rect: Rect; opacity: number; beatId: string }> = ({ capture, rect, opacity, beatId }) => {
	const cropW = rect.w * capture.width;
	const cropH = rect.h * capture.height;
	const scale = Math.min(1110 / cropW, 370 / cropH, 2);
	return (
		<div data-v4-detail style={{ position: 'absolute', left: 620, top: 568, width: cropW * scale, height: cropH * scale, outline: `2px solid ${SKY}`, boxShadow: '0 18px 52px rgba(0,0,0,0.3)', opacity }}>
			<div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
				<Img src={staticFile(capture.path)} style={{ position: 'absolute', left: -rect.x * capture.width * scale, top: -rect.y * capture.height * scale, width: capture.width * scale, height: capture.height * scale, maxWidth: 'none' }} />
			</div>
			<div style={{ position: 'absolute', left: -rect.x * capture.width * scale, top: -rect.y * capture.height * scale, width: capture.width * scale, height: capture.height * scale }}>
				<V4EvidenceOverlays capture={capture} beatId={beatId} detailRect={rect} />
			</div>
		</div>
	);
};

const GenuinePhone: React.FC<{ capture: Capture; beatId: string }> = ({ capture, beatId }) => {
	const scale = Math.min(450 / capture.width, 950 / capture.height);
	const width = capture.width * scale;
	const height = capture.height * scale;
	return (
		<>
			<div data-v4-phone style={{ position: 'absolute', left: 88 + (450 - width) / 2, top: 78, width, height, boxShadow: '0 0 0 8px #142230, 0 0 0 10px #304253, 0 28px 75px rgba(0,0,0,0.45)' }}>
				{/* Full original PNG; separate teaching overlays never mutate its bytes. */}
				<Img src={staticFile(capture.path)} style={{ width, height, display: 'block' }} />
				<V4EvidenceOverlays capture={capture} beatId={beatId} />
			</div>
		</>
	);
};

const CaptureBlocker: React.FC<{ title: string }> = ({ title }) => (
	<div data-v4-blocker style={{ position: 'absolute', left: 80, top: 354, width: 464, padding: 30, boxSizing: 'border-box', background: '#19242F', border: '1px solid #52606D', color: MUTED }}>
		<div style={{ fontSize: 20, letterSpacing: 2.1, fontWeight: 800 }}>CAPTURE REQUIRED</div>
		<div style={{ marginTop: 24, fontSize: 31, lineHeight: 1.2, color: '#F4F6F8', fontWeight: 750 }}>{title}</div>
		<div style={{ marginTop: 24, fontSize: 24, lineHeight: 1.35 }}>No genuine app screen is available for this step.</div>
		<div style={{ marginTop: 24, fontSize: 19, lineHeight: 1.3 }}>Internal storyboard placeholder<br />Outside the app · not operational UI</div>
	</div>
);

const ScreenBeat: React.FC<{ beat: V4Beat }> = ({ beat }) => {
	const frame = useCurrentFrame();
	const slot = CLN_V4_CAPTURES.slots.find((item) => item.id === beat.slot)!;
	// Evidence cuts follow persisted measured narration cues. Several keys may
	// intentionally hold the same original PNG, preserving the whole summary.
	const index = beat.proofFromFrames.reduce((active, from, i) => frame >= from ? i : active, 0);
	const proof = beat.proofs[index];
	const capture = slot.captures.find((item) => Object.hasOwn(item.views, proof));
	const focus = beat.id === CLN_V4_POLISH.scan.homeBeat ? CLN_V4_POLISH.scan.detailRect : capture?.views[proof];
	const textIn = interpolate(frame, [beat.voiceFromFrame - 12, beat.voiceFromFrame], [0, 1], clamp);
	const emphasisIn = interpolate(frame, [beat.emphasisAtFrame, beat.emphasisAtFrame + 10], [0, 1], clamp);
	const focusIn = interpolate(frame, [beat.focusAtFrame, beat.focusAtFrame + 12], [0, 1], clamp);
	return (
		<AbsoluteFill>
			{capture ? <GenuinePhone capture={capture} beatId={beat.id} /> : <CaptureBlocker title={slot.title} />}
			<div data-v4-copy style={{ position: 'absolute', left: 620, top: 111, width: 1170, opacity: textIn }}>
				<div style={{ color: SKY, fontSize: 24, fontWeight: 800, letterSpacing: 2.2, textTransform: 'uppercase' }}>{beat.chapter}</div>
				<div style={{ marginTop: 28, fontSize: 68, fontWeight: 850, lineHeight: 1.07, letterSpacing: -1.6 }}>{beat.headline}</div>
			</div>
			<div style={{ position: 'absolute', left: 620, top: 328, width: 1110, fontSize: 32, lineHeight: 1.32, color: MUTED, opacity: textIn }}>{beat.body}</div>
			<div style={{ position: 'absolute', left: 620, top: 462, width: 1140, fontSize: 30, fontWeight: 750, lineHeight: 1.2, borderLeft: `4px solid ${SKY}`, paddingLeft: 20, boxSizing: 'border-box', opacity: emphasisIn, transform: `translateY(${interpolate(emphasisIn, [0, 1], [8, 0])}px)` }}>{beat.emphasis}</div>
			<div style={{ position: 'absolute', left: 620, top: 530, width: 1120, color: capture ? SKY : MUTED, fontSize: 21, letterSpacing: 1.3, fontWeight: 750 }}>
				{capture ? (focus ? 'DETAIL' : '') : 'STORYBOARD COPY · AUTHENTIC EVIDENCE PENDING'}
			</div>
			{capture && focus ? <DetailCrop capture={capture} rect={focus} opacity={focusIn} beatId={beat.id} /> : null}
			{!capture ? (
				<div style={{ position: 'absolute', left: 620, top: 585, width: 1070, color: MUTED, fontSize: 28, lineHeight: 1.45 }}>
					<div style={{ fontSize: 22, color: '#EFF3F7', marginBottom: 18 }}>Required view {index + 1} / {beat.proofs.length}: {proof.replaceAll('-', ' ')}</div>
					{slot.blocker}
				</div>
			) : null}
		</AbsoluteFill>
	);
};

const Handoff: React.FC<{ beat: V4Beat }> = ({ beat }) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [beat.emphasisAtFrame, beat.emphasisAtFrame + 15], [0, 1], clamp);
	return (
		<AbsoluteFill style={{ padding: '150px 160px', boxSizing: 'border-box', opacity }}>
			<div style={{ color: SKY, fontSize: 26, fontWeight: 800, letterSpacing: 3 }}>CLEANING VERIFICATION</div>
			<div style={{ marginTop: 44, fontSize: 94, lineHeight: 1.05, fontWeight: 850 }}>{beat.headline}</div>
			<div style={{ marginTop: 38, fontSize: 38, color: MUTED, width: 1240, lineHeight: 1.3 }}>{beat.body}</div>
			<div style={{ marginTop: 90, paddingTop: 38, borderTop: '1px solid #435362', width: 1360 }}>
				<div style={{ color: SKY, fontSize: 30, fontWeight: 800 }}>{beat.emphasis}</div>
				<div style={{ marginTop: 24, fontSize: 36, lineHeight: 1.4, color: MUTED }}>Why findings stay open.<br />Why Inspection Remedials can carry over.</div>
			</div>
		</AbsoluteFill>
	);
};

const V4Timeline: React.FC<{ preview: boolean }> = ({ preview }) => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();
	if (fps !== CLN_V4_FPS || durationInFrames !== CLN_V4_FRAMES) throw new Error('CLN V4: render config disagrees with narration timing');
	const missing = getMissingCaptures(CLN_V4_CAPTURES);
	const active = CLN_V4_NARRATION.beats.reduce((index, beat, candidate) => frame >= beat.from ? candidate : index, 0);
	return (
		<AbsoluteFill style={{ background: `radial-gradient(circle at 22% 32%, rgba(${hexToRgb(SKY)},0.12), transparent 40%), linear-gradient(125deg, #12202D, ${INK} 65%)`, color: '#F7FAFC', fontFamily: FONT }}>
			{CLN_V4_NARRATION.beats.map((beat) => (
				<Sequence key={beat.id} name={beat.id} from={beat.from} durationInFrames={beat.durationInFrames} premountFor={fps}>
					{beat.kind === 'intro' ? <BrandIntro title={beat.headline} tagline={beat.body} accentA={SKY} accentB={EMERALD} /> :
						beat.kind === 'outro' ? <BrandOutro outroKicker="e-wizer field guide" outroHeadline={beat.headline} outroBody={beat.body} outroCards={[{ label: 'Check', color: SKY }, { label: 'Record', color: AMBER }, { label: 'Follow up', color: EMERALD }]} accentA={SKY} accentB={EMERALD} /> :
							beat.kind === 'handoff' ? <Handoff beat={beat} /> : <ScreenBeat beat={beat} />}
				</Sequence>
			))}
			{CLN_V4_NARRATION.audio ? <Sequence from={0} durationInFrames={CLN_V4_FRAMES} premountFor={fps}><Audio src={staticFile(CLN_V4_NARRATION.audio.path)} /></Sequence> : null}
			<V4BookendMusic />
			{['screen', 'handoff'].includes(CLN_V4_NARRATION.beats[active].kind) ? <div data-v4-simulation-banner style={{ position: 'absolute', ...simulationStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{simulationLabel}</div> : null}
			{/* Always above every sequence, including the bookends. No prop can hide it. */}
			{preview ? <div data-v4-preview-label style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 43, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#D8DEE5', color: '#17222C', fontSize: 21, letterSpacing: 1.3, fontWeight: 850 }}>INTERNAL PREVIEW · {CLN_V4_NARRATION.audio ? 'AUDIO AWAITING APPROVAL' : 'SILENT · NARRATION PLANNED'} · {missing.length ? `${missing.length} CAPTURE GROUPS MISSING` : 'CAPTURE EVIDENCE COMPLETE'}</div> : null}
			<div style={{ position: 'absolute', left: 620, top: 1011, width: 1170, display: 'flex', justifyContent: 'space-between', fontSize: 19, color: MUTED }}><span>e-wizer · Cleaning Verification</span><span>{String(active + 1).padStart(2, '0')} / {CLN_V4_NARRATION.beats.length}</span></div>
			<div style={{ position: 'absolute', left: 620, top: 1045, width: 1170, height: 4, background: '#334351' }}><div style={{ height: '100%', width: `${interpolate(frame, [0, CLN_V4_FRAMES - 1], [0, 100], clamp)}%`, background: SKY }} /></div>
		</AbsoluteFill>
	);
};

export const CleaningVerificationTutorialV4InternalPreview: React.FC = () => {
	assertCaptureManifest(CLN_V4_CAPTURES);
	assertNarrationManifest(CLN_V4_NARRATION);
	return <VerifiedAssets><V4Timeline preview /></VerifiedAssets>;
};

// Fixed wrapper, intentionally no input props for render mode, assets or waiver.
export const CleaningVerificationTutorialV4: React.FC = () => {
	assertFinalReady(CLN_V4_CAPTURES, CLN_V4_NARRATION);
	return <VerifiedAssets><V4Timeline preview={false} /></VerifiedAssets>;
};
