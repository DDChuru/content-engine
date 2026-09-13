# Resolving Forces & Inclined Planes

Syllabus 4.1: force components and the model of a smooth contact; Newton's second law applied in chosen directions.

By the end you can:

- Resolve an angled force.
- Find mass and reaction.
- Choose components on a slope.

## Resolve using the marked angle

A force **F** at angle **θ above the horizontal** is the hypotenuse of a right triangle. Its horizontal and vertical components are

\[
H=F\cos\theta,\qquad V=F\sin\theta.
\]

The horizontal side is adjacent to this angle; the vertical side is opposite. If the angle is measured from the vertical, these roles swap. Check the diagram rather than memorising “horizontal means cosine”.

The two components together have the same effect as the original force. **Use the components in place of the original force.** Do not count the original and its components as three independent forces.

For several forces, choose positive directions and add signed components separately along each axis. The vector sum of those two totals is the resultant.

## Worked example: pulling a box

A box is pulled along a **smooth horizontal floor** by a force of **20 N at 60° above the horizontal**. It accelerates **rightwards at 2 m s⁻²** and remains in contact with the floor. Take **g = 10 m s⁻²**. Only the pull, weight and normal reaction act. Find its mass **m** and upward normal reaction **R**.

The box speeds up to the right while staying at the same height. Smooth means no friction.

### 1. Resolve the pull

\[
H=F\cos\theta
 =20\cos60^\circ=10\text{ N rightwards}.
\]

\[
V=F\sin\theta
 =20\sin60^\circ=10\sqrt3\text{ N upwards}.
\]

Keep the exact value \(10\sqrt3\) during the calculation.

### 2. Find mass using horizontal motion

Newton's second law is

\[
F_{\text{resultant}}=ma.
\]

Taking right as positive, only H contributes horizontally:

\[
H=ma,\qquad 10=2m.
\]

\[
m=\frac{10}{2}=\boxed{5\text{ kg}}.
\]

Weight and normal reaction do not enter this horizontal equation because both act vertically.

### 3. Find normal reaction using vertical balance

The box stays on the horizontal floor, so vertical acceleration is zero. Taking up as positive,

\[
F_{\text{resultant, vertical}}=ma_{\text{vertical}},
\]

\[
R+V-mg=0.
\]

Substitute the known values:

\[
R+10\sqrt3-5(10)=0,
\]

\[
R=50-10\sqrt3
 =\boxed{32.7\text{ N}}\quad\text{(3 s.f.)}.
\]

The upward pull carries part of the weight, so the floor's support is less than the weight 50 N. The positive reaction is consistent with contact being maintained. The vertical component matters even though vertical acceleration is zero.

## Extend the method to a slope

Consider a straight **smooth ramp inclined at θ to the horizontal**. The box remains in contact, and any applied force **P acts along the slope**. Only P, weight and normal reaction act.

Choose axes **parallel and perpendicular to the ramp**. Reaction already acts perpendicular to the surface; weight **mg still acts vertically downwards**.

To identify the angle in the weight triangle, rotate the horizontal and the ramp through a right angle. They become the vertical and the inward normal, so their angle remains θ. In that right triangle, mg is the hypotenuse:

\[
W_{\perp}=mg\cos\theta\quad\text{into the ramp},
\]

\[
W_{\parallel}=mg\sin\theta\quad\text{down the ramp}.
\]

The inward component is adjacent to θ; the downhill component is opposite. These components replace the weight in the corresponding equations.

Because contact is maintained and there are no additional perpendicular forces, perpendicular acceleration is zero:

\[
R-mg\cos\theta=0
\quad\Rightarrow\quad R=mg\cos\theta.
\]

**R=mgcosθ is conditional.** An extra push into the ramp or pull away from it changes the normal-force equation.

Along the smooth slope, taking uphill as positive, Newton's second law gives

\[
F_{\text{resultant, parallel}}=ma,
\]

\[
P-mg\sin\theta=ma.
\]

The sign of the resulting a tells you the acceleration direction. No friction coefficient is needed for a smooth surface.

## Check your understanding

If θ is measured from the vertical, is the horizontal component Fcosθ?

No. The horizontal side is then opposite θ, so its component is **Fsinθ**. Adjacent uses cosine; opposite uses sine.
