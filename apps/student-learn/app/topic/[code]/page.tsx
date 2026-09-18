'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppBar } from '@/components/app-bar';
import { NotesMarkdown } from '@/components/notes-markdown';
import { MasteryBadge } from '@/components/mastery-badge';
import { InteractiveArtifact } from '@/components/interactive/registry';
import { useSkillStates } from '@/components/use-progress';
import { progress } from '@/lib/progress';
import { artifactForTopic, locateTopic, notesSlug, topicHref } from '@/lib/topics';

interface NoteEntry {
  slug: string;
  title: string;
  unit: string;
  notes: string;
  video?: string;
  duration?: string;
}

/**
 * A topic, as one thing.
 *
 * Before this page the three pieces of a topic lived in three places: the video
 * and the notes at `/notes/<slug>`, and the interactive artifact on a shared
 * preview page that belonged to no topic at all. A student had to know the
 * artifact existed to find it, which means it may as well not have.
 *
 * The order is the one the roadmap asks for (§1a): watch, then be caught out by
 * the model, then read the procedure that makes it exam-safe. The artifact sits
 * ABOVE the notes for the topics that have one — it is the hinge, not an appendix.
 */
export default function TopicPage() {
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(params.code);
  const located = locateTopic(code);

  const [entry, setEntry] = useState<NoteEntry | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState('');
  const states = useSkillStates(located ? [code] : []);
  const state = states[code] ?? 'not-started';

  const slug = located ? notesSlug(located.topic) : null;

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetch('/notes/index.json')
      .then((r) => r.json())
      .then(async (data: { topics: NoteEntry[] }) => {
        const found = data.topics.find((t) => t.slug === slug);
        if (!found) throw new Error('No notes file is registered for this topic yet.');
        // Renders are build artefacts and are not committed, so the player is
        // only shown when the file is really there. A dead <video> element is a
        // worse promise than "coming soon".
        let video = found.video;
        if (video) {
          const ok = await fetch(video, { method: 'HEAD' })
            .then((r) => r.ok)
            .catch(() => false);
          if (!ok) video = undefined;
        }
        if (cancelled) return;
        setEntry({ ...found, video });
        const text = await fetch(found.notes).then((r) =>
          r.ok ? r.text() : Promise.reject(new Error('The notes file is missing.'))
        );
        if (!cancelled) setMarkdown(text);
      })
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!located) {
    return (
      <>
        <AppBar crumbs={[{ label: 'Syllabus', href: '/syllabus' }]} />
        <main className="mx-auto max-w-2xl px-5 py-16">
          <h1 className="font-heading text-2xl font-semibold">
            No topic goes by <span className="font-mono">{code}</span>.
          </h1>
          <p className="mt-3 text-ink-muted">
            It may not be written yet, or the link may be from an older map.
          </p>
          <Link
            href="/syllabus"
            className="mt-6 inline-flex font-semibold text-accent underline underline-offset-4"
          >
            Back to the map →
          </Link>
        </main>
      </>
    );
  }

  const { topic, unit, index, liveCount, previous, next } = located;
  const artifact = artifactForTopic(code);

  return (
    <>
      <AppBar
        crumbs={[
          { label: 'Syllabus', href: '/syllabus' },
          { label: unit.title },
        ]}
      />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-8">
        <header>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
            <span className="font-mono normal-case tracking-normal">{topic.code}</span> ·{' '}
            {unit.title} · {unit.paper}
            {/* An alternate recording has no place in the course order, so it gets
                no "4 of 31" — printing "0 of 31" told the student their position
                was zero rather than that the question does not apply. */}
            {topic.variantOf ? null : ` · ${index} of ${liveCount}`}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight sm:text-4xl">
            {topic.title}
          </h1>
          {topic.variantOf ? (
            <p className="mt-2 text-sm text-ink-muted">
              A second recording of this topic, kept for comparison.{' '}
              <Link href={`/topic/${encodeURIComponent(topic.variantOf)}`} className="underline hover:text-accent">
                Open the main version
              </Link>
              .
            </p>
          ) : null}
          <div className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
            <MasteryBadge state={state} size="sm" drawKey={topic.code} />
            <span>
              {state === 'secure'
                ? 'You have marked this secure.'
                : state === 'developing'
                  ? 'One more pass on this one.'
                  : 'Not started yet.'}
            </span>
          </div>
        </header>

        {error ? (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-accent/40 bg-accent/5 px-4 py-3 text-sm text-ink"
          >
            {error}
          </p>
        ) : null}

        {/* 1 — watch */}
        {entry?.video ? (
          <figure className="mt-7 overflow-hidden rounded-xl border border-grid-line bg-black">
            <video className="w-full" controls preload="metadata" src={entry.video} />
            <figcaption className="bg-paper-raised px-4 py-2 text-xs text-ink-muted">
              Watch first{entry.duration ? ` · ${entry.duration}` : ''}. Then the model, then
              the notes.
            </figcaption>
          </figure>
        ) : entry ? (
          <p className="mt-7 rounded-xl border border-grid-line bg-paper-raised px-4 py-3 text-sm text-ink-muted">
            The video for this topic is not rendered yet. The notes below are complete.
          </p>
        ) : null}

        {/* 2 — be wrong. The hinge of the page, above the prose on purpose. */}
        {artifact ? (
          <section className="mt-8" aria-labelledby="artifact-heading">
            <h2
              id="artifact-heading"
              className="flex items-baseline gap-2 font-heading text-lg font-semibold"
            >
              Before you read on
              <span className="font-mono text-[0.7rem] font-normal uppercase tracking-[0.18em] text-ink-muted">
                {artifact.codes}
              </span>
            </h2>
            <p className="mt-1.5 text-sm text-ink-muted">
              Commit to a guess. The model will not move until you do — and that is the
              point, because a guess you kept in your head does not count.
            </p>
            <div className="mt-4">
              <InteractiveArtifact id={artifact.id} />
            </div>
          </section>
        ) : null}

        {/* 3 — read the exam-safe procedure */}
        {markdown ? (
          <article className="mt-10 border-t border-grid-line pt-8">
            <NotesMarkdown markdown={markdown} />
          </article>
        ) : null}

        {/* Mark it. The one self-report we take, and it is reversible. */}
        <section className="mt-12 rounded-xl border border-grid-line bg-paper-raised p-5">
          <h2 className="font-heading text-lg font-semibold">Where are you with this?</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Your own call, changeable any time. It is what decides the topic offered
            next on your study page — and, signed in, it follows you to any device.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(
              [
                ['developing', 'Still shaky'],
                ['secure', 'I have got this'],
                ['not-started', 'Clear it'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={state === value}
                onClick={() => progress.setSkillState(topic.code, value)}
                className={`min-h-[44px] rounded-lg border px-4 text-sm font-semibold transition-colors ${
                  state === value
                    ? 'border-accent bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-accent'
                    : 'border-grid-line bg-paper text-ink hover:border-accent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Where next. The syllabus is the queue; keep it one tap away. */}
        <nav
          aria-label="Topic navigation"
          className="mt-8 flex flex-col gap-3 border-t border-grid-line pt-6 sm:flex-row sm:justify-between"
        >
          {previous ? (
            <Link
              href={topicHref(previous)}
              className="min-w-0 text-sm text-ink-muted underline-offset-4 hover:text-accent hover:underline"
            >
              ← {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={topicHref(next)}
              className="min-w-0 text-right text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              Next: {next.title} →
            </Link>
          ) : null}
        </nav>
      </main>
    </>
  );
}
