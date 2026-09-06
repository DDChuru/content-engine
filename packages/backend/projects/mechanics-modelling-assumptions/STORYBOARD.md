# Storyboard: Modelling Assumptions

Format: original 16:9 Remotion explainer, approximately 3 minutes 44 seconds, with no reused source images, layouts or branding. Visual language is a “mechanics lab”: dark navy field (`#081521`), warm white instrument cards (`#F7F1E6`), cyan construction lines (`#56D6E5`) and amber force or motion arrows (`#F5A623`). Objects are clean geometric lab props with subtle paper grain.

An index tray stays at screen right through the vocabulary scenes. Each spoken modelling term inserts one warm-white card with the term on the tab and its consequence beneath. All animation is frame-driven in Remotion: scene components sit in a `Series`, cue beats use premounted `Sequence` elements, and motion comes from `useCurrentFrame`, clamped interpolation and restrained springs rather than CSS animation.

## S01 — Reality enters the lab

**Duration:** 15 seconds

**Viewer sees:** A messy real loading bay: crate, rope fibres, dusty floor, flexing trolley and wind ribbons. A cyan scanner passes over it. Details dim until only a block, line and arrows remain on a warm-white model card.

**Narration:** “Real motion contains too much detail to calculate all at once. A mathematical model keeps the effects that matter and sets the rest aside. The answer is useful only while those choices remain reasonable.”

**Cue keywords:**

- “too much detail” — labels swarm around the real scene
- “model” — cyan scanner isolates three essentials
- “sets the rest aside” — secondary details fade
- “reasonable” — check light turns amber

## S02 — Particle is about size, not mass

**Duration:** 21 seconds

**Viewer sees:** A photoreal-styled geometric crate rolls into a measurement bay, then visibly shrinks to a single cyan dot as “particle” is spoken. Its mass readout remains lit. A wind fan toggles on and an amber drag arrow appears, proving drag is a separate choice. Cards file for “particle” and “air resistance neglected”.

**Narration:** “Call the crate a particle and its dimensions disappear. Its mass does not. Forces meet at one point, so shape and rotation leave the calculation. Air resistance is separate. Ignore it only when the model or question allows that.”

**Cue keywords:**

- “particle” — real crate shrinks to a dot
- “mass does not” — mass readout stays fixed
- “rotation” — spin dial powers down
- “separate” — drag toggle detaches from the particle card

## S03 — What light removes

**Duration:** 23 seconds

**Viewer sees:** Three lab stations show a string, rod and pulley. Weight badges fade from string and rod. On the pulley, a prominent mass badge and flywheel inertia ring fade out. A rough contact strip remains visible until a separate smooth toggle is pressed. Three “light” cards enter the index.

**Narration:** “Light means negligible mass. A light string has no weight of its own. A light rod adds no weight. A light pulley contributes no rotational inertia. But light does not mean frictionless. That is the job of the word smooth.”

**Cue keywords:**

- “light” — mass badges begin fading
- “string” — hanging weight marker vanishes
- “pulley” — inertia ring powers down
- “smooth” — separate friction toggle illuminates

## S04 — Inextensible locks the motion

**Duration:** 23 seconds

**Viewer sees:** Split bench. On the left, an elastic string stretches and two block acceleration readouts disagree. On the right, an inextensible string stays taut while two blocks travel around a pulley; both readouts lock to the same magnitude, with arrows following their different path directions. Its card enters the index.

**Narration:** “A stretchy string lets its ends move differently. An inextensible string keeps a fixed length while it is taut. Pull one end in, and the other must move by the same amount. Their acceleration magnitudes match along the string.”

**Cue keywords:**

- “stretchy” — left string elongates
- “fixed length” — right length gauge locks
- “same amount” — distance counters match
- “magnitudes match” — acceleration readouts synchronise

## S05 — Smooth ice, rough sand

**Duration:** 22 seconds

**Viewer sees:** The same warm-white block crosses an icy cyan plate, then granular amber sand. On ice there is only a normal reaction. On sand a friction arrow grows against the motion. Above, a string passes around a pulley and a peg; “smooth” makes the tension gauges on each side agree. Cards file for smooth surface, rough surface, smooth pulley and smooth peg.

**Narration:** “A smooth surface supplies no friction. A rough surface may. Friction opposes sliding, or the slide that is about to begin. A smooth pulley or peg removes contact friction there, so a light string carries the same tension on both sides.”

**Cue keywords:**

