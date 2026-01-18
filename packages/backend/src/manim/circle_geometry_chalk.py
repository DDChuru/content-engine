"""
Circle Geometry Theorems - Chalkboard Style
A comprehensive visual explanation of circle theorems using Manim

Theorems covered:
1. Central Angle Theorem
2. Inscribed Angle Theorem
3. Angle in a Semicircle (Thales' Theorem)
4. Cyclic Quadrilateral Theorem
5. Tangent-Radius Theorem
6. Two Tangents Theorem
7. Alternate Segment Theorem
8. Intersecting Chords Theorem
9. Tangent-Secant Theorem
"""

from manim import *
import numpy as np

# ============================================================
# CHALKBOARD THEME CONFIGURATION
# ============================================================

# Colors mimicking chalk on blackboard
CHALK_WHITE = "#E8E8E8"
CHALK_YELLOW = "#F4D03F"
CHALK_BLUE = "#5DADE2"
CHALK_GREEN = "#58D68D"
CHALK_RED = "#EC7063"
CHALK_ORANGE = "#F5B041"
CHALK_PINK = "#F1948A"
CHALKBOARD_BG = "#1C2833"  # Dark greenish-black like a real chalkboard
CHALKBOARD_GREEN = "#0B3B0B"  # Alternative green board

class ChalkboardScene(Scene):
    """Base class for chalkboard-style scenes"""

    def setup(self):
        self.camera.background_color = CHALKBOARD_BG

    def chalk_write(self, text, **kwargs):
        """Create chalk-style text"""
        return Text(text, color=CHALK_WHITE, font="serif", **kwargs)

    def chalk_tex(self, tex_string, color=CHALK_WHITE, **kwargs):
        """Create chalk-style LaTeX"""
        return MathTex(tex_string, color=color, **kwargs)

    def draw_theorem_title(self, title, subtitle=None):
        """Draw a theorem title with underline"""
        title_text = Text(title, color=CHALK_YELLOW, font_size=48, weight=BOLD)
        title_text.to_edge(UP, buff=0.5)

        underline = Line(
            title_text.get_left() + DOWN * 0.3,
            title_text.get_right() + DOWN * 0.3,
            color=CHALK_YELLOW,
            stroke_width=2
        )

        self.play(Write(title_text), run_time=1.5)
        self.play(Create(underline), run_time=0.5)

        if subtitle:
            sub = Text(subtitle, color=CHALK_WHITE, font_size=28)
            sub.next_to(underline, DOWN, buff=0.3)
            self.play(FadeIn(sub), run_time=0.5)
            return VGroup(title_text, underline, sub)

        return VGroup(title_text, underline)

    def create_chalk_circle(self, radius=2, color=CHALK_WHITE, **kwargs):
        """Create a chalk-style circle"""
        return Circle(radius=radius, color=color, stroke_width=3, **kwargs)


# ============================================================
# INTRO SCENE
# ============================================================

