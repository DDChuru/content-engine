# Jev × myHACCPAdmin — design research

**Author:** architect agent, 2026-09-20. **Status:** research for synthesis with the e-wizer agent's work.
**Read first:** `docs/jev-system-one.md` (what Jev is, latency, cost).
**Sources read:** `myHACCPAdmin/PRD-QMS-Platform.md`, `NCR-AUDIT-TECHNICAL-REPORT.md`, `convex/schema.ts`,
`convex/seed/qmsDomains.ts`, `convex/records/validation.ts`, `convex/qms/assessments.ts`,
`convex/documents/embeddings.ts`, `iso22000_2018_requirements.json`, and the e-wizer table list (for the boundary).
**Measured:** seven probe sets against the live API today, synthetic food-safety text only, no client data.
Everything in §3 is a real response from `jev-1.13.0`, not a guess. Probe scripts are in `/tmp/jev-haccp/`
(not committed; they read the key from `apps/student-learn/.env.local` and never print it).

---

## 1. The thesis

myHACCPAdmin already stores its scheme as **questions nobody can execute.**

Every `qmsItems` row carries `acceptanceCriteria[]`: plain-language statements such as *"Scope identifies
all products and process categories"* or *"Corrective actions are proportionate to the nonconformity"*.
Today those statements are read by a human, once a year, inside a `complianceAssessments` session, and the
human clicks `compliant | partial | gap`. Between sessions the scheme is inert text.

A model that returns a calibrated yes/no in 400 ms for $0.00002 makes those statements **executable**. The
scheme stops being a list of things to check and becomes the thing that checks. That is the PRD's own promise
("define what you need to monitor, and the system generates the tools") taken literally: *writing the
criterion is building the tool.*

Everything below follows from that, plus one discipline: Jev sorts, points and raises. Humans and code sign.

---

## 2. Facts about the platform that shape the ideas

| Finding | Where | Why it matters |
|---|---|---|
| The seeded scheme has 71 QMS items carrying **235 acceptance criteria**. By `criterionType`: `documented` 66, `completed` 57, `exists` 44, `contains` 27, `matches` 13, `current` 7, `withinRange` 7, `approved` 6, `communicated` 5, `trained` 3. | `convex/seed/qmsDomains.ts` | Six types (72 criteria) are answerable from the database by code. Four types (`contains`, `documented`, `completed`, `matches`: **163 criteria, 69 %**) need someone to read something. Most of the scheme is judgement. |
| Only 4 of 71 seeded items are `numeric`. 42 are `doneNotDone`, 14 `documentCheck`, 11 `yesNo`. | same | Range validation, the one check the system can do today, covers about 6 % of the scheme. |
| A text record is "compliant" if it is **non-empty**. `deviationNotes`, `correctiveActionTaken`, `verificationNotes`, `notes` are never evaluated. | `convex/records/validation.ts` `validateTextValue` | The richest evidence in the system is write-only. |
| `qmsItemStandardClauses` is a bare junction: two ids and a timestamp. No confidence, no provenance, no coverage level. Seeded by hand from `clauseNumbers`. | `convex/schema.ts:593` | A mapping with no strength cannot be re-evaluated, trusted selectively, or ported to another standard. |
| `standardClauses` rows carry `requirementText`, `guidance`, `mandatoryDocuments`, and `auditQuestions[]` (about three per requirement, ~170 requirements). | schema + JSON | The certification auditor's likely questions are already in the database, unused at runtime. |
| `controlPoints` stores `criticalLimit`, `monitoringProcedure`, `monitoringFrequency`, `correctiveAction` as **free text**, with a `linkedQmsItemId` whose `numericSpec` and `frequency` are structured. Nothing checks that they agree. | `schema.ts:2672` | The validated HACCP plan and the scheme that generates tasks can drift silently. This is a classic major finding at certification. |
| `auditQuestions.answerOptions` is an ordered list of `{label, score}`. | `schema.ts:3620` | That is structurally Jev's `score` primitive. |
| `ncrActions.effectivenessRating` is a human opinion entered at closure. | `schema.ts:3480` | Effectiveness is asserted, never observed. |
| `documents` has `extractedText` and a **document-level** `embeddingVector` with content hashing. | `documents/embeddings.ts` | Retrieval exists but not at passage level. Passage retrieval is a prerequisite for most ideas here. |
| `accountabilityOwner: provider | client | shared` on items and NCRs. First tenant is a BPO (Ecowize) serving many client sites. | schema, seed | Multi-site sameness is a first-class concern; so is client confidentiality when text leaves the platform. |

---

## 3. What the probes showed

Warm latency 373–524 ms, first call on a connection 1.1–3.2 s. 450–1,040 input tokens per call.

