/**
 * Progress, server side. The Convex half of `lib/progress.ts`.
 *
 * The client keeps the synchronous `ProgressStore` interface it always had; this
 * is what stands behind it once a student is signed in, so a cleared browser or a
 * second phone no longer erases what they have done.
 *
 * IDENTITY IS NEVER AN ARGUMENT. Every function here resolves the caller from
 * `ctx.auth.getUserIdentity()` and the `users` row, exactly like session.ts. A
 * `studentId` sent by a client would make one student's progress writable by
 * another, so none of these take one.
 *
 * Reads and writes are scoped to the caller. There is no query here that returns
 * anybody else's rows — a cohort view is a different feature with a different
 * gate, and it is not needed to make a student's own progress follow them.
 */

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import type { Doc } from './_generated/dataModel';

const skillStateValidator = v.union(
  v.literal('not-started'),
  v.literal('developing'),
  v.literal('secure')
);

/** Newest attempts kept per topic. A history, not a log: the row has to stay small. */
const MAX_ATTEMPTS_PER_TOPIC = 50;

async function callerOrNull(ctx: {
  auth: { getUserIdentity: () => Promise<{ subject: string } | null> };
  db: any;
}): Promise<Doc<'users'> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  const user = await ctx.db
    .query('users')
    .withIndex('by_auth_subject', (q: any) => q.eq('authSubject', identity.subject))
    .unique();
  if (!user || user.erasedAt) return null;
  return user;
}

/**
 * Everything this student has recorded, as one snapshot.
 *
 * It returns `[]` rather than throwing for a signed-out reader: studying is free
 * and anonymous, so "no rows" is the normal state of most readers, and the client
 * falls back to localStorage without an error boundary in the way.
 */
export const mine = query({
  args: {},
  handler: async (ctx) => {
    const user = await callerOrNull(ctx as any);
    if (!user) return { signedIn: false as const, topics: [] };
    const rows = await ctx.db
      .query('studentProgress')
      .withIndex('by_student', (q) => q.eq('studentId', user._id))
      .collect();
    return {
      signedIn: true as const,
      topics: rows.map((r) => ({
        topicCode: r.topicCode,
        state: r.state,
        attempts: r.attempts,
        updatedAt: r.updatedAt,
      })),
    };
  },
});

export const setSkillState = mutation({
  args: { topicCode: v.string(), state: skillStateValidator },
  handler: async (ctx, { topicCode, state }) => {
    const user = await callerOrNull(ctx as any);
    if (!user) return null;
    const existing = await ctx.db
      .query('studentProgress')
      .withIndex('by_student_topic', (q) =>
        q.eq('studentId', user._id).eq('topicCode', topicCode)
      )
      .unique();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { state, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert('studentProgress', {
      studentId: user._id,
      topicCode,
      state,
      attempts: [],
      updatedAt: now,
    });
  },
});

/**
 * Record one attempt AND the skill state it implies.
 *
 * The derivation is repeated here rather than trusted from the client: a score is
 * a fact about what happened, a skill state is a judgement about it, and a client
 * that can send the judgement can mark itself secure without answering anything.
 * The thresholds are `lib/progress.ts`'s, restated — if they diverge the server's
 * is the one that is stored.
 */
export const recordQuizAttempt = mutation({
  args: {
    topicCode: v.string(),
    correct: v.number(),
    total: v.number(),
    passingScore: v.number(),
  },
  handler: async (ctx, { topicCode, correct, total, passingScore }) => {
    const user = await callerOrNull(ctx as any);
    if (!user) return null;

    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const attempt = {
      correct,
      total,
      percentage,
      passingScore,
      passed: percentage >= passingScore,
      timestamp: new Date().toISOString(),
    };
    const state = percentage >= passingScore ? ('secure' as const) : ('developing' as const);

    const existing = await ctx.db
      .query('studentProgress')
      .withIndex('by_student_topic', (q) =>
        q.eq('studentId', user._id).eq('topicCode', topicCode)
      )
      .unique();
    const now = Date.now();
    if (existing) {
      const attempts = [...existing.attempts, attempt].slice(-MAX_ATTEMPTS_PER_TOPIC);
      await ctx.db.patch(existing._id, { attempts, state, updatedAt: now });
    } else {
      await ctx.db.insert('studentProgress', {
        studentId: user._id,
        topicCode,
        state,
        attempts: [attempt],
        updatedAt: now,
      });
    }
    return attempt;
  },
});

/**
 * One-time lift of whatever the browser was holding before they signed in.
 *
 * ADDITIVE ONLY. A local row never overwrites a server row: the server has seen
 * every device, the browser has seen one, so on a conflict the browser loses. That
 * is what stops signing in on a fresh laptop from wiping a term of work.
 */
export const importLocal = mutation({
  args: {
    topics: v.array(
      v.object({
        topicCode: v.string(),
        state: skillStateValidator,
        attempts: v.array(
          v.object({
            correct: v.number(),
            total: v.number(),
            percentage: v.number(),
            passingScore: v.number(),
            passed: v.boolean(),
            timestamp: v.string(),
          })
        ),
      })
    ),
  },
  handler: async (ctx, { topics }) => {
    const user = await callerOrNull(ctx as any);
    if (!user) return 0;
    let imported = 0;
    for (const t of topics.slice(0, 200)) {
      const existing = await ctx.db
        .query('studentProgress')
        .withIndex('by_student_topic', (q) =>
          q.eq('studentId', user._id).eq('topicCode', t.topicCode)
        )
        .unique();
      if (existing) continue; // server wins, always
      if (t.state === 'not-started' && t.attempts.length === 0) continue;
      await ctx.db.insert('studentProgress', {
        studentId: user._id,
        topicCode: t.topicCode,
        state: t.state,
        attempts: t.attempts.slice(-MAX_ATTEMPTS_PER_TOPIC),
        updatedAt: Date.now(),
      });
      imported++;
    }
    return imported;
  },
});
