/**
 * Identity, codes, and de-anonymisation (PLAN §4, §11).
 */

import { mutation, query, internalMutation } from './_generated/server';
import { v } from 'convex/values';
import type { MutationCtx } from './_generated/server';
import type { Id } from './_generated/dataModel';
import {
  makeCandidateCode,
  makeTeacherCode,
  makeGuardianLinkCode,
  normaliseCode,
} from './lib/codes';
import {
  requireUser,
  requireRole,
  requireAdmin,
  audit,
  AuthError,
} from './lib/auth';
import { revealTriggerValidator } from './schema';
import { type ResolvedEnrolment } from '../lib/exam-catalogue';
import { resolveEnrolment } from './lib/catalogue';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// ---------------------------------------------------------------------------
// Code allocation
// ---------------------------------------------------------------------------

/**
 * Allocate an unused candidate code. Uniqueness is enforced by a read against
 * `by_candidate_code` inside the mutation — Convex transactions are serialisable,
 * so a concurrent insert of the same code causes an OCC retry of the whole
 * mutation rather than a duplicate. Codes are never reused: nothing ever frees one.
 */
export async function allocateCandidateCode(ctx: MutationCtx): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = makeCandidateCode();
    const clash = await ctx.db
      .query('submissions')
      .withIndex('by_candidate_code', (q) => q.eq('candidateCode', code))
      .first();
    if (!clash) return code;
  }
  throw new Error('Could not allocate a candidate code.');
}

