'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  QuestionCard,
  gradeAnswer,
  type ReviewLink,
} from '@/components/question-card';
import { progress } from '@/lib/progress';
import type { Question, Quiz as QuizData } from '@/lib/types';

interface QuizProps {
  quiz: QuizData;
  topicCode: string;
  resolveReviewLink: (question: Question) => ReviewLink | undefined;
}

/** "sets.venn-regions" → "Venn regions" */
function skillName(tag: string): string {
  const tail = tag.split('.').pop() ?? tag;
  const words = tail.replace(/[-_]/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function Quiz({ quiz, topicCode, resolveReviewLink }: QuizProps) {
  const questions = quiz.questions;
  const total = questions.length;
  const passingScore = quiz.passingScore ?? 70;

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<'answering' | 'results'>('answering');
  const [confirmRetake, setConfirmRetake] = useState(false);

  if (total === 0) return null;

  const answered = questions.filter(
    (q) => (answers[q.id] ?? '').trim() !== ''
  ).length;
  const remaining = total - answered;

  function submitQuiz() {
    if (remaining > 0) return;
    const correct = questions.filter((q) =>
      gradeAnswer(q, answers[q.id])
    ).length;
    progress.recordQuizAttempt({
      topicCode,
      correct,
      total,
      passingScore,
    });
    setPhase('results');
    setConfirmRetake(false);
  }

  function retake() {
    setAnswers({});
    setCurrent(0);
    setPhase('answering');
    setConfirmRetake(false);
  }

  if (phase === 'answering') {
    const q = questions[current];
    return (
      <div>
        {quiz.description && (
          <p className="mb-4 text-ink-muted">{quiz.description}</p>
        )}
        <p className="mb-3 text-sm text-ink-muted" aria-live="polite">
          Question {current + 1} of {total} · {answered} answered
        </p>

        <QuestionCard
          key={q.id}
          question={q}
          mode="quiz"
          chosenId={answers[q.id] ?? ''}
          onChoose={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
        />

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="min-h-[44px] px-2 text-sm font-medium text-accent underline-offset-4 hover:underline disabled:text-ink-muted disabled:no-underline"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
            disabled={current === total - 1}
            className="min-h-[44px] px-2 text-sm font-medium text-accent underline-offset-4 hover:underline disabled:text-ink-muted disabled:no-underline"
          >
            Next
          </button>
        </div>

        <button
          type="button"
          onClick={submitQuiz}
          disabled={remaining > 0}
          className="mt-4 min-h-[48px] w-full rounded-sm bg-accent px-5 font-medium text-paper transition-colors duration-150 ease-out-quart hover:bg-accent-pressed disabled:bg-grid-line disabled:text-ink-muted sm:w-auto"
        >
          {remaining > 0
            ? `Answer ${remaining} more to submit`
            : 'Submit quiz'}
        </button>
        <p className="mt-2 text-xs text-ink-muted">
          Pass mark: {passingScore}%
        </p>
      </div>
    );
  }

  // Results — mastery framing.
  const results = questions.map((q) => ({
    question: q,
    correct: gradeAnswer(q, answers[q.id]),
  }));
  const correctCount = results.filter((r) => r.correct).length;
  const percentage =
    total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const passed = percentage >= passingScore;

  // Per-skill grouping where derivable (every question tagged).
  const allTagged = questions.every((q) => q.skillTag && q.skillTag.trim() !== '');
  const skillLines: string[] = [];
  if (allTagged) {
    const byTag = new Map<string, boolean>();
    for (const r of results) {
      const prev = byTag.get(r.question.skillTag);
      byTag.set(r.question.skillTag, (prev ?? true) && r.correct);
    }
    for (const [tag, secure] of Array.from(byTag.entries())) {
      skillLines.push(
        secure
          ? `${skillName(tag)} is secure.`
          : `${skillName(tag)} needs one more pass.`
      );
    }
  }

  const firstMissed = results.find((r) => !r.correct);
  const firstMissedHref = firstMissed
    ? resolveReviewLink(firstMissed.question)?.href ?? '#theory'
    : '#theory';

  return (
    <div>
      <h3 className="font-heading text-3xl font-semibold">
        {correctCount} of {total} secure
      </h3>
      {skillLines.length > 0 && (
        <p className="mt-2 max-w-[60ch] leading-relaxed text-ink-muted">
          {skillLines.join(' ')}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {passed ? (
          <Link
            href="/"
            className="flex min-h-[44px] items-center rounded-sm bg-accent px-5 font-medium text-paper transition-colors duration-150 ease-out-quart hover:bg-accent-pressed"
          >
            Back to the map
          </Link>
        ) : (
          <a
            href={firstMissedHref}
            className="flex min-h-[44px] items-center rounded-sm bg-accent px-5 font-medium text-paper transition-colors duration-150 ease-out-quart hover:bg-accent-pressed"
          >
            Review the sections you missed
          </a>
        )}
        {confirmRetake ? (
          <span className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-ink-muted">
              Retaking clears your answers.
            </span>
            <button
              type="button"
              onClick={retake}
              className="min-h-[44px] font-medium text-accent underline underline-offset-4 hover:text-accent-pressed"
            >
              Yes, retake
            </button>
            <button
              type="button"
              onClick={() => setConfirmRetake(false)}
              className="min-h-[44px] text-ink-muted underline underline-offset-4"
            >
              Keep my results
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmRetake(true)}
            className="min-h-[44px] px-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Retake
          </button>
        )}
      </div>

      <ol className="mt-8 space-y-4">
        {results.map((r, i) => (
          <li key={r.question.id}>
            <QuestionCard
              question={r.question}
              mode="quiz"
              label={`Question ${i + 1}`}
              chosenId={answers[r.question.id] ?? ''}
              revealed
              reviewLink={resolveReviewLink(r.question)}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
