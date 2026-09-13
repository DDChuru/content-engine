# Work

**Cambridge 9709 Mechanics — M4.5a; syllabus 4.5.**

Syllabus excerpt: “work done by a force”.

By the end you can:

- Calculate work from force and displacement.
- Calculate work against friction and gravity.

## Work and direction

For a constant force,

$$
W=Fd\cos\alpha,
$$

where $\alpha$ is the angle between the force and displacement. The parallel component is $F\cos\alpha$. The perpendicular component does no work because there is no displacement in its direction.

If the force is parallel to displacement, $\alpha=0$ and $W=Fd$. A normal reaction is perpendicular to motion along a fixed plane, so it does no work. If there is no displacement, there is no mechanical work.

Work is a scalar, measured in joules:

$$
1\text{ J}=1\text{ N m}.
$$

Work done **against** a resistance is the positive energy requirement to overcome it. Work done **by** that resistance is negative when it opposes the motion.

## The complete problem

A $4\text{ kg}$ crate slides $5\text{ m}$ up the line of greatest slope of a rough plane inclined at $30^\circ$ above horizontal. The coefficient of friction is $\mu=0.25$ and $g=10\text{ m s}^{-2}$. A pull $P$ acts parallel uphill. Speed is constant and contact is maintained. Only pull, weight, normal reaction and sliding friction act; use the sliding model $f=\mu R$.

Find the **work done against friction** and the **work done against gravity**.

## Work against friction

First resolve perpendicular to the plane. There is no perpendicular acceleration, and the pull has no component in that direction:

$$
\begin{aligned}
R&=mg\cos\theta\\
 &=4\times10\cos30^\circ\\
 &=20\sqrt3\text{ N}.
\end{aligned}
$$

Now use the sliding-friction model:

$$
\begin{aligned}
f&=\mu R\\
 &=0.25\times20\sqrt3\\
 &=5\sqrt3\text{ N}.
\end{aligned}
$$

Friction acts along the slope, so use the full slope distance:

$$
\begin{aligned}
W_f&=fd\\
 &=5\sqrt3\times5\\
 &=25\sqrt3\text{ J}\\
 &\approx43.3\text{ J}.
\end{aligned}
$$

Here $W_f$ means work **against** friction.

## Work against gravity

Gravity acts vertically. First find the **vertical rise**, rather than using the slope distance in $mgh$:

$$
\begin{aligned}
h&=d\sin\theta\\
 &=5\sin30^\circ\\
 &=2.5\text{ m}.
\end{aligned}
$$

Then multiply weight by the upward vertical displacement:

$$
\begin{aligned}
W_g&=mgh\\
 &=4\times10\times2.5\\
 &=100\text{ J}.
\end{aligned}
$$

Here $W_g$ means work **against** gravity. Friction uses the $5\text{ m}$ slope distance; gravity uses the $2.5\text{ m}$ vertical rise.

## Constant speed does not mean every work is zero

For this uphill journey, the works done **by** the resisting forces are

$$
W_{\text{by friction}}=-fd,
\qquad
W_{\text{by gravity}}=-mgh.
$$

Constant speed along a straight slope means the forces balance:

$$
P-f-mg\sin\theta=0.
$$

Multiply the balance by the slope distance $d$. Since $W_{\text{pull}}=Pd$ and $h=d\sin\theta$,

$$
\begin{aligned}
Pd-fd-mgd\sin\theta&=0\\
W_{\text{pull}}-fd-mgh&=0.
\end{aligned}
$$

Total work is zero, but the individual works are not: pulling work is positive, and the works by friction and gravity are negative. Reaction contributes zero work because it is perpendicular to motion.

## What changes downhill?

Friction still opposes motion, so its work remains negative. Gravity now helps the motion, so its work becomes positive. Always distinguish work **by a force** from work **against a force**.
