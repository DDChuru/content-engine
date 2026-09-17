'use client';

import { useMemo } from 'react';
import {
  AVAILABILITY_LABEL,
  EXAM_BODIES,
  MAX_SUBJECTS,
  findBody,
  findLevel,
  sessionsFor,
  type SubjectAvailability,
} from '@/lib/exam-catalogue';
import { FieldLabel, WhyNote, inputClass } from '@/components/auth-shell';

export interface EnrolmentDraft {
  bodyId: string;
  levelId: string;
  sessionId: string;
  subjectIds: string[];
}

export const EMPTY_ENROLMENT: EnrolmentDraft = {
  bodyId: '',
  levelId: '',
  sessionId: '',
  subjectIds: [],
};

export function enrolmentComplete(d: EnrolmentDraft): boolean {
  return (
    d.bodyId !== '' &&
    d.levelId !== '' &&
    d.sessionId !== '' &&
    d.subjectIds.length > 0 &&
    d.subjectIds.length <= MAX_SUBJECTS
  );
}

/**
 * Four questions that narrow: board → level → session → subjects. Each one only
 * appears once the one above it is answered, because until you know the board
 * you cannot honestly offer a level, and until you know the level the subject
 * list is a guess.
 *
 * The subject list tells the truth about what exists. One subject in the whole
 * catalogue has material today; the rest say so on their own row, in the same
 * type size as the subject name. Choosing one of them is still allowed — it is
 * how we learn what to write next — and the copy says that too, rather than
 * quietly dropping the answer.
 */
