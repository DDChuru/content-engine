"""
Circle Geometry Theorems - Chalkboard Style (V3)
Fixed angle positioning - wedges properly rotate and align when overlaying
"""

from manim import *
import numpy as np

# ============================================================
# CHALKBOARD THEME
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


def angle_of_vector(v):
    """Get angle of a 2D/3D vector from positive x-axis"""
    return np.arctan2(v[1], v[0])


def normalize(v):
    """Normalize a vector"""
    n = np.linalg.norm(v)
    return v / n if n > 0 else v


class ChalkboardScene(Scene):
    def setup(self):
        self.camera.background_color = CHALKBOARD_BG

    def create_angle_wedge(self, vertex, point1, point2, radius=0.5, color=CHALK_YELLOW, fill_opacity=0.5):
        """
        Create a properly oriented angle wedge.
        Returns the wedge and the angle value.
        """
        vertex = np.array(vertex)
        p1 = np.array(point1)
        p2 = np.array(point2)

        # Direction vectors from vertex
        dir1 = normalize(p1 - vertex)
        dir2 = normalize(p2 - vertex)

        # Angles from positive x-axis
        angle1 = angle_of_vector(dir1)
        angle2 = angle_of_vector(dir2)

        # Calculate the angle between them (always positive, smaller angle)
        angle_diff = angle2 - angle1

        # Normalize to [-PI, PI]
        while angle_diff > PI:
            angle_diff -= 2 * PI
        while angle_diff < -PI:
            angle_diff += 2 * PI

        # Create sector - use the smaller sweep
        start_angle = angle1 if angle_diff > 0 else angle2
        sweep = abs(angle_diff)

        # Generate arc points for polygon
        num_points = max(10, int(sweep * 20))
        angles = np.linspace(start_angle, start_angle + sweep, num_points)
        arc_points = [vertex + radius * np.array([np.cos(a), np.sin(a), 0]) for a in angles]

        # Create polygon: vertex -> arc -> back to vertex
        all_points = [vertex] + arc_points

        wedge = Polygon(
            *all_points,
            color=color,
            fill_color=color,
            fill_opacity=fill_opacity,
            stroke_width=2,
            stroke_color=color
        )

        # Store metadata for later transformations
        wedge.vertex = vertex.copy()
        wedge.start_angle = start_angle
        wedge.sweep_angle = sweep
        wedge.wedge_radius = radius

        return wedge, sweep

    def create_wedge_at_vertex(self, vertex, start_angle, sweep_angle, radius=0.5, color=CHALK_YELLOW, fill_opacity=0.5):
        """
        Create a wedge at a specific vertex with given start angle and sweep.
        This allows precise positioning.
        """
        vertex = np.array(vertex)

        num_points = max(10, int(sweep_angle * 20))
        angles = np.linspace(start_angle, start_angle + sweep_angle, num_points)
        arc_points = [vertex + radius * np.array([np.cos(a), np.sin(a), 0]) for a in angles]

        all_points = [vertex] + arc_points

        wedge = Polygon(
            *all_points,
            color=color,
            fill_color=color,
            fill_opacity=fill_opacity,
            stroke_width=2,
            stroke_color=color
        )

        wedge.vertex = vertex.copy()
        wedge.start_angle = start_angle
        wedge.sweep_angle = sweep_angle
        wedge.wedge_radius = radius

        return wedge

    def draw_theorem_title(self, title, subtitle=None):
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
# CENTRAL ANGLE THEOREM - FIXED
# ============================================================

