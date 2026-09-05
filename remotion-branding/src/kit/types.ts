/**
 * TutorialKit — the `beats.json` schema (beatsmith PRD "The atom").
 * One beats document per video project is the single source of truth every
 * station reads and writes.
 */

/** An annotation rectangle in still-pixel space (scales with the phone frame). */
export type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Named palette colour (sky | skyDeep | emerald | amber | coral) or raw hex. */
  color?: string;
  /** Overlay style; only "ring" is rendered by TutorialKit today. */
  style?: 'ring';
};

export type BeatKind = 'hook' | 'walkthrough' | 'concept' | 'proof' | 'close' | string;

export type Beat = {
  id: string;
  kind: BeatKind;
  /** TTS input — the narration for this beat. */
  script: string;
  /** Storyboard visual-intent description (agent + human readable). */
  visual: string;
  /** Short step label shown in the caption panel chip. */
  chip: string;
  /** Optional headline override for the caption panel; falls back to `visual` when absent. */
  caption?: string;
  /**
   * Captured still, relative to the asset base (e.g. "shots/verify-outofspec.png").
   * `null` = the beat is a pure-motion scene with no still — TutorialKit renders a
   * neutral placeholder and the bespoke scene is built later.
   */
  still: string | null;
  /** Focus rings, in still-pixel space. Empty array = nothing highlighted. */
  boxes: Box[];
  /** Voiceover clip, relative to the asset base (e.g. "audio/09-out-of-spec.mp3"). */
  audio: string | null;
  /** GENERATED — seconds into the video where this beat's VO begins. */
  voStart: number;
  /** GENERATED — VO clip length in seconds. */
  duration: number;
  /** Human-in-the-loop state machine; nothing renders below "approved". */
  status?: 'pending' | 'captured' | 'annotated' | 'approved' | 'rendered' | string;
  /** Free-form notes for the human / next agent (e.g. motion-scene gaps). */
  agentNotes?: string[];
};

export type VoiceSpec = {
  provider?: string;
  voiceId?: string;
  settings?: Record<string, unknown>;
};

export type BeatsDoc = {
  project: string;
  fps: number;
  voice?: VoiceSpec;
  beats: Beat[];
};
