# Modelling assumptions — five-minute revision

## What a model does

A mathematical model is a deliberately simplified description of a real system. It keeps the features that control the question and replaces them with variables, diagrams, equations or graphs. We simplify because exact reality may include deformation, drag, uneven mass, changing gravity and awkward shapes that add work without improving the required answer.

The modelling cycle is:

1. choose the system and assumptions;
2. solve the resulting mathematics;
3. translate the result back into the situation;
4. check size, sign, units and physical plausibility;
5. refine an assumption if the answer is not good enough.

An assumption is not a claim that the real object is perfect. It states which effects are small enough to leave out for this purpose.

## The 9709 vocabulary

| Term | What it means in the model | What you may ignore or infer |
|---|---|---|
| **Particle** | The body’s size and shape are negligible, although its mass is not. | Treat all forces as meeting at one point; ignore orientation and rotation. Drag is **not** removed automatically. |
| **Light string** | String mass is negligible compared with the attached bodies. | Ignore the string’s weight and inertia. Tension is uniform along an unobstructed light string; crossing a redirector also needs that pulley or peg to be smooth. |
| **Light rod** | Rod mass is negligible. | Ignore its own weight and inertia. It may still transmit tension or thrust. |
| **Light pulley** | Pulley mass and rotational inertia are negligible. | Ignore pulley weight and the torque needed to spin it. “Light” alone does not mean frictionless; “smooth” supplies that condition. |
| **Inextensible string** | Its length is fixed while it is taut. | Connected points have equal speed and acceleration magnitudes along the string. A slack string gives no such constraint and carries no tension. |
| **Smooth surface or plane** | There is no friction at the contact. | Include only the normal reaction from the surface; omit tangential friction. |
| **Smooth pulley or peg** | The string slides around the redirector without friction. | Use the same tension magnitude on both sides, provided the string is light. |
| **Rough surface or plane** | Friction can act at the contact. | Draw friction against actual or impending relative motion. In equilibrium (0\leq F\leq\mu R); use (F=\mu R) only at limiting friction or when the stated sliding model permits it. |
| **Rigid rod** | The distance between its ends cannot change. | Ignore bending and extension. End points retain a fixed separation; the rod can push or pull. |
| **Uniform rod** | Mass per unit length is constant. | Place its weight at the midpoint in a uniform gravitational field. |
| **Uniform lamina** | Mass per unit area is constant. | Put its centre of mass at the geometric centroid when the shape permits the centroid to be found. |
| **Beam** | A long, slender extended body, normally treated as rigid. | Retain its length and force positions for moments. Do not collapse it to a particle when turning effects matter. |
| **Bead** | A small body constrained to remain on a wire or rod. | Treat it as a particle on a prescribed path. If the contact is smooth, the support force is normal to the wire and there is no tangential friction. |
| **Wire** | A thin fixed path that constrains a bead. | Ignore the wire’s thickness. “Smooth wire” removes friction; “wire” by itself does not. |
| **Peg** | A fixed support that changes a string’s direction. | A smooth peg keeps tension equal across it. A rough peg may support different tensions. |
| **Lamina** | A flat sheet whose thickness is negligible. | Work in its plane and ignore thickness; mass and moments still matter unless it is also light. |
| **Plane** | A flat rigid contact surface, often inclined. | Reaction is perpendicular to the plane. Friction depends on whether the plane is smooth or rough. |
| **Air resistance neglected** | Fluid drag is taken as zero. | Omit drag from the force diagram. A released projectile then has acceleration (g) vertically downward, subject to the model’s constant-gravity assumption. |

## How to spot the intended assumption

Work backwards from the simplification the question needs.

- One force point and no rotational detail suggest **particle**.
- No string weight suggests **light**; equal tension through a pulley also needs a **smooth** redirector.
- Equal acceleration magnitudes along a taut connector suggest **inextensible string**.
- No tangential contact force means **smooth**; a friction term or coefficient signals **rough**.
- A fixed distance between connector ends means **rigid rod**.
- Weight at the midpoint of a rod, or at a lamina’s centroid, needs **uniform** mass distribution.
- Motion confined to a line or curve suggests a **bead on a wire**; its reaction is normal only when the contact is smooth.
- Constant vertical acceleration with no drag term signals constant gravity and **air resistance neglected**. In 9709, resistance such as air drag is normally included only when the question says so.

