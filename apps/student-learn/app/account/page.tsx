'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { SignOutButton } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { AuthShell, secondaryButtonClass } from '@/components/auth-shell';
import { RegistrationGate } from '@/components/registration-gate';
import { COUNTRIES } from '@/lib/policy';
import { AVAILABILITY_LABEL } from '@/lib/exam-catalogue';

export default function AccountPage() {
  return (
    <RegistrationGate>
      <Account />
    </RegistrationGate>
  );
}

function Account() {
  const status = useQuery(api.session.status, {});
  const guardian = useQuery(api.session.guardianState, {});
  const user = status?.user;
  if (!user) return null;

  const isStudent = user.role === 'student';

  return (
    <AuthShell
      eyebrow="Your account"
      title={`Hello, ${user.firstName}`}
      lede="Everything we hold about you is on this page. There is no second list."
      footer={
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className={secondaryButtonClass}>
            Back to studying
          </Link>
          <SignOutButton redirectUrl="/">
            <button type="button" className={secondaryButtonClass}>
              Sign out
            </button>
          </SignOutButton>
        </div>
      }
    >
      <dl className="divide-y divide-grid-line border-y border-grid-line">
        <Row label="First name" value={user.firstName} />
        <Row label="Account type" value={user.role === 'guardian' ? 'Parent or guardian' : 'Student'} />
        {isStudent ? (
          <Row
            label="Sitting"
            // Built server-side from the catalogue tables (convex/session.ts).
            value={user.enrolment?.label ?? '—'}
          />
        ) : null}
        {isStudent ? <Row label="Age band" value={ageBandLabel(user.ageBand)} /> : null}
        <Row label="Country" value={countryLabel(user.country)} />
      </dl>

      {isStudent && user.enrolment ? (
        <section className="mt-6">
          <h2 className="font-heading text-lg font-semibold text-ink">Your subjects</h2>
          <ul className="mt-2 space-y-1.5">
            {user.enrolment.subjects.map((s) => (
              <li key={s.subjectId} className="text-sm text-ink">
                <span className="font-semibold">{s.title}</span>
                {s.code ? <span className="text-ink-muted"> {s.code}</span> : null}
                <span className="block text-[0.8rem] text-ink-muted">
                  {AVAILABILITY_LABEL[s.availability]}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.8rem] leading-relaxed text-ink-muted">
            Where a subject is not ready, we have recorded that you asked for it.
            That list is what decides the order things get written in, and you
            will be told when one of yours lands.
          </p>
        </section>
      ) : null}

      <p className="mt-4 text-[0.8rem] leading-relaxed text-ink-muted">
        Not held: your surname, your school, your date of birth, your address or
        your phone number. Your sign-in email lives with Clerk, our sign-in
        provider, and is mirrored here only for adults who have to be contacted.
      </p>

      <section className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-ink">
          {isStudent ? 'Your guardian link' : 'Students you are linked to'}
        </h2>

        {guardian === undefined ? (
          <p className="mt-2 text-sm text-ink-muted">Loading…</p>
        ) : guardian?.side === 'student' ? (
          <StudentGuardianSummary
            linked={guardian.linked}
            isMinor={user.isMinor}
            links={guardian.codes}
          />
        ) : guardian?.side === 'guardian' ? (
          <GuardianSummary students={guardian.students} />
        ) : null}
      </section>

      <RevealNotices />
    </AuthShell>
  );
}

function StudentGuardianSummary({
  linked,
  isMinor,
  links,
}: {
  linked: boolean;
  isMinor: boolean;
  links: {
    linkId: string;
    guardianFirstName: string | null;
    redeemedAt: number | null;
    revokedAt: number | null;
    assuranceLevel: string | null;
    state: string;
  }[];
}) {
  const live = links.filter((l) => l.state === 'redeemed');
  return (
    <>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {linked
          ? 'A parent or guardian has redeemed one of your codes. They can see the work you submit for marking and the marks that come back. You were both told this at the moment it started, and either of you can end it.'
          : 'No parent or guardian is linked to your account. Nobody can see your work.'}
      </p>

      {/*
        WHO, not merely WHETHER. A student who reads a code to the wrong person
        could previously see only that someone had used it — which is a link they
        can neither identify nor, before `revokeGuardianLink` existed, end.
      */}
      {live.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {live.map((l) => (
            <li
              key={l.linkId}
              className="rounded-lg border border-grid-line bg-paper px-3 py-2.5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-ink">
                  {l.guardianFirstName ?? 'A guardian'}
                </span>
                <span className="text-xs text-ink-muted">
                  linked{' '}
                  {l.redeemedAt ? new Date(l.redeemedAt).toLocaleDateString() : '—'}
                </span>
              </div>
              <AssuranceNote level={l.assuranceLevel} />
              <RevokeButton linkId={l.linkId} label="End this link" />
            </li>
          ))}
        </ul>
      ) : null}

      {isMinor && !linked ? (
        <p className="mt-3 rounded-lg border border-grid-line bg-paper px-3 py-2.5 text-sm leading-relaxed text-ink">
          Studying stays free and needs nobody&apos;s permission. But because you
          are under 18, <strong>paying to have your work marked will need a linked
          guardian first</strong> — taking money and a photograph of a child&apos;s
          work is not something you can agree to on your own.
        </p>
      ) : null}
      <Link href="/account/guardian-link" className={`${secondaryButtonClass} mt-4`}>
        {linked ? 'Manage link codes' : 'Create a link code'}
      </Link>
    </>
  );
}

/**
 * The honest label. `self_declared` is what a redeemed code can ever establish,
 * and saying so on both parties' screens is the point of recording it: a student
 * is entitled to know the platform did not check who that adult is, and a
 * guardian is entitled to know their link is not treated as verified.
 */
function AssuranceNote({ level }: { level: string | null }) {
  if (level === 'payment_verified') {
    return (
      <p className="mt-1 text-[0.8rem] leading-relaxed text-ink-muted">
        <strong className="text-ink">Payment-verified.</strong> A payment cleared
        in this adult&apos;s own name, which is a stronger check than a tick-box.
      </p>
    );
  }
  return (
    <p className="mt-1 text-[0.8rem] leading-relaxed text-ink-muted">
      <strong className="text-ink">Self-declared.</strong> They confirmed they are
      the responsible adult and we took their word for it — we never ask a child
      for an ID document. Nothing here has been verified.
    </p>
  );
}

function RevokeButton({ linkId, label }: { linkId: string; label: string }) {
  const revoke = useMutation(api.identity.revokeGuardianLink);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="mt-2 text-[0.8rem] font-semibold text-accent underline underline-offset-2"
      >
        {label}
      </button>
    );
  }
  return (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await revoke({ linkId: linkId as Id<'guardianLinks'> });
          } finally {
            setBusy(false);
            setConfirming(false);
          }
        }}
        className="text-[0.8rem] font-semibold text-accent underline underline-offset-2"
      >
        {busy ? 'Ending…' : 'Yes, end it now'}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-[0.8rem] text-ink-muted underline underline-offset-2"
      >
        Keep it
      </button>
    </div>
  );
}

