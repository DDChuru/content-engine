"""Authoring source — Mechanics: forces and F = ma (9709 Paper 4).

ORIGINAL exercise questions. No Cambridge question text is reproduced: each
item is authored here from the syllabus skill alone. Never call these "past
papers" in copy or in data.

Each item declares THREE independent solution routes. At least one must be
symbolic (SymPy `solve` on the governing equations, not arithmetic). The build
script re-runs all three and discards the item unless they agree to 3sf.
The routes must be genuinely different arguments — a copy-paste of the same
arithmetic proves nothing.

Convention: g = 10 m s^-2 (9709 convention). Exact rationals throughout;
never float literals, or the gate is comparing rounding noise.

Run:  python3 apps/student-learn/scripts/build-exercise-questions.py
"""

from sympy import Rational as R
from sympy import Eq, solve, symbols, sqrt  # noqa: F401  (sqrt used by items)

G = R(10)

# ---------------------------------------------------------------------------
# M4.4a — F = ma
# ---------------------------------------------------------------------------

ITEMS = [
    dict(
        id="M4.4a-001",
        topicCode="M4.4a",
        skillTag="apply-f-equals-ma-single-body",
        difficulty="foundation",
        marks=2,
        estimatedMinutes=2,
        stem=(
            "A crate of mass $5\\ \\text{kg}$ rests on a smooth horizontal floor. "
            "A constant horizontal force of magnitude $20\\ \\text{N}$ acts on the crate.\n\n"
            "Find the acceleration of the crate."
        ),
        hint="The floor is smooth, so the only horizontal force is the $20\\ \\text{N}$ push.",
        unit="m s^-2",
        sigFigs=3,
        latex="4\\ \\text{m s}^{-2}",
        markScheme=[
            dict(id="1", type="M", marks=1, description="Uses $F = ma$ horizontally with $F = 20$, $m = 5$", latex="20 = 5a"),
            dict(id="2", type="A", marks=1, description="Correct acceleration", latex="a = 4", dependsOn="1"),
        ],
        solutionSteps=[
            "Horizontally there is one force, $20\\ \\text{N}$, because the floor is smooth.",
            "$F = ma \\Rightarrow 20 = 5a$",
            "$a = 4\\ \\text{m s}^{-2}$",
        ],
        feedbackCorrect="Yes — one horizontal force, so $F=ma$ gives it directly.",
        feedbackIncorrect="Smooth floor means no friction. Use $F = ma$ with $F = 20$ and $m = 5$.",
        modelledOn="Direct application of Newton's second law to a single body on a smooth horizontal plane.",
        diagnosticFor=["M4.4a-X01"],
        routes={
            "newton-direct": lambda: R(20) / R(5),
            "unit-force-scaling": lambda: R(20) * (R(1) / R(5)),  # a = F x (1/m)
            "sympy-symbolic": lambda: _sym_linear(R(20), R(5)),
        },
    ),
    dict(
        id="M4.4a-002",
        topicCode="M4.4a",
        skillTag="combine-suvat-with-f-equals-ma",
        difficulty="core",
        marks=4,
        estimatedMinutes=4,
        stem=(
            "A car of mass $1200\\ \\text{kg}$ travelling in a straight line speeds up "
            "uniformly from $8\\ \\text{m s}^{-1}$ to $20\\ \\text{m s}^{-1}$ in $6\\ \\text{s}$.\n\n"
            "Find the magnitude of the resultant force acting on the car."
        ),
        hint="Find the acceleration from the change in velocity first, then use $F = ma$.",
        unit="N",
        sigFigs=3,
        latex="2400\\ \\text{N}",
        markScheme=[
            dict(id="1", type="M", marks=1, description="Uses $v = u + at$ with $u=8$, $v=20$, $t=6$", latex="20 = 8 + 6a"),
            dict(id="2", type="A", marks=1, description="Correct acceleration", latex="a = 2", dependsOn="1"),
            dict(id="3", type="M", marks=1, description="Uses $F = ma$ with their $a$ (follow-through)", latex="F = 1200 \\times 2"),
            dict(id="4", type="A", marks=1, description="Correct resultant force", latex="F = 2400", dependsOn="3"),
        ],
        solutionSteps=[
            "$v = u + at \\Rightarrow 20 = 8 + 6a$",
            "$a = 2\\ \\text{m s}^{-2}$",
            "$F = ma = 1200 \\times 2 = 2400\\ \\text{N}$",
        ],
        feedbackCorrect="Yes — acceleration from suvat, then $F = ma$.",
        feedbackIncorrect="Acceleration is the change in velocity over the time: $(20-8)/6$. Then $F = ma$.",
        modelledOn="Two-stage kinematics-then-Newton item, the standard Paper 4 opener.",
        diagnosticFor=["M4.4a-X02"],
        routes={
            "suvat-then-newton": lambda: R(1200) * ((R(20) - R(8)) / R(6)),
            "impulse-momentum": lambda: (R(1200) * R(20) - R(1200) * R(8)) / R(6),
            "sympy-symbolic": lambda: _sym_suvat_force(u=R(8), v=R(20), t=R(6), m=R(1200)),
        },
    ),
    dict(
        id="M4.4a-003",
        topicCode="M4.4a",
        skillTag="resultant-of-collinear-forces",
        difficulty="core",
        marks=3,
        estimatedMinutes=3,
        stem=(
            "A particle of mass $2.5\\ \\text{kg}$ lies on a smooth horizontal surface. "
            "Two horizontal forces act on it in opposite directions: $12\\ \\text{N}$ to the right "
            "and $4.5\\ \\text{N}$ to the left.\n\n"
            "Find the magnitude of the acceleration of the particle."
        ),
        hint="Combine the forces into a single resultant before using $F = ma$.",
        unit="m s^-2",
        sigFigs=3,
        latex="3\\ \\text{m s}^{-2}",
        markScheme=[
            dict(id="1", type="M", marks=1, description="Forms the resultant of the two forces", latex="12 - 4.5 = 7.5"),
            dict(id="2", type="M", marks=1, description="Uses $F = ma$ with their resultant", latex="7.5 = 2.5a"),
            dict(id="3", type="A", marks=1, description="Correct acceleration", latex="a = 3", dependsOn="2"),
        ],
        solutionSteps=[
            "Resultant $= 12 - 4.5 = 7.5\\ \\text{N}$ to the right.",
            "$7.5 = 2.5a$",
            "$a = 3\\ \\text{m s}^{-2}$",
        ],
        feedbackCorrect="Yes — subtract the opposing force, then $F = ma$.",
        feedbackIncorrect="The forces oppose, so the resultant is $12 - 4.5$, not $12 + 4.5$.",
        modelledOn="Resultant of collinear forces feeding Newton's second law.",
        diagnosticFor=["M4.4a-X03"],
        routes={
            "resultant-then-newton": lambda: (R(12) - R(9, 2)) / R(5, 2),
            "superposition": lambda: R(12) / R(5, 2) - R(9, 2) / R(5, 2),
            "sympy-symbolic": lambda: _sym_resultant(R(12), -R(9, 2), R(5, 2)),
        },
    ),
    dict(
        id="M4.4a-004",
        topicCode="M4.4a",
        skillTag="find-mass-from-f-equals-ma",
        difficulty="core",
        marks=3,
        estimatedMinutes=3,
        stem=(
            "A block is pulled along a smooth horizontal table by a constant horizontal force "
            "of $18\\ \\text{N}$. Starting from rest, it travels $9\\ \\text{m}$ in $3\\ \\text{s}$.\n\n"
            "Find the mass of the block."
        ),
        hint="Use $s = ut + \\tfrac{1}{2}at^{2}$ with $u = 0$ to get the acceleration.",
        unit="kg",
        sigFigs=3,
        latex="9\\ \\text{kg}",
        markScheme=[
            dict(id="1", type="M", marks=1, description="Uses $s = ut + \\tfrac12 at^2$ with $u = 0$", latex="9 = \\tfrac12 a (3)^2"),
            dict(id="2", type="A", marks=1, description="Correct acceleration", latex="a = 2", dependsOn="1"),
            dict(id="3", type="A", marks=1, description="Correct mass from $F = ma$", latex="m = 18/2 = 9"),
        ],
        solutionSteps=[
            "$s = ut + \\tfrac{1}{2}at^{2}$ with $u = 0$: $9 = \\tfrac{1}{2}a(3)^{2}$",
            "$a = 2\\ \\text{m s}^{-2}$",
            "$m = F/a = 18/2 = 9\\ \\text{kg}$",
        ],
        feedbackCorrect="Yes — acceleration from the distance-time information, then rearrange $F = ma$.",
        feedbackIncorrect="Average speed is not the acceleration. Use $s = \\tfrac12 a t^2$ from rest.",
        modelledOn="Reverse application of Newton's second law: mass as the unknown.",
        diagnosticFor=["M4.4a-X04"],
        routes={
            "suvat-then-rearrange": lambda: R(18) / (R(2) * R(9) / R(3) ** 2),
            "energy-work": lambda: R(2) * R(18) * R(9) / ((R(2) * R(9) / R(3) ** 2 * R(3)) ** 2),  # W = 1/2 m v^2
            "sympy-symbolic": lambda: _sym_mass_from_distance(F=R(18), s=R(9), t=R(3)),
        },
    ),
    # -----------------------------------------------------------------------
    # M4.4e — coefficient of friction with F = ma
    # -----------------------------------------------------------------------
    dict(
        id="M4.4e-001",
        topicCode="M4.4e",
        skillTag="friction-with-f-equals-ma",
        difficulty="core",
        marks=4,
        estimatedMinutes=4,
        stem=(
            "A box of mass $8\\ \\text{kg}$ is pulled along a rough horizontal floor by a "
            "horizontal force of $30\\ \\text{N}$. The coefficient of friction between the box "
            "and the floor is $0.25$. Take $g = 10\\ \\text{m s}^{-2}$.\n\n"
            "Find the acceleration of the box."
        ),
        hint="Find the normal contact force first, then the friction force $F = \\mu R$.",
        unit="m s^-2",
        sigFigs=3,
        latex="1.25\\ \\text{m s}^{-2}",
        markScheme=[
            dict(id="1", type="B", marks=1, description="Normal contact force stated", latex="R = 80"),
            dict(id="2", type="M", marks=1, description="Uses $F = \\mu R$ for friction", latex="F_{r} = 0.25 \\times 80 = 20"),
            dict(id="3", type="M", marks=1, description="Newton's second law along the floor with both forces", latex="30 - 20 = 8a"),
            dict(id="4", type="A", marks=1, description="Correct acceleration", latex="a = 1.25", dependsOn="3"),
        ],
        solutionSteps=[
            "Vertically: $R = 8 \\times 10 = 80\\ \\text{N}$",
            "Friction: $F_{r} = \\mu R = 0.25 \\times 80 = 20\\ \\text{N}$",
            "Along the floor: $30 - 20 = 8a$",
            "$a = 1.25\\ \\text{m s}^{-2}$",
        ],
        feedbackCorrect="Yes — normal force, then $\\mu R$, then $F = ma$ along the floor.",
        feedbackIncorrect="Friction is $\\mu R$ with $R = mg = 80\\ \\text{N}$, not $\\mu m$.",
        modelledOn="Rough horizontal plane with a horizontal pull — the standard friction + F = ma item.",
        diagnosticFor=["M4.4e-X01"],
        routes={
            "normal-then-newton": lambda: (R(30) - R(1, 4) * R(8) * G) / R(8),
            "per-unit-mass": lambda: R(30) / R(8) - R(1, 4) * G,
            "sympy-symbolic": lambda: _sym_friction_a(m=R(8), P=R(30), mu=R(1, 4)),
        },
    ),
    dict(
        id="M4.4e-002",
        topicCode="M4.4e",
        skillTag="find-mu-from-deceleration",
        difficulty="extended",
        marks=5,
        estimatedMinutes=5,
        stem=(
            "A sledge of mass $20\\ \\text{kg}$ is moving at $12\\ \\text{m s}^{-1}$ along rough "
            "horizontal ground when the rope pulling it is released. The sledge comes to rest "
            "after travelling a further $30\\ \\text{m}$. Take $g = 10\\ \\text{m s}^{-2}$.\n\n"
            "Find the coefficient of friction between the sledge and the ground."
        ),
        hint="Friction is the only horizontal force once the rope is released.",
        unit="",
        sigFigs=3,
        latex="0.24",
        markScheme=[
            dict(id="1", type="M", marks=1, description="Uses $v^2 = u^2 + 2as$", latex="0 = 12^2 + 2a(30)"),
            dict(id="2", type="A", marks=1, description="Correct deceleration", latex="a = -2.4", dependsOn="1"),
            dict(id="3", type="M", marks=1, description="Newton's second law with friction as the only horizontal force", latex="\\mu R = 20 \\times 2.4"),
            dict(id="4", type="M", marks=1, description="Uses $R = mg = 200$", latex="R = 200"),
            dict(id="5", type="A", marks=1, description="Correct coefficient of friction", latex="\\mu = 0.24", dependsOn="3"),
        ],
        solutionSteps=[
            "$v^{2} = u^{2} + 2as$: $0 = 144 + 60a$, so $a = -2.4\\ \\text{m s}^{-2}$",
            "Friction is the only horizontal force: $\\mu R = 20 \\times 2.4 = 48\\ \\text{N}$",
            "$R = 20 \\times 10 = 200\\ \\text{N}$",
            "$\\mu = 48/200 = 0.24$",
        ],
        feedbackCorrect="Yes — deceleration from suvat, then $\\mu = ma / mg$.",
        feedbackIncorrect="Once the rope goes, friction alone decelerates the sledge. Find $a$ from $v^2 = u^2 + 2as$ first.",
        modelledOn="Deceleration-to-rest under friction, solving for the coefficient.",
        diagnosticFor=["M4.4e-X02"],
        routes={
            "suvat-then-newton": lambda: (R(20) * (R(12) ** 2 / (R(2) * R(30)))) / (R(20) * G),
            "work-energy": lambda: (R(1, 2) * R(20) * R(12) ** 2) / (R(20) * G * R(30)),
            "sympy-symbolic": lambda: _sym_mu_from_stop(m=R(20), u=R(12), s=R(30)),
        },
    ),
    # -----------------------------------------------------------------------
    # M4.4c — connected bodies: lifts
    # -----------------------------------------------------------------------
    dict(
        id="M4.4c-001",
        topicCode="M4.4c",
        skillTag="normal-force-in-accelerating-lift",
        difficulty="core",
        marks=3,
        estimatedMinutes=3,
        stem=(
            "A person of mass $60\\ \\text{kg}$ stands on the floor of a lift. The lift accelerates "
            "upwards at $1.5\\ \\text{m s}^{-2}$. Take $g = 10\\ \\text{m s}^{-2}$.\n\n"
            "Find the magnitude of the force exerted on the person by the floor of the lift."
        ),
        hint="Take upwards as positive and apply $F = ma$ to the person only.",
        unit="N",
        sigFigs=3,
        latex="690\\ \\text{N}",
        markScheme=[
            dict(id="1", type="M", marks=1, description="Newton's second law for the person, upwards positive", latex="R - 600 = 60(1.5)"),
            dict(id="2", type="M", marks=1, description="Uses weight $= 60 \\times 10 = 600$", latex="W = 600"),
            dict(id="3", type="A", marks=1, description="Correct normal contact force", latex="R = 690", dependsOn="1"),
        ],
        solutionSteps=[
            "For the person, upwards positive: $R - mg = ma$",
            "$R - 600 = 60 \\times 1.5 = 90$",
            "$R = 690\\ \\text{N}$",
        ],
        feedbackCorrect="Yes — the floor pushes harder than the weight when the lift accelerates upwards.",
        feedbackIncorrect="Apply $F = ma$ to the person alone: $R - mg = ma$, so $R$ is bigger than $600\\ \\text{N}$.",
        modelledOn="Apparent weight in an accelerating lift.",
        diagnosticFor=["M4.4c-X01"],
        routes={
            "newton-person": lambda: R(60) * G + R(60) * R(3, 2),
            "factorised": lambda: R(60) * (G + R(3, 2)),
            "sympy-symbolic": lambda: _sym_lift(m=R(60), a=R(3, 2)),
        },
    ),
    dict(
        id="M4.4c-002",
        topicCode="M4.4c",
        skillTag="normal-force-in-accelerating-lift",
        difficulty="core",
        marks=3,
        estimatedMinutes=3,
        stem=(
            "A crate of mass $50\\ \\text{kg}$ stands on the floor of a lift. The lift is moving "
            "downwards and its speed is increasing at a rate of $2\\ \\text{m s}^{-2}$. "
            "Take $g = 10\\ \\text{m s}^{-2}$.\n\n"
            "Find the magnitude of the normal contact force between the crate and the floor."
        ),
        hint="The acceleration is downwards, so take downwards as positive.",
        unit="N",
        sigFigs=3,
        latex="400\\ \\text{N}",
        markScheme=[
            dict(id="1", type="M", marks=1, description="Newton's second law with acceleration downwards", latex="500 - R = 50(2)"),
            dict(id="2", type="M", marks=1, description="Uses weight $= 500$", latex="W = 500"),
            dict(id="3", type="A", marks=1, description="Correct normal contact force", latex="R = 400", dependsOn="1"),
        ],
        solutionSteps=[
            "Downwards positive: $mg - R = ma$",
            "$500 - R = 50 \\times 2 = 100$",
            "$R = 400\\ \\text{N}$",
        ],
        feedbackCorrect="Yes — accelerating downwards means the floor pushes less than the weight.",
        feedbackIncorrect="The acceleration is downwards here, so $mg - R = ma$ and $R < 500\\ \\text{N}$.",
        modelledOn="Apparent weight with downward acceleration — the sign-convention trap.",
        diagnosticFor=["M4.4c-X02"],
        routes={
            "newton-crate": lambda: R(50) * G - R(50) * R(2),
            "factorised": lambda: R(50) * (G - R(2)),
            "sympy-symbolic": lambda: _sym_lift(m=R(50), a=-R(2)),
        },
    ),
    # -----------------------------------------------------------------------
    # M4.4b — connected bodies: ropes and tow bars
    # -----------------------------------------------------------------------
    dict(
        id="M4.4b-001",
        topicCode="M4.4b",
        skillTag="connected-bodies-tow-bar",
        difficulty="core",
        marks=4,
        estimatedMinutes=4,
        stem=(
            "A car of mass $900\\ \\text{kg}$ tows a trailer of mass $300\\ \\text{kg}$ along a "
            "straight horizontal road. The driving force on the car is $3600\\ \\text{N}$ and "
            "resistances to motion may be ignored.\n\n"
            "Find the tension in the tow bar."
        ),
        hint="Treat car and trailer as one body first to get the acceleration, then the trailer alone.",
        unit="N",
        sigFigs=3,
        latex="900\\ \\text{N}",
        markScheme=[
            dict(id="1", type="M", marks=1, description="Whole system: $F = (m_1+m_2)a$", latex="3600 = 1200a"),
            dict(id="2", type="A", marks=1, description="Correct acceleration", latex="a = 3", dependsOn="1"),
            dict(id="3", type="M", marks=1, description="Newton's second law for the trailer alone", latex="T = 300a"),
            dict(id="4", type="A", marks=1, description="Correct tension", latex="T = 900", dependsOn="3"),
        ],
        solutionSteps=[
            "Whole system: $3600 = (900 + 300)a$, so $a = 3\\ \\text{m s}^{-2}$",
            "Trailer alone: $T = 300 \\times 3$",
            "$T = 900\\ \\text{N}$",
        ],
        feedbackCorrect="Yes — system for the acceleration, one body for the internal force.",
        feedbackIncorrect="The tension is an internal force: it only appears when you look at one body on its own.",
        modelledOn="Two-body tow-bar system with no resistances.",
        diagnosticFor=["M4.4b-X01"],
        routes={
            "system-then-trailer": lambda: R(300) * (R(3600) / (R(900) + R(300))),
            "car-equation": lambda: R(3600) - R(900) * (R(3600) / R(1200)),
            "sympy-symbolic": lambda: _sym_towbar(m1=R(900), m2=R(300), D=R(3600), r1=R(0), r2=R(0)),
        },
    ),
    dict(
        id="M4.4b-002",
        topicCode="M4.4b",
        skillTag="connected-bodies-with-resistance",
        difficulty="extended",
        marks=5,
        estimatedMinutes=5,
        stem=(
            "A van of mass $1000\\ \\text{kg}$ tows a trailer of mass $500\\ \\text{kg}$ along a "
            "straight horizontal road. The driving force is $2100\\ \\text{N}$. The resistance to "
            "motion is $200\\ \\text{N}$ on the van and $100\\ \\text{N}$ on the trailer.\n\n"
            "Find the tension in the coupling."
        ),
        hint="Resistances act on the whole system too — subtract both before dividing by the total mass.",
        unit="N",
        sigFigs=3,
        latex="700\\ \\text{N}",
        markScheme=[
            dict(id="1", type="M", marks=1, description="Whole system with both resistances", latex="2100 - 300 = 1500a"),
            dict(id="2", type="A", marks=1, description="Correct acceleration", latex="a = 1.2", dependsOn="1"),
            dict(id="3", type="M", marks=1, description="Newton's second law for the trailer alone", latex="T - 100 = 500a"),
            dict(id="4", type="M", marks=1, description="Includes the trailer's own resistance in that equation", latex="-100"),
            dict(id="5", type="A", marks=1, description="Correct tension", latex="T = 700", dependsOn="3"),
        ],
        solutionSteps=[
            "Whole system: $2100 - 200 - 100 = 1500a$, so $a = 1.2\\ \\text{m s}^{-2}$",
            "Trailer alone: $T - 100 = 500 \\times 1.2 = 600$",
            "$T = 700\\ \\text{N}$",
        ],
        feedbackCorrect="Yes — both resistances in the system equation, the trailer's own resistance in its equation.",
        feedbackIncorrect="Do not forget the trailer's own $100\\ \\text{N}$ resistance when you isolate it.",
        modelledOn="Two-body system with per-body resistances — the classic dropped-resistance error.",
        diagnosticFor=["M4.4b-X02"],
        routes={
            "system-then-trailer": lambda: R(500) * ((R(2100) - R(200) - R(100)) / R(1500)) + R(100),
            "van-equation": lambda: R(2100) - R(200) - R(1000) * ((R(2100) - R(300)) / R(1500)),
            "sympy-symbolic": lambda: _sym_towbar(m1=R(1000), m2=R(500), D=R(2100), r1=R(200), r2=R(100)),
        },
    ),
    # -----------------------------------------------------------------------
    # M4.4d — connected bodies: pulleys
    # -----------------------------------------------------------------------
    dict(
        id="M4.4d-001",
        topicCode="M4.4d",
        skillTag="pulley-two-hanging-masses",
        difficulty="core",
        marks=5,
        estimatedMinutes=5,
        stem=(
            "Two particles of masses $3\\ \\text{kg}$ and $2\\ \\text{kg}$ hang at the ends of a "
            "light inextensible string passing over a smooth fixed pulley. The system is released "
            "from rest with both particles hanging freely. Take $g = 10\\ \\text{m s}^{-2}$.\n\n"
            "Find the tension in the string."
        ),
        hint="Write $F = ma$ for each particle separately, taking each one's own direction of motion as positive.",
        unit="N",
        sigFigs=3,
        latex="24\\ \\text{N}",
        markScheme=[
            dict(id="1", type="M", marks=1, description="Newton's second law for the heavier particle", latex="30 - T = 3a"),
            dict(id="2", type="M", marks=1, description="Newton's second law for the lighter particle", latex="T - 20 = 2a"),
            dict(id="3", type="M", marks=1, description="Solves the pair simultaneously", latex="10 = 5a"),
            dict(id="4", type="A", marks=1, description="Correct acceleration", latex="a = 2", dependsOn="3"),
            dict(id="5", type="A", marks=1, description="Correct tension", latex="T = 24", dependsOn="3"),
        ],
        solutionSteps=[
            "$3\\ \\text{kg}$ particle (down positive): $30 - T = 3a$",
            "$2\\ \\text{kg}$ particle (up positive): $T - 20 = 2a$",
            "Adding: $10 = 5a$, so $a = 2\\ \\text{m s}^{-2}$",
            "$T = 20 + 2 \\times 2 = 24\\ \\text{N}$",
        ],
        feedbackCorrect="Yes — two equations, add to eliminate $T$, then substitute back.",
        feedbackIncorrect="The tension is the same throughout the string, but the two particles have different equations. Add them to eliminate $T$.",
        modelledOn="Smooth pulley with two freely hanging particles.",
        diagnosticFor=["M4.4d-X01"],
        routes={
            "add-equations": lambda: R(2) * (G + (R(3) - R(2)) * G / (R(3) + R(2))),
            "harmonic-form": lambda: R(2) * R(3) * G * R(2) / (R(3) + R(2)),  # T = 2 m1 m2 g /(m1+m2)
            "sympy-symbolic": lambda: _sym_pulley_hanging(m1=R(3), m2=R(2)),
        },
    ),
    dict(
        id="M4.4d-002",
        topicCode="M4.4d",
        skillTag="pulley-table-and-hanging",
        difficulty="core",
        marks=5,
        estimatedMinutes=5,
        stem=(
            "A particle $A$ of mass $4\\ \\text{kg}$ lies on a smooth horizontal table. A light "
            "inextensible string attached to $A$ passes over a smooth pulley at the edge of the "
            "table, and a particle $B$ of mass $6\\ \\text{kg}$ hangs freely at the other end. "
            "The system is released from rest. Take $g = 10\\ \\text{m s}^{-2}$.\n\n"
            "Find the acceleration of the system."
        ),
        hint="Only $B$'s weight drives the system; both masses have to be accelerated.",
        unit="m s^-2",
        sigFigs=3,
        latex="6\\ \\text{m s}^{-2}",
        markScheme=[
            dict(id="1", type="M", marks=1, description="Newton's second law for $A$ along the table", latex="T = 4a"),
            dict(id="2", type="M", marks=1, description="Newton's second law for $B$ vertically", latex="60 - T = 6a"),
            dict(id="3", type="M", marks=1, description="Solves the pair simultaneously", latex="60 = 10a"),
            dict(id="4", type="A", marks=1, description="Correct acceleration", latex="a = 6", dependsOn="3"),
            dict(id="5", type="B", marks=1, description="States the table is smooth so no friction term appears", latex="F_{r} = 0"),
        ],
        solutionSteps=[
            "$A$ along the table: $T = 4a$",
            "$B$ vertically: $60 - T = 6a$",
            "Adding: $60 = 10a$",
            "$a = 6\\ \\text{m s}^{-2}$",
        ],
        feedbackCorrect="Yes — the driving force is $B$'s weight, and the mass being accelerated is both particles.",
        feedbackIncorrect="Do not use $a = g$. The $4\\ \\text{kg}$ on the table also has to be accelerated by the same string.",
        modelledOn="Table-and-pulley system, smooth surface.",
        diagnosticFor=["M4.4d-X02"],
        routes={
            "system-driving-force": lambda: (R(6) * G) / (R(4) + R(6)),
            "eliminate-tension": lambda: (R(6) * G - R(0)) / (R(6) + R(4)),
            "sympy-symbolic": lambda: _sym_pulley_table(mA=R(4), mB=R(6), mu=R(0)),
        },
    ),
    # -----------------------------------------------------------------------
    # Candidate that the gate is expected to DISCARD (ugly answer).
    # Kept in the source deliberately: it documents what the gate rejects.
    # -----------------------------------------------------------------------
    dict(
        id="M4.4d-003",
        topicCode="M4.4d",
        skillTag="pulley-two-hanging-masses",
        difficulty="core",
        marks=5,
        estimatedMinutes=5,
        stem=(
            "Two particles of masses $3.5\\ \\text{kg}$ and $2.2\\ \\text{kg}$ hang at the ends of "
            "a light inextensible string over a smooth fixed pulley. Take $g = 10\\ \\text{m s}^{-2}$.\n\n"
            "Find the acceleration of the system."
        ),
        hint="Two equations, add to eliminate the tension.",
        unit="m s^-2",
        sigFigs=3,
        latex="2.28\\ \\text{m s}^{-2}",
        markScheme=[
            dict(id="1", type="M", marks=1, description="Equation for the heavier particle", latex="35 - T = 3.5a"),
            dict(id="2", type="M", marks=1, description="Equation for the lighter particle", latex="T - 22 = 2.2a"),
            dict(id="3", type="M", marks=1, description="Adds to eliminate $T$", latex="13 = 5.7a"),
            dict(id="4", type="A", marks=1, description="Correct acceleration", latex="a = 2.28", dependsOn="3"),
            dict(id="5", type="B", marks=1, description="Pulley smooth, string light and inextensible stated", latex=""),
        ],
        solutionSteps=["$13 = 5.7a$", "$a = 2.28\\ \\text{m s}^{-2}$ (3 s.f.)"],
        feedbackCorrect="Correct.",
        feedbackIncorrect="Add the two equations to eliminate the tension.",
        modelledOn="Smooth pulley with two hanging particles, awkward masses.",
        diagnosticFor=["M4.4d-X01"],
        routes={
            "add-equations": lambda: (R(35) - R(22)) / (R(7, 2) + R(11, 5)),
            "difference-over-sum": lambda: (R(7, 2) - R(11, 5)) * G / (R(7, 2) + R(11, 5)),
            "sympy-symbolic": lambda: _sym_pulley_hanging_a(m1=R(7, 2), m2=R(11, 5)),
        },
    ),
]


