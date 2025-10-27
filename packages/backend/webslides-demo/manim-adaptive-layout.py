"""
Adaptive Spatial Layout System

Pre-calculates optimal circle sizes and spacing based on:
1. Union size (total unique elements)
2. Intersection size
3. Distribution across regions
4. Available canvas space

Example:
- 15 elements → Use current spacing
- 30 elements → Smaller circles, tighter spacing
- 50 elements → Much smaller circles, very tight spacing
"""

from manim import *
import numpy as np

class AdaptiveLayoutSystem(Scene):
    def construct(self):
        # Colors
        SET_A_COLOR = BLUE
        SET_B_COLOR = GREEN
        INTERSECTION_COLOR = YELLOW

        # ===== TEST DIFFERENT SIZES =====
        # Test case 1: Small (15 elements)
        # Test case 2: Medium (30 elements)
        # Test case 3: Large (50 elements)

        # Let's test with MEDIUM size (30 elements)
        set_a = set(range(1, 21))      # {1..20}
        set_b = set(range(15, 35))     # {15..34}
        # Union = {1..34} = 34 elements
        # Intersection = {15..20} = 6 elements

        # ===== PRE-CALCULATE LAYOUT PARAMETERS =====
        layout_params = self.calculate_adaptive_layout(set_a, set_b)

        # Display calculated parameters
        title = Text("Adaptive Layout Calculator", font_size=48, color=WHITE, weight=BOLD)
        self.play(Write(title))
        self.wait(1)

        info_text = VGroup(
            Text(f"Union size: {layout_params['union_size']}", font_size=32, color=WHITE),
            Text(f"Circle radius: {layout_params['circle_radius']:.2f}", font_size=32, color=BLUE),
            Text(f"Element size: {layout_params['element_font_size']}", font_size=32, color=GREEN),
            Text(f"Padding: {layout_params['padding']:.2f}", font_size=32, color=YELLOW),
            Text(f"Status: {layout_params['status']}", font_size=32, color=ORANGE)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        info_text.next_to(title, DOWN, buff=0.5)

        self.play(FadeIn(info_text, shift=UP*0.3))
        self.wait(2)

        self.play(FadeOut(title), FadeOut(info_text))
        self.wait(0.5)

        # ===== BUILD VENN DIAGRAM WITH CALCULATED PARAMETERS =====
        self.build_adaptive_venn_diagram(
            set_a,
            set_b,
            layout_params
        )

    def calculate_adaptive_layout(self, set_a, set_b):
        """
        PRE-CALCULATE optimal layout parameters based on data

        Returns dict with:
        - circle_radius: Size of Venn circles
        - circle_separation: Distance between circle centers
        - element_font_size: Font size for numbers
        - padding: Minimum space between elements
        - region_radii: Dictionary of radii for each region
        - status: 'comfortable', 'tight', 'very_tight', 'warning'
        """
        # Calculate set statistics
        union = set_a | set_b
        intersection = set_a & set_b
        a_only = set_a - set_b
        b_only = set_b - set_a

        union_size = len(union)
        intersection_size = len(intersection)
        a_only_size = len(a_only)
        b_only_size = len(b_only)

        # Determine layout tier based on union size
        if union_size <= 15:
            tier = 'comfortable'
            base_circle_radius = 2.2
            base_font_size = 38
            base_padding = 0.35
        elif union_size <= 25:
            tier = 'moderate'
            base_circle_radius = 2.0
            base_font_size = 32
            base_padding = 0.28
        elif union_size <= 40:
            tier = 'tight'
            base_circle_radius = 1.8
            base_font_size = 28
            base_padding = 0.22
        elif union_size <= 60:
            tier = 'very_tight'
            base_circle_radius = 1.5
            base_font_size = 24
            base_padding = 0.18
        else:
            tier = 'warning'
            base_circle_radius = 1.2
            base_font_size = 20
            base_padding = 0.15

        # Calculate circle separation (how far apart the circles are)
        # More overlap for larger intersection
        overlap_factor = min(intersection_size / max(union_size, 1), 0.5)
        circle_separation = base_circle_radius * (1.6 - overlap_factor * 0.4)

        # Calculate region-specific radii
        # Regions with more elements get slightly more space
        max_region_size = max(a_only_size, intersection_size, b_only_size)

        region_radii = {
            'a_only': base_circle_radius * 0.5 * (1 + 0.3 * (a_only_size / max_region_size)),
            'intersection': base_circle_radius * 0.35 * (1 + 0.3 * (intersection_size / max_region_size)),
            'b_only': base_circle_radius * 0.5 * (1 + 0.3 * (b_only_size / max_region_size))
        }

        # Adjust font size based on density in tightest region
        densities = [
            a_only_size / (region_radii['a_only'] ** 2) if a_only_size > 0 else 0,
            intersection_size / (region_radii['intersection'] ** 2) if intersection_size > 0 else 0,
            b_only_size / (region_radii['b_only'] ** 2) if b_only_size > 0 else 0
        ]
        max_density = max(densities)

        if max_density > 15:
            font_size = int(base_font_size * 0.7)
        elif max_density > 10:
            font_size = int(base_font_size * 0.85)
        else:
            font_size = base_font_size

        return {
            'union_size': union_size,
            'intersection_size': intersection_size,
            'a_only_size': a_only_size,
            'b_only_size': b_only_size,
            'circle_radius': base_circle_radius,
            'circle_separation': circle_separation,
            'element_font_size': font_size,
            'padding': base_padding,
            'region_radii': region_radii,
            'status': tier,
            'tier': tier
        }

    def build_adaptive_venn_diagram(self, set_a, set_b, layout_params):
        """
        Build Venn diagram using pre-calculated parameters
        """
        # Extract parameters
        circle_radius = layout_params['circle_radius']
        circle_sep = layout_params['circle_separation']
        font_size = layout_params['element_font_size']
        padding = layout_params['padding']
        region_radii = layout_params['region_radii']

        # Calculate regions
        intersection = set_a & set_b
        a_only = set_a - set_b
        b_only = set_b - set_a

        # Show set definitions
        set_a_text = f"A = {{{min(set_a)}..{max(set_a)}}}"
        set_b_text = f"B = {{{min(set_b)}..{max(set_b)}}}"

        set_a_def = MathTex(set_a_text, font_size=32, color=BLUE).to_corner(UL, buff=0.5)
        set_b_def = MathTex(set_b_text, font_size=32, color=GREEN).next_to(set_a_def, DOWN, buff=0.3, aligned_edge=LEFT)

        self.play(Write(set_a_def), Write(set_b_def))
        self.wait(0.5)

        # Position circles based on calculated separation
        circle_a_center = LEFT * (circle_sep / 2)
        circle_b_center = RIGHT * (circle_sep / 2)

        # Draw circles
        circle_a = self.create_sketchy_circle(circle_radius, circle_a_center, BLUE)
        circle_b = self.create_sketchy_circle(circle_radius, circle_b_center, GREEN)

        label_a = MathTex("A", font_size=int(font_size * 1.4), color=BLUE)
        label_a.move_to(circle_a_center + UP * (circle_radius + 0.5))

        label_b = MathTex("B", font_size=int(font_size * 1.4), color=GREEN)
        label_b.move_to(circle_b_center + UP * (circle_radius + 0.5))

        self.play(Create(circle_a), Create(circle_b), Write(label_a), Write(label_b), run_time=2)
        self.wait(0.5)

        # Create number mobjects with adaptive font size
        all_numbers = sorted(set_a | set_b)
        number_mobs = {
            n: Text(str(n), font_size=font_size, color=WHITE, weight=BOLD)
            for n in all_numbers
        }

        # Start scattered
        np.random.seed(42)
        for mob in number_mobs.values():
            angle = np.random.uniform(0, TAU)
            distance = np.random.uniform(4, 5)
            mob.move_to(np.array([distance * np.cos(angle), distance * np.sin(angle), 0]))

        self.play(
            LaggedStart(*[FadeIn(mob, scale=0.5) for mob in number_mobs.values()], lag_ratio=0.03),
            run_time=2
        )
        self.wait(0.5)

        # Calculate positions using adaptive layout
        positions = self.adaptive_venn_layout(
            all_numbers,
            set_a,
            set_b,
            circle_a_center,
            circle_b_center,
            region_radii,
            padding
        )

        # Animate to positions
        animations = []
        for num, pos in positions.items():
            mob = number_mobs[num]
            if num in intersection:
                color = YELLOW
            elif num in a_only:
                color = BLUE
            else:
                color = GREEN

            animations.append(mob.animate.move_to(pos).set_color(color))

        self.play(*animations, run_time=3, rate_func=smooth)
        self.wait(2)

        # Success message
        success_msg = Text(
            f"✓ {layout_params['union_size']} elements - {layout_params['status'].upper()} fit!",
            font_size=36,
            color=GREEN,
            weight=BOLD
        ).to_edge(DOWN, buff=0.5)

        self.play(Write(success_msg))
        self.wait(2)

        # Fade out
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=1.5)
        self.wait(0.5)

    def adaptive_venn_layout(self, numbers, set_a, set_b, center_a, center_b, region_radii, padding):
        """Layout numbers using calculated radii and padding"""
        intersection = set_a & set_b
        a_only = set_a - set_b
        b_only = set_b - set_a

        positions = {}

        # A only
        if a_only:
            a_center = center_a + LEFT * 0.4
            positions.update(
                self.adaptive_circular_layout(
                    sorted(list(a_only)),
                    a_center,
                    region_radii['a_only'],
                    padding
                )
            )

        # Intersection
        if intersection:
            int_center = (center_a + center_b) / 2
            positions.update(
                self.adaptive_circular_layout(
                    sorted(list(intersection)),
                    int_center,
                    region_radii['intersection'],
                    padding * 0.8  # Tighter in intersection
                )
            )

        # B only
        if b_only:
            b_center = center_b + RIGHT * 0.4
            positions.update(
                self.adaptive_circular_layout(
                    sorted(list(b_only)),
                    b_center,
                    region_radii['b_only'],
                    padding
                )
            )

        return positions

    def adaptive_circular_layout(self, elements, center, radius, padding):
        """Circular layout with adaptive patterns"""
        count = len(elements)
        positions = {}
        np.random.seed(123)

        if count == 0:
            return positions
        elif count == 1:
            positions[elements[0]] = center
        elif count <= 8:
            # Circular arrangement
            for i, elem in enumerate(elements):
                angle = i * TAU / count - PI/2
                pos = center + np.array([
                    radius * 0.9 * np.cos(angle),
                    radius * 0.9 * np.sin(angle),
                    0
                ])
                jitter = np.random.uniform(-0.03, 0.03, 2)
                positions[elem] = pos + np.array([jitter[0], jitter[1], 0])
        else:
            # Multi-ring layout for large counts
            elements_per_ring = min(8, count // 2)
            ring_count = (count + elements_per_ring - 1) // elements_per_ring

            elem_idx = 0
            for ring in range(ring_count):
                ring_radius = radius * (0.3 + 0.6 * ring / max(ring_count - 1, 1))
                elems_in_ring = min(elements_per_ring, count - elem_idx)

                for i in range(elems_in_ring):
                    if elem_idx >= count:
                        break
                    angle = i * TAU / elems_in_ring - PI/2
                    pos = center + np.array([
                        ring_radius * np.cos(angle),
                        ring_radius * np.sin(angle),
                        0
                    ])
                    jitter = np.random.uniform(-0.02, 0.02, 2)
                    positions[elements[elem_idx]] = pos + np.array([jitter[0], jitter[1], 0])
                    elem_idx += 1

        return positions

    def create_sketchy_circle(self, radius, center, color):
        """Hand-drawn circle effect"""
        np.random.seed(123)
        return VGroup(*[
            Circle(radius=radius + 0.04*i, color=color, stroke_width=3, stroke_opacity=0.8)
            .move_to(center + 0.04*np.array([np.random.randn(), np.random.randn(), 0]))
            for i in range(3)
        ])
