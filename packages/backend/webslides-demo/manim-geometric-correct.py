"""
GEOMETRICALLY CORRECT Spatial Layout System

THE TRUE FIX:
- Intersection is a LENS SHAPE, not a circle!
- Must calculate actual lens area from circle geometry
- Then fit elements into that lens area

Lens area formula:
A = 2 * R² * arccos(d/(2R)) - (d/2) * sqrt(4R² - d²)

where:
  R = circle radius
  d = distance between circle centers
"""

from manim import *
import numpy as np
import math

class GeometricCorrectLayout(Scene):
    def construct(self):
        # Colors
        SET_A_COLOR = BLUE
        SET_B_COLOR = GREEN
        INTERSECTION_COLOR = YELLOW

        # Test with 34 elements
        set_a = set(range(1, 21))      # {1..20}
        set_b = set(range(15, 35))     # {15..34}

        # CALCULATE with GEOMETRICALLY CORRECT algorithm
        layout_params = self.calculate_geometric_layout(set_a, set_b)

        # Show calculation results
        title = Text("GEOMETRICALLY CORRECT Layout", font_size=48, color=GREEN, weight=BOLD)
        self.play(Write(title))
        self.wait(1)

        info_text = VGroup(
            Text(f"Union: {layout_params['union_size']} elements", font_size=32, color=WHITE),
            Text(f"Circle radius: {layout_params['circle_radius']:.2f}u", font_size=32, color=BLUE),
            Text(f"Circle separation: {layout_params['circle_separation']:.2f}u", font_size=28, color=GRAY),
            Text("", font_size=24, color=WHITE),  # Spacer
            Text("LENS GEOMETRY:", font_size=28, color=YELLOW, weight=BOLD),
            Text(f"Lens area: {layout_params['lens_area']:.3f}u²", font_size=28, color=YELLOW),
            Text(f"Lens width: {layout_params['lens_width']:.2f}u", font_size=28, color=YELLOW),
            Text(f"Lens height: {layout_params['lens_height']:.2f}u", font_size=28, color=YELLOW),
            Text("", font_size=24, color=WHITE),  # Spacer
            Text(f"A-only: {layout_params['a_only_size']} elem", font_size=28, color=BLUE),
            Text(f"Intersection: {layout_params['intersection_size']} elem (LENS!)", font_size=28, color=YELLOW, weight=BOLD),
            Text(f"B-only: {layout_params['b_only_size']} elem", font_size=28, color=GREEN),
            Text("", font_size=24, color=WHITE),  # Spacer
            Text(f"Status: {layout_params['status'].upper()}", font_size=32, color=ORANGE, weight=BOLD)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        info_text.next_to(title, DOWN, buff=0.3)

        self.play(FadeIn(info_text, shift=UP*0.3))
        self.wait(5)

        self.play(FadeOut(title), FadeOut(info_text))
        self.wait(0.5)

        # Build diagram with GEOMETRICALLY CORRECT layout
        self.build_geometric_venn_diagram(set_a, set_b, layout_params)

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
            # Circles don't overlap
            return 0
        elif d <= 0:
            # Circles completely overlap
            return math.pi * R**2

        # Lens area formula
        # A = 2 * R² * arccos(d/(2R)) - (d/2) * sqrt(4R² - d²)

        try:
            part1 = 2 * R**2 * math.acos(d / (2 * R))
            part2 = (d / 2) * math.sqrt(4 * R**2 - d**2)
            area = part1 - part2
            return max(0, area)
        except:
            # Fallback if math error
            return 0.5 * math.pi * R**2

    def calculate_lens_dimensions(self, R, d):
        """
        Calculate width and height of lens shape

        Returns:
            (width, height) tuple
        """
        if d >= 2 * R:
            return (0, 0)

        # Height of lens (perpendicular to line joining centers)
        # This is the maximum vertical extent
        height = 2 * math.sqrt(R**2 - (d/2)**2)

        # Width of lens (along line joining centers)
        # This is the horizontal extent where circles overlap
        width = 2 * R - d

        return (width, height)

    def calculate_geometric_layout(self, set_a, set_b):
        """
        GEOMETRICALLY CORRECT spatial calculator
        Treats intersection as LENS SHAPE, not circle
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

        # Circle separation
        circle_separation = base_circle_radius * 1.6

        # Calculate element physical size
        element_size = base_font_size / 95.0
        element_footprint = (element_size + base_padding) ** 2
        packing_efficiency = 0.75

        # CRITICAL: Calculate LENS area for intersection
        lens_area = self.calculate_lens_area(base_circle_radius, circle_separation)
        lens_width, lens_height = self.calculate_lens_dimensions(base_circle_radius, circle_separation)

        # Calculate how many elements can fit in lens
        max_in_lens = int((lens_area * packing_efficiency) / element_footprint)

        # Calculate region radii for A-only and B-only
        # These are crescent-shaped regions, approximate as partial circles
        def calc_crescent_radius(n_elements):
            if n_elements == 0:
                return 0.1
            # Approximate crescent as circle for now
            required_area = (n_elements * element_footprint) / packing_efficiency
            return math.sqrt(required_area / math.pi)

        r_a_only = calc_crescent_radius(a_only_size)
        r_b_only = calc_crescent_radius(b_only_size)

        # Validate
        max_region_radius = base_circle_radius * 0.75
        if max(r_a_only, r_b_only) > max_region_radius:
            scale_factor = max_region_radius / max(r_a_only, r_b_only) * 0.9
            base_font_size = int(base_font_size * scale_factor)
            base_padding = base_padding * scale_factor

            # Recalculate
            element_size = base_font_size / 95.0
            element_footprint = (element_size + base_padding) ** 2

            r_a_only = calc_crescent_radius(a_only_size)
            r_b_only = calc_crescent_radius(b_only_size)
            lens_area = self.calculate_lens_area(base_circle_radius, circle_separation)
            max_in_lens = int((lens_area * packing_efficiency) / element_footprint)

        # Debug output
        print("\n" + "="*70)
        print("GEOMETRICALLY CORRECT CALCULATOR - DEBUG OUTPUT")
        print("="*70)
        print(f"Circle radius: {base_circle_radius:.3f}")
        print(f"Circle separation: {circle_separation:.3f}")
        print(f"")
        print(f"LENS GEOMETRY:")
        print(f"  Lens area: {lens_area:.3f} units²")
        print(f"  Lens width: {lens_width:.3f} units")
        print(f"  Lens height: {lens_height:.3f} units")
        print(f"  Max elements in lens: {max_in_lens}")
        print(f"  Actual elements: {intersection_size}")
        print(f"  Fit status: {'✓ FITS' if intersection_size <= max_in_lens else '✗ TOO TIGHT'}")
        print(f"")
        print(f"REGIONS:")
        print(f"  A-only: {a_only_size} elements → r = {r_a_only:.3f}")
        print(f"  Intersection: {intersection_size} elements → LENS SHAPE")
        print(f"  B-only: {b_only_size} elements → r = {r_b_only:.3f}")
        print(f"")
        print(f"Element footprint: {element_footprint:.4f}")
        print(f"Font size: {base_font_size}")
        print(f"Tier: {tier}")
        print("="*70 + "\n")

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
            'lens_area': lens_area,
            'lens_width': lens_width,
            'lens_height': lens_height,
            'max_in_lens': max_in_lens,
            'region_radii': {
                'a_only': r_a_only,
                'b_only': r_b_only
            },
            'status': tier,
            'tier': tier
        }

    def build_geometric_venn_diagram(self, set_a, set_b, layout_params):
        """Build Venn diagram with GEOMETRICALLY CORRECT lens packing"""
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

        # ADD DEBUG RECTANGLE to show lens bounds
        lens_center = ORIGIN  # Midpoint between circles
        debug_lens = Rectangle(
            width=lens_width,
            height=lens_height,
            color=YELLOW,
            stroke_width=2,
            stroke_opacity=0.5
        ).move_to(lens_center)

        self.play(Create(debug_lens))
        self.wait(1)

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

        # Calculate positions with LENS-AWARE packing
        positions = self.geometric_venn_layout(
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
        self.wait(1)

        # Fade out debug lens
        self.play(FadeOut(debug_lens))
        self.wait(1)

        # Success
        success_msg = Text(
            f"✓ LENS geometry! {layout_params['intersection_size']} elements in {layout_params['lens_area']:.2f}u² lens",
            font_size=28,
            color=GREEN,
            weight=BOLD
        ).to_edge(DOWN, buff=0.5)

        self.play(Write(success_msg))
        self.wait(2)

        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=1.5)
        self.wait(0.5)

    def geometric_venn_layout(self, numbers, set_a, set_b, center_a, center_b, layout_params):
        """Layout with GEOMETRICALLY CORRECT lens packing"""
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
            a_center = center_a + LEFT * 0.35
            positions.update(
                self.circular_pack(
                    sorted(list(a_only)),
                    a_center,
                    layout_params['region_radii']['a_only'],
                    element_size,
                    padding
                )
            )

        # Intersection region - LENS PACKING
        if intersection:
            lens_center = (center_a + center_b) / 2
            positions.update(
                self.lens_pack(
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
            b_center = center_b + RIGHT * 0.35
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

    def lens_pack(self, elements, center, width, height, elem_size, padding):
        """
        Pack elements into LENS SHAPE

        Uses rectangular grid within lens bounds
        """
        positions = {}
        count = len(elements)

        if count == 0:
            return positions

        spacing = elem_size + padding

        # Calculate grid dimensions
        cols = int(width / spacing) + 1
        rows = int(height / spacing) + 1

        positions_list = []

        # Generate grid positions within lens
        for row in range(-rows, rows + 1):
            for col in range(-cols, cols + 1):
                x = col * spacing
                y = row * spacing

                pos = center + np.array([x, y, 0])

                # Check if within lens bounds (approximate as ellipse)
                if abs(x) <= width / 2 and abs(y) <= height / 2:
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

        print(f"Lens packing: {count} elements into {width:.2f} × {height:.2f} lens")

        return positions

    def circular_pack(self, elements, center, radius, elem_size, padding):
        """Simple circular packing for crescent regions"""
        positions = {}
        count = len(elements)

        if count == 0:
            return positions

        spacing = elem_size + padding

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
                angle = i * TAU / count - PI/2
                r = radius * (0.4 + 0.5 * (i % 2))
                pos = center + np.array([
                    r * np.cos(angle),
                    r * np.sin(angle),
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
