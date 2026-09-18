/**
 * Progress persistence. UI imports the `ProgressStore` interface (via the
 * `progress` singleton) only — a Convex-backed implementation swaps in
 * behind it later. This phase: localStorage.
 */

export type SkillState = 'not-started' | 'developing' | 'secure';

export interface QuizAttempt {
  topicCode: string;
  /** Number of questions answered correctly. */
  correct: number;
  /** Number of questions in the quiz. */
  total: number;
  /** Score as a percentage, 0-100. */
  percentage: number;
  /** The lesson quiz's passing score (percentage, 0-100). */
  passingScore: number;
  passed: boolean;
  /** ISO timestamp. */
  timestamp: string;
}

export type NewQuizAttempt = Omit<
  QuizAttempt,
  'percentage' | 'passed' | 'timestamp'
>;

// ---------------------------------------------------------------------------
// Thresholds — tunable, human will adjust.
// A quiz score of at least (passingScore + SECURE_MARGIN_PERCENT) marks the
// skill secure; any recorded attempt below that marks it developing.
// ---------------------------------------------------------------------------
export const SECURE_MARGIN_PERCENT = 0;

export function deriveSkillState(
  percentage: number,
  passingScore: number
): SkillState {
  return percentage >= passingScore + SECURE_MARGIN_PERCENT
    ? 'secure'
    : 'developing';
}

export interface ProgressStore {
  getSkillState(topicCode: string): SkillState;
  setSkillState(topicCode: string, state: SkillState): void;
  /** Records the attempt AND updates the topic's skill state per thresholds. */
  recordQuizAttempt(attempt: NewQuizAttempt): QuizAttempt;
  getQuizAttempts(topicCode: string): QuizAttempt[];
}

// ---------------------------------------------------------------------------
// localStorage implementation
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'student-learn:progress:v1';

interface StoredProgress {
  skills: Record<string, SkillState>;
  attempts: Record<string, QuizAttempt[]>;
}

function readStore(): StoredProgress {
  const empty: StoredProgress = { skills: {}, attempts: {} };
  if (typeof window === 'undefined') return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    return {
      skills: parsed.skills ?? {},
      attempts: parsed.attempts ?? {},
    };
  } catch {
    return empty;
  }
}

function writeStore(store: StoredProgress): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Storage full or unavailable — progress simply won't persist.
  }
}

class LocalStorageProgress implements ProgressStore {
  getSkillState(topicCode: string): SkillState {
    return readStore().skills[topicCode] ?? 'not-started';
  }

  setSkillState(topicCode: string, state: SkillState): void {
    const store = readStore();
    store.skills[topicCode] = state;
    writeStore(store);
  }

  recordQuizAttempt(attempt: NewQuizAttempt): QuizAttempt {
    const percentage =
      attempt.total > 0 ? Math.round((attempt.correct / attempt.total) * 100) : 0;
    const full: QuizAttempt = {
      ...attempt,
      percentage,
      passed: percentage >= attempt.passingScore,
      timestamp: new Date().toISOString(),
    };
    const store = readStore();
    const list = store.attempts[attempt.topicCode] ?? [];
    list.push(full);
    store.attempts[attempt.topicCode] = list;
    store.skills[attempt.topicCode] = deriveSkillState(
      percentage,
      attempt.passingScore
    );
    writeStore(store);
    return full;
  }

  getQuizAttempts(topicCode: string): QuizAttempt[] {
    return readStore().attempts[topicCode] ?? [];
  }
}

// ---------------------------------------------------------------------------
// The singleton, and the seam a Convex-backed store swaps in through
// ---------------------------------------------------------------------------
//
// `ProgressStore` is unchanged and stays synchronous: every caller reads a skill
// state during render and must keep being able to. What changed is WHO answers.
// `progress` is now a delegate. Signed out it is the localStorage store it always
// was; once a student signs in, `components/progress-sync.tsx` installs a store
// backed by `convex/progress.ts` — reads served from a live Convex snapshot held
// in memory, writes sent to Convex and applied to that snapshot straight away so
// the synchronous read after a write is still correct.

/** The localStorage store, reachable by name so the sync layer can drain it. */
export const localProgress = new LocalStorageProgress();

/** Everything the browser is holding, for the one-time lift into Convex. */
export function readLocalSnapshot(): {
  topicCode: string;
  state: SkillState;
  attempts: QuizAttempt[];
}[] {
  const store = readStore();
  const codes = Array.from(
    new Set(Object.keys(store.skills).concat(Object.keys(store.attempts)))
  );
  return codes.map((topicCode) => ({
    topicCode,
    state: store.skills[topicCode] ?? 'not-started',
    attempts: store.attempts[topicCode] ?? [],
  }));
}

type Listener = () => void;
const listeners = new Set<Listener>();

/**
 * Told when the answers change — a Convex snapshot arriving, or a write landing.
 *
 * Not part of `ProgressStore`: the interface describes where progress is kept, and
 * a component needing to re-render when it moves is a React concern. Returns its
 * own unsubscribe.
 */
export function subscribeToProgress(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyProgressChanged(): void {
  for (const l of Array.from(listeners)) l();
}

let active: ProgressStore = localProgress;

/** Install a backing store (Convex), or pass null to fall back to the browser. */
export function installProgressStore(store: ProgressStore | null): void {
  active = store ?? localProgress;
  notifyProgressChanged();
}

class DelegatingProgress implements ProgressStore {
  getSkillState(topicCode: string): SkillState {
    return active.getSkillState(topicCode);
  }
  setSkillState(topicCode: string, state: SkillState): void {
    active.setSkillState(topicCode, state);
    notifyProgressChanged();
  }
  recordQuizAttempt(attempt: NewQuizAttempt): QuizAttempt {
    const result = active.recordQuizAttempt(attempt);
    notifyProgressChanged();
    return result;
  }
  getQuizAttempts(topicCode: string): QuizAttempt[] {
    return active.getQuizAttempts(topicCode);
  }
}

export const progress: ProgressStore = new DelegatingProgress();
