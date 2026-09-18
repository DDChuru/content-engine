'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  deriveSkillState,
  installProgressStore,
  notifyProgressChanged,
  readLocalSnapshot,
  type NewQuizAttempt,
  type ProgressStore,
  type QuizAttempt,
  type SkillState,
} from '@/lib/progress';

/**
 * Makes a signed-in student's progress live in Convex instead of in one browser.
 *
 * Mounted once, in the layout. It holds no UI. While signed out it does nothing at
 * all and `progress` stays on localStorage, which is what keeps studying free and
 * anonymous — an anonymous reader still gets their ticks, they just only get them
 * here.
 *
 * The store it installs is synchronous on the way out and asynchronous on the way
 * in: reads come from the last Convex snapshot, a write is applied to that
 * snapshot immediately and then sent. Convex's own subscription overwrites the
 * snapshot when the mutation lands, so the optimistic copy is never the long-term
 * answer — it exists to make the read immediately after a write correct.
 */
export function ProgressSync() {
  const { isAuthenticated } = useConvexAuth();
  const snapshot = useQuery(api.progress.mine, isAuthenticated ? {} : 'skip');
  const setSkillStateOnServer = useMutation(api.progress.setSkillState);
  const recordOnServer = useMutation(api.progress.recordQuizAttempt);
  const importLocal = useMutation(api.progress.importLocal);

  /** The snapshot the synchronous reads answer from. */
  const cache = useRef<Map<string, { state: SkillState; attempts: QuizAttempt[] }>>(
    new Map()
  );

  const store = useMemo<ProgressStore>(() => {
    const read = (topicCode: string) =>
      cache.current.get(topicCode) ?? { state: 'not-started' as SkillState, attempts: [] };

    return {
      getSkillState: (topicCode) => read(topicCode).state,

      setSkillState: (topicCode, state) => {
        const current = read(topicCode);
        cache.current.set(topicCode, { ...current, state });
        void setSkillStateOnServer({ topicCode, state }).catch(() => {
          // The subscription is the source of truth; a failed write simply does
          // not appear in the next snapshot. Nothing is silently "saved".
        });
      },

      recordQuizAttempt: (attempt: NewQuizAttempt) => {
        const percentage =
          attempt.total > 0
            ? Math.round((attempt.correct / attempt.total) * 100)
            : 0;
        const full: QuizAttempt = {
          ...attempt,
          percentage,
          passed: percentage >= attempt.passingScore,
          timestamp: new Date().toISOString(),
        };
        const current = read(attempt.topicCode);
        cache.current.set(attempt.topicCode, {
          state: deriveSkillState(percentage, attempt.passingScore),
          attempts: [...current.attempts, full],
        });
        void recordOnServer({
          topicCode: attempt.topicCode,
          correct: attempt.correct,
          total: attempt.total,
          passingScore: attempt.passingScore,
        }).catch(() => {});
        return full;
      },

      getQuizAttempts: (topicCode) => read(topicCode).attempts,
    };
  }, [setSkillStateOnServer, recordOnServer]);

  // Install / uninstall as the auth state settles.
  useEffect(() => {
    if (!isAuthenticated) {
      installProgressStore(null);
      cache.current = new Map();
      return;
    }
    // Only once a first snapshot exists — installing earlier would answer
    // "not-started" for everything for a beat, and a page rendering a student's
    // map would flash it empty.
    if (snapshot?.signedIn) installProgressStore(store);
  }, [isAuthenticated, snapshot?.signedIn, store]);

  // Refresh the cache from every snapshot Convex pushes.
  useEffect(() => {
    if (!snapshot?.signedIn) return;
    const next = new Map<string, { state: SkillState; attempts: QuizAttempt[] }>();
    for (const t of snapshot.topics) {
      // The server stores an attempt without its topic code — the row it sits on
      // already is the topic. `QuizAttempt` carries it, so it is put back here.
      next.set(t.topicCode, {
        state: t.state,
        attempts: t.attempts.map((a) => ({ ...a, topicCode: t.topicCode })),
      });
    }
    cache.current = next;
    notifyProgressChanged();
  }, [snapshot]);

  // The one-time lift of whatever this browser recorded before they signed in.
  const lifted = useRef(false);
  useEffect(() => {
    if (lifted.current || !snapshot?.signedIn) return;
    lifted.current = true;
    const local = readLocalSnapshot().filter(
      (t) => t.state !== 'not-started' || t.attempts.length > 0
    );
    if (local.length === 0) return;
    // `topicCode` rides on every local attempt and is the row's key on the
    // server, so it is stripped here — a Convex object validator rejects a field
    // it was not told about, and this import failing silently is the one thing
    // that would make signing in lose work.
    void importLocal({
      topics: local.map((t) => ({
        topicCode: t.topicCode,
        state: t.state,
        attempts: t.attempts.map(({ topicCode: _drop, ...a }) => a),
      })),
    }).catch(() => {});
  }, [snapshot?.signedIn, importLocal]);

  return null;
}
