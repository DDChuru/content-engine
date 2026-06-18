/**
 * UCL Predictions TikTok (9:16)
 *
 * "I got Gemini, ChatGPT and Claude to Predict the Champions League"
 * 3 AIs predict from R16 → QF → SF → Final → Champion.
 *
 * Architecture: 3 scenes — Hook, Bracket (virtual canvas + camera), Champion.
 * The bracket scene renders on a 1400×1800 virtual canvas with camera
 * pan/zoom driven by narration cues.
 *
 * ~86 seconds, 1080×1920, 30fps.
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from 'remotion';

// ── Constants ────────────────────────────────────────────────────────
const FPS = 30;
const TOTAL_DURATION_S = 86;

// Virtual canvas for the bracket
const CANVAS_W = 1400;
const CANVAS_H = 1800;
const VIEWPORT_W = 1080;
const VIEWPORT_H = 1920;

// ── Theme ────────────────────────────────────────────────────────────
const T = {
  bg: '#0a0a1a',
  bgDeep: '#050510',
  surface: '#111133',
  surfaceLight: '#1a1a44',
  text: '#f5f5ff',
  textMuted: '#8892b0',
  primary: '#00d4ff',
  gold: '#ffd700',
  silver: '#c0c0c0',
  uclBlue: '#0d1b5e',
  uclNavy: '#091442',
  starWhite: '#e8e8f0',
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── AI Branding ──────────────────────────────────────────────────────
const AI = {
  claude: { name: 'Claude', color: '#D97757', icon: 'C', bg: '#D9775720' },
  chatgpt: { name: 'ChatGPT', color: '#10A37F', icon: 'G', bg: '#10A37F20' },
  gemini: { name: 'Gemini', color: '#4285F4', icon: '✦', bg: '#4285F420' },
};

// ── Team Data ────────────────────────────────────────────────────────
interface TeamInfo {
  name: string;
  abbr: string;
  primary: string;
  secondary: string;
  textColor: string;
}

const TEAMS: Record<string, TeamInfo> = {
  PSG: { name: 'PSG', abbr: 'PSG', primary: '#004170', secondary: '#DA291C', textColor: '#FFF' },
  CHE: { name: 'Chelsea', abbr: 'CHE', primary: '#034694', secondary: '#D4AF37', textColor: '#FFF' },
  GAL: { name: 'Galatasaray', abbr: 'GAL', primary: '#FF6600', secondary: '#AA151B', textColor: '#FFF' },
  LIV: { name: 'Liverpool', abbr: 'LIV', primary: '#C8102E', secondary: '#F6EB61', textColor: '#FFF' },
  RMA: { name: 'Real Madrid', abbr: 'RMA', primary: '#FEBE10', secondary: '#00529F', textColor: '#1a1a2e' },
  MCI: { name: 'Man City', abbr: 'MCI', primary: '#6CABDD', secondary: '#1C2C5B', textColor: '#FFF' },
  ATA: { name: 'Atalanta', abbr: 'ATA', primary: '#1A428A', secondary: '#000', textColor: '#FFF' },
  BAY: { name: 'Bayern', abbr: 'BAY', primary: '#DC052D', secondary: '#0066B2', textColor: '#FFF' },
  NEW: { name: 'Newcastle', abbr: 'NEW', primary: '#241F20', secondary: '#FFF', textColor: '#FFF' },
  BAR: { name: 'Barcelona', abbr: 'BAR', primary: '#A50044', secondary: '#004D98', textColor: '#FFF' },
  ATM: { name: 'Atletico', abbr: 'ATM', primary: '#CB3524', secondary: '#272E61', textColor: '#FFF' },
  TOT: { name: 'Tottenham', abbr: 'TOT', primary: '#132257', secondary: '#FFF', textColor: '#FFF' },
  BOD: { name: 'Bodø/Glimt', abbr: 'BOD', primary: '#FFD700', secondary: '#000', textColor: '#000' },
  SPO: { name: 'Sporting', abbr: 'SPO', primary: '#00A651', secondary: '#FFF', textColor: '#FFF' },
  LEV: { name: 'Leverkusen', abbr: 'LEV', primary: '#E32221', secondary: '#000', textColor: '#FFF' },
  ARS: { name: 'Arsenal', abbr: 'ARS', primary: '#EF0107', secondary: '#023474', textColor: '#FFF' },
};

// ── Predictions Data ─────────────────────────────────────────────────
interface MatchPrediction {
  teamA: string;
  teamB: string;
  claude: string;
  chatgpt: string;
  gemini: string;
}

const R16: MatchPrediction[] = [
  { teamA: 'PSG', teamB: 'CHE', claude: 'CHE', chatgpt: 'PSG', gemini: 'PSG' },
  { teamA: 'GAL', teamB: 'LIV', claude: 'LIV', chatgpt: 'GAL', gemini: 'LIV' },
  { teamA: 'RMA', teamB: 'MCI', claude: 'RMA', chatgpt: 'RMA', gemini: 'MCI' },
  { teamA: 'ATA', teamB: 'BAY', claude: 'BAY', chatgpt: 'ATA', gemini: 'ATA' },
  { teamA: 'NEW', teamB: 'BAR', claude: 'BAR', chatgpt: 'NEW', gemini: 'NEW' },
  { teamA: 'ATM', teamB: 'TOT', claude: 'ATM', chatgpt: 'ATM', gemini: 'TOT' },
  { teamA: 'BOD', teamB: 'SPO', claude: 'SPO', chatgpt: 'BOD', gemini: 'SPO' },
  { teamA: 'LEV', teamB: 'ARS', claude: 'ARS', chatgpt: 'ARS', gemini: 'ARS' },
];

// Each AI's actual QF matchups (they differ based on R16 picks)
const QF_BY_AI = {
  claude: [
    { teamA: 'CHE', teamB: 'LIV', winner: 'LIV' },
    { teamA: 'RMA', teamB: 'BAY', winner: 'RMA' },
    { teamA: 'BAR', teamB: 'ATM', winner: 'BAR' },
    { teamA: 'SPO', teamB: 'ARS', winner: 'ARS' },
  ],
  chatgpt: [
    { teamA: 'PSG', teamB: 'GAL', winner: 'PSG' },
    { teamA: 'RMA', teamB: 'ATA', winner: 'RMA' },
    { teamA: 'NEW', teamB: 'ATM', winner: 'NEW' },
    { teamA: 'BOD', teamB: 'ARS', winner: 'BOD' },
  ],
  gemini: [
    { teamA: 'PSG', teamB: 'NEW', winner: 'NEW' },
    { teamA: 'LIV', teamB: 'MCI', winner: 'MCI' },
    { teamA: 'ATA', teamB: 'SPO', winner: 'ATA' },
    { teamA: 'TOT', teamB: 'ARS', winner: 'ARS' },
  ],
};

const SF_BY_AI = {
  claude: [
    { teamA: 'LIV', teamB: 'RMA', winner: 'RMA' },
    { teamA: 'BAR', teamB: 'ARS', winner: 'ARS' },
  ],
  chatgpt: [
    { teamA: 'NEW', teamB: 'PSG', winner: 'NEW' },
    { teamA: 'RMA', teamB: 'BOD', winner: 'RMA' },
  ],
  gemini: [
    { teamA: 'NEW', teamB: 'ARS', winner: 'ARS' },
    { teamA: 'MCI', teamB: 'ATA', winner: 'MCI' },
  ],
};

const FINALS = {
  claude: { teamA: 'RMA', teamB: 'ARS', winner: 'ARS' },
  chatgpt: { teamA: 'NEW', teamB: 'RMA', winner: 'NEW' },
  gemini: { teamA: 'ARS', teamB: 'MCI', winner: 'ARS' },
};

// ── Cue Map (default timing — adjusted by Whisper after TTS) ─────────
const DEFAULT_CUES: Record<string, number> = {
  'three-ais': 0.44,
  'one-trophy': 3.0,
  'round-sixteen': 5.98,
  'psg-chelsea': 10.2,
  'gal-liv': 13.24,
  'rma-mci': 16.12,
  'ata-bay': 18.5,
  'new-bar': 21.5,
  'atm-tot': 24.1,
  'bod-spo': 26.22,
  'lev-ars': 28.32,
  'all-agree': 30.48,
  'first-shock': 35.18,
  'second-shock': 42.88,
  'wildcard': 48.46,
  'quarter-finals': 55.66,
  'semi-finals': 60.88,
  'the-final': 65.38,
  'chatgpt-pick': 66.38,
  'gemini-claude': 71.98,
  'champion': 75.6,
  'outro': 80.72,
};

export interface UCLPredictionsTikTokProps {
  audioEnabled?: boolean;
  cueOverrides?: Record<string, number>;
}

// ── Hooks ────────────────────────────────────────────────────────────

function useCue(cueTimeSeconds: number, fadeDuration = 0.4) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const opacity = interpolate(frame, [cueFrame, cueFrame + fadeDuration * fps], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [cueFrame, cueFrame + fadeDuration * fps], [24, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return { opacity, translateY, isActive: frame >= cueFrame };
}

function useCueSpring(cueTimeSeconds: number, config = { damping: 14, mass: 0.8 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const progress = spring({ frame: frame - cueFrame, fps, config });
  const opacity = frame >= cueFrame ? progress : 0;
  const scale = frame >= cueFrame ? interpolate(progress, [0, 1], [0.6, 1]) : 0;
  return { opacity, scale, isActive: frame >= cueFrame };
}

function usePulse(cueTimeSeconds: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  if (frame < cueFrame) return { scale: 1, glow: 0 };
  const elapsed = (frame - cueFrame) / fps;
  const pulse = 1 + Math.sin(elapsed * 4) * 0.05;
  return { scale: pulse, glow: 1 };
}

// ── Pure Components (no hooks) ──────────────────────────────────────

const GlowText: React.FC<{
  children: React.ReactNode;
  color?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ children, color = T.primary, fontSize = 42, style }) => (
  <div style={{
    fontFamily: T.font, fontWeight: 900, fontSize, color,
    textShadow: `0 0 30px ${color}60, 0 0 60px ${color}30`,
    textAlign: 'center', letterSpacing: 1, ...style,
  }}>{children}</div>
);

const AIIcon: React.FC<{
  ai: keyof typeof AI;
  size?: number;
  pick?: string;
  showPick?: boolean;
  opacity?: number;
}> = ({ ai, size = 36, pick, showPick = true, opacity = 1 }) => {
  const a = AI[ai];
  return (
    <div style={{
      opacity, display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `linear-gradient(135deg, ${a.color}, ${a.color}CC)`,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        boxShadow: `0 0 12px ${a.color}40`,
        border: `2px solid ${a.color}60`,
      }}>
        <span style={{
          fontFamily: T.font, fontWeight: 800, fontSize: size * 0.45,
          color: '#FFF',
        }}>{a.icon}</span>
      </div>
      {showPick && pick && (
        <div style={{
          fontFamily: T.font, fontWeight: 700, fontSize: 16,
          color: TEAMS[pick]?.primary || T.text,
          textShadow: `0 0 8px ${TEAMS[pick]?.primary || T.primary}40`,
        }}>
          {TEAMS[pick]?.name || pick}
        </div>
      )}
    </div>
  );
};

const StarBurst: React.FC<{ opacity: number; frame: number }> = ({ opacity, frame }) => {
  const rotation = frame * 0.3;
  return (
    <div style={{
      opacity: opacity * 0.15,
      position: 'absolute', width: 600, height: 600,
      top: '50%', left: '50%',
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
    }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 2, height: 280,
          background: `linear-gradient(180deg, ${T.gold}40 0%, transparent 100%)`,
          transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
          transformOrigin: 'bottom center',
        }} />
      ))}
    </div>
  );
};

const ConfettiParticle: React.FC<{
  x: number; delay: number; color: string; frame: number; fps: number;
}> = ({ x, delay, color, frame, fps }) => {
  const elapsed = Math.max(0, frame / fps - delay);
  const y = elapsed * 400;
  const rotate = elapsed * 360 * (x > 540 ? 1 : -1);
  const wobble = Math.sin(elapsed * 8) * 30;
  const fadeOut = interpolate(elapsed, [1.5, 2.5], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <div style={{
      position: 'absolute',
      left: x + wobble, top: -20 + y,
      width: 8, height: 20,
      background: color, borderRadius: 2,
      transform: `rotate(${rotate}deg)`,
      opacity: fadeOut,
    }} />
  );
};

// ── Bracket Layout ──────────────────────────────────────────────────
// Virtual canvas coordinates for match slots

const SLOT_W = 260;
const SLOT_H = 100;

// "Side of Death" (top half) — PSG, Chelsea, Liverpool, Bayern, etc.
const SIDE_DEATH_R16 = [
  { x: 80, y: 80 },   // M1: PSG vs CHE
  { x: 80, y: 210 },  // M2: GAL vs LIV
  { x: 80, y: 380 },  // M3: RMA vs MCI
  { x: 80, y: 510 },  // M4: ATA vs BAY
];
const SIDE_DEATH_QF = [
  { x: 440, y: 140 },  // QF1: M1 winner vs M2 winner
  { x: 440, y: 440 },  // QF2: M3 winner vs M4 winner
];
const SIDE_DEATH_SF = [
  { x: 800, y: 290 },  // SF1
];

// "Other Side" (bottom half) — Newcastle, Atletico, Sporting, Arsenal
const OTHER_SIDE_R16 = [
  { x: 80, y: 740 },   // M5: NEW vs BAR
  { x: 80, y: 870 },   // M6: ATM vs TOT
  { x: 80, y: 1040 },  // M7: BOD vs SPO
  { x: 80, y: 1170 },  // M8: LEV vs ARS
];
const OTHER_SIDE_QF = [
  { x: 440, y: 800 },  // QF3: M5 winner vs M6 winner
  { x: 440, y: 1100 }, // QF4: M7 winner vs M8 winner
];
const OTHER_SIDE_SF = [
  { x: 800, y: 950 },  // SF2
];

const FINAL_POS = { x: 1060, y: 620 };

// All R16 slots in order
const R16_SLOTS = [...SIDE_DEATH_R16, ...OTHER_SIDE_R16];

// ── Camera Keyframes ────────────────────────────────────────────────
// Each keyframe: { cueId, x, y, zoom } — camera centers on (x,y) at zoom level
// x,y are in virtual canvas coords; they become the center of the viewport

interface CameraKeyframe {
  time: number; // seconds (global)
  x: number;    // canvas center x
  y: number;    // canvas center y
  zoom: number; // 1 = natural, <1 = zoomed out, >1 = zoomed in
}

// ── BracketSlotCard (pure — no hooks) ───────────────────────────────
const BracketSlotCard: React.FC<{
  match: MatchPrediction;
  opacity: number;
  scale: number;
  highlight?: boolean;
  showWinner?: boolean;
  winner?: string;
  pulseFrame?: number;
}> = ({ match, opacity, scale, highlight = false, showWinner = false, winner, pulseFrame = 0 }) => {
  const t1 = TEAMS[match.teamA];
  const t2 = TEAMS[match.teamB];
  if (!t1 || !t2) return null;

  const majorityWinner = winner || (() => {
    const picks = [match.claude, match.chatgpt, match.gemini];
    const countA = picks.filter(p => p === match.teamA).length;
    return countA >= 2 ? match.teamA : match.teamB;
  })();

  const glowPulse = highlight && pulseFrame > 0 ? 1 + Math.sin(pulseFrame * 0.15) * 0.06 : 1;

  return (
    <div style={{
      width: SLOT_W, height: SLOT_H,
      opacity, transform: `scale(${scale * glowPulse})`,
      background: highlight
        ? `linear-gradient(135deg, ${T.surfaceLight}, ${T.surface})`
        : `${T.surface}CC`,
      borderRadius: 12,
      border: highlight
        ? `2px solid ${T.gold}60`
        : `1px solid ${T.primary}15`,
      boxShadow: highlight
        ? `0 0 20px ${T.gold}30, 0 4px 12px rgba(0,0,0,0.4)`
        : '0 4px 12px rgba(0,0,0,0.3)',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: '6px 10px',
      overflow: 'hidden',
    }}>
      {/* Team A row */}
      <TeamRow
        team={match.teamA}
        isWinner={showWinner && majorityWinner === match.teamA}
        isLoser={showWinner && majorityWinner !== match.teamA}
        claudePick={match.claude === match.teamA}
        chatgptPick={match.chatgpt === match.teamA}
        geminiPick={match.gemini === match.teamA}
      />
      {/* Divider */}
      <div style={{
        height: 1, background: `${T.textMuted}20`,
        margin: '4px 0',
      }} />
      {/* Team B row */}
      <TeamRow
        team={match.teamB}
        isWinner={showWinner && majorityWinner === match.teamB}
        isLoser={showWinner && majorityWinner !== match.teamB}
        claudePick={match.claude === match.teamB}
        chatgptPick={match.chatgpt === match.teamB}
        geminiPick={match.gemini === match.teamB}
      />
    </div>
  );
};

