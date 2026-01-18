"""
Sets Lesson - Part 2: Practice Questions and Challenges
"""

from manim import *
from sets_lesson import SmartVennDiagram, SmartPositioner


class PracticeQuestion1(Scene):
    """Scene 11: Practice Question 1 - Intersection"""

    def construct(self):
        title = Text("Practice Question 1", font_size=44, color=ORANGE)
        title.to_edge(UP)

        # Question box
        question_box = Rectangle(width=11, height=2.5, color=BLUE_A, fill_opacity=0.1)
        question_box.next_to(title, DOWN, buff=0.4)

        question = VGroup(
            MathTex(r"\text{Given: } \xi = \{1, 2, 3, 4, 5, 6, 7, 8\}", font_size=30, color=PURPLE_C),
            MathTex(r"C = \{2, 4, 6, 8\} \text{ (even numbers)}", font_size=28, color=RED_C),
            MathTex(r"D = \{1, 2, 3, 4\}", font_size=28, color=GREEN_C),
            MathTex(r"\text{Find: } C \cap D", font_size=30, color=BLUE_C),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        question.move_to(question_box.get_center())

        # Universal set box
        universal_box = Rectangle(width=10, height=4, color=PURPLE_C, fill_opacity=0.05)
        universal_box.next_to(question_box, DOWN, buff=0.5)

        xi_label = MathTex(r"\xi", font_size=28, color=PURPLE_C)
        xi_label.next_to(universal_box, UP + LEFT, buff=-0.4)

        # Venn diagram
        venn = SmartVennDiagram(
            set_a_elements=[2, 4, 6, 8],
            set_b_elements=[1, 2, 3, 4],
            set_a_label="C",
            set_b_label="D"
        )
        venn.scale(0.6).move_to(universal_box.get_center())

        # Answer
        answer = MathTex(
            r"\text{Answer: } C \cap D = \{2, 4\}",
            font_size=34,
            color=ORANGE
        )
        answer.next_to(universal_box, DOWN, buff=0.5)

        # Animate
        self.play(Write(title))
        self.play(Create(question_box))

        for line in question:
            self.play(Write(line), run_time=0.6)

        self.wait(0.5)
        self.play(Create(universal_box), Write(xi_label))

        self.play(
            Create(venn.circle_a),
            Create(venn.circle_b),
            Write(venn.label_a),
            Write(venn.label_b)
        )

        self.play(
            LaggedStart(*[FadeIn(elem, scale=0.5) for elem in venn.element_mobjects], lag_ratio=0.1)
        )

        # Highlight intersection
        intersection_elems = venn.get_intersection_elements()
        self.wait(0.5)
        self.play(
            *[elem.animate.set_color(ORANGE).scale(1.4) for elem in intersection_elems],
            run_time=1
        )

        self.play(Write(answer))
        self.wait(2)


class PracticeQuestion2(Scene):
    """Scene 12: Practice Question 2 - Union"""

    def construct(self):
        title = Text("Practice Question 2", font_size=44, color=ORANGE)
        title.to_edge(UP)

        # Question box
        question_box = Rectangle(width=11, height=2.5, color=BLUE_A, fill_opacity=0.1)
        question_box.next_to(title, DOWN, buff=0.4)

        question = VGroup(
            MathTex(r"\text{Given: } \xi = \{1, 2, 3, 4, 5, 6, 7, 8\}", font_size=30, color=PURPLE_C),
            MathTex(r"E = \{1, 3, 5, 7\} \text{ (odd numbers)}", font_size=28, color=RED_C),
            MathTex(r"F = \{2, 3, 5, 7\}", font_size=28, color=GREEN_C),
            MathTex(r"\text{Find: } E \cup F", font_size=30, color=BLUE_C),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        question.move_to(question_box.get_center())

        # Universal set box
        universal_box = Rectangle(width=10, height=4, color=PURPLE_C, fill_opacity=0.05)
        universal_box.next_to(question_box, DOWN, buff=0.5)

        xi_label = MathTex(r"\xi", font_size=28, color=PURPLE_C)
        xi_label.next_to(universal_box, UP + LEFT, buff=-0.4)

        # Venn diagram with shading for union
        circle_e = Circle(radius=0.9, color=RED_C, fill_opacity=0.4).shift(LEFT * 0.6)
        circle_f = Circle(radius=0.9, color=GREEN_C, fill_opacity=0.4).shift(RIGHT * 0.6)

        label_e = Text("E", color=RED_C).scale(0.7).next_to(circle_e, UP, buff=0.2)
        label_f = Text("F", color=GREEN_C).scale(0.7).next_to(circle_f, UP, buff=0.2)

        # Position elements
        positioner = SmartPositioner()
        elements = VGroup()

        # E only: 1
        elem_1 = Text("1", font_size=32).move_to(circle_e.get_center() + LEFT * 0.5)
        elements.add(elem_1)

        # Intersection: 3, 5, 7
        elem_3 = Text("3", font_size=32).move_to(ORIGIN + UP * 0.3)
        elem_5 = Text("5", font_size=32).move_to(ORIGIN + RIGHT * 0.3)
        elem_7 = Text("7", font_size=32).move_to(ORIGIN + DOWN * 0.3)
        elements.add(elem_3, elem_5, elem_7)

        # F only: 2
        elem_2 = Text("2", font_size=32).move_to(circle_f.get_center() + RIGHT * 0.5)
        elements.add(elem_2)

        # Elements outside (grayed out)
        elem_4 = Text("4", font_size=26, color=GRAY).move_to(universal_box.get_corner(UL) + DR * 0.7)
        elem_6 = Text("6", font_size=26, color=GRAY).move_to(universal_box.get_corner(UR) + DL * 0.7)
        elem_8 = Text("8", font_size=26, color=GRAY).move_to(universal_box.get_corner(DL) + UR * 0.7)

        venn_group = VGroup(circle_e, circle_f, label_e, label_f, elements)
        venn_group.move_to(universal_box.get_center())

        # Answer
        answer = MathTex(
            r"\text{Answer: } E \cup F = \{1, 2, 3, 5, 7\}",
            font_size=34,
            color=ORANGE
        )
        answer.next_to(universal_box, DOWN, buff=0.5)

        # Animate
        self.play(Write(title))
        self.play(Create(question_box))

        for line in question:
            self.play(Write(line), run_time=0.6)

        self.wait(0.5)
        self.play(Create(universal_box), Write(xi_label))

        self.play(
            Create(circle_e),
            Create(circle_f),
            Write(label_e),
            Write(label_f)
        )

        self.play(
            LaggedStart(*[FadeIn(elem, scale=0.5) for elem in elements], lag_ratio=0.15)
        )

        self.play(FadeIn(elem_4), FadeIn(elem_6), FadeIn(elem_8))

        self.wait(0.5)
        self.play(Write(answer))
        self.wait(2)


class SpotTheError(Scene):
    """Scene 13: Spot the Error Challenge"""

    def construct(self):
        title = Text("Challenge: Spot the Error!", font_size=48, color=RED_C)
        subtitle = Text(
            "Can you find what's wrong with this universal set?",
            font_size=28,
            color=GRAY
        )
        subtitle.next_to(title, DOWN, buff=0.3)
        title.to_edge(UP, buff=0.5)

        # Question box
        question_box = Rectangle(width=11, height=2.2, color=BLUE_A, fill_opacity=0.1)
        question_box.next_to(subtitle, DOWN, buff=0.5)

        question = VGroup(
            MathTex(r"\text{Given: } \xi = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}", font_size=28, color=PURPLE_C),
            MathTex(r"P = \{2, 4, 6, 8, 9\} \text{ (even numbers)}", font_size=26, color=RED_C),
            MathTex(r"Q = \{5, 10, 15\} \text{ (multiples of 5)}", font_size=26, color=GREEN_C),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        question.move_to(question_box.get_center())

        # Universal set box
        universal_box = Rectangle(width=10, height=3.5, color=PURPLE_C, fill_opacity=0.05)
        universal_box.next_to(question_box, DOWN, buff=0.5)

        xi_label = MathTex(r"\xi", font_size=28, color=PURPLE_C)
        xi_label.next_to(universal_box, UP + LEFT, buff=-0.4)

        # Venn diagram with ERRORS
        venn = SmartVennDiagram(
            set_a_elements=[2, 4, 6, 8, 9],  # ERROR: 9 is odd!
            set_b_elements=[5, 10, 15],  # ERROR: 15 not in universal set!
            set_a_label="P",
            set_b_label="Q"
        )
        venn.scale(0.55).move_to(universal_box.get_center())

        # Outside elements
        outside = VGroup(
            Text("1", font_size=24, color=GRAY).move_to(universal_box.get_corner(UL) + DR * 0.6),
            Text("3", font_size=24, color=GRAY).move_to(universal_box.get_corner(UR) + DL * 0.6),
            Text("7", font_size=24, color=GRAY).move_to(universal_box.get_corner(DL) + UR * 0.6),
        )

        # Animate
        self.play(Write(title))
        self.play(FadeIn(subtitle, shift=UP * 0.2))
        self.wait(0.5)

        self.play(Create(question_box))
        for line in question:
            self.play(Write(line), run_time=0.6)

        self.play(Create(universal_box), Write(xi_label))

        self.play(
            Create(venn.circle_a),
            Create(venn.circle_b),
            Write(venn.label_a),
            Write(venn.label_b)
        )

        self.play(
            LaggedStart(*[FadeIn(elem, scale=0.5) for elem in venn.element_mobjects], lag_ratio=0.1)
        )

        self.play(*[FadeIn(elem) for elem in outside])

        self.wait(3)  # Pause for students to find errors


class ErrorRevealed(Scene):
    """Scene 13a: Errors Revealed"""

    def construct(self):
        title = Text("Error Found!", font_size=48, color=GREEN_C)
        subtitle = Text("Let's highlight the mistakes", font_size=28, color=GRAY)
        subtitle.next_to(title, DOWN, buff=0.3)
        title.to_edge(UP, buff=0.5)

        # Same setup as previous scene
        question_box = Rectangle(width=11, height=2.2, color=BLUE_A, fill_opacity=0.1)
        question_box.next_to(subtitle, DOWN, buff=0.5)

        question = VGroup(
            MathTex(r"\text{Given: } \xi = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}", font_size=28, color=PURPLE_C),
            MathTex(r"P = \{2, 4, 6, 8, 9\} \text{ (even numbers)}", font_size=26, color=RED_C),
            MathTex(r"Q = \{5, 10, 15\} \text{ (multiples of 5)}", font_size=26, color=GREEN_C),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        question.move_to(question_box.get_center())

        universal_box = Rectangle(width=10, height=3.5, color=PURPLE_C, fill_opacity=0.05)
        universal_box.next_to(question_box, DOWN, buff=0.5)

        xi_label = MathTex(r"\xi", font_size=28, color=PURPLE_C)
        xi_label.next_to(universal_box, UP + LEFT, buff=-0.4)

        # Build diagram first (no animation)
        venn = SmartVennDiagram(
            set_a_elements=[2, 4, 6, 8, 9],
            set_b_elements=[5, 10, 15],
            set_a_label="P",
            set_b_label="Q"
        )
        venn.scale(0.55).move_to(universal_box.get_center())

        outside = VGroup(
            Text("1", font_size=24, color=GRAY).move_to(universal_box.get_corner(UL) + DR * 0.6),
            Text("3", font_size=24, color=GRAY).move_to(universal_box.get_corner(UR) + DL * 0.6),
            Text("7", font_size=24, color=GRAY).move_to(universal_box.get_corner(DL) + UR * 0.6),
        )

        self.add(title, subtitle, question_box, question, universal_box, xi_label, venn, outside)

        # Find and highlight errors
        error_9 = None
        error_15 = None

        for elem in venn.element_mobjects:
            if elem.text == "9":
                error_9 = elem
            elif elem.text == "15":
                error_15 = elem

        # Highlight error 1: 9
        if error_9:
            circle_9 = Circle(radius=0.25, color=RED_C, stroke_width=4).move_to(error_9.get_center())
            self.play(
                Create(circle_9),
                error_9.animate.set_color(RED_C),
                run_time=1
            )

        # Highlight error 2: 15
        if error_15:
            circle_15 = Circle(radius=0.3, color=RED_C, stroke_width=4).move_to(error_15.get_center())
            self.play(
                Create(circle_15),
                error_15.animate.set_color(RED_C),
                run_time=1
            )

        # Error explanations
        error_text = VGroup(
            MathTex(r"\times \text{ Error 1: 9 is ODD, not even!}", font_size=28, color=RED_C),
            MathTex(r"\times \text{ Error 2: 15 is NOT in the universal set!}", font_size=28, color=RED_C),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        error_text.next_to(universal_box, DOWN, buff=0.6)

        self.play(Write(error_text[0]))
        self.wait(1)
        self.play(Write(error_text[1]))

        self.wait(2)


class TrueFalse1(Scene):
    """Scene 14: True/False #1 - Vowels"""

    def construct(self):
        title = Text("True or False?", font_size=48, color=PURPLE_C)
        title.to_edge(UP)

        # Question
        question_box = Rectangle(width=11, height=2, color=BLUE_A, fill_opacity=0.1)
        question_box.next_to(title, DOWN, buff=0.5)

        question = VGroup(
            Text('Given: M = {vowels in "MATHEMATICS"}', font_size=28, color=PURPLE_C),
            Text('       N = {vowels in "SCIENCE"}', font_size=28, color=PURPLE_C),
            MathTex(r"\text{Statement: } M \cap N = \{A, E, I\}", font_size=30, color=BLUE_C),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        question.move_to(question_box.get_center())

        # Venn diagram (smaller, no universal set)
        diagram_box = Rectangle(width=10, height=3.5, color=PURPLE_C, fill_opacity=0.05)
        diagram_box.next_to(question_box, DOWN, buff=0.6)

        # M = {A, E, I}, N = {E, I} (NO A!)
        circle_m = Circle(radius=0.9, color=RED_C, fill_opacity=0.2).shift(LEFT * 0.6)
        circle_n = Circle(radius=0.9, color=GREEN_C, fill_opacity=0.2).shift(RIGHT * 0.6)

        label_m = Text("M", color=RED_C).scale(0.7).next_to(circle_m, UP, buff=0.2)
        label_n = Text("N", color=GREEN_C).scale(0.7).next_to(circle_n, UP, buff=0.2)

        # A in M only (highlighted as ERROR)
        elem_a = Text("A", font_size=36, color=RED_C).move_to(circle_m.get_center() + LEFT * 0.5)
        circle_a_error = Circle(radius=0.3, color=RED_C, stroke_width=3).move_to(elem_a.get_center())

        # E, I in intersection
        elem_e = Text("E", font_size=32).move_to(ORIGIN + UP * 0.25)
        elem_i = Text("I", font_size=32).move_to(ORIGIN + DOWN * 0.25)

        venn_group = VGroup(circle_m, circle_n, label_m, label_n, elem_a, elem_e, elem_i)
        venn_group.move_to(diagram_box.get_center())

        # Answer
        answer = MathTex(
            r"\times \text{ FALSE! SCIENCE has no 'A' - only E and I}",
            font_size=30,
            color=RED_C
        )
        correction = Text("Correct answer: M ∩ N = {E, I}", font_size=24, color=GRAY)

        answer_group = VGroup(answer, correction).arrange(DOWN, buff=0.2)
        answer_group.next_to(diagram_box, DOWN, buff=0.5)

        # Animate
        self.play(Write(title))
        self.play(Create(question_box))

        for line in question:
            self.play(Write(line), run_time=0.6)

        self.play(Create(diagram_box))
        self.play(Create(circle_m), Create(circle_n), Write(label_m), Write(label_n))
        self.play(FadeIn(elem_a), FadeIn(elem_e), FadeIn(elem_i))

        self.wait(1)

        # Highlight error
        self.play(Create(circle_a_error), elem_a.animate.set_color(RED_C).scale(1.2))

        self.play(Write(answer))
        self.play(FadeIn(correction, shift=UP * 0.2))

        self.wait(2)


class TrueFalse2(Scene):
    """Scene 15: True/False #2 - Subsets"""

    def construct(self):
        title = Text("True or False?", font_size=48, color=PURPLE_C)
        title.to_edge(UP)

        # Question
        question_box = Rectangle(width=11, height=2.2, color=BLUE_A, fill_opacity=0.1)
        question_box.next_to(title, DOWN, buff=0.5)

        question = VGroup(
            Text("Given: X = {prime numbers less than 10}", font_size=28, color=PURPLE_C),
            Text("       Y = {odd numbers less than 10}", font_size=28, color=PURPLE_C),
            MathTex(r"\text{Statement: } X \subset Y \text{ (X is a subset of Y)}", font_size=28, color=BLUE_C),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        question.move_to(question_box.get_center())

        # Venn diagram
        diagram_box = Rectangle(width=10, height=3.3, color=PURPLE_C, fill_opacity=0.05)
        diagram_box.next_to(question_box, DOWN, buff=0.6)

        # X = {2, 3, 5, 7}, Y = {1, 3, 5, 7, 9}
        circle_x = Circle(radius=0.9, color=RED_C, fill_opacity=0.2).shift(LEFT * 0.6)
        circle_y = Circle(radius=0.9, color=GREEN_C, fill_opacity=0.2).shift(RIGHT * 0.6)

        label_x = Text("X", color=RED_C).scale(0.7).next_to(circle_x, UP, buff=0.2)
        label_y = Text("Y", color=GREEN_C).scale(0.7).next_to(circle_y, UP, buff=0.2)

        # 2 in X only (ERROR - prime but not odd)
        elem_2 = Text("2", font_size=36, color=RED_C).move_to(circle_x.get_center() + LEFT * 0.5)
        circle_2_error = Circle(radius=0.28, color=RED_C, stroke_width=3).move_to(elem_2.get_center())

        # Intersection (3, 5, 7)
        elem_3 = Text("3", font_size=30).move_to(ORIGIN + UP * 0.3)
        elem_5 = Text("5", font_size=30).move_to(ORIGIN + RIGHT * 0.2)
        elem_7 = Text("7", font_size=30).move_to(ORIGIN + DOWN * 0.3)

        # Y only (1, 9)
        elem_1 = Text("1", font_size=30).move_to(circle_y.get_center() + RIGHT * 0.3 + UP * 0.3)
        elem_9 = Text("9", font_size=30).move_to(circle_y.get_center() + RIGHT * 0.3 + DOWN * 0.3)

        venn_group = VGroup(
            circle_x, circle_y, label_x, label_y,
            elem_2, elem_3, elem_5, elem_7, elem_1, elem_9
        )
        venn_group.move_to(diagram_box.get_center())

        # Answer
        answer = MathTex(
            r"\times \text{ FALSE! 2 is prime but NOT odd}",
            font_size=30,
            color=RED_C
        )
        answer.next_to(diagram_box, DOWN, buff=0.5)

        # Animate
        self.play(Write(title))
        self.play(Create(question_box))

        for line in question:
            self.play(Write(line), run_time=0.6)

        self.play(Create(diagram_box))
        self.play(Create(circle_x), Create(circle_y), Write(label_x), Write(label_y))
        self.play(
            LaggedStart(
                *[FadeIn(elem, scale=0.5) for elem in [elem_2, elem_3, elem_5, elem_7, elem_1, elem_9]],
                lag_ratio=0.2
            )
        )

        self.wait(1)

        # Highlight error
        self.play(Create(circle_2_error), elem_2.animate.set_color(RED_C).scale(1.2))

        self.play(Write(answer))

        self.wait(2)