class CentralAngleTheoremV3(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Central Angle Theorem",
            "The central angle is twice the inscribed angle"
        )
        self.wait(0.5)

        # Circle setup
        circle = Circle(radius=2, color=CHALK_WHITE, stroke_width=3)
        circle.shift(DOWN * 0.5 + LEFT * 0.5)
        center = circle.get_center()
        O = center

        # Points - carefully chosen for clear visualization
        angle_A = PI * 0.2
        angle_B = PI * 0.8
        angle_P = PI * 1.5  # Bottom of circle

        A = center + 2 * np.array([np.cos(angle_A), np.sin(angle_A), 0])
        B = center + 2 * np.array([np.cos(angle_B), np.sin(angle_B), 0])
        P = center + 2 * np.array([np.cos(angle_P), np.sin(angle_P), 0])

        # Calculate the actual angles
        vec_OA = A - O
        vec_OB = B - O
        vec_PA = A - P
        vec_PB = B - P

        # Central angle (at O, from OA to OB)
        central_start = angle_of_vector(vec_OA)
        central_end = angle_of_vector(vec_OB)
        central_sweep = central_end - central_start
        if central_sweep < 0:
            central_sweep += 2 * PI

        # Inscribed angle (at P, from PA to PB)
        inscribed_start = angle_of_vector(vec_PA)
        inscribed_end = angle_of_vector(vec_PB)
        inscribed_sweep = inscribed_end - inscribed_start
        if inscribed_sweep < 0:
            inscribed_sweep += 2 * PI
        if inscribed_sweep > PI:
            inscribed_sweep = 2 * PI - inscribed_sweep
            inscribed_start = inscribed_end

        # Create dots and labels
        dot_A = Dot(A, color=CHALK_YELLOW, radius=0.1)
        dot_B = Dot(B, color=CHALK_YELLOW, radius=0.1)
        dot_P = Dot(P, color=CHALK_GREEN, radius=0.1)
        dot_O = Dot(O, color=CHALK_RED, radius=0.1)

        label_A = Text("A", color=CHALK_YELLOW, font_size=24).next_to(dot_A, UR, buff=0.1)
        label_B = Text("B", color=CHALK_YELLOW, font_size=24).next_to(dot_B, UL, buff=0.1)
        label_P = Text("P", color=CHALK_GREEN, font_size=24).next_to(dot_P, DOWN, buff=0.1)
        label_O = Text("O", color=CHALK_RED, font_size=24).next_to(dot_O, DL, buff=0.1)

        # Draw circle and points
        self.play(Create(circle), run_time=1.5)
        self.play(
            FadeIn(dot_O), Write(label_O),
            FadeIn(dot_A), Write(label_A),
            FadeIn(dot_B), Write(label_B),
        )

        # Arc AB
        arc_AB = Arc(
            radius=2,
            start_angle=angle_A,
            angle=angle_B - angle_A,
            color=CHALK_ORANGE,
            stroke_width=6
        ).shift(center)

        self.play(Create(arc_AB))

        # Central angle lines and shaded wedge
        line_OA = Line(O, A, color=CHALK_RED, stroke_width=3)
        line_OB = Line(O, B, color=CHALK_RED, stroke_width=3)
        self.play(Create(line_OA), Create(line_OB))

        # Central angle wedge - using exact angles
        central_wedge = self.create_wedge_at_vertex(
            O, central_start, central_sweep,
            radius=0.8, color=CHALK_RED, fill_opacity=0.4
        )
        central_label = MathTex(r"2\theta", color=CHALK_RED, font_size=32)
        central_label.move_to(O + UP * 1.1)

        self.play(FadeIn(central_wedge), Write(central_label))
        self.wait(0.5)

        # Add point P and inscribed angle
        self.play(FadeIn(dot_P), Write(label_P))

        line_PA = Line(P, A, color=CHALK_GREEN, stroke_width=3)
        line_PB = Line(P, B, color=CHALK_GREEN, stroke_width=3)
        self.play(Create(line_PA), Create(line_PB))

        # Inscribed angle wedge - using exact angles
        inscribed_wedge = self.create_wedge_at_vertex(
            P, inscribed_start, inscribed_sweep,
            radius=0.5, color=CHALK_GREEN, fill_opacity=0.5
        )
        inscribed_label = MathTex(r"\theta", color=CHALK_GREEN, font_size=28)
        inscribed_label.move_to(P + UP * 0.7)

        self.play(FadeIn(inscribed_wedge), Write(inscribed_label))
        self.wait(1)

        # ===== KEY ANIMATION: Show inscribed angle fits TWICE into central angle =====

        explanation = Text(
            "The inscribed angle θ fits exactly TWICE into the central angle 2θ",
            color=CHALK_WHITE, font_size=20
        ).to_edge(DOWN, buff=0.8)

        self.play(Write(explanation))
        self.wait(0.5)

        # Create first copy - will fill first half of central angle
        # Position it at O, rotated to align with the start of central angle
        copy1 = self.create_wedge_at_vertex(
            O, central_start, inscribed_sweep,  # Same sweep as inscribed, but at O starting from OA direction
            radius=0.75, color=CHALK_BLUE, fill_opacity=0.6
        )

        # Create second copy - fills second half
        copy2 = self.create_wedge_at_vertex(
            O, central_start + inscribed_sweep, inscribed_sweep,  # Starts where first copy ends
            radius=0.75, color=CHALK_PURPLE, fill_opacity=0.6
        )

        # Animate: First, show the inscribed wedge "flying" to become copy1
        # We'll fade in copy1 while highlighting the connection

        self.play(
            inscribed_wedge.animate.set_fill(CHALK_BLUE, opacity=0.8),
            run_time=0.3
        )

        # Show copy1 appearing at the central angle (first half)
        self.play(
            FadeIn(copy1, shift=UP * 0.5),
            inscribed_wedge.animate.set_fill(CHALK_GREEN, opacity=0.5),
            run_time=1
        )

        theta1_label = MathTex(r"\theta", color=CHALK_BLUE, font_size=24)
        theta1_label.move_to(O + 0.5 * np.array([np.cos(central_start + inscribed_sweep/2),
                                                   np.sin(central_start + inscribed_sweep/2), 0]))
        self.play(Write(theta1_label))

        self.wait(0.5)

        # Show copy2 appearing (second half)
        self.play(
            inscribed_wedge.animate.set_fill(CHALK_PURPLE, opacity=0.8),
            run_time=0.3
        )

        self.play(
            FadeIn(copy2, shift=UP * 0.5),
            inscribed_wedge.animate.set_fill(CHALK_GREEN, opacity=0.5),
            run_time=1
        )

        theta2_label = MathTex(r"\theta", color=CHALK_PURPLE, font_size=24)
        theta2_label.move_to(O + 0.5 * np.array([np.cos(central_start + inscribed_sweep * 1.5),
                                                   np.sin(central_start + inscribed_sweep * 1.5), 0]))
        self.play(Write(theta2_label))

        self.wait(0.5)

        # Flash to show they fill it exactly
        self.play(
            copy1.animate.set_fill(CHALK_YELLOW, opacity=0.9),
            copy2.animate.set_fill(CHALK_YELLOW, opacity=0.9),
            run_time=0.2
        )
        self.play(
            copy1.animate.set_fill(CHALK_BLUE, opacity=0.6),
            copy2.animate.set_fill(CHALK_PURPLE, opacity=0.6),
            run_time=0.2
        )

        # Formula
        self.play(FadeOut(explanation))

        formula = VGroup(
            MathTex(r"\theta + \theta = 2\theta", color=CHALK_YELLOW, font_size=40),
            Text("Central angle = 2 × Inscribed angle", color=CHALK_WHITE, font_size=22)
        ).arrange(DOWN, buff=0.2)
        formula.to_edge(RIGHT, buff=0.4).shift(DOWN * 0.5)

        box = SurroundingRectangle(formula, color=CHALK_YELLOW, buff=0.2, stroke_width=2)

        self.play(Write(formula[0]))
        self.play(Write(formula[1]), Create(box))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# INSCRIBED ANGLE THEOREM - FIXED
