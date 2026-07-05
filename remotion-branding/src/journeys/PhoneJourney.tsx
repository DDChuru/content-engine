import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Img,
	Sequence,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { hexToRgb } from '../brand/EcowizeBookends';

/**
 * PhoneJourney — generalized phone-still journey scene, extracted from the
 * DailyHygieneTutorial pattern for 720×1600 portrait phone captures.
 * Phone-left (device frame, status bar cropped) + right column:
 * chip → headline → body → ZoomPanel (crop of the ringed region) → proof → progress.
 * Ring boxes and zoom crops are in RAW STILL PIXELS; one SCALE constant maps
 * them into the phone frame. Stills crossfade per narration beat.
 */

const INK = '#071018';
const PANEL = '#0E1822';
const FONT = 'Inter, "DM Sans", system-ui, sans-serif';

export type RingBox = { x: number; y: number; w: number; h: number; color?: string };
export type CropRect = { x: number; y: number; w: number; h: number; panelH?: number };
export type JourneyBeat = {
	id: string;
	shot: string;
	chip: string;
	ring: string | null;
	audio: string;
	voStart: number;
	duration: number;
	text: string;
};
export type JourneyTiming = {
	fps: number;
	total_seconds: number;
	total_frames: number;
	beats: JourneyBeat[];
};
export type BeatCopy = { headline: string; body: string; proof: string };

export type PhoneJourneyProps = {
	timing: JourneyTiming;
	boxes: Record<string, RingBox>;
	crops?: Partial<Record<string, CropRect>>;
	copy: Record<string, BeatCopy>;
	stillDir: string;
	stillW?: number;
	stillH?: number;
	cropTop?: number;
	footerLabel: string;
	accent: string;
	titleCard?: { kicker: string; title: string; tagline: string };
	narrationVolume?: number;
};

const clampNum = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

const getActiveIndex = (beats: JourneyBeat[], sec: number) => {
	let active = 0;
	for (let i = 0; i < beats.length; i++) {
		if (sec >= beats[i].voStart - 0.18) active = i;
	}
	return active;
};

