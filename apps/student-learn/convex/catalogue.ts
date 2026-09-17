/**
 * misconceptionCatalogue — the CLOSED list behind §7 (prescriptions) and
 * §8 (gap aggregation).
 *
 * The catalogue is authored in `content/misconceptions/*.json`, reviewed in a
 * git diff, and pushed here by `scripts/seed-misconceptions.mjs`. Convex is a
 * mirror of the repo, never the source of truth — which is what keeps the list
 * closed: a teacher cannot insert into it, only propose free text (§8).
 *
 * The authoring format is richer than this table: it resolves a misconception to
 * MANY notes pages, videos and questions, and carries a title/description for the
 * picker. The deployed schema stores a single `lessonHref` / `videoId` plus a
 * question list, so `seedItem` projects the rich form onto it. See the report in
 * the seed script header.
 */

import { internalMutation } from './_generated/server';
import { v } from 'convex/values';

const coverageValidator = v.union(
  v.literal('covered'),
  v.literal('partial'),
  v.literal('uncovered')
);

const itemValidator = v.object({
  code: v.string(),
  topicCode: v.string(),
  wrongIdea: v.string(),
  whyWrong: v.string(),
  correctUnderstanding: v.string(),
  severity: v.number(),
  coverage: coverageValidator,
  lessonHref: v.optional(v.string()),
  videoId: v.optional(v.string()),
  questionIds: v.optional(v.array(v.string())),
});

/**
 * Replace the authored catalogue in one transaction.
 *
 * Upsert by `code`, so re-running patches rather than duplicates, and never
 * touches `proposedBy` / `proposedText` / `promotedBy`, which belong to the
 * runtime proposal flow. Any active row whose code is no longer authored is
 * RETIRED, never deleted — §8 aggregation must still be able to read the text
 * of a code a teacher picked before it was retired.
 *
 * Internal by design: the list is closed, so nothing client-reachable writes it.
 * Run it with `npx convex run catalogue:seed --file <args.json>`.
 */
export const seed = internalMutation({
  args: { items: v.array(itemValidator) },
  returns: v.object({
    inserted: v.array(v.string()),
    patched: v.array(v.string()),
    retired: v.array(v.string()),
  }),
  handler: async (ctx, { items }) => {
    const inserted: string[] = [];
    const patched: string[] = [];

    for (const item of items) {
      const existing = await ctx.db
        .query('misconceptionCatalogue')
        .withIndex('by_code', (q) => q.eq('code', item.code))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, { ...item, state: 'active' as const });
        patched.push(item.code);
      } else {
        await ctx.db.insert('misconceptionCatalogue', {
          ...item,
          state: 'active' as const,
          createdAt: Date.now(),
        });
        inserted.push(item.code);
      }
    }

    const keep = new Set(items.map((i) => i.code));
    const retired: string[] = [];
    for (const row of await ctx.db
      .query('misconceptionCatalogue')
      .withIndex('by_state', (q) => q.eq('state', 'active'))
      .collect()) {
      if (!keep.has(row.code)) {
        await ctx.db.patch(row._id, { state: 'retired' as const });
        retired.push(row.code);
      }
    }

    return { inserted, patched, retired };
  },
});
