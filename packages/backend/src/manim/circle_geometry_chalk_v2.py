"""
Circle Geometry Theorems - Chalkboard Style (V2)
Enhanced with angle shading and transformation animations

Key Feature: Shaded angles that animate/move to show equality
"""

from manim import *
import numpy as np

# ============================================================
# CHALKBOARD THEME CONFIGURATION
# ============================================================

CHALK_WHITE = "#E8E8E8"
CHALK_YELLOW = "#F4D03F"
CHALK_BLUE = "#5DADE2"
CHALK_GREEN = "#58D68D"
CHALK_RED = "#EC7063"
CHALK_ORANGE = "#F5B041"
CHALK_PINK = "#F1948A"
CHALK_PURPLE = "#BB8FCE"
CHALKBOARD_BG = "#1C2833"


class ChalkboardScene(Scene):
    """Base class for chalkboard-style scenes"""

    def setup(self):
        self.camera.background_color = CHALKBOARD_BG

    def create_angle_sector(self, vertex, point1, point2, radius=0.5, color=CHALK_YELLOW, fill_opacity=0.4):
        """
        Create a shaded sector (filled angle) between two lines from a vertex.

        Args:
            vertex: The vertex point of the angle
            point1: First point defining one ray
            point2: Second point defining other ray
            radius: Size of the shaded sector
            color: Fill color
            fill_opacity: Opacity of the fill

        Returns:
            Sector mobject representing the shaded angle
        """
        # Calculate angles
        vec1 = np.array(point1) - np.array(vertex)
        vec2 = np.array(point2) - np.array(vertex)

        angle1 = np.arctan2(vec1[1], vec1[0])
        angle2 = np.arctan2(vec2[1], vec2[0])

        # Ensure we take the smaller angle
        angle_diff = angle2 - angle1
        if angle_diff > PI:
            angle_diff -= 2 * PI
        elif angle_diff < -PI:
            angle_diff += 2 * PI

        sector = Sector(
            outer_radius=radius,
            inner_radius=0,
            angle=abs(angle_diff),
            start_angle=angle1 if angle_diff > 0 else angle2,
            color=color,
            fill_opacity=fill_opacity,
            stroke_width=0
        )
        sector.move_to(vertex, aligned_edge=ORIGIN)

        return sector

    def create_angle_wedge(self, vertex, point1, point2, radius=0.5, color=CHALK_YELLOW, fill_opacity=0.4):
        """
        Create a shaded wedge using Polygon for more control.
        """
        vertex = np.array(vertex)
        p1 = np.array(point1)
        p2 = np.array(point2)

        # Direction vectors
        dir1 = (p1 - vertex) / np.linalg.norm(p1 - vertex)
        dir2 = (p2 - vertex) / np.linalg.norm(p2 - vertex)

        # Calculate angles
        angle1 = np.arctan2(dir1[1], dir1[0])
        angle2 = np.arctan2(dir2[1], dir2[0])

        # Create arc points
        angle_diff = angle2 - angle1
        if angle_diff > PI:
            angle_diff -= 2 * PI
        elif angle_diff < -PI:
            angle_diff += 2 * PI

        # Generate points along the arc
        num_points = 20
        if angle_diff > 0:
            angles = np.linspace(angle1, angle1 + angle_diff, num_points)
        else:
            angles = np.linspace(angle2, angle2 - angle_diff, num_points)

        arc_points = [vertex + radius * np.array([np.cos(a), np.sin(a), 0]) for a in angles]

        # Create polygon: vertex -> arc points -> back to vertex
        all_points = [vertex] + arc_points

        wedge = Polygon(
            *all_points,
            color=color,
            fill_color=color,
            fill_opacity=fill_opacity,
            stroke_width=2,
            stroke_color=color
        )

        return wedge

    def draw_theorem_title(self, title, subtitle=None):
        """Draw a theorem title with underline"""
        title_text = Text(title, color=CHALK_YELLOW, font_size=44, weight=BOLD)
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
            sub = Text(subtitle, color=CHALK_WHITE, font_size=24)
            sub.next_to(underline, DOWN, buff=0.3)
            self.play(FadeIn(sub), run_time=0.5)
            return VGroup(title_text, underline, sub)

        return VGroup(title_text, underline)


# ============================================================
# CENTRAL ANGLE THEOREM - With Shaded Angle Animation
# ============================================================

