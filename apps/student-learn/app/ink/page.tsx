'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { InkPaper, type InkGroup, type InkStroke } from '@/components/ink-paper';

interface InkQuestion {
  id: string;
  label: string;
  topic: string;
  source: string;
  hand: string;
  file: string;
}

type Status = 'idle' | 'loading' | 'done' | 'error';

export default function InkPage() {
  const [questions, setQuestions] = useState<InkQuestion[]>([]);
  const [question, setQuestion] = useState<InkQuestion | null>(null);
  const [strokes, setStrokes] = useState<InkStroke[]>([]);
  const [groups, setGroups] = useState<InkGroup[]>([]);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [playKey, setPlayKey] = useState(0);
  const [penBusy, setPenBusy] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const counter = useRef(0);

  // The library is drawn ahead of time (in Claude Code sessions) and shipped as static files.
  useEffect(() => {
    fetch('/ink/index.json')
      .then((r) => r.json())
      .then((data: { questions: InkQuestion[] }) => {
        setQuestions(data.questions);
        setQuestion(data.questions[0] ?? null);
      })
      .catch(() => setMessage('The worked-solution library could not be loaded.'));
  }, []);

  const reset = useCallback(() => {
    abort.current?.abort();
    setStrokes([]);
    setGroups([]);
    setActiveGroup(null);
    setMessage('');
    counter.current = 0;
    setPlayKey((k) => k + 1);
  }, []);

  const showMe = useCallback(async () => {
    if (!question) return;
    reset();
    setStatus('loading');
    const ctrl = new AbortController();
    abort.current = ctrl;
    try {
      const res = await fetch(question.file, { signal: ctrl.signal });
      if (!res.ok) throw new Error('This question has not been drawn yet.');
      const data = (await res.json()) as { groups: InkGroup[]; strokes: { group: string; d: string }[] };
      setGroups(data.groups);
      setStrokes(data.strokes.map((st) => ({ id: `s${counter.current++}`, group: st.group, d: st.d })));
      setStatus('done');
    } catch (err) {
      if (ctrl.signal.aborted) return;
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }, [question, reset]);

  const replay = useCallback(() => {
    setActiveGroup(null);
    setPlayKey((k) => k + 1);
  }, []);

  const canReplay = status === 'done' && strokes.length > 0 && !penBusy;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <header className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <Link href="/" className="text-sm text-ink-muted hover:text-accent">
            ← Back
          </Link>
          <h1 className="mt-1 font-heading text-2xl md:text-3xl">Show me the working</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Worked by hand, one stroke at a time. Drawn ahead of time, so it starts instantly.
          </p>
        </div>
      </header>

      <section className="mb-5 flex flex-wrap gap-2">
        {questions.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => {
              setQuestion(q);
              reset();
              setStatus('idle');
            }}
            aria-pressed={q.id === question?.id}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              q.id === question?.id
                ? 'border-accent bg-accent text-white'
                : 'border-grid-line bg-paper-raised text-ink hover:border-accent'
            }`}
          >
            {q.label}
          </button>
        ))}
      </section>

      <div className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div>
          <InkPaper
            strokes={strokes}
            groups={groups}
            playKey={playKey}
            onGroupStart={(id) => {
              setPenBusy(true);
              setActiveGroup(id);
            }}
            onIdle={() => setPenBusy(false)}
          />
        </div>

        <aside className="flex flex-col gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={showMe}
              disabled={status === 'loading' || !question}
              className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white transition-colors hover:bg-accent-pressed disabled:opacity-50"
            >
              Show me
            </button>
            <button
              type="button"
              onClick={replay}
              disabled={!canReplay}
              className="rounded-lg border border-grid-line bg-paper-raised px-5 py-2.5 font-medium text-ink transition-colors hover:border-accent disabled:opacity-40"
            >
              Replay
            </button>
          </div>


          <ol className="space-y-2">
            {groups.map((g, i) => (
              <li
                key={g.id}
                className={`rounded-lg border px-4 py-3 text-sm transition-colors ${
                  g.id === activeGroup
                    ? 'border-accent bg-paper-raised text-ink'
                    : 'border-transparent text-ink-muted'
                }`}
              >
                <span className="mr-2 font-mono text-xs opacity-60">{i + 1}</span>
                {g.say}
              </li>
            ))}
          </ol>

          {status === 'error' && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {message}
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
