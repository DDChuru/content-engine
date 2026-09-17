/**
 * Stem 4 Life — Convex schema.
 *
 * Implements §4 (identity + blinding), §6 (the marking loop), §7 (prescriptions),
 * §8 (gap aggregation), §11 (safeguarding) of briefs/PLAN-marking-platform.md.
 *
 * Two rules govern every table here:
 *
 *  1. BLINDING. `submissions.studentId` is the ONLY join from marked work back to a
 *     person, and no query reachable by a teacher may select it. Everything a teacher
 *     reads is keyed by `candidateCode`. Everything a student reads about a marker is
 *     keyed by `teacherCode`.
 *  2. APPEND-ONLY. Marks, flags, audit rows and the credit ledger are never mutated
 *     or deleted. Corrections are new rows. Retention is 3 years (§11.5).
 *
 * NOTE: this file does not compile until `convex` is installed and a deployment
 * exists — see convex/REGISTRATION-AND-ROLES.md §7.
 */

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// ---------------------------------------------------------------------------
// Shared literal unions
// ---------------------------------------------------------------------------

export const roleValidator = v.union(
  v.literal('student'),
  v.literal('teacher'),
  v.literal('guardian'),
  v.literal('admin')
);

/** §6 states. `moderating` is the machine ingest step; `queued` is pool-visible. */
export const submissionStatusValidator = v.union(
  v.literal('draft'),
  v.literal('submitted'),
  v.literal('moderating'),
  v.literal('rejected'), // ingest rejected the image (§5.3) — never reaches the pool
  v.literal('queued'),
  v.literal('claimed'),
  v.literal('marked'),
  v.literal('returned'),
  v.literal('queried'),
  v.literal('answered'),
  v.literal('closed'),
  v.literal('refunded') // SLA miss (§6) or teacher-flagged identifying (§5.5)
);

export const teacherTierValidator = v.union(
  v.literal('junior'),
  v.literal('senior')
);

/** §11 — enumerated, required. There is no "other". */
export const revealTriggerValidator = v.union(
  v.literal('safeguarding_flag'),
  v.literal('payment_dispute'),
  v.literal('legal_request'),
  v.literal('student_or_guardian_request'),
  v.literal('account_recovery')
);

