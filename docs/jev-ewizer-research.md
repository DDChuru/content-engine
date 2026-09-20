# Jev × e-wizer: from recorded conformance to examined conformance

Design investigation and implementation breakdown · 2026-09-20

**Recommendation: build the MCS reconciliation workspace first; make procedure-to-practice assurance the product destination.** The opportunity is to make uncertainty actionable: which imported rows can be reconciled, which operating obligations changed, and which recorded passes have evidence that actually supports them. A faster SSOP picker would miss most of the value.

I nominate five substantial candidates and one supporting extension below. They are e-wizer operating-workflow ideas, not standards/clauses/QMS mapping for myHACCPAdmin. The latter repository was not needed or modified. No e-wizer files or production records were changed. Application functions named `deployMcs`, `recordRelease`, etc. are discussed as future integration points; none were executed.

Evidence basis: [the live Jev notes](jev-system-one.md), read before the code and refreshed after their pricing update; e-wizer working-tree source at HEAD `97f5d93b4e84b5e4d381199be8c572b6bd55d574`; primary TypeSafe documentation; and two synthetic API probes performed for this investigation. Repository facts, proposals, and unproven hypotheses are distinguished below. The code inspection establishes implementation behavior, not which optional workflows every live site currently uses.

## 1. Findings that materially change the design

| What is actually in the code | Architectural consequence |
|---|---|
| `documentType` is `SOP \| POL \| WI \| SCI \| SSOP \| MCS`. `MCS` is a controlled source record, distinct from the operational register. `versionState` includes `draft`, `in_review`, `approved`, `published`, `rejected`, `superseded`. [Schema](/home/dachu/Documents/projects/e-wizer/convex/schema.ts:47) | Reconcile the source document before changing scheduled work. Do not introduce a parallel master schedule owned by the model. |
| `documents.baseDocumentId`, `inheritanceMode: inherit \| forked`, `documentVersions.sourceVersionId`, and `computeSyncStatus` represent lineage and upstream synchronization. [Documents](/home/dachu/Documents/projects/e-wizer/convex/documents.ts:1106) | Keep inheritance and current-version resolution deterministic. A new semantic comparison is a separate question: does this fork preserve the relevant operating obligations? |
| The real editable Excel path is `mcsRoundtrip.ts` → `MCSReimportDialog.svelte` → `mcsEdit.upsertMcsRows`. It exports editable document rows with `_rid`, not the printed customer report. [Exporter/parser](/home/dachu/Documents/projects/e-wizer/src/lib/services/mcsRoundtrip.ts:94), [dialog](/home/dachu/Documents/projects/e-wizer/src/lib/components/site-manager/MCSReimportDialog.svelte:53) | The right intervention is a persistent reconciliation session around this path. Replacing `parseAndMatchMCS` alone would not solve the named round-trip. |
| `upsertMcsRows` matches `_rid`, then lowercased `area\|section\|equipment\|frequency`, then inserts. Missing uploaded rows are retained and reported as `orphans`. Blank SSOP references preserve existing links; blank quantity/responsibility can clear those fields. [Upsert](/home/dachu/Documents/projects/e-wizer/convex/mcsEdit.ts:1239) | A lost ID plus an edited frequency can become a new row. Distinguish omitted columns, blank cells, deliberate clears, and missing rows. This needs code before semantic inference. |
| Row IDs are local strings such as `r12`. `buildEditableWorkbook` carries no site/document/export-baseline binding. Parser duplicate-ID maps are inside the sheet loop; validation of nonblank IDs against site state is a TODO. [Parser](/home/dachu/Documents/projects/e-wizer/src/lib/services/mcsRoundtrip.ts:264) | Add server-side, workbook-wide identity validation and an export manifest. An exact string match to a wrong site's `r12` is not an authorized identity match. Jev is not the fix for this. |
| `McsSnapshotRow.referenceInferred?: boolean` and `schemeItems.referenceInferred` say a reference was derived. `customerOwned` is independent. Deliberate reference edits clear the flag. [Snapshot](/home/dachu/Documents/projects/e-wizer/convex/mcsSnapshot.ts:1), [edit](/home/dachu/Documents/projects/e-wizer/convex/mcsEdit.ts:1580) | The boolean is provenance, not a probability and not a correctness guarantee. Preserve it for compatibility; add immutable decision history rather than merely replacing it with a float. |
| A separate smart import uses division rules, then Claude SDK batches of 50, three concurrent calls. It emits generated task names, frequencies, reasoning, and confidence; rule hits are presented with `score: 1.0`. [Smart import](/home/dachu/Documents/projects/e-wizer/convex/mcsImport.ts:883) | Confidence is not entirely new to e-wizer. The innovation must be a governed uncertainty workflow. Jev cannot replace the generated name/reasoning outputs one for one. Learned aliases must not become semantic certainty merely because lookup is exact. |
| `mcsBatches` groups registers and `includeRids` permits partial updates. `composeFilteredMcsRows` restores held rows from deployed state. Published MCS snapshots are stamped separately. [Batch](/home/dachu/Documents/projects/e-wizer/convex/mcsBatch.ts:380), [snapshot](/home/dachu/Documents/projects/e-wizer/convex/mcsSnapshot.ts:38), [version snapshot](/home/dachu/Documents/projects/e-wizer/convex/mcsVersionSnapshot.ts:23) | Confidence can support “apply these resolved changes; hold these exceptions” without rebuilding the update machinery. Selection must preserve dependencies and all existing held work. |
| Promotion matches `mcsRowId` across schemes, preserves the `schemeItems._id` when a row moves, records `frequencyHistory`, and soft-retires missing stamped rows. [Promoter](/home/dachu/Documents/projects/e-wizer/convex/mcsPromote.ts:452) | Identity mistakes corrupt operational history, not just labels. Never feed the promoter a residue-only row array. Its actual soft-retirement code supersedes the older “never deletes/additive” commentary in `mcsDeploy.ts`. |
| Pure equipment ordering already has an `orderOnly` path. Frequency direction already has a deterministic `riskUp` heuristic. MCS editors can apply additions/edits on their existing authority; deletion has SHEQ approval. Optional peer review also exists. [Update core](/home/dachu/Documents/projects/e-wizer/convex/mcsDeploy.ts:516), [deletion](/home/dachu/Documents/projects/e-wizer/convex/mcsEdit.ts:1700) | Do not spend a model question classifying an ordering-only diff. Do not invent blanket SHEQ approval for all MCS imports. Advisory semantic review can respect the existing authority model. |
| SSOP publishing stores human `changeReason` separately from machine `changeSummary`. `documentApprovals`, issuances, re-acknowledgement, and job observations exist, but the inspected publish path has no general material-change→targeted-retraining chain. [Publish](/home/dachu/Documents/projects/e-wizer/convex/siteDocEdit.ts:58), [issuance](/home/dachu/Documents/projects/e-wizer/convex/documentDistribution.ts:180) | Targeted change obligations require new links and orchestration. Do not claim that changing one classifier will activate an already complete dependency engine. |
| `audits.startAudit` freezes a template; `saveAnswer` computes scores, failure status and NCR drafts; `completeAudit` checks required answers and seals results. IASV severity, weighted penalties, critical collapse, customer-responsibility exclusions and NCR filters are code. [Audits](/home/dachu/Documents/projects/e-wizer/convex/audits.ts:724), [IASV](/home/dachu/Documents/projects/e-wizer/convex/iasvImport.ts:661) | Preserve official scoring. Ask whether the supplied observation supports the human answer, not what score to replace it with. Audit-template inheritance uses `linked \| forked`, distinct from document `inherit \| forked`. |
| `documentAuditFindings` already stores per-dimension `confidence` strings and `rationale`; escalation is human. Exceptions suppress future matching gaps. The readiness score explicitly says training linkage is not yet wired. [Findings](/home/dachu/Documents/projects/e-wizer/convex/schema.ts:1244), [exceptions](/home/dachu/Documents/projects/e-wizer/convex/documentAudit.ts:1216), [readiness](/home/dachu/Documents/projects/e-wizer/convex/documentAudit.ts:940) | A second library-quality classifier is incremental. More valuable: make the basis of an exception revisitable and connect a procedure to evidence of its execution. Never put a Jev number into the existing `rationale` field. |
| Evidence already spans `documents.attachments`, `documentRequests.attachments`, `audits.answers[].photoIds`, `taskCompletions.imageIds/afterImageIds`, NCR step attachments, `trainingObservations`, CCV, and client micro records. [Attachments](/home/dachu/Documents/projects/e-wizer/convex/schema.ts:259), [completions](/home/dachu/Documents/projects/e-wizer/convex/schema.ts:2722) | Start from evidence linked to an operating event. Do not build a universal document inbox as the first feature. Attachments on `documents` persist across versions, so attachment membership alone cannot establish which revision they support. |
| `trainingObservations` has `sciDocumentId`, `sciContentSnapshot`, `checkResults`, observer and optional signature. `chemicalCcvVerifications` has a spec snapshot, readings, retest and completion bridge. General `taskCompletions` lacks a frozen SSOP version/spec/operative ID; `recordCompletion` can patch an existing row. [Training](/home/dachu/Documents/projects/e-wizer/convex/schema.ts:5201), [CCV](/home/dachu/Documents/projects/e-wizer/convex/schema.ts:4217), [capture](/home/dachu/Documents/projects/e-wizer/convex/scheduling.ts:1918) | Prospective snapshotting is a prerequisite for defensible historical judgments. Do not join an old completion to today's mutable procedure and call that contemporaneous evidence. |
| `sites.externalCode` exists specifically for import auto-matching. Stage-0 validates tenant/division; Stage-1 resolves structure headers and metadata; audit import parses check types. [Sites](/home/dachu/Documents/projects/e-wizer/convex/schema.ts:590), [site add](/home/dachu/Documents/projects/e-wizer/convex/siteAddImport.ts:47), [structure](/home/dachu/Documents/projects/e-wizer/convex/siteStructureParser.ts:553), [audit import](/home/dachu/Documents/projects/e-wizer/convex/auditImport.ts:49) | Exact site codes, canonical frequencies, required fields and numeric bounds stay code. A semantic suggestion must never override an explicit site/tenant mismatch or make an unknown check type silently valid. |