// ── TeamRow (pure — no hooks) ───────────────────────────────────────
const TeamRow: React.FC<{
  team: string;
  isWinner: boolean;
  isLoser: boolean;
  claudePick: boolean;
  chatgptPick: boolean;
  geminiPick: boolean;
}> = ({ team, isWinner, isLoser, claudePick, chatgptPick, geminiPick }) => {
  const t = TEAMS[team];
  if (!t) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      opacity: isLoser ? 0.35 : 1,
      padding: '2px 4px',
    }}>
      {/* Mini badge */}
      <div style={{
        width: 28, height: 28, borderRadius: 5,
        background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        flexShrink: 0,
        boxShadow: isWinner ? `0 0 10px ${t.primary}60` : 'none',
      }}>
        <span style={{
          fontFamily: T.font, fontWeight: 900, fontSize: 10,
          color: t.textColor, letterSpacing: 0.5,
        }}>{t.abbr}</span>
      </div>
      {/* Name */}
      <span style={{
        fontFamily: T.font, fontSize: 13, fontWeight: isWinner ? 800 : 600,
        color: isWinner ? T.text : T.textMuted,
        flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{t.name}</span>
      {/* AI prediction dots */}
      <div style={{ display: 'flex', gap: 3 }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: claudePick ? AI.claude.color : `${T.textMuted}30`,
          boxShadow: claudePick ? `0 0 4px ${AI.claude.color}60` : 'none',
        }} />
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: chatgptPick ? AI.chatgpt.color : `${T.textMuted}30`,
          boxShadow: chatgptPick ? `0 0 4px ${AI.chatgpt.color}60` : 'none',
        }} />
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: geminiPick ? AI.gemini.color : `${T.textMuted}30`,
          boxShadow: geminiPick ? `0 0 4px ${AI.gemini.color}60` : 'none',
        }} />
      </div>
    </div>
  );
};

