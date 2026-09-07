# Remedial Action — build wave 1 handoff

Built on Machine B, 2026-09-06. Status: **INTERNAL PREVIEW shell; final rendering and inventory publication refused**. No narration/audio generated, full video rendered, app/backend data mutated, deployment, commit or push performed. No project source, tests or directories deleted. Existing unrelated dirty work was preserved by comparing the pre-build SHA-256 snapshot with the resulting files.

The missing approved storyboard was recovered only after `git show 81986c80f25f59b05a8421a6811e3cd5bbfbe091:remotion-branding/docs/remedial-action-audit-trail-storyboard.md` returned bytes with SHA-256 `d0d4490b7a571b99874867702266eb3e3d7f3bfa35b223f032df87f8a2a900ff`. Exactly that file was materialized; no branch change, cherry-pick or merge. Its byte-identical public provenance snapshot carries the same hash.

## Source architecture and changed files

Paths below are relative to `remotion-branding/` unless stated otherwise.

| File | Responsibility / change |
| --- | --- |
| `docs/remedial-action-audit-trail-storyboard.md` | Exact restored approved blob; no editorial change. |
| `src/index-remedial.ts` | Isolated `registerRoot(RootRemedial)` entry. |
| `src/remedial/RootRemedial.tsx` | Registers `RemedialActionTutorial-INTERNAL-PREVIEW` and guarded `RemedialActionTutorial`; metadata validates preview assets and rejects final rendering. |
| `src/remedial/RemedialActionTutorial.tsx` | Series bookends, Barlow Condensed/DM Sans, navy/cyan/green palette, genuine full phone images and enlarged source details, external development blockers, explanatory origin/age diagrams, persistent silent-preview banner. |
| `src/remedial/captures.json` | Asset manifest, exact per-file provenance, crops, observations, chronology, two separate remedial trails and required missing view slots. |
| `src/remedial/contract.ts` | Shared browser/Node schema, immutable source/copy hashes, independent evidence requirements, site guards, duration/cue checks and final refusal. |
| `src/remedial/narration.json` | Source-checked proposed narration, absolute beat/cue starts and provisional voice intervals; audio and measured transcript explicitly null. |
| `src/remedial/source-audit.json` | 17 exact mobile/backend file hashes, 19 claim boundaries, source discrepancies and read-only capture feasibility status. |
| `tsconfig-remedial.json` | Isolated TypeScript check; does not import the dirty shared Root. |
| `tools/verify-remedial.cjs` | Positive/negative validation; final/inventory preflight refusal; optional browser proof and silent preview excerpt. |
| `package.json` | Keeps five Remedial-only scripts and adds `@remotion/media: ^4.0.484`; restores the pre-wave `remotion` and `@remotion/cli` ranges to `^4.0.364` after review. Installed Remotion packages remain at 4.0.484. |
| `package-lock.json` (git-ignored) | npm install updated the ignored lock and node_modules in this worktree; the lock now records the restored dependency ranges. |
| `docs/remedial-action-build-wave-1.md` | This handoff, evidence register and bounded capture plan. |
| `public/remedial-tutorial/cleaning/` | Twelve exact PNG copies enumerated below. |
| `public/remedial-tutorial/provenance/` | Three exact document/manifest snapshots enumerated below. |

`npm install` ran in `/home/durai/Documents/projects/content-engine/remotion-branding` during wave 1. It added `@remotion/media` and updated the ignored `package-lock.json` and `node_modules`. The accidental exact Remotion/CLI pins were outside the requested scope and were restored to their pre-wave `^4.0.364` ranges after Claude's review; media uses `^4.0.484`, matching the repository's caret-range convention and installed 4.0.484. No other shared dependencies changed in this review fix. The existing React, React DOM, React types and TypeScript declarations also remain unchanged from before wave 1.

Unmodified shared dependencies: `src/brand/EcowizeBookends.tsx` (SHA-256 `1f8ee174ed86e6b509ccc86d876668d4ef7cfc8b387b2e3ca999295920981b6c`), the existing kit font type, and five hashed public brand/font assets. No shared Root, Cleaning composition, inventory, `review-*`, mobile source or Cleaning worktree file was edited.