export default defineSchema({
  // -------------------------------------------------------------------------
  // users — one table, role discriminator (§4)
  // -------------------------------------------------------------------------
  // Role lives HERE, not in Clerk publicMetadata. Clerk answers "who is this
  // subject"; this row answers "what may they do". See REGISTRATION-AND-ROLES.md §4.
  users: defineTable({
    /** Clerk `subject` claim (`ctx.auth.getUserIdentity().subject`). Immutable. */
    authSubject: v.string(),
    role: roleValidator,

    // -- what we collect from a student: first name + year. Nothing else. --
    firstName: v.string(),
    // `yearGroup: v.optional(v.string())` lived here and is GONE. A sitting is
    // (body, level, session, subjects) and changes between sittings — it was
    // never one mutable string. See the `enrolments` table below, and
    // `migrations:backfillEnrolments` for how the two rows that held one moved.
    /**
     * Self-declared age band. Drives the consent gate, not identity.
     * REQUIRED for role 'student' — enforced in `registerSelf`, because the
     * payment gate (§0 amendment A) hangs on it and `undefined` silently means
     * "adult" everywhere downstream. Optional here only for guardians/teachers.
     */
    ageBand: v.optional(
      v.union(v.literal('under13'), v.literal('13-17'), v.literal('18plus'))
    ),
    /** ISO-3166-2 country, needed to pick POPIA vs ZW DPA handling. */
    country: v.optional(v.string()),

    // -- contact. Held by Clerk; mirrored ONLY where a server function must
    //    send to it (payout, guardian notices). Never for students under 18. --
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),

    /** Stable public code. Teachers get `T-XXXX`; students have none (§4). */
    teacherCode: v.optional(v.string()),

    // -- teacher-only state (§11.4) --
    teacherTier: v.optional(teacherTierValidator),
    /** null/undefined until the owner verifies by hand. Gate on this, not on role. */
    verifiedAt: v.optional(v.number()),
    verifiedBy: v.optional(v.id('users')),
    /** Syllabus topic codes (lib/syllabus.ts) this teacher may claim from. */
    approvedTopicCodes: v.optional(v.array(v.string())),
    /** Set when two flags open (§11.7) or verification is withdrawn. Blocks claims. */
    suspendedAt: v.optional(v.number()),
    suspensionReason: v.optional(v.string()),
    payoutMethod: v.optional(
      v.object({
        kind: v.union(
          v.literal('ecocash'),
          v.literal('innbucks'),
          v.literal('eft'),
          v.literal('mukuru')
        ),
        /** Deliberately opaque: account handle only, no ID numbers. */
        handle: v.string(),
      })
    ),

    // -- guardian-only state --
    /** Guardians confirm they are the adult responsible. Timestamp of that click. */
    guardianAttestedAt: v.optional(v.number()),

    createdAt: v.number(),
    /** Soft-delete marker. Rows are retained per §11.5; PII is scrubbed in place. */
    erasedAt: v.optional(v.number()),
  })
    .index('by_auth_subject', ['authSubject'])
    .index('by_role', ['role'])
    .index('by_teacher_code', ['teacherCode'])
    // the claim queue needs "verified, unsuspended teachers" cheaply
    .index('by_role_verified', ['role', 'verifiedAt']),

  // -------------------------------------------------------------------------
  // enrolments — WHAT a student is sitting: body → level → session → subjects
  // -------------------------------------------------------------------------
  // A row, not a column on `users`, for three reasons:
  //
  //  1. A sitting is a tuple, not a scalar. "2027" answered none of "which board",
  //     "which level", "which series", "which subjects".
  //  2. It is not single-valued over time. A student resits in November what they
  //     failed in June, and sits AS this year and A2 the next. A mutable field
  //     would overwrite the very history the §8 demand signal is made of.
  //  3. It is the demand signal. Counting "how many students are sitting 9702 in
  //     Oct/Nov 2027" is an index scan here and impossible on an overwritten field.
  //
  // Superseding, not editing: changing your sitting writes a new row and marks the
  // old one `superseded`, matching the append-only rule the rest of the schema uses.
  enrolments: defineTable({
    studentId: v.id('users'),

    /** lib/exam-catalogue.ts ids. Validated against the catalogue server-side. */
    bodyId: v.string(), // 'cambridge' | 'zimsec' | 'edexcel' | ...
    levelId: v.string(), // 'a-level' | 'o-level' | 'igcse' | ...
    /** Composite session id, e.g. "2027-oct-nov". Denormalised below for indexes. */
    sessionId: v.string(),
    sessionYear: v.number(),
    /** Series slug within the body, e.g. 'may-june' | 'oct-nov' | 'november'. */
    sessionSeries: v.string(),

    /**
     * The chosen subjects, snapshotted. Title and availability are copied in on
     * purpose: a statement about what a student was told at registration must not
     * change because the catalogue was later edited or a subject went live.
     */
    subjects: v.array(
      v.object({
        subjectId: v.string(), // catalogue id, unique within body+level
        /** Syllabus code where the body uses one ("9709"). Absent where it does not. */
        code: v.optional(v.string()),
        title: v.string(),
        /** What the UI told them at the time. See lib/exam-catalogue.ts. */
        availability: v.union(
          v.literal('available'),
          v.literal('in_progress'),
          v.literal('planned')
        ),
      })
    ),

    status: v.union(
      v.literal('active'),
      v.literal('superseded'),
      v.literal('withdrawn')
    ),
    supersededBy: v.optional(v.id('enrolments')),
    createdAt: v.number(),
    endedAt: v.optional(v.number()),
  })
    .index('by_student_status', ['studentId', 'status'])
    .index('by_student_created', ['studentId', 'createdAt'])
    // "who is sitting this, when" — the cohort view behind pacing and demand
    .index('by_body_level_session', ['bodyId', 'levelId', 'sessionId']),

  // -------------------------------------------------------------------------
  // subjectDemand — one row per subject picked. The §8 logic, one step earlier
  // -------------------------------------------------------------------------
  // §8 aggregates diagnosed gaps into a content roadmap. This aggregates *asked
  // for and not there* into the same roadmap, before a single mark exists —
  // which is the only signal available while the library covers one unit of one
  // subject.
  //
  // Every pick is recorded, not only the missing ones, because "40 wanted 9709,
  // 38 wanted 9702" is a ratio and the denominator has to be real.
  subjectDemand: defineTable({
    studentId: v.id('users'),
    enrolmentId: v.id('enrolments'),
    bodyId: v.string(),
    levelId: v.string(),
    sessionId: v.string(),
    subjectId: v.string(),
    subjectCode: v.optional(v.string()),
    subjectTitle: v.string(),
    /** Availability at the moment of asking. `false` = the thing to build. */
    wasAvailable: v.boolean(),
    availability: v.union(
      v.literal('available'),
      v.literal('in_progress'),
      v.literal('planned')
    ),
    /** Set when the subject ships and the student is told (mirrors coverageMisses). */
    notifiedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    // the ranking: "what is asked for and missing, most recently"
    .index('by_available_created', ['wasAvailable', 'createdAt'])
    .index('by_subject_created', ['subjectId', 'createdAt'])
    .index('by_body_level_subject', ['bodyId', 'levelId', 'subjectId'])
    // deduplicate by student, per §8
    .index('by_student', ['studentId']),

  // -------------------------------------------------------------------------
  // guardianLinks — guardian ↔ student, via a code the STUDENT generates (§4)
  // -------------------------------------------------------------------------
  guardianLinks: defineTable({
    studentId: v.id('users'),
    /** null until redeemed — the row exists as an unclaimed invite first. */
    guardianId: v.optional(v.id('users')),
    /** `G-XXXX-XXXX`, same alphabet as candidate codes. Single use. */
    linkCode: v.string(),
    expiresAt: v.number(),
    redeemedAt: v.optional(v.number()),
    /** Either side may revoke; the row stays for the audit trail. */
    revokedAt: v.optional(v.number()),
    revokedBy: v.optional(v.id('users')),
    /** §11.6 — both parties are told the mirror exists. When they were told. */
    mirrorDisclosedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_link_code', ['linkCode'])
    .index('by_student', ['studentId'])
    .index('by_guardian', ['guardianId']),

  // -------------------------------------------------------------------------
  // consents — append-only record of what was agreed, by whom, to what version
  // -------------------------------------------------------------------------
  consents: defineTable({
    subjectId: v.id('users'),
    /** Who clicked. For a minor's processing consent this is the guardian. */
    grantedBy: v.id('users'),
    kind: v.union(
      v.literal('terms'),
      v.literal('privacy'),
      v.literal('minor_processing'), // guardian consent for a 13-17 student
      v.literal('marketing')
    ),
    /** Policy document version, e.g. "privacy-2026-09-16". */
    documentVersion: v.string(),
    grantedAt: v.number(),
    /** Withdrawal is a new row with `withdrawnAt`; the grant row is never edited. */
    withdrawnAt: v.optional(v.number()),
  })
    .index('by_subject_kind', ['subjectId', 'kind'])
    .index('by_subject', ['subjectId']),

  // -------------------------------------------------------------------------
  // submissions — the spine (§6)
  // -------------------------------------------------------------------------
  submissions: defineTable({
    /** THE identifying field. Never selected into any teacher-reachable payload. */
    studentId: v.id('users'),
    /** `C-XXXX-XXXX`, CSPRNG, per-submission, never reused (§4). */
    candidateCode: v.string(),

    questionId: v.string(), // content/questions/*.json id
    topicCode: v.string(), // lib/syllabus.ts code — the queue filter key
    status: submissionStatusValidator,

    /** Client-typed final answer, auto-marked instantly by gradeAnswer (§6). */
    typedFinalAnswer: v.optional(v.string()),
    autoMarkCorrect: v.optional(v.boolean()),

    /** Dual storage ids per image (§5). `original` is admin-gated, always. */
    images: v.array(
      v.object({
        originalStorageId: v.id('_storage'),
        /** Only set once ingest succeeds. The ONLY id a marking query returns. */
        teacherStorageId: v.optional(v.id('_storage')),
        redactionBoxCount: v.optional(v.number()),
        redactedAreaFraction: v.optional(v.number()),
        /** Student ticked "my working is still readable" (§5.4). Required to queue. */
        studentConfirmedAt: v.optional(v.number()),
      })
    ),
    moderationVerdict: v.optional(
      v.union(v.literal('pass'), v.literal('reject'))
    ),
    moderationReason: v.optional(v.string()),

    /** §6 SLA. Promise is a clock time; this is its materialisation. */
    submittedAt: v.optional(v.number()),
    dueAt: v.optional(v.number()),

    /** Optimistic-concurrency field. `undefined` == claimable. */
    claimedBy: v.optional(v.id('users')),
    claimedAt: v.optional(v.number()),
    /** claimedAt + 45min; a cron returns the item to the pool (§6). */
    claimExpiresAt: v.optional(v.number()),

    markId: v.optional(v.id('marks')),
    returnedAt: v.optional(v.number()),
    /** returnedAt + 7 days (§6). */
    autoCloseAt: v.optional(v.number()),
    closedAt: v.optional(v.number()),

    /** Ledger row that paid for this, so a refund is traceable. */
    creditLedgerId: v.optional(v.id('creditLedger')),
  })
    .index('by_candidate_code', ['candidateCode']) // uniqueness + teacher lookups
    .index('by_student', ['studentId'])
    // THE POOL: queue is (status, topicCode) sorted by dueAt.
    .index('by_status_topic_due', ['status', 'topicCode', 'dueAt'])
    // rotation cap (§4): "did this teacher mark this student recently"
    .index('by_student_claimed_by', ['studentId', 'claimedBy', 'claimedAt'])
    .index('by_claimed_by_status', ['claimedBy', 'status'])
    // cron sweeps
    .index('by_status_claim_expiry', ['status', 'claimExpiresAt'])
    .index('by_status_due', ['status', 'dueAt']),

  // -------------------------------------------------------------------------
  // marks — append-only. A correction is a new row (§11.5)
  // -------------------------------------------------------------------------
  marks: defineTable({
    submissionId: v.id('submissions'),
    /** Denormalised so a teacher-facing query never touches `submissions.studentId`. */
    candidateCode: v.string(),
    teacherId: v.id('users'),
    teacherCode: v.string(),

    awarded: v.number(),
    outOf: v.number(),
    /** 1-3 misconceptionCatalogue codes. Cannot submit with zero (§7). */
    misconceptionCodes: v.array(v.string()),
    /** Mandatory one-line human sentence (§7). */
    encouragement: v.string(),
    /** Only when a diagnosed gap has no lesson (§9). Paid at 1.5×. */
    fallbackExplanation: v.optional(v.string()),

    /** §13 quality: under 90s auto-flags. */
    timeSpentSec: v.number(),
    /** §10 — AI drafted, teacher corrected. Recorded to measure agreement. */
    aiDraftUsed: v.optional(v.boolean()),
    aiDraftAwarded: v.optional(v.number()),

    /** Supersession chain instead of edits. */
    supersedesMarkId: v.optional(v.id('marks')),
    supersededAt: v.optional(v.number()),

    createdAt: v.number(),
  })
    .index('by_submission', ['submissionId'])
    .index('by_teacher_created', ['teacherId', 'createdAt'])
    // §13 10% weekly sampling and tag-drift audits
    .index('by_created', ['createdAt']),

  // -------------------------------------------------------------------------
  // prescriptions — server-generated from the catalogue (§7)
  // -------------------------------------------------------------------------
  prescriptions: defineTable({
    submissionId: v.id('submissions'),
    markId: v.id('marks'),
    /** Student-facing, so studentId is fine here — no teacher query reads this table. */
    studentId: v.id('users'),
    items: v.array(
      v.object({
        order: v.number(),
        kind: v.union(
          v.literal('video'),
          v.literal('notes'),
          v.literal('questions'),
          v.literal('explanation') // the §9 fallback when nothing is covered
        ),
        topicCode: v.string(),
        misconceptionCode: v.string(),
        label: v.string(),
        href: v.optional(v.string()),
        estimatedMinutes: v.number(),
        completedAt: v.optional(v.number()),
      })
    ),
    totalEstimatedMinutes: v.number(),
    /** §7 — the single best retention metric. Denormalised for the dashboard. */
    completedItemCount: v.number(),
    createdAt: v.number(),
  })
    .index('by_submission', ['submissionId'])
    .index('by_student_created', ['studentId', 'createdAt']),

  // -------------------------------------------------------------------------
  // misconceptionCatalogue — CLOSED list. Teachers select, never invent (§8)
  // -------------------------------------------------------------------------
  misconceptionCatalogue: defineTable({
    /** e.g. "M4.2-X03". Unique. */
    code: v.string(),
    topicCode: v.string(),
    wrongIdea: v.string(),
    whyWrong: v.string(),
    correctUnderstanding: v.string(),
    /** 1-5, feeds the §8 ranking. */
    severity: v.number(),
    /** `covered` requires a lesson/notes page AND >=3 questions (§9). */
    coverage: v.union(
      v.literal('covered'),
      v.literal('partial'),
      v.literal('uncovered')
    ),
    lessonHref: v.optional(v.string()),
    videoId: v.optional(v.string()),
    questionIds: v.optional(v.array(v.string())),
    /** Proposals sit here as `proposed` until the owner promotes them (§8). */
    state: v.union(
      v.literal('proposed'),
      v.literal('active'),
      v.literal('retired')
    ),
    proposedBy: v.optional(v.id('users')),
    proposedText: v.optional(v.string()),
    promotedBy: v.optional(v.id('users')),
    createdAt: v.number(),
  })
    .index('by_code', ['code'])
    .index('by_topic_state', ['topicCode', 'state'])
    .index('by_state', ['state']),

  // -------------------------------------------------------------------------
  // coverageMisses — a diagnosed gap with no material (§9). The content roadmap
  // -------------------------------------------------------------------------
  coverageMisses: defineTable({
    misconceptionCode: v.string(),
    topicCode: v.string(),
    markId: v.id('marks'),
    /** Kept so §8 can deduplicate by student. Never exposed to a teacher view. */
    studentId: v.id('users'),
    /** Did the student get told + later messaged when the lesson shipped? */
    notifiedAt: v.optional(v.number()),
    resolvedByLessonAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_misconception_created', ['misconceptionCode', 'createdAt'])
    .index('by_topic', ['topicCode'])
    .index('by_created', ['createdAt'])
    .index('by_student', ['studentId']),

  // -------------------------------------------------------------------------
  // creditLedger — append-only double-entry-ish. Balance is a fold, not a field
  // -------------------------------------------------------------------------
  creditLedger: defineTable({
    /** Credits are held by the payer: a guardian, or a self-paying adult student. */
    holderId: v.id('users'),
    /** Who the credit is spendable on. Same as holder for a self-paying student. */
    beneficiaryId: v.id('users'),
    kind: v.union(
      v.literal('purchase'),
      v.literal('grant'), // pilot / goodwill
      v.literal('spend'),
      v.literal('refund'), // SLA miss or identifying-image pull (§5.5, §6)
      v.literal('expiry') // 90 days (§12)
    ),
    /** Signed: +1 purchase, -1 spend. Balance = sum over holder. */
    delta: v.number(),
    submissionId: v.optional(v.id('submissions')),
    /** Paynow/Paystack reference for a purchase. */
    paymentRef: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    reason: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_holder_created', ['holderId', 'createdAt'])
    .index('by_beneficiary_created', ['beneficiaryId', 'createdAt'])
    .index('by_submission', ['submissionId'])
    // expiry sweep
    .index('by_kind_expiry', ['kind', 'expiresAt']),

  // -------------------------------------------------------------------------
  // teacherPayouts — weekly, manual (§13). A statement, not an automation
  // -------------------------------------------------------------------------
  teacherPayouts: defineTable({
    teacherId: v.id('users'),
    periodStart: v.number(),
    periodEnd: v.number(),
    markCount: v.number(),
    fallbackExplanationCount: v.number(),
    /** USD cents. Stored, not recomputed, so a historic statement stays true. */
    amountCents: v.number(),
    ratePerMarkCents: v.number(),
    status: v.union(
      v.literal('draft'),
      v.literal('approved'),
      v.literal('paid'),
      v.literal('disputed')
    ),
    paidAt: v.optional(v.number()),
    paymentRef: v.optional(v.string()),
    approvedBy: v.optional(v.id('users')),
    createdAt: v.number(),
  })
    .index('by_teacher_period', ['teacherId', 'periodStart'])
    .index('by_status', ['status']),

  // -------------------------------------------------------------------------
  // flags — §11.7. Two open flags against a teacher → automatic suspension
  // -------------------------------------------------------------------------
  flags: defineTable({
    kind: v.union(
      v.literal('identifying_image'), // teacher pressed "this looks identifying" (§5.5)
      v.literal('contact_filter'), // server-side filter rejected text (§11.2)
      v.literal('student_report'), // "did a marker ask you to contact them?" (§13)
      v.literal('quality'), // sampling or timeSpentSec < 90 (§13)
      v.literal('safeguarding')
    ),
    /** Free-text never carries names; the raiser is a user id, not a name. */
    raisedBy: v.optional(v.id('users')),
    raisedByRole: roleValidator,
    submissionId: v.optional(v.id('submissions')),
    markId: v.optional(v.id('marks')),
    /** The user the flag is ABOUT. Usually a teacher. */
    subjectUserId: v.optional(v.id('users')),
    detail: v.string(),
    /** Rejected message text, quarantined for review — never delivered. */
    blockedText: v.optional(v.string()),
    status: v.union(
      v.literal('open'),
      v.literal('actioned'),
      v.literal('dismissed')
    ),
    resolvedBy: v.optional(v.id('users')),
    resolutionNote: v.optional(v.string()),
    resolvedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    // the §11.7 auto-suspension check
    .index('by_subject_status', ['subjectUserId', 'status'])
    .index('by_status_created', ['status', 'createdAt'])
    .index('by_submission', ['submissionId']),

  // -------------------------------------------------------------------------
  // auditLog — append-only, exported off-platform weekly (§11)
  // -------------------------------------------------------------------------
  auditLog: defineTable({
    /** Dotted action, e.g. "submission.claim", "identity.reveal", "teacher.verify". */
    action: v.string(),
    actorId: v.optional(v.id('users')),
    actorRole: roleValidator,
    /** Table + id of the thing acted on. Strings so this never constrains schema. */
    targetTable: v.string(),
    targetId: v.string(),
    /** Candidate code where one applies — admin UIs render this, not a student id. */
    candidateCode: v.optional(v.string()),
    metadata: v.optional(v.string()), // JSON blob
    at: v.number(),
    /** Set by the weekly off-platform export so gaps are detectable. */
    exportedAt: v.optional(v.number()),
  })
    .index('by_at', ['at'])
    .index('by_actor_at', ['actorId', 'at'])
    .index('by_action_at', ['action', 'at'])
    .index('by_target', ['targetTable', 'targetId'])
    .index('by_exported', ['exportedAt']),

  // -------------------------------------------------------------------------
  // deanonymisations — the ONLY submission→student join outside server internals
  // -------------------------------------------------------------------------
  deanonymisations: defineTable({
    submissionId: v.id('submissions'),
    candidateCode: v.string(),
    /** Scoped to ONE student (§11). Not a session-wide unmasking. */
    studentId: v.id('users'),
    /** Owner only in Phase 1. Enforced in the mutation, recorded here. */
    actorId: v.id('users'),
    trigger: revealTriggerValidator,
    /** Free text, required, min length enforced in the mutation. */
    reason: v.string(),
    grantedAt: v.number(),
    /** grantedAt + 60 minutes. A read after this is refused. */
    expiresAt: v.number(),
    /** Every read against this grant bumps this, so scope creep is visible. */
    readCount: v.number(),
    /** §11 — student + guardian told within 24h. */
    notifyDueAt: v.number(),
    notifiedAt: v.optional(v.number()),
    /** Suppression needs its own logged reason (§11). */
    notificationSuppressed: v.optional(v.boolean()),
    suppressionReason: v.optional(v.string()),
  })
    .index('by_submission', ['submissionId'])
    .index('by_actor_granted', ['actorId', 'grantedAt'])
    .index('by_student', ['studentId'])
    // the 24h notification sweep
    .index('by_notify_due', ['notifiedAt', 'notifyDueAt']),
});
