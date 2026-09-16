/**
 * The pooled claim queue and the blinded teacher view (PLAN §4, §6).
 *
 * The single most important invariant in this file:
 *
 *   NO FUNCTION IN THIS FILE THAT A TEACHER CAN CALL MAY RETURN, OR DERIVE A
 *   RETURNED VALUE FROM, `submission.studentId`.
 *
 * `toTeacherView` below is the ONLY way a submission becomes a teacher payload.
 * It builds a fresh object field by field — it never spreads the document — so
 * adding a column to `submissions` cannot silently widen what a teacher sees.
 */

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import type { QueryCtx, MutationCtx } from './_generated/server';
import type { Doc, Id } from './_generated/dataModel';
import { requireVerifiedTeacher, requireRole, audit, AuthError } from './lib/auth';
import { allocateCandidateCode } from './identity';

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export const CLAIM_TTL_MS = 45 * MINUTE;
/** §4/§11.8 — a teacher may not mark the same student more than 3 times in 30 days. */
export const ROTATION_WINDOW_MS = 30 * DAY;
export const ROTATION_CAP = 3;
/** How deep the queue scan goes before giving up, so a query stays bounded. */
const QUEUE_SCAN_LIMIT = 60;

// ---------------------------------------------------------------------------
// The blinded projection
// ---------------------------------------------------------------------------

export interface TeacherSubmissionView {
  submissionId: Id<'submissions'>;
  candidateCode: string;
  questionId: string;
  topicCode: string;
  status: string;
  dueAt: number | null;
  typedFinalAnswer: string | null;
  autoMarkCorrect: boolean | null;
  /** ONLY the redacted derivative (§5). `originalStorageId` is admin-gated. */
  imageUrls: string[];
  /** §4 — pedagogical context computed server-side, leaking nothing. */
  context: {
    attemptsOnThisTopic: number;
    lastMark: string | null;
    mostRecentMisconception: string | null;
  };
  claimExpiresAt: number | null;
}

/**
 * Build the teacher payload. Explicit construction, never a spread.
 *
 * Fields deliberately NOT present, and why:
 *  - `studentId`               — the join blinding exists to prevent
 *  - `images[].originalStorageId` — carries EXIF/GPS/device id (§5.1)
 *  - `creditLedgerId`          — a ledger id leads to `holderId`, i.e. the guardian
 *  - `_creationTime`, `submittedAt` — a precise submission clock across several
 *    items is a correlation handle; the teacher gets `dueAt`, which is bucketed
 *    by the SLA promise and shared by many students
 *  - anything from `marks` by another teacher, which would let two views be joined
 *
 * `context` is computed from the student's own history but returns only counts
 * and catalogue codes — no free text, because a previous teacher's
 * `encouragement` line can contain a name the filter let through.
 */
async function toTeacherView(
  ctx: QueryCtx,
  submission: Doc<'submissions'>
): Promise<TeacherSubmissionView> {
  const imageUrls: string[] = [];
  for (const image of submission.images) {
    if (!image.teacherStorageId) continue; // never fall back to the original
    const url = await ctx.storage.getUrl(image.teacherStorageId);
    if (url) imageUrls.push(url);
  }

  const context = await buildContext(ctx, submission);

  return {
    submissionId: submission._id,
    candidateCode: submission.candidateCode,
    questionId: submission.questionId,
    topicCode: submission.topicCode,
    status: submission.status,
    dueAt: submission.dueAt ?? null,
    typedFinalAnswer: submission.typedFinalAnswer ?? null,
    autoMarkCorrect: submission.autoMarkCorrect ?? null,
    imageUrls,
    context,
    claimExpiresAt: submission.claimExpiresAt ?? null,
  };
}

/**
 * "This candidate has attempted F=ma 3 times; last mark 4/7; most recent error:
 * resolved along the wrong axis." (§4)
 *
 * Scoped to the SAME topic only. A cross-topic history would let a teacher who
 * claims two items recognise the same learner by their profile, which is the
 * per-submission-code design being undone from the other end.
 */
async function buildContext(
  ctx: QueryCtx,
  submission: Doc<'submissions'>
): Promise<TeacherSubmissionView['context']> {
  const history = await ctx.db
    .query('submissions')
    .withIndex('by_student', (q) => q.eq('studentId', submission.studentId))
    .collect();

  const sameTopic = history.filter(
    (s) => s.topicCode === submission.topicCode && s._id !== submission._id
  );

  let lastMark: string | null = null;
  let mostRecentMisconception: string | null = null;
  const latest = sameTopic
    .filter((s) => s.markId)
    .sort((a, b) => (b.returnedAt ?? 0) - (a.returnedAt ?? 0))[0];

  if (latest?.markId) {
    const mark = await ctx.db.get(latest.markId);
    if (mark) {
      lastMark = `${mark.awarded}/${mark.outOf}`;
      const code = mark.misconceptionCodes[0];
      if (code) {
        const entry = await ctx.db
          .query('misconceptionCatalogue')
          .withIndex('by_code', (q) => q.eq('code', code))
          .unique();
        // Catalogue text only — authored by us, never by another teacher.
        mostRecentMisconception = entry?.wrongIdea ?? code;
      }
    }
  }

  return {
    attemptsOnThisTopic: sameTopic.length + 1,
    lastMark,
    mostRecentMisconception,
  };
}

