"""
Improved Collision Avoidance - Enhanced Distribution

Improvements:
1. Better intersection layout (pentagon/circular instead of vertical stack)
2. More even distribution in circular regions
3. Smarter spacing based on region density
4. Organic jitter for natural look
"""

from manim import *
import numpy as np

class ImprovedCollisionAvoidance(Scene):
    def construct(self):
        # Colors
        SET_A_COLOR = BLUE
        SET_B_COLOR = GREEN
        INTERSECTION_COLOR = YELLOW
        UNIVERSAL_COLOR = GRAY

        # ===== TITLE =====
        title = Text("Improved Collision Avoidance", font_size=50, color=WHITE, weight=BOLD)
        subtitle = Text("Better Distribution & Spacing", font_size=32, color="#aaaaaa")
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

        # ===== IMPROVED SMART LAYOUT =====
        positions = self.improved_venn_layout(
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

        # ===== HIGHLIGHT IMPROVEMENTS =====
        # Highlight intersection
        intersection_region = Intersection(
            Circle(radius=2.2).move_to(circle_a_center),
            Circle(radius=2.2).move_to(circle_b_center),
            color=INTERSECTION_COLOR,
            fill_opacity=0.2,
            stroke_width=0
        )

        highlight_text = Text(
            "Better Distribution! ✓",
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

    # ===== IMPROVED COLLISION AVOIDANCE SYSTEM =====

    def improved_venn_layout(self, numbers, set_a, set_b, circle_a_center, circle_b_center):
        """
        IMPROVED Venn diagram layout with better distribution

        Key improvements:
        1. Circular/pentagon layout for intersection (not vertical stack)
        2. Better use of full circular area
        3. Organic jitter for natural look
        4. Smarter spacing based on density
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

        # Step 2: Position each region with IMPROVED distribution

        # A only (left side of circle A)
        if regions['a_only']:
            a_only_center = circle_a_center + LEFT * 0.8
            positions.update(
                self.improved_circular_layout(
                    regions['a_only'],
                    a_only_center,
                    radius=1.0,
                    spread_factor=1.2  # Use more space
                )
            )

        # Intersection (center, between circles) - IMPROVED LAYOUT
        if regions['intersection']:
            intersection_center = (circle_a_center + circle_b_center) / 2
            positions.update(
                self.improved_circular_layout(
                    regions['intersection'],
                    intersection_center,
                    radius=0.65,  # Slightly larger for better spread
                    spread_factor=1.0,
                    use_tight_packing=True  # Special tight packing for intersection
                )
            )

        # B only (right side of circle B)
        if regions['b_only']:
            b_only_center = circle_b_center + RIGHT * 0.8
            positions.update(
                self.improved_circular_layout(
                    regions['b_only'],
                    b_only_center,
                    radius=1.0,
                    spread_factor=1.2
                )
            )

        return positions

    def improved_circular_layout(self, elements, center, radius, spread_factor=1.0, use_tight_packing=False):
        """
        IMPROVED circular layout with better distribution

        Args:
            elements: List of numbers to place
            center: Center point of the region
            radius: Base radius of the circular region
            spread_factor: Multiplier for spacing (>1 = more spread out)
            use_tight_packing: Use tight circular packing for small groups
        """
        count = len(elements)
        positions = {}

        if count == 0:
            return positions

        # Use random seed for organic jitter
        np.random.seed(123)

        if count == 1:
            # Single element: place at center with small jitter
            jitter = np.random.uniform(-0.05, 0.05, 2)
            positions[elements[0]] = center + np.array([jitter[0], jitter[1], 0])

        elif count == 2:
            # Two elements: horizontal or vertical based on region
            positions[elements[0]] = center + UP * 0.45 + np.array([np.random.uniform(-0.08, 0.08), 0, 0])
            positions[elements[1]] = center + DOWN * 0.45 + np.array([np.random.uniform(-0.08, 0.08), 0, 0])

        elif count == 3:
            # Three elements: triangle formation
            angles = [PI/2, PI/2 + 2*PI/3, PI/2 + 4*PI/3]  # Top, bottom-left, bottom-right
            for i, elem in enumerate(elements):
                pos = center + np.array([
                    radius * 0.7 * np.cos(angles[i]),
                    radius * 0.7 * np.sin(angles[i]),
                    0
                ])
                # Add small organic jitter
                jitter = np.random.uniform(-0.06, 0.06, 2)
                positions[elem] = pos + np.array([jitter[0], jitter[1], 0])

        elif count == 4:
            # Four elements: diamond/square formation
            angles = [PI/4, 3*PI/4, 5*PI/4, 7*PI/4]  # Four corners
            for i, elem in enumerate(elements):
                pos = center + np.array([
                    radius * 0.8 * np.cos(angles[i]),
                    radius * 0.8 * np.sin(angles[i]),
                    0
                ])
                jitter = np.random.uniform(-0.06, 0.06, 2)
                positions[elem] = pos + np.array([jitter[0], jitter[1], 0])

        elif count == 5:
            # Five elements: IMPROVED pentagon formation (not vertical stack!)
            if use_tight_packing:
                # Tight pentagon for intersection region
                angles = [PI/2 + i * TAU / 5 for i in range(5)]  # Pentagon
                for i, elem in enumerate(elements):
                    pos = center + np.array([
                        radius * 0.75 * np.cos(angles[i]),  # Slightly smaller radius
                        radius * 0.75 * np.sin(angles[i]),
                        0
                    ])
                    # Smaller jitter for tight packing
                    jitter = np.random.uniform(-0.04, 0.04, 2)
                    positions[elem] = pos + np.array([jitter[0], jitter[1], 0])
            else:
                # Regular pentagon with more spread
                angles = [PI/2 + i * TAU / 5 for i in range(5)]
                for i, elem in enumerate(elements):
                    pos = center + np.array([
                        radius * spread_factor * np.cos(angles[i]),
                        radius * spread_factor * np.sin(angles[i]),
                        0
                    ])
                    jitter = np.random.uniform(-0.06, 0.06, 2)
                    positions[elem] = pos + np.array([jitter[0], jitter[1], 0])

        else:
            # Large group (6+): circular layout with adaptive spacing
            for i, elem in enumerate(elements):
                angle = i * TAU / count - PI/2  # Start from top
                # Adaptive radius based on count
                adaptive_radius = radius * spread_factor * (1 + 0.1 * (count - 5) / 5)
                pos = center + np.array([
                    adaptive_radius * np.cos(angle),
                    adaptive_radius * np.sin(angle),
                    0
                ])
                # Organic jitter
                jitter = np.random.uniform(-0.05, 0.05, 2)
                positions[elem] = pos + np.array([jitter[0], jitter[1], 0])

        return positions

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