If an assumption is dropped, restore the missing physics: finite size permits rotation; a massive connector contributes weight and inertia; an extensible string allows different endpoint motions; a rough contact adds friction; a non-rigid rod deforms; a non-uniform body moves its centre of mass; a rough pulley or peg permits unequal tensions; and air resistance makes acceleration depend on the motion.

## Four short worked examples

### 1. Two connected blocks

**Scenario:** A (3\text{ kg}) block lies on a horizontal table and is connected to a hanging (2\text{ kg}) block over a pulley. Take (g=9.8\text{ m s}^{-2}).

**State:** both blocks are particles; the table and pulley are smooth; the string is light, taut and inextensible; the pulley is light; air resistance is neglected.

**Use:** one tension (T) acts throughout and both acceleration magnitudes are (a). Hence (T=3a) and (2g-T=2a), giving (a=3.92\text{ m s}^{-2}) and (T=11.8\text{ N}) to three significant figures.

**Relax one:** if the table is rough, a friction term (F) appears and the system equation becomes (2g-F=5a), so the acceleration is smaller.

### 2. A stone released from a cliff

**Scenario:** A stone is released from rest (20\text{ m}) above water.

**State:** stone is a particle; gravity is constant and vertical; air resistance is neglected; the water level is a horizontal plane.

**Use:** (h=20-\tfrac12gt^2). With (g=9.8\text{ m s}^{-2}), (h=0) gives (t=\sqrt{40/9.8}=2.02\text{ s}).

**Relax one:** including drag reduces the downward acceleration after release, so impact occurs later than the no-drag prediction.

### 3. A supported uniform beam

**Scenario:** A horizontal uniform beam of length (4\text{ m}) and mass (6\text{ kg}) is hinged at its left end. A vertical cable supports the right end, and a (10\text{ kg}) particle rests (3\text{ m}) from the hinge.

**State:** beam is rigid and uniform; the load is a particle; the cable is light; gravity is uniform.

**Use:** the beam’s weight acts (2\text{ m}) from the hinge. Taking moments gives (4S=6g(2)+10g(3)), so the cable force is (S=10.5g=102.9\text{ N}).

**Relax one:** if the beam is non-uniform and its centre of mass is (x\text{ m}) from the hinge, replace (6g(2)) by (6gx); the support force changes.

### 4. A bead, wire and peg

**Scenario:** A bead of mass (m) slides on a straight inclined wire and is connected by a string over a peg to a hanging mass (M).

**State:** bead and hanging mass are particles; wire and peg are smooth; string is light, taut and inextensible; air resistance is neglected.

**Use:** the wire’s reaction is perpendicular to the wire, there is no friction along it, tension is the same on both sides of the peg, and the two acceleration magnitudes along the string are equal.

**Relax one:** if the peg is rough, the two tensions need not match, so separate tension symbols and equations are required.

## Self-check

1. Does “light pulley” mean “smooth pulley”?
2. Two particles are joined by a taut inextensible string over a pulley. What is equal about their accelerations?
3. Where does the weight of a uniform straight rod act?
4. A rough contact needs (6\text{ N}) of friction for equilibrium and has (mu R=10\text{ N}). What is the actual friction?
5. If a body is modelled as a particle, may air resistance automatically be omitted?

### Answers

1. No. Light removes pulley mass and rotational inertia; smooth removes friction.
2. Their components along the taut string have equal magnitudes; their vector directions may differ.
3. At its midpoint, in a uniform gravitational field.
4. (6\text{ N}), because static friction has not reached its limiting value.
5. No. Neglecting air resistance is a separate assumption.

## Common exam slips

- Treating **light** as both massless and frictionless. Light concerns mass; smooth concerns friction.
- Confusing **smooth** with **light**. A smooth massive pulley and a light rough pulley describe different models.
- Forgetting that an **inextensible** string gives equal acceleration magnitudes only while it is taut.
- Giving a string thrust. A string cannot push; it becomes slack.
- Assuming a particle has zero mass. It has negligible size, not negligible mass.
- Writing (F=\mu R) merely because a surface is rough. First establish limiting friction or the stated sliding model.
- Putting every object’s weight at its geometric centre without a uniformity or symmetry reason.
- Calling a beam a particle when moments depend on where forces act.
