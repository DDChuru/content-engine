'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  AVAILABILITY_LABEL,
  MAX_SUBJECTS,
  type SubjectAvailability,
} from '@/lib/exam-catalogue';
import { FieldLabel, WhyNote, inputClass } from '@/components/auth-shell';

export interface EnrolmentDraft {
  countryCode: string;
  bodyId: string;
  levelId: string;
  sessionId: string;
  subjectIds: string[];
}

export const EMPTY_ENROLMENT: EnrolmentDraft = {
  countryCode: '',
  bodyId: '',
  levelId: '',
  sessionId: '',
  subjectIds: [],
};

export function enrolmentComplete(d: EnrolmentDraft): boolean {
  return (
    d.countryCode !== '' &&
    d.bodyId !== '' &&
    d.levelId !== '' &&
    d.sessionId !== '' &&
    d.subjectIds.length > 0 &&
    d.subjectIds.length <= MAX_SUBJECTS
  );
}

/**
 * Five questions that narrow: country → board → level → session → subjects. Each
 * appears once the one above it is answered, because until you know the country
 * you cannot honestly offer a board — Edexcel International is not sat in the UK,
 * ZIMSEC is not sat in South Africa — and until you know the level the subject
 * list is a guess.
 *
 * Country is first and it is a real filter, not a form field we file away. It is
 * a MANY-TO-MANY: Zimbabwe sits both ZIMSEC and Cambridge, South Africa sits the
 * NSC and Cambridge and Edexcel, and Cambridge is in all of them. The join lives
 * in Convex; this component just asks.
 *
 * Every list here comes from the catalogue tables, so adding a board is an admin
 * edit and not a deploy. The subject list still tells the truth about what exists:
 * availability is derived from the library and printed on each row, in the same
 * type size as the subject name.
 */