# ============================================================

class InscribedAngleTheoremV3(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Inscribed Angle Theorem",
            "All inscribed angles on the same arc are equal"
        )
        self.wait(0.5)

        # Circle
        circle = Circle(radius=2.2, color=CHALK_WHITE, stroke_width=3)
        circle.shift(DOWN * 0.3 + LEFT * 1)
        center = circle.get_center()

        # Fixed points A and B on the arc
        angle_A = PI * 0.15
        angle_B = PI * 0.75

        A = center + 2.2 * np.array([np.cos(angle_A), np.sin(angle_A), 0])
        B = center + 2.2 * np.array([np.cos(angle_B), np.sin(angle_B), 0])

        # Multiple points for inscribed angles (on the opposite arc)
        angle_P1 = PI * 1.2
        angle_P2 = PI * 1.5
        angle_P3 = PI * 1.8

        P1 = center + 2.2 * np.array([np.cos(angle_P1), np.sin(angle_P1), 0])
        P2 = center + 2.2 * np.array([np.cos(angle_P2), np.sin(angle_P2), 0])
        P3 = center + 2.2 * np.array([np.cos(angle_P3), np.sin(angle_P3), 0])

        self.play(Create(circle))

        # Arc AB (the arc that all inscribed angles subtend)
        arc_AB = Arc(
            radius=2.2,
            start_angle=angle_A,
            angle=angle_B - angle_A,
            color=CHALK_ORANGE,
            stroke_width=6
        ).shift(center)

        # Points and labels
        dot_A = Dot(A, color=CHALK_YELLOW, radius=0.1)
        dot_B = Dot(B, color=CHALK_YELLOW, radius=0.1)
        label_A = Text("A", font_size=24, color=CHALK_YELLOW).next_to(A, UR, buff=0.1)
        label_B = Text("B", font_size=24, color=CHALK_YELLOW).next_to(B, UP, buff=0.1)

        self.play(FadeIn(dot_A), FadeIn(dot_B), Write(label_A), Write(label_B))
        self.play(Create(arc_AB))

        # Helper function to get inscribed angle parameters
        def get_inscribed_angle_params(P):
            vec_PA = A - P
            vec_PB = B - P
            start = angle_of_vector(vec_PA)
            end = angle_of_vector(vec_PB)
            sweep = end - start
            # Take the smaller angle
            if sweep > PI:
                sweep -= 2 * PI
            if sweep < -PI:
                sweep += 2 * PI
            if sweep < 0:
                start, sweep = start + sweep, -sweep
            return start, abs(sweep)

        # ===== First angle at P1 =====
        dot_P1 = Dot(P1, color=CHALK_GREEN, radius=0.1)
        label_P1 = Text("P₁", font_size=22, color=CHALK_GREEN).next_to(P1, DL, buff=0.1)
        line_P1A = Line(P1, A, color=CHALK_GREEN, stroke_width=2)
        line_P1B = Line(P1, B, color=CHALK_GREEN, stroke_width=2)

        self.play(FadeIn(dot_P1), Write(label_P1))
        self.play(Create(line_P1A), Create(line_P1B))

        start1, sweep1 = get_inscribed_angle_params(P1)
        wedge_P1 = self.create_wedge_at_vertex(P1, start1, sweep1, radius=0.45, color=CHALK_GREEN, fill_opacity=0.5)
        theta1 = MathTex(r"\theta", color=CHALK_GREEN, font_size=24)
        theta1.move_to(P1 + 0.7 * np.array([np.cos(start1 + sweep1/2), np.sin(start1 + sweep1/2), 0]))

        self.play(FadeIn(wedge_P1), Write(theta1))

        # ===== Second angle at P2 =====
        dot_P2 = Dot(P2, color=CHALK_BLUE, radius=0.1)
        label_P2 = Text("P₂", font_size=22, color=CHALK_BLUE).next_to(P2, DOWN, buff=0.1)
        line_P2A = Line(P2, A, color=CHALK_BLUE, stroke_width=2)
        line_P2B = Line(P2, B, color=CHALK_BLUE, stroke_width=2)

        self.play(FadeIn(dot_P2), Write(label_P2))
        self.play(Create(line_P2A), Create(line_P2B))

        start2, sweep2 = get_inscribed_angle_params(P2)
        wedge_P2 = self.create_wedge_at_vertex(P2, start2, sweep2, radius=0.45, color=CHALK_BLUE, fill_opacity=0.5)
        theta2 = MathTex(r"\theta", color=CHALK_BLUE, font_size=24)
        theta2.move_to(P2 + 0.7 * np.array([np.cos(start2 + sweep2/2), np.sin(start2 + sweep2/2), 0]))

        self.play(FadeIn(wedge_P2), Write(theta2))

        self.wait(0.5)

        # ===== KEY ANIMATION: Create matching wedge at P2's position using P1's angle =====
        explanation = Text(
            "These angles are the SAME size - watch!",
            color=CHALK_YELLOW, font_size=24
        ).to_edge(DOWN, buff=0.8)

        self.play(Write(explanation))

        # Create a wedge at P2 with the SAME visual appearance as P1's wedge
        # This shows they're equal by creating an identical shape at P2
        overlay_wedge = self.create_wedge_at_vertex(
            P2, start2, sweep1,  # Same sweep as P1
            radius=0.45, color=CHALK_PINK, fill_opacity=0.7
        )

        # Animate from P1 to P2
        # First highlight P1's wedge
        self.play(wedge_P1.animate.set_fill(CHALK_WHITE, opacity=0.9), run_time=0.3)

        # Create a visual "copy" that moves
        moving_wedge = wedge_P1.copy()
        self.add(moving_wedge)

        self.play(wedge_P1.animate.set_fill(CHALK_GREEN, opacity=0.5), run_time=0.2)

        # Move and transform to overlay position
        self.play(
            Transform(moving_wedge, overlay_wedge),
            run_time=1.5,
            rate_func=smooth
        )

        # Flash to show match
        self.play(
            wedge_P2.animate.set_fill(CHALK_WHITE, opacity=0.9),
            moving_wedge.animate.set_fill(CHALK_WHITE, opacity=0.9),
            run_time=0.2
        )
        self.play(
            wedge_P2.animate.set_fill(CHALK_BLUE, opacity=0.5),
            moving_wedge.animate.set_fill(CHALK_PINK, opacity=0.5),
            run_time=0.3
        )

        self.play(FadeOut(moving_wedge))

        # ===== Third angle at P3 =====
        self.play(FadeOut(explanation))

        dot_P3 = Dot(P3, color=CHALK_PURPLE, radius=0.1)
        label_P3 = Text("P₃", font_size=22, color=CHALK_PURPLE).next_to(P3, DR, buff=0.1)
        line_P3A = Line(P3, A, color=CHALK_PURPLE, stroke_width=2)
        line_P3B = Line(P3, B, color=CHALK_PURPLE, stroke_width=2)

        self.play(FadeIn(dot_P3), Write(label_P3))
        self.play(Create(line_P3A), Create(line_P3B))

        start3, sweep3 = get_inscribed_angle_params(P3)
        wedge_P3 = self.create_wedge_at_vertex(P3, start3, sweep3, radius=0.45, color=CHALK_PURPLE, fill_opacity=0.5)
        theta3 = MathTex(r"\theta", color=CHALK_PURPLE, font_size=24)
        theta3.move_to(P3 + 0.65 * np.array([np.cos(start3 + sweep3/2), np.sin(start3 + sweep3/2), 0]))

        self.play(FadeIn(wedge_P3), Write(theta3))

        # Final formula
        formula = MathTex(
            r"\angle AP_1B = \angle AP_2B = \angle AP_3B",
            color=CHALK_WHITE, font_size=32
        ).to_edge(DOWN, buff=0.6)

        conclusion = Text("All equal to θ", color=CHALK_YELLOW, font_size=24)
        conclusion.next_to(formula, DOWN, buff=0.2)

        self.play(Write(formula))
        self.play(Write(conclusion))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# CYCLIC QUADRILATERAL - FIXED
