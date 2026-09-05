'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MathText, MathBlock } from '@/components/math-text';
import { QuestionCard, type ReviewLink } from '@/components/question-card';
import { Quiz } from '@/components/quiz';
import { VennBoard } from '@/components/venn-board';
import type {
  ContentBlock,
  Lesson,
  LessonOpening,
  LessonSummary,
  Misconception,
  Question,
  QuestionOption,
  TheorySection,
  WorkedExample,
} from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ---------------------------------------------------------------------------
// Normalization — tolerate the legacy C1.5 shape (no opening, learningObjectives
// as plain strings, string misconceptions, loose question encodings).
// ---------------------------------------------------------------------------

interface NormalizedQuiz {
  passingScore: number;
  description?: string;
  questions: Question[];
}

interface NormalizedLesson {
  title: string;
  level?: string;
  estimatedDuration?: number;
  opening?: LessonOpening;
  objectives: string[];
  theorySections: TheorySection[];
  richMisconceptions: Misconception[];
  plainMisconceptions: string[];
  workedExamples: WorkedExample[];
  practiceQuestions: Question[];
  quiz?: NormalizedQuiz;
  summary?: LessonSummary;
}

function optionId(index: number): string {
  return String.fromCharCode(97 + index);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Real generated lessons encode MC options three ways:
 *  - canonical: {id, text}
 *  - c1.2 style: {label: display text, value: option id letter, isCorrect}
 *  - c1.3 style: {label: enumerator letter, value: display text, isCorrect}
 *  - c1.5 style: plain strings
 */
function normalizeOption(o: any, index: number): QuestionOption {
  if (typeof o === 'string') return { id: optionId(index), text: o };
  if (typeof o?.text === 'string' && o.text.trim() !== '') {
    return { id: typeof o.id === 'string' ? o.id : optionId(index), text: o.text };
  }
  const label = o?.label != null ? String(o.label) : '';
  const value = o?.value != null ? String(o.value) : '';
  const enumerator = /^[a-e]$/i;
  if (label !== '' && value !== '') {
    if (enumerator.test(value) && !enumerator.test(label)) {
      return { id: value.toLowerCase(), text: label };
    }
    if (enumerator.test(label)) {
      return { id: label.toLowerCase(), text: value };
    }
    return { id: optionId(index), text: label };
  }
  return { id: optionId(index), text: label !== '' ? label : value };
}

function warnDroppedQuestion(raw: any, index: number, topicCode: string): null {
  const questionRef =
    raw && typeof raw.id === 'string' && raw.id.trim() !== ''
      ? `id ${raw.id} (index ${index})`
      : `index ${index}`;
  console.warn(
    `Dropped ungradeable question for lesson ${topicCode}: ${questionRef}.`
  );
  return null;
}

function normalizeQuestion(raw: any, index: number, topicCode: string): Question | null {
  if (!raw || typeof raw.question !== 'string') {
    return warnDroppedQuestion(raw, index, topicCode);
  }
  const base = {
    id: typeof raw.id === 'string' ? raw.id : `q-${index}`,
    skillTag: typeof raw.skillTag === 'string' ? raw.skillTag : '',
    difficulty: raw.difficulty ?? 'core',
    question: raw.question,
    hint:
      typeof raw.hint === 'string'
        ? raw.hint
        : Array.isArray(raw.hints) && raw.hints.length > 0
          ? raw.hints.map(String).join(' ')
          : undefined,
    solutionSteps: Array.isArray(raw.solutionSteps)
      ? raw.solutionSteps.map(String)
      : undefined,
    feedbackCorrect:
      typeof raw.feedbackCorrect === 'string' ? raw.feedbackCorrect : '',
    feedbackIncorrect:
      typeof raw.feedbackIncorrect === 'string'
        ? raw.feedbackIncorrect
        : typeof raw.explanation === 'string'
          ? raw.explanation
          : '',
    addressesMisconception:
      typeof raw.addressesMisconception === 'string'
        ? raw.addressesMisconception
        : undefined,
  };

  if (Array.isArray(raw.options) && raw.options.length > 0) {
    const options: QuestionOption[] = raw.options.map(normalizeOption);
    let correctOptionId: string | undefined =
      typeof raw.correctOptionId === 'string' ? raw.correctOptionId : undefined;
    if (!correctOptionId) {
      // Legacy encodings: options[].isCorrect, numeric index, or answer text.
      const flagged = raw.options.findIndex((o: any) => o && o.isCorrect === true);
      if (flagged >= 0) {
        correctOptionId = options[flagged].id;
      } else {
        const answer = raw.correctAnswer ?? raw.answer;
        if (typeof answer === 'number' && options[answer]) {
          correctOptionId = options[answer].id;
        } else if (answer != null) {
          const text = String(answer).trim().toLowerCase();
          const hit = options.find(
            (o) => o.id === text || o.text.trim().toLowerCase() === text
          );
          if (hit) correctOptionId = hit.id;
        }
      }
    }
    if (!correctOptionId) {
      // ungradeable — drop rather than mis-grade
      return warnDroppedQuestion(raw, index, topicCode);
    }
    return { ...base, questionType: 'multiple-choice', options, correctOptionId };
  }

  const answer = raw.correctAnswer ?? raw.answer;
  if (answer == null) return warnDroppedQuestion(raw, index, topicCode);
  const freeType =
    raw.questionType === 'numeric' || raw.questionType === 'true-false'
      ? raw.questionType
      : 'short-answer';
  return {
    ...base,
    questionType: freeType,
    correctAnswer: String(answer),
    acceptableAnswers: Array.isArray(raw.acceptableAnswers)
      ? raw.acceptableAnswers.map(String)
      : undefined,
  };
}

/**
 * Canonical examples use question/steps[{stepNumber, working, explanation}];
 * legacy (c1.5) uses title/problem/steps[{step, work, result}]/commonMistake.
 */
function normalizeWorkedExample(raw: any, index: number): WorkedExample | null {
  const problem =
    typeof raw?.question === 'string'
      ? raw.question
      : typeof raw?.problem === 'string'
        ? raw.problem
        : '';
  if (problem.trim() === '') return null;
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const steps = (Array.isArray(raw.steps) ? raw.steps : []).map(
    (st: any, j: number) => ({
      stepNumber:
        typeof st?.stepNumber === 'number'
          ? st.stepNumber
          : typeof st?.step === 'number'
            ? st.step
            : j + 1,
      instruction: String(st?.instruction ?? ''),
      working:
        typeof st?.working === 'string'
          ? st.working
          : typeof st?.work === 'string'
            ? st.work
            : '',
      explanation:
        typeof st?.explanation === 'string'
          ? st.explanation
          : typeof st?.result === 'string'
            ? st.result
            : undefined,
      commonError: typeof st?.commonError === 'string' ? st.commonError : undefined,
    })
  );
  // Legacy example-level commonMistake surfaces as the final step's watch-out.
  if (
    typeof raw.commonMistake === 'string' &&
    raw.commonMistake.trim() !== '' &&
    steps.length > 0 &&
    !steps[steps.length - 1].commonError
  ) {
    steps[steps.length - 1].commonError = raw.commonMistake;
  }
  return {
    id: typeof raw.id === 'string' ? raw.id : `ex-${index}`,
    difficulty: raw.difficulty ?? 'core',
    questionType: typeof raw.questionType === 'string' ? raw.questionType : '',
    question: title !== '' ? `${title}. ${problem}` : problem,
    marks: typeof raw.marks === 'number' ? raw.marks : undefined,
    steps,
    answer: String(raw.answer ?? ''),
    examTip: typeof raw.examTip === 'string' ? raw.examTip : undefined,
  };
}

function normalizeLesson(raw: any, topicCode: string): NormalizedLesson {
  const opening =
    raw.opening && typeof raw.opening.hook === 'string'
      ? (raw.opening as LessonOpening)
      : undefined;

  const objectiveSource = Array.isArray(raw.objectives)
    ? raw.objectives
    : Array.isArray(raw.learningObjectives)
      ? raw.learningObjectives
      : [];
  const objectives: string[] = objectiveSource
    .map((o: any) =>
      typeof o === 'string' ? o : typeof o?.description === 'string' ? o.description : ''
    )
    .filter((s: string) => s.trim() !== '');

  const theorySections: TheorySection[] = (
    Array.isArray(raw.theorySections) ? raw.theorySections : []
  )
    .filter((s: any) => s && typeof s.title === 'string')
    .map((s: any, i: number) => {
      const id = typeof s.id === 'string' ? s.id : `theory-${i}`;
      // Legacy sections carry their prose as a plain string in `content`.
      const content: ContentBlock[] = Array.isArray(s.content)
        ? s.content
        : typeof s.content === 'string' && s.content.trim() !== ''
          ? [{ id: `${id}-content`, type: 'text' as const, body: s.content }]
          : [];
      return {
        ...s,
        id,
        introduction: typeof s.introduction === 'string' ? s.introduction : '',
        content,
      };
    })
    .sort((a: TheorySection, b: TheorySection) => (a.order ?? 0) - (b.order ?? 0));

  const richMisconceptions: Misconception[] = [];
  const plainMisconceptions: string[] = [];
  for (const m of Array.isArray(raw.misconceptions) ? raw.misconceptions : []) {
    if (typeof m === 'string') {
      if (m.trim() !== '') plainMisconceptions.push(m);
    } else if (m && typeof m.wrongIdea === 'string') {
      richMisconceptions.push(m);
    } else if (m && typeof m.misconception === 'string') {
      // Legacy pair: {misconception, correction} → trap/truth panel.
      richMisconceptions.push({
        id: typeof m.id === 'string' ? m.id : `m-${richMisconceptions.length}`,
        wrongIdea: m.misconception,
        whyWrong: '',
        correctUnderstanding:
          typeof m.correction === 'string' ? m.correction : '',
      });
    }
  }

  const workedExamples: WorkedExample[] = (
    Array.isArray(raw.workedExamples) ? raw.workedExamples : []
  )
    .map((ex: any, i: number) => normalizeWorkedExample(ex, i))
    .filter((ex: WorkedExample | null): ex is WorkedExample => ex !== null);

  const practiceQuestions = (
    Array.isArray(raw.practiceQuestions) ? raw.practiceQuestions : []
  )
    .map((q: any, i: number) => normalizeQuestion(q, i, topicCode))
    .filter((q: Question | null): q is Question => q !== null);

  let quiz: NormalizedQuiz | undefined;
  if (raw.quiz && Array.isArray(raw.quiz.questions)) {
    const questions = raw.quiz.questions
      .map((q: any, i: number) => normalizeQuestion(q, i, topicCode))
      .filter((q: Question | null): q is Question => q !== null);
    if (questions.length > 0) {
      quiz = {
        passingScore:
          typeof raw.quiz.passingScore === 'number' ? raw.quiz.passingScore : 70,
        description:
          typeof raw.quiz.description === 'string' ? raw.quiz.description : undefined,
        questions,
      };
    }
  }

  const summary =
    raw.summary &&
    (Array.isArray(raw.summary.keyTakeaways) || Array.isArray(raw.summary.examTips))
      ? {
          keyTakeaways: Array.isArray(raw.summary.keyTakeaways)
            ? raw.summary.keyTakeaways.map(String)
            : [],
          examTips: Array.isArray(raw.summary.examTips)
            ? raw.summary.examTips.map(String)
            : [],
          formulaSheet: Array.isArray(raw.summary.formulaSheet)
            ? raw.summary.formulaSheet.map(String)
            : undefined,
          nextTopics: Array.isArray(raw.summary.nextTopics)
            ? raw.summary.nextTopics.map(String)
            : undefined,
        }
      : undefined;

  return {
    title: typeof raw.title === 'string' ? raw.title : 'Lesson',
    level: typeof raw.level === 'string' ? raw.level : undefined,
    estimatedDuration:
      typeof raw.estimatedDuration === 'number' ? raw.estimatedDuration : undefined,
    opening,
    objectives,
    theorySections,
    richMisconceptions,
    plainMisconceptions,
    workedExamples,
    practiceQuestions,
    quiz,
    summary,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function normalizeKey(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function makeReviewLinkResolver(sections: TheorySection[]) {
  return (question: Question): ReviewLink | undefined => {
    if (sections.length === 0) return undefined;
    const tail = normalizeKey(question.skillTag.split('.').pop() ?? '');
    if (tail !== '') {
      const hit = sections.find(
        (s) =>
          normalizeKey(s.id).includes(tail) || normalizeKey(s.title).includes(tail)
      );
      if (hit) return { href: `#section-${hit.id}`, label: hit.title };
    }
    return { href: '#theory' };
  };
}

function resolveMedia(p: string): string {
  if (p.startsWith('http')) return p;
  return `${API_URL}${p.startsWith('/') ? '' : '/'}${p}`;
}

// ---------------------------------------------------------------------------
// Presentational pieces
// ---------------------------------------------------------------------------

function SectionShell({
  id,
  step,
  title,
  active,
  hideTitle,
  children,
}: {
  id: string;
  step: number;
  title: string;
  active: boolean;
  hideTitle?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-label={hideTitle ? title : undefined}
      className="relative mt-14 scroll-mt-16 first:mt-10 lg:scroll-mt-8"
    >
      <a
        href={`#${id}`}
        aria-hidden="true"
        tabIndex={-1}
        className={`absolute -left-24 top-1.5 hidden w-[4.5rem] justify-end font-mono text-xs lg:flex ${
          active ? 'text-accent' : 'text-ink-muted'
        }`}
      >
        {step}
      </a>
      {!hideTitle && (
        <h2 className="font-heading text-2xl font-semibold">{title}</h2>
      )}
      {children}
    </section>
  );
}

/** Margin marker for nested items (theory subsections, worked-example steps). */
function MarginMarker({ text }: { text: string }) {
  return (
    <span
      aria-hidden="true"
      className="absolute -left-24 top-1.5 hidden w-[4.5rem] justify-end font-mono text-xs text-ink-muted lg:flex"
    >
      {text}
    </span>
  );
}

/** Quiet placeholder for interactive types the app doesn't support yet. */
function InteractivePlaceholder({ title }: { title?: string }) {
  return (
    <div className="mt-5 rounded-sm border border-grid-line bg-paper-raised p-5">
      {title && <p className="font-medium">{title}</p>}
      <p className={`text-sm text-ink-muted ${title ? 'mt-1' : ''}`}>
        An interactive diagram will appear here soon.
      </p>
    </div>
  );
}

function VennBlock({ title, config }: { title?: string; config: unknown }) {
  const cfg = (config ?? {}) as Record<string, unknown>;
  const a = Array.isArray(cfg.setA) ? cfg.setA.map(String) : null;
  const b = Array.isArray(cfg.setB) ? cfg.setB.map(String) : null;
  if (!a || !b) return <InteractivePlaceholder title={title} />;
  const authoredUniverse = Array.isArray(cfg.universalSet)
    ? cfg.universalSet.map(String)
    : null;
  const universe =
    authoredUniverse && authoredUniverse.length > 0
      ? authoredUniverse
      : Array.from(new Set([...a, ...b]));

  return (
    <div className="mt-5">
      {title && (
        <h3 className="font-heading text-lg font-semibold">{title}</h3>
      )}
      <VennBoard
        universe={universe}
        setA={{ label: 'A', members: a }}
        setB={{ label: 'B', members: b }}
      />
    </div>
  );
}

function ContentBlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="mt-5">
          {block.title && <h3 className="font-heading text-lg font-semibold">{block.title}</h3>}
          {block.body.split(/\n{2,}/).map((p, i) => (
            <p key={i} className="mt-3 leading-relaxed first:mt-2">
              <MathText>{p}</MathText>
            </p>
          ))}
        </div>
      );
    case 'latex-formula':
      return (
        <figure className="mt-5">
          <MathBlock tex={block.latex} className="py-1" />
          {(block.formulaName || block.description) && (
            <figcaption className="text-center text-sm text-ink-muted">
              {block.formulaName ?? block.description}
            </figcaption>
          )}
        </figure>
      );
    case 'gemini-diagram': {
      const hasCaption = Boolean(block.title || block.description);
      if (!block.imagePath && !hasCaption) return null;
      return (
        <figure className="mt-5">
          {block.imagePath && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolveMedia(block.imagePath)}
              alt={block.title ?? block.description ?? ''}
              className="w-full rounded-sm border border-grid-line"
            />
          )}
          {hasCaption && (
            <figcaption className="mt-2 text-sm text-ink-muted">
              {block.title && <span className="font-medium text-ink">{block.title}. </span>}
              {block.description && <MathText>{block.description}</MathText>}
            </figcaption>
          )}
        </figure>
      );
    }
    case 'svg-animation':
    case 'manim-animation':
      if (!block.videoPath) return null;
      return (
        <figure className="mt-5">
          <video
            src={resolveMedia(block.videoPath)}
            controls
            playsInline
            className="w-full rounded-sm border border-grid-line"
          />
          {(block.title || block.description) && (
            <figcaption className="mt-2 text-sm text-ink-muted">
              {block.title && <span className="font-medium text-ink">{block.title}. </span>}
              {block.description && <MathText>{block.description}</MathText>}
            </figcaption>
          )}
        </figure>
      );
    case 'interactive':
      if (String(block.interactiveType ?? '').toLowerCase().includes('venn')) {
        return (
          <VennBlock title={block.title} config={block.interactiveConfig} />
        );
      }
      return <InteractivePlaceholder title={block.title} />;
    default:
      return null;
  }
}

