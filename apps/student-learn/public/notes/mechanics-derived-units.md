# Derived Units for Mechanics

## What a derived unit is

A base unit measures one basic kind of quantity. In mechanics, the most useful base units are the metre for length, the second for time and the kilogram for mass. A **derived unit** is built by multiplying or dividing base units to match the equation for a new quantity.

For example, speed is distance divided by time, so its unit is

\(\frac{\mathrm{m}}{\mathrm{s}}=\mathrm{m\,s^{-1}}\).

The negative power means “in the denominator”: \(\mathrm{s^{-1}}\) means per second, and \(\mathrm{s^{-2}}\) means per second squared.

## Speed, velocity and acceleration

Speed and velocity have the same unit:

\(\mathrm{m\,s^{-1}}\).

Speed is scalar; velocity also includes direction. The unit says how many metres of distance or displacement are covered each second.

Acceleration is the rate at which velocity changes:

\(a=\frac{\Delta v}{\Delta t}\).

Its unit follows from dividing \(\mathrm{m\,s^{-1}}\) by another second:

\(\frac{\mathrm{m\,s^{-1}}}{\mathrm{s}}=\mathrm{m\,s^{-2}}\).

Read this as **metres per second squared**. The most useful intuition is **per second per second**: an acceleration of \(3\,\mathrm{m\,s^{-2}}\) means the velocity changes by \(3\,\mathrm{m\,s^{-1}}\) during each second.

## Force and the newton

Newton's second law is

\(F=ma\).

Mass has unit \(\mathrm{kg}\), and acceleration has unit \(\mathrm{m\,s^{-2}}\). Therefore force has the derived unit

\(\mathrm{kg\,m\,s^{-2}}\).

This combination is given the special name **newton**:

\(1\,\mathrm{N}=1\,\mathrm{kg\,m\,s^{-2}}\).

So one newton is the force that gives a mass of \(1\,\mathrm{kg}\) an acceleration of \(1\,\mathrm{m\,s^{-2}}\).

## Weight is a force

Weight is the gravitational force on a mass:

\(W=mg\).

Weight is measured in newtons, \(\mathrm{N}\), not kilograms. Here \(g\) is the local acceleration due to gravity, commonly taken as \(9.8\,\mathrm{m\,s^{-2}}\) near Earth's surface unless the question supplies another value. Mass stays fixed when location changes, but weight changes when \(g\) changes.

## Converting compound units

Treat a compound unit as a fraction. Convert the numerator and denominator separately, then combine their scale factors.

- Since \(1\,\mathrm{km}=1000\,\mathrm{m}\) and \(1\,\mathrm{h}=3600\,\mathrm{s}\),
  \(1\,\mathrm{km\,h^{-1}}=\frac{1000}{3600}\,\mathrm{m\,s^{-1}}=\frac{5}{18}\,\mathrm{m\,s^{-1}}\).
- Therefore, to change \(\mathrm{km\,h^{-1}}\) to \(\mathrm{m\,s^{-1}}\), multiply by \(\frac{5}{18}\). To reverse the conversion, multiply by \(\frac{18}{5}\).
- A squared time unit needs a squared conversion factor:
  \(1\,\mathrm{km\,h^{-2}}=\frac{1000}{3600^2}\,\mathrm{m\,s^{-2}}\).
- Area units also square the length conversion. Since \(1\,\mathrm{m^2}=100^2\,\mathrm{cm^2}\),
  \(0.004\,\mathrm{N\,cm^{-2}}=0.004\times100^2=40\,\mathrm{N\,m^{-2}}\).

A reliable rule is: write the original unit as a numerator over a denominator, replace each part by its target-unit equivalent, and apply every power to the conversion factor as well as the unit.

## Worked examples

### Example A — speed conversion

Convert \(72\,\mathrm{km\,h^{-1}}\) to \(\mathrm{m\,s^{-1}}\).

Convert the numerator:

\(72\,\mathrm{km\,h^{-1}}=72\times1000\,\mathrm{m\,h^{-1}}=72000\,\mathrm{m\,h^{-1}}\).

Convert the denominator:

\(72000\,\mathrm{m\,h^{-1}}=\frac{72000}{3600}\,\mathrm{m\,s^{-1}}=20\,\mathrm{m\,s^{-1}}\).

So \(72\,\mathrm{km\,h^{-1}}=20\,\mathrm{m\,s^{-1}}\).

### Example B — acceleration conversion

Convert \(324\,\mathrm{km\,h^{-2}}\) to \(\mathrm{m\,s^{-2}}\).

\(324\,\mathrm{km\,h^{-2}}=\frac{324\times1000}{3600^2}\,\mathrm{m\,s^{-2}}\)

\(=\frac{324000}{12960000}\,\mathrm{m\,s^{-2}}\)

\(=0.025\,\mathrm{m\,s^{-2}}\).

The denominator is squared, so the factor \(3600\) must also be squared.

### Example C — force with a mass conversion

A ball of mass \(225\,\mathrm{g}\) accelerates at \(3\,\mathrm{m\,s^{-2}}\). Find the force.

First convert the mass:

\(225\,\mathrm{g}=\frac{225}{1000}\,\mathrm{kg}=0.225\,\mathrm{kg}\).

Then use \(F=ma\):

\(F=0.225\times3=0.675\,\mathrm{N}\).

### Example D — weight

Find the weight of a \(2.4\,\mathrm{kg}\) object where \(g=9.8\,\mathrm{m\,s^{-2}}\).

\(W=mg\)

\(W=2.4\times9.8=23.52\,\mathrm{N}\).

To a sensible number of significant figures, \(W=24\,\mathrm{N}\).

## Quick self-check

- **Question A:** Which base units combine to make a newton?  
  **Answer:** \(\mathrm{kg}\), \(\mathrm{m}\) and \(\mathrm{s}\), combined as \(\mathrm{kg\,m\,s^{-2}}\).
- **Question B:** Convert \(90\,\mathrm{km\,h^{-1}}\) to \(\mathrm{m\,s^{-1}}\).  
  **Answer:** \(90\times\frac{5}{18}=25\,\mathrm{m\,s^{-1}}\).
- **Question C:** Convert \(15\,\mathrm{m\,s^{-1}}\) to \(\mathrm{km\,h^{-1}}\).  
  **Answer:** \(15\times\frac{18}{5}=54\,\mathrm{km\,h^{-1}}\).
- **Question D:** Convert \(129.6\,\mathrm{km\,h^{-2}}\) to \(\mathrm{m\,s^{-2}}\).  
  **Answer:** \(\frac{129.6\times1000}{3600^2}=0.01\,\mathrm{m\,s^{-2}}\).
- **Question E:** A mass of \(5\,\mathrm{kg}\) is in a field where \(g=9.8\,\mathrm{m\,s^{-2}}\). What is its weight?  
  **Answer:** \(W=5\times9.8=49\,\mathrm{N}\).

## Common exam slips

- Reading \(\mathrm{m\,s^{-2}}\) as “metres per square second”. Say “metres per second squared”.
- Converting kilometres but forgetting to convert hours.
- Dividing by \(3600\) only once when converting \(\mathrm{h^{-2}}\); the correct factor is \(3600^2\).
- Reversing the speed factors: use \(\frac{5}{18}\) for \(\mathrm{km\,h^{-1}}\) to \(\mathrm{m\,s^{-1}}\), and \(\frac{18}{5}\) in the other direction.
- Substituting grams into \(F=ma\) instead of converting to kilograms.
- Giving force or weight in \(\mathrm{kg}\), or mass in \(\mathrm{N}\).
- Treating \(g\) as a fixed universal constant. Use the local value supplied by the question.
- Dropping a squared power from an area or time conversion.
- Writing a number without its final unit.
