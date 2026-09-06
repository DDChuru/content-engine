# 9709 Mechanics recordings and PDFs inventory

Inventory date: 2026-09-06

## Scope and method

- Sources were read in place from `/home/dachu/Documents/9709` and `/home/dachu/Videos/Screencasts`; no source file was modified or moved.
- Video duration, resolution, streams, and size come from `ffprobe`/`stat`. Size is shown in binary units (MiB/KiB), and duration is rounded to the nearest second.
- The topic/title column combines the filename with visual inspection of frames at 10%, 50%, and 90% of each recording. Byte-identical files were sampled once and the result applied to both paths.
- "Likely 2x" is an inference from an unusually short duration for the matching PDF section's page span. The sampled player controls did not show a literal `2x` label.
- "Duplicate" in the mapping column means duplicate coverage of one of the four already completed topics. It is separate from a byte-identical storage copy.

## Counts and copy relationships

- Videos: **59 physical files**, representing **33 distinct byte streams**.
- PDFs: **10**.
- Completed-topic mapping: **5 physical videos duplicate completed topic coverage**; **54 are classified as new**. Among distinct byte streams, that is **5 duplicate-topic streams** and **28 new streams**; one of the 28 new streams is non-lesson/mislabeled footage and should not be processed.
- The 26 MP4s in `/home/dachu/Documents/9709` are byte-for-byte identical to same-named files in `/home/dachu/Videos/Screencasts`. Use the `Documents/9709` copy as the canonical processing source and do not process both.
- `scalars and vectors.mp4` is not a lesson recording despite its filename: all three samples show terminal/Codex/remote-desktop footage. The usable Scalars & Vectors material is in the two timestamp-named screencasts.

## Videos and completed-topic mapping