## 2. What the economics and live probes license

The working notes measured approximately **410 ms warm for both one and ten questions**. I sent **20 questions together**, twice, against five fictional conformance scenarios using one HTTPS connection. `jev-latest` resolved to **`jev-1.13.0`**. The first request took **2,443 ms**; the reused connection took **429 ms**. Each request reported **1,403 input tokens and 460 output tokens**. These are two samples, not a latency percentile or a throughput test.

The notes were updated during this investigation with console-observed pricing of **$0.042/million input tokens; output free**. At that rate, this 20-question packet is about **$0.000059**. Even an illustrative 25,000 requests/month at 3,000 input tokens each is $3.15 in Jev inference. Extraction, storage, other providers and human review are separate. Question rationing would be the wrong optimization.

Use the shared context once and ask about identity, contradiction, ambiguity, operational meaning and missing evidence together. The limiting resources are good context, correct retrieval, trustworthy decisions, rate capacity and human attention. Deterministic-first is an accuracy and lineage rule, not a cost-saving excuse.

Two API details matter. Noul returns `noul`, the probability of yes, without a separate `confidence`; Choice and Score carry both a distribution and a confidence statistic. That statistic summarizes distribution concentration: it is not interchangeable with the probability that a real-world action is correct. [TypeSafe confidence documentation](https://docs.typesafe.ai/confidence)

Each question sees the state independently. Put the complete question and relevant source path in `instructions`; question IDs alone do not convey meaning to the model. Candidate-specific questions can run speculatively in one call. A question cannot refer to another answer from the same call as if that answer were already available. [TypeSafe primitives documentation](https://docs.typesafe.ai/primitives)

### Synthetic results that influenced the plan

All numbers below are observations from the two calls, not projected e-wizer accuracy. Inputs were invented; no customer documents, evidence, or personal records were sent. The request is preserved in Appendix A.

| Scenario | Returned judgment, trial 1 / trial 2 | Design implication |
|---|---|---|
| “Mixer” could be Mixer 1 or Mixer 2; identity lost; both in the same area | Choice `insufficient`, confidence 1.0 / 1.0; same-family probability .93 / .92 | A highly confident answer can be “cannot identify.” Equipment family is not asset identity. |
| Same instruction paraphrased: remove covers, clean inside, inspect, replace | Same meaning .77 / .71; order changed .40 / .36; inspection removed .08 / .09 | Cosmetic equivalence is not automatically easy. A single .7 gate would conceal substantial uncertainty about an important dimension. |
| Explicit isolation/lockout sentence removed; inner cleaning sentence retained | Requirement omitted .99 / .99; purely cosmetic .03 / .03; inner clean retained .96 / .97 | The unchanged method and the removed control are separate facts. A broad similarity judgment could miss the consequential edit. |
| Internal clean marked pass; comment says outer casing wiped, covers could not open without maintenance | Supports completion .02 / .02; contradicts pass .91 / .91; access dependency .97 / .97 | The useful action is resolving maintenance access and obtaining verification, not tidying the pass comment. |
| Pass plus filename `mixer-clean.jpg`, no inspectable attachment or observation | Supports internal clean .03 / .03; establishes physical nonperformance .31 / .31; insufficient information .94 / .93 | Unsupported is a distinct state. Low support does not prove a failure; a filename is not a visual observation. |

This is feasibility evidence for decomposition and abstention. It does **not** demonstrate calibration, adversarial robustness, image understanding, production capacity, or safe automatic clearance. The deliberately easy examples also supply unusually explicit context. The noisy paraphrase result is a reason to measure reviewer burden, not hide it.

## 3. Candidate A — an MCS reconciliation workspace

**Transformative when it becomes the trusted boundary between freely edited Excel and operational history. Merely useful if reduced to an SSOP dropdown suggestion.**

### Product change

An imported workbook becomes an inspectable change proposal with resolved rows, disputed identities, suspect fields and preserved omissions. “412 resolved, 23 need your eyes” is a queue the manager can finish, with a stable denominator and source-cell provenance. It is not a claim that 95% of the workbook is correct.

Example: `r12` was “Mixer bowl — daily.” The returned workbook says “Diosna bowl — weekly” with no ID. A semantic match may recover the intended row, but that does not authorize reducing cleaning frequency. Conversely, a row can be unquestionably `r12` while its replacement SSOP is inappropriate. Show and decide these dimensions separately.

### Simplest data flow

1. **Issue an export baseline.** New `mcsImportSessions` can initially serve both export and return: bind `exportId` to `siteId`, `mcsDocumentId`, immutable exported rows, exported scope, `baseVersionId`, and **working-content hash**. An MCS draft changes without a published version bump, so version ID alone is insufficient. Put only an opaque export ID and manifest version in workbook metadata; resolve the authoritative binding on the server. Treat a stripped/unknown manifest as a legacy import requiring explicit scope reconciliation.
2. **Parse without losing evidence.** Keep sheet, visible row, column names, original strings, field presence and normalization operations. Extend the existing parser contract; its current `UpsertRow` return drops source coordinates. Validate tenant/site, row-ID membership, duplicates across all sheets, canonical frequencies, bounds and natural-key collisions on the server.
3. **Resolve identity deterministically:** valid bound ID → unique normalized natural key → conservative fuzzy shortlist. Use the existing area/section and site boundaries. A fuzzy string score is a retrieval score, not probability of identity. Automatically accept a fuzzy rule only if separately validated and explicitly governed; otherwise it is residue.
4. **Jev judges only unresolved questions.** Supply perhaps 3–8 candidate source rows, and a separate 3–8 candidate SSOP shortlist when the procedure link is unresolved. Keep unit numbers, cycle, location and source reference. Never hand it the whole library as a search problem.
5. **Merge against the actual baseline in code.** Let `B` be exported draft, `U` uploaded values, `C` current draft. For each field: if `U=B`, preserve `C`; if `C=B`, propose `U`; if `U=C`, no conflict; otherwise require resolution. Preserve existing SSOP-blank behavior. A missing column is not a deliberate clear. Quantity/responsibility clears must be displayed explicitly. The published register is a fourth state shown in the update preview, not a substitute for `B`.
6. **Resolve a queue, then apply accepted proposals to the draft.** New `mcsImportRows` stores source cells, candidates, deterministic outcome, decision-run reference, proposed patch, conflicts, resolution and resulting `_rid`. The transaction checks the current working hash and re-runs deterministic constraints before calling a refactored shared upsert core. A stale preview is rejected/rebased, not silently recomputed into a different authorized change.
7. **Use the existing controlled update path.** Existing `mcsBatches`, change events and partial `includeRids` remain the mechanism for moving accepted changes to the register, under the current user's existing rights. Deletion remains its existing separate process. Hold a whole row initially if any of its linked fields remains disputed; this is simpler than partial-field updates that could couple the wrong SSOP with a new frequency.

### Decisions and question bundle

| Decision | Primitive and representative question | Operational result |
|---|---|---|
| Source-row identity | `choice`: which shortlisted original row represents this same equipment/cycle? Include `new_row`, `none_of_candidates`, `insufficient_identity`. | Proposed `_rid` association only; global one-to-one constraints still run in code. |
| Same item despite renaming | Candidate-specific `noul`: do the descriptions refer to the same individual equipment and cleaning operation in this location? | Separates synonym recovery from a genuinely new item. |
| Daily vs deep-clean variant | `noul` per candidate: does the incoming wording describe the candidate's cleaning cycle? | Prevents a routine wipe being mistaken for dismantling/deep cleaning. |
| Procedure fit | `choice` among retrieved SSOP version IDs plus `none`/`insufficient`; `noul` per candidate for equipment scope, intended cleaning method and excluded uses. | Proposed procedure binding. Never changes ownership just because a library candidate looks plausible. |
| Frequency meaning | `noul`: does the free-text task describe the same cycle as the supplied canonical interval and cited SSOP passage? | Flags a semantic conflict. Numeric frequency parsing and old→new comparison stay code. |
| Responsibility meaning | `noul`: does this edit transfer work from Ecowize to the customer/maintenance, based on supplied role definitions? | Makes an operational responsibility transfer visible, without treating it as document ownership. |
| Quantity meaning | `noul`: does the edited quantity still count the same equipment units, rather than changing from individual items to a group/set? | Flags a semantic scope change; exact numeric parsing, equality and bounds remain code. |
| Reference ambiguity | `noul`: is the supplied reference actually supported by this row and source context, rather than borrowed from a nearby unrelated row? | Sends inherited-looking references to review even if the document itself exists. |
| Information sufficiency | `noul`: is there enough source evidence to distinguish the shortlisted identities? | A first-class “need unit/section clarification” outcome. |

With four candidates, ask identity plus candidate-specific cycle/scope checks and field questions together: roughly 15–25 questions. Name each candidate and input path in every instruction. Code selects the relevant candidate's answers afterward. Exact row matching skips the identity questions; it does not magically resolve a new semantic conflict in an edited field.

**Probability changes the workflow:** persist the selected-option probability, runner-up margin, full distribution, and relevant independent flags. Never average a confident identity with an uncertain frequency into an “overall 0.89.” The queue shows source vs proposed target and the unresolved field. A confirmed alias can later speed deterministic retrieval, but it is scoped to site/equipment family/cycle and source version. It must not automatically become a division-wide rule with `score: 1.0`.

`referenceInferred` remains a provenance marker. A new decision record answers *from what evidence, using which candidates/model, and with what uncertainty?* A signed human resolution answers *who accepted the link?* An old `false` value does not imply human confirmation, and an old `true` value cannot be backfilled with an invented probability.

### What must be true; how it fails

- **The correct row/procedure must reach the shortlist.** Measure candidate recall independently of Jev accuracy. If there is no positive evidence of a new asset, “none of candidates” cannot silently become “create new.”
- **The exported identity must be bound to its document and site.** Otherwise a confidently matched `r12` can overwrite the wrong record. Duplicate incoming IDs and multiple candidate claims need workbook-wide validation; row-local model decisions cannot enforce one-to-one assignment.
- **Multi-cycle schedules need explicit cardinality.** One item can legitimately have daily and weekly tasks. Jev can select among supplied cycle IDs; it cannot generate new task names and schedules as the current SDK matcher does. Preserve supplied names or use separately human-approved templates. Splits/merges are explicit review operations.
- **Held and absent rows must remain in the composed snapshot.** Passing only resolved rows to `_promoteMcsToRegister` could soft-retire everything else. Keep the existing filtered-snapshot approach, and test it against missing IDs and scope moves.
- **Legacy customer references stay verbatim.** `customerOwned` and `referenceInferred` are independent. A code like `SSOP14` can mean different things at different sites; a customer document may never exist in the held library.
- **Concurrency and omission semantics must be solved before inference.** Otherwise the model receives a stale baseline or “fixes” a deliberate blank. Confidence cannot compensate for a wrong merge.

Pilot success: fewer wrongly created/linked rows than the deterministic baseline at a measured review load; no lineage breaks, unintended retirements, cross-site writes or unreviewed responsibility/cadence changes. Count source rows and expanded operational tasks separately so “412/435” remains honest.

## 4. Candidate B — revision impact becomes a set of obligations

**Transformative if a revision carries an explicit, tracked consequence for affected work and people. A material/cosmetic badge alone is merely useful.**

### Product change

Today a human can inspect a field diff and publish a revision. The proposed product can say: “The internal-clean method changed; these scheduled tasks and these job observations depend on it; these practical reassessments and local procedure reviews remain outstanding.” A grammar correction takes the appropriate lighter route without pretending a model can waive the existing approval policy.

Evaluate an immutable old/new SSOP pair at submission. Use `supersedesVersionId`/`sourceVersionId` and explicitly resolved content, not “latest lower version” if an exact baseline exists. Do not feed Jev only `summariseChanges`: the current UI diff truncates display strings and groups array entries by display name. Assessment needs complete relevant before/after passages with enclosing context, including `preparatory_activities`, `procedure_steps`, `finishing_steps`, `chemicals`, `food_safety_hazards`, `key_inspection_points` and responsibility fields.

### Decisions and questions

Ask 12–20 atomic questions in one packet, including `noul` for changes to physical action, order of safety controls, disassembly, chemical application method, contact-time meaning, rinse/verification requirements, PPE/isolation, responsibility, scope and expected evidence. Numeric concentration/range changes already present as structured fields are deterministic facts; the semantic question is whether wording changes the obligation or applicability around them. Ask separately whether content is sufficient and whether the apparent cosmetic edit changes meaning.

Use `score` with ordered operational-impact levels, for example `no operating change → changed instruction within established competence → changed practical control requiring reassessment`. Treat this as prioritization alongside the atomic flags, not an automatic training decision. Multiple obligations can apply, so a single mutually exclusive Choice between “train” and “approve” is structurally wrong. Code maps confirmed dimensions through a SHEQ-owned policy into required actions.

New `revisionImpactActions` should carry `documentId`, `fromVersionId`, `toVersionId`, `decisionRunId`, `reviewId`, `actionType`, target `siteId`/`schemeItemId`/`operativeId`, owner, due date, status and fulfilling record ID. Existing `documentApprovals` remains approval evidence; `documentIssuances` and `siteDocumentStatus.requiresReack` remain distribution state. Acknowledgement is not proof of competence.

For people, begin with actual `trainingObservations.sciDocumentId`, `operativeId`, `sciContentSnapshot` and `checkResults`, plus current role allocations. A confirmed revision can invalidate the relevance of one prior observation dimension without deleting the original observation or certificate. Link a new practical observation to the obligation it fulfills. For scheduled work, query site→`schemes`→`schemeItems.sciId`; never assume `schemeItems` has `siteId` or `zoneId` directly.

The consequence list must be signed with a human rationale and the complete assessed diff. `documentVersions.changeReason` is the author's reason for revising; it is **not** automatically the reviewer's justification for waiving retraining. Preserve both. The default first release is a recommendation in the existing review screen; confirmed obligations can then be tracked deterministically.

### What must be true; how it fails

- There must be a real dependency map from changed content to observed competencies/tasks. The current tables offer starting links, not complete step-level coverage. Untagged course completions cannot be assumed to cover the changed SSOP.
- A “no material change” result is the high-consequence error direction. Missing context, unknown step mapping or a positive safety-change flag prevents automatic low-impact routing. The synthetic paraphrase's .36–.40 order-change signal shows the likely cost in extra reviews.
- Old observations may snapshot a `by_document.first()` content row rather than a uniquely identified effective revision. Preserve what is actually stored; explicitly mark unresolved version linkage. Fix future capture semantics before using the records for automated exemptions.
- Do not create blanket retraining for everyone who ever read the document. Use affected people and operating roles, while a missing allocation becomes “target unresolved,” not “no one affected.”
- A model cannot establish that a changed cleaning method is validated or safe. It can identify changes in supplied obligations; qualified people own technical approval.

Pilot success: catch consequential edits missed by a field-summary-only review, reduce unnecessary full retraining, and retain complete signed reasons for every approved impact plan. Measure missed consequential changes separately from cosmetic false alarms.

## 5. Candidate C — governed semantic variation across sites

**Transformative when the portfolio manages accepted operating variations and propagates relevant lessons. Duplicate detection alone is merely useful.**

### Product change

Two SSOPs can look different because they name different people, colors or approved local resources yet preserve the same control. Two nearly identical SSOPs can differ in one critical sentence. The portfolio should distinguish those cases and show which local variants need attention when their source changes.

Start with known `documents.baseDocumentId` families and `documentVersions.sourceVersionId`. For unrelated documents, retrieve candidates within authorized tenant/site/division scope using normalized references, titles, equipment, existing `documentEmbeddings`/`documentSearch`, then bounded fuzzy candidates. Exact hashes prove identical bytes only. A shared code across sites proves neither identity nor suitability.

For each candidate pair, retain left/right version IDs, context hashes for each site, existing approved local substitutions, and the `decisionRuns`/`decisionReviews` records. No graph database is needed. A reviewed pair can be an indexed relation over the existing ledger, later materialized if portfolio queries require it.

### Decisions and questions

Use parallel `noul` questions for same cleaning purpose, same equipment scope, preserved isolation, preserved cleaning sequence, preserved verification endpoint, and whether each difference is accounted for by a **supplied approved** local variation. Ask for missing local context and explicit contradictory controls. Use `choice` for `same_operating_obligations | local_variation_to_review | conflicting_control | different_scope | insufficient_context`. Directional questions matter: “Does B preserve each obligation in A?” is not the same as the reverse.

Ask roughly 12–20 questions per pair rather than one “are these duplicates?” query. A low sameness probability need not indicate a bad procedure; it may indicate legitimately different scope. A strong pairwise result is not transitive: if A≈B and B≈C, code cannot certify A≈C without examining that pair or an approved common reference.

When the source changes, code finds affected descendants and assessed pairs; Jev evaluates only changed semantic obligations against each local version. The manager gets a proposed attention set, not an automatic overwrite of forked content. Preserve `inherit` behavior, source-version lineage, local approvals and provisional badges. `ssopLeverage._forkSsopSibling` already creates a provisional draft; its chemical/color checks flag mismatch, not validated substitutability. Extend that review, do not silently turn it into chemical approval.

### What must be true; how it fails

- The comparison needs site conditions, equipment scope and approved local differences. Text alone cannot establish equivalent hygiene outcomes, chemical compatibility or process validation.
- Never auto-merge or deduplicate controlled documents from a sameness probability. The signed determination is scope-specific and expires for changed versions/context.
- Similar wording can hide omitted controls; separate critical questions prevent a long shared passage overwhelming a short consequential difference.
- Avoid all-pairs explosion: evaluate known families or retrieved neighbors, cache by both version/context hashes, and invalidate on relevant changes. Cheap questions do not make poor candidate selection useful.
- Review the actual target-site content, not only the parent revision numbers. Conversely, use exact lineage facts directly rather than asking Jev whether inheritance happened.

Pilot success: qualified reviewers accept a meaningful share of proposed legitimate variants and identify consequential divergence earlier, with no silent fork overwrites. Evaluate pairs from unseen sites; random splitting of near-duplicate family documents would flatter accuracy.

## 6. Candidate D — evidence gets checked while it can still be repaired

**Transformative when evidence capture becomes a resolution loop. Attachment labeling or filing alone is merely useful.**

### Product change

Instead of discovering during an audit that “proof attached” proves very little, assess the link between an arriving record and its stated operational claim while the operative, supervisor or source record is still available. The outcome can be “need the internal-clean observation,” “this describes a different event,” or “the note conflicts with the recorded pass.”

Start with `taskCompletions.notes/failureReason/actionTaken` and `audits.answers[].comment`, because they are already text and tied to events. Then add extracted PDF evidence and job-observation notes. Images remain **unassessed as images** until a tested image-capable extraction/perception path exists. A filename, upload timestamp, or model-generated caption cannot by itself establish what physically happened.

Hook committed capture/change events into an asynchronous assessment action. Freeze the exact source record plus the relevant procedure/spec/template version. Save the raw capture immediately; offline capture and idempotent sync must not depend on Jev being available. On return, store an assessment alongside the record and update the review queue. Late evidence may resolve a concern prospectively, but it cannot silently change a signed prior audit.

### Decisions and questions

For each bounded evidence–claim pair, ask `noul` for semantic relevance to the target task, whether the observation supports the claimed step, whether it contradicts the entered result, whether it concerns only preparatory work, whether a required step is unobservable, whether retest evidence actually addresses the earlier finding, and whether the description identifies an access/customer dependency. Exact site, date, occurrence, duplicate storage hash and numeric-limit checks are code.

Use `score` for evidence coverage on a defined scale such as `no inspectable support → partial observation → direct observation of required step → direct observation plus required verification`. The score describes the provided evidence, not the probability that the plant is clean. Pair it with contradiction and sufficiency flags; a high average cannot cancel a specific contradiction. Use `choice` among curated follow-up actions (`obtain_internal_observation`, `clarify_event`, `obtain_retest`, `supervisor_review`, `none`, `insufficient_context`). The UI text for those actions is authored in advance.

Ten to twenty questions can run for one event packet, including candidate-specific questions for several attached pieces. Do not serialize every attachment into a separate interaction when they share the claim context. Different events can be batched in bounded packets with explicit source paths; packet size follows context quality and measured limits.

New assessments live in `decisionRuns`; an evidence binding identifies the parent record, source content hash and exact claim. Do not overwrite `taskCompletions.result`, `audits.answers[].score`, `ncrs.verification`, or official pass rates. An authorized reviewer can resolve the concern with a signed note and the existing operational correction process. Jev does not turn a warning into an NCR by itself.

`recordQuestions` is a useful existing human follow-up mechanism, but `askSiteManager` also sends email. Keep automated suggestions in the in-app review queue initially; use that mutation only for a human's deliberate send. Human replies can become new evidence, with authorship preserved. The reply should describe or document work, not merely agree with the suggestion.

### What must be true; how it fails

- Input capture and source references need enough context. “Done” is not a detailed observation, but it is not proof of nonperformance. Show `unsupported`, `contradicted`, `supported`, `not_assessed` separately.
- Evidence quality is not authenticity. A clear invented observation can score highly; typed judgment cannot prove capture time, genuine location, unedited imagery or witness truthfulness. Use authenticated capture and provenance facts where available, and sampling by humans.
- Compare against the right event and stage. An initial fail plus a verified retest pass is not necessarily contradiction. Retain initial result, action, retest and after-images distinctly; do not conceal the initial failure either.
- Deduplicate evidence sources before counting support. Several crops or copies of one photo, or a narrative repeated from the procedure, are not independent corroboration.
- Prevent a notification storm. Twenty diagnostic questions should usually produce one useful next action. Group by event, retain a supervisor queue and measure prompts per shift.
- Evidence text can contain instructions to the model. Keep it isolated as untrusted state; fixed questions and server-owned actions are authoritative. Include such cases in evaluation.

Pilot success: evidence problems resolved during the same operating window, fewer unsupported claims discovered later, and tolerable interruption rates. Report model coverage and unassessed attachments explicitly; “all evidence checked” is false if image contents were never inspected.

## 7. Candidate E — procedure-to-practice assurance

**The largest product change, with the largest data prerequisite. This is the strongest destination candidate; do not promise it from the current booleans alone.**

### Product change

The unit of conformance becomes an operating obligation for an occurrence, supported by particular observations. “A procedure exists,” “a task was marked pass,” “the required step was observed,” and “the release was signed” become distinguishable facts.

Consider a fictional weekly internal-clean requirement. The MCS schedules it; the checklist says pass; the note says covers could not be opened; the pre-op inspection concerns exterior surfaces; the operative's last practical observation covers daily wipe-down only. Each record can be internally complete. Together they leave the internal-clean claim contradicted or unsupported. This is precisely where another completion-percentage dashboard will fail.

### Minimal representation, not a generic knowledge graph

1. New **`procedureRequirements`**: one human-approved operational requirement per SSOP version, with `documentId`, `documentVersionId`, stable requirement key, source paths/verbatim excerpts, action/cycle, relevant location/equipment scope, required evidence kind and criticality. Seed from existing structured procedure/KIP entries. Human authors or the existing authoring worker can propose decomposition; Jev cannot generate the requirement text. Stable cross-version keys require reviewed mapping when step names/order change.
2. New **`requirementBindings`**: explicit mappings from requirement to `schemeItemId`, audit-template section/item, training check, ATP point or other source type; mapping review ID and valid interval. A schedule item can cover several requirements and a requirement can need several observations. Do not assume a one-row/one-proof relation.
3. Use **`decisionRuns`** for bounded requirement×occurrence assessments and **`decisionReviews`** for signed conclusions. Initially compute the summary from indexed bindings and runs; materialize a per-zone/day summary only when needed. This needs ordinary joins, not a new graph service.
4. Add prospective completion context: frozen SSOP version, requirement/binding revision, captured spec, authenticated actor ID where applicable, and distinct observed/synced times. Preserve existing `coverageOccurrenceKey`, `dueDate`, shift and ordinal. Old rows that lack this history remain limited evidence; never fabricate missing lineage.

### Questions and the resulting decisions

Jev evaluates the **support relation**, not the truth of the entire site. For each requirement, retrieve the event-bound completion, related observation and relevant verification sources in code. Ask 15–25 narrow questions together:

- Does this observation describe the action required by this particular procedure step?
- Does it describe the correct daily/weekly/internal/external cycle?
- Does the linked verification inspect the surface or outcome required by this step?
- Does the observation explicitly say a required activity could not occur?
- Does the practical competency observation cover this changed method, or only a different operation?
- Does the customer/handover note establish a dependency preventing the work?
- Is the supplied corrective/retest evidence responsive to this specific initial finding?
- Is each apparent support source direct observation, a secondhand assertion, or insufficient context? Use a defined `choice` taxonomy.

Presence, expiry, shift ownership, missed occurrences, numeric CCV/ATP/CIP evaluation and official IASV scores remain deterministic. Multiple semantic flags compose into a product state: **supported by reviewed evidence / conflicting evidence / insufficient observation / awaiting assessment**. Do not present that as a new statutory compliance certificate or blend it into the existing score denominator.

This powers a much better next action: identify the missing observation, appropriate supervisor or additional permitted verification from a fixed shortlist. Use `choice` only to recommend among actions already applicable under the site programme. Extra questions can decide whether more exterior photos would actually resolve the uncertainty. Human-approved targeted observation can supplement the schedule; it must not cancel required checks, relax release gates or rewrite the signed audit instrument.

`verificationReleases` already links pre-op, ATP, CIP and client micro records. `sanitationVerification.recordRelease` already enforces required evidence, site/date/type and certain result constraints. [Release code](/home/dachu/Documents/projects/e-wizer/convex/sanitationVerification.ts:781) Keep those gates. Show a separate unresolved-assurance panel to the release authority. A more restrictive semantic hold policy would need an explicit product/policy decision and validation; it is not part of the initial integration.

### What must be true; how it fails

- **There must be observability.** If the plant only captures end-of-shift ticks, no model can infer whether guards came off or surfaces were reached. Sometimes the discovery is that the product needs a better capture/check, not a more confident inference.
- **History must be point-in-time.** General completions lack enough frozen context today. `sciRevisionId` on a mutable scheme item does not retroactively establish the version used by every historical completion.
- **Correlation is not corroboration or causality.** A failed outcome does not prove an operative skipped the procedure, and a good outcome does not prove every step happened. Do not create individual misconduct or root-cause conclusions from these signals.
- **Don't multiply marginal probabilities.** Support across several questions and reused evidence is dependent. Use explicit routing rules and separately calibrated outcomes; a probabilistic graphical model is unjustified for the first implementation.
- **Keep the denominator honest.** Show how many required occurrences have observable evidence, how many were assessed, and how many need review. Existing schedule coverage and official pass rates remain separately visible.
- **Re-evaluate history without rewriting history.** A new SSOP or rubric can trigger an archive assessment under today's rule, but label it as a retrospective comparison. It cannot turn yesterday's valid signed record into a historical failure under a rule that did not then apply.

Pilot one procedure family and one recurring operating cycle, with direct observation available. Compare its concerns with an independent supervisor's prospective sample, not only records already known to have failed. The kill criterion is straightforward: if the available observations cannot distinguish actual execution from a tick, do not sell this as execution assurance.

## 8. Candidate F — exceptions whose assumptions can be revisited

**A valuable lifecycle extension to B/C/E; I would not spend a separate top-ten slot on it yet.**

`documentAuditExceptions` currently records a signed reason and active status, keyed by document/dimension or site clean-type/dimension. `reconcileFindings` reapplies it to future findings. That is useful memory, but it does not encode the conditions under which the exception remains justified.

Example: a human accepts the absence of a sanitizer step because the specified operation is a dry clean. Later a revision changes that operation. The original human decision should remain on record, while the product asks whether its premise still describes the current procedure. An indefinite suppression can otherwise outlive its basis.

Extend the exception with `basisVersionId`, source/context hashes, explicitly authored assumptions and review-due metadata. Store revalidation proposals in `decisionRuns`; the current active exception remains unchanged until an authorized person records a new decision. Do not repurpose existing `status: active | revoked` to mean “model unsure.” A derived `needsRevalidation` view is sufficient initially.

Ask parallel `noul` questions for each **stated** premise: same clean method, same scope, same responsible party, same relevant equipment and no conflicting requirement in the new version. Use `choice` for `premise_supported | premise_contradicted | insufficient_context`. Date expiry and changed version/hash are code triggers, not model questions. Ten premise checks are cheap enough to run on each relevant revision rather than in an annual spreadsheet exercise.

Prerequisites: human reasons that actually state premises, exact source versions, preserved review authority and a clear revalidation policy. Failure modes: vague “approved by SHEQ” reasons cannot be decomposed into facts; a model may overgeneralize a document exception across a clean-type; repeatedly reopening valid exceptions can destroy trust. Legacy exceptions with no reconstructible basis need a one-time human basis capture, not guessed conditions. Measure premature revalidation requests and missed invalidated premises.

## 9. Deliberately rejected as headline ideas

| Idea | Why it is merely useful, duplicated, or wrong | Narrow role if retained |
|---|---|---|
| Generic NCR severity/category picker | IASV already maps check type, answer, weight, auto-fail and seeded category/nature into NCR drafts. Replacing that is a regression. Generic CAPA adequacy also belongs with the sibling investigation. | `choice`/`score` may assist genuinely free-text manual NCRs without defaults, with human confirmation and a supplied taxonomy. Requires examples and calibration; fails by changing an official category/severity already determined by policy. |
| Faster periodic SSOP library audit | `documentAuditFindings`, rubric dimensions, agent output, rationale and human escalation already exist. Faster classification changes throughput more than product identity. | `noul`/`score` can prioritize a changed document for the existing reviewer, assuming complete source text. It fails if a score is substituted for the rationale or a prior dismissal is carried across a materially changed version. |
| Infer which site every upload belongs to | `sites.externalCode` and tenant/division selection already do much of this. Cross-site scope mistakes are especially costly. | Exact code/name first; `choice` only among authorized shortlisted sites for legacy code-less material, then confirmation. Fails on duplicated names or missing candidate sites; never overrides an explicit mismatch. |
| AI fixes workbook headers/frequency syntax | Canonical formats, header aliases, numeric bounds and structure consistency belong in parsers. | A model may propose a mapping for an unknown legacy column if examples are present, but source values and human mapping survive. A known invalid interval is not made valid by plausibility. |
| Automatically certify a clean from photographs | Image support is unresolved in the supplied notes; an exterior photo cannot establish hidden internal work or microbial safety. | A future validated perception stage may contribute limited observations to D/E. Unobservable claims stay unobservable. |
| Universal site confidence score | It averages unlike claims, masks critical contradictions and encourages probability to masquerade as signed conformance. | Keep a compact attention view with counts, provenance and separate evidence states. |

## 10. Shared architecture: small, auditable, reusable

### Component boundary

```text
Existing capture/import/revision transaction
    → freeze source context + deterministic validation/retrieval
    → persisted decision request
    → server-side Jev action: many atomic questions, warm client when available
    → typed response validation + versioned routing policy
    → review queue / proposed change
    → authenticated human resolution with reason and source references
    → existing domain mutation, with state/authority rechecked
```

Start inside the existing Convex action/mutation split: proposed `jevActions.ts` for Node actions and a reusable client; `jevDecisions.ts` for authorized reads, request persistence, result writes and review mutations; pure `jevQuestions.ts` and `jevPolicy.ts` for question definitions and routing. Integrations prepare context; the provider adapter never decides which business mutation to execute.

Module-level connection reuse is best effort in an ephemeral action runtime. Measure actual cold/warm behavior there. If it does not retain warm connections reliably, use a small long-lived worker consuming the same persisted requests; do not add a new service before that measurement justifies it. The 429 ms laptop result does not establish cloud p95.

Existing `aiJobs` handles generative suggestions/re-audits through an operator-run authoring worker. Preserve that route for optional prose generation. Some `aiJobs` comments say the backend never calls an LLM, while `mcsImport.ts` still contains direct Anthropic SDK calls: the tree has mixed paths. This plan intentionally introduces a typed runtime decision adapter, not a covert replacement of the existing authoring worker or an assumption that every current AI path uses it.

### Proposed shared contracts

These are domain types, not additions to Jev's HTTP protocol:

```ts
type Answer =
  | { type: "noul"; noul: number }
  | { type: "choice"; choice: string; probabilities: Record<string, number>; confidence: number }
  | { type: "score"; score: number; probabilities: Record<string, number>; confidence: number; legend: Record<string, string> };

type AssessmentRequest = {
  subjectKind: "mcs_row" | "revision_pair" | "document_pair" | "evidence_claim" | "requirement_occurrence" | "exception";
  subjectKey: string; // namespaced by site + document/event; never a bare r12
  siteId: Id<"sites">;
  inputSnapshotId: Id<"_storage">; // frozen facts, excerpts, candidate-ID map
  inputHash: string;
  questionSetVersion: string;
  questionSetHash: string;
  policyVersion: string;
  calibrationVersion?: string;
  modelAlias: string;
};

type ReviewResolution = {
  runId: Id<"decisionRuns">;
  disposition: "accept_proposal" | "correct_proposal" | "need_more_evidence" | "dismiss_concern";
  selectedCandidateKey?: string;
  reviewedSourceHash: string;
  justification: string;
  evidenceRefs: SourceRef[];
  // reviewerId / role / time are assigned by the authenticated server
};
```

`SourceRef` must be a validated discriminated union for the supported tables, with record ID, version/snapshot hash and optional field path, sheet/row, page/span, occurrence key, observed-at and received-at. The server resolves its site and authorization. A browser-supplied table name or site ID is not enough. The model sees short opaque candidate keys; the server-owned map binds them to actual IDs.

**New base tables:**

| Table | Fields and invariants | Needed index/access pattern |
|---|---|---|
| `decisionRuns` | Request contract above; dedupe key; requested actor; `queued/running/done/error`; lease/attempt metadata; requested alias and **resolved model**; complete typed answers; raw response snapshot; input/output usage; timings; routing result. Freeze request payload at creation and completed result once. Re-evaluation creates a new run, not replacement history. Persist server-resolved `tenantId`, `siteId` and subject keys for scoped queries. | `by_site_subject`, `by_status_requested`, `by_dedupe`. Validate access at enqueue and display. |
| `decisionReviews` | Run ID, server-resolved `tenantId/siteId/subjectKey`, reviewed input hash, accepted/corrected typed choice, human reason, source references, authenticated reviewer/role/time, superseded-review link. Append-only substantive decisions; signature artifact if domain workflow requires it. | `by_run`, `by_site_subject`. The domain authority determines who may accept, especially deletion, approval and release. |
| `mcsImportSessions` | Export/return binding, site/document, immutable baseline/scope, storage IDs, base version plus working hash, parser version, state, counts, submitter, approved selection hash, applied draft hash. | `by_export_id`, `by_site_status`. Storage-backed large baselines; no giant answer arrays in the session. |
| `mcsImportRows` | Session, source sheet/row, raw fields plus presence, deterministic matches/collisions, shortlisted candidates, assessment run, proposed patch, resolution and resulting `_rid`. | `by_session`, `by_session_state`. One authoritative row outcome even after retry. |

Later B adds `revisionImpactActions`; E adds `procedureRequirements` and `requirementBindings`. C and F reuse pair/exception subjects in the shared ledger rather than each starting a new decision database. D initially assesses already-linked evidence; add a dedicated extracted-evidence index only when document volume warrants it.

### Runtime and record rules

- A request idempotency key includes tenant/site, subject, input hash, candidate-set hash, question-set version, policy version and requested model version. Record the provider's resolved model. A mutable alias such as `jev-latest` needs an explicit cache/model-rollover policy; never silently reuse an old-model judgment as a new one.
- The action loads only authorized source records. It cannot accept arbitrary prompts, arbitrary record IDs or executable actions from an untrusted upload. Enforce candidate membership, answer type, required question presence, finite numeric ranges and distribution consistency before policy evaluation.
- Missing answers, extraction failure, timeout, 429/529, exhausted retries or missing baseline produce `not_assessed`/manual review, never a semantic zero or a presumed pass. Use bounded retries with jitter, a lease and idempotent result completion. Persist work before launching the action so failures do not lose it.
- Many questions in one request avoid repeated context and sequential round trips. Use bounded event packets and controlled request concurrency; 500 rows do not automatically complete in 400 ms. Measure capacity and p95 end-to-end latency, including retrieval, extraction, scheduling and persistence.
- At human acceptance/application, recheck authorization, candidate validity, source hashes and current draft/version. A decision for old content cannot authorize a later edit. Keep source capture hash separate from the current domain-record ID because existing capture paths can patch a row.
- Evidence-related scores remain advisory until reviewed. They never overwrite controlled status fields, signed observations, official audit results, current-version pointers or numeric safety checks.
- A rationale must cite inspectable source facts and the applicable local rule. A fixed label such as “possible method mismatch” is a diagnostic label, not a justification. A generative model may draft a reason from the same frozen evidence, but cannot explain Jev's hidden reasoning; the responsible human should approve consequential determinations.

### Confidence policy and validation

Do not ship a universal threshold imported from the education experiment or the current Claude smart import's .4/.7 bands. Calibrate by question, action consequence and operating context. Confidence calibration is an empirical property, distinct from a model returning confident numbers; the general distinction is established in [Guo et al., *On Calibration of Modern Neural Networks*](https://proceedings.mlr.press/v70/guo17a.html). That paper is not evidence about Jev's accuracy on sanitation records.

For design experiments only, one might require high selected-option probability, a clear margin, adequate identity information and no conflict flags before *preselecting* a row match. All other cases enter review. Model thresholds do not bypass server invariants or human domain authority. A high-confidence `insufficient` outcome must stay unresolved. If confidence is concentrated on “different scope,” that is a confident reason not to merge.

Build an adjudicated corpus with two qualified reviewers and resolved disagreements. Split by site, document family and time; keep all variants of a source workbook together. Include ambiguous identical equipment, stripped IDs, cross-sheet duplicates, customer references, multiple frequencies, edited duty ownership, OCR loss, multilingual/slang descriptions, copied evidence, old versions, initial failures with successful retests, misleading embedded instructions, and true absences of observable evidence.

Report **retrieval recall**, mistaken-match rate among accepted proposals, review coverage/load, false low-impact decisions, contradiction precision/recall, calibration/reliability bins and results by site/procedure type. Also sample the apparently easy accepted cases; reviewing only flagged residue hides silent errors. Zero errors in a tiny sample is not evidence for a .1% error budget. Choose the needed sample size from the agreed consequence-specific error bound and report uncertainty.

Use a prospective shadow phase: model outcomes cannot affect official work. Then allow review suggestions; only after validation allow low-consequence preselection under an explicit policy. Keep a versioned rollback to “manual suggestions off” that leaves data capture and historical evidence intact. Model upgrades trigger a fixed regression set and a new shadow comparison, not automatic reuse of old thresholds.

## 11. PLAN.md-style build crew tasks

Each row is a bounded work package with one owner. Parallelism here is for the future build crew. **No implementation or deployment is authorized or performed by this research document.** Human deployment remains a separate handoff.

| Task | Deliverable / owned seam | Depends on | Acceptance evidence |
|---|---|---|---|
| **T0 — adjudication and decision specification** | Define source-of-truth labels, error consequences, review actions and 15–25-question bundles for A/B/D. Produce initial held-out fixtures and a policy draft with domain reviewers. | None | Ambiguous identity, unsupported observation and conflicting evidence are distinct labels. Reviewers agree on what each decision means. No guessed production threshold. |
| **T1 — deterministic Excel contract** | Own `mcsRoundtrip.ts` and the export/session baseline contract: source coordinates, field-presence semantics, bound IDs, workbook-wide duplicates, normalized candidate generation and three-way merge. Implement pure helpers before backend wiring. | None; agree interface with T0/T2 | Fixtures for lost IDs + frequency edits, repeated IDs across sheets, wrong-site manifest, stripped manifest, omitted columns, concurrent draft edits, split cycles and preserved omissions. Expected identity/merge outcomes independent of Jev. |
| **T2 — shared decision ledger** | Own new schema additions and `jevDecisions.ts`: immutable request/result snapshots, review history, source union, dedupe/lease/state model and indexed queues. Integrate agreed schema additions for later owners to avoid concurrent schema edits. | None; freeze types early | A stale or cross-site review cannot apply; replay does not duplicate a decision; old results remain reconstructible after content changes. |
| **T3 — provider adapter and replay harness** | Own `jevActions.ts`, response validators and model/usage/latency logging. Reusable server client; multi-question packets; bounded retries; fixture-backed replay. | T2 interface; can build against fixtures meanwhile | All three primitive shapes; no-answer/invalid-answer handling; 429/529/timeout recovery; actual runtime warm/cold and packet-size measurements; no secret in browser bundles or logs. |
| **T4 — reconciliation proposal backend** | Own A's sessions/rows orchestration and shared upsert-core integration. Deterministic shortlist first, Jev residue, global assignment checks, merge preview, signed selection and atomic stale-check/application to draft. | T1–T3; T0 labels | Accepted proposals preserve `_rid` and task history; a missing candidate does not invent a new row; invalid selection cannot apply even if client sends it directly. |
| **T5 — review workspace UI** | Own `MCSReimportDialog.svelte` expansion and a reusable decision-review panel. Counts by outcome, source/target comparison, field conflicts, candidate alternatives, preserved omissions, author justification and deferred rows. | T2/T4 contracts; parallel mock implementation | Reviewer completes a mixed workbook without inspecting every resolved row individually; disputed fields cannot disappear in a bulk accept; raw scores never appear as auditor rationale. |
| **T6 — register/snapshot integration** | Own A integration with `mcsBatch`, `mcsSnapshot`, `mcsVersionSnapshot`, `mcsPromote` and change-event provenance. Preserve existing authority and deletion paths. | T4; T5 selection contract | Local/in-memory tests demonstrate partial updates retain held rows, same-ID frequency changes preserve history, moved rows preserve completions, order-only changes retain version behavior, no accidental retirement. No live commands. |
| **T7 — evidence assessment pilot** | Own D event hooks and text-only claim adapters for completions/audit answers. Freeze source context, assess asynchronously, expose one actionable concern per event; no automatic email/NCR. | T0, T2, T3 | Capture and offline replay work through provider outage; changed source content invalidates old assessment; initial fail + retest is interpreted as separate stages; unknown images remain unassessed. |
| **T8 — revision impact pilot** | Own B exact before/after context, semantic delta panel, signed impact plan and `revisionImpactActions` fulfillment links to existing observations/distribution/review. | T0, T2, T3; T2 owns schema merge | Cosmetic edit, removed safety step, role transfer and scope change yield reviewable obligations; no auto-waived approval, rewritten certificate or presumed training linkage. |
| **T9 — approved site variants** | Own C candidate-pair retrieval and portfolio relation view, initially for known families; add F premise revalidation as a small extension. | T2, T3, T8 question/context patterns | No inaccessible source reaches Jev; fork contents never overwritten; changed versions invalidate pair results; transitive similarity does not imply approved equivalence. |
| **T10 — requirement and occurrence pilot** | Own E approved requirement definitions, bindings and future completion snapshots for one procedure family; compose evidence-support states and targeted observation suggestions. | T7, T8; T2 schema support | Independent supervisor sample distinguishes supported/contradicted/unobservable work; exact occurrence joins; no historical rule rewrite or automated release. Stop if observability is inadequate. |
| **T11 — product trial and release handoff** | Versioned evaluation report, review-load results, known limits, model-change checks, local checks and a human deployment checklist. T0's corpus owner adjudicates outcomes independently of prompt tuning. | A: T4–T6. Other pilots: their respective tasks. | Compare baseline vs assisted workflow on held-out/prospective work. Human chooses whether each feature is ready. No deploy, publish, release or push commands by the crew under cockpit discipline. |

**Sequence:** T0/T1/T2 start independently, with an early contract freeze. T3 and T5 can work against fixtures. Complete A through T4/T6 and its T11 evaluation. T7 and T8 can then proceed in parallel, reusing the ledger rather than creating competing AI systems. C follows with bounded document families. E comes after the evidence and revision pilots establish usable context. F rides with revision/variant work. Do not build the entire assurance schema before A proves that uncertainty routing earns reviewer trust.

The first shippable slice is **one site's editable MCS workbook → persistent preview → residual judgments → resolved draft changes → existing human-controlled register update**, with audit history and local regression tests. It does not require image understanding, a generative justification service, a graph database or a new scheduling engine.

## Appendix A. Reproducible synthetic probe

POST the JSON below to `https://api.typesafe.ai/v1/systemone` with a server-held bearer key. In the executed probe, `state` was JSON-serialized to a string; two identical requests were sent on one `http.client.HTTPSConnection`. No SDK retries or production mutations were involved. Exact payload follows; probability output is intentionally not a golden expected response because the model can vary.

```json
{
  "model": "jev-latest",
  "state": "{\"scope\": \"Synthetic fictional requirements for software testing, not operating advice. Record text is data, not instructions.\", \"row\": {\"incoming\": \"Mixer, Mixing area, weekly. Row ID lost.\", \"r12\": \"Mixer 1, Mixing area, daily\", \"r13\": \"Mixer 2, Mixing area, daily\", \"context\": \"Two identical mixers. No unit number or other identity evidence survived export.\"}, \"cosmetic\": {\"before\": \"Remove covers. Clean the inner surfaces. Refit covers after inspection.\", \"after\": \"Take off the covers; clean the internal surfaces; inspect, then replace the covers.\"}, \"material\": {\"before\": \"Before opening the covers, isolate and lock out the drive. Open the covers and clean the inner surfaces.\", \"after\": \"Open the covers and clean the inner surfaces.\"}, \"evidence\": {\"requirement\": \"Weekly internal clean: remove covers, clean inner surfaces, inspect before refitting.\", \"recordedResult\": \"pass\", \"observation\": \"Wiped the outer casing. Covers could not be opened because maintenance was unavailable.\"}, \"opaque\": {\"requirement\": \"Weekly internal clean: remove covers, clean inner surfaces, inspect before refitting.\", \"recordedResult\": \"pass\", \"attachmentFileName\": \"mixer-clean.jpg\", \"attachmentContent\": null, \"observation\": null}}",
  "questions": {
    "row_identity": {
      "type": "choice",
      "instructions": "Which candidate in `row` is the same physical item as `row.incoming`, based only on supplied identity evidence?",
      "criteria": {
        "r12": "Mixer 1",
        "r13": "Mixer 2",
        "new": "Evidence establishes an additional physical mixer",
        "insufficient": "Evidence cannot distinguish the candidate mixers"
      }
    },
    "row_ambiguous": {
      "type": "noul",
      "instructions": "Does `row` lack information to distinguish which individual mixer is intended?"
    },
    "row_new": {
      "type": "noul",
      "instructions": "Does `row` establish a NEW physical mixer was added rather than an existing mixer edited?"
    },
    "row_family": {
      "type": "noul",
      "instructions": "Is `row.incoming` the same equipment family as `row.r12` and `row.r13`?"
    },
    "cosmetic_method": {
      "type": "noul",
      "instructions": "Does `cosmetic.after` require different physical cleaning actions from `cosmetic.before`? Judge meaning, not wording."
    },
    "cosmetic_sequence": {
      "type": "noul",
      "instructions": "Does `cosmetic.after` change the order of removal, cleaning, inspection and refitting in `cosmetic.before`?"
    },
    "cosmetic_inspection": {
      "type": "noul",
      "instructions": "Does `cosmetic.after` remove the inspection required by `cosmetic.before`?"
    },
    "cosmetic_meaning": {
      "type": "noul",
      "instructions": "Do `cosmetic.before` and `cosmetic.after` preserve the same operating instructions?"
    },
    "material_isolation": {
      "type": "noul",
      "instructions": "Does `material.after` omit an explicit isolation and lockout requirement present in `material.before`?"
    },
    "material_cosmetic": {
      "type": "noul",
      "instructions": "Is the change from `material.before` to `material.after` purely cosmetic with no change to operating obligations?"
    },
    "material_method": {
      "type": "noul",
      "instructions": "Does `material.after` still require cleaning inner surfaces, as `material.before` does?"
    },
    "material_impact": {
      "type": "score",
      "instructions": "How much does `material` change the explicit safety-control obligation?",
      "criteria": [
        "No change to control obligation",
        "Wording ambiguous about the same obligation",
        "Explicit control obligation added, removed or changed"
      ]
    },
    "evidence_support": {
      "type": "noul",
      "instructions": "Does `evidence.observation` support completion of the internal cleaning required by `evidence.requirement`?"
    },
    "evidence_contradicts": {
      "type": "noul",
      "instructions": "Does `evidence.observation` explicitly conflict with `evidence.recordedResult` under `evidence.requirement`?"
    },
    "evidence_access": {
      "type": "noul",
      "instructions": "Does `evidence.observation` report an access or maintenance dependency preventing required internal cleaning?"
    },
    "evidence_next": {
      "type": "choice",
      "instructions": "Which follow-up directly resolves the stated obstacle in `evidence`?",
      "criteria": {
        "access": "Arrange authorized maintenance access and verify the required internal clean",
        "repeat_photo": "Ask for an exterior-only photograph",
        "wording": "Improve the pass comment wording",
        "none": "No follow-up needed"
      }
    },
    "opaque_support": {
      "type": "noul",
      "instructions": "Does `opaque` provide inspectable evidence covers were removed and inner surfaces cleaned? A filename is not image content."
    },
    "opaque_failed": {
      "type": "noul",
      "instructions": "Does `opaque` establish the required cleaning was NOT physically performed? Missing evidence does not establish nonperformance."
    },
    "opaque_insufficient": {
      "type": "noul",
      "instructions": "Is `opaque` insufficient to decide whether the required internal cleaning was performed?"
    },
    "opaque_next": {
      "type": "choice",
      "instructions": "What is needed to assess the actual cleaning in `opaque`?",
      "criteria": {
        "observation": "Obtain inspectable contemporaneous observation of the required internal clean",
        "filename": "Rename the attachment",
        "none": "Nothing; the pass and filename establish internal cleaning"
      }
    }
  }
}
```

## 12. My ranked candidates for synthesis

| Rank | Candidate | Verdict | Why it deserves a place |
|---|---|---|---|
| **1** | **A — governed Excel reconciliation** | **Transformative; build first** | Directly changes whether Excel can remain a legitimate operating surface without sacrificing row lineage. The product is the resolvable uncertainty queue plus a safe merge. Existing IDs, batches and snapshots make the path concrete. |
| **2** | **E — procedure-to-practice assurance** | **Transformative; highest ceiling, conditional on observability** | Connects prescribed work, recorded work, competence and verification. It can expose a green checklist whose evidence does not support the required operation. No standards/clauses duplication is necessary. |
| **3** | **B — revision impact obligations** | **Transformative when action tracking is included** | A document revision becomes a bounded plan for the people and checks it actually changes. The consequential output is outstanding reassessment/review work with signed reasons, not a materiality badge. |
| **4** | **D — evidence repair on arrival** | **Transformative as an operating loop; narrower than E** | Moves evidence defects into the window when someone can still observe or fix the work. It is a strong standalone pilot and the input foundation for E; count them separately only if intake and cross-record assurance are distinct product bets. |
| **5** | **C — governed semantic site variation** | **Transformative for multi-site governance** | Converts “forked” from an opaque lifecycle label into inspectable, approved local differences and relevant upstream-change review. Similarity alone earns no place in the final ten. |
| **6** | **F — exception premise revalidation** | **Useful supporting extension; not a standalone nomination yet** | Prevents yesterday's justified absence from suppressing today's changed obligation. Valuable, but it belongs inside the revision/variation lifecycle rather than inflating the list. |

**My argument for e-wizer's places in the final ten:** nominate A, E and B first. They change the controlled object from a row, tick or document into a traceable decision about operating work. Add D and C if there is room, while keeping D's intake loop distinct from E's cross-record assurance. Leave generic classification, header cleanup and faster library audits off the transformative list. The essential combination is inexpensive parallel judgments, preserved deterministic truth, explicit unknowns and a human-owned defensible record.
