from manim import *

class SetsVennCollision(Scene):
    """
    INTENTIONALLY BAD VERSION - Shows collision issues
    This is what the agent creates BEFORE learning spatial rules
    """
    def construct(self):
        # Title
        title = Text("Find A ∩ B", font_size=48, color=BLUE, weight=BOLD)
        title.to_edge(UP)
        self.play(Write(title), run_time=1)
        self.wait(0.5)

        # Create Venn diagram
        circle_a = Circle(radius=1.5, color=BLUE, fill_opacity=0.2)
        circle_a.shift(LEFT * 1.5)

        circle_b = Circle(radius=1.5, color=GREEN, fill_opacity=0.2)
        circle_b.shift(RIGHT * 1.5)

        label_a = Text("A", font_size=40, color=BLUE, weight=BOLD)
        label_a.next_to(circle_a, UP)

        label_b = Text("B", font_size=40, color=GREEN, weight=BOLD)
        label_b.next_to(circle_b, UP)

        self.play(
            Create(circle_a),
            Create(circle_b),
            Write(label_a),
            Write(label_b),
            run_time=2
        )
        self.wait(0.5)

        # Place numbers in circles - THESE WILL COLLIDE!
        # Set A only: 1, 2, 3
        num_1 = Text("1", font_size=36, color=WHITE)
        num_1.move_to(circle_a.get_center() + LEFT * 0.8 + UP * 0.5)

        num_2 = Text("2", font_size=36, color=WHITE)
        num_2.move_to(circle_a.get_center() + LEFT * 0.8)

        num_3 = Text("3", font_size=36, color=WHITE)
        num_3.move_to(circle_a.get_center() + LEFT * 0.8 + DOWN * 0.5)

        # Intersection: 4, 5 - POSITIONED WHERE ARROW WILL COLLIDE
        num_4 = Text("4", font_size=36, color=YELLOW, weight=BOLD)
        num_4.move_to([0, 0.3, 0])  # Center position - COLLISION ZONE!

        num_5 = Text("5", font_size=36, color=YELLOW, weight=BOLD)
        num_5.move_to([0, -0.3, 0])  # Center position - COLLISION ZONE!

        # Set B only: 6, 7, 8
        num_6 = Text("6", font_size=36, color=WHITE)
        num_6.move_to(circle_b.get_center() + RIGHT * 0.8 + UP * 0.5)

        num_7 = Text("7", font_size=36, color=WHITE)
        num_7.move_to(circle_b.get_center() + RIGHT * 0.8)

        num_8 = Text("8", font_size=36, color=WHITE)
        num_8.move_to(circle_b.get_center() + RIGHT * 0.8 + DOWN * 0.5)

        # Show all numbers
        self.play(
            *[Write(num) for num in [num_1, num_2, num_3, num_4, num_5, num_6, num_7, num_8]],
            run_time=2
        )
        self.wait(0.5)

        # THE COLLISION: Arrow and label that collide with 4 and 5
        # This is the mistake the agent makes before learning!
        intersection_label = Text("Intersection", font_size=32, color=YELLOW)
        intersection_label.move_to([0, -0.5, 0])  # COLLIDES WITH num_5!

        arrow = Arrow(
            start=intersection_label.get_top() + UP * 0.2,
            end=[0, 0.1, 0],  # Points to center - COLLIDES WITH num_4!
            color=YELLOW,
            buff=0.1,
            stroke_width=6
        )

        # Show the collision
        self.play(
            Write(intersection_label),
            Create(arrow),
            run_time=1.5
        )
        self.wait(0.5)

        # Flash to highlight the collision problem
        self.play(
            Flash(num_4, color=RED, flash_radius=0.5),
            Flash(num_5, color=RED, flash_radius=0.5),
            run_time=0.5
        )
        self.wait(0.5)

        # Answer at bottom - also potentially colliding with circles
        answer = Text("A ∩ B = {4, 5}", font_size=40, color=YELLOW, weight=BOLD)
        answer.next_to(circle_a, DOWN, buff=0.3)  # TOO CLOSE TO CIRCLE - COLLISION!

        self.play(Write(answer), run_time=1)
        self.wait(2)
