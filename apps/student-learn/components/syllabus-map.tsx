'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MasteryBadge } from '@/components/mastery-badge';
import { progress, type SkillState } from '@/lib/progress';

interface Topic {
  code: string;
  title: string;
  live: boolean;
}

// Cambridge IGCSE Mathematics 0580, Core Unit C1. Exactly 3 lessons are live.
const C1_TOPICS: Topic[] = [
  { code: 'C1.1', title: 'Types of number', live: false },
  { code: 'C1.2', title: 'Introduction to Sets', live: true },
  { code: 'C1.3', title: 'Powers and Roots', live: true },
  { code: 'C1.4', title: 'Fractions, decimals and percentages', live: false },
  { code: 'C1.5', title: 'Ordering', live: true },
  { code: 'C1.6', title: 'The four operations', live: false },
  { code: 'C1.7', title: 'Indices I', live: false },
  { code: 'C1.8', title: 'Standard form', live: false },
  { code: 'C1.9', title: 'Estimation', live: false },
  { code: 'C1.10', title: 'Limits of accuracy', live: false },
  { code: 'C1.11', title: 'Ratio and proportion', live: false },
  { code: 'C1.12', title: 'Rates', live: false },
  { code: 'C1.13', title: 'Percentages', live: false },
  { code: 'C1.14', title: 'Using a calculator', live: false },
  { code: 'C1.15', title: 'Time', live: false },
  { code: 'C1.16', title: 'Money', live: false },
  { code: 'C1.17', title: 'Exponential growth and decay', live: false },
];

const FUTURE_UNITS = [
  { code: 'C2', title: 'Algebra and graphs' },
  { code: 'C3', title: 'Coordinate geometry' },
  { code: 'C4', title: 'Geometry' },
  { code: 'C5', title: 'Mensuration' },
  { code: 'C6', title: 'Trigonometry' },
  { code: 'C7', title: 'Transformations and vectors' },
  { code: 'C8', title: 'Probability' },
  { code: 'C9', title: 'Statistics' },
];

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

export function SyllabusMap({ hasIllustration }: { hasIllustration: boolean }) {
  const [states, setStates] = useState<Record<string, SkillState>>({});

  useEffect(() => {
    const next: Record<string, SkillState> = {};
    for (const topic of C1_TOPICS) {
      if (topic.live) next[topic.code] = progress.getSkillState(topic.code);
    }
    setStates(next);
  }, []);

  const hasProgress = Object.values(states).some((s) => s !== 'not-started');

  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-12 sm:pt-16">
      <header className="mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
          Cambridge IGCSE Mathematics 0580
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight sm:text-5xl">
          Learn it topic by topic.
        </h1>
        <p className="mt-4 max-w-[60ch] text-ink-muted">
          Each topic is a short lesson with worked examples and a quiz, taught
          the way the exam asks it.
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
            3 lessons are live. Start with any.
          </p>
        </div>
      )}

      {/* Unit C1 — the contents page. Margin rule + codes in the margin at lg+. */}
      <section aria-labelledby="unit-c1" className="relative lg:pl-24">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-[5.25rem] hidden w-px bg-grid-line lg:block"
        />
        <h2
          id="unit-c1"
          className="relative flex items-baseline gap-3 border-b border-grid-line pb-3 font-heading text-2xl font-semibold"
        >
          <MarginCode code="C1" />
          Number
        </h2>
        <ol className="divide-y divide-grid-line">
          {C1_TOPICS.map((topic) => (
            <li key={topic.code} className="relative">
              {topic.live ? (
                <Link
                  href={`/lesson/${topic.code}`}
                  className="group flex min-h-[44px] items-center gap-3 py-3 pr-1 transition-colors duration-150 ease-out-quart hover:bg-paper-raised"
                >
                  <MarginCode code={topic.code} />
                  <span className="flex-1 font-medium underline-offset-4 group-hover:text-accent group-hover:underline group-active:text-accent-pressed">
                    {topic.title}
                  </span>
                  <MasteryBadge
                    state={states[topic.code] ?? 'not-started'}
                    drawKey={topic.code}
                  />
                </Link>
              ) : (
                <div className="flex min-h-[44px] items-center gap-3 py-3 pr-1">
                  <MarginCode code={topic.code} />
                  <span className="flex-1 text-ink-muted">{topic.title}</span>
                  <span className="text-xs text-ink-muted">coming soon</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Future units: plain typeset lines, no cards, no icons. */}
      <section aria-labelledby="coming-next" className="mt-14 lg:pl-24">
        <h2
          id="coming-next"
          className="font-heading text-lg font-semibold text-ink-muted"
        >
          Coming next
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted">
          {FUTURE_UNITS.map((unit) => (
            <li key={unit.code} className="flex items-baseline gap-3">
              <span className="w-12 shrink-0 font-mono text-xs" aria-hidden="true">
                {unit.code}
              </span>
              {unit.title}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
