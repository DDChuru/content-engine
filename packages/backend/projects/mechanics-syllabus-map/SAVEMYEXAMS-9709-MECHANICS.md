# SaveMyExams Cambridge (CIE) A Level Maths 9709: Mechanics revision-note map

Checked: **6 September 2026**. Scope: the Mechanics revision-note course linked from the Cambridge (CIE) A Level Maths course; exam code **9709** is present in the course metadata and on every fetched note page.

## Sources, ordering and counting

- Starting point: [Cambridge (CIE) A Level Maths](https://www.savemyexams.com/a-level/maths/cie/), which redirects to the [/20/ course](https://www.savemyexams.com/a-level/maths/cie/20/).
- Mechanics course: [Maths: Mechanics](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/).
- Authoritative tree and order: [Mechanics revision-note index](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/). The current route uses `/maths/cie/20/mechanics/`, rather than the older `/maths_mechanics/cie/` pattern.
- Method: unauthenticated `curl -sL` GETs and HTML parsing. All 31 unique note URLs were fetched; their order was checked against the index’s HTML links and its public section/topic/subtopic ordering metadata. Note navigation yielded no additional CIE Mechanics note leaves.
- **Numbering caveat:** the current index and note-page titles do not display a consistent numbered hierarchy. The `1.1.1`-style identifiers below are one-based positions in the site’s current section → topic → note order, derived from its ordering metadata; they are not claimed to be current printed site labels or Cambridge syllabus references.
- Some in-body legacy references conflict with the current order: for example, the [F = ma note](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/newtons-second-law/f-equals-ma/) calls Equilibrium in 1D “3.1.1” and Equilibrium in 2D “3.1.2”, although the current index puts Force Diagrams before them. Current index order takes precedence in this map.
- Sections and topics are groups in the index, not separately linked overview pages there. Section links below point to that index; topic links use the actual accordion element IDs in its HTML (a collapsed group may need expanding). Every leaf links directly to its fetched note page.
- A leaf is one revision-note URL. In-page headings, worked examples, PDFs, flashcards and exam questions are not additional leaves. For example, Energy remains one leaf despite covering both kinetic and gravitational potential energy.

## Section summary

| Position | Section | Topics | Leaves | Already covered | Remaining |
| --- | --- | ---: | ---: | ---: | ---: |
| 1 | Mechanics Toolkit | 1 | 5 | 4 | 1 |
| 2 | Kinematics (Straight Line Motion) | 3 | 7 | 0 | 7 |
| 3 | Forces & Equilibrium | 3 | 12 | 0 | 12 |
| 4 | Energy, Work & Power | 2 | 4 | 0 | 4 |
| 5 | Momentum | 1 | 3 | 0 | 3 |
| **Total** | **5 sections** | **10** | **31** | **4** | **27** |

## Coverage mapping

Coverage is marked from the four completed topics supplied in the task; it is not a claim that the remaining pages were checked against a separate production inventory.

| Completed topic supplied | Matching current site leaf | Map position |
| --- | --- | --- |
| Scalars and vectors | [Scalars & Vectors](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/mechanics-toolkit/quantities-units-and-modelling/scalars-and-vectors/) | 1.1.1 |
| S.I. units | [Fundamental Units](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/mechanics-toolkit/quantities-units-and-modelling/fundamental-units/) | 1.1.2 |
| Derived units | [Derived Units](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/mechanics-toolkit/quantities-units-and-modelling/derived-units/) | 1.1.3 |
| Types of force | [Types of Force](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/mechanics-toolkit/quantities-units-and-modelling/types-of-force/) | 1.1.4 |

Fundamental Units explicitly describes S.I. units, so it is the match for the completed “S.I. units” topic.

## Complete tree

Each leaf below was **readable in the public HTML (HTTP 200)**. Summaries describe its accessible explanations. **ALREADY COVERED** marks the four supplied completed topics; all other leaves are **REMAINING**. See access notes below for the signup prompts.

### 1. [Mechanics Toolkit](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/)

#### 1.1. [Quantities, Units & Modelling](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/#collapse-top-Zg2pvKxBwBpPBSVF)

- **1.1.1 [Scalars & Vectors](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/mechanics-toolkit/quantities-units-and-modelling/scalars-and-vectors/) — ALREADY COVERED.** Distinguishes scalar magnitude from vector magnitude and direction, with examples involving displacement, velocity, acceleration and force.
- **1.1.2 [Fundamental Units](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/mechanics-toolkit/quantities-units-and-modelling/fundamental-units/) — ALREADY COVERED.** Introduces metres, seconds and kilograms as fundamental SI units and explains conversions between common length, time and mass units.
- **1.1.3 [Derived Units](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/mechanics-toolkit/quantities-units-and-modelling/derived-units/) — ALREADY COVERED.** Forms velocity, acceleration and force units from fundamental units, and practises conversions and interpreting units through equations.
- **1.1.4 [Types of Force](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/mechanics-toolkit/quantities-units-and-modelling/types-of-force/) — ALREADY COVERED.** Describes weight, tension, thrust, friction and normal reaction, including their directions and the distinction between mass and weight.
- **1.1.5 [Modelling Assumptions](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/mechanics-toolkit/quantities-units-and-modelling/modelling-assumptions/) — REMAINING.** Explains simplifying assumptions for particles, surfaces, strings and pulleys, and how these assumptions affect a mechanical model.

### 2. [Kinematics (Straight Line Motion)](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/)

#### 2.1. [Kinematics Graphs](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/#collapse-top-xwJxsHWpmm7tYV7v)

- **2.1.1 [Displacement-Time Graphs](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/kinematics-straight-line-motion/kinematics-graphs/displacement-time-graphs/) — REMAINING.** Interprets motion and velocity from displacement-time gradients and distinguishes displacement, distance, average velocity and average speed.
- **2.1.2 [Velocity-Time Graphs](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/kinematics-straight-line-motion/kinematics-graphs/velocity-time-graphs/) — REMAINING.** Uses velocity-time gradients for acceleration and signed areas for displacement, distinguishing total distance from net displacement.
- **2.1.3 [Drawing Travel Graphs](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/kinematics-straight-line-motion/kinematics-graphs/drawing-travel-graphs/) — REMAINING.** Constructs labelled displacement-time and velocity-time graphs from journey descriptions, using gradients and areas to recover missing information.

#### 2.2. [Variable Acceleration](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/#collapse-top-VM3fZGgDY52FfWkg)

- **2.2.1 [Using Calculus in 1D](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/kinematics-straight-line-motion/variable-acceleration/using-calculus-in-1d/) — REMAINING.** Differentiates and integrates displacement, velocity and acceleration functions, determines integration constants, and separates distance from displacement.

#### 2.3. [Constant Acceleration](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/#collapse-top-MYMWZTfVw7N9Srht)

- **2.3.1 [Deriving the suvat Formulae](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/kinematics-straight-line-motion/constant-acceleration/deriving-the-suvat-formulae/) — REMAINING.** Introduces the five constant-acceleration equations and derives them using velocity-time graphs, calculus and algebraic elimination.
- **2.3.2 [suvat in 1D](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/kinematics-straight-line-motion/constant-acceleration/suvat-in-1d/) — REMAINING.** Selects and applies constant-acceleration equations in one dimension, including sign conventions, successive stages and simultaneous equations.
- **2.3.3 [Acceleration due to Gravity](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/kinematics-straight-line-motion/constant-acceleration/acceleration-due-to-gravity/) — REMAINING.** Applies constant-acceleration equations to vertical motion under gravity, including maximum height, return times and distance versus displacement.

### 3. [Forces & Equilibrium](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/)

#### 3.1. [Forces](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/#collapse-top-hpNwyxyK29cW4HHf)

- **3.1.1 [Force Diagrams](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/forces/force-diagrams/) — REMAINING.** Builds labelled force diagrams for particles, showing the directions of weight, tension, thrust, friction and normal reaction.
- **3.1.2 [Equilibrium in 1D](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/forces/equilibrium-in-1d/) — REMAINING.** Connects Newton’s first law with zero resultant force and balances opposing forces along a single direction.
- **3.1.3 [Equilibrium in 2D](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/forces/equilibrium-in-2d/) — REMAINING.** Balances forces in two perpendicular directions and describes equilibrium through zero resultant force and closed force polygons.

#### 3.2. [Newton's Second Law](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/#collapse-top-p3z2ZkxK8Qt65ZsC)

- **3.2.1 [F = ma](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/newtons-second-law/f-equals-ma/) — REMAINING.** Reviews Newton’s three laws and uses resultant force equals mass times acceleration, often alongside constant-acceleration equations.
- **3.2.2 [Connected Bodies (Ropes & Tow Bars)](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/newtons-second-law/connected-bodies-ropes-and-tow-bars/) — REMAINING.** Models bodies connected by strings or rods, using shared acceleration, tension or thrust, and separate-body or whole-system equations.
- **3.2.3 [Connected Bodies (Lifts)](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/newtons-second-law/connected-bodies-lifts/) — REMAINING.** Sets up vertical equations of motion for lifts and their loads, accounting for gravity, contact forces and cable tension.
- **3.2.4 [Connected Bodies (Pulleys)](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/newtons-second-law/connected-bodies-pulleys/) — REMAINING.** Models smooth pulleys with light inextensible strings and solves separate equations for connected particles’ acceleration and string tension.

#### 3.3. [Resolving Forces, Inclined Planes & Friction](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/#collapse-top-mQJS6smRJTDsJFxk)

- **3.3.1 [Resolving Forces & Inclined Planes](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/resolving-forces-inclined-planes-and-friction/resolving-forces-and-inclined-planes/) — REMAINING.** Resolves angled forces using trigonometry, treats motion along inclined planes, and relates friction and normal reaction to contact force.
- **3.3.2 [Coefficient of Friction](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/resolving-forces-inclined-planes-and-friction/coefficient-of-friction/) — REMAINING.** Introduces the coefficient of friction, the bound F ≤ μR, limiting equilibrium and the friction model for moving objects.
- **3.3.3 [Coefficient of Friction - F = ma](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/resolving-forces-inclined-planes-and-friction/friction-and-f-equals-ma/) — REMAINING.** Finds normal reaction and friction on horizontal surfaces, resolves angled applied forces, and uses Newton’s second law to calculate acceleration.
- **3.3.4 [Coefficient of Friction & Inclined Planes](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/resolving-forces-inclined-planes-and-friction/friction-and-inclined-planes/) — REMAINING.** Resolves forces parallel and perpendicular to rough slopes, calculates friction, and determines equilibrium or acceleration along the plane.
- **3.3.5 [Coefficient of Friction (Harder Problems)](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/resolving-forces-inclined-planes-and-friction/coefficient-of-friction-harder-problems/) — REMAINING.** Handles friction inequalities, limiting equilibrium and connected particles on rough slopes, including determining the impending direction of motion.

### 4. [Energy, Work & Power](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/)

#### 4.1. [Work & Energy](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/#collapse-top-6tXPCSFcsY9JZ9f5)

- **4.1.1 [Work](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/energy-work-and-power/work-and-energy/work/) — REMAINING.** Calculates work from the force component along displacement, including work against friction and gravity on horizontal surfaces and slopes.
- **4.1.2 [Energy](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/energy-work-and-power/work-and-energy/energy/) — REMAINING.** Calculates kinetic and gravitational potential energy, their changes, and the connection between work and change in kinetic energy.
- **4.1.3 [Energy Principles](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/energy-work-and-power/work-and-energy/energy-principles/) — REMAINING.** Balances kinetic energy, gravitational potential energy and external work, including conservation of mechanical energy and motion on slopes.

#### 4.2. [Power](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/#collapse-top-D2wjh9jSx7tZGBFZ)

- **4.2.1 [Power](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/energy-work-and-power/power/power/) — REMAINING.** Calculates power from work per time or driving force times speed, including vehicle maximum-speed problems and power-unit conversions.

### 5. [Momentum](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/)

#### 5.1. [Momentum & Collisions](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/#collapse-top-Ntgpx5XFKvX6nnxc)

- **5.1.1 [Momentum](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/momentum/momentum-and-collisions/momentum/) — REMAINING.** Defines momentum as mass times velocity, explains its units and direction, and discusses momentum transfer between interacting objects.
- **5.1.2 [Direct Collisions](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/momentum/momentum-and-collisions/direct-collisions/) — REMAINING.** Uses conservation of momentum for direct collisions, coalescence and explosions, with before-and-after diagrams and consistent velocity signs.
- **5.1.3 [Multiple Collisions](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/momentum/momentum-and-collisions/multiple-collisions/) — REMAINING.** Analyses successive particle or wall collisions, tests whether further collisions occur, and considers momentum or kinetic-energy changes.

## Remaining leaves: candidate video queue

Flat queue in current site order, excluding exactly the four covered leaves. Queue numbers are separate from the hierarchical map positions. **27 candidates.**

1. **1.1.5 [Modelling Assumptions](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/mechanics-toolkit/quantities-units-and-modelling/modelling-assumptions/)** — Section: Mechanics Toolkit; topic: Quantities, Units & Modelling.
2. **2.1.1 [Displacement-Time Graphs](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/kinematics-straight-line-motion/kinematics-graphs/displacement-time-graphs/)** — Section: Kinematics (Straight Line Motion); topic: Kinematics Graphs.
3. **2.1.2 [Velocity-Time Graphs](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/kinematics-straight-line-motion/kinematics-graphs/velocity-time-graphs/)** — Section: Kinematics (Straight Line Motion); topic: Kinematics Graphs.
4. **2.1.3 [Drawing Travel Graphs](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/kinematics-straight-line-motion/kinematics-graphs/drawing-travel-graphs/)** — Section: Kinematics (Straight Line Motion); topic: Kinematics Graphs.
5. **2.2.1 [Using Calculus in 1D](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/kinematics-straight-line-motion/variable-acceleration/using-calculus-in-1d/)** — Section: Kinematics (Straight Line Motion); topic: Variable Acceleration.
6. **2.3.1 [Deriving the suvat Formulae](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/kinematics-straight-line-motion/constant-acceleration/deriving-the-suvat-formulae/)** — Section: Kinematics (Straight Line Motion); topic: Constant Acceleration.
7. **2.3.2 [suvat in 1D](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/kinematics-straight-line-motion/constant-acceleration/suvat-in-1d/)** — Section: Kinematics (Straight Line Motion); topic: Constant Acceleration.
8. **2.3.3 [Acceleration due to Gravity](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/kinematics-straight-line-motion/constant-acceleration/acceleration-due-to-gravity/)** — Section: Kinematics (Straight Line Motion); topic: Constant Acceleration.
9. **3.1.1 [Force Diagrams](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/forces/force-diagrams/)** — Section: Forces & Equilibrium; topic: Forces.
10. **3.1.2 [Equilibrium in 1D](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/forces/equilibrium-in-1d/)** — Section: Forces & Equilibrium; topic: Forces.
11. **3.1.3 [Equilibrium in 2D](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/forces/equilibrium-in-2d/)** — Section: Forces & Equilibrium; topic: Forces.
12. **3.2.1 [F = ma](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/newtons-second-law/f-equals-ma/)** — Section: Forces & Equilibrium; topic: Newton's Second Law.
13. **3.2.2 [Connected Bodies (Ropes & Tow Bars)](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/newtons-second-law/connected-bodies-ropes-and-tow-bars/)** — Section: Forces & Equilibrium; topic: Newton's Second Law.
14. **3.2.3 [Connected Bodies (Lifts)](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/newtons-second-law/connected-bodies-lifts/)** — Section: Forces & Equilibrium; topic: Newton's Second Law.
15. **3.2.4 [Connected Bodies (Pulleys)](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/newtons-second-law/connected-bodies-pulleys/)** — Section: Forces & Equilibrium; topic: Newton's Second Law.
16. **3.3.1 [Resolving Forces & Inclined Planes](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/resolving-forces-inclined-planes-and-friction/resolving-forces-and-inclined-planes/)** — Section: Forces & Equilibrium; topic: Resolving Forces, Inclined Planes & Friction.
17. **3.3.2 [Coefficient of Friction](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/resolving-forces-inclined-planes-and-friction/coefficient-of-friction/)** — Section: Forces & Equilibrium; topic: Resolving Forces, Inclined Planes & Friction.
18. **3.3.3 [Coefficient of Friction - F = ma](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/resolving-forces-inclined-planes-and-friction/friction-and-f-equals-ma/)** — Section: Forces & Equilibrium; topic: Resolving Forces, Inclined Planes & Friction.
19. **3.3.4 [Coefficient of Friction & Inclined Planes](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/resolving-forces-inclined-planes-and-friction/friction-and-inclined-planes/)** — Section: Forces & Equilibrium; topic: Resolving Forces, Inclined Planes & Friction.
20. **3.3.5 [Coefficient of Friction (Harder Problems)](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/forces-and-equilibrium/resolving-forces-inclined-planes-and-friction/coefficient-of-friction-harder-problems/)** — Section: Forces & Equilibrium; topic: Resolving Forces, Inclined Planes & Friction.
21. **4.1.1 [Work](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/energy-work-and-power/work-and-energy/work/)** — Section: Energy, Work & Power; topic: Work & Energy.
22. **4.1.2 [Energy](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/energy-work-and-power/work-and-energy/energy/)** — Section: Energy, Work & Power; topic: Work & Energy.
23. **4.1.3 [Energy Principles](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/energy-work-and-power/work-and-energy/energy-principles/)** — Section: Energy, Work & Power; topic: Work & Energy.
24. **4.2.1 [Power](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/energy-work-and-power/power/power/)** — Section: Energy, Work & Power; topic: Power.
25. **5.1.1 [Momentum](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/momentum/momentum-and-collisions/momentum/)** — Section: Momentum; topic: Momentum & Collisions.
26. **5.1.2 [Direct Collisions](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/momentum/momentum-and-collisions/direct-collisions/)** — Section: Momentum; topic: Momentum & Collisions.
27. **5.1.3 [Multiple Collisions](https://www.savemyexams.com/a-level/maths/cie/20/mechanics/revision-notes/momentum/momentum-and-collisions/multiple-collisions/)** — Section: Momentum; topic: Momentum & Collisions.

## Public access and completeness notes

- **31 of 31 leaves returned HTTP 200 at the listed URLs, with substantive note explanations in the unauthenticated HTML. No full-page login wall, login redirect, HTTP denial or unreadable leaf was encountered.** Thus there are no blocked-leaf URLs to list for this check.
- **All 31 leaf URLs above contain an “Unlock more, it’s free!” signup prompt after the note content.** This is recorded as a signup prompt alongside readable material, not as evidence that the fetched explanations required login. Browser-side quotas or restrictions after JavaScript execution were not tested.
- Worked-example solutions and some equations or diagrams are images, so a text-only extraction can show an “Answer:” label without the image’s contents. That alone is not a login wall. Summaries were based on readable explanatory text, without trying to recover restricted content.
- No login, registration, credential entry or access-control bypass was attempted. The note-fetch sequence retained server-set cookies in one curl cookie jar. PDF download and signup actions were not followed, and their access requirements are unverified.
- This is a dated snapshot of the public course index, not a claim about future rearrangements or historical numbering. The hierarchy contains **5 sections, 10 topics and 31 unique note leaves**; **4 are already covered and 27 remain**.