export async function allocateTeacherCode(ctx: MutationCtx): Promise<string> {
  for (let attempt = 0; attempt < 12; attempt++) {
    const code = makeTeacherCode();
    const clash = await ctx.db
      .query('users')
      .withIndex('by_teacher_code', (q) => q.eq('teacherCode', code))
      .first();
    if (!clash) return code;
  }
  throw new Error('Could not allocate a teacher code.');
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

/**
 * Create the Convex `users` row for the calling Clerk identity.
 *
 * Note what is NOT an argument: role cannot be passed for `teacher` or `admin`.
 * A self-service caller may only become a student or a guardian. Teachers are
 * created by `promoteToTeacher` (admin-only) and verified by hand (§11.4).
 */
export const enrolmentInputValidator = v.object({
  /** ISO country code. The top layer: it decides which boards are even offered. */
  countryCode: v.string(),
  bodyId: v.string(),
  levelId: v.string(),
  sessionId: v.string(),
  subjectIds: v.array(v.string()),
});

export const registerSelf = mutation({
  args: {
    role: v.union(v.literal('student'), v.literal('guardian')),
    firstName: v.string(),
    ageBand: v.optional(
      v.union(v.literal('under13'), v.literal('13-17'), v.literal('18plus'))
    ),
    country: v.optional(v.string()),
    /**
     * Required for a student, refused for a guardian. The client sends ids only
     * (`{ countryCode, bodyId, levelId, sessionId, subjectIds }`); every title,
     * code and availability flag is resolved server-side from the catalogue tables
     * (convex/lib/catalogue.ts), so a crafted request cannot invent a subject,
     * claim one is available, or enrol for a board its country does not sit.
     */
    enrolment: v.optional(enrolmentInputValidator),
    termsVersion: v.string(),
    privacyVersion: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new AuthError('Not signed in.');

    const existing = await ctx.db
      .query('users')
      .withIndex('by_auth_subject', (q) => q.eq('authSubject', identity.subject))
      .unique();
    if (existing) return existing._id;

    // Under-13s are out of scope for the product and for both privacy regimes'
    // light-touch paths. Refuse rather than collect (see REGISTRATION §5).
    if (args.role === 'student' && args.ageBand === 'under13') {
      throw new AuthError('This service is for students aged 13 and over.');
    }

    let enrolment: ResolvedEnrolment | null = null;
    if (args.role === 'student') {
      // ageBand is REQUIRED for a student even though the column is optional:
      // everything downstream reads a missing band as "adult" (session.status
      // `isMinor`), so an absent band silently disables the guardian gate that
      // §0 amendment A exists to build. Refuse the registration instead.
      if (!args.ageBand) {
        throw new AuthError('Tell us your age band before we create the account.');
      }
      if (!args.enrolment) {
        throw new AuthError('Choose the exam you are sitting.');
      }
      // Throws on an unknown body/level/session/subject, or on zero subjects.
      enrolment = await resolveEnrolment(ctx, args.enrolment);
    } else if (args.enrolment) {
      throw new AuthError('A guardian account does not sit exams.');
    }

    const firstName = args.firstName.trim().slice(0, 40);
    if (!firstName) throw new AuthError('First name required.');

    const now = Date.now();
    const userId = await ctx.db.insert('users', {
      authSubject: identity.subject,
      role: args.role,
      firstName,
      ageBand: args.ageBand,
      // The country on the user row and the country on the enrolment answer two
      // different questions — which privacy regime applies, and where they are
      // sitting. They are usually the same and are not the same field.
      country: args.country ?? args.enrolment?.countryCode,
      // A minor's contact details are not mirrored into Convex at all; Clerk holds
      // them and the guardian is the addressable party.
      contactEmail:
        args.role === 'guardian' || args.ageBand === '18plus'
          ? identity.email
          : undefined,
      createdAt: now,
    });

    if (enrolment) await insertEnrolment(ctx, userId, enrolment, now);

    for (const [kind, documentVersion] of [
      ['terms', args.termsVersion],
      ['privacy', args.privacyVersion],
    ] as const) {
      await ctx.db.insert('consents', {
        subjectId: userId,
        grantedBy: userId,
        kind,
        documentVersion,
        grantedAt: now,
      });
    }
    return userId;
  },
});

/**
 * Write an enrolment and its demand rows. One place, so registration and a later
 * change of sitting cannot drift apart on what gets counted.
 */
async function insertEnrolment(
  ctx: MutationCtx,
  studentId: Id<'users'>,
  enrolment: ResolvedEnrolment,
  now: number
): Promise<Id<'enrolments'>> {
  const enrolmentId = await ctx.db.insert('enrolments', {
    studentId,
    countryCode: enrolment.countryCode,
    bodyId: enrolment.bodyId,
    levelId: enrolment.levelId,
    sessionId: enrolment.sessionId,
    sessionYear: enrolment.sessionYear,
    sessionSeries: enrolment.sessionSeries,
    subjects: enrolment.subjects,
    status: 'active',
    createdAt: now,
  });

  // Every pick, available or not. The missing ones are the roadmap (§8); the
  // available ones are the denominator that makes the missing ones a ratio.
  for (const subject of enrolment.subjects) {
    await ctx.db.insert('subjectDemand', {
      studentId,
      enrolmentId,
      bodyId: enrolment.bodyId,
      levelId: enrolment.levelId,
      sessionId: enrolment.sessionId,
      subjectId: subject.subjectId,
      subjectCode: subject.code,
      subjectTitle: subject.title,
      wasAvailable: subject.availability === 'available',
      availability: subject.availability,
      createdAt: now,
    });
  }
  return enrolmentId;
}

/**
 * Change what you are sitting. The old row is SUPERSEDED, never edited: a resit
 * in November and the June sitting it follows are two facts, and overwriting the
 * first destroys the only record of what the student was told at the time.
 */
export const changeEnrolment = mutation({
  args: { enrolment: enrolmentInputValidator },
  handler: async (ctx, args) => {
    const student = await requireRole(ctx, 'student');
    const resolved = await resolveEnrolment(ctx, args.enrolment);
    const now = Date.now();

    const newId = await insertEnrolment(ctx, student._id, resolved, now);

    const previous = await ctx.db
      .query('enrolments')
      .withIndex('by_student_status', (q) =>
        q.eq('studentId', student._id).eq('status', 'active')
      )
      .collect();
    for (const row of previous) {
      if (row._id === newId) continue;
      await ctx.db.patch(row._id, {
        status: 'superseded' as const,
        supersededBy: newId,
        endedAt: now,
      });
    }
    return newId;
  },
});

/** Owner-only. Role is never self-assigned. Verification is a separate step. */
export const promoteToTeacher = mutation({
  args: { userId: v.id('users'), tier: v.union(v.literal('junior'), v.literal('senior')) },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const user = await ctx.db.get(args.userId);
    if (!user) throw new AuthError('No such user.');
    const teacherCode = user.teacherCode ?? (await allocateTeacherCode(ctx));
    await ctx.db.patch(args.userId, {
      role: 'teacher',
      teacherTier: args.tier,
      teacherCode,
      approvedTopicCodes: user.approvedTopicCodes ?? [],
    });
    await audit(ctx, {
      action: 'teacher.promote',
      actor: admin,
      targetTable: 'users',
      targetId: args.userId,
      metadata: { tier: args.tier, teacherCode },
    });
    return teacherCode;
  },
});

