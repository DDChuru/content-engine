# Work

In mechanics, **work** is done by a force when the point where it acts moves along the line of that force. A force that holds something still does no work, however large it is.

## Work = force × distance moved along the force

\[
W = F d
\]

The units are newton metres; one newton metre is one **joule**:

\[
1\text{ J} = 1\text{ N m}.
\]

- Push a box along a floor with a force \(F\) through a distance \(d\): the work done is \(Fd\).
- Push a wall: nothing moves, \(d = 0\), so no work is done.

## A force at an angle to the motion

If the force makes an angle \(\theta\) with the direction of motion, only the part of the force **along the motion** does work:

\[
W = F d \cos\theta.
\]

The perpendicular part, \(F\sin\theta\), moves the object nowhere in its own direction, so it does no work.

**Lifting straight up:** the force needed is the weight \(mg\) and the distance is the height \(h\), so the work done against gravity is

\[
W = mgh.
\]

## Worked example: dragging a crate up a rough ramp

A crate of mass \(4\text{ kg}\) is dragged \(5\text{ m}\) up a rough ramp inclined at \(30^\circ\) to the horizontal. The rope is parallel to the ramp and the crate moves at constant speed. The coefficient of friction is \(0.25\) and \(g = 10\text{ m s}^{-2}\). Find the work done against friction and the work done against gravity.

Before starting: which distance goes with gravity, the \(5\text{ m}\) along the ramp or the vertical rise? Gravity only cares about the rise.

### Work against friction

Perpendicular to the ramp nothing moves, and the rope pulls along the ramp (no perpendicular part), so the normal reaction balances the part of the weight into the ramp:

\[
R - mg\cos\theta = 0
\]
\[
R = 40\cos 30^\circ = 20\sqrt{3} \approx 34.6\text{ N}.
\]

The crate is moving, so friction is at its limit:

\[
f = \mu R = 0.25 \times 34.6 \approx 8.66\text{ N}
\]

acting down the ramp. Friction acts along the whole ramp distance:

\[
W = f d = 8.66 \times 5 \approx \boxed{43.3\text{ J}}.
\]

### Work against gravity

The vertical rise is

\[
h = d\sin\theta = 5\sin 30^\circ = 2.5\text{ m}
\]

(not \(5\text{ m}\)). So

\[
W = mgh = 4 \times 10 \times 2.5 = \boxed{100\text{ J}}.
\]

### Constant speed does not mean no work

The resultant work on the crate is zero because its speed does not change, but the rope still does both jobs: \(43.3\text{ J}\) against friction and \(100\text{ J}\) against gravity.

## What would change on a smooth ramp?

With no friction there is no work against friction at all. The work against gravity is unchanged at \(100\text{ J}\), because the rise \(h\) is the same.

## Remember

- Work = force × distance moved **along the force**; \(1\text{ J} = 1\text{ N m}\).
- At an angle, use the component along the motion: \(W = Fd\cos\theta\); the perpendicular part does no work.
- On a rough slope: resolve perpendicular for \(R\), use \(f = \mu R\) while moving, work against friction \(= fd\) along the slope, and work against gravity \(= mgh\) with \(h\) the **vertical** rise.