// ---------------------------------------------------------------------------
// Rotation cap (§4)
// ---------------------------------------------------------------------------

/**
 * Has this teacher marked this student ROTATION_CAP times in the window?
 *
 * Runs against `studentId` — server-side, inside the claim path. The teacher is
 * never told the reason an item was skipped, and never sees a count, so the cap
 * itself leaks nothing: from the queue's outside, a capped item is simply absent.
 */
async function rotationCapReached(
  ctx: QueryCtx,
  teacherId: Id<'users'>,
  studentId: Id<'users'>
): Promise<boolean> {
  const since = Date.now() - ROTATION_WINDOW_MS;
  const recent = await ctx.db
    .query('submissions')
    .withIndex('by_student_claimed_by', (q) =>
      q.eq('studentId', studentId).eq('claimedBy', teacherId).gte('claimedAt', since)
    )
    .take(ROTATION_CAP);
  return recent.length >= ROTATION_CAP;
}

// ---------------------------------------------------------------------------
// The pool
// ---------------------------------------------------------------------------

/**
 * The queue a verified teacher sees: their approved topics only, oldest `dueAt`
 * first, rotation-capped items silently removed.
 *
 * No student picks a teacher and no teacher picks a student — the only lever a
 * teacher has is "claim the next one I am allowed to take".
 */
export const queue = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args): Promise<TeacherSubmissionView[]> => {
    const teacher = await requireVerifiedTeacher(ctx);
    const topics = teacher.approvedTopicCodes ?? [];
    if (topics.length === 0) return [];

    const candidates: Doc<'submissions'>[] = [];
    for (const topicCode of topics) {
      const rows = await ctx.db
        .query('submissions')
        .withIndex('by_status_topic_due', (q) =>
          q.eq('status', 'queued').eq('topicCode', topicCode)
        )
        .order('asc') // by dueAt, the index's trailing field
        .take(QUEUE_SCAN_LIMIT);
      candidates.push(...rows);
    }

    candidates.sort((a, b) => (a.dueAt ?? Infinity) - (b.dueAt ?? Infinity));

    const limit = Math.min(args.limit ?? 20, 50);
    const out: TeacherSubmissionView[] = [];
    for (const submission of candidates) {
      if (out.length >= limit) break;
      if (submission.claimedBy) continue;
      if (await rotationCapReached(ctx, teacher._id, submission.studentId)) continue;
      out.push(await toTeacherView(ctx, submission));
    }
    return out;
  },
});

/**
 * CLAIM — optimistic concurrency on `claimedBy == null`.
 *
 * Convex mutations are serialisable transactions with automatic OCC retry: the
 * read of `submission.claimedBy` below is part of the transaction's read set, so
 * if another teacher's claim commits first, this transaction is retried against
 * the new value and falls into the "already claimed" branch. Two teachers cannot
 * both hold the same item; the loser is told to take the next one.
 *
 * The expired-claim case is handled in the same check rather than by a cron race:
 * a claim whose TTL has passed is treated as free even if `claimedBy` is still set.
 */
export const claim = mutation({
  args: { submissionId: v.id('submissions') },
  handler: async (ctx, args) => {
    const teacher = await requireVerifiedTeacher(ctx);
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new AuthError('No such item.');

    const now = Date.now();
    const heldByAnother =
      submission.claimedBy != null &&
      submission.claimedBy !== teacher._id &&
      (submission.claimExpiresAt ?? 0) > now;

    // The OCC check. Status must still be `queued` (or a lapsed `claimed`).
    if (heldByAnother || (submission.status !== 'queued' && submission.status !== 'claimed')) {
      return { claimed: false as const, reason: 'taken' as const };
    }
    if (submission.claimedBy === teacher._id && submission.status === 'claimed') {
      return { claimed: true as const, submissionId: submission._id };
    }

    // Scope and rotation are re-checked at claim time, not only in the queue
    // query — the queue is a hint, the mutation is the authority.
    const topics = teacher.approvedTopicCodes ?? [];
    if (!topics.includes(submission.topicCode)) {
      throw new AuthError('Not an approved topic for this account.');
    }
    if (await rotationCapReached(ctx, teacher._id, submission.studentId)) {
      // Deliberately vague: naming the rotation cap would tell the teacher that
      // this item belongs to a student they have marked before.
      return { claimed: false as const, reason: 'taken' as const };
    }

    await ctx.db.patch(submission._id, {
      status: 'claimed',
      claimedBy: teacher._id,
      claimedAt: now,
      claimExpiresAt: now + CLAIM_TTL_MS,
    });

    await audit(ctx, {
      action: 'submission.claim',
      actor: teacher,
      targetTable: 'submissions',
      targetId: submission._id,
      candidateCode: submission.candidateCode, // never the student id
    });

    return { claimed: true as const, submissionId: submission._id };
  },
});

