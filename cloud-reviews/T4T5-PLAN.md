# Biology Topic 4 + Topic 5 — video inventory and A-side build plan (28 Sep 2026)

Read-only inventory. Sources: `origin/cloud/008-…dq9f0v` (008a), `origin/cloud/008f-fix-4prnob` (008f), `origin/cloud/009-5.1.1-to-5.1.4-qls6vy` (009a), `origin/cloud/009-5.1.2-to-5.1.6-rmr4ks` (009b), `origin/cloud/009f-fix-4t1jp6` (009f), `origin/cloud/009g-fix-3a72s8` (009g), `origin/cloud/reviews:cloud-reviews/*`, storyboards `biology-syllabus-map/storyboards/topic-0{4,5}`, `TOPIC-PLAN-04-MEMBRANES.md`, `TOPIC-PLAN-05-CELL-CYCLE.md`, `REWORK-QUOTED-EXAM.md`.

Bunny library 758254. All uploads are "REVIEW …" titles, no collection. **Every built lesson is voiced by Thandi (ElevenLabs `BcpjRWrYhDBHmOnetmBl`, eleven_multilingual_v2)**; no Kokoro, no Gemini/Shava anywhere in T4/T5 yet. VIDEO-REGISTRY.json has no T4/T5 rows.

New rules checked (VIDEO-STRUCTURE.md 27 Sep): OWN = exam questions in our own words, no paper/session/year on screen or in narration; PX = text ≥ 17 px after branding (×0.8802) on every frame incl. letters in drawings; OVL = per-frame overlap gate incl. arrows/leaders; HOOK = memory hook spoken link by link, hook+target lit together, 2 s hold.

## 1. Topic 4 — lesson state (10 lessons, plan order)

| Lesson | Latest Bunny guid (version) | Voice | Review status | OWN | PX | OVL | HOOK | Files |
|---|---|---|---|---|---|---|---|---|
| 4.1.1-2 Fluid mosaic membranes | `1ab01c37-b2c5-410f-8388-b40a572a0c75` (v2, 008f, 558 s) — v1 `05dc76d4-…` superseded | Thandi | v1 CHANGES (7 findings); **v2 UNREVIEWED**. v2 REPORT claims all 7 fixed (entry-at-seat motion, BuildNote caption, polarity inset, 20 px, hook re-voiced, spec slots, end pad) | **FAIL** — B13 shows "M24/22 Q1(a)(ii), 1 mark, QP p.3 / MS…" on screen (3 hits in src); narration has no paper ref | claimed ≥17.59 px, new per-frame `label-audit.cjs` | claimed per-frame (fails beat on any text <17 px / overlap); leaders under labels | claimed (B5 heads/water, tails/core + 2 s) | 008f branch only (**no A checkout of 008f**); v1 src at `/home/dachu/cloud-check/008a-final-review/work/4.1.1-2`; MP3s in git, WAV/MP4 not |
| 4.1.3 What each part does | `2887cc09-d18d-4bf9-96c7-ad9c649abf75` (v2, 008f, 602 s) — v1 `93f5b0ad-…` | Thandi | v1 CHANGES (5); **v2 UNREVIEWED**; all 5 claimed fixed | **FAIL** — B7 EXAM CONTRAST + B13 show "W22/23 Q6(a), MS p.19", "S23/21…" on screen (13 hits); narration says "…a June 2023 paper, sodium ions in March 2024" (beats 7, 13) | claimed | claimed | claimed (B4 oil/water re-voiced) | 008f only; v1 on A (008a-final-review) |
| 4.1.4 Cell signalling | `2aca389d-5b07-4072-a48d-c504b03b8ceb` (v2, 008f, 421 s) — v1 `a6abecc9-…` | Thandi | v1 CHANGES (5); **v2 UNREVIEWED**; all claimed fixed (ExoOutline secretion, 20 px, hook, slots, pad) | **FAIL** — B7 "W22/23 Q5(a)(i), MS p.17" and B9 "R24 p.21 (June 2024 P23 Q5(a))" on screen (11 hits); narration says "November 2022 asked why…" (beats 7, 9) | claimed | claimed | claimed (B5 letter/address/door) | 008f only; v1 on A |
| 4.2.1a Passive transport | `4221b6a9-03d9-4f5e-955d-0c09b6fe1514` (v2, 008f, 668 s) — v1 `53b658e0-…` | Thandi | v1 CHANGES (5); **v2 UNREVIEWED**; claimed fixed (continuous water crossing, 20 px, doorway hook, slots, pad) | **FAIL** — B10 shows "S23/21 Q3(a), 1 mark, MS p.11" AND a verbatim examiner-report quote ("Most incorrect answers stated that glucose was too large.", R23 p.12) (8 hits); narration says "The June 2023 report on this question says…", "A March 2024 question credited…" (beats 10, 14) | claimed | claimed | claimed (B8 wall/doorway) | 008f only; v1 on A |
| 4.2.1b Active + bulk transport | — not built | none | storyboard CLEARED, **reworded 27 Sep, re-checked 27 Sep** | storyboard OK | — | — | storyboard has no hook mention (author one if honest) | storyboard on A |
| 4.2.6 Water, plant + animal cells | — | none | CLEARED, reworded, re-checked | OK | — | — | — | storyboard on A |
| 4.2.2a Visking + agar | — | none | CLEARED, reworded, re-checked | OK | — | — | — | storyboard on A |
| 4.2.2b Plant tissue practicals | — | none | CLEARED, reworded, re-checked | OK | — | — | — | storyboard on A |
| 4.2.3-4 SA:V + agar cubes | — | none | CLEARED, reworded, re-checked | OK | — | — | — | storyboard on A |
| 4.2.5 Potato water potential | — | none | CLEARED, reworded, re-checked (3 accepted non-stem shingle matches) | OK | — | — | — | storyboard on A |

