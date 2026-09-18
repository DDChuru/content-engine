# Connected Bodies (Ropes & Tow Bars)

A **taut, inextensible** rope keeps the separation between two bodies fixed. For bodies travelling along the same straight line, this means they share a velocity and acceleration. A **light** connection has negligible mass: its end forces have equal magnitude because accelerating the connection requires no resultant force.

A rope can transmit **tension**: it pulls each body towards the other. A rigid tow bar can also transmit **thrust**, or compression: it pushes the bodies apart.

For example, suppose a car brakes while towing a trailer with negligible resistance. A rigid bar can push the trailer backwards, slowing it. A rope cannot push; if the trailer approaches the car, the rope goes slack. Tension is then zero and the bodies need not share an acceleration. Deceleration alone does not establish that every tow bar is compressed: the other forces matter.

## Choose the body or system

Begin with Newton’s second law:

\[
F_{\text{resultant}}=ma.
\]

Take right as positive. Let the car be body 1 and the trailer body 2, with driving force \(D\) and resistances \(R_1\) and \(R_2\).

For the trailer, tension acts right and resistance left:

\[
T-R_2=m_2a.
\]

For the car, the driving force acts right; tension and resistance act left:

\[
D-R_1-T=m_1a.
\]

Adding these equations cancels \(+T\) and \(-T\). The connection forces are internal to the combined system:

\[
D-R_1-R_2=(m_1+m_2)a.
\]

The forces still act on the individual vehicles. They cancel only when both vehicles are included. On the level road there is no vertical acceleration, so each normal reaction balances its vehicle’s weight.

## Worked example: a car towing a trailer

A car of mass **800 kg** tows a trailer of mass **200 kg** along a straight, level road. The driving force is a constant **1500 N to the right**. Constant resistance is **300 N to the left on the car**, and **200 N to the left on the trailer**. Model the vehicles as particles and the tow bar as light and inextensible. Find the common acceleration and tow-bar tension.

All givens: \(m_1=800\), \(m_2=200\), \(D=1500\), \(R_1=300\), \(R_2=200\). Unknowns: \(a\) and \(T\). Right is positive.

### 1. Find the common acceleration

Use the whole system, which removes the unknown tension:

\[
F=ma
\]
\[
D-R_1-R_2=(m_1+m_2)a
\]
\[
1500-300-200=(800+200)a
\]
\[
1000=1000a
\]
\[
a=\frac{1000}{1000}=\boxed{1\text{ m s}^{-2}}.
\]

Both vehicles accelerate to the right. They gain the same velocity each second, keeping the separation fixed.

### 2. Find the tension

Use the trailer alone, so tension remains in the equation:

\[
F=ma
\]
\[
T-R_2=m_2a
\]
\[
T-200=200\times1
\]
\[
T=200+200=\boxed{400\text{ N}}.
\]

Tension both overcomes the resistance and provides the trailer’s resultant force. The 400 N force pulls the trailer right and the car left.

### 3. Check with the car

\[
D-R_1-T=m_1a
\]
\[
1500-300-400=800\times1.
\]

Both sides are 800 N. Equal connection forces do not mean equal resultant forces: each vehicle has other forces acting on it.

If trailer resistance increased while engine force and masses stayed unchanged, the forward resultant of the whole system would decrease. Its acceleration would therefore decrease.

## Check yourself

Can you cancel tension when considering the trailer alone?

**No.** The opposite tension acts on the car, outside the trailer’s boundary.

## Remember

- Explain a shared acceleration.
- Choose the system or one body.
- Find the force in the connection.

Cambridge 9709, section 4.4. [Official syllabus, p.33](https://www.cambridgeinternational.org/Images/697427-2026-2027-syllabus.pdf#page=33).
