# Coefficient of Friction & Inclined Planes

On a slope the friction rules are the same as on a floor, but the useful directions are **along the slope** and **perpendicular to it**, not horizontal and vertical.

## The method

1. Resolve the weight, and any other force, along and perpendicular to the slope. The angle between the weight and the perpendicular is the slope angle \(\theta\), so the weight gives \(mg\cos\theta\) into the slope and \(mg\sin\theta\) down the slope.
2. Perpendicular to the slope nothing moves, so the perpendicular forces balance. That gives \(R\). \(R = mg\cos\theta\) **only** when no other force has a perpendicular part; a rope pulling at an angle changes \(R\).
3. The most friction the surface can give is \(f_{\max} = \mu R\).
4. Add up the other forces along the slope. If that resultant is bigger than \(f_{\max}\) the object slides and friction acts at \(f_{\max}\) against the motion; if not, friction balances it and the object stays still.
5. If it moves, use \(F = ma\) along the slope.

Friction opposes the sliding (or the sliding that is about to happen), not the direction of the acceleration in general.

## Worked example

A crate of mass \(4\text{ kg}\) sits on a rough ramp inclined at \(30^\circ\) to the horizontal, coefficient of friction \(\mu = 0.25\). A rope pulls the crate with \(8\text{ N}\) at \(30^\circ\) above the ramp, pointing up the ramp. The crate is released from rest and stays in contact with the ramp. Take \(g = 10\text{ m s}^{-2}\).

Find the normal reaction, the maximum friction, which way the crate moves, and its acceleration.

### Resolve

Weight \(mg = 4 \times 10 = 40\text{ N}\).

\[
\text{into the slope: } mg\cos 30^\circ = 40 \times \tfrac{\sqrt3}{2} = 20\sqrt3 \approx 34.6\text{ N}
\]
\[
\text{down the slope: } mg\sin 30^\circ = 40 \times \tfrac12 = 20\text{ N}
\]

Rope \(T = 8\text{ N}\) at \(30^\circ\) to the slope:

\[
\text{along the slope (up): } T\cos 30^\circ = 4\sqrt3 \approx 6.93\text{ N}
\]
\[
\text{away from the slope: } T\sin 30^\circ = 4\text{ N}
\]

These four parts now replace the weight and the rope. Never count a force and its parts together.

### Normal reaction and the limit

Perpendicular to the slope:

\[
R + T\sin 30^\circ - mg\cos 30^\circ = 0
\]
\[
R = 20\sqrt3 - 4 \approx 30.6\text{ N}
\]

\(R\) is smaller than \(mg\cos\theta\) because the rope lifts the crate a little.

\[
f_{\max} = \mu R = 0.25 \times 30.6 \approx 7.66\text{ N}
\]

### Which way does it go?

Along the slope, without friction: down \(20\text{ N}\), up \(6.93\text{ N}\), so the resultant is \(20 - 6.93 \approx 13.1\text{ N}\) **down** the slope.

\(13.1\text{ N} > 7.66\text{ N}\), so friction cannot hold it. The crate slides down the slope and friction acts **up** the slope at its maximum, \(7.66\text{ N}\).

### Newton's second law

Down the slope as positive:

\[
mg\sin 30^\circ - T\cos 30^\circ - f_{\max} = ma
\]
\[
20 - 6.93 - 7.66 = 4a
\]
\[
a = \frac{21 - 9\sqrt3}{4} \approx 1.35\text{ m s}^{-2}\ \text{down the slope}
\]

The acceleration is small because friction and the rope both act against the weight's down-slope part.

## What would change if the rope pulled along the ramp?

Then the rope has no perpendicular part, so \(R = mg\cos 30^\circ = 20\sqrt3 \approx 34.6\text{ N}\) and \(f_{\max} = 0.25 \times 20\sqrt3 \approx 8.66\text{ N}\). The surface grips harder, and all \(8\text{ N}\) of the pull act up the slope.

## Remember

- Resolve along and perpendicular to the slope.
- Find \(R\) from the perpendicular balance, then \(f_{\max} = \mu R\).
- Decide the direction from the other forces along the slope, then use \(F = ma\).