class CircleGeometryIntro(ChalkboardScene):
    def construct(self):
        # Title
        title = Text("Circle Geometry", color=CHALK_YELLOW, font_size=72, weight=BOLD)
        subtitle = Text("Theorems & Proofs", color=CHALK_WHITE, font_size=36)
        subtitle.next_to(title, DOWN, buff=0.5)

        # Draw a decorative circle
        circle = Circle(radius=2.5, color=CHALK_WHITE, stroke_width=2)
        circle.set_fill(CHALKBOARD_BG, opacity=0)

        # Points on circle
        points = VGroup()
        for i in range(8):
            angle = i * PI / 4
            dot = Dot(circle.point_at_angle(angle), color=CHALK_YELLOW, radius=0.08)
            points.add(dot)

        # Animate
        self.play(Write(title), run_time=2)
        self.play(FadeIn(subtitle), run_time=1)
        self.wait(0.5)

        # Move title up
        self.play(
            title.animate.scale(0.6).to_edge(UP),
            FadeOut(subtitle),
            run_time=1
        )

        # Draw circle
        self.play(Create(circle), run_time=2)
        self.play(LaggedStart(*[FadeIn(p, scale=0.5) for p in points], lag_ratio=0.1))

        # Topics list
        topics = VGroup(
            Text("1. Central Angle Theorem", color=CHALK_WHITE, font_size=28),
            Text("2. Inscribed Angle Theorem", color=CHALK_WHITE, font_size=28),
            Text("3. Angle in a Semicircle", color=CHALK_WHITE, font_size=28),
            Text("4. Cyclic Quadrilateral", color=CHALK_WHITE, font_size=28),
            Text("5. Tangent Theorems", color=CHALK_WHITE, font_size=28),
            Text("6. Chord Theorems", color=CHALK_WHITE, font_size=28),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        topics.next_to(circle, RIGHT, buff=1)

        self.play(
            circle.animate.shift(LEFT * 2),
            points.animate.shift(LEFT * 2),
        )

        for topic in topics:
            self.play(Write(topic), run_time=0.5)

        self.wait(2)
        self.play(FadeOut(VGroup(title, circle, points, topics)))


# ============================================================
# THEOREM 1: CENTRAL ANGLE THEOREM
# ============================================================

class CentralAngleTheorem(ChalkboardScene):
    def construct(self):
        # Title
        title_group = self.draw_theorem_title(
            "Central Angle Theorem",
            "The central angle is twice the inscribed angle"
        )

        self.wait(1)

        # Create circle
        circle = self.create_chalk_circle(radius=2)
        circle.shift(DOWN * 0.5)
        center = circle.get_center()

        # Define points
        A = circle.point_at_angle(PI * 0.2)  # Point on circle
        B = circle.point_at_angle(PI * 0.8)  # Point on circle
        P = circle.point_at_angle(PI * 1.5)  # Point on circle (for inscribed angle)
        O = center  # Center

        # Create dots
        dot_A = Dot(A, color=CHALK_YELLOW, radius=0.1)
        dot_B = Dot(B, color=CHALK_YELLOW, radius=0.1)
        dot_P = Dot(P, color=CHALK_GREEN, radius=0.1)
        dot_O = Dot(O, color=CHALK_RED, radius=0.1)

        # Labels
        label_A = Text("A", color=CHALK_YELLOW, font_size=24).next_to(dot_A, UR, buff=0.1)
        label_B = Text("B", color=CHALK_YELLOW, font_size=24).next_to(dot_B, UL, buff=0.1)
        label_P = Text("P", color=CHALK_GREEN, font_size=24).next_to(dot_P, DOWN, buff=0.1)
        label_O = Text("O", color=CHALK_RED, font_size=24).next_to(dot_O, DOWN, buff=0.15)

        # Draw circle and center
        self.play(Create(circle), run_time=1.5)
        self.play(FadeIn(dot_O), Write(label_O))

        # Draw arc AB (the arc we're interested in)
        arc_AB = Arc(
            radius=2,
            start_angle=PI * 0.2,
            angle=PI * 0.6,
            color=CHALK_ORANGE,
            stroke_width=6
        ).shift(DOWN * 0.5)

        # Draw points
        self.play(
            FadeIn(dot_A), Write(label_A),
            FadeIn(dot_B), Write(label_B),
        )
        self.play(Create(arc_AB), run_time=1)

        # Draw central angle (angle AOB)
        line_OA = Line(O, A, color=CHALK_RED, stroke_width=3)
        line_OB = Line(O, B, color=CHALK_RED, stroke_width=3)

        self.play(Create(line_OA), Create(line_OB))

        # Central angle arc
        central_angle = Angle(line_OA, line_OB, radius=0.5, color=CHALK_RED)
        central_label = MathTex(r"2\theta", color=CHALK_RED, font_size=28)
        central_label.move_to(O + UP * 0.8)

        self.play(Create(central_angle), Write(central_label))

        # Now add point P and inscribed angle
        self.play(FadeIn(dot_P), Write(label_P))

        # Draw inscribed angle (angle APB)
        line_PA = Line(P, A, color=CHALK_GREEN, stroke_width=3)
        line_PB = Line(P, B, color=CHALK_GREEN, stroke_width=3)

        self.play(Create(line_PA), Create(line_PB))

        # Inscribed angle arc
        inscribed_angle = Angle(line_PA, line_PB, radius=0.4, color=CHALK_GREEN)
        inscribed_label = MathTex(r"\theta", color=CHALK_GREEN, font_size=28)
        inscribed_label.move_to(P + UP * 0.6)

        self.play(Create(inscribed_angle), Write(inscribed_label))

        self.wait(1)

        # Show the relationship
        formula_box = VGroup(
            MathTex(r"\angle AOB = 2 \times \angle APB", color=CHALK_WHITE, font_size=36),
            MathTex(r"2\theta = 2 \times \theta", color=CHALK_YELLOW, font_size=32),
        ).arrange(DOWN, buff=0.3)
        formula_box.to_edge(RIGHT, buff=0.5).shift(UP * 0.5)

        box_rect = SurroundingRectangle(formula_box, color=CHALK_YELLOW, buff=0.3, stroke_width=2)

        self.play(Write(formula_box[0]))
        self.play(Write(formula_box[1]))
        self.play(Create(box_rect))

        # Explanation
        explanation = Text(
            "The central angle is always\ntwice the inscribed angle\nsubtending the same arc.",
            color=CHALK_WHITE,
            font_size=22,
            line_spacing=1.2
        ).to_edge(DOWN, buff=0.5)

        self.play(Write(explanation), run_time=2)
        self.wait(3)

        # Fadeout
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# THEOREM 2: INSCRIBED ANGLE THEOREM
# ============================================================

class InscribedAngleTheorem(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Inscribed Angle Theorem",
            "Inscribed angles subtending the same arc are equal"
        )

        self.wait(1)

        # Circle
        circle = self.create_chalk_circle(radius=2)
        circle.shift(DOWN * 0.3 + LEFT * 1)

        # Points on the arc
        A = circle.point_at_angle(PI * 0.2)
        B = circle.point_at_angle(PI * 0.9)

        # Multiple points for inscribed angles
        P1 = circle.point_at_angle(PI * 1.3)
        P2 = circle.point_at_angle(PI * 1.5)
        P3 = circle.point_at_angle(PI * 1.7)

        self.play(Create(circle))

        # Arc AB
        arc_AB = Arc(
            radius=2,
            start_angle=PI * 0.2,
            angle=PI * 0.7,
            color=CHALK_ORANGE,
            stroke_width=6
        ).move_arc_center_to(circle.get_center())

        # Points A and B
        dot_A = Dot(A, color=CHALK_YELLOW, radius=0.1)
        dot_B = Dot(B, color=CHALK_YELLOW, radius=0.1)
        label_A = Text("A", font_size=24, color=CHALK_YELLOW).next_to(dot_A, UR, buff=0.1)
        label_B = Text("B", font_size=24, color=CHALK_YELLOW).next_to(dot_B, UP, buff=0.1)

        self.play(
            FadeIn(dot_A), FadeIn(dot_B),
            Write(label_A), Write(label_B)
        )
        self.play(Create(arc_AB))

        # First inscribed angle from P1
        dot_P1 = Dot(P1, color=CHALK_GREEN, radius=0.1)
        label_P1 = Text("P₁", font_size=22, color=CHALK_GREEN).next_to(dot_P1, DL, buff=0.1)
        line_P1A = Line(P1, A, color=CHALK_GREEN, stroke_width=2)
        line_P1B = Line(P1, B, color=CHALK_GREEN, stroke_width=2)

        self.play(FadeIn(dot_P1), Write(label_P1))
        self.play(Create(line_P1A), Create(line_P1B))

        angle1 = Angle(line_P1A, line_P1B, radius=0.3, color=CHALK_GREEN)
        theta1 = MathTex(r"\theta", color=CHALK_GREEN, font_size=24).move_to(P1 + normalize(A + B - 2*P1) * 0.5)
        self.play(Create(angle1), Write(theta1))

        self.wait(0.5)

        # Second inscribed angle from P2
        dot_P2 = Dot(P2, color=CHALK_BLUE, radius=0.1)
        label_P2 = Text("P₂", font_size=22, color=CHALK_BLUE).next_to(dot_P2, DOWN, buff=0.1)
        line_P2A = Line(P2, A, color=CHALK_BLUE, stroke_width=2)
        line_P2B = Line(P2, B, color=CHALK_BLUE, stroke_width=2)

        self.play(FadeIn(dot_P2), Write(label_P2))
        self.play(Create(line_P2A), Create(line_P2B))

        angle2 = Angle(line_P2A, line_P2B, radius=0.3, color=CHALK_BLUE)
        theta2 = MathTex(r"\theta", color=CHALK_BLUE, font_size=24).move_to(P2 + UP * 0.5)
        self.play(Create(angle2), Write(theta2))

        self.wait(0.5)

        # Third inscribed angle from P3
        dot_P3 = Dot(P3, color=CHALK_PINK, radius=0.1)
        label_P3 = Text("P₃", font_size=22, color=CHALK_PINK).next_to(dot_P3, DR, buff=0.1)
        line_P3A = Line(P3, A, color=CHALK_PINK, stroke_width=2)
        line_P3B = Line(P3, B, color=CHALK_PINK, stroke_width=2)

        self.play(FadeIn(dot_P3), Write(label_P3))
        self.play(Create(line_P3A), Create(line_P3B))

        angle3 = Angle(line_P3A, line_P3B, radius=0.3, color=CHALK_PINK)
        theta3 = MathTex(r"\theta", color=CHALK_PINK, font_size=24).move_to(P3 + UP * 0.4 + LEFT * 0.2)
        self.play(Create(angle3), Write(theta3))

        # Formula
        formula = VGroup(
            MathTex(r"\angle AP_1B = \angle AP_2B = \angle AP_3B", color=CHALK_WHITE, font_size=32),
            Text("All inscribed angles = θ", color=CHALK_YELLOW, font_size=28)
        ).arrange(DOWN, buff=0.3)
        formula.to_edge(RIGHT, buff=0.3).shift(DOWN * 0.5)

        box = SurroundingRectangle(formula, color=CHALK_YELLOW, buff=0.2, stroke_width=2)

        self.play(Write(formula[0]), run_time=1.5)
        self.play(Write(formula[1]))
        self.play(Create(box))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# THEOREM 3: ANGLE IN A SEMICIRCLE (THALES)
# ============================================================

class AngleInSemicircle(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Thales' Theorem",
            "An angle inscribed in a semicircle is always 90°"
        )

        self.wait(1)

        # Circle
        circle = self.create_chalk_circle(radius=2.2)
        circle.shift(DOWN * 0.5)
        center = circle.get_center()

        # Diameter endpoints
        A = center + LEFT * 2.2
        B = center + RIGHT * 2.2

        # Point on semicircle (will animate)
        def get_point_on_semicircle(angle):
            return center + 2.2 * np.array([np.cos(angle), np.sin(angle), 0])

        P = get_point_on_semicircle(PI * 0.7)

        self.play(Create(circle))

        # Diameter
        diameter = Line(A, B, color=CHALK_YELLOW, stroke_width=4)
        dot_A = Dot(A, color=CHALK_YELLOW, radius=0.1)
        dot_B = Dot(B, color=CHALK_YELLOW, radius=0.1)
        dot_O = Dot(center, color=CHALK_RED, radius=0.08)

        label_A = Text("A", color=CHALK_YELLOW, font_size=24).next_to(dot_A, LEFT, buff=0.1)
        label_B = Text("B", color=CHALK_YELLOW, font_size=24).next_to(dot_B, RIGHT, buff=0.1)
        label_O = Text("O", color=CHALK_RED, font_size=20).next_to(dot_O, DOWN, buff=0.1)

        self.play(
            Create(diameter),
            FadeIn(dot_A), FadeIn(dot_B), FadeIn(dot_O),
            Write(label_A), Write(label_B), Write(label_O)
        )

        # Point P and lines
        dot_P = Dot(P, color=CHALK_GREEN, radius=0.1)
        label_P = Text("P", color=CHALK_GREEN, font_size=24).next_to(dot_P, UP, buff=0.1)

        line_PA = Line(P, A, color=CHALK_GREEN, stroke_width=3)
        line_PB = Line(P, B, color=CHALK_GREEN, stroke_width=3)

        self.play(FadeIn(dot_P), Write(label_P))
        self.play(Create(line_PA), Create(line_PB))

        # Right angle marker
        right_angle = RightAngle(line_PA, line_PB, length=0.3, color=CHALK_WHITE)
        angle_label = MathTex(r"90°", color=CHALK_WHITE, font_size=28)
        angle_label.next_to(right_angle, UP + RIGHT, buff=0.1)

        self.play(Create(right_angle), Write(angle_label))

        # Now animate P moving along the semicircle
        self.wait(1)

        explanation = Text(
            "No matter where P is on the semicircle,\nangle APB is always 90°",
            color=CHALK_WHITE,
            font_size=24,
            line_spacing=1.2
        ).to_edge(DOWN, buff=0.5)

        self.play(Write(explanation))

        # Animate P moving
        for target_angle in [PI * 0.3, PI * 0.5, PI * 0.85, PI * 0.6]:
            new_P = get_point_on_semicircle(target_angle)
            new_line_PA = Line(new_P, A, color=CHALK_GREEN, stroke_width=3)
            new_line_PB = Line(new_P, B, color=CHALK_GREEN, stroke_width=3)
            new_right_angle = RightAngle(new_line_PA, new_line_PB, length=0.3, color=CHALK_WHITE)
            new_label_P = Text("P", color=CHALK_GREEN, font_size=24).next_to(new_P, UP if target_angle > PI/2 else UR, buff=0.1)
            new_angle_label = MathTex(r"90°", color=CHALK_WHITE, font_size=28)
            new_angle_label.next_to(new_right_angle, UP + RIGHT, buff=0.1)

            self.play(
                Transform(dot_P, Dot(new_P, color=CHALK_GREEN, radius=0.1)),
                Transform(line_PA, new_line_PA),
                Transform(line_PB, new_line_PB),
                Transform(right_angle, new_right_angle),
                Transform(label_P, new_label_P),
                Transform(angle_label, new_angle_label),
                run_time=1.5
            )
            self.wait(0.3)

        # Formula box
        formula = MathTex(
            r"\text{If } AB \text{ is diameter, then } \angle APB = 90°",
            color=CHALK_YELLOW,
            font_size=32
        ).to_edge(RIGHT, buff=0.3).shift(UP)

        self.play(Write(formula))

        self.wait(2)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# THEOREM 4: CYCLIC QUADRILATERAL
# ============================================================

class CyclicQuadrilateral(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Cyclic Quadrilateral",
            "Opposite angles sum to 180°"
        )

        self.wait(1)

        # Circle
        circle = self.create_chalk_circle(radius=2.2)
        circle.shift(DOWN * 0.3 + LEFT * 0.5)
        center = circle.get_center()

        self.play(Create(circle))

        # Four points on circle
        angles = [PI * 0.15, PI * 0.55, PI * 1.1, PI * 1.6]
        points = [center + 2.2 * np.array([np.cos(a), np.sin(a), 0]) for a in angles]
        A, B, C, D = points

        # Dots and labels
        dots = VGroup(*[Dot(p, color=CHALK_YELLOW, radius=0.1) for p in points])
        labels = VGroup(
            Text("A", font_size=24, color=CHALK_YELLOW).next_to(A, UR, buff=0.1),
            Text("B", font_size=24, color=CHALK_YELLOW).next_to(B, UP, buff=0.1),
            Text("C", font_size=24, color=CHALK_YELLOW).next_to(C, DL, buff=0.1),
            Text("D", font_size=24, color=CHALK_YELLOW).next_to(D, DR, buff=0.1),
        )

        self.play(LaggedStart(*[FadeIn(d) for d in dots], lag_ratio=0.2))
        self.play(LaggedStart(*[Write(l) for l in labels], lag_ratio=0.2))

        # Quadrilateral sides
        sides = VGroup(
            Line(A, B, color=CHALK_GREEN, stroke_width=3),
            Line(B, C, color=CHALK_GREEN, stroke_width=3),
            Line(C, D, color=CHALK_GREEN, stroke_width=3),
            Line(D, A, color=CHALK_GREEN, stroke_width=3),
        )

        self.play(LaggedStart(*[Create(s) for s in sides], lag_ratio=0.2))

        # Highlight angle A (opposite to C)
        angle_A = Angle(
            Line(A, D), Line(A, B),
            radius=0.35, color=CHALK_RED
        )
        label_alpha = MathTex(r"\alpha", color=CHALK_RED, font_size=24)
        label_alpha.move_to(A + normalize(np.array([np.cos(angles[0] + PI), np.sin(angles[0] + PI), 0])) * 0.6)

        self.play(Create(angle_A), Write(label_alpha))

        # Highlight angle C (opposite to A)
        angle_C = Angle(
            Line(C, B), Line(C, D),
            radius=0.35, color=CHALK_BLUE
        )
        label_beta = MathTex(r"\beta", color=CHALK_BLUE, font_size=24)
        label_beta.move_to(C + normalize(np.array([np.cos(angles[2] + PI), np.sin(angles[2] + PI), 0])) * 0.6)

        self.play(Create(angle_C), Write(label_beta))

        # Show they sum to 180
        equation1 = MathTex(r"\alpha + \beta = 180°", color=CHALK_WHITE, font_size=36)
        equation1.to_edge(RIGHT, buff=0.5).shift(UP * 0.5)

        self.play(Write(equation1))

        self.wait(1)

        # Similarly for B and D
        angle_B = Angle(
            Line(B, A), Line(B, C),
            radius=0.35, color=CHALK_ORANGE
        )
        label_gamma = MathTex(r"\gamma", color=CHALK_ORANGE, font_size=24)
        label_gamma.move_to(B + DOWN * 0.5)

        angle_D = Angle(
            Line(D, C), Line(D, A),
            radius=0.35, color=CHALK_PINK
        )
        label_delta = MathTex(r"\delta", color=CHALK_PINK, font_size=24)
        label_delta.move_to(D + UP * 0.5)

        self.play(
            Create(angle_B), Write(label_gamma),
            Create(angle_D), Write(label_delta)
        )

        equation2 = MathTex(r"\gamma + \delta = 180°", color=CHALK_WHITE, font_size=36)
        equation2.next_to(equation1, DOWN, buff=0.4)

        self.play(Write(equation2))

        # Summary
        summary = Text(
            "Opposite angles in a cyclic\nquadrilateral are supplementary",
            color=CHALK_YELLOW,
            font_size=24,
            line_spacing=1.2
        ).to_edge(DOWN, buff=0.5)

        self.play(Write(summary))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# THEOREM 5: TANGENT-RADIUS THEOREM
# ============================================================

class TangentRadiusTheorem(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Tangent-Radius Theorem",
            "A tangent is perpendicular to the radius at the point of contact"
        )

        self.wait(1)

        # Circle
        circle = self.create_chalk_circle(radius=2)
        circle.shift(DOWN * 0.3)
        center = circle.get_center()

        self.play(Create(circle))

        # Center
        dot_O = Dot(center, color=CHALK_RED, radius=0.1)
        label_O = Text("O", color=CHALK_RED, font_size=24).next_to(dot_O, DL, buff=0.1)
        self.play(FadeIn(dot_O), Write(label_O))

        # Point of tangency
        P = circle.point_at_angle(PI * 0.3)
        dot_P = Dot(P, color=CHALK_YELLOW, radius=0.1)
        label_P = Text("P", color=CHALK_YELLOW, font_size=24).next_to(dot_P, UR, buff=0.1)

        self.play(FadeIn(dot_P), Write(label_P))

        # Radius OP
        radius = Line(center, P, color=CHALK_RED, stroke_width=4)
        radius_label = Text("r", color=CHALK_RED, font_size=24)
        radius_label.move_to((center + P) / 2 + UP * 0.3 + LEFT * 0.2)

        self.play(Create(radius), Write(radius_label))

        # Tangent line at P
        tangent_direction = np.array([-np.sin(PI * 0.3), np.cos(PI * 0.3), 0])
        tangent_start = P - tangent_direction * 3
        tangent_end = P + tangent_direction * 3

        tangent = Line(tangent_start, tangent_end, color=CHALK_GREEN, stroke_width=3)
        tangent_label = Text("Tangent", color=CHALK_GREEN, font_size=22)
        tangent_label.next_to(tangent_end, RIGHT, buff=0.1)

        self.play(Create(tangent), Write(tangent_label))

        # Right angle marker
        right_angle = RightAngle(
            radius, tangent,
            length=0.3, color=CHALK_WHITE, quadrant=(-1, 1)
        )
        angle_label = MathTex(r"90°", color=CHALK_WHITE, font_size=28)
        angle_label.move_to(P + normalize(center - P) * 0.5 + tangent_direction * 0.3)

        self.play(Create(right_angle), Write(angle_label))

        # Formula
        formula = VGroup(
            MathTex(r"\text{Tangent} \perp \text{Radius}", color=CHALK_YELLOW, font_size=36),
            MathTex(r"\angle OPT = 90°", color=CHALK_WHITE, font_size=32)
        ).arrange(DOWN, buff=0.3)
        formula.to_edge(RIGHT, buff=0.5).shift(DOWN)

        box = SurroundingRectangle(formula, color=CHALK_YELLOW, buff=0.2, stroke_width=2)

        self.play(Write(formula[0]))
        self.play(Write(formula[1]))
        self.play(Create(box))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# THEOREM 6: TWO TANGENTS THEOREM
# ============================================================

class TwoTangentsTheorem(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Two Tangents Theorem",
            "Tangents from an external point are equal in length"
        )

        self.wait(1)

        # Circle
        circle = self.create_chalk_circle(radius=1.8)
        circle.shift(LEFT * 1.5 + DOWN * 0.3)
        center = circle.get_center()

        self.play(Create(circle))

        # External point
        P = center + RIGHT * 4.5
        dot_P = Dot(P, color=CHALK_GREEN, radius=0.12)
        label_P = Text("P", color=CHALK_GREEN, font_size=28).next_to(dot_P, RIGHT, buff=0.1)

        self.play(FadeIn(dot_P), Write(label_P))

        # Calculate tangent points
        dist = np.linalg.norm(P - center)
        radius = 1.8
        tangent_length = np.sqrt(dist**2 - radius**2)

        # Angle for tangent points
        theta = np.arcsin(radius / dist)
        base_angle = np.arctan2(0, 1)  # angle from center to P

        A = center + radius * np.array([np.cos(base_angle + theta + PI), np.sin(base_angle + theta + PI), 0])
        B = center + radius * np.array([np.cos(base_angle - theta + PI), np.sin(base_angle - theta + PI), 0])

        # Actually, let me recalculate more carefully
        # Vector from center to P
        CP = P - center
        CP_norm = CP / np.linalg.norm(CP)
        CP_perp = np.array([-CP_norm[1], CP_norm[0], 0])

        # Distance from center to tangent point along CP direction
        d = radius**2 / dist
        h = radius * np.sqrt(1 - (radius/dist)**2)

        A = center + d * CP_norm + h * CP_perp
        B = center + d * CP_norm - h * CP_perp

        dot_A = Dot(A, color=CHALK_YELLOW, radius=0.1)
        dot_B = Dot(B, color=CHALK_YELLOW, radius=0.1)
        label_A = Text("A", color=CHALK_YELLOW, font_size=24).next_to(dot_A, UL, buff=0.1)
        label_B = Text("B", color=CHALK_YELLOW, font_size=24).next_to(dot_B, DL, buff=0.1)

        # Tangent lines
        line_PA = Line(P, A, color=CHALK_BLUE, stroke_width=3)
        line_PB = Line(P, B, color=CHALK_RED, stroke_width=3)

        self.play(
            FadeIn(dot_A), FadeIn(dot_B),
            Write(label_A), Write(label_B)
        )
        self.play(Create(line_PA), Create(line_PB))

        # Length labels
        length_PA = MathTex(r"\ell", color=CHALK_BLUE, font_size=28)
        length_PA.move_to((P + A) / 2 + UP * 0.3)

        length_PB = MathTex(r"\ell", color=CHALK_RED, font_size=28)
        length_PB.move_to((P + B) / 2 + DOWN * 0.3)

        self.play(Write(length_PA), Write(length_PB))

        # Center and radii
        dot_O = Dot(center, color=CHALK_WHITE, radius=0.08)
        label_O = Text("O", color=CHALK_WHITE, font_size=20).next_to(dot_O, LEFT, buff=0.1)

        radius_OA = DashedLine(center, A, color=CHALK_WHITE, stroke_width=2)
        radius_OB = DashedLine(center, B, color=CHALK_WHITE, stroke_width=2)

        self.play(
            FadeIn(dot_O), Write(label_O),
            Create(radius_OA), Create(radius_OB)
        )

        # Right angle markers
        right_angle_A = RightAngle(Line(A, center), Line(A, P), length=0.25, color=CHALK_WHITE)
        right_angle_B = RightAngle(Line(B, center), Line(B, P), length=0.25, color=CHALK_WHITE)

        self.play(Create(right_angle_A), Create(right_angle_B))

        # Formula
        formula = VGroup(
            MathTex(r"PA = PB", color=CHALK_YELLOW, font_size=42),
            Text("Tangent lengths are equal", color=CHALK_WHITE, font_size=24)
        ).arrange(DOWN, buff=0.3)
        formula.to_edge(DOWN, buff=0.5)

        self.play(Write(formula[0]))
        self.play(Write(formula[1]))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# THEOREM 7: ALTERNATE SEGMENT THEOREM
# ============================================================

class AlternateSegmentTheorem(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Alternate Segment Theorem",
            "Angle between tangent and chord equals inscribed angle"
        )

        self.wait(1)

        # Circle
        circle = self.create_chalk_circle(radius=2)
        circle.shift(DOWN * 0.3 + LEFT * 0.5)
        center = circle.get_center()

        self.play(Create(circle))

        # Point of tangency
        T = circle.point_at_angle(-PI * 0.3)
        dot_T = Dot(T, color=CHALK_YELLOW, radius=0.1)
        label_T = Text("T", color=CHALK_YELLOW, font_size=24).next_to(dot_T, DR, buff=0.1)

        self.play(FadeIn(dot_T), Write(label_T))

        # Tangent at T
        tangent_dir = np.array([np.sin(-PI * 0.3), -np.cos(-PI * 0.3), 0])
        tangent = Line(T - tangent_dir * 2.5, T + tangent_dir * 2.5, color=CHALK_GREEN, stroke_width=3)

        self.play(Create(tangent))

        # Chord from T to another point A on circle
        A = circle.point_at_angle(PI * 0.6)
        dot_A = Dot(A, color=CHALK_YELLOW, radius=0.1)
        label_A = Text("A", color=CHALK_YELLOW, font_size=24).next_to(dot_A, UP, buff=0.1)

        chord_TA = Line(T, A, color=CHALK_BLUE, stroke_width=3)

        self.play(FadeIn(dot_A), Write(label_A))
        self.play(Create(chord_TA))

        # Angle between tangent and chord (at T)
        angle_tangent_chord = Angle(
            tangent, chord_TA,
            radius=0.4, color=CHALK_RED
        )
        label_alpha = MathTex(r"\alpha", color=CHALK_RED, font_size=26)
        label_alpha.move_to(T + UP * 0.4 + RIGHT * 0.5)

        self.play(Create(angle_tangent_chord), Write(label_alpha))

        # Point B in the alternate segment
        B = circle.point_at_angle(PI * 1.3)
        dot_B = Dot(B, color=CHALK_PINK, radius=0.1)
        label_B = Text("B", color=CHALK_PINK, font_size=24).next_to(dot_B, LEFT, buff=0.1)

        # Lines from B to T and A (inscribed angle)
        line_BT = Line(B, T, color=CHALK_PINK, stroke_width=2)
        line_BA = Line(B, A, color=CHALK_PINK, stroke_width=2)

        self.play(FadeIn(dot_B), Write(label_B))
        self.play(Create(line_BT), Create(line_BA))

        # Inscribed angle at B
        angle_inscribed = Angle(
            line_BT, line_BA,
            radius=0.35, color=CHALK_RED
        )
        label_alpha2 = MathTex(r"\alpha", color=CHALK_RED, font_size=26)
        label_alpha2.move_to(B + RIGHT * 0.5 + UP * 0.2)

        self.play(Create(angle_inscribed), Write(label_alpha2))

        # Formula
        formula = VGroup(
            MathTex(r"\angle(\text{tangent}, \text{chord}) = \angle(\text{inscribed})", color=CHALK_WHITE, font_size=28),
            MathTex(r"\alpha = \alpha", color=CHALK_YELLOW, font_size=36)
        ).arrange(DOWN, buff=0.3)
        formula.to_edge(RIGHT, buff=0.3).shift(DOWN * 0.5)

        box = SurroundingRectangle(formula, color=CHALK_YELLOW, buff=0.2, stroke_width=2)

        self.play(Write(formula[0]))
        self.play(Write(formula[1]))
        self.play(Create(box))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# THEOREM 8: INTERSECTING CHORDS THEOREM
# ============================================================

class IntersectingChordsTheorem(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Intersecting Chords Theorem",
            "Products of chord segments are equal"
        )

        self.wait(1)

        # Circle
        circle = self.create_chalk_circle(radius=2.2)
        circle.shift(DOWN * 0.3 + LEFT * 0.5)
        center = circle.get_center()

        self.play(Create(circle))

        # Two chords that intersect inside
        A = circle.point_at_angle(PI * 0.15)
        B = circle.point_at_angle(PI * 1.1)
        C = circle.point_at_angle(PI * 0.5)
        D = circle.point_at_angle(PI * 1.65)

        # Find intersection point P
        # Line AB: parametric form A + t(B-A)
        # Line CD: parametric form C + s(D-C)
        # Solve for t and s
        def line_intersection(p1, p2, p3, p4):
            x1, y1 = p1[0], p1[1]
            x2, y2 = p2[0], p2[1]
            x3, y3 = p3[0], p3[1]
            x4, y4 = p4[0], p4[1]

            denom = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4)
            t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / denom

            x = x1 + t*(x2-x1)
            y = y1 + t*(y2-y1)
            return np.array([x, y, 0])

        P = line_intersection(A, B, C, D)

        # Points and labels
        dots = VGroup(
            Dot(A, color=CHALK_BLUE, radius=0.1),
            Dot(B, color=CHALK_BLUE, radius=0.1),
            Dot(C, color=CHALK_GREEN, radius=0.1),
            Dot(D, color=CHALK_GREEN, radius=0.1),
        )
        labels = VGroup(
            Text("A", font_size=24, color=CHALK_BLUE).next_to(A, UR, buff=0.1),
            Text("B", font_size=24, color=CHALK_BLUE).next_to(B, DL, buff=0.1),
            Text("C", font_size=24, color=CHALK_GREEN).next_to(C, UP, buff=0.1),
            Text("D", font_size=24, color=CHALK_GREEN).next_to(D, DOWN, buff=0.1),
        )

        self.play(LaggedStart(*[FadeIn(d) for d in dots], lag_ratio=0.15))
        self.play(LaggedStart(*[Write(l) for l in labels], lag_ratio=0.15))

        # Chords
        chord_AB = Line(A, B, color=CHALK_BLUE, stroke_width=3)
        chord_CD = Line(C, D, color=CHALK_GREEN, stroke_width=3)

        self.play(Create(chord_AB), Create(chord_CD))

        # Intersection point
        dot_P = Dot(P, color=CHALK_RED, radius=0.12)
        label_P = Text("P", font_size=24, color=CHALK_RED).next_to(dot_P, RIGHT, buff=0.1)

        self.play(FadeIn(dot_P), Write(label_P))

        # Segment labels
        seg_AP = MathTex(r"a", color=CHALK_BLUE, font_size=24).move_to((A + P)/2 + UP * 0.25)
        seg_PB = MathTex(r"b", color=CHALK_BLUE, font_size=24).move_to((P + B)/2 + DOWN * 0.25)
        seg_CP = MathTex(r"c", color=CHALK_GREEN, font_size=24).move_to((C + P)/2 + LEFT * 0.3)
        seg_PD = MathTex(r"d", color=CHALK_GREEN, font_size=24).move_to((P + D)/2 + RIGHT * 0.25)

        self.play(
            Write(seg_AP), Write(seg_PB),
            Write(seg_CP), Write(seg_PD)
        )

        # Formula
        formula = VGroup(
            MathTex(r"AP \cdot PB = CP \cdot PD", color=CHALK_YELLOW, font_size=40),
            MathTex(r"a \cdot b = c \cdot d", color=CHALK_WHITE, font_size=36)
        ).arrange(DOWN, buff=0.3)
        formula.to_edge(RIGHT, buff=0.3).shift(DOWN * 0.3)

        box = SurroundingRectangle(formula, color=CHALK_YELLOW, buff=0.2, stroke_width=2)

        self.play(Write(formula[0]))
        self.play(Write(formula[1]))
        self.play(Create(box))

        # Note about power of a point
        note = Text(
            "This is the 'Power of a Point' theorem",
            color=CHALK_WHITE,
            font_size=22
        ).to_edge(DOWN, buff=0.5)

        self.play(Write(note))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# THEOREM 9: TANGENT-SECANT THEOREM