// ── BracketConnector (pure — L-shaped line) ─────────────────────────
const BracketConnector: React.FC<{
  fromX: number; fromY: number;
  toX: number; toY: number;
  progress: number; // 0-1
  color?: string;
}> = ({ fromX, fromY, toX, toY, progress, color = T.primary }) => {
  // L-shaped: horizontal from source right edge, then vertical, then horizontal to target left edge
  const midX = (fromX + SLOT_W + toX) / 2;
  const startX = fromX + SLOT_W;
  const startY = fromY + SLOT_H / 2;
  const endX = toX;
  const endY = toY + SLOT_H / 2;

  const lineColor = `${color}${Math.round(progress * 0.6 * 255).toString(16).padStart(2, '0')}`;
  const lineWidth = 2;

  return (
    <>
      {/* Horizontal segment from source */}
      <div style={{
        position: 'absolute',
        left: startX, top: startY - lineWidth / 2,
        width: (midX - startX) * Math.min(progress * 3, 1),
        height: lineWidth,
        background: lineColor,
      }} />
      {/* Vertical segment */}
      {progress > 0.33 && (
        <div style={{
          position: 'absolute',
          left: midX - lineWidth / 2,
          top: Math.min(startY, endY),
          width: lineWidth,
          height: Math.abs(endY - startY) * Math.min((progress - 0.33) * 3, 1),
          background: lineColor,
        }} />
      )}
      {/* Horizontal segment to target */}
      {progress > 0.66 && (
        <div style={{
          position: 'absolute',
          left: midX, top: endY - lineWidth / 2,
          width: (endX - midX) * Math.min((progress - 0.66) * 3, 1),
          height: lineWidth,
          background: lineColor,
        }} />
      )}
    </>
  );
};

// ── SideOfDeathLabel (pure) ─────────────────────────────────────────
const SideOfDeathLabel: React.FC<{
  opacity: number; x: number; y: number;
}> = ({ opacity, x, y }) => (
  <div style={{
    position: 'absolute', left: x, top: y,
    opacity,
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '6px 16px',
    background: `${T.surface}90`,
    borderRadius: 8,
    border: `1px solid #ef444440`,
  }}>
    <span style={{ fontSize: 18 }}>💀</span>
    <span style={{
      fontFamily: T.font, fontWeight: 900, fontSize: 14,
      color: '#ef4444', letterSpacing: 2, textTransform: 'uppercase',
    }}>SIDE OF DEATH</span>
    <span style={{ fontSize: 16 }}>🔥</span>
  </div>
);

// ── Overlay Panel (shock/agreement text) ────────────────────────────
const OverlayPanel: React.FC<{
  children: React.ReactNode;
  opacity: number;
  x: number;
  y: number;
}> = ({ children, opacity, x, y }) => (
  <div style={{
    position: 'absolute', left: x, top: y,
    opacity,
    padding: '8px 16px',
    background: `${T.bgDeep}E0`,
    borderRadius: 10,
    border: `1px solid ${T.gold}40`,
    boxShadow: `0 0 20px ${T.gold}15`,
    whiteSpace: 'nowrap',
  }}>
    {children}
  </div>
);

