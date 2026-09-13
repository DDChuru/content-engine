# Coefficient of Friction (Harder Problems)

Syllabus 4.1: *limiting friction and limiting equilibrium*. A block held still on a rough slope can be about to slip in **two** directions, and the direction of friction depends on which one. This decides the least and the greatest push that keep it in equilibrium.

## When is friction at its limit?

- At rest, friction simply **matches the demand**: push a block on a rough floor with 20 N and friction pushes back with exactly 20 N.
- Friction can only grow up to a limit: \(f \le \mu R\).
- When the demand reaches that limit the block is **on the point of sliding**. This is **limiting equilibrium**, and only then \(f = \mu R\).
- A block at rest does **not** always have maximum friction. On a slope, write \(f = \mu R\) only when the question says the block is about to slip (or is in limiting equilibrium).

## Which way does friction act?

Friction opposes the **impending** slip, not the push:

| Situation | Block is about to slip | Friction acts |
|---|---|---|
| Least push that holds it | down the slope | **up** the slope |
| Greatest push before it moves | up the slope | **down** the slope |

## Worked example

A block of mass \(4\text{ kg}\) rests on a rough plane inclined at \(30^\circ\) to the horizontal, \(\mu = 0.25\), \(g = 10\text{ m s}^{-2}\). A force \(P\) acts up the plane along the line of greatest slope and the block is in equilibrium. Find the least and greatest values of \(P\).

### 1. Resolve the weight and find the friction limit

\[
mg = 4\times 10 = 40\text{ N},\qquad mg\cos 30^\circ = 20\sqrt3 \approx 34.6\text{ N},\qquad mg\sin 30^\circ = 20\text{ N}.
\]

Perpendicular to the slope nothing moves, and \(P\) has no part in that direction:

\[
R - mg\cos 30^\circ = 0 \quad\Rightarrow\quad R = 20\sqrt3 \approx 34.6\text{ N}.
\]

\[
f_{\max} = \mu R = 0.25\times 20\sqrt3 = 5\sqrt3 \approx 8.66\text{ N}.
\]

### 2. Least push: about to slip down, friction up the slope

Along the slope the forces balance (up positive):

\[
P + f_{\max} - mg\sin 30^\circ = 0
\]
\[
P + 8.66 - 20 = 0 \quad\Rightarrow\quad \boxed{P_{\min} = 20 - 5\sqrt3 \approx 11.3\text{ N}}.
\]

Friction helps here: it carries \(8.66\text{ N}\), so the push can be smaller.

### 3. Greatest push: about to slip up, friction down the slope

\[
P - f_{\max} - mg\sin 30^\circ = 0
\]
\[
P - 8.66 - 20 = 0 \quad\Rightarrow\quad \boxed{P_{\max} = 20 + 5\sqrt3 \approx 28.7\text{ N}}.
\]

Same block, same friction limit; only the **direction** of friction changed, and the answer moved from \(11.3\) to \(28.7\text{ N}\).

## Between the two limits

Any push with \(11.3 \le P \le 28.7\text{ N}\) holds the block. In that range friction is **less** than \(\mu R\), so \(f = \mu R\) must not be assumed. For example, with \(P = 20\text{ N}\):

\[
P - mg\sin 30^\circ = f \quad\Rightarrow\quad 20 - 20 = f,\qquad f = 0.
\]

The push alone balances the weight component and friction is not needed at all.

## What to remember

- Know when friction is at its limit: only in limiting equilibrium (or when sliding).
- Friction opposes the impending slip.
- Least \(P\): friction up the slope. Greatest \(P\): friction down the slope. Both endpoints have zero acceleration.
