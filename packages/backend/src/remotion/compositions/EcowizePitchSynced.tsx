/**
 * Ecowize Digital Platform Pitch — NARRATION-SYNCED VERSION
 *
 * Uses Whisper transcription timestamps to sync visual elements with narration.
 * Each element appears when it's mentioned in the audio.
 * Dashboard screenshots revealed at the end of each solution slide.
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { ecowizeCorporateTheme as theme } from '../components/webslides/themes';
import { withOpacity } from '../components/webslides/themes';

const FPS = 30;
const TRANSITION_FRAMES = 15;

// ── Narration Cue Points (from Whisper transcription) ─────────────────
const CUES = {
  // Slide 6: Platform Overview (30 seconds)
  slide06: {
    title: 0.84,
    fourPillars: 3.7,
    verify: 4.88,
    correct: 7.9,
    audit: 10.98,
    oversee: 14.1,
    unifiedSystem: 18.62,
    mobileFirst: 26.5,
  },

  // Slide 7: Cleaning Verification (79 seconds)
  slide07: {
    title: 1.12,
    coreModule: 6.32,
    transformSchedule: 10.8,
    digitalTask: 23.38,
    theWhat: 35.42,
    theWhen: 36.24,
    theHow: 37.16,
    theWho: 38.08,
    specs: 38.74,
    correctiveActions: 39.72,
    photographs: 43.18,
    cleanMixer: 46.66,
    proofOfPresence: 54.22,
    qrCodes: 58.02,
    barCodes: 59.62,
    nfcTags: 61.08,
    rfidTags: 62.46,
    signOff: 73.32,
    dashboardReveal: 76.0,
  },

  // Slide 8: NCR Management (45 seconds)
  slide08: {
    title: 1.18,
    ncrSystem: 4.2,
    captureFramework: 9.8,
    nonConformities: 13.38,
    severity: 15.7,
    resolved: 18.68,
    timelines: 19.84,
    communication: 21.84,
    responsible: 23.68,
    accountable: 24.7,
    consulted: 25.48,
    informed: 26.7,
    auditTrail: 32.54,
    statusLevels: 34.2,
    whereSitting: 37.64,
    resolved2: 38.94,
    outstanding: 40.9,
    parkingBay: 42.58,
    dashboardReveal: 41.0,
  },

  // Slide 9: Internal Audits (50 seconds)
  slide09: {
    title: 0.68,
    digitalPlatform: 4.72,
    digitalAudit: 10.74,
    areaManagers: 12.68,
    onSite: 16.52,
    linkedToNcr: 19.02,
    fullTraceability: 21.9,
    digitalSignatures: 24.36,
    offlineCapability: 25.84,
    historicalComparisons: 27.54,
    trends: 29.08,
    improvement: 30.56,
    clientEngagement: 33.26,
    basedOnFact: 37.0,
    scores: 41.62,
    immediatelyAvailable: 44.1,
    dashboardReveal: 46.0,
  },

  // Slide 10: Executive Command Centre (48 seconds)
  slide10: {
    title: 1.36,
    singleDashboard: 4.32,
    visibility: 6.18,
    keyActivities: 7.86,
    complianceScores: 11.58,
    groupedClient: 16.3,
    groupedRegion: 18.48,
    drillDown: 21.96,
    individualAreas: 23.76,
    ncrAccounts: 26.32,
    trends: 28.16,
    agingSeverity: 29.66,
    trendAnalysis: 32.64,
    improving: 35.1,
    declining: 36.56,
    fasterDecisions: 38.82,
    fewerSurprises: 40.7,
    visibilityAccountability: 42.32,
    dashboardReveal: 44.0,
  },
};

// ── Images ─────────────────────────────────────────────────────────────
const IMG = {
  platform: 'images/ecowize/07-platform-overview.jpg',
  cleaning: 'images/ecowize/08-cleaning-verification.jpg',
  ncr: 'images/ecowize/09-ncr-management.jpg',
  audit: 'images/ecowize/10-internal-audit.jpg',
  command: 'images/ecowize/12-command-centre.jpg',
  // Dashboard screenshots for reveals
  modCleaning: 'images/ecowize/showcase/mod-01-cleaning.png',
  modNcr: 'images/ecowize/showcase/mod-02-ncr.png',
  modAudit: 'images/ecowize/showcase/mod-03-audit.png',
  execDashboard: 'images/ecowize/showcase/executive-dashboard.png',
};

const C = {
  bg: theme.colors.background,
  text: theme.colors.text,
  accent: theme.colors.accent,
  highlight: theme.colors.highlight,
  primary: theme.colors.primary,
  secondary: theme.colors.secondary,
};

const FONT = theme.typography.fontFamily;

// ── Utility Hooks ──────────────────────────────────────────────────────
function useCue(cueTimeSeconds: number, fadeDuration = 0.5) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;

  const opacity = interpolate(
    frame,
    [cueFrame, cueFrame + fadeDuration * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return { opacity, isActive: frame >= cueFrame };
}

function useCueSpring(cueTimeSeconds: number, config = { damping: 20, stiffness: 180 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame, fps, delay: cueTimeSeconds * fps, config });
}

// ── Ken Burns ──────────────────────────────────────────────────────────
const KenBurns: React.FC<{
  src: string;
  opacity?: number;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
}> = ({ src, opacity = 0.65, zoomFrom = 1.0, zoomTo = 1.12, panX = 0, panY = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const tx = interpolate(frame, [0, durationInFrames], [0, panX], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ty = interpolate(frame, [0, durationInFrames], [0, panY], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity,
        transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
      }}
    />
  );
};

// ── Dashboard Reveal Component ─────────────────────────────────────────
const DashboardReveal: React.FC<{
  title: string;
  imagePath: string;
  revealTime: number;
}> = ({ title, imagePath, revealTime }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const revealOpacity = interpolate(
    frame,
    [revealTime * fps, (revealTime + 0.8) * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = interpolate(
    frame,
    [revealTime * fps, (revealTime + 0.8) * fps],
    [0.95, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  if (revealOpacity === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      opacity: revealOpacity,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: C.bg,
    }}>
      <div style={{
        padding: '24px 60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.text, fontFamily: FONT }}>
          {title}
        </div>
        <div style={{
          padding: '8px 20px',
          backgroundColor: C.accent,
          borderRadius: 20,
          fontSize: 14,
          fontWeight: 600,
          color: C.bg,
          fontFamily: FONT,
        }}>
          Live Dashboard
        </div>
      </div>
      <div style={{
        flex: 1,
        padding: '0 60px 40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Img
          src={staticFile(imagePath)}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: 16,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            transform: `scale(${scale})`,
          }}
        />
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SLIDE 6: Platform Overview — NARRATION SYNCED (30 seconds)
// ══════════════════════════════════════════════════════════════════════════
const PlatformOverviewSlideSynced: React.FC = () => {
  const cues = CUES.slide06;
  const titleCue = useCue(cues.title);
  const unifiedCue = useCue(cues.unifiedSystem);
  const mobileCue = useCue(cues.mobileFirst);

  const pillars = [
    { icon: '✓', label: 'Verify', sub: 'Cleaning at point of work', color: C.accent, cue: cues.verify },
    { icon: '⚠', label: 'Correct', sub: 'NCRs with auto-escalation', color: '#f97316', cue: cues.correct },
    { icon: '📋', label: 'Audit', sub: 'Templates & scoring', color: C.highlight, cue: cues.audit },
    { icon: '👁', label: 'Oversee', sub: 'Multi-site command centre', color: C.primary, cue: cues.oversee },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.platform} opacity={0.35} zoomFrom={1.0} zoomTo={1.1} panX={-15} panY={10} />
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(90deg, ${withOpacity(C.bg, 0.95)} 0%, ${withOpacity(C.bg, 0.75)} 60%, ${withOpacity(C.bg, 0.5)} 100%)`,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 52, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
          opacity: titleCue.opacity, transform: `translateY(${(1 - titleCue.opacity) * 20}px)`,
        }}>
          Proposed Ecowize Digital Platform
        </div>
        <div style={{
          fontSize: 24, color: withOpacity(C.text, 0.8), fontFamily: FONT, marginBottom: 30,
          opacity: unifiedCue.opacity, transform: `translateY(${(1 - unifiedCue.opacity) * 15}px)`,
        }}>
          A unified platform that turns sanitation into a live, auditable system — not monthly snapshots.
        </div>
        <div style={{
          width: 60, height: 4, backgroundColor: C.accent, marginBottom: 40,
          opacity: titleCue.opacity, transform: `scaleX(${titleCue.opacity})`, transformOrigin: 'left',
        }} />

        <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
          {pillars.map((pillar, i) => {
            const entrance = useCueSpring(pillar.cue);
            return (
              <div key={i} style={{
                flex: 1, padding: '30px 24px', borderRadius: 14,
                backgroundColor: withOpacity(pillar.color, 0.08),
                border: `2px solid ${withOpacity(pillar.color, 0.25)}`,
                textAlign: 'center',
                opacity: entrance, transform: `translateY(${(1 - entrance) * 40}px) scale(${0.8 + entrance * 0.2})`,
              }}>
                <div style={{ fontSize: 48, marginBottom: 16, transform: `scale(${entrance})` }}>{pillar.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: pillar.color, fontFamily: FONT, marginBottom: 8 }}>{pillar.label}</div>
                <div style={{ fontSize: 16, color: withOpacity(C.text, 0.7), fontFamily: FONT }}>{pillar.sub}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 30, opacity: mobileCue.opacity, transform: `translateY(${(1 - mobileCue.opacity) * 20}px)` }}>
          {[
            { icon: '📱', text: 'Mobile-first, offline-capable' },
            { icon: '🔄', text: 'Real-time sync to dashboards' },
            { icon: '🔒', text: 'Secure, timestamped records' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
              backgroundColor: withOpacity(C.accent, 0.1), borderRadius: 8,
            }}>
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <span style={{ fontSize: 18, color: C.text, fontFamily: FONT }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SLIDE 7: Cleaning Verification — NARRATION SYNCED (79 seconds)
// ══════════════════════════════════════════════════════════════════════════
const CleaningVerificationSlideSynced: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cues = CUES.slide07;

  const titleCue = useCue(cues.title);
  const coreCue = useCue(cues.coreModule);
  const transformCue = useCue(cues.transformSchedule);
  const digitalTaskCue = useCue(cues.digitalTask);
  const specsCue = useCue(cues.specs);
  const correctiveActionsCue = useCue(cues.correctiveActions);
  const photoCue = useCue(cues.photographs);
  const mixerCue = useCue(cues.cleanMixer);
  const proofCue = useCue(cues.proofOfPresence);
  const signOffCue = useCue(cues.signOff);

  const whatWhenHowWho = [
    { label: 'What', cue: cues.theWhat },
    { label: 'When', cue: cues.theWhen },
    { label: 'How', cue: cues.theHow },
    { label: 'Who', cue: cues.theWho },
  ];

  const techStack = [
    { label: 'QR Codes', icon: '📱', cue: cues.qrCodes },
    { label: 'Barcodes', icon: '📊', cue: cues.barCodes },
    { label: 'NFC Tags', icon: '📡', cue: cues.nfcTags },
    { label: 'RFID Tags', icon: '🏷️', cue: cues.rfidTags },
  ];

  const conceptualOpacity = interpolate(
    frame, [cues.dashboardReveal * fps, (cues.dashboardReveal + 0.5) * fps], [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ opacity: conceptualOpacity }}>
        <KenBurns src={IMG.cleaning} opacity={0.3} zoomFrom={1.0} zoomTo={1.15} panX={20} panY={-10} />
      </div>
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(135deg, ${withOpacity(C.bg, 0.95)} 0%, ${withOpacity(C.bg, 0.8)} 50%, ${withOpacity(C.bg, 0.6)} 100%)`,
        opacity: conceptualOpacity,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '60px 80px', display: 'flex', flexDirection: 'column', opacity: conceptualOpacity }}>
        <div style={{ marginBottom: 30 }}>
          <div style={{
            fontSize: 48, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
            opacity: titleCue.opacity, transform: `translateX(${(1 - titleCue.opacity) * -30}px)`,
          }}>
            Cleaning Verification Module
          </div>
          <div style={{ fontSize: 20, color: C.accent, fontFamily: FONT, fontWeight: 600, opacity: coreCue.opacity }}>
            The core of this digital platform
          </div>
          <div style={{ width: 80, height: 4, backgroundColor: C.accent, marginTop: 16, opacity: titleCue.opacity }} />
        </div>

        <div style={{ display: 'flex', gap: 40, flex: 1 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.primary, 0.1), borderRadius: 12, borderLeft: `4px solid ${C.primary}`,
              opacity: transformCue.opacity, transform: `translateX(${(1 - transformCue.opacity) * -20}px)`,
            }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.text, fontFamily: FONT, marginBottom: 8 }}>Transform Master Cleaning Schedule</div>
              <div style={{ fontSize: 14, color: withOpacity(C.text, 0.7), fontFamily: FONT }}>SLA agreements → Digital tasks for site teams</div>
            </div>

            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.accent, 0.1), borderRadius: 12, borderLeft: `4px solid ${C.accent}`,
              opacity: digitalTaskCue.opacity, transform: `translateX(${(1 - digitalTaskCue.opacity) * -20}px)`,
            }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.text, fontFamily: FONT, marginBottom: 12 }}>Digital Task Contains:</div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {whatWhenHowWho.map((item, i) => {
                  const cue = useCue(item.cue, 0.3);
                  return (
                    <div key={i} style={{
                      padding: '8px 16px', backgroundColor: withOpacity(C.accent, 0.2), borderRadius: 20,
                      fontSize: 16, fontWeight: 600, color: C.accent, fontFamily: FONT,
                      opacity: cue.opacity, transform: `scale(${0.8 + cue.opacity * 0.2})`,
                    }}>The {item.label}</div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <div style={{ padding: '6px 12px', backgroundColor: withOpacity(C.highlight, 0.2), borderRadius: 6, fontSize: 14, color: C.highlight, fontFamily: FONT, opacity: specsCue.opacity }}>Specs</div>
                <div style={{ padding: '6px 12px', backgroundColor: withOpacity(C.highlight, 0.2), borderRadius: 6, fontSize: 14, color: C.highlight, fontFamily: FONT, opacity: correctiveActionsCue.opacity }}>Corrective Actions</div>
              </div>
            </div>

            <div style={{
              padding: '16px 24px', backgroundColor: withOpacity('#8b5cf6', 0.1), borderRadius: 12, borderLeft: `4px solid #8b5cf6`,
              display: 'flex', alignItems: 'center', gap: 16, opacity: photoCue.opacity, transform: `translateX(${(1 - photoCue.opacity) * -20}px)`,
            }}>
              <span style={{ fontSize: 32 }}>📷</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.text, fontFamily: FONT }}>Attach Standards as Photographs</div>
                <div style={{ fontSize: 14, color: withOpacity(C.text, 0.7), fontFamily: FONT, opacity: mixerCue.opacity }}>"This is what a clean mixer looks like"</div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.secondary, 0.1), borderRadius: 12,
              opacity: proofCue.opacity, transform: `translateY(${(1 - proofCue.opacity) * 20}px)`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8 }}>Proof of Presence</div>
              <div style={{ fontSize: 14, color: withOpacity(C.text, 0.7), fontFamily: FONT }}>Irrefutable evidence of cleaning execution</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {techStack.map((tech, i) => {
                const cue = useCue(tech.cue, 0.4);
                return (
                  <div key={i} style={{
                    padding: '20px', backgroundColor: withOpacity(C.accent, 0.08), borderRadius: 12, textAlign: 'center',
                    border: `2px solid ${withOpacity(C.accent, cue.opacity * 0.5)}`,
                    opacity: cue.opacity, transform: `scale(${0.9 + cue.opacity * 0.1})`,
                  }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>{tech.icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: C.text, fontFamily: FONT }}>{tech.label}</div>
                  </div>
                );
              })}
            </div>

            <div style={{
              padding: '24px', backgroundColor: withOpacity(C.accent, 0.15), borderRadius: 12, border: `2px solid ${C.accent}`, textAlign: 'center',
              opacity: signOffCue.opacity, transform: `scale(${0.95 + signOffCue.opacity * 0.05})`,
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: FONT }}>Sign Off Digital Tasks</div>
              <div style={{ fontSize: 14, color: withOpacity(C.text, 0.7), fontFamily: FONT, marginTop: 8 }}>Linked to your SLA commitments</div>
            </div>
          </div>
        </div>
      </div>

      <DashboardReveal title="Cleaning Verification" imagePath={IMG.modCleaning} revealTime={cues.dashboardReveal} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SLIDE 8: NCR Management — NARRATION SYNCED (45 seconds)
// ══════════════════════════════════════════════════════════════════════════
const NCRManagementSlideSynced: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cues = CUES.slide08;

  const titleCue = useCue(cues.title);
  const frameworkCue = useCue(cues.captureFramework);
  const severityCue = useCue(cues.severity);
  const resolvedCue = useCue(cues.resolved);
  const timelinesCue = useCue(cues.timelines);
  const raciCue = useCue(cues.responsible);
  const auditTrailCue = useCue(cues.auditTrail);
  const statusCue = useCue(cues.statusLevels);

  const raciItems = [
    { label: 'Responsible', cue: cues.responsible },
    { label: 'Accountable', cue: cues.accountable },
    { label: 'Consulted', cue: cues.consulted },
    { label: 'Informed', cue: cues.informed },
  ];

  const statusQuestions = [
    { text: 'Where is it sitting?', cue: cues.whereSitting },
    { text: 'What has been resolved?', cue: cues.resolved2 },
    { text: 'What is outstanding?', cue: cues.outstanding },
    { text: 'What\'s in the parking bay?', cue: cues.parkingBay },
  ];

  const conceptualOpacity = interpolate(
    frame, [cues.dashboardReveal * fps, (cues.dashboardReveal + 0.5) * fps], [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ opacity: conceptualOpacity }}>
        <KenBurns src={IMG.ncr} opacity={0.3} zoomFrom={1.0} zoomTo={1.1} panX={-10} panY={5} />
      </div>
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(135deg, ${withOpacity(C.bg, 0.95)} 0%, ${withOpacity(C.bg, 0.85)} 100%)`,
        opacity: conceptualOpacity,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '60px 80px', display: 'flex', flexDirection: 'column', opacity: conceptualOpacity }}>
        <div style={{ marginBottom: 30 }}>
          <div style={{
            fontSize: 48, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
            opacity: titleCue.opacity, transform: `translateX(${(1 - titleCue.opacity) * -30}px)`,
          }}>
            NCR Management System
          </div>
          <div style={{ width: 80, height: 4, backgroundColor: '#f97316', marginTop: 16, opacity: titleCue.opacity }} />
        </div>

        <div style={{ display: 'flex', gap: 40, flex: 1 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity('#f97316', 0.1), borderRadius: 12, borderLeft: `4px solid #f97316`,
              opacity: frameworkCue.opacity, transform: `translateX(${(1 - frameworkCue.opacity) * -20}px)`,
            }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.text, fontFamily: FONT, marginBottom: 12 }}>Capture Your Framework</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: severityCue.opacity }}>
                  <span style={{ color: '#f97316' }}>●</span>
                  <span style={{ fontSize: 14, color: C.text, fontFamily: FONT }}>Severity rating</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: resolvedCue.opacity }}>
                  <span style={{ color: '#f97316' }}>●</span>
                  <span style={{ fontSize: 14, color: C.text, fontFamily: FONT }}>Resolution requirements</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: timelinesCue.opacity }}>
                  <span style={{ color: '#f97316' }}>●</span>
                  <span style={{ fontSize: 14, color: C.text, fontFamily: FONT }}>Timelines</span>
                </div>
              </div>
            </div>

            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.primary, 0.1), borderRadius: 12, borderLeft: `4px solid ${C.primary}`,
              opacity: raciCue.opacity, transform: `translateX(${(1 - raciCue.opacity) * -20}px)`,
            }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.text, fontFamily: FONT, marginBottom: 12 }}>Communication Framework (RACI)</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {raciItems.map((item, i) => {
                  const cue = useCue(item.cue, 0.3);
                  return (
                    <div key={i} style={{
                      padding: '8px 16px', backgroundColor: withOpacity(C.primary, 0.2), borderRadius: 20,
                      fontSize: 14, fontWeight: 600, color: C.primary, fontFamily: FONT,
                      opacity: cue.opacity, transform: `scale(${0.8 + cue.opacity * 0.2})`,
                    }}>{item.label}</div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.accent, 0.1), borderRadius: 12,
              opacity: auditTrailCue.opacity, transform: `translateY(${(1 - auditTrailCue.opacity) * 20}px)`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.accent, fontFamily: FONT, marginBottom: 8 }}>Full Audit Trail</div>
              <div style={{ fontSize: 14, color: withOpacity(C.text, 0.7), fontFamily: FONT, opacity: statusCue.opacity }}>Status levels of every NCR</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {statusQuestions.map((q, i) => {
                const cue = useCue(q.cue, 0.3);
                return (
                  <div key={i} style={{
                    padding: '16px 20px', backgroundColor: withOpacity(C.secondary, 0.1), borderRadius: 10,
                    fontSize: 16, color: C.text, fontFamily: FONT,
                    opacity: cue.opacity, transform: `translateX(${(1 - cue.opacity) * 20}px)`,
                    borderLeft: `3px solid ${C.secondary}`,
                  }}>{q.text}</div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <DashboardReveal title="NCR Management" imagePath={IMG.modNcr} revealTime={cues.dashboardReveal} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SLIDE 9: Internal Audits — NARRATION SYNCED (50 seconds)
// ══════════════════════════════════════════════════════════════════════════
const InternalAuditsSlideSynced: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cues = CUES.slide09;

  const titleCue = useCue(cues.title);
  const digitalAuditCue = useCue(cues.digitalAudit);
  const areaManagersCue = useCue(cues.areaManagers);
  const linkedCue = useCue(cues.linkedToNcr);
  const traceabilityCue = useCue(cues.fullTraceability);
  const signaturesCue = useCue(cues.digitalSignatures);
  const offlineCue = useCue(cues.offlineCapability);
  const historicalCue = useCue(cues.historicalComparisons);
  const trendsCue = useCue(cues.trends);
  const improvementCue = useCue(cues.improvement);
  const engagementCue = useCue(cues.clientEngagement);
  const factCue = useCue(cues.basedOnFact);
  const scoresCue = useCue(cues.scores);

  const conceptualOpacity = interpolate(
    frame, [cues.dashboardReveal * fps, (cues.dashboardReveal + 0.5) * fps], [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const features = [
    { icon: '✍️', label: 'Digital Signatures', cue: signaturesCue.opacity },
    { icon: '📴', label: 'Offline Capability', cue: offlineCue.opacity },
    { icon: '📈', label: 'Historical Comparisons', cue: historicalCue.opacity },
    { icon: '📊', label: 'Trend Analysis', cue: trendsCue.opacity },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ opacity: conceptualOpacity }}>
        <KenBurns src={IMG.audit} opacity={0.3} zoomFrom={1.0} zoomTo={1.1} panX={10} panY={-5} />
      </div>
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(135deg, ${withOpacity(C.bg, 0.95)} 0%, ${withOpacity(C.bg, 0.85)} 100%)`,
        opacity: conceptualOpacity,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '60px 80px', display: 'flex', flexDirection: 'column', opacity: conceptualOpacity }}>
        <div style={{ marginBottom: 30 }}>
          <div style={{
            fontSize: 48, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
            opacity: titleCue.opacity, transform: `translateX(${(1 - titleCue.opacity) * -30}px)`,
          }}>
            Internal Audit Platform
          </div>
          <div style={{ width: 80, height: 4, backgroundColor: C.highlight, marginTop: 16, opacity: titleCue.opacity }} />
        </div>

        <div style={{ display: 'flex', gap: 40, flex: 1 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.highlight, 0.1), borderRadius: 12, borderLeft: `4px solid ${C.highlight}`,
              opacity: digitalAuditCue.opacity, transform: `translateX(${(1 - digitalAuditCue.opacity) * -20}px)`,
            }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.text, fontFamily: FONT, marginBottom: 8 }}>Transform to Digital Audits</div>
              <div style={{ fontSize: 14, color: withOpacity(C.text, 0.7), fontFamily: FONT, opacity: areaManagersCue.opacity }}>
                Area managers and operations complete whilst on site
              </div>
            </div>

            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.accent, 0.1), borderRadius: 12, borderLeft: `4px solid ${C.accent}`,
              opacity: linkedCue.opacity, transform: `translateX(${(1 - linkedCue.opacity) * -20}px)`,
            }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.accent, fontFamily: FONT, marginBottom: 8 }}>Linked to NCR Module</div>
              <div style={{ fontSize: 14, color: withOpacity(C.text, 0.7), fontFamily: FONT, opacity: traceabilityCue.opacity }}>
                Fully linked for full traceability
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {features.map((f, i) => (
                <div key={i} style={{
                  padding: '16px', backgroundColor: withOpacity(C.primary, 0.08), borderRadius: 10, textAlign: 'center',
                  opacity: f.cue, transform: `scale(${0.9 + f.cue * 0.1})`,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: FONT }}>{f.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              padding: '24px', backgroundColor: withOpacity(C.accent, 0.15), borderRadius: 12, border: `2px solid ${C.accent}`,
              opacity: improvementCue.opacity, transform: `translateY(${(1 - improvementCue.opacity) * 20}px)`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.accent, fontFamily: FONT, marginBottom: 8 }}>Show Improvement Over Time</div>
              <div style={{ fontSize: 14, color: withOpacity(C.text, 0.7), fontFamily: FONT }}>
                Historical comparisons and trends demonstrate progress
              </div>
            </div>

            <div style={{
              padding: '24px', backgroundColor: withOpacity('#8b5cf6', 0.1), borderRadius: 12, borderLeft: `4px solid #8b5cf6`,
              opacity: engagementCue.opacity, transform: `translateY(${(1 - engagementCue.opacity) * 20}px)`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#8b5cf6', fontFamily: FONT, marginBottom: 12 }}>Excellent Client Engagement</div>
              <div style={{ fontSize: 14, color: withOpacity(C.text, 0.8), fontFamily: FONT, opacity: factCue.opacity, marginBottom: 8 }}>
                Base engagements on fact
              </div>
              <div style={{ fontSize: 14, color: withOpacity(C.text, 0.8), fontFamily: FONT, opacity: scoresCue.opacity }}>
                Scores immediately available to clients on completion
              </div>
            </div>
          </div>
        </div>
      </div>

      <DashboardReveal title="Internal Audits" imagePath={IMG.modAudit} revealTime={cues.dashboardReveal} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SLIDE 10: Executive Command Centre — NARRATION SYNCED (48 seconds)
// ══════════════════════════════════════════════════════════════════════════
const ExecutiveCommandCentreSlideSynced: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cues = CUES.slide10;

  const titleCue = useCue(cues.title);
  const dashboardCue = useCue(cues.singleDashboard);
  const visibilityCue = useCue(cues.visibility);
  const complianceCue = useCue(cues.complianceScores);
  const groupedCue = useCue(cues.groupedClient);
  const drillDownCue = useCue(cues.drillDown);
  const ncrCue = useCue(cues.ncrAccounts);
  const trendsCue = useCue(cues.trends);
  const agingCue = useCue(cues.agingSeverity);
  const analysisCue = useCue(cues.trendAnalysis);
  const fasterCue = useCue(cues.fasterDecisions);
  const fewerCue = useCue(cues.fewerSurprises);
  const finalCue = useCue(cues.visibilityAccountability);

  const conceptualOpacity = interpolate(
    frame, [cues.dashboardReveal * fps, (cues.dashboardReveal + 0.5) * fps], [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const metrics = [
    { icon: '📊', label: 'Compliance Scores', sub: 'Per site', cue: complianceCue.opacity },
    { icon: '🚨', label: 'NCR Accounts', sub: 'Counts & severity', cue: ncrCue.opacity },
    { icon: '📈', label: 'Trends', sub: 'Improving or declining', cue: trendsCue.opacity },
    { icon: '⏰', label: 'Aging Severity', sub: 'Across the business', cue: agingCue.opacity },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ opacity: conceptualOpacity }}>
        <KenBurns src={IMG.command} opacity={0.3} zoomFrom={1.0} zoomTo={1.1} panX={-10} panY={5} />
      </div>
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(135deg, ${withOpacity(C.bg, 0.95)} 0%, ${withOpacity(C.bg, 0.85)} 100%)`,
        opacity: conceptualOpacity,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '60px 80px', display: 'flex', flexDirection: 'column', opacity: conceptualOpacity }}>
        <div style={{ marginBottom: 30 }}>
          <div style={{
            fontSize: 48, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
            opacity: titleCue.opacity, transform: `translateX(${(1 - titleCue.opacity) * -30}px)`,
          }}>
            Executive Command Centre
          </div>
          <div style={{
            fontSize: 20, color: C.primary, fontFamily: FONT, fontWeight: 600,
            opacity: dashboardCue.opacity,
          }}>
            Single dashboard — visibility of all key activities
          </div>
          <div style={{ width: 80, height: 4, backgroundColor: C.primary, marginTop: 16, opacity: titleCue.opacity }} />
        </div>

        <div style={{ display: 'flex', gap: 40, flex: 1 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              {metrics.map((m, i) => (
                <div key={i} style={{
                  padding: '20px', backgroundColor: withOpacity(C.primary, 0.08), borderRadius: 12, textAlign: 'center',
                  opacity: m.cue, transform: `scale(${0.9 + m.cue * 0.1})`,
                }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{m.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FONT }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: withOpacity(C.text, 0.6), fontFamily: FONT }}>{m.sub}</div>
                </div>
              ))}
            </div>

            <div style={{
              padding: '16px 24px', backgroundColor: withOpacity(C.secondary, 0.1), borderRadius: 12, borderLeft: `4px solid ${C.secondary}`,
              opacity: groupedCue.opacity, marginBottom: 16,
            }}>
              <div style={{ fontSize: 16, color: C.text, fontFamily: FONT }}>
                Grouped by client, region — with <span style={{ color: C.accent, fontWeight: 600, opacity: drillDownCue.opacity }}>drill-down to individual areas</span>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              padding: '24px', backgroundColor: withOpacity(C.accent, 0.1), borderRadius: 12, borderLeft: `4px solid ${C.accent}`,
              opacity: analysisCue.opacity, transform: `translateY(${(1 - analysisCue.opacity) * 20}px)`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.accent, fontFamily: FONT, marginBottom: 12 }}>Trend Analysis</div>
              <div style={{ fontSize: 14, color: withOpacity(C.text, 0.8), fontFamily: FONT }}>
                See whether sites are improving or in a declining state
              </div>
            </div>

            <div style={{
              padding: '24px', backgroundColor: withOpacity(C.accent, 0.15), borderRadius: 12, border: `2px solid ${C.accent}`,
              display: 'flex', gap: 24, justifyContent: 'center',
              opacity: fasterCue.opacity, transform: `scale(${0.95 + fasterCue.opacity * 0.05})`,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.accent, fontFamily: FONT }}>Faster Decisions</div>
              </div>
              <div style={{ textAlign: 'center', opacity: fewerCue.opacity }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.accent, fontFamily: FONT }}>Fewer Surprises</div>
              </div>
            </div>

            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.primary, 0.15), borderRadius: 12,
              textAlign: 'center', opacity: finalCue.opacity, transform: `translateY(${(1 - finalCue.opacity) * 20}px)`,
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: FONT }}>
                The <span style={{ color: C.primary }}>visibility</span> and <span style={{ color: C.accent }}>accountability</span> that is required
              </div>
            </div>
          </div>
        </div>
      </div>

      <DashboardReveal title="Executive Command Centre" imagePath={IMG.execDashboard} revealTime={cues.dashboardReveal} />
    </AbsoluteFill>
  );
};

// ── Audio & Narration ────────────────────────────────────────────────────
const AUDIO_MAP = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
function audioSrc(slideNum: number): string {
  return `audio/ecowize/v10/slide-${String(slideNum).padStart(2, '0')}.mp3`;
}

const Narrated: React.FC<{ idx: number; audio: boolean; children: React.ReactNode }> = ({ idx, audio, children }) => (
  <AbsoluteFill>
    {children}
    {audio && AUDIO_MAP[idx] > 0 && <Audio src={staticFile(audioSrc(AUDIO_MAP[idx]))} volume={0.9} />}
  </AbsoluteFill>
);

const fadeT = <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />;

// ══════════════════════════════════════════════════════════════════════════
// EXPORT: Full Solution Slides Demo (Slides 6-10)
// ══════════════════════════════════════════════════════════════════════════
export interface EcowizePitchSyncedProps {
  audioNarration?: boolean;
}

// Total duration: 30 + 79 + 45 + 50 + 48 = 252 seconds
export function getEcowizePitchSyncedDuration(fps: number): number {
  return (30 + 79 + 45 + 50 + 48) * fps - 4 * TRANSITION_FRAMES;
}

export const EcowizePitchSyncedDemo: React.FC<EcowizePitchSyncedProps> = ({ audioNarration = true }) => {
  const a = audioNarration;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <TransitionSeries>
        {/* Slide 6: Platform Overview - 30 seconds */}
        <TransitionSeries.Sequence durationInFrames={30 * FPS}>
          <Narrated idx={5} audio={a}><PlatformOverviewSlideSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 7: Cleaning Verification - 79 seconds */}
        <TransitionSeries.Sequence durationInFrames={79 * FPS}>
          <Narrated idx={6} audio={a}><CleaningVerificationSlideSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 8: NCR Management - 45 seconds */}
        <TransitionSeries.Sequence durationInFrames={45 * FPS}>
          <Narrated idx={7} audio={a}><NCRManagementSlideSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 9: Internal Audits - 50 seconds */}
        <TransitionSeries.Sequence durationInFrames={50 * FPS}>
          <Narrated idx={8} audio={a}><InternalAuditsSlideSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 10: Executive Command Centre - 48 seconds */}
        <TransitionSeries.Sequence durationInFrames={48 * FPS}>
          <Narrated idx={9} audio={a}><ExecutiveCommandCentreSlideSynced /></Narrated>
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export default EcowizePitchSyncedDemo;
