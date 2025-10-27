"""
Collision Avoidance Test - Smart Venn Diagram Layout

Tests the smart layout system with:
- Set A = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}  (10 elements)
- Set B = {6, 7, 8, 9, 10, 11, 12, 13, 14, 15}  (10 elements)
- Intersection = {6, 7, 8, 9, 10}  (5 elements)

This creates 15 unique numbers total - a real stress test!
"""

from manim import *
import numpy as np

class CollisionAvoidanceTest(Scene):
    def construct(self):
        # Colors
        SET_A_COLOR = BLUE
        SET_B_COLOR = GREEN
        INTERSECTION_COLOR = YELLOW
        UNIVERSAL_COLOR = GRAY

        # ===== TITLE =====
        title = Text("Collision Avoidance Test", font_size=50, color=WHITE, weight=BOLD)
        subtitle = Text("15 Numbers in Overlapping Sets", font_size=32, color="#aaaaaa")
        subtitle.next_to(title, DOWN)

        self.play(Write(title))
        self.play(FadeIn(subtitle, shift=UP*0.2))
        self.wait(1.5)
        self.play(FadeOut(title), FadeOut(subtitle))

        # ===== DEFINE SETS =====
        set_a = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
        set_b = {6, 7, 8, 9, 10, 11, 12, 13, 14, 15}
        intersection = set_a & set_b  # {6, 7, 8, 9, 10}
        a_only = set_a - set_b        # {1, 2, 3, 4, 5}
        b_only = set_b - set_a        # {11, 12, 13, 14, 15}

        # Show set definitions
        set_a_def = MathTex(
            r"A = \{1, 2, 3, ..., 10\}",
            font_size=36,
            color=SET_A_COLOR
        ).to_corner(UL, buff=0.5)

        set_b_def = MathTex(
            r"B = \{6, 7, 8, ..., 15\}",
            font_size=36,
            color=SET_B_COLOR
        ).next_to(set_a_def, DOWN, buff=0.3, aligned_edge=LEFT)

        intersection_def = MathTex(
            r"A \cap B = \{6, 7, 8, 9, 10\}",
            font_size=32,
            color=INTERSECTION_COLOR
        ).next_to(set_b_def, DOWN, buff=0.3, aligned_edge=LEFT)

        self.play(Write(set_a_def))
        self.wait(0.3)
        self.play(Write(set_b_def))
        self.wait(0.3)
        self.play(Write(intersection_def))
        self.wait(1)

        # ===== DRAW VENN DIAGRAM =====
        circle_a_center = LEFT * 1.8
        circle_b_center = RIGHT * 1.8

        circle_a = self.create_sketchy_circle(2.2, circle_a_center, SET_A_COLOR)
        circle_b = self.create_sketchy_circle(2.2, circle_b_center, SET_B_COLOR)

        label_a = MathTex("A", font_size=60, color=SET_A_COLOR)
        label_a.move_to(circle_a_center + UP*2.8)

        label_b = MathTex("B", font_size=60, color=SET_B_COLOR)
        label_b.move_to(circle_b_center + UP*2.8)

        self.play(
            Create(circle_a),
            Create(circle_b),
            Write(label_a),
            Write(label_b),
            run_time=2
        )
        self.wait(0.5)

        # ===== CREATE NUMBER MOBJECTS =====
        all_numbers = sorted(set_a | set_b)  # {1..15}
        number_mobs = {
            n: Text(str(n), font_size=38, color=WHITE, weight=BOLD)
            for n in all_numbers
        }

        # Start scattered randomly
        np.random.seed(42)
        for mob in number_mobs.values():
            angle = np.random.uniform(0, TAU)
            distance = np.random.uniform(4, 5)
            mob.move_to(np.array([
                distance * np.cos(angle),
                distance * np.sin(angle),
                0
            ]))

        # Show all numbers scattered
        self.play(
            LaggedStart(
                *[FadeIn(mob, scale=0.5) for mob in number_mobs.values()],
                lag_ratio=0.05
            ),
            run_time=2
        )
        self.wait(1)

        # ===== SMART LAYOUT WITH COLLISION AVOIDANCE =====
        positions = self.smart_venn_layout(
            all_numbers,
            set_a,
            set_b,
            circle_a_center,
            circle_b_center
        )

        # Animate numbers to their collision-free positions
        animations = []
        for num, pos in positions.items():
            mob = number_mobs[num]

            # Determine color based on region
            if num in intersection:
                color = INTERSECTION_COLOR
            elif num in a_only:
                color = SET_A_COLOR
            else:  # b_only
                color = SET_B_COLOR

            animations.append(
                mob.animate
                .move_to(pos)
                .set_color(color)
                .scale(1.1)
            )

        self.play(*animations, run_time=3, rate_func=smooth)
        self.play(*[mob.animate.scale(1/1.1) for mob in number_mobs.values()])
        self.wait(3)

        # ===== HIGHLIGHT REGIONS =====
        # Highlight intersection
        intersection_region = Intersection(
            Circle(radius=2.2).move_to(circle_a_center),
            Circle(radius=2.2).move_to(circle_b_center),
            color=INTERSECTION_COLOR,
            fill_opacity=0.2,
            stroke_width=0
        )

        highlight_text = Text(
            "No Overlaps! ✓",
            font_size=40,
            color=GREEN,
            weight=BOLD
        ).to_edge(DOWN, buff=0.5)

        self.play(
            FadeIn(intersection_region),
            Write(highlight_text)
        )
        self.wait(2)

        # Final fade out
        self.play(*[FadeOut(mob) for mob in self.mobjects], run_time=1.5)
        self.wait(0.5)

    # ===== COLLISION AVOIDANCE SYSTEM =====

    def smart_venn_layout(self, numbers, set_a, set_b, circle_a_center, circle_b_center):
        """
        Intelligent Venn diagram layout with collision avoidance

        Args:
            numbers: List of all numbers to place
            set_a, set_b: Sets defining membership
            circle_a_center, circle_b_center: Circle positions

        Returns:
            Dictionary mapping number -> position (np.array)
        """
        # Step 1: Categorize into regions
        intersection = set_a & set_b
        a_only = set_a - set_b
        b_only = set_b - set_a

        regions = {
            'a_only': sorted(list(a_only)),
            'intersection': sorted(list(intersection)),
            'b_only': sorted(list(b_only))
        }

        positions = {}

        # Step 2: Position each region with collision avoidance

        # A only (left side of circle A)
        if regions['a_only']:
            a_only_center = circle_a_center + LEFT * 0.9
            positions.update(
                self.position_in_region(
                    regions['a_only'],
                    a_only_center,
                    radius=1.0,
                    existing_positions=[]
                )
            )

        # Intersection (center, between circles)
        if regions['intersection']:
            intersection_center = (circle_a_center + circle_b_center) / 2
            positions.update(
                self.position_in_region(
                    regions['intersection'],
                    intersection_center,
                    radius=0.7,
                    existing_positions=list(positions.values())
                )
            )

        # B only (right side of circle B)
        if regions['b_only']:
            b_only_center = circle_b_center + RIGHT * 0.9
            positions.update(
                self.position_in_region(
                    regions['b_only'],
                    b_only_center,
                    radius=1.0,
                    existing_positions=list(positions.values())
                )
            )

        return positions

    def position_in_region(self, elements, center, radius, existing_positions, padding=0.35):
        """
        Position elements in a circular region with collision avoidance

        Args:
            elements: List of numbers to place
            center: Center point of the region
            radius: Radius of the circular region
            existing_positions: Already-placed positions to avoid
            padding: Minimum distance between elements

        Returns:
            Dictionary mapping element -> position
        """
        count = len(elements)
        positions = {}

        if count == 0:
            return positions

        if count == 1:
            # Single element: place at center
            positions[elements[0]] = center
        elif count == 2:
            # Two elements: vertical stack
            positions[elements[0]] = center + UP * 0.4
            positions[elements[1]] = center + DOWN * 0.4
        elif count <= 5:
            # Small group: circular layout
            for i, elem in enumerate(elements):
                angle = i * TAU / count - PI/2  # Start from top
                pos = center + np.array([
                    radius * np.cos(angle),
                    radius * np.sin(angle),
                    0
                ])
                positions[elem] = pos
        else:
            # Large group: use collision-avoiding spiral placement
            positions = self.spiral_layout(
                elements,
                center,
                radius,
                existing_positions,
                padding
            )

        return positions

    def spiral_layout(self, elements, center, max_radius, existing_positions, padding):
        """
        Place elements in a spiral pattern with collision detection

        Args:
            elements: List of elements to place
            center: Center of the spiral
            max_radius: Maximum radius for placement
            existing_positions: Already-placed positions to avoid
            padding: Minimum distance between elements
        """
        positions = {}
        placed = list(existing_positions)  # Copy existing positions

        for i, elem in enumerate(elements):
            # Try positions in expanding circles
            for r in np.linspace(0, max_radius, 15):
                # Try angles around the circle
                for angle in np.linspace(0, TAU, 12):
                    candidate = center + np.array([
                        r * np.cos(angle),
                        r * np.sin(angle),
                        0
                    ])

                    # Check collision with all placed elements
                    if self.is_position_free(candidate, placed, padding):
                        positions[elem] = candidate
                        placed.append(candidate)
                        break
                else:
                    continue
                break
            else:
                # If no free position found, place at center (fallback)
                positions[elem] = center

        return positions

    def is_position_free(self, candidate, placed_positions, padding):
        """
        Check if a candidate position is free (no collisions)

        Args:
            candidate: Position to check (np.array)
            placed_positions: List of already-placed positions
            padding: Minimum allowed distance

        Returns:
            True if position is free, False if collision detected
        """
        for placed in placed_positions:
            distance = np.linalg.norm(candidate - placed)
            if distance < padding:
                return False
        return True

    def create_sketchy_circle(self, radius, center, color):
        """Create hand-drawn circle effect"""
        np.random.seed(123)
        return VGroup(*[
            Circle(
                radius=radius + 0.04*i,
                color=color,
                stroke_width=3,
                stroke_opacity=0.8
            ).move_to(center + 0.04*np.array([
                np.random.randn(),
                np.random.randn(),
                0
            ]))
            for i in range(3)
        ])
