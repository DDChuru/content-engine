# Coefficient of Friction and Inclined Planes

Cambridge 9709 Mechanics, M4.1f. Syllabus 4.1 excerpt: “limiting friction and limiting equilibrium”.

By the end you can:

- Resolve forces along a slope.
- Find reaction and decide the friction.
- Calculate the downhill acceleration.

## The complete problem

A 4 kg block, modelled as a particle, is released from rest on a rough straight plane inclined at θ = 30° to the horizontal. A constant force P = 8 N pulls at α = 30° above the **uphill direction of the plane**. The two angles have different reference lines, even though their numerical values are equal.

The coefficient of friction is μ = 0.25. Use g = 10 m s⁻². Contact is maintained; only weight, pull, normal reaction and friction act. In the ideal friction model used here, sliding friction equals its limiting value.

Find the normal reaction, decide whether the block slides, and find its actual friction and acceleration.

## 1. Resolve weight and pull

Choose axes parallel and perpendicular to the slope. Components replace their original force; do not add both the force and its components.

Weight:

\[
W=mg=4(10)=40\text{ N}.
\]

The angle between vertical weight and the inward normal is θ. Therefore:

\[
W_\perp=W\cos\theta=40\cos30^\circ=20\sqrt3\text{ N inward},
\]

\[
W_\parallel=W\sin\theta=40\sin30^\circ=20\text{ N downhill}.
\]

The pull's angle α is measured from the uphill slope direction. Its adjacent component is uphill and its opposite component is outward:

\[
H=P\cos\alpha=8\cos30^\circ=4\sqrt3\text{ N uphill},
\]

\[
V=P\sin\alpha=8\sin30^\circ=4\text{ N outward}.
\]

## 2. Find normal reaction

Contact with the straight plane is maintained, so perpendicular acceleration is zero. Taking outward as positive:

\[
\text{Resultant}=ma,\qquad R+V-W_\perp=0.
\]

\[
R+4-20\sqrt3=0,
\qquad \boxed{R=20\sqrt3-4\text{ N}}.
\]

This is positive (about 30.64 N), consistent with contact. The outward part of the pull supplies some support, so the surface provides less reaction than it would without that component.

## 3. Decide motion, then actual friction

At rest, the magnitude of friction adjusts to the required value up to a limit:

\[
f\leq\mu R,\qquad f_{\max}=\mu R.
\]

\[
f_{\max}=0.25(20\sqrt3-4)=5\sqrt3-1\text{ N}
\approx7.66\text{ N}.
\]

Before including friction, the downhill demand is:

\[
D=W_\parallel-H=20-4\sqrt3\text{ N}
\approx13.07\text{ N}.
\]

Because **13.07 N > 7.66 N**, friction cannot keep the released block at rest. It slides downhill, so friction acts uphill. Under the stated sliding model:

\[
\boxed{f=5\sqrt3-1\text{ N uphill}}.
\]

Do not set actual friction to μR before deciding whether the contact is sliding or limiting. Friction opposes sliding or impending sliding, rather than automatically opposing acceleration.

## 4. Find acceleration

Take downhill as positive. Apply Newton's second law along the slope:

\[
\text{Resultant}=ma,
\qquad W_\parallel-H-f=ma.
\]

\[
20-4\sqrt3-(5\sqrt3-1)=4a.
\]

Careful with the bracket: subtracting −1 adds 1.

\[
21-9\sqrt3=4a,
\qquad a=\frac{21-9\sqrt3}{4}.
\]

\[
\boxed{a\approx1.35\text{ m s}^{-2}\text{ downhill}}.
\]

Keep exact values until the final rounding. Constant forces give constant acceleration, so the block gains speed from rest and travels increasing distances in equal time intervals.

## Check your understanding

**What changes if the pull acts parallel to the plane instead?**

Its perpendicular component is zero. With contact maintained, perpendicular balance becomes:

\[
R-mg\cos\theta=0,
\qquad R=mg\cos\theta.
\]

The reaction and friction limit increase because the pull no longer supplies outward support. The uphill component also changes. Compare the new downhill demand with the new friction limit before deciding motion.

The shortcut R = mg cos θ works when other forces have no perpendicular component and perpendicular acceleration is zero. Always start from the perpendicular balance.
