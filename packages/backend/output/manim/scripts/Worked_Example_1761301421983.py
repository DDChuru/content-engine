
from manim import *
import numpy as np

class WorkedExample(Scene):
    def construct(self):
        time_spent = 0
        target_duration = 36.179563
        # Question header
        header = Text("Worked Example", font_size=40, color=ORANGE, weight=BOLD)
        header.to_edge(UP, buff=0.5)

        underline = Line(LEFT, RIGHT, color=ORANGE).scale(3.5)
        underline.next_to(header, DOWN, buff=0.1)

        self.play(
            Write(header, run_time=1.2),
            Create(underline, run_time=0.6)
        )
        time_spent += 1.2
        self.wait(0.8)
        time_spent += 0.8

        # Question text
        question = VGroup(
            Text("In the diagram, O is the centre of the circle.", font_size=24),
            Text("Points A, B, and C lie on the circumference.", font_size=24),
            Text(f"Angle AOB = 100°", font_size=24, color=YELLOW)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        question.next_to(underline, DOWN, buff=0.5)
        question.to_edge(LEFT, buff=1)

        self.play(Write(question, run_time=3.0))
        time_spent += 3.0
        self.wait(1.0)
        time_spent += 1.0

        # Find box
        find_box = Rectangle(
            width=5,
            height=0.8,
            fill_color=GREEN,
            fill_opacity=0.2,
            stroke_color=GREEN,
            stroke_width=3
        )
        find_box.next_to(question, DOWN, buff=0.5)
        find_box.to_edge(LEFT, buff=1)

        find_text = Text("Find: Angle ACB", font_size=24, color=GREEN, weight=BOLD)
        find_text.move_to(find_box.get_center())

        self.play(
            Create(find_box),
            Write(find_text),
            run_time=1.5
        )
        time_spent += 1.5
        self.wait(1.2)
        time_spent += 1.2

        # Solution steps
        step1_title = Text("Step 1: Apply the theorem", font_size=28, color=BLUE, weight=BOLD)
        step1_title.to_edge(DOWN, buff=3)
        step1_title.to_edge(LEFT, buff=1)

        self.play(Write(step1_title, run_time=1.5))
        time_spent += 1.5
        self.wait(0.8)
        time_spent += 0.8

        step1_text = Text(
            "Angle at centre = 2 × Angle at circumference",
            font_size=22
        )
        step1_text.next_to(step1_title, DOWN, buff=0.3, aligned_edge=LEFT)

        self.play(Write(step1_text, run_time=2.0))
        time_spent += 2.0
        self.wait(1.5)
        time_spent += 1.5

        # Step 2
        step2_title = Text("Step 2: Calculate", font_size=28, color=BLUE, weight=BOLD)
        step2_title.next_to(step1_text, DOWN, buff=0.5, aligned_edge=LEFT)

        self.play(Write(step2_title, run_time=1.5))
        time_spent += 1.5
        self.wait(0.8)
        time_spent += 0.8

        # Calculation
        calc_box = Rectangle(
            width=8,
            height=2,
            fill_color=BLUE,
            fill_opacity=0.1,
            stroke_color=BLUE,
            stroke_width=2
        )
        calc_box.to_corner(DR, buff=0.5)

        calculation = MathTex(
            "100^\\circ", "=", "2", "\\times", "\\angle ACB",
            font_size=40
        )
        calculation.move_to(calc_box.get_center())
        calculation.shift(UP * 0.3)

        self.play(Create(calc_box), run_time=1.0)
        time_spent += 1.0
        self.play(Write(calculation, run_time=2.0))
        time_spent += 2.0
        self.wait(1.0)
        time_spent += 1.0

        # Solve
        solution = MathTex(
            "\\angle ACB", "=", "100^\\circ", "\\div", "2", "=", "50^\\circ",
            font_size=36
        )
        solution.next_to(calculation, DOWN, buff=0.4)
        solution[-1].set_color(GREEN)  # Highlight answer

        self.play(Write(solution, run_time=2.5))
        time_spent += 2.5
        self.wait(1.0)
        time_spent += 1.0

        # Tick mark for correct answer
        tick = Text("✓", font_size=60, color=GREEN, weight=BOLD)
        tick.next_to(calc_box, RIGHT, buff=0.3)

        self.play(FadeIn(tick, scale=1.8), run_time=1.0)
        time_spent += 1.0
        self.wait(2.0)
        time_spent += 2.0

        # PADDING: Wait remaining time to match audio duration
        remaining_time = max(0, target_duration - time_spent - 0.8)  # Subtract fade time
        if remaining_time > 0:
            self.wait(remaining_time)

        # Fade all
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=0.8)
