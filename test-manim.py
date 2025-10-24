#!/home/dachu/miniconda3/envs/aitools/bin/python
"""
Test Manim installation with Circle Theorem animation
"""

from manim import *

class CircleTheoremTest(Scene):
    def construct(self):
        # Title
        title = Text("Circle Theorem: Angle at Centre", font_size=36)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(0.5)

        # Draw circle
        circle = Circle(radius=2, color=BLUE)
        self.play(Create(circle))
        self.wait(0.5)

        # Draw center
        center = Dot(ORIGIN, color=RED)
        center_label = Text("O", font_size=24).next_to(center, DOWN)
        self.play(FadeIn(center, center_label))
        self.wait(0.5)

        # Point A on circumference
        point_A = circle.point_at_angle(PI/3)
        dot_A = Dot(point_A, color=YELLOW)
        label_A = Text("A", font_size=24).next_to(dot_A, UP)
        self.play(FadeIn(dot_A, label_A))

        # Point B on circumference
        point_B = circle.point_at_angle(-PI/3)
        dot_B = Dot(point_B, color=YELLOW)
        label_B = Text("B", font_size=24).next_to(dot_B, DOWN)
        self.play(FadeIn(dot_B, label_B))
        self.wait(0.5)

        # Draw angle at centre
        line_OA = Line(ORIGIN, point_A, color=GREEN)
        line_OB = Line(ORIGIN, point_B, color=GREEN)
        self.play(Create(line_OA), Create(line_OB))

        angle_centre = Angle(line_OB, line_OA, radius=0.5, color=RED)
        angle_label = MathTex("120°", color=RED).next_to(angle_centre, RIGHT, buff=0.2)
        self.play(Create(angle_centre), Write(angle_label))
        self.wait(1)

        # Point C on circumference (for angle at circumference)
        point_C = circle.point_at_angle(PI)
        dot_C = Dot(point_C, color=YELLOW)
        label_C = Text("C", font_size=24).next_to(dot_C, LEFT)
        self.play(FadeIn(dot_C, label_C))
        self.wait(0.5)

        # Draw angle at circumference
        line_CA = Line(point_C, point_A, color=PURPLE)
        line_CB = Line(point_C, point_B, color=PURPLE)
        self.play(Create(line_CA), Create(line_CB))

        angle_circum = Angle(line_CB, line_CA, radius=0.3, color=ORANGE)
        angle_circum_label = MathTex("60°", color=ORANGE).next_to(angle_circum, UP, buff=0.1)
        self.play(Create(angle_circum), Write(angle_circum_label))
        self.wait(1)

        # Highlight the relationship
        box_centre = SurroundingRectangle(angle_label, color=RED, buff=0.1)
        box_circum = SurroundingRectangle(angle_circum_label, color=ORANGE, buff=0.1)
        self.play(Create(box_centre), Create(box_circum))
        self.wait(0.5)

        # Show formula
        formula = MathTex(r"\text{Angle at centre} = 2 \times \text{Angle at circumference}")
        formula.to_edge(DOWN)
        formula.scale(0.8)
        self.play(Write(formula))
        self.wait(2)

        # Cleanup
        self.play(
            *[FadeOut(mob) for mob in self.mobjects]
        )