function TheorySectionView({
  section,
  marker,
}: {
  section: TheorySection;
  marker: string;
}) {
  return (
    <section
      id={`section-${section.id}`}
      className="relative mt-10 scroll-mt-16 first:mt-2 lg:scroll-mt-8"
    >
      <MarginMarker text={marker} />
      <h2 className="font-heading text-2xl font-semibold">
        <MathText>{section.title}</MathText>
      </h2>
      {section.introduction.trim() !== '' && (
        <p className="mt-3 leading-relaxed">
          <MathText>{section.introduction}</MathText>
        </p>
      )}
      {section.keyQuestion && (
        <p className="mt-3 italic text-ink-muted">
          <MathText>{section.keyQuestion}</MathText>
        </p>
      )}
      {section.content.map((block) => (
        <ContentBlockView key={block.id} block={block} />
      ))}
      {section.keyDefinitions && section.keyDefinitions.length > 0 && (
        <dl className="mt-6 space-y-3">
          {section.keyDefinitions.map((d) => (
            <div key={d.term} className="border-l border-grid-line pl-4">
              <dt className="font-medium">
                <MathText>{d.term}</MathText>
              </dt>
              <dd className="text-ink-muted">
                <MathText>{d.definition}</MathText>
              </dd>
              {d.example && (
                <dd className="mt-1 text-sm">
                  <MathText>{d.example}</MathText>
                </dd>
              )}
            </div>
          ))}
        </dl>
      )}
      {section.keyFormulas && section.keyFormulas.length > 0 && (
        <div className="mt-6 space-y-4">
          {section.keyFormulas.map((f) => (
            <figure key={f.name}>
              <MathBlock tex={f.latex} className="py-1" />
              <figcaption className="text-center text-sm text-ink-muted">
                <span className="font-medium text-ink">{f.name}.</span>{' '}
                {f.explanation && <MathText>{f.explanation}</MathText>}{' '}
                {f.whenToUse && <MathText>{f.whenToUse}</MathText>}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      {section.keyPoints && section.keyPoints.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
            Key points
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            {section.keyPoints.map((kp, i) => (
              <li key={i} className="leading-relaxed">
                <MathText>{kp}</MathText>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function MisconceptionPanel({ m }: { m: Misconception }) {
  return (
    <div className="rounded-sm border border-grid-line bg-paper-raised p-4 sm:p-5">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
        The trap
      </p>
      <p className="mt-1 text-ink-muted">
        <span aria-hidden="true" className="mr-1.5 text-developing">
          ✗
        </span>
        <s>
          <MathText>{m.wrongIdea}</MathText>
        </s>
      </p>
      {m.exampleOfMistake && (
        <p className="mt-1 text-sm text-ink-muted">
          <MathText>{m.exampleOfMistake}</MathText>
        </p>
      )}
      {m.whyWrong && (
        <p className="mt-2 text-sm text-ink-muted">
          <MathText>{m.whyWrong}</MathText>
        </p>
      )}
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
        The truth
      </p>
      <p className="mt-1">
        <span aria-hidden="true" className="mr-1.5 text-secure">
          ✓
        </span>
        <MathText>{m.correctUnderstanding}</MathText>
      </p>
      {m.correctExample && (
        <p className="mt-1 text-sm">
          <MathText>{m.correctExample}</MathText>
        </p>
      )}
    </div>
  );
}

function WorkedExampleView({ example }: { example: WorkedExample }) {
  return (
    <article className="mt-10 first:mt-4">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-medium leading-relaxed">
          <MathText>{example.question}</MathText>
        </p>
        {typeof example.marks === 'number' && (
          <span className="shrink-0 font-mono text-xs text-ink-muted">
            [{example.marks} marks]
          </span>
        )}
      </div>
      <ol className="mt-4 space-y-4">
        {example.steps.map((step) => (
          <li key={step.stepNumber} className="relative">
            <MarginMarker text={String(step.stepNumber)} />
            <p className="leading-relaxed">
              <span className="mr-2 font-mono text-xs text-ink-muted lg:hidden">
                {step.stepNumber}.
              </span>
              <MathText>{step.instruction}</MathText>
            </p>
            {step.working.trim() !== '' && (
              <p className="mt-1 pl-5 leading-relaxed lg:pl-0">
                <MathText>{step.working}</MathText>
              </p>
            )}
            {step.explanation && (
              <p className="mt-1 pl-5 text-sm text-ink-muted lg:pl-0">
                <MathText>{step.explanation}</MathText>
              </p>
            )}
            {step.commonError && (
              <p className="mt-1 pl-5 text-sm text-ink-muted lg:pl-0">
                <span aria-hidden="true" className="mr-1 text-developing">
                  ✗
                </span>
                Watch out: <MathText>{step.commonError}</MathText>
              </p>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-4 flex items-baseline gap-3 border-t border-grid-line pt-3">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
          Answer
        </span>
        <span className="font-medium">
          <MathText>{example.answer}</MathText>
        </span>
      </p>
      {example.examTip && (
        <p className="mt-2 text-sm text-ink-muted">
          <span className="font-medium">Exam tip:</span>{' '}
          <MathText>{example.examTip}</MathText>
        </p>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'not-found' }
  | { status: 'ready'; lesson: NormalizedLesson };

export default function LessonPage() {
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(String(params?.code ?? '')).toUpperCase();

  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [activeSection, setActiveSection] = useState('');
  const [heroFailed, setHeroFailed] = useState(false);

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const res = await fetch(
        `${API_URL}/api/education/topics/${encodeURIComponent(code)}/lesson`
      );
      if (res.status === 404) {
        setState({ status: 'not-found' });
        return;
      }
      if (!res.ok) {
        setState({ status: 'error' });
        return;
      }
      const data = await res.json();
      if (!data || data.success !== true || !data.lesson) {
        setState({ status: 'not-found' });
        return;
      }
      setState({ status: 'ready', lesson: normalizeLesson(data.lesson, code) });
    } catch {
      setState({ status: 'error' });
    }
  }, [code]);

  useEffect(() => {
    load();
  }, [load]);

  const lesson = state.status === 'ready' ? state.lesson : null;

  useEffect(() => {
    if (lesson) document.title = `${lesson.title} · Cambridge Maths`;
  }, [lesson]);

  // Nav sections present in this lesson, in reading order.
  const navSections: Array<{ id: string; label: string }> = [];
  if (lesson) {
    if (lesson.opening) navSections.push({ id: 'opening', label: 'Opening' });
    if (lesson.objectives.length > 0)
      navSections.push({ id: 'objectives', label: 'Objectives' });
    if (lesson.theorySections.length > 0)
      navSections.push({ id: 'theory', label: 'Theory' });
    if (lesson.richMisconceptions.length > 0 || lesson.plainMisconceptions.length > 0)
      navSections.push({ id: 'misconceptions', label: 'Traps' });
    if (lesson.workedExamples.length > 0)
      navSections.push({ id: 'worked-examples', label: 'Examples' });
    if (lesson.practiceQuestions.length > 0)
      navSections.push({ id: 'practice', label: 'Practice' });
    if (lesson.quiz) navSections.push({ id: 'quiz', label: 'Quiz' });
    if (lesson.summary) navSections.push({ id: 'summary', label: 'Summary' });
  }
  const stepOf = (id: string) =>
    navSections.findIndex((s) => s.id === id) + 1;

  // Scrollspy for the stepper + margin numbers.
  useEffect(() => {
    if (!lesson || navSections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px' }
    );
    for (const s of navSections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
    // navSections is derived from lesson; observing on lesson change is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson]);

  const backLink = (
    <Link
      href="/"
      className="inline-flex min-h-[44px] items-center text-sm font-medium text-accent underline-offset-4 hover:underline"
    >
      ← Back to the map
    </Link>
  );

  if (state.status === 'loading') {
    return (
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-8">
        {backLink}
        <p className="mt-8 text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
          {code}
        </p>
        <div className="mt-4 space-y-3" role="status" aria-label="Loading lesson">
          <div className="h-9 w-2/3 animate-pulse rounded-sm bg-grid-line" />
          <div className="h-4 w-full animate-pulse rounded-sm bg-grid-line" />
          <div className="h-4 w-5/6 animate-pulse rounded-sm bg-grid-line" />
        </div>
      </main>
    );
  }

  if (state.status === 'not-found') {
    return (
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-8">
        {backLink}
        <h1 className="mt-10 font-heading text-3xl font-semibold">
          This lesson isn&apos;t available yet.
        </h1>
        <p className="mt-3 max-w-[60ch] text-ink-muted">
          There&apos;s no lesson for {code} right now. The map shows which
          topics are live.
        </p>
      </main>
    );
  }

  if (state.status === 'error') {
    return (
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-8">
        {backLink}
        <h1 className="mt-10 font-heading text-3xl font-semibold">
          Couldn&apos;t load this lesson.
        </h1>
        <p className="mt-3 max-w-[60ch] text-ink-muted">
          Something went wrong fetching {code}. Check your connection and try
          again.
        </p>
        <button
          type="button"
          onClick={load}
          className="mt-6 min-h-[44px] rounded-sm bg-accent px-5 font-medium text-paper transition-colors duration-150 ease-out-quart hover:bg-accent-pressed"
        >
          Retry
        </button>
      </main>
    );
  }

  if (!lesson) return null;

  const resolveReviewLink = makeReviewLinkResolver(lesson.theorySections);
  const heroSrc = `/illustrations/${code.toLowerCase()}-hook.png`;

  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-8">
      {backLink}

      <header className="mt-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
          {code} · Cambridge International A Level Mathematics 9709
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight sm:text-4xl">
          <MathText>{lesson.title}</MathText>
        </h1>
        {(lesson.level !== undefined || lesson.estimatedDuration !== undefined) && (
          <p className="mt-2 text-sm text-ink-muted">
            {[
              lesson.level,
              lesson.estimatedDuration !== undefined
                ? `about ${lesson.estimatedDuration} min`
                : undefined,
            ]
              .filter((x): x is string => Boolean(x))
              .join(' · ')}
          </p>
        )}
      </header>

      {/* Mobile: sticky horizontal stepper. ≥lg the margin column takes over. */}
      {navSections.length > 0 && (
        <nav
          aria-label="Lesson sections"
          className="sticky top-0 z-10 -mx-5 mt-6 border-b border-grid-line bg-paper px-5 lg:hidden"
        >
          <ol className="flex gap-5 overflow-x-auto whitespace-nowrap text-sm">
            {navSections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`flex min-h-[44px] items-center gap-1.5 border-b-2 transition-colors duration-150 ease-out-quart ${
                    activeSection === s.id
                      ? 'border-accent font-medium text-accent'
                      : 'border-transparent text-ink-muted'
                  }`}
                >
                  <span className="font-mono text-xs">{i + 1}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Margin rule at lg+: hairline at the content's left edge. */}
      <div className="relative lg:pl-24">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-[5.25rem] hidden w-px bg-grid-line lg:block"
        />

        {!heroFailed && (
          <div className="-mx-5 mt-8 sm:mx-0">
            <Image
              src={heroSrc}
              alt=""
              width={1536}
              height={1024}
              priority
              onError={() => setHeroFailed(true)}
              className="h-auto w-full border-y border-grid-line sm:rounded-sm sm:border"
            />
          </div>
        )}

        {lesson.opening && (
          <SectionShell
            id="opening"
            step={stepOf('opening')}
            title="Opening"
            hideTitle
            active={activeSection === 'opening'}
          >
            <p className="text-lg leading-relaxed">
              <MathText>{lesson.opening.hook}</MathText>
            </p>
            {lesson.opening.realWorldConnection && (
              <p className="mt-3 leading-relaxed text-ink-muted">
                <MathText>{lesson.opening.realWorldConnection}</MathText>
              </p>
            )}
          </SectionShell>
        )}

        {lesson.objectives.length > 0 && (
          <SectionShell
            id="objectives"
            step={stepOf('objectives')}
            title="By the end you can…"
            active={activeSection === 'objectives'}
          >
            <ul className="mt-4 space-y-2.5">
              {lesson.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-3 leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-3 w-3 shrink-0 rounded-[2px] border border-ink-muted opacity-50"
                  />
                  <MathText>{o}</MathText>
                </li>
              ))}
            </ul>
          </SectionShell>
        )}

        {lesson.theorySections.length > 0 && (
          <SectionShell
            id="theory"
            step={stepOf('theory')}
            title="Theory"
            hideTitle
            active={activeSection === 'theory'}
          >
            {lesson.theorySections.map((s, i) => (
              <TheorySectionView
                key={s.id}
                section={s}
                marker={`${stepOf('theory')}.${i + 1}`}
              />
            ))}
          </SectionShell>
        )}

        {(lesson.richMisconceptions.length > 0 ||
          lesson.plainMisconceptions.length > 0) && (
          <SectionShell
            id="misconceptions"
            step={stepOf('misconceptions')}
            title="Common traps"
            active={activeSection === 'misconceptions'}
          >
            {lesson.richMisconceptions.length > 0 && (
              <div className="mt-4 space-y-4">
                {lesson.richMisconceptions.map((m) => (
                  <MisconceptionPanel key={m.id ?? m.wrongIdea} m={m} />
                ))}
              </div>
            )}
            {lesson.plainMisconceptions.length > 0 && (
              <ul className="mt-4 space-y-2.5">
                {lesson.plainMisconceptions.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed text-ink-muted">
                    <span aria-hidden="true" className="text-developing">
                      ✗
                    </span>
                    <MathText>{t}</MathText>
                  </li>
                ))}
              </ul>
            )}
          </SectionShell>
        )}

        {lesson.workedExamples.length > 0 && (
          <SectionShell
            id="worked-examples"
            step={stepOf('worked-examples')}
            title="Worked examples"
            active={activeSection === 'worked-examples'}
          >
            {lesson.workedExamples.map((ex) => (
              <WorkedExampleView key={ex.id ?? ex.question} example={ex} />
            ))}
          </SectionShell>
        )}

        {lesson.practiceQuestions.length > 0 && (
          <SectionShell
            id="practice"
            step={stepOf('practice')}
            title="Practice"
            active={activeSection === 'practice'}
          >
            <div className="mt-4 space-y-4">
              {lesson.practiceQuestions.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  mode="practice"
                  label={`Practice question ${i + 1}`}
                  reviewLink={resolveReviewLink(q)}
                />
              ))}
            </div>
          </SectionShell>
        )}

        {lesson.quiz && (
          <SectionShell
            id="quiz"
            step={stepOf('quiz')}
            title="Quiz"
            active={activeSection === 'quiz'}
          >
            <div className="mt-4">
              <Quiz
                quiz={{
                  id: 'quiz',
                  title: 'Quiz',
                  description: lesson.quiz.description,
                  passingScore: lesson.quiz.passingScore,
                  questions: lesson.quiz.questions,
                }}
                topicCode={code}
                resolveReviewLink={resolveReviewLink}
              />
            </div>
          </SectionShell>
        )}

        {lesson.summary && (
          <SectionShell
            id="summary"
            step={stepOf('summary')}
            title="Summary"
            active={activeSection === 'summary'}
          >
            <div className="mt-4 rounded-sm border border-grid-line bg-paper-raised p-5">
              {lesson.summary.keyTakeaways.length > 0 && (
                <>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
                    Key takeaways
                  </p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5">
                    {lesson.summary.keyTakeaways.map((t, i) => (
                      <li key={i} className="leading-relaxed">
                        <MathText>{t}</MathText>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {lesson.summary.formulaSheet &&
                lesson.summary.formulaSheet.length > 0 && (
                  <>
                    <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
                      Formula sheet
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {lesson.summary.formulaSheet.map((f, i) => (
                        <li key={i}>
                          <MathText>{f}</MathText>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              {lesson.summary.examTips.length > 0 && (
                <>
                  <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
                    Exam tips
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {lesson.summary.examTips.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span aria-hidden="true" className="text-secure">
                          ✓
                        </span>
                        <MathText>{t}</MathText>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {lesson.summary.nextTopics &&
                lesson.summary.nextTopics.length > 0 && (
                  <p className="mt-5 text-sm text-ink-muted">
                    Next: {lesson.summary.nextTopics.join(' · ')}
                  </p>
                )}
            </div>
          </SectionShell>
        )}
      </div>
    </main>
  );
}
