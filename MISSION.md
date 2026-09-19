# Mission — video corrections

**Branch:** `mission/video-corrections` · **Opened:** 2026-09-19 · **Base:** `dev`

## Two jobs

1. **Correct the videos that need rework**, as content.
2. **Build the pipeline for doing that on the platform later** — tutors leave timestamped
   comments on a video, content people pick them up and act.

## The design constraint that shapes job 2

Durai, 2026-09-18: *"I want this cooked over Claude Code and Codex and not api. If api route
becomes sustainable that's for the future."*

So **a correction's output is a BRIEF, not an API call.** It should come out shaped like the
briefs that drive this project: which file, what is wrong, what "done" looks like, what must not
change. A human dispatches it to an agent. The dashboard tracks state (raised → briefed → fixed
→ verified) and **never executes anything itself.** Full note in
`apps/student-learn/briefs/ROADMAP-to-revenue.md` Appendix B.

## Reuse, do not rebuild

- **`remotion-branding/tools/annotate.html` already does timestamped video comments.** Load a
  recording, scrub, drop marks (tap / rect / circle / arrow / label) with `atSec` and normalised
  0..1 coordinates, export JSON. That IS the tutor comment feature, written for a different
  purpose with an identical data shape.
- `apps/student-learn/app/admin/catalogue` already has role gating, audited mutations and a
  no-hard-delete rule.
- `auditLog` and the append-only discipline are the ledger a correction workflow needs.

## Ownership — so this integrates cleanly later

**This worktree owns:** the Remotion compositions under `packages/backend/src/remotion/`,
`remotion-branding/`, and any new correction tooling.

**Do NOT touch** — `dev` owns these and they move daily:
- `apps/student-learn/convex/**`
- `apps/student-learn/app/**`, `lib/**`, `middleware.ts`
- `apps/student-learn/public/notes/index.json`

**Contended, coordinate before editing:** `packages/backend/content-registry.json` and
`packages/backend/src/remotion/Root.tsx` — three stale missions (`9709-p1-content`, `q6-max`,
`q6-ultra`) already conflict on these. Do not add a fourth.

## Open questions to settle before building the platform side

- Is a reviewing tutor the same principal as a **marker**? Markers are blinded, pooled and
  per-submission. A reviewer of published material has no reason to be anonymous and
  **corrections need attribution** — so probably a second, named role.
- Does a correction target a video timestamp, a notes paragraph, a question, or a misconception
  code? Probably all four → one `corrections` table with a polymorphic target, not four features.
- A correction saying *"this lesson teaches the misconception wrong"* is the highest-value kind
  and links straight to `content/misconceptions/mechanics.json`.
- Who closes a correction — the raiser or the fixer? The marking platform already answers this
  for submissions; reuse that pattern.

## Video hosting, as of 2026-09-19

All 37 topics stream from Bunny library **756227** (`vz-c77378c6-e3c.b-cdn.net`), 5 renditions
each. The old library **756192** still exists and production still serves 11 videos from it —
**do not delete it until dev is redeployed.**

⚠ **Bunny's API lags reality by hours.** `originalHash`, `storageSize` and `status` stay
empty/zero long after a successful upload. A null field means "not yet", never "failed". This
cost a day. See memory `feedback_null_is_not_failure`.