class CentralAngleTheoremV2(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Central Angle Theorem",
            "The central angle is twice the inscribed angle"
        )
        self.wait(0.5)

        # Create circle
        circle = Circle(radius=2, color=CHALK_WHITE, stroke_width=3)
        circle.shift(DOWN * 0.5 + LEFT * 0.5)
        center = circle.get_center()

        # Define points
        A = circle.point_at_angle(PI * 0.15)
        B = circle.point_at_angle(PI * 0.85)
        P = circle.point_at_angle(PI * 1.5)
        O = center

        # Create dots
        dot_A = Dot(A, color=CHALK_YELLOW, radius=0.1)
        dot_B = Dot(B, color=CHALK_YELLOW, radius=0.1)
        dot_P = Dot(P, color=CHALK_GREEN, radius=0.1)
        dot_O = Dot(O, color=CHALK_RED, radius=0.1)

        # Labels
        label_A = Text("A", color=CHALK_YELLOW, font_size=24).next_to(dot_A, UR, buff=0.1)
        label_B = Text("B", color=CHALK_YELLOW, font_size=24).next_to(dot_B, UL, buff=0.1)
        label_P = Text("P", color=CHALK_GREEN, font_size=24).next_to(dot_P, DOWN, buff=0.1)
        label_O = Text("O", color=CHALK_RED, font_size=24).next_to(dot_O, DOWN + LEFT, buff=0.1)

        self.play(Create(circle), run_time=1.5)
        self.play(
            FadeIn(dot_O), Write(label_O),
            FadeIn(dot_A), Write(label_A),
            FadeIn(dot_B), Write(label_B),
        )

        # Highlight arc AB
        arc_AB = Arc(
            radius=2,
            start_angle=PI * 0.15,
            angle=PI * 0.7,
            color=CHALK_ORANGE,
            stroke_width=6
        ).shift(circle.get_center() - ORIGIN)

        self.play(Create(arc_AB), run_time=1)

        # Draw central angle (angle AOB)
        line_OA = Line(O, A, color=CHALK_RED, stroke_width=3)
        line_OB = Line(O, B, color=CHALK_RED, stroke_width=3)
        self.play(Create(line_OA), Create(line_OB))

        # SHADED CENTRAL ANGLE
        central_wedge = self.create_angle_wedge(O, A, B, radius=0.7, color=CHALK_RED, fill_opacity=0.5)
        central_label = MathTex(r"2\theta", color=CHALK_RED, font_size=32)
        central_label.move_to(O + UP * 1.0)

        self.play(FadeIn(central_wedge), Write(central_label))
        self.wait(0.5)

        # Add point P and inscribed angle
        self.play(FadeIn(dot_P), Write(label_P))

        line_PA = Line(P, A, color=CHALK_GREEN, stroke_width=3)
        line_PB = Line(P, B, color=CHALK_GREEN, stroke_width=3)
        self.play(Create(line_PA), Create(line_PB))

        # SHADED INSCRIBED ANGLE
        inscribed_wedge = self.create_angle_wedge(P, A, B, radius=0.5, color=CHALK_GREEN, fill_opacity=0.5)
        inscribed_label = MathTex(r"\theta", color=CHALK_GREEN, font_size=28)
        inscribed_label.move_to(P + UP * 0.7)

        self.play(FadeIn(inscribed_wedge), Write(inscribed_label))
        self.wait(1)

        # ========== KEY ANIMATION: Move inscribed angle to compare ==========
        explanation1 = Text(
            "Let's see how the inscribed angle",
            color=CHALK_WHITE, font_size=22
        ).to_edge(DOWN, buff=1.2)
        explanation2 = Text(
            "compares to the central angle...",
            color=CHALK_WHITE, font_size=22
        ).next_to(explanation1, DOWN, buff=0.2)

        self.play(Write(explanation1), Write(explanation2))
        self.wait(0.5)

        # Create a copy of the inscribed wedge to animate
        inscribed_copy = inscribed_wedge.copy()
        inscribed_copy.set_color(CHALK_BLUE)
        inscribed_copy.set_fill(CHALK_BLUE, opacity=0.6)

        self.play(FadeIn(inscribed_copy))

        # Animate moving the inscribed angle copy to the central angle
        # Scale it up and position it to show it fits twice
        self.play(
            inscribed_copy.animate.move_to(O).scale(1.4).shift(UP * 0.3 + LEFT * 0.15),
            run_time=1.5
        )

        # Create another copy to show it fits twice
        inscribed_copy2 = inscribed_wedge.copy()
        inscribed_copy2.set_color(CHALK_PURPLE)
        inscribed_copy2.set_fill(CHALK_PURPLE, opacity=0.6)

        self.play(FadeIn(inscribed_copy2))
        self.play(
            inscribed_copy2.animate.move_to(O).scale(1.4).shift(UP * 0.3 + RIGHT * 0.15).rotate(
                angle=0.5, about_point=O
            ),
            run_time=1.5
        )

        # Show formula
        formula_text = VGroup(
            MathTex(r"\theta + \theta = 2\theta", color=CHALK_YELLOW, font_size=36),
            Text("Inscribed angle fits TWICE!", color=CHALK_WHITE, font_size=24)
        ).arrange(DOWN, buff=0.2)
        formula_text.to_edge(RIGHT, buff=0.5).shift(DOWN * 0.5)

        box = SurroundingRectangle(formula_text, color=CHALK_YELLOW, buff=0.2, stroke_width=2)

        self.play(
            FadeOut(explanation1), FadeOut(explanation2),
            Write(formula_text[0]),
        )
        self.play(Write(formula_text[1]), Create(box))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# INSCRIBED ANGLE THEOREM - With Shaded Angle Movement
