# Jev / TypeSafe System One — working notes

**Living document.** Updated as we learn. Applies across `content-engine` (Stem 4 Life),
`e-wizer` and `myHACCPAdmin`.
**Last verified:** 2026-09-20 — everything marked *measured* was tested against the live API
from this machine, not taken from marketing.

---

## 1. What it is, in one line

A model that **makes a typed decision and never writes prose.** You send a state plus a set of
questions; it returns one typed answer per question, each with a probability.

It is not a small LLM. It cannot summarise, explain, draft or reason openly. If you want a
sentence back, this is the wrong tool.

## 2. The three primitives

| Type | Ask | Returns |
|---|---|---|
| `noul` | a yes/no statement | probability the statement is true |
| `choice` | pick from options you defined (under `criteria`, **not** `options`) | probability per option + confidence |
| `score` | rate against ordered levels (under `criteria`, **not** `levels`) | continuous score + distribution + confidence |

## 3. Verified API

```
POST https://api.typesafe.ai/v1/systemone
Authorization: Bearer $JEV_API_KEY
Content-Type: application/json
```

```json
{
  "model": "jev-latest",
  "state": "…the context…",
  "questions": {
    "cleared": {
      "type": "noul",
      "instructions": "The student has genuinely cleared this misconception.",
      "criteria": { "true": "…", "false": "…" }
    }
  }
}
```

Response carries `answers.<key>.<type>` plus `usage.input_tokens` / `output_tokens`.
`429` / `529` → exponential backoff. Official Python and JS SDKs exist and handle retries.

**Key lives in** `apps/student-learn/.env.local` as `JEV_API_KEY` (gitignored).
**Never `NEXT_PUBLIC_`** — it must stay server-side. Call it from a server route, not the browser.

## 4. Measured performance (2026-09-20, from Zimbabwe)

| Condition | Latency |
|---|---|
| Cold connection (fresh TLS per call) | ~1,300 ms |
| **Warm connection, reused** | **~410 ms** |
| Warm, 4 questions | ~416 ms |
| Warm, 10 questions | ~405 ms |

**Two findings that change how you design with it:**

1. **Most of the apparent latency is TLS handshake.** Keep a warm client on the server. A naive
   per-call connection triples the cost for nothing.
2. **Questions are free.** Ten cost the same as one, because they evaluate in parallel. Never
   ration questions — asking more is how you get a better decision, not a more expensive one.

Vendor claims 70–500 ms; we measure ~410 ms warm. Treat their figure as a floor on better
network paths, not a promise.

**Not a game loop.** 400 ms is a quarter-second of dead time. Fine between interactions, wrong
inside an animation.

## 5. Where it fits beside our other models