# ============================================================

class CyclicQuadrilateralV3(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Cyclic Quadrilateral",
            "Opposite angles sum to 180°"
        )
        self.wait(0.5)

        # Circle
        circle = Circle(radius=2.2, color=CHALK_WHITE, stroke_width=3)
        circle.shift(DOWN * 0.2 + LEFT * 1)
        center = circle.get_center()

        self.play(Create(circle))

        # Four points
        angles = [PI * 0.1, PI * 0.45, PI * 1.0, PI * 1.5]
        A = center + 2.2 * np.array([np.cos(angles[0]), np.sin(angles[0]), 0])
        B = center + 2.2 * np.array([np.cos(angles[1]), np.sin(angles[1]), 0])
        C = center + 2.2 * np.array([np.cos(angles[2]), np.sin(angles[2]), 0])
        D = center + 2.2 * np.array([np.cos(angles[3]), np.sin(angles[3]), 0])

        # Dots and labels
        dots = VGroup(
            Dot(A, color=CHALK_YELLOW, radius=0.1),
            Dot(B, color=CHALK_YELLOW, radius=0.1),
            Dot(C, color=CHALK_YELLOW, radius=0.1),
            Dot(D, color=CHALK_YELLOW, radius=0.1),
        )
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

        # Calculate angle at A (between DA and AB)
        vec_AD = D - A
        vec_AB = B - A
        start_A = angle_of_vector(vec_AD)
        end_A = angle_of_vector(vec_AB)
        sweep_A = end_A - start_A
        if sweep_A < 0:
            sweep_A += 2 * PI
        if sweep_A > PI:
            # Take the interior angle
            start_A = end_A
            sweep_A = 2 * PI - sweep_A

        # Calculate angle at C (between BC and CD)
        vec_CB = B - C
        vec_CD = D - C
        start_C = angle_of_vector(vec_CB)
        end_C = angle_of_vector(vec_CD)
        sweep_C = end_C - start_C
        if sweep_C < 0:
            sweep_C += 2 * PI
        if sweep_C > PI:
            start_C = end_C
            sweep_C = 2 * PI - sweep_C

        # Shaded angle A
        wedge_A = self.create_wedge_at_vertex(A, start_A, sweep_A, radius=0.4, color=CHALK_RED, fill_opacity=0.5)
        label_alpha = MathTex(r"\alpha", color=CHALK_RED, font_size=26)
        label_alpha.move_to(A + 0.6 * np.array([np.cos(start_A + sweep_A/2), np.sin(start_A + sweep_A/2), 0]))

        self.play(FadeIn(wedge_A), Write(label_alpha))

        # Shaded angle C
        wedge_C = self.create_wedge_at_vertex(C, start_C, sweep_C, radius=0.4, color=CHALK_BLUE, fill_opacity=0.5)
        label_beta = MathTex(r"\beta", color=CHALK_BLUE, font_size=26)
        label_beta.move_to(C + 0.6 * np.array([np.cos(start_C + sweep_C/2), np.sin(start_C + sweep_C/2), 0]))

        self.play(FadeIn(wedge_C), Write(label_beta))
        self.wait(0.5)

        # ===== KEY ANIMATION: Show angles form 180° =====
        explanation = Text(
            "Together, opposite angles form a straight line (180°)",
            color=CHALK_WHITE, font_size=20
        ).to_edge(DOWN, buff=1.0)

        self.play(Write(explanation))

        # Target position for demonstration
        demo_pos = RIGHT * 3.5 + DOWN * 0.3

        # Create copies of wedges that will be animated
        # Position them at demo_pos, with alpha starting from left (pointing right)
        # and beta rotated to continue from where alpha ends

        # Alpha wedge at demo position, opening to the right (start at 0)
        demo_alpha = self.create_wedge_at_vertex(
            demo_pos, 0, sweep_A,
            radius=0.6, color=CHALK_RED, fill_opacity=0.6
        )

        # Beta wedge at demo position, starting where alpha ends
        demo_beta = self.create_wedge_at_vertex(
            demo_pos, sweep_A, sweep_C,
            radius=0.6, color=CHALK_BLUE, fill_opacity=0.6
        )

        # Animate wedge_A copy moving to demo position
        copy_A = wedge_A.copy()
        copy_A.set_fill(CHALK_RED, opacity=0.7)
        self.add(copy_A)

        self.play(
            Transform(copy_A, demo_alpha),
            run_time=1.5
        )

        # Animate wedge_C copy moving and rotating to demo position
        copy_C = wedge_C.copy()
        copy_C.set_fill(CHALK_BLUE, opacity=0.7)
        self.add(copy_C)

        self.play(
            Transform(copy_C, demo_beta),
            run_time=1.5
        )

        # Draw a straight line underneath to show 180°
        line_180 = Line(
            demo_pos + LEFT * 0.8,
            demo_pos + RIGHT * 0.8,
            color=CHALK_YELLOW,
            stroke_width=4
        ).shift(DOWN * 0.15)

        label_180 = MathTex(r"180°", color=CHALK_YELLOW, font_size=32)
        label_180.next_to(line_180, DOWN, buff=0.3)

        self.play(Create(line_180), Write(label_180))

        # Flash effect
        self.play(
            copy_A.animate.set_fill(CHALK_WHITE, opacity=0.9),
            copy_C.animate.set_fill(CHALK_WHITE, opacity=0.9),
            run_time=0.2
        )
        self.play(
            copy_A.animate.set_fill(CHALK_RED, opacity=0.6),
            copy_C.animate.set_fill(CHALK_BLUE, opacity=0.6),
            run_time=0.3
        )

        # Formula
        equation = MathTex(r"\alpha + \beta = 180°", color=CHALK_WHITE, font_size=36)
        equation.next_to(label_180, DOWN, buff=0.4)

        self.play(Write(equation))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# THALES THEOREM (Angle in Semicircle) - FIXED
