import React from 'react';
import {
	AbsoluteFill,
	Audio,
	OffthreadVideo,
	Sequence,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { BrandIntro, LogoLockup } from '../brand/EcowizeBookends';
import { CLN_TUTORIAL_V3_FPS, CLN_TUTORIAL_V3_FRAMES } from './CleaningVerificationTutorialV2';

const SKY = '#3CB6E0';
const LIME = '#B9FF00';
const INK = '#071018';
const PANEL = '#0E1822';
const FONT = 'Inter, "DM Sans", system-ui, sans-serif';

export const CLN_BRANDED_INTRO_FRAMES = 150;
export const CLN_BRANDED_OUTRO_FRAMES = 180;
export const CLN_BRANDED_FPS = CLN_TUTORIAL_V3_FPS;
export const CLN_BRANDED_FRAMES =
	CLN_BRANDED_INTRO_FRAMES + CLN_TUTORIAL_V3_FRAMES + CLN_BRANDED_OUTRO_FRAMES;

const MUSIC = 'cln-tutorial/audio/tutorial.mp3';
const BASE_VIDEO = 'cln-tutorial/base/e-wizerinspection-v3.mp4';

const fadeInOut = (frame: number, duration: number, fade = 18) =>
	interpolate(frame, [0, fade, duration - fade, duration], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

const MovingGrid: React.FC<{ opacity: number }> = ({ opacity }) => {
	const frame = useCurrentFrame();
	const drift = frame * 1.6;

	return (
		<div
			style={{
				position: 'absolute',
				inset: -140,
				opacity,
				backgroundImage:
					'linear-gradient(rgba(60,182,224,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(60,182,224,0.18) 1px, transparent 1px)',
				backgroundSize: '72px 72px',
				transform: `translate(${drift % 72}px, ${-(drift % 72)}px) rotate(-8deg)`,
				maskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 72%)',
			}}
		/>
	);
};


const BrandOutro: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const reveal = spring({ frame: frame - 6, fps, durationInFrames: 34, config: { damping: 180 } });
	const cards = ['Found', 'Fixed', 'Verified'];
	const fade = fadeInOut(frame, CLN_BRANDED_OUTRO_FRAMES, 22);

	return (
		<AbsoluteFill style={{ background: INK, fontFamily: FONT, opacity: fade }}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'radial-gradient(circle at 70% 26%, rgba(60,182,224,0.22), transparent 31%), radial-gradient(circle at 24% 78%, rgba(185,255,0,0.12), transparent 28%), linear-gradient(135deg, #071018, #0D1B28 56%, #04080c)',
				}}
			/>
			<MovingGrid opacity={0.22} />
			<div
				style={{
					position: 'absolute',
					left: 150,
					top: 154,
					width: 650,
					height: 690,
					borderRadius: 44,
					background: 'rgba(255,255,255,0.045)',
					border: '1px solid rgba(255,255,255,0.12)',
					boxShadow: '0 30px 90px rgba(0,0,0,0.3)',
					opacity: reveal,
					transform: `translateY(${interpolate(reveal, [0, 1], [28, 0])}px)`,
				}}
			>
				<LogoLockup intro={false} accentA={SKY} accentB={LIME} left={20} />
			</div>

			<div
				style={{
					position: 'absolute',
					left: 900,
					top: 180,
					width: 760,
					opacity: reveal,
					transform: `translateY(${interpolate(reveal, [0, 1], [26, 0])}px)`,
				}}
			>
				<div style={{ color: SKY, fontSize: 26, fontWeight: 950, letterSpacing: 4, textTransform: 'uppercase' }}>
					loop closed
				</div>
				<div style={{ marginTop: 18, color: '#fff', fontSize: 86, lineHeight: 0.98, fontWeight: 950 }}>
					Found. Fixed. Verified.
				</div>
				<div style={{ marginTop: 30, color: 'rgba(255,255,255,0.72)', fontSize: 34, lineHeight: 1.28, fontWeight: 760 }}>
					Keep every remedial visible until it is closed.
				</div>
				<div style={{ display: 'flex', gap: 18, marginTop: 54 }}>
					{cards.map((card, index) => {
						const cardReveal = spring({
							frame: frame - (42 + index * 12),
							fps,
							durationInFrames: 22,
							config: { damping: 160 },
						});
						const color = index === 0 ? SKY : index === 1 ? '#E89A30' : '#1F9C5A';
						return (
							<div
								key={card}
								style={{
									width: 188,
									height: 154,
									borderRadius: 26,
									background: 'rgba(255,255,255,0.07)',
									border: `1px solid rgba(255,255,255,0.14)`,
									boxShadow: `0 18px 42px rgba(0,0,0,0.22), 0 0 30px rgba(${index === 2 ? '31,156,90' : index === 1 ? '232,154,48' : '60,182,224'},0.18)`,
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									opacity: cardReveal,
									transform: `translateY(${interpolate(cardReveal, [0, 1], [20, 0])}px)`,
								}}
							>
								<div
									style={{
										width: 58,
										height: 58,
										borderRadius: 29,
										background: color,
										color: '#fff',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 28,
										fontWeight: 950,
									}}
								>
									{index + 1}
								</div>
								<div style={{ marginTop: 18, color: '#fff', fontSize: 30, fontWeight: 900 }}>{card}</div>
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};

const BookendAudio: React.FC = () => {
	const mainStart = CLN_BRANDED_INTRO_FRAMES;
	const outroStart = CLN_BRANDED_INTRO_FRAMES + CLN_TUTORIAL_V3_FRAMES;

	return (
		<>
			<Sequence from={0} durationInFrames={CLN_BRANDED_INTRO_FRAMES} premountFor={CLN_BRANDED_FPS}>
				<Audio
					src={staticFile(MUSIC)}
					volume={(f) => 0.72 * fadeInOut(f, CLN_BRANDED_INTRO_FRAMES, 24)}
				/>
			</Sequence>
			<Sequence from={outroStart} durationInFrames={CLN_BRANDED_OUTRO_FRAMES} premountFor={CLN_BRANDED_FPS}>
				<Audio
					src={staticFile(MUSIC)}
					volume={(f) => 0.76 * fadeInOut(f, CLN_BRANDED_OUTRO_FRAMES, 28)}
				/>
			</Sequence>
			<Sequence from={mainStart} durationInFrames={CLN_TUTORIAL_V3_FRAMES} premountFor={CLN_BRANDED_FPS}>
				<OffthreadVideo
					src={staticFile(BASE_VIDEO)}
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>
			</Sequence>
		</>
	);
};

export const CleaningVerificationTutorialV3Branded: React.FC = () => {
	const outroStart = CLN_BRANDED_INTRO_FRAMES + CLN_TUTORIAL_V3_FRAMES;

	return (
		<AbsoluteFill style={{ background: PANEL }}>
			<BookendAudio />
			<Sequence from={0} durationInFrames={CLN_BRANDED_INTRO_FRAMES} premountFor={CLN_BRANDED_FPS}>
				<BrandIntro
					kicker="e-wizer field guide"
					title="Cleaning Verification"
					tagline="Scan. Check. Record. Follow up."
					accentA={SKY}
					accentB={LIME}
				/>
			</Sequence>
			<Sequence from={outroStart} durationInFrames={CLN_BRANDED_OUTRO_FRAMES} premountFor={CLN_BRANDED_FPS}>
				<BrandOutro />
			</Sequence>
		</AbsoluteFill>
	);
};
