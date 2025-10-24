
from manim import *
import os

class IntroductionWithThumbnail(Scene):
    def construct(self):
        # Load thumbnail image
        thumbnail_path = "output/education/images/Circle_Theorems_1761294081979.png"

        try:
            # Show thumbnail briefly
            thumbnail = ImageMobject(thumbnail_path)
            thumbnail.scale_to_fit_width(config.frame_width)
            thumbnail.scale_to_fit_height(config.frame_height)

            self.add(thumbnail)
            self.wait(1)  # Show for 1 second

            # Animate to bottom right corner
            small_thumbnail = thumbnail.copy()
            small_thumbnail.generate_target()
            small_thumbnail.target.scale(0.15)  # Small logo size
            small_thumbnail.target.to_corner(DR, buff=0.3)  # Bottom right

            self.play(MoveToTarget(small_thumbnail), run_time=0.5)
            self.wait(0.5)

        except Exception as e:
            print(f"Could not load thumbnail: {e}")
            # Continue without thumbnail
            pass

        # Main title appears while thumbnail is in corner
        title_text = Text("Circle Theorem: Angle at Centre", font_size=52, color=BLUE, weight=BOLD)
        title_text.to_edge(UP, buff=0.8)

        underline = Line(LEFT, RIGHT, color=BLUE).scale(3)
        underline.next_to(title_text, DOWN, buff=0.1)

        self.play(
            Write(title_text, run_time=1),
            Create(underline, run_time=0.5)
        )
        self.wait(0.5)

        
        # Exam relevance badge
        exam_badge = Text("Popular GCSE Higher Topic", font_size=28, color=YELLOW, weight=BOLD)
        exam_badge.next_to(underline, DOWN, buff=0.5)

        badge_bg = Rectangle(
            width=exam_badge.width + 0.5,
            height=exam_badge.height + 0.3,
            fill_color=YELLOW,
            fill_opacity=0.2,
            stroke_color=YELLOW,
            stroke_width=3
        )
        badge_bg.move_to(exam_badge.get_center())

        self.play(
            FadeIn(badge_bg, scale=0.8),
            Write(exam_badge)
        )
        self.wait(1)
        

        
        # Difficulty indicator
        difficulty_colors = {
            'foundation': '#00FF00',  # GREEN
            'higher': '#FFA500',      # ORANGE
            'advanced': '#FF0000'     # RED
        }

        diff_color = difficulty_colors.get('higher', '#00FF00')
        diff_text = Text(
            "Difficulty: HIGHER",
            font_size=24,
            color=diff_color
        )
        diff_text.to_edge(DOWN, buff=1)

        diff_dot = Dot(color=diff_color, radius=0.15)
        diff_dot.next_to(diff_text, LEFT, buff=0.3)

        self.play(
            FadeIn(diff_dot, scale=2),
            FadeIn(diff_text, shift=UP*0.2)
        )
        self.wait(1.5)
        

        # Fade out thumbnail from corner
        try:
            self.play(FadeOut(small_thumbnail))
        except:
            pass

        # Brief pause before transition
        self.wait(0.5)

        # Fade everything out for next scene
        self.play(*[FadeOut(mob) for mob in self.mobjects])