# ============================================================

class AngleInSemicircleV3(ChalkboardScene):
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

        # Diameter
        A = center + LEFT * 2.2
        B = center + RIGHT * 2.2

        self.play(Create(circle))

        diameter = Line(A, B, color=CHALK_YELLOW, stroke_width=4)
        dot_A = Dot(A, color=CHALK_YELLOW, radius=0.1)
        dot_B = Dot(B, color=CHALK_YELLOW, radius=0.1)
        dot_O = Dot(center, color=CHALK_RED, radius=0.08)

        label_A = Text("A", color=CHALK_YELLOW, font_size=24).next_to(A, LEFT, buff=0.1)
        label_B = Text("B", color=CHALK_YELLOW, font_size=24).next_to(B, RIGHT, buff=0.1)
        label_O = Text("O", color=CHALK_RED, font_size=20).next_to(center, DOWN, buff=0.15)

        self.play(
            Create(diameter),
            FadeIn(dot_A), FadeIn(dot_B), FadeIn(dot_O),
            Write(label_A), Write(label_B), Write(label_O)
        )

        # Point P on semicircle
        P_angle = PI * 0.65
        P = center + 2.2 * np.array([np.cos(P_angle), np.sin(P_angle), 0])

        dot_P = Dot(P, color=CHALK_GREEN, radius=0.1)
        label_P = Text("P", color=CHALK_GREEN, font_size=24).next_to(P, UP, buff=0.1)

        line_PA = Line(P, A, color=CHALK_GREEN, stroke_width=3)
        line_PB = Line(P, B, color=CHALK_GREEN, stroke_width=3)

        self.play(FadeIn(dot_P), Write(label_P))
        self.play(Create(line_PA), Create(line_PB))

        # Right angle marker (small square)
        def create_right_angle_marker(vertex, p1, p2, size=0.3, color=CHALK_BLUE):
            vertex = np.array(vertex)
            dir1 = normalize(np.array(p1) - vertex)
            dir2 = normalize(np.array(p2) - vertex)

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

        right_angle = create_right_angle_marker(P, A, B, size=0.35, color=CHALK_BLUE)
        angle_label = MathTex(r"90°", color=CHALK_WHITE, font_size=28)
        angle_label.move_to(P + DOWN * 0.5 + LEFT * 0.3)

        self.play(FadeIn(right_angle), Write(angle_label))
        self.wait(0.5)

        # Explanation
        explanation = Text(
            "No matter where P is on the semicircle, the angle is always 90°",
            color=CHALK_WHITE, font_size=20
        ).to_edge(DOWN, buff=0.7)

        self.play(Write(explanation))

        # Animate P moving along semicircle
        for target_angle in [PI * 0.35, PI * 0.5, PI * 0.8, PI * 0.6]:
            new_P = center + 2.2 * np.array([np.cos(target_angle), np.sin(target_angle), 0])

            new_dot_P = Dot(new_P, color=CHALK_GREEN, radius=0.1)
            new_label_P = Text("P", color=CHALK_GREEN, font_size=24)
            new_label_P.next_to(new_P, UP if target_angle > PI/2 else UR, buff=0.1)

            new_line_PA = Line(new_P, A, color=CHALK_GREEN, stroke_width=3)
            new_line_PB = Line(new_P, B, color=CHALK_GREEN, stroke_width=3)
            new_right_angle = create_right_angle_marker(new_P, A, B, size=0.35, color=CHALK_BLUE)

            new_angle_label = MathTex(r"90°", color=CHALK_WHITE, font_size=28)
            new_angle_label.move_to(new_P + DOWN * 0.5 + LEFT * 0.3)

            self.play(
                Transform(dot_P, new_dot_P),
                Transform(label_P, new_label_P),
                Transform(line_PA, new_line_PA),
                Transform(line_PB, new_line_PB),
                Transform(right_angle, new_right_angle),
                Transform(angle_label, new_angle_label),
                run_time=1
            )
            self.wait(0.2)

        # Final formula
        self.play(FadeOut(explanation))

        formula = VGroup(
            Text("If AB is a diameter:", color=CHALK_WHITE, font_size=24),
            MathTex(r"\angle APB = 90°", color=CHALK_YELLOW, font_size=40)
        ).arrange(DOWN, buff=0.2)
        formula.to_edge(DOWN, buff=0.5)

        self.play(Write(formula[0]))
        self.play(Write(formula[1]))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# INTRO SCENE
