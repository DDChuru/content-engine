# Drawing travel graphs - five-minute revision

## From words to a graph

A travel graph is a compressed story. First identify every phase’s direction, duration and motion type.

Use this recipe.

1. Choose and state a positive direction; every sign follows it.
2. Add durations cumulatively and mark each key time on both graphs.
3. Translate each phrase into a shape. Constant velocity gives straight displacement-time and horizontal velocity-time sections. Rest gives a horizontal displacement-time section and \(v=0\). Constant acceleration gives a curved displacement-time section and a straight sloping velocity-time section.
4. Join phases continuously. Displacement cannot jump; velocity normally cannot either.
5. Label \(t\) and its unit horizontally. Label displacement \(s\) or \(x\), or velocity \(v\), and its unit vertically.
6. Label phase times, turning displacements and stated or calculated velocities.
7. Mark where \(v=0\). A sign change crosses the velocity axis and makes a turning point on the displacement graph.

Words such as “uniformly accelerates” and “constant deceleration” signal straight sections on a velocity-time graph. “Returns to the start” means final displacement is zero; it does not mean the return leg can be omitted.

## Keep the two graph languages linked

For a displacement-time graph,

\(v=\dfrac{ds}{dt}\)

so velocity is its gradient. Its sign gives direction, a horizontal tangent gives \(v=0\), and greater steepness means greater speed.

For a velocity-time graph,

\(s(t_2)-s(t_1)=\displaystyle\int_{t_1}^{t_2}v\,dt\)

so displacement change is signed area between the graph and the time axis. Above-axis area increases displacement; below-axis area decreases it.

From \(s\)-\(t\) to \(v\)-\(t\), read each gradient. Going back, accumulate signed areas from the starting displacement. At every key time, velocity height must match displacement gradient, and velocity area must match displacement change.

## Shape decisions that prevent bad sketches

- Constant positive velocity: rising straight \(s\)-\(t\) line; horizontal \(v\)-\(t\) line above zero.
- Constant negative velocity: falling straight \(s\)-\(t\) line; horizontal \(v\)-\(t\) line below zero.
- Rest: horizontal \(s\)-\(t\) line; \(v\)-\(t\) line on the time axis.
- Constant positive acceleration: concave-up \(s\)-\(t\) curve; rising straight \(v\)-\(t\) line.
- Constant negative acceleration: concave-down \(s\)-\(t\) curve; falling straight \(v\)-\(t\) line.

“Decelerating” means speed is decreasing, not automatically that acceleration is negative. Use the chosen direction and the signs of \(v\) and \(a\).

## Sketch or accurate plot?

A sketch need not use a measured scale, but straight versus curved, signs, phase order and axis crossings must be correct. Label axes and units, key times, velocities and important displacements. Show the dimensions of any area or gradient used.

An accurate plot also needs calculated coordinates and consistent scales. Plot endpoints first, then add straight lines or smooth curves. Constant-acceleration displacement remains curved even when only its endpoints are known.

## Worked examples

### 1. Lift journey in three phases

Take upwards as positive. A lift starts from rest, accelerates uniformly at \(1.5\text{ m s}^{-2}\) for \(2\text{ s}\), travels at constant velocity for \(4\text{ s}\), then decelerates uniformly to rest in \(2\text{ s}\).

After the first phase,

\(v=0+1.5(2)=3\text{ m s}^{-1}\)

The velocity-time points are \((0,0)\), \((2,3)\), \((6,3)\) and \((8,0)\), joined slope-horizontal-slope.

The displacement in each phase is the corresponding area:

\(s_1=\tfrac12(2)(3)=3\text{ m}\)

\(s_2=(4)(3)=12\text{ m}\)

\(s_3=\tfrac12(2)(3)=3\text{ m}\)

Hence the lift finishes \(3+12+3=18\text{ m}\) above its start. Its displacement graph curves concave up from \((0,0)\) to \((2,3)\), rises straight to \((6,15)\), then curves concave down to \((8,18)\) with a horizontal final tangent.

### 2. Ball thrown up and caught

Take upwards as positive and use \(g=9.8\text{ m s}^{-2}\). A ball is projected from hand height at \(14.7\text{ m s}^{-1}\) and is caught at the same height.

Its velocity is

\(v=14.7-9.8t\)

At the highest point,

\(0=14.7-9.8t\)

so \(t=1.5\text{ s}\). For the catch,

\(0=14.7t-4.9t^2=t(14.7-4.9t)\)

giving the later root \(t=3.0\text{ s}\). The velocity graph is straight from \((0,14.7)\), through \((1.5,0)\), to \((3,-14.7)\). Its negative part is the descent.

