import React from 'react';
import { Audio } from '@remotion/media';
import { Img, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { CLN_V4_POLISH, type RingCue } from './v4-polish';
import type { Capture, Rect } from './v4-contract';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const musicVolume = (frame: number, duration: number) => CLN_V4_POLISH.music.volume * interpolate(frame,
	[0, CLN_V4_POLISH.music.fadeInFrames, duration - 1 - CLN_V4_POLISH.music.fadeOutFrames, duration - 1], [0, 1, 1, 0], clamp);

export const V4BookendMusic: React.FC = () => <>{CLN_V4_POLISH.music.segments.map((segment) => (
	<Sequence key={segment.beat} name={`${segment.beat} · series music`} from={segment.from} durationInFrames={segment.durationInFrames}>
		<Audio src={staticFile(CLN_V4_POLISH.music.path)} trimBefore={segment.trimBefore} trimAfter={segment.trimAfter} volume={(frame) => musicVolume(frame, segment.durationInFrames)} />
	</Sequence>
))}</>;

const TapRing: React.FC<{ cue: RingCue; capture: Capture; frame: number }> = ({ cue, capture, frame }) => {
	const local = frame - cue.fromFrame;
	if (local < 0 || local >= cue.durationInFrames) return null;
	const style = CLN_V4_POLISH.ringStyle;
	const opacity = interpolate(local, [0, style.fadeInFrames, cue.durationInFrames - style.fadeOutFrames, cue.durationInFrames - 1], [0, 1, 1, 0], clamp);
	const pulse = interpolate(local, [0, 16, cue.durationInFrames - 1], [4, 0, 6], clamp);
	const x = cue.rect.x * capture.width; const y = cue.rect.y * capture.height;
	const w = cue.rect.w * capture.width; const h = cue.rect.h * capture.height;
	return <svg data-v4-ring={cue.target} viewBox={`0 0 ${capture.width} ${capture.height}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', opacity }}>
		{[style.innerPaddingSourcePixels, style.outerPaddingSourcePixels + pulse].map((padding, i) => (
			<rect key={i} x={x - padding} y={y - padding} width={w + padding * 2} height={h + padding * 2} rx={cue.shape === 'circle' ? (w + padding * 2) / 2 : 14 + padding} fill="none" stroke={cue.color} strokeWidth={style.strokeWidth} vectorEffect="non-scaling-stroke" opacity={i ? 0.42 : 0.95} />
		))}
	</svg>;
};

export const V4EvidenceOverlays: React.FC<{ capture: Capture; beatId: string; detailRect?: Rect }> = ({ capture, beatId, detailRect }) => {
	const frame = useCurrentFrame();
	const qr = CLN_V4_POLISH.qr;
	return <>
		{beatId === CLN_V4_POLISH.scan.scannerBeat && capture.path === CLN_V4_POLISH.scan.scannerCapture ? (
			<Img data-v4-training-qr src={staticFile(qr.path)} style={{ position: 'absolute', left: `${qr.rect.x * 100}%`, top: `${qr.rect.y * 100}%`, width: `${qr.rect.w * 100}%`, height: `${qr.rect.h * 100}%`, opacity: interpolate(frame, [0, 12], [0, 1], clamp) }} />
		) : null}
		{/* Only repeat a ring in a detail when its entire target is in that crop.
		    The pulse may extend past the image crop into the empty video margin. */}
		{CLN_V4_POLISH.rings.filter((cue) => cue.beat === beatId && cue.capturePath === capture.path && (!detailRect || (cue.rect.x >= detailRect.x && cue.rect.y >= detailRect.y && cue.rect.x + cue.rect.w <= detailRect.x + detailRect.w && cue.rect.y + cue.rect.h <= detailRect.y + detailRect.h))).map((cue) => <TapRing key={cue.target} cue={cue} capture={capture} frame={frame} />)}
	</>;
};