/**
 * §11 — "student and guardian told within 24 hours naming the trigger". This is
 * where they are told. The notice is written the moment the grant is made, by a
 * scheduled function, and it says which enumerated reason applied. It does not
 * quote the written reason: in a safeguarding case that text can name somebody
 * else.
 *
 * The list is PAGINATED, and the copy below only claims what the page can
 * actually deliver. It used to render the newest twenty with no way to reach the
 * twenty-first while telling the reader every look-up was shown — which made the
 * sentence false and, worse, made the control defeasible: twenty further grants
 * push the one that mattered off the only page anyone can see. Nothing here
 * truncates the history now.
 */
function RevealNotices() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.session.revealNotices,
    {},
    { initialNumItems: 20 }
  );
  const markSeen = useMutation(api.session.markRevealNoticesSeen);

  // Which ones were unseen WHEN THE PAGE LOADED. Held in a ref because stamping
  // them immediately would otherwise make the "new" marker flicker out from
  // under the reader's eyes on the next reactive update.
  const wasUnseen = useRef<Set<string>>(new Set());
  const stamped = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fresh = results.filter((n) => !n.seenAt && !stamped.current.has(n.id));
    if (fresh.length === 0) return;
    for (const n of fresh) {
      wasUnseen.current.add(n.id);
      stamped.current.add(n.id);
    }
    void markSeen({ ids: fresh.map((n) => n.id as Id<'revealNotices'>) });
  }, [results, markSeen]);

  if (results.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="font-heading text-lg font-semibold text-ink">
        When your identity was looked at
      </h2>
      <ul className="mt-2 space-y-2">
        {results.map((n) => (
          <li
            key={n.id}
            className="rounded-lg border border-accent/40 bg-accent/5 px-3 py-2.5 text-sm leading-relaxed text-ink"
          >
            {wasUnseen.current.has(n.id) ? (
              <span className="mr-2 rounded bg-accent px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-paper">
                New
              </span>
            ) : null}
            On {new Date(n.grantedAt).toLocaleDateString()}, the name behind{' '}
            {n.about === 'you' ? 'your' : 'this student\u2019s'} marked work was
            unmasked for: <strong>{REVEAL_TRIGGER_LABEL[n.trigger] ?? n.trigger}</strong>.
            Every such look-up is logged, lasts one hour, and covers one student.
          </li>
        ))}
      </ul>
      {status === 'CanLoadMore' ? (
        <button
          type="button"
          onClick={() => loadMore(20)}
          className={`${secondaryButtonClass} mt-3`}
        >
          Show earlier look-ups
        </button>
      ) : null}
      {status === 'LoadingMore' ? (
        <p className="mt-3 text-sm text-ink-muted">Loading…</p>
      ) : null}
      {status === 'Exhausted' ? (
        <p className="mt-3 text-sm text-ink-muted">
          That is the complete list. Nothing is hidden behind a limit.
        </p>
      ) : null}
    </section>
  );
}