/** §11.4 — manual verification by the owner after ID, credential and paid trial. */
export const verifyTeacher = mutation({
  args: {
    userId: v.id('users'),
    approvedTopicCodes: v.array(v.string()),
    evidenceNote: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    if (args.evidenceNote.trim().length < 20) {
      throw new AuthError('Record what was checked before verifying.');
    }
    await ctx.db.patch(args.userId, {
      verifiedAt: Date.now(),
      verifiedBy: admin._id,
      approvedTopicCodes: args.approvedTopicCodes,
    });
    await audit(ctx, {
      action: 'teacher.verify',
      actor: admin,
      targetTable: 'users',
      targetId: args.userId,
      metadata: {
        approvedTopicCodes: args.approvedTopicCodes,
        evidenceNote: args.evidenceNote,
      },
    });
  },
});

// ---------------------------------------------------------------------------
// Guardian linking — the STUDENT generates the code (§4)
// ---------------------------------------------------------------------------

export const createGuardianLinkCode = mutation({
  args: {},
  handler: async (ctx) => {
    const student = await requireRole(ctx, 'student');
    const code = makeGuardianLinkCode();
    const now = Date.now();
    await ctx.db.insert('guardianLinks', {
      studentId: student._id,
      linkCode: code,
      expiresAt: now + 7 * DAY,
      createdAt: now,
    });
    return code;
  },
});

export const redeemGuardianLinkCode = mutation({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const guardian = await requireRole(ctx, 'guardian');
    const code = normaliseCode(args.code);
    const link = await ctx.db
      .query('guardianLinks')
      .withIndex('by_link_code', (q) => q.eq('linkCode', code))
      .unique();

    const now = Date.now();
    // One message for every failure mode: a wrong code must not reveal whether a
    // student exists behind it.
    if (!link || link.redeemedAt || link.revokedAt || link.expiresAt < now) {
      throw new AuthError('That code is not valid.');
    }

    await ctx.db.patch(link._id, {
      guardianId: guardian._id,
      redeemedAt: now,
      // §11.6 — both parties are told the mirror exists, at the moment it starts.
      mirrorDisclosedAt: now,
    });
    await ctx.db.insert('consents', {
      subjectId: link.studentId,
      grantedBy: guardian._id,
      kind: 'minor_processing',
      documentVersion: 'guardian-consent-v1',
      grantedAt: now,
    });
    await audit(ctx, {
      action: 'guardian.link',
      actor: guardian,
      targetTable: 'guardianLinks',
      targetId: link._id,
    });
  },
});

// ---------------------------------------------------------------------------
// De-anonymisation (§11) — an explicit, triggered, time-boxed, audited action
// ---------------------------------------------------------------------------

/**
 * Grant a 60-minute, single-student reveal. This mutation does NOT return the
 * student's details; it creates the grant. Reading is a second, separately
 * logged call (`readRevealedCandidate`), so "opened the door" and "walked
 * through it" are distinguishable in the log.
 *
 * Admin only. There is no teacher path to this function, at any seniority.
 */
