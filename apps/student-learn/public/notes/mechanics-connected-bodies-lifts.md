# Connected Bodies: Lifts

A passenger who remains in contact with a lift floor shares the lift's vertical acceleration. Choose **upwards as positive** and identify the body before drawing its forces.

## Which forces act on which body?

Let the lift have mass \(M\), the passenger mass \(m\), the cable tension \(T\), and the upward floor reaction on the passenger \(R\).

| Chosen body | Upward force | Downward force(s) | Newton's second law, up positive |
|---|---|---|---|
| Passenger alone | \(R\) | \(mg\) | \(R-mg=ma\) |
| Lift and passenger together | \(T\) | \((M+m)g\) | \(T-(M+m)g=(M+m)a\) |
| Lift alone | \(T\) | \(Mg\) and \(R\) | \(T-Mg-R=Ma\) |

The floor pushes the passenger upwards. The passenger pushes the floor downwards with an equal reaction. These are a Newton's third-law pair acting on **different bodies**. They cancel when the lift and passenger are treated as one system, because both contact forces are internal to that system. Cable tension does not act directly on the passenger.

## Worked journey: moving up and braking

A passenger rides upwards in a lift. It travels steadily, slows as it approaches the destination, and finally stops. Analyse **only the uniform braking interval**:

- Lift mass \(M=400\text{ kg}\); passenger mass \(m=60\text{ kg}\).
- Initial velocity \(u=+4\text{ m s}^{-1}\); final velocity \(v=0\).
- Braking time \(t=2\text{ s}\); \(g=10\text{ m s}^{-2}\).
- The passenger remains in contact with the floor; the cable remains taut.
- Ignore other external vertical forces and choose up as positive.
- Find acceleration \(a\), floor reaction \(R\), and cable tension \(T\).

### 1. Acceleration

With constant acceleration:

\[
v=u+at
\]
\[
0=4+2a
\]
\[
-4=2a \quad\Rightarrow\quad \boxed{a=-2\text{ m s}^{-2}}.
\]

The acceleration is **downwards**. The lift still moves upwards during braking: its upward velocity decreases until it reaches zero. Direction of motion and direction of acceleration need not agree.

### 2. Passenger's floor reaction

Start with \(F_{\text{net}}=ma\). For the passenger alone, resolve upwards:

\[
R-mg=ma
\]
\[
R-60\times10=60\times(-2)
\]
\[
R-600=-120
\]
\[
\boxed{R=480\text{ N upwards}}.
\]

The upward reaction is less than the passenger's downward weight. The resultant is 120 N downwards, producing the downward acceleration.

### 3. Cable tension

For the lift and passenger together, \(F_{\text{net}}=(M+m)a\):

\[
T-(M+m)g=(M+m)a.
\]

The total mass is \(400+60=460\text{ kg}\), so

\[
T-460\times10=460\times(-2)
\]
\[
T-4600=-920
\]
\[
\boxed{T=3680\text{ N upwards}}.
\]

The cable supports the combined system. Its upward tension is less than the total downward weight during braking.

## What changes in another part of the journey?

At **constant velocity**, acceleration is zero. Then \(R-mg=0\), giving \(R=mg\), and \(T=(M+m)g\). The same balance applies once the lift is held stationary; the braking answers do not continue unchanged after it has stopped.

If the lift instead **speeds up upwards**, its acceleration is upwards. From the same force equations, \(R>mg\) and \(T>(M+m)g\).

**Check yourself:** the lift travels upwards at constant velocity. Is its acceleration downwards? **No.** Constant velocity means zero acceleration, so the relevant forces balance.

## Remember

- Distinguish motion from acceleration.
- Choose the body and its forces.
- Calculate reaction and cable tension.

Cambridge 9709, section 4.4. This lesson covers a two-body lift/passenger example; additional stacked or carried loads require selecting the appropriate further bodies. Scope checked against the Connected Bodies (Lifts) recording and Newton's Second Law notes.