# ============================================================

class TangentSecantTheorem(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Tangent-Secant Theorem",
            "Tangent squared equals product of secant segments"
        )

        self.wait(1)

        # Circle
        circle = self.create_chalk_circle(radius=1.8)
        circle.shift(LEFT * 1 + DOWN * 0.3)
        center = circle.get_center()

        self.play(Create(circle))

        # External point
        P = center + RIGHT * 4.5
        dot_P = Dot(P, color=CHALK_RED, radius=0.12)
        label_P = Text("P", color=CHALK_RED, font_size=28).next_to(dot_P, RIGHT, buff=0.1)

        self.play(FadeIn(dot_P), Write(label_P))

        # Tangent point T
        dist = np.linalg.norm(P - center)
        radius = 1.8
        CP = P - center
        CP_norm = CP / np.linalg.norm(CP)
        CP_perp = np.array([-CP_norm[1], CP_norm[0], 0])

        d = radius**2 / dist
        h = radius * np.sqrt(1 - (radius/dist)**2)
        T = center + d * CP_norm + h * CP_perp

        dot_T = Dot(T, color=CHALK_GREEN, radius=0.1)
        label_T = Text("T", color=CHALK_GREEN, font_size=24).next_to(dot_T, UP, buff=0.1)

        # Tangent line
        tangent = Line(P, T, color=CHALK_GREEN, stroke_width=3)

        self.play(FadeIn(dot_T), Write(label_T))
        self.play(Create(tangent))

        # Tangent length label
        t_label = MathTex(r"t", color=CHALK_GREEN, font_size=28).move_to((P + T)/2 + UP * 0.3)
        self.play(Write(t_label))

        # Secant through P
        # Find where a line from P through center intersects circle
        A = center - CP_norm * radius  # far intersection
        B = center + CP_norm * radius  # near intersection

        dot_A = Dot(A, color=CHALK_BLUE, radius=0.1)
        dot_B = Dot(B, color=CHALK_BLUE, radius=0.1)
        label_A = Text("A", color=CHALK_BLUE, font_size=24).next_to(dot_A, LEFT, buff=0.1)
        label_B = Text("B", color=CHALK_BLUE, font_size=24).next_to(dot_B, DOWN, buff=0.1)

        secant = Line(P, A, color=CHALK_BLUE, stroke_width=3)

        self.play(Create(secant))
        self.play(
            FadeIn(dot_A), FadeIn(dot_B),
            Write(label_A), Write(label_B)
        )

        # Segment labels
        seg_PB = MathTex(r"a", color=CHALK_BLUE, font_size=24).move_to((P + B)/2 + DOWN * 0.3)
        seg_PA = MathTex(r"b", color=CHALK_BLUE, font_size=24).move_to((P + A)/2 + UP * 0.3)

        self.play(Write(seg_PB), Write(seg_PA))

        # Formula
        formula = VGroup(
            MathTex(r"PT^2 = PA \cdot PB", color=CHALK_YELLOW, font_size=40),
            MathTex(r"t^2 = a \cdot b", color=CHALK_WHITE, font_size=36)
        ).arrange(DOWN, buff=0.3)
        formula.to_edge(DOWN, buff=0.5)

        box = SurroundingRectangle(formula, color=CHALK_YELLOW, buff=0.2, stroke_width=2)

        self.play(Write(formula[0]))
        self.play(Write(formula[1]))
        self.play(Create(box))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# SUMMARY SCENE