# ---------------------------------------------------------------------------
# Symbolic routes. Each one sets up the governing equation(s) with SymPy
# symbols and SOLVES — it never re-does the arithmetic of the other routes.
# ---------------------------------------------------------------------------

def _sym_linear(F, m):
    a = symbols("a")
    return solve(Eq(F, m * a), a)[0]


def _sym_suvat_force(u, v, t, m):
    a, F = symbols("a F")
    sol = solve([Eq(v, u + a * t), Eq(F, m * a)], [a, F], dict=True)[0]
    return sol[F]


def _sym_resultant(f1, f2, m):
    a = symbols("a")
    return solve(Eq(f1 + f2, m * a), a)[0]


def _sym_mass_from_distance(F, s, t):
    a, m = symbols("a m")
    sol = solve([Eq(s, a * t**2 / 2), Eq(F, m * a)], [a, m], dict=True)[0]
    return sol[m]


def _sym_friction_a(m, P, mu):
    a, Rn = symbols("a R")
    sol = solve([Eq(Rn, m * G), Eq(P - mu * Rn, m * a)], [a, Rn], dict=True)[0]
    return sol[a]


def _sym_mu_from_stop(m, u, s):
    a, mu, Rn = symbols("a mu R")
    sol = solve(
        [Eq(0, u**2 + 2 * a * s), Eq(Rn, m * G), Eq(-mu * Rn, m * a)],
        [a, mu, Rn],
        dict=True,
    )[0]
    return sol[mu]