Shared kit: `work/t4-shared/` on 008f (FluidMosaicMembrane with literal SHARED-SPECS slots, DiffusionField, WaterPotentialModel, SignallingScene, VesicleTransport, CholesterolQualitative, fmm-selftest, CHANGELOG). 4.2.1b's opening recall needs this kit. The 008a copy on A is the OLD slot layout — do not build from it.

Storyboards for the four built T4 lessons are CLEARED but **not reworded** (REWORK rows "open"): any own-words fix must first reword B13 / B7+B13 / B7+B9 / B10+B14 in the storyboard, then re-voice those beats.

## 2. Topic 5 — lesson state (8 lessons, plan order)

| Lesson | Latest Bunny guid (version) | Voice | Review status | OWN | PX | OVL | HOOK | Files |
|---|---|---|---|---|---|---|---|---|
| 5.1.1 Inside a chromosome | `57fc3274-a85a-41dc-8db5-f40abc33dfd4` (v2, 009f, 404.5 s) — v1 `e45b3801-…`; discarded v2 `543e1b66-…` | Thandi | v1 CHANGES (4) → **v2 APPROVE** (Codex, before the own-words rule) | **FAIL** — B11 shows "s23_21 Q4(c)(i), QP p14 / MS p15", "w20_21…", "PDF-VERIFIED" (7 hits); narration clean per REWORK | verified 17.60 px min (3,477 frames) | sampled (every 0.5 s + cues), not every frame; no collisions found | verified (2.43 s hold) | 009f on A at `/home/dachu/cloud-check/009f-fix-4t1jp6/work/5.1.1`; also on 009g |
| 5.1.3 Mitotic cell cycle | `a869c16c-8337-49ae-a27d-c44751408203` (**v3**, 009g, 543 s) — v2 `da3aaf6e-…`, v1 `8d2edf6f-…` | Thandi | v1 CHANGES (3) → v2 CHANGES (1 new: crossfade collisions B8 04:12.8, B10 05:50.4) → **v3 UNREVIEWED**; v3 claims both + 2 more transitions fixed, every-frame audit (15,955 frames, opacity>0.02) | claimed in v3 (on-screen paper codes removed; MS credited wording kept, allowed); narration had none | verified (v2), claimed v3 min 17.60 | claimed v3 every-frame 0 overlaps | verified (2.375 s) | 009g only (**no A checkout**); v2 on A (009f) |
| 5.1.4 Telomeres | `2fddf183-8e38-4da9-9221-d556db7119fd` (**v3**, 009g, 270 s) — v2 `d6705b5e-…`, v1 `13c90983-…` | Thandi | v1 CHANGES (5) → v2 CHANGES (1 new: B6 transition collisions f4113, f5648–52) → **v3 UNREVIEWED**; v3 claims fixed + f4619 | claimed in v3 (B8 panels now "a real question…", no codes) | v3 min **17.01 px** — bare pass, worth a spot check | claimed every-frame | verified (2.373 s) | 009g only; v2 on A |
| 5.1.2 Why mitosis makes identical cells | `bb8b4308-95c1-4d19-912f-40f4c7561710` (**v1**, 009b, 405.6 s). v2 = 009g **checkpoint only**: hook re-voiced (Thandi), shared files re-synced, MitosisCellModel fixed (cytoParted, telophase containment) into t5-shared, text/overlap redesign, paper refs removed, new timeline 413.1 s — **not re-rendered, not verified, not uploaded**; partial audit 4,131 frames, 1 overlap still failing (B6 f7842 "growing tissues" vs comparison caption) | Thandi | v1 CHANGES: 2×P1 (cytokinesis count switches 20 frames late; chromosomes protrude through new envelopes), P2 219 sub-17 px failures (min 5.08 px) + collisions, P2 hook rushed/hold misplaced, P2 stale shared files, P3 audio tail. **All 6 open in delivered terms** | v1 FAIL (built before rule; REWORK narration beats 5, 10); v2 checkpoint claims on-screen clean, but narration B5/B10 still need reword + re-voice | v1 FAIL; v2 in progress (17.6 min so far) | v1 FAIL; v2 1 failure open | v1 FAIL (admitted phrase); v2 re-voiced, unverified | v1 on A (`cloud-check/009-5.1.2-to-5.1.6-rmr4ks`, at cb03eca0 — one commit behind tip); v2 checkpoint on 009g only |
| 5.1.5 Stem cells | `79ed9c00-0e3a-4959-88f2-b24ea9355163` (v1, 009b, 276 s) | Thandi | **UNREVIEWED** | **FAIL** — B8 "w22_13 Q20 … PDF-VERIFIED", Learner Guide p15 on screen; REWORK beat 8 | not audited; built on old kit with size-15 text, no floor → expect failures | none | FAIL (REPORT admits phrase; 2nd link unspoken; hold after sentence) | 009b on A |
| 5.1.6 Tumours | `6d679cd3-18f7-408f-9e64-d62597e0361c` (v1, 009b, 365 s) | Thandi | **UNREVIEWED**; REPORT asks conductor to listen to B8 "mass"/"mess" | **FAIL** — B7, B9 "w20_21 Q6(a)(i)…", "s24_23 Q5(d)…" on screen; REWORK beats 7, 9 | not audited; expect failures | none | FAIL (tap/drain unmapped) | 009b on A |
| 5.2.1 Chromosome behaviour in mitosis | — not built | none | CLEARED (re-checked 27 Sep, CHECK-R3), reworded; root-tip image resolved | OK | — | — | — | storyboard on A |
| 5.2.2 Identifying the stages | — not built | none | CLEARED (re-checked 27 Sep, CHECK-R3), reworded; Topic 1 microscope component name still open (ASSETS-NEEDED) | OK | — | — | — | storyboard on A |

