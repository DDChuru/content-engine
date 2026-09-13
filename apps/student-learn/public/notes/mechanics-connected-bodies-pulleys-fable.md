# Connected Bodies: Pulleys

Two particles joined by a **light inextensible string** over a **small smooth pulley** move together while the string is taut. Treat each particle separately with Newton's second law, using each particle's own direction of motion as positive.

## Why one acceleration and one tension?

| Modelling word | What it gives you |
|---|---|
| String **inextensible** | Every centimetre one particle moves, the other moves the same. Same speed, same acceleration magnitude, opposite directions. |
| String **light**, pulley **smooth** and **light** | Nothing along the string or at the pulley can change the pull, so the tension \(T\) is the same on both sides. |

If the pulley were **rough**, friction at the pulley could make the two tensions differ. That is why exam questions say "smooth".

## Worked example: two stages

Particles \(P\) (6 kg) and \(Q\) (4 kg) hang from a light inextensible string over a small smooth pulley. \(P\) is 1 m above the floor and \(Q\) is 0.6 m above the floor. The system is released from rest; \(g = 10\text{ m s}^{-2}\). \(P\) stays on the floor when it lands, \(Q\) never reaches the pulley, and there is no air resistance.

Find the acceleration and tension while the string is taut, the speed of \(P\) as it hits the floor, and the greatest height reached by \(Q\).

**Which way does it move?** \(P\) is heavier, so \(P\) moves down and \(Q\) moves up.

### 1. Newton's second law, one particle at a time

Formula: \(F = ma\).

\(P\), downwards positive:
\[
mg - T = ma \quad\Rightarrow\quad 60 - T = 6a
\]

\(Q\), upwards positive:
\[
T - mg = ma \quad\Rightarrow\quad T - 40 = 4a
\]

Add the equations (the \(T\)'s cancel):
\[
20 = 10a \quad\Rightarrow\quad \boxed{a = 2\text{ m s}^{-2}}
\]

Back into \(Q\)'s equation:
\[
T = 40 + 4 \times 2 = \boxed{48\text{ N}}
\]

Sense check: 48 N lies between the two weights, 40 N and 60 N, so \(P\) accelerates down and \(Q\) accelerates up.

### 2. Stage one: connected motion

\(P\) falls 1 m to the floor, so \(Q\) rises 1 m at the same speed. Constant acceleration:
\[
v^2 = u^2 + 2as = 0 + 2 \times 2 \times 1 = 4 \quad\Rightarrow\quad \boxed{v = 2\text{ m s}^{-1}}
\]

\(Q\) is now \(0.6 + 1 = 1.6\text{ m}\) above the floor.

### 3. Stage two: \(Q\) on its own

\(P\) is on the floor, the string is slack, so \(T = 0\). The only force on \(Q\) is its weight; upwards positive, \(a = -g = -10\text{ m s}^{-2}\). \(Q\) starts stage two with \(u = 2\) and reaches \(v = 0\) at the top:
\[
v^2 = u^2 + 2as \quad\Rightarrow\quad 0 = 4 - 20s \quad\Rightarrow\quad s = 0.2\text{ m}
\]

Greatest height above the floor:
\[
1.6 + 0.2 = \boxed{1.8\text{ m}}
\]

**Key idea:** the final velocity of stage one is the initial velocity of stage two, and the acceleration changes from \(2\text{ m s}^{-2}\) (string taut) to \(-10\text{ m s}^{-2}\) (string slack).

## What would change if the masses were equal?

Nothing moves: the tension equals each weight and the acceleration is zero. It is the **difference in weight** that drives the motion.

## Checklist

- Say why both particles share one acceleration and one tension (inextensible; light and smooth).
- Write Newton's second law for **each particle separately**, each with its own positive direction, then add to eliminate \(T\).
- Use suvat through **both stages**: taut string, then slack string with \(a = -g\).
