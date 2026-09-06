# Velocity-time graphs - five-minute revision

## What the graph shows

A velocity-time graph records velocity on the vertical axis and time on the horizontal axis. Because velocity has direction, points above the time axis represent motion in the chosen positive direction and points below it represent motion in the negative direction.

Read the line before calculating:

- A horizontal section means constant velocity. On the axis itself, the object is at rest.
- A straight sloping section means constant acceleration.
- A curve means the acceleration is changing; its instantaneous value comes from the tangent gradient.
- If the line crosses the time axis, velocity changes sign and the object changes direction.

Choose a positive direction at the start and keep it throughout.

## Gradient gives acceleration

For any straight section,

\(a=\dfrac{\text{change in velocity}}{\text{change in time}}=\dfrac{v_2-v_1}{t_2-t_1}\)

An upward gradient gives positive acceleration and a downward gradient gives negative acceleration. The sign alone does not say whether the object is speeding up. Velocity and acceleration with the same sign increase speed; opposite signs reduce it.

The gradient units are

\(\dfrac{\text{m s}^{-1}}{\text{s}}=\text{m s}^{-2}\)

## Area gives displacement

The signed area between the graph and the time axis is displacement:

\(s=\int v\,dt\)

At this level, piecewise straight graphs are usually handled with rectangles, triangles and trapezia:

\(A_{\text{rectangle}}=bh\)

\(A_{\text{triangle}}=\dfrac12bh\)

\(A_{\text{trapezium}}=\dfrac12(a+b)h\)

Here, a horizontal length is a time interval and a vertical length is a velocity. Their product has unit

\(\text{s}\times\text{m s}^{-1}=\text{m}\)

Area above the axis is positive displacement. Area below it is negative displacement. Therefore,

\(\text{total displacement}=\text{positive area}-\text{magnitude of negative area}\)

\(\text{total distance}=\text{positive area}+\text{magnitude of negative area}\)

Distance uses every region as positive. Displacement keeps the direction signs.

## Average velocity and average speed

Over a complete interval,

\(\text{average velocity}=\dfrac{\text{total displacement}}{\text{total time}}\)

\(\text{average speed}=\dfrac{\text{total distance}}{\text{total time}}\)

Average velocity may be positive, negative or zero. Average speed is never negative.

## Link to suvat

Each straight sloping section has constant acceleration, so the suvat equations apply to that section. The two graph facts agree with suvat:

\(v=u+at\)

\(s=\dfrac{u+v}{2}t=ut+\dfrac12at^2\)

Do not apply one suvat equation across a corner where the acceleration changes. Split the journey into straight-line sections first.

## Worked examples

### 1. Trapezium journey

A trolley accelerates uniformly from \(4\text{ m s}^{-1}\) to \(12\text{ m s}^{-1}\) in \(6\text{ s}\). Find its displacement.

The graph region is a trapezium with parallel sides \(4\) and \(12\), separated by \(6\):

\(s=\dfrac12(4+12)(6)\)

\(s=48\text{ m}\)

Equivalently, split it into a rectangle and a triangle:

\(s=(4)(6)+\dfrac12(6)(12-4)=24+24=48\text{ m}\)

### 2. A negative region: displacement is not distance

A particle has a positive triangular region of base \(6\text{ s}\) and height \(8\text{ m s}^{-1}\), followed by a negative triangular region of base \(4\text{ s}\) and depth \(4\text{ m s}^{-1}\).

\(A_+=\dfrac12(6)(8)=24\text{ m}\)

\(A_-=-\dfrac12(4)(4)=-8\text{ m}\)

Hence,

\(\text{displacement}=24-8=16\text{ m}\)

\(\text{distance}=24+8=32\text{ m}\)

The total time is \(10\text{ s}\), so

\(\text{average velocity}=\dfrac{16}{10}=1.6\text{ m s}^{-1}\)

\(\text{average speed}=\dfrac{32}{10}=3.2\text{ m s}^{-1}\)

### 3. Read acceleration from a gradient

Between \(t=2\text{ s}\) and \(t=8\text{ s}\), velocity rises linearly from \(5\text{ m s}^{-1}\) to \(17\text{ m s}^{-1}\).

\(a=\dfrac{17-5}{8-2}\)

\(a=\dfrac{12}{6}=2\text{ m s}^{-2}\)

The positive constant gradient means constant positive acceleration.

### 4. Check a graph section with suvat

A car begins a straight graph segment at \(u=3\text{ m s}^{-1}\), accelerates at \(3\text{ m s}^{-2}\), and continues for \(4\text{ s}\).

First find the final velocity:

\(v=u+at=3+3(4)=15\text{ m s}^{-1}\)

The graph area is

\(s=\dfrac{3+15}{2}(4)=36\text{ m}\)

Suvat gives the same result:

\(s=ut+\dfrac12at^2=3(4)+\dfrac12(3)(4^2)=12+24=36\text{ m}\)

Because velocity stays positive on this segment,

\(\text{average velocity}=\text{average speed}=\dfrac{36}{4}=9\text{ m s}^{-1}\)

## Quick self-check

1. A graph is horizontal at \(-6\text{ m s}^{-1}\). What is the motion?
2. Velocity changes from \(14\text{ m s}^{-1}\) to \(2\text{ m s}^{-1}\) in \(4\text{ s}\). What is the acceleration?
3. A graph has \(30\text{ m}\) of area above the axis and \(12\text{ m}\) in magnitude below it. Find displacement and distance.
4. A graph crosses from positive velocity to negative velocity. What physical event occurs at the crossing?
5. Why can suvat not be used once across two straight graph sections with different gradients?

### Answers

1. Constant velocity of \(-6\text{ m s}^{-1}\), so the object moves steadily in the negative direction.
2. \(a=(2-14)/4=-3\text{ m s}^{-2}\).
3. Displacement is \(30-12=18\text{ m}\); distance is \(30+12=42\text{ m}\).
4. The object is instantaneously at rest, then changes direction.
5. The gradient, and therefore acceleration, changes at the join. Apply suvat separately to each constant-acceleration section.

## Common exam slips

- Treating a velocity-time graph like a displacement-time graph. On a velocity-time graph, gradient is acceleration and area is displacement.
- Adding a below-axis area to displacement as if it were positive.
- Subtracting the negative region when finding distance; distance needs absolute areas.
- Calling every downward slope “slowing down.” Below the axis, a downward slope makes the speed larger.
- Assuming every zero-velocity point reverses direction. Check whether the line crosses the axis or only touches it.
- Using gradient units of \(\text{m s}^{-1}\) instead of \(\text{m s}^{-2}\).
- Using the full time coordinate instead of the width of the required interval.
- Applying one suvat model across a change in gradient.
