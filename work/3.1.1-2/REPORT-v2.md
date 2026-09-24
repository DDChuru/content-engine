# 3.1.1-2 · v2 FIX · Beat 18 has a visual on every frame

**Model:** claude-opus-5-5. Branch `cloud/003-3.1.1-2` only. VM was intact (no restore needed); the branding inputs were
re-checked-out from `origin/cloud/inputs-003` (not committed). Bookends reused unchanged (sha256 below).

## The defect (Durai)
Beat 18, master ≈14:03–14:24 (branded ≈14:08–14:29): ~20 s of a near-empty page, three small lines of the "how it is asked"
list top-left and no visual. VIDEO-STRUCTURE forbids a text-only frame.

## What changed (Beat 18 only; `src/beats/Beat18.tsx`; narration, audio, cues and timing FROZEN)
- **One model on screen for the whole beat** (same position as the lysozyme model of the second half, so it never leaves):
  - *draw labelled diagrams*: the substrate seats (motion) and the diagram is LABELLED in front of the student: enzyme →
    active site → substrate → enzyme–substrate complex (bracket); at *a label or annotation linking the drawing to the supplied
    example* the annotations "e.g. lysozyme / e.g. peptidoglycan" appear, tagged "annotation links the drawing to the example".
  - *describe and explain the mode of action*: the same model runs complex → products (one-frame outline switch, then drift) →
    "✓ enzyme unchanged", with a compact energy-profile inset ("lowers the activation energy"); at *laccase or its substrates* the
    annotation becomes "e.g. laccase", tagged "name the enzyme or its substrate".
  - *describe complementary shapes*: a fresh substrate sits above the cleft and both outlines are traced ("complementary in shape")
    while the ✗ same shape / ✓ complementary card lands.
- **The forms list is a compact card BESIDE the model** (left column, "HOW IT IS ASKED · two forms", with the MS citations and the
  wording-contrast card inside it) — never alone on the page. At *Here is the drawing question* it slides out and the verbatim
  question takes its place; the model stays, and the rest of the beat (5 s anchored read, credited points landing with the
  lysozyme labels, NAM/NAG, the bread inset, 2 s final hold) is as v1.
- MODEL tag visible on every frame of the beat.

## Verification (v2 master; PIPELINE-STANDARD §4 order, `qa/verification.json`)
Only Beat 18 re-rendered (`logs/chain-finish-v2.log`: "beat 18 exit 0"); `finish.py` confirmed all 18 chunks current.
1. ffprobe 900.133 s. 2. Video 900.133 ≥ encoded audio 899.133. 3. Full decode **0 errors**. 4. Cues **224/224** (exact, unique,
in order). 5. AAC packets identical (42,148). 6. Final word "substrate." ends 895.947 s, headroom 3.19 s. 7. Silent reads all-zero
PCM, −91 dB encoded (B5, B11, B14, B16, B18 read + END). 8. Boundaries: 17 tested, **0** one-frame-hold candidates.
**Every-frame marker audit:** 9,344 marked / 17,660 unmarked, **0 mismatches**, badge = COMMON MISTAKE (MAE ≤ 3.90; EXAM
CONTRAST ≥ 20.3). **Valence audit** (B9): 1,131 frames, all OK. Longest unchanged visual 11.5 s; none over 15 s.
**Beat 18 contact sheet from the ENCODED master** (`qa/beat18-v2-sheet-1.jpg`, `-2.jpg`, 23 frames every 2.5 s, plus
`qa/beat-18/sheet-*.jpg` per cue): LOOKED at — every frame 14:03–15:00 carries the model; no text-only frame remains.
**Branded:** 911.162 s = master + 11.029 s; full decode 0 errors; branded Beat 18 frame (`qa/branded-v2-b18.jpg`, 14:13 branded)
shows the labelled model beside the forms card inside the cream frame under the title bar.

## New files
| | Duration | SHA-256 |
|---|---|---|
| master `3.1.1-2-enzymes.mp4` (v2) | 900.133 s | `cb3ec73ae40b9cc846bf5947ad91ad553cf32b11d1df3a635e3f259984697596` |
| branded `3.1.1-2-enzymes-branded.mp4` (v2) | 911.162 s | `198b18c1ac15f6cc39af416a29e679a4c7aaf89ee8c32987a29ccc110e38176e` |
| intro bookend (reused) | 5.000 s | `29e59fd270fb1e00de826ced1d8af422bd56bb40b389c43958676e4959a64ad4` |
| outro bookend (reused) | 6.000 s | `7caa002f700e45bd4c9a77cc138059503883d949a25b48338fa0ccdc8adbf33d` |
v1 files kept locally as `…-SUPERSEDED-v1.mp4` (not in git).

## Bunny
New video **`a8f7f4ac-caac-4382-8730-d9e0100e6767`**, "REVIEW 3.1.1-2 Enzymes: where and how they act (v2)", **no collection**.
Create 200; PUT `curl -T` 200 (39,836,781 B) at 13:48:35Z; BUNNY_V2. The first REVIEW video
(`08c56c4e-3505-412c-af04-4175524e4a1b`) was not touched (still status 4). Nothing deleted or moved.
