"""
Manim Animation: Set Notation
Cambridge IGCSE Mathematics C1.2
"""

from manim import *

class SetNotation(Scene):
    def construct(self):
        # Set background to black
        self.camera.background_color = BLACK

        # Title
        title = Text("Set Notation", font_size=60, color=WHITE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(0.5)

        # Define sets
        set_a = MathTex(r"A = \{1, 2, 3, 4, 5\}", font_size=48, color="#1e88e5")
        set_b = MathTex(r"B = \{4, 5, 6, 7, 8\}", font_size=48, color="#4caf50")

        set_a.shift(UP * 1.5)
        set_b.shift(UP * 0.5)

        self.play(Write(set_a))
        self.wait(0.5)
        self.play(Write(set_b))
        self.wait(1)

        # Union
        union_label = Text("Union (A ∪ B):", font_size=36, color=YELLOW).shift(DOWN * 0.5)
        union_result = MathTex(r"A \cup B = \{1, 2, 3, 4, 5, 6, 7, 8\}",
                               font_size=40, color=YELLOW).shift(DOWN * 1.2)

        self.play(FadeIn(union_label))
        self.play(Write(union_result))
        self.wait(1.5)

        # Fade out union
        self.play(FadeOut(union_label), FadeOut(union_result))
        self.wait(0.3)

        # Intersection
        intersection_label = Text("Intersection (A ∩ B):", font_size=36, color=ORANGE).shift(DOWN * 0.5)
        intersection_result = MathTex(r"A \cap B = \{4, 5\}",
                                      font_size=40, color=ORANGE).shift(DOWN * 1.2)

        self.play(FadeIn(intersection_label))
        self.play(Write(intersection_result))
        self.wait(1.5)

        # Fade out intersection
        self.play(FadeOut(intersection_label), FadeOut(intersection_result))
        self.wait(0.3)

        # Number of elements
        n_a_label = Text("Number of elements:", font_size=36, color="#ff5722").shift(DOWN * 0.5)
        n_a = MathTex(r"n(A) = 5", font_size=40, color="#ff5722").shift(DOWN * 1.2 + LEFT * 2)
        n_b = MathTex(r"n(B) = 5", font_size=40, color="#ff5722").shift(DOWN * 1.2 + RIGHT * 2)

        self.play(FadeIn(n_a_label))
        self.play(Write(n_a), Write(n_b))
        self.wait(2)

        # Fade out everything
        self.play(
            FadeOut(title),
            FadeOut(set_a),
            FadeOut(set_b),
            FadeOut(n_a_label),
            FadeOut(n_a),
            FadeOut(n_b)
        )
        self.wait(0.5)