### A. An acceptance criterion judged against a passage (QMS-GOV-001, clause 4.3)
State = criterion + site master data (products, processes) + one passage.

| Passage | `satisfied` | `on_topic` | `intent_only` | `omission` |
|---|---|---|---|---|
| Complete scope, exclusion justified | **0.90** | 0.98 | 0.02 | 0.11 |
| Scope that omits the frozen line | **0.06** | 0.97 | 0.07 | **0.98** |
| "Committed to food safety across all operations" | 0.04 | 0.85 | **0.96** | 0.96 |
| Pest control procedure (wrong document) | 0.02 | **0.03** | 0.44 | 0.98 |

It caught the missing frozen baguette line by comparing against master data. The companion questions
separate three different failures that all score "not satisfied": wrong document, deficient document,
statement of intent. Those need three different human actions.

### B. A CCP record judged on arrival (clause 8.9.2)
| Operator note | marked | `product_controlled` | `hidden_deviation` | `released_at_risk` | `needs_ncr` |
|---|---|---|---|---|---|
| Re-cooked, batch held, QA release, supervisor told, seal logged | non-compliant | 0.98 | 0.64 ⚠ | 0.05 | 0.53 ⚠ |
| "Temp low. Turned oven up." | non-compliant | 0.21 | 0.55 | 0.14 | 0.83 |
| "First probe read 72 so I waited… got 75. All fine." | **compliant** | 0.33 | **0.92** | 0.07 | 0.20 |
| "ok" | compliant | 0.21 | 0.04 | 0.03 | 0.05 |
| "Probe is faulty again… looked cooked so sent it through" | non-compliant | 0.08 | 0.72 | **0.96** | **0.96** |

The third row is the prize: a record the system files as compliant today, carrying an admitted breach.
The two ⚠ cells are my errors, not the model's. `hidden_deviation` is meaningless on a record already marked
non-compliant, so code must decide which questions apply. `needs_ncr` is a policy question (does any CCP
breach raise an NCR?) and policy belongs in the severity matrix, not in a probability.

### C. Clause mapping, one `noul` per shortlisted requirement
| QMS item | 8.5.4.3 monitoring | 8.7 measuring | 8.9.2 corrections | 8.3 trace | 7.1.6 suppliers | 7.2 | 9.2 |
|---|---|---|---|---|---|---|---|
| Metal detector hourly challenge | **0.93** | 0.77 | **0.87** | 0.03 | 0.04 | 0.29 | 0.11 |
| COA check on flour intake | 0.70 | 0.06 | 0.32 | 0.68 | 0.71 | 0.10 | 0.08 |
| Annual probe calibration | 0.33 | **0.95** | 0.07 | 0.02 | 0.40 | 0.08 | 0.07 |

Mapping is many-to-many, so parallel `noul`s beat one `choice` (which forces exclusivity). The 0.68–0.71
band on the COA row is a real "needs your eyes" zone, and it is where a consultant would also pause.

### D. HACCP plan text versus the QMS item that generates tasks
Specific questions caught every planted drift: limit lowered 75→72 (`limit_ok` 0.04), sample cut 3→1
(`sample_ok` 0.03), corrective action weakened to "turn oven up" (`ca_ok` 0.08).
Two failures worth recording:
- The aggregate question *"weaker anywhere?"* scored **0.69 on the fully consistent pair.** A false alarm.
- `limit_ok` on an unchanged 75 °C limit fell to 0.45 when a *different* field had drifted. One defect drags
  neighbouring answers down. **Halo effect.** Numeric comparison by judgement is noisy.

### E. NCR closure quality, and F. recurrence
| Root cause → action | `is_cause` | `blames_person` | `ca_addresses_cause` | `systemic` | `proportionate` |
|---|---|---|---|---|---|
| "Operator error" → retrained | 0.32 | 0.93 | 0.37 | 0.15 | 0.10 |
| Real systemic RCA → WI revised, window extended, independent sign-off | 0.91 | 0.03 | 0.93 | 0.98 | 0.92 |
| **Good cause ("window too short") → "reminded to be careful, poster"** | 0.74 | 0.12 | **0.05** | 0.10 | 0.05 |

Recurrence against a closed NCR: same failure 0.85, different line but same failure mode 0.78
(`same_equipment` 0.03), same line but unrelated 0.42.

### G/H. Operator competence (clause 7.2)
| Answer to "the test piece is not rejected, what do you do?" | `competent` | `would_release_risk` |
|---|---|---|
| Full correct answer | 0.94 | 0.18 |
| **Correct in broken English** ("all the bread from last check must go hold…") | **0.94** | 0.19 |
| Stops, calls maintenance, never mentions product already made | 0.13 | 0.87 |
| "I run it again, usually works second time" | 0.02 | 0.96 |
| "Follow the procedure and report it" | 0.37 | 0.74 |

