# Connected Bodies (Pulleys)

Syllabus 4.4: solve simple problems which may be modelled as the motion of connected particles.

By the end you can:

- Use the string conditions.
- Write an equation for each particle.
- Follow motion when the string goes slack.

## What the model tells you

A pulley changes the direction of a string. A **light string over a smooth pulley** has the same tension magnitude throughout. A **taut, inextensible string** links the motion: the particles travel equal distances and have equal speed and acceleration magnitudes. Their vector directions can differ.

Tension pulls along the string, away from each particle. Equal tensions on different particles do not imply that either particle has zero resultant force. Draw each particle separately and choose its own positive direction.

## One complete example

P and Q hang from opposite ends of a light, inextensible string over a fixed smooth light pulley. P has mass **3 kg**, Q has mass **1 kg**. Initially, P is **0.8 m above the floor**, and Q is **1 m above the same floor**. They are released from rest with the string taut. Use **g = 10 m s⁻²** and ignore air resistance.

P reaches the floor and remains there without rebounding. The string then goes slack. Q has enough clearance below the pulley to complete its rise. Find **Q's maximum height above the floor**, finding acceleration, tension and speed at impact along the way.

The story has two stages: first P accelerates down while Q accelerates up; then P stays on the floor while Q continues upwards and slows under gravity.

### Stage 1: string taut

Use Newton's second law, **resultant force = mass × acceleration**:

\[
F=ma.
\]

For P, choose **down positive**:

\[
m_1g-T=m_1a
\]

\[
3(10)-T=3a \quad\Rightarrow\quad 30-T=3a.
\]

For Q, choose **up positive**:

\[
T-m_2g=m_2a
\]

\[
T-1(10)=1a \quad\Rightarrow\quad T-10=a.
\]

Add the scalar equations, each expressed in its chosen motion direction:

\[
30-T+T-10=3a+a
\]

\[
20=4a \quad\Rightarrow\quad \boxed{a=5\text{ m s}^{-2}}.
\]

P accelerates down and Q accelerates up. We have eliminated T algebraically; this is not a claim that all forces on the bent-string system cancel as vectors.

From Q's equation:

\[
T=m_2(g+a)=1(10+5)=\boxed{15\text{ N}}.
\]

This makes sense: P's 30 N weight exceeds the 15 N tension, whereas Q's tension exceeds its 10 N weight.

### Speed when P reaches the floor

P falls **0.8 m**, so Q rises **0.8 m** while the string remains taut. For Q, up is positive, with u = 0, a = 5 and s = 0.8.

\[
v^2=u^2+2as
\]

\[
v^2=0^2+2(5)(0.8)=8\text{ m}^2\text{ s}^{-2}.
\]

Speed is positive, so

\[
\boxed{v=\sqrt8\text{ m s}^{-1}}.
\]

Keep the exact squared speed **v² = 8** for the next stage to avoid rounding.

Q's height at this instant is

\[
h=h_0+s=1+0.8=1.8\text{ m}.
\]

This is not yet its maximum height.

### Stage 2: string slack

P is now stationary on the floor. The slack string has **T = 0**. Q keeps moving upwards, but its only force is its weight, so with up positive,

\[
-m_2g=m_2a \quad\Rightarrow\quad a=-g=-10\text{ m s}^{-2}.
\]

The particles no longer share an acceleration magnitude. Stage 1's final speed becomes stage 2's initial speed: **u² = 8**. At Q's greatest height, **v = 0**. Let its extra rise be d.

\[
v^2=u^2+2as
\]

\[
0=8+2(-10)d
\]

\[
20d=8 \quad\Rightarrow\quad \boxed{d=0.4\text{ m}}.
\]

Maximum height is measured from the original floor datum:

\[
h_{\max}=h_0+s+d
\]

\[
h_{\max}=1+0.8+0.4=\boxed{2.2\text{ m}}.
\]

Do not confuse the **extra rise, 0.4 m**, with the **height above the floor, 2.2 m**.

## What changes on a smooth table?

For a horizontal table block connected to a hanging block, the common acceleration magnitude still applies while the string is taut and inextensible, but the positive motion directions are right and down. The table block's weight and normal reaction balance vertically; tension is its horizontal resultant. Write separate Newton equations. If the hanging block hits the floor and the string slackens, reassess the forces before continuing any kinematics.

## Check your understanding

Why can Q continue upwards after P stops, even though Q's acceleration points downwards?

Its upward velocity does not disappear instantly. Gravity reduces that velocity until it reaches zero at the greatest height. Force determines acceleration, not the instantaneous direction of motion.

Source scope: Save My Exams recording *ConnectedBodiesPullies.mp4*, especially the suspended-pair two-stage example at approximately 399–582 seconds; *NewtonSecondlaw.pdf*, pages 19–22, supplies the pulley models and separate-particle diagrams. The numerical values above are a fresh teaching example of the recording's type.