# ============================================================

class InscribedAngleTheoremV2(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Inscribed Angle Theorem",
            "Inscribed angles subtending the same arc are equal"
        )
        self.wait(0.5)

        # Circle
        circle = Circle(radius=2.2, color=CHALK_WHITE, stroke_width=3)
        circle.shift(DOWN * 0.3 + LEFT * 1)
        center = circle.get_center()

        # Points on the arc
        A = circle.point_at_angle(PI * 0.15)
        B = circle.point_at_angle(PI * 0.85)

        # Multiple points for inscribed angles
        P1 = circle.point_at_angle(PI * 1.25)
        P2 = circle.point_at_angle(PI * 1.55)
        P3 = circle.point_at_angle(PI * 1.8)

        self.play(Create(circle))

        # Arc AB
        arc_AB = Arc(
            radius=2.2,
            start_angle=PI * 0.15,
            angle=PI * 0.7,
            color=CHALK_ORANGE,
            stroke_width=6
        ).move_arc_center_to(center)

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

        # ===== First inscribed angle at P1 =====
        dot_P1 = Dot(P1, color=CHALK_GREEN, radius=0.1)
        label_P1 = Text("P₁", font_size=22, color=CHALK_GREEN).next_to(dot_P1, DL, buff=0.1)
        line_P1A = Line(P1, A, color=CHALK_GREEN, stroke_width=2)
        line_P1B = Line(P1, B, color=CHALK_GREEN, stroke_width=2)

        self.play(FadeIn(dot_P1), Write(label_P1))
        self.play(Create(line_P1A), Create(line_P1B))

        # SHADED ANGLE at P1
        wedge_P1 = self.create_angle_wedge(P1, A, B, radius=0.45, color=CHALK_GREEN, fill_opacity=0.5)
        theta1 = MathTex(r"\theta", color=CHALK_GREEN, font_size=26).move_to(P1 + UP * 0.6 + RIGHT * 0.3)

        self.play(FadeIn(wedge_P1), Write(theta1))
        self.wait(0.5)

        # ===== Second inscribed angle at P2 =====
        dot_P2 = Dot(P2, color=CHALK_BLUE, radius=0.1)
        label_P2 = Text("P₂", font_size=22, color=CHALK_BLUE).next_to(dot_P2, DOWN, buff=0.1)
        line_P2A = Line(P2, A, color=CHALK_BLUE, stroke_width=2)
        line_P2B = Line(P2, B, color=CHALK_BLUE, stroke_width=2)

        self.play(FadeIn(dot_P2), Write(label_P2))
        self.play(Create(line_P2A), Create(line_P2B))

        # SHADED ANGLE at P2
        wedge_P2 = self.create_angle_wedge(P2, A, B, radius=0.45, color=CHALK_BLUE, fill_opacity=0.5)
        theta2 = MathTex(r"\theta", color=CHALK_BLUE, font_size=26).move_to(P2 + UP * 0.6)

        self.play(FadeIn(wedge_P2), Write(theta2))
        self.wait(0.5)

        # ===== KEY ANIMATION: Move P1's angle to overlay on P2's angle =====
        explanation = Text(
            "Watch: the angles are exactly equal!",
            color=CHALK_YELLOW, font_size=24
        ).to_edge(DOWN, buff=0.8)

        self.play(Write(explanation))

        # Create a copy of wedge_P1 to animate
        wedge_copy = wedge_P1.copy()
        wedge_copy.set_color(CHALK_PINK)
        wedge_copy.set_fill(CHALK_PINK, opacity=0.7)

        self.play(
            wedge_copy.animate.move_to(wedge_P2.get_center()),
            run_time=2,
            rate_func=smooth
        )

        # Flash to show they match
        self.play(
            wedge_copy.animate.set_fill(CHALK_WHITE, opacity=0.9),
            wedge_P2.animate.set_fill(CHALK_WHITE, opacity=0.9),
            run_time=0.3
        )
        self.play(
            wedge_copy.animate.set_fill(CHALK_PINK, opacity=0.5),
            wedge_P2.animate.set_fill(CHALK_BLUE, opacity=0.5),
            run_time=0.3
        )

        # Add third angle to show it works for any point
        self.play(FadeOut(wedge_copy), FadeOut(explanation))

        dot_P3 = Dot(P3, color=CHALK_PINK, radius=0.1)
        label_P3 = Text("P₃", font_size=22, color=CHALK_PINK).next_to(dot_P3, DR, buff=0.1)
        line_P3A = Line(P3, A, color=CHALK_PINK, stroke_width=2)
        line_P3B = Line(P3, B, color=CHALK_PINK, stroke_width=2)

        self.play(FadeIn(dot_P3), Write(label_P3))
        self.play(Create(line_P3A), Create(line_P3B))

        wedge_P3 = self.create_angle_wedge(P3, A, B, radius=0.45, color=CHALK_PINK, fill_opacity=0.5)
        theta3 = MathTex(r"\theta", color=CHALK_PINK, font_size=26).move_to(P3 + LEFT * 0.5 + UP * 0.3)

        self.play(FadeIn(wedge_P3), Write(theta3))

        # Animate all three angles coming together
        explanation2 = Text(
            "All inscribed angles on the same arc are EQUAL",
            color=CHALK_YELLOW, font_size=24
        ).to_edge(DOWN, buff=0.8)

        # Create copies and move them to center right
        target_pos = RIGHT * 3.5 + DOWN * 0.5

        wedge_copy1 = wedge_P1.copy()
        wedge_copy2 = wedge_P2.copy()
        wedge_copy3 = wedge_P3.copy()

        self.play(
            wedge_copy1.animate.move_to(target_pos),
            wedge_copy2.animate.move_to(target_pos),
            wedge_copy3.animate.move_to(target_pos),
            Write(explanation2),
            run_time=2
        )

        # Stack them slightly offset to show they're all the same size
        self.play(
            wedge_copy1.animate.shift(UP * 0.1),
            wedge_copy2.animate.shift(DOWN * 0.05),
            wedge_copy3.animate.shift(DOWN * 0.2),
            run_time=0.5
        )

        # Formula
        formula = MathTex(
            r"\angle AP_1B = \angle AP_2B = \angle AP_3B = \theta",
            color=CHALK_WHITE, font_size=28
        ).next_to(target_pos, DOWN, buff=0.8)

        self.play(Write(formula))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# ANGLE IN SEMICIRCLE (THALES) - With Animated Shading