const REVEAL_TRIGGER_LABEL: Record<string, string> = {
  safeguarding_flag: 'a safeguarding concern',
  payment_dispute: 'a payment dispute',
  legal_request: 'a legal request',
  student_or_guardian_request: 'a request from you or your guardian',
  account_recovery: 'account recovery',
};

function GuardianSummary({
  students,
}: {
  students: {
    linkId: string;
    firstName: string;
    redeemedAt: number | null;
    assuranceLevel: string | null;
  }[];
}) {
  return (
    <>
      {students.length === 0 ? (
        <p className="mt-2 text-sm text-ink-muted">
          You are not linked to any student yet. Ask them to generate a code on
          their own account and read it to you.
        </p>
      ) : (
        <ul className="mt-2 space-y-2">
          {students.map((s) => (
            <li
              key={s.linkId}
              className="rounded-lg border border-grid-line bg-paper px-3 py-2.5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-ink">{s.firstName}</span>
                {s.redeemedAt ? (
                  <span className="text-xs text-ink-muted">
                    linked {new Date(s.redeemedAt).toLocaleDateString()}
                  </span>
                ) : null}
              </div>
              <AssuranceNote level={s.assuranceLevel} />
              <RevokeButton linkId={s.linkId} label="End this link" />
            </li>
          ))}
        </ul>
      )}
      <Link href="/guardian/redeem" className={`${secondaryButtonClass} mt-4`}>
        Redeem a link code
      </Link>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}

function ageBandLabel(band: string | null): string {
  if (band === 'under13') return 'Under 13';
  if (band === '13-17') return '13 to 17';
  if (band === '18plus') return '18 or over';
  return '—';
}

function countryLabel(code: string | null): string {
  return COUNTRIES.find((c) => c.code === code)?.label ?? code ?? '—';
}