Shared kit: `work/t5-shared/` on 009g is the current publisher (ChromosomeModel 124e4195…, CellCycleWheel 456fef65…, DNAContentGraph, T5Annot, TelomereEndModel, CountStrip, **MitosisCellModel** with the 5.1.2 P1 fixes). 009b's t5-shared and the 009f copy are stale. 5.2.1 and 5.2.2 must start from the 009g kit.

## 3. What is on A vs cloud-only

On A (detached worktrees under `/home/dachu/cloud-check/`): 008a (v1 T4 ×4), 009a (v1 5.1.1/5.1.3/5.1.4), 009b (v1 5.1.2/5.1.5/5.1.6, one commit behind), 009f (v2 5.1.1/5.1.3/5.1.4), reviews branch.
**Not on A:** `cloud/008f-fix-4prnob` (all four T4 v2 + current t4-shared) and `cloud/009g-fix-3a72s8` (5.1.3 v3, 5.1.4 v3, 5.1.2 v2 checkpoint, current t5-shared). Both are fetched into this repo's `origin/*`; the cockpit needs `git worktree add /home/dachu/cloud-check/008f origin/cloud/008f-fix-4prnob` and the same for 009g before any fix-in-place.
Per-beat narration MP3s and beat approvals are in git on every branch; WAV/MP4 masters and render caches are not. Any patch means a full re-render of that lesson on A (approvals stay valid while source fingerprints match).

