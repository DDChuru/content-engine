# Deriving the suvat formulae — production storyboard

M4.2. Source ceiling: FRAME-LOG.md at 4b24980. Requested route: velocity–time graph and substitution; the ancillary integration route and numerical illustration are excluded. Target 4:30–6:00. TEACHING-STANDARD.md §§1–14 and PACING.md bind.

Syllabus quotation (official p.32, verified local PDF text): “use appropriate formulae for motion with constant acceleration in a straight line.” Split into two lines on the opening card, beside a graph motif. Outcomes repeated verbatim with ticks: Derive from gradient and area. / Create the other equations. / Choose an equation.

A moving trolley tells the story first, before any graph or working. The complete symbolic problem then appears on a compact three-line card beside the graph. Every given stays on the graph: u, v in m s⁻¹; t in s; a constant in m s⁻²; s in m. Right is positive. The paper replaces the problem card when working starts. At most three regions including the single header. The shaded trapezium, rise/run guides and tracing dot retain the approved Sol graph style, with a single teal accent.

Every derivation opens with its general graph/formula line, then proceeds one handwritten line per narrated beat. The formula stays visible during the substitutions. The time-free derivation keeps its starting formula and all six handwritten lines visible on one paper page. The zero-acceleration caveat is explicit. Spoken variable/figure highlights use local Whisper timestamps; substituted expressions ring their graph source. The final check has three seconds of inserted silence before its answer. Silence is inserted in PCM, with all visuals frozen during holds.

Voice gYWKdgLtqjPO3D5uDrDP, speed 0.9 for slow scenes / 1.0 for brisk scenes. Production data below is authoritative for narration and cues.

## S01 — Syllabus 4.2: constant acceleration

tempo: brisk / voiceSpeed: 1.0 / source: f007–f065; syllabus p.32

- **quote1**: Syllabus four point two: use appropriate formulae for motion.
- **quote2**: With constant acceleration in a straight line.
- **outcome1**: By the end you can derive from gradient and area.
- **outcome2**: Create the other equations.
- **outcome3**: And choose an equation.

## S02 — Picture constant acceleration

tempo: brisk / voiceSpeed: 1.0 / source: f007–f023

- **story**: Consider a trolley moving along a straight track. It is already moving, and gains the same amount of velocity each second.
- **accelerate**: Watch it cover more ground in equal times. Its acceleration is constant.
- **contrast**: If those velocity gains changed, the acceleration would vary. These formulae would no longer describe the whole interval.

## S03 — Derive velocity from gradient

tempo: slow / voiceSpeed: 0.9 / source: f026–f095

- **setup**: Now the velocity time graph: start at u, finish at v, after time t.
- **givens**: Choose right as positive. Acceleration a is constant. Displacement s is the signed area. Derive the final velocity. [hold 2 s]
- **formula**: Acceleration equals gradient: change in velocity divided by elapsed time. → ink: `a = Δv/Δt`
- **rise**: The change in velocity is final minus initial: v minus u. The elapsed time is t. → ink: `a = (v - u)/t`
- **multiply**: Multiply both sides by t. That gives a t equals v minus u. [hold 2 s] → ink: `at = v - u`
- **result**: Add u. V equals u plus a t: initial velocity plus the change. [hold 2 s] → ink: `v = u + at`
- **why**: A constant gradient is why the graph is straight. This equation tells us how much the velocity changes.

## S04 — Derive displacement from area

tempo: slow / voiceSpeed: 0.9 / source: f096–f118

- **setup**: Now find the displacement over the same interval. Keep the endpoint velocities and time on the graph. [hold 2 s]
- **area**: Displacement equals signed area under the velocity time graph. Here that shape is a trapezium. → ink: `s = signed area`
- **formula**: Trapezium area is half the sum of the parallel sides, multiplied by the perpendicular width. → ink: `area = ½(u + v)t`
- **sides**: The parallel sides are u and v. The width between them is t. The sloping edge is not a parallel side. [hold 2 s]
- **result**: So displacement equals half u plus v, multiplied by t. [hold 2 s] → ink: `s = ½(u + v)t`
- **meaning**: This is average velocity times time. If the graph goes below the time axis, that area contributes negative displacement.

