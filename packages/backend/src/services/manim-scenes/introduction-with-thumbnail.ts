/**
 * Introduction Scene with Thumbnail Transition
 *
 * Flow:
 * 1. Show Gemini thumbnail full screen (1s)
 * 2. Animate to bottom right corner (0.5s)
 * 3. Start main content while thumbnail is in corner (0.5s)
 * 4. Fade out thumbnail, continue with intro
 */

export function generateIntroWithThumbnail(
  title: string,
  thumbnailPath: string,
  examRelevance?: string,
  difficulty?: 'foundation' | 'higher' | 'advanced',
  targetDuration?: number
): string {
  // Calculate wait times to match audio duration
  const animationTime = 1 + 0.5 + 1 + 0.5 + 1 + 1.5;  // ~5.5s of animations
  const remainingTime = targetDuration ? Math.max(0, targetDuration - animationTime) : 0;

  return `
from manim import *
import os

class IntroductionWithThumbnail(Scene):
    def construct(self):
        # Load thumbnail image
        thumbnail_path = "${thumbnailPath.replace(/\\/g, '\\\\')}"

        time_spent = 0  # Track animation time
        target_duration = ${targetDuration || 12}

        try:
            # Show thumbnail briefly
            thumbnail = ImageMobject(thumbnail_path)
            thumbnail.scale_to_fit_width(config.frame_width)
            thumbnail.scale_to_fit_height(config.frame_height)

            self.add(thumbnail)
            self.wait(1)  # Show for 1 second
            time_spent += 1

            # Animate to bottom right corner
            small_thumbnail = thumbnail.copy()
            small_thumbnail.generate_target()
            small_thumbnail.target.scale(0.15)  # Small logo size
            small_thumbnail.target.to_corner(DR, buff=0.3)  # Bottom right

            # REMOVE original thumbnail before animating
            self.remove(thumbnail)
            self.play(MoveToTarget(small_thumbnail), run_time=0.5)
            time_spent += 0.5
            self.wait(0.3)
            time_spent += 0.3

        except Exception as e:
            print(f"Could not load thumbnail: {e}")
            pass

        # Main title appears
        title_text = Text("${title}", font_size=52, color=BLUE, weight=BOLD)
        title_text.to_edge(UP, buff=0.8)

        underline = Line(LEFT, RIGHT, color=BLUE).scale(3)
        underline.next_to(title_text, DOWN, buff=0.1)

        self.play(
            Write(title_text, run_time=1),
            Create(underline, run_time=0.5)
        )
        time_spent += 1
        self.wait(0.5)
        time_spent += 0.5

        ${examRelevance ? `
        # Exam relevance badge (simplified - no crowding)
        exam_badge = Text("${examRelevance}", font_size=26, color=YELLOW)
        exam_badge.next_to(underline, DOWN, buff=0.7)

        self.play(FadeIn(exam_badge, shift=DOWN*0.2))
        time_spent += 1
        ` : ''}

        # Fade out thumbnail from corner smoothly
        try:
            self.play(FadeOut(small_thumbnail), run_time=0.5)
            time_spent += 0.5
        except:
            pass

        # PADDING: Wait remaining time to match audio duration
        remaining_time = max(0, target_duration - time_spent)
        if remaining_time > 0:
            self.wait(remaining_time)

        # Fade everything out for next scene
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=0.5)
`;
}

export function generateTheoryScene(
  title: string,
  theorem: string,
  centerAngle: number = 120,
  targetDuration?: number
): string {
  return `
from manim import *
import numpy as np

class TheoryScene(Scene):
    def construct(self):
        time_spent = 0
        target_duration = ${targetDuration || 30}
        # Title
        title = Text("${title}", font_size=40, color=BLUE, weight=BOLD)
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
        angle_deg = ${centerAngle}
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
            f"{angle_deg}^\\\\circ",
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
            f"{int(circum_angle)}^\\\\circ",
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
            MathTex("\\\\times", font_size=32),
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
`;
}

export function generateWorkedExample(
  title: string,
  givenAngle: number,
  targetDuration?: number
): string {
  const answer = givenAngle / 2;

  return `
from manim import *
import numpy as np

class WorkedExample(Scene):
    def construct(self):
        time_spent = 0
        target_duration = ${targetDuration || 25}

        # STEP 1: Show question BIG and centered
        question_big = VGroup(
            Text("Question:", font_size=32, color=ORANGE, weight=BOLD),
            Text("O is the centre of the circle.", font_size=28),
            Text("A, B, C are on the circumference.", font_size=28),
            Text(f"Angle AOB = ${givenAngle}°", font_size=32, color=YELLOW, weight=BOLD),
            Text("", font_size=20),  # Spacer
            Text("Find: Angle ACB", font_size=32, color=GREEN, weight=BOLD)
        ).arrange(DOWN, center=True, buff=0.4)

        self.play(Write(question_big, run_time=2.5))
        time_spent += 2.5

        # PAUSE - "That's our question. How would you answer that?"
        self.wait(2.0)
        time_spent += 2.0

        # STEP 2: Shrink question and move to top-right corner
        question_small = VGroup(
            Text("Given:", font_size=16, color=ORANGE, weight=BOLD),
            Text(f"∠AOB = ${givenAngle}°", font_size=18, color=YELLOW),
            Text("Find: ∠ACB", font_size=16, color=GREEN)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.15)
        question_small.to_corner(UR, buff=0.5)

        self.play(
            Transform(question_big, question_small),
            run_time=1.5
        )
        time_spent += 1.5
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
        point_b = Dot(circle.point_at_angle(PI/6 + ${givenAngle}*DEGREES), color=RED, radius=0.06)
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
        angle_label_center = MathTex(f"{${givenAngle}}^\\\\circ", color=YELLOW, font_size=24)
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
            "${givenAngle}^\\\\circ", "=", "2", "\\\\times", "\\\\angle ACB",
            font_size=32
        )
        calc.next_to(theorem, DOWN, buff=0.5, aligned_edge=LEFT)

        self.play(Write(calc, run_time=2.0))
        time_spent += 2.0
        self.wait(1.0)
        time_spent += 1.0

        # Solve
        solution_calc = MathTex(
            "\\\\angle ACB", "=", "${givenAngle}^\\\\circ", "\\\\div", "2",
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
        answer_text = MathTex("\\\\angle ACB = ${Math.floor(answer)}^\\\\circ", color=GREEN, font_size=36)
        answer_group = VGroup(answer_box, answer_text)
        answer_group.next_to(solution_calc, DOWN, buff=0.6)

        self.play(Create(answer_box), run_time=0.8)
        time_spent += 0.8
        self.play(Write(answer_text, run_time=1.5))
        time_spent += 1.5

        # Update the angle on the diagram
        new_angle_label = MathTex(f"{${Math.floor(answer)}}^\\\\circ", color=GREEN, font_size=24)
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
`;
}
