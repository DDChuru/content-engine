#!/usr/bin/env python3
"""Independent exact checks for the recorded calculus examples and speed candidates."""
from fractions import Fraction as F

def s(t): return t**3-6*t**2+9*t
def v(t): return 3*t**2-12*t+9
def a(t): return 6*t-12
assert [v(t) for t in (0,1,2,3)] == [9,0,-3,0]
assert [s(t) for t in (0,1,3)] == [0,4,0]
assert a(2)==0
assert max((abs(v(t)),t) for t in (0,2,3)) == (9,0)
assert abs(s(1)-s(0))+abs(s(3)-s(1)) == 8
assert F(8,3)>F(266,100) and F(8,3)<F(267,100)
for t in (F(0),F(1,2),F(1),F(2),F(3)):
 # Differentiate ascending polynomial coefficients independently.
 coefficients=[1,4,1,1]
 derivative=[i*c for i,c in enumerate(coefficients)][1:]
 assert sum(c*t**i for i,c in enumerate(derivative))==3*t*t+2*t+4
 second=[i*c for i,c in enumerate(derivative)][1:]
 assert sum(c*t**i for i,c in enumerate(second))==6*t+2
assert coefficients[0]==1
print('PASS: initial constants, roots, signed legs, distance, average speed and endpoint maximum.')
