import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

/**
 * EcowizeBookends — the shared branded intro/outro for the e-wizer field-guide
 * series, extracted from the copies in cln/CleaningVerificationBranded.tsx and
 * hygiene/DailyHygieneTutorial.tsx (those keep their local copies untouched).
 * Parameterized so each journey video sets its own title/tagline/accents while
 * the logo lockup, ink background and drifting grid stay series-constant.
 */

export const BOOKEND_INTRO_FRAMES = 150;
export const BOOKEND_OUTRO_FRAMES = 180;
export const SERIES_KICKER = 'e-wizer field guide';

const INK = '#071018';
const FONT = 'Inter, "DM Sans", system-ui, sans-serif';

export type OutroCard = { label: string; color: string };

export const hexToRgb = (hex: string) => {
	const n = parseInt(hex.slice(1), 16);
	return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

export const fadeInOut = (frame: number, duration: number, fade = 18) =>
	interpolate(frame, [0, fade, duration - fade, duration], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

export const MovingGrid: React.FC<{ opacity: number; accent: string }> = ({
	opacity,
	accent,
}) => {
	const frame = useCurrentFrame();
	const drift = frame * 1.5;
	const rgb = hexToRgb(accent);

	return (
		<div
			style={{
				position: 'absolute',
				inset: -140,
				opacity,
				backgroundImage: `linear-gradient(rgba(${rgb},0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(${rgb},0.18) 1px, transparent 1px)`,
				backgroundSize: '72px 72px',
				transform: `translate(${drift % 72}px, ${-(drift % 72)}px) rotate(-8deg)`,
				maskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 72%)',
			}}
		/>
	);
};

export const LogoLockup: React.FC<{
	intro: boolean;
	accentA: string;
	accentB: string;
}> = ({ intro, accentA, accentB }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const rgbA = hexToRgb(accentA);
	const ew = spring({ frame: frame - 14, fps, durationInFrames: 28, config: { damping: 160 } });
	const eco = spring({ frame: frame - 30, fps, durationInFrames: 28, config: { damping: 160 } });
	const split = interpolate(frame, [48, 72], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: 170,
				top: intro ? 168 : 154,
				width: 610,
				height: 520,
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 82,
					width: 276,
					height: 276,
					borderRadius: 44,
					background: 'rgba(255,255,255,0.05)',
					border: '1px solid rgba(255,255,255,0.14)',
					boxShadow: `0 0 ${36 + split * 32}px rgba(${rgbA},0.28)`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					opacity: ew,
					transform: `translateX(${interpolate(split, [0, 1], [112, 0])}px) scale(${interpolate(ew, [0, 1], [0.72, 1])})`,
				}}
			>
				<Img
					src={staticFile('images/ewizer-logo.png')}
					style={{
						width: 214,
						height: 214,
						objectFit: 'contain',
						filter: 'drop-shadow(0 18px 34px rgba(0,0,0,0.42))',
					}}
				/>
			</div>

			<div
				style={{
					position: 'absolute',
					left: 320,
					top: 120,
					width: 290,
					height: 198,
					borderRadius: 34,
					background: '#F7FAFC',
					border: '1px solid rgba(255,255,255,0.26)',
					boxShadow: '0 22px 54px rgba(0,0,0,0.28)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					opacity: eco,
					transform: `translateX(${interpolate(split, [0, 1], [-132, 0])}px) scale(${interpolate(eco, [0, 1], [0.72, 1])})`,
				}}
			>
				<Img
					src={staticFile('images/ecowize-logo.webp')}
					style={{
						width: 244,
						height: 92,
						objectFit: 'contain',
					}}
				/>
			</div>

			<div
				style={{
					position: 'absolute',
					left: 278,
					top: 206,
					width: 50,
					height: 50,
					borderRadius: 25,
					background: `linear-gradient(135deg, ${accentA}, ${accentB})`,
					boxShadow: `0 0 40px rgba(${rgbA},0.62)`,
					opacity: split,
					transform: `scale(${interpolate(split, [0, 1], [0.2, 1])})`,
				}}
			/>
		</div>
	);
};

