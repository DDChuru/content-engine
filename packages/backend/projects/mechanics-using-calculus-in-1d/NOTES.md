# Using calculus in 1D — five-minute revision

## The calculus chain

Treat displacement \(s\), velocity \(v\) and acceleration \(a\) as signed functions of time. In one dimension,

\(v=\frac{ds}{dt}\)

\(a=\frac{dv}{dt}=\frac{d^2s}{dt^2}\)

Differentiate to move from \(s\) to \(v\) to \(a\). Integrate to move in the other direction:

\(v=\int a\,dt\)

\(s=\int v\,dt\)

Velocity is measured in \(\text{m s}^{-1}\), acceleration in \(\text{m s}^{-2}\), and displacement in metres. A negative velocity means motion in the negative direction; it does not mean negative speed.

## Constants and initial conditions

Every indefinite integration introduces a constant:

\(v(t)=\int a(t)\,dt+C\)

\(s(t)=\int v(t)\,dt+D\)

Use the given condition immediately after integrating. Common translations are:

- “initially” means \(t=0\);
- “starts from rest” means \(v(0)=0\);
- “initial velocity is \(u\)” means \(v(0)=u\);
- “starts at the origin” means \(s(0)=0\).

A definite-integral form builds the condition in automatically. If values are known at \(t=t_0\), then

\(v(t)=v(t_0)+\int_{t_0}^{t}a(u)\,du\)

\(s(t)=s(t_0)+\int_{t_0}^{t}v(u)\,du\)

The dummy variable \(u\) avoids confusing the integration variable with the upper limit \(t\).

## Graph meaning, displacement and distance

On a displacement-time graph, the gradient is velocity. On a velocity-time graph, the gradient is acceleration and the signed area is displacement:

\(s(t_2)-s(t_1)=\int_{t_1}^{t_2}v(t)\,dt\)

Distance does not allow negative area to cancel positive area:

\(\text{distance travelled}=\int_{t_1}^{t_2}|v(t)|\,dt\)

In an exam, solve \(v(t)=0\) first and split the integral at every change of direction. Then

\(\text{average velocity}=\frac{\text{displacement}}{\text{time taken}}\)

\(\text{average speed}=\frac{\text{distance travelled}}{\text{time taken}}\)

## Rest, maxima and minima

- A particle is instantaneously at rest when \(v=0\).
- A stationary value of displacement occurs when \(v=\frac{ds}{dt}=0\). Check the sign of \(v\) on either side to decide whether \(s\) has a maximum or minimum.
- A stationary value of velocity occurs when \(a=\frac{dv}{dt}=0\). Check the sign of \(a\) on either side to classify it.
- To find a maximum or minimum speed on a closed time interval, compare \(|v|\) at the endpoints, at relevant points where \(a=0\), and at points where \(v=0\). Setting \(a=0\) alone can miss the largest speed at an endpoint or at a large negative velocity.

## Worked example from the video

The velocity of a particle is

\(v=3t^2-12t+9\)

for \(0\le t\le3\), and the particle starts at the origin.

### (a) First instantaneous rest

Set \(v=0\):

\(3t^2-12t+9=0\)

\(3(t-1)(t-3)=0\)

Thus \(t=1\) or \(t=3\), so the first instantaneous rest is after \(1\text{ s}\).

### (b) Acceleration

\(a=\frac{dv}{dt}=6t-12\text{ m s}^{-2}\)

### (c) Displacement

Integrate velocity:

\(s=\int(3t^2-12t+9)\,dt=t^3-6t^2+9t+C\)

Since \(s(0)=0\), \(C=0\). Therefore

\(s=t^3-6t^2+9t\text{ m}\)

### (d) Velocity-time sketch

\(v=3(t-1)(t-3)\)

This is an upward-opening parabola. It starts at \(v(0)=9\), crosses the time axis at \(t=1\) and \(t=3\), and has its vertex at

\(t=2,\qquad v(2)=-3\)

The particle moves in the positive direction for \(0<t<1\), then in the negative direction for \(1<t<3\).

### (e) Total distance in the first 3 seconds

Split at the change of direction \(t=1\):

\(\int_0^1v\,dt=[t^3-6t^2+9t]_0^1=4\)

\(\int_1^3v\,dt=[t^3-6t^2+9t]_1^3=-4\)

Hence

\(\text{distance}=|4|+|-4|=8\text{ m}\)

The displacement over the same interval is \(s(3)-s(0)=0\), showing why displacement and distance must not be confused.

### (f) Average speed

\(\text{average speed}=\frac{8}{3}=2.67\text{ m s}^{-1}\text{ (3 s.f.)}\)

## Companion example from the supplied notes

For

\(v=t^3-4t^2+3t\)

the acceleration is

\(a=\frac{dv}{dt}=3t^2-8t+3\)

The displacement from the starting position after \(3\) seconds is

\(\int_0^3(t^3-4t^2+3t)\,dt=\left[\frac14t^4-\frac43t^3+\frac32t^2\right]_0^3=-\frac94\text{ m}\)

The negative answer means the final position is \(\frac94\text{ m}\) in the negative direction from the starting position; it is not a negative distance.

## Self-check

A particle has \(a=6t-4\), with \(v(0)=1\) and \(s(0)=2\). Find \(v(t)\), \(s(t)\), and the times at which the particle is instantaneously at rest.

### Answer

Integrating acceleration and using \(v(0)=1\),

\(v=3t^2-4t+1\)

Integrating again and using \(s(0)=2\),

\(s=t^3-2t^2+t+2\)

For instantaneous rest,

\(3t^2-4t+1=(3t-1)(t-1)=0\)

so \(t=\frac13\text{ s}\) and \(t=1\text{ s}\).

## Common exam slips

- Differentiating when the question requires moving from \(a\) to \(v\), or integrating when moving from \(s\) to \(v\).
- Omitting the constant of integration, even when it later turns out to be zero.
- Treating “initially” as a velocity condition by itself. It only tells you that \(t=0\); use the rest of the sentence to identify \(s\), \(v\) or \(a\).
- Reading “one metre from the origin” as \(s=1\) without a stated side or positive direction. Strictly, it gives \(|s|=1\).
- Using \(v=0\) to find a maximum velocity. Use \(v=0\) for rest or stationary displacement; use \(a=0\) for stationary velocity.
- Calling a stationary velocity the maximum speed without comparing \(|v|\) at every candidate and endpoint.
- Integrating velocity once and calling the result distance. The integral gives signed displacement; split at zeros of \(v\) and use magnitudes for distance.
- Using average velocity when the question asks for average speed, or vice versa.
- Dropping the sign of a negative displacement or velocity.
- Writing \(\text{ms}^{-1}\) instead of the standard unit \(\text{m s}^{-1}\).
