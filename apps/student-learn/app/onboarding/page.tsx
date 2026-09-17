'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  AuthShell,
  FieldLabel,
  WhyNote,
  buttonClass,
  inputClass,
  secondaryButtonClass,
} from '@/components/auth-shell';
import { GateWaiting } from '@/components/registration-gate';
import { COUNTRIES, PRIVACY_VERSION, TERMS_VERSION } from '@/lib/policy';
import {
  EMPTY_ENROLMENT,
  ExamEnrolmentPicker,
  enrolmentComplete,
  type EnrolmentDraft,
} from '@/components/exam-enrolment-picker';

type Role = 'student' | 'guardian';
type AgeBand = 'under13' | '13-17' | '18plus';

/**
 * The one screen that creates a `users` row. Four questions for a student, two
 * for a guardian, and every one of them says what it is for before it is asked —
 * a student handing over an age band is entitled to know it is what decides
 * whether a guardian has to be involved.
 *
 * Nothing else is collected. No surname, no school, no date of birth, no phone.
 * (REGISTRATION-AND-ROLES.md §1 and PLAN §0 amendment C.)
 */
export default function OnboardingPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const status = useQuery(api.session.status, isAuthenticated ? {} : 'skip');
  const registerSelf = useMutation(api.identity.registerSelf);

  const [role, setRole] = useState<Role | null>(null);
  const [firstName, setFirstName] = useState('');
  const [enrolment, setEnrolment] = useState<EnrolmentDraft>(EMPTY_ENROLMENT);
  const [ageBand, setAgeBand] = useState<AgeBand | ''>('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Already registered — this screen has nothing to ask.
  const alreadyRegistered = status?.registered === true;
  useEffect(() => {
    if (alreadyRegistered) router.replace('/account');
  }, [alreadyRegistered, router]);

  if (isLoading || !isAuthenticated || status === undefined || alreadyRegistered) {
    return <GateWaiting />;
  }

  if (role === null) return <RolePicker onPick={setRole} />;

  const chosenRole: Role = role;
  const isStudent = chosenRole === 'student';
  const under13 = isStudent && ageBand === 'under13';
  // A student answers country inside the picker — it is the first question there,
  // because it decides which boards they are offered. A guardian sits no exam, so
  // they still get the plain country field: we ask it for the privacy regime.
  const effectiveCountry = isStudent ? enrolment.countryCode : country;
  const complete =
    firstName.trim().length > 0 &&
    effectiveCountry !== '' &&
    (!isStudent || (enrolmentComplete(enrolment) && ageBand !== '' && !under13));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await registerSelf({
        role: chosenRole,
        firstName: firstName.trim(),
        ageBand: isStudent ? (ageBand as AgeBand) : undefined,
        enrolment: isStudent
          ? {
              countryCode: enrolment.countryCode,
              bodyId: enrolment.bodyId,
              levelId: enrolment.levelId,
              sessionId: enrolment.sessionId,
              subjectIds: enrolment.subjectIds,
            }
          : undefined,
        country: effectiveCountry,
        termsVersion: TERMS_VERSION,
        privacyVersion: PRIVACY_VERSION,
      });
      router.replace(isStudent ? '/account' : '/guardian/redeem');
    } catch (err) {
      setError(
        err instanceof Error
          ? stripConvexNoise(err.message)
          : 'Something went wrong. Try again.'
      );
      setSaving(false);
    }
  }

  return (
    <AuthShell
      eyebrow={isStudent ? 'Student account' : 'Parent or guardian account'}
      title={
        isStudent
          ? 'Tell us what you are sitting, then you are in'
          : 'Two questions, then you are in'
      }
      lede={
        <>
          Each one is here for a reason, and the reason is written under it. If a
          question has no reason we should not be asking it.{' '}
          <button
            type="button"
            onClick={() => setRole(null)}
            className="font-semibold text-accent underline underline-offset-2"
          >
            Not {isStudent ? 'a student' : 'a guardian'}?
          </button>
        </>
      }
      footer={
        <p>
          Creating the account records that you agreed to the terms
          ({TERMS_VERSION}) and the privacy notice ({PRIVACY_VERSION}). If either
          is reworded we will ask again rather than assume.
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-6">
        <div>
          <FieldLabel htmlFor="firstName">First name</FieldLabel>
          <input
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            maxLength={40}
            autoComplete="given-name"
            required
            className={inputClass}
            placeholder="Tanaka"
          />
          <WhyNote>
            {isStudent ? (
              <>
                So your own screens can talk to a person rather than an account
                number, and so an adult you link sees who they just linked to. A
                teacher marking your work never sees it. We do not ask for your
                surname, your school, or your date of birth.
              </>
            ) : (
              <>
                So the student you link to can see who redeemed their code. It is
                shown to them and to nobody else.
              </>
            )}
          </WhyNote>
        </div>

        {isStudent ? (
          <>
            <ExamEnrolmentPicker value={enrolment} onChange={setEnrolment} />

            <fieldset>
              <legend className="block text-sm font-semibold text-ink">Age band</legend>
              <div className="mt-2 space-y-2">
                {(
                  [
                    ['under13', 'Under 13'],
                    ['13-17', '13 to 17'],
                    ['18plus', '18 or over'],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-grid-line bg-paper px-3 py-2.5 text-ink has-[:checked]:border-accent"
                  >
                    <input
                      type="radio"
                      name="ageBand"
                      value={value}
                      checked={ageBand === value}
                      onChange={() => setAgeBand(value)}
                      className="accent-[var(--accent)]"
                      required
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
              <WhyNote>
                This is what decides whether a parent or guardian has to be
                involved before you can pay for marked work. Under both South
                African and Zimbabwean law, a person under 18 cannot give that
                consent alone. A band is enough to answer it — a full date of
                birth would identify you far more precisely and tell us nothing
                extra, so we do not ask for one. We take your word for it: we will
                never ask a child for an ID document.
              </WhyNote>
              {under13 ? (
                <p className="mt-3 rounded-lg border border-accent/40 bg-accent/5 px-3 py-2.5 text-sm text-ink">
                  This service is for students aged 13 and over. The syllabus is A
                  Level, and handling under-13 data properly means collecting more
                  about you, not less. Please come back when you start your A Levels.
                </p>
              ) : null}
            </fieldset>
          </>
        ) : null}

        {!isStudent ? (
        <div>
          <FieldLabel htmlFor="country">Country</FieldLabel>
          <select
            id="country"
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className={inputClass}
          >
            <option value="">Choose a country…</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <WhyNote>
            Which privacy law protects you depends on where you are — South
            Africa&apos;s POPIA and Zimbabwe&apos;s Data Protection Act differ on
            consent age and on what has to happen after a breach. We ask instead of
            guessing from your IP address, because guessing is both less accurate
            and more intrusive.
          </WhyNote>
        </div>
        ) : (
          <p className="text-[0.8rem] leading-relaxed text-ink-muted">
            The country you gave above does two jobs: it decides which exam boards
            you are offered, and it decides which privacy law protects you — South
            Africa&apos;s POPIA and Zimbabwe&apos;s Data Protection Act differ on
            consent age and on what has to happen after a breach. We ask instead of
            guessing from your IP address, because guessing is both less accurate
            and more intrusive.
          </p>
        )}

        {error ? (
          <p role="alert" className="rounded-lg border border-accent/40 bg-accent/5 px-3 py-2.5 text-sm text-ink">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={!complete || saving} className={buttonClass}>
          {saving ? 'Creating your account…' : 'Create my account'}
        </button>
      </form>
    </AuthShell>
  );
}

function RolePicker({ onPick }: { onPick: (r: Role) => void }) {
  return (
    <AuthShell
      eyebrow="One more thing"
      title="Who is this account for?"
      lede="Students and guardians see different things. A guardian account cannot see a student's work until that student hands them a link code."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => onPick('student')} className={buttonClass}>
          I am the student
        </button>
        <button
          type="button"
          onClick={() => onPick('guardian')}
          className={secondaryButtonClass}
        >
          I am a parent or guardian
        </button>
      </div>
      <p className="mt-4 text-[0.8rem] leading-relaxed text-ink-muted">
        Teachers are not created here. Marking is done by people verified by hand
        against ID and a credential, so there is no button that makes you one.
      </p>
    </AuthShell>
  );
}

/** Convex prefixes server errors with stack noise; students should not read it. */
function stripConvexNoise(message: string): string {
  const m = message.match(/Uncaught \w*Error:\s*([^\n]+)/);
  return (m?.[1] ?? message).replace(/\s*at handler.*$/, '').trim();
}
