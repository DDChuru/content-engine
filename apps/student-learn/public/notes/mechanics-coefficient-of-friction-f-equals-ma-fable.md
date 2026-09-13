# Coefficient of Friction - F = ma (Fable)

Friction problems with Newton's second law follow one routine. The step people skip is the **normal reaction**: any extra vertical force, or the vertical part of an angled force, changes \(R\), and therefore changes the most friction the surface can give.

## The routine on a horizontal surface

1. Resolve any angled force into a horizontal part \(F\cos\theta\) and a vertical part \(F\sin\theta\). Afterwards the components replace the original force; never count both.
2. Find \(R\) from the vertical balance: the object does not move vertically, so the upward forces equal the downward forces.
3. Find the limit \(f_{\max}=\mu R\) and compare it with the resultant of the **other** horizontal forces (the "push").
4. Decide. Push \(\le f_{\max}\): the object stays at rest and friction is exactly what is needed to balance the push (\(a=0\)). Push \(> f_{\max}\): it slides, friction is \(f_{\max}\), and \(F=ma\) along the surface gives the acceleration.

Label friction \(f\) (or \(F_r\)), never a bare \(F\) that could also mean an applied force or the resultant.

## Worked example

A crate of mass \(4\text{ kg}\) rests on a rough horizontal floor, \(\mu=0.25\), \(g=10\text{ m s}^{-2}\). A horizontal rope pulls it to the right with \(X=9\text{ N}\). The crate is at rest to begin with and stays in contact with the floor. A second force of \(8\text{ N}\) also acts.

**(a)** The \(8\text{ N}\) presses vertically downwards. Does the crate move?

Vertically (up positive):
\[
R-mg-8=0 \quad\Rightarrow\quad R=40+8=48\text{ N}.
\]
Limit:
\[
f_{\max}=\mu R=0.25\times 48=12\text{ N}.
\]
The push along the floor is \(9\text{ N}<12\text{ N}\), so the crate stays at rest. Horizontally, with \(a=0\):
\[
X-f=ma \quad\Rightarrow\quad 9-f=4\times 0 \quad\Rightarrow\quad \boxed{f=9\text{ N},\; a=0}.
\]
Friction is \(9\text{ N}\), not \(12\text{ N}\): it only supplies what is needed.

**(b)** Instead, the \(8\text{ N}\) pulls at \(30^\circ\) above the horizontal, to the right. Find the friction and the acceleration.

Resolve the angled pull:
\[
H=F\cos\theta=8\cos 30^\circ=4\sqrt3\text{ N}\approx 6.93\text{ N},\qquad V=F\sin\theta=8\sin 30^\circ=4\text{ N}.
\]
Vertically, \(R\) and \(V\) act upwards, the weight downwards:
\[
R+V=mg \quad\Rightarrow\quad R=40-4=36\text{ N}.
\]
Limit:
\[
f_{\max}=\mu R=0.25\times 36=9\text{ N}.
\]
Push along the floor: \(9+4\sqrt3\approx 15.9\text{ N}>9\text{ N}\), so the crate slides and \(f=f_{\max}=9\text{ N}\). Newton's second law along the floor:
\[
9+4\sqrt3-9=4a \quad\Rightarrow\quad 4\sqrt3=4a \quad\Rightarrow\quad \boxed{a=\sqrt3\approx 1.73\text{ m s}^{-2}}\text{ to the right.}
\]
The rope alone could not move the crate. The angled pull did it twice over: its horizontal part added to the push, and its vertical part reduced \(R\), so the floor could grip less.

## What would change if the 8 N pulled straight up?

\[
R=40-8=32\text{ N},\qquad f_{\max}=0.25\times 32=8\text{ N}<9\text{ N},
\]
so the \(9\text{ N}\) rope alone now slides the crate, even with no extra pull along the floor: \(9-8=4a\), \(a=0.25\text{ m s}^{-2}\).

## Check yourself

- Does the extra force have a vertical part? Then \(R\neq mg\). Find \(R\) before \(f_{\max}\).
- Have you compared the push with \(f_{\max}\) before writing \(f=\mu R\)? Only a sliding (or limiting) object has \(f=\mu R\).
- Did you use \(F\cos\theta\) along the surface and \(F\sin\theta\) perpendicular to it, and then drop the original angled force?
