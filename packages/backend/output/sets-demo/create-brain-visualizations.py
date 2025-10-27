"""
Create Brain/Memory Visualization Graphics for Episode 1

This generates 4 visual states:
1. Empty brain (no knowledge)
2. Brain after spatial teaching
3. Brain after pedagogy teaching
4. Full brain with successful patterns
"""

from manim import *
import json

class EmptyBrainVisualization(Scene):
    """Empty brain - no rules, no knowledge"""
    def construct(self):
        # Title
        title = Text("Agent Memory", font_size=48, color=BLUE, weight=BOLD)
        title.to_edge(UP)
        self.add(title)

        # Version badge
        version = Text("Version: 1", font_size=28, color=GRAY)
        version.next_to(title, DOWN)
        self.add(version)

        # Brain outline (empty)
        brain = Circle(radius=2, color=GRAY, stroke_width=3)
        brain.shift(DOWN * 0.5)
        self.add(brain)

        # "EMPTY" text inside
        empty_text = Text("EMPTY", font_size=60, color=GRAY, weight=BOLD)
        empty_text.move_to(brain.get_center())
        self.add(empty_text)

        # Stats at bottom
        stats = VGroup(
            Text("Spatial Rules: 0", font_size=32, color=RED),
            Text("Pedagogy Rules: 0", font_size=32, color=RED),
            Text("Successful Patterns: 0", font_size=32, color=RED)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        stats.next_to(brain, DOWN, buff=0.8)
        self.add(stats)

        self.wait(3)


class BrainAfterSpatialTeaching(Scene):
    """Brain after learning spatial rules"""
    def construct(self):
        # Title
        title = Text("Agent Memory", font_size=48, color=BLUE, weight=BOLD)
        title.to_edge(UP)
        self.add(title)

        # Version badge (updated)
        version = Text("Version: 3", font_size=28, color=YELLOW)
        version.next_to(title, DOWN)
        self.add(version)

        # Brain outline (starting to fill)
        brain = Circle(radius=2, color=BLUE, stroke_width=4)
        brain.shift(DOWN * 0.5)
        self.add(brain)

        # Spatial rules (neurons firing)
        rule1 = Text("❌ No arrows to\nintersection", font_size=20, color=YELLOW)
        rule1.move_to(brain.get_center() + UP * 0.5)

        rule2 = Text("✅ Absolute\npositioning", font_size=20, color=GREEN)
        rule2.move_to(brain.get_center() + DOWN * 0.5)

        self.add(rule1, rule2)

        # Glowing effect
        glow = Circle(radius=2.1, color=BLUE, stroke_width=2, stroke_opacity=0.3)
        glow.move_to(brain.get_center())
        self.add(glow)

        # Stats at bottom
        stats = VGroup(
            Text("Spatial Rules: 2", font_size=32, color=GREEN),
            Text("Pedagogy Rules: 0", font_size=32, color=RED),
            Text("Successful Patterns: 0", font_size=32, color=RED)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        stats.next_to(brain, DOWN, buff=0.8)
        self.add(stats)

        self.wait(3)


class BrainAfterPedagogyTeaching(Scene):
    """Brain after learning pedagogy rules"""
    def construct(self):
        # Title
        title = Text("Agent Memory", font_size=48, color=BLUE, weight=BOLD)
        title.to_edge(UP)
        self.add(title)

        # Version badge
        version = Text("Version: 5", font_size=28, color=YELLOW)
        version.next_to(title, DOWN)
        self.add(version)

        # Brain outline (more filled)
        brain = Circle(radius=2, color=BLUE, stroke_width=5)
        brain.shift(DOWN * 0.5)
        self.add(brain)

        # Left side: Spatial rules
        spatial_group = VGroup(
            Text("Spatial:", font_size=18, color=BLUE, weight=BOLD),
            Text("❌ No arrows", font_size=16, color=YELLOW),
            Text("✅ Absolute pos", font_size=16, color=YELLOW)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        spatial_group.move_to(brain.get_center() + LEFT * 0.8)
        self.add(spatial_group)

        # Right side: Pedagogy rules
        pedagogy_group = VGroup(
            Text("Pedagogy:", font_size=18, color=GREEN, weight=BOLD),
            Text("✅ One-by-one", font_size=16, color=GREEN),
            Text("✅ Rubber duck", font_size=16, color=GREEN)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        pedagogy_group.move_to(brain.get_center() + RIGHT * 0.6)
        self.add(pedagogy_group)

        # Stronger glow
        glow = Circle(radius=2.15, color=BLUE, stroke_width=3, stroke_opacity=0.5)
        glow.move_to(brain.get_center())
        self.add(glow)

        # Stats at bottom
        stats = VGroup(
            Text("Spatial Rules: 2", font_size=32, color=GREEN),
            Text("Pedagogy Rules: 2", font_size=32, color=GREEN),
            Text("Successful Patterns: 0", font_size=32, color=RED)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        stats.next_to(brain, DOWN, buff=0.8)
        self.add(stats)

        self.wait(3)


class BrainWithSuccessfulPatterns(Scene):
    """Brain after successful generation - learning complete"""
    def construct(self):
        # Title
        title = Text("Agent Memory", font_size=48, color=GREEN, weight=BOLD)
        title.to_edge(UP)
        self.add(title)

        # Version badge (final)
        version = Text("Version: 7", font_size=28, color=GOLD)
        version.next_to(title, DOWN)
        self.add(version)

        # Brain outline (fully active)
        brain = Circle(radius=2, color=GREEN, stroke_width=6, fill_color=GREEN, fill_opacity=0.1)
        brain.shift(DOWN * 0.5)
        self.add(brain)

        # Center: Success symbol
        success = Text("✓", font_size=100, color=GOLD, weight=BOLD)
        success.move_to(brain.get_center())
        self.add(success)

        # Around the brain: Knowledge nodes
        spatial_badge = Circle(radius=0.4, color=BLUE, fill_opacity=0.8)
        spatial_badge.move_to(brain.get_center() + LEFT * 2.5)
        spatial_text = Text("2", font_size=24, color=WHITE, weight=BOLD)
        spatial_text.move_to(spatial_badge.get_center())
        spatial_label = Text("Spatial", font_size=18, color=BLUE)
        spatial_label.next_to(spatial_badge, DOWN, buff=0.1)

        pedagogy_badge = Circle(radius=0.4, color=GREEN, fill_opacity=0.8)
        pedagogy_badge.move_to(brain.get_center() + RIGHT * 2.5)
        pedagogy_text = Text("2", font_size=24, color=WHITE, weight=BOLD)
        pedagogy_text.move_to(pedagogy_badge.get_center())
        pedagogy_label = Text("Pedagogy", font_size=18, color=GREEN)
        pedagogy_label.next_to(pedagogy_badge, DOWN, buff=0.1)

        patterns_badge = Circle(radius=0.4, color=GOLD, fill_opacity=0.8)
        patterns_badge.move_to(brain.get_center() + UP * 2.5)
        patterns_text = Text("2", font_size=24, color=WHITE, weight=BOLD)
        patterns_text.move_to(patterns_badge.get_center())
        patterns_label = Text("Patterns", font_size=18, color=GOLD)
        patterns_label.next_to(patterns_badge, UP, buff=0.1)

        self.add(
            spatial_badge, spatial_text, spatial_label,
            pedagogy_badge, pedagogy_text, pedagogy_label,
            patterns_badge, patterns_text, patterns_label
        )

        # Intense glow
        for i in range(3):
            glow = Circle(radius=2.2 + i*0.1, color=GREEN, stroke_width=2-i*0.5, stroke_opacity=0.3-i*0.1)
            glow.move_to(brain.get_center())
            self.add(glow)

        # Stats at bottom
        stats = VGroup(
            Text("Spatial Rules: 2", font_size=32, color=GREEN),
            Text("Pedagogy Rules: 2", font_size=32, color=GREEN),
            Text("Successful Patterns: 2", font_size=32, color=GOLD)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        stats.next_to(brain, DOWN, buff=0.8)
        self.add(stats)

        self.wait(3)


if __name__ == "__main__":
    print("Run these commands to generate brain visualizations:")
    print("")
    print("conda run -n aitools manim -pqh create-brain-visualizations.py EmptyBrainVisualization")
    print("conda run -n aitools manim -pqh create-brain-visualizations.py BrainAfterSpatialTeaching")
    print("conda run -n aitools manim -pqh create-brain-visualizations.py BrainAfterPedagogyTeaching")
    print("conda run -n aitools manim -pqh create-brain-visualizations.py BrainWithSuccessfulPatterns")
