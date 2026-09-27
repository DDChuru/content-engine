CLOUD RUN 006 — PLAN and STORYBOARD Cambridge A Level Biology 9700 Topic 4 (Cell membranes and transport).

FIRST LINE OF YOUR FIRST REPLY: your exact model ID, then whether CLAUDE_CODE_REMOTE is set. This work must be done on Opus 5.5; if you are not, say so in that first line.

## Hard rules
- Push ONLY branch `cloud/006-topic4`, containing ONLY `plan/topic-04/`, `storyboards/topic-04/` and `work/006/` (text). Never dev, master or another branch. No tags, PRs, deploys, secrets, audio or renders. This run WRITES; it does not build.
- Refer to lessons ONLY by syllabus codes (4.1.1, 4.2.3-4 …), never "L1".
- Citations: exam quotations only VERBATIM from `cloud-inputs/006/evidence/` (G04 gate criteria, EXAMINER-INSIGHT), with paper/session/question, each tagged `PDF-UNCHECKED` (the PDFs are offline; the conductor verifies later). Never invent or paraphrase a quotation; if you need one that is not there, write `UNVERIFIED — <what you need>`. SaveMyExams is a CONTENT CEILING only, never a structural template.

## Setup
git fetch origin dev cloud/inputs-003 cloud/inputs-006 && git checkout -B cloud/006-topic4 origin/dev && git checkout origin/cloud/inputs-003 -- cloud-inputs/003 && git checkout origin/cloud/inputs-006 -- cloud-inputs/006

## Read fully first
1. `cloud-inputs/003/standards/` — VIDEO-STRUCTURE.md (ALL), CONTENT-ARCHITECTURE.md, SYLLABUS-9700-DETAIL.md (Topic 4 outcomes VERBATIM, pp. 21–22), PIPELINE-STANDARD.md.
2. `cloud-inputs/006/examples/` — the CLEARED Topic 3 plan (TOPIC-PLAN-03-ENZYMES.md, TOPIC-03-WEIGHTS.md, TOPIC-03-PLAN-CHECK.md) and two CLEARED storyboards. Match their format and rigour; read what the plan check punished.
3. `cloud-inputs/006/evidence/` — G04, syllabus map (Topic 4 section), SaveMyExams leaves AL 4.1.1–4.2.12, examiner insight, calibration, past-paper inventory.

## Phase 1 — the plan (you, not subagents)
Write `plan/topic-04/TOPIC-PLAN-04-MEMBRANES.md` and `TOPIC-04-WEIGHTS.md` in the Topic 3 format: lesson list by syllabus code (combine or split outcomes by teaching logic, as 3.1.1-2 / 3.2.1b did), title, budget per lesson, build order, shared models (e.g. one fluid-mosaic membrane model reused across lessons; a water-potential diagram), practicals (e.g. osmosis in potato/visking tubing, surface area:volume with agar cubes — physically possible handling, real colours), assigned five-move error beats with evidence, traps (osmosis stated in water-potential terms; diffusion vs facilitated diffusion vs active transport; "concentration of water" avoided). Push, then STOP AND POLL: every 10 minutes `git fetch origin cloud/006-checks` and look for `cloud-checks/006/plan/CHECK.md`. Apply it exactly (re-push) before Phase 2. Give up after 4 hours without a check.

## Phase 2 — storyboards, IN PARALLEL (one Agent subagent per lesson), then review all yourself
Output `storyboards/topic-04/<code>/STORYBOARD.md` in exactly the cleared Topic 3 format: header (outcome verbatim with page, budget, build position, models used/published) · beats with frozen-quality narration · cue map (exact, unique, ordered; ≤30 words without a visual change) · visual actions · model specs · error beats · ledger (words, runtime = words ÷ 120) · a validator you write and run. Binding standard: REAL-WORLD SAMPLES rule (appended below) ; no text-only frames (a model or apparatus is always on screen); timers start at first contact; calculated or assumed values never drawn like readings; handling physically possible; colour changes only through real colours; molecular movement is MOTION; five-move error beats (65–75 s, never thinned); each lesson stands alone (own hook, objectives, recap, exam close). Make shared models identical across lessons.
Then write `work/006/SUMMARY.md` (per lesson: beats, words, runtime vs budget, error beats, validator result, every UNVERIFIED / PDF-UNCHECKED citation, plan interpretations) and push.

## Phase 3 — check rounds
Poll `origin/cloud/006-checks` every 10 minutes for `cloud-checks/006/round-N/` (README + <code>/CHECK.md). Apply every must-fix exactly, re-run validators, push, and write `work/006/FIXES-round-N.md`. Stop when a round's README says all are CLEARED, or after 4 hours with no new round. Do not build anything.

## REAL-WORLD SAMPLES rule (Durai, 26 Sep — binding, newer than the standards you were given)
Whenever a lesson uses a real material (potato, beetroot, visking tubing contents, a named food or tissue), say what in it the method responds to and whether it fits the method (range, clarity, interferences). Real-world examples are PREFERRED in explain beats. In exam-question beats the mark-scheme answer comes first; any real-world extra is spoken as beyond the scheme ("the scheme doesn't need this, but…") and shown on a panel labelled "beyond the mark scheme" — never looking like a marking point.