const PhoneRing: React.FC<{
	box: RingBox | null;
	beatStart: number;
	scale: number;
	cropTop: number;
	accent: string;
}> = ({ box, beatStart, scale, cropTop, accent }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	if (!box) return null;

	const land = spring({
		frame: frame - Math.round((beatStart + 0.28) * fps),
		fps,
		durationInFrames: 18,
		config: { damping: 18, stiffness: 160 },
	});
	const pulse = 0.5 + 0.5 * Math.sin(frame / 9);
	const ringScale = interpolate(land, [0, 1], [1.55, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const rgb = hexToRgb(box.color ?? accent);

	return (
		<div
			style={{
				position: 'absolute',
				left: box.x * scale - 10,
				top: (box.y - cropTop) * scale - 10,
				width: box.w * scale + 20,
				height: box.h * scale + 20,
				borderRadius: 18,
				border: `5px solid rgba(${rgb},${0.62 + pulse * 0.35})`,
				background: `rgba(${rgb},${0.14 + pulse * 0.06})`,
				boxShadow: `0 0 ${22 + pulse * 24}px rgba(${rgb},0.68)`,
				opacity: land,
				transform: `scale(${ringScale})`,
				pointerEvents: 'none',
			}}
		/>
	);
};

const ZoomPanel: React.FC<{
	beat: JourneyBeat;
	box: RingBox | null;
	crop: CropRect | null;
	appear: number;
	stillDir: string;
	stillW: number;
	stillH: number;
	accent: string;
}> = ({ beat, box, crop, appear, stillDir, stillW, stillH, accent }) => {
	const panelW = 900;
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const lift = spring({
		frame: frame - Math.round((beat.voStart + 0.35) * fps),
		fps,
		config: { damping: 200 },
	});

	if (!box) return null;

	const padX = Math.max(180, box.w * 0.45);
	const padY = Math.max(180, box.h * 0.55);
	const cropW = crop ? crop.w : Math.min(stillW, box.w + padX * 2);
	const cropH = crop ? crop.h : Math.min(stillH, box.h + padY * 2);
	const cropX = crop ? crop.x : clampNum(box.x + box.w / 2 - cropW / 2, 0, stillW - cropW);
	const cropY = crop ? crop.y : clampNum(box.y + box.h / 2 - cropH / 2, 0, stillH - cropH);
	const panelH = crop?.panelH ?? 360;
	const inset = 18;
	const scale = Math.min((panelW - inset * 2) / cropW, (panelH - inset * 2) / cropH);
	const imageX = (panelW - cropW * scale) / 2;
	const imageY = (panelH - cropH * scale) / 2;
	const rgb = hexToRgb(box.color ?? accent);

	return (
		<div
			style={{
				position: 'relative',
				width: panelW,
				height: panelH,
				borderRadius: 28,
				overflow: 'hidden',
				background: `linear-gradient(135deg, rgba(${rgb},0.08), rgba(255,255,255,0.03)), #0b1219`,
				border: `2px solid rgba(${rgb},0.8)`,
				boxShadow: `0 28px 80px rgba(0,0,0,0.34), 0 0 42px rgba(${rgb},0.25)`,
				opacity: appear,
				transform: `translateY(${interpolate(lift, [0, 1], [18, 0])}px)`,
			}}
		>
			<Img
				src={staticFile(`${stillDir}/${beat.shot}.png`)}
				style={{
					position: 'absolute',
					left: imageX - cropX * scale,
					top: imageY - cropY * scale,
					width: stillW * scale,
					height: stillH * scale,
					filter: 'drop-shadow(0 18px 34px rgba(0,0,0,0.24))',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: imageX + (box.x - cropX) * scale - 8,
					top: imageY + (box.y - cropY) * scale - 8,
					width: box.w * scale + 16,
					height: box.h * scale + 16,
					borderRadius: 18,
					border: `6px solid rgba(${rgb},0.9)`,
					boxShadow: `0 0 36px rgba(${rgb},0.62)`,
					background: `rgba(${rgb},0.14)`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 22,
					bottom: 20,
					background: `rgba(${rgb},0.94)`,
					color: '#fff',
					fontWeight: 900,
					fontSize: 26,
					letterSpacing: 1.4,
					textTransform: 'uppercase',
					padding: '10px 16px',
					borderRadius: 14,
				}}
			>
				Focus here
			</div>
		</div>
	);
};

export const PhoneJourney: React.FC<PhoneJourneyProps> = ({
	timing,
	boxes,
	crops,
	copy,
	stillDir,
	stillW = 720,
	stillH = 1600,
	cropTop = 60,
	footerLabel,
	accent,
	titleCard,
	narrationVolume = 1.22,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const sec = frame / fps;
	const beats = timing.beats;
	const accentRgb = hexToRgb(accent);

	const PHONE_H = 1010;
	const VISIBLE_H = stillH - cropTop;
	const SCALE = PHONE_H / VISIBLE_H;
	const PHONE_W = stillW * SCALE;
	const PHONE_X = 112;
	const PHONE_Y = 34;

	if (beats.length === 0) {
		return (
			<AbsoluteFill
				style={{ background: INK, color: '#fff', fontFamily: FONT, alignItems: 'center', justifyContent: 'center' }}
			>
				Generate journey timing first.
			</AbsoluteFill>
		);
	}

	const active = getActiveIndex(beats, sec);
	const beat = beats[active];
	const box = beat.ring ? boxes[beat.ring] ?? null : null;
	const crop = beat.ring ? crops?.[beat.ring] ?? null : null;
	const beatCopy = copy[beat.id] ?? {
		headline: beat.chip,
		body: beat.text,
		proof: 'Follow the highlighted step.',
	};
	const local = sec - beat.voStart;

	const textIn = interpolate(local, [-0.08, 0.36], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const titleOp = titleCard
		? interpolate(sec, [0, 0.35, 2.25, 3.0], [1, 1, 1, 0], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})
		: 0;
	const bar = interpolate(
		active + clampNum(local / Math.max(beat.duration, 1), 0, 1),
		[0, beats.length],
		[0, 1],
		{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
	);

	return (
		<AbsoluteFill style={{ background: INK, fontFamily: FONT }}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: `radial-gradient(circle at 24% 18%, rgba(${accentRgb},0.16), transparent 26%), radial-gradient(circle at 83% 78%, rgba(${accentRgb},0.10), transparent 30%), linear-gradient(135deg, #111d28, #071018 58%, #05090d)`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: PHONE_X - 26,
					top: PHONE_Y - 18,
					width: PHONE_W + 52,
					height: PHONE_H + 36,
					borderRadius: 48,
					background: 'linear-gradient(145deg, #293544, #0c1117)',
					boxShadow: '0 38px 110px rgba(0,0,0,0.56)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: PHONE_X,
					top: PHONE_Y,
					width: PHONE_W,
					height: PHONE_H,
					borderRadius: 36,
					overflow: 'hidden',
					background: '#fff',
					boxShadow: '0 0 0 3px rgba(255,255,255,0.08), 0 0 0 12px #11161d',
				}}
			>
				{beats.map((b, i) => {
					const next = i + 1 < beats.length ? beats[i + 1].voStart : timing.total_seconds + 1;
					const opacity = interpolate(
						sec,
						[b.voStart - 0.42, b.voStart - 0.08, next - 0.46, next - 0.1],
						[0, 1, 1, 0],
						{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
					);
					if (opacity <= 0) return null;

					return (
						<Img
							key={b.id}
							src={staticFile(`${stillDir}/${b.shot}.png`)}
							style={{
								position: 'absolute',
								left: 0,
								top: -cropTop * SCALE,
								width: '100%',
								height: stillH * SCALE,
								opacity,
							}}
						/>
					);
				})}
				<div
					style={{
						position: 'absolute',
						left: 24,
						top: 40,
						background: 'rgba(7,16,24,0.72)',
						borderRadius: 999,
						padding: '7px 12px',
						color: 'rgba(255,255,255,0.82)',
						fontSize: 16,
						fontWeight: 800,
						letterSpacing: 1.6,
						textTransform: 'uppercase',
					}}
				>
					Step {String(active + 1).padStart(2, '0')}
				</div>
				<PhoneRing box={box} beatStart={beat.voStart} scale={SCALE} cropTop={cropTop} accent={accent} />
			</div>

			<div style={{ position: 'absolute', left: 675, top: 72, width: 1110 }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: textIn }}>
					<div
						style={{
							height: 52,
							padding: '0 22px',
							borderRadius: 999,
							background: `rgba(${accentRgb},0.16)`,
							border: `1px solid rgba(${accentRgb},0.42)`,
							color: accent,
							display: 'flex',
							alignItems: 'center',
							fontSize: 24,
							fontWeight: 900,
							letterSpacing: 2,
							textTransform: 'uppercase',
						}}
					>
						{beat.chip}
					</div>
					<div style={{ color: 'rgba(255,255,255,0.58)', fontSize: 26, fontWeight: 800 }}>
						{active + 1} / {beats.length}
					</div>
				</div>

				<div
					style={{
						marginTop: 32,
						color: '#fff',
						fontSize: 70,
						lineHeight: 1.04,
						fontWeight: 950,
						opacity: textIn,
						transform: `translateY(${interpolate(textIn, [0, 1], [20, 0])}px)`,
						textShadow: '0 10px 32px rgba(0,0,0,0.36)',
					}}
				>
					{beatCopy.headline}
				</div>

				<div
					style={{
						marginTop: 28,
						width: 900,
						color: 'rgba(255,255,255,0.76)',
						fontSize: 35,
						lineHeight: 1.32,
						fontWeight: 650,
						opacity: textIn,
					}}
				>
					{beatCopy.body}
				</div>

				<div style={{ marginTop: 44 }}>
					<ZoomPanel
						beat={beat}
						box={box}
						crop={crop}
						appear={textIn}
						stillDir={stillDir}
						stillW={stillW}
						stillH={stillH}
						accent={accent}
					/>
				</div>

				<div
					style={{
						marginTop: 30,
						display: 'inline-flex',
						alignItems: 'center',
						gap: 12,
						background: 'rgba(255,255,255,0.08)',
						border: '1px solid rgba(255,255,255,0.12)',
						borderRadius: 18,
						padding: '14px 18px',
						color: '#fff',
						fontSize: 26,
						fontWeight: 850,
						opacity: textIn,
					}}
				>
					<div
						style={{
							width: 14,
							height: 14,
							borderRadius: 7,
							background: box?.color ?? accent,
							boxShadow: `0 0 20px ${box?.color ?? accent}`,
						}}
					/>
					{beatCopy.proof}
				</div>
			</div>

			<div
				style={{
					position: 'absolute',
					left: 675,
					bottom: 54,
					width: 1110,
					height: 10,
					borderRadius: 999,
					background: 'rgba(255,255,255,0.12)',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						width: `${bar * 100}%`,
						height: '100%',
						borderRadius: 999,
						background: `linear-gradient(90deg, ${accent}, rgba(${accentRgb},0.55))`,
						boxShadow: `0 0 26px rgba(${accentRgb},0.46)`,
					}}
				/>
			</div>
			<div
				style={{
					position: 'absolute',
					left: 675,
					bottom: 74,
					color: 'rgba(255,255,255,0.45)',
					fontSize: 22,
					fontWeight: 800,
					letterSpacing: 2.2,
					textTransform: 'uppercase',
				}}
			>
				{footerLabel}
			</div>

			{beats.map((item) =>
				item.audio ? (
					<Sequence
						key={item.id}
						from={Math.round(item.voStart * fps)}
						durationInFrames={Math.ceil(item.duration * fps) + 4}
						premountFor={fps}
					>
						<Audio src={staticFile(item.audio)} volume={narrationVolume} />
					</Sequence>
				) : null,
			)}

			{titleCard && titleOp > 0 && (
				<AbsoluteFill
					style={{
						background: 'linear-gradient(135deg, rgba(7,16,24,0.96), rgba(10,22,32,0.92))',
						opacity: titleOp,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<div style={{ color: accent, fontSize: 30, fontWeight: 900, letterSpacing: 5, textTransform: 'uppercase' }}>
						{titleCard.kicker}
					</div>
					<div style={{ color: '#fff', fontSize: 92, fontWeight: 950, marginTop: 20 }}>{titleCard.title}</div>
					<div style={{ color: 'rgba(255,255,255,0.62)', fontSize: 36, fontWeight: 760, marginTop: 20 }}>
						{titleCard.tagline}
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};