# ============================================================

class AngleInSemicircleV2(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Thales' Theorem",
            "An angle inscribed in a semicircle is always 90°"
        )
        self.wait(0.5)

        # Circle
        circle = Circle(radius=2.2, color=CHALK_WHITE, stroke_width=3)
        circle.shift(DOWN * 0.5)
        center = circle.get_center()

        # Diameter endpoints
        A = center + LEFT * 2.2
        B = center + RIGHT * 2.2

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

        # First position of P
        P = center + 2.2 * np.array([np.cos(PI * 0.7), np.sin(PI * 0.7), 0])

        dot_P = Dot(P, color=CHALK_GREEN, radius=0.1)
        label_P = Text("P", color=CHALK_GREEN, font_size=24).next_to(dot_P, UP, buff=0.1)

        line_PA = Line(P, A, color=CHALK_GREEN, stroke_width=3)
        line_PB = Line(P, B, color=CHALK_GREEN, stroke_width=3)

        self.play(FadeIn(dot_P), Write(label_P))
        self.play(Create(line_PA), Create(line_PB))

        # SHADED RIGHT ANGLE
        # For a right angle, create a small square instead of a wedge
        def create_right_angle_square(vertex, p1, p2, size=0.3, color=CHALK_WHITE):
            vertex = np.array(vertex)
            dir1 = (np.array(p1) - vertex)
            dir1 = dir1 / np.linalg.norm(dir1)
            dir2 = (np.array(p2) - vertex)
            dir2 = dir2 / np.linalg.norm(dir2)

            corner1 = vertex + dir1 * size
            corner2 = vertex + dir2 * size
            corner3 = vertex + dir1 * size + dir2 * size

            square = Polygon(
                vertex, corner1, corner3, corner2,
                color=color,
                fill_color=color,
                fill_opacity=0.5,
                stroke_width=2
            )
            return square

        right_angle_square = create_right_angle_square(P, A, B, size=0.35, color=CHALK_BLUE)
        angle_label = MathTex(r"90°", color=CHALK_WHITE, font_size=28).next_to(right_angle_square, UR, buff=0.1)

        self.play(FadeIn(right_angle_square), Write(angle_label))
        self.wait(1)

        # Explanation
        explanation = Text(
            "Watch: no matter where P moves on the semicircle...",
            color=CHALK_WHITE, font_size=22
        ).to_edge(DOWN, buff=0.7)

        self.play(Write(explanation))

        # Animate P moving along the semicircle
        positions = [PI * 0.4, PI * 0.55, PI * 0.85, PI * 0.65]

        for angle in positions:
            new_P = center + 2.2 * np.array([np.cos(angle), np.sin(angle), 0])
            new_dot_P = Dot(new_P, color=CHALK_GREEN, radius=0.1)
            new_label_P = Text("P", color=CHALK_GREEN, font_size=24)
            new_label_P.next_to(new_P, UP if angle > PI/2 else UR, buff=0.1)

            new_line_PA = Line(new_P, A, color=CHALK_GREEN, stroke_width=3)
            new_line_PB = Line(new_P, B, color=CHALK_GREEN, stroke_width=3)
            new_right_angle = create_right_angle_square(new_P, A, B, size=0.35, color=CHALK_BLUE)
            new_angle_label = MathTex(r"90°", color=CHALK_WHITE, font_size=28)
            new_angle_label.next_to(new_right_angle, UR, buff=0.1)

            self.play(
                Transform(dot_P, new_dot_P),
                Transform(label_P, new_label_P),
                Transform(line_PA, new_line_PA),
                Transform(line_PB, new_line_PB),
                Transform(right_angle_square, new_right_angle),
                Transform(angle_label, new_angle_label),
                run_time=1.2
            )
            self.wait(0.3)

        # Final explanation
        self.play(FadeOut(explanation))

        final_text = VGroup(
            Text("The angle is ALWAYS 90°", color=CHALK_YELLOW, font_size=28, weight=BOLD),
            MathTex(r"\angle APB = 90°", color=CHALK_WHITE, font_size=36),
            Text("when AB is a diameter", color=CHALK_WHITE, font_size=22)
        ).arrange(DOWN, buff=0.3)
        final_text.to_edge(DOWN, buff=0.5)

        self.play(Write(final_text[0]))
        self.play(Write(final_text[1]))
        self.play(Write(final_text[2]))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# CYCLIC QUADRILATERAL - With Opposite Angles Animation