## 4. Decision per lesson

Note on the T4 v2 builds: source text is clamped by `MIN_TEXT = 20` in `src/kit.tsx`, and `label-audit.cjs` runs per frame at the branded scale for both text size and leader/arrow crossings, so PX/OVL are structurally enforced there (claimed, not yet reviewer-verified).

Rule applied: Shava (Gemini `en-za-csagent-7`) for every fresh build; Thandi only for patches to lessons already voiced by Thandi. Fix in place when the latest upload is v2/v3 with a per-frame audit and only review + own-words remain. Rebuild fresh when the delivered build fails PX/OVL wholesale or was never audited.

| Lesson | Decision | Work |
|---|---|---|
| 4.2.1b, 4.2.6, 4.2.2a, 4.2.2b, 4.2.3-4, 4.2.5 | **Rebuild fresh, Shava** | full build from reworded storyboards + 008f t4-shared |
| 5.2.1, 5.2.2 | **Rebuild fresh, Shava** | full build from reworded storyboards + 009g t5-shared; 5.2.2 needs the Topic 1 microscope component name first |
| 5.1.5, 5.1.6 | **Rebuild fresh, Shava** | v1 unreviewed, old kit, unaudited text, phrase-only hooks, paper refs on screen; narration must change anyway (own words + hooks) — a Thandi patch would touch 3+ beats and still leave an unaudited kit. Reuse the storyboards after rewording B8 / B7+B9 |
| 5.1.2 | **Fix in place (Thandi)** — finish the 009g checkpoint | shared-model and text redesign are done; remaining: clear the one B6 overlap, reword B5/B10 exam narration (storyboard first) and re-voice those two beats with Thandi, re-render 10 beats, verify, brand, upload v2, Codex review |
| 5.1.3 v3, 5.1.4 v3 | **Fix in place — review only** | Codex re-review of `a869c16c…` and `2fddf183…` (own words, transitions, 5.1.4's 17.01 px margin). No render unless CHANGES |
| 5.1.1 v2 | **Fix in place (no voice)** | remove B11 on-screen paper codes (narration is clean), re-render, upload v3, Codex spot-review |
| 4.1.1-2 v2 | **Fix in place (no voice)** | Codex review of `1ab01c37…` first (v2 never reviewed); strip B13 on-screen "M24/22…" card text; re-render, v3 |
| 4.1.3 v2 | **Fix in place (Thandi patch)** | Codex review of v2; reword B7 + B13 (storyboard, screen, narration), Thandi re-voice 2 beats, re-render, v3 |
| 4.1.4 v2 | **Fix in place (Thandi patch)** | as above for B7 + B9 |
| 4.2.1a v2 | **Fix in place (Thandi patch)** | as above for B10 + B14 |

Trade-off to put to Durai: after this, Topic 4 = 4 Thandi + 6 Shava and Topic 5 = 4 Thandi + 4 Shava. That follows the standing voice rule (Thandi stays on voiced lessons). If he wants one voice per topic, the four T4 v2 lessons and 5.1.1–5.1.4 become Shava rebuilds instead (all storyboards exist; roughly +8 builds).

## 5. Build order on A (single render lock; 2–3 lessons per batch; Fable builders; Shava)

Batch 0 — prep, no render: cockpit adds worktrees for 008f and 009g; Codex reviews 5.1.3 v3, 5.1.4 v3, 4.1.1-2 v2, 4.1.3 v2, 4.1.4 v2, 4.2.1a v2 from Bunny (can run while batch 1 renders). Reword the exam-close beats of 4.1.3, 4.1.4, 4.2.1a, 5.1.2 in their storyboards (own-words check with the 7-word shingle scan).

| Batch | Fresh Shava builds (render-heavy) | Fix in place (short re-render) | Why this order |
|---|---|---|---|
| 1 | **4.2.1b**, **5.2.1** | **5.1.2** finish v2 | 4.2.1b is next in the T4 chain and needs only the 008f kit; 5.2.1 publishes the stage sequence 5.2.2 depends on; 5.1.2 is nearly done and unblocks the T5 shared kit |
| 2 | **4.2.6**, **5.2.2** | **4.1.3** patch | 4.2.6 is prerequisite (by label) to 4.2.2b and 4.2.5; 5.2.2 follows 5.2.1 (fix the microscope component name in batch 1) |
| 3 | **4.2.2a**, **5.1.5** (Shava rebuild) | **4.1.4** patch | practical lesson (longer render) paired with a short rebuild |
| 4 | **4.2.2b**, **5.1.6** (Shava rebuild) | **4.2.1a** patch | 4.2.2b recalls 4.2.6 |
| 5 | **4.2.3-4**, **4.2.5** | **4.1.1-2** + **5.1.1** on-screen-only patches | the two longest T4 lessons last; the two tiny patches fill the lock gaps |

Render budget (A, 12 cores): cloud ran ~3 s wall per rendered second on 4 vCPU; A should be ≥2× faster, so a 10-min lesson ≈ 15 min render, a patch re-render ≈ 10 min. Each batch ≈ 1.5–2 h of lock time including verify/brand/upload. Reviews (Codex) run off the lock.

Gate reminders for builders: per-frame label audit at opacity >0.02 (the 009g `verify-label-size.cjs` pattern), `verify_delivered.py` on the branded file, memory hook link-by-link + 2 s hold, own-words shingle scan on rendered text AND transcript, cues timed to measured speech onset, `REVIEW <code> vN <title>` upload titles, no collection until banked.

## Update 28 Sep (conductor, after Codex v2 reviews /tmp/review-t4-v2/, /tmp/review-t5/)
- All 4 T4 v2 = CHANGES (transition/label overlaps; 4.2.1a equality cue 0.53 s early). Text ≥17 px and picture≥audio pass.
- 4.1.1-2 narration names "March 2024 / Paper 22" → needs voice change → FULL Shava re-voice (policy: narration change ⇒ whole lesson Shava). So 4.1.1-2, 4.1.3, 4.1.4, 4.2.1a, 5.1.2 = own-words + overlap fixes + full Shava.
- 5.1.3, 5.1.4: overlap/leader fixes + own-words on-screen (5.1.4 verbatim MCQ option); take shared mitosis fix from 5.1.2; re-voice only if narration changes (then full Shava).
- 5.1.5, 5.1.6: rebuild fresh in Shava (batches 3/4).
