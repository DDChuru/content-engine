import type { CSSProperties } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { FONT, INK, TEAL, TEAL_DARK, clamp, easeOutExpo } from './conventions';

type StatementTone = 'ink' | 'light';

const DARK_GROUND =
	'linear-gradient(180deg, rgba(15,23,42,1), rgba(30,41,59,1))';
const LIGHT_GROUND = 'linear-gradient(160deg,#FFFFFF,#F2F6FA)';

const EwizerLogo = ({
	wordmarkColor,
	markSize,
	fontSize,
	gap = 18,
	glow = true,
	opacity = 1,
	style,
}: {
	wordmarkColor: string;
	markSize: number;
	fontSize: number;
	gap?: number;
	glow?: boolean;
	opacity?: number;
	style?: CSSProperties;
}) => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap,
				opacity,
				...style,
			}}
		>
			<div
				style={{
					width: markSize,
					height: markSize,
					borderRadius: Math.round(markSize * 0.3),
					background: `rgb(${TEAL})`,
					boxShadow: glow
						? '0 0 34px rgba(20,184,166,0.45)'
						: '0 10px 22px rgba(20,184,166,0.20)',
				}}
			/>
			<div
				style={{
					color: wordmarkColor,
					fontSize,
					fontWeight: 900,
					letterSpacing: -0.4,
					fontFamily: FONT,
				}}
			>
				e-wizer
			</div>
		</div>
	);
};

const resolveIcon = (icon: string | undefined, index: number) => {
	const value = icon?.toLowerCase() ?? '';

	if (
		value.includes('people') ||
		value.includes('person') ||
		value.includes('team') ||
		value.includes('user')
	) {
		return 'people';
	}

	if (
		value.includes('site') ||
		value.includes('building') ||
		value.includes('factory') ||
		value.includes('plant')
	) {
		return 'site';
	}

	if (
		value.includes('you') ||
		value.includes('shield') ||
		value.includes('check') ||
		value.includes('protect')
	) {
		return 'shield';
	}

	if (index === 0) {
		return 'people';
	}

	if (index === 1) {
		return 'site';
	}

	return 'shield';
};

const IconGlyph = ({
	icon,
	index,
}: {
	icon?: string;
	index: number;
}) => {
	const kind = resolveIcon(icon, index);
	const common = {
		fill: 'none',
		stroke: TEAL_DARK,
		strokeWidth: 2.2,
		strokeLinecap: 'round' as const,
		strokeLinejoin: 'round' as const,
	};

	return (
		<svg
			viewBox="0 0 24 24"
			width={56}
			height={56}
			aria-hidden="true"
			style={{ display: 'block' }}
		>
			{kind === 'people' ? (
				<>
					<circle {...common} cx="9" cy="8" r="3" />
					<path {...common} d="M3.8 20c.5-3.2 2.4-5 5.2-5s4.7 1.8 5.2 5" />
					<circle {...common} cx="16.8" cy="9.2" r="2.4" />
					<path {...common} d="M14.8 15.8c2.9.2 4.7 1.8 5.2 4.2" />
				</>
			) : null}

			{kind === 'site' ? (
				<>
					<path {...common} d="M4 20V9.4l5 3.1V9.4l5 3.1V6h5v14H4Z" />
					<path {...common} d="M7.2 16.4h1.6" />
					<path {...common} d="M11.2 16.4h1.6" />
					<path {...common} d="M15.2 16.4h1.6" />
					<path {...common} d="M16.5 6V4" />
				</>
			) : null}

			{kind === 'shield' ? (
				<>
					<path {...common} d="M12 21s7-3.8 7-10V5l-7-3-7 3v6c0 6.2 7 10 7 10Z" />
					<path {...common} d="m8.8 11.7 2.2 2.2 4.6-5" />
				</>
			) : null}
		</svg>
	);
};

