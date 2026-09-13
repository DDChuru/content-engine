# Resolving Forces & Inclined Planes

A force at an angle does two jobs at once. **Resolving** it means splitting it into two components at right angles so that each job can be handled on its own. The components together do exactly what the original force does, so a force and its components are never counted together.

## Components of a force

Draw the force \(F\) as the hypotenuse of a right-angled triangle. If \(F\) makes angle \(\theta\) with the horizontal:

\[
\text{horizontal component } H = F\cos\theta, \qquad \text{vertical component } V = F\sin\theta.
\]

Adjacent = hypotenuse × cos, opposite = hypotenuse × sin. Check the extremes: at \(\theta = 0\) the whole force is horizontal (\(\cos 0 = 1\)); at \(\theta = 90^\circ\) it is all vertical.

## Two or more forces

Resolve each force separately, then add the horizontal parts and add the vertical parts:

\[
R_x = F_1\cos\theta_1 + F_2\cos\theta_2, \qquad R_y = F_1\sin\theta_1 + F_2\sin\theta_2.
\]

These are the components of the resultant, so

\[
R^2 = R_x^2 + R_y^2, \qquad \tan\theta = \frac{R_y}{R_x}.
\]

A negative total simply means that component points the other way.

## Worked example: an angled pull on a smooth floor

A box rests on a smooth horizontal floor. A rope tied to it slopes upwards at \(60^\circ\) to the floor. Someone pulls, and the box speeds up along the floor without lifting off.

- Rope tension \(16\text{ N}\) at \(60^\circ\) above the horizontal.
- Acceleration along the floor \(a = 2\text{ m s}^{-2}\); \(g = 10\text{ m s}^{-2}\).
- Smooth floor (no friction); the box stays on the floor (no vertical acceleration); the rope is light.
- Find the mass \(m\) and the normal reaction \(R\).

Three forces act on the box: the pull, the weight \(mg\) downwards and the normal reaction \(R\) upwards. Only the pull is at an angle, so that is the one we split.

### 1. Resolve the pull

\[
H = F\cos\theta = 16\cos 60^\circ = 8\text{ N}, \qquad
V = F\sin\theta = 16\sin 60^\circ = 8\sqrt{3} \approx 13.9\text{ N}.
\]

From here on \(H\) and \(V\) replace the \(16\text{ N}\) force.

### 2. Newton's second law horizontally

The floor is smooth, so \(H\) is the only horizontal force:

\[
H = ma \quad\Rightarrow\quad 8 = 2m \quad\Rightarrow\quad \boxed{m = 4\text{ kg}}.
\]

### 3. Vertically: no acceleration, so up balances down

\[
R + V = mg \quad\Rightarrow\quad R + 8\sqrt{3} = 4 \times 10 \quad\Rightarrow\quad R = 40 - 8\sqrt{3} \quad\Rightarrow\quad \boxed{R \approx 26.1\text{ N}}.
\]

The weight is \(40\text{ N}\), but the floor pushes up with only \(26.1\text{ N}\): the rope's upward component carries the rest.

**What would change if the rope were horizontal?** Then \(V = 0\) and \(R = mg = 40\text{ N}\). (If the upward component ever reached the weight, the box would leave the floor.)

## Weight on a slope

Put the box on a smooth slope at angle \(\theta\) with nothing pulling it. Weight acts straight down; the normal reaction acts perpendicular to the slope. Choose axes **parallel and perpendicular to the slope**, because the box can only move along the slope. Now the weight is the force at an angle, so the weight is what we split.

Why is the angle between the weight and the perpendicular also \(\theta\)? Turn the horizontal and the slope through \(90^\circ\): they become the vertical and the perpendicular, with the same angle between them.

| Direction | Component of weight |
|---|---|
| Down the slope | \(mg\sin\theta\) |
| Into the slope | \(mg\cos\theta\) |

**Conditions first:** smooth slope, the box stays on the slope, and no other force presses into the slope. Then the perpendicular forces balance:

\[
R = mg\cos\theta.
\]

Along the slope, Newton's second law gives

\[
mg\sin\theta = ma \quad\Rightarrow\quad a = g\sin\theta,
\]

whatever the mass. If another force also has a component into the slope, \(R\) changes: include that component before balancing.

## The routine

1. Split the angled force into components.
2. Replace the force by its components.
3. Apply Newton's second law along each axis.

*Syllabus 4.1 (p. 31): "understand the vector nature of force, and find and use components and resultants".*