/** Release a claim voluntarily; the item returns to the pool. */
export const release = mutation({
  args: { submissionId: v.id('submissions') },
  handler: async (ctx, args) => {
    const teacher = await requireVerifiedTeacher(ctx);
    const submission = await ctx.db.get(args.submissionId);
    if (!submission || submission.claimedBy !== teacher._id) {
      throw new AuthError('Not your item.');
    }
    await ctx.db.patch(submission._id, {
      status: 'queued',
      claimedBy: undefined,
      claimedAt: undefined,
      claimExpiresAt: undefined,
    });
    await audit(ctx, {
      action: 'submission.release',
      actor: teacher,
      targetTable: 'submissions',
      targetId: submission._id,
      candidateCode: submission.candidateCode,
    });
  },
});

/**
 * THE MOST IMPORTANT QUERY IN THE DESIGN — a submission as a teacher sees it.
 *
 * A teacher may read an item only while they hold a live claim on it. Not "any
 * queued item", because an unbounded reader could walk the pool and correlate;
 * not "any item they once marked", because that reopens the history.
 */
export const getForMarking = query({
  args: { submissionId: v.id('submissions') },
  handler: async (ctx, args): Promise<TeacherSubmissionView> => {
    const teacher = await requireVerifiedTeacher(ctx);
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new AuthError('No such item.');
    if (submission.claimedBy !== teacher._id) throw new AuthError('Not your item.');
    if ((submission.claimExpiresAt ?? 0) < Date.now() && submission.status === 'claimed') {
      throw new AuthError('This claim has expired — take another from the queue.');
    }
    if (submission.status === 'moderating' || submission.status === 'rejected') {
      throw new AuthError('Not available.');
    }
    return toTeacherView(ctx, submission);
  },
});

// ---------------------------------------------------------------------------
// Student side
// ---------------------------------------------------------------------------

/** Create a draft and allocate its candidate code up front, for the header sheet (§5). */
export const createDraft = mutation({
  args: { questionId: v.string(), topicCode: v.string() },
  handler: async (ctx, args) => {
    const student = await requireRole(ctx, 'student');
    const candidateCode = await allocateCandidateCode(ctx);
    const submissionId = await ctx.db.insert('submissions', {
      studentId: student._id,
      candidateCode,
      questionId: args.questionId,
      topicCode: args.topicCode,
      status: 'draft',
      images: [],
    });
    return { submissionId, candidateCode };
  },
});

/** What the student sees about their own item — marker as `T-XXXX`, never a name. */
export const mySubmission = query({
  args: { submissionId: v.id('submissions') },
  handler: async (ctx, args) => {
    const student = await requireRole(ctx, 'student');
    const submission = await ctx.db.get(args.submissionId);
    if (!submission || submission.studentId !== student._id) {
      throw new AuthError('No such item.');
    }
    const mark = submission.markId ? await ctx.db.get(submission.markId) : null;
    return {
      submissionId: submission._id,
      candidateCode: submission.candidateCode,
      status: submission.status,
      dueAt: submission.dueAt ?? null,
      mark: mark
        ? {
            awarded: mark.awarded,
            outOf: mark.outOf,
            encouragement: mark.encouragement,
            // Symmetric blinding (§4): the stable code, never the teacher's name.
            markerCode: mark.teacherCode,
          }
        : null,
    };
  },
});

// ---------------------------------------------------------------------------
// Sweeps (wire to convex/crons.ts)
// ---------------------------------------------------------------------------

/** §6 — a claim not marked within 45 minutes reverts to `queued`. */
export async function expireStaleClaims(ctx: MutationCtx): Promise<number> {
  const now = Date.now();
  const stale = await ctx.db
    .query('submissions')
    .withIndex('by_status_claim_expiry', (q) =>
      q.eq('status', 'claimed').lt('claimExpiresAt', now)
    )
    .take(100);
  for (const submission of stale) {
    await ctx.db.patch(submission._id, {
      status: 'queued',
      claimedBy: undefined,
      claimedAt: undefined,
      claimExpiresAt: undefined,
    });
  }
  return stale.length;
}
