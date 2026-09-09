# Acceleration due to gravity — five-minute revision

## The model

For vertical motion close to Earth’s surface, a particle moving freely under gravity has constant acceleration vertically downwards. In Cambridge 9709 Paper 4, use

\(g=10\text{ m s}^{-2}\)

unless the question explicitly gives another value. Air resistance is ignored. The direction of motion can change, but the acceleration due to gravity does not: it remains downward before, at and after the highest point.

The constant-acceleration equations therefore apply. The most useful are

\(v=u+at\)

\(s=ut+\frac12at^2\)

\(v^2=u^2+2as\)

where \(s\), \(u\), \(v\) and \(a\) are signed quantities measured using one fixed positive direction.

## Choose a sign convention

Draw a vertical arrow showing the positive direction before substituting values.

If upward is positive, then

\(a=-g=-10\text{ m s}^{-2}\)

so

\(v=u-10t\)

\(s=ut-5t^2\)

\(v^2=u^2-20s\)

Upward velocities and displacements are positive; downward velocities and displacements below the chosen origin are negative.

If downward is positive, then

\(a=g=10\text{ m s}^{-2}\)

so

\(v=u+10t\)

\(s=ut+5t^2\)

\(v^2=u^2+20s\)

This convention is often convenient for an object thrown or dropped downward. An object that is projected upward then has a negative initial velocity. Both conventions give the same physical answer when used consistently.

Never reverse the positive direction when the particle reverses direction. The signs of its velocity and displacement handle that change; the direction and sign of \(g\) stay fixed.

## Maximum height

At the highest point, the velocity is instantaneously zero:

\(v=0\)

For a particle projected upward at speed \(u\), take upward as positive. From \(v=u-gt\), the time to maximum height is

\(t_{\max}=\frac{u}{g}=\frac{u}{10}\)

From \(v^2=u^2-2gs\), the rise above the launch point is

\(h_{\max}=\frac{u^2}{2g}=\frac{u^2}{20}\)

This is a displacement above the launch point. If the launch point is already \(H\) metres above the ground, the maximum height above the ground is

\(H+\frac{u^2}{20}\)

The particle’s speed is zero only at the highest point, not immediately before it hits the ground.

## Symmetry and time of flight

If a particle rises and later returns to the same height, with no air resistance, its motion is symmetric:

- time down to that height equals time up from that height;
- its return velocity is the negative of its launch velocity when one fixed sign convention is used;
- its return speed equals its launch speed.

For launch speed \(u\) and return to the launch height,

\(T=2t_{\max}=\frac{2u}{g}=\frac{u}{5}\)

This shortcut does not apply when the landing point is above or below the launch point. Then use the signed displacement in a SUVAT equation and choose the physically possible root \(t>0\).

“Time of flight” means the total time from projection or release until the stated impact. “Distance travelled” is not generally the same as displacement: for an up-and-down journey it includes both parts of the path.

## Worked example — cliff projection with \(g=10\)

A stone is projected vertically upward at \(8\text{ m s}^{-1}\) from a point \(20\text{ m}\) above sea level. It moves freely under gravity.

### (a) Time until the stone hits the sea

Take upward as positive. From launch to impact,

\(s=-20,\quad u=8,\quad a=-10\)

Use \(s=ut+\frac12at^2\):

\(-20=8t-5t^2\)

\(5t^2-8t-20=0\)

\(t=\frac{8\pm\sqrt{(-8)^2-4(5)(-20)}}{10}\)

\(t=\frac{8\pm\sqrt{464}}{10}\)

The negative root represents a time before projection, so reject it. Hence

\(t=2.954\ldots\text{ s}=2.95\text{ s}\text{ (3 s.f.)}\)

### (b) Maximum height above sea level

At maximum height, \(v=0\). For the rise \(s\) above the cliff,

\(0^2=8^2+2(-10)s\)

\(s=3.2\text{ m}\)

Add the cliff height:

\(20+3.2=23.2\text{ m}\)

The maximum height above sea level is \(23.2\text{ m}\).

## Self-check

A ball is projected vertically upward from ground level at \(14\text{ m s}^{-1}\). It moves freely under gravity and returns to the ground. Find (i) the time to maximum height, (ii) the maximum height, and (iii) the total time of flight.

### Answer

Using \(g=10\text{ m s}^{-2}\),

\(t_{\max}=\frac{14}{10}=1.4\text{ s}\)

\(h_{\max}=\frac{14^2}{20}=9.8\text{ m}\)

\(T=2(1.4)=2.8\text{ s}\)

It returns to the launch height at velocity \(-14\text{ m s}^{-1}\) if upward is positive, so its impact speed is \(14\text{ m s}^{-1}\), not zero.

## Common exam slips

- Using \(9.8\) or \(9.81\) instead of the Cambridge 9709 Paper 4 convention \(g=10\text{ m s}^{-2}\).
- Treating \(g\) as a force. It is an acceleration; the gravitational force on mass \(m\) is its weight \(mg\).
- Writing \(a=+10\) after choosing upward as positive, or \(a=-10\) after choosing downward as positive.
- Changing the positive direction when the particle starts to fall. Keep one convention for the whole stage of motion.
- Setting \(v=0\) at impact. Velocity is zero at maximum height; impact then changes the velocity.
- Giving a negative “speed”. Velocity can be negative, but speed is its non-negative magnitude.
- Using \(s=0\) when the particle lands at a different height from its launch point. Measure the signed displacement from the chosen origin.
- Doubling the time to maximum height when the particle does not return to its launch height.
- Keeping both roots of a time quadratic without checking \(t>0\) and the physical event described.
- Confusing height or distance with displacement. Height and distance are scalars; \(s\) in SUVAT is signed displacement.
- Rounding an intermediate value too early. Keep full calculator values until the final answer, then use the requested accuracy.