# ============================================================

class CircleGeometryIntroV3(ChalkboardScene):
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
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# TANGENT-RADIUS THEOREM
# ============================================================

class TangentRadiusTheoremV3(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Tangent-Radius Theorem",
            "A tangent is perpendicular to the radius at the point of contact"
        )
        self.wait(0.5)

        # Circle
        circle = Circle(radius=2, color=CHALK_WHITE, stroke_width=3)
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
        radius_line = Line(center, P, color=CHALK_RED, stroke_width=4)
        radius_label = Text("r", color=CHALK_RED, font_size=24)
        radius_label.move_to((center + P) / 2 + UP * 0.3 + LEFT * 0.2)

        self.play(Create(radius_line), Write(radius_label))

        # Tangent line at P
        tangent_direction = np.array([-np.sin(PI * 0.3), np.cos(PI * 0.3), 0])
        tangent_start = P - tangent_direction * 3
        tangent_end = P + tangent_direction * 3

        tangent = Line(tangent_start, tangent_end, color=CHALK_GREEN, stroke_width=3)
        tangent_label = Text("Tangent", color=CHALK_GREEN, font_size=22)
        tangent_label.next_to(tangent_end, RIGHT, buff=0.1)

        self.play(Create(tangent), Write(tangent_label))

        # Right angle marker (square)
        def create_right_angle_marker(vertex, p1, p2, size=0.3, color=CHALK_BLUE):
            vertex = np.array(vertex)
            dir1 = normalize(np.array(p1) - vertex)
            dir2 = normalize(np.array(p2) - vertex)

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

        right_angle = create_right_angle_marker(P, center, tangent_end, size=0.3, color=CHALK_WHITE)
        angle_label = MathTex(r"90°", color=CHALK_WHITE, font_size=28)
        angle_label.move_to(P + normalize(center - P) * 0.5 + tangent_direction * 0.3)

        self.play(FadeIn(right_angle), Write(angle_label))

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
# TWO TANGENTS THEOREM
# ============================================================

class TwoTangentsTheoremV3(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Two Tangents Theorem",
            "Tangents from an external point are equal in length"
        )
        self.wait(0.5)

        # Circle
        circle = Circle(radius=1.8, color=CHALK_WHITE, stroke_width=3)
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
        CP = P - center
        CP_norm = CP / np.linalg.norm(CP)
        CP_perp = np.array([-CP_norm[1], CP_norm[0], 0])

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

        # Right angle markers (using squares)
        def create_right_angle_marker(vertex, p1, p2, size=0.25, color=CHALK_WHITE):
            vertex = np.array(vertex)
            dir1 = normalize(np.array(p1) - vertex)
            dir2 = normalize(np.array(p2) - vertex)

            corner1 = vertex + dir1 * size
            corner2 = vertex + dir2 * size
            corner3 = vertex + dir1 * size + dir2 * size

            square = Polygon(
                vertex, corner1, corner3, corner2,
                color=color,
                fill_color=color,
                fill_opacity=0.3,
                stroke_width=2
            )
            return square

        right_angle_A = create_right_angle_marker(A, center, P, size=0.25)
        right_angle_B = create_right_angle_marker(B, center, P, size=0.25)

        self.play(FadeIn(right_angle_A), FadeIn(right_angle_B))

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
# ALTERNATE SEGMENT THEOREM
# ============================================================

