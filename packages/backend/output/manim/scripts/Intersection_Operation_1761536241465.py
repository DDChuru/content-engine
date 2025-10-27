
from manim import *
import numpy as np

class TheoryScene(Scene):
    def construct(self):
        time_spent = 0
        target_duration = 120
        # Title
        title = Text("Intersection Operation", font_size=40, color=BLUE, weight=BOLD)
        title.to_edge(UP, buff=0.5)
        self.play(Write(title, run_time=1.2))
        time_spent += 1.2
        self.wait(0.5)
        time_spent += 0.5

        # Draw circle
        circle = Circle(radius=2.5, color=WHITE, stroke_width=3)
        circle.shift(LEFT * 2)

        self.play(Create(circle, run_time=1.5))
        time_spent += 1.5
        self.wait(0.8)
        time_spent += 0.8

        # Center point
        center = Dot(circle.get_center(), color=YELLOW, radius=0.08)
        center_label = Text("O", font_size=28, color=YELLOW)
        center_label.next_to(center, DOWN, buff=0.15)

        self.play(
            FadeIn(center, scale=2),
            Write(center_label),
            run_time=1.2
        )
        time_spent += 1.2
        self.wait(0.8)
        time_spent += 0.8

        # Points on circumference
        angle_deg = 120
        angle_rad = angle_deg * DEGREES

        point_a = Dot(circle.point_at_angle(PI/6), color=RED, radius=0.08)
        point_b = Dot(circle.point_at_angle(PI/6 + angle_rad), color=RED, radius=0.08)
        point_c = Dot(circle.point_at_angle(PI + PI/4), color=GREEN, radius=0.08)

        label_a = Text("A", font_size=24, color=RED)
        label_a.next_to(point_a, UR, buff=0.15)

        label_b = Text("B", font_size=24, color=RED)
        label_b.next_to(point_b, UP, buff=0.15)

        label_c = Text("C", font_size=24, color=GREEN)
        label_c.next_to(point_c, DL, buff=0.15)

        self.play(
            *[FadeIn(p, scale=2) for p in [point_a, point_b, point_c]],
            *[Write(l) for l in [label_a, label_b, label_c]],
            run_time=1.8
        )
        time_spent += 1.8
        self.wait(1.0)
        time_spent += 1.0

        # Lines from center (angle at center)
        line_oa = Line(center.get_center(), point_a.get_center(), color=YELLOW, stroke_width=2)
        line_ob = Line(center.get_center(), point_b.get_center(), color=YELLOW, stroke_width=2)

        self.play(
            Create(line_oa),
            Create(line_ob),
            run_time=1.5
        )
        time_spent += 1.5
        self.wait(0.8)
        time_spent += 0.8

        # Angle at center
        angle_center = Angle(
            line_oa, line_ob,
            radius=0.6,
            color=YELLOW,
            stroke_width=3
        )

        angle_label_center = MathTex(
            f"{angle_deg}^\\circ",
            color=YELLOW,
            font_size=36
        )
        angle_label_center.move_to(center.get_center() + UP*0.8 + LEFT*0.3)

        self.play(Create(angle_center), run_time=1.2)
        time_spent += 1.2
        self.play(Write(angle_label_center), run_time=1.2)
        time_spent += 1.2
        self.wait(1.0)
        time_spent += 1.0

        # Lines from circumference (angle at circumference)
        line_ca = Line(point_c.get_center(), point_a.get_center(), color=GREEN, stroke_width=2)
        line_cb = Line(point_c.get_center(), point_b.get_center(), color=GREEN, stroke_width=2)

        self.play(
            Create(line_ca),
            Create(line_cb),
            run_time=1.5
        )
        time_spent += 1.5
        self.wait(0.8)
        time_spent += 0.8

        # Angle at circumference
        angle_circum = Angle(
            line_ca, line_cb,
            radius=0.5,
            color=GREEN,
            stroke_width=3
        )

        circum_angle = angle_deg / 2
        angle_label_circum = MathTex(
            f"{int(circum_angle)}^\\circ",
            color=GREEN,
            font_size=32
        )
        angle_label_circum.next_to(point_c, UP, buff=0.4)

        self.play(Create(angle_circum), run_time=1.2)
        time_spent += 1.2
        self.play(Write(angle_label_circum), run_time=1.2)
        time_spent += 1.2
        self.wait(1.5)
        time_spent += 1.5

        # Highlight the relationship
        relationship = VGroup(
            angle_label_center.copy(),
            MathTex("=", font_size=40),
            MathTex("2", font_size=40, color=BLUE),
            MathTex("\\times", font_size=32),
            angle_label_circum.copy()
        ).arrange(RIGHT, buff=0.2)
        relationship.to_edge(RIGHT, buff=1)

        relationship_box = SurroundingRectangle(
            relationship,
            color=BLUE,
            buff=0.3,
            corner_radius=0.1
        )

        self.play(
            Create(relationship_box),
            Write(relationship),
            run_time=2.0
        )
        time_spent += 2.0
        self.wait(1.5)
        time_spent += 1.5

        # Theorem statement box
        theorem_box = Rectangle(
            width=11,
            height=1.2,
            fill_color=BLUE,
            fill_opacity=0.15,
            stroke_color=BLUE,
            stroke_width=3
        )
        theorem_box.to_edge(DOWN, buff=0.5)

        theorem_text = Text(
            "Angle at Centre = 2 × Angle at Circumference",
            font_size=28,
            color=WHITE,
            weight=BOLD
        )
        theorem_text.move_to(theorem_box.get_center())

        self.play(
            Create(theorem_box),
            Write(theorem_text),
            run_time=1.8
        )
        time_spent += 1.8
        self.wait(2.5)
        time_spent += 2.5

        # PADDING: Wait remaining time to match audio duration
        remaining_time = max(0, target_duration - time_spent - 0.8)  # Subtract fade time
        if remaining_time > 0:
            self.wait(remaining_time)

        # Fade all
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=0.8)