export function ExamEnrolmentPicker({
  value,
  onChange,
}: {
  value: EnrolmentDraft;
  onChange: (next: EnrolmentDraft) => void;
}) {
  const countries = useQuery(api.examCatalogue.countries, {});
  const bodies = useQuery(
    api.examCatalogue.bodies,
    value.countryCode ? { countryCode: value.countryCode } : 'skip'
  );
  const levels = useQuery(
    api.examCatalogue.levels,
    value.countryCode && value.bodyId
      ? { countryCode: value.countryCode, bodyId: value.bodyId }
      : 'skip'
  );
  const sessionData = useQuery(
    api.examCatalogue.sessions,
    value.bodyId && value.levelId
      ? { bodyId: value.bodyId, levelId: value.levelId }
      : 'skip'
  );
  const subjects = useQuery(
    api.examCatalogue.subjects,
    value.bodyId && value.levelId
      ? { bodyId: value.bodyId, levelId: value.levelId }
      : 'skip'
  );

  const country = countries?.find((c) => c.code === value.countryCode);
  const body = bodies?.find((b) => b.bodyId === value.bodyId);
  const level = levels?.find((l) => l.levelId === value.levelId);
  const sessions = sessionData?.sessions ?? [];
  const series = sessionData?.series ?? [];

  // Only the untouched ones. A partly-written subject gets its own note on its
  // own row and must not be swept into "we have not written this".
  const chosenPlanned = (subjects ?? []).filter(
    (s) => value.subjectIds.includes(s.id) && s.availability === 'planned'
  );
  // Counted, never asserted: the sentence above the list has to stay true when
  // a second subject ships, and when a level has nothing at all.
  const readyCount = (subjects ?? []).filter(
    (s) => s.availability !== 'planned'
  ).length;

  return (
    <div className="space-y-6">
      {/* 1 — country. The top layer: it decides which boards exist below it. */}
      <div>
        <FieldLabel htmlFor="examCountry">Where are you sitting your exams?</FieldLabel>
        <select
          id="examCountry"
          name="examCountry"
          value={value.countryCode}
          onChange={(e) =>
            onChange({ ...EMPTY_ENROLMENT, countryCode: e.target.value })
          }
          required
          className={inputClass}
        >
          <option value="">Choose a country…</option>
          {(countries ?? []).map((c) => (
            <option key={c.code} value={c.code}>
              {c.title}
            </option>
          ))}
        </select>
        {country?.note ? <WhyNote>{country.note}</WhyNote> : null}
        <WhyNote>
          Not every board is sat everywhere: Zimbabwe has ZIMSEC and Cambridge,
          South Africa has the NSC as well as Cambridge and Edexcel, and Pearson
          Edexcel International is not available to candidates studying in the UK.
          This is what we filter the next question by, so you are only shown boards
          you could actually enter for.
        </WhyNote>
      </div>

      {/* 2 — exam board, filtered by country */}
      {value.countryCode ? (
        <div>
          <FieldLabel htmlFor="examBody">Exam board</FieldLabel>
          <select
            id="examBody"
            name="examBody"
            value={value.bodyId}
            onChange={(e) =>
              onChange({
                ...EMPTY_ENROLMENT,
                countryCode: value.countryCode,
                bodyId: e.target.value,
              })
            }
            required
            className={inputClass}
          >
            <option value="">
              {bodies === undefined ? 'Loading…' : 'Choose a board…'}
            </option>
            {(bodies ?? []).map((b) => (
              <option key={b.bodyId} value={b.bodyId}>
                {b.shortTitle} — {b.title}
              </option>
            ))}
          </select>
          {bodies?.length === 0 ? (
            <WhyNote>
              We do not have any boards listed for {country?.title ?? 'that country'}{' '}
              yet. Choose &ldquo;Somewhere else&rdquo; above and tell us — the list
              is managed by hand and we can add yours.
            </WhyNote>
          ) : null}
          {body?.countryNote ? <WhyNote>{body.countryNote}</WhyNote> : null}
          {body ? <WhyNote>{body.hint}</WhyNote> : null}
          <WhyNote>
            Boards set different papers for the same subject name, so this decides
            everything under it — which levels exist, when the sittings are, and
            which syllabus a marked answer is judged against.
          </WhyNote>
        </div>
      ) : null}

      {/* 3 — level */}
      {value.bodyId ? (
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
            <option value="">
              {levels === undefined ? 'Loading…' : 'Choose a level…'}
            </option>
            {(levels ?? []).map((l) => (
              <option key={l.levelId} value={l.levelId}>
                {l.title}
              </option>
            ))}
          </select>
          {level?.hint ? <WhyNote>{level.hint}</WhyNote> : null}
        </div>
      ) : null}

      {/* 4 — session: a year AND a series */}
      {value.bodyId && value.levelId ? (
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
            <option value="">
              {sessionData === undefined ? 'Loading…' : 'Choose a sitting…'}
            </option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
                {s.note ? ` — ${s.note}` : ''}
              </option>
            ))}
          </select>
          {level && body ? (
            <WhyNote>
              A sitting, not a year: {level.title} at {body.shortTitle} runs{' '}
              {series.map((x) => x.title).join(' and ')}, and how much time you have
              is the difference between them. Sittings whose papers are already
              written are not listed. If you resit, you tell us then — this answer is
              kept, not overwritten.
            </WhyNote>
          ) : null}
        </div>
      ) : null}

      {/* 5 — subjects */}
      {value.bodyId && value.levelId && value.sessionId ? (
        <fieldset>
          <legend className="block text-sm font-semibold text-ink">Subjects</legend>
          <p className="mt-1.5 text-[0.8rem] leading-relaxed text-ink-muted">
            Pick everything you are sitting, up to {MAX_SUBJECTS}.{' '}
            {readyCount === 0
              ? `We have not written anything for ${level?.title ?? 'this level'} yet, and every row below says so.`
              : `We have material for ${readyCount} of these today, and every row says where it stands.`}{' '}
            Choosing one we have not written is not a waste — it is the list we build
            from, in the order you ask for them.
          </p>
          <div className="mt-3 space-y-2">
            {(subjects ?? []).map((s) => {
              const checked = value.subjectIds.includes(s.id);
              const atCap = !checked && value.subjectIds.length >= MAX_SUBJECTS;
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
                      overridden={s.availabilityOverridden}
                    />
                  </span>
                </label>
              );
            })}
          </div>

          {chosenPlanned.length > 0 ? (
            <p className="mt-3 rounded-lg border border-grid-line bg-paper px-3 py-2.5 text-sm leading-relaxed text-ink">
              You have chosen {chosenPlanned.map((s) => s.title).join(', ')}, which we
              have not written yet. Your account will still be created and we will
              record that you asked. You will get an email when one of them is ready —
              and nothing will pretend to be there in the meantime.
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
  overridden,
}: {
  availability: SubjectAvailability;
  note?: string;
  overridden?: boolean;
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
      {/* An override is a human's claim, not the library's. Say which it is. */}
      {overridden ? ' (set by hand)' : ''}
    </span>
  );
}
