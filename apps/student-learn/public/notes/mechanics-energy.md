# Energy

For Cambridge International AS & A Level Mathematics 9709, Mechanics, section 4.5.

By the end you can:

- Calculate kinetic energy changes.
- Use an energy change to find mass.
- Calculate gravitational potential energy changes.

## Kinetic energy

A particle of mass $m$ moving with speed $v$ has kinetic energy

$$KE=\frac12mv^2.$$

Use kilograms and metres per second to obtain joules (J). Energy is a scalar: it has no direction. Speed is the magnitude of velocity. Kinetic energy is nonnegative; a stationary particle has zero kinetic energy.

For constant mass, with initial speed $u$ and final speed $v$,

$$\Delta KE=KE_{\rm final}-KE_{\rm initial}=\frac12mv^2-\frac12mu^2=\frac12m(v^2-u^2).$$

Square each speed, then subtract. In general, $v^2-u^2$ is **not** $(v-u)^2$. A particle can lose kinetic energy: $\Delta KE<0$ means its final kinetic energy is smaller, not that kinetic energy itself is negative.

## One journey: cyclist and bicycle

Model a cyclist and bicycle as a single particle of constant total mass. From A to B, their speed increases from $4\text{ m s}^{-1}$ to $8\text{ m s}^{-1}$ while they climb $3\text{ m}$ vertically. Their kinetic energy increases by $2.4\text{ kJ}$. Take $g=10\text{ m s}^{-2}$, constant, and choose A as the zero-height datum.

Find the total mass, then the gain in gravitational potential energy. The distance along the road is neither given nor needed.

### Find total mass

Start with the formula:

$$\Delta KE=\frac12m(v^2-u^2).$$

Convert units first: $1\text{ kJ}=1000\text{ J}$, so $2.4\text{ kJ}=2400\text{ J}$.

$$\begin{aligned}
2400&=\frac12m(8^2-4^2)\\
&=\frac12m(64-16)\\
&=\frac12m\times48=24m,\\
m&=\frac{2400}{24}=100\text{ kg}.
\end{aligned}$$

This is the **combined** mass of the cyclist and bicycle in the particle model.

## Gravitational potential energy

Relative to a chosen height datum,

$$GPE=mgh.$$

Here $h$ is vertical height relative to the datum. For constant $m$ and $g$,

$$\Delta GPE=mg\Delta h=mg(h_{\rm final}-h_{\rm initial}).$$

With mass in kg, $g$ in m s$^{-2}$ and height in m, the energy is in joules. Choosing another datum changes individual GPE values, but not the GPE change between the same two positions.

An object need not be stationary to have gravitational potential energy. A cyclist moving above the datum can have **both KE and GPE**.

### Complete the same journey

Using the mass already found,

$$\begin{aligned}
\Delta h&=3-0=3\text{ m},\\
\Delta GPE&=mg\Delta h\\
&=100\times10\times3\\
&=3000\text{ J}.
\end{aligned}$$

The change is positive: a **gain of 3000 J**. Use the vertical rise, not the sloping road length.

If the cyclist later descends, final height is lower than initial height: $\Delta h<0$, so $\Delta GPE<0$. This is a loss of GPE. Height change alone does not determine whether the cyclist speeds up or slows down; no energy balance is assumed here.

## Check your understanding

A cyclist is moving above the chosen datum. Must GPE be zero because the cyclist is moving?

**No.** Motion gives kinetic energy; height relative to the datum gives gravitational potential energy. Both may be present at the same time.