It does not punish second-language wording. That matters for this workforce.
One defect: asked whether the operator would quarantine earlier product, it scored **0.64 and 0.88 for
answers that never mention product.** Adding explicit criteria ("silence counts as false") moved those to
0.17 and 0.50 while leaving true cases at 0.97–0.98.

### Design rules these results force
1. **Ask specific questions and aggregate in code.** Never ask "is anything wrong?" (D).
2. **Every presence question carries a `criteria.false` that says silence is false** (H).
3. **Code chooses the battery.** Which questions apply depends on deterministic facts such as `isCompliant`,
   `checkType`, `severity` (B).
4. **Numbers, dates, frequencies and policy go to code.** Extract them into structure once, compare forever (D, B).
5. **Always a discriminating companion.** `satisfied` alone cannot tell wrong document from thin document (A).
   This is the same lesson as `cleared OR arithmetic_only` in the education test.
6. **Expect halo.** A state with one obvious defect depresses unrelated answers. Keep states small and
   single-purpose; one subject per call.

---

## 4. Cross-cutting design

### 4.1 Living with "no rationale"
An auditor cannot be answered with "0.87". Five patterns, used throughout:

- **P1. The evidence pointer is the rationale.** Judge at passage level and store *which passage* was judged.
  When someone asks why criterion X is met, the answer shown is the paragraph, with document code and version.
  The number is a sorting key and is never presented as a justification.
- **P2. Judgements live in their own ledger, never in the record of truth.** Jev writes to a new `judgements`
  table. `assessmentFindings.result`, `records.isVerified`, `ncrs.state`, `qmsItemStandardClauses` rows and
  `auditResponses` are written by a signed-in human or by deterministic code. Those tables already carry
  `assessedByUserId`, `verifiedByUserId` and so on; keep them meaningful.
- **P3. Asymmetric automation.** Jev may *raise* anything. It may *clear* nothing on a critical item. On
  non-critical items, high-confidence passes can be batch-confirmed under a **recorded sampling plan**
  (human opens a random n %). An auditor understands sampling; it is how audits work.
- **P4. When prose is needed, Claude drafts and the human signs, and Jev checks the draft.** One extra `noul`
  ("this justification is supported by the quoted passage") is a 400 ms hallucination check on the generator.
- **P5. The method is validated, not each answer.** Every human confirm or override is stored against the
  judgement. That produces a per-tenant agreement table by question family. "At ≥0.90 on `contains` criteria
  reviewers agreed 97 % of 412 times" is evidence about the *verification method*, which is what ISO 22000
  8.8 and 9.1 ask for.

### 4.2 One table, one action
```
judgements {
  tenantId, siteId
  subjectType: "criterion" | "record" | "clauseLink" | "coherenceEdge" | "ncrAction" | "competencyAnswer" | "hazard"
  subjectId: string
  battery: string, batteryVersion: number      // the question set, versioned in code
  answers: string                               // JSON {questionKey: probability}
  derived: string                               // JSON, computed in code from answers (flags, band)
  band: "clear" | "needsEyes" | "flag"
  evidenceRef?: { documentId, versionNumber, chunkId | fieldPath }
  stateHash: string                             // SHA-256 of the exact state sent
  model: string                                 // "jev-1.13.0" comes back on every response
  disposition?: "confirmed" | "overridden", dispositionByUserId?, dispositionAt?
  createdAt
}
indexes: by_subject [subjectType, subjectId], by_tenant_band [tenantId, band], by_stateHash
```
`stateHash` reuses the content-hash pattern already in `documents/embeddings.ts`. It makes re-judging
idempotent, proves what was judged, and lets a background job re-run an entire archive when a battery
version or a standard changes without touching unchanged states.

One Convex `internalAction` (`judge`) is scheduled with `ctx.scheduler.runAfter(0, …)` from the mutations
that create the subject. Convex reactivity means the band simply appears in the UI when it lands; no spinner.
**Latency note:** a Convex action is a fresh runtime often enough that you should plan on the cold figure
(~1.2 s), not 410 ms. That is irrelevant for judge-on-arrival. For on-save linting it is still acceptable.
Batch jobs should loop inside one action so the connection stays warm.

