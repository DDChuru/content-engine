'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import { api } from '@/convex/_generated/api';
import { BrandLogo } from '@/components/brand-logo';
import { buttonClass, inputClass, secondaryButtonClass } from '@/components/auth-shell';
import { AVAILABILITY_LABEL, type SubjectAvailability } from '@/lib/exam-catalogue';

/**
 * The exam catalogue, managed by hand.
 *
 * Two things this screen deliberately does NOT have:
 *
 *  1. **A delete button.** There isn't one anywhere on this page, because there is
 *     no delete mutation behind it to call. Entries are RETIRED — taken out of the
 *     registration picker — and a retired entry is still shown here, still resolves
 *     for the students already enrolled on it, and goes back with one click.
 *  2. **An availability field.** What we have written is derived from
 *     `lib/syllabus.ts` on every read and cannot be typed in. The override is a
 *     separate control, needs a written reason, and labels the row as overridden.
 *
 * The gate is `examCatalogue.adminTree`, which re-derives the caller's role
 * server-side from the `users` table. This page rendering is not permission; every
 * mutation below re-checks independently, so a hand-rolled call gets nothing.
 */
export default function AdminCataloguePage() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const tree = useQuery(api.examCatalogue.adminTree, isAuthenticated ? {} : 'skip');
  const [tab, setTab] = useState<Tab>('countries');

  if (isLoading || (isAuthenticated && tree === undefined)) {
    return <Shell><p className="text-sm text-ink-muted">Loading…</p></Shell>;
  }
  // `null` is the server's refusal; `undefined` here means not signed in at all.
  if (tree === null || tree === undefined) {
    return (
      <Shell>
        <p className="text-sm text-ink">
          This page is for administrators. If you think that is you, sign in with
          the account that was made one.
        </p>
        <Link href="/" className={`${secondaryButtonClass} mt-4 inline-block`}>
          Back to studying
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <nav className="mb-6 flex flex-wrap gap-2">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={
              tab === key
                ? 'rounded-lg border border-accent bg-accent/10 px-3 py-1.5 text-sm font-semibold text-ink'
                : 'rounded-lg border border-grid-line bg-paper px-3 py-1.5 text-sm text-ink-muted'
            }
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === 'countries' ? <Countries tree={tree} /> : null}
      {tab === 'bodies' ? <Bodies tree={tree} /> : null}
      {tab === 'offerings' ? <Offerings tree={tree} /> : null}
      {tab === 'levels' ? <Levels tree={tree} /> : null}
      {tab === 'series' ? <SeriesTab tree={tree} /> : null}
      {tab === 'subjects' ? <Subjects tree={tree} /> : null}
    </Shell>
  );
}

/** The shape `adminTree` returns for an admin. `null` is the refusal. */
type Tree = NonNullable<FunctionReturnType<typeof api.examCatalogue.adminTree>>;

type Tab = 'countries' | 'bodies' | 'offerings' | 'levels' | 'series' | 'subjects';
const TABS: [Tab, string][] = [
  ['countries', 'Countries'],
  ['bodies', 'Exam boards'],
  ['offerings', 'Who sits what, where'],
  ['levels', 'Levels'],
  ['series', 'Sittings'],
  ['subjects', 'Subjects'],
];

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10">
      <Link href="/" className="mb-8 inline-flex w-fit" aria-label="Stem 4 Life home">
        <BrandLogo variant="horizontal" theme="light" />
      </Link>
      <h1 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
        Exam catalogue
      </h1>
      <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-ink-muted">
        Countries, boards, levels, sittings and subjects, as students see them at
        registration. Entries are retired rather than deleted: a retired entry
        vanishes from the picker and keeps working for everyone already enrolled on
        it. Run{' '}
        <code className="rounded bg-paper-raised px-1">
          node scripts/export-exam-catalogue.mjs
        </code>{' '}
        after a change so the diff is reviewable in git.
      </p>
      <div className="mt-8">{children}</div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<'ok' | 'bad'>('ok');
  const run = async (fn: () => Promise<unknown>, okMessage: string) => {
    try {
      await fn();
      setTone('ok');
      setMessage(okMessage);
    } catch (err) {
      setTone('bad');
      setMessage(err instanceof Error ? strip(err.message) : 'Something went wrong.');
    }
  };
  const banner = message ? (
    <p
      role="status"
      className={`mb-4 rounded-lg border px-3 py-2.5 text-sm ${
        tone === 'ok'
          ? 'border-grid-line bg-paper text-ink'
          : 'border-accent/40 bg-accent/5 text-ink'
      }`}
    >
      {message}
    </p>
  ) : null;
  return { run, banner };
}

