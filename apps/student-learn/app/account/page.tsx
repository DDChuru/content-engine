'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { SignOutButton } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { AuthShell, secondaryButtonClass } from '@/components/auth-shell';
import { RegistrationGate } from '@/components/registration-gate';
import { COUNTRIES } from '@/lib/policy';

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
        {isStudent ? <Row label="Exam year" value={user.yearGroup ?? '—'} /> : null}
        {isStudent ? <Row label="Age band" value={ageBandLabel(user.ageBand)} /> : null}
        <Row label="Country" value={countryLabel(user.country)} />
      </dl>

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
          <StudentGuardianSummary linked={guardian.linked} isMinor={user.isMinor} />
        ) : guardian?.side === 'guardian' ? (
          <GuardianSummary students={guardian.students} />
        ) : null}
      </section>
    </AuthShell>
  );
}

function StudentGuardianSummary({ linked, isMinor }: { linked: boolean; isMinor: boolean }) {
  return (
    <>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {linked
          ? 'A parent or guardian has redeemed one of your codes. They can see the work you submit for marking and the marks that come back. You were both told this at the moment it started, and either of you can end it.'
          : 'No parent or guardian is linked to your account. Nobody can see your work.'}
      </p>
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

function GuardianSummary({
  students,
}: {
  students: { firstName: string; redeemedAt: number | null }[];
}) {
  return (
    <>
      {students.length === 0 ? (
        <p className="mt-2 text-sm text-ink-muted">
          You are not linked to any student yet. Ask them to generate a code on
          their own account and read it to you.
        </p>
      ) : (
        <ul className="mt-2 space-y-1 text-sm text-ink">
          {students.map((s, i) => (
            <li key={i}>
              {s.firstName}
              {s.redeemedAt ? (
                <span className="text-ink-muted">
                  {' '}
                  — linked {new Date(s.redeemedAt).toLocaleDateString()}
                </span>
              ) : null}
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