### 4.3 The deterministic split, by `criterionType`
| Type | Decider | How |
|---|---|---|
| `exists` | code | a `documentLinks` row of `linkType: "qmsItem"` to a published document |
| `current` | code | `nextReviewDate`, `effectiveDate`, certificate expiry |
| `approved` | code | `documentApprovals`, `approvedAt` |
| `communicated` | code | `documentIssuances` / `siteDocumentStatus` / `documentAcknowledgments` |
| `trained` | code, then Jev for understanding (Idea 6) | `trainingRecords` vs `positionTrainingRequirements` |
| `withinRange` | code | `numericSpec` |
| `contains` | **Jev** | passage vs criterion |
| `documented` | code (a record exists) **then Jev** (it says the thing) | |
| `completed` | code (a task closed) **then Jev** (the record shows it was done, not just ticked) | |
| `matches` | **Jev** | e.g. "proportionate to the nonconformity" |

---

## 5. The ideas

### Idea 1 — The scheme that assesses itself

**What it is.** Each judgement-type acceptance criterion is compiled into a small question battery and run
against its evidence whenever either side changes: a document version is published, a record lands, the
criterion is edited. The three question sources already exist in the database: `qmsItems.acceptanceCriteria`,
`standardClauses.auditQuestions`, and `auditQuestions` on templates.

**What changes about the product.** `complianceAssessments` stops being an event and becomes a view. Today a
gap analysis is a project: someone walks 71 items and 235 criteria and clicks. After this, the gap analysis
is always current, and the annual session becomes a *review of what the system is unsure about*. The "audit
readiness score" in PRD §6.9 becomes real in a specific sense: for each of the ~500 clause audit questions,
could a competent person answer it from what is on file? The desk half of an internal audit (record
verification and document review questions) arrives pre-answered with pointers, and the auditor's hours go
to the floor, where observation and interviews need a person. The product changes from a place where people
attest to a system that knows its own state and says where it does not.

**Primitive and questions.** `noul` battery per criterion × passage, as probed in §3A:
`satisfied`, `on_topic`, `intent_only` (policy language with no mechanism), `omission` (against master
data: products, process lines, sites), and per-type extras such as `assigns_responsibility`,
`states_frequency`, `exclusion_justified`. For audit template questions use `score` directly over the
question's own `answerOptions` labels. Code derives the band: `satisfied ≥ t_hi ∧ on_topic ≥ 0.8` → clear
with pointer; `on_topic < 0.2` for every retrieved passage → "no relevant evidence linked" (a retrieval or
linking gap, not a compliance gap); anything else → needs eyes, with the low-scoring companion shown as the
reason to look.

**What has to be true.**
- Passage-level retrieval. `documents.embeddingVector` is per document today. Add a `documentChunks` table,
  or for `contentMode: "structured"` documents use the schema `fieldPath` as the chunk, which also gives a
  stable human-readable pointer.
- `extractedText` populated for uploaded PDFs and DOCX.
- Master data (products, process lines) complete enough to feed `omission`.
- A calibration set: 200 criterion–passage pairs labelled by Durai's food scientist before any threshold is chosen.

**How it fails.**
- A criterion satisfied across three paragraphs of a 40-page SOP scores low on each chunk. Mitigate by
  judging the top-k passages together as a second pass. Still the main technical risk.
- Evidence on paper or on SharePoint (`externalUrl`, `externalLocation`) is invisible; the system would
  report a gap that is really a filing gap. The `on_topic` rule above keeps that honest.
- Vague criteria yield vague probabilities. That is a feature for scheme authors (Idea 9 drift view shows
  which criteria never resolve) but will look like a model fault at first.
- Rubber-stamping. If batch-confirm becomes one click, the human signature means nothing. P3's forced
  sample is the guard.

---

### Idea 2 — Every record read on arrival

**What it is.** When `records/capture.ts` inserts a record, code validates what code can (range, presence,
timing) and schedules a judgement over everything code cannot: `deviationNotes`, `correctiveActionTaken`,
`notes`, `verificationNotes`, and text-type values.