function strip(message: string): string {
  const m = message.match(/Uncaught \w*Error:\s*([^\n]+)/);
  return (m?.[1] ?? message).replace(/\s*at handler.*$/, '').trim();
}

function Section({ title, lede, children }: { title: string; lede: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-1 max-w-2xl text-[0.85rem] leading-relaxed text-ink-muted">{lede}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function RowShell({
  children,
  retired,
}: {
  children: React.ReactNode;
  retired: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-grid-line bg-paper px-3 py-2.5 ${
        retired ? 'opacity-60' : ''
      }`}
    >
      {children}
    </div>
  );
}

function StateTag({ state }: { state: 'active' | 'retired' }) {
  return state === 'retired' ? (
    <span className="ml-2 rounded bg-paper-raised px-1.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-ink-muted">
      Retired — not offered
    </span>
  ) : null;
}

/**
 * Retire / put back. Never "delete": the word is wrong and so would the button be.
 * A retire that affects live students is refused server-side; the second press
 * sends the acknowledgement, after the server has said how many they are.
 */
function RetireButtons({ ref_, state }: { ref_: EntityRef; state: 'active' | 'retired' }) {
  const retire = useMutation(api.examCatalogue.retire);
  const unretire = useMutation(api.examCatalogue.unretire);
  const [warning, setWarning] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (state === 'retired') {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await unretire(ref_);
          } finally {
            setBusy(false);
          }
        }}
        className="rounded-lg border border-grid-line px-2.5 py-1 text-[0.8rem] font-semibold text-ink"
      >
        Put back in the picker
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await retire(ref_);
            setWarning(null);
          } catch (err) {
            setWarning(err instanceof Error ? strip(err.message) : 'Could not retire.');
          } finally {
            setBusy(false);
          }
        }}
        className="rounded-lg border border-grid-line px-2.5 py-1 text-[0.8rem] font-semibold text-ink-muted"
      >
        Take out of the picker
      </button>
      {warning ? (
        <div className="max-w-sm text-right">
          <p className="text-[0.75rem] leading-relaxed text-ink">{warning}</p>
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await retire({ ...ref_, acknowledgeInUse: true });
                setWarning(null);
              } catch (err) {
                setWarning(err instanceof Error ? strip(err.message) : 'Could not retire.');
              } finally {
                setBusy(false);
              }
            }}
            className="mt-1 rounded-lg border border-accent/40 px-2.5 py-1 text-[0.75rem] font-semibold text-ink"
          >
            Yes, take it out anyway
          </button>
        </div>
      ) : null}
    </div>
  );
}

type EntityRef = {
  entity: 'country' | 'body' | 'countryBody' | 'level' | 'series' | 'subject';
  countryCode?: string;
  bodyId?: string;
  levelId?: string;
  seriesId?: string;
  subjectId?: string;
};

// ---------------------------------------------------------------------------
// Countries
// ---------------------------------------------------------------------------

function Countries({ tree }: { tree: Tree }) {
  const upsert = useMutation(api.examCatalogue.upsertCountry);
  const { run, banner } = useToast();
  const [form, setForm] = useState({ code: '', title: '', note: '', sortOrder: '' });

  return (
    <Section
      title="Countries"
      lede="The first question a student answers. It decides which boards they are shown, so a country with no boards offers nothing — set that up on the next tab."
    >
      {banner}
      <div className="space-y-2">
        {tree.countries.map((c) => (
          <RowShell key={c.code} retired={c.state === 'retired'}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">
                  {c.title}{' '}
                  <span className="font-normal text-ink-muted">{c.code}</span>
                  <StateTag state={c.state} />
                </p>
                {c.note ? (
                  <p className="mt-0.5 text-[0.8rem] text-ink-muted">{c.note}</p>
                ) : null}
              </div>
              <RetireButtons ref_={{ entity: 'country', countryCode: c.code }} state={c.state} />
            </div>
            <EditRow
              fields={[
                ['title', 'Name', c.title],
                ['note', 'Note', c.note ?? ''],
                ['sortOrder', 'Order', String(c.sortOrder)],
              ]}
              onSave={(values) =>
                run(
                  () =>
                    upsert({
                      code: c.code,
                      title: values.title,
                      note: values.note || undefined,
                      sortOrder: Number(values.sortOrder) || c.sortOrder,
                    }),
                  `${values.title} saved.`
                )
              }
            />
          </RowShell>
        ))}
      </div>

      <NewForm
        title="Add a country"
        onSubmit={() =>
          run(
            () =>
              upsert({
                code: form.code,
                title: form.title,
                note: form.note || undefined,
                sortOrder: Number(form.sortOrder) || undefined,
              }),
            `${form.title || form.code} added.`
          )
        }
      >
        <Input label="ISO code (ZW, ZA, GB) or OTHER" value={form.code} onChange={(v) => setForm({ ...form, code: v })} />
        <Input label="Name" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <Input label="Note (optional)" value={form.note} onChange={(v) => setForm({ ...form, note: v })} />
        <Input label="Order (optional)" value={form.sortOrder} onChange={(v) => setForm({ ...form, sortOrder: v })} />
      </NewForm>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Bodies
// ---------------------------------------------------------------------------

function Bodies({ tree }: { tree: Tree }) {
  const upsert = useMutation(api.examCatalogue.upsertBody);
  const { run, banner } = useToast();
  const [form, setForm] = useState({ bodyId: '', title: '', shortTitle: '', hint: '' });

  return (
    <Section
      title="Exam boards"
      lede="A board exists once and is offered in as many countries as sit it. The id is stored on every enrolment ever written, so it is fixed when the board is created — renaming it would orphan the history rather than rename it."
    >
      {banner}
      <div className="space-y-2">
        {tree.bodies.map((b) => (
          <RowShell key={b.bodyId} retired={b.state === 'retired'}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">
                  {b.shortTitle}{' '}
                  <span className="font-normal text-ink-muted">{b.bodyId}</span>
                  <StateTag state={b.state} />
                </p>
                <p className="mt-0.5 text-[0.8rem] text-ink-muted">{b.title}</p>
                <p className="mt-0.5 text-[0.8rem] text-ink-muted">{b.hint}</p>
              </div>
              <RetireButtons ref_={{ entity: 'body', bodyId: b.bodyId }} state={b.state} />
            </div>
            <EditRow
              fields={[
                ['title', 'Full name', b.title],
                ['shortTitle', 'Short name', b.shortTitle],
                ['hint', 'Hint shown under the option', b.hint],
                ['sortOrder', 'Order', String(b.sortOrder)],
              ]}
              onSave={(values) =>
                run(
                  () =>
                    upsert({
                      bodyId: b.bodyId,
                      title: values.title,
                      shortTitle: values.shortTitle,
                      hint: values.hint,
                      sortOrder: Number(values.sortOrder) || b.sortOrder,
                    }),
                  `${values.shortTitle} saved.`
                )
              }
            />
          </RowShell>
        ))}
      </div>

      <NewForm
        title="Add an exam board"
        onSubmit={() =>
          run(
            () =>
              upsert({
                bodyId: form.bodyId,
                title: form.title,
                shortTitle: form.shortTitle,
                hint: form.hint,
              }),
            `${form.shortTitle || form.bodyId} added. Now give it levels, sittings and subjects, and say which countries sit it.`
          )
        }
      >
        <Input label="Id (lower-case slug, permanent)" value={form.bodyId} onChange={(v) => setForm({ ...form, bodyId: v })} />
        <Input label="Full name" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <Input label="Short name" value={form.shortTitle} onChange={(v) => setForm({ ...form, shortTitle: v })} />
        <Input label="Hint" value={form.hint} onChange={(v) => setForm({ ...form, hint: v })} />
      </NewForm>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Offerings — the country↔body join
// ---------------------------------------------------------------------------

function Offerings({ tree }: { tree: Tree }) {
  const upsert = useMutation(api.examCatalogue.upsertCountryBody);
  const { run, banner } = useToast();
  const [form, setForm] = useState({ countryCode: '', bodyId: '', levelIds: '', note: '' });

  const byCountry = useMemo(() => {
    const map = new Map<string, typeof tree.countryBodies>();
    for (const j of tree.countryBodies) {
      map.set(j.countryCode, [...(map.get(j.countryCode) ?? []), j]);
    }
    return map;
  }, [tree.countryBodies]);

  return (
    <Section
      title="Who sits what, where"
      lede="The join. Cambridge is offered in many countries; Zimbabwe offers both ZIMSEC and Cambridge. Leave the levels box empty to offer the whole board; list level ids to offer only part of it (Cambridge IGCSE is sat in the UK, Cambridge A Level is not)."
    >
      {banner}
      <div className="space-y-4">
        {tree.countries.map((c) => (
          <div key={c.code}>
            <p className="text-sm font-semibold text-ink">
              {c.title} <span className="font-normal text-ink-muted">{c.code}</span>
            </p>
            <div className="mt-1.5 space-y-2">
              {(byCountry.get(c.code) ?? []).map((j) => (
                <RowShell key={j.bodyId} retired={j.state === 'retired'}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-ink">
                        {tree.bodies.find((b) => b.bodyId === j.bodyId)?.shortTitle ?? j.bodyId}
                        <StateTag state={j.state} />
                      </p>
                      <p className="mt-0.5 text-[0.8rem] text-ink-muted">
                        {j.levelIds?.length
                          ? `Only: ${j.levelIds.join(', ')}`
                          : 'Every level of this board'}
                        {j.note ? ` — ${j.note}` : ''}
                      </p>
                    </div>
                    <RetireButtons
                      ref_={{ entity: 'countryBody', countryCode: c.code, bodyId: j.bodyId }}
                      state={j.state}
                    />
                  </div>
                  <EditRow
                    fields={[
                      ['levelIds', 'Level ids (comma separated, blank = all)', (j.levelIds ?? []).join(', ')],
                      ['note', 'Note', j.note ?? ''],
                    ]}
                    onSave={(values) =>
                      run(
                        () =>
                          upsert({
                            countryCode: c.code,
                            bodyId: j.bodyId,
                            levelIds: splitIds(values.levelIds),
                            note: values.note || undefined,
                            sortOrder: j.sortOrder,
                          }),
                        'Offering saved.'
                      )
                    }
                  />
                </RowShell>
              ))}
              {(byCountry.get(c.code) ?? []).length === 0 ? (
                <p className="text-[0.8rem] text-ink-muted">
                  No boards offered here yet — a student choosing {c.title} sees an
                  empty list.
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <NewForm
        title="Offer a board in a country"
        onSubmit={() =>
          run(
            () =>
              upsert({
                countryCode: form.countryCode,
                bodyId: form.bodyId,
                levelIds: splitIds(form.levelIds),
                note: form.note || undefined,
              }),
            `${form.bodyId} is now offered in ${form.countryCode}.`
          )
        }
      >
        <Input label="Country code" value={form.countryCode} onChange={(v) => setForm({ ...form, countryCode: v })} />
        <Input label="Board id" value={form.bodyId} onChange={(v) => setForm({ ...form, bodyId: v })} />
        <Input label="Level ids (blank = all)" value={form.levelIds} onChange={(v) => setForm({ ...form, levelIds: v })} />
        <Input label="Note (optional)" value={form.note} onChange={(v) => setForm({ ...form, note: v })} />
      </NewForm>
    </Section>
  );
}

const splitIds = (raw: string) => {
  const ids = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return ids.length ? ids : undefined;
};

// ---------------------------------------------------------------------------
// Levels
// ---------------------------------------------------------------------------

function Levels({ tree }: { tree: Tree }) {
  const upsert = useMutation(api.examCatalogue.upsertLevel);
  const { run, banner } = useToast();
  const [form, setForm] = useState({ bodyId: '', levelId: '', title: '', hint: '' });

  return (
    <Section
      title="Levels"
      lede="A level belongs to exactly one board. AS & A Level, O Level, IGCSE, the three NSC assessment bodies — whatever that board calls the things a student chooses between."
    >
      {banner}
      <div className="space-y-2">
        {tree.levels.map((l) => (
          <RowShell key={`${l.bodyId}/${l.levelId}`} retired={l.state === 'retired'}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">
                  {l.title}{' '}
                  <span className="font-normal text-ink-muted">
                    {l.bodyId} / {l.levelId}
                  </span>
                  <StateTag state={l.state} />
                </p>
                {l.hint ? (
                  <p className="mt-0.5 text-[0.8rem] text-ink-muted">{l.hint}</p>
                ) : null}
              </div>
              <RetireButtons
                ref_={{ entity: 'level', bodyId: l.bodyId, levelId: l.levelId }}
                state={l.state}
              />
            </div>
            <EditRow
              fields={[
                ['title', 'Name', l.title],
                ['hint', 'Hint', l.hint ?? ''],
                ['sortOrder', 'Order', String(l.sortOrder)],
              ]}
              onSave={(values) =>
                run(
                  () =>
                    upsert({
                      bodyId: l.bodyId,
                      levelId: l.levelId,
                      title: values.title,
                      hint: values.hint || undefined,
                      sortOrder: Number(values.sortOrder) || l.sortOrder,
                    }),
                  `${values.title} saved.`
                )
              }
            />
          </RowShell>
        ))}
      </div>

      <NewForm
        title="Add a level"
        onSubmit={() =>
          run(
            () =>
              upsert({
                bodyId: form.bodyId,
                levelId: form.levelId,
                title: form.title,
                hint: form.hint || undefined,
              }),
            `${form.title || form.levelId} added.`
          )
        }
      >
        <Input label="Board id" value={form.bodyId} onChange={(v) => setForm({ ...form, bodyId: v })} />
        <Input label="Level id (slug)" value={form.levelId} onChange={(v) => setForm({ ...form, levelId: v })} />
        <Input label="Name" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <Input label="Hint (optional)" value={form.hint} onChange={(v) => setForm({ ...form, hint: v })} />
      </NewForm>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Series
// ---------------------------------------------------------------------------

function SeriesTab({ tree }: { tree: Tree }) {
  const upsert = useMutation(api.examCatalogue.upsertSeries);
  const { run, banner } = useToast();
  const [form, setForm] = useState({
    bodyId: '',
    levelId: '',
    seriesId: '',
    title: '',
    examMonth: '',
    note: '',
  });

  return (
    <Section
      title="Sittings"
      lede="A series and the month its written papers fall in. Years are not stored: the picker generates the next few sittings forward from the month, so a series whose papers are already written is never offered and nothing here needs an annual edit. Leave the level blank for the board's usual series; set it where one level differs (Pearson's International GCSE has no January)."
    >
      {banner}
      <div className="space-y-2">
        {tree.series.map((s) => (
          <RowShell key={`${s.bodyId}/${s.levelId ?? '*'}/${s.seriesId}`} retired={s.state === 'retired'}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">
                  {s.title}{' '}
                  <span className="font-normal text-ink-muted">
                    {s.bodyId} / {s.levelId ?? 'all levels'} · month {s.examMonth}
                  </span>
                  <StateTag state={s.state} />
                </p>
                {s.note ? (
                  <p className="mt-0.5 text-[0.8rem] text-ink-muted">{s.note}</p>
                ) : null}
              </div>
              <RetireButtons
                ref_={{
                  entity: 'series',
                  bodyId: s.bodyId,
                  levelId: s.levelId ?? undefined,
                  seriesId: s.seriesId,
                }}
                state={s.state}
              />
            </div>
            <EditRow
              fields={[
                ['title', 'Name', s.title],
                ['examMonth', 'Exam month (1-12)', String(s.examMonth)],
                ['note', 'Note', s.note ?? ''],
              ]}
              onSave={(values) =>
                run(
                  () =>
                    upsert({
                      bodyId: s.bodyId,
                      levelId: s.levelId ?? undefined,
                      seriesId: s.seriesId,
                      title: values.title,
                      examMonth: Number(values.examMonth),
                      note: values.note || undefined,
                      sortOrder: s.sortOrder,
                    }),
                  `${values.title} saved.`
                )
              }
            />
          </RowShell>
        ))}
      </div>

      <NewForm
        title="Add a sitting"
        onSubmit={() =>
          run(
            () =>
              upsert({
                bodyId: form.bodyId,
                levelId: form.levelId || undefined,
                seriesId: form.seriesId,
                title: form.title,
                examMonth: Number(form.examMonth),
                note: form.note || undefined,
              }),
            `${form.title || form.seriesId} added.`
          )
        }
      >
        <Input label="Board id" value={form.bodyId} onChange={(v) => setForm({ ...form, bodyId: v })} />
        <Input label="Level id (blank = all levels)" value={form.levelId} onChange={(v) => setForm({ ...form, levelId: v })} />
        <Input label="Series id (slug)" value={form.seriesId} onChange={(v) => setForm({ ...form, seriesId: v })} />
        <Input label="Name" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <Input label="Exam month (1-12)" value={form.examMonth} onChange={(v) => setForm({ ...form, examMonth: v })} />
        <Input label="Note (optional)" value={form.note} onChange={(v) => setForm({ ...form, note: v })} />
      </NewForm>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Subjects
// ---------------------------------------------------------------------------

function Subjects({ tree }: { tree: Tree }) {
  const upsert = useMutation(api.examCatalogue.upsertSubject);
  const { run, banner } = useToast();
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({
    bodyId: '',
    levelId: '',
    subjectId: '',
    code: '',
    title: '',
  });

  const rows = tree.subjects.filter((s) =>
    filter
      ? `${s.bodyId} ${s.levelId} ${s.subjectId} ${s.code ?? ''} ${s.title}`
          .toLowerCase()
          .includes(filter.toLowerCase())
      : true
  );

  return (
    <Section
      title="Subjects"
      lede="Codes are the boards' own published codes and nothing else. A missing code is fine; an invented one is not — a student who checks it against their entry slip and finds it wrong stops believing the page. Note 4024: Mathematics at Cambridge, Chemistry at ZIMSEC."
    >
      {banner}
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter by board, level, code or name…"
        className={`${inputClass} mb-4`}
      />
      <p className="mb-3 text-[0.8rem] text-ink-muted">
        Showing {rows.length} of {tree.subjects.length}.
      </p>
      <div className="space-y-2">
        {rows.map((s) => (
          <RowShell
            key={`${s.bodyId}/${s.levelId}/${s.subjectId}`}
            retired={s.state === 'retired'}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">
                  {s.title}
                  {s.code ? (
                    <span className="ml-1.5 font-normal text-ink-muted">{s.code}</span>
                  ) : null}
                  <StateTag state={s.state} />
                </p>
                <p className="mt-0.5 text-[0.8rem] text-ink-muted">
                  {s.bodyId} / {s.levelId} / {s.subjectId}
                </p>
                <AvailabilityCell subject={s} />
              </div>
              <RetireButtons
                ref_={{
                  entity: 'subject',
                  bodyId: s.bodyId,
                  levelId: s.levelId,
                  subjectId: s.subjectId,
                }}
                state={s.state}
              />
            </div>
            <EditRow
              fields={[
                ['title', 'Name', s.title],
                ['code', 'Syllabus code (blank if the board publishes none)', s.code ?? ''],
                ['sortOrder', 'Order', String(s.sortOrder)],
              ]}
              onSave={(values) =>
                run(
                  () =>
                    upsert({
                      bodyId: s.bodyId,
                      levelId: s.levelId,
                      subjectId: s.subjectId,
                      title: values.title,
                      code: values.code || undefined,
                      sortOrder: Number(values.sortOrder) || s.sortOrder,
                    }),
                  `${values.title} saved.`
                )
              }
            />
          </RowShell>
        ))}
      </div>

      <NewForm
        title="Add a subject"
        onSubmit={() =>
          run(
            () =>
              upsert({
                bodyId: form.bodyId,
                levelId: form.levelId,
                subjectId: form.subjectId,
                title: form.title,
                code: form.code || undefined,
              }),
            `${form.title || form.subjectId} added — it will show as "${AVAILABILITY_LABEL.planned}" until the library has it.`
          )
        }
      >
        <Input label="Board id" value={form.bodyId} onChange={(v) => setForm({ ...form, bodyId: v })} />
        <Input label="Level id" value={form.levelId} onChange={(v) => setForm({ ...form, levelId: v })} />
        <Input label="Subject id (slug)" value={form.subjectId} onChange={(v) => setForm({ ...form, subjectId: v })} />
        <Input label="Name" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <Input label="Syllabus code (optional)" value={form.code} onChange={(v) => setForm({ ...form, code: v })} />
      </NewForm>
    </Section>
  );
}

/**
 * Availability, and the one deliberate way to contradict it.
 *
 * There is no dropdown here that sets availability directly. The line on the left
 * is what the library says, recomputed from `lib/syllabus.ts`. The override is a
 * separate control with a mandatory reason, and a row using one says so.
 */
function AvailabilityCell({
  subject,
}: {
  subject: Tree['subjects'][number];
}) {
  const setOverride = useMutation(api.examCatalogue.setAvailabilityOverride);
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<SubjectAvailability>('in_progress');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const ref_ = {
    bodyId: subject.bodyId,
    levelId: subject.levelId,
    subjectId: subject.subjectId,
  };

  return (
    <div className="mt-1">
      <p className="text-[0.8rem] text-ink">
        {AVAILABILITY_LABEL[subject.availability]}
        {subject.availabilityOverridden ? (
          <span className="ml-1.5 text-ink-muted">
            — set by hand, not by the library
            {subject.overrideReason ? `: ${subject.overrideReason}` : ''}
          </span>
        ) : (
          <span className="ml-1.5 text-ink-muted">— from the library, not editable</span>
        )}
      </p>
      {subject.availabilityOverridden ? (
        <button
          type="button"
          onClick={async () => {
            await setOverride({
              ...ref_,
              availability: null,
              reason: 'Clearing the override and handing this subject back to the library.',
            });
          }}
          className="mt-1 text-[0.75rem] font-semibold text-accent underline underline-offset-2"
        >
          Clear the override
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="mt-1 text-[0.75rem] text-ink-muted underline underline-offset-2"
        >
          {open ? 'Cancel' : 'Override availability'}
        </button>
      )}

      {open && !subject.availabilityOverridden ? (
        <div className="mt-2 rounded-lg border border-accent/40 bg-accent/5 p-2.5">
          <p className="text-[0.75rem] leading-relaxed text-ink">
            Availability is derived from what the library actually holds. Overriding
            it is a claim about content, made by a person, and it is recorded as one:
            your name, the time and this reason go into the audit log.
          </p>
          <select
            value={choice}
            onChange={(e) => setChoice(e.target.value as SubjectAvailability)}
            className={`${inputClass} mt-2`}
          >
            <option value="planned">{AVAILABILITY_LABEL.planned}</option>
            <option value="in_progress">{AVAILABILITY_LABEL.in_progress}</option>
            <option value="available">{AVAILABILITY_LABEL.available}</option>
          </select>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="What content exists, or does not, that the syllabus map has not caught up with?"
            className={`${inputClass} mt-2`}
          />
          {error ? <p className="mt-1 text-[0.75rem] text-ink">{error}</p> : null}
          <button
            type="button"
            onClick={async () => {
              setError(null);
              try {
                await setOverride({ ...ref_, availability: choice, reason });
                setOpen(false);
                setReason('');
              } catch (err) {
                setError(err instanceof Error ? strip(err.message) : 'Could not save.');
              }
            }}
            className="mt-2 rounded-lg border border-accent px-2.5 py-1 text-[0.75rem] font-semibold text-ink"
          >
            Record the override
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small form pieces
// ---------------------------------------------------------------------------

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[0.8rem] font-semibold text-ink">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

function NewForm({
  title,
  children,
  onSubmit,
}: {
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6">
      <button type="button" onClick={() => setOpen((o) => !o)} className={secondaryButtonClass}>
        {open ? 'Cancel' : title}
      </button>
      {open ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="mt-3 space-y-3 rounded-lg border border-grid-line bg-paper p-4"
        >
          {children}
          <button type="submit" className={buttonClass}>
            Save
          </button>
        </form>
      ) : null}
    </div>
  );
}

/** Inline edit, collapsed by default so a long list stays a list. */
function EditRow({
  fields,
  onSave,
}: {
  fields: [string, string, string][];
  onSave: (values: Record<string, string>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map(([key, , initial]) => [key, initial]))
  );

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-[0.75rem] text-ink-muted underline underline-offset-2"
      >
        {open ? 'Close' : 'Edit'}
      </button>
      {open ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(values);
            setOpen(false);
          }}
          className="mt-2 space-y-2"
        >
          {fields.map(([key, label]) => (
            <Input
              key={key}
              label={label}
              value={values[key] ?? ''}
              onChange={(v) => setValues({ ...values, [key]: v })}
            />
          ))}
          <button type="submit" className={buttonClass}>
            Save
          </button>
        </form>
      ) : null}
    </div>
  );
}
