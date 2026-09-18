/**
 * The join between an ENROLMENT and the LIBRARY.
 *
 * A student picks `cie-al-9709` in the exam picker; `lib/syllabus.ts` holds units
 * of topics; `public/notes/index.json` holds the notes and the video; and three
 * interactive artifacts live in `components/interactive`. Four things that each
 * knew nothing about the others. This file is the only place they meet, so the
 * through-line — subject → syllabus → topic → learn it — has one definition.
 *
 * It is deliberately a map with ONE subject in it. Every other subject in the
 * catalogue resolves to "nothing written", which is the honest default and is what
 * the subject page renders rather than an empty shell. When the second subject
 * ships it is one line here.
 */

import { UNITS, type SyllabusTopic, type SyllabusUnit } from './syllabus';

/** Catalogue subject id → the units of `lib/syllabus.ts` it is taught through. */
const SUBJECT_UNITS: Record<string, string[]> = {
  'cie-al-9709': ['M', 'P1'],
};

export interface ArtifactRef {
  /** Component key, resolved in components/interactive/registry.tsx. */
  id: 'friction-bench' | 'slope-resolver' | 'pulley-predict';
  title: string;
  /** Misconception codes it attacks, from content/misconceptions/mechanics.json. */
  codes: string;
}

/**
 * Topic code → the artifact whose misconception belongs to that topic.
 *
 * Read off the `code=` prop each artifact already declares, not invented here: the
 * friction bench names M4.1e-X01 and M4.4e-X01, so it is the hinge of both of
 * those topics and of neither of the others.
 */
const TOPIC_ARTIFACTS: Record<string, ArtifactRef> = {
  'M4.1e': { id: 'friction-bench', title: 'Friction takes only what it needs', codes: 'M4.1e-X01' },
  'M4.4e': { id: 'friction-bench', title: 'Friction takes only what it needs', codes: 'M4.4e-X01' },
  'M4.1d': { id: 'slope-resolver', title: 'Which one gets the sine?', codes: 'M4.1d-X01' },
  'M4.4d': { id: 'pulley-predict', title: 'The hanging mass is not falling freely', codes: 'M4.4d-X02' },
};

export function artifactForTopic(code: string): ArtifactRef | null {
  return TOPIC_ARTIFACTS[code] ?? null;
}

export function unitsForSubject(subjectId: string): SyllabusUnit[] {
  const codes = SUBJECT_UNITS[subjectId];
  if (!codes) return [];
  return codes
    .map((c) => UNITS.find((u) => u.code === c))
    .filter((u): u is SyllabusUnit => Boolean(u));
}

export function subjectHasContent(subjectId: string): boolean {
  return unitsForSubject(subjectId).some((u) => u.topics.some((t) => t.live));
}

/**
 * The notes slug behind a topic, where there is one.
 *
 * `href` is the field the map already links through, so the slug is derived from
 * it rather than stored a second time — two copies of a slug is exactly how a
 * topic page and a notes page drift apart. A topic pointing anywhere other than
 * `/notes/...` (P1.7 points at `/ink`) has no slug and keeps its own destination.
 */
export function notesSlug(topic: SyllabusTopic): string | null {
  const href = topic.href ?? '';
  return href.startsWith('/notes/') ? href.slice('/notes/'.length) : null;
}

/** Where a topic row goes. Its own page when we can assemble one, else its href. */
export function topicHref(topic: SyllabusTopic): string {
  if (!topic.live) return '';
  if (notesSlug(topic)) return `/topic/${encodeURIComponent(topic.code)}`;
  return topic.href ?? `/lesson/${topic.code}`;
}

export interface LocatedTopic {
  topic: SyllabusTopic;
  unit: SyllabusUnit;
  /** Position within the unit's live topics, 1-based, and how many there are. */
  index: number;
  liveCount: number;
  previous: SyllabusTopic | null;
  next: SyllabusTopic | null;
}

/** Find a topic by code, with the unit and the neighbours a topic page needs. */
export function locateTopic(code: string): LocatedTopic | null {
  for (const unit of UNITS) {
    const live = unit.topics.filter((t) => t.live);
    const i = live.findIndex((t) => t.code === code);
    if (i === -1) continue;
    return {
      topic: live[i],
      unit,
      index: i + 1,
      liveCount: live.length,
      previous: i > 0 ? live[i - 1] : null,
      next: i < live.length - 1 ? live[i + 1] : null,
    };
  }
  return null;
}

/** Live topics of a subject, in syllabus order — "what to study next" reads this. */
export function liveTopicsForSubject(
  subjectId: string
): { topic: SyllabusTopic; unit: SyllabusUnit }[] {
  return unitsForSubject(subjectId).flatMap((unit) =>
    unit.topics.filter((t) => t.live).map((topic) => ({ topic, unit }))
  );
}

/**
 * The topic code behind a notes slug, where the syllabus claims one.
 *
 * `/notes/<slug>` links are in the wild — in the notes index, in the map's own
 * data, and in anything already shared — so they keep working. They now forward to
 * the topic page, because a student who follows one should land on the whole topic
 * and not on the two thirds of it that predate the artifacts.
 */
export function topicCodeForSlug(slug: string): string | null {
  for (const unit of UNITS) {
    for (const topic of unit.topics) {
      if (notesSlug(topic) === slug) return topic.code;
    }
  }
  return null;
}