// ── QF/SF/Final Slot Card (for later rounds — shows per-AI paths) ──
const LaterRoundSlotCard: React.FC<{
  position: { x: number; y: number };
  opacity: number;
  scale: number;
  teams: { claude: string; chatgpt: string; gemini: string };
  highlight?: boolean;
  pulseFrame?: number;
  label?: string;
}> = ({ position, opacity, scale, teams, highlight = false, pulseFrame = 0, label }) => {
  const glowPulse = highlight && pulseFrame > 0 ? 1 + Math.sin(pulseFrame * 0.15) * 0.06 : 1;

  // Get unique teams
  const uniqueTeams = [...new Set([teams.claude, teams.chatgpt, teams.gemini])];

  return (
    <div style={{
      position: 'absolute', left: position.x, top: position.y,
      width: SLOT_W, height: SLOT_H + (label ? 20 : 0),
      opacity, transform: `scale(${scale * glowPulse})`,
      transformOrigin: 'center center',
    }}>
      {label && (
        <div style={{
          fontFamily: T.font, fontSize: 10, fontWeight: 800,
          color: T.gold, letterSpacing: 2, textAlign: 'center',
          marginBottom: 4, textTransform: 'uppercase',
        }}>{label}</div>
      )}
      <div style={{
        width: SLOT_W, height: SLOT_H,
        background: highlight
          ? `linear-gradient(135deg, ${T.surfaceLight}, ${T.surface})`
          : `${T.surface}CC`,
        borderRadius: 12,
        border: highlight ? `2px solid ${T.gold}60` : `1px solid ${T.primary}15`,
        boxShadow: highlight
          ? `0 0 20px ${T.gold}30, 0 4px 12px rgba(0,0,0,0.4)`
          : '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '6px 10px', gap: 2,
      }}>
        {uniqueTeams.map(team => {
          const t = TEAMS[team];
          if (!t) return null;
          const ais: string[] = [];
          if (teams.claude === team) ais.push('C');
          if (teams.chatgpt === team) ais.push('G');
          if (teams.gemini === team) ais.push('✦');
          return (
            <div key={team} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '1px 4px',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 4,
                background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: T.font, fontWeight: 900, fontSize: 8,
                  color: t.textColor,
                }}>{t.abbr}</span>
              </div>
              <span style={{
                fontFamily: T.font, fontSize: 11, fontWeight: 700,
                color: T.text, flex: 1,
              }}>{t.name}</span>
              <div style={{ display: 'flex', gap: 2 }}>
                {teams.claude === team && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: AI.claude.color }} />
                )}
                {teams.chatgpt === team && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: AI.chatgpt.color }} />
                )}
                {teams.gemini === team && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: AI.gemini.color }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Scene 1: Hook ────────────────────────────────────────────────────
const HookScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleCue = useCueSpring(ct('three-ais'));
  const trophyCue = useCueSpring(ct('one-trophy'), { damping: 10, mass: 1.2 });

  const starRotation = frame * 0.5;
  const bgPulse = 0.5 + Math.sin(frame * 0.05) * 0.1;

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at center, ${T.uclBlue}${Math.round(bgPulse * 255).toString(16).padStart(2, '0')} 0%, ${T.bgDeep} 70%)`,
      justifyContent: 'center', alignItems: 'center',
    }}>
      {/* Starball background */}
      <div style={{
        position: 'absolute', width: 300, height: 300,
        borderRadius: '50%',
        border: `2px solid ${T.starWhite}20`,
        transform: `rotate(${starRotation}deg)`,
        opacity: 0.15,
      }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            fontSize: 16, color: T.starWhite,
            transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-130px)`,
          }}>★</div>
        ))}
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 24, padding: '0 60px',
      }}>
        {/* Trophy */}
        <div style={{
          opacity: trophyCue.opacity,
          transform: `scale(${trophyCue.scale})`,
          fontSize: 90,
          filter: `drop-shadow(0 0 30px ${T.gold}60)`,
        }}>🏆</div>

        {/* Title */}
        <div style={{
          opacity: titleCue.opacity,
          transform: `scale(${titleCue.scale})`,
        }}>
          <GlowText fontSize={36} color={T.text}>
            I got 3 AIs to predict
          </GlowText>
          <GlowText fontSize={28} color={T.primary} style={{ marginTop: 8 }}>
            the Champions League
          </GlowText>
        </div>

        {/* AI icons */}
        <div style={{
          display: 'flex', gap: 24, marginTop: 16,
          opacity: interpolate(frame, [fps * 2.5, fps * 3], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          {(['claude', 'chatgpt', 'gemini'] as const).map((ai, i) => (
            <div key={ai} style={{
              opacity: interpolate(frame, [fps * (2.5 + i * 0.2), fps * (2.8 + i * 0.2)], [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              transform: `translateY(${interpolate(frame,
                [fps * (2.5 + i * 0.2), fps * (2.8 + i * 0.2)], [20, 0],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
            }}>
              <AIIcon ai={ai} showPick={false} size={44} />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: Bracket ────────────────────────────────────────────────
const BracketScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Camera keyframes (relative to scene start) ──
  const cameraKeyframes: CameraKeyframe[] = [
    // Overview: show full bracket skeleton
    { time: ct('round-sixteen'), x: CANVAS_W * 0.35, y: CANVAS_H * 0.5, zoom: 0.52 },
    // Pan to Side of Death R16 (top half)
    { time: ct('psg-chelsea'), x: 250, y: 340, zoom: 0.85 },
    // Stay on side of death for gal-liv, rma-mci, ata-bay
    { time: ct('ata-bay') + 1.5, x: 250, y: 340, zoom: 0.85 },
    // Pan to Other Side R16 (bottom half)
    { time: ct('new-bar'), x: 250, y: 1000, zoom: 0.85 },
    // Stay on other side for atm-tot, bod-spo, lev-ars
    { time: ct('lev-ars') + 1.0, x: 250, y: 1000, zoom: 0.85 },
    // Zoom into Arsenal match (all agree)
    { time: ct('all-agree'), x: 200, y: 1170, zoom: 1.2 },
    // Zoom into GAL vs LIV (first shock)
    { time: ct('first-shock'), x: 200, y: 210, zoom: 1.2 },
    // Zoom into ATA vs BAY (second shock)
    { time: ct('second-shock'), x: 200, y: 510, zoom: 1.2 },
    // Zoom into BOD vs SPO (wildcard)
    { time: ct('wildcard'), x: 200, y: 1040, zoom: 1.2 },
    // Zoom out — full bracket for QF fill
    { time: ct('quarter-finals'), x: CANVAS_W * 0.4, y: CANVAS_H * 0.5, zoom: 0.5 },
    // Pan to SF area
    { time: ct('semi-finals'), x: CANVAS_W * 0.5, y: CANVAS_H * 0.5, zoom: 0.5 },
    // Center on Final
    { time: ct('the-final'), x: FINAL_POS.x + SLOT_W / 2, y: FINAL_POS.y + SLOT_H / 2, zoom: 0.7 },
    // Stay centered for chatgpt-pick, gemini-claude
    { time: ct('gemini-claude') + 2.0, x: FINAL_POS.x + SLOT_W / 2, y: FINAL_POS.y + SLOT_H / 2, zoom: 0.7 },
  ];

  // Interpolate camera position
  const camTimes = cameraKeyframes.map(k => k.time * fps);
  const camXs = cameraKeyframes.map(k => k.x);
  const camYs = cameraKeyframes.map(k => k.y);
  const camZooms = cameraKeyframes.map(k => k.zoom);

  const camX = interpolate(frame, camTimes, camXs, {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const camY = interpolate(frame, camTimes, camYs, {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const camZoom = interpolate(frame, camTimes, camZooms, {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Transform: translate canvas so camX,camY is at viewport center, then scale
  const translateX = VIEWPORT_W / 2 - camX * camZoom;
  const translateY = VIEWPORT_H / 2 - camY * camZoom;

  // ── Skeleton fade-in ──
  const skeletonOpacity = interpolate(
    frame,
    [ct('round-sixteen') * fps, (ct('round-sixteen') + 1.0) * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── R16 card spring animations (pre-allocated — 8 springs) ──
  const r16MatchCues = [
    'psg-chelsea', 'gal-liv', 'rma-mci', 'ata-bay',
    'new-bar', 'atm-tot', 'bod-spo', 'lev-ars',
  ];

  const r16Spring0 = spring({ frame: frame - ct(r16MatchCues[0]) * fps, fps, config: { damping: 14, mass: 0.8 } });
  const r16Spring1 = spring({ frame: frame - ct(r16MatchCues[1]) * fps, fps, config: { damping: 14, mass: 0.8 } });
  const r16Spring2 = spring({ frame: frame - ct(r16MatchCues[2]) * fps, fps, config: { damping: 14, mass: 0.8 } });
  const r16Spring3 = spring({ frame: frame - ct(r16MatchCues[3]) * fps, fps, config: { damping: 14, mass: 0.8 } });
  const r16Spring4 = spring({ frame: frame - ct(r16MatchCues[4]) * fps, fps, config: { damping: 14, mass: 0.8 } });
  const r16Spring5 = spring({ frame: frame - ct(r16MatchCues[5]) * fps, fps, config: { damping: 14, mass: 0.8 } });
  const r16Spring6 = spring({ frame: frame - ct(r16MatchCues[6]) * fps, fps, config: { damping: 14, mass: 0.8 } });
  const r16Spring7 = spring({ frame: frame - ct(r16MatchCues[7]) * fps, fps, config: { damping: 14, mass: 0.8 } });
  const r16Springs = [r16Spring0, r16Spring1, r16Spring2, r16Spring3, r16Spring4, r16Spring5, r16Spring6, r16Spring7];

  // ── QF spring animations (4 springs) ──
  const qfStartTime = ct('quarter-finals') + 0.5;
  const qfSpring0 = spring({ frame: frame - (qfStartTime) * fps, fps, config: { damping: 12, mass: 1.0 } });
  const qfSpring1 = spring({ frame: frame - (qfStartTime + 0.4) * fps, fps, config: { damping: 12, mass: 1.0 } });
  const qfSpring2 = spring({ frame: frame - (qfStartTime + 0.8) * fps, fps, config: { damping: 12, mass: 1.0 } });
  const qfSpring3 = spring({ frame: frame - (qfStartTime + 1.2) * fps, fps, config: { damping: 12, mass: 1.0 } });
  const qfSprings = [qfSpring0, qfSpring1, qfSpring2, qfSpring3];

  // ── SF spring animations (2 springs) ──
  const sfStartTime = ct('semi-finals') + 0.5;
  const sfSpring0 = spring({ frame: frame - sfStartTime * fps, fps, config: { damping: 12, mass: 1.0 } });
  const sfSpring1 = spring({ frame: frame - (sfStartTime + 0.5) * fps, fps, config: { damping: 12, mass: 1.0 } });
  const sfSprings = [sfSpring0, sfSpring1];

  // ── Final spring ──
  const finalStartTime = ct('the-final') + 0.5;
  const finalSpring = spring({ frame: frame - finalStartTime * fps, fps, config: { damping: 10, mass: 1.2 } });

  // ── Show winner highlighting after small delay ──
  const showR16Winners = frame >= (ct('lev-ars') + 1.5) * fps;

  // ── Overlay opacities ──
  const allAgreeOpacity = interpolate(
    frame,
    [ct('all-agree') * fps, (ct('all-agree') + 0.4) * fps, (ct('first-shock') - 0.3) * fps, ct('first-shock') * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const shock1Opacity = interpolate(
    frame,
    [ct('first-shock') * fps, (ct('first-shock') + 0.4) * fps, (ct('second-shock') - 0.3) * fps, ct('second-shock') * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const shock2Opacity = interpolate(
    frame,
    [ct('second-shock') * fps, (ct('second-shock') + 0.4) * fps, (ct('wildcard') - 0.3) * fps, ct('wildcard') * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const wildcardOpacity = interpolate(
    frame,
    [ct('wildcard') * fps, (ct('wildcard') + 0.4) * fps, (ct('quarter-finals') - 0.5) * fps, ct('quarter-finals') * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Side of Death label ──
  const sideOfDeathOpacity = interpolate(
    frame,
    [ct('round-sixteen') * fps, (ct('round-sixteen') + 0.8) * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Connector progress (R16 → QF) ──
  const connectorR16toQFProgress = interpolate(
    frame,
    [(ct('quarter-finals') - 0.5) * fps, (ct('quarter-finals') + 1.5) * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  // QF → SF
  const connectorQFtoSFProgress = interpolate(
    frame,
    [(ct('semi-finals') - 0.3) * fps, (ct('semi-finals') + 1.5) * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  // SF → Final
  const connectorSFtoFinalProgress = interpolate(
    frame,
    [(ct('the-final') - 0.3) * fps, (ct('the-final') + 1.5) * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── QF matchup data (per-AI divergence) ──
  const qfSlotData = [
    // QF1: Side of Death top
    {
      claude: QF_BY_AI.claude[0].winner,
      chatgpt: QF_BY_AI.chatgpt[0].winner,
      gemini: QF_BY_AI.gemini[0].winner,
    },
    // QF2: Side of Death bottom
    {
      claude: QF_BY_AI.claude[1].winner,
      chatgpt: QF_BY_AI.chatgpt[1].winner,
      gemini: QF_BY_AI.gemini[1].winner,
    },
    // QF3: Other Side top
    {
      claude: QF_BY_AI.claude[2].winner,
      chatgpt: QF_BY_AI.chatgpt[2].winner,
      gemini: QF_BY_AI.gemini[2].winner,
    },
    // QF4: Other Side bottom
    {
      claude: QF_BY_AI.claude[3].winner,
      chatgpt: QF_BY_AI.chatgpt[3].winner,
      gemini: QF_BY_AI.gemini[3].winner,
    },
  ];

  // SF matchup data
  const sfSlotData = [
    {
      claude: SF_BY_AI.claude[0].winner,
      chatgpt: SF_BY_AI.chatgpt[0].winner,
      gemini: SF_BY_AI.gemini[0].winner,
    },
    {
      claude: SF_BY_AI.claude[1].winner,
      chatgpt: SF_BY_AI.chatgpt[1].winner,
      gemini: SF_BY_AI.gemini[1].winner,
    },
  ];

  // Final data
  const finalSlotData = {
    claude: FINALS.claude.winner,
    chatgpt: FINALS.chatgpt.winner,
    gemini: FINALS.gemini.winner,
  };

  const allQFSlots = [...SIDE_DEATH_QF, ...OTHER_SIDE_QF];
  const allSFSlots = [...SIDE_DEATH_SF, ...OTHER_SIDE_SF];

  // ── ChatGPT pick highlight ──
  const chatgptPickOpacity = interpolate(
    frame,
    [ct('chatgpt-pick') * fps, (ct('chatgpt-pick') + 0.5) * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Gemini/Claude highlight (Arsenal 2/3) ──
  const gcHighlightOpacity = interpolate(
    frame,
    [ct('gemini-claude') * fps, (ct('gemini-claude') + 0.5) * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Round labels ──
  const roundLabelOpacity = skeletonOpacity;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${T.bgDeep} 0%, ${T.uclNavy}40 50%, ${T.bgDeep} 100%)`,
      overflow: 'hidden',
    }}>
      {/* Camera wrapper */}
      <div style={{
        position: 'absolute',
        width: CANVAS_W,
        height: CANVAS_H,
        transform: `translate(${translateX}px, ${translateY}px) scale(${camZoom})`,
        transformOrigin: '0 0',
      }}>
        {/* ── Round Labels ── */}
        <div style={{
          position: 'absolute', left: 80 + SLOT_W / 2 - 30, top: 40,
          opacity: roundLabelOpacity,
          fontFamily: T.mono, fontSize: 11, fontWeight: 700,
          color: T.textMuted, letterSpacing: 2, textTransform: 'uppercase',
        }}>R16</div>
        <div style={{
          position: 'absolute', left: 440 + SLOT_W / 2 - 10, top: 100,
          opacity: roundLabelOpacity * Math.min(connectorR16toQFProgress * 3, 1),
          fontFamily: T.mono, fontSize: 11, fontWeight: 700,
          color: T.textMuted, letterSpacing: 2, textTransform: 'uppercase',
        }}>QF</div>
        <div style={{
          position: 'absolute', left: 800 + SLOT_W / 2 - 10, top: 250,
          opacity: roundLabelOpacity * Math.min(connectorQFtoSFProgress * 3, 1),
          fontFamily: T.mono, fontSize: 11, fontWeight: 700,
          color: T.textMuted, letterSpacing: 2, textTransform: 'uppercase',
        }}>SF</div>
        <div style={{
          position: 'absolute', left: FINAL_POS.x + SLOT_W / 2 - 25, top: FINAL_POS.y - 30,
          opacity: roundLabelOpacity * Math.min(connectorSFtoFinalProgress * 3, 1),
          fontFamily: T.mono, fontSize: 13, fontWeight: 800,
          color: T.gold, letterSpacing: 2, textTransform: 'uppercase',
        }}>FINAL</div>

        {/* ── Side labels ── */}
        <SideOfDeathLabel opacity={sideOfDeathOpacity} x={80} y={44} />

        <div style={{
          position: 'absolute', left: 80, top: 705,
          opacity: interpolate(
            frame,
            [ct('new-bar') * fps - 10, ct('new-bar') * fps + fps * 0.5],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          ),
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 16px',
          background: `${T.surface}90`,
          borderRadius: 8,
          border: `1px solid ${T.primary}30`,
        }}>
          <span style={{
            fontFamily: T.font, fontWeight: 900, fontSize: 14,
            color: T.primary, letterSpacing: 2, textTransform: 'uppercase',
          }}>OTHER SIDE</span>
        </div>

        {/* ── Bracket Connectors (R16 → QF) ── */}
        {/* Side of Death connectors */}
        <BracketConnector fromX={SIDE_DEATH_R16[0].x} fromY={SIDE_DEATH_R16[0].y}
          toX={SIDE_DEATH_QF[0].x} toY={SIDE_DEATH_QF[0].y} progress={connectorR16toQFProgress} />
        <BracketConnector fromX={SIDE_DEATH_R16[1].x} fromY={SIDE_DEATH_R16[1].y}
          toX={SIDE_DEATH_QF[0].x} toY={SIDE_DEATH_QF[0].y} progress={connectorR16toQFProgress} />
        <BracketConnector fromX={SIDE_DEATH_R16[2].x} fromY={SIDE_DEATH_R16[2].y}
          toX={SIDE_DEATH_QF[1].x} toY={SIDE_DEATH_QF[1].y} progress={connectorR16toQFProgress} />
        <BracketConnector fromX={SIDE_DEATH_R16[3].x} fromY={SIDE_DEATH_R16[3].y}
          toX={SIDE_DEATH_QF[1].x} toY={SIDE_DEATH_QF[1].y} progress={connectorR16toQFProgress} />
        {/* Other Side connectors */}
        <BracketConnector fromX={OTHER_SIDE_R16[0].x} fromY={OTHER_SIDE_R16[0].y}
          toX={OTHER_SIDE_QF[0].x} toY={OTHER_SIDE_QF[0].y} progress={connectorR16toQFProgress} />
        <BracketConnector fromX={OTHER_SIDE_R16[1].x} fromY={OTHER_SIDE_R16[1].y}
          toX={OTHER_SIDE_QF[0].x} toY={OTHER_SIDE_QF[0].y} progress={connectorR16toQFProgress} />
        <BracketConnector fromX={OTHER_SIDE_R16[2].x} fromY={OTHER_SIDE_R16[2].y}
          toX={OTHER_SIDE_QF[1].x} toY={OTHER_SIDE_QF[1].y} progress={connectorR16toQFProgress} />
        <BracketConnector fromX={OTHER_SIDE_R16[3].x} fromY={OTHER_SIDE_R16[3].y}
          toX={OTHER_SIDE_QF[1].x} toY={OTHER_SIDE_QF[1].y} progress={connectorR16toQFProgress} />

        {/* QF → SF connectors */}
        <BracketConnector fromX={SIDE_DEATH_QF[0].x} fromY={SIDE_DEATH_QF[0].y}
          toX={SIDE_DEATH_SF[0].x} toY={SIDE_DEATH_SF[0].y} progress={connectorQFtoSFProgress} color={T.gold} />
        <BracketConnector fromX={SIDE_DEATH_QF[1].x} fromY={SIDE_DEATH_QF[1].y}
          toX={SIDE_DEATH_SF[0].x} toY={SIDE_DEATH_SF[0].y} progress={connectorQFtoSFProgress} color={T.gold} />
        <BracketConnector fromX={OTHER_SIDE_QF[0].x} fromY={OTHER_SIDE_QF[0].y}
          toX={OTHER_SIDE_SF[0].x} toY={OTHER_SIDE_SF[0].y} progress={connectorQFtoSFProgress} color={T.gold} />
        <BracketConnector fromX={OTHER_SIDE_QF[1].x} fromY={OTHER_SIDE_QF[1].y}
          toX={OTHER_SIDE_SF[0].x} toY={OTHER_SIDE_SF[0].y} progress={connectorQFtoSFProgress} color={T.gold} />

        {/* SF → Final connectors */}
        <BracketConnector fromX={SIDE_DEATH_SF[0].x} fromY={SIDE_DEATH_SF[0].y}
          toX={FINAL_POS.x} toY={FINAL_POS.y} progress={connectorSFtoFinalProgress} color={T.gold} />
        <BracketConnector fromX={OTHER_SIDE_SF[0].x} fromY={OTHER_SIDE_SF[0].y}
          toX={FINAL_POS.x} toY={FINAL_POS.y} progress={connectorSFtoFinalProgress} color={T.gold} />

        {/* ── R16 Match Cards ── */}
        {R16.map((match, i) => {
          const slot = R16_SLOTS[i];
          const sp = r16Springs[i];
          const cueTime = ct(r16MatchCues[i]);
          const isVisible = frame >= cueTime * fps;
          const opacity = isVisible ? sp : 0;
          const scale = isVisible ? interpolate(sp, [0, 1], [0.6, 1]) : 0;

          // Highlight state for overlays
          const isAllAgree = i === 7; // LEV vs ARS
          const isShock1 = i === 1;   // GAL vs LIV
          const isShock2 = i === 3;   // ATA vs BAY
          const isWildcard = i === 6; // BOD vs SPO

          const highlight =
            (isAllAgree && allAgreeOpacity > 0.5) ||
            (isShock1 && shock1Opacity > 0.5) ||
            (isShock2 && shock2Opacity > 0.5) ||
            (isWildcard && wildcardOpacity > 0.5);

          return (
            <div key={i} style={{
              position: 'absolute', left: slot.x, top: slot.y,
            }}>
              <BracketSlotCard
                match={match}
                opacity={opacity}
                scale={scale}
                highlight={highlight}
                showWinner={showR16Winners}
                pulseFrame={highlight ? frame : 0}
              />
            </div>
          );
        })}

        {/* ── QF Slot Cards ── */}
        {allQFSlots.map((slot, i) => {
          const sp = qfSprings[i];
          const isVisible = frame >= (qfStartTime + i * 0.4) * fps;
          return (
            <LaterRoundSlotCard
              key={`qf-${i}`}
              position={slot}
              opacity={isVisible ? sp : 0}
              scale={isVisible ? interpolate(sp, [0, 1], [0.5, 1]) : 0}
              teams={qfSlotData[i]}
            />
          );
        })}

        {/* ── SF Slot Cards ── */}
        {allSFSlots.map((slot, i) => {
          const sp = sfSprings[i];
          const isVisible = frame >= (sfStartTime + i * 0.5) * fps;
          return (
            <LaterRoundSlotCard
              key={`sf-${i}`}
              position={slot}
              opacity={isVisible ? sp : 0}
              scale={isVisible ? interpolate(sp, [0, 1], [0.5, 1]) : 0}
              teams={sfSlotData[i]}
            />
          );
        })}

        {/* ── Final Slot Card ── */}
        <LaterRoundSlotCard
          position={FINAL_POS}
          opacity={frame >= finalStartTime * fps ? finalSpring : 0}
          scale={frame >= finalStartTime * fps ? interpolate(finalSpring, [0, 1], [0.5, 1]) : 0}
          teams={finalSlotData}
          highlight={gcHighlightOpacity > 0.3}
          pulseFrame={gcHighlightOpacity > 0.3 ? frame : 0}
          label="🏆 THE FINAL"
        />

        {/* ── Overlay Panels ── */}
        {/* All Agree overlay */}
        <OverlayPanel opacity={allAgreeOpacity}
          x={OTHER_SIDE_R16[3].x + SLOT_W + 20} y={OTHER_SIDE_R16[3].y + 10}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: T.font, fontSize: 14, fontWeight: 900,
              color: T.gold, letterSpacing: 1,
            }}>ALL 3 AGREE</span>
            <span style={{ fontSize: 16 }}>✅</span>
          </div>
          <div style={{
            fontFamily: T.font, fontSize: 12, fontWeight: 600,
            color: T.text, marginTop: 4,
          }}>Arsenal goes through!</div>
        </OverlayPanel>

        {/* Shock 1 overlay (ChatGPT picks Galatasaray over Liverpool) */}
        <OverlayPanel opacity={shock1Opacity}
          x={SIDE_DEATH_R16[1].x + SLOT_W + 20} y={SIDE_DEATH_R16[1].y + 10}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontFamily: T.font, fontSize: 14, fontWeight: 900,
              color: '#ef4444', letterSpacing: 1,
            }}>SHOCK</span>
            <div style={{
              width: 14, height: 14, borderRadius: '50%',
              background: AI.chatgpt.color,
              display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}>
              <span style={{ fontSize: 8, color: '#FFF', fontWeight: 800 }}>{AI.chatgpt.icon}</span>
            </div>
          </div>
          <div style={{
            fontFamily: T.font, fontSize: 11, fontWeight: 600,
            color: T.textMuted, marginTop: 3,
          }}>ChatGPT picks Galatasaray!</div>
        </OverlayPanel>

        {/* Shock 2 overlay (ChatGPT+Gemini pick Atalanta over Bayern) */}
        <OverlayPanel opacity={shock2Opacity}
          x={SIDE_DEATH_R16[3].x + SLOT_W + 20} y={SIDE_DEATH_R16[3].y + 10}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontFamily: T.font, fontSize: 14, fontWeight: 900,
              color: '#f59e0b', letterSpacing: 1,
            }}>SHOCK #2</span>
            <div style={{ display: 'flex', gap: 3 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: AI.chatgpt.color }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: AI.gemini.color }} />
            </div>
          </div>
          <div style={{
            fontFamily: T.font, fontSize: 11, fontWeight: 600,
            color: T.textMuted, marginTop: 3,
          }}>Atalanta over Bayern!</div>
        </OverlayPanel>

        {/* Wildcard overlay (ChatGPT picks Bodo/Glimt) */}
        <OverlayPanel opacity={wildcardOpacity}
          x={OTHER_SIDE_R16[2].x + SLOT_W + 20} y={OTHER_SIDE_R16[2].y + 10}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontFamily: T.font, fontSize: 14, fontWeight: 900,
              color: '#c084fc', letterSpacing: 1,
            }}>WILDCARD</span>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: AI.chatgpt.color,
              display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: 8, color: '#FFF', fontWeight: 800 }}>{AI.chatgpt.icon}</span>
            </div>
          </div>
          <div style={{
            fontFamily: T.font, fontSize: 11, fontWeight: 600,
            color: T.textMuted, marginTop: 3,
          }}>Bodø/Glimt fairytale run!</div>
        </OverlayPanel>

        {/* ChatGPT pick highlight near final */}
        {chatgptPickOpacity > 0 && (
          <OverlayPanel opacity={chatgptPickOpacity}
            x={FINAL_POS.x - 60} y={FINAL_POS.y + SLOT_H + 20}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: AI.chatgpt.color,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
              }}>
                <span style={{ fontSize: 10, color: '#FFF', fontWeight: 800 }}>{AI.chatgpt.icon}</span>
              </div>
              <span style={{
                fontFamily: T.font, fontSize: 13, fontWeight: 800,
                color: AI.chatgpt.color,
              }}>Newcastle wins it all!</span>
            </div>
          </OverlayPanel>
        )}

        {/* Gemini + Claude highlight (2/3 → Arsenal) */}
        {gcHighlightOpacity > 0 && (
          <OverlayPanel opacity={gcHighlightOpacity}
            x={FINAL_POS.x - 20} y={FINAL_POS.y + SLOT_H + 60}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: AI.gemini.color,
                display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: 8, color: '#FFF', fontWeight: 800 }}>{AI.gemini.icon}</span>
              </div>
              <span style={{ fontFamily: T.font, fontSize: 10, fontWeight: 700, color: T.textMuted }}>+</span>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: AI.claude.color,
                display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: 8, color: '#FFF', fontWeight: 800 }}>{AI.claude.icon}</span>
              </div>
              <span style={{
                fontFamily: T.font, fontSize: 13, fontWeight: 900,
                color: T.gold,
              }}>ARSENAL WINS 🏆</span>
            </div>
          </OverlayPanel>
        )}

        {/* ── Empty slot outlines (skeleton) ── */}
        {/* QF skeletons — show before cards appear */}
        {allQFSlots.map((slot, i) => {
          const cardVisible = frame >= (qfStartTime + i * 0.4) * fps;
          if (cardVisible) return null;
          return (
            <div key={`qf-skel-${i}`} style={{
              position: 'absolute', left: slot.x, top: slot.y,
              width: SLOT_W, height: SLOT_H,
              border: `1px dashed ${T.textMuted}20`,
              borderRadius: 12,
              opacity: skeletonOpacity * 0.4,
            }} />
          );
        })}
        {/* SF skeletons */}
        {allSFSlots.map((slot, i) => {
          const cardVisible = frame >= (sfStartTime + i * 0.5) * fps;
          if (cardVisible) return null;
          return (
            <div key={`sf-skel-${i}`} style={{
              position: 'absolute', left: slot.x, top: slot.y,
              width: SLOT_W, height: SLOT_H,
              border: `1px dashed ${T.textMuted}20`,
              borderRadius: 12,
              opacity: skeletonOpacity * 0.4,
            }} />
          );
        })}
        {/* Final skeleton */}
        {frame < finalStartTime * fps && (
          <div style={{
            position: 'absolute', left: FINAL_POS.x, top: FINAL_POS.y,
            width: SLOT_W, height: SLOT_H,
            border: `2px dashed ${T.gold}30`,
            borderRadius: 12,
            opacity: skeletonOpacity * 0.5,
          }} />
        )}
      </div>

      {/* ── AI Legend (fixed position in viewport) ── */}
      <div style={{
        position: 'absolute', bottom: 40, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 20,
        opacity: skeletonOpacity * 0.8,
      }}>
        {(['claude', 'chatgpt', 'gemini'] as const).map(ai => (
          <div key={ai} style={{
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: AI[ai].color,
            }} />
            <span style={{
              fontFamily: T.font, fontSize: 11, fontWeight: 600,
              color: T.textMuted,
            }}>{AI[ai].name}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Champion Celebration ────────────────────────────────────
const ChampionScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const championCue = useCueSpring(ct('champion'), { damping: 8, mass: 1.5 });
  const outroCue = useCue(ct('outro'));
  const arsenalPulse = usePulse(ct('champion') + 0.5);

  const confettiActive = frame >= ct('champion') * fps + fps * 0.5;
  const colors = [T.gold, '#EF0107', '#FFF', '#00d4ff', '#c084fc', '#22c55e'];
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    x: (i / 40) * 1080 + Math.sin(i * 7) * 60,
    delay: (i % 8) * 0.1,
    color: colors[i % colors.length],
  }));

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at center, #EF010730 0%, ${T.bgDeep} 60%)`,
      justifyContent: 'center', alignItems: 'center',
      overflow: 'hidden',
    }}>
      {/* Confetti */}
      {confettiActive && particles.map((p, i) => (
        <ConfettiParticle key={i} {...p} frame={frame} fps={fps} />
      ))}
      <StarBurst opacity={championCue.opacity * 0.6} frame={frame} />

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        zIndex: 1,
      }}>
        {/* 2 out of 3 */}
        <div style={{
          opacity: championCue.opacity,
          transform: `scale(${championCue.scale})`,
        }}>
          <GlowText fontSize={22} color={T.textMuted}>
            2 OUT OF 3 AIs PREDICT
          </GlowText>
        </div>

        {/* Trophy */}
        <div style={{
          opacity: championCue.opacity,
          transform: `scale(${championCue.scale * arsenalPulse.scale})`,
          fontSize: 100,
          filter: `drop-shadow(0 0 40px ${T.gold}80)`,
        }}>🏆</div>

        {/* Arsenal badge */}
        <div style={{
          opacity: championCue.opacity,
          transform: `scale(${championCue.scale * arsenalPulse.scale})`,
        }}>
          {/* Large badge */}
          <div style={{
            width: 140, height: 140, borderRadius: 21,
            background: `linear-gradient(145deg, ${TEAMS.ARS.primary}, ${TEAMS.ARS.secondary})`,
            border: `3px solid ${TEAMS.ARS.primary}88`,
            boxShadow: `0 0 56px ${TEAMS.ARS.primary}80, 0 0 112px ${TEAMS.ARS.primary}40, inset 0 1px 2px rgba(255,255,255,0.3)`,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
              borderRadius: '21px 21px 0 0',
            }} />
            <span style={{
              fontFamily: T.font, fontWeight: 900, fontSize: 44,
              color: TEAMS.ARS.textColor, letterSpacing: 1, zIndex: 1,
              textShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}>ARS</span>
          </div>
        </div>

        {/* Champion text */}
        <div style={{
          opacity: outroCue.opacity,
          transform: `translateY(${outroCue.translateY}px)`,
        }}>
          <GlowText fontSize={40} color={T.gold}>ARSENAL</GlowText>
          <GlowText fontSize={22} color={T.primary} style={{ marginTop: 8 }}>
            CHAMPIONS OF EUROPE
          </GlowText>
        </div>

        {/* AI verdict */}
        <div style={{
          opacity: outroCue.opacity,
          display: 'flex', gap: 16, marginTop: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <AIIcon ai="claude" showPick={false} size={24} />
            <span style={{ fontFamily: T.font, fontSize: 14, color: '#22c55e', fontWeight: 700 }}>✓</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <AIIcon ai="chatgpt" showPick={false} size={24} />
            <span style={{ fontFamily: T.font, fontSize: 14, color: '#ef4444', fontWeight: 700 }}>✗</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <AIIcon ai="gemini" showPick={false} size={24} />
            <span style={{ fontFamily: T.font, fontSize: 14, color: '#22c55e', fontWeight: 700 }}>✓</span>
          </div>
        </div>

        {/* Title card */}
        <div style={{
          opacity: outroCue.opacity,
          marginTop: 12,
          padding: '10px 24px',
          background: `${T.surface}80`,
          borderRadius: 12,
          border: `1px solid ${T.primary}20`,
        }}>
          <span style={{
            fontFamily: T.font, fontSize: 13, fontWeight: 600,
            color: T.textMuted, textAlign: 'center',
          }}>
            First ever Champions League trophy
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene Timing ─────────────────────────────────────────────────────
interface SceneDef {
  id: string;
  startS: number;
  durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

const SCENES: SceneDef[] = [
  { id: 'hook', startS: 0, durationS: 6.5, Component: HookScene },
  { id: 'bracket', startS: 5.5, durationS: 70.5, Component: BracketScene },
  { id: 'champion', startS: 74, durationS: 12, Component: ChampionScene },
];

// ── Main Composition ─────────────────────────────────────────────────
export const UCLPredictionsTikTok: React.FC<UCLPredictionsTikTokProps> = ({
  audioEnabled = true,
  cueOverrides = {},
}) => {
  const { fps } = useVideoConfig();

  const ct = (id: string): number => {
    return cueOverrides[id] ?? DEFAULT_CUES[id] ?? 0;
  };

  return (
    <AbsoluteFill style={{ background: T.bgDeep }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/ucl-predictions-daniel.wav')} volume={1} />
      )}

      {SCENES.map((scene) => (
        <Sequence
          key={scene.id}
          from={Math.round(scene.startS * fps)}
          durationInFrames={Math.round(scene.durationS * fps)}
          name={scene.id}
        >
          <scene.Component ct={(id) => ct(id) - scene.startS} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ── Duration helper ──────────────────────────────────────────────────
export const getUCLPredictionsDuration = (fps: number): number =>
  Math.round(TOTAL_DURATION_S * fps);

// ── Cover thumbnail ──────────────────────────────────────────────────
export const UCLPredictionsCover: React.FC = () => (
  <AbsoluteFill style={{
    background: `radial-gradient(ellipse at center, ${T.uclBlue} 0%, ${T.bgDeep} 70%)`,
    justifyContent: 'center', alignItems: 'center',
  }}>
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
    }}>
      <div style={{ fontSize: 80 }}>🏆</div>
      <GlowText fontSize={32} color={T.gold}>3 AIs PREDICT</GlowText>
      <GlowText fontSize={24} color={T.primary}>THE UCL WINNER</GlowText>
      <div style={{ display: 'flex', gap: 16 }}>
        {(['claude', 'chatgpt', 'gemini'] as const).map(ai => (
          <AIIcon key={ai} ai={ai} showPick={false} size={36} />
        ))}
      </div>
    </div>
  </AbsoluteFill>
);