`staticFile()` resolves every public asset. Images use Remotion `<Img>`; the silent audio-ready branch imports `<Audio>` from `@remotion/media`, as required by the installed API ([Img](https://www.remotion.dev/docs/img), [Audio](https://www.remotion.dev/docs/media/audio)). Fonts and assets delay rendering until loaded and verified. All animation is derived from the current frame; sequences premount for 30 frames. Operational state changes use hard cuts: all 23 transition overlaps are explicitly zero. Duration is `sum(beat durations) - sum(overlaps) = 8580 - 0 = 8580 frames`, 286 seconds (4:46) at 30 fps, 1920×1080. Every frame has exactly one scene. These are planned timings, not fabricated word measurements or final pacing approval.

The final component has no preview override props. Its own unconditional guard rejects direct late-frame rendering even if metadata is bypassed. The contract also refuses missing/altered files, false evidence aliases, deleted required slots, wrong site IDs, altered provenance and modified product copy. The current wave deliberately accepts only the twelve approved Cleaning captures: future genuine Inspection registration requires an explicit audited contract extension, then approved narration and measured timing. Filling JSON slots or changing an `allowMissing` prop cannot unlock a final.

## Exact evidence and provenance

All twelve source PNGs are uncomposed 720×1600 genuine app captures, dated 2026-09-06, Machine B, Bakery Demo, app `6999d8eca52fc4f4fff69066dce365f54a609663`, account `demo@sunbakebread.co.za`. Source worktree HEAD at reuse: `d85e4c921373c2c551ebc1897a6a5cb926417086`.

Source prefix: `/home/durai/Documents/projects/content-engine-cleaning-v4/remotion-branding/public/cln-tutorial/v4-current-6999d8e/`.
Destination prefix: `public/remedial-tutorial/cleaning/`. Each basename is preserved exactly, with no recomposition, redrawing or pixel edit. `captures.json` retains the source register's record references, scenario, authorization/review references, observed values, crop rectangles and event ordering; validation compares those declarations with the pinned source snapshot.

The three early baseline images predate the authorized operational session. The nine subsequent images are **authorized seeded demonstration records — simulated inspection and work**. They do not claim a real defect, physical correction, attendance or an actual before/after evidence photo. The Blue Covers note explicitly discloses simulation.

| Exact basename | Bytes | SHA-256 |
| --- | ---: | --- |
| `01-bakery-home-bill-of-health-entry.png` | 169740 | `a05e7eac47e81a2277803ca9176cc2da63e4be205d455747f57fcac1e6376714` |
| `02-bill-of-health-cleaning-verification-entry.png` | 161532 | `57c737d81d71cfd5b294ea0acb9412e90391791c8bb7930600d68c92a461ce0e` |
| `03-cleaning-verification-live-baseline-summary.png` | 130509 | `720154a539390662e8ded098c2c0ecf2a0fecc1d48a1dcf594341cf60813564a` |
| `13-major-fail-grade-reason.png` | 133766 | `25196a2b2f77020135b5efb21fe3f316c2e9b4df2adf44f76a81d1cf6f475eb9` |
| `14-major-fail-recorded.png` | 113557 | `dbfbf8209296f3126bb8ec69460c91a3417b03b4850729a75ea6d602c55ba7d7` |
| `16-critical-ncr-created.png` | 119977 | `bff05b336a0b06fca864c3ce351258db3fa16bd50c56866adfa43dbf9830a60c` |
| `21-four-band-open.png` | 132943 | `e492017102a9a0221d1dbc43434cdeaf5ec4408435eab38a6941cb1de73be0ce` |
| `22-follow-ups-close-open-item.png` | 135028 | `3a8e6c92435cf0b2392d9a81383db5830dd14186a66bc540f922b110ef82ce14` |
| `23-follow-ups-close-training-note.png` | 149875 | `12bdde3109384cbf840bbd08a4e7f092cdfa6e11aae19786add676a4cfb7d729` |
| `24-follow-ups-close-confirmation.png` | 85017 | `cde5cc5cb8cb735d13c31603a6ac7fd9d8ee269a26d8fa5a26a2ac12a8a34640` |
| `25-five-band-resolved-today.png` | 133409 | `dfe081534596f143b10368bcf5f90729555334d49077a79dc27471b911e2194c` |
| `26-five-band-resolved-item.png` | 119136 | `b374e795b9baadd3a6ae79f54f0fbc1d32807c92031752e7b5c287a383fb4e87` |

Exact provenance snapshots (paths relative to `public/`):

| Destination | Source | SHA-256 |
| --- | --- | --- |
| `remedial-tutorial/provenance/cleaning-v4-captures.json` | Cleaning worktree `remotion-branding/src/cln/captures-v4.json` | `96aa3c3a8a3d151b0fb6d425b5acabce767feb4eb00d29ab027b15f120d4d935` |
| `remedial-tutorial/provenance/cleaning-v4-register.md` | Cleaning worktree `remotion-branding/docs/cln-verification-v4-capture-register.md` | `0ad3895348a60da5c895478017c9440ef4ac86cc709ee007bc8dfecde34eb39f` |
| `remedial-tutorial/provenance/approved-storyboard.md` | approved git blob above | `d0d4490b7a571b99874867702266eb3e3d7f3bfa35b223f032df87f8a2a900ff` |

Shared immutable-by-hash assets are referenced in this worktree, without copying them from the Cleaning worktree:

| Existing public path | SHA-256 |
| --- | --- |
| `images/ewizer-logo.png` | `7ab3dcf75f9b8d66a6caf947abc4a63782812c6d568f8c1207e71fc327b4ced6` |
| `images/ecowize-logo.webp` | `f7401f888d9b55e4b8ccb80aaf4f20a712abfab04ce83c5208cf8ddaa0362555` |
| `ccv-tutorial/fonts/BarlowCondensed_700Bold.ttf` | `53550669f93c07de6221e051905462f862066459eb50148268b5628104a58a30` |
| `ccv-tutorial/fonts/DMSans_400Regular.ttf` | `20ccb90498d8ca511bb0be31a74eccd5f29fbe1161852ef72781b703929e98ec` |
| `ccv-tutorial/fonts/DMSans_700Bold.ttf` | `3764a2ce62fa95596c3315c1a0ca379e7cf827ed397c97fc036925b9b20b74dc` |

The Major Blue Covers finding retains its original failure when accepted: completion `r17cdthccav5rx1621x1522evh8dwx5m`, verification at `2026-09-06T12:31:36.313Z`. The separate Critical Tables completion `r171w4f0hy2hnkhrc7pxam9vph8dxrga` raised NCR `rx7dgxae4cnc7rm2k7pqdvf30x8dw98r`; that handoff remains separate. The nine operational screenshots cover the Major form/acknowledgement, open queue, optional confirmation note, same search showing no matches, resolved summary/item and independent Critical acknowledgement.

The later summary's 19 captures comprise 16 passes, two failures and one unavailable result. Acceptance moves one item from follow-up owed to resolved today; it does not turn the failed capture into a pass or change captured/still-to-do totals. The early Bill baseline's seven open combines two Cleaning remedials and five CAPA actions due. It is explicitly labelled earlier baseline and is not asserted to be the later queue count.

**Additional genuine Cleaning evidence needed:** `22`, `23` and `24` show **ALL** selected plus a Blue Covers search. They do not prove selecting the **CLEANING** bucket. That view is a separate blocker. No replacement tabs or corrected values were painted over these images.

## Missing views and data requirements

The fixed contract requires these twenty currently missing views. A single genuine screenshot may support multiple views only with reviewed provenance and crop bindings; these are view requirements, not a promise of twenty unique files.

| Required slot | Capture requirement |
| --- | --- |
| `cleaning-followup/bucket-cleaning` | Genuine Follow-ups with CLEANING selected; do not relabel the existing ALL captures. |
| `inspection-capture/form` | Camera/annotated before evidence, genuine form fields and clearly labelled synthetic finding. |
| `inspection-capture/local-saved` | Saved local draft finding, explicitly before shared queue persistence. |
| `inspection-capture/complete-issued` | Normal completion/signature boundary and issued inspection confirmation/detail. |
| `inspection-capture/server-open` | The same uploaded finding visible in the shared open queue. |
| `inspection-carryover/bill-row` | Bill of Health → CARRIES OVER → Inspection Remedials for Bakery Demo. |
| `inspection-carryover/followups` | Follow-ups → INSPECTIONS, including OPEN VERIFY FLOW. |
| `inspection-carryover/verify-open` | OPEN list with actual area, severity, search, age and finding identity. |
| `inspection-carryover/later-day` | Same unresolved finding on a later real day. Cannot manufacture elapsed time through normal creation. |
| `inspection-review/before-detail` | Expanded genuine before photo, description and any actually persisted action. |
| `inspection-review/after-required-alert` | In required-photo mode, Accept without after evidence shows the app's gate. |
| `inspection-review/after-attached` | Genuine camera-captured after evidence attached on that case before acceptance. |
| `inspection-accept/accept-control` | Accept decision on case A. |
| `inspection-accept/closed-accepted` | Case A in CLOSED with accepted verification. |
| `inspection-reject/reject-confirm` | Separate case B, optional reason and CONFIRM REJECT. |
| `inspection-reject/returned-open` | Case B still open after rejected verification. |
| `inspection-ncr/escalate-dialog` | Separate case C, explicit Escalate to NCR dialog. |
| `inspection-ncr/escalated-linked` | Case C escalated with actual linked NCR/reference/history. |
| `inspection-history/closed-history` | Genuine recent CLOSED history showing only fields the mobile app renders. |
| `inspection-history/bill-after` | Bakery Demo Bill carry-over state after the demonstrated decisions; do not promise clear while case B/other records remain open. |

No current genuine Inspection screenshots or live Inspection records were obtained in this turn. Source feasibility is established; deployed behavior, active account/role, site availability, selectable categories/areas, camera function and actual records remain unverified.

## Product boundaries and source findings

Mobile source was read-only at `6999d8eca52fc4f4fff69066dce365f54a609663`. Backend working HEAD was `977fb028973b7a9e02603c9b4651e57935dd119b`; backend claim checks used exact `git show` blobs from the existing local `origin/dev` reference `d44f26ab6d6ae823b8c38029d126e650a69f76c9`. No fetch, backend query, emulator/app session or live deployment check was performed. `source-audit.json` records exact file paths/hashes and claim references; source inspection is not represented as production verification.

- A failed scheduled Cleaning check satisfies that occurrence. The finding remains open until a responsible person returns, verifies the correction and uses Follow-ups to record acceptance. The button does not enforce the physical recheck.
- Follow-ups uses all-time unverified Cleaning failures in the inspected backend, despite the mobile query still passing `days: 14`. CONFIRM FOLLOWED UP opens the optional note/photo form; the inner CONFIRM records acceptance. The original failure remains.
- The stored Cleaning record contains original capture and later verification attribution, but current mobile lists do not show both actors and timestamps together. This build uses a source-backed narration-only explanation, plainly states the display limit, and inserts no invented UI fields. **Explicit approval of this audit-trail treatment is still needed before final narration**, as required by the approved storyboard.
- No structured remedial owner, assignee, due date, review date, frequency, SLA, reminder or automatic Inspection escalation is invented. Capture/verification attribution is not assignment. Critical Cleaning's grade-triggered NCR and explicit Inspection NCR remain separate formal handoffs.
- Inspection open/remedied server findings are queried across dates without a parent inspection status gate. A new day or cleaning cycle does not close them. Areas group alphabetically; within an area severity precedes oldest-first. Age is whole elapsed days, muted through 7, amber after 7, coral after 30. These are visibility thresholds only.
- SAVE FINDING is local/offline. `PendingInspectionFinding` is stored under `@ewizer_inspection_pending_findings`; Complete → Sign & Complete uploads the photo and finding then issues the report. Backend creation time is upload time. Saving a draft alone cannot provide a Bill/Follow-ups server row.
- Both Inspection before/after handlers call `ImagePicker.launchCameraAsync` directly. The `test@` gallery helper is not used here. These handlers have no QR check-in gate, but watermarking can include existing presence. Any controlled camera source must be disclosed; no physical attendance may be inferred.
- Draft `handleSaveRemedial` updates React state for a local finding, while `PendingInspectionFinding` and its upload payload omit `remedialAction`. Do not rely on that draft field persisting. For a reliable demonstrated action, use the actual verification ACTION TAKEN field at acceptance and confirm it survived a fresh read.
- Accept requires after evidence in `before_after_required` mode; its attachment label can still say optional. Accept closes, Reject records a rejected verification and leaves/returns the finding open, and explicit NCR creates/links an NCR and escalates. Do not silently change these into one closure operation.
- Recent CLOSED filters on `(verifiedAt ?? createdAt ?? 0)` within 30 days. That limits display, not stored history. The query provides no after-photo URL or `remedialBy`; mobile history shows action, actor and comment but no event time. Eligible closed findings without an NCR may be reopened by area_manager/general_manager/tenant_admin/platform_admin with a reason of at least ten characters; previous verification fields/history remain. There is no current normal mobile control to seed a `remedied` status or set/backdate timestamps.
- Current local backend follow-up photo storage uses `afterImageIds`; the storyboard's historical source describes appending `imageIds`. Reused Cleaning evidence contains no supplied photo, and narration avoids this storage detail. Recheck the deployed close behavior before future photo capture. The mobile current-status comment suggesting a high-level clean clears Inspection findings conflicts with the actual lifecycle and was excluded from teaching.

## Safe Bakery Demo capture sequence — next wave only

This is a source-derived plan, not an executed mutation log. The user authorizes synthetic demo data only at Bakery Demo `k57ae8hn0kgercz41hgy6s03mn88fzwd`. The real customer site `k578brxxgh6qh6b6wgf337f2w5875aah` remains prohibited. No mutations were made in this build wave.

1. Start with a read-only app readiness pass. Reconfirm the app revision and then-current backend source; observe actual labels, photo modes, queue predicates and permissions in the shipped app. Verify the authenticated account, role, active site ID, inspection-list selected site ID and verify-flow scope. The Inspection list has its own site picker, while Verify uses `user.siteIds[0]`; both must resolve to the allowed ID. A single-site demo account is the safest scope. Do not infer the ID merely from a display name, and stop before CREATE if any guard is uncertain. The previous Cleaning account was `demo@sunbakebread.co.za` with Site Manager UI permissions; current auth has not been assumed.
2. Establish data prerequisites from the actual Bakery Demo UI: active site, category, section/area and working camera/storage permission/connectivity. The form supports active `psi_category` codes `maintenance_food_safety`, `cleaning_practices`, `operational_practices`, `pest_management_control`, `adequacy_of_documents`; use a genuinely available selection. Prior Cleaning provenance identifies Bread Plant `kx736zc3vm1k711xw7c88y750988esr5` and Premix Area `kx75czmzd6hc5d7t4wct58tjm188ea8p`, but they must be reverified as selectable Inspection values. No owner/due/SLA field should be sought or simulated.
3. Prepare three clearly distinguished cases A (Accept), B (Reject) and C (explicit NCR), either in one labelled demo inspection or separate labelled inspections if the normal UI makes the outcome clearer. Proposed title: `Bakery Demo training only — synthetic Inspection Remedial — A/B/C`. Use honest descriptions such as `Training-only controlled demonstration; no real defect or correction claimed.` Choose a genuine non-critical severity and actual displayed category. A neutral physical training card/controlled subject provides truthful before/after camera evidence. Any proposed emulator virtual camera requires an explicitly documented source, hash and simulation disclosure; do not patch the app, fake its UI, inject records or rely on the unrelated test-gallery helper.
4. In the normal app: Home **Inspect** → Inspections → choose Bakery Demo → **NEW INSPECTION** → enter the labelled title and select the actual **before/after required** photo mode for case A → **CREATE**. CREATE immediately persists a draft inspection. Record its real ID and site scope. This is the first persistence boundary; it is not a dry run.
5. **ADD FINDING** → capture before photo with the shipped camera/watermark/annotation flow → enter severity/category/description and real section/area → **SAVE FINDING**. Record the local finding ID, genuine form and local-saved screens, source-photo hash and screenshot hash. Before evidence is required at capture. A local saved card alone does not prove a server remedial. Do not rely on the draft remedial-action field for uploaded action text.
6. After recording the open local state, use **Complete** → truthful optional summary → **Sign & Complete**, with the actual authorized inspector's signature. Do not impersonate another inspector. Wait for upload and issued state, and record the real server inspection/finding IDs, time, chosen photo mode and before storage/evidence references. Confirm the same finding appears in the shared open list on a fresh read. The server creation time begins here. If upload partially fails, inspect actual persisted state before retrying to avoid duplicate findings.
7. Capture Bill of Health **CARRIES OVER → Inspection Remedials**; Follow-ups **INSPECTIONS → OPEN VERIFY FLOW**; then OPEN list, severity/search/group/age and expanded before details. Capture all three cases while open before taking decisions. Also obtain the missing selected **CLEANING** bucket screenshot without changing a record. For a carry-over proof, leave an explicitly labelled case open, return on a genuinely later day and capture the same ID. A fresh finding cannot demonstrate an 8-day or 31-day badge immediately; use the clearly labelled explanatory age graphic until suitable genuine elapsed-time evidence exists. No backdating or device-clock manipulation.
8. On case A in required-photo mode, capture the genuine Accept-without-after alert, then capture truthful controlled after evidence, supply ACTION TAKEN if used, record the attached evidence state, and **Accept**. Capture CLOSED accepted state and available history. Before evidence must be preserved before acceptance because the current CLOSED query does not expose all evidence fields.
9. On case B, **Reject** → optional honest reason → **CONFIRM REJECT**, then record the still-open row/history. On case C, **NCR** → genuine **Escalate to NCR** dialog → explicit escalation, then record linked NCR/reference and escalated history. Never call Reject closure or imply age triggered the NCR. Capture the final Bill carry-over row with its actual remaining count; case B and unrelated findings may keep it open.
10. Preserve exact original captures and a register containing app/backend references, account/role/site, timestamps, case IDs, photo mode, before/after photo hashes, original screenshot hashes/dimensions, actual observations and mutation order. Disclose synthetic work on every operational scene. Do not crop away the synthetic disclosure to imply a real incident. Only then extend the manifest/contract bindings for reviewed authentic Inspection assets and rerun validation.

**Persistence and rollback consequences:** there is no demonstrated one-click rollback. CREATE writes a server draft even before findings. SAVE FINDING writes local pending data; completion uploads findings/photos and clears local pending/photo files, and an interrupted completion can partially persist. An issued finding cannot simply be removed through the normal draft REMOVE path. Archiving a parent does not remove open/remedied findings from carry-over counts. The backend delete-inspection implementation deletes report/photos/findings but does not establish complete linked-NCR cleanup; it is not part of this capture plan. Accept persists a verification; Reject leaves an open obligation; NCR creates an independent durable record and cannot be undone by the finding's normal reopen button. Prefer retaining clearly labelled demo audit records. Any later cleanup requires a separate bounded plan based on the actual IDs and linked state, with evidence retained first; do not assume automatic or safe reversal.

The next bounded step is the read-only shipped-app readiness/site/camera/category pass, then a registered Bakery Demo capture session following these persistence boundaries. No final audio or final render should begin before the nineteen Inspection views, selected Cleaning view and audit-trail treatment are resolved.

## Validation and preview artifacts

Commands run from `remotion-branding/`:

After the dependency-range review fix, `npm install --ignore-scripts --no-audit --no-fund` completed successfully. All 232 resolved package entries in the ignored lock stayed unchanged; only the root dependency ranges changed. `npm ls` confirmed Remotion, CLI and media remain installed at 4.0.484. `validate:remedial` passed again (exit 0), and both `preflight:remedial:final` and `preflight:remedial:inventory` refused all twenty missing views with the expected exit 1. No composition, source, captures or inventory changed in this review fix.

- `npm run validate:remedial` — PASS, isolated TypeScript and 15 validation groups.
- `node tools/verify-remedial.cjs --final` — expected exit 1, FINAL RENDER REFUSED with all missing views and final/audio/inventory restrictions.
- `node tools/verify-remedial.cjs --inventory` — expected exit 1; no inventory writer exists in this tool.
- `npm run smoke:remedial` — PASS. Chromium refused both final metadata selection with hostile preview props and a direct final render at frame 8579 with metadata bypassed. The expected rejected render emitted a renderer cleanup `Target closed` diagnostic, but both refusal assertions and all subsequent preview renders succeeded.
- All 8580 timeline frames checked for coverage; duration, zero-overlap math, complete storyboard cue coverage and minimum two-second evidence holds pass. Corrupted bytes, nonexistent files, removed slots, false aliases, changed site, invented attribution, reordered chronology and altered product claims are rejected.
- Reverse-order stills cover every beat and every evidence cue; four repeat seeks (genuine UI, confirmation, missing-evidence blocker, age diagram) are byte-identical. Representative Cleaning, Bill, confirmation, Critical, Inspection blocker and age frames were visually inspected for disclosure, legibility and separation from app chrome.

Rendered only a six-second silent excerpt (180 frames, 1920×1080, 30 fps, H.264, zero audio streams), plus 59 INTERNAL PREVIEW stills. The full 286-second composition was not rendered.

Preview: `/home/durai/Documents/projects/content-engine/remotion-branding/out/verify-remedial-INTERNAL-PREVIEW-qy453W/verify-remedial-excerpt-INTERNAL-PREVIEW.mp4`

SHA-256: `747ccdf4fea5ae14e777a3be61002dbdf8c073e9ef0e8813e2cde316f54025ee`

Proof and per-frame hashes: `out/verify-remedial-INTERNAL-PREVIEW-qy453W/verify-remedial-results.json`. Scratch/bundle files remain under `/tmp/verify-remedial-cvSref`; no `review-*` file was used or edited. Pre-build dirty-file preservation snapshot is `/tmp/verify-remedial-baseline.json`; all sampled pre-existing files except the explicitly changed package and ignored lock retain their original hashes.

## Git handoff

Primary HEAD: `2d793d94f8e6ee0ca500b761c4b232ac9f5380b3` (unchanged). The task's only modified pre-existing tracked file is `remotion-branding/package.json`; the existing ignored package lock was updated. All task source/assets/docs are new untracked files. Exact evidence hashes above and the full git-status snapshot below were recorded at handoff; unrelated dirty work appears because it existed before this build.

```text
 M packages/backend/src/index.ts
 M remotion-branding/.gitignore
 M remotion-branding/package.json
 M remotion-branding/src/Root.tsx
 M remotion-branding/src/cln/CleaningVerificationTutorialV2.tsx
 M remotion-branding/src/cln/narration.json
 M remotion-branding/src/cln/timing-v3.json
?? output/review-frames/
?? packages/backend/scripts/generate-boh-tutorial-audio.ts
?? packages/backend/src/chatterbox/models/
?? packages/backend/src/routes/ink.ts
?? remotion-branding/AGENTS.md
?? remotion-branding/CLAUDE.md
?? remotion-branding/docs/bill-of-health-storyboard.html
?? remotion-branding/docs/ccv-client-v4-handoff.md
?? remotion-branding/docs/cln-verification-v3-correction-manifest.md
?? remotion-branding/docs/cln-verification-v3-refresh-brief.md
?? remotion-branding/docs/remedial-action-audit-trail-storyboard.md
?? remotion-branding/docs/video-inventory.json
?? remotion-branding/docs/video-inventory.md
?? remotion-branding/public/boh-alt/
?? remotion-branding/public/boh/
?? remotion-branding/public/ccv-refresh/
?? remotion-branding/public/ccv-tutorial/
?? remotion-branding/public/ccv2/
?? remotion-branding/public/iclean-tutorial/
?? remotion-branding/public/iinm/shots/A/
?? remotion-branding/public/remedial-tutorial/
?? remotion-branding/public/schedule-preview/
?? remotion-branding/src/IinmExpertChA.tsx
?? remotion-branding/src/boh-alt/
?? remotion-branding/src/boh/
?? remotion-branding/src/ccv/
?? remotion-branding/src/ccv2/
?? remotion-branding/src/cln/narration-v3.json
?? remotion-branding/src/iclean/
?? remotion-branding/src/iinm/chA-boxes.json
?? remotion-branding/src/iinm/chA-timing.json
?? remotion-branding/src/index-boh.ts
?? remotion-branding/src/index-ccv2.ts
?? remotion-branding/src/index-remedial.ts
?? remotion-branding/src/kit/
?? remotion-branding/src/math/
?? remotion-branding/src/remedial/
?? remotion-branding/src/schedule/
?? remotion-branding/src/tapdemo/
?? remotion-branding/tools/
?? remotion-branding/tsconfig-remedial.json
?? remotion-branding/docs/remedial-action-build-wave-1.md
```
