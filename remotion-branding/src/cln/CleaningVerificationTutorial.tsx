import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Img,
	Sequence,
	spring,
	staticFile,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import timing from './timing.json';

/**
 * e-wizer — Cleaning Verification, step by step (Bakery Demo shoot 2026-06-11).
 *
 * Per-beat phone stills (720×1604) on an Ecowize-dark canvas, pulsing ring on
 * the EXACT button to press (boxes in still-pixel space, scaled with the
 * phone), step chip + large side captions, per-beat ElevenLabs audio.
 */

// Ecowize register
const SKY = '#3CB6E0';
const EMERALD = '#1F9C5A';
const AMBER = '#E89A30';
const CORAL = '#D6432F';
const HERO_FROM = '#1A2330';
const HERO_TO = '#0B1219';
const FONT = 'Inter, "DM Sans", system-ui, sans-serif';

// Ring boxes in STILL pixel space (720×1604)
const BOXES: Record<string, { x: number; y: number; w: number; h: number; color?: string }> = {
	scanFrame: { x: 103, y: 517, w: 515, h: 515, color: SKY },
	progressCard: { x: 43, y: 382, w: 634, h: 198, color: EMERALD },
	greenTick: { x: 72, y: 405, w: 90, h: 85, color: EMERALD },
	remedialBanner: { x: 40, y: 410, w: 640, h: 184, color: CORAL },
	photoArea: { x: 20, y: 415, w: 680, h: 535, color: CORAL },
	majorChip: { x: 270, y: 972, w: 180, h: 94, color: AMBER },
	actionBox: { x: 72, y: 540, w: 576, h: 117, color: AMBER },
	dialog: { x: 50, y: 670, w: 620, h: 310, color: SKY },
	passRemaining: { x: 36, y: 1217, w: 648, h: 103, color: SKY },
	followBanner: { x: 22, y: 711, w: 676, h: 108, color: AMBER },
	confirmFollowedUp: { x: 58, y: 1044, w: 604, h: 86, color: EMERALD },
	confirmBtn: { x: 369, y: 1148, w: 292, h: 85, color: EMERALD },
};

const STILL_W = 720;
const STILL_H = 1604;
const CROP_TOP = 62; // hide the device status bar (carrier/notification icons)
const VISIBLE_H = STILL_H - CROP_TOP;
const PHONE_H = 980;
const SCALE = PHONE_H / VISIBLE_H;
const PHONE_W = STILL_W * SCALE;
const PHONE_X = 210;
const PHONE_Y = (1080 - PHONE_H) / 2;

type Beat = (typeof timing.beats)[number];

