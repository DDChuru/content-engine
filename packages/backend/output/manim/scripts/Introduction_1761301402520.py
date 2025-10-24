
from manim import *
import os

class IntroductionWithThumbnail(Scene):
    def construct(self):
        # Load thumbnail image
        thumbnail_path = "output/education/images/Circle_Theorems_1761301397765.png"

        time_spent = 0  # Track animation time
        target_duration = 19.461188

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
        title_text = Text("Circle Theorem: Angle at Centre", font_size=52, color=BLUE, weight=BOLD)
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

        
        # Exam relevance badge (simplified - no crowding)
        exam_badge = Text("Popular GCSE Higher Topic", font_size=26, color=YELLOW)
        exam_badge.next_to(underline, DOWN, buff=0.7)

        self.play(FadeIn(exam_badge, shift=DOWN*0.2))
        time_spent += 1
        

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