## S05 — Remove final velocity

tempo: slow / voiceSpeed: 0.9 / source: f119–f140

- **setup**: Now create the other equations. First, remove final velocity. [hold 2 s]
- **formula**: Start with displacement equals half u plus v, times t. → ink: `s = ½(u + v)t`
- **replace**: Replace v with u plus a t from the gradient equation. Keep the brackets. → ink: `s = ½(u + (u + at))t`
- **collect**: Collect the two u terms inside: half of two u plus a t, all multiplied by t. [hold 2 s] → ink: `s = ½(2u + at)t`
- **result**: Expand. Half times two u times t is u t. The other term is half a t squared. [hold 2 s] → ink: `s = ut + ½at²`
- **meaning**: Use this form when initial velocity, acceleration and time are known. You do not need final velocity.

## S06 — Remove initial velocity

tempo: slow / voiceSpeed: 0.9 / source: f141–f153

- **setup**: If final velocity is known instead, remove initial velocity. [hold 2 s]
- **formula**: Begin again with the trapezium result. → ink: `s = ½(u + v)t`
- **rearrange**: Rearrange v equals u plus a t: u equals v minus a t. → ink: `u = v - at`
- **substitute**: Substitute that expression for u. → ink: `s = ½((v - at) + v)t`
- **collect**: Collect terms: half of two v minus a t, multiplied by t. → ink: `s = ½(2v - at)t`
- **result**: Expand to get v t minus half a t squared. The minus sign comes from replacing u by v minus a t. [hold 2 s] → ink: `s = vt - ½at²`

## S07 — Remove time

tempo: slow / voiceSpeed: 0.9 / source: f154–f176

- **setup**: To remove time, first assume acceleration is nonzero. [hold 2 s]
- **formula**: Begin with the area formula. → ink: `s = ½(u + v)t`
- **time**: From v equals u plus a t, time equals v minus u divided by a. → ink: `t = (v - u)/a`
- **substitute**: Substitute that fraction for time in the area equation. → ink: `s = ½(u + v)(v - u)/a`
- **multiply**: Multiply both sides by two a. → ink: `2as = (u + v)(v - u)`
- **squares**: The product is a difference of squares: v squared minus u squared. [hold 2 s] → ink: `2as = v² - u²`
- **result**: Add u squared. We obtain v squared equals u squared plus two a s. [hold 2 s] → ink: `v² = u² + 2as`
- **zero**: If acceleration is zero, v equals u, so the final identity still holds. Only the division step required nonzero acceleration.

## S08 — Choose the equation you need

tempo: brisk / voiceSpeed: 1.0 / source: f169–f176; f250–f272

- **rule**: Choose the equation that omits the quantity you do not need.
- **missing-s**: No displacement? Use v equals u plus a t.
- **missing-a**: No acceleration? Use the trapezium equation.
- **missing-v**: No final velocity? Use u t plus half a t squared.
- **missing-u**: No initial velocity? Use v t minus half a t squared.
- **question**: Check: you know u, a and s. Find v without time. Which equation? [hold 3 s]
- **answer**: V squared equals u squared plus two a s. Time is the missing letter. [hold 2 s]
- **outcome1**: You can derive from gradient and area.
- **outcome2**: Create the other equations.
- **outcome3**: And choose an equation.

## Production data