| Path | Filename | Size | Duration | Resolution | Audio | Best topic guess / on-screen title | Speed flag | Completed-topic mapping |
|---|---|---:|---:|---:|:---:|---|---|---|
| `/home/dachu/Documents/9709` | `AccelerationDueToGravity.mp4` | 12.7 MiB | 5:16 | 1920x1200 | No | Acceleration due to Gravity | No 2x evidence | New |
| `/home/dachu/Documents/9709` | `ConnectedBodiesLifts.mp4` | 23.5 MiB | 9:11 | 1920x1200 | No | Connected Bodies - The Lift Problem | No 2x evidence | New |
| `/home/dachu/Documents/9709` | `ConnectedBodiesPullies.mp4` | 26.6 MiB | 10:48 | 1920x1200 | No | Connected Bodies - Pulleys | No 2x evidence | New |
| `/home/dachu/Documents/9709` | `ConnectedBodiesRopesandTowBars.mp4` | 19.8 MiB | 7:44 | 1920x1200 | No | Connected Bodies - Ropes & Tow Bars | Likely 2x (short/page) | New |
| `/home/dachu/Documents/9709` | `DerivingTheSuvatEquations.mp4` | 11.9 MiB | 5:06 | 1920x1200 | No | Deriving the suvat Formulae | No 2x evidence | New |
| `/home/dachu/Documents/9709` | `DisplacementtimeGraphs.mp4` | 8.7 MiB | 3:59 | 1888x1124 | No | Displacement-Time Graphs | Likely 2x (short/page) | New |
| `/home/dachu/Documents/9709` | `DrawingTravelGraphs.mp4` | 11.3 MiB | 4:12 | 1920x1200 | No | Drawing Travel Graphs | No 2x evidence | New |
| `/home/dachu/Documents/9709` | `Equilibrum1d.mp4` | 5.5 MiB | 2:12 | 1920x1200 | No | Equilibrium in 1D | Likely 2x (short/page) | New |
| `/home/dachu/Documents/9709` | `Equilibrumin2d.mp4` | 5.3 MiB | 2:08 | 1920x1200 | No | Equilibrium in 2D | Likely 2x (short/page) | New |
| `/home/dachu/Documents/9709` | `ForceDiagrams.mp4` | 13.9 MiB | 6:36 | 1920x1200 | No | Force Diagrams | No 2x evidence | New |
| `/home/dachu/Documents/9709` | `KineticEnergy.mp4` | 3.5 MiB | 1:19 | 1920x1200 | No | Kinetic Energy | Likely 2x (short/page) | New |
| `/home/dachu/Documents/9709` | `Momentum.mp4` | 3.3 MiB | 1:07 | 1920x1200 | No | Momentum | Likely 2x (short/page) | New |
| `/home/dachu/Documents/9709` | `Power.mp4` | 7.8 MiB | 2:58 | 1920x1200 | No | Power | Likely 2x (short/page) | New |
| `/home/dachu/Documents/9709` | `SuvatIn1D.mp4` | 16.3 MiB | 6:43 | 1920x1200 | No | SUVAT in 1D | No 2x evidence | New |
| `/home/dachu/Documents/9709` | `VariableAccelerationUsingCalculusin1D.mp4` | 14.5 MiB | 6:04 | 1920x1200 | No | Using Calculus in 1D (variable acceleration) | No 2x evidence | New |
| `/home/dachu/Documents/9709` | `VelocityTimeGraphs.mp4` | 10.3 MiB | 4:07 | 1920x1200 | No | Velocity-Time Graphs | Likely 2x (short/page) | New |
| `/home/dachu/Documents/9709` | `coefficientofFrictionF=ma.mp4` | 6.3 MiB | 2:20 | 1920x1200 | No | Coefficient of Friction - F=ma | Likely 2x (short/page) | New |
| `/home/dachu/Documents/9709` | `coefficientofFrictionandinclineproblems.mp4` | 7.7 MiB | 2:10 | 1920x1200 | No | Coefficient of Friction - Inclined Planes | Likely 2x (short/page) | New |
| `/home/dachu/Documents/9709` | `coefficientoffrictionequilibrum.mp4` | 9.4 MiB | 2:51 | 1920x1200 | No | Coefficient of Friction - Equilibrium | Likely 2x (short/page) | New |
| `/home/dachu/Documents/9709` | `directCollisions.mp4` | 9.6 MiB | 3:31 | 1920x1200 | No | Direct Collisions | Likely 2x (short/page) | New |
| `/home/dachu/Documents/9709` | `energyprinciples.mp4` | 8.9 MiB | 2:58 | 1920x1200 | No | Work-Energy Principle | Likely 2x (short/page) | New |
| `/home/dachu/Documents/9709` | `f=ma.mp4` | 16.8 MiB | 7:41 | 1920x1200 | No | F=ma / Newton's laws | No 2x evidence | New |
| `/home/dachu/Documents/9709` | `modellingAssumptions.mp4` | 16.5 MiB | 6:19 | 1888x1124 | No | Modelling Assumptions | No 2x evidence | New |
| `/home/dachu/Documents/9709` | `multiplecollisions.mp4` | 9.0 MiB | 2:47 | 1920x1200 | No | Multiple Collisions | Likely 2x (short/page) | New |
| `/home/dachu/Documents/9709` | `resolvingforcesandinclineproblems.mp4` | 6.9 MiB | 2:20 | 1920x1200 | No | Resolving Forces | Likely 2x (short/page) | New |
| `/home/dachu/Documents/9709` | `work.mp4` | 9.3 MiB | 3:06 | 1920x1200 | No | Work | Likely 2x (short/page) | New |
| `/home/dachu/Videos/Screencasts` | `AccelerationDueToGravity.mp4` | 12.7 MiB | 5:16 | 1920x1200 | No | Acceleration due to Gravity | No 2x evidence | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `ConnectedBodiesLifts.mp4` | 23.5 MiB | 9:11 | 1920x1200 | No | Connected Bodies - The Lift Problem | No 2x evidence | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `ConnectedBodiesPullies.mp4` | 26.6 MiB | 10:48 | 1920x1200 | No | Connected Bodies - Pulleys | No 2x evidence | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `ConnectedBodiesRopesandTowBars.mp4` | 19.8 MiB | 7:44 | 1920x1200 | No | Connected Bodies - Ropes & Tow Bars | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `DerivedUnits.mp4` | 6.6 MiB | 5:05 | 1228x880 | No | Derived Units | No 2x evidence | **Duplicate: Derived units** |
| `/home/dachu/Videos/Screencasts` | `DerivingTheSuvatEquations.mp4` | 11.9 MiB | 5:06 | 1920x1200 | No | Deriving the suvat Formulae | No 2x evidence | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `DisplacementtimeGraphs.mp4` | 8.7 MiB | 3:59 | 1888x1124 | No | Displacement-Time Graphs | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `DrawingTravelGraphs.mp4` | 11.3 MiB | 4:12 | 1920x1200 | No | Drawing Travel Graphs | No 2x evidence | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `Equilibrum1d.mp4` | 5.5 MiB | 2:12 | 1920x1200 | No | Equilibrium in 1D | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `Equilibrumin2d.mp4` | 5.3 MiB | 2:08 | 1920x1200 | No | Equilibrium in 2D | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `ForceDiagrams.mp4` | 13.9 MiB | 6:36 | 1920x1200 | No | Force Diagrams | No 2x evidence | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `KineticEnergy.mp4` | 3.5 MiB | 1:19 | 1920x1200 | No | Kinetic Energy | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `Momentum.mp4` | 3.3 MiB | 1:07 | 1920x1200 | No | Momentum | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `Power.mp4` | 7.8 MiB | 2:58 | 1920x1200 | No | Power | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `SIUnits.mp4` | 9.9 MiB | 4:04 | 1920x1106 | No | Fundamental Units (S.I. units) | No 2x evidence | **Duplicate: S.I. units** |
| `/home/dachu/Videos/Screencasts` | `Screencast from 2026-09-05 09-25-22.mp4` | 752.5 KiB | 0:17 | 1310x814 | No | Scalars & Vectors title/intro fragment | No 2x evidence | **Duplicate: Scalars and vectors** (fragment) |
| `/home/dachu/Videos/Screencasts` | `Screencast from 2026-09-05 09-26-14.mp4` | 14.9 MiB | 5:58 | 1920x1106 | No | Scalars & Vectors lesson | No 2x evidence | **Duplicate: Scalars and vectors** |
| `/home/dachu/Videos/Screencasts` | `SuvatIn1D.mp4` | 16.3 MiB | 6:43 | 1920x1200 | No | SUVAT in 1D | No 2x evidence | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `Types ofForces.mp4` | 9.0 MiB | 6:36 | 1228x880 | No | Types of Force | No 2x evidence | **Duplicate: Types of force** |
| `/home/dachu/Videos/Screencasts` | `VariableAccelerationUsingCalculusin1D.mp4` | 14.5 MiB | 6:04 | 1920x1200 | No | Using Calculus in 1D (variable acceleration) | No 2x evidence | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `VelocityTimeGraphs.mp4` | 10.3 MiB | 4:07 | 1920x1200 | No | Velocity-Time Graphs | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `coefficientofFriction.mp4` | 8.1 MiB | 2:52 | 1920x1200 | No | Coefficient of Friction | Likely 2x (short/page) | New |
| `/home/dachu/Videos/Screencasts` | `coefficientofFrictionF=ma.mp4` | 6.3 MiB | 2:20 | 1920x1200 | No | Coefficient of Friction - F=ma | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `coefficientofFrictionandinclineproblems.mp4` | 7.7 MiB | 2:10 | 1920x1200 | No | Coefficient of Friction - Inclined Planes | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `coefficientoffrictionequilibrum.mp4` | 9.4 MiB | 2:51 | 1920x1200 | No | Coefficient of Friction - Equilibrium | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `directCollisions.mp4` | 9.6 MiB | 3:31 | 1920x1200 | No | Direct Collisions | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `energyprinciples.mp4` | 8.9 MiB | 2:58 | 1920x1200 | No | Work-Energy Principle | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `f=ma.mp4` | 16.8 MiB | 7:41 | 1920x1200 | No | F=ma / Newton's laws | No 2x evidence | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `modellingAssumptions.mp4` | 16.5 MiB | 6:19 | 1888x1124 | No | Modelling Assumptions | No 2x evidence | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `multiplecollisions.mp4` | 9.0 MiB | 2:47 | 1920x1200 | No | Multiple Collisions | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `resolvingforcesandinclineproblems.mp4` | 6.9 MiB | 2:20 | 1920x1200 | No | Resolving Forces | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |
| `/home/dachu/Videos/Screencasts` | `scalars and vectors.mp4` | 8.5 MiB | 4:09 | 1310x814 | No | **Content mismatch:** terminal/Codex/remote desktop, not a Mechanics lesson | N/A | New, but non-lesson/unusable |
| `/home/dachu/Videos/Screencasts` | `work.mp4` | 9.3 MiB | 3:06 | 1920x1200 | No | Work | Likely 2x (short/page) | New (exact copy of `Documents/9709` file) |