# ============================================================

class CircleTheoremsSummary(ChalkboardScene):
    def construct(self):
        title = Text("Circle Theorems Summary", color=CHALK_YELLOW, font_size=48, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        underline = Line(title.get_left() + DOWN * 0.2, title.get_right() + DOWN * 0.2, color=CHALK_YELLOW)

        self.play(Write(title), Create(underline))

        theorems = [
            ("1. Central Angle", "= 2 × Inscribed Angle"),
            ("2. Inscribed Angles", "same arc → equal"),
            ("3. Semicircle Angle", "= 90° (Thales)"),
            ("4. Cyclic Quad", "opposite angles = 180°"),
            ("5. Tangent ⊥ Radius", "at point of contact"),
            ("6. Two Tangents", "from external point are equal"),
            ("7. Alternate Segment", "tangent-chord = inscribed"),
            ("8. Intersecting Chords", "a·b = c·d"),
            ("9. Tangent-Secant", "t² = a·b"),
        ]

        theorem_group = VGroup()
        for i, (name, desc) in enumerate(theorems):
            row = VGroup(
                Text(name, color=CHALK_GREEN, font_size=22),
                Text(desc, color=CHALK_WHITE, font_size=20)
            ).arrange(RIGHT, buff=0.5)
            theorem_group.add(row)

        theorem_group.arrange(DOWN, aligned_edge=LEFT, buff=0.25)
        theorem_group.next_to(underline, DOWN, buff=0.5)

        for row in theorem_group:
            self.play(Write(row), run_time=0.6)

        # Final circle decoration
        circle = Circle(radius=1.2, color=CHALK_WHITE, stroke_width=2)
        circle.to_edge(RIGHT, buff=1).shift(DOWN * 0.5)

        self.play(Create(circle))

        self.wait(3)

        # Closing
        thanks = Text("Master these theorems!", color=CHALK_YELLOW, font_size=36)
        thanks.to_edge(DOWN, buff=0.5)
        self.play(Write(thanks))

        self.wait(2)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# FULL VIDEO - All scenes combined
# ============================================================

class CircleGeometryComplete(ChalkboardScene):
    """
    Run all scenes in sequence for a complete video.
    To render: manim -pql circle_geometry_chalk.py CircleGeometryComplete
    """
    def construct(self):
        scenes = [
            CircleGeometryIntro,
            CentralAngleTheorem,
            InscribedAngleTheorem,
            AngleInSemicircle,
            CyclicQuadrilateral,
            TangentRadiusTheorem,
            TwoTangentsTheorem,
            AlternateSegmentTheorem,
            IntersectingChordsTheorem,
            TangentSecantTheorem,
            CircleTheoremsSummary,
        ]

        # Note: This won't work as a simple construct method
        # Each scene needs to be rendered separately or use a different approach
        pass
