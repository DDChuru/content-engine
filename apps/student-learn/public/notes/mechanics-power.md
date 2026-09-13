# Power

Power describes how quickly work is done. Average power over a time interval is

$$P_{\text{average}}=\frac{W}{t}.$$

Here $W$ means work in joules and $t$ is elapsed time in seconds. Power is measured in watts: $1\text{ W}=1\text{ J s}^{-1}$. Also, $1\text{ kW}=1000\text{ W}$.

For a constant driving force $D$ parallel to the motion, acting at constant speed,

$$W=Ds,\qquad P=\frac{Ds}{t}=Dv.$$

For changing speed, $P=Dv$ gives the instantaneous power of a parallel driving force: use the force and speed at the same instant. Use the engine driving force to calculate engine power.

## Worked example: a steady climb

A vehicle of mass $1000\text{ kg}$ climbs a straight hill at a steady speed of $20\text{ m s}^{-1}$. The hill makes angle $\theta$ with the horizontal, where $\sin\theta=1/20$. A constant non-gravitational resistance $f=500\text{ N}$ acts downhill. Take $g=10\text{ m s}^{-2}$ and model the vehicle as a particle. The engine driving force $D$ is uphill, parallel to the motion; the road reaction $R$ is perpendicular to the road. Find the engine power in kilowatts.

Steady speed on a straight road means $a=0$. Take uphill as positive. The downhill component of weight is $mg\sin\theta$. Reaction has no component along the road.

Start with Newton’s second law along the slope:

$$D-f-mg\sin\theta=ma=0.$$

Substitute the givens:

$$D-500-1000(10)\left(\frac1{20}\right)=0.$$

Hence

$$D-500-500=0,\qquad D=1000\text{ N}.$$

Now apply the power formula:

$$P=Dv=1000(20)=20000\text{ W}.$$

Convert to the requested unit:

$$P=\frac{20000}{1000}=\boxed{20\text{ kW}}.$$

The resultant force is zero, but the engine force and engine power are not zero. The engine continues doing positive work as the vehicle climbs against gravity and resistance.

## What changes at constant power?

At fixed engine power and nonzero speed,

$$P=Dv\quad\Longrightarrow\quad D=\frac{P}{v}.$$

A higher speed therefore gives a smaller available driving force. At the limiting steady speed for the conditions, with the engine delivering its maximum power, driving force balances all opposing forces and acceleration is zero. The formula $P/v$ is not defined at $v=0$; it does not model a launch from rest.

## Check your understanding

A vehicle climbs steadily, so its resultant force is zero. Must its engine power be zero?

**No.** Engine power uses the engine driving force in $P=Dv$. Balanced forces mean zero acceleration; they do not mean that each individual force does no work.
