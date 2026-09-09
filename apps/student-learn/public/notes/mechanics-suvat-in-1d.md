# SUVAT in 1D — five-minute revision

## When SUVAT applies

Use these equations only when acceleration is constant and motion is along one straight line. Treat the line as a signed axis.

The five quantities are:

- \(s\): displacement from the chosen starting point, in \(\text{m}\)
- \(u\): velocity at the start of the interval, in \(\text{m s}^{-1}\)
- \(v\): velocity at the end of the interval, in \(\text{m s}^{-1}\)
- \(a\): constant acceleration, in \(\text{m s}^{-2}\)
- \(t\): elapsed time, in \(\text{s}\)

The equations are

\[
v=u+at,
\]

\[
s=\frac12(u+v)t,
\]

\[
s=ut+\frac12at^2,
\]

\[
s=vt-\frac12at^2,
\]

\[
v^2=u^2+2as.
\]

## Choose the equation from knowns and unknowns

Write \(s,u,v,a,t\). Fill in every known value with its sign, circle the required quantity, then identify the one quantity that is neither known nor required. Choose the equation that omits it.

| Quantity omitted | Equation to use |
|---|---|
| \(s\) | \(v=u+at\) |
| \(a\) | \(s=\frac12(u+v)t\) |
| \(v\) | \(s=ut+\frac12at^2\) |
| \(u\) | \(s=vt-\frac12at^2\) |
| \(t\) | \(v^2=u^2+2as\) |

If fewer than three useful values are known, another stage or another equation is usually needed. For two descriptions of the same motion, form two equations and solve them simultaneously.

## Sign convention

Choose a positive direction once and keep it for the whole interval. Displacement, velocity and acceleration are signed; time is positive.

- Positive velocity means motion in the chosen positive direction; negative velocity means motion in the opposite direction.
- Acceleration is negative only when it points in the negative direction. “Deceleration” means acceleration opposite to the current velocity, not automatically a negative value.
- At a turning point, \(v=0\) for an instant. If the same acceleration continues, \(v\) changes sign; do not reverse the positive direction.
- \(s=0\) means the particle is back at its starting position. It does not mean the total distance travelled is zero.
- Speed and distance are scalars, so report them as non-negative magnitudes.

For vertical motion, take \(g=10\text{ m s}^{-2}\) downward. If upward is positive, \(a=-10\text{ m s}^{-2}\); if downward is positive, \(a=+10\text{ m s}^{-2}\). At maximum height \(v=0\), but acceleration is still downward.

## Worked example 1 — horizontal motion

A bicycle accelerates uniformly at \(4\text{ m s}^{-2}\) from \(10\text{ m s}^{-1}\) through a displacement of \(48\text{ m}\). Find its final velocity and the time taken.

Here \(u=10\), \(a=4\), \(s=48\). To find \(v\), omit \(t\):

\[
\begin{aligned}
v^2&=u^2+2as\\
&=10^2+2(4)(48)\\
&=484.
\end{aligned}
\]

Hence \(v=22\text{ m s}^{-1}\); the negative square root is inconsistent with this forward, accelerating motion. Now

\[
22=10+4t
\quad\Longrightarrow\quad
t=3\text{ s}.
\]

## Worked example 2 — vertical motion

A particle is projected vertically upward from ground level with speed \(18\text{ m s}^{-1}\). Find its greatest height and the time when it first returns to the ground. Use \(g=10\text{ m s}^{-2}\).

Take upward as positive, so \(u=18\) and \(a=-10\).

At greatest height, \(v=0\). Omitting \(t\),

\[
\begin{aligned}
v^2&=u^2+2as\\
0&=18^2+2(-10)s\\
20s&=324\\
s&=16.2\text{ m}.
\end{aligned}
\]

On returning to ground level, the displacement from launch is \(s=0\):

\[
\begin{aligned}
0&=ut+\frac12at^2\\
0&=18t-5t^2\\
0&=t(18-5t).
\end{aligned}
\]

The roots are \(t=0\), the launch instant, and \(t=3.6\text{ s}\), the required return time.

## Self-check

A ball is projected vertically upward at \(15\text{ m s}^{-1}\) from a point \(20\text{ m}\) above the ground. Find the time taken to reach the ground and its impact speed. Use \(g=10\text{ m s}^{-2}\).

### Answer

Take upward as positive: \(u=15\), \(a=-10\), and the ground has displacement \(s=-20\).

\[
\begin{aligned}
-20&=15t-5t^2\\
0&=t^2-3t-4\\
0&=(t-4)(t+1).
\end{aligned}
\]

Reject \(t=-1\), so the time is \(4\text{ s}\). Then

\[
v=u+at=15-10(4)=-25\text{ m s}^{-1}.
\]

The negative sign means downward; the impact speed is \(25\text{ m s}^{-1}\).

## Common exam slips

- Using SUVAT when acceleration is not constant.
- Mixing values from different time intervals; redefine \(u,v,s,t\) for each stage.
- Changing the positive direction when the particle turns around.
- Writing \(a=-g\) without first choosing upward as positive.
- Setting \(s=0\) at maximum height instead of setting \(v=0\).
- Confusing displacement with distance, or velocity with speed.
- Keeping both roots of a quadratic without checking the physical time interval.
- Taking only the positive square root of \(v^2\) before using the direction information.
- Rounding an intermediate answer; keep the exact value or full calculator value until the final line.
- Omitting units or writing \(\text{ms}^{-1}\) instead of \(\text{m s}^{-1}\).
