
from manim import *

class SetsVennDiagramClean(Scene):
    def construct(self):
        # Time tracking
        time_spent = 0
        target_duration = 12.0

        # Title
        title = Text("Visual Representation", font_size=40, color=WHITE, weight=BOLD)
        title.to_edge(UP, buff=0.5)
        self.play(Write(title), run_time=0.8)
        time_spent += 0.8
        self.wait(0.3)
        time_spent += 0.3

        # Create Venn diagram circles
        # Circle A (left) - BLUE
        circle_a = Circle(radius=1.5, color=BLUE, fill_opacity=0.2)
        circle_a.shift(LEFT * 1.2)

        # Circle B (right) - GREEN
        circle_b = Circle(radius=1.5, color=GREEN, fill_opacity=0.2)
        circle_b.shift(RIGHT * 1.2)

        # Labels for circles
        label_a = Text("Set A", font_size=32, color=BLUE)
        label_a.next_to(circle_a, LEFT, buff=0.3)

        label_b = Text("Set B", font_size=32, color=GREEN)
        label_b.next_to(circle_b, RIGHT, buff=0.3)

        # Draw circles
        self.play(
            Create(circle_a),
            Create(circle_b),
            run_time=1.5
        )
        time_spent += 1.5

        self.play(
            Write(label_a),
            Write(label_b),
            run_time=0.8
        )
        time_spent += 0.8
        self.wait(0.5)
        time_spent += 0.5

        # Numbers for Set A (1,2,3 only in A)
        num_1 = Text("1", font_size=28, color=BLUE).move_to(circle_a.get_center() + LEFT * 1.0)
        num_2 = Text("2", font_size=28, color=BLUE).move_to(circle_a.get_center() + UP * 0.8 + LEFT * 0.5)
        num_3 = Text("3", font_size=28, color=BLUE).move_to(circle_a.get_center() + DOWN * 0.8 + LEFT * 0.5)

        # Numbers for Set B (6,7,8 only in B)
        num_6 = Text("6", font_size=28, color=GREEN).move_to(circle_b.get_center() + RIGHT * 1.0)
        num_7 = Text("7", font_size=28, color=GREEN).move_to(circle_b.get_center() + UP * 0.8 + RIGHT * 0.5)
        num_8 = Text("8", font_size=28, color=GREEN).move_to(circle_b.get_center() + DOWN * 0.8 + RIGHT * 0.5)

        # Numbers in BOTH (4,5 in intersection) - YELLOW for highlight!
        # FIXED: Better positioning for intersection numbers
        num_4 = Text("4", font_size=36, color=YELLOW, weight=BOLD).move_to(UP * 0.5)
        num_5 = Text("5", font_size=36, color=YELLOW, weight=BOLD).move_to(DOWN * 0.5)

        # Show numbers appearing
        self.play(
            FadeIn(num_1, shift=DOWN*0.2),
            FadeIn(num_2, shift=DOWN*0.2),
            FadeIn(num_3, shift=DOWN*0.2),
            run_time=1.0
        )
        time_spent += 1.0

        self.play(
            FadeIn(num_6, shift=DOWN*0.2),
            FadeIn(num_7, shift=DOWN*0.2),
            FadeIn(num_8, shift=DOWN*0.2),
            run_time=1.0
        )
        time_spent += 1.0
        self.wait(0.5)
        time_spent += 0.5

        # Highlight the intersection!
        self.play(
            FadeIn(num_4, scale=1.2),
            FadeIn(num_5, scale=1.2),
            run_time=1.2
        )
        time_spent += 1.2
        self.wait(0.5)
        time_spent += 0.5

        # REMOVED: Problematic "Intersection" label and arrow
        # Instead, just pulse the intersection numbers to draw attention
        self.play(
            num_4.animate.scale(1.2),
            num_5.animate.scale(1.2),
            run_time=0.5
        )
        self.play(
            num_4.animate.scale(1/1.2),
            num_5.animate.scale(1/1.2),
            run_time=0.5
        )
        time_spent += 1.0

        # Final answer
        answer = Text("A ∩ B = {4, 5}", font_size=36, color=YELLOW, weight=BOLD)
        answer.to_edge(DOWN, buff=0.8)
        checkmark = Text("✓", font_size=48, color=GREEN)
        checkmark.next_to(answer, RIGHT, buff=0.3)

        self.play(
            Write(answer),
            FadeIn(checkmark, shift=LEFT*0.2),
            run_time=1.0
        )
        time_spent += 1.0
        self.wait(0.5)
        time_spent += 0.5

        # Pad to target
        remaining = max(0, target_duration - time_spent)
        if remaining > 0:
            self.wait(remaining)

        # Fade out
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=0.5)