**What changes about the product.** Verification moves from **sample to census**. Today a supervisor sets
`isVerified` on a list they cannot realistically read, and an auditor later samples ten records. After this,
every record has been read within two seconds of being written, and the supervisor's queue is ordered by
what needs a person. It also unlocks a kind of scheme item that cannot exist today: observational checks
with plain-language limits ("describe the condition of the door seals", criterion "no tears, mould or
gaps"). Most PRP monitoring is observational. Right now `checkType: "text"` is decoration.
ISO 22000 8.9.1 still requires a designated competent person to evaluate monitoring data. This does not
replace them. It decides what they look at first.

**Primitive and questions.** `noul` battery, chosen by code (rule 3):
- record marked compliant → `hidden_deviation`, `departure_from_method`, `equipment_doubt` ("probe faulty again").
- record marked non-compliant → `product_controlled` (8.9.2.1), `limit_restored`, `escalated`,
  `released_at_risk`, `cause_addressed`, `matches_prescribed_ca` (against `qmsItems.correctiveAction`).
- text-type value → `meets_criterion` per acceptance criterion, plus `describes_observation`.
`released_at_risk ≥ 0.8` on an item with `isCritical` pages someone now. Whether an NCR is raised is decided
by the severity matrix in code from those flags, not by asking Jev (§3B).

**What has to be true.** Operators write something. If notes are empty or "ok", there is nothing to judge,
and a length check says so more reliably than Jev did (0.51). The capture UI must ask for a sentence on any
deviation. Voice-to-text would help on the floor. Notes will be in mixed English, Shona, isiZulu and
Afrikaans: untested, and must be before launch.

**How it fails.**
- Alert fatigue. A 5 % false-flag rate on 600 records a day is 30 interruptions. Only `released_at_risk` and
  `hidden_deviation` on critical items interrupt; everything else sorts a queue.
- Operators learn the words that pass. Mitigation is deterministic: identical notes across records, identical
  values, timestamps clustered at shift end are all code, and should ship alongside.
- An honest note ("waited and re-probed") gets an operator in trouble, so they stop writing honest notes.
  This is a management risk, not a technical one, and it is the most likely way this idea dies.

---

### Idea 3 — Scheme once, certify many

**What it is.** Turn `qmsItemStandardClauses` from a hand-made junction into a judged, confidence-bearing
coverage matrix at *requirement* level, then use it to port an existing scheme onto any other standard.

**What changes about the product.** Today the platform is an ISO 22000 tool with a seeded mapping. A food
manufacturer's real life is ISO 22000 → FSSC 22000 v6 additional requirements → BRCGS Issue 9 → a retailer
code of practice → national regulation (R638 in South Africa). Each step is currently a consultant with a
spreadsheet for weeks. With the mapping as a 400 ms judgement: import the new standard's clauses, retrieve
the top 8 candidate items per requirement, judge, and within minutes report *"312 requirements covered with
confidence, 41 need your eyes, 27 have nothing behind them"*. The 27 become draft QMS items (Claude drafts,
human approves). The product becomes **the scheme**, with standards as lenses over it. That is the PRD's
"standards-informed, not standards-rigid" made operational, and it is a line a salesperson can say.
It also licenses the move in the Jev notes §8a: when a standard is revised, diff the clause text in code,
re-judge only changed requirements across the whole scheme, and show what now falls short.

**Primitive and questions.** Per (item, requirement) pair from the shortlist, parallel `noul`s as in §3C:
`provides_direct_evidence`, `only_loosely_related`, `addresses_intent_at_policy_level`,
`monitors_it` versus `merely_documents_it`. Then one `score` for coverage on ordered levels
*none / mentions / partial / substantial / full*. **Not `choice`**: mapping is many-to-many. Coverage of a
requirement is then computed in code as mapped × evidenced (Idea 1) × performed (task completion, Idea 2),
which is the honest number for the clause-coverage dashboard.

**What has to be true.**
- Schema additions to the junction: `coverageLevel`, `confidence`, `source: "seed" | "human" | "judged"`,
  `confirmedByUserId`, `judgementId`. A judged link is a *proposal* until confirmed (P2).
- Requirement-level rows in `standardClauses`. Already true: `importIso22000.ts` writes one row per
  requirement (`clauseNumber: req.id`, e.g. 8.9.2.1) with its `requirementText` and `auditQuestions`.
- Embedding retrieval over items and requirements, because 170 × 71 pairs is fine but 450 × 600 is not.
- Standards content. BRCGS and FSSC text is licensed. Sending clause text to a third-party API needs a
  licence check, and paraphrases (as the ISO JSON already is) weaken the judgement.

**How it fails.**
- Requirements that are satisfied by the *combination* of five items score partial on each. Needs a
  second pass that judges the requirement against the set.
- Management-system clauses (context, leadership, 4–6) map poorly to monitoring items; they are evidenced by
  documents and minutes. Route those to Idea 1 rather than forcing them through items.
- A confident wrong "covered" is the expensive error: it hides a gap until certification. Thresholds for
  *covered* must be stricter than for *uncovered*, and every judged link on a "shall" needs confirmation.

---

### Idea 4 — A type-checker for the management system

**What it is.** The FSMS is a graph: hazard → control point → QMS item → procedure document → training item →
position. Every edge is a claim that two pieces of text agree. On every save of any node, re-judge its edges.

