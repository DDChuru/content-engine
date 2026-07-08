'use client';

import { useId, useRef, useState } from 'react';
import { MathText } from '@/components/math-text';
import type { Question, QuestionOption } from '@/lib/types';

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Grades a given answer (option id or typed text) against the question. */
export function gradeAnswer(
  question: Question,
  given: string | undefined
): boolean {
  if (!given || given.trim() === '') return false;
  if (question.questionType === 'multiple-choice') {
    return given === question.correctOptionId;
  }
  const accepted = [
    question.correctAnswer,
    ...(question.acceptableAnswers ?? []),
  ].map(norm);
  if (question.questionType === 'numeric') {
    const g = parseFloat(given.replace(/,/g, ''));
    if (!Number.isNaN(g)) {
      for (const a of accepted) {
        const n = parseFloat(a.replace(/,/g, ''));
        if (!Number.isNaN(n) && Math.abs(n - g) < 1e-9) return true;
      }
    }
  }
  return accepted.includes(norm(given));
}

/** MC options come from the data; true-false synthesizes a pair. */
function optionsFor(question: Question): QuestionOption[] | null {
  if (question.questionType === 'multiple-choice') return question.options;
  if (question.questionType === 'true-false') {
    return [
      { id: 'true', text: 'True' },
      { id: 'false', text: 'False' },
    ];
  }
  return null;
}

function correctOptionIdFor(question: Question): string | null {
  if (question.questionType === 'multiple-choice') return question.correctOptionId;
  if (question.questionType === 'true-false') return norm(question.correctAnswer);
  return null;
}

export interface ReviewLink {
  href: string;
  /** Theory section title; absent means "Review the theory". */
  label?: string;
}

export interface QuestionCardProps {
  question: Question;
  mode: 'practice' | 'quiz';
  /** Quiet kicker above the stem, e.g. "Practice question 2" / "Question 5". */
  label?: string;
  onAnswered?: (correct: boolean) => void;
  /** Quiz mode: the learner's answer (option id or typed text), parent-owned. */
  chosenId?: string;
  onChoose?: (value: string) => void;
  /** Quiz mode: after quiz submit the card renders in review state. */
  revealed?: boolean;
  /** Deep link into the theory section that teaches this question's skill. */
  reviewLink?: ReviewLink;
}

