
from manim import *
import numpy as np

class WorkedExample(Scene):
    def construct(self):
        time_spent = 0
        target_duration = 256

        # STEP 1: Show question BIG and centered
        question_big = VGroup(
            Text("Question:", font_size=32, color=ORANGE, weight=BOLD),
            Text("O is the centre of the circle.", font_size=28),
            Text("A, B, C are on the circumference.", font_size=28),
            Text(f"Angle AOB = 100°", font_size=32, color=YELLOW, weight=BOLD),
            Text("", font_size=20),  # Spacer
            Text("Find: Angle ACB", font_size=32, color=GREEN, weight=BOLD)
        ).arrange(DOWN, center=True, buff=0.4)

        self.play(Write(question_big, run_time=2.5))
        time_spent += 2.5

        # PAUSE - "That's our question. How would you answer that?"
        self.wait(2.0)
        time_spent += 2.0

        # STEP 2: Fade out big question and show small question in corner
        self.play(FadeOut(question_big), run_time=0.8)
        time_spent += 0.8

        question_small = VGroup(
            Text("Given:", font_size=16, color=ORANGE, weight=BOLD),
            Text(f"∠AOB = 100°", font_size=18, color=YELLOW),
            Text("Find: ∠ACB", font_size=16, color=GREEN)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.15)
        question_small.to_corner(UR, buff=0.5)

        self.play(FadeIn(question_small), run_time=1.0)
        time_spent += 1.0
        self.wait(0.5)
        time_spent += 0.5

        # STEP 3: Draw the circle diagram on the LEFT
        circle = Circle(radius=1.8, color=WHITE, stroke_width=3)
        circle.shift(LEFT * 3.5 + DOWN * 0.5)

        self.play(Create(circle, run_time=1.5))
        time_spent += 1.5

        # Center point O
        center = Dot(circle.get_center(), color=YELLOW, radius=0.06)
        center_label = Text("O", font_size=20, color=YELLOW)
        center_label.next_to(center, DOWN, buff=0.1)

        self.play(FadeIn(center, scale=2), Write(center_label), run_time=1.0)
        time_spent += 1.0

        # Points on circumference
        point_a = Dot(circle.point_at_angle(PI/6), color=RED, radius=0.06)
        point_b = Dot(circle.point_at_angle(PI/6 + 100*DEGREES), color=RED, radius=0.06)
        point_c = Dot(circle.point_at_angle(PI + PI/4), color=GREEN, radius=0.06)

        label_a = Text("A", font_size=18, color=RED)
        label_a.next_to(point_a, UR, buff=0.1)
        label_b = Text("B", font_size=18, color=RED)
        label_b.next_to(point_b, UP, buff=0.1)
        label_c = Text("C", font_size=18, color=GREEN)
        label_c.next_to(point_c, DL, buff=0.1)

        self.play(
            *[FadeIn(p, scale=2) for p in [point_a, point_b, point_c]],
            *[Write(l) for l in [label_a, label_b, label_c]],
            run_time=1.5
        )
        time_spent += 1.5

        # Lines from center (angle at center)
        line_oa = Line(center.get_center(), point_a.get_center(), color=YELLOW, stroke_width=2)
        line_ob = Line(center.get_center(), point_b.get_center(), color=YELLOW, stroke_width=2)

        self.play(Create(line_oa), Create(line_ob), run_time=1.2)
        time_spent += 1.2

        # Angle at center with arc
        angle_center = Angle(line_oa, line_ob, radius=0.4, color=YELLOW, stroke_width=2)
        angle_label_center = MathTex(f"{100}^\\circ", color=YELLOW, font_size=24)
        angle_label_center.move_to(center.get_center() + UP*0.5)

        self.play(Create(angle_center), Write(angle_label_center), run_time=1.2)
        time_spent += 1.2

        # Lines from circumference (angle at circumference)
        line_ca = Line(point_c.get_center(), point_a.get_center(), color=GREEN, stroke_width=2)
        line_cb = Line(point_c.get_center(), point_b.get_center(), color=GREEN, stroke_width=2)

        self.play(Create(line_ca), Create(line_cb), run_time=1.2)
        time_spent += 1.2

        # Angle at circumference
        angle_circum = Angle(line_ca, line_cb, radius=0.3, color=GREEN, stroke_width=2)
        angle_label_circum = MathTex("?", color=GREEN, font_size=24)
        angle_label_circum.next_to(point_c, UP, buff=0.3)

        self.play(Create(angle_circum), Write(angle_label_circum), run_time=1.2)
        time_spent += 1.2
        self.wait(0.8)
        time_spent += 0.8

        # STEP 4: Solution on the RIGHT side
        solution_title = Text("Solution:", font_size=28, color=BLUE, weight=BOLD)
        solution_title.to_edge(RIGHT, buff=3.5).to_edge(UP, buff=1.5)

        self.play(Write(solution_title, run_time=1.0))
        time_spent += 1.0

        # Apply theorem
        theorem = Text("Angle at centre = 2 × Angle at circumference", font_size=18)
        theorem.next_to(solution_title, DOWN, buff=0.4, aligned_edge=LEFT)

        self.play(Write(theorem, run_time=2.0))
        time_spent += 2.0
        self.wait(1.0)
        time_spent += 1.0

        # Calculation
        calc = MathTex(
            "100^\\circ", "=", "2", "\\times", "\\angle ACB",
            font_size=32
        )
        calc.next_to(theorem, DOWN, buff=0.5, aligned_edge=LEFT)

        self.play(Write(calc, run_time=2.0))
        time_spent += 2.0
        self.wait(1.0)
        time_spent += 1.0

        # Solve
        solution_calc = MathTex(
            "\\angle ACB", "=", "100^\\circ", "\\div", "2",
            font_size=32
        )
        solution_calc.next_to(calc, DOWN, buff=0.4, aligned_edge=LEFT)

        self.play(Write(solution_calc, run_time=2.0))
        time_spent += 2.0
        self.wait(0.8)
        time_spent += 0.8

        # Final answer
        answer_box = Rectangle(
            width=3.5,
            height=0.8,
            fill_color=GREEN,
            fill_opacity=0.2,
            stroke_color=GREEN,
            stroke_width=3
        )
        answer_text = MathTex("\\angle ACB = 50^\\circ", color=GREEN, font_size=36)
        answer_group = VGroup(answer_box, answer_text)
        answer_group.next_to(solution_calc, DOWN, buff=0.6)

        self.play(Create(answer_box), run_time=0.8)
        time_spent += 0.8
        self.play(Write(answer_text, run_time=1.5))
        time_spent += 1.5

        # Update the angle on the diagram
        new_angle_label = MathTex(f"{50}^\\circ", color=GREEN, font_size=24)
        new_angle_label.move_to(angle_label_circum.get_center())
        self.play(Transform(angle_label_circum, new_angle_label), run_time=1.0)
        time_spent += 1.0

        # Tick mark
        tick = Text("✓", font_size=48, color=GREEN, weight=BOLD)
        tick.next_to(answer_box, RIGHT, buff=0.3)
        self.play(FadeIn(tick, scale=1.5), run_time=1.0)
        time_spent += 1.0
        self.wait(1.5)
        time_spent += 1.5

        # PADDING: Wait remaining time to match audio duration
        remaining_time = max(0, target_duration - time_spent - 0.8)  # Subtract fade time
        if remaining_time > 0:
            self.wait(remaining_time)

        # Fade all
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=0.8)