## PDFs

| Path | Filename | Pages | Page 1 title |
|---|---|---:|---|
| `/home/dachu/Documents/9709` | `ConstatAcceleration.pdf` | 13 | Constant Acceleration |
| `/home/dachu/Documents/9709` | `Forces.pdf` | 9 | Forces |
| `/home/dachu/Documents/9709` | `KinematicsGraphs.pdf` | 12 | Kinematics Graphs |
| `/home/dachu/Documents/9709` | `MomentumandCollisions.pdf` | 10 | Momentum & Collisions |
| `/home/dachu/Documents/9709` | `NewtonSecondlaw.pdf` | 22 | Newton's Second Law |
| `/home/dachu/Documents/9709` | `ResolvingForcesInclinedPlanesandFriction.pdf` | 19 | Resolving Forces, Inclined Planes & Friction |
| `/home/dachu/Documents/9709` | `Variable Acceleration.pdf` | 4 | Variable Acceleration |
| `/home/dachu/Documents/9709` | `power.pdf` | 4 | Power |
| `/home/dachu/Documents/9709` | `quantities, units andModelling .pdf` | 15 | Quantities, Units & Modelling |
| `/home/dachu/Documents/9709` | `workandenergy.pdf` | 16 | Work & Energy |

## Recommended processing order for new lesson recordings

