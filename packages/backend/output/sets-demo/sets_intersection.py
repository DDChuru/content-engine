
from manim import *
import sys
import os

# Add parent directory to path to import spatial config
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'config')))

try:
    from manim_spatial_config import (
        get_safe_position,
        ensure_safe_bounds,
        COLORS as SPATIAL_COLORS,
        FONTS as SPATIAL_FONTS,
        ZONES,
        MANIM_COORDS
    )
    SPATIAL_CONFIG_AVAILABLE = True
except ImportError:
    print("WARNING: manim_spatial_config not found, using fallback positioning")
    SPATIAL_CONFIG_AVAILABLE = False

    # Fallback positioning for right half (split mode)
    def get_safe_position(x_percent, y_percent):
        # Right half only: x from 0 to 6.5, y from -3.5 to 3.5
        x = 0 + (6.5 - 0) * x_percent
        y = 3.5 - 7 * y_percent
        return [x, y, 0]

class SetsIntersection(Scene):
    def construct(self):
        # Time tracking
        time_spent = 0
        target_duration = 12.0

        # Title (right side, top)
        title = Text("A ∩ B", font_size=48, color=WHITE, weight=BOLD)
        title.move_to(get_safe_position(0.5, 0.1))

        self.play(Write(title), run_time=0.8)
        time_spent += 0.8
        self.wait(0.3)
        time_spent += 0.3

        # Step 1: Show Set A
        step1 = Text("Set A = {1, 2, 3, 4, 5}", font_size=32, color=BLUE)
        step1.move_to(get_safe_position(0.5, 0.25))

        self.play(FadeIn(step1, shift=DOWN*0.2), run_time=0.8)
        time_spent += 0.8
        self.wait(0.5)
        time_spent += 0.5

        # Step 2: Show Set B
        step2 = Text("Set B = {4, 5, 6, 7, 8}", font_size=32, color=GREEN)
        step2.move_to(get_safe_position(0.5, 0.4))

        self.play(FadeIn(step2, shift=DOWN*0.2), run_time=0.8)
        time_spent += 0.8
        self.wait(0.5)
        time_spent += 0.5

        # Step 3: Show intersection symbol
        intersection_text = Text("∩ means 'AND'", font_size=28, color=YELLOW)
        intersection_text.move_to(get_safe_position(0.5, 0.55))

        self.play(FadeIn(intersection_text, shift=DOWN*0.2), run_time=0.8)
        time_spent += 0.8
        self.wait(0.5)
        time_spent += 0.5

        # Step 4: Highlight common elements
        common = Text("Common: {4, 5}", font_size=36, color=YELLOW, weight=BOLD)
        common.move_to(get_safe_position(0.5, 0.7))

        # Draw box around common elements
        box = SurroundingRectangle(common, color=YELLOW, buff=0.2)

        self.play(
            FadeIn(common, shift=DOWN*0.2),
            Create(box),
            run_time=1.2
        )
        time_spent += 1.2
        self.wait(0.8)
        time_spent += 0.8

        # Step 5: Show final answer
        answer = Text("A ∩ B = {4, 5}", font_size=40, color=WHITE, weight=BOLD)
        answer.move_to(get_safe_position(0.5, 0.85))

        # Checkmark
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

        # Pad to target duration
        remaining = max(0, target_duration - time_spent)
        if remaining > 0:
            self.wait(remaining)

        # Fade out
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=0.5)