The maximum rise is the positive triangular area,

\(h=\tfrac12(1.5)(14.7)=11.025\text{ m}\)

The equal negative triangle returns displacement to \(0\text{ m}\). The displacement graph is a concave-down parabola through \((0,0)\), \((1.5,11.025)\) and \((3,0)\), horizontal at the top.

### 3. Translate a displacement graph into a velocity graph

A particle’s displacement-time graph consists of straight sections through \((0,2)\), \((4,14)\), \((6,14)\) and \((10,6)\), where time is in seconds and displacement is in metres.

Find each gradient:

\(v_1=\dfrac{14-2}{4-0}=3\text{ m s}^{-1}\)

\(v_2=\dfrac{14-14}{6-4}=0\text{ m s}^{-1}\)

\(v_3=\dfrac{6-14}{10-6}=-2\text{ m s}^{-1}\)

Therefore the velocity-time graph is horizontal at \(3\text{ m s}^{-1}\) for \(0\leq t<4\), on the axis for \(4\leq t<6\), then horizontal at \(-2\text{ m s}^{-1}\) for \(6\leq t\leq10\).

Check with areas from the initial displacement \(2\text{ m}\):

\(2+(3)(4)=14\text{ m}\)

\(14+(0)(2)=14\text{ m}\)

\(14+(-2)(4)=6\text{ m}\)

These areas reproduce every given displacement.

### 4. Draw both graphs for an out-and-back journey

Take away from a checkpoint as positive. A hiker moves at \(2\text{ m s}^{-1}\) for \(5\text{ s}\), slows uniformly to rest over \(2\text{ s}\), waits for \(3\text{ s}\), then returns at constant speed \(1.5\text{ m s}^{-1}\) until reaching the checkpoint.

The outward displacement is

\(s_{\text{out}}=(2)(5)+\tfrac12(2)(2)=12\text{ m}\)

The return velocity is \(-1.5\text{ m s}^{-1}\), so the return duration is

\(t_{\text{return}}=\dfrac{12}{1.5}=8\text{ s}\)

Thus \(T=5+2+3+8=18\text{ s}\).

For the velocity-time graph, draw a horizontal line at \(2\) from \(t=0\) to \(t=5\), a straight fall to \(0\) at \(t=7\), a zero line to \(t=10\), and a horizontal line at \(-1.5\) to \(t=18\).

For displacement-time, use \((0,0)\), \((5,10)\), \((7,12)\), \((10,12)\) and \((18,0)\): straight rise, concave-down curve to a horizontal tangent, horizontal wait, then straight return. Negative velocity is essential even though displacement stays non-negative.

## Quick self-check

1. A vehicle moves east steadily, stops for a while, then moves west steadily. With east positive, what signs and shapes appear on both graphs?
2. Why must a constant-acceleration phase be straight on a velocity-time graph but curved on a displacement-time graph?
3. Displacement changes from \(5\text{ m}\) at \(t=2\text{ s}\) to \(17\text{ m}\) at \(t=6\text{ s}\) along a straight line. Find the velocity.
4. Starting from \(s=4\text{ m}\), a velocity-time graph is horizontal at \(-3\text{ m s}^{-1}\) for \(5\text{ s}\). Find the final displacement.
5. A velocity-time line crosses from \(v=6\text{ m s}^{-1}\) to \(v=-2\text{ m s}^{-1}\). What must the matching displacement-time graph do at the crossing?

### Answers

1. The velocity-time graph is horizontal above zero, then on zero, then below zero. The displacement-time graph rises straight, becomes horizontal, then falls straight.
2. Constant acceleration means velocity changes by equal amounts in equal times, so \(v\) is linear in \(t\). Displacement accumulates that changing velocity, so \(s\) is quadratic in \(t\).
3. \(v=(17-5)/(6-2)=3\text{ m s}^{-1}\).
4. \(s_{\text{final}}=4+(-3)(5)=-11\text{ m}\).
5. It must have a horizontal tangent where \(v=0\), reach a local maximum, then change from positive to negative gradient.

## Common exam slips

- Drawing a curve where constant velocity requires a straight displacement-time segment, or where constant acceleration requires a straight velocity-time segment.
- Omitting the return leg after the object turns around.
- Leaving axes, units or key times unlabelled because the instruction says “sketch”.
- Forgetting the negative velocity region and drawing reverse motion above the axis.
- Treating displacement-time height as velocity instead of using gradient.
- Treating velocity-time height as displacement instead of accumulating signed area.
- Making displacement jump at a phase boundary.
- Joining a stop to the next phase with a sharp non-horizontal displacement-time tangent when velocity is zero there.