Process only one canonical copy of each recording. The paths below use `/home/dachu/Documents/9709` except `coefficientofFriction.mp4`, which exists only in `/home/dachu/Videos/Screencasts`. Use a **1 s** frame-sampling interval for likely sped-up recordings and **3 s** otherwise.

### Forces and equilibrium

| Order | Recording | Why here | Frame interval |
|---:|---|---|---:|
| 1 | `modellingAssumptions.mp4` | Foundation for force models and diagrams | 3 s |
| 2 | `ForceDiagrams.mp4` | Force representation before equilibrium | 3 s |
| 3 | `resolvingforcesandinclineproblems.mp4` | Components needed for 2D equilibrium and slopes | **1 s** |
| 4 | `Equilibrum1d.mp4` | Basic equilibrium | **1 s** |
| 5 | `Equilibrumin2d.mp4` | Extends equilibrium to components | **1 s** |
| 6 | `coefficientofFriction.mp4` | Introduces friction; use the Screencasts-only file | **1 s** |
| 7 | `coefficientoffrictionequilibrum.mp4` | Friction in equilibrium | **1 s** |
| 8 | `coefficientofFrictionF=ma.mp4` | Friction with acceleration | **1 s** |
| 9 | `coefficientofFrictionandinclineproblems.mp4` | Friction on inclined planes | **1 s** |

### Kinematics

| Order | Recording | Why here | Frame interval |
|---:|---|---|---:|
| 1 | `DerivingTheSuvatEquations.mp4` | Establishes the constant-acceleration formulae | 3 s |
| 2 | `SuvatIn1D.mp4` | Applies the formulae in one dimension | 3 s |
| 3 | `AccelerationDueToGravity.mp4` | Special case of constant acceleration | 3 s |
| 4 | `DisplacementtimeGraphs.mp4` | First graph representation | **1 s** |
| 5 | `VelocityTimeGraphs.mp4` | Links gradient and area to motion | **1 s** |
| 6 | `DrawingTravelGraphs.mp4` | Synthesizes displacement-time and velocity-time graphs | 3 s |
| 7 | `VariableAccelerationUsingCalculusin1D.mp4` | Calculus extension after constant acceleration and graphs | 3 s |

### Momentum

| Order | Recording | Why here | Frame interval |
|---:|---|---|---:|
| 1 | `Momentum.mp4` | Defines momentum and conservation | **1 s** |
| 2 | `directCollisions.mp4` | First collision application | **1 s** |
| 3 | `multiplecollisions.mp4` | More complex collision sequences | **1 s** |

### Newton's laws

| Order | Recording | Why here | Frame interval |
|---:|---|---|---:|
| 1 | `f=ma.mp4` | Core Newton's-law model | 3 s |
| 2 | `ConnectedBodiesRopesandTowBars.mp4` | Introductory connected-body systems | **1 s** |
| 3 | `ConnectedBodiesLifts.mp4` | Vertical connected-body application | 3 s |
| 4 | `ConnectedBodiesPullies.mp4` | Most involved connected-body application | 3 s |

### Energy, work, and power

| Order | Recording | Why here | Frame interval |
|---:|---|---|---:|
| 1 | `work.mp4` | Defines work before energy principles | **1 s** |
| 2 | `KineticEnergy.mp4` | Introduces kinetic energy and change in kinetic energy | **1 s** |
| 3 | `energyprinciples.mp4` | Applies the work-energy principle | **1 s** |
| 4 | `Power.mp4` | Concludes with rate of doing work | **1 s** |

### Exclusion

- Do not process `/home/dachu/Videos/Screencasts/scalars and vectors.mp4` as lesson content. Its sampled frames contain unrelated terminal/Codex/remote-desktop footage.
