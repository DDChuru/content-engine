# Energy principles

By the end you can:

- Build a signed energy balance.
- Find a resistance using energy.
- Explain when mechanical energy is conserved.

The Cambridge 9709 syllabus 4.5 excerpt for this lesson is **“conservation of energy”** (p.33). The lesson also applies the work–energy principle to a vehicle on an incline.

## The energy balance

Mechanical energy is kinetic energy plus gravitational potential energy:

\[
E=KE+GPE,\qquad KE=\tfrac12mv^2,\qquad GPE=mgh.
\]

Height is measured vertically relative to a chosen zero-height datum. Use the same datum throughout.

\[
E_A+W=E_B
\]

Here \(W\) is the **signed total work by non-gravitational forces**. Driving forces can supply positive work; a resistance opposite motion does negative work. For a constant resistance \(F\) over path distance \(d\), \(W=-Fd\). A reaction perpendicular to motion on a stationary surface does no work.

Gravity has already been accounted for through GPE. Do not add the work by weight again.

## One complete example: a coasting car

A car of mass \(800\,\text{kg}\) coasts from A to B down a straight slope inclined at \(30^\circ\) to the horizontal. It travels \(100\,\text{m}\) along the slope; its speed increases from \(10\,\text{m s}^{-1}\) to \(20\,\text{m s}^{-1}\). There is no driving force. A constant resistance \(F\) acts uphill, opposite its motion. Model the car as a particle, take \(g=10\,\text{m s}^{-2}\), and choose B as the zero-height datum. Find \(F\) using energy.

First find the vertical height:

\[
h=d\sin\theta=100\sin30^\circ=50\,\text{m}.
\]

This is the height used in GPE. The full \(100\,\text{m}\) road distance is used for resistance work.

At A:

\[
GPE_A=mgh=800\times10\times50=400000\,\text{J},
\]

\[
KE_A=\tfrac12mu^2=\tfrac12\times800\times10^2=40000\,\text{J}.
\]

At B:

\[
GPE_B=mg\times0=0,\qquad
KE_B=\tfrac12mv^2=\tfrac12\times800\times20^2=160000\,\text{J}.
\]

Now apply the signed energy balance:

\[
KE_A+GPE_A-Fd=KE_B+GPE_B,
\]

\[
40000+400000-100F=160000+0,
\]

\[
100F=440000-160000=280000,
\]

\[
\boxed{F=2800\,\text{N},\text{ acting uphill}.}
\]

Initially the car has \(440000\,\text{J}\) of mechanical energy. Finally it has \(160000\,\text{J}\). Resistance transfers the \(280000\,\text{J}\) difference to other forms, such as thermal energy. Energy is not destroyed. The car can speed up while its mechanical energy decreases: its loss of GPE exceeds its gain in KE.

## Conservation of mechanical energy

If total work by non-gravitational forces is zero, then

\[
W=0\quad\Longrightarrow\quad KE_A+GPE_A=KE_B+GPE_B.
\]

For example, consider a particle sliding along a smooth, stationary curved track with no resistance or driving force. Its normal reaction is perpendicular to its motion at every point and does no work. Mechanical energy is conserved even though this reaction may be present. Endpoint heights determine the GPE change; the track need not be straight.


**Check:** Is the car’s mechanical energy conserved merely because there is no engine driving force?

**Answer:** No. Resistance still does negative work. Zero driving work alone does not imply zero total non-gravitational work.