**What changes about the product.** The most common serious certification finding is not a missing document.
It is two documents that disagree: the HACCP plan says 75 °C every batch, the monitoring form says 72 °C
hourly, the training deck says something else. Today the platform stores all of these and checks none
(`controlPoints.criticalLimit` is free text next to a structured `numericSpec`). A coherence check that runs
like a linter changes the product from a filing system to something that **refuses to let the management
system contradict itself quietly.** It also makes change control (PRD open question 16) tractable: publish
a new document version and the system lists the items, control points and training items whose edges just
went amber, instead of a person remembering what references what.

**Primitive and questions.** `noul`, specific and per field (rule 1), as in §3D: `limit_at_least_as_strict`,
`time_or_hold_condition_carried`, `frequency_at_least`, `sample_size_at_least`,
`corrective_action_controls_product`, `responsible_role_matches`. For document → training edges:
`training_covers_step_n` per critical step. For document revisions: `change_affects_limits`,
`change_affects_method`, `change_is_editorial`.

**What has to be true.** The probe says plainly that numeric agreement must not be judged (0.73 on an
identical limit, 0.45 under halo). So the first step is structural: parse `criticalLimit` and
`monitoringFrequency` into fields once (Claude extracts, human confirms, stored on `controlPoints`), then
compare numbers in code and reserve Jev for the prose edges: method, corrective action, responsibility,
training coverage. With that split it works. Without it, it produces false alarms on the pairs that are fine.

**How it fails.** Halo and false alarms make people ignore amber. Stricter-than-plan items (78 °C against
75 °C) must read green, and did (0.85). "Per batch" versus "hourly" is unknowable without batch duration
(0.60), correctly uncertain but annoying. Overlap: the e-wizer agent will propose material-versus-cosmetic
for SSOP revisions; the revision questions here are the same battery and should be built once.

---

### Idea 5 — Onboarding by ingestion

**What it is.** A new site arrives with 200 files. Each passage is judged: document level
(`choice`: policy / procedure / work instruction / form / record), PRP category (`noul` per `prpCategories`
code), `contains_monitoring_commitment`, `states_limit`, `states_frequency`, `assigns_role`. Passages that
contain a commitment go to Claude to draft a `qmsItems` row. Jev then checks each draft against its source
passage (`faithful`, `frequency_matches`, `limit_matches`) before a human sees it.

**What changes about the product.** The PRD's "maturity mode: import existing docs" becomes the front door.
Time from contract to a working scheme drops from consultant-weeks to an afternoon of confirming. For a BPO
like Ecowize onboarding client sites, and for the Consultant persona, that changes the commercial shape:
onboarding stops being the cost that gates every sale.

**What has to be true.** Text extraction from scanned PDFs. A generative extraction step, so Jev is the
checker here and not the engine. `documentTemplates` and `industryPacks` give the gap-fill for what the
client lacks.

**How it fails.** Garbage documents produce a confident garbage scheme. A scheme nobody authored is a scheme
nobody owns; every generated item needs an accountable position before activation. One-time value per
client, so it matters to sales more than to daily use.

---

### Idea 6 — Competence as demonstrated understanding

**What it is.** `trainingRecords` prove attendance. Replace the proof with a short free-text or spoken answer
to a scenario drawn from the work instruction's corrective action, judged in 400 ms. Ask at three moments:
after training, before a user's first critical task in 30 days, and after any document revision flagged by
Idea 4 as affecting method or limits.

**What changes about the product.** PRD §6.12 lists the auditor's floor question: *"Does staff understand
corrective action?"* Every certification audit asks it, and it is where well-documented sites fail. This
puts the interview inside the system and ahead of the auditor. Clause 7.2.4 requires evaluating the
*effectiveness* of training; a judged answer is that evaluation. The `trained` criterion stops meaning
"signed a register". This is the education gating result transplanted, and it is the best-evidenced idea
here: two independent probe sets show the same behaviour (right answer for the wrong reason is caught;
rough wording is not punished).

**Primitive and questions.** `noul`: `competent`, `would_release_risk` (the dangerous misconception),
`controls_product_back_to_last_good_check`, `escalates`, `language_only`, `too_vague`. Gate as in the
education test: pass on `competent ∨ language_only`, and treat `would_release_risk ≥ 0.8` as a block on
assignment to CCP tasks until a supervisor conversation is logged. Every presence question carries the
"silence is false" criterion (§3H).

**What has to be true.** Scenario questions authored per critical work instruction (Claude drafts from
`controlPoints.correctiveAction`, QA approves). Input in the operator's language, ideally voice. Labour
relations handled: this is assessment of people, and the record of it is personal data under POPIA.

**How it fails.** Used punitively, it becomes a test people game or resent. Operators share model answers.
Vague answers sit at 0.37, which must route to a follow-up question, never to a fail. Overlap: e-wizer's
operatives would benefit identically; build once.

