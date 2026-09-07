# Using calculus in 1D — production storyboard

M4.2. Source ceiling: FRAME-LOG.md, commit 59e0170. All scenes map to source frames below. The two short source calculations are retained as requested; the NOTES-only companion problem is excluded. Target 4:30–6:00; audio determines final duration.

Read TEACHING-STANDARD.md §§1–14 and PACING.md. Graphs follow the approved DrawingTravelGraphs stroke/area/tracing-dot style; neutral surfaces plus teal accent. One header and at most two content regions. A problem card replaces paper until setup is complete; every given stays on the diagram throughout working. No text-only scene: even opening/recap captions retain a motion-curve motif.

Syllabus quotation, split across consecutive cards: “use differentiation and integration with respect to time to solve simple problems concerning displacement, velocity and acceleration” (official 2026–2027 syllabus p.32; verified local PDF text). Outcomes, repeated verbatim with ticks: Differentiate motion functions. / Find integration constants. / Read a signed journey.

Narration below is authoritative. Each beat is separately voiced with gYWKdgLtqjPO3D5uDrDP; speed 0.9 slow / 1.0 brisk. `hold` inserts exact PCM silence; all drawing freezes during it. Each beat gets local Whisper word timestamps; beat cues use its first transcribed word. `target` identifies the on-diagram source to ring at every spoken numeric/variable word and while substituted ink is written. `page` changes paper only at a new spoken method, preserving the active method formula through its substitutions. Curves finish displacement before velocity appears beside it. The 3-second check has no reveal until the answer cue.

## S01 — Syllabus 4.2: calculus in motion

tempo: brisk / voiceSpeed: 1.0 / source: f045–f080; syllabus p.32

- **quote1**: Syllabus four point two: use differentiation and integration with respect to time.
- **quote2**: To solve simple problems concerning displacement, velocity and acceleration.
- **outcome1**: By the end you can differentiate motion functions.
- **outcome2**: Find integration constants.
- **outcome3**: And read a signed journey.

## S02 — How calculus connects motion

tempo: brisk / voiceSpeed: 1.0 / source: f006–f080

- **velocity**: Velocity is displacement changing with time: d s by d t. → ink: `v = ds/dt` (page 0)
- **acceleration**: Acceleration is velocity changing with time: d v by d t. → ink: `a = dv/dt` (page 0)
- **integrate**: Reverse by integration: integrate acceleration for velocity, velocity for displacement. → ink: `v = ∫a dt    s = ∫v dt` (page 0)
- **contrast**: A curved velocity graph has changing acceleration. Constant acceleration formulae fail.

## S03 — Find both integration constants

tempo: slow / voiceSpeed: 0.9 / source: f057–f124

- **story**: Consider a trolley speeding up to the right. Find its velocity and position.
- **given-a**: Right is positive. Acceleration is six t plus two metres per second squared.
- **given-v**: Initially its velocity is four metres per second.
- **given-s**: It starts one metre right of the origin: s at zero is positive one. [hold 2 s]
- **formula-v**: Velocity is the integral of acceleration. → ink: `v = ∫a dt` (page 0)
- **integral-v**: Integrating six t plus two gives three t squared plus two t plus C. → ink: `v = 3t² + 2t + C` (page 0)
- **constant-v**: Use the initial velocity: four equals C. [hold 2 s] → ink: `4 = C` (page 0)
- **formula-s**: Displacement is the integral of velocity. → ink: `s = ∫v dt` (page 1)
- **integral-s**: Integrating gives t cubed plus t squared plus four t plus D. → ink: `s = t³ + t² + 4t + D` (page 1)
- **constant-s**: At zero, s is positive one, so D equals one. [hold 2 s] → ink: `D = 1` (page 1)
- **what-if**: Start on the negative side instead? D becomes minus one; velocity stays unchanged.

## S04 — Follow the particle first

tempo: brisk / voiceSpeed: 1.0 / source: f236–f320

- **outward**: Consider a particle leaving the origin, moving right. It slows down as it travels.
- **turn**: It stops for an instant, then turns back. Its velocity becomes negative.
- **return**: It returns to the origin and stops again. We will find when it turns, and how far it travels.

## S05 — Rest and acceleration

tempo: slow / voiceSpeed: 0.9 / source: f236–f262

