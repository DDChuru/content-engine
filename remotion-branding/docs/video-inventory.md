# Training video and composition inventory

This is the human guide to [`video-inventory.json`](video-inventory.json), which is the source of truth. The JSON carries every stable composition ID, every file under `output`, exact media metadata, evidence links, machine locations, and the independent status fields. Do not promote an item based on this summary alone.

Last verified on machine B: **2026-09-06T07:22:33+02:00**, against repository HEAD `2d793d94f8e6ee0ca500b761c4b232ac9f5380b3` and the actual working-tree contents.

## Snapshot

| Measure | Count |
| --- | ---: |
| Registered entrypoints | 5 |
| Registration records | 53 |
| Unique stable composition IDs | 51 |
| MP4 artifacts classified | 16 |
| PNG evidence artifacts classified | 33 |
| All classified files under `output` | 49 |
| Human-signed-off finals | **2** |

The 49 output files total 572,678,979 bytes: 539,210,559 bytes of MP4s and 33,468,420 bytes of PNG evidence. Nothing was published or sent by this inventory task.

## Status rules

Composition/source readiness, technical review, human sign-off, and deliverable status are separate facts:

- `sourceStatus` describes registered source and known input readiness only. It does not approve a render.
- `technicalReview` is `unreviewed`, `approved`, or `changes` and must cite an explicit technical verdict or defect.
- `humanSignOff` is `pending`, `signed_off`, `rejected`, or `superseded`. **Only a human may set `signed_off`.** A successful render, decode, automated check, or technical review is not human approval.
- `deliverable` is `draft`, `candidate`, `final`, `proof_only`, `superseded`, or `unclassified`. `final` is valid only together with human `signed_off` for the exact hash.

Unknowns stay unreviewed, pending, and unclassified; filenames and timestamps are not approval evidence.

## Signed-off finals

The signed-off final artifact IDs, in deterministic order, are:

1. `boh-client-v2` — SHA-256 `d81a4eedee73a184a4cd0b276633e4d73c7202491cd1ff620be91166feb9ef28`
2. `ccv-client-v5` — SHA-256 `000581dbc02bb57fb085ee9a0c1a599c8433e8bdf9fb76f8c096cbc76ab67347`

On 2026-09-06, Daniel explicitly clarified that flagging a reviewed video as "okay" is final approval and that work does not move to the next track without final approval. These are the latest artifacts in their completed tracks. The composed-figures/disclosure issue on `boh-client-v2` remains recorded and will be revisited during Nicole-library preparation; that follow-up does not undo sign-off.

## Current finals and exceptions

| Artifact | SHA-256 / bytes / spec | Technical | Human | Deliverable | Current truth |
| --- | --- | --- | --- | --- | --- |
| `output/ccv-refresh/ccv-refresh-client-v5.mp4` | `000581dbc02bb57fb085ee9a0c1a599c8433e8bdf9fb76f8c096cbc76ab67347`; 41,077,756 B; 385.344 s; 1920×1080 @ 30; H.264 High/yuvj420p + AAC-LC 48 kHz stereo | approved | signed_off | final | Same exact artifact is known on A and B. Under Daniel's 2026-09-06 approval-policy clarification, this is the approved corrected genuine-current-app version and latest artifact in the completed CCV track. Canonical Beat 04 uses genuine current-app, normal-online Bakery Demo captures from mobile commit `6999d8eca52fc4f4fff69066dce365f54a609663`; full video/audio decode exited 0. |
| `output/boh-tutorial/bill-of-health-client-v2.mp4` | `d81a4eedee73a184a4cd0b276633e4d73c7202491cd1ff620be91166feb9ef28`; 25,490,171 B; 312.661333 s; 1920×1080 @ 30; H.264 High/yuvj420p + AAC-LC 48 kHz stereo | unreviewed | signed_off | final | Under Daniel's 2026-09-06 approval-policy clarification, this latest artifact in the completed Bill of Health track is final. Beats 3, 8, and 11 compose illustrative figures over genuine captured ledger rows; the client cut suppresses the optional disclosure. That composed-figures/disclosure issue remains recorded and will be revisited during Nicole-library preparation; the follow-up does not undo sign-off. No technical verdict was found. |
| `output/ccv-refresh/ccv-refresh-client-v4.mp4` | `3d8a3c9c8ba7b58697844e8b2a60e484fbaee83e1ca6b94fab862736fd211357`; 40,679,992 B; 385.344 s | changes | superseded | superseded | Superseded by the real-current-app Beat 04 capture request. It is intact historical proof, not a final. |
| `output/ccv-refresh/ccv-refresh-client-v5-rejected-offline.mp4` | `3ae3aa224019f84291ec15bbc236a47ca30f1e49f211545d8f18884325493d8f`; 40,770,773 B; 385.344 s | changes | rejected | proof_only | Quarantined because its flow says `Saved offline`; it is not canonical v5. |