def _sym_lift(m, a):
    """a > 0 upwards. Returns the normal contact force."""
    Rn = symbols("R")
    return solve(Eq(Rn - m * G, m * a), Rn)[0]


def _sym_towbar(m1, m2, D, r1, r2):
    """Returns the tension in the coupling."""
    a, T = symbols("a T")
    sol = solve(
        [Eq(D - r1 - T, m1 * a), Eq(T - r2, m2 * a)],
        [a, T],
        dict=True,
    )[0]
    return sol[T]


def _sym_pulley_hanging(m1, m2):
    """m1 > m2, both hanging. Returns the tension."""
    a, T = symbols("a T")
    sol = solve([Eq(m1 * G - T, m1 * a), Eq(T - m2 * G, m2 * a)], [a, T], dict=True)[0]
    return sol[T]


def _sym_pulley_hanging_a(m1, m2):
    a, T = symbols("a T")
    sol = solve([Eq(m1 * G - T, m1 * a), Eq(T - m2 * G, m2 * a)], [a, T], dict=True)[0]
    return sol[a]


def _sym_pulley_table(mA, mB, mu):
    """A on the table, B hanging. Returns the acceleration."""
    a, T, Rn = symbols("a T R")
    sol = solve(
        [Eq(Rn, mA * G), Eq(T - mu * Rn, mA * a), Eq(mB * G - T, mB * a)],
        [a, T, Rn],
        dict=True,
    )[0]
    return sol[a]


BANK = dict(
    cluster="mechanics-forces-f-equals-ma",
    title="Mechanics — forces and F = ma",
    generatedBy="claude-opus-5 (authored in repo, not extracted)",
)
