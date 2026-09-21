import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { COURSES, FUTURE_UNITS, UNITS, isStudentFacing, liveTopics } from '@/lib/syllabus';

export const metadata: Metadata = {
  title: 'Cambridge International A Level syllabuses',
};

/**
 * The public library front door. A student chooses their syllabus here, then
 * opens its units and topics one level down.
 */
export default function SyllabusPage() {
  const liveCount = liveTopics().length;

  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-12 sm:pt-16">
      <header className="mb-10">
        <BrandLogo variant="wordmark" theme="light" className="mb-4" />
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
          Cambridge International A Level
        </p>
        <h1 className="mt-2 font-heading text-4xl font-semibold leading-tight sm:text-5xl">
          Choose your syllabus.
        </h1>
        <p className="mt-4 max-w-[60ch] text-ink-muted">
          Pick a subject to see its units, every topic, and what you can study now.
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          {liveCount} topic{liveCount === 1 ? ' is' : 's are'} live across the library.
        </p>
      </header>

      <ul className="space-y-3">
        {COURSES.map((course) => {
          const units = course.unitCodes.flatMap((code) => {
            const unit = UNITS.find((candidate) => candidate.code === code);
            return unit ? [unit] : [];
          });
          const courseLiveCount = units.reduce(
            (count, unit) => count + unit.topics.filter(isStudentFacing).length,
            0
          );
          const futureUnits = FUTURE_UNITS.filter((unit) => unit.course === course.code);

          return (
            <li key={course.code}>
              <Link
                href={`/syllabus/${course.code}`}
                className="group flex items-center gap-3 rounded-xl border border-grid-line bg-paper-raised px-5 py-5 transition-colors hover:border-accent"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="font-heading text-xl font-semibold leading-snug text-ink group-hover:text-accent">
                    {course.title}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-ink-muted">Syllabus {course.code}</p>
                  <p className="mt-3 text-sm text-ink-muted">
                    {units.map((unit) => unit.title).join(' · ')}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {courseLiveCount} lesson{courseLiveCount === 1 ? '' : 's'} live now
                  </p>
                  {futureUnits.length > 0 ? (
                    <p className="mt-3 border-t border-grid-line pt-3 text-xs text-ink-muted">
                      Coming next: {futureUnits.map((unit) => unit.title).join(' · ')}
                    </p>
                  ) : null}
                </div>
                <span aria-hidden="true" className="text-ink-muted group-hover:text-accent">
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
