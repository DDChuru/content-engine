'use client';

import { useEffect, useRef, useState } from 'react';
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
 * The browser's best guess at which country this is, as an ISO-3166-1 code.
 *
 * This is a DEFAULT, never an answer: it is prefilled, shown in words, and one tap
 * changes it. A guess presented as a fact is exactly the intrusive-and-wrong thing
 * the country question was written to avoid, so the picker says what it guessed
 * and why, and the student confirms by moving on.
 */
function guessCountry(): string | null {
  if (typeof navigator === 'undefined') return null;
  for (const tag of navigator.languages ?? [navigator.language]) {
    try {
      const region = new Intl.Locale(tag).maximize().region;
      if (region && /^[A-Z]{2}$/.test(region)) return region;
    } catch {
      // A malformed language tag is not worth an error; fall through to asking.
    }
  }
  return null;
}

/**
 * Country → board → level → session → subjects. Still five answers — the
 * enrolment record is unchanged and every field is still asked — but no longer
 * five screenfuls of choosing.
 *
 * Three things changed, all of them presentation:
 *
 * 1. COUNTRY IS PREFILLED from the browser's locale and shown as a sentence with a
 *    "change" beside it. It stays a real question; it is just already answered for
 *    most people.
 * 2. A SINGLE OPTION IS NOT A QUESTION. Where a country sits exactly one board, or
 *    a board offers exactly one level, it is chosen automatically and appears in
 *    the summary line rather than as a select with one entry. Presenting one
 *    option and calling it a choice wastes a tap and teaches a student that this
 *    form is not worth reading.
 * 3. ANSWERED STEPS COLLAPSE into one line at the top, so a phone shows the
 *    question being asked rather than the four already settled.
 *
 * What did NOT change: the data model, the order, the filtering, or the
 * availability line on every subject row. Nothing is inferred into the record that
 * the student did not see and pass.
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

  /** Which collapsed step the student has reopened, if any. */
  const [editing, setEditing] = useState<'country' | 'body' | 'level' | null>(null);
  /** True while country holds a guess the student has not confirmed or changed. */
  const [countryGuessed, setCountryGuessed] = useState(false);
  const guessTried = useRef(false);
  const autoBody = useRef<string | null>(null);
  const autoLevel = useRef<string | null>(null);

  // Prefill the country, once, and only if the catalogue actually offers it.
  useEffect(() => {
    if (guessTried.current || !countries || value.countryCode) return;
    guessTried.current = true;
    const guess = guessCountry();
    if (guess && countries.some((c) => c.code === guess)) {
      setCountryGuessed(true);
      onChange({ ...EMPTY_ENROLMENT, countryCode: guess });
    }
  }, [countries, value.countryCode, onChange]);

  // One board in this country → not a question. Recorded, shown, reversible.
  useEffect(() => {
    if (!value.countryCode || value.bodyId || !bodies || bodies.length !== 1) return;
    const only = bodies[0].bodyId;
    if (autoBody.current === `${value.countryCode}:${only}`) return;
    autoBody.current = `${value.countryCode}:${only}`;
    onChange({ ...EMPTY_ENROLMENT, countryCode: value.countryCode, bodyId: only });
  }, [bodies, value.countryCode, value.bodyId, onChange]);

  // Same for a board that offers exactly one level here.
  useEffect(() => {
    if (!value.bodyId || value.levelId || !levels || levels.length !== 1) return;
    const only = levels[0].levelId;
    if (autoLevel.current === `${value.bodyId}:${only}`) return;
    autoLevel.current = `${value.bodyId}:${only}`;
    onChange({ ...value, levelId: only, sessionId: '', subjectIds: [] });
  }, [levels, value, onChange]);

  const country = countries?.find((c) => c.code === value.countryCode);
  const body = bodies?.find((b) => b.bodyId === value.bodyId);
  const level = levels?.find((l) => l.levelId === value.levelId);
  const sessions = sessionData?.sessions ?? [];
  const series = sessionData?.series ?? [];

  const bodyWasOnlyOption = bodies?.length === 1;
  const levelWasOnlyOption = levels?.length === 1;

  const chosenPlanned = (subjects ?? []).filter(
    (s) => value.subjectIds.includes(s.id) && s.availability === 'planned'
  );
  const readyCount = (subjects ?? []).filter((s) => s.availability !== 'planned').length;

  // A step is shown expanded when it is unanswered, or when it was reopened.
  const showCountry = !value.countryCode || editing === 'country';
  const showBody = Boolean(value.countryCode) && (!value.bodyId || editing === 'body');
  const showLevel = Boolean(value.bodyId) && (!value.levelId || editing === 'level');

  const settled: { key: 'country' | 'body' | 'level'; label: string; auto: boolean }[] = [];
  if (value.countryCode && !showCountry) {
    settled.push({
      key: 'country',
      label: country?.title ?? value.countryCode,
      auto: countryGuessed,
    });
  }
  if (value.bodyId && !showBody) {
    settled.push({
      key: 'body',
      label: body?.shortTitle ?? value.bodyId,
      auto: Boolean(bodyWasOnlyOption),
    });
  }
  if (value.levelId && !showLevel) {
    settled.push({
      key: 'level',
      label: level?.title ?? value.levelId,
      auto: Boolean(levelWasOnlyOption),
    });
  }

  return (
    <div className="space-y-6">
      {/* The answered steps, as one line. */}
      {settled.length > 0 ? (
        <div className="rounded-lg border border-grid-line bg-paper px-3 py-2.5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Sitting
          </p>
          <ul className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            {settled.map((s, i) => (
              <li key={s.key} className="flex items-center gap-2">
                {i > 0 ? (
                  <span aria-hidden="true" className="text-ink-muted">
                    ·
                  </span>
                ) : null}
                <span className="font-semibold text-ink">{s.label}</span>
                <button
                  type="button"
                  onClick={() => setEditing(s.key)}
                  className="text-xs font-semibold text-accent underline underline-offset-2"
                >
                  change
                </button>
              </li>
            ))}
          </ul>
          {settled.some((s) => s.auto) ? (
            <WhyNote>
              {settled.find((s) => s.key === 'country' && s.auto)
                ? 'We guessed your country from your phone’s language setting and filled it in. '
                : ''}
              {settled.some((s) => s.key !== 'country' && s.auto)
                ? 'Where there was only one option we chose it rather than asking you to pick from a list of one. '
                : ''}
              Every one of these is still recorded as your answer, so check it and
              change anything that is wrong.
            </WhyNote>
          ) : null}
        </div>
      ) : null}

      {/* 1 — country. The top layer: it decides which boards exist below it. */}
      {showCountry ? (
        <div>
          <FieldLabel htmlFor="examCountry">Where are you sitting your exams?</FieldLabel>
          <select
            id="examCountry"
            name="examCountry"
            value={value.countryCode}
            onChange={(e) => {
              setCountryGuessed(false);
              setEditing(null);
              autoBody.current = null;
              autoLevel.current = null;
              onChange({ ...EMPTY_ENROLMENT, countryCode: e.target.value });
            }}
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
      ) : null}

      {/* 2 — exam board, filtered by country */}
      {showBody ? (
        <div>
          <FieldLabel htmlFor="examBody">Exam board</FieldLabel>
          <select
            id="examBody"
            name="examBody"
            value={value.bodyId}
            onChange={(e) => {
              setEditing(null);
              autoLevel.current = null;
              onChange({
                ...EMPTY_ENROLMENT,
                countryCode: value.countryCode,
                bodyId: e.target.value,
              });
            }}
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
      {showLevel ? (
        <div>
          <FieldLabel htmlFor="examLevel">Level</FieldLabel>
          <select
            id="examLevel"
            name="examLevel"
            value={value.levelId}
            onChange={(e) => {
              setEditing(null);
              onChange({
                ...value,
                levelId: e.target.value,
                // Series differ by level at Edexcel, so a session chosen under
                // the previous level may not exist under this one.
                sessionId: '',
                subjectIds: [],
              });
            }}
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
