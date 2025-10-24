/**
 * Enhanced Manim Templates for Educational Lessons
 *
 * Each template follows pedagogical best practices:
 * - Clear visual hierarchy
 * - Step-by-step progression
 * - Visual feedback (ticks/crosses)
 * - Exam board styling
 */

import { LessonSegment, QuestionDisplay, SolutionSteps, CommonMistake } from '../types/lesson-structure';

export class ManimTemplates {
  /**
   * INTRODUCTION SCENE
   * Sets the tone and context for the lesson
   */
  static generateIntroductionScene(segment: LessonSegment): string {
    const { title, content } = segment;
    const examRelevance = content?.examRelevance || '';
    const difficulty = content?.difficulty || 'foundation';

    return `
from manim import *

class Introduction(Scene):
    def construct(self):
        # Title
        title = Text("${title}", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        # Exam relevance badge
        ${examRelevance ? `
        exam_badge = Text("${examRelevance}", font_size=24, color=YELLOW)
        exam_badge.next_to(title, DOWN, buff=0.5)
        badge_box = SurroundingRectangle(exam_badge, color=YELLOW, buff=0.2)
        self.play(
            FadeIn(exam_badge),
            Create(badge_box)
        )
        self.wait(1.5)
        ` : ''}

        # Difficulty indicator
        difficulty_colors = {
            'foundation': GREEN,
            'higher': ORANGE,
            'advanced': RED
        }
        diff_text = Text("Difficulty: ${difficulty.toUpperCase()}",
                        font_size=20,
                        color=difficulty_colors.get('${difficulty}', GREEN))
        diff_text.to_edge(DOWN)
        self.play(FadeIn(diff_text))
        self.wait(2)

        # Fade out
        self.play(*[FadeOut(mob) for mob in self.mobjects])
`;
  }

  /**
   * THEORY SCENE
   * Explains the core concept with visual proof
   */
  static generateTheoryScene(segment: LessonSegment): string {
    const { title, content } = segment;
    const theorem = content?.theorem || title;

    return `
from manim import *

class Theory(Scene):
    def construct(self):
        # Theory title
        title = Text("${theorem}", font_size=42, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)

        # Visual demonstration (example for circle theorem)
        circle = Circle(radius=2, color=WHITE)
        self.play(Create(circle))
        self.wait(0.5)

        # Center point
        center = Dot(circle.get_center(), color=YELLOW)
        center_label = Text("O", font_size=24).next_to(center, DOWN, buff=0.1)
        self.play(FadeIn(center), Write(center_label))
        self.wait(0.5)

        # Arc points
        point_a = Dot(circle.point_at_angle(PI/4), color=RED)
        point_b = Dot(circle.point_at_angle(3*PI/4), color=RED)
        point_c = Dot(circle.point_at_angle(-PI/2), color=GREEN)

        label_a = Text("A", font_size=20).next_to(point_a, UR, buff=0.1)
        label_b = Text("B", font_size=20).next_to(point_b, UL, buff=0.1)
        label_c = Text("C", font_size=20).next_to(point_c, DOWN, buff=0.1)

        self.play(
            *[FadeIn(p) for p in [point_a, point_b, point_c]],
            *[Write(l) for l in [label_a, label_b, label_c]]
        )
        self.wait(1)

        # Lines from center
        line_oa = Line(center.get_center(), point_a.get_center(), color=YELLOW)
        line_ob = Line(center.get_center(), point_b.get_center(), color=YELLOW)

        # Lines from circumference
        line_ca = Line(point_c.get_center(), point_a.get_center(), color=GREEN)
        line_cb = Line(point_c.get_center(), point_b.get_center(), color=GREEN)

        self.play(
            Create(line_oa),
            Create(line_ob)
        )
        self.wait(0.5)

        self.play(
            Create(line_ca),
            Create(line_cb)
        )
        self.wait(1)

        # Angle at center
        angle_center = Angle(line_oa, line_ob, radius=0.5, color=YELLOW)
        angle_center_label = MathTex("\\\\theta", color=YELLOW, font_size=32)
        angle_center_label.move_to(
            circle.get_center() + 0.8 * (UP + LEFT)
        )

        self.play(Create(angle_center))
        self.play(Write(angle_center_label))
        self.wait(1)

        # Angle at circumference
        angle_circum = Angle(line_ca, line_cb, radius=0.4, color=GREEN)
        angle_circum_label = MathTex("\\\\frac{\\\\theta}{2}", color=GREEN, font_size=28)
        angle_circum_label.next_to(point_c, UP, buff=0.3)

        self.play(Create(angle_circum))
        self.play(Write(angle_circum_label))
        self.wait(2)

        # Key theorem statement
        theorem_box = Rectangle(width=8, height=1.5, color=BLUE)
        theorem_box.to_edge(DOWN, buff=0.5)
        theorem_text = Text(
            "Angle at centre = 2 × Angle at circumference",
            font_size=24,
            color=WHITE
        )
        theorem_text.move_to(theorem_box.get_center())

        self.play(
            Create(theorem_box),
            Write(theorem_text)
        )
        self.wait(3)

        self.play(*[FadeOut(mob) for mob in self.mobjects])
`;
  }

