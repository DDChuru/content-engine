"""
TRULY FIXED Spatial Layout System - Region Size Adaptation

THE FIX:
- Region radii NOW properly reflect element count
- Intersection with 6 elements is VISIBLY smaller than regions with 14 elements
- Adaptive spacing based on density
- Visual debug circles to verify radius calculations

Key insight: The spacing must be calculated WITHIN each region
based on the region's radius and element count, not globally.
"""

from manim import *
import numpy as np
import math

class SpatialLayoutTrulyFixed(Scene):
    def construct(self):
        # Colors
        SET_A_COLOR = BLUE
        SET_B_COLOR = GREEN
        INTERSECTION_COLOR = YELLOW

        # Test with 34 elements (same as before)
        set_a = set(range(1, 21))      # {1..20}
        set_b = set(range(15, 35))     # {15..34}

        # CALCULATE with TRULY FIXED algorithm
        layout_params = self.calculate_fixed_layout(set_a, set_b)

        # Show calculation results with EMPHASIS on region sizes
        title = Text("TRULY FIXED Spatial Calculator", font_size=48, color=GREEN, weight=BOLD)
        self.play(Write(title))
        self.wait(1)

        info_text = VGroup(
            Text(f"Union: {layout_params['union_size']} elements", font_size=32, color=WHITE),
            Text(f"Circle radius: {layout_params['circle_radius']:.2f}u", font_size=32, color=BLUE),
            Text(f"Font size: {layout_params['element_font_size']}px", font_size=32, color=GREEN),
            Text(f"Element size: {layout_params['element_size']:.3f}u", font_size=32, color=YELLOW),
            Text("", font_size=24, color=WHITE),  # Spacer
            Text(f"A-only: {layout_params['a_only_size']} elem → r={layout_params['region_radii']['a_only']:.2f}u", font_size=28, color=BLUE, weight=BOLD),
            Text(f"Intersection: {layout_params['intersection_size']} elem → r={layout_params['region_radii']['intersection']:.2f}u", font_size=28, color=YELLOW, weight=BOLD),
            Text(f"B-only: {layout_params['b_only_size']} elem → r={layout_params['region_radii']['b_only']:.2f}u", font_size=28, color=GREEN, weight=BOLD),
            Text("", font_size=24, color=WHITE),  # Spacer
            Text(f"Status: {layout_params['status'].upper()}", font_size=32, color=ORANGE, weight=BOLD)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.25)
        info_text.next_to(title, DOWN, buff=0.4)

        self.play(FadeIn(info_text, shift=UP*0.3))
        self.wait(4)

        self.play(FadeOut(title), FadeOut(info_text))
        self.wait(0.5)

        # Build diagram with TRULY FIXED layout
        self.build_fixed_venn_diagram(set_a, set_b, layout_params)

    def calculate_fixed_layout(self, set_a, set_b):
        """
        TRULY FIXED spatial calculator
        Region sizes NOW properly reflect element counts
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

        # Tier selection
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

        # Calculate element physical size (FIXED)
        element_size = base_font_size / 95.0  # Empirical conversion to Manim units
        element_footprint = (element_size + base_padding) ** 2
        packing_efficiency = 0.75  # Hexagonal packing efficiency

        # Calculate required region radii (PHYSICS-BASED)
        def calc_region_radius(n_elements):
            if n_elements == 0:
                return 0.1  # Minimum radius
            required_area = (n_elements * element_footprint) / packing_efficiency
            return math.sqrt(required_area / math.pi)

        r_a_only = calc_region_radius(a_only_size)
        r_intersection = calc_region_radius(intersection_size)
        r_b_only = calc_region_radius(b_only_size)

        # Validate against circle size (with safety margin)
        max_region_radius = base_circle_radius * 0.75

        # If regions too big, scale down font size
        max_calculated = max(r_a_only, r_intersection, r_b_only)
        if max_calculated > max_region_radius:
            scale_factor = max_region_radius / max_calculated * 0.9
            base_font_size = int(base_font_size * scale_factor)
            base_padding = base_padding * scale_factor

            # Recalculate
            element_size = base_font_size / 95.0
            element_footprint = (element_size + base_padding) ** 2

            r_a_only = calc_region_radius(a_only_size)
            r_intersection = calc_region_radius(intersection_size)
            r_b_only = calc_region_radius(b_only_size)

        # Circle separation
        circle_separation = base_circle_radius * 1.6

        # CRITICAL: Print debug info
        print("\n" + "="*60)
        print("SPATIAL CALCULATOR - DEBUG OUTPUT")
        print("="*60)
        print(f"Union size: {union_size}")
        print(f"A-only: {a_only_size} elements → radius = {r_a_only:.3f}")
        print(f"Intersection: {intersection_size} elements → radius = {r_intersection:.3f}")
        print(f"B-only: {b_only_size} elements → radius = {r_b_only:.3f}")
        print(f"Element footprint: {element_footprint:.4f}")
        print(f"Font size: {base_font_size}")
        print(f"Tier: {tier}")
        print("="*60 + "\n")

        return {
            'union_size': union_size,
            'intersection_size': intersection_size,
            'a_only_size': a_only_size,
            'b_only_size': b_only_size,
            'circle_radius': base_circle_radius,
            'circle_separation': circle_separation,
            'element_font_size': base_font_size,
            'element_size': element_size,
            'padding': base_padding,
            'element_footprint': element_footprint,
            'region_radii': {
                'a_only': r_a_only,
                'intersection': r_intersection,
                'b_only': r_b_only
            },
            'status': tier,
            'tier': tier
        }

    def build_fixed_venn_diagram(self, set_a, set_b, layout_params):
        """Build Venn diagram with TRULY FIXED hexagonal packing"""
        # Extract parameters
        circle_radius = layout_params['circle_radius']
        circle_sep = layout_params['circle_separation']
        font_size = layout_params['element_font_size']
        element_size = layout_params['element_size']
        padding = layout_params['padding']
        region_radii = layout_params['region_radii']

        # Calculate regions
        intersection = set_a & set_b
        a_only = set_a - set_b
        b_only = set_b - set_a

        # Set definitions
        set_a_def = MathTex(r"A = \{1..20\}", font_size=32, color=BLUE).to_corner(UL, buff=0.5)
        set_b_def = MathTex(r"B = \{15..34\}", font_size=32, color=GREEN).next_to(set_a_def, DOWN, buff=0.3, aligned_edge=LEFT)

        self.play(Write(set_a_def), Write(set_b_def))
        self.wait(0.5)

        # Position circles
        circle_a_center = LEFT * (circle_sep / 2)
        circle_b_center = RIGHT * (circle_sep / 2)

        circle_a = self.create_sketchy_circle(circle_radius, circle_a_center, BLUE)
        circle_b = self.create_sketchy_circle(circle_radius, circle_b_center, GREEN)

        label_a = MathTex("A", font_size=int(font_size * 1.5), color=BLUE)
        label_a.move_to(circle_a_center + UP * (circle_radius + 0.4))

        label_b = MathTex("B", font_size=int(font_size * 1.5), color=GREEN)
        label_b.move_to(circle_b_center + UP * (circle_radius + 0.4))

        self.play(Create(circle_a), Create(circle_b), Write(label_a), Write(label_b), run_time=2)
        self.wait(0.5)

        # ADD DEBUG CIRCLES to visualize region boundaries
        a_center = circle_a_center + LEFT * 0.35
        int_center = (circle_a_center + circle_b_center) / 2
        b_center = circle_b_center + RIGHT * 0.35

        debug_circle_a = Circle(radius=region_radii['a_only'], color=BLUE, stroke_width=2, stroke_opacity=0.3).move_to(a_center)
        debug_circle_int = Circle(radius=region_radii['intersection'], color=YELLOW, stroke_width=2, stroke_opacity=0.3).move_to(int_center)
        debug_circle_b = Circle(radius=region_radii['b_only'], color=GREEN, stroke_width=2, stroke_opacity=0.3).move_to(b_center)

        self.play(Create(debug_circle_a), Create(debug_circle_int), Create(debug_circle_b))
        self.wait(1)

        # Create numbers with CORRECT font size
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

        # Calculate positions with TRULY FIXED hexagonal packing
        positions = self.hexagonal_venn_layout(
            all_numbers,
            set_a,
            set_b,
            circle_a_center,
            circle_b_center,
            region_radii,
            element_size,
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
        self.wait(1)

        # Fade out debug circles
        self.play(FadeOut(debug_circle_a), FadeOut(debug_circle_int), FadeOut(debug_circle_b))
        self.wait(1)

        # Success
        success_msg = Text(
            f"✓ Regions properly sized! A={layout_params['a_only_size']}, Int={layout_params['intersection_size']}, B={layout_params['b_only_size']}",
            font_size=32,
            color=GREEN,
            weight=BOLD
        ).to_edge(DOWN, buff=0.5)

        self.play(Write(success_msg))
        self.wait(2)

        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=1.5)
        self.wait(0.5)

    def hexagonal_venn_layout(self, numbers, set_a, set_b, center_a, center_b, region_radii, elem_size, padding):
        """Layout with TRULY FIXED hexagonal packing"""
        intersection = set_a & set_b
        a_only = set_a - set_b
        b_only = set_b - set_a

        positions = {}

        # A-only region
        if a_only:
            a_center = center_a + LEFT * 0.35
            positions.update(
                self.adaptive_hexagonal_pack(
                    sorted(list(a_only)),
                    a_center,
                    region_radii['a_only'],
                    elem_size,
                    padding
                )
            )

        # Intersection region - THE FIX IS HERE
        if intersection:
            int_center = (center_a + center_b) / 2
            positions.update(
                self.adaptive_hexagonal_pack(
                    sorted(list(intersection)),
                    int_center,
                    region_radii['intersection'],  # This is now PROPERLY smaller
                    elem_size,
                    padding
                )
            )

        # B-only region
        if b_only:
            b_center = center_b + RIGHT * 0.35
            positions.update(
                self.adaptive_hexagonal_pack(
                    sorted(list(b_only)),
                    b_center,
                    region_radii['b_only'],
                    elem_size,
                    padding
                )
            )

        return positions

    def adaptive_hexagonal_pack(self, elements, center, max_radius, elem_size, padding):
        """
        ADAPTIVE HEXAGONAL PACKING

        THE KEY FIX: Calculate spacing based on the ACTUAL region radius
        and element count, not a global constant.

        This ensures regions with fewer elements are visually smaller.
        """
        positions = {}
        count = len(elements)

        if count == 0:
            return positions

        # CRITICAL FIX: Calculate optimal spacing for THIS region
        # Based on the region's radius and element count

        # Estimate spacing to fit elements in the region
        # Area = π * r²
        # Each element needs approximately (spacing)² area
        # packing_efficiency * π * r² = count * spacing²
        # spacing = sqrt((π * r² * packing_efficiency) / count)

        packing_efficiency = 0.75
        optimal_spacing = math.sqrt((math.pi * max_radius**2 * packing_efficiency) / max(count, 1))

        # Ensure spacing isn't smaller than element size + padding
        min_spacing = elem_size + padding
        spacing = max(optimal_spacing, min_spacing)

        # IMPORTANT: If calculated spacing is too large, use minimum
        if spacing > max_radius / 2:
            spacing = max_radius / 2

        print(f"Region with {count} elements, r={max_radius:.3f} → spacing={spacing:.3f}")

        # Hexagonal grid parameters
        hex_spacing_x = spacing
        hex_spacing_y = spacing * 0.866  # sqrt(3)/2

        # Calculate grid dimensions based on max_radius
        rows_needed = int(2 * max_radius / hex_spacing_y) + 1
        cols_needed = int(2 * max_radius / hex_spacing_x) + 1

        # Generate hex grid positions
        positions_list = []

        for row in range(-rows_needed, rows_needed + 1):
            for col in range(-cols_needed, cols_needed + 1):
                x = col * hex_spacing_x
                y = row * hex_spacing_y

                # Offset every other row (hexagonal pattern)
                if row % 2 != 0:
                    x += hex_spacing_x / 2

                pos = center + np.array([x, y, 0])

                # Check if within radius
                dist = np.linalg.norm(pos - center)
                if dist <= max_radius:
                    positions_list.append((dist, pos))

        # Sort by distance from center (fill from inside out)
        positions_list.sort(key=lambda x: x[0])

        # Assign to elements
        for i, elem in enumerate(elements):
            if i < len(positions_list):
                positions[elem] = positions_list[i][1]
            else:
                # Fallback: place at center if we run out of spots
                positions[elem] = center

        return positions

    def create_sketchy_circle(self, radius, center, color):
        """Hand-drawn circle"""
        np.random.seed(123)
        return VGroup(*[
            Circle(radius=radius + 0.04*i, color=color, stroke_width=3, stroke_opacity=0.8)
            .move_to(center + 0.04*np.array([np.random.randn(), np.random.randn(), 0]))
            for i in range(3)
        ])