export function ExamEnrolmentPicker({
  value,
  onChange,
}: {
  value: EnrolmentDraft;
  onChange: (next: EnrolmentDraft) => void;
}) {
  const body = value.bodyId ? findBody(value.bodyId) : undefined;
  const level = value.levelId ? findLevel(value.bodyId, value.levelId) : undefined;
  const sessions = useMemo(
    () =>
      value.bodyId && value.levelId
        ? sessionsFor(value.bodyId, value.levelId)
        : [],
    [value.bodyId, value.levelId]
  );

  // Only the untouched ones. A partly-written subject gets its own note on its
  // own row and must not be swept into "we have not written this".
  const chosenPlanned = (level?.subjects ?? []).filter(
    (s) => value.subjectIds.includes(s.id) && s.availability === 'planned'
  );
  // Counted, never asserted: the sentence above the list has to stay true when
  // a second subject ships, and when a level has nothing at all.
  const readyCount = (level?.subjects ?? []).filter(
    (s) => s.availability !== 'planned'
  ).length;

  return (
    <div className="space-y-6">
      {/* 1 — exam board */}
      <div>
        <FieldLabel htmlFor="examBody">Exam board</FieldLabel>
        <select
          id="examBody"
          name="examBody"
          value={value.bodyId}
          onChange={(e) =>
            onChange({ ...EMPTY_ENROLMENT, bodyId: e.target.value })
          }
          required
          className={inputClass}
        >
          <option value="">Choose a board…</option>
          {EXAM_BODIES.map((b) => (
            <option key={b.id} value={b.id}>
              {b.shortTitle} — {b.title}
            </option>
          ))}
        </select>
        {body ? <WhyNote>{body.hint}</WhyNote> : null}
        <WhyNote>
          Boards set different papers for the same subject name, so this decides
          everything under it — which levels exist, when the sittings are, and
          which syllabus a marked answer is judged against.
        </WhyNote>
      </div>

      {/* 2 — level */}
      {body ? (
        <div>
          <FieldLabel htmlFor="examLevel">Level</FieldLabel>
          <select
            id="examLevel"
            name="examLevel"
            value={value.levelId}
            onChange={(e) =>
              onChange({
                ...value,
                levelId: e.target.value,
                // Series differ by level at Edexcel, so a session chosen under
                // the previous level may not exist under this one.
                sessionId: '',
                subjectIds: [],
              })
            }
            required
            className={inputClass}
          >
            <option value="">Choose a level…</option>
            {body.levels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>
          {level?.hint ? <WhyNote>{level.hint}</WhyNote> : null}
        </div>
      ) : null}

      {/* 3 — session: a year AND a series */}
      {body && level ? (
        <div>
          <FieldLabel htmlFor="examSession">Exam session</FieldLabel>
          <select
            id="examSession"
            name="examSession"
            value={value.sessionId}
            onChange={(e) => onChange({ ...value, sessionId: e.target.value })}
            required
            className={inputClass}
          >
            <option value="">Choose a sitting…</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
                {s.note ? ` — ${s.note}` : ''}
              </option>
            ))}
          </select>
          <WhyNote>
            A sitting, not a year: {level.title} at {body.shortTitle} runs{' '}
            {(level.series ?? body.series).map((x) => x.title).join(' and ')},
            and how much time you have is the difference between them. Sittings whose papers are
            already written are not listed. If you resit, you tell us then — this
            answer is kept, not overwritten.
          </WhyNote>
        </div>
      ) : null}

      {/* 4 — subjects */}
      {body && level && value.sessionId ? (
        <fieldset>
          <legend className="block text-sm font-semibold text-ink">
            Subjects
          </legend>
          <p className="mt-1.5 text-[0.8rem] leading-relaxed text-ink-muted">
            Pick everything you are sitting, up to {MAX_SUBJECTS}.{' '}
            {readyCount === 0
              ? `We have not written anything for ${level.title} yet, and every row below says so.`
              : `We have material for ${readyCount} of these today, and every row says where it stands.`}{' '}
            Choosing one we have not written is not a waste — it is the list we
            build from, in the order you ask for them.
          </p>
          <div className="mt-3 space-y-2">
            {level.subjects.map((s) => {
              const checked = value.subjectIds.includes(s.id);
              const atCap =
                !checked && value.subjectIds.length >= MAX_SUBJECTS;
              return (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border border-grid-line bg-paper px-3 py-2.5 text-ink has-[:checked]:border-accent ${
                    atCap ? 'opacity-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    name="subjects"
                    value={s.id}
                    checked={checked}
                    disabled={atCap}
                    onChange={() =>
                      onChange({
                        ...value,
                        subjectIds: checked
                          ? value.subjectIds.filter((x) => x !== s.id)
                          : [...value.subjectIds, s.id],
                      })
                    }
                    className="mt-0.5 accent-[var(--accent)]"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">
                      {s.title}
                      {s.code ? (
                        <span className="ml-1.5 font-normal text-ink-muted">
                          {s.code}
                        </span>
                      ) : null}
                    </span>
                    <AvailabilityLine
                      availability={s.availability}
                      note={s.note}
                    />
                  </span>
                </label>
              );
            })}
          </div>

          {chosenPlanned.length > 0 ? (
            <p className="mt-3 rounded-lg border border-grid-line bg-paper px-3 py-2.5 text-sm leading-relaxed text-ink">
              You have chosen{' '}
              {chosenPlanned.map((s) => s.title).join(', ')}, which we have
              not written yet. Your account will still be created and we will
              record that you asked. You will get an email when one of them is
              ready — and nothing will pretend to be there in the meantime.
            </p>
          ) : null}
        </fieldset>
      ) : null}
    </div>
  );
}

function AvailabilityLine({
  availability,
  note,
}: {
  availability: SubjectAvailability;
  note?: string;
}) {
  const tone =
    availability === 'available'
      ? 'text-accent'
      : availability === 'in_progress'
        ? 'text-ink'
        : 'text-ink-muted';
  return (
    <span className={`mt-0.5 block text-[0.8rem] leading-relaxed ${tone}`}>
      {AVAILABILITY_LABEL[availability]}
      {note ? ` — ${note}` : ''}
    </span>
  );
}