const hexToRgb = (hex: string) => {
	const n = parseInt(hex.slice(1), 16);
	return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

export const CleaningVerificationTutorial: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const sec = frame / fps;
	const pulse = 0.5 + 0.5 * Math.sin(frame / 11);
	const beats = timing.beats as Beat[];

	let active = 0;
	for (let i = 0; i < beats.length; i++) if (sec >= beats[i].voStart - 0.2) active = i;
	const beat = beats[active];
	const box = beat.ring ? BOXES[beat.ring] : null;

	const beatStart = beats[active].voStart;
	const appear = (d = 0) =>
		interpolate(sec, [beatStart - 0.2 + d, beatStart + 0.35 + d], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});

	// Title card over the first second
	const titleOp = interpolate(sec, [0, 0.4, 2.6, 3.4], [1, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(135deg, ${HERO_FROM}, ${HERO_TO})`,
				fontFamily: FONT,
			}}
		>
			{/* soft sky glow */}
			<div
				style={{
					position: 'absolute',
					right: -200,
					top: -200,
					width: 700,
					height: 700,
					borderRadius: 700,
					background: `radial-gradient(circle, rgba(60,182,224,0.18), transparent 70%)`,
				}}
			/>

			{/* phone — per-beat stills crossfaded */}
			<div
				style={{
					position: 'absolute',
					left: PHONE_X,
					top: PHONE_Y,
					width: PHONE_W,
					height: PHONE_H,
					borderRadius: 34,
					overflow: 'hidden',
					boxShadow: '0 40px 90px rgba(0,0,0,0.55), 0 0 0 10px #11161d, 0 0 0 12px #2a3340',
				}}
			>
				{beats.map((b, i) => {
					const next = i + 1 < beats.length ? beats[i + 1].voStart : timing.total_seconds + 1;
					const op = interpolate(
						sec,
						[b.voStart - 0.5, b.voStart - 0.1, next - 0.5, next - 0.1],
						[0, 1, 1, 0],
						{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
					);
					if (op <= 0) return null;
					return (
						<Img
							key={i}
							src={staticFile(`cln-tutorial/shots/${b.shot}.png`)}
							style={{
								position: 'absolute',
								left: 0,
								top: -CROP_TOP * SCALE,
								width: '100%',
								height: STILL_H * SCALE,
								opacity: op,
							}}
						/>
					);
				})}

				{/* ring on the button to press: lands with a spring (scale 1.7 → 1 +
				    fill fade-in), then keeps a soft pulse so the eye stays on it */}
				{box &&
					(() => {
						const landDelay = Math.round((beatStart + 0.4) * fps);
						const land = spring({
							frame: frame - landDelay,
							fps,
							config: { damping: 13, stiffness: 110 },
						});
						const scale = interpolate(land, [0, 1], [1.7, 1]);
						const rgb = hexToRgb(box.color ?? SKY);
						return (
							<div
								style={{
									position: 'absolute',
									left: box.x * SCALE - 8,
									top: (box.y - CROP_TOP) * SCALE - 8,
									width: box.w * SCALE + 16,
									height: box.h * SCALE + 16,
									borderRadius: 16,
									border: `4px solid rgba(${rgb},${0.55 + pulse * 0.45})`,
									background: `rgba(${rgb},${0.16 * land})`,
									boxShadow: `0 0 ${14 + pulse * 20}px rgba(${rgb},0.55)`,
									opacity: land,
									transform: `scale(${scale})`,
									pointerEvents: 'none',
								}}
							/>
						);
					})()}
			</div>

			{/* right panel */}
			<div style={{ position: 'absolute', left: 760, top: 130, width: 1040 }}>
				<div
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 14,
						opacity: appear(),
					}}
				>
					<div
						style={{
							width: 56,
							height: 56,
							borderRadius: 28,
							background: SKY,
							color: '#fff',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontWeight: 800,
							fontSize: 28,
						}}
					>
						{active + 1}
					</div>
					<div
						style={{
							color: SKY,
							fontWeight: 800,
							fontSize: 30,
							letterSpacing: 3,
							textTransform: 'uppercase',
						}}
					>
						{beat.chip}
					</div>
				</div>

				<div
					style={{
						marginTop: 38,
						color: '#fff',
						fontWeight: 700,
						fontSize: 52,
						lineHeight: 1.28,
						opacity: appear(0.1),
						textShadow: '0 4px 24px rgba(0,0,0,0.45)',
					}}
				>
					{beat.text}
				</div>

				{/* before/after reveal on the verify beat */}
				{beat.id === 'close' && (
					<div style={{ display: 'flex', gap: 24, marginTop: 48, opacity: appear(0.5) }}>
						{[
							{ src: 'cln-tutorial/dirty-rounder.png', label: 'FOUND', color: CORAL },
							{ src: 'cln-tutorial/clean-rounder.png', label: 'VERIFIED', color: EMERALD },
						].map((p) => (
							<div key={p.label} style={{ position: 'relative' }}>
								<Img
									src={staticFile(p.src)}
									style={{
										width: 460,
										height: 290,
										objectFit: 'cover',
										borderRadius: 18,
										boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
									}}
								/>
								<div
									style={{
										position: 'absolute',
										left: 14,
										top: 14,
										background: p.color,
										color: '#fff',
										fontWeight: 800,
										fontSize: 22,
										letterSpacing: 2,
										padding: '6px 14px',
										borderRadius: 10,
									}}
								>
									{p.label}
								</div>
							</div>
						))}
					</div>
				)}

				{/* progress dots */}
				<div style={{ position: 'absolute', top: 800, display: 'flex', gap: 12 }}>
					{beats.map((_, i) => (
						<div
							key={i}
							style={{
								width: i === active ? 34 : 12,
								height: 12,
								borderRadius: 6,
								background: i <= active ? SKY : 'rgba(255,255,255,0.18)',
								transition: 'none',
							}}
						/>
					))}
				</div>
			</div>

			{/* brand footer */}
			<div
				style={{
					position: 'absolute',
					left: 760,
					bottom: 60,
					color: 'rgba(255,255,255,0.45)',
					fontSize: 24,
					fontWeight: 600,
					letterSpacing: 2,
				}}
			>
				e-wizer · Conformance — Cleaning Verification
			</div>

			{/* per-beat audio */}
			{beats.map((b, i) => (
				<Sequence key={i} from={Math.round(b.voStart * fps)} durationInFrames={Math.ceil(b.duration * fps) + 4}>
					<Audio src={staticFile(b.audio)} />
				</Sequence>
			))}

			{/* opening title */}
			{titleOp > 0 && (
				<AbsoluteFill
					style={{
						background: 'rgba(11,18,25,0.86)',
						opacity: titleOp,
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
						gap: 18,
					}}
				>
					<div style={{ color: SKY, fontWeight: 800, fontSize: 30, letterSpacing: 6, textTransform: 'uppercase' }}>
						e-wizer field guide
					</div>
					<div style={{ color: '#fff', fontWeight: 800, fontSize: 84 }}>Cleaning Verification</div>
					<div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 34 }}>
						Scan · Check · Record · Follow up
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

export const CLN_TUTORIAL_FRAMES = timing.total_frames;
export const CLN_TUTORIAL_FPS = timing.fps;