The remaining MP4 classifications are deliberately conservative:

- Drafts: `bill-of-health-alt-draft1.mp4`, `bill-of-health-draft3.mp4`, `bill-of-health-draft5.mp4`, `bill-of-health-draft6.mp4`, `bill-of-health-draft7.mp4`, `ccv-refresh-draft1.mp4`, and `ccv-refresh-draft2.mp4` are `unreviewed` / `pending` / `draft`.
- No supported deliverable classification: `bill-of-health-client-v1.mp4` and CCV client v1-v3 are `unreviewed` / `pending` / `unclassified`.
- Reconstruction evidence: `ledger-reconstruct-demo.mp4` is `changes` / `pending` / `proof_only` because its compose-row exact-pixel gate is 4.086814%, above the required 1% maximum.

Exact bytes, hashes, stream durations, frame counts, and paths for all 16 MP4s are in the JSON.

## Registered Remotion work

The two Bill of Health delivery IDs occur in both `main` and `boh`, which is why 53 registrations represent 51 unique IDs. There are no Remotion `<Still>` registrations; the one-frame proof surfaces are registered as compositions.

| Entry ref | Entrypoint → root | Registrations | Scope |
| --- | --- | ---: | --- |
| `main` | `src/index.ts` → `src/Root.tsx` / `RemotionRoot` | 40 | Default Studio and package-script root |
| `boh` | `src/index-boh.ts` → `src/boh/RootBoh.tsx` / `RootBoh` | 4 | Bill of Health delivery and proof |
| `ccv2` | `src/index-ccv2.ts` → `src/ccv2/RootCcv2.tsx` / `RootCcv2` | 3 | CCV refresh delivery and proof |
| `boh_alt` | `src/boh-alt/index-alt.ts` → inline `AltRoot` | 2 | Alternate Bill of Health comparison |
| `boh_reconstruct` | `src/boh-alt/reconstruct/index-reconstruct.ts` → inline `RootReconstruct` | 4 | Reconstruction/fidelity proofs |

| Family | Stable IDs | Primary source/assets (JSON is complete) | Source status / latest local artifact |
| --- | --- | --- | --- |
| IINM chapters | `IinmCh0Intro`, `IinmCh1`, `IinmExpertChA`, `IinmCh2`–`IinmCh5` | root components + `src/iinm/`; `public/iinm/` | registered; no local output artifact |
| Earlier IINM scenes | `IinmModuleScene`, `IinmLifecycleScene`, `DigitisationIntro`, `IinmComplianceScene`, `IinmOversightScene`, `IinmSummaryScene` | root scene components; `public/images/` and scene narration | registered; no local artifact. `DigitisationIntro` registration is 1,230 frames despite a stale 1,350-frame header comment. |
| Brand examples | `Intro`, `Outro`, `SOPIntro`, `TrainingOutro`, `IntroWithImage` | `src/Intro*.tsx`, `src/Outro.tsx`; `public/images/` | examples; `IntroWithImage` is incomplete because both default image files are absent |
| Cleaning Verification V1-V3 | four `CleaningVerificationTutorial*` IDs | `src/cln/`; `public/cln-tutorial/` | V1/V2 registered; V3/V3Branded incomplete pending the documented hard re-shoot/re-narration. Briefs reference sibling `../output/cln-verification-tutorial/` V2-small, V3, V3-small, and V3-branded MP4s outside the counted local output tree. No human sign-off. |
| Daily Hygiene | `DailyHygieneTutorial`, `DailyHygieneTutorialBranded` | `src/hygiene/`; `public/daily-hygiene-tutorial/` | registered; the brief labels the track draft; no local artifact or review verdict |
| Equipment | `EquipmentIssueTutorial`, `EquipmentIssueTutorialBranded` | `src/equipment/`, shared `src/journeys/` + `src/brand/`; `public/equipment-tutorial/`, shared `public/images/` branding | incomplete: 10 referenced narration clips plus tutorial music are absent |
| PPE | `PpeIssueTutorial`, `PpeIssueTutorialBranded` | `src/ppe/`, shared `src/journeys/` + `src/brand/`; `public/ppe-tutorial/`, shared `public/images/` branding | incomplete: 8 referenced narration clips plus tutorial music are absent |
| Schedule Preview | `SchedulePreviewTutorial`, `SchedulePreviewTutorialBranded` | `src/schedule/`; `public/schedule-preview/` | registered; no local artifact or dedicated handoff |
| Earlier CCV | `CcvSecondPairOfEyes`, `TutorialKit` | `src/ccv/`, shared `src/kit/`; `public/ccv-tutorial/` | registered; no local artifact tied to these IDs |
| iClean | `IcleanFirstInspection` | `src/kit/`, `src/iclean/beats.json`; `public/iclean-tutorial/`, shared `public/ccv-tutorial/fonts/` | incomplete: all 12 beats are pending with null final still/audio |
| VidStud / annotated walkthroughs | `TapDemo`, `DailyHygieneWalkthrough`, `AnnotatedVideo` | `src/tapdemo/`, shared `src/kit/` + `src/brand/`; `public/tapdemo/`, shared `public/images/` branding | proof, registered wrapper, and generic dynamic composition respectively |
| Utility examples | `PipelineDiagram`, `HandwrittenMath` | `src/PipelineDiagram.tsx`, `src/kit/`, `src/math/demo.json` | registered examples; no local artifacts |
| Bill of Health main | `BillOfHealthTutorial`, `BillOfHealthTutorialBranded`, `BohComposeProof`, `BohHeroProof` | `src/boh/`, shared `src/kit/` + `src/brand/`; `public/boh/` plus shared assets | registered plus two proof surfaces; client v2 is the signed-off final and contains composed illustrative figures on real rows, with composed-figures/disclosure follow-up retained for Nicole-library preparation |
| CCV refresh | `CcvRefresh`, `CcvRefreshBranded`, `Ccv2ComposeProof` | `src/ccv2/`; `public/ccv2/`, `public/ccv-refresh/hunt/` | registered plus proof; canonical client v5 is the signed-off final |
| Bill of Health alternate | `BillOfHealthAlt`, `BillOfHealthAltBranded` | `src/boh-alt/`, shared `src/brand/`; `public/boh-alt/`, reused `public/boh/`, shared fonts/music/branding | incomplete: four beats retain provisional recapture notices; latest artifact is draft1 |
| Bill of Health reconstruction | `LedgerReconstructDemo`, `ComposeRowDemo`, `LedgerReconstructPhone`, `ComposeRowFidelity` | `src/boh-alt/reconstruct/`; `public/boh-alt/reconstruct/` | proof-only/experimental; latest MP4 is the ledger demo and the ≤1% fidelity gate is unmet |