class AlternateSegmentTheoremV3(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Alternate Segment Theorem",
            "Angle between tangent and chord equals inscribed angle"
        )
        self.wait(0.5)

        # Circle
        circle = Circle(radius=2, color=CHALK_WHITE, stroke_width=3)
        circle.shift(DOWN * 0.3 + LEFT * 0.5)
        center = circle.get_center()

        self.play(Create(circle))

        # Point of tangency
        T_angle = -PI * 0.3
        T = center + 2 * np.array([np.cos(T_angle), np.sin(T_angle), 0])
        dot_T = Dot(T, color=CHALK_YELLOW, radius=0.1)
        label_T = Text("T", color=CHALK_YELLOW, font_size=24).next_to(dot_T, DR, buff=0.1)

        self.play(FadeIn(dot_T), Write(label_T))

        # Tangent at T (shortened to avoid overlapping formula box and notes)
        tangent_dir = np.array([np.sin(T_angle), -np.cos(T_angle), 0])
        tangent = Line(T - tangent_dir * 2.0, T + tangent_dir * 1.5, color=CHALK_GREEN, stroke_width=3)

        self.play(Create(tangent))

        # Chord from T to another point A on circle
        A_angle = PI * 0.6
        A = center + 2 * np.array([np.cos(A_angle), np.sin(A_angle), 0])
        dot_A = Dot(A, color=CHALK_YELLOW, radius=0.1)
        label_A = Text("A", color=CHALK_YELLOW, font_size=24).next_to(dot_A, UP, buff=0.1)

        chord_TA = Line(T, A, color=CHALK_BLUE, stroke_width=3)

        self.play(FadeIn(dot_A), Write(label_A))
        self.play(Create(chord_TA))

        # Angle between tangent and chord TA (at T)
        # For alternate segment theorem: angle between tangent (going toward B's segment) and chord TA
        # We need the tangent direction that goes INTO the alternate segment (where B will be)

        vec_TA = A - T
        vec_TA_angle = angle_of_vector(vec_TA)

        # The tangent has two directions - pick the one going toward the alternate segment
        # (opposite side from A relative to the diameter through T)
        tangent_angle_1 = angle_of_vector(tangent_dir)
        tangent_angle_2 = angle_of_vector(-tangent_dir)

        # We want the angle between tangent and chord TA
        # The correct tangent direction is the one that creates an acute angle with TA
        # and is on the side where B will be (lower part of circle)

        # Use the tangent direction going toward lower-left (into alternate segment)
        # Check which tangent direction points more toward B's side (below the chord)
        if tangent_dir[1] > 0:  # If tangent_dir points upward, use the opposite
            correct_tangent_angle = tangent_angle_2
        else:
            correct_tangent_angle = tangent_angle_1

        # Calculate angle from tangent to chord TA (counterclockwise)
        sweep_T = vec_TA_angle - correct_tangent_angle
        if sweep_T < 0:
            sweep_T += 2 * PI
        if sweep_T > PI:
            # Take the other way around
            correct_tangent_angle = correct_tangent_angle + PI
            if correct_tangent_angle > PI:
                correct_tangent_angle -= 2 * PI
            sweep_T = vec_TA_angle - correct_tangent_angle
            if sweep_T < 0:
                sweep_T += 2 * PI

        wedge_tangent_chord = self.create_wedge_at_vertex(
            T, correct_tangent_angle, sweep_T,
            radius=0.4, color=CHALK_RED, fill_opacity=0.5
        )
        label_alpha = MathTex(r"\alpha", color=CHALK_RED, font_size=26)
        label_alpha.move_to(T + 0.6 * np.array([np.cos(correct_tangent_angle + sweep_T/2), np.sin(correct_tangent_angle + sweep_T/2), 0]))

        self.play(FadeIn(wedge_tangent_chord), Write(label_alpha))

        # Point B in the alternate segment
        B_angle = PI * 1.3
        B = center + 2 * np.array([np.cos(B_angle), np.sin(B_angle), 0])
        dot_B = Dot(B, color=CHALK_PINK, radius=0.1)
        label_B = Text("B", color=CHALK_PINK, font_size=24).next_to(dot_B, LEFT, buff=0.1)

        # Lines from B to T and A (inscribed angle)
        line_BT = Line(B, T, color=CHALK_PINK, stroke_width=2)
        line_BA = Line(B, A, color=CHALK_PINK, stroke_width=2)

        self.play(FadeIn(dot_B), Write(label_B))
        self.play(Create(line_BT), Create(line_BA))

        # Inscribed angle at B
        vec_BT = T - B
        vec_BA = A - B
        start_B = angle_of_vector(vec_BT)
        end_B = angle_of_vector(vec_BA)
        sweep_B = end_B - start_B
        if sweep_B < 0:
            sweep_B += 2 * PI
        if sweep_B > PI:
            start_B = end_B
            sweep_B = 2 * PI - sweep_B

        wedge_inscribed = self.create_wedge_at_vertex(
            B, start_B, sweep_B,
            radius=0.35, color=CHALK_RED, fill_opacity=0.5
        )
        label_alpha2 = MathTex(r"\alpha", color=CHALK_RED, font_size=26)
        label_alpha2.move_to(B + 0.55 * np.array([np.cos(start_B + sweep_B/2), np.sin(start_B + sweep_B/2), 0]))

        self.play(FadeIn(wedge_inscribed), Write(label_alpha2))

        # Animation: Show equality by overlaying
        explanation = Text(
            "These angles are equal!",
            color=CHALK_YELLOW, font_size=24
        ).to_edge(DOWN, buff=0.8)

        self.play(Write(explanation))

        # Create overlay at T position
        overlay_at_T = self.create_wedge_at_vertex(
            T, correct_tangent_angle, sweep_B,  # Use inscribed angle's sweep at T's position
            radius=0.4, color=CHALK_PURPLE, fill_opacity=0.6
        )

        # Highlight inscribed and transform to overlay
        self.play(wedge_inscribed.animate.set_fill(CHALK_WHITE, opacity=0.9), run_time=0.3)
        copy_inscribed = wedge_inscribed.copy()
        self.add(copy_inscribed)
        self.play(wedge_inscribed.animate.set_fill(CHALK_RED, opacity=0.5), run_time=0.2)

        self.play(Transform(copy_inscribed, overlay_at_T), run_time=1.5)

        # Flash
        self.play(
            wedge_tangent_chord.animate.set_fill(CHALK_WHITE, opacity=0.9),
            copy_inscribed.animate.set_fill(CHALK_WHITE, opacity=0.9),
            run_time=0.2
        )
        self.play(
            wedge_tangent_chord.animate.set_fill(CHALK_RED, opacity=0.5),
            copy_inscribed.animate.set_fill(CHALK_PURPLE, opacity=0.5),
            run_time=0.3
        )

        self.play(FadeOut(copy_inscribed), FadeOut(explanation))

        # ===== NEW: Animate B moving along the arc to show angle stays constant =====
        move_explanation = Text(
            "B can be ANYWHERE on the alternate arc - angle stays the same!",
            color=CHALK_YELLOW, font_size=20
        ).to_edge(DOWN, buff=0.8)

        self.play(Write(move_explanation))
        self.wait(0.5)

        # Define the arc range where B can move (the alternate segment - opposite side from A)
        # A is at PI * 0.6, T is at -PI * 0.3
        # B should stay on the arc from roughly PI * 1.0 to PI * 1.7 (the lower arc)

        target_B_angles = [PI * 1.1, PI * 1.5, PI * 1.7, PI * 1.3]  # Different positions for B

        for target_angle in target_B_angles:
            new_B = center + 2 * np.array([np.cos(target_angle), np.sin(target_angle), 0])

            # Create new elements at new B position
            new_dot_B = Dot(new_B, color=CHALK_PINK, radius=0.1)

            # Position label based on angle
            if target_angle > PI * 1.5:
                label_dir = DR
            elif target_angle > PI * 1.3:
                label_dir = DOWN
            else:
                label_dir = DL
            new_label_B = Text("B", color=CHALK_PINK, font_size=24).next_to(new_B, label_dir, buff=0.1)

            new_line_BT = Line(new_B, T, color=CHALK_PINK, stroke_width=2)
            new_line_BA = Line(new_B, A, color=CHALK_PINK, stroke_width=2)

            # Calculate new inscribed angle at new B position
            new_vec_BT = T - new_B
            new_vec_BA = A - new_B
            new_start_B = angle_of_vector(new_vec_BT)
            new_end_B = angle_of_vector(new_vec_BA)
            new_sweep_B = new_end_B - new_start_B
            if new_sweep_B < 0:
                new_sweep_B += 2 * PI
            if new_sweep_B > PI:
                new_start_B = new_end_B
                new_sweep_B = 2 * PI - new_sweep_B

            new_wedge = self.create_wedge_at_vertex(
                new_B, new_start_B, new_sweep_B,
                radius=0.35, color=CHALK_RED, fill_opacity=0.5
            )

            new_alpha_label = MathTex(r"\alpha", color=CHALK_RED, font_size=26)
            new_alpha_label.move_to(new_B + 0.55 * np.array([
                np.cos(new_start_B + new_sweep_B/2),
                np.sin(new_start_B + new_sweep_B/2), 0
            ]))

            # Animate the transformation
            self.play(
                Transform(dot_B, new_dot_B),
                Transform(label_B, new_label_B),
                Transform(line_BT, new_line_BT),
                Transform(line_BA, new_line_BA),
                Transform(wedge_inscribed, new_wedge),
                Transform(label_alpha2, new_alpha_label),
                run_time=1.2
            )
            self.wait(0.3)

        self.play(FadeOut(move_explanation))

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

        # Final note about exam application
        exam_note = Text(
            "In exams: the chord may be a side of a triangle!",
            color=CHALK_GREEN, font_size=20
        ).to_edge(DOWN, buff=0.5)

        self.play(Write(exam_note))

        self.wait(3)
        self.play(*[FadeOut(mob) for mob in self.mobjects])