| Job | Tool |
|---|---|
| Decide, classify, route, gate, rank | **Jev** |
| Explain, draft, author, justify | Claude / GPT |
| Produce content at authoring time | Claude Code / Codex agents (Durai's standing position: not metered API) |
| Deterministic truth (versions, lineage, hashes, exact matches) | **Code, not a model** |

**Jev does not conflict with the "agents, not API" position.** That position is about *content
authoring*. Jev is for *runtime decisions inside a running product* — a per-submission check in
400 ms is something an agent session structurally cannot do.

## 6. Tested: the gating scenario (Stem 4 Life)

Question: can it decide whether a student has genuinely cleared a misconception, without
wrongly blocking one who understands? Misconception M4.4d-X02, "the hanging mass falls freely".

| Student's explanation | `cleared` | `arithmetic_only` |
|---|---|---|
| "Nothing holds it up so it just falls" | 0.02 | 0.02 |
| Correct reasoning, correct number | 0.92 | 0.08 |
| **Right answer, recalled formula, no reason given** | **0.10** | 0.14 |
| **Correct physics, fumbled the division (0.4 not 4)** | **0.60** | **0.57** |
| Just "4" | 0.18 | 0.16 |

**What this proved:**

- It catches the student who gets the right answer for the wrong reason (0.10). A marks-based
  gate waves that student through with the misconception intact. **This is the whole case for
  using it.**
- **One number cannot gate safely.** The student with sound physics and a slipped decimal scored
  0.60 — blocked at a 0.7 threshold, which is the exact harm to avoid. The *second* question
  separates them: arithmetic-only 0.57 versus 0.02.
- **⚠ CORRECTED 2026-09-20.** I originally wrote "gate on `cleared OR arithmetic_only`". **That does not
  work.** The arithmetic-slip student scored 0.60 *and* 0.57 — both below a 0.70 threshold, so the OR
  still blocks them. Two weak signals do not make a strong one. What actually works (Astra, Fable, both
  independently): **a panel of narrow questions plus a follow-up, not a threshold on two.** Fable ran an
  eight-question panel and routed all twelve test answers correctly, including informal English at 0.95
  and a prompt-injection attempt at 0.03. And the gate must be a **sequence over time** — re-checking the
  same misconception days later is what lets any single decision be lenient.
- A terse answer scores low *correctly* — it genuinely cannot tell. Route 0.4–0.75 to a follow-up
  question or a human, not to a decision.

## 7. Candidate uses, by surface

### Stem 4 Life (education)
> **Corrected:** Save My Exams already ships *Smart Mark*, which marks written answers, and earlier
> tutoring systems assessed physics reasoning in natural language. "Nobody can do this" was wrong —
> both education streams found it independently. The advantage is narrower and more defensible:
> a marked answer costs **$0.000055**, so *unlimited* marked practice is affordable in a way it is not
> for anyone paying frontier-model prices.
- **Mastery gating** — tested above. The other session has decided notes are gated with no blind
  progression; this is the gate decider.
- **Contact-detail filter (safeguarding)** — regex misses paraphrase ("find me on the green app").
  A `noul` on "is this trying to move the conversation off-platform" runs on every message.
- **Diagnosis picker pre-ranking** — a marker picks ≤3 misconception codes from 21; plan amendment
  J notes they drift to whichever sit on top. Pre-rank with `choice`.
- **Question triage** — human sign-off runs ~40 items/hour and is the real bottleneck. It cannot
  verify maths, but it can score mark-scheme completeness and syllabus scope so the reviewer sees
  the suspect items first.
- **Severity scale (amendment M, currently undefined)** — `score` gives a consistent scale across
  units, which was the stated problem.

### e-wizer (conformance)
- **MCS Excel round-trip.** Export → user edits freely → re-import. Per-row independent decisions:
  which SSOP is this, is the equipment unchanged, is this frequency plausible. `referenceInferred`
  is a **boolean** today — this turns it into a probability, which is the actual product: *"412
  matched, 23 need your eyes"* beats *"95% right, silently"*.
  ⚠ **Match deterministically first** (exact → normalised → fuzzy), send only the residue.
- **Material vs cosmetic change** on an SSOP revision — decides whether retraining and re-approval
  are triggered. Currently someone reads both versions.
- **Duplicate/drifted document detection** across sites.
- **NCR triage** — category and severity, consistently, at volume.

### myHACCPAdmin (QMS)
The schema already has `standards`, `standardClauses` and `qmsItemStandardClauses` — a clause
mapping table. That is a `choice` problem in a database.
- **Clause mapping** — does this QMS item satisfy this clause? Over a fixed clause list.
- **Evidence sufficiency** — is this proof adequate for this clause? `score`.
- **Corrective action adequacy** — does this action address the finding? `noul`.
- **Audit finding classification** — severity and category.

## 8. Where NOT to use it

- **Anything deterministic.** Version lineage, which revision is current, hashes, exact matches.
  A probability where there is a correct answer is a regression.
- **Search.** It judges a shortlist; it does not find one. Retrieval or embeddings go underneath.
- **Anything needing a reason on the record.** It returns a decision and a probability, never a
  rationale. *An auditor asking why a change was classed non-material cannot be answered with
  "0.87".* Pair it with a human signature or a generative model wherever the output enters a
  defensible record.
- **Open-ended anything.** It does not generate.

## 8a. Cost — measured 2026-09-20, and it is close to free

**$0.042 per million input tokens. Output is free.** Observed from the console after our test
session: 15 requests, 6,779 tokens, **$0.0003** total. That is ~450 input tokens and
**$0.000019 per decision**.

| Workload | Calls/month | Cost |
|---|---:|---:|
| Stem 4 Life: 500 students × 20 gated attempts | 10,000 | $0.25 |
| Stem 4 Life: every message through the safeguarding filter | 5,000 | $0.13 |
| e-wizer: one 500-row MCS re-import | 500 | $0.01 |
| e-wizer: 50 sites re-importing monthly | 25,000 | $0.63 |
| myHACCPAdmin: every evidence item judged on arrival | 20,000 | $0.50 |
| **All of the above** | **60,200** | **$1.52** |
| A million decisions | 1,000,000 | $25.20 |

**This removes cost as a design consideration, and it supersedes earlier advice in this doc.**
§7 says to match deterministically first and send only the residue. That remains *tidier*
engineering, but it is no longer a cost argument — 500 rows is a cent.

What it actually licenses:
- **Be extravagant with questions.** Fifteen beats three, and they are parallel (§4).
- **Judge on arrival, not at audit time.** Continuous conformance becomes affordable.
- **Re-judge history.** When a standard changes or a definition sharpens, re-run the judgement
  across the entire archive. *"We re-evaluated every record against the revised clause; these
  eleven now fail"* is something a human-reviewed system structurally cannot do. At these prices
  it is a background job, not a project.

The constraint that survives is **not cost but trust**: no rationale on the record (§8), and a
wrong decision is still wrong however cheap it was.

---

## 9. Open questions

- **Does `state` accept images?** One page mentions multimodal/vision; the API docs describe text.
  **Unresolved, and it matters** — if images work it is a candidate for the student-photo redaction
  gate that currently blocks the whole submission path.
- Rate limits are undocumented beyond "back off on 429/529".