The JSON records exact component files, data files, dimensions, FPS, frame counts, entrypoint references, asset roots, documentation, and artifact references for every ID.

## Capture and review provenance

Canonical CCV v5 uses four hashed, genuine current-app assets under `public/ccv-refresh/hunt/bakery-demo/`: unfilled form, filled form, computed dilution, and the normal-online success dialog. They show Bakery Demo, `ECO-SAN SH12` (`t570cnk57a27y28q0sgg82r25n89kjvy`), `LOT-20250905`, Entire factory, manual dilution, 1 L chemical plus 50 L water, computed 2.0%, and approved 0.5–5.0% in range. The dialog has the exact normal wording and both untouched verification buttons. The JSON carries each capture hash.

This is distinct from:

- the composed v4 form asset `public/ccv2/shots/ccv-04.png`, retained only for historical v4 proof; and
- two quarantined stale-app/offline capture assets, including the `Saved offline` attempt, used by the rejected v5 render.

The main review/handoff evidence is:

- `docs/ccv-client-v4-handoff.md` and `public/ccv-refresh/hunt/NOTES.md` for CCV hashes, specs, decode, current-app capture truth, and rejected-offline distinction;
- `docs/bill-of-health-storyboard.html`, `src/boh/boxes.json`, and the Bill of Health source/proof compositions for genuine-versus-composed evidence and the composed-figures/disclosure follow-up retained for Nicole-library preparation;
- `src/boh-alt/REGISTER.md` for provisional alternate captures; and
- `src/boh-alt/reconstruct/PROGRESS.md` plus `verify-compose.json` for the failed exact-pixel gate.

Three output still collections account for all 33 PNG artifacts:

| Collection | Files / bytes | Sorted-member-manifest SHA-256 | Status / limitation |
| --- | ---: | --- | --- |
| `output/ccv-refresh/verify-v4-review-fixes/` | 12 / 12,966,551 | `2ac6a7078d6f40064ddc44c8e89c00eaa8058245075fadb2486f36d5c7fdaf1f` | historical v4 proof; v4 superseded |
| `output/ccv-refresh/verify-v4-stills/` | 12 / 14,255,624 | `d0932313e01519864a7265d5fe30526b23ee49f274d2fc8a3a1a49561c3a236d` | explicitly superseded and not for review |
| top-level `output/ccv-refresh/verify-v5-*.png` | 9 / 6,246,245 | `ef5e762c42a003bd62d74fb512a947188f78b2febd3a57f9b9386966531d5898` | proof-only; not bound by the handoff to canonical v5, so association remains uncertain |

