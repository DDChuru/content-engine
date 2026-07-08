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

export const progress: ProgressStore = new LocalStorageProgress();