---

### Idea 7 — NCR closure gate, and effectiveness by recurrence

**What it is.** Two parts. At closure, judge the `ncrActions` chain. After closure, judge every *new* NCR
against retrieved closed ones and let recurrence set effectiveness.

**What changes about the product.** `effectivenessRating` is an opinion typed at closure by someone who
wants the NCR closed. With recurrence judged (§3F: 0.85 same failure, 0.78 same mode on another line), a
closed NCR's effectiveness becomes an **observed outcome**: the system reopens the question when the failure
comes back, including on a different line or site, which no human cross-reads today. That is real evidence
for QMS-NCR-005 (trending), QMS-IMP-001 and clause 10.1. The closure battery attacks the most common
weakness in any NCR system, "operator error, retrained", and the mismatch case in §3E (good cause, useless
action, 0.05) is one that reviewers routinely miss.

**Primitive and questions.** `noul`: `is_cause`, `blames_person`, `ca_addresses_cause`, `correction_only`,
`systemic`, `proportionate` (QMS-IMP-004, clause 10.1.2), `verification_independent`; recurrence:
`same_failure_mode`, `same_equipment`, `prior_ca_failed`.

**What has to be true.** Embedding retrieval over NCRs. Descriptions of more than a line. The gate advises
the approver; it does not block the state machine, because a blocked NCR with a deadline gets gamed.

**How it fails.** `blames_person` fired at 0.81 on a root cause that merely restated the problem. Category
confusion between adjacent defects is real, so show flags as prompts to the approver, not verdicts.
**Overlap:** e-wizer has the same NCR tables and its agent will likely claim triage. Closure quality and
recurrence are the higher-value half; whichever product hosts it, build one battery.

---

### Idea 8 — A second opinion inside the HACCP study

**What it is.** While the team fills `processStepHazards`, Jev scores the same 1–3 factors
(`healthConsequence`, `controlEffectiveness`, …) with `score`, checks that each CCP decision-tree
justification supports the boolean beside it (`ccpQ2Justification` versus `ccpQ2StepDesignedToEliminate`),
and judges a retrieved shortlist of library hazards for `reasonably_expected_at_this_step`. Disagreement at
high confidence raises a challenge. Across a multi-site tenant it flags the same hazard scored differently
at two sites.

**What changes about the product.** The study tool becomes adversarial instead of clerical, and group-wide
consistency becomes visible. The same applies to `vulnerabilities` (VACCP) and `threats` (TACCP).

**What has to be true.** Jev must actually know food microbiology and process science. **Untested, and I
would not assume it.** A hazard library to retrieve from.

**How it fails.** A plausible wrong challenge wastes a workshop; a missed hazard gives false comfort, and
here false comfort can hurt people. Keep it as a challenge generator with no authority, and do not build it
until a domain test set says it is competent.

---

### Idea 9 — The assurance ledger: what confidence makes possible

Not a feature beside the others. It is what the others produce, and the part a binary could never give.

- **Three-state compliance.** `complianceAssessments.overallScore` is one percentage built from human ticks.
  Replace it with *confident-conforming / confident-failing / unknown*. "78 % assured, 9 % failing, 13 % we
  cannot tell, and here is that 13 % as a work queue" is a more honest and more saleable dashboard than
  "91 %". Unknown is not failure, and conflating them is what makes audit day a surprise.