export const BrandIntro: React.FC<{
	kicker?: string;
	title: string;
	tagline: string;
	accentA: string;
	accentB: string;
}> = ({ kicker = SERIES_KICKER, title, tagline, accentA, accentB }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const rgbA = hexToRgb(accentA);
	const rgbB = hexToRgb(accentB);
	const reveal = spring({ frame, fps, durationInFrames: 34, config: { damping: 180 } });
	const text = spring({ frame: frame - 54, fps, durationInFrames: 28, config: { damping: 180 } });
	const line = interpolate(frame, [80, 122], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const out = interpolate(frame, [132, 150], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{ background: INK, fontFamily: FONT, opacity: out }}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: `radial-gradient(circle at 25% 30%, rgba(${rgbA},0.28), transparent 31%), radial-gradient(circle at 78% 70%, rgba(${rgbB},0.14), transparent 28%), linear-gradient(135deg, #102231, #071018 62%, #04080c)`,
				}}
			/>
			<MovingGrid opacity={0.32} accent={accentA} />
			<LogoLockup intro accentA={accentA} accentB={accentB} />
			<div
				style={{
					position: 'absolute',
					left: 870,
					top: 236,
					width: 800,
					opacity: reveal,
					transform: `translateY(${interpolate(reveal, [0, 1], [28, 0])}px)`,
				}}
			>
				<div
					style={{
						color: accentA,
						fontSize: 28,
						fontWeight: 950,
						letterSpacing: 4.5,
						textTransform: 'uppercase',
					}}
				>
					{kicker}
				</div>
				<div
					style={{
						marginTop: 20,
						color: '#FFFFFF',
						fontSize: 84,
						lineHeight: 0.98,
						fontWeight: 950,
						textShadow: '0 16px 40px rgba(0,0,0,0.34)',
					}}
				>
					{title}
				</div>
				<div
					style={{
						marginTop: 30,
						width: 680,
						color: 'rgba(255,255,255,0.72)',
						fontSize: 34,
						lineHeight: 1.24,
						fontWeight: 760,
						opacity: text,
					}}
				>
					{tagline}
				</div>
				<div
					style={{
						marginTop: 52,
						width: 560 * line,
						height: 8,
						borderRadius: 999,
						background: `linear-gradient(90deg, ${accentA}, ${accentB})`,
						boxShadow: `0 0 28px rgba(${rgbA},0.45)`,
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};

export const BrandOutro: React.FC<{
	outroKicker: string;
	outroHeadline: string;
	outroBody: string;
	outroCards: OutroCard[];
	accentA: string;
	accentB: string;
}> = ({ outroKicker, outroHeadline, outroBody, outroCards, accentA, accentB }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const rgbA = hexToRgb(accentA);
	const rgbB = hexToRgb(accentB);
	const reveal = spring({ frame: frame - 6, fps, durationInFrames: 34, config: { damping: 180 } });
	const fade = fadeInOut(frame, BOOKEND_OUTRO_FRAMES, 22);

	return (
		<AbsoluteFill style={{ background: INK, fontFamily: FONT, opacity: fade }}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: `radial-gradient(circle at 70% 26%, rgba(${rgbA},0.22), transparent 31%), radial-gradient(circle at 24% 78%, rgba(${rgbB},0.12), transparent 28%), linear-gradient(135deg, #071018, #0D1B28 56%, #04080c)`,
				}}
			/>
			<MovingGrid opacity={0.22} accent={accentA} />
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
				<LogoLockup intro={false} accentA={accentA} accentB={accentB} />
			</div>

			<div
				style={{
					position: 'absolute',
					left: 990,
					top: 180,
					width: 720,
					opacity: reveal,
					transform: `translateY(${interpolate(reveal, [0, 1], [26, 0])}px)`,
				}}
			>
				<div
					style={{
						color: accentA,
						fontSize: 26,
						fontWeight: 950,
						letterSpacing: 4,
						textTransform: 'uppercase',
					}}
				>
					{outroKicker}
				</div>
				<div style={{ marginTop: 18, color: '#fff', fontSize: 82, lineHeight: 0.98, fontWeight: 950 }}>
					{outroHeadline}
				</div>
				<div style={{ marginTop: 30, color: 'rgba(255,255,255,0.72)', fontSize: 34, lineHeight: 1.28, fontWeight: 760 }}>
					{outroBody}
				</div>
				<div style={{ display: 'flex', gap: 18, marginTop: 54 }}>
					{outroCards.map((card, index) => {
						const cardReveal = spring({
							frame: frame - (42 + index * 12),
							fps,
							durationInFrames: 22,
							config: { damping: 160 },
						});
						return (
							<div
								key={card.label}
								style={{
									width: 188,
									height: 154,
									borderRadius: 26,
									background: 'rgba(255,255,255,0.07)',
									border: '1px solid rgba(255,255,255,0.14)',
									boxShadow: `0 18px 42px rgba(0,0,0,0.22), 0 0 30px rgba(${hexToRgb(card.color)},0.18)`,
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
										background: card.color,
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
								<div style={{ marginTop: 18, color: '#fff', fontSize: 28, fontWeight: 900 }}>{card.label}</div>
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};
