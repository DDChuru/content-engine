"""
Complete Cambridge IGCSE Sets Visualization
C1.2 - Set Theory with Animated Venn Diagrams

Production-quality Manim animation showing:
- Universal set with scattered numbers
- Set A with numbers animating into position
- Set B with overlapping region
- Intersection highlighting
- Union demonstration
- Element counting

Follows VISUALIZATION-STANDARDS.md
"""

from manim import *
import numpy as np

class SetsComplete(Scene):
    def construct(self):
        # Standard colors (from VISUALIZATION-STANDARDS.md)
        UNIVERSAL_COLOR = GRAY
        SET_A_COLOR = BLUE
        SET_B_COLOR = GREEN
        INTERSECTION_COLOR = YELLOW
        UNION_COLOR = ORANGE

        # ===== SCENE 1: Title and Setup =====
        title = Text("Set Theory", font_size=60, color=WHITE, weight=BOLD)
        subtitle = Text("Venn Diagrams", font_size=36, color="#aaaaaa")
        subtitle.next_to(title, DOWN)

        self.play(Write(title))
        self.play(FadeIn(subtitle, shift=UP*0.2))
        self.wait(1)
        self.play(
            title.animate.scale(0.5).to_corner(UL, buff=0.5),
            FadeOut(subtitle)
        )
        self.wait(0.5)

        # ===== SCENE 2: Universal Set =====
        universal = Rectangle(
            width=11, height=6,
            color=UNIVERSAL_COLOR,
            stroke_width=3,
            stroke_opacity=0.7
        )
        universal_label = MathTex(
            r"\xi \text{ (Universal Set)}",
            font_size=28,
            color=UNIVERSAL_COLOR
        ).next_to(universal, UP+LEFT, buff=0.15)

        self.play(Create(universal), Write(universal_label))
        self.wait(0.5)

        # ===== SCENE 3: Numbers Appear Scattered =====
        numbers = list(range(1, 11))
        number_mobs = VGroup(*[
            Text(str(n), font_size=38, color=WHITE, weight=BOLD)
            for n in numbers
        ])

        # Random but reproducible positions
        np.random.seed(42)
        for mob in number_mobs:
            mob.move_to(
                universal.get_center() +
                np.array([
                    np.random.uniform(-4.8, 4.8),
                    np.random.uniform(-2.5, 2.5),
                    0
                ])
            )

        self.play(
            LaggedStart(
                *[FadeIn(mob, scale=0.3) for mob in number_mobs],
                lag_ratio=0.08
            ),
            run_time=2
        )
        self.wait(1)

        # ===== SCENE 4: Define and Draw Set A =====
        set_a_def = MathTex(
            r"A = \{1, 2, 3, 4, 5\}",
            font_size=36,
            color=SET_A_COLOR
        )
        set_a_def.to_corner(UL, buff=0.5).shift(DOWN*1.2)

        self.play(Write(set_a_def))
        self.wait(0.5)

        # Draw Set A circle with hand-drawn effect
        circle_a_center = LEFT * 2.2
        circles_a = self.create_sketchy_circle(1.8, circle_a_center, SET_A_COLOR)
        label_a = MathTex("A", font_size=54, color=SET_A_COLOR)
        label_a.move_to(circle_a_center + UP*2.3)

        self.play(
            Create(circles_a),
            Write(label_a),
            run_time=1.8
        )
        self.wait(0.5)

        # ===== SCENE 5: Animate Numbers INTO Set A =====
        # This is the KEY animation - numbers move into their set!
        set_a_indices = [0, 1, 2, 3, 4]  # Numbers 1, 2, 3, 4, 5
        a_positions = self.circle_positions(circle_a_center, 1.1, len(set_a_indices))

        # Add subtle "whoosh" effect as numbers move
        animations = []
        for i, idx in enumerate(set_a_indices):
            animations.append(
                number_mobs[idx].animate
                .move_to(a_positions[i])
                .set_color(SET_A_COLOR)
                .scale(1.1)
            )

        self.play(*animations, run_time=2, rate_func=smooth)

        # Scale back to normal
        self.play(*[number_mobs[idx].animate.scale(1/1.1) for idx in set_a_indices])
        self.wait(1)

        # Show element count for A
        n_a = MathTex(r"n(A) = 5", font_size=32, color=SET_A_COLOR)
        n_a.next_to(set_a_def, DOWN, aligned_edge=LEFT, buff=0.2)
        self.play(FadeIn(n_a, shift=RIGHT*0.3))
        self.wait(1)

        # ===== SCENE 6: Define and Draw Set B =====
        set_b_def = MathTex(
            r"B = \{4, 5, 6, 7, 8\}",
            font_size=36,
            color=SET_B_COLOR
        )
        set_b_def.next_to(n_a, DOWN, aligned_edge=LEFT, buff=0.3)

        self.play(Write(set_b_def))
        self.wait(0.5)

        # Draw Set B circle (overlapping with A)
        circle_b_center = RIGHT * 2.2
        circles_b = self.create_sketchy_circle(1.8, circle_b_center, SET_B_COLOR)
        label_b = MathTex("B", font_size=54, color=SET_B_COLOR)
        label_b.move_to(circle_b_center + UP*2.3)

        self.play(
            Create(circles_b),
            Write(label_b),
            run_time=1.8
        )
        self.wait(0.5)

        # ===== SCENE 7: Highlight Intersection (4 and 5) =====
        # Flash numbers 4 and 5 to show they're in BOTH sets
        self.play(
            Indicate(number_mobs[3], color=INTERSECTION_COLOR, scale_factor=1.5),
            Indicate(number_mobs[4], color=INTERSECTION_COLOR, scale_factor=1.5)
        )
        self.wait(0.5)

        # Move 4 and 5 to intersection region (between circles)
        intersection_center = (circle_a_center + circle_b_center) / 2
        intersection_positions = [
            intersection_center + UP*0.4,
            intersection_center + DOWN*0.4
        ]

        self.play(
            number_mobs[3].animate
            .move_to(intersection_positions[0])
            .set_color(INTERSECTION_COLOR)
            .scale(1.2),
            number_mobs[4].animate
            .move_to(intersection_positions[1])
            .set_color(INTERSECTION_COLOR)
            .scale(1.2),
            run_time=1.5
        )
        self.wait(0.5)

        # Scale back
        self.play(
            number_mobs[3].animate.scale(1/1.2),
            number_mobs[4].animate.scale(1/1.2)
        )

        # ===== SCENE 8: Move Numbers into Set B =====
        # Numbers 6, 7, 8 move into B (not in A)
        set_b_only_indices = [5, 6, 7]  # Numbers 6, 7, 8
        b_positions = self.circle_positions(
            circle_b_center + RIGHT*0.8,
            1.0,
            len(set_b_only_indices)
        )

        animations = []
        for i, idx in enumerate(set_b_only_indices):
            animations.append(
                number_mobs[idx].animate
                .move_to(b_positions[i])
                .set_color(SET_B_COLOR)
                .scale(1.1)
            )

        self.play(*animations, run_time=2, rate_func=smooth)
        self.play(*[number_mobs[idx].animate.scale(1/1.1) for idx in set_b_only_indices])
        self.wait(1)

        # Show element count for B
        n_b = MathTex(r"n(B) = 5", font_size=32, color=SET_B_COLOR)
        n_b.next_to(set_b_def, DOWN, aligned_edge=LEFT, buff=0.2)
        self.play(FadeIn(n_b, shift=RIGHT*0.3))
        self.wait(1)

        # ===== SCENE 9: Show Intersection =====
        intersection_def = MathTex(
            r"A \cap B = \{4, 5\}",
            font_size=40,
            color=INTERSECTION_COLOR
        )
        intersection_def.to_edge(DOWN, buff=1)

        # Draw subtle glow around intersection region
        intersection_region = Intersection(
            Circle(radius=1.8).move_to(circle_a_center),
            Circle(radius=1.8).move_to(circle_b_center),
            color=INTERSECTION_COLOR,
            fill_opacity=0.2,
            stroke_width=0
        )

        self.play(
            FadeIn(intersection_region),
            Write(intersection_def)
        )
        self.wait(2)

        # Show count
        n_intersection = MathTex(
            r"n(A \cap B) = 2",
            font_size=32,
            color=INTERSECTION_COLOR
        )
        n_intersection.next_to(intersection_def, DOWN, buff=0.3)
        self.play(Write(n_intersection))
        self.wait(2)

        self.play(
            FadeOut(intersection_def),
            FadeOut(n_intersection),
            FadeOut(intersection_region)
        )

        # ===== SCENE 10: Show Union =====
        union_def = MathTex(
            r"A \cup B = \{1, 2, 3, 4, 5, 6, 7, 8\}",
            font_size=38,
            color=UNION_COLOR
        )
        union_def.to_edge(DOWN, buff=1)

        # Highlight all numbers in A or B (1-8)
        in_union_indices = list(range(8))  # 1-8
        self.play(
            Write(union_def),
            *[number_mobs[i].animate.set_color(UNION_COLOR) for i in in_union_indices],
            circles_a.animate.set_color(UNION_COLOR),
            circles_b.animate.set_color(UNION_COLOR),
            label_a.animate.set_color(UNION_COLOR),
            label_b.animate.set_color(UNION_COLOR)
        )
        self.wait(1.5)

        # Show count
        n_union = MathTex(
            r"n(A \cup B) = 8",
            font_size=32,
            color=UNION_COLOR
        )
        n_union.next_to(union_def, DOWN, buff=0.3)
        self.play(Write(n_union))
        self.wait(2)

        # ===== SCENE 11: Summary =====
        self.play(
            *[FadeOut(mob) for mob in [union_def, n_union]]
        )

        # Show all counts together
        summary_box = Rectangle(
            width=3.5, height=2.5,
            color=WHITE,
            stroke_width=2,
            fill_opacity=0.1
        ).to_corner(DR, buff=0.5)

        summary_title = Text("Summary", font_size=28, weight=BOLD, color=WHITE)
        summary_title.next_to(summary_box, UP, buff=0.2)

        counts = VGroup(
            MathTex(r"n(A) = 5", font_size=28, color=SET_A_COLOR),
            MathTex(r"n(B) = 5", font_size=28, color=SET_B_COLOR),
            MathTex(r"n(A \cap B) = 2", font_size=28, color=INTERSECTION_COLOR),
            MathTex(r"n(A \cup B) = 8", font_size=28, color=UNION_COLOR)
        )
        counts.arrange(DOWN, aligned_edge=LEFT, buff=0.25)
        counts.move_to(summary_box.get_center())

        self.play(
            Create(summary_box),
            Write(summary_title)
        )
        self.play(
            LaggedStart(*[FadeIn(c, shift=LEFT*0.2) for c in counts], lag_ratio=0.2)
        )
        self.wait(3)

        # Final fade out
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=1.5)
        self.wait(0.5)

    def create_sketchy_circle(self, radius, center, color):
        """Create hand-drawn circle effect with 3 overlapping circles"""
        np.random.seed(123)  # Consistent hand-drawn look
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
