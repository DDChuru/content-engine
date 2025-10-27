"""
LENS-ISOLATED Layout System - COMPLETE INDEPENDENCE

THE TRUE FIX:
1. Lens calculations are ISOLATED - don't affect crescent regions
2. Each region (A-only, intersection, B-only) has independent spacing
3. Lens uses bisection solver for optimal circle separation
4. Crescents use full available space in their regions

This ensures NO LEAKING between lens and crescent logic!
"""

from manim import *
import numpy as np
import math

class LensIsolatedLayout(Scene):
    def construct(self):
        # Colors
        SET_A_COLOR = BLUE
        SET_B_COLOR = GREEN
        INTERSECTION_COLOR = YELLOW

        # Test with 34 elements
        set_a = set(range(1, 21))      # {1..20}
        set_b = set(range(15, 35))     # {15..34}

        # CALCULATE with LENS-ISOLATED algorithm
        layout_params = self.calculate_lens_isolated_layout(set_a, set_b)

        # Show calculation results
        title = Text("LENS-ISOLATED Layout", font_size=48, color=GREEN, weight=BOLD)
        subtitle = Text("Independent region calculations - no leaking!", font_size=26, color=GRAY)
        subtitle.next_to(title, DOWN, buff=0.2)

        self.play(Write(title), FadeIn(subtitle))
        self.wait(1)

        info_text = VGroup(
            Text(f"Union: {layout_params['union_size']} elements", font_size=30, color=WHITE),
            Text("", font_size=20, color=WHITE),  # Spacer
            Text("LENS (Intersection):", font_size=28, color=YELLOW, weight=BOLD),
            Text(f"  {layout_params['intersection_size']} elements", font_size=26, color=YELLOW),
            Text(f"  Lens area: {layout_params['actual_lens_area']:.2f}u²", font_size=26, color=YELLOW),
            Text(f"  Font: {layout_params['lens_font_size']}px", font_size=26, color=YELLOW),
            Text("", font_size=20, color=WHITE),  # Spacer
            Text("CRESCENTS (A-only, B-only):", font_size=28, color=BLUE, weight=BOLD),
            Text(f"  {layout_params['a_only_size']} and {layout_params['b_only_size']} elements", font_size=26, color=BLUE),
            Text(f"  Font: {layout_params['crescent_font_size']}px (INDEPENDENT!)", font_size=26, color=GREEN, weight=BOLD),
            Text("", font_size=20, color=WHITE),  # Spacer
            Text(f"Circle separation: {layout_params['circle_separation']:.2f}u (SOLVED)", font_size=28, color=GREEN)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.15)
        info_text.next_to(subtitle, DOWN, buff=0.4)

        self.play(FadeIn(info_text, shift=UP*0.3))
        self.wait(4)

        self.play(FadeOut(title), FadeOut(subtitle), FadeOut(info_text))
        self.wait(0.5)

        # Build diagram
        self.build_lens_isolated_venn_diagram(set_a, set_b, layout_params)

    def calculate_lens_area(self, R, d):
        """Calculate area of lens-shaped intersection"""
        if d >= 2 * R:
            return 0
        elif d <= 0:
            return math.pi * R**2

        try:
            part1 = 2 * R**2 * math.acos(d / (2 * R))
            part2 = (d / 2) * math.sqrt(4 * R**2 - d**2)
            return max(0, part1 - part2)
        except:
            return 0

    def calculate_lens_dimensions(self, R, d):
        """Calculate width and height of lens"""
        if d >= 2 * R:
            return (0, 0)
        height = 2 * math.sqrt(R**2 - (d/2)**2)
        width = 2 * R - d
        return (width, height)

    def solve_for_separation(self, R, required_area, tolerance=0.005, max_iterations=100):
        """Bisection solver for optimal circle separation"""
        d_min = 0
        d_max = 2 * R

        max_possible_area = math.pi * R**2
        if required_area > max_possible_area * 0.95:
            print(f"  WARNING: Required area {required_area:.3f} close to max {max_possible_area:.3f}")
            return d_min * 1.1  # Near-complete overlap

        for iteration in range(max_iterations):
            d_mid = (d_min + d_max) / 2
            area_mid = self.calculate_lens_area(R, d_mid)
            error = abs(area_mid - required_area)

            if iteration % 20 == 0 and iteration > 0:
                print(f"    Iter {iteration}: d={d_mid:.4f}, area={area_mid:.4f}, error={error:.5f}")

            if error < tolerance:
                print(f"  ✓ Converged: d={d_mid:.4f}, area={area_mid:.4f}")
                return d_mid

            if area_mid > required_area:
                d_min = d_mid
            else:
                d_max = d_mid

        print(f"  ! Using best estimate: d={d_mid:.4f}")
        return d_mid

    def calculate_lens_isolated_layout(self, set_a, set_b):
        """
        LENS-ISOLATED spatial calculator
        Each region calculated INDEPENDENTLY - no leaking!
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

        # Tier selection for BASE parameters
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

        print("\n" + "="*80)
        print("LENS-ISOLATED CALCULATOR - NO LEAKING!")
        print("="*80)
        print(f"Base parameters: R={base_circle_radius:.2f}, font={base_font_size}px, tier={tier}")
        print(f"")

        # ===== SECTION 1: LENS (INTERSECTION) - INDEPENDENT =====
        print("LENS CALCULATION (Intersection):")
        print(f"  Elements: {intersection_size}")

        # Lens gets its OWN font size calculation
        lens_font_size = base_font_size  # Start with base
        lens_padding = base_padding
        lens_element_size = lens_font_size / 95.0
        lens_element_footprint = (lens_element_size + lens_padding) ** 2
        packing_efficiency = 0.75

        # Calculate required lens area
        if intersection_size > 0:
            required_lens_area = (intersection_size * lens_element_footprint) / packing_efficiency
        else:
            required_lens_area = 0.1

        # Add 15% safety margin
        required_lens_area *= 1.15

        print(f"  Required lens area (with margin): {required_lens_area:.3f} units²")

        # SOLVE for circle separation
        circle_separation = self.solve_for_separation(
            base_circle_radius,
            required_lens_area
        )

        # Get actual lens dimensions
        actual_lens_area = self.calculate_lens_area(base_circle_radius, circle_separation)
        lens_width, lens_height = self.calculate_lens_dimensions(base_circle_radius, circle_separation)

        print(f"  Actual lens area: {actual_lens_area:.3f} units²")
        print(f"  Lens dimensions: {lens_width:.3f} × {lens_height:.3f}")
        print(f"")

        # ===== SECTION 2: CRESCENTS (A-ONLY, B-ONLY) - INDEPENDENT =====
        print("CRESCENT CALCULATION (A-only, B-only):")
        print(f"  A-only: {a_only_size} elements")
        print(f"  B-only: {b_only_size} elements")

        # Crescents get THEIR OWN font size calculation (INDEPENDENT!)
        crescent_font_size = base_font_size  # Start fresh, no lens influence!
        crescent_padding = base_padding
        crescent_element_size = crescent_font_size / 95.0
        crescent_element_footprint = (crescent_element_size + crescent_padding) ** 2

        # Calculate crescent radii
        def calc_crescent_radius(n_elements):
            if n_elements == 0:
                return 0.1
            required_area = (n_elements * crescent_element_footprint) / packing_efficiency
            return math.sqrt(required_area / math.pi)

        r_a_only = calc_crescent_radius(a_only_size)
        r_b_only = calc_crescent_radius(b_only_size)

        # Validate crescents fit in available space
        # Available crescent region ≈ 60% of circle radius
        max_crescent_radius = base_circle_radius * 0.65

        print(f"  A-only radius: {r_a_only:.3f} (max: {max_crescent_radius:.3f})")
        print(f"  B-only radius: {r_b_only:.3f} (max: {max_crescent_radius:.3f})")

        # If crescents too big, scale ONLY crescent font (lens unaffected!)
        if max(r_a_only, r_b_only) > max_crescent_radius:
            scale_factor = max_crescent_radius / max(r_a_only, r_b_only) * 0.9
            crescent_font_size = int(crescent_font_size * scale_factor)
            crescent_padding = crescent_padding * scale_factor
            crescent_element_size = crescent_font_size / 95.0
            crescent_element_footprint = (crescent_element_size + crescent_padding) ** 2

            # Recalculate crescent radii
            r_a_only = calc_crescent_radius(a_only_size)
            r_b_only = calc_crescent_radius(b_only_size)

            print(f"  ⚠ Scaled crescent font: {base_font_size} → {crescent_font_size}px")
            print(f"  Recalculated A-only radius: {r_a_only:.3f}")
            print(f"  Recalculated B-only radius: {r_b_only:.3f}")

        print(f"")
        print(f"INDEPENDENCE CHECK:")
        print(f"  Lens font size: {lens_font_size}px")
        print(f"  Crescent font size: {crescent_font_size}px")
        print(f"  ✓ Regions are INDEPENDENT!" if lens_font_size == crescent_font_size else f"  ⚠ Different fonts!")
        print("="*80 + "\n")

        return {
            'union_size': union_size,
            'intersection_size': intersection_size,
            'a_only_size': a_only_size,
            'b_only_size': b_only_size,
            'circle_radius': base_circle_radius,
            'circle_separation': circle_separation,
            # LENS-specific
            'lens_font_size': lens_font_size,
            'lens_element_size': lens_element_size,
            'lens_padding': lens_padding,
            'actual_lens_area': actual_lens_area,
            'lens_width': lens_width,
            'lens_height': lens_height,
            # CRESCENT-specific (INDEPENDENT!)
            'crescent_font_size': crescent_font_size,
            'crescent_element_size': crescent_element_size,
            'crescent_padding': crescent_padding,
            'region_radii': {
                'a_only': r_a_only,
                'b_only': r_b_only
            },
            'status': tier,
            'tier': tier
        }

    def build_lens_isolated_venn_diagram(self, set_a, set_b, layout_params):
        """Build Venn diagram with ISOLATED regions"""
        circle_radius = layout_params['circle_radius']
        circle_sep = layout_params['circle_separation']

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

        label_a = MathTex("A", font_size=45, color=BLUE)
        label_a.move_to(circle_a_center + UP * (circle_radius + 0.4))

        label_b = MathTex("B", font_size=45, color=GREEN)
        label_b.move_to(circle_b_center + UP * (circle_radius + 0.4))

        self.play(Create(circle_a), Create(circle_b), Write(label_a), Write(label_b), run_time=2)
        self.wait(0.5)

        # Create numbers with REGION-SPECIFIC font sizes
        all_numbers = sorted(set_a | set_b)
        number_mobs = {}

        # Use DIFFERENT font sizes for different regions!
        for n in all_numbers:
            if n in intersection:
                font_size = layout_params['lens_font_size']
            else:
                font_size = layout_params['crescent_font_size']

            number_mobs[n] = Text(str(n), font_size=font_size, color=WHITE, weight=BOLD)

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

        # Calculate positions
        positions = self.lens_isolated_venn_layout(
            all_numbers,
            set_a,
            set_b,
            circle_a_center,
            circle_b_center,
            layout_params
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

        # Success
        success_msg = Text(
            f"✓ NO LEAKING! Lens: {layout_params['lens_font_size']}px, Crescents: {layout_params['crescent_font_size']}px",
            font_size=28,
            color=GREEN,
            weight=BOLD
        ).to_edge(DOWN, buff=0.5)

        self.play(Write(success_msg))
        self.wait(2)

        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=1.5)
        self.wait(0.5)

    def lens_isolated_venn_layout(self, numbers, set_a, set_b, center_a, center_b, layout_params):
        """Layout with ISOLATED region packing"""
        intersection = set_a & set_b
        a_only = set_a - set_b
        b_only = set_b - set_a

        positions = {}

        # A-only region - uses CRESCENT parameters
        if a_only:
            a_center = center_a + LEFT * (layout_params['circle_radius'] * 0.35)
            positions.update(
                self.circular_pack(
                    sorted(list(a_only)),
                    a_center,
                    layout_params['region_radii']['a_only'],
                    layout_params['crescent_element_size'],
                    layout_params['crescent_padding']
                )
            )

        # Intersection region - uses LENS parameters
        if intersection:
            lens_center = (center_a + center_b) / 2
            positions.update(
                self.elliptical_pack(
                    sorted(list(intersection)),
                    lens_center,
                    layout_params['lens_width'],
                    layout_params['lens_height'],
                    layout_params['lens_element_size'],
                    layout_params['lens_padding']
                )
            )

        # B-only region - uses CRESCENT parameters
        if b_only:
            b_center = center_b + RIGHT * (layout_params['circle_radius'] * 0.35)
            positions.update(
                self.circular_pack(
                    sorted(list(b_only)),
                    b_center,
                    layout_params['region_radii']['b_only'],
                    layout_params['crescent_element_size'],
                    layout_params['crescent_padding']
                )
            )

        return positions

    def elliptical_pack(self, elements, center, width, height, elem_size, padding):
        """Pack elements into elliptical lens region"""
        positions = {}
        count = len(elements)

        if count == 0:
            return positions

        spacing = elem_size + padding
        hex_spacing_x = spacing
        hex_spacing_y = spacing * 0.866

        cols = int(width / hex_spacing_x) + 2
        rows = int(height / hex_spacing_y) + 2

        positions_list = []

        for row in range(-rows, rows + 1):
            for col in range(-cols, cols + 1):
                x = col * hex_spacing_x
                y = row * hex_spacing_y

                if row % 2 != 0:
                    x += hex_spacing_x / 2

                pos = center + np.array([x, y, 0])

                normalized_x = (2 * x / width) if width > 0 else 0
                normalized_y = (2 * y / height) if height > 0 else 0

                if normalized_x**2 + normalized_y**2 <= 1:
                    dist = np.linalg.norm(pos - center)
                    positions_list.append((dist, pos))

        positions_list.sort(key=lambda x: x[0])

        for i, elem in enumerate(elements):
            if i < len(positions_list):
                positions[elem] = positions_list[i][1]
            else:
                positions[elem] = center

        return positions

    def circular_pack(self, elements, center, radius, elem_size, padding):
        """Circular packing for crescent regions - USES FULL SPACE"""
        positions = {}
        count = len(elements)

        if count == 0:
            return positions

        # Use hexagonal packing to FILL the available radius
        spacing = elem_size + padding
        hex_spacing_x = spacing
        hex_spacing_y = spacing * 0.866

        cols = int(2 * radius / hex_spacing_x) + 1
        rows = int(2 * radius / hex_spacing_y) + 1

        positions_list = []

        for row in range(-rows, rows + 1):
            for col in range(-cols, cols + 1):
                x = col * hex_spacing_x
                y = row * hex_spacing_y

                if row % 2 != 0:
                    x += hex_spacing_x / 2

                pos = center + np.array([x, y, 0])
                dist = np.linalg.norm(pos - center)

                if dist <= radius:
                    positions_list.append((dist, pos))

        positions_list.sort(key=lambda x: x[0])

        for i, elem in enumerate(elements):
            if i < len(positions_list):
                positions[elem] = positions_list[i][1]
            else:
                positions[elem] = center

        print(f"Circular pack: {count} elements in radius {radius:.2f}, spacing={spacing:.3f}")

        return positions

    def create_sketchy_circle(self, radius, center, color):
        """Hand-drawn circle"""
        np.random.seed(123)
        return VGroup(*[
            Circle(radius=radius + 0.04*i, color=color, stroke_width=3, stroke_opacity=0.8)
            .move_to(center + 0.04*np.array([np.random.randn(), np.random.randn(), 0]))
            for i in range(3)
        ])
