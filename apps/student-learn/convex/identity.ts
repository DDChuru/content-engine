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
import { internal } from './_generated/api';
import {
  TERMS_VERSION,
  PRIVACY_VERSION,
  GUARDIAN_CONSENT_VERSION,
  GUARDIAN_ATTESTATION_STATEMENT,
  SUPPRESSIBLE_REVEAL_TRIGGERS,
  isAllowedCountry,
} from './lib/policy';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/** Cheap abuse ceilings. Not a substitute for a rate limiter; a floor under one. */
const MAX_ENROLMENT_CHANGES_PER_DAY = 10;
const MAX_LINK_CODES_PER_DAY = 10;
const MAX_OPEN_LINK_CODES = 3;
const MAX_STUDENTS_PER_GUARDIAN = 5;

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
    // `termsVersion` and `privacyVersion` USED TO BE ARGUMENTS. They are not any
    // more: a consent row is only evidence if the server can say which document
    // it refers to, and a client that can send `""` can manufacture a consent
    // naming nothing. The versions are now written from convex/lib/policy.ts.
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

    // The controlling privacy regime has to be KNOWN, for a guardian as much as
    // for a student. It was optional and unvalidated, so a crafted guardian
    // registration left "POPIA or the Zimbabwe DPA?" unanswerable — and those two
    // differ on the consent age this entire guardian path exists to satisfy.
    // A student's country comes from the catalogue-validated enrolment; a
    // guardian's is checked against the offered list here.
    const country = args.country ?? args.enrolment?.countryCode;
    if (!isAllowedCountry(country)) {
      throw new AuthError('Choose the country whose law applies to you.');
    }

    const now = Date.now();
    const userId = await ctx.db.insert('users', {
      authSubject: identity.subject,
      role: args.role,
      firstName,
      ageBand: args.ageBand,
      // The country on the user row and the country on the enrolment answer two
      // different questions — which privacy regime applies, and where they are
      // sitting. They are usually the same and are not the same field.
      country,
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
      ['terms', TERMS_VERSION],
      ['privacy', PRIVACY_VERSION],
    ] as const) {
      await ctx.db.insert('consents', {
        subjectId: userId,
        grantedBy: userId,
        kind,
        documentVersion,
        grantedAt: now,
        // The registering user speaks for themselves. That is exactly what
        // `self_declared` means, and it is recorded rather than implied.
        assuranceLevel: 'self_declared',
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

    const active = await ctx.db
      .query('enrolments')
      .withIndex('by_student_status', (q) =>
        q.eq('studentId', student._id).eq('status', 'active')
      )
      .collect();

    // IDEMPOTENCE. Re-submitting the same sitting is what a double-click and a
    // retried mutation both look like, and the old code answered each one with a
    // fresh enrolment plus a fresh `subjectDemand` row per subject — which is the
    // table §8 reads as demand. Silent, unbounded, and it corrupts the roadmap
    // rather than just wasting rows. An unchanged sitting is now a no-op.
    const same = active.find((row) => sameSitting(row, resolved));
    if (same) return same._id;

    // A ceiling on genuinely-different changes. A student legitimately switches
    // sitting a handful of times a year, not ten times a day.
    const recent = await ctx.db
      .query('enrolments')
      .withIndex('by_student_created', (q) =>
        q.eq('studentId', student._id).gt('createdAt', now - DAY)
      )
      .collect();
    if (recent.length >= MAX_ENROLMENT_CHANGES_PER_DAY) {
      throw new AuthError(
        'That is a lot of changes for one day. Try again tomorrow, or ask us.'
      );
    }

    const newId = await insertEnrolment(ctx, student._id, resolved, now);

    const previous = active;
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

/** Is this existing enrolment the same sitting the caller just asked for? */
function sameSitting(
  row: { countryCode?: string; bodyId: string; levelId: string; sessionId: string; subjects: { subjectId: string }[] },
  resolved: ResolvedEnrolment
): boolean {
  if (
    row.bodyId !== resolved.bodyId ||
    row.levelId !== resolved.levelId ||
    row.sessionId !== resolved.sessionId ||
    (row.countryCode ?? null) !== (resolved.countryCode ?? null)
  ) {
    return false;
  }
  const a = row.subjects.map((s) => s.subjectId).sort();
  const b = resolved.subjects.map((s) => s.subjectId).sort();
  return a.length === b.length && a.every((id, i) => id === b[i]);
}

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

/**
 * Allocate an unused link code. The old version generated one and inserted it
 * blind: a collision produced two rows with the same `linkCode`, and the lookup
 * in `redeemGuardianLinkCode` is a `.unique()`, which THROWS on two matches —
 * bricking both students' codes with an error neither of them can act on. 32^8
 * makes it unlikely; `.unique()` makes it unrecoverable, which is the part that
 * matters.
 */
async function allocateGuardianLinkCode(ctx: MutationCtx): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = makeGuardianLinkCode();
    const clash = await ctx.db
      .query('guardianLinks')
      .withIndex('by_link_code', (q) => q.eq('linkCode', code))
      .first();
    if (!clash) return code;
  }
  throw new Error('Could not allocate a guardian link code.');
}

export const createGuardianLinkCode = mutation({
  args: {},
  handler: async (ctx) => {
    const student = await requireRole(ctx, 'student');
    const now = Date.now();

    const existing = await ctx.db
      .query('guardianLinks')
      .withIndex('by_student', (q) => q.eq('studentId', student._id))
      .collect();

    // Two ceilings, for two different problems. Open codes are live credentials
    // read aloud: a student with thirty of them cannot say which one they gave to
    // whom. The daily cap is plain abuse control.
    const open = existing.filter(
      (l) => !l.redeemedAt && !l.revokedAt && l.expiresAt > now
    );
    if (open.length >= MAX_OPEN_LINK_CODES) {
      throw new AuthError(
        'You already have codes waiting to be used. Use one of those, or let them expire.'
      );
    }
    if (existing.filter((l) => l.createdAt > now - DAY).length >= MAX_LINK_CODES_PER_DAY) {
      throw new AuthError('Too many codes today. Try again tomorrow.');
    }

    const code = await allocateGuardianLinkCode(ctx);
    await ctx.db.insert('guardianLinks', {
      studentId: student._id,
      linkCode: code,
      expiresAt: now + 7 * DAY,
      createdAt: now,
    });
    return code;
  },
});

/**
 * Redeem a student's code as their guardian.
 *
 * READ THIS BEFORE CHANGING IT. A redeemed code establishes that someone was
 * given the code. It does not establish parenthood, adulthood, or anything else,
 * and no check in this function can. A minor can open a second Clerk account,
 * register it as a guardian, and redeem a code they generated themselves; short
 * of demanding an ID document from a child — a larger harm than the one it
 * prevents (REGISTRATION §1) — nothing stops them.
 *
 * So this function does not pretend to verify. It does three things instead:
 *
 *  1. RECORDS THE STRENGTH. The consent row carries `assuranceLevel:
 *     'self_declared'`, and every screen that shows the link says so. The row is
 *     the legal artefact, and an artefact that cannot tell a real guardian from a
 *     self-redeemed one is worse than none, because it reads as though it can.
 *  2. DEMANDS AN ATTESTATION. Redemption without the explicit affirmation is
 *     refused, the timestamp lands on `guardianAttestedAt`, and the sentence and
 *     its version are stored verbatim. An attestation does not make the claim
 *     true; it makes a false one an act, attributable and dated.
 *  3. REFUSES THE OBVIOUS SELF-REDEMPTION. Same auth subject, or the same email
 *     address we happen to hold — see the comments at the check for exactly how
 *     far that gets, which is not very.
 *
 * The real floor is `payment_verified` (§0 amendment A): a parent paying with
 * their own instrument is far harder to fake than a second inbox. The data model
 * carries the level so that gate can require it. The payment itself is not built.
 */
export const redeemGuardianLinkCode = mutation({
  args: {
    code: v.string(),
    /**
     * The attestation. Not a formality and not defaulted: `false` or absent is a
     * refusal, because a consent row whose guardian never affirmed anything is
     * the thing this whole change exists to stop writing.
     */
    attested: v.boolean(),
  },
  handler: async (ctx, args) => {
    const guardian = await requireRole(ctx, 'guardian');
    if (!args.attested) {
      throw new AuthError(
        'Confirm you are this student’s parent or guardian before linking.'
      );
    }

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

    const student = await ctx.db.get(link.studentId);
    if (!student || student.erasedAt) throw new AuthError('That code is not valid.');

    // --- self-redemption refusals -----------------------------------------
    // Honest accounting of what these catch: the SAME signed-in account (which
    // the role check already excludes, kept because defence at the data layer
    // should not depend on a check three lines above), and a second account that
    // reuses an email address we hold. We hold a student's email ONLY when they
    // declared 18plus — a 13-17 student's contact details are deliberately never
    // mirrored into Convex (REGISTRATION §1) — so for exactly the minors this
    // gate protects, the email comparison has nothing to compare and passes.
    // That is not a bug to fix here; it is why `self_declared` is recorded.
    if (link.studentId === guardian._id || student.authSubject === guardian.authSubject) {
      throw new AuthError('A student cannot be their own guardian.');
    }
    const identity = await ctx.auth.getUserIdentity();
    const guardianEmail = normaliseEmail(identity?.email ?? guardian.contactEmail);
    const studentEmail = normaliseEmail(student.contactEmail);
    if (guardianEmail && studentEmail && guardianEmail === studentEmail) {
      throw new AuthError('A student cannot be their own guardian.');
    }

    // A guardian with a dozen students is either a school or a harvesting
    // account. Both want a conversation, not a silent link.
    const held = await ctx.db
      .query('guardianLinks')
      .withIndex('by_guardian', (q) => q.eq('guardianId', guardian._id))
      .collect();
    if (held.filter((l) => l.redeemedAt && !l.revokedAt).length >= MAX_STUDENTS_PER_GUARDIAN) {
      throw new AuthError('This account is linked to as many students as we allow.');
    }

    await ctx.db.patch(link._id, {
      guardianId: guardian._id,
      redeemedAt: now,
      // §11.6 — both parties are told the mirror exists, at the moment it starts.
      mirrorDisclosedAt: now,
      assuranceLevel: 'self_declared' as const,
      guardianAttestedAt: now,
      attestationVersion: GUARDIAN_CONSENT_VERSION,
      attestationStatement: GUARDIAN_ATTESTATION_STATEMENT,
    });
    // First attestation by this account, for the user row the schema already
    // reserved space for and nothing ever wrote.
    if (!guardian.guardianAttestedAt) {
      await ctx.db.patch(guardian._id, { guardianAttestedAt: now });
    }

    await ctx.db.insert('consents', {
      subjectId: link.studentId,
      grantedBy: guardian._id,
      kind: 'minor_processing',
      documentVersion: GUARDIAN_CONSENT_VERSION,
      grantedAt: now,
      assuranceLevel: 'self_declared',
      sourceLinkId: link._id,
      attestationStatement: GUARDIAN_ATTESTATION_STATEMENT,
    });
    await audit(ctx, {
      action: 'guardian.link',
      actor: guardian,
      targetTable: 'guardianLinks',
      targetId: link._id,
      metadata: {
        assuranceLevel: 'self_declared',
        attestationVersion: GUARDIAN_CONSENT_VERSION,
        studentId: link.studentId,
      },
    });
    return { assuranceLevel: 'self_declared' as const };
  },
});

/**
 * Lower-cased, and with a `+tag` sub-address stripped. The tag is the cheapest
 * way to get a second "different" account on one inbox, so comparing raw strings
 * would catch nobody who thought about it for ten seconds.
 */
function normaliseEmail(email: string | undefined | null): string | null {
  const trimmed = email?.trim().toLowerCase();
  if (!trimmed || !trimmed.includes('@')) return trimmed ? trimmed : null;
  const [local, domain] = trimmed.split('@');
  return `${local.split('+')[0]}@${domain}`;
}

/**
 * End a guardian link. Either party, as the schema and the account page have both
 * promised since the first commit while no mutation existed to honour it.
 *
 * The link row is never deleted — revocation is a stamp, per §11.5 — and the
 * `minor_processing` consent is WITHDRAWN as a new `consents` row rather than an
 * edit, because "consent was given and later withdrawn" is two facts and
 * overwriting the first destroys the record of what was lawful when.
 */
export const revokeGuardianLink = mutation({
  args: { linkId: v.id('guardianLinks') },
  handler: async (ctx, args) => {
    // Role is re-derived; the caller asserts nothing but which link they mean,
    // and is then checked to be a party to that link.
    const user = await requireUser(ctx);
    const link = await ctx.db.get(args.linkId);
    if (!link) throw new AuthError('No such link.');

    const isStudent = link.studentId === user._id;
    const isGuardian = link.guardianId !== undefined && link.guardianId === user._id;
    if (!isStudent && !isGuardian && user.role !== 'admin') {
      throw new AuthError('Not permitted.');
    }
    if (link.revokedAt) return; // idempotent: revoking twice is not an error

    const now = Date.now();
    await ctx.db.patch(link._id, {
      revokedAt: now,
      revokedBy: user._id,
      revokedByRole: user.role,
    });

    if (link.redeemedAt && link.guardianId) {
      await ctx.db.insert('consents', {
        subjectId: link.studentId,
        grantedBy: link.guardianId,
        kind: 'minor_processing',
        documentVersion: GUARDIAN_CONSENT_VERSION,
        grantedAt: link.redeemedAt,
        withdrawnAt: now,
        assuranceLevel: link.assuranceLevel ?? 'self_declared',
        sourceLinkId: link._id,
      });
    }

    await audit(ctx, {
      action: 'guardian.link.revoke',
      actor: user,
      targetTable: 'guardianLinks',
      targetId: link._id,
      metadata: {
        revokedByRole: user.role,
        wasRedeemed: Boolean(link.redeemedAt),
        studentId: link.studentId,
        guardianId: link.guardianId ?? null,
      },
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
    /**
     * A safeguarding or legal hold, declared AT THE GRANT.
     *
     * It has to be here, not only in `suppressRevealNotification`: notice is now
     * delivered within seconds, so a hold applied afterwards is applied to a
     * notice the subject has already read. The case suppression exists for —
     * telling the student would tip off the adult who is harming them — is
     * decided before the look-up, not after it. The separate mutation stays for
     * a hold that arises while delivery is still pending.
     */
    suppressNoticeReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const reason = args.reason.trim();
    if (reason.length < 20) {
      throw new AuthError(
        'A specific written reason is required to reveal a candidate.'
      );
    }

    const suppressionReason = args.suppressNoticeReason?.trim();
    if (suppressionReason !== undefined) {
      if (suppressionReason.length < 20) {
        throw new AuthError('A written reason is required to suppress notice.');
      }
      if (!(SUPPRESSIBLE_REVEAL_TRIGGERS as readonly string[]).includes(args.trigger)) {
        throw new AuthError(
          'Notice may only be suppressed for a safeguarding or legal hold.'
        );
      }
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
      notificationSuppressed: suppressionReason !== undefined ? true : undefined,
      suppressionReason,
      suppressedBy: suppressionReason !== undefined ? admin._id : undefined,
      suppressedAt: suppressionReason !== undefined ? now : undefined,
    });

    await audit(ctx, {
      action: 'identity.reveal.grant',
      actor: admin,
      targetTable: 'submissions',
      targetId: submission._id,
      candidateCode: submission.candidateCode,
      metadata: {
        trigger: args.trigger,
        reason,
        grantId,
        noticeSuppressed: suppressionReason !== undefined,
        suppressionReason: suppressionReason ?? null,
      },
    });

    // §11 requires notice WITHIN 24 hours. `notifyDueAt` is the DEADLINE, and the
    // first implementation treated it as the send time — the sweep only looked at
    // rows whose deadline had already passed, so the earliest possible notice was
    // one that was already late. Delivery is attempted now, in its own
    // transaction, and the sweep below is a retry for anything that fell over.
    await ctx.scheduler.runAfter(0, internal.identity.deliverRevealNotice, {
      grantId,
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

/**
 * Suppressing the §11 notification needs its own logged reason AND a trigger
 * that justifies silence.
 *
 * The plan is specific: told within 24 hours "unless a safeguarding or legal hold
 * suppresses it". The first implementation let an admin suppress notice for ANY
 * trigger, `payment_dispute` and `account_recovery` included — which makes the
 * notification requirement an option the person being unmasked cannot see. A
 * telling-them-would-endanger-them case is a real thing; a billing argument is
 * not one.
 */
export const suppressRevealNotification = mutation({
  args: { grantId: v.id('deanonymisations'), suppressionReason: v.string() },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const reason = args.suppressionReason.trim();
    if (reason.length < 20) {
      throw new AuthError('A written reason is required to suppress notice.');
    }
    const grant = await ctx.db.get(args.grantId);
    if (!grant) throw new AuthError('No such grant.');
    if (
      !(SUPPRESSIBLE_REVEAL_TRIGGERS as readonly string[]).includes(grant.trigger)
    ) {
      throw new AuthError(
        'Notice may only be suppressed for a safeguarding or legal hold.'
      );
    }
    // Suppression after the fact is not suppression. Say so rather than write a
    // field that implies nobody was told.
    if (grant.notifiedAt) {
      throw new AuthError('This notice has already been delivered.');
    }

    await ctx.db.patch(args.grantId, {
      notificationSuppressed: true,
      suppressionReason: reason,
      suppressedBy: admin._id,
      suppressedAt: Date.now(),
    });
    await audit(ctx, {
      action: 'identity.reveal.suppress_notice',
      actor: admin,
      targetTable: 'deanonymisations',
      targetId: args.grantId,
      metadata: { suppressionReason: reason, trigger: grant.trigger },
    });
  },
});

/**
 * Deliver the §11 notice for one grant: the student, and every guardian whose
 * link is live. Scheduled immediately by `revealCandidate`, and retried by the
 * hourly sweep.
 *
 * WHAT THIS ACTUALLY DELIVERS, plainly: an in-app notice row the recipient sees
 * on their own account page. There is no email provider wired to this
 * deployment, so no email is sent, and `channel: 'in_app'` records that rather
 * than letting a later reader mistake the row for proof one went out. When a
 * provider lands, this is the function that gains a second channel — the
 * recipients, the timing and the audit row do not change.
 *
 * `notifiedAt` is stamped only when at least one notice row was written. A grant
 * with no reachable recipient stays un-notified and shows up in
 * `overdueRevealNotices`, because a notification nobody received is not one.
 */
export const deliverRevealNotice = internalMutation({
  args: { grantId: v.id('deanonymisations') },
  handler: async (ctx, args) => {
    const grant = await ctx.db.get(args.grantId);
    if (!grant || grant.notifiedAt || grant.notificationSuppressed) return 0;

    const now = Date.now();
    const recipients: { id: Id<'users'>; role: 'student' | 'guardian' }[] = [];

    const student = await ctx.db.get(grant.studentId);
    if (student && !student.erasedAt) {
      recipients.push({ id: student._id, role: 'student' });
    }
    const links = await ctx.db
      .query('guardianLinks')
      .withIndex('by_student', (q) => q.eq('studentId', grant.studentId))
      .collect();
    for (const link of links) {
      if (!link.guardianId || !link.redeemedAt || link.revokedAt) continue;
      if (recipients.some((r) => r.id === link.guardianId)) continue;
      recipients.push({ id: link.guardianId, role: 'guardian' });
    }

    for (const r of recipients) {
      await ctx.db.insert('revealNotices', {
        grantId: grant._id,
        recipientId: r.id,
        recipientRole: r.role,
        trigger: grant.trigger,
        grantedAt: grant.grantedAt,
        channel: 'in_app',
        createdAt: now,
      });
    }

    await ctx.db.patch(grant._id, {
      notifiedAt: recipients.length > 0 ? now : undefined,
      notifiedRecipientCount: recipients.length,
      notificationError:
        recipients.length === 0 ? 'No reachable recipient for this grant.' : undefined,
    });

    await ctx.db.insert('auditLog', {
      action: 'identity.reveal.notify',
      actorId: grant.actorId,
      actorRole: 'admin',
      targetTable: 'deanonymisations',
      targetId: grant._id,
      candidateCode: grant.candidateCode,
      metadata: JSON.stringify({
        trigger: grant.trigger,
        channel: 'in_app',
        recipientCount: recipients.length,
        emailSent: false,
      }),
      at: now,
    });

    return recipients.length;
  },
});

/**
 * Cron (hourly). A retry, not the primary path — anything still un-notified is
 * either a delivery that fell over or a grant written before this existed.
 */
export const sweepRevealNotifications = internalMutation({
  args: {},
  handler: async (ctx) => {
    const pending = await ctx.db
      .query('deanonymisations')
      .withIndex('by_notify_due', (q) => q.eq('notifiedAt', undefined))
      .collect();
    let delivered = 0;
    for (const grant of pending) {
      if (grant.notificationSuppressed) continue;
      await ctx.scheduler.runAfter(0, internal.identity.deliverRevealNotice, {
        grantId: grant._id,
      });
      delivered++;
    }
    return delivered;
  },
});

/**
 * The loud state. An un-notified grant past its 24-hour deadline is a compliance
 * failure, and the previous code's only expression of that was an internal
 * mutation nobody called. This is a query an admin screen renders, and a
 * suppressed grant is listed too — suppression is a decision that should stay
 * visible, not a way for a row to leave the list.
 */
export const overdueRevealNotices = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const now = Date.now();
    const pending = await ctx.db
      .query('deanonymisations')
      .withIndex('by_notify_due', (q) =>
        q.eq('notifiedAt', undefined).lte('notifyDueAt', now)
      )
      .collect();

    return {
      overdue: pending
        .filter((g) => !g.notificationSuppressed)
        .map((g) => ({
          grantId: g._id,
          candidateCode: g.candidateCode,
          trigger: g.trigger,
          grantedAt: g.grantedAt,
          notifyDueAt: g.notifyDueAt,
          hoursLate: Math.floor((now - g.notifyDueAt) / HOUR),
          lastError: g.notificationError ?? null,
        })),
      suppressed: pending
        .filter((g) => g.notificationSuppressed)
        .map((g) => ({
          grantId: g._id,
          candidateCode: g.candidateCode,
          trigger: g.trigger,
          suppressionReason: g.suppressionReason ?? null,
          suppressedAt: g.suppressedAt ?? null,
        })),
    };
  },
});

/**
 * One-shot backfill for rows written before assurance was recorded.
 *
 * Two real accounts exist. Their consent rows predate `assuranceLevel` and are
 * not orphaned by it — they are marked `self_declared`, which is precisely what
 * they were, and any already-redeemed guardian link is marked the same with no
 * attestation timestamp, so an un-attested legacy link is visibly un-attested
 * rather than quietly backdated. Idempotent; re-running changes nothing.
 */
export const backfillConsentAssurance = internalMutation({
  args: {},
  handler: async (ctx) => {
    let consents = 0;
    for (const row of await ctx.db.query('consents').collect()) {
      if (row.assuranceLevel) continue;
      await ctx.db.patch(row._id, { assuranceLevel: 'self_declared' as const });
      consents++;
    }
    let links = 0;
    for (const link of await ctx.db.query('guardianLinks').collect()) {
      if (!link.redeemedAt || link.assuranceLevel) continue;
      await ctx.db.patch(link._id, { assuranceLevel: 'self_declared' as const });
      links++;
    }
    return { consents, links };
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