```json
{
  "project": "mechanics-deriving-the-suvat-formulae",
  "prefix": "deriving-suvat",
  "scenes": [
    {
      "id": "s01",
      "title": "Syllabus 4.2: constant acceleration",
      "mode": "opening",
      "source": "f007–f065; syllabus p.32",
      "tempo": "brisk",
      "voiceSpeed": 1.0,
      "beats": [
        {
          "id": "quote1",
          "text": "Syllabus four point two: use appropriate formulae for motion.",
          "hold": 0,
          "caption": "use appropriate formulae for motion"
        },
        {
          "id": "quote2",
          "text": "With constant acceleration in a straight line.",
          "hold": 0,
          "caption": "with constant acceleration in a straight line"
        },
        {
          "id": "outcome1",
          "text": "By the end you can derive from gradient and area.",
          "hold": 0,
          "caption": "Derive from gradient and area."
        },
        {
          "id": "outcome2",
          "text": "Create the other equations.",
          "hold": 0,
          "caption": "Create the other equations."
        },
        {
          "id": "outcome3",
          "text": "And choose an equation.",
          "hold": 0,
          "caption": "Choose an equation."
        }
      ]
    },
    {
      "id": "s02",
      "title": "Picture constant acceleration",
      "mode": "story",
      "source": "f007–f023",
      "tempo": "brisk",
      "voiceSpeed": 1.0,
      "beats": [
        {
          "id": "story",
          "text": "Consider a trolley moving along a straight track. It is already moving, and gains the same amount of velocity each second.",
          "hold": 0
        },
        {
          "id": "accelerate",
          "text": "Watch it cover more ground in equal times. Its acceleration is constant.",
          "hold": 0
        },
        {
          "id": "contrast",
          "text": "If those velocity gains changed, the acceleration would vary. These formulae would no longer describe the whole interval.",
          "hold": 0,
          "caption": "Constant acceleration is essential."
        }
      ]
    },
    {
      "id": "s03",
      "title": "Derive velocity from gradient",
      "mode": "gradient",
      "source": "f026–f095",
      "tempo": "slow",
      "voiceSpeed": 0.9,
      "beats": [
        {
          "id": "setup",
          "text": "Now the velocity time graph: start at u, finish at v, after time t.",
          "hold": 0,
          "target": "endpoints"
        },
        {
          "id": "givens",
          "text": "Choose right as positive. Acceleration a is constant. Displacement s is the signed area. Derive the final velocity.",
          "hold": 2,
          "target": "acceleration"
        },
        {
          "id": "formula",
          "text": "Acceleration equals gradient: change in velocity divided by elapsed time.",
          "hold": 0,
          "ink": "a = Δv/Δt",
          "page": 0,
          "target": "rise-run"
        },
        {
          "id": "rise",
          "text": "The change in velocity is final minus initial: v minus u. The elapsed time is t.",
          "hold": 0,
          "ink": "a = (v - u)/t",
          "page": 0,
          "target": "rise-run"
        },
        {
          "id": "multiply",
          "text": "Multiply both sides by t. That gives a t equals v minus u.",
          "hold": 2,
          "ink": "at = v - u",
          "page": 0,
          "target": "rise-run"
        },
        {
          "id": "result",
          "text": "Add u. V equals u plus a t: initial velocity plus the change.",
          "hold": 2,
          "ink": "v = u + at",
          "page": 0,
          "target": "endpoints"
        },
        {
          "id": "why",
          "text": "A constant gradient is why the graph is straight. This equation tells us how much the velocity changes.",
          "hold": 0,
          "caption": "Constant gradient gives a straight line."
        }
      ]
    },
    {
      "id": "s04",
      "title": "Derive displacement from area",
      "mode": "area",
      "source": "f096–f118",
      "tempo": "slow",
      "voiceSpeed": 0.9,
      "beats": [
        {
          "id": "setup",
          "text": "Now find the displacement over the same interval. Keep the endpoint velocities and time on the graph.",
          "hold": 2,
          "target": "endpoints"
        },
        {
          "id": "area",
          "text": "Displacement equals signed area under the velocity time graph. Here that shape is a trapezium.",
          "hold": 0,
          "ink": "s = signed area",
          "page": 0,
          "target": "area"
        },
        {
          "id": "formula",
          "text": "Trapezium area is half the sum of the parallel sides, multiplied by the perpendicular width.",
          "hold": 0,
          "ink": "area = ½(u + v)t",
          "page": 0,
          "target": "endpoints"
        },
        {
          "id": "sides",
          "text": "The parallel sides are u and v. The width between them is t. The sloping edge is not a parallel side.",
          "hold": 2,
          "target": "endpoints"
        },
        {
          "id": "result",
          "text": "So displacement equals half u plus v, multiplied by t.",
          "hold": 2,
          "ink": "s = ½(u + v)t",
          "page": 0,
          "target": "area"
        },
        {
          "id": "meaning",
          "text": "This is average velocity times time. If the graph goes below the time axis, that area contributes negative displacement.",
          "hold": 0,
          "caption": "Signed area gives displacement."
        }
      ]
    },
    {
      "id": "s05",
      "title": "Remove final velocity",
      "mode": "remove-v",
      "source": "f119–f140",
      "tempo": "slow",
      "voiceSpeed": 0.9,
      "beats": [
        {
          "id": "setup",
          "text": "Now create the other equations. First, remove final velocity.",
          "hold": 2,
          "target": "known-formulas"
        },
        {
          "id": "formula",
          "text": "Start with displacement equals half u plus v, times t.",
          "hold": 0,
          "ink": "s = ½(u + v)t",
          "page": 0,
          "target": "area"
        },
        {
          "id": "replace",
          "text": "Replace v with u plus a t from the gradient equation. Keep the brackets.",
          "hold": 0,
          "ink": "s = ½(u + (u + at))t",
          "page": 0,
          "target": "known-formulas"
        },
        {
          "id": "collect",
          "text": "Collect the two u terms inside: half of two u plus a t, all multiplied by t.",
          "hold": 2,
          "ink": "s = ½(2u + at)t",
          "page": 0,
          "target": "known-formulas"
        },
        {
          "id": "result",
          "text": "Expand. Half times two u times t is u t. The other term is half a t squared.",
          "hold": 2,
          "ink": "s = ut + ½at²",
          "page": 0,
          "target": "area"
        },
        {
          "id": "meaning",
          "text": "Use this form when initial velocity, acceleration and time are known. You do not need final velocity.",
          "hold": 0,
          "caption": "No final velocity needed."
        }
      ]
    },
    {
      "id": "s06",
      "title": "Remove initial velocity",
      "mode": "remove-u",
      "source": "f141–f153",
      "tempo": "slow",
      "voiceSpeed": 0.9,
      "beats": [
        {
          "id": "setup",
          "text": "If final velocity is known instead, remove initial velocity.",
          "hold": 2,
          "target": "known-formulas"
        },
        {
          "id": "formula",
          "text": "Begin again with the trapezium result.",
          "hold": 0,
          "ink": "s = ½(u + v)t",
          "page": 0,
          "target": "area"
        },
        {
          "id": "rearrange",
          "text": "Rearrange v equals u plus a t: u equals v minus a t.",
          "hold": 0,
          "ink": "u = v - at",
          "page": 0,
          "target": "known-formulas"
        },
        {
          "id": "substitute",
          "text": "Substitute that expression for u.",
          "hold": 0,
          "ink": "s = ½((v - at) + v)t",
          "page": 0,
          "target": "known-formulas"
        },
        {
          "id": "collect",
          "text": "Collect terms: half of two v minus a t, multiplied by t.",
          "hold": 0,
          "ink": "s = ½(2v - at)t",
          "page": 0,
          "target": "known-formulas"
        },
        {
          "id": "result",
          "text": "Expand to get v t minus half a t squared. The minus sign comes from replacing u by v minus a t.",
          "hold": 2,
          "ink": "s = vt - ½at²",
          "page": 0,
          "target": "area"
        }
      ]
    },
    {
      "id": "s07",
      "title": "Remove time",
      "mode": "remove-t",
      "source": "f154–f176",
      "tempo": "slow",
      "voiceSpeed": 0.9,
      "beats": [
        {
          "id": "setup",
          "text": "To remove time, first assume acceleration is nonzero.",
          "hold": 2,
          "target": "condition"
        },
        {
          "id": "formula",
          "text": "Begin with the area formula.",
          "hold": 0,
          "ink": "s = ½(u + v)t",
          "page": 0,
          "target": "area"
        },
        {
          "id": "time",
          "text": "From v equals u plus a t, time equals v minus u divided by a.",
          "hold": 0,
          "ink": "t = (v - u)/a",
          "page": 0,
          "target": "known-formulas"
        },
        {
          "id": "substitute",
          "text": "Substitute that fraction for time in the area equation.",
          "hold": 0,
          "ink": "s = ½(u + v)(v - u)/a",
          "page": 0,
          "target": "known-formulas"
        },
        {
          "id": "multiply",
          "text": "Multiply both sides by two a.",
          "hold": 0,
          "ink": "2as = (u + v)(v - u)",
          "page": 0,
          "target": "known-formulas"
        },
        {
          "id": "squares",
          "text": "The product is a difference of squares: v squared minus u squared.",
          "hold": 2,
          "ink": "2as = v² - u²",
          "page": 0,
          "target": "endpoints"
        },
        {
          "id": "result",
          "text": "Add u squared. We obtain v squared equals u squared plus two a s.",
          "hold": 2,
          "ink": "v² = u² + 2as",
          "page": 0,
          "target": "endpoints"
        },
        {
          "id": "zero",
          "text": "If acceleration is zero, v equals u, so the final identity still holds. Only the division step required nonzero acceleration.",
          "hold": 0,
          "target": "zero-case",
          "caption": "The final identity also covers a = 0."
        }
      ]
    },
    {
      "id": "s08",
      "title": "Choose the equation you need",
      "mode": "choice",
      "source": "f169–f176; f250–f272",
      "tempo": "brisk",
      "voiceSpeed": 1.0,
      "beats": [
        {
          "id": "rule",
          "text": "Choose the equation that omits the quantity you do not need.",
          "hold": 0,
          "caption": "Choose by the quantity omitted."
        },
        {
          "id": "missing-s",
          "text": "No displacement? Use v equals u plus a t.",
          "hold": 0,
          "target": "omit-s"
        },
        {
          "id": "missing-a",
          "text": "No acceleration? Use the trapezium equation.",
          "hold": 0,
          "target": "omit-a"
        },
        {
          "id": "missing-v",
          "text": "No final velocity? Use u t plus half a t squared.",
          "hold": 0,
          "target": "omit-v"
        },
        {
          "id": "missing-u",
          "text": "No initial velocity? Use v t minus half a t squared.",
          "hold": 0,
          "target": "omit-u"
        },
        {
          "id": "question",
          "text": "Check: you know u, a and s. Find v without time. Which equation?",
          "hold": 3,
          "caption": "Which equation avoids finding time?"
        },
        {
          "id": "answer",
          "text": "V squared equals u squared plus two a s. Time is the missing letter.",
          "hold": 2,
          "target": "omit-t"
        },
        {
          "id": "outcome1",
          "text": "You can derive from gradient and area.",
          "hold": 0,
          "caption": "✓ Derive from gradient and area."
        },
        {
          "id": "outcome2",
          "text": "Create the other equations.",
          "hold": 0,
          "caption": "✓ Create the other equations."
        },
        {
          "id": "outcome3",
          "text": "And choose an equation.",
          "hold": 0,
          "caption": "✓ Choose an equation."
        }
      ]
    }
  ]
}
```

## Stage 1 verification

Measured audio is 336.326530 s (5:36.33). All 52 cues resolve to local faster-whisper-small word timestamps, including the word “if” that introduces the below-axis signed-area contrast. `verify-suvat-cues.py` verifies the audio hashes, requested voice/speeds, actual inserted-silence PCM, writing windows, and all five identities with exact arithmetic, including signed motion and zero acceleration. The local word list is retained verbatim; spoken mathematical letters are mapped to their graph labels.
