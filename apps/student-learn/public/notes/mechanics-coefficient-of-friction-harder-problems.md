# Coefficient of friction: harder equilibrium problems

**Cambridge 9709 Mechanics — M4.1g; syllabus 4.1.**

Syllabus excerpt: “limiting friction and limiting equilibrium”.

By the end you can:

- Choose friction’s direction at each limit.
- Find the range of forces maintaining equilibrium.

## The complete problem

A particle of mass 4 kg rests on a fixed rough plane inclined at 30° to the horizontal. The coefficient of friction is 0.25 and g=10 m/s². A force P acts uphill, parallel to the line of greatest slope. Contact is maintained and there are no other applied forces. Find **both the minimum and maximum P** that keep the particle in equilibrium.

The block is stationary at both endpoints. “On the point of moving” means impending motion, not actual motion.

## Reaction and friction limit

Resolve perpendicular to the plane. P and friction have no perpendicular components in this problem:

\(
R-mg\cos\theta=0,\qquad R=mg\cos\theta.
\)

\(
R=4(10)\cos 30^\circ=20\sqrt 3\text{ N}.
\)

The downhill component of weight is

\(
W_{\parallel}=mg\sin\theta=4(10)\sin 30^\circ=20\text{ N}.
\)

Use the two components **in place of** the original weight when resolving. Do not count weight twice.

Actual friction magnitude satisfies f≤μR. At limiting equilibrium:

\(
f_{\max}=\mu R=0.25(20\sqrt 3)=5\sqrt 3\text{ N}.
\)

The cap is the same in both cases because P remains parallel to the slope and does not change R.

## Minimum P

The particle is on the point of slipping **downhill**, so limiting friction acts **uphill** and helps P. Parallel equilibrium gives

\(
P_{\min}+\mu R-mg\sin\theta=0.
\)

\(
P_{\min}+5\sqrt 3-20=0.
\)

\(
 P_{\min}=(20-5\sqrt 3)\text{ N}\approx 11.34\text{ N}.
\)

Any smaller P would require more uphill friction than the contact can supply.

## Maximum P

The particle is on the point of moving **uphill**, so limiting friction acts **downhill**. Parallel equilibrium gives

\(
P_{\max}-\mu R-mg\sin\theta=0.
\)

\(
P_{\max}-5\sqrt 3-20=0.
\)

\(
 P_{\max}=(20+5\sqrt 3)\text{ N}\approx 28.66\text{ N}.
\)

Any larger P would exceed the combined downhill weight component and maximum friction.

Thus the exact equilibrium interval, with P measured in newtons, is

\(
\boxed{20-5\sqrt 3\le P\le 20+5\sqrt 3}.
\)

Both endpoints are included. Decimal endpoint values are approximations and should not replace the exact interval when testing values very close to a boundary.

## Check: inside the interval

What happens when P exactly balances the downhill weight component?

Take uphill as positive and use signed uphill friction f:

\(
P-W_{\parallel}+f=0.
\)

At P=20 N,

\(
20-20+f=0\quad\Longrightarrow\quad f=0.
\)

Below this balancing force, friction acts uphill; above it, friction acts downhill, provided P stays in the equilibrium interval. Static friction adjusts to what is needed. It equals μR only at the endpoints here.

## Remember

First identify the direction of **impending** motion; friction points the opposite way. Find R from perpendicular equilibrium before using μR. Write the general balance equation before substituting values. A limiting-equilibrium block has zero resultant force and remains stationary.