# ============================================================

class CyclicQuadrilateralV2(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Cyclic Quadrilateral",
            "Opposite angles sum to 180°"
        )
        self.wait(0.5)

        # Circle
        circle = Circle(radius=2.2, color=CHALK_WHITE, stroke_width=3)
        circle.shift(DOWN * 0.3 + LEFT * 1)
        center = circle.get_center()

        self.play(Create(circle))

        # Four points on circle
        angles = [PI * 0.1, PI * 0.5, PI * 1.05, PI * 1.55]
        points = [center + 2.2 * np.array([np.cos(a), np.sin(a), 0]) for a in angles]
        A, B, C, D = points

        # Dots and labels
        dots = VGroup(*[Dot(p, color=CHALK_YELLOW, radius=0.1) for p in points])
        labels = VGroup(
            Text("A", font_size=24, color=CHALK_YELLOW).next_to(A, UR, buff=0.1),
            Text("B", font_size=24, color=CHALK_YELLOW).next_to(B, UP, buff=0.1),
            Text("C", font_size=24, color=CHALK_YELLOW).next_to(C, DL, buff=0.1),
            Text("D", font_size=24, color=CHALK_YELLOW).next_to(D, DOWN, buff=0.1),
        )

        self.play(LaggedStart(*[FadeIn(d) for d in dots], lag_ratio=0.15))
        self.play(LaggedStart(*[Write(l) for l in labels], lag_ratio=0.15))

        # Quadrilateral sides
        sides = VGroup(
            Line(A, B, color=CHALK_GREEN, stroke_width=3),
            Line(B, C, color=CHALK_GREEN, stroke_width=3),
            Line(C, D, color=CHALK_GREEN, stroke_width=3),
            Line(D, A, color=CHALK_GREEN, stroke_width=3),
        )

        self.play(LaggedStart(*[Create(s) for s in sides], lag_ratio=0.15))

        # SHADED ANGLE A (opposite to C)
        wedge_A = self.create_angle_wedge(A, D, B, radius=0.4, color=CHALK_RED, fill_opacity=0.5)
        label_alpha = MathTex(r"\alpha", color=CHALK_RED, font_size=26).move_to(A + LEFT * 0.5 + DOWN * 0.3)

        self.play(FadeIn(wedge_A), Write(label_alpha))

        # SHADED ANGLE C (opposite to A)
        wedge_C = self.create_angle_wedge(C, B, D, radius=0.4, color=CHALK_BLUE, fill_opacity=0.5)
        label_beta = MathTex(r"\beta", color=CHALK_BLUE, font_size=26).move_to(C + RIGHT * 0.5 + UP * 0.3)

        self.play(FadeIn(wedge_C), Write(label_beta))
        self.wait(0.5)

        # ===== KEY ANIMATION: Move angles together to show they sum to 180° =====
        explanation = Text(
            "Opposite angles α and β together form...",
            color=CHALK_WHITE, font_size=22
        ).to_edge(DOWN, buff=1.0)

        self.play(Write(explanation))

        # Create copies to animate
        wedge_A_copy = wedge_A.copy()
        wedge_C_copy = wedge_C.copy()

        # Target position - show them forming a straight line (180°)
        target_pos = RIGHT * 3 + DOWN * 0.5

        # Move both wedges to target
        self.play(
            wedge_A_copy.animate.move_to(target_pos + LEFT * 0.3),
            wedge_C_copy.animate.move_to(target_pos + LEFT * 0.3),
            run_time=1.5
        )

        # Rotate C's wedge to align with A's to show they form 180°
        self.play(
            wedge_C_copy.animate.rotate(PI, about_point=target_pos + LEFT * 0.3).shift(RIGHT * 0.5),
            run_time=1.5
        )

        # Draw a straight line to show 180°
        straight_line = Line(
            target_pos + LEFT * 1,
            target_pos + RIGHT * 1,
            color=CHALK_YELLOW,
            stroke_width=4
        )

        label_180 = MathTex(r"180°", color=CHALK_YELLOW, font_size=36).next_to(straight_line, UP, buff=0.3)

        self.play(Create(straight_line), Write(label_180))

        # Update explanation
        self.play(FadeOut(explanation))

        equation1 = MathTex(r"\alpha + \beta = 180°", color=CHALK_WHITE, font_size=36)
        equation1.next_to(straight_line, DOWN, buff=0.5)

        self.play(Write(equation1))

        # Now show B and D as well
        self.wait(1)

        # Fade out the animated copies
        self.play(FadeOut(wedge_A_copy), FadeOut(wedge_C_copy), FadeOut(straight_line), FadeOut(label_180))

        # SHADED ANGLE B
        wedge_B = self.create_angle_wedge(B, A, C, radius=0.4, color=CHALK_ORANGE, fill_opacity=0.5)
        label_gamma = MathTex(r"\gamma", color=CHALK_ORANGE, font_size=26).move_to(B + DOWN * 0.5)

        # SHADED ANGLE D
        wedge_D = self.create_angle_wedge(D, C, A, radius=0.4, color=CHALK_PINK, fill_opacity=0.5)
        label_delta = MathTex(r"\delta", color=CHALK_PINK, font_size=26).move_to(D + UP * 0.5)

        self.play(
            FadeIn(wedge_B), Write(label_gamma),
            FadeIn(wedge_D), Write(label_delta)
        )

        equation2 = MathTex(r"\gamma + \delta = 180°", color=CHALK_WHITE, font_size=36)
        equation2.next_to(equation1, DOWN, buff=0.3)

        self.play(Write(equation2))

        # Final summary
        summary_box = VGroup(equation1.copy(), equation2.copy())
        summary_box.arrange(DOWN, buff=0.2)
        box_rect = SurroundingRectangle(summary_box, color=CHALK_YELLOW, buff=0.2, stroke_width=2)

        self.play(
            equation1.animate.move_to(summary_box[0]),
            equation2.animate.move_to(summary_box[1]),
        )
        self.play(Create(box_rect))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# ALTERNATE SEGMENT THEOREM - With Angle Overlay
