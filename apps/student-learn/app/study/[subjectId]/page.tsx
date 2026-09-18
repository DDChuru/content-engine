'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AppBar } from '@/components/app-bar';
import { RegistrationGate } from '@/components/registration-gate';
import { MasteryBadge } from '@/components/mastery-badge';
import { useSkillStates } from '@/components/use-progress';
import {
  artifactForTopic,
  liveTopicsForSubject,
  topicHref,
  unitsForSubject,
} from '@/lib/topics';

/**
 * One subject of a student's enrolment, opened out into its syllabus.
 *
 * This is the middle of the through-line and the step that was missing: the
 * registration flow knew the subject, the syllabus map knew the topics, and
 * nothing joined them. `lib/topics.ts` is that join; this page renders it.
 *
 * The honest-empty case is a first-class branch, not a fallback. A student who
 * enrolled in Biology gets told we have not written Biology — with the reason and
 * what happens next — rather than a heading over an empty list.
 */
export default function SubjectPage() {
  return (
    <RegistrationGate>
      <Subject />
    </RegistrationGate>
  );
}

function Subject() {
  const params = useParams<{ subjectId: string }>();
  const subjectId = decodeURIComponent(params.subjectId);
  const status = useQuery(api.session.status, {});
  const enrolment = status?.registered ? (status.user?.enrolment ?? null) : null;

  const enrolled = enrolment?.subjects.find((s) => s.subjectId === subjectId) ?? null;
  const units = unitsForSubject(subjectId);
  const topics = liveTopicsForSubject(subjectId);
  const states = useSkillStates(topics.map((t) => t.topic.code));

  const title = enrolled?.title ?? subjectId;
  const secure = topics.filter((t) => states[t.topic.code] === 'secure').length;

  if (status === undefined) return null;

  // Not on their enrolment. Said plainly, and not treated as an error — the whole
  // map is public, so there is somewhere better to send them than a 404.
  if (!enrolled) {
    return (
      <>
        <AppBar crumbs={[{ label: 'Study', href: '/study' }]} />
        <main className="mx-auto max-w-2xl px-5 py-16">
          <h1 className="font-heading text-2xl font-semibold">
            That subject is not on your enrolment.
          </h1>
          <p className="mt-3 text-ink-muted">
            You are registered for{' '}
            {enrolment?.subjects.map((s) => s.title).join(', ') || 'nothing yet'}. You
            can change what you are sitting on your account, and the whole library is
            readable either way.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-5">
            <Link href="/account" className="font-semibold text-accent underline underline-offset-4">
              Change my subjects →
            </Link>
            <Link href="/syllabus" className="font-semibold text-accent underline underline-offset-4">
              Browse the whole map →
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (topics.length === 0) {
    return (
      <>
        <AppBar crumbs={[{ label: 'Study', href: '/study' }, { label: title }]} />
        <main className="mx-auto max-w-2xl px-5 py-16">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
            {enrolment?.label}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold">{title}</h1>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink">
            We have not written a single topic of this yet, and there is nothing
            behind this page pretending otherwise.
          </p>
          <p className="mt-4 max-w-[60ch] text-ink-muted">
            Your pick was recorded when you registered. It is not filed away — it is
            the list we write from, in the order students ask for subjects, and you
            will hear from us when the first topic of {title} is ready. In the
            meantime the one subject that is written is open to you whether you are
            sitting it or not.
          </p>
          <Link
            href="/syllabus"
            className="mt-6 inline-flex min-h-[44px] items-center font-semibold text-accent underline underline-offset-4"
          >
            Open the 9709 Mathematics map →
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <AppBar crumbs={[{ label: 'Study', href: '/study' }, { label: title }]} />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
          {enrolment?.label}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-ink-muted">
          {secure} of {topics.length} written topics secure. Work down the list — it is
          in syllabus order, and each topic is a video, the notes, and where there is
          one, a model to be wrong in.
        </p>

        {units.map((unit) => {
          const live = unit.topics.filter((t) => t.live);
          const dormant = unit.topics.filter((t) => !t.live);
          return (
            <section key={unit.code} aria-labelledby={`u-${unit.code}`} className="mt-12">
              <h2
                id={`u-${unit.code}`}
                className="flex items-baseline gap-3 border-b border-grid-line pb-2 font-heading text-xl font-semibold"
              >
                <span aria-hidden="true" className="font-mono text-xs text-ink-muted">
                  {unit.code}
                </span>
                {unit.title}
                <span className="ml-auto shrink-0 text-xs font-normal uppercase tracking-[0.18em] text-ink-muted">
                  {unit.paper}
                </span>
              </h2>

              {live.length === 0 ? (
                <p className="mt-3 text-sm text-ink-muted">
                  Nothing written in this unit yet.
                </p>
              ) : (
                <ol className="divide-y divide-grid-line">
                  {live.map((topic) => {
                    const artifact = artifactForTopic(topic.code);
                    return (
                      <li key={topic.code}>
                        <Link
                          href={topicHref(topic)}
                          className="group flex min-h-[52px] items-center gap-3 py-3 transition-colors hover:bg-paper-raised"
                        >
                          <span
                            aria-hidden="true"
                            className="w-14 shrink-0 font-mono text-xs text-ink-muted"
                          >
                            {topic.code}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium underline-offset-4 group-hover:text-accent group-hover:underline">
                              {topic.title}
                            </span>
                            {artifact ? (
                              <span className="mt-0.5 block text-xs text-accent">
                                has a model you can be wrong in
                              </span>
                            ) : null}
                          </span>
                          <MasteryBadge
                            state={states[topic.code] ?? 'not-started'}
                            drawKey={topic.code}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              )}

              {dormant.length > 0 ? (
                <p className="mt-3 text-sm text-ink-muted">
                  Still to be written: {dormant.map((t) => t.title).join(', ')}.
                </p>
              ) : null}
            </section>
          );
        })}
      </main>
    </>
  );
}