  /**
   * QUESTION DISPLAY SCENE
   * Shows the exam question clearly on screen
   */
  static generateQuestionScene(question: QuestionDisplay): string {
    return `
from manim import *

class Question(Scene):
    def construct(self):
        # Question header
        header = Text("Question", font_size=36, color=ORANGE)
        header.to_edge(UP)
        underline = Line(LEFT, RIGHT, color=ORANGE).scale(2)
        underline.next_to(header, DOWN, buff=0.1)

        self.play(Write(header), Create(underline))
        self.wait(0.5)

        # Question text
        question_text = Text(
            "${question.text.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
            font_size=24,
            line_spacing=1.5
        )
        question_text.next_to(underline, DOWN, buff=0.5)
        question_text.shift(LEFT * 2)

        self.play(Write(question_text, run_time=2))
        self.wait(2)

        ${question.givenInfo ? `
        # Given information box
        given_title = Text("Given:", font_size=20, color=GREEN)
        given_title.to_edge(LEFT, buff=1).shift(DOWN * 1)
        self.play(Write(given_title))

        ${question.givenInfo.map((info, i) => `
        given_${i} = Text("• ${info.replace(/"/g, '\\"')}", font_size=18)
        given_${i}.next_to(given_title, DOWN, buff=0.3 + ${i} * 0.4, aligned_edge=LEFT)
        self.play(FadeIn(given_${i}))
        `).join('\n')}
        self.wait(1)
        ` : ''}

        # Find what
        find_box = Rectangle(width=6, height=1, color=YELLOW)
        find_box.to_edge(DOWN, buff=0.5)
        find_text = Text("Find: ${question.findWhat}", font_size=22, color=YELLOW)
        find_text.move_to(find_box.get_center())

        self.play(Create(find_box))
        self.play(Write(find_text))
        self.wait(3)

        self.play(*[FadeOut(mob) for mob in self.mobjects])
`;
  }

  /**
   * SOLUTION STEP SCENE
   * Shows numbered steps with calculations
   */
  static generateSolutionStepScene(step: any, totalSteps: number): string {
    return `
from manim import *

class SolutionStep${step.number}(Scene):
    def construct(self):
        # Step header
        step_badge = Text(
            "Step ${step.number} of ${totalSteps}",
            font_size=28,
            color=BLUE
        )
        step_badge.to_edge(UP, buff=0.5).to_edge(LEFT, buff=1)

        self.play(FadeIn(step_badge))
        self.wait(0.5)

        # Step title
        step_title = Text("${step.title}", font_size=32, color=YELLOW)
        step_title.next_to(step_badge, DOWN, buff=0.5, aligned_edge=LEFT)

        self.play(Write(step_title))
        self.wait(1)

        # Explanation
        explanation = Text(
            "${step.explanation.replace(/"/g, '\\"')}",
            font_size=20,
            line_spacing=1.3,
            t2c={'important': YELLOW}
        )
        explanation.next_to(step_title, DOWN, buff=0.7, aligned_edge=LEFT)
        explanation.shift(RIGHT * 0.5)

        self.play(Write(explanation, run_time=1.5))
        self.wait(2)

        ${step.calculation ? `
        # Calculation box
        calc_box = Rectangle(width=7, height=2, color=GREEN)
        calc_box.to_edge(DOWN, buff=1)

        calculation = MathTex("${step.calculation.replace(/\\/g, '\\\\')}", font_size=36)
        calculation.move_to(calc_box.get_center())

        self.play(Create(calc_box))
        self.play(Write(calculation))
        self.wait(2)

        # Tick mark for correct answer
        tick = Text("✓", font_size=48, color=GREEN)
        tick.next_to(calc_box, RIGHT, buff=0.3)
        self.play(FadeIn(tick, scale=1.5))
        self.wait(1)
        ` : ''}

        self.wait(1)
        self.play(*[FadeOut(mob) for mob in self.mobjects])
`;
  }

  /**
   * COMMON PITFALLS SCENE
   * Shows mistakes with crosses and correct approaches with ticks
   */
  static generatePitfallsScene(mistakes: CommonMistake[]): string {
    return `
from manim import *

class CommonPitfalls(Scene):
    def construct(self):
        # Title
        title = Text("Common Pitfalls", font_size=42, color=RED)
        title.to_edge(UP)
        warning = Text("⚠", font_size=36, color=YELLOW)
        warning.next_to(title, LEFT)

        self.play(Write(title), FadeIn(warning))
        self.wait(1)

        ${mistakes.map((mistake, i) => `
        # Pitfall ${i + 1}: ${mistake.mistake}
        mistake_${i}_title = Text("Mistake ${i + 1}:", font_size=28, color=ORANGE)
        mistake_${i}_title.shift(UP * ${2 - i * 2.5})
        mistake_${i}_title.to_edge(LEFT, buff=1)

        self.play(Write(mistake_${i}_title))

        # Wrong approach with cross
        wrong_${i} = Text(
            "${mistake.mistake.replace(/"/g, '\\"')}",
            font_size=20,
            color=RED
        )
        wrong_${i}.next_to(mistake_${i}_title, DOWN, buff=0.3, aligned_edge=LEFT)
        wrong_${i}.shift(RIGHT * 0.5)

        cross_${i} = Text("✗", font_size=36, color=RED)
        cross_${i}.next_to(wrong_${i}, LEFT, buff=0.2)

        self.play(Write(wrong_${i}))
        self.play(FadeIn(cross_${i}, scale=1.5))
        self.wait(1)

        # Correct approach with tick
        correct_${i} = Text(
            "${mistake.correct.replace(/"/g, '\\"')}",
            font_size=20,
            color=GREEN
        )
        correct_${i}.next_to(wrong_${i}, DOWN, buff=0.3, aligned_edge=LEFT)

        tick_${i} = Text("✓", font_size=36, color=GREEN)
        tick_${i}.next_to(correct_${i}, LEFT, buff=0.2)

        self.play(Write(correct_${i}))
        self.play(FadeIn(tick_${i}, scale=1.5))
        self.wait(2)
        `).join('\n')}

        self.wait(2)
        self.play(*[FadeOut(mob) for mob in self.mobjects])
`;
  }
}
