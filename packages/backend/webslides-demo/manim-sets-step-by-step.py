"""
Cambridge IGCSE Sets Visualization - STEP-BY-STEP VERSION

Each concept on a CLEAN SCREEN:
1. Universal set with numbers
2. Set A (clean screen, only A)
3. Set B (clean screen, only B)
4. Intersection A ∩ B (clean screen, focused)
5. Union A ∪ B (clean screen, focused)

One concept at a time, maximum clarity!
"""

from manim import *
import numpy as np

class SetsStepByStep(Scene):
    def construct(self):
        # Standard colors
        UNIVERSAL_COLOR = GRAY
        SET_A_COLOR = BLUE
        SET_B_COLOR = GREEN
        INTERSECTION_COLOR = YELLOW
        UNION_COLOR = ORANGE

        # ===== SCREEN 1: Introduction + Universal Set =====
        title = Text("Set Theory", font_size=60, color=WHITE, weight=BOLD)
        subtitle = Text("Venn Diagrams - Step by Step", font_size=36, color="#aaaaaa")
        subtitle.next_to(title, DOWN)

        self.play(Write(title))
        self.play(FadeIn(subtitle, shift=UP*0.2))
        self.wait(1.5)
        self.play(FadeOut(title), FadeOut(subtitle))

        # Universal set
        universal_label = Text(
            "ξ = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}",
            font_size=40,
            color=UNIVERSAL_COLOR
        ).to_edge(UP, buff=0.5)

        self.play(Write(universal_label))
        self.wait(1)

        # Show set definitions
        set_a_def = MathTex(
            r"A = \{1, 2, 3, 4, 5\}",
            font_size=44,
            color=SET_A_COLOR
        ).next_to(universal_label, DOWN, buff=0.5).to_edge(LEFT, buff=1)

        set_b_def = MathTex(
            r"B = \{4, 5, 6, 7, 8\}",
            font_size=44,
            color=SET_B_COLOR
        ).next_to(set_a_def, DOWN, buff=0.4, aligned_edge=LEFT)

        self.play(Write(set_a_def))
        self.wait(0.5)
        self.play(Write(set_b_def))
        self.wait(2)

        # Clear screen
        self.play(
            FadeOut(universal_label),
            FadeOut(set_a_def),
            FadeOut(set_b_def)
        )
        self.wait(0.5)

        # ===== SCREEN 2: SET A ONLY (CLEAN SCREEN) =====
        screen_title = Text("Set A", font_size=50, color=SET_A_COLOR, weight=BOLD)
        screen_title.to_edge(UP, buff=0.4)

        set_a_notation = MathTex(
            r"A = \{1, 2, 3, 4, 5\}",
            font_size=42,
            color=SET_A_COLOR
        ).next_to(screen_title, DOWN, buff=0.3)

        self.play(Write(screen_title), Write(set_a_notation))
        self.wait(0.5)

        # Draw Set A circle (centered)
        circle_a_center = ORIGIN
        circle_a = self.create_sketchy_circle(2.2, circle_a_center, SET_A_COLOR)
        label_a = MathTex("A", font_size=60, color=SET_A_COLOR)
        label_a.move_to(circle_a_center + UP*2.8)

        self.play(Create(circle_a), Write(label_a), run_time=1.5)
        self.wait(0.5)

        # Numbers 1-5 appear and move INTO Set A
        numbers_a = [1, 2, 3, 4, 5]
        number_mobs_a = VGroup(*[
            Text(str(n), font_size=48, color=WHITE, weight=BOLD)
            for n in numbers_a
        ])

        # Start scattered around the circle
        np.random.seed(42)
        for mob in number_mobs_a:
            angle = np.random.uniform(0, TAU)
            distance = np.random.uniform(3.5, 4.5)
            mob.move_to(circle_a_center + np.array([
                distance * np.cos(angle),
                distance * np.sin(angle),
                0
            ]))

        self.play(
            LaggedStart(*[FadeIn(mob, scale=0.5) for mob in number_mobs_a], lag_ratio=0.1),
            run_time=1.5
        )
        self.wait(0.5)

        # Animate INTO the circle
        positions_a = self.circle_positions(circle_a_center, 1.3, len(numbers_a))
        animations = []
        for i, mob in enumerate(number_mobs_a):
            animations.append(
                mob.animate
                .move_to(positions_a[i])
                .set_color(SET_A_COLOR)
                .scale(1.2)
            )

        self.play(*animations, run_time=2.5, rate_func=smooth)
        self.play(*[mob.animate.scale(1/1.2) for mob in number_mobs_a])
        self.wait(2)

        # Clear screen for next concept
        self.play(
            *[FadeOut(mob) for mob in self.mobjects]
        )
        self.wait(0.5)

        # ===== SCREEN 3: SET B ONLY (CLEAN SCREEN) =====
        screen_title_b = Text("Set B", font_size=50, color=SET_B_COLOR, weight=BOLD)
        screen_title_b.to_edge(UP, buff=0.4)

        set_b_notation = MathTex(
            r"B = \{4, 5, 6, 7, 8\}",
            font_size=42,
            color=SET_B_COLOR
        ).next_to(screen_title_b, DOWN, buff=0.3)

        self.play(Write(screen_title_b), Write(set_b_notation))
        self.wait(0.5)

        # Draw Set B circle (centered)
        circle_b_center = ORIGIN
        circle_b = self.create_sketchy_circle(2.2, circle_b_center, SET_B_COLOR)
        label_b = MathTex("B", font_size=60, color=SET_B_COLOR)
        label_b.move_to(circle_b_center + UP*2.8)

        self.play(Create(circle_b), Write(label_b), run_time=1.5)
        self.wait(0.5)

        # Numbers 4-8 appear and move INTO Set B
        numbers_b = [4, 5, 6, 7, 8]
        number_mobs_b = VGroup(*[
            Text(str(n), font_size=48, color=WHITE, weight=BOLD)
            for n in numbers_b
        ])

        # Start scattered
        np.random.seed(43)
        for mob in number_mobs_b:
            angle = np.random.uniform(0, TAU)
            distance = np.random.uniform(3.5, 4.5)
            mob.move_to(circle_b_center + np.array([
                distance * np.cos(angle),
                distance * np.sin(angle),
                0
            ]))

        self.play(
            LaggedStart(*[FadeIn(mob, scale=0.5) for mob in number_mobs_b], lag_ratio=0.1),
            run_time=1.5
        )
        self.wait(0.5)

        # Animate INTO the circle
        positions_b = self.circle_positions(circle_b_center, 1.3, len(numbers_b))
        animations = []
        for i, mob in enumerate(number_mobs_b):
            animations.append(
                mob.animate
                .move_to(positions_b[i])
                .set_color(SET_B_COLOR)
                .scale(1.2)
            )

        self.play(*animations, run_time=2.5, rate_func=smooth)
        self.play(*[mob.animate.scale(1/1.2) for mob in number_mobs_b])
        self.wait(2)

        # Clear screen
        self.play(*[FadeOut(mob) for mob in self.mobjects])
        self.wait(0.5)

        # ===== SCREEN 4: INTERSECTION A ∩ B (CLEAN SCREEN) =====
        intersection_title = Text("Intersection", font_size=50, color=INTERSECTION_COLOR, weight=BOLD)
        intersection_title.to_edge(UP, buff=0.4)

        intersection_notation = MathTex(
            r"A \cap B = \{4, 5\}",
            font_size=48,
            color=INTERSECTION_COLOR
        ).next_to(intersection_title, DOWN, buff=0.3)

        self.play(Write(intersection_title), Write(intersection_notation))
        self.wait(0.5)

        # Draw overlapping circles (focused on intersection)
        circle_a_left = LEFT * 1.5
        circle_b_right = RIGHT * 1.5

        circles_a_int = self.create_sketchy_circle(2.0, circle_a_left, SET_A_COLOR)
        circles_b_int = self.create_sketchy_circle(2.0, circle_b_right, SET_B_COLOR)

        label_a_int = MathTex("A", font_size=54, color=SET_A_COLOR)
        label_a_int.move_to(circle_a_left + UP*2.5)

        label_b_int = MathTex("B", font_size=54, color=SET_B_COLOR)
        label_b_int.move_to(circle_b_right + UP*2.5)

        self.play(
            Create(circles_a_int),
            Create(circles_b_int),
            Write(label_a_int),
            Write(label_b_int),
            run_time=2
        )
        self.wait(0.5)

        # Highlight intersection region
        intersection_region = Intersection(
            Circle(radius=2.0).move_to(circle_a_left),
            Circle(radius=2.0).move_to(circle_b_right),
            color=INTERSECTION_COLOR,
            fill_opacity=0.3,
            stroke_width=0
        )

        self.play(FadeIn(intersection_region))
        self.wait(0.5)

        # Show ONLY numbers 4 and 5 in intersection
        num_4 = Text("4", font_size=52, color=INTERSECTION_COLOR, weight=BOLD)
        num_5 = Text("5", font_size=52, color=INTERSECTION_COLOR, weight=BOLD)

        num_4.move_to(ORIGIN + UP*0.5)
        num_5.move_to(ORIGIN + DOWN*0.5)

        self.play(
            FadeIn(num_4, scale=0.5),
            FadeIn(num_5, scale=0.5)
        )
        self.wait(2)

        # Clear screen
        self.play(*[FadeOut(mob) for mob in self.mobjects])
        self.wait(0.5)

        # ===== SCREEN 5: UNION A ∪ B (CLEAN SCREEN) =====
        union_title = Text("Union", font_size=50, color=UNION_COLOR, weight=BOLD)
        union_title.to_edge(UP, buff=0.4)

        union_notation = MathTex(
            r"A \cup B = \{1, 2, 3, 4, 5, 6, 7, 8\}",
            font_size=44,
            color=UNION_COLOR
        ).next_to(union_title, DOWN, buff=0.3)

        self.play(Write(union_title), Write(union_notation))
        self.wait(0.5)

        # Draw overlapping circles (union highlighted)
        circles_a_union = self.create_sketchy_circle(2.0, circle_a_left, UNION_COLOR)
        circles_b_union = self.create_sketchy_circle(2.0, circle_b_right, UNION_COLOR)

        label_a_union = MathTex("A", font_size=54, color=UNION_COLOR)
        label_a_union.move_to(circle_a_left + UP*2.5)

        label_b_union = MathTex("B", font_size=54, color=UNION_COLOR)
        label_b_union.move_to(circle_b_right + UP*2.5)

        self.play(
            Create(circles_a_union),
            Create(circles_b_union),
            Write(label_a_union),
            Write(label_b_union),
            run_time=2
        )
        self.wait(0.5)

        # Show all numbers 1-8 in the union
        union_numbers = [1, 2, 3, 4, 5, 6, 7, 8]
        union_mobs = VGroup(*[
            Text(str(n), font_size=42, color=UNION_COLOR, weight=BOLD)
            for n in union_numbers
        ])

        # Position numbers in both circles
        # Set A only: 1, 2, 3 (left side)
        union_mobs[0].move_to(circle_a_left + LEFT*1.0 + UP*0.5)      # 1
        union_mobs[1].move_to(circle_a_left + LEFT*1.0 + DOWN*0.5)    # 2
        union_mobs[2].move_to(circle_a_left + LEFT*1.0)               # 3

        # Intersection: 4, 5 (center)
        union_mobs[3].move_to(ORIGIN + UP*0.4)                        # 4
        union_mobs[4].move_to(ORIGIN + DOWN*0.4)                      # 5

        # Set B only: 6, 7, 8 (right side)
        union_mobs[5].move_to(circle_b_right + RIGHT*1.0 + UP*0.5)    # 6
        union_mobs[6].move_to(circle_b_right + RIGHT*1.0 + DOWN*0.5)  # 7
        union_mobs[7].move_to(circle_b_right + RIGHT*1.0)             # 8

        self.play(
            LaggedStart(*[FadeIn(mob, scale=0.5) for mob in union_mobs], lag_ratio=0.1),
            run_time=2
        )
        self.wait(3)

        # Final fade out
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=1.5)
        self.wait(0.5)

    def create_sketchy_circle(self, radius, center, color):
        """Create hand-drawn circle effect with 3 overlapping circles"""
        np.random.seed(123)
        return VGroup(*[
            Circle(
                radius=radius + 0.04*i,
                color=color,
                stroke_width=3,
                stroke_opacity=0.8
            ).move_to(center + 0.04*np.array([
                np.random.randn(),
                np.random.randn(),
                0
            ]))
            for i in range(3)
        ])

    def circle_positions(self, center, radius, count):
        """Calculate evenly spaced positions around a circle"""
        positions = []
        for i in range(count):
            angle = i * TAU / count - PI/2  # Start from top
            pos = center + np.array([
                radius * np.cos(angle),
                radius * np.sin(angle),
                0
            ])
            positions.append(pos)
        return positions