All 33 are 1920×1080 PNGs. The JSON lists every member name. Canonical v5's encoded checkpoint frames were temporary and are not retained under `output`.

## Machine paths and verification

Repository templates are:

- B: `/home/durai/Documents/projects/content-engine/remotion-branding/{relativePath}`
- A: `/home/dachu/Documents/projects/content-engine/remotion-branding/{relativePath}`

A template does not prove presence. The only A copy asserted here is canonical CCV v5 at `/home/dachu/Documents/projects/content-engine/remotion-branding/output/ccv-refresh/ccv-refresh-client-v5.mp4`; the same relative path exists on B. Both are known as the 41,077,756-byte artifact with SHA-256 `000581dbc02bb57fb085ee9a0c1a599c8433e8bdf9fb76f8c096cbc76ab67347`.

Run these from the repository root on the machine being checked:

```bash
sha256sum -- output/ccv-refresh/ccv-refresh-client-v5.mp4
stat -c '%s' -- output/ccv-refresh/ccv-refresh-client-v5.mp4
ffprobe -v error \
  -show_entries format=duration,format_name:stream=index,codec_name,profile,pix_fmt,width,height,r_frame_rate,nb_frames,sample_rate,channels \
  -of json -- output/ccv-refresh/ccv-refresh-client-v5.mp4
```

For any other artifact, substitute its JSON `relativePath`. To verify an evidence-still collection, change to `output/` and hash its sorted member manifest exactly as recorded:

```bash
cd output
find ccv-refresh/verify-v4-review-fixes -maxdepth 1 -type f -name '*.png' -print0 \
  | LC_ALL=C sort -z \
  | xargs -0 sha256sum \
  | sha256sum
```

Use the corresponding `find` selection from the JSON for the other two collections.

## Exact update checklist

After each new render, review, sign-off, replacement, or cross-machine copy:

1. Enumerate all `registerRoot` entrypoints and composition IDs. Update source paths, asset roots, docs, entrypoint references, dimensions, FPS, frames, source status, and counts.
2. Run `find output -type f -printf '%P\t%s\n' | LC_ALL=C sort`; account for every regular file in a video record or evidence collection.
3. For every new or changed MP4, record its exact relative path, bytes, `sha256sum`, `ffprobe` spec, composition ID, and verified machine locations.
4. Update `sourceStatus`, `technicalReview`, `humanSignOff`, and `deliverable` independently. Cite evidence for every status beyond the conservative defaults.
5. After technical review, change only `technicalReview` to `approved` or `changes` and record the verdict evidence. Do not infer human approval.
6. After an explicit human decision, record the reviewer and exact artifact hash. Set `signed_off` only from that decision, and set `final` only with `signed_off`.
7. Record replacements, rejections, publication/send state, or new A/B copies as separate facts; never infer approval from a copy or filename.
8. Refresh `lastVerifiedAt` and counts, validate JSON, and reconcile this summary and the signed-off-finals section against it.

Validation and count cross-checks:

```bash
jq empty docs/video-inventory.json
jq '[.compositionFamilies[].compositions[]] | length' docs/video-inventory.json
jq '[.compositionFamilies[].compositions[].entrypointRefs[]] | length' docs/video-inventory.json
jq '.videoArtifacts | length' docs/video-inventory.json
jq '[.evidenceStillCollections[].memberCount] | add' docs/video-inventory.json
jq '[.videoArtifacts[] | select(.statuses.humanSignOff == "signed_off" and .statuses.deliverable == "final")] | length' docs/video-inventory.json
```

Expected results at this snapshot are `51`, `53`, `16`, `33`, and `2`.

## Recorded uncertainty

- Human sign-off for `boh-client-v2` and `ccv-client-v5` rests on the task-supplied 2026-09-06 Daniel approval-policy clarification rather than repository-file evidence; no human sign-off is recorded for other artifacts.
- Bill of Health client v2 has no explicit technical-review verdict. Its composed-figures/disclosure issue remains recorded for revisit during Nicole-library preparation without undoing sign-off.
- Bill of Health client v1 and CCV client v1-v3 lack supported review/deliverable classifications; they remain unreviewed and unclassified.
- The nine retained `verify-v5-*.png` files are not demonstrably tied to canonical v5.
- Some documents point to sibling `../output` files outside this repository's local `output` tree; those references are not counted as local artifacts.
- This audit reflects the actual pre-existing dirty working tree at the timestamp above. Re-audit after source or artifact changes.
