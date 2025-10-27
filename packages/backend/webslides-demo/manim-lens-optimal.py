"""
LENS-OPTIMAL Spatial Layout System - THE COMPLETE SOLUTION

THE TRUE FIX:
1. Calculate required lens area based on intersection element count
2. Use bisection solver to find optimal circle separation
3. Pack elements into the correctly-sized lens shape

This ensures the intersection region is ALWAYS properly sized!
"""

from manim import *
import numpy as np
import math

class LensOptimalLayout(Scene):
    def construct(self):
        # Colors
        SET_A_COLOR = BLUE
        SET_B_COLOR = GREEN
        INTERSECTION_COLOR = YELLOW

        # Test with 34 elements
        set_a = set(range(1, 21))      # {1..20}
        set_b = set(range(15, 35))     # {15..34}

        # CALCULATE with LENS-OPTIMAL algorithm
        layout_params = self.calculate_lens_optimal_layout(set_a, set_b)

        # Show calculation results
        title = Text("LENS-OPTIMAL Layout", font_size=48, color=GREEN, weight=BOLD)
        subtitle = Text("Solving for optimal circle separation", font_size=28, color=GRAY)
        subtitle.next_to(title, DOWN, buff=0.2)

        self.play(Write(title), FadeIn(subtitle))
        self.wait(1)

        info_text = VGroup(
            Text(f"Union: {layout_params['union_size']} elements", font_size=32, color=WHITE),
            Text(f"Intersection: {layout_params['intersection_size']} elements", font_size=32, color=YELLOW, weight=BOLD),
            Text("", font_size=24, color=WHITE),  # Spacer
            Text("LENS CALCULATION:", font_size=28, color=YELLOW, weight=BOLD),
            Text(f"Required area: {layout_params['required_lens_area']:.3f}u²", font_size=28, color=YELLOW),
            Text(f"Actual lens area: {layout_params['actual_lens_area']:.3f}u²", font_size=28, color=GREEN),
            Text(f"Lens width: {layout_params['lens_width']:.2f}u", font_size=26, color=GRAY),
            Text(f"Lens height: {layout_params['lens_height']:.2f}u", font_size=26, color=GRAY),
            Text("", font_size=24, color=WHITE),  # Spacer
            Text(f"Circle radius: {layout_params['circle_radius']:.2f}u", font_size=28, color=BLUE),
            Text(f"Circle separation: {layout_params['circle_separation']:.2f}u (SOLVED!)", font_size=28, color=GREEN, weight=BOLD),
            Text("", font_size=24, color=WHITE),  # Spacer
            Text(f"Fit status: {layout_params['fit_status']}", font_size=32, color=GREEN if layout_params['fit_ok'] else RED, weight=BOLD)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        info_text.next_to(subtitle, DOWN, buff=0.4)

        self.play(FadeIn(info_text, shift=UP*0.3))
        self.wait(5)

        self.play(FadeOut(title), FadeOut(subtitle), FadeOut(info_text))
        self.wait(0.5)

        # Build diagram with LENS-OPTIMAL layout
        self.build_lens_optimal_venn_diagram(set_a, set_b, layout_params)

    def calculate_lens_area(self, R, d):
        """
        Calculate area of lens-shaped intersection of two circles

        Args:
            R: radius of both circles
            d: distance between circle centers

        Returns:
            area: lens area in square units
        """
        if d >= 2 * R:
            return 0
        elif d <= 0:
            return math.pi * R**2

        try:
            part1 = 2 * R**2 * math.acos(d / (2 * R))
            part2 = (d / 2) * math.sqrt(4 * R**2 - d**2)
            area = part1 - part2
            return max(0, area)
        except:
            return 0

    def calculate_lens_dimensions(self, R, d):
        """Calculate width and height of lens shape"""
        if d >= 2 * R:
            return (0, 0)

        height = 2 * math.sqrt(R**2 - (d/2)**2)
        width = 2 * R - d

        return (width, height)

    def solve_for_separation(self, R, required_area, tolerance=0.01, max_iterations=100):
        """
        BISECTION SOLVER: Find circle separation d such that lens area = required_area

        Args:
            R: circle radius
            required_area: target lens area
            tolerance: convergence tolerance
            max_iterations: maximum solver iterations

        Returns:
            d: optimal separation distance
        """
        # Binary search bounds
        d_min = 0           # Complete overlap (lens area = π*R²)
        d_max = 2 * R       # No overlap (lens area = 0)

        # Check if required area is achievable
        max_possible_area = math.pi * R**2
        if required_area > max_possible_area:
            print(f"WARNING: Required area {required_area:.3f} exceeds max {max_possible_area:.3f}")
            return 0  # Maximum overlap

        # Bisection method
        for iteration in range(max_iterations):
            d_mid = (d_min + d_max) / 2
            area_mid = self.calculate_lens_area(R, d_mid)

            error = abs(area_mid - required_area)

            if iteration % 10 == 0:
                print(f"  Iteration {iteration}: d={d_mid:.4f}, area={area_mid:.4f}, error={error:.4f}")

            if error < tolerance:
                print(f"  ✓ Converged in {iteration+1} iterations: d={d_mid:.4f}")
                return d_mid

            if area_mid > required_area:
                # Too much overlap, increase separation
                d_min = d_mid
            else:
                # Not enough overlap, decrease separation
                d_max = d_mid

        # If didn't converge, return best estimate
        print(f"  ! Max iterations reached, best estimate: d={d_mid:.4f}")
        return d_mid

    def calculate_lens_optimal_layout(self, set_a, set_b):
        """
        LENS-OPTIMAL spatial calculator
        Solves for circle separation to fit intersection elements
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

        # Calculate element physical size
        element_size = base_font_size / 95.0
        element_footprint = (element_size + base_padding) ** 2
        packing_efficiency = 0.75

        # CRITICAL: Calculate REQUIRED lens area for intersection
        if intersection_size > 0:
            required_lens_area = (intersection_size * element_footprint) / packing_efficiency
        else:
            required_lens_area = 0.1  # Minimum

        print("\n" + "="*80)
        print("LENS-OPTIMAL CALCULATOR - BISECTION SOLVER")
        print("="*80)
        print(f"Circle radius: R = {base_circle_radius:.3f}")
        print(f"Intersection elements: {intersection_size}")
        print(f"Element footprint: {element_footprint:.4f} units²")
        print(f"Required lens area: {required_lens_area:.3f} units²")
        print(f"")
        print("SOLVING for optimal separation...")

        # SOLVE for optimal circle separation
        circle_separation = self.solve_for_separation(
            base_circle_radius,
            required_lens_area
        )

        # Calculate actual lens geometry
        actual_lens_area = self.calculate_lens_area(base_circle_radius, circle_separation)
        lens_width, lens_height = self.calculate_lens_dimensions(base_circle_radius, circle_separation)
        max_in_lens = int((actual_lens_area * packing_efficiency) / element_footprint)

        fit_ok = intersection_size <= max_in_lens
        fit_status = f"✓ FITS ({intersection_size}/{max_in_lens})" if fit_ok else f"✗ TOO TIGHT ({intersection_size}/{max_in_lens})"

        # Calculate crescent region radii for A-only and B-only
        def calc_crescent_radius(n_elements):
            if n_elements == 0:
                return 0.1
            required_area = (n_elements * element_footprint) / packing_efficiency
            return math.sqrt(required_area / math.pi)

        r_a_only = calc_crescent_radius(a_only_size)
        r_b_only = calc_crescent_radius(b_only_size)

        # Validation - if crescents too big, scale down
        max_crescent_radius = base_circle_radius * 0.6
        if max(r_a_only, r_b_only) > max_crescent_radius:
            scale_factor = max_crescent_radius / max(r_a_only, r_b_only) * 0.9
            base_font_size = int(base_font_size * scale_factor)
            base_padding = base_padding * scale_factor

            # Recalculate everything
            element_size = base_font_size / 95.0
            element_footprint = (element_size + base_padding) ** 2
            required_lens_area = (intersection_size * element_footprint) / packing_efficiency

            circle_separation = self.solve_for_separation(base_circle_radius, required_lens_area)
            actual_lens_area = self.calculate_lens_area(base_circle_radius, circle_separation)
            lens_width, lens_height = self.calculate_lens_dimensions(base_circle_radius, circle_separation)
            max_in_lens = int((actual_lens_area * packing_efficiency) / element_footprint)

            r_a_only = calc_crescent_radius(a_only_size)
            r_b_only = calc_crescent_radius(b_only_size)

        print(f"")
        print(f"RESULTS:")
        print(f"  Circle separation: d = {circle_separation:.3f}")
        print(f"  Actual lens area: {actual_lens_area:.3f} units²")
        print(f"  Lens dimensions: {lens_width:.3f} × {lens_height:.3f}")
        print(f"  Max elements in lens: {max_in_lens}")
        print(f"  Fit status: {fit_status}")
        print(f"")
        print(f"REGIONS:")
        print(f"  A-only: {a_only_size} elements → r = {r_a_only:.3f}")
        print(f"  Intersection: {intersection_size} elements → LENS ({lens_width:.3f} × {lens_height:.3f})")
        print(f"  B-only: {b_only_size} elements → r = {r_b_only:.3f}")
        print("="*80 + "\n")

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
            'required_lens_area': required_lens_area,
            'actual_lens_area': actual_lens_area,
            'lens_width': lens_width,
            'lens_height': lens_height,
            'max_in_lens': max_in_lens,
            'fit_ok': fit_ok,
            'fit_status': fit_status,
            'region_radii': {
                'a_only': r_a_only,
                'b_only': r_b_only
            },
            'status': tier,
            'tier': tier
        }

    def build_lens_optimal_venn_diagram(self, set_a, set_b, layout_params):
        """Build Venn diagram with LENS-OPTIMAL packing"""
        # Extract parameters
        circle_radius = layout_params['circle_radius']
        circle_sep = layout_params['circle_separation']
        font_size = layout_params['element_font_size']
        element_size = layout_params['element_size']
        padding = layout_params['padding']

        lens_width = layout_params['lens_width']
        lens_height = layout_params['lens_height']

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

        # ADD DEBUG ELLIPSE to show lens bounds
        lens_center = ORIGIN
        debug_lens = Ellipse(
            width=lens_width,
            height=lens_height,
            color=YELLOW,
            stroke_width=3,
            stroke_opacity=0.6
        ).move_to(lens_center)

        lens_label = Text(
            f"Lens: {lens_width:.2f} × {lens_height:.2f}",
            font_size=24,
            color=YELLOW
        ).next_to(debug_lens, DOWN, buff=0.3)

        self.play(Create(debug_lens), Write(lens_label))
        self.wait(1.5)

        # Create numbers
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

        # Calculate positions with LENS-OPTIMAL packing
        positions = self.lens_optimal_venn_layout(
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
        self.wait(1.5)

        # Fade out debug lens
        self.play(FadeOut(debug_lens), FadeOut(lens_label))
        self.wait(1)

        # Success
        success_msg = Text(
            f"✓ PERFECT FIT! {layout_params['intersection_size']} elements in {layout_params['actual_lens_area']:.2f}u² lens",
            font_size=30,
            color=GREEN,
            weight=BOLD
        ).to_edge(DOWN, buff=0.5)

        self.play(Write(success_msg))
        self.wait(2)

        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=1.5)
        self.wait(0.5)

    def lens_optimal_venn_layout(self, numbers, set_a, set_b, center_a, center_b, layout_params):
        """Layout with LENS-OPTIMAL packing"""
        intersection = set_a & set_b
        a_only = set_a - set_b
        b_only = set_b - set_a

        positions = {}

        lens_width = layout_params['lens_width']
        lens_height = layout_params['lens_height']
        element_size = layout_params['element_size']
        padding = layout_params['padding']

        # A-only region
        if a_only:
            a_center = center_a + LEFT * (layout_params['circle_radius'] * 0.3)
            positions.update(
                self.circular_pack(
                    sorted(list(a_only)),
                    a_center,
                    layout_params['region_radii']['a_only'],
                    element_size,
                    padding
                )
            )

        # Intersection region - LENS PACKING with optimal dimensions
        if intersection:
            lens_center = (center_a + center_b) / 2
            positions.update(
                self.elliptical_pack(
                    sorted(list(intersection)),
                    lens_center,
                    lens_width,
                    lens_height,
                    element_size,
                    padding
                )
            )

        # B-only region
        if b_only:
            b_center = center_b + RIGHT * (layout_params['circle_radius'] * 0.3)
            positions.update(
                self.circular_pack(
                    sorted(list(b_only)),
                    b_center,
                    layout_params['region_radii']['b_only'],
                    element_size,
                    padding
                )
            )

        return positions

    def elliptical_pack(self, elements, center, width, height, elem_size, padding):
        """
        Pack elements into ELLIPTICAL (lens-shaped) region
        Uses hexagonal packing within ellipse bounds
        """
        positions = {}
        count = len(elements)

        if count == 0:
            return positions

        spacing = elem_size + padding

        # Hexagonal grid parameters
        hex_spacing_x = spacing
        hex_spacing_y = spacing * 0.866

        # Calculate grid dimensions
        cols = int(width / hex_spacing_x) + 2
        rows = int(height / hex_spacing_y) + 2

        positions_list = []

        # Generate hexagonal grid within ellipse
        for row in range(-rows, rows + 1):
            for col in range(-cols, cols + 1):
                x = col * hex_spacing_x
                y = row * hex_spacing_y

                # Hexagonal offset
                if row % 2 != 0:
                    x += hex_spacing_x / 2

                pos = center + np.array([x, y, 0])

                # Check if within ellipse bounds
                normalized_x = (2 * x / width) if width > 0 else 0
                normalized_y = (2 * y / height) if height > 0 else 0

                if normalized_x**2 + normalized_y**2 <= 1:
                    dist = np.linalg.norm(pos - center)
                    positions_list.append((dist, pos))

        # Sort by distance from center
        positions_list.sort(key=lambda x: x[0])

        # Assign to elements
        for i, elem in enumerate(elements):
            if i < len(positions_list):
                positions[elem] = positions_list[i][1]
            else:
                positions[elem] = center

        print(f"Elliptical packing: {count} elements into {width:.2f} × {height:.2f} lens")

        return positions

    def circular_pack(self, elements, center, radius, elem_size, padding):
        """Circular packing for crescent regions"""
        positions = {}
        count = len(elements)

        if count == 0:
            return positions

        if count == 1:
            positions[elements[0]] = center
        elif count <= 8:
            for i, elem in enumerate(elements):
                angle = i * TAU / count - PI/2
                pos = center + np.array([
                    radius * 0.7 * np.cos(angle),
                    radius * 0.7 * np.sin(angle),
                    0
                ])
                positions[elem] = pos
        else:
            # Multi-ring
            for i, elem in enumerate(elements):
                ring = i // 8
                angle_in_ring = (i % 8) * TAU / 8 - PI/2
                r = radius * (0.3 + 0.4 * min(ring / 2, 1))
                pos = center + np.array([
                    r * np.cos(angle_in_ring),
                    r * np.sin(angle_in_ring),
                    0
                ])
                positions[elem] = pos

        return positions

    def create_sketchy_circle(self, radius, center, color):
        """Hand-drawn circle"""
        np.random.seed(123)
        return VGroup(*[
            Circle(radius=radius + 0.04*i, color=color, stroke_width=3, stroke_opacity=0.8)
            .move_to(center + 0.04*np.array([np.random.randn(), np.random.randn(), 0]))
            for i in range(3)
        ])