export const revealCandidate = mutation({
  args: {
    submissionId: v.id('submissions'),
    trigger: revealTriggerValidator,
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const reason = args.reason.trim();
    if (reason.length < 20) {
      throw new AuthError(
        'A specific written reason is required to reveal a candidate.'
      );
    }

    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new AuthError('No such submission.');

    const now = Date.now();
    const grantId = await ctx.db.insert('deanonymisations', {
      submissionId: submission._id,
      candidateCode: submission.candidateCode,
      studentId: submission.studentId,
      actorId: admin._id,
      trigger: args.trigger,
      reason,
      grantedAt: now,
      expiresAt: now + HOUR,
      readCount: 0,
      notifyDueAt: now + DAY,
    });

    await audit(ctx, {
      action: 'identity.reveal.grant',
      actor: admin,
      targetTable: 'submissions',
      targetId: submission._id,
      candidateCode: submission.candidateCode,
      metadata: { trigger: args.trigger, reason, grantId },
    });

    return { grantId, expiresAt: now + HOUR };
  },
});

/** Read under an unexpired grant. Every read is counted and logged. */
export const readRevealedCandidate = mutation({
  args: { grantId: v.id('deanonymisations') },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const grant = await ctx.db.get(args.grantId);
    if (!grant) throw new AuthError('No such grant.');
    // Scoped to the actor as well as the student: an admin cannot ride another
    // admin's grant.
    if (grant.actorId !== admin._id) throw new AuthError('Not your grant.');
    if (grant.expiresAt < Date.now()) throw new AuthError('Grant expired.');

    const student = await ctx.db.get(grant.studentId);
    await ctx.db.patch(grant._id, { readCount: grant.readCount + 1 });
    await audit(ctx, {
      action: 'identity.reveal.read',
      actor: admin,
      targetTable: 'users',
      targetId: grant.studentId,
      candidateCode: grant.candidateCode,
      metadata: { grantId: grant._id, readIndex: grant.readCount + 1 },
    });

    return {
      candidateCode: grant.candidateCode,
      firstName: student?.firstName ?? null,
      country: student?.country ?? null,
      expiresAt: grant.expiresAt,
    };
  },
});

/** Suppressing the §11 notification needs its own logged reason. */
export const suppressRevealNotification = mutation({
  args: { grantId: v.id('deanonymisations'), suppressionReason: v.string() },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    if (args.suppressionReason.trim().length < 20) {
      throw new AuthError('A written reason is required to suppress notice.');
    }
    await ctx.db.patch(args.grantId, {
      notificationSuppressed: true,
      suppressionReason: args.suppressionReason.trim(),
    });
    await audit(ctx, {
      action: 'identity.reveal.suppress_notice',
      actor: admin,
      targetTable: 'deanonymisations',
      targetId: args.grantId,
      metadata: { suppressionReason: args.suppressionReason },
    });
  },
});

/**
 * Cron (hourly). Notification is what makes the log a control rather than a
 * record nobody reads (§11), so overdue un-notified grants are surfaced, not
 * silently left.
 */
export const pendingRevealNotifications = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const due = await ctx.db
      .query('deanonymisations')
      .withIndex('by_notify_due', (q) =>
        q.eq('notifiedAt', undefined).lte('notifyDueAt', now)
      )
      .collect();
    return due
      .filter((g) => !g.notificationSuppressed)
      .map((g) => ({
        grantId: g._id as Id<'deanonymisations'>,
        studentId: g.studentId,
        trigger: g.trigger,
      }));
  },
});

/** Whoami — the client never asserts a role, it asks. */
export const me = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    return {
      role: user.role,
      firstName: user.firstName,
      teacherCode: user.teacherCode,
      verified: Boolean(user.verifiedAt) && !user.suspendedAt,
      approvedTopicCodes: user.approvedTopicCodes ?? [],
    };
  },
});