export function QuestionCard({
  question,
  mode,
  label,
  onAnswered,
  chosenId,
  onChoose,
  revealed,
  reviewLink,
}: QuestionCardProps) {
  const stemId = useId();
  const [localValue, setLocalValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const isQuiz = mode === 'quiz';
  const value = isQuiz ? chosenId ?? '' : localValue;
  const showFeedback = isQuiz ? revealed === true : submitted;
  const correct = showFeedback ? gradeAnswer(question, value) : false;

  const options = optionsFor(question);
  const correctId = correctOptionIdFor(question);

  function choose(v: string) {
    if (showFeedback) return;
    if (isQuiz) {
      onChoose?.(v);
    } else {
      setLocalValue(v);
    }
  }

  function submitPractice() {
    if (submitted || value.trim() === '') return;
    setSubmitted(true);
    onAnswered?.(gradeAnswer(question, value));
  }

  function onOptionKeyDown(e: React.KeyboardEvent, idx: number) {
    if (!options || showFeedback) return;
    const step =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? 1
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
          ? -1
          : 0;
    if (step !== 0) {
      e.preventDefault();
      const next = (idx + step + options.length) % options.length;
      choose(options[next].id);
      optionRefs.current[next]?.focus();
    }
  }

  const selectedIndex = options
    ? options.findIndex((o) => o.id === value)
    : -1;

  function optionClasses(o: QuestionOption): string {
    const base =
      'flex w-full min-h-[44px] items-start gap-3 border bg-paper-raised px-4 py-3 text-left rounded-sm transition-colors duration-150 ease-out-quart';
    if (showFeedback) {
      if (o.id === correctId && (isQuiz || o.id === value)) {
        // Chosen-and-correct always marked; the unchosen correct option is
        // only revealed in quiz review ("chosen vs correct").
        return `${base} border-secure ring-1 ring-secure`;
      }
      if (o.id === value && o.id !== correctId) {
        return `${base} border-developing ring-1 ring-developing`;
      }
      return `${base} border-grid-line text-ink-muted`;
    }
    if (o.id === value) {
      return `${base} border-accent ring-1 ring-accent`;
    }
    return `${base} border-grid-line hover:border-ink-muted`;
  }

  const tint = !showFeedback
    ? 'bg-paper-raised'
    : correct
      ? 'bg-[color-mix(in_oklch,var(--secure)_8%,var(--paper-raised))]'
      : 'bg-[color-mix(in_oklch,var(--developing)_9%,var(--paper-raised))]';

  const fallbackWrong = 'Not this one. Take another look at the theory below.';
  const feedbackWrong =
    question.feedbackIncorrect && question.feedbackIncorrect.trim() !== ''
      ? question.feedbackIncorrect
      : fallbackWrong;
  const feedbackRight =
    question.feedbackCorrect && question.feedbackCorrect.trim() !== ''
      ? question.feedbackCorrect
      : 'Correct.';

  return (
    <div
      className={`rounded-sm border border-grid-line p-4 transition-colors duration-200 ease-out-quart sm:p-5 ${tint}`}
    >
      {label && (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
          {label}
        </p>
      )}
      <p id={stemId} className="font-medium leading-relaxed">
        <MathText>{question.question}</MathText>
      </p>

      {question.hint && !showFeedback && (
        <details className="mt-2 text-sm text-ink-muted">
          <summary className="cursor-pointer select-none underline-offset-4 hover:underline">
            Hint
          </summary>
          <p className="mt-1">
            <MathText>{question.hint}</MathText>
          </p>
        </details>
      )}

      {options ? (
        <div
          role="radiogroup"
          aria-labelledby={stemId}
          className="mt-4 space-y-2"
        >
          {options.map((o, idx) => (
            <button
              key={o.id}
              ref={(el) => {
                optionRefs.current[idx] = el;
              }}
              type="button"
              role="radio"
              aria-checked={o.id === value}
              aria-disabled={showFeedback || undefined}
              tabIndex={
                selectedIndex === -1
                  ? idx === 0
                    ? 0
                    : -1
                  : idx === selectedIndex
                    ? 0
                    : -1
              }
              onClick={() => choose(o.id)}
              onKeyDown={(e) => onOptionKeyDown(e, idx)}
              className={optionClasses(o)}
            >
              {showFeedback && o.id === correctId && (isQuiz || o.id === value) && (
                <span aria-hidden="true" className="text-secure">
                  ✓
                </span>
              )}
              {showFeedback && o.id === value && o.id !== correctId && (
                <span aria-hidden="true" className="text-developing">
                  ✗
                </span>
              )}
              <span className="min-w-0 flex-1 break-words">
                <MathText>{o.text}</MathText>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <label
            htmlFor={`${stemId}-answer`}
            className="text-sm text-ink-muted"
          >
            Your answer
          </label>
          <input
            id={`${stemId}-answer`}
            type="text"
            inputMode={question.questionType === 'numeric' ? 'decimal' : 'text'}
            value={value}
            disabled={showFeedback}
            onChange={(e) => choose(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isQuiz) submitPractice();
            }}
            className="mt-1 block w-full min-h-[44px] rounded-sm border border-grid-line bg-paper-raised px-3 py-2 disabled:text-ink-muted"
          />
        </div>
      )}

      {!isQuiz && !submitted && (
        <button
          type="button"
          onClick={submitPractice}
          disabled={value.trim() === ''}
          className="mt-4 min-h-[44px] rounded-sm bg-accent px-5 font-medium text-paper transition-colors duration-150 ease-out-quart hover:bg-accent-pressed disabled:bg-grid-line disabled:text-ink-muted"
        >
          Check answer
        </button>
      )}

      {showFeedback && (
        <div className="mt-4 border-t border-grid-line pt-3 text-sm leading-relaxed">
          {correct ? (
            <p>
              <span aria-hidden="true" className="mr-1.5 text-secure">
                ✓
              </span>
              <span className="sr-only">Correct. </span>
              <MathText>{feedbackRight}</MathText>
            </p>
          ) : (
            <>
              <p>
                <span aria-hidden="true" className="mr-1.5 text-developing">
                  ✗
                </span>
                <span className="sr-only">Not correct. </span>
                <MathText>{feedbackWrong}</MathText>
              </p>
              {question.solutionSteps && question.solutionSteps.length > 0 && (
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-ink-muted">
                  {question.solutionSteps.map((step, i) => (
                    <li key={i}>
                      <MathText>{step}</MathText>
                    </li>
                  ))}
                </ol>
              )}
              {reviewLink && (
                <p className="mt-2">
                  <a
                    href={reviewLink.href}
                    className="font-medium text-accent underline underline-offset-4 hover:text-accent-pressed"
                  >
                    {reviewLink.label
                      ? `Review: ${reviewLink.label}`
                      : 'Review the theory'}
                  </a>
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
