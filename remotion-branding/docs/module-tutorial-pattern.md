# Module Tutorial Pattern

Status: default production pattern for short e-wizer module tutorials.

Reference implementation:

- Remotion composition: `src/cln/CleaningVerificationTutorialV2.tsx`
- Timing map: `src/cln/timing.json`
- Narration map: `src/cln/narration.json`
- Final compressed output: `../output/cln-verification-tutorial/e-wizerinspection-v2-small.mp4`

## Purpose

Each app module should have a short field-guide tutorial that users can watch independently and cross-reference while using that module in the app.

Target format:

- 2 to 4 minutes per module.
- 16:9, 1920x1080, 30 fps.
- One focused workflow, not a full app tour.
- A small compressed MP4 for distribution.
- Voice-led, with the phone journey always anchored on screen.

## Core Structure

Use this sequence unless the module needs a clear reason to differ:

1. **Open with the module promise.** State what the user will be able to complete by the end.
2. **Show how to enter the workflow.** If there is more than one valid entry point, show each path one at a time.
3. **Anchor the app journey.** Keep the phone/app screen visible as the constant reference point.
4. **Guide one action at a time.** Use step chips, progress count, and short explainer copy.
5. **Zoom only when precision matters.** The zoom must be centered on the target and large enough to read.
6. **Pause for concept breaks.** When the workflow depends on domain judgment, pause the app journey and explain the concept with real examples.
7. **Return to the journey.** After the concept break, continue the app task exactly where the user left off.
8. **Close the loop.** Finish by showing the proof or final state the user should expect.

The default layout is a field-guide stage:

- Left side: app/phone journey.
- Right side: explainer panel, proof panel, or concept break.
- Bottom or side: progress, task state, or evidence row when useful.

## Stepwise Workflow Rules

Do not skip navigation just because the destination screen is familiar.

For every module tutorial:

1. Start from the screen the user will actually be on.
2. Show the first tap target with an annotation rectangle.
3. Move to the next screen only after the narration names that action.
4. If there are two valid ways to start, show both separately:
   - first annotate the primary entry point;
   - then annotate the secondary entry point;
   - do not highlight both at the same time.
5. Do not collapse "tap button, scan, land on detail" into one beat when the workflow is being taught for the first time.
6. Keep the annotation rectangle on screen long enough for the user to identify the button before the transition.

For cleaning verification, this means:

- Show Home -> hero "Scan QR code" CTA.
- Then show the control-panel / floating-nav scan button as the second valid entry.
- Then show the scan screen and the zone QR frame.
- Then show the checked-in zone screen.

## Operational Nuance Rules

Every module tutorial must include the real exceptions that cause user confusion in the field.

When the app supports a scheduled path and an off-schedule path:

1. Show the normal scheduled path first.
2. Show the "nothing due" or "no tasks showing" state next.
3. Explain why that can happen using operational language: ad-hoc work, holiday work, booked extra shift, rescheduled clean, or a cadence that is not due today.
4. Show the app path that covers it.
5. State whether the user is required to complete everything on that screen.
6. Show one captured example so the exception does not feel theoretical.

For cleaning verification, "Due" is the scheduled path and "Off-schedule" is the ad-hoc capture path. The tutorial must say that off-schedule work records what was actually done outside today's schedule, and that nothing in that view is forced.

## Concept Break Pattern

Use this for sections like severity grading, compliance status, evidence quality, or corrective actions.

1. Pause the user journey.
2. Say the bridge line in plain operational language, for example: "This is exactly the way you are used to grading findings."
3. Use the app code or product source of truth for labels and definitions.
4. Show real module-specific scenarios, not abstract illustrations.
5. Let each scenario image enter large first, then settle into the matching taxonomy row or proof block.
6. Keep the final taxonomy visible long enough for comparison.
7. Resume the workflow with the same app state on screen.

For a 1/2/3 grading model:

- 1 enters large, then lands on row 1.
- 2 enters large, then lands on row 2.
- 3 enters large, then lands on row 3.
- The final frame shows all three rows with their images in place.

## Source Of Truth

Do not invent operational wording when the app already defines it.

Before writing a script:

1. Inspect the app code for labels, helper text, enum values, and validation copy.
2. Copy exact definitions where possible.
3. Only simplify wording when voiceover clarity requires it.
4. Keep the original meaning intact.
5. Add generated or captured scenario images that match the domain wording.

The cleaning verification severity guide used the React Native source definitions for Minor, Major, and Critical before writing the narration.

## Asset Rules

Use module-specific folders under `public/`:

- `public/<module>-tutorial/shots/` for app screenshots and stills.
- `public/<module>-tutorial/audio/` for generated voiceover.
- `public/<module>-tutorial/*.png` or `.jpg` for scenario, proof, and concept images.

In Remotion code:

- Use `staticFile()` for all local assets.
- Use Remotion `<Img>` for images.
- Use Remotion audio primitives for voiceover.
- Avoid CSS `background-image` for content images.

## Timing And Narration

Keep timing data outside the component where possible:

- `narration.json` stores the script, voice settings, and audio filenames.
- `timing.json` stores measured clip durations, `voStart`, total seconds, and `total_frames`.
- Beat names should match between narration, timing, and component code.
- When adding a new beat, shift later `voStart` values deliberately.
- Re-render after audio changes and confirm the final duration with `ffprobe`.

## Animation Rules

All animation must be deterministic and frame-based:

- Drive animation with `useCurrentFrame()`.
- Convert seconds using `fps` from `useVideoConfig()`.
- Use `interpolate()` with clamped extrapolation for fades, movement, and zoom.
- Use `spring()` for natural entrances when useful.
- Do not use CSS transitions, CSS animations, or Tailwind animation classes.
- Always verify zoom framing with stills, especially on explainer-side focus panels.

## Visual Language

Keep the style consistent across module tutorials:

- Dark field-guide stage.
- App screen as the stable user journey anchor.
- Concise explainer panels.
- Large centered zooms for exact UI targets.
- Real scenario images for operational judgment.
- Proof blocks for final evidence, status, QR code, photos, or completion records.
- Strong close that shows the final user-facing outcome.

## Verification Checklist

Before calling a tutorial final:

1. Render key stills for every zoom and concept break.
2. Check that focus boxes and zoom crops are centered on the intended UI target.
3. Create a contact sheet from the compressed MP4.
4. Watch the final concept break at normal speed.
5. Confirm voiceover sync after any timing edit.
6. Run `ffprobe` on the compressed output for duration, codec, and size.
7. Keep original source videos untouched unless the requested output is explicitly a replacement.

## New Track Checklist

For the next module tutorial:

1. Map the user journey into 12 to 18 beats.
2. Capture the app screens needed for each beat.
3. Extract labels, definitions, and rules from the app code.
4. Write the voiceover script in beat order.
5. Generate or record voiceover and measure durations.
6. Build `narration.json` and `timing.json`.
7. Add any concept break with real module-specific images.
8. Render stills for review.
9. Render the full video.
10. Compress to a small MP4.
11. Create a contact sheet for final inspection.

## Naming

Recommended composition names:

- `<ModuleName>TutorialV2` for an improved tutorial on an existing module.
- `<TrackName>FieldGuide` for a reusable cross-module walkthrough style.

Recommended output path:

- `../output/<track>/<module>-tutorial-v2-small.mp4`