- “smooth surface” — block glides on ice
- “rough surface” — sand rises and friction arrow appears
- “pulley or peg” — top rig splits into two redirectors
- “same tension” — gauges snap level

## S06 — Keep length when moments matter

**Duration:** 24 seconds

**Viewer sees:** A rod bends like rubber, then a cyan brace locks it rigid. It expands into a beam with several force positions marked. A density scan sweeps a uniform rod and places its weight at the midpoint; a triangular lamina fills evenly and marks its centroid. Cards file for rigid rod, beam, uniform rod, lamina and uniform lamina.

**Narration:** “A rigid rod keeps the distance between its ends. A beam also keeps its length, because turning effects depend on where forces act. Uniform means mass is spread evenly. For a straight rod, weight acts at the midpoint. For a lamina, use its area centroid.”

**Cue keywords:**

- “rigid rod” — flexing rod locks straight
- “where forces act” — moment arms light up
- “uniform” — density scan becomes even
- “centroid” — target settles inside the lamina

## S07 — Constraints: bead, wire, peg and plane

**Duration:** 24 seconds

**Viewer sees:** A bead clicks onto a curved cyan wire and can move only along it. A reaction arrow stays normal as the bead travels. The wire straightens into an inclined plane under a block. A string turns around a fixed peg above. Cards for bead, wire, peg and plane complete another index row.

**Narration:** “A bead is a small body constrained to a wire. The wire prescribes its path. If contact is smooth, the reaction points across the wire, not along it. A plane is simply a flat contact surface. A peg redirects a string at one fixed place.”

**Cue keywords:**

- “bead” — bead clicks onto the track
- “path” — cyan trail traces the wire
- “reaction” — normal arrow rotates with the curve
- “peg” — string wraps around the fixed pin

## S08 — Read consequences backwards

**Duration:** 20 seconds

**Viewer sees:** An exam-question card feeds short consequence chips into a mechanical sorter: “no friction”, “same tension”, “same acceleration magnitude”, “weight at midpoint” and “one force point”. Each chip routes to the matching filled index card. A red warning flashes when “particle” is paired with “no air resistance”.

**Narration:** “In a question, work backwards from the promised shortcut. No friction means smooth. Equal tension through a redirector means smooth and light. Equal acceleration magnitudes mean a taut inextensible string. Midpoint weight means uniform. One force point means particle.”

**Cue keywords:**

- “work backwards” — sorter reverses direction
- “equal tension” — two cards combine
- “equal acceleration” — taut-string card locks in
- “particle” — incorrect drag pairing is rejected

## S09 — Worked lab test

**Duration:** 32 seconds

**Viewer sees:** A three-kilogram block rests on a smooth horizontal bench, connected by a light taut string over a smooth light pulley to a hanging two-kilogram block. Assumption cards dock beside the relevant component. Force diagrams isolate both particles. An equation rail resolves (T=3a) and (2g-T=2a), then displays (a=3.92\text{ m s}^{-2}) and (T=11.8\text{ N}). Finally, sand pours onto the bench and the acceleration readout falls.

**Narration:** “Try the complete toolkit. Three kilograms sits on a smooth bench. Two kilograms hangs from a light, taut, inextensible string over a smooth light pulley. Treat both blocks as particles. One tension and one acceleration magnitude now describe the system. The hanging weight drives five kilograms in total. The acceleration is three point nine two metres per second squared. Add a rough bench, and friction lowers that value.”

**Cue keywords:**

- “complete toolkit” — assumption cards dock to the rig
- “one tension” — tension gauges merge
- “five kilograms” — masses combine on the equation rail
- “rough bench” — sand falls and acceleration decreases

## S10 — Twenty-second recap

**Duration:** 20 seconds

**Viewer sees:** The card index fills the frame in a clean four-by-four grid. Rapid cyan paths connect each term to its consequence: particle to point, light to no mass, smooth to no friction, inextensible to locked motion, rigid to fixed shape, uniform to centre of mass. The final card reads “Assume. Solve. Check. Refine.”

**Narration:** “Recap. Particle removes size. Light removes mass. Smooth removes friction. Inextensible locks motion along a taut string. Rigid prevents deformation. Uniform locates the centre of mass. Every assumption buys a shortcut and sets a limit. State it, use it, check the answer, and refine when reality matters.”

**Cue keywords:**

- “Particle” — point card flashes
- “Smooth” — friction card clears
- “Every assumption” — all cards connect
- “refine” — final four-word card locks on screen
