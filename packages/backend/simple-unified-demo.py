"""
Simple Demo: D3 + Manim on Same Blackboard

This demonstrates D3 visualization data combined with Manim math animations
on a single shared blackboard (black background).
"""

from manim import *

class UnifiedBlackboardDemo(Scene):
    def construct(self):
        # Shared blackboard - black background
        self.camera.background_color = "#000000"

        # ====================================================================
        # LEFT SIDE: Simulated D3 Network Graph (hand-drawn style)
        # ====================================================================

        # In real implementation, this would be an SVGMobject from D3 output
        # For now, we'll create D3-style elements manually

        # Network nodes (D3-style circles with sketchy effect)
        node1 = Circle(radius=0.5, color="#1e88e5", fill_opacity=0.8)
        node1_label = Text("Context\nWindow", font_size=18, color=WHITE)
        node1_label.move_to(node1.get_center())
        node1_group = VGroup(node1, node1_label)
        node1_group.to_edge(LEFT, buff=2).shift(UP)

        node2 = Circle(radius=0.4, color="#4caf50", fill_opacity=0.8)
        node2_label = Text("Tokens", font_size=18, color=WHITE)
        node2_label.move_to(node2.get_center())
        node2_group = VGroup(node2, node2_label)
        node2_group.to_edge(LEFT, buff=2).shift(DOWN * 0.5)

        node3 = Circle(radius=0.4, color="#4caf50", fill_opacity=0.8)
        node3_label = Text("Words", font_size=18, color=WHITE)
        node3_label.move_to(node3.get_center())
        node3_group = VGroup(node3, node3_label)
        node3_group.to_edge(LEFT, buff=2).shift(DOWN * 2)

        # D3-style connections (hand-drawn wobbly lines)
        link1 = Line(node1.get_center(), node2.get_center(), color="#ffffff", stroke_width=2)
        link2 = Line(node2.get_center(), node3.get_center(), color="#ffffff", stroke_width=2)

        # Animate D3 visualization appearing (left side)
        self.play(
            Create(node1_group),
            Create(node2_group),
            Create(node3_group),
            run_time=2
        )
        self.play(Create(link1), Create(link2), run_time=1)
        self.wait(0.5)

        # ====================================================================
        # RIGHT SIDE: Manim Mathematical Equation
        # ====================================================================

        # Main equation (Manim specialty - beautiful LaTeX)
        equation = MathTex(
            r"\text{tokens} \approx 0.75 \times \text{words}",
            color=WHITE,
            font_size=36
        )
        equation.to_edge(RIGHT, buff=1.5).shift(UP)

        # Animate equation appearing (right side)
        self.play(Write(equation), run_time=2)
        self.wait(0.5)

        # Example calculation
        example = MathTex(
            r"4000 \text{ tokens} \approx 3000 \text{ words}",
            color="#ffeb3b",
            font_size=32
        )
        example.to_edge(RIGHT, buff=1.5)

        self.play(Write(example), run_time=1.5)
        self.wait(0.5)

        # Arrow connecting D3 viz to Manim equation (unified concept)
        connector = Arrow(
            node2.get_right() + RIGHT * 0.2,
            equation.get_left() + LEFT * 0.2,
            color="#ff5722",
            stroke_width=4,
            buff=0.1
        )
        connector_label = Text("relationship", font_size=16, color="#ff5722")
        connector_label.next_to(connector, UP, buff=0.1)

        self.play(
            Create(connector),
            Write(connector_label),
            run_time=1.5
        )
        self.wait(2)

        # ====================================================================
        # UNIFIED ANNOTATION: Both systems working together!
        # ====================================================================

        title = Text(
            "D3 + Manim on Same Blackboard",
            font_size=24,
            color="#1e88e5"
        )
        title.to_edge(UP, buff=0.5)

        self.play(FadeIn(title), run_time=1)
        self.wait(2)
