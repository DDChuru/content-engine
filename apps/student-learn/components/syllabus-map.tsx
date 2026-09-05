'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MasteryBadge } from '@/components/mastery-badge';
import { progress, type SkillState } from '@/lib/progress';
import { COURSE, FUTURE_UNITS, UNITS, liveTopics, type SyllabusTopic } from '@/lib/syllabus';

/** Topic/unit code in the margin column; inline prefix below lg. */
function MarginCode({ code }: { code: string }) {
  return (
    <span
      className="w-12 shrink-0 font-mono text-xs text-ink-muted lg:absolute lg:-left-24 lg:top-1/2 lg:w-[4.5rem] lg:-translate-y-1/2 lg:text-right"
      aria-hidden="true"
    >
      {code}
    </span>
  );
}

function TopicRow({ topic, state }: { topic: SyllabusTopic; state: SkillState }) {
  if (!topic.live) {
    return (
      <div className="flex min-h-[44px] items-center gap-3 py-3 pr-1">
        <MarginCode code={topic.code} />
        <span className="flex-1 text-ink-muted">{topic.title}</span>
        <span className="text-xs text-ink-muted">coming soon</span>
      </div>
    );
  }
  const href = topic.href ?? `/lesson/${topic.code}`;
  return (
    <Link
      href={href}
      className="group flex min-h-[44px] items-center gap-3 py-3 pr-1 transition-colors duration-150 ease-out-quart hover:bg-paper-raised"
    >
      <MarginCode code={topic.code} />
      <span className="flex-1 font-medium underline-offset-4 group-hover:text-accent group-hover:underline group-active:text-accent-pressed">
        {topic.title}
        {topic.hint && <span className="ml-2 text-xs font-normal text-ink-muted">{topic.hint}</span>}
      </span>
      {topic.kind === 'notes' ? (
        <span className="text-xs text-ink-muted">video · notes</span>
      ) : (
        <MasteryBadge state={state} drawKey={topic.code} />
      )}
    </Link>
  );
}

export function SyllabusMap({ hasIllustration }: { hasIllustration: boolean }) {
  const [states, setStates] = useState<Record<string, SkillState>>({});

  useEffect(() => {
    const next: Record<string, SkillState> = {};
    for (const topic of liveTopics()) next[topic.code] = progress.getSkillState(topic.code);
    setStates(next);
  }, []);

  const hasProgress = Object.values(states).some((s) => s !== 'not-started');
  const liveCount = liveTopics().length;

  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-12 sm:pt-16">
      <header className="mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">{COURSE.title}</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight sm:text-5xl">
          Learn it topic by topic.
        </h1>
        <p className="mt-4 max-w-[60ch] text-ink-muted">
          A short explainer, tight notes, and the working done by hand, the way the exam asks it.
        </p>
      </header>

      {!hasProgress && (
        <div className="mb-10 flex items-center gap-5">
          {hasIllustration && (
            <Image
              src="/illustrations/empty-progress.png"
              alt=""
              width={200}
              height={200}
              className="h-auto w-[120px] max-w-[200px] sm:w-[160px]"
            />
          )}
          <p className="text-sm text-ink-muted">
            {liveCount} topic{liveCount === 1 ? ' is' : 's are'} live. Start with any.
          </p>
        </div>
      )}

      {UNITS.map((unit) => (
        <section key={unit.code} aria-labelledby={`unit-${unit.code}`} className="relative mb-14 lg:pl-24">
          <span aria-hidden="true" className="absolute inset-y-0 left-[5.25rem] hidden w-px bg-grid-line lg:block" />
          <h2
            id={`unit-${unit.code}`}
            className="relative flex items-baseline gap-3 border-b border-grid-line pb-3 font-heading text-2xl font-semibold"
          >
            <MarginCode code={unit.code} />
            {unit.title}
            <span className="ml-auto shrink-0 whitespace-nowrap text-xs font-normal uppercase tracking-[0.18em] text-ink-muted">{unit.paper}</span>
          </h2>
          <ol className="divide-y divide-grid-line">
            {unit.topics.map((topic) => (
              <li key={topic.code} className="relative">
                <TopicRow topic={topic} state={states[topic.code] ?? 'not-started'} />
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section aria-labelledby="coming-next" className="lg:pl-24">
        <h2 id="coming-next" className="font-heading text-lg font-semibold text-ink-muted">
          Coming next
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted">
          {FUTURE_UNITS.map((unit) => (
            <li key={unit.code} className="flex items-baseline gap-3">
              <span className="w-12 shrink-0 font-mono text-xs" aria-hidden="true">
                {unit.code}
              </span>
              {unit.title}
              <span className="ml-auto text-xs uppercase tracking-[0.18em]">{unit.paper}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
