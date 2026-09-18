'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { BrandLogo } from '@/components/brand-logo';
import { GateWaiting } from '@/components/registration-gate';
import { liveTopics } from '@/lib/syllabus';

/**
 * The fork in the road, and nothing else.
 *
 * Signed out, this is the public front door: study is free and anonymous, so it
 * has to open straight onto the library without asking for anything. Signed in, a
 * student belongs at `/study`, which knows their subjects and their sitting — the
 * whole point of the through-line is that a registered student never lands on a
 * page that has not heard of their enrolment.
 */
export default function HomePage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const status = useQuery(api.session.status, isAuthenticated ? {} : 'skip');

  const destination =
    status === undefined
      ? null
      : !status.signedIn
        ? null
        : !status.registered
          ? '/onboarding'
          : status.user?.role === 'student'
            ? '/study'
            : '/account';

  useEffect(() => {
    if (destination) router.replace(destination);
  }, [destination, router]);

  if (isLoading) return <GateWaiting />;
  if (isAuthenticated && (status === undefined || destination)) return <GateWaiting />;

  return <PublicLanding />;
}

function PublicLanding() {
  const count = liveTopics().length;
  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-14 sm:pt-20">
      <BrandLogo variant="wordmark" theme="light" className="mb-6" />

      <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
        Cambridge International A Level Mathematics 9709
      </p>
      <h1 className="mt-3 font-heading text-4xl font-semibold leading-[1.1] sm:text-5xl">
        Notes you can be{' '}
        <span className="relative whitespace-nowrap text-accent">
          wrong
          {/* A hand-ruled underline: the mark a teacher makes, not a highlighter. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 120 10"
            preserveAspectRatio="none"
            className="absolute inset-x-0 -bottom-1 h-[0.4em] w-full"
          >
            <path
              d="M2 7 C 28 3, 58 8, 118 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.45"
            />
          </svg>
        </span>{' '}
        in.
      </h1>
      <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink-muted">
        Every topic is a short explainer, tight notes, and a model you have to
        commit a guess to before it will move. Being wrong on purpose is the
        lesson — it is the bit that sticks.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/syllabus"
          className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-accent px-5 text-center font-semibold text-white transition-colors hover:bg-accent-pressed"
        >
          Start studying — free, no account
        </Link>
        <Link
          href="/sign-up"
          className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-grid-line bg-paper-raised px-5 text-center font-semibold text-ink transition-colors hover:border-accent"
        >
          Create an account
        </Link>
      </div>
      <p className="mt-3 text-sm text-ink-muted">
        {count} topics are written today. An account is for keeping your place
        across devices and telling us which sitting you are working towards — it
        is not a paywall on the notes.
      </p>

      <section className="mt-14 border-t border-grid-line pt-8">
        <h2 className="font-heading text-xl font-semibold">Three you can try right now</h2>
        <p className="mt-2 max-w-[60ch] text-ink-muted">
          Friction that takes only what it needs. The slope where everyone puts the
          sine in the wrong place. The pulley where the hanging mass is not falling
          freely. Each one asks you to predict first.
        </p>
        <Link
          href="/notes/interactive-preview"
          className="mt-4 inline-flex min-h-[44px] items-center font-semibold text-accent underline underline-offset-4"
        >
          Open the three models →
        </Link>
      </section>

      <p className="mt-14 text-sm text-ink-muted">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-semibold text-accent underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </main>
  );
}