- **given-poly**: Velocity is three t squared minus twelve t plus nine metres per second.
- **given-range**: Use zero to three seconds.
- **given-origin**: Initially s is zero. Find the first rest time and acceleration. [hold 2 s]
- **rest-formula**: Instantaneous rest means velocity equals zero. → ink: `v = 0` (page 0)
- **rest-sub**: Substitute the given velocity: three t squared minus twelve t plus nine equals zero. → ink: `3t² - 12t + 9 = 0` (page 0)
- **factor**: Factorise: three times t minus one times t minus three equals zero. → ink: `3(t - 1)(t - 3) = 0` (page 0)
- **roots**: Rest at one and three seconds; first at one. [hold 2 s] → ink: `t = 1 s  or  3 s` (page 0)
- **accel-formula**: For acceleration, differentiate velocity. A equals d v by d t. → ink: `a = dv/dt` (page 1)
- **accel-result**: This gives six t minus twelve metres per second squared. Acceleration changes with time. [hold 2 s] → ink: `a = 6t - 12 m s⁻²` (page 1)

## S06 — Displacement and its graph

tempo: slow / voiceSpeed: 0.9 / source: f263–f294

- **setup**: Find displacement and sketch its graph, using the same givens. [hold 2 s]
- **formula**: Displacement is the integral of velocity. → ink: `s = ∫v dt` (page 0)
- **sub**: Substitute three t squared minus twelve t plus nine. → ink: `s = ∫(3t² - 12t + 9) dt` (page 0)
- **integral**: Integrating term by term gives t cubed minus six t squared plus nine t plus C. → ink: `s = t³ - 6t² + 9t + C` (page 0)
- **constant**: At time zero, displacement is zero, so C is zero. Show this step. [hold 2 s] → ink: `0 = C` (page 0)
- **graph-out**: Now the displacement time graph. It rises from zero to four metres as the particle moves right.
- **graph-back**: Then it falls to zero as the particle returns. The horizontal tangents mark the two instants of rest. [hold 2 s]

## S07 — Read velocity, then count both legs

tempo: slow / voiceSpeed: 0.9 / source: f286–f320

- **velocity**: Now the velocity time graph: nine initially, zero at one second and three seconds.
- **area-formula**: Signed displacement is the integral of velocity. Distance adds leg magnitudes. → ink: `Δs = ∫v dt` (page 0)
- **out-eval**: For the outward leg, evaluate t cubed minus six t squared plus nine t, from zero to one. → ink: `Δs₁ = [t³ - 6t² + 9t]₀¹` (page 0)
- **out-result**: That gives four metres out. [hold 2 s] → ink: `Δs₁ = 4 m` (page 0)
- **back-eval**: For the return leg, evaluate the same expression from one to three. → ink: `Δs₂ = [t³ - 6t² + 9t]₁³` (page 0)
- **back-result**: Minus four metres: the particle travels back. [hold 2 s] → ink: `Δs₂ = -4 m` (page 0)
- **distance-formula**: Distance equals the magnitude of the first displacement plus the magnitude of the second. → ink: `distance = |Δs₁| + |Δs₂|` (page 1)
- **distance-result**: Four plus the magnitude of minus four gives eight metres. Net displacement is zero. [hold 2 s] → ink: `distance = 4 + |-4| = 8 m` (page 1)
- **average-formula**: Average speed equals distance divided by time. → ink: `average speed = distance / time` (page 2)
- **average-result**: Eight divided by three is two point six seven metres per second. [hold 2 s] → ink: `8/3 = 2.67 m s⁻¹` (page 2)
- **average-velocity**: Average velocity uses displacement over time, so it is zero. → ink: `average velocity = Δs / time` (page 2)

## S08 — Check maximum speed

tempo: brisk / voiceSpeed: 1.0 / source: f129–f175; f321–f345

- **rule**: For maximum speed, compare velocity magnitudes at stationary velocity points and endpoints.
- **stationary**: Here, acceleration equals zero at two seconds, where velocity is minus three.
- **question**: Is that the maximum speed? Compare it with the endpoints. [hold 3 s]
- **answer**: No. Compare speeds: nine initially, three at the stationary point, zero finally. Maximum speed: nine metres per second. [hold 2 s]
- **outcome1**: You can now differentiate motion functions.
- **outcome2**: Find integration constants.
- **outcome3**: And read a signed journey.

## Production data