# ============================================================
# INTERSECTING CHORDS THEOREM
# ============================================================

class IntersectingChordsTheoremV3(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Intersecting Chords Theorem",
            "Products of chord segments are equal"
        )
        self.wait(0.5)

        # Circle
        circle = Circle(radius=2.2, color=CHALK_WHITE, stroke_width=3)
        circle.shift(DOWN * 0.3 + LEFT * 0.5)
        center = circle.get_center()

        self.play(Create(circle))

        # Two chords that intersect inside
        A = center + 2.2 * np.array([np.cos(PI * 0.15), np.sin(PI * 0.15), 0])
        B = center + 2.2 * np.array([np.cos(PI * 1.1), np.sin(PI * 1.1), 0])
        C = center + 2.2 * np.array([np.cos(PI * 0.5), np.sin(PI * 0.5), 0])
        D = center + 2.2 * np.array([np.cos(PI * 1.65), np.sin(PI * 1.65), 0])

        # Find intersection point P
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
# TANGENT-SECANT THEOREM
# ============================================================

class TangentSecantTheoremV3(ChalkboardScene):
    def construct(self):
        title_group = self.draw_theorem_title(
            "Tangent-Secant Theorem",
            "Tangent squared equals product of secant segments"
        )
        self.wait(0.5)

        # Circle
        circle = Circle(radius=1.8, color=CHALK_WHITE, stroke_width=3)
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

class CircleTheoremsSummaryV3(ChalkboardScene):
    def construct(self):
        title = Text("Circle Theorems Summary", color=CHALK_YELLOW, font_size=48, weight=BOLD)
        title.to_edge(UP, buff=0.4)
        underline = Line(title.get_left() + DOWN * 0.2, title.get_right() + DOWN * 0.2, color=CHALK_YELLOW)

        self.play(Write(title), Create(underline))

        theorems = [
            ("1. Central Angle", "= 2 x Inscribed Angle"),
            ("2. Inscribed Angles", "same arc -> equal"),
            ("3. Semicircle Angle", "= 90 (Thales)"),
            ("4. Cyclic Quad", "opposite angles = 180"),
            ("5. Tangent perpendicular Radius", "at point of contact"),
            ("6. Two Tangents", "from external point are equal"),
            ("7. Alternate Segment", "tangent-chord = inscribed"),
            ("8. Intersecting Chords", "a*b = c*d"),
            ("9. Tangent-Secant", "t^2 = a*b"),
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