export const LogoOpen = ({ headline }: { headline: string }) => {
	const frame = useCurrentFrame();

	const flashOpacity = interpolate(frame, [0, 5], [0.58, 0], clamp);
	const markIn = interpolate(frame, [6, 32], [0, 1], {
		...clamp,
		easing: easeOutExpo,
	});
	const wordIn = interpolate(frame, [14, 42], [0, 1], {
		...clamp,
		easing: easeOutExpo,
	});
	const headlineIn = interpolate(frame, [34, 70], [0, 1], {
		...clamp,
		easing: easeOutExpo,
	});
	const underlineIn = interpolate(frame, [58, 88], [0, 1], {
		...clamp,
		easing: easeOutExpo,
	});
	const stackShift = interpolate(frame, [34, 70], [70, 0], {
		...clamp,
		easing: easeOutExpo,
	});

	return (
		<AbsoluteFill
			style={{
				background: DARK_GROUND,
				fontFamily: FONT,
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'linear-gradient(90deg, rgba(255,255,255,0.035), transparent 24%, transparent 76%, rgba(255,255,255,0.025))',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 0,
					height: 8,
					background: `rgba(${TEAL},0.92)`,
					opacity: interpolate(frame, [12, 38], [0, 1], {
						...clamp,
						easing: easeOutExpo,
					}),
				}}
			/>

			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '120px 150px',
					transform: `translateY(${stackShift}px)`,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 34,
					}}
				>
					<div
						style={{
							width: 58,
							height: 58,
							borderRadius: 17,
							background: `rgb(${TEAL})`,
							opacity: markIn,
							transform: `scale(${interpolate(markIn, [0, 1], [0.72, 1], clamp)})`,
							boxShadow:
								'0 0 54px rgba(20,184,166,0.52), 0 22px 70px rgba(20,184,166,0.28)',
						}}
					/>
					<div
						style={{
							color: '#FFFFFF',
							fontSize: 112,
							fontWeight: 900,
							letterSpacing: -0.4,
							opacity: wordIn,
							transform: `translateX(${interpolate(wordIn, [0, 1], [-20, 0], clamp)}px)`,
							textShadow: '0 24px 70px rgba(2,6,23,0.36)',
						}}
					>
						e-wizer
					</div>
					<svg
						viewBox="0 0 22 30"
						width={22}
						height={30}
						aria-hidden="true"
						style={{
							opacity: interpolate(frame, [26, 48], [0, 0.88], {
								...clamp,
								easing: easeOutExpo,
							}),
							transform: `translateY(${interpolate(frame, [26, 48], [10, 0], {
								...clamp,
								easing: easeOutExpo,
							})}px)`,
						}}
					>
						<path
							d="M11 2C7.4 7.1 4.2 11.2 4.2 16.1a6.8 6.8 0 0 0 13.6 0C17.8 11.2 14.6 7.1 11 2Z"
							fill={`rgba(${TEAL},0.86)`}
						/>
					</svg>
				</div>

				<div
					style={{
						marginTop: 48,
						maxWidth: 1300,
						color: '#FFFFFF',
						fontSize: 68,
						fontWeight: 900,
						letterSpacing: -0.5,
						lineHeight: 1.12,
						textAlign: 'center',
						opacity: headlineIn,
						transform: `translateY(${interpolate(headlineIn, [0, 1], [30, 0], clamp)}px)`,
						textShadow: '0 22px 70px rgba(2,6,23,0.34)',
					}}
				>
					{headline}
				</div>

				<div
					style={{
						marginTop: 36,
						width: 340,
						height: 8,
						borderRadius: 999,
						background: `rgb(${TEAL})`,
						transform: `scaleX(${underlineIn})`,
						transformOrigin: 'center',
						boxShadow: '0 14px 36px rgba(20,184,166,0.28)',
					}}
				/>
			</div>

			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: '#020617',
					opacity: flashOpacity,
				}}
			/>
		</AbsoluteFill>
	);
};