```json
{
  "project": "mechanics-using-calculus-in-1d",
  "prefix": "using-calculus-in-1d",
  "scenes": [
    {
      "id": "s01",
      "title": "Syllabus 4.2: calculus in motion",
      "mode": "opening",
      "source": "f045–f080; syllabus p.32",
      "tempo": "brisk",
      "voiceSpeed": 1.0,
      "beats": [
        {
          "id": "quote1",
          "text": "Syllabus four point two: use differentiation and integration with respect to time.",
          "hold": 0,
          "caption": "use differentiation and integration with respect to time"
        },
        {
          "id": "quote2",
          "text": "To solve simple problems concerning displacement, velocity and acceleration.",
          "hold": 0,
          "caption": "to solve simple problems concerning displacement, velocity and acceleration"
        },
        {
          "id": "outcome1",
          "text": "By the end you can differentiate motion functions.",
          "hold": 0,
          "caption": "Differentiate motion functions."
        },
        {
          "id": "outcome2",
          "text": "Find integration constants.",
          "hold": 0,
          "caption": "Find integration constants."
        },
        {
          "id": "outcome3",
          "text": "And read a signed journey.",
          "hold": 0,
          "caption": "Read a signed journey."
        }
      ]
    },
    {
      "id": "s02",
      "title": "How calculus connects motion",
      "mode": "chain",
      "source": "f006–f080",
      "tempo": "brisk",
      "voiceSpeed": 1.0,
      "beats": [
        {
          "id": "velocity",
          "text": "Velocity is displacement changing with time: d s by d t.",
          "hold": 0,
          "ink": "v = ds/dt",
          "page": 0,
          "target": "chain"
        },
        {
          "id": "acceleration",
          "text": "Acceleration is velocity changing with time: d v by d t.",
          "hold": 0,
          "ink": "a = dv/dt",
          "page": 0,
          "target": "chain"
        },
        {
          "id": "integrate",
          "text": "Reverse by integration: integrate acceleration for velocity, velocity for displacement.",
          "hold": 0,
          "ink": "v = ∫a dt    s = ∫v dt",
          "page": 0,
          "target": "chain"
        },
        {
          "id": "contrast",
          "text": "A curved velocity graph has changing acceleration. Constant acceleration formulae fail.",
          "hold": 0,
          "caption": "Changing gradient means changing acceleration."
        }
      ]
    },
    {
      "id": "s03",
      "title": "Find both integration constants",
      "mode": "constants",
      "source": "f057–f124",
      "tempo": "slow",
      "voiceSpeed": 0.9,
      "beats": [
        {
          "id": "story",
          "text": "Consider a trolley speeding up to the right. Find its velocity and position.",
          "hold": 0
        },
        {
          "id": "given-a",
          "text": "Right is positive. Acceleration is six t plus two metres per second squared.",
          "hold": 0,
          "target": "given-a"
        },
        {
          "id": "given-v",
          "text": "Initially its velocity is four metres per second.",
          "hold": 0,
          "target": "given-v"
        },
        {
          "id": "given-s",
          "text": "It starts one metre right of the origin: s at zero is positive one.",
          "hold": 2,
          "target": "given-s"
        },
        {
          "id": "formula-v",
          "text": "Velocity is the integral of acceleration.",
          "hold": 0,
          "ink": "v = ∫a dt",
          "page": 0,
          "target": "given-a"
        },
        {
          "id": "integral-v",
          "text": "Integrating six t plus two gives three t squared plus two t plus C.",
          "hold": 0,
          "ink": "v = 3t² + 2t + C",
          "page": 0,
          "target": "given-a"
        },
        {
          "id": "constant-v",
          "text": "Use the initial velocity: four equals C.",
          "hold": 2,
          "ink": "4 = C",
          "page": 0,
          "target": "given-v"
        },
        {
          "id": "formula-s",
          "text": "Displacement is the integral of velocity.",
          "hold": 0,
          "ink": "s = ∫v dt",
          "page": 1,
          "target": "result-v"
        },
        {
          "id": "integral-s",
          "text": "Integrating gives t cubed plus t squared plus four t plus D.",
          "hold": 0,
          "ink": "s = t³ + t² + 4t + D",
          "page": 1,
          "target": "result-v"
        },
        {
          "id": "constant-s",
          "text": "At zero, s is positive one, so D equals one.",
          "hold": 2,
          "ink": "D = 1",
          "page": 1,
          "target": "given-s"
        },
        {
          "id": "what-if",
          "text": "Start on the negative side instead? D becomes minus one; velocity stays unchanged.",
          "hold": 0,
          "target": "given-s",
          "caption": "Position needs a stated sign."
        }
      ]
    },
    {
      "id": "s04",
      "title": "Follow the particle first",
      "mode": "story",
      "source": "f236–f320",
      "tempo": "brisk",
      "voiceSpeed": 1.0,
      "beats": [
        {
          "id": "outward",
          "text": "Consider a particle leaving the origin, moving right. It slows down as it travels.",
          "hold": 0
        },
        {
          "id": "turn",
          "text": "It stops for an instant, then turns back. Its velocity becomes negative.",
          "hold": 0
        },
        {
          "id": "return",
          "text": "It returns to the origin and stops again. We will find when it turns, and how far it travels.",
          "hold": 0
        }
      ]
    },
    {
      "id": "s05",
      "title": "Rest and acceleration",
      "mode": "rest",
      "source": "f236–f262",
      "tempo": "slow",
      "voiceSpeed": 0.9,
      "beats": [
        {
          "id": "given-poly",
          "text": "Velocity is three t squared minus twelve t plus nine metres per second.",
          "hold": 0,
          "target": "given-poly"
        },
        {
          "id": "given-range",
          "text": "Use zero to three seconds.",
          "hold": 0,
          "target": "given-range"
        },
        {
          "id": "given-origin",
          "text": "Initially s is zero. Find the first rest time and acceleration.",
          "hold": 2,
          "target": "given-origin"
        },
        {
          "id": "rest-formula",
          "text": "Instantaneous rest means velocity equals zero.",
          "hold": 0,
          "ink": "v = 0",
          "page": 0,
          "target": "given-poly"
        },
        {
          "id": "rest-sub",
          "text": "Substitute the given velocity: three t squared minus twelve t plus nine equals zero.",
          "hold": 0,
          "ink": "3t² - 12t + 9 = 0",
          "page": 0,
          "target": "given-poly"
        },
        {
          "id": "factor",
          "text": "Factorise: three times t minus one times t minus three equals zero.",
          "hold": 0,
          "ink": "3(t - 1)(t - 3) = 0",
          "page": 0,
          "target": "given-poly"
        },
        {
          "id": "roots",
          "text": "Rest at one and three seconds; first at one.",
          "hold": 2,
          "ink": "t = 1 s  or  3 s",
          "page": 0,
          "target": "given-range"
        },
        {
          "id": "accel-formula",
          "text": "For acceleration, differentiate velocity. A equals d v by d t.",
          "hold": 0,
          "ink": "a = dv/dt",
          "page": 1,
          "target": "given-poly"
        },
        {
          "id": "accel-result",
          "text": "This gives six t minus twelve metres per second squared. Acceleration changes with time.",
          "hold": 2,
          "ink": "a = 6t - 12 m s⁻²",
          "page": 1,
          "target": "given-poly"
        }
      ]
    },
    {
      "id": "s06",
      "title": "Displacement and its graph",
      "mode": "displacement",
      "source": "f263–f294",
      "tempo": "slow",
      "voiceSpeed": 0.9,
      "beats": [
        {
          "id": "setup",
          "text": "Find displacement and sketch its graph, using the same givens.",
          "hold": 2,
          "target": "given-origin"
        },
        {
          "id": "formula",
          "text": "Displacement is the integral of velocity.",
          "hold": 0,
          "ink": "s = ∫v dt",
          "page": 0,
          "target": "given-poly"
        },
        {
          "id": "sub",
          "text": "Substitute three t squared minus twelve t plus nine.",
          "hold": 0,
          "ink": "s = ∫(3t² - 12t + 9) dt",
          "page": 0,
          "target": "given-poly"
        },
        {
          "id": "integral",
          "text": "Integrating term by term gives t cubed minus six t squared plus nine t plus C.",
          "hold": 0,
          "ink": "s = t³ - 6t² + 9t + C",
          "page": 0,
          "target": "given-poly"
        },
        {
          "id": "constant",
          "text": "At time zero, displacement is zero, so C is zero. Show this step.",
          "hold": 2,
          "ink": "0 = C",
          "page": 0,
          "target": "given-origin"
        },
        {
          "id": "graph-out",
          "text": "Now the displacement time graph. It rises from zero to four metres as the particle moves right.",
          "hold": 0,
          "target": "s-four"
        },
        {
          "id": "graph-back",
          "text": "Then it falls to zero as the particle returns. The horizontal tangents mark the two instants of rest.",
          "hold": 2,
          "target": "s-zero"
        }
      ]
    },
    {
      "id": "s07",
      "title": "Read velocity, then count both legs",
      "mode": "distance",
      "source": "f286–f320",
      "tempo": "slow",
      "voiceSpeed": 0.9,
      "beats": [
        {
          "id": "velocity",
          "text": "Now the velocity time graph: nine initially, zero at one second and three seconds.",
          "hold": 0,
          "target": "given-poly"
        },
        {
          "id": "area-formula",
          "text": "Signed displacement is the integral of velocity. Distance adds leg magnitudes.",
          "hold": 0,
          "ink": "Δs = ∫v dt",
          "page": 0,
          "target": "given-poly"
        },
        {
          "id": "out-eval",
          "text": "For the outward leg, evaluate t cubed minus six t squared plus nine t, from zero to one.",
          "hold": 0,
          "ink": "Δs₁ = [t³ - 6t² + 9t]₀¹",
          "page": 0,
          "target": "leg-out"
        },
        {
          "id": "out-result",
          "text": "That gives four metres out.",
          "hold": 2,
          "ink": "Δs₁ = 4 m",
          "page": 0,
          "target": "leg-out"
        },
        {
          "id": "back-eval",
          "text": "For the return leg, evaluate the same expression from one to three.",
          "hold": 0,
          "ink": "Δs₂ = [t³ - 6t² + 9t]₁³",
          "page": 0,
          "target": "leg-back"
        },
        {
          "id": "back-result",
          "text": "Minus four metres: the particle travels back.",
          "hold": 2,
          "ink": "Δs₂ = -4 m",
          "page": 0,
          "target": "leg-back"
        },
        {
          "id": "distance-formula",
          "text": "Distance equals the magnitude of the first displacement plus the magnitude of the second.",
          "hold": 0,
          "ink": "distance = |Δs₁| + |Δs₂|",
          "page": 1,
          "target": "areas"
        },
        {
          "id": "distance-result",
          "text": "Four plus the magnitude of minus four gives eight metres. Net displacement is zero.",
          "hold": 2,
          "ink": "distance = 4 + |-4| = 8 m",
          "page": 1,
          "target": "areas"
        },
        {
          "id": "average-formula",
          "text": "Average speed equals distance divided by time.",
          "hold": 0,
          "ink": "average speed = distance / time",
          "page": 2,
          "target": "areas"
        },
        {
          "id": "average-result",
          "text": "Eight divided by three is two point six seven metres per second.",
          "hold": 2,
          "ink": "8/3 = 2.67 m s⁻¹",
          "page": 2,
          "target": "areas"
        },
        {
          "id": "average-velocity",
          "text": "Average velocity uses displacement over time, so it is zero.",
          "hold": 0,
          "ink": "average velocity = Δs / time",
          "page": 2,
          "target": "s-zero"
        }
      ]
    },
    {
      "id": "s08",
      "title": "Check maximum speed",
      "mode": "maximum",
      "source": "f129–f175; f321–f345",
      "tempo": "brisk",
      "voiceSpeed": 1.0,
      "beats": [
        {
          "id": "rule",
          "text": "For maximum speed, compare velocity magnitudes at stationary velocity points and endpoints.",
          "hold": 0,
          "caption": "Compare |v|: stationary points and endpoints."
        },
        {
          "id": "stationary",
          "text": "Here, acceleration equals zero at two seconds, where velocity is minus three.",
          "hold": 0,
          "target": "candidate-mid"
        },
        {
          "id": "question",
          "text": "Is that the maximum speed? Compare it with the endpoints.",
          "hold": 3,
          "caption": "Is the stationary value the maximum speed?"
        },
        {
          "id": "answer",
          "text": "No. Compare speeds: nine initially, three at the stationary point, zero finally. Maximum speed: nine metres per second.",
          "hold": 2,
          "target": "candidates"
        },
        {
          "id": "outcome1",
          "text": "You can now differentiate motion functions.",
          "hold": 0,
          "caption": "✓ Differentiate motion functions."
        },
        {
          "id": "outcome2",
          "text": "Find integration constants.",
          "hold": 0,
          "caption": "✓ Find integration constants."
        },
        {
          "id": "outcome3",
          "text": "And read a signed journey.",
          "hold": 0,
          "caption": "✓ Read a signed journey."
        }
      ]
    }
  ]
}
```

## Stage 1 verification

Final measured audio: 349.257142 s (5:49.26), eight scenes. Local faster-whisper-small CPU transcription resolved all 57 beat cues; 129 spoken figure events point to unedited word timestamps. `verify-calculus-cues.py` verifies every audio SHA-256, voice/speed, cue window, pen window and the near-silent PCM interior of every inserted hold. Whisper's mathematical spellings (for example “60” for “six t”) remain verbatim in the word list; diagram semantics are explicitly mapped by beat. `verify-calculus-maths.py` independently checks both recorded examples and the endpoint maximum-speed test.
