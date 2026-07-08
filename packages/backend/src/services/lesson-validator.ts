/**
 * Canonical lesson validator.
 *
 * Runtime gate for the frozen lesson schema (see
 * packages/shared/src/types/lesson-schema.ts and docs/LESSON-SCHEMA.md).
 *
 * Plain TypeScript, no external dependencies. Operates on `unknown` and MUST
 * NEVER throw — it returns a list of human-readable errors so callers can
 * decide whether to block (new lessons) or warn (legacy lessons still loading).
 * Every traversal is guarded, and the whole body is wrapped in a try/catch
 * backstop, because the GET route runs this on arbitrary file/Firestore JSON.
 *
 * Coverage rule: every REQUIRED (non-optional) field of every exported type in
 * the canonical schema is checked here. Optional container fields (e.g. scorm,
 * priorKnowledge) are validated only when present.
 *
 * Rule: no new lesson ships unless `validateLesson` returns `{ valid: true }`.
 */

export interface LessonValidationResult {
  valid: boolean;
  errors: string[];
}

const DIFFICULTIES = ['foundation', 'core', 'extended'];
const EXAM_WEIGHTS = ['low', 'medium', 'high'];
const LESSON_LEVELS = ['Core', 'Extended'];
const QUESTION_TYPES = ['multiple-choice', 'numeric', 'short-answer', 'true-false'];
const CONTENT_BLOCK_TYPES = [
  'gemini-diagram',
  'svg-animation',
  'manim-animation',
  'latex-formula',
  'interactive',
  'text',
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

/** True only for plain (non-null, non-array) objects — safe to use `in` / prop access. */
function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateLesson(json: unknown): LessonValidationResult {
  const errors: string[] = [];
  const push = (message: string) => errors.push(message);

  // Field-level helpers (assume `obj` is already a confirmed object).
  const reqStr = (obj: Record<string, any>, field: string, label: string) => {
    if (!isNonEmptyString(obj[field])) push(`${label}.${field} must be a non-empty string`);
  };
  const reqNum = (obj: Record<string, any>, field: string, label: string) => {
    if (typeof obj[field] !== 'number') push(`${label}.${field} must be a number`);
  };
  const reqBool = (obj: Record<string, any>, field: string, label: string) => {
    if (typeof obj[field] !== 'boolean') push(`${label}.${field} must be a boolean`);
  };
  const reqArr = (obj: Record<string, any>, field: string, label: string) => {
    if (!Array.isArray(obj[field])) push(`${label}.${field} must be an array`);
  };
  const reqNonEmptyArr = (obj: Record<string, any>, field: string, label: string) => {
    if (!Array.isArray(obj[field]) || obj[field].length === 0) {
      push(`${label}.${field} must be a non-empty array`);
    }
  };

  try {
    if (!isObject(json)) {
      return { valid: false, errors: ['Lesson must be a JSON object'] };
    }

    const lesson = json;

    // --- Required scalar top-level fields ------------------------------------
    for (const field of ['id', 'topicCode', 'title']) {
      if (!isNonEmptyString(lesson[field])) push(`Missing or empty required field: ${field}`);
    }
    if (!LESSON_LEVELS.includes(lesson.level)) {
      push(`Invalid level: expected Core|Extended, got ${JSON.stringify(lesson.level)}`);
    }
    if (!DIFFICULTIES.includes(lesson.difficulty)) {
      push(
        `Invalid lesson difficulty: expected foundation|core|extended, got ${JSON.stringify(lesson.difficulty)}`
      );
    }

    // --- opening (LessonOpening) ---------------------------------------------
    if (!isObject(lesson.opening)) {
      push('opening must be an object with hook and realWorldConnection');
    } else {
      reqStr(lesson.opening, 'hook', 'opening');
      reqStr(lesson.opening, 'realWorldConnection', 'opening');
    }

    // --- objectives (LearningObjective[]) ------------------------------------
    if (!Array.isArray(lesson.objectives) || lesson.objectives.length === 0) {
      push('objectives must be a non-empty array');
    } else {
      lesson.objectives.forEach((obj: unknown, i: number) => {
        const label = `objectives[${i}]`;
        if (!isObject(obj)) {
          push(`${label} must be an object`);
          return;
        }
        reqStr(obj, 'id', label);
        reqStr(obj, 'verb', label);
        reqStr(obj, 'description', label);
        reqBool(obj, 'assessable', label);
        if (!EXAM_WEIGHTS.includes(obj.examWeight)) {
          push(`${label} invalid examWeight: ${JSON.stringify(obj.examWeight)}`);
        }
      });
    }

    // --- theorySections (TheorySection[]) + typed content blocks -------------
    if (!Array.isArray(lesson.theorySections) || lesson.theorySections.length === 0) {
      push('theorySections must be a non-empty array');
    } else {
      lesson.theorySections.forEach((section: unknown, si: number) => {
        const label = `theorySections[${si}]`;
        if (!isObject(section)) {
          push(`${label} must be an object`);
          return;
        }
        reqStr(section, 'id', label);
        reqStr(section, 'title', label);
        reqNum(section, 'order', label);
        reqStr(section, 'introduction', label);

        if (!Array.isArray(section.content)) {
          push(`${label}.content must be an array`);
        } else {
          section.content.forEach((block: unknown, bi: number) =>
            validateContentBlock(block, `${label}.content[${bi}]`)
          );
        }

        // Optional keyDefinitions / keyFormulas: required fields when present
        if (section.keyDefinitions !== undefined && !Array.isArray(section.keyDefinitions)) {
          push(`${label}.keyDefinitions must be an array`);
        }
        if (Array.isArray(section.keyDefinitions)) {
          section.keyDefinitions.forEach((d: unknown, di: number) => {
            const dl = `${label}.keyDefinitions[${di}]`;
            if (!isObject(d)) { push(`${dl} must be an object`); return; }
            reqStr(d, 'term', dl);
            reqStr(d, 'definition', dl);
          });
        }
        if (section.keyFormulas !== undefined && !Array.isArray(section.keyFormulas)) {
          push(`${label}.keyFormulas must be an array`);
        }
        if (Array.isArray(section.keyFormulas)) {
          section.keyFormulas.forEach((f: unknown, fi: number) => {
            const fl = `${label}.keyFormulas[${fi}]`;
            if (!isObject(f)) { push(`${fl} must be an object`); return; }
            reqStr(f, 'name', fl);
            reqStr(f, 'latex', fl);
          });
        }
      });
    }

    // --- summaryVideo (optional; SummaryVideo) -------------------------------
    if ('summaryVideo' in lesson && lesson.summaryVideo !== undefined) {
      if (!isObject(lesson.summaryVideo)) {
        push('summaryVideo must be an object');
      } else {
        reqStr(lesson.summaryVideo, 'title', 'summaryVideo');
        reqStr(lesson.summaryVideo, 'videoPath', 'summaryVideo');
      }
    }

    // --- workedExamples (WorkedExample[]) ------------------------------------
    if (!Array.isArray(lesson.workedExamples)) {
      push('workedExamples must be an array');
    } else {
      lesson.workedExamples.forEach((ex: unknown, i: number) => {
        const label = `workedExamples[${i}]`;
        if (!isObject(ex)) {
          push(`${label} must be an object`);
          return;
        }
        reqStr(ex, 'id', label);
        if (!DIFFICULTIES.includes(ex.difficulty)) {
          push(`${label} invalid difficulty: ${JSON.stringify(ex.difficulty)}`);
        }
        reqStr(ex, 'questionType', label);
        reqStr(ex, 'question', label);
        reqStr(ex, 'answer', label);
        if (!Array.isArray(ex.steps)) {
          push(`${label}.steps must be an array`);
        } else {
          ex.steps.forEach((step: unknown, sidx: number) => {
            const sl = `${label}.steps[${sidx}]`;
            if (!isObject(step)) {
              push(`${sl} must be an object`);
              return;
            }
            reqNum(step, 'stepNumber', sl);
            reqStr(step, 'instruction', sl);
            reqStr(step, 'working', sl);
          });
        }
      });
    }

    // --- summary (LessonSummary) ---------------------------------------------
    if (!isObject(lesson.summary)) {
      push('summary must be an object with keyTakeaways and examTips');
    } else {
      reqNonEmptyArr(lesson.summary, 'keyTakeaways', 'summary');
      reqNonEmptyArr(lesson.summary, 'examTips', 'summary');
    }

    // --- quiz (Quiz) metadata ------------------------------------------------
    if (!isObject(lesson.quiz)) {
      push('quiz must be an object');
    } else {
      reqStr(lesson.quiz, 'id', 'quiz');
      reqStr(lesson.quiz, 'title', 'quiz');
      reqNum(lesson.quiz, 'passingScore', 'quiz');
      reqArr(lesson.quiz, 'questions', 'quiz');
    }

    // --- practiceQuestions ---------------------------------------------------
    if (!Array.isArray(lesson.practiceQuestions)) {
      push('practiceQuestions must be an array');
    }

    // --- Optional container types: required fields when present --------------
    if (lesson.priorKnowledge !== undefined && !Array.isArray(lesson.priorKnowledge)) {
      push('priorKnowledge must be an array');
    }
    if (Array.isArray(lesson.priorKnowledge)) {
      lesson.priorKnowledge.forEach((pk: unknown, i: number) => {
        const label = `priorKnowledge[${i}]`;
        if (!isObject(pk)) { push(`${label} must be an object`); return; }
        reqStr(pk, 'topicCode', label);
        reqStr(pk, 'topicTitle', label);
        reqArr(pk, 'specificConcepts', label);
      });
    }
    if (lesson.misconceptions !== undefined && !Array.isArray(lesson.misconceptions)) {
      push('misconceptions must be an array');
    }
    if (Array.isArray(lesson.misconceptions)) {
      lesson.misconceptions.forEach((m: unknown, i: number) => {
        const label = `misconceptions[${i}]`;
        if (!isObject(m)) { push(`${label} must be an object`); return; }
        reqStr(m, 'id', label);
        reqStr(m, 'wrongIdea', label);
        reqStr(m, 'whyWrong', label);
        reqStr(m, 'correctUnderstanding', label);
      });
    }
    if ('scorm' in lesson && lesson.scorm !== undefined) {
      if (!isObject(lesson.scorm)) {
        push('scorm must be an object');
      } else {
        reqStr(lesson.scorm, 'identifier', 'scorm');
        reqStr(lesson.scorm, 'title', 'scorm');
        if (!Array.isArray(lesson.scorm.objectives)) {
          push('scorm.objectives must be an array');
        } else {
          lesson.scorm.objectives.forEach((o: unknown, i: number) => {
            const label = `scorm.objectives[${i}]`;
            if (!isObject(o)) { push(`${label} must be an object`); return; }
            reqStr(o, 'id', label);
            reqStr(o, 'description', label);
            reqNum(o, 'successThreshold', label);
          });
        }
      }
    }
    if ('generation' in lesson && lesson.generation !== undefined) {
      if (!isObject(lesson.generation)) {
        push('generation must be an object');
      } else {
        reqStr(lesson.generation, 'generatedAt', 'generation');
        reqStr(lesson.generation, 'generatedBy', 'generation');
      }
    }

    // --- Questions (practice + quiz + optional priorKnowledgeCheck) ----------
    const seenIds = new Set<string>();

    const validateQuestion = (q: unknown, label: string) => {
      if (!isObject(q)) {
        push(`${label} must be an object`);
        return;
      }

      const ref = isNonEmptyString(q.id) ? q.id : '?';

      // Stable, lesson-unique id
      if (!isNonEmptyString(q.id)) {
        push(`${label} missing stable id`);
      } else if (seenIds.has(q.id)) {
        push(`Duplicate question id: ${q.id}`);
      } else {
        seenIds.add(q.id);
      }

      // QuestionBase required fields
      if (!isNonEmptyString(q.skillTag)) push(`${label} (${ref}) missing skillTag`);
      if (!isNonEmptyString(q.question)) push(`${label} (${ref}) missing question text`);
      if (!DIFFICULTIES.includes(q.difficulty)) {
        push(`${label} (${ref}) invalid difficulty: ${JSON.stringify(q.difficulty)}`);
      }
      if (!isNonEmptyString(q.feedbackCorrect)) push(`${label} (${ref}) missing feedbackCorrect`);
      if (!isNonEmptyString(q.feedbackIncorrect)) push(`${label} (${ref}) missing feedbackIncorrect`);
      if (!QUESTION_TYPES.includes(q.questionType)) {
        push(`${label} (${ref}) invalid questionType: ${JSON.stringify(q.questionType)}`);
      }

      // Canonical answer encoding (discriminated union)
      if (q.questionType === 'multiple-choice') {
        if (!Array.isArray(q.options) || q.options.length === 0) {
          push(`${label} (${ref}) multiple-choice requires non-empty options[]`);
        } else {
          const optionIds = new Set<string>();
          q.options.forEach((opt: unknown, oi: number) => {
            if (!isObject(opt)) {
              push(`${label} (${ref}) options[${oi}] must be an object`);
              return;
            }
            if (!isNonEmptyString(opt.id)) {
              push(`${label} (${ref}) options[${oi}] missing id`);
            } else if (optionIds.has(opt.id)) {
              push(`${label} (${ref}) duplicate option id: ${opt.id}`);
            } else {
              optionIds.add(opt.id);
            }
            if (!isNonEmptyString(opt.text)) push(`${label} (${ref}) options[${oi}] missing text`);
            if ('isCorrect' in opt) {
              push(`${label} (${ref}) options[${oi}] uses legacy isCorrect flag; use correctOptionId`);
            }
          });

          if (!isNonEmptyString(q.correctOptionId)) {
            push(`${label} (${ref}) missing correctOptionId`);
          } else if (!optionIds.has(q.correctOptionId)) {
            push(`${label} (${ref}) correctOptionId "${q.correctOptionId}" does not match any option id`);
          }
        }

        // Reject ALL legacy answer encodings on multiple-choice
        if ('correctAnswer' in q) {
          push(`${label} (${ref}) multiple-choice must not carry correctAnswer (legacy string/numeric-index); use correctOptionId`);
        }
        if ('answer' in q) {
          push(`${label} (${ref}) multiple-choice must not carry a legacy answer field; use correctOptionId`);
        }
      } else {
        if (!isNonEmptyString(q.correctAnswer)) {
          push(`${label} (${ref}) non-multiple-choice question requires a correctAnswer string`);
        }
      }
    };

    if (Array.isArray(lesson.practiceQuestions)) {
      lesson.practiceQuestions.forEach((q: unknown, i: number) =>
        validateQuestion(q, `practiceQuestions[${i}]`)
      );
    }
    if (isObject(lesson.quiz) && Array.isArray(lesson.quiz.questions)) {
      lesson.quiz.questions.forEach((q: unknown, i: number) =>
        validateQuestion(q, `quiz.questions[${i}]`)
      );
    }
    if (lesson.priorKnowledgeCheck !== undefined && !Array.isArray(lesson.priorKnowledgeCheck)) {
      push('priorKnowledgeCheck must be an array');
    }
    if (Array.isArray(lesson.priorKnowledgeCheck)) {
      lesson.priorKnowledgeCheck.forEach((q: unknown, i: number) =>
        validateQuestion(q, `priorKnowledgeCheck[${i}]`)
      );
    }

    return { valid: errors.length === 0, errors };
  } catch (err: any) {
    // Last-resort backstop: honor the never-throw contract no matter what.
    return {
      valid: false,
      errors: [`validator internal error: ${err?.message ?? String(err)}`],
    };
  }

  // -------------------------------------------------------------------------
  // Typed content-block validation (ContentBlockBase + per-type requirements)
  // -------------------------------------------------------------------------
  function validateContentBlock(block: unknown, label: string) {
    if (!isObject(block)) {
      push(`${label} must be an object`);
      return;
    }

    // ContentBlockBase: id required
    if (!isNonEmptyString(block.id)) push(`${label} missing id`);

    // Discriminant: type required and must be one of the union members
    if (!CONTENT_BLOCK_TYPES.includes(block.type)) {
      push(`${label} invalid content block type: ${JSON.stringify(block.type)}`);
    } else {
      // Per-type required fields
      switch (block.type) {
        case 'gemini-diagram':
          if (!isNonEmptyString(block.geminiPrompt)) push(`${label} (gemini-diagram) missing geminiPrompt`);
          break;
        case 'latex-formula':
          if (!isNonEmptyString(block.latex)) push(`${label} (latex-formula) missing latex`);
          break;
        case 'interactive':
          if (!isNonEmptyString(block.interactiveType)) push(`${label} (interactive) missing interactiveType`);
          if (!isObject(block.interactiveConfig)) push(`${label} (interactive) interactiveConfig must be an object`);
          break;
        case 'text':
          if (!isNonEmptyString(block.body)) push(`${label} (text) missing body`);
          break;
        // svg-animation and manim-animation have no additional required fields
      }
    }

    // Media path refs: non-empty when present
    for (const key of ['imagePath', 'videoPath']) {
      if (key in block && !isNonEmptyString(block[key])) {
        push(`${label}.${key} must be a non-empty string`);
      }
    }
  }
}