# ============================================================

class AlternateSegmentTheoremV2(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Alternate Segment Theorem",
            "Angle between tangent and chord = inscribed angle"
        )
        self.wait(0.5)

        # Circle
        circle = Circle(radius=2, color=CHALK_WHITE, stroke_width=3)
        circle.shift(DOWN * 0.3 + LEFT * 0.5)
        center = circle.get_center()

        self.play(Create(circle))

        # Point of tangency
        T_angle = -PI * 0.25
        T = circle.point_at_angle(T_angle)
        dot_T = Dot(T, color=CHALK_YELLOW, radius=0.1)
        label_T = Text("T", color=CHALK_YELLOW, font_size=24).next_to(dot_T, DR, buff=0.1)

        self.play(FadeIn(dot_T), Write(label_T))

        # Tangent line at T
        tangent_dir = np.array([np.sin(-T_angle), np.cos(-T_angle), 0])
        tangent_start = T - tangent_dir * 2.5
        tangent_end = T + tangent_dir * 2.5
        tangent = Line(tangent_start, tangent_end, color=CHALK_GREEN, stroke_width=3)

        self.play(Create(tangent))

        # Chord from T to A
        A = circle.point_at_angle(PI * 0.55)
        dot_A = Dot(A, color=CHALK_YELLOW, radius=0.1)
        label_A = Text("A", color=CHALK_YELLOW, font_size=24).next_to(dot_A, UP, buff=0.1)

        chord_TA = Line(T, A, color=CHALK_BLUE, stroke_width=3)

        self.play(FadeIn(dot_A), Write(label_A))
        self.play(Create(chord_TA))

        # SHADED ANGLE between tangent and chord
        wedge_tangent = self.create_angle_wedge(T, tangent_end, A, radius=0.5, color=CHALK_RED, fill_opacity=0.5)
        label_alpha1 = MathTex(r"\alpha", color=CHALK_RED, font_size=28).move_to(T + UP * 0.5 + RIGHT * 0.6)

        self.play(FadeIn(wedge_tangent), Write(label_alpha1))
        self.wait(0.5)

        # Point B in alternate segment
        B = circle.point_at_angle(PI * 1.4)
        dot_B = Dot(B, color=CHALK_PINK, radius=0.1)
        label_B = Text("B", color=CHALK_PINK, font_size=24).next_to(dot_B, LEFT, buff=0.1)

        line_BT = Line(B, T, color=CHALK_PINK, stroke_width=2)
        line_BA = Line(B, A, color=CHALK_PINK, stroke_width=2)

        self.play(FadeIn(dot_B), Write(label_B))
        self.play(Create(line_BT), Create(line_BA))

        # SHADED inscribed angle at B
        wedge_inscribed = self.create_angle_wedge(B, T, A, radius=0.45, color=CHALK_PURPLE, fill_opacity=0.5)
        label_alpha2 = MathTex(r"\alpha", color=CHALK_PURPLE, font_size=28).move_to(B + RIGHT * 0.6)

        self.play(FadeIn(wedge_inscribed), Write(label_alpha2))
        self.wait(0.5)

        # ===== KEY ANIMATION: Move the inscribed angle to overlay on tangent-chord angle =====
        explanation = Text(
            "These two angles are EQUAL!",
            color=CHALK_YELLOW, font_size=24
        ).to_edge(DOWN, buff=0.8)

        self.play(Write(explanation))

        # Create copy of inscribed wedge and move it
        wedge_copy = wedge_inscribed.copy()
        wedge_copy.set_color(CHALK_WHITE)
        wedge_copy.set_fill(CHALK_WHITE, opacity=0.7)

        self.play(
            wedge_copy.animate.move_to(wedge_tangent.get_center()),
            run_time=2
        )

        # Flash effect
        self.play(
            wedge_copy.animate.set_fill(CHALK_YELLOW, opacity=1),
            wedge_tangent.animate.set_fill(CHALK_YELLOW, opacity=1),
            run_time=0.3
        )
        self.play(
            wedge_copy.animate.set_fill(CHALK_WHITE, opacity=0.5),
            wedge_tangent.animate.set_fill(CHALK_RED, opacity=0.5),
            run_time=0.3
        )

        # Formula
        self.play(FadeOut(wedge_copy), FadeOut(explanation))

        formula = VGroup(
            Text("Tangent-Chord Angle", color=CHALK_RED, font_size=22),
            MathTex(r"=", color=CHALK_WHITE, font_size=36),
            Text("Inscribed Angle", color=CHALK_PURPLE, font_size=22),
        ).arrange(RIGHT, buff=0.3)
        formula.to_edge(DOWN, buff=0.6)

        formula2 = MathTex(r"\alpha = \alpha", color=CHALK_YELLOW, font_size=36)
        formula2.next_to(formula, DOWN, buff=0.3)

        self.play(Write(formula))
        self.play(Write(formula2))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# SUMMARY SCENE
