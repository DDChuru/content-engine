'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  AuthShell,
  FieldLabel,
  WhyNote,
  buttonClass,
  inputClass,
  secondaryButtonClass,
} from '@/components/auth-shell';
import { RegistrationGate } from '@/components/registration-gate';
import { GUARDIAN_ATTESTATION_STATEMENT } from '@/lib/policy';

export default function GuardianRedeemPage() {
  return (
    <RegistrationGate>
      <Redeem />
    </RegistrationGate>
  );
}

function Redeem() {
  const state = useQuery(api.session.guardianState, {});
  const redeem = useMutation(api.identity.redeemGuardianLinkCode);
  const [code, setCode] = useState('');
  const [attested, setAttested] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  if (state === undefined) return null;
  if (state?.side !== 'guardian') {
    return (
      <AuthShell
        title="This page is for parents and guardians"
        lede="If you are the student, generate a code on your own account instead and read it to the adult."
      >
        <Link href="/account/guardian-link" className={secondaryButtonClass}>
          Create a link code
        </Link>
      </AuthShell>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await redeem({ code, attested });
      setDone(true);
      setCode('');
      setAttested(false);
    } catch (err) {
      // The server answers every failure identically on purpose — a wrong code
      // must not reveal whether a student stands behind it. Do not embellish.
      setError('That code is not valid. Ask the student to generate a new one.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Guardian link"
      title="Redeem a link code"
      lede="The student generates the code and reads it to you. There is deliberately no way to search for a student or invite one by email."
      footer={
        <Link href="/account" className={secondaryButtonClass}>
          Back to your account
        </Link>
      }
    >
      {state.students.length > 0 ? (
        <p className="mb-6 rounded-lg border border-grid-line bg-paper px-3 py-2.5 text-sm text-ink">
          You are already linked to{' '}
          {state.students.map((s) => s.firstName).join(', ')}.
        </p>
      ) : null}

      {done ? (
        <p role="status" className="rounded-lg border border-secure/40 bg-paper px-3 py-2.5 text-sm leading-relaxed text-ink">
          Linked. You can now see the work this student submits for marking and
          the marks that come back. <strong>They have been told this mirror
          exists</strong> — it is not a hidden view, and either of you can end it.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-6">
          <div>
            <FieldLabel htmlFor="code">Link code</FieldLabel>
            <input
              id="code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="G-XXXX-XXXX"
              autoComplete="off"
              spellCheck={false}
              required
              className={`${inputClass} font-mono tracking-[0.08em]`}
            />
            <WhyNote>
              Redeeming records your consent, as the responsible adult, to this
              student&apos;s work being processed for marking. That consent is
              what makes paid marking lawful for anyone under 18 — studying stays
              free and needs none of it.
            </WhyNote>
          </div>

          {/*
            The attestation. It is a real gate — the mutation refuses without it —
            and the sentence is stored with the consent record, because "they
            ticked a box" is not evidence unless the record says which sentence
            the box sat next to. It does not verify anything, and the note below
            says so to the person ticking it rather than only in a comment.
          */}
          <div>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-grid-line bg-paper px-3 py-2.5 text-ink has-[:checked]:border-accent">
              <input
                type="checkbox"
                checked={attested}
                onChange={(e) => setAttested(e.target.checked)}
                className="mt-1 accent-[var(--accent)]"
              />
              <span className="text-sm leading-relaxed">
                {GUARDIAN_ATTESTATION_STATEMENT}
              </span>
            </label>
            <WhyNote>
              We take your word for this — we do not ask anyone for an ID
              document, least of all a child. So the link is recorded as
              <strong> self-declared</strong>, and both you and the student can
              see that word on your account pages. It becomes stronger the first
              time a payment clears in your own name.
            </WhyNote>
          </div>

          {error ? (
            <p role="alert" className="rounded-lg border border-accent/40 bg-accent/5 px-3 py-2.5 text-sm text-ink">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={busy || code.trim() === '' || !attested} className={buttonClass}>
            {busy ? 'Checking…' : 'Link to this student'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
