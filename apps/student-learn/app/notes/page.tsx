'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface NoteTopic {
  slug: string;
  title: string;
  unit: string;
  video?: string;
  duration?: string;
}

export default function NotesIndexPage() {
  const [topics, setTopics] = useState<NoteTopic[]>([]);
  useEffect(() => {
    fetch('/notes/index.json')
      .then((r) => r.json())
      .then((d: { topics: NoteTopic[] }) => setTopics(d.topics))
      .catch(() => setTopics([]));
  }, []);
  return (
    <main className="mx-auto max-w-3xl px-4 py-6 md:py-10">
      <Link href="/" className="text-sm text-ink-muted hover:text-accent">
        ← Back
      </Link>
      <h1 className="mt-1 font-heading text-3xl md:text-4xl">Topic notes</h1>
      <p className="mt-1 text-sm text-ink-muted">Short explainer, then the notes. Five minutes each.</p>
      <ul className="mt-6 space-y-3">
        {topics.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/notes/${t.slug}`}
              className="block rounded-xl border border-grid-line bg-paper-raised px-5 py-4 transition-colors hover:border-accent"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">{t.unit}</p>
              <p className="mt-1 font-semibold text-ink">{t.title}</p>
              <p className="mt-1 text-xs text-ink-muted">{t.video ? `Video · ${t.duration ?? ''}` : 'Notes only for now'}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
