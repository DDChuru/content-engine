'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AppBar } from '@/components/app-bar';
import { RegistrationGate } from '@/components/registration-gate';
import { useSkillStates } from '@/components/use-progress';
import { liveTopicsForSubject, subjectHasContent, topicHref } from '@/lib/topics';

/**
 * Where a student lands. The first screen in the app that has read their
 * enrolment.
 *
 * It answers three questions in the order a student asks them: how long have I
 * got, what am I sitting, and what do I open now. Everything on it is derived —
 * the countdown from the series' exam month, the subject rows from the enrolment,
 * the "carry on" row from their own progress. There is no editorial copy here
 * that would go stale.
 */
export default function StudyHomePage() {
  return (
    <RegistrationGate>
      <StudyHome />
    </RegistrationGate>
  );
}

function StudyHome() {
  const status = useQuery(api.session.status, {});
  const user = status?.registered ? status.user : null;
  const enrolment = user?.enrolment ?? null;

  const sessionData = useQuery(
    api.examCatalogue.sessions,
    enrolment ? { bodyId: enrolment.bodyId, levelId: enrolment.levelId } : 'skip'
  );

  const subjects = enrolment?.subjects ?? [];
  const withContent = subjects.filter((s) => subjectHasContent(s.subjectId));
  const withoutContent = subjects.filter((s) => !subjectHasContent(s.subjectId));

  // Every live topic across every subject they can actually study, in order.
  const allTopics = withContent.flatMap((s) =>
    liveTopicsForSubject(s.subjectId).map((t) => ({ ...t, subjectId: s.subjectId }))
  );
  const states = useSkillStates(allTopics.map((t) => t.topic.code));
  const secure = allTopics.filter((t) => states[t.topic.code] === 'secure').length;
  const started = allTopics.filter(
    (t) => states[t.topic.code] && states[t.topic.code] !== 'not-started'
  ).length;
  // The next thing to open: the first topic in syllabus order they have not made
  // secure. Not "most recent" — a student returning wants the front of the queue,
  // and the queue is the syllabus.
  const next = allTopics.find((t) => states[t.topic.code] !== 'secure') ?? null;

  // The countdown, and the series' own words for itself. `sessionSeries` is a
  // slug ("november", "may-june") and printing a slug at a student is how "44 days
  // until the november 2026 papers" happened; the catalogue holds the title.
  const series = sessionData?.series.find((s) => s.id === enrolment?.sessionSeries) ?? null;
  const daysToExam = (() => {
    if (!enrolment || !series) return null;
    const first = new Date(Date.UTC(enrolment.sessionYear, series.examMonth - 1, 1));
    const days = Math.round((first.getTime() - Date.now()) / 86_400_000);
    return days > 0 ? days : null;
  })();

  // A guardian has no enrolment and no study home; send them where they belong
  // rather than rendering an empty version of somebody else's screen.
  if (user && user.role !== 'student') {
    return (
      <>
        <AppBar />
        <main className="mx-auto max-w-2xl px-5 py-16">
          <h1 className="font-heading text-2xl font-semibold">This screen is a student&apos;s.</h1>
          <p className="mt-3 text-ink-muted">
            Your account is a guardian account, so there is no sitting or syllabus
            attached to it.
          </p>
          <Link
            href="/account"
            className="mt-6 inline-flex font-semibold text-accent underline underline-offset-4"
          >
            Go to your account →
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <AppBar action={{ label: 'Account', href: '/account' }} />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
          {enrolment?.label ?? 'Your sitting'}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight sm:text-4xl">
          {user?.firstName ? `Right then, ${user.firstName}.` : 'Right then.'}
        </h1>

        {/* The countdown. A ruled bar, because a number alone does not feel like time. */}
        {daysToExam !== null && enrolment ? (
          <div className="mt-5 rounded-xl border border-grid-line bg-paper-raised px-4 py-3">
            <p className="text-sm text-ink">
              <span className="font-mono text-lg font-semibold text-accent">{daysToExam}</span>{' '}
              days until the {series?.title ?? enrolment.sessionSeries} {enrolment.sessionYear}{' '}
              papers start.
            </p>
            <WeeksRule days={daysToExam} />
          </div>
        ) : null}

        {/* Carry on. The single largest thing on the page, on purpose. */}
        {next ? (
          <Link
            href={topicHref(next.topic)}
            className="mt-6 block rounded-xl border border-accent/40 bg-[color-mix(in_srgb,var(--accent)_5%,var(--paper-raised))] px-5 py-5 transition-colors hover:border-accent"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              {started === 0 ? 'Start here' : 'Carry on'}
            </p>
            <p className="mt-1.5 font-heading text-xl font-semibold leading-snug text-ink">
              {next.topic.title}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              <span className="font-mono">{next.topic.code}</span> · {next.unit.title} ·{' '}
              {next.unit.paper}
            </p>
          </Link>
        ) : allTopics.length > 0 ? (
          <p className="mt-6 rounded-xl border border-secure/40 bg-paper-raised px-5 py-5 text-ink">
            Every written topic is secure. That is the whole library as it stands —
            more is being written.
          </p>
        ) : null}

        {allTopics.length > 0 ? (
          <p className="mt-4 text-sm text-ink-muted">
            {secure} of {allTopics.length} topics secure
            {started > secure ? `, ${started - secure} on the go` : ''}.
          </p>
        ) : null}

        {/* Subjects. The enrolment, made navigable. */}
        <section className="mt-12">
          <h2 className="border-b border-grid-line pb-2 font-heading text-lg font-semibold">
            Your subjects
          </h2>
          <ul className="mt-4 space-y-3">
            {withContent.map((s) => {
              const topics = liveTopicsForSubject(s.subjectId);
              const done = topics.filter((t) => states[t.topic.code] === 'secure').length;
              return (
                <li key={s.subjectId}>
                  <Link
                    href={`/study/${encodeURIComponent(s.subjectId)}`}
                    className="group flex items-center gap-3 rounded-xl border border-grid-line bg-paper-raised px-4 py-4 transition-colors hover:border-accent"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink group-hover:text-accent">
                        {s.title}
                        {s.code ? (
                          <span className="ml-1.5 font-mono text-xs font-normal text-ink-muted">
                            {s.code}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-sm text-ink-muted">
                        {topics.length} topics written · {done} secure
                      </span>
                      <ProgressRule done={done} total={topics.length} />
                    </span>
                    <span aria-hidden="true" className="text-ink-muted group-hover:text-accent">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}

            {/* Said plainly, not hidden and not dressed up as a shell. */}
            {withoutContent.map((s) => (
              <li
                key={s.subjectId}
                className="rounded-xl border border-dashed border-grid-line px-4 py-4"
              >
                <p className="font-semibold text-ink-muted">
                  {s.title}
                  {s.code ? (
                    <span className="ml-1.5 font-mono text-xs font-normal">{s.code}</span>
                  ) : null}
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  We have not written this one yet. Your pick is recorded and it is
                  how we decide what to write next — there is nothing to open here,
                  and we would rather say so than show you an empty shelf.
                </p>
              </li>
            ))}
          </ul>

          {subjects.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">
              No subjects on your enrolment yet.{' '}
              <Link href="/account" className="font-semibold text-accent underline underline-offset-4">
                Add them on your account
              </Link>
              .
            </p>
          ) : null}
        </section>

        <p className="mt-10 text-sm text-ink-muted">
          Browsing something outside your subjects?{' '}
          <Link href="/syllabus" className="font-semibold text-accent underline underline-offset-4">
            The whole 9709 map is open
          </Link>
          .
        </p>
      </main>
    </>
  );
}

/** Weeks left, drawn as ruled ticks. Ten weeks per row, so it reads at a glance. */
function WeeksRule({ days }: { days: number }) {
  const weeks = Math.min(Math.ceil(days / 7), 60);
  return (
    <div
      className="mt-2 flex flex-wrap gap-[3px]"
      role="img"
      aria-label={`About ${weeks} weeks left`}
    >
      {Array.from({ length: weeks }, (_, i) => (
        <span
          key={i}
          className="h-3 w-[3px] rounded-full"
          style={{
            background:
              i < 8 ? 'var(--accent)' : 'color-mix(in srgb, var(--ink-muted) 35%, transparent)',
          }}
        />
      ))}
    </div>
  );
}

function ProgressRule({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <span
      className="mt-2 block h-1 w-full overflow-hidden rounded-full bg-grid-line"
      role="img"
      aria-label={`${pct} per cent secure`}
    >
      <span
        className="block h-full rounded-full bg-secure transition-[width] duration-500 ease-out-quart"
        style={{ width: `${pct}%` }}
      />
    </span>
  );
}
