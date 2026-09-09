# SUVAT in 1D — storyboard

Content ceiling: FRAME-LOG.md at a05e215. NOTES.md supplies the correct bike substitution; its vertical examples are excluded by the task. The explicit task's three examples and 5:00–6:00 target override the generic one-example/shorter-duration rules.

Syllabus quote (Cambridge 9709, 2026–2027, p32): “use appropriate formulae for motion with constant acceleration in a straight line.” [Official syllabus](https://www.cambridgeinternational.org/Images/697427-2026-2027-syllabus.pdf#page=32). Opening displays the quote in two successive short cards beside a bike motif.

Outcomes, repeated verbatim with ticks at the close: Choose from knowns; Keep signed values; Solve linked equations. All scenes serve these outcomes.

## Visual contract
- Eight scenes; brisk concepts/open/close, slow worked examples, literal inserted-silence holds after results and a three-second check hold.
- Header + animated/annotated diagram + compact problem card OR paper: at most three regions.
- Every example begins as moving story without numbers, followed by the whole question and all givens before handwriting. Bike time is a continuation retaining the bike's diagram and results.
- The five-entry handwritten list is rebuilt for every target and interval. Known entries acquire hand-drawn ticks; the requested letter is circled. All quantities remain on the diagram during substitution.
- General formula stays above numerical work. List left, working right on one paper. Changing page retains the earlier car equation on the diagram. Results are ringed, then written onto the diagram.
- At each spoken figure, local Whisper word timestamps drive a loose accent ring. Problem phrases underline as read. Pen travel completes before silence holds.
- Bike accelerates; train decelerates to a stop; particle reverses and speeds up; car accelerates through A, B, C. Rich vehicle silhouettes, road markings, displacement brackets and velocity arrows provide visual context.
- Sign convention once: right positive. No force arrows, gravity or vertical motion. Correct 10². Deceleration described as decreasing speed, with signed acceleration distinguished from its magnitude.
- Constant versus varying velocity increments supplies the contrast. Bike time supplies the what-would-change beat. The full A–B–C journey closes the examples, followed by one check and recap.

## Narration and cue plan
Machine-readable beats below are the exact narration source. `list` denotes five sequential hand-written rows, `known` tick indices, `required` the circled index, `ink` general formula or line of working. `hold` is inserted silence after pen finish, not punctuation. Audio voice gYWKdgLtqjPO3D5uDrDP; ELEVENLABS_SPEED is 0.9 slow / 1.0 brisk.

```json
{
  "project": "mechanics-suvat-in-1d",
  "map": "M4.2",
  "prefix": "suvat-in-1d",
  "scenes": [
    {
      "id": "s01",
      "title": "Syllabus 4.2: SUVAT in 1D",
      "mode": "opening",
      "sourceFrames": "f013–f044, f355–f385",
      "tempo": "brisk",
      "voiceSpeed": 1,
      "beats": [
        {
          "id": "quote",
          "text": "Use appropriate formulae for motion with constant acceleration in a straight line.",
          "hold": 0,
          "caption": "use appropriate formulae for motion"
        },
        {
          "id": "outcomes",
          "text": "By the end you can choose from knowns, keep signed values, and solve linked equations.",
          "hold": 0,
          "caption": "Choose from knowns|Keep signed values|Solve linked equations"
        }
      ]
    },
    {
      "id": "s02",
      "title": "Choose from the five quantities",
      "mode": "method",
      "sourceFrames": "f013–f044, f065–f079",
      "tempo": "brisk",
      "voiceSpeed": 1,
      "beats": [
        {
          "id": "constant",
          "text": "SUVAT requires constant acceleration: equal velocity changes in equal times.",
          "hold": 0,
          "caption": "Constant acceleration only"
        },
        {
          "id": "contrast",
          "text": "Unequal changes? One SUVAT calculation no longer works.",
          "hold": 0,
          "caption": "Changing acceleration: split the motion"
        },
        {
          "id": "sign",
          "text": "Right is positive throughout. Displacement, velocities and acceleration have signs; time is positive.",
          "hold": 0,
          "caption": "Right is positive →"
        },
        {
          "id": "method",
          "text": "Write s, u, v, a, t. Tick knowns; circle the target.",
          "hold": 0,
          "ink": "s   u   v   a   t",
          "caption": "Tick knowns; circle the target"
        }
      ]
    },
    {
      "id": "s03",
      "title": "Bike: find the final velocity",
      "mode": "bike",
      "sourceFrames": "f049–f088",
      "tempo": "slow",
      "voiceSpeed": 0.9,
      "beats": [
        {
          "id": "story",
          "text": "Consider a bike speeding up. Find its final velocity.",
          "hold": 0
        },
        {
          "id": "setup-a",
          "text": "Uniform acceleration: four metres per second squared.",
          "hold": 0,
          "target": "a"
        },
        {
          "id": "setup-u",
          "text": "Initial velocity: ten metres per second.",
          "hold": 0,
          "target": "u"
        },
        {
          "id": "setup-s",
          "text": "Displacement: forty-eight metres. Find v.",
          "hold": 1,
          "target": "s"
        },
        {
          "id": "list",
          "text": "Write the five quantities. Tick s, u and a; circle v.",
          "hold": 0,
          "list": [
            "s = 48",
            "u = 10",
            "v",
            "a = 4",
            "t"
          ],
          "known": [
            0,
            1,
            3
          ],
          "required": 2,
          "ink": "s = 48 u = 10 v a = 4 t",
          "page": 0
        },
        {
          "id": "formula",
          "text": "Omit time. V squared equals u squared plus two a s.",
          "hold": 0,
          "ink": "v² = u² + 2as"
        },
        {
          "id": "substitute",
          "text": "Ten squared, plus two times four times forty-eight.",
          "hold": 0,
          "ink": "v² = 10² + 2×4×48"
        },
        {
          "id": "square",
          "text": "That gives four hundred and eighty-four.",
          "hold": 2,
          "ink": "v² = 484"
        },
        {
          "id": "result",
          "text": "Positive twenty-two metres per second, because it moves forwards.",
          "hold": 2,
          "ink": "v = 22 m s⁻¹",
          "result": "v",
          "target": "v"
        }
      ]
    },
    {
      "id": "s04",
      "title": "Bike: find the time",
      "mode": "bike-time",
      "sourceFrames": "f089–f127",
      "tempo": "slow",
      "voiceSpeed": 0.9,
      "beats": [
        {
          "id": "setup",
          "text": "What if we want time instead?",
          "hold": 1
        },
        {
          "id": "list",
          "text": "Rewrite the list. Tick every known; circle time.",
          "hold": 0,
          "list": [
            "s = 48",
            "u = 10",
            "v = 22",
            "a = 4",
            "t"
          ],
          "known": [
            0,
            1,
            2,
            3
          ],
          "required": 4,
          "ink": "s = 48 u = 10 v = 22 a = 4 t",
          "page": 0
        },
        {
          "id": "formula",
          "text": "Omit displacement. V equals u plus a t.",
          "hold": 0,
          "ink": "v = u + at"
        },
        {
          "id": "substitute",
          "text": "Twenty-two equals ten plus four t.",
          "hold": 0,
          "ink": "22 = 10 + 4t"
        },
        {
          "id": "result",
          "text": "So t equals three seconds.",
          "hold": 2,
          "ink": "t = 3 s",
          "result": "t",
          "target": "t"
        },
        {
          "id": "alternative",
          "text": "Without the final velocity, the displacement equation gives a quadratic instead.",
          "hold": 0,
          "caption": "Different routes; same time"
        }
      ]
    },
    {
      "id": "s05",
      "title": "Train: braking to rest",
      "mode": "train",
      "sourceFrames": "f129–f196",
      "tempo": "slow",
      "voiceSpeed": 0.9,
      "beats": [
        {
          "id": "story",
          "text": "Consider a train braking to rest. Find deceleration, then distance.",
          "hold": 0
        },
        {
          "id": "setup-t",
          "text": "Uniform braking for six seconds.",
          "hold": 0,
          "target": "t"
        },
        {
          "id": "setup-u",
          "text": "Initial velocity, seven metres per second.",
          "hold": 0,
          "target": "u"
        },
        {
          "id": "setup-v",
          "text": "At rest, final velocity zero.",
          "hold": 1,
          "target": "v"
        },
        {
          "id": "list",
          "text": "Write the list. Tick u, v, t; circle acceleration.",
          "hold": 0,
          "list": [
            "s",
            "u = 7",
            "v = 0",
            "a",
            "t = 6"
          ],
          "known": [
            1,
            2,
            4
          ],
          "required": 3,
          "ink": "s u = 7 v = 0 a t = 6",
          "page": 0
        },
        {
          "id": "formula",
          "text": "Omit displacement. V equals u plus a t.",
          "hold": 0,
          "ink": "v = u + at"
        },
        {
          "id": "substitute",
          "text": "Zero equals seven plus six a.",
          "hold": 0,
          "ink": "0 = 7 + 6a"
        },
        {
          "id": "result",
          "text": "Minus seven sixths metres per second squared. Keep it exact.",
          "hold": 2,
          "ink": "a = -7/6 m s⁻²",
          "result": "a",
          "target": "a"
        },
        {
          "id": "meaning",
          "text": "Deceleration means decreasing speed. Here its magnitude is one point one seven; acceleration opposes positive velocity.",
          "hold": 0,
          "caption": "Deceleration = 1.17 m s⁻²",
          "target": "deceleration"
        },
        {
          "id": "distance-list",
          "text": "Rewrite the list for displacement. No reversal, so this equals distance.",
          "hold": 0,
          "list": [
            "s",
            "u = 7",
            "v = 0",
            "a = -7/6",
            "t = 6"
          ],
          "known": [
            1,
            2,
            3,
            4
          ],
          "required": 0,
          "ink": "s u = 7 v = 0 a = -7/6 t = 6",
          "page": 1
        },
        {
          "id": "distance-formula",
          "text": "S equals half, u plus v, times t.",
          "hold": 0,
          "ink": "s = ½(u + v)t",
          "page": 1
        },
        {
          "id": "distance-substitute",
          "text": "Half times seven plus zero, times six.",
          "hold": 0,
          "ink": "s = ½(7 + 0)×6",
          "page": 1
        },
        {
          "id": "distance-result",
          "text": "Twenty-one metres exactly. Avoid rounding intermediate answers.",
          "hold": 2,
          "ink": "s = 21 m",
          "page": 1,
          "result": "s",
          "target": "s"
        }
      ]
    },
    {
      "id": "s06",
      "title": "A negative acceleration can reverse motion",
      "mode": "reversal",
      "sourceFrames": "f197–f267",
      "tempo": "slow",
      "voiceSpeed": 0.9,
      "beats": [
        {
          "id": "story",
          "text": "A particle slows, stops, then reverses. After reversal it speeds up.",
          "hold": 0
        },
        {
          "id": "setup-u",
          "text": "Initial velocity: ten metres per second.",
          "hold": 0,
          "target": "u"
        },
        {
          "id": "setup-a",
          "text": "Constant acceleration: minus four metres per second squared.",
          "hold": 0,
          "target": "a"
        },
        {
          "id": "setup-t",
          "text": "Find its motion after five seconds.",
          "hold": 1,
          "target": "t"
        },
        {
          "id": "list",
          "text": "Write the list. Tick u, a, t; circle v.",
          "hold": 0,
          "list": [
            "s",
            "u = 10",
            "v",
            "a = -4",
            "t = 5"
          ],
          "known": [
            1,
            3,
            4
          ],
          "required": 2,
          "ink": "s u = 10 v a = -4 t = 5",
          "page": 0
        },
        {
          "id": "formula",
          "text": "V equals u plus a t.",
          "hold": 0,
          "ink": "v = u + at"
        },
        {
          "id": "substitute",
          "text": "Ten minus four times five.",
          "hold": 0,
          "ink": "v = 10 - 4×5"
        },
        {
          "id": "result",
          "text": "Minus ten metres per second: leftwards, speeding up.",
          "hold": 2,
          "ink": "v = -10 m s⁻¹",
          "result": "v",
          "target": "v"
        },
        {
          "id": "position-list",
          "text": "Rewrite the list; now circle displacement.",
          "hold": 0,
          "list": [
            "s",
            "u = 10",
            "v = -10",
            "a = -4",
            "t = 5"
          ],
          "known": [
            1,
            2,
            3,
            4
          ],
          "required": 0,
          "ink": "s u = 10 v = -10 a = -4 t = 5",
          "page": 1
        },
        {
          "id": "position-formula",
          "text": "S equals u t plus half a t squared.",
          "hold": 0,
          "ink": "s = ut + ½at²",
          "page": 1
        },
        {
          "id": "position-substitute",
          "text": "Ten times five, plus half times minus four times five squared.",
          "hold": 0,
          "ink": "s = 10×5 + ½(-4)×5²",
          "page": 1
        },
        {
          "id": "position-result",
          "text": "Zero metres: back at the start, despite travelling a distance.",
          "hold": 2,
          "ink": "s = 0 m",
          "page": 1,
          "result": "s",
          "target": "s"
        }
      ]
    },
    {
      "id": "s07",
      "title": "Car: two positions, two equations",
      "mode": "car",
      "sourceFrames": "f282–f353",
      "tempo": "slow",
      "voiceSpeed": 0.9,
      "beats": [
        {
          "id": "story",
          "text": "A car accelerates uniformly through A, B, C. Find u and a.",
          "hold": 0
        },
        {
          "id": "setup-c",
          "text": "One hundred and sixty-five metres in ten seconds.",
          "hold": 0,
          "target": "C"
        },
        {
          "id": "setup-b",
          "text": "At eight seconds, it passes B, one hundred and twelve metres from A.",
          "hold": 1,
          "target": "B"
        },
        {
          "id": "list",
          "text": "Write the list for A to C. Tick displacement and time.",
          "hold": 0,
          "list": [
            "s = 165",
            "u",
            "v",
            "a",
            "t = 10"
          ],
          "known": [
            0,
            4
          ],
          "required": [
            1,
            3
          ],
          "ink": "s = 165 u v a t = 10",
          "page": 0
        },
        {
          "id": "formula",
          "text": "Omit v. S equals u t plus half a t squared.",
          "hold": 0,
          "ink": "s = ut + ½at²"
        },
        {
          "id": "substitute",
          "text": "One hundred and sixty-five equals ten u plus half a times ten squared.",
          "hold": 0,
          "ink": "165 = 10u + ½a×10²"
        },
        {
          "id": "simplify",
          "text": "Divide by five: thirty-three equals two u plus ten a.",
          "hold": 2,
          "ink": "33 = 2u + 10a"
        },
        {
          "id": "second-list",
          "text": "Rewrite for A to B. Tick displacement and time; keep the same u and a.",
          "hold": 0,
          "list": [
            "s = 112",
            "u",
            "v",
            "a",
            "t = 8"
          ],
          "known": [
            0,
            4
          ],
          "required": [
            1,
            3
          ],
          "ink": "s = 112 u v a t = 8",
          "page": 1
        },
        {
          "id": "second-formula",
          "text": "S equals u t plus half a t squared.",
          "hold": 0,
          "ink": "s = ut + ½at²",
          "page": 1
        },
        {
          "id": "second-substitute",
          "text": "One hundred and twelve equals eight u plus half a times eight squared.",
          "hold": 0,
          "ink": "112 = 8u + ½a×8²",
          "page": 1
        },
        {
          "id": "second-simplify",
          "text": "Divide by eight: fourteen equals u plus four a.",
          "hold": 2,
          "ink": "14 = u + 4a",
          "page": 1
        },
        {
          "id": "eliminate",
          "text": "Double the second equation; subtract. U cancels.",
          "hold": 0,
          "ink": "33 - 28 = 10a - 8a",
          "page": 1
        },
        {
          "id": "result-a",
          "text": "Two a equals five. So a is two point five metres per second squared.",
          "hold": 2,
          "ink": "a = 2.5 m s⁻²",
          "page": 1,
          "result": "a",
          "target": "a"
        },
        {
          "id": "result-u",
          "text": "Substitute back: u is four metres per second.",
          "hold": 2,
          "ink": "u = 14 - 4×2.5 = 4 m s⁻¹",
          "page": 1,
          "result": "u",
          "target": "u"
        }
      ]
    },
    {
      "id": "s08",
      "title": "Check your equation choice",
      "mode": "check",
      "sourceFrames": "f355–f385; check reuses f129–f196",
      "tempo": "brisk",
      "voiceSpeed": 1,
      "beats": [
        {
          "id": "question",
          "text": "Train distance: which equation uses u, v and t, without acceleration?",
          "hold": 3,
          "caption": "Which equation omits acceleration?"
        },
        {
          "id": "answer",
          "text": "S equals half, u plus v, times t.",
          "hold": 2,
          "ink": "s = ½(u + v)t"
        },
        {
          "id": "recap",
          "text": "Choose from knowns. Keep signed values. Solve linked equations. Keep unrounded answers.",
          "hold": 0,
          "caption": "Choose from knowns|Keep signed values|Solve linked equations"
        }
      ]
    }
  ]
}
```
