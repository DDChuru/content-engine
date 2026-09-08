# Deriving the suvat formulae — five-minute revision

## When suvat applies

Use these formulae only for motion in a straight line during an interval in which acceleration is constant. Choose a positive direction first and use signed values:

- \(s\): displacement from the starting position, in \(\text{m}\)
- \(u\): velocity at the start of the interval, in \(\text{m s}^{-1}\)
- \(v\): velocity at the end of the interval, in \(\text{m s}^{-1}\)
- \(a\): constant acceleration, in \(\text{m s}^{-2}\)
- \(t\): elapsed time, in \(\text{s}\)

Velocity, acceleration and displacement may be negative. A negative acceleration does not automatically mean the particle is slowing down: compare the signs of velocity and acceleration.

## The velocity–time graph

For constant acceleration, the velocity–time graph is a straight line from velocity \(u\) at \(t=0\) to velocity \(v\) at time \(t\).

- Its gradient is acceleration.
- Its signed area between the graph and the time axis is displacement.

If part of the graph is below the time axis, that part contributes negative displacement. The area gives displacement, not total distance travelled.

## 1. Gradient gives \(v=u+at\)

The rise is \(v-u\) and the run is \(t\), so

\(a=\dfrac{v-u}{t}\)

Multiplying by \(t\) and making \(v\) the subject gives

\(at=v-u\)

\(\boxed{v=u+at}\)

## 2. Area gives \(s=\tfrac12(u+v)t\)

The region under the straight line is a trapezium. Its parallel sides have lengths \(u\) and \(v\), and its width is \(t\). Therefore

\(s=\dfrac12(u+v)t\)

so

\(\boxed{s=\dfrac12(u+v)t}\)

This is also “average velocity × time”, because the average velocity under constant acceleration is \(\tfrac12(u+v)\).

## 3. Substitute for \(v\): \(s=ut+\tfrac12at^2\)

Use \(v=u+at\) in the trapezium-area equation:

\(s=\dfrac12\bigl(u+[u+at]\bigr)t\)

\(s=\dfrac12(2u+at)t\)

\(\boxed{s=ut+\dfrac12at^2}\)

## 4. Substitute for \(u\): \(s=vt-\tfrac12at^2\)

Rearrange the gradient result:

\(u=v-at\)

Then substitute into the trapezium-area equation:

\(s=\dfrac12\bigl([v-at]+v\bigr)t\)

\(s=\dfrac12(2v-at)t\)

\(\boxed{s=vt-\dfrac12at^2}\)

## 5. Eliminate \(t\): \(v^2=u^2+2as\)

For \(a\ne0\), rearrange \(v=u+at\):

\(t=\dfrac{v-u}{a}\)

Substitute this into \(s=\tfrac12(u+v)t\):

\(s=\dfrac12(u+v)\dfrac{v-u}{a}\)

\(2as=(u+v)(v-u)\)

\(2as=v^2-u^2\)

\(\boxed{v^2=u^2+2as}\)

If \(a=0\), then \(v=u\), so the boxed identity still holds even though the division-by-\(a\) derivation cannot be used.

## Which equation should I use?

Each equation omits one of the five quantities. List the values you know and choose the equation that omits the quantity you do not need.

| Equation | Quantity omitted | Especially useful when |
|---|:---:|---|
| \(v=u+at\) | \(s\) | displacement is irrelevant or unknown |
| \(s=\dfrac12(u+v)t\) | \(a\) | both endpoint velocities and time are known |
| \(s=ut+\dfrac12at^2\) | \(v\) | initial velocity, acceleration and time are known |
| \(s=vt-\dfrac12at^2\) | \(u\) | final velocity, acceleration and time are known |
| \(v^2=u^2+2as\) | \(t\) | time is absent or not required |

These equations may give more than one algebraic solution. Use the diagram, signs, time condition and physical context to reject an impossible value.

## Self-check

A particle moves in a straight line with initial velocity \(3\text{ m s}^{-1}\) and constant acceleration \(2\text{ m s}^{-2}\) for \(4\text{ s}\). Find its final velocity and displacement, then verify the time-free equation.

### Answer

\(v=u+at=3+2(4)=11\text{ m s}^{-1}\)

\(s=ut+\dfrac12at^2=3(4)+\dfrac12(2)(4^2)=28\text{ m}\)

Check with the graph-area formula:

\(s=\dfrac12(u+v)t=\dfrac12(3+11)(4)=28\text{ m}\)

Check with the time-free equation:

\(v^2=11^2=121\)

\(u^2+2as=3^2+2(2)(28)=9+112=121\)

Both sides agree.

## Common exam slips

- Using suvat across an interval where acceleration changes. Split the motion into constant-acceleration stages and carry the final velocity of one stage into the next.
- Treating every stated speed as positive after choosing a direction. Convert speeds to signed velocities before substituting.
- Confusing displacement with distance travelled. Signed area below the time axis subtracts from displacement.
- Writing the gradient as \((u-v)/t\) instead of \((v-u)/t\).
- Forgetting that the trapezium's parallel sides are \(u\) and \(v\), or losing the factor \(\tfrac12\).
- Dropping the outer factor \(t\) when expanding \(\tfrac12(2u+at)t\).
- Using \(s=ut+at^2\) or \(s=vt-at^2\); both acceleration terms need the factor \(\tfrac12\).
- Squaring only one term when rearranging \(v^2=u^2+2as\), or taking \(v=\sqrt{u^2+2as}\) without considering the required sign of velocity.
- Mixing values from different stages of a journey without resetting \(u\), \(v\), \(s\) and \(t\) for the chosen interval.
- Omitting units or writing \(\text{ms}^{-1}\) instead of \(\text{m s}^{-1}\).