- **The quality manager's day is generated.** Order the queue by uncertainty × criticality (`isCritical`,
  CCP link) × days to the next audit (`audits.plannedDate`, or the audit date on `prpAuditPreparation`;
  the PRD's `StandardLink.nextAuditDate` is not in the schema yet).
- **Conformance has a derivative.** A probability can drift from 0.95 to 0.70 over six weeks before anything
  fails. Corrective-action notes on night shift getting thinner, a criterion's evidence ageing. A binary
  cannot trend. This is the leading indicator that PRD Phase 4 calls "predictive insights", without a
  predictive model.
- **Calibration is an asset that compounds.** Every confirm or override tunes per-tenant thresholds by
  question family, and the agreement table is itself audit evidence (P5).
- **Re-judge history.** New battery version or revised clause: re-run the archive as a background job,
  skipping unchanged `stateHash`es.

**How it fails.** A probability shown to the wrong audience reads as either false precision or an admission.
Show bands and pointers to users; keep numbers for the calibration screen.

---

## 6. Discarded: a faster screen, not a different product

- NCR category and severity suggestion (PRD §6.10). Saves one dropdown. The e-wizer notes already list it.
- Document category and tag suggestion on upload.
- `accountabilityOwner` (provider/client/shared) suggestion for new items.
- Supplier certificate scope check ("does this cert cover what we buy"). Useful once Supplier Management
  exists; there is no suppliers table yet.
- Routing `documentRequests` to the right QA person.
- "Natural language querying of compliance data" (PRD §6.10). Wrong tool entirely; Jev does not generate.
- COA values against specification. Extraction then arithmetic. Code.
- Overdue, expiry, approval state, acknowledgement state, version lineage. Code.

## 7. Boundary with e-wizer

e-wizer is the execution plane for hygiene and conformance: MCS, SSOPs, operatives, shifts, task
completions. myHACCPAdmin is the management-system plane: standards, scheme, HACCP/VACCP/TACCP, gap
analysis, document control, competence. Ideas 1, 3, 4, 8 and 9 exist only here. Ideas 2, 6 and 7 have twins
in e-wizer (task completion notes, operative competence, NCRs) and should be **one shared battery library
and one `judgements` table shape**, not two implementations.

---

## 8. Ranking, and the argument

| # | Idea | Verdict | Why this rank |
|---|---|---|---|
| 1 | **The scheme that assesses itself** (Idea 1, carrying Idea 9 as its output) | **Transformative** | It is the PRD's core promise made literal. 69 % of the scheme's criteria cannot be executed today; this executes them. Probe A was the cleanest result of the day. Everything else reuses its plumbing. |
| 2 | **Scheme once, certify many** (Idea 3) | **Transformative** | Changes what is being sold: a scheme with standards as lenses, not an ISO 22000 tool. Turns consultant-weeks into minutes, and makes re-judging on a standard revision a background job. Uniquely this product's. |
| 3 | **Every record read on arrival** (Idea 2) | **Transformative** | Sample → census is a change in the unit of assurance. Probe B found an admitted CCP breach inside a record the system files as compliant. Ranked third only because its failure mode is human (honest notes punished), not technical. |
| 4 | **Competence as demonstrated understanding** (Idea 6) | **Transformative for the training module** | Best evidenced: two independent probe sets agree. Tolerates second-language answers. Answers the floor question every auditor asks. Smallest build of the top five. |
| 5 | **FSMS type-checker** (Idea 4) | **Transformative if the structural step is done first**, otherwise noisy | Targets the most common serious finding. Probe D says numbers must go to code; with that split the prose edges judged well. |
| 6 | **Onboarding by ingestion** (Idea 5) | Commercially transformative, technically mostly Claude | Jev is the checker, not the engine. One-time value per client. |
| 7 | **NCR closure gate + effectiveness by recurrence** (Idea 7) | **Useful, strongly** | Recurrence-as-effectiveness is a genuinely new signal. Shared with e-wizer, so it should not take two slots in a top ten. |
| 8 | **HACCP second opinion** (Idea 8) | **Conditional** | High value, high harm if wrong, domain competence untested. Do not build before a test set. |

If the final list has room for only three from this surface, take **1, 3 and 2**, in that order, and treat
the ledger (Idea 9) as the shared foundation rather than a line item. If it has room for one, take Idea 1:
it is the only one where the platform already contains the questions, the evidence and the table for the
answer, and lacks only something able to read.

## 9. Cheapest experiments before committing

1. **Calibration set for Idea 1.** 200 real criterion–passage pairs from the Ecowize seed, labelled by the
   food scientist. Output: agreement by band, thresholds per `criterionType`. One day.
2. **Long-state limit.** How many tokens does `state` accept before quality or latency degrades? Decides
   chunk size and whether a multi-passage second pass is viable.
3. **Language.** Probes B and G repeated with Shona, isiZulu, Afrikaans and mixed notes.
4. **Domain competence** for Idea 8: 50 hazard-scoring cases with known consensus answers.
5. **Stability.** Same state, 20 runs: is the probability deterministic? It must be, or `stateHash`
   idempotence is only a cost saving and not a reproducibility claim.
6. **Images** (open in the Jev notes). Record `attachments` are photos; if `state` takes images, observational
   checks in Idea 2 widen considerably.
7. **Data handling.** Client SOPs and records would leave the platform for `api.typesafe.ai`. Needs a data
   processing agreement and a line in the BPO contracts before any tenant's real text is sent.

## 10. If we build: sequencing

Foundation, in order: (a) `judgements` table + `judge` action + battery registry in code;
(b) `documentChunks` with passage embeddings and `fieldPath` pointers; (c) disposition UI (confirm /
override / forced sample). Then in parallel, one crew each: Idea 2 (needs only a), Idea 6 (needs only a),
Idea 1 (needs a, b, c), Idea 3 (needs a, c and junction fields). Idea 4 waits on structured
`controlPoints` fields. Ideas 5, 7, 8 after.