# ============================================================

class CircleTheoremsSummaryV2(ChalkboardScene):
    def construct(self):
        title = Text("Circle Theorems - Key Takeaways", color=CHALK_YELLOW, font_size=44, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        underline = Line(title.get_left() + DOWN * 0.2, title.get_right() + DOWN * 0.2, color=CHALK_YELLOW)

        self.play(Write(title), Create(underline))

        theorems = [
            ("Central Angle", "= 2 × Inscribed Angle", CHALK_RED),
            ("Same Arc Angles", "All inscribed angles equal", CHALK_GREEN),
            ("Semicircle", "Always 90° (Thales)", CHALK_BLUE),
            ("Cyclic Quad", "Opposite angles = 180°", CHALK_ORANGE),
            ("Tangent ⊥ Radius", "Perpendicular at contact", CHALK_PINK),
            ("Alternate Segment", "Tangent-chord = inscribed", CHALK_PURPLE),
        ]

        theorem_group = VGroup()
        for name, desc, color in theorems:
            # Create a small colored wedge as icon
            icon = Sector(
                outer_radius=0.2,
                inner_radius=0,
                angle=PI/3,
                color=color,
                fill_opacity=0.7,
                stroke_width=0
            )

            row = VGroup(
                icon,
                Text(name, color=color, font_size=24),
                Text(desc, color=CHALK_WHITE, font_size=20)
            ).arrange(RIGHT, buff=0.4)
            theorem_group.add(row)

        theorem_group.arrange(DOWN, aligned_edge=LEFT, buff=0.35)
        theorem_group.next_to(underline, DOWN, buff=0.6).shift(LEFT * 1)

        for row in theorem_group:
            self.play(FadeIn(row[0]), Write(row[1]), Write(row[2]), run_time=0.7)

        # Decorative circle
        circle = Circle(radius=1.3, color=CHALK_WHITE, stroke_width=2)
        circle.to_edge(RIGHT, buff=0.8).shift(DOWN * 0.5)

        # Add some decorative points and angles
        points = VGroup(*[
            Dot(circle.point_at_angle(i * PI/3), color=CHALK_YELLOW, radius=0.06)
            for i in range(6)
        ])

        self.play(Create(circle), LaggedStart(*[FadeIn(p) for p in points], lag_ratio=0.1))

        # Closing message
        closing = Text(
            "Practice drawing these to master them!",
            color=CHALK_YELLOW, font_size=26
        ).to_edge(DOWN, buff=0.4)

        self.play(Write(closing))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])
