/**
 * Ecowize Digital Platform Pitch — FULL NARRATION-SYNCED VERSION
 *
 * All 15 slides with Whisper transcription-driven timing.
 * Visual elements appear when mentioned in the narration.
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

// Slide durations from narration (in seconds)
const SLIDE_DURATIONS = [36, 72, 52, 31, 29, 30, 79, 45, 50, 48, 44, 34, 39, 63, 27];

// ── Narration Cue Points (from Whisper transcription) ─────────────────
const CUES = {
  // Slide 1: Title/Hook (36 seconds)
  slide01: {
    foodSafety: 1.26,
    propose: 4.48,
    delivers: 8.08,
    everySite: 12.06,
    everyRegion: 13.12,
    everyShift: 14.28,
    everyDay: 15.72,
    whyImportant: 16.58,
    globalBrands: 19.72,
    boardLevelRisk: 23.62,
    cannotDelegate: 27.66,
    accountability: 31.62,
  },

  // Slide 2: Accountability Gap (72 seconds)
  slide02: {
    historically: 3.38,
    whatIsGap: 6.9,
    peopleExecute: 9.12,
    notAccountable: 15.42,
    delegateResponsibility: 18.12,
    cannotDelegateAccountability: 21.28,
    withoutVisibility: 26.92,
    periodicReports: 31.62,
    siteManagers: 38.42,
    topManagement: 45.64,
    trustOnPeople: 49.96,
    burdenOfProof: 60.78,
    canOnlyManage: 66.24,
  },

  // Slide 3: If Not Recorded (52 seconds)
  slide03: {
    ifNotRecorded: 1.06,
    goldenRule: 6.06,
    howConfident: 8.14,
    dueDiligence: 14.78,
    mockRecall: 23.14,
    unannouncedAudit: 24.62,
    howDoWeKnow: 30.62,
    proactive: 32.12,
    executivesNeed: 36.08,
    timestamped: 38.68,
    traceable: 39.76,
    defendable: 41.44,
    digitalPlatform: 45.94,
    paperToProof: 48.04,
  },

  // Slide 4: Enterprise Impact (31 seconds)
  slide04: {
    oneIncident: 1.1,
    potential: 2.94,
    enterpriseImpact: 4.02,
    singleFailure: 6.18,
    cascade: 8.52,
    productRecall: 9.28,
    lostBusiness: 11.16,
    regulatoryAction: 12.82,
    reputationalDamage: 14.6,
    exposureMultiplies: 17.24,
    singleIncident: 21.78,
    brandProtection: 26.26,
  },

  // Slide 5: Audit Drag (29 seconds)
  slide05: {
    inherentProblem: 1.4,
    manualRecords: 3.74,
    auditDrag: 5.94,
    decisionLag: 7.56,
    obscuresTrends: 9.76,
    becomeIncidents: 12.1,
    piledInBinders: 14.1,
    fileCabinets: 17.4,
    byTheTime: 18.94,
    riskManifested: 21.3,
    fasterDecisions: 24.32,
    fewerSurprises: 26.58,
  },

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

  // Slide 11: Trusted by Food Safety Leaders (44 seconds)
  slide11: {
    understanding: 0.98,
    businessNeeds: 3.6,
    trustedBy: 7.4,
    twentyFiveYears: 12.62,
    differentCountries: 14.32,
    whatIsAtStake: 15.74,
    foodSafetyIndustry: 18.08,
    globalBrands: 22.12,
    marketLeader: 26.82,
    thoughtLeader: 28.6,
    excitedToEngage: 30.4,
    buildingVision: 34.58,
    whatYouHaveUsBuild: 37.78,
  },

  // Slide 12: Proven Capabilities (34 seconds)
  slide12: {
    whatWeBring: 1.62,
    capacity: 5.16,
    buildAndScale: 6.32,
    cleaningVerifications: 7.88,
    glassRegisters: 10.88,
    ncrManagement: 13.16,
    internalAudits: 15.24,
    customerComplaints: 17.54,
    satisfactionSurveys: 20.36,
    proofOfPresence: 22.4,
    assetRegisters: 24.44,
    onlineTraining: 26.44,
    documentControl: 28.28,
    otherModules: 30.38,
  },

  // Slide 13: Co-Build and Own (39 seconds)
  slide13: {
    proposal: 0.0,
    coBuild: 2.56,
    youOwn: 3.7,
    workWithTeams: 4.94,
    workflows: 6.44,
    fitsOperations: 7.98,
    complementExpertise: 10.36,
    scalableArchitecture: 14.2,
    responsiveTeam: 16.92,
    whatIsAtStake: 18.74,
    recordsAvailable: 21.34,
    crucially: 25.62,
    ecowizeIP: 28.48,
    platformRemains: 31.68,
    competitiveAdvantage: 35.12,
  },

  // Slide 14: The Transformation (63 seconds)
  slide14: {
    whatIsThis: 0.88,
    paperReactive: 4.66,
    digitalProactive: 6.5,
    paperRecords: 8.88,
    filingCabinets: 13.04,
    digitalAccessible: 15.12,
    anyDevice: 18.84,
    paperCannotProve: 22.54,
    twoAM: 25.16,
    mockRecall: 27.26,
    actualRecall: 29.26,
    digitalProvides: 30.9,
    timestamped: 33.0,
    geolocated: 34.08,
    photoVerified: 35.1,
    paperNCRsLost: 38.18,
    digitalEscalation: 43.18,
    paperNeedsVisits: 47.34,
    digitalCommandCenter: 53.08,
    alwaysOn: 56.74,
    trendsAvailable: 60.08,
  },

  // Slide 15: Let's Build This Together (27 seconds)
  slide15: {
    inConclusion: 1.2,
    buildTogether: 3.32,
    platform: 5.44,
    delegateResponsibility: 6.84,
    siteLevel: 9.1,
    cantRunAway: 10.04,
    retainAccountability: 12.08,
    atTheTop: 15.02,
    seeingEverything: 16.42,
    alwaysOnAssurance: 18.76,
    foodSafety: 21.24,
    blindSpots: 23.02,
    thankYou: 25.04,
  },
};

// ── Images ─────────────────────────────────────────────────────────────
const IMG = {
  title: 'images/ecowize/01-title.jpg',
  factory: 'images/ecowize/02-factory-floor.jpg',
  risk: 'images/ecowize/04-risk-exposure.jpg',
  accountability: 'images/ecowize/05-accountability-chain.jpg',
  visibility: 'images/ecowize/06-visibility-gap.jpg',
  platform: 'images/ecowize/07-platform-overview.jpg',
  cleaning: 'images/ecowize/08-cleaning-verification.jpg',
  ncr: 'images/ecowize/09-ncr-management.jpg',
  audit: 'images/ecowize/10-internal-audit.jpg',
  command: 'images/ecowize/12-command-centre.jpg',
  closing: 'images/ecowize/16-partnership.jpg',
  painReality: 'images/ecowize/pain-01-reality.jpg',
  painConsequences: 'images/ecowize/pain-02-consequences.jpg',
  painAudit: 'images/ecowize/pain-03-audit.jpg',
  painSystem: 'images/ecowize/pain-04-system.jpg',
  // Dashboard screenshots
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

// ══════════════════════════════════════════════════════════════════════════
// UTILITY HOOKS
// ══════════════════════════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ══════════════════════════════════════════════════════════════════════════
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
// SLIDE 1: Title / Hook (36 seconds)
// ══════════════════════════════════════════════════════════════════════════
const Slide01TitleSynced: React.FC = () => {
  const cues = CUES.slide01;
  const titleCue = useCue(cues.foodSafety);
  const proposeCue = useCue(cues.propose);
  const everySiteCue = useCue(cues.everySite);
  const whyImportantCue = useCue(cues.whyImportant);
  const boardLevelCue = useCue(cues.boardLevelRisk);
  const accountabilityCue = useCue(cues.accountability);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.title} opacity={0.5} panX={-20} panY={-10} />
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(90deg, ${withOpacity(C.bg, 0.95)} 0%, ${withOpacity(C.bg, 0.65)} 55%, ${withOpacity(C.bg, 0.15)} 100%)`,
      }} />

      <div style={{
        position: 'absolute', inset: 0, padding: 100,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{
          fontSize: 72, fontWeight: 700, color: C.text, fontFamily: FONT,
          opacity: titleCue.opacity, transform: `translateY(${(1 - titleCue.opacity) * 30}px)`,
          lineHeight: 1.1, maxWidth: 900,
        }}>
          Food Safety Without Blind Spots
        </div>

        <div style={{
          width: interpolate(proposeCue.opacity, [0, 1], [0, 400]),
          height: 5, backgroundColor: C.accent, marginTop: 35, marginBottom: 35, borderRadius: 3,
        }} />

        <div style={{
          fontSize: 28, color: C.accent, fontFamily: FONT, opacity: proposeCue.opacity,
          maxWidth: 800, lineHeight: 1.4, marginBottom: 30,
        }}>
          A Digital Platform for Ecowize
        </div>

        <div style={{
          display: 'flex', gap: 20, flexWrap: 'wrap', maxWidth: 800,
          opacity: everySiteCue.opacity, transform: `translateY(${(1 - everySiteCue.opacity) * 20}px)`,
        }}>
          {['Every Site', 'Every Region', 'Every Shift', 'Every Day'].map((item, i) => {
            const itemCue = useCue([cues.everySite, cues.everyRegion, cues.everyShift, cues.everyDay][i], 0.3);
            return (
              <div key={i} style={{
                padding: '10px 20px', backgroundColor: withOpacity(C.accent, 0.1),
                borderRadius: 8, border: `1px solid ${withOpacity(C.accent, 0.3)}`,
                fontSize: 18, color: C.text, fontFamily: FONT,
                opacity: itemCue.opacity, transform: `scale(${0.9 + itemCue.opacity * 0.1})`,
              }}>{item}</div>
            );
          })}
        </div>

        <div style={{
          marginTop: 40, maxWidth: 700,
          opacity: boardLevelCue.opacity, transform: `translateY(${(1 - boardLevelCue.opacity) * 20}px)`,
        }}>
          <div style={{ fontSize: 22, color: withOpacity(C.text, 0.8), fontFamily: FONT, lineHeight: 1.5 }}>
            For global food brands, hygiene and sanitation is a{' '}
            <span style={{ color: C.accent, fontWeight: 700 }}>board-level risk</span>, not a line item.
          </div>
        </div>

        <div style={{
          marginTop: 30, padding: '16px 24px', backgroundColor: withOpacity(C.primary, 0.1),
          borderRadius: 10, borderLeft: `4px solid ${C.primary}`, maxWidth: 500,
          opacity: accountabilityCue.opacity, transform: `translateY(${(1 - accountabilityCue.opacity) * 20}px)`,
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.primary, fontFamily: FONT }}>
            Accountability always sits right at the top.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SLIDE 2: Accountability Gap (72 seconds)
// ══════════════════════════════════════════════════════════════════════════
const Slide02AccountabilityGapSynced: React.FC = () => {
  const cues = CUES.slide02;
  const titleCue = useCue(cues.historically);
  const whatIsGapCue = useCue(cues.whatIsGap);
  const delegateCue = useCue(cues.delegateResponsibility);
  const cannotDelegateCue = useCue(cues.cannotDelegateAccountability);
  const withoutVisibilityCue = useCue(cues.withoutVisibility);
  const trustCue = useCue(cues.trustOnPeople);
  const burdenCue = useCue(cues.burdenOfProof);
  const manageWhatKnowCue = useCue(cues.canOnlyManage);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.factory} opacity={0.35} panX={15} panY={-5} />
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(135deg, ${withOpacity(C.bg, 0.95)} 0%, ${withOpacity(C.bg, 0.75)} 100%)`,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 52, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
          opacity: titleCue.opacity, transform: `translateX(${(1 - titleCue.opacity) * -30}px)`,
        }}>
          The Accountability Gap
        </div>
        <div style={{ width: 80, height: 4, backgroundColor: '#ef4444', marginBottom: 40, opacity: titleCue.opacity }} />

        <div style={{ display: 'flex', gap: 50, flex: 1 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity('#ef4444', 0.1), borderRadius: 12,
              borderLeft: `4px solid #ef4444`, opacity: whatIsGapCue.opacity,
              transform: `translateX(${(1 - whatIsGapCue.opacity) * -20}px)`,
            }}>
              <div style={{ fontSize: 18, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>
                The people who <span style={{ fontWeight: 700 }}>execute</span> hygiene protocols on site
                are not the people held <span style={{ fontWeight: 700, color: '#ef4444' }}>accountable</span>.
              </div>
            </div>

            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.primary, 0.1), borderRadius: 12,
              opacity: delegateCue.opacity, transform: `translateX(${(1 - delegateCue.opacity) * -20}px)`,
            }}>
              <div style={{ fontSize: 18, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>
                We <span style={{ color: C.accent }}>delegate responsibility</span> to them...
              </div>
              <div style={{
                fontSize: 18, color: '#ef4444', fontFamily: FONT, lineHeight: 1.5, marginTop: 10,
                fontWeight: 700, opacity: cannotDelegateCue.opacity,
              }}>
                ...but cannot delegate accountability for anything going wrong.
              </div>
            </div>

            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.secondary, 0.1), borderRadius: 12,
              borderLeft: `4px solid ${C.secondary}`, opacity: withoutVisibilityCue.opacity,
              transform: `translateX(${(1 - withoutVisibilityCue.opacity) * -20}px)`,
            }}>
              <div style={{ fontSize: 18, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>
                Without continuous visibility, leadership relies on{' '}
                <span style={{ fontWeight: 700, color: C.secondary }}>periodic reports</span> and{' '}
                <span style={{ fontWeight: 700, color: C.secondary }}>site visits</span>.
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.highlight, 0.1), borderRadius: 12,
              opacity: trustCue.opacity, transform: `translateY(${(1 - trustCue.opacity) * 20}px)`,
            }}>
              <div style={{ fontSize: 18, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>
                Accountability relies on <span style={{ fontWeight: 700 }}>trust</span> in people on site — as it should be.
              </div>
              <div style={{
                fontSize: 18, color: C.highlight, fontFamily: FONT, lineHeight: 1.5, marginTop: 10,
                fontWeight: 600, opacity: burdenCue.opacity,
              }}>
                But in our industry, that trust requires an extra burden of proof.
              </div>
            </div>

            <div style={{
              padding: '30px', backgroundColor: withOpacity(C.accent, 0.15), borderRadius: 16,
              border: `2px solid ${C.accent}`, textAlign: 'center',
              opacity: manageWhatKnowCue.opacity, transform: `scale(${0.95 + manageWhatKnowCue.opacity * 0.05})`,
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.accent, fontFamily: FONT }}>
                Top management can only manage what they know.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SLIDE 3: If Not Recorded (52 seconds)
// ══════════════════════════════════════════════════════════════════════════
const Slide03IfNotRecordedSynced: React.FC = () => {
  const cues = CUES.slide03;
  const titleCue = useCue(cues.ifNotRecorded);
  const goldenRuleCue = useCue(cues.goldenRule);
  const howConfidentCue = useCue(cues.howConfident);
  const mockRecallCue = useCue(cues.mockRecall);
  const howDoWeKnowCue = useCue(cues.howDoWeKnow);
  const executivesCue = useCue(cues.executivesNeed);
  const timestampedCue = useCue(cues.timestamped);
  const traceableCue = useCue(cues.traceable);
  const defendableCue = useCue(cues.defendable);
  const digitalPlatformCue = useCue(cues.digitalPlatform);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.painReality} opacity={0.35} panX={-10} panY={10} />
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(135deg, ${withOpacity(C.bg, 0.95)} 0%, ${withOpacity(C.bg, 0.75)} 100%)`,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 48, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
          opacity: titleCue.opacity, transform: `translateY(${(1 - titleCue.opacity) * -20}px)`,
        }}>
          "If it isn't recorded, it didn't happen."
        </div>
        <div style={{
          fontSize: 22, color: C.highlight, fontFamily: FONT, fontWeight: 600, marginBottom: 30,
          opacity: goldenRuleCue.opacity,
        }}>
          That's a golden rule.
        </div>
        <div style={{ width: 80, height: 4, backgroundColor: C.highlight, marginBottom: 40, opacity: titleCue.opacity }} />

        <div style={{ display: 'flex', gap: 50, flex: 1 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.secondary, 0.1), borderRadius: 12,
              borderLeft: `4px solid ${C.secondary}`, opacity: howConfidentCue.opacity,
            }}>
              <div style={{ fontSize: 18, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>
                How confident are we that management has done the due diligence?
              </div>
            </div>

            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity('#ef4444', 0.1), borderRadius: 12,
              opacity: mockRecallCue.opacity, transform: `translateX(${(1 - mockRecallCue.opacity) * -20}px)`,
            }}>
              <div style={{ fontSize: 18, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>
                When there's a <span style={{ fontWeight: 700, color: '#ef4444' }}>mock recall</span> or{' '}
                <span style={{ fontWeight: 700, color: '#ef4444' }}>unannounced audit</span>...
              </div>
            </div>

            <div style={{
              padding: '24px', backgroundColor: withOpacity(C.primary, 0.15), borderRadius: 12,
              textAlign: 'center', opacity: howDoWeKnowCue.opacity,
              transform: `scale(${0.95 + howDoWeKnowCue.opacity * 0.05})`,
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.primary, fontFamily: FONT }}>
                How do we know? How can we be proactive?
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.accent, 0.1), borderRadius: 12,
              opacity: executivesCue.opacity, transform: `translateY(${(1 - executivesCue.opacity) * 20}px)`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: C.text, fontFamily: FONT, marginBottom: 16 }}>
                Executives need evidence that is:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Time-stamped', cue: timestampedCue.opacity },
                  { label: 'Traceable', cue: traceableCue.opacity },
                  { label: 'Defendable in litigation', cue: defendableCue.opacity },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '12px 16px', backgroundColor: withOpacity(C.accent, 0.15), borderRadius: 8,
                    fontSize: 18, fontWeight: 600, color: C.accent, fontFamily: FONT,
                    opacity: item.cue, transform: `translateX(${(1 - item.cue) * 20}px)`,
                  }}>{item.label}</div>
                ))}
              </div>
            </div>

            <div style={{
              padding: '24px', backgroundColor: withOpacity(C.accent, 0.2), borderRadius: 16,
              border: `2px solid ${C.accent}`, opacity: digitalPlatformCue.opacity,
              transform: `scale(${0.95 + digitalPlatformCue.opacity * 0.05})`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: FONT, textAlign: 'center' }}>
                A digital platform transforms{' '}
                <span style={{ color: '#ef4444' }}>paper doubt</span> into{' '}
                <span style={{ color: C.accent }}>digital proof</span>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SLIDE 4: Enterprise Impact (31 seconds)
// ══════════════════════════════════════════════════════════════════════════
const Slide04EnterpriseImpactSynced: React.FC = () => {
  const cues = CUES.slide04;
  const titleCue = useCue(cues.oneIncident);
  const cascadeCue = useCue(cues.cascade);
  const recallCue = useCue(cues.productRecall);
  const businessCue = useCue(cues.lostBusiness);
  const regulatoryCue = useCue(cues.regulatoryAction);
  const reputationCue = useCue(cues.reputationalDamage);
  const multipliesCue = useCue(cues.exposureMultiplies);
  const brandCue = useCue(cues.brandProtection);

  const impacts = [
    { icon: '🚨', label: 'Product Recall', cue: recallCue.opacity, color: '#ef4444' },
    { icon: '💰', label: 'Lost Business', cue: businessCue.opacity, color: '#f97316' },
    { icon: '⚖️', label: 'Regulatory Action', cue: regulatoryCue.opacity, color: '#eab308' },
    { icon: '📉', label: 'Reputational Damage', cue: reputationCue.opacity, color: '#8b5cf6' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.painConsequences} opacity={0.35} panX={10} panY={-10} />
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(135deg, ${withOpacity(C.bg, 0.95)} 0%, ${withOpacity(C.bg, 0.8)} 100%)`,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 52, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
          opacity: titleCue.opacity, transform: `translateX(${(1 - titleCue.opacity) * -30}px)`,
        }}>
          One Incident, Enterprise Impact
        </div>
        <div style={{ width: 80, height: 4, backgroundColor: '#ef4444', marginBottom: 40, opacity: titleCue.opacity }} />

        <div style={{
          fontSize: 22, color: withOpacity(C.text, 0.8), fontFamily: FONT, marginBottom: 30,
          opacity: cascadeCue.opacity, maxWidth: 800,
        }}>
          A single hygiene and sanitation failure can cascade into:
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 40 }}>
          {impacts.map((impact, i) => (
            <div key={i} style={{
              padding: '30px 20px', backgroundColor: withOpacity(impact.color, 0.1), borderRadius: 16,
              textAlign: 'center', border: `2px solid ${withOpacity(impact.color, 0.3)}`,
              opacity: impact.cue, transform: `translateY(${(1 - impact.cue) * 30}px) scale(${0.9 + impact.cue * 0.1})`,
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{impact.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: impact.color, fontFamily: FONT }}>{impact.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          padding: '20px 30px', backgroundColor: withOpacity(C.secondary, 0.1), borderRadius: 12,
          borderLeft: `4px solid ${C.secondary}`, marginBottom: 30,
          opacity: multipliesCue.opacity, transform: `translateX(${(1 - multipliesCue.opacity) * -20}px)`,
        }}>
          <div style={{ fontSize: 20, color: C.text, fontFamily: FONT }}>
            The exposure <span style={{ fontWeight: 700, color: C.secondary }}>multiplies</span> with every site and every customer.
          </div>
        </div>

        <div style={{
          padding: '24px 30px', backgroundColor: withOpacity(C.accent, 0.15), borderRadius: 16,
          border: `2px solid ${C.accent}`, textAlign: 'center',
          opacity: brandCue.opacity, transform: `scale(${0.95 + brandCue.opacity * 0.05})`,
        }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.accent, fontFamily: FONT }}>
            This is about brand protection.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SLIDE 5: Audit Drag (29 seconds)
// ══════════════════════════════════════════════════════════════════════════
const Slide05AuditDragSynced: React.FC = () => {
  const cues = CUES.slide05;
  const titleCue = useCue(cues.inherentProblem);
  const manualCue = useCue(cues.manualRecords);
  const auditDragCue = useCue(cues.auditDrag);
  const decisionLagCue = useCue(cues.decisionLag);
  const obscuresCue = useCue(cues.obscuresTrends);
  const bindersCue = useCue(cues.piledInBinders);
  const riskCue = useCue(cues.riskManifested);
  const fasterCue = useCue(cues.fasterDecisions);
  const fewerCue = useCue(cues.fewerSurprises);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.painAudit} opacity={0.35} panX={-15} panY={5} />
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(135deg, ${withOpacity(C.bg, 0.95)} 0%, ${withOpacity(C.bg, 0.8)} 100%)`,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 52, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
          opacity: titleCue.opacity, transform: `translateX(${(1 - titleCue.opacity) * -30}px)`,
        }}>
          Audit Drag & Decision Lag
        </div>
        <div style={{ width: 80, height: 4, backgroundColor: '#f97316', marginBottom: 40, opacity: titleCue.opacity }} />

        <div style={{ display: 'flex', gap: 50, flex: 1 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity('#f97316', 0.1), borderRadius: 12,
              borderLeft: `4px solid #f97316`, opacity: manualCue.opacity,
            }}>
              <div style={{ fontSize: 18, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>
                There is an <span style={{ fontWeight: 700 }}>inherent problem</span> with manual records...
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{
                flex: 1, padding: '20px', backgroundColor: withOpacity('#ef4444', 0.1), borderRadius: 12,
                textAlign: 'center', opacity: auditDragCue.opacity, transform: `scale(${0.9 + auditDragCue.opacity * 0.1})`,
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#ef4444', fontFamily: FONT }}>Audit Drag</div>
              </div>
              <div style={{
                flex: 1, padding: '20px', backgroundColor: withOpacity('#f97316', 0.1), borderRadius: 12,
                textAlign: 'center', opacity: decisionLagCue.opacity, transform: `scale(${0.9 + decisionLagCue.opacity * 0.1})`,
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>⏳</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#f97316', fontFamily: FONT }}>Decision Lag</div>
              </div>
            </div>

            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.primary, 0.1), borderRadius: 12,
              opacity: obscuresCue.opacity, transform: `translateX(${(1 - obscuresCue.opacity) * -20}px)`,
            }}>
              <div style={{ fontSize: 18, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>
                It <span style={{ fontWeight: 700, color: C.primary }}>obscures trends</span> until they become incidents.
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.secondary, 0.1), borderRadius: 12,
              opacity: bindersCue.opacity, transform: `translateY(${(1 - bindersCue.opacity) * 20}px)`,
            }}>
              <div style={{ fontSize: 18, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>
                Documents piled in <span style={{ fontWeight: 700 }}>binders</span> and <span style={{ fontWeight: 700 }}>file cabinets</span>.
              </div>
            </div>

            <div style={{
              padding: '24px', backgroundColor: withOpacity('#ef4444', 0.15), borderRadius: 12,
              textAlign: 'center', opacity: riskCue.opacity,
            }}>
              <div style={{ fontSize: 20, color: '#ef4444', fontFamily: FONT, fontWeight: 700 }}>
                By the time leadership sees any data, the risk is already manifested.
              </div>
            </div>

            <div style={{
              padding: '24px', backgroundColor: withOpacity(C.accent, 0.15), borderRadius: 16,
              border: `2px solid ${C.accent}`, display: 'flex', gap: 30, justifyContent: 'center',
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
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SLIDES 6-10: Import from existing synced file
// ══════════════════════════════════════════════════════════════════════════
import {
  EcowizePitchSyncedDemo,
} from './EcowizePitchSynced';

// For slides 6-10, we'll use simplified versions that match the full synced pattern
// but are defined inline to avoid circular dependencies

// SLIDE 6: Platform Overview (30 seconds)
const Slide06PlatformSynced: React.FC = () => {
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

// SLIDE 7: Cleaning Verification (79 seconds)
const Slide07CleaningSynced: React.FC = () => {
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

// SLIDE 8: NCR Management (45 seconds)
const Slide08NCRSynced: React.FC = () => {
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

            <div style={{
              padding: '24px', backgroundColor: withOpacity(C.accent, 0.15), borderRadius: 12, border: `2px solid ${C.accent}`,
              textAlign: 'center', opacity: statusCue.opacity, transform: `scale(${0.95 + statusCue.opacity * 0.05})`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.accent, fontFamily: FONT }}>
                Where is it sitting? What's resolved? What's outstanding?
              </div>
            </div>
          </div>
        </div>
      </div>

      <DashboardReveal title="NCR Management" imagePath={IMG.modNcr} revealTime={cues.dashboardReveal} />
    </AbsoluteFill>
  );
};

// SLIDE 9: Internal Audits (50 seconds)
const Slide09AuditsSynced: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cues = CUES.slide09;

  const titleCue = useCue(cues.title);
  const digitalAuditCue = useCue(cues.digitalAudit);
  const linkedCue = useCue(cues.linkedToNcr);
  const traceabilityCue = useCue(cues.fullTraceability);
  const engagementCue = useCue(cues.clientEngagement);
  const scoresCue = useCue(cues.scores);

  const conceptualOpacity = interpolate(
    frame, [cues.dashboardReveal * fps, (cues.dashboardReveal + 0.5) * fps], [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

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
              <div style={{ fontSize: 18, fontWeight: 600, color: C.text, fontFamily: FONT }}>Transform to Digital Audits</div>
              <div style={{ fontSize: 14, color: withOpacity(C.text, 0.7), fontFamily: FONT, marginTop: 8 }}>
                Area managers and operations complete whilst on site
              </div>
            </div>

            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.accent, 0.1), borderRadius: 12, borderLeft: `4px solid ${C.accent}`,
              opacity: linkedCue.opacity, transform: `translateX(${(1 - linkedCue.opacity) * -20}px)`,
            }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.accent, fontFamily: FONT }}>Linked to NCR Module</div>
              <div style={{ fontSize: 14, color: withOpacity(C.text, 0.7), fontFamily: FONT, marginTop: 8, opacity: traceabilityCue.opacity }}>
                Fully linked for full traceability
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              padding: '24px', backgroundColor: withOpacity('#8b5cf6', 0.1), borderRadius: 12, borderLeft: `4px solid #8b5cf6`,
              opacity: engagementCue.opacity, transform: `translateY(${(1 - engagementCue.opacity) * 20}px)`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#8b5cf6', fontFamily: FONT, marginBottom: 8 }}>
                Excellent Client Engagement
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

// SLIDE 10: Executive Command Centre (48 seconds)
const Slide10CommandSynced: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cues = CUES.slide10;

  const titleCue = useCue(cues.title);
  const dashboardCue = useCue(cues.singleDashboard);
  const complianceCue = useCue(cues.complianceScores);
  const ncrCue = useCue(cues.ncrAccounts);
  const trendsCue = useCue(cues.trends);
  const agingCue = useCue(cues.agingSeverity);
  const fasterCue = useCue(cues.fasterDecisions);
  const fewerCue = useCue(cues.fewerSurprises);

  const metrics = [
    { icon: '📊', label: 'Compliance Scores', cue: complianceCue.opacity },
    { icon: '🚨', label: 'NCR Accounts', cue: ncrCue.opacity },
    { icon: '📈', label: 'Trends', cue: trendsCue.opacity },
    { icon: '⏰', label: 'Aging Severity', cue: agingCue.opacity },
  ];

  const conceptualOpacity = interpolate(
    frame, [cues.dashboardReveal * fps, (cues.dashboardReveal + 0.5) * fps], [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

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
            fontSize: 20, color: C.primary, fontFamily: FONT, fontWeight: 600, opacity: dashboardCue.opacity,
          }}>
            Single dashboard — visibility of all key activities
          </div>
          <div style={{ width: 80, height: 4, backgroundColor: C.primary, marginTop: 16, opacity: titleCue.opacity }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 30 }}>
          {metrics.map((m, i) => (
            <div key={i} style={{
              padding: '24px', backgroundColor: withOpacity(C.primary, 0.08), borderRadius: 12, textAlign: 'center',
              opacity: m.cue, transform: `scale(${0.9 + m.cue * 0.1})`,
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{m.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FONT }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          padding: '24px', backgroundColor: withOpacity(C.accent, 0.15), borderRadius: 16, border: `2px solid ${C.accent}`,
          display: 'flex', gap: 40, justifyContent: 'center',
          opacity: fasterCue.opacity, transform: `scale(${0.95 + fasterCue.opacity * 0.05})`,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>⚡</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: FONT }}>Faster Decisions</div>
          </div>
          <div style={{ textAlign: 'center', opacity: fewerCue.opacity }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎯</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: FONT }}>Fewer Surprises</div>
          </div>
        </div>
      </div>

      <DashboardReveal title="Executive Command Centre" imagePath={IMG.execDashboard} revealTime={cues.dashboardReveal} />
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SLIDE 11: Trusted by Food Safety Leaders (44 seconds)
// ══════════════════════════════════════════════════════════════════════════
const Slide11TrustedSynced: React.FC = () => {
  const cues = CUES.slide11;
  const titleCue = useCue(cues.understanding);
  const trustedCue = useCue(cues.trustedBy);
  const yearsCue = useCue(cues.twentyFiveYears);
  const stakeCue = useCue(cues.whatIsAtStake);
  const leaderCue = useCue(cues.marketLeader);
  const excitedCue = useCue(cues.excitedToEngage);
  const buildCue = useCue(cues.whatYouHaveUsBuild);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.closing} opacity={0.35} panX={-10} panY={-5} />
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(135deg, ${withOpacity(C.bg, 0.95)} 0%, ${withOpacity(C.bg, 0.75)} 100%)`,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 52, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
          opacity: titleCue.opacity, transform: `translateX(${(1 - titleCue.opacity) * -30}px)`,
        }}>
          Our Understanding of Your Business
        </div>
        <div style={{ width: 80, height: 4, backgroundColor: C.accent, marginBottom: 40, opacity: titleCue.opacity }} />

        <div style={{ display: 'flex', gap: 50, flex: 1 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              padding: '24px', backgroundColor: withOpacity(C.accent, 0.1), borderRadius: 16,
              border: `2px solid ${C.accent}`, opacity: trustedCue.opacity, transform: `scale(${0.95 + trustedCue.opacity * 0.05})`,
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.accent, fontFamily: FONT, marginBottom: 8 }}>
                Ecowize is trusted by food safety leaders
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 16, opacity: yearsCue.opacity }}>
                <div style={{ padding: '12px 20px', backgroundColor: withOpacity(C.primary, 0.2), borderRadius: 8 }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.primary, fontFamily: FONT }}>25+</div>
                  <div style={{ fontSize: 14, color: withOpacity(C.text, 0.7), fontFamily: FONT }}>Years</div>
                </div>
                <div style={{ padding: '12px 20px', backgroundColor: withOpacity(C.secondary, 0.2), borderRadius: 8 }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.secondary, fontFamily: FONT }}>Multi</div>
                  <div style={{ fontSize: 14, color: withOpacity(C.text, 0.7), fontFamily: FONT }}>Countries</div>
                </div>
              </div>
            </div>

            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.primary, 0.1), borderRadius: 12,
              borderLeft: `4px solid ${C.primary}`, opacity: stakeCue.opacity,
            }}>
              <div style={{ fontSize: 18, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>
                We understand <span style={{ fontWeight: 700, color: C.primary }}>what is at stake</span> and the nature of the food safety industry.
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.highlight, 0.1), borderRadius: 12,
              opacity: leaderCue.opacity, transform: `translateY(${(1 - leaderCue.opacity) * 20}px)`,
            }}>
              <div style={{ fontSize: 18, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>
                As a <span style={{ fontWeight: 700, color: C.highlight }}>market leader</span> and{' '}
                <span style={{ fontWeight: 700, color: C.highlight }}>thought leader</span> in this space...
              </div>
            </div>

            <div style={{
              padding: '24px', backgroundColor: withOpacity(C.accent, 0.15), borderRadius: 16,
              border: `2px solid ${C.accent}`, textAlign: 'center',
              opacity: excitedCue.opacity, transform: `scale(${0.95 + excitedCue.opacity * 0.05})`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.accent, fontFamily: FONT, marginBottom: 12 }}>
                We are excited to engage with you
              </div>
              <div style={{ fontSize: 16, color: withOpacity(C.text, 0.8), fontFamily: FONT, opacity: buildCue.opacity }}>
                Building your vision for a digital platform
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SLIDE 12: Proven Capabilities (34 seconds)
// ══════════════════════════════════════════════════════════════════════════
const Slide12CapabilitiesSynced: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cues = CUES.slide12;
  const titleCue = useCue(cues.whatWeBring);
  const capacityCue = useCue(cues.capacity);
  const currentTime = frame / fps;

  // Module definitions with their showcase images
  const modules = [
    { label: 'Cleaning Verifications', cue: cues.cleaningVerifications, img: 'showcase/mod-01-cleaning.png' },
    { label: 'Glass Registers', cue: cues.glassRegisters, img: 'showcase/mod-09-glass.png' },
    { label: 'NCR Management', cue: cues.ncrManagement, img: 'showcase/mod-02-ncr.png' },
    { label: 'Internal Audits', cue: cues.internalAudits, img: 'showcase/mod-03-audit.png' },
    { label: 'Customer Complaints', cue: cues.customerComplaints, img: 'showcase/mod-10-complaints.png' },
    { label: 'Satisfaction Surveys', cue: cues.satisfactionSurveys, img: 'showcase/mod-11-surveys.png' },
    { label: 'Proof of Presence', cue: cues.proofOfPresence, img: 'showcase/mod-05-qr.png' },
    { label: 'Asset Registers', cue: cues.assetRegisters, img: 'showcase/mod-08-assets.png' },
    { label: 'Online Training', cue: cues.onlineTraining, img: 'showcase/mod-06-training.png' },
    { label: 'Document Control', cue: cues.documentControl, img: 'showcase/mod-07-docs.png' },
  ];

  // Find which module is currently being shown (based on cue time)
  const ZOOM_OUT_START = cues.otherModules; // 30.38s - start zoom out
  const isZoomedOut = currentTime >= ZOOM_OUT_START;

  // Find current active module (the most recent one mentioned)
  let activeModuleIndex = -1;
  for (let i = modules.length - 1; i >= 0; i--) {
    if (currentTime >= modules[i].cue) {
      activeModuleIndex = i;
      break;
    }
  }

  // Calculate zoom-out progress
  const zoomOutProgress = isZoomedOut
    ? interpolate(currentTime, [ZOOM_OUT_START, ZOOM_OUT_START + 1.5], [0, 1], { extrapolateRight: 'clamp' })
    : 0;

  // Scale for the featured screenshot (goes from 1 to smaller for grid)
  const featuredScale = interpolate(zoomOutProgress, [0, 1], [1, 0.18]);
  const featuredOpacity = interpolate(zoomOutProgress, [0, 0.3], [1, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(135deg, ${C.bg} 0%, ${withOpacity(C.primary, 0.05)} 100%)`,
      }} />

      {/* Title bar - always visible */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '50px 80px', zIndex: 10 }}>
        <div style={{
          fontSize: 48, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
          opacity: titleCue.opacity, transform: `translateX(${(1 - titleCue.opacity) * -30}px)`,
        }}>
          What We Bring to the Table
        </div>
        <div style={{
          fontSize: 22, color: C.accent, fontFamily: FONT, fontWeight: 600,
          opacity: capacityCue.opacity,
        }}>
          Capacity to build and scale
        </div>
        <div style={{ width: 80, height: 4, backgroundColor: C.accent, marginTop: 16, opacity: titleCue.opacity }} />
      </div>

      {/* Featured screenshot - shown one at a time before zoom out */}
      {activeModuleIndex >= 0 && !isZoomedOut && (
        <AbsoluteFill style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 140,
          opacity: featuredOpacity,
        }}>
          {modules.map((mod, i) => {
            const isActive = i === activeModuleIndex;
            const moduleStartTime = mod.cue;
            const timeSinceStart = currentTime - moduleStartTime;

            // Fade in animation
            const fadeIn = interpolate(timeSinceStart, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });
            // Scale animation (slight zoom in effect)
            const scaleIn = interpolate(timeSinceStart, [0, 0.4], [0.95, 1], { extrapolateRight: 'clamp' });

            if (!isActive) return null;

            return (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: fadeIn,
                transform: `scale(${scaleIn})`,
              }}>
                {/* Module label */}
                <div style={{
                  fontSize: 28, fontWeight: 700, color: C.accent, fontFamily: FONT,
                  marginBottom: 24, textTransform: 'uppercase', letterSpacing: 2,
                }}>
                  {mod.label}
                </div>
                {/* Screenshot with frame */}
                <div style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: `0 20px 60px ${withOpacity('#000', 0.4)}, 0 0 0 2px ${withOpacity(C.accent, 0.3)}`,
                }}>
                  <Img
                    src={staticFile(`images/ecowize/${mod.img}`)}
                    style={{ width: 1000, height: 'auto', display: 'block' }}
                  />
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}

      {/* Grid view - appears during zoom out */}
      {isZoomedOut && (
        <div style={{
          position: 'absolute',
          top: 180,
          left: 60,
          right: 60,
          bottom: 60,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 16,
          opacity: zoomOutProgress,
        }}>
          {modules.map((mod, i) => {
            const staggerDelay = i * 0.08;
            const itemProgress = interpolate(
              currentTime,
              [ZOOM_OUT_START + staggerDelay, ZOOM_OUT_START + staggerDelay + 0.4],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            return (
              <div key={i} style={{
                backgroundColor: withOpacity(C.bg, 0.9),
                borderRadius: 12,
                overflow: 'hidden',
                border: `2px solid ${withOpacity(C.accent, 0.3)}`,
                opacity: itemProgress,
                transform: `translateY(${(1 - itemProgress) * 30}px) scale(${0.9 + itemProgress * 0.1})`,
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Img
                  src={staticFile(`images/ecowize/${mod.img}`)}
                  style={{ width: '100%', height: 120, objectFit: 'cover' }}
                />
                <div style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  backgroundColor: withOpacity(C.accent, 0.1),
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: FONT }}>
                    {mod.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SLIDE 13: Co-Build and Own (39 seconds)
// ══════════════════════════════════════════════════════════════════════════
const Slide13CoBuildSynced: React.FC = () => {
  const cues = CUES.slide13;
  const titleCue = useCue(cues.proposal);
  const coBuildCue = useCue(cues.coBuild);
  const ownCue = useCue(cues.youOwn);
  const teamsCue = useCue(cues.workWithTeams);
  const complementCue = useCue(cues.complementExpertise);
  const scalableCue = useCue(cues.scalableArchitecture);
  const ipCue = useCue(cues.ecowizeIP);
  const competitiveCue = useCue(cues.competitiveAdvantage);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.closing} opacity={0.25} panX={10} panY={5} />
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(135deg, ${withOpacity(C.bg, 0.95)} 0%, ${withOpacity(C.bg, 0.8)} 100%)`,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 52, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
          opacity: titleCue.opacity, transform: `translateX(${(1 - titleCue.opacity) * -30}px)`,
        }}>
          The Proposal
        </div>
        <div style={{ width: 80, height: 4, backgroundColor: C.accent, marginBottom: 40, opacity: titleCue.opacity }} />

        <div style={{ display: 'flex', gap: 50, flex: 1 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              padding: '30px', backgroundColor: withOpacity(C.accent, 0.15), borderRadius: 16,
              border: `2px solid ${C.accent}`, textAlign: 'center',
              opacity: coBuildCue.opacity, transform: `scale(${0.95 + coBuildCue.opacity * 0.05})`,
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.accent, fontFamily: FONT }}>
                We <span style={{ color: C.text }}>co-build</span> and <span style={{ color: C.text }}>you own</span> this
              </div>
            </div>

            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.primary, 0.1), borderRadius: 12,
              borderLeft: `4px solid ${C.primary}`, opacity: teamsCue.opacity,
            }}>
              <div style={{ fontSize: 18, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>
                We work with your teams to make <span style={{ fontWeight: 700 }}>workflows</span> and build what fits your operations.
              </div>
            </div>

            <div style={{
              padding: '20px 24px', backgroundColor: withOpacity(C.secondary, 0.1), borderRadius: 12,
              opacity: complementCue.opacity, transform: `translateX(${(1 - complementCue.opacity) * -20}px)`,
            }}>
              <div style={{ fontSize: 18, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>
                We complement your <span style={{ fontWeight: 700, color: C.secondary }}>deep food safety expertise</span>
              </div>
              <div style={{ fontSize: 16, color: withOpacity(C.text, 0.7), fontFamily: FONT, marginTop: 8, opacity: scalableCue.opacity }}>
                ...and provide <span style={{ color: C.accent }}>scalable architecture</span> and a responsive team
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              padding: '24px', backgroundColor: withOpacity(C.highlight, 0.15), borderRadius: 16,
              border: `2px solid ${C.highlight}`, opacity: ipCue.opacity,
              transform: `translateY(${(1 - ipCue.opacity) * 20}px)`,
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.highlight, fontFamily: FONT, marginBottom: 12 }}>
                What we build together is Ecowize's IP
              </div>
              <div style={{ fontSize: 16, color: withOpacity(C.text, 0.8), fontFamily: FONT }}>
                The platform and intellectual property remain yours
              </div>
            </div>

            <div style={{
              padding: '24px', backgroundColor: withOpacity(C.accent, 0.1), borderRadius: 12,
              textAlign: 'center', opacity: competitiveCue.opacity,
              transform: `scale(${0.95 + competitiveCue.opacity * 0.05})`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.accent, fontFamily: FONT }}>
                Protecting your competitive advantage
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SLIDE 14: The Transformation (63 seconds)
// ══════════════════════════════════════════════════════════════════════════
const Slide14TransformationSynced: React.FC = () => {
  const cues = CUES.slide14;
  const titleCue = useCue(cues.whatIsThis);
  const paperReactiveCue = useCue(cues.paperReactive);
  const digitalProactiveCue = useCue(cues.digitalProactive);
  const paperRecordsCue = useCue(cues.paperRecords);
  const digitalAccessibleCue = useCue(cues.digitalAccessible);
  const paperCannotProveCue = useCue(cues.paperCannotProve);
  const digitalProvidesCue = useCue(cues.digitalProvides);
  const paperNCRsCue = useCue(cues.paperNCRsLost);
  const digitalEscalationCue = useCue(cues.digitalEscalation);
  const paperNeedsVisitsCue = useCue(cues.paperNeedsVisits);
  const digitalCommandCue = useCue(cues.digitalCommandCenter);

  const comparisons = [
    { paper: 'Files in cabinets', digital: 'Accessible from any device', paperCue: paperRecordsCue.opacity, digitalCue: digitalAccessibleCue.opacity },
    { paper: 'Can\'t prove 2AM actions', digital: 'Timestamped, geolocated proof', paperCue: paperCannotProveCue.opacity, digitalCue: digitalProvidesCue.opacity },
    { paper: 'NCRs lost or delayed', digital: 'Automatic escalation', paperCue: paperNCRsCue.opacity, digitalCue: digitalEscalationCue.opacity },
    { paper: 'Need site visits for visibility', digital: 'Command center always on', paperCue: paperNeedsVisitsCue.opacity, digitalCue: digitalCommandCue.opacity },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(135deg, ${C.bg} 0%, ${withOpacity(C.primary, 0.03)} 100%)`,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 52, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
          opacity: titleCue.opacity, transform: `translateX(${(1 - titleCue.opacity) * -30}px)`,
        }}>
          The Transformation
        </div>
        <div style={{ width: 80, height: 4, backgroundColor: C.accent, marginBottom: 30, opacity: titleCue.opacity }} />

        <div style={{
          display: 'flex', gap: 30, marginBottom: 30, justifyContent: 'center',
        }}>
          <div style={{
            padding: '16px 30px', backgroundColor: withOpacity('#ef4444', 0.1), borderRadius: 12,
            opacity: paperReactiveCue.opacity, transform: `translateX(${(1 - paperReactiveCue.opacity) * -20}px)`,
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#ef4444', fontFamily: FONT }}>
              Paper is <span style={{ textDecoration: 'underline' }}>reactive</span>
            </div>
          </div>
          <div style={{
            padding: '16px 30px', backgroundColor: withOpacity(C.accent, 0.15), borderRadius: 12,
            opacity: digitalProactiveCue.opacity, transform: `translateX(${(1 - digitalProactiveCue.opacity) * 20}px)`,
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: C.accent, fontFamily: FONT }}>
              Digital is <span style={{ textDecoration: 'underline' }}>proactive</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          {/* Paper Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              padding: '12px 20px', backgroundColor: withOpacity('#ef4444', 0.2), borderRadius: 8, textAlign: 'center',
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#ef4444', fontFamily: FONT }}>PAPER</div>
            </div>
            {comparisons.map((c, i) => (
              <div key={i} style={{
                padding: '16px 20px', backgroundColor: withOpacity('#ef4444', 0.08), borderRadius: 10,
                borderLeft: `4px solid #ef4444`, opacity: c.paperCue, transform: `translateX(${(1 - c.paperCue) * -20}px)`,
              }}>
                <div style={{ fontSize: 16, color: withOpacity(C.text, 0.8), fontFamily: FONT }}>{c.paper}</div>
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 60 }}>
            <div style={{ fontSize: 40, color: C.accent }}>→</div>
          </div>

          {/* Digital Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              padding: '12px 20px', backgroundColor: withOpacity(C.accent, 0.2), borderRadius: 8, textAlign: 'center',
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: FONT }}>DIGITAL</div>
            </div>
            {comparisons.map((c, i) => (
              <div key={i} style={{
                padding: '16px 20px', backgroundColor: withOpacity(C.accent, 0.08), borderRadius: 10,
                borderLeft: `4px solid ${C.accent}`, opacity: c.digitalCue, transform: `translateX(${(1 - c.digitalCue) * 20}px)`,
              }}>
                <div style={{ fontSize: 16, color: C.text, fontFamily: FONT, fontWeight: 600 }}>{c.digital}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SLIDE 15: Let's Build This Together (27 seconds)
// ══════════════════════════════════════════════════════════════════════════
const Slide15ClosingSynced: React.FC = () => {
  const cues = CUES.slide15;
  const conclusionCue = useCue(cues.inConclusion);
  const buildCue = useCue(cues.buildTogether);
  const platformCue = useCue(cues.platform);
  const delegateCue = useCue(cues.delegateResponsibility);
  const retainCue = useCue(cues.retainAccountability);
  const alwaysOnCue = useCue(cues.alwaysOnAssurance);
  const foodSafetyCue = useCue(cues.foodSafety);
  const thankYouCue = useCue(cues.thankYou);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.title} opacity={0.4} panX={-15} panY={-5} />
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `radial-gradient(circle at center, ${withOpacity(C.bg, 0.85)} 0%, ${withOpacity(C.bg, 0.95)} 100%)`,
      }} />

      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 80,
      }}>
        <div style={{
          fontSize: 24, color: withOpacity(C.text, 0.6), fontFamily: FONT, marginBottom: 20,
          opacity: conclusionCue.opacity, textTransform: 'uppercase', letterSpacing: 4,
        }}>
          In Conclusion
        </div>

        <div style={{
          fontSize: 64, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 30,
          opacity: buildCue.opacity, transform: `scale(${0.95 + buildCue.opacity * 0.05})`,
        }}>
          Let's Build This Together
        </div>

        <div style={{
          width: interpolate(platformCue.opacity, [0, 1], [0, 500]),
          height: 5, backgroundColor: C.accent, marginBottom: 40, borderRadius: 3,
        }} />

        <div style={{
          fontSize: 24, color: withOpacity(C.text, 0.8), fontFamily: FONT, maxWidth: 800, lineHeight: 1.6, marginBottom: 30,
          opacity: delegateCue.opacity,
        }}>
          A platform where you still <span style={{ color: C.secondary }}>delegate responsibility</span> at site level...
        </div>

        <div style={{
          fontSize: 28, fontWeight: 600, color: C.accent, fontFamily: FONT, marginBottom: 40,
          opacity: retainCue.opacity, transform: `translateY(${(1 - retainCue.opacity) * 20}px)`,
        }}>
          ...but <span style={{ fontWeight: 700 }}>retain accountability</span> at the top whilst seeing everything.
        </div>

        <div style={{
          padding: '20px 40px', backgroundColor: withOpacity(C.accent, 0.15), borderRadius: 16,
          border: `2px solid ${C.accent}`, marginBottom: 30,
          opacity: alwaysOnCue.opacity, transform: `scale(${0.95 + alwaysOnCue.opacity * 0.05})`,
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.accent, fontFamily: FONT }}>
            Always-On Assurance
          </div>
        </div>

        <div style={{
          fontSize: 36, fontWeight: 700, color: C.text, fontFamily: FONT,
          opacity: foodSafetyCue.opacity, transform: `translateY(${(1 - foodSafetyCue.opacity) * 20}px)`,
        }}>
          Food Safety Without Blind Spots
        </div>

        <div style={{
          marginTop: 50, fontSize: 28, color: C.accent, fontFamily: FONT, fontWeight: 600,
          opacity: thankYouCue.opacity, transform: `scale(${0.9 + thankYouCue.opacity * 0.1})`,
        }}>
          Thank You
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// AUDIO & NARRATION
// ══════════════════════════════════════════════════════════════════════════
function audioSrc(slideNum: number): string {
  return `audio/ecowize/v10/slide-${String(slideNum).padStart(2, '0')}.mp3`;
}

const Narrated: React.FC<{ slideNum: number; audio: boolean; children: React.ReactNode }> = ({ slideNum, audio, children }) => (
  <AbsoluteFill>
    {children}
    {audio && <Audio src={staticFile(audioSrc(slideNum))} volume={0.9} />}
  </AbsoluteFill>
);

const fadeT = <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />;

// ══════════════════════════════════════════════════════════════════════════
// MAIN EXPORT: Full 15-Slide Narration-Synced Composition
// ══════════════════════════════════════════════════════════════════════════
export interface EcowizePitchFullProps {
  audioNarration?: boolean;
}

export function getEcowizePitchFullDuration(fps: number): number {
  const totalSeconds = SLIDE_DURATIONS.reduce((sum, d) => sum + d, 0);
  return totalSeconds * fps - (SLIDE_DURATIONS.length - 1) * TRANSITION_FRAMES;
}

export const EcowizePitchFull: React.FC<EcowizePitchFullProps> = ({ audioNarration = true }) => {
  const a = audioNarration;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <TransitionSeries>
        {/* Slide 1: Title/Hook - 36 seconds */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[0] * FPS}>
          <Narrated slideNum={1} audio={a}><Slide01TitleSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 2: Accountability Gap - 72 seconds */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[1] * FPS}>
          <Narrated slideNum={2} audio={a}><Slide02AccountabilityGapSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 3: If Not Recorded - 52 seconds */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[2] * FPS}>
          <Narrated slideNum={3} audio={a}><Slide03IfNotRecordedSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 4: Enterprise Impact - 31 seconds */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[3] * FPS}>
          <Narrated slideNum={4} audio={a}><Slide04EnterpriseImpactSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 5: Audit Drag - 29 seconds */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[4] * FPS}>
          <Narrated slideNum={5} audio={a}><Slide05AuditDragSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 6: Platform Overview - 30 seconds */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[5] * FPS}>
          <Narrated slideNum={6} audio={a}><Slide06PlatformSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 7: Cleaning Verification - 79 seconds */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[6] * FPS}>
          <Narrated slideNum={7} audio={a}><Slide07CleaningSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 8: NCR Management - 45 seconds */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[7] * FPS}>
          <Narrated slideNum={8} audio={a}><Slide08NCRSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 9: Internal Audits - 50 seconds */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[8] * FPS}>
          <Narrated slideNum={9} audio={a}><Slide09AuditsSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 10: Executive Command Centre - 48 seconds */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[9] * FPS}>
          <Narrated slideNum={10} audio={a}><Slide10CommandSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 11: Trusted by Food Safety Leaders - 44 seconds */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[10] * FPS}>
          <Narrated slideNum={11} audio={a}><Slide11TrustedSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 12: Proven Capabilities - 34 seconds */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[11] * FPS}>
          <Narrated slideNum={12} audio={a}><Slide12CapabilitiesSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 13: Co-Build and Own - 39 seconds */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[12] * FPS}>
          <Narrated slideNum={13} audio={a}><Slide13CoBuildSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 14: The Transformation - 63 seconds */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[13] * FPS}>
          <Narrated slideNum={14} audio={a}><Slide14TransformationSynced /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* Slide 15: Let's Build This Together - 27 seconds */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATIONS[14] * FPS}>
          <Narrated slideNum={15} audio={a}><Slide15ClosingSynced /></Narrated>
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export default EcowizePitchFull;