export const Statement = ({
	text,
	kicker,
	tone = 'ink',
}: {
	text: string;
	kicker?: string;
	tone?: StatementTone;
}) => {
	const frame = useCurrentFrame();
	const isLight = tone === 'light';
	const textColor = isLight ? INK : '#FFFFFF';
	const logoColor = isLight ? INK : '#FFFFFF';

	const kickerIn = interpolate(frame, [0, 28], [0, 1], {
		...clamp,
		easing: easeOutExpo,
	});
	const textIn = interpolate(frame, [12, 54], [0, 1], {
		...clamp,
		easing: easeOutExpo,
	});
	const underlineIn = interpolate(frame, [46, 82], [0, 1], {
		...clamp,
		easing: easeOutExpo,
	});

	return (
		<AbsoluteFill
			style={{
				background: isLight ? LIGHT_GROUND : DARK_GROUND,
				fontFamily: FONT,
				color: textColor,
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: isLight ? '72px 78px' : 0,
					borderRadius: isLight ? 24 : 0,
					border: isLight ? '1px solid rgba(226,232,240,0.9)' : undefined,
					boxShadow: isLight
						? '0 36px 90px rgba(15,23,42,0.10)'
						: undefined,
					pointerEvents: 'none',
				}}
			/>
			<EwizerLogo
				wordmarkColor={logoColor}
				markSize={22}
				fontSize={30}
				gap={12}
				glow={!isLight}
				opacity={isLight ? 0.86 : 0.9}
				style={{
					position: 'absolute',
					top: 64,
					left: 72,
				}}
			/>

			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '120px 160px',
					textAlign: 'center',
				}}
			>
				{kicker ? (
					<div
						style={{
							color: isLight ? TEAL_DARK : `rgb(${TEAL})`,
							fontSize: 24,
							fontWeight: 900,
							letterSpacing: 2.6,
							textTransform: 'uppercase',
							marginBottom: 28,
							opacity: kickerIn,
							transform: `translateY(${interpolate(kickerIn, [0, 1], [18, 0], clamp)}px)`,
						}}
					>
						{kicker}
					</div>
				) : null}

				<div
					style={{
						maxWidth: 1400,
						fontSize: 72,
						fontWeight: 900,
						lineHeight: 1.12,
						letterSpacing: -0.5,
						opacity: textIn,
						transform: `translateY(${interpolate(textIn, [0, 1], [30, 0], clamp)}px)`,
						textShadow: isLight ? undefined : '0 24px 70px rgba(2,6,23,0.30)',
					}}
				>
					{text}
				</div>

				<div
					style={{
						marginTop: 42,
						width: 320,
						height: 8,
						borderRadius: 999,
						background: `rgb(${TEAL})`,
						transform: `scaleX(${underlineIn})`,
						transformOrigin: 'center',
						boxShadow: '0 14px 36px rgba(20,184,166,0.24)',
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};

export const ProtectTriad = ({
	items,
}: {
	items: Array<{ label: string; icon?: string }>;
}) => {
	const frame = useCurrentFrame();
	const fallbackItems = [
		{ label: 'People', icon: 'people' },
		{ label: 'Site', icon: 'site' },
		{ label: 'You', icon: 'shield' },
	];
	const cards = [0, 1, 2].map((index) => items[index] ?? fallbackItems[index]);

	const headerIn = interpolate(frame, [0, 32], [0, 1], {
		...clamp,
		easing: easeOutExpo,
	});

	return (
		<AbsoluteFill
			style={{
				background: LIGHT_GROUND,
				fontFamily: FONT,
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: '70px 76px',
					border: '1px solid rgba(226,232,240,0.9)',
					borderRadius: 24,
					boxShadow: '0 36px 90px rgba(15,23,42,0.10)',
				}}
			/>
			<EwizerLogo
				wordmarkColor={INK}
				markSize={22}
				fontSize={30}
				gap={12}
				glow={false}
				opacity={0.86}
				style={{
					position: 'absolute',
					top: 64,
					left: 72,
				}}
			/>

			<div
				style={{
					position: 'absolute',
					top: 166,
					left: 0,
					right: 0,
					textAlign: 'center',
					color: TEAL_DARK,
					fontSize: 24,
					fontWeight: 900,
					letterSpacing: 2.6,
					textTransform: 'uppercase',
					opacity: headerIn,
					transform: `translateY(${interpolate(headerIn, [0, 1], [18, 0], clamp)}px)`,
				}}
			>
				What a captured incident protects
			</div>

			<div
				style={{
					position: 'absolute',
					left: 120,
					right: 120,
					top: 326,
					display: 'flex',
					justifyContent: 'center',
					gap: 38,
				}}
			>
				{cards.map((item, index) => {
					const start = index * 8;
					const cardIn = interpolate(frame, [start, start + 30], [0, 1], {
						...clamp,
						easing: easeOutExpo,
					});

					return (
						<div
							key={`${item.label}-${index}`}
							style={{
								position: 'relative',
								width: 500,
								minHeight: 360,
								borderRadius: 18,
								border: '1px solid #E2E8F0',
								background: '#FFFFFF',
								boxShadow:
									'0 28px 70px rgba(15,23,42,0.18), 0 10px 24px rgba(15,23,42,0.08)',
								padding: '62px 48px 52px',
								overflow: 'hidden',
								opacity: cardIn,
								transform: `translateY(${interpolate(cardIn, [0, 1], [44, 0], clamp)}px) scale(${interpolate(
									cardIn,
									[0, 1],
									[0.96, 1],
									clamp,
								)})`,
							}}
						>
							<div
								style={{
									position: 'absolute',
									left: 0,
									right: 0,
									top: 0,
									height: 7,
									background: `rgb(${TEAL})`,
								}}
							/>
							<div
								style={{
									width: 104,
									height: 104,
									borderRadius: 24,
									background: `rgba(${TEAL},0.14)`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: 'inset 0 0 0 1px rgba(20,184,166,0.18)',
								}}
							>
								<IconGlyph icon={item.icon} index={index} />
							</div>
							<div
								style={{
									marginTop: 34,
									color: INK,
									fontSize: 40,
									fontWeight: 900,
									letterSpacing: -0.35,
									lineHeight: 1.08,
								}}
							>
								{item.label}
							</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
