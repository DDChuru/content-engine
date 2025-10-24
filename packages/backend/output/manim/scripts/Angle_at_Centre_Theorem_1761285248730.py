#!/usr/bin/env python3
from manim import *

class AngleatCentre(Scene):
    def construct(self):
        # Title
        title = Text("Angle at Centre", font_size=40)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(0.5)

        # Draw circle
        circle = Circle(radius=2.5, color=BLUE)
        circle.shift(LEFT * 2)
        self.play(Create(circle))
        self.wait(0.5)

        # Draw center
        center = Dot(circle.get_center(), color=RED)
        center_label = Text("O", font_size=28).next_to(center, DOWN, buff=0.2)
        self.play(FadeIn(center, center_label))
        self.wait(0.5)

                # Points on circumference
        point_A = circle.point_at_angle(PI/3)
        point_B = circle.point_at_angle(-PI/3)
        point_C = circle.point_at_angle(PI)

        dot_A = Dot(point_A, color=YELLOW)
        dot_B = Dot(point_B, color=YELLOW)
        dot_C = Dot(point_C, color=YELLOW)

        label_A = Text("A", font_size=28).next_to(dot_A, UR, buff=0.1)
        label_B = Text("B", font_size=28).next_to(dot_B, DR, buff=0.1)
        label_C = Text("C", font_size=28).next_to(dot_C, LEFT, buff=0.1)

        self.play(
            FadeIn(dot_A, label_A),
            FadeIn(dot_B, label_B)
        )
        self.wait(0.5)

        # Draw angle at centre
        line_OA = Line(circle.get_center(), point_A, color=GREEN)
        line_OB = Line(circle.get_center(), point_B, color=GREEN)

        self.play(Create(line_OA), Create(line_OB))
        self.wait(0.5)

        # Angle marker at centre
        angle_centre = Angle(line_OB, line_OA, radius=0.6, color=RED)
        angle_centre_label = Text("120", font_size=24, color=RED).next_to(angle_centre, RIGHT, buff=0.2)

        self.play(Create(angle_centre), Write(angle_centre_label))
        self.wait(1)

        # Add point C and draw angle at circumference
        self.play(FadeIn(dot_C, label_C))
        self.wait(0.5)

        line_CA = Line(point_C, point_A, color=PURPLE)
        line_CB = Line(point_C, point_B, color=PURPLE)

        self.play(Create(line_CA), Create(line_CB))
        self.wait(0.5)

        # Angle marker at circumference
        angle_circum = Angle(line_CB, line_CA, radius=0.4, color=ORANGE)
        angle_circum_label = Text("60", font_size=24, color=ORANGE).next_to(angle_circum, UP, buff=0.2)

        self.play(Create(angle_circum), Write(angle_circum_label))
        self.wait(1)

        # Explanation
        explanation = VGroup(
            Text("Centre = 2 x Circumference", font_size=28),
            Text("120 = 2 x 60", font_size=24, color=YELLOW)
        ).arrange(DOWN, buff=0.3)
        explanation.to_edge(RIGHT, buff=1)
        explanation.shift(DOWN * 0.5)

        bg_rect = SurroundingRectangle(explanation, color=WHITE, buff=0.3, corner_radius=0.1)
        bg_rect.set_fill(color=BLACK, opacity=0.8)

        self.play(FadeIn(bg_rect), Write(explanation))
        self.wait(2)

        # Hold final frame
        self.wait(2)
