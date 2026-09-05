'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { NotesMarkdown } from '@/components/notes-markdown';

interface NoteTopic {
  slug: string;
  title: string;
  unit: string;
  notes: string; // path under /public
  video?: string; // path under /public, optional until rendered
  duration?: string;
}

/**
 * A topic page: our own explainer video on top, our own notes underneath.
 * Everything is static and pre-built (the library model), nothing is generated here.
 */
export default function NotesPage() {
  const { slug } = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<NoteTopic | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/notes/index.json')
      .then((r) => r.json())
      .then((data: { topics: NoteTopic[] }) => {
        const t = data.topics.find((x) => x.slug === slug);
        if (!t) throw new Error('No notes for this topic yet.');
        setTopic(t);
        return fetch(t.notes).then((r) => (r.ok ? r.text() : Promise.reject(new Error('Notes file missing.'))));
      })
      .then(setMarkdown)
      .catch((e: Error) => setError(e.message));
  }, [slug]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 md:py-10">
      <Link href="/notes" className="text-sm text-ink-muted hover:text-accent">
        ← All topics
      </Link>
      {error && <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {topic && (
        <>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ink-muted">{topic.unit}</p>
          <h1 className="mt-1 font-heading text-3xl md:text-4xl">{topic.title}</h1>
          {topic.video ? (
            <figure className="mt-6 overflow-hidden rounded-xl bg-black shadow-sm">
              <video className="w-full" controls preload="metadata" src={topic.video} />
              {topic.duration && (
                <figcaption className="px-4 py-2 text-xs text-ink-muted bg-paper-raised">
                  Watch first · {topic.duration}. Then read the notes below.
                </figcaption>
              )}
            </figure>
          ) : (
            <p className="mt-6 rounded-lg border border-grid-line bg-paper-raised px-4 py-3 text-sm text-ink-muted">
              Video coming soon. The notes are ready.
            </p>
          )}
          <article className="mt-8">{markdown && <NotesMarkdown markdown={markdown} />}</article>
        </>
      )}
    </main>
  );
}
